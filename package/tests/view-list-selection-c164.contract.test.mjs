import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {URL} from 'node:url';

// One context-menu rule for the table and the list (C164 (3)): a right click,
// the context-menu key, Shift+F10 or a long press on a selected row acts on
// the whole selection («Выбрано N»); on a row outside it, that row becomes
// the selection first. Since 1.20.0 every way in is sf-menu-context's own
// (`for`, #168), and its `open` question asks rowMenuTargets once; the
// browser checks are in the evidence probe.
const root = new URL('../', import.meta.url);
const source = await readFile(new URL('src/smart/view-table/index.js', root), 'utf8');
const between = (from, to) => source.slice(source.indexOf(from), source.indexOf(to));

test('sf-view-table: table and list rows share one context-menu path with the selection rule', () => {
  const menu = between('    rowMenu() {', "    // Which of the table's actions this row offers");
  assert.equal((source.match(/this\.rowMenuTargets\(/g) ?? []).length, 1);
  assert.match(menu, /const \{ids\} = this\.rowMenuTargets\(row\);/);
  assert.match(menu, /const element = target instanceof Element \? target\.closest\("\[data-row-id\]"\) : null;/);
  assert.match(menu, /if \(!this\.fillRowMenu\(menu, row, ids, anchor\)\) event\.preventDefault\(\);/);
});

test('sf-view-table: over several selected rows the menu holds every common action', () => {
  const fill = between('    fillRowMenu(menu, row, ids, anchor) {', '    rowMenu() {');
  assert.match(fill, /items = items\.filter\(\(action\) => rows\.every/);
  assert.match(fill, /if \(many\) entries\.unshift\(\{type: "heading", text: `\$\{this\.text\("selectedRowsHeading"\)\} \$\{ids\.length\}`\}\);/);
});
