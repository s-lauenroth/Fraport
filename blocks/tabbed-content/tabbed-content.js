/**
 * tabbed-content — frach-m-tabbed-content: a ruled, horizontally scrolling tab bar; one panel is
 * shown at a time (the first, or the one named by the URL hash).
 *
 * Authoring: one cell holding a list of in-page links (<ul><li><a href="#panel-id">Label</a>…).
 * The panels are the sections that follow the block's section and carry the Section Metadata
 * style `tab-panel`: a section whose `id` matches a tab starts that tab's panel, the next
 * `tab-panel` sections without a matching id continue it (sections keep their own blocks — an
 * accordion inside a panel stays bounded by its section). The first section without the style
 * ends the run.
 *
 * The block never moves the panel sections (they keep the foundation section rules); it only
 * toggles `hidden` and the ARIA tab roles.
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

// the pipeline lower-cases Section Metadata ids (`Wer_sind_wir` → `wer_sind_wir`): compare folded
const fold = (v) => (v || '').toLowerCase();
const sectionId = (s) => fold(s.id || s.dataset.id);

export default function decorate(block) {
  if (block.querySelector('.tabbed-content-tabs')) return;
  const list = block.querySelector('ul');
  if (!list) return;
  const links = [...list.querySelectorAll('a[href*="#"]')];
  const ids = links.map((a) => fold(decodeURIComponent(a.getAttribute('href').split('#')[1] || '')));
  const panels = new Map(ids.map((id) => [id, []]));
  const section = block.closest('.section');
  let current = null;
  let next = section && section.nextElementSibling;
  while (next && next.classList.contains('tab-panel')) {
    const id = sectionId(next);
    if (panels.has(id)) {
      current = id;
      next.classList.add('tabbed-content-panel-start');
    }
    if (current) {
      panels.get(current).push(next);
      next.classList.add('tabbed-content-panel');
      next.setAttribute('role', 'tabpanel');
    }
    next = next.nextElementSibling;
  }
  panels.forEach((secs) => {
    if (secs.length) secs[secs.length - 1].classList.add('tabbed-content-panel-end');
  });

  list.classList.add('tabbed-content-tabs');
  list.setAttribute('role', 'tablist');
  const select = (id, focus) => {
    links.forEach((a, n) => {
      const on = ids[n] === id;
      a.classList.toggle('is-active', on);
      a.setAttribute('aria-selected', String(on));
      a.tabIndex = on ? 0 : -1;
      if (on && focus) a.focus();
    });
    panels.forEach((secs, key) => secs.forEach((s) => { s.hidden = key !== id; }));
  };
  links.forEach((a, n) => {
    a.classList.add('tabbed-content-tab');
    a.setAttribute('role', 'tab');
    a.id = a.id || `tab-${ids[n]}`;
    const first = panels.get(ids[n])[0];
    if (first) first.setAttribute('aria-labelledby', a.id);
    a.parentElement.classList.add('tabbed-content-tab-item');
    a.parentElement.setAttribute('role', 'presentation');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      select(ids[n]);
    });
    a.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const step = e.key === 'ArrowRight' ? 1 : -1;
      select(ids[(n + step + ids.length) % ids.length], true);
    });
  });
  const hash = fold(decodeURIComponent(window.location.hash.slice(1)));
  select(panels.has(hash) ? hash : ids[0]);

  const nav = el('div', 'tabbed-content-nav');
  nav.append(list);
  const container = el('div', 'container');
  const row = el('div', 'row');
  const col = el('div', 'tabbed-content-col');
  col.append(nav);
  row.append(col);
  container.append(row);
  block.replaceChildren(container);
}
