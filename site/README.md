# The site of the set view

Documentation and demonstrations of SIMAI View, built with Docara 3.11.1
(`composer.json` pins it). Its live examples run the set's own build over the
SIMAI Framework pair the set is built on. The layout follows the set site
scheme the owner agreed on 2026-11-05 (ui-control
`control/decisions/2026-11-03-component-sets.md`, «The set site»):

- **Home** (`/ru/`): hero (name, sentence, two buttons), the views of the
  set in Framework pill tabs (table, card, table and card, cards in a stream
  of messages — one frame, `examples/home/showcase/`), the one-line
  connection, advantages and a footer with version, compatibility, licence
  and links.
- **Руководство** (`/ru/guide/`): introduction, quick start, connection, core
  concepts, recipes, server connection (REST, Laravel/Larena, Bitrix),
  appearance, keyboard and accessibility, large data, upgrading, change
  history, FAQ.
- **Поля** (`/ru/fields/`): every field type the views draw, taken from
  the Framework's `SF.fieldRenderers.registry` (18 types); an overview with
  one record holding every type, then a page per family (text, numbers,
  dates, yes/no, choice, people and links, files, colour), each with a live
  example: the records in a table, a card to read and a card to edit.
- **Компоненты** (`/ru/components/`): the reference, by family. Each page has
  a hand-written top (description, live examples) and a generated part
  between `## Параметры` and `## См. также`.

```bash
sh package/scripts/gates.sh <workspace>     # build and check the set
sh site/scripts/build.sh <workspace>        # build the site over that build
node site/scripts/build-reference.mjs       # rewrite the generated reference
node site/scripts/build-reference.mjs --check   # fails on drift or a missing translation
node site/scripts/serve.mjs                 # http://127.0.0.1:8790/
sh site/scripts/publish-local.sh            # copy the build to the local test host
node site/scripts/evidence.mjs <site URL> docs/evidence/<date>
```

- `content/ru/` — the pages; `examples/` — the live examples.
- `scripts/landing-transform.mjs` — hides the code tabs of the home page's
  live example. It runs on the local review copy (`publish-local.sh`), not
  in the verified build: Docara requests 14 and 15. A public deployment needs those requests or the
  same step in its pipeline, with verify-static run before it.
- `scripts/name-column-transform.mjs` — keeps the names in the first column
  of the reference tables whole (decision C10: the documentation gives the
  «Имя» column a width). A Docara page transform (`docara.json`
  `page_transforms`, Docara request 16): it adds one rule to the head of each
  page with a Markdown table, so it runs in the verified build.
- `scripts/field-demo.js` — the engine and catalogue of the «Поля»
  examples; `node site/scripts/build-field-examples.mjs` writes
  `examples/fields/<family>/` from it (`--check` fails on drift).
- `config/reference.ru.json` — Russian for every manifest string the
  reference shows (`css:<variable>` keys for CSS variables). The generator
  reads the manifests at the commit the set receipt names, not the working
  tree.
- `simai-framework.lock.json` and `contracts/generated/` are written by
  `scripts/materialize-framework-runtime.php` (the pair the set build names and the
  set's receipt); commit them after a rebuild.
- `vendor/`, `.docara/`, `.framework/` and `build_production/` are local.
- The site is not deployed anywhere; view.simai.io is not set up.

## Languages

Content is Russian only, but every page already lives under a locale prefix:
`docara.json` declares `ru` with `public_prefix: "ru"`, `locale_routing`
`prefixed` with `root: "redirect"`, so `/` redirects to `/ru/`. Old
unprefixed addresses are listed in `redirects.json` (Docara's
`legacy_unprefixed_redirects` breaks the build together with it — Docara
request 7).

When the English text exists:

1. Add the `en` locale (`content/en/`, `public_prefix: "en"`) to `docara.json`
   and make it `default_locale`; the root redirect then goes to `/en/` and the
   header shows the language switch (Docara draws it from two locales on).
2. Track translations (`translations.lock.json`) so a changed Russian page
   marks its English page stale.
3. Give the reference generator an English dictionary or let it write the
   manifest's own English for `content/en/components/`.
4. Point `redirects.json` at the new default locale.

Further languages follow the same route, one locale at a time.

Docara gaps met on the way are in `../docs/DOCARA-REQUESTS.md`.
