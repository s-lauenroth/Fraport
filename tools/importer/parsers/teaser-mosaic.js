/* eslint-disable */
/* global WebImporter */
import {
  makeImage, para, link, clean, normalizeContent, bestSrc, absUrl,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for teaser-mosaic (frach-m-topicwall-first-row or its div.firstRow wrapper: one 16:9 main tile + small tiles).
 *
 * Block contract (blocks/teaser-mosaic): one row per tile in reading order, the first row
 * the main tile — picture + text (heading / paragraphs / link), picture only, empty (colour
 * tile), or a video link with an optional poster picture.
 *
 * Variants:
 * - video: the main tile is a frach-e-lazy-video (mp4 link + poster)
 * - alt: heuristic from the cached instances — the main tile's text panel spans the tile
 *   when all small 1/8 tiles are white (no gradient / colour tiles)
 */
function textOf(document, content) {
  const out = [];
  if (!content) return out;
  normalizeContent(document, content);
  content.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a[href]').forEach((n) => {
    if (n.matches('a') && n.closest('p, h1, h2, h3, h4, h5, h6')) return;
    if (!clean(n.textContent)) return;
    if (/^H[1-6]$/.test(n.tagName)) {
      const h = document.createElement(n.tagName.toLowerCase());
      h.textContent = clean(n.textContent);
      out.push(h);
    } else if (n.tagName === 'A') out.push(para(document, link(document, n.getAttribute('href'), n.textContent)));
    else out.push(n);
  });
  return out;
}

function videoCell(document, video) {
  const source = video.querySelector('video source[src], source[data-src], source[src]');
  const src = source ? (bestSrc(source)) : '';
  if (!src) return null;
  const cell = [para(document, link(document, src, absUrl(src)))];
  const v = video.querySelector('video[poster]');
  const posterSrc = (v && v.getAttribute('poster')) || bestSrc(video.querySelector('img'));
  if (posterSrc) {
    const img = document.createElement('img');
    img.setAttribute('src', absUrl(posterSrc));
    cell.unshift(para(document, img));
  }
  return cell;
}

export default function parse(element, { document, params }) {
  const row = element.matches('frach-m-topicwall-first-row') ? element
    : (element.querySelector('frach-m-topicwall-first-row') || element);

  const tiles = [...row.children].filter((c) => c.querySelector('[class*="frach-m-topicwall-"]') || /frach-m-topicwall-/.test(c.className || ''));
  const cells = [];
  let video = false;

  tiles.forEach((tile, i) => {
    const lazyVideo = tile.querySelector('frach-e-lazy-video, .frach-e-lazy-video');
    if (lazyVideo) {
      const cell = videoCell(document, lazyVideo);
      if (cell) {
        if (i === 0) video = true;
        cells.push([cell]);
        return;
      }
    }
    const cell = [];
    const imgWrap = tile.querySelector('[class*="__image-container"]');
    const img = imgWrap ? makeImage(document, imgWrap) : null;
    if (img) cell.push(para(document, img));
    const content = tile.querySelector('[class*="__content-box"], [class*="__content"]');
    if (content) {
      const icon = content.querySelector('img[class*="item-icon"], img');
      if (icon && !img) {
        const iconImg = makeImage(document, icon);
        if (iconImg) cell.push(para(document, iconImg));
      }
      cell.push(...textOf(document, content));
    }
    cells.push([cell.length ? cell : '']);
  });

  const smallTiles = [...row.querySelectorAll('frach-m-topicwall-1-by-8')];
  const alt = !video && smallTiles.length > 0
    && smallTiles.every((t) => /__white/.test(t.className || ''));

  let name = 'teaser-mosaic';
  if (video) name = 'teaser-mosaic (video)';
  else if (alt) name = 'teaser-mosaic (alt)';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: cells.length ? cells : [['']] });
  element.replaceWith(block);
}
