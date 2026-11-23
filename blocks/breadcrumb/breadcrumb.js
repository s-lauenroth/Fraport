/**
 * breadcrumb — frach-m-breadcrumb-navigation: white bar under the header (outside <main>, as on
 * the source). >= 720 the trail (chevron-right separators, current page grey and inert); < 720 a
 * single "back" link to the parent.
 *
 * Generated from the page hierarchy: one crumb per ancestor path of the current URL (label = that
 * page's <title>, fetched), then the current page (label = this page's title).
 * Authoring: the block table only (its cell is a placeholder); an authored list of links, when
 * present, replaces the generated trail (the last item is the current page).
 * @ew-exempt crumb labels are page titles (metadata), not text authored in this block.
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRON_RIGHT = 'M8.29 5.29a1 1 0 0 1 1.42 0l6 6a1 1 0 0 1 0 1.42l-6 6a1 1 0 0 1-1.42-1.42'
  + 'L13.59 12 8.29 6.71a1 1 0 0 1 0-1.42z';
const CHEVRON_LEFT = 'M15.71 5.29a1 1 0 0 1 0 1.42L10.41 12l5.3 5.29a1 1 0 0 1-1.42 1.42l-6-6'
  + 'a1 1 0 0 1 0-1.42l6-6a1 1 0 0 1 1.42 0z';

function chevron(d) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('breadcrumb-icon');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  svg.append(path);
  return svg;
}

async function pageTitle(path) {
  try {
    const resp = await fetch(path);
    if (!resp.ok) return null;
    const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
    const t = doc.querySelector('title');
    return t && t.textContent ? t.textContent : null;
  } catch (e) {
    return null;
  }
}

async function generatedTrail() {
  const segs = window.location.pathname.replace(/\.html$/, '').split('/').filter(Boolean);
  const ancestors = segs.slice(0, -1).map((s, i) => `/${segs.slice(0, i + 1).join('/')}`);
  const titles = await Promise.all(ancestors.map(pageTitle));
  const trail = ancestors
    .map((href, i) => ({ href, label: titles[i] }))
    .filter((c) => c.label);
  trail.push({ href: null, label: document.title });
  return trail;
}

function authoredTrail(block) {
  const links = [...block.querySelectorAll('li')];
  if (!links.length) return null;
  return links.map((li, i) => {
    const a = li.querySelector('a');
    return { href: i < links.length - 1 && a ? a.getAttribute('href') : null, node: li };
  });
}

function labelOf(crumb) {
  const label = el('span', 'breadcrumb-label');
  if (crumb.node) {
    const a = crumb.node.querySelector('a');
    label.append(...(a || crumb.node).childNodes);
  } else label.textContent = crumb.label;
  return label;
}

export default async function decorate(block) {
  if (block.querySelector('.breadcrumb-nav')) return;
  const trail = authoredTrail(block) || await generatedTrail();

  const nav = el('nav', 'breadcrumb-nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const list = el('ul', 'breadcrumb-list');
  trail.forEach((crumb, i) => {
    const item = el('li', 'breadcrumb-item');
    const current = i === trail.length - 1;
    // a crumb without a target (e.g. a press release's year/quarter level) is a plain label
    const linked = !current && !!crumb.href;
    const link = el(linked ? 'a' : 'span', 'breadcrumb-link');
    if (current) link.setAttribute('aria-current', 'page');
    else if (linked) link.href = crumb.href;
    link.append(labelOf(crumb));
    if (!current) link.append(chevron(CHEVRON_RIGHT));
    item.append(link);
    list.append(item);
  });
  // the back link goes to the nearest ancestor crumb that has a target
  let parentIndex = trail.length - 2;
  while (parentIndex >= 0 && !trail[parentIndex].href) parentIndex -= 1;
  if (parentIndex >= 0) {
    const back = el('a', 'breadcrumb-back');
    back.href = trail[parentIndex].href;
    const label = el('span', 'breadcrumb-label');
    label.textContent = list.children[parentIndex].querySelector('.breadcrumb-label').textContent;
    back.append(chevron(CHEVRON_LEFT), label);
    nav.append(back);
  }
  nav.append(list);

  const container = el('div', 'container');
  const row = el('div', 'row');
  const col = el('div');
  col.append(nav);
  row.append(col);
  container.append(row);
  block.replaceChildren(container);

  // the source renders the trail between the header and <main>
  const wrapper = block.parentElement;
  const main = block.closest('main');
  if (main && wrapper && wrapper.classList.contains('breadcrumb-wrapper')) main.before(wrapper);
}
