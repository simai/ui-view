// The package half of ui-source's "change journal: every declared alias table
// is recorded" (tests/change-lifecycle.contract.test.mjs).
//
// A former event name a component still answers to is kept for compatibility,
// and nothing is kept without a date to leave by. In the free Framework that
// date is a record of contracts/changes/journal.json. The package components
// keep their former names in aliases.json, dated per row; since standard
// simai.smart-component 1.4 their smart.manifest.json is generated from
// component.json, so every one of those names is listed with alias_of (the
// hand-written manifests listed none, which is why the free test passed over
// the package until now).
//
// The journal is ui-source's file and a package file may not replace it (the
// overlay refuses), so the records are ui-source's to add. Until they are,
// each name is listed below as pending: it must have a dated row in its
// component's aliases.json, and the list only shrinks -- a name the journal
// records is removed from it in the same commit that moves the pin.
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const read = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const journal = read('contracts/changes/journal.json');
const recorded = new Set(journal.records.flatMap((record) => record.items.map((item) => `${item.component || ''}|${item.from}`)));
const known = (component, from) => recorded.has(`${component}|${from}`) || recorded.has(`|${from}`);

// Former event names of package components the journal does not record yet,
// by component. Each has a dated row in its aliases.json.
// Nothing pending: since the pin on ui-source 8c13bf45 (pair ui-7fb26d395af2)
// the journal records sf-view-saved-view-intent (event-view-save-kind-view).
const PENDING = {};

// The package's folders (scripts/overlay.mjs PACKAGE_COMPONENTS; the overlay
// holds src/, tests/ and docs/ of this repository, not its scripts).
// The renamed ones (rename plan R2, 2026-11-03) have their earlier former
// names recorded with their tag record (tag-sf-table-to-sf-view-table, ...).
const packageFolders = ['view', 'view-properties', 'view-flow', 'view-table'];

const DATE = /^\d{4}-\d{2}-\d{2}$/u;

test('every former event name of a package component is recorded in the journal, or pending with a dated row', () => {
  const problems = [];
  const seen = new Set();
  for (const name of packageFolders) {
    const manifest = read(`src/smart/${name}/smart.manifest.json`);
    const tag = manifest.custom_element?.tag || manifest.custom_element;
    const rows = existsSync(resolve(root, `src/smart/${name}/aliases.json`)) ? read(`src/smart/${name}/aliases.json`).aliases ?? [] : [];
    for (const [event, spec] of Object.entries(manifest.events || {})) {
      if (!spec.alias_of || known(tag, event)) continue;
      seen.add(`${tag}|${event}`);
      if (!(PENDING[tag] ?? []).includes(event)) {
        problems.push(`${tag} event ${event}: not in contracts/changes/journal.json and not pending here`);
        continue;
      }
      const row = rows.find((one) => one.kind === 'event' && one.from === event);
      if (!row || !DATE.test(row.since ?? '') || !DATE.test(row.remove_after ?? '')) {
        problems.push(`${tag} event ${event}: pending, but aliases.json has no dated row for it`);
      }
    }
  }
  for (const [tag, events] of Object.entries(PENDING)) {
    for (const event of events) {
      if (!seen.has(`${tag}|${event}`)) problems.push(`${tag} event ${event}: pending here, but recorded or gone: remove it from PENDING`);
    }
  }
  assert.deepEqual(problems, []);
});

// The version line (draft set standard §5.7, VS1.r2, VW-3; view round 1 B2).
// Version numbers are assigned only in the set. ui-pro's copies shipped
// numbers of their own (read from ui-pro origin/main component.json history,
// 2026-11-17); none of them is a set version with other content, and the
// set's current version is above every one, so the next release is too.
const PRO_COPY_NUMBERS = {
  view: ['1.12.6'],
  'view-table': ['1.17.1', '1.19.7', '1.19.8', '1.20.4'],
  'view-properties': ['1.16.2', '1.16.4', '1.16.8'],
};
// What each set release shipped (package/dist/smart/<folder>/smart.manifest.json
// at the Build commit each contracts/releases/view-<12>.lock.json names).
const RELEASED = {
  'view 1.0.0': {view: '1.8.0', 'view-table': '1.14.0', 'view-properties': '1.9.1'},
  'view 1.1.0': {view: '1.8.1', 'view-table': '1.15.0', 'view-properties': '1.10.0'},
  'view 1.2.0': {view: '1.8.2', 'view-table': '1.15.0', 'view-properties': '1.10.1'},
  'view 1.3.0': {view: '1.8.2', 'view-table': '1.15.0', 'view-properties': '1.11.0'},
  'view 1.4.0': {view: '1.9.0', 'view-table': '1.15.1', 'view-properties': '1.11.1'},
  'view 1.5.0': {view: '1.10.0', 'view-table': '1.16.0', 'view-properties': '1.13.1'},
  'view 1.5.1': {view: '1.10.0', 'view-table': '1.16.1', 'view-properties': '1.13.2'},
  'view 1.6.0': {view: '1.11.0', 'view-table': '1.17.0', 'view-properties': '1.13.2'},
  'view 1.7.0': {view: '1.12.0', 'view-table': '1.18.0', 'view-properties': '1.13.3'},
  'view 1.7.1': {view: '1.12.0', 'view-table': '1.18.1', 'view-properties': '1.13.3'},
  'view 1.8.0': {view: '1.12.3', 'view-table': '1.19.5', 'view-properties': '1.15.2'},
  'view 1.8.1': {view: '1.12.3', 'view-table': '1.19.6', 'view-properties': '1.16.3'},
};
const semver = (version) => version.split('.').map(Number);
const above = (a, b) => (semver(a).map((part, index) => part - semver(b)[index]).find((delta) => delta !== 0) ?? 0) > 0;

