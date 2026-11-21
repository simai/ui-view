#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Build output root is required: the free output with the set laid into
// smart/smart (scripts/run-browser-probes.mjs makes it).
//
// View round 12 (DEV msg-7d2d0c1e, study view-head-footer round 2, returns
// VHF-3..7). The page loads the set through the SIMAI Framework loader, as a
// site does. Light and dark, three loads each:
// - VHF-3: eight filter fields at 1440 do not fit one row, so the head row
//   is two (round 3's rule): the end (the search, «Создать», the list menu)
//   on top across the whole width, «Фильтр» and the fields below. It stood at
//   the end of a second line, the start of that line left empty. With two
//   fields everything stays on one row, the end at the row's end.
// - VHF-5: a record card docked beside the list pads the view by its width
//   (data-sf-drawer-dock-host); here the view is padded by hand. The head
//   answers to what is left, as the table does: below 600 px left the phone
//   head and list rows together (the head stayed the desktop head over list
//   rows); with more left the desktop head; either way the head row, the
//   table's box and the footer end inside what is left.
// - VHF-4: a fitted table (a long client and comment beside a short title)
//   gives the record's name its whole value where the long columns can give
//   the room (it was «Заказ №30…»); where it cannot, «Текст в одну строку»
//   off draws the name on two lines, uncut, and on draws one line with the
//   ellipsis (the setting changed nothing before).
// - VHF-6, VHF-7: a record card in place (no panel) ends its stage line with
//   its «⋯» (it stood alone on an empty row above it); in a 360 px box and in
//   a panel the stage badge keeps its whole word beside a long client name
//   (it was «Отправ…»), the name ends in the ellipsis.
// Console clean in every load.
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
const LONG = 'ООО «Северо-Западная транспортно-логистическая компания „Балтийский путь“»';
const PAGE = (theme, {fields, pad, card}) => `<!doctype html>
<html lang="ru" class="theme-${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/distr/core/css/core.css">
<script>
window.sfPath = '/distr/'; window.sfSmartPath = '/distr/';
window.SF_BOOT_CONFIG = {cacheVersion: 'r12', pluginListVersion: 'r12', preloader: {enabled: false}, packages: {view: {base: '/distr/smart/'}}};
</script>
<script src="/distr/core/lang/ru.js"></script>
<script src="/distr/core/js/core.js"></script>
<style>html,body{background:var(--sf-surface-page);margin:0}body{padding:16px}</style>
</head><body><main id="root">
${card ? `<div id="box" style="max-inline-size:${card.box ?? 1400}px"><sf-view-properties id="c" aria-label="Заказ" size="1/2" mode="auto"${card.panel ? ' panel' : ''}></sf-view-properties></div>` : `
<sf-view id="v" aria-label="Заказы" heading="Заказы" head="list" collection="orders" size="1/2" preferences-key="r12-${fields}-${pad}"${pad ? ` style="padding-inline-end:${pad}px"` : ''}>
  <sf-view-table slot="content" aria-label="Заказы"></sf-view-table>
  <sf-pagination slot="pagination" top="false" page-size="8" page-sizes="8,16"></sf-pagination>
