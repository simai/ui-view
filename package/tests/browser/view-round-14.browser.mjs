#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Build output root is required: the free output with the set laid into
// smart/smart (scripts/run-browser-probes.mjs makes it).
//
// View round 14: the owner decisions C403-C408 (DEV msg-3ed3de7b), the list
// study v2 returns LV2-2 and LV2-7 (msg-04ef4018), DEV's answers on round 13
// (the cards' «Подгрузка», the record's badge row) and the owner's list
// review v3 (msg-2733819c: LV3-9, 11, 12, 13, 16, 20, 21, 23, 24). Light and
// dark, three loads each, at 1440, 1280, 1024 and 390; real clicks; console
// clean.
// - C404: the search framed, «Создать» and «⋯» as tall as it; the
//   presentation strip framed with «Колонки» and «Вид» at its end; the footer
//   the table's last band: the range at the start, the pages centred, «По 10»
//   at the end. C407 / LV3-9: «⋯» is more_horiz, outline by default.
// - C405: «Вид» is the drill menu; «Плотность» → «Компактная» by real clicks
//   makes the rows shorter at once. C408: a second list of the same person
//   (another preferences key) opens compact with nothing chosen.
// - C406 / LV3-20 / LV3-21: the gear above «≡» is drawn under the list head
//   and opens the column window; «Колонки» opens the same window; it holds no
//   «Просторно» and no «Для всех моих таблиц». LV3-11: «На телефоне» in it; a
//   field switched on there by a real click shows in the phone row.
// - LV2-2: marks on page 1 and page 2 add up. C413 (view round 15m): each
//   presentation keeps its own marks: the cards start unmarked, a card marked
//   there stays the cards' own, and the table's three come back with the
//   table. LV2-7: «Выбрать все 48» marks the table's 48 and stays the table's.
// - D1 for the cards: «Вид» → «Подгрузка» → «Страницы» takes «Показать ещё»
//   away at once.
// - LV3-12: a fact column's plain money is its formatted value in a table
//   cell, never a badge. LV3-13 / LV3-24: the phone row says the money
//   formatted, every figure whole (the due date too), the state's word.
// - LV3-16: the board card's box, title line and «⋯» on one centre line.
// - LV3-23: the saved filter rows' menu is more_horiz.
// - C403: a record card docked beside the list draws the narrow rail of its
//   sections while the fields keep 20rem, else the section list with «←»;
//   no tabs on top. The badge row on the label's baseline.
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
window.SF_BOOT_CONFIG = {cacheVersion: 'r14', pluginListVersion: 'r14', preloader: {enabled: false}, packages: {view: {base: '/distr/smart/'}}};
</script>
<script src="/distr/core/lang/ru.js"></script>
<script src="/distr/core/js/core.js"></script>
<style>html,body{background:var(--sf-surface-page);margin:0}body{padding:16px}</style>
</head><body><main id="root">`;

// A list of 48 orders: the status a choice with colours (two of three), the
// sum money and the due date a date, both phone-row facts (columns[].list),
// bulk actions, three display kinds, one saved filter.
const LIST = (theme, {key = 'a', layout = ''} = {}) => `${HEAD(theme)}
<sf-view id="v" aria-label="Заказы" heading="Заказы" head="list" collection="orders" size="1/2" preferences-key="r14-${key}"${layout ? ` layout="${layout}"` : ''}>
  ${layout ? '' : '<sf-view-table slot="content" aria-label="Заказы"></sf-view-table>'}
  <sf-pagination slot="pagination" top="false" page-size="10" show-action-for-all actions="paid:Отметить оплаченными|archive:В архив"></sf-pagination>
