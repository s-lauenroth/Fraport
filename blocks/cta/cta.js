/**
 * cta — frach-m-cta: a ruled band — headline and a line of copy on the left, the button(s)
 * bottom right.
 *
 * Authoring: one cell (or several, read as one): a heading, copy paragraph(s), CTA paragraphs
 * (<strong> = primary, <em> = secondary link).
 * Variant `small`: the headline set in the h6 ramp (newsroom archive band) instead of h3.
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isCta = (p) => p.matches('.button-wrapper') || !!p.querySelector(':scope > a.button');

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const text = el('div', 'cta-text');
  const actions = el('div', 'cta-actions');
  const ramp = block.classList.contains('small') ? 'h6' : 'h3';
  nodes.forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) {
      const h = el('div', `cta-headline ${ramp}`);
      h.append(n);
      text.append(h);
    } else if (n.tagName === 'P' && isCta(n)) {
      const a = el('div', 'cta-action');
      a.append(n);
      actions.append(a);
    } else {
      const c = el('div', 'cta-copy');
      c.append(n);
      text.append(c);
    }
  });
  // the source template always renders two action slots (the second may stay empty)
  while (actions.children.length && actions.children.length < 2) actions.append(el('div', 'cta-action'));
  const row = el('div', 'row');
  row.append(el('div', 'cta-line'), text);
  if (actions.children.length) row.append(actions);
  const container = el('div', 'container');
  container.append(row);
  block.replaceChildren(container);
}
