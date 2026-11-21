#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Build output root is required: the free output with the set laid into
// smart/smart (scripts/run-browser-probes.mjs makes it).
//
// View round 13, the list study v2 returns that sit on VHF-16 and D1 (DEV
// msg-04ef4018, view-list-study-v2.html, measured on view 1.10.1). Light and
// dark, three loads each, at 1440, 1280, 1024 and 390; real clicks; console
// clean.
// - LV2-1: short one-line values are never cut -- the name «Заказ №2001»,
//   the sum, the date, the status, the INN keep their whole width; a long
//   text gives way down to about 20 characters; where those do not fit the
//   table scrolls sideways. In the page and beside a record card docked to
//   the list.
// - LV2-6: the cards have the list's page row: «Показать ещё» under the grid,
//   the page numbers and «1–24 из 48»; a real click on page 2 shows cards
//   25-48 under «25–48 из 48».
// - LV2-8: the table on page 2 by a real click («21–40 из 48», first row
//   «Заказ №2021»), switched to the cards and back by real clicks on the
//   display kind: the range always says the records on screen, and the
//   record first on screen before the switch stays on screen after it.
import {resolve, join, extname, sep} from 'node:path';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
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

const HEAD = (theme) => `<!doctype html>
<html lang="ru" class="theme-${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/distr/core/css/core.css">
<script>
window.sfPath = '/distr/'; window.sfSmartPath = '/distr/';
window.SF_BOOT_CONFIG = {cacheVersion: 'r13', pluginListVersion: 'r13', preloader: {enabled: false}, packages: {view: {base: '/distr/smart/'}}};
</script>
<script src="/distr/core/lang/ru.js"></script>
<script src="/distr/core/js/core.js"></script>
<style>html,body{background:var(--sf-surface-page);margin:0}body{padding:16px}</style>
</head><body><main id="root">`;

const LIST = (theme, {layout = '', dock = false, key = 'a'} = {}) => `${HEAD(theme)}
${dock ? '<div id="host" data-sf-drawer-dock-host>' : ''}
<sf-view id="v" aria-label="Заказы" heading="Заказы" head="list" collection="orders" size="1/2"${layout ? ` layout="${layout}"` : ''} preferences-key="lv2-${key}">
  ${layout ? '' : '<sf-view-table slot="content" aria-label="Заказы"></sf-view-table>'}
  <sf-pagination slot="pagination" top="false" page-size="20"></sf-pagination>
</sf-view>${dock ? '</div>' : ''}
${dock ? '<sf-view-properties id="c" aria-label="Заказ" size="1/2" mode="auto" panel panel-size="2"></sf-view-properties>' : ''}
<div style="block-size:300px"></div></main>
<script>
(function(){
  var ST=[{value:'new',label:'Новый'},{value:'paid',label:'Оплачен'},{value:'sent',label:'Отправлен'}];
  var FIELDS=[{key:'status',label:'Состояние',propertyType:'choice',filter:{options:ST}}];
  var COLS=[{key:'title',label:'Заказ',role:'title'},{key:'status',label:'Состояние',property_type:'choice',options:ST},
    {key:'client',label:'Клиент'},{key:'amount',label:'Сумма',property_type:'money'},{key:'due',label:'Срок',property_type:'date'},
    {key:'manager',label:'Менеджер'},{key:'inn',label:'ИНН'},{key:'note',label:'Комментарий',property_type:'text'}];
  var ROWS=[];for(var i=0;i<48;i++)ROWS.push({id:'o'+i,revision:'1',actions:['view'],title:'Заказ №'+(2001+i),status:ST[i%3].value,
    client:i%2?'ООО «Торговый дом Северное сияние»':'ИП Орлов Сергей Владимирович',amount:(12450+i*70)+',00 ₽',due:'2026-11-'+String(1+i%28).padStart(2,'0'),
    manager:'Анна Смирнова',inn:'77012345'+String(10+i),note:'Позвонить клиенту перед отгрузкой и уточнить адрес склада'});
  var view=document.getElementById('v');
  var port={version:'1.15.0',capabilities:['row-actions','saved-views'],
    describe:function(){return {fields:FIELDS,layouts:['table','cards'],permissions:{}}},
    raise:function(intent,p){p=p||{};
      if(intent==='query.change'){var qy=p.query||{},per=+qy.per_page||20,page=+qy.page||1;
        if(qy.window&&qy.window.per_page){per=+qy.window.per_page;page=+qy.window.page||1}
        return Promise.resolve({answer:'applied',sequence:p.sequence,data:{columns:COLS,records:ROWS.slice((page-1)*per,page*per),total:ROWS.length,
          view_config:{layouts:{cards:{card_fields:['status','client','amount']}}},
          echo:{filters_chosen:qy.filters_chosen||['status'],filters:qy.filters||{},search:qy.search||'',sort:qy.sort||[],page:page,per_page:per,view:qy.view||{id:'all',type:'${layout || 'table'}'}}}})}
      return Promise.resolve({answer:'applied'})}};
  customElements.whenDefined('sf-view').then(function(){view.setHostPort(port)});
  var card=document.getElementById('c');
  if(card){
    var rec={record_id:'o0',collection:'orders',revision:'1',label:'Заказ №2001',title:'Заказ №2001',actions:[],permissions:{},sections:[{key:'s',label:'Заказ',groups:[{key:'g',label:'Основное',fields:[{key:'client',label:'Клиент',propertyType:'string',value:'ИП Орлов'}]}]}]};
    card.setAttribute('record-id','o0');
    customElements.whenDefined('sf-view-properties').then(function(){card.setHostPort({version:'1.17.0',capabilities:['record-open'],
      raise:function(intent){return Promise.resolve(intent==='record.load'?{answer:'applied',record:rec}:{answer:'applied'})}});
      card.setAttribute('panel-label','Заказ №2001');card.removeAttribute('hidden');card.setAttribute('open','true');});
  }
})();
</script></body></html>`;