</sf-view>
<div style="block-size:300px"></div></main>
<script>
(function(){
  var ST=[{value:'new',label:'Новый',scheme:'info'},{value:'paid',label:'Оплачен',scheme:'success'},{value:'sent',label:'Отправлен'}];
  var FIELDS=[{key:'status',label:'Состояние',propertyType:'choice',filter:{options:ST}}];
  var COLS=[{key:'title',label:'Заказ',role:'title',list:'title'},{key:'status',label:'Состояние',property_type:'choice',options:ST,list:'status'},
    {key:'client',label:'Клиент',list:'supporting'},{key:'amount',label:'Сумма',property_type:'money',list:'fact'},{key:'due',label:'Срок',property_type:'date',list:'fact'},
    {key:'manager',label:'Менеджер'},{key:'inn',label:'ИНН'}];
  var ROWS=[];for(var i=0;i<48;i++)ROWS.push({id:'o'+i,revision:'1',actions:['view'],title:'Заказ №'+(2001+i),status:ST[i%3].value,
    client:'ООО «Ромашка» '+i,amount:9800+i*2650,due:'2026-12-'+String(1+i%28).padStart(2,'0'),manager:'Анна Смирнова',inn:'77012345'+String(10+i)});
  var view=document.getElementById('v');
  var port={version:'1.15.0',capabilities:['row-actions','saved-views','personal-column-settings','create-record'],
    describe:function(){return {fields:FIELDS,layouts:['table','cards','board'],permissions:{record_fields:true}}},
    raise:function(intent,p){p=p||{};
      if(intent==='query.change'){var qy=p.query||{},per=+qy.per_page||10,page=+qy.page||1;
        if(qy.window&&qy.window.per_page){per=+qy.window.per_page;page=+qy.window.page||1}
        var lanes=view.getAttribute('layout')==='board'&&ST.map(function(s){var r=ROWS.filter(function(x){return x.status===s.value}).slice(0,6);return {value:s.value,label:s.label,records:r,total:16}});
        return Promise.resolve({answer:'applied',sequence:p.sequence,data:{columns:COLS,records:ROWS.slice((page-1)*per,page*per),total:ROWS.length,lanes:lanes||undefined,board:lanes?{order_field:''}:undefined,
          saved_filters:[{id:'f1',name:'Ждут оплаты',filters:{status:{operator:'in',values:['new']}}}],
          view_config:{layouts:{cards:{card_fields:['status','client','amount']},board:{lane_field:'status',card_fields:['client','amount']}}},
          echo:{filters_chosen:qy.filters_chosen||['status'],filters:qy.filters||{},search:qy.search||'',sort:qy.sort||[],page:page,per_page:per,view:qy.view||{id:'all',type:'table'}}}})}
      return Promise.resolve({answer:'applied'})}};
  customElements.whenDefined('sf-view').then(function(){view.setHostPort(port)});
})();
</script></body></html>`;

// A record docked beside a list (C403): four sections with icons, a status
// shown as its badge.
const CARD = (theme, {inplace = false} = {}) => `${HEAD(theme)}
${inplace ? '' : '<div id="list" data-sf-drawer-dock-host style="block-size:600px;border:1px solid var(--sf-outline-variant)">the list</div>'}
<sf-view-properties id="c" aria-label="Заказ" size="1/2" mode="auto"${inplace ? '' : ' panel panel-size="2"'}></sf-view-properties></main>
<script>
(function(){
  var ST=[{value:'new',label:'Новый'},{value:'sent',label:'Отправлен'}];
  var f=function(k,l,v){return {key:k,label:l,propertyType:'string',value:v,editable:true}};
  var SECTIONS=[{key:'order',label:'Заказ',icon:'receipt',groups:[{key:'g1',label:'Основное',fields:[{key:'status',label:'Состояние',propertyType:'choice',value:'sent',options:ST,editable:true},f('client','Клиент','ООО «Ромашка»'),f('amount','Сумма','12 450,00 ₽')]}]},
    {key:'client',label:'Клиент',icon:'person',groups:[{key:'g2',label:'Контакты',fields:[f('phone','Телефон','+7 900 000-00-00')]}]},
    {key:'ship',label:'Доставка',icon:'local_shipping',groups:[{key:'g3',label:'Адрес',fields:[f('city','Город','Казань')]}]},
    {key:'pay',label:'Оплата',icon:'payments',groups:[{key:'g4',label:'Счёт',fields:[f('bill','Счёт','№ 812')]}]}];
  var rec={record_id:'r1',collection:'orders',revision:'1',label:'Заказ №3002',title:'Заказ №3002',actions:['record.edit'],permissions:{edit:true},sections:SECTIONS};
  var card=document.getElementById('c');
  card.setAttribute('record-id','r1');
  customElements.whenDefined('sf-view-properties').then(function(){card.setHostPort({version:'1.17.0',capabilities:['view-settings','record-open','record-edit'],
    raise:function(intent){return Promise.resolve(intent==='record.load'?{answer:'applied',record:rec}:{answer:'applied'})}});
    ${inplace ? '' : "card.setAttribute('panel-label','Заказ №3002');card.removeAttribute('hidden');card.setAttribute('open','true');"}});
})();
</script></body></html>`;

const QUICK = process.env.R14_QUICK === '1';
const QUICK_WIDTH = Number(process.env.R14_WIDTH) || 1440;
const ONLY = process.env.R14_ONLY ? new Set(process.env.R14_ONLY.split(',')) : null;
const doing = (item) => !ONLY || ONLY.has(item);
const SHOTS = process.env.R14_SHOTS;
const shot = async (page, name) => { if (SHOTS) await page.screenshot({path: join(SHOTS, `${name}.png`)}).catch(() => {}); };
const failures = [];
const results = [];
const browser = await chromium.launch({headless: true, channel: process.env.R14_CHANNEL || undefined, ignoreDefaultArgs: ['--hide-scrollbars']});
const newContext = async (theme, width, pages) => {
  const context = await browser.newContext({viewport: {width, height: width < 768 ? 844 : 900}, colorScheme: theme, hasTouch: width < 768});
  await context.route('http://probe.test/**', (route) => {
    const path = decodeURIComponent(new URL(route.request().url()).pathname);
    if (pages[path]) return route.fulfill({status: 200, contentType: 'text/html; charset=utf-8', body: pages[path]});
    const target = file(path);
    if (!target) return route.fulfill({status: 404, body: ''});
    const type = TYPES[extname(target)] ?? 'application/octet-stream';
    return route.fulfill({status: 200, contentType: /^(text|application\/json)/u.test(type) ? `${type}; charset=utf-8` : type, body: readFileSync(target)});
  });
  return context;
};
const open = async (context, path = '/') => {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    const text = message.text();
    if (message.type() === 'error' || (message.type() === 'warning' && !/preload/u.test(text))) errors.push(`${message.type()}: ${text.slice(0, 200)}`);
  });
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(`http://probe.test${path}`);
  return {page, errors};
};
const load = async (theme, width, body) => {
  const context = await newContext(theme, width, {'/': body});
  const {page, errors} = await open(context);
  return {context, page, errors};
};
const ready = (page, what = 'sf-view-table :is(tbody tr, li)[data-row-id]') => page.waitForFunction((selector) => document.querySelectorAll(`#v ${selector}`).length > 0, what, {timeout: 15000});
const box = (rect) => (rect ? {x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height)} : null);

