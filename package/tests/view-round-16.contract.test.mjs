import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// View round 16 (sf-view 1.37.1): the returns of the round 15 acceptance
// VN-1 (the kinds' sf-segmented folding back and forth on the strip) and VN-2
// (the save-view note named filter values, C414). The browser measurements and
// the SIMAI Framework cause are in ui-control
// control/evidence/2026-11-23-view-r16/README.md.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const head = read('src/smart/view/js/head.js');
const headCss = read('src/smart/view/js/head.css');
const ru = JSON.parse(read('src/smart/view/lang/ru.json')).runtime;
const en = JSON.parse(read('src/smart/view/lang/en.json')).runtime;

test('VN-1: the strip keeps the kinds\' track unshrunk on a desktop head', () => {
  assert.match(headCss, /\.sf-view-head:not\(\[data-phone\]\) > \.sf-view-head-zone > \[data-kinds\] > :is\(\.sf-button-group, \.sf-button-group-narrow\) \{ flex-shrink: 0; \}/u);
  // the strip still folds the kinds into its own menu (VM-1)
  assert.match(head, /const fold = selfFolded \|\| \(folded \? open > room - 16 : open > room \+ 0\.5\);/u);
});

test('VN-2: «Сохранить представление» says the view is saved without conditions (C414)', () => {
  for (const words of [ru, en]) {
    assert.ok(words['head-save-view-note'], 'head-save-view-note');
    assert.ok(words['head-save-note'], 'the saved filter keeps its own note');
  }
  assert.equal(ru['head-save-view-note'], 'Сохранятся вид, колонки, сортировка и число строк на странице, без условий фильтра и поиска.');
  assert.doesNotMatch(ru['head-save-view-note'], /значени/u);
  assert.doesNotMatch(en['head-save-view-note'], /values/u);
  // the view's window reads the view note, the filter's window its own
  assert.match(head, /if \(kind === "view-new"\) \{\n[^]*?return this\._note\(this\.text\("headSaveViewNote"\)\)/u);
  assert.match(head, /if \(kind === "save"\) \{\n[^]*?return this\._note\(this\.text\("headSaveNote"\)\)/u);
});
