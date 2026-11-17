#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// Round five, measured: both windows bounded to the viewport with their head and
// buttons in view and the list scrolling inside; a pin that applies on the spot,
// reaches the host and shows a pinned mark; a visibility tick that is not lost
// by closing the window; «Сбросить» back to the opening state. Since C106 the
// gear's window is SIMAI Framework sf-settings look="panel": its rows, pins,
// search and insets are the Framework's, read here by their parts.
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
  'smart/smart/switch/css/switch.css', 'smart/smart/settings/css/settings.css',
  'smart/smart/view-table/css/view-table.css', 'smart/smart/resizer/css/resizer.css',
].map((p) => join(out, p));
const modules = [
  'core/core/js/core.js', 'core/core/js/smart-base.js', 'smart/smart/icon/js/icon.js', 'smart/smart/button/js/button.js',
  'smart/smart/button-icon/js/button-icon.js', 'smart/smart/checkbox/js/checkbox.js',
  'smart/smart/list-item/js/list-item.js', 'smart/smart/dropdown/js/dropdown.js',
  'smart/smart/input/js/input.js', 'smart/smart/spinner/js/spinner.js',
  'smart/smart/button-close/js/button-close.js', 'smart/smart/menu-context/js/menu-context.js',
  'smart/smart/tabs/js/tabs.js', 'smart/smart/tag/js/tag.js',
  'smart/smart/switch/js/switch.js', 'smart/smart/settings/js/settings.js',
  'smart/smart/pagination/js/pagination.js', 'smart/smart/resizer/js/resizer.js', 'smart/smart/view-table/js/view-table.js',
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

// The open window: the filter's sf-menu-context panel, or the gear's
// sf-settings panel (C106).
const SURFACE = 'sf-menu-context .sf-table-context-menu, sf-settings[data-table-settings] .sf-settings-panel:not([hidden])';

const openWindow = async (page, label) => {
  // The gear closes the window it opened (owner, 2026-10-15): one left open
  // by the step before is closed first, so the click opens it again.
  if (await page.evaluate((surface) => Boolean(document.querySelector(surface)), SURFACE)) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }
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
  const surface = await page.evaluate((selector) => Boolean(document.querySelector(selector)), SURFACE);
  if (!surface) throw new Error(`the window ${label} did not open`);
};

