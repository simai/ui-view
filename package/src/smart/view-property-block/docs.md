# sf-view-property-block

A few properties as a block in a flow: a chat message, a feed entry, a
comment, any stream where content follows content. It shows a record's
fields, or asks the person to fill in a few and send them; after the answer it
stays in the flow as what was sent, read-only.

For a record on a page or in a panel — sections, groups edited one at a time,
a port that reads and writes — use `sf-view-properties`. The block takes the
same field descriptors, so a host passes the same objects to either.

## What it owns, and what it does not

It owns the answer on screen: the controls, the required check, the states
(open, pending, accepted, declined, expired) and the status line.

It owns no data and does no network. Its fields are the host's settings; a
Send is the event `sf-view-property-block-answer` with the values, and the
host answers with `settle()`.

It has no field code. Every value is drawn by the SIMAI Framework field
renderers through `sf-view-properties`' own field value
(`view-properties/js/field-value.js`), addressed by the field's
`propertyType`. A type the renderers cannot edit without host methods (a paged
record picker, an upload) is shown read-only.

## Showing a record

```html
<sf-view-property-block heading="Заявка на отпуск № 17"></sf-view-property-block>
<script>
  document.querySelector('sf-view-property-block').fields = [
    {key: 'employee', label: 'Сотрудник', propertyType: 'string', width: 'full', value: 'Ирина Волкова'},
    {key: 'from', label: 'С', propertyType: 'date', width: 'half', value: '2026-12-21'},
    {key: 'to', label: 'По', propertyType: 'date', width: 'half', value: '2027-01-08'},
  ];
</script>
```

A record the host holds in the port shape is one line:
`block.groups = record.sections.flatMap((section) => section.groups)`.

## Asking for a few fields

```js
const block = document.createElement('sf-view-property-block');
block.setAttribute('mode', 'edit');
block.setAttribute('heading', 'Новая командировка');
block.setAttribute('block-id', 'trip-1');
block.fields = [
  {key: 'city', label: 'Город', propertyType: 'string', width: 'half', required: true},
  {key: 'from', label: 'Выезд', propertyType: 'date', width: 'half', required: true},
];
block.addEventListener('sf-view-property-block-answer', async (event) => {
  const {id, accepted, values} = event.detail;
  if (!accepted) return block.settle({answer: 'applied'});      // declined
  const answer = await server.createTrip(values);              // the host's
  block.settle(answer.ok
    ? {answer: 'applied'}                                        // accepted, read-only
    : {answer: 'refused', errors: answer.errors, message: answer.message});
});
```

Send checks the required fields (`required`, `when.required`) and the
controls' own entries first; a block left incomplete sends nothing, marks the
fields and moves focus to the first one. The answer carries every shown,
editable field — the whole answer, not the changes; a field hidden by its
condition is left out.

## Settings

| Setting | Values | Default |
|:--|:--|:--|
| `mode` | `view`, `edit` | `view` |
| `heading`, `heading-level` | text; `2`–`6` | empty; `3` |
| `fields`, `groups` | lists (JSON in markup; a property wins) | `[]` |
| `state` | `open`, `pending`, `accepted`, `declined`, `expired` | `open` |
| `expires-at` | ISO 8601 | — |
| `block-id` | id | empty |
| `disabled` | boolean | false |
| `size` | `1`, `1/2` | `1/2` |
| `cancelable` | boolean | true |
| `submit-text`, `cancel-text`, `empty-text`, `required-text`, `invalid-text` | text | the page language's words |

A group is `{key, label, collapsible, collapsed, fields}`; a collapsible
group's label is a toggle, and a group holding an error opens.

`formatFieldValue(field, value)` is an optional JS property: the host's own
formatting of a value shown, as a property-view host gives it.

## Events and actions

- `sf-view-property-block-answer {id, accepted, values?}`, cancelable: a
  refused event reopens the block.
- `sf-view-property-block-expired {id}`: an open block passed `expires-at`.
- `sf-view-property-block-open {id, field, value}`: a reference value pressed.
- `confirm()`, `cancel()`, `answer({accepted})`, `open()` (the confirm
  surface of SIMAI Framework, as `sf-confirm-change`), `settle(result)`;
  `values` reads what a Send would carry now.

## Accessibility

A region named by its heading, else «Данные». The status line is a polite live
region always in the page; focus moves to it when the answers go, and to the
first field in error when a Send is stopped or refused. Field errors are
`role="alert"`. No implicit Enter-submits: a control in the flow owns its
Enter.
