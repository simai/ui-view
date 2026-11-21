#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Build output root is required: the free output with the set laid into
// smart/smart (scripts/run-browser-probes.mjs makes it).
//
// View round 13, the round 5 returns of the list head and footer study (DEV
// msg-b581533a; owner: everything in the list can be set or switched off
// from the backend or by a call). Light and dark, three loads each, at 1440,
// 1280, 1024 and 390; real clicks where a person clicks; console clean.
// - VR5-1, VR5-2, VR5-5 (look), VR5-6: chrome="toolbar search pagination"
//   draws the search alone in the head row: «Фильтр» with its bookmark and
//   fields, «Настроить вид» and «По 20» take no box, the head row stands at
//   the control height (no gap where they stood), the footer keeps its range
//   and pages. chrome naming filter and look keeps those and drops the
//   search; a page that names no part (chrome="toolbar pagination") keeps
//   everything, as before.
// - VR5-2: a host that describes no filter field gets no «Фильтр».
// - head.chrome of the view document hides what chrome does; a call
//   (view.chrome = [...], view.setChrome()) changes the head at once.
// - A head row left with nothing in it is not drawn: the table starts the
//   same distance under the title as under a full head row.
// - VR5-5: head.look names the rows of «Настроить вид», opened by real
//   clicks: only density and paging are there.
// - VR5-10: with no row menu (no row-actions capability) and no bulk
//   actions the table draws no first column; with them the column is there.
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

