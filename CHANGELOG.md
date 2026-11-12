# Changes

The set `view`, by its npm version `@simai-studio/view`; component versions
in brackets. The site page «Изменения» says the same in Russian.

## Next — not released

- `sf-view-properties` 1.14.0 (TR-13, decision C96 point 5): the section
  list beside the groups is vertical tabs, `sf-tabs type="vertical"`, not an
  `sf-tree`: a named tablist (`aria-label` is the sections label, one tab
  `aria-selected`), walked with the up and down arrows. A section's own icon
  is its tab's icon; a section without one no longer gets the tree's folder,
  while reading or arranging. The column is no longer a `nav` landmark while
  reading; while arranging it is still the `nav` of the component's own rows.
  The rule loads `cl-tabs` and no longer `cl-tree` / `cl-tree-item` (the
  passport's requires follow). A host that read
  `.sf-tree-item[data-value]` in `.sf-property-view-sections` reads
  `[role="tab"]` there; `selectSection`, the section events and the settings
  are unchanged. Made in ui-pro ahead of this set (2026-11-12). Contract test
  `view-properties-section-tabs`, probe `property-view`.

## 1.7.1 — not released

- `sf-view-table` 1.18.1: the toolbar holds still from its first frame when
  the page declares saved views (DEV decision msg-e39bb812). The table that
  is an `sf-view`'s content no longer draws on its own while the view's
  code is still on its way: the Loader defines the table first, and for a
  frame or two it showed its own toolbar (the search field across the whole
  row, the filter button and the saved-views control coming a frame later)
  before the view's skeleton replaced it, so the toolbar moved by the
  controls' width (182 px with saved views declared and 142 px without at
  1440; at 390 the bar went from 80 to 36 px tall). It draws once `sf-view`
  is defined, and the first toolbar on the page is the skeleton, whose
  saved-views slot (since 1.6.1) is the drawn control's place. Static
  markup a server printed is adopted as before. Probe
  `data-view-saved-views-first-paint` watches it frame by frame through the
  real Loader: sheets in the head, withheld and late, three loads, light and
  dark, 1440 and 390, with saved views and without.
- `sf-view-table` 1.18.1, also: on a phone the first drawn frame is the
  compact toolbar and the list when the answer was in before the code was
  defined (Core's early port call answered quickly, the normal case on a
  fast host; DEV acceptance D1). The table chose its layout by a width it
  read only after the first paint, so for one or two frames it drew the
  desktop toolbar (the search field across the row, Create and Filter on
  the rows below, 80-124 px, then 36; the field moved 88 px and Create 322
  px), also over a server-printed table. It reads its box's width before
  the first render now. Probe `data-view-saved-views-first-paint` adds the
  data-first order (the answer at once) beside skeleton-first.
- `sf-view-table` 1.18.1, also: the content table waits for `sf-view` at
  most 3 s, or half a second after the view's script fails to load (the
  Loader tries the other form once), and then draws on its own, without the
  view's toolbar, with one console warning; a view whose code never came
  left the area blank for the page's life (D2). Probe
  `data-view-table-without-view`.
- The site page «Изменения» lists every version since 1.2.0 (it stopped at
  1.1.0).
- Known limit: at 1440 the filter button, the saved-views control and the
  search field's start still move 1.1 px once, with saved views and
  without, in the frame the icon font's subset is replaced (R078): the
  button's label is set again 1.1 px wider. It is the SIMAI Framework's
  font loading, not the set's; the probe reports it as a font step.

## 1.7.0 — 2026-11-11

Carries 1.6.1, which was not published on its own.

