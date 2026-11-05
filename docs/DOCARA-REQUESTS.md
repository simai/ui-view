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
