import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// View round 18 (sf-view 1.39.0, sf-view-table 1.38.0, sf-view-board 1.4.0,
// sf-view-cards 1.5.2, sf-view-properties 1.31.2, package 1.18.0): DEV's
// returns on View 1.17.0 -- VL-71, VL-74, VL-75, VO-2 and the view site guide's
// V1-V5. Measurements in ui-control control/evidence/2026-11-24-view-r18/README.md.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const view = read('src/smart/view/index.js');
const head = read('src/smart/view/js/head.js');
const board = read('src/smart/view-board/index.js');
const tableJs = read('src/smart/view-table/js/templates/default.js');
const tableCss = read('src/smart/view-table/js/templates/default.css');
const propsCss = read('src/smart/view-properties/js/templates/default.css');
const json = (path) => JSON.parse(read(path));

test('VL-71: the chrome taking the boxes away hides the marks and the bar, and brings them back', () => {
  assert.match(view, /if \(name === "chrome"\) this\._syncSelectMarks\(\);/u);
  assert.match(view, /_syncSelectMarks\(\) \{\n\s*const on = this\.renders\("select"\);/u);
  assert.match(view, /_bulkIds\(\) \{\n[^\n]*\n\s*if \(!this\.renders\("select"\)\) return \[\];/u);
});

test('VL-74: the saved filter marks stand on the UI ladder of their row, as the «⋯» beside them', () => {
  assert.equal((head.match(/<sf-icon icon="(?:push_pin|group)" size="\$\{size\}" data-sf-icon-scale="ladder"/gu) ?? []).length, 2);
});

test('VL-75: a list row\'s figures take the row\'s second line, the row text on a phone', () => {
  assert.match(tableJs, /renderFactBadge\(fact, 'text'\)/u);
  assert.match(tableJs, /<sf-badge size=\$\{size\} line=\$\{line \|\| nothing\}/u);
  assert.match(tableCss, /:is\(sf-view-table, sf-table\) :is\(\.sf-table-resource-supporting, \.sf-table-list-end, \.sf-table-resource-facts\) \{\n\s*font-size: var\(--sf-text-size-1\);\n\s*line-height: var\(--sf-text-height-1\);/u);
});

test('VO-2: stacked arranging keeps a step above «Вкладки» and the hint on its inset', () => {
  assert.equal((propsCss.match(/\.sf-property-view-configure-top \{\n\s*margin-block-end: var\(--sf-space-3\);/gu) ?? []).length, 2);
  assert.equal((propsCss.match(/\.sf-property-view-configure-hint \{\n\s*flex: 1 1 100%;\n\s*padding-inline-start: calc\(var\(--sf-space-1\\\/4\) \* 2\);/gu) ?? []).length, 2);
});

test('V1: the personal column save runs only when the host offers it', () => {
  assert.match(view, /if \(!shared && !this\.hostOffers\("personal-column-settings"\)\) \{\n\s*return Promise\.resolve\(\{answer: "unavailable", reason: "capability-not-provided", session: true\}\);/u);
});

test('V2: «Вид» lists the board lanes and the board names «Вид» as the way back', () => {
  assert.match(head, /add\("lanes", \{type: "group", text: this\.text\("headLanes"\)/u);
  assert.match(head, /if \(value === true\) board\?\.showLane\?\.\(entry\);/u);
  assert.match(board, /get laneChoices\(\) \{/u);
  assert.match(board, /showLane\(value\) \{/u);
  assert.match(view, /"sf-view-board-save",/u);
  for (const lang of ['ru', 'en']) {
    const words = json(`src/smart/view-board/lang/${lang}.json`).runtime;
    assert.doesNotMatch(words['hidden-text'] + words['hide-hint'], /Настроить вид|Customize view/u, lang);
    assert.ok(words['shown-text'], lang);
    assert.ok(json(`src/smart/view/lang/${lang}.json`).runtime['head-lanes'], lang);
  }
});

test('V3: the descriptions speak of 1.17.0: «Вид», each kind its own marks (C413)', () => {
  const viewC = json('src/smart/view/component.json');
  const viewM = json('src/smart/view/smart.manifest.json');
  for (const key of ['chrome', 'head']) {
    assert.doesNotMatch(viewC.settings[key].summary, /Настроить вид/u, key);
    assert.doesNotMatch(viewM.inputs.properties[key].description, /Настроить вид/u, key);
  }
  const cardsC = json('src/smart/view-cards/component.json');
  const cardsM = json('src/smart/view-cards/smart.manifest.json');
  for (const key of ['keep-selection', 'all-selected']) {
    for (const text of [cardsC.settings[key].summary, cardsM.inputs.properties[key].description]) {
      assert.doesNotMatch(text, /across pages and display kinds|carried from the table/u, key);
    }
  }
});

test('V4: the conditions are not the view\'s (C414): no filter comparison in viewChanged', () => {
  const body = head.slice(head.indexOf('get viewChanged()'), head.indexOf('viewKind(view) {'));
  assert.doesNotMatch(body, /view\.query\?\.filters/u);
});

test('V5: the head\'s kind is the kind drawn; switchLayout names it in the query', () => {
  const body = head.slice(head.indexOf('    get kind() {'), head.indexOf('    drawable(kind) {'));
  assert.ok(body.indexOf('this.view.layoutKind') > -1 && body.indexOf('this.view.layoutKind') < body.indexOf('this.query.view?.type'), 'layoutKind is read first');
  const sw = view.slice(view.indexOf('    switchLayout(kind, {refresh = true} = {}) {'), view.indexOf('    switchLayout(kind, {refresh = true} = {}) {') + 6000);
  assert.match(sw, /const drawnKind = this\.layoutKind;/u);
  assert.match(sw, /view: \{\.\.\.this\.query\.view, type: drawnKind\}/u);
});

test('V5 note: a phone-line crossing rebuilds the head in the next frame, not inside its observer', () => {
  const body = head.slice(head.indexOf('this._onResize = () => {'), head.indexOf('this._onPartsResize'));
  assert.match(body, /if \(this\._modeOf\(\) === this\.mode\) return this\._layRow\(\);/u);
  assert.match(body, /requestAnimationFrame/u);
  assert.doesNotMatch(body, /=> this\._measure\(\);\n/u);
});
