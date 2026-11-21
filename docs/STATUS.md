# Status of the set view

One screen: where the set stands (set standard draft 1.1 §2.3). Read
[START](START.md) first; questions are in [DECISIONS](DECISIONS.md), the
Framework-first record in [FRAMEWORK-FIRST](FRAMEWORK-FIRST.md).

## The pin

| What | Value |
|---|---|
| SIMAI Framework pair | `ui-1ed6b6c9a040` (npm `@simai-studio/ui` 5.20261117.1612, pair next 13: group builds 10 and 11, released 2026-11-17; the round's helpers built over `ui-24d64b7f6eb7`) |
| ui-source revision | `acc113415d98032041f3fdbf3e2ba622c48465a1` (`package/framework.lock.json`, `package/set.json` `framework.source_revision`) |
| core.runtime | the pair carries 1.60.0; the set needs `>=1.51.0` (`set.json` `framework.core_runtime`) |
| Docara (site) | 3.17.0 exactly (`site/composer.json`), one release after the 3.16.0 ui-doc runs (§11.17) |
| Released set | view 1.8.1, `view-69a213f6773f`, built over `ui-141822273efe` |

## Pair ranges of released versions

| Release | Pair | Result | Checked | Evidence |
|---|---|---|---|---|
| view 1.8.1 (`view-69a213f6773f`) | `ui-24d64b7f6eb7` | within (ui-builder `set-pair-range.py check`, interface `4c891a48ee42`) | 2026-11-17 | the release's `pair-range.json` asset; ui-control view round 1 evidence |

## Done

| Part | State | Evidence |
|---|---|---|
| Pin on `ui-24d64b7f6eb7`, Docara 3.14.1 (A1, A2); repinned at the round's merge to `ui-1ed6b6c9a040`, Docara 3.17.0 | done | this page, «The pin»; `site/composer.lock` |
| Framework-first re-run on the pair (A3) | done | [FRAMEWORK-FIRST](FRAMEWORK-FIRST.md); view 1.13.3 history |
| Former names end after the main consumer moves (G1) | done | `package/tests/alias-dates.contract.test.mjs` |
| Version line (B2) | done | `CHANGELOG.md` «Version line»; `package/tests/package-change-journal.contract.test.mjs` |
| Process files (F1) | done | `docs/START.md`, this page, `docs/DECISIONS.md`; `package/tests/set-process-files.contract.test.mjs` |
| Framework-first record and waits (F2) | done | `docs/FRAMEWORK-FIRST.md`; component.json `x-framework-first`; `package/tests/framework-first.contract.test.mjs` |
| Journal with kind, consumer and evidence (F3, F5) | done | component.json `x-history`; `package/docs/view/units.json` |
| Site per C290 and the set-site scheme (E1-E10) | done, local only (ui-view.test) | `site/scripts/site-lint.mjs` |
| Site evidence 8.11/8.12 (E11) | measured; first paint and the hero effect red, waiting Docara orders | `docs/evidence/2026-11-17-view-r1-site/` |
| Passport docs URL empty until the site answers (E12) | waits a Framework order (component-set schema) | [DECISIONS](DECISIONS.md) D3 |
| Record card per C289 (C1-C10), table defects (D1-D10, D2 from `fix/view-c106-settings`) | merged into `round/view-r1` | ui-control `control/evidence/2026-11-17-view-r1-card/`, `…-view-r1-table/`, `…-view-r1-merge/` |
| Calendar layout per C307 (CA-1..CA-10): `sf-view-calendar` 1.0.0, `sf-view` 1.18.0 | on `round/view-calendar`, merged after r3 and cards | ui-control `control/evidence/2026-11-18-view-calendar/` |

## Consumers

| Consumer | Uses tags | Pins a release | `requires_sets` range |
|---|---|---|---|
| Larena (admin, env, file manager) | sf-view, sf-view-table, sf-view-properties | no (placeholder `view-000000000000`; today through ui-pro's copies) | none yet; moves to `data-sf-sets="admin view"` on 2026-12-15 |
| larena-ui (legacy path) | sf-view, sf-view-table, sf-view-properties, event names | no (fixture `view-aaaaaaaaaaaa`) | none |
| ui-admin (admin.simai.io) | sf-view, sf-view-table, sf-view-properties | no | none |
| ui-chat (chat set 1.0.0) | sf-view-properties | no | `view >=1.3.0 <2.0.0` |
| ui-doc (ui.simai.io /ru/pro/) | sf-view, sf-view-table, sf-view-properties, sf-view-flow | no | none |
| ui-pro | its own copies of sf-view, sf-view-table, sf-view-properties | old ids `view-23ed2acf30d7`, `view-aea031ba718b`, `view-240c9361d167` | none; frozen by `view-folders-frozen` (round item B1) |

Source: ui-control `control/research/2026-11-17-view-vs1/` and `…-view-vs2-vs4/data/consumers.tsv` (2026-11-17).

## Open branches

Every remote branch ahead of `main`, with the release that takes it.

| Branch | Release that takes it |
|---|---|
| `release/view-*` | the release branch of one set version (`release/view-1.10.0`: view rounds 5 to 9 and the site structure; `release/view-1.10.1`: view round 10 and the site over view-705a90193256); `main` is fast-forwarded to its bind when the version is released |
| `round/view-r9` | view round 9 (from `round/view-r8` 3a51d35): the set on the pair ui-b654460cad2a, Larena L-2 row selection through sf-bulk-actions (sf-view 1.29.0; sf-view-table 1.29.1, sf-view-board 1.1.3, sf-view-cards 1.0.6, sf-view-calendar 1.1.3 fetch the bar); the view 1.10.0 release |
| `round/view-r10` | view round 10 (from `round/view-r9` 71f1c5a): Larena R9-1, L-4 and R9-G, DEV V10-1..5 (sf-view 1.29.1, sf-view-properties 1.23.6); the view 1.10.1 release |
| `round/view-r13` | view round 13 (from `round/view-r12` 79f7706): the list head and footer study round 4, owner decisions D1 «Подгрузка» (paging pages/more/both/endless, default both) and D3 stacked card fields, returns VHF-13 layout settings at once, VHF-14 CSS sticky table head, VHF-15 sticky list head, VHF-16 natural column widths with sideways scroll, and the round 12 returns VR12A-1 density and one line in «Настроить вид», VR12A-2 long-text and number floors, the record's owner decisions C399-C402, the round 5 returns VR5-1/2/5/6/10 (every head and footer part can be switched off: chrome search/filter/look/page-size (naming any makes the list whole), head.chrome, head.look), the list study v2 returns LV2-1 short columns whole, LV2-6 the cards' page row, LV2-8 the record first on screen kept across a kind switch (sf-view 1.32.0, sf-view-table 1.31.0, sf-view-cards 1.1.0, sf-view-properties 1.26.0, sf-view-flow 1.1.7), candidate 1.11.0 |
| `round/view-r12` | view round 12 (from `round/view-r11` 9609c88): the list head and footer study rounds 2-3 (VHF-3 two head states, VHF-4 «Текст в одну строку», VHF-5 the head answers to the list beside a docked card, VHF-6/7 the card stage line, VHF-8 compact rows with the row menu, VHF-9 heading title, VHF-10 board text by size, VHF-11 no boxes without bulk actions, VHF-12 card head line), the record study VRS-7..9, the C393 star toggle and owner decisions D2 «Канбан», D4 one list density, D5 one line off by default (sf-view 1.31.1, sf-view-table 1.30.0, sf-view-properties 1.25.0, sf-view-board 1.1.5, sf-view-cards 1.0.7; above ui-pro pro-f6c43828e5f2), candidate 1.10.3 |
| `round/view-r11` | view round 11 (from `main` 0c1b7ec, with `round/view-site-1.10.1` merged): VR11-1 section column, R9-1 list-shape and printed total, «Изменено» against the stored kind, the reread after a whole-record conflict, VR11-2 row density one rung on every size step, VR11-3 the phone head row inside its list down to 320 px (probe) (sf-view 1.30.0, sf-view-properties 1.23.9, sf-view-table 1.29.3), candidate 1.10.2 |
| `round/view-site-docara-3.18` | the site on Docara 3.18.0 (from `round/view-site-1.10.1` 7757233, DEV): the reader settings menu at size 1 (DCR-4); merged into `round/view-r11` |
| `round/view-site-1.10.1` | the site over the release view-3dc9ad31d0f4 (from `main` 0c1b7ec, DEV): generated lines, Russian panel-size text, change history 1.10.1; merged into `round/view-r11` |
| `round/view-site-1.10.0` | the site over the release view-705a90193256 (from `main` 1a174ac, DEV): generated lines regenerated, the bulk-actions diagram readable; the view 1.10.1 release |
| `round/view-r8` | view round 8 (from `round/view-site` abd3ca8): DEV's returns R67-1..3 and VSA-1..5 (sf-view 1.28.0, sf-view-table 1.28.0, sf-view-properties 1.23.3, the set's candidate 1.10.0), then R8-1 no cut card field (sf-view-cards 1.0.5) and the site build that runs twice in a row; the view 1.10.0 release |
| `round/view-site` | view site round (from `round/view-r7` 0a6d6bf): the site orders VS-SITE-1..14 (first paint of the home example, repin to pair ui-dc9fc39aeb26, home, guide, recipes, reference text), the cards count said once, the person's last view opened from their layer (sf-view 1.27.0, sf-view-cards 1.0.4); the next view release, with round 7 |
| `round/view-r7` | view round 7 (from `round/view-r6` a237bbd): VS-8 the view's filter fields on the head row, the count line of a board and cards, simai.dataview-port 1.16.0 (levels, the person's preferences layer), the panel's strip patch behind the component.tabs 1.5.4 check, DEV's round-5 returns R5-1..R5-4 (default page size 20), the view-config/1 contract (sf-view 1.26.0, sf-view-table 1.27.1, sf-view-properties 1.23.1); the next view release, after round 6 |
| `round/view-r6` | view round 6 (from `round/view-r5` 279c7f5): VZ-1 the list head's view zone, table columns before scroll, VB-1 panel surfaces in the dark theme (sf-view 1.25.0, sf-view-table 1.27.0, sf-view-properties 1.23.0); the next view release, after round 5 |
| `round/view-r5` | view round 5 (from `main` 882bd57, view 1.9.0): DEV's open items B1-B3 and the list study order LV-2..LV-13 (sf-view 1.24.0, sf-view-table 1.26.0, sf-view-properties 1.22.0, sf-view-board 1.1.2); the next view release |
| `round/view-r5-shadow-menu` | view round 5: sf-view-table 1.25.2 (DEV msg-b353fce8), merged into `round/view-r5` |
| `round/view-r1` | view 1.9.0 (the round) |
| `round/view-r4` | view round 4: the dispatcher's merge of `round/view-returns` 50f0639, `round/view-cards` ae80702 and `round/view-calendar` 454f86e, with view-config/1 calendar and cards keys, C311 (5) and the list head filter window (C310); the next view release |
| `round/view-returns` | view returns of round 2 (VR2-1..VR2-9, from `round/view-r3` 3d5ddf8; sf-view 1.19.0, sf-view-table 1.25.0, sf-view-properties 1.18.2, sf-view-board 1.1.1) and the record card settings (C311; sf-view-properties 1.19.0, sf-view 1.20.0); merged after `round/view-cards` and `round/view-calendar`; for the dispatcher's acceptance |
| `round/view-calendar` | view calendar layout sf-view-calendar 1.0.0 (C307, from `round/view-r2` 42442ee), a helper's branch; merged by the dispatcher into `round/view-r4` after `round/view-cards` (sf-view 1.22.0 there) |
| `round/view-cards` | view cards layout sf-view-cards 1.0.0 (C297, C306, from `round/view-r2` 42442ee), a helper's branch; merged by the dispatcher into `round/view-r4` (sf-view 1.21.0 there) |
| `round/view-r3` | view round 3 (from `round/view-r2` 42442ee): the head's display kind switches the layout live (sf-view 1.18.0), no empty group head (sf-view-properties 1.18.1), property-page layout shift, money page size, the board and list head pages; for the dispatcher's acceptance |
| `round/view-r2` | view round 2: the dispatcher's merge of the five `round/view-r2-*` branches (sf-view 1.17.0); `round/view-r3` builds on it; to close after the release |
| `round/view-r2-*` | view round 2 (C296-C305): the helpers' branches (table, head, page, board, card) cut from `round/view-r1` 6062713, merged by the dispatcher into `round/view-r2` (table, head, page, board, card); to close after the release |
| `round/view-r1-site` | view 1.9.0: merged into `round/view-r1` (the round's merge); to close after the release |
| `round/view-r1-card` | view 1.9.0: merged into `round/view-r1` (the round's merge); to close after the release |
| `round/view-r1-table` | view 1.9.0: merged into `round/view-r1` (the round's merge); to close after the release |
| `fix/view-c106-settings` | view 1.9.0: round item D2, in `round/view-r1` through `round/view-r1-table` |
| `fix/view-pro-followups` | view 1.9.0 (base of the round) |
| `fix/view-footer-colmenu` | view 1.9.0 (in `round/view-r1`) |
| `fix/view-set-j1` | view 1.9.0 (in `round/view-r1`) |
| `fix/property-view-title-vp5` | view 1.9.0 (in `round/view-r1`) |
| `fix/view-c32-windows` | none: its view 1.7.2 was passed over by 1.8.0; to close or carry (dispatcher) |
| `fix/docs-name-column` | none: a site transform (C10 D2) not in the round; to close or carry (dispatcher) |
| `view/next-1108-repin-da2ee1` | none: a repin to `ui-da2ee1d6aa62`, superseded by later repins; to close |
