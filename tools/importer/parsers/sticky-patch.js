/* eslint-disable */
/* global WebImporter */
import {
  findRoot, makeImage, para, link, clean, headingFrom, paraFrom,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for sticky-patch (frach-e-sticky-patch, or its div.stickyPatch wrapper): the fixed
 * round pin (bottom right) that opens a promo card ("75 Jahre Flughafenfeuerwehr").
 *
 * Block contract (blocks/sticky-patch): one cell (or several, decoded by content) — a picture,
 * a heading, a copy paragraph and a paragraph holding the link. The open / close buttons are
 * chrome the block builds itself.
 */
export default function parse(element, { document }) {
  const root = findRoot(element, 'frach-e-sticky-patch, .frach-e-sticky-patch');
  const content = root.querySelector('.frach-e-sticky-patch__content') || root;
  const cell = [];

  const img = makeImage(document, content.querySelector('.frach-e-sticky-patch__icon-image-container') || content);
  if (img) cell.push(para(document, img));

  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading && clean(heading.textContent)) {
    cell.push(headingFrom(document, heading, heading.tagName.toLowerCase()));
  }

  content.querySelectorAll('p').forEach((p) => {
    if (clean(p.textContent)) cell.push(paraFrom(document, p));
  });

  const a = [...content.querySelectorAll('a[href]')].find((x) => clean(x.textContent));
  if (a) {
    const label = a.querySelector('.frach-e-link__link-label, .frach-e-button__label') || a;
    const l = link(document, a.getAttribute('href'), label.textContent);
    if (a.getAttribute('target') === '_blank') l.setAttribute('target', '_blank');
    cell.push(para(document, l));
  }

  if (!cell.length) {
    element.remove();
    return;
  }
  const block = WebImporter.Blocks.createBlock(document, { name: 'sticky-patch', cells: [[cell]] });
  element.replaceWith(block);
}
