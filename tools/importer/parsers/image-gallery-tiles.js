/* eslint-disable */
/* global WebImporter */
import {
  makeImage, para, clean, textContent, linkParagraph,
} from '../utils/fraport-parser-utils.js';
import carouselParser from './carousel-text-media.js';

/**
 * Parser for image-gallery-tiles (component, its AEM section / experience fragment, or a slider control bar).
 *
 * Block contract (blocks/image-gallery-tiles): one row per image — a picture paragraph and a
 * heading (the image title shown in the lightbox).
 *
 * Source shapes:
 * - frach-m-image-gallery-tiles (tiles + frach-m-media-lightbox): the lightbox slides hold
 *   each image with its h6 title (and description) — preferred over the tiles.
 * - frach-m-image-gallery with a single cover item and a lightbox -> variant `cover`.
 * - grids of frach-m-image tiles with figcaptions (incl. the wallpaper download grid).
 * - a slider's control bar (catalog anchor .frach-m-slider__controls) -> the slider's slide
 *   images, variant `alt` (all tiles shown at once); the whole slider is replaced.
 */
function heading(document, text) {
  const h = document.createElement('h6');
  h.textContent = clean(text);
  return h;
}

function fromLightbox(document, lightbox) {
  const rows = [];
  lightbox.querySelectorAll('.frach-m-slider__slide').forEach((slide) => {
    const img = makeImage(document, slide.querySelector('.frach-m-media-lightbox__image-wrapper') || slide);
    if (!img) return;
    const cell = [para(document, img)];
    const title = slide.querySelector('.frach-m-media-lightbox__text h1, .frach-m-media-lightbox__text h2, .frach-m-media-lightbox__text h3, .frach-m-media-lightbox__text h4, .frach-m-media-lightbox__text h5, .frach-m-media-lightbox__text h6');
    if (title && clean(title.textContent)) cell.push(heading(document, title.textContent));
    const desc = slide.querySelector('.frach-m-media-lightbox__description');
    if (desc && clean(desc.textContent)) cell.push(para(document, document.createTextNode(clean(desc.textContent))));
    // press-photo galleries: file data list (format, size, resolution, date) + download link
    const items = [...slide.querySelectorAll('.frach-m-media-lightbox__data-item')]
      .map((li) => clean(li.textContent)).filter(Boolean);
    if (items.length) {
      const ul = document.createElement('ul');
      items.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.append(li); });
      cell.push(ul);
    }
    const dl = slide.querySelector('.frach-m-media-lightbox__button a[href]');
    if (dl && dl.getAttribute('href') !== '#') cell.push(linkParagraph(document, dl));
    rows.push([cell]);
  });
  return rows;
}

/**
 * The lightbox footer of a press-photo gallery offers all images as one download ("Alle
 * herunterladbaren Bilder als Bildpaket laden", ZIP): kept after the block as default content
 * (description, file data list, link) — it is no image row.
 */
function lightboxPackage(document, lightbox) {
  const out = [];
  lightbox.querySelectorAll('.frach-m-overlay__footer').forEach((footer) => {
    if (footer.closest('.frach-m-slider__slide')) return;
    const a = footer.querySelector('.frach-m-media-lightbox__button a[href]');
    if (!a || a.getAttribute('href') === '#') return;
    const desc = footer.querySelector('.frach-m-media-lightbox__description');
    if (desc && clean(desc.textContent)) out.push(para(document, document.createTextNode(clean(desc.textContent))));
    const items = [...footer.querySelectorAll('.frach-m-media-lightbox__data-item')]
      .map((li) => clean(li.textContent)).filter(Boolean);
    if (items.length) {
      const ul = document.createElement('ul');
      items.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.append(li); });
      out.push(ul);
    }
    out.push(linkParagraph(document, a));
  });
  return out;
}

function fromTiles(document, scope) {
  const rows = [];
  scope.querySelectorAll('frach-m-image').forEach((comp) => {
    if (comp.closest('frach-m-media-lightbox, .frach-m-media-lightbox')) return;
    const img = makeImage(document, comp);
    if (!img) return;
    const cell = [para(document, img)];
    const cap = comp.querySelector('figcaption, .frach-m-image__caption');
    const title = (cap && clean(cap.textContent)) || '';
    if (title) cell.push(heading(document, title));
    rows.push([cell]);
  });
  return rows;
}

