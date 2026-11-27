# Changes

The set `view`, by its npm version `@simai-studio/view`; component versions
in brackets. The site page «Изменения» says the same in Russian.

## Version line

Component version numbers are assigned only in this set (draft set standard
§5.7). ui-pro's copies of the set's folders shipped numbers of their own,
which are not versions of this set: `sf-view` 1.12.6, `sf-view-table`
1.17.1, 1.19.7, 1.19.8 and 1.20.4, `sf-view-properties` 1.16.2, 1.16.4 and
1.16.8. No set release shipped any of them (this set's own unreleased steps
`sf-view-table` 1.17.1 and `sf-view-properties` 1.16.4 and 1.16.8 carry the
same numbers with other content); every next set version is above them
(`sf-view` 1.13.x, `sf-view-table` 1.21.x, `sf-view-properties` 1.16.10 and
up). Each component.json says the same under `x-decisions`
`pro-copy-versions`.

## Unreleased — view round 21

View round 21 (round/view-r21, from main 17436f4 = view 1.20.0): four items
left open by 1.20.0. Over the SIMAI Framework pair `ui-4f5678e8c0ed`
(ui-source `1b1b9ea75`, npm `@simai-studio/ui@5.20261127.1637`, core.runtime
1.70.0); the set still needs core.runtime 1.69.0 or newer. Not released;
package 1.20.1 is a candidate.

- `sf-view-properties` 1.33.1:
  - a scale value («Оценка клиента») writes its text at the value's size
    and line through sf-progress-scale's public text variables (1.5.0 of the
    pair), so the label and the value share one baseline at 1440; the row
    stays 40 px (VL-90);
  - a bar of actions under a record on its own page is as wide as the record (it
    was 16 px wider, 12 at 390, and a record that scrolls itself drew a
    sideways scrollbar);
  - on the record's own page «Сохранить» / «Отмена» of the whole-record
    editor hold the window's bottom while the record is in view, as the
    arranging bar does.
- `sf-view-table` 1.40.1: the row menu «≡» takes the focus into its first
  item when it opens and gives it back to the «≡» when it closes, by mouse
  and by keyboard; the table no longer pulls the focus back to the row.
- `sf-view` 1.41.1, `sf-view-board` 1.5.2, `sf-view-cards` 1.5.4,
  `sf-view-calendar` 1.3.3, `sf-view-flow` 1.3.2: repinned on the pair
  (field renderers 1.30.3, group build 20 menus; the flow's «ask»
  first-paint snapshot written again); their own code and markup are
  unchanged.

## 1.20.0 — 2026-11-27

View round 20 (round/view-r20 4cd1b98, from main 2b0a19f = view 1.19.1;
ui-control `control/evidence/2026-11-26-view-r20`, accepted by DEV in
`control/evidence/2026-11-27-view-r20-acceptance-2`; release evidence
`control/evidence/2026-11-27-view-1.20.0-release`): the five
returns of the round 19 acceptance (register VL-95..VL-99). Over the same
SIMAI Framework pair `ui-73df5d1b4d4c` (ui-source `5e30b946fd0e`, npm
`@simai-studio/ui@5.20261125.1855`); the set still needs core.runtime
1.69.0 or newer. New public behaviour: a record on its own page draws its
own grey ground (VL-85), hence a minor version. `sf-view` 1.41.0,
`sf-view-table` 1.40.0, `sf-view-properties` 1.33.0, `sf-view-flow`
1.3.1; `sf-view-board` 1.5.1, `sf-view-cards` 1.5.3 and `sf-view-calendar`
1.3.2 unchanged.

