<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-19T16:29:52.252Z · input stardust/current/_dynamics.json (8 pages, 63 findings) · target probe https://main--340a2135--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-adobedatalayer | A | CMS / app settings object adobeDataLayer | 8/8 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | a-unknown-third-party-host-charts3-equitystory-com | A | unknown third-party host charts3.equitystory.com | 2/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-app-walls-io | A | unknown third-party host app.walls.io | 1/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-jnn-pa-googleapis-com | A | unknown third-party host jnn-pa.googleapis.com | 1/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | cr-client-rendered-slot-frach-h-component-margin-frach-js-re | CR | client-rendered slot frach-h-component-margin frach-js-refresh-root aem-GridColumn | 7/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 6 | cr-client-rendered-slot-frach-h-component-margin-frach-m-tex | CR | client-rendered slot frach-h-component-margin frach-m-text frach-js-refresh-root | 6/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 7 | cr-client-rendered-slot-frach-m-slider-slides-frach-js-slide | CR | client-rendered slot frach-m-slider__slides frach-js-slider__slides | 4/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 8 | cr-client-rendered-slot-frach-m-slider-slide-frach-js-slider | CR | client-rendered slot frach-m-slider__slide frach-js-slider__slide | 4/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 9 | cr-client-rendered-slot-frach-m-slider-slide-frach-js-slider | CR | client-rendered slot frach-m-slider__slide frach-js-slider__slide frach-state-invisible | 3/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 10 | cr-client-rendered-slot-frach-m-slider-controls-frach-js-sli | CR | client-rendered slot frach-m-slider__controls frach-js-slider__controls | 3/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 11 | cr-client-rendered-slot-frach-h-component-margin-frach-js-re | CR | client-rendered slot frach-h-component-margin frach-js-refresh-root section | 2/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 12 | cr-client-rendered-slot-frach-m-image-link-frach-js-image-ga | CR | client-rendered slot frach-m-image__link frach-js-image__gallery-overlay-opener | 1/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 13 | cr-client-rendered-slot-frach-m-image-link-frach-js-image-ov | CR | client-rendered slot frach-m-image__link frach-js-image__overlay-opener | 1/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 14 | cr-client-rendered-slot-frach-h-component-margin-frach-js-re | CR | client-rendered slot frach-h-component-margin frach-js-refresh-root | 1/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 15 | cr-client-rendered-slot-frach-e-button-frach-e-button-icon-o | CR | client-rendered slot frach-e-button frach-e-button--icon-only frach-e-button--tertiary | 1/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 16 | d-first-party-data-file-get-darksite-alerts-de-json | D | first-party data file GET /darksite-alerts/de.json | 8/8 (reach 25/25) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 17 | d-first-party-data-file-get-traffic-alerts-de-json | D | first-party data file GET /traffic-alerts/de.json | 8/8 (reach 25/25) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 18 | d-first-party-data-file-get-passenger-alerts-de-json | D | first-party data file GET /passenger-alerts/de.json | 8/8 (reach 25/25) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 19 | d-first-party-data-file-get-de-jcr-content-fra-model-json | D | first-party data file GET /de/_jcr_content.fra_model.json | 1/8 (reach 2/25) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 20 | d-first-party-data-file-get-de-konzern-jcr-content-fra-model | D | first-party data file GET /de/konzern/_jcr_content.fra_model.json | 1/8 (reach 1/25) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 21 | d-first-party-data-file-get-de-konzern-konzernstrategie-jcr- | D | first-party data file GET /de/konzern/konzernstrategie/_jcr_content.fra_model.json | 1/8 (reach 1/25) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 22 | d-first-party-data-file-get-de-geschaeftsfelder-service-jcr- | D | first-party data file GET /de/geschaeftsfelder/service/_jcr_content.fra_model.json | 1/8 (reach 1/25) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 23 | d-first-party-data-file-get-de-newsroom-jcr-content-fra-mode | D | first-party data file GET /de/newsroom/_jcr_content.fra_model.json | 1/8 (reach 1/25) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 24 | d-first-party-data-file-get-de-investoren-publikationen-term | D | first-party data file GET /de/investoren/publikationen-termine/_jcr_content.fra_model.json | 1/8 (reach 1/25) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 25 | d-first-party-data-file-get-de-newsroom-pressemitteilung-jcr | D | first-party data file GET /de/newsroom/pressemitteilung/_jcr_content.fra_model.json | 1/8 (reach 1/25) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 26 | d-first-party-data-file-get-de-newsroom-ansprechpartner-jcr- | D | first-party data file GET /de/newsroom/ansprechpartner/_jcr_content.fra_model.json | 1/8 (reach 1/25) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 27 | i18n-locale-variants-en-en-en-en-en | I18N | locale variants en,en,en,en,en | 8/8 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 28 | l-listing-candidate-frach-m-slider-slides-frach-js-slider-sl | L | listing candidate frach-m-slider__slides frach-js-slider__slides (12 cards) | 5/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 29 | l-listing-candidate-frach-m-slider-slides-frach-js-slider-sl | L | listing candidate frach-m-slider__slides frach-js-slider__slides (6 cards) | 2/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 30 | l-listing-candidate-frach-grid-row-3-cards | L | listing candidate frach-grid-row (3 cards) | 2/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 31 | l-listing-candidate-aem-grid-aem-grid-12-5-cards | L | listing candidate aem-Grid aem-Grid--12 (5 cards) | 2/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 32 | l-listing-candidate-frach-m-slider-slides-frach-js-slider-sl | L | listing candidate frach-m-slider__slides frach-js-slider__slides (11 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 33 | l-listing-candidate-frach-m-image-gallery-tiles-container-fr | L | listing candidate frach-m-image-gallery-tiles__container frach-grid-col-mq1-12 (9 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 34 | l-listing-candidate-aem-grid-aem-grid-12-7-cards | L | listing candidate aem-Grid aem-Grid--12 (7 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 35 | l-listing-candidate-ul-26-cards | L | listing candidate ul (26 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 36 | l-listing-candidate-ul-25-cards | L | listing candidate ul (25 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 37 | l-listing-candidate-aem-grid-aem-grid-12-6-cards | L | listing candidate aem-Grid aem-Grid--12 (6 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 38 | l-listing-candidate-ul-3-cards | L | listing candidate ul (3 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 39 | l-listing-candidate-aem-grid-aem-grid-12-3-cards | L | listing candidate aem-Grid aem-Grid--12 (3 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 40 | l-listing-candidate-frach-m-search-results-results-container | L | listing candidate frach-m-search-results__results-container (21 cards) | 1/8 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 41 | m-modal-trigger-aria-haspopup-button-content | M | modal trigger aria-haspopup → button:content | 8/8 (reach 217/25) | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 42 | m-modal-trigger-frach-js-image-gallery-overlay-opener-target | M | modal trigger frach-js-image__gallery-overlay-opener → target outside DOM at capture | 1/8 | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 43 | m-modal-trigger-frach-js-image-overlay-opener-target-outside | M | modal trigger frach-js-image__overlay-opener → target outside DOM at capture | 1/8 | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 44 | s-site-search-form-de-search-html | S | site search form → /de/search.html | 8/8 (reach 2/25) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 45 | s-site-search-form-de-newsroom-pressemitteilung-html | S | site search form → /de/newsroom/pressemitteilung.html | 1/8 (reach 2/25) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 46 | t-consent-usercentrics | T | consent: Usercentrics | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 47 | t-unknown-third-party-host-www-frankfurt-airport-com | T | unknown third-party host www.frankfurt-airport.com | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 48 | t-tag-manager-adobe-launch | T | tag manager: Adobe Launch | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 49 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 50 | t-analytics-adobe-analytics-experience-cloud-id-first-party- | T | analytics: Adobe Analytics / Experience Cloud ID (first-party subdomain — needs a CNAME on the new host) | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 51 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 52 | t-unknown-third-party-host-my-walls-io | T | unknown third-party host my.walls.io | 1/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 53 | t-unknown-third-party-host-cdn-walls-io | T | unknown third-party host cdn.walls.io | 1/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 54 | t-unknown-third-party-host-fonts-cdn-walls-io | T | unknown third-party host fonts-cdn.walls.io | 1/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 55 | t-unknown-third-party-host-mtm-walls-io | T | unknown third-party host mtm.walls.io | 1/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 56 | t-unknown-third-party-host-www-google-com | T | unknown third-party host www.google.com | 1/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 57 | t-unknown-third-party-host-img-li-cdn-walls-io | T | unknown third-party host img-li-cdn.walls.io | 1/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 58 | t-unknown-third-party-host-img-ig-cdn-walls-io | T | unknown third-party host img-ig-cdn.walls.io | 1/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 59 | t-unknown-third-party-host-img-fb-cdn-walls-io | T | unknown third-party host img-fb-cdn.walls.io | 1/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 60 | t-unknown-third-party-host-d3pelj80y5v5k4-cloudfront-net | T | unknown third-party host d3pelj80y5v5k4.cloudfront.net | 1/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 61 | t-unknown-third-party-host-emoji-walls-io | T | unknown third-party host emoji.walls.io | 1/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 62 | t-unknown-third-party-host-scontent-fra3-1-xx-fbcdn-net | T | unknown third-party host scontent-fra3-1.xx.fbcdn.net | 1/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 63 | v-video-youtube | V | video: YouTube | 1/8 | embed-passthrough | content | self | pending | media-as-url | none (player ids are public) |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 29 row(s) — read-settings, settled-dom-snapshot, sheet-sync, modal-loader, search-index-backed, media-as-url.
- **One owner decision batch:** 34 row(s) — inspect the XHR, add a vendor row · scope of the locale trees · index-driven or editorially curated? · CMP domain script reuse on the new host · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 11 of 11 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/1 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 17
- **listings** — 13
- **capture** — 11
- **data** — 11
- **detect** — 4
- **interactive** — 3
- **search** — 2
- **locale wave** — 1
- **media** — 1
