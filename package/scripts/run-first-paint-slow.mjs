#!/usr/bin/env node
// Usage: node scripts/run-first-paint-slow.mjs <free output> <package output> [--runs N] [--only <case>] [--json <file>]
//
// The slow-line case of the first paint (gate 24, gates.sh step «first paint»,
// MOD1-1 of the acceptance of view modular step 1). ui-source's first-paint
// gate (scripts/run-first-paint.mjs gate) runs on a local line, where every
// script arrives within a frame or two; since the table is a lazy relation of
// sf-view (modular step 1) the kind's element may come long after the list
// drew, and on a slow line the list moved when it did (layout shift 0.091 on a
// table, 0.055 on a board, 0.127 on the cards). This case loads a list the way
// the docs connect the set (SF_BOOT_CONFIG.packages.view, core.js, the host
// port after sf-view is defined), cold, on an emulated slow line (300 ms
// latency, 750 kbit/s down, 250 kbit/s up), every file sent gzip-encoded, for
// each shape: the table written in the list's markup, a bare list (the list
// makes its table), the board, the cards and the calendar; at 1440 light and
// 390 dark, N runs each (3 by default). Each run passes when the kind's element
// is defined and draws its records, the view is out of its first paint, the
// layout shift summed over the whole load is 0 (rounded to 4 places, as the
// first-paint gate counts it), and the console holds no error and no warning
// (the Framework's «not defined within 10000 ms» hold note excepted: it is the
// Loader's hold timeout, not the list's, and it is printed on such a line
// before modular step 1 too). Prints a JSON summary; exits 1 on a failure.
import {createServer} from 'node:http';
import {existsSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {extname, join, resolve, sep} from 'node:path';
import {gzipSync} from 'node:zlib';
import {chromium} from 'playwright';
import {layProbeOutput} from './probe-layout.mjs';
import {PACKAGE_ROOT} from './overlay.mjs';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const at = args.indexOf(name);
  return at === -1 ? fallback : args[at + 1];
};
const [freeInput, builtInput] = args.filter((value, index) => !value.startsWith('--') && !['--runs', '--only', '--json'].includes(args[index - 1]));
if (!freeInput || !builtInput) throw new Error('usage: run-first-paint-slow.mjs <free output> <package output> [--runs N] [--only <case>] [--json <file>]');
const RUNS = Number(option('--runs', 3));
const ONLY = option('--only', '');
const roots = layProbeOutput({free: resolve(freeInput), built: resolve(builtInput), required: [], target: join(PACKAGE_ROOT, '.overlay', '.slow-line-output')});
const out = roots.output;
const mounts = [['/distr/core/', join(out, 'core', 'core')], ['/distr/rule/', join(out, 'core', 'rule')],
  ['/distr/component/', join(out, 'component', 'component')], ['/distr/utility/', join(out, 'utility', 'utility')],
  ['/distr/smart/', join(out, 'smart', 'smart')]];
for (const [, path] of mounts) if (!existsSync(path)) throw new Error(`${path} not found under ${out}`);
const TYPES = {'.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png'};
const file = (path) => {
  for (const [prefix, root] of mounts) {
    if (!path.startsWith(prefix)) continue;
    const target = resolve(root, path.slice(prefix.length));
    if (target.startsWith(resolve(root) + sep) && existsSync(target) && statSync(target).isFile()) return target;
  }
  return null;
};

