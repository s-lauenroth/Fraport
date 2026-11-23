/* eslint-disable */
/**
 * Shared helpers for Fraport import parsers (bundled into each parser by esbuild).
 *
 * Source markup notes:
 * - Images are <frach-e-lazy-image src srcset alt> custom elements (no inner <img> in the
 *   static DOM); some pages use plain <img data-src>.
 * - The importer's preProcess removes inline elements without text before parsers run,
 *   e.g. a.frach-m-image__link that only wraps a lazy image. The frach-m-image component
 *   keeps the image path / link target in its data-cmp-data-layer JSON, used as fallback.
 * - frach-e-icon elements are decorative (their <noscript> holds an icon <img>).
 */

export const BASE = 'https://www.fraport.com';
const PLACEHOLDER = /^data:|blank\.gif|placeholder|spacer\.gif|transparent\.(gif|png)|^about:/i;

/**
 * Collapse whitespace. Also drops markup that leaks into textContent on live pages: a
 * frach-e-icon's <noscript> holds `<img src=… alt="frach-icon-…">` as TEXT once JS runs.
 */
export function clean(text) {
  // a whitespace run holding a real space / line break collapses to one space; a lone &nbsp;
  // (e.g. "65,20&nbsp;€", "10&nbsp;%") is kept so the value does not wrap
  return (text || '').replace(/<\/?[a-z][^>]*>/gi, ' ').replace(/\s*[ \t\n\r\f\v]\s*/g, ' ').trim();
}

const INLINE_KEEP = new Set(['STRONG', 'EM', 'BR', 'A', 'SUP', 'SUB', 'U', 'CODE']);
const INLINE_MAP = { B: 'strong', I: 'em' };
const INLINE_DROP = 'noscript, script, style, frach-e-icon, svg, button, input, img, frach-e-lazy-image, picture';

/**
 * Inline content of a source element (heading, caption, copy) as new nodes: keeps <strong>/<b>,
 * <em>/<i>, <br>, links (absolute href), <sup>/<sub>; unwraps every other element; collapses
 * whitespace (a lone &nbsp; is kept); trims the ends (also leading / trailing <br>).
 */
export function inlineNodes(document, el) {
  if (!el) return [];
  const out = document.createElement('span');
  const copy = (src, dest) => {
    [...src.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const t = n.textContent.replace(/\s*[ \t\n\r\f\v]\s*/g, ' ');
        if (t) dest.append(document.createTextNode(t));
        return;
      }
      if (n.nodeType !== 1 || n.matches(INLINE_DROP)) return;
      const tag = INLINE_MAP[n.tagName] || (INLINE_KEEP.has(n.tagName) ? n.tagName.toLowerCase() : null);
      if (!tag) { copy(n, dest); return; }
      if (tag === 'br') { dest.append(document.createElement('br')); return; }
      const e = document.createElement(tag);
      if (tag === 'a') {
        const href = n.getAttribute('href');
        if (!href) { copy(n, dest); return; }
        e.setAttribute('href', absUrl(href));
        if (n.getAttribute('target') === '_blank') e.setAttribute('target', '_blank');
      }
      copy(n, e);
      if (e.textContent.trim() || e.querySelector('br')) dest.append(e);
    });
  };
  copy(el, out);
  // merge adjacent text nodes, then trim the ends (leading / trailing <br> and whitespace)
  out.normalize();
  const trimEnd = (first) => {
    let n = first ? out.firstChild : out.lastChild;
    while (n) {
      if (n.nodeName === 'BR') { const next = first ? n.nextSibling : n.previousSibling; n.remove(); n = next; continue; }
      if (n.nodeType === 3) {
        const t = first ? n.textContent.replace(/^[ \t\n\r\f\v]+/, '') : n.textContent.replace(/[ \t\n\r\f\v]+$/, '');
        if (!t.trim()) { const next = first ? n.nextSibling : n.previousSibling; n.remove(); n = next; continue; }
        n.textContent = t;
      }
      break;
    }
  };
  trimEnd(true);
  trimEnd(false);
  return [...out.childNodes];
}

