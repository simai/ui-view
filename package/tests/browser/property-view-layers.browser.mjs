#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
// sf-view-properties 1.13.0: the panels stand on SIMAI Framework's one layer
// stack (core layer-stack.js, standard 1.3.8 §19) through their sf-drawer,
// with sf-modal, the other drawers and the menus. What is measured is what the
// stack has to give a stack of record windows, on a page served over HTTP and
// loaded three times (a probe that passes once can still fail on a later load):
//
//   - nested panels: the one opened later is above, the one below is under its
//     overlay, with no dim of its own;
//   - Escape closes the top window only;
//   - the unsaved check: a close the host refuses keeps the panel open and what
//     was typed in it;
//   - focus goes back where it was when the top window closes;
//   - an sf-modal opened from a panel takes Escape first, and a panel opened
//     over an sf-modal is drawn above it and takes Escape first;
//   - a press on the dimmed page asks the host (reason outside) and closes
//     nothing by itself;
//   - the console stays clean.
import {createServer} from 'node:http';
import {existsSync, readFileSync, statSync} from 'node:fs';
import {extname, join, normalize, resolve} from 'node:path';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
const styles = [
  'core/core/css/core.css', 'core/core/css/utility.full.css',
  'component/component/badges/css/badges.css', 'component/component/inputs/css/inputs.css',
  'component/component/buttons/css/buttons.css', 'component/component/icon-buttons/css/icon-buttons.css',
  'component/component/dropdown/css/dropdown.css', 'component/component/modal/css/modal.css',
  'smart/smart/drawer/css/drawer.css', 'smart/smart/popover/css/popover.css',
  'smart/smart/button-copy/css/button-copy.css', 'smart/smart/sortable/css/sortable.css',
  'smart/smart/view-properties/css/view-properties.css',
];
const modules = [
  'core/core/js/core.js', 'core/core/js/smart-base.js', 'smart/smart/icon/js/icon.js',
  'smart/smart/badge/js/badge.js', 'smart/smart/input/js/input.js',
  'smart/smart/button-icon/js/button-icon.js', 'smart/smart/button/js/button.js',
  'smart/smart/dropdown/js/dropdown.js', 'smart/smart/list-item/js/list-item.js',
  'smart/smart/checkbox/js/checkbox.js', 'smart/smart/spinner/js/spinner.js',
  'smart/smart/drawer/js/drawer.js', 'smart/smart/modal/js/modal.js',
  'smart/smart/field-renderers/js/field-renderers.js', 'smart/smart/sortable/js/sortable.js',
  'smart/smart/menu-context/js/menu-context.js', 'smart/smart/popover/js/popover.js',
  'smart/smart/button-copy/js/button-copy.js',
  'smart/smart/view-properties/js/view-properties.js',
];
const absent = [...styles, ...modules].filter((path) => !existsSync(join(out, path)));
if (absent.length) throw new Error(`${absent.length} build asset(s) not found under ${out}: ${absent.join(', ')}`);