function fromSlider(document, slider) {
  const rows = [];
  slider.querySelectorAll('.frach-m-slider__slide').forEach((slide) => {
    const img = makeImage(document, slide.querySelector('frach-m-image, .frach-m-text-media__media, .frach-m-testimonial__image') || slide);
    if (!img) return;
    const cell = [para(document, img)];
    const t = slide.querySelector('h1, h2, h3, h4, h5, h6, figcaption, .frach-m-testimonial__meta, p');
    if (t && clean(t.textContent)) cell.push(heading(document, t.textContent));
    rows.push([cell]);
  });
  return rows;
}

/**
 * A slider whose text-media slides carry copy beyond their headline (more than a short caption
 * repeating it, or a table / list / link): a gallery tile would drop it.
 */
function hasSlideCopy(slider) {
  return [...slider.querySelectorAll('.frach-m-slider__slide')].some((slide) => {
    const tm = slide.querySelector('frach-m-text-media, .frach-m-text-media');
    const text = tm && tm.querySelector('.frach-m-text-media__text');
    if (!text) return false;
    if (text.querySelector('table, ul, ol, a[href]:not([href="#"])')) return true;
    const head = clean((tm.querySelector('.frach-m-text-media__headline') || {}).textContent || '');
    const body = clean(text.textContent);
    return body.length > 40 && body !== head;
  });
}

export default function parse(element, { document, params }) {
  // A catalog selector can name a part of the gallery (e.g. its tile grid "#gallery-x > div >
  // div > div"): parse the whole gallery component, so its lightbox slides (titles, full-size
  // images) are consumed by the block instead of staying behind as default content.
  if (!element.matches('.frach-m-slider__controls')) {
    const up = element.closest('frach-m-image-gallery-tiles, .frach-m-image-gallery');
    if (up && up !== element && !element.querySelector('frach-m-image-gallery-tiles, .frach-m-image-gallery')) element = up;
  }
  let cells = [];
  let packageDownload = [];
  let variant = '';
  let target = element;

  if (element.matches('.frach-m-slider__controls')) {
    const slider = element.closest('.frach-m-slider');
    if (slider && hasSlideCopy(slider)) {
      // text-media slides with body copy (opening hours, price tables, press-kit teasers):
      // the gallery keeps only an image title, so the slider is a carousel-text-media
      carouselParser(slider, { document, params });
      if (element.isConnected) element.remove();
      return;
    }
    if (slider) {
      cells = fromSlider(document, slider);
      variant = 'alt';
      target = slider;
    }
  } else {
    const gallery = element.matches('.frach-m-image-gallery, frach-m-image-gallery-tiles') ? element
      : element.querySelector('.frach-m-image-gallery, frach-m-image-gallery-tiles');
    const lightbox = (gallery || element).querySelector('frach-m-media-lightbox, .frach-m-media-lightbox');
    if (gallery && gallery.matches('.frach-m-image-gallery') && gallery.querySelector('[id$="-single-item"], .frach-m-image__icon-overlay--files')) {
      variant = 'cover';
    }
    if (lightbox) cells = fromLightbox(document, lightbox);
    if (!cells.length) cells = fromTiles(document, element);
    if (lightbox) packageDownload = lightboxPackage(document, lightbox);
  }

  if (!cells.length) {
    // nothing but slider chrome left (the slider was already imported by its own block)
    element.remove();
    return;
  }

  // Text components sharing the matched section (intro / outro copy) stay as default
  // content before / after the block, in source order.
  const before = [];
  const after = [];
  if (target === element) {
    const firstImg = element.querySelector('frach-m-image');
    [...element.querySelectorAll('.frach-m-text')]
      .filter((t) => !t.closest('frach-m-media-lightbox, .frach-m-media-lightbox, frach-m-image'))
      .forEach((t) => {
        const isBefore = firstImg && !!(t.compareDocumentPosition(firstImg) & 4);
        (isBefore ? before : after).push(...textContent(document, t));
      });
  }
  after.push(...packageDownload);

  const name = variant ? `image-gallery-tiles (${variant})` : 'image-gallery-tiles';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  if (before.length || after.length) {
    const frag = document.createDocumentFragment();
    frag.append(...before, block, ...after);
    element.replaceWith(frag);
    return;
  }
  element.replaceWith(block);
  if (target !== element && target.isConnected) target.replaceWith(block);
}
