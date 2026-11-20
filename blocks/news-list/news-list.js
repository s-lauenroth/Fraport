/**
 * news-list — frach-m-search results page: gradient search band, type tabs, scrollable tag
 * filter, result count, bordered result rows (meta • date, linked heading, teaser, 16:9 thumb),
 * "mehr anzeigen" and the hidden empty / error states.
 *
 * Authoring (rows classified by content, never by index):
 * - a row holding an <h1>: the page title, kept visually hidden (the source page has none).
 * - list rows: the first is the type tabs (a bold item = the active tab), the last the tag filter.
 * - a paragraph row before the first result: the result count (<strong> = the number).
 * - result rows (a heading with a link): paragraphs before the heading = meta (topics, date),
 *   the heading, paragraphs after it = teaser; a picture in any cell = the thumbnail.
 * - a paragraph after the results: the load-more button label (static, as captured: paging
 *   needs the news index).
 * - heading rows without a link after the results: the empty state, then the error state
 *   (hidden until the search over the listed results finds nothing / fails).
 *
 * Search and tag filter work over the authored first result page (the news corpus is not
 * migrated — dynamic-features rows 35/40/45).
 *
 * @ew-exempt search / reset / slider button labels are presentational chrome (sr-only, from the
 * source's i18n keys), not authored content.
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function iconButton(className, icon, label, type = 'button') {
  const b = el('button', className);
  b.type = type;
  const i = el('span', `icon icon-${icon}`);
  i.setAttribute('aria-hidden', 'true');
  const l = el('span', 'visually-hidden');
  l.textContent = label;
  b.append(i, l);
  return b;
}

function gridBox(className) {
  const container = el('div', 'container');
  const row = el('div', 'row');
  const col = el('div', className);
  row.append(col);
  container.append(row);
  return { container, col };
}

const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const BLOCK_LEVEL = 'p, div, ul, ol, picture, img, h1, h2, h3, h4, h5, h6, pre, blockquote';

/* a cell's content nodes; a single-paragraph cell is delivered unwrapped (inline content only),
   so its child nodes are moved into one <p> wrapper */
function cellNodes(row) {
  return [...row.children].flatMap((cell) => {
    const inline = [...cell.childNodes].some((n) => (n.nodeType === Node.TEXT_NODE
      ? n.textContent.trim() : n.nodeType === Node.ELEMENT_NODE && !n.matches(BLOCK_LEVEL)));
    if (!inline) return [...cell.children];
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    return [p];
  });
}

function buildItem(row) {
  const li = el('li', 'news-list-item');
  const body = el('div', 'news-list-body');
  const meta = el('div', 'news-list-meta');
  const headline = el('div', 'news-list-headline');
  const teaser = el('div', 'news-list-teaser');
  const image = el('div', 'news-list-image');
  const nodes = cellNodes(row);
  let seenHeading = false;
  nodes.forEach((n) => {
    if (n.matches('picture, img') || n.querySelector('picture, img')) {
      image.append(n);
      const im = n.querySelector('img') || n;
      if (im.tagName === 'IMG') im.loading = 'lazy';
    } else if (n.matches(HEADINGS) && !seenHeading) {
      seenHeading = true;
      headline.append(n);
    } else if (!n.textContent.trim()) {
      // empty paragraph left by the editor
    } else if (seenHeading) {
      teaser.append(n);
    } else {
      // a word space between the meta parts, as between the source's spans (line-break chance),
      // and one inside the previous part before its bullet: the bullet may wrap with the date
      if (meta.lastElementChild) {
        meta.lastElementChild.append(' ');
        meta.append(' ');
      }
      meta.append(n);
    }
  });
  [meta, headline, teaser].forEach((part) => {
    if (part.children.length) body.append(part);
  });
  li.append(body);
  if (image.children.length) li.append(image);
  return li;
}

function buildSearch() {
  const band = el('div', 'news-list-search');
  const { container, col } = gridBox('news-list-search-col');
  const form = el('form', 'news-list-form');
  form.setAttribute('role', 'search');
  form.action = window.location.pathname;
  const input = el('input', 'news-list-input h6');
  input.type = 'search';
  input.name = 'q';
  input.autocomplete = 'off';
  const reset = iconButton(
    'news-list-search-btn news-list-search-btn-reset',
    'close',
    'frach.component.search.reset',
    'reset',
  );
  reset.hidden = true;
  const submit = iconButton(
    'news-list-search-btn news-list-search-btn-submit',
    'search',
    'frach.component.search.submit',
    'submit',
  );
  form.append(input, reset, submit);
  col.append(form);
  band.append(container);
  return {
    band, form, input, reset,
  };
}

