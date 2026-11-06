# sf-view-flow

Design of the fourth component of the set `view` (owner request 2026-11-05;
name reserved in ui-control `control/decisions/2026-11-03-component-sets.md`).
Status: preview, version 1.0.0, not released.
Renamed from `sf-view-property-block` before any release (owner decision 2026-11-06); no alias.

## Purpose

A few properties placed **in a flow**: a chat message, a feed entry, a
comment, a step of a wizard, any stream where content follows content. It
does one of two things:

- **shows** a record's data: an assistant found a vacation request and shows
  its five fields under its answer;
- **asks** the person to fill in a few fields and send them: «fill in the
  city and the date, and I will create the trip». After the answer the block
  stays in the flow as a record of what was sent, read-only.

The landing's «В потоке» tab faked this with `sf-view-properties` at size
1/2 inside `sf-list-feed`, and `sf-chat-message` (ui-pro, `x-blocks`) embeds
the full record component with a host port it builds for each card. Both
work, both carry the record component's whole surface (a side panel, sections,
the per-group edit, arranging, a port) to show five fields.

## How it differs from sf-view-properties

| | `sf-view-properties` | `sf-view-flow` |
|:--|:--|:--|
| Place | a page, a panel (drawer), a full page | inside a flow: as wide as the flow, never a panel |
| Data | read and written through `simai.property-view-port` | given as settings (`fields`, `groups`); no port, no network |
| Structure | sections, groups, columns, arranging | a flat list of fields, or a few groups, each optionally collapsible; no sections |
| Head | the record's name, menu, favourite, copy link | one header line: a heading and an optional description slot |
| Edit | per group, or all at once (`edit`, `create`) | the whole block is one answer: Submit and Cancel at its foot |
| After | the record, editable again | the answer, read-only, with a status line («Отправлено») |
| States | loading, failure, conflict, confirmation | open, pending, accepted, declined, expired; disabled |

## Names

Under the naming rule (`control/decisions/2026-11-02-smart-component-naming.md`):
set `view`, block `view`, variant `flow` (the owner's name: it is the set's
view for a flow); tag `sf-view-flow`, rule `cl-view-flow`, folder `view-flow`,
family `record` (the record component's family: it
draws one object's properties). Settings take the words the set and the
Framework already use for the same meaning (one name, one meaning):

- `mode` `view|edit` is `sf-view-properties`' `mode` with its two values that
  fit a block (`auto` and `create` need a port);
- `state`, `expires-at`, `disabled`, `heading`, `heading-level` are
  `sf-confirm-change`'s and `sf-confirm`'s: the block is the same confirm
  surface;
- `size` `1|1/2` is the set's size; `empty-text` the record component's word;
- `block-id` is the host's name for the question, carried back in every
  event, as `change-id` and `confirm-id` are.

## Data contract

The field descriptors are `sf-view-properties`' (`simai.property-view-port`
field shape), unchanged, so a host passes the same objects to either
component:

```js
{key, label, propertyType, value, required, readonly, width: 'half'|'full',
 hint, placeholder, options, min, max, step, unit, variant, multiple, mask, when}
```

- `fields`: a flat list of descriptors (property, or JSON in the `fields`
  attribute or the `data-sf-settings` island; the property wins).
- `groups`: `[{key, label, collapsible, collapsed, fields}]` when the block
  needs a few named parts. `collapsible` draws the group's label as a toggle
  (`aria-expanded`); `collapsed` is its first state. A group without a label
  is drawn as plain fields. When both are given, `groups` wins.
- A record of the port shape (`{sections: [{groups: [...]}]}`) is one line
  for the host: `block.groups = record.sections.flatMap((section) =>
  section.groups)`.
- `when` (port 1.14.0) is read with `sf-view-properties`' own conditions
  module: a field hidden by its condition is not drawn and not sent;
  `when.required` and `when.enabled` apply as there.