/** New heading (h1-h6) with the source element's inline content (strong, br, links kept). */
export function headingFrom(document, src, level) {
  const tag = level || (/^H[1-6]$/.test(src.tagName) ? src.tagName.toLowerCase() : 'h3');
  const h = document.createElement(tag);
  h.append(...inlineNodes(document, src));
  return h;
}

/** New paragraph with the source element's inline content (strong, em, br, links kept). */
export function paraFrom(document, src) {
  const p = document.createElement('p');
  p.append(...inlineNodes(document, src));
  return p;
}

/**
 * Source button style of a link: frach-e-button--primary / --secondary / --tertiary (the
 * accent text button with arrow). '' for plain links and button chrome without a modifier
 * (play buttons, icon-only controls).
 */
export function buttonStyle(a) {
  const cls = (a && a.getAttribute && a.getAttribute('class')) || '';
  if (!/(^|\s)frach-e-button(\s|$)/.test(cls) || /frach-e-button--icon-only/.test(cls)) return '';
  const m = cls.match(/frach-e-button--(primary|secondary|tertiary)/);
  return m ? m[1] : '';
}

/**
 * Wrap a link the way scripts.js decorateButtons reads it: <strong> = primary,
 * <em> = secondary, <strong><em> = accent (source tertiary / text arrow button).
 */
export function wrapButton(document, node, style) {
  if (style === 'primary') { const s = document.createElement('strong'); s.append(node); return s; }
  if (style === 'secondary') { const e = document.createElement('em'); e.append(node); return e; }
  if (style === 'tertiary') {
    const s = document.createElement('strong');
    const e = document.createElement('em');
    e.append(node);
    s.append(e);
    return s;
  }
  return node;
}

/**
 * Source buttons kept in place inside rich text (a.frach-e-button with a label and a real
 * target): the label becomes the link text and the link is wrapped per its button style.
 * The anchor itself is kept (with its class) so linkParagraph can still read the style.
 */
export function styleButtons(document, root, opts = {}) {
  if (!root || !root.querySelectorAll) return root;
  root.querySelectorAll('a[href]').forEach((a) => {
    const style = buttonStyle(a);
    if (!style) return;
    if (opts.skip && a.closest(opts.skip)) return;
    const href = (a.getAttribute('href') || '').trim();
    if (!href || href === '#' || /^javascript:/i.test(href)) return;
    if (a.parentElement && a.parentElement.closest('strong, em, b, i')) return;
    const label = a.querySelector('.frach-e-button__label');
    const text = clean((label || a).textContent);
    if (!text) return;
    a.textContent = text;
    const marker = document.createElement('span');
    a.replaceWith(marker);
    let wrapped = wrapButton(document, a, style);
    // default content: a button directly in a container (frach-m-text__buttons) gets its own
    // paragraph, so decorateButtons sees one link per paragraph
    if (opts.paragraph && marker.parentElement && !marker.parentElement.closest('p, li, h1, h2, h3, h4, h5, h6, td, th')) {
      wrapped = para(document, wrapped);
    }
    marker.replaceWith(wrapped);
  });
  return root;
}

