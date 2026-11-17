import assert from 'node:assert/strict';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import test from 'node:test';

// Draft set standard §13.4 (view round 1, G1): a former name (tag, event,
// attribute) ends no earlier than the main consumer's switch to the set, with
// at least two weeks' margin. The main consumer of view is Larena, which moves
// to data-sf-sets="admin view" on 2026-12-15 (VS-4 Larena dates); the floor is
// 2026-12-29. Every alias that ended on 2026-12-01 moved to 2027-01-01, and the
// journal (component.json history) says so in the version that moved it.
//
// It runs in the overlay (scripts/test.mjs); the set's own folders are the ones
// set.json names.
const overlay = new URL('../', import.meta.url);
const json = (url) => JSON.parse(readFileSync(url, 'utf8'));

const CONSUMERS = [{consumer: 'Larena', switch: '2026-12-15'}];
const MARGIN_DAYS = 14;
const floor = CONSUMERS.map(({switch: day}) => new Date(Date.parse(`${day}T00:00:00Z`) + MARGIN_DAYS * 864e5).toISOString().slice(0, 10)).sort().at(-1);

const setRoot = process.env.SET_ROOT;
const folders = setRoot
  ? json(new URL(`file://${setRoot}/set.json`)).components.map(({folder}) => folder)
  : readdirSync(new URL('src/smart/', overlay)).filter((name) => name === 'view' || name.startsWith('view-'));

test('every former name of the set ends after the main consumer moves, with two weeks of margin', () => {
  assert.equal(floor, '2026-12-29');
  const early = [];
  for (const folder of folders) {
    const file = new URL(`src/smart/${folder}/aliases.json`, overlay);
    if (!existsSync(file)) continue;
    const aliases = json(file);
    if (aliases.remove_after && aliases.remove_after < floor) early.push(`${folder}: the file's remove_after ${aliases.remove_after}`);
    for (const alias of aliases.aliases ?? []) {
      assert.match(alias.remove_after ?? '', /^\d{4}-\d{2}-\d{2}$/u, `${folder} ${alias.from}: a dated alias`);
      if (alias.remove_after < floor) early.push(`${folder} ${alias.kind} ${alias.from}: ${alias.remove_after}`);
    }
  }
  assert.deepEqual(early, []);
});

test('the passport dates its former tags the same way', {skip: !setRoot && 'SET_ROOT is not given'}, () => {
  const passport = json(new URL(`file://${setRoot}/set.json`));
  for (const component of passport.components) {
    for (const alias of component.element_aliases ?? []) {
      assert.ok(alias.remove_after >= floor, `${component.element} ${alias.from}: ${alias.remove_after}`);
    }
  }
});

test('the journal records the move of the dates in the version that made it', () => {
  for (const folder of ['view', 'view-table', 'view-properties']) {
    const manifest = json(new URL(`src/smart/${folder}/component.json`, overlay));
    const steps = manifest['x-registry'].compatibility.migrations;
    assert.ok(steps.some(({changes}) => changes.some((change) => /now end 2027-01-01 \(draft set standard §13\.4/u.test(change))), folder);
  }
});
