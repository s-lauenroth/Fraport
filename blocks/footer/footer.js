import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Fraport footer (frach-m-page-footer), template-slotted.
 * /footer document contract: one section per band, each carrying a Section Metadata `style`:
 *   contact (one section per column; the first heading is the accordion label),
 *   links (heading + list; one section per column), social (heading, then per group a
 *   sub-heading + paragraph of icon links), legal (copyright paragraph).
 * Authored nodes are MOVED into the template's empty slots, never copied.
 */

const DESKTOP = window.matchMedia('(width >= 960px)');

function el(tag, cls, ...children) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  e.append(...children);
  return e;
}

const chevron = () => {
  const s = el('span', 'icon icon-chevron-down footer-acc-icon');
  s.setAttribute('aria-hidden', 'true');
  return s;
};

/** accordion with the authored heading as its label */
function accordion(heading, cls) {
  const details = el('details', cls);
  const label = el('span', 'footer-acc-label');
  if (heading) label.append(heading);
  details.append(el('summary', '', label, chevron()));
  return details;
}

const content = (section) => section.querySelector('.default-content-wrapper') || section;

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  // the pipeline renders Section Metadata `style` as section classes; read a leftover table too
  sections.forEach((sec) => {
    sec.querySelectorAll('.section-metadata').forEach((md) => {
      [...md.children].forEach((row) => {
        if (row.children[0]?.textContent.trim().toLowerCase() === 'style') {
          row.children[1].textContent.split(',').forEach((v) => {
            const cls = v.trim().toLowerCase();
            if (cls) sec.classList.add(cls);
          });
        }
      });
      (md.closest('.section-metadata-wrapper') || md).remove();
    });
  });
  const byStyle = (style) => sections.filter((s) => s.classList.contains(style));

  const container = el('div', 'container');

  // contact accordion
  const contactSecs = byStyle('contact');
  if (contactSecs.length) {
    const heading = content(contactSecs[0]).querySelector('h1, h2, h3, h4, h5, h6');
    const acc = accordion(heading, 'footer-acc footer-contact');
    const cols = el('div', 'footer-contact-cols rte');
    contactSecs.forEach((sec) => {
      cols.append(el('div', 'footer-contact-col', ...content(sec).children));
    });
    acc.append(cols);
    container.append(acc);
  }

  // link-list columns + social
  const row = el('div', 'footer-row');
  const linkAccs = [];
  byStyle('links').forEach((sec) => {
    const wrap = content(sec);
    const heading = wrap.querySelector('h1, h2, h3, h4, h5, h6');
    const acc = accordion(heading, 'footer-acc footer-acc-links');
    acc.append(el('div', 'footer-links', ...wrap.children));
    linkAccs.push(acc);
    row.append(el('div', 'footer-col', acc));
  });

  const socialSec = byStyle('social')[0];
  if (socialSec) {
    const wrap = content(socialSec);
    const title = el('div', 'footer-social-title');
    const inner = el('div', 'footer-social-inner');
    let group = null;
    [...wrap.children].forEach((node) => {
      if (!title.childElementCount && /^H2$/.test(node.tagName)) {
        title.append(node);
      } else if (/^H[3-6]$/.test(node.tagName)) {
        group = el('div', 'footer-social-group', node);
        inner.append(group);
      } else {
        if (!group) {
          group = el('div', 'footer-social-group');
          inner.append(group);
        }
        group.append(node);
      }
    });
    row.append(el('div', 'footer-col footer-social', title, inner));
  }
  if (row.childElementCount) container.append(row);

  const legalSec = byStyle('legal')[0];
  if (legalSec) container.append(el('div', 'footer-copyright', ...content(legalSec).children));

  // link lists are open (and fixed) from 960px, accordions below
  const sync = () => linkAccs.forEach((acc) => { acc.open = DESKTOP.matches; });
  linkAccs.forEach((acc) => acc.querySelector('summary').addEventListener('click', (e) => {
    if (DESKTOP.matches) e.preventDefault();
  }));
  sync();
  DESKTOP.addEventListener('change', sync);

  block.textContent = '';
  block.append(container);
}