</sf-view>`}</main>
<script>
(function(){
  var ST=[{value:'new',label:'Новый'},{value:'paid',label:'Оплачен'},{value:'sent',label:'Отправлен'}];
  var KEYS=['status','manager','client','city','channel','payment','priority','method'];
  var NAMES=['Состояние','Менеджер','Клиент','Город','Канал','Оплата','Срочность','Способ доставки'];
  var FIELDS=KEYS.map(function(k,i){return {key:k,label:NAMES[i],propertyType:'choice',filter:{options:ST}}});
  var CHOSEN=KEYS.slice(0,${fields || 2});
  var LONG=${JSON.stringify(LONG)};
  var card=document.getElementById('c');
  if(card){
    var rec={record_id:'r1',collection:'orders',revision:'1',label:'Заказ №3002',title:'Заказ №3002',address:'#/orders/r1',actions:['record.edit','record.delete'],
      view:{head:{subtitle:['client','amount'],status:'status'}},
      sections:[{key:'order',label:'Заказ',groups:[{key:'g',label:'Основное',columns:2,fields:[
        {key:'status',label:'Состояние',propertyType:'choice',value:'sent',options:ST},
        {key:'client',label:'Клиент',propertyType:'string',value:LONG},
        {key:'amount',label:'Сумма',propertyType:'string',value:'12 450,00 ₽'}]}]}]};
    card.setAttribute('record-id','r1');
    customElements.whenDefined('sf-view-properties').then(function(){card.setHostPort({version:'1.17.0',capabilities:['record-history','view-settings','record-open'],
      raise:function(intent){return Promise.resolve(intent==='record.load'?{answer:'applied',record:rec}:{answer:'applied'})}});
      ${card?.panel ? "card.setAttribute('panel-label','Заказ №3002');card.removeAttribute('hidden');card.setAttribute('open','true');" : ''}});
    return;
  }
  var COLS=[{key:'title',label:'Заказ',role:'title'},{key:'status',label:'Состояние',property_type:'choice',options:ST},{key:'client',label:'Клиент'},
    {key:'manager',label:'Менеджер'},{key:'amount',label:'Сумма'},{key:'comment',label:'Комментарий'}];
  var ROWS=[];for(var i=0;i<16;i++)ROWS.push({id:'h'+i,revision:'1',actions:['view'],title:'Заказ №'+(3001+i),status:ST[i%3].value,
    client:[LONG,'ИП Константинопольская Александра Владимировна','АО «Научно-производственное объединение радиоэлектроники»'][i%3],manager:'Мария Котова',amount:(10000+i*70)+',00 ₽',
    comment:'Позвонить за час до доставки: въезд во двор только с Садовой улицы, домофон не работает'});
  var VIEWS=[{key:'all',label:'Все заказы',level:'system',revision:'1',query:{filters:{}}}];
  var view=document.getElementById('v'),table=view.querySelector('sf-view-table');
  var port={version:'1.15.0',capabilities:['row-actions','saved-views','personal-column-settings','create-record'],
    describe:function(){return {fields:FIELDS,layouts:['table','cards'],permissions:{record_fields:true,export:true}}},
    raise:function(intent,p){p=p||{};
      if(intent==='query.change'){var qy=p.query||{},per=+qy.per_page||8,page=+qy.page||1;
        return Promise.resolve({answer:'applied',sequence:p.sequence,data:{columns:COLS,records:ROWS.slice((page-1)*per,page*per),total:ROWS.length,saved_views:VIEWS,
          echo:{filters_chosen:qy.filters_chosen||CHOSEN,filters:qy.filters||{},search:qy.search||'',sort:qy.sort||[],page:page,per_page:per,view:qy.view||{id:'all',type:'table'}}}})}
      if(intent==='view.open')return Promise.resolve({answer:'applied',data:{saved_views:VIEWS}});
      return Promise.resolve({answer:'applied'})}};
  customElements.whenDefined('sf-view').then(function(){table.setFilterFields&&table.setFilterFields(FIELDS);view.setHostPort(port)});
})();
</script></body></html>`;

