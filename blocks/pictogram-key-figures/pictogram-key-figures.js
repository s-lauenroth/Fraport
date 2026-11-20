/**
 * pictogram-key-figures — frach-m-pictogram-key-figures: a row of figure cards (1 / 2 / 3 per
 * row), each a centred pictogram, an aubergine number (h2 ramp) that counts up from 0 when it
 * scrolls into view, a rule and the caption; an optional footnote opens from an info icon.
 *
 * Authoring: one row per figure — cell 1 the pictogram (picture), cell 2 the value as displayed
 * (e.g. `2.700`), cell 3 the caption paragraph and, optionally, a second paragraph = the
 * footnote (shown on the info icon). Decoded by role (picture / first text / rest).
 * A last row with one cell and no picture is the legend under the grid (rule + caption).
 *
 * The count-up runs on a presentational overlay (aria-hidden); the authored value stays in place
 * (hidden while counting) as the editable source. The info toggle is generated UI.
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

/** single-paragraph cells arrive unwrapped from the pipeline: wrap loose nodes in one <p> */
function blockChildren(cell) {
  if ([...cell.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    cell.append(p);
  }
  return [...cell.children];
}

const isMedia = (n) => !!n.querySelector('picture, img') || ['PICTURE', 'IMG'].includes(n.tagName);

function onView(elem, fn) {
  if (!('IntersectionObserver' in window)) {
    fn();
    return;
  }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) {
      io.unobserve(en.target);
      fn();
    }
  }), { threshold: 0.1 });
  io.observe(elem);
}

function countUp(wrap) {
  const m = wrap.textContent.match(/-?[\d.]+(,\d+)?/);
  if (!m || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const decimals = m[1] ? m[1].length - 1 : 0;
  const num = parseFloat(m[0].replace(/\./g, '').replace(',', '.'));
  if (Number.isNaN(num)) return;
  const prefix = wrap.textContent.slice(0, m.index);
  const suffix = wrap.textContent.slice(m.index + m[0].length);
  const overlay = el('span', 'pictogram-key-figures-count');
  overlay.setAttribute('aria-hidden', 'true');
  wrap.classList.add('is-counting');
  wrap.append(overlay);
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / 2000);
    const value = (num * (1 - (1 - t) ** 3)).toLocaleString('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    overlay.textContent = `${prefix.trim()}${value}${suffix.trim()}`;
    if (t < 1) requestAnimationFrame(tick);
    else {
      overlay.remove();
      wrap.classList.remove('is-counting');
    }
  };
  requestAnimationFrame(tick);
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const INFO = 'M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525'
  + ',22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4'
  + ',12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.'
  + '418278,4 12,4 Z M12,11 C12.5522847,11 13,11.4477153 13,12 L13,16 C13,16.5522847 12.5'
  + '522847,17 12,17 C11.4477153,17 11,16.5522847 11,16 L11,12 C11,11.4477153 11.4477153,'
  + '11 12,11 Z M12,7 C12.5522847,7 13,7.44771525 13,8 C13,8.55228475 12.5522847,9 12,9 C'
  + '11.4477153,9 11,8.55228475 11,8 C11,7.44771525 11.4477153,7 12,7 Z';

/** info glyph (the source draws it as an inline 16 x 16 image) */
function infoIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'pictogram-key-figures-info-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', INFO);
  svg.append(path);
  return svg;
}

let uid = 0;

export default function decorate(block) {
  if (block.querySelector('.pictogram-key-figures-item')) return;
  const items = el('div', 'pictogram-key-figures-items');
  const values = [];
  let legend;
  [...block.children].forEach((row) => {
    const nodes = [...row.children].flatMap((cell) => blockChildren(cell));
    if (!nodes.length) return;
    if (row.children.length === 1 && !nodes.some(isMedia)) {
      legend = el('div', 'pictogram-key-figures-legend');
      legend.append(el('div', 'pictogram-key-figures-separator'), ...nodes);
      return;
    }
    const item = el('div', 'pictogram-key-figures-item');
    const pictogram = el('div', 'pictogram-key-figures-pictogram');
    const value = el('div', 'pictogram-key-figures-value');
    const rule = el('div', 'pictogram-key-figures-separator');
    const text = el('div', 'pictogram-key-figures-text');
    const info = el('div', 'pictogram-key-figures-info');
    nodes.forEach((n) => {
      if (isMedia(n) && !pictogram.children.length) pictogram.append(n);
      else if (!value.children.length && n.textContent.trim()) value.append(n);
      else if (!text.children.length) text.append(n);
      else info.append(n);
    });
    item.append(pictogram, value, rule, text);
    const toggle = el('div', 'pictogram-key-figures-percentage');
    item.append(toggle);
    if (info.children.length) {
      // the source's percentage row is itself the (unlabelled) toggle: role=button, info glyph
      uid += 1;
      info.id = `pictogram-key-figures-info-${uid}`;
      toggle.setAttribute('role', 'button');
      toggle.tabIndex = 0;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', info.id);
      toggle.append(infoIcon());
      const flip = () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        item.classList.toggle('is-active', open);
      };
      toggle.addEventListener('click', flip);
      toggle.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        flip();
      });
      item.append(info);
    }
    items.append(item);
    values.push(value);
  });
  const container = el('div', 'container');
  const row = el('div', 'row');
  const col = el('div', 'pictogram-key-figures-col');
  col.append(items);
  if (legend) col.append(legend);
  row.append(col);
  container.append(row);
  block.replaceChildren(container);
  onView(container, () => values.forEach(countUp));
}
