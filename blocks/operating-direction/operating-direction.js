/**
 * operating-direction — runway operating direction widget: the runway graphic, a status panel
 * (operating direction, active runway, weather category, each with value lines, and a
 * "Stand" timestamp) and an explanatory text column with a details link.
 *
 * Authoring: one row, up to three cells, classified by content (never by index):
 *   - a cell holding only a picture → the runway graphic
 *   - a cell whose headings are followed by value paragraphs → the status panel (each heading
 *     starts one status item; a last paragraph starting with "Stand" / "As of" is the
 *     timestamp). This is the authored snapshot of the live feed.
 *   - any other cell → the text column
 * Config row (optional): `source | <url>` — a JSON endpoint returning
 * `{ "items": [{ "label": "…", "lines": ["…"] }], "timestamp": "…" }`; when it answers, the
 * status panel is re-rendered from it, otherwise the snapshot stays.
 * A cell holding just a link to an embeddable widget page (`/widgets/…` or an .html page) is
 * embedded as an iframe instead.
 *
 * Output: .operating-direction-row > .operating-direction-widget (graphic + panel, as the
 * source's .betriebsrichtungsanzeige) and .operating-direction-text. The panel splits its
 * items into two columns (source .betriebsrichtung_col: first half, rest + timestamp).
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isMediaCell = (c) => !!c.querySelector('picture, img') && !c.textContent.trim();
const STAMP = /^\s*(stand|as of|updated)/i;

/**
 * Renders status items into the panel.
 * @param {Element} panel the panel element
 * @param {{ label: Node[], values: Node[][] }[]} items label nodes and value paragraphs
 * @param {Node[]|null} stampNodes timestamp content
 */
function render(panel, items, stampNodes) {
  const half = Math.ceil(items.length / 2);
  const groups = [items.slice(0, half), items.slice(half)].filter((g) => g.length);
  const cols = groups.map((group) => {
    const col = el('div', 'operating-direction-col');
    const list = el('dl', 'operating-direction-items');
    group.forEach(({ label, values }) => {
      const dt = el('dt', 'operating-direction-label');
      dt.append(...label);
      list.append(dt);
      values.forEach((nodes) => {
        const dd = el('dd', 'operating-direction-value');
        dd.append(...nodes);
        list.append(dd);
      });
    });
    col.append(list);
    return col;
  });
  if (stampNodes) {
    const stamp = el('p', 'operating-direction-stamp');
    stamp.append(...stampNodes);
    if (!cols.length) cols.push(el('div', 'operating-direction-col'));
    cols[cols.length - 1].append(stamp);
  }
  panel.replaceChildren(...cols);
}

function linesToNodes(lines) {
  const nodes = [];
  lines.forEach((line, i) => {
    if (i) nodes.push(document.createElement('br'));
    nodes.push(document.createTextNode(line));
  });
  return nodes;
}

function buildPanel(cell) {
  const panel = el('div', 'operating-direction-panel');
  const items = [];
  let stamp = null;
  [...cell.children].forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) {
      items.push({ label: [...n.childNodes], values: [] });
    } else if (STAMP.test(n.textContent) && n === cell.lastElementChild) {
      stamp = [...n.childNodes];
    } else if (n.textContent.trim()) {
      // one value per paragraph; its lines stay separated by <br>
      if (!items.length) items.push({ label: [], values: [] });
      items[items.length - 1].values.push([...n.childNodes]);
    }
  });
  render(panel, items, stamp);
  return panel;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .operating-direction-row')) return;
  let source = null;
  const rows = [...block.children].filter((row) => {
    const key = (row.firstElementChild?.textContent || '').trim().toLowerCase();
    if (key === 'source' && row.children[1]) {
      source = row.children[1].querySelector('a')?.href || row.children[1].textContent.trim();
      return false;
    }
    return true;
  });
  const row = el('div', 'operating-direction-row');
  const widget = el('div', 'operating-direction-widget');
  let panel = null;
  rows.flatMap((r) => [...r.children]).forEach((cell) => {
    const links = cell.querySelectorAll('a[href]');
    const onlyLink = links.length === 1 && cell.textContent.trim() === links[0].textContent.trim();
    if (onlyLink && /\/widgets\/|\.html?(\?|#|$)/.test(links[0].getAttribute('href'))) {
      const frame = el('div', 'operating-direction-embed');
      const iframe = el('iframe');
      iframe.src = links[0].href;
      iframe.title = links[0].textContent.trim() || 'Betriebsrichtung';
      iframe.loading = 'lazy';
      frame.append(iframe);
      row.append(frame);
    } else if (isMediaCell(cell)) {
      const media = el('div', 'operating-direction-graphic');
      media.append(...cell.children);
      widget.append(media);
    } else if (!panel && [...cell.children].filter((n) => /^H[1-6]$/.test(n.tagName)).length > 1) {
      panel = buildPanel(cell);
      widget.append(panel);
    } else if (cell.children.length || cell.textContent.trim()) {
      const text = el('div', 'operating-direction-text rte');
      text.append(...cell.childNodes);
      row.append(text);
    }
  });
  if (widget.children.length) row.prepend(widget);
  block.replaceChildren(row);

  if (source && panel) {
    fetch(source)
      .then((resp) => (resp.ok ? resp.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items) && data.items.length) {
          const items = data.items.map(({ label, lines }) => ({
            label: [document.createTextNode(label || '')],
            values: lines?.length ? [linesToNodes(lines)] : [],
          }));
          render(panel, items, data.timestamp ? [document.createTextNode(data.timestamp)] : null);
        }
      })
      .catch(() => { /* keep the authored snapshot */ });
  }
}
