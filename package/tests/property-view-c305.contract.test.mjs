import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {HISTORY_KINDS, HISTORY_PAGE_MAX, cellText, historyFromRevisions} from '../src/smart/view-properties/js/history-port.js';

// sf-view-properties 1.18.0: the record card by owner decision C305 (on top of
// C289), RC-1..RC-7. The geometry and the flows are measured on the built bytes
// by ui-control control/evidence/2026-11-18-view-r2-card (probe/measure.mjs).
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const manifest = JSON.parse(read('src/smart/view-properties/component.json'));
const source = read('src/smart/view-properties/index.js');
const template = read('src/smart/view-properties/js/templates/default.js');
const css = read('src/smart/view-properties/js/templates/default.css');
const ru = JSON.parse(read('src/smart/view-properties/lang/ru.json')).runtime;
const en = JSON.parse(read('src/smart/view-properties/lang/en.json')).runtime;

test('RC-1, RC-3: edit and history settings', () => {
  assert.deepEqual(manifest.settings.edit.values, ['group', 'group+quick', 'none']);
  assert.equal(manifest.settings.edit.default, 'group+quick');
  assert.deepEqual(manifest.settings.history.values, ['auto', 'off']);
  assert.equal(manifest.settings.history.default, 'auto');
});

test('RC-6: events, actions and keys', () => {
  assert.deepEqual(manifest.events.step.carries.direction.values, ['next', 'previous']);
  assert.equal(manifest.events.step.cancelable, true);
  assert.ok(manifest.events.history);
  for (const action of ['open-history', 'edit-field', 'step', 'edit-group']) assert.ok(manifest.actions[action], action);
  assert.equal(manifest.keyboard.host['Alt+ArrowDown'], 'step:next');
  assert.equal(manifest.keyboard.host['Alt+ArrowUp'], 'step:previous');
  for (const method of ['openHistory(', 'editField(', 'step(', 'editGroup(']) assert.ok(source.includes(method), method);
});

test('RC-6: seven public variables, the old names kept until 2027-01-01', () => {
  const names = Object.keys(manifest['css-variables']).filter((name) => name.startsWith('--sf-view-properties-'));
  assert.deepEqual(names.sort(), [
    '--sf-view-properties-current-background-color', '--sf-view-properties-group-gap', '--sf-view-properties-label-width',
    '--sf-view-properties-row-gap', '--sf-view-properties-saved-background-color', '--sf-view-properties-side-width',
    '--sf-view-properties-sections-width'].sort());
  for (const name of names) assert.ok(css.includes(`var(${name}`) || source.includes(`var(${name}`), name);
  assert.match(JSON.stringify(manifest['css-variables']), /2027-01-01/u);
});

test('C282: every new word in both language files', () => {
  for (const key of ['edit-all-text', 'history-text', 'history-fields-text', 'history-all-text', 'history-empty-text',
    'history-failed-text', 'history-changed-one-text', 'history-changed-many-text', 'close-unsaved-text',
    'close-unsaved-accept-text', 'leave-unsaved-text']) {
    assert.ok(ru[key], `ru ${key}`);
    assert.ok(en[key], `en ${key}`);
  }
  assert.equal(ru['history-text'], 'История изменений');
});

test('RC-4: the section column stays sf-menu until sf-tabs vertical places its box (VP-26)', () => {
  assert.match(source, /placeBox/u);
  assert.match(template, /sectionColumnTabs/u);
});

