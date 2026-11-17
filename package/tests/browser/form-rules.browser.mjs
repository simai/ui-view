#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Build output root is required: the directory holding core/, smart/, component/, utility/.
//
// sf-view-properties 1.17.0, C289 (7) and C182 (6) (7) (view round 1 C7,
// VF-9): the form rules of a record being edited, through the real Loader,
// in a panel at 1440 and 390:
//   - Save is never disabled: not with nothing changed, not with errors;
//   - Save over two required fields left empty raises nothing; each field says
//     «Заполните поле», a summary (role alert) lists both in field order with
//     a link each, and the focus is on the summary; a link takes the focus to
//     its field;
//   - with one error left there is no summary and the focus is on that field;
//   - a host that answers confirm_required is asked in place with sf-confirm
//     (the host's words, «Сохранить» and «Вернуться к правке»), not a bar of
//     the view's own; going back raises nothing and keeps the entries; a
//     second Save asked again and accepted raises the save once more with the
//     digest, and the group leaves editing.
import {createServer} from 'node:http';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {extname, join, resolve, sep} from 'node:path';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
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
const BOOT = {cacheVersion: 'form-rules', pluginListVersion: 'form-rules', preloader: {enabled: false}, packages: {[PACKAGE]: {base: '/distr/smart/'}}};

