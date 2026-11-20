import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Fraport header (frach-m-sticky-page-header-container), template-slotted.
 * /nav document contract (default content, three sections):
 *   1. brand: one paragraph with the home link (logo slot)
 *   2. main navigation: optional home paragraph, then one nested list
 *      (level 1 > level 2 > level 3; a level-2 item may carry a description paragraph)
 *   3. tools: one list, in order: search link, International (label + list),
 *      career link, language (label + list)
 * Authored nodes are MOVED into the template's empty slots, never copied.
 */

const DESKTOP = window.matchMedia('(width >= 1280px)');

const I18N = {
  de: {
    menu: 'Menü', close: 'Schließen', search: 'Suche', reset: 'Eingabe löschen', nav: 'Hauptnavigation',
  },
  en: {
    menu: 'Menu', close: 'Close', search: 'Search', reset: 'Clear input', nav: 'Main navigation',
  },
};
const t = (key) => (I18N[document.documentElement.lang] || I18N.de)[key];

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  e.append(...children);
  return e;
}

const icon = (name) => el('span', { class: `icon icon-${name}`, 'aria-hidden': 'true' });
const linkOf = (li) => li.querySelector(':scope > a, :scope > p > a');
const listOf = (li) => li.querySelector(':scope > ul');
const labelOf = (li) => li.querySelector(':scope > p') || li.firstChild;

let uid = 0;
const nextId = (prefix) => {
  uid += 1;
  return `${prefix}-${uid}`;
};

function lockScroll(on) {
  document.body.classList.toggle('header-scroll-lock', on);
}

/** closes every open control inside the header except `except` */
function closeAll(host, except) {
  host.querySelectorAll('[aria-expanded="true"]').forEach((b) => {
    if (b === except) return;
    const li = b.closest('li');
    if (except && li && li.contains(except)) return;
    b.setAttribute('aria-expanded', 'false');
  });
  host.querySelectorAll('[data-active]').forEach((li) => {
    if (!except || !li.contains(except)) li.removeAttribute('data-active');
  });
  host.classList.remove('is-searching');
  const lock = host.querySelector('.header-menu-btn[aria-expanded="true"], .header-menu > ul > li > a[aria-expanded="true"]');
  lockScroll(!!lock);
}

/** level-2 items: move descriptions into a panel, wire level-3 toggles */
function decorateLevel2(li) {
  const link = linkOf(li);
  if (!link) return;
  const descs = [...li.querySelectorAll(':scope > p')].filter((p) => !p.contains(link));
  if (descs.length) {
    const panel = el('div', { class: 'header-panel' });
    panel.dataset.title = link.textContent.trim();
    panel.append(...descs);
    li.append(panel);
  }
  const sub = listOf(li);
  if (sub) {
    sub.id = nextId('header-sub');
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('aria-controls', sub.id);
    link.setAttribute('role', 'button');
    link.append(icon('chevron-right'));
  }
}

/** level-1 items: flyout template around the authored level-2 list */
function decorateLevel1(li, host) {
  const link = linkOf(li);
  const sub = listOf(li);
  if (!link || !sub) return;
  const flyout = el('div', { class: 'header-flyout', id: nextId('header-flyout') });
  const inner = el('div', { class: 'header-flyout-inner' });
  const close = el('button', { type: 'button', class: 'header-flyout-close' }, icon('close'), t('close'));
  close.addEventListener('click', () => {
    closeAll(host);
    link.focus();
  });
  inner.append(sub, close);
  flyout.append(inner);
  li.append(flyout);
  link.setAttribute('aria-expanded', 'false');
  link.setAttribute('aria-controls', flyout.id);
  link.setAttribute('role', 'button');
  link.append(icon('chevron-right'));
  [...sub.children].forEach((child) => decorateLevel2(child));
}

/** a tools-list item with a label + list becomes a meta dropdown */
function metaDropdown(li, modifier, iconName) {
  if (!li) return null;
  const list = listOf(li);
  const label = labelOf(li);
  if (!list) return null;
  const wrap = el('div', { class: `header-meta-wrap header-meta-wrap-${modifier}` });
  const btn = el('button', {
    type: 'button',
    class: `header-meta-btn header-meta-btn-${modifier}`,
    'aria-expanded': 'false',
  });
  const text = el('span', { class: 'header-meta-label' });
  if (label) text.append(label);
  if (modifier === 'language') btn.append(icon(iconName), icon('close'), text);
  else btn.append(text, icon(iconName));
  list.id = nextId('header-dd');
  btn.setAttribute('aria-controls', list.id);
  const dd = el('div', { class: 'header-dropdown' });
  dd.append(list);
  wrap.append(btn, dd);
  return wrap;
}

