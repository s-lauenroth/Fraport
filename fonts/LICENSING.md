# Font licensing

FONT LICENSING REQUIRED BEFORE GOING LIVE on a production domain.

| file | family | foundry / licence | status |
|---|---|---|---|
| FraportSans-*.woff2 (6 cuts) | Fraport Sans | proprietary corporate face of Fraport AG | owner item (register R-01): confirm web-embedding licence for the new host |
| roboto-*.woff2 (6 cuts) | Roboto | Google, Apache 2.0 | ok to redistribute |

Remove path: if the Fraport Sans licence cannot be confirmed, delete `fonts/FraportSans-*.woff2`
and their `@font-face` rules in `styles/fonts.css`; every stack falls back to the metric-matched
`fraport-sans-fallback` faces in `styles/styles.css`, then "Liberation Sans", Arial, sans-serif.
