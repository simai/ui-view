# The component set `view`

This folder is the source of the component set `view` (standard
`simai.component-set` 1.0.0 of SIMAI Framework), product «SIMAI View», Pro
licence: its passport `set.json`, the three data views under `src/smart/`,
their tests and the scripts that test, probe and stage them.

| Folder | Element | Former tag (until 2027-01-01) | What it is |
|:---|:---|:---|:---|
| `src/smart/view` | `sf-view` | `sf-data-view` | the data view: a host's data port (`simai.dataview-port`) drawn as a table with search, filters, sorting, pages, saved views and a tree |
| `src/smart/view-table` | `sf-view-table` | `sf-table` | the smart table: typed cells, columns, row actions, filters, pages; fed directly or by `sf-view` |
| `src/smart/view-properties` | `sf-view-properties` | `sf-property-view` | the record card: a record's properties in groups and sections, read and edited |

The components came from `simai/ui-pro` `components/src/smart/` at
`c2a3b48d140f` (the `pro` bundle keeps shipping them until it is rebuilt from
the sets). Their history before the move is there.

## Built against a pinned ui-source

The components import the free SIMAI Framework by relative path
(`../../core/js/smart-base`, `../field-renderers/index.js`). They are built
and tested in an **overlay**: ui-source at the revision `framework.lock.json`
pins (from git, never a working tree), with this folder's `src/`, `tests/`
and `docs/` laid over it. A file here may not replace a ui-source file.

The pin is `8c0b5d2b93e7`, the source of the released pair
`ui-5edc71bd6936` (core.runtime 1.37.0). The passport names the same commit.

```bash
node scripts/test.mjs                                   # unit and contract suite in the overlay
node scripts/check-registry.mjs                         # passport against the name registry at ui-source main
node scripts/run-manifest-probes.mjs <free> <set build> # every probe.json, real Loader, set declared
node scripts/run-browser-probes.mjs <free> <set build>  # tests/browser/*.browser.mjs in a real browser
node scripts/run-first-paint.mjs check|gate <free> <set build>
```

`<free>` is the `distr` of the released pair (`git -C <ui> archive
5edc71bd6936 distr`), `<set build>` the build output holding `smart/`
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
and tags `view-<12>`; it is not run yet.

## Connecting it

```html
<script src="https://cdn.jsdelivr.net/npm/@simai-studio/ui@5.20261107.2234/distr/core/js/core.min.js" data-sf-sets="view"></script>
```

or, from a base the page serves itself:

```js
window.SF_BOOT_CONFIG = {packages: {view: {base: '/assets/ui-view/smart', version: '1.3.0'}}};
```

## Moving to a newer SIMAI Framework

Change `framework.lock.json` and `set.json` `framework.source_revision` to the
ui-source revision of a newer released pair, run the gates against it and
build. A set is built and tested against exactly one revision.
