/* eslint-disable */
/* global WebImporter */
import {
  makeImage, textContent, para, clean, textMediaParts, headingFrom, paraFrom, inlineNodes,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for carousel-text-media (frach-m-milestones > .frach-m-slider).
 *
 * Block contract (blocks/carousel-text-media): one row per slide — media cell (picture)
 * and text cell (heading, quote, paragraphs, links); a text-only slide has one cell.
 *
 * Slide shapes:
 * - frach-m-text-media (--left: image left = default, --right with media = image-right);
 *   its headline (h3.frach-m-text-media__headline) leads the text cell
 * - frach-m-testimonial (portrait + quote) -> variant full-width-photo (any testimonial slide
 *   makes the slider a photo slider); the text cell is the quote question (a paragraph),
 *   blockquote and the byline as the last short paragraph (caption).
 * - only text slides (no picture in any slide) -> variant alt
 * Slider controls (prev/next buttons) are dropped.
 */
function textMediaSlide(document, tm) {
  const media = tm.querySelector('.frach-m-text-media__media');
  const img = media ? makeImage(document, media) : null;
  const textWrap = tm.querySelector('.frach-m-text-media__text') || tm;
  const { headline } = textMediaParts(tm);
  const texts = textContent(document, textWrap.querySelector('.frach-m-text, .frach-m-text-media__copy') || textWrap);
  if (headline) texts.unshift(headingFrom(document, headline));
  return { img, texts: texts.map((n) => tablesToLists(document, n)) };
}

/**
 * A slide's copy table (e.g. a price list: item | price) cannot nest in a block cell (it would
 * become a table-data block inside the carousel): one list item per row, the non-empty cells'
 * inline content joined by " – ".
 */
function tablesToLists(document, node) {
  const toList = (table) => {
    const ul = document.createElement('ul');
    table.querySelectorAll('tr').forEach((tr) => {
      const parts = [...tr.children].filter((c) => /^(TD|TH)$/.test(c.tagName))
        .map((c) => inlineNodes(document, c)).filter((p) => p.some((n) => clean(n.textContent)));
      if (!parts.length) return;
      const li = document.createElement('li');
      parts.forEach((p, i) => {
        if (i) li.append(document.createTextNode(' – '));
        li.append(...p);
      });
      ul.append(li);
    });
    return ul;
  };
  if (node.tagName === 'TABLE') return toList(node);
  if (node.querySelectorAll) node.querySelectorAll('table').forEach((t) => t.replaceWith(toList(t)));
  return node;
}

function testimonialSlide(document, t) {
  const img = makeImage(document, t.querySelector('.frach-m-testimonial__image') || t);
  const texts = [];
  const headline = t.querySelector('.frach-m-testimonial__quote-headline');
  // the quote question is a paragraph on the source (p.frach-m-testimonial__quote-headline)
  if (headline && clean(headline.textContent)) texts.push(paraFrom(document, headline));
  t.querySelectorAll('.frach-m-testimonial__quote-text').forEach((q) => {
    if (!clean(q.textContent)) return;
    const bq = document.createElement('blockquote');
    bq.append(paraFrom(document, q));
    texts.push(bq);
  });
  const meta = t.querySelector('.frach-m-testimonial__meta');
  if (meta && clean(meta.textContent)) texts.push(paraFrom(document, meta));
  return { img, texts };
}

export default function parse(element, { document, params }) {
  const slider = element.matches('.frach-m-slider') ? element
    : (element.querySelector('.frach-m-slider') || element);
  let slides = [...slider.querySelectorAll('.frach-m-slider__slide')];
  if (!slides.length) slides = [slider];

  const cells = [];
  let testimonial = 0;
  let rightWithMedia = 0;
  let withMedia = 0;
  let total = 0;
  slides.forEach((slide) => {
    const t = slide.querySelector('.frach-m-testimonial');
    const tm = slide.querySelector('frach-m-text-media, .frach-m-text-media');
    let res;
    if (t) {
      res = testimonialSlide(document, t);
      testimonial += 1;
    } else if (tm) {
      res = textMediaSlide(document, tm);
      if (res.img && /frach-m-text-media--right/.test(tm.className || '')) rightWithMedia += 1;
    } else {
      res = { img: makeImage(document, slide), texts: textContent(document, slide) };
    }
    if (!res.img && !res.texts.length) return;
    total += 1;
    if (res.img) withMedia += 1;
    cells.push(res.img ? [para(document, res.img), res.texts] : [res.texts]);
  });

  let name = 'carousel-text-media';
  if (testimonial) name = 'carousel-text-media (full-width-photo)';
  else if (rightWithMedia && rightWithMedia === total) name = 'carousel-text-media (image-right)';
  else if (total && !withMedia) name = 'carousel-text-media (alt)';

  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
