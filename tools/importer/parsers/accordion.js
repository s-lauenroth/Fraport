/* eslint-disable */
/* global WebImporter */
import {
  clean, normalizeContent, gridColumns,
} from '../utils/fraport-parser-utils.js';
import downloadsParser from './downloads.js';
import cardsParser from './cards.js';
import tableDataParser from './table-data.js';
import ctaParser from './cta.js';
import linkBoxParser from './link-box.js';
import columnsParser from './columns.js';
import galleryParser from './image-gallery-tiles.js';

/**
 * Parser for accordion (frach-m-accordion).
 *
 * Block contract (blocks/accordion): one row per item — label | id (optional anchor id).
 * The panel content is the default content / blocks that FOLLOW the block in the same
 * section, up to the next accordion block. So every source item becomes its own
 * one-row accordion table followed by that item's panel content, and a section break (<hr>)
 * follows the last item's panel, so content after the accordion is not adopted as its panel.
 *
 * Panel content stays as moved source content (shared normalizeContent: images, icons, button
 * styles), except nested components converted to blocks: download lists become a `downloads` block, contact lists a `cards (contact)` block, source tables
 * `table-data`, CTA bands `cta`, link boxes `link-box`, multi-column grid rows `columns`
 * (converted in place, while still inside the source panel, so their parsers see it).
 *
 * Handles: frach-m-accordion root, an outer AEM wrapper around it, or a single
 * item wrapper (div.wcm-io-parsys / .frach-m-accordion__section).
 * Options (blocks/accordion/metadata.json):
 * - open: the item is expanded on the source (checked input / aria-expanded toggle /
 *   frach-state-active item)
 * - grey: the panel holds a download list (panel content on a grey band)
 * - shadow: the panel holds contact cards (adopted cards are raised)
 */

// AEM auto-generated ids (accordionrow, accordionrow_123_456, accordion-5dd77cf4f2) are not anchors
const AUTO_ID = /^(accordionrow[\w-]*|accordion-[0-9a-f]+)$/i;

/** [selector, parser, element resolver] — converted in place inside a panel, in order */
const NESTED = [
  ['frach-e-table', tableDataParser],
  ['.frach-m-download-list', downloadsParser],
  ['.frach-m-contact-list', cardsParser],
  ['.frach-m-cta', ctaParser],
  ['.frach-m-link-box', linkBoxParser],
  // image galleries (tiles + lightbox) -> image-gallery-tiles, so the lightbox's full-size
  // images do not stay behind as stacked default content in the panel
  ['frach-m-image-gallery-tiles, .frach-m-image-gallery', galleryParser],
];

function convertNested(document, inner, params) {
  NESTED.forEach(([selector, parser, resolve]) => {
    let guard = 0;
    const next = () => [...inner.querySelectorAll(selector)].find((n) => !n.closest('[data-acc-done], table'));
    let el = next();
    while (el && guard < 50) {
      guard += 1;
      const target = resolve ? resolve(el) : el;
      try { parser(target, { document, params }); } catch (e) { /* leave as content */ }
      if (target.isConnected && inner.contains(target)) target.setAttribute('data-acc-done', '');
      el = next();
    }
  });
  // multi-column grid rows (image / text columns) -> columns blocks (grey: inside a panel)
  [...inner.querySelectorAll('.frach-grid-row')].forEach((row) => {
    if (!row.isConnected || row.closest('table') || gridColumns(row).length < 2) return;
    if (row.parentElement && row.parentElement.closest('.frach-grid-row') && inner.contains(row.parentElement.closest('.frach-grid-row'))) return;
    try { columnsParser(row, { document, params }); } catch (e) { /* leave as content */ }
  });
  inner.querySelectorAll('[data-acc-done]').forEach((n) => n.removeAttribute('data-acc-done'));
}

function isOpen(item) {
  const input = item.querySelector('.frach-m-accordion__input');
  const toggle = item.querySelector('.frach-m-accordion__toggle');
  return !!((input && input.hasAttribute('checked'))
    || (toggle && toggle.getAttribute('aria-expanded') === 'true')
    || /(^|\s)frach-state-active(\s|$)/.test(item.getAttribute('class') || ''));
}

/** later items of the same source accordion (not yet converted) */
function hasFollowingItem(item) {
  const acc = item.closest('frach-m-accordion, .frach-m-accordion__accordion-container');
  const scope = acc || item.parentElement;
  if (!scope) return false;
  return [...scope.querySelectorAll('.frach-m-accordion__section')]
    .some((s) => s !== item && !item.contains(s) && (item.compareDocumentPosition(s) & 4));
}

export default function parse(element, { document, params }) {
  const scope = element.matches('frach-m-accordion') ? element
    : (element.querySelector('frach-m-accordion') || element);

  let items = [...scope.querySelectorAll('.frach-m-accordion__section')].filter((s) => {
    // skip items of accordions nested inside another item's panel
    const parentInner = s.parentElement && s.parentElement.closest('.frach-m-accordion__section-inner');
    return !parentInner || !scope.contains(parentInner);
  });
  if (scope.matches('.frach-m-accordion__section')) items = [scope];
  if (!items.length) {
    const up = element.closest('.frach-m-accordion__section');
    if (up) items = [up];
  }

  const frag = document.createDocumentFragment();

  if (!items.length) {
    // Snippet without accordion chrome (e.g. a cached panel fragment): keep it as one panel.
    convertNested(document, element, params);
    normalizeContent(document, element);
    const content = [...element.childNodes];
    frag.append(WebImporter.Blocks.createBlock(document, { name: 'accordion', cells: [['']] }), ...content);
    frag.append(document.createElement('hr'));
    element.replaceWith(frag);
    return;
  }

  const last = items[items.length - 1];
  const closesGroup = !hasFollowingItem(last);

  items.forEach((item) => {
    const labelEl = item.querySelector('.frach-m-accordion__toggle-label')
      || item.querySelector('.frach-m-accordion__toggle');
    const label = labelEl ? clean(labelEl.textContent) : '';
    const input = item.querySelector('.frach-m-accordion__input');
    const id = input && input.id && !AUTO_ID.test(input.id) ? input.id : '';

    const inner = item.querySelector('.frach-m-accordion__section-inner')
      || item.querySelector('.frach-m-accordion__section-content');
    const options = [];
    if (isOpen(item)) options.push('open');
    if (inner && inner.querySelector('.frach-m-download-list')) options.push('grey');
    else if (inner && inner.querySelector('.frach-m-contact')) options.push('shadow');

    const name = options.length ? `accordion (${options.join(', ')})` : 'accordion';
    frag.append(WebImporter.Blocks.createBlock(document, { name, cells: [[label, id]] }));

    if (inner) {
      inner.querySelectorAll('input.frach-m-accordion__input, label.frach-m-accordion__toggle').forEach((n) => n.remove());
      convertNested(document, inner, params);
      // the rest of the panel is moved as is (normalized: images, icons, button styles) — the
      // importer converts its text components like default content; the panel follows the
      // item's table directly
      normalizeContent(document, inner);
      if (clean(inner.textContent) || inner.querySelector('img, iframe, video, table')) {
        const panel = document.createElement('div');
        panel.append(...inner.childNodes);
        frag.append(panel);
      }
    }
  });

  // the block adopts everything after it in its section: end the section after the last panel
  if (closesGroup) frag.append(document.createElement('hr'));
  element.replaceWith(frag);
}
