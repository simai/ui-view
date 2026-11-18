import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// View returns (DEV acceptance of round 2, VR2-1..VR2-9; sf-view 1.19.0,
// sf-view-table 1.25.0, sf-view-properties 1.18.2, sf-view-board 1.1.1).
// The browser probes are in ui-control control/evidence/2026-11-18-view-returns/probe/.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));
const view = read('src/smart/view/index.js');
const head = read('src/smart/view/js/head.js');
const table = read('src/smart/view-table/index.js');
const tableCss = read('src/smart/view-table/js/templates/default.css');
const card = read('src/smart/view-properties/index.js');

test('VR2-1: the column head menu under the list head keeps pin, hide and all columns', () => {
  assert.match(table, /const underHead = this\.getAttribute\("data-sf-view-columns"\) === "head";/u);
  assert.match(table, /view\.openCustomize\(\);/u);
  assert.match(view, /\n {4}openCustomize\(\) \{/u);
});

test('VR2-2: the view closes the record card on its close request', () => {
  assert.match(view, /event\.currentTarget\.setAttribute\("open", "false"\);/u);
});

test('VR2-3: the open row is filled in the grid and Alt steps the card from the list', () => {
  assert.match(tableCss, /tbody tr\[aria-current="true"\][^{]*\{[^}]*--sf-primary-container/u);
  assert.match(view, /this\._stepFromList = true;/u);
  assert.match(card, /_ownDrawerRoot\(\)/u);
});

test('VR2-4: the head windows carry their own roles and the phone sheet opens', () => {
  assert.match(head, /data-sf-role="head-sheet"/u);
  // The record fields drawer went with C311 (sf-view 1.20.0): the card's own mode.
  assert.doesNotMatch(head, /data-sf-role="head-record"/u);
  assert.match(head, /\n\s+sheet\.open\?\.\(\);/u);
});

test('VR2-5: a page table under layout="board" is parked with one warning', () => {
  // round/view-r4: any layout that is not the table parks the page's table the same way.
  assert.match(view, /!this\._answered && !this\._parkedWarned && want !== "sf-view-table"/u);
});

test('VR2-8: the table inside the view gets total and row-offset', () => {
  assert.match(table, /rowOffset: \{attribute: "row-offset", type: Number, default: 0\}/u);
  assert.match(view, /table\.setAttribute\("row-offset", String\(offset\)\);/u);
  assert.ok(json('src/smart/view-table/component.json').properties?.['row-offset'] ?? read('src/smart/view-table/component.json').includes('"row-offset"'));
});

test('VR2-9: one board request carries the cards and the lane totals', () => {
  assert.doesNotMatch(view, /reason: "lane-sums"/u);
  assert.match(view, /board\.removeAttribute\("sums-pending"\)/u);
});

test('C306: cards sizes S, M and L with M by default; the layout list names board', () => {
  assert.match(head, /merged\.size \?\?= "m"/u);
  assert.match(read('src/smart/view/lang/ru.json'), /"head-size-l"/u);
  assert.match(read('src/smart/view/lang/en.json'), /"head-size-l"/u);
  assert.ok(read('src/smart/view/component.json').includes('"board"'));
});

test('versions and journals', () => {
  for (const [folder, version] of [['view', '1.19.0'], ['view-table', '1.25.0'], ['view-properties', '1.18.2'], ['view-board', '1.1.1']]) {
    const component = json(`src/smart/${folder}/component.json`);
    assert.ok(component['x-history'].some((entry) => entry.version === version), folder);
    assert.ok(component['x-history'].find((entry) => entry.version === version).evidence.includes('2026-11-18-view-returns'), folder);
  }
});
