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
  // round/view-r4 (VR3-1): a layout draws only when its element is in the running set.
  assert.match(view, /\n {4}canDrawLayout\(kind\) \{\n {8}const tag = LAYOUTS\.get\(layoutName\(kind\)\);/u);
  assert.match(view, /\n {4}switchLayout\(kind, \{refresh = true\} = \{\}\) \{/u);
  assert.match(view, /if \(!LAYOUTS\.has\(name\)\) return \{outcome: "refused", reason: "layout-unavailable"\};/u);
  // A layout written after the view drew swaps the content element.
  // Round 8 (VSA-5): the swap is followed by the hold of a layout whose code is on the way.
  assert.match(view, /if \(name === "layout"\) \{\n {12}this\._swapContent\(\);\n {12}this\._holdLayoutLoad\(\);\n {8}\}\n {8}this\._renderProjection\(\);/u);
  // The page's own element of the other layout is parked, never removed.
  assert.match(view, /child\.setAttribute\("slot", "sf-view-parked"\);\n {16}child\.toggleAttribute\("data-sf-view-parked", true\);/u);
});

test('each presentation keeps its own marks over a switch (C413, view round 15m)', () => {
  // No carry between kinds (C413 replaces C298 / LV2-2 carry and VR14-1).
  assert.doesNotMatch(view, /_carrySelection|_carrySequence/u);
  assert.match(view, /const marksKind = \(tag\) => /u);
  assert.match(view, /get _marks\(\) \{\n {8}return this\._marksOf\?\.\[marksKind\(this\._layoutTag\(\)\)\] \?\? null;/u);
  assert.match(view, /this\._noteMarks\(\[\.\.\.this\._drawnIds\(fromTag\)\], marked\);/u);
  assert.match(view, /const ids = \[\.\.\.new Set\(\[\.\.\.\(this\._ownHeld \?\? \[\]\), \.\.\.this\.markedIds\]\.map\(String\)\)\];/u);
  // The incoming kind's marks are held over the switch's own answer; the
  // table's select events wait for them.
  assert.match(view, /if \(this\._holdMarks \|\| this\._ownHeld\) return;/u);
  assert.match(view, /board\.lanes = this\.boardLanes \?\? \[\];\n {12}this\._applyOwnMarks\(\);/u);
});

test('the head switches through the view and hides the kinds it cannot draw (VR3-1)', () => {
  assert.match(head, /this\.view\.switchLayout\(kind\);/u);
  assert.match(head, /const kinds = asked\.filter\(\(kind\) => Object\.hasOwn\(KINDS, kind\) && this\.drawable\(kind\)\);/u);
  assert.doesNotMatch(head, /disabled: true, (ariaLabel|caption): this\.kindLabel\(kind\)/u);
  assert.match(head, /if \(!this\.drawable\(kind\)\) return this\.render\(\);/u);
  for (const locale of ['ru', 'en']) assert.equal(json(`src/smart/view/lang/${locale}.json`).runtime['head-kind-unavailable'], undefined);
});

test('a group named \'\' draws no head unless it has an action', () => {
  assert.match(card, /const titled = \(String\(group\.label \?\? groupKey\) !== '' \|\| Boolean\(group\.rare\)\) && !repeats;/u);
  assert.match(card, /\$\{titled \|\| readEdit \? html`<div class="sf-list-description-head sf-property-view-group-header">/u);
  // VR14-3 (view round 15m): the edited group keeps the head it read with,
  // under the same condition, its «Изменить» an unseen stand-in.
  assert.equal(card.match(/\$\{titled \|\| readEdit \? html`<div class="sf-list-description-head sf-property-view-group-header">/gu)?.length, 2);
  assert.match(card, /sf-property-view-group-action-kept" aria-hidden="true" inert>/u);
  assert.match(card, /\$\{titled \|\| configuring \|\| cardEdit \? html`<header class="sf-property-view-group-header/u);
});

test('versions and journals', () => {
  // Round 3's entries stay in the journal; later rounds move the version on.
  const component = json('src/smart/view/component.json');
  assert.ok(component['x-history'].some((entry) => entry.version === '1.18.0'));
  assert.ok(component['x-registry'].compatibility.migrations.some((step) => step.to === '1.18.0'));
  const properties = json('src/smart/view-properties/component.json');
  assert.equal(properties['x-history'].find((entry) => entry.version === '1.18.1')?.kind, 'patch');
});
