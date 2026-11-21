#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Build output root is required: the free output with the set laid into
// smart/smart (scripts/run-browser-probes.mjs makes it).
//
// View round 12, the second and third sets (DEV msg-c31ccebd, study
// view-head-footer round 3; DEV msg-3e47ce93, study view-record; C393). The
// page loads the set through the SIMAI Framework loader, as a site does.
// Light and dark, three loads each; real clicks where a person clicks.
// - VHF-3 (refined): the head row has two states only. Eight filter fields
//   closed one by one with their «×» at 1440, 1280 and 1024: every step is
//   either one row (the search, «Создать» and the menu at the row's end) or
//   two (the search across the width on top, «Фильтр» and the fields below);
//   never the search alone at the end of a second row.
// - VHF-8: «Компактно» in a normal area moves a row with the row menu «≡»
//   one step down at size 1/2 and 1 (the «≡» held it at the normal height).
// - VHF-9: the list title keeps its heading size in a compact area.
// - VHF-10: a board card at size 1 draws text step 1, at 1/2 step 1/2.
// - VHF-11: without bulk actions no boxes in the table or the cards; with
//   them the boxes come, and a click on one brings the bar.
// - VHF-12: a card's «⋯» and box are centred on the title's first line.
// - VRS-7: the record history beside the fields draws the fields' text step.
// - VRS-8: on a phone the section rows are list rows of the ladder (48) with
//   a «›»; a click opens the section.
// - VRS-9: a section whose only group has the section's name draws no group
//   title; a group of another name keeps it.
// - VHF-4 (with the title giving last): a narrow fitted table (390) whose
//   name has to give: nothing chosen it is one line as before; «Текст в
//   одну строку» on, one line; turned off, the name on two lines, uncut.
// - C393 star: the favourite star stays right after the one-line title; a
//   click flips its pressed state; no console word about it.
// Console clean (errors and warnings) in every load.
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

const HEAD = (theme, density) => `<!doctype html>
<html lang="ru" class="theme-${theme}"${density ? ` data-sf-density="${density}"` : ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/distr/core/css/core.css">
<script>
window.sfPath = '/distr/'; window.sfSmartPath = '/distr/';
window.SF_BOOT_CONFIG = {cacheVersion: 'r12b', pluginListVersion: 'r12b', preloader: {enabled: false}, packages: {view: {base: '/distr/smart/'}}};
</script>
<script src="/distr/core/lang/ru.js"></script>
<script src="/distr/core/js/core.js"></script>
<style>html,body{background:var(--sf-surface-page);margin:0}body{padding:16px}</style>
</head><body><main id="root">`;

