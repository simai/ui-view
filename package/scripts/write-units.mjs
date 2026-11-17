#!/usr/bin/env node
// Writes docs/view/units.json, the set's unit journal, from the components'
// own journal (set standard draft 1.1 §6.4): component.json `x-history` is the
// source -- one entry per version with its kind, the consumer note and the
// evidence -- and the version's changes are the matching
// x-registry.compatibility.migrations entry. Nothing is written by hand.
//
// Usage: node package/scripts/write-units.mjs [--check]
//   --check  exits 1 when docs/view/units.json is not what this would write.
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const UNITS_PATH = 'docs/view/units.json';

export const units = (setRoot) => {
  const passport = JSON.parse(readFileSync(join(setRoot, 'set.json'), 'utf8'));
  const entries = [];
  for (const {folder} of passport.components) {
    const component = JSON.parse(readFileSync(join(setRoot, 'src/smart', folder, 'component.json'), 'utf8'));
    const migrations = component['x-registry']?.compatibility?.migrations ?? [];
    for (const entry of component['x-history'] ?? []) {
      const migration = migrations.find((one) => one.to === entry.version);
      if (!migration) throw new Error(`${folder} ${entry.version}: history names a version with no migration entry`);
      entries.push({
        unit: `smart.${folder}`,
        version: entry.version,
        recorded_on: entry.recorded_on,
        change: entry.kind,
        consumer: entry.consumer,
        summary: (Array.isArray(migration.changes) ? migration.changes : [migration.changes]).join(' '),
        evidence: entry.evidence,
      });
    }
  }
  return {
    schema: 'simai.view.unit-journal',
    schema_version: 1,
    summary: 'One entry per version of each component of the set view, written by scripts/write-units.mjs from component.json x-history (kind, consumer note, evidence) and the version\'s migration entry (changes). Former public names are dated in each component\'s aliases.json.',
    entries,
  };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const setRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const text = `${JSON.stringify(units(setRoot), null, 2)}\n`;
  const path = join(setRoot, UNITS_PATH);
  let current = '';
  try { current = readFileSync(path, 'utf8'); } catch { /* not written yet */ }
  if (process.argv.includes('--check')) {
    if (current !== text) {
      console.error(`${UNITS_PATH} is not current: run node package/scripts/write-units.mjs`);
      process.exit(1);
    }
  } else if (current !== text) {
    writeFileSync(path, text);
  }
  console.log(JSON.stringify({entries: units(setRoot).entries.length, path: UNITS_PATH}));
}
