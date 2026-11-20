## Extract — 25/25 pages captured live, 8 templates typed (2026-11-19)

- `crawl.mjs --pages <25 planned URLs> --dynamics --concurrency 3`: 25/25 captured, 0 failed, no bot wall; `/` redirects to `/de.html` (duplicate of `de`). Capture files renamed to the site-plan slugs (`_slug-map.json`).
- Images on this AEM site are `<frach-e-lazy-image>` custom elements, so the crawler's `media.imgs` is empty; the media inventory (365 images) was rebuilt from the rendered DOM.
- Style census 1440+360: 46/50 page-widths measured (4 navigation timeouts on slow pages).
- Fonts self-hosted from the source: Fraport Sans (proprietary — licensing alert at deploy) and Roboto v27 (Apache-2.0).
- Vision check: 23 ok, 2 suspect (fraport-aktie share chart iframe blank; service screenshot truncated, DOM complete).
- Page types (templates): home 2, section-landing 4, content-page 7, card-overview 3, feature-hub 3, utility-detail 3, news-listing 2, contact-directory 1.
- Track choice: first-page-first ran sequentially (home is the first archetype) instead of two parallel tracks, to stay inside the 3-browser budget.

## Preserve direction — spec promoted verbatim, register R-01, 63 dynamic rows triaged (2026-11-19)

- current/PRODUCT.md, DESIGN.md, DESIGN.json promoted verbatim to the root; direction.md records preserve mode.
- Register: one deferred entry (R-01, Fraport Sans proprietary face self-hosted) — no design delta.
- Dynamics: 63 findings on the 8 archetypes, every row has a disposition (static-snapshot / rebuild-native / embed-passthrough / index-backed / data-fed); decision batch recorded (tags+consent, alert feeds host-bound, news corpus out of scope, EN tree, font licence).
- Martech: spec-martech (Launch 38 rules, 34 data elements) → dynamics-plan --martech; Usercentrics CMP added to consent.cmp by hand (vendor table lacks its loader), all parts disabled; scaffold dry-run valid.

## Recreate — archetype roster consolidated to 5 (2026-11-19)

- Budget-driven consolidation of the page-type catalog (per-site catalog, state-machine § Page types): card-overview → section-landing; utility-detail and contact-directory → content-page (each page keeps `typeOrigin`). Archetypes: de (home), de-konzern (section-landing, 7 pages), de-konzern-konzernstrategie (content-page, 11 pages), de-newsroom (feature-hub, 3), de-newsroom-pressemitteilung (news-listing, 2). Modules only on merged siblings (download-list, contact-list, iframe embed) are built at sibling tier and proven by their published-origin gate rows.

## Source-fidelity gate — home archetype gated (2026-11-19)

- de 1440: 3 rounds, pixel 0.83 %, Δh 6 px, content-diff 0 🔴 / 2 🟡 (count-up key figures, nondeterministic live values), clip 0, overflow ok.
- de 360: 3 rounds, aligned 1.53 % but offsets 12 px > 8 px bound (CO₂ subscript line height) → accept-residual; Δh 8 px.
- cap-probe PASS; motion: slide-in panels, headline wipe, hero fade, header scroll morph, anchor-bar stick implemented.
- Canon created under stardust/prototypes/canon (fonts, canon, header, footer, 12 block CSS files); accepted.json records the key-figure/share-price acceptance.

## Source-fidelity gate — content-page archetype gated (2026-11-19)

- de-konzern-konzernstrategie 1440: pixel 0.39 %, Δh 6, content-diff 0/0, clip 0, overflow ok; 360: pixel 0.61 %, Δh 0, all bars met. cap-probe PASS. New blocks: accordion (CSS-only checkbox pattern, as source), image. Canon requests queued in stardust/replica/canon-requests.md.

## Source-fidelity gate — section-landing archetype gated (2026-11-19)

