/**
 * newsroom-feed — frach-m-teaser-collection link box ("Weitere Meldungen"): a shadowed panel with
 * a title, dated headline rows (the whole row one link) and stacked CTA buttons. Directly after a
 * `cards` block in the same section it becomes that grid's aside column (as on the source).
 *
 * Authoring (rows, classified by content — never by index):
 *   - a heading → panel title
 *   - date / time paragraphs + a paragraph holding the headline link → one feed item
 *     (EW6: the href is read and the inner anchor unwrapped; its text stays in the paragraph)
 *   - CTA paragraphs (<strong> = primary, <em> = secondary link) → the button stack
 * Feed content is the authored snapshot of the source's CMS list (interim, see dynamics).
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

/** CTA paragraph: buttonized, or a lone link carrying the authored <strong> / <em> formatting */
const isCta = (p) => p.matches('.button-wrapper') || !!p.querySelector(':scope > a.button')
  || !!p.querySelector(':scope > :is(strong, em) > a, :scope > :is(strong, em) > :is(strong, em) > a');

/** single-paragraph cells arrive unwrapped from the pipeline: wrap loose nodes in one <p> */
function blockChildren(cell) {
  if ([...cell.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    || (cell.children.length && [...cell.children].every((c) => c.tagName === 'A'))) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    cell.append(p);
  }
  return [...cell.children];
}

function buildItem(nodes) {
  const linkP = nodes.find((n) => n.tagName === 'P' && n.querySelector('a') && !isCta(n));
  const anchor = linkP.querySelector('a');
  const link = el('a', 'newsroom-feed-link');
  link.href = anchor.getAttribute('href');
  anchor.replaceWith(...anchor.childNodes); // EW6
  const date = el('div', 'newsroom-feed-date');
  const headline = el('div', 'newsroom-feed-headline');
  nodes.forEach((n) => {
    if (n === linkP) headline.append(n);
    else date.append(n);
  });
  // date • time: a presentational bullet (CSS-drawn, no text) between the inline parts
  [...date.children].slice(1).forEach((part) => {
    const sep = el('span', 'newsroom-feed-sep');
    sep.setAttribute('aria-hidden', 'true');
    part.before(' ', sep, ' ');
  });
  if (date.children.length) link.append(date);
  link.append(headline);
  const li = el('li', 'newsroom-feed-item');
  li.append(link);
  return li;
}

/** adopt the panel into a directly preceding cards block as its aside column */
function adopt(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  const cards = prev && prev.classList.contains('cards-wrapper') ? prev.querySelector('.cards') : null;
  const row = cards && cards.querySelector('.row');
  if (!row) return;
  const aside = el('div', 'cards-col cards-col-aside');
  aside.append(wrapper);
  row.append(aside);
  cards.classList.add('with-link-box');
}

export default function decorate(block) {
  if (block.querySelector(':scope > .newsroom-feed-list')) return;
  const title = el('div', 'newsroom-feed-title h6');
  const list = el('ul', 'newsroom-feed-list');
  const ctas = el('div', 'newsroom-feed-ctas');
  const rest = el('div', 'newsroom-feed-body');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    const nodes = blockChildren(cell);
    if (!nodes.length) return;
    const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
    if (heading && !title.children.length) {
      title.append(heading);
      rest.append(...nodes.filter((n) => n !== heading));
    } else if (nodes.every((n) => n.tagName === 'P' && isCta(n))) {
      ctas.append(...nodes);
    } else if (nodes.some((n) => n.tagName === 'P' && n.querySelector('a') && !isCta(n))) {
      list.append(buildItem(nodes));
    } else {
      rest.append(...nodes);
    }
  });
  block.replaceChildren(...[title, rest, list, ctas].filter((b) => b.children.length));
  adopt(block);
}
