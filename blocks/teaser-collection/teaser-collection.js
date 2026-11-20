/**
 * teaser-collection — frach-m-teaser-collection (card-view list): a shadowed white panel of
 * news rows (square thumbnail >= 960, date • time, headline, teaser), each row one link, the
 * CTA buttons right-aligned below.
 *
 * Authoring (rows, classified by content — never by index):
 *   - a row holding a headline link: one item — an optional picture, date / time paragraphs, the
 *     paragraph with the headline link (EW6: the href is read and the anchor unwrapped; its text
 *     stays in the paragraph), the teaser paragraph after it
 *   - a row of CTA paragraphs only (<strong> = primary, <em> = secondary link) → the buttons
 * Content is the authored snapshot of the source's CMS list (interim, see dynamics).
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isCta = (p) => p.matches('.button-wrapper') || !!p.querySelector(':scope > a.button')
  || !!p.querySelector(':scope > :is(strong, em) > a, :scope > :is(strong, em) > :is(strong, em) > a');
const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();

/** single-paragraph cells arrive unwrapped from the pipeline: wrap loose nodes in one <p> */
function blockChildren(cell) {
  if ([...cell.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
    || (cell.children.length && [...cell.children].every((c) => ['A', 'PICTURE', 'IMG'].includes(c.tagName)))) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    cell.append(p);
  }
  return [...cell.children];
}

function buildItem(nodes) {
  const linkP = nodes.find((n) => n.tagName === 'P' && n.querySelector('a') && !isCta(n));
  const anchor = linkP.querySelector('a');
  const link = el('a', 'teaser-collection-item');
  link.href = anchor.getAttribute('href');
  anchor.replaceWith(...anchor.childNodes); // EW6
  const image = el('div', 'teaser-collection-image');
  const text = el('div', 'teaser-collection-text');
  const date = el('div', 'teaser-collection-date');
  const headline = el('div', 'teaser-collection-headline');
  const description = el('div', 'teaser-collection-description');
  let after = false;
  nodes.forEach((n) => {
    if (isMedia(n)) image.append(n);
    else if (n === linkP) {
      headline.append(n);
      after = true;
    } else if (after) description.append(n);
    else date.append(n);
  });
  // date • time: a presentational bullet (CSS-drawn, no text) between the inline parts
  [...date.children].slice(1).forEach((part) => {
    const sep = el('span', 'teaser-collection-sep');
    sep.setAttribute('aria-hidden', 'true');
    part.before(' ', sep, ' ');
  });
  if (image.children.length) link.append(image);
  if (date.children.length) text.append(date);
  text.append(headline);
  if (description.children.length) text.append(description);
  link.append(text);
  return link;
}

export default function decorate(block) {
  if (block.querySelector('.teaser-collection-list')) return;
  const list = el('div', 'teaser-collection-list');
  const ctas = el('div', 'teaser-collection-ctas');
  [...block.children].forEach((row) => {
    const nodes = [...row.children].flatMap((cell) => blockChildren(cell));
    if (!nodes.length) return;
    if (nodes.some((n) => n.tagName === 'P' && n.querySelector('a') && !isCta(n))) {
      list.append(buildItem(nodes));
    } else ctas.append(...nodes);
  });
  const container = el('div', 'container');
  const row = el('div', 'row');
  const col = el('div', 'teaser-collection-col');
  col.append(list);
  if (ctas.children.length) col.append(ctas);
  row.append(col);
  container.append(row);
  block.replaceChildren(container);
}
