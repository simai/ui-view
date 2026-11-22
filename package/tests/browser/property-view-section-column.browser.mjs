#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output [--theme light|dark]
// VR11-1 (view round 11, owner remark via DEV msg-0ded9f0c): one owner of the
// sections' column. Where the record card lays its sections as a column
// (data-sections-layout="column", 12rem reserved beside the fields) the
// vertical sf-tabs in it draws the vertical list, never its folded underline
// row: sf-tabs folds below the h1 step (44rem) of the first box around the
// column wider than it, and a panel below the whole screen is narrower than
// that, so view 1.10.1 reserved the column (688 px scroller, 192 px column)
// and drew aria-orientation="horizontal" inside it. Cases, each light and dark:
// - a record panel of two sections at 1440, 1280 and 1024 (panel-size 2);
// - the same panel on the whole screen (panel-size full) at 1024;
// - a card in place, sections-as list, in a 500 px and a 1000 px box at 1440;
// in every case: no tablist in .sf-property-view-sections says horizontal;
// a column is drawn only with its vertical list; a panel laid as tabs is not
// widened for a column; console clean.
import {resolve, join} from 'node:path';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
const themeAt = process.argv.indexOf('--theme');
const themes = themeAt === -1 ? ['light', 'dark'] : [process.argv[themeAt + 1]];
const styles = [
  'core/core/css/core.css', 'core/core/css/utility.full.css',
  'component/component/badges/css/badges.css', 'component/component/avatars/css/avatars.css',
  'component/component/reference-link/css/reference-link.css',
  'component/component/inputs/css/inputs.css', 'component/component/buttons/css/buttons.css',
  'component/component/icon-buttons/css/icon-buttons.css', 'component/component/close/css/close.css',
  'component/component/icons/css/icons.css',
  'component/component/dropdown/css/dropdown.css', 'component/component/tags/css/tags.css',
  'component/component/skeleton/css/skeleton.css', 'component/component/tabs/css/tabs.css',
  'smart/smart/drawer/css/drawer.css', 'smart/smart/view-properties/css/view-properties.css', 'smart/smart/popover/css/popover.css',
  'smart/smart/empty-state/css/empty-state.css', 'component/component/context-menu/css/context-menu.css',
].map((p) => join(out, p));
const modules = [
  'core/core/js/core.js', 'core/core/js/smart-base.js', 'smart/smart/icon/js/icon.js', 'smart/smart/badge/js/badge.js',
  'smart/smart/avatar/js/avatar.js', 'smart/smart/reference-link/js/reference-link.js',
  'smart/smart/input/js/input.js', 'smart/smart/button-icon/js/button-icon.js', 'smart/smart/button/js/button.js',
  'smart/smart/button-close/js/button-close.js', 'smart/smart/button-copy/js/button-copy.js',
  'smart/smart/list-item/js/list-item.js', 'smart/smart/spinner/js/spinner.js',
  'smart/smart/drawer/js/drawer.js', 'smart/smart/tag/js/tag.js', 'smart/smart/tabs/js/tabs.js',
  'smart/smart/field-renderers/js/field-renderers.js', 'smart/smart/menu-context/js/menu-context.js',
  'smart/smart/popover/js/popover.js', 'smart/smart/empty-state/js/empty-state.js',
  'smart/smart/view-common/js/view-common.js', 'smart/smart/view-properties/js/view-properties.js',
].map((p) => join(out, p));