const LIST = (theme, {chrome = null, caps = ['row-actions', 'saved-views', 'personal-column-settings', 'create-record'], fields = true,
  head = null, bulk = true, layouts = "['table','cards','board']"} = {}) => `${HEAD(theme)}
<sf-view id="v" aria-label="Заказы" heading="Заказы" head="list" collection="orders" size="1/2"${chrome === null ? '' : ` chrome="${chrome}"`}>
  <sf-view-table slot="content" aria-label="Заказы"></sf-view-table>
  <sf-pagination slot="pagination" top="false" page-size="20"${bulk ? ' actions="paid:Отметить оплаченными|archive:В архив"' : ''}></sf-pagination>
</sf-view>
<div style="block-size:400px"></div></main>
<script>
(function(){
  var ST=[{value:'new',label:'Новый'},{value:'paid',label:'Оплачен'},{value:'sent',label:'Отправлен'}];
  var FIELDS=${fields} ? [{key:'status',label:'Состояние',propertyType:'choice',filter:{options:ST}},{key:'client',label:'Клиент',propertyType:'string'}] : [];
  var COLS=[{key:'title',label:'Заказ',role:'title'},{key:'status',label:'Состояние',property_type:'choice',options:ST},{key:'client',label:'Клиент'},{key:'amount',label:'Сумма',property_type:'number'}];
  var ROWS=[];for(var i=0;i<48;i++)ROWS.push({id:'o'+i,revision:'1',actions:['view','delete'],title:'Заказ №'+(2001+i),status:ST[i%3].value,client:i%2?'ООО «Северное сияние»':'ИП Орлов',amount:(10000+i*70)+',00 ₽'});
  var view=document.getElementById('v');
  var port={version:'1.15.0',capabilities:${JSON.stringify(caps)},
    describe:function(){return {fields:FIELDS,layouts:${layouts},permissions:{record_fields:true}}},
    raise:function(intent,p){p=p||{};
      if(intent==='query.change'){var qy=p.query||{},per=+qy.per_page||20,page=+qy.page||1;
        return Promise.resolve({answer:'applied',sequence:p.sequence,data:{columns:COLS,records:ROWS.slice((page-1)*per,page*per),total:ROWS.length,
          view_config:${head ? `{head:${JSON.stringify(head)}}` : '{}'},
          echo:{filters_chosen:qy.filters_chosen||(FIELDS.length?['status']:[]),filters:qy.filters||{},search:qy.search||'',sort:qy.sort||[],page:page,per_page:per,view:qy.view||{id:'all',type:'table'}}}})}
      return Promise.resolve({answer:'applied'})}};
  customElements.whenDefined('sf-view').then(function(){view.setHostPort(port)});
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
const ready = (page) => page.waitForFunction(() => document.querySelectorAll('#v sf-view-table :is(tbody tr, li)[data-row-id]').length > 0
  && document.querySelector('#v .sf-view-head [data-name]')?.textContent, null, {timeout: 15000});

// What the head and footer draw: each part's box (null when it takes none),
// the head row's height and the distance from the title to the list.
const parts = (page) => page.evaluate(() => {
  const view = document.getElementById('v');
  // A host drawn as display: contents (sf-button) is read by its first boxed child.
  const box = (selector) => {
    for (const node of view.querySelectorAll(selector)) {
      const target = node.getClientRects().length ? node : [...node.querySelectorAll('*')].find((element) => element.getClientRects().length);
      const rect = target?.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) return {w: Math.round(rect.width), h: Math.round(rect.height)};
    }
    return null;
  };
  const row = view.querySelector('.sf-view-head-row');
  const title = view.querySelector('.sf-view-head-title')?.getBoundingClientRect();
  const list = [...view.querySelectorAll('sf-view-table :is(table, .sf-table-list)')].find((node) => node.getClientRects().length)?.getBoundingClientRect();
  const firstCell = view.querySelector('sf-view-table tbody tr[data-row-id] > :first-child');
  return {
    search: box('.sf-view-head-search'),
    filter: box(':is([data-filter-group], .sf-view-head-filter-icon)'),
    fields: box('.sf-view-head-fields > *'),
    look: box(':is(.sf-view-head-customize, .sf-view-head-tune)'),
    zone: box('.sf-view-head-zone-toggle'),
    size: box('.sf-view-footer-size'),
    range: view.querySelector('.sf-view-footer-range')?.textContent ?? '',
    row: row && row.getClientRects().length ? Math.round(row.getBoundingClientRect().height) : 0,
    control: box('.sf-view-head-title :is(sf-button, sf-button-icon), .sf-view-head :is(.sf-view-head-zone-toggle, .sf-view-head-more, .sf-view-head-create)')?.h ?? 32,
    titleToList: title && list ? Math.round(list.top - title.bottom) : null,
    settingsColumn: box('sf-view-table th[data-key="settings"]'),
    firstCell: firstCell ? `${firstCell.tagName.toLowerCase()}:${firstCell.getAttribute('data-key') ?? ''}:${Math.round(firstCell.getBoundingClientRect().width)}` : null,
  };
});

// «Настроить вид» by real clicks, the setting rows it shows.
const lookRows = async (page) => {
  const zone = await page.evaluate(() => {
    const node = document.querySelector('#v .sf-view-head-zone');
    return Boolean(node && !node.hidden && node.getClientRects().length);
  });
  if (!zone) await page.locator('#v .sf-view-head-zone-toggle button').click({timeout: 5000});
  await page.locator('#v :is(.sf-view-head-customize, .sf-view-head-tune) button').first().click({timeout: 5000});
  await page.waitForFunction(() => [...document.querySelectorAll('[data-setting]')].some((node) => node.getClientRects().length), null, {timeout: 5000});
  return page.evaluate(() => [...new Set([...document.querySelectorAll('[data-setting]')].filter((node) => node.getClientRects().length).map((node) => node.getAttribute('data-setting')))]);
};

const themes = QUICK ? ['light'] : ['light', 'dark'];
const widths = QUICK ? [QUICK_WIDTH] : [1440, 1280, 1024, 390];
const loads = QUICK ? 1 : 3;
const check = (label, ok, got, want) => { if (!ok) failures.push({...label, got, want}); };
try {
  for (const theme of themes) for (const width of widths) for (let run = 1; run <= loads; run += 1) {
    const phone = width < 768;
    const step = async (item, options, verify) => {
      const label = {theme, width, run, item};
      const {context, page, errors} = await load(theme, width, LIST(theme, options));
      await ready(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(400);
      const got = await parts(page);
      await verify(label, got, page, errors).catch((error) => errors.push(`step: ${error.message.slice(0, 120)}`));
      if (errors.length) failures.push({...label, errors});
      results.push({theme, width, run, item, ...got});
      await context.close();
      return got;
    };
    const full = await step('default (no chrome)', {}, async (label, got) => {
      check(label, got.search && got.filter && got.size && got.zone, got, 'search, «Фильтр», «По 20» and the zone toggle drawn');
    });
    await step('chrome="toolbar pagination" keeps every part', {chrome: 'toolbar pagination'}, async (label, got) => {
      check(label, got.search && got.filter && got.size, got, 'every part, as before');
    });
    await step('chrome search alone', {chrome: 'toolbar search pagination'}, async (label, got, page) => {
      check(label, got.search && !got.filter && !got.fields && !got.size, got, 'search only; no «Фильтр», fields, «По 20»');
      check(label, /из 48/u.test(got.range), got.range, 'the footer keeps its range');
      check(label, got.row > 0 && got.row <= got.control + 1, got.row, 'the head row at the control height');
      // «Настроить вид» is gone from the zone too (look not named).
      const zoneOpen = await page.locator('#v .sf-view-head-zone-toggle button').isVisible().catch(() => false);
      if (zoneOpen) await page.locator('#v .sf-view-head-zone-toggle button').click();
      await page.waitForTimeout(200);
      const after = await parts(page);
      check(label, !after.look, after.look, 'no «Настроить вид»');
    });
    await step('chrome filter and look, no search', {chrome: 'toolbar filter look pagination page-size'}, async (label, got, page) => {
      check(label, !got.search && got.filter && got.size, got, '«Фильтр» and «По 20», no search');
      const rows = await lookRows(page).catch((error) => [`failed ${error.message.slice(0, 60)}`]);
      check(label, rows.includes('columns'), rows, '«Настроить вид» opens by a click');
    });
    await step('no filter fields', {fields: false}, async (label, got) => {
      check(label, !got.filter && got.search, got, 'no «Фильтр» without fields; the search stays');
    });
    await step('head.chrome of the view document', {head: {chrome: ['search']}}, async (label, got) => {
      check(label, got.search && !got.filter && got.size, got, 'search only in the head; the footer untouched');
    });
    await step('a call: view.chrome and setChrome', {}, async (label, got, page, errors) => {
      await page.evaluate(() => { document.getElementById('v').chrome = ['toolbar', 'filter', 'pagination']; });
      await page.waitForTimeout(300);
      const first = await parts(page);
      check(label, !first.search && first.filter && !first.size, first, 'view.chrome = [toolbar, filter, pagination]: no search, no «По 20»');
      await page.evaluate(() => document.getElementById('v').setChrome(null)).catch((error) => errors.push(`setChrome: ${error.message.slice(0, 80)}`));
      await page.waitForTimeout(300);
      const back = await parts(page);
      check(label, back.search && back.filter && back.size, back, 'setChrome(null) brings every part back');
    });
    await step('an emptied head row is not drawn', {chrome: 'toolbar pagination look', caps: ['row-actions']}, async (label, got) => {
      check(label, got.row === 0, got.row, 'no head row');
      check(label, got.titleToList !== null && full.titleToList !== null && got.titleToList < full.titleToList, {empty: got.titleToList, full: full.titleToList}, 'the list moves up by the row');
    });
    await step('head.look rows', {head: {look: ['density', 'paging']}}, async (label, got, page) => {
      const rows = await lookRows(page).catch((error) => [`failed ${error.message.slice(0, 60)}`]);
      check(label, rows.length > 0 && rows.every((key) => ['density', 'paging'].includes(key)) && rows.includes('density'), rows, 'only density and paging');
    });
    if (!phone) {
      await step('VR5-10 no row menu, no bulk', {caps: ['saved-views'], bulk: false}, async (label, got) => {
        check(label, !got.settingsColumn && !/settings/u.test(got.firstCell ?? ''), got, 'no first column');
      });
      await step('VR5-10 row menu kept', {}, async (label, got) => {
        check(label, Boolean(got.settingsColumn) || /settings|select/u.test(got.firstCell ?? ''), got, 'the row menu column stays');
      });
    }
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 1));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('VIEW_ROUND_13_CHROME_OK');
