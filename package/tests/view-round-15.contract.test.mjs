import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// View round 15 (sf-view 1.37.0, sf-view-table 1.36.0, sf-view-properties
// 1.31.0, view-config 1.1.0): the returns of the r15m acceptance (VM-1, VM-2)
// and register items VL-12, VL-48, VL-64, VL-65, the bulk bar's size and C414.
// The browser measurements are in ui-control
// control/evidence/2026-11-22-view-r15/README.md.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const view = read('src/smart/view/index.js');
const head = read('src/smart/view/js/head.js');
const headCss = read('src/smart/view/js/head.css');
const table = read('src/smart/view-table/index.js');
const tableCss = read('src/smart/view-table/js/templates/default.css');
const card = read('src/smart/view-properties/js/templates/default.js');
const cardCss = read('src/smart/view-properties/js/templates/default.css');
const setRoot = process.env.SET_ROOT ?? root;
const contract = JSON.parse(readFileSync(resolve(setRoot, '..', 'contracts', 'view-config', 'view-config-1.schema.json'), 'utf8'));

test('VM-1: the view strip keeps one line and folds the kinds into its menu', () => {
  assert.match(head, /\n {4}_layZone\(\) \{/u);
  assert.match(head, /const fold = open > room \+ 0\.5;/u);
  // the desktop strip carries the kind menu beside the segmented kinds
  assert.match(head, /<sf-segmented data-kinds size="\$\{size\}" hidden><\/sf-segmented>\n {17}<sf-button-icon class="sf-view-head-kind-menu" data-kind-menu/u);
  assert.match(headCss, /\.sf-view-head:not\(\[data-phone\]\) > \.sf-view-head-zone:not\(\[data-wrap\]\) \{ flex-wrap: nowrap; \}/u);
});

test('VM-2: the table follows a width change in the next frame', () => {
  assert.match(table, /\n {4}_inNextFrame\(name, work\) \{/u);
  assert.match(table, /if \(!\(this\._responsiveWidth > 0\)\) follow\(\);\n {16}else this\._inNextFrame\("responsive", follow\);/u);
  // The rail stays in the observer: deferred, it looped at 768 px (rail and
  // scroll box resized over frames against the bulk bar's row observer).
  assert.match(table, /new ResizeObserver\(\(\) => this\.syncRail\(\)\)/u);
  assert.match(headCss, /\n {2}contain: inline-size;\n/u);
});

test('VL-12: the phone rows have no bottom inset of their own', () => {
  assert.match(tableCss, /padding-block: var\(--sf-space-1\\\/4\) 0;/u);
});

test('VL-48: a borrowed window keeps its kind; the name field takes the focus and Enter', () => {
  assert.match(head, /const kind = borrowed \?\? popover\.getAttribute\("data-pop"\);/u);
  assert.match(head, /popover\.__sfViewHeadKind = kind;/u);
  assert.match(head, /if \(open\.body\.querySelector\("\[data-name\]"\)\) this\._focusName\(open\.body\);/u);
  assert.match(head, /if \(event\.key !== "Enter" \|\| event\.isComposing/u);
});

test('C414: a view is saved without conditions; view-config 1.1.0', () => {
  assert.match(view, /for \(const key of \["filters", "filters_chosen", "saved_filter", "search", "page"\]\) delete how\[key\];/u);
  assert.match(view, /key, label, revision, query: how,/u);
  assert.equal(contract['x-contract-version'], '1.1.0');
  assert.equal(contract.$defs.view.properties.query.properties.filter.deprecated, true);
});

test('bulk bar: the list head controls\' size', () => {
  assert.match(view, /chosen\("size", this\.controlSize \|\| "1\/2"\);/u);
  assert.doesNotMatch(view, /chosen\("size", "1"\);/u);
});

test('VL-64: read values reserve the field; groups the card form edits are edited in place', () => {
  assert.match(cardCss, /\.sf-property-view-list \.sf-property-view-row > \.sf-list-description-value \{\n {4}min-block-size: var\(--sf-list-description--control\);/u);
  assert.match(card, /\nfunction renderEditRow\(context, field\) \{/u);
  assert.match(card, /sf-property-view-group--list sf-property-view-group--editing sf-property-view-group--in-place/u);
  assert.match(card, /if \(editing && !configuring && !context\.openAll && group\.kind !== 'related' && waiting === 0\) \{/u);
});

test('VL-65: «не заполнено» in the not-set ink, the label\'s ink as fallback', () => {
  assert.match(cardCss, /\.sf-property-view-empty \{\n {4}color: var\(--sf-on-surface-not-set, var\(--sf-on-surface-variant\)\);/u);
});

test('AN-3: the list head and the table head stick under --sf-admin-shell-stick, 0 when absent', () => {
  assert.match(view, /inset-block-start: calc\(var\(--sf-admin-shell-stick, 0px\) \+ var\(--sf-view--head-offset, 0px\)\);/u);
  assert.match(head, /set\("--sf-view--stuck-head", `calc\(var\(--sf-admin-shell-stick, 0px\) \+ \$\{stays\}px\)`\);/u);
  // a view without the list head keeps 0 (a list in a record card is not pushed down)
  assert.match(view, /:host \{ --sf-view--stuck-head: 0px; \}/u);
});

test('VM-1: a segmented that folds itself is read by its buttons\' line', () => {
  assert.match(head, /\nfunction kindsLineWidth\(kinds\) \{/u);
  assert.match(head, /const open = folded \? line - menuWidth \+ kindsWidth : line - drawn \+ kindsWidth;/u);
});
