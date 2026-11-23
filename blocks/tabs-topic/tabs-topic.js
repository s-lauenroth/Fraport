/**
 * tabs-topic — topic tab bar switching content panels: a ruled, horizontally scrolling row of
 * tab labels (the active one underlined); one panel shows at a time — the first, or the one
 * named by the URL hash.
 *
 * Authoring: one row per tab — the label cell and the panel cell. The panel cell holds rich
 * content, or just a link to a fragment / page whose content (blocks included) is the panel:
 *   - a `/fragments/…` link is auto-blocked by the page (scripts.js buildAutoBlocks) in place;
 *   - any other same-site page link is loaded with `loadFragment` when its tab first opens.
 * A one-cell row is a tab without a panel (its label link, if any, navigates).
 * Keyboard: Left / Right / Home / End move between tabs (WAI-ARIA tabs pattern).
 *
 * @variants block class: alt — the same ruled tab bar (the source look differs only in content)
 */

import { loadFragment } from '../fragment/fragment.js';

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '') || 'tab';

let blockCount = 0;

/** a panel cell holding only one same-site link → the path to load lazily */
function lazyPath(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname.includes('/fragments/')) return null;
  return url.pathname.replace(/\.(plain\.)?html$/, '');
}

export default function decorate(block) {
  if (block.querySelector(':scope > .tabs-topic-list')) return;
  blockCount += 1;
  const prefix = `tabs-topic-${blockCount}`;
  const list = el('div', 'tabs-topic-list');
  list.setAttribute('role', 'tablist');
  const panels = el('div', 'tabs-topic-panels');
  const tabs = [];

  [...block.children].forEach((row, i) => {
    const [labelCell, panelCell] = row.children;
    if (!labelCell) return;
    const label = labelCell.textContent.trim();
    const id = slug(label);
    if (!panelCell) {
      const link = labelCell.querySelector('a[href]');
      const item = el(link ? 'a' : 'span', 'tabs-topic-tab');
      if (link) item.href = link.getAttribute('href');
      item.textContent = label;
      list.append(item);
      return;
    }
    const tab = el('button', 'tabs-topic-tab');
    tab.type = 'button';
    tab.id = `${prefix}-tab-${i}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `${prefix}-panel-${i}`);
    tab.dataset.hash = id;
    tab.textContent = label;
    const panel = el('div', 'tabs-topic-panel');
    panel.id = `${prefix}-panel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    const path = lazyPath(panelCell);
    if (path) panel.dataset.fragment = path;
    else {
      // a single-paragraph cell arrives unwrapped: keep a <p> so an auto-blocked fragment link
      // replaces that paragraph, not the panel
      const loose = [...panelCell.childNodes]
        .some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (loose || [...panelCell.children].every((c) => c.tagName === 'A')) {
        const p = el('p');
        p.append(...panelCell.childNodes);
        panelCell.append(p);
      }
      panel.append(...panelCell.childNodes);
    }
    list.append(tab);
    panels.append(panel);
    tabs.push({ tab, panel });
  });

  const select = async (n, focus = false) => {
    tabs.forEach(({ tab, panel }, i) => {
      const on = i === n;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
    });
    const { tab, panel } = tabs[n];
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (panel.dataset.fragment) {
      const path = panel.dataset.fragment;
      delete panel.dataset.fragment;
      const fragment = await loadFragment(path);
      if (fragment) panel.append(...fragment.childNodes);
    }
  };

  tabs.forEach(({ tab }, i) => {
    tab.addEventListener('click', () => {
      select(i);
      window.history.replaceState(null, '', `#${tab.dataset.hash}`);
    });
    tab.addEventListener('keydown', (e) => {
      const last = tabs.length - 1;
      const map = {
        ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last,
      };
      if (e.key in map) {
        e.preventDefault();
        select(map[e.key], true);
      }
    });
  });

  block.replaceChildren(list, panels);
  if (!tabs.length) return;
  const hash = decodeURIComponent(window.location.hash.slice(1));
  const fromHash = tabs.findIndex(({ tab }) => tab.dataset.hash === hash);
  select(fromHash >= 0 ? fromHash : 0);
}
