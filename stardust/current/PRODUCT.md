<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-19T16:22:35Z
  phase: 4-product-doc (--prep)
  describes: current site https://www.fraport.com (descriptive; facts read from captured pages, not from an interview)
  readArtifacts:
    - stardust/current/pages/*.json (25: titles, descriptions, headings, ctas, body)
    - stardust/current/_brand-extraction.json
    - stardust/current/_vision-typing.json
    - stardust/current/_crawl-log.json
  synthesizedInputs: []
  stardustVersion: 0.41.0
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
These audiences are inferred from the site's own sections and copy. They are not confirmed with the owner.
- **Investors and analysts:** Investoren, Fraport-Aktie, Publikationen & Termine (share-price key figures, downloadable reports, the financial calendar).
- **Press and media:** Newsroom, Pressemitteilungen, Servicenews, Ansprechpartner (press contacts with phone and e-mail).
- **Business partners and B2B customers:** Geschäftsfelder (Betrieb, Service, International Activities / consulting), Retail & Advertising, Flughafenausweise.
- **Job seekers:** "Karriere bei Fraport", Jobbörse, "Fraport. Deine Welt der Möglichkeiten" (informal *Du* address).
- **The regional public and neighbours:** Regionales Engagement, Lärm und Luft, Umwelt und Klimaschutz, Sponsoring und Spenden.
- **Passengers** are explicitly redirected: "Ansprechpartner für Flugreisende sowie Auskünfte zu An- und Abflügen finden Sie auf der Reisehomepage" (home page).

## Product Purpose
This is the German-language corporate website of Fraport AG, owner and operator of Frankfurt Airport. It "zählt zu den weltweit führenden Unternehmen im Airport-Business und ist an 30 Flughäfen auf vier Kontinenten aktiv" (og:description, home). The site presents the group (Konzern, strategy Fraport.2030), its business segments, investor relations, sustainability reporting and a newsroom. It is an information and reputation surface, not a transactional product.

## Positioning
- **Claim:** "Connecting the world with tomorrow" (home, Konzernstrategie).
- The site positions Fraport as operator of "Deutschlands größtem Luftverkehrsdrehkreuz in Frankfurt" plus an international airport portfolio. The International meta-nav lists the portfolio sites: Bulgarien, Brasilien (Flughafen Fortaleza), Brasilien (Flughafen Porto Alegre), Hong Kong (China), Griechenland, Peru, Slowenien, Türkei and USA.

## Operating Context
- The site runs on Adobe Experience Manager. Components are `frach-m-*` / `frach-e-*` custom elements, from the clientlib `fraport-company/clientlibs/frach-app`.
- Usercentrics consent runs on every page (`_crawl-log.json#dynamicSurface`).
- Alert feeds (`/darksite-alerts`, `/passenger-alerts`, `/traffic-alerts` JSON) drive a header notification ticker.
- Two news listings (Pressemitteilung, Servicenews) render client-side search results with tag filters and load-more.
- The newsroom embeds consent-gated social and video content.
- A DE/EN language switch is present. Only the German locale was captured.

## Capabilities and Constraints
- **Captured page types (25 pages):** home (2: `/` redirects to `/de.html`), section-landing (4), content-page (7), card-overview (3), feature-hub (3), utility-detail (3), news-listing (2) and contact-directory (1). See `stardust/state.json`.
- **Module set:** 25 recurring module candidates. See `DESIGN.json#extensions.modules`.
- **Dynamic surfaces to preserve:** news search results, alert notifications, animated key figures (live share price on Investoren), and lightbox galleries.
- **Terminology:** Konzern, Geschäftsfelder, Investoren, Nachhaltigkeit, Newsroom, "Noch mehr Fraport" (related-content strip), "Lesen" (teaser action).
- **Open / undecided:** the scope of the English locale, the scope of the Roboto alternate theme (declared, unused), and the fate of the site-wide campaign patch.

## Brand Commitments
- **Name and logo:** "Fraport" wordmark, inline SVG in #000091 (`assets/logo.svg`).
- **Typeface:** Fraport Sans, a proprietary corporate face of the site owner. Its woff2 files are captured under `assets/fonts/FraportSans-*.woff2` for evaluation only. Redeployment needs the owner's licence.
- **Colors:** Fraport Blue #000091 with Aubergine #6e156e, shipped as `--frach-color-*` token ramps.
- **Claim:** "Connecting the world with tomorrow".
- **Voice:** formal *Sie* address in corporate, IR and press copy, and informal *Du* in careers copy. Copy is figure-led ("30 Flughäfen auf vier Kontinenten", "4,4 Milliarden Euro").

## Evidence on Hand
- **Real copy:** headings, body and CTAs for 25 pages (`stardust/current/pages/*.json`). Typed slots are in each page's `slots` key.
- **Photography:** 365 images referenced from `/content/dam/fraport-company/...` (list in `_brand-extraction.json#mediaInventory`). They are not downloaded. 87 carry a filename as alt text and 4 have empty alt.
- **Hero key visual:** keyv7.jpg ("Rollverkehr"), also used as the og:image.
- **Key figures, reports and contacts:** present on the Investoren, Publikationen & Termine and Ansprechpartner pages. They are named individuals' contact data and should be treated as content, not design.
- **Absent:** no customer testimonials beyond 2 quote modules, no pricing, no forms other than search.

## Product Principles
These are derived from observed site behaviour, not confirmed.
1. **Transparency for stakeholders:** IR and press content is complete, downloadable and dated.
2. **One group, many audiences:** a single IA routes investors, press, partners, job seekers and neighbours, and redirects passengers elsewhere.
3. **Brand through headline and image:** the claim and boxed headlines over airport photography carry the identity, and the chrome stays quiet.