const failures = [];
const results = [];
const browser = await chromium.launch();
const box = (node) => { const b = node.getBoundingClientRect(); return {l: b.left, r: b.right, t: b.top, w: b.width}; };
const listMeasure = (page) => page.evaluate(() => {
  const view = document.getElementById('v');
  const style = getComputedStyle(view);
  const outer = view.getBoundingClientRect();
  const edge = outer.right - parseFloat(style.paddingInlineEnd);
  const left = outer.left + parseFloat(style.paddingInlineStart);
  const head = view.querySelector('.sf-view-head');
  const row = head?.querySelector('.sf-view-head-row');
  const start = row?.querySelector('.sf-view-head-start');
  const end = row?.querySelector('.sf-view-head-end');
  const rect = (node) => (node ? node.getBoundingClientRect() : null);
  // The parts of the head row, not those inside the filter fields' own
  // sideways-scrolling row (the phone head).
  const parts = row ? [...row.querySelectorAll('button, input')].filter((node) => node.getClientRects().length && node.getBoundingClientRect().width > 0
    && !node.closest('.sf-view-head-fields')) : [];
  const scroller = view.querySelector('sf-view-table .sf-table-scroll');
  const footer = [...view.querySelectorAll(':scope > [slot="footer"] *, :scope > sf-pagination *')].filter((node) => node.getBoundingClientRect().width > 0);
  const table = view.querySelector('sf-view-table');
  const titles = [...view.querySelectorAll('sf-view-table tbody td[data-sf-cell="title"] .sf-table-cell-text')];
  const lh = titles[0] ? parseFloat(getComputedStyle(titles[0]).lineHeight) : 16;
  return {
    left: Math.round(left), edge: Math.round(edge), own: Math.round(edge - left), phone: head?.hasAttribute('data-phone') ?? null,
    list: table ? !view.querySelector('sf-view-table tbody td') : null,
    start: start && rect(start) ? {l: Math.round(rect(start).left), t: Math.round(rect(start).top), b: Math.round(rect(start).bottom)} : null,
    end: end && rect(end) ? {l: Math.round(rect(end).left), r: Math.round(rect(end).right), t: Math.round(rect(end).top), b: Math.round(rect(end).bottom)} : null,
    rowRight: row ? Math.round(rect(row).right) : null, rowLeft: row ? Math.round(rect(row).left) : null,
    past: parts.filter((node) => node.getBoundingClientRect().right > edge + 1).length,
    scrollerRight: scroller ? Math.round(rect(scroller).right) : null,
    footerPast: footer.filter((node) => node.getBoundingClientRect().right > edge + 1).length,
    fitted: table?.hasAttribute('data-sf-columns-fitted') ?? null,
    titles: titles.slice(0, 8).map((node) => ({cut: node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1,
      lines: Math.round(node.getBoundingClientRect().height / lh)})),
    sideways: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  };
});
const cardMeasure = (page) => page.evaluate(() => {
  const card = document.getElementById('c');
  const root = document.querySelector('.sf-property-view-head-line')?.closest('sf-view-properties, [data-sf-portal], body') ?? document;
  const line = [...document.querySelectorAll('.sf-property-view-head-line')].find((node) => node.getBoundingClientRect().width > 0);
  const badge = line?.querySelector('sf-badge .sf-badge-text');
  const subtitle = line?.querySelector('.sf-property-view-head-subtitle');
  const more = line?.querySelector('.sf-property-view-head-line-end button');
  const alone = card.querySelector('.sf-property-view-host-actions');
  return {
    line: Boolean(line), badge: badge?.textContent.trim() ?? null,
    badgeCut: badge ? badge.scrollWidth > badge.clientWidth + 1 || (badge.closest('.sf-badge').scrollWidth > badge.closest('.sf-badge').clientWidth + 1) : null,
    subtitleCut: subtitle ? subtitle.scrollWidth > subtitle.clientWidth + 1 : null,
    moreInLine: Boolean(more), moreRight: more && line ? Math.round(line.getBoundingClientRect().right - more.getBoundingClientRect().right) : null,
    hostActionsRow: Boolean(alone), lineInside: line ? line.getBoundingClientRect().right <= (root === document ? innerWidth : innerWidth) + 1 : null,
    sideways: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  };
});
const load = async (theme, width, spec) => {
  const context = await browser.newContext({viewport: {width, height: 900}, colorScheme: theme});
  await context.route('http://probe.test/**', (route) => {
    const path = decodeURIComponent(new URL(route.request().url()).pathname);
    if (path === '/') return route.fulfill({status: 200, contentType: 'text/html; charset=utf-8', body: PAGE(theme, spec)});
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
  return {context, page, errors};
};
try {
  for (const theme of ['light', 'dark']) for (let run = 1; run <= 3; run += 1) {
    // VHF-3 and VHF-4 at 1440; VHF-5 padded to leave 900 and 560.
    for (const spec of [{fields: 8, pad: 0}, {fields: 2, pad: 0}, {fields: 8, pad: 500}, {fields: 2, pad: 820}]) {
      const label = {theme, run, ...spec};
      const {context, page, errors} = await load(theme, 1440, spec);
      await page.waitForFunction(() => document.querySelectorAll('#v sf-view-table [data-row-id]').length > 0
        && document.querySelector('#v .sf-view-head-row button')?.getClientRects().length, null, {timeout: 15000}).catch(() => errors.push('the list and its head did not come'));
      await page.waitForTimeout(600);
      const got = await listMeasure(page);
      // Two rows: the end on top of the start, across the row.
      const wrapped = Boolean(got.end && got.start && got.end.b <= got.start.t + 1);
      if (!got.phone && got.end) {
        if (got.end.t >= got.start.b - 1) failures.push({...label, item: 'VHF-3', got: 'the end below the start (a third state)'});
        if (wrapped && (Math.abs(got.end.l - got.rowLeft) > 1 || Math.abs(got.end.r - got.rowRight) > 1)) failures.push({...label, item: 'VHF-3', got: `the top row ${got.end.l - got.rowLeft} px in, ${got.rowRight - got.end.r} px short`});
        if (!wrapped && Math.abs(got.end.r - got.rowRight) > 1) failures.push({...label, item: 'VHF-3', got: `the end on the first line stops ${got.rowRight - got.end.r} px short of the row's end`});
      }
      if (spec.fields === 8 && !spec.pad && !wrapped) failures.push({...label, item: 'VHF-3', got: 'eight fields did not wrap the end'});
      if (spec.fields === 2 && !spec.pad && wrapped) failures.push({...label, item: 'VHF-3', got: 'two fields wrapped the end'});
      if (got.phone !== (got.own < 600)) failures.push({...label, item: 'VHF-5', got: `head ${got.phone ? 'phone' : 'desktop'} in ${got.own} px left`});
      if (got.list !== null && got.list !== got.phone) failures.push({...label, item: 'VHF-5', got: `head ${got.phone ? 'phone' : 'desktop'} over ${got.list ? 'list rows' : 'a table'}`});
      if (got.past || got.footerPast || (got.scrollerRight ?? 0) > got.edge + 1 || got.sideways) failures.push({...label, item: 'VHF-5', got});
      if (!spec.pad && got.fitted && got.titles.some((one) => one.cut)) failures.push({...label, item: 'VHF-4', got: 'a short name cut beside long columns', titles: got.titles});
      // VHF-4: the one-line setting where the name has too little room.
      if (spec.pad === 500) {
        await page.evaluate(() => {
          const table = document.querySelector('#v sf-view-table');
          table.style.setProperty('--probe', '1');
          // A narrow name column: its least width (the heading) is all it gets.
          document.getElementById('v').style.paddingInlineEnd = '760px';
        });
        await page.waitForTimeout(700);
        const before = await listMeasure(page);
        if (!before.list && before.fitted) {
          const set = (value) => page.evaluate((on) => document.querySelector('#v sf-view-table').onTableSettingChanged({detail: {id: 'singleLine', value: on}, stopPropagation() {}, preventDefault() {}}), value);
          const off = before;
          await set(true); await page.waitForTimeout(500);
          const on = await listMeasure(page);
          await set(false); await page.waitForTimeout(500);
          const back = await listMeasure(page);
          const cutOff = off.titles.filter((one) => one.cut).length;
          if (off.titles.some((one) => one.lines > 2) || (cutOff && off.titles.every((one) => one.lines < 2))) failures.push({...label, item: 'VHF-4', got: 'off: the name not on its two lines', titles: off.titles});
          if (on.titles.some((one) => one.lines !== 1)) failures.push({...label, item: 'VHF-4', got: 'on: the name not on one line', titles: on.titles});
          if (JSON.stringify(back.titles) !== JSON.stringify(off.titles)) failures.push({...label, item: 'VHF-4', got: 'off again differs', off: off.titles, back: back.titles});
          if (run === 1) results.push({theme, item: 'VHF-4', own: off.own, off: off.titles[0], on: on.titles[0]});
        }
      }
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, ...spec, own: got.own, phone: got.phone, list: got.list, wrapped, endLeft: got.end ? got.end.l - got.rowLeft : null});
      await context.close();
    }
    // VHF-6 and VHF-7: the card in place (1440 and a 360 px box) and in a panel.
    for (const spec of [{card: {box: 1400}}, {card: {box: 360}}, {card: {panel: true}}]) {
      const label = {theme, run, card: spec.card};
      const {context, page, errors} = await load(theme, 1440, spec);
      await page.waitForFunction(() => [...document.querySelectorAll('.sf-property-view-head-line')].some((node) => node.getBoundingClientRect().width > 0), null, {timeout: 15000})
        .catch(() => errors.push('the card head line did not come'));
      await page.waitForTimeout(600);
      const got = await cardMeasure(page);
      if (got.badge !== 'Отправлен' || got.badgeCut) failures.push({...label, item: 'VHF-7', got: `the stage badge «${got.badge}» cut ${got.badgeCut}`});
      if (spec.card.box !== 1400 && !got.subtitleCut) failures.push({...label, item: 'VHF-7', got: 'the long client name is not the part that gives way'});
      if (!spec.card.panel && (!got.moreInLine || got.hostActionsRow || got.moreRight > 1)) failures.push({...label, item: 'VHF-6', got});
      if (got.sideways) failures.push({...label, got: 'sideways'});
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, card: spec.card, ...got});
      await context.close();
    }
  }
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('VIEW_ROUND_12_OK');
