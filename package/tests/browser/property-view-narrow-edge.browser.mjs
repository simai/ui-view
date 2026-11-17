#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// The record panel's controls at narrow widths. Since sf-view-properties
// 1.17.0 (C289 (2), (6), R254) nothing stands outside the panel: copy-link and
// open-full are rows of the head's «⋯» menu, and the panel is drawn at a step
// of the drawer ladder (a former panel-width="44rem" lands on step 2, 30rem).
// The docs review (round 4, 2026-10-20) found the old edge strip half off the
// screen in a ~1000px frame and over the record's name on a phone. What has to
// hold at every width: no control on the drawer's edge; each control of the
// head is on the screen, inside the panel, the topmost element at its own
// centre, and not over the record's name; the panel is no wider than its step.
import {resolve, join} from 'node:path';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
const styles = [
  'core/core/css/core.css', 'core/core/css/utility.full.css',
  'component/component/buttons/css/buttons.css',
  'component/component/icon-buttons/css/icon-buttons.css',
  'component/component/icons/css/icons.css',
  'component/component/inputs/css/inputs.css',
  'component/component/tree/css/tree.css',
  'component/component/dropdown/css/dropdown.css',
  'smart/smart/drawer/css/drawer.css',
  'smart/smart/popover/css/popover.css',
  'smart/smart/view-properties/css/view-properties.css',
  'smart/smart/sortable/css/sortable.css',
].map((p) => join(out, p));
const modules = [
  'core/core/js/core.js', 'core/core/js/smart-base.js', 'smart/smart/icon/js/icon.js',
  'smart/smart/button/js/button.js', 'smart/smart/button-icon/js/button-icon.js',
  'smart/smart/button-close/js/button-close.js',
  'smart/smart/button-copy/js/button-copy.js',
  'smart/smart/input/js/input.js', 'smart/smart/switch/js/switch.js',
  'smart/smart/dropdown/js/dropdown.js', 'smart/smart/list-item/js/list-item.js',
  'smart/smart/segmented/js/segmented.js',
  'smart/smart/menu-context/js/menu-context.js',
  'smart/smart/tree/js/tree.js', 'smart/smart/tree-item/js/tree-item.js',
  'smart/smart/spinner/js/spinner.js', 'smart/smart/drawer/js/drawer.js',
  'smart/smart/field-renderers/js/field-renderers.js',
  'smart/smart/sortable/js/sortable.js',
  'smart/smart/popover/js/popover.js',
  'smart/smart/view-properties/js/view-properties.js',
].map((p) => join(out, p));

const absent = [...styles, ...modules].filter((path) => !existsSync(path));
if (absent.length) {
  console.error(JSON.stringify({missingAssets: absent, root: out}, null, 2));
  throw new Error(`${absent.length} build asset(s) not found under ${out}`);
}

// Two sections, so the rail is drawn and the panel is grown by it -- the width
// that met the window's edge first -- and an address with record-open, so the
// strip carries all three controls.
const record = {
  record_id: 'record-1', collection: 'pages', revision: '3', address: '/records/record-1',
  sections: [
    {key: 'one', label: 'Первый', groups: [{key: 'g1', label: 'Группа 1', columns: 2, fields: [
      {key: 'a', label: 'А', propertyType: 'string', value: 'a'},
      {key: 'b', label: 'Б', propertyType: 'string', value: 'b'},
    ]}]},
    {key: 'two', label: 'Второй', groups: [{key: 'g2', label: 'Группа 2', fields: [
      {key: 'c', label: 'В', propertyType: 'string', value: 'c'},
    ]}]},
  ],
};

const failures = [];
const note = (detail) => failures.push(detail);
const browser = await chromium.launch();
const measuredAt = {};

