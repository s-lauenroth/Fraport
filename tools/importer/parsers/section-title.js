/* eslint-disable */
/* global WebImporter */
import {
  findRoot, clean, paraFrom,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for section-title (.frach-m-section-title): the ribbon headline (white semi-bold
 * italic text on a blue / gradient box) that opens a page section, with optional intro copy.
 *
 * Block contract (blocks/section-title): one cell — the heading as <h2> (a <br> starts the
 * next ribbon band; one band per source frach-e-headline__line) and optional paragraph(s).
 * Options (block classes), read from the source:
 * - primary | secondary | gradient: the headline's frach-h-bg--primary / --secondary /
 *   --gradient-* background (primary is the block default, emitted explicitly)
 * - nested: frach-m-section-title--nested (the title sits inside the following component)
 */
export default function parse(element, { document }) {
  const root = findRoot(element, '.frach-m-section-title');
  const headline = root.querySelector('h1, h2, h3, h4, h5, h6, .frach-e-headline');
  const cell = [];
  const options = [];

  if (headline && clean(headline.textContent)) {
    const cls = headline.getAttribute('class') || '';
    if (/frach-h-bg--gradient/.test(cls)) options.push('gradient');
    else if (/frach-h-bg--secondary/.test(cls)) options.push('secondary');
    else options.push('primary');
    const h2 = document.createElement('h2');
    const lines = [...headline.querySelectorAll('.frach-e-headline__line')]
      .map((l) => clean(l.textContent)).filter(Boolean);
    (lines.length ? lines : [clean(headline.textContent)]).forEach((line, i) => {
      if (i) h2.append(document.createElement('br'));
      h2.append(document.createTextNode(line));
    });
    cell.push(h2);
  }
  if (/(^|\s)frach-m-section-title--nested(\s|$)/.test(root.getAttribute('class') || '')) options.push('nested');

  root.querySelectorAll('p').forEach((p) => {
    if (headline && headline.contains(p)) return;
    if (clean(p.textContent)) cell.push(paraFrom(document, p));
  });

  if (!cell.length) {
    element.remove();
    return;
  }
  const name = options.length ? `section-title (${options.join(', ')})` : 'section-title';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: [[cell]] });
  element.replaceWith(block);
}