// A list: the table (or cards, or a board), its fields, rows with a row menu.
const LIST = (theme, {fields = 8, size = '1/2', layout = '', bulk = false, density = ''}) => `${HEAD(theme, density)}
<sf-view id="v" aria-label="Заказы" heading="Заказы" head="list" collection="orders" size="${size}"${layout ? ` layout="${layout}"` : ''} preferences-key="r12b-${fields}-${layout}">
  ${layout ? '' : '<sf-view-table slot="content" aria-label="Заказы"></sf-view-table>'}
  <sf-pagination slot="pagination" top="false" page-size="8" page-sizes="8,16"${bulk ? ' actions="paid:Отметить оплаченными|archive:В архив"' : ''}></sf-pagination>
</sf-view></main>
<script>
(function(){
  var ST=[{value:'new',label:'Новый'},{value:'paid',label:'Оплачен'},{value:'sent',label:'Отправлен'}];
  var KEYS=['status','manager','client','city','channel','payment','priority','method'];
  var NAMES=['Состояние','Менеджер','Клиент','Город','Канал','Оплата','Срочность','Способ доставки'];
  var FIELDS=KEYS.map(function(k,i){return {key:k,label:NAMES[i],propertyType:'choice',filter:{options:ST}}});
  var CHOSEN=KEYS.slice(0,${fields});
  var COLS=[{key:'title',label:'Заказ',role:'title'},{key:'status',label:'Состояние',property_type:'choice',options:ST},{key:'client',label:'Клиент'},{key:'amount',label:'Сумма'}];
  var ROWS=[];for(var i=0;i<12;i++)ROWS.push({id:'h'+i,revision:'1',actions:['view','delete'],title:'Заказ №'+(3001+i),status:ST[i%3].value,client:'ООО «Ромашка»',amount:(10000+i*70)+',00 ₽'});
  var view=document.getElementById('v'),table=view.querySelector('sf-view-table');
  var port={version:'1.15.0',capabilities:['row-actions','saved-views','personal-column-settings','create-record'],
    describe:function(){return {fields:FIELDS,layouts:['table','cards','board'],permissions:{record_fields:true}}},
    raise:function(intent,p){p=p||{};
      if(intent==='query.change'){var qy=p.query||{},per=+qy.per_page||8,page=+qy.page||1;
        var lanes=ST.map(function(s){var r=ROWS.filter(function(x){return x.status===s.value});return {value:s.value,label:s.label,records:r,total:r.length}});
        return Promise.resolve({answer:'applied',sequence:p.sequence,data:{columns:COLS,records:ROWS.slice((page-1)*per,page*per),total:ROWS.length,lanes:lanes,board:{order_field:''},
          view_config:{layouts:{board:{lane_field:'status'}}},
          echo:{filters_chosen:qy.filters_chosen||CHOSEN,filters:qy.filters||{},search:qy.search||'',sort:qy.sort||[],page:page,per_page:per,view:qy.view||{id:'all',type:'table'}}}})}
      return Promise.resolve({answer:'applied'})}};
  customElements.whenDefined('sf-view').then(function(){table&&table.setFilterFields&&table.setFilterFields(FIELDS);view.setHostPort(port)});
})();
</script></body></html>`;

// A bare table, narrow: the name has to give room (typed-cells' columns).
const NARROW = (theme) => `${HEAD(theme)}
<sf-view-table id="t" layout="table" aria-label="Решения" preferences-key="r12b-narrow"></sf-view-table></main>
<script>
(function(){
  var t=document.getElementById('t');
  var C=[{key:'title',label:'Название'},{key:'owner',label:'Ответственный',propertyType:'record'},{key:'attachment',label:'Файл',propertyType:'file'},{key:'accent',label:'Цвет',propertyType:'color'}];
  var R=[{id:'1',revision:'r1',title:'Портал клиента',owner:{value:'u-1',label:'Анна Захарова',href:'#u-1'},attachment:{value:'f-1',label:'договор.pdf',mime:'application/pdf',href:'#f-1'},accent:'#2f6feb'},
    {id:'2',revision:'r1',title:'Каталог товаров',owner:{value:'u-2',label:'Илья Петров',href:'#u-2'},attachment:{value:'f-2',label:'схема.png',mime:'image/png',href:'#f-2'},accent:'#1a7f37'}];
  customElements.whenDefined('sf-view-table').then(function(){t.columns=C;t.rows=R;});
})();
</script></body></html>`;

