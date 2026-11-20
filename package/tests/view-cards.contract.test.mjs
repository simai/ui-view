import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {CARD_FIELDS_MAX, PER_PAGE, cardsOptions, coverOf, fieldAlign, fileIcon, gridStep, isImageField, phoneColumns, titleOf} from '../src/smart/view-cards/js/cards.js';

// sf-view-cards (owner decisions C297, C306; CD-1..CD-8 of the view-cards
// order): the options, the cover, the keys and the sf-view wiring.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

const fields = [
  {key: 'title', label: 'Название', title: true},
  {key: 'photo', label: 'Фото', propertyType: 'file', variant: 'image'},
  {key: 'sku'}, {key: 'category'}, {key: 'price', propertyType: 'money'}, {key: 'stock', propertyType: 'number'}, {key: 'note'},
];

test('CD-2: options read with their defaults', () => {
  const options = cardsOptions({}, fields);
  assert.equal(options.coverField, 'photo', 'the first image field is the cover');
  assert.deepEqual(options.cover, {fit: 'cover', ratio: '4:3'});
  assert.equal(options.titleField, 'title');
  assert.deepEqual(options.cardFields, ['sku', 'category', 'price', 'stock']);
  assert.equal(options.cardFields.length, CARD_FIELDS_MAX);
  assert.equal(options.size, 'm');
  assert.equal(options.density, 'default');
  assert.equal(options.more, 'button');
  assert.equal(options.perPage, PER_PAGE);
  assert.equal(PER_PAGE, 24);
  assert.equal(options.cardLabels, false);
});

test('CD-2: written options; cover none; an unknown card field is dropped', () => {
  const options = cardsOptions({cover_field: null, cover: {fit: 'contain', ratio: '16:9'}, card_fields: ['note', 'gone', 'price'], size: 'l', density: 'compact', card_labels: true, more: 'pages'}, fields);
  assert.equal(options.coverField, null);
  assert.deepEqual(options.cover, {fit: 'contain', ratio: '16:9'});
  assert.deepEqual(options.cardFields, ['note', 'price']);
  assert.equal(options.size, 'l');
  assert.equal(options.density, 'compact');
  assert.equal(options.cardLabels, true);
  assert.equal(options.more, 'button', 'only «Показать ещё» is drawn (C306)');
  assert.equal(cardsOptions({}, [{key: 'title'}, {key: 'file', propertyType: 'file'}]).coverField, null, 'a plain file field is no cover');
  assert.equal(cardsOptions({cover: {fit: 'natural', ratio: '2:1'}, size: 'xl'}, fields).cover.fit, 'cover');
  assert.equal(cardsOptions({size: 'xl'}, fields).size, 'm');
});

test('CD-3: the cover of a record', () => {
  assert.equal(isImageField(fields[1]), true);
  assert.deepEqual(coverOf({label: 'a.jpg', mime: 'image/jpeg', href: '/a.jpg', width: 800, height: 600}), {src: '/a.jpg', width: 800, height: 600});
  assert.equal(coverOf({mime: 'image/png', href: '/big.png', thumb: {240: '/s.png', 480: '/m.png', 960: '/l.png'}}).src, '/m.png', 'the thumbnail of the frame width');
  assert.equal(coverOf([{label: 'doc.pdf', mime: 'application/pdf'}, {href: '/p.webp'}]).src, '/p.webp', 'a list takes its first picture');
  assert.deepEqual(coverOf({label: 'doc.pdf', mime: 'application/pdf'}), {icon: 'picture_as_pdf'});
  assert.equal(coverOf(null), null);
  assert.equal(fileIcon('', 'table.xlsx'), 'table_chart');
});

test('CD-5: a phone draws S in two columns, M and L in one', () => {
  assert.equal(phoneColumns('s'), 2);
  assert.equal(phoneColumns('m'), 1);
  assert.equal(phoneColumns('l'), 1);
  const css = read('src/smart/view-cards/js/templates/default.css');
  assert.match(css, /--sf-view-cards-min: var\(--sf-measure-36, var\(--sf-f8\)\)/u);
  assert.match(css, /\[data-card-size="s"\] \{ --sf-view-cards-min: var\(--sf-measure-28, var\(--sf-f4\)\); \}/u);
  assert.match(css, /\[data-card-size="l"\] \{ --sf-view-cards-min: var\(--sf-measure-44, var\(--sf-g1\)\); \}/u);
  assert.doesNotMatch(css.replace(/@container \(max-width: 599\.98px\)/gu, ''), /\d+px/u, 'no raw px but the phone breakpoint');
});

