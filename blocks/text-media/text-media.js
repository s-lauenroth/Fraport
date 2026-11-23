/**
 * text-media — frach-m-text-media: an optional media row (an image, or a gradient highlight
 * box carrying a short statement) above a rich-text column with buttons.
 *
 * Authoring: one row, one or two cells.
 *   - media cell (optional, first of two): a picture → image; text only → highlight box
 *   - text cell: headings, paragraphs, lists; CTA paragraphs (<strong>/<em> links) become the
 *     button row
 *
 * @variants block class: left | right — the media floats left / right beside the text (a
 *   leading h2 / h3 of the text cell becomes the row headline; an h4 stays in the text);
 *   half — media 50 % wide; third — media 33 % wide (source 66-33); its rich-text links carry
 *   the source's inline arrow (decorative inline svg, 16×24)
 *
 * Side-by-side options (media and text in two columns >= 720; the media cell keeps all of its
 * content):
 *   image-left, image-left-2, image-left-3, image-left-4 — media left, text right; in
 *     image-left-2 text in the media cell is the image caption
 *   alt — text left, media right (6 / 6 cols), the text first when stacked; a block without
 *     options whose media cell holds a picture does the same with 8 / 4 cols (JS adds
 *     .text-media-aside to both)
 *   wide-media — media / text 6 cols each, the player 400 px high; a video link (mp4,
 *     YouTube, Vimeo) in the media cell becomes the player
 *   quote-overlay, quote-overlay-2, quote-overlay-3, quote-overlay-4 — text left, image right;
 *     text in the media cell (statement, blockquote, caption) is set over the image, a last
 *     short paragraph after the quote is the image caption
 *   blue — several pictures in the media cell become a slider (prev / next, dots), media left;
 *     a leading <p><em> of the text cell is the slider caption
 *   grey — grey band behind the block (news list entry with date and tags)
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const SPLIT = /^(image-left(-\d+)?|alt|wide-media|quote-overlay(-\d+)?|blue)$/;
const isMediaNode = (n) => !!n.querySelector('picture, img, video, iframe') && !n.textContent.trim();
const VIDEO = /\.(mp4|webm)(\?|$)|youtube\.com|youtu\.be|vimeo\.com/i;

/** a video link → <video> (file) or a privacy-friendly iframe (YouTube / Vimeo) */
function videoFrom(a) {
  const { href } = a;
  const wrap = el('div', 'text-media-video');
  if (/\.(mp4|webm)(\?|$)/i.test(href)) {
    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'metadata';
    video.src = href;
    wrap.append(video);
    return wrap;
  }
  let src = href;
  const yt = href.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{6,})/);
  const vm = href.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (yt) src = `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  else if (vm) src = `https://player.vimeo.com/video/${vm[1]}`;
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = a.textContent.trim() || 'Video';
  iframe.loading = 'lazy';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.setAttribute('allowfullscreen', '');
  wrap.append(iframe);
  return wrap;
}

