/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import stickyPatchParser from './parsers/sticky-patch.js';
import anchorListParser from './parsers/anchor-list.js';
import heroParser from './parsers/hero.js';
import accordionParser from './parsers/accordion.js';
import keyFiguresParser from './parsers/key-figures.js';
import textMediaParser from './parsers/text-media.js';
import sectionTitleParser from './parsers/section-title.js';
import fraportCleanupTransformer from './transformers/fraport-cleanup.js';
import fraportSectionsTransformer from './transformers/fraport-sections.js';

const PAGE_TEMPLATE = {
  "name": "photo-story-page",
  "description": "Story page that opens with text over a full-bleed photo",
  "urls": [
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/home-of-cargo.html"
  ],
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "frach-m-breadcrumb-navigation"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/home-of-cargo.html": [
          "#content-292413ff0e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ]
      }
    },
    {
      "name": "sticky-patch",
      "instances": [
        "#main-content frach-e-sticky-patch"
      ]
    },
    {
      "name": "anchor-list",
      "instances": [
        "#main-content frach-m-anchor-list"
      ]
    },
    {
      "name": "hero",
      "instances": [
        "#main-content frach-m-hero",
        "#main-content frach-m-topicwall-1-by-4.frach-m-topicwall-1-by-4__white"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/home-of-cargo.html": [
          "#main-content > div > div > section"
        ]
      }
    },
    {
      "name": "accordion",
      "instances": [
        "#main-content frach-m-accordion"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/home-of-cargo.html": [
          "#accordion-19ab85f451 > div:nth-child(1)",
          "#accordion-19ab85f451 > div:nth-child(2)",
          "#accordion-19ab85f451 > div:nth-child(3)"
        ]
      }
    },
    {
      "name": "key-figures",
      "instances": [
        "#main-content frach-m-key-figures",
        "#main-content frach-m-pictogram-key-figures"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/home-of-cargo.html": [
          "#container-25b56c906b > section:nth-child(5)"
        ]
      }
    },
    {
      "name": "text-media",
      "instances": [
        "#main-content section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding:has(frach-m-image):has(.frach-m-text)",
        "#main-content frach-m-text-media:has(.frach-m-slider)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/home-of-cargo.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
          "#container-25b56c906b > section:nth-child(1)",
          "#container-25b56c906b > section:nth-child(4)"
        ]
      }
    },
    {
      "name": "section-title",
      "instances": [
        "#main-content .frach-m-section-title"
      ]
    }
  ],
  "sections": [
    {
      "id": "breadcrumb",
      "name": "Breadcrumb",
      "selector": [
        "frach-m-breadcrumb-navigation"
      ],
      "style": null,
      "blocks": [
        "breadcrumb"
      ],
      "defaultContent": []
    },
    {
      "id": "page-header-bar",
      "name": "Sticky page header bar",
      "selector": [
        "frach-m-sticky-page-header-container"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": []
    },
    {
      "id": "stage",
      "name": "Stage",
      "selector": [
        "#main-content > div.root.responsivegrid > div.aem-Grid > section.frach-h-component-margin"
      ],
      "style": null,
      "blocks": [
        "hero"
      ],
      "defaultContent": [
        ".frach-m-text"
      ]
    },
    {
      "id": "sticky-patch",
      "name": "Sticky patch",
      "selector": [
        "#main-content > div.root.responsivegrid > div.aem-Grid > div.stickyPatch"
      ],
      "style": null,
      "blocks": [
        "sticky-patch"
      ],
      "defaultContent": [
        "a"
      ]
    },
    {
      "id": "main",
      "name": "Main content",
      "selector": [
        "#main-content > div.root.responsivegrid > div.aem-Grid > div.responsivegrid"
      ],
      "style": null,
      "blocks": [
        "hero",
        "accordion",
        "key-figures",
        "text-media",
        "anchor-list",
        "section-title"
      ],
      "defaultContent": [
        "frach-m-text-media.frach-m-text-media--100",
        ".frach-m-text",
        "frach-m-image"
      ]
    },
    {
      "id": "chat-widget",
      "name": "Chat widget",
      "selector": [
        "#moin-ai-container"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": []
    }
  ],
  "pageCleanup": {
    "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/home-of-cargo.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-5fb39e5193-notification-overlay",
      "#content-292413ff0e > frach-m-media-lightbox:nth-child(9)",
      "#content-292413ff0e > frach-m-media-lightbox:nth-child(9)",
      "#content-292413ff0e > frach-m-media-lightbox:nth-child(9)",
      "#content-292413ff0e > frach-m-media-lightbox:nth-child(9)",
      "#content-292413ff0e > frach-m-media-lightbox:nth-child(9)",
      "#content-292413ff0e > frach-m-media-lightbox:nth-child(9)",
      "#content-292413ff0e > frach-m-media-lightbox:nth-child(9)",
      "#content-292413ff0e > frach-m-media-lightbox:nth-child(9)",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ]
  }
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'sticky-patch': stickyPatchParser,
  'anchor-list': anchorListParser,
  'hero': heroParser,
  'accordion': accordionParser,
  'key-figures': keyFiguresParser,
  'text-media': textMediaParser,
  'section-title': sectionTitleParser,
};
// Late transformers change the DOM (section <hr> markers, shared fragments), so their beforeTransform
// runs after block discovery.
const sectionTransformers = [fraportSectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
// Page corrections ({sitename}-page-corrections.js, when it exists) run last.
const correctionTransformers = [];
const transformers = [fraportCleanupTransformer, ...lateTransformers, ...correctionTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
// Catalog selectors (pageInstances, pageCleanup) count the <script> and <hr> elements the importer
// removes before transform, so a catalog template finds its targets in preprocess.
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; }
    catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  };
  template.blocks.forEach((blockDef) => {
    const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
    (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
  });
  template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
  return pageBlocks;
}

// Runs the early transformers, then marks each block and section target with an attribute: the
// importer re-creates the body before transform, so only attributes survive, not element references.
function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

export default {
  preprocess: (payload) => {
    if (CATALOG) markPageTargets(payload);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
