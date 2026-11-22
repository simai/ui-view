import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {URL} from 'node:url';

// The table's menus are on the table's step (owner remark 2026-11-15). The
// sizes are measured in a browser by tests/browser/table-menu-size.browser.mjs;
// these keep the shape of the source.
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('sf-view-table: the row menu takes the resolved size and the density on every opening', async () => {
  const source = await read('src/smart/view-table/index.js');
  // The Framework's density, through the package core (view modular step 1).
  assert.match(source, /import \{followDensity\} from "\.\.\/view-common\/density\.js";/);
  assert.match(source, /get menuSize\(\) \{\n\s*return this\.size === "1\/2" \? "1\/2" : "1";\n\s*\}/);
  // Every opening asks `open`, and fillRowMenu answers it (C164, #168).
  const fill = source.slice(source.indexOf('    fillRowMenu(menu, row, ids, anchor) {'), source.indexOf('    rowMenu() {'));
  assert.match(fill, /menu\.setAttribute\("size", this\.menuSize\);\n\s*followDensity\(menu, this\);/);
  const open = source.slice(source.indexOf('    async openRowMenu('), source.indexOf('    get hasRowMenus() {'));
  assert.match(open, /const menu = this\.rowMenu\(\);[\s\S]*return menu\.toggleFor\(anchor, target \? \{target\} : \{\}\);/);
  // Not at creation alone: rowMenu() writes neither.
  const create = source.slice(source.indexOf('    rowMenu() {'), source.indexOf('    rowMenu() {') + 1500);
  assert.doesNotMatch(create, /setAttribute\("size"/);
  // The menus the table draws take the resolved size, not the written attribute alone.
  // Eight since CM-8: the hand-drawn second row menu is gone. Seven since
  // C106: the gear's window is sf-settings, which takes the host's own size
  // only (controlSize) and the density of the gear.
  // Three since view round 1 (D5): four menus open the Framework's shared
  // menu, which is given the same size (menuOpen size: this.menuSize).
  assert.equal((source.match(/size=\$\{this\.menuSize\}/g) ?? []).length, 3);
  assert.equal((source.match(/await menuOpen\(\{[\s\S]{0,200}?size: this\.menuSize,/gu) ?? []).length, 2);
  assert.match(source, /<sf-settings\s+look="panel"[\s\S]*?size=\$\{this\.controlSize \?\? nothing\}/u);
  assert.doesNotMatch(source, /<sf-menu-context\s+size=\$\{this\.controlSize/);
});

test('sf-view-properties: its standard menu takes the panel size and density on every opening', async () => {
  const source = await read('src/smart/view-properties/index.js');
  assert.match(source, /import \{followDensity\} from "\.\.\/view-common\/density\.js";/);
  const open = source.slice(source.indexOf('    async openStandardMenu('), source.indexOf('    openPanelMenu(anchor) {'));
  assert.match(open, /menu\.setAttribute\("size", this\.size\);\n\s*followDensity\(menu, this\);[\s\S]*return menu\.openFor\(anchor, \{align\}\);/);
});