test('the version line: no set release shipped a number a pro copy shipped, and the set is above them all', () => {
  for (const [folder, numbers] of Object.entries(PRO_COPY_NUMBERS)) {
    const component = read(`src/smart/${folder}/component.json`);
    for (const number of numbers) {
      for (const [release, shipped] of Object.entries(RELEASED)) {
        assert.notEqual(shipped[folder], number, `${release} shipped ${folder} ${number}, a number ui-pro's copy shipped too`);
      }
      assert.ok(above(component.version, number), `${folder} ${component.version} is above ui-pro's ${number}`);
    }
  }
});

test('the journal says which numbers are ui-pro\'s and not the set\'s', () => {
  for (const [folder, numbers] of Object.entries(PRO_COPY_NUMBERS)) {
    const note = read(`src/smart/${folder}/component.json`)['x-decisions']?.['pro-copy-versions'] ?? '';
    assert.match(note, /^Version line \(draft set standard §5\.7/u, folder);
    for (const number of numbers) assert.ok(note.includes(number), `${folder}: the note names ui-pro's ${number}`);
  }
  const setRoot = process.env.SET_ROOT;
  if (setRoot) {
    const changes = readFileSync(resolve(setRoot, '..', 'CHANGELOG.md'), 'utf8');
    assert.match(changes, /^## Version line$/mu, 'CHANGELOG states the version line');
    for (const numbers of Object.values(PRO_COPY_NUMBERS)) for (const number of numbers) assert.ok(changes.includes(number), `CHANGELOG names ${number}`);
  }
});

// One journal (draft set standard §6.4, VS1.r3; view round 1 F3, F5): every
// version since view 1.8.1 has one component.json `x-history` entry with its
// kind (from the version step), a consumer note of more than ten characters,
// and its evidence -- the commit that made it, or a ui-control evidence path.
// docs/view/units.json is generated from it (scripts/write-units.mjs).
// view 1.8.1 shipped sf-view-flow 1.1.2 too (preview, so not in RELEASED's line).
const HISTORY_SINCE = {...RELEASED['view 1.8.1'], 'view-flow': '1.1.2'};
const EVIDENCE = /^(https:\/\/github\.com\/simai\/ui-view\/commit\/[0-9a-f]{40}|https:\/\/github\.com\/simai\/ui-control\/(blob|tree)\/[^\s]+\/control\/evidence\/\S+|control\/evidence\/\S+|docs\/evidence\/\S+)$/u;
const stepKind = (from, to) => {
  const [a, b] = [semver(from), semver(to)];
  return a[0] !== b[0] ? 'major' : a[1] !== b[1] ? 'minor' : 'patch';
};

test('every version since the last release has one history entry with kind, consumer and evidence', () => {
  for (const folder of packageFolders) {
    const component = read(`src/smart/${folder}/component.json`);
    const since = HISTORY_SINCE[folder] ?? '0.0.0';
    const migrations = (component['x-registry']?.compatibility?.migrations ?? []).filter((one) => above(one.to, since));
    const history = component['x-history'] ?? [];
    assert.deepEqual(history.map((entry) => entry.version).sort(), migrations.map((one) => one.to).sort(), `${folder}: one history entry per version since ${since}`);
    if (migrations.length) assert.equal(history[0].version, component.version, `${folder}: the newest entry is the component's version`);
    for (const entry of history) {
      const migration = migrations.find((one) => one.to === entry.version);
      assert.equal(entry.kind, stepKind(migration.from, migration.to), `${folder} ${entry.version}: kind follows ${migration.from} -> ${migration.to}`);
      assert.ok(typeof entry.consumer === 'string' && entry.consumer.length > 10, `${folder} ${entry.version}: a consumer note`);
      assert.match(entry.recorded_on ?? '', DATE, `${folder} ${entry.version}: recorded_on`);
      assert.match(entry.evidence ?? '', EVIDENCE, `${folder} ${entry.version}: evidence is a commit or an evidence path`);
    }
  }
});

test('docs/view/units.json is generated from the history and current', async (t) => {
  const setRoot = process.env.SET_ROOT;
  if (!setRoot) { t.skip('SET_ROOT is not set (run through scripts/test.mjs)'); return; }
  const {units, UNITS_PATH} = await import(resolve(setRoot, 'scripts/write-units.mjs'));
  assert.equal(readFileSync(resolve(setRoot, UNITS_PATH), 'utf8'), `${JSON.stringify(units(setRoot), null, 2)}\n`, 'run node package/scripts/write-units.mjs');
});
