/* eslint-disable */
/* global WebImporter */
import {
  gridColumns, imageComponent, cardComponent, para, link, clean, normalizeContent, headingFrom,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for link-box (.frach-m-link-box editorial panel, its column, grid row or AEM section).
 *
 * Block contract (blocks/link-box): one cell — a heading (title), a bulleted list of links,
 * CTA paragraphs (<strong> links); extra paragraphs stay in the flow.
 * Variant `light`: the box sits on a grey band beside an image — the image is a separate
 * first cell (8 / 4 layout).
 *
 * The matched element may be the box itself, its column, or the grid row / section that
 * also holds an image column (-> picture paragraph / light first cell) or frach-m-card
 * columns. Cards become a `cards` block placed before the link box, which the cards block
 * adopts as its aside column.
 */
function panelContent(document, box) {
  const out = [];
  const editorial = box.querySelector('.frach-m-link-box__editorial') || box;
  normalizeContent(document, editorial);
  const walk = (node) => {
    [...node.children].forEach((c) => {
      if (/^H[1-6]$/.test(c.tagName)) {
        const h = headingFrom(document, c);
        if (clean(h.textContent)) out.push(h);
      } else if (c.matches('ul, ol')) {
        const list = document.createElement(c.tagName.toLowerCase());
        c.querySelectorAll(':scope > li').forEach((li) => {
          const a = li.querySelector('a[href]');
          const item = document.createElement('li');
          if (a) item.append(link(document, a.getAttribute('href'), a.textContent));
          else item.textContent = clean(li.textContent);
          if (clean(item.textContent)) list.append(item);
        });
        if (list.children.length) out.push(list);
      } else if (c.matches('.frach-m-link-box__cta')) {
        c.querySelectorAll('a[href]').forEach((a) => {
          const label = a.querySelector('.frach-e-button__label') || a;
          if (!clean(label.textContent)) return;
          const strong = document.createElement('strong');
          strong.append(link(document, a.getAttribute('href'), label.textContent));
          out.push(para(document, strong));
        });
      } else if (c.matches('p')) {
        if (clean(c.textContent)) out.push(c);
      } else if (c.matches('dl')) {
        // tender notices: "Vergabestelle: Fraport AG" pairs -> <p><strong>term</strong> value</p>
        c.querySelectorAll('dt').forEach((dt) => {
          const p = document.createElement('p');
          const strong = document.createElement('strong');
          strong.textContent = clean(dt.textContent);
          p.append(strong);
          let dd = dt.nextElementSibling;
          while (dd && dd.tagName === 'DD') {
            p.append(document.createTextNode(' '), ...dd.childNodes);
            dd = dd.nextElementSibling;
          }
          if (clean(p.textContent)) out.push(p);
        });
      } else walk(c);
    });
  };
  walk(editorial);
  return out;
}

export default function parse(element, { document, params }) {
  const box = element.matches('.frach-m-link-box') ? element : element.querySelector('.frach-m-link-box');
  if (!box) return;

  const row = element.matches('.frach-grid-row') ? element : element.querySelector('.frach-grid-row');
  const cols = row ? gridColumns(row) : [];
  const boxCol = cols.find((c) => c.contains(box));
  const others = cols.filter((c) => c !== boxCol);

  const cardRows = [];
  let imageCell = [];
  others.forEach((col) => {
    col.querySelectorAll('.frach-m-card').forEach((card) => {
      const cell = cardComponent(document, card);
      if (cell.length) cardRows.push([cell]);
    });
    if (!col.querySelector('.frach-m-card')) {
      col.querySelectorAll('frach-m-image').forEach((img) => { imageCell.push(...imageComponent(document, img)); });
    }
  });
  imageCell = imageCell.map((n) => { if (n.dataset) delete n.dataset.caption; return n; });

  const panel = panelContent(document, box);
  const grey = element.matches('.frach-h-bg--grey') || !!element.closest('.frach-h-bg--grey');
  const light = grey && imageCell.length > 0;

  let cells;
  if (light) cells = [[imageCell, panel]];
  else cells = [[[...imageCell, ...panel]]];

  const block = WebImporter.Blocks.createBlock(document, { name: light ? 'link-box (light)' : 'link-box', cells });
  if (cardRows.length) {
    const cards = WebImporter.Blocks.createBlock(document, { name: 'cards', cells: cardRows });
    const frag = document.createDocumentFragment();
    frag.append(cards, block);
    element.replaceWith(frag);
    return;
  }
  element.replaceWith(block);
}