export function absUrl(u) {
  if (!u) return '';
  const s = u.trim();
  if (/^(mailto:|tel:|javascript:|#)/i.test(s)) return s;
  try { return new URL(s, BASE).href; } catch (e) { return s; }
}

/**
 * The importer drops <iframe> elements before parsers run; the cleanup transformer records each
 * one's src/title on its parent as data-excat-iframes. Put them back inside `root` (itself
 * included) so a parser can read them as iframes again.
 */
export function restoreIframes(document, root) {
  if (!root || !root.querySelectorAll) return;
  const holders = [...(root.matches && root.matches('[data-excat-iframes]') ? [root] : []),
    ...root.querySelectorAll('[data-excat-iframes]')];
  holders.forEach((holder) => {
    let list = [];
    try { list = JSON.parse(holder.getAttribute('data-excat-iframes') || '[]'); } catch (e) { list = []; }
    holder.removeAttribute('data-excat-iframes');
    list.forEach(({ src, title }) => {
      if (!src) return;
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', src);
      if (title) iframe.setAttribute('title', title);
      holder.appendChild(iframe);
    });
  });
}

/** Root component: element itself when it matches, else its first matching descendant. */
export function findRoot(element, selector) {
  if (element.matches && element.matches(selector)) return element;
  return element.querySelector(selector) || element;
}

/** Best real image URL of an img / lazy-image / source element (skips lazy placeholders). */
export function bestSrc(el) {
  if (!el || !el.getAttribute) return '';
  for (const c of [el.getAttribute('src'), el.getAttribute('data-src'), el.getAttribute('data-lazy-src')]) {
    if (c && c.trim() && !PLACEHOLDER.test(c.trim())) return c.trim();
  }
  const ss = el.getAttribute('srcset') || el.getAttribute('data-srcset');
  if (ss) {
    const list = ss.split(',').map((s) => s.trim().split(/\s+/)[0]).filter((s) => s && !PLACEHOLDER.test(s));
    if (list.length) return list[list.length - 1];
  }
  return '';
}

/** Parsed data-cmp-data-layer entry of an AEM component (first value), or null. */
export function dataLayer(el) {
  const raw = el && el.getAttribute && el.getAttribute('data-cmp-data-layer');
  if (!raw) return null;
  try { return Object.values(JSON.parse(raw))[0] || null; } catch (e) { return null; }
}

export function createImg(document, src, alt) {
  const img = document.createElement('img');
  img.setAttribute('src', absUrl(src));
  // some DAM alt texts hold rich-text markup ("<p>&nbsp; &nbsp;</p>"): keep only the words
  const text = clean((alt || '').replace(/&nbsp;|&#160;/gi, ' ').replace(/\u00a0/g, ' '));
  if (text) img.setAttribute('alt', text);
  return img;
}

/**
 * Build an <img> for the first image in scope (img / frach-e-lazy-image), falling back to
 * the frach-m-image data layer when the lazy image was stripped. Returns null when none.
 */
export function makeImage(document, scope) {
  if (!scope) return null;
  const node = scope.matches && scope.matches('img, frach-e-lazy-image')
    ? scope : scope.querySelector('frach-e-lazy-image, img:not(.ff_preview)');
  if (node) {
    const inner = node.tagName === 'IMG' ? null : node.querySelector('img');
    const src = bestSrc(node) || bestSrc(inner);
    const alt = node.getAttribute('alt') || (inner && inner.getAttribute('alt')) || '';
    if (src) return createImg(document, src, alt);
  }
  const comp = scope.matches && scope.matches('frach-m-image') ? scope : scope.querySelector('frach-m-image');
  const dl = dataLayer(comp);
  const path = dl && dl.image && dl.image['repo:path'];
  if (path) return createImg(document, path, '');
  const video = scope.querySelector && scope.querySelector('video[poster]');
  if (video) return createImg(document, video.getAttribute('poster'), '');
  return null;
}

/** All images in scope, in document order (one per lazy image / img). */
export function makeImages(document, scope) {
  return [...scope.querySelectorAll('frach-e-lazy-image, img:not(.ff_preview)')]
    .filter((n) => !(n.tagName === 'IMG' && n.closest('frach-e-lazy-image, noscript, frach-e-icon')))
    .map((n) => makeImage(document, n))
    .filter(Boolean);
}

/** Link target of an image component (anchor or data-layer xdm:linkURL). */
export function imageLink(scope) {
  if (!scope) return '';
  const a = scope.querySelector('a.frach-m-image__link[href], figure a[href]');
  if (a) return a.getAttribute('href');
  const comp = scope.matches && scope.matches('frach-m-image') ? scope : scope.querySelector('frach-m-image');
  const dl = dataLayer(comp);
  return (dl && dl['xdm:linkURL']) || '';
}

export function para(document, ...children) {
  const p = document.createElement('p');
  children.filter(Boolean).forEach((c) => p.append(c));
  return p;
}

export function link(document, href, text) {
  const a = document.createElement('a');
  a.setAttribute('href', absUrl(href));
  a.textContent = clean(text) || absUrl(href);
  return a;
}

/**
 * Make rich (moved) content importable in place: lazy images -> <img>, drop icons /
 * noscript / form chrome, absolute image URLs and hrefs, data-layer image fallback.
 */
export function normalizeContent(document, root) {
  root.querySelectorAll('noscript, frach-e-icon, script, style, button.frach-e-button--icon-only').forEach((n) => n.remove());
  root.querySelectorAll('frach-e-lazy-image').forEach((lazy) => {
    const img = makeImage(document, lazy);
    if (img) lazy.replaceWith(img); else lazy.remove();
  });
  root.querySelectorAll('img').forEach((img) => {
    const src = bestSrc(img);
    if (src) img.setAttribute('src', absUrl(src));
    ['data-src', 'srcset', 'data-srcset', 'sizes'].forEach((a) => img.removeAttribute(a));
  });
  root.querySelectorAll('frach-m-image').forEach((comp) => {
    if (comp.querySelector('img')) return;
    const img = makeImage(document, comp);
    if (img) comp.append(img);
  });
  root.querySelectorAll('a[href]').forEach((a) => a.setAttribute('href', absUrl(a.getAttribute('href'))));
  styleButtons(document, root);
  return root;
}

/**
 * frach-m-text-media component parts: its headline (h3.frach-m-text-media__headline, a sibling
 * of the media and text columns), media column, text column, and whether the media comes first.
 */
export function textMediaParts(tm) {
  const row = tm.querySelector('.frach-m-text-media__row') || tm;
  const headline = tm.querySelector('.frach-m-text-media__headline')
    || [...row.children].find((c) => /^H[1-6]$/.test(c.tagName));
  const media = tm.querySelector('.frach-m-text-media__media');
  const text = tm.querySelector('.frach-m-text-media__text');
  const mediaFirst = !text || !media || !!(media.compareDocumentPosition(text) & 4);
  return { headline: headline && clean(headline.textContent) ? headline : null, media, text, mediaFirst };
}

const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|PRE|DIV|SECTION|FIGURE|ADDRESS|DL|HR)$/;

/**
 * Text content of a text component as a list of block-level elements (moved out of the
 * source). Loose inline nodes are wrapped into <p>. Includes the CTA buttons of a
 * frach-m-text (frach-m-text__buttons) as paragraphs of links.
 */
export function textContent(document, container) {
  if (!container) return [];
  const rte = container.matches && container.matches('.cmp-text') ? container
    : (container.querySelector('.cmp-text') || container.querySelector('.frach-m-text__rte-wrapper') || container);
  normalizeContent(document, rte);
  const out = [];
  let loose = null;
  [...rte.childNodes].forEach((n) => {
    if (n.nodeType === 3 && !n.textContent.trim()) return;
    if (n.nodeType === 1 && BLOCK_TAGS.test(n.tagName)) {
      loose = null;
      if (n.tagName === 'DIV' || n.tagName === 'SECTION') {
        if (clean(n.textContent) || n.querySelector('img, table, iframe')) out.push(n);
      } else if (n.tagName === 'P' && !clean(n.textContent) && !n.querySelector('img')) {
        // empty paragraph: skip
      } else out.push(n);
      return;
    }
    if (n.nodeType !== 1 && n.nodeType !== 3) return;
    // consecutive standalone links (e.g. phone + mail) each get their own paragraph; a styled
    // button (<strong>/<em> around one link) is always a paragraph of its own
    const isButton = n.nodeType === 1 && /^(STRONG|EM)$/.test(n.tagName) && n.querySelector('a.frach-e-button')
      && clean(n.textContent) === clean(n.querySelector('a').textContent);
    if (loose && n.nodeType === 1 && (n.tagName === 'A' || isButton) && loose.querySelector('a')) loose = null;
    if (loose && isButton && clean(loose.textContent)) loose = null;
    if (!loose) { loose = document.createElement('p'); out.push(loose); }
    loose.append(n);
    if (isButton) loose = null;
  });
  const buttons = container.querySelector && container.querySelector('.frach-m-text__buttons');
  if (buttons && !rte.contains(buttons)) out.push(...buttonLinks(document, buttons));
  return out.filter((n) => clean(n.textContent) || (n.querySelector && n.querySelector('img, table, iframe')));
}

/**
 * One source link / button as <p><a></a></p>, wrapped per its source button style
 * (primary <strong>, secondary <em>, tertiary <strong><em>; see buttonStyle / wrapButton).
 */
export function linkParagraph(document, a) {
  const label = a.querySelector('.frach-e-button__label') || a;
  const l = link(document, a.getAttribute('href'), label.textContent);
  if (a.getAttribute('target') === '_blank') l.setAttribute('target', '_blank');
  const href = (a.getAttribute('href') || '').trim();
  const style = href && href !== '#' && !/^javascript:/i.test(href) ? buttonStyle(a) : '';
  return para(document, wrapButton(document, l, style));
}

/** CTA links of a buttons container as link paragraphs. */
export function buttonLinks(document, scope) {
  if (!scope) return [];
  return [...scope.querySelectorAll('a[href]')].filter((a) => clean(a.textContent)).map((a) => linkParagraph(document, a));
}

/** Grid columns that are direct children of a frach-grid-row. */
export function gridColumns(row) {
  if (!row) return [];
  return [...row.children].filter((c) => /(^|\s)frach-grid-col-/.test(c.className || ''));
}

/**
 * Card content of a grid column holding frach-m-image + frach-m-text: [picture paragraph,
 * ...text elements]. When the heading has no link, the image link (anchor or data layer)
 * becomes the heading link, so the card keeps its target after the importer strips
 * the empty image anchor.
 */
export function imageTextCard(document, col) {
  // linked card components (image + theme + headline inside one anchor)
  const cards = [...col.querySelectorAll('.frach-m-card')];
  if (cards.length) return cards.flatMap((card) => cardComponent(document, card));
  const cell = [];
  const imageComp = col.querySelector('frach-m-image') || col;
  const img = makeImage(document, imageComp);
  const target = imageLink(imageComp);
  const textComp = col.querySelector('.frach-m-text, .cmp-text');
  const texts = textComp ? textContent(document, textComp) : [];
  if (img) cell.push(para(document, img));
  const cap = imageComp.querySelector && imageComp.querySelector('figcaption, .frach-m-image__caption');
  if (cap && clean(cap.textContent)) cell.push(para(document, document.createTextNode(clean(cap.textContent))));
  const heading = texts.find((n) => /^H[1-6]$/.test(n.tagName));
  if (heading && !heading.querySelector('a') && target) {
    const a = document.createElement('a');
    a.setAttribute('href', absUrl(target));
    a.append(...heading.childNodes);
    heading.append(a);
  }
  cell.push(...texts);
  return cell;
}

const RICH_TAGS = 'p, h1, h2, h3, h4, h5, h6, ul, ol, table, blockquote, pre, dl, address';

/**
 * Top-most rich elements (paragraphs, headings, lists, tables) of a container, normalized,
 * plus CTA buttons (a.frach-e-button outside those) as link paragraphs.
 */
export function richContent(document, root) {
  if (!root) return [];
  normalizeContent(document, root);
  const out = [];
  const walk = (node) => {
    [...node.children].forEach((c) => {
      if (c.matches(RICH_TAGS)) {
        if (clean(c.textContent) || c.querySelector('img')) out.push(c);
      } else if (c.tagName === 'IMG') {
        out.push(para(document, c));
      } else if (c.matches('a[href]') && clean(c.textContent)) {
        out.push(linkParagraph(document, c));
      } else walk(c);
    });
  };
  walk(root);
  return out;
}

/** frach-m-image component -> [picture paragraph (linked when the image links), caption paragraph]. */
export function imageComponent(document, comp) {
  const img = makeImage(document, comp);
  if (!img) return [];
  const href = imageLink(comp);
  let media = img;
  if (href && href !== '#' && !/^javascript:/i.test(href)) {
    media = document.createElement('a');
    media.setAttribute('href', absUrl(href));
    media.append(img);
  }
  const out = [para(document, media)];
  const cap = comp.querySelector('figcaption, .frach-m-image__caption');
  if (cap && clean(cap.textContent)) {
    const p = para(document, document.createTextNode(clean(cap.textContent)));
    p.dataset.caption = 'true';
    out.push(p);
  }
  return out;
}

/** frach-m-card (linked image card) -> [picture, meta paragraphs, linked heading]. */
export function cardComponent(document, card) {
  const out = [];
  const a = card.querySelector('a.frach-m-card__link[href], a[href]');
  const img = makeImage(document, card.querySelector('.frach-m-card__image-wrapper') || card);
  if (img) out.push(para(document, img));
  card.querySelectorAll('.frach-m-card__meta p, .frach-m-card__meta .frach-m-teaser__theme').forEach((m) => {
    if (clean(m.textContent)) out.push(para(document, document.createTextNode(clean(m.textContent).replace(/\s+,/g, ','))));
  });
  const h = card.querySelector('h1, h2, h3, h4, h5, h6');
  if (h) {
    const heading = document.createElement(h.tagName.toLowerCase());
    if (a) {
      const l = link(document, a.getAttribute('href'), h.textContent);
      // keep the headline's inline formatting (<strong>, <br>) inside the card link
      const inner = inlineNodes(document, h).filter((n) => n.nodeName !== 'A');
      if (inner.length && !h.querySelector('a')) l.replaceChildren(...inner);
      heading.append(l);
    } else heading.append(...inlineNodes(document, h));
    out.push(heading);
  }
  card.querySelectorAll('.frach-m-card__text > p, .frach-m-card__description').forEach((p) => {
    if (clean(p.textContent)) out.push(paraFrom(document, p));
  });
  return out;
}

const SKIP = 'noscript, script, style, .frach-m-media-lightbox, .frach-m-overlay, .frach-js-overlay, button, input, frach-e-icon, .frach-m-slider__controls';

/**
 * Content of a grid column / panel: walks AEM components in document order and returns
 * block-level elements (image paragraphs, text, cards, link lists, tables).
 */
export function componentContent(document, scope) {
  const out = [];
  if (!scope) return out;
  const visit = (node) => {
    [...node.children].forEach((c) => {
      if (c.matches(SKIP)) return;
      if (c.matches('frach-m-text-media, .frach-m-text-media')) {
        const { headline, media, text, mediaFirst } = textMediaParts(c);
        const h = headline ? headingFrom(document, headline) : null;
        const m = media ? visitInto(media) : [];
        const t = text ? textContent(document, text.querySelector('.frach-m-text') || text) : [];
        // the component headline spans the row above media and text (source order)
        if (h) out.push(h);
        out.push(...(mediaFirst ? [...m, ...t] : [...t, ...m]));
        return;
      }
      if (c.matches('frach-m-image')) { out.push(...imageComponent(document, c)); return; }
      if (c.matches('.frach-m-text')) { out.push(...textContent(document, c)); return; }
      if (c.matches('.cmp-text')) { out.push(...textContent(document, c)); return; }
      if (c.matches('.frach-m-card')) { out.push(...cardComponent(document, c)); return; }
      if (c.matches('frach-e-lazy-image, img')) { const img = makeImage(document, c); if (img) out.push(para(document, img)); return; }
      if (c.matches('iframe[src]')) { out.push(para(document, link(document, c.getAttribute('src'), c.getAttribute('src')))); return; }
      if (c.matches('.frach-m-download-list')) { const ul = downloadList(document, c); if (ul) out.push(ul); return; }
      if (c.matches('.frach-m-contact')) {
        const img = makeImage(document, c);
        if (img) out.push(para(document, img));
        const info = c.querySelector('address, .frach-m-contact__info');
        out.push(...textContent(document, info || c));
        return;
      }
      if (c.matches(`.frach-m-link-box, .frach-m-contact, ${RICH_TAGS}`)) {
        if (c.matches(RICH_TAGS)) { normalizeContent(document, c); if (clean(c.textContent) || c.querySelector('img')) out.push(c); return; }
        out.push(...richContent(document, c));
        return;
      }
      if (c.matches('a[href]') && clean(c.textContent) && !c.querySelector('div, p, h1, h2, h3, h4, h5, h6, img, frach-e-lazy-image')) {
        out.push(linkParagraph(document, c));
        return;
      }
      visit(c);
    });
  };
  const visitInto = (node) => {
    const saved = out.length;
    visit(node);
    return out.splice(saved);
  };
  visit(scope);
  return out;
}

/**
 * frach-m-download-list -> <ul>, one <li> per file: <a href>file name</a><br>meta
 * ("PDF, 879 KB"), the shape the downloads / columns-sidebar blocks read.
 */
export function downloadList(document, dl) {
  const items = [...dl.querySelectorAll('li.frach-m-download-list__item, li')]
    .filter((li) => li.querySelector('a[href]'));
  const ul = document.createElement('ul');
  const seen = new Set();
  items.forEach((item) => {
    if (seen.has(item.parentElement && item.parentElement.closest('li.frach-m-download-list__item'))) return;
    seen.add(item);
    const a = item.querySelector('a[href]');
    const nameEl = item.querySelector('.frach-m-download-list__file-name') || a;
    const name = clean(nameEl.textContent);
    if (!name) return;
    const li = document.createElement('li');
    li.append(link(document, a.getAttribute('href'), name));
    const metaEl = item.querySelector('.frach-m-download-list__meta-info');
    const meta = metaEl ? clean(metaEl.textContent) : '';
    if (meta) li.append(document.createElement('br'), document.createTextNode(meta));
    ul.append(li);
  });
  return ul.children.length ? ul : null;
}

/** Page language from the document / URL ('de' default). */
export function pageLang(document, params) {
  const lang = (document.documentElement && document.documentElement.getAttribute('lang')) || '';
  if (lang) return lang.slice(0, 2).toLowerCase();
  const url = (params && params.originalURL) || '';
  return url.includes('/en/') ? 'en' : 'de';
}

/**
 * Displayed value of a frach-e-animated-number (value, fraction-digits, prefix, suffix,
 * currency): the rendered text when the live page already counted up, otherwise the value
 * formatted like the source (de: 120.698.214 / 65,20 €).
 */
export function animatedNumber(el, lang) {
  if (!el) return '';
  const rendered = clean(el.textContent);
  if (rendered && /\d/.test(rendered)) return rendered;
  const raw = parseFloat(el.getAttribute('value'));
  if (Number.isNaN(raw)) return clean(el.getAttribute('value'));
  const fdAttr = el.getAttribute('fraction-digits');
  const fd = fdAttr != null && fdAttr !== '' ? parseInt(fdAttr, 10)
    : (el.getAttribute('currency') ? 2 : (String(el.getAttribute('value')).match(/\.(\d*[1-9])/) || ['', ''])[1].length);
  let num;
  try {
    num = raw.toLocaleString(lang === 'en' ? 'en-US' : 'de-DE', { minimumFractionDigits: fd, maximumFractionDigits: fd });
  } catch (e) { num = raw.toFixed(fd); }
  const prefix = clean(el.getAttribute('prefix') || '');
  const CURRENCY = { EUR: '€', USD: '$', GBP: '£' };
  const cur = el.getAttribute('currency') || '';
  const suffix = clean(el.getAttribute('suffix') || CURRENCY[cur] || cur);
  const sep = (s) => (s && !/^[%‰]/.test(s) ? ' ' : '');
  // "ca. 67%", "rd. 17.000" (word / abbreviation prefixes get a space; ">90%" does not)
  return `${prefix}${prefix && /[\p{L}.]$/u.test(prefix) ? ' ' : ''}${num}${suffix ? sep(suffix) + suffix : ''}`;
}
