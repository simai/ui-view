import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// View round 3 (sf-view 1.18.0, sf-view-properties 1.18.1): the list head's
// display kind switches the layout live, and a group named '' draws no empty
// head. The browser probe of the switch is ui-control
// control/evidence/2026-11-18-view-r3/probe/switch/switch.probe.mjs.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));
const view = read('src/smart/view/index.js');
const head = read('src/smart/view/js/head.js');
const card = read('src/smart/view-properties/js/templates/default.js');

test('sf-view switches its layout live and swaps the content element', () => {
  assert.match(view, /\n {4}canDrawLayout\(kind\) \{\n {8}return LAYOUTS\.has\(layoutName\(kind\)\);/u);
  assert.match(view, /\n {4}switchLayout\(kind, \{refresh = true\} = \{\}\) \{/u);
  assert.match(view, /if \(!LAYOUTS\.has\(name\)\) return \{outcome: "refused", reason: "layout-unavailable"\};/u);
  // A layout written after the view drew swaps the content element.
  assert.match(view, /if \(name === "layout"\) this\._swapContent\(\);\n {8}this\._renderProjection\(\);/u);
  // The page's own element of the other layout is parked, never removed.
  assert.match(view, /child\.setAttribute\("slot", "sf-view-parked"\);\n {16}child\.toggleAttribute\("data-sf-view-parked", true\);/u);
});

test('the marks carried over a switch survive the switch\'s own answer', () => {
  assert.match(view, /const answered = this\.pending === null && this\.sequence > \(this\._carrySequence \?\? 0\);/u);
  assert.match(view, /if \(answered\) this\._carrySelection = null;/u);
  assert.match(view, /board\.lanes = this\.boardLanes \?\? \[\];\n {12}this\._applyCarriedSelection\(\);/u);
});

test('the head switches through the view and shows the kinds it cannot draw as unavailable', () => {
  assert.match(head, /this\.view\.switchLayout\(kind\);/u);
  assert.match(head, /\.\.\.\(this\.drawable\(kind\) \? \{\} : \{disabled: true, ariaLabel: this\.kindLabel\(kind\)\}\)/u);
  assert.match(head, /if \(!this\.drawable\(kind\)\) return this\.render\(\);/u);
  for (const locale of ['ru', 'en']) assert.match(json(`src/smart/view/lang/${locale}.json`).runtime['head-kind-unavailable'], /^\{name\}: /u);
});

test('a group named \'\' draws no head unless it has an action', () => {
  assert.match(card, /const titled = String\(group\.label \?\? groupKey\) !== '' \|\| Boolean\(group\.rare\);/u);
  assert.match(card, /\$\{titled \|\| readEdit \? html`<div class="sf-list-description-head sf-property-view-group-header">/u);
  assert.match(card, /\$\{titled \? html`<header class="sf-property-view-group-header/u);
  assert.match(card, /\$\{titled \|\| configuring \|\| cardEdit \? html`<header class="sf-property-view-group-header/u);
});

test('versions and journals', () => {
  const component = json('src/smart/view/component.json');
  assert.equal(component.version, '1.18.0');
  assert.equal(json('src/smart/view/smart.manifest.json').version, '1.18.0');
  assert.deepEqual([component['x-history'][0].version, component['x-registry'].compatibility.migrations.at(-1).to], ['1.18.0', '1.18.0']);
  const properties = json('src/smart/view-properties/component.json');
  assert.equal(properties.version, '1.18.1');
  assert.equal(json('src/smart/view-properties/smart.manifest.json').version, '1.18.1');
  assert.equal(properties['x-history'][0].kind, 'patch');
});
