/**
 * downloads — titled groups of stacked, bordered download boxes (file name link, file type
 * and size meta line with a file icon); plain links (no file) in the same group render as an
 * arrow link list.
 *
 * Authoring: one cell (or several, read in order) — headings start groups; each list item or
 * paragraph holding one link is an entry. A link to a file (pdf, images, office, zip, audio,
 * video, a /dam/ or download path) is a download box; the text after the link (after a line
 * break, e.g. "PDF, 879 KB") is its meta line. Any other link is an arrow link. Other nodes
 * stay in the group in authored order.
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const FILE = /\.(pdf|jpe?g|png|gif|zip|docx?|xlsx?|pptx?|mp3|mp4)(\?|#|$)|\/dam\/|download/i;

function entryFrom(item) {
  const links = item.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  const a = links[0];
  const isFile = FILE.test(a.getAttribute('href'));
  const li = el('li', isFile ? 'downloads-file' : 'downloads-link');
  if (!isFile) {
    li.append(a);
    return li;
  }
  const link = el('a', 'downloads-file-link');
  link.href = a.getAttribute('href');
  if (a.title) link.title = a.title;
  if (a.hasAttribute('download')) link.setAttribute('download', '');
  const name = el('span', 'downloads-name');
  name.append(...a.childNodes);
  link.append(name);
  const meta = [...item.childNodes].filter((n) => n !== a && n.nodeName !== 'BR')
    .map((n) => n.textContent).join(' ').trim();
  if (meta) {
    const m = el('span', 'downloads-meta');
    const icon = el('span', 'downloads-icon');
    icon.setAttribute('aria-hidden', 'true');
    m.append(icon, meta);
    link.append(' ', m);
  }
  li.append(link);
  return li;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .downloads-group')) return;
  const groups = [];
  let group = null;
  const newGroup = () => {
    group = el('div', 'downloads-group');
    groups.push(group);
    return group;
  };
  const listFor = (cls) => {
    if (!group) newGroup();
    const last = group.lastElementChild;
    if (last && last.classList.contains(cls)) return last;
    const ul = el('ul', cls);
    group.append(ul);
    return ul;
  };
  const addEntry = (entry) => {
    const cls = entry.classList.contains('downloads-file') ? 'downloads-files' : 'downloads-links';
    listFor(cls).append(entry);
  };
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((n) => {
      if (/^H[1-6]$/.test(n.tagName)) {
        newGroup();
        const title = el('div', 'downloads-title');
        title.append(n);
        group.append(title);
      } else if (n.tagName === 'UL' || n.tagName === 'OL') {
        [...n.children].forEach((li) => {
          const entry = entryFrom(li);
          if (entry) addEntry(entry);
          else (group || newGroup()).append(li.cloneNode(true));
        });
      } else {
        const entry = n.tagName === 'P' ? entryFrom(n) : null;
        if (entry) addEntry(entry);
        else (group || newGroup()).append(n);
      }
    });
  });
  block.replaceChildren(...groups);
}
