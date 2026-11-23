/**
 * tiles — three image + text tiles (4 cols each >= 720): the image (optionally linked) zooms on
 * hover; a theme line, a headline link led by an arrow, and a short text.
 *
 * Authoring: one row, one cell per tile — a picture (alone in its paragraph, optionally wrapped
 * in a link), a theme paragraph, a heading link (the arrow is drawn in CSS), a text paragraph;
 * CTA paragraphs (<strong>/<em> links) become the button row. Several rows add more tiles.
 *
 * @variants block class: alt — the same tiles on a tinted band
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const ARROW = 'M14.29 7.29a1 1 0 0 1 1.42 0l4 4a1 1 0 0 1 0 1.42l-4 4a1 1 0 0 1-1.42-1.42L16.59 13H5'
  + 'a1 1 0 0 1 0-2h11.59l-2.3-2.29a1 1 0 0 1-.08-1.32z';

/** decorative headline arrow (the source draws it as an inline svg before the link text) */
function arrowIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ARROW);
  svg.append(path);
  return svg;
}

const isCta = (p) => p.matches('.button-wrapper') || !!p.querySelector(':scope > a.button');
const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const row = el('div', 'row');
  cells.forEach((cell) => {
    if (!cell.children.length) return;
    const col = el('div', 'tiles-col');
    const text = el('div', 'tiles-text');
    const rte = el('div', 'rte');
    const buttons = el('div', 'buttons');
    text.append(rte, buttons);
    [...cell.children].forEach((n) => {
      if (isMedia(n)) {
        const fig = el('div', 'tiles-figure');
        const a = n.querySelector('a');
        if (a) a.tabIndex = -1;
        fig.append(n);
        col.append(fig);
      } else if (n.tagName === 'P' && isCta(n)) buttons.append(n);
      else {
        if (/^H[1-6]$/.test(n.tagName)) {
          const a = n.querySelector('a');
          if (a && !a.querySelector('svg')) a.prepend(arrowIcon());
        }
        rte.append(n);
      }
    });
    col.append(text);
    row.append(col);
  });
  const container = el('div', 'container');
  container.append(row);
  block.replaceChildren(container);
}
