#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// sf-view-properties 1.16.4 in its panel (VP-5, VP-8 of the 2026-11-16
// re-check; C157 (3), C157 (7) = C159 (4), (5)):
// - the title is on the window title step inside the drawer: 20/24 on a
//   desktop, 16 on a phone. sf-drawer 1.16.0 moves the heading roles down
//   inside its body, where the panel's head stands; the title reads the step
//   the drawer's panel publishes (--sf-drawer--title-*, sf-drawer 1.16.4);
// - a rich-text h1 in a field draws no larger than the title (r-077), where
//   the drawer shifts the content headings;
// - on a phone Save and Cancel share the foot's row in equal halves, 8 apart,
//   Save first; on a desktop they keep their width at the start, 8 apart.
// Measured on the built bytes, a record open in a panel (mode edit, port 1.12.0).
import {resolve, join} from 'node:path';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
const styles = [
  'core/core/css/core.css', 'core/core/css/utility.full.css',
  'component/component/badges/css/badges.css', 'component/component/avatars/css/avatars.css',
  'component/component/reference-link/css/reference-link.css',
  'component/component/inputs/css/inputs.css', 'component/component/tree/css/tree.css',
  'component/component/buttons/css/buttons.css',
  'component/component/dropdown/css/dropdown.css',
  'smart/smart/drawer/css/drawer.css',
  'component/component/datepicker/css/datepicker.css',
  'component/component/tags/css/tags.css',
  'component/component/textarea/css/textarea.css',
  'smart/smart/popover/css/popover.css',
  'component/component/context-menu/css/context-menu.css',
  'smart/smart/view-properties/css/view-properties.css',
  'smart/smart/sortable/css/sortable.css',
].map((p) => join(out, p));
const modules = [
  'core/core/js/core.js', 'core/core/js/smart-base.js', 'smart/smart/icon/js/icon.js', 'smart/smart/badge/js/badge.js',
  'smart/smart/avatar/js/avatar.js', 'smart/smart/reference-link/js/reference-link.js',
  'smart/smart/input/js/input.js', 'smart/smart/tree/js/tree.js',
  'smart/smart/tree-item/js/tree-item.js', 'smart/smart/button-icon/js/button-icon.js',
  'smart/smart/button/js/button.js',
  'smart/smart/dropdown/js/dropdown.js', 'smart/smart/list-item/js/list-item.js',
  'smart/smart/checkbox/js/checkbox.js', 'smart/smart/spinner/js/spinner.js',
  'smart/smart/drawer/js/drawer.js',
  'smart/smart/tag/js/tag.js',
  'smart/smart/input-date/js/input-date.js', 'smart/smart/input-textarea/js/input-textarea.js',
  'smart/smart/switch/js/switch.js', 'smart/smart/segmented/js/segmented.js',
  'smart/smart/field-renderers/js/field-renderers.js',
  'smart/smart/sortable/js/sortable.js',
  'smart/smart/menu-context/js/menu-context.js',
  'smart/smart/popover/js/popover.js',
  'smart/smart/view-properties/js/view-properties.js',
].map((p) => join(out, p));
const absent = [...styles, ...modules].filter((path) => !existsSync(path));
if (absent.length) throw new Error(`${absent.length} build asset(s) not found under ${out}: ${absent.join(', ')}`);