/** header scroll morph: same states/thresholds as the source (100 ms throttle) */
function initScroll(host) {
  let last = window.scrollY;
  let busy = false;
  const add = (c) => host.classList.add(c);
  const rm = (c) => host.classList.remove(c);
  const onScroll = () => {
    if (document.body.classList.contains('header-scroll-lock')) return;
    const y = window.scrollY;
    if (last < y) {
      rm('is-visible');
      if (y > host.offsetHeight) {
        add('is-sticky');
        setTimeout(() => add('is-animating'), 50);
      } else rm('is-sticky');
    } else {
      add('is-collapsed');
      add('is-visible');
      add('is-sticky');
      if (y <= host.offsetHeight) rm('is-animating');
      if (last < 10) rm('is-collapsed');
    }
    last = y;
  };
  window.addEventListener('scroll', () => {
    if (busy) return;
    busy = true;
    setTimeout(() => {
      busy = false;
      onScroll();
    }, 100);
  }, { passive: true });
}

function buildSearch(searchLink, host) {
  const action = searchLink ? searchLink.href : '/search';
  const label = searchLink ? searchLink.textContent.trim() : t('search');
  const form = el('form', {
    class: 'header-search-form', action, method: 'get', role: 'search', id: nextId('header-search'),
  });
  const input = el('input', {
    type: 'search', name: 'q', autocomplete: 'off', 'aria-label': label,
  });
  const reset = el('button', { type: 'button', class: 'header-search-reset', 'aria-label': t('reset') }, icon('close'));
  const submit = el('button', { type: 'submit', class: 'header-search-submit', 'aria-label': label }, icon('search'));
  reset.addEventListener('click', () => {
    if (input.value) {
      input.value = '';
      input.focus();
    } else closeAll(host);
  });
  form.append(input, reset, submit);
  return form;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  const host = block.closest('header') || block;
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [brandSec, navSec, toolsSec] = sections;

  // template: empty slots
  const logo = el('div', { class: 'header-logo' });
  const meta = el('div', { class: 'header-meta' });
  const menuBtn = el('button', {
    type: 'button', class: 'header-menu-btn', 'aria-expanded': 'false', 'aria-label': t('menu'),
  }, icon('burger'), icon('close'));
  const menu = el('nav', { class: 'header-menu', 'aria-label': t('nav'), id: nextId('header-menu') });
  menuBtn.setAttribute('aria-controls', menu.id);
  const home = el('div', { class: 'header-home' });
  const drawerMeta = el('div', { class: 'header-drawer-meta' });
  const searchSlot = el('div', { class: 'header-search-slot' });
  const nav = el('div', { class: 'header-nav' }, menuBtn, menu, searchSlot);
  const inner = el('div', { class: 'header-inner' }, logo, meta, nav);
  const bar = el('div', { class: 'header-bar' }, el('div', { class: 'container' }, inner));

  // 1. brand
  const brandLink = brandSec?.querySelector('a');
  if (brandLink) logo.append(brandLink.closest('p') || brandLink);

  // 2. main navigation
  const mainList = navSec?.querySelector('ul');
  const homeP = navSec?.querySelector('.default-content-wrapper > p');
  if (homeP) home.append(homeP);
  menu.append(home);
  if (mainList) {
    menu.append(mainList);
    [...mainList.children].forEach((li) => decorateLevel1(li, host));
  }
  menu.append(drawerMeta);

  // 3. tools: search, international, career, language
  const toolItems = [...(toolsSec?.querySelector('ul')?.children || [])];
  const searchLi = toolItems.find((li) => !listOf(li) && toolItems.indexOf(li) === 0);
  const searchLink = searchLi ? linkOf(searchLi) : null;
  const dropdownItems = toolItems.filter((li) => listOf(li));
  const careerLi = toolItems.find((li) => li !== searchLi && !listOf(li));
  const international = metaDropdown(dropdownItems[0], 'international', 'chevron-down');
  const language = metaDropdown(dropdownItems[1], 'language', 'globe');
  const career = el('div', { class: 'header-career' });
  const careerLink = careerLi ? linkOf(careerLi) : null;
  if (careerLink) {
    careerLink.prepend(icon('career'));
    career.append(careerLink.closest('p') || careerLink);
  }

  const searchMetaBtn = el('button', {
    type: 'button', class: 'header-meta-btn header-search-btn header-search-btn-meta', 'aria-expanded': 'false',
  }, icon('search'));
  if (searchLink) {
    searchLink.classList.add('header-search-btn');
    searchLink.setAttribute('aria-expanded', 'false');
    searchLink.setAttribute('role', 'button');
    searchLink.prepend(icon('search'));
    searchSlot.append(searchLink.closest('p') || searchLink);
    searchMetaBtn.setAttribute('aria-label', searchLink.textContent.trim());
  } else searchMetaBtn.setAttribute('aria-label', t('search'));
  const form = buildSearch(searchLink, host);
  searchMetaBtn.setAttribute('aria-controls', form.id);
  if (searchLink) searchLink.setAttribute('aria-controls', form.id);
  inner.append(form);

  meta.append(el('div', { class: 'header-notifications', 'aria-hidden': 'true' }), searchMetaBtn);
  if (language) language.dataset.slot = 'language';

  // International + career live in the meta bar on desktop, in the drawer below 1280
  const placeMeta = () => {
    const target = DESKTOP.matches ? meta : drawerMeta;
    [international, career].forEach((node) => {
      if (node) target.append(node);
    });
    if (language) meta.append(language);
    closeAll(host);
  };
  placeMeta();
  DESKTOP.addEventListener('change', placeMeta);

  block.textContent = '';
  block.append(bar);

  // interactions
  const toggle = (btn) => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    const isMenuBtn = btn === menuBtn;
    const inDrawer = !DESKTOP.matches && menu.contains(btn);
    if (!isMenuBtn && !inDrawer) closeAll(host, btn);
    if (inDrawer && !isMenuBtn) {
      // accordion inside the mobile drawer: close siblings only
      btn.closest('ul').querySelectorAll(':scope > li > a[aria-expanded="true"], :scope > li > p > a[aria-expanded="true"]')
        .forEach((b) => { if (b !== btn) b.setAttribute('aria-expanded', 'false'); });
    }
    if (isMenuBtn && !open) closeAll(host);
    btn.setAttribute('aria-expanded', String(open));
    return open;
  };

  block.addEventListener('click', (e) => {
    const btn = e.target.closest('.header-menu-btn, .header-meta-wrap > button, .header-search-btn, .header-menu a[aria-expanded]');
    if (!btn || !block.contains(btn)) return;
    e.preventDefault();
    const open = toggle(btn);
    if (btn.classList.contains('header-search-btn')) {
      host.classList.toggle('is-searching', open);
      if (open) form.querySelector('input').focus();
      return;
    }
    const li = btn.closest('li');
    if (li && menu.contains(li)) {
      if (open) li.dataset.active = '';
      else li.removeAttribute('data-active');
    }
    const level1Open = menu.querySelector(':scope > ul > li > a[aria-expanded="true"], :scope > ul > li > p > a[aria-expanded="true"]');
    const drawerOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    const langOpen = !DESKTOP.matches && language?.querySelector('button[aria-expanded="true"]');
    lockScroll(!!(drawerOpen || (DESKTOP.matches && level1Open) || langOpen));
  });

  // desktop: hovering a level-2 leaf previews its description panel
  menu.addEventListener('mouseover', (e) => {
    if (!DESKTOP.matches) return;
    const li = e.target.closest('.header-flyout-inner > ul > li');
    if (!li) return;
    li.parentElement.querySelectorAll(':scope > li[data-preview]').forEach((x) => x.removeAttribute('data-preview'));
    li.dataset.preview = '';
  });

  document.addEventListener('click', (e) => {
    if (!host.contains(e.target)) closeAll(host);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = host.querySelector('[aria-expanded="true"]');
    const searching = host.classList.contains('is-searching');
    if (!open && !searching) return;
    closeAll(host);
    if (open) open.focus();
  });

  if (host !== block) initScroll(host);
  host.classList.add('is-ready');
}