- `sf-view` 1.12.0:
  - A page asks the view to save a shared saved view with `save`
    (`sf-view-save {kind: "view", key, label, revision?, roles?}`,
    vocabulary 1.1.5 §9). The view raises `view.save_shared` as before; a
    save of another kind is left alone. The former names
    `sf-view-saved-view-intent` and `sf-data-view-saved-view-intent` are
    dated aliases until 2027-01-01: still heard, their detail read as a
    view, each use noted in `SF.deprecations`. The new name sent without
    `kind` is read as a view too and is not noted.
  - The first paint holds the optional toolbar controls known before the
    answer: the layout switch (`layout-switch`), and the create kinds' arrow
    and the toolbar actions' button when the page gave its table
    `createItems` or `toolbarActions` before the first paint. On a desktop
    table the search field no longer moves when they are drawn. The list's
    sort button is still drawn with the answer (its column is the port's),
    so a compact list with a sortable column still moves the field: see the
    known limits below.
- `sf-view-table` 1.18.0: the table's own windows by their C32 kind, from
  the Framework's popup widths: the filter with its saved views and the
  column settings are panels (`--sf-popup-panel-width`, 20rem, 18rem
  compact, or the trigger's width when wider); saving a template and a
  chip's filter are forms (`--sf-popup-form-width`, 20rem, 18rem compact;
  they were as wide as their content). The menus keep `sf-menu-context`'s
  widths.
- `sf-view-flow` 1.1.2 (preview): over the new pair a declined answer says
  nothing (SIMAI Framework C35/R067): the status line is empty where it
  said «Отменено». Probe `p2-cancel` follows.
- Known limits:
  - The list's sort button is not held by the first paint. A compact list
    with a sortable column (every phone list by default, and a desktop
    `layout="list"`) moves the search field when the answer draws the sort
    button: 44 px at size 1 (48 in a desktop list), 36 px at size 1/2 and
    under compact density. It moved 132 px on a phone in 1.6.0. The fix
    needs a first-paint hint in a later `simai.dataview-port`.
  - Controls the page gives after the first paint (`setCreateItems`,
    `setToolbarActions` once the skeleton is on screen) are not held.
  - A table forced to `layout="table"` on a phone opens its forms (saving a
    template, a chip's filter) as a 320 px window at the trigger, not as the
    bottom sheet SIMAI Framework C32 asks for on a phone (open, C19). The
    phone list (`layout="auto"`) opens its filter as a full-width bottom
    sheet and offers no template saving.
  - On a page where the icon font arrives late, a date field drawn by
    `sf-view-flow` (its `sf-input-date`) is 1 px shorter once the icon font
    is in (29 → 28 px line, the flow 339 → 338 at 390). The date control's
    wrapper sits on the baseline of the calendar icon, which the SIMAI
    Framework holds at size 0 until its font is loaded. The fix is in the
    SIMAI Framework (`sf-input-date`'s wrapper aligned to the top); the
    first-paint gate lists `view-flow/ask` as a known failure until the set
    is repinned on the pair that carries it (DEV waiver, this release only).

## 1.6.1 — not published (carried by 1.7.0)

- Built over SIMAI Framework `ui-2bd5a3ab478a` (ui-source `d25a01f9989d`,
  npm `@simai-studio/ui@5.20261110.1541`, core.runtime 1.51.0); the set now
  needs core.runtime 1.51.0 or newer, the pair that carries the roles
  `--sf-surface-underlay` and `--sf-surface-place-solid` the C43 rows read.
- `sf-view-table` 1.17.1:
  - The head row is on the ladder: a one-line row of its step, 40 at size
    1/2 and 48 at size 1 beside rows with the box and menu, with or without
    the box and the sortable column controls (it was 45 and 57 with them,
    33 to 41 without). `--sf-table-head-block-size-*` say 40 and 48.
  - The published box agrees with the tables under page density (C22): the
    `-1/2` names are the `size="1/2"` table on every page, 40/48/40 on a
    compact page too (they said 36/40/29); the `-1` names are the table
    without a size in the density they are read in. They are also declared
    on every element with `data-sf-density`, so a normal region of a compact
    page reads the normal box.
  - A draw reads the column settings once (simai/ui-pro#1, counted over
    one `setRows()` draw: 268 reads for 8 rows and 343 for 60, now 4), and an
    idle row's actions cell is the bare cell (simai/ui-pro#2: 29 nodes a row,
    was 31).
  - A selected row, a selected list item and the open record give a tonal
    badge on them a solid base
    (`--sf-surface-underlay: var(--sf-surface-place-solid, var(--sf-surface-place))`,
    C43), so a warning or error fact keeps its colour there (pair
    `ui-2bd5a3ab478a` and newer).
- `sf-view` 1.11.1: when the page declares saved views before the first
  answer, the first paint holds the saved-views control's place in the
  toolbar, and the search field no longer moves when the control is drawn
  (it moved 54px at 1280); the skeleton's head and toolbar gap follow the
  table. The skeleton's toolbar is the drawn one: the filter at the start,
  the field and the create button at the end, the buttons as wide as their
  labels make them (they were a fixed three controls, 9.72 / 16.5 px short),
  and in the compact list the field first with the two as squares after it
  (the field moved 116 / 92 px on a phone). The search field no longer moves
  from the first paint to the drawn toolbar, except where the list's sort
  button is drawn: a phone list with a sortable column still moves it 44 px
  (36 px at size 1/2), see the 1.7.0 known limits.
- `sf-view-properties` 1.13.3: the controls the panel draws (the open-all
  bar, the group and section buttons, the section tabs, the profile picker,
  the edge controls) carry the panel's size only when it has one (C22), as
  `sf-view` and `sf-view-table` do since 1.6.0: under compact density a
  panel with no size draws them at 32, size 1 keeps 40. Probe
  `property-view-density-controls`. Nothing to change for a host.
- Proposal, not built: a section rail in the `sf-view-properties` skeleton
  (package/README.md).

## 1.6.0 — 2026-11-10

- Built over SIMAI Framework `ui-a0370c0c99fb` (ui-source `7d2f4dc74fdf`,
  npm `@simai-studio/ui@5.20261110.34`, core.runtime 1.49.0); the set still
  needs core.runtime 1.43.0 or newer.
- The list of resources (owner decision C31), with no new tag.
  `sf-view-table` 1.17.0:
  - `columns[].list` gives a column its role in a list row: `status` (an
    `.sf-dot` whose word is its tooltip and its accessible text), `title`,
    `supporting` (joined into the second line), `fact` (an unlabelled
    `sf-badge` in columns of one width, quiet when fine, warning or error
    when not) or `hidden`. A column without a role stays out of the list.
  - `quick-actions` puts up to three row actions in the row as icon buttons,
    always shown; the rest are in a `more_horiz` menu in place of ≡, and
    below a 37.5rem container the quick ones fold into it.
  - `row-open="row"` opens the record from anywhere in the row, through the
    same `view` intent as the title link; the row's buttons keep their own
    work, ↑/↓, Home and End move between the rows, a double click opens once.
  - `layout-switch` draws a list/table `sf-segmented` in the toolbar, not
    below `list-below`; the choice is kept per person (`SF.Preferences` field
    `layout`) and said by `sf-view-table-layout-change {layout}`; the action
    `set-layout {layout}` sets it.
  - On a phone (below 32rem) a list row is `--sf-ui-3--control-height` and
    keeps only its most worrying fact.
  - A list row is a rung of the ladder: 48 at size 1/2, 56 at size 1.
  - One row model for every table: a body cell's padding comes from the
    rung of two lines of the step's text, and a row stands on the rung
    below it. Size 1/2: one line 40 (was 45), two lines 48 (a link with its
    subtext was 48, a wrapped text 53). Size 1: one line with the row menu
    48 (was 73), two lines 56. The size-1 head is 41, 57 with its box (was
    57 and 73). The published `--sf-table-row-*-block-size-*` follow.
  - A column with a list role draws the same in a table cell: a status as
    the dot with its word, a fact as its badge.
  - The row the person is on (`data-current`, where the keys and a press
    leave them) is kept apart from the record the page has open (`current`,
    `aria-current`): the keys no longer move the open record, and list rows
    carry `aria-current` too.
  - Under compact density (`data-sf-density="compact"`, desktop) a table
    without a size takes the ladder one rung down: 40 with its controls, 48
    with a supporting line (they were 57 and 61).
  - The list's look points (owner, 2026-11-09): the title in the text colour,
    medium, underlined on hover; the open record filled with
    `--sf-primary-container` beside `aria-current`, the keyboard's row with
    the focus ring only; «more» 36 on a phone; the search field, Create and
    the rows on one line (R077).
  - The controls inside are relative (C22, a Larena report): a table without
    a size writes no size on its toolbar, menus and row controls, so compact
    page density gives them 32 at 1280 (they stayed 40); a host with a size
    still hands it down.
- `sf-view` 1.11.0 passes its own `layout` on (it used to set `auto` for a
  page's list and `table` for an embedded one), and `layout-switch`,
  `list-below`, `quick-actions` and `row-open` with it; `list-roles="key:role,…"`
  gives the columns their list roles for a host on `simai.dataview-port`
  1.14.0 or earlier. The view speaks 1.15.0, whose columns carry `list`, and
  passes it on; `list-roles` is a dated alias until 2027-01-01, noted in
  `SF.deprecations`. A saved view carries the layout in `settings.layout` and
  opening it puts the layout back; the first paint draws the person's choice.
  A view without a size writes none on its table, page row, selection band or
  Show all (C22): under compact density they follow the page.

## 1.5.1 — 2026-11-09

- Built over SIMAI Framework `ui-b4a77681f0a7` (ui-source `a29cc9989beb`,
  npm `@simai-studio/ui@5.20261109.1121`, core.runtime 1.47.0); the set
  still needs core.runtime 1.43.0 or newer.
- `sf-view-table` 1.16.1: the avatar's `max-width` reads
  `--sf-table-avatar--max-width` with the fallback `none`, what it drew when
  no page set it; the pair range lists no variable bound by the page.
- `sf-view-properties` 1.13.2 (with the skeleton fix next): the arranging bar's section title
  reads rung 1 of the text ladder (`--sf-text--size-1`,
  `--sf-text--height-1`), 16/24 at sizes 1 and 1/2, what it drew while it
  named `--sf-title-small`, a role the Framework has no token for.
- Probes: `table-behaviour`, `table-list-layout`, `data-view-declared-port`
  and `data-view-reloads` load the icons sheet, which draws an icon as one
  glyph on a page with no Loader (ui-source `ea3a53ca`); over the earlier
  pairs the icons drew nothing, so these probes measured controls 0 wide.
  `table-list-layout` also loads `sf-input` and the control sheets and
  requires every toolbar control drawn; `data-view-declared-port` lets the
  toolbar move when a port brings a capability more (a control comes in) and
  holds everything outside it still. Nothing changes on the page.

- `sf-view-properties` 1.13.2: the loading skeleton's strip of section tabs
  takes the box `sf-tabs` takes (simai/ui-pro#3): a tab's height (the
  control height of the view's size), the tabs' hairline and their empty
  panel, from the tabs' own sheet. It was one text line, so with
  `sections-as="tabs"` the record moved down by 49px at size 1 (41px at
  1/2) when it came; now the first group stands where the skeleton drew it.
  `skeleton.html` prints the same markup. Nothing to change for a host.
  Probe `property-view-pro-issues-3-4` holds #3 and #4 in both themes.

## 1.5.0 — 2026-11-09

- Built over SIMAI Framework `ui-cb287da78ab1` (ui-source `44a5efda6649`,
  npm `@simai-studio/ui@5.20261109.559`, core.runtime 1.45.0); the set now
  needs core.runtime 1.43.0 or newer (it was 1.25.0): it names the theme
  roles by their C16 names and the shadow places of C20.
- `sf-view-table` 1.16.0: `sf-view-table-template-save` carries
  `{templates}`, a list of one template (saved from the form) or several
  (Apply on the Templates tab), each `{key, label, selected, data,
  settings}`, at least one (decision «Event detail that is not a flat
  object», 2026-11-09). The detail used to be the template itself or an
  array of them; `sf-table-template-save` (until 2027-01-01) and
  `onTemplateSave` (until 2026-12-01) keep that detail through the
  element's adapter. A host listening to `sf-view-table-template-save` reads
  `detail.templates`.
- `sf-view` 1.10.0: reads `detail.templates` of the table's template save,
  and a bare template or array from an older table until 2027-01-01.
- `sf-view-properties` 1.13.1 and `sf-view-flow` 1.1.1: a choice drawn as
  buttons relates `cl-segmented`, the rule that serves `sf-segmented` and
  `sf-button-group` since the pair `ui-d6f01121baca` (`cl-button-group` is
  its forwarded former name).
- All four: the theme roles and the background utility by their C16 names
  (`--sf-surface-page`, `--sf-surface-area`, `--sf-surface-popup`,
  `--sf-shadow-popup`, `--sf-primary-outline`, `--sf-primary-state-select`,
  `bg-surface-page`; the former names are dated aliases of the same values);
  the buttons ask for `appearance="ghost"`, `scheme="on-surface-variant"`
  and `status="danger"` (link, secondary and error are their former names,
  drawn the same). The reference names one `args` object per action
  (standard §4.4); the methods already took that form beside the fields in
  order. First-paint snapshots retaken over the pair. Nothing changes on the
  page.
- `sf-view-table` 1.15.2: its windows (filter, field and settings windows,
  menus) are a surface of the one layer stack: a press outside and Escape
  reach them through the stack, only while they are on top, and they are
  drawn at the stack's height; Escape on a window inside a record panel no
  longer closes the panel too. `--sf-table-context-menu--z-index` still wins.
- `sf-view-properties` 1.13.0 (1.12.0 and 1.13.0 in one step, two branches
  merged; port 1.18.0 and titles in 1.12.0, the layer stack in 1.13.0):
  speaks `simai.property-view-port` 1.18.0 beside 1.0.0-1.17.0. The port
  declares the settings the set-drawn types read since 1.11.0 (`currency`,
  `columns`, `minRows`, `maxRows`, `parts`) and a number field's `min`,
  `max`, `step` and `precision`, all optional; the SIMAI Framework field
  renderers (module.smart-field-renderers 1.5.0) draw the cells and filters
  of money, percent and items and keep a number whose value is a string a
  decimal string. Titles read the text ladder, not the heading roles, under
  the heading ladder (C21): the title at size 1/2 keeps rung 2 and a group
  title rung 1; unchanged on the page. The panels stand on SIMAI Framework's
  one layer stack (core `layer-stack.js`), the stack `sf-modal`, the drawers
  and the menus share, instead of a list, an Escape listener and a dim of
  their own. Escape reaches the top layer only: over an `sf-modal` or a menu
  opened from a panel it closes that, not the panel, and of two stacked
  panels the upper one. A panel below another is dimmed by the overlay of
  the one above (the drawer's scrim), with no opacity of its own. A panel
  still never closes itself: every close its drawer starts is asked of the
  host as `sf-view-properties-close` with `unsaved_fields`, now also with
  `reason` `outside` for a press on the dimmed page, which closed the drawer
  and left the panel open before. Escape in a naming row leaves the row
  only. Same pair and core.runtime floor (1.25.0).

## 1.4.0 — 2026-11-08

- `sf-view` 1.9.0: speaks `simai.dataview-port` 1.14.0 beside 1.0.0-1.13.0;
  a selected bulk action the host asks to confirm is asked of the person and,
  confirmed, sent again with the digest (`payload.confirm`), as single writes
  already were.

- `sf-view-table` 1.15.1: a filter option drawn as a badge is a tight badge
  (`sf-badge` `tight`, SIMAI Framework `sf-badge` 1.3.0, pair
  `ui-2a671352d67b`), as a cell's choice badge is; on an older pair the
  attribute is ignored.
- `sf-view-properties` 1.11.1: the record's title keeps rung 3 and the views'
  list heading rung 4, where they fell back to the heading-4 and heading-3
  roles that the content heading ladder (`tokens.typography` 1.2.0, docs
  review R022) moves to smaller rungs; unchanged on the page.
- Built over SIMAI Framework `ui-0c23f6a0af12` (ui-source `da48ba8fde77`,
  npm `@simai-studio/ui@5.20261108.1449`, core.runtime 1.39.0), the pair
  with the content heading ladder and `simai.dataview-port` 1.14.0; still
  runs with core.runtime 1.25.0 or newer (the tight badge needs
  `ui-2a671352d67b` or newer).

## 1.3.0 — 2026-11-07

- `sf-view-properties` 1.11.0: five property types drawn by the set from
  SIMAI Framework controls (Larena property types standard, notes of
  2026-11-03): `money` {amount, currency} (the currency's sign, or a currency
  choice; minor digits by ISO 4217), `percent`, `items` (rows over columns:
  typed and computed cells, totals, rows added, moved and removed within
  `minRows`/`maxRows`, a card a row where narrow), `compound` and
  `ru.requisites` (checked part by part and together). Decimal strings
  throughout, never a float; an entry that is not a value yet holds the save.
  Their settings are due in `simai.property-view-port` 1.18.0. The row
  bounds Larena writes `min_rows` and `max_rows` are read as `minRows` and
  `maxRows`, as every field key of the port is camelCase; a column's `type`
  and `settings` are read beside `propertyType`.
- `sf-view-flow` 1.1.0: draws the same five types through the shared field
  value.
- Same SIMAI Framework pair `ui-1e5ec795a1ce` (ui-source `54c89e61ef9b`, npm
  `@simai-studio/ui@5.20261106.1146`); needs core.runtime 1.25.0 or newer.

## 1.2.0 — 2026-11-06

- `sf-view-flow` 1.0.0 (preview): a few properties as a block in a
  flow (a chat, a feed): shows a record's fields, or asks for a few and sends
  them, then keeps the answer read-only. Same field descriptors as
  `sf-view-properties`; the answer is the event
  `sf-view-flow-answer {id, accepted, values}` and the host settles
  it with `settle()`. Design: `docs/design/sf-view-flow.md`.
- `sf-view-properties` 1.10.1: the field value moved into
  `js/field-value.js`, shared with the new block; no change in behaviour.
- `sf-view` 1.8.2: its first paint snapshots retaken over the new pair
  (`sf-dropdown` 1.6.0 prints its empty-state placeholder); no change in
  behaviour.
- Built over SIMAI Framework `ui-1e5ec795a1ce` (ui-source `54c89e61ef9b`,
  npm `@simai-studio/ui@5.20261106.1146`, core.runtime 1.30.0), the pair that
  registers `sf-view-flow`; still runs with core.runtime 1.25.0 or newer.

## 1.1.0 — 2026-11-05

- `sf-view` 1.8.1: a table the host wrote `selectable="false"` or
  `settings="false"` on keeps it; the view's chrome wrote over both, and a
  list came back with row boxes and a settings column (Larena, the sites
  list).
- `sf-view-table` 1.15.0: dates, dates with a time and times the host does
  not format read in the page's language (SIMAI Framework `format-date`); an
  `html` cell shows its text, not its markup; a cell of several files shows
  each file's name with its icon (it was empty); the settings column is left
  out when it would open nothing (no column settings, no row actions, no row
  reordering).
- `sf-view-properties` 1.10.0: a `datetime` and a `time` are edited with one
  `sf-input-date` (mode `datetime`, `time`) instead of the view's own pair;
  dates shown read in the page's language; a colour palette wraps inside a
  half-width field; a closed panel draws nothing (its close button and shadow
  stayed over the page); a value brought back to what the record holds is no
  change.
- Same SIMAI Framework pair `ui-62b1d9b6dc8d`; needs core.runtime 1.25.0 or
  newer.

## 1.0.0 — 2026-11-05

- First version of the set: `sf-view` (1.8.0), `sf-view-table` (1.14.0) and
  `sf-view-properties` (1.9.1), moved from the SIMAI Pro package (ui-pro
  `c2a3b48d140f`) with no change in behaviour.
- Built over SIMAI Framework `ui-62b1d9b6dc8d` (ui-source `ec2f29dfa5df`,
  core.runtime 1.28.0); needs core.runtime 1.25.0 or newer.
- Former tags `sf-data-view`, `sf-table`, `sf-property-view` work until
  2027-01-01.
