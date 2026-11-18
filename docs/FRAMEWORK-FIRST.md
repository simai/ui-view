# Framework first

Every part of every component of the set, with one verdict (set standard draft 1.1 §7.1):
`fw` uses SIMAI Framework, `copy` is an own copy of a Framework part (a defect), `order` is
missing in the Framework (a Framework order, FO), `set` is truly the set's own. A copy kept
knowingly carries `x-framework-first.waits` in its component.json, part id to the FO it waits
for (§7.3); every other copy is fixed in the round or taken by a round item. The record is
re-run against the pinned pair at every repin (§7.2), and the repin that brings a waited
part removes the copy in the same round (§7.4). The key is `x-framework-first`, not the
standard draft's `framework_first`: the component standard (gate 1 §4) admits
only `x-` fields beside its own.

Source: ui-control `control/research/2026-11-17-view-vs2-vs4/data/parts.tsv` (VS-2, 88 parts,
read at ui-view `4317b84` over pair `ui-078a4b4c6f6e`); states as of view round 1 (pair
`ui-24d64b7f6eb7`; the round's merge repinned to `ui-1ed6b6c9a040`, over which this record
is not re-read yet). Evidence is `package/src/smart/<folder>/…` at `4317b84` unless named.

| Component | Parts | fw | copy | order | set |
|---|---|---|---|---|---|
| sf-view | 15 | 5 | 4 | 1 | 5 |
| sf-view-table | 38 | 17 | 13 | 3 | 5 |
| sf-view-properties | 29 | 12 | 8 | 2 | 7 |
| sf-view-flow | 6 | 2 | 3 | 1 | 0 |
| sf-view-board | 9 | 8 | 0 | 0 | 1 |
| sf-view-cards | 9 | 8 | 0 | 0 | 1 |
| all | 106 | 52 | 28 | 7 | 19 |

## Framework orders

| FO | What the Framework needs | Parts that wait |
|---|---|---|
| FO-1 | one drop-files area in core | V-11 |
| FO-2 | a windowing helper for long lists | T-33 |
| FO-3 | field conditions (`when`) in the field descriptor | P-14, F-05 |
| FO-4 | sf-input-choice with option visuals and host-paged options | T-21 |
| FO-5 | a filter field window usable without a table | T-22 |
| FO-6 | sf-pagination's selection band placeable in a host slot (after BQ-1) | V-06 |
| FO-7 | `money` and `percent` property types (after BQ-2) | P-17 |
| FO-8 | sf-form answer mode over the confirm surface (after BQ-3) | F-03, F-04, F-06 |

## sf-view

