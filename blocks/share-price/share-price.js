/**
 * share-price — live Fraport share price beside a text column: the big price with an up / down
 * trend arrow and an exchange caption (e.g. "XETRA (Fraport AG)").
 *
 * Authoring: one row, two cells — the text cell (heading, copy) and the price cell (the price
 * as displayed, e.g. `65,20 €`, as the no-JS / failed-fetch fallback, then the caption
 * paragraph). A one-cell block holds only the price cell. An optional config row
 * `source | <url>` overrides the quote endpoint (JSON with `lastprice` and `absoluteprice`).
 *
 * @ew-exempt the price paragraph — API-driven; the authored value is the fallback
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

function trendIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'share-price-trend');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ARROW);
  path.setAttribute('fill', 'currentcolor');
  svg.append(path);
  return svg;
}

const format = (n) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

async function loadQuote(url, valueEl, trend, block) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return;
    const data = await resp.json();
    const last = parseFloat([].concat(data.lastprice)[0]);
    const change = parseFloat([].concat(data.absoluteprice)[0]);
    if (Number.isNaN(last)) return;
    valueEl.textContent = `${format(last)} €`;
    if (!Number.isNaN(change)) {
      block.classList.toggle('is-down', change < 0);
      block.classList.toggle('is-up', change > 0);
      trend.hidden = change === 0;
    }
  } catch (e) {
    // keep the authored fallback value
  }
}

export default function decorate(block) {
  if (block.querySelector(':scope > .share-price-row')) return;
  let source = QUOTE_URL;
  const rows = [...block.children].filter((row) => {
    const key = (row.firstElementChild?.textContent || '').trim().toLowerCase();
    if (key === 'source' && row.children[1]) {
      source = row.children[1].querySelector('a')?.href || row.children[1].textContent.trim();
      return false;
    }
    return true;
  });
  const cells = rows.flatMap((r) => [...r.children]);
  const priceCell = cells[cells.length - 1];
  const textCell = cells.length > 1 ? cells[0] : null;

  const row = el('div', 'share-price-row');
  if (textCell) {
    const text = el('div', 'share-price-text');
    text.append(...textCell.children);
    row.append(text);
  }
  const quote = el('div', 'share-price-quote');
  const figure = el('div', 'share-price-figure');
  const value = el('p', 'share-price-value');
  const nodes = priceCell ? [...priceCell.children] : [];
  const valueNode = nodes.find((n) => /\d/.test(n.textContent));
  if (valueNode) value.append(...valueNode.childNodes);
  else if (priceCell && !nodes.length) value.textContent = priceCell.textContent.trim();
  const trend = trendIcon();
  trend.hidden = true;
  figure.append(value, trend);
  quote.append(figure);
  const caption = el('div', 'share-price-caption');
  nodes.filter((n) => n !== valueNode).forEach((n) => caption.append(n));
  if (caption.children.length) quote.append(caption);
  row.append(quote);
  block.replaceChildren(row);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        io.disconnect();
        loadQuote(source, value, trend, block);
      }
    });
    io.observe(block);
  } else loadQuote(source, value, trend, block);
}
