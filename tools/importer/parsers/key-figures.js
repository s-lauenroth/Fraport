/* eslint-disable */
/* global WebImporter */
import {
  makeImage, para, clean, componentContent, animatedNumber, pageLang, headingFrom, paraFrom,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for key-figures (component or its AEM section): frach-m-key-figures (animated numbers + captions) and
 * frach-m-pictogram-key-figures (pictogram | number | caption + info text).
 *
 * Block contract (blocks/key-figures): one row per figure — value cell as displayed, then
 * caption cell; a row whose first cell is a picture uses it as the figure icon
 * (icon | value | caption). Text variants add a first one-cell row (text column).
 *
 * Variants (blocks/key-figures options, from the source markup):
 * - with-text: frach-m-key-figures--has-text (headline + copy column of the component), or
 *   text components sharing the matched section with standard figures; with-text-4 is added
 *   when the text column sits beside a grid of several figures
 * - with-text-3: pictogram key figures with text components sharing the section
 * - light: pictogram key figures on a grey band (frach-h-bg--grey) — the block paints the band
 * - stock: the figure is the live share price (exchange-data wrapper)
 * The figure value is the source's displayed number (frach-e-animated-number value,
 * fraction-digits, prefix / suffix / currency, formatted for the page language).
 */
const KF = 'frach-m-key-figures, .frach-m-key-figures, frach-m-pictogram-key-figures';

export default function parse(element, { document, params }) {
  const lang = pageLang(document, params);
  // the matched element may hold several figure components (e.g. a grid row of pictogram groups)
  const kfs = element.matches(KF) ? [element]
    : [...element.querySelectorAll(KF)].filter((k) => !k.parentElement.closest(KF));
  // ... or sit inside one (the catalog anchors some instances on the inner grid row)
  const hasItems = !!element.querySelector('.frach-m-pictogram-key-figures__item, .frach-m-key-figures__number');
  const kf = (kfs.length > 1 || (!kfs.length && hasItems)) ? element : kfs[0];

  const pictograms = !!(kf && (kf.matches('frach-m-pictogram-key-figures')
    || kf.querySelector('.frach-m-pictogram-key-figures__item')));
  const rows = [];
  let textCell = [];
  let variant = '';

  if (kf) {
    // standard key figures
    kf.querySelectorAll('.frach-m-key-figures__number').forEach((n) => {
      const value = animatedNumber(n.querySelector('frach-e-animated-number, .frach-m-key-figures__number-value'), lang);
      const caption = n.querySelector('.frach-m-key-figures__number-text');
      if (!value && !(caption && clean(caption.textContent))) return;
      rows.push([value, caption ? clean(caption.textContent) : '']);
    });
    // pictogram key figures
    kf.querySelectorAll('.frach-m-pictogram-key-figures__item').forEach((item) => {
      const img = makeImage(document, item.querySelector('.frach-m-pictogram-key-figures__item-pictogram') || item);
      const value = animatedNumber(item.querySelector('frach-e-animated-number'), lang);
      const captionEl = item.querySelector('.frach-m-pictogram-key-figures__item-text');
      const caption = [];
      if (captionEl && clean(captionEl.textContent)) caption.push(para(document, document.createTextNode(clean(captionEl.textContent))));
      item.querySelectorAll('.frach-m-pictogram-key-figures__info-text').forEach((info) => {
        if (clean(info.textContent)) caption.push(para(document, document.createTextNode(clean(info.textContent))));
      });
      // the component's legend (below its figures, e.g. "Frachtfläche CargoCity Süd") follows the
      // caption of its last figure: the block has no legend cell
      const comp = item.closest('frach-m-pictogram-key-figures');
      const compItems = comp ? [...comp.querySelectorAll('.frach-m-pictogram-key-figures__item')] : [];
      const legend = comp && compItems[compItems.length - 1] === item
        && comp.querySelector('.frach-m-pictogram-key-figures__legend');
      if (legend && clean(legend.textContent)) caption.push(para(document, document.createTextNode(clean(legend.textContent))));
      rows.push(img ? [para(document, img), value, caption] : [value, caption]);
    });

    const text = kf.querySelector('.frach-m-key-figures__text');
    if (text && clean(text.textContent)) {
      const h = text.querySelector('.frach-m-key-figures__headline, h1, h2, h3, h4, h5, h6');
      if (h && clean(h.textContent)) textCell.push(headingFrom(document, h));
      const copies = [...text.querySelectorAll('.frach-m-key-figures__copy, p')];
      copies.filter((p) => !copies.some((o) => o !== p && p.contains(o))).forEach((p) => {
        if (p !== h && !p.closest('.frach-m-key-figures__headline') && clean(p.textContent)) textCell.push(paraFrom(document, p));
      });
      variant = rows.length > 1 ? 'with-text, with-text-4' : 'with-text';
    }
    // live share price (normally taken by the share-price parser, which runs first)
    if (kf.querySelector('.frach-m-key-figures__exchange-data-wrapper') && !variant) variant = 'stock';
    kfs.forEach((k) => { if (k !== element) k.remove(); });
  }

  // text components sharing the matched section (outside the figures components)
  if (!textCell.length && !element.matches(KF) && (kfs.length || !hasItems)) {
    const extra = componentContent(document, element);
    if (extra.length) { textCell = extra; variant = pictograms ? 'with-text-3' : 'with-text'; }
  }
  // pictogram figures on a grey band: the block's light option paints the band itself
  const greyBand = element.matches('.frach-h-bg--grey') || !!element.closest('.frach-h-bg--grey');
  if (greyBand && pictograms && variant !== 'stock') variant = variant ? `light, ${variant}` : 'light';

  // pad figure rows to the same width (icon rows have three cells)
  const width = Math.max(0, ...rows.map((r) => r.length));
  rows.forEach((r) => { while (r.length < width) r.splice(r.length - 1, 0, ''); });

  const cells = [];
  if (textCell.length) cells.push([textCell]);
  cells.push(...rows);
  if (!cells.length) cells.push(['']);

  const name = variant ? `key-figures (${variant})` : 'key-figures';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
