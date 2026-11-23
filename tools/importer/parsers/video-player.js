/* eslint-disable */
/* global WebImporter */
import {
  para, link, clean, bestSrc, absUrl, createImg,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for video-player: frach-e-lazy-video (or its topic-wall 16:9 tile wrapper; also an inline
 * video inside an image component).
 *
 * Block contract (blocks/video-player): one row — the video link (mp4 / YouTube / Vimeo),
 * an optional poster picture, optional caption paragraphs.
 * Variant `autoplay-background`: the inline, looping video of an image component
 * (.frach-m-image__inline-video-container) or a lazy video with autoplay="true".
 */
export default function parse(element, { document, params }) {
  const lazy = element.matches('frach-e-lazy-video, .frach-e-lazy-video') ? element
    : element.querySelector('frach-e-lazy-video, .frach-e-lazy-video');
  const scope = lazy || element;

  const cell = [];
  const source = scope.querySelector('video source[src], source[data-src], source[src], video[src]');
  let src = source ? bestSrc(source) : '';
  if (!src) {
    const frame = scope.querySelector('iframe');
    if (frame) src = bestSrc(frame);
  }
  // the generic 16:9 tile selector also matches image + text tiles: no video -> not ours
  if (!src) return;
  cell.push(para(document, link(document, src, absUrl(src))));

  const video = scope.querySelector('video[poster]');
  const posterSrc = (video && video.getAttribute('poster')) || bestSrc(scope.querySelector(':scope > img, img'));
  if (posterSrc) cell.push(para(document, createImg(document, posterSrc, '')));

  // caption: a figure caption of the surrounding image component, or tile text
  const fig = element.closest('figure') || element.querySelector('figure');
  const cap = fig && fig.querySelector('figcaption');
  if (cap && clean(cap.textContent)) cell.push(para(document, document.createTextNode(clean(cap.textContent))));

  const autoplay = (lazy && lazy.getAttribute('autoplay') === 'true')
    || !!element.closest('.frach-m-image__inline-video-container')
    || !!element.querySelector('.frach-m-image__inline-video-container');
  const name = autoplay ? 'video-player (autoplay-background)' : 'video-player';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: [[cell.length ? cell : '']] });
  element.replaceWith(block);
}
