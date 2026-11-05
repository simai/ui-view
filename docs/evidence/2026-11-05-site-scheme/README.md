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

## Owner review (third round)

The hero holds the name, the sentence and two buttons; the connection line is
its own «Подключение» block after the examples. The home example shows the
views of the set: «Таблица» (orders: search, status filter, sort, 10 rows a
page, bulk «Отгрузить» / «Отменить»), «Карточка» (an employee card in
`view`, `auto` and `edit` modes, 16 fields of 10 types), «Таблица и
карточка» (employees list, the card in a side panel) and «В потоке»
(`sf-list-feed` with cards inside messages: one to read, one in `create`
mode). New section «Поля»: an overview of the 18 field types of
`SF.fieldRenderers.registry` and eight family pages, each with a live
example (table, card to read, card to edit, a switch to the record with empty
values). `verify-static`: 49 pages, no broken reference.

(The `home-orders-*` and `home-tasks-*` shots above belong to the second round and show the earlier home page.)

Flows checked in a separate run (`home-card-edit-1280-light.png`,
`home-master-open-1280-light.png`, `home-feed-created-1280-light.png`):

- table: two orders marked, «Отгрузить» applied — «Отгружено: № 10466, № 10465»;
- card: whole-card edit, an empty name refused by the host with «Укажите ФИО
  сотрудника.» under the field, then saved — «версия 2»; group mode shows
  three «изменить»;
- table and card: a name opens the panel (`panelOpen` true), it closes;
- stream: the create card filled (the date set through `changeField`, the
  datepicker is not driven) and «Создать» — the feed adds the assistant's
  answer with the created record;
- fields overview: «Пустые значения» shows «не заполнено» for every field;
  a changed name saved — «Хост получил: {"title":"Портал клиента 2"}».

No console or page errors in any of these.

Defects of the set found on the way (reported, not fixed here):

- `sf-view-table` draws an `html` cell as its markup (the long-text fast
  path skips the field renderer);
- `sf-view-table` leaves a cell of non-image files empty;
- a `color` field with `swatches` in half a card row: the palette does not
  wrap and runs over the next field (the examples give it the full row);
- a closed `sf-view-properties` panel still draws its drawer edge with the
  close button over the page (the examples add the card only while open).
