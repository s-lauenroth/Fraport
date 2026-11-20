/**
 * milestones — frach-m-milestones: a one-slide-at-a-time slider of text-media panels steered by
 * a ruled marker timeline (coloured ring markers + labels) and prev / next arrows (>= 960).
 * Timeline above the slides below 960, below them from 960. Initial state: slide 1 active.
 *
 * Authoring: one row per slide, two cells (classified by content):
 *   - label cell: a heading (the timeline label), optionally a paragraph naming the marker
 *     colour (aubergine | orange | green; default blue)
 *   - panel cell: a heading (panel headline), a picture, rich text, CTA paragraphs
 *     (<strong> / <em> links → the button row)
 * Panels alternate media left (33 / 66) and right (66 / 33), as on the source.
 *
 * @variants block class: grey — grey slide band and timeline
 * @ew-exempt <p> marker colour word — read as a class, kept hidden in the label
 * Controls are block chrome (sr-only labels).
 */

const COLOURS = ['aubergine', 'orange', 'green'];

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isCta = (p) => p.matches('.button-wrapper') || !!p.querySelector(':scope > a.button');
const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();

function controlButton(className, icon, label) {
  const b = el('button', `button primary button-primary button-icon-only ${className}`);
  b.type = 'button';
  const i = el('span', `icon icon-${icon}`);
  i.setAttribute('aria-hidden', 'true');
  const t = el('span', 'visually-hidden');
  t.textContent = label;
  b.append(i, t);
  return b;
}

function isLabelCell(cell) {
  const heads = cell.querySelectorAll('h1, h2, h3, h4, h5, h6');
  return heads.length === 1 && !cell.querySelector('picture, img, a');
}

function buildItem(cell, index) {
  const item = el('div', 'milestones-item');
  item.setAttribute('role', 'button');
  item.tabIndex = 0;
  item.dataset.index = String(index);
  const marker = el('span', 'milestones-marker');
  const label = el('div', 'milestones-label h6');
  [...cell.children].forEach((n) => {
    const word = n.tagName === 'P' ? n.textContent.trim().toLowerCase() : '';
    if (COLOURS.includes(word)) {
      marker.classList.add(`milestones-marker-${word}`);
      n.hidden = true;
      item.append(n);
    } else label.append(n);
  });
  item.prepend(marker, label);
  return item;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const MAIL = 'M21 5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm-1 3.868-7.445 '
  + '4.964a1 1 0 0 1-1.11 0L4 8.869V17h16zM19.196 7H4.803L12 11.798z';

const ARROW = 'M14.29 7.29a1 1 0 0 1 1.42 0l4 4a1 1 0 0 1 0 1.42l-4 4a1 1 0 0 1-1.42-1.42L16.59 13H5'
  + 'a1 1 0 0 1 0-2h11.59l-2.3-2.29a1 1 0 0 1-.08-1.32z';

function svgIcon(d, className) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add(className);
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  svg.append(path);
  return svg;
}

/** mail links: inline svg envelope before the text, the link stays inline (wraps as source) */
function mailIcons(scope) {
  scope.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
    if (!a.querySelector('svg')) a.prepend(svgIcon(MAIL, 'milestones-mail-icon'));
  });
}

function buildPanel(cell, index) {
  const panel = el('div', `milestones-panel ${index % 2 ? 'right ratio-66-33' : 'left ratio-33-66'}`);
  const row = el('div', 'row');
  const headline = el('div', 'milestones-headline h3');
  const media = el('div', 'milestones-media');
  const text = el('div', 'milestones-text');
  const rte = el('div', 'rte');
  const buttons = el('div', 'buttons');
  [...cell.children].forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName) && !headline.children.length && !rte.children.length) {
      headline.append(n);
    } else if (isMedia(n) && !media.children.length) {
      media.append(n);
    } else if (n.tagName === 'P' && isCta(n)) buttons.append(n);
    else rte.append(n);
  });
  mailIcons(rte);
  // button arrows: inline svg after the label, as the source draws them
  buttons.querySelectorAll('a').forEach((a) => {
    if (!a.querySelector('svg')) a.append(svgIcon(ARROW, 'milestones-button-icon'));
  });
  text.append(rte, buttons);
  if (headline.children.length) row.append(headline);
  if (media.children.length) row.append(media);
  row.append(text);
  const container = el('div', 'container');
  container.append(row);
  panel.append(container);
  const slide = el('div', 'milestones-slide');
  slide.append(panel);
  return slide;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .milestones-slider')) return;
  const slides = [];
  const items = [];
  [...block.children].forEach((rowEl) => {
    const cells = [...rowEl.children];
    if (!cells.length) return;
    const labelCell = cells.find(isLabelCell);
    const panelCell = cells.find((c) => c !== labelCell) || labelCell;
    const n = slides.length;
    slides.push(buildPanel(panelCell, n));
    if (labelCell && labelCell !== panelCell) items.push(buildItem(labelCell, n));
  });
  if (!slides.length) return;

  const track = el('div', 'milestones-slides');
  track.append(...slides);
  const viewport = el('div', 'milestones-viewport');
  viewport.append(track);
  const controls = el('div', 'milestones-controls');
  const prev = controlButton('milestones-prev', 'arrow-left', 'Previous Slide');
  const next = controlButton('milestones-next', 'arrow-right', 'Next Slide');
  controls.append(prev, next);
  const slider = el('div', 'milestones-slider');
  slider.append(controls, viewport);
  const nav = el('div', 'milestones-nav');
  nav.append(...items);
  block.replaceChildren(slider, nav);

  let cur = 0;
  const go = (i, smooth = true) => {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    track.style.transform = `translateX(${-100 * cur}%)`;
    slides.forEach((s, n) => {
      const on = n === cur;
      s.classList.toggle('is-off', !on);
      if (on) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
      s.inert = !on;
    });
    items.forEach((it, n) => {
      it.classList.toggle('is-active', n === cur);
      if (n === cur) it.setAttribute('aria-current', 'true');
      else it.removeAttribute('aria-current');
    });
    if (items[cur] && smooth) {
      nav.scrollTo({ left: items[cur].offsetLeft - items[0].offsetLeft, behavior: 'smooth' });
    }
    prev.disabled = cur === 0;
    next.disabled = cur === slides.length - 1;
  };
  items.forEach((it, n) => {
    it.addEventListener('click', () => go(n));
    it.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go(n);
      }
    });
  });
  prev.addEventListener('click', () => go(cur - 1));
  next.addEventListener('click', () => go(cur + 1));
  go(0, false);
}
