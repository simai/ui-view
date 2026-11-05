# The site of the set view

Documentation and demonstrations of SIMAI View, built with Docara 3.11.1
(`composer.json` pins it), Russian content, the five sections of standard
`simai.component-set` (`one-site-per-set`): Обзор, Подключение, Компоненты,
Демо, Изменения. Its live examples run the set's own build over the SIMAI
Framework pair the set is built on.

```bash
sh package/scripts/gates.sh <workspace>     # build and check the set
sh site/scripts/build.sh <workspace>        # build the site over that build
node site/scripts/serve.mjs                 # http://127.0.0.1:8790/
node site/scripts/evidence.mjs http://127.0.0.1:8790/ docs/evidence/<date>
```

- `content/ru/` — the pages; `examples/` — the live examples and demos.
- `simai-framework.lock.json` and `contracts/generated/` are written by
  `scripts/materialize-framework-runtime.php` (the pair the set build names and the
  set's receipt); commit them after a rebuild.
- `vendor/`, `.docara/`, `.framework/` and `build_production/` are local.
- The site is not deployed anywhere; view.simai.io is not set up.

Docara gaps met on the way are in `../docs/DOCARA-REQUESTS.md`.
