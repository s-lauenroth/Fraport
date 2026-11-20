/**
 * contact-list — frach-m-contact-list / frach-m-contact: white shadowed contact cards (16:9
 * picture, grey name heading, body lines, phone and e-mail links with their icons) in a grid —
 * one per row < 720, two from 720, three from 1280.
 * Link icons by scheme: tel: phone, mailto: mail, any other link globe (the source's website link).
 *
 * Authoring: one row per contact — cell 1 the picture (optional), cell 2 the name heading, the
 * body paragraph (line breaks kept), then one link per paragraph (tel: / mailto:). Decoded by
 * role, never by index: nodes are moved, every other node stays in the card in authored order.
 *
 * @variants block class: aside — the block joins a directly preceding one-cell `columns` block
 *   as its next column (the source's 8 | 4 grid with a contact card beside the text)
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const ICONS = { tel: 'phone', mailto: 'mail' };

/** link icon as an inline svg (the source draws frach-icon-phone / -mail inline) */
function icon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'contact-list-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `/icons/${name}.svg#frach-icon-${name}`);
  svg.append(use);
  return svg;
}

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();

/** join the preceding one-cell columns block as its next column */
function adopt(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('columns-wrapper')) return;
  const columns = prev.querySelector('.columns');
  const row = columns && columns.querySelector(':scope > .container > .row');
  if (!row) return;
  const n = row.children.length;
  const col = el('div', 'columns-col');
  col.append(wrapper);
  row.append(col);
  columns.classList.replace(`columns-${n}-cols`, `columns-${n + 1}-cols`);
}

function card(row) {
  const item = el('div', 'contact-list-card');
  const info = el('address', 'contact-list-info');
  [...row.children].forEach((cell) => {
    [...cell.children].forEach((n) => {
      if (isMedia(n)) {
        const media = el('div', 'contact-list-media');
        media.append(...n.childNodes);
        item.prepend(media);
        return;
      }
      if (/^H[1-6]$/.test(n.tagName)) n.classList.add('contact-list-name', 'h6');
      const a = n.tagName === 'P' && n.children.length === 1 && n.querySelector(':scope > a');
      if (a && !n.textContent.replace(a.textContent, '').trim()) {
        const kind = ICONS[(a.getAttribute('href') || '').split(':')[0]] || 'globe';
        n.classList.add('contact-list-link');
        a.prepend(icon(kind));
        info.append(n);
        return;
      }
      if (n.tagName === 'P' && !n.classList.length) n.classList.add('contact-list-body');
      info.append(n);
    });
  });
  item.append(info);
  return item;
}

export default function decorate(block) {
  if (block.querySelector('.contact-list-card')) return;
  if (block.classList.contains('aside')) {
    block.replaceChildren(...[...block.children].map(card));
    adopt(block);
    return;
  }
  const rowEl = el('div', 'row');
  [...block.children].forEach((r) => {
    const col = el('div', 'contact-list-col');
    col.append(card(r));
    rowEl.append(col);
  });
  const container = el('div', 'container');
  container.append(rowEl);
  block.replaceChildren(container);
}
