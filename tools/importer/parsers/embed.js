/* eslint-disable */
/* global WebImporter */
import {
  gridColumns, componentContent, para, link, bestSrc, clean, restoreIframes,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for embed (outer AEM section, grid row, tab panel or bare iframe): frach-m-embed iframes (YouTube nocookie videos in grid columns), the
 * walls.io social wall, booking / chat iframes (iframe.moin-ai-teaser).
 *
 * Block contract (blocks/embed): one row, one cell per column. A cell holding only a link
 * becomes a player (href = iframe src, link text = iframe title); any other cell stays rich
 * text.
 * Variant `wall`: walls.io social wall (the block needs the class for its tall scrolling
 * frame; the catalog left these instances without a variant).
 */
function iframeSrc(iframe) {
  const src = bestSrc(iframe) || iframe.getAttribute('data-url') || '';
  const yt = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  return src;
}

function playerCell(document, iframe) {
  const src = iframeSrc(iframe);
  if (!src) return null;
  const title = clean(iframe.getAttribute('title')) || src;
  return [para(document, link(document, src, title))];
}

function cellFor(document, scope) {
  const iframes = scope.matches('iframe') ? [scope] : [...scope.querySelectorAll('iframe')];
  const textish = scope.querySelector('.frach-m-text, .cmp-text, frach-m-image');
  if (iframes.length === 1 && !textish) return playerCell(document, iframes[0]);
  if (!iframes.length && !textish) return null;
  // mixed column: keep rich content, iframes become link paragraphs in place
  return componentContent(document, scope);
}

export default function parse(element, { document, params }) {
  restoreIframes(document, element);
  const row = element.matches('.frach-grid-row') ? element : element.querySelector('.frach-grid-row');
  let scopes = row ? gridColumns(row) : [];
  if (!scopes.length) scopes = [element];

  const frames = element.matches('iframe') ? [element] : [...element.querySelectorAll('iframe')];
  const wall = frames.some((f) => /walls\.io/i.test(iframeSrc(f)));

  const cellsRow = scopes.map((s) => cellFor(document, s)).filter((c) => c && c.length);
  if (!cellsRow.length) {
    // e.g. iframe#moin-ai-teaser: the chat widget teaser frame (no src, JS-injected site
    // chrome) — nothing to embed, so drop it rather than leave an empty block.
    element.remove();
    return;
  }
  const cells = [cellsRow];
  const block = WebImporter.Blocks.createBlock(document, { name: wall ? 'embed (wall)' : 'embed', cells });
  element.replaceWith(block);
}
