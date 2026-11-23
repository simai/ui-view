// MOD1-3 (acceptance of view modular step 1), view round 17: sf-view-table
// (_waitsForView) and sf-view (_kindGivesUp, MOD1-1) ask the SIMAI Framework
// Loader whether a display kind's module came or failed through its public
// call SF.Loader.settled(tag) (core.runtime 1.67.0, group build 17 L2): a
// promise of "defined" or "failed" that never rejects. Before round 17 both
// read the core's internal pending tags (SF.__internal.pendingTags.settled);
// that migration debt is closed (Compatibility Ledger in ui-control). This
// pins that the pinned ui-source (the overlay) has the call on the Loader's
// public list and that the set reads only it.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const api = JSON.parse(readFileSync(new URL('../src/core/contracts/public-js-api.json', import.meta.url), 'utf8'));
const loaderSource = readFileSync(new URL('../src/core/js/loader.js', import.meta.url), 'utf8');

test('the pinned Loader offers settled(tag) in public', () => {
  assert.match(JSON.stringify(api), /"settled"/u, 'settled is on the public JS API list');
  assert.match(loaderSource, /SFLoaderPlugin\.prototype\.settled = function \(tag\)/u);
  assert.match(loaderSource, /sf-loader-module-failed/u);
});

test('the set reads the public call, not the core internal', () => {
  const table = readFileSync(new URL('../src/smart/view-table/index.js', import.meta.url), 'utf8');
  const view = readFileSync(new URL('../src/smart/view/index.js', import.meta.url), 'utf8');
  assert.match(table, /globalThis\.SF\?\.Loader\?\.settled\?\.\(host\.localName\)/u);
  assert.match(view, /loader\.settled\(tag\)/u);
  assert.match(view, /state === "failed"/u);
  for (const [name, text] of [['view-table', table], ['view', view]]) {
    const code = text.split('\n').filter((line) => !/^\s*\/\//u.test(line)).join('\n');
    assert.doesNotMatch(code, /__internal\?*\.pendingTags/u, `${name} no longer reads SF.__internal.pendingTags`);
  }
});

test('the table no longer hands checked ticks to the Loader itself (group build 17 L1 shows them at once)', () => {
  const table = readFileSync(new URL('../src/smart/view-table/index.js', import.meta.url), 'utf8');
  const code = table.split('\n').filter((line) => !/^\s*\/\//u.test(line)).join('\n');
  assert.doesNotMatch(code, /adoptSelectionGlyphs/u);
  assert.match(code, /preloadSelectionGlyphs\(\)/u, 'the tick is still asked for with the first font');
});
