#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Build output root is required: the free output with the set laid into
// smart/smart (scripts/run-browser-probes.mjs makes it).
//
// View modular step 1 (C409 study, DEV msg-8ccf829d): the package core
// smart/view-common holds the code two or more View bundles share and comes
// once; a list that shows only the board, the cards or the calendar does not
// fetch sf-view-table, and a switch to the table fetches it then. Through the
// Loader as the docs connect the set (SF_BOOT_CONFIG.packages.view, core.js
// and core.min.js), light and dark, three loads each, at 1440 and 390, with a
// clean console and no failed request:
// - one kind at a time (the table in the page's markup, the table the list
//   makes itself, the board, the cards, the calendar): what the browser asked
//   for (gzip bytes of the set's and of the Framework's files), the core asked
//   once, the table asked only where the list shows it;
// - the whole list by real clicks: table -> board -> cards -> calendar ->
//   table on the head's display kind, the filter window opened and closed,
//   a record opened in the card beside the list; each kind draws its records.
// MODULAR_BEFORE=1 measures a build from before the core (no assertions on
// what is fetched, only the bytes); MODULAR_QUICK=1 one load, light, 1440.
import {resolve, join, extname, sep} from 'node:path';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
const BEFORE = process.env.MODULAR_BEFORE === '1';
const QUICK = process.env.MODULAR_QUICK === '1';
const mounts = [['/distr/core/', join(out, 'core', 'core')], ['/distr/rule/', join(out, 'core', 'rule')],
  ['/distr/component/', join(out, 'component', 'component')], ['/distr/utility/', join(out, 'utility', 'utility')],
  ['/distr/smart/', join(out, 'smart', 'smart')]];
const TYPES = {'.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.html': 'text/html', '.png': 'image/png'};
const file = (path) => {
  for (const [prefix, root] of mounts) {
    if (!path.startsWith(prefix)) continue;
    const target = resolve(root, path.slice(prefix.length));
    if (target.startsWith(root + sep) && existsSync(target) && statSync(target).isFile()) return target;
  }
  return null;
};
// What a server that sends the build's .gz files would send.
const gzipBytes = (target) => (existsSync(`${target}.gz`) ? statSync(`${target}.gz`).size : gzipSync(readFileSync(target)).length);
const VIEW_FOLDERS = /^\/distr\/smart\/(view|view-[a-z]+)\//u;

const HEAD = (theme, min) => `<!doctype html>
<html lang="ru" class="theme-${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/distr/core/css/core.css">
<script>
window.sfPath = '/distr/'; window.sfSmartPath = '/distr/';
window.SF_BOOT_CONFIG = {cacheVersion: 'm1', pluginListVersion: 'm1', preloader: {enabled: false}, packages: {view: {base: '/distr/smart/'}}};
</script>
<script src="/distr/core/lang/ru.js"></script>
<script src="/distr/core/js/${min ? 'core.min.js' : 'core.js'}"></script>
<style>html,body{background:var(--sf-surface-page);margin:0}body{padding:16px}</style>
</head><body><main id="root">`;

