/* eslint-disable */
/* global WebImporter */
import {
  makeImage, imageLink, para, clean, absUrl, textContent,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for testimonial (.frach-m-testimonial or the AEM section holding it / the quote grid).
 *
 * Block contract (blocks/testimonial): one cell — a picture paragraph (optionally linked),
 * the caption paragraph, the headline paragraph, and the quote (a blockquote; else the last
 * paragraph).
 *
 * Shapes:
 * - .frach-m-testimonial (portrait + quote headline + blockquote) -> variant
 *   `text-over-image`; caption = .frach-m-testimonial__meta or the quote headline (name).
 * - grid section with a frach-m-text-media pull quote (quote + author) beside an image
 *   column (figcaption) -> default variant; caption = figcaption or quote author.
 * - grid section with a text column (no quote) beside an image -> picture, caption, the
 *   text column's content (its last paragraph acts as the quote).
 */
function textP(document, text) {
  return para(document, document.createTextNode(clean(text)));
}

function pictureParagraph(document, scope) {
  const img = makeImage(document, scope);
  if (!img) return null;
  const href = imageLink(scope);
  if (href && href !== '#' && !/^javascript:/i.test(href)) {
    const a = document.createElement('a');
    a.setAttribute('href', absUrl(href));
    a.append(img);
    return para(document, a);
  }
  return para(document, img);
}

export default function parse(element, { document, params }) {
  const cell = [];
  let variant = '';
  const t = element.matches('.frach-m-testimonial') ? element : element.querySelector('.frach-m-testimonial');

  if (t) {
    variant = 'text-over-image';
    const pic = pictureParagraph(document, t.querySelector('.frach-m-testimonial__image') || t);
    if (pic) cell.push(pic);
    const meta = t.querySelector('.frach-m-testimonial__meta');
    const headline = t.querySelector('.frach-m-testimonial__quote-headline');
    if (meta && clean(meta.textContent)) {
      cell.push(textP(document, meta.textContent));
      if (headline && clean(headline.textContent)) cell.push(textP(document, headline.textContent));
    } else if (headline && clean(headline.textContent)) {
      cell.push(textP(document, headline.textContent));
    }
    t.querySelectorAll('.frach-m-testimonial__quote-text, blockquote').forEach((q) => {
      if (!clean(q.textContent) || q.parentElement.closest('blockquote')) return;
      const bq = document.createElement('blockquote');
      bq.append(textP(document, q.textContent));
      cell.push(bq);
    });
  } else {
    const imageComp = element.querySelector('frach-m-image');
    const pic = imageComp ? pictureParagraph(document, imageComp) : null;
    if (pic) cell.push(pic);
    const cap = imageComp && imageComp.querySelector('figcaption, .frach-m-image__caption');
    const pull = element.querySelector('blockquote.frach-e-pull-quote, .frach-m-text-media__media-quote blockquote');
    const author = pull && pull.querySelector('.frach-e-pull-quote__author');
    const caption = clean((cap && cap.textContent) || (author && author.textContent) || '');
    if (caption) cell.push(textP(document, caption));

    // text column(s) beside the image (excluding the pull quote)
    element.querySelectorAll('.frach-m-text').forEach((txt) => {
      if (imageComp && imageComp.contains(txt)) return;
      textContent(document, txt).forEach((n) => {
        if (/^H[1-6]$/.test(n.tagName)) cell.push(textP(document, n.textContent));
        else cell.push(n);
      });
    });

    if (pull) {
      const q = pull.querySelector('.frach-e-pull-quote__quote') || pull;
      const bq = document.createElement('blockquote');
      bq.append(textP(document, q.textContent));
      cell.push(bq);
    }
  }

  const name = variant ? `testimonial (${variant})` : 'testimonial';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: [[cell.length ? cell : '']] });
  element.replaceWith(block);
}