try {
  // 1. Both windows fit the screen, with the head and the buttons in view, and
  //    nothing of the list is cut off: the column settings list scrolls, while
  //    the filter window's fields are laid out in columns and may simply fit.
  //    Measured at two heights, because a ceiling that only works on a tall
  //    screen is not a ceiling.
  for (const [label, headSelector] of [['Настройки', '.sf-settings-panel-search'], ['Фильтр', '.sf-tabs-top-container']]) {
    for (const height of [700, 460]) {
      const page = await open(height);
      await openWindow(page, label);
      if (label === 'Фильтр') {
        const switched = await page.evaluate(() => {
          const tabs = document.querySelector('sf-menu-context sf-tabs');
          const tab = [...(tabs?.querySelectorAll('.sf-tabs-top-container button') ?? [])]
            .find((node) => node.textContent.trim() === 'Поля');
          tab?.click();
          return Boolean(tab);
        });
        if (!switched) throw new Error('the filter window has no fields tab');
        await page.waitForTimeout(600);
      }
      const fit = await page.evaluate(([head, selector]) => {
        const surface = document.querySelector(selector);
        if (!surface) return null;
        const box = surface.getBoundingClientRect();
        const list = surface.querySelector('.sf-context-menu-columns, .sf-settings-panel-body');
        const bottom = surface.querySelector('.sf-context-menu-footer, .sf-settings-panel-footer');
        const top = surface.querySelector(head);
        const visible = (node) => {
          const rect = node?.getBoundingClientRect();
          return rect ? rect.top >= -1 && rect.bottom <= window.innerHeight + 1 : null;
        };
        const listBox = list?.getBoundingClientRect();
        return {
          windowBottom: Math.round(box.bottom), viewport: window.innerHeight,
          insideScreen: Math.round(box.bottom) <= window.innerHeight,
          headVisible: visible(top), buttonsVisible: visible(bottom),
          // Either everything fits, or what does not fit can be scrolled to.
          listReachable: list
            ? (list.scrollHeight <= list.clientHeight + 1) || getComputedStyle(list).overflowY === 'auto'
            : null,
          listInsideWindow: listBox ? Math.round(listBox.bottom) <= Math.round(box.bottom) + 1 : null,
          pageScrolls: document.documentElement.scrollHeight > window.innerHeight + 1,
        };
      }, [headSelector, SURFACE]);
      if (!fit || !fit.insideScreen || fit.headVisible !== true || fit.buttonsVisible !== true
          || fit.listReachable !== true || fit.listInsideWindow !== true || fit.pageScrolls) {
        note({case: `window ${label} at ${height}`, got: fit, expected: 'inside the screen, head and buttons in view, the list reachable within the window, and no page scroll'});
      }
      await page.close();
    }
  }

  const page = await open(900);
  await openWindow(page, 'Настройки');

  // The gear's window is the Framework's settings panel (C106): «Поля» and
  // «Вид» as tabs, a search, one «Сбросить», a dialog.
  const kind = await page.evaluate(() => {
    const settings = document.querySelector('sf-settings[data-table-settings]');
    const panel = settings?.querySelector('.sf-settings-panel');
    return {
      look: settings?.getAttribute('look') ?? null,
      role: panel?.getAttribute('role') ?? null,
      tabs: [...(panel?.querySelectorAll('.sf-settings-panel-tabs [role="tab"]') ?? [])].map((tab) => tab.textContent.trim()),
      search: Boolean(panel?.querySelector('[data-sf-search]')),
      footer: [...(panel?.querySelectorAll('.sf-settings-panel-footer sf-button') ?? [])].map((node) => node.getAttribute('text')),
      oldMenu: Boolean(document.querySelector('sf-menu-context [data-column-key]')),
    };
  });
  if (kind.look !== 'panel' || kind.role !== 'dialog' || kind.tabs.join() !== 'Поля,Вид' || !kind.search
      || kind.footer.join() !== 'Сбросить' || kind.oldMenu) {
    note({case: 'the gear opens sf-settings look=panel', got: kind, expected: 'a dialog with «Поля», «Вид», a search and one «Сбросить»'});
  }

  // 2. A pin applies on the spot, reaches the host and shows a pinned mark.
  const pins = await page.evaluate(async () => {
    const row = () => document.querySelector('sf-settings[data-table-settings] .sf-settings-row-main[data-sf-option="f3"]')?.closest('.sf-settings-row');
    const read = () => {
      const node = row();
      const button = node?.querySelector('.sf-settings-row-pin');
      return {
        pinned: node?.hasAttribute('data-pinned') ?? null,
        scheme: button?.getAttribute('scheme') ?? null,
        name: button?.getAttribute('aria-label') ?? null,
      };
    };
    const before = read();
    row()?.querySelector('.sf-settings-row-pin button')?.click();
    await new Promise((done) => setTimeout(done, 400));
    const table = document.getElementById('t');
    return {
      before, after: read(),
      saved: window.saved.length,
      committed: (table.getPinnedColumnKeys?.() ?? []).includes('f3'),
      // The draft is empty again: the press went into the settings themselves.
      draft: table.tempSettings ? Object.keys(table.tempSettings) : [],
    };
  });
  if (pins.after?.pinned !== true || pins.after?.scheme !== 'primary' || pins.after?.name !== 'Открепить: Поле 3'
      || pins.saved !== 1 || !pins.committed || pins.draft.length) {
    note({case: 'pin applies at once', got: pins, expected: 'pinned, the pin primary and named «Открепить», one change emitted, and committed to the settings'});
  }
  if (pins.before?.pinned !== false || pins.before?.name !== 'Закрепить: Поле 3') {
    note({case: 'pin look', got: pins.before, expected: 'a loose column offers «Закрепить»'});
  }

  // 3. The window has no «Применить» left, a tick applies on the spot, and
  //    «Сбросить» goes back to the state the window opened with -- the owner's
  //    rule of 2026-10-05: everything here applies as it is pressed.
  const atOnce = await page.evaluate(async () => {
    const table = document.getElementById('t');
    const panel = document.querySelector('sf-settings[data-table-settings] .sf-settings-panel');
    const buttons = [...panel.querySelectorAll('.sf-settings-panel-footer sf-button')]
      .map((node) => node.getAttribute('text'));
    const visible = () => (table.getColumns?.() ?? []).filter((col) => col.visible !== false).length;
    const before = {buttons, visible: visible(), saved: window.saved.length};

    panel.querySelector('.sf-settings-row-main[data-sf-option="f5"]')?.click();
    await new Promise((done) => setTimeout(done, 400));
    const afterTick = {visible: visible(), saved: window.saved.length,
      checked: panel.querySelector('.sf-settings-row-main[data-sf-option="f5"]')?.getAttribute('aria-checked') ?? null,
      draft: table.tempSettings ? Object.keys(table.tempSettings) : []};

    // A click away loses nothing now. A press, as a person makes it: the
    // window hears the layer stack's pointerdown, not a click alone.
    document.body.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, composed: true}));
    document.body.click();
    await new Promise((done) => setTimeout(done, 300));
    const afterAway = {visible: visible(),
      windowClosed: !document.querySelector('sf-settings[data-table-settings] .sf-settings-panel:not([hidden])')};
    return {before, afterTick, afterAway};
  });
  if (atOnce.before?.buttons?.includes('Применить')) {
    note({case: 'no Apply left', got: atOnce.before, expected: 'the window commits as it goes, so it has no Apply'});
  }
  if (atOnce.afterTick?.visible !== atOnce.before.visible - 1
      || atOnce.afterTick?.saved !== atOnce.before.saved + 1
      || atOnce.afterTick?.checked !== 'false'
      || atOnce.afterTick?.draft.length !== 0) {
    note({case: 'tick applies at once', got: atOnce, expected: 'the column hides, one change is announced, nothing is left pending'});
  }
  if (atOnce.afterAway?.visible !== atOnce.afterTick.visible || !atOnce.afterAway?.windowClosed) {
    note({case: 'a click away loses nothing', got: atOnce, expected: 'the window closes and the state stays'});
  }

  // «Сбросить» returns to the state the window opened with, in one announcement.
  await openWindow(page, 'Настройки');
  const reset = await page.evaluate(async () => {
    const table = document.getElementById('t');
    const panel = () => document.querySelector('sf-settings[data-table-settings] .sf-settings-panel');
    const visible = () => (table.getColumns?.() ?? []).filter((col) => col.visible !== false).length;
    const pinned = () => (table.getPinnedColumnKeys?.() ?? []).filter((key) => !['select', 'settings'].includes(key));
    const opened = {visible: visible(), pinned: pinned().length};
    panel().querySelector('.sf-settings-row-main[data-sf-option="f7"]')?.click();
    await new Promise((done) => setTimeout(done, 300));
    panel().querySelector('.sf-settings-row-main[data-sf-option="f9"]')?.closest('.sf-settings-row')
      ?.querySelector('.sf-settings-row-pin button')?.click();
    await new Promise((done) => setTimeout(done, 350));
    const changed = {visible: visible(), pinned: pinned().length};
    const savedBefore = window.saved.length;
    panel().querySelector('[data-sf-reset] button')?.click();
    await new Promise((done) => setTimeout(done, 400));
    const rows = panel() ? {
      f7: panel().querySelector('.sf-settings-row-main[data-sf-option="f7"]')?.getAttribute('aria-checked'),
      f9: panel().querySelector('.sf-settings-row-main[data-sf-option="f9"]')?.closest('.sf-settings-row')?.hasAttribute('data-pinned'),
    } : null;
    return {opened, changed, restored: {visible: visible(), pinned: pinned().length}, rows,
      announcements: window.saved.length - savedBefore};
  });
  if (reset.changed?.visible !== reset.opened.visible - 1 || reset.changed?.pinned !== reset.opened.pinned + 1) {
    note({case: 'reset setup', got: reset, expected: 'the tick and the pin took effect before Reset was pressed'});
  }
  if (reset.restored?.visible !== reset.opened.visible || reset.restored?.pinned !== reset.opened.pinned
      || reset.announcements !== 1 || reset.rows?.f7 !== 'true' || reset.rows?.f9 !== false) {
    note({case: 'reset returns to the opening state', got: reset, expected: 'both changes undone in the table and the panel, announced once'});
  }

  // 4. The search finds a column (no case, ё as е), and the panel draws at the
  //    gear's density: no size of the table's own hand inside it (C22).
  await openWindow(page, 'Настройки');
  const search = await page.evaluate(async () => {
    const panel = document.querySelector('sf-settings[data-table-settings] .sf-settings-panel');
    const field = panel?.querySelector('[data-sf-search]');
    if (!field) return null;
    field.value = 'поле 1';
    field.dispatchEvent(new Event('input', {bubbles: true}));
    await new Promise((done) => setTimeout(done, 300));
    const shown = [...panel.querySelectorAll('.sf-settings-row')].filter((row) => !row.hidden && row.getClientRects().length)
      .map((row) => row.querySelector('[data-sf-option]')?.dataset.sfOption);
    return {shown, density: panel.getAttribute('data-sf-density'),
      size: document.querySelector('sf-settings[data-table-settings]').getAttribute('size')};
  });
  const expectedShown = ['f1', ...Array.from({length: 10}, (_, at) => `f${at + 10}`)];
  if (!search || [...search.shown].sort().join() !== [...expectedShown].sort().join() || search.size !== null) {
    note({case: 'the panel search and its size', got: search, expected: {shown: expectedShown, size: null}});
  }
  // 5. The filter window names its object and says what is pending: the owner's
  //    separate item of 2026-10-05. With nothing pending the button reads as it
  //    always did; with a draft it carries the number of conditions a press
  //    would change, and the host can translate the label.
  const applyButton = async (page) => page.evaluate(() => {
    const bottom = document.querySelector('sf-menu-context .sf-context-menu-footer');
    const buttons = [...(bottom?.querySelectorAll('sf-button') ?? [])];
    const commit = buttons[buttons.length - 1];
    return {
      text: commit?.getAttribute('text') ?? null,
      ariaLabel: commit?.getAttribute('aria-label') ?? null,
      labels: buttons.map((node) => node.getAttribute('text')),
    };
  });

  const filterPage = await open(900);
  await openWindow(filterPage, 'Фильтр');
  const quiet = await applyButton(filterPage);
  // One word: the window is the filter's, so «фильтр» said it twice and
  // widened the window (owner, 2026-10-13).
  if (quiet.text !== 'Применить') {
    note({case: 'the apply button is one word', got: quiet, expected: 'Применить with nothing pending'});
  }

  // A draft: switch two fields on, through the window's own fields tab.
  const pending = await filterPage.evaluate(async () => {
    const table = document.getElementById('t');
    const tabs = document.querySelector('sf-menu-context sf-tabs');
    [...(tabs?.querySelectorAll('.sf-tabs-top-container button') ?? [])]
      .find((node) => node.textContent.trim() === 'Поля')?.click();
    await new Promise((done) => setTimeout(done, 500));
    // The fields tab renders its own checkboxes inside the window's tabs; the
    // settings window's rows carry data-column-key, this window's do not.
    const boxes = [...document.querySelectorAll('sf-menu-context .sf-context-menu-body input[type="checkbox"]')];
    const panel = document.querySelector('sf-menu-context .sf-context-menu-content');
    const before = Math.round(panel?.getBoundingClientRect().width ?? 0);
    boxes[0]?.click();
    await new Promise((done) => setTimeout(done, 250));
    boxes[1]?.click();
    await new Promise((done) => setTimeout(done, 350));
    // Against bytes that predate this item the method is absent; report that
    // rather than throwing, so the probe says which pair it is measuring.
    // The window keeps its width while «Применить» grows a count (owner,
    // 2026-10-15: it widened under the pointer).
    const widths = [before, Math.round(panel?.getBoundingClientRect().width ?? 0)];
    return {ticked: boxes.length, widths, counted: typeof table.countPendingFilterConditionChanges === 'function'
      ? table.countPendingFilterConditionChanges()
      : 'the component cannot count pending conditions'};
  });
  const marked = await applyButton(filterPage);
  if (!pending.widths?.[0] || pending.widths[0] !== pending.widths[1]) note({case: 'the filter keeps its width while fields are ticked', got: pending.widths});
  if (pending.counted !== 2 || marked.text !== 'Применить (2)'
      || marked.ariaLabel !== 'Применить: 2') {
    note({case: 'filter button shows what is pending', got: {pending, marked}, expected: 'two conditions counted, and said in the label and to a reader'});
  }
  // The label is the host's to translate.
  const translated = await filterPage.evaluate(async () => {
    const table = document.getElementById('t');
    table.setAttribute('filter-apply-text', 'Apply filter');
    await new Promise((done) => setTimeout(done, 400));
    const bottom = document.querySelector('sf-menu-context .sf-context-menu-footer');
    const buttons = [...(bottom?.querySelectorAll('sf-button') ?? [])];
    return buttons[buttons.length - 1]?.getAttribute('text') ?? null;
  });
  if (translated !== 'Apply filter (2)') {
    note({case: 'filter button label is translatable', got: translated, expected: 'Apply filter (2)'});
  }
  await filterPage.close();

  console.error(JSON.stringify({kind, pins, atOnce, reset, search, quiet, pending, marked, translated}, null, 1));
  await page.close();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
console.log('TABLE_ROUND_5_OK');
