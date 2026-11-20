/**
 * anchor-list — frach-m-anchor-list: in-page navigation. >= 960 one ruled row of anchors;
 * < 960 an accordion whose label row is the section currently in view (scroll spy). While the
 * bar is pinned it collapses to that label row and opens on click.
 *
 * Authoring: one cell holding a list of in-page links (<ul><li><a href="#id">…</a></li></ul>).
 * Targets are section ids: a section whose Section Metadata carries `id` (folded to `id` or
 * `data-id`) receives that id.
 *
 * @variants block class: rule (default none) — a horizontal rule band above the bar (the
 *   source's rule-only section; an authored <hr> would fracture the DA section, #119);
 *   numbered — each anchor gets its running number (01, 02 …, presentational) and, >= 960
 *   while the bar is not pinned, prev / next arrows scroll the overflowing anchor row
 *
 * The label row is a presentational clone of the current anchor (instrumentation stripped,
 * EW4); the authored list stays the editable source.
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

function controlButton(className, icon, label) {
  const b = el('button', `button primary button-primary button-icon-only ${className}`);
  b.type = 'button';
  const i = el('span', `icon icon-${icon}`);
  i.setAttribute('aria-hidden', 'true');
  const t = el('span', 'visually-hidden');
  t.textContent = label;
  b.append(i, t);
  return b;
}

/** numbered variant: running number + the authored link text wrapped (nodes moved) */
function numberAnchors(items) {
  items.forEach((li, n) => {
    const a = li.querySelector('a');
    if (a.querySelector('.anchor-list-number')) return;
    const text = el('span', 'anchor-list-text');
    text.append(...a.childNodes);
    const num = el('span', 'anchor-list-number');
    num.textContent = String(n + 1).padStart(2, '0');
    a.append(num, text);
  });
}

/** numbered variant: arrows scroll the anchor row (source slider controls) */
function scrollControls(nav, row) {
  const controls = el('div', 'anchor-list-controls');
  const prev = controlButton('anchor-list-prev', 'arrow-left', 'Previous Slide');
  const next = controlButton('anchor-list-next', 'arrow-right', 'Next Slide');
  controls.append(prev, next);
  nav.prepend(controls);
  const sync = () => {
    prev.hidden = row.scrollLeft <= 0;
    next.hidden = row.scrollLeft + row.clientWidth >= row.scrollWidth - 1;
  };
  prev.addEventListener('click', () => row.scrollBy({ left: -row.clientWidth, behavior: 'smooth' }));
  next.addEventListener('click', () => row.scrollBy({ left: row.clientWidth, behavior: 'smooth' }));
  row.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  requestAnimationFrame(sync);
}

function resolveTarget(id) {
  if (!id) return null;
  let target = document.getElementById(id);
  if (!target) {
    target = document.querySelector(`main .section[data-id="${id}"], main [data-anchor="${id}"]`);
    if (target) target.id = id;
  }
  return target;
}

export default function decorate(block) {
  const list = block.querySelector('ul, ol');
  if (!list) return;
  const items = [...list.querySelectorAll(':scope > li')].filter((li) => li.querySelector('a'));
  if (!items.length) return;

  const nav = el('nav', 'anchor-list-nav');
  nav.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'On this page' : 'Auf dieser Seite');
  const section = el('div', 'anchor-list-section');
  const label = el('div', 'anchor-list-label');
  const itemsWrap = el('div', 'anchor-list-items');
  itemsWrap.append(list);
  section.append(label, itemsWrap);
  nav.append(section);

  const container = el('div', 'container');
  const row = el('div', 'row');
  const col = el('div');
  col.append(nav);
  row.append(col);
  container.append(row);
  block.replaceChildren(container);
  if (block.classList.contains('numbered')) {
    numberAnchors(items);
    scrollControls(nav, section);
  }
  if (block.classList.contains('rule')) {
    const rule = el('div', 'anchor-list-rule');
    rule.append(document.createElement('hr'));
    block.prepend(rule);
  }

  const toggleIcon = () => {
    const i = el('span', 'icon icon-chevron-down anchor-list-toggle-icon');
    i.setAttribute('aria-hidden', 'true');
    return i;
  };

  let current = null;
  const setCurrent = (li) => {
    if (li === current) return;
    current = li;
    items.forEach((x) => x.classList.toggle('is-current', x === li));
    const clone = stripInstrumentation(li.querySelector('a').cloneNode(true));
    clone.removeAttribute('id');
    clone.append(toggleIcon());
    label.replaceChildren(clone);
  };
  setCurrent(items[items.length - 1]);

  const targets = () => items.map((li) => {
    const href = li.querySelector('a').getAttribute('href') || '';
    return { li, target: resolveTarget(href.startsWith('#') ? decodeURIComponent(href.slice(1)) : '') };
  });
  targets();

  const update = () => {
    const wrap = container;
    const stuck = window.scrollY > 0 && wrap.getBoundingClientRect().top <= 0;
    nav.classList.toggle('is-collapsed', stuck);
    if (!stuck) nav.classList.remove('is-open');
    const limit = nav.getBoundingClientRect().height + 1;
    let inView = null;
    targets().forEach(({ li, target }) => {
      if (target && target.getBoundingClientRect().top <= limit) inView = li;
    });
    if (inView) setCurrent(inView);
  };
  window.addEventListener('scroll', update, { passive: true });

  label.addEventListener('click', (e) => {
    if (nav.classList.contains('is-collapsed')) {
      e.preventDefault();
      nav.classList.toggle('is-open');
    }
  });
  items.forEach((li) => li.querySelector('a').addEventListener('click', () => {
    setCurrent(li);
    nav.classList.remove('is-open');
  }));
}
