import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

// row-actions hides the row action column alone; actions still owns the create button.
const source = fs.readFileSync(new URL('../src/smart/view-table/index.js', import.meta.url), 'utf8');
const template = fs.readFileSync(new URL('../src/smart/view-table/js/templates/default.js', import.meta.url), 'utf8');
const manifest = JSON.parse(fs.readFileSync(new URL('../src/smart/view-table/smart.manifest.json', import.meta.url), 'utf8'));
const body = source.split('    getSystemColumns() {')[1].split('\n    setTemplates(')[0].trim().replace(/\}\s*$/, '');
const systemColumns = new Function(body);
const useBody = source.split('    settingsColumnHasUse(props = this.getPropsContext()) {')[1].split('\n    getSystemColumns() {')[0].trim().replace(/\}\s*$/, '');
const settingsColumnHasUse = new Function('props = this.getPropsContext()', useBody);

function table(props, actionActive = true, rowMenu = [{id: 'delete'}], quickCount = 2) {
    const widths = [];
    return {
        getPropsContext: () => ({selectable: false, settings: true, actions: true, rowActions: true, ...props}),
        settingsColumnHasUse,
        ACTIONS_SETTINGS_ROW: rowMenu,
        getSelectColumn: () => ({key: 'select'}),
        state: {actionActive},
        TABLE_SETTINGS_COLUMN: {key: 'settings'},
        TABLE_ACTIONS_COLUMN: {key: 'actions'},
        tableQuickActionCount: () => quickCount,
        rowEndWidth: (menu, quick) => { widths.push([menu, quick]); return 'w'; },
        widths,
        systemColumns,
    };
}
const keys = (owner) => owner.systemColumns().map((column) => column.key);

// One column at the row's end (owner decision C146 (5)): the gear in its head,
// up to two quick actions and the row's «more» in each row. The hover-only
// column «Действия» is gone.
test('the row end is one column, with the quick actions and «more» in it', () => {
    const owner = table({});
    assert.deepEqual(keys(owner), ['settings']);
    assert.deepEqual(owner.widths, [[true, true]], 'its width holds the menu and the quick actions');
    assert.ok(!/columns\.push\(this\.TABLE_ACTIONS_COLUMN\)/u.test(source), 'no separate action column');
});

test('row-actions false takes only the quick actions away', () => {
    const owner = table({rowActions: false});
    assert.deepEqual(keys(owner), ['settings']);
    assert.deepEqual(owner.widths, [[true, false]]);
    assert.match(source, /rowActions: \{attribute: "row-actions", type: Boolean, default: true\}/);
    // The create button stays behind actions, and behind creatable, which a
    // data view turns off for a host that does not announce create-record.
    assert.match(template, /\$\{context\.actions && context\.creatable\s*\?/, 'the create button follows actions');
    assert.ok(!template.includes('rowActions'), 'the create button does not follow row-actions');
});

test('actions false and a hidden action column in the table settings still take the quick actions away', () => {
    const off = table({actions: false});
    assert.deepEqual(keys(off), ['settings']);
    assert.deepEqual(off.widths, [[true, false]]);
    const hidden = table({}, false);
    assert.deepEqual(keys(hidden), ['settings']);
    assert.deepEqual(hidden.widths, [[true, false]]);
});

test('the manifest declares row-actions with its default', () => {
    assert.deepEqual(manifest.inputs.properties['row-actions'], {type: 'boolean', default: true});
    assert.ok(manifest.composition.declarative.props.includes('row-actions'));
    // row-actions arrived in 1.9.0; later patches keep it.
    const arrived = manifest.compatibility.migrations.find((migration) => migration.to === '1.9.0');
    assert.ok(arrived.changes.some((change) => change.includes('row-actions')));
});

// The row end is the gear in its head and the row's «more» and quick actions.
// A table with none of them -- no column settings, no row menu, no reordering,
// no quick actions -- draws no column of buttons that open nothing (Larena,
// the sites list, 2026-11-05).
test('the row end goes when it has nothing to open', () => {
    assert.deepEqual(keys(table({settingsMenu: false}, true, [], 0)), []);
    assert.deepEqual(keys(table({settingsMenu: false, actions: false}, true, [])), []);
    // Quick actions alone keep it.
    assert.deepEqual(keys(table({settingsMenu: false}, true, [])), ['settings']);
});

test('the row end stays for the gear, a row menu or reordering', () => {
    assert.deepEqual(keys(table({settingsMenu: true}, true, [], 0)), ['settings']);
    assert.deepEqual(keys(table({settingsMenu: false}, true, [{id: 'delete'}], 0)), ['settings']);
    assert.deepEqual(keys(table({settingsMenu: false, rowReorder: true}, true, [], 0)), ['settings']);
    // A host whose actions live in the row menu alone (row-actions="false") keeps «more».
    assert.deepEqual(keys(table({settingsMenu: false, rowActions: false})), ['settings']);
});

test('settings false is the word of the host for the menu, whatever the table could offer', () => {
    const owner = table({settings: false, settingsMenu: true, rowReorder: true});
    assert.deepEqual(keys(owner), ['settings'], 'the quick actions still stand at the row end');
    assert.deepEqual(owner.widths, [[false, true]]);
    assert.deepEqual(keys(table({settings: false, settingsMenu: true, rowReorder: true}, true, [{id: 'delete'}], 0)), []);
});
