# The site of the set view

Documentation and demonstrations of SIMAI View, built with Docara 3.17.0
(`composer.json` pins it). Its live examples run the set's own build over the
SIMAI Framework pair the set is built on. The layout follows the set site
scheme the owner agreed on 2026-11-05 (ui-control
`control/decisions/2026-11-03-component-sets.md`, «The set site»):

- **Home** (`/ru/`): hero (name, sentence, two buttons), the views of the
  set in Framework pill tabs, each a surface-1 card (table, card, table and card, cards in a stream
  of messages — one frame, `examples/home/showcase/`), the one-line
  connection, advantages and a footer with version, compatibility, licence
  and links.
- **Руководство** (`/ru/guide/`): introduction, quick start, connection, core
  concepts (each with a picture), server connection (REST, Laravel/Larena,
  Bitrix), appearance, keyboard and accessibility, large data, upgrading,
  change history, FAQ.
- **Компоненты** (`/ru/components/`): the reference, by family. Each page's
  top (title in words, badges, introduction) is written by
  `scripts/build-pages.mjs` from `config/components.json`; the part between
  `## Параметры` and `## См. также` by `scripts/build-reference.mjs`; the
  rest is hand-written.
- **Рецепты** (`/ru/recipes/`): tasks solved end to end (owner decision C290:
  a section of its own, no longer inside the guide).
- **Свойства** (`/ru/properties/`): a page per property type of the
  Framework's `SF.fieldRenderers.registry` (23 types, 5 of them the set's
  own), each showing the type in the set's real components: a table cell, a
  filter field, a card to read and to edit, and the states empty, error,
  read-only and phone. `scripts/build-properties.mjs` writes the pages' tops,
  the examples and the overview's table from `config/properties.json`,
  `scripts/property-catalogue.js` (the data) and `scripts/property-demo.js`
  (the example engine); notes under a page's example are hand-written.

```bash
sh package/scripts/gates.sh <workspace>     # build and check the set
sh site/scripts/build.sh <workspace>        # build the site over that build (runs every --check and the lint)
node site/scripts/build-pages.mjs           # component tops, overview, showcase, release blocks
node site/scripts/build-properties.mjs      # the «Свойства» section
node site/scripts/build-reference.mjs [--receipt <workspace>/build/package-receipt.json]
node site/scripts/site-lint.mjs             # the content rules of the set standard §11
node site/scripts/serve.mjs                 # http://127.0.0.1:8790/
sh site/scripts/publish-local.sh            # copy the build to the local test host
node site/scripts/evidence.mjs <site URL> docs/evidence/<date>
```

Each generator takes `--check` (fails on drift).

- `content/ru/` — the pages; `examples/` — the live examples.
- Release data (versions, the pair, the connection lines, the footer) lives
  between `<!-- release:<name> -->` markers and is written by
  `build-pages.mjs` from `package/package.json`, `contracts/releases/`,
  `package/set.json` and the materializer's pin. The lint fails on a release
  literal anywhere else (except the change history).
- `assets/illustrations/` — copies of the D22 pictures of ui-doc, with
  `manifest.json` naming the source commit and each file's hash; an example
  that shows one holds a byte-same copy in its `assets/` folder (the one folder Docara publishes beside an example) (an
  example is published with its own folder only).
- `scripts/landing-transform.mjs` — hides the code tabs of the home page's
  live example. It runs on the local review copy (`publish-local.sh`), not
  in the verified build: Docara requests 14 and 15. A public deployment needs those requests or the
  same step in its pipeline, with verify-static run before it.
- `config/reference.ru.json` — Russian for every manifest string the
  reference shows (`css:<variable>` keys for CSS variables). The generator
  reads the manifests at the commit the set receipt names (the released one,
  or a candidate's with `--receipt`), not the working tree.
- `simai-framework.lock.json` and `contracts/generated/` are written by
  `scripts/materialize-framework-runtime.php` (the pair the set build names and the
  set's receipt); commit them after a rebuild.
- `vendor/`, `.docara/`, `.framework/` and `build_production/` are local.
- The site is not deployed anywhere; view.simai.io is not set up.

## Languages

The site follows the localization registry's layout (set standard §11.15):
`docara.json` declares `ru` and `en`, each under its prefix, with
`locale_routing` `prefixed`. Content is Russian only: `content/en/` holds
the English home as a draft (`draft: true`), so no English page is published
until its text is accepted, and `translations.lock.json` tracks what the
English pages lack. The root redirects to `/ru/` while Russian is the only
published language; English becomes `default_locale` (Docara `locale add en
--default`, which also moves the root and `redirects.json`) with its first
accepted text. Old unprefixed addresses are listed in `redirects.json`.

Docara gaps met on the way are in `../docs/DOCARA-REQUESTS.md`.
