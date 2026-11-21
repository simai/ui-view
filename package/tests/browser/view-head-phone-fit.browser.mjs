#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Build output root is required: the free output with the set laid into
// smart/smart (scripts/run-browser-probes.mjs makes it).
//
// VR11-3 (view round 11, DEV msg-239b481d, study VHF-2): the phone head row
// of a list (the view-panel toggle, the filter, the search, «+» and the list
// menu) stays inside its list down to 320 px. The study saw the menu 25 px
// past a 326 px list; that list carried the study's own strip buttons
// («Колонки», «Вид» with their names, a page mock), which made the head 338
// px wide. The released head fits; this probe keeps it so. The page loads the
// set through the SIMAI Framework loader, as a site does; a host offers
// create-record and the list menu (record fields, export). Cases, light and
// dark, three loads each: a list of 320, 326, 360 and 390 px on a phone
// (viewport = list + 32) and in a box of that width on a 1440 window, with
// the view panel closed and opened by a real click on its toggle:
// - every button and the field of the head row ends inside the list;
// - the head is no wider than the list; the page does not scroll sideways;
// - console clean.
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
const PAGE = (theme, box) => `<!doctype html>
<html lang="ru" class="theme-${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/distr/core/css/core.css">
<script>
window.sfPath = '/distr/'; window.sfSmartPath = '/distr/';
window.SF_BOOT_CONFIG = {cacheVersion: 'r11', pluginListVersion: 'r11', preloader: {enabled: false}, packages: {view: {base: '/distr/smart/'}}};
</script>
<script src="/distr/core/lang/ru.js"></script>
<script src="/distr/core/js/core.js"></script>
<style>html,body{background:var(--sf-surface-page);margin:0}body{padding:16px}</style>
</head><body><main id="root"${box ? ` style="max-inline-size:${box}px"` : ''}>
<sf-view id="v" aria-label="Заказы" heading="Заказы" head="list" collection="orders" size="1/2" preferences-key="r11-phone-head">
  <sf-view-table slot="content" aria-label="Заказы"></sf-view-table>
  <sf-pagination slot="pagination" top="false" page-size="8" page-sizes="8,16"></sf-pagination>
</sf-view></main>
<script>
(function(){
  var ST=[{value:'new',label:'Новый'},{value:'paid',label:'Оплачен'},{value:'sent',label:'Отправлен'}];
  var FIELDS=[{key:'status',label:'Состояние',propertyType:'choice',filter:{options:ST}}];
  var COLS=[{key:'title',label:'Заказ',role:'title'},{key:'status',label:'Состояние',property_type:'choice',options:ST},{key:'client',label:'Клиент'},{key:'amount',label:'Сумма'}];
  var ROWS=[];for(var i=0;i<16;i++)ROWS.push({id:'h'+i,revision:'1',actions:['view'],title:'Заказ №'+(3001+i),status:ST[i%3].value,client:['ООО «Ромашка»','ИП Сидоров','АО «Вектор»'][i%3],amount:(1000+i*70)+' ₽'});
  var VIEWS=[{key:'all',label:'Все заказы',level:'system',revision:'1',query:{filters:{}}},{key:'paid',label:'Оплаченные',level:'system',revision:'1',query:{filters:{}}}];
  var view=document.getElementById('v'),table=view.querySelector('sf-view-table');
  var port={version:'1.15.0',capabilities:['row-actions','saved-views','personal-column-settings','create-record'],
    describe:function(){return {fields:FIELDS,layouts:['table','cards'],permissions:{record_fields:true,export:true}}},
    raise:function(intent,p){p=p||{};
      if(intent==='query.change'){var qy=p.query||{},per=+qy.per_page||8,page=+qy.page||1;
        return Promise.resolve({answer:'applied',sequence:p.sequence,data:{columns:COLS,records:ROWS.slice((page-1)*per,page*per),total:ROWS.length,saved_views:VIEWS,
          echo:{filters_chosen:qy.filters_chosen||['status'],filters:qy.filters||{},search:qy.search||'',sort:qy.sort||[],page:page,per_page:per,view:qy.view||{id:'all',type:'table'}}}})}
      if(intent==='view.open')return Promise.resolve({answer:'applied',data:{saved_views:VIEWS}});
      return Promise.resolve({answer:'applied'})}};
  customElements.whenDefined('sf-view').then(function(){table.setFilterFields&&table.setFilterFields(FIELDS);view.setHostPort(port)});
})();
</script></body></html>`;