// The page: a list of orders on a host port, as the docs connect the set.
const KIND_TAG = {table: 'sf-view-table', board: 'sf-view-board', cards: 'sf-view-cards', calendar: 'sf-view-calendar'};
const CASES = [['table-markup', 'table'], ['table-bare', 'table'], ['board', 'board'], ['cards', 'cards'], ['calendar', 'calendar']];
const page = (theme, shape, kind) => `<!doctype html>
<html lang="ru" class="theme-${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/distr/core/css/core.css">
<script>
window.__shifts = []; try { new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { if (!e.hadRecentInput) window.__shifts.push({v: e.value, t: Math.round(e.startTime), src: (e.sources || []).map(function (x) { var n = x.node; return (n ? n.nodeName + '.' + String(n.className || '').split(' ')[0] : '?') + ' y' + Math.round(x.previousRect.y) + '->' + Math.round(x.currentRect.y); }).join(', ')}); }); }).observe({type: 'layout-shift', buffered: true}); } catch (e) {}
window.sfPath = '/distr/'; window.sfSmartPath = '/distr/';
window.SF_BOOT_CONFIG = {cacheVersion: 'slow', pluginListVersion: 'slow', preloader: {enabled: false}, packages: {view: {base: '/distr/smart/'}}};
</script>
<script src="/distr/core/lang/ru.js"></script>
<script src="/distr/core/js/core.js"></script>
<style>html,body{background:var(--sf-surface-page);margin:0}body{padding:16px}</style>
</head><body><main>
<sf-view id="v" aria-label="Заказы" heading="Заказы" head="list" collection="orders"${kind === 'table' ? '' : ` layout="${kind}"`} preferences-key="slow-${shape}">
  ${shape === 'table-markup' ? '<sf-view-table slot="content" aria-label="Заказы"></sf-view-table>' : ''}
  <sf-pagination slot="pagination" top="false" page-size="10"></sf-pagination>
</sf-view>
</main>
<script>
(function(){
  var S=[{value:'new',label:'Новый'},{value:'work',label:'В работе'},{value:'done',label:'Готов'}];
  var F=[{key:'status',label:'Статус',propertyType:'choice',filter:{options:S}},{key:'client',label:'Клиент',propertyType:'string'},{key:'due',label:'Дата',propertyType:'date'}];
  var C=[{key:'title',label:'Заказ',role:'title'},{key:'status',label:'Статус',property_type:'choice',options:S},{key:'client',label:'Клиент'},{key:'sum',label:'Сумма',property_type:'money'},{key:'due',label:'Дата',property_type:'date'}];
  var now=new Date(),ym=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  var R=[];for(var i=0;i<30;i++)R.push({id:'r'+i,revision:'1',actions:['view'],title:'Заказ '+(500+i),status:S[i%3].value,client:['Альфа','Бета','Гамма','Дельта'][i%4],sum:(1000+i*37)+',00 ₽',due:ym+'-'+String(1+i%27).padStart(2,'0')});
  var port={version:'1.15.0',capabilities:['row-actions'],
    describe:function(){return {fields:F,layouts:['table','board','cards','calendar'],permissions:{}}},
    raise:function(intent,p){p=p||{};
      if(intent==='query.change'){var q=p.query||{},per=+q.per_page||10,page=+q.page||1;
        if(q.window&&q.window.per_page){per=+q.window.per_page;page=+q.window.page||1}
        var days=q.window&&(q.window.from||q.window.days);
        var lanes=S.map(function(s){var r=R.filter(function(x){return x.status===s.value});return {value:s.value,label:s.label,records:r.slice(0,5),total:r.length}});
        return Promise.resolve({answer:'applied',sequence:p.sequence,data:{columns:C,records:days?R:R.slice((page-1)*per,page*per),total:R.length,
          lanes:q.window&&('lanes' in q.window)?lanes:undefined,board:{order_field:''},
          view_config:{layouts:{board:{lane_field:'status',card_fields:['client']},cards:{card_fields:['status','client','sum']},calendar:{date_field:'due',event_fields:['client']}}},
          echo:{filters_chosen:q.filters_chosen||['status'],filters:q.filters||{},search:q.search||'',sort:q.sort||[],page:page,per_page:per,view:q.view||{id:'all',type:'${kind}'}}}})}
      return Promise.resolve({answer:'applied'})}};
  customElements.whenDefined('sf-view').then(function(){document.getElementById('v').setHostPort(port)});
})();
</script></body></html>`;

const pages = new Map();
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (pages.has(path)) {
    res.writeHead(200, {'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store'});
    return res.end(pages.get(path));
  }
  if (path === '/favicon.ico') { res.writeHead(204); return res.end(); }
  const target = file(path);
  if (!target) { res.writeHead(404); return res.end(''); }
  const body = existsSync(`${target}.gz`) ? readFileSync(`${target}.gz`) : gzipSync(readFileSync(target), {level: 9});
  res.writeHead(200, {'content-type': TYPES[extname(target)] ?? 'application/octet-stream', 'content-encoding': 'gzip',
    'content-length': body.length, 'cache-control': 'no-store', 'access-control-allow-origin': '*'});
  return res.end(body);
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || undefined, ignoreDefaultArgs: ['--hide-scrollbars']});

