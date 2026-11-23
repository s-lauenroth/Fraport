/* eslint-disable */
/* global WebImporter */
import {
  makeImage, para, link, clean, normalizeContent,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for teaser-feature (tile or its topic-wall wrapper div): frach-m-topicwall-1-by-2 (image + white text
 * panel) and frach-m-topicwall-1-by-4__blue (image with the link text over it).
 *
 * Block contract (blocks/teaser-feature): one row — picture cell and text cell (heading,
 * copy paragraphs, a link paragraph = the teaser target); decoded by role.
 * Variant `square-text-over-image`: the blue 1-by-4 tile (text directly over the image).
 */
export default function parse(element, { document, params }) {
  const tile = element.matches('frach-m-topicwall-1-by-2, frach-m-topicwall-1-by-4') ? element
    : (element.querySelector('frach-m-topicwall-1-by-2, frach-m-topicwall-1-by-4.frach-m-topicwall-1-by-4__blue, frach-m-topicwall-1-by-4') || element);
  const blue = /frach-m-topicwall-1-by-4__blue/.test(tile.className || '')
    || !!element.querySelector('.frach-m-topicwall-1-by-4__blue');

  const imgWrap = tile.querySelector('[class*="__image-container"]') || tile;
  const img = makeImage(document, imgWrap);

  const text = [];
  const contents = [...tile.querySelectorAll('[class*="__content"]')]
    .filter((c) => !c.parentElement.closest('[class*="__content"]') || c.matches('.frach-m-topicwall-1-by-4__content'));
  const content = tile.querySelector('.frach-m-topicwall-1-by-4__content') || contents[0];
  if (content) {
    normalizeContent(document, content);
    content.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a[href]').forEach((n) => {
      if (n.matches('a') && n.closest('p, h1, h2, h3, h4, h5, h6')) return;
      if (!clean(n.textContent)) return;
      if (/^H[1-6]$/.test(n.tagName)) {
        const h = document.createElement(n.tagName.toLowerCase());
        h.textContent = clean(n.textContent);
        text.push(h);
      } else if (n.tagName === 'A') {
        text.push(para(document, link(document, n.getAttribute('href'), n.textContent)));
      } else {
        text.push(n);
      }
    });
  }

  const row = [];
  if (img) row.push([para(document, img)]);
  if (text.length) row.push(text);
  const name = blue ? 'teaser-feature (square-text-over-image)' : 'teaser-feature';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: [row.length ? row : ['']] });
  element.replaceWith(block);
}