- `sf-view-properties` 1.33.0: «Настроить вид» draws the record as reading
  draws it (study S-B variant A, SB-C15, VL-95): at a desktop width the
  label stands beside its value in the label column, the value starts where
  reading starts it (201 px from the group's edge in a panel, not 61), a
  one-line row is the control height (40, not 72), the groups are on the
  card surface with reading's inset, and the columns are reading's (two
  only from 44rem of the fields' room). On a phone the label stays over its
  value, the value under the label's words. The handle stands in the
  label's cell.
- `sf-view-table` 1.40.0: «Плотность → Компактная» lowers the rows below
  60rem in a compact area too (VL-96): the phone's list of records goes
  from 52 to 44 and back with «Обычная». A tablet table's one-line rows
  stay at the height of the row menu «≡» (the SIMAI Framework's density is
  a desktop one).
- `sf-view` 1.41.0: «Сохранить» of a changed view opens an ordinary menu
  («Сохранить для всех» where allowed, «Сохранить как новое», «Сбросить
  изменения»), the page's one menu as every other menu of the head, not a
  panel of buttons across its width (VL-99); on a phone the same menu.
- VL-97 (the phone kind menu after `?kind=board`) and VL-98 (the phone
  record section tabs take a 44 px press) pass on view 1.19.1 over this pair
  already; nothing changed for them.

DEV additions to the round (VL-85, VL-90, VL-93, VL-22, the VL-95 record page):

- `sf-view-properties` 1.33.0 also: «Отменить» of arranging reads the
  record again when something was moved, so a field hidden and cancelled is
  back on the next «Настроить вид» (VL-93; a read, no view write). A group
  edited in place has its «Сохранить» and «Отмена» under its last row,
  inside the group (SB-C13, VL-90), not in the panel's foot. A person field
  whose choices come with the field (`options`) is edited from that list
  where the host has no field-options picker (VL-90). Rich text in a row has
  no outer paragraph margins: a one-line «Описание» is a 40 px row with its
  text on the label's line. A record on its own page draws its own grey
  ground (`--sf-surface-area`, the panel's inset, the surface radius) under
  its white groups (VL-85, DEV decision 2026-11-26).

Round 2 (the acceptance return, DEV decision 2026-11-27):

- `sf-view-properties` 1.33.0: the grey ground is drawn only when the record
  is the page: not a panel, and no other component above it (across shadow
  roots). Inside another component, a chat message of Chat 1.1.1 among them,
  the record draws no ground and measures as in 1.32.1 (view 1.19.1): the
  chat card 154 px at 1440 and its edit card unchanged, light and dark.
- `sf-view-properties` 1.33.0: while arranging, a text value («Название»,
  an empty «Комментарий») stands on its label's line in the control height,
  as the other values do; the arranging bar is sticky at the bottom of the
  record's own scroll area (it holds the window's bottom where the page gives
  the record the window's height).
- `sf-view-table` 1.40.0 also: code in a cell (an include field's first
  line) is one line with an ellipsis, so the row stays 40 (VL-22). A table's
  own rows in a compact area keep the normal ladder below 60rem (C146 (1));
  only the phone's list of records steps there.
- `sf-view-flow` 1.3.1: the person field with inline choices, through the
  set's shared field value.
- Not changed, waiting: the scale value «40 %» is the renderer set's 14 px
  text in a 16 px row (the SIMAI Framework field renderers draw the scale at
  size 1); VL-72 and the avatar rows of VL-90 measure the avatar's initials
  as the cell's text (the head and the name are on their lines).
- Known issues, open in this release (next View round; the same on 1.19.1):
  - In whole-record edit and while arranging, the record's action bar is
    16 px (12 at 390) wider than the record, so a record that scrolls
    itself shows a horizontal scrollbar under the bar.
  - The whole-record editor's «Сохранить» / «Отмена» are not sticky to
    the window.
  - The row menu «≡» does not close on Escape after a mouse open (the
    SIMAI Framework menu, group build 20).
  - VL-90: the scale value text in a record row (the SIMAI Framework
    field renderers, group build 20).

## 1.19.1 — 2026-11-25

The include field fix over the SIMAI Framework pair of group build 19
(ui-control `control/evidence/2026-11-25-view-1.19.1-release`).

- Over the SIMAI Framework pair `ui-73df5d1b4d4c` (ui-source
  `5e30b946fd0e`, npm `@simai-studio/ui@5.20261125.1855`, core.runtime
  1.69.0). The set needs core.runtime 1.69.0 or newer (was 1.68.0).
- The include field no longer stops the record card from drawing when it
  moves to the next record («Cannot set properties of null (setting
  'data')», View round 19 include-w1): the set's package core
  (view-common) now carries the pair's field renderers 1.30.2, whose
  include view owns no lit DOM. The same package core carries the pair's
  menu opener, which waits for the context menu's code on a press.
- `sf-view` 1.40.1, `sf-view-table` 1.39.1, `sf-view-properties` 1.32.1,
  `sf-view-board` 1.5.1, `sf-view-cards` 1.5.3, `sf-view-calendar` 1.3.2
  (patch: their Framework copy or its provenance follows the pair; their
  own code and markup are unchanged); `sf-view-flow` 1.3.0 unchanged.
- The owner remarks register over this build and pair: VL-77 (the split
  button divider) now passes with the pair; see the release evidence for
  the counts.
- Known issues, open in this release (next View round):
  - Customize mode and the record card do not yet agree.
  - Density at 390.
  - The kind menu after `?kind=board`.
  - The phone section tabs are 36 px high.
  - The «Сохранить» menu is to be a plain menu.
  - The email field type on the site (the site's side).

## 1.19.0 — 2026-11-25

View round 19 (round/view-r19; accepted on 2026-11-25: ui-control
`control/evidence/2026-11-25-view-r19-acceptance`); the round's entry
below.

- Over the SIMAI Framework pair `ui-3963bfe39302` (ui-source
  `96234dd717fb`, npm `@simai-studio/ui@5.20261124.2316`, core.runtime
  1.68.0). The set needs core.runtime 1.68.0 or newer (was 1.67.0).
- `sf-view` 1.40.0, `sf-view-table` 1.39.0, `sf-view-properties` 1.32.0,
  `sf-view-flow` 1.3.0, `sf-view-board` 1.5.0, `sf-view-cards` 1.5.2,
  `sf-view-calendar` 1.3.1.
- The owner remarks register over this build and pair: 82 pass, 1 fail
  (VL-77, the SIMAI Framework's: the split button divider, group build
  19), 6 superseded, VL-69 not built, 9 open (no register check yet).
- Known issues, open in this release (next View round unless named):
  - VL-77: see above; it goes with the next SIMAI Framework pair.
  - The include field error in the record panel and S-A 2's per-column
    phone switch: see the round's entry below.
  - Customize mode and the record card do not yet agree.
  - Density at 390.
  - The kind menu after `?kind=board`.
  - The phone section tabs are 36 px high.
  - The «Сохранить» menu is to be a plain menu.

### view round 19

View round 19 (round/view-r19, from main 3b010b7 = view 1.18.0): the owner
remarks VL-76..VL-94 on the View review page and the studies S-A (phone)
and S-B (record card) as decided. Over the SIMAI Framework pair
`ui-3963bfe39302` (ui-source `96234dd717fb`, npm
`@simai-studio/ui@5.20261124.2316`, core.runtime 1.68.0); the set needs
core.runtime 1.68.0 or newer.

- `sf-view` 1.40.0: «Дублировать» for «Сохранить копию» (VL-79). A view
  that differs from its save shows «Сохранить» with «Сохранить как новое»
  and «Сбросить изменения» in its menu, nothing when unchanged (VL-80).
  «Вид» shows the applied density after an outside change (VL-76). On a
  phone the filter button stands at the row's end and «Колонки» stays as an
  icon (VL-83), the chip row scrolls (VL-89), and «Вид» leaves out
  «Текст в одну строку» and «Линии между столбцами» (S-A 1). The narrow
  kind menu marks the current kind with `aria-checked`.
- `sf-view-table` 1.39.0: the header gear opens the column settings at the
  gear (VL-81); the table no longer moves down when they open.
- `sf-view-board` 1.5.0: the card menu closes, no hang (VL-88). On a phone
  «Выбрать» / «Готово» and a long press choose cards (S-A 4); boxes and
  lane tabs are hit over 44 on a coarse pointer; no empty box slot on a
  fine pointer.
- `sf-view-properties` 1.32.0: the record card variant A, arranging draws
  what viewing draws, the draft save model C1 («Сохранить», «Сохранить для
  всех», «Отменить», «Мой вид», «Вернуть общий вид»), the saved layout
  carries its collection (S-B, VL-93). On a phone the sections are tabs on
  top with a sideways swipe (S-A 3). The stacked tab list no longer covers
  fields (VL-92). «Значок» from the tab menu works on the selected tab
  (VL-91).
- Known issues, open in this round:
  - An include field in the record panel throws «Cannot set properties of
    null» on the next record: the cause is in the SIMAI Framework
    (field-renderers include view replaced under lit); it goes back to the
    Framework.
  - VL-77 (the split button divider) is the Framework's GB19.
  - S-A 2's per-column «на телефоне» switch inside the one column list
    waits for a Framework sf-settings item with a secondary switch (GB19);
    the column list has no device tabs.

## 1.18.0 — 2026-11-24

View round 18 (round/view-r18; accepted on 2026-11-24: ui-control
`control/evidence/2026-11-24-view-r18-acceptance`); the round's entry
below.

- Over the SIMAI Framework pair `ui-b4f79e1c58b7` (ui-source
  `e59dbad1c108`, npm `@simai-studio/ui@5.20261123.1101`, core.runtime
  1.67.0). The set needs core.runtime 1.67.0 or newer (unchanged).
- `sf-view` 1.39.0, `sf-view-table` 1.38.0, `sf-view-properties` 1.31.2,
  `sf-view-flow` 1.3.0, `sf-view-board` 1.4.0, `sf-view-cards` 1.5.2,
  `sf-view-calendar` 1.3.1.
- The owner remarks register over this build and pair: 71 pass, 1 fail
  (VL-73, the SIMAI Framework's: record value tags 14 px on a 16 px record
  value, fixed in the Framework's next pair), 6 superseded, VL-69 not
  built, VL-O1 open for the owner.
- Known issues, open in this release:
  - VL-73: see above; it goes with the next SIMAI Framework pair.
  - VL-69: parts by one setting `parts` and the quiet line for a hidden
    filter are not built yet.
  - The folded head's kind menu marks the current kind with a check glyph
    only; its items carry no `aria-checked` (next View round).

### view round 18

View round 18 (round/view-r18, from main 517da06 = view 1.17.0): DEV's
returns on 1.17.0 (register VL-71, VL-74, VL-75, the r17 acceptance note
VO-2, the view site guide's V1-V4, and V5).

- `sf-view` 1.39.0: «Флажки» off (a chrome without `select`) with rows
  marked takes the bar away with the boxes and keeps the marks; the boxes
  back bring the marks and «Выбрано N» back (VL-71). A host without
  `personal-column-settings` keeps a «Колонки» change for the session with
  no notice, as 1.11.0 did (V1). A saved filter or a condition no longer
  marks the view «Изменено» (C414, V4). A board's «Вид» lists its lanes with
  a switch each, the way back for a hidden lane (V2). The saved filter marks
  «Общий» and «По умолчанию» are the size of the «⋯» beside them (VL-74).
  The chrome and head descriptions name «Колонки» and «Вид» (V3). The
  list's kind switch shows the kind drawn, whether a page's
  `layout="board"`, `view.switchLayout()` or a press drew it, and a press
  on another kind changes it (V5). The list's width crossing the phone
  line no longer raises the window's «ResizeObserver loop completed»
  notice: the head is rebuilt on the next frame.
- `sf-view-table` 1.38.0: on a phone the list row's second line (the words
  under the title, the sum and the date) is the row's text size, 14 / 20,
  secondary by ink only (VL-75); a list row's figures stand on its line
  (sf-badge `line="text"`).
- `sf-view-board` 1.4.0: «Скрыть колонку» names «Вид» as the way back;
  `laneChoices` and `showLane(value)` (V2); its width crossing the phone
  line no longer raises the «ResizeObserver loop completed» notice.
- `sf-view-cards` 1.5.2: keep-selection and all-selected descriptions as
  1.17.0 behaves (C413, V3).
- `sf-view-properties` 1.31.2: arranging stacked (a phone, a narrow panel)
  keeps a space step above «Вкладки», the hint starting where «Вкладки»
  does (VO-2).

## 1.17.0 — 2026-11-23

View rounds 14 to 17 with the modular step 1 (round/view-r14,
round/view-modular-1, their merge round/view-r15m, round/view-r15,
round/view-r16, round/view-r17; round 17 accepted on 2026-11-23 with no
return: ui-control `control/evidence/2026-11-23-view-r17-acceptance`); the
rounds' entries below. Versions 1.12.0 to 1.16.1 were candidates only and
were never published.

- Over the SIMAI Framework pair `ui-b4f79e1c58b7` (ui-source
  `e59dbad1c108`, npm `@simai-studio/ui@5.20261123.1101`, core.runtime
  1.67.0). The set now needs core.runtime 1.67.0 or newer (was 1.51.0).
- `sf-view` 1.38.0, `sf-view-table` 1.37.0, `sf-view-properties` 1.31.1,
  `sf-view-flow` 1.3.0, `sf-view-board` 1.3.1, `sf-view-cards` 1.5.1,
  `sf-view-calendar` 1.3.1.
- The owner remarks register over this build and pair: 67 pass, 0 fail
  (6 superseded, VL-69 not built, VL-O1 open for the owner).
- Known issues, open in this release:
  - VO-2 (low, older than round 17): at 390 in customise mode the hint «Ваши
    правки сохраняются сразу, только для вас.» starts left of «Вид» and
    «Вкладки» and touches «Вкладки» without a space step.
  - VL-69: parts by one setting `parts` and the quiet line for a hidden
    filter are not built yet.

### view round 17

View round 17 (round/view-r17, from round/view-r16 75d74a7, over
the pair `ui-b4f79e1c58b7`, ui-source e59dbad1c108, npm
`@simai-studio/ui` 5.20261123.1101; the set needs core.runtime 1.67.0 or
newer): VN-3 (register VL-12) and the set on the pair. Evidence: ui-control
`control/evidence/2026-11-23-view-r17/README.md`.

- `sf-view-table` 1.37.0: in a list whose «Показать ещё» follows the rows the
  sideways rail takes no room after the rows (VN-3). It was an empty 15 px
  strip at rest, so the button stood 27 under the last row (23 at 768); it
  is 12 now at 1440, 1280, 1024 and 768 and 8 on a phone. The rail keeps its
  scroll and its drawn bar, laid over the gap above the button without the
  page fill.
- `sf-view` 1.38.0: «Показать ещё» 12 under the rows at every desktop and
  tablet width (half a space step with a floor of 12, `--sf-b2`, as C77; it
  was 8 below 60rem), 8 on a list under 37.5rem; the skeleton follows. Its
  holder stands over the rail: a press on the button's top edge is the
  button's, the empty gap above it still reaches the rail and its bar.
- `sf-view`, `sf-view-table`: the Loader is read through its public calls of
  the pair: `SF.Loader.settled(tag)` for a display kind's module (no longer
  `SF.__internal.pendingTags`), and the table no longer hands a checked box's
  tick to the Loader (`adoptSelectionGlyphs` removed; group build 17 L1 shows
  it at once).
- `sf-view-table` 1.37.0, `sf-view-board` 1.3.1, `sf-view-cards` 1.5.1,
  `sf-view-calendar` 1.3.1: provenance of the Framework helpers
  `option-badge.js` and `field-renderers/index.js` follows the pair; the
  typed-cells probe reads a choice badge on the line of the row text (VL-54).
- The registry gives the board, the cards and the calendar `preview`: the
  pending entries of the passport test are gone.
- `sf-view-properties` 1.31.1: the record keeps its layout over the pair. On
  the whole screen «Изменить» keeps the two columns of reading, each label at
  its read place (VR13-2, C401): the pair's `sf-form` spans a start-labelled
  field across its grid, which moved «Клиент» 603 px left at 1440. The
  panel's foot bar keeps its own place under `sf-drawer`'s new content
  actions (D-SCROLL): it is no longer sticky with a negative margin, so
  arranging the view does not scroll the panel by 16 px.
- Browser probes follow the pair: the year marker's no-break space (A4), the
  settings drop line as `SF.Sortable`'s indicator (VR11-5), sections that
  never fold (`fold="never"`), the not-set ink composited in sRGB (C402).
- First-paint snapshots rewritten by `scripts/run-first-paint.mjs snapshot` over
  the pair (six files, no View markup change): the cards' choice badges are
  on the row text line (`line="text"`, the badge padding variable of the
  Pro option badge) and the flow's dates carry the year marker's no-break
  space (A4).

### view round 16

View round 16 (round/view-r16, from round/view-r15 bc08d40, over
the same pair `ui-b654460cad2a`): the returns VN-1 and VN-2 of the
acceptance of round 15. Evidence: ui-control
`control/evidence/2026-11-23-view-r16/README.md`.

- `sf-view` 1.37.1: on a desktop head the view strip keeps the display kinds'
  track at its own width (VN-1). With a record docked beside the list at
  1440 px the shrunk track measured less than its labels and sf-segmented
  folded itself into a select; the select took more of the line than the
  shrunk track and it unfolded, back and forth inside one frame («update loop
  limit reached», a «ResizeObserver loop»). The strip folds the kinds into its
  kind menu by its own measure, as since round 15. The cause in SIMAI
  Framework sf-segmented is written in the evidence.
- `sf-view` 1.37.1: «Сохранить представление» says what a view keeps — the
  presentation, the columns, the sort order and the page size, without the
  filter's conditions or the search (VN-2, owner decision C414; word
  `head-save-view-note`, ru and en). The saved filter's window keeps its note.

### view round 15

View round 15 (round/view-r15, from round/view-r15m f1f4d46, over
the same pair `ui-b654460cad2a`): the returns of the acceptance of
round 15m (VM-1..3), owner remarks register items VL-12, VL-48, VL-64, VL-65,
the bulk bar's size and owner decision C414. Evidence:
ui-control `control/evidence/2026-11-22-view-r15/README.md`.

- `sf-view` 1.37.0: the view strip keeps one line (VM-1). Where the display
  kinds no longer fit beside the views button, «Колонки» and «Вид» (a record
  docked beside the list narrows it), they fold into the strip's kind menu
  and come back when there is room; opening a record at 1440 no longer moves
  the rows down 40 px. «Сохранить представление» opens its own window (it
  opened the filter's), with the focus in the name field; Enter saves (VL-48).
  A view is saved without conditions (C414): `view.save` and
  `view.save_shared` carry the query without `filters`, `filters_chosen`,
  `saved_filter`, `search` and `page`. The bulk bar is the list head
  controls' size (the list's size, else 1/2), not a fixed 1. The view
  strip's line does not widen the head (`contain: inline-size`): at 768 px
  it pushed the page sideways and the list's observers looped (VM-2).
  Under a fixed page bar the list head and the table's head stick below
  `--sf-admin-shell-stick`, written by the Admin set's `sf-admin-shell`
  (its bar and the phone top line); without it nothing moves (AN-3).
- `sf-view-table` 1.36.0: the columns that fit, the pinned offsets and the
  sideways rail follow a width change in the next frame, so a record docked
  beside the list raises no «ResizeObserver loop» error (VM-2). The phone
  rows' list has no bottom inset: «Показать ещё» 8 px under the last row on a
  phone (VL-12).
- `sf-view-properties` 1.31.0: a value read in the record's list takes the
  height of the field it turns into (40 normal, 32 compact), and a group the
  card's own form edits is edited in place in the read list: «Изменить» moves
  no label and no row (VL-64, VR14-3, C401). «не заполнено» takes
  `--sf-on-surface-not-set` where the pair has it (VL-65, C402).
- Contract `simai.view-config/1` 1.1.0 (C414): a view keeps how to show, a
  saved filter what to show; `query.filter` is deprecated in a view (kept in
  the schema so 1.0 documents stay valid), §2a describes the saved filter.

### view round 15m (merge)

View round 15m (round/view-r15m): `round/view-r14` 940d3fc and
`round/view-modular-1` a9f1bef joined by a merge commit (no rebase), over
the same pair `ui-b654460cad2a`, with the returns of the acceptance
of modular step 1 (MOD1-1..5) and DEV's decision on RV4-3 (msg-1f111575).
r14's component code and modular step 1's bundling (the package core
`smart/view-common`, the lazy table, the bundles gate and budgets) both stay.
Every component either branch touched takes the next minor above both.

- `sf-view` 1.36.0. MOD1-1, MOD1-5: the list keeps its first paint until the
  shown kind's element (the table too) is defined and has drawn, with no time
  bound while the Loader is bringing it (it stops when the Loader says the
  module failed); on a slow line (300 ms, 750 kbit/s) the shift was 0.091
  (table), 0.055 (board), 0.127 (cards) and is 0. The cards' skeleton keeps
  one box when the Framework's skeleton sheet arrives (it shrank 4-8 px, shift
  0.0016 / 0.0098 before modular step 1 too). A switch to a kind still on the
  way holds its place the same way (an 8 s bound before). RV4-3: a record
  opened in the list's card opens over the list where docking the card would
  wrap the list head or turn the table into phone rows, and docks where the
  head stays on one row; opening and closing a record no longer moves the
  list (+44 px at 1440, +88 at 1280, phone rows at 1100 before).
  The list's bulk bar is drawn at size 1, the list head controls' size
  (DEV msg-1fd8b681; it took the list's size, 1/2 on the docs' lists).
- `sf-view-properties` 1.30.0: `docksBesideList()` and `dockWidth()` for
  sf-view's choice; a card sf-view opens over the list is not docked.
- `sf-view-table` 1.35.0, `sf-view-cards` 1.5.0, `sf-view-board` 1.3.0,
  `sf-view-calendar` 1.3.0, `sf-view-flow` 1.3.0: the merged line.
- Owner decision C413 (DEV msg-95e1e077): marks belong to the presentation.
  The table, the board, the cards and the calendar each keep their own marks
  over their pages and when the list comes back to them; a switch carries
  none (the C298 / LV2-2 carry is gone, VR14-1 is replaced); «Выбраны все N»
  stays the kind's own. No view-config change: the marks are not stored.
- Owner remarks register (DEV msg-3abb4a45): VL-07 the filter chips follow
  «Фильтр» and its bookmark on the same line and wrap after them; VL-12
  «Показать ещё» 8 px under the rows on a phone; VL-37 a page's marks come
  back when the person turns back to it; VL-49 «Фильтр» names the open saved
  filter, the default one too (C301 (2)).
- Returns of the r14 acceptance (DEV msg-afb6bff8). VR14-2: the row menu never changes the marks; rows keep
  aria-selected as their box says. VR14-4: phone rows of a list without row
  actions draw no «≡». VR14-5: one «Поля» in the column window, which opens
  from the head's «Поля» at the list's end (it covered 20 of 20 row handles).
  VR14-6: the footer's width mark is written in the next frame (the
  «ResizeObserver loop» error on a record open is gone). VR14-8: phone rows'
  label-value pairs on one grid, one field per line. VR14-3, part: an edited
  group keeps its read head, so the first row no longer climbs 28 px; the
  rows under a taller field (radios, 40 px fields in 48 px rows against 32 px
  read rows) still move and wait for DEV's choice of rhythm.
- Gates: the first-paint step runs `scripts/run-first-paint-slow.mjs` too (the
  slow-line case: table in markup, bare list, board, cards, calendar; 1440 and
  390; 3 runs; shift 0). The bundles gate fails a bundle it reads no module
  from (MOD1-2). A unit pins the shape of the SIMAI Framework internal
  `SF.__internal.pendingTags.settled` that sf-view and sf-view-table read
  (MOD1-3). `bundle-budgets.json` measured on the merged build (MOD1-4).

### view round 14

View round 14 (round/view-r14, from `round/view-r13` ccea5c6, with `main` 308b3be (the view 1.11.0 release) merged), over
the same pair `ui-b654460cad2a`: the owner decisions C403-C408
(DEV msg-3ed3de7b), the list study v2 returns LV2-2 and LV2-7
(msg-04ef4018), DEV's answers on round 13 (the cards' «Подгрузка», the
record's badge row), the owner's list review v3 (msg-2733819c: LV3-9, 11, 12,
13, 16, 20, 21, 23, 24) and the round 13 acceptance returns VR13-1 and VR13-2
with the owner's complaints of 2026-11-22, the list study v4 returns (LV4,
RV4). Numbers are above every branch of this set and of ui-pro, round/view-modular-1
(a9f1bef) included.

