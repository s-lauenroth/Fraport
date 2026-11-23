/* eslint-disable */
/* global WebImporter */
import { restoreIframes, styleButtons } from '../utils/fraport-parser-utils.js';
import videoPlayerParser from '../parsers/video-player.js';

/**
 * Fraport sections transformer.
 *
 * beforeTransform: walk template.sections in reverse and insert an <hr>
 * before every non-first section that matches (selectors tried in order;
 * sections with no match are skipped). Styled sections get their <hr>
 * marked with data-excat-section-id; a styled first section gets a
 * temporary marked <hr>.
 *
 * afterTransform: walk in reverse again and append a Section Metadata block
 * for styled sections after the marker (or surviving section element),
 * then remove markers, the first section's temporary <hr>, and any <hr>
 * that would open an empty section (e.g. before chrome removed by cleanup).
 */

const MARKER = 'data-excat-section-id';

function findSectionElement(document, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = document.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector, try next
    }
  }
  return null;
}

const CONTENT_TAGS = new Set(['IMG', 'PICTURE', 'VIDEO', 'IFRAME', 'TABLE', 'SVG', 'AUDIO', 'OBJECT', 'EMBED']);

function collapseEmptySections(document) {
  const body = document.body;
  if (!body) return;
  const walker = document.createTreeWalker(body, 1 | 4);
  const toRemove = [];
  let seenContent = false;
  let lastHr = null;
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === 3) {
      if (node.textContent.trim()) seenContent = true;
    } else if (node.tagName === 'HR') {
      if (!seenContent) toRemove.push(node);
      else lastHr = node;
      seenContent = false;
    } else if (CONTENT_TAGS.has(node.tagName.toUpperCase())) {
      seenContent = true;
    }
    node = walker.nextNode();
  }
  if (!seenContent && lastHr) toRemove.push(lastHr);
  toRemove.forEach((hr) => hr.remove());
}

/**
 * An image component whose figure plays an inline video (figure.frach-m-image__inline-video-
 * container > frach-e-lazy-video) outside every block becomes a video-player
 * (autoplay-background) block in place; inside blocks the block's parser handles it.
 */
function inlineVideos(document, payload) {
  document.body.querySelectorAll('frach-m-image').forEach((comp) => {
    if (!comp.isConnected || !comp.querySelector('.frach-m-image__inline-video-container frach-e-lazy-video')) return;
    if (comp.closest('[data-excat-block]')) return;
    try {
      videoPlayerParser(comp, { document, params: (payload && payload.params) || {} });
    } catch (e) { /* keep as default content */ }
  });
}

/**
 * A text dialog in main (frach-m-media-lightbox / frach-m-overlay without slides, e.g. the
 * wallpaper pages' "Nutzungsbedingungen" that the download opens): its body is authored copy the
 * page refers to, but cleanup drops every overlay. Its body content (title + text) becomes default
 * content in place, or right after the block element that holds it; the gate chrome (consent
 * checkbox, "Zustimmen" button, close button) is dropped.
 */
function textDialogs(document) {
  document.body.querySelectorAll('frach-m-media-lightbox, .frach-m-overlay').forEach((dlg) => {
    if (!dlg.isConnected || dlg.matches('a') || dlg.parentElement.closest('frach-m-media-lightbox, .frach-m-overlay')) return;
    if (dlg.querySelector('.frach-m-slider__slide') || !dlg.closest('main, #main-content')) return;
    const body = dlg.querySelector('.frach-m-overlay__body') || dlg;
    body.querySelectorAll('.frach-m-overlay__footer, .frach-m-overlay__close-btn, button, form, input').forEach((n) => n.remove());
    if (!(body.textContent || '').trim() || !body.querySelector('p, h1, h2, h3, h4, h5, h6')) return;
    const box = document.createElement('div');
    box.append(...body.childNodes);
    let block = dlg.closest('[data-excat-block]');
    while (block && block.parentElement && block.parentElement.closest('[data-excat-block]')) {
      block = block.parentElement.closest('[data-excat-block]');
    }
    dlg.remove();
    if (block) block.after(box); else if (dlg.parentNode) dlg.replaceWith(box);
  });
}

/*
 * Grey component sections (source section.frach-h-bg--grey + frach-h-component-padding): the
 * band becomes its own section with Section Metadata `Style: grey` (styles.css paints
 * main > .section.grey). beforeTransform brackets every top-level grey band with marker <hr>s
 * (attributes / siblings only — catalog selectors are untouched, parsers still see the band);
 * afterTransform adds the metadata to every non-empty section between the markers, unless all
 * of that section's content sits in blocks that paint the grey band themselves.
 */
const GREY = 'data-excat-grey';

/** block (name, options) whose own CSS paints the grey band behind it */
const SELF_PAINTED = [
  ['tiles', 'alt'], ['columns', 'light'], ['columns', 'grey'], ['columns-sidebar', 'light'],
  ['columns-sidebar', 'light-2'], ['key-figures', 'light'], ['text-media', 'grey'],
];