const failures = [];
const note = (detail) => failures.push(detail);
const near = (a, b, tolerance = 0.5) => Math.abs(a - b) <= tolerance;
const browser = await chromium.launch();
const results = {};
try {
  for (const {name, width, height, mobile} of [
    {name: 'desktop', width: 1440, height: 900, mobile: false},
    {name: 'phone', width: 390, height: 844, mobile: true},
  ]) {
    const context = await browser.newContext({viewport: {width, height}, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1});
    const page = await context.newPage();
    page.on('pageerror', (error) => note({view: name, pageerror: error.message}));
    await page.setContent('<!doctype html><html class="theme-light" lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0"></body></html>');
    for (const style of styles) await page.addStyleTag({path: style}).catch(() => {});
    for (const module of modules) await page.addScriptTag({path: module, type: 'module'}).catch(() => {});
    await page.waitForFunction(() => Boolean(customElements.get('sf-view-properties')));
    const reading = await page.evaluate(async () => {
      const view = document.createElement('sf-view-properties');
      view.setAttribute('record-id', 'r1');
      view.setAttribute('collection', 'events');
      view.setAttribute('mode', 'edit');
      view.setAttribute('panel', '');
      view.setAttribute('title', 'Встреча с командой');
      document.body.append(view);
      const record = {
        record_id: 'r1', revision: '7', title: 'Встреча с командой', actions: ['record.edit'],
        sections: [{key: 'main', label: 'Основное', groups: [
          {key: 'when', label: 'Когда', columns: 1, fields: [
            {key: 'name', label: 'Название', propertyType: 'string', value: 'Встреча с командой'},
            {key: 'about', label: 'Описание', propertyType: 'html', value: '<h1>Заголовок текста</h1><p>Текст.</p>'},
          ]},
        ]}],
      };
      view.setHostPort({
        version: '1.12.0', capabilities: [],
        async raise(intent) {
          if (intent === 'record.load') return {answer: 'applied', record};
          return {answer: 'applied'};
        },
      });
      for (let tries = 0; tries < 80 && !view.sections?.length; tries += 1) await new Promise((done) => setTimeout(done, 50));
      await new Promise((done) => setTimeout(done, 800));
      const box = (node) => node ? node.getBoundingClientRect() : null;
      const title = document.querySelector('.sf-property-view-panel .sf-property-view-title');
      const panel = document.querySelector('.sf-drawer-panel');
      const h1 = document.querySelector('.sf-property-view-panel .sf-drawer-body [data-field="about"] h1');
      const bar = document.querySelector('.sf-property-view-panel .sf-property-view-actions');
      const button = (action) => bar?.querySelector(`:scope > sf-button[data-action="${action}"] > button`);
      const save = box(button('save'));
      const cancel = box(button('cancel'));
      const barStyle = bar ? getComputedStyle(bar) : null;
      return {
        title: title ? {size: parseFloat(getComputedStyle(title).fontSize), height: parseFloat(getComputedStyle(title).lineHeight), text: title.textContent.trim()} : null,
        drawerStep: panel ? getComputedStyle(panel).getPropertyValue('--sf-drawer--title-size').trim() : null,
        h1: h1 ? parseFloat(getComputedStyle(h1).fontSize) : null,
        bar: bar ? {left: box(bar).left + parseFloat(barStyle.paddingLeft), width: box(bar).width - parseFloat(barStyle.paddingLeft) - parseFloat(barStyle.paddingRight)} : null,
        save: save && {left: save.left, width: save.width, height: save.height, top: save.top},
        cancel: cancel && {left: cancel.left, width: cancel.width, height: cancel.height, top: cancel.top},
      };
    });
    results[name] = reading;
    const want = name === 'desktop' ? {size: 20, height: 24} : {size: 16};
    if (!reading.title) note({view: name, case: 'the panel has a title'});
    else {
      if (!near(reading.title.size, want.size)) note({view: name, case: `the title is on the window step (${want.size})`, got: reading.title});
      if (want.height && !near(reading.title.height, want.height)) note({view: name, case: `the title line is ${want.height}`, got: reading.title});
    }
    // Where the drawer shifts the content headings (sf-drawer >= 1.16.4
    // publishes the step), an h1 of the record stays below the title.
    if (reading.drawerStep && reading.h1 != null && reading.title && reading.h1 > reading.title.size) {
      note({view: name, case: 'a rich-text h1 draws no larger than the title (r-077)', got: reading});
    }
    if (!reading.save || !reading.cancel) note({view: name, case: 'the edit foot has Save and Cancel', got: reading});
    else if (name === 'phone') {
      const half = (reading.bar.width - 8) / 2;
      if (!(reading.save.left < reading.cancel.left)) note({view: name, case: 'Save first', got: reading});
      if (!near(reading.save.width, half, 1) || !near(reading.cancel.width, half, 1)) note({view: name, case: 'equal halves of the row, 8 apart', got: reading, half});
      if (!near(reading.cancel.left - (reading.save.left + reading.save.width), 8, 0.5)) note({view: name, case: 'gap 8', got: reading});
      if (!near(reading.save.top, reading.cancel.top, 0.5)) note({view: name, case: 'one row', got: reading});
    } else {
      if (!near(reading.save.left, reading.bar.left, 0.5)) note({view: name, case: 'the desktop foot holds the start', got: reading});
      if (!near(reading.cancel.left - (reading.save.left + reading.save.width), 8, 0.5)) note({view: name, case: 'desktop gap 8', got: reading});
      if (reading.save.width > reading.bar.width / 3) note({view: name, case: 'desktop buttons keep their own width', got: reading});
    }
    await context.close();
  }
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('PROPERTY_VIEW_TITLE_FOOT_OK');
