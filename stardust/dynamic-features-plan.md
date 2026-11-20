# Dynamic features plan — www.fraport.com

| phase | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| P0 static | every CR/L/D row as authored block rows (sliders, teasers, lists, accordions) | block tables per DESIGN modules | gate rows 1440/360 | — | in recreation |
| P1 runtime | lightbox/gallery/overlay modal loader, slider controls, accordion, header menus | block JS, no data | motion-observe parity per archetype | — | S |
| P2 embeds | YouTube, equitystory chart iframe, walls.io wall — same src | embed block with URL row | presence on published origin | consent gating with CMP (martech) | S |
| P3 search | header search widget over /query-index.json (helix-query.yaml) | widgets/search (no authored rows) | dynamics-check search-query over migrated corpus | — | M |
| P4 martech | scripts/martech.js from martech-contract.json, all parts disabled | contract edit + martech-scaffold.mjs | dynamics-check martech | enable CMP/Launch per host | S |
| P5 alerts | notification ticker reading alert feeds | runtime | — | feed exposure (host-bound) | interim: hidden |