- de-konzern 1440: pixel 0.44 %, Δh 6, content-diff 0/0, clip 0, overflow ok; 360: aligned 0.83 %, Δh 0. cap-probe PASS. gate.sh exit 2 only on unit-geometry icon "missing" (CSS-mask icons vs inline svg) + chrome header-icon count → accept-residual. New blocks: breadcrumb, cards, link-box, testimonial, image-gallery-tiles (+JS lightbox). hero--21-9 queued in canon-requests.md.
- Session 1 ended at the runner's time boundary. Remaining archetypes: feature-hub (de-newsroom), news-listing (de-newsroom-pressemitteilung); then apply canon-requests and close recreate.

## Source-fidelity gate — news-listing archetype gated (2026-11-19)

- de-newsroom-pressemitteilung 1440: 3 rounds, aligned 0.48 %, Δh −13 at round 3 (−7 verbatim double line break in one card restored after the cap, measure.mjs 6088 vs 6082 → −6 shared footer residual) → accept-residual; content-diff 0/0, clip 0, overflow ok. 360: 2 rounds, 0.50 %, Δh 0; chrome-parity logo/footer deltas shared with earlier archetypes → accept-residual. cap-probe PASS.
- New block: news-list (+JS: tag slider, active tag, search reset). Client-side listing replicated as captured (21 items, 545 results); search/filter/load-more interim per dynamic-features rows 35/40/45. Source's untranslated sr labels kept verbatim.

## Source-fidelity gate — feature-hub archetype gated (2026-11-19)

- de-newsroom 1440: 4 rounds (one `extend`: chrome probe read the live header in its expanded sticky state), pixel 4.47 %, Δh 6, clip 0, overflow ok; content-diff round 3 0 🔴 / 6 🟡 (aria-labels, iframe titles — fixed, confirmed clean at 360). 360: 4 rounds, aligned 6.83 %, Δh 1, content-diff 0/0; y500–1000 band = anchor-list scroll-collapse timing. cap-probe PASS. Both → accept-residual.
- New blocks: newsroom-feed, embed (walls.io, youtube-nocookie), audio-player(+JS; 19.6 MB podcast mp3 to rehost at deploy), milestones(+JS), anchor-list-scroll.js. canon-requests.md gained anchor-list numbers/arrows, text-media 33-66/66-33, columns two-thirds/thirds, tight grey section — carried into the C0 foundation / block authoring rather than re-gating the prototypes.

## Recreate — 5/5 archetypes gated, prototype table written (2026-11-19)

- Prototype table (gate-all --stage prototype): 1440 pixel 0.26–4.35 %, Δh 6 on all 5; 360 four PASS, de aligned 1.53 % with 12 px offsets (accepted residual, see home gate). Full verdict FAIL (elements) on all 5 only through the unit-geometry probe: "missing" rows are inline-svg icons the prototypes draw as CSS masks (de-konzern residual) — to be resolved in block authoring at C-deliver (icons as inline svg / img), since the published gate counts the same criterion.

## Migrate plan — 5 archetypes first, 20 siblings in 6 render clusters (2026-11-19)

- Units in stardust/migrate/progress.json. Root `/` 301s to /de.html on the source; `index` is delivered as a home sibling (same content as de) so `/` answers.

## A-inventory — 25 pages, 5 archetypes to deliver first (2026-11-19)

- inventory.mjs: 25 in scope, 5 pending (archetypes), 20 content-pending; DA org aemcoder / site 340a2135 / ref main, live host main--340a2135--aemcoder.aem.live.

## B-block — 22 distinct blocks, one conversion each (2026-11-19)

- blocks.mjs / plan.mjs: 49 instances → 22 conversions. Convert order follows the plan: de (10 shared blocks) → de-konzern (breadcrumb, cards, link-box, testimonial, image-gallery-tiles) → de-konzern-konzernstrategie (accordion, image) and de-newsroom-pressemitteilung (news-list) → de-newsroom (newsroom-feed, embed, audio-player, milestones).

## B2-dynamic — fresh detect confirms the triage, martech scaffold shipped disabled (2026-11-19)

