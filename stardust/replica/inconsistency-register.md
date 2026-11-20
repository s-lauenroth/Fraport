# Inconsistency register — www.fraport.com replica

Everything not listed here is frozen; any design delta found by the gate is a defect, not an improvement.

## R-01 — Proprietary corporate typeface self-hosted on the new host

- **Evidence:** `stardust/current/_brand-extraction.json#type.files[]` — FraportSans-{Regular,Italic,Semibold,SemiboldItalic,Bold,BoldItalic}.woff2 served by www.fraport.com/etc.clientlibs/…/resources/fonts/, licensing "proprietary (site owner's corporate face)".
- **Finding:** Fraport Sans is a licensed corporate face; the replica self-hosts the source's own files so the design stays identical (fonts policy). Whether the licence covers the aem.live/aem.page hosts is an owner item.
- **Minimal change:** none to the design. Ship the same files with the licensing alert (`fonts/LICENSING.md`, hand-off line); the stack keeps `fraport-sans-*` first with a Liberation Sans/Arial fallback.
- **Status:** deferred
- **Where:** all page types (every text node).
