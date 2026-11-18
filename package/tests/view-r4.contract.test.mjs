import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {calendarOptions, moveCheck, refusalWord, SPAN_DAYS, SPAN_DAYS_MAX} from '../src/smart/view-calendar/js/calendar.js';
import {cardsOptions, fieldAlign} from '../src/smart/view-cards/js/cards.js';

// View round 4 (round/view-r4): the dispatcher's merge of round/view-returns,
// round/view-cards and round/view-calendar; the layout switch over the four
// layouts, the view-config/1 keys of the Larena backend (msg-75b451e2), C311 (5)
// and the list head's filter window (C310). Evidence: ui-control
// control/evidence/2026-11-18-view-r4/.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));
const view = read('src/smart/view/index.js');
const head = read('src/smart/view/js/head.js');

test('every layout is in the registry and in the layout setting', () => {
  assert.match(view, /\["board", "sf-view-board"\], \["cards", "sf-view-cards"\], \["calendar", "sf-view-calendar"\]\]\)/u);
  for (const file of ['component.json', 'smart.manifest.json']) {
    const manifest = json(`src/smart/view/${file}`);
    const layout = file === 'component.json' ? manifest.settings.layout.values : manifest.inputs.properties.layout.enum;
    assert.deepEqual(layout, ['auto', 'table', 'list', 'board', 'cards', 'calendar'], file);
  }
});

test('the switch works over every layout and carries the marks', () => {
  const body = view.slice(view.indexOf('    switchLayout(kind, {refresh = true} = {}) {'), view.indexOf('    // The content element the layout draws with.'));
  assert.match(body, /const fromTag = this\._layoutTag\(\);/u);
  assert.match(body, /const marked = this\._layoutSelection\(\);/u);
  // The list's page size is kept over the cards and the calendar and given back with the table or the board.
  assert.match(view, /const OWN_PAGING = new Set\(\["sf-view-cards", "sf-view-calendar"\]\);/u);
  assert.match(body, /if \(OWN_PAGING\.has\(toTag\)\) this\._perPageOfList \?\?= \{value: this\.query\?\.per_page\};/u);
  assert.match(body, /else this\.query\.per_page = this\._perPageOfList\.value;\n\s+this\.query\.page = 1;/u);
  assert.match(body, /delete this\.query\.window;/u);
  for (const tag of ['sf-view-board', 'sf-view-cards', 'sf-view-calendar']) assert.ok(body.includes(`tag === "${tag}"`), tag);
  const swap = view.slice(view.indexOf('    _swapContent() {'), view.indexOf('    get board() {'));
  assert.match(swap, /const want = this\._layoutTag\(\);/u);
  assert.match(swap, /this\._askForParts\(\["sf-view-cards"\]\);/u);
  assert.match(swap, /this\._askForParts\(\["sf-view-calendar"\]\);/u);
  assert.match(swap, /element\.selected = ids\.filter\(\(id\) => shown\.has\(id\)\);/u);
  assert.match(view, /if \(this\.layoutKind === "cards" \|\| this\.layoutKind === "calendar"\) this\._applyCarriedSelection\(\);/u);
});

test('layouts.calendar.span_days: 31 by default, up to 366', () => {
  assert.equal(SPAN_DAYS, 31);
  assert.equal(SPAN_DAYS_MAX, 366);
  assert.equal(calendarOptions({}, []).spanDays, 31);
  assert.equal(calendarOptions({span_days: 90}, []).spanDays, 90);
  assert.equal(calendarOptions({span_days: 900}, []).spanDays, 366);
  assert.equal(calendarOptions({span_days: 0}, []).spanDays, 31);
  assert.equal(calendarOptions({span_days: '40'}, []).spanDays, 31);
});

test('layouts.cards.per_page: 24 by default, the host may give its own', () => {
  assert.equal(cardsOptions({}, []).perPage, 24);
  assert.equal(cardsOptions({per_page: 48}, []).perPage, 48);
});

