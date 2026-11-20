/**
 * image-gallery-tiles — frach-m-image-gallery-tiles: 16:9 zoomable tiles, 1 / 2 / 4 per row in a
 * 10-col frame. 8 tiles show initially (4 below 720, as the source loads them by breakpoint);
 * "Mehr anzeigen" reveals the rest. A tile opens the lightbox on its slide (prev / next, close,
 * backdrop click, Escape) with the image title below the image.
 *
 * Authoring: one row per image — a picture (alone in its paragraph) and a heading (the image
 * title shown in the lightbox). Decoded by role, never by index.
 * Control labels (Zoom, Mehr anzeigen, prev/next/close) are generated UI, not authored content.
 * Lightbox images are presentational clones of the tile images (EW4).
 */

const LABELS = {
  de: {
    zoom: 'Zoom', more: 'Mehr anzeigen', prev: 'Previous Slide', next: 'Next Slide', close: 'Close overlay',
  },
  en: {
    zoom: 'Zoom', more: 'Show more', prev: 'Previous Slide', next: 'Next Slide', close: 'Close overlay',
  },
};
/** initial tile count: the source loads 8 tiles from 720 up, 4 below */
const initialCount = () => (window.matchMedia('(min-width: 720px)').matches ? 8 : 4);

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const PATHS = {
  zoom: 'M10 2a8 8 0 0 1 6.32 12.9l5.39 5.39a1 1 0 0 1-1.42 1.42l-5.39-5.39A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 '
    + '0 12 6 6 0 0 0 0-12zm0 2a1 1 0 0 1 1 1v2h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2H7a1 1 0 0 1 0-2h2V7'
    + 'a1 1 0 0 1 1-1z',
  image: 'M21 4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h18zm-1 2H4v12h3.58l6.71-6.71'
    + 'a1 1 0 0 1 1.41 0L20 15.59V6zm-5 7.41L10.41 18h9.18L15 13.41zM8 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  prev: 'M9.71 7.29a1 1 0 0 1 0 1.42L7.41 11H19a1 1 0 0 1 0 2H7.41l2.3 2.29a1 1 0 0 1-1.42 1.42l-4-4'
    + 'a1 1 0 0 1 0-1.42l4-4a1 1 0 0 1 1.42 0z',
  next: 'M14.29 7.29a1 1 0 0 1 1.42 0l4 4a1 1 0 0 1 0 1.42l-4 4a1 1 0 0 1-1.42-1.42L16.59 13H5'
    + 'a1 1 0 0 1 0-2h11.59l-2.3-2.29a1 1 0 0 1 0-1.42z',
  close: 'M5.29 5.29a1 1 0 0 1 1.42 0L12 10.59l5.29-5.3a1 1 0 1 1 1.42 1.42L13.41 12l5.3 5.29a1 1 0 0 1'
    + '-1.42 1.42L12 13.41l-5.29 5.3a1 1 0 0 1-1.42-1.42L10.59 12l-5.3-5.29a1 1 0 0 1 0-1.42z',
};

function icon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('image-gallery-tiles-icon');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', PATHS[name]);
  svg.append(path);
  return svg;
}

function stripInstrumentation(node) {
  [node, ...node.querySelectorAll('*')].forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (a.name.startsWith('data-') || a.name === 'id') n.removeAttribute(a.name);
    });
  });
  return node;
}

function iconButton(name, label, className) {
  const b = el('button', `button primary button-icon-only ${className}`);
  b.type = 'button';
  const sr = el('span', 'image-gallery-tiles-sr');
  sr.textContent = label;
  b.append(icon(name), sr);
  return b;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const lang = (document.documentElement.lang || 'de').slice(0, 2);
  const L = LABELS[lang] || LABELS.de;

  const grid = el('div', 'image-gallery-tiles-grid');
  const slides = el('ol', 'image-gallery-tiles-slides');
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const nodes = [...row.querySelectorAll(':scope > div > *')];
    const media = nodes.find((n) => n.querySelector('picture, img'));
    if (!media) return;
    const img = media.querySelector('img');
    const item = el('figure', 'image-gallery-tiles-item');
    const image = el('div', 'image-gallery-tiles-image');
    image.append(media);
    // the opener ("Zoom", as on the source) overlays the whole tile
    const link = el('a', 'image-gallery-tiles-link');
    link.href = '#';
    link.setAttribute('role', 'button');
    link.setAttribute('aria-label', L.zoom);
    link.setAttribute('aria-haspopup', 'true');
    const zoom = el('span', 'image-gallery-tiles-zoom');
    zoom.append(icon('zoom'));
    link.append(zoom);
    item.append(image, link);
    grid.append(item);

    const slide = el('li', 'image-gallery-tiles-slide');
    const frame = el('div', 'image-gallery-tiles-frame');
    const copy = stripInstrumentation(img.cloneNode(true));
    copy.loading = 'lazy';
    copy.classList.add('image-gallery-tiles-copy');
    frame.append(copy);
    const info = el('div', 'image-gallery-tiles-info');
    const title = el('div', 'image-gallery-tiles-title h6');
    nodes.filter((n) => n !== media).forEach((n) => title.append(n));
    info.append(icon('image'), title);
    slide.append(frame, info);
    slides.append(slide);
  });
  const items = [...grid.children];
  const initial = initialCount();
  items.forEach((item, i) => item.classList.toggle('is-loaded', i < initial));

  const row = el('div', 'row');
  row.append(grid);
  if (items.length > initial) {
    const more = el('button', 'button secondary image-gallery-tiles-more');
    more.type = 'button';
    more.textContent = L.more;
    more.addEventListener('click', () => {
      items.forEach((t) => t.classList.add('is-loaded'));
      block.classList.add('is-all');
    });
    row.append(more);
  } else block.classList.add('is-all');
  const container = el('div', 'container');
  container.append(row);

  const box = el('div', 'image-gallery-tiles-lightbox');
  box.setAttribute('role', 'dialog');
  box.hidden = true;
  const body = el('div', 'image-gallery-tiles-body');
  const controls = el('div', 'image-gallery-tiles-controls');
  const prev = iconButton('prev', L.prev, 'image-gallery-tiles-prev');
  const next = iconButton('next', L.next, 'image-gallery-tiles-next');
  controls.append(prev, next);
  body.append(slides, controls);
  const close = el('button', 'image-gallery-tiles-close');
  close.type = 'button';
  close.setAttribute('aria-label', L.close);
  close.append(icon('close'));
  box.append(body, close);
  block.replaceChildren(container, box);

  const slideEls = [...slides.children];
  let cur = 0;
  let opener = null;
  const show = (i) => {
    cur = Math.max(0, Math.min(slideEls.length - 1, i));
    slideEls.forEach((s, n) => s.classList.toggle('is-current', n === cur));
    prev.disabled = cur === 0;
    next.disabled = cur === slideEls.length - 1;
  };
  const shut = () => {
    box.hidden = true;
    box.removeAttribute('aria-modal');
    document.body.style.overflow = '';
    if (opener) opener.focus();
  };
  items.forEach((item, i) => item.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    opener = e.currentTarget;
    show(i);
    box.hidden = false;
    box.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';
    close.focus();
  }));
  prev.addEventListener('click', () => show(cur - 1));
  next.addEventListener('click', () => show(cur + 1));
  close.addEventListener('click', shut);
  box.addEventListener('click', (e) => {
    if (e.target === box) shut();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !box.hidden) shut();
  });
}
