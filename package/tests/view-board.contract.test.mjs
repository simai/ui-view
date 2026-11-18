import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {
  boardOptions, orderLanes, moveCheck, laneCount, manualOrder, laneSums, format, layoutName, PER_LANE, CARD_FIELDS_MAX,
} from '../src/smart/view-board/js/board.js';

// sf-view-board (owner decisions C298, C304; BD-1..BD-10 of the view round 2
// board order): the options, the lane order, the move rules, the soft limits
// and the layout registry of sf-view.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

const status = {
  key: 'status', type: 'status',
  options: [{value: 'new', label: 'Новый'}, {value: 'paid', label: 'Оплачен', scheme: 'success'}, {value: 'sent', label: 'Отправлен'}],
};
const fields = [{key: 'title', title: true}, status, {key: 'client'}, {key: 'manager'}, {key: 'due'}, {key: 'amount'}, {key: 'note'}];

test('BD-3: options read with their defaults', () => {
  const options = boardOptions({}, fields);
  assert.equal(options.laneField, 'status');
  assert.deepEqual(options.cardFields, ['client', 'manager', 'due', 'amount']);
  assert.equal(options.cardFields.length, CARD_FIELDS_MAX);
  assert.equal(options.perLane, PER_LANE);
  assert.equal(options.order, 'sort');
  assert.equal(options.emptyLanes, 'show');
  assert.deepEqual(options.totals, ['count']);
  assert.equal(options.swimlaneField, null);
  const given = boardOptions({lane_field: 'manager', card_fields: ['manager', 'due'], limits: {paid: 4, bad: -1}, order: 'manual', per_lane: 10, swimlane_field: 'manager'}, fields);
  assert.equal(given.laneField, 'manager');
  assert.deepEqual(given.cardFields, ['due']);
  assert.deepEqual(given.limits, {paid: 4});
  assert.equal(given.perLane, 10);
  assert.equal(given.swimlaneField, 'manager', 'swimlane_field is kept, reserved (C304 (4))');
});

test('BD-3: lanes in the options order, then the field, then the answer; hidden and empty lanes', () => {
  const options = boardOptions({lanes: {order: ['sent'], hidden: ['new'], collapsed: ['paid']}, limits: {paid: 1}}, fields);
  const lanes = orderLanes({field: status, options, answered: [
    {value: 'paid', total: 3, records: [{id: 1}]}, {value: 'later', total: 0, records: []},
  ]});
  assert.deepEqual(lanes.map((lane) => lane.value), ['sent', 'paid', 'later']);
  const paid = lanes[1];
  assert.equal(paid.label, 'Оплачен');
  assert.equal(paid.scheme, 'success');
  assert.equal(paid.total, 3, 'the total is the host count under the filter, not the records shown');
  assert.equal(paid.collapsed, true);
  assert.equal(paid.limit, 1);
  const hide = boardOptions({empty_lanes: 'hide'}, fields);
  assert.deepEqual(orderLanes({field: status, options: hide, answered: [{value: 'paid', total: 2, records: []}]}).map((lane) => lane.value), ['paid']);
});

test('BD-5: a move the rules refuse says why; the same lane and an unruled lane pass', () => {
  const moves = {sent: {from: ['paid'], reason: 'Только из «Оплачен»'}, cancel: {allowed: false, reason: 'Нельзя'}};
  assert.deepEqual(moveCheck(moves, 'new', 'sent'), {ok: false, reason: 'Только из «Оплачен»'});
  assert.deepEqual(moveCheck(moves, 'paid', 'sent'), {ok: true});
  assert.deepEqual(moveCheck(moves, 'new', 'cancel'), {ok: false, reason: 'Нельзя'});
  assert.deepEqual(moveCheck(moves, 'new', 'new'), {ok: true});
  assert.deepEqual(moveCheck(null, 'new', 'paid'), {ok: true});
});

test('BD-7: a limit is soft -- «5 / 4» over, never a refusal', () => {
  assert.deepEqual(laneCount(5, 4), {text: '5 / 4', over: true});
  assert.deepEqual(laneCount(4, 4), {text: '4 / 4', over: false});
  assert.deepEqual(laneCount(7, null), {text: '7', over: false});
  assert.deepEqual(moveCheck({}, 'new', 'paid'), {ok: true});
});

test('BD-6: manual order only with an order field and no sort', () => {
  const manual = boardOptions({order: 'manual'}, fields);
  assert.equal(manualOrder(manual, 'position', false), true);
  assert.equal(manualOrder(manual, 'position', true), false);
  assert.equal(manualOrder(manual, '', false), false);
  assert.equal(manualOrder(boardOptions({}, fields), 'position', false), false);
});

test('BD-3: money sums per currency (C294) and words', () => {
  const sums = laneSums({amount: {RUB: '1500.5', USD: 20}}, 'ru');
  assert.equal(sums.length, 2);
  assert.match(sums[0], /1\s500,50\s₽/u);
  assert.deepEqual(laneSums({amount: {XXX1: 'n'}}, 'ru'), []);
  assert.equal(format('{title} — в «{lane}»', {title: 'A', lane: 'B'}), 'A — в «B»');
});

test('BD-1: kanban reads as board; sf-view registers the layout and warns once for an unknown one', () => {
  assert.equal(layoutName('kanban'), 'board');
  assert.equal(layoutName(' Board '), 'board');
  assert.equal(layoutName(''), null);
  const view = read('src/smart/view/index.js');
  assert.match(view, /\["board", "sf-view-board"\]/u);
  assert.match(view, /kanban: "board"/u);
  assert.match(view, /static registerLayout\(/u);
  assert.match(view, /console\.warn\(/u);
  const manifest = JSON.parse(read('src/smart/view-board/component.json'));
  assert.equal(manifest.tag, 'sf-view-board');
  assert.ok(manifest.events?.some?.((event) => event.name === 'move' && event.cancelable) ?? JSON.stringify(manifest.events).includes('move'));
});

test('BD-2: the first paint reserves the board, not a table', () => {
  const view = read('src/smart/view/index.js');
  const css = read('src/smart/view/js/first-paint.css');
  assert.match(view, /sf-data-view-skeleton-board/u);
  assert.match(css, /sf-data-view-skeleton-board/u);
});
