#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Build output root is required: the free output with the set laid into
// smart/smart (scripts/run-browser-probes.mjs makes it).
//
// View round 13 (owner decisions D1, D3 relayed by DEV msg-4de06ae6; DEV
// msg-14d27cac returns VHF-13..16 from the study view-head-footer round 4).
// The page loads the set through the SIMAI Framework loader, as a site does.
// Light and dark, three loads each, at 1440, 1280, 1024 and 390; real clicks
// and real wheel scrolls where a person clicks and scrolls; console clean.
// - D1: a table list of 48 records, 20 a page, goes on «Вместе» by default:
//   «Показать ещё 20» across the list right under its last row (half a space
//   step), the page numbers in the footer below it, «1–20 из 48» at its
//   start. A click appends the next page (40 rows, «1–40 из 48», «Показать
//   ещё 8»), a second the last one (48 rows, the button gone). «Настроить
//   вид» → «Подгрузка»: «Страницами» takes the button away and keeps the
//   numbers; «Показать ещё» keeps the button and hides the numbers;
//   «Бесконечно» stays one page at rest and loads the next pages as the
//   person's scroll brings the button into view. Each choice is saved for the person (settings.save,
//   layouts.table.paging).
// - D3: on the cards each field is its label over its value, one field per
//   line at the same start, the first one half a space step further from the
//   title than the card's own gap.
// - VHF-13: on the board «Настроить вид» lists the record's own fields
//   («Сумма», no filter field) and a field ticked there shows on the cards at
//   once; on the cards a size chosen there draws at once.
// - VHF-14 / VHF-15: a long list scrolled by real wheel steps, read on every
//   frame: the list head (search, filter fields) holds the top with its title
//   gone, the table head sits right under it (0 px apart on every frame), in
//   the page and inside a scrolling box.
// - VHF-16: 18 columns that do not fit keep their natural widths (no cell
//   cut: the name and the INN whole), the table goes sideways under the rail
//   by a real sideways wheel, the box, the row menu and the name stay put.
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