const failures = [];
const results = [];
const browser = await chromium.launch();
const measure = (page) => page.evaluate(() => {
  const view = document.getElementById('v');
  const head = view.querySelector('.sf-view-head');
  const row = head?.querySelector('.sf-view-head-row');
  if (!row) return null;
  const list = view.getBoundingClientRect();
  const parts = [...row.querySelectorAll('button, input')].filter((node) => node.getClientRects().length && node.getBoundingClientRect().width > 0);
  const named = (node) => (node.getAttribute('aria-label') || node.tagName).slice(0, 24);
  return {list: Math.round(list.width), head: Math.round(head.getBoundingClientRect().width),
    phone: head.hasAttribute('data-phone'),
    parts: parts.map((node) => ({name: named(node), right: Math.round(node.getBoundingClientRect().right - list.right)})),
    menu: parts.some((node) => node.closest('.sf-view-head-more')), create: parts.some((node) => node.closest('.sf-view-head-create')),
    sideways: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1};
});
try {
  for (const theme of ['light', 'dark']) for (const width of [320, 326, 360, 390]) for (const where of ['phone', 'box']) for (let load = 1; load <= 3; load += 1) {
    const phone = where === 'phone';
    const context = await browser.newContext({viewport: {width: phone ? width + 32 : 1440, height: phone ? 844 : 900}, colorScheme: theme});
    await context.route('http://probe.test/**', (route) => {
      const path = decodeURIComponent(new URL(route.request().url()).pathname);
      if (path === '/') return route.fulfill({status: 200, contentType: 'text/html; charset=utf-8', body: PAGE(theme, phone ? null : width)});
      const target = file(path);
      if (!target) return route.fulfill({status: 404, body: ''});
      const type = TYPES[extname(target)] ?? 'application/octet-stream';
      return route.fulfill({status: 200, contentType: /^(text|application\/json)/u.test(type) ? `${type}; charset=utf-8` : type, body: readFileSync(target)});
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`error: ${message.text()}`); });
    page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto('http://probe.test/');
    await page.waitForFunction(() => document.querySelectorAll('#v sf-view-table [data-row-id]').length > 0
      && document.querySelector('#v .sf-view-head-more button')?.getClientRects().length, null, {timeout: 15000}).catch(() => errors.push('the list and its head did not come'));
    await page.waitForTimeout(400);
    const closed = await measure(page);
    await page.locator('#v .sf-view-head-zone-toggle button').first().click().catch(() => errors.push('no view-panel toggle to press'));
    await page.waitForTimeout(500);
    const opened = await measure(page);
    for (const [state, got] of [['closed', closed], ['opened', opened]]) {
      const label = {theme, width, where, load, state};
      if (!got) { failures.push({...label, got: 'no head row'}); continue; }
      const past = got.parts.filter((part) => part.right > 0);
      if (!got.phone || !got.menu || !got.create) failures.push({...label, got: 'not the phone head with «+» and the list menu', detail: got});
      if (past.length || got.head > got.list || got.sideways) failures.push({...label, past, head: got.head, list: got.list, sideways: got.sideways});
    }
    if (errors.length) failures.push({theme, width, where, load, errors});
    if (load === 1) results.push({theme, width, where, closed, opened: opened && {head: opened.head, edge: Math.max(...opened.parts.map((part) => part.right))}});
    await context.close();
  }
  console.log(JSON.stringify(results.map((one) => ({theme: one.theme, width: one.width, where: one.where, list: one.closed?.list, head: one.closed?.head,
    edge: one.closed ? Math.max(...one.closed.parts.map((part) => part.right)) : null, opened: one.opened}))));
} finally {
  await browser.close();
}
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('VIEW_HEAD_PHONE_FIT_OK');
