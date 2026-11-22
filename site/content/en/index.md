---
draft: true
description: SIMAI View — tables, boards, cards, a calendar and the record card for SIMAI Framework, connected with one line; live examples, a guide and a reference.
profile: landing
---

:::hero {layout=split padding=2xl media=none effect=data-flow}
# SIMAI View

Tables, boards, cards and a calendar for SIMAI Framework: the application gives the data, and the components search, sort, page and show the record themselves.

[Get started](/ru/guide/)

[Components](/ru/components/)
:::

## One list, several layouts

A live list of orders. Its view zone is open: switch «Table», «Board»,
«Cards» and «Calendar» — the filter and the search stay, and the application
answers the same data in the shape of each layout. Open an order — the
record card stands beside the list: the stage, the client and the sum in its
head, short fields edited at the value, a group with «Изменить», and in «⋯»
editing the whole record, the change history, the link, the record on the
whole page, the card's view settings and delete. «Создать» in the list head
opens a new order. Mark a few orders — the bulk actions and «Выбрать все»
under the filter appear below the list.

:::example {id="home/list" label="Orders" fullscreen=false wrap=false}
:::

[The code of this example and other examples](/ru/guide/showcase/)

## What the set holds

Each component is drawn by itself over a few records. Its name leads to its
page.

:::::grid {columns=2 gap=4}
::::card {variant=plain}
### [Smart table](/ru/components/view-table/)

Records as rows: columns by type, sorting, selection, a row menu.

:::example {id="home/set-table" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [List head](/ru/components/view-head/)

The name, views, filter, search and «Create» above the list.

:::example {id="home/set-head" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [Board](/ru/components/view-board/)

Records in columns by a field value; moving a card changes the field.

:::example {id="home/set-board" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [Cards](/ru/components/view-cards/)

Records as a grid of cards: the name and up to four fields.

:::example {id="home/set-cards" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [Calendar](/ru/components/view-calendar/)

Records on the days of their date: month, week, day or a list.

:::example {id="home/set-calendar" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [Record card](/ru/components/view-properties/)

One record by sections and groups: viewing and editing.

:::example {id="home/set-card" fullscreen=false wrap=false}
:::
::::
::::card {variant=plain}
### [Block in a flow](/ru/components/view-flow/)

A record or a short form inside a message feed.

:::example {id="home/set-flow" fullscreen=false wrap=false}
:::
::::
:::::

## Connection

The set is connected with one line beside SIMAI Framework — the Loader loads
the components the page uses:

<!-- release:cdn -->
```html
<script src="https://cdn.jsdelivr.net/npm/@simai-studio/ui@5.20261117.1311/distr/core/js/core.min.js" data-sf-sets="view"></script>
```
<!-- /release:cdn -->

Other ways, versions and the licence — in [Connection](/ru/guide/connection/).

## Why SIMAI View

:::features
- :icon[bolt]{size=2 container=square variant=tonal scheme=primary} **One line.** `data-sf-sets="view"` beside SIMAI Framework — and the components of the set are ready on the page.
- :icon[dns]{size=2 container=square variant=tonal scheme=primary} **The data stays yours.** The component asks, the server answers: rights, filters and writes are the application's.
- :icon[speed]{size=2 container=square variant=tonal scheme=primary} **Large volumes.** Pages from the server, a window of visible rows, an estimated count for millions of records.
- :icon[devices]{size=2 container=square variant=tonal scheme=primary} **Any screen.** A table on a wide screen, a compact list on a phone — no layout of your own.
- :icon[tune]{size=2 container=square variant=tonal scheme=primary} **People set it up themselves.** Views, columns, sorting and the page size are kept for each person.
- :icon[accessibility_new]{size=2 container=square variant=tonal scheme=primary} **Keyboard and screen reader.** Arrows, Home and End, accessible names and announced states.
:::

:::::surface {width=full tone=muted padding=lg}
<!-- release:footer -->
::::grid {columns=3 gap=4}
:::card {variant=plain}
### Версия
SIMAI View 1.9.0, кандидат выпуска; последняя выпущенная — 1.8.1 от 15 ноября 2026 года. [История изменений](/ru/guide/changes/)
:::
:::card {variant=plain}
### Совместимость
Собран и проверен над выпуском SIMAI Framework `ui-24d64b7f6eb7`; работает с Core `core.runtime` 1.51.0 или новее. [Подключение](/ru/guide/connection/)
:::
:::card {variant=plain}
### Лицензия
Бесплатно для малого бизнеса и некоммерческого использования, остальным — коммерческая лицензия SIMAI. [Условия лицензии](/ru/guide/connection/#лицензия)
:::
::::

[Руководство](/ru/guide/) · [Компоненты](/ru/components/) · [Рецепты](/ru/recipes/) · [Свойства](/ru/properties/) · [npm](https://www.npmjs.com/package/@simai-studio/view) · [SIMAI Framework](https://ui.simai.io/)
<!-- /release:footer -->
:::::
