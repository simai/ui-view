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
  for (const cols of [4, 6]) {
  let body = LIST('light', {fields: 2}).replace("if(intent==='query.change'){", "if(intent==='query.change'){return new Promise(function(res){setTimeout(function(){res(port.raise2(intent,p))},2500)})}\n      if(intent==='query.change2'){");
  body = body.replace("customElements.whenDefined('sf-view')", "port.raise2=function(i,p){return port.raise(i+'2',p)};customElements.whenDefined('sf-view')");
  if (cols === 6) body = body.replace("{key:'amount',label:'Сумма'}];", "{key:'amount',label:'Сумма'},{key:'manager',label:'Менеджер'},{key:'city',label:'Город'}];").replace("amount:(10000+i*70)+',00 ₽'}", "amount:(10000+i*70)+',00 ₽',manager:'Мария',city:'Казань'}");
  const {context, page, errors} = await load('light', 390, body);
  await page.waitForTimeout(1200);
  const skel = await page.evaluate(() => { const r = document.querySelector('#v .sf-data-view-skeleton-list > div:not([data-list-head])'); return r ? {h: Math.round(r.getBoundingClientRect().height), html: r.outerHTML.slice(0, 300)} : null; });
  await page.waitForTimeout(3000);
  const real = await page.evaluate(() => { const r = document.querySelector('#v sf-view-table [data-row-id]'); return r ? {h: Math.round(r.getBoundingClientRect().height), parts: [...r.querySelectorAll('*')].filter((n) => n.children.length === 0 && n.textContent.trim()).map((n) => n.textContent.trim() + ':' + Math.round(n.getBoundingClientRect().top)).slice(0, 12)} : null; });
  console.log(cols, JSON.stringify({skel, real, errors}));
  await context.close();
  }
} finally { await browser.close(); }
