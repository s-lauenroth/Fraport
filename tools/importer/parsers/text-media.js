/* eslint-disable */
/* global WebImporter */
import {
  gridColumns, componentContent, makeImages, imageComponent, para, link, bestSrc, clean,
  textMediaParts, headingFrom, paraFrom, makeImage, imageLink, absUrl,
} from '../utils/fraport-parser-utils.js';
import columnsParser from './columns.js';
import newsroomFeedParser from './newsroom-feed.js';

/**
 * Parser for text-media: an AEM grey-band section (or its grid row) whose grid row pairs a media column
 * (frach-m-image / image slider / embedded video) with a frach-m-text column; also a bare
 * frach-m-text-media component.
 *
 * Block contract (blocks/text-media): one row — optional media cell (first of two), then the
 * text cell (headings, paragraphs, lists, CTA paragraphs: <strong>/<em> links).
 *
 * The matched section can hold several grid rows: a one-column text row (section title)
 * stays default content, a media | text pair becomes the text-media block, and a row of
 * mixed image + text columns (teaser pair) becomes a `columns` block — in source order.
 *
 * Variants (blocks/text-media options, read from the source markup):
 * - wide-media: the media column holds a video (iframe / video) -> link in the media cell
 * - blue: several pictures in the media column (inline image slider)
 * - quote-overlay: a frach-m-testimonial (image + quote) column beside the text column ->
 *   media cell: picture, quote headline, blockquote, caption (the block sets text left, the
 *   quote over the image right)
 * - image-left: media column first in source order beside the text (6 / 6, or 4 / 8)
 * - alt: text column first, media column second, equal 6 / 6 columns
 * - default: text 8 | media 4 (the block's aside layout without options)
 * - a bare frach-m-text-media with a floated image: frach-m-text-media--left / --right ->
 *   left / right, --50-50 -> half, --33-66 / --66-33 -> third (--100: no option)
 */
const MEDIA = 'frach-m-image, frach-e-lazy-image, iframe, video, frach-e-lazy-video, frach-m-slider';

function mediaCell(document, col) {
  const frame = col.querySelector('iframe');
  if (frame) {
    let src = bestSrc(frame);
    const yt = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/);
    if (yt) src = `https://www.youtube.com/watch?v=${yt[1]}`;
    return { cell: src ? [para(document, link(document, src, clean(frame.getAttribute('title')) || src))] : [], video: true };
  }
  const vsrc = col.querySelector('video source[src], source[data-src]');
  if (vsrc && bestSrc(vsrc)) {
    const src = bestSrc(vsrc);
    return { cell: [para(document, link(document, src, src))], video: true };
  }
  const images = makeImages(document, col);
  if (images.length > 1) return { cell: images.map((img) => para(document, img)), multi: true };
  const comp = col.querySelector('frach-m-image');
  if (comp) return { cell: imageComponent(document, comp).map((n) => { if (n.dataset) delete n.dataset.caption; return n; }) };
  return { cell: images.map((img) => para(document, img)) };
}

/** frach-m-testimonial column -> quote-overlay media cell (picture, quote, caption) */
function quoteCell(document, t) {
  const cell = [];
  const imgScope = t.querySelector('.frach-m-testimonial__image-container, .frach-m-testimonial__image') || t;
  const img = makeImage(document, imgScope);
  if (img) {
    const tLink = t.querySelector('a.frach-m-testimonial__link[href]');
    const href = imageLink(imgScope) || (tLink ? tLink.getAttribute('href') : '');
    if (href && href !== '#' && !/^javascript:/i.test(href)) {
      const a = document.createElement('a');
      a.setAttribute('href', absUrl(href));
      a.append(img);
      cell.push(para(document, a));
    } else cell.push(para(document, img));
  }
  const headline = t.querySelector('.frach-m-testimonial__quote-headline');
  if (headline && clean(headline.textContent)) cell.push(paraFrom(document, headline));
  t.querySelectorAll('.frach-m-testimonial__quote-text, blockquote').forEach((q) => {
    if (!clean(q.textContent) || q.parentElement.closest('blockquote')) return;
    const bq = document.createElement('blockquote');
    bq.append(paraFrom(document, q));
    cell.push(bq);
  });
  const meta = t.querySelector('.frach-m-testimonial__meta');
  if (meta && clean(meta.textContent)) cell.push(paraFrom(document, meta));
  return cell;
}

const colWidth = (c) => parseInt(((c.className || '').match(/frach-grid-col-mq3-(\d+)/) || [])[1] || '0', 10);

/** bare frach-m-text-media modifiers -> floated-media options */
function floatOptions(tm) {
  const cls = (tm && tm.getAttribute && tm.getAttribute('class')) || '';
  const out = [];
  if (/frach-m-text-media--left(\s|$)/.test(cls)) out.push('left');
  else if (/frach-m-text-media--right(\s|$)/.test(cls)) out.push('right');
  if (!out.length) return out;
  if (/frach-m-text-media--50-50(\s|$)/.test(cls)) out.push('half');
  else if (/frach-m-text-media--(33-66|66-33)(\s|$)/.test(cls)) out.push('third');
  return out;
}

/** visible text of a column, ignoring image captions, overlay / slider chrome and icons */
const textLength = (c) => {
  const copy = c.cloneNode(true);
  copy.querySelectorAll('figcaption, .frach-m-image__caption, .frach-e-button__label, button, noscript, frach-e-icon, '
    + '.frach-m-media-lightbox, .frach-m-overlay, .frach-m-image__icon-overlay, .frach-m-slider__controls').forEach((n) => n.remove());
  return clean(copy.textContent).length;
};
const hasMedia = (c) => !!c.querySelector(MEDIA);
const isMediaCol = (c) => hasMedia(c) && textLength(c) < 2;
const hasCopy = (nodes) => nodes.some((n) => n.tagName === 'P' && clean(n.textContent).length > 40
  && !(n.querySelector('a') && clean(n.querySelector('a').textContent) === clean(n.textContent)));