test('R8-1: the least card width is a width ladder step and no card field is cut', () => {
  const css = read('src/smart/view-cards/js/templates/default.css');
  const minimums = [...css.matchAll(/--sf-view-cards-min: ([^;]+);/gu)].map(([, value]) => value);
  assert.equal(minimums.length, 3);
  for (const value of minimums) assert.match(value, /^var\(--sf-measure-(28|36|44), var\(--sf-(f4|f8|g1)\)\)$/u, `${value}: a C396 step over its base step`);
  const rule = (selector) => css.match(new RegExp(`\\n  ${selector.replace(/[.[\]]/gu, '\\$&')}(?:,\\n  [^{]+)? \\{([^}]*)\\}`, 'u'))?.[1] ?? '';
  for (const selector of ['.sf-view-cards__field', '.sf-view-cards__values', '.sf-view-cards__label']) {
    const body = rule(selector);
    assert.notEqual(body, '', `${selector} has a rule`);
    assert.doesNotMatch(body, /nowrap|ellipsis|overflow: hidden/u, `${selector} never cuts its value`);
  }
  assert.match(rule('.sf-view-cards__fields'), /grid-template-columns: minmax\(min-content, 1fr\) auto;/u, 'a column never below its content');
  assert.match(css, /\[data-card-size="s"\] \.sf-view-cards__fields \{ grid-template-columns: minmax\(min-content, 1fr\); \}/u, 'phone S: one field column');
});

test('CD-6: the arrows go by the rows as drawn', () => {
  const grid = {count: 10, columns: 4};
  assert.equal(gridStep('ArrowRight', 0, grid), 1);
  assert.equal(gridStep('ArrowDown', 1, grid), 5);
  assert.equal(gridStep('ArrowUp', 1, grid), 1, 'the first row stays');
  assert.equal(gridStep('End', 5, grid), 7);
  assert.equal(gridStep('Home', 6, grid), 4);
  assert.equal(gridStep('End', 0, {...grid, ctrl: true}), 9);
  assert.equal(gridStep('ArrowRight', 1, {...grid, rtl: true}), 0);
  assert.equal(gridStep('Tab', 1, grid), null);
  assert.equal(fieldAlign({propertyType: 'money'}), 'end');
  assert.equal(fieldAlign({propertyType: 'string'}), 'start');
  assert.equal(titleOf({id: 1, name: {label: 'Кружка'}}, 'name'), 'Кружка');
});

test('CD-1: sf-view registers cards and wires it at its hook points', () => {
  const view = read('src/smart/view/index.js');
  assert.match(view, /\["board", "sf-view-board"\], \["cards", "sf-view-cards"\], \["calendar", "sf-view-calendar"\]\]/u);
  assert.match(view, /\.\.\.CARDS_EVENTS/u);
  for (const hook of ['cardsQuery(this, query)', 'acceptCards(this, data)', 'syncCards(this)', 'onCardsEvent(this, event)', 'cardsSkeleton(this, bar)', 'syncCardsState(this, state)']) {
    assert.ok(view.includes(hook), hook);
  }
  const wiring = read('src/smart/view/js/cards.js');
  assert.match(wiring, /window = \{page: .*per_page: perPage\}/u);
  assert.match(wiring, /changeQuery\(\{page: \(Number\(view\.query\.page\) \|\| 1\) \+ 1\}, "show-more"\)/u);
  assert.match(wiring, /view\._openRecord\(/u);
});

test('the set lists sf-view-cards as a preview component', () => {
  // set.json is beside the overlay: SET_ROOT (scripts/test.mjs) names the package.
  const set = JSON.parse(readFileSync(resolve(process.env.SET_ROOT ?? root, 'set.json'), 'utf8'));
  const entry = set.components.find((component) => component.element === 'sf-view-cards');
  assert.equal(entry?.folder, 'view-cards');
  assert.equal(entry?.status, 'preview');
  const manifest = JSON.parse(read('src/smart/view-cards/component.json'));
  assert.equal(manifest.tag, 'sf-view-cards');
  for (const name of ['open', 'select', 'more', 'apply']) assert.ok(manifest.events[name], name);
});
