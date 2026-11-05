# Docara request 7: reproduction

Result: **request 7 does not reproduce as written.** The flag
`legacy_unprefixed_redirects: true` together with entries in `redirects.json`
builds green from a clean checkout. The error the request quoted,
`PORTABLE_PERFORMANCE_RESOURCE_UNSAFE`, comes back when **two `docara build
production` runs work in the same site folder at the same time**. That is what
happened when the request was written: a background build (`scripts/build.sh`)
was still running when a second build was started by hand. Request 7 is
withdrawn and replaced by request 7a below.

## Environment

- Docara v3.11.1 (`simai/docara` from `site/composer.lock`), PHP 8.4.20, macOS.
- ui-view at commit `29ac6eb` (main).
- SIMAI Framework runtime from the ui checkout at the commit that
  `site/simai-framework.lock.json` pins (`runtime.ui.commit`), extracted
  into `site/.framework/` by `site/scripts/build.sh`.

## The flag and the redirects

`site/docara.json`, `locale_routing` with the flag added (the committed file
has the same block without the last line):

```json
"locale_routing": {
  "strategy": "prefixed",
  "root": "redirect",
  "detect_browser_language": false,
  "legacy_unprefixed_redirects": true
},
"redirects_file": "redirects.json",
```

`site/redirects.json`, unchanged at `29ac6eb`:

```json
{
  "schema": "docara.redirects.v1",
  "version": 1,
  "redirects": [
    {"from": "connection", "to": "ru/guide/connection"},
    {"from": "changes", "to": "ru/guide/changes"},
    {"from": "components/view", "to": "ru/components/views/view"},
    {"from": "components/view-table", "to": "ru/components/views/view-table"},
    {"from": "components/view-properties", "to": "ru/components/views/view-properties"},
    {"from": "demos/orders", "to": "ru"},
    {"from": "demos/staff", "to": "ru"}
  ]
}
```

## Steps: the flag with redirects (green)

```sh
git clone <ui-view> ui-view && cd ui-view && git checkout 29ac6eb
cd site && composer install --no-interaction
sh scripts/build.sh <set build workspace> --ui <ui checkout>   # plain build, green
php -r '$f="docara.json";$j=json_decode(file_get_contents($f),true);
  $j["locale_routing"]["legacy_unprefixed_redirects"]=true;
  file_put_contents($f,json_encode($j,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n");'
rm -rf build_production build_production.docara build_production.docara-candidate
DOCARA_SIMAI_UI_ROOT="$PWD/.framework" php -d memory_limit=2G vendor/bin/docara build production
php vendor/bin/docara verify-static build_production
```

`<set build workspace>` is the folder `package/scripts/gates.sh` wrote (it
holds `build/package-receipt.json`). `build.sh` needs it only to place the set
into the installed Docara copy. After that, the `docara build` command alone
is enough.

Output: `Built 41 page(s)`, exit 0. verify-static: `html_pages: 88`, `broken: []`.
The legacy redirects are written: `build_production/guide/connection/index.html`
and `build_production/connection/index.html` both point to `/ru/guide/connection/`.

Also green, at the same commit:

- the flag build on top of an earlier plain build, with `build_production` kept;
- a build after another build was killed mid-way and left a partial
  `build_production.docara-candidate`.

## Steps: two builds at once (red)

At the same checkout, from `site/`:

```sh
export DOCARA_SIMAI_UI_ROOT="$PWD/.framework"
php -d memory_limit=2G vendor/bin/docara build production > c1.log 2>&1 &
sleep 6
php -d memory_limit=2G vendor/bin/docara build production > c2.log 2>&1
wait
```

Both exit 1. The flag is not needed for this. Full output without the banner;
`<checkout>` stands for the clone path.

The first build:

```
Warning: file_put_contents(<checkout>/site/build_production.docara-candidate/ru/guide/changes/index.html): Failed to open stream: No such file or directory in <checkout>/site/vendor/illuminate/filesystem/Filesystem.php on line 204
[PORTABLE_PERFORMANCE_RESOURCE_UNSAFE] <checkout>/site/build_production.docara-candidate/_docara/docara-shell.061452d1f7a4320eb96e76a93d5a7baf133b15037c9d24bb6cc36145c4d9a992.css
```

The second build:

```
Warning: file_put_contents(<checkout>/site/build_production.docara-candidate/ru/guide/recipes/load-from-server/index.html): Failed to open stream: No such file or directory in <checkout>/site/vendor/illuminate/filesystem/Filesystem.php on line 204
File does not exist at path <checkout>/site/build_production.docara-candidate/404.html.
```

The resource named after `PORTABLE_PERFORMANCE_RESOURCE_UNSAFE` changes from
run to run. It is whatever the other build has just removed from the shared
`build_production.docara-candidate`. On 2026-11-05 it was `_docara/search.js`,
which is what request 7 quoted.

## Request 7a, instead of 7

`docara build` has no lock on `<destination>.docara-candidate`. A second build
in the same folder deletes and rewrites the first build's candidate, and both
fail with errors that point at configuration rather than at the second
process. The ask: take a lock (or use a per-run candidate folder). If a lock is
held, fail at once with a clear code such as `PORTABLE_BUILD_IN_PROGRESS`.
