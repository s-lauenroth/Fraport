<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-19T16:22:04Z
  phase: 4-design-docs (--prep)
  describes: current site https://www.fraport.com (descriptive, not a target)
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/current/_vision-typing.json
    - stardust/current/assets/css/frach-app.min.css
    - stardust/current/pages/*.json, pages/*.html (25)
  synthesizedInputs: []
  stardustVersion: 0.41.0
-->
---
name: Fraport AG
description: Connecting the world with tomorrow — German corporate site of the Frankfurt airport operator (current state)
colors:
  fraport-blue: "#000091"
  blue-deep: "#000057"
  blue-focus: "#000074"
  blue-tint: "#d9d9ef"
  aubergine: "#6e156e"
  slate-text: "#697074"
  ink: "#000000"
  white: "#ffffff"
  band-grey: "#edeeef"
  rule-grey: "#ced1d3"
typography:
  display:
    fontFamily: "fraport-sans-semi-bold-italic, sans-serif"
    fontSize: "56px"
    fontWeight: 400
    lineHeight: "72px"
    letterSpacing: "normal"
  headline:
    fontFamily: "fraport-sans-semi-bold-italic, sans-serif"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: "56px"
    letterSpacing: "normal"
  title:
    fontFamily: "fraport-sans-semi-bold, sans-serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: "40px"
  subtitle:
    fontFamily: "fraport-sans-semi-bold, sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: "34px"
  teaser-title:
    fontFamily: "fraport-sans-semi-bold, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "30px"
  body:
    fontFamily: "fraport-sans-regular, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  caption:
    fontFamily: "fraport-sans-regular, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "18px"
rounded:
  sm: "4px"
  circle: "100%"
spacing:
  xs: "4px"
  sm: "8px"
  sm-plus: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.fraport-blue}"
    textColor: "{colors.white}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "12px"
  button-primary-hover:
    backgroundColor: "{colors.blue-deep}"
    textColor: "{colors.white}"
  button-primary-focus:
    backgroundColor: "{colors.blue-focus}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.fraport-blue}"
    rounded: "{rounded.sm}"
    padding: "12px"
  button-secondary-hover:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.blue-deep}"
  button-tertiary:
    textColor: "{colors.fraport-blue}"
    padding: "0"
  button-tertiary-hover:
    textColor: "{colors.blue-deep}"
  headline-box:
    backgroundColor: "{colors.fraport-blue}"
    textColor: "{colors.white}"
    typography: "{typography.headline}"
    padding: "8px 24px"
  tag:
    textColor: "{colors.fraport-blue}"
    rounded: "{rounded.sm}"
  input-search:
    rounded: "{rounded.sm}"
    padding: "15px 90px 15px 24px"
    height: "60px"
  card:
    backgroundColor: "{colors.white}"
    padding: "0 0 30px"
  section-band:
    backgroundColor: "{colors.band-grey}"
    padding: "64px 0 0"
---

# Design System: Fraport AG (current state)

## Overview

**Creative North Star: "The Departures Board in Corporate Blue"**

The live fraport.com reads as a disciplined corporate system built on one saturated, almost ultramarine blue and a single proprietary typeface family. Headlines do the branding: uppercase, semibold-italic Fraport Sans set line by line inside solid boxes of blue, aubergine, or a 135° blue-to-aubergine gradient, overlapping the lower-left corner of a wide airport photograph. Everything else stays quiet: white pages, slate-grey body copy, thin grey rules, and photography carrying the emotion.

Density is moderate and modular. Pages are stacks of AEM components (hero, section title, text-media, accordion, teaser slider) on a 12-column grid that widens in six steps up to a 1648px container. Sections are separated by fixed 32px/64px rhythm and by full-bleed grey bands rather than by cards or shadows. Interaction is restrained: buttons darken one ramp step, links underline, and images zoom gently inside their crops.

The system is token-driven. Full 050–900 ramps for blue, aubergine and grey are shipped as CSS custom properties, and components consume them.

**Key Characteristics:**
- One dominant brand blue for actions, links, headline boxes, the logo and the footer gradient.
- Aubergine is a secondary accent used for gradients, key-figure numbers and occasional headline boxes.
- Uppercase semibold-italic headline boxes are the signature typographic move.
- Square-cornered photography, with 4px radii reserved for controls.
- Flat surfaces: depth comes from grey bands and gradients, and shadows are rare.
- A white sticky header with a mega menu, and a gradient footer.

## Colors

A blue-dominant corporate palette with one aubergine accent and a cool grey ramp.

### Primary
- **Fraport Blue** (#000091): the brand. It fills primary buttons, colors every link and tertiary "Lesen" action, outlines tags and secondary buttons, fills headline boxes, and is the logo fill. It is also the start stop of the footer gradient.
- **Pressed Blue** (#000057): the hover state for primary and secondary buttons and links (primary-700).
- **Focus Blue** (#000074): the focus fill of primary buttons (primary-600).
- **Blue Tint** (#d9d9ef): the secondary-button hover wash and anchor-list hover (primary-050).

### Secondary
- **Aubergine** (#6e156e): the end stop of the 135° gradient on the footer and gradient headline boxes, the color of animated key-figure numbers, and the fill of the secondary headline box.

### Neutral
- **Slate Body Grey** (#697074): all running text (rich text, text-media leads, contact roles, section-title sublines).
- **Ink** (#000000): teaser and slider headlines only.
- **White** (#ffffff): page ground, sticky header, and text on blue/gradient boxes.
- **Band Grey** (#edeeef): full-bleed alternating section bands, and the mobile card ground.
- **Rule Grey** (#ced1d3): the header bottom rule and dividers.

### Named Rules
**The One Blue Rule.** Every interactive affordance is Fraport Blue at rest and Pressed Blue on hover. No other hue signals "clickable".

**The Gradient Belongs to the Brand Moments Rule.** The blue→aubergine gradient (135deg) appears only on brand surfaces: footer, hero headline box and section-title boxes. It never appears on buttons or cards.

## Typography

**Display Font:** Fraport Sans Semibold Italic (`fraport-sans-semi-bold-italic`, with sans-serif)
**Body Font:** Fraport Sans Regular (`fraport-sans-regular`, with sans-serif)
**Label Font:** Fraport Sans Semibold (`fraport-sans-semi-bold`) for buttons, nav and H4–H6

**Character:** This is a proprietary humanist-geometric corporate sans used in three faces. Weight lives in the face, never in `font-weight`: every rule declares 400 and switches family. The italic semibold gives headlines a forward-leaning, in-motion feel. Fraport Sans is a licensed corporate face (woff2 served from `/etc.clientlibs/fraport-company/clientlibs/frach-app/resources/fonts/FraportSans-*.woff2`). A full Roboto set is declared for an alternate `.frach-m-page--roboto` theme, but no crawled page uses it.

### Hierarchy
- **Display** (semibold italic, 56px / 72px at ≥960, 32px / 48px below): the hero H1, authored in uppercase and set in a gradient box.
- **Headline** (semibold italic, 40px / 56px at ≥960, 28px / 44px below): section titles in boxes, and text-media headlines in slate grey.
- **Title** (semibold, 28px / 40px; 24px / 34px mobile): H4 block titles.
- **Subtitle** (semibold, 24px / 34px; 20px / 30px mobile): H5 card titles.
- **Teaser title** (semibold, 20px / 30px; 18px / 26px mobile): H6 teaser and slider headlines, the most-used heading (333 instances).
- **Body** (regular, 16px / 24px, slate grey): rich text and teaser text.
- **Caption** (regular, 12px / 18px, #4f5457): figure captions.

The scale is ad-hoc (56→40→28→24→20, with ratios 1.40 / 1.43 / 1.17 / 1.20) and steps up once, at 960px.

### Named Rules
**The Face-Is-the-Weight Rule.** Emphasis is chosen by switching the Fraport Sans face (regular / semi-bold / semi-bold-italic), never with numeric `font-weight`.

**The Shout-in-a-Box Rule.** Uppercase is authored only in boxed display and section titles. Running headings stay sentence case.

## Layout

The layout is a 12-column flex grid (`.frach-grid` / `.frach-grid-row` / `.frach-grid-col-mqN-X`) with six tiers: mq1 0px, mq2 ≥480px, mq3 ≥720px, mq4 ≥960px, mq5 ≥1280px and mq6 ≥1440px. Gutters are 24px (12px each side) up to 1279px and 32px from 1280px. The container is fluid up to a max-width of 1648px at ≥1440px. The hero image spans 10 of 12 columns from 720px, offset right, and the H1 box straddles its bottom edge (translateY(-50%)).

Vertical rhythm comes from component margins: every component carries a 32px bottom margin (64px at ≥960). Grey bands add 32px/64px top padding. The spacing vocabulary is 4px-based: 16px and 12px dominate, then 24, 32, 8, 64 and 48. Teasers pad 24→48→64px as the viewport grows. Section titles indent 24px (≥960) / 32px (≥1280).

## Elevation & Depth

The system is flat by default. Depth comes from tonal layering: white versus grey bands, and the saturated gradient footer. Shadows are rare and soft, used as neutral grey halos rather than drop shadows.

### Shadow Vocabulary
- **Soft halo** (`box-shadow: rgb(181, 186, 189) 0px 0px 6px 0px`): investor and contact boxes and key-figure panels (48 elements).
- **Wide halo** (`box-shadow: rgb(181, 186, 189) 0px 0px 16px 0px`): link-box and quote panels on Konzern (11 elements).
- **Edge fade** (`box-shadow: rgb(255, 255, 255) -20px 0px 10px 10px`): a white mask at the slider-pagination edge on news listings.

### Named Rules
**The Halo-Not-Drop Rule.** When a panel needs lift, it gets an even grey halo with no offset. Directional drop shadows are absent.

## Shapes

The form language is rectangular. Photography, cards, teasers, bands and headline boxes are square-cornered. A small 4px radius (845 occurrences) is reserved for controls: buttons, tags, the search field and slider controls. Two exceptions exist. The site-wide sticky patch has a fully circular close button (100%), and text-media and gallery image overlays round only their top-left corner (4px 0 0). Lines are 1px Rule Grey dividers and 2px blue button borders.

## Components

### Buttons
- **Shape:** gently squared (4px), with 12px padding and a 2px border.
- **Primary:** Fraport Blue fill, white semibold label, used in CTA bands and the sticky-patch close button.
- **Hover / Focus:** hover darkens to Pressed Blue (fill and border). Focus fills Focus Blue and draws a 2px white underline inset 4px from the edges.
- **Secondary:** white fill, 2px blue border and blue label. Hover washes to Blue Tint, with Pressed Blue border and text.
- **Tertiary:** borderless blue text with a right arrow icon. This is the "Lesen" link on every teaser (810 instances). Hover turns it Pressed Blue and underlined.

### Chips
- **Style:** transparent ground, 1px blue border, blue text, 4px radius (`frach-e-tag`). They are used as filter and tag chips on search results and news listings.

### Cards / Containers
- **Corner Style:** square (0).
- **Background:** white (Band Grey on mobile inside grey bands).
- **Shadow Strategy:** none, per the Halo-Not-Drop Rule. Halos appear only on info panels.
- **Border:** none.
- **Internal Padding:** 30px bottom. The image is cropped 1:1 and zooms to 1.2 on hover.

### Inputs / Fields
- **Style:** 60px tall, 2px Slate Body Grey border, 4px radius, padding 15px 90px 15px 24px.
- **Focus:** on desktop the field collapses into the header search icon and expands on activation (max-width/opacity transition .2s).

### Navigation
- A white sticky header with a 1px Rule Grey bottom border. The blue SVG logo sits on the left. The main navigation (Startseite, Konzern, Geschäftsfelder, Investoren, Nachhaltigkeit, Newsroom, Suche) opens a mega menu with overview copy and teasers. A meta row carries notifications, search, the International site switcher, Karriere bei Fraport and DE/EN. Hovering a main-nav item grows a blue underline (width .2s ease-out). Breadcrumbs sit in small grey text with chevrons on interior pages.

### Headline Box (signature)
Uppercase semibold-italic white text set line by line inside padded boxes: 8px 16px, rising to 8px 24px at ≥960, and 16px 32px for the H1. The box comes in four variants: gradient (42 uses), Fraport Blue (29), Band Grey (25) and Aubergine (7). Lines fade in staggered (.3s, with .5s/1s delays).

### Teaser Slider (signature)
A horizontal carousel of teasers. Each teaser has a photo with hover zoom, an optional eyebrow, an Ink H6 headline link, slate text and a tertiary "Lesen" link, with prev/next buttons and dots. It is used as the quicklink strip under heroes and as the "NOCH MEHR FRAPORT" related strip above the footer on 19 of 25 pages.

### Footer
A full-width 135° Fraport Blue → Aubergine gradient with white text. It holds the contact block, Fraport Sites, the Service/legal links, Social Media (Frankfurt Airport, Frankfurt CargoHub) and the ©2004-2026 line.

## Do's and Don'ts

### Do:
- **Do** use Fraport Blue (#000091) for every action and link, and Pressed Blue (#000057) for hover.
- **Do** set display and section titles in uppercase semibold-italic Fraport Sans inside a blue, aubergine, gradient or grey box.
- **Do** keep body copy at 16px/24px in Slate Body Grey (#697074).
- **Do** separate sections with the 32px/64px component rhythm and full-bleed Band Grey (#edeeef) bands.
- **Do** keep photography square-cornered, and limit the 4px radius to controls.
- **Do** close content pages with the "NOCH MEHR FRAPORT" related teaser strip.

### Don't:
- **Don't** use numeric font-weight for emphasis. Switch the Fraport Sans face instead.
- **Don't** apply the blue→aubergine gradient to buttons or cards. It is reserved for the footer and headline boxes.
- **Don't** add directional drop shadows. Panels use the neutral grey halo only.
- **Don't** round images or cards.
