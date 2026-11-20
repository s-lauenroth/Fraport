/**
 * hero — frach-m-hero: 16:9 key visual offset two columns and bleeding right, with the page's
 * ribbon headline (one band per authored line) over it (>= 720) or overlapping its foot (< 720).
 *
 * Authoring (any row/cell shape — decoded by query, never by index):
 *   - one picture: the key visual
 *   - one heading (the page's <h1>); a <br> starts the next ribbon band
 *
 * @variants block class: primary | secondary | gradient (default gradient) — ribbon colour
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

/** split the authored heading's inline content at <br> into ribbon bands (moves nodes) */
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

export default function decorate(block) {
  const picture = block.querySelector('picture') || block.querySelector('img');
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const colour = ['primary', 'secondary', 'gradient'].find((c) => block.classList.contains(c)) || 'gradient';

  const container = el('div', 'container');
  const row = el('div', 'row');
  container.append(row);

  if (picture) {
    const media = el('div', 'hero-media');
    const frame = el('div', 'hero-frame');
    const img = picture.querySelector('img') || picture;
    img.setAttribute('fetchpriority', 'high');
    img.loading = 'eager';
    frame.append(picture);
    media.append(frame);
    row.append(media);
  }
  if (heading) {
    const ribbon = el('div', `hero-headline ribbon ribbon-${colour} h1 is-animating`);
    ribbonLines(heading);
    ribbon.append(heading);
    row.append(ribbon);
  }
  block.replaceChildren(container);
  block.classList.add('is-active');
}
