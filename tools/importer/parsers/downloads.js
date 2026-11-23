/* eslint-disable */
/* global WebImporter */
import { downloadList, clean, componentContent } from '../utils/fraport-parser-utils.js';

/**
 * Parser for downloads: frach-m-download-list groups (typically inside a tab panel; also
 * reused by the tabs-topic parser for panels moved into fragments).
 *
 * Block contract (blocks/downloads): one cell — headings start groups; each list item holds
 * one link; the text after a line break is the file meta line ("PDF, 879 KB").
 *
 * The element may be the download list itself (its group heading
 * h6.frach-m-download-list__hdl is the preceding sibling), or a container (tab panel, grid
 * row, section) holding several heading + list groups.
 */
function groupHeading(document, list) {
  let prev = list.previousElementSibling;
  while (prev && !clean(prev.textContent)) prev = prev.previousElementSibling;
  if (!prev || !prev.matches('.frach-m-download-list__hdl, h1, h2, h3, h4, h5, h6')) return null;
  const level = /^H[1-6]$/.test(prev.tagName) ? prev.tagName.toLowerCase() : 'h6';
  const h = document.createElement(level);
  h.textContent = clean(prev.textContent);
  prev.remove();
  return h;
}

export default function parse(element, { document, params }) {
  const cell = [];
  if (element.matches('.frach-m-download-list')) {
    const h = groupHeading(document, element);
    const ul = downloadList(document, element);
    if (ul) cell.push(...(h ? [h, ul] : [ul]));
  } else if (element.querySelector('.frach-m-download-list')) {
    // container (tab panel / grid): headings, download lists and link paragraphs in order;
    // the block renders plain (non-file) links of a group as an arrow link list
    cell.push(...componentContent(document, element));
  }

  // Nothing to import (e.g. the panel was already moved into a tabs fragment).
  if (!cell.length) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'downloads', cells: [[cell]] });
  element.replaceWith(block);
}