- `sf-view` 1.35.0. C404 the fixed list look (search framed, «Создать» and
  the data menu on, the presentation strip framed with «Колонки» and «Вид»,
  the footer the table's last band: range, pages centred, «По N» at the end,
  «Показать ещё» under the last row; a search that does not fit takes its own
  row). C405 «Вид» is the SIMAI Framework sf-settings drill menu with each
  kind's own rows, applying at once; the cards get «Подгрузка» (D1). C407 and
  LV3-23 the data menu and the saved filter rows use «⋯» (more_horiz); LV3-9
  its look is `head.menu` (outline, tonal, ghost; default outline). C408 the
  look applies to every list of the kind («Для всех моих списков» gone). LV2-2
  marks hold across pages and kinds; LV2-7 «Выбраны все N» reaches the cards.
  One bulk bar: under sf-view the list's bar stands for the table and the
  cards, the board keeps its own (it moves records) and the list's hides
  there. VR13-1: the cards keep the page row after a click switch. LV4-2 the
  head observes its parts once (no ResizeObserver loop); LV4-3 an emptied
  `bulkActions` clears the marks and the bar; LV4-7 a saved set's marks and
  «⋯» at the row end, the window kept open; LV4-14 one gap between the chips;
  LV4-21 marks kept across part switches; LV4-24 the search outlined again
  (1.11.0 filled it); LV4-25 the phone chip row scrolls with no track drawn;
  RV4-12 at 390 with the head off the rows are phone rows, not a squeezed table.
- `sf-view-table` 1.34.0. C406, LV3-21 the gear above «≡» is always there and
  opens the same window as «Колонки». LV3-20 no «Просторно», no «Для всех моих
  таблиц». LV3-11 «На телефоне» switches in the columns window
  (`phoneFields`); LV3-12 the phone row's roles no longer change the desktop
  table; LV3-13 the phone row formats its values by type and shows every fact
  (the due date fits); LV3-24 the phone status label for every status.
  RV4-2 the row menu marks nothing when nothing is marked; LV4-22 the head
  labels on their column's text line. A list without row actions draws no
  «≡» in the gear column; a resource list with quick actions keeps only its
  most worrying fact on a narrow width (C31); a keyless table keeps its look
  for the session.
- `sf-view-cards` 1.4.0. `keep-selection`, `all-selected`, `bulk-bar` and
  `selectAll(on)`: the marks of other pages, every record under the filter,
  and no bar of their own under sf-view. LV4-16 a field's label is 16 at size 1.
- `sf-view-properties` 1.29.0. C403 a side panel whose fields would keep less
  than 20rem beside the sections shows a rail of icons and names, below that
  the section list opening as a level with «←»; the interim tabs of C399 are
  gone. The full screen's section column fills its 12rem (was 99 px).
  VR13-2: «Изменить» on the full screen keeps the two columns of reading, each
  label on its axis (label x 0, was −403). The badge row of the record head
  sits on the line (1 px). LV4-12 the record drawer keeps the rail on the
  left; a block title is 16 at size 1/2 and 20 at size 1.
- `sf-view-board` 1.2.1. LV3-16 the card's box, title line and «⋯» on one
  line; RV4-11 the title on the fields' line, «⋯» on it.
- C402: the ink of «не заполнено» is unchanged (a SIMAI Framework token
  later); measured contrasts are in the evidence.

### view modular step 1

View modular step 1 (round/view-modular-1, from `round/view-r13` ccea5c6,
with `main` 308b3be, the view 1.11.0 release, merged),
over the same pair `ui-b654460cad2a`: the first step of the
C409 modularity study (DEV msg-8ccf829d, ui-control
control/research/2026-11-21-view-modular). Nothing an author sees changes.
Numbers are above every branch of this set (round/view-r14 included) and of
ui-pro.

- The package core `smart/view-common` (package.json `simai.core`, ui-builder
  libs/packageCore.js, as SIMAI Chart's chart-core): the code two or more View
  bundles share is built once and registered with the page's runtime; every
  other bundle takes it as `SF.runtimeModule("view/<module>", 1)`. That is the
  Framework field renderers (cell, view, edit and filter output, formats,
  conditions, the filter window, the rich-text subset, decimal, phone and mask),
  density, menu-open, preferences and the option badge, and what sf-view and
  sf-view-table share: the table's words and manifest actions. Each
  component's rule relates to `cl-view-common`, so the Loader fetches it
  first. A page that includes View bundles by hand adds
  `smart/view-common/js/view-common.min.js` before them.
- One allowed duplicate: sf-view-flow (preview) keeps its own copy of
  sf-view-properties' field value, set fields, money and conditions and of the
  Framework confirm surface with its date and number formats. In the core they
  would ride with every list (12 KB gzip more on a table-only list); bundled
  twice they cost only a page with a flow block and a record card together.
  `bundle-budgets.json` names it, with a gzip cap.
- `sf-view` 1.34.0: `cl-view-table` is a lazy relation, and the list asks for
  the current layout's element only: a list that shows the board, the cards or
  the calendar does not fetch the table; a switch to the table fetches it then.
  A table written inside a list (`<sf-view><sf-view-table slot="content">`)
  is still fetched at once: the Loader does not read the parts inside an
  element that is not defined yet, so the package core asks for it
  (`view-common/markup-table.js`), and a view whose script fails or comes late
  leaves the table drawing on its own as before (D2). Where a list that draws
  the table is on the page, `sf-view` is defined once `sf-view-table` is (or
  after 3 s), so the first paint is in the same order as with the eager
  relation (gate 24: 149 of 149, shift 0; the printed snapshots unchanged).
- `sf-view-table` 1.33.0, `sf-view-board` 1.2.0, `sf-view-cards` 1.3.0,
  `sf-view-calendar` 1.2.0, `sf-view-properties` 1.28.0, `sf-view-flow` 1.2.0:
  their imports of the shared code go through the core. `sf-view-table` also
  draws alone at once when the view's module failed before the table was
  defined (it read only the script errors after it). `sf-view` no longer
  warns of a row action without a catalogue entry before sf-view-table is
  defined (the projection is drawn again then).
- Gates: `scripts/check-bundles.mjs` (gates.sh step «bundles», after the
  build): no module of the set in two bundles but the allowed one, and each
  bundle's min.js.gz and min.css.gz within its budget in `bundle-budgets.json`.
- Sizes (JS + CSS gzip, KB of 1024 bytes): the seven bundles 529.9 KB → the
  seven and the core 319.4 KB (JS 504.4 → 293.9, CSS 25.5 unchanged); a board, cards or calendar
  list fetches about half the View bytes it did. The evidence has the full list
  and the single views in a browser.

## 1.11.0 — 2026-11-22

View rounds 11 to 13 (round/view-r11 .. round/view-r13; each accepted by DEV
with returns, round 13 on 2026-11-22) and the site's home example with the
full record card and bulk actions (round/view-site-full-card); the rounds'
entries below.

- Over the same SIMAI Framework pair `ui-b654460cad2a` (ui-source
  `049a2ba3dc7d`, npm `@simai-studio/ui@5.20261120.1816`, core.runtime
  1.64.0). The set still needs core.runtime 1.51.0 or newer.
- `sf-view` 1.32.0, `sf-view-table` 1.31.0, `sf-view-properties` 1.26.0,
  `sf-view-flow` 1.1.7, `sf-view-board` 1.1.5, `sf-view-cards` 1.1.0,
  `sf-view-calendar` 1.1.3.
- Known issues, open in this release (returns of the acceptances, for the
  next round):
  - VR13-1: cards reached by a switch from the table show «Показать ещё»
    without the page row (page numbers, «По 24», the range); a view opened on
    cards draws the row.
  - VR13-2: «Изменить» on the full-page record lays the fields again (the
    two-column read layout becomes one column; C401 holds in the panel).
  - VR11A-3: the vertical sections list in the record slider waits for
    sf-tabs fold=never (SIMAI Framework group build 16, G9); tabs on top until
    then.
  - VR11A-4: the table's own row drop line waits for the shared SF.Sortable
    drop marker (group build 16, G10), which pair ui-b654460cad2a does not
    carry.

### view round 13

View round 13 (round/view-r13, from `round/view-r12` 79f7706), over
the same pair `ui-b654460cad2a`: the list head and footer study,
round 4 (owner decisions D1 and D3 of 2026-11-21; returns VHF-13..16) and the
round 12 acceptance returns VR12A-1 and VR12A-2 (DEV msg-7e2d384f), and the
record's owner decisions C399-C402 (DEV msg-3215bbda), and the round 5 returns
VR5-1, VR5-2, VR5-5, VR5-6 and VR5-10 (DEV msg-b581533a), and the list
study v2 returns LV2-1, LV2-6 and LV2-8 (DEV msg-04ef4018).
Numbers are above every branch of this set and of ui-pro.

- `sf-view` 1.32.0. D1: «Подгрузка» in «Настроить вид» for the table, new
  setting `paging` = `pages` | `more` | `both` | `endless`, default `both`,
  kept per view (`layouts.table.paging`). `both`: a full-width «Показать ещё»
  right under the last row, the page numbers under it and «1–20 из 48»
  beside them; the button appends the next page and the range grows. `more`
  hides the page numbers; `endless` loads the next page when the end of the
  list comes into view (offered, not recommended for tables). VHF-15: the
  whole list head sticks at the top of the page or of the scrolling container,
  and the table head sticks under it. VHF-13: Kanban, cards and calendar
  settings apply at once; their field list holds the view's own fields.
  VR12A-1: under the list head «Настроить вид» also offers «Плотность»
  (Обычная / Компактная) and «Текст в одну строку»; a setting saved there no
  longer re-reads the list. VR5: every part of the head and footer can be
  switched off -- `chrome` takes `search`, `filter`, `look` and `page-size`
  (a chrome that names none of them keeps them all, as before; one that names any is the whole list), the view
  document takes `head.chrome` and `head.look` (the rows of «Настроить
  вид»), and `view.chrome` / `view.setChrome()` / `view.look` do it by a
  call; «Фильтр» goes by itself without filter fields; an emptied head row
  is not drawn. LV2-6: the cards have the list's page row (page numbers,
  «Показать ещё», the page size and «1–24 из 48» under the grid; the grid's
  own more button goes while the row is on). LV2-8: a display kind switch
  keeps the record first on screen on screen -- the new kind opens on the
  page that holds it, in its own page size, so the page marked and the
  records shown agree (it reopened on page 1 before).
- `sf-view-table` 1.31.0. VHF-14: the table head sticks by CSS, no one-frame
  lag. VHF-16: columns that do not fit keep their natural widths; the table
  moves sideways by the rail, a sideways wheel or touchpad and the keyboard
  focus, with the box, the row menu and the name held. VR12A-2: above
  list-below a long-text column keeps about 20 characters (`--sf-measure-20`)
  and a number or money column is never cut; where those do not fit, the
  table scrolls sideways. VR5-10: with the row menu off and nothing to
  reorder, the first column is not drawn (it was an empty 57 px band).
  LV2-1: a short one-line column (an id, a date, a status, a record name)
  keeps its content width up to about 20 characters; beside a record card
  «Заказ №20…» and «20 нояб. 202…» are no longer cut.