- dynamics-detect on the 5 archetypes (56 findings) vs the curated 63: two new rows added (nachhaltigkeit model.json → static-snapshot; aem-Grid 4 cards → authored rows). dynamics-plan --target-origin https://main--340a2135--aemcoder.aem.live --martech drafted to stardust/.work/dynamics.
- martech-scaffold: scripts/martech.js written, hooks in scripts.js / consented.js / consent-check.js; no CMP and 0 routes enabled (contract all-disabled, owner turns parts on).

## C-deliver unit foundation — styles, fonts, header/footer live (2026-11-19)

- 47 foundation files (styles, fonts, icons, header/footer blocks, runtime-contract), /nav + /footer published, /drafts/shell previewed. Chrome boxes = live at 1440/360. chrome-compare: 13 → 8 🔴; residual 6 control-missing are the source's noscript `<img>` text inside menu-control names (instrument reads it as text), 2 panel-visual are capture artifacts (source scrim + loading spinner; backdrop through transparent strip). Foundation frozen.

## C-deliver unit archetype-home — /de live, gate row passes at 1440 and 360 (2026-11-19)

- 11 blocks (hero, columns replaced; sticky-patch, teaser-slider, related-content, text-media, anchor-list, key-figures, section-title, tiles, cta). Gate on preview: 1440 1.78% Δh −74 px (header re-expand, one foundation request), 360 1.36% Δh 0; clip 0, presence 0, units pass after two targeted rounds (tile arrow + stock trend arrow as inline svg).

## C-deliver unit cluster-home — root page live as /index (2026-11-19)

- `index` (source root, capture resolved to /de.html) rendered as sibling of de, encoded with the forked home encoder; /index live, `/` 200 on .page and .live. Gate 1440 1.78% / 360 1.36%, clip/presence/units 0, no fix round.

## C-deliver foundation requests + unit archetype-section-landing — header jump fixed, /de/konzern passes (2026-11-19)

- Queued requests applied once with no unit running: header no longer re-expands at y<10 (−74 px offset step gone), `main` overflow clip moved to the anchor-list section only; chrome-compare unchanged (8), refrozen. Re-gate 1440: de 0.84%, index 0.84%, de-konzern 0.4%, pressemitteilung 0.23%, all Δh ≤ 4.
- archetype-section-landing done: 5 new blocks, 360 0.87% Δh 0, units pass.

## C-deliver unit archetype-news-listing — /de/newsroom/pressemitteilung passes at 1440 and 360 (2026-11-19)

- 360 units off 2 (result 18): the source's bullet is `span:not(:last-child):after` after a trailing space inside the span, so it can wrap with the date; ours carried the space inside the `::after`. Space moved into the part, bullet content `•`.
- Re-gate on preview: 1440 0.22% Δh 4, 360 0.59% Δh 4, clip 0, presence 0, units pass.

## C-deliver unit archetype-content-page — /de/konzern/konzernstrategie passes at 1440 and 360 (2026-11-19)

- New blocks `accordion` (CSS checkbox panels, as source) and `figure` (renamed from `image`: the DA model lint refuses that name); `text-media` gained left/right/half variants.
- Gate on preview: 1440 0.3% Δh 0, 360 0.7% Δh 0, clip 0, presence 0, units pass; no foundation requests.

## C-deliver unit cluster-news-listing — /de/newsroom/servicenews live (2026-11-19)

- Sibling of pressemitteilung (variance = result count only, no variant); rendered 1; gate 1440 0.32% / 360 0.77%, Δh 4, clip 0, presence 0, no fix rounds.

## C-deliver unit archetype-feature-hub — /de/newsroom passes at 1440 and 360 (2026-11-19)

- New blocks newsroom-feed, embed, audio-player, milestones; variants cards.dated, anchor-list.numbered, columns.two-thirds. Two fix rounds per width.
- Gate on preview: 1440 4.47% Δh 0, 360 6.8% Δh 0, clip 0, presence 0, units pass. Residuals: snapshot feed/cards, podcast mp3 stays on source host. Foundation request queued: embed URLs in block cells vs autoblocking (davids-model-lint 4 🔴).

## C-deliver unit cluster-content-page-1 — 5 content pages live (2026-11-19)

