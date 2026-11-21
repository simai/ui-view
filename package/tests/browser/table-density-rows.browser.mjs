#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output

import {resolve, join} from 'node:path';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
const styles = [
  'core/core/css/core.css', 'core/core/css/utility.full.css',
  'component/component/featured-icon/css/featured-icon.css',
  'component/component/pagination/css/pagination.css',
  'smart/smart/empty-state/css/empty-state.css',
  'component/component/tabs/css/tabs.css', 'component/component/context-menu/css/context-menu.css',
  'component/component/checkbox/css/checkbox.css', 'component/component/radio/css/radio.css', 'component/component/buttons/css/buttons.css',
  'smart/smart/switch/css/switch.css', 'smart/smart/settings/css/settings.css',
  'smart/smart/view-table/css/view-table.css', 'smart/smart/resizer/css/resizer.css',
].map((p) => join(out, p));
const modules = [
  'core/core/js/core.js', 'core/core/js/smart-base.js', 'smart/smart/icon/js/icon.js',
  'smart/smart/button/js/button.js', 'smart/smart/button-icon/js/button-icon.js',
  'smart/smart/checkbox/js/checkbox.js', 'smart/smart/list-item/js/list-item.js',
  'smart/smart/dropdown/js/dropdown.js', 'smart/smart/input/js/input.js',
  'smart/smart/spinner/js/spinner.js', 'smart/smart/menu-context/js/menu-context.js',
  'smart/smart/tabs/js/tabs.js', 'smart/smart/tag/js/tag.js', 'smart/smart/radio/js/radio.js',
  'smart/smart/switch/js/switch.js', 'smart/smart/settings/js/settings.js',
  'smart/smart/pagination/js/pagination.js', 'smart/smart/empty-state/js/empty-state.js',
  'smart/smart/resizer/js/resizer.js', 'smart/smart/view-table/js/view-table.js',
  'smart/smart/view/js/view.js',
].map((p) => join(out, p));


