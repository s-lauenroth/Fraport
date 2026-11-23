/* eslint-disable */
/* global WebImporter */
import {
  makeImage, para, clean, normalizeContent, gridColumns, componentContent,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for timeline (.frach-m-timeline__items with frach-m-timeline-item entries, or a single item).
 *
 * Block contract (blocks/timeline): one row per entry — year cell and content cell
 * (picture, caption heading, text, links).
 * Variant `shadow` (catalog): not a timeline — a grid row of a text column beside contact
 * cards; each grid column becomes one cell of a single row (text column / contact cards:
 * picture, name, role, phone / e-mail links).
 * Also accepts a single frach-m-timeline-item as the element.
 */
function entryRow(document, item) {
  const year = clean((item.querySelector('.frach-m-timeline-item__timespan-value, .frach-m-timeline-item__timespan') || {}).textContent || '');
  const cell = [];
  const box = item.querySelector('.frach-m-timeline-item__content-box') || item;
  const img = makeImage(document, box);
  if (img) cell.push(para(document, img));
  const text = box.querySelector('.frach-m-timeline-item__text-box') || box;
  normalizeContent(document, text);
  [...text.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')]
    .filter((n) => !n.parentElement.closest('p, ul, ol, h1, h2, h3, h4, h5, h6'))
    .forEach((n) => { if (clean(n.textContent) || n.querySelector('img')) cell.push(n); });
  return [year, cell.length ? cell : ''];
}

export default function parse(element, { document, params }) {
  const items = element.matches('frach-m-timeline-item') ? [element]
    : [...element.querySelectorAll('frach-m-timeline-item, .frach-m-timeline-item')]
      .filter((n) => !n.parentElement.closest('frach-m-timeline-item, .frach-m-timeline-item'));

  let cells;
  let name = 'timeline';
  if (items.length) {
    cells = items.map((item) => entryRow(document, item));
  } else {
    // shadow: text column + contact cards side by side
    const row = element.matches('.frach-grid-row') ? element : element.querySelector('.frach-grid-row');
    const cols = row ? gridColumns(row) : [element];
    const rowCells = cols.map((c) => componentContent(document, c)).filter((c) => c.length);
    cells = [rowCells.length ? rowCells : ['']];
    name = 'timeline (shadow)';
  }

  const block = WebImporter.Blocks.createBlock(document, { name, cells });

  // The catalog maps each timeline item as its own instance: append consecutive items to
  // the timeline block created for the previous sibling item instead of starting a new one.
  if (element.matches('frach-m-timeline-item') && name === 'timeline') {
    let prev = element.previousElementSibling;
    while (prev && prev.tagName !== 'TABLE' && !clean(prev.textContent) && !prev.querySelector('img')) prev = prev.previousElementSibling;
    const head = prev && prev.tagName === 'TABLE' ? prev.querySelector('tr') : null;
    if (head && /^timeline$/i.test(clean(head.textContent))) {
      const rows = [...block.querySelectorAll('tr')].slice(1);
      rows.forEach((tr) => head.parentElement.append(tr));
      element.remove();
      return;
    }
  }
  element.replaceWith(block);
}
