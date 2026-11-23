/* eslint-disable */
/* global WebImporter */
import { clean, absUrl } from '../utils/fraport-parser-utils.js';

/**
 * Parser for tag-list: the topic tag row of an article's page meta data
 * (.frach-m-page-meta-data__tags, one frach-e-tag per topic), or the meta data itself.
 *
 * Block contract (blocks/tag-list): the tags as list items; the block reads the items of every
 * cell as one list, so each tag gets its own row holding a one-item list. A linked tag keeps its
 * link; a plain tag (the source frach-e-tag has no link) is a text item, which the block renders
 * as a non-interactive pill. (A lone paragraph in a cell is unwrapped to bare text on save, which
 * the block would not read, so plain tags must be list items.)
 * Variant `alt` (catalog v_a325e1ab339a-1, compact pills) is not emitted: its source instances
 * have the same markup and look as the default (only fewer tags).
 */

/** The tag-list block for the tags inside `scope`, or null when it holds no tag. */
export function tagListBlock(document, scope) {
  const root = scope.matches && scope.matches('.frach-m-page-meta-data__tags') ? scope
    : (scope.querySelector('.frach-m-page-meta-data__tags') || scope);
  const tags = [...root.querySelectorAll('frach-e-tag, .frach-e-tag')]
    .filter((t) => !t.parentElement.closest('frach-e-tag, .frach-e-tag'));
  const cells = [];
  tags.forEach((tag) => {
    const label = tag.querySelector('.frach-e-tag__label') || tag;
    const text = clean(label.textContent) || clean(tag.getAttribute('title'));
    if (!text) return;
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    const src = tag.matches('a[href]') ? tag : tag.querySelector('a[href]');
    const href = src && src.getAttribute('href');
    if (href && href !== '#' && !/^javascript:/i.test(href)) {
      const a = document.createElement('a');
      a.setAttribute('href', absUrl(href));
      a.textContent = text;
      li.append(a);
    } else li.textContent = text;
    ul.append(li);
    cells.push([ul]);
  });
  if (!cells.length) return null;
  return WebImporter.Blocks.createBlock(document, { name: 'tag-list', cells });
}

export default function parse(element, { document }) {
  const block = tagListBlock(document, element);
  if (block) element.replaceWith(block);
  else element.remove();
}
