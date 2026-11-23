/* eslint-disable */
/* global WebImporter */
import CATALOG_IFRAMES from '../utils/fraport-iframes.js';
import MIGRATED_PAGES from '../utils/fraport-pages.js';

const SITE_ORIGIN = 'https://www.fraport.com';

/**
 * Fraport cleanup transformer.
 *
 * beforeTransform: removals only.
 *   1. Replay template.pageCleanup for the current page (ordered selectors;
 *      a selector is applied only when it matches exactly one element).
 *   2. On pages NOT listed in pageCleanup, apply the catalog cleanup rules
 *      (embedded from migration-work/catalog-template.json cleanup.rules[]),
 *      but only to elements outside main / #main-content.
 *
 * afterTransform: site chrome removal (header, footer, chat widget, skip
 * links, noscript/script/style/link, tracking pixels, leftover cookie /
 * overlay chrome, tracking attributes) and collapse of empty sections.
 * HTML comments are never touched (XWalk field hints).
 */

// Embedded from migration-work/catalog-template.json -> cleanup.rules[]
const CATALOG_RULES = [
  '[id*="usercentrics"]',
  'body [class*="overlay"]:not(nav *)',
  '[role="dialog"]',
];

const CHROME_SELECTORS = [
  'frach-m-sticky-page-header-container',
  'frach-m-page-header',
  'frach-m-page-footer',
  '#moin-ai-container',
  // date-picker popup the form script appends to <body> (month / weekday / day grid)
  '.flatpickr-calendar',
  // article meta data reading-time item ("{} min Lesezeit"), display: none on the source
  '.frach-m-page-meta-data__detail',
  '.frach-e-skip-link',
  'a[href="#main-content"]',
  'noscript',
  'script',
  'style',
  'link',
  // leftover cookie / overlay chrome
  '[id*="usercentrics"]',
  '[data-usercentrics]',
  '[role="dialog"]',
];

// Marks a table that came from the source page (not one a parser built).
const RAW_TABLE_ATTR = 'data-excat-raw-table';
// Holds the iframes (src, title) of an element, recorded before the importer removes them.
const IFRAMES_ATTR = 'data-excat-iframes';
// Holds the lazy image ({ src, alt }) of an image link, recorded before the importer drops it.
const LINKED_IMG_ATTR = 'data-excat-linked-img';

const TRACKING_ATTRS = ['data-cmp-data-layer', 'data-cmp-clickable', 'data-track', 'data-tracking', 'data-analytics'];

const TRACKER_SRC = /(facebook\.com\/tr|doubleclick\.net|google-analytics\.com|googletagmanager\.com|bat\.bing\.com|px\.ads\.linkedin\.com|adobedtm\.com|demdex\.net|omtrdc\.net|\/b\/ss\/)/i;

function normalizeUrl(u) {
  if (!u) return null;
  try {
    const url = new URL(u);
    return `${url.origin}${url.pathname}`.replace(/\/+$/, '');
  } catch (e) {
    return null;
  }
}

function getPageUrl(payload, document) {
  const params = (payload && payload.params) || {};
  return normalizeUrl(params.originalURL)
    || normalizeUrl(payload && payload.url)
    || normalizeUrl(document && document.URL);
}

function findPageCleanup(template, pageUrl) {
  const map = template && template.pageCleanup;
  if (!map || !pageUrl) return null;
  const key = Object.keys(map).find((k) => normalizeUrl(k) === pageUrl);
  return key ? map[key] : null;
}

function safeQueryAll(root, selector) {
  try {
    return Array.from(root.querySelectorAll(selector));
  } catch (e) {
    return [];
  }
}

function isInsideMain(el) {
  return !!(el.closest && el.closest('main, #main-content'));
}

function isTrackingPixel(img) {
  const w = img.getAttribute('width');
  const h = img.getAttribute('height');
  const src = img.getAttribute('src') || '';
  if ((w === '1' || w === '0') && (h === '1' || h === '0')) return true;
  return TRACKER_SRC.test(src);
}

const CONTENT_TAGS = new Set(['IMG', 'PICTURE', 'VIDEO', 'IFRAME', 'TABLE', 'SVG', 'AUDIO', 'OBJECT', 'EMBED']);

/** Remove <hr> section breaks that would open empty sections. */
function collapseEmptySections(document) {
  const body = document.body;
  if (!body) return;
  const walker = document.createTreeWalker(body, 1 | 4); // ELEMENT | TEXT
  const toRemove = [];
  let seenContent = false;
  let lastHr = null;
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === 3) {
      if (node.textContent.trim()) seenContent = true;
    } else if (node.tagName === 'HR') {
      if (!seenContent) toRemove.push(node);
      else lastHr = node;
      seenContent = false;
    } else if (CONTENT_TAGS.has(node.tagName.toUpperCase())) {
      seenContent = true;
    }
    node = walker.nextNode();
  }
  if (!seenContent && lastHr) toRemove.push(lastHr);
  toRemove.forEach((hr) => hr.remove());
}