// The strip (the presentation zone) open by a real click on its toggle.
const openZone = async (page) => {
  const shown = await page.evaluate(() => { const node = document.querySelector('#v .sf-view-head-zone'); return Boolean(node && !node.hidden && node.getClientRects().length); });
  if (shown) return;
  const toggle = page.locator('#v sf-button-icon.sf-view-head-zone-toggle button').first();
  await toggle.scrollIntoViewIfNeeded();
  await toggle.click({timeout: 5000});
  await page.waitForTimeout(300);
};
const pickKind = async (page, text) => {
  await openZone(page);
  const phone = await page.evaluate(() => !document.querySelector('#v sf-segmented[data-kinds] button[data-sf-button-group-value]')?.getClientRects().length);
  if (phone) {
    await page.locator('#v .sf-view-head-kind-menu button').click({timeout: 5000});
    await page.getByRole('menuitem', {name: text}).first().click({timeout: 5000});
  } else {
    const value = {Таблица: 'table', Карточки: 'cards', Канбан: 'board'}[text];
    await page.locator(`#v sf-segmented[data-kinds] button[data-sf-button-group-value="${value}"]`).first().click({timeout: 5000});
  }
};
// «Вид» by a real click, then a path of its rows (a level, then its choice).
const look = async (page, ...path) => {
  await openZone(page);
  const trigger = page.locator('#v :is(.sf-view-head-zone-end, .sf-view-head-zone, .sf-view-head-row) .sf-view-head-look button:visible').first();
  await trigger.click({timeout: 5000});
  await page.waitForSelector('sf-settings[data-look-menu] [role="menu"]', {state: 'visible', timeout: 5000});
  for (const name of path) {
    const item = page.locator('sf-settings[data-look-menu] [role="menu"]:visible').last().locator('[role^="menuitem"]', {hasText: name}).first();
    await item.click({timeout: 5000});
    await page.waitForTimeout(250);
  }
};
const lookRows = (page) => page.evaluate(() => {
  const menu = [...document.querySelectorAll('sf-settings[data-look-menu] [role="menu"]')].filter((node) => node.getClientRects().length).at(-1);
  return menu ? [...menu.querySelectorAll('.sf-context-menu-item-label')].map((node) => node.textContent.trim()) : [];
});
const rowHeight = (page) => page.evaluate(() => {
  const row = [...document.querySelectorAll('#v sf-view-table tbody tr[data-row-id]')].find((node) => node.getClientRects().length);
  return row ? Math.round(row.getBoundingClientRect().height) : null;
});
const settingsPanel = (page) => page.evaluate(() => {
  const panel = [...document.querySelectorAll('sf-settings[data-table-settings]')].find((node) => node.querySelector('[role="dialog"], .sf-settings-panel')?.getClientRects().length);
  if (!panel) return null;
  const text = panel.textContent.replace(/\s+/gu, ' ');
  return {id: panel.getAttribute('for'), fields: panel.querySelectorAll('[role="checkbox"]').length,
    phone: /На телефоне/u.test(text), spacious: /Просторно/u.test(text), everywhere: /Для всех моих/u.test(text), text: text.slice(0, 160)};
});
const closeAll = async (page) => {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  await page.mouse.click(4, 4);
  await page.waitForTimeout(200);
};
const marks = (page) => page.evaluate(() => {
  const view = document.getElementById('v');
  const bar = view.querySelector('sf-bulk-actions');
  const said = (bar?.textContent ?? '').replace(/\s+/gu, ' ');
  const count = Number((said.match(/(\d+)/u) ?? [0, 0])[1]);
  const cards = [...view.querySelectorAll('.sf-view-cards__card')].filter((node) => node.getClientRects().length);
  const checked = (node) => {
    const box = node.querySelector('sf-checkbox');
    const input = box?.querySelector('input');
    return Boolean(input?.checked || box?.hasAttribute('checked') || node.hasAttribute('data-selected') || node.getAttribute('aria-selected') === 'true');
  };
  return {count, said: said.slice(0, 120), cards: cards.length, cardsMarked: cards.filter(checked).length,
    markedIds: cards.filter(checked).map((node) => node.dataset.id ?? node.getAttribute('data-sf-sortable-item') ?? '')};
});
// The page row and the bars after a switch (VR13-1, owner 2026-11-22): the
// cards keep the list's page row, and one bulk bar shows on any kind.
const switchChrome = (page) => page.evaluate(() => {
  const view = document.getElementById('v');
  const nav = view.querySelector(':scope > sf-pagination nav');
  const range = view.querySelector('.sf-view-footer-range');
  const bars = [...document.querySelectorAll('sf-bulk-actions')]
    .filter((bar) => bar.getClientRects().length || bar.querySelector('*')?.getClientRects().length).length;
  return {nav: nav ? Math.round(nav.getBoundingClientRect().height) : 0, range: range?.getClientRects().length ? range.textContent.trim() : '', bars};
});
const markRow = async (page, index) => {
  const row = page.locator('#v sf-view-table :is(tbody tr, li)[data-row-id]').nth(index);
  await row.locator(':is(td[data-key="select"], .sf-table-list-select) label.sf-checkbox').first().click({timeout: 5000});
  await page.waitForTimeout(200);
};
const nextPage = async (page) => {
  const button = page.locator('#v > sf-pagination nav .sf-pagination-direction--next button').first();
  await button.scrollIntoViewIfNeeded();
  await button.click({timeout: 5000});
};

