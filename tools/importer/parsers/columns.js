/* eslint-disable */
/* global WebImporter */
import {
  findRoot, gridColumns, componentContent,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for columns: an AEM frach-grid-row whose grid columns stack components
 * (frach-m-image, frach-m-text, frach-m-text-media, frach-m-card, link box ...).
 *
 * Block contract (blocks/columns): one row, one cell per column — optional picture
 * (alone in its paragraph, optionally linked), then rich text with CTA paragraphs.
 *
 * Variants (blocks/columns/metadata.json options):
 * - light: the row sits in a grey band section (frach-h-bg--grey) — tinted band
 * - grey: the row sits inside an accordion panel
 * - one-third: two columns split 4 / 8
 */
function hasCol(col, n) {
  return new RegExp(`(^|\\s)frach-grid-col-mq3-${n}(\\s|$)`).test(col.className || '');
}

export default function parse(element, { document, params }) {
  const row = findRoot(element, '.frach-grid-row');
  let cols = gridColumns(row);
  if (!cols.length) cols = [row];

  const cellContents = cols.map((col) => componentContent(document, col))
    .filter((c) => c.length);

  const classes = [];
  const greyBand = element.matches('.frach-h-bg--grey') || !!element.closest('.frach-h-bg--grey');
  // inside an accordion panel the panel's grey wins (accordion.css styles .columns.grey there)
  if (element.closest('.frach-m-accordion__section-inner')) classes.push('grey');
  else if (greyBand) classes.push('light');
  if (cols.length === 2 && ((hasCol(cols[0], 4) && hasCol(cols[1], 8)) || (hasCol(cols[0], 8) && hasCol(cols[1], 4)))) {
    classes.push('one-third');
  }
  // Figure captions stay as the paragraph after the picture; the `captions` option is not
  // added automatically (the catalog never assigns it to these instances).
  cellContents.forEach((c) => c.forEach((n) => {
    if (n.dataset && n.dataset.caption) delete n.dataset.caption;
  }));

  const name = classes.length ? `columns (${classes.join(', ')})` : 'columns';
  const cells = [cellContents.length ? cellContents : ['']];
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
