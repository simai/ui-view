# `simai.view-config/1`: the view document and the board window

Status: **contract 1.0.1** (2026-11-22: §4 levels keep whole documents, §2 host keys and
`fields`; text only, no change of behaviour), 1.0.0 agreed between the SIMAI Framework dispatcher (DEV) and Larena
(Larena Audit, Larena Backend) on 2026-11-20. Source: the joint draft
`ui-control control/research/2026-11-17-views-architecture/view-config-1-draft.md` (owner
decisions C298, C299, C300), with Larena's answers to its open points. The machine-readable
part is `view-config-1.schema.json` beside this file; `examples/` holds documents that the
contract test (`package/tests/view-config-1.contract.test.mjs`) checks against both.

The words of the interface are fixed here: a saved way of looking at a list is a
**представление** (view); its buttons are «Сохранить представление» (save the view) and
«Сохранить как моё» (keep a locked view's changes as one's own). The interface never calls it
«шаблон».

## 1. Words

| Word | Meaning |
|---|---|
| data source | the host's description of an entity: fields, types, actions, permissions (Larena: the dataview descriptor), behind `describe()`. |
| view (представление) | a saved, named way to look at a data source: one `simai.view-config/1` document. |
| layout | how records are drawn: `table`, `board`, `cards`, `calendar`, `list`, `tree`. `timeline`, `map` and `feed` are reserved names. |
| filter field (C300) | a button of the list head for one field. |
| level | where a view lives: `system`, `shared` (for everyone), `profile` (a settings profile, C163), `personal`. |

A saved filter is not a separate object: a view keeps its own `query.filter`.

## 2. The document

```json
{
  "schema": "simai.view-config/1",
  "id": "orders-in-progress",
  "name": "В работе",
  "source": "orders",
  "layout": "board",
  "query": {
    "filter": {"status": {"operator": "in", "value": ["new", "work"]}},
    "sort": [{"field": "due", "dir": "asc"}],
    "per_page": 20
  },
  "fields": {"visible": ["title", "status", "due", "owner"], "order": ["title", "owner", "due", "status"]},
  "layouts": {
    "table": {"widths": {"title": 320}, "density": "compact", "totals": ["sum"]},
    "board": {"lane_field": "status", "card_fields": ["owner", "due"], "per_lane": 20}
  },
  "head": {"filter_fields": ["status", "owner", "due"]},
  "required": false,
  "locked": ["query.filter", "fields.visible"],
  "revision": 7
}
```

| Path | Required | Meaning |
|---|---|---|
| `schema` | yes | always `simai.view-config/1`. |
| `id` | yes | unique within the source and the level; `[a-z0-9][a-z0-9_-]{0,63}`. |
| `name` | yes | the view's name in the person's words, 1–120 characters. |
| `source` | yes | the data source's key. |
| `layout` | yes | the layout the view opens in. |
| `query` | no | `filter` (one `{operator, value}` per field, the condition models of C293 and C294), `sort` (`[{field, dir}]`), `per_page`. The search text is never saved. A `filter` key that starts with `_` is a host's service field, not a field of the source (Larena: `_archived`, archived records shown); a reader that does not know it keeps it and shows no filter field for it. |
| `fields` | no | `visible` and `order`: field keys. Optional; a writer fills them when it knows them, so another reader of the document sees the fields. |
| `layouts` | no | the options of each layout, under that layout's name; switching layouts keeps the others' options. A host keeps its own parts of a view (column layout, roles, its settings) under `layouts.<layout>`; a reader keeps keys it does not know and leaves them alone. |
| `head.filter_fields` | no | the fields the person put in the list head as filter fields (C300). |
| `head.chrome` | no | the parts of the list head and footer the view shows (sf-view 1.32.0): `search`, `filter`, `look` («Настроить вид») in the head row, `page-size` in the footer. A part the list does not name is not drawn (`["search"]`: the search alone, no «Фильтр», no «Настроить вид», no «По 20»); an empty list draws none of them. The same words as sf-view's `chrome` attribute; the rows themselves (`toolbar`, `pagination`) stay the page's. |
| `head.look` | no | the rows of «Настроить вид» the person sees, by setting key (`columns`, `row_actions`, `density`, `single_line`, `paging`; `lane_field`, `card_fields`, `empty_lanes`; `size`; `date_field`, `color_field`). A row left out is not drawn; `locked` still draws a row, disabled. Absent: every row. |
| `required` | no | a view that cannot be deleted. |
| `locked` | no | paths that lower levels cannot change (C298). |
| `revision` | yes | grows by one on every save. A save sends the revision it started from; a conflict answers with the newer document. |

