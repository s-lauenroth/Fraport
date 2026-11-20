# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `www.fraport.com` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** none detected
- **Model `owner-decision`:** no evidence of consent gating inside the tag manager. Keep the source behaviour (route `category` null), or set a route `category` to a consent group id to load that tag manager only once the group is granted.
- **Categories:** no CMP configuration read — run `spec-martech.mjs` first, or decide categories with the owner.

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| adobe-launch | Adobe Launch | `https://assets.adobedtm.com/34277b32a8dd/29f6dec8c3a5/launch-c2a452ce0431.min.js` | — | false |

Also seen, not routed (loaded by the tag manager or inline on the source — confirm each still fires): consent: Usercentrics.

## Rewrite before go-live

These read the old URLs or DOM and will not match the migrated pages:
- rule `RL45c8a9d34bae4c108caedc59a3acf6af` Click Event | 50 => Sticky Patch Interactions => Send Analytics Beacon — selectors `frach-e-sticky-patch .frach-e-sticky-patch__open-button`, `frach-e-sticky-patch .frach-e-link`
- rule `RLcb998033a0d04e8cbb1d94e8253874ee` Click Event | 50 => Page Tree ~ wallpapers => Handle Wallpaper Interactions => Set Variables => Send Event Beacon — selectors `a[data-wallpaper]`, `div#agbbtn a.wallpaperbtn`, `a[data-aa-component]`

## Data layer

The source pages expose `adobeDataLayer`; keep the same global names.
Adobe Launch rules fire on data-layer pushes; the migrated pages must push the same events: `cmp:click` (8) · `cmp:link_click` (7) · `frach:accordeon-item-toggle` (1) · `frach:search-input-focus` (1) · `frach:video-play-progress-75` (1) · `frach:video-play-progress-50` (1) · `cmp:cta_click` (1) · `frach:search-filter-changed` (1) · `frach:search-results-loaded` (1) · `frach:quick-search-suggestions` (1) · `frach:video-play` (1) · `frach:search-suggestion-submit` (1) · `frach:video-play-progress-25` (1) · `frach:video-play-progress-100` (1) · `acdl_helper:loaded` (1) · `frach:slide-changed` (1) · `frach:quick-search-submit` (1) · `acdl_helper:page:load` (1) · `frach:quick-search-suggestion-submit` (1) · `frach:notification-overlay` (1).
Ask the owner for the tagging plan (solution design reference): each event, its payload and the interaction that pushes it. With it, add each push in the block that owns the interaction.

