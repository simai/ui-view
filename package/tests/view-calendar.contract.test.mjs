import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {
  calendarOptions, rangeOf, stepPeriod, weekStartFor, readValue, writeValue, eventsOf, moveCheck, movePatch, toneOf,
  MODES, PER_DAY, SLOT, EVENT_FIELDS_MAX, RECORDS_MAX, MONTH_DAYS, PHONE_DAYS,
} from '../src/smart/view-calendar/js/calendar.js';

// sf-view-calendar (owner decision C307; study ui-control
// control/research/2026-11-18-calendar-view, section 5; CA-1..CA-10 of the
// view-calendar order): the options, the window, the values in zones, the move
// rules and the layout registry of sf-view.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));

const status = {key: 'status', type: 'status', options: [{value: 'new', label: 'Новый'}, {value: 'paid', label: 'Оплачен', status: 'success'}, {value: 'late', label: 'Просрочен', scheme: 'danger'}]};
const fields = [{key: 'title', title: true}, {key: 'start', type: 'datetime'}, {key: 'end', type: 'datetime'}, status, {key: 'client'}, {key: 'amount'}, {key: 'manager'}, {key: 'note'}];

test('CA-2: options with their defaults; no week start and no zone among them', () => {
  const options = calendarOptions({}, fields);
  assert.equal(options.dateField, 'start');
  assert.equal(options.endField, null);
  assert.equal(options.mode, 'month');
  assert.deepEqual(options.modes, [...MODES]);
  assert.deepEqual(MODES, ['month', 'week', 'day', 'list']);
  assert.equal(options.colorField, 'status');
  assert.equal(options.eventFields.length, EVENT_FIELDS_MAX);
  assert.equal(options.perDay, PER_DAY);
  assert.equal(PER_DAY, 3);
  assert.equal(options.slot, SLOT);
  assert.equal(SLOT, 30);
  assert.deepEqual(options.hours, [8 * 60, 20 * 60]);
  assert.equal(options.weekends, 'show');
  assert.equal(options.undated, 'button');
  assert.ok(!('weekStart' in options) && !('timeZone' in options) && !('zone' in options));
  const given = calendarOptions({date_field: 'start', end_field: 'end', modes: ['week', 'list'], mode: 'day', event_fields: ['client', 'amount', 'manager', 'note'], per_day: 2, hours: ['09:00', '18:00'], slot: 15, weekends: 'hide', undated: 'panel', color_field: null}, fields);
  assert.deepEqual(given.modes, ['week', 'list']);
  assert.equal(given.mode, 'week', 'a mode outside modes is the first offered');
  assert.deepEqual(given.eventFields, ['client', 'amount', 'manager']);
  assert.equal(given.colorField, null);
  assert.deepEqual(given.hours, [540, 1080]);
  assert.equal(given.slot, 15);
  assert.equal(given.undated, 'panel');
});

test('CA-3: the window is the days on screen, [from, to)', () => {
  const month = rangeOf('month', '2026-11-18', {weekStart: 1});
  assert.equal(month.from, '2026-10-26');
  assert.equal(month.to, '2026-12-07');
  assert.equal(month.all.length, MONTH_DAYS);
  const sunday = rangeOf('month', '2026-11-18', {weekStart: 0});
  assert.equal(sunday.from, '2026-11-01');
  assert.equal(rangeOf('week', '2026-11-18', {weekStart: 1}).from, '2026-11-16');
  const phone = rangeOf('week', '2026-11-18', {phone: true});
  assert.equal(phone.all.length, PHONE_DAYS);
  assert.equal(rangeOf('day', '2026-11-18').to, '2026-11-19');
  assert.equal(rangeOf('list', '2026-11-18').from, '2026-11-01');
  assert.equal(rangeOf('list', '2026-11-18').to, '2026-12-01');
  const hidden = rangeOf('week', '2026-11-18', {weekends: 'hide'});
  assert.equal(hidden.days.length, 5);
  assert.equal(hidden.all.length, 7, 'the window stays whole');
  assert.equal(stepPeriod('month', '2026-01-31', 1), '2026-02-28');
  assert.equal(stepPeriod('week', '2026-11-18', -1), '2026-11-11');
  assert.equal(RECORDS_MAX, 1000);
});

test('CA-2: the week start comes from the language when the request gives none', () => {
  assert.equal(weekStartFor('ru'), 1);
  assert.equal(weekStartFor('en-US'), 0);
});

test('values: a day, a source wall clock, an instant, each written back in its own form', () => {
  assert.deepEqual(readValue('2026-11-18'), {date: '2026-11-18', minutes: null, form: {kind: 'date'}});
  const instant = readValue('2026-11-18T07:00:00Z', {zone: 'Europe/Moscow'});
  assert.equal(instant.date, '2026-11-18');
  assert.equal(instant.minutes, 10 * 60);
  assert.equal(writeValue('2026-11-19', 11 * 60, instant.form, {zone: 'Europe/Moscow'}), '2026-11-19T08:00:00Z');
  const wall = readValue('2026-11-18T10:00', {zone: 'Europe/Moscow', sourceZone: 'Asia/Yekaterinburg'});
  assert.equal(wall.minutes, 8 * 60);
  assert.equal(wall.source.minutes, 10 * 60);
  assert.equal(writeValue('2026-11-18', 9 * 60, wall.form, {zone: 'Europe/Moscow', sourceZone: 'Asia/Yekaterinburg'}), '2026-11-18T11:00');
});

