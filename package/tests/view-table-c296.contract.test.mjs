// Owner decision C296 (sf-view-table study, view round 2): the table draws
// columns and rows; the new contract and the dated former settings.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const source = read('src/smart/view-table/index.js');
const template = read('src/smart/view-table/js/templates/default.js');
const css = read('src/smart/view-table/js/templates/default.css');
const component = JSON.parse(read('src/smart/view-table/component.json'));

test('sort="key:dir" is the attribute\'s short form, a list of one', () => {
  const body = source.split('function parseSortText(text) {')[1].split('\n}\n')[0];
  const parse = new Function('text', body);
  assert.deepEqual(parse('amount:desc'), [{key: 'amount', direction: 'desc'}]);
  assert.deepEqual(parse(' title : asc '), [{key: 'title', direction: 'asc'}]);
  assert.equal(parse('[{"key":"amount","direction":"desc"}]'), null, 'JSON keeps its own path');
  assert.equal(parse('amount:up'), null);
});

test('the new contract is declared: total, totals, open, scroll-to-row, the empty and error slots', () => {
  assert.equal(component.settings.total.type, 'number');
  assert.ok(component.settings.totals, 'totals');
  assert.deepEqual(Object.keys(component.events.open.carries), ['id', 'newTab']);
  assert.ok(component.actions['scroll-to-row']);
  assert.deepEqual(Object.keys(component.slots), ['empty', 'error']);
  assert.equal(component.keyboard.row.F2, 'edit:cell');
});

test('eight public --sf-view-table-* variables, the --sf-table-* names kept until 2027-01-01', () => {
  const names = Object.keys(component['css-variables']);
  const own = names.filter((name) => name.startsWith('--sf-view-table-'));
  assert.equal(own.length, 8);
  for (const name of own) assert.match(css, new RegExp(name.replace(/[-/]/gu, '\\$&')), name);
  for (const name of names.filter((item) => item.startsWith('--sf-table-'))) {
    assert.match(component['css-variables'][name]['x-summary'], /2027-01-01/u, name);
  }
});

test('the grid says its count and its selection (VT-4)', () => {
  assert.match(source, /ariaRowCount\(\) \{[\s\S]{0,200}?String\(total \+ 1\)/u);
  assert.match(source, /setAttribute\("aria-multiselectable", "true"\)/u);
  assert.match(template, /' aria-selected=', ROW_HOLE/u);
});

test('a title without an address is a button, never href="#" (VT-9)', () => {
  assert.doesNotMatch(template, /href=\$\{[^}]*\|\|\s*['"]#['"]/u);
  assert.match(template, /<button type="button" class="sf-table-title-link"/u);
});

test('the container settings are dated former names, noted once on a table standing alone (VT-13)', () => {
  const rows = component.aliases.rows.filter((row) => row.section === 'C296, C295 (VT-13)');
  const names = rows.map((row) => row.from).sort();
  for (const name of ['toolbar', 'pagin', 'filter-templates', 'search-placeholder', 'creatable', 'layout-switch']) assert.ok(names.includes(name), name);
  for (const row of rows) assert.equal(row.remove_after, '2027-01-01');
  assert.match(source, /noteContainerSettings\(\) \{\s*if \(this\._containerNoted \|\| this\.closest\?\.\("sf-view"\)\) return;/u);
});

test('unreleased parts are reached behind a feature check, never imported', () => {
  assert.match(source, /customElements\.get\("sf-bulk-actions"\)/u);
  assert.match(source, /globalThis\.SF\?\.fieldRenderers\?\.dateFilter/u);
  assert.doesNotMatch(source, /from "[^"]*bulk-actions[^"]*"/u);
  assert.doesNotMatch(source, /from "[^"]*date-filter[^"]*"/u);
});

test('a short field edits at the cell through the Framework, a boolean keeps its checkbox', () => {
  assert.match(source, /const SHORT_EDIT_TYPES = new Set\(\["choice", "enum", "select", "user", "date", "datetime", "number", "integer", "money"\]\);/u);
  assert.match(source, /await menuOpen\(\{anchor: cell, entries/u);
  assert.match(source, /renderEditField\(field, value, host, \{size\}\)/u);
  assert.match(source, /positioning\(\)\.anchor\(cell, box,/u);
  assert.match(source, /openLayer\(box, \{kind: "surface"/u);
});
