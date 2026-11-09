import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = (path) => JSON.parse(read(path));

// sf-view-properties 1.12.0 on simai.property-view-port 1.18.0: the settings
// the set-drawn types read since 1.11.0 (currency, columns, minRows, maxRows,
// parts) and the number keys (min, max, step, precision) are the port's now.
// Every one is optional, so a 1.17.0 host is a 1.18.0 host that sends none.
test('port 1.18.0 declares every setting of the set-drawn types', () => {
  const manifest = json('src/smart/view-properties/smart.manifest.json');
  const declared = manifest.composition.declarative.host_port;
  assert.equal(declared.version, '1.18.0');
  const port = json(declared.path);
  assert.equal(port.version, '1.18.0');
  const field = port.data.record.schema.properties.sections.items.properties.groups.items.properties.fields.items;
  for (const key of ['currency', 'columns', 'minRows', 'maxRows', 'parts', 'min', 'max', 'step', 'precision']) {
    assert.ok(Object.hasOwn(field.properties, key), `${key} is declared`);
    assert.ok(!(field.required ?? []).includes(key), `${key} stays optional`);
  }
  assert.ok(declared.supported_versions.includes('1.17.0'), 'a 1.17.0 host keeps working');
});

// C21 (owner, 2026-11-08): h3 rung 3, h4 2, h5 1, h6 1. The record's titles are
// not content headings, so they read the text ladder, never a heading role:
// the full title rung 3, the 1/2 title rung 2 (a step down), a group title rung 1.
test('the titles read the text ladder, not the heading roles', () => {
  const css = read('src/smart/view-properties/js/templates/default.css');
  const js = read('src/smart/view-properties/js/templates/default.js');
  assert.match(css, /\.sf-property-view-title \{[^}]*font-size: var\(--sf-property-view--title-size, var\(--sf-text--size-3\)\);[^}]*line-height: var\(--sf-property-view--title-height, var\(--sf-title--height-3\)\);/u);
  assert.match(css, /\.sf-property-view-group-title \{[^}]*font-size: var\(--sf-property-view--group-size, var\(--sf-text--size-1\)\);[^}]*line-height: var\(--sf-property-view--group-height, var\(--sf-title--height-1\)\);/u);
  assert.match(js, /--sf-property-view--title-size: var\(--sf-text--size-2\); --sf-property-view--title-height: var\(--sf-title--height-2\);/u);
  assert.doesNotMatch(`${css}\n${js}`, /--sf-heading-[1-6]--(size|height)/u);
});
