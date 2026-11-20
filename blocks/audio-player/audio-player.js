/**
 * audio-player — frach-e-audio-player (podcast): a portrait beside a grey panel with headline,
 * teaser, meta line and a player bar (play / pause, elapsed time + scrubber, duration, volume
 * mute toggle, download).
 *
 * Authoring: one cell — picture(s) (a square one for >= 720, a wide one below; a single picture
 * serves both), a heading (headline), a second heading or paragraph (teaser), a paragraph (meta
 * line), and a paragraph holding the link to the audio file (link text = its accessible name;
 * the player plays that file and the download icon links to it).
 * Player controls are block chrome (@ew-exempt: button labels).
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function icon(name) {
  const i = el('span', `icon icon-${name}`);
  i.setAttribute('aria-hidden', 'true');
  return i;
}

function button(className, iconName, label) {
  const b = el('button', className);
  b.type = 'button';
  b.setAttribute('aria-label', label);
  b.append(icon(iconName));
  return b;
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const isAudio = (a) => /\.(mp3|m4a|aac|ogg|wav)(\?|#|$)/i.test(a.getAttribute('href') || '');

function isSquare(p) {
  const img = p.querySelector('img');
  const w = Number(img && img.getAttribute('width'));
  const h = Number(img && img.getAttribute('height'));
  return w && h ? Math.abs(w - h) / w < 0.05 : null;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container')) return;
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const image = el('div', 'audio-player-image');
  const content = el('div', 'audio-player-content');
  const pictures = nodes.filter((n) => n.querySelector('picture, img') && !n.textContent.trim());
  const fileP = nodes.find((n) => n.tagName === 'P' && [...n.querySelectorAll('a')].some(isAudio));
  const headings = nodes.filter((n) => /^H[1-6]$/.test(n.tagName));

  // pictures: square → desktop (>= 720), wide → mobile; order decides only without dimensions
  pictures.forEach((p, i) => {
    const sq = isSquare(p);
    let kind = 'desktop';
    if (pictures.length > 1) {
      if (sq === null) kind = i === 0 ? 'desktop' : 'mobile';
      else kind = sq ? 'desktop' : 'mobile';
    } else kind = 'both';
    const box = el('div', `audio-player-picture audio-player-picture-${kind}`);
    box.append(p);
    image.append(box);
  });

  nodes.forEach((n) => {
    if (pictures.includes(n) || n === fileP) return;
    let cls = 'audio-player-metainfo';
    if (n === headings[0]) cls = 'audio-player-headline h6';
    else if (n === headings[1] || (headings.length < 2 && n.tagName === 'P' && !content.querySelector('.audio-player-sub-headline'))) {
      cls = 'audio-player-sub-headline body';
    }
    const box = el('div', cls);
    box.append(n);
    content.append(box);
  });

  const audio = document.createElement('audio');
  const player = el('div', 'audio-player-player');
  const play = button('audio-player-play', 'play', 'Play');
  const pause = button('audio-player-pause', 'pause', 'Pause');
  const data = el('div', 'audio-player-data');
  const time = el('span', 'audio-player-time');
  time.textContent = '0:00';
  const slider = el('input', 'audio-player-slider');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '0';
  slider.value = '0';
  slider.setAttribute('aria-label', 'Position');
  const duration = el('span', 'audio-player-duration');
  duration.textContent = '0:00';
  data.append(time, slider, duration);
  const volume = el('div', 'audio-player-volume');
  const volBtn = button('audio-player-volume-btn', 'volume', 'Change volume');
  volume.append(volBtn);
  player.append(play, pause, data, volume);

  if (fileP) {
    const a = [...fileP.querySelectorAll('a')].find(isAudio);
    a.classList.add('audio-player-download');
    a.setAttribute('download', '');
    a.setAttribute('aria-label', a.textContent.trim());
    const label = el('span', 'visually-hidden');
    label.append(...a.childNodes);
    a.append(icon('download'), label);
    fileP.classList.add('audio-player-download-row');
    player.append(fileP);
    audio.preload = 'metadata';
    audio.src = a.href;
  }

  const body = el('div', 'audio-player-body');
  body.append(content, player);
  const inner = el('div', 'audio-player-inner');
  inner.append(audio);
  if (image.children.length) inner.append(image);
  inner.append(body);
  const row = el('div', 'row');
  row.append(inner);
  const container = el('div', 'container');
  container.append(row);
  block.replaceChildren(container);

  audio.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(audio.duration)) {
      duration.textContent = fmt(audio.duration);
      slider.max = String(Math.floor(audio.duration));
    }
  });
  play.addEventListener('click', () => {
    block.classList.add('is-playing');
    audio.play().catch(() => block.classList.remove('is-playing'));
  });
  pause.addEventListener('click', () => audio.pause());
  audio.addEventListener('pause', () => block.classList.remove('is-playing'));
  audio.addEventListener('timeupdate', () => {
    time.textContent = fmt(audio.currentTime);
    slider.value = String(Math.floor(audio.currentTime));
  });
  slider.addEventListener('input', () => {
    if (audio.src) audio.currentTime = Number(slider.value);
  });
  volBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    volBtn.setAttribute('aria-pressed', String(audio.muted));
  });
}
