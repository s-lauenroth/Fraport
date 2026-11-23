/**
 * table-data — label / value data table: a shaded header row, bordered cells with alternate
 * row shading, horizontally scrollable when wider than its column.
 *
 * Authoring: one block row per table row, one cell per table cell (cells keep their rich text).
 * The first row is the header row (<th>), unless the table is a label column (the first cells of
 * the first two rows are bold only, all cells filled, as the source opening-hours tables: no
 * header row there). A row with fewer cells than the widest row: its last cell spans the rest
 * (colspan). Empty rows are kept as spacer rows (as authored on the source).
 *
 * @variants block class: side-by-side — several tables next to each other (2 per row from
 *   720px): every one-cell row starts a new table and is that table's header row
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

/** A cell whose whole text is bold (<strong>/<b>), e.g. a row label. */
function boldOnly(cell) {
  const text = cell?.textContent.trim();
  if (!text) return false;
  const bold = [...cell.querySelectorAll('strong, b')].map((b) => b.textContent).join('').trim();
  return bold.replace(/\s+/g, '') === text.replace(/\s+/g, '');
}

function hasHeader(rows, max) {
  if (rows.length < 2) return true;
  const [first, second] = rows;
  const labelColumn = first.children.length === max
    && boldOnly(first.children[0]) && boldOnly(second.children[0]);
  return !labelColumn;
}

/** Moves a cell's content into the table cell; a lone paragraph is unwrapped. */
function moveContent(cell, td) {
  const nodes = [...cell.childNodes].filter((n) => n.nodeType !== 3 || n.textContent.trim());
  const only = nodes.length === 1 ? nodes[0] : null;
  td.append(...(only?.localName === 'p' ? only.childNodes : cell.childNodes));
}

function buildTable(rows, forceHeader = false) {
  const max = Math.max(...rows.map((r) => r.children.length), 1);
  const header = forceHeader || hasHeader(rows, max);
  const table = el('table', 'table-data-table');
  const thead = el('thead');
  const tbody = el('tbody');
  rows.forEach((row, i) => {
    const isHead = header && i === 0;
    const tr = el('tr');
    const cells = [...row.children];
    cells.forEach((cell, j) => {
      const td = el(isHead ? 'th' : 'td');
      if (isHead) td.scope = cells.length === 1 ? 'colgroup' : 'col';
      moveContent(cell, td);
      if (j === cells.length - 1 && cells.length < max) td.colSpan = max - cells.length + 1;
      tr.append(td);
    });
    (isHead ? thead : tbody).append(tr);
  });
  if (thead.children.length) table.append(thead);
  table.append(tbody);
  const scroll = el('div', 'table-data-scroll');
  scroll.append(table);
  return scroll;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .table-data-scroll, :scope > .table-data-group')) return;
  const rows = [...block.children];
  if (!block.classList.contains('side-by-side')) {
    block.replaceChildren(buildTable(rows));
    return;
  }
  const groups = [];
  rows.forEach((row) => {
    if (row.children.length === 1 || !groups.length) groups.push([row]);
    else groups[groups.length - 1].push(row);
  });
  const group = el('div', 'table-data-group');
  group.append(...groups.map((g) => buildTable(g, true)));
  block.replaceChildren(group);
}