// The head and the footer as drawn (C404).
const chrome = (page) => page.evaluate(() => {
  const view = document.getElementById('v');
  const one = (selector) => view.querySelector(selector);
  const rect = (node) => (node && node.getClientRects().length ? node.getBoundingClientRect() : null);
  const r = (node) => { const got = rect(node); return got ? {x: Math.round(got.x), y: Math.round(got.y), w: Math.round(got.width), h: Math.round(got.height), cx: Math.round(got.x + got.width / 2)} : null; };
  const frame = (node) => { if (!node) return 0; const style = getComputedStyle(node); return parseFloat(style.borderTopWidth) || 0; };
  const field = one('.sf-view-head-search .sf-input') ?? one('.sf-view-head-search input');
  const fieldBox = field?.closest('.sf-input') ?? field;
  const footer = view.shadowRoot?.querySelector('[part="footer"]');
  const table = one('sf-view-table table');
  return {
    search: r(one('.sf-view-head-search')),
    searchAppearance: one('.sf-view-head-search sf-input')?.getAttribute('appearance') ?? null,
    searchFramed: Boolean(one('.sf-view-head-search .sf-input--bordered')),
    // LV4-24: the search as drawn, outlined like «⋯» and «Создать», never filled.
    searchDrawn: (() => {
      const field = one('.sf-view-head-search sf-input .sf-input-field');
      if (!field) return null;
      const style = getComputedStyle(field);
      const alpha = (colour) => { const m = colour.match(/rgba?\(([^)]+)\)/u); if (!m) return 1; const parts = m[1].split(/[ ,/]+/u).filter(Boolean); return parts.length > 3 ? Number(parts[3]) : 1; };
      return {fill: alpha(style.backgroundColor), border: parseFloat(style.borderTopWidth) || 0, borderInk: alpha(style.borderTopColor)};
    })(),
    // LV4-25: the chip row on a phone scrolls with no track drawn under it.
    chipsBar: (() => {
      const row = one('.sf-view-head-fields');
      if (!row || !row.getClientRects().length) return null;
      return {scrolls: row.scrollWidth > row.clientWidth + 1, track: row.offsetHeight - row.clientHeight - (parseFloat(getComputedStyle(row).borderTopWidth) || 0) - (parseFloat(getComputedStyle(row).borderBottomWidth) || 0), bar: getComputedStyle(row).scrollbarWidth};
    })(),
    create: r(one('.sf-view-head-create button')), more: r(one('.sf-view-head-more button')),
    moreIcon: one('.sf-view-head-more i, .sf-view-head-more sf-icon')?.textContent.trim() ?? null, moreLook: one('.sf-view-head-more')?.getAttribute('appearance') ?? null,
    moreFrame: frame(one('.sf-view-head-more button')),
    zone: r(one('.sf-view-head-zone')), zoneFrame: frame(one('.sf-view-head-zone')),
    columns: r(one('.sf-view-head-columns button')), look: r(one('.sf-view-head-look:not(.sf-view-head-tune) button')),
    footer: r(footer), table: r(table), more: r(one(':scope > [slot="more"]:not([hidden]) button')) ?? null, range: r(one('.sf-view-footer-range')), nav: r(one(':scope > sf-pagination nav')), size: r(one('.sf-view-footer-size button')),
    view: r(view),
  };
});

