/**
 * teaser-feature — single featured image teaser: a square image with a translucent text panel
 * overlapping its lower right (heading, copy, arrow link). The whole teaser is clickable: the
 * link stays the one real anchor and stretches over the teaser (CSS).
 *
 * Authoring: one row — a picture (alone in its paragraph) and the text: a heading, copy
 * paragraphs and a link (the teaser target, in a paragraph or bare). One or two cells; decoded
 * by role. With no link the teaser is not clickable.
 *
 * @variants block class: square-text-over-image — the link text sits directly over the image,
 *   no panel
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();

export default function decorate(block) {
  if (block.querySelector(':scope > .teaser-feature-inner')) return;
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const mediaNodes = nodes.filter(isMedia);
  const [first, ...extra] = mediaNodes;
  const text = nodes.filter((n) => !isMedia(n));
  const linkNode = [...text].reverse().find((n) => n.matches('a[href]') || n.querySelector('a[href]'));
  const anchor = linkNode && (linkNode.matches('a[href]') ? linkNode : linkNode.querySelector('a[href]'));

  const inner = el('div', 'teaser-feature-inner');
  if (anchor) {
    anchor.className = 'teaser-feature-link';
    if (linkNode === anchor) {
      // a bare link becomes its own paragraph
      const p = el('p', 'teaser-feature-cta');
      anchor.replaceWith(p);
      p.append(anchor);
      text[text.indexOf(anchor)] = p;
    } else {
      linkNode.className = 'teaser-feature-cta';
    }
  }
  const image = el('div', 'teaser-feature-image');
  if (first) image.append(first);
  const panel = el('div', 'teaser-feature-panel');
  // extra pictures (e.g. a headline graphic) sit in the panel
  extra.forEach((n) => {
    n.classList.add('teaser-feature-graphic');
    panel.append(n);
  });
  panel.append(...text);
  inner.append(image, panel);
  block.replaceChildren(inner);
}