- nachhaltigkeit, ueber-uns, flughaefen, regionales-engagement, fraport-aktie: all pass both widths (worst 1440 0.95%, 360 3.54%), two fix rounds; new blocks `table`, `iframe`; variants on text-media, accordion, figure, hero. units.json families scoped to page lists.

## C-deliver unit cluster-section-landing — 6 section overview pages live (2026-11-19)

- geschaeftsfelder, betrieb, service, wertschaffung, managementsysteme (PDF icon as inline svg), investoren (new `contact-list`, reuses accordion): all pass both widths, worst 1440 0.65% / 360 2.16%. New blocks download-list, contact-list.

## C-deliver cluster-feature-hub in flight — 2/2 live, digitalisierung 1 px over the 1440 offset bound (2026-11-19)

- international-activities passes both widths; digitalisierung passes 360 (2.48%), 1440 pixel 2.18% but offsets 91 px vs bound 90 after 3 rounds. Unit left running with a resume note; content-page-2 (5 pages), gate-all and final remain.

## C-deliver unit cluster-feature-hub — digitalisierung passes after restoring the key-figures legend (2026-11-19)

- The 1440 offset overrun was a dropped legend line under the pictogram grid (found by measuring, not a spacing tweak). Block gained a legend row; page re-delivered; 1440 1.72 % / 360 2.06 % PASS. Feature-hub cluster 2/2 done.

## C-deliver unit cluster-content-page-2 — last 5 content pages live (2026-11-19)

- publikationen-termine, umwelt-und-klimaschutz, unternehmensfuehrung, ansprechpartner, herzensmomente: all pass both widths (worst 1440 0.63 %, 360 3.67 %), one fix round (contact-list globe icon, trailing break, address gap). herzensmomente delivered at `…/herzensmomente-fra` (EDS path normalisation) with a redirect row in stardust/redirects.tsv. 25/25 pages delivered.

## C-deliver unit gate-all — roster published-origin gate 25/25 at both widths (2026-11-19)

- gate-all --skip-existing over 25 pages: 1440 25 PASS (worst de-newsroom 4.47 %), 360 25 PASS (worst de-newsroom 6.8 %); 0 clip, 0 content, 0 units failures. update-coverage --gate: 25/25 matched, no flips. First roster attempt hit the 900 s run-bg cap; re-run with 3600 s.

## C-deliver unit final — C-deliver ends, 25/25 delivered and gated (2026-11-19)

- Foundation unchanged; the last queued request (embed auto-blocking) declined with reasons in foundation-requests.md. Rollout continues with D-site (redirects sheet incl. the herzensmomente path) through I-dashboard.

## D-site — sitemap, redirects sheet, root (2026-11-19)

- redirects.tsv: 25 rows (every source `.html` path → its extensionless EDS path; herzensmomente `--fra` → `-fra`, EDS path normalisation); published as `/redirects.json` (DA sheet, preview + live), 301s verified. `/` 200 (root `index` document). /nav and /footer published with noindex. Coverage row path of herzensmomente set to the delivered path; served sitemap 25 = assembled 25.

## D2-dynamic — dynamic parity on the published site (2026-11-19)

- stardust/dynamics/parity.json: 15 feature rows (9 with replayable checks, 6 recorded without: header search link-out to source search, press/news lists interim, alert ticker interim, en tree link-out, settled snapshots, martech scaffolded-awaiting-owner). No delivered page reads /query-index.json (header search submits to www.fraport.com/de/search.html), so no helix-query.yaml.
- dynamics-check on aem.live: 13/15 PASS; martech gate PASS (scripts/martech.js: cmp null, routes [] — every part disabled; no tag host requested). Preview replay 14/15.
- Fix (dd8ce90): image-gallery-tiles lightbox carried aria-modal=true while hidden, so a closed lightbox still read as an open modal (Escape check failed); aria-modal now set only while open. Code-only, no content re-publish.
- Check corrections: accordion on /de/investoren has 1 item (min 1); the international-activities gallery sits in a closed accordion in the #consulting tab, so a one-trigger click-dialog cannot reach it, replaced by an opener count.
- Residuals: (1) live edge still serves the pre-fix gallery JS for CORS module requests (Origin-keyed cached copy, max-age 7200; code sync and cache purge did not clear it); expires within 2 h. (2) YouTube video-plays FAILs because the probe stores at most 60 third-party responses and the walls.io wall on /de/newsroom fills all 60. An ad-hoc probe confirmed playback: googlevideo 200 x4, video playing, t=5.57 s.

