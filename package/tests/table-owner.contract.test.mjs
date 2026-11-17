import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Smart Table names every owned action and contextual surface', async () => {
  const [table, template] = await Promise.all([
    read('src/smart/view-table/index.js'),
    read('src/smart/view-table/js/templates/default.js'),
  ]);

  // Eight since round three: the toolbar's control opens the view's actions.
  // Nine since the compact list, whose sort is a menu (it has no column heads).
  // Eight again since CM-8: the row's second, hand-drawn menu is gone; a row
  // has the one standard menu bound to the rows (rowMenu, made in script).
  // Seven since C106: the gear's window is SIMAI Framework sf-settings in its
  // panel look, named by the same label.
  // Three since view round 1 (D5): the create, view-actions, list-sort and
  // template menus open the Framework's shared menu (SF.menu.open, menuOpen)
  // with a label each; the table draws only the windows it still owns.
  assert.equal((table.match(/<sf-menu-context/g) || []).length, 3);
  assert.equal((table.match(/<sf-menu-context[\s\S]*?aria-label=/g) || []).length, 3);
  assert.match(table, /await menuOpen\(\{\s*anchor,\s*entries: built\.entries,\s*label: this\.getContextMenuLabel\(\{menu\}\),/u);
  assert.match(table, /await menuOpen\(\{\s*anchor,\s*label: this\.getContextMenuLabel\(\{type: 'filter-template-actions', template\}\),/u);
  assert.match(table, /<sf-settings\s+look="panel"[\s\S]*?label=\$\{this\.getContextMenuLabel\(\{\.\.\.data, menu: 'table-settings'\}\)\}/u);
  assert.match(table, /getContextMenuLabel\(data = \{\}\)/);
  // The words are the language files' (draft set standard 7.10).
  assert.match(template, /aria-label=\$\{context\.component\.text\('saveFilterTemplateLabel'\)\}/);
  // The search field is named and clears itself (C123 (5), C153 (6), TI-10).
  assert.equal((template.match(/aria-label=\$\{context\.searchPlaceholder\}/g) || []).length, 2);
  assert.match(template, /aria-label=\$\{context\.component\.text\('createOptionsLabel'\)\}/);
  // The gear in the toolbar became the view's actions; column settings keep
  // their own gear in the table's head, labelled there.
  assert.match(template, /aria-label=\$\{context\.component\.text\('contextViewActionsLabel'\)\}/);
  assert.match(table, /ariaLabel: this\.text\("settingsColumnLabel"\)/);
  assert.match(template, /context\.actions[\s\S]*createOptionsLabel/);
  assert.match(template, /context\.settings && state\.toolbarActions\?\.length[\s\S]*contextViewActionsLabel/);
  assert.match(template, /<table[\s\S]*aria-label=\$\{context\.ariaLabel \|\| nothing\}/);
  assert.doesNotMatch(template, /Resize sidebar/);
  assert.doesNotMatch(template, /Math\.random\(\)/);
});

test('Smart Table owns one disposable portal and viewport-aware overlays', async () => {
  const table = await read('src/smart/view-table/index.js');

  assert.match(table, /this\._portalContainer = portal/);
  assert.match(table, /portal\.className = "sf-table-portal"/);
  assert.doesNotMatch(table, /getElementById\("sf-table-portal"\)/);
  assert.match(table, /this\._portalContainer\.remove\(\)/);
  assert.match(table, /window\.visualViewport\?\.addEventListener\('resize'/);
  assert.match(table, /clampContextMenusToViewport\(\)/);
  assert.match(table, /contextKeyEvent\(event\)[\s\S]*event\.key !== 'Escape'/);
  assert.match(table, /closeContextMenu\(restoreFocus = true\)/);
  assert.match(table, /trigger\?\.isConnected[\s\S]*trigger\.focus\(\)/);
});

test('Smart Table exposes keyboard column resizing without literal design dimensions', async () => {
  const [table, template, styles] = await Promise.all([
    read('src/smart/view-table/index.js'),
    read('src/smart/view-table/js/templates/default.js'),
    read('src/smart/view-table/js/templates/default.css'),
  ]);

  // The column edges are the Framework's resize gesture since 2026-10-14
  // (SF.Resizer.attach): arrows, Home and End, Enter to reset, and a double
  // click; the edge is a focusable separator.
  assert.match(template, /aria-keyshortcuts="ArrowLeft ArrowRight Home End Enter Escape"/);
  assert.match(template, /role="separator"/);
  assert.match(table, /this\._columnResizeDetach = attach\(table, \{\s*handles: '\.sf-table-column-resizer',/u);
  assert.match(table, /import \{ref\} from "lit\/directives\/ref\.js"/);
  assert.match(template, /import \{ref\} from "lit\/directives\/ref\.js"/);
  assert.doesNotMatch(`${table}\n${template}`, /:ref=/);
  // Round three took the handle away: the width is taken by the line itself,
  // through an invisible strip that is still a button for the keyboard.
  assert.doesNotMatch(styles, /sidebar-resizer-button/);
  assert.match(styles, /\.sf-table-column-resizer \{[\s\S]*?cursor: col-resize/u);
  assert.match(
    styles,
    /\.sf-table-column-resizer:focus-visible \{\s*outline: var\(--sf-focus--width\) var\(--sf-focus--style\) var\(--sf-focus--color\)/u,
  );
  assert.match(table, /getPropertyValue\('--sf-space-1'\)/);
  assert.doesNotMatch(table, /\b(?:1rem|2px)\b/);
  assert.doesNotMatch(styles, /max-width:\s*400px/);
  assert.doesNotMatch(table, /z-index:\s*999[89]/);
});

test('Smart Table Loader rule declares every rendered Smart dependency', async () => {
  const rule = await read('src/smart/view-table/rule.js');

  for (const dependency of [
    'cl-checkbox', 'cl-button', 'cl-button-icon', 'cl-input', 'cl-tag',
    'cl-pagination', 'cl-spinner', 'cl-input-date', 'cl-dropdown', 'cl-tabs', 'cl-menu-context',
  ]) {
    assert.match(rule, new RegExp(`name: ["']${dependency}["']`));
  }
});

test('Smart Table implements its declared loading, empty, error and retry states', async () => {
  const [table, template, manifestSource] = await Promise.all([
    read('src/smart/view-table/index.js'),
    read('src/smart/view-table/js/templates/default.js'),
    read('src/smart/view-table/smart.manifest.json'),
  ]);
  const manifest = JSON.parse(manifestSource);

  assert.match(table, /attribute: "data-state"/);
  assert.match(table, /values: \["auto", "loading", "populated", "empty", "error"\]/);
  // Sent by verb through the manifest (standard 1.3.8 §8); the registry lists
  // the DOM names, the old ones as aliases of the new.
  for (const [verb, eventName] of [
    ['search-change', 'sf-view-table-search-change'],
    ['filter-change', 'sf-view-table-filter-change'],
    ['template-save', 'sf-view-table-template-save'],
    ['save', 'sf-view-table-save'],
    ['refresh', 'sf-view-table-refresh'],
  ]) {
    assert.match(table, new RegExp(`emitTableEvent\\('${verb}'`));
    assert.ok(manifest.events[eventName]);
  }
  // The old names stay listed: they are still delivered, as dated aliases.
  assert.ok(manifest.events['sf-table-column-settings-change'] && manifest.events['sf-table-retry']);
  assert.equal(manifest.inputs.properties['data-state'].default, 'auto');
  assert.ok(manifest.methods.setDataState);
  assert.ok(manifest.methods.requestRetry);
  assert.match(template, /data-state=\$\{resolvedDataState\(context\)\}/);
  assert.match(template, /aria-busy=\$\{resolvedDataState\(context\) === 'loading'/);
  assert.match(template, /role="status"/);
  // Empty and failed are one sf-empty-state (owner, 2026-10-14): its error
  // offers «Повторить», which the table turns into the retry event, and a
  // failure the person caused is an alert.
  assert.match(template, /<sf-empty-state kind=\$\{brick\.kind\}/);
  assert.match(table, /id === "retry"\) \{ event\.stopPropagation\(\); this\.requestRetry\(\); \}/);
  assert.match(table, /live: context\.caused \? "alert" : "auto"/);
});