- `formatFieldValue(field, value)`: an optional host function, a JS property,
  used to show values the host formats (the record component reads it from its
  port); a date it does not format reads in the page's language.

Every value is drawn by the SIMAI Framework field renderers
(`SF.fieldRenderers`: `renderViewField` in `view` mode and in closed states,
`renderEditField` in `edit`). The block has no field code. A type the
renderers cannot edit in a block (a record picker or an upload, which need
host paging and upload methods) falls back to the view, read-only, as in the
record component; version 1.0.0 offers no paged pickers and no uploads.

## States

`mode="view"`: the fields, read-only; no foot, no state.

`mode="edit"`, by `state` (the confirm surface's machine):

- `open`: the controls and the action row (Submit filled, Cancel outlined).
  An `expires-at` shows «Ответить до 18:00» in the status line.
- `pending`: set by Submit or Cancel; the controls are disabled, the pressed
  button busy, the other disabled, so nothing is sent twice.
- `accepted`: the answer was taken. The fields are shown read-only with the
  values sent (or the ones the host settled with); the status line says
  «Отправлено». No buttons.
- `declined`: the person cancelled; the fields are not drawn, only the
  heading and «Отменено».
- `expired`: past `expires-at` (or set by the host); like declined, with
  «Время ответа истекло». An open block passing its time says it once
  (`expired` event).
- `disabled` (setting, any state): the controls and the buttons are drawn
  disabled (another answer is on its way elsewhere in the flow).

## Intents and events

- **Submit** (`confirm()`, `answer({accepted: true})`,
  `data-sf-action="<id>.confirm"`): the block first checks what it can know
  itself: every required field (including `when.required`) filled, no control
  holding an incomplete entry (a mask). Otherwise it marks the fields, says
  «Заполните отмеченные поля», moves focus to the first one and answers
  `refused invalid`; nothing is sent. Then it goes `pending` and sends
  `sf-view-flow-answer {id, accepted: true, values}` (cancelable:
  a refused event reopens the block). `values` holds every shown, editable
  field by key: the whole answer, not the changes.
- **Cancel** (`cancel()`, `answer({accepted: false})`): `pending`, then
  `sf-view-flow-answer {id, accepted: false}`. `cancelable="false"`
  draws no Cancel.
- **The host's answer**, `settle(result)`, in the record port's vocabulary:
  - `{answer: 'applied', values?}`: `accepted`; the values shown are the
    host's when given, else the ones sent;
  - `{answer: 'refused', errors: {key: message}, message?}`: back to `open`
    with each message under its field and the sentence in the status line;
    what was typed is kept; focus goes to the first field with an error;
  - `{answer: 'refused', reason: 'closed'|'expired'}`: `expired`;
  - an answer to a Cancel (`accepted: false`): `declined`.
  The host may also just set the `state` attribute (`accepted`, `declined`,
  `open`).
- `sf-view-flow-expired {id}`: the time ran out, once.
- `sf-view-flow-open {id, field, value}`: a reference value (a
  record, a user) was pressed; following it is the host's.
- `values` (read-only property): the values on screen now.
- `open()`: puts the question again; asked by an assembly (§19.4) it waits for
  the answer, as `sf-confirm-change` does.

## Settings

| Setting | Values | Default | What it does |
|:--|:--|:--|:--|
| `mode` | `view`, `edit` | `view` | show the fields, or ask for them |
| `heading` | text | empty | the header line; also the block's accessible name |
| `heading-level` | 2–6 | 3 | the header's level where the block is placed |
| `fields` | list | `[]` | the field descriptors |
| `groups` | list | `[]` | named groups of descriptors, optionally collapsible |
| `state` | `open`, `pending`, `accepted`, `declined`, `expired` | `open` | where the answer is |
| `expires-at` | ISO 8601 | — | until when the block can be answered |
| `disabled` | boolean | false | everything shown, nothing pressable |
| `block-id` | id | empty | the host's name for the block, carried back |
| `size` | `1`, `1/2` | `1/2` | the text and controls; 1/2 sits in a message |
| `cancelable` | boolean | true | whether Cancel is offered |
| `submit-text`, `cancel-text` | text | «Отправить», «Отмена» | the two answers |
| `empty-text` | text | «не заполнено» | an empty value shown |
| `required-text` | text | «Заполните поле» | a required field left empty |
| `invalid-text` | text | «Заполните отмеченные поля» | the status line when a submit was stopped |

Public CSS variables: `--sf-view-flow-radius`, `-inset`, `-gap`,
`-background-color`, `-border-color`.

## Layout

The block is as wide as its flow and never wider; its fields stand in two
columns (`width: half` pairs up, `full` takes the row) and in one column below
480 px (a media query, not a container query: containing the inline size
would collapse a block that is as wide as its content in a message bubble, as
`sf-confirm-change` found). Labels above values, the record component's
reading order. The action row is at the foot, the status line at its start.

The common edit controls (`sf-input`, `sf-input-textarea`, `sf-input-date`,
`sf-dropdown`, `sf-input-quantity`, `sf-switch`, `sf-checkbox`) are eager
relations, not lazy as in `sf-view-properties`: a block asks at once, and a
control fetched later stays empty after the block draws, so every field below
it moves down (the first-paint gate measured it at 390 px). The rarer ones
(slider, rich text, image, button group, password eye) stay lazy.

## Accessibility

- The block is a `region` (`section`) named by its heading (`role="heading"`
  with the host's level), else by the word «Данные».
- Each control is the field renderer's, named by the field's label.
- Required fields carry the star beside the label (hidden from the reader:
  the control itself says required where the renderer supports it).
- Field errors are `role="alert"` under their field; the status line is a
  polite live region that is always in the page; focus moves to the status
  line when the buttons go (the confirm surface), and to the first field in
  error when a submit is stopped or refused.
- A collapsible group's label is a button with `aria-expanded` and
  `aria-controls`; a group holding an error opens.
- Keys: Tab reaches the controls and the answers; Enter and Space press the
  focused answer. No implicit Enter-submits: a control in the flow (a date
  picker, a list) owns its Enter.

## Reuse

By the reuse rule nothing is copied:

- the **confirm surface** of SIMAI Framework (`src/smart/helpers/confirm-surface.js`,
  the one `sf-confirm` and `sf-confirm-change` share): the states, `pending`,
  the expiry timer, the `answer` and `expired` events, the §19.4 `open`/ask,
  and the focus move to the status line;
- the **field value** of `sf-view-properties`, moved out of its template into
  `view-properties/js/field-value.js` (`renderFieldValue`): the edit host the
  renderers call (`setFieldValue`, `setFieldError`), the fallback to the view
  for a type with no editor, the empty value and the reference press. The
  record component imports the same function; nothing changes in it;
- the **conditions** of `sf-view-properties` (`view-properties/js/conditions.js`);
- the **date words** of `sf-view-table` (`view-table/js/format-value.js`) for
  dates the host does not format, as the record component reads them;
- the Framework's **field renderers**, `sf-button`, `sf-icon`.

The block's own code is its answer logic (`js/answer.js`: the fields shown,
the values out, the required check, the host's answer read) and its template.

## Where it is used next

- the landing's «В потоке» tab and the guide recipe «Данные в потоке (чат)»;
- `sf-chat-message` cards (`x-blocks`, ui-pro): `placeBlock` can place this
  block instead of the full record component and its per-card port; the chat
  set takes it when it takes a view release that carries it (a request to the
  chat thread, not written from here).

## Open

- The name in the shared registry (ui-source `contracts/registry/names.json`,
  owner `view`, status reserved) is SIMAI Framework's to add; until then the
  set's registry gate names it.
- Paged record pickers and file uploads in a block need the host methods the
  record component takes from its port; left out of 1.0.0.
