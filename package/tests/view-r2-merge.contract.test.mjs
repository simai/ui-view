import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// View round 2 merge (sf-view 1.17.0, sf-view-board 1.1.0): the record card
// beside the list for every open of the view, and the board's lane sums in a
// request after the cards (count at once, sum when it arrives).
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));
const view = read('src/smart/view/index.js');
const board = read('src/smart/view-board/index.js');

test('record-card is a declared setting of sf-view', () => {
  assert.equal(json('src/smart/view/component.json').settings['record-card'].type, 'string');
  const manifest = json('src/smart/view/smart.manifest.json');
  assert.equal(manifest.inputs.properties['record-card'].type, 'string');
  assert.ok(manifest.composition.declarative.props.includes('record-card'));
});

test('the table, the list and the board open a record through one path', () => {
  assert.match(view, /detail\.action_id === "view"\) return this\._openRecord\(ids\[0\], detail\);/u);
  assert.match(view, /"sf-view-board-open"\) \{\s*await this\._openRecord\(detail\.id,/u);
  assert.match(view, /_openRecord\(id, detail\) \{\s*const allowed = this\.sfEmit\("open", \{id\}, \{cancelable: true\}\);\s*if \(!allowed\) return null;\s*const card = this\.recordCard;\s*if \(!card\) return this\._raise\("record\.open", detail\);/u);
  assert.match(view, /addEventListener\("sf-view-properties-step", this\._onCardStep\)/u);
  assert.match(view, /addEventListener\("sf-view-properties-close", this\._onCardClose\)/u);
  assert.match(view, /: this\.recordBeside\(from, detail\.direction\)/u);
});

test('recordBeside follows a board by its lanes', () => {
  assert.match(view, /this\.layoutKind === "board"\s*\? \(this\.board\?\.boardLanes \?\? this\.boardLanes \?\? \[\]\)\.filter\(\(lane\) => !lane\.hidden\)\.flatMap/u);
});

test('the board asks counts with the cards and the sums after it is drawn', () => {
  assert.match(view, /per_lane: options\.per_lane \?\? 20, totals: \["count"\]/u);
  assert.match(view, /reason: "lane-sums", query: this\._layoutQuery\(\{per_lane: 0, totals\}\)/u);
  assert.match(view, /board\.toggleAttribute\("sums-pending", this\._laneSumsWanted === true\)/u);
  assert.match(view, /sequence !== this\.sequence \|\| board !== this\.board\) return;\s*const lanes = answer\?\.answer === "applied"/u);
  assert.match(board, /setLaneTotals\(list\) \{/u);
  const component = json('src/smart/view-board/component.json');
  assert.equal(component.settings['sums-pending'].type, 'boolean');
  assert.ok(component.actions['set-lane-totals']);
  assert.ok(json('src/smart/view-board/smart.manifest.json').methods.setLaneTotals);
  assert.match(read('src/smart/view-board/js/templates/default.js'), /component\.sumsAwaited \? html`<div class="sf-view-board__sum" data-pending aria-hidden="true">/u);
});

test('one sf-view number above the round branches', () => {
  const component = json('src/smart/view/component.json');
  // Later rounds number above it (1.18.0 view-calendar); the round's entry stays.
  assert.ok(component['x-history'].some((entry) => entry.version === '1.17.0'));
  const migration = component['x-registry'].compatibility.migrations.find((entry) => entry.to === '1.17.0');
  assert.deepEqual([migration.from, migration.to], ['1.14.0', '1.17.0']);
  for (const branch of ['table', 'head', 'board', 'card']) assert.ok(migration.changes.some((change) => change.includes(`round/view-r2-${branch}`)), branch);
});
