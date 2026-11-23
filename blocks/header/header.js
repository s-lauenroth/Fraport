/*
 * Header: sticky two-row header with click megamenus (desktop >= 1280px) and a
 * slide-in drill-down drawer (mobile). All copy, links and images come from the nav
 * fragment (content/nav.plain.html locally, /nav.plain.html on DA/EDS). Sections:
 *   1. brand: one paragraph with the home link + logo image
 *   2. main navigation: optional home-link paragraph, then a nested list
 *      (level 1 > level 2 > level 3); a level-2 parent may carry description paragraphs
 *   3. teasers: one heading + list of cards (image, headline link, more link) per
 *      level-1 item, in the same order as the main navigation
 *   4. tools: one list of search link, dropdowns (label + list) and direct links
 * This file only builds controls (buttons, form) and behaviour around that content.
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
const t = (key) => (I18N[(document.documentElement.lang || 'de').slice(0, 2)] || I18N.de)[key];

let uid = 0;
const nextId = (prefix) => {
  uid += 1;
  return `${prefix}-${uid}`;
};

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  e.append(...children);
  return e;
}

const icon = (name) => el('span', { class: `icon icon-${name}`, 'aria-hidden': 'true' });

/** fetches the nav fragment: /content first (local preview), then the site root (DA/EDS) */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const frag = document.createElement('div');
  frag.innerHTML = await resp.text();
  // relative image paths are relative to the fragment, not to the current page
  frag.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!/^([a-z]+:|\/)/i.test(src)) img.src = new URL(src, resp.url).href;
  });
  return frag;
}

/* ------------------------------------------------------------------ state helpers */

