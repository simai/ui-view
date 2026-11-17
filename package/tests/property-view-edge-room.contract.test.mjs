import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// C289 (2), (3), (6), sf-view-properties 1.17.0: the record panel is drawn at a
// step of sf-drawer's ladder and nothing of it stands outside the panel. The
// copy-link and open-full controls the drawer used to carry on its edge are
// rows of the head's «⋯» menu, beside «Удалить»; a former panel-width is
// mapped to the nearest step with a notice (alias until 2027-01-01).
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(root, 'src/smart/view-properties/index.js'), 'utf8');
const template = readFileSync(resolve(root, 'src/smart/view-properties/js/templates/default.js'), 'utf8');
const sheet = readFileSync(resolve(root, 'src/smart/view-properties/js/templates/default.css'), 'utf8');

const body = (text, start) => {
  const at = text.indexOf(start);
  assert.ok(at >= 0, `${start} is in the source`);
  return text.slice(at, text.indexOf('\n    }\n', at));
};

test('the panel never takes a width of its own: a step of the drawer ladder', () => {
  assert.match(body(source, '    get drawerWidth() {'), /return null;/u);
  assert.match(source, /const PANEL_STEPS = \[\["1\/2", 20\], \["1", 24\], \["2", 30\]\];/u);
  assert.match(body(source, '    get drawerStep() {'), /return width \? nearestPanelStep\(width\) : "1";/u);
  assert.doesNotMatch(template, /\swidth=\$\{/u, 'the drawer is never given a width');
});

test('a former panel-width says where it landed, once', () => {
  const note = body(source, '    _notePanelWidth() {');
  assert.match(note, /noteDeprecated\(/u);
  assert.match(note, /former name until \$\{PANEL_WIDTH_UNTIL\}/u);
});

test('nothing stands outside the panel: no edge strip, record actions in the menu', () => {
  assert.doesNotMatch(template, /slot="edge"/u);
  assert.doesNotMatch(source, /edgeControlWidth|edgeRoom|_edgeObserver/u);
  assert.doesNotMatch(sheet, /--sf-property-view--edge-room|panel--fills/u);
  const items = body(source, '    get recordMenuItems() {');
  assert.match(items, /id: "copy-link"/u);
  assert.match(items, /id: "open-full"/u);
  assert.match(source, /\{id: "delete", text: this\.deleteText, icon: "delete", danger: true\}/u);
});

test('a panel with no panel-label is headed by the record name, label or title (C289 (6))', () => {
  const name = body(source, '    _recordName(record) {');
  assert.match(name, /record\?\.label \|\| record\?\.title/u);
  assert.match(source, /recordLabel: this\._recordName\(this\.record\)/u);
  assert.match(template, /label=\$\{context\.panelLabel \|\| context\.recordLabel \|\| context\.recordId/u);
});
