// What a cell and a card show for kinds of value the renderer set reads
// (the Fields page and Larena, 2026-11-05; view-r1 VF-10):
// - a date, a date and time and a time of day read as the SIMAI Framework's
//   field renderers read them; the set keeps no date parsing of its own
//   (draft set standard 7.9), and the host's formatFieldValue still wins;
// - formatted text (html) is its text in a row, never its markup;
// - several files are each a name with its kind's icon, folded into «+N»
//   when they do not fit, where a column of documents drew nothing.
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const table = read('src/smart/view-table/index.js');
const template = read('src/smart/view-table/js/templates/default.js');
const card = read('src/smart/view-properties/index.js');
const flow = read('src/smart/view-flow/index.js');
// The record component's field value lives in js/field-value.js (shared with
// sf-view-flow); the card's template is both files.
const cardTemplate = read('src/smart/view-properties/js/templates/default.js') + read('src/smart/view-properties/js/field-value.js');

test('the set keeps no date format of its own: the Framework renderers read every date', () => {
  assert.equal(existsSync(resolve(root, 'src/smart/view-table/js/format-value.js')), false, 'format-value.js is gone');
  for (const [name, source] of [['view-table', table], ['view-properties', card], ['view-flow', flow]]) {
    assert.doesNotMatch(source, /formatDateValue|format-value\.js/u, name);
  }
});

test('the table asks the field renderers, with the host, and adds nothing after them', () => {
  const method = table.split('    getTypedCellValue(column = {}, value) {')[1].split('\n    }\n')[0];
  assert.match(method, /const rendered = renderCellField\(column, value, host\);\n\s+if \(rendered !== null && rendered !== undefined\) return rendered;\n\s+return null;/u);
});

test('a date cell is a time element with its machine value (PD-9)', () => {
  assert.match(table, /import \{[^}]*dateTimeAttribute[^}]*\} from "\.\.\/view-common\/field-renderers\.js";/u);
  assert.match(table, /return dateTimeAttribute\(\{\.\.\.column, propertyType: type\}, value\) \|\| "";/u);
  assert.match(table, /kind: "time", className: "sf-table-cell-bare", text: String\(typed\), datetime/u);
  assert.match(template, /<time class=/u);
  assert.match(template, /html`<time datetime=\$\{datetime\} title=\$\{context\.component\?\.cellTitle\?\.\(column, value\) \?\? nothing\}>\$\{typed\}<\/time>`/u);
});

test('the card reads a field shown through its host first, and the renderers otherwise', () => {
  const getter = card.split('    get viewHost() {')[1].split('\n    }\n')[0];
  assert.match(getter, /const own = host\?\.formatFieldValue\?\.\(field, value\);\n\s+return typeof own === "string" \? own : undefined;/u);
  assert.match(getter, /Object\.create\(host && typeof host === "object" \? host : null\)/u, 'the rest of the host is reached unchanged');
  assert.equal((cardTemplate.match(/renderViewField\(field, field\.value, context\.viewHost, \{size: context\.size\}\)/gu) ?? []).length, 2);
  assert.doesNotMatch(cardTemplate, /context\.hostPort/u);
});

test('formatted text in a row is its text, on both of the table\'s paths', () => {
  assert.match(table, /import \{htmlText\} from "\.\.\/view-common\/field-html\.js";/u);
  assert.match(table, /return type === "html" \? htmlText\(value\) : String\(value\);/u);
  // The markup path (rowMarkupCell) and the full renderer both ask cellText.
  assert.match(table, /LONG_TEXT_CELL_TYPES\.has\([^\n]+\n\s+const text = this\.cellText\(column, value\);/u);
  assert.match(template, /const text = context\.component\?\.cellText\?\.\(column, value\) \?\? String\(value\);/u);
});

test('several files are a value each, so they wrap and fold as several tags do', () => {
  const method = table.split('    getTypedCellValue(column = {}, value) {')[1].split('\n    }\n')[0];
  assert.match(method, /if \(type === "file" && Array\.isArray\(value\)\) \{\n\s+const files = value\.map\(\(file\) => renderCellField\(column, file, host\)\)/u);
  assert.match(method, /return files\.length \? files : null;/u);
});