function setExpanded(btn, open) {
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function closeMeta(nav, except) {
  nav.querySelectorAll('.nav-meta-toggle[aria-expanded="true"]').forEach((b) => {
    if (b !== except) setExpanded(b, false);
  });
}

function closeL2(panel) {
  panel.querySelectorAll('.nav-l2 > li > a[aria-expanded="true"]').forEach((a) => setExpanded(a, false));
  panel.classList.remove('has-l3');
}

function closeMegamenus(nav, except) {
  nav.querySelectorAll('.nav-l1 > li > a[aria-expanded="true"]').forEach((a) => {
    if (a === except) return;
    setExpanded(a, false);
    const panel = a.parentElement.querySelector('.nav-panel');
    if (panel) closeL2(panel);
  });
  if (!except) nav.classList.remove('is-megamenu-open');
}

function closeSearch(nav) {
  nav.classList.remove('is-searching');
  setExpanded(nav.querySelector('.nav-search-toggle'), false);
}

function closeAll(nav) {
  closeMegamenus(nav);
  closeMeta(nav);
  closeSearch(nav);
}

/* ------------------------------------------------------------------ builders */

/**
 * level-2 / level-3 lists: a back button (labelled with the list one level up, as on the
 * source), parents get a chevron, their child list and a description box
 */
function decorateSubList(ul, level, backLabel, ownerLabel) {
  ul.classList.add(`nav-l${level}`);
  const back = el('li', { class: 'nav-back' });
  const backBtn = el('button', { type: 'button', class: 'nav-back-btn' }, icon('chevron-left'), backLabel);
  back.append(backBtn);
  ul.prepend(back);
  [...ul.children].forEach((li, i) => {
    if (li === back) return;
    const link = li.querySelector(':scope > a');
    if (!link) return;
    if (i === 1) link.classList.add('nav-overview');
    const sub = li.querySelector(':scope > ul');
    if (!sub) return;
    li.classList.add('has-children');
    const id = nextId('nav-sub');
    link.setAttribute('role', 'button');
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('aria-controls', id);
    link.append(icon('chevron-right'));
    sub.id = id;
    decorateSubList(sub, level + 1, ownerLabel, link.textContent.trim());
    const paras = [...li.querySelectorAll(':scope > p')];
    if (paras.length) {
      const desc = el('div', { class: 'nav-desc' }, el('p', { class: 'nav-desc-title' }, link.textContent.trim()));
      paras.forEach((p) => desc.append(p));
      li.append(desc);
    }
  });
}

/** teaser cards: p(img) + p(headline link) + p(more link) per list item */
function decorateTeasers(ul) {
  ul.classList.add('nav-teasers');
  [...ul.children].forEach((li) => {
    li.classList.add('nav-teaser');
    const [media, headline, more] = li.querySelectorAll(':scope > p');
    media?.classList.add('nav-teaser-media');
    media?.querySelectorAll('img').forEach((img) => {
      img.loading = 'lazy';
      img.width = 960;
      img.height = 540;
    });
    headline?.classList.add('nav-teaser-headline');
    if (more) {
      more.classList.add('nav-teaser-more');
      more.querySelector('a')?.append(icon('arrow-right'));
    }
    // the image is a link target too (as on the source card)
    const href = headline?.querySelector('a')?.getAttribute('href');
    if (media && href && !media.querySelector('a')) {
      const a = el('a', { href, tabindex: '-1', 'aria-hidden': 'true' });
      a.append(...media.childNodes);
      media.append(a);
    }
  });
}

function buildMegamenu(nav, li, teaserGroup) {
  const trigger = li.querySelector(':scope > a');
  const l2 = li.querySelector(':scope > ul');
  if (!trigger || !l2) return;
  li.classList.add('nav-l1-parent');
  const panelId = nextId('nav-panel');
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', panelId);
  trigger.append(icon('chevron-right'));

  decorateSubList(l2, 2, t('menu'), trigger.textContent.trim());
  const panel = el('div', { class: 'nav-panel', id: panelId });
  const content = el('div', { class: 'nav-panel-content' });
  if (teaserGroup) {
    const { heading, list } = teaserGroup;
    heading.classList.add('nav-panel-title');
    content.append(heading);
    if (list) {
      decorateTeasers(list);
      content.append(list);
    }
  }
  const close = el('button', { type: 'button', class: 'nav-panel-close' }, icon('close'), t('close'));
  close.addEventListener('click', () => closeAll(nav));
  panel.append(el('span', { class: 'nav-panel-bg', 'aria-hidden': 'true' }), l2, content, close);
  li.append(panel);

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    const open = trigger.getAttribute('aria-expanded') !== 'true';
    closeMeta(nav);
    closeSearch(nav);
    closeMegamenus(nav, trigger);
    setExpanded(trigger, open);
    if (!open) closeL2(panel);
    nav.classList.toggle('is-megamenu-open', open);
  });

  // level-2/3 parents toggle their child list (desktop: next column; mobile: slide-in)
  panel.querySelectorAll('li.has-children > a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const open = a.getAttribute('aria-expanded') !== 'true';
      a.closest('ul').querySelectorAll(':scope > li > a[aria-expanded="true"]').forEach((x) => setExpanded(x, false));
      setExpanded(a, open);
      panel.classList.toggle('has-l3', !!panel.querySelector('.nav-l2 > li > a[aria-expanded="true"]'));
    });
  });

  // back buttons close the list they belong to (mobile drill-down)
  panel.querySelectorAll('.nav-back-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ul = btn.closest('ul');
      const owner = ul.parentElement.closest('li');
      const ownerLink = owner?.querySelector(':scope > a');
      setExpanded(ownerLink, false);
      if (ul.classList.contains('nav-l2')) {
        nav.classList.remove('is-megamenu-open');
        closeL2(panel);
      } else {
        panel.classList.toggle('has-l3', !!panel.querySelector('.nav-l2 > li > a[aria-expanded="true"]'));
      }
    });
  });
}

function buildMain(nav, section, teaserSection) {
  const wrap = el('div', { class: 'nav-sections' });
  const home = section.querySelector(':scope > p');
  if (home) {
    home.classList.add('nav-home');
    wrap.append(home);
  }
  const ul = section.querySelector(':scope > ul');
  if (!ul) return wrap;
  ul.classList.add('nav-l1');
  const groups = [];
  if (teaserSection) {
    [...teaserSection.querySelectorAll(':scope > h1, :scope > h2, :scope > h3')].forEach((h) => {
      const next = h.nextElementSibling;
      groups.push({ heading: h, list: next && next.tagName === 'UL' ? next : null });
    });
  }
  [...ul.children].forEach((li, i) => buildMegamenu(nav, li, groups[i]));
  wrap.append(ul);
  return wrap;
}

