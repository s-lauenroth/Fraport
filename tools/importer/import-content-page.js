/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import stickyPatchParser from './parsers/sticky-patch.js';
import anchorListParser from './parsers/anchor-list.js';
import accordionParser from './parsers/accordion.js';
import columnsSidebarParser from './parsers/columns-sidebar.js';
import ctaParser from './parsers/cta.js';
import cardsParser from './parsers/cards.js';
import sectionTitleParser from './parsers/section-title.js';
import fraportCleanupTransformer from './transformers/fraport-cleanup.js';
import fraportSectionsTransformer from './transformers/fraport-sections.js';

const PAGE_TEMPLATE = {
  "name": "content-page",
  "description": "Page that opens with a side-by-side text and media layout",
  "urls": [
    "https://www.fraport.com/de/konzern/regionales-engagement/sponsoring-und-spenden.html",
    "https://www.fraport.com/de/newsroom/ansprechpartner.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/17-corona-faelle-auf-terminal-3-baustelle.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--pauschale-quarantaene-anordnung-statt-tests.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/vermarktung-von-erweiterungsflaechen-in-der-cargocity-sued-am-fl.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/reisen-waehrend-der-pandemie---sorgfaeltige-vorbereitung-ist-une.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-17.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-27.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-erneut-ausser-betrieb.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie0.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/flughafen-frankfurt-nach-aktion-von-klimaaktivisten-seit-7-50-uh.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/naechtlicher-teilstromausfall-im-terminal-1-am-flughafen-frankfu.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-10.html",
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/wechsel-an-der-spitze-der-fraport-unternehmenskommunikation.html"
  ],
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "frach-m-breadcrumb-navigation"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/konzern/regionales-engagement/sponsoring-und-spenden.html": [
          "#content-72d1e2a24e > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/ansprechpartner.html": [
          "#content-789aec2521 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/17-corona-faelle-auf-terminal-3-baustelle.html": [
          "#press-4a0330b078 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--pauschale-quarantaene-anordnung-statt-tests.html": [
          "#press-6a30c9877c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/vermarktung-von-erweiterungsflaechen-in-der-cargocity-sued-am-fl.html": [
          "#press-041f369c3c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/reisen-waehrend-der-pandemie---sorgfaeltige-vorbereitung-ist-une.html": [
          "#press-2824ada07b > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-17.html": [
          "#press-b40ad09133 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-27.html": [
          "#press-fcf627c9d6 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-erneut-ausser-betrieb.html": [
          "#press-80ec29be9c > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie0.html": [
          "#press-13308f5d6f > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/flughafen-frankfurt-nach-aktion-von-klimaaktivisten-seit-7-50-uh.html": [
          "#press-10f319eced > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/naechtlicher-teilstromausfall-im-terminal-1-am-flughafen-frankfu.html": [
          "#press-06914e8847 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-10.html": [
          "#press-ba7ee2be86 > div.frach-m-page > frach-m-breadcrumb-navigation"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/wechsel-an-der-spitze-der-fraport-unternehmenskommunikation.html": [
          "#press-b1ee23afc8 > div.frach-m-page > frach-m-breadcrumb-navigation"
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
      "name": "accordion",
      "instances": [
        "#main-content frach-m-accordion"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/konzern/regionales-engagement/sponsoring-und-spenden.html": [
          "#accordion-3230cd034d > div:nth-child(1)",
          "#accordion-3230cd034d > div:nth-child(2)",
          "#accordion-3230cd034d > div:nth-child(3)",
          "#accordion-3230cd034d > div:nth-child(4)",
          "#accordion-3230cd034d > div:nth-child(5)",
          "#accordion-3230cd034d > div:nth-child(6)"
        ],
        "https://www.fraport.com/de/newsroom/ansprechpartner.html": [
          "#accordion-2b3d972111 > div:nth-child(1)",
          "#accordion-2b3d972111 > div:nth-child(2)",
          "#accordion-2b3d972111 > div:nth-child(3)"
        ]
      }
    },
    {
      "name": "columns-sidebar",
      "instances": [
        "#main-content .frach-grid-row:has(> .frach-grid-col-mq3-8 + .frach-grid-col-mq3-4 .frach-m-download-list)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/17-corona-faelle-auf-terminal-3-baustelle.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--pauschale-quarantaene-anordnung-statt-tests.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/vermarktung-von-erweiterungsflaechen-in-der-cargocity-sued-am-fl.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/reisen-waehrend-der-pandemie---sorgfaeltige-vorbereitung-ist-une.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-17.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-27.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-erneut-ausser-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie0.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/flughafen-frankfurt-nach-aktion-von-klimaaktivisten-seit-7-50-uh.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/naechtlicher-teilstromausfall-im-terminal-1-am-flughafen-frankfu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-10.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/wechsel-an-der-spitze-der-fraport-unternehmenskommunikation.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
        ]
      }
    },
    {
      "name": "cta",
      "instances": [
        "#main-content .frach-m-cta"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/konzern/regionales-engagement/sponsoring-und-spenden.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/ansprechpartner.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1)"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/17-corona-faelle-auf-terminal-3-baustelle.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--pauschale-quarantaene-anordnung-statt-tests.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/vermarktung-von-erweiterungsflaechen-in-der-cargocity-sued-am-fl.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/reisen-waehrend-der-pandemie---sorgfaeltige-vorbereitung-ist-une.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-17.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-27.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-erneut-ausser-betrieb.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie0.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/flughafen-frankfurt-nach-aktion-von-klimaaktivisten-seit-7-50-uh.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/naechtlicher-teilstromausfall-im-terminal-1-am-flughafen-frankfu.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-10.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ],
        "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/wechsel-an-der-spitze-der-fraport-unternehmenskommunikation.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
        ]
      }
    },
    {
      "name": "cards",
      "instances": [
        "#main-content .frach-grid-row:has(> .frach-grid-col-mq3-4 + .frach-grid-col-mq3-4 + .frach-grid-col-mq3-4 frach-m-image)"
      ],
      "pageInstances": {
        "https://www.fraport.com/de/newsroom/ansprechpartner.html": [
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)",
          "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
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
      "blocks": [],
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
        "accordion",
        "columns-sidebar",
        "cta",
        "cards",
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
    },
    {
      "id": "page-end",
      "name": "Trailing section after main",
      "selector": [
        "#main-content > div.root.responsivegrid > div.aem-Grid > div.responsivegrid ~ section.frach-h-component-margin"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": []
    }
  ],
  "pageCleanup": {
    "https://www.fraport.com/de/konzern/regionales-engagement/sponsoring-und-spenden.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3e8e3bc3f7-notification-overlay",
      "#content-72d1e2a24e > frach-m-media-lightbox:nth-child(9)",
      "#content-72d1e2a24e > frach-m-media-lightbox:nth-child(9)"
    ],
    "https://www.fraport.com/de/newsroom/ansprechpartner.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-fa79ea6c52-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/17-corona-faelle-auf-terminal-3-baustelle.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-27cc148783-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--pauschale-quarantaene-anordnung-statt-tests.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-db0d85e784-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/vermarktung-von-erweiterungsflaechen-in-der-cargocity-sued-am-fl.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-34db566403-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/reisen-waehrend-der-pandemie---sorgfaeltige-vorbereitung-ist-une.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-d59711677b-notification-overlay",
      "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-17.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-dc285fde76-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-27.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-b49e682938-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-erneut-ausser-betrieb.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9a272bd51a-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie0.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9f901941e3-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/flughafen-frankfurt-nach-aktion-von-klimaaktivisten-seit-7-50-uh.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-3dc5b320ea-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/naechtlicher-teilstromausfall-im-terminal-1-am-flughafen-frankfu.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-1950aa81a5-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-10.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-0046f6a812-notification-overlay"
    ],
    "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/wechsel-an-der-spitze-der-fraport-unternehmenskommunikation.html": [
      "#usercentrics-cmp",
      "#usercentrics-root",
      "#metaNavigation-9f13402406-notification-overlay"
    ]
  }
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'sticky-patch': stickyPatchParser,
  'anchor-list': anchorListParser,
  'accordion': accordionParser,
  'columns-sidebar': columnsSidebarParser,
  'cta': ctaParser,
  'cards': cardsParser,
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
