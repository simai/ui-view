# sf-view-cards

The cards layout of the view set (a gallery of record cards; owner decisions
C297, C306): records are cards in a grid whose columns follow its width. A
card holds a cover the layout draws, the title in two lines and up to four
fields in the «Кратко» place.

It is drawn by `sf-view` with `layout="cards"`, only where the author of the
list turned cards on (C297): the page writes `layout="cards"`, or the host's
`describe().layouts` lists `cards` and the list head offers «Карточки». A
host can also place it directly and answer its events.

## What it owns, and what it does not

It owns the grid and the cards on screen: the columns, the cover frame, the
keys, the announcements, the selection, the card menu, «Показать ещё» under
the grid and the empty states inside it.

It owns no data and does no network. `sf-view` asks the host for a window
`{page, per_page: 24}` and gives the answer's records here; «Показать ещё»
asks the next page, which is appended. Opening a record, a selection, a host
action, «Создать» and «Сбросить фильтр» are events.

## Options (`layouts.cards` of `simai.view-config/1`)

```json
{
  "cover_field": "photo",
  "cover": {"fit": "cover", "ratio": "4:3"},
  "title_field": "title",
  "card_fields": ["sku", "category", "price", "stock"],
  "card_labels": true,
  "size": "m",
  "density": "default",
  "more": "button",
  "per_page": 24
}
```

- `cover_field`: a file field (templates `image`, `image_card`, `image_list`,
  C302) or `null`; unset, the first image field, else no cover. With several
  files the first picture. A file that is not a picture shows its type's icon
  on the tint; no file shows the tint, an icon and «Нет фото».
- `cover.fit`: `cover` crops the picture to the frame (default); `contain`
  shows it whole on a tint, for goods on white and logos. `cover.ratio`:
  `1:1`, `4:3` (default), `3:4`, `16:9`.
- `title_field`: the record's title, two lines then «…».
- `card_fields`: up to four fields under the title, each drawn by the
  Framework field renderers in the «Кратко» place (C300 (2)): text at the
  start, numbers and dates at the end. Since 1.1.0 (owner decision D3) the
  fields stand one per row, the label over the value, with a gap after the
  title; `card_labels` is on by default, `false` hides the labels (a screen
  reader still reads them and a tooltip shows them).
- `size`: `s`, `m`, `l` = least card width 224, 288, 352 px at a desktop
  (the width ladder steps `--sf-measure-28`, `-36`, `-44`, C396); the columns
  follow the width. On a phone (the grid below 600 px) S draws two columns,
  M and L one (C306). No field is cut: a
  value wraps at its spaces.
- `density`: `compact` takes the card's padding a step down.
- `more`: `button` («Показать ещё»); `per_page` 24 divides into 2, 3, 4 and 6
  columns.

There is no grouping in the cards (C297) and no manual order: the view's sort.

## The cover

The layout draws it: a frame of the chosen ratio from edge to edge of the
card, so nothing below moves when the picture arrives. The picture is lazy
(`loading="lazy"`, `decoding="async"`, its width and height given) and has
an empty `alt` (the title names the card). A host gives a thumbnail of the
width needed: `{label, mime, href, width, height, thumb: {"480": href}}`.

## Keys

One Tab stop for the grid. The arrows go to the neighbour card, up and down
by the rows as drawn; Home and End to the row's start and end, with Ctrl the
first and the last card; PageUp and PageDown a screen. Enter opens the
record, Space marks a card, Shift+Space a range, Shift+F10 or the context
menu key opens the card menu, Escape clears the selection. A card's box and
«⋯» take no Tab stop.

## The record card beside the list

A press on a card raises `sf-view-cards-open {id, trigger}`. `sf-view` opens
the record in the card named by its `record-card` (C305): docked beside the
list from 64rem, and the grid, whose columns follow its own width, narrows.
The open record's card is marked; when the record card closes, focus comes
back to it.

## Selection

A card without a cover centres its box and «⋯» on the title's first line
(since 1.0.7). The box of a card (or Space) marks it; once something is marked every card
shows its box. The marks go to `sf-bulk-actions` (C295) with the host's
actions where the pair has it, else to the same strip of `sf-button`.

## Events

| Event | Detail | When |
|---|---|---|
| `sf-view-cards-open` | `{id, trigger}` | a press, Enter, «Открыть» |
| `sf-view-cards-select` | `{ids}` | the selection changed |
| `sf-view-cards-more` | `{page, offset, per_page}` | «Показать ещё» |
| `sf-view-cards-menu` | `{id}` (cancelable) | a card menu is about to open |
| `sf-view-cards-apply` | `{action, ids, scope}` | a host action on the selection or one card |
| `sf-view-cards-create` | `{}` | «Создать» in an empty list |
| `sf-view-cards-reset` | `{}` | «Сбросить фильтр» where nothing was found |
| `sf-view-cards-refresh` | `{}` | «Повторить» after a failed load |
