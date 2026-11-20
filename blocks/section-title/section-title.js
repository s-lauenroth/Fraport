/**
 * section-title — frach-m-section-title: a ribbon headline (h3 ramp; a <br> starts the next
 * band) with an optional intro paragraph, wiped in when it scrolls into view.
 *
 * Authoring: one cell — the heading (<h2>) and optional paragraph(s).
 *
 * @variants block class: primary | secondary | gradient (default primary) — ribbon colour;
 *   nested — the title sits inside the following component (no component margin of its own)
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function ribbonLines(heading) {
  if (heading.querySelector('.ribbon-line')) return;
  const groups = [[]];
  [...heading.childNodes].forEach((n) => {
    if (n.nodeName === 'BR') {
      n.remove();
      groups.push([]);
    } else groups[groups.length - 1].push(n);
  });
  groups.filter((g) => g.length).forEach((g) => {
    const line = el('span', 'ribbon-line');
    const txt = el('span', 'ribbon-text');
    txt.append(...g);
    line.append(txt);
    heading.append(line);
  });
}

function onView(elem) {
  if (!('IntersectionObserver' in window)) {
    elem.classList.add('is-animating');
    return;
  }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add('is-animating');
      io.unobserve(en.target);
    }
  }), { threshold: 0.1 });
  io.observe(elem);
}

export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...block.querySelectorAll('p')].filter((p) => p.textContent.trim());
  const colour = ['primary', 'secondary', 'gradient'].find((c) => block.classList.contains(c)) || 'primary';

  const box = el('div', 'section-title-box');
  if (heading) {
    const ribbon = el('div', `section-title-heading ribbon ribbon-${colour} h3`);
    ribbon.dataset.animate = 'ribbon';
    ribbonLines(heading);
    ribbon.append(heading);
    box.append(ribbon);
    onView(ribbon);
  }
  if (paras.length) {
    const body = el('div', 'section-title-body body');
    body.append(...paras);
    box.append(body);
  }
  const container = el('div', 'container');
  const row = el('div', 'row');
  const col = el('div');
  col.append(box);
  row.append(col);
  container.append(row);
  block.replaceChildren(container);
}