const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (path === '/card') {
    response.writeHead(200, {'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store'});
    response.end(html());
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

const fields = [
  {key: 'title', label: 'Название', propertyType: 'string', required: true, value: 'Поставка кресел'},
  {key: 'stage', label: 'Стадия', propertyType: 'string', required: true, value: 'Переговоры'},
  {key: 'note', label: 'Комментарий', propertyType: 'string', value: ''},
];
const record = {record_id: 'deal-15', collection: 'crm.deals', revision: '3', title: 'Сделка № 15', actions: ['record.edit'],
  sections: [{key: 'main', label: 'Основное', groups: [{key: 'deal', label: 'Сделка', fields}]}]};

const html = () => `<!doctype html><html lang="ru" class="theme-light"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>form rules</title><link rel="icon" href="data:,">
<link rel="stylesheet" href="/distr/core/css/core.css">
<script>window.sfPath='/distr/';window.sfSmartPath='/distr/';window.SF_BOOT_CONFIG=${JSON.stringify(BOOT)};</script>
<script src="/distr/core/js/core.js"></script></head>
<body style="margin:0"><sf-view-properties id="view" record-id="deal-15" collection="crm.deals" panel-label="Сделка № 15" panel panel-size="2"></sf-view-properties>
<script>
const record = ${JSON.stringify(record)};
window.__saves = [];
window.__confirm = 0;
customElements.whenDefined('sf-view-properties').then(() => {
  const view = document.getElementById('view');
  view.addEventListener('sf-view-properties-close', (event) => event.preventDefault());
  view.setHostPort({version: '1.18.0', capabilities: [], raise(intent, payload) {
    if (intent === 'record.load') return Promise.resolve({answer: 'applied', record}).finally(() => { window.__loaded = true; });
    if (intent === 'record.save' || intent === 'group.save') {
      window.__saves.push(JSON.parse(JSON.stringify(payload ?? {})));
      if (window.__confirm && !payload?.confirm) {
        window.__confirm -= 1;
        return Promise.resolve({answer: 'refused', reason: 'confirm_required', confirm: {summary: 'Сделка уйдёт на согласование. Сохранить?', digest: 'd1'}});
      }
      return Promise.resolve({answer: 'applied', record});
    }
    return Promise.resolve({answer: 'unavailable', reason: 'probe'});
  }});
});
</script></body></html>`;

const failures = [];
const rows = [];
const browser = await chromium.launch();
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({viewport: {width, height: 900}});
    const noise = [];
    page.on('console', (message) => { if (message.type() === 'error') noise.push(message.text().split('\n')[0]); });
    page.on('pageerror', (error) => noise.push(error.message));
    await page.goto(`${origin}/card`);
    await page.waitForFunction(() => window.__loaded === true, null, {timeout: 20000}).catch(() => {});
    await page.waitForTimeout(2000);
    const at = (what) => `${width}: ${what}`;
    const check = (what, pass, got) => { if (!pass) failures.push({check: at(what), got}); };
    const look = () => page.evaluate(() => {
      const view = document.getElementById('view');
      const save = view.querySelector('[data-action="save"]');
      const native = save?.matches('button') ? save : save?.querySelector('button');
      const summary = view.querySelector('.sf-property-view-error-summary');
      const active = document.activeElement;
      return {
        saveDrawn: Boolean(save), saveDisabled: Boolean(native?.disabled || save?.hasAttribute('disabled')),
        saves: window.__saves.length, lastConfirm: window.__saves.at(-1)?.confirm ?? null,
        summary: summary ? {role: summary.getAttribute('role'), links: [...summary.querySelectorAll('a')].map((a) => a.getAttribute('href'))} : null,
        focusOnSummary: Boolean(summary && (active === summary || summary.contains(active))),
        focusField: active?.closest?.('[data-field]')?.getAttribute('data-field') ?? null,
        messages: Object.fromEntries(['title', 'stage'].map((key) => [key, (view.querySelector(`[data-field="${key}"] .sf-property-view-field-error, [data-field="${key}"] [data-field-message="error"]`)?.textContent ?? '').trim()])),
        confirm: (() => { const c = view.querySelector('.sf-property-view-actions sf-confirm'); return c ? {text: c.textContent.replace(/\s+/gu, ' ').trim(), buttons: [...c.querySelectorAll('button')].map((b) => b.textContent.trim())} : null; })(),
        ownBar: Boolean(view.querySelector('.sf-property-view-confirmation, [data-action="confirm-save"]')),
        editing: Boolean(view.editing),
        title: view.querySelector('[data-field="title"] input')?.value ?? null,
      };
    });
    const type = async (key, text) => {
      const input = page.locator(`#view [data-field="${key}"] input`).first();
      await input.fill(text);
      await input.press('Tab');
      await page.waitForTimeout(150);
    };
    const save = async () => { await page.locator('#view [data-action="save"]').first().click(); await page.waitForTimeout(500); };

    await page.locator('#view [data-action="edit"]').first().click();
    await page.waitForTimeout(800);
    const start = await look();
    check('Save is drawn and enabled with nothing changed', start.saveDrawn && !start.saveDisabled, start);
    await type('title', '');
    await type('stage', '');
    const empty = await look();
    check('Save stays enabled with two required fields empty', !empty.saveDisabled, empty);
    await save();
    const refused = await look();
    check('nothing is raised', refused.saves === 0, refused);
    check('each field says it', refused.messages.title === 'Заполните поле' && refused.messages.stage === 'Заполните поле', refused);
    check('the summary lists both, in field order, with links', refused.summary?.role === 'alert'
      && JSON.stringify(refused.summary.links) === '["#title","#stage"]', refused);
    check('the focus is on the summary', refused.focusOnSummary, refused);
    await page.locator('#view .sf-property-view-error-summary a').nth(1).click();
    await page.waitForTimeout(300);
    const linked = await look();
    check('a link takes the focus to its field', linked.focusField === 'stage', linked);
    await type('title', 'Поставка столов');
    await save();
    const one = await look();
    check('one error: no summary, the focus on the field', !one.summary && one.focusField === 'stage' && one.saves === 0, one);
    await type('stage', 'Договор');
    await page.evaluate(() => { window.__confirm = 2; });
    await save();
    const asked = await look();
    check('the host asks: sf-confirm in place with its words', asked.saves === 1 && asked.confirm
      && asked.confirm.text.includes('Сделка уйдёт на согласование') && asked.confirm.buttons.length === 2 && !asked.ownBar, asked);
    await page.locator('#view .sf-property-view-actions sf-confirm button').nth(1).click();
    await page.waitForTimeout(400);
    const back = await look();
    check('going back raises nothing and keeps the entries', back.saves === 1 && !back.confirm && back.editing && back.title === 'Поставка столов', back);
    await save();
    await page.locator('#view .sf-property-view-actions sf-confirm button').first().click();
    await page.waitForTimeout(600);
    const done = await look();
    check('accepted: the save is raised again with the digest and editing ends', done.saves === 3 && done.lastConfirm === 'd1' && !done.editing, done);
    check('the console has no error', noise.length === 0, noise);
    rows.push({width, start: !start.saveDisabled, summary: refused.summary, focus: refused.focusOnSummary, confirm: asked.confirm?.buttons, saves: done.saves});
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(JSON.stringify(rows));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('FORM_RULES_OK');
