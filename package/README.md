# The component set `view`

This folder is the source of the component set `view` (standard
`simai.component-set` 1.0.0 of SIMAI Framework), product «SIMAI View», Pro
licence: its passport `set.json`, the four components under `src/smart/`,
their tests and the scripts that test, probe and stage them.

| Folder | Element | Former tag (until 2027-01-01) | What it is |
|:---|:---|:---|:---|
| `src/smart/view` | `sf-view` | `sf-data-view` | the data view: a host's data port (`simai.dataview-port`) drawn as a table with search, filters, sorting, pages, saved views and a tree |
| `src/smart/view-table` | `sf-view-table` | `sf-table` | the smart table: typed cells, columns, row actions, filters, pages; fed directly or by `sf-view` |
| `src/smart/view-properties` | `sf-view-properties` | `sf-property-view` | the record card: a record's properties in groups and sections, read and edited |
| `src/smart/view-flow` | `sf-view-flow` | — | the flow block, preview: a record's properties as a block in a flow (a chat, a feed), shown or answered |
| `src/smart/view-board` | `sf-view-board` | — | the board, preview: lanes by one field, cards moved between them; `sf-view layout="board"` draws it |
| `src/smart/view-cards` | `sf-view-cards` | — | the cards, preview: records as cards in a grid, a cover, a title and up to four fields; `sf-view layout="cards"` draws it |
| `src/smart/view-calendar` | `sf-view-calendar` | — | the calendar, preview: records on the days of their date field (month, week, day, list), moved and stretched; `sf-view layout="calendar"` draws it |

The components came from `simai/ui-pro` `components/src/smart/` at
`c2a3b48d140f` (the `pro` bundle keeps shipping them until it is rebuilt from
the sets). Their history before the move is there.

## Built against a pinned ui-source

The components import the free SIMAI Framework by relative path
(`../../core/js/smart-base`, `../field-renderers/index.js`). They are built
and tested in an **overlay**: ui-source at the revision `framework.lock.json`
pins (from git, never a working tree), with this folder's `src/`, `tests/`
and `docs/` laid over it. A file here may not replace a ui-source file.

The pin is `049a2ba3dc7d`, the source of the released pair
`ui-b654460cad2a` (core.runtime 1.64.0). The passport names the same commit.

```bash
node scripts/test.mjs                                   # unit and contract suite in the overlay
node scripts/check-registry.mjs                         # passport against the name registry at ui-source main
node scripts/run-manifest-probes.mjs <free> <set build> # every probe.json, real Loader, set declared
node scripts/run-browser-probes.mjs <free> <set build>  # tests/browser/*.browser.mjs in a real browser
node scripts/run-first-paint.mjs check|gate <free> <set build>
```

`<free>` is the `distr` of the released pair (`git -C <ui> archive
b654460cad2a distr`), `<set build>` the build output holding `smart/`
(`wave-1/output/package/view` of the build below). `scripts/gates.sh` runs
the whole chain: two builds, the receipt, the suite, the probes and the first
paint.

## Building the set

ui-builder builds it over the pinned ui-source, from committed bytes, twice:

```bash
node <ui-builder>/scripts/verify-package-reproducibility.cjs \
  <ui-source> <new workspace> --package view \
  --package-source <ui-view> --package-path package --package-revision <commit>
python3 <ui-builder>/scripts/write-package-receipt.py --report <workspace>/report.json --ui <ui>
```

The output is `set.json`, `smart/<folder>/…` and `smart/rule.js`, one
`SF.RuleLoader.registerPackage("view", {rules})` call, and a receipt that names
the ui-source revision and the free release it was built over. The release
route (ui-builder `publish-package-release.sh`) lays it into `package/dist/`
and tags `view-<12>`.

The package core `smart/view-common` (package.json `simai.core`) is the code
two or more View bundles share: the SIMAI Framework field renderers, formats,
conditions and filter window, and what two View components share. It is built
once, registers its modules with the page's runtime, and every other bundle
takes them as `SF.runtimeModule("view/<module>", 1)`. Each component's rule
relates to `cl-view-common`, so the Loader fetches it first; a page that
includes View bundles by hand puts `smart/view-common/js/view-common.min.js`
before them. `sf-view` relates to the table lazily: a list that shows the
board, the cards or the calendar does not fetch it, and a table written in
the list's markup is asked for by the core (`view-common/markup-table.js`),
since the Loader does not read inside an element not yet defined; with a
table list on the page `sf-view` is defined after the table, as before. The gate step «bundles»
(`scripts/check-bundles.mjs`) fails a module found in two bundles and a bundle
over its gzip budget in `bundle-budgets.json`, which also names the one
allowed duplicate (sf-view-flow's copy of the record's field value).

## Connecting it

```html
<script src="https://cdn.jsdelivr.net/npm/@simai-studio/ui@5.20261120.1816/distr/core/js/core.min.js" data-sf-sets="view"></script>
```

or, from a base the page serves itself:

```js
window.SF_BOOT_CONFIG = {packages: {view: {base: '/assets/ui-view/smart', version: '1.3.0'}}};
```

## Moving to a newer SIMAI Framework

Change `framework.lock.json` and `set.json` `framework.source_revision` to the
ui-source revision of a newer released pair, run the gates against it and
build. A set is built and tested against exactly one revision.

## Proposals, not built

Recorded here so they are not lost. None of them is in the set; each needs a
prototype and the owner's yes first (a new look, decision D11e).

- **A rail in the `sf-view-properties` skeleton** (simai/ui-pro#3.2,
  2026-11-09). In the default `sections-as="list"` a record of two or more
  sections draws a section rail (224px) beside its groups once the data
  comes, so the first group moves right and narrows (900 to 644px at the
  measured width). The skeleton could draw the rail's place when the number
  of sections is known before the first answer (a printed answer, or a
  declared `sections` count), and keep the full-width 3x3 shape otherwise,
  as it is now. Not built: it is a new look of the first paint.