// A record card: in place or in a panel, sections as given, history.
const CARD = (theme, {panel = false, full = false, sections = 2}) => `${HEAD(theme)}
<sf-view-properties id="c" aria-label="Заказ" size="1/2" mode="auto"${panel || full ? ' panel' : ''}${full ? ' panel-size="full"' : ''}></sf-view-properties></main>
<script>
(function(){
  var ST=[{value:'new',label:'Новый'},{value:'sent',label:'Отправлен'}];
  var f=function(k,l,v){return {key:k,label:l,propertyType:'string',value:v}};
  var SECTIONS=[{key:'order',label:'Заказ',groups:[{key:'g1',label:'Заказ',fields:[{key:'status',label:'Состояние',propertyType:'choice',value:'sent',options:ST},f('client','Клиент','ООО «Ромашка»'),f('amount','Сумма','12 450,00 ₽')]}]},
    {key:'ship',label:'Доставка',groups:[{key:'g2',label:'Адрес',fields:[f('city','Город','Казань'),f('street','Улица','Баумана, 12')]}]},
    {key:'pay',label:'Оплата',groups:[{key:'g3',label:'Счёт',fields:[f('bill','Счёт','№ 812')]}]}].slice(0,${sections});
  var rec={record_id:'r1',collection:'orders',revision:'1',label:'Заказ №3002',title:'Заказ №3002',address:'#/orders/r1',actions:['record.edit','record.delete'],
    view:{head:{subtitle:['client'],status:'status'}},sections:SECTIONS};
  var EVENTS=[{id:'e2',kind:'update',time:'2026-11-20T10:15:00Z',actor:{name:'Мария Котова'},changes:[{field:'amount',before:'12 000,00 ₽',after:'12 450,00 ₽'}]},
    {id:'e1',kind:'create',time:'2026-11-19T09:00:00Z',actor:{name:'Мария Котова'}}];
  var card=document.getElementById('c');
  card.setAttribute('record-id','r1');
  customElements.whenDefined('sf-view-properties').then(function(){card.setHostPort({version:'1.17.0',capabilities:['record-history','view-settings','record-open'],
    raise:function(intent){return Promise.resolve(intent==='record.load'?{answer:'applied',record:rec}:intent==='record.history'?{answer:'applied',events:EVENTS,has_more:false}:{answer:'applied'})}});
    ${panel || full ? "card.setAttribute('panel-label','Заказ №3002');card.removeAttribute('hidden');card.setAttribute('open','true');" : ''}});
})();
</script></body></html>`;

const QUICK = process.env.R12_QUICK === '1';
const failures = [];
const results = [];
const browser = await chromium.launch();
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
  // Warnings too: the pressed star of before said so on every load. The
  // loader's own «preloaded but not used» notes are about the page, not a part.
  page.on('console', (message) => {
    const text = message.text();
    if (message.type() === 'error' || (message.type() === 'warning' && !/preload/u.test(text))) errors.push(`${message.type()}: ${text.slice(0, 200)}`);
  });
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('http://probe.test/');
  return {context, page, errors};
};
const listReady = (page, what = 'sf-view-table [data-row-id]') => page.waitForFunction((selector) => document.querySelectorAll(`#v ${selector}`).length > 0
  && document.querySelector('#v .sf-view-head-row button')?.getClientRects().length, what, {timeout: 15000});

const headState = (page) => page.evaluate(() => {
  const row = document.querySelector('#v .sf-view-head-row');
  const start = row.querySelector('.sf-view-head-start').getBoundingClientRect();
  const end = row.querySelector('.sf-view-head-end').getBoundingClientRect();
  const search = row.querySelector('.sf-view-head-search').getBoundingClientRect();
  const box = row.getBoundingClientRect();
  const fields = row.querySelectorAll('.sf-view-head-fields > .sf-view-head-join').length;
  const one = Math.abs(end.top - start.top) < 2;
  const top = end.bottom <= start.top + 1;
  const state = one ? 'one' : top ? 'two' : 'third';
  return {fields, state, endLeft: Math.round(end.left - box.left), endRight: Math.round(box.right - end.right), search: Math.round(search.width),
    sideways: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1};
});

