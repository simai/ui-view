#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Build output root is required: the directory holding core/, smart/, component/, utility/.
//
// sf-view-properties 1.17.0, C289 (10) (view round 1 C10, VF-16): the card
// asks the Loader for every tag it draws. A page that loads Core alone and
// places <sf-view-properties> -- no defines of its own, no defineFieldsOf, no
// bundle tags -- gets the whole card: the panel, its head and menu, the
// section tabs, the description list, and every field control of a group
// being edited (string, text, integer, number, money, percent, date,
// datetime, boolean, choice, choices, record, color). Measured through the
// real Loader, at 1440 and 390, inline and in a panel: after the record and
// after «Изменить» nothing in the view is an undefined sf- tag, and the
// console has no error.
import {createServer} from 'node:http';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {extname, join, resolve, sep} from 'node:path';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
const mounts = [
  ['/distr/core/', join(out, 'core', 'core')],
  ['/distr/rule/', join(out, 'core', 'rule')],
  ['/distr/component/', join(out, 'component', 'component')],
  ['/distr/utility/', join(out, 'utility', 'utility')],
  ['/distr/smart/', join(out, 'smart', 'smart')],
];
for (const [, path] of mounts) if (!existsSync(path)) throw new Error(`${path} not found: the build output root holds core/, component/, utility/, smart/`);
const TYPES = new Map([['.js', 'text/javascript'], ['.mjs', 'text/javascript'], ['.css', 'text/css'], ['.json', 'application/json'], ['.woff2', 'font/woff2'], ['.woff', 'font/woff'], ['.svg', 'image/svg+xml']]);
const ruleFile = join(out, 'smart', 'smart', 'rule.js');
const PACKAGE = existsSync(ruleFile) ? /registerPackage\(\s*["']([a-z][a-z0-9-]*)["']/u.exec(readFileSync(ruleFile, 'utf8'))?.[1] ?? 'view' : 'view';
const BOOT = {cacheVersion: 'loader-asks', pluginListVersion: 'loader-asks', preloader: {enabled: false}, packages: {[PACKAGE]: {base: '/distr/smart/'}}};

const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (path === '/inline' || path === '/panel') {
    response.writeHead(200, {'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store'});
    response.end(html(path === '/panel'));
    return;
  }
  let file = '';
  for (const [prefix, root] of mounts) {
    if (!path.startsWith(prefix)) continue;
    const one = resolve(root, path.slice(prefix.length));
    if (one.startsWith(root + sep) && existsSync(one) && !statSync(one).isDirectory()) { file = one; break; }
  }
  if (!file) { response.writeHead(404); response.end(); return; }
  const type = TYPES.get(extname(file)) ?? 'application/octet-stream';
  response.writeHead(200, {'content-type': /^(text|application\/json|image\/svg)/u.test(type) ? `${type}; charset=utf-8` : type, 'cache-control': 'no-store'});
  response.end(readFileSync(file));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;

const fields = [
  {key: 'title', label: 'Название', propertyType: 'string', value: 'Поставка кресел'},
  {key: 'note', label: 'Комментарий', propertyType: 'text', value: 'До 10 декабря'},
  {key: 'count', label: 'Позиций', propertyType: 'integer', value: 3},
  {key: 'weight', label: 'Вес', propertyType: 'number', unit: 'кг', value: 12.5},
  {key: 'sum', label: 'Сумма', propertyType: 'money', value: {amount: '418000.00', currency: 'RUB'}},
  {key: 'discount', label: 'Скидка', propertyType: 'percent', value: '5'},
  {key: 'close', label: 'Дата закрытия', propertyType: 'date', value: '2026-12-15'},
  {key: 'call', label: 'Звонок', propertyType: 'datetime', value: '2026-12-01T10:30:00+03:00'},
  {key: 'vip', label: 'Важный', propertyType: 'boolean', value: true},
  {key: 'stage', label: 'Стадия', propertyType: 'choice', options: [{value: 'a', label: 'Переговоры'}, {value: 'b', label: 'Договор'}], value: 'a'},
  {key: 'tags', label: 'Метки', propertyType: 'choices', options: [{value: 'x', label: 'Опт'}, {value: 'y', label: 'Срочно'}], value: ['x']},
  {key: 'company', label: 'Компания', propertyType: 'record', value: {id: 'c-1', label: 'ООО «Вектор»'}},
  {key: 'tone', label: 'Цвет', propertyType: 'color', value: '#3366ff'},
];
const record = {record_id: 'deal-15', collection: 'crm.deals', revision: '3', title: 'Сделка № 15', actions: ['record.edit', 'record.delete'],
  sections: [
    {key: 'main', label: 'Основное', groups: [{key: 'deal', label: 'Сделка', fields}]},
    {key: 'client', label: 'Клиент', groups: [{key: 'person', label: 'Контакт', fields: [{key: 'person', label: 'Контакт', propertyType: 'string', value: 'Иван Петров'}]}]},
  ]};

const html = (panel) => `<!doctype html><html lang="ru" class="theme-light"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>loader asks</title><link rel="icon" href="data:,">
<link rel="stylesheet" href="/distr/core/css/core.css">
<script>window.sfPath='/distr/';window.sfSmartPath='/distr/';window.SF_BOOT_CONFIG=${JSON.stringify(BOOT)};</script>
<script src="/distr/core/js/core.js"></script></head>
<body style="margin:0"><sf-view-properties id="view" record-id="deal-15" collection="crm.deals" panel-label="Сделка № 15"${panel ? ' panel panel-size="2"' : ''}></sf-view-properties>
<script>
const record = ${JSON.stringify(record)};
customElements.whenDefined('sf-view-properties').then(() => {
  const view = document.getElementById('view');
  view.addEventListener('sf-view-properties-close', (event) => event.preventDefault());
  view.setHostPort({version: '1.18.0', capabilities: [], raise(intent) {
    if (intent === 'record.load') return Promise.resolve({answer: 'applied', record}).finally(() => { window.__loaded = true; });
    if (intent === 'record.save' || intent === 'group.save') return Promise.resolve({answer: 'applied', record});
    return Promise.resolve({answer: 'unavailable', reason: 'probe'});
  }});
});
</script></body></html>`;

const failures = [];
const rows = [];
const browser = await chromium.launch();
try {
  for (const where of ['inline', 'panel']) for (const width of [1440, 390]) {
    const page = await browser.newPage({viewport: {width, height: 900}});
    const noise = [];
    page.on('console', (message) => { if (message.type() === 'error') noise.push(message.text().split('\n')[0]); });
    page.on('pageerror', (error) => noise.push(error.message));
    await page.goto(`${origin}/${where}`);
    await page.waitForFunction(() => window.__loaded === true, null, {timeout: 20000}).catch(() => {});
    await page.waitForTimeout(2500);
    // A panel's drawer may stand outside the element (its layer), so the page
    // is read whole: nothing else on it draws an sf- tag.
    const undefinedTags = () => page.evaluate(() => [...new Set([...document.querySelectorAll(':not(:defined)')]
      .map((node) => node.localName).filter((tag) => tag.startsWith('sf-')))]);
    const sections = await page.evaluate(() => document.querySelectorAll('sf-tabs, sf-list.sf-property-view-phone-sections, sf-menu.sf-property-view-section-menu').length);
    // On a phone the sections are a list first: the first one is opened.
    await page.evaluate(() => document.getElementById('view').openPhoneSection?.('main'));
    await page.waitForTimeout(1200);
    const read = await page.evaluate((sections) => ({
      defined: Boolean(customElements.get('sf-view-properties')),
      rows: document.querySelectorAll('.sf-list-description-row').length,
      sections,
    }), sections);
    const readUndefined = await undefinedTags();
    // «Изменить» on the first group: every field control is drawn.
    await page.evaluate(() => document.getElementById('view').editGroup('main', 'deal'));
    await page.waitForTimeout(3000);
    const editUndefined = await undefinedTags();
    const controls = await page.evaluate(() => [...new Set([...document.querySelectorAll('[data-field] *')]
      .map((node) => node.localName).filter((tag) => tag.startsWith('sf-')))].sort());
    const row = {where, width, read, readUndefined, editUndefined, controls, noise};
    rows.push(row);
    const at = `${where} ${width}`;
    if (!read.defined || read.rows < 10) failures.push({check: `${at}: the card is drawn from Core alone`, row});
    if (!read.sections) failures.push({check: `${at}: the sections are drawn (tabs or the phone list)`, row});
    if (readUndefined.length) failures.push({check: `${at}: every tag of the record to read is defined`, row});
    if (editUndefined.length) failures.push({check: `${at}: every control of the group edited is defined`, row});
    if (controls.length < 4) failures.push({check: `${at}: the controls are drawn`, row});
    if (noise.length) failures.push({check: `${at}: the console has no error`, row});
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(JSON.stringify(rows.map(({where, width, read, readUndefined, editUndefined, controls}) => ({where, width, read, readUndefined, editUndefined, controls: controls.length}))));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('LOADER_ASKS_OK');
