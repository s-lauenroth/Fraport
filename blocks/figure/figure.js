/**
 * figure — frach-m-image: a figure (picture, optionally linked) with an optional caption, or —
 * variant `gallery` — a media-gallery opener: the badge (files icon + count) on the link.
 *
 * Authoring: one cell. A picture (alone in its paragraph, optionally wrapped in a link), then
 * caption paragraph(s). Gallery: one link whose text is the count (e.g. `0`).
 * Placed directly after a `text-media` block without media, it becomes that block's media.
 *
 * @variants block class: gallery — opener badge; hover-fx — zoom on link hover; zoom — the
 *   lightbox opener badge (zoom-in icon) on the linked picture; aside — a padded 8 / 4 row
 *   (>= 960) whose aside column ADOPTS a directly following `link-box` block
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

/** become the media column of a directly preceding text-media block that has none */
function adopt(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('text-media-wrapper')) return;
  const row = prev.querySelector('.text-media > .container > .row');
  if (!row || row.querySelector(':scope > .text-media-media')) return;
  const media = el('div', 'text-media-media');
  media.append(wrapper);
  const headline = row.querySelector(':scope > .text-media-headline');
  if (headline) headline.after(media);
  else row.prepend(media);
}

function gallery(block, nodes) {
  const p = nodes.find((n) => n.querySelector('a')) || nodes[0];
  const link = p && (p.tagName === 'A' ? p : p.querySelector('a'));
  if (!link) return;
  link.classList.add('figure-link');
  const overlay = el('span', 'figure-overlay figure-overlay-files');
  const icon = el('span', 'icon icon-files');
  icon.setAttribute('aria-hidden', 'true');
  const label = el('span', 'figure-overlay-label');
  label.append(...link.childNodes);
  overlay.append(icon, label);
  link.append(overlay);
  block.replaceChildren(p);
}

/** zoom: the source's lightbox-opener badge (decorative; the link stays the authored one) */
function zoomBadge(frame) {
  const link = frame.querySelector('a');
  if (!link || link.querySelector('.figure-overlay')) return;
  const overlay = el('span', 'figure-overlay figure-overlay-zoom');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.append(el('span', 'icon icon-zoom-in'));
  link.append(overlay);
}

/** aside: figure column + a following link-box wrapper as the aside column */
function aside(block, parts) {
  const wrapper = block.parentElement;
  const next = wrapper && wrapper.nextElementSibling;
  const container = el('div', 'container');
  const row = el('div', 'row');
  const main = el('div', 'figure-col');
  main.append(...parts);
  row.append(main);
  if (next && next.classList.contains('link-box-wrapper')) {
    const col = el('div', 'figure-col figure-col-aside');
    col.append(next);
    row.append(col);
  }
  container.append(row);
  return [container];
}

export default function decorate(block) {
  if (block.querySelector('.figure-frame, .figure-link')) return;
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const nodes = cells.flatMap((c) => (c.children.length ? [...c.children] : [c]));
  if (block.classList.contains('gallery')) {
    gallery(block, nodes);
  } else {
    const media = nodes.find((n) => n.querySelector('picture, img'));
    const frame = el('div', 'figure-frame');
    if (media) frame.append(media);
    const link = frame.querySelector('a');
    if (link) link.classList.add('figure-link');
    if (block.classList.contains('zoom')) zoomBadge(frame);
    const rest = nodes.filter((n) => n !== media && n.textContent.trim());
    const parts = [frame];
    if (rest.length) {
      const caption = el('div', 'figure-caption');
      caption.append(...rest);
      parts.push(caption);
    }
    block.replaceChildren(...(block.classList.contains('aside') ? aside(block, parts) : parts));
  }
  if (!block.classList.contains('aside')) adopt(block);
}
