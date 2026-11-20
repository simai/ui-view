// View site round 2 (round/view-r8): Larena's wishes L-1 and L-3 and DEV's
// return R8-3.
// - L-1: the settings column's name comes from the language files, never the
//   literal "settings";
// - L-3: a date or date and time column with variant "relative" shows the
//   distance from today in the page language, the full date in the title;
// - R8-3: over a pair without the toggle look the view toggle is a
//   disclosure button with the pressed look drawn by the head, so its glyph is
//   never asked in the filled form an icon subset may lack.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const table = read('src/smart/view-table/index.js');
const template = read('src/smart/view-table/js/templates/default.js');
const head = read('src/smart/view/js/head.js');
const headCss = read('src/smart/view/js/head.css');

test('L-1: the settings column is named from the language files', () => {
  const column = table.split('this.TABLE_SETTINGS_COLUMN = {')[1].split('};')[0];
  assert.match(column, /label: this\.text\("settingsColumnLabel"\)/u);
  assert.doesNotMatch(column, /label: "settings"/u);
  for (const lang of ['en', 'ru']) {
    const words = JSON.parse(read(`src/smart/view-table/lang/${lang}.json`));
    const flat = JSON.stringify(words);
    assert.match(flat, /"settings-column-label":"[^"]+"/u, `${lang} has settings-column-label`);
  }
});

// The method under test, lifted out of the class with its helper, so the
// words are checked as the browser says them.
const helper = table.split('\nfunction relativeDay(value) {')[1].split('\n}\n')[0];
const method = table.split('    relativeDate(column = {}, value) {')[1].split('\n    }\n')[0];
// eslint-disable-next-line no-new-func
const relativeDay = new Function('value', helper);
const relativeDate = (value, lang, now) => new Function('relativeDay', 'column', 'value', method)
  .call({now: () => now, closest: () => ({getAttribute: () => lang})}, relativeDay, {}, value);

test('L-3: relative words in the page language, days, weeks, months, years', () => {
  const now = new Date(2026, 10, 22, 15, 0).getTime();
  assert.equal(relativeDate('2026-11-22', 'ru', now), 'сегодня');
  assert.equal(relativeDate('2026-11-21', 'ru', now), 'вчера');
  assert.equal(relativeDate('2026-11-19', 'ru', now), '3 дня назад');
  assert.equal(relativeDate('2026-11-23', 'ru', now), 'завтра');
  assert.equal(relativeDate('2026-11-08', 'ru', now), '2 недели назад');
  assert.equal(relativeDate('2026-08-22', 'ru', now), '3 месяца назад');
  assert.equal(relativeDate('2024-11-01', 'ru', now), '2 года назад');
  assert.equal(relativeDate('2026-11-21', 'en', now), 'yesterday');
  assert.equal(relativeDate('2026-11-19', 'en', now), '3 days ago');
  // A moment counts by its local day.
  const lateYesterday = new Date(2026, 10, 21, 23, 50).toISOString();
  assert.equal(relativeDate(lateYesterday, 'ru', now), 'вчера');
  assert.equal(relativeDate('не дата', 'ru', now), null);
  assert.equal(relativeDate(null, 'ru', now), null);
});

test('L-3: only a date column with variant relative, the full date in the title on both paths', () => {
  assert.match(table, /\(type === "date" \|\| type === "datetime"\) && \(column\.variant \?\? column\.template\) === "relative"/u);
  const cellValue = table.split('    cellValue(column = {}, value) {')[1].split('\n    }\n')[0];
  assert.match(cellValue, /if \(this\.cellIsRelative\(column\)\) \{\n\s+const relative = this\.relativeDate\(column, value\);\n\s+if \(relative\) return relative;/u);
  const title = table.split('    cellTitle(column = {}, value) {')[1].split('\n    }\n')[0];
  assert.match(title, /const \{variant, template, \.\.\.plain\} = column;/u, 'the full date is drawn without the template');
  assert.match(table, /kind: "time", className: "sf-table-cell-bare", text: String\(typed\), datetime, title: this\.cellTitle\(column, value\)/u);
  assert.match(template, /'<time class=', ROW_HOLE, ' datetime=', ROW_HOLE, ' title=', ROW_HOLE, ' \.textContent=', ROW_HOLE, '><\/time>'/u);
  assert.match(template, /values\.push\(mark\.className, mark\.datetime, mark\.title \?\? nothing, mark\.text\);/u);
});

test('R8-3: the view toggle is not pressed over a pair without the toggle look, and draws its open look', () => {
  assert.doesNotMatch(head, /icon="view_quilt" aria-controls="" pressed="false"/u, 'the markup writes no pressed');
  const zone = head.split('    _renderZone(one, set) {')[1].split('\n    }\n')[0];
  assert.match(zone, /set\(toggle, "pressed", framework \? \(open \? "true" : "false"\) : null\);/u);
  assert.match(zone, /set\(toggle, "aria-expanded", open \? "true" : "false"\);/u);
  assert.match(zone, /toggle\.classList\.toggle\("sf-view-head-zone-toggle--open", Boolean\(open && !framework\)\);/u);
  assert.match(headCss, /\.sf-view-head-zone-toggle--own\.sf-view-head-zone-toggle--open \.sf-icon-button[^{]+\{\n\s+--sf-icon-button--background-color: var\(--sf-icon-button-pressed-background-color, var\(--sf-primary-container\)\);/u);
  assert.doesNotMatch(headCss, /--open[^{]*\{[^}]*--sf-icon--fill: 1/u, 'the open look never fills the glyph');
});
