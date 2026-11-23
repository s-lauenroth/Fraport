/*
 * Footer: reads the flat footer fragment (content/footer.plain.html locally,
 * /footer.plain.html on DA/EDS) and builds the layout around the authored nodes.
 *
 * Fragment contract (one top-level section per column, no classes):
 *   - section with a heading and no list    -> starts a collapsible panel; the heading is
 *     the toggle label, the rest is the first column. Following sections without a
 *     heading are further columns of that panel.
 *   - section with a heading and a list     -> link column (accordion on small screens)
 *   - section whose links wrap images       -> social column (h2 title, h3 + icon row per group)
 *   - any other section without a heading   -> bottom (copyright) row
 * Authored nodes are moved, never copied; no copy lives in this file.
 */

const DESKTOP = window.matchMedia('(width >= 960px)');
let uid = 0;

function el(tag, cls, ...children) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  e.append(...children);
  return e;
}

/** fetches the footer fragment: /content first (local preview), then the site root (DA/EDS) */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const frag = document.createElement('div');
  frag.innerHTML = await resp.text();
  // relative media paths are relative to the fragment, not the page
  frag.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
  });
  return frag;
}

const heading = (sec) => sec.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');

function classify(sec) {
  if (sec.querySelector('a img, a picture')) return 'social';
  const h = heading(sec);
  if (h && sec.querySelector(':scope > ul, :scope > ol')) return 'links';
  if (h) return 'panel';
  return 'plain';
}

/**
 * builds a toggle (button inside the authored heading) and a collapsible region
 * @returns {{ head: Element, region: Element, inner: Element, button: Element }}
 */
function collapsible(h, cls) {
  uid += 1;
  const id = `footer-region-${uid}`;
  const button = el('button', `${cls}-toggle`);
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', id);
  button.append(el('span', `${cls}-label`, ...h.childNodes), el('span', 'footer-chevron'));
  h.className = `${cls}-heading`;
  h.append(button);
  const inner = el('div', `${cls}-inner`);
  const region = el('div', `${cls}-content`, inner);
  region.id = id;
  return {
    head: h, region, inner, button,
  };
}

function setOpen(button, open) {
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  button.closest('[data-collapsible]').classList.toggle('is-open', open);
}

function buildPanel(group) {
  const [first, ...rest] = group;
  const { head, region, inner } = collapsible(heading(first), 'footer-panel');
  const cols = el('div', 'footer-panel-cols');
  [first, ...rest].forEach((sec) => cols.append(el('div', 'footer-panel-col', ...sec.childNodes)));
  inner.append(cols);
  const panel = el('div', 'footer-panel', head, region);
  panel.dataset.collapsible = 'panel';
  return panel;
}

function buildLinks(sec) {
  const { head, region, inner } = collapsible(heading(sec), 'footer-links');
  inner.append(...sec.childNodes);
  const col = el('div', 'footer-col footer-links', head, region);
  col.dataset.collapsible = 'links';
  return col;
}

function buildSocial(sec) {
  const col = el('div', 'footer-col footer-social');
  let group = null;
  [...sec.children].forEach((node) => {
    if (!col.querySelector('.footer-social-title') && /^H[12]$/.test(node.tagName)) {
      node.className = 'footer-social-title';
      col.append(node);
    } else if (/^H[3-6]$/.test(node.tagName)) {
      group = el('div', 'footer-social-group', node);
      col.append(group);
    } else {
      if (!group) {
        group = el('div', 'footer-social-group');
        col.append(group);
      }
      group.append(node);
    }
  });
  col.querySelectorAll('a').forEach((a) => {
    const img = a.querySelector('img');
    a.className = 'footer-social-link';
    if (img) {
      if (!a.getAttribute('aria-label') && img.alt) a.setAttribute('aria-label', img.alt);
      img.width = 28;
      img.height = 28;
      img.loading = 'lazy';
    }
  });
  // drop the whitespace text nodes authors leave between icon links
  col.querySelectorAll('.footer-social-group p').forEach((p) => {
    [...p.childNodes].forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
    });
  });
  return col;
}

/** marks each link with the icon the source shows for its type */
function decorateLinkTypes(scope) {
  scope.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    let type = 'arrow';
    if (href.startsWith('tel:')) type = 'phone';
    else if (href.startsWith('mailto:')) type = 'mail';
    else if (/\.(pdf|zip|docx?|xlsx?|pptx?)(\/|$|\?)/i.test(href)) type = 'download';
    a.classList.add('footer-icon-link', `footer-icon-${type}`);
  });
}

function decorateTargets(scope) {
  scope.querySelectorAll('a[href]').forEach((a) => {
    let url;
    try {
      url = new URL(a.href, window.location.href);
    } catch {
      return;
    }
    const external = /^https?:$/.test(url.protocol) && url.host !== window.location.host
      && !/\.(pdf|zip)(\/|$)/i.test(url.pathname);
    if (external || a.classList.contains('footer-social-link')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const frag = await fetchFooter();
  if (!frag) return;
  const sections = [...frag.children].filter((s) => s.tagName === 'DIV');

  const inner = el('div', 'footer-inner');
  const row = el('div', 'footer-row');
  const bottom = [];
  let panelGroup = null;
  const flushPanel = () => {
    if (panelGroup) inner.append(buildPanel(panelGroup));
    panelGroup = null;
  };

  sections.forEach((sec) => {
    const type = classify(sec);
    if (type === 'panel') {
      flushPanel();
      panelGroup = [sec];
    } else if (type === 'plain' && panelGroup) {
      panelGroup.push(sec);
    } else {
      flushPanel();
      if (type === 'links') row.append(buildLinks(sec));
      else if (type === 'social') row.append(buildSocial(sec));
      else bottom.push(sec);
    }
  });
  flushPanel();
  if (row.childElementCount) inner.append(row);
  bottom.forEach((sec) => inner.append(el('div', 'footer-bottom', ...sec.childNodes)));

  inner.querySelectorAll('.footer-panel-cols').forEach(decorateLinkTypes);
  decorateTargets(inner);

  // panels toggle at every width; link lists are accordions only below desktop
  const linkToggles = [...inner.querySelectorAll('.footer-links-toggle')];
  inner.querySelectorAll('.footer-panel-toggle, .footer-links-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('footer-links-toggle') && DESKTOP.matches) return;
      setOpen(button, button.getAttribute('aria-expanded') !== 'true');
    });
  });
  const sync = () => linkToggles.forEach((b) => setOpen(b, DESKTOP.matches));
  sync();
  DESKTOP.addEventListener('change', sync);

  block.textContent = '';
  block.append(inner);
}
