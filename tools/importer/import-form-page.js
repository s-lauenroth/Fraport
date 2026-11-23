/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import stickyPatchParser from './parsers/sticky-patch.js';
import anchorListParser from './parsers/anchor-list.js';
import newsListParser from './parsers/news-list.js';
import formParser from './parsers/form.js';
import ctaParser from './parsers/cta.js';
import sectionTitleParser from './parsers/section-title.js';
import fraportCleanupTransformer from './transformers/fraport-cleanup.js';
import fraportSectionsTransformer from './transformers/fraport-sections.js';

const PAGE_TEMPLATE = {
  "name": "form-page",
  "description": "Page led by a form: application forms or filterable listing searches",
  "urls": [
    "https://www.fraport.com/de/deaktivierte-tests/tests/formulartest.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/ausweisantraege/online-antrag--auf-erteilung-eines-fahrzeugausweises.html",
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/ausweisantraege/online-antrag-auf-uebertragbare-fahrzeugausweise.html",
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/newsuebersicht.html",
    "https://www.fraport.com/de/newsroom/pressemitteilung.html",
    "https://www.fraport.com/de/newsroom/retailnews.html",
    "https://www.fraport.com/de/newsroom/servicenews.html"
  ],
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "frach-m-breadcrumb-navigation"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/deaktivierte-tests/tests/formulartest.html": [
          "#content-f14ad7918b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/ausweisantraege/online-antrag--auf-erteilung-eines-fahrzeugausweises.html": [
          "#content-f6e30fcb3f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/ausweisantraege/online-antrag-auf-uebertragbare-fahrzeugausweise.html": [
          "#content-ca844f72e7 > div.frach-m-page > frach-m-breadcrumb-navigation"
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
      "name": "news-list",
      "instances": [
        "#main-content .frach-m-search__results-page-wrapper"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/newsuebersicht.html": [
          "#main-content > div > div > section > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilung.html": [
          "#main-content > div > div > section > div"
        ],
        "https://www.fraport.com/de/newsroom/retailnews.html": [
          "#main-content > div > div > section > div"
        ],
        "https://www.fraport.com/de/newsroom/servicenews.html": [
          "#main-content > div > div > section > div"
        ]
      }
    },
    {
      "name": "form",
      "instances": [
        "#main-content .fraformsform"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/deaktivierte-tests/tests/formulartest.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/ausweisantraege/online-antrag--auf-erteilung-eines-fahrzeugausweises.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/ausweisantraege/online-antrag-auf-uebertragbare-fahrzeugausweise.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ]
      }
    },
    {
      "name": "cta",
      "instances": [
        "#main-content .frach-m-cta"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/newsroom/pressemitteilung.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
        ],
        "https://www.fraport.com/de/newsroom/servicenews.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
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
        "news-list"
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
        "news-list",
        "form",
        "cta",
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
    "https://www.fraport.com/de/deaktivierte-tests/tests/formulartest.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-7b2340a2a0-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/ausweisantraege/online-antrag--auf-erteilung-eines-fahrzeugausweises.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-29cc29413c-notification-overlay"
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/ausweisantraege/online-antrag-auf-uebertragbare-fahrzeugausweise.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-beeef000b6-notification-overlay"
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/newsuebersicht.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-8b75d85fd1-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilung.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9250a3d892-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/retailnews.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d29a5cf7ea-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/servicenews.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1f65d396dc-notification-overlay"
    ]
  }
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'sticky-patch': stickyPatchParser,
  'anchor-list': anchorListParser,
  'news-list': newsListParser,
  'form': formParser,
  'cta': ctaParser,
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
