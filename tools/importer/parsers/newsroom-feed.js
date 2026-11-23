/* eslint-disable */
/* global WebImporter */
import {
  makeImage, para, link, clean, gridColumns, componentContent,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for newsroom-feed (.frach-m-teaser-collection--card-view, or the grid row holding it).
 *
 * Block contract (blocks/newsroom-feed): a heading row (panel title), item rows (date, time
 * and a headline link paragraph), then a row of CTA link paragraphs (<strong> primary,
 * <em> secondary). Directly after a `cards` block the feed becomes that grid's aside.
 *
 * Shapes:
 * - card view: frach-m-card news cards + a "Weitere Meldungen" link box -> a `cards (dated)`
 *   block (picture, date, theme, linked heading) followed by the newsroom-feed block.
 * - list view (variant `thumbnails`): a.frach-m-teaser-collection__list-item rows with
 *   thumbnail, date / time, headline and teaser; matched as part of a grid row whose other
 *   column(s) are kept as default content after the block.
 */
function dateTime(document, scope) {
  const out = [];
  const date = scope.querySelector('.frach-m-teaser-collection__list-item-date, .frach-m-card__date');
  if (!date) return out;
  const spans = [...date.querySelectorAll(':scope > span, time')];
  const time = date.querySelector('time');
  const d = clean(time ? time.textContent : (spans[0] && spans[0].textContent) || date.textContent);
  if (d) out.push(para(document, document.createTextNode(d)));
  const t = spans.map((s) => clean(s.textContent)).find((s) => /Uhr|\d{1,2}:\d{2}/.test(s) && s !== d);
  if (t) out.push(para(document, document.createTextNode(t)));
  return out;
}

function ctaParagraphs(document, scope) {
  return [...scope.querySelectorAll('a.frach-e-button[href]')].map((a) => {
    const label = a.querySelector('.frach-e-button__label') || a;
    if (!clean(label.textContent)) return null;
    const l = link(document, a.getAttribute('href'), label.textContent);
    const cls = a.className || '';
    let wrapped = l;
    if (/frach-e-button--primary/.test(cls)) { wrapped = document.createElement('strong'); wrapped.append(l); }
    else if (/frach-e-button--secondary/.test(cls)) { wrapped = document.createElement('em'); wrapped.append(l); }
    return para(document, wrapped);
  }).filter(Boolean);
}

export default function parse(element, { document, params }) {
  const tc = element.matches('.frach-m-teaser-collection') ? element
    : (element.querySelector('.frach-m-teaser-collection') || element);

  const cells = [];
  const before = [];
  const after = [];
  let thumbnails = false;

  const box = tc.querySelector('.frach-m-teaser-collection__link-box, .frach-m-link-box');
  const listItems = [...tc.querySelectorAll('a.frach-m-teaser-collection__list-item')];

  if (listItems.length) {
    thumbnails = true;
    listItems.forEach((item) => {
      const cell = [];
      const img = makeImage(document, item.querySelector('.frach-m-teaser-collection__list-item-image-wrapper') || item);
      if (img) cell.push(para(document, img));
      cell.push(...dateTime(document, item));
      const hl = item.querySelector('.frach-m-teaser-collection__list-item-headline');
      if (hl && clean(hl.textContent)) cell.push(para(document, link(document, item.getAttribute('href'), hl.textContent)));
      const desc = item.querySelector('.frach-m-teaser-collection__list-item-description');
      if (desc && clean(desc.textContent)) cell.push(para(document, document.createTextNode(clean(desc.textContent))));
      if (cell.length) cells.push([cell]);
    });
    const ctas = ctaParagraphs(document, tc);
    if (ctas.length) cells.push([ctas]);
  } else {
    // card view: news cards before the feed panel
    const cardRows = [];
    tc.querySelectorAll('.frach-m-card').forEach((card) => {
      const a = card.querySelector('a[href]');
      const cell = [];
      const img = makeImage(document, card.querySelector('.frach-m-card__image-wrapper') || card);
      if (img) cell.push(para(document, img));
      cell.push(...dateTime(document, card).slice(0, 1));
      const theme = card.querySelector('.frach-m-teaser__theme');
      if (theme && clean(theme.textContent)) cell.push(para(document, document.createTextNode(clean(theme.textContent).replace(/\s+,/g, ','))));
      const h = card.querySelector('h1, h2, h3, h4, h5, h6');
      if (h) {
        const heading = document.createElement(h.tagName.toLowerCase());
        if (a) heading.append(link(document, a.getAttribute('href'), h.textContent));
        else heading.textContent = clean(h.textContent);
        cell.push(heading);
      }
      if (cell.length) cardRows.push([cell]);
    });
    if (cardRows.length) before.push(WebImporter.Blocks.createBlock(document, { name: 'cards (dated)', cells: cardRows }));

    if (box) {
      const title = box.querySelector('h1, h2, h3, h4, h5, h6');
      if (title && clean(title.textContent)) {
        const h = document.createElement(title.tagName.toLowerCase());
        h.textContent = clean(title.textContent);
        cells.push([h]);
      }
      box.querySelectorAll('a.frach-m-teaser-collection__link-box-item[href]').forEach((item) => {
        const cell = dateTime(document, item);
        const hl = item.querySelector('.frach-m-teaser-collection__link-box-item-headline');
        const text = clean(hl ? hl.textContent : item.textContent);
        if (text) cell.push(para(document, link(document, item.getAttribute('href'), text)));
        if (cell.length) cells.push([cell]);
      });
      const ctas = ctaParagraphs(document, box);
      if (ctas.length) cells.push([ctas]);
    }
  }

  // other grid columns of a matched row (outside the teaser collection) stay as content
  const row = element.matches('.frach-grid-row') ? element : null;
  if (row) {
    gridColumns(row).filter((c) => !c.contains(tc)).forEach((c) => after.push(...componentContent(document, c)));
  }

  const name = thumbnails ? 'newsroom-feed (thumbnails)' : 'newsroom-feed';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: cells.length ? cells : [['']] });
  if (before.length || after.length) {
    const frag = document.createDocumentFragment();
    frag.append(...before, block, ...after);
    element.replaceWith(frag);
    return;
  }
  element.replaceWith(block);
}
