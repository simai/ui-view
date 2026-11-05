# Evidence 2026-11-05: the site on the agreed scheme

The site built by Docara 3.11.1 from `site/` (`verify-static`: 39 pages, no
broken reference), copied by `site/scripts/publish-local.sh` to the local test
host https://ui-view.test/ and checked with
`node site/scripts/evidence.mjs https://ui-view.test/ docs/evidence/2026-11-05-site-scheme`
(summary `screenshots.json`):

| Check | Result |
|:---|:---|
| `/` | redirects to `/ru/` |
| Home, each of the four tabs (orders, staff, warehouse, tasks) | panel shown, table draws 24–25 rows; 1280 and 390 px, light and dark |
| Quick start, bulk-actions recipe, `sf-view-table` reference | set elements defined; 1280 and 390 px |
| Console errors and page errors | none on any page |
| Home loaded three more times, cold | 8 set elements defined each time, no errors |

Bulk action on the tasks tab (separate run, `home-tasks-bulk-applied-1280-light.png`):
two rows marked, the band shows «Отмечено: 2», action «Завершить» chosen,
applied — the log reads «Завершено: 2» and both rows show «Готово». The apply
was called through `sf-view.applyBulkAction()` (what the band's button
calls): in a headless run the band sits below the example frame's viewport.

Files: `home-<tab 1..4>-<width>-<scheme>.png`,
`quick-start-<width>-light.png`, `recipe-bulk-actions-<width>-light.png`,
`reference-view-table-<width>-light.png`.

## Landing fixes (second round)

After the coordinator's review: tabs wrap at 390 px and start at «Заказы»;
every home example shows 10 rows a page (staff pages its own rows with an
`sf-pagination`); the orders list takes the full width and an order opens as
a side panel (`sf-view-properties panel`), in the page only while open;
the example has no code tabs and links «Код примера» to `ru/guide/showcase/`;
the connection line is in the hero under the buttons. Local copy only for
the last two (`site/scripts/landing-transform.mjs`, Docara requests 14, 15).

- `home-orders-closed-<width>-light.png`, `home-orders-open-<width>-light.png`
  — orders before and after opening № 10466, 1280 and 390 px; the panel
  closes by its close control, leaves no edge behind, and opens again.
- `home-tasks-bulk-applied-1280-light.png` — bulk action rerun: «Завершено: 2».
- The run above was repeated: 22 shots, 10 rows on every home tab, no
  console or page errors, three cold reloads clean.
