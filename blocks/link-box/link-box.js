/**
 * link-box — frach-m-link-box (editorial): shadowed white panel — grey h6 title, an arrow link
 * list and stacked primary CTAs. Standalone, or adopted by a preceding `cards` block as its
 * aside column.
 *
 * Authoring: one cell — a heading (title), a list of links, CTA paragraphs (<strong> links).
 * Decoded by role, never by index; extra paragraphs stay in the text flow.
 *
 * @variants block class: light — an image (a picture paragraph, or a separate first cell) sits
 *   beside the panel (8 / 4 cols >= 960) on a tinted band; the shadowed panel moves to
 *   .link-box-panel
 */

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const ARROW = 'M14.29 7.29a1 1 0 0 1 1.42 0l4 4a1 1 0 0 1 0 1.42l-4 4a1 1 0 0 1-1.42-1.42L16.59 13H5'
  + 'a1 1 0 0 1 0-2h11.59l-2.3-2.29a1 1 0 0 1-.08-1.32z';

/** decorative link arrow (the source draws it as an inline svg before the link text) */
function arrowIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('link-box-icon');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ARROW);
  svg.append(path);
  return svg;
}

const isCta = (p) => p.matches('.button-wrapper') || !!p.querySelector(':scope > a.button');

export default function decorate(block) {
  if (block.querySelector(':scope > .link-box-title, :scope > .link-box-list')) return;
  const title = el('div', 'link-box-title h6');
  const list = el('div', 'link-box-list');
  const ctas = el('div', 'link-box-ctas');
  const body = el('div', 'link-box-body');
  const light = block.classList.contains('light');
  const media = el('div', 'link-box-media');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((n) => {
      if (light && isMedia(n)) media.append(n);
      else if (/^H[1-6]$/.test(n.tagName) && !title.children.length) title.append(n);
      else if (n.tagName === 'UL' || n.tagName === 'OL') {
        n.querySelectorAll(':scope > li > a').forEach((a) => {
          if (!a.querySelector('svg')) a.prepend(arrowIcon());
        });
        list.append(n);
      } else if (n.tagName === 'P' && isCta(n)) {
        n.querySelectorAll('a.button').forEach((a) => a.classList.add('primary'));
        ctas.append(n);
      } else body.append(n);
    });
  });
  const parts = [title, body, list, ctas].filter((b) => b.children.length);
  if (light) {
    const panel = el('div', 'link-box-panel');
    panel.append(...parts);
    block.replaceChildren(...(media.children.length ? [media] : []), panel);
    return;
  }
  block.replaceChildren(...parts);
}
