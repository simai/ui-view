import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {answerValues, groupsOf, isEmptyValue, missingRequired, readSettle, shownFields, valuesOnScreen}
  from '../src/smart/view-property-block/js/answer.js';

// sf-view-property-block (ui-view docs/design/sf-view-property-block.md):
// properties as a block in a flow. Its answer logic is plain functions; its
// drawing is the record component's field value and the Framework's confirm
// surface, which the source fences below hold it to (nothing copied).
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));

const TRIP = [
  {key: 'city', label: 'Город', propertyType: 'string', required: true, value: null},
  {key: 'from', label: 'Выезд', propertyType: 'date', required: true, value: null},
  {key: 'nights', label: 'Ночей', propertyType: 'integer', value: 2},
  {key: 'office', label: 'Офис', propertyType: 'string', readonly: true, value: 'Москва'},
  {key: 'hotel', label: 'Гостиница', propertyType: 'string', value: null,
    when: {visible: {field: 'nights', op: 'ne', value: 0}, required: {field: 'nights', op: 'in', value: [5, 6, 7]}}},
];

test('flat fields are one group without a label; groups win; keyless entries are left out', () => {
  assert.deepEqual(groupsOf({fields: TRIP}).map(({key, label, collapsible}) => ({key, label, collapsible})),
    [{key: 'group-1', label: '', collapsible: false}]);
  assert.equal(groupsOf({fields: [...TRIP, {label: 'no key'}, null]})[0].fields.length, TRIP.length);
  const groups = groupsOf({fields: TRIP, groups: [
    {key: 'a', label: 'Главное', fields: TRIP.slice(0, 2)},
    {label: 'Ещё', collapsible: true, collapsed: true, fields: TRIP.slice(2)},
    {key: 'c', collapsible: true, collapsed: true, fields: []},
  ]});
  assert.deepEqual(groups.map(({key, collapsible, collapsed}) => ({key, collapsible, collapsed})), [
    {key: 'a', collapsible: false, collapsed: false},
    {key: 'group-2', collapsible: true, collapsed: true},
    // A group with no label has nothing to press: it is never collapsible.
    {key: 'c', collapsible: false, collapsed: false},
  ]);
});

test('a Send carries every shown, editable field: typed over given, empty as null, hidden and read-only left out', () => {
  const groups = groupsOf({fields: TRIP});
  const changed = new Map([['city', 'Казань'], ['nights', 0]]);
  // nights 0 hides the hotel; the office is read-only.
  assert.deepEqual(answerValues(groups, changed), {city: 'Казань', from: null, nights: 0});
  assert.deepEqual(answerValues(groups, new Map([['nights', 3]])), {city: null, from: null, nights: 3, hotel: null});
  assert.equal(valuesOnScreen(groups, changed).get('office'), 'Москва');
  assert.deepEqual(shownFields(groups[0].fields, valuesOnScreen(groups, changed)).map((field) => field.key), ['city', 'from', 'nights', 'office']);
});

test('required fields left empty, in the order drawn, with when.required read', () => {
  const groups = groupsOf({fields: TRIP});
  assert.deepEqual(missingRequired(groups), ['city', 'from']);
  assert.deepEqual(missingRequired(groups, new Map([['city', '  '], ['from', '2026-11-20']])), ['city']);
  assert.deepEqual(missingRequired(groups, new Map([['city', 'Казань'], ['from', '2026-11-20'], ['nights', 6]])), ['hotel']);
  assert.deepEqual(missingRequired(groups, new Map([['city', 'Казань'], ['from', '2026-11-20']])), []);
  for (const empty of [null, undefined, '', '  ', [], {value: null}, {value: ''}]) assert.equal(isEmptyValue(empty), true, JSON.stringify(empty));
  for (const full of [0, false, 'a', [1], {value: 'e-5', label: 'Ирина'}]) assert.equal(isEmptyValue(full), false, JSON.stringify(full));
});

test('the host answer is read in the record port words', () => {
  assert.deepEqual(readSettle({answer: 'applied'}), {state: 'accepted', errors: {}, message: '', values: null});
  assert.deepEqual(readSettle({answer: 'applied', values: {city: 'Казань'}}).values, {city: 'Казань'});
  assert.equal(readSettle({answer: 'applied'}, {accepted: false}).state, 'declined');
  assert.deepEqual(readSettle({answer: 'refused', reason: 'record_invalid', errors: {city: 'Укажите город.', bad: 5}, message: 'Проверьте поля'}),
    {state: 'open', errors: {city: 'Укажите город.'}, message: 'Проверьте поля', values: null});
  assert.equal(readSettle({answer: 'refused', reason: 'closed'}).state, 'expired');
  assert.equal(readSettle({answer: 'refused', reason: 'expired'}).state, 'expired');
  assert.equal(readSettle(null).state, 'open');
});

test('the block draws fields through the shared field value and answers through the confirm surface', () => {
  const view = read('src/smart/view-property-block/index.js');
  const template = read('src/smart/view-property-block/js/templates/default.js');
  const answer = read('src/smart/view-property-block/js/answer.js');
  assert.match(view, /import \{confirmSurface\} from "\.\.\/helpers\/confirm-surface\.js";/u);
  assert.match(template, /import \{renderFieldValue\} from "\.\.\/\.\.\/\.\.\/view-properties\/js\/field-value\.js";/u);
  assert.match(answer, /import \{fieldConditions\} from "\.\.\/\.\.\/view-properties\/js\/conditions\.js";/u);
  // No field code of its own: the renderers are reached only through the shared module.
  for (const source of [view, template, answer]) assert.doesNotMatch(source, /render(Edit|View|Cell)Field\(|field-renderers\/index/u);
  // sf-view-properties draws its values with the same function.
  assert.match(read('src/smart/view-properties/js/templates/default.js'), /import \{renderFieldValue\} from '\.\.\/field-value\.js';/u);
});

test('the rule and the component agree', () => {
  const sandbox = {SF: {RuleLoader: {}}};
  vm.runInContext(read('src/smart/view-property-block/rule.js'), vm.createContext(sandbox));
  const rule = sandbox.SF.RuleLoader['cl-view-property-block'];
  assert.deepEqual([...rule.tags], ['sf-view-property-block']);
  const names = [...rule.relation].map((relation) => relation.name);
  // What the template draws itself, and what the renderer set draws for a field.
  for (const name of ['cl-button', 'cl-icon', 'cl-help-mark', 'cl-input', 'cl-input-date', 'cl-dropdown', 'cl-badge']) assert.ok(names.includes(name), name);
  const component = json('src/smart/view-property-block/component.json');
  assert.equal(component.family, 'record');
  assert.deepEqual(component.settings.mode.values, ['view', 'edit'], 'the record component\'s mode, the two values a block has');
  assert.deepEqual(Object.keys(component.events).sort(), ['answer', 'expired', 'open']);
  for (const word of ['submit-text', 'cancel-text', 'block-label', 'accepted-text', 'declined-text', 'expired-text', 'until-text', 'required-text', 'invalid-text']) {
    for (const locale of ['en', 'ru']) assert.ok(json(`src/smart/view-property-block/lang/${locale}.json`).runtime[word], `${locale} ${word}`);
  }
});
