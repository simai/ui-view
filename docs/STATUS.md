# Status of the set view

One screen: where the set stands. The full process files (START, DECISIONS,
FRAMEWORK-FIRST) and the rest of this page come with view round 1 (group 5).

## The pin

| What | Value |
|---|---|
| SIMAI Framework pair | `ui-24d64b7f6eb7` (npm `@simai-studio/ui` 5.20261117.1311, group build 9, released 2026-11-17) |
| ui-source revision | `40541c0c4fba6c24659907eb987c74f17a4fc46a` (`package/framework.lock.json`, `package/set.json` `framework.source_revision`) |
| core.runtime | the pair carries 1.59.0; the set needs `>=1.51.0` (`set.json` `framework.core_runtime`) |
| Docara (site) | 3.14.1 exactly (`site/composer.json`), the version ui-doc runs |
| Released set | view 1.8.1, `view-69a213f6773f`, built over `ui-141822273efe` |

## Pair ranges of released versions

| Release | Pair | Result | Checked | Evidence |
|---|---|---|---|---|
| view 1.8.1 (`view-69a213f6773f`) | `ui-24d64b7f6eb7` | within (ui-builder `set-pair-range.py check`, interface `4c891a48ee42`) | 2026-11-17 | the release's `pair-range.json` asset; ui-control view round 1 evidence |
