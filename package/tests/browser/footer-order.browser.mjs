#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output [--json /absolute/path/to/report.json]
// Build output root is required: the directory holding core/, smart/, component/, utility/.
//
// The footer order of every panel and dialog of the set (view round 1 D3, D10;
// owner C157 (3), C159 (4); draft set standard 7.7): the main action stands
// first, the others after it, in the reading direction. Through the real
// Loader, 1440 and 390, light and dark, FOOTER_ORDER_LOADS cold loads (1 by
// default, 3 in the evidence):
//   - sf-view-table: the filter window («Применить» before «Сбросить»), the
//     save-template form (the same) and a chip's own window
//     («Применить» before «Сбросить»);
//   - sf-view: the move dialog («Переместить» before «Отмена»);
//   - sf-view-flow: «Отправить» before «Отмена», the status line after them.
// Console errors fail the probe.
import {createServer} from 'node:http';
import {existsSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {extname, join, resolve, sep} from 'node:path';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
const jsonAt = process.argv.indexOf('--json');
const reportPath = jsonAt === -1 ? '' : resolve(process.argv[jsonAt + 1]);
const loads = Number(process.env.FOOTER_ORDER_LOADS || 1);
const mounts = [
  ['/distr/core/', join(out, 'core', 'core')],
  ['/distr/rule/', join(out, 'core', 'rule')],
  ['/distr/component/', join(out, 'component', 'component')],
  ['/distr/utility/', join(out, 'utility', 'utility')],
  ['/distr/smart/', join(out, 'smart', 'smart')],
];
for (const [, path] of mounts) if (!existsSync(path)) throw new Error(`${path} not found: the build output root holds core/, component/, utility/, smart/`);
const TYPES = new Map([['.js', 'text/javascript'], ['.mjs', 'text/javascript'], ['.css', 'text/css'], ['.json', 'application/json'], ['.woff2', 'font/woff2'], ['.woff', 'font/woff'], ['.svg', 'image/svg+xml']]);
const ruleFile = join(out, 'smart', 'smart', 'rule.js');
const PACKAGE = existsSync(ruleFile) ? /registerPackage\(\s*["']([a-z][a-z0-9-]*)["']/u.exec(readFileSync(ruleFile, 'utf8'))?.[1] ?? 'view' : 'view';
const BOOT = {cacheVersion: 'footer-order', pluginListVersion: 'footer-order', preloader: {enabled: false}, packages: {[PACKAGE]: {base: '/distr/smart/'}}};

const page = (theme) => `<!doctype html><html lang="ru" class="theme-${theme}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>footer order</title><link rel="icon" href="data:,">
<link rel="stylesheet" href="/distr/core/css/core.css">
<script>window.sfPath='/distr/';window.sfSmartPath='/distr/';window.SF_BOOT_CONFIG=${JSON.stringify(BOOT)};</script>
<script src="/distr/core/js/core.js"></script>
<style>html,body{background:var(--sf-surface-page);margin:0}body{padding:16px;display:grid;gap:24px}</style></head>
<body>
<sf-view-table id="t" aria-label="Договоры" filter-templates="true"></sf-view-table>
<sf-view id="v" aria-label="Разделы"><sf-view-table slot="content" aria-label="Разделы"></sf-view-table></sf-view>
<div style="max-inline-size:36rem"><sf-view-flow id="f" mode="edit" heading="Новая командировка" block-id="trip-1"></sf-view-flow></div>
</body></html>`;

const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (path.startsWith('/page-')) {
    response.writeHead(200, {'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store'});
    response.end(page(path.endsWith('dark') ? 'dark' : 'light'));
    return;
  }
  let file = '';
  for (const [prefix, root] of mounts) {
    if (!path.startsWith(prefix)) continue;
    const one = resolve(root, path.slice(prefix.length));
    if (one.startsWith(root + sep) && existsSync(one) && !statSync(one).isDirectory()) { file = one; break; }
  }
  if (!file) { response.writeHead(404); response.end(); return; }
  const type = TYPES.get(extname(file)) ?? 'application/octet-stream';
  response.writeHead(200, {'content-type': /^(text|application\/json|image\/svg)/u.test(type) ? `${type}; charset=utf-8` : type, 'cache-control': 'no-store'});
  response.end(readFileSync(file));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;

const failures = [];
const rows = [];
const check = (name, pass, detail = {}) => { if (!pass) failures.push({name, ...detail}); };
const browser = await chromium.launch({headless: true, ...(process.env.PROBE_CHANNEL ? {channel: process.env.PROBE_CHANNEL} : {}), ignoreDefaultArgs: ['--hide-scrollbars']});

// The visible buttons of the last button row inside `root`, in reading order:
// their words, and whether each later one starts after the one before.
const FOOTER = (root) => {
  const all = (node) => [node, ...node.querySelectorAll('*')].flatMap((one) => (one.shadowRoot ? [one, ...all(one.shadowRoot)] : [one]));
  // sf-button's host is display: contents; its box is the inner button's.
  const box = (one) => (one.querySelector(':scope > button') ?? one).getBoundingClientRect();
  const buttons = all(root).filter((one) => one.localName === 'sf-button'
    && box(one).width > 0 && !one.closest('sf-input, sf-input-choice, sf-segmented'));
  if (!buttons.length) return null;
  const last = buttons[buttons.length - 1];
  const row = buttons.filter((one) => one.parentElement === last.parentElement);
  const text = (one) => (one.getAttribute('text') || one.textContent || '').trim();
  const boxes = row.map(box);
  return {
    words: row.map(text),
    inReadingOrder: boxes.every((box, index) => index === 0 || box.left >= boxes[index - 1].left || box.top > boxes[index - 1].top),
    main: row.map((one) => one.getAttribute('appearance') || 'default'),
  };
};

async function stand(width, theme, run) {
  const name = `${width} ${theme}${loads > 1 ? ` #${run}` : ''}`;
  const context = await browser.newContext(width === 390
    ? {viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true, deviceScaleFactor: 2}
    : {viewport: {width: 1440, height: 1000}});
  const tab = await context.newPage();
  const errors = [];
  tab.on('pageerror', (error) => errors.push(error.message));
  tab.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await tab.goto(`${origin}/page-${run}-${theme}`);
  await tab.waitForFunction(() => ['sf-view-table', 'sf-view', 'sf-view-flow'].every((tag) => customElements.get(tag)), null, {timeout: 15000});
  await tab.evaluate(() => {
    const t = document.getElementById('t');
    t.setColumns([{key: 'number', label: 'Номер', role: 'title'}, {key: 'signed', label: 'Подписан', propertyType: 'date'}]);
    t.setRows([{id: 'a', number: 'Д-1', signed: '2026-09-11'}, {id: 'b', number: 'Д-2', signed: '2026-09-12'}]);
    t.setFilterFields([{key: 'number', label: 'Номер', filter: {control: 'text'}}]);
    const f = document.getElementById('f');
    f.fields = [{key: 'city', label: 'Город', propertyType: 'string', width: 'half', required: true}];
    document.getElementById('v').setHostPort({version: '1.12.0', capabilities: [], raise: (intent, payload) => Promise.resolve(intent === 'query.change'
      ? {answer: 'applied', sequence: payload.sequence, data: {total: 1, records: [{id: 'p', revision: '1', title: 'Раздел'}], columns: [{key: 'title', label: 'Раздел', role: 'title'}]}}
      : {answer: 'unavailable', reason: 'capability-not-provided'})});
  });
  await tab.evaluate(() => document.fonts.ready);
  await tab.waitForTimeout(400);
  const table = tab.locator('#t');
  const portalFooter = () => tab.evaluate((code) => {
    const footer = new Function('root', `return (${code})(root)`);
    const layer = document.querySelector('.sf-table-portal .sf-table-context-layer');
    return layer ? footer(layer) : null;
  }, FOOTER.toString());

  // The filter window: a value typed, so both actions are offered.
  await table.locator('sf-button[icon-start="filter_list"] button, sf-button-icon[icon="filter_list"] button').first().click();
  await tab.waitForTimeout(500);
  // A condition written through the table's own draft, as the field would.
  await tab.evaluate(() => {
    const t = document.getElementById('t');
    t.setActiveFilterFields(['number']);
    t.patchTempFilterValue('number', {value: 'Д-1'});
  });
  await tab.waitForTimeout(200);
  const filter = await portalFooter();
  rows.push({stand: name, panel: 'filter', ...filter});
  check(`${name}: filter window: «Применить» first, then «Сбросить»`, Boolean(filter) && /^Применить/u.test(filter.words[0] ?? '') && filter.words.slice(1).some((word) => /^Сбросить/u.test(word)) && filter.inReadingOrder, {got: filter});
  // Applied, the chips and the save-template button are there.
  await tab.locator('.sf-table-portal sf-button').filter({hasText: /Применить/u}).first().click().catch(() => {});
  await tab.waitForTimeout(500);

  const save = table.locator('sf-button-icon[icon="bookmark_add"] button');
  if (await save.count() && await save.isEnabled()) {
    await save.click();
    await tab.waitForTimeout(500);
    const form = await portalFooter();
    rows.push({stand: name, panel: 'save-template', ...form});
    check(`${name}: save-template form: «Применить» first, then «Сбросить»`, Boolean(form) && /^Применить/u.test(form.words[0] ?? '') && /^Сбросить/u.test(form.words[1] ?? '') && form.inReadingOrder, {got: form});
    await tab.keyboard.press('Escape');
    await tab.waitForTimeout(300);
  } else {
    // The list's toolbar (390) has no save-template button: the templates are
    // chosen in the filter's sheet there.
    check(`${name}: the save-template button is offered after a filter`, width === 390);
    rows.push({stand: name, panel: 'save-template', skipped: 'no save button in the list toolbar'});
  }

  const chip = table.locator('.sf-tag').first();
  if (await chip.count()) {
    await chip.click();
    await tab.waitForTimeout(500);
    const own = await portalFooter();
    rows.push({stand: name, panel: 'chip', ...own});
    check(`${name}: a chip's window: «Применить» first, then «Сбросить»`, Boolean(own) && /^Применить/u.test(own.words[0] ?? '') && own.inReadingOrder, {got: own});
    await tab.keyboard.press('Escape');
    await tab.waitForTimeout(300);
  } else check(`${name}: a chip is drawn after a filter`, false);

  // The move dialog of the view, asked directly (its menu entry needs a host
  // that moves; the dialog is the same window).
  const asked = tab.evaluate(() => document.getElementById('v')._dialog({title: 'Переместить', apply: 'Переместить',
    options: [{id: null, label: 'В начало'}, {id: 'p', label: 'Раздел'}]}));
  await tab.waitForTimeout(800);
  const move = await tab.evaluate((code) => {
    const footer = new Function('root', `return (${code})(root)`);
    const actions = [...document.querySelectorAll('.sf-data-view-dialog-actions')].at(-1);
    const scope = actions?.closest('[role="dialog"], dialog, sf-modal') ?? document;
    const radios = [...scope.querySelectorAll('[role="radiogroup"]')].filter((group) => !group.closest('sf-input-choice'));
    return actions ? {...footer(actions), choice: Boolean(scope.querySelector('sf-input-choice')), radiogroup: radios.length > 0} : null;
  }, FOOTER.toString());
  rows.push({stand: name, panel: 'move', ...move});
  check(`${name}: move dialog: «Переместить» first, then «Отмена»`, Boolean(move) && move.words[0] === 'Переместить' && move.words[1] === 'Отмена' && move.inReadingOrder, {got: move});
  check(`${name}: move dialog: the choices are sf-input-choice, no radio group of its own`, Boolean(move?.choice) && !move.radiogroup, {got: move});
  await tab.keyboard.press('Escape');
  await asked.catch(() => null);

  const flow = await tab.evaluate((code) => {
    const footer = new Function('root', `return (${code})(root)`);
    const host = document.getElementById('f');
    const root = host.shadowRoot ?? host;
    const found = footer(root);
    const actions = [...root.querySelectorAll('sf-button')].at(-1)?.parentElement;
    const status = actions?.parentElement?.querySelector(':scope > p, :scope > [role="status"]');
    const statusAfter = !status || Boolean(actions.compareDocumentPosition(status) & Node.DOCUMENT_POSITION_FOLLOWING);
    return found ? {...found, statusAfter} : null;
  }, FOOTER.toString());
  rows.push({stand: name, panel: 'view-flow', ...flow});
  check(`${name}: view-flow: «Отправить» first, then «Отмена»`, Boolean(flow) && flow.words[0] === 'Отправить' && flow.words[1] === 'Отмена' && flow.inReadingOrder, {got: flow});
  check(`${name}: view-flow: the status line after the actions`, Boolean(flow?.statusAfter), {got: flow});

  check(`${name}: the console is clean`, errors.length === 0, {errors});
  await context.close();
}

try {
  for (const width of [1440, 390]) for (const theme of ['light', 'dark']) {
    for (let run = 1; run <= loads; run += 1) await stand(width, theme, run);
  }
} finally {
  await browser.close();
  server.close();
}
const result = {probe: 'footer-order', result: failures.length ? 'FOOTER_ORDER_FAIL' : 'FOOTER_ORDER_OK', failures, rows};
if (reportPath) writeFileSync(reportPath, `${JSON.stringify(result, null, 1)}\n`);
console.log(JSON.stringify({probe: result.probe, result: result.result, failures, cases: rows.length}, null, 1));
if (failures.length) process.exitCode = 1;