export default function transform(hookName, element, payload) {
  const document = (payload && payload.document) || element.ownerDocument;
  const root = element || document.body;

  if (hookName === 'beforeTransform') {
    // Mark the source page's own tables (an attribute survives the importer re-creating the body;
    // it changes no catalog selector). Parsers build new tables for blocks, so a table still marked
    // after parsing is authored content, which afterTransform turns into a table-data block.
    safeQueryAll(document, 'table').forEach((t) => t.setAttribute(RAW_TABLE_ATTR, ''));
    // A lazy image wrapped in a link (frach-m-image__link, e.g. the "#" zoom-lightbox opener) is
    // dropped by the importer and only the empty link is left in default content. Record the image
    // on the link (attributes survive); afterTransform puts it back. Parsers build their own images.
    // (The lazy image may already be gone here; the frach-m-image data layer still names the image.)
    safeQueryAll(document, 'a.frach-m-image__link').forEach((a) => {
      const lazy = a.querySelector('frach-e-lazy-image, img');
      let src = lazy && (lazy.getAttribute('src') || lazy.getAttribute('data-src'));
      let alt = (lazy && lazy.getAttribute('alt')) || '';
      if (!src) {
        const comp = a.closest('frach-m-image');
        let dl = null;
        try { dl = Object.values(JSON.parse(comp.getAttribute('data-cmp-data-layer')))[0]; } catch (e) { dl = null; }
        const path = dl && ((dl.image && dl.image['repo:path']) || dl['dc:description']);
        if (path && /^\/content\/dam\/.+\.(jpe?g|png|gif|webp|svg)$/i.test(path)) {
          src = path;
          alt = alt || dl['dc:title'] || '';
        }
      }
      if (src) a.setAttribute(LINKED_IMG_ATTR, JSON.stringify({ src, alt }));
    });
    const template = payload && payload.template;
    const pageUrl = getPageUrl(payload, document);
    // Usercentrics swaps consented iframes for placeholders that keep no src. Put the catalog
    // capture's iframe back in each placeholder's place (one element for one, so selectors hold).
    // A YouTube placeholder names its video in the poster URL; any other placeholder takes the
    // next unused captured iframe of the service it names (walls.io, Terminland, ...), else the
    // next unused one.
    const unused = (CATALOG_IFRAMES[pageUrl] || []).filter((f) => f.src);
    const take = (test) => {
      const i = unused.findIndex(test);
      return i < 0 ? null : unused.splice(i, 1)[0];
    };
    safeQueryAll(document, '.uc-embedding-container').forEach((el) => {
      const poster = el.querySelector('img[src*="/video/youtube/"]');
      const ytId = poster && (poster.getAttribute('src').match(/\/video\/youtube\/([\w-]+?)-poster/) || [])[1];
      let frame = null;
      if (ytId) {
        frame = take((f) => f.src.includes(ytId)) || { src: `https://www.youtube-nocookie.com/embed/${ytId}`, title: '' };
      } else {
        const text = (el.textContent || '').toLowerCase();
        frame = take((f) => {
          try { return text.includes(new URL(f.src).host.replace(/^(www|my|app|static)\./, '').split('.')[0]); } catch (e) { return false; }
        }) || take(() => true);
      }
      if (!frame) return;
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', frame.src);
      if (frame.title) iframe.setAttribute('title', frame.title);
      el.replaceWith(iframe);
    });
    // The importer drops <iframe> elements between preprocess and transform. Record each one's
    // src and title on its parent (attributes survive) so parsers can restore them.
    safeQueryAll(document, 'iframe').forEach((f) => {
      const src = f.getAttribute('src') || f.getAttribute('data-src') || f.getAttribute('data-url');
      const holder = f.parentElement;
      if (!src || !holder) return;
      let list = [];
      try { list = JSON.parse(holder.getAttribute(IFRAMES_ATTR) || '[]'); } catch (e) { list = []; }
      list.push({ src, title: f.getAttribute('title') || '' });
      holder.setAttribute(IFRAMES_ATTR, JSON.stringify(list));
    });
    const pageSelectors = findPageCleanup(template, pageUrl);

    if (Array.isArray(pageSelectors)) {
      // Replay recorded removals in order; skip ambiguous / missing matches.
      pageSelectors.forEach((entry) => {
        const selector = typeof entry === 'string' ? entry : entry && entry.selector;
        if (!selector) return;
        const matches = safeQueryAll(document, selector);
        if (matches.length === 1) matches[0].remove();
      });
    } else {
      // Page not recorded: apply generic catalog rules outside main only.
      CATALOG_RULES.forEach((rule) => {
        safeQueryAll(document, rule)
          .filter((el) => el.isConnected && !isInsideMain(el))
          .forEach((el) => el.remove());
      });
    }
  }

  if (hookName === 'afterTransform') {
    // A raw source table left in the content would be read as a block named after its first cell
    // (e.g. "Organisation"): wrap it as a table-data block, one row per table row.
    safeQueryAll(root, `table[${RAW_TABLE_ATTR}]`).forEach((table) => {
      if (!table.isConnected || table.parentElement?.closest(`table[${RAW_TABLE_ATTR}]`)) return;
      const cells = [...table.querySelectorAll(':scope > tr, :scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr')]
        .map((tr) => [...tr.children].filter((c) => /^(TD|TH)$/.test(c.tagName)).map((c) => {
          const div = document.createElement('div');
          div.innerHTML = c.innerHTML;
          return div;
        }))
        .filter((row) => row.length && row.some((c) => c.textContent.trim() || c.querySelector('img, a')));
      if (!cells.length) { table.remove(); return; }
      table.replaceWith(WebImporter.Blocks.createBlock(document, { name: 'table-data', cells }));
    });

    // Slider / toggle chrome left in the content by components no parser converted: prev / next
    // buttons ("Previous Slide  Next Slide"), pagination dots, and the toggle checkboxes of
    // anchor lists / accordions (a checked one is written as "[x]"). Form inputs stay.
    safeQueryAll(root, '.frach-m-slider__controls, .frach-js-slider__controls, .frach-m-slider__pagination, .frach-js-slider__pagination')
      .forEach((el) => el.remove());
    const SLIDER_LABEL = /^((previous|next) slide\s*)+$/i;
    safeQueryAll(root, 'button, p, a, span, li, div')
      .filter((el) => el.isConnected && SLIDER_LABEL.test((el.textContent || '').replace(/\s+/g, ' ').trim())
        && !el.querySelector('img, picture, video, iframe, table'))
      .forEach((el) => {
        // a link that also wraps a recorded image keeps its element (only the label goes)
        if (el.matches('a') && el.hasAttribute(LINKED_IMG_ATTR)) el.textContent = '';
        else el.remove();
      });
    safeQueryAll(root, 'input[type="checkbox"], input[type="radio"]')
      .filter((el) => !el.closest('form, .fraformsform, frach-m-form, [class*="form"]'))
      .forEach((el) => el.remove());

    // Image links whose image the importer dropped (left empty in default content): put the image
    // back, linked when the link has a real target ("#" lightbox openers become the bare image).
    safeQueryAll(root, `a[${LINKED_IMG_ATTR}]`).forEach((a) => {
      let data = null;
      try { data = JSON.parse(a.getAttribute(LINKED_IMG_ATTR)); } catch (e) { data = null; }
      a.removeAttribute(LINKED_IMG_ATTR);
      // decorative icon markup (zoom overlay icon, its noscript img) is not the image
      a.querySelectorAll('frach-e-icon, noscript, .frach-m-image__icon-overlay').forEach((n) => n.remove());
      if (!data || !data.src || a.querySelector('img, picture') || a.textContent.trim()) return;
      const img = document.createElement('img');
      img.setAttribute('src', new URL(data.src, 'https://www.fraport.com').href);
      if (data.alt) img.setAttribute('alt', data.alt);
      const href = a.getAttribute('href') || '';
      if (!href || href === '#' || /^javascript:/i.test(href)) a.replaceWith(img);
      else a.append(img);
    });

    // Consent placeholders no captured iframe replaced ("Wir benötigen Ihre Zustimmung ...").
    safeQueryAll(root, '.uc-embedding-container').forEach((el) => el.remove());
    // An iframe a parser kept in default content or another block would be dropped on save:
    // keep it as a link to its source (YouTube links render as players in the embed block).
    safeQueryAll(root, 'iframe').forEach((f) => {
      const src = f.getAttribute('src');
      if (!src) { f.remove(); return; }
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = src.replace(/^(https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]+)\?.*$/, '$1');
      a.textContent = f.getAttribute('title') || a.href;
      p.append(a);
      f.replaceWith(p);
    });

    CHROME_SELECTORS.forEach((sel) => {
      safeQueryAll(document, sel).forEach((el) => el.remove());
    });

    // Leftover overlay chrome outside main (e.g. notification overlays).
    safeQueryAll(document, 'body [class*="overlay"]:not(nav *)')
      .filter((el) => !isInsideMain(el))
      .forEach((el) => el.remove());

    // Tracking pixels.
    safeQueryAll(document, 'img').filter(isTrackingPixel).forEach((img) => img.remove());

    // Tracking attributes.
    safeQueryAll(root, '*').forEach((el) => {
      TRACKING_ATTRS.forEach((attr) => {
        if (el.hasAttribute(attr)) el.removeAttribute(attr);
      });
    });

    // Links to migrated pages become site-relative paths named like the imported documents
    // (/de/konzern), so visitors stay on the new site. Other pages, files and sites keep their URL.
    safeQueryAll(root, 'a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href)) return;
      let url;
      try { url = new URL(href, SITE_ORIGIN); } catch (e) { return; }
      if (!/^(www\.)?fraport\.com$/i.test(url.hostname)) return;
      const key = url.pathname.replace(/\.html?$/i, '').replace(/\/$/, '').toLowerCase() || '/';
      if (!MIGRATED_PAGES.has(key) || (key !== '/' && !/\.html?$/i.test(url.pathname))) return;
      const path = key === '/' ? '/' : WebImporter.FileUtils.sanitizePath(key);
      a.setAttribute('href', `${path}${url.search}${url.hash}`);
    });

    collapseEmptySections(document);
  }
}
