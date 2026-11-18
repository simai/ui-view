import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

// «Add a view» asks for the name before anything is written: simai.main QA
// (2026-10-27) found it made «New view» at once, a host record nobody had named.
const source = readFileSync(new URL('../src/smart/view-properties/index.js', import.meta.url), 'utf8');
const template = readFileSync(new URL('../src/smart/view-properties/js/templates/default.js', import.meta.url), 'utf8');

// The views are made in sf-profile-picker only (C163 (1), C311 (5)): the
// arranging mode's own list with «Add a view» and its naming row are gone
// (round/view-r4), so the name is asked in the picker before anything is written.
test('the card draws no views list of its own and no naming row', () => {
  for (const gone of ['function renderViewProfiles(', 'function renderNewViewName(', 'data-action="add-profile"', 'startNamingView', 'cancelNamingView']) {
    assert.ok(!template.includes(gone) && !source.includes(gone), gone);
  }
});

test('an empty name makes nothing; a name makes the view', () => {
  const start = source.indexOf('    createViewProfile(label');
  const body = source.slice(start, source.indexOf('\n    }\n', start) + 7);
  const createViewProfile = new Function(`return function ${body.trim()}`)();
  const calls = [];
  const view = {
    layerDraft: {fields: {}},
    requestComponentUpdate() {},
    _viewProfileIntent(intent, payload) { calls.push([intent, payload]); return 'raised'; },
  };
  assert.equal(createViewProfile.call(view, '   '), null);
  assert.equal(calls.length, 0);
  assert.equal(createViewProfile.call(view, ' Договоры '), 'raised');
  assert.deepEqual(calls[0][0], 'view.create');
  assert.equal(calls[0][1].label, 'Договоры');
});

// Cancelling an arrangement nobody changed writes nothing (simai.main QA,
// 2026-10-28): an identical view.save still cost a shared revision.
test('cancelling configure skips view.save when the layer is the one entered with', () => {
  const body = source.slice(source.indexOf('    async cancelConfiguringView() {'), source.indexOf('    askReset() {'));
  assert.match(body, /const untouched = entered\.revision != null && this\._layerRevision\(entered\.kind\) === entered\.revision;/u);
  const early = body.slice(body.indexOf('if (untouched'), body.indexOf('this.layerDraft = copy(entered.view);'));
  assert.doesNotMatch(early, /saveView/u);
  assert.match(source, /revision: this\._layerRevision\(this\.viewTarget\),/u);
});

// A link inside a field's value does its own thing only (simai.main,
// 2026-10-28): downloading a stored file also opened the group for editing.
test('a press on a link inside a value does not open the group', () => {
  const start = template.indexOf('data-open-group=${groupKey}');
  const handler = template.slice(start, template.indexOf('renderFieldValue(context, field, editing)}', start));
  assert.match(handler, /const inner = path\.slice\(0, Math\.max\(0, path\.indexOf\(event\.currentTarget\)\)\);\s*if \(inner\.some\(\(node\) => node\.matches\?\.\(INNER_CONTROL\)\)\) return;\s*context\.component\.editGroup\(sectionKey, groupKey\);/u);
  assert.match(template, /const INNER_CONTROL = 'a\[href\], button, input, select, textarea, \[role="button"\], \[role="link"\]';/u);
});

// Entering and leaving the arrangement keeps the keyboard somewhere
// (simai.main keyboard QA, 2026-10-28).
test('arranging moves the focus to its bar, and Done back to the menu', () => {
  const start = source.slice(source.indexOf('    startConfiguringView() {'), source.indexOf('    stopConfiguringView() {'));
  assert.match(start, /this\._focusAfterRender\(\['\.sf-property-view-configure-top \[data-action="view-profile"\]', "\.sf-property-view-configure-bar"\]\);\s*return true;/u);
  const stop = source.slice(source.indexOf('    stopConfiguringView() {'), source.indexOf('    _focusAfterRender(selector) {'));
  assert.match(stop, /if \(wasConfiguring\) this\._focusAfterRender\('\[data-action="menu"\]'\);/u);
  assert.match(source, /if \(active && active !== document\.body && root\?\.contains\?\.\(active\)\) return;/u);
});

// A lazily defined view chooser is waited for, so a cold Configure focuses it
// rather than Reset (simai.main, 2026-10-28).
test('the focus waits for a lazily defined chooser before falling through', () => {
  const body = source.slice(source.indexOf('    _focusAfterRender(selectors) {'), source.indexOf('    // Leaving the mode with the arrangement'));
  assert.match(body, /if \(!target && area\.localName\.includes\("-"\)\) \{\s*await customElements\.whenDefined\(area\.localName\);\s*await area\.whenRendered\?\.\(\);/u);
  assert.match(body, /if \(target\) break;/u);
});
