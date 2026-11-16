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
  const slice = (from, to) => {
    const start = source.indexOf(from);
    assert.ok(start >= 0, from);
    return source.slice(start, source.indexOf(to, start + from.length));
  };
  // The panel is drawn open, so sf-drawer-opened is never sent for it (the
  // first fix listened for it and the probe still found the star focused):
  // the watch starts on the render that opens the panel.
  assert.doesNotMatch(source, /addEventListener\("sf-drawer-opened"/);
  const watch = slice('this._offAfterRender = this.onAfterRender?.(() => {', '\n        });');
  assert.match(watch, /if \(open && !this\._panelWasOpen\) this\._startTitleFocus\(\);/);
  assert.match(watch, /if \(!open\) this\._endTitleFocus\(\);/);
  assert.match(source, /const TITLE_FOCUS_WAIT_MS = 2000;/);
  const start = slice('    _startTitleFocus() {', '\n    }\n');
  assert.match(start, /document\.addEventListener\("focusin", this\._onPanelFocusIn, true\);/);
  assert.match(start, /document\.addEventListener\("pointerdown", this\._onPanelAct, true\);/);
  assert.match(start, /document\.addEventListener\("keydown", this\._onPanelAct, true\);/);
  const first = slice('    _focusTitleFirst() {', '\n    }\n');
  // Only the drawer's own pick gives way: the panel waiting, or its first stop.
  assert.match(first, /closest\?\.\("input, textarea, select, \[contenteditable\], sf-input, sf-select, sf-textarea"\)\) return this\._endTitleFocus\(\);/);
  assert.match(first, /if \(active !== panel && active !== drawer\?\.firstFocusIn\?\.\(panel\)\) return this\._endTitleFocus\(\);/);
  assert.match(first, /title\.tabIndex = -1;\n\s*title\.focus\(\{preventScroll: true\}\);/);
  const off = slice('    onDisconnected() {', '\n    }\n');
  assert.match(off, /this\._endTitleFocus\(\);\n\s*this\._offAfterRender\?\.\(\);/);
});