## E-full-site — 25/25 verified on the published origin (2026-11-19)
- `update-coverage.mjs --gate` all-1440 + all-360: 25/25 rows matched, 0 flips; `verify.mjs --base https://main--340a2135--aemcoder.aem.live --all`: 25 verified, 0 failed.
- Headless render check (stardust/.work/verify/render-check.mjs) on each template's first page + archetypes: all 200, 0 page errors, every block `loaded`, 0 broken eager images, header + footer present. restoreAtDelivery: key-figures quote refreshes live (66,00 → 65,60 €), accordions toggle (konzernstrategie, fraport-aktie); international-activities accordions sit in inactive tab panels (height 0 by design, not a defect). No autoplay video / auto-advancing carousel entries to check.

## E2-link-audit — 141 links localized, every href checked live (2026-11-20)
- `localize-links.mjs` rewrote 141 absolute fraport.com links to in-set pages as root-relative across 16 pages (`--check` PASS); nav/footer already root-relative. 16 pages re-PUT → preview → live (deploy-batch, ledger `stardust/deploy/ledger-e2-links.json`).
- GET every distinct href on the published tree (781): 23 internal all 200; 696 external → 685 × 200. Residuals: 5 × 404 + 2 timeouts inherited verbatim from the source (anwohnerfragen, umwelt-und-klima/klimaschutz, relative www.datenschutz.fraport.de, fraport-usa.com/news, jobs terminal, terminal3, airportcarbonaccreditation), 401 (protected source PDF page), 403 (LinkedIn bot wall).
- Defect fixed: international-activities carried an empty `<a href=".../undefined.html">` where the source has only a named bookmark (`_Hlk…`, no href); removed, page re-published.
- 623 out-of-set fraport.com targets stay on the source: scope extension, decision in `stardust/direction.md`, list `stardust/rollout/e2-source-targets.txt`.

## F-optimize — health 100/100, no open findings (2026-11-20)
- `optimize.mjs --base https://main--340a2135--aemcoder.aem.live --all` (run-1): 25 pages + site checks, health 100 (seo 100 · ai 100 · xpage 100; a11y layer null), open P1 0 · P2 0 · P3 0. 33 source-parity items (27 P2 no JSON-LD, 6 P3) mirror the source — informational, not gated.

## G-aem — nothing to autofix (2026-11-20)
- `autofix-aem.mjs --project . --dry-run`: candidates 0 (no open fixable findings after F-optimize) — no edits, no re-deploy.

## H-report — summary written, blocks ledger closed (2026-11-20)
- `stardust/rollout/report.md`: 25/25 pages verified, 5 templates, 22 blocks verified (blocks ledger brought from pending to verified via `update-coverage.mjs --block`), gate 25/25 both widths, health 100. Three learnings appended to `stardust/learnings.md`.

## I-dashboard — rollout dashboard written, rollout complete (2026-11-20)
- `dashboard.mjs`: `stardust/rollout/dashboard/{index.html,data.json}` — 25 pages identified · prototyped · deployed (the optimised column counts fixed findings; there were none to fix).

## Handoff — run complete: 25/25 pages live and gated (2026-11-20)
- Rollout A–I ended (D3-multilingual not applicable: single locale de). done-check: complete, no gaps. state.json: 25/25 migrated (the 5 archetypes advanced approved → migrated after delivery).
- Published origin main--340a2135--aemcoder.aem.live; gate 25/25 at 1440 (worst 4.47 %) and 360 (worst 6.8 %); optimize health 100; martech carried over disabled for the owner to enable.
