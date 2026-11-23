/**
 * cards-teaser — ruled teaser slider (source frach-m-slider of frach-m-teaser): each slide is a
 * column holding one image card or one / two stacked text cards; three slides per view from
 * 960px, two from 720px, all stacked below. Prev / next arrows scroll by one view.
 *
 * Authoring: one row per card — an optional picture (alone in its paragraph), a theme line, a
 * heading (linked), teaser paragraphs and an optional link paragraph (the "Lesen" link).
 * Decoded by role, never by index. Slide grouping (the source's slide markup is not in the
 * content): an image card is its own slide; a run of text cards pairs up, an odd run starts
 * with a single card (reproduces the source newsroom slider).
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();
const isLinkOnly = (n) => n.tagName === 'P' && !!n.querySelector('a[href]')
  && n.textContent.trim() === n.querySelector('a').textContent.trim();

function buildCard(row) {
  const nodes = [...row.querySelectorAll(':scope > div > *')];
  const card = el('div', 'cards-teaser-card');
  const image = el('div', 'cards-teaser-image');
  const body = el('div', 'cards-teaser-body');
  const more = el('div', 'cards-teaser-more');
  let seenHeading = false;
  nodes.forEach((n) => {
    if (isMedia(n)) {
      image.append(n);
    } else if (/^H[1-6]$/.test(n.tagName)) {
      seenHeading = true;
      n.classList.add('cards-teaser-headline');
      body.append(n);
    } else if (seenHeading && isLinkOnly(n)) {
      const a = n.querySelector('a');
      a.classList.add('button', 'accent');
      n.classList.remove('button-container');
      more.append(n);
    } else {
      if (n.tagName === 'P') n.classList.add(seenHeading ? 'cards-teaser-text' : 'cards-teaser-theme');
      body.append(n);
    }
  });
  if (image.children.length) {
    card.append(image);
    card.classList.add('cards-teaser-featured');
  }
  card.append(body);
  if (more.children.length) card.append(more);
  return card;
}

function groupSlides(cards) {
  const slides = [];
  const run = [];
  const flush = () => {
    if (run.length % 2) slides.push([run.shift()]);
    while (run.length) slides.push(run.splice(0, 2));
  };
  cards.forEach((card) => {
    if (card.classList.contains('cards-teaser-featured')) {
      flush();
      slides.push([card]);
    } else {
      run.push(card);
    }
  });
  flush();
  return slides;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .cards-teaser-viewport')) return;
  const cards = [...block.children]
    .filter((row) => row.textContent.trim() || row.querySelector('picture, img'))
    .map(buildCard);
  const list = el('ul', 'cards-teaser-list');
  groupSlides(cards).forEach((group) => {
    const slide = el('li', 'cards-teaser-slide');
    slide.append(...group);
    list.append(slide);
  });
  const viewport = el('div', 'cards-teaser-viewport');
  viewport.append(list);
  block.replaceChildren(viewport);

  const prev = el('button', 'cards-teaser-prev');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous Slide');
  const next = el('button', 'cards-teaser-next');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next Slide');
  const step = (dir) => list.scrollBy({ left: dir * list.clientWidth, behavior: 'smooth' });
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  const update = () => {
    const max = list.scrollWidth - list.clientWidth;
    prev.hidden = list.scrollLeft <= 1;
    next.hidden = list.scrollLeft >= max - 1;
    block.classList.toggle('is-scrollable', max > 1);
  };
  list.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', update);
  viewport.append(prev, next);
  requestAnimationFrame(update);
}
