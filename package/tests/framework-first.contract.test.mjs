// The Framework-first record (set standard draft 1.1 §7.1, §7.3; view round 1
// F2): docs/FRAMEWORK-FIRST.md has a section per component of the passport,
// every row has one verdict (fw, copy, order, set), and a part kept until a
// Framework order is the same in the record and in its component.json
// (x-framework-first.waits, part id to FO). A copy that neither waits an FO nor
// is fixed or taken by a round item is a defect the record names.
//
// It runs in the overlay (scripts/test.mjs) with SET_ROOT = package/.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const setRoot = process.env.SET_ROOT;
const skip = setRoot ? false : 'SET_ROOT is not set (run through scripts/test.mjs)';
const json = (path) => JSON.parse(readFileSync(resolve(setRoot, path), 'utf8'));
const VERDICTS = new Set(['fw', 'copy', 'order', 'set']);

const record = () => {
  const text = readFileSync(resolve(setRoot, '../docs/FRAMEWORK-FIRST.md'), 'utf8');
  const sections = new Map();
  for (const part of text.split(/^## /mu).slice(1)) {
    const [heading, ...lines] = part.split('\n');
    if (!heading.startsWith('sf-')) continue;
    sections.set(heading.trim(), lines.filter((line) => /^\| [A-Z]-\d+ \|/u.test(line)).map((line) => {
      const cells = line.split(/(?<!\\)\|/u).slice(1, -1).map((cell) => cell.trim());
      return {id: cells[0], verdict: cells[3].replace(/`/gu, ''), state: cells[4]};
    }));
  }
  return sections;
};

test('every component of the passport has a section, and every part one verdict', {skip}, () => {
  const sections = record();
  for (const {folder} of json('set.json').components) {
    const tag = json(`src/smart/${folder}/component.json`).tag;
    assert.ok(sections.get(tag)?.length, `FRAMEWORK-FIRST.md has a section for ${tag}`);
    for (const row of sections.get(tag)) assert.ok(VERDICTS.has(row.verdict), `${row.id}: verdict «${row.verdict}»`);
  }
});

test('a part kept until a Framework order is the same in the record and in component.json', {skip}, () => {
  const sections = record();
  for (const {folder} of json('set.json').components) {
    const component = json(`src/smart/${folder}/component.json`);
    const rows = sections.get(component.tag) ?? [];
    const waits = component['x-framework-first']?.waits ?? {};
    const kept = Object.fromEntries(rows.filter((row) => /^kept, waits FO-\d+/u.test(row.state)).map((row) => [row.id, row.state.match(/FO-\d+/u)[0]]));
    assert.deepEqual(waits, kept, `${folder}: x-framework-first.waits equals the record's kept parts`);
    for (const row of rows) {
      if (row.verdict === 'order') assert.ok(waits[row.id], `${row.id}: an order waits its FO`);
      if (row.verdict === 'copy') assert.match(row.state, /^(kept, waits FO-\d+|fixed|round view-r1 item|parked by the owner)/u, `${row.id}: a copy is fixed, taken by a round item, parked by the owner, or waits an FO`);
    }
  }
});
