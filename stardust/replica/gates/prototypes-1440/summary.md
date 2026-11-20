# Prototype gate — every crafted prototype, 1440px

2026-11-19T18:14:38.842Z · **0 PASS / 5 FAIL / 0 error of 5**

Verdict: pixel criterion (aligned % ≤ 10 AND total offset ≤ the bound; alignment not used: unaligned % ≤ 10) AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **5 PASS**; full verdict (1–4): **0 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 0, units 5; content n/a (origin not probed) 0; pixel criterion met only thanks to alignment (unaligned % over the threshold): 0.
| page | template | tier | origin | browser | pixel % aligned (unaligned) [text] | offsets | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/de-newsroom-pressemitteilung-proposed.html` | - | - | stitch-live | chrome | 0.26 | - | 6 | 0 | n/a | off 0 hidden 0 missing 14 | FAIL (elements) | units off 0 hidden 0 missing 14 |
| `/de-konzern-konzernstrategie-proposed.html` | - | - | stitch-live | chrome | 0.39 | - | 6 | 0 | n/a | off 0 hidden 0 missing 8 | FAIL (elements) | units off 0 hidden 0 missing 8 |
| `/de-konzern-proposed.html` | - | - | stitch-live | chrome | 0.44 | - | 6 | 0 | n/a | off 0 hidden 0 missing 12 | FAIL (elements) | units off 0 hidden 0 missing 12 |
| `/de-proposed.html` | - | - | stitch-live | chrome | 0.83 | - | 6 | 0 | n/a | off 4 hidden 0 missing 7 | FAIL (elements) | units off 4 hidden 0 missing 7 |
| `/de-newsroom-proposed.html` | - | - | stitch-live | chrome | 4.35 | - | 6 | 0 | n/a | off 1 hidden 0 missing 6 | FAIL (elements) (masked 296 rows: self-varying rows of the frozen reference (noise floor 0.72%)) | units off 1 hidden 0 missing 6 |
