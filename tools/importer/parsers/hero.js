/* eslint-disable */
/* global WebImporter */
import {
  makeImage, para, clean, absUrl, animatedNumber, pageLang,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for hero: frach-m-hero or its AEM section (key visual + ribbon h1), also the image-only white
 * topic-wall tile (frach-m-topicwall-1-by-4__white) the catalog maps to hero.
 *
 * Block contract (blocks/hero): one cell — the key visual picture and the page h1; a <br>
 * in the heading starts the next ribbon band (one band per source headline line).
 * Variants: `primary` / `secondary` when the ribbon uses that colour instead of the
 * default gradient (frach-h-bg--primary / --secondary on the headline); `ratio-21-9` for the
 * source frach-m-hero--21-9 key visual, `full-width` for frach-m-hero--full-width.
 */
export default function parse(element, { document, params }) {
  const root = element.matches('frach-m-hero, .frach-m-hero') ? element
    : (element.querySelector('frach-m-hero, .frach-m-hero') || element);

  const cell = [];
  const media = root.querySelector('.frach-m-hero__media, [class*="__image-container"]') || root;
  const img = makeImage(document, media);
  if (img) cell.push(para(document, img));

  const headline = root.querySelector('h1, .frach-e-headline');
  const variants = [];
  // the element may also be the media grid inside a frach-m-hero (article stage, whose page meta
  // data in the same hero is parsed as its own blocks): read the hero's classes then
  const heroEl = root.closest ? root.closest('frach-m-hero, .frach-m-hero') : null;
  const heroCls = heroEl ? (heroEl.getAttribute('class') || '') : '';
  if (/(^|\s)frach-m-hero--21-9(\s|$)/.test(heroCls)) variants.push('ratio-21-9');
  if (/(^|\s)frach-m-hero--full-width(\s|$)/.test(heroCls)) variants.push('full-width');
  let variant = '';
  if (headline && clean(headline.textContent)) {
    const h1 = document.createElement('h1');
    const lines = [...headline.querySelectorAll('.frach-e-headline__line')]
      .map((l) => clean(l.textContent)).filter(Boolean);
    (lines.length ? lines : [clean(headline.textContent)]).forEach((line, i) => {
      if (i) h1.append(document.createElement('br'));
      h1.append(document.createTextNode(line));
    });
    cell.push(h1);
    const cls = headline.className || '';
    if (/frach-h-bg--primary(\s|$)/.test(cls)) variant = 'primary';
    else if (/frach-h-bg--secondary(\s|$)/.test(cls)) variant = 'secondary';
  } else {
    // topic-wall tile mapped to hero: keep its heading / teaser link as content
    const content = root.querySelector('[class*="__content"]');
    if (content) {
      // also the key-figure tile: an animated number and its copy in a bare <span> (which the
      // importer may already have unwrapped into a loose text node of the content element)
      const loose = [...content.childNodes].filter((n) => (n.nodeType === 3 && clean(n.textContent))
        || (n.nodeType === 1 && n.matches('span') && !n.querySelector('h1, h2, h3, h4, h5, h6, p, a')));
      const wanted = [...content.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a[href], frach-e-animated-number'), ...loose]
        .sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1));
      wanted.forEach((n) => {
        if (n.nodeType === 1 && n.matches('a') && n.closest('p, h1, h2, h3, h4, h5, h6')) return;
        const text = n.nodeType === 1 && n.matches('frach-e-animated-number')
          ? animatedNumber(n, pageLang(document, params)) : clean(n.textContent);
        if (!text) return;
        if (/^H[1-6]$/.test(n.tagName)) {
          const h = document.createElement(n.tagName.toLowerCase());
          h.textContent = text;
          cell.push(h);
        } else if (n.tagName === 'A') {
          const a = document.createElement('a');
          a.setAttribute('href', absUrl(n.getAttribute('href')));
          a.textContent = text;
          cell.push(para(document, a));
        } else cell.push(para(document, document.createTextNode(text)));
      });
    }
  }

  if (variant) variants.unshift(variant);
  const name = variants.length ? `hero (${variants.join(', ')})` : 'hero';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: [[cell.length ? cell : '']] });
  element.replaceWith(block);
}
