# Evidence 2026-11-05: the first build of the set view and its site

Set commit `066e5dee6078` over SIMAI Framework `ui-e22fefb3c1f8` (ui-source
`297a56c0914a`), from `sh package/scripts/gates.sh` (summary `gates.json`,
receipt `package-receipt.json`):

| Gate | Result |
|:---|:---|
| build, twice | byte-identical, 123 files, archive `c8001d9ac236…` |
| receipt | against the pair and the registry at ui-source main: pass |
| unit suite | 439 tests: 436 pass, 3 skipped (need a distribution beside the source), 0 fail |
| registry at main | no problems; the set is still `pending` there |
| manifest probes | 20 / 20 (sf-view 6, sf-view-properties 6, sf-view-table 8) |
| browser probes | 60 pass, 0 fail; 4 lab probes skipped, 1 cli not run (as in ui-pro) |
| first paint | check current; gate 32 / 32 at 1280 and 390, CLS 0 |

The site, `sh site/scripts/build.sh` over that build: 9 pages, Docara
`verify-static` 621 local references, none broken; served by
`node site/scripts/serve.mjs` at http://127.0.0.1:8790/. Screenshots by
`site/scripts/evidence.mjs` (`screenshots.json` lists the set elements found
on each page, all defined): overview, the sf-view-table page and the orders
demo with an order's card open, light and dark, 1440 and 390 px.
