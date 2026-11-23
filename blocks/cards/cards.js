/**
 * cards — frach-m-card grid: 1:1 image cards (gradient veil, theme meta line, h5 title), the whole
 * card one link; 12 / 6 / 4 columns. Cards slide in from the right on scroll-in (staggered).
 *
 * Authoring: one row per card — a picture (alone in its paragraph), an optional theme paragraph,
 * a heading whose link is the card link (EW6: the href is read, the inner anchor unwrapped).
 * A `link-box` block directly after the cards block in the same section becomes the grid's last
 * column (with-link-box: full width 720-1279, 4 cols >= 1280).
 *
 * @variants block class: dated (default none) — a date paragraph (dd.mm.yyyy) becomes a floating
 *   badge over the image edge (newsroom news cards); a following `newsroom-feed` block adopts
 *   itself as the aside column.
 * @variants block class: contact — department contact cards (source frach-m-contact): 16:9 image,
 *   grey h6 name, text, one link per paragraph led by its icon (tel: phone, mailto: mail, other
 *   globe); the card is not one link; 12 / 6 / 4 columns.
 *
 * Image + text teasers (source frach-m-image + frach-m-text in a 12 / 4 grid): a card whose heading
 * is an h6 or is followed by text keeps its own layout — 16:9 image (linked to the heading target,
 * zooms on hover), the heading link led by an arrow, the text below; 3 columns >= 720.
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();

function onView(elem) {
  if (!('IntersectionObserver' in window)) {
    elem.classList.add('is-animating');
    return;
  }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add('is-animating');
      io.unobserve(en.target);
    }
  }), { threshold: 0.1 });
  io.observe(elem);
}

const DATE = /^\s*\d{1,2}\.\d{1,2}\.\d{4}\s*$/;

function buildCard(cell, dated) {
  const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
  const anchor = (heading && heading.querySelector('a')) || cell.querySelector('a');
  const link = el(anchor ? 'a' : 'div', 'cards-card-link');
  if (anchor) {
    link.href = anchor.getAttribute('href');
    if (anchor.title) link.title = anchor.title;
    if (heading) link.setAttribute('aria-label', heading.textContent);
    // EW6: unwrap the authored inner anchor (its text nodes stay in the heading)
    anchor.replaceWith(...anchor.childNodes);
  }
  link.dataset.animate = 'appear-right';
  const image = el('div', 'cards-card-image');
  const text = el('div', 'cards-card-text');
  const metaBox = el('div', 'cards-card-meta');
  const title = el('div', 'cards-card-title h5');
  const date = el('div', 'cards-card-date');
  [...cell.children].forEach((n) => {
    if (isMedia(n)) image.append(n);
    else if (dated && !date.children.length && n.tagName === 'P' && DATE.test(n.textContent)) date.append(n);
    else if (n === heading) title.append(n);
    else metaBox.append(n);
  });
  if (date.children.length) text.append(date);
  text.append(metaBox, title);
  if (image.children.length) link.append(image);
  link.append(text);
  const card = el('div', 'cards-card');
  card.append(link);
  onView(link);
  return card;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const ARROW = 'M14.29 7.29a1 1 0 0 1 1.42 0l4 4a1 1 0 0 1 0 1.42l-4 4a1 1 0 0 1-1.42-1.42L16.59 13H5'
  + 'a1 1 0 0 1 0-2h11.59l-2.3-2.29a1 1 0 0 1-.08-1.32z';

function svgEl(className) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', className);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  return svg;
}

/** decorative headline arrow (the source draws frach-icon-arrow-right before the link text) */
function arrowIcon() {
  const svg = svgEl('cards-arrow');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ARROW);
  svg.append(path);
  return svg;
}

/** contact link icon from the /icons sprite (frach-icon-phone / -mail / -globe) */
function linkIcon(name) {
  const svg = svgEl('cards-contact-icon');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `/icons/${name}.svg#frach-icon-${name}`);
  svg.append(use);
  return svg;
}

/** image + text teaser: linked 16:9 image, arrow heading link, text (all authored nodes kept) */
function buildSimpleCard(cell, heading) {
  const card = el('div', 'cards-card cards-card-simple');
  const image = el('div', 'cards-card-image');
  const text = el('div', 'cards-card-text');
  const anchor = heading.querySelector('a');
  [...cell.children].forEach((n) => {
    if (isMedia(n)) image.append(n);
    else text.append(n);
  });
  if (anchor) {
    if (!anchor.querySelector('svg')) anchor.prepend(arrowIcon());
    const pic = image.querySelector('picture, img');
    if (pic && !pic.closest('a')) {
      const link = el('a');
      link.href = anchor.getAttribute('href');
      link.tabIndex = -1;
      link.setAttribute('aria-hidden', 'true');
      pic.replaceWith(link);
      link.append(pic);
    }
  }
  if (image.children.length) card.append(image);
  card.append(text);
  return card;
}

const ICONS = { tel: 'phone', mailto: 'mail' };

/** contact option: image + body, inner links (tel/mailto/web) kept as authored, with icons */
function buildContactCard(cell) {
  const card = el('div', 'cards-card cards-contact');
  const image = el('div', 'cards-card-image');
  const text = el('address', 'cards-card-text');
  [...cell.children].forEach((n) => {
    if (isMedia(n)) {
      image.append(n);
      return;
    }
    const a = n.tagName === 'P' && n.querySelector(':scope > a');
    if (a && !n.textContent.replace(a.textContent, '').trim()) {
      const scheme = (a.getAttribute('href') || '').split(':')[0];
      const kind = ICONS[scheme] || 'globe';
      n.classList.add('cards-contact-link');
      a.classList.add(`cards-contact-${kind}`);
      a.prepend(linkIcon(kind));
    }
    text.append(n);
  });
  if (image.children.length) card.append(image);
  card.append(text);
  return card;
}

/** a teaser card: an h6 heading, or a heading followed by text (frach-m-card ends on its title) */
function simpleHeading(cell) {
  const heading = cell.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
  if (!heading) return null;
  return heading.tagName === 'H6' || heading.nextElementSibling ? heading : null;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const row = el('div', 'row');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    if (!cell.children.length) return;
    const col = el('div', 'cards-col');
    const dated = block.classList.contains('dated');
    const simple = !dated && simpleHeading(cell);
    if (block.classList.contains('contact')) col.append(buildContactCard(cell));
    else if (simple) {
      col.classList.add('cards-col-simple');
      col.append(buildSimpleCard(cell, simple));
    } else col.append(buildCard(cell, dated));
    row.append(col);
  });

  // with-link-box: adopt a following link-box block as the aside column
  const wrapper = block.parentElement;
  const next = wrapper && wrapper.nextElementSibling;
  if (next && next.classList.contains('link-box-wrapper')) {
    const aside = el('div', 'cards-col cards-col-aside');
    aside.append(next);
    row.append(aside);
    block.classList.add('with-link-box');
  }

  const container = el('div', 'container');
  container.append(row);
  block.replaceChildren(container);
}
