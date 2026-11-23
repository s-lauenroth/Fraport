/**
 * article-footer — the closing bar of an article / press release: a "back to overview" link on
 * the left and the article's topic tag pills on the right, ruled below.
 *
 * Authoring: one row. The back link is the first cell holding exactly one link (or the first
 * link paragraph when everything sits in one cell); every other link (a list or link
 * paragraphs) is a tag. Cells may be omitted: no back link → tags only, no tags → link only.
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const ARROW_LEFT = 'M9.71 7.29a1 1 0 0 1 0 1.42L7.41 11H19a1 1 0 0 1 0 2H7.41l2.3 2.29a1 1 0 0 1-1.42 1.42l-4-4'
  + 'a1 1 0 0 1 0-1.42l4-4a1 1 0 0 1 1.42 0z';

function arrowIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'article-footer-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ARROW_LEFT);
  path.setAttribute('fill', 'currentcolor');
  svg.append(path);
  return svg;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .article-footer-bar')) return;
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const links = cells.flatMap((c) => [...c.querySelectorAll('a[href]')]);
  let back = null;
  const single = cells.find((c) => c.querySelectorAll('a[href]').length === 1
    && !c.querySelector('li'));
  if (single) [back] = single.querySelectorAll('a[href]');
  else if (cells.length === 1) {
    const p = cells[0].querySelector(':scope > p');
    back = p && p.querySelector('a[href]') && !p.closest('li') ? p.querySelector('a[href]') : null;
  }

  const bar = el('div', 'article-footer-bar');
  if (back) {
    const backWrap = el('div', 'article-footer-back');
    back.className = 'article-footer-back-link';
    if (!back.querySelector('svg')) back.prepend(arrowIcon());
    backWrap.append(back);
    bar.append(backWrap);
  }
  const tags = links.filter((a) => a !== back);
  if (tags.length) {
    const list = el('ul', 'article-footer-tags');
    tags.forEach((a) => {
      const li = el('li', 'article-footer-tag-item');
      a.className = 'article-footer-tag';
      li.append(a);
      list.append(li);
    });
    bar.append(list);
  }
  block.replaceChildren(bar);
}
