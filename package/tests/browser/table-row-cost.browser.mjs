#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// sf-view-table 1.17.1, the cost of a row (simai/ui-pro#1 and #2), on the
// built bytes:
//   - the column settings are read once a draw, not once a cell: counted
//     over one setRows() draw, 8 rows ask getColumnSettings() a handful of
//     times (they asked 268), a window of 60 rows of 1 000 as few;
//   - since 1.19.0 (owner decision C146 (5)) a row ends in one cell: «more»
//     in every row, the two quick actions in the row a person is on (under
//     the pointer, with the focus, the current one); an idle row of the
//     bench's five columns with its box and its end is 29 nodes (standard
//     1.3.8 gate 17: thirty);
//   - the pointer and the focus bring the quick actions in without drawing
//     the row anew, they leave with the pointer, and the focus stays where it
//     is;
//   - a clean console.
import {resolve, join} from 'node:path';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
const styles = ['core/core/css/core.css', 'core/core/css/utility.full.css', 'component/component/icons/css/icons.css',
  'component/component/pagination/css/pagination.css', 'component/component/inputs/css/inputs.css',
  'smart/smart/view-table/css/view-table.css', 'smart/smart/resizer/css/resizer.css'].map((p) => join(out, p));
const modules = ['core/core/js/core.js', 'core/core/js/smart-base.js', 'smart/smart/icon/js/icon.js',
  'smart/smart/button/js/button.js', 'smart/smart/button-icon/js/button-icon.js', 'smart/smart/checkbox/js/checkbox.js',
  'smart/smart/list-item/js/list-item.js', 'smart/smart/dropdown/js/dropdown.js', 'smart/smart/input/js/input.js',
  'smart/smart/spinner/js/spinner.js', 'smart/smart/pagination/js/pagination.js', 'smart/smart/menu-context/js/menu-context.js',
  'smart/smart/resizer/js/resizer.js', 'smart/smart/view-table/js/view-table.js'].map((p) => join(out, p));

const COLUMNS = [{key: 'title', label: 'Название', sortable: true, role: 'title'}, {key: 'status', label: 'Статус'}, {key: 'owner', label: 'Владелец'}, {key: 'amount', label: 'Сумма', type: 'number'}, {key: 'published', label: 'Опубликовано', type: 'boolean'}];
const rows = (n) => Array.from({length: n}, (_, i) => ({id: String(i + 1), title: `Запись ${i + 1}`, status: 'active', owner: 'Сотрудник', amount: i, published: i % 2 === 0, revision: 'r1', actions: ['view', 'edit', 'delete']}));

