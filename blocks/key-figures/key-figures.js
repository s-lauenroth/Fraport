/**
 * key-figures — frach-m-key-figures: centred numbers (aubergine, h2 ramp) with captions that
 * count up from 0 when they scroll into view. The `stock` variant shows the live share price
 * with an up/down trend indicator.
 *
 * Authoring: one row per figure — cell 1 the value as displayed (e.g. `80.000`, `66,00 €`),
 * cell 2 the caption.
 *
 * @variants block class: stock (default none) — live XETRA quote + trend indicator;
 *   text — a first one-cell row holding a heading is the text column (headline + copy) beside
 *   the numbers (source frach-m-key-figures--has-text)
 * @ew-exempt <p> stock value (cell 1 of the stock variant) — API-driven, the authored value is
 *   the no-JS fallback
 *
 * The count-up runs on a presentational overlay (aria-hidden); the authored value stays in
 * place (hidden while counting) so it remains the editable source.
 */

const QUOTE_URL = 'https://charts3.equitystory.com/api-json/fraport/English/';

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const ARROW = 'M14.29 7.29a1 1 0 0 1 1.42 0l4 4a1 1 0 0 1 0 1.42l-4 4a1 1 0 0 1-1.42-1.42L16.59 13H5'
  + 'a1 1 0 0 1 0-2h11.59l-2.3-2.29a1 1 0 0 1-.08-1.32z';

/** trend arrow (the source draws it as an inline svg) */
function arrowIcon(className) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', className);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ARROW);
  svg.append(path);
  return svg;
}

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

/** parse a displayed German number: "80.000" → 80000, "66,00 €" → 66 (decimals 2) */
function parseValue(str) {
  const m = str.match(/-?[\d.]+(,\d+)?/);
  if (!m) return null;
  const decimals = m[1] ? m[1].length - 1 : 0;
  const num = parseFloat(m[0].replace(/\./g, '').replace(',', '.'));
  if (Number.isNaN(num)) return null;
  return {
    num, decimals, prefix: str.slice(0, m.index), suffix: str.slice(m.index + m[0].length),
  };
}

function format(n, decimals) {
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function countUp(valueWrap, source) {
  const parsed = parseValue(source.textContent);
  if (!parsed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const overlay = el('span', 'key-figures-count');
  overlay.setAttribute('aria-hidden', 'true');
  valueWrap.classList.add('is-counting');
  valueWrap.append(overlay);
  const duration = 2000;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 3;
    overlay.textContent = `${parsed.prefix}${format(parsed.num * eased, parsed.decimals)}${parsed.suffix}`;
    if (t < 1) requestAnimationFrame(tick);
    else {
      overlay.remove();
      valueWrap.classList.remove('is-counting');
    }
  };
  requestAnimationFrame(tick);
}

async function liveQuote(valueP, indicator) {
  try {
    const resp = await fetch(QUOTE_URL);
    if (!resp.ok) return;
    const data = await resp.json();
    const last = parseFloat([].concat(data.lastprice)[0]);
    const change = parseFloat([].concat(data.absoluteprice)[0]);
    if (Number.isNaN(last)) return;
    valueP.textContent = `${format(last, 2)} €`;
    if (!Number.isNaN(change)) {
      indicator.classList.toggle('key-figures-indicator-down', change < 0);
      indicator.classList.toggle('key-figures-indicator-up', change > 0);
    }
  } catch (e) {
    // keep the authored fallback value
  }
}

export default function decorate(block) {
  const stock = block.classList.contains('stock');
  const numbers = el('div', 'key-figures-numbers');
  const inner = el('div', 'row');
  numbers.append(inner);

  const rows = [...block.children];
  let text = null;
  if (block.classList.contains('text') && rows[0] && rows[0].querySelector('h1, h2, h3, h4, h5, h6')) {
    text = el('div', 'key-figures-text');
    text.append(...rows.shift().firstElementChild.children);
    const h = text.querySelector('h1, h2, h3, h4, h5, h6');
    if (h) h.classList.add('h3');
  }

  const figures = rows.map((row) => {
    const cells = [...row.children];
    const valueCell = cells[0];
    const captionCell = cells.length > 1 ? cells[cells.length - 1] : null;
    if (!valueCell || !valueCell.textContent.trim()) return null;
    const fig = el('div', 'key-figures-number');
    const valueWrap = el('div', 'key-figures-value');
    const valueP = valueCell.querySelector('p') || valueCell;
    valueWrap.append(...(valueP === valueCell ? [...valueCell.childNodes] : [valueP]));
    fig.append(valueWrap);
    let indicator = null;
    if (stock) {
      indicator = arrowIcon('key-figures-indicator key-figures-indicator-down');
      fig.append(' ', indicator);
    }
    if (captionCell) {
      const caption = el('div', 'key-figures-caption');
      caption.append(...captionCell.children);
      if (!caption.children.length) caption.append(...captionCell.childNodes);
      fig.append(caption);
    }
    inner.append(fig);
    return { valueWrap, valueP, indicator };
  }).filter(Boolean);

  const container = el('div', 'container');
  container.dataset.animate = 'appear-right';
  const row = el('div', 'row');
  if (text) row.append(text);
  row.append(numbers);
  container.append(row);
  block.replaceChildren(container);

  onView(container, () => {
    container.classList.add('is-animating');
    figures.forEach(({ valueWrap, valueP, indicator }) => {
      if (stock && valueP.tagName === 'P') {
        liveQuote(valueP, indicator).then(() => countUp(valueWrap, valueP));
      } else countUp(valueWrap, valueWrap);
    });
  });
}