// A list of orders: 48 records, 20 a page; optionally many columns (VHF-16),
// in a scrolling box (VHF-15), as cards or a board.
const LIST = (theme, {layout = '', cols = 4, rows = 48, perPage = 20, box = false, key = 'a'} = {}) => `${HEAD(theme)}
${box ? '<div id="box" style="block-size:600px;overflow:auto;border:1px solid var(--sf-outline-variant)">' : ''}
<sf-view id="v" aria-label="Заказы" heading="Заказы" head="list" collection="orders" size="1/2"${layout ? ` layout="${layout}"` : ''} preferences-key="r13-${key}-${layout}-${cols}">
  ${layout ? '' : '<sf-view-table slot="content" aria-label="Заказы"></sf-view-table>'}
  <sf-pagination slot="pagination" top="false" page-size="${perPage}" actions="paid:Отметить оплаченными|archive:В архив"></sf-pagination>
</sf-view>${box ? '</div>' : ''}
<div style="block-size:400px"></div></main>
<script>
(function(){
  var ST=[{value:'new',label:'Новый'},{value:'paid',label:'Оплачен'},{value:'sent',label:'Отправлен'}];
  var FIELDS=[{key:'status',label:'Состояние',propertyType:'choice',filter:{options:ST}},{key:'client',label:'Клиент',propertyType:'string'},{key:'due',label:'Срок',propertyType:'date'}];
  var COLS=[{key:'title',label:'Заказ',role:'title'},{key:'status',label:'Состояние',property_type:'choice',options:ST},{key:'client',label:'Клиент'},{key:'amount',label:'Сумма',property_type:'number'},{key:'due',label:'Срок',property_type:'date'}];
  var EXTRA=['inn','city','street','phone','email','manager','channel','payment','priority','method','comment','source','region'];
  var NAMES={inn:'ИНН',city:'Город',street:'Улица',phone:'Телефон',email:'Почта',manager:'Менеджер',channel:'Канал',payment:'Оплата',priority:'Срочность',method:'Способ доставки',comment:'Комментарий',source:'Источник',region:'Регион'};
  if (${cols} > 5) EXTRA.slice(0, ${cols} - 5).forEach(function(k){COLS.push({key:k,label:NAMES[k]})});
  var ROWS=[];for(var i=0;i<${rows};i++){var r={id:'o'+i,revision:'1',actions:['view','delete'],title:'Заказ №'+(2001+i),status:ST[i%3].value,client:i%2?'ООО «Торговый дом Северное сияние»':'ИП Орлов',amount:(10000+i*70)+',00 ₽',due:'2026-12-'+String(1+i%28).padStart(2,'0')};
    EXTRA.forEach(function(k){r[k]=k==='inn'?'77012345'+String(10+i):NAMES[k]+' — значение строки '+(i+1)});ROWS.push(r)}
  var saves=window.__saves=[];
  var view=document.getElementById('v');
  var port={version:'1.15.0',capabilities:['row-actions','saved-views','personal-column-settings','create-record'],
    describe:function(){return {fields:FIELDS,layouts:['table','cards','board'],permissions:{record_fields:true}}},
    raise:function(intent,p){p=p||{};
      if(intent==='settings.save'){saves.push(p);return Promise.resolve({answer:'applied'})}
      if(intent==='query.change'){var qy=p.query||{},per=+qy.per_page||${perPage},page=+qy.page||1;
        if(qy.window&&qy.window.per_page){per=+qy.window.per_page;page=+qy.window.page||1}
        var lanes=ST.map(function(s){var r=ROWS.filter(function(x){return x.status===s.value});return {value:s.value,label:s.label,records:r.slice(0,6),total:r.length}});
        return Promise.resolve({answer:'applied',sequence:p.sequence,data:{columns:COLS,records:ROWS.slice((page-1)*per,page*per),total:ROWS.length,lanes:qy.window&&('lanes' in qy.window)?lanes:undefined,board:{order_field:''},
          view_config:{layouts:{board:{lane_field:'status',card_fields:['client']},cards:{card_fields:['status','client','amount','due']}}},
          echo:{filters_chosen:qy.filters_chosen||['status','client'],filters:qy.filters||{},search:qy.search||'',sort:qy.sort||[],page:page,per_page:per,view:qy.view||{id:'all',type:'${layout || 'table'}'}}}})}
      return Promise.resolve({answer:'applied'})}};
  customElements.whenDefined('sf-view').then(function(){view.setHostPort(port)});
})();
</script></body></html>`;

const QUICK = process.env.R13_QUICK === '1';
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
const ready = (page, what = 'sf-view-table tbody [data-row-id]') => page.waitForFunction((selector) => document.querySelectorAll(`#v ${selector}`).length > 0
  && document.querySelector('#v .sf-view-head-row button')?.getClientRects().length, what, {timeout: 15000});

// The table list's paging as drawn.
const paging = (page) => page.evaluate(() => {
  const view = document.getElementById('v');
  const rows = [...view.querySelectorAll('sf-view-table tbody tr[data-row-id]')];
  const last = rows.at(-1)?.getBoundingClientRect();
  const holder = view.querySelector(':scope > [slot="more"]');
  const button = holder && !holder.hidden ? holder.querySelector('button') : null;
  const box = button?.getBoundingClientRect();
  const table = view.querySelector('sf-view-table .sf-table-scroll')?.getBoundingClientRect();
  const row = view.querySelector(':scope > sf-pagination[slot="pagination"]');
  const nav = row?.querySelector('nav')?.getBoundingClientRect() ?? null;
  return {
    rows: rows.length,
    range: view.querySelector('.sf-view-footer-range')?.textContent ?? '',
    more: button ? button.textContent.trim() : null,
    gap: button && last ? Math.round(box.top - last.bottom) : null,
    width: button && table ? Math.round(box.width - table.width) : null,
    pages: Boolean(nav && nav.height > 0),
    sideways: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  };
});

