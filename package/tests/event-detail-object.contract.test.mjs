// Event detail that is not a flat object (decision 2026-11-09, ui-control
// control/evidence/2026-11-09-pro-queue): a detail is an object (standard
// §8). Nested data rides in the fields of a flat carries map -- §4.2 types,
// `of` for a list's entries, `schema` for what the manifest checks -- and a
// detail of another shape is carried in a named field, its old shape kept on
// the dated alias names with mode split and the element's adapter.
// sf-view-table-template-save was the set's one detail that was not an
// object (the template, or an array of them); it carries {templates} since
// sf-view-table 1.16.0, and sf-view 1.10.0 reads it.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const FOLDERS = ['view', 'view-table', 'view-properties', 'view-flow'];
const json = (folder, file) => JSON.parse(readFileSync(resolve(root, 'src/smart', folder, file), 'utf8'));
const source = (folder) => readFileSync(resolve(root, 'src/smart', folder, 'index.js'), 'utf8');

test('every event of the set has an object detail in its generated manifest', () => {
  let events = 0;
  for (const folder of FOLDERS) {
    for (const [name, event] of Object.entries(json(folder, 'smart.manifest.json').events ?? {})) {
      events++;
      // A native event (carries "native") is the browser's Event: no detail.
      if (event.payload?.type === 'null') continue;
      assert.equal(event.payload?.type, 'object', `${folder}: ${name} has a detail that is not an object`);
      assert.equal(event.payload.oneOf, undefined, `${folder}: ${name} is a union`);
    }
  }
  assert.ok(events > 40, `${events} events`);
});

test('no x-registry/event-fields entry gives a detail another shape', () => {
  for (const folder of FOLDERS) {
    for (const [name, fields] of Object.entries(json(folder, 'component.json')['x-registry']?.['event-fields'] ?? {})) {
      const type = fields?.payload?.type;
      assert.ok(type === undefined || type === 'object', `${folder}: event-fields.${name} sets payload.type ${JSON.stringify(type)}`);
      assert.equal(fields?.payload?.oneOf, undefined, `${folder}: event-fields.${name} is a union`);
    }
  }
});

test('template-save carries templates, one or more, in the table and in the view', () => {
  for (const [folder, verb, dom] of [
    ['view-table', 'template-save', 'sf-view-table-template-save'],
    ['view', 'table-template-save', 'sf-table-template-save'],
  ]) {
    const declared = json(folder, 'component.json').events[verb];
    assert.deepEqual(Object.keys(declared.carries), ['templates'], `${folder}.${verb}`);
    assert.equal(declared.carries.templates.type, 'list');
    assert.deepEqual(Object.keys(declared.carries.templates.of), ['key', 'label', 'selected', 'data', 'settings']);
    const payload = json(folder, 'smart.manifest.json').events[dom].payload;
    assert.deepEqual(payload.required, ['templates'], dom);
    assert.equal(payload.properties.templates.type, 'array');
    assert.equal(payload.properties.templates.minItems, 1);
    assert.deepEqual(payload.properties.templates.items.required, ['key', 'label', 'settings']);
  }
});

test('the former names keep the 1.3 detail through the table\'s adapter until their dates', () => {
  const rows = json('view-table', 'component.json').aliases.rows;
  for (const from of ['sf-table-template-save', 'onTemplateSave']) {
    const row = rows.find((item) => item.kind === 'event' && item.from === from);
    assert.equal(row?.to, 'sf-view-table-template-save', from);
    assert.equal(row.mode, 'split', from);
  }
  const text = source('view-table');
  const body = text.match(/const formerTemplateDetail = [^\n]*;/u)?.[0];
  assert.ok(body, 'formerTemplateDetail');
  const former = new Function(`${body}; return formerTemplateDetail;`)();
  const one = {key: 'a', label: 'A', settings: {}};
  const two = {key: 'b', label: 'B', settings: {}};
  assert.equal(former({templates: [one]}), one, 'one template: the template itself');
  assert.deepEqual(former({templates: [one, two]}), [one, two], 'several: the array');
  assert.match(text, /"sf-table-template-save": formerTemplateDetail,\s*onTemplateSave: formerTemplateDetail,/u);
  assert.doesNotMatch(text, /emitTableEvent\('template-save', detail\)/u, 'every save sends {templates}');
});

test('the view reads detail.templates and, until 2027-01-01, a bare template or array', () => {
  assert.match(source('view'), /const templates = Array\.isArray\(detail\.templates\) \? detail\.templates : detail;/u);
});
