/* eslint-disable */
/* global WebImporter */
import {
  findRoot, gridColumns, componentContent,
} from '../utils/fraport-parser-utils.js';

// set on source tables by the cleanup transformer (see fraport-cleanup.js RAW_TABLE_ATTR)
const RAW_TABLE_ATTR = 'data-excat-raw-table';

/**
 * Parser for columns-sidebar: a frach-grid-row (or its outer AEM section) with a wide main column (mq3-8) and a
 * narrow sidebar (mq3-4) holding contact cards / download lists / further info.
 *
 * Block contract (blocks/columns-sidebar): one row, two cells — main body and sidebar.
 * Sidebar shapes the block decodes: a picture starts a contact card (picture, name heading,
 * role text, tel/mailto links); a file link alone in a list item is a download box with
 * the text after a line break as its meta line ("PDF, 76 KB").
 *
 * Variants (catalog, by context / sidebar content):
 * - light-2: the row sits in a grey band (frach-h-bg--grey)
 * - alt-3: sidebar holds contact cards
 * - alt-2: main column holds a table
 * - alt: otherwise (downloads / further information)
 */
export default function parse(element, { document, params }) {
  const row = findRoot(element, '.frach-grid-row');
  const cols = gridColumns(row);
  const main = cols.find((c) => /frach-grid-col-mq3-8/.test(c.className)) || cols[0] || row;
  const side = cols.find((c) => c !== main && /frach-grid-col-mq3-4/.test(c.className))
    || cols.find((c) => c !== main);

  const greyBand = element.matches('.frach-h-bg--grey') || !!element.closest('.frach-h-bg--grey');
  const sideHasContact = !!(side && side.querySelector('.frach-m-contact'));
  const mainHasTable = !!main.querySelector('table, frach-e-table');

  const mainContent = componentContent(document, main);
  const sideContent = side ? componentContent(document, side) : [];

  let variant = 'alt';
  if (greyBand) variant = 'light-2';
  else if (sideHasContact) variant = 'alt-3';
  else if (mainHasTable) variant = 'alt-2';

  // Source tables in the body stay plain tables in the cell (the block wraps them to scroll
  // sideways, alt-2); unmarked, so the cleanup does not wrap them as nested table-data blocks.
  [...mainContent, ...sideContent].filter((n) => n.nodeType === 1).forEach((n) => {
    if (n.matches('table')) n.removeAttribute(RAW_TABLE_ATTR);
    n.querySelectorAll('table').forEach((t) => t.removeAttribute(RAW_TABLE_ATTR));
  });

  const cells = [sideContent.length ? [mainContent, sideContent] : [mainContent]];
  const block = WebImporter.Blocks.createBlock(document, { name: `columns-sidebar (${variant})`, cells });
  element.replaceWith(block);
}
