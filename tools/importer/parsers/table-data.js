/* eslint-disable */
/* global WebImporter */
import { clean, normalizeContent } from '../utils/fraport-parser-utils.js';
import columnsSidebarParse from './columns-sidebar.js';

/**
 * The 8-4 sidebar row around a table when the page template maps such rows to columns-sidebar
 * (its shared instances match the row): a catalog page selector can claim the table before the
 * row (page selectors are claimed first), which would leave the rest of the row unconverted.
 */
function sidebarRow(element, params) {
  const def = (params?.targets?.template?.blocks || []).find((b) => b.name === 'columns-sidebar');
  if (!def) return null;
  for (let row = element.parentElement; row; row = row.parentElement) {
    const main = row.matches('.frach-grid-row') && row.querySelector(':scope > .frach-grid-col-mq3-8');
    if (!main || !main.contains(element)) continue;
    const matches = (def.instances || []).some((s) => { try { return row.matches(s); } catch (e) { return false; } });
    if (matches) return row;
  }
  return null;
}

/**
 * Parser for table-data (frach-e-table data tables; element may be the table, its AEM section or a tab panel).
 *
 * Block contract (blocks/table-data): one block row per table row, one cell per table cell
 * (rich text kept); the first row is the header row; a row with fewer cells than the widest
 * row has its last cell spanning the rest; empty rows are kept as spacer rows.
 * Variant `side-by-side`: several tables next to each other (grid columns) — every one-cell
 * row starts a new table (the source header rows span both columns).
 */
function cellContent(document, cell) {
  normalizeContent(document, cell);
  const nodes = [...cell.childNodes].filter((n) => n.nodeType === 1 || clean(n.textContent));
  if (!nodes.length) return '';
  // plain text cells: collapse whitespace; rich cells keep their markup
  if (nodes.every((n) => n.nodeType === 3 || /^(SPAN|STRONG|B|EM|I|A|BR|SUP|SUB)$/.test(n.tagName))) {
    const p = document.createElement('p');
    nodes.forEach((n) => p.append(n.nodeType === 3 ? document.createTextNode(n.textContent.replace(/\s+/g, ' ')) : n));
    return [p];
  }
  return nodes;
}

export default function parse(element, { document, params }) {
  // a table in the main column of a columns-sidebar row is part of that block (alt-2)
  const row = sidebarRow(element, params);
  if (row) { columnsSidebarParse(row, { document, params }); return; }

  const tables = element.matches('table') ? [element] : [...element.querySelectorAll('table')];
  const cells = [];
  tables.forEach((table) => {
    table.querySelectorAll('tr').forEach((tr) => {
      if (tr.closest('table') !== table) return;
      const row = [...tr.children].filter((c) => /^T[HD]$/.test(c.tagName)).map((c) => cellContent(document, c));
      if (!row.length) return;
      if (row.every((c) => c === '')) { cells.push(row.map(() => '')); return; } // spacer row
      cells.push(row);
    });
  });

  const name = tables.length > 1 ? 'table-data (side-by-side)' : 'table-data';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: cells.length ? cells : [['']] });
  element.replaceWith(block);
}