- `sf-view-properties` 1.26.0, the record (owner decisions C399-C402, DEV
  msg-3215bbda). C400: a field's label is its value's size (14; 12 compact),
  in the muted ink, on the value's baseline. C402: an empty value reads «не
  заполнено» in the label's ink (`--sf-on-surface-muted`, which C402 names,
  is the disabled ink at 3.10:1 and the Framework keeps it off readable text;
  the paler ink waits for the owner). C401:
  «Изменить» turns the values into their fields in place, the label at the
  start beside its field (over it on a phone); `sf-form` lays labels beside
  only from 40rem of its own width, so a side panel still stacks them. C399:
  a card docked beside the list keeps its section column only while the list
  keeps 48rem; over the list and on the whole screen the column stays (a side
  panel keeps tabs until a pair's `sf-tabs` can be told not to fold).
- `sf-view-flow` 1.1.7: nothing changes on screen; the shared field renderer
  gives an empty value its ink from the sheet (C402).
- `sf-view-cards` 1.1.0. D3: card fields one per row, the label over the
  value, a gap after the title; `card_labels` on by default.

### view round 12

View round 12 (round/view-r12, from `round/view-r11` 9609c88), over
the same pair `ui-b654460cad2a`: the list head and footer study,
rounds 2 and 3 (DEV msg-7d2d0c1e, msg-c31ccebd; returns VHF-3..12), the record
study (DEV msg-3e47ce93; VRS-7..9) and the favourite star of C393 (the twin of
ui-pro pro-f6c43828e5f2). Numbers are above ui-pro's copies of the set in
pro-f6c43828e5f2 (sf-view 1.30.1, sf-view-table 1.29.4, sf-view-properties
1.24.0), which took this round's first numbers.

- `sf-view` 1.31.0. VHF-3: the head row has two states only: everything on
  one row while it fits; else the search across the width on top with
  «Создать» and «⋯», «Фильтр» and the fields below (the search stood alone at
  the end of a second row). VHF-5: the head answers to the width the list has,
  not to the view's box: beside a docked record card, below 600 px of what is
  left the head is the phone head, together with the table's list rows. VHF-9:
  the list title keeps its heading size in a compact area (C44). VHF-11: no
  boxes in the table, the cards or the calendar without bulk actions; a host
  that names `select` in its own `chrome` keeps them. Bulk actions given after
  the first draw (`bulkActions`, or `actions` written on the page row later)
  bring the boxes to the rows already drawn; the view reads the host's own
  `selectable`/`settings` before it writes its own, so its first «false» is not
  taken for the host's.
- `sf-view` 1.31.1 and `sf-view-board` 1.1.5 (owner decision D2,
  2026-11-21): the board reads «Канбан» in the list head and as its own name
  (it was «Доска»); `layout="board"` and the component names stay.
- `sf-view-table` 1.29.5. VHF-4: columns that do not fit take the room from
  the other columns first, the widest first, and the record's name last, so a
  short name stays whole; where the name still has to give, «Текст в одну
  строку» turned off draws it on its two lines and on draws one line with «…».
  VHF-8: «Компактно» on a normal page is the
  Framework's compact density on the table, so the row menu «≡» and the box
  step down with the row (28 at size 1/2, 32 at 1; the «≡» held 32 and 40).
- `sf-view-table` 1.30.0 (owner decisions D4 and D5, DEV msg-4de06ae6,
  2026-11-21). D4: one density for the whole list: «Вид» → «Плотность» is
  «Обычная» or «Компактная»; «Просторно» and the rows' own height setting are
  gone, a stored «Просторно» reads as «Обычная»; the choice is the list's
  density island on its `sf-view` and on the table, so the head, the rows with
  their box and row menu, and the page row follow one density (this closes
  VHF-8 / VR11A-1 by design). D5: «Текст в одну строку» is off by default: the
  record's name up to two lines, a long text (a comment) whole; on, every cell
  one line with «…».
  Below `list-below` a `layout="table"` table scrolls in its frame with its
  first column held, as the docs say, and its columns are not squeezed to fit
  (squeezed, the name went to two lines after the first paint).
- `sf-view-properties` 1.25.0. VHF-7: the stage badge keeps its whole word;
  VHF-6: a card in place ends that line with its «⋯». VRS-7: the whole
  screen's history draws the card's text step (16 beside 14 px fields). VRS-8:
  phone section rows are sf-list rows of the ladder with «›». VRS-9: no group
  title that repeats the section's name. C393: the favourite star is the
  Framework's toggle where sf-button-icon has the look (the pair's 1.13.11 has
  not: the neutral ghost toggle stays). Pro's record panel step plus aside
  column (sf-drawer 1.20.0) is not in this pair and not taken.
- `sf-view-board` 1.1.4 (VHF-10): a card at size 1 draws text step 1.
- `sf-view-cards` 1.0.7 (VHF-12): the box and «⋯» are centred on the title's
  first line (the «⋯» sat 6 px low).
