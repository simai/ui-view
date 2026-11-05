# Requests to Docara (simai/docara)

What the set site needed from Docara 3.11.1 and worked around locally. Docara
belongs to its own thread; nothing here was written in simai/docara.

1. **Read a component set's receipt.** A set build lists its passport
   `set.json` beside `smart/` in `package-receipt.json` (standard
   `simai.component-set`: the builder copies the passport into the build).
   `FrameworkPackageReceipt::fromArray` refuses every file not under
   `smart/` (`FRAMEWORK_PACKAGE_RECEIPT_INVALID files`), and `readArchive`
   would refuse `set.json` in the archive. Workaround:
   `site/scripts/materialize-framework-runtime.php` hands Docara the receipt
   without the passport, manifest digest recomputed, and reads the files from
   the build's output directory. Wanted: accept `set.json` (and project it
   beside `smart/` so the Loader's debug read of `<base>/../set.json` finds it).
2. **Declare a set as a set.** The built page declares
   `SF_BOOT_CONFIG.packages.view = {base}`, the plain-package form, so the
   Loader does not treat it as a set (no passport read, no required-set
   report). Wanted: for a receipt with a passport, `{base, version}` with the
   passport's release version, or the one-line `data-sf-sets` form.
3. **Project the Recipe runtime of a newer pair.**
   `scripts/sync-framework-composition-runtime.php` stops on pair
   `ui-e22fefb3c1f8` with `FRAMEWORK_COMPOSITION_IMPORT_UNSUPPORTED:
   distr/core/js/composition/editor-words.mjs -> ../page-language.js` (an
   `.mjs` importing a `.js`). Workaround: `DOCARA_SIMAI_UI_ROOT` names the
   pair's `distr` extracted from ui's git objects (`site/scripts/build.sh`).
4. **Bundle a current pair.** Docara 3.11.1 bundles `ui-7153f7a9c092`
   (core.runtime 1.8.6); a set built over `ui-e22fefb3c1f8` (1.26.1) needs the
   materializer adapted from ui-doc to replace the installed projection. A
   `docara framework use --ui <checkout> --pair <id>` command would make that
   one step for every set site.
5. **Shell tags.** The shell writes `sf-icon-button`, `sf-site-header` and
   `sf-context-menu`, which the pair reports as renamed (warnings in every
   page's console): `sf-button-icon`, `sf-header-site`, `sf-menu-context`.
6. **The set template** itself (standard rollout 4a): the five required
   sections, a generated compatibility block from `set.json` and the receipt,
   and `docara init --template set`. `docs/SET-TEMPLATE.md` lists what to take.
7. **Prefixed-locale redirects break the build.** With `locale_routing`
   `{strategy: prefixed, root: redirect}`, `legacy_unprefixed_redirects: true`
   together with entries in `redirects.json` stops `build production` with
   `PORTABLE_PERFORMANCE_RESOURCE_UNSAFE
   build_production.docara-candidate/_docara/search.js`; either one alone
   builds. Workaround: the old addresses are listed in `redirects.json` by
   hand and the flag is off.
8. **Examples in tabs.** The set site scheme wants several live examples
   behind Framework pill or segmented tabs, one full-width example per tab.
   `:::tabs` draws underline tabs only and cannot hold `:::example`.
   Workaround: one example frame (`examples/home/showcase/`) holding an
   `sf-tabs type="pills"` with one demo per panel, each started on first
   show. Wanted: `:::tabs {type=pills|segmented}` whose panels may be
   examples, frames loaded on first show.
9. **A copyable code line in the hero.** `:::hero` takes two links and one or
   two paragraphs; the scheme puts the one-line connection
   (`data-sf-sets="view"`) under the buttons. Workaround: a code block right
   after the hero. (The owner since chose a separate «Подключение» block
   after the examples, so the site no longer needs this; kept for other
   set sites.) Wanted: a hero `code` slot with the copy button.
10. **A site footer.** Version, Framework compatibility, licence and links at
    the foot of the home page have no Docara block. Workaround: `:::surface`
    with a grid of four plain cards. Wanted: a footer configured once in
    `docara.json` (or generated from the set's `set.json` and receipt) and
    shown on every page.
11. **A full-width landing example.** `:::example` on a landing page is held
    to the reading column with its source tabs and toolbar. Wanted: a
    `layout=wide` / `chrome=none` option for showcase examples on landings.
12. **Language switch and default locale.** With one locale there is no
    switch, which is right, but the move to English as the default needs
    content, `default_locale`, redirects and tracking changed together by
    hand (`site/README.md`, «Languages»). Wanted: `docara locale add en
    --default` doing the four steps.
13. **Component reference from manifests.** The set site generates the
    reference part of each component page from the set's
    `smart.manifest.json` and `component.json` with a translation dictionary
    (`site/scripts/build-reference.mjs`, `config/reference.ru.json`); ui-doc
    has its own generator for the same job. Wanted: the set template (6)
    absorbs it — a `:::reference {component=sf-view-table}` block or a build
    step, with the dictionary as locale data and a check for drift.
14. **An example without its code tabs.** A showcase on a landing wants the
    live screen alone; `:::example` always draws the result and source tabs
    (HTML, CSS, JavaScript) and the toolbar, with no setting to drop them
    (`examples` settings know only `fullscreen` and `wrap`). Workaround:
    `site/scripts/landing-transform.mjs` hides the header in the local
    review copy, and the same example with its code is on the guide page
    `guide/showcase/`, linked as «Код примера». Wanted:
    `:::example {sources=false}` (or `chrome=none`).
15. **Page transforms that change the body fail verify-static.**
    `page_transforms` run after the pages are written, but each page's
    Framework asset plan (`framework.shell.plans`, with `preload.html_sha256`
    of the body outside `pre`/`code`/`script`/`style`) is not recomputed, so
    verify-static reports `@framework-asset-projection: Generated Framework
    page asset plan [ru/index.html] does not match final HTML` for any
    transform that edits markup. Only transforms that touch code blocks pass.
    Workaround: the home-page transform runs on the local review copy, not
    in the build. Wanted: recompute the shell plans after the transforms (the
    builder already republishes the vendor assets there).