test('VP-29: the quick window never draws before sf-popover is defined', () => {
  assert.match(css, /\.sf-property-view-quick:not\(\[data-open="true"\]\) > \[slot="content"\] \{\s*display: none;/u);
});

test('Framework parts by their released tags only: no import of an unreleased module', () => {
  assert.doesNotMatch(source, /from ["'][^"']*(type-templates|field-templates)/u);
});

// RC-3: the Larena-shaped adapter. A stored revision is a full snapshot.
const fields = [{key: 'title', label: 'Название'}, {key: 'stage', label: 'Стадия'}, {key: 'sum', label: 'Сумма'}];
const revisions = [
  {revision: 1, operation: 'create', created_by: 'Сайт', created_at: '2026-11-03T11:00:00+03:00', values: {title: 'A', stage: 'new', sum: 1}},
  {revision: 2, operation: 'update', created_by: 'Анна', created_at: '2026-11-04T11:00:00+03:00', values: {title: 'A', stage: 'talk', sum: 1}},
  {revision: 3, operation: 'update', created_by: 'Анна', created_at: '2026-11-05T11:00:00+03:00', values: {title: 'A', stage: 'talk', sum: 1}},
  {revision: 4, operation: 'publish', created_by: 'Илья', created_at: '2026-11-06T11:00:00+03:00', values: {title: 'A', stage: 'talk', sum: 1}},
  {revision: 5, operation: 'update', created_by: 'Илья', created_at: '2026-11-07T11:00:00+03:00', values: {title: 'B', stage: 'won', sum: 2}},
];

test('historyFromRevisions: newest first, a difference of neighbours, empty updates skipped', () => {
  const page = historyFromRevisions(revisions, {fields, limit: 20});
  assert.equal(page.answer, 'applied');
  assert.deepEqual(page.events.map((event) => event.id), ['revision-5', 'revision-4', 'revision-2', 'revision-1']);
  assert.deepEqual(page.events[0].changes.map((change) => change.field), ['title', 'stage', 'sum']);
  assert.deepEqual(page.events[0].changes[1], {field: 'stage', label: 'Стадия', before: 'talk', after: 'won'});
  assert.equal(page.events[1].kind, 'publish');
  assert.deepEqual(page.events[1].changes, []);
  assert.equal(page.has_more, false);
  assert.equal(page.cursor, null);
  assert.ok(HISTORY_KINDS.includes('restore'));
});

test('historyFromRevisions: pages by the cursor and narrows by kinds', () => {
  const first = historyFromRevisions(revisions, {fields, limit: 2});
  assert.deepEqual(first.events.map((event) => event.id), ['revision-5', 'revision-4']);
  assert.equal(first.has_more, true);
  assert.equal(first.cursor, '4');
  const second = historyFromRevisions(revisions, {fields, limit: 2, cursor: first.cursor});
  assert.deepEqual(second.events.map((event) => event.id), ['revision-2', 'revision-1']);
  assert.equal(second.has_more, false);
  const updates = historyFromRevisions(revisions, {fields, kinds: ['update']});
  assert.ok(updates.events.every((event) => event.kind === 'update'));
});

test('cellText reads the compact template shapes', () => {
  assert.equal(cellText('418 000'), '418 000');
  assert.equal(cellText({component: {type: 'badge', props: {text: 'Переговоры'}}}), 'Переговоры');
  assert.equal(cellText([{component: {type: 'avatar', props: {text: 'АЗ', heading: 'Анна Захарова'}}}, 'Анна Захарова']), 'Анна Захарова');
  assert.equal(cellText({href: '/u/1', text: 'Анна'}), 'Анна');
  assert.equal(cellText(null), '');
});

test('historyFromRevisions: a sealed field is named without its values; a page is 50 at most', () => {
  const page = historyFromRevisions(revisions, {fields, sealed: ['sum']});
  assert.deepEqual(page.events[0].changes[2], {field: 'sum', label: 'Сумма', sealed: true});
  const many = Array.from({length: 80}, (_, at) => ({revision: at + 1, operation: 'update', created_by: 'A', created_at: '2026-11-01T10:00:00+03:00', values: {title: `t${at}`}}));
  assert.equal(HISTORY_PAGE_MAX, 50);
  assert.equal(historyFromRevisions(many, {fields, limit: 500}).events.length, 50);
});

test('Larena answers: revision_moved reads as a conflict; record.neighbours steps the panel', () => {
  assert.match(source, /answer\.reason === "revision_moved"\) return \{\.\.\.answer, answer: "conflict"\}/u);
  assert.match(source, /_raise\("record\.neighbours", \{record_id: this\.recordId, collection: this\.collection \|\| null\}\)/u);
  assert.ok(manifest.events.step.carries.next_record_id);
  assert.ok(ru['history-sealed-text'] && en['history-sealed-text']);
});