/**
 * text-media block for a media column + text columns (cols in source order). `opts.headline`
 * is a component headline placed first in the text cell; `opts.options` are given options
 * (floated bare component); `opts.quote` is a testimonial column (quote-overlay).
 */
function textMediaBlock(document, cols, opts = {}) {
  let media = null;
  let mediaCol = null;
  const textParts = opts.headline ? [headingFrom(document, opts.headline)] : [];
  cols.forEach((c) => {
    if (!mediaCol && opts.quote && c === opts.quote) {
      mediaCol = c;
      media = { cell: quoteCell(document, c.querySelector('.frach-m-testimonial') || c), quote: true };
    } else if (!mediaCol && !opts.quote && isMediaCol(c)) {
      mediaCol = c;
      media = mediaCell(document, c);
    } else textParts.push(...componentContent(document, c));
  });

  let options = opts.options || [];
  if (!options.length) {
    const textCols = cols.filter((c) => c !== mediaCol);
    const mediaFirst = mediaCol && cols[0] === mediaCol;
    const mw = mediaCol ? colWidth(mediaCol) : 0;
    const tw = textCols.length === 1 ? colWidth(textCols[0]) : 0;
    if (media && media.video) options = ['wide-media'];
    else if (media && media.multi) options = ['blue'];
    else if (media && media.quote) options = ['quote-overlay'];
    else if (media && mediaFirst && mw && tw) options = ['image-left'];
    else if (media && !mediaFirst && mw && tw && mw === tw) options = ['alt'];
  }
  const cells = [media && media.cell.length ? [media.cell, textParts] : [textParts.length ? textParts : '']];
  const name = options.length ? `text-media (${options.join(', ')})` : 'text-media';
  return WebImporter.Blocks.createBlock(document, { name, cells });
}

/** bare frach-m-text-media component (headline, media, copy) -> text-media block */
function componentBlock(document, tm, extraCols = []) {
  const { headline, media, text } = textMediaParts(tm);
  const parts = [media, text, ...extraCols].filter(Boolean);
  const options = extraCols.length || !(media && hasMedia(media)) ? [] : floatOptions(tm);
  return textMediaBlock(document, parts, { headline, options });
}

function topRows(element) {
  if (element.matches('.frach-grid-row')) return [element];
  return [...element.querySelectorAll('.frach-grid-row')]
    .filter((r) => { const up = r.parentElement.closest('.frach-grid-row'); return !up || !element.contains(up); });
}

export default function parse(element, { document, params }) {
  // A news teaser of a teaser collection (a.frach-m-teaser-collection__list-item, which the catalog
  // sometimes types text-media): the whole collection is a newsroom-feed (thumbnails) list, and
  // read item by item the headline link would be lost. The first item converts the collection;
  // the import skips the other items, which are no longer in the page.
  const collection = element.matches('a.frach-m-teaser-collection__list-item')
    && element.closest('.frach-m-teaser-collection');
  if (collection) {
    newsroomFeedParser(collection, { document, params });
    return;
  }

  const out = [];
  const rows = topRows(element);

  if (!rows.length) {
    // bare frach-m-text-media component
    const tm = element.matches('frach-m-text-media') ? element : element.querySelector('frach-m-text-media');
    out.push(tm ? componentBlock(document, tm) : textMediaBlock(document, [element]));
  }

  rows.forEach((row) => {
    let cols = gridColumns(row);
    if (!cols.length) cols = [row];
    const mediaCols = cols.filter(isMediaCol);
    // a testimonial (image + quote) column beside a text column: quote overlay
    const quoteCols = cols.filter((c) => c.querySelector('.frach-m-testimonial') && !c.querySelector('frach-m-text-media'));
    // a frach-m-text-media component (media + its own copy) in one column, text beside it
    const tmCols = cols.filter((c) => {
      const m = c.querySelector('frach-m-text-media .frach-m-text-media__media');
      return m && hasMedia(m);
    });
    if (quoteCols.length === 1 && cols.length === 2) {
      out.push(textMediaBlock(document, cols, { quote: quoteCols[0] }));
    } else if (!mediaCols.length && tmCols.length === 1 && cols.length >= 2) {
      const tm = tmCols[0].querySelector('frach-m-text-media');
      out.push(componentBlock(document, tm, cols.filter((c) => c !== tmCols[0])));
    } else if (mediaCols.length === 1 && cols.length >= 2) {
      out.push(textMediaBlock(document, cols));
    } else if (cols.length === 1) {
      const tm = cols[0].querySelector('frach-m-text-media');
      const tmMedia = tm && tm.querySelector('.frach-m-text-media__media');
      if (tm && tmMedia && hasMedia(tmMedia)) {
        out.push(componentBlock(document, tm));
      } else out.push(...componentContent(document, cols[0]));
    } else {
      // a row of mixed image + text columns: columns block
      if (row === element) { columnsParser(element, { document, params }); return; }
      const holder = document.createElement('div');
      row.before(holder);
      holder.append(row);
      columnsParser(row, { document, params });
      out.push(...holder.childNodes);
      holder.remove();
    }
  });

  if (!element.isConnected && !out.length) return; // replaced by the columns parser
  if (!out.length) out.push(textMediaBlock(document, [element]));
  if (out.length === 1) {
    element.replaceWith(out[0]);
    return;
  }
  const frag = document.createDocumentFragment();
  frag.append(...out);
  element.replaceWith(frag);
}