const themes = QUICK ? ['light'] : ['light', 'dark'];
const widths = QUICK ? [QUICK_WIDTH] : [1440, 1280, 1024, 390];
const loads = QUICK ? 1 : 3;
try {
  for (const theme of themes) for (const width of widths) for (let run = 1; run <= loads; run += 1) {
    const phone = width < 768;
    const base = {theme, width, run};
    // C404, C407, LV3-9, C406, LV3-20/21, LV3-11, LV3-12, LV3-23.
    if (doing('head')) {
      const label = {...base, item: 'C404'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {key: `h${run}`}));
      await ready(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(700);
      await openZone(page).catch((error) => errors.push(`zone: ${error.message.slice(0, 80)}`));
      const got = await chrome(page);
      if (got.moreIcon !== 'more_horiz') failures.push({...label, item: 'C407', got: got.moreIcon, want: 'more_horiz'});
      if (got.moreLook !== 'outline' || !(got.moreFrame > 0)) failures.push({...label, item: 'LV3-9', got: {look: got.moreLook, frame: got.moreFrame}, want: 'outline with a frame'});
      if (got.searchDrawn && (got.searchDrawn.fill > 0.01 || got.searchDrawn.border < 1 || got.searchDrawn.borderInk < 0.1)) failures.push({...label, item: 'LV4-24', got: got.searchDrawn, want: 'the search outlined, not filled'});
      if (phone && got.chipsBar && (got.chipsBar.track > 0 || got.chipsBar.bar !== 'none')) failures.push({...label, item: 'LV4-25', got: got.chipsBar, want: 'no scrollbar track under the chips'});
      if (!phone) {
        if (got.searchAppearance !== 'bordered' || !got.searchFramed) failures.push({...label, got: got.searchAppearance, want: 'the search framed'});
        if (!got.create || !got.more || got.more.h !== got.search?.h || got.create.h !== got.search?.h) failures.push({...label, item: 'LV3-9', got: {search: got.search, create: got.create, more: got.more}, want: '«Создать», «⋯» and the search one height'});
        if (!(got.zoneFrame > 0)) failures.push({...label, got: got.zoneFrame, want: 'the strip framed'});
        if (!got.columns || !got.look || got.look.x < got.columns.x || got.zone && got.look.x + got.look.w < got.zone.x + got.zone.w - 64) failures.push({...label, got: {columns: got.columns, look: got.look, zone: got.zone}, want: '«Колонки» then «Вид» at the strip\'s end'});
        // The footer is the table's last band: right under the last row, or
        // under «Показать ещё» right under it (12 px, the gap of the band).
        const last = got.more ? got.more.y + got.more.h : got.table ? got.table.y + got.table.h : null;
        const moreGap = got.more && got.table ? got.more.y - (got.table.y + got.table.h) : null;
        // Under «Показать ещё» the band keeps the gap it has above it.
        const below = got.more ? moreGap : 0;
        if (!got.footer || last === null || Math.abs(got.footer.y - last - below) > 1 || (moreGap !== null && (moreGap < 0 || moreGap > 16))) failures.push({...label, got: {footer: got.footer, table: got.table, more: got.more}, want: 'the footer right under the last band'});
        if (!got.nav || !got.footer || Math.abs(got.nav.cx - got.footer.cx) > 2) failures.push({...label, got: {nav: got.nav, footer: got.footer}, want: 'the pages centred'});
        if (!got.size || !got.footer || Math.abs(got.size.x + got.size.w - (got.footer.x + got.footer.w)) > 1) failures.push({...label, got: {size: got.size, footer: got.footer}, want: '«По 10» at the end'});
        if (!got.range || !got.footer || Math.abs(got.range.x - got.footer.x) > 1) failures.push({...label, got: {range: got.range, footer: got.footer}, want: 'the range at the start'});
        // LV3-12: the plain sum in its cell, formatted, no badge.
        const cell = await page.evaluate(() => { const td = document.querySelector('#v sf-view-table tbody tr[data-row-id] td[data-key="amount"]'); return td ? {text: td.innerText.trim(), badge: Boolean(td.querySelector('sf-badge'))} : null; });
        if (!cell || cell.badge || !/9\s?800/u.test(cell.text) || cell.text === '9800') failures.push({...label, item: 'LV3-12', got: cell, want: 'the sum formatted in its cell, no badge'});
        results.push({...label, cell});
        // C406 / LV3-21: the gear above «≡» opens the column window; LV3-20.
        const gear = page.locator('#v sf-view-table thead th[data-key="settings"] button').first();
        const gearShown = await gear.count() && await gear.isVisible();
        if (!gearShown) failures.push({...label, item: 'C406', got: 'no gear in the table head under the list head'});
        else {
          await gear.click({timeout: 5000}).catch((error) => errors.push(`gear: ${error.message.slice(0, 80)}`));
          await page.waitForTimeout(600);
          const byGear = await settingsPanel(page);
          if (!byGear?.fields) failures.push({...label, item: 'C406', got: byGear, want: 'the column window'});
          if (byGear?.spacious || byGear?.everywhere) failures.push({...label, item: 'LV3-20', got: byGear});
          if (!byGear?.phone) failures.push({...label, item: 'LV3-11', got: byGear, want: '«На телефоне» in the column window'});
          if (run === 1) await shot(page, `gear-${width}-${theme}`);
          await closeAll(page);
          await openZone(page);
          await page.locator('#v .sf-view-head-columns button').first().click({timeout: 5000}).catch((error) => errors.push(`columns: ${error.message.slice(0, 80)}`));
          await page.waitForTimeout(600);
          const byColumns = await settingsPanel(page);
          if (!byColumns?.fields || byColumns.phone !== byGear?.phone) failures.push({...label, item: 'LV3-21', got: {byGear, byColumns}, want: 'the same window from «Колонки»'});
          results.push({...label, item: 'C406', byGear, byColumns});
          // LV3-11: «Менеджер» switched on for the phone row by a real click.
          const row = page.locator('sf-settings[data-table-settings] [role="switch"]').filter({hasText: 'Менеджер'}).last();
          await row.click({timeout: 5000}).catch((error) => errors.push(`phone field: ${error.message.slice(0, 120)}`));
          await page.waitForTimeout(400);
          await closeAll(page);
          if (width === 1440) {
            await page.setViewportSize({width: 390, height: 844});
            await page.waitForTimeout(1200);
            const line = await page.evaluate(() => [...document.querySelectorAll('#v sf-view-table li[data-row-id]')].find((node) => node.getClientRects().length)?.innerText ?? '');
            if (!/Анна Смирнова/u.test(line)) failures.push({...label, item: 'LV3-11', got: line.slice(0, 160), want: '«Менеджер» in the phone row'});
            results.push({...label, item: 'LV3-11', line: line.replace(/\s+/gu, ' ').slice(0, 160)});
            await page.setViewportSize({width, height: 900});
            await page.waitForTimeout(600);
          }
        }
      } else {
        // LV3-13 / LV3-24: the phone row.
        const row = await page.evaluate(() => {
          const items = [...document.querySelectorAll('#v sf-view-table li[data-row-id]')].filter((node) => node.getClientRects().length).slice(0, 3);
          return items.map((item) => {
            const facts = [...item.querySelectorAll('.sf-table-resource-fact, .sf-table-list-end > *')].filter((node) => node.getClientRects().length && node.textContent.trim());
            // The label a screen reader hears is clipped on purpose.
            const cut = facts.filter((node) => [node, ...node.querySelectorAll('*')].some((one) => !one.closest('.sf-table-visually-hidden') && one.scrollWidth > one.clientWidth + 1 && getComputedStyle(one).overflowX !== 'visible'));
            return {text: item.innerText.replace(/\s+/gu, ' ').slice(0, 160), facts: facts.map((node) => node.textContent.replace(/\s+/gu, ' ').trim()), cut: cut.length,
              lead: item.querySelector('.sf-table-resource-lead')?.getClientRects().length ? item.querySelector('.sf-table-resource-lead').textContent.trim() : ''};
          });
        });
        for (const one of row) {
          if (one.facts.length < 2 || one.cut) failures.push({...label, item: 'LV3-13', got: one, want: 'the sum and the due date, whole'});
          if (one.facts.some((text) => /^\d{4,}$/u.test(text.replace(/\s/gu, '')) && !/\s/u.test(text))) failures.push({...label, item: 'LV3-13', got: one, want: 'formatted figures'});
          if (!one.lead) failures.push({...label, item: 'LV3-24', got: one, want: 'the state\'s word'});
        }
        results.push({...label, item: 'LV3-13', row});
      }
      // LV3-23: the saved filter's menu.
      const filter = page.locator(phone ? '#v .sf-view-head-filter-icon button' : '#v .sf-view-head-filter button').first();
      await filter.click({timeout: 5000}).catch((error) => errors.push(`filter: ${error.message.slice(0, 80)}`));
      await page.waitForSelector('[data-saved-menu]', {timeout: 5000}).catch(() => {});
      const savedIcon = await page.evaluate(() => document.querySelector('[data-saved-menu] i')?.textContent.trim() ?? document.querySelector('[data-saved-menu]')?.getAttribute('icon') ?? null);
      if (savedIcon !== 'more_horiz') failures.push({...label, item: 'LV3-23', got: savedIcon, want: 'more_horiz'});
      await closeAll(page);
      if (run === 1) await shot(page, `head-${width}-${theme}`);
      if (errors.length) failures.push({...label, errors});
      results.push({...label, got, savedIcon});
      await context.close();
    }
    // C405, C408: «Вид» applies at once; a second list follows.
    if (doing('look')) {
      const label = {...base, item: 'C405'};
      const context = await newContext(theme, width, {'/': LIST(theme, {key: `l${run}a`}), '/b': LIST(theme, {key: `l${run}b`})});
      const {page, errors} = await open(context, '/');
      await ready(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(700);
      const before = phone ? null : await rowHeight(page);
      await look(page).catch((error) => errors.push(`«Вид»: ${error.message.slice(0, 120)}`));
      const tableRows = await lookRows(page);
      if (!['Плотность', 'Текст в одну строку', 'Линии между столбцами', 'Подгрузка'].every((row) => tableRows.includes(row))) failures.push({...label, got: tableRows, want: 'the table\'s rows'});
      if (run === 1) await shot(page, `look-${width}-${theme}`);
      await closeAll(page);
      await look(page, 'Плотность', 'Компактная').catch((error) => errors.push(`compact: ${error.message.slice(0, 120)}`));
      await page.waitForTimeout(500);
      const after = phone ? null : await rowHeight(page);
      const density = await page.evaluate(() => document.querySelector('#v sf-view-table')?.getAttribute('density') ?? document.querySelector('#v')?.getAttribute('data-sf-density') ?? null);
      if (!phone && !(after < before)) failures.push({...label, got: {before, after, density}, want: 'shorter rows at once'});
      await closeAll(page);
      const second = await open(context, '/b');
      await ready(second.page).catch(() => second.errors.push('the second list did not come'));
      await second.page.waitForTimeout(700);
      const there = phone ? null : await rowHeight(second.page);
      if (!phone && there !== after) failures.push({...label, item: 'C408', got: {first: after, second: there}, want: 'the second list as compact'});
      // The cards' own rows, and D1 for the cards.
      await pickKind(page, 'Карточки').catch((error) => errors.push(`cards: ${error.message.slice(0, 120)}`));
      await page.waitForFunction(() => document.querySelectorAll('#v .sf-view-cards__card').length > 0, null, {timeout: 8000}).catch(() => errors.push('the cards did not come'));
      await page.waitForTimeout(500);
      await look(page).catch((error) => errors.push(`cards «Вид»: ${error.message.slice(0, 120)}`));
      const cardRows = await lookRows(page);
      if (!['Подгрузка', 'Подписи полей'].every((row) => cardRows.includes(row)) || cardRows.includes('Плотность')) failures.push({...label, item: 'C405', got: cardRows, want: 'the cards\' own rows'});
      await closeAll(page);
      const moreBefore = await page.evaluate(() => { const holder = document.querySelector('#v > [slot="more"]'); return Boolean(holder && !holder.hidden && holder.querySelector('button')?.getClientRects().length); });
      await look(page, 'Подгрузка', 'Страницами').catch((error) => errors.push(`cards paging: ${error.message.slice(0, 120)}`));
      await page.waitForTimeout(500);
      const moreAfter = await page.evaluate(() => { const holder = document.querySelector('#v > [slot="more"]'); return Boolean(holder && !holder.hidden && holder.querySelector('button')?.getClientRects().length); });
      if (!moreBefore || moreAfter) failures.push({...label, item: 'D1 cards', got: {moreBefore, moreAfter}, want: '«Показать ещё» gone at once'});
      await closeAll(page);
      if (errors.length || second.errors.length) failures.push({...label, errors: [...errors, ...second.errors]});
      results.push({...label, before, after, there, density, tableRows, cardRows, moreBefore, moreAfter});
      await context.close();
    }
    // LV2-2, LV2-7: the marks.
    if (doing('marks')) {
      const label = {...base, item: 'LV2-2'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {key: `m${run}`}));
      await ready(page).catch(() => errors.push('the list did not come'));
      await page.waitForTimeout(700);
      await markRow(page, 0).catch((error) => errors.push(`mark 1: ${error.message.slice(0, 80)}`));
      await markRow(page, 1).catch((error) => errors.push(`mark 2: ${error.message.slice(0, 80)}`));
      await nextPage(page).catch((error) => errors.push(`page 2: ${error.message.slice(0, 80)}`));
      await page.waitForFunction(() => /^11/u.test(document.querySelector('#v .sf-view-footer-range')?.textContent ?? ''), null, {timeout: 8000}).catch(() => {});
      await page.waitForTimeout(400);
      await markRow(page, 0).catch((error) => errors.push(`mark 3: ${error.message.slice(0, 80)}`));
      const table = await marks(page);
      await pickKind(page, 'Карточки').catch((error) => errors.push(`cards: ${error.message.slice(0, 120)}`));
      await page.waitForFunction(() => document.querySelectorAll('#v .sf-view-cards__card').length > 0, null, {timeout: 8000}).catch(() => errors.push('the cards did not come'));
      await page.waitForTimeout(800);
      const cards = await marks(page);
      const cardsChrome = await switchChrome(page);
      if (!cardsChrome.nav || !/из 48/u.test(cardsChrome.range)) failures.push({...base, item: 'VR13-1', got: cardsChrome, want: 'the cards keep the page row and the range after a click switch'});
      if (cardsChrome.bars > 1) failures.push({...base, item: 'one bar', got: cardsChrome, want: 'one bulk bar at most on the cards'});
      if (table.count !== 3) failures.push({...label, got: table, want: '3 marked over two pages'});
      const own = {...base, item: 'C413'};
      if (cards.count !== 0 || cards.cardsMarked !== 0) failures.push({...own, got: cards, want: 'the cards start with their own marks, none'});
      await page.locator('#v .sf-view-cards__card label.sf-checkbox').first().click({timeout: 5000}).catch((error) => errors.push(`card mark: ${error.message.slice(0, 80)}`));
      await page.waitForTimeout(400);
      const cardsMarked = await marks(page);
      const markedChrome = await switchChrome(page);
      if (cardsMarked.count !== 1 || cardsMarked.cardsMarked !== 1) failures.push({...own, got: cardsMarked, want: 'one card marked, «Выбрано 1»'});
      if (markedChrome.bars !== 1) failures.push({...base, item: 'one bar', got: markedChrome, want: 'one bulk bar on the cards'});
      await pickKind(page, 'Таблица').catch((error) => errors.push(`table: ${error.message.slice(0, 120)}`));
      await page.waitForFunction(() => document.querySelectorAll('#v sf-view-table :is(tbody tr, li)[data-row-id]').length > 0, null, {timeout: 8000}).catch(() => errors.push('the table did not come back'));
      await page.waitForTimeout(800);
      const tableBack = await marks(page);
      if (tableBack.count !== 3) failures.push({...own, got: tableBack, want: 'the table\'s own three marks back'});
      await pickKind(page, 'Карточки').catch((error) => errors.push(`cards again: ${error.message.slice(0, 120)}`));
      await page.waitForFunction(() => document.querySelectorAll('#v .sf-view-cards__card').length > 0, null, {timeout: 8000}).catch(() => errors.push('the cards did not come back'));
      await page.waitForTimeout(800);
      const cardsBack = await marks(page);
      if (cardsBack.count !== 1) failures.push({...own, got: cardsBack, want: 'the cards\' own one mark back'});
      await pickKind(page, 'Канбан').catch((error) => errors.push(`board: ${error.message.slice(0, 120)}`));
      await page.waitForFunction(() => document.querySelectorAll('#v .sf-view-board__card').length > 0, null, {timeout: 8000}).catch(() => errors.push('the board did not come'));
      await page.waitForTimeout(800);
      await page.locator('#v .sf-view-board__card label.sf-checkbox').first().click({timeout: 5000}).catch((error) => errors.push(`board mark: ${error.message.slice(0, 80)}`));
      await page.waitForTimeout(400);
      const boardChrome = await switchChrome(page);
      if (boardChrome.bars > 1) failures.push({...base, item: 'one bar', got: boardChrome, want: 'one bulk bar on the board'});
      if (errors.length) failures.push({...label, errors});
      results.push({...label, table, cards, cardsChrome, cardsMarked, tableBack, cardsBack, boardChrome});
      await context.close();
      // LV2-7: «Выбрать все 48».
      const all = {...base, item: 'LV2-7'};
      const second = await load(theme, width, LIST(theme, {key: `m${run}b`}));
      await ready(second.page).catch(() => second.errors.push('the list did not come'));
      await second.page.waitForTimeout(700);
      await second.page.locator(phone ? '#v sf-view-table .sf-table-list-head label.sf-checkbox' : '#v sf-view-table thead th[data-key="select"] label.sf-checkbox').first().click({timeout: 5000}).catch((error) => second.errors.push(`mark the page: ${error.message.slice(0, 80)}`));
      await second.page.waitForTimeout(300);
      const pick = second.page.locator('#v sf-bulk-actions button, #v sf-bulk-actions [role="button"]').filter({hasText: /Выбрать все/u}).filter({visible: true}).first();
      // The bar at size 1 (DEV msg-1fd8b681) folds «Выбрать все N» into its
      // «⋯» on a phone: it is chosen there, by real clicks too.
      if (await pick.count()) await pick.click({timeout: 5000}).catch((error) => second.errors.push(`all: ${error.message.slice(0, 80)}`));
      else {
        const folds = second.page.locator('#v sf-bulk-actions button').filter({hasText: /more_horiz/u}).filter({visible: true});
        let chosen = false;
        for (let at = 0; at < await folds.count() && !chosen; at += 1) {
          await folds.nth(at).click({timeout: 5000}).catch(() => {});
          await second.page.waitForTimeout(300);
          const item = second.page.getByRole('menuitem', {name: /Выбрать все/u}).filter({visible: true}).first();
          if (await item.count()) { await item.click({timeout: 5000}).catch(() => {}); chosen = true; } else await second.page.keyboard.press('Escape');
        }
        if (!chosen) second.errors.push('all: «Выбрать все» neither on the bar nor in its «⋯»');
      }
      await second.page.waitForTimeout(400);
      const inTable = await marks(second.page);
      await pickKind(second.page, 'Карточки').catch((error) => second.errors.push(`cards: ${error.message.slice(0, 120)}`));
      await second.page.waitForFunction(() => document.querySelectorAll('#v .sf-view-cards__card').length > 0, null, {timeout: 8000}).catch(() => second.errors.push('the cards did not come'));
      await second.page.waitForTimeout(800);
      const inCards = await marks(second.page);
      if (inTable.count !== 48) failures.push({...all, got: inTable, want: '«Выбраны все 48» in the table'});
      // C413: the table's «Выбраны все» is the table's; the cards start unmarked.
      if (inCards.count !== 0 || inCards.cardsMarked !== 0 || !inCards.cards) failures.push({...all, got: inCards, want: 'cards drawn, none marked (C413)'});
      if (run === 1) await shot(second.page, `all-cards-${width}-${theme}`);
      await pickKind(second.page, 'Таблица').catch((error) => second.errors.push(`table: ${error.message.slice(0, 120)}`));
      await second.page.waitForFunction(() => document.querySelectorAll('#v sf-view-table :is(tbody tr, li)[data-row-id]').length > 0, null, {timeout: 8000}).catch(() => second.errors.push('the table did not come back'));
      await second.page.waitForTimeout(800);
      const backInTable = await marks(second.page);
      if (backInTable.count !== 48) failures.push({...all, got: backInTable, want: 'the table\'s «Выбраны все 48» back (C413)'});
      if (second.errors.length) failures.push({...all, errors: second.errors});
      results.push({...all, inTable, inCards, backInTable});
      await second.context.close();
    }
    // LV3-16: the board card's first line.
    if (doing('board')) {
      const label = {...base, item: 'LV3-16'};
      const {context, page, errors} = await load(theme, width, LIST(theme, {key: `b${run}`, layout: 'board'}));
      await ready(page, '.sf-view-board__card').catch(() => errors.push('the board did not come'));
      await page.waitForTimeout(800);
      await page.locator('#v .sf-view-board__card').first().hover().catch(() => {});
      await page.waitForTimeout(300);
      const line = await page.evaluate(() => {
        const card = document.querySelector('#v .sf-view-board__card');
        if (!card) return null;
        const title = card.querySelector('.sf-view-board__title');
        const range = document.createRange(); range.selectNodeContents(title);
        const first = [...range.getClientRects()][0] ?? title.getBoundingClientRect();
        const lineHeight = parseFloat(getComputedStyle(title).lineHeight);
        const lineCentre = first.top + (first.height - lineHeight) / 2 + lineHeight / 2;
        const centre = (node) => { const rect = node?.getBoundingClientRect(); return rect && rect.height ? rect.top + rect.height / 2 : null; };
        const boxNode = card.querySelector('.sf-view-board__box sf-checkbox :is(.sf-checkbox, label, span)') ?? card.querySelector('.sf-view-board__box');
        const field = card.querySelector('.sf-view-board__field');
        return {title: Math.round(lineCentre * 10) / 10, box: Math.round(centre(boxNode) * 10) / 10, menu: Math.round(centre(card.querySelector('.sf-view-board__menu button')) * 10) / 10,
          // RV4-11: the title and the fields share one start.
          titleToFields: field ? Math.round(title.getBoundingClientRect().left - field.getBoundingClientRect().left) : null};
      });
      if (line && line.titleToFields !== null && Math.abs(line.titleToFields) > 1) failures.push({...base, item: 'RV4-11', got: line, want: 'the title and the fields at one start'});
      if (!line || Math.abs(line.menu - line.title) > 1 || Math.abs(line.box - line.title) > 1) failures.push({...label, got: line, want: 'the box, the title line and «⋯» on one centre'});
      if (run === 1) await shot(page, `board-${width}-${theme}`);
      if (errors.length) failures.push({...label, errors});
      results.push({...label, line});
      await context.close();
    }
    // C403 and the badge row.
    if (doing('record') && !phone) {
      const label = {...base, item: 'C403'};
      const {context, page, errors} = await load(theme, width, CARD(theme));
      await page.waitForFunction(() => [...document.querySelectorAll('.sf-property-view-row, .sf-property-view-phone-sections .sf-list__row, .sf-property-view-section-menu a')].some((node) => node.getClientRects().length), null, {timeout: 15000}).catch(() => errors.push('the record did not come'));
      await page.waitForTimeout(1000);
      const got = await page.evaluate(() => {
        const panel = document.querySelector('#c .sf-property-view-panel') ?? document.querySelector('.sf-property-view-panel');
        const layout = panel?.getAttribute('data-sections-layout') ?? null;
        const visible = (node) => Boolean(node && node.getClientRects().length);
        const rail = document.querySelector('.sf-property-view-sections');
        const body = document.querySelector('.sf-property-view-frame');
        const tabs = [...document.querySelectorAll('#c sf-tabs')].filter(visible).length;
        const levels = [...document.querySelectorAll('.sf-property-view-phone-sections .sf-list__row')].filter(visible).length;
        return {layout, rail: visible(rail) ? Math.round(rail.getBoundingClientRect().width) : 0, fields: visible(body) ? Math.round(body.getBoundingClientRect().width) : 0,
          tabs, levels, rem: parseFloat(getComputedStyle(document.documentElement).fontSize)};
      });
      if (!['rail', 'level'].includes(got.layout) || got.tabs) failures.push({...label, got, want: 'the rail or the section list, no tabs'});
      if (got.layout === 'rail' && got.fields < 20 * got.rem) failures.push({...label, got, want: 'the fields keep 20rem beside the rail'});
      if (got.layout === 'level' && !got.levels) failures.push({...label, got, want: 'the section list opening as a level'});
      if (got.layout === 'level') {
        await page.locator('.sf-property-view-phone-sections .sf-list__row').first().click({timeout: 5000}).catch((error) => errors.push(`section: ${error.message.slice(0, 80)}`));
        await page.waitForTimeout(500);
        got.back = await page.evaluate(() => [...document.querySelectorAll('#c button, #c sf-button-icon')].some((node) => node.getClientRects().length && /arrow_back|chevron_left/u.test(node.textContent + (node.getAttribute('icon') ?? ''))));
        if (!got.back) failures.push({...label, got, want: '«←» in the opened section'});
      }
      if (run === 1) await shot(page, `record-${width}-${theme}`);
      if (errors.length) failures.push({...label, errors});
      results.push({...label, ...got});
      await context.close();
      // The badge row on the label's baseline: a record in place, the label
      // beside its value.
      const inPlace = await load(theme, width, CARD(theme, {inplace: true}));
      await inPlace.page.waitForFunction(() => document.querySelector('.sf-property-view-row[data-field="status"]')?.getClientRects().length, null, {timeout: 15000}).catch(() => inPlace.errors.push('the record did not come'));
      await inPlace.page.waitForTimeout(800);
      // The badge row on the label's baseline.
      const badge = await inPlace.page.evaluate(() => {
        const row = [...document.querySelectorAll('.sf-property-view-row[data-field="status"]')].find((node) => node.getClientRects().length);
        if (!row) return null;
        const base = (node) => {
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {acceptNode: (text) => (text.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)});
          const text = walker.nextNode(); if (!text) return null;
          const at = text.textContent.search(/\S/u); const range = document.createRange(); range.setStart(text, at); range.setEnd(text, at + 1);
          const style = getComputedStyle(text.parentElement);
          const canvas = document.createElement('canvas').getContext('2d'); canvas.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          return range.getBoundingClientRect().top + canvas.measureText('Ag').fontBoundingBoxAscent;
        };
        const label = base(row.querySelector('.sf-list-description-label'));
        const value = base(row.querySelector('.sf-list-description-value'));
        const beside = Math.abs(row.querySelector('.sf-list-description-label').getBoundingClientRect().top - row.querySelector('.sf-list-description-value').getBoundingClientRect().top) < 8;
        return {delta: Math.round((value - label) * 10) / 10, row: Math.round(row.getBoundingClientRect().height), beside};
      });
      if (!badge?.beside || Math.abs(badge.delta) > 0.5) failures.push({...label, item: 'badge row', got: badge, want: 'beside the label, on its baseline'});
      if (inPlace.errors.length) failures.push({...label, item: 'badge row', errors: inPlace.errors});
      results.push({...label, item: 'badge row', badge});
      await inPlace.context.close();
    }
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 1));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('VIEW_ROUND_14_OK');
