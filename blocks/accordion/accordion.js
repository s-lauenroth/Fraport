/**
 * accordion — frach-m-accordion: ruled rows, a primary label with a chevron toggle; the panel
 * opens on a visually hidden checkbox (CSS only, as the source: keyboard focus + state).
 *
 * Authoring: one row per item — label | id (optional anchor id, e.g. `strategie`). The blocks
 * that FOLLOW the accordion in the same section (text-media, image, columns, default content)
 * are the panel of its last item, up to the next accordion block.
 *
 * @variants block class: open — its items start expanded (source `checked` item)
 * @ew-exempt the id cell is configuration (the item's anchor id), not displayed text
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRON = 'M3.664 7.253a1 1 0 0 0-1.328 1.494l9 8a1 1 0 0 0 1.328 0l9-8a1 1 0 0 0'
  + '-1.328-1.494L12 14.662z';

/** the toggle chevron as an inline svg (as the source draws it) */
function chevron() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'accordion-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHEVRON);
  path.setAttribute('fill', 'currentcolor');
  svg.append(path);
  return svg;
}

/** move the wrappers following this block's wrapper (up to the next accordion) into a panel */
function adopt(block, inner) {
  const wrapper = block.parentElement;
  if (!wrapper || !wrapper.classList.contains('accordion-wrapper')) return;
  let next = wrapper.nextElementSibling;
  while (next && !next.classList.contains('accordion-wrapper')
    && !next.classList.contains('section-metadata')) {
    const following = next.nextElementSibling;
    inner.append(next);
    next = following;
  }
}

export default function decorate(block) {
  if (block.querySelector('.accordion-item')) return;
  const list = el('div', 'accordion-list');
  let lastInner = null;
  [...block.children].forEach((row) => {
    const [labelCell, idCell] = row.children;
    if (!labelCell) return;
    const labelText = labelCell.textContent.replace(/\s+/g, ' ').trim();
    const id = slug((idCell && idCell.textContent) || labelText) || 'item';
    const item = el('div', 'accordion-item');
    const input = el('input', 'accordion-input');
    input.type = 'checkbox';
    input.id = id;
    if (block.classList.contains('open')) input.checked = true;
    input.setAttribute('aria-label', `${id} accordion element`);
    input.setAttribute('aria-controls', `${id}-content`);
    const toggle = el('label', 'accordion-toggle');
    toggle.htmlFor = id;
    toggle.id = `${id}-label`;
    const label = el('span', 'accordion-label');
    label.append(...labelCell.childNodes);
    toggle.append(label, chevron());
    const panel = el('div', 'accordion-panel');
    panel.id = `${id}-content`;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', toggle.id);
    const inner = el('div', 'accordion-inner');
    panel.append(inner);
    item.append(input, toggle, panel);
    list.append(item);
    lastInner = inner;
  });
  if (lastInner) adopt(block, lastInner);
  const container = el('div', 'container');
  const gridRow = el('div', 'row');
  const col = el('div', 'accordion-col');
  col.append(list);
  gridRow.append(col);
  container.append(gridRow);
  block.replaceChildren(container);
}
