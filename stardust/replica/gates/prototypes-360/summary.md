# Prototype gate — every crafted prototype, 360px

2026-11-19T18:14:02.215Z · **0 PASS / 5 FAIL / 0 error of 5**

Verdict: pixel criterion (aligned % ≤ 10 AND total offset ≤ the bound; alignment not used: unaligned % ≤ 10) AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **4 PASS**; full verdict (1–4): **0 PASS**. Failing by criterion: pixel 1 (1 on offsets alone), height 0, clip 0, content 0, units 5; content n/a (origin not probed) 0; pixel criterion met only thanks to alignment (unaligned % over the threshold): 0.
| page | template | tier | origin | browser | pixel % aligned (unaligned) [text] | offsets | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/de-newsroom-pressemitteilung-proposed.html` | - | - | stitch-live | chrome | 0.5 | - | 0 | 0 | n/a | off 19 hidden 0 missing 3 | FAIL (elements) | units off 19 hidden 0 missing 3 |
| `/de-konzern-konzernstrategie-proposed.html` | - | - | stitch-live | chrome | 0.61 | - | 0 | 0 | n/a | off 0 hidden 0 missing 8 | FAIL (elements) | units off 0 hidden 0 missing 8 |
| `/de-konzern-proposed.html` | - | - | stitch-live | chrome | 0.83 (0.87) | 2 step(s), 2px (bound 8) | 0 | 0 | n/a | off 0 hidden 0 missing 12 | FAIL (elements) | units off 0 hidden 0 missing 12 |
| `/de-newsroom-proposed.html` | - | - | stitch-live | chrome | 6.8 (7.11) | 1 step(s), 1px (bound 8) | 1 | 0 | n/a | off 1 hidden 0 missing 6 | FAIL (elements) (masked 36 rows: self-varying rows of the frozen reference (noise floor 0%)) | units off 1 hidden 0 missing 6 |
| `/de-proposed.html` | - | - | stitch-live | chrome | 1.53 (7.8) | 7 step(s), 12px (bound 8) | 8 | 0 | n/a | off 4 hidden 0 missing 7 | FAIL | offsets: 7 step(s), 12px total — −1px at y=3772, −1px at y=7223, −6px at y=7335, −1px at y=8081, +1px at y=8608, −1px at y=9324, … 1 more (bound 8px); units off 4 hidden 0 missing 7 |