const HOLD_NOTE = /was not defined within \d+ ms; its elements are shown as they are/u;
async function run({shape, kind, theme, width, run}) {
  const key = `/slow-${shape}-${theme}-${width}-${run}-${Math.random().toString(36).slice(2)}`;
  pages.set(key, page(theme, shape, kind));
  const context = await browser.newContext({viewport: {width, height: width < 768 ? 844 : 900}, colorScheme: theme, deviceScaleFactor: 1});
  const tab = await context.newPage();
  const errors = [];
  tab.on('pageerror', (error) => errors.push(`pageerror: ${error.message.slice(0, 200)}`));
  tab.on('console', (message) => {
    const text = message.text();
    if (message.type() === 'error' || (message.type() === 'warning' && !/preload/u.test(text) && !HOLD_NOTE.test(text))) errors.push(`${message.type()}: ${text.slice(0, 200)}`);
  });
  tab.on('response', (response) => { if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) errors.push(`${response.status()} ${new URL(response.url()).pathname}`); });
  const cdp = await context.newCDPSession(tab);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {offline: false, latency: 300, downloadThroughput: 750 * 1024 / 8, uploadThroughput: 250 * 1024 / 8});
  const started = Date.now();
  const result = {shape, kind, theme, width, run};
  try {
    await tab.goto(origin + key, {waitUntil: 'load', timeout: 120000});
    await tab.waitForFunction(([tag, kind]) => {
      const view = document.getElementById('v');
      if (!view || !customElements.get('sf-view') || !customElements.get(tag) || view.hasAttribute('data-sf-awaiting')) return false;
      const element = kind === 'table' ? view.table : view.querySelector(`:scope > ${tag}`);
      if (!element) return false;
      // The phone month draws dots, not the events' titles.
      if (kind === 'calendar') return Boolean(element.querySelector('.sf-view-calendar__main'));
      const text = `${element.textContent} ${element.shadowRoot?.textContent ?? ''}`;
      return text.includes('Заказ 50');
    }, [KIND_TAG[kind], kind], {timeout: 120000, polling: 100});
    result.drawn_ms = Date.now() - started;
    await tab.waitForTimeout(1500);
    const shifts = await tab.evaluate(() => window.__shifts);
    result.cls = Math.round(shifts.reduce((sum, one) => sum + one.v, 0) * 10000) / 10000;
    result.shifts = shifts.map((one) => `${Math.round(one.v * 1e4) / 1e4}@${one.t}ms ${one.src}`);
  } catch (error) {
    result.error = String(error.message ?? error).split('\n')[0];
  }
  result.errors = errors;
  result.passed = !result.error && result.cls === 0 && !errors.length;
  await context.close();
  return result;
}

const jobs = [];
for (const [shape, kind] of CASES) {
  if (ONLY && ONLY !== shape) continue;
  for (const [theme, width] of [['light', 1440], ['dark', 390]]) for (let n = 1; n <= RUNS; n += 1) jobs.push({shape, kind, theme, width, run: n});
}
// Each page has its own emulated line, so a few run side by side.
const results = [];
const pool = Number(process.env.SLOW_LINE_POOL || 5);
let next = 0;
await Promise.all(Array.from({length: Math.min(pool, jobs.length)}, async () => {
  while (next < jobs.length) {
    const job = jobs[next++];
    results.push(await run(job));
  }
}));
await browser.close();
server.close();
results.sort((a, b) => `${a.shape}${a.width}${a.run}`.localeCompare(`${b.shape}${b.width}${b.run}`));
const failed = results.filter((one) => !one.passed);
const summary = {gate: 'first-paint slow line', line: {latency_ms: 300, down_kbit: 750, up_kbit: 250}, runs: RUNS, measured: results.length,
  passed: results.length - failed.length, cls: Math.max(0, ...results.map((one) => one.cls ?? 0)), failed: failed.map((one) => `${one.shape} ${one.width} ${one.theme} #${one.run}: ${one.error ?? `cls ${one.cls} ${one.shifts?.slice(0, 2).join('; ')}`}${one.errors.length ? ` errors ${one.errors.slice(0, 2).join('; ')}` : ''}`),
  results};
const json = option('--json', '');
if (json) writeFileSync(json, `${JSON.stringify(summary, null, 1)}\n`);
console.log(JSON.stringify({...summary, results: undefined}, null, 1));
process.exitCode = failed.length ? 1 : 0;
