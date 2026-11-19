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
