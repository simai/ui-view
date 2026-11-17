# sf-view-board

The board layout of the view set (kanban; owner decisions C298, C304): lanes
are the values of one field (a status, a choice, a person, yes/no), cards are
records, and a move is a change of that field which the host saves.

It is drawn by `sf-view` with `layout="board"` (Larena's word `kanban` reads
as `board`); a host can also place it directly and answer its events.

## What it owns, and what it does not

It owns the lanes and the cards on screen: the lane heads, folded lanes,
«Показать ещё» per lane, the move shown at once and pale until the host
answers, the keys, the announcements and the selection on cards.

It owns no data and does no network. The lanes come from the host as one
window: the first `per_lane` records of every lane and the totals of all
lanes (C304). A move, «Показать ещё», opening a record, creating one in a lane
and a lane folded or hidden are events; the host answers a move with
`settleMove()` and «Показать ещё» with `appendLane()`.

## Options (`layouts.board` of `simai.view-config/1`)

```json
{
  "lane_field": "status",
  "lanes": {"order": ["new", "wait", "paid", "sent", "cancel"], "hidden": [], "collapsed": ["cancel"]},
  "empty_lanes": "show",
  "card_fields": ["client", "manager", "due", "amount"],
  "totals": ["count", {"sum": "amount"}],
  "limits": {"paid": 4},
  "order": "sort",
  "per_lane": 20,
  "swimlane_field": null
}
```

- `lane_field`: the field whose values are the lanes; the field's options give
  their order, names and colours (a tonal badge, C140).
- `lanes`: order, hidden (brought back in «Настроить вид»), collapsed (a narrow
  strip with the name and the count).
- `card_fields`: up to four fields under the title, drawn in the «Кратко»
  place by the Framework field renderers (C300 (2)).
- `totals`: the count under the filter, and money sums per currency (C294);
  the host computes them.
- `limits`: soft (C304 (3)): the head reads «5 / 4» highlighted, the move is
  allowed.
- `order`: `sort` follows the view's sort; `manual` orders by hand only when
  the source declares an order field and no sort is on (C304 (2)).
- `swimlane_field`: reserved; no rows by a second field now (C304 (4)).

## Moves

```js
board.moves = {sent: {from: ['paid'], reason: 'В «Отправлен» — только из «Оплачен»'}};
board.addEventListener('sf-view-board-move', async (event) => {
  const {id, field, to, revision} = event.detail;
  const answer = await save(id, field, to, revision);
  board.settleMove(id, answer.ok ? {answer: 'applied'} : {answer: 'refused', reason: answer.reason});
});
```

While a card is held, a lane the rules refuse dims and says why; «Переместить
в» in the card menu lists the lanes, the refused ones disabled with the reason.
A refusal from the host puts the card back, says the reason in a message and
in the live region, and focus stays on the card.

## Keys

One Tab stop for the board. Left and right go between lanes; up, down, Home
and End inside a lane (its head's buttons, its cards, «Показать ещё»). Space
marks a card, as in the table; Enter picks it up and the arrows carry it
(sf-sortable); Shift+F10 opens the card menu. Escape clears the selection.

## Phone

Below 600 px the lanes stand one per screen under a lane switcher with
counts; a swipe goes to the next lane (C304 (1)).
