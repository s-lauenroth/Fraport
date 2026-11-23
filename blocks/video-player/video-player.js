/**
 * video-player — hosted video player: a 16:9 poster image with a centred play button; on click
 * the poster is replaced by the player (an HTML5 <video> for mp4 / webm, a privacy-friendly
 * YouTube / Vimeo iframe otherwise). Without a poster the player loads when scrolled into view.
 *
 * Authoring: one row — the video link (an mp4 / webm file, a YouTube or Vimeo URL), an optional
 * poster picture and optional caption paragraphs (shown below the video). Decoded by role.
 *
 * @variants block class: autoplay-background — a muted, looping background video (file links
 *   only) that starts on its own; a second picture (e.g. a slogan graphic) and any text sit
 *   over it; a pause / play toggle stays available, and with prefers-reduced-motion the video
 *   does not autoplay
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();
const FILE = /\.(mp4|webm|mov)(\?|#|$)/i;
const VIDEO = /\.(mp4|webm|mov)(\?|#|$)|youtube\.com|youtu\.be|vimeo\.com/i;

function embedUrl(href, autoplay) {
  const yt = href.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})/);
  const vm = href.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const ap = autoplay ? '?autoplay=1' : '';
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}${ap}`;
  if (vm) return `https://player.vimeo.com/video/${vm[1]}${ap}`;
  return href;
}

function player(href, title, autoplay) {
  const frame = el('div', 'video-player-frame');
  if (FILE.test(href)) {
    const v = el('video');
    v.controls = true;
    v.playsInline = true;
    v.preload = 'metadata';
    v.src = href;
    if (autoplay) v.autoplay = true;
    frame.append(v);
  } else {
    const iframe = el('iframe');
    iframe.src = embedUrl(href, autoplay);
    iframe.title = title || 'Video';
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    iframe.setAttribute('allowfullscreen', '');
    frame.append(iframe);
  }
  return frame;
}

function decorateBackground(block, href, pictures, text) {
  const stage = el('div', 'video-player-stage');
  const bg = el('video', 'video-player-background');
  bg.muted = true;
  bg.loop = true;
  bg.playsInline = true;
  bg.setAttribute('aria-hidden', 'true');
  bg.src = href;
  const [poster, ...overlays] = pictures;
  if (poster) {
    const img = poster.querySelector('img');
    if (img) bg.poster = img.currentSrc || img.src;
  }
  stage.append(bg);
  if (overlays.length || text.length) {
    const overlay = el('div', 'video-player-overlay');
    overlay.append(...overlays, ...text);
    stage.append(overlay);
  }
  const toggle = el('button', 'video-player-toggle');
  toggle.type = 'button';
  const setState = (playing) => {
    toggle.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    toggle.classList.toggle('is-paused', !playing);
  };
  toggle.addEventListener('click', () => {
    if (bg.paused) bg.play().catch(() => {});
    else bg.pause();
  });
  bg.addEventListener('play', () => setState(true));
  bg.addEventListener('pause', () => setState(false));
  setState(false);
  stage.append(toggle);
  block.replaceChildren(stage);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bg.autoplay = true;
    bg.play().catch(() => {});
  }
}

export default function decorate(block) {
  const done = ':scope > :is(.video-player-stage, .video-player-poster, .video-player-frame)';
  if (block.querySelector(done)) return;
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const anchor = [...block.querySelectorAll('a[href]')].find((a) => VIDEO.test(a.href));
  const pictures = nodes.filter(isMedia);
  if (!anchor) return; // nothing playable: keep the authored content
  const { href } = anchor;
  const title = anchor.textContent.trim() !== href ? anchor.textContent.trim() : '';
  const linkP = anchor.closest('p');
  if (linkP && linkP.textContent.trim() === anchor.textContent.trim()) linkP.remove();
  else anchor.remove();
  const text = nodes.filter((n) => !isMedia(n) && n.isConnected && n.textContent.trim());

  if (block.classList.contains('autoplay-background') && FILE.test(href)) {
    decorateBackground(block, href, pictures, text);
    return;
  }

  const parts = [];
  if (pictures[0]) {
    const poster = el('div', 'video-player-poster');
    poster.append(pictures[0]);
    const play = el('button', 'video-player-play');
    play.type = 'button';
    play.setAttribute('aria-label', title ? `Play: ${title}` : 'Play video');
    play.addEventListener('click', () => {
      poster.replaceWith(player(href, title, true));
    });
    poster.append(play);
    parts.push(poster);
  } else {
    const holder = el('div', 'video-player-frame is-pending');
    parts.push(holder);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        holder.replaceWith(player(href, title, false));
      }
    });
    io.observe(holder);
  }
  if (text.length) {
    const caption = el('div', 'video-player-caption');
    caption.append(...text);
    parts.push(caption);
  }
  block.replaceChildren(...parts);
}
