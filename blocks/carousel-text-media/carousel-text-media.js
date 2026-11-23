/**
 * carousel-text-media — one-at-a-time slider of text + media slides (portrait and quote,
 * history entries, vehicles) with prev / next arrows at the block edges and slide dots.
 *
 * Authoring: one row per slide — a media cell (a picture) and a text cell (heading, quote,
 * paragraphs, links); a slide may be text-only (one cell). A first row holding only a heading
 * (no picture) is the carousel title above the slides. Rows holding only pictures (no text)
 * add those pictures to the slide before them; a slide with several pictures shows them in an
 * inner image slider. Decoded by role, never by index.
 *
 * @variants block class:
 *   (default) — image left, text right
 *   image-right, image-right-2 — text left, image right; the text flows around the image and
 *     a leading h3 of a slide is its headline across the slide top
 *   full-width-photo — the picture fills the slide, the text is set over it; a last short
 *     paragraph of the text cell (the byline) becomes a caption box at the image foot
 *   alt — text-only slides (pictures, if any, are ignored in the layout)
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();
const HEADING = /^H[1-6]$/;

function iconButton(className, label) {
  const b = el('button', className);
  b.type = 'button';
  b.setAttribute('aria-label', label);
  return b;
}

/** Turns a media wrapper holding several pictures into an inner image slider. */
function buildGallery(media) {
  // the same picture authored twice (source lightbox copies) shows once
  const seen = new Set();
  const items = [...media.children].filter((n) => {
    const img = n.matches('img') ? n : n.querySelector('img');
    if (!img) return false;
    const key = (img.getAttribute('src') || '').split('?')[0];
    if (seen.has(key)) {
      n.remove();
      return false;
    }
    seen.add(key);
    return true;
  });
  if (items.length < 2) return;
  const gallery = el('div', 'carousel-text-media-gallery');
  const frame = el('div', 'carousel-text-media-gallery-frame');
  const track = el('ul', 'carousel-text-media-gallery-track');
  items.forEach((item) => {
    const li = el('li');
    li.append(item);
    track.append(li);
  });
  const prev = iconButton('carousel-text-media-gallery-prev', 'Previous Slide');
  const next = iconButton('carousel-text-media-gallery-next', 'Next Slide');
  const dots = el('ol', 'carousel-text-media-gallery-dots');
  frame.append(track, prev, next);
  gallery.append(frame, dots);
  media.prepend(gallery);

  const pics = [...track.children];
  let current = 0;
  const mark = (n) => {
    current = n;
    prev.disabled = n === 0;
    next.disabled = n === pics.length - 1;
    [...dots.children].forEach((d, i) => {
      d.firstElementChild.setAttribute('aria-current', i === n ? 'true' : 'false');
    });
  };
  const show = (n) => {
    const i = Math.max(0, Math.min(pics.length - 1, n));
    track.scrollTo({ left: pics[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    mark(i);
  };
  pics.forEach((p, i) => {
    const li = el('li');
    const b = iconButton('carousel-text-media-gallery-dot', `Image ${i + 1}`);
    b.addEventListener('click', () => show(i));
    li.append(b);
    dots.append(li);
  });
  prev.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  next.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
  track.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      const n = Math.round(track.scrollLeft / (track.clientWidth || 1));
      if (n !== current) mark(n);
    });
  }, { passive: true });
  mark(0);
}

function buildSlide(cells, i, block) {
  const fullWidth = block.classList.contains('full-width-photo');
  const imageRight = block.matches('.image-right, .image-right-2');
  const slide = el('li', 'carousel-text-media-slide');
  slide.id = `${block.id || 'ctm'}-slide-${i}`;
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');
  const media = el('div', 'carousel-text-media-media');
  const text = el('div', 'carousel-text-media-text');
  cells.forEach((n) => {
    if (isMedia(n)) media.append(n);
    else text.append(n);
  });
  if (fullWidth && media.children.length && text.children.length > 1) {
    const last = text.lastElementChild;
    if (last.tagName === 'P' && !last.querySelector('a') && last.textContent.length < 120) {
      const caption = el('div', 'carousel-text-media-caption');
      caption.append(last);
      media.append(caption);
    }
  }
  // image-right: a leading h3 followed by more text spans the slide above image and text
  if (imageRight && media.children.length && text.children.length > 1
    && text.firstElementChild.tagName === 'H3') {
    const headline = el('div', 'carousel-text-media-headline');
    headline.append(text.firstElementChild);
    slide.append(headline);
  }
  if (media.children.length) slide.append(media);
  else slide.classList.add('is-text-only');
  if (text.children.length) slide.append(text);
  return slide;
}

let count = 0;

export default function decorate(block) {
  if (block.querySelector(':scope > .carousel-text-media-viewport')) return;
  count += 1;
  block.id = block.id || `carousel-text-media-${count}`;
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  const rows = [...block.children];
  let title = null;
  const first = rows[0];
  if (first && !first.querySelector('picture, img') && first.querySelectorAll(':scope > div > *').length === 1
    && HEADING.test(first.querySelector(':scope > div > *').tagName) && rows.length > 1) {
    title = el('div', 'carousel-text-media-title');
    title.append(first.querySelector(':scope > div > *'));
    rows.shift();
  }
  // group rows into slides: a picture-only row adds its pictures to the slide before it
  const groups = [];
  rows.forEach((row) => {
    const hasText = !!row.textContent.trim();
    if (!hasText && !row.querySelector('picture, img')) return;
    const cells = [...row.querySelectorAll(':scope > div > *')];
    if (!hasText && groups.length) groups[groups.length - 1].push(...cells);
    else groups.push(cells);
  });
  const track = el('ul', 'carousel-text-media-slides');
  groups.forEach((cells, i) => track.append(buildSlide(cells, i, block)));
  track.querySelectorAll('.carousel-text-media-media').forEach(buildGallery);
  const slides = [...track.children];

  const viewport = el('div', 'carousel-text-media-viewport');
  viewport.append(track);
  const parts = title ? [title, viewport] : [viewport];
  block.replaceChildren(...parts);
  if (slides.length < 2) return;

  const prev = iconButton('carousel-text-media-prev', 'Previous Slide');
  const next = iconButton('carousel-text-media-next', 'Next Slide');
  const dots = el('ol', 'carousel-text-media-dots');
  let current = 0;
  const show = (n) => {
    current = Math.max(0, Math.min(slides.length - 1, n));
    track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };
  const mark = (n) => {
    current = n;
    slides.forEach((s, i) => {
      s.setAttribute('aria-hidden', i === n ? 'false' : 'true');
      s.querySelectorAll('a, button').forEach((f) => { f.tabIndex = i === n ? 0 : -1; });
    });
    [...dots.children].forEach((d, i) => {
      d.firstElementChild.setAttribute('aria-current', i === n ? 'true' : 'false');
    });
    prev.disabled = n === 0;
    next.disabled = n === slides.length - 1;
  };
  slides.forEach((s, i) => {
    s.setAttribute('aria-label', `${i + 1} / ${slides.length}`);
    const li = el('li');
    const b = iconButton('carousel-text-media-dot', `Slide ${i + 1}`);
    b.addEventListener('click', () => show(i));
    li.append(b);
    dots.append(li);
  });
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  track.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      const n = Math.round(track.scrollLeft / (track.clientWidth || 1));
      if (n !== current) mark(n);
    });
  }, { passive: true });
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  // controls first in DOM: they precede the slides, as on the source
  viewport.prepend(prev, next);
  viewport.append(dots);
  mark(0);
}