/** blue option: pictures as a scroll-snap slider with prev / next and dots */
function slider(pictures) {
  const wrap = el('div', 'text-media-slider');
  const track = el('div', 'text-media-slides');
  pictures.forEach((p) => {
    const slide = el('div', 'text-media-slide');
    slide.append(p);
    track.append(slide);
  });
  const dots = el('div', 'text-media-dots');
  const go = (i) => {
    const n = Math.max(0, Math.min(pictures.length - 1, i));
    track.scrollTo({ left: track.children[n].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };
  const current = () => Math.round(track.scrollLeft / (track.clientWidth || 1));
  // source frach-e-button--primary --icon-only: the foundation's button classes
  const control = (cls, label, step) => {
    const b = el('button', `${cls} button primary button-icon-only`);
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.append(el('span', 'text-media-control-icon'));
    b.addEventListener('click', () => go(current() + step));
    return b;
  };
  const prev = control('text-media-prev', 'Previous Slide', -1);
  const next = control('text-media-next', 'Next Slide', 1);
  pictures.forEach((_, i) => {
    const d = el('button', 'text-media-dot');
    d.type = 'button';
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.addEventListener('click', () => go(i));
    dots.append(d);
  });
  const mark = () => {
    const i = current();
    [...dots.children].forEach((d, n) => {
      d.classList.toggle('is-active', n === i);
      d.setAttribute('aria-current', n === i ? 'true' : 'false');
    });
    prev.disabled = i <= 0;
    next.disabled = i >= pictures.length - 1;
  };
  track.addEventListener('scroll', () => requestAnimationFrame(mark), { passive: true });
  mark();
  wrap.append(track, prev, next, dots);
  return wrap;
}

/** side-by-side options: build the media column from every node of the media cell */
function buildSplitMedia(block, mediaCell) {
  const media = el('div', 'text-media-media');
  const nodes = [...mediaCell.children];
  const pictures = nodes.filter(isMediaNode);
  const videoLink = !pictures.length || block.classList.contains('wide-media')
    ? [...mediaCell.querySelectorAll('a[href]')].find((a) => VIDEO.test(a.href)) : null;
  const overlay = [...block.classList].some((c) => /^quote-overlay(-\d+)?$/.test(c));
  if (videoLink) {
    media.append(videoFrom(videoLink));
    const p = videoLink.closest('p');
    if (p && p.textContent.trim() === videoLink.textContent.trim()) p.remove();
    else videoLink.remove();
  } else if (block.classList.contains('blue') && pictures.length > 1) {
    media.append(slider(pictures));
  }
  const fig = el('div', 'text-media-image');
  if (!media.children.length && pictures[0]) fig.append(pictures[0]);
  const rest = [...mediaCell.children].filter((n) => !isMediaNode(n) && n.textContent.trim());
  if (overlay && rest.length) {
    const quote = el('div', 'text-media-quote');
    const last = rest[rest.length - 1];
    const hasQuote = rest.some((n) => n.tagName === 'BLOCKQUOTE');
    const captionNode = rest.length > 1 && hasQuote && last.tagName === 'P'
      && rest.indexOf(last) > rest.findIndex((n) => n.tagName === 'BLOCKQUOTE') ? last : null;
    rest.filter((n) => n !== captionNode).forEach((n) => quote.append(n));
    fig.append(quote);
    if (captionNode) {
      const cap = el('div', 'text-media-caption');
      cap.append(captionNode);
      fig.append(cap);
    }
  } else if (rest.length) {
    const cap = el('div', 'text-media-caption');
    cap.append(...rest);
    fig.append(cap);
  }
  // further pictures (image-left-3: a second image) stay below the first
  pictures.slice(1).filter((p) => !p.closest('.text-media-slider')).forEach((p) => fig.append(p));
  if (fig.children.length) media.append(fig);
  return media;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const ARROW = 'M14.29 7.29a1 1 0 0 1 1.42 0l4 4a1 1 0 0 1 0 1.42l-4 4a1 1 0 0 1-1.42-1.42L16.59 13H5'
  + 'a1 1 0 0 1 0-2h11.59l-2.3-2.29a1 1 0 0 1-.08-1.32z';

/** decorative inline arrow before a rich-text link (the source's frach-e-link icon) */
function arrowIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 16 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('text-media-link-icon');
  const g = document.createElementNS(SVG_NS, 'path');
  g.setAttribute('d', ARROW);
  g.setAttribute('transform', 'translate(-4 0)');
  g.setAttribute('fill', 'currentcolor');
  svg.append(g);
  return svg;
}

const isCta = (p) => p.matches('.button-wrapper') || !!p.querySelector(':scope > a.button');

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const textCell = cells[cells.length - 1];
  const mediaCell = cells.length > 1 ? cells[0] : null;

  const container = el('div', 'container');
  const row = el('div', 'row');
  container.append(row);

  // left / right (floated media): a leading heading of the text cell is the row headline
  const floated = block.classList.contains('left') || block.classList.contains('right');
  const lead = textCell && textCell.firstElementChild;
  if (floated && lead && /^H[23]$/.test(lead.tagName)) {
    const headline = el('div', 'text-media-headline');
    headline.append(lead);
    row.append(headline);
  }

  // alt, and no option with a picture in the media cell (source grid row: text 8 cols, image 4
  // cols on the right): text beside the image; without a picture the media row stays above
  const options = [...block.classList].filter((c) => c !== 'text-media' && c !== 'block');
  const hasPicture = !!(mediaCell && mediaCell.querySelector('picture, img'));
  const aside = (block.classList.contains('alt') || !options.length) && hasPicture;
  const split = aside || options.some((c) => SPLIT.test(c));
  if (split) block.classList.add('text-media-split');
  if (aside) block.classList.add('text-media-aside');

  // blue: a leading emphasised paragraph of the text cell is the slider caption
  const first = textCell && textCell.firstElementChild;
  if (block.classList.contains('blue') && mediaCell && first && first.tagName === 'P'
    && first.children.length === 1 && first.firstElementChild.tagName === 'EM'
    && first.textContent.trim() === first.firstElementChild.textContent.trim()) {
    mediaCell.append(first);
  }
  if (split && mediaCell && mediaCell.children.length) {
    row.append(buildSplitMedia(block, mediaCell));
  } else if (mediaCell && mediaCell.children.length) {
    const media = el('div', 'text-media-media');
    const picture = mediaCell.querySelector('picture, img');
    if (picture) {
      const fig = el('div', 'text-media-image');
      fig.append(picture);
      media.append(fig);
    } else {
      const box = el('div', 'text-media-highlight');
      const txt = el('div', 'text-media-highlight-text h6');
      txt.append(...mediaCell.children);
      box.append(txt);
      media.append(box);
    }
    row.append(media);
  }

  if (textCell) {
    const text = el('div', 'text-media-text');
    const rte = el('div', 'rte');
    const buttons = el('div', 'buttons');
    [...textCell.children].forEach((n) => {
      if (n.tagName === 'P' && isCta(n)) buttons.append(n);
      else rte.append(n);
    });
    if (block.classList.contains('third')) {
      rte.querySelectorAll('a[href]:not(.button)').forEach((a) => {
        if (!a.querySelector('svg')) a.prepend(arrowIcon());
      });
    }
    text.append(rte);
    // kept when empty: the source row stops the rte margin collapsing (floated: no row)
    if (!floated || buttons.children.length) text.append(buttons);
    row.append(text);
  }
  block.replaceChildren(container);
}
