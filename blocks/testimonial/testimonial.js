/**
 * testimonial — default look: the source grey band with a frach-e-pull-quote (purple
 * semibold-italic quote + author line) in 8 of 12 columns beside a 4-column 16:9 image with its
 * figcaption. Options no-caption / text-over-image keep the frach-m-testimonial look: a 16:9 image
 * with the quote floated over its left half on a lilac veil.
 *
 * Authoring: one cell — a picture paragraph (optionally wrapped in a link), the caption paragraph,
 * the headline paragraph, the quote (a blockquote; else the last paragraph). Decoded by role.
 * Placed directly after a one-cell `columns` block in the same section, it becomes that grid's
 * second column (the source's 2 x 6 responsive grid).
 *
 * @variants block class: no-caption — no meta caption: every paragraph before the quote is the
 *   headline (international-activities testimonial)
 *   text-over-image — executive quote set over the portrait photo from 720 up: the caption
 *   (name, role) sits above the quote inside the overlay, no shadowed caption box
 */

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

const isMedia = (n) => !!n.querySelector('picture, img') && !n.textContent.trim();

/** join the preceding columns block as its next column */
function adopt(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('columns-wrapper')) return;
  const columns = prev.querySelector('.columns');
  const row = columns && columns.querySelector(':scope > .container > .row');
  if (!row) return;
  const n = row.children.length;
  const col = el('div', 'columns-col');
  col.append(wrapper);
  row.append(col);
  columns.classList.replace(`columns-${n}-cols`, `columns-${n + 1}-cols`);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .testimonial-media')) return;
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const mediaNode = nodes.find(isMedia);
  const rest = nodes.filter((n) => n !== mediaNode);
  const quoteNode = rest.find((n) => n.tagName === 'BLOCKQUOTE') || rest[rest.length - 1];
  const texts = rest.filter((n) => n !== quoteNode);

  const figure = el('figure', 'testimonial-media');
  figure.append(el('div', 'testimonial-overlay'));
  if (mediaNode) {
    const link = mediaNode.querySelector('a');
    const image = el('div', 'testimonial-image');
    image.append(mediaNode);
    if (link) block.classList.add('has-link');
    figure.append(image);
  }
  // variant no-caption: no meta caption under the image — every text above the quote is headline
  const noCaption = block.classList.contains('no-caption');
  const caption = el('figcaption', 'testimonial-meta meta');
  if (texts[0] && !noCaption) caption.append(texts[0]);
  if (!noCaption) figure.append(caption);

  const quote = el('div', 'testimonial-quote');
  const headline = el('div', 'testimonial-headline body');
  texts.slice(noCaption ? 0 : 1).forEach((t) => headline.append(t));
  const text = el('div', 'testimonial-text');
  if (quoteNode) text.append(quoteNode);
  if (block.classList.contains('text-over-image') && caption.children.length) {
    const byline = el('div', 'testimonial-byline meta');
    byline.append(...caption.childNodes);
    caption.remove();
    quote.append(byline);
  }
  if (headline.children.length) quote.append(headline);
  quote.append(text);

  // default look (source pull quote beside an image column): the quote comes first and repeats
  // the caption as its author line, the image + figcaption sit in the right-hand column
  const pullQuote = !noCaption && !block.classList.contains('text-over-image');
  if (pullQuote && caption.textContent.trim()) {
    const author = el('p', 'testimonial-author');
    author.textContent = caption.textContent.trim();
    author.setAttribute('aria-hidden', 'true');
    text.append(author);
  }
  if (pullQuote) block.replaceChildren(quote, figure);
  else block.replaceChildren(figure, quote);
  adopt(block);
}
