/**
 * columns-sidebar — article / press release body: a wide text column (8 of 12) beside a
 * narrow sidebar (4 of 12) holding contact cards, download boxes and further information.
 *
 * Authoring: one row, two cells — the main cell (headings, paragraphs, lists, tables, images,
 * links) and the sidebar cell. A sidebar cell may also be a link to a fragment
 * (`/fragments/…`), which the page auto-blocks into its content. Decoded by role:
 *   - a picture in the sidebar starts a contact / address card: the picture and the nodes after
 *     it (name heading, role text, phone / e-mail / web links) up to the next heading that
 *     follows the card's links, or the next picture
 *   - a link to a file (pdf, jpg, png, zip, docx, xlsx, pptx, mp3, mp4, or a /dam/ or download
 *     path) alone in its list item or paragraph becomes a bordered download box; text after a
 *     line break in that item is the file meta line (e.g. "PDF, 76 KB")
 *   - tel: links and mailto: links showing an address get an icon hook class; other file links
 *     (e.g. in a sidebar heading) get a download icon hook, other contact card links a globe
 *     hook and links inside running text an arrow hook
 * Both columns carry the foundation rich-text class (.rte) for headings, paragraphs and links.
 * A single-cell block renders the main column only. Tables in the main column scroll sideways.
 *
 * @variants block class: alt, alt-2, alt-3, light, image-blue — same layout (catalog variants
 *   by content: downloads, tables, contact cards); light-2 — grey band behind the block
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();
const FILE = /\.(pdf|jpe?g|png|zip|docx?|xlsx?|pptx?|mp3|mp4)(\?|#|$)|\/dam\/|download/i;
const HEADING = /^H[1-6]$/;

/** a list item / paragraph whose only link points at a file → download box */
function downloadFrom(item) {
  const links = item.querySelectorAll('a[href]');
  if (links.length !== 1 || !FILE.test(links[0].getAttribute('href'))) return null;
  const a = links[0];
  const box = el('div', 'columns-sidebar-download');
  const link = el('a', 'columns-sidebar-download-link');
  link.href = a.getAttribute('href');
  if (a.title) link.title = a.title;
  const name = el('span', 'columns-sidebar-download-name');
  name.append(...a.childNodes);
  link.append(name);
  // text after the link (after a <br>) is the meta line; a space keeps the link text readable
  const meta = [...item.childNodes].filter((n) => n !== a && n.nodeName !== 'BR')
    .map((n) => n.textContent).join(' ').trim();
  if (meta) {
    const m = el('span', 'columns-sidebar-download-meta');
    m.textContent = meta;
    link.append(' ', m);
  }
  box.append(link);
  return box;
}

const squash = (n) => n.textContent.replace(/\s+/g, ' ').trim();

/**
 * Icon hooks (source frach-e-icon inside the link): tel: → phone, mailto: showing an address →
 * mail, file → download; other contact card links → globe; other links inside running text
 * (not alone in their paragraph, not buttons) → arrow.
 */
function decorateLinks(scope) {
  scope.querySelectorAll('a[href^="tel:"]').forEach((a) => a.classList.add('columns-sidebar-tel'));
  scope.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
    if (/^\S+@\S+$/.test(a.textContent.trim())) a.classList.add('columns-sidebar-mail');
  });
  scope.querySelectorAll('a[href]:not(.columns-sidebar-download-link)').forEach((a) => {
    const href = a.getAttribute('href');
    if (!/^(mailto|tel):/.test(href) && FILE.test(href)) a.classList.add('columns-sidebar-file');
  });
  const ICONED = '.button, .columns-sidebar-download-link, .columns-sidebar-tel, .columns-sidebar-mail, .columns-sidebar-file';
  scope.querySelectorAll('a[href]').forEach((a) => {
    if (a.matches(ICONED) || !squash(a)) return;
    if (a.closest('.columns-sidebar-card-body')) {
      a.classList.add('columns-sidebar-web');
      return;
    }
    const text = a.closest('p, li, td, th, h1, h2, h3, h4, h5, h6');
    if (text && squash(text) !== squash(a)) a.classList.add('columns-sidebar-link');
  });
}

function buildSidebar(cell) {
  const aside = el('aside', 'columns-sidebar-aside rte');
  let card = null;
  let cardHasLinks = false;
  const closeCard = () => {
    card = null;
    cardHasLinks = false;
  };
  [...cell.children].forEach((n) => {
    if (isMedia(n)) {
      card = el('div', 'columns-sidebar-card');
      const image = el('div', 'columns-sidebar-card-image');
      image.append(n);
      card.append(image, el('div', 'columns-sidebar-card-body'));
      aside.append(card);
      return;
    }
    if (card && HEADING.test(n.tagName) && cardHasLinks) closeCard();
    if (card) {
      card.lastElementChild.append(n);
      if (n.querySelector('a[href^="tel:"], a[href^="mailto:"]')) cardHasLinks = true;
      return;
    }
    if (n.tagName === 'UL' || n.tagName === 'OL') {
      const items = [...n.children].map((li) => downloadFrom(li));
      if (items.length && items.every(Boolean)) {
        const list = el('div', 'columns-sidebar-downloads');
        list.append(...items);
        aside.append(list);
        return;
      }
    } else if (n.tagName === 'P') {
      const box = downloadFrom(n);
      if (box) {
        const prev = aside.lastElementChild;
        if (prev && prev.classList.contains('columns-sidebar-downloads')) prev.append(box);
        else {
          const list = el('div', 'columns-sidebar-downloads');
          list.append(box);
          aside.append(list);
        }
        return;
      }
    }
    aside.append(n);
  });
  decorateLinks(aside);
  return aside;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .columns-sidebar-row')) return;
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const row = el('div', 'columns-sidebar-row');
  const [mainCell, sideCell] = cells;
  if (mainCell) {
    const main = el('div', 'columns-sidebar-main rte');
    main.append(...mainCell.childNodes);
    main.querySelectorAll('table').forEach((t) => {
      if (t.parentElement.classList.contains('columns-sidebar-table')) return;
      const wrap = el('div', 'columns-sidebar-table');
      t.replaceWith(wrap);
      wrap.append(t);
    });
    decorateLinks(main);
    row.append(main);
  }
  if (sideCell && (sideCell.children.length || sideCell.textContent.trim())) {
    row.append(buildSidebar(sideCell));
  } else block.classList.add('no-sidebar');
  // further cells (rare): appended to the sidebar in authored order
  cells.slice(2).forEach((c) => {
    const aside = row.querySelector('.columns-sidebar-aside');
    if (aside) aside.append(...buildSidebar(c).children);
  });
  block.replaceChildren(row);
}
