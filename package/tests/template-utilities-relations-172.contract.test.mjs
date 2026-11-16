import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {URL} from 'node:url';

// Queue #172 (View 1.8.1 acceptance): the bulk band's gap came 0 -> 8 and the
// band 8 px down some 150 ms after the first paint, because the utility
// sheets its markup draws with were asked for only when the Loader met the
// classes. A Framework component gets its template utilities as relations
// from the Loader's template-utilities.generated.json; a package component
// is not in that file and names them itself. The lists are the Framework's
// scripts/generate-template-utilities.mjs run over the overlay (2026-11-16).
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const WANT = {
  view: ['align-items/default', 'display/default', 'flex-direction/default', 'flex-wrap/default', 'gap/default', 'justify-content/default', 'margin/default', 'position/default', 'table/default'],
  'view-table': ['align-items/default', 'display/default', 'flex-direction/default', 'flex-wrap/default', 'flex/default', 'gap/default', 'justify-content/default', 'min-width/default', 'overflow/default', 'padding/default', 'width/default'],
  'view-flow': ['align-items/default', 'display/default', 'flex-direction/default', 'gap/default', 'min-width/default'],
  'view-properties': ['align-items/default', 'display/default', 'flex-direction/default', 'flex-grow/default', 'flex/default', 'gap/default', 'padding/default'],
};

for (const [folder, wanted] of Object.entries(WANT)) {
  test(`${folder}: the layout utilities its templates write are relations in component.json and rule.js`, async () => {
    const component = JSON.parse(await read(`src/smart/${folder}/component.json`));
    const names = new Set(component.relations.map((relation) => relation.name));
    const rule = await read(`src/smart/${folder}/rule.js`);
    for (const name of wanted) {
      assert.ok(names.has(name), `${folder} component.json relations: ${name}`);
      assert.ok(rule.includes(`{ name: '${name}' }`), `${folder} rule.js: ${name}`);
    }
  });
}