function markGreyBands(document) {
  const bands = [...document.body.querySelectorAll('section.frach-h-bg--grey, div.frach-h-bg--grey')]
    .filter((el) => !el.parentElement.closest('.frach-h-bg--grey'))
    // inside an accordion panel / tab panel / another block: that block's content
    .filter((el) => !el.closest('.frach-m-accordion__section-inner, .frach-m-tabbed-content__panel, frach-m-tabbed-content'))
    .filter((el) => !(el.parentElement && el.parentElement.closest('[data-excat-block]')));
  bands.forEach((el, i) => {
    const start = document.createElement('hr');
    start.setAttribute(GREY, `start-${i}`);
    const end = document.createElement('hr');
    end.setAttribute(GREY, `end-${i}`);
    el.before(start);
    el.after(end);
  });
}

/** name and options of a block table (header "Text Media (image Left)" -> text-media, [image-left]) */
function blockInfo(table) {
  const first = table.querySelector('tr');
  const head = first ? first.textContent.replace(/\s+/g, ' ').trim() : '';
  const m = head.match(/^([^(]*)(?:\((.*)\))?$/) || ['', head, ''];
  const slug = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return { name: slug(m[1] || ''), options: (m[2] || '').split(',').map(slug).filter(Boolean) };
}

function selfPainted(table) {
  const { name, options } = blockInfo(table);
  if (name === 'testimonial') return !options.includes('no-caption') && !options.includes('text-over-image');
  return SELF_PAINTED.some(([n, o]) => n === name && options.includes(o));
}

function greySectionMetadata(document) {
  const body = document.body;
  const starts = [...body.querySelectorAll(`hr[${GREY}^="start-"]`)];
  starts.forEach((start) => {
    const id = start.getAttribute(GREY).slice(6);
    const end = body.querySelector(`hr[${GREY}="end-${id}"]`);
    if (!end) { start.removeAttribute(GREY); return; }
    // walk from start to end: split at <hr>, note whether each part has content outside
    // self-painting blocks
    const walker = document.createTreeWalker(body, 1 | 4);
    walker.currentNode = start;
    const closers = [];
    let content = false;
    let plain = false;
    let node = walker.nextNode();
    while (node && node !== end) {
      if (node.nodeType === 1 && node.tagName === 'HR') {
        if (content && plain) closers.push(node);
        content = false;
        plain = false;
      } else {
        const isContent = node.nodeType === 3 ? !!node.textContent.trim()
          : /^(IMG|PICTURE|VIDEO|IFRAME|TABLE)$/.test(node.tagName);
        if (isContent) {
          content = true;
          const el = node.nodeType === 3 ? node.parentElement : node;
          let table = el && el.closest('table');
          while (table && table.parentElement && table.parentElement.closest('table')) table = table.parentElement.closest('table');
          if (!table || !selfPainted(table)) plain = true;
        }
      }
      node = walker.nextNode();
    }
    if (node === end && content && plain) closers.push(end);
    closers.forEach((hr) => {
      hr.before(WebImporter.Blocks.createBlock(document, { name: 'Section Metadata', cells: { style: 'grey' } }));
    });
    start.removeAttribute(GREY);
    end.removeAttribute(GREY);
  });
}

/*
 * Anchor-list targets: the anchor-list block scrolls to `main .section[data-id=ID]`, i.e. a
 * section whose Section Metadata carries `id`. beforeTransform marks each target of a source
 * frach-m-anchor-list (the element with that id; itself a block element or outside every block)
 * with an empty marker element right before it (it survives the target's parser replacing the
 * target); afterTransform turns each marker into a section break and gives that section the id
 * (added to the section's own Section Metadata when it already has one, e.g. a grey band).
 */
const ANCHOR = 'data-excat-anchor-id';

function markAnchorTargets(document) {
  const done = new Set();
  document.body.querySelectorAll('frach-m-anchor-list, .frach-m-anchor-list').forEach((list) => {
    list.querySelectorAll('a[href*="#"]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      let id = href.slice(href.indexOf('#') + 1);
      try { id = decodeURIComponent(id); } catch (e) { /* keep raw */ }
      if (!id) return;
      const target = document.getElementById(id);
      if (!target || target.contains(list) || list.contains(target)) return;
      if (done.has(id)) return;
      done.add(id);
      if (!target.closest('main, #main-content')) return;
      // a target inside a block opens no section (an accordion item, a tab panel), unless the
      // target starts the block element (a catalog selector naming the target's wrapper):
      // then the section starts before the block
      let at = target;
      const block = target.closest('[data-excat-block]');
      if (block && block !== target) {
        let n = target;
        while (n !== block && n.parentElement && n.parentElement.firstElementChild === n) n = n.parentElement;
        if (n !== block || block.parentElement.closest('[data-excat-block]')) return;
        at = block;
      }
      const marker = document.createElement('div');
      marker.setAttribute(ANCHOR, id);
      at.before(marker);
    });
  });
}