const failures = [];
const results = {};
const record = (id) => {
  const field = (key, label, value) => ({key, label, propertyType: 'string', value, width: 'half'});
  return {record_id: id, collection: 'orders', revision: '1', label: 'Заказ №1015', actions: [],
    sections: [
      {key: 'order', label: 'Заказ', groups: [{key: 'g1', label: 'Заказ', columns: 2, fields: [field('name', 'Название', 'Заказ №1015'), field('sum', 'Сумма', '20 550 ₽')]}]},
      {key: 'client', label: 'Клиент', groups: [{key: 'g2', label: 'Клиент', columns: 2, fields: [field('client', 'Клиент', 'ООО «Ромашка»'), field('city', 'Город', 'Казань')]}]},
    ]};
};
const cases = [
  {name: 'panel 2 @1440', width: 1440, panel: '2'},
  {name: 'panel 2 @1280', width: 1280, panel: '2'},
  {name: 'panel 2 @1024', width: 1024, panel: '2'},
  {name: 'panel full @1024', width: 1024, panel: 'full'},
  {name: 'in place 500 @1440', width: 1440, box: 500},
  {name: 'in place 1000 @1440', width: 1440, box: 1000},
];
const browser = await chromium.launch();
try {
  for (const theme of themes) for (const one of cases) {
    const page = await browser.newPage({viewport: {width: one.width, height: 900}});
    const errors = [];
    page.on('pageerror', (error) => { if (!/publicPath/u.test(error.message)) errors.push(`pageerror: ${error.message}`); });
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`error: ${message.text()}`); });
    await page.setContent(`<!doctype html><html class="theme-${theme}" lang="ru"><head><meta charset="utf-8"></head><body style="margin:0;padding:24px"><div id="box"></div></body></html>`);
    for (const style of styles) if (existsSync(style)) await page.addStyleTag({path: style});
    {
      const ruFile = modules.find((m) => m.endsWith('core/js/core.js'))?.replace(/js\/core\.js$/u, 'lang/ru.js');
      if (ruFile && existsSync(ruFile)) await page.addScriptTag({path: ruFile});
    }
    for (const module of modules) if (existsSync(module)) await page.addScriptTag({path: module, type: 'module'});
    await page.waitForFunction(() => Boolean(customElements.get('sf-view-properties')), null, {timeout: 10000});
    await page.evaluate(({one, data}) => {
      const card = document.createElement('sf-view-properties');
      const box = document.getElementById('box');
      if (one.box) box.style.maxWidth = `${one.box}px`;
      const attributes = one.panel ? [['panel', ''], ['panel-size', one.panel], ['panel-label', 'Заказ №1015']] : [['sections-as', 'list']];
      for (const [name, value] of [...attributes, ['mode', 'view'], ['collection', 'orders'], ['record-id', data.record_id], ['aria-label', 'Заказ №1015']]) card.setAttribute(name, value);
      box.append(card);
      card.setHostPort({version: '1.7.0', capabilities: [], async raise(intent) {
        return intent === 'record.load' ? {answer: 'applied', record: data} : {answer: 'applied'};
      }});
    }, {one, data: record('o15')});
    await page.waitForFunction(() => document.querySelector('sf-view-properties')?.getAttribute('data-state') === 'ready', null, {timeout: 10000});
    await page.waitForTimeout(600);
    const seen = await page.evaluate((one) => {
      const card = document.querySelector('sf-view-properties');
      const root = one.panel ? document.querySelector('.sf-property-view-panel[data-sections-layout]') : card;
      const column = root?.querySelector('.sf-property-view-sections');
      const lists = [...(column?.querySelectorAll('[role="tablist"]') ?? [])].filter((n) => n.getBoundingClientRect().width > 0);
      const shell = root?.closest?.('.sf-drawer-panel');
      return {layout: card.sectionsLayout, drawn: root?.getAttribute?.('data-sections-layout') ?? null,
        column: column ? Math.round(column.getBoundingClientRect().width) : 0,
        orientation: lists.map((n) => n.getAttribute('aria-orientation') || 'horizontal'),
        top: [...(root?.querySelectorAll('.sf-property-view-tabs [role="tablist"]') ?? [])].length,
        panel: shell ? Math.round(shell.getBoundingClientRect().width) : null, widened: card.panelWidened};
    }, one);
    results[`${theme} ${one.name}`] = seen;
    if (seen.orientation.includes('horizontal')) failures.push({theme, case: `${one.name}: the column's tabs draw the vertical list`, got: seen});
    if (seen.layout === 'column' && !(seen.column > 0 && seen.orientation.length && seen.orientation.every((o) => o === 'vertical'))) failures.push({theme, case: `${one.name}: a column is drawn with its vertical list`, got: seen});
    if (seen.layout === 'tabs' && (seen.column > 0 || seen.widened)) failures.push({theme, case: `${one.name}: tabs on top reserve no column`, got: seen});
    if (seen.layout === 'tabs' && !seen.top) failures.push({theme, case: `${one.name}: tabs on top are drawn`, got: seen});
    if (errors.length) failures.push({theme, case: `${one.name}: console clean`, got: errors});
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('PROPERTY_VIEW_SECTION_COLUMN_OK');
