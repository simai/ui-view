import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {URL} from 'node:url';

// sf-view 1.13.0 (owner decision C97 (5)) and sf-view-table 1.21.0 (C158 (5)).
// The browser measurements are in the evidence probe (footer row at 1440 and
// 390, light and dark, three loads; the head menu driven by the keyboard and
// the pointer); these keep the shape of the source.
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const json = async (path) => JSON.parse(await read(path));

test('sf-view: the footer is its own row, the page row in the field appearance (C97 (5))', async () => {
  const source = await read('src/smart/view/index.js');
  // One shadow part holds the view's start (slot footer) and the page row.
  assert.match(source, /<div part="footer"><slot name="footer"><\/slot><slot name="pagination"><\/slot><\/div>/);
  // The default page row is light DOM since view round 1 (D4): an element in
  // the shadow root is out of the page's sheets, so the view writes it beside
  // the author's elements and takes it away when the author slots their own.
  assert.match(source, /\["pagination", "sf-pagination", \{appearance: "field", top: "false", bottom: "false"\}\]/);
  // The row is as tall as the ladder says: the control of the step, the
  // --sf-space-1 padding above and below it and the line under it.
  assert.match(source, /min-block-size: calc\(2 \* var\(--sf-space-1\) \+ var\(--sf-view--footer-control-height\) \+ var\(--sf-px\)\);/);
  // The page row the view makes, and one a page gave without an appearance,
  // draw the navigation only: the compatible footer retires on 2027-01-01.
  assert.match(source, /pagination\.setAttribute\("appearance", "field"\);\n\s*pagination\.setAttribute\("top", "false"\);/);
  const appearance = source.slice(source.indexOf('    _paginationAppearance('), source.indexOf('    get footerStart() {'));
  assert.match(appearance, /if \(!pagination\?\.setAttribute \|\| pagination\.hasAttribute\?\.\("appearance"\)\) return;/);
  assert.match(appearance, /pagination\.setAttribute\("appearance", "field"\);/);
  // The range, the offer to count and the quiet page-size button with its menu.
  const start = source.slice(source.indexOf('    get footerStart() {'), source.indexOf('    // The page row\'s attributes are its state'));
  assert.match(start, /<span class="sf-view-footer-range" role="status">/);
  assert.match(start, /<sf-button class="sf-view-footer-size" appearance="ghost" scheme="on-surface" icon-end="arrow_drop_down" aria-haspopup="menu">/);
  const menu = source.slice(source.indexOf('    _pageSizeMenu() {'), source.indexOf('    _togglePageSizeMenu('));
  assert.match(menu, /document\.createElement\("sf-menu-context"\);\n\s*menu\.className = "sf-view-footer-size-menu";\n\s*menu\.setAttribute\("popup", ""\);/);
  // Kept by reference: a Smart button moves its host's data-* onto its <button>.
  assert.match(start, /this\._footerParts = parts;/);
  // The words are the page row's (one language file for the row).
  const draw = source.slice(source.indexOf('    _drawFooter() {'), source.indexOf('    _pageSizeMenu() {'));
  assert.match(draw, /pagination\.rangeText/);
  assert.match(draw, /pagination\.sfWord\?\.\("page-size-text", \{vars: \{size: pageSize\}\}\)/);
  // A size chosen reads the list from its first page and is kept.
  const size = source.slice(source.indexOf('    _setPageSize(value) {'), source.indexOf('    // A view placed with no table'));
  assert.match(size, /this\._keepPreference\(\{pageSize: size\}\);\n\s*return this\.changeQuery\(\{per_page: size, page: 1\}, "page-size-change"\);/);
  // The first paint draws the same row.
  assert.match(source, /<div class="sf-data-view-skeleton-footer" data-size="\$\{this\.size\}">/);
  assert.doesNotMatch(source, /sf-pagination--footer/);
});

test('sf-view: the menu and the wait it draws are its relations', async () => {
  const component = await json('src/smart/view/component.json');
  const names = component.relations.map((relation) => relation.name);
  for (const name of ['cl-pagination', 'cl-menu-context', 'cl-spinner']) assert.ok(names.includes(name), name);
  const [major, minor] = component.version.split('.').map(Number);
  assert.ok(major === 1 && minor >= 13, component.version);
});

test('sf-view-table: Enter on a head opens the column menu, its width entries «Изменить ширину · По содержимому · По умолчанию» last (C158 (5), C296)', async () => {
  const source = await read('src/smart/view-table/index.js');
  const keys = source.slice(source.indexOf('    handleHeadKeydown(event, table) {'), source.indexOf('    focusHeadStop(stop) {'));
  // On the edge, Enter and Escape go back to the head (the Framework leaves them to the table).
  assert.match(keys, /if \(event\.key !== "Enter" && event\.key !== "Escape"\) return;/);
  // On a head: Enter, the menu key and Shift+F10 open the width menu.
  assert.match(keys, /event\.key === "Enter" \|\| event\.key === "ContextMenu" \|\| \(event\.shiftKey && event\.key === "F10"\)/);
  // C296: the column menu is sort, pin, hide and «Все колонки», then the width entries (columnMenuEntries).
  const menu = source.slice(source.indexOf('    columnMenuEntries(column, cell) {'), source.indexOf('    columnMenu() {'));
  for (const id of ['sort-asc', 'sort-desc', 'pin', 'hide', 'all']) assert.match(menu, new RegExp(`id: "${id}"`), id);
  assert.match(menu, /\{id: "resize", text: this\.text\("columnWidthChangeText"\)\},\n\s*\{id: "fit", text: this\.text\("columnWidthFitText"\)\},\n\s*\{id: "default", text: this\.text\("columnWidthDefaultText"\)\},/);
  // The head's keys run before the grid's, so Enter on a sort button opens the menu.
  assert.match(source, /this\.bindHeadMenu\(table, signal\);\n\s*table\.addEventListener\("keydown", \(event\) => this\.handleGridKeydown\(event, table\), \{signal\}\);/);
  // The width is still the Framework's gesture; a double click on the edge
  // forgets the width, as before (remark of 2026-10-14); «По содержимому» fits.
  assert.match(source, /reset: \(\) => \{\n\s*clear\(\);\n\s*this\.resetColumnWidth\(key\);/);
  assert.match(source, /text: \(share\) => this\.text\('columnWidthValue'\)\.replace\('\{n\}', String\(share\)\),/);
  // A head with an edge and nothing to press is a stop of its own.
  assert.match(source, /return cell\.querySelector\("\.sf-table-sort-button"\) \?\? cell;/);
});

test('sf-view-table: the head menu speaks the language files, ru and en', async () => {
  const keys = ['column-menu-label', 'column-resize-label', 'column-width-change-text', 'column-width-default-text', 'column-width-fit-text', 'column-width-value'];
  const ru = (await json('src/smart/view-table/lang/ru.json')).runtime;
  const en = (await json('src/smart/view-table/lang/en.json')).runtime;
  for (const key of keys) {
    assert.equal(typeof ru[key], 'string', `ru ${key}`);
    assert.equal(typeof en[key], 'string', `en ${key}`);
  }
  assert.equal(ru['column-width-change-text'], 'Изменить ширину');
  assert.equal(ru['column-width-fit-text'], 'По содержимому');
  assert.equal(ru['column-width-default-text'], 'По умолчанию');
  const template = await read('src/smart/view-table/js/templates/default.js');
  assert.doesNotMatch(template, /aria-label="Изменить ширину столбца:/);
  assert.match(template, /aria-label="\$\{context\.component\.text\('columnResizeLabel'\)\}: \$\{column\.label \|\| column\.key\}"/);
});
