#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output [--theme light|dark]
// Larena L-4 (view round 10): the record panel's head at 1440, watched frame
// by frame while the component's own sheet comes late. A page that has the
// component's code already (a bundle of its own, or a cached one) draws the
// head before the Loader brings the sheet; in sf-view-properties 1.23.5 the
// «⋯» then stood beside the title's star and moved to the row's end when the
// sheet came (about half a second at Larena). The head's row, its band's edges
// and the title's box are written on the elements as well, so from the first
// frame the «⋯» and the star stand where they stand once the sheet is in:
// - the panel opens with every sheet but view-properties.css; each animation
//   frame records the «⋯»'s and the star's left edge and the row's end;
// - the sheet is added after the head has drawn; the frames go on;
// - every frame with the «⋯» has the same x as the last (±0.5 px), the same
//   for the star, and the «⋯» ends inside the row, last but the close;
// - light and dark, console clean.
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
  'smart/smart/drawer/css/drawer.css', 'smart/smart/popover/css/popover.css',
  'smart/smart/empty-state/css/empty-state.css', 'component/component/context-menu/css/context-menu.css',
].map((p) => join(out, p));
const ownSheet = join(out, 'smart/smart/view-properties/css/view-properties.css');
const modules = [
  'core/core/js/core.js', 'core/core/js/smart-base.js', 'smart/smart/icon/js/icon.js', 'smart/smart/badge/js/badge.js',
  'smart/smart/avatar/js/avatar.js', 'smart/smart/reference-link/js/reference-link.js',
  'smart/smart/input/js/input.js', 'smart/smart/button-icon/js/button-icon.js', 'smart/smart/button/js/button.js',
  'smart/smart/button-close/js/button-close.js', 'smart/smart/button-copy/js/button-copy.js',
  'smart/smart/list-item/js/list-item.js', 'smart/smart/spinner/js/spinner.js',
  'smart/smart/drawer/js/drawer.js', 'smart/smart/tag/js/tag.js', 'smart/smart/tabs/js/tabs.js',
  'smart/smart/field-renderers/js/field-renderers.js', 'smart/smart/menu-context/js/menu-context.js',
  'smart/smart/popover/js/popover.js', 'smart/smart/empty-state/js/empty-state.js',
  'smart/smart/view-properties/js/view-properties.js',
].map((p) => join(out, p));

const failures = [];
const results = {};
const browser = await chromium.launch();
try {
  for (const theme of themes) {
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    const errors = [];
    page.on('pageerror', (error) => { if (!/publicPath/u.test(error.message)) errors.push(`pageerror: ${error.message}`); });
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`error: ${message.text()}`); });
    await page.setContent(`<!doctype html><html class="theme-${theme}" lang="ru"><head><meta charset="utf-8"></head><body style="margin:0;padding:24px"><p>Список</p></body></html>`);
    for (const style of styles) if (existsSync(style)) await page.addStyleTag({path: style});
    {
      const ruFile = modules.find((one) => one.endsWith('core/js/core.js'))?.replace(/js\/core\.js$/u, 'lang/ru.js');
      if (ruFile && existsSync(ruFile)) await page.addScriptTag({path: ruFile});
    }
    for (const module of modules) if (existsSync(module)) await page.addScriptTag({path: module, type: 'module'});
    await page.waitForFunction(() => Boolean(customElements.get('sf-view-properties')), null, {timeout: 10000});
    // The record and its actions: «Изменить всё» and «Удалить» put the «⋯» in the head.
    await page.evaluate(() => {
      const field = (key, label, value) => ({key, label, propertyType: 'string', value, width: 'half', editable: true});
      const record = {record_id: 'o15', collection: 'orders', revision: '1', label: 'Заказ №1015', actions: ['record.save', 'record.delete'],
        sections: [{key: 'main', label: 'Основное', groups: [{key: 'g', label: 'Заказ', columns: 2, editable: true,
          fields: [field('name', 'Название', 'Заказ №1015'), field('sum', 'Сумма', '20 550 ₽')]}]}]};
      window.__frames = [];
      const visible = (selector) => [...document.querySelectorAll(selector)].find((node) => node.getBoundingClientRect().width > 0);
      const tick = () => {
        const menu = visible('[data-action="menu"]');
        if (menu) {
          let row = menu.parentElement;
          while (row && row.getBoundingClientRect().width === 0) row = row.parentElement;
          const star = visible('[data-action="favourite"]');
          window.__frames.push({t: Math.round(performance.now()), sheet: Boolean(window.__sheetIn), x: menu.getBoundingClientRect().left,
            right: menu.getBoundingClientRect().right, star: star ? star.getBoundingClientRect().left : null, rowEnd: row.getBoundingClientRect().right});
        }
        if (window.__frames.length < 400) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      const panel = document.createElement('sf-view-properties');
      for (const [name, value] of [['panel', ''], ['mode', 'edit'], ['panel-label', 'Заказ №1015'], ['collection', 'orders'], ['record-id', 'o15'], ['aria-label', 'Заказ №1015']]) panel.setAttribute(name, value);
      document.body.append(panel);
      panel.setHostPort({version: '1.7.0', capabilities: ['record-save'], async raise(intent) {
        return intent === 'record.load' ? {answer: 'applied', record} : {answer: 'applied'};
      }});
    });
    await page.waitForFunction(() => window.__frames.length > 10, null, {timeout: 10000}).catch(() => {});
    await page.waitForTimeout(300);
    await page.addStyleTag({path: ownSheet});
    await page.evaluate(() => { window.__sheetIn = true; });
    await page.waitForTimeout(900);
    const frames = await page.evaluate(() => window.__frames);
    const before = frames.filter((frame) => !frame.sheet);
    const last = frames[frames.length - 1];
    const seen = results[theme] = {frames: frames.length, before: before.length, first: frames[0], last};
    if (!before.length || !last?.sheet) failures.push({theme, case: 'the head is watched before and after the sheet', got: seen});
    const moved = frames.filter((frame) => Math.abs(frame.x - last.x) > 0.5 || (frame.star !== null && last.star !== null && Math.abs(frame.star - last.star) > 0.5));
    if (moved.length) failures.push({theme, case: 'the «⋯» and the star stand still from the first frame', got: {moved: moved.slice(0, 3), last}});
    if (!(last.right <= last.rowEnd + 0.5 && last.rowEnd - last.right < 80)) failures.push({theme, case: 'the «⋯» stands at the row end, before the close', got: last});
    if (errors.length) failures.push({theme, case: 'console clean', got: errors});
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results));
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('PROPERTY_VIEW_HEAD_FIRST_FRAME_OK');