/** tools list: search link -> search toggle + form; label + list -> dropdown; link -> direct */
function buildTools(nav, section) {
  const meta = el('div', { class: 'nav-meta' });
  let search = null;
  const ul = section?.querySelector('ul');
  if (!ul) return { meta, search };
  [...ul.children].forEach((li) => {
    const sub = li.querySelector(':scope > ul');
    const link = li.querySelector(':scope > a');
    if (!sub && link && /search|suche/i.test(`${link.getAttribute('href')} ${link.textContent}`)) {
      search = { href: link.getAttribute('href'), label: link.textContent.trim() };
      return;
    }
    const item = el('div', { class: 'nav-meta-item' });
    if (sub) {
      const label = (li.querySelector(':scope > p') || li.firstChild)?.textContent.trim() || '';
      const isLanguage = [...sub.querySelectorAll('a')].every((a) => {
        try {
          return /^\/[a-z]{2}(\.html)?\/?$/.test(new URL(a.href, window.location.href).pathname);
        } catch (e) {
          return false;
        }
      });
      const id = nextId('nav-meta');
      const btn = el('button', {
        type: 'button', class: 'nav-meta-toggle', 'aria-expanded': 'false', 'aria-controls': id,
      });
      btn.append(el('span', { class: 'nav-meta-label' }, label));
      if (isLanguage) {
        item.classList.add('nav-meta-language');
        btn.prepend(icon('globe'));
        btn.append(icon('close'));
      } else {
        btn.append(icon('chevron-down'));
      }
      // as on the source, each dropdown list is its own navigation landmark
      const menu = el('nav', { class: 'nav-meta-list', id, 'aria-label': label });
      menu.append(sub);
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        closeMegamenus(nav);
        closeSearch(nav);
        closeMeta(nav, btn);
        setExpanded(btn, open);
      });
      if (!isLanguage) {
        // mobile: the dropdown is a drill-down panel with a back button
        const back = el('li', { class: 'nav-back' });
        const backBtn = el('button', { type: 'button', class: 'nav-back-btn' }, icon('chevron-left'), t('menu'));
        backBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          setExpanded(btn, false);
        });
        back.append(backBtn);
        sub.prepend(back);
      }
      item.append(btn, menu);
    } else if (link) {
      item.classList.add('nav-meta-direct');
      if (/karriere|career|jobs/i.test(`${link.textContent} ${link.href}`)) link.prepend(icon('career'));
      item.append(link);
    }
    meta.append(item);
  });
  return { meta, search };
}

function buildSearch(nav, search) {
  const toggle = el('button', {
    type: 'button', class: 'nav-search-toggle', 'aria-expanded': 'false', 'aria-label': search.label,
  }, icon('search'));
  const id = nextId('nav-search');
  const input = el('input', {
    type: 'search', name: 'q', id, autocomplete: 'off', 'aria-label': search.label,
  });
  const reset = el('button', { type: 'button', class: 'nav-search-reset', 'aria-label': t('reset') }, icon('close'));
  const submit = el('button', { type: 'submit', class: 'nav-search-submit', 'aria-label': search.label }, icon('search'));
  const form = el('form', {
    class: 'nav-search', action: search.href, method: 'get', role: 'search',
  }, input, reset, submit);
  toggle.setAttribute('aria-controls', id);
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-searching');
    closeMegamenus(nav);
    closeMeta(nav);
    nav.classList.toggle('is-searching', open);
    setExpanded(toggle, open);
    if (open) input.focus();
  });
  reset.addEventListener('click', () => {
    if (input.value) {
      input.value = '';
      input.focus();
    } else {
      closeSearch(nav);
      toggle.focus();
    }
  });
  return { toggle, form };
}