const failures = [];
const browser = await chromium.launch();
try {
  for (const scheme of ['light', 'dark']) {
    const context = await browser.newContext({viewport: {width: 1280, height: 900}, colorScheme: scheme});
    const tab = await context.newPage();
    const errors = [];
    tab.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    tab.on('pageerror', (error) => { if (!/publicPath/u.test(error.message)) errors.push(error.message); });
    await tab.setContent(`<!doctype html><html class="theme-${scheme}" lang="ru"><head><meta charset="utf-8"></head><body style="margin:0"><div style="width:1200px"><sf-view-table id="t" aria-label="Т"></sf-view-table></div></body></html>`);
    for (const path of styles) await tab.addStyleTag({path}).catch(() => {});
    for (const path of modules) await tab.addScriptTag({path, type: 'module'}).catch(() => {});
    await tab.waitForFunction(() => customElements.get('sf-view-table'), null, {timeout: 15000});
    const read = await tab.evaluate(async ({COLUMNS, R8, R1000}) => {
      const settle = () => new Promise((done) => setTimeout(done, 600));
      const t = document.getElementById('t');
      t.setColumns(COLUMNS);
      await settle();
      const Ctor = customElements.get('sf-view-table');
      const get = Ctor.prototype.getColumnSettings;
      let calls = 0;
      Ctor.prototype.getColumnSettings = function (...args) { calls += 1; return get.apply(this, args); };
      const count = (root) => { const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL); let n = 1; while (walker.nextNode()) n += 1; return n; };
      calls = 0; t.setRows(R8); await settle();
      const draw8 = calls;
      const row = t.querySelector('tbody tr[data-row-id="2"]');
      const nodes = count(row);
      const endCell = row.querySelector('td[data-key="settings"]');
      const idleCell = {buttons: endCell?.querySelectorAll('button').length ?? 0,
        shown: [...(endCell?.querySelectorAll('[data-quick-action]') ?? [])].map((button) => getComputedStyle(button).opacity)};
      calls = 0; t.setRows(R1000); await settle();
      const window1000 = calls;
      const drawn = t.querySelectorAll('tbody tr[data-row-id]').length;
      Ctor.prototype.getColumnSettings = get;
      t.setRows(R8); await settle();
      const three = () => t.querySelector('tbody tr[data-row-id="3"]');
      window.__three = three();
      // Focus into row 6: its quick actions show, the focus stays on the link.
      const link = t.querySelector('tbody tr[data-row-id="6"] .sf-table-title-link');
      link?.focus();
      await settle();
      const focus = {kept: document.activeElement === link && link.isConnected,
        shown: [...t.querySelectorAll('tbody tr[data-row-id="6"] [data-quick-action]')].map((button) => getComputedStyle(button).opacity)};
      link?.blur();
      return {draw8, window1000, drawn, nodes, idleCell, focus};
    }, {COLUMNS, R8: rows(8), R1000: rows(1000)});
    // The pointer: a real one, the sheet's :hover.
    await tab.hover('tbody tr[data-row-id="3"] td[data-key="owner"]');
    await tab.waitForTimeout(300);
    const hover = await tab.evaluate(() => {
      const three = document.querySelector('#t tbody tr[data-row-id="3"]');
      return {same: three === window.__three, shown: [...three.querySelectorAll('[data-quick-action]')].map((button) => getComputedStyle(button).opacity)};
    });
    await tab.hover('tbody tr[data-row-id="5"] td[data-key="owner"]');
    await tab.waitForTimeout(300);
    const left = await tab.evaluate(() => [...document.querySelectorAll('#t tbody tr[data-row-id="3"] [data-quick-action]')].map((button) => getComputedStyle(button).opacity));
    read.hover = hover;
    read.left = left;
    const where = scheme;
    if (read.draw8 > 12) failures.push(`${where}: a draw of 8 rows read the column settings ${read.draw8} times`);
    if (read.window1000 > 12) failures.push(`${where}: a window of ${read.drawn} rows read the column settings ${read.window1000} times`);
    if (read.nodes > 30 || read.idleCell.buttons !== 1 || read.idleCell.shown.length) {
      failures.push(`${where}: an idle row is ${read.nodes} nodes, its end ${JSON.stringify(read.idleCell)} («more» alone)`);
    }
    if (!read.hover.same || read.hover.shown.length !== 2 || read.hover.shown.some((opacity) => opacity !== '1')) {
      failures.push(`${where}: the row under the pointer: ${JSON.stringify(read.hover)}`);
    }
    if (read.left.some((opacity) => opacity !== '0')) failures.push(`${where}: the row left keeps its quick actions shown (${read.left})`);
    if (!read.focus.kept || read.focus.shown.length !== 2 || read.focus.shown.some((opacity) => opacity !== '1')) failures.push(`${where}: focus into a row: ${JSON.stringify(read.focus)}`);
    if (errors.length) failures.push(`${where}: console ${errors.slice(0, 3).join(' | ')}`);
    await context.close();
  }
} catch (error) {
  failures.push(error.message);
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('table row cost: the column settings read once a draw, a row within thirty nodes, the quick actions shown by the pointer and the focus without a redraw');
