/* eslint-disable */
/* global WebImporter */
import {
  findRoot, gridColumns, makeImage, textContent, para, clean, imageTextCard,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for cards: a frach-grid-row of image + text columns (teaser cards), or a
 * frach-m-contact-list (contact cards).
 *
 * Block contract (blocks/cards): one row per card, one cell per card holding
 * a picture paragraph, an optional date paragraph (dated), optional theme/meta
 * paragraphs and a heading whose link is the card target.
 * Variants: `contact` (frach-m-contact items), `dated` (first text line is a date).
 */
const DATE = /^\s*\d{1,2}\.\d{1,2}\.\d{4}\s*$/;

function contactCell(document, col) {
  const cell = [];
  const img = makeImage(document, col);
  if (img) cell.push(para(document, img));
  const info = col.querySelector('address, .frach-m-contact__info');
  if (info) cell.push(...textContent(document, info));
  return cell;
}

export default function parse(element, { document, params }) {
  const isContact = !!element.querySelector('.frach-m-contact') || element.matches('.frach-m-contact-list');
  const row = isContact
    ? (element.querySelector('.frach-m-contact-list .frach-grid-row') || findRoot(element, '.frach-grid-row'))
    : findRoot(element, '.frach-grid-row');

  let cols = gridColumns(row);
  if (!cols.length) cols = [row];

  const cells = [];
  let dated = false;
  cols.forEach((col) => {
    const cell = isContact ? contactCell(document, col) : imageTextCard(document, col);
    if (!cell.length) return;
    const firstText = cell.find((n) => n.tagName === 'P' && clean(n.textContent));
    if (!isContact && firstText && DATE.test(firstText.textContent)) dated = true;
    cells.push([cell]);
  });

  let name = 'cards';
  if (isContact) name = 'cards (contact)';
  else if (dated) name = 'cards (dated)';

  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
