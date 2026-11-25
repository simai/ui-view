import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// View round 17 (sf-view 1.38.0, sf-view-table 1.37.0, package 1.17.0, pair
// ui-b4f79e1c58b7): VN-3, the table's sideways rail no longer takes 15 px
// after the rows under «Показать ещё» (register VL-12: 12 under the last row
// at 1440/1024/768, 8 on a phone), and the set on the pair's public Loader
// calls (SF.Loader.settled, kind-settled test). Measurements in ui-control
// control/evidence/2026-11-23-view-r17/README.md.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const view = read('src/smart/view/index.js');
const paint = read('src/smart/view/js/first-paint.css');
const tableCss = read('src/smart/view-table/js/templates/default.css');
// The passport and the lock sit beside the overlay (SET_ROOT, as the passport tests read them).
const setRoot = process.env.SET_ROOT;

test('the set is pinned on the pair ui-73df5d1b4d4c and needs its runtime', {skip: !setRoot && 'SET_ROOT is not given'}, () => {
  const lock = JSON.parse(readFileSync(resolve(setRoot, 'framework.lock.json'), 'utf8'));
  const set = JSON.parse(readFileSync(resolve(setRoot, 'set.json'), 'utf8'));
  assert.equal(lock.source.revision, '5e30b946fd0e620a4d00ab771af143dc286be1b8');
  assert.equal(set.framework.source_revision, lock.source.revision);
  assert.equal(set.framework.core_runtime, '>=1.69.0');
});

test('VN-3: the rail takes no room after the rows when «Показать ещё» follows them', () => {
  assert.match(tableCss, /:is\(sf-view, sf-data-view\):has\(> \[slot="more"\]:not\(\[hidden\]\)\) sf-view-table \.sf-table-rail:not\(\[hidden\]\) \{\n\s*margin-block-end: calc\(-1 \* \(var\(--sf-px\) \+ var\(--sf-scroll-bg-width\)\)\);\n\s*background-color: transparent;/u);
  // the holder stands over the rail (z-index 5), the view-made one lets the pointer through its gap
  assert.match(paint, /:is\(sf-view, sf-data-view\) > \[slot="more"\] \{\n\s*position: relative;\n\s*z-index: 6;/u);
  assert.match(paint, /> \.sf-view-more\[data-sf-view-made\] \{\n\s*pointer-events: none;/u);
  assert.match(paint, /> \.sf-view-more\[data-sf-view-made\] sf-button \{\n\s*pointer-events: auto;/u);
});

test('VN-3: 12 under the rows at every desktop and tablet width, 8 on a narrow list, the skeleton the same', () => {
  assert.match(view, /slot\[name="more"\]::slotted\(\*\) \{\n[^}]*padding-block: max\(var\(--sf-space-1\\\\\/2\), var\(--sf-b2\)\);/u);
  assert.match(view, /:host\(\[data-sf-view-footer-narrow\]\) slot\[name="more"\]::slotted\(\*\) \{ padding-block: var\(--sf-space-1\\\\\/3\); \}/u);
  assert.match(paint, /\.sf-data-view-skeleton-more \{\n[^}]*padding-block: max\(var\(--sf-space-1\\\/2\), var\(--sf-b2\)\);/u);
  assert.match(paint, /@container \(width < 37\.5rem\) \{[^}]*\}[^}]*\}[^}]*\.sf-data-view-skeleton-more \{ padding-block: var\(--sf-space-1\\\/3\); \}/u);
});
