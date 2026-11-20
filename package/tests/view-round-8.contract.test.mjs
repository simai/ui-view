import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// View round 8 (round/view-r8): the returns of the view rounds 6+7 acceptance
// (R67-1..3) and of the view site acceptance (VSA-1, VSA-5). Evidence:
// ui-control control/evidence/2026-11-21-view-r8/.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));

// Every word of the set, in every language file of every component.
const langFiles = () => readdirSync(join(root, 'src/smart'), {withFileTypes: true})
  .filter((entry) => entry.isDirectory())
  .flatMap((entry) => {
    const folder = join(root, 'src/smart', entry.name, 'lang');
    let names = [];
    try { names = readdirSync(folder).filter((name) => name.endsWith('.json')); } catch { return []; }
    return names.map((name) => ({path: `src/smart/${entry.name}/lang/${name}`, lang: name.replace(/\.json$/u, '')}));
  });
const words = (value, path = '') => {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((one, at) => words(one, `${path}[${at}]`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, one]) => words(one, `${path}.${key}`));
  return [];
};

test('R67-2: no interface word of the set calls a view a template (view-config/1 words)', () => {
  const files = langFiles();
  assert.ok(files.length >= 14, `every component's language files are read (${files.length})`);
  const found = [];
  for (const {path, lang} of files) {
    for (const [key, word] of words(json(path))) {
      if (/шаблон/iu.test(word)) found.push(`${path} ${key}: ${word}`);
      if (lang === 'en' && /\btemplates?\b/iu.test(word)) found.push(`${path} ${key}: ${word}`);
    }
  }
  assert.deepEqual(found, []);
});

test('R67-2: the head saves a view, keeps a locked one as mine, and resets', () => {
  const ru = json('src/smart/view/lang/ru.json').runtime;
  const en = json('src/smart/view/lang/en.json').runtime;
  assert.equal(ru['head-view-new'], 'Сохранить представление');
  assert.equal(ru['head-view-save-new'], 'Сохранить представление');
  assert.equal(ru['head-view-save-mine'], 'Сохранить как моё');
  assert.equal(ru['head-view-reset'], 'Сбросить');
  assert.equal(en['head-view-save-mine'], 'Save as mine');
  const table = json('src/smart/view-table/lang/ru.json').runtime;
  assert.equal(table['templates-tab-text'], 'Представления');
  assert.equal(table['save-filter-template-label'], 'Сохранить представление');
  const head = read('src/smart/view/js/head.js');
  assert.match(head, /this\.text\(locked \? "headViewSaveMine" : "headViewSaveNew"\)/u);
});

test('R67-1: a board and cards keep the footer start that says their count', () => {
  const css = read('src/smart/view/js/head.css');
  const rule = css.slice(css.indexOf(':is(sf-view, sf-data-view)[data-display]:not([data-display="table"]) >'), css.indexOf('{ display: none; }', css.indexOf('[data-display]:not([data-display="table"])')));
  assert.match(rule, /:not\(\[data-sf-view-footer-count\]\) > \[slot="footer"\]\[data-sf-view-made\]/u, 'the footer start is hidden only without the count');
  assert.doesNotMatch(rule.split('\n')[0], /\[slot="footer"\]/u, 'the table and page row rule does not name the footer');
  const view = read('src/smart/view/index.js');
  assert.match(view, /if \(kind !== "board" && kind !== "cards"\) \{\n\s+\/\/ Back to a table[^\n]*\n\s+this\.removeAttribute\?\.\("data-sf-view-footer-count"\);/u);
});

test('R67-3: flexible columns give back room down to their least width before the box scrolls', () => {
  const table = read('src/smart/view-table/index.js');
  assert.match(table, /leastContentWidths\(\) \{/u);
  assert.match(table, /const left = excess - gave;/u);
  assert.match(table, /Math\.max\(floor, Math\.floor\(wants - room \* share\)\)/u, 'a column keeps its floor in whole pixels');
  assert.match(table, /this\._fittedInlineSize = Math\.ceil\(total - gave - given\);/u);
  const css = read('src/smart/view-table/js/templates/default.css');
  assert.match(css, /table\.sf-table-measuring-least > tbody \{\n\s+display: none !important;/u, 'the least width is the heading on one line');
  assert.match(css, /\[data-sf-columns-fitted\] table:not\(\.sf-table-measuring\) td\[data-key\][^{]*\{\n\s+white-space: nowrap;\n\s+overflow: hidden;\n\s+text-overflow: ellipsis;/u, 'a fitted cell stays one line');
  assert.match(css, /\[data-sf-columns-fitted\] table:not\(\.sf-table-measuring\) td\[data-key\] \.sf-table-cell-text \{[^}]*text-overflow: ellipsis;/u, 'a long value ends in an ellipsis');
  assert.match(table, /this\.toggleAttribute\('data-sf-columns-fitted', Boolean\(this\._fittedInlineSize\)\);/u);
});

test('VSA-1: the phone head search field does not widen the row', () => {
  assert.match(read('src/smart/view/js/head.css'), /\.sf-view-head\[data-phone\] \.sf-view-head-search \{[^}]*contain: inline-size;/u);
});

test('VSA-5: a layout switched to while its code loads holds only the list place', () => {
  const view = read('src/smart/view/index.js');
  assert.match(view, /if \(name === "layout"\) \{\n\s+this\._swapContent\(\);\n\s+this\._holdLayoutLoad\(\);/u);
  const hold = view.slice(view.indexOf('_holdLayoutLoad() {'), view.indexOf('// The list head (head="list")'));
  assert.match(hold, /registry\.get\(tag\)\) return;/u, 'a defined layout is not held');
  assert.match(hold, /hold\.setAttribute\("slot", "content"\)/u, 'the skeleton stands in the list place');
  assert.match(hold, /this\.setAttribute\("data-sf-layout-loading", ""\)/u);
  assert.match(hold, /registry\.whenDefined\(tag\)/u);
  // The hold is not the layout's element: the layout's own element is made and
  // fed beside it (the board drew empty when the hold counted as the content).
  assert.match(view, /child\.getAttribute\?\.\("slot"\) === slot\n\s+&& !child\.hasAttribute\?\.\("data-sf-layout-hold"\)\);/u, 'the defaults make the layout element beside the hold');
  assert.match(view, /isTag\(child, want\) \|\| child\.hasAttribute\?\.\("data-sf-layout-hold"\)\) continue;/u, 'a switch does not park the hold');
  assert.match(view, /:scope > \[slot="content"\]:not\(\[data-sf-layout-hold\]\)/u);
});
