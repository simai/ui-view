import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {URL} from 'node:url';

// C144 (H5 and H6, horizontal spacing): buttons of one group stand
// --sf-space-1/3 apart, a group beside a group and a field beside a button
// --sf-space-1 (12 on a phone). The list toolbar drew the field, filter, sort
// and «Создать» all at 1/3: «Сортировка»·«Создать» measured 8 on a phone
// (View 1.8.1 acceptance, msg-de143f8f, queue #123). Browser measure in the
// evidence probe.
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('sf-view-table list toolbar: field, view buttons and «Создать» are three groups', async () => {
  const template = await read('src/smart/view-table/js/templates/default.js');
  const list = template.slice(template.indexOf('class="sf-table-toolbar sf-table-toolbar--list'), template.indexOf('function renderToolbar(context)'));
  assert.match(list, /<div class="sf-table-list-search flex items-cross-center gap-1 min-w-0">/);
  // No empty group: a row without filter, sort and the settings button
  // (LV-6, view round 5) draws none.
  assert.match(template, /const sortable = context\.component\.getColumns\(\)\.some\(\(column\) => column\?\.sortable && !column\.system\);/);
  assert.match(list, /offersFilter\(active\.length\) \|\| sortable \|\| gear \? html`<div class="sf-table-list-view-buttons/);
  // Filter and sort sit inside the view-buttons group; «Создать» after it.
  const group = list.slice(list.indexOf('<div class="sf-table-list-view-buttons flex items-cross-center gap-1/3">'));
  assert.ok(group.length < list.length, 'the view buttons group');
  const close = group.indexOf('</div>` : nothing}\n                ${context.actions && context.creatable');
  assert.ok(close > 0, 'the group closes before «Создать»');
  const inside = group.slice(0, close);
  assert.match(inside, /sf-table-list-filter/);
  assert.match(inside, /icon="swap_vert"/);
  assert.doesNotMatch(inside, /icon="add"/);
});

test('sf-view-table sheet and sf-view skeleton: the list row gap is --sf-space-1, the view buttons 1/3', async () => {
  const css = await read('src/smart/view-table/js/templates/default.css');
  assert.match(css, /\.sf-table-toolbar--list > \.sf-table-list-search \{\n\s*gap: var\(--sf-space-1\);/);
  assert.match(css, /\.sf-table-list-view-buttons \{\n\s*gap: var\(--sf-space-1\\\/3\);/);
  // The skeleton's compact toolbar (field, filter, create) holds the same groups.
  const paint = await read('src/smart/view/js/first-paint.css');
  assert.equal((paint.match(/\.sf-data-view-skeleton-toolbar \{\n\s*flex-wrap: nowrap;\n\s*gap: var\(--sf-space-1\);/g) ?? []).length, 2);
});
