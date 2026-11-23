/* eslint-disable */
/* global WebImporter */
import {
  findRoot, para, link, clean, headingFrom, paraFrom, buttonStyle, wrapButton,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for cta (.frach-m-cta, or its outer AEM wrapper).
 *
 * Block contract (blocks/cta): one cell — a heading, copy paragraph(s) and CTA link
 * paragraphs (<strong> = primary, <em> = secondary, <strong><em> = tertiary / accent).
 * Variant `light` (catalog v_866ade7d4e4d): several buttons side by side (primary +
 * secondary), or a band without headline. `small` is not emitted: it only forces the h6 ramp,
 * and the source headline level (h6 on the newsroom bands) is kept as authored.
 */
export default function parse(element, { document, params }) {
  const root = findRoot(element, '.frach-m-cta');
  const cell = [];

  const headline = root.querySelector('.frach-m-cta__headline');
  if (headline && clean(headline.textContent)) {
    const level = /^H[1-6]$/.test(headline.tagName) ? headline.tagName.toLowerCase() : 'h3';
    cell.push(headingFrom(document, headline, level));
  }

  root.querySelectorAll('.frach-m-cta__text').forEach((t) => {
    if (clean(t.textContent)) cell.push(paraFrom(document, t));
  });

  let buttons = 0;
  root.querySelectorAll('.frach-m-cta__cta-container a[href], .frach-m-cta__button-container a[href]').forEach((a) => {
    if (cell.some((n) => n.querySelector && n.querySelector(`a[href="${a.href}"]`))) return;
    const label = a.querySelector('.frach-e-button__label') || a;
    if (!clean(label.textContent)) return;
    const l = link(document, a.getAttribute('href'), label.textContent);
    if (a.getAttribute('target') === '_blank') l.setAttribute('target', '_blank');
    cell.push(para(document, wrapButton(document, l, buttonStyle(a))));
    buttons += 1;
  });

  const light = buttons > 1 || !(headline && clean(headline.textContent));
  const name = light ? 'cta (light)' : 'cta';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: [[cell]] });
  element.replaceWith(block);
}