- Round 11 acceptance returns (DEV msg-265727a8): VR11A-1 is VHF-8 above, and
  probe table-density-rows now has the row menu and opens the gear by a click;
  VR11A-2 the hint-less phone skeleton is said as drawn (a field to a line;
  short values want list-shape); VFC-1 the quick edit at a value shows again
  (`sf-view-properties` read sf-popover's former data-open, now its open
  attribute). VR11A-3 (vertical sections in the slider) waits for sf-tabs
  fold=never (group build 16, G9); VR11A-4 (the table's own row drop line)
  waits for the shared SF.Sortable drop marker (group build 16, G10), which
  pair ui-b654460cad2a does not carry.
- Browser probes view-round-12 and view-round-12-r3 (red on 9609c88).

### view round 11

View round 11 (round/view-r11, from `main` 0c1b7ec with DEV's site branch
round/view-site-1.10.1 7757233 merged), over the same pair
`ui-b654460cad2a`.

- `sf-view-properties` 1.23.9 (VR11-1, owner remark): one owner of the
  section column. A record panel below the whole screen reserved the 12rem
  column while the vertical `sf-tabs` in it folded into its row (it folds
  below 44rem of the box around the column; the panel's scroller is at most
  43rem). On this pair such a panel now lays its sections as tabs on top and
  is not widened; with an `sf-tabs` that declares `fold` (proposed to the
  SIMAI Framework) it keeps the list on the left unless the widened panel
  would pass 60 percent of the window. The whole screen and a card in place
  lay tabs on top where the column's tabs fold. A whole-record save answered
  `conflict` reads the record again (the fix of simai/ui-pro 1.23.8).
- `sf-view` 1.30.0: `list-shape`, the host's hint of a phone list record's
  shape (lines per part, title first, or `resource`), drawn by the skeleton;
  a page row's printed `total` sizes the skeleton to the records left;
  «Изменено» compares a system view that names no layout with the layout the
  page wrote, not with a restored personal kind.
- `sf-view-table` 1.29.3 (VR11-2, study VHF-1): the person's row density
  moves a row one rung on every size step (size 1: 32 / 40 / 48; size 1/2:
  28 / 32 / 40 for «Компактно» / «Обычно» / «Просторно»). «Компактно» used
  to add block padding over the rung and drew rows taller than «Обычно»
  (size 1: 48 against 40). A two-line row keeps its two-line rung.
- VR11-3 (study VHF-2): the phone head row of a list (the view-panel
  toggle, the filter, the search, «+» and the list menu) stays inside its
  list down to 320 px with no change: the 25 px overflow the study measured
  came from its own strip buttons («Колонки», «Вид» with their names), a page
  mock that widened the head to 338 px. Browser probe view-head-phone-fit
  keeps it (lists of 320, 326, 360 and 390 px, on a phone and in a box).
- 1.29.2 and 1.23.8 are simai/ui-pro's numbers (pro-93f6675545e2); this set
  steps over them.

## 1.10.1 — 2026-11-21

View round 10 (round/view-r10, accepted by DEV on 2026-11-21) and the site
over the release view-705a90193256 (round/view-site-1.10.0: generated lines,
the bulk-actions diagram readable); the round's entries below.

- Over the same SIMAI Framework pair `ui-b654460cad2a` (ui-source
  `049a2ba3dc7d`, npm `@simai-studio/ui@5.20261120.1816`, core.runtime
  1.64.0). The set still needs core.runtime 1.51.0 or newer.
- `sf-view` 1.29.1, `sf-view-table` 1.29.2, `sf-view-properties` 1.23.7,
  `sf-view-flow` 1.1.6, `sf-view-board` 1.1.3, `sf-view-cards` 1.0.6,
  `sf-view-calendar` 1.1.3.
- `sf-view-properties` 1.23.7: accepts `simai.property-view-port` 1.22.1
  (SIMAI Framework group build 15, A8: a save over a moved revision may be
  answered refused or conflict, both with reason `revision_moved` and the
  current revision; no new key). Either answer is a conflict to the card: it
  says so, keeps what was typed and reads the record again. `sf-view` 1.29.1
  already accepts `simai.dataview-port` 1.16.0.
- `sf-view-properties` docs: the content width at compact density is 284,
  340 and 424 px, inside the drawer's 12 px gutters (was 276, 332, 416;
  DEV's R10-1, text only).

### view round 10

Over view round 9 (round/view-r10 from round/view-r9 71f1c5a), on the same
pair `ui-b654460cad2a`: Larena R9-1 and L-4, DEV's V10-1..5.

- `sf-view` 1.29.1: a phone list (size 1/2) skeleton row is sized at text
  step 1, as the answered row is (109 px at 390, was 93); a new example
  `phone-list` (three fields, size 1/2) is in the first-paint gate (R9-1).
- `sf-view` 1.29.1: the group actions bar is made together with the list, so
  its words are the page's language from the first count, and after an action
  the view clears the selection before it gives the bar the result: the screen
  reader keeps «Готово 2 из 2» instead of «Выбор снят» (V10-1).
- `sf-view` 1.29.1: a column switched off in «Настроить вид» leaves the table
  at once (V10-2); a system view switched to another layout shows «Изменено»
  as it does after a filter change (V10-3).
- `sf-view-properties` 1.23.6: the card head's band edges, title row and
  title box are written on the elements, so at 1440 the «⋯» stands at the
  row's end from the first frame even when the component's sheet arrives
  after its code (Larena L-4; probe `property-view-head-first-frame`). The
  docs give the panel's outer width and its content width inside the
  gutters (352/416/512 and 320/384/480, V10-5).
- Compact density from 60rem (960 px) only is the density contract (C22,
  desktop only); unchanged (V10-4).
- `gates.sh` installs Playwright of the pinned ui-source's version into the
  package when none resolves, and its Chromium into the gate's own browsers
  folder (R9-G).

## 1.10.0 — 2026-11-21

View rounds 5 to 9 and the site round (round/view-r5 .. round/view-r9,
round/view-site; round 9 accepted by DEV on 2026-11-21), with the set site's
new structure (round/view-site-structure); their entries below.

- Over the SIMAI Framework pair `ui-b654460cad2a` (ui-source `049a2ba3dc7d`,
  npm `@simai-studio/ui@5.20261120.1816`, core.runtime 1.64.0). The set still
  needs core.runtime 1.51.0 or newer. Former names keep ending on 2027-01-01.
- `sf-view` 1.29.0, `sf-view-table` 1.29.2, `sf-view-properties` 1.23.5,
  `sf-view-flow` 1.1.6, `sf-view-board` 1.1.3, `sf-view-cards` 1.0.6,
  `sf-view-calendar` 1.1.3.
- Row selection through the SIMAI Framework group actions bar
  `sf-bulk-actions` (Larena L-2): «Выбрано N», the actions as buttons, «Выбрать
  все N», the host's answer in the bar.
- The view configuration contract `contracts/view-config` 1.0.1 (text only:
  whole documents per level, the merge order, host keys).

### view round 9

The set moves to the SIMAI Framework pair `ui-b654460cad2a` (npm
`@simai-studio/ui` 5.20261120.1816, ui-source `049a2ba3d`): the lock and the
passport pin its source; the units follow the pair (the page row's band is
sf-bulk-actions, three more field keys the port 1.20.0 declares, the
registry's statuses).

- `sf-view` 1.29.0: row selection through the group actions bar (Larena
  L-2, C295). While rows are marked the view draws `sf-bulk-actions` under
  the list: «Выбрано N», the actions as buttons (icons from `bulkActions`),
  «Выбрать все N» where the host acts under the filter, the cross and
  Escape. An action goes to `bulk.apply_selected` or
  `bulk.apply_under_filter` as before; the host's answer is the bar's result
  line («Готово 2 из 2», or «Готово 0 из 2 · 2 не удалось» with «Подробнее»
  and «Повторить для 2», the rows kept marked). Over a pair without the bar
  the band of before stays.
- `sf-view` 1.29.0 also holds the page row's line of arrows in its skeleton
  only where the page writes the count on `sf-pagination` (a total over one
  page, `has-next`, a page past the first): the pair's page row draws no
  arrows for one page, and a one-page list lost 48 px at 390 when its answer
  came.
- `sf-view-table` 1.29.2, `sf-view-board` 1.1.3, `sf-view-cards` 1.0.6,
  `sf-view-calendar` 1.1.3: their rules fetch `sf-bulk-actions` (lazy) now
  that the pair carries it.
- `sf-view-table` 1.29.2: the table's own menus near the window's edge keep
  the width of their rows; over the pair their box says `max-inline-size:
  100%`, which the table read as 100 px (the same fix as simai/ui-pro
  df0604f, numbered above its 1.29.1).
- `sf-view-properties` 1.23.5 (the same fix as simai/ui-pro d7c4cf6, above its 1.23.4): with sections as tabs the loading skeleton
  draws no empty panel row under the tabs' strip, as sf-tabs 1.4.5 of the
  pair draws none, so the first group no longer jumps up by 32 px (24 px at
  size 1/2) when the record comes.

### view round 8

Over the site round (round/view-r8 from round/view-site abd3ca8, not released
yet): DEV's returns of rounds 6+7 (R67-1..3) and of the site round
(VSA-1..5). The set's version is now the candidate **1.10.0**
(package/package.json): the site states the version of the build it runs.

- `sf-view` 1.28.0: a board and cards chosen in the view zone show their
  count line («1–16 из 60») — the head's rule for display kinds other than
  the table hid the footer start (R67-1). The head says what view-config/1
  says: «Сохранить представление», «Сохранить как моё» for a view the person
  cannot write (system, not shareable or with locked paths), «Сбросить»
  (R67-2). On a phone the search field no longer widens the head past its
  frame (306 px in 286, VSA-1). A layout switched to while its code is on
  the way holds only the list's place with the layout's skeleton; the head,
  the marks and the footer stay on screen (VSA-5).
- `sf-view-table` 1.28.0: beside the record panel at the normal density the
  columns nobody sized give back room down to their least width (the
  heading on one line, never below `min_width`); a value
  wider than its column stays on one line and ends in an ellipsis; the table
  scrolls sideways only when those least widths do not fit
  (R67-3: sites 935 px in 896, users 826 in 688, both fit now). The filter
  window's words: tab «Представления», «Сохранить представление»,
  «Представление сохранено» (R67-2).
- `sf-view-properties` 1.23.3: the English default of `variant-text` is
  «Look» (was «Template»).
- `sf-view-cards` 1.0.5: no card field is cut (R8-1: on the home example a
  card of 195 px cut «Новый» to «Н…» and «9 800,00 ₽» to «9 800,»). The
  least card width is a step of the width ladder (C396): S
  `--sf-measure-28`, M `-36`, L `-44` = 224, 288, 352 px at a desktop (was
  192, 240, 320), read over the base steps `--sf-f4`, `--sf-f8`, `--sf-g1`
  where the pair has no ladder yet; a field column never narrows below its
  content's least width and a value wraps at its spaces instead of an
  ellipsis; on a phone the two S cards side by side lay their fields one
  under the other.
- `sf-view` 1.28.1: the view toggle of the list head draws its glyph open
  and closed (R8-3: open, it was an empty tinted square on the site: a
  pressed button asks for the filled `view_quilt`, which the site's icon
  subset lacks). Over a pair without the toggle look the toggle is a
  disclosure button (`aria-expanded`) whose pressed look the head draws; the
  glyph stays outlined in both states.
- `sf-view-table` 1.29.0: a `date` or `datetime` column with
  `variant: "relative"` shows «сегодня», «вчера», «3 дня назад» in its cells
  in the page language, the full date in the cell's title (Larena L-3). The
  settings column's name comes from the language files (Larena L-1: it was
  the literal `settings`).
- `contracts/view-config` 1.0.1 (text only, Larena server acceptance
  LVC-4, LVC-8): each level keeps whole documents, merged by the host in the
  order system < shared < profile < personal except on locked paths; a host
  keeps its own parts under `layouts.<layout>`, a filter key starting with
  `_` is a host's service field (Larena `_archived`), `fields` is optional
  and filled by a writer that knows it; a list belongs to one host place.
- Site: page sizes 10/20/50/100 in the examples; the materializer carries
  `core/contracts/icon-names.v1.json` (VSA-2); no decision ids in the change
  history or in an example's source, and the site lint rule `history` now
  covers both (VSA-3); `build-pages.mjs --receipt` (run by `build.sh`)
  refuses a site that states another version than the build it runs
  (VSA-4); an example is held hidden only for its first paint, not while a
  layout switched to loads (VSA-5).

### view site round

Over round 7 (round/view-site from round/view-r7 0a6d6bf):
the set site's orders VS-SITE-1..14 and two items of round 7.

- `sf-view` 1.27.0: with `simai.dataview-port` 1.16.0 and
  `personal-preferences`, the view the person opened last
  (`data.preferences.view`) opens by itself on load, with the layer's page
  size and in its own layout (a board view opens as a board); opening
  another view saves it to the layer (`preferences.save` `{view}`).
- `sf-view-cards` 1.0.4: inside `sf-view`, whose footer says «1–24 из 60»,
  the grid no longer repeats «Показано 24 из 60»; the «Показать ещё 24»
  button stays, and the focus stays on it while the next page loads. Cards
  drawn on their own keep the line.

### view round 7

Over round 6 (round/view-r7 from round/view-r6 a237bbd):
VS-8 of the views study (prototypes/views-switcher-study.html) and the count
of a board and cards.

- `sf-view` 1.26.0: with the list head a view's filter fields
  (`settings.filter_fields`) are on the head row as soon as it opens, and the
  default view's from the first answer, whether or not the host echoes
  `filters_chosen`; going back to a view no longer keeps the fields of the
  view left. Adding or removing a field of a system or shared view marks it
  changed. A board and cards have no page row, yet the footer says how many:
  «1–80 из 120», the records on screen of all the host counted, in the table
  footer's words (sf-pagination `range`, `range-many`). Port
  `simai.dataview-port` 1.16.0 is accepted (1.0.0..1.16.0): saved views of
  level `package` group as system; with `personal-preferences` the page size
  and the view zone's state are the person's layer on the host
  (`data.preferences`, `preferences.save`), else the browser as before.
  DEV's round-5 returns: a page that sets no page size now asks **20**, not
  25, and its menu is exactly 10/20/50/100 (owner decision 2026-11-20; a
  host sees `per_page: 20` in the first query); the «Показать ещё» look's
  range counts every row on screen («1–12 из 12», not «11–12 из 12»);
  closing a record the host opened in its own panel (Escape or ×) gives the
  focus back to its row instead of the page's body.
- `sf-view-table` 1.27.1: an open saved filter that holds conditions tints
  the filter control as a field condition does — the phone's filter icon
  (whose name now carries the filter's name) and the desktop «Фильтр»
  button with its save segment (R5-2, Q1, C301 (3)).
- Contract `simai.view-config/1` (`contracts/view-config/`): the view
  document, the board window and answer (per_lane 20, at most 100; at most
  200 lanes), the levels, the limits `describe()` reports (20 views per list
  per level, 8 KB per view) and the words «представление», «Сохранить
  представление», «Сохранить как моё»; scopes reserved.
- `sf-view-properties` 1.23.1: the record panel paints the tab strip's ground
  itself only while the page's sheets lack SIMAI Framework component.tabs
  1.5.4, which paints it with the ground it stands on.

### view round 6

Over round 5 (round/view-r6 from round/view-r5 279c7f5):
VZ-1 (owner C393, C394, views study option D), the table's columns before
scroll and VB-1 (DEV msg-b137d217, C394 revised).

- `sf-view` 1.25.0: the list head by zones. The title row holds the list
  name only; the number of records is the footer's. The head row starts
  with a quiet view toggle (`view_quilt`; name and tooltip «Представление:
  <name>», a dot while the open view has unsaved changes, the glyph tinted
  while a view other than the default is open) that opens the view zone in
  its own frame below the row: the open view and its menu by level, the
  display kind, «Настроить вид» and «Изменено» with save for everyone, save
  as new and reset. Whether the zone is open is kept per person under
  `preferences-key`. «⋯» moved to the end of the head row. The toggle takes
  SIMAI Framework's `appearance="toggle"` where the pair carries it, else
  draws the same look itself. A page row without a look of its own leaves
  its line to the footer.
- `sf-view-table` 1.27.0: declared column widths shrink toward their
  content before the table scrolls sideways (a list beside a docked record
  panel: 1100 px of columns in a 1024 px box no longer scroll).
- `sf-view-properties` 1.23.0: in a side panel in the dark theme the
  section tabs strip and the edited group cards are no longer darker than
  the panel (C20); the light theme is unchanged. The panel widths follow the
  body text (C396): `panel-size` 1/2, 1 and 2 are the measure steps 44, 52
  and 64 (352, 416, 512 px at normal density, 308, 364, 448 at compact),
  read from `--sf-measure-N` once the pair carries it; the default is now 2
  (512 px, was 384): write `panel-size="1"` for the former default.
- Widths of text containers follow the text measure (C396), read as
  `var(--sf-measure-N, calc(N * var(--sf-text--size-1) / 2))`; px at normal
  density: the table column max, the search field and toolbar end start, the
  context menu fallback, the notice max and the record body basis 44 (352,
  were 320); the places window 52 (416, was 448); the resource list title 52
  (416, unchanged). The card sizes keep their C306 steps.

### view round 5

Over `view` 1.9.0 (round/view-r5): DEV's open items B1-B3
and the list study order LV-2..LV-13 (V1, V5, V7 and the record window not built; LV-14 is the Framework's).

- `sf-view-table` 1.25.2: a table in sf-view's shadow root opens its row
  menu through SIMAI Framework sf-menu-context 1.27.0 (`for` given the
  table's own `<table>` and list as elements); the table's own workaround
  `bindShadowRowMenu` is removed (DEV msg-b353fce8).
- `sf-view-table` 1.26.0: only «Создать» is filled in the list head;
  «Фильтр» is outlined and tonal while conditions are set (C301, LV-4). A
  phone's list head has the table settings button, the panel of the desktop
  gear (LV-6). The «Вид» tab shows the density in effect, compact on a
  compact page; another choice draws the table as a density island (C22,
  C79, LV-8).
- `sf-view-properties` 1.22.0: a docked record beside a list keeps the list
  usable with no dim; with no dock host on the page the panel marks its
  sf-view (C305 (4), LV-2). Arranging in a panel below the full step stacks
  the sections over the fields; beside them the section list takes its
  content width and the fields the rest (LV-3). Opening a record puts the
  focus on its title, ring for the keyboard only, no tooltip (LV-9). The
  arranging parts are asked of the Loader early, so arranging draws without
  a late shift (B3).
- `sf-view-board` 1.1.2: the column head buttons stand 8 apart, the gap of
  one button group (B1).
- `sf-view` 1.24.0: the calendar asks its range once (B2); the footer's
  page size menu offers 10, 20, 50 and 100 (C388, LV-12).
- C386 (LV-10, LV-11), `sf-view-properties` 1.22.0: the sections default to
  a list on the left in a side panel and to tabs on top on a page; a written
  `sections-as` wins. A side panel with the list is wider by it, so the
  fields keep the `panel-size` width.
- C388 (LV-13), `sf-view-table` 1.26.0: «Фильтр» carries the name of the
  open saved filter.

## 1.9.0 — 2026-11-19

The four layouts together: view rounds 1 to 4 (round/view-r1 .. round/view-r4,
accepted by DEV on 2026-11-19), their entries below.

- Over the SIMAI Framework pair `ui-dc9fc39aeb26` (ui-source `1dd18375cbc2`,
  npm `@simai-studio/ui@5.20261118.1205`, core.runtime 1.61.0; the rounds were
  built over `ui-1ed6b6c9a040`). The set still needs core.runtime 1.51.0 or
  newer. Former names keep ending on 2027-01-01.
- New in the set (preview): the board `sf-view-board` 1.1.1, the cards
  `sf-view-cards` 1.0.3 and the calendar `sf-view-calendar` 1.1.2. `sf-view`
  1.23.2 switches live between table, board, cards and calendar and keeps the
  marked records and the open card.
- `sf-view` 1.23.2, `sf-view-table` 1.25.1, `sf-view-properties` 1.21.0,
  `sf-view-flow` 1.1.6, `sf-view-board` 1.1.1, `sf-view-cards` 1.0.3,
  `sf-view-calendar` 1.1.2.
- `sf-view-properties` 1.21.0 is the round's 1.20.0 together with the released
  1.19.2 and 1.20.2 (1.8.2, 1.8.3): every `simai.property-view-port` 1.0.0..1.22.0
  is accepted. The record card settings (C311: `view.publish`, `view.lock`,
  `view.locked`, `view.head`, `profiles[].required`) are offered only to a host
  that declares 1.22.0, the C311 edition of SIMAI Framework group build 13; a
  host on 1.20.0 or 1.21.0 that used the round's card settings loses them with
  this release until it declares 1.22.0.
- Release numbers: `sf-view` 1.23.2, `sf-view-calendar` 1.1.2 and
  `sf-view-cards` 1.0.3 are the round's 1.23.0, 1.1.0 and 1.0.1, numbered above
  the superseded `round/view-calendar` (1.23.1, 1.1.1) and `round/view-cards`
  (1.0.2), which are not in the set; `sf-view-properties` 1.21.0 is above
  1.20.2 and ui-pro's own 1.20.1.
- Known, open: the board's head buttons stand 4 apart where the rule says 8;
  the calendar asks its range twice until the date field is named; arranging a
  card shifts the layout once.

### round/view-r4 (the four layouts together)

Round/view-cards and round/view-calendar merged onto round/view-returns;
Larena's view-config/1 keys (msg-75b451e2); C311 (5); the list head's filter
window (C310); DEV's round 3 returns VR3-1..VR3-4.

- `sf-view` 1.21.0 and 1.22.0: the cards and the calendar layouts numbered
  above round/view-returns' 1.20.0; the registry and the `layout` values hold
  table, board, cards and calendar.
- `sf-view` 1.23.0: one layout switch for every layout. The selection and
  the docked card are carried between table, board, cards and calendar;
  cards ask their own `per_page` (24 by default) and the list's is given back
  on leaving them. A layout not in the running set is hidden in the head, not
  shown disabled (VR3-1, DEV's decision); the head's menus pass separators as
  `{type: "separator"}`, the key sf-menu-context reads (VR3-2). The head's
  filter field opens the Framework's filter window
  (`SF.fieldRenderers.filterWindow.open/summary`) when the running Framework
  has it, behind a feature check; otherwise the head's own popover stays. The
  button is coloured while the filter is active, shows a count above 0 and
  says the condition in its tooltip. The list's page size is kept over the cards and the
  calendar and given back with the table or the board.
- `sf-view-calendar` 1.1.0: view-config/1 `layouts.calendar.span_days`
  (31 by default, up to 366) and `rules[]` -- `past`, `weekdays {days}` (ISO
  1..7 allowed), `locked {field, in}`, `ability {ability}` and per-record
  `can.update`. Refusals `storage_calendar_update_*` are said in words from
  the language packs, never as the code.
- `sf-view-properties` 1.20.0: the «⋯ → Вид» submenu is gone for everyone
  (C311 (5)); a reader who cannot arrange the card chooses a view in a
  select-only sf-profile-picker above the fields. The views list and the
  naming row of the former submenu are removed.
  The card accepts simai.property-view-port 1.0.0..1.20.0: the record card
  settings of C311 are port 1.20.0 (called 1.19.0 on ui-source
  `round/property-view-port-1.19`; group build 12 holds 1.19.0, money C294),
  so «Сохранить для всех» and the locks are offered to a 1.20.0 host only.
  Group build 13 numbers that edition 1.22.0 (1.20.0 type templates and
  1.21.0 form fields came first): the card accepts 1.0.0..1.22.0 and offers
  the card settings to a 1.22.0 host only.
- `sf-view-table` 1.25.1: the column head menu's separators draw as
  separators (VR3-2).
- DEV's acceptance of the cards and the calendar: `sf-view-calendar` 1.1.0
  opens in `layouts.calendar.mode` when no `mode` is written (VCL-1); «+N»
  is a text row at the event line height, so the month is 672 px instead of
  750 (VCL-3); a phone's day rows are two lines with the second field at the
  end of the title line and «…» on long values (VCL-4). `sf-view` 1.23.0
  never sends a calendar range with `date_field: null` (VCL-2).
  `sf-view-cards` 1.0.1: a number in the first «Кратко» column stays at its
  start (VC-1).
- The phone's month (C307 (3), (4)): `sf-view-calendar` 1.1.0 puts + on the
  chosen day's heading under the month (always shown there) and a «Без даты N»
  item that shows the records without a date in place of the day's list; a
  held row, Shift+F10 or the context menu opens the event menu, where
  «Перенести на…» sets the date. The pick window hears the pair's
  `sf-input-date` (`sf-change`); before, «Перенести на…» moved nothing.
- `sf-view-properties` 1.20.0 against the Larena backend's C311 contract:
  view refusals (`admin_record_layout_shared_denied`, `admin_record_view_own`,
  `admin_record_view_unknown`, `admin_record_view_required`,
  `admin_record_layout_lock_invalid`, `admin_record_layout_head_invalid`,
  `admin_record_layout_icon_invalid`, `view_invalid`) are said in the pack's
  words; a publish conflict keeps the personal layer it carries; a lock
  answer's `required` updates the view; a required view disables the
  reader's view chooser.
- Tests: the STATUS test reads only the branches the candidate carries
  (`SET_LIVE_BRANCHES=1` reads live origin, VR3-3). Site: the view-table
  example of former tags uses `sf-view-table` (VR3-4).

### round/view-returns (record card settings)

Owner decision C311 on the levels of C298 (RC-1..RC-4, RC-6..RC-10, TB-1;
RC-5 is Larena's).

- `sf-view-properties` 1.19.0: the card is arranged in the card itself. Own
  edits are written to the personal layer at once; «Сохранить для всех»
  (`view.publish`), «Вернуть как у всех» in the profile picker (the personal
  layer only), «Сохранить как моё» (`view.create` shared false), locks per
  setting (`view.locked`, `view.lock`) and a required profile
  (`profiles[].required`). The head line: the stage as a tonal badge and up
  to two fields (`view.head`). The mode: the picker and a hint over the
  fields, «Вкладки» with handles and a «⋯» per tab, «+ Вкладка» with a
  «Поля» area, a field to another tab from its «⋯» at every width, one way
  to hide (the eye and «Скрытые поля»), no template per view (C302 (2)),
  «Новое поле…» for the host's field editor
  (`sf-view-properties-structure`); the foot «Готово», «Сохранить для всех»,
  «Отменить». Port 1.19.0 (ui-source `round/property-view-port-1.19`) is
  accepted; the declared contract stays 1.18.0 until a pair carries 1.19.0,
  and the new intents go only to a 1.19.0 host.
- `sf-view` 1.20.0: «Настройки полей записи» opens the first record in the
  card's arranging mode (`openRecordSettings()`); the head's own record
  fields drawer and `entity.fields.save` are gone.
- Site: the card page's «Настройка карточки» with a host of port 1.19.0 and
  its request log.

### round/view-returns

DEV's returns of round 2 (VR2-1..VR2-9) and C306.

- `sf-view` 1.19.0: under the list head the table keeps its column head menu
  (sort, «Закрепить», «Скрыть колонку», «Все колонки…» and the width, C296);
  «Все колонки…» opens «Настроить вид» (`openCustomize()`). The record card
  beside the list closes on × and Escape (the view answers its close request
  with `open="false"`). Alt+Down / Alt+Up from the list step the card and move
  the list's place with it. The head's windows carry roles (`head-sheet`,
  `head-record`): their path ids no longer collide with the record card's
  drawer, which drew them inside the head; the phone sheet opens. The table
  inside gets `total` and `row-offset`. The board asks the cards and every
  lane total in one request (C304; no `lane-sums` query). A page table under
  `layout="board"` is parked with one console warning. Cards size S / M / L,
  M by default (C306); the layout values list names `board`.
- `sf-view-table` 1.25.0: `row-offset` (with `total`, every row's
  `aria-rowindex` is its place in the list); the grid's open record row takes
  the primary 12 % fill (24 % dark); the grid ignores Alt+Down / Alt+Up.
- `sf-view-properties` 1.18.2: Alt+Down / Alt+Up step the record while the
  focus is on the card's panel itself (the phone).
- `sf-view-board` 1.1.1: `sums-pending` is for a page that computes the sums
  after the cards; `sf-view` does not set it.
- Site: property examples wait for the loader's `sf-loader-init` event
  instead of a timer (VR2-6); every example holds its recorded drawn height
  from its first frame (`scripts/record-example-heights.mjs`,
  `config/example-heights.json`, VR2-7); the board example answers the lane
  totals with the cards.

### round/view-r3

- `sf-view` 1.18.0 (view round 3, item 2): the list head's «Таблица» /
  «Доска» switches the layout live. `switchLayout(kind)` swaps the view-made
  table or board, parks the page's own `sf-view-table` while a board draws
  and brings it back, keeps the marked records and the record card beside,
  draws what is known at once and asks the host once with the new layout's
  query; a `layout` attribute written later does the same. `canDrawLayout`
  says which kinds the set draws; the head shows cards, calendar and tree
  disabled with their reason. A view saved as a board opens as one.
- `sf-view-properties` 1.18.1: a group named `''` draws no empty head row
  (read 36 px, edited 29 px); its «Изменить», rare mark and arranging tools
  still bring the head back.
- Site: the property examples show their four sections at once, when every
  part in them has drawn (frame layout shift 0.55-1.22 -> 0.01-0.03); pages
  «Доска» and «Шапка списка» in «Компоненты».

### round/view-cards

- `sf-view-cards` 1.0.0, new (owner decisions C297, C306, CD-1..CD-8): the
  cards layout. Records as `.sf-card` in a grid whose columns follow its
  width (sizes S, M, L: least width 12, 15, 20rem; on a phone S two columns,
  M and L one), a cover the layout draws in a frame of one ratio (cover crops,
  contain shows it whole on a tint; lazy pictures, no jump), the title in two
  lines and up to four fields in the «Кратко» place by the Framework field
  renderers; «Показать ещё» and «Показано N из M» are `sf-pagination` in its
  more look; one Tab stop with the arrows by rows, Enter opens, Space marks,
  Shift+F10 the card menu, Escape clears; the marks go to `sf-bulk-actions`
  where the pair has it; empty lists are `sf-empty-state`.
- `sf-view` 1.21.0 (said 1.19.0 on its branch): `layout="cards"` draws `sf-view-cards` (the layout
  registry), only where the author turned it on (C297); the query carries
  `window {page, per_page: 24}`, «Показать ещё» continues the list; a press
  on a card opens the record card beside the list (C305) and the grid
  narrows; the first paint holds a grid of cards. The wiring lives in
  `view/js/cards.js`; `index.js` only calls it at its hook points.

### round/view-calendar

- `sf-view-calendar` 1.0.0 (owner decision C307, CA-1..CA-10; study
  ui-control `control/research/2026-11-18-calendar-view`): a new layout of
  the set, preview. Records sit on the days of their date field in a month
  of six weeks, a week or a day of hours, or a list; a record is moved and
  stretched by mouse, touch and keys (Ctrl+Shift+arrows), shown at once and
  pale until the host answers; a refusal puts it back and says why. Days a
  rule of the date field refuses dim with the reason while a record is held.
  Past `per_day` a day says «+N», which opens its list in place; «Без даты N»
  opens a column of undated records, dragged to a day and back; «+» on a day
  creates a record with its date. On a phone the month has dots and the
  chosen day's list under it. One Tab stop for the grid (the W3C date grid),
  PageUp/PageDown the period, Shift+F10 the event menu with disabled items
  and their reasons. Week start and time zone are the request's, never the
  view's.
- `sf-view` 1.22.0 (said 1.18.0 on its branch): `layout="calendar"` draws it. The query carries window
  `{range: [from, to), date_field, end_field}` and context `{timeZone,
  weekStart, locale}`; the undated records are a second `query.change`
  (reason `undated`); a move is `record.set {record_id, key, value, patch,
  revision}`; the first paint holds the month grid. The list head's calendar
  settings write `color_field` and offer no week start.

### round/view-r2

- `sf-view-table` 1.24.0 (owner decision C296, view round 2, VT-1..VT-18):
  the table draws columns and rows. A column head's menu (right press,
  Enter, Shift+F10) is sort, pin, hide and «Все колонки», then the width
  entries; the columns window is the SIMAI Framework `sf-settings` panel at
  the gear, without the table's own full-screen portal. With
  `inline-edit`, a short field (choice, a person with options, date,
  number, money) edits at the cell on a double press or F2 -- the
  Framework's menu or a small popover with the field of its type -- and
  emits `cell-set`; longer fields stay the record card's. A totals row at
  the foot shows the host's `totals` for the columns marked `total`. New:
  `total` (the grid's `aria-rowcount`, «all N»), `sort="key:dir"`, the
  `open` event `{id, newTab}`, `scrollToRow`, the `empty` and `error`
  slots, eight public `--sf-view-table-*` variables (the `--sf-table-*`
  names stay until 2027-01-01). Rows say `aria-selected`, a selectable
  grid `aria-multiselectable`; a title without an address is a button,
  not `href="#"`; the hover fill is the 8 % state; a status badge is at
  most the row less 8 and takes its option's scheme; the width grip is a
  24 zone; the empty-state action has air below it; numbers follow the
  page language; head cells never wrap letter by letter; the phone list is
  C259's («≡» after the box, status and amount at the end, «all on the
  page» box) with one Tab stop. The toolbar, search, filter, templates,
  create, layout switch, `pagin` and `setBulkActions` are dated former
  settings until 2027-01-01, noted in `SF.deprecations` on a table
  standing alone. Behind feature checks (parts not yet in a released
  pair): `sf-bulk-actions` after the rows of a table standing alone, and
  `SF.fieldRenderers.dateFilter` for date filters (C293 DF-1, DF-4, DF-6).
- `sf-view` 1.17.0, one number above the round's branches (1.15.0 head,
  1.15.1 table, 1.16.0 board, 1.16.0 card), carrying all four:
  - the list head, `head="list"` (C297 head part, C299, C300, C301; study
    2026-11-17-list-head-filters): a title row (name and count, the views
    menu, the display kind as `sf-segmented`, «Настроить вид», «⋯» by right)
    and a head row («Фильтр» with its bookmark, joined filter field buttons,
    «Очистить», the search up to 20rem, «Создать» the only filled button with
    its split menu); no gear in the table. A phone gets one icon row, a
    sideways row of fields and bottom sheets (`sf-drawer`); a desktop gets
    `sf-popover` windows. «Настроить вид» by kind with the C298 levels;
    record field settings in a side drawer. Intents `filter.*`,
    `settings.save`, `entity.fields.save`, `view.create_record`; the port's
    `describe()`; events `display-change` and `settings-open`. Without
    `head` nothing changes. Long saved filter names are cut only when
    `sf-button` has `overflow="truncate"` (feature check);
  - the layout registry; `layout="board"` (Larena's `kanban`) draws
    `sf-view-board`, an unknown layout warns once and draws the table; the
    board's first paint holds lanes, not a table, and stays until the board
    has drawn them (and the lane switcher's row on a phone), so nothing
    jumps;
  - `recordBeside(id, direction)` gives the next or the previous record id in
    the order the view shows (a board's: its lanes'), for a card that steps;
  - the skeleton of a selectable view on a phone holds the list's page box
    over its records (with `sf-view-table` 1.24.0, VT-2);
  - and, at the merge, `record-card="<id>"`: a record opened from the table,
    the list or the board opens in that `sf-view-properties` panel beside the
    list (docked from 64rem; the view marks itself
    `data-sf-drawer-dock-host` when the page marked nothing), Alt+Down /
    Alt+Up step through the view's order, closing gives the focus back to the
    row; without it the host's `record.open` as before. The board asks its
    lanes' counts with the cards (`window.totals: ["count"]`) and the money
    sums in a second `query.change` (reason `lane-sums`, `per_lane: 0`) once
    the board is drawn: count at once, sum when it arrives (agreed with
    Larena).
- `sf-view-board` 1.1.0: `sums-pending` holds each lane head's sum line
  while the sums come after the cards; `setLaneTotals([{value, totals}])`
  takes them without touching the cards or the cursors. 1.0.0 (preview, on
  `round/view-r2-board`) is the board layout (owner decisions C298, C304):
  lanes by one field from the host's lane window (the first `per_lane`
  records of every lane in one query; the sums, since the merge, in a second),
  cards with up to four fields in the «Кратко» place, a move as a change of the
  lane field the host settles, soft limits, folded and hidden lanes, one lane
  per screen on a phone, one Tab stop with the arrows inside. Options under
  `layouts.board` of `simai.view-config/1`.
- `sf-view-properties` 1.18.0, the record card by C305 (round 2, RC-1..RC-7):
  `edit` = `group` | `group+quick` | `none`. A group edits in SIMAI Framework
  `sf-form` (label above in the panel, beside in the full screen; Save
  first); a group with a picker, an upload or a set keeps the card's own form
  until `sf-form` takes them. A short field (choice, date, time, yes/no,
  number) edits in a window at its value and saves one value through
  `group.save`; «Изменить всё» is in the menu; a press on a long value opens
  its group with the focus there. `history` = `auto` | `off`: «История
  изменений» is a level of the same panel on `sf-list-timeline` (by day,
  before and after by the field's template, «Показать ещё», a filter in its
  menu), asked through the new port intent `record.history` (capability
  `record-history`); `SfPropertyView.historyFromRevisions` answers it from
  stored revisions. From 64rem the panel docks beside a list marked
  `data-sf-drawer-dock-host` (no scrim; `modal="true"` keeps it), the full
  screen shows the history as a 24rem column from 80rem, Alt+Down / Alt+Up
  step through the list (`sf-view-properties-step`), closing over unsaved
  entries asks first. Seven public `--sf-view-properties-*` variables;
  `--sf-property-view--sections-width` is a former name until 2027-01-01.
- Site, «Свойства» (owner decisions C300 and C302, round 2 page helper): one
  page template for every type, written whole by
  `site/scripts/build-properties.mjs` -- what the type stores and its
  templates (id, default, which of the four places each changes), one live
  example of four sections «Показ», «Кратко», «Правка», «Фильтр» (three
  samples; the compact form in a table column and on cards with a small edit
  window for short fields; the edit with «Сервер получит», then empty and
  required, a real error and read only; the open filter with «В запрос
  уйдёт»), a template switch that keeps the value and the server lines, then
  «Значение и сервер» with the field description, «Настройки», «Где
  хранится» (Larena, Bitrix) and the neighbours. Gone: the «Телефон» block,
  the three state cards, pagination, search, «Запись», «Свойства» and
  «Сохранить» in the examples, the HTML/CSS/JS tabs with the whole catalogue,
  variants as bottom text. Phone and password have pages of their own
  (C302 (1)); this pair draws them as string variants. The example reads the
  templates from the Framework registry (`templates`, `template`) and falls
  back to the former `variant` names.

### round/view-r1 (for 1.9.0)

- Over the SIMAI Framework pair `ui-1ed6b6c9a040` (npm 5.20261117.1612,
  ui-source `acc113415d98`, core.runtime 1.60.0; the round's helpers built
  over `ui-24d64b7f6eb7`, npm 5.20261117.1311); the site on Docara 3.17.0
  (was 3.14.1). Former names keep ending on 2027-01-01.
- `sf-view-table` 1.23.1 and `sf-view-flow` 1.1.6 follow the Framework files
  of the pair `ui-1ed6b6c9a040` they build in (`src/smart/pagination/index.js`
  takes its words from its language module, C282;
  `src/smart/helpers/confirm-surface.js` draws the status sign at 1/3, C151
  (1)); nothing of their own.
- `sf-view-properties` 1.17.0, the record card by C289 (round 1 group 2):
  a panel lays its sections out by width (an underline tab line with
  «Ещё (n)»; the section column in a full panel; a list of rows with «←» on
  a phone) and is drawn at a step of the drawer ladder, never wider;
  `panel-width` is a dated former name until 2027-01-01, mapped to the
  nearest step with a console notice. A record to read is an
  `sf-list-description` (label beside value, groups as headings) with no
  foot: «Удалить», «Копировать ссылку» and «Открыть на всю страницу» are
  rows of the head's «⋯», nothing stands outside the panel. The head is one
  row; a record opened from another shows «← <record>» above its title,
  and a panel with no `panel-label` is headed by `record.label` or
  `record.title` (it showed the record id).
  Save is never disabled: empty required fields are refused with a summary
  of links, a host's confirmation is asked with `sf-confirm`. No layout
  shift on the first paint, value buttons 24px on a phone, and the view asks
  the Loader for every tag it draws (no `defineFieldsOf` needed).
- `sf-view-table` 1.21.2 follows the Framework file it builds in
  (`src/smart/pagination/index.js` moved in the pair); nothing of its own.
- `sf-view` 1.13.2 and `sf-view-properties` 1.16.9 ask `sf-dropdown` for
  `appearance="bordered"`, the field look's current name (FM-9; `outlined`
  is its dated former name until 2027-01-01). The same look.
- `sf-view` 1.13.3: the bulk band orders its actions and marks a deleting
  one with SIMAI Framework `sf-pagination`'s own `isDestructiveAction` and
  `orderActions`; the set's copy is gone (Framework first, A3).
- `sf-view` 1.13.4, `sf-view-table` 1.21.3 and `sf-view-properties` 1.16.10:
  every former name that ended on 2026-12-01 (23 in `aliases.json`: view-table
  16, view 3, view-properties 4) now ends on 2027-01-01, after Larena moves to
  `data-sf-sets="admin view"` on 2026-12-15 with two weeks' margin (§13.4,
  G1). The old names keep coming; nothing to change for a host.
- `sf-view` 1.13.5, `sf-view-table` 1.21.4 and `sf-view-properties` 1.16.11
  ask their icon buttons and buttons for the look `ghost` where they asked
  for `link`, its former name (component.icon-buttons 1.14.0, RG-IB-1..3,
  C213): the printed row menu's `sf-icon-button--link` raised a console
  warning over the pair. The same look.
- `sf-view-table` 1.23.0 (view round 1 D1, D3, D5-D8, PD-9): create, the
  view's actions, the list's sort and a saved view's «⋯» open the SIMAI
  Framework's shared menu (`SF.menu.open`), not windows of the table; the
  filter, save-template and chip windows put «Применить» first and
  «Сбросить» after it; the toolbar's button groups walk by arrows
  (`roving.js`); every toolbar word is in `lang/`; the filter count is
  `sf-button-icon` `badge-count`; the Create row is one scheme; a date is
  the field renderers' reading in `<time datetime>` (the set's
  `format-value.js` is gone); a link cell is `sf-reference-link`; a date
  chip says «Позже», «Не раньше», «Раньше», «Не позже». The filter window
  keeps its menu and its two tabs, and the save-template, filter and chip
  windows still place themselves, until `sf-settings` has the parts (new
  order) and the Framework's filter window comes (FO-5).
- `sf-view` 1.14.0 (D4, D5): nothing of its own in the shadow root (the
  fallback search, view select and save and delete buttons are gone; the
  toolbar part shows only a toolbar the page slots); the default table and
  page row are light DOM, where the page's styles reach them (the table's
  search text stood 6 px from the icon there instead of the Framework's 8);
  the move dialog chooses through `sf-input-choice`. A page that slotted an
  empty `<span slot="toolbar">` to hide the fallback toolbar no longer needs
  it.
- `sf-view-flow` 1.1.5 (D10): «Отправить» first, «Отмена» after it, the
  status line after both (C159 (4)); dates are the field renderers'.
- `sf-view-properties` 1.17.2: dates are the host's or the field renderers'
  reading; a percent is the Framework's `formatPercent`, «12,5 %» and
  «12.5 %» (C203 (3)). One version above the card group's 1.17.0 and the
  table group's 1.17.1 (a branch number, not a set version), which met in
  the round's merge.
- `sf-view-properties` 1.16.4 (VP-5, VP-8) and 1.16.5: the page buttons in
  the drawer head beside the close are size 1/3, 8 apart (C205 (2)); the
  filled head of a phone panel clears them (taken back from ui-pro f29d4bf).
- `sf-view-table` 1.19.9 and `sf-view-flow` 1.1.3 follow the Framework files
  of the new pair they build in.
- `sf-view-table` 1.20.0, the table with actions on a phone (C259): below
  44rem a table whose host offers row actions keeps the box, «≡» and the
  columns marked `key_cell: true`, at the container's width with no sideways
  scroll; `key_line` names the column drawn as the key cell's second line.
  Every action of a row is in one menu, `sf-menu-context` bound with `for`
  to the rows of the table and the list: «≡», a list row's «⋯», the right
  button, the menu key, Shift+F10 and a long press open the same list
  (C164). Row menus follow the host's row actions, not `row-actions`.
- `sf-view-table` 1.20.1: the list toolbar's field, view buttons (filter
  and sort) and «Создать» stand `--sf-space-1` apart, 12 on a phone (C144;
  were 8); `sf-view` 1.12.4 prints its first-paint list toolbar the same way.
- `sf-view` 1.12.5, `sf-view-table` 1.20.2, `sf-view-flow` 1.1.4 and
  `sf-view-properties` 1.16.6 name the utility classes their templates write
  as relations, so the Loader asks for them with the component (a SIMAI
  Framework component gets them from the Loader's own list): the bulk band no
  longer gains its gap and moves 8 px down after the first paint (#172).
- `sf-view-table` 1.20.3: a resource row's «⋯» names its record («Ещё
  действия: <name>»), as «≡» does (PRO-ADM-9).
- `sf-view-properties` 1.16.7: a record opened to read starts with the focus
  on its title, not on the favourite star whose tooltip covered the title
  (PRO-ADM-16); a record with a field keeps that field.
- The browser test of saved views' first paint watches six pages at a time
  and fails a refresh that never settles (3 loads: 22 min to 4 min).
- `sf-view` 1.13.0, the list's footer of its own (owner decision C97 (5)):
  one row «41–60 из 240 · По 20 ▾ · ‹ [3] из 12 ›». The view draws the range
  (with «посчитать» where the host counts on request) and the page size, a
  quiet button «По 20 ▾» with a menu; the page row is `sf-pagination`
  `appearance="field"`, navigation only, its end buttons dimmed, not gone,
  so the row keeps its width while a person pages. A page row given without
  an appearance is given `field`: the view no longer relies on
  `sf-pagination`'s compatible footer, which retires on 2027-01-01. The
  state stays the page row's (`page-sizes`, its words, `sf-pagination-change`,
  `sf-pagination-count`); on a phone the field takes a line of its own and
  ends it. «Показать ещё» above the row, which a page row without
  `top="false"` drew, is not part of the footer (C97 (1)). The first paint
  draws the same row.
- `sf-view-table` 1.21.0, a column's width from the keyboard (C158 (5)): the
  table stays one Tab stop, the arrows walk the heads, and Enter (Shift+F10,
  the menu key, the right button) on a head with an edge opens «Изменить
  ширину · По содержимому · По умолчанию». «Изменить ширину» takes the focus
  to the edge, whose arrows are SIMAI Framework's `SF.Resizer.attach`
  (`sf-resizer` 1.3.0); Enter or Escape go back to the head. «По содержимому»
  fits the column to its content; «По умолчанию» drops the person's width,
  as a double click on the edge still does. The edge says its share («16 %») and
  its name from the language files (it was Russian in the template). Space on
  a sort button still sorts; Enter there opens the menu.
- SIMAI Pro products batch, the view's part (2026-11-17). `sf-view` 1.13.1:
  the move and confirm window's footer puts the main action first at the
  start and a quiet «Отмена» last, 8 apart, 4 compact (C159 (4), C144; it
  was an outline «Отмена» first and the main button at the end, 20 apart).
  `sf-view-table` 1.21.1: filter chips stand 4 apart (C105 H5; were 8) and
  use the tag's current names (`kind`, `active`, `sf-tag-close`; `type`,
  `root-class="active"` and `close` were the former ones, `close` a dated
  alias until 2026-12-01); the search fields have the glass at the start,
  the field's own clear (Escape clears too) and an accessible name (C123,
  C153 (6)); a group action's button in a row («Опубликовать») and a host
  action whose `menu` is `row-settings` open the one standard row menu, the
  group's members alone for a group (C164 (2)): the table's hand-drawn second
  row menu is gone. `sf-view-properties` 1.16.8: the count beside «Неразмещённые»
  is a grey tonal `sf-badge` (C140 (3)), not a tag.
