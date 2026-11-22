#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Build output root is required: the free output with the set laid into
// smart/smart (scripts/run-browser-probes.mjs makes it).
//
// View round 13, the record (owner decisions C399-C402 relayed by DEV
// msg-3215bbda; study prototypes/view-record-study.html#questions):
// - C400: a field's label is the value's size (14; 12 compact), in the muted
//   ink, on the value's baseline (0 px apart).
// - C402: an empty value reads «не заполнено» (in the label's ink: the muted
//   role it names fails 4.5:1, open for the owner).
// - C401: «Изменить» on a group turns each value into its field in place: the
//   label stays at the start, the rows do not move (row tops before and after
//   compared; the field's own height step reported); on a phone the label
//   stands over the field.
// - C399: a record card docked beside the list keeps its section column only
//   while the list keeps 48rem; else tabs on top and the list keeps its width.
//   An overlay and the whole screen keep the column (with this pair's sf-tabs,
//   which cannot be told not to fold, a panel below the whole screen draws
//   tabs: the interim until GB16).
// - The section column's rows: a hovered or pressed row takes the on-surface
//   state layer, never an inverse fill.
// Light and dark, three loads each, at 1440, 1280, 1024 and 390; real clicks,
// console clean.
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

// A record: sections with icons, a group of four fields, one of them empty.
const CARD = (theme, {panel = false, full = false, density = '', dock = false, step = ''} = {}) => `${HEAD(theme, density)}
${dock ? '<div id="list" data-sf-drawer-dock-host style="block-size:600px;border:1px solid var(--sf-outline-variant)">the list</div>' : ''}
<sf-view-properties id="c" aria-label="Заказ" size="1/2" mode="auto"${panel || full ? ' panel' : ''}${full ? ' panel-size="full"' : step ? ` panel-size="${step}"` : ''}${panel && !dock && !full ? ' modal="true"' : ''}></sf-view-properties></main>
<script>
(function(){
  var ST=[{value:'new',label:'Новый'},{value:'sent',label:'Отправлен'}];
  var f=function(k,l,v){return {key:k,label:l,propertyType:'string',value:v,editable:true}};
  var SECTIONS=[{key:'order',label:'Заказ',icon:'receipt',groups:[{key:'g1',label:'Основное',fields:[{key:'status',label:'Состояние',propertyType:'choice',value:'sent',options:ST,editable:true},f('client','Клиент','ООО «Ромашка»'),f('amount','Сумма','12 450,00 ₽'),f('note','Комментарий','')]}]},
    {key:'client',label:'Клиент',icon:'person',groups:[{key:'g2',label:'Контакты',fields:[f('phone','Телефон','+7 900 000-00-00')]}]},
    {key:'ship',label:'Доставка',icon:'local_shipping',groups:[{key:'g3',label:'Адрес',fields:[f('city','Город','Казань'),f('street','Улица','Баумана, 12')]}]},
    {key:'pay',label:'Оплата',icon:'payments',groups:[{key:'g4',label:'Счёт',fields:[f('bill','Счёт','№ 812')]}]}];
  var rec={record_id:'r1',collection:'orders',revision:'1',label:'Заказ №3002',title:'Заказ №3002',address:'#/orders/r1',actions:['record.edit','record.delete'],
    permissions:{edit:true},view:{head:{subtitle:['client'],status:'status'}},sections:SECTIONS};
  var card=document.getElementById('c');
  card.setAttribute('record-id','r1');
  customElements.whenDefined('sf-view-properties').then(function(){card.setHostPort({version:'1.17.0',capabilities:['view-settings','record-open','record-edit'],
    raise:function(intent){return Promise.resolve(intent==='record.load'?{answer:'applied',record:rec}:{answer:'applied'})}});
    ${panel || full ? "card.setAttribute('panel-label','Заказ №3002');card.removeAttribute('hidden');card.setAttribute('open','true');" : ''}});
})();
</script></body></html>`;

