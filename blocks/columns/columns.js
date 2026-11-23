/**
 * columns — AEM responsive grid (2 x 6 or 3 x 4 cols): each column stacks components — an
 * image figure (optionally linked) and a rich-text block with its button row.
 *
 * Authoring: one row, one cell per column. In a cell: an optional picture (alone in its
 * paragraph, optionally wrapped in a link), then rich text; CTA paragraphs (<strong>/<em>
 * links) become the button row.
 *
 * @variants block class: (none) — the column count sets the grid (2 → halves, 3 → thirds);
 *   a cell of [heading] picture, caption, copy paragraph(s) is a nested text-media (copy left,
 *   captioned media floated right from 720, media first on mobile);
 *   one-third — two columns split 4 / 8 (>= 720); captions — a plain paragraph directly after
 *   a picture is that figure's caption (moved into the figure)
 *   thirds — every column 4 of 12 (>= 720) whatever the cell count
 *   components — an empty paragraph in a cell ends a text component: the text after it is the
 *   column's next component (own rte + button row, component margin between them)
 *   light — tinted band; the last column (contact / downloads box) is a raised white card
 *   grey — grey band behind the columns (also used inside accordion panels)
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isCta = (p) => p.matches('.button-wrapper') || !!p.querySelector(':scope > a.button');
const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();
const isHeading = (n) => /^H[1-6]$/.test(n.tagName);

/* plain block, cell = [heading?] picture, caption, copy paragraph(s): the source nests a
   text-media (66/33, media right) in the column; nothing else (lists, CTAs) may follow */
function mediaTextParts(cell) {
  const kids = [...cell.children];
  const headings = [];
  while (kids.length && isHeading(kids[0])) headings.push(kids.shift());
  const [media, caption, ...copy] = kids;
  if (!media || !isMedia(media) || !copy.length) return null;
  const textOnly = (n) => n.tagName === 'P' && !isMedia(n) && !isCta(n) && !!n.textContent.trim();
  if (![caption, ...copy].every(textOnly)) return null;
  return {
    headings, media, caption, copy,
  };
}

function buildMediaText(col, parts) {
  const wrap = el('div', 'columns-text-media');
  const fig = el('div', 'columns-figure');
  const cap = el('div', 'columns-caption');
  cap.append(parts.caption);
  fig.append(parts.media, cap);
  const text = el('div', 'columns-text');
  const rte = el('div', 'rte');
  rte.append(...parts.copy);
  text.append(rte);
  wrap.append(...parts.headings, fig, text);
  col.append(wrap);
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const row = el('div', 'row');
  const captions = block.classList.contains('captions');
  const components = block.classList.contains('components');
  const plain = [...block.classList].every((c) => c === 'columns' || c === 'block');
  cells.forEach((cell) => {
    const col = el('div', 'columns-col');
    const parts = plain ? mediaTextParts(cell) : null;
    if (parts) {
      buildMediaText(col, parts);
      row.append(col);
      return;
    }
    let rte = null;
    let buttons = null;
    let lastFig = null;
    [...cell.children].forEach((n) => {
      if (isMedia(n)) {
        const fig = el('div', 'columns-figure');
        fig.append(n);
        col.append(fig);
        lastFig = fig;
        rte = null;
        buttons = null;
        return;
      }
      if (captions && lastFig && n.tagName === 'P' && !isCta(n)) {
        const cap = el('div', 'columns-caption');
        cap.append(n);
        lastFig.append(cap);
        lastFig = null;
        return;
      }
      lastFig = null;
      // a text after a button row is the next text component (its own rte + buttons)
      if (rte && buttons.children.length && !isCta(n)) rte = null;
      if (components && n.tagName === 'P' && !n.textContent.replace(/[\s\u200b]/g, '')
        && !n.querySelector('img, a')) {
        rte = null;
        n.remove();
        return;
      }
      if (!rte) {
        const text = el('div', 'columns-text');
        rte = el('div', 'rte');
        buttons = el('div', 'buttons');
        text.append(rte, buttons);
        col.append(text);
      }
      if (n.tagName === 'P' && isCta(n)) buttons.append(n);
      else rte.append(n);
    });
    row.append(col);
  });
  block.classList.add(`columns-${cells.length}-cols`);
  const container = el('div', 'container');
  container.append(row);
  block.replaceChildren(container);
}