try {
  for (const theme of QUICK ? ['light'] : ['light', 'dark']) for (let run = 1; run <= (QUICK ? 1 : 3); run += 1) {
    // VHF-3: close the fields one by one.
    for (const width of [1440, 1280, 1024]) {
      const label = {theme, run, width, item: 'VHF-3'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {fields: 8}));
      await listReady(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(500);
      const steps = [];
      for (let left = 8; left >= 0; left -= 1) {
        const got = await headState(page);
        steps.push(`${got.fields}:${got.state}`);
        if (got.state === 'third') failures.push({...label, got: `a third state with ${got.fields} fields`, detail: got});
        if (got.state === 'two' && (got.endLeft > 1 || got.endRight > 1)) failures.push({...label, got: `two rows, the search row not across the width`, detail: got});
        if (got.state === 'one' && got.endRight > 1) failures.push({...label, got: 'one row, the end short of the row end', detail: got});
        if (got.sideways) failures.push({...label, got: 'sideways'});
        if (!got.fields) break;
        await page.locator('#v .sf-view-head-fields button[data-unchoose]').last().click({timeout: 5000}).catch(() => errors.push('the field «×» could not be clicked'));
        await page.waitForFunction((n) => document.querySelectorAll('#v .sf-view-head-fields > .sf-view-head-join').length < n, got.fields, {timeout: 5000})
          .catch(() => errors.push(`the field «×» did not close a field at ${got.fields}`));
        await page.waitForTimeout(250);
      }
      if (width === 1440 && !steps[0].endsWith('two')) failures.push({...label, got: 'eight fields at 1440 stayed on one row', steps});
      if (!steps.at(-1).endsWith('one')) failures.push({...label, got: 'no fields did not fit one row', steps});
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, item: 'VHF-3', width, steps: steps.join(' ')});
      await context.close();
    }
    // VHF-8: «Компактно» on a normal page moves a row with «≡»; VHF-9 a compact page keeps the title.
    for (const size of ['1/2', '1']) {
      const label = {theme, run, size, item: 'VHF-8'};
      const {context, page, errors} = await load(theme, 1440, LIST(theme, {fields: 2, size}));
      await listReady(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(500);
      const rows = () => page.evaluate(() => {
        const tr = document.querySelector('#v sf-view-table tbody tr[data-row-id]');
        const menu = tr?.querySelector('td[data-key="settings"] button');
        return {row: Math.round(tr?.getBoundingClientRect().height ?? 0), menu: menu ? Math.round(menu.getBoundingClientRect().height) : null};
      });
      const set = (value) => page.evaluate((density) => document.querySelector('#v sf-view-table').onTableSettingChanged({detail: {id: 'density', value: density}, stopPropagation() {}, preventDefault() {}}), value);
      const normal = await rows();
      await set('compact'); await page.waitForTimeout(500);
      const compact = await rows();
      await set('normal'); await page.waitForTimeout(500);
      const back = await rows();
      const want = size === '1/2' ? {normal: 32, compact: 28} : {normal: 40, compact: 32};
      if (normal.menu === null) failures.push({...label, got: 'no row menu in the probe table'});
      if (normal.row !== want.normal || compact.row !== want.compact || back.row !== want.normal) failures.push({...label, got: {normal, compact, back}, want});
      if (compact.menu !== null && compact.menu > compact.row) failures.push({...label, got: `the «≡» ${compact.menu} taller than the compact row ${compact.row}`});
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, item: 'VHF-8', size, normal, compact, back});
      await context.close();
    }
    for (const density of ['normal', 'compact']) {
      const label = {theme, run, density, item: 'VHF-9'};
      const {context, page, errors} = await load(theme, 1440, LIST(theme, {fields: 2, density}));
      await listReady(page).catch(() => errors.push('the list did not come'));
      const title = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#v .sf-view-head-name')).fontSize));
      if (title !== 20) failures.push({...label, got: `the list title ${title} px`});
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, item: 'VHF-9', density, title});
      await context.close();
    }
    // VHF-11 and VHF-12: boxes only with bulk actions; the card head line.
    for (const [layout, bulk] of [['', false], ['', true], ['cards', false], ['cards', true]]) {
      const label = {theme, run, layout: layout || 'table', bulk, item: 'VHF-11'};
      const cards = layout === 'cards';
      const {context, page, errors} = await load(theme, 1440, LIST(theme, {fields: 2, layout, bulk}));
      await listReady(page, cards ? '.sf-view-cards__card' : 'sf-view-table [data-row-id]').catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(600);
      const got = await page.evaluate((onCards) => {
        const root = document.getElementById('v');
        const boxes = [...root.querySelectorAll(onCards ? '.sf-view-cards__box .sf-checkbox' : 'sf-view-table tbody td[data-key="select"] .sf-checkbox')]
          .filter((node) => node.getClientRects().length).length;
        const card = root.querySelector('.sf-view-cards__card');
        const title = card?.querySelector('.sf-view-cards__title');
        const menu = card?.querySelector('.sf-view-cards__menu button');
        const box = card?.querySelector('.sf-view-cards__box .sf-checkbox-box');
        const mid = (node) => { const b = node.getBoundingClientRect(); return b.top + b.height / 2; };
        const line = title ? parseFloat(getComputedStyle(title).lineHeight) : 0;
        const first = title ? title.getBoundingClientRect().top + line / 2 : 0;
        return {boxes, menuOff: menu ? Math.round(mid(menu) - first) : null, boxOff: box && box.getBoundingClientRect().height ? Math.round(mid(box) - first) : null};
      }, cards);
      if (!bulk && got.boxes) failures.push({...label, got: `${got.boxes} boxes without bulk actions`});
      if (bulk && !got.boxes) failures.push({...label, got: 'no boxes with bulk actions'});
      if (cards && (got.menuOff === null || Math.abs(got.menuOff) > 1)) failures.push({...label, item: 'VHF-12', got: `«⋯» ${got.menuOff} px off the title line`});
      if (cards && bulk) {
        // The box shows on hover or once marked: hover the card, then click it for real.
        await page.locator('#v .sf-view-cards__card').first().hover();
        const offset = await page.evaluate(() => {
          const card = document.querySelector('#v .sf-view-cards__card');
          const title = card.querySelector('.sf-view-cards__title');
          const box = card.querySelector('.sf-view-cards__box .sf-checkbox-box') ?? card.querySelector('.sf-view-cards__box');
          const line = parseFloat(getComputedStyle(title).lineHeight);
          const b = box.getBoundingClientRect();
          return Math.round(b.top + b.height / 2 - (title.getBoundingClientRect().top + line / 2));
        });
        if (Math.abs(offset) > 1) failures.push({...label, item: 'VHF-12', got: `the box ${offset} px off the title line`});
        got.boxOff = offset;
      }
      if (bulk) {
        const target = cards ? page.locator('#v .sf-view-cards__box .sf-checkbox').first() : page.locator('#v sf-view-table tbody tr[data-row-id] td[data-key="select"] .sf-checkbox').first();
        await target.click({timeout: 5000}).catch(() => failures.push({...label, got: 'the box could not be clicked'}));
        await page.waitForFunction(() => [...document.querySelectorAll('.sf-bulk-actions, .sf-view-bulk')].some((node) => node.getClientRects().length), null, {timeout: 5000})
          .catch(() => failures.push({...label, got: 'a click on a box brought no bar'}));
      }
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, item: 'VHF-11/12', layout: layout || 'table', bulk, ...got});
      await context.close();
    }
    // VHF-10: the board card's text follows the size.
    for (const size of ['1/2', '1']) {
      const label = {theme, run, size, item: 'VHF-10'};
      const {context, page, errors} = await load(theme, 1440, LIST(theme, {fields: 2, size, layout: 'board'}));
      await listReady(page, '.sf-view-board__title').catch(() => errors.push('the board did not come'));
      await page.waitForTimeout(500);
      const text = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#v .sf-view-board__title')).fontSize));
      const want = size === '1' ? 16 : 14;
      if (text !== want) failures.push({...label, got: `card title ${text} px`, want});
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, item: 'VHF-10', size, text});
      await context.close();
    }
    // VHF-4: the narrow fitted table.
    {
      const label = {theme, run, width: 390, item: 'VHF-4'};
      const {context, page, errors} = await load(theme, 390, NARROW(theme));
      await page.waitForFunction(() => document.querySelector('#t[data-sf-columns-fitted] tbody td[data-sf-cell="title"]'), null, {timeout: 15000})
        .catch(() => errors.push('the fitted table did not come'));
      await page.waitForTimeout(500);
      const names = () => page.evaluate(() => [...document.querySelectorAll('#t tbody td[data-sf-cell="title"] .sf-table-cell-text')].map((node) => {
        const lh = parseFloat(getComputedStyle(node).lineHeight);
        return {lines: Math.round(node.getBoundingClientRect().height / lh), cut: node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1};
      }));
      const set = (value) => page.evaluate((on) => document.getElementById('t').onTableSettingChanged({detail: {id: 'singleLine', value: on}, stopPropagation() {}, preventDefault() {}}), value);
      const unset = await names();
      await set(true); await page.waitForTimeout(400);
      const on = await names();
      await set(false); await page.waitForTimeout(400);
      const off = await names();
      if (unset.some((one) => one.lines !== 1) || !unset.some((one) => one.cut)) failures.push({...label, got: 'nothing chosen: not one cut line as before', unset});
      if (on.some((one) => one.lines !== 1)) failures.push({...label, got: 'on: not one line', on});
      if (off.some((one) => one.cut || one.lines > 2) || !off.some((one) => one.lines === 2)) failures.push({...label, got: 'off: the name not on its two lines, uncut', off});
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, item: 'VHF-4', width: 390, unset, on, off});
      await context.close();
    }
    // VRS-7, VRS-9 and the star at 1440 (in place, history beside); VRS-8 and the star at 390.
    for (const [width, panel] of [[1440, false], [1440, true], [390, true]]) {
      const label = {theme, run, width, panel};
      // The whole screen at 1440 (history beside the fields), a panel, a phone.
      const {context, page, errors} = await load(theme, width, CARD(theme, {panel, full: width === 1440 && !panel, sections: 3}));
      await page.waitForFunction(() => [...document.querySelectorAll('.sf-property-view-title, .sf-property-view-phone-sections, .sf-property-view-group')].some((node) => node.getBoundingClientRect().width > 0),
        null, {timeout: 15000}).catch(() => errors.push('the card did not come'));
      await page.waitForTimeout(800);
      if (width === 1440 && !panel) {
        const got = await page.evaluate(() => {
          const history = document.querySelector('.sf-property-view-history');
          // An entry's title (what changed), not its time or author line.
          const text = history ? [...history.querySelectorAll('*')].find((node) => node.children.length === 0 && /Сумма|создан/iu.test(node.textContent) && node.getBoundingClientRect().width > 0) : null;
          const value = [...document.querySelectorAll('.sf-property-view-group *')].find((node) => node.children.length === 0 && /Ромашка/u.test(node.textContent));
          const titles = [...document.querySelectorAll('.sf-property-view-group')].filter((node) => node.getBoundingClientRect().width > 0)
            .map((node) => node.querySelector('.sf-property-view-group-title')?.textContent.trim() ?? null);
          return {history: text ? parseFloat(getComputedStyle(text).fontSize) : null, field: value ? parseFloat(getComputedStyle(value).fontSize) : null, titles};
        });
        if (got.history === null || got.history !== got.field) failures.push({...label, item: 'VRS-7', got});
        if (got.titles[0] !== null && got.titles[0] !== undefined) failures.push({...label, item: 'VRS-9', got: `the only group of «Заказ» titled «${got.titles[0]}»`});
        if (errors.length) failures.push({...label, errors});
        if (run === 1) results.push({theme, item: 'VRS-7/9', width, ...got});
        await context.close();
        continue;
      }
      if (width === 390) {
        const got = await page.evaluate(() => {
          const list = document.querySelector('.sf-property-view-phone-sections');
          const rows = [...document.querySelectorAll('.sf-property-view-phone-sections .sf-list__row')].filter((node) => node.getBoundingClientRect().height > 0);
          // The list row of the size ladder: sf-list's own row of its size.
          const probe = document.createElement('div');
          probe.style.blockSize = 'var(--sf-list--row-height)';
          list?.querySelector('.sf-list')?.append(probe);
          const ladder = Math.round(probe.getBoundingClientRect().height);
          probe.remove();
          const after = rows[0] ? getComputedStyle(rows[0], '::after') : null;
          const text = rows[0]?.querySelector('sf-list-item > :first-child');
          return {rows: rows.length, height: rows[0] ? Math.round(rows[0].getBoundingClientRect().height) : null, ladder,
            chevron: Boolean(after && after.content !== 'none' && after.maskImage !== 'none' && parseFloat(after.width) > 0),
            textEnd: text && rows[0] ? Math.round(rows[0].getBoundingClientRect().right - text.getBoundingClientRect().right) : null};
        });
        if (got.rows !== 3 || got.height < Math.max(44, got.ladder) || !got.chevron) failures.push({...label, item: 'VRS-8', got});
        await page.locator('.sf-property-view-phone-sections .sf-list__row').nth(1).click({timeout: 5000}).catch(() => failures.push({...label, item: 'VRS-8', got: 'the section row could not be clicked'}));
        await page.waitForFunction(() => [...document.querySelectorAll('.sf-property-view-layout[data-screen="groups"]')].some((node) => node.getBoundingClientRect().height > 0), null, {timeout: 5000})
          .catch(() => failures.push({...label, item: 'VRS-8', got: 'a click on a section row did not open it'}));
        if (run === 1) results.push({theme, item: 'VRS-8', width, ...got});
        await page.locator('button[data-action="phone-back"], [data-action="phone-back"] button').first().click().catch(() => {});
        await page.waitForTimeout(300);
      }
      // The star: right after the one-line title; a click flips it.
      const star = await page.evaluate(() => {
        const native = [...document.querySelectorAll('button[data-action="favourite"], [data-action="favourite"] button')].find((node) => node.getClientRects().length);
        const button = native?.closest('sf-button-icon');
        const title = button?.parentElement?.querySelector('.sf-property-view-title');
        if (!native || !title) return null;
        const t = title.getBoundingClientRect();
        const s = native.getBoundingClientRect();
        return {gap: Math.round(s.left - t.right), lines: Math.round(t.height / parseFloat(getComputedStyle(title).lineHeight)),
          pressed: native.getAttribute('aria-pressed') ?? button.getAttribute('aria-pressed'), appearance: button.getAttribute('appearance')};
      });
      if (!star) failures.push({...label, item: 'star', got: 'no star'});
      else {
        if (star.lines !== 1 || star.gap < 0 || star.gap > 16) failures.push({...label, item: 'star', got: star});
        await page.locator('button[data-action="favourite"], [data-action="favourite"] button').first().click({timeout: 5000}).catch(() => failures.push({...label, item: 'star', got: 'the star could not be clicked'}));
        await page.waitForTimeout(300);
        const after = await page.evaluate(() => {
          const native = document.querySelector('button[data-action="favourite"], [data-action="favourite"] button');
          return native?.getAttribute('aria-pressed') ?? native?.closest('sf-button-icon')?.getAttribute('aria-pressed');
        });
        if (star.pressed !== 'false' || after !== 'true') failures.push({...label, item: 'star', got: `aria-pressed ${star.pressed} -> ${after}`});
        if (run === 1) results.push({theme, item: 'star', width, panel, ...star, after});
      }
      if (errors.length) failures.push({...label, errors});
      await context.close();
    }
  }
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('VIEW_ROUND_12_R3_OK');