/* ------------------------------------------------------------------ sticky header */

function initSticky(block, nav) {
  let lastY = window.scrollY;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const threshold = block.offsetHeight || 153;
    const busy = nav.classList.contains('is-megamenu-open') || nav.classList.contains('is-searching')
      || nav.getAttribute('aria-expanded') === 'true'
      || !!nav.querySelector('.nav-meta-toggle[aria-expanded="true"]');
    if (y <= 0) {
      block.classList.remove('is-hidden', 'is-collapsed');
    } else if (!busy && y > lastY && y > threshold) {
      block.classList.add('is-hidden');
    } else if (y < lastY) {
      block.classList.remove('is-hidden');
      block.classList.toggle('is-collapsed', y > threshold);
    }
    lastY = y;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
}

/* ------------------------------------------------------------------ block */

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const frag = await fetchNav();
  block.textContent = '';
  if (!frag) return;
  const sections = [...frag.children].filter((c) => c.tagName === 'DIV');
  const [brandSection, mainSection, teaserSection, toolsSection] = sections;

  const nav = el('nav', { id: 'nav', 'aria-label': t('nav'), 'aria-expanded': 'false' });

  const brand = el('div', { class: 'nav-brand' });
  const brandLink = brandSection?.querySelector('a');
  if (brandLink) {
    brandLink.classList.add('nav-logo');
    const img = brandLink.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.width = 160;
      img.height = 69;
      // the home label is announced by a visually hidden text (source: "Startseite")
      const home = mainSection?.querySelector(':scope > p a');
      if (home) brandLink.append(el('span', { class: 'nav-visually-hidden' }, home.textContent.trim()));
    }
    brand.append(brandLink);
  }

  const { meta, search } = buildTools(nav, toolsSection);
  const sectionsEl = buildMain(nav, mainSection || el('div'), teaserSection);

  const tools = el('div', { class: 'nav-tools' });
  let searchForm = null;
  if (search) {
    const s = buildSearch(nav, search);
    tools.append(s.toggle);
    searchForm = s.form;
  }
  const hamburger = el('button', {
    type: 'button', class: 'nav-hamburger', 'aria-controls': 'nav', 'aria-label': t('menu'),
  }, icon('burger'), icon('close'));
  hamburger.addEventListener('click', () => {
    const open = nav.getAttribute('aria-expanded') !== 'true';
    closeAll(nav);
    nav.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? t('close') : t('menu'));
    document.body.classList.toggle('nav-scroll-lock', open && !DESKTOP.matches);
  });
  tools.append(hamburger);

  const drawer = el('div', { class: 'nav-drawer' }, sectionsEl, meta);
  nav.append(brand, drawer, tools);
  if (searchForm) nav.append(searchForm);

  const overlay = el('div', { class: 'nav-overlay', 'aria-hidden': 'true' });
  overlay.addEventListener('click', () => closeAll(nav));

  const wrapper = el('div', { class: 'nav-wrapper' }, nav, overlay);
  block.append(wrapper);

  // outside click closes dropdowns / megamenus
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      closeMeta(nav);
      if (DESKTOP.matches) closeMegamenus(nav);
    } else if (!e.target.closest('.nav-meta-item')) {
      closeMeta(nav);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeAll(nav);
    if (!DESKTOP.matches && nav.getAttribute('aria-expanded') === 'true') hamburger.click();
  });

  // the language dropdown sits in the meta row on desktop and in the bar (globe) on mobile
  const langItem = meta.querySelector('.nav-meta-language');
  const placeLanguage = () => {
    if (!langItem) return;
    if (DESKTOP.matches) meta.append(langItem);
    else tools.insertBefore(langItem, hamburger);
  };
  placeLanguage();

  // crossing the breakpoint resets every open state (no page reload needed)
  DESKTOP.addEventListener('change', () => {
    closeAll(nav);
    nav.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', t('menu'));
    document.body.classList.remove('nav-scroll-lock');
    placeLanguage();
  });

  initSticky(block, nav);
}