- `sf-view-table` 1.22.0, the gear's window on SIMAI Framework `sf-settings`
  (owner decision C106): the column settings are `sf-settings look="panel"`,
  not `sf-menu-context` tabs with rows the table drew. «Поля» is the panel's
  fields list with its search: a shown column has the theme's light fill and
  a check at the end, the handle stands at the start (drag or Alt+arrows),
  the pin is the Framework's pin button and pinned columns stay on top.
  «Вид» holds the density as a choice (the fill alone) and switches for the
  lines, one line, the held head and «Для всех моих таблиц». Everything still
  applies at once with the same events (`save {kind: columns}` with reason
  `column-visibility`, `column-pin` or `column-order`; `view-change`);
  «Сбросить» puts the fields back as the window opened with them, or the
  view to its defaults, by the tab it stands on; the window reopens on the
  tab it was closed on. The panel draws at the gear's density (C22): the
  handles and pins the table wrote at 1/2 by hand are gone, a size reaches
  it only when the host wrote one; on a phone it is the bottom sheet. The
  labels `column-move-label`, `pin-column-label`, `unpin-column-label`,
  `column-search-placeholder` and `column-search-empty-text` are no longer
  read by the gear: `sf-settings` says its own words in the page language.
  The filter window keeps its tabs: its saved views need a sortable,
  pinnable choice of one with a row menu and a rename in place, which
  `sf-settings` does not offer yet.

