/**
 * download-list — frach-m-download-list: a grey h6 title above a stack of bordered download
 * items (file name link, file type and size meta line, download arrow on hover); 10 of 12
 * columns, offset by one, >= 960.
 *
 * Authoring: one cell — a heading (title) and a list; per item one link: the file name, a line
 * break, the meta text (e.g. "PDF, 886 KB"), as on the source where the whole item is the link.
 * Decoded by role, never by index: every other node stays in the column in authored order.
 *
 * @variants block class: halves — one column per cell, side by side >= 720 (the source's
 *   6 | 6 grid of titled lists); grey — grey band behind the list(s)
 * @variants block class: aside — the block joins a directly preceding one-cell `columns` block
 *   as its next column (the source's 8 | 4 grid: text beside a download list)
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/** decorative file type icon (the source draws it as an inline svg before the meta text) */
function typeIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'download-list-type');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', '/icons/document-pdf.svg#frach-icon-document-pdf');
  svg.append(use);
  return svg;
}

/** split the link's authored nodes at its first <br>: name before, meta after (nodes moved) */
function splitLink(a) {
  if (a.querySelector('.download-list-name')) return;
  const nodes = [...a.childNodes];
  const br = nodes.findIndex((n) => n.nodeName === 'BR');
  const name = el('span', 'download-list-name');
  name.append(...(br < 0 ? nodes : nodes.slice(0, br)));
  a.prepend(name);
  if (br < 0) return;
  const meta = el('span', 'download-list-meta');
  meta.append(...nodes.slice(br + 1));
  if (/\.pdf\b/i.test(a.getAttribute('href') || '')) a.append(typeIcon());
  a.append(meta);
}

/** a heading → title slot, a list → items slot, any other node as is (moved) */
function slot(n) {
  let wrap = null;
  if (/^H[1-6]$/.test(n.tagName)) wrap = el('div', 'download-list-title');
  else if (n.tagName === 'UL') wrap = el('div', 'download-list-items');
  if (!wrap) return n;
  wrap.append(n);
  return wrap;
}

/** join the preceding one-cell columns block as its next column */
function adopt(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('columns-wrapper')) return;
  const columns = prev.querySelector('.columns');
  const row = columns && columns.querySelector(':scope > .container > .row');
  if (!row) return;
  const n = row.children.length;
  const col = el('div', 'columns-col');
  col.append(wrapper);
  row.append(col);
  columns.classList.replace(`columns-${n}-cols`, `columns-${n + 1}-cols`);
}

export default function decorate(block) {
  block.querySelectorAll('li a').forEach(splitLink);
  if (block.querySelector('.download-list-items')) return;
  if (block.classList.contains('halves')) {
    const halves = el('div', 'row');
    [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
      const c = el('div', 'download-list-col');
      [...cell.children].forEach((n) => c.append(slot(n)));
      halves.append(c);
    });
    const box = el('div', 'container');
    box.append(halves);
    block.replaceChildren(box);
    return;
  }
  const col = el('div', 'download-list-col');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((n) => {
      col.append(slot(n));
    });
  });
  if (block.classList.contains('aside')) {
    block.replaceChildren(...col.childNodes);
    adopt(block);
    return;
  }
  const row = el('div', 'row');
  row.append(col);
  const container = el('div', 'container');
  container.append(row);
  block.replaceChildren(container);
}
