/**
 * iframe — the AEM iframe component (e.g. the investor-relations share chart): a full-width
 * frame of a fixed height inside the component margin.
 *
 * Authoring: one row — the frame URL as a link | the height in px (e.g. `1400`).
 *
 * @ew-exempt the link and height cells are configuration (frame src / height); the link stays
 *   in the DOM (hidden) as the editable source, the iframe is presentational
 */

export default function decorate(block) {
  if (block.querySelector('iframe')) return;
  const link = block.querySelector('a[href]');
  if (!link) return;
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const hCell = cells.find((c) => !c.querySelector('a') && /^\s*\d+/.test(c.textContent));
  const height = hCell ? parseInt(hCell.textContent, 10) : 600;
  const config = document.createElement('div');
  config.className = 'iframe-config';
  config.hidden = true;
  config.append(...block.children);
  const frame = document.createElement('iframe');
  frame.src = link.href;
  frame.title = link.title || link.textContent.trim();
  frame.width = '100%';
  frame.height = `${height}px`;
  frame.loading = 'lazy';
  frame.setAttribute('frameborder', '0');
  frame.setAttribute('scrolling', 'no');
  block.replaceChildren(frame, config);
}