| Id | Part | Framework part | Verdict | State | Evidence |
|---|---|---|---|---|---|
| V-01 | data port and intents | core host-port / early-port carry it; the protocol is the set's | `set` | the set's own | view/index.js:998 (_requestHostPort), :1232 (_raise), :1463 (applyProjection), :2039 (_renderProjection) |
| V-02 | composition shell | none (a composite of the set) | `set` | the set's own | view/index.js:282-372 |
| V-03 | fallback toolbar | sf-input, sf-dropdown, sf-button (or the table's own toolbar) | `copy` | round view-r1 item D4 (VF-3) | view/index.js:355-372; hidden only when the slotted table draws a toolbar :2262-2271; ui-admin slots an empty span to suppress it (index.html, workbench.html) |
| V-04 | own parts | sf-pagination | `fw` | uses the Framework | view/index.js:609-627 |
| V-05 | page row | sf-pagination 1.7.0 | `fw` | uses the Framework | view/index.js:609-627; set.json requires cl-pagination |
| V-06 | selection band | sf-pagination actions band (show-actions, actions, action, action-for-all, …) already in the Framework | `copy` | kept, waits FO-6 | view/index.js:1582-1677 (reads pagination.actions, actionApplyText, actionForAllLabel); Framework src/smart/pagination/component.json settings show-actions…action-for-all-label; Larena sets actions on sf-pagination (AdminDataviewPagePresenter.php:121-127) |
| V-07 | destructive-action rule | isDestructiveAction (src/smart/pagination/js/actions.js:5) | `copy` | fixed: view 1.13.3 imports isDestructiveAction (round item A3, 6213b80) | view/index.js:1674-1681 («Kept here until the pair this set is pinned to carries that module»: the pair carries it) |
| V-08 | move and confirm dialog | sf-modal + sf-input-choice (C165 (1): the ready group with heading, hint and error); footer by C159 (4) main first at the start | `copy` | round view-r1 item D5 (VF-5) | view/index.js:1829-1923 (radiogroups :1855, :1871; footer :1887-1894) |
| V-09 | notices | SF.notify (core/js/notify.js), sf-toast | `fw` | uses the Framework | view/index.js:515-570, css :327-335 |
| V-10 | live status | sr-only utility (cannot reach a shadow root) | `set` | the set's own | view/index.js:304-318 |
| V-11 | file drop zone | none shared: sf-tree, sf-file-upload, sf-input-image, sf-input-rich each read dataTransfer on their own | `order` | kept, waits FO-1 | view/index.js:575-602, css :292-303; Framework git grep dataTransfer → tree, file-upload, input-image, input-rich, input-quantity |
| V-12 | first paint | core first-paint contract (host-runtime-marks.js, pending-tags.js), sf-skeleton classes | `fw` | uses the Framework | view/index.js:859-997, view/js/first-paint.css |
| V-13 | tree levels | none (dataview port 1.8.0 tree) | `set` | the set's own | view/js/tree.js:1-111; view/index.js:1731-1764 |
| V-14 | kept sort and page size | SF.Preferences (core/js/preferences.js) | `fw` | uses the Framework | view/index.js:26, :1391-1420 |
| V-15 | saved views | none (R049 views block, C31) | `set` | the set's own | view/index.js:2317-2366 |

## sf-view-table

| Id | Part | Framework part | Verdict | State | Evidence |
|---|---|---|---|---|---|
| T-01 | table engine | .table / .table-frame utility (C146, C185) for the plain table; the data grid is the set's | `set` | the set's own | view-table/js/templates/default.js:353-590; view-table/index.js:2971-3290, :5711-5790, :6977-7072 |
| T-02 | typed cells | field-renderers renderCellField | `fw` | uses the Framework | view-table/index.js:10; view-table/js/templates/default.js:587-643 |
| T-03 | light cells | sf-badge / sf-tag / sf-avatar class markup | `fw` | uses the Framework | view-table/index.js:37; view-table/js/templates/default.js:984-997 |
| T-04 | date text of a host value | field-renderers date reading (DATE_TIME_RE in renderCellField) over core format-date.js | `copy` | round view-r1 item D8 (VF-10) | view-table/js/format-value.js:13-42; also imported by view-properties/index.js:34 and view-flow/index.js:27; Framework src/smart/field-renderers/index.js:1330-1333 |
| T-05 | link cell | sf-reference-link, or the list-item text + supporting line | `copy` | round view-r1 item D8 (VF-10) | view-table/js/templates/default.js:644-662; view-table/js/templates/link-cell-contract.js |
| T-06 | inline boolean edit | sf-checkbox class markup | `fw` | uses the Framework | view-table/index.js:4487-4527 |
| T-07 | row selection | sf-checkbox class markup; the selection logic is the table's | `fw` | uses the Framework | view-table/index.js:1152-1192, :1893-1900; view-table/js/templates/default.js:718 |
| T-08 | toolbar | no sf-toolbar (C155 (8), C184 (1)): sf-button-icon groups + core roving.js (C184) + overflow-row.js (C155) | `fw` | uses the Framework | view-table/js/templates/default.js:112-330 (no roving, no overflow; scheme="primary" on «⋯» :310 and the Create arrow :284) |
| T-09 | search clear | sf-input clearable | `copy` | round view-r1 item D7 (VF-7) | view-table/js/templates/default.js:212-252; Framework src/smart/input/component.json setting clearable |
| T-10 | list toolbar | sf-input, sf-button-icon | `fw` | uses the Framework | view-table/js/templates/default.js:35-110 |
| T-11 | filter count on the list's icon | sf-icon badge-count / badge-cap (sf-icon 1.4.0) | `copy` | round view-r1 item D7 (VF-7) | view-table/js/templates/default.js:57-70 |
| T-12 | filter chips | sf-tag (closable, interactive, count) | `fw` | uses the Framework | view-table/js/templates/default.js:89-100, :146-180 |
| T-13 | layout switch | sf-segmented | `fw` | uses the Framework | view-table/js/templates/default.js:256-264 |
| T-14 | create split button | sf-button / sf-button-icon segment start/end | `fw` | uses the Framework | view-table/js/templates/default.js:266-295 |
| T-15 | popup layer (K-09) | sf-popover (panels and forms), SF.menu.open (menus), sf-menu-context popup + openFor | `copy` | round view-r1 item D1 (VF-1) | view-table/index.js:6199-6560 (portal :6291, clamp :6339, anchorContextMenu :6470), :6566-6650; position: fixed at :1003, :1051, :1078, :3480, :3609, :4815, :4967, :5102, :5248 |
| T-16 | toolbar, sort and create menus | SF.menu.open (core/js/menu-open.js, C184 (4)) | `copy` | round view-r1 item D1 (VF-1) | view-table/index.js:981-1090 |
| T-17 | row menu | SF.menu.open({x, y, entries, returnTo}) | `copy` | round view-r1 item D1 (VF-1) | view-table/index.js:56-75 (menuPointAt), :7133-7244 (openRowMenu, rowMenu) |
| T-18 | template actions submenu | sf-menu-context submenu entries | `copy` | round view-r1 item D1 (VF-1) | view-table/index.js:5230-5294 |
| T-19 | filter panel | sf-settings look=panel apply=button (C106 (1), (4)); C157 (3) order «Применить (N)», then «Сбросить» | `copy` | round view-r1 item D2 (VF-2, VF-8) | view-table/index.js:4676-4945 (footer :4866-4942) |
| T-20 | filter field controls | field-renderers renderFilterField | `fw` | uses the Framework | view-table/index.js:4568-4584 |
| T-21 | filter option rows | sf-input-choice multiple (C165) lacks option visuals and paged remote options | `order` | kept, waits FO-4 | view-table/index.js:4586-4660, :4339-4395 |
| T-22 | chip filter window | none: renderFilterField has no window; ui-admin keeps a hidden sf-view-table to borrow it | `order` | kept, waits FO-5 | view-table/index.js:4947-5023 (footer :4983-5000); ui-admin properties.html:53-55, src/properties.ts:138-148 |
| T-23 | saved filter templates | none (saved views, R049, C31) | `set` | the set's own | view-table/index.js:2059-2745, :3467-3547 |
| T-24 | column settings | sf-settings look=panel fields list (C106 (1): checkbox, handle, pin, search) | `copy` | round view-r1 item D2 (VF-2) | view-table/index.js:5076-5172, :4221-4229, :3640-3870 |
| T-25 | table view settings | sf-settings rows (C176 (1): the gear is for screen settings such as a table's view) | `copy` | round view-r1 item D2 (VF-2) | view-table/index.js:5174-5201 |
| T-26 | column resize | SF.Resizer.attach (sf-resizer, C158) | `fw` | uses the Framework | view-table/index.js:5511-5606 |
| T-27 | column drag | SF.Sortable.attach column mode | `fw` | uses the Framework | view-table/index.js:5838-5880 |
| T-28 | row reorder | sf-sortable / SF.Sortable.attach (C171 (1)-(4)) | `copy` | round view-r1 item D1 (VF-1) | view-table/index.js:1316-1366 |
| T-29 | records dragged out | the Framework's records drag contract (sf-tree accept-records) | `fw` | uses the Framework | view-table/index.js:1304-1314; Framework src/smart/tree/index.js:39, :434 |
| T-30 | grid keyboard | roving.js is one-dimensional; the grid pattern is the table's | `set` | the set's own | view-table/index.js:8101-8350 |
| T-31 | list keyboard | core roving.js orientation vertical (C184 (5)) | `copy` | round view-r1 item D6 (VF-6) | view-table/index.js:1662-1710 |
| T-32 | tree rows | none (treegrid of the data view) | `set` | the set's own | view-table/js/templates/default.js:1161-1215; view-table/index.js:1634-1660 |
| T-33 | windowed rows | none shared | `order` | kept, waits FO-2 | view-table/index.js:1393-1510; view-table/js/templates/default.js:1066-1078 |
| T-34 | empty states | sf-empty-state | `fw` | uses the Framework | view-table/js/templates/default.js:333-341; view-table/index.js:7716-7739 |
| T-35 | loading rows | sf-skeleton classes | `fw` | uses the Framework | view-table/js/templates/default.js:495-512 |
| T-36 | tooltips | sf-tooltip class markup | `fw` | uses the Framework | view-table/js/templates/default.js:456-458, :999-1003; view-table/index.js:8065-8100 |
| T-37 | list layout (C31) | not a new tag by C31; quick actions are sf-icon-button class markup | `set` | the set's own | view-table/js/templates/default.js:826-1060 |
| T-38 | kept widths and view | SF.Preferences | `fw` | uses the Framework | view-table/index.js:33-35, :5607-5690 |

## sf-view-properties

| Id | Part | Framework part | Verdict | State | Evidence |
|---|---|---|---|---|---|
| P-01 | record port | none (the set's contract) | `set` | the set's own | view-properties/index.js:1687-1885, :2338-2500 |
| P-02 | panel | sf-drawer, core layer-stack.js | `fw` | uses the Framework | view-properties/index.js:28, :1957-1999; view-properties/js/templates/default.js:1617 |
| P-03 | section column width | sf-drawer size steps 20 · 24 · 30rem (C157 (2)) | `copy` | parked by the owner (VF-12, q-set-view) | view-properties/index.js:105; view-properties/js/templates/default.js:822-833 |
| P-04 | panel head | sf-button-icon, sf-button-close (C14, C180 (2)) | `fw` | uses the Framework | view-properties/js/templates/default.js:1096-1143 |
| P-05 | «⋯» and view-profile menus | SF.menu.open (C184 (4)) | `copy` | round view-r1 item D1 (VF-1) | view-properties/index.js:1036-1110 |
| P-06 | edge strip | sf-drawer edge slot; look parked (R254) | `copy` | parked by the owner (VF-12, q-set-view) | view-properties/js/templates/default.js:1154, :1169-1217 |
| P-07 | sections | sf-tabs type=vertical / line, overflow=more | `fw` | uses the Framework | view-properties/js/templates/default.js:706-737, :799-821 |
| P-08 | sections while arranging | sf-sortable; cross-section field drops are the set's | `set` | the set's own | view-properties/js/templates/default.js:739-770 |
| P-09 | phone section list | sf-list rows / menu column (C148 (4)); level in the drawer head (C157 (6)) | `copy` | round view-r1 item C5 (VF-11) | view-properties/js/templates/default.js:634-668 |
| P-10 | reading rows | sf-list-description (C33, C180 (1): the set builds on the same parts) | `copy` | round view-r1 item C4, C7 (VF-9) | view-properties/js/templates/default.js:334-434 |
| P-11 | field values | field-renderers renderViewField / renderEditField | `fw` | uses the Framework | view-properties/js/field-value.js:2, :62-100 |
| P-12 | group edit | sf-form (C182: same field descriptor, error summary with links, Save never disabled) | `copy` | round view-r1 item C4, C7 (VF-9) | view-properties/js/templates/default.js:518-633, :892-958 (disabled :919); view-properties/index.js:2258-2400 |
| P-13 | open-all edit and create bar | sf-form footer (C182 (7)) | `copy` | round view-r1 item C4, C7 (VF-9) | view-properties/js/templates/default.js:861-890 (disabled :871) |
| P-14 | field conditions | none: sf-form and field-renderers have no condition grammar | `order` | kept, waits FO-3 | view-properties/js/conditions.js:1-83 |
| P-15 | save confirmation bar | sf-confirm (question, accept, decline) or the C25 question | `copy` | round view-r1 item C4, C7 (VF-9) | view-properties/js/templates/default.js:834-859 |
| P-16 | reading foot | sf-drawer footer (C157 (3)); look parked | `set` | the set's own | view-properties/js/templates/default.js:892-958 |
| P-17 | money and percent | field-renderers has neither type | `order` | kept, waits FO-7 | view-properties/js/set-fields.js:10-20; js/money.js; js/decimal.js |
| P-18 | items and compound | none | `set` | the set's own | view-properties/js/set-fields.js; js/rows.js |
| P-19 | ru.requisites | none (regional) | `set` | the set's own | view-properties/js/requisites.js |
| P-20 | related list | sf-view + sf-view-table (this set) | `set` | the set's own | view-properties/js/templates/default.js:435-464 |
| P-21 | add field | sf-dropdown | `fw` | uses the Framework | view-properties/js/templates/default.js:465-517 |
| P-22 | field settings | sf-popover, sf-input, sf-dropdown, sf-switch | `fw` | uses the Framework | view-properties/js/templates/default.js:122-216 |
| P-23 | view profiles | sf-profile-picker (C163) | `fw` | uses the Framework | view-properties/js/templates/default.js:29-121, :1325-1426 |
| P-24 | arranging the card | sf-sortable; the arrangement is the set's | `set` | the set's own | view-properties/js/templates/default.js:960-1049; view-properties/index.js:2703-3350 |
| P-25 | section icons | core icon-choices.js | `fw` | uses the Framework | view-properties/index.js:27; view-properties/js/templates/default.js:1258-1324 |
| P-26 | uploads | field-renderers file controls | `fw` | uses the Framework | view-properties/index.js:1885-1941 |
| P-27 | copy address | sf-button-copy | `fw` | uses the Framework | view-properties/index.js:2028-2052 |
| P-28 | loading and failure | sf-skeleton classes, sf-empty-state | `fw` | uses the Framework | view-properties/js/templates/default.js:1478-1504 |
| P-29 | paged pickers | sf-input-lookup through field-renderers (C139 (1)) | `fw` | uses the Framework | view-properties/index.js:2105-2180 |

## sf-view-flow

| Id | Part | Framework part | Verdict | State | Evidence |
|---|---|---|---|---|---|
| F-01 | answer state machine | helpers/confirm-surface.js (sf-confirm, sf-confirm-change) | `fw` | uses the Framework | view-flow/index.js:26, :40-44 |
| F-02 | field values | field-renderers through view-properties/js/field-value.js | `fw` | uses the Framework | view-flow/js/templates/default.js:3, :22-46 |
| F-03 | field rows | sf-form fields (C182 (4)-(6)) | `copy` | kept, waits FO-8 | view-flow/js/templates/default.js:22-46 |
| F-04 | collapsible group | sf-accordion | `copy` | kept, waits FO-8 | view-flow/js/templates/default.js:52-75 |
| F-05 | field conditions | none (same as P-14) | `order` | kept, waits FO-3 | view-flow/js/answer.js:8 |
| F-06 | answers | sf-form footer: main first at the start (C159 (4), C182 (7)) | `copy` | kept, waits FO-8; its footer order is round item D10 | view-flow/js/templates/default.js:78-110; js/templates/default.css:156-160 |

## sf-view-board

Added in view round 2 (board helper, owner decisions C298, C304), read over pair `ui-1ed6b6c9a040`.
Evidence is `package/src/smart/view-board/…` on `round/view-r2-board`.

| Id | Part | Framework part | Verdict | State | Evidence |
|---|---|---|---|---|---|
| B-01 | drag, long press, drop line, keyboard move, announcements | sf-sortable (C171); 1.7 roving, sf-sortable-check, Enter/Space (BV-6..BV-8) behind a feature check | `fw` | uses the Framework | view-board/js/templates/default.js (sf-sortable per lane); index.js sortableRoves, _onCheck |
| B-02 | card | .sf-card | `fw` | uses the Framework | view-board/js/templates/default.js renderCard |
| B-03 | card fields («Кратко») | field-renderers renderCellField (C300 (2)); a template per field (C302) waits the template registry | `fw` | uses the Framework; per-field templates come with the registry | view-board/index.js cellShape |
| B-04 | lane head: name, count, «+», «⋯» | sf-badge (C140), sf-button-icon | `fw` | uses the Framework | view-board/js/templates/default.js renderLane |
| B-05 | card menu and lane menu, «Переместить в» with reasons | SF.menu.open (submenu, caption) | `fw` | uses the Framework | view-board/index.js openCardMenu, openLaneMenu |
| B-06 | selection bar | sf-bulk-actions (C295) behind a feature check; before it a strip of sf-button | `fw` | uses the Framework where the pair has it | view-board/js/templates/default.js renderBulk |
| B-07 | phone lane switcher | sf-tabs (pills, counts) | `fw` | uses the Framework | view-board/js/templates/default.js |
| B-08 | refusal message | sf-toast | `fw` | uses the Framework | view-board/index.js _refuse |
| B-09 | lanes, window, moves, limits, order, board grid keys | none: the board layout itself | `set` | the set's own | view-board/js/board.js, index.js |

## sf-view-cards

Added by the view-cards helper (owner decisions C297, C306), read over pair `ui-1ed6b6c9a040`.
Evidence is `package/src/smart/view-cards/…` on `round/view-cards`.

| Id | Part | Framework part | Verdict | State | Evidence |
|---|---|---|---|---|---|
| K-01 | card | .sf-card | `fw` | uses the Framework | view-cards/js/templates/default.js renderCard |
| K-02 | card fields («Кратко») | field-renderers renderCellField (C300 (2)); a template per field (C302) waits the template registry | `fw` | uses the Framework; per-field templates come with the registry | view-cards/index.js cellShape |
| K-03 | selection box, «⋯» | sf-checkbox, sf-button-icon | `fw` | uses the Framework | view-cards/js/templates/default.js renderControls |
| K-04 | «Показать ещё», «Показано N из M» | sf-pagination appearance more (C167), its words in every language pack | `fw` | uses the Framework | view-cards/js/templates/default.js renderMore |
| K-05 | empty, nothing found, no access, error | sf-empty-state | `fw` | uses the Framework | view-cards/js/templates/default.js renderEmpty |
| K-06 | loading cards | sf-skeleton | `fw` | uses the Framework | view-cards/js/templates/default.js renderSkeleton |
| K-07 | card menu | SF.menu.open | `fw` | uses the Framework | view-cards/index.js openCardMenu |
| K-08 | selection bar | sf-bulk-actions (C295) behind a feature check; before it a strip of sf-button | `fw` | uses the Framework where the pair has it | view-cards/js/templates/default.js renderBulk |
| K-09 | grid by width, cover frame, window, grid keys | none: the cards layout itself | `set` | the set's own | view-cards/js/cards.js, index.js, js/templates/default.css |
