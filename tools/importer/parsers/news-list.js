/* eslint-disable */
/* global WebImporter */
import {
  clean, para, link, makeImage, paraFrom, absUrl,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for news-list (the newsroom search results page: frach-m-search band +
 * frach-m-search-results). Matched on the search band wrapper (.frach-m-search__results-page-wrapper,
 * the catalog's element); the sibling frach-m-search-results component in the same AEM section is
 * pulled into the block and removed from the page.
 *
 * Block contract (blocks/news-list), rows classified by content:
 * - an <h1> row: the page title (kept visually hidden by the block; the source page shows none);
 * - list rows: the type tabs (active tab in <strong>, linking to the page), then the tag filter;
 * - a paragraph row before the results: the result count (<strong> = the number);
 * - one row per result: topics paragraph, date paragraph, linked <h2>, teaser paragraph, picture;
 * - a paragraph row after the results: the load-more label;
 * - heading rows after that: the empty state, then the error state.
 *
 * Variant `light` (tag filter strip without the search band) is only emitted when the component
 * has no search band; every catalog page has one, so the default block is emitted.
 * Not migrated: the search form, suggestions and slider controls (built by the block), the empty
 * related-content section and the live result paging (only the captured first page of results).
 */
function pageTitle(document) {
  const og = document.querySelector('meta[property="og:title"]');
  const t = clean((og && og.getAttribute('content')) || (document.querySelector('title') || {}).textContent || '');
  return t.replace(/\s*[|–-]\s*Fraport.*$/i, '');
}

function listOf(document, items) {
  const ul = document.createElement('ul');
  items.forEach((node) => {
    const li = document.createElement('li');
    li.append(node);
    ul.append(li);
  });
  return ul;
}

function resultRow(document, result) {
  const cell = [];
  const meta = result.querySelector('.frach-e-search-result__meta');
  if (meta) {
    // topics = the meta text without the date (the importer may unwrap the plain <span>s, so the
    // topics are read from the whole paragraph rather than from its first span)
    const time = meta.querySelector('time');
    const all = clean(meta.textContent);
    const dateText = time ? clean(time.textContent) : '';
    const topicText = (dateText ? all.replace(dateText, '') : all).trim()
      .replace(/\s+,/g, ',').replace(/,\s*$/, '').trim();
    if (topicText) cell.push(para(document, document.createTextNode(topicText)));
    const date = time ? clean(time.textContent) : '';
    if (date) cell.push(para(document, document.createTextNode(date)));
  }
  const a = result.querySelector('h1 a[href], h2 a[href], h3 a[href], h4 a[href], h5 a[href], h6 a[href], a.frach-e-link[href]');
  if (a) {
    const h = document.createElement('h2');
    const l = link(document, a.getAttribute('href'), a.textContent);
    if (a.getAttribute('target') === '_blank') l.setAttribute('target', '_blank');
    h.append(l);
    cell.push(h);
  }
  result.querySelectorAll('.frach-e-search-result__wrapper > p:not(.frach-e-search-result__meta)').forEach((p) => {
    if (clean(p.textContent)) cell.push(paraFrom(document, p));
  });
  const img = makeImage(document, result);
  if (img) cell.push(para(document, img));
  return cell.length ? [cell] : null;
}

export default function parse(element, { document, params }) {
  const section = element.closest('section') || element.parentElement || element;
  const results = element.matches('frach-m-search-results') ? element
    : (section.querySelector('frach-m-search-results') || element.querySelector('frach-m-search-results'));
  const hasSearch = !!(element.querySelector('frach-m-search, .frach-m-search') || section.querySelector('frach-m-search'));
  const cells = [];

  const title = pageTitle(document);
  if (title) {
    const h1 = document.createElement('h1');
    h1.textContent = title;
    cells.push([h1]);
  }

  if (results) {
    // type tabs: the active tab bold, linking to the listing page itself (the source tab is href="#")
    const tabs = [...results.querySelectorAll('.frach-m-search-results__type-filter .frach-m-tab-navigation__tab')]
      .filter((t) => clean(t.textContent));
    if (tabs.length) {
      const here = (params && params.originalURL) || '';
      cells.push([listOf(document, tabs.map((t) => {
        const href = t.getAttribute('href');
        const l = link(document, href && href !== '#' ? href : here, t.textContent);
        if (!t.classList.contains('frach-state-active')) return l;
        const s = document.createElement('strong');
        s.append(l);
        return s;
      }))]);
    }

    const tags = [...results.querySelectorAll('.frach-m-search-results__tag-filter .frach-e-tag')]
      .map((t) => clean((t.querySelector('.frach-e-tag__label') || t).textContent))
      .filter(Boolean);
    if (tags.length) cells.push([listOf(document, tags.map((t) => document.createTextNode(t)))]);

    const summary = results.querySelector('.frach-m-search-results__summary');
    if (summary && clean(summary.textContent)) {
      const count = summary.querySelector('.frach-m-search-results__count');
      const p = document.createElement('p');
      if (count) {
        const s = document.createElement('strong');
        s.textContent = clean(count.textContent);
        p.append(s, document.createTextNode(` ${clean(summary.textContent.replace(count.textContent, ''))}`));
      } else p.textContent = clean(summary.textContent);
      cells.push([p]);
    }

    results.querySelectorAll('.frach-e-search-result').forEach((r) => {
      const row = resultRow(document, r);
      if (row) cells.push(row);
    });

    const more = results.querySelector('.frach-m-search-results__load-more-btn');
    if (more && clean(more.textContent)) {
      cells.push([para(document, document.createTextNode(clean((more.querySelector('.frach-e-button__label') || more).textContent)))]);
    }

    // the block reads the first state row as the empty state and the second as the error state,
    // so the error state is only authored after a (non-empty) empty state: on its own it would show
    // the "technical problems" text whenever the search finds nothing
    const emptyState = results.querySelector('.frach-m-search-results__no-results');
    const hasEmpty = !!(emptyState && clean(emptyState.textContent));
    ['.frach-m-search-results__no-results', '.frach-m-search-results__error'].forEach((sel, i) => {
      const state = results.querySelector(sel);
      if (!state || !clean(state.textContent) || (i === 1 && !hasEmpty)) return;
      const cell = [];
      state.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((n) => {
        if (!clean(n.textContent)) return;
        const e = document.createElement(/^H/.test(n.tagName) ? 'h3' : 'p');
        e.textContent = clean(n.textContent);
        cell.push(e);
      });
      if (cell.length) cells.push([cell]);
    });
  }

  const name = hasSearch ? 'news-list' : 'news-list (light)';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: cells.length ? cells : [['']] });
  if (results && results !== element && !element.contains(results)) results.remove();
  element.replaceWith(block);
}
