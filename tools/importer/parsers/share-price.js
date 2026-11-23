/* eslint-disable */
/* global WebImporter */
import {
  para, clean, animatedNumber, pageLang, absUrl,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for share-price: frach-m-key-figures holding the live quote
 * (.frach-m-key-figures__exchange-data-wrapper).
 *
 * Block contract (blocks/share-price): one row, two cells — text cell (heading, copy) and
 * price cell (the price as displayed, e.g. "65,20 €", as no-JS fallback, then the caption
 * paragraph, e.g. "XETRA (Fraport AG)"). One cell only when the source has no text column.
 * No `source | <url>` config row: the source's data-exchange-url (fraport.com/chartjson/)
 * is a same-origin endpoint of the old site; the block's built-in quote endpoint is used.
 */
export default function parse(element, { document, params }) {
  const lang = pageLang(document, params);
  const root = element.matches('frach-m-key-figures') ? element
    : (element.querySelector('frach-m-key-figures:has(.frach-m-key-figures__exchange-data-wrapper)')
      || element.querySelector('frach-m-key-figures') || element);

  const textCell = [];
  const text = root.querySelector('.frach-m-key-figures__text');
  if (text) {
    const h = text.querySelector('.frach-m-key-figures__headline, h1, h2, h3, h4, h5, h6');
    if (h && clean(h.textContent)) {
      const heading = document.createElement(/^H[1-6]$/.test(h.tagName) ? h.tagName.toLowerCase() : 'h3');
      heading.textContent = clean(h.textContent);
      textCell.push(heading);
    }
    text.querySelectorAll('.frach-m-key-figures__copy, p').forEach((p) => {
      if (p !== h && clean(p.textContent)) textCell.push(para(document, document.createTextNode(clean(p.textContent))));
    });
  }

  const wrap = root.querySelector('.frach-m-key-figures__exchange-data-wrapper') || root;
  const priceCell = [];
  const price = animatedNumber(wrap.querySelector('frach-e-animated-number, .frach-m-key-figures__number-value'), lang);
  if (price) priceCell.push(para(document, document.createTextNode(price)));
  const caption = wrap.querySelector('.frach-m-key-figures__number-text');
  if (caption && clean(caption.textContent)) priceCell.push(para(document, document.createTextNode(clean(caption.textContent))));

  const cells = [textCell.length ? [textCell, priceCell] : [priceCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'share-price', cells });
  element.replaceWith(block);
}
