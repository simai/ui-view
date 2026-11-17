// The window gate of view round 1 (D1, D2, D4; draft set standard 7.5, 7.9).
// A window of the set opens through the SIMAI Framework: SF.menu.open (menuOpen),
// sf-menu-context `for`, sf-popover or sf-settings. What the set still places
// itself is named here with the order or decision it waits for, so a new
// self-placed window, a menu with tabs or a raw control in sf-view's shadow
// root turns this red. sf-view-properties is the card's own round (card
// helper) and is not read here.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const stripComments = (text) => text
  .replace(/\/\*[\s\S]*?\*\//gu, (block) => '\n'.repeat(block.split('\n').length - 1))
  .replace(/(^|[^:"'`\\])\/\/[^\n]*/gu, '$1');
const FILES = [
  'src/smart/view/index.js',
  'src/smart/view-table/index.js',
  'src/smart/view-table/js/templates/default.js',
  'src/smart/view-table/js/templates/default.css',
  'src/smart/view-flow/index.js',
  'src/smart/view-flow/js/templates/default.js',
  'src/smart/view-flow/js/templates/default.css',
];

// Where a `position: fixed` stands: the method around it in a script, the
// selector before it in a sheet.
function fixedPlaces(path) {
  // Line by line: a comment line is not a rule (a string holding «/*» would
  // fool a block-comment strip over a whole script).
  const lines = read(path).split('\n').map((line) => (/^\s*(?:\/\/|\/\*|\*)/u.test(line) ? '' : line));
  const places = [];
  lines.forEach((line, index) => {
    if (!/position:\s*fixed/u.test(line)) return;
    let owner = '';
    for (let at = index; at >= 0 && !owner; at -= 1) {
      const method = path.endsWith('.css') ? null : lines[at].match(/^ {4}(?:async )?([A-Za-z_]\w*)\([^)]*\) \{$/u);
      const selector = path.endsWith('.css') ? lines[at].match(/^\s*([^{}]+?)\s*\{\s*$/u) : null;
      if (method) owner = method[1];
      else if (selector) owner = selector[1].trim();
      else if (path.endsWith('index.js') && /slot\[name="notice"\]::slotted\(\*\) \{/u.test(lines[at])) owner = 'notice';
    }
    places.push(`${path.replace('src/smart/', '')} ${owner}`);
  });
  return places;
}

// Each one waits for something named; none is new.
const WAITING = new Map([
  // The save-template form and the saved views: sf-settings has no form part
  // and no list of saved views yet (order proposed by view-r1-table).
  ['view-table/index.js renderFilterFavoritesContextMenu', 'sf-settings parts (new order)'],
  // The filter window stays on its menu (D2, fix/view-c106-settings): the
  // gear's window is sf-settings, the filter needs the same parts.
  ['view-table/index.js renderFilterSettingsContextMenu', 'sf-settings parts (new order)'],
  // A chip's own filter window becomes the Framework's filter window (FO-5).
  ['view-table/index.js renderTagsSettingsContextMenu', 'FO-5'],
  // The table's portal in the top layer and the list's bottom sheet carry
  // the three windows above.
  ['view-table/js/templates/default.css .sf-table-portal:popover-open', 'FO-5, sf-settings parts'],
  ['view-table/js/templates/default.css .sf-table-context-layer[data-sf-sheet] .sf-table-context-menu', 'FO-5, sf-settings parts'],
  ['view-table/js/templates/default.css .sf-table-context-layer[data-sf-sheet] .sf-table-sheet-close', 'FO-5, sf-settings parts'],
  // A notice in the window's corner: sf-toast has no placement of its own
  // for a slotted toast (note to the Framework, view-r1-table).
  ['view/index.js notice', 'sf-toast placement (note)'],
]);

test('no window of the set places itself beyond the named waits', () => {
  const places = FILES.flatMap(fixedPlaces);
  const unknown = places.filter((place) => !WAITING.has(place));
  assert.deepEqual(unknown, [], 'a new self-placed window');
  assert.equal(places.length, WAITING.size, 'a wait that no longer stands is taken off the list');
});

test('the action menus open the Framework\'s shared menu, not a window of the table', () => {
  const table = read('src/smart/view-table/index.js');
  assert.match(table, /import \{menuOpen\} from "\.\.\/\.\.\/core\/js\/menu-open\.js";/u);
  for (const gone of ['renderCreateContextMenu', 'renderListSortContextMenu', 'renderToolbarActionsContextMenu', 'renderContextSubmenu']) {
    assert.doesNotMatch(table, new RegExp(gone, 'u'), gone);
  }
  // The layer stack holds the remaining windows; the set has no outside-press
  // listener of its own on the page.
  for (const path of FILES.filter((file) => file.endsWith('.js'))) {
    assert.doesNotMatch(read(path), /(?:document|window)\.addEventListener\(["'](?:pointerdown|mousedown)["']/u, path);
  }
});

// A menu with tabs: sf-menu-context given `tabs`, or an sf-tabs drawn inside
// one. The gear's window left them for sf-settings (D2, C106); the filter
// window keeps its two (templates, fields) until sf-settings has the parts.
const TABS_WAITING = new Map([['view-table/index.js renderFilterSettingsContextMenu', 'sf-settings parts (new order)']]);
function tabbedMenus(path) {
  const source = read(path);
  const found = [];
  for (const match of source.matchAll(/<sf-menu-context\b[^>]*?\btabs=/gu)) {
    const before = source.slice(0, match.index).split('\n');
    const owner = before.reverse().map((line) => line.match(/^ {4}(?:async )?([A-Za-z_]\w*)\([^)]*\) \{$/u)?.[1]).find(Boolean);
    found.push(`${path.replace('src/smart/', '')} ${owner}`);
  }
  if (/<sf-menu-context[\s\S]{0,4000}?<sf-tabs/u.test(source)) found.push(`${path.replace('src/smart/', '')} sf-tabs inside a menu`);
  return found;
}

test('no menu holds tabs beyond the named wait (D2, C106)', () => {
  const found = FILES.filter((file) => file.endsWith('.js')).flatMap(tabbedMenus);
  assert.deepEqual(found.filter((one) => !TABS_WAITING.has(one)), [], 'a new menu with tabs');
  assert.equal(found.length, TABS_WAITING.size, 'a wait that no longer stands is taken off the list');
});

test('sf-view draws no control of its own in its shadow root (D4)', () => {
  const view = read('src/smart/view/index.js');
  const shadow = view.slice(view.indexOf('this.shadowRoot.innerHTML'), view.indexOf('`;', view.indexOf('this.shadowRoot.innerHTML')));
  assert.ok(shadow.length > 200, 'the shadow template is found');
  assert.doesNotMatch(shadow, /<(?:input|select|button|textarea)\b/u);
  assert.match(shadow, /<div part="toolbar" hidden><slot name="toolbar"><\/slot><\/div>/u);
  // The default table and page row are light DOM, where the page's sheets reach.
  assert.match(view, /\["content", "sf-view-table", \{\}\]/u);
});

test('the move dialog chooses through sf-input-choice, with no radio group of its own (D5)', () => {
  const view = stripComments(read('src/smart/view/index.js'));
  assert.doesNotMatch(view, /role="radiogroup"|role", "radiogroup"/u);
  assert.match(view, /sf-input-choice/u);
});
