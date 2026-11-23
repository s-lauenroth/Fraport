/* eslint-disable */
/* global WebImporter */
import {
  makeImage, para, link, clean, gridColumns, imageTextCard,
} from '../utils/fraport-parser-utils.js';
import textMediaParser from './text-media.js';

/**
 * Parser for cards-teaser (frach-m-teaser-slider.frach-m-related-content).
 *
 * Block contract (blocks/cards-teaser): one row per card — optional picture paragraph,
 * theme paragraph, heading (linked: the card target), teaser paragraph, and a link
 * paragraph (the "Lesen" link).
 *
 * Repeating unit: div.frach-m-teaser (a slide can hold one or two teasers). Works on the
 * outer AEM wrapper, the frach-m-teaser-slider, or a bare slider viewport.
 * Fallback shape (the catalog maps it here on the home page): a frach-grid-row of
 * frach-m-image + frach-m-text columns, one card per grid column.
 */
export default function parse(element, { document, params }) {
  const seen = new Set();
  const teasers = [...element.querySelectorAll('.frach-m-teaser')]
    .filter((t) => !t.parentElement.closest('.frach-m-teaser'))
    .filter((t) => {
      const h = t.querySelector('.frach-m-teaser__headline');
      const a = t.querySelector('a[href]');
      const key = `${clean(h && h.textContent)}|${a ? a.getAttribute('href') : ''}`;
      if (seen.has(key)) return false; // slider clones
      seen.add(key);
      return true;
    });

  const cells = [];
  if (!teasers.length) {
    const row = element.matches('.frach-grid-row') ? element : element.querySelector('.frach-grid-row');
    // a portrait image column beside a pull quote (frach-e-pull-quote in a text-media column) is a
    // quote layout, not a card row: read as cards the quote would be lost, so text-media parses it
    if (row && row.querySelector('.frach-e-pull-quote')) {
      textMediaParser(element, { document, params });
      return;
    }
    gridColumns(row).forEach((col) => {
      const cell = imageTextCard(document, col);
      if (cell.length) cells.push([cell]);
    });
  }
  teasers.forEach((teaser) => {
    const cell = [];
    const imgWrap = teaser.querySelector('.frach-m-teaser__image-wrapper');
    const img = imgWrap ? makeImage(document, imgWrap) : null;
    if (img) cell.push(para(document, img));

    const theme = teaser.querySelector('.frach-m-teaser__theme');
    if (theme && clean(theme.textContent)) {
      cell.push(para(document, document.createTextNode(clean(theme.textContent).replace(/\s+,/g, ','))));
    }

    const cta = teaser.querySelector('a.frach-m-teaser__link[href], a.frach-e-button[href]');
    const headline = teaser.querySelector('.frach-m-teaser__headline');
    if (headline && clean(headline.textContent)) {
      const level = /^H[1-6]$/.test(headline.tagName) ? headline.tagName.toLowerCase() : 'h6';
      const h = document.createElement(level);
      const ha = headline.querySelector('a[href]');
      const href = (ha && ha.getAttribute('href')) || (cta && cta.getAttribute('href'));
      if (href) h.append(link(document, href, headline.textContent));
      else h.textContent = clean(headline.textContent);
      cell.push(h);
    }

    teaser.querySelectorAll('.frach-m-teaser__text').forEach((t) => {
      if (clean(t.textContent)) cell.push(para(document, document.createTextNode(clean(t.textContent))));
    });

    if (cta) {
      const label = cta.querySelector('.frach-e-button__label') || cta;
      if (clean(label.textContent)) cell.push(para(document, link(document, cta.getAttribute('href'), label.textContent)));
    }

    if (cell.length) cells.push([cell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-teaser', cells });
  element.replaceWith(block);
}