test('calendar rules of view-config/1: past, weekdays (ISO days allowed), locked, ability', () => {
  const rules = calendarOptions({rules: [
    {code: 'past', reason: null},
    {code: 'weekdays', days: [1, 2, 3, 4, 5], reason: 'Только по будням'},
    {code: 'locked', field: 'status', in: ['sent'], reason: 'Заказ отправлен'},
    {code: 'ability', ability: 'orders.move', reason: null},
  ]}, []).rules;
  assert.equal(rules.length, 4);
  // 2026-11-21 is a Saturday, 2026-11-22 a Sunday, 2026-11-20 a Friday.
  assert.deepEqual(moveCheck({record: {}, day: '2026-11-21', rules, today: '2026-11-18'}), {ok: false, reason: 'Только по будням', code: 'weekday'});
  assert.equal(moveCheck({record: {}, day: '2026-11-22', rules, today: '2026-11-18'}).ok, false);
  assert.deepEqual(moveCheck({record: {}, day: '2026-11-20', rules, today: '2026-11-18'}), {ok: true});
  assert.deepEqual(moveCheck({record: {}, day: '2026-11-17', rules, today: '2026-11-18'}), {ok: false, reason: '', code: 'past'});
  assert.deepEqual(moveCheck({record: {status: 'sent'}, day: '2026-11-20', rules, today: '2026-11-18'}), {ok: false, reason: 'Заказ отправлен', code: 'locked'});
  assert.equal(moveCheck({record: {status: 'sent'}, day: null, rules}).code, 'locked');
  // ability is the host's: it answers per record in can.
  assert.deepEqual(moveCheck({record: {can: {update: false, code: 'storage_calendar_update_denied', reason: null}}, day: '2026-11-20', rules, today: '2026-11-18'}), {ok: false, reason: '', code: 'storage_calendar_update_denied'});
});

test('refusal codes are said in the pack words, in every language', () => {
  const codes = ['past', 'weekday', 'locked', 'denied', 'end_before_start', 'too_long', 'patch_invalid'];
  const en = json('src/smart/view-calendar/lang/en.json').runtime;
  const ru = json('src/smart/view-calendar/lang/ru.json').runtime;
  for (const code of codes) {
    const word = refusalWord(`storage_calendar_update_${code}`);
    assert.ok(word, code);
    assert.ok(en[word] && ru[word], word);
  }
  assert.equal(refusalWord('storage_record_revision_stale'), null);
  const calendar = read('src/smart/view-calendar/index.js');
  assert.match(calendar, /const saidIsCode = /u);
  assert.match(calendar, /const reason = this\.refusalText\(result\.message \|\| result\.reason \|\| "", result\.code \?\? result\.reason \?\? ""\);/u);
});

