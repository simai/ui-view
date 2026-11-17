// The words gate of view round 1 (D7; draft set standard 7.10): every word a
// person reads is in the component's language files. A script of sf-view,
// sf-view-table or sf-view-flow holds no Russian outside its comments.
// sf-view-properties is the card's own round (VF-14, BQ-2) and is not read here.
import assert from 'node:assert/strict';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, resolve} from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const scripts = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) return name === 'lang' ? [] : scripts(path);
  return name.endsWith('.js') ? [path] : [];
});
// The lines a person could read: a comment line, a block or markup comment
// opened at a line's start (templates and sheets write them so) and a trailing
// «// …» are not. Line by line, so a string holding «/*» hides nothing.
function wordLines(text) {
  let closer = null;
  return text.split('\n').map((line) => {
    if (closer) {
      if (!line.includes(closer)) return '';
      const rest = line.slice(line.indexOf(closer) + closer.length);
      closer = null;
      return rest;
    }
    if (/^\s*\/\//u.test(line)) return '';
    for (const [open, close] of [['/*', '*/'], ['<!--', '-->']]) {
      const at = line.indexOf(open);
      if (at >= 0 && line.slice(0, at).trim() === '') {
        if (!line.includes(close, at)) closer = close;
        return '';
      }
    }
    return line.replace(/<!--[\s\S]*?-->/gu, '').replace(/(^|[^:"'`\\])\/\/ [^\n]*$/u, '$1');
  });
}

for (const component of ['view', 'view-table', 'view-flow']) {
  test(`${component}: no word outside lang/`, () => {
    const found = [];
    for (const path of scripts(resolve(root, 'src/smart', component))) {
      wordLines(readFileSync(path, 'utf8')).forEach((line, index) => {
        if (/[А-Яа-яЁё]/u.test(line)) found.push(`${path.slice(root.length + 1)}:${index + 1} ${line.trim().slice(0, 100)}`);
      });
    }
    assert.deepEqual(found, []);
  });
}

test('the date operators of the table\'s chips have their own words (Позже, Не раньше, Раньше, Не позже)', () => {
  const ru = JSON.parse(readFileSync(resolve(root, 'src/smart/view-table/lang/ru.json'), 'utf8')).runtime;
  const en = JSON.parse(readFileSync(resolve(root, 'src/smart/view-table/lang/en.json'), 'utf8')).runtime;
  assert.deepEqual(
    ['operator-after', 'operator-on-or-after', 'operator-before', 'operator-on-or-before'].map((key) => ru[key]),
    ['Позже', 'Не раньше', 'Раньше', 'Не позже'],
  );
  assert.deepEqual(
    ['operator-after', 'operator-on-or-after', 'operator-before', 'operator-on-or-before'].map((key) => en[key]),
    ['After', 'On or after', 'Before', 'On or before'],
  );
  const table = readFileSync(resolve(root, 'src/smart/view-table/index.js'), 'utf8');
  assert.match(table, /getFilterOperatorLabel\(operator, field = null\)/u);
});
