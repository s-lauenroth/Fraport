---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-19T16:28:00Z
  againstInput: https://www.fraport.com/de.html
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.fraport.com/de.html,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-19T16:28:00Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(1 entry, deferred — no design delta; effectively a pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Roster: 25 pages, 8 page types (home, section-landing, content-page, card-overview, feature-hub,
utility-detail, news-listing, contact-directory). Content cap 1648px (module tier), shell fluid.
Gate breakpoints: 1440, 360. Source breakpoints kept (480/720/960/1280/1440); no target breakpoints.

## Decision — links to pages outside the migration set (E2 link audit, 2026-11-20)
The page scope is fixed by the site plan (25 pages). 623 distinct fraport.com targets linked from the
delivered pages, nav and footer are outside that set: SCOPE EXTENSION, not capture gaps — they stay
pointing to the source site (absolute links), none is crawled or authored here. List:
`stardust/rollout/e2-source-targets.txt`. Every in-set target is root-relative (localize-links --check PASS).
