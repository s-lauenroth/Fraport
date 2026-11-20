/**
 * text-media — frach-m-text-media: an optional media row (an image, or a gradient highlight
 * box carrying a short statement) above a rich-text column with buttons.
 *
 * Authoring: one row, one or two cells.
 *   - media cell (optional, first of two): a picture → image; text only → highlight box
 *   - text cell: headings, paragraphs, lists; CTA paragraphs (<strong>/<em> links) become the
 *     button row
 *
 * @variants block class: left | right — the media floats left / right beside the text (a
 *   leading h2 / h3 of the text cell becomes the row headline; an h4 stays in the text);
 *   half — media 50 % wide; third — media 33 % wide (source 66-33); its rich-text links carry
 *   the source's inline arrow (decorative inline svg, 16×24)
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const ARROW = 'M14.29 7.29a1 1 0 0 1 1.42 0l4 4a1 1 0 0 1 0 1.42l-4 4a1 1 0 0 1-1.42-1.42L16.59 13H5'
  + 'a1 1 0 0 1 0-2h11.59l-2.3-2.29a1 1 0 0 1-.08-1.32z';

/** decorative inline arrow before a rich-text link (the source's frach-e-link icon) */
function arrowIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 16 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('text-media-link-icon');
  const g = document.createElementNS(SVG_NS, 'path');
  g.setAttribute('d', ARROW);
  g.setAttribute('transform', 'translate(-4 0)');
  g.setAttribute('fill', 'currentcolor');
  svg.append(g);
  return svg;
}

const isCta = (p) => p.matches('.button-wrapper') || !!p.querySelector(':scope > a.button');

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const textCell = cells[cells.length - 1];
  const mediaCell = cells.length > 1 ? cells[0] : null;

  const container = el('div', 'container');
  const row = el('div', 'row');
  container.append(row);

  // left / right (floated media): a leading heading of the text cell is the row headline
  const floated = block.classList.contains('left') || block.classList.contains('right');
  const lead = textCell && textCell.firstElementChild;
  if (floated && lead && /^H[23]$/.test(lead.tagName)) {
    const headline = el('div', 'text-media-headline');
    headline.append(lead);
    row.append(headline);
  }

  if (mediaCell && mediaCell.children.length) {
    const media = el('div', 'text-media-media');
    const picture = mediaCell.querySelector('picture, img');
    if (picture) {
      const fig = el('div', 'text-media-image');
      fig.append(picture);
      media.append(fig);
    } else {
      const box = el('div', 'text-media-highlight');
      const txt = el('div', 'text-media-highlight-text h6');
      txt.append(...mediaCell.children);
      box.append(txt);
      media.append(box);
    }
    row.append(media);
  }

  if (textCell) {
    const text = el('div', 'text-media-text');
    const rte = el('div', 'rte');
    const buttons = el('div', 'buttons');
    [...textCell.children].forEach((n) => {
      if (n.tagName === 'P' && isCta(n)) buttons.append(n);
      else rte.append(n);
    });
    if (block.classList.contains('third')) {
      rte.querySelectorAll('a[href]:not(.button)').forEach((a) => {
        if (!a.querySelector('svg')) a.prepend(arrowIcon());
      });
    }
    text.append(rte);
    // kept when empty: the source row stops the rte margin collapsing (floated: no row)
    if (!floated || buttons.children.length) text.append(buttons);
    row.append(text);
  }
  block.replaceChildren(container);
}
