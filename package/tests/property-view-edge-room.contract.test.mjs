import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// The record panel's copy-link and open-full controls stand on the
// drawer's edge. Beside a wide panel the drawer places them a step beyond the
// panel's width and does not look at the window, so the panel has to leave them
// room; in a panel that fills the screen the drawer brings them inside along the
// top, so the head has to leave them room. Neither held: at 980px the strip
// stood at x = -20 (half cut off) and on a phone it covered the record's name
// (docs review, round 4, 2026-10-20). The probe
// tests/browser/property-view-narrow-edge.browser.mjs measures both.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(root, 'src/smart/view-properties/index.js'), 'utf8');
const template = readFileSync(resolve(root, 'src/smart/view-properties/js/templates/default.js'), 'utf8');
const sheet = readFileSync(resolve(root, 'src/smart/view-properties/js/templates/default.css'), 'utf8');

const body = (text, start) => {
  const at = text.indexOf(start);
  assert.ok(at >= 0, `${start} is in the source`);
  return text.slice(at, text.indexOf('\n    }\n', at));
};

test('a wide panel is never wider than the window less the edge strip', () => {
  const width = body(source, '    get drawerWidth() {');
  assert.match(width, /return `min\(\$\{wanted\}, calc\(100vw - \$\{this\.edgeRoom\}\)\)`;/u,
    'every wide width, railed or not, is capped by the strip');
  assert.doesNotMatch(width, /100vw - var\(--sf-space-4\)/u, 'the old cap left 32px for a 64px strip');
});

test('the edge strip is one control and the drawer step on each side', () => {
  assert.match(body(source, '    get edgeRoom() {'),
    /return `calc\(\$\{this\.edgeControlWidth\} \+ 2 \* var\(--sf-space-1\\\\\/2\)\)`;/u);
  // The control's own width: an sf-button-icon is its text height and the
  // ladder's padding on both sides.
  assert.match(body(source, '    get edgeControlWidth() {'),
    /calc\(var\(--sf-text-height-\$\{step\}\) \+ 2 \* var\(--sf-ui-\$\{step\}--space-y-tightness-default\)\)/u);
  // The close is in the panel's head since 1.16.0 (C14, C157 (6)): the strip
  // carries copy-link and open-full only.
  assert.match(body(source, '    get edgeControlCount() {'),
    /return \(this\.address \? 1 : 0\) \+ \(this\.canOpenFullPage \? 1 : 0\);/u);
});

test('in a panel that fills the screen the strip is a row and the head keeps its room', () => {
  assert.match(template, /function panelFills\(context\) \{\n\s+return !context\.wide \|\| context\.panelSize === 'full';\n\}/u);
  assert.match(template, /const row = inHead \|\| panelFills\(context\);/u);
  assert.match(template, /class="sf-property-view-edge \$\{shown \? `flex \$\{row \? 'flex-row' : 'flex-col'\} \$\{inHead \? 'gap-1\/3' : 'gap-1\/2'\}` : ''\}" slot="edge" \?hidden=\$\{!shown\}>/u);
  assert.match(template, /\$\{panelFills\(context\) && context\.edgeControlCount \? ' sf-property-view-panel--fills' : ''\}/u);
  // Drawn from the first render (sf-drawer takes it into its edge area then)
  // and hidden without copy-link or open-full.
  assert.match(template, /const shown = Boolean\(context\.edgeControlCount\);/u, 'no strip without copy-link or open-full');
  assert.match(template, /--sf-property-view--edge-room: calc\(\$\{context\.edgeControlCount\} \* \$\{context\.edgeControlWidth\} \+ \$\{context\.edgeControlCount - 1\} \* var\(--sf-space-1\\\\\/2\)\);/u);
  assert.match(sheet, /\.sf-property-view-panel--fills \.sf-property-view-head \{\n\s+padding-inline-start: calc\(var\(--sf-space-1\) \+ var\(--sf-property-view--edge-room, 0px\) \+ var\(--sf-space-1\\\/2\)\);\n\s+\}/u);
});

// C205 (2), sf-view-properties 1.16.5: in the drawer's head
// (data-sf-drawer-edge-in-head) the copy-link and open-full controls are the
// page's buttons beside the close: size 1/3, no raised plate, a row 8 apart;
// a filled panel's head starts on its axis and stops short of the drawer's
// room (ui-pro f29d4bf, taken back).
test('in the drawer head the edge controls are size 1/3 without the plate, and the head clears them', () => {
  assert.match(source, /new MutationObserver\(\(\) => \{\n\s+const inHead = Boolean\(this\.querySelector\("\.sf-drawer\[data-sf-drawer-edge-in-head\]"\)\);/u);
  assert.match(source, /attributeFilter: \["data-sf-drawer-edge-in-head"\]/u);
  assert.match(source, /this\._edgeObserver\?\.disconnect\(\);/u);
  assert.match(source, /edgeInHead: Boolean\(this\._edgeInHead\),/u);
  assert.match(template, /const size = inHead \? '1\/3' : \(context\.controlSize \?\? nothing\);/u);
  assert.match(template, /const plate = inHead \? nothing : EDGE_SURFACE;/u);
  assert.equal((template.match(/root-style=\$\{plate\}/gu) ?? []).length, 2, 'both controls read the plate');
  assert.equal((template.match(/root-style=\$\{EDGE_SURFACE\}/gu) ?? []).length, 0);
  assert.match(template, /\$\{keyed\(inHead, html`/u, 'a Smart button draws its look once: new controls when the place changes');
  assert.match(sheet, /\.sf-drawer\[data-sf-drawer-edge-in-head\] \.sf-property-view-panel--fills \.sf-property-view-head \{\n\s+padding-inline-start: var\(--sf-property-view--panel-axis\);\n\s+padding-inline-end: calc\(var\(--sf-property-view--panel-axis\) \+ var\(--sf-drawer-edge-room, 0px\) \+ var\(--sf-space-1\\\/3\)\);/u);
});
