# sf-view-calendar

The calendar layout of the view set (owner decision C307, after the board and
the cards, C298): records sit on the days of their date field, and a move or a
stretch is a change of the date fields which the host saves.

It is drawn by `sf-view` with `layout="calendar"`; a host can also place it
directly and answer its events.

## What it owns, and what it does not

It owns the days on screen: its bar (‹ ›, the period, «Сегодня», the modes,
«Без даты N»), the month grid, the time grid of a week or a day, the list,
the «Без даты» column, «+N», «+» on a day, moves and stretches shown at once
and pale until the host answers, the keys and the announcements.

It owns no data and does no network. The records come from the host as one
window: the days on screen `[from, to)` by the date field (and the end field)
in the request's time zone and week start (C293), up to 1000 records; the
undated records come in a query of their own. Every range query names the
date field: when neither the page nor the columns name it before the first
answer, sf-view asks the first query as the page printed it, without a window,
and asks the range as soon as that answer gives `layouts.calendar`. A move, a stretch, a new record
on a day, opening a record, the period and the mode are events; the host
answers a move with `settleMove()`.

## Options (`layouts.calendar` of `simai.view-config/1`)

```json
{
  "date_field": "delivery_start",
  "end_field": "delivery_end",
  "all_day_field": null,
  "mode": "month",
  "modes": ["month", "week", "day", "list"],
  "color_field": "status",
  "event_fields": ["client", "amount", "manager"],
  "per_day": 3,
  "hours": ["08:00", "20:00"],
  "slot": 30,
  "weekends": "show",
  "undated": "button"
}
```

- `date_field`: the start, a `date` (all day) or `datetime` (timed) field; the
  source's first date field by default.
- `end_field`: the end of the same type; a stretch changes it.
- `all_day_field`: a boolean the host keeps; without it the field's type says.
- `mode`, `modes`: the mode it opens in and the ones offered. A `mode`
  attribute the page writes on the element goes first, then this option,
  then month; the person's choice goes over all. On a phone «Неделя» is three
  days and «День» is not offered.
- `color_field`: a choice field; an event takes its option's colour (C140).
- `event_fields`: up to three fields in the «Кратко» place (list rows, the
  event's tooltip), drawn by the Framework field renderers. On a phone a row
  is two lines: the time, the title and the second field at its end, then the
  first field; a long value ends with «…».
- `per_day`: lines of a month day (3); when the events do not fit, the last
  line is «+N», a text button the height of an event, which opens the day's
  list. Every day of the month has the height of the number row and these
  lines.
- `hours`, `slot`: the visible hours of a week and a day, and the step of a
  move or a stretch in minutes.
- `weekends`: `show` or `hide` (week and month).
- `undated`: `button` («Без даты N» opens the column), `panel` (open at
  start) or `none`.

There is no week start and no time zone among the options: they come from the
request (`time-zone`, `week-start`; sf-view takes them from the host's
`context`), else the zone is the person's and the week starts as the page
language says (ru: Monday). They are never stored in the view.

## Rules and rights

`rules` are the host's rules of the date field (`describe().rules`): `past`,
`weekdays {days}` and `sunday` … `saturday`, `min {date}`, `max {date}`,
`dates {dates}`, each with its `reason`. While an event is held, a day a rule
refuses dims and names the reason; the menu's items are disabled with it. A
record with `can: {update: false, reason}` cannot be moved or stretched. Any
other rule is the server's: a refusal of the move puts the event back and the
host's reason is said in a toast and in the live region.

## Values and zones

A `date` value is `yyyy-mm-dd`. A `datetime` value with an offset (`Z`,
`+03:00`) is an instant shown in the request's zone; one without an offset is
the wall clock of the source's zone (`fields[].timeZone`), else of the
request's. A move writes each value back in its own form. Where the source's
zone differs from the request's, the event's tooltip shows the source's time.

## Events

| Event | Detail |
|---|---|
| `sf-view-calendar-move` | `{id, patch, from, revision, how}`, cancelable |
| `sf-view-calendar-open` | `{id}` |
| `sf-view-calendar-create` | `{date, time?, field}` |
| `sf-view-calendar-range` | `{from, to, mode, window, context}` |
| `sf-view-calendar-save` | `{mode, undated_open}` |
| `sf-view-calendar-select` | `{ids}` (list mode) |
| `sf-view-calendar-apply` | `{action, ids, scope}` |

## Keys

One Tab stop for the grid (the W3C date grid): ←→ a day, ↑↓ a week (month),
Home/End the week's start and end, PageUp/PageDown the period,
Shift+PageUp/PageDown a year, T today; Enter goes into the day's events
(«+N» and «+» after them), ↑↓ between them, Escape back; Enter on an event
opens the record; Shift+F10 or the context menu key opens the event menu;
Ctrl+Shift+←/→ moves it a day, Ctrl+Shift+↑/↓ a slot (week and day). Every
move is announced.

## Phone

Below 600 px of its own width: the month with dots on event days and the
chosen day's events as a list under it (C307 (1)). The dots are the
calendar's own grid until `sf-input-date` carries day marks (CL-6); a feature
check picks the Framework part then.
