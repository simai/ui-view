# SIMAI View

Data views for [SIMAI Framework](https://ui.simai.io/): the component set
`view`. One repository holds the set's Smart components, its documentation
site and its demonstrations, built by the one standard of SIMAI Framework
component sets (`simai.component-set` 1.0.0).

| Element | What it is |
|:---|:---|
| `sf-view` | the data view over a host's data port: search, filters, sorting, pages, saved views, a tree |
| `sf-view-table` | the smart table: typed cells, columns, row actions, filters, pages |
| `sf-view-properties` | the record card: a record's properties in groups and sections, read and edited |

Further views (kanban, calendar, gantt) join this set (owner decision
2026-11-03, point 12). A plain list and a plain table stay in the free SIMAI
Framework.

- [`package/`](package/README.md): the set (passport `set.json`, the lock,
  the components, tests, scripts).
- [`site/`](site/README.md): the documentation and demonstration site,
  built with Docara; sections Обзор, Подключение, Компоненты, Демо,
  Изменения.
- [`docs/SET-TEMPLATE.md`](docs/SET-TEMPLATE.md): what here is generic to
  every set and what is specific to `view`.
- [`CHANGELOG.md`](CHANGELOG.md): the set's changes.

The page connects it in one line:

```html
<script src="https://cdn.jsdelivr.net/npm/@simai-studio/ui@5.20261106.1146/distr/core/js/core.min.js" data-sf-sets="view"></script>
```

## Licence

Free for small businesses (PolyForm Small Business 1.0.0) and for
non-commercial use (PolyForm Noncommercial 1.0.0); everyone else needs the
SIMAI Commercial License, available on request from SIMAI. Use as part of
Larena is covered by Larena's licence. See [LICENSE.md](LICENSE.md). The
SIMAI Framework the set builds on is Apache-2.0.

The repository is private.
