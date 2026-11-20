/**
 * embed — third-party iframe players (frach-m-embed): YouTube (nocookie) videos in grid
 * columns, the walls.io social wall full width. Rendered as the source renders them once
 * consent is given (the consent manager is carried disabled, see martech contract).
 *
 * Authoring: one row; one cell per column. A cell holding only a link → a player (href = the
 * iframe src, link text = the iframe title); any other cell → rich text with its button row.
 * The column count sets the grid (2 → halves, 3 → thirds).
 *
 * @variants block class: video (YouTube player, 400px tall in halves / 290px in thirds),
 *   wall (social wall, 800px, scrolling)
 * @ew-exempt <a> player link — kept in the DOM (hidden) as the editable source of the iframe
 *   src / title; the iframe is presentational
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isCta = (p) => p.matches('.button-wrapper') || !!p.querySelector(':scope > a.button');

function playerLink(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.querySelector('picture, img')) return null;
  const a = links[0];
  return cell.textContent.trim() === a.textContent.trim() ? a : null;
}

function player(cell, a, wall) {
  const frame = el('div', `embed-frame${wall ? ' embed-wall' : ' embed-video'}`);
  const iframe = document.createElement('iframe');
  iframe.src = a.href;
  iframe.title = a.textContent.trim();
  iframe.width = '100%';
  iframe.loading = 'lazy';
  iframe.setAttribute('frameborder', '0');
  if (wall) {
    iframe.height = '800';
    iframe.setAttribute('scrolling', 'yes');
  } else {
    iframe.setAttribute('aria-label', 'YouTube Video');
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
  }
  const source = el('div', 'embed-source');
  source.hidden = true;
  source.append(...cell.childNodes);
  frame.append(iframe, source);
  return frame;
}

function text(cell) {
  const box = el('div', 'embed-text');
  const rte = el('div', 'rte');
  const buttons = el('div', 'buttons');
  [...cell.children].forEach((n) => {
    if (n.tagName === 'P' && isCta(n)) buttons.append(n);
    else rte.append(n);
  });
  box.append(rte, buttons);
  return box;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .container, :scope > .embed-frame')) return;
  const wall = block.classList.contains('wall');
  const cells = [...block.querySelectorAll(':scope > div > div')];
  if (wall) {
    const a = cells.map(playerLink).find(Boolean);
    if (a) block.replaceChildren(player(a.closest('div'), a, true));
    return;
  }
  const row = el('div', 'row');
  cells.forEach((cell) => {
    const col = el('div', 'embed-col');
    const a = playerLink(cell);
    col.append(a ? player(cell, a, false) : text(cell));
    row.append(col);
  });
  block.classList.add(`embed-${cells.length}-cols`);
  const height = cells.length >= 3 ? '290' : '400';
  row.querySelectorAll('iframe').forEach((f) => { f.height = height; });
  const container = el('div', 'container');
  container.append(row);
  block.replaceChildren(container);
}
