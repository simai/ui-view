# Start here

The handoff a new thread reads first (set standard draft 1.1 §2.2).

## What the set is

`view` is the SIMAI Framework component set for data views: `sf-view` (records
from the application through a port), `sf-view-table` (the typed table and
compact list), `sf-view-properties` (one record's card) and `sf-view-flow` (a
few properties as a block in a stream, preview). The set lives in this
repository: `package/` is the set, `site/` its Docara site, `docs/` the process
files and evidence. It is released by the SIMAI Framework dispatcher
(ui-control); this repository has one writer at a time.

## Where the pin is

- `package/framework.lock.json` and `package/set.json` `framework` name the
  SIMAI Framework pair and ui-source revision the set builds over, and the
  `core.runtime` range it needs. [STATUS](STATUS.md) shows the values.
- `contracts/releases/view-<12>.lock.json` is one per released version.
- `site/scripts/materialize-framework-runtime.php` (`RELEASE_LOCK`,
  `NPM_VERSION`) pins the pair the site runs; `site/composer.json` pins Docara.

## How to run the gates

```sh
node package/scripts/test.mjs                    # unit and contract suite (overlay of the pinned ui-source)
sh package/scripts/gates.sh <new workspace>      # all seven gates over HEAD (long: nohup)
sh site/scripts/build.sh <workspace> [--ui DIR]  # the site over that build, with its checks and lint
node site/scripts/evidence.mjs <site URL> docs/evidence/<date>-<what>
```

Sibling checkouts `../ui-source`, `../ui` and `../ui-builder` are the defaults.

## Process files

- [STATUS](STATUS.md) — one screen: the pin, what is done with its evidence,
  consumers, open branches.
- [DECISIONS](DECISIONS.md) — the set's questions and answers (D<n>).
- [FRAMEWORK-FIRST](FRAMEWORK-FIRST.md) — every part's verdict, the copies kept
  and the Framework orders they wait for.
- [DOCARA-REQUESTS](DOCARA-REQUESTS.md) — what the site needs from Docara.
- `CHANGELOG.md` (root) and component.json `x-history` with the generated
  `package/docs/view/units.json` — the journal.

## The open round

View round 1 (ui-control `control/research/2026-11-17-view-round-1/assignment.md`):
target view 1.9.0 over pair `ui-1ed6b6c9a040`; branch `round/view-r1` collects
the helpers' branches (`round/view-r1-*`). The record card follows C289, the
site C290.
