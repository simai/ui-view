import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {URL} from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('a filter option badge keeps the narrow side room of a dense list', async () => {
  const table = await read('src/smart/view-table/index.js');
  const option = table.slice(table.indexOf('renderFilterOption(field = {}'), table.indexOf('renderFilterOptionVisual('));
  assert.ok(option.length > 0, 'renderFilterOption is found');

  // An option list is dense, as a cell is: the badge is tight (sf-badge 1.3.0)
  // and tonal, never the full side room of a free-standing badge.
  assert.match(option, /<sf-badge\s+appearance="tonal"\s+tight\s/u);
});

test('a date cell asks the field renderers first and keeps no format of its own ahead of them', async () => {
  const table = await read('src/smart/view-table/index.js');

  // C19: the renderer set formats a date (module.smart-field-renderers), the
  // table inherits and keeps no reading of its own (VF-10, draft set standard 7.9).
  assert.match(
    table,
    /const rendered = renderCellField\(column, value, host\);\s*if \(rendered !== null && rendered !== undefined\) return rendered;\s*return null;/u,
  );
});
