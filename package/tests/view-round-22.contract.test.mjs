import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// View round 22 (round/view-r22): register VL-37 (a page scrolled to the pager
// was thrown back to its top when a late face measured the table again) and
// the record page 4 px wider than the screen at phone widths. Evidence:
// ui-control control/evidence/2026-11-28-view-r22/.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('VL-37: every measuring moment holds the table height and lets it go', () => {
  const source = read('src/smart/view-table/index.js');
  assert.match(source, /function holdBlockSize\(table\) \{[\s\S]*?setProperty\("min-block-size", `\$\{table\.getBoundingClientRect\(\)\.height\}px`\)/u);
  const adds = [...source.matchAll(/classList\.add\(["']sf-table-measuring/gu)].length;
  const holds = [...source.matchAll(/const letGo = holdBlockSize\(table\);\n\s+table\.classList\.add\(["']sf-table-measuring/gu)].length;
  assert.equal(adds, 3, 'three measuring moments');
  assert.equal(holds, adds, 'each one holds the height first');
  const gives = [...source.matchAll(/table\.classList\.remove\(["']sf-table-measuring[^)]*\);\n\s+letGo\(\);/gu)].length;
  assert.equal(gives, 4, 'every way out of a measuring moment gives the height back (one early return, three finally blocks)');
});

test('the head line\'s last icon button keeps its hit area inside the record', () => {
  const css = read('src/smart/view-properties/js/templates/default.css');
  assert.match(css, /\.sf-property-view-head-line-end > :last-child > \.sf-icon-button::after,\n\s+\.sf-property-view-head-line-end > \.sf-icon-button:last-child::after \{\n\s+inset-inline-end: calc\(var\(--sf-px\) \* 0\);\n\s+inset-inline-start: min\(calc\(var\(--sf-px\) \* 0\), calc\(100% - var\(--sf-hit--touch\)\)\);/u);
});