// layout '' with the table in the markup (the docs' form), 'bare' with no
// content element (the list makes its own table), or a kind.
const LIST = (theme, {layout = '', min = false, card = false, key = 'a'} = {}) => `${HEAD(theme, min)}
<sf-view id="v" aria-label="Заказы" heading="Заказы" head="list" collection="orders" size="1/2"${layout && layout !== 'bare' ? ` layout="${layout}"` : ''}${card ? ' record-card="c"' : ''} preferences-key="m1-${key}">
  ${layout ? '' : '<sf-view-table slot="content" aria-label="Заказы"></sf-view-table>'}
  <sf-pagination slot="pagination" top="false" page-size="20"></sf-pagination>
</sf-view>
${card ? '<sf-view-properties id="c" aria-label="Заказ" size="1/2" mode="auto" panel panel-size="2" hidden></sf-view-properties>' : ''}
<div style="block-size:300px"></div></main>
<script>
(function(){
  var ST=[{value:'new',label:'Новый'},{value:'paid',label:'Оплачен'},{value:'sent',label:'Отправлен'}];
  var FIELDS=[{key:'status',label:'Состояние',propertyType:'choice',filter:{options:ST}},{key:'client',label:'Клиент',propertyType:'string'},{key:'due',label:'Срок',propertyType:'date'}];
  var COLS=[{key:'title',label:'Заказ',role:'title'},{key:'status',label:'Состояние',property_type:'choice',options:ST},{key:'client',label:'Клиент'},{key:'amount',label:'Сумма',property_type:'money'},{key:'due',label:'Срок',property_type:'date'}];
  var now=new Date(),ym=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  var ROWS=[];for(var i=0;i<48;i++)ROWS.push({id:'o'+i,revision:'1',actions:['view'],title:'Заказ №'+(2001+i),status:ST[i%3].value,
    client:i%2?'ООО «Северное сияние»':'ИП Орлов',amount:(12450+i*70)+',00 ₽',due:ym+'-'+String(1+i%28).padStart(2,'0')});
  var view=document.getElementById('v');
  var port={version:'1.15.0',capabilities:['row-actions','saved-views'],
    describe:function(){return {fields:FIELDS,layouts:['table','board','cards','calendar'],permissions:{}}},
    raise:function(intent,p){p=p||{};
      if(intent==='query.change'){var qy=p.query||{},per=+qy.per_page||20,page=+qy.page||1;
        if(qy.window&&qy.window.per_page){per=+qy.window.per_page;page=+qy.window.page||1}
        var days=qy.window&&(qy.window.from||qy.window.days);
        var lanes=ST.map(function(s){var r=ROWS.filter(function(x){return x.status===s.value});return {value:s.value,label:s.label,records:r.slice(0,6),total:r.length}});
        return Promise.resolve({answer:'applied',sequence:p.sequence,data:{columns:COLS,records:days?ROWS:ROWS.slice((page-1)*per,page*per),total:ROWS.length,
          lanes:qy.window&&('lanes' in qy.window)?lanes:undefined,board:{order_field:''},
          view_config:{layouts:{board:{lane_field:'status',card_fields:['client']},cards:{card_fields:['status','client','amount']},calendar:{date_field:'due',event_fields:['client']}}},
          echo:{filters_chosen:qy.filters_chosen||['status'],filters:qy.filters||{},search:qy.search||'',sort:qy.sort||[],page:page,per_page:per,view:qy.view||{id:'all',type:'${layout && layout !== 'bare' ? layout : 'table'}'}}}})}
      return Promise.resolve({answer:'applied'})}};
  customElements.whenDefined('sf-view').then(function(){view.setHostPort(port)});
  var card=document.getElementById('c');
  if(card){
    customElements.whenDefined('sf-view-properties').then(function(){card.setHostPort({version:'1.17.0',capabilities:['record-open'],
      raise:function(intent,p){var id=(p&&(p.record_id||p.id))||'o0';var r=ROWS.find(function(x){return x.id===id})||ROWS[0];
        return Promise.resolve(intent==='record.load'?{answer:'applied',record:{record_id:r.id,collection:'orders',revision:'1',label:r.title,title:r.title,actions:[],permissions:{},
          sections:[{key:'s',label:'Заказ',groups:[{key:'g',label:'Основное',fields:[{key:'client',label:'Клиент',propertyType:'string',value:r.client},{key:'amount',label:'Сумма',propertyType:'money',value:r.amount}]}]}]}}:{answer:'applied'})}})});
  }
})();
</script></body></html>`;