try {
  // 980: the docs frame where the strip stood at x = -20. 1024 and 1440 for
  // the panel beside the strip; 390 for the panel that fills the screen.
  for (const [width, height] of [[1440, 900], [1024, 768], [980, 768], [800, 700], [390, 844]]) {
    const page = await browser.newPage({viewport: {width, height}});
    await page.setContent(
      '<!doctype html><html class="theme-light" lang="ru"><body style="margin:0">'
      + '<sf-view-properties id="pv" panel panel-width="44rem" record-id="record-1" collection="pages"'
      + ' panel-label="Очень длинное название записи, которое не должно уйти под кнопки"></sf-view-properties>'
      + '</body></html>',
    );
    for (const path of styles) await page.addStyleTag({path}).catch(() => {});
    for (const path of modules) await page.addScriptTag({path, type: 'module'}).catch(() => {});
    await page.waitForTimeout(1200);

    const unupgraded = await page.evaluate(() => ['sf-view-properties', 'sf-drawer', 'sf-button-icon',
      'sf-button-copy'].filter((tag) => !customElements.get(tag)));
    if (unupgraded.length) {
      throw new Error(`${unupgraded.join(', ')} not defined on the page: an unupgraded element has no `
        + 'behaviour, so every measurement of it is false in the same direction.');
    }

    const seen = await page.evaluate(async (payload) => {
      const settle = (ms) => new Promise((done) => setTimeout(done, ms));
      const view = document.getElementById('pv');
      view.setHostPort({
        version: '1.8.0',
        capabilities: ['record-open'],
        async raise(intent) {
          if (intent === 'record.load') return {answer: 'applied', record: payload};
          return {answer: 'applied'};
        },
      });
      for (let tries = 0; tries < 60 && !view.sections?.length; tries += 1) await settle(50);
      await settle(600);
      const deepHit = (x, y) => {
        let hit = document.elementFromPoint(x, y);
        while (hit?.shadowRoot) {
          const inner = hit.shadowRoot.elementFromPoint(x, y);
          if (!inner || inner === hit) break;
          hit = inner;
        }
        return hit;
      };
      const content = view.panelContent();
      const shell = content?.closest('[data-sf-drawer-root]') ?? document;
      const panel = shell.querySelector('.sf-drawer-panel')?.getBoundingClientRect();
      const title = content?.querySelector('.sf-property-view-title')?.getBoundingClientRect();
      const edge = shell.querySelectorAll('.sf-property-view-edge button, [slot="edge"] button').length;
      const controls = [...(content?.querySelectorAll('.sf-property-view-head button') ?? [])].filter((button) => button.getBoundingClientRect().width > 0).map((button) => {
        const box = button.getBoundingClientRect();
        const hit = deepHit(box.x + box.width / 2, box.y + box.height / 2);
        return {
          action: button.closest('[data-action]')?.dataset.action ?? button.dataset.action ?? null,
          left: Math.round(box.left), right: Math.round(box.right),
          top: Math.round(box.top), bottom: Math.round(box.bottom),
          onTop: button.contains(hit),
        };
      });
      return {
        wide: Boolean(view.wide),
        viewport: innerWidth,
        edge,
        panel: panel ? {left: Math.round(panel.left), right: Math.round(panel.right)} : null,
        title: title ? {left: Math.round(title.left), right: Math.round(title.right), top: Math.round(title.top), bottom: Math.round(title.bottom)} : null,
        controls,
      };
    }, record);
    measuredAt[width] = seen;
    await page.close();

    if (seen.edge) note({width, case: 'nothing stands on the drawer edge outside the panel', got: seen.edge, expected: 0});
    const actions = seen.controls.map((control) => control.action);
    if (!actions.includes('menu') || !actions.includes('close')) {
      note({width, case: 'the head holds the «⋯» menu and the close', got: actions});
    }
    if (seen.wide && seen.panel && seen.panel.right - seen.panel.left > 481) {
      note({width, case: 'the panel is drawn at its step (panel-width 44rem lands on 30rem)', got: seen.panel, expected: '<= 480 px'});
    }
    const off = seen.controls.filter((control) => control.left < 0 || control.right > seen.viewport
      || (seen.panel && (control.left < seen.panel.left || control.right > seen.panel.right)));
    if (off.length) {
      note({width, case: 'every control is on the screen and inside the panel', got: {panel: seen.panel, off}});
    }
    const under = seen.controls.filter((control) => !control.onTop);
    if (under.length) {
      note({width, case: 'every control is the topmost element at its centre', got: under});
    }
    if (seen.title) {
      const covering = seen.controls.filter((control) => control.right > seen.title.left
        && control.left < seen.title.right
        && control.bottom > seen.title.top && control.top < seen.title.bottom);
      if (covering.length) {
        note({width, case: "no control stands over the record's name", got: {title: seen.title, covering}});
      }
    } else {
      note({width, case: 'the panel draws its title', got: null});
    }
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(JSON.stringify({failures, measuredAt}, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ok: true, measuredAt}));
