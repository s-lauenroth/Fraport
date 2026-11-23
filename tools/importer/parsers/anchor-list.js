/* eslint-disable */
/* global WebImporter */
import {
  findRoot, clean, absUrl,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for anchor-list (frach-m-anchor-list): the in-page jump bar ("Sprungmarkenliste").
 *
 * Block contract (blocks/anchor-list): one cell holding a list of in-page links
 * (<ul><li><a href="#id">label</a></li></ul>). The targets are section ids: the sections
 * transformer gives each target's section a Section Metadata `id` (see fraport-sections.js).
 * Option `numbered`: the source anchors carry running numbers (frach-m-anchor-list__number,
 * "01 Aktuelles"); the block renders the numbers itself, so only the label text is kept.
 *
 * Dropped chrome: slider prev / next buttons, the toggle checkbox and the label row (a copy of
 * the current anchor).
 */
function pagePath(u) {
  try { return new URL(u).pathname.replace(/\.html?$/, '').replace(/\/$/, ''); } catch (e) { return ''; }
}

export default function parse(element, { document, params }) {
  const root = findRoot(element, 'frach-m-anchor-list, .frach-m-anchor-list');
  const content = root.querySelector('.frach-m-accordion__section-content');
  let anchors = content ? [...content.querySelectorAll('a[href]')] : [];
  if (!anchors.length) {
    anchors = [...root.querySelectorAll('a.frach-m-anchor-list__anchor[href]')]
      .filter((a) => !a.classList.contains('frach-m-anchor-list__anchor--toggle-item'));
  }
  const page = pagePath((params && params.originalURL) || '');
  const numbered = anchors.some((a) => a.querySelector('.frach-m-anchor-list__number'));

  const ul = document.createElement('ul');
  const seen = new Set();
  anchors.forEach((a) => {
    const textEl = a.querySelector('.frach-m-anchor-list__text') || a;
    const text = clean(textEl.textContent);
    let href = a.getAttribute('href') || '';
    if (!text || !href) return;
    if (!href.startsWith('#')) {
      const abs = absUrl(href);
      const hash = abs.includes('#') ? abs.slice(abs.indexOf('#')) : '';
      href = hash && pagePath(abs) === page ? hash : abs;
    }
    if (seen.has(href)) return;
    seen.add(href);
    const li = document.createElement('li');
    const l = document.createElement('a');
    l.setAttribute('href', href);
    l.textContent = text;
    li.append(l);
    ul.append(li);
  });

  if (!ul.children.length) {
    element.remove();
    return;
  }
  const name = numbered ? 'anchor-list (numbered)' : 'anchor-list';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: [[ul]] });
  element.replaceWith(block);
}
