/**
 * table — frach-e-table: a bordered data table with alternate-row shading, horizontally
 * scrollable when wider than its column.
 *
 * Authoring: one block row per table row, one cell per table cell (cells keep their rich
 * text: paragraphs, links, strong). A row with fewer cells than the widest row: its last cell
 * spans the rest (source colspan). An empty source cell is authored as a zero-width-space
 * paragraph (DA drops empty cells).
 *
 * @variants block class: header — the first row is the header row (<th>, grey band)
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

export default function decorate(block) {
  if (block.querySelector('.table-wrapper-scroll')) return;
  const rows = [...block.children];
  const max = Math.max(...rows.map((r) => r.children.length), 1);
  const header = block.classList.contains('header');
  const table = el('table', 'table-table');
  const tbody = el('tbody', 'table-body');
  rows.forEach((row, i) => {
    const tr = el('tr', i === 0 && header ? 'table-header-row' : 'table-row');
    const cells = [...row.children];
    cells.forEach((cell, j) => {
      const th = i === 0 && header;
      const td = el(th ? 'th' : 'td', th ? 'table-header-cell' : 'table-cell');
      td.append(...cell.childNodes);
      if (j === cells.length - 1 && cells.length < max) td.colSpan = max - cells.length + 1;
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  const scroll = el('div', 'table-wrapper-scroll');
  scroll.append(table);
  const container = el('div', 'container');
  const gridRow = el('div', 'row');
  const col = el('div', 'table-col');
  col.append(scroll);
  gridRow.append(col);
  container.append(gridRow);
  block.replaceChildren(container);
}