// «Настроить вид» by real clicks: the zone toggle when the zone is closed,
// then the customize button (a desktop popover or the phone's sheet).
const openCustomize = async (page) => {
  const zone = await page.evaluate(() => {
    const node = document.querySelector('#v .sf-view-head-zone');
    return Boolean(node && !node.hidden && node.getClientRects().length);
  });
  if (!zone) await page.locator('#v .sf-view-head-zone-toggle button').click({timeout: 5000});
  await page.locator('#v :is(.sf-view-head-customize, .sf-view-head-tune) button').first().click({timeout: 5000});
  await page.waitForFunction(() => [...document.querySelectorAll('[data-kind="view"], .sf-view-head-panel')].some((node) => node.querySelector('[data-setting]') && node.getClientRects().length), null, {timeout: 5000});
};
const pick = async (page, key, value) => {
  const radio = page.locator(`sf-radio[data-setting="${key}"][value="${value}"] input`).first();
  await radio.click({timeout: 5000, force: true});
};

try {
  const widths = QUICK ? [1440] : [1440, 1280, 1024, 390];
  for (const theme of QUICK ? ['light'] : ['light', 'dark']) for (let run = 1; run <= (QUICK ? 1 : 3); run += 1) for (const width of widths) {
    // D1: «Вместе» by default, real clicks on «Показать ещё».
    {
      const label = {theme, run, width, item: 'D1'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {key: `d1-${run}`}));
      await ready(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(400);
      const first = await paging(page);
      if (first.rows !== 20 || first.range !== '1–20 из 48' || first.more !== 'Показать ещё 20' || !first.pages) failures.push({...label, got: first, want: 'Вместе: 20 rows, «Показать ещё 20», numbers, «1–20 из 48»'});
      if (first.gap === null || first.gap < 8 || first.gap > 16) failures.push({...label, got: `the button ${first.gap} px under the last row`});
      if (first.width !== 0) failures.push({...label, got: `the button ${first.width} px off the list width`});
      if (first.sideways) failures.push({...label, got: 'the page scrolls sideways'});
      await page.locator('#v > [slot="more"] button').click({timeout: 5000});
      await page.waitForFunction(() => document.querySelectorAll('#v sf-view-table tbody tr[data-row-id]').length === 40, null, {timeout: 5000}).catch(() => {});
      await page.waitForTimeout(300);
      const second = await paging(page);
      if (second.rows !== 40 || second.range !== '1–40 из 48' || second.more !== 'Показать ещё 8') failures.push({...label, got: second, want: '40 rows, «1–40 из 48», «Показать ещё 8»'});
      await page.locator('#v > [slot="more"] button').click({timeout: 5000});
      await page.waitForFunction(() => document.querySelectorAll('#v sf-view-table tbody tr[data-row-id]').length === 48, null, {timeout: 5000}).catch(() => {});
      await page.waitForTimeout(300);
      const third = await paging(page);
      if (third.rows !== 48 || third.range !== '1–48 из 48' || third.more !== null) failures.push({...label, got: third, want: '48 rows, no button'});
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, item: 'D1 default', width, first, second, third});
      await context.close();
    }
    // VHF-14 / VHF-15: wheel steps, every frame.
    for (const box of width === 1440 || width === 390 ? [false, true] : [false]) {
      const label = {theme, run, width, box, item: 'VHF-14/15'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {rows: 60, perPage: 60, box, key: `st-${run}`}));
      await ready(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const view = document.getElementById('v');
        const head = view.querySelector(':scope > .sf-view-head');
        const row = head.querySelector('.sf-view-head-row');
        const title = head.querySelector('.sf-view-head-title');
        const thead = view.querySelector('sf-view-table thead');
        const scroller = document.getElementById('box');
        const top = () => (scroller ? scroller.getBoundingClientRect().top + scroller.clientTop : 0);
        window.__frames = [];
        const read = () => {
          window.__frames.push({row: Math.round(row.getBoundingClientRect().top - top()), title: Math.round(title.getBoundingClientRect().bottom - top()),
            gap: Math.round(thead.getBoundingClientRect().top - head.getBoundingClientRect().bottom), scrolled: Math.round(scroller ? scroller.scrollTop : scrollY)});
          if (window.__frames.length < 400) requestAnimationFrame(read);
        };
        requestAnimationFrame(read);
      });
      const target = box ? page.locator('#box') : page.locator('#v sf-view-table .sf-table-scroll');
      const area = await target.boundingBox();
      await page.mouse.move(Math.min(area.x + area.width / 2, width - 40), Math.min(area.y + 200, (width < 768 ? 844 : 900) - 50));
      for (let step = 0; step < 14; step += 1) { await page.mouse.wheel(0, 120); await page.waitForTimeout(40); }
      await page.waitForTimeout(300);
      const frames = await page.evaluate(() => window.__frames);
      const moving = frames.filter((frame) => frame.scrolled > 200);
      const rowTops = new Set(moving.map((frame) => frame.row));
      const gaps = new Set(moving.map((frame) => frame.gap));
      if (!moving.length) failures.push({...label, got: 'the wheel did not scroll the list', frames: frames.slice(-3)});
      if (rowTops.size !== 1 || [...rowTops][0] !== 0) failures.push({...label, got: `the head row top over the frames: ${[...rowTops].join(', ')}`});
      if (gaps.size !== 1 || [...gaps][0] !== 0) failures.push({...label, got: `the table head off the list head over the frames: ${[...gaps].join(', ')}`});
      if (moving.some((frame) => frame.title > 0)) failures.push({...label, got: 'the title stayed'});
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, item: 'VHF-14/15', width, box, frames: frames.length, moving: moving.length, rowTops: [...rowTops], gaps: [...gaps]});
      await context.close();
    }
    // VHF-16: 18 columns that do not fit.
    if (width !== 390) {
      const label = {theme, run, width, item: 'VHF-16'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {cols: 18, key: `cols-${run}`}));
      await ready(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(700);
      const read = () => page.evaluate(() => {
        const table = document.querySelector('#v sf-view-table');
        const area = table.querySelector('.sf-table-scroll');
        const row = table.querySelector('tbody tr[data-row-id]');
        const cut = [...row.querySelectorAll('td')].filter((cell) => !['select', 'settings'].includes(cell.dataset.key)).filter((cell) => {
          const inner = cell.querySelector('.sf-table-cell-value, .sf-table-title-link, span') ?? cell;
          return inner.scrollWidth > inner.clientWidth + 1 || cell.scrollWidth > cell.clientWidth + 1;
        }).map((cell) => cell.dataset.key);
        const width = (key) => Math.round(table.querySelector(`thead th[data-key="${key}"]`)?.getBoundingClientRect().width ?? 0);
        const at = (key) => Math.round(row.querySelector(`td[data-key="${key}"]`)?.getBoundingClientRect().left ?? 0);
        const rail = table.querySelector('.sf-table-rail');
        return {table: Math.round(table.querySelector('table').offsetWidth), area: Math.round(area.clientWidth), cut, title: width('title'), inn: width('inn'),
          x: {select: at('select'), settings: at('settings'), title: at('title'), city: at('city')}, rail: rail && !rail.hidden ? rail.scrollLeft : null,
          sideways: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1};
      });
      const before = await read();
      // The pointer over the visible part of the rows (the table runs past the window).
      const area = await page.locator('#v sf-view-table .sf-table-scroll').boundingBox();
      await page.mouse.move(Math.min(area.x + area.width / 2, width - 40), Math.min(area.y + 80, 850));
      for (let step = 0; step < 4; step += 1) { await page.mouse.wheel(150, 0); await page.waitForTimeout(60); }
      await page.waitForTimeout(300);
      const after = await read();
      if (before.table <= before.area) failures.push({...label, got: `the table ${before.table} fits ${before.area}`});
      if (before.cut.length) failures.push({...label, got: `cells cut: ${before.cut.join(', ')}`});
      if (before.rail === null) failures.push({...label, got: 'no rail'});
      if (!(after.rail > 0) || after.x.city >= before.x.city) failures.push({...label, got: 'a sideways wheel did not move the table', before, after});
      if (after.x.select !== before.x.select || after.x.title !== before.x.title || after.x.settings !== before.x.settings) failures.push({...label, got: 'a pinned cell moved', before: before.x, after: after.x});
      if (before.sideways || after.sideways) failures.push({...label, got: 'the page scrolls sideways'});
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, item: 'VHF-16', width, before, after});
      await context.close();
    }
  }

  // The rest at 1440 and 390, light and dark.
  for (const theme of QUICK ? ['light'] : ['light', 'dark']) for (const width of QUICK ? [1440] : [1440, 390]) {
    // D1: the paging row of «Настроить вид».
    {
      const label = {theme, width, item: 'D1 setting'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {key: 'd1s'}));
      await ready(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(400);
      const seen = {};
      for (const value of ['pages', 'more', 'endless', 'both']) {
        await openCustomize(page).catch((error) => errors.push(`«Настроить вид» did not open: ${error.message.slice(0, 80)}`));
        await pick(page, 'paging', value).catch((error) => errors.push(`«${value}» could not be picked: ${error.message.slice(0, 80)}`));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
        seen[value] = await paging(page);
      }
      const saves = await page.evaluate(() => window.__saves.map((save) => save.patch?.paging).filter(Boolean));
      if (seen.pages?.more !== null || !seen.pages?.pages) failures.push({...label, got: seen.pages, want: '«Страницами»: numbers, no button'});
      if (seen.more?.more !== 'Показать ещё 20' || seen.more?.pages) failures.push({...label, got: seen.more, want: '«Показать ещё»: the button, no numbers'});
      if (seen.endless?.more !== 'Показать ещё 20' || seen.endless?.pages) failures.push({...label, got: seen.endless, want: '«Бесконечно»: the button kept, no numbers'});
      if (seen.both?.more !== 'Показать ещё 20' || !seen.both?.pages) failures.push({...label, got: seen.both, want: '«Вместе»: both'});
      if (saves.join(',') !== 'pages,more,endless,both') failures.push({...label, got: `saved ${saves.join(',')}`});
      // «Бесконечно»: the person's scroll brings the button into view and the next page comes by itself.
      await openCustomize(page).catch(() => {});
      await pick(page, 'paging', 'endless').catch(() => {});
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const idle = await paging(page);
      await page.mouse.move(200, 400);
      for (let step = 0; step < 20; step += 1) { await page.mouse.wheel(0, 200); await page.waitForTimeout(50); }
      await page.waitForFunction(() => document.querySelectorAll('#v sf-view-table tbody tr[data-row-id]').length > 20, null, {timeout: 5000}).catch(() => {});
      await page.waitForTimeout(300);
      const endless = await paging(page);
      // At rest the list stays one page; the scroll brings the next pages,
      // a page per scroll that reaches the button, never past the 48.
      if (idle.rows !== 20 || endless.rows <= 20 || endless.rows > 48 || endless.rows % 20 !== 0 && endless.rows !== 48) failures.push({...label, got: {idle: idle.rows, scrolled: endless.rows}, want: 'endless: 20 at rest, more pages after the scroll'});
      if (errors.length) failures.push({...label, errors});
      results.push({theme, item: 'D1 setting', width, seen, saves, endless: {idle: idle.rows, scrolled: endless.rows}});
      await context.close();
    }
    // D3: stacked card fields.
    {
      const label = {theme, width, item: 'D3'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {layout: 'cards', key: 'd3'}));
      await ready(page, '.sf-view-cards__card .sf-view-cards__field').catch(() => errors.push('the cards did not come'));
      await page.waitForTimeout(500);
      const got = await page.evaluate(() => {
        const card = document.querySelector('#v .sf-view-cards__card');
        const title = card.querySelector('.sf-view-cards__title').getBoundingClientRect();
        const fields = [...card.querySelectorAll('.sf-view-cards__field')];
        const rect = (node) => node?.getBoundingClientRect();
        const gap = parseFloat(getComputedStyle(card).rowGap) || 0;
        return {
          count: fields.length,
          stacked: fields.every((field) => { const l = rect(field.querySelector('.sf-view-cards__label')); const v = rect(field.querySelector('.sf-view-cards__value')); return l && v && l.bottom <= v.top + 0.5 && Math.abs(l.left - v.left) < 1; }),
          oneStart: new Set(fields.map((field) => Math.round(rect(field).left))).size === 1,
          oneByOne: fields.every((field, at) => at === 0 || rect(field).top >= rect(fields[at - 1]).bottom - 0.5),
          afterTitle: Math.round(rect(fields[0]).top - title.bottom),
          cardGap: Math.round(gap),
          between: fields.length > 1 ? Math.round(rect(fields[1]).top - rect(fields[0]).bottom) : null,
          labels: fields.map((field) => field.querySelector('.sf-view-cards__label')?.textContent),
        };
      });
      if (got.count !== 4 || !got.stacked || !got.oneStart || !got.oneByOne) failures.push({...label, got});
      if (got.afterTitle <= got.cardGap) failures.push({...label, got: `the first field ${got.afterTitle} px under the title, the card gap ${got.cardGap}`});
      if (errors.length) failures.push({...label, errors});
      results.push({theme, item: 'D3', width, ...got});
      await context.close();
    }
    // VHF-13: board fields from the record, applied at once; cards size at once.
    {
      const label = {theme, width, item: 'VHF-13 board'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {layout: 'board', key: 'b13'}));
      await ready(page, 'sf-view-board [data-id], sf-view-board .sf-view-board__card').catch(() => errors.push('the board did not come'));
      await page.waitForTimeout(600);
      const cardText = () => page.evaluate(() => document.querySelector('#v sf-view-board [data-id], #v sf-view-board .sf-view-board__card')?.textContent ?? '');
      const before = await cardText();
      await openCustomize(page).catch((error) => errors.push(`«Настроить вид» did not open: ${error.message.slice(0, 80)}`));
      const listed = await page.evaluate(() => [...document.querySelectorAll('sf-checkbox[data-setting="card_fields"]')].map((box) => box.getAttribute('label')));
      await page.locator('sf-checkbox[data-setting="card_fields"][data-value="amount"] input').first().click({timeout: 5000, force: true}).catch(() => errors.push('«Сумма» could not be ticked'));
      await page.waitForTimeout(500);
      const after = await cardText();
      if (!listed.includes('Сумма')) failures.push({...label, got: `listed ${listed.join(', ')}`});
      if (listed.includes('Срок') && !listed.includes('Сумма')) failures.push({...label, got: 'the filter fields listed'});
      if (before.includes('10000') || !after.includes('10000')) failures.push({...label, got: {before: before.slice(0, 80), after: after.slice(0, 80)}, want: 'the sum on the card at once'});
      if (errors.length) failures.push({...label, errors});
      results.push({theme, item: 'VHF-13 board', width, listed, before: before.slice(0, 60), after: after.slice(0, 80)});
      await context.close();
    }
    {
      const label = {theme, width, item: 'VHF-13 cards'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {layout: 'cards', key: 'c13'}));
      await ready(page, '.sf-view-cards__card').catch(() => errors.push('the cards did not come'));
      await page.waitForTimeout(500);
      const size = () => page.evaluate(() => document.querySelector('#v .sf-view-cards')?.getAttribute('data-card-size'));
      const before = await size();
      await openCustomize(page).catch((error) => errors.push(`«Настроить вид» did not open: ${error.message.slice(0, 80)}`));
      await pick(page, 'size', 'l').catch(() => errors.push('«L» could not be picked'));
      await page.waitForTimeout(500);
      const after = await size();
      if (before !== 'm' || after !== 'l') failures.push({...label, got: {before, after}});
      if (errors.length) failures.push({...label, errors});
      results.push({theme, item: 'VHF-13 cards', width, before, after});
      await context.close();
    }
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 1));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('VIEW_ROUND_13_OK');
