# Dynamics parity check — https://main--340a2135--aemcoder.aem.live — 2026-11-19T23:53:37.090Z

Replayed 15 checks over 16 features · pass 13 · fail 2. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| teaser / news slider (prev/next, pagination, show-more) | CR | done | dom-count | PASS | 11 × .teaser-slider .slider-slide (min 4) |  |
| teaser / news slider (prev/next, pagination, show-more) | CR | done | dom-count | PASS | 1 × .teaser-slider .slider-controls .slider-next (min 1) |  |
| teaser / news slider (prev/next, pagination, show-more) | CR | done | dom-count | PASS | 6 × .teaser-slider .slider-slide (min 3) |  |
| accordion (checkbox toggles, labelled regions) | CR | done | dom-count | PASS | 1 × .accordion .accordion-item input[aria-controls] (min 1) |  |
| accordion (checkbox toggles, labelled regions) | CR | done | dom-count | PASS | 3 × .accordion .accordion-panel[role=region] (min 2) |  |
| tabbed content (tablist, arrow-key navigation) | CR | done | dom-count | PASS | 5 × .tabbed-content [role=tab][aria-selected] (min 2) |  |
| image gallery tiles + lightbox overlay | M | done | click-dialog | FAIL | dialog 1440px · heading "1972 - Neues Terminal und Tiefbahnhof" · 0 fields · Escape closes: false |  |
| image gallery tiles + lightbox overlay | M | done | dom-count | PASS | 8 × .image-gallery-tiles .image-gallery-tiles-item .image-gallery-tiles-link[aria-haspopup] (min 8) |  |
| key figures count-up (in-view animation) | CR | done | dom-count | PASS | 3 × .key-figures .key-figures-number (min 3) |  |
| key figures count-up (in-view animation) | CR | done | dom-count | PASS | 1 × .pictogram-key-figures > * (min 1) |  |
| YouTube videos (nocookie embeds) | V | done | video-plays | FAIL | iframe/video: true · no <video> · playback requests 0 (none ok) · no playback request to googlevideo\.com with status < 400 (0 seen) | www.fraport.com:206×1 my.walls.io:200×1 fonts-cdn.walls.io:200×4 cdn.walls.io:200×8 mtm.walls.io:200×1 mtm.walls.io:204×1 app.walls.io:200×2 img-ig-cdn.walls.io:200×16 img-li-cdn.walls.io:200×6 img-fb-cdn.walls.io:200×12 emoji.walls.io:200×8 |
| walls.io social wall iframe | A | done | dom-count | PASS | 1 × .embed.wall iframe[src*='walls.io'] (min 1) | my.walls.io:200×1 www.fraport.com:206×1 fonts-cdn.walls.io:200×3 cdn.walls.io:200×8 mtm.walls.io:200×1 app.walls.io:200×2 mtm.walls.io:204×1 emoji.walls.io:200×24 img-li-cdn.walls.io:200×2 d3pelj80y5v5k4.cloudfront.net:200×1 img-ig-cdn.walls.io:200×10 img-fb-cdn.walls.io:200×6 |
| share-price chart iframe (charts3.equitystory.com) | A | done | dom-count | PASS | 1 × .iframe iframe[src*='charts3.equitystory.com'] (min 1) | charts3.equitystory.com:200×46 |
| all delivered pages run without uncaught exceptions | CR | done | no-page-errors | PASS | none on 25 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (1 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

- header site search (S) — interim · owner: decide whether to migrate the full corpus; then helix-query.yaml + /query-index.json + a search results page (plan P3)
- press-release / service-news search and result lists (L) — interim · owner: migrate the news corpus to make the lists index-backed
- traffic / passenger / darksite alert ticker (D) — interim · owner: expose the alert feeds cross-origin or as a sheet
- locale variants (en) (I18N) — interim · owner: English tree out of scope; language switch links to the source /en pages
- AEM model.json fetches, client-rendered slots, curated listings, data layer (D) — done
- Usercentrics CMP, Adobe Launch, Adobe Analytics, retargeting pixel (T) — scaffolded-awaiting-owner · owner: enable CMP / Launch per host (stardust/martech-handoff.md)
