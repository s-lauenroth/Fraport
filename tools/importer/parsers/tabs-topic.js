/* eslint-disable */
/* global WebImporter */
import {
  clean, para, componentContent, gridColumns,
} from '../utils/fraport-parser-utils.js';
import accordionParser from './accordion.js';
import downloadsParser from './downloads.js';
import tableDataParser from './table-data.js';
import keyFiguresParser from './key-figures.js';
import embedParser from './embed.js';
import formParser from './form.js';
import galleryParser from './image-gallery-tiles.js';
import carouselParser from './carousel-text-media.js';
import ctaParser from './cta.js';
import linkBoxParser from './link-box.js';
import cardsParser from './cards.js';
import columnsParser from './columns.js';
import testimonialParser from './testimonial.js';

/**
 * Parser for tabs-topic (frach-m-tab-navigation inside frach-m-tabbed-content, or the tabbed content / its section).
 *
 * Block contract (blocks/tabs-topic): one row per tab — label cell | panel cell. The panel
 * cell holds rich content, or a single link; a `/fragments/…` link (in its own paragraph)
 * is auto-blocked by the page into the panel.
 *
 * Panels:
 * - simple panels (text only) stay inline in the panel cell;
 * - panels with blocks (download lists, tables, accordions, galleries, key figures, embeds,
 *   forms, multi-column grids, …) are moved into a fragment document pushed onto
 *   params.fragments as { element, path } with path
 *   /fragments/<page path>/<tab label slug>; the panel cell links to it. The nested
 *   components are converted to their blocks here (their own parsers would never see them
 *   once the panel left the page).
 * A tab without a panel becomes a one-cell row (label only).
 * Variant `alt` is not emitted: the catalog's alt instances (2-5 tabs) share every source
 * trait with the default ones (same frach-m-tab-navigation markup, same panel components),
 * and the block renders alt like the default; the tab count is not a source variant.
 */
const slug = (s) => s.toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/ß/g, 'ss')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '') || 'tab';

const COMPLEX = 'table, frach-m-accordion, .frach-m-download-list, frach-e-table, frach-m-key-figures, '
  + 'frach-m-pictogram-key-figures, iframe, frach-m-embed, form, .fraformsform, frach-m-image-gallery-tiles, '
  + '.frach-m-image-gallery, .frach-m-contact, .frach-m-card, frach-m-teaser-slider, .frach-m-cta, '
  + '.frach-m-link-box, frach-m-milestones, frach-e-lazy-image, img, frach-m-image';

/** [selector, parser, element resolver] — applied in order inside a fragment container */
const NESTED = [
  ['frach-m-accordion', accordionParser],
  ['frach-m-milestones > .frach-m-slider', carouselParser],
  ['frach-m-image-gallery-tiles, .frach-m-image-gallery', galleryParser],
  ['.fraformsform, form', formParser],
  ['frach-m-key-figures, frach-m-pictogram-key-figures', keyFiguresParser],
  ['frach-e-table', tableDataParser],
  ['.frach-m-download-list', downloadsParser, (el) => el.closest('.frach-grid-row') || el],
  ['.frach-m-contact-list', cardsParser],
  ['.frach-m-cta', ctaParser],
  ['.frach-m-link-box', linkBoxParser],
  ['.frach-m-testimonial', testimonialParser, (el) => el.closest('section.frach-h-component-margin') || el],
  ['frach-m-embed, iframe', embedParser, (el) => el.closest('section.frach-h-component-margin') || el],
];

/** page path without extension: params.originalURL (import), else the document URL */
function pagePath(params, document) {
  const candidates = [params && params.originalURL, document && document.URL];
  for (const c of candidates) {
    try {
      const u = new URL(c);
      if (!/^https?:$/.test(u.protocol)) continue;
      return u.pathname.replace(/\/$/, '').replace(/\.html?$/, '') || '/index';
    } catch (e) { /* next */ }
  }
  return '/page';
}

function convertNested(document, container, params) {
  NESTED.forEach(([selector, parser, resolve]) => {
    let guard = 0;
    let el = container.querySelector(selector);
    while (el && guard < 50) {
      guard += 1;
      const target = resolve ? resolve(el) : el;
      const scope = container.contains(target) ? target : el;
      try { parser(scope, { document, params }); } catch (e) { /* leave as content */ }
      if (scope.isConnected && container.contains(scope)) scope.setAttribute('data-tabs-done', '');
      el = [...container.querySelectorAll(selector)].find((n) => !n.closest('[data-tabs-done]') && !n.closest('table'));
    }
  });
  // remaining multi-column grids (image / text columns) -> columns blocks
  [...container.querySelectorAll('.frach-grid-row')].forEach((row) => {
    if (!row.isConnected || row.closest('table') || gridColumns(row).length < 2) return;
    try { columnsParser(row, { document, params }); } catch (e) { /* leave as content */ }
  });
  container.querySelectorAll('[data-tabs-done]').forEach((n) => n.removeAttribute('data-tabs-done'));
}

export default function parse(element, { document, params }) {
  const nav = element.matches('frach-m-tab-navigation') ? element
    : (element.querySelector('frach-m-tab-navigation') || element);
  const tabbed = nav.closest('frach-m-tabbed-content, .frach-m-tabbed-content')
    || (element.matches('frach-m-tabbed-content') ? element : null);
  const panels = tabbed ? [...tabbed.querySelectorAll('.frach-m-tabbed-content__panel')]
    .filter((p) => p.closest('frach-m-tabbed-content, .frach-m-tabbed-content') === tabbed) : [];

  const tabs = [...nav.querySelectorAll('a.frach-m-tab-navigation__tab, [role="tab"]')];
  const base = pagePath(params || {}, document);
  const cells = [];
  const used = new Set();

  tabs.forEach((tab, i) => {
    const label = clean(tab.textContent);
    if (!label) return;
    let id = (tab.getAttribute('href') || '').replace(/^#/, '');
    try { id = decodeURIComponent(id); } catch (e) { /* keep */ }
    const panel = panels.find((p) => p.id === id || p.getAttribute('aria-labelledby') === tab.id) || panels[i];
    if (!panel || used.has(panel)) { cells.push([label]); return; }
    used.add(panel);

    const complex = !!panel.querySelector(COMPLEX)
      || [...panel.querySelectorAll('.frach-grid-row')].some((r) => gridColumns(r).length > 1);

    if (!complex) {
      const content = componentContent(document, panel);
      cells.push([label, content.length ? content : '']);
      return;
    }

    const container = document.createElement('div');
    container.append(...panel.childNodes);
    const fragParams = { ...(params || {}), fragments: (params && params.fragments) || [] };
    convertNested(document, container, fragParams);
    const content = componentContent(document, container);
    const fragment = document.createElement('div');
    fragment.append(...content);

    const path = `/fragments${base}/${slug(label)}`;
    const safePath = (WebImporter.FileUtils && WebImporter.FileUtils.sanitizePath)
      ? WebImporter.FileUtils.sanitizePath(path) : path;
    if (params && Array.isArray(params.fragments)) params.fragments.push({ element: fragment, path: safePath });

    const a = document.createElement('a');
    a.setAttribute('href', safePath);
    a.textContent = safePath;
    cells.push([label, [para(document, a)]]);
  });

  const name = 'tabs-topic';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: cells.length ? cells : [['']] });
  element.replaceWith(block);
  // the panels were moved into the block / fragments: drop their empty shells
  panels.forEach((p) => { if (p.isConnected && !clean(p.textContent) && !p.querySelector('img, iframe, table')) p.remove(); });
}