function isSectionMetadata(table) {
  const first = table.querySelector('tr');
  return !!first && /^section metadata$/i.test(first.textContent.replace(/\s+/g, ' ').trim());
}

function anchorSections(document) {
  // all breaks first, so each target's section ends at the next target
  const breaks = [...document.body.querySelectorAll(`[${ANCHOR}]`)].map((marker) => {
    const id = marker.getAttribute(ANCHOR);
    if (marker.closest('table')) { marker.remove(); return null; }
    const hr = document.createElement('hr');
    marker.replaceWith(hr);
    return { id, hr };
  }).filter(Boolean);
  breaks.forEach(({ id, hr }) => {
    // the new section runs to the next <hr> after some content (an <hr> right at the start,
    // e.g. a grey band's own break, is collapsed later)
    const walker = document.createTreeWalker(document.body, 1 | 4);
    walker.currentNode = hr;
    let content = false;
    let meta = null;
    let next = null;
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === 1 && node.tagName === 'HR' && !node.closest('table')) {
        if (content) { next = node; break; }
      } else if (node.nodeType === 1 && node.tagName === 'TABLE' && isSectionMetadata(node)) {
        meta = node;
        break;
      } else if (node.nodeType === 3 ? !!node.textContent.trim() : /^(IMG|PICTURE|VIDEO|IFRAME|TABLE)$/.test(node.tagName)) {
        content = true;
      }
      node = walker.nextNode();
    }
    if (meta) {
      const tr = document.createElement('tr');
      const k = document.createElement('td');
      k.textContent = 'id';
      const v = document.createElement('td');
      v.textContent = id;
      tr.append(k, v);
      (meta.querySelector('tbody') || meta).append(tr);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: 'Section Metadata', cells: { id } });
    if (next) next.before(block);
    else document.body.append(block);
  });
}

export default function transform(hookName, element, payload) {
  const document = (payload && payload.document) || element.ownerDocument;
  const template = payload && payload.template;
  const sections = (template && Array.isArray(template.sections)) ? template.sections : [];
  // This is the one transformer whose beforeTransform runs after the importer re-creates the body
  // and before the parsers: put back the iframes the importer dropped (recorded by cleanup), so
  // every parser sees them. Cleanup's afterTransform turns any left outside an embed into links.
  // Usercentrics re-blocks a restored iframe in the live page with a new consent placeholder
  // before the body is re-created, so drop placeholders here, before the parsers copy them.
  if (hookName === 'beforeTransform') {
    document.body.querySelectorAll('.uc-embedding-container').forEach((el) => el.remove());
    restoreIframes(document, document.body);
    textDialogs(document);
    inlineVideos(document, payload);
    // source buttons in default content (outside every block; parsers style their own):
    // <strong> primary, <em> secondary, <strong><em> tertiary, one button per paragraph
    styleButtons(document, document.body, {
      paragraph: true,
      skip: '[data-excat-block], nav, header, footer, frach-m-breadcrumb-navigation, frach-m-sticky-page-header-container, '
        + 'frach-m-page-header, frach-m-page-footer, frach-m-main-navigation, .frach-m-meta-navigation, form, .fraformsform',
    });
    markGreyBands(document);
    markAnchorTargets(document);
  }
  if (hookName === 'afterTransform') {
    greySectionMetadata(document);
    anchorSections(document);
  }
  if (sections.length < 2) return;

  if (hookName === 'beforeTransform') {
    // Only sections present on this page take part.
    const present = sections
      .map((section) => ({ section, el: findSectionElement(document, section) }))
      .filter((s) => s.el);

    for (let i = present.length - 1; i >= 0; i -= 1) {
      const { section, el } = present[i];
      if (!el.parentNode) continue;
      const isFirst = i === 0;
      if (isFirst && !section.style) continue;
      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(MARKER, section.id);
      if (isFirst) hr.setAttribute('data-excat-first-section', 'true');
      el.parentNode.insertBefore(hr, el);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      const marker = document.querySelector(`hr[${MARKER}="${section.id}"]`);
      const sectionEl = findSectionElement(document, section);
      const anchor = sectionEl || marker;
      if (!anchor || !anchor.parentNode) continue;

      const metaBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });

      if (sectionEl) {
        sectionEl.after(metaBlock);
      } else {
        // Section element replaced by a parser: place metadata before the next break.
        let next = marker.nextElementSibling;
        while (next && next.tagName !== 'HR') next = next.nextElementSibling;
        if (next) next.before(metaBlock);
        else marker.parentNode.appendChild(metaBlock);
      }
    }

    document.querySelectorAll(`hr[${MARKER}]`).forEach((hr) => hr.removeAttribute(MARKER));
    document.querySelectorAll('hr[data-excat-first-section]').forEach((hr) => hr.remove());

    collapseEmptySections(document);
  }
}