function bindSlider(tags, prev, next) {
  const sync = () => {
    prev.hidden = tags.scrollLeft <= 0;
    next.hidden = tags.scrollLeft + tags.clientWidth >= tags.scrollWidth - 1;
  };
  const step = (dir) => tags.scrollBy({ left: dir * tags.clientWidth * 0.8, behavior: 'smooth' });
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  tags.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  requestAnimationFrame(sync);
}

export default function decorate(block) {
  if (block.dataset.decorated) return;
  block.dataset.decorated = 'true';
  const rows = [...block.querySelectorAll(':scope > div')];
  const isItem = (r) => !!r.querySelector(`:is(${HEADINGS}) a[href]`);
  const firstItem = rows.findIndex(isItem);
  const lastItem = rows.length - 1 - [...rows].reverse().findIndex(isItem);
  const lists = rows.filter((r) => !isItem(r) && r.querySelector('ul, ol'));

  const title = el('div', 'news-list-title visually-hidden');
  const {
    band, form, input, reset,
  } = buildSearch();
  const types = el('div', 'news-list-types');
  const tabs = el('div', 'news-list-tabs news-list-rail');
  const filter = el('div', 'news-list-filter');
  const tags = el('div', 'news-list-tags news-list-rail');
  const summary = gridBox('news-list-summary');
  const items = el('ul', 'news-list-items news-list-rail');
  const more = gridBox('news-list-more');
  const states = [];

  rows.forEach((row, i) => {
    if (isItem(row)) {
      items.append(buildItem(row));
      return;
    }
    const nodes = cellNodes(row);
    if (row.querySelector('h1')) {
      title.append(...nodes);
    } else if (lists.includes(row)) {
      const isTags = lists.length > 1 ? row === lists[lists.length - 1] : !row.querySelector('strong');
      (isTags ? tags : tabs).append(...nodes);
    } else if (firstItem < 0 || i < firstItem) {
      summary.col.append(...nodes);
    } else if (i > lastItem && row.querySelector(HEADINGS)) {
      const state = el('section', 'news-list-state');
      state.hidden = true;
      const box = gridBox('news-list-state-text');
      box.col.append(...nodes);
      state.append(box.container);
      states.push(state);
    } else {
      more.col.append(...nodes);
    }
  });
  const [empty, error] = states;
  if (empty) empty.classList.add('news-list-state-empty');
  if (error) error.classList.add('news-list-state-error');

  const parts = [title, band];
  if (tabs.children.length) {
    types.append(tabs);
    parts.push(types);
  }
  if (tags.children.length) {
    const controls = el('div', 'news-list-controls news-list-rail');
    const prev = iconButton('button primary news-list-control news-list-control-prev', 'arrow-left', 'Previous Slide');
    const next = iconButton('button primary news-list-control news-list-control-next', 'arrow-right', 'Next Slide');
    prev.hidden = true;
    controls.append(prev, next);
    filter.append(tags, controls);
    parts.push(filter);
    bindSlider(tags, prev, next);
  }
  if (summary.col.children.length) parts.push(summary.container);
  parts.push(items);
  if (more.col.children.length) {
    const button = el('div', 'button secondary news-list-more-button');
    button.setAttribute('role', 'button');
    button.tabIndex = 0;
    button.append(...more.col.children);
    more.col.append(button);
    parts.push(more.container);
  }
  parts.push(...states);
  block.replaceChildren(...parts);

  // tag filter + search over the listed results
  const tagItems = [...tags.querySelectorAll('li')].map((li) => {
    const label = el('span', 'news-list-tag-label');
    label.append(...li.childNodes);
    li.append(label);
    return label;
  });
  const results = [...items.children];
  const apply = () => {
    const q = input.value.trim().toLowerCase();
    const active = tagItems.filter((t) => t.getAttribute('aria-pressed') === 'true')
      .map((t) => t.textContent.trim().toLowerCase());
    let shown = 0;
    results.forEach((r) => {
      const meta = (r.querySelector('.news-list-meta')?.textContent || '').toLowerCase();
      const ok = (!q || r.textContent.toLowerCase().includes(q))
        && (!active.length || active.some((a) => meta.includes(a)));
      r.hidden = !ok;
      if (ok) shown += 1;
    });
    if (empty) empty.hidden = shown > 0;
    more.container.hidden = shown < results.length;
  };
  tagItems.forEach((t) => {
    t.setAttribute('role', 'button');
    t.tabIndex = 0;
    t.setAttribute('aria-pressed', 'false');
    const toggle = () => {
      t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      apply();
    };
    t.addEventListener('click', toggle);
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
  input.addEventListener('input', () => {
    reset.hidden = !input.value;
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    apply();
  });
  form.addEventListener('reset', () => {
    reset.hidden = true;
    requestAnimationFrame(apply);
  });
}