// UTF-8 named on every response: a charset-less page garbles Russian under load.
const TYPES = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.woff2': 'font/woff2', '.svg': 'image/svg+xml'};
const page = (theme) => `<!doctype html><html class="theme-${theme}" lang="ru"><head><meta charset="utf-8">
${styles.map((path) => `<link rel="stylesheet" href="/${path}">`).join('\n')}
</head><body style="margin:0">
<main><button id="opener" type="button">Открыть</button></main>
${modules.map((path) => `<script type="module" src="/${path}"></script>`).join('\n')}
</body></html>`;
const server = createServer((request, response) => {
  const url = new URL(request.url, 'http://probe');
  if (url.pathname === '/' || url.pathname === '/index.html') {
    response.writeHead(200, {'content-type': TYPES['.html']});
    response.end(page(url.searchParams.get('theme') || 'light'));
    return;
  }
  // The Loader takes the folder above core/js as its base and asks for
  // <base>/<product>/..., the distr layout; the output root holds each
  // product one level deeper (<product>/<product>/...).
  let wanted = decodeURIComponent(url.pathname);
  const asked = /^\/core\/(smart|component|utility|rule)\/(.*)$/u.exec(wanted);
  if (asked) wanted = `/${asked[1]}/${asked[1]}/${asked[2]}`;
  const path = normalize(join(out, wanted));
  if (!path.startsWith(out) || !existsSync(path) || !statSync(path).isFile()) {
    response.writeHead(404);
    response.end();
    return;
  }
  response.writeHead(200, {'content-type': TYPES[extname(path)] || 'application/octet-stream',
    'access-control-allow-origin': '*'});
  response.end(readFileSync(path));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}/`;

const failures = [];
const note = (detail) => failures.push(detail);
const browser = await chromium.launch();
const runs = [];

// Everything the page measures, in one evaluate: the windows, the host's answer
// to close, the modal, the focus. The host closes a window by `hidden` when it
// has nothing unsaved and refuses otherwise, as Larena's host does.
const scenario = async () => {
  const wait = (ms) => new Promise((done) => setTimeout(done, ms));
  const escape = () => document.activeElement.dispatchEvent(
    new KeyboardEvent('keydown', {key: 'Escape', bubbles: true, composed: true, cancelable: true}));
  const host = (id) => ({
    version: '1.4.0', capabilities: [],
    async raise(intent) {
      if (intent === 'record.load') {
        return {answer: 'applied', record: {record_id: id, revision: '1', address: `/admin/cms/${id}`, sections: [
          {key: 'only', groups: [{key: 'g', label: 'Группа', fields: [
            {key: 'name', label: 'Имя', propertyType: 'string', value: `Запись ${id}`},
          ]}]},
        ]}};
      }
      return {answer: 'unavailable', reason: 'unknown-intent'};
    },
  });
  const closes = [];
  // `later`: the panel is placed hidden and shown once read, the way a host
  // keeps one element and opens it by removing hidden (simai/ui-pro#4).
  const open = async (id, {later = false} = {}) => {
    const view = document.createElement('sf-view-properties');
    view.setAttribute('record-id', id);
    view.setAttribute('panel', '');
    if (later) view.hidden = true;
    view.addEventListener('sf-view-properties-close', (event) => {
      closes.push([id, event.detail.reason, event.detail.unsaved_fields]);
      if (event.detail.unsaved_fields > 0) event.preventDefault();
      else view.hidden = true;
    });
    document.body.append(view);
    view.setHostPort(host(id));
    await wait(500);
    if (later) {
      view.hidden = false;
      await wait(400);
    }
    return view;
  };
  const panelOf = (id) => document.querySelector(`.sf-property-view-panel[data-record-id="${id}"]`);
  const rootOf = (id) => panelOf(id)?.closest('[data-sf-drawer-root]') ?? null;
  const drawerOpen = (view) => Boolean(view?.querySelector(':scope > sf-drawer')?.hasAttribute('open'));
  const zOf = (node) => Number(node ? getComputedStyle(node).zIndex : NaN);
  const drawerRootOf = (view) => view?.querySelector(':scope > sf-drawer')?.getDrawerRoot?.() ?? null;
  const result = {};

  // 1. Two nested panels; the lower one half-edited, the focus on its close.
  document.getElementById('opener').focus();
  const lower = await open('lower');
  lower.editGroup('only', 'g');
  await wait(300);
  lower.changeField({key: 'name'}, 'Набрано и не сохранено');
  await wait(200);
  const lowerClose = rootOf('lower')?.querySelector('[data-action="close"]');
  lowerClose?.focus();
  const upper = await open('upper', {later: true});
  const box = panelOf('lower')?.getBoundingClientRect();
  const hit = box ? document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2) : null;
  const overlay = rootOf('upper')?.querySelector('[data-sf-drawer-overlay]');
  result.nested = {
    depths: [lower.stackDepth, upper.stackDepth],
    top: [lower.isTopPanel, upper.isTopPanel],
    z: [zOf(rootOf('lower')), zOf(rootOf('upper'))],
    lowerOpacity: getComputedStyle(panelOf('lower')).opacity,
    lowerCovered: Boolean(hit && rootOf('upper')?.contains(hit)),
    overlay: overlay ? {hidden: overlay.hidden, opacity: getComputedStyle(overlay).opacity,
      background: getComputedStyle(overlay).backgroundColor} : null,
    focusInUpper: Boolean(rootOf('upper')?.contains(document.activeElement)),
  };

  // 2. Escape closes the top window only, and the focus goes back to the lower's close.
  escape();
  await wait(500);
  result.escapeTop = {
    closes: closes.slice(),
    upperOpen: drawerOpen(upper),
    lowerOpen: drawerOpen(lower),
    focusBack: document.activeElement === lowerClose,
    lowerTop: lower.isTopPanel,
  };

  // 3. Escape on the lower: it has unsaved work, the host refuses, nothing closes.
  closes.length = 0;
  escape();
  await wait(400);
  result.refused = {
    closes: closes.slice(),
    lowerOpen: drawerOpen(lower),
    kept: lower.changed.get('name') ?? null,
  };

  // 4. An sf-modal opened from the lower panel takes Escape; the panel is not asked.
  closes.length = 0;
  const modal = document.createElement('sf-modal');
  modal.setAttribute('heading', 'Подтверждение');
  modal.innerHTML = '<div slot="content"><button type="button" id="in-modal">Да</button></div>';
  document.body.append(modal);
  await wait(200);
  modal.open();
  await wait(500);
  const modalRoot = modal.modalRoot ?? document.querySelector('.sf-modal');
  result.modalOverPanel = {
    modalAbove: zOf(modalRoot) > zOf(rootOf('lower')),
    lowerTop: lower.isTopPanel,
  };
  escape();
  await wait(500);
  result.modalOverPanel.closes = closes.slice();
  result.modalOverPanel.modalOpen = Boolean(modal.isOpen ?? modal.hasAttribute('open'));
  result.modalOverPanel.lowerOpen = drawerOpen(lower);
  result.modalOverPanel.lowerTopAgain = lower.isTopPanel;

  // 5. A press on the dimmed page asks the host (outside); with unsaved work it is refused.
  closes.length = 0;
  const lowerOverlay = rootOf('lower')?.querySelector('[data-sf-drawer-overlay]');
  lowerOverlay?.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, composed: true}));
  lowerOverlay?.click();
  await wait(400);
  result.outside = {closes: closes.slice(), lowerOpen: drawerOpen(lower)};
  lower.remove();
  await wait(300);

  // 6. A panel over an sf-modal: drawn above it, takes Escape first; then the modal.
  closes.length = 0;
  document.getElementById('opener').focus();
  modal.open();
  await wait(500);
  const inModal = document.getElementById('in-modal');
  inModal?.focus();
  const over = await open('over-modal', {later: true});
  result.panelOverModal = {
    panelAbove: zOf(drawerRootOf(over)) > zOf(modal.modalRoot ?? document.querySelector('.sf-modal')),
    panelTop: over.isTopPanel,
  };
  escape();
  await wait(500);
  result.panelOverModal.closes = closes.slice();
  result.panelOverModal.panelOpen = drawerOpen(over);
  result.panelOverModal.modalOpen = Boolean(modal.isOpen ?? modal.hasAttribute('open'));
  result.panelOverModal.focusInModal = document.activeElement === inModal;
  escape();
  await wait(500);
  result.panelOverModal.modalClosed = !(modal.isOpen ?? modal.hasAttribute('open'));
  over.remove();
  modal.remove();
  await wait(200);
  // 7. A panel placed already open (never hidden). sf-drawer connected with
  // `open` records no element to return to (core.runtime 1.42.0 and the pinned
  // pair: connectedCallback registers the layer with _lastActive null), so the
  // focus falls into the layer below instead of going back. A SIMAI Framework
  // defect, reported to the dispatcher; measured and printed, not failed here.
  const opener = document.getElementById('opener');
  opener.focus();
  const born = await open('born-open');
  escape();
  await wait(500);
  result.bornOpen = {focusBack: document.activeElement === opener,
    active: document.activeElement?.tagName?.toLowerCase() ?? null};
  born.remove();
  await wait(200);
  result.layersLeft = (globalThis[Symbol.for('sf.layerStack')]?.layers ?? []).length;
  return result;
};

try {
  for (const theme of ['light', 'dark']) {
    const tab = await browser.newPage({viewport: {width: 1280, height: 860}});
    const consoleErrors = [];
    tab.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    tab.on('pageerror', (error) => consoleErrors.push(String(error)));
    await tab.goto(`${base}?theme=${theme}`);
    for (let load = 1; load <= 3; load += 1) {
      if (load > 1) await tab.reload();
      await tab.waitForFunction(() => customElements.get('sf-view-properties') && customElements.get('sf-drawer')
        && customElements.get('sf-modal'), null, {timeout: 15000});
      await tab.waitForTimeout(400);
      const measured = await tab.evaluate(scenario);
      runs.push({theme, load, measured, consoleErrors: consoleErrors.splice(0)});
    }
    await tab.close();
  }
} finally {
  await browser.close();
  server.close();
}

for (const {theme, load, measured: m, consoleErrors} of runs) {
  const at = `${theme} load ${load}`;
  const n = m.nested ?? {};
  if (n.depths?.join(',') !== '0,1' || n.top?.join(',') !== 'false,true') {
    note({at, case: 'the panel opened later is above, read from the layer stack', got: {depths: n.depths, top: n.top}});
  }
  if (!(n.z?.[1] > n.z?.[0])) note({at, case: 'the upper panel is drawn higher, at the stack\'s z-index', got: n.z});
  if (Number(n.lowerOpacity) !== 1 || !n.lowerCovered || n.overlay?.hidden !== false || !(Number(n.overlay?.opacity) > 0)) {
    note({at, case: "the lower panel is dimmed by the upper drawer's overlay, with no dim of its own", got: n});
  }
  if (!n.focusInUpper) note({at, case: 'the upper panel takes the focus', got: n.focusInUpper});
  const e = m.escapeTop ?? {};
  if (e.closes?.length !== 1 || e.closes[0][0] !== 'upper' || e.closes[0][1] !== 'escape'
      || e.upperOpen || !e.lowerOpen || !e.lowerTop) {
    note({at, case: 'Escape closes the top panel only', got: e});
  }
  if (!e.focusBack) note({at, case: 'the focus goes back to the control of the lower panel it left', got: e.focusBack});
  const r = m.refused ?? {};
  if (r.closes?.length !== 1 || r.closes[0][1] !== 'escape' || !(r.closes[0][2] > 0) || !r.lowerOpen
      || r.kept !== 'Набрано и не сохранено') {
    note({at, case: 'a close the host refuses over unsaved work keeps the panel and what was typed', got: r});
  }
  const mp = m.modalOverPanel ?? {};
  if (!mp.modalAbove || mp.lowerTop !== false || mp.closes?.length !== 0 || mp.modalOpen || !mp.lowerOpen || !mp.lowerTopAgain) {
    note({at, case: 'an sf-modal opened from a panel is above it and takes Escape; the panel is not asked', got: mp});
  }
  const o = m.outside ?? {};
  if (o.closes?.length !== 1 || o.closes[0][1] !== 'outside' || !o.lowerOpen) {
    note({at, case: 'a press on the dimmed page asks the host (outside) and closes nothing by itself', got: o});
  }
  const pm = m.panelOverModal ?? {};
  if (!pm.panelAbove || !pm.panelTop || pm.closes?.length !== 1 || pm.closes[0][0] !== 'over-modal'
      || pm.panelOpen || !pm.modalOpen || !pm.modalClosed) {
    note({at, case: 'a panel opened over an sf-modal is above it and takes Escape first; the next Escape closes the modal', got: pm});
  }
  if (!pm.focusInModal) note({at, case: 'closing the panel over the modal gives the focus back into the modal', got: pm.focusInModal});
  if (m.layersLeft !== 0) note({at, case: 'nothing is left on the layer stack', got: m.layersLeft});
  if (consoleErrors.length) note({at, case: 'the console is clean', got: consoleErrors.slice(0, 5)});
}

const frameworkPending = runs.filter(({measured}) => !measured.bornOpen?.focusBack)
  .map(({theme, load, measured}) => ({at: `${theme} load ${load}`, bornOpen: measured.bornOpen}));
console.log(JSON.stringify({runs: runs.length, failures, frameworkPending: {
  case: 'sf-drawer connected already open returns no focus on close (Framework request)',
  count: frameworkPending.length, sample: frameworkPending[0] ?? null}, sample: runs[0]?.measured}, null, 1));
if (failures.length) {
  console.error(`${failures.length} failure(s)`);
  process.exit(1);
}