test('C140: an event takes its option colour role', () => {
  assert.equal(toneOf({status: 'success'}), 'success');
  assert.equal(toneOf({scheme: 'danger'}), 'error');
  assert.equal(toneOf({}), 'neutral');
  const options = calendarOptions({date_field: 'start', end_field: 'end'}, fields);
  const events = eventsOf([{id: 1, title: 'A', start: '2026-11-18T10:00', end: '2026-11-18T11:00', status: 'paid'}, {id: 2, title: 'B', start: null}], {options, fields, zone: 'UTC'});
  assert.equal(events.length, 1, 'an undated record is not an event of the days');
  assert.equal(events[0].tone, 'success');
});

test('CA-4: rules dim the days they refuse, with the reason; no right is a reason too', () => {
  const rules = [{code: 'past', reason: 'Прошедший день'}, {code: 'sunday', reason: 'В воскресенье не возим'}];
  assert.deepEqual(moveCheck({record: {}, day: '2026-11-17', rules, today: '2026-11-18'}), {ok: false, reason: 'Прошедший день', code: 'past'});
  assert.deepEqual(moveCheck({record: {}, day: '2026-11-22', rules, today: '2026-11-18'}), {ok: false, reason: 'В воскресенье не возим', code: 'sunday'});
  assert.deepEqual(moveCheck({record: {}, day: '2026-11-20', rules, today: '2026-11-18'}), {ok: true});
  assert.equal(moveCheck({record: {can: {update: false, reason: 'Отправлен'}}, day: '2026-11-20'}).reason, 'Отправлен');
});

test('CA-4: a move keeps the length; to no day clears both fields', () => {
  const options = calendarOptions({date_field: 'start', end_field: 'end'}, fields);
  const [event] = eventsOf([{id: 1, title: 'A', start: '2026-11-18T10:00', end: '2026-11-18T11:30'}], {options, fields, zone: 'UTC'});
  assert.deepEqual(movePatch(event, {day: '2026-11-20', options, zone: 'UTC'}), {start: '2026-11-20T10:00', end: '2026-11-20T11:30'});
  assert.deepEqual(movePatch(event, {day: '2026-11-20', minutes: 14 * 60, options, zone: 'UTC'}), {start: '2026-11-20T14:00', end: '2026-11-20T15:30'});
  assert.deepEqual(movePatch(event, {day: null, options, zone: 'UTC'}), {start: null, end: null});
});

test('CA-1: sf-view registers the calendar layout and draws it with no page row', () => {
  const view = read('src/smart/view/index.js');
  assert.match(view, /\["board", "sf-view-board"\], \["calendar", "sf-view-calendar"\]\]\)/u);
  assert.match(view, /\.\.\.CALENDAR_EVENTS,/u);
  assert.match(view, /if \(layout === "calendar"\) return calendarSkeleton\(\);/u);
  assert.match(view, /this\.layoutKind === "board" \|\| this\.layoutKind === "calendar" \|\| nothingToCount/u);
  assert.match(view, /if \(this\.layoutKind === "calendar"\) return calendarQuery\(this, query, extra\);/u);
  const adapter = read('src/smart/view/js/calendar.js');
  assert.match(adapter, /query\.window = \{\.\.\.window, \.\.\.\(extra \?\? \{\}\)\};\s*query\.context = contextOf\(view\);/u);
  assert.match(adapter, /window = \{undated: dateField, page: 1, per_page: UNDATED_PAGE\}/u);
  assert.match(adapter, /"record\.set", \{\s*record_id: detail\.id, key, value: detail\.patch\?\.\[key\] \?\? null, patch: copy\(detail\.patch \?\? \{\}\), revision: detail\.revision \?\? null,/u);
  assert.match(adapter, /calendar\.settleMove\(detail\.id,/u);
  assert.match(adapter, /view\._openRecord\(detail\.id,/u);
  assert.match(adapter, /"view\.create_record", \{item: null, values:/u);
});

test('C293: the list head offers no week start; the colour setting is color_field', () => {
  const head = read('src/smart/view/js/head.js');
  assert.doesNotMatch(head, /week_start/u);
  assert.match(head, /radios\("color_field",/u);
});

test('the calendar is declared and its words are in every language pack', () => {
  const component = json('src/smart/view-calendar/component.json');
  assert.equal(component.version, '1.0.0');
  const en = json('src/smart/view-calendar/lang/en.json');
  const ru = json('src/smart/view-calendar/lang/ru.json');
  const keys = (pack) => Object.keys(pack.runtime ?? pack).sort();
  assert.deepEqual(keys(en), keys(ru));
  // The passport sits beside the package (SET_ROOT under scripts/test.mjs, which runs in the overlay).
  const set = JSON.parse(readFileSync(resolve(process.env.SET_ROOT ?? root, 'set.json'), 'utf8'));
  assert.ok(set.components.some((entry) => entry.element === 'sf-view-calendar' && entry.rule === 'cl-view-calendar'));
});

test('no raw lengths in the calendar sheet', () => {
  const css = read('src/smart/view-calendar/js/templates/default.css');
  assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//gu, ''), /(?<![-\w])\d+(\.\d+)?(px|rem|em)\b/u);
});