const QUICK = process.env.R13_QUICK === '1';
const QUICK_WIDTH = Number(process.env.R13_WIDTH) || 1440;
// R13_SHOTS=<folder>: screenshots of each place at its first load (evidence).
const SHOTS = process.env.R13_SHOTS;
const shot = async (page, name) => { if (SHOTS) await page.screenshot({path: join(SHOTS, `${name}.png`)}).catch(() => {}); };
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
const ready = (page) => page.waitForFunction(() => [...document.querySelectorAll('.sf-property-view-row, .sf-property-view-phone-sections .sf-list__row')].some((node) => node.getClientRects().length), null, {timeout: 15000});

// The read rows: each label and value, their size, ink and first-line baseline.
const readRows = (page) => page.evaluate(() => {
  const firstChar = (node) => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {acceptNode: (text) => (text.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)});
    const text = walker.nextNode();
    if (!text) return null;
    const at = text.textContent.search(/\S/u);
    const range = document.createRange(); range.setStart(text, at); range.setEnd(text, at + 1);
    const rect = range.getBoundingClientRect();
    const style = getComputedStyle(text.parentElement);
    const metrics = (() => { const canvas = document.createElement('canvas').getContext('2d'); canvas.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`; const m = canvas.measureText('Ag'); return m.fontBoundingBoxAscent; })();
    return {top: rect.top, baseline: rect.top + metrics, left: rect.left, size: parseFloat(style.fontSize), color: style.color, text: text.textContent.trim().slice(0, 30)};
  };
  return [...document.querySelectorAll('.sf-property-view-row')].filter((row) => row.getClientRects().length).map((row) => {
    const label = row.querySelector('.sf-list-description-label');
    const value = row.querySelector('.sf-list-description-value');
    const rect = row.getBoundingClientRect();
    return {key: row.dataset.key ?? row.getAttribute('data-field') ?? '', top: Math.round(rect.top), height: Math.round(rect.height),
      label: label ? firstChar(label) : null, value: value ? firstChar(value) : null,
      empty: row.querySelector('.sf-property-view-empty') ? {text: row.querySelector('.sf-property-view-empty').textContent.trim(), color: getComputedStyle(row.querySelector('.sf-property-view-empty')).color} : null};
  });
});
const lum = (color) => {
  const m = color.match(/[\d.]+/gu)?.map(Number) ?? [0, 0, 0];
  const [r, g, b] = m.slice(0, 3).map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  const a = m.length > 3 ? m[3] : 1;
  return {l: 0.2126 * r + 0.7152 * g + 0.0722 * b, a};
};

// The edited group's fields: each field's label and its control.
const formRows = (page) => page.evaluate(() => {
  const form = document.querySelector('sf-form.sf-property-view-form');
  if (!form) return null;
  return {labels: form.getAttribute('labels'), rows: [...form.querySelectorAll('.sf-form-field[data-key]')].filter((node) => node.getClientRects().length).map((node) => {
    const label = node.querySelector('.sf-form-label')?.getBoundingClientRect();
    const control = [...node.children].find((child) => !child.classList.contains('sf-form-label'))?.getBoundingClientRect();
    const box = node.getBoundingClientRect();
    return {key: node.dataset.key, top: Math.round(box.top), height: Math.round(box.height), labelLeft: label ? Math.round(label.left) : null, labelTop: label ? Math.round(label.top) : null,
      controlLeft: control ? Math.round(control.left) : null, controlTop: control ? Math.round(control.top) : null};
  })};
});
const editButton = (page) => page.locator(':is(sf-button[data-action="edit"] button, button[data-action="edit"])').first();

try {
  const widths = QUICK ? [QUICK_WIDTH] : [1440, 1280, 1024, 390];
  for (const theme of QUICK ? ['light'] : ['light', 'dark']) for (let run = 1; run <= (QUICK ? 1 : 3); run += 1) for (const width of widths) {
    for (const where of width < 768 ? ['phone'] : ['in place', 'overlay', 'full']) {
      const label = {theme, run, width, where};
      const opts = where === 'overlay' ? {panel: true} : where === 'full' ? {full: true} : {};
      const {context, page, errors} = await load(theme, width, CARD(theme, opts));
      await ready(page).catch(() => errors.push('the record did not come'));
      await page.waitForTimeout(700);
      if (where === 'phone') {
        // The first section by a real tap on its row.
        await page.locator('.sf-property-view-phone-sections .sf-list__row').first().click({timeout: 5000}).catch(() => errors.push('the section row could not be clicked'));
        await page.waitForFunction(() => [...document.querySelectorAll('.sf-property-view-row')].some((node) => node.getClientRects().length), null, {timeout: 5000}).catch(() => errors.push('the section did not open'));
        await page.waitForTimeout(400);
      }
      const rows = await readRows(page);
      const text = rows.filter((row) => row.label && row.value && row.key !== 'status');
      // C400: one size, the label's muted ink, one baseline (text values; a
      // choice is a badge of its own smaller type, reported).
      const sizes = text.filter((row) => row.label.size !== row.value.size);
      // Beside its value only: on a phone (and a narrow list) the label stands over it.
      const besideRows = text.filter((row) => row.value.left > row.label.left + 8 && Math.abs(row.value.top - row.label.top) < 8);
      const baselines = besideRows.map((row) => Math.round((row.value.baseline - row.label.baseline) * 10) / 10);
      if (!text.length) failures.push({...label, item: 'C400', got: 'no rows'});
      if (sizes.length) failures.push({...label, item: 'C400', got: sizes.map((row) => `${row.key}: label ${row.label.size}, value ${row.value.size}`)});
      if (baselines.some((delta) => Math.abs(delta) > 0.5)) failures.push({...label, item: 'C400', got: `baselines apart ${baselines.join(', ')}`});
      if (text.some((row) => row.label.color === row.value.color && !row.empty)) failures.push({...label, item: 'C400', got: 'the label in the value\'s ink'});
      // C402: «не заполнено», paler than the label.
      const empty = rows.find((row) => row.empty);
      const labelInk = lum(text[0]?.label.color ?? 'rgb(0,0,0)');
      const emptyInk = lum(empty?.empty.color ?? 'rgb(0,0,0)');
      const page_ = lum(await page.evaluate(() => getComputedStyle(document.body).backgroundColor));
      const apart = (ink) => Math.abs((ink.l * ink.a + page_.l * (1 - ink.a)) - page_.l);
      if (!empty || empty.empty.text !== 'не заполнено') failures.push({...label, item: 'C402', got: empty?.empty ?? 'no empty value'});
      // The paler ink C402 names (--sf-on-surface-muted) is below 4.5:1 and the
      // SIMAI Framework keeps it off readable text: the empty value keeps the
      // label's ink until the owner answers; never darker than the label.
      else if (apart(emptyInk) > apart(labelInk) + 0.001) failures.push({...label, item: 'C402', got: {label: text[0]?.label.color, empty: empty.empty.color}, want: 'not darker than the label'});
      // C401: «Изменить» by a real click; the fields in place.
      await editButton(page).click({timeout: 5000}).catch(() => errors.push('«Изменить» could not be clicked'));
      await page.waitForFunction(() => document.querySelector('sf-form.sf-property-view-form .sf-form-field'), null, {timeout: 5000}).catch(() => errors.push('the form did not come'));
      await page.waitForTimeout(500);
      const form = await formRows(page);
      const read = Object.fromEntries(rows.map((row) => [row.key, row]));
      // Each label stays where it was read (VR13-2, round 14): on the whole
      // screen the form keeps the read record's two columns, so a label is
      // held to its own read place, not to the list's start.
      const axis = Math.min(...rows.filter((row) => row.label).map((row) => Math.round(row.label.left)));
      const shifts = (form?.rows ?? []).map((row) => ({key: row.key, label: row.labelLeft - Math.round(read[row.key]?.label?.left ?? axis), top: row.top - (read[row.key]?.top ?? row.top), height: row.height - (read[row.key]?.height ?? row.height)}));
      const phone = where === 'phone';
      if (!form || form.labels !== (phone ? 'top' : 'start')) failures.push({...label, item: 'C401', got: form?.labels ?? 'no form', want: phone ? 'top' : 'start'});
      if (shifts.some((shift) => Math.abs(shift.label) > 1)) failures.push({...label, item: 'C401', got: shifts, want: 'each label at its read place'});
      // Beside its field wherever sf-form lays them beside (from 40rem of the form).
      const beside = (form?.rows ?? []).filter((row) => row.controlLeft > row.labelLeft + 8 && Math.abs(row.controlTop - row.labelTop) < 12).length;
      const over = (form?.rows ?? []).filter((row) => row.controlTop > row.labelTop + 8).length;
      if (phone && over !== (form?.rows ?? []).length) failures.push({...label, item: 'C401', got: form?.rows, want: 'on a phone the label over the field'});
      if (where !== 'overlay' && !phone && beside !== (form?.rows ?? []).length) failures.push({...label, item: 'C401', got: form?.rows, want: 'the label beside the field'});
      if (run === 1) await shot(page, `record-${where.replace(' ', '-')}-edit-${width}-${theme}`);
      await page.keyboard.press('Escape');
      // The section column's rows (the whole screen): hover and press take
      // the on-surface state layer, never an inverse fill.
      if (where === 'full') {
        const item = page.locator('.sf-property-view-section-list [role="tab"]:not([aria-selected="true"]), .sf-property-view-section-menu a:not([aria-current])').first();
        if (await item.count()) {
          const look = () => item.evaluate((node) => { const style = getComputedStyle(node); return {background: style.backgroundColor, color: style.color}; });
          await page.mouse.move(0, 0);
          const rest = await look();
          await item.hover({timeout: 5000}).catch(() => {});
          await page.waitForTimeout(300);
          const hover = await look();
          await page.mouse.down();
          await page.waitForTimeout(150);
          const press = await look();
          await page.mouse.up();
          const fill = (color) => lum(color);
          for (const [state, got] of [['hover', hover], ['press', press]]) {
            const bg = fill(got.background);
            if (bg.a > 0.2) failures.push({...label, item: 'section rows', got: {state, ...got}, want: 'a state layer of 4/8/12 per cent'});
          }
          if (run === 1) results.push({theme, item: 'section rows', width, rest, hover, press});
        }
      }
      if (errors.length) failures.push({...label, errors});
      if (run === 1) results.push({theme, item: 'record', width, where, text: text.map((row) => ({key: row.key, size: [row.label.size, row.value.size], baseline: Math.round((row.value.baseline - row.label.baseline) * 10) / 10})),
        badge: rows.filter((row) => row.key === 'status').map((row) => ({size: [row.label?.size, row.value?.size], baseline: Math.round(((row.value?.baseline ?? 0) - (row.label?.baseline ?? 0)) * 10) / 10}))[0],
        label: text[0]?.label.color, empty: empty?.empty, form: form?.labels, shifts});
      await context.close();
    }
  }
  // C399 at 1440 and 1024: a card docked beside the list and one over it.
  for (const theme of QUICK ? ['light'] : ['light', 'dark']) for (const width of (QUICK ? [QUICK_WIDTH] : [1440, 1024]).filter((one) => one >= 768)) for (const dock of [true, false]) {
    const label = {theme, width, item: 'C399', dock};
    const {context, page, errors} = await load(theme, width, CARD(theme, {panel: true, dock, step: '1'}));
    await ready(page).catch(() => errors.push('the record did not come'));
    await page.waitForTimeout(800);
    const got = await page.evaluate(() => {
      const card = document.getElementById('c');
      const list = document.getElementById('list');
      const panel = document.querySelector('.sf-property-view-panel');
      return {layout: panel?.getAttribute('data-sections-layout') ?? null, docked: card.docked, fits: card.sectionColumnFits, tabsHold: Boolean(customElements.get('sf-tabs')?.props?.fold),
        list: list ? Math.round(list.getBoundingClientRect().width - parseFloat(getComputedStyle(list).paddingInlineEnd || '0')) : null,
        panel: panel ? Math.round(panel.getBoundingClientRect().width) : null};
    });
    // With this pair's sf-tabs (no fold) a panel draws tabs and is not widened
    // (the interim); with a pair that has fold: over the list a column, docked
    // a column only while the list keeps 768.
    const want = !got.tabsHold ? 'tabs' : !dock ? 'column' : (got.list >= 768 ? 'column' : 'tabs');
    if (got.layout !== want) failures.push({...label, got, want});
    if (errors.length) failures.push({...label, errors});
    results.push({theme, item: 'C399', width, dock, ...got});
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 1));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('VIEW_ROUND_13_RECORD_OK');
