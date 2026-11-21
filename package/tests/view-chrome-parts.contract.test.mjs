// Every part of the list head and footer can be switched off by the host
// (view round 13, DEV round 5 returns VR5-1, VR5-2, VR5-5, VR5-6; owner:
// everything in the list can be set or switched off from the backend or by
// a call). The words are chrome's: search, filter and look inside toolbar,
// page-size inside pagination. A chrome that names no part of a row keeps
// all of that row's parts, so a page written before draws what it drew.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../src/smart/view');
const view = readFileSync(resolve(root, 'index.js'), 'utf8');
const head = readFileSync(resolve(root, 'js/head.js'), 'utf8');
const css = readFileSync(resolve(root, 'js/head.css'), 'utf8');
// The suite runs in the overlay; SET_ROOT is the set's package folder.
const setRoot = process.env.SET_ROOT ?? resolve(import.meta.dirname, '..');
const schema = JSON.parse(readFileSync(resolve(setRoot, '..', 'contracts', 'view-config', 'view-config-1.schema.json'), 'utf8'));
const component = JSON.parse(readFileSync(resolve(root, 'component.json'), 'utf8'));

const constant = (name) => new Function(`return ${view.split(`const ${name} = `)[1].split(';\n')[0]};`)();
const CHROME_PARTS = constant('CHROME_PARTS');
const CHROME_WITHIN = constant('CHROME_WITHIN');
const method = (signature, end) => view.split(`    ${signature} {\n`)[1].split(end)[0].trim().replace(/\}\s*$/u, '');
const chromeBody = method('get chrome()', '\n\n');
const rendersBody = method('renders(part)', '\n\n');
const renders = new Function('CHROME_PARTS', 'CHROME_WITHIN', `return function (part) {${rendersBody}}`)(CHROME_PARTS, CHROME_WITHIN);
const chromeOf = new Function('CHROME_PARTS', `return function () {${chromeBody}}`)(CHROME_PARTS);

function list(chrome = null, headConfig = undefined) {
  const element = {
    getAttribute: (name) => (name === 'chrome' ? chrome : null),
    viewConfig: headConfig === undefined ? null : {head: headConfig},
  };
  Object.defineProperty(element, 'chrome', {get: chromeOf});
  element.renders = renders;
  return element;
}

test('the new words are parts of a row', () => {
  for (const word of ['search', 'filter', 'look', 'page-size']) assert.ok(CHROME_PARTS.includes(word), word);
  assert.deepEqual(CHROME_WITHIN, {search: 'toolbar', filter: 'toolbar', look: 'toolbar', 'page-size': 'pagination'});
});

test('no chrome, or a chrome that names no part, keeps every part', () => {
  for (const element of [list(), list('toolbar pagination select settings'), list('toolbar pagination')]) {
    for (const part of ['search', 'filter', 'look', 'page-size']) assert.equal(element.renders(part), true, part);
  }
});

test('naming one part of a row hides the others of that row only', () => {
  const element = list('toolbar search pagination');
  assert.equal(element.renders('search'), true);
  assert.equal(element.renders('filter'), false);
  assert.equal(element.renders('look'), false);
  assert.equal(element.renders('page-size'), true, 'the footer names none of its parts: kept');
  const footer = list('toolbar pagination page-size');
  assert.equal(footer.renders('page-size'), true);
  assert.equal(footer.renders('search'), true);
  assert.equal(list('toolbar filter look pagination').renders('search'), false);
});

test('a part goes with its row', () => {
  const element = list('pagination search');
  assert.equal(element.renders('toolbar'), false);
  assert.equal(element.renders('search'), false);
  assert.equal(list('toolbar').renders('page-size'), false);
});

test('head.chrome of the view document hides what chrome does', () => {
  const element = list(null, {chrome: ['search']});
  assert.equal(element.renders('search'), true);
  assert.equal(element.renders('filter'), false);
  assert.equal(element.renders('look'), false);
  assert.equal(element.renders('page-size'), true);
  assert.equal(list(null, {chrome: ['page-size', 'filter']}).renders('search'), false);
  assert.equal(list(null, {filter_fields: ['status']}).renders('search'), true);
});

test('the call: view.chrome, setChrome and look', () => {
  assert.match(view, /set chrome\(parts\) \{\s*if \(parts === null \|\| parts === undefined\) this\.removeAttribute\("chrome"\);/u);
  assert.match(view, /setChrome\(parts\) \{\s*this\.chrome = parts;/u);
  assert.match(view, /get look\(\) \{\s*const own = this\._look \?\? this\.viewConfig\?\.head\?\.look;/u);
});

test('the head hides each part and an emptied row, and «Фильтр» without fields', () => {
  assert.match(head, /get filterShown\(\) \{\s*return this\.view\.renders\("filter"\) && this\.fields\.length > 0;/u);
  assert.match(head, /set\(one\("\.sf-view-head-search"\), "hidden", this\.view\.renders\("search"\) \? null : ""\);/u);
  assert.match(head, /set\(one\("\[data-filter-group\]"\), "hidden", filterShown \? null : ""\);/u);
  assert.match(head, /set\(one\('sf-popover\[data-pop="view"\]'\), "hidden", lookShown \? null : ""\);/u);
  assert.match(head, /set\(row, "hidden", filled \? null : ""\);/u);
  assert.match(css, /\.sf-view-head-row\[hidden\],[\s\S]*?\{ display: none; \}/u);
  assert.match(view, /button\.hidden = pagination\.showPageSize === false \|\| !hasPages \|\| !this\.renders\("page-size"\);/u);
});

test('head.look draws only the rows it names', () => {
  assert.match(head, /const look = this\.view\.look;\s*const shows = \(key\) => !look \|\| look\.includes\(key\);/u);
  for (const key of ['columns', 'row_actions', 'density', 'single_line', 'paging', 'lane_field', 'card_fields', 'empty_lanes', 'size', 'date_field', 'color_field']) {
    assert.match(head, new RegExp(`only\\("${key}", `, 'u'), key);
  }
});

test('the view document and the manifest declare the keys', () => {
  const text = JSON.stringify(schema);
  assert.match(text, /"chrome":\{"type":"array","uniqueItems":true,"items":\{"type":"string","enum":\["search","filter","look","page-size"\]\}\}/u);
  assert.match(text, /"look":\{"type":"array"/u);
  assert.match(component.settings.chrome.summary, /`search`, `filter`[^]*`look`[^]*`page-size`/u);
});