## 1.8.3 — 2026-11-18

- Over the same SIMAI Framework pair `ui-141822273efe`.
- `sf-view-properties` 1.20.2: the panel accepts a host that declares
  `simai.property-view-port` 1.20.0, 1.21.0 or 1.22.0 (SIMAI Framework group
  build 13). The three versions only add: field settings `template`,
  `templateParams`, `decimals`, `holder` and new type names (1.20.0), the
  record history and neighbours behind their own capabilities and the
  refusal `revision_moved` (1.21.0), publishing and locking a view and the
  view's head, locks and required profiles (1.22.0); 1.19.0's conformance
  cases are unchanged. Nothing the panel reads or writes changes: it asks for
  none of the new things, a field sent with `template` alone is drawn with
  its type's default, a type name it does not know is not offered for
  editing and nothing is written for it, and `revision_moved` is shown as a
  refusal with nothing written. A 1.22.0 host reads this panel's shared view
  saves and a layer's `variant` until 2027-01-01. Without this, a page on the
  SIMAI Framework pair that carries 1.22.0 would refuse the panel's host.
  (1.20.0 is a version on an unreleased branch and 1.20.1 ui-pro's own copy;
  neither is in this set.)

## 1.8.2 — 2026-11-18

- Over the same SIMAI Framework pair `ui-141822273efe`.
- `sf-view-properties` 1.19.2: the panel accepts a host that declares
  `simai.property-view-port` 1.19.0 (owner decision C294). 1.19.0 adds two
  optional money settings (`currencies`, `currencyDisplay`) and drops a
  percent's default bounds; its conformance cases are 1.18.0's, unchanged,
  so nothing the panel reads or writes changes. The panel does not read the
  two money settings yet, and a percent without `min` and `max` still stops
  at 0..100 while typed; a value the host sends is shown and kept as it is.
  Without this, a page on the SIMAI Framework pair that carries 1.19.0 would
  refuse the panel's host. (1.19.0 is a version on an unreleased branch and
  1.19.1 ui-pro's own copy; neither is in this set.)