**Page size.** `query.per_page` is one of 10, 20, 50 and 100. A view without one opens at **20**
(owner decision 2026-11-20).

## 3. The board window and answer

A board asks one request for all its lanes: the first `per_lane` records of every lane and every
lane's total.

```text
window: { lanes: <lane field>, per_lane: 20, totals: ["count", ...], lane?: <value>, cursor?: <string> }
```

- `per_lane`: default **20**, at most **100**.
- `lane` and `cursor` ask the next portion of one lane («Показать ещё» of that lane).

The answer:

```json
{
  "lanes": [
    {"value": "new", "total": 48, "sums": {"amount": 125000}, "over_limit": false,
     "records": [{"id": "10468", "revision": "3"}], "cursor": "c2"}
  ]
}
```

| Path | Required | Meaning |
|---|---|---|
| `lanes[]` | yes | at most **200** lanes; more is refused by the host, not cut silently. |
| `lanes[].value` | yes | the lane field's value (`null` for records without one). |
| `lanes[].total` | yes | how many records the lane holds. |
| `lanes[].sums` | no | the lane's sums by field (C296). |
| `lanes[].over_limit` | no | `true` when the lane holds more than its WIP limit. |
| `lanes[].records[]` | yes | the lane's portion, at most `per_lane`. |
| `lanes[].cursor` | no | present while the lane has more records. |

## 4. Levels

C298 levels, highest first: `system` → `shared` → `profile` → `personal`.

- `system` is the package or product default and ships with the release. A host may still name
  it `package` until **2027-01-01**; the view reads `package` as `system` (port 1.16.0).
- Each level stores **whole documents**. Where a view of the same `id` lives on several levels
  the host merges them in the order `system` < `shared` < `profile` < `personal`: a lower
  level's document replaces the higher one's, except on the paths in `locked`, which keep the
  higher level's values. A later change of the higher level reaches a lower level's copy only
  on its locked paths.
- Personal edits of a locked path last until the person leaves the page; «Сохранить как моё»
  keeps them as a personal view.
- A reset writes a record; it never deletes the level above.
- Guests keep the personal level in the browser; people with an account keep it on the server.
- Sharing a personal view copies it to `shared`; the interface offers it only when
  `describe().permissions` allows it (C299).

**Scopes** (team or public views beside the levels) are **reserved**: not part of version 1.
A document carries no `scope`; the settings profile covers teams. A list belongs to one place of
the host (Larena: one site area), so its views and levels are per list.

## 5. Limits

| Limit | Value |
|---|---|
| views per list per level | **20** |
| size of one view document (UTF-8 JSON) | **8 KB** (8192 bytes) |
| `per_lane` | default 20, max 100 |
| lanes in one answer | 200 |

`describe()` reports them, so the interface can tell the person before a save fails:

```json
{"limits": {"views_per_level": 20, "view_bytes": 8192, "per_lane_default": 20, "per_lane_max": 100, "lanes_max": 200}}
```

A save over a limit is answered `refused` with reason `limit` and the limit's name.

## 6. Adapter

```text
describe()                      -> { source, fields[], layouts[], actions[], permissions, limits }
query({ search, filter, sort, window, fields }) -> { records[], total, cursor?, totals? } | { lanes[] }
views.list() / views.save(doc, level, base_revision) / views.remove(id, level) / views.reset(id, level)
```

The SIMAI Framework side of this adapter is `simai.dataview-port` (1.16.0: levels and the personal
preferences layer). The host merges the levels (§4) and lists the views it offers in
`saved_views`, each with its `level`; the view in the browser shows them as listed and merges no
levels itself. A guest's own state (page size, the view zone, the last view opened) stays in the
browser.

## Кратко по-русски

Контракт `simai.view-config/1`: документ представления (запрос без поиска, вид показа, поля,
настройки каждого вида, поля фильтра в шапке, блокировки, ревизия), окно доски (20 записей на
колонку по умолчанию, не больше 100, не больше 200 колонок) и её ответ, уровни
system/shared/profile/personal (каждый уровень хранит документ целиком; порядок слияния system < shared < profile < personal, кроме закреплённых путей), лимиты (20 представлений на список на уровень, 8 КБ на
представление, `describe()` их сообщает). Размер страницы по умолчанию — 20. Свои части хост держит в `layouts.<вид>`, служебные поля фильтра начинаются с `_`, `fields` необязательно. Области видимости
(команда, публичные) зарезервированы. Слова интерфейса: «представление», «Сохранить
представление», «Сохранить как моё»; «шаблон» не используется.
