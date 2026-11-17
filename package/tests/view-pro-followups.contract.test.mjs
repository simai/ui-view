import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {URL} from 'node:url';

// The view set's part of the SIMAI Pro products batch (2026-11-17): the items
// the ui-pro helper left to ui-view. A count is a badge (C140 (3); AC-3,
// TG-5), filter chips stand 4 apart under their current names (C105 H5;
// TG-6, TG-16), the move window's footer follows C159 (4) and C144, the table
// search is named with its glass at the start (C123, C153 (6); TI-10) and a
// row has one menu (C164 (2); CM-8). The browser checks are in the evidence
// probe; these keep the shape of the source.
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('sf-view-properties: the not-placed count is a grey tonal badge, not a tag in surface', async () => {
  const template = await read('src/smart/view-properties/js/templates/default.js');
  const bin = template.slice(template.indexOf('function renderUnplaced(context) {'));
  assert.match(bin, /\? html`<sf-badge\n\s*size="1\/3"\n\s*text=\$\{String\(fields\.length\)\}\n\s*><\/sf-badge>`/);
  assert.doesNotMatch(template, /appearance="surface"/);
  assert.doesNotMatch(template, /<sf-tag/);
});

test('sf-view-table: filter chips are 4 apart, kind default, active, and listen to sf-tag-close', async () => {
  const template = await read('src/smart/view-table/js/templates/default.js');
  assert.equal((template.match(/class="sf-table-chips flex items-cross-center gap-1\/4/g) || []).length, 2);
  assert.equal((template.match(/<sf-tag\s+kind="default"/g) || []).length, 2);
  assert.equal((template.match(/@sf-tag-close=/g) || []).length, 2);
  assert.match(template, /\?active=\$\{hasFilteredValues\}/);
  // The former names (TG-16): type, root-class="active" and the dated event close.
  assert.doesNotMatch(template, /<sf-tag[^>]*\stype=/);
  assert.doesNotMatch(template, /root-class="active"|root-class="\$\{hasFilteredValues/);
  assert.doesNotMatch(template, /@close=/);
});

test('sf-view-table: the search fields carry their glass at the start, a name and the field\'s own clear', async () => {
  const template = await read('src/smart/view-table/js/templates/default.js');
  const fields = template.match(/<sf-input[\s\S]*?name="sf_table_search"[\s\S]*?<\/sf-input>/g) || [];
  assert.equal(fields.length, 2);
  for (const field of fields) {
    assert.match(field, /input-type="search"/);
    assert.match(field, /icon-start="search"/);
    assert.match(field, /\n\s*clearable\n/);
    assert.match(field, /aria-label=\$\{context\.searchPlaceholder\}/);
    assert.doesNotMatch(field, /hint-icon|slot="right"/);
  }
});

test('sf-view-table: a row has one menu; a group and a host row-settings action open it (CM-8)', async () => {
  const source = await read('src/smart/view-table/index.js');
  assert.doesNotMatch(source, /renderRowSettingsContextMenu/);
  assert.match(source, /props\["@click"\] = \(event\) => this\.openRowMenu\(event, row, \{group: \{\.\.\.action, members\}\}\);/);
  assert.match(source, /if \(menu === "row-settings" && !hasClickHandler\) \{\n[^\n]*\n\s*props\["@click"\] = \(event\) => this\.openRowMenu\(event, row\);/);
  const open = source.slice(source.indexOf('    openContextMenu(event, opts = {}) {'), source.indexOf('        const target =', source.indexOf('    openContextMenu(event, opts = {}) {')));
  assert.match(open, /opts\.menu === "row-settings" \|\| \(!opts\.menu && opts\.type === "left"\)/);
  assert.match(open, /return this\.openRowMenu\(event, opts\.row \?\? \{\}/);
});

test('sf-view: the move and confirm window puts the main action first, a quiet Отмена last, 8 apart', async () => {
  const source = await read('src/smart/view/index.js');
  const dialog = source.slice(source.indexOf('    async _dialog({'), source.indexOf('    _renderTreeRows() {'));
  assert.match(dialog, /footer\.className = "sf-data-view-dialog-actions flex items-cross-center gap-1\/3 flex-wrap";/);
  assert.match(dialog, /footer\.append\(confirm, cancel\);/);
  assert.match(dialog, /cancel\.setAttribute\("appearance", "ghost"\);\n\s*cancel\.setAttribute\("scheme", "on-surface"\);/);
  const footer = dialog.slice(dialog.indexOf('const footer'), dialog.indexOf('modal.append('));
  assert.doesNotMatch(footer, /justify-end|gap-2|"outline"/);
});