const failures = [];
const results = [];
const browser = await chromium.launch({headless: true, ignoreDefaultArgs: ['--hide-scrollbars']});
const load = async (theme, width, body) => {
  const context = await browser.newContext({viewport: {width, height: width < 768 ? 844 : 900}, colorScheme: theme, hasTouch: width < 768});
  const asked = [];
  await context.route('http://probe.test/**', (route) => {
    const path = decodeURIComponent(new URL(route.request().url()).pathname);
    if (path === '/') return route.fulfill({status: 200, contentType: 'text/html; charset=utf-8', body});
    const target = file(path);
    if (!target) { asked.push({path, bytes: 0, missing: true}); return route.fulfill({status: 404, body: ''}); }
    asked.push({path, bytes: gzipBytes(target)});
    const type = TYPES[extname(target)] ?? 'application/octet-stream';
    return route.fulfill({status: 200, contentType: /^(text|application\/json)/u.test(type) ? `${type}; charset=utf-8` : type, body: readFileSync(target)});
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    const text = message.text();
    if (message.type() === 'error' || (message.type() === 'warning' && !/preload/u.test(text))) errors.push(`${message.type()}: ${text.slice(0, 200)}`);
  });
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('http://probe.test/');
  return {context, page, errors, asked};
};

const CONTENT = {
  table: 'sf-view-table :is(tbody tr, li)[data-row-id]',
  board: 'sf-view-board .sf-view-board__card, sf-view-board [data-id]',
  cards: 'sf-view-cards [data-id], sf-view-cards .sf-card',
  calendar: 'sf-view-calendar [data-id], sf-view-calendar [data-event-id], sf-view-calendar .sf-view-calendar__event',
};
const drawn = (page, kind) => page.waitForFunction((selector) => [...document.querySelectorAll(`#v ${selector}`)].some((node) => node.getClientRects().length > 0),
  CONTENT[kind], {timeout: 15000});
const settle = (page) => page.waitForTimeout(700);