test('C311 (5): no views submenu; a person who cannot arrange chooses in a select-only picker', () => {
  const card = read('src/smart/view-properties/index.js');
  const template = read('src/smart/view-properties/js/templates/default.js');
  assert.doesNotMatch(card, /submenu: this\.viewProfileEntries\(\)/u);
  assert.doesNotMatch(card, /viewProfileEntries|openViewProfileMenu|namingView/u);
  assert.match(card, /if \(profiles\.length > 1 && !this\.configuring && this\.canConfigureView\) \{/u);
  const chooser = template.slice(template.indexOf('function renderViewChooser(context) {'), template.indexOf('function renderConfigureBar(context) {'));
  assert.match(chooser, /if \(context\.canConfigureView \|\| context\.configuring \|\| profiles\.length < 2\) return nothing;/u);
  assert.match(chooser, /editable: false/u);
  assert.match(chooser, /\.rights=\$\{\{create: \{personal: false, shared: false\}\}\}/u);
  assert.doesNotMatch(chooser, /resettable|sf-profile-picker-(create|rename|delete|reset)/u);
  assert.match(template, /\$\{renderViewChooser\(context\)\}\s*\$\{renderErrorSummary\(context\)\}/u);
  // On a phone the card opens on its tab list: the chooser stands above it there.
  assert.match(template, /\$\{onPhoneSectionList\(context, sections\) \? renderViewChooser\(context\) : nothing\}/u);
  assert.doesNotMatch(template, /function renderViewProfiles\(|function renderNewViewName\(/u);
});

test('C310: the list head opens the Framework filter window where the pair has it', () => {
  assert.match(head, /typeof api\?\.open === "function" && typeof api\?\.summary === "function" \? api : null/u);
  assert.match(head, /answer = await api\.open\(\{anchor, field: this\._windowField\(field\), value: copy\(this\.filters\[key\] \?\? \{\}\), size: this\.size\}\);/u);
  assert.match(head, /if \(!answer \|\| \(answer\.action !== "apply" && answer\.action !== "reset"\)\) return answer;/u);
  assert.match(head, /const answer = api\.summary\(this\._windowField\(field\), entry \?\? \{\}\);/u);
  // count only above 0; colour while active; words in the tooltip
  assert.match(head, /const count = Number\.isSafeInteger\(answer\.count\) && answer\.count > 0 \? answer\.count : 0;/u);
  assert.match(head, /scheme="\$\{active \? "primary" : "on-surface"\}"/u);
  assert.match(head, /const title = active && words \? `\$\{field\.label\}: \$\{words\}` : "";/u);
  // the window composition («Выбрано», footer) is not built here
  assert.doesNotMatch(head, /Выбрано:|Снять все/u);
});

test('VR3-1: a layout not in the running set is hidden in the head, not disabled', () => {
  assert.match(view, /if \(tag === "sf-view-table"\) return true;\n {8}return Boolean\(globalThis\.customElements\?\.get\?\.\(tag\) \|\| globalThis\.SF\?\.RuleLoader\?\.\[tag\.replace\(\/\^sf-\/u, "cl-"\)\]\);/u);
  assert.match(head, /asked\.filter\(\(kind\) => Object\.hasOwn\(KINDS, kind\) && this\.drawable\(kind\)\)/u);
  assert.doesNotMatch(head, /disabled: true/u);
});

test('VR3-2: menu separators are {type: "separator"}, as sf-menu-context reads them', () => {
  for (const file of ['src/smart/view/js/head.js', 'src/smart/view-table/index.js', 'src/smart/view/index.js', 'src/smart/view-properties/index.js', 'src/smart/view-board/index.js', 'src/smart/view-cards/index.js', 'src/smart/view-calendar/index.js']) {
    assert.doesNotMatch(read(file), /kind: "separator"/u, file);
  }
  assert.match(head, /entries\.push\(\{type: "separator"\}\)/u);
});

// DEV's acceptance of cards and calendar (ui-control control/evidence/2026-11-18-view-cards-cal-acceptance).
test('VCL-1: layouts.calendar mode wins over the property default when no attribute is written', () => {
  const calendar = read('src/smart/view-calendar/index.js');
  assert.match(calendar, /const asked = this\._mode \?\? \(this\.hasAttribute\?\.\("mode"\) \? this\.getProp\("mode"\) : null\) \?\? options\.mode \?\? "month";/u);
});

test('VCL-2: the range query never carries a null date field; it is asked again once the field is known', () => {
  const glue = read('src/smart/view/js/calendar.js');
  assert.match(glue, /\.\.\.\(dateField \? \{date_field: dateField\} : \{\}\)/u);
  assert.match(glue, /dated\(view\._head\?\.description\?\.fields\)/u);
  assert.match(glue, /if \(!query\.window\.date_field\) \{\s*delete query\.window\.date_field;\s*if \(query\.window\.range\) view\._calendarAskWithField = true;/u);
  assert.match(glue, /view\._calendarAskWithField && calendarOptionsOf\(view\)\.date_field/u);
});

test('VCL-3: «+N» is a text row at the event line height; a day is the number row and per_day lines', () => {
  const template = read('src/smart/view-calendar/js/templates/default.js');
  const sheet = read('src/smart/view-calendar/js/templates/default.css');
  assert.match(template, /<button type="button" class="sf-view-calendar__more" data-more=\$\{day\}/u);
  assert.doesNotMatch(template, /sf-view-calendar__more"><sf-button/u);
  assert.match(sheet, /\.sf-view-calendar__more \{[^}]*block-size: var\(--sf-text-height-1\\\/2\);/u);
  assert.match(sheet, /\+ var\(--sf-px\) \+ var\(--sf-view-calendar-control\)\s*\+ var\(--sf-view-calendar-per-day\) \* var\(--sf-text-height-1\\\/2\)/u);
});

test('VCL-4: a phone row is two lines, the second field at the end of the title line, long values end with an ellipsis', () => {
  const sheet = read('src/smart/view-calendar/js/templates/default.css');
  assert.match(sheet, /\[data-phone\] \.sf-view-calendar__row \{\s*grid-template-columns: var\(--sf-e4\) minmax\(0, 1fr\) auto;/u);
  assert.match(sheet, /__field ~ \.sf-view-calendar__field \{ grid-row: 1; grid-column: -2 \/ -1;/u);
  assert.match(sheet, /__field \{ grid-row: 2; grid-column: -3 \/ -1; display: block; overflow: hidden; text-overflow: ellipsis;/u);
});

test('VC-1: a number in the first «Кратко» column stays at its start; the second column ends numbers', () => {
  assert.equal(fieldAlign({propertyType: 'money'}, 0), 'start');
  assert.equal(fieldAlign({propertyType: 'money'}, 1), 'end');
  assert.equal(fieldAlign({propertyType: 'number'}, 2), 'start');
  assert.equal(fieldAlign({propertyType: 'string'}, 1), 'start');
  assert.match(read('src/smart/view-cards/js/templates/default.js'), /context\.cardFields\.map\(\(field, index\) => renderField\(context, field, record, index\)\)/u);
});
