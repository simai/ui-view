import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {URL} from 'node:url';

// The Pro joint pass over the admin pages (msg-78b6c4aa, 2026-11-16) on the
// view set: PRO-ADM-9 (a row's menu button names its record) and PRO-ADM-16
// (the panel's first focus). Browser measures are in the evidence probe.
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('PRO-ADM-9: the resource row «more» button names its record, as the ≡ does', async () => {
  const template = await read('src/smart/view-table/js/templates/default.js');
  assert.match(template, /aria-label=\$\{component\.getRowNameText\(row\) \? `\$\{component\.text\('moreActionsLabel'\)\}: \$\{component\.getRowNameText\(row\)\}` : component\.text\('moreActionsLabel'\)\} aria-haspopup="menu" data-sf-row-menu/);
  const source = await read('src/smart/view-table/index.js');
  assert.match(source, /return text \? `\$\{this\.text\("actionsColumnLabel"\)\}: \$\{text\}` : this\.text\("menuLabel"\);/);
});

test('PRO-ADM-16: a record to read opens on its title; a record with a field keeps the field', async () => {
  const source = await read('src/smart/view-properties/index.js');
  const opened = source.slice(source.indexOf('this._onDrawerOpened = (event) => {'), source.indexOf('this.addEventListener("sf-drawer-opened", this._onDrawerOpened);'));
  assert.ok(opened.length > 0);
  assert.match(opened, /if \(event\.target !== this\._ownDrawer\(\)\) return;/);
  assert.match(opened, /closest\?\.\("input, textarea, select, \[contenteditable\], sf-input, sf-select, sf-textarea"\)\) return;/);
  assert.match(opened, /title\.tabIndex = -1;\n\s*title\.focus\(\{preventScroll: true\}\);/);
  assert.match(source, /this\.removeEventListener\("sf-drawer-opened", this\._onDrawerOpened\);/);
});