// The bytes the browser asked for, split into the set's files and the rest.
const tally = (asked) => {
  const sum = (list) => list.reduce((total, item) => total + item.bytes, 0);
  const view = asked.filter((item) => VIEW_FOLDERS.test(item.path));
  const scripts = (folder) => asked.filter((item) => item.path.startsWith(`/distr/smart/${folder}/js/`)).length;
  return {
    view_kb: Math.round(sum(view) / 102.4) / 10,
    framework_kb: Math.round(sum(asked.filter((item) => !VIEW_FOLDERS.test(item.path))) / 102.4) / 10,
    total_kb: Math.round(sum(asked) / 102.4) / 10,
    requests: asked.length,
    missing: asked.filter((item) => item.missing).map((item) => item.path),
    view_files: [...new Set(view.map((item) => item.path.replace(/^\/distr\/smart\//u, '')))].sort(),
    common_scripts: scripts('view-common'),
    table_scripts: scripts('view-table'),
  };
};

const pickKind = async (page, kind) => {
  const zone = await page.evaluate(() => { const node = document.querySelector('#v .sf-view-head-zone'); return Boolean(node && !node.hidden && node.getClientRects().length); });
  const toggle = page.locator('#v sf-button-icon.sf-view-head-zone-toggle button').first();
  if (!zone && await toggle.count()) { await toggle.scrollIntoViewIfNeeded(); await toggle.click({timeout: 5000}); }
  const segment = page.locator(`#v sf-segmented[data-kinds] button[data-sf-button-group-value="${kind}"]`).first();
  if (await segment.count() && await segment.isVisible()) { await segment.click({timeout: 5000}); return; }
  await page.locator('#v .sf-view-head-kind-menu button').first().click({timeout: 5000});
  const words = {table: 'Таблица', board: 'Канбан', cards: 'Карточки', calendar: 'Календарь'};
  await page.getByRole('menuitemradio', {name: words[kind]}).or(page.getByRole('menuitem', {name: words[kind]})).first().click({timeout: 5000});
};

const themes = QUICK ? ['light'] : ['light', 'dark'];
const widths = QUICK ? [1440] : [1440, 390];
const loads = QUICK ? 1 : 3;
const fail = (label, what) => failures.push({...label, what});
try {
  for (const theme of themes) for (const width of widths) for (let run = 1; run <= loads; run += 1) {
    // One kind at a time; the docs' table form also through core.min.js.
    for (const [layout, kind, min] of [['', 'table', false], ['', 'table', true], ['bare', 'table', false], ['board', 'board', false], ['cards', 'cards', false], ['calendar', 'calendar', false], ['board', 'board', true]]) {
      const label = {theme, width, run, item: `single ${layout || 'table'}${min ? ' min' : ''}`};
      const {context, page, errors, asked} = await load(theme, width, LIST(theme, {layout, min, key: `${layout}-${kind}`}));
      await drawn(page, kind).catch(() => errors.push(`the ${kind} did not draw its records`));
      await settle(page);
      const got = tally(asked);
      results.push({...label, ...got});
      if (errors.length) fail(label, errors.slice(0, 5));
      if (!BEFORE) {
        if (got.common_scripts !== 1) fail(label, `the package core was asked ${got.common_scripts} times`);
        if (kind === 'table' && got.table_scripts !== 1) fail(label, `the table was asked ${got.table_scripts} times`);
        if (kind !== 'table' && got.table_scripts !== 0) fail(label, `a ${kind} list fetched sf-view-table`);
      }
      await context.close();
    }
    // The whole list by real clicks.
    {
      const label = {theme, width, run, item: 'full list'};
      const {context, page, errors, asked} = await load(theme, width, LIST(theme, {card: true, key: 'full'}));
      const steps = [];
      await drawn(page, 'table').catch(() => errors.push('the table did not draw its records'));
      steps.push(['table', tally(asked).total_kb]);
      for (const kind of ['board', 'cards', 'calendar', 'table']) {
        await pickKind(page, kind).catch((error) => errors.push(`the display kind ${kind} could not be chosen: ${error.message.split('\n')[0]}`));
        await drawn(page, kind).catch(() => errors.push(`after the switch the ${kind} did not draw its records`));
        await settle(page);
        steps.push([kind, tally(asked).total_kb]);
      }
      // The filter window, by a real click on «Фильтр», closed by Escape.
      const filter = page.locator('#v .sf-view-head-filter button, #v [data-sf-head-filter] button, #v sf-button.sf-view-head-filter button').first();
      const filterButton = await filter.count() ? filter : page.locator('#v button', {hasText: 'Фильтр'}).first();
      await filterButton.click({timeout: 5000}).catch((error) => errors.push(`«Фильтр» could not be clicked: ${error.message.split('\n')[0]}`));
      const windowOpen = await page.waitForFunction(() => [...document.querySelectorAll('sf-popover, sf-drawer, [role="dialog"], .sf-filter-window, sf-menu-context')]
        .some((node) => node.getClientRects().length && /Состояние|Применить|Фильтр/u.test(node.textContent ?? '')), null, {timeout: 8000}).then(() => true, () => false);
      if (!windowOpen) errors.push('the filter window did not open');
      await page.keyboard.press('Escape');
      await settle(page);
      steps.push(['filter window', tally(asked).total_kb]);
      // A record, by a real click on the first row's name.
      const row = page.locator(`#v ${CONTENT.table}`).first();
      const link = row.locator('a, button.sf-table-title, [data-sf-open]').first();
      await (await link.count() ? link : row).click({timeout: 5000}).catch((error) => errors.push(`the first record could not be clicked: ${error.message.split('\n')[0]}`));
      const opened = await page.waitForFunction(() => {
        const card = document.getElementById('c');
        return card && card.getAttribute('data-state') === 'ready' && card.getClientRects().length > 0;
      }, null, {timeout: 10000}).then(() => true, () => false);
      if (!opened) errors.push('the record card did not open');
      await settle(page);
      const got = tally(asked);
      steps.push(['record', got.total_kb]);
      results.push({...label, ...got, steps, windowOpen, opened});
      if (errors.length) fail(label, errors.slice(0, 6));
      if (!BEFORE && got.common_scripts !== 1) fail(label, `the package core was asked ${got.common_scripts} times`);
      if (!BEFORE && got.table_scripts !== 1) fail(label, `the table was asked ${got.table_scripts} times`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
const summary = {};
for (const result of results) {
  const key = `${result.item} @${result.width}`;
  summary[key] ??= {view_kb: result.view_kb, framework_kb: result.framework_kb, total_kb: result.total_kb, view_files: result.view_files.length, steps: result.steps};
}
console.log(JSON.stringify({summary, results: results.length, failures}, null, 1));
if (failures.length) process.exit(1);
console.log('VIEW_MODULAR_LOADING_OK');
