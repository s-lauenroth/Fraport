/* eslint-disable */
/* global WebImporter */

/**
 * Parser for breadcrumb (frach-m-breadcrumb-navigation).
 * Block contract (blocks/breadcrumb): 1 row, 1 cell holding a list of links whose
 * last item is the current page (plain text).
 */
const BASE = 'https://www.fraport.com';

function absUrl(href, params) {
  if (!href) return href;
  try {
    return new URL(href, (params && params.originalURL) || BASE).href;
  } catch (e) {
    return href;
  }
}

export default function parse(element, { document, params }) {
  const root = element.matches('frach-m-breadcrumb-navigation, .frach-m-breadcrumb-navigation')
    ? element
    : element.querySelector('frach-m-breadcrumb-navigation, .frach-m-breadcrumb-navigation') || element;

  const items = [...root.querySelectorAll('li.frach-m-breadcrumb-navigation__item')];
  const ul = document.createElement('ul');
  items.forEach((item) => {
    const labelEl = item.querySelector('.frach-m-breadcrumb-navigation__label') || item;
    const label = labelEl.textContent.replace(/\s+/g, ' ').trim();
    if (!label) return;
    const li = document.createElement('li');
    const link = item.querySelector('a[href]');
    if (link) {
      const a = document.createElement('a');
      a.href = absUrl(link.getAttribute('href'), params);
      a.textContent = label;
      li.append(a);
    } else {
      li.textContent = label;
    }
    ul.append(li);
  });

  const cells = [[ul.children.length ? ul : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells });
  element.replaceWith(block);
}
