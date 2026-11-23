/**
 * tag-list — a row of topic tag pills; each pill links to the content filtered by that topic.
 *
 * Authoring: one cell (or several, read as one) holding the tag links — a list (<ul> of links)
 * or link paragraphs. Plain-text items (no link) become non-interactive pills. Empty cells and
 * any other nodes are ignored.
 *
 * @variants block class: alt — compact pills (smaller type and padding), same structure
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .tag-list-items')) return;
  const list = el('ul', 'tag-list-items');
  const items = [...block.querySelectorAll(':scope > div > div li')];
  const sources = items.length
    ? items
    : [...block.querySelectorAll(':scope > div > div p, :scope > div > div > a')];
  sources.forEach((src) => {
    const anchors = src.tagName === 'A' ? [src] : [...src.querySelectorAll('a[href]')];
    if (anchors.length) {
      anchors.forEach((a) => {
        const li = el('li', 'tag-list-item');
        a.className = 'tag-list-tag';
        li.append(a);
        list.append(li);
      });
    } else if (src.textContent.trim()) {
      const li = el('li', 'tag-list-item');
      const span = el('span', 'tag-list-tag');
      span.textContent = src.textContent.trim();
      li.append(span);
      list.append(li);
    }
  });
  block.replaceChildren(list);
}