const QUICK = process.env.R13_QUICK === '1';
const QUICK_WIDTH = Number(process.env.R13_WIDTH) || 1440;
const failures = [];
const results = [];
const browser = await chromium.launch({ignoreDefaultArgs: ['--hide-scrollbars']});
const load = async (theme, width, body) => {
  const context = await browser.newContext({viewport: {width, height: width < 768 ? 844 : 900}, colorScheme: theme, hasTouch: width < 768});
  await context.route('http://probe.test/**', (route) => {
    const path = decodeURIComponent(new URL(route.request().url()).pathname);
    if (path === '/') return route.fulfill({status: 200, contentType: 'text/html; charset=utf-8', body});
    const target = file(path);
    if (!target) return route.fulfill({status: 404, body: ''});
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
  return {context, page, errors};
};
const ready = (page, what = 'sf-view-table :is(tbody tr, li)[data-row-id]') => page.waitForFunction((selector) => document.querySelectorAll(`#v ${selector}`).length > 0, what, {timeout: 15000});

// Each column: its width and how many of its drawn values are cut.
const columns = (page) => page.evaluate(() => {
  const view = document.getElementById('v');
  const table = view.querySelector('sf-view-table');
  const heads = [...table.querySelectorAll('thead th[data-key]')].filter((th) => !['select', 'settings'].includes(th.dataset.key));
  const cut = (node) => [node, ...node.querySelectorAll('*')].some((one) => one.getClientRects().length && one.scrollWidth > one.clientWidth + 1
    && getComputedStyle(one).overflowX !== 'visible');
  const out = {};
  for (const th of heads) {
    const key = th.dataset.key;
    const cells = [...table.querySelectorAll(`tbody tr[data-row-id] > td[data-key="${key}"]`)].filter((td) => td.getClientRects().length);
    out[key] = {w: Math.round(th.getBoundingClientRect().width), cut: cells.filter(cut).length, rows: cells.length};
  }
  const scroller = [...table.querySelectorAll('*')].find((node) => node.classList?.contains('sf-table-rail') || node.hasAttribute?.('data-sf-rail'));
  const host = document.getElementById('host');
  return {cols: out, table: Math.round(table.querySelector('table')?.getBoundingClientRect().width ?? 0),
    area: Math.round(table.getBoundingClientRect().width), list: host ? Math.round(view.getBoundingClientRect().width) : null,
    sideways: table.querySelector('table') ? table.querySelector('table').getBoundingClientRect().width > table.getBoundingClientRect().width + 1 : false,
    rail: Boolean(scroller)};
});

const footer = (page) => page.evaluate(() => {
  const view = document.getElementById('v');
  const row = view.querySelector(':scope > sf-pagination[slot="pagination"]');
  const nav = row?.querySelector('nav');
  const holder = view.querySelector(':scope > [slot="more"]');
  const more = holder && !holder.hidden ? holder.querySelector('button')?.textContent.trim() ?? null : null;
  const cards = [...view.querySelectorAll('.sf-view-cards__card')].filter((node) => node.getClientRects().length);
  const rows = [...view.querySelectorAll('sf-view-table :is(tbody tr, li)[data-row-id]')].filter((node) => node.getClientRects().length);
  const first = cards.length ? cards[0].textContent : rows[0]?.textContent ?? '';
  // The page row's field look: the page number is its field's value.
  const field = nav?.querySelector('input');
  const current = field ? String(field.value ?? '').trim() || null : nav?.querySelector('[aria-current="page"]')?.textContent.trim() ?? null;
  return {range: view.querySelector('.sf-view-footer-range')?.textContent ?? '', pages: Boolean(nav && nav.getBoundingClientRect().height > 0),
    current, more, shown: cards.length || rows.length, first: (first.match(/Заказ №\d+/u) ?? [''])[0],
    ownMore: Boolean(view.querySelector('.sf-view-cards__more'))};
});
// The page row in its field look: «Следующая страница» by a real click.
const clickPage = async (page, number) => {
  for (let step = 1; step < number; step += 1) {
    const button = page.locator('#v > sf-pagination nav .sf-pagination-direction--next button').first();
    await button.scrollIntoViewIfNeeded();
    await button.click({timeout: 5000});
  }
};
const pickKind = async (page, text) => {
  const zone = await page.evaluate(() => { const node = document.querySelector('#v .sf-view-head-zone'); return Boolean(node && !node.hidden && node.getClientRects().length); });
  if (!zone) {
    const toggle = page.locator('#v sf-button-icon.sf-view-head-zone-toggle button').first();
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click({timeout: 5000});
  }
  const phone = await page.evaluate(() => !document.querySelector('#v sf-segmented[data-kinds] button[data-sf-button-group-value]')?.getClientRects().length);
  if (phone) {
    await page.locator('#v .sf-view-head-kind-menu button').click({timeout: 5000});
    await page.getByRole('menuitem', {name: text}).first().click({timeout: 5000});
  } else {
    const value = {Таблица: 'table', Карточки: 'cards'}[text];
    await page.locator(`#v sf-segmented[data-kinds] button[data-sf-button-group-value="${value}"]`).first().click({timeout: 5000});
  }
};
const startOf = (range) => Number((range.match(/^(\d+)/u) ?? [0, 0])[1]);
const numberOf = (title) => Number((title.match(/№(\d+)/u) ?? [0, 0])[1]) - 2000;

const SHORT = ['title', 'status', 'amount', 'due', 'inn'];
const themes = QUICK ? ['light'] : ['light', 'dark'];
const widths = QUICK ? [QUICK_WIDTH] : [1440, 1280, 1024, 390];
const loads = QUICK ? 1 : 3;
try {
  for (const theme of themes) for (const width of widths) for (let run = 1; run <= loads; run += 1) {
    const phone = width < 768;
    for (const dock of phone ? [false] : [false, true]) {
      const label = {theme, width, run, item: 'LV2-1', dock};
      const {context, page, errors} = await load(theme, width, LIST(theme, {dock, key: `c${dock}`}));
      await ready(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(dock ? 1200 : 600);
      const got = await columns(page);
      if (!phone) {
        const cutShort = SHORT.filter((key) => got.cols[key]?.cut > 0);
        if (cutShort.length) failures.push({...label, got: {cutShort, cols: got.cols}, want: 'short values whole'});
        const note = got.cols.note;
        if (note && note.w < 150) failures.push({...label, got: note, want: 'a long text keeps about 20 characters'});
      }
      if (errors.length) failures.push({...label, errors});
      results.push({theme, width, run, item: 'LV2-1', dock, ...got});
      await context.close();
    }
    {
      const label = {theme, width, run, item: 'LV2-6'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {layout: 'cards', key: 'cards'}));
      await ready(page, '.sf-view-cards__card').catch(() => errors.push('the cards did not come'));
      await page.waitForTimeout(600);
      const first = await footer(page);
      if (!first.pages || !first.more || first.ownMore || !/^1–24 из 48$/u.test(first.range) || first.shown !== 24) failures.push({...label, got: first, want: 'pages, «Показать ещё 24», «1–24 из 48», 24 cards, no button of the grid'});
      await clickPage(page, 2).catch((error) => errors.push(`page 2: ${error.message.slice(0, 80)}`));
      await page.waitForFunction(() => /^25/u.test(document.querySelector('#v .sf-view-footer-range')?.textContent ?? ''), null, {timeout: 8000}).catch(() => {});
      await page.waitForTimeout(400);
      const second = await footer(page);
      if (!/^25–48 из 48$/u.test(second.range) || numberOf(second.first) !== 25 || second.shown !== 24) failures.push({...label, got: second, want: '«25–48 из 48», cards from №2025'});
      if (errors.length) failures.push({...label, errors});
      results.push({theme, width, run, item: 'LV2-6', first, second});
      await context.close();
    }
    {
      const label = {theme, width, run, item: 'LV2-8'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {key: 'switch'}));
      await ready(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(600);
      await clickPage(page, 2).catch((error) => errors.push(`page 2: ${error.message.slice(0, 80)}`));
      await page.waitForFunction(() => /^21/u.test(document.querySelector('#v .sf-view-footer-range')?.textContent ?? ''), null, {timeout: 8000}).catch(() => {});
      await page.waitForTimeout(300);
      const steps = {table2: await footer(page)};
      await pickKind(page, 'Карточки').catch((error) => errors.push(`cards: ${error.message.slice(0, 600)}`));
      await page.waitForFunction(() => document.querySelectorAll('#v .sf-view-cards__card').length > 0, null, {timeout: 8000}).catch(() => {});
      await page.waitForTimeout(600);
      steps.cards = await footer(page);
      await pickKind(page, 'Таблица').catch((error) => errors.push(`table: ${error.message.slice(0, 80)}`));
      await page.waitForFunction(() => document.querySelectorAll('#v sf-view-table :is(tbody tr, li)[data-row-id]').length > 0 && !document.querySelector('#v .sf-view-cards__card'), null, {timeout: 8000}).catch(() => {});
      await page.waitForTimeout(600);
      steps.back = await footer(page);
      for (const [name, step] of Object.entries(steps)) {
        if (!step.range || startOf(step.range) !== numberOf(step.first)) failures.push({...label, step: name, got: step, want: 'the range starts at the first record on screen'});
        const kept = numberOf(steps.table2.first);
        if (name !== 'table2' && !(startOf(step.range) <= kept && kept < startOf(step.range) + step.shown)) failures.push({...label, step: name, got: step, want: `record ${kept} (first on page 2) still on screen`});
        // A pager missing after a click switch is a failure (VR13-1: the
        // cards lost the page row after a switch from the table).
        if (!step.pages) failures.push({...label, step: name, got: step, want: 'the page row on screen after the switch'});
        if (step.current && step.pages && Number(step.current) !== Math.ceil(startOf(step.range) / Math.max(1, step.shown))) failures.push({...label, step: name, got: step, want: 'the page marked is the page shown'});
      }
      if (errors.length) failures.push({...label, errors});
      results.push({theme, width, run, item: 'LV2-8', ...steps});
      await context.close();
    }
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 1));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('VIEW_ROUND_13_LV2_OK');
