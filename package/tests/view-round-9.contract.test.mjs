// View round 9 (round/view-r9): Larena's wish L-2, row selection in sf-view
// through the group actions bar sf-bulk-actions (C295), and the rules of the
// set's layouts that draw the bar fetching it.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const view = read('src/smart/view/index.js');
const body = (name) => view.split(`\n    ${name}(`)[1].split('\n    }\n')[0];

test('L-2: where the pair carries the bar, the marked rows\' band is sf-bulk-actions', () => {
  assert.match(view, /function bulkBarAvailable\(\) \{\s*return Boolean\(globalThis\.customElements\?\.get\?\.\("sf-bulk-actions"\) \|\| globalThis\.SF\?\.RuleLoader\?\.\["cl-bulk-actions"\]\);/u);
  assert.match(body('_renderBulkBand'), /if \(bulkBarAvailable\(\)\) return this\._renderBulkBar\(\{pagination, selected, actions\}\);/u,
    'the bar first; the band of before only over a pair without it');
  const bar = body('_renderBulkBar');
  assert.match(bar, /document\.createElement\("sf-bulk-actions"\)/u);
  for (const [name, value] of [['slot', 'bulk'], ['place', 'dock']]) assert.match(bar, new RegExp(`setAttribute\\("${name}", "${value}"\\)`, 'u'));
  for (const name of ['size', 'label', 'count-text', 'page-count', 'total', 'all-selected', 'count']) assert.match(bar, new RegExp(`chosen\\("${name}", `, 'u'), name);
  assert.match(bar, /bar\.actions = list;/u);
  // The band of before goes when the bar comes, and the bar goes with the actions.
  assert.match(bar, /this\._bulkBand\.remove\(\)/u);
});

test('L-2: the bar\'s events go the band\'s ways', () => {
  const bar = body('_renderBulkBar');
  assert.match(bar, /"sf-bulk-actions-action", \(event\) => this\._onBulkBarAction\(event\)/u);
  assert.match(bar, /"sf-bulk-actions-select-all", \(\) => this\._setBulkForAll\(true\)/u);
  assert.match(bar, /"sf-bulk-actions-select-page", \(\) => this\._setBulkForAll\(false\)/u);
  assert.match(bar, /"sf-bulk-actions-clear", \(\) => this\.clearSelection\(\)/u);
  const action = body('async _onBulkBarAction');
  assert.match(action, /this\.applyUnderFilter\(String\(id\), this\.total\)/u, 'all under the filter: bulk.apply_under_filter over the confirmed total');
  assert.match(action, /this\._action\(\{action_id: String\(id\), record_ids: ids\}, \{selectedBulk: true\}\)/u, 'the marked rows: bulk.apply_selected');
  assert.match(action, /this\._bulkResult\(answer, \{ids, scope\}\)/u);
  assert.match(body('_setBulkForAll'), /this\.pagination\?\.setActionForAll\?\.\(on\)/u, 'the page row keeps the for-all state');
});

test('L-2: the host\'s answer is the bar\'s result line', () => {
  const result = body('_bulkResult');
  // View round 10 (V10-1): the marks are cleared before the result is said,
  // so «Готово N из N» is the bar's last word, not «Выбор снят».
  assert.match(result, /const ok = scope === "all" \? this\.total : ids\.length;\s*this\.clearSelection\(\);\s*bar\.result\(\{ok, failed: \[\]\}\)/u, 'applied: done, the bar goes back');
  assert.match(result, /\["refused", "conflict", "unavailable"\]/u);
  assert.match(result, /\["not-confirmed", "total-counted"\]\.includes\(answer\.reason\)/u, 'a question not confirmed or an estimate counted first says nothing');
  assert.match(result, /stale\.has\(String\(key\)\) \? staleText : reason/u, 'the rows a conflict names say they changed');
  assert.match(body('_recordText'), /column\?\.role === "title"/u, 'a row is named by its title column');
  // The refusal is said once: in the bar, not also as a corner notice.
  assert.match(body('_showAnswer'), /const inBar = intent === "bulk\.apply_selected" && this\._bulkBarRaising === true/u);
});

test('L-2: the bar\'s actions keep the band\'s rules and take the view\'s icons', () => {
  const actions = body('_bulkBarActions');
  assert.match(actions, /pagination\.bulkActions/u, 'the page row\'s actions in the bar\'s shape (confirm false, danger by the one rule)');
  assert.match(actions, /status: isDestructiveAction\(item\) \? "danger" : "", confirm: false/u);
  assert.match(actions, /icon: own\.get\(String\(item\.id\)\)\.icon/u);
});

test('the set\'s layouts that draw the bar fetch it, lazily', () => {
  for (const folder of ['view', 'view-table', 'view-board', 'view-cards', 'view-calendar']) {
    assert.match(read(`src/smart/${folder}/rule.js`), /\{ name: 'cl-bulk-actions', lazy: true \}/u, folder);
    const manifest = JSON.parse(read(`src/smart/${folder}/smart.manifest.json`));
    assert.ok(manifest.composition.uses.includes('smart.bulk-actions'), `${folder} uses smart.bulk-actions`);
  }
  // The passport is not in the overlay: SET_ROOT is the package (scripts/test.mjs).
  if (!process.env.SET_ROOT) return;
  const passport = JSON.parse(readFileSync(resolve(process.env.SET_ROOT, 'set.json'), 'utf8'));
  for (const component of passport.components.filter(({folder}) => ['view', 'view-table', 'view-board', 'view-cards', 'view-calendar'].includes(folder))) {
    assert.ok(component.requires.includes('cl-bulk-actions'), component.element);
  }
});

test('the docs say how row selection works', () => {
  const docs = read('src/smart/view/docs.md');
  assert.match(docs, /## Выбор строк и полоса действий \(с версии 1\.29\.0\)/u);
  for (const word of ['bulk.apply_selected', 'bulk.apply_under_filter', 'Повторить для 2', 'sf-view-answer']) assert.ok(docs.includes(word), word);
  const component = JSON.parse(read('src/smart/view/component.json'));
  assert.match(component['x-decisions']['row-selection-bar'], /sf-bulk-actions-action \{id, scope\}/u);
});
