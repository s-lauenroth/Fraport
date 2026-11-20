
## 2026-11-20 — fraport.com replica rollout (E2–H)
- Cluster deliveries carried 141 absolute source-host links to in-set pages to the live origin: `localize-links.mjs --check` was not part of the per-cluster chain. Run it over the whole tree before the first cluster PUT, not only at E2.
- An empty source bookmark anchor (`<a name="_Hlk…">`, no href) was encoded as `<a href="…/undefined.html"></a>`; the importer should drop href-less empty anchors.
- `coverage/blocks.json` stays `pending` after C-deliver unless each block is recorded with `update-coverage.mjs --block`; record it in C-final.
