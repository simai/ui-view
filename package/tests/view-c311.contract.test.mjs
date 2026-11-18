import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// Record card settings (owner decision C311 on the levels of C298;
// sf-view-properties 1.19.0, sf-view 1.20.0; simai.property-view-port 1.19.0
// in ui-source round/property-view-port-1.19). The browser probe is in
// ui-control control/evidence/2026-11-18-record-card-settings/probe/.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));
const card = read('src/smart/view-properties/index.js');
const template = read('src/smart/view-properties/js/templates/default.js');
const head = read('src/smart/view/js/head.js');
const view = read('src/smart/view/index.js');

test('own edits go to the personal layer at once; «for everyone» is view.publish (RC-1)', () => {
  assert.match(card, /_layerOfProfile\(\) \{\n\s+if \(this\.editableLayers\.includes\("personal"\)\) return "personal";/u);
  assert.match(card, /this\._raise\("view\.publish", \{/u);
  assert.match(card, /personal_revision: this\._layerRevision\("personal"\),\n\s+shared_revision: this\._layerRevision\("shared"\),/u);
});

test('locks and a required profile (RC-2); reset is personal only and «Сохранить как моё» (RC-3)', () => {
  assert.match(card, /this\._raise\("view\.lock", \{/u);
  assert.match(card, /get viewRequired\(\) \{/u);
  assert.match(card, /if \(this\.viewRequired\) \{\n\s+this\.requiredEdits = true;/u);
  assert.match(card, /const kind = this\.editableLayers\.includes\("personal"\) \? "personal" : this\.viewTarget;/u);
  assert.match(card, /saveAsMine\(\) \{/u);
  assert.match(template, /\?resettable=\$\{!required && writable\.includes\('personal'\)\}/u);
});

test('one place for the card arrangement: the list head opens the card mode (RC-4)', () => {
  assert.match(head, /if \(id === "record-fields"\) return this\.view\.openRecordSettings\?\.\(\);/u);
  assert.doesNotMatch(head, /entity\.fields\.save/u);
  assert.doesNotMatch(head, /data-sf-role="head-record"/u);
  assert.match(view, /async openRecordSettings\(\) \{/u);
});

test('the profile in the picker only (RC-6); one way to hide (RC-7); no template per view (RC-9)', () => {
  assert.match(card, /id: "view-profile-picker"/u);
  assert.match(template, /data-action=\$\{off \? 'show-field' : 'remove-field'\}/u);
  assert.doesNotMatch(template, /data-action="variant"/u);
  assert.match(card, /const allowed = \["width", "hint", "label"\];/u);
  assert.match(read('src/smart/view-properties/lang/ru.json'), /"unplaced-title": "Скрытые поля"/u);
});

test('the head line: the stage badge and up to two fields (RC-8)', () => {
  assert.match(template, /function renderHeadLine\(context\) \{/u);
  assert.match(template, /<sf-badge size="1\/2" appearance="tonal" scheme=\$\{line\.status\.scheme\}/u);
  assert.match(card, /toggleHeadSubtitle\(fieldKey\) \{/u);
  assert.match(card, /\.slice\(-2\);/u);
});

test('the foot: Готово, Сохранить для всех, Отменить; the picker over the fields (RC-10)', () => {
  const bar = template.slice(template.indexOf('function renderConfigureBar(context) {'), template.indexOf('// Width, template variant and hint'));
  const order = ['data-action="done-configuring"', 'data-action="publish-view"', 'data-action="cancel-configuring"'].map((mark) => bar.indexOf(mark));
  assert.ok(order.every((at) => at > 0) && order[0] < order[1] && order[1] < order[2], `foot order ${order}`);
  // Over the fields: first in the body beside a column of tabs, and before
  // «Вкладки» where they stand over the fields (a narrow card, tabs).
  assert.match(template, /\$\{sectionsStacked\(context\) \? nothing : renderConfigureTop\(context\)\}\n\s+\$\{renderSectionBar\(context, current, sections\.length\)\}/u);
  assert.match(template, /\$\{sectionsStacked\(context\) \? renderConfigureTop\(context\) : nothing\}\n\s+\$\{\(sidebarDrawn\(context\) && !railOutside\) \|\| sectionsStacked\(context\) \? renderSectionList/u);
});

test('tabs: a list with handles and a «⋯» each; a new tab has «Поля»; a field to another tab (TB-1)', () => {
  assert.match(template, /data-action="tab-menu"/u);
  for (const id of ['tab-rename', 'tab-icon', 'tab-up', 'tab-down', 'tab-hide', 'tab-delete', 'tab-lock']) assert.match(card, new RegExp(`id: "${id}"`, 'u'));
  assert.match(card, /const fieldsTitle = pageText\(PROPERTY_VIEW_TEXT, "newTabGroupTitle", this\);/u);
  assert.match(card, /id: `to-tab:\$\{String\(section\.key\)\}`/u);
});

test('port 1.19.0 is accepted; the new intents only for a 1.19.0 host', () => {
  assert.match(card, /const SUPPORTED_PORT_VERSIONS = \[[^\]]*"1\.18\.0", "1\.19\.0"\];/u);
  assert.ok(json('src/smart/view-properties/smart.manifest.json').composition.declarative.host_port.supported_versions.includes('1.19.0'));
  assert.match(card, /return this\.editableLayers\.includes\("shared"\) && this\.hostSpeaksCardSettings;/u);
  assert.equal(json('src/smart/view-properties/component.json').version, '1.19.0');
  assert.equal(json('src/smart/view/component.json').version, '1.20.0');
});
