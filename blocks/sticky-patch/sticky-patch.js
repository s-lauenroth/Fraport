/**
 * sticky-patch — frach-e-sticky-patch: a fixed round pin button (bottom right) that opens a
 * promo card (image, heading, copy, link) and closes it again.
 *
 * Authoring (one cell or several, decoded by content): a picture, a heading, a copy paragraph,
 * a paragraph holding the link.
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function iconButton(className, icon, label) {
  const b = el('button', className);
  b.type = 'button';
  b.setAttribute('aria-label', label);
  const i = el('span', `icon icon-${icon}`);
  i.setAttribute('aria-hidden', 'true');
  b.append(i);
  return b;
}

export default function decorate(block) {
  const picture = block.querySelector('picture') || block.querySelector('img');
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const linkPara = paras.find((p) => p.querySelector('a'));
  const copy = paras.filter((p) => p !== linkPara && p.textContent.trim());

  const card = el('div', 'sticky-patch-card');
  card.id = `sticky-patch-card-${Math.random().toString(36).slice(2, 8)}`;
  const close = iconButton('sticky-patch-close', 'close', 'Closes popup');
  card.append(close);
  if (picture) {
    const media = el('div', 'sticky-patch-image');
    media.append(picture);
    card.append(media);
  }
  if (heading) {
    const h = el('div', 'sticky-patch-heading h6');
    h.append(heading);
    card.append(h);
  }
  copy.forEach((p) => {
    const c = el('div', 'sticky-patch-copy body');
    c.append(p);
    card.append(c);
  });
  if (linkPara) {
    const l = el('div', 'sticky-patch-link');
    l.append(linkPara);
    card.append(l);
  }

  const open = iconButton('sticky-patch-open is-ringing', 'sticky-pin', 'Opens popup');
  open.setAttribute('aria-controls', card.id);
  open.setAttribute('aria-expanded', 'false');
  open.addEventListener('animationend', () => open.classList.remove('is-ringing'));
  open.addEventListener('click', () => {
    block.classList.add('is-open');
    open.setAttribute('aria-expanded', 'true');
  });
  close.addEventListener('click', () => {
    block.classList.remove('is-open');
    open.setAttribute('aria-expanded', 'false');
  });

  block.setAttribute('role', 'complementary');
  if (heading) block.setAttribute('aria-label', heading.textContent.trim());
  block.replaceChildren(card, open);
}
