/**
 * teaser-mosaic — anniversary photo mosaic: a large main tile (3/4 width) — a photo with an
 * overlay teaser panel, or a video — beside a narrow column of small tiles (logo / colour
 * tiles on top, a photo or teaser below).
 *
 * Authoring: one row per tile, in reading order; the first row is the main tile. Per tile
 * (classified by content, never by index):
 *   - a picture and text (heading / paragraphs / link) → photo with a text panel over it; the
 *     tile's link (the last link) makes the whole tile clickable
 *   - a picture only → a photo (or logo) tile; an empty row → a colour tile
 *   - a video link (mp4, YouTube, Vimeo) with an optional poster picture → a video tile that
 *     plays on click
 * Layout (source order: main, tall, small, small): 4 tiles → main + the two small tiles on top
 * + the tall tile below; 3 tiles → main + one wide small tile + the tall tile; other counts
 * wrap in a simple grid.
 *
 * @variants block class: alt / video — the logo tile is white instead of the brand gradient;
 *   video — the main tile is a video (the poster fills it)
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();
const VIDEO = /\.(mp4|webm)(\?|$)|youtube\.com|youtu\.be|vimeo\.com/i;

function embedFor(href, title) {
  if (/\.(mp4|webm)(\?|$)/i.test(href)) {
    const video = el('video');
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.src = href;
    return video;
  }
  let src = href;
  const yt = href.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{6,})/);
  const vm = href.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (yt) src = `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1`;
  else if (vm) src = `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  const iframe = el('iframe');
  iframe.src = src;
  iframe.title = title || 'Video';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.setAttribute('allowfullscreen', '');
  return iframe;
}

function buildTile(row) {
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  const tile = el('div', 'teaser-mosaic-tile');
  const media = nodes.filter(isMedia);
  const videoLink = nodes.flatMap((n) => [...n.querySelectorAll('a[href]')])
    .find((a) => VIDEO.test(a.href));
  if (videoLink) {
    tile.classList.add('is-video');
    const poster = el('div', 'teaser-mosaic-media');
    if (media[0]) poster.append(media[0]);
    const play = el('button', 'teaser-mosaic-play');
    play.type = 'button';
    const { href } = videoLink;
    const label = videoLink.textContent.trim();
    const title = !label || /^https?:\/\//i.test(label) ? '' : label;
    play.setAttribute('aria-label', title || 'Play video');
    play.addEventListener('click', () => {
      const frame = el('div', 'teaser-mosaic-video');
      frame.append(embedFor(href, title));
      tile.replaceChildren(frame);
    });
    const p = videoLink.closest('p');
    (p || videoLink).remove();
    tile.append(poster, play);
    media.slice(1).forEach((m) => {
      m.classList.add('teaser-mosaic-badge');
      tile.append(m);
    });
    return tile;
  }
  const text = nodes.filter((n) => !isMedia(n) && n.textContent.trim());
  if (media.length) {
    const m = el('div', 'teaser-mosaic-media');
    m.append(...media);
    tile.append(m);
  }
  if (!media.length && !text.length) tile.classList.add('is-colour');
  if (text.length) {
    const panel = el('div', 'teaser-mosaic-panel');
    panel.append(...text);
    tile.append(panel);
    tile.classList.add('has-text');
    const anchors = panel.querySelectorAll('a[href]');
    const last = anchors[anchors.length - 1];
    if (last) {
      const link = el('a', 'teaser-mosaic-link');
      link.href = last.getAttribute('href');
      link.setAttribute('aria-label', (panel.querySelector('h1, h2, h3, h4, h5, h6') || last).textContent.trim());
      link.tabIndex = -1;
      link.setAttribute('aria-hidden', 'true');
      tile.append(link);
    }
  }
  return tile;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .teaser-mosaic-grid')) return;
  const grid = el('div', 'teaser-mosaic-grid');
  [...block.children].forEach((row) => grid.append(buildTile(row)));
  const n = grid.children.length;
  // roles follow the source mosaic: main tile, then the tall tile, then the small tiles
  [...grid.children].forEach((tile, i) => {
    if (i === 0) tile.classList.add('teaser-mosaic-main');
    else if (i === 1 && (n === 3 || n === 4)) tile.classList.add('teaser-mosaic-tall');
    else if (n === 3 || n === 4) tile.classList.add('teaser-mosaic-small');
  });
  grid.classList.add(n === 3 || n === 4 ? `teaser-mosaic-${n}` : 'teaser-mosaic-flow');
  block.replaceChildren(grid);
}
