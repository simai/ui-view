#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// The column settings are reordered by their handle (owner, 2026-10-13): a
// loose column dragged by its handle shows where it will land, stays among the
// loose ones, and the new order applies and reaches the host. Since 1.22.0
// (C106) the window is SIMAI Framework sf-settings look="panel", whose fields
// list draws the handle and the drop line.
import {resolve, join} from 'node:path';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
const styles = [
  'core/core/css/core.css', 'core/core/css/utility.full.css',
  'component/component/pagination/css/pagination.css',
  'component/component/inputs/css/inputs.css',
  'component/component/context-menu/css/context-menu.css',
  'component/component/checkbox/css/checkbox.css',
  'component/component/tabs/css/tabs.css',
  'component/component/buttons/css/buttons.css', 'component/component/icon-buttons/css/icon-buttons.css',
  'component/component/icons/css/icons.css',
  'smart/smart/view-table/css/view-table.css', 'smart/smart/resizer/css/resizer.css', 'smart/smart/sortable/css/sortable.css',
  'smart/smart/switch/css/switch.css', 'smart/smart/settings/css/settings.css',
].map((p) => join(out, p));
const modules = [
  'core/core/js/core.js', 'core/core/js/smart-base.js', 'smart/smart/icon/js/icon.js', 'smart/smart/button/js/button.js',
  'smart/smart/button-icon/js/button-icon.js', 'smart/smart/checkbox/js/checkbox.js',
  'smart/smart/list-item/js/list-item.js', 'smart/smart/dropdown/js/dropdown.js',
  'smart/smart/input/js/input.js', 'smart/smart/spinner/js/spinner.js',
  'smart/smart/button-close/js/button-close.js', 'smart/smart/menu-context/js/menu-context.js',
  'smart/smart/tabs/js/tabs.js', 'smart/smart/tag/js/tag.js',
  'smart/smart/pagination/js/pagination.js', 'smart/smart/sortable/js/sortable.js', 'smart/smart/resizer/js/resizer.js',
  'smart/smart/switch/js/switch.js', 'smart/smart/settings/js/settings.js', 'smart/smart/view-table/js/view-table.js',
].map((p) => join(out, p));

const failures = [];
const note = (detail) => failures.push(detail);
const browser = await chromium.launch();

// Twenty-two fields, which is what makes the windows taller than the screen.
const FIELDS = Array.from({length: 22}, (_, index) => ({
  key: `f${index}`,
  label: `Поле ${index}`,
  filter: {enabled: true, control: 'text', defaultOperator: 'contains', operators: ['contains']},
}));

const open = async (height = 700) => {
  const page = await browser.newPage({viewport: {width: 1280, height}});
  await page.setContent(
    `<!doctype html><html class="theme-light" lang="ru"><body style="margin:0">
       <div style="width:1200px"><sf-view-table id="t"></sf-view-table></div></body></html>`,
  );
  for (const path of styles) await page.addStyleTag({path}).catch(() => {});
  for (const path of modules) await page.addScriptTag({path, type: 'module'}).catch(() => {});
  await page.waitForTimeout(1100);
  await page.evaluate((fields) => {
    const table = document.getElementById('t');
    window.saved = [];
    table.addEventListener('sf-table-column-settings-change', (event) => {
      window.saved.push(JSON.parse(JSON.stringify(event.detail ?? {})));
    });
    table.setColumns(fields.map((field) => ({key: field.key, label: field.label})));
    table.setRows([{id: '1', f0: 'a', f1: 'b'}]);
    table.setFilterFields(fields);
  }, FIELDS);
  await page.waitForTimeout(500);
  return page;
};

