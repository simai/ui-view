# Site evidence, view round 1 (2026-11-17)

`node site/scripts/evidence.mjs https://ui-view.test/ docs/evidence/2026-11-17-view-r1-site --concurrency 4`
over the local review copy of the site built by `site/scripts/build.sh` over the
set build of `round/view-r1-site` 24fe7db (view 1.9.0 candidate, pair
`ui-24d64b7f6eb7`, Docara 3.14.1). Headless Chrome.

| Rule | Measured | Result |
|---|---|---|
| 8.11 first paint: 42 pages with a live example and the home page × 1440/390 × light/dark × 3 cold loads (504 loads) | layout shift above 0 on 504 loads: the page itself (median 0.018, max 0.92 on the sf-view reference, sources h2/li/p/code below example frames) and inside example frames (from the frame's body at ~150 ms); sideways scroll 0; console/request errors on 2 loads (404 `distr/core/contracts/icon-names.v1.json`) | red: Docara orders (frame height before reveal; runtime projection lacks icon-names) |
| 8.12 Docara header | hero text centred (offset 0) on 12 home loads; header tools at 390: 3; the effect layer lies under the text box on all 12 | red on «effect not under the text»: Docara order |
| E7 hero | 405 px at 1440 (needs ≥ 405); effect `heat-mosaic`; surface `bg-surface-container`, not surface-0 | height green; surface: Docara order (hero surface option) |
| 11.16 published | the home footer names view 1.9.0 and `ui-24d64b7f6eb7` on every home load | green |
| 11.18 screenshots | 34 (home × 4 tabs × 1440/390 × light/dark; 9 pages × 1440/390 light) | green |

`summary.json` has the totals, `evidence.json` every load (frames, shift entries
with time and source, errors).

## Кратко

Матрица первого показа и проверки шапки Docara прогнаны по всему сайту: страницы
и примеры сдвигаются при загрузке (CLS не 0), эффект героя лежит под текстом,
фон героя не surface-0, одному файлу рантайма Docara не выкладывает — это
заказы в Docara. Версия и пара в подвале верны, бокового скролла нет.