- rule `RL00da9c03e0a448ab83b48a5501307359` DataLayer Event | 50 => All Pages => Accordion Toggle => Set Variables => Send Event Beacon — listens for `frach:accordeon-item-toggle`
- rule `RL0207a3adf863450fbec05f7bf7778054` DataLayer Event | 50 => All Pages => Meta-Navigation Click => Set Variables => Send Event Beacon — listens for `cmp:link_click`, `cmp:click`
- rule `RL0bad9e40aaf147ae9c17d9b76379e5de` DataLayer Event | 50 => All Pages => Notification Click => Set Variables => Send Event Beacon — listens for `cmp:click`
- rule `RL0e94dac2545b47a899cb1160be2211fd` DataLayer Event | 50 => All Pages => Search Focus => Set Variables => Send Event Beacon — listens for `frach:search-input-focus`
- rule `RL0faaba2e137b4a52bb328e6a22797d53` DataLayer Event | 50 => All Pages => Video Play Progress 75 % => Set Variables => Send Event Beacon — listens for `frach:video-play-progress-75`
- rule `RL201606c7d79e40e3982d6ee66c07422f` DataLayer Event | 50 => All Pages => Video Play Progress 50 % => Set Variables => Send Event Beacon — listens for `frach:video-play-progress-50`
- rule `RL31fbf158e53f4ff0840fd6c8036d2417` DataLayer Event | 50 => All Pages => CTA Click => Set Variables => Send Event Beacon — listens for `cmp:cta_click`
- rule `RL3a8613c6ccf24e1a9348ca4264b21eb6` DataLayer Event | 50 => All Pages => Search Result Apply Filter => Set Variables => Send Event Beacon — listens for `frach:search-filter-changed`
- rule `RL44e8bab0ec8a4df98401aa7a315ac8a1` DataLayer Event | 50 => All Pages => Search Results => Set Variables => Send Event Beacon — listens for `frach:search-results-loaded`
- rule `RL46ab99357a0e4c53a0795f7a6716e077` DataLayer Event | 50 => All Pages => Quick Search Suggestions => Set Variables => Send Event Beacon — listens for `frach:quick-search-suggestions`
- rule `RL4a10b007cf8c4e51bb47242cf3c35285` DataLayer Event | 50 => All Pages => Video Play => Set Variables => Send Event Beacon — listens for `frach:video-play`
- rule `RL694fafb6aded4736ae267580704f0546` DataLayer Event | 50 => All Pages => Search Suggestion Checkout => Set Variables => Send Event Beacon — listens for `frach:search-suggestion-submit`
- rule `RL6d651eba61f8440382b342a48e11188f` DataLayer Event | 50 => All Pages => AnchorList Item Clicked => Set Variables => Send Event Beacon — listens for `cmp:click`
- rule `RL79d80f3745a84149ac2fd549d16c4b91` DataLayer Event | 50 => All Pages => Video Play Progress 25 % => Set Variables => Send Event Beacon — listens for `frach:video-play-progress-25`
- rule `RL7a68ad70e1b741168688ca1656c7605b` DataLayer Event | 50 => All Pages => Gallery Download => Set Variables => Send Event Beacon — listens for `cmp:click`
- rule `RL7e7dd354cadd47a08232106f1280eaa5` DataLayer Event | 50 => All Pages => Video Play Progress 100 % => Set Variables => Send Event Beacon — listens for `frach:video-play-progress-100`
- rule `RL81c2a69541134cd88f19ecb8a76cc5fc` 1 - DataLayer Event | 50 => acdl_helper:loaded => Config Helper Library — listens for `acdl_helper:loaded`
- rule `RL8acc81610e3340ddba9451917199bede` DataLayer Event | 50 => All Pages => Search Results Checkout Item => Set Variables => Send Event Beacon — listens for `cmp:link_click`
- rule `RL8f04bee755e44900a80da60672688460` DataLayer Event | 50 => All Pages => Slider Interaction => Set Variables => Send Event Beacon — listens for `frach:slide-changed`
- rule `RLa07d2531be3a4d6182f984481567e13a` DataLayer Event | 50 => All Pages => Image Hotspot Clicked => Set Variables => Send Event Beacon — listens for `cmp:click`
- rule `RLa530ddb743ab4f1d8f281329fc6d8216` DataLayer Event | 50 => All Pages => Quick Search Submit => Set Variables => Send Event Beacon — listens for `frach:quick-search-submit`
- rule `RLa85fe1b853fc48b795c8bde0ae4906b3` DataLayer Event | 50 => All Pages => Text Link Click => Set Variables => Send Event Beacon — listens for `cmp:link_click`
- rule `RLac4dd92e57d5442a9e5344afd9d021fe` DataLayer Event | 50 => [ acdl_helper:page:load ] => All Pages => Send Page View Beacon — listens for `acdl_helper:page:load`
- rule `RLacec119f19954bd2bc074676b05c7452` DataLayer Event | 50 => All Pages => Contact Option Clicked => Set Variables => Send Event Beacon — listens for `cmp:link_click`
- rule `RLafa1f84d2a0e41499adf41d378d7119f` DataLayer Event | 50 => All Pages => Gallery Zip Download => Set Variables => Send Event Beacon — listens for `cmp:click`
- rule `RLb6b9e17c635b44f3b070d3037c574640` DataLayer Event | 50 => All Pages => Navigation Link Click => Set Variables => Send Event Beacon — listens for `cmp:link_click`
- rule `RLcb595f60349b47dd98fb50fef20906fb` DataLayer Event | 50 => All Pages => Quick Search Suggestion Checkout => Set Variables => Send Event Beacon — listens for `frach:quick-search-suggestion-submit`
- rule `RLda2da1afa1f441f496223db217d13786` DataLayer Event | 50 => All Pages => Sharing Icon Clicked => Set Variables => Send Event Beacon — listens for `cmp:link_click`
- rule `RLe34af7a64a46439ab145dc50f64bc680` DataLayer Event | 50 => All Pages => Image Link Click => Set Variables => Send Event Beacon — listens for `cmp:link_click`
- rule `RLe675d336eef6450bb82d6339241d2eb7` DataLayer Event | 50 => All Pages => Image Overlay Opened => Set Variables => Send Event Beacon — listens for `cmp:click`
- rule `RLebcd1a54f26640f0b972d8f738a72c9e` DataLayer Event | 50 => All Pages => Notification Overlay Interaction => Set Variables => Send Event Beacon — listens for `frach:notification-overlay`
- rule `RLf6d00cd3dda0482b9dbc34596649ed36` DataLayer Event | 50 => All Pages => Click More Button => Set Variables => Send Event Beacon — listens for `cmp:click`
