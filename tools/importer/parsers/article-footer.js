/* eslint-disable */
/* global WebImporter */
import { para, link, clean } from '../utils/fraport-parser-utils.js';
import { tagListBlock } from './tag-list.js';

/**
 * Parser for article-footer: an article's page meta data (.frach-m-page-meta-data in the stage
 * frach-m-hero) when it holds a "zurück zur Übersicht" back link: date, back link, topic tags.
 *
 * Block contract (blocks/article-footer): one row; a cell with the single back link (and a cell
 * with tag LINKS). The source tags are plain frach-e-tag labels without links, which the block
 * would drop (it renders links only), so they follow as a tag-list block (its parser builds
 * them; text tags render as pills). The date (<time>) stays default content before the block;
 * the hidden reading-time item (display: none on the source) is not imported.
 */
function linkLabel(a) {
  const copy = a.cloneNode(true);
  copy.querySelectorAll('frach-e-icon, noscript, svg, img').forEach((n) => n.remove());
  return clean(copy.textContent) || clean(a.getAttribute('title'));
}

export default function parse(element, { document }) {
  const root = element.matches('.frach-m-page-meta-data') ? element
    : (element.querySelector('.frach-m-page-meta-data') || element);
  const out = [];

  const time = root.querySelector('.frach-m-page-meta-data__date time, .frach-m-page-meta-data__date');
  const date = time && clean(time.textContent);
  if (date) out.push(para(document, document.createTextNode(date)));

  const backSrc = root.querySelector('.frach-m-page-meta-data__text a[href]');
  const label = backSrc && linkLabel(backSrc);
  if (backSrc && label) {
    const cells = [[para(document, link(document, backSrc.getAttribute('href'), label))]];
    out.push(WebImporter.Blocks.createBlock(document, { name: 'article-footer', cells }));
  }

  const tags = root.querySelector('.frach-m-page-meta-data__tags');
  const tagBlock = tags && tagListBlock(document, tags);
  if (tagBlock) out.push(tagBlock);

  if (out.length) element.replaceWith(...out);
  else element.remove();
}