## 1.8.1 — 2026-11-15

- Over the same SIMAI Framework pair `ui-141822273efe`.
- `sf-view-table` 1.19.6: a checked row box draws its tick at once. The
  tick was in the row (1.19.0) but its glyph waited for an icon font that
  had it: an unchecked box names no glyph, so the page's first font had no
  «check» and the first box checked stayed empty for a second font (0.6 s on
  a fast line, more on a slow one; DEV recipes p1). A table with boxes asks
  for «check» and «remove» with its first font, and a drawing hands a newly
  checked box's tick to the Loader. The bulk buttons were already per C116
  (regular, «Удалить» outlined danger and last; measured again).
- `sf-view-properties` 1.16.0, the record panel against the drawer decisions
  (R243 study; C14, C96, C99, C144, C148, C153, C157, C159): one head with
  the SIMAI Framework's `sf-button-close` last in it (it was a round button
  of the panel's own on the scrim); on a phone a section opened from the
  list is a level of the panel with «Назад» and the section's name in that
  head (it was a second head row); the title on the window step, the heading-4 role
  as in sf-drawer and sf-modal (20/24 at any density, 16 on a phone; it was
  24/32); action rows 8 apart, 4 compact (were
  20 and 16); «Отмена» and «Вернуться к правке» quiet; «Изменить» with a
  capital; while a group is edited the labels and their «*» in the text
  colour; no lines between the phone's section rows; the section column is
  vertical `sf-tabs` (C96 (5), TR-13) without the tree's folder icons. The
  strip beside the panel keeps copy-link and open-full and is gone without
  them. A host that found the close in `.sf-property-view-edge` finds
  `[data-action="close"]` in `.sf-property-view-head`; a host that read
  `.sf-tree-item` in `.sf-property-view-sections` reads `[role="tab"]`.
- `sf-view-properties` 1.16.3: the panel's head row is laid out by the
  component's own sheet, not by the `grow` and `gap-1/3` utilities, which
  the Loader asks for only after the first render. On the first open of a
  panel the close was drawn beside the star and moved to the row's end
  113-124 ms later (94-118 px at 1440); it stands at the end from the first
  drawn frame now. (1.16.1 and 1.16.2 are the versions of ui-pro's own
  patched copies; they are not in this set.)
- Known limit, as in 1.8.0: the `view-flow/ask` first-paint case at 390 px
  stays on the set's known-failure list. The `sf-input-date` fix (its
  wrapper aligned to the top) is not in a released SIMAI Framework pair yet;
  the case is dropped at the repin on the pair that carries it.

## 1.8.0 — 2026-11-15

- Pinned to SIMAI Framework `ui-141822273efe` (ui-source `f92aeee74518`,
  npm `@simai-studio/ui@5.20261115.29`, core.runtime 1.56.0); the set still
  needs core.runtime 1.51.0 or newer. The pair carries what the entries
  below needed (sf-menu-context's point anchor, utility.table 1.3.0,
  field-renderers 1.9.0 with sf-input-lookup 1.10.0, sf-spinner 1.4.0).
  1.7.2 was never released: its entries (`sf-view-table` 1.18.2) are
  folded into this one, at the end.
- `sf-view-table` 1.19.5: the printed first paint and the drawn table lay
  the columns out by one rule (gate 24): every data column at its content
  width on one line, the last data column nobody sized taking the spare
  room, the select, settings and actions columns at their declared widths.
  The printed table shared the spare room between every column and drew the
  select column as wide as its box's label wanted, and the measured widths
  were rounded up to a 4 px grid, so every printed cell moved when the code
  measured (CLS 0.035 at 1280, 0.041 at 1440). A table with rows is
  content-sized from its first render, and a content-sized table takes no
  column floor (its last column stood at 160 on a phone). The column
  window's footer stands on the menu's own inset (C105 H4, C106): its
  buttons stood at 11 from the panel's padding edge beside the search and
  the rows at 15, where the Framework's panel rows put their text.
- `sf-view` 1.12.3: the first paint's control blocks (the saved-views place,
  the layout switch, the create split arrow, the actions button) are the
  controls' boxes again. The pair's skeleton draws a text bar at the capitals'
  height (C136 (1)), which held them at 30 of 40 (24 of 32 compact).
  The page row of the first paint is sf-pagination 1.5's compatible footer
  (C97): on a phone the view no longer grows 48 px when its answer comes.
- `sf-view-table` 1.19.4: a size 1/2 table is 32 again (28 compact and on a
  phone): the row holds the step and its cells follow it. The pair's class
  table puts the step-1 control height on every cell (utility.table 1.4.0,
  C146 (1)), which held size 1/2 rows and the head at 40 (36 on a phone).
  The toolbar holds its own gaps: a table drawn before its sheets moved its
  search field by 12 px when the gap utility came.
- `sf-view-properties` 1.15.2: the bar of actions stands on the drawer's
  floor again (sf-drawer 1.10.5 keeps no stable scrollbar gutter, C105 H6;
  the panel's foot stood 14 px below it), and the skeleton's tab strip stands
  over the hairline as sf-tabs' underline strip does (it was a pixel taller).
- `sf-view-table` 1.19.3: a list row's context menu (right click,
  context-menu key, Shift+F10) follows the table's selection rule (C164 (3)):
  on a selected row it acts on the whole selection under «Выбрано N» with the
  actions all of them offer; a row outside the selection becomes the
  selection first. Table and list share one code path. Before, the list left
  the selection alone and opened only the row's own button list.
- `sf-view-table` 1.19.2: the toolbar's view actions and a filter template's
  actions draw ⋯ (`more_horiz`), not ⋮ (C155 (2), TL-1). A right click on a
  row opens its menu at the pointer (C164 (1); sf-menu-context's point
  anchor), not under the row's ≡; the keys still open it at the ≡. The list's
  rows get the same right click, context-menu key and Shift+F10, with the
  list their own button opens. `sf-view` 1.12.2: the bulk band's Apply over a
  deleting action writes `status="danger"`, not the former `error` (same look;
  the destructive rule is sf-pagination 1.6.0's).
- `sf-view-table` 1.19.1: every menu of the table is on the table's step
  (owner remark 2026-11-15): the row menu, which lives on `<body>` or in the
  open dialog, takes the table's resolved size (the attribute, else 1) and the
  density of the table's area on every opening; it had no size and opened at
  the menu's own 1/2 (32 px rows, 14 px text) beside a size-1 table. The
  menus the table draws itself take the resolved size too. `sf-view-properties`
  1.15.1: its «⋯» and view menu the same. Works on the released pair.
- `sf-view-table` 1.19.0: `--sf-table--row-text-inset` is the cell spacing
  plus `--sf-space-1` (16 at 1440, 12 compact and on a phone), the edge
  inset the SIMAI Framework table gives the first cell from utility.table
  1.3.0 (C77, C105 H6); it was the cell spacing plus `--sf-a8`. A related
  list in `sf-view-properties` keeps its row text on the field-label axis.
- `sf-view-table` 1.19.0, the table of owner decision C146: rows 40 (32 at
  `size="1/2"` and compact, 48 with a second line), the head as tall, quiet
  (medium, `--sf-on-surface-variant`, no fill); number columns end-aligned
  with tabular digits and no wrap; lines, hover and selection fill, stripes
  only by the author's new `stripes` attribute (the person's «Вид» no longer
  offers it); row actions as variant В (R239): «≡» at the row's start holds
  every action, the hover-only «Действия» column is gone, the main field is
  the link that opens the record, the right button, Shift+F10 and the menu
  key open the same «≡» menu (on a selected row it acts on the whole
  selection, «Выбрано N»; «Удалить» last after a divider, C164); bulk
  actions are regular buttons, the deleting one outlined danger and last
  (C116; also the Apply of `sf-view`'s bulk band, 1.12.1); a checked row box
  draws its tick again; cell badges tonal (C140); the sort mark only on the sorted column; a title up to two
  lines, then an ellipsis and a tooltip; a table with actions is a grid with
  one Tab stop and arrow keys, column-resize edges are no Tab stops (RS-10);
  `layout` defaults to `auto` (a list below `list-below`), a plain table on a
  phone scrolls in its frame with its first column pinned, and the empty
  state stays in view (TB-11, TB-12). Density now moves a table with a size
  too (C79), and the published `--sf-table-*-block-size-1/2` names follow
  it (28 on a compact page; they held 40 there).
- `sf-view-properties` 1.15.0: a record, a relation, a user and a paged
  lookup field are edited in `sf-input-lookup` (owner decision C139 (1)):
  focus shows the host's first page, typing searches through the host,
  «Показать ещё» follows the cursor, the value is written as
  `{value, label}`. The rule relates `cl-input-lookup` (lazy). A short list
  given whole stays `sf-dropdown`.
- `sf-view-table` 1.18.2: rows name their fill to the SIMAI Framework core
  mix `sf-place-fill` (C43 D3, D4). A hovered, selected, open and
  selected-and-hovered row, in the table and in the phone list, declares
  `--sf-surface-underlay` as the row's own opaque base and
  `--sf-surface-place-fill` as the tint it paints: a tonal badge on the row
  keeps its tone, and an anchored badge's ring takes the row's tint, where
  on a hovered row it cut the tint out to the bare place colour.
- `sf-view-table` 1.18.2: the busy overlay's spinner carries its words as
  `label` with `label-hidden` (owner decision C138) instead of an empty
  label and an `aria-label`; the status region says them once.
- `sf-view-table` 1.18.2: a list empty only because of its filters draws
  `filter_alt_off` in its «nothing found» brick (owner decision C120 (3));
  a search, or a search with filters, keeps `search_off`.

## 1.7.1 — 2026-11-12

- Built over SIMAI Framework `ui-7fb26d395af2` (ui-source `8c13bf45aeca`,
  npm `@simai-studio/ui@5.20261112.1807`, core.runtime 1.54.2); the set
  still needs core.runtime 1.51.0 or newer. That pair's journal records the
  former save names of `sf-view` (`event-view-save-kind-view`), so the set
  no longer keeps them pending.
- `sf-view-table` 1.18.1, also: the shadow at the end of the pinned columns
  is the surface role `--sf-surface-state-select` (the 8% state step) in
  place of `--sf-alpha-8`. The Framework's components read the surface
  roles since that pair (DEV acceptance 2026-11-10 Q3), so the shadow
  follows a coloured place too; on a neutral place it is the theme's
  neutral at 8% where it was black or white at 8%.
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
