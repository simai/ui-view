// simai.view-config/1 (contracts/view-config/): the examples hold to the schema,
// and the schema, the contract text and the view agree on the numbers both sides
// agreed (per_lane 20/100, 200 lanes, 20 views per level, 8 KB, page size 20).
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {join, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// The suite runs in the overlay; SET_ROOT is the set's package folder.
const setRoot = process.env.SET_ROOT ?? resolve(fileURLToPath(new URL('../', import.meta.url)));
const folder = join(setRoot, '..', 'contracts', 'view-config');
const schema = JSON.parse(readFileSync(join(folder, 'view-config-1.schema.json'), 'utf8'));
const text = readFileSync(join(folder, 'view-config-1.md'), 'utf8');
const example = (name) => JSON.parse(readFileSync(join(folder, 'examples', name), 'utf8'));

// The part of JSON Schema the contract uses: $ref, type, const, enum, required,
// properties, additionalProperties, items, maxItems, pattern, lengths, bounds.
function check(value, rule, path = '$', problems = []) {
  if (rule.$ref) return check(value, rule.$ref.split('/').slice(1).reduce((node, key) => node[key], schema), path, problems);
  const type = Array.isArray(value) ? 'array' : value === null ? 'null' : Number.isInteger(value) ? 'integer' : typeof value;
  if (rule.type && !(rule.type === type || (rule.type === 'number' && type === 'integer'))) return problems.push(`${path}: ${type}, not ${rule.type}`), problems;
  if ('const' in rule && value !== rule.const) problems.push(`${path}: not ${rule.const}`);
  if (rule.enum && !rule.enum.includes(value)) problems.push(`${path}: ${JSON.stringify(value)} not in ${rule.enum}`);
  if (typeof value === 'string') {
    if (rule.pattern && !new RegExp(rule.pattern, 'u').test(value)) problems.push(`${path}: does not match ${rule.pattern}`);
    if (rule.minLength != null && value.length < rule.minLength) problems.push(`${path}: shorter than ${rule.minLength}`);
    if (rule.maxLength != null && value.length > rule.maxLength) problems.push(`${path}: longer than ${rule.maxLength}`);
  }
  if (typeof value === 'number') {
    if (rule.minimum != null && value < rule.minimum) problems.push(`${path}: below ${rule.minimum}`);
    if (rule.maximum != null && value > rule.maximum) problems.push(`${path}: above ${rule.maximum}`);
  }
  if (Array.isArray(value)) {
    if (rule.maxItems != null && value.length > rule.maxItems) problems.push(`${path}: more than ${rule.maxItems} items`);
    if (rule.items) value.forEach((item, at) => check(item, rule.items, `${path}[${at}]`, problems));
  }
  if (type === 'object') {
    for (const key of rule.required ?? []) if (!(key in value)) problems.push(`${path}: no ${key}`);
    for (const [key, item] of Object.entries(value)) {
      const own = rule.properties?.[key];
      if (own) check(item, own, `${path}.${key}`, problems);
      else if (rule.additionalProperties === false) problems.push(`${path}: unknown ${key}`);
      else if (rule.additionalProperties && typeof rule.additionalProperties === 'object') check(item, rule.additionalProperties, `${path}.${key}`, problems);
    }
  }
  return problems;
}
const def = (name) => ({$ref: `#/$defs/${name}`});

test('the example view holds to the schema and fits the size limit', () => {
  const view = example('orders-in-progress.view.json');
  assert.deepEqual(check(view, schema), []);
  assert.ok(Buffer.byteLength(JSON.stringify(view), 'utf8') <= schema['x-limits'].view_bytes);
});

test('the schema refuses what the contract refuses', () => {
  const view = example('orders-in-progress.view.json');
  const without = ({search, ...query}) => query;
  assert.notDeepEqual(check({...view, query: {...view.query, search: 'Ромашка'}}, schema), [], 'the search text is never saved');
  assert.notDeepEqual(check({...view, query: {...view.query, per_page: 25}}, schema), [], 'page sizes are 10/20/50/100');
  assert.notDeepEqual(check({...view, scope: 'team'}, schema), [], 'scopes are reserved, not part of version 1');
  assert.notDeepEqual(check({...view, layouts: {board: {per_lane: 101}}}, schema), [], 'per_lane at most 100');
  assert.notDeepEqual(check({...view, schema: 'simai.view-config/2'}, schema), []);
  assert.deepEqual(check({...view, query: without(view.query)}, schema), []);
});

test('the board window and answer hold to the schema and its limits', () => {
  assert.deepEqual(check(example('orders-board.window.json'), def('board-window')), []);
  const answer = example('orders-board.answer.json');
  assert.deepEqual(check(answer, def('board-answer')), []);
  const lane = {value: 'x', total: 0, records: []};
  assert.notDeepEqual(check({lanes: Array.from({length: 201}, () => lane)}, def('board-answer')), [], 'at most 200 lanes');
  assert.notDeepEqual(check({lanes: [{...lane, records: Array.from({length: 101}, (_, id) => ({id: String(id)}))}]}, def('board-answer')), [], 'a lane at most per_lane 100');
  assert.notDeepEqual(check({lanes: [{value: 'x', records: []}]}, def('board-answer')), [], 'a lane carries its total');
});

test('the limits agree: schema, describe() example, contract text, the view', () => {
  const limits = schema['x-limits'];
  assert.deepEqual(limits, {views_per_level: 20, view_bytes: 8192, per_lane_default: 20, per_lane_max: 100, lanes_max: 200, per_page_default: 20, per_page: [10, 20, 50, 100]});
  const {per_page_default: _d, per_page: _p, ...reported} = limits;
  assert.deepEqual(example('describe.limits.json').limits, reported);
  for (const line of ['views per list per level | **20**', '**8 KB** (8192 bytes)', '`per_lane` | default 20, max 100', 'lanes in one answer | 200', 'opens at **20**'])
    assert.ok(text.includes(line), `the contract says ${line}`);
  const view = readFileSync(join(setRoot, 'src/smart/view/index.js'), 'utf8');
  assert.match(view, /per_lane: options\.per_lane \?\? 20\b/u);
  assert.match(view, /const VIEW_DEFAULT_PAGE_SIZE = 20;/u);
  assert.match(view, /const VIEW_PAGE_SIZES = "10,20,50,100";/u);
});

test('the words: представление, never шаблон', () => {
  assert.deepEqual(schema['x-words'], {view: 'представление', save: 'Сохранить представление', 'save-own': 'Сохранить как моё', never: ['шаблон']});
  assert.deepEqual(schema['x-levels'], ['system', 'shared', 'profile', 'personal']);
  assert.deepEqual(schema['x-level-aliases'], {package: {of: 'system', until: '2027-01-01'}});
  for (const word of ['«Сохранить представление»', '«Сохранить как моё»', 'never calls it\n«шаблон»']) assert.ok(text.includes(word), word);
});

test('every file of the folder is read by this test', () => {
  assert.deepEqual(readdirSync(join(folder, 'examples')).sort(), ['describe.limits.json', 'orders-board.answer.json', 'orders-board.window.json', 'orders-in-progress.view.json']);
});
