import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

// sf-view-properties 1.16.4 (VP-5, VP-8 of the 2026-11-16 re-check). The
// geometry is measured on the built bytes by
// tests/browser/property-view-title-foot.browser.mjs.
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const css = read('src/smart/view-properties/js/templates/default.css');
const manifest = JSON.parse(read('src/smart/view-properties/component.json'));

test('VP-5: the panel title reads the drawer title step before the h4 role', () => {
  assert.match(css, /font-size: var\(--sf-property-view--title-size, var\(--sf-drawer--title-size, var\(--sf-heading-4--size\)\)\);/u);
  assert.match(css, /line-height: var\(--sf-property-view--title-height, var\(--sf-drawer--title-height, var\(--sf-heading-4--height\)\)\);/u);
});

test('VP-8: on a phone Save (Create) and Cancel share the foot row in halves, 8 apart', () => {
  const phone = css.slice(css.lastIndexOf('@media (max-width: 47.99rem)'));
  assert.match(phone, /\.sf-property-view-actions:has\(> sf-button > button\[data-action='cancel'\]\) > sf-button > button:is\(\[data-action='save'\], \[data-action='create'\], \[data-action='cancel'\]\) \{\s*flex: 1 1 calc\(\(100% - var\(--sf-space-1\\\/3\)\) \/ 2\);\s*min-inline-size: 0;/u);
  assert.match(phone, /\.sf-property-view-actions:has\(> sf-button > button\[data-action='cancel'\]\) > \.grow:last-child \{\s*display: none;/u);
  // Not outside the phone query: the desktop foot keeps the buttons' width.
  const desktop = css.slice(0, css.lastIndexOf('@media (max-width: 47.99rem)'));
  assert.doesNotMatch(desktop, /flex: 1 1 calc\(\(100% - var\(--sf-space-1\\\/3\)\) \/ 2\)/u);
});

test('1.16.4 and its migration step (the set moved on to 1.16.5)', () => {
  assert.ok(['1.16.4', '1.16.5', '1.16.6', '1.16.7', '1.16.8'].includes(manifest.version), manifest.version);
  assert.match(JSON.stringify(manifest), /"from":"1\.16\.3","to":"1\.16\.4"/u);
});
