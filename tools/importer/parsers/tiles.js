/* eslint-disable */
/* global WebImporter */
import {
  findRoot, gridColumns, imageComponent, textContent, clean,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for tiles: a grey-band section (or its grid row) whose grid row holds image + text tiles
 * (frach-m-image, optionally linked, followed by a frach-m-text).
 *
 * Block contract (blocks/tiles): one cell per tile — a picture paragraph (optionally
 * linked), a theme paragraph, a heading link, a text paragraph, CTA paragraphs; several rows
 * add more tiles. Rows hold as many tiles as the source has grid columns (padded with
 * empty cells, which the block skips).
 * A tile starts at each frach-m-image of a column (columns can stack two image tiles).
 * Variant `alt` (catalog): description-copy tiles of which some carry no link (the block
 * paints its own grey band); linked tiles use the default (the section paints the band).
 */
function tilesOfColumn(document, col) {
  const tiles = [];
  let current = null;
  const comps = [...col.querySelectorAll('frach-m-image, .frach-m-text')]
    .filter((c) => !c.parentElement.closest('frach-m-image, .frach-m-text'));
  comps.forEach((c) => {
    if (c.matches('frach-m-image')) {
      current = imageComponent(document, c).map((n) => { if (n.dataset) delete n.dataset.caption; return n; });
      tiles.push(current);
    } else {
      if (!current) { current = []; tiles.push(current); }
      current.push(...textContent(document, c));
    }
  });
  return tiles.filter((t) => t.length);
}

export default function parse(element, { document, params }) {
  const row = findRoot(element, '.frach-grid-row');
  let cols = gridColumns(row);
  if (!cols.length) cols = [row];

  const tiles = cols.flatMap((c) => tilesOfColumn(document, c));
  const perRow = Math.max(1, Math.min(cols.length, 3));
  const cells = [];
  for (let i = 0; i < tiles.length; i += perRow) {
    const r = tiles.slice(i, i + perRow);
    while (r.length < perRow) r.push('');
    cells.push(r);
  }

  // alt (catalog v_2bf997ccbd5a): copy tiles of which at least one has no link target (an
  // unlinked image + text tile); the default tiles are all linked (image / headline link)
  const linked = (t) => t.some((n) => n.querySelector && n.querySelector('a[href]:not([href="#"])')
    && (n.querySelector('img') || /^H[1-6]$/.test(n.tagName)));
  const hasCopy = tiles.some((t) => t.some((n) => n.tagName === 'P' && !n.querySelector('img')
    && clean(n.textContent).length > 30 && !n.querySelector('a')));
  const name = hasCopy && tiles.some((t) => !linked(t)) ? 'tiles (alt)' : 'tiles';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: cells.length ? cells : [['']] });
  element.replaceWith(block);
}