const openWindow = async (page, label) => {
  // The control's host is display: contents, so the click goes to the real
  // button inside it; matching by aria-label on the host finds the control
  // whatever element the template wraps it in.
  const opened = await page.evaluate((name) => {
    // A control with visible text carries it in `text` and has no aria-label;
    // an icon-only one carries the name in aria-label. Match either.
    const host = [...document.querySelectorAll('#t sf-button, #t sf-button-icon')]
      .find((node) => node.getAttribute('aria-label') === name || node.getAttribute('text') === name);
    const control = host?.querySelector('button') ?? host;
    control?.click();
    return Boolean(control);
  }, label);
  if (!opened) throw new Error(`no control labelled ${label}`);
  await page.waitForTimeout(700);
  const surface = await page.evaluate(() => Boolean(document.querySelector('sf-settings[data-table-settings] .sf-settings-panel:not([hidden])')));
  if (!surface) throw new Error(`the window ${label} did not open`);
};

try {
  const page = await open(900);
  await openWindow(page, 'Настройки');
  await page.waitForTimeout(300);
  const PANEL = 'sf-settings[data-table-settings] .sf-settings-panel';
  const row = (key) => `${PANEL} .sf-settings-row:has(> [data-sf-option="${key}"])`;
  // The «На телефоне» switches (LV3-11, view round 14) are their own list,
  // not the columns' order.
  const lists = await page.evaluate((panel) => [...document.querySelectorAll(`${panel} .sf-settings-list`)].filter((list) => !String(list.dataset.sfList ?? '').startsWith('switches:phone'))
    .map((list) => ({list: list.dataset.sfList, rows: list.querySelectorAll('.sf-settings-row').length,
      handles: list.querySelectorAll('.sf-settings-row-handle').length})), PANEL);
  const handle = page.locator(`${row('f2')} .sf-settings-row-handle`).first();
  const target = page.locator(row('f5')).first();
  const from = await handle.boundingBox();
  const onto = await target.boundingBox();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2, from.y + 20, {steps: 4});
  await page.mouse.move(from.x + from.width / 2, onto.y + onto.height * 0.75, {steps: 10});
  const during = await page.evaluate((panel) => {
    const key = (node) => node?.querySelector('[data-sf-option]')?.dataset.sfOption ?? null;
    return {dragging: key(document.querySelector(`${panel} .sf-settings-row--dragging`)),
      dropBefore: key(document.querySelector(`${panel} .sf-settings-row--drop-before`))};
  }, PANEL);
  await page.mouse.up();
  await page.waitForTimeout(600);
  const after = await page.evaluate((panel) => {
    const table = document.getElementById('t');
    const loose = table.getColumns().filter((column) => !column.system).map((column) => column.key);
    const shown = [...document.querySelectorAll(`${panel} .sf-settings-row-main[data-sf-option]`)].map((node) => node.dataset.sfOption);
    return {order: loose.slice(0, 8), panel: shown.slice(0, 8), saved: window.saved.length, reason: window.saved.at(-1)?.reason ?? null};
  }, PANEL);
  console.log(JSON.stringify({lists, during, after}, null, 1));
  if (lists.length !== 1 || lists[0].list !== 'fields:columns' || lists[0].handles !== lists[0].rows) {
    note({case: 'lists', got: lists, expected: 'the columns as one fields list, a handle in every row'});
  }
  // The pointer at three quarters of f5 stands over the top half of f6.
  if (during.dragging !== 'f2' || during.dropBefore !== 'f6') {
    note({case: 'drop line', got: during, expected: 'f2 dragged, the line before f6'});
  }
  const at = (key) => after.order.indexOf(key);
  if (!(at('f2') > at('f5')) || after.panel.indexOf('f2') !== after.panel.indexOf('f5') + 1 || after.saved < 1 || after.reason !== 'column-order') {
    note({case: 'order', got: after, expected: 'f2 after f5 in the table and the panel, sent to the host as column-order'});
  }
  await page.close();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(JSON.stringify(failures, null, 1));
  process.exitCode = 1;
} else {
  console.log('TABLE_SORTABLE_LISTS_OK');
}
