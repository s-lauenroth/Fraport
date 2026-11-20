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

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const row = el('div', 'row');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    if (!cell.children.length) return;
    const col = el('div', 'cards-col');
    col.append(buildCard(cell, block.classList.contains('dated')));
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
