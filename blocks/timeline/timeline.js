/**
 * timeline — vertical history timeline: a dotted line with a ring marker per entry, the year
 * beside the marker and a card (image, caption / text) on the other side of the line.
 *
 * Authoring: one row per entry — the year cell (e.g. `1926`) and the content cell (picture,
 * heading or caption paragraph, text, links). A one-cell row: a leading short paragraph or
 * heading (up to 12 characters, e.g. a year) is the marker label, the rest the card.
 *
 * @variants block class: shadow — not a timeline: the cells of each row become columns — a
 *   text column (no picture) beside raised contact cards (picture, name, role, phone / e-mail
 *   links), 3 columns from 960px
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();

function buildEntry(row) {
  const cells = [...row.children];
  const entry = el('li', 'timeline-entry');
  const marker = el('div', 'timeline-marker');
  const year = el('div', 'timeline-year');
  const card = el('div', 'timeline-card');
  let content;
  if (cells.length > 1) {
    year.append(...cells[0].childNodes);
    content = cells.slice(1).flatMap((c) => [...c.childNodes]);
  } else {
    const nodes = [...(cells[0]?.children || [])];
    const first = nodes[0];
    if (first && !isMedia(first) && first.textContent.trim().length <= 12) {
      year.append(first);
      content = nodes.slice(1);
    } else content = nodes;
  }
  const media = el('div', 'timeline-media');
  const body = el('div', 'timeline-body');
  content.forEach((n) => {
    if (n.nodeType === Node.ELEMENT_NODE && isMedia(n)) media.append(n);
    else if (n.nodeType === Node.ELEMENT_NODE || n.textContent.trim()) body.append(n);
  });
  if (media.children.length) card.append(media);
  if (body.childNodes.length) card.append(body);
  const dot = el('span', 'timeline-dot');
  dot.setAttribute('aria-hidden', 'true');
  marker.append(year, dot);
  entry.append(marker, card);
  return entry;
}

function buildColumns(block) {
  const wrap = el('div', 'timeline-columns');
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (!cell.children.length && !cell.textContent.trim()) return;
      const nodes = [...cell.children];
      const media = nodes.filter(isMedia);
      const col = el('div', media.length ? 'timeline-col timeline-contact' : 'timeline-col timeline-text');
      if (media.length) {
        const image = el('div', 'timeline-media');
        image.append(...media);
        const body = el('div', 'timeline-body');
        body.append(...nodes.filter((n) => !media.includes(n)));
        body.querySelectorAll('a[href^="tel:"]').forEach((a) => a.classList.add('timeline-tel'));
        body.querySelectorAll('a[href^="mailto:"]').forEach((a) => a.classList.add('timeline-mail'));
        col.append(image, body);
      } else {
        // rich text column (styles.css .rte); its CTA carries the source arrow icon
        col.classList.add('rte');
        col.append(...cell.childNodes);
        col.querySelectorAll('a.button').forEach((a) => a.classList.add('button-icon-right'));
      }
      wrap.append(col);
    });
  });
  return wrap;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .timeline-list, :scope > .timeline-columns')) return;
  if (block.classList.contains('shadow')) {
    block.replaceChildren(buildColumns(block));
    return;
  }
  const list = el('ol', 'timeline-list');
  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture, img')) return;
    list.append(buildEntry(row));
  });
  block.replaceChildren(list);
}
