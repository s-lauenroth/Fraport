/**
 * related-content — frach-m-related-content (a teaser-slider): a rail of teasers, three per
 * page with prev/next paging and dots (>= 720); below 720 a stacked list of the first three
 * plus a "load more" button that reveals the rest.
 *
 * Authoring: one row per slide. A slide holds one or more teasers, segmented on the heading
 * (reconstructive): an optional picture, a theme line (paragraph before the heading), the
 * heading (its link is the teaser link), a text paragraph, an optional CTA paragraph
 * (<strong><em><a>Lesen</a></em></strong> — the tertiary arrow button).
 *
 * Every third slide may stack two text-only teasers (author two headings in that row).
 * Control labels (prev/next/load more) are generated UI, not authored content.
 */

const LABELS = {
  de: { prev: 'Previous Slide', next: 'Next Slide', more: 'Mehr News' },
  en: { prev: 'Previous Slide', next: 'Next Slide', more: 'More News' },
};

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function wrapNode(node, className) {
  const w = el('div', className);
  w.append(node);
  return w;
}

function onView(elem) {
  if (!('IntersectionObserver' in window)) {
    elem.classList.add('is-animating');
    return;
  }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add('is-animating');
      io.unobserve(en.target);
    }
  }), { threshold: 0.1 });
  io.observe(elem);
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const ARROW = 'M14.29 7.29a1 1 0 0 1 1.42 0l4 4a1 1 0 0 1 0 1.42l-4 4a1 1 0 0 1-1.42-1.42L16.59 13H5'
  + 'a1 1 0 0 1 0-2h11.59l-2.3-2.29a1 1 0 0 1-.08-1.32z';

/** decorative arrow of the tertiary CTA (the source draws it as an inline svg) */
function arrowIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ARROW);
  svg.append(path);
  return svg;
}

const isCta = (p) => p.matches('.button-wrapper') || !!p.querySelector('a.button')
  || (p.querySelectorAll('a').length === 1 && p.textContent.trim() === p.querySelector('a').textContent.trim()
    && !!p.querySelector('strong a, em a'));

/** segment the authored nodes of one row into teasers (heading-boundary, order-agnostic) */
function buildTeasers(row) {
  const nodes = [];
  [...row.children].forEach((cell) => {
    if (cell.children.length) nodes.push(...cell.children);
  });
  const teasers = [];
  let cur = null;
  let pending = { image: null, theme: null };
  const flush = () => {
    if (cur) teasers.push(cur);
    cur = null;
  };
  nodes.forEach((n) => {
    const media = n.matches('picture, img') ? n : n.querySelector('picture, img');
    if (media && !n.textContent.trim()) {
      if (cur && cur.heading) flush();
      if (cur) cur.image = media;
      else pending.image = media;
      return;
    }
    if (/^H[1-6]$/.test(n.tagName)) {
      if (cur && cur.heading) flush();
      if (!cur) {
        cur = { ...pending };
        pending = { image: null, theme: null };
      }
      cur.heading = n;
      return;
    }
    if (n.tagName === 'P' && isCta(n)) {
      if (cur) cur.link = n;
      return;
    }
    if (!cur || !cur.heading) {
      if (!cur) {
        cur = { ...pending };
        pending = { image: null, theme: null };
      }
      cur.theme = n;
    } else if (!cur.text && !cur.link) cur.text = n;
    else {
      flush();
      pending.theme = n;
    }
  });
  flush();
  return teasers.map((t) => {
    const teaser = el('div', 'teaser');
    if (t.image) teaser.append(wrapNode(t.image, 'teaser-image'));
    if (t.theme) teaser.append(wrapNode(t.theme, 'teaser-theme'));
    else {
      const spacer = el('div', 'teaser-theme');
      spacer.setAttribute('aria-hidden', 'true');
      spacer.innerHTML = '&nbsp;';
      teaser.append(spacer);
    }
    if (t.heading) teaser.append(wrapNode(t.heading, 'teaser-headline h6'));
    if (t.text) teaser.append(wrapNode(t.text, 'teaser-text'));
    if (t.link) {
      const a = t.link.querySelector('a');
      if (a && !a.querySelector('svg')) a.append(arrowIcon());
      teaser.append(wrapNode(t.link, 'teaser-link'));
    }
    return teaser;
  });
}

function controlButton(className, icon, label) {
  const b = el('button', `button primary button-primary button-icon-only ${className}`);
  b.type = 'button';
  const i = el('span', `icon icon-${icon}`);
  i.setAttribute('aria-hidden', 'true');
  const t = el('span', 'visually-hidden');
  t.textContent = label;
  b.append(i, t);
  return b;
}

function container(...children) {
  const c = el('div', 'container');
  const r = el('div', 'row');
  const d = el('div');
  d.append(...children);
  r.append(d);
  c.append(r);
  return c;
}

export default function decorate(block) {
  const lang = (document.documentElement.lang || 'de').slice(0, 2);
  const label = LABELS[lang] || LABELS.de;
  const per = 3;

  const slides = [...block.children].map((row) => {
    const slide = el('div', 'slider-slide');
    slide.append(...buildTeasers(row));
    return slide;
  }).filter((s) => s.children.length);

  const slider = el('div', 'slider');
  slider.dataset.slides = String(per);
  const viewport = el('div', 'slider-viewport');
  const track = el('div', 'slider-slides');
  track.append(...slides);
  viewport.append(track);
  const prev = controlButton('slider-prev', 'arrow-left', label.prev);
  const next = controlButton('slider-next', 'arrow-right', label.next);
  const controls = el('div', 'slider-controls');
  controls.append(prev, next);
  const pagination = el('div', 'slider-pagination');
  const dots = slides.map(() => pagination.appendChild(el('span', 'slider-dot')));
  slider.append(viewport, controls, pagination);

  const moreBtn = el('button', 'button secondary button-secondary slider-more-button');
  moreBtn.type = 'button';
  moreBtn.textContent = label.more;
  const more = el('div', 'slider-more');
  more.append(container(moreBtn));

  const frame = el('div', 'slider-frame');
  frame.dataset.animate = 'appear-right';
  frame.append(container(slider));
  if (slides.length > per) frame.append(more);
  // nothing to load: drop the load-more reservation (< 720) as the source does
  else block.classList.add('is-loaded');
  block.replaceChildren(frame);
  if (frame.dataset.animate) onView(frame);

  let page = 0;
  const pages = Math.max(1, Math.ceil(slides.length / per));
  const go = (p, animate = true) => {
    page = Math.max(0, Math.min(pages - 1, p));
    const first = page * per;
    if (animate) track.style.transition = 'transform .15s cubic-bezier(.6,.15,.6,.95)';
    const offset = slides[first] ? slides[first].offsetLeft - slides[0].offsetLeft : 0;
    track.style.transform = page ? `translateX(${-offset}px)` : '';
    slides.forEach((s, i) => {
      const on = i >= first && i < first + per;
      s.classList.toggle('is-off', !on);
      if (on) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === first));
    prev.disabled = page === 0;
    next.disabled = page === pages - 1;
  };
  prev.addEventListener('click', () => go(page - 1));
  next.addEventListener('click', () => go(page + 1));
  moreBtn.addEventListener('click', () => block.classList.add('is-loaded'));
  go(0, false);
}
