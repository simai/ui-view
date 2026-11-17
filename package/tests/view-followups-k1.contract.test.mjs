import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {URL} from 'node:url';

// The view set's follow-ups of the ui-pro admin set K-1 (2026-11-15): the
// bulk band's Apply speaks danger (C116 (4), C13), the view's menus draw ⋯
// (C155 (2), TL-1), a right click opens a row's menu at the pointer and a
// list row has the same menu gestures as a table row (C164 (1)(2)). The
// browser checks are in the evidence probe; these keep the shape of the source.
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('sf-view: Apply over a deleting action is status danger, never the former error', async () => {
  const source = await read('src/smart/view/index.js');
  const band = source.slice(source.indexOf('    _renderBulkBand() {'), source.indexOf('    applyBulkAction() {'));
  assert.match(band, /if \(danger\) apply\.setAttribute\("status", "danger"\);/);
  assert.doesNotMatch(band, /setAttribute\("status", "error"\)/);
  // The rule is SIMAI Framework sf-pagination's own (isDestructiveAction and
  // orderActions, smart/pagination/js/actions.js, in the pair since
  // ui-078a4b4c6f6e): no copy of it is left in the set (draft set standard
  // §7.4, view round 1 A3).
  assert.match(source, /import \{isDestructiveAction, orderActions\} from "\.\.\/pagination\/js\/actions\.js";/);
  assert.match(band, /\.\.\.orderActions\(actions\)\.map\(/);
  assert.match(band, /const danger = isDestructiveAction\(actions\.find\(/);
  assert.doesNotMatch(source, /_bulkDestructive/);
});

test('sf-view-table: no ⋮ (more_vert) is left; the view and template actions draw more_horiz', async () => {
  for (const path of ['src/smart/view-table/index.js', 'src/smart/view-table/js/templates/default.js']) {
    assert.doesNotMatch(await read(path), /more_vert/u, path);
  }
  const template = await read('src/smart/view-table/js/templates/default.js');
  assert.match(template, /icon="more_horiz"\n\s*aria-label=\$\{context\.component\.text\('contextViewActionsLabel'\)\}/);
});

test('sf-view-table: the right button, the keys and a long press open the row menu through sf-menu-context for= (C164, #168)', async () => {
  const source = await read('src/smart/view-table/index.js');
  // The table's own point anchor, contextmenu listeners and menu-key branches
  // are gone: the engine of the pair (sf-menu-context 1.21.0, `for`) hears
  // them on the rows of the table and the list, and asks `open`.
  // A table inside a shadow root (sf-view's own) is out of `for`'s reach and
  // answers the right button and the keys itself (bindShadowRowMenu) alone.
  const shadow = source.slice(source.indexOf('    bindShadowRowMenu() {'), source.indexOf('    // The entries of the row the menu opens for'));
  assert.match(shadow, /if \(!inShadow\(\) \|\| event\.defaultPrevented\) return;/);
  // The column menu (C158 (5), C296) answers the right button on any head of
  // a data column, a menu of its own and no row's.
  const head = source.slice(source.indexOf('    bindHeadMenu(table, signal) {'), source.indexOf('    handleHeadKeydown(event, table) {'));
  assert.match(head, /if \(!column \|\| column\.system\) return;/);
  const outside = source.replace(shadow, '').replace(head, '');
  for (const gone of [/function menuPointAt\(/, /openRowMenuOf\(/, /openListRowMenu\(/, /openRowContextMenu\(/, /_listContextMenu/, /isMenuKey/, /keepsBrowserMenu/, /addEventListener\("contextmenu"/]) {
    assert.doesNotMatch(outside, gone, String(gone));
  }
  const menu = source.slice(source.indexOf('    rowMenu() {'), source.indexOf('    // Which of the table\'s actions this row offers'));
  assert.match(menu, /menu\.setAttribute\("for", `\$\{this\.rowAreaId\} \$\{this\.rowAreaId\}-list`\);/);
  assert.match(menu, /menu\.addEventListener\("sf-menu-context-open", \(event\) => \{/);
  assert.match(menu, /if \(!row \|\| !this\.getActionRowItems\(row\)\.length\) \{\n\s*event\.preventDefault\(\);/);
  assert.match(menu, /const \{ids\} = this\.rowMenuTargets\(row\);/);
  // A host's own handler still gets the row's button as its anchor.
  assert.match(source, /this\._rowMenuContext = \{row, items, anchor, ids:/);
  // The «≡» and the list's «⋯» open the same menu at the button.
  const open = source.slice(source.indexOf('    async openRowMenu('), source.indexOf('    get hasRowMenus() {'));
  assert.match(open, /return menu\.toggleFor\(anchor, target \? \{target\} : \{\}\);/);
  // The menu is in the page once the rows have one (afterDraw).
  assert.match(source, /this\.syncGrid\(\);\n\s*this\.bindRowMenu\(\);/);
  const template = await read('src/smart/view-table/js/templates/default.js');
  assert.match(template, /<table\n\s*\$\{ref\(context\.component\.refs\.table\)\}\n\s*id=\$\{context\.rowAreaId\}/);
  assert.equal((template.match(/role="list" id=\$\{`\$\{context\.rowAreaId\}-list`\}/g) ?? []).length, 2);
});

test('sf-view-table: a list row\'s «⋯» holds every action of the row, the quick ones too (C259 (3))', async () => {
  const template = await read('src/smart/view-table/js/templates/default.js');
  assert.match(template, /component\.openRowMenu\(event, row\);\n\s*\}\}><i class="sf-icon" aria-hidden="true">more_horiz<\/i><\/button>/);
  assert.doesNotMatch(template, /folded \? \[\.\.\.quick, \.\.\.rest\] : rest/);
  const source = await read('src/smart/view-table/index.js');
  assert.match(source, /const LIST_ROW_MENU_BUTTON = "\[data-sf-row-menu\], \.sf-table-list-menu button";/);
});
