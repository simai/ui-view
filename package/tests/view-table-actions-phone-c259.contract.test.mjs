import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {URL} from 'node:url';

// Owner decision C259 (2026-11-16, the table with actions on a phone): below
// 44rem a table with row actions keeps the select box, the row menu and its
// key columns (columns[].key_cell) alone, without sideways scroll; the key
// cell may carry a second line (columns[].key_line); every action of a row
// is in one row menu, sf-menu-context bound with `for` to the table's and the
// list's rows. SIMAI Framework utility.table 1.7.0 carries the same rule for
// the plain table since pair ui-24d64b7f6eb7 (ui-source's own
// tests/table-actions-phone-c259.contract.test.mjs, hence this file's view-
// prefix); the set's drawing stays until the framework-first record decides
// it (draft set standard §7.1-7.4). The browser measures are in the evidence
// probe.
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const between = (source, from, to) => {
  const start = source.indexOf(from);
  assert.ok(start >= 0, from);
  const end = source.indexOf(to, start + from.length);
  assert.ok(end > start, to);
  return source.slice(start, end);
};

test('sf-view-table: the narrow threshold is 44rem of the root font, not pixels', async () => {
  const source = await read('src/smart/view-table/index.js');
  assert.match(source, /const KEYED_NARROW_REM = 44;/);
  const narrow = between(source, '    get isKeyedNarrow() {', '\n    }\n');
  assert.match(narrow, /KEYED_NARROW_REM/);
  assert.match(narrow, /getComputedStyle\(document\.documentElement\)\.fontSize/);
  assert.doesNotMatch(narrow, /\b600\b/);
});

test('sf-view-table: key cells and the key line are read from the column, snake_case first', async () => {
  const source = await read('src/smart/view-table/index.js');
  assert.match(source, /const isKeyCell = \(column\) => column\?\.key_cell === true \|\| column\?\.keyCell === true;/);
  assert.match(source, /column\?\.key_line \?\? column\?\.keyLine/);
});

test('sf-view-table: a keyed table with row menus stays a table on a phone, with its key columns alone', async () => {
  const source = await read('src/smart/view-table/index.js');
  const keyed = between(source, '    get keyedActions() {', '\n    }\n');
  assert.match(keyed, /this\.hasRowMenus && \(this\.getTableData\(\)\.columns \|\| \[\]\)\.some\(isKeyCell\)/);
  // The list it would fold into is skipped while the table is keyed.
  assert.match(between(source, '    get isList() {', '\n    }\n'), /keyedActions/);
  // Row menus follow the host's row actions; row-actions="false" (no actions
  // column, every action in the menu) keeps them.
  const menus = between(source, '    get hasRowMenus() {', '\n    }\n');
  assert.match(menus, /\(this\.ACTIONS_SETTINGS_ROW \?\? \[\]\)\.length > 0/);
  assert.doesNotMatch(menus, /rowActions/);
});

test('sf-view-table template: the narrow keyed table fits its width and draws the second line', async () => {
  const template = await read('src/smart/view-table/js/templates/default.js');
  assert.match(template, /context\.keyedNarrow \? 'sf-table-keyed'/);
  assert.match(template, /class="sf-table-key-name"/);
  assert.match(template, /class="sf-table-key-line"/);
  const css = await read('src/smart/view-table/js/templates/default.css');
  const sheet = between(css, 'table.sf-table-keyed', '.sf-table-key-line');
  assert.match(sheet, /inline-size: 100%|width: 100%/);
  assert.match(sheet, /table-layout: auto/);
  // The box and menu columns take their content's width: no fixed pixels.
  assert.doesNotMatch(sheet, /\d+px/);
  const at = css.lastIndexOf(') .sf-table-key-line {');
  const line = css.slice(at, css.indexOf('}', at));
  assert.match(line, /var\(--sf-on-surface-variant\)/);
  assert.match(line, /var\(--sf-text-size-1\\\/2\)/);
});

test('sf-view-table: one row menu on sf-menu-context for= over the table and the list rows', async () => {
  const source = await read('src/smart/view-table/index.js');
  const menu = between(source, '    rowMenu() {', '\n    }\n');
  assert.match(menu, /setAttribute\("for", `\$\{this\.rowAreaId\} \$\{this\.rowAreaId\}-list`\)/);
  assert.match(menu, /addEventListener\("sf-menu-context-open"/);
  // The ≡ and the list ⋯ open it on the row, so a table in a shadow root
  // (not found by `for`) still gets its row.
  const open = between(source, '    async openRowMenu(event, row = {}, {group = null, items = null} = {}) {', '\n    }\n');
  assert.match(open, /menu\.toggleFor\(anchor, target \? \{target\} : \{\}\)/);
  // The table's own right-click and menu-key paths are gone but in a shadow root.
  assert.doesNotMatch(source, /openRowContextMenu\(|openListRowMenu\(|menuPointAt\(/);
  assert.match(source, /    bindShadowRowMenu\(\) \{/);
  const template = await read('src/smart/view-table/js/templates/default.js');
  assert.match(template, /id=\$\{context\.rowAreaId\}/);
  assert.match(template, /id=\$\{`\$\{context\.rowAreaId\}-list`\}/);
});