// VR11-2 (view round 11, DEV msg-239b481d, study VHF-1): the person's row
// density moves the row one rung on every size step. Since the one row model
// (C146 (1)) a row is its rung's control height and its cells have no block
// padding; view 1.10.1 still added block padding for «Компактно» and
// «Просторно», which over the rung made a size 1/2 compact row taller than a
// normal one (Обычно 32, Компактно 40, Просторно 56). The gear's «Вид» rows
// are pressed with the mouse; each case, light and dark:
// - no size and size="1/2" on a normal page, and no size on a compact page;
// - body and head rows: compact < normal < spacious, compact is the rung
//   below normal, spacious the rung above (read from the page's own tokens).
const failures = [];
const note = (detail) => failures.push(detail);
const browser = await chromium.launch();
const COLUMNS = [{key: 'name', label: 'Название', role: 'title'}, {key: 'city', label: 'Город'}, {key: 'code', label: 'Код'}];
const RECORDS = Array.from({length: 4}, (_, i) => ({id: String(i + 1), name: `Заказ ${i + 1}`, city: 'Казань', code: `K-${i}`}));
const cases = [
  {name: 'size 1, normal page', size: null, page: null, rungs: ['--sf-ui-1\\/2--control-height', '--sf-ui-1--control-height', '--sf-ui-2--control-height']},
  {name: 'size 1/2, normal page', size: '1/2', page: null, rungs: ['--sf-ui-1\\/3--control-height', '--sf-ui-1\\/2--control-height', '--sf-ui-1--control-height']},
  {name: 'size 1, compact page', size: null, page: 'compact', rungs: null},
];
const results = [];
try {
  for (const theme of ['light', 'dark']) for (const one of cases) {
    const context = await browser.newContext({viewport: {width: 1280, height: 800}});
    await context.route('http://probe.test/**', (route) => route.fulfill({status: 200, contentType: 'text/html; charset=utf-8', body: '<!doctype html><html><body></body></html>'}));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => { if (!/publicPath/u.test(error.message)) errors.push(`pageerror: ${error.message}`); });
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`error: ${message.text()}`); });
    await page.goto('http://probe.test/');
    await page.setContent(`<!doctype html><html class="theme-${theme}" lang="ru"${one.page ? ` data-sf-density="${one.page}"` : ''}><body style="margin:0">
      <div style="width:1000px"><sf-view id="v"${one.size ? ` size="${one.size}"` : ''} preferences-key="density.${one.name.replace(/\W+/gu, '-')}.${theme}"><sf-view-table slot="content" id="t"${one.size ? ` size="${one.size}"` : ''}></sf-view-table></sf-view></div></body></html>`);
    for (const path of styles) await page.addStyleTag({path}).catch(() => {});
    for (const path of modules) await page.addScriptTag({path, type: 'module'}).catch(() => {});
    await page.waitForFunction(() => customElements.get('sf-view') && customElements.get('sf-view-table'), null, {timeout: 8000});
    await page.evaluate(([columns, records]) => document.getElementById('v').setHostPort({
      version: '1.10.0', capabilities: [],
      async raise(intent, payload) {
        if (intent !== 'query.change') return {answer: 'applied'};
        return {answer: 'applied', sequence: payload.sequence, data: {records, total: records.length, columns,
          echo: {search: '', filters: {}, sort: [], page: 1, per_page: payload.query.per_page ?? 25}}};
      },
    }), [COLUMNS, RECORDS]);
    await page.waitForFunction(() => document.querySelectorAll('#t tbody tr').length >= 4, null, {timeout: 8000});
    const PANEL = 'sf-settings[data-table-settings] .sf-settings-panel';
    const heights = {};
    for (const density of ['normal', 'compact', 'spacious']) {
      const open = await page.evaluate((panel) => Boolean(document.querySelector(`${panel}:not([hidden])`)), PANEL);
      if (!open) {
        await page.evaluate(() => {
          const table = document.getElementById('t');
          const anchor = table.querySelector('thead th') ?? table;
          table.openContextMenu({currentTarget: anchor, target: anchor, preventDefault() {}, stopPropagation() {}}, {menu: 'table-settings'});
        });
        await page.waitForTimeout(500);
        await page.locator(`${PANEL} .sf-settings-panel-tabs [role="tab"]`).nth(1).click();
        await page.waitForTimeout(300);
      }
      const row = page.locator(`${PANEL} .sf-settings-row-main[data-sf-setting="density"][data-sf-option="${density}"]`).first();
      if (!(await row.count())) { note({case: one.name, theme, density, got: 'no density row in «Вид»'}); continue; }
      // The word on the row pressed is the density it gives (DEV msg-3d7eee66:
      // the owner read «Компактно» as the normal look and «Обычно» as compact).
      const word = (await row.innerText()).replace(/\s+/gu, ' ').trim();
      const WORDS = {compact: 'Компактно', normal: 'Обычно', spacious: 'Просторно'};
      if (!word.includes(WORDS[density])) note({case: one.name, theme, density, got: `the row pressed says «${word}»`});
      await row.click();
      await page.waitForTimeout(300);
      const checked = await page.evaluate((panel) => [...document.querySelectorAll(`${panel} .sf-settings-row-main[data-sf-setting="density"]`)]
        .filter((node) => node.getAttribute('aria-checked') === 'true' || node.getAttribute('aria-selected') === 'true' || node.querySelector('[aria-checked="true"], :checked'))
        .map((node) => node.getAttribute('data-sf-option')), PANEL);
      if (checked.length && checked.join() !== density) note({case: one.name, theme, density, got: `the panel marks ${checked.join()}`});
      heights[density] = await page.evaluate((rungs) => {
        const table = document.getElementById('t');
        const px = (name) => { const probe = document.createElement('div'); probe.style.blockSize = `var(${name})`; table.append(probe); const h = probe.getBoundingClientRect().height; probe.remove(); return h; };
        return {body: Math.round(table.querySelector('tbody tr').getBoundingClientRect().height),
          head: Math.round(table.querySelector('thead tr').getBoundingClientRect().height),
          attr: table.getAttribute('data-sf-view-density'), rungs: rungs ? rungs.map((name) => Math.round(px(name))) : null};
      }, one.rungs);
    }
    const {normal, compact, spacious} = heights;
    if (normal && compact && spacious) {
      for (const part of ['body', 'head']) {
        if (!(compact[part] < normal[part] && normal[part] < spacious[part])) note({case: one.name, theme, part, got: {compact: compact[part], normal: normal[part], spacious: spacious[part]}});
      }
      if (normal.rungs) {
        const [down, here, up] = normal.rungs;
        if (compact.body !== down || normal.body !== here || spacious.body !== up) note({case: `${one.name}: one rung either way`, theme, got: {compact: compact.body, normal: normal.body, spacious: spacious.body}, rungs: normal.rungs});
      }
    }
    if (errors.length) note({case: one.name, theme, errors});
    results.push({case: one.name, theme, heights});
    await context.close();
  }
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('TABLE_DENSITY_ROWS_OK');
