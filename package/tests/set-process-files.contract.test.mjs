// The set's process files (set standard draft 1.1 §2.2-2.4; view round 1 F1):
// docs/START.md, the handoff a new thread reads first; docs/STATUS.md, one
// screen with what is done and its evidence, the consumer table (§13.1) and
// every open remote branch with the release that takes it; docs/DECISIONS.md,
// one D<n> per question and an Answers table that names the owner decisions
// the set follows (C289, C290).
//
// It runs in the overlay (scripts/test.mjs) with SET_ROOT = package/, so the
// repository root is SET_ROOT/..; without SET_ROOT it has nothing to read.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const setRoot = process.env.SET_ROOT;
const repository = setRoot ? resolve(setRoot, '..') : null;
const read = (path) => readFileSync(resolve(repository, path), 'utf8');
const skip = setRoot ? false : 'SET_ROOT is not set (run through scripts/test.mjs)';

test('START, STATUS and DECISIONS are present and not empty', {skip}, () => {
  for (const path of ['docs/START.md', 'docs/STATUS.md', 'docs/DECISIONS.md']) {
    assert.ok(existsSync(resolve(repository, path)), `${path} exists`);
    assert.ok(read(path).trim().split('\n').length > 10, `${path} says something`);
  }
  const start = read('docs/START.md');
  for (const heading of ['## What the set is', '## Where the pin is', '## How to run the gates', '## The open round']) assert.ok(start.includes(heading), `START has «${heading}»`);
});

test('STATUS: what is done with its evidence, the consumers in three columns, the open branches', {skip}, () => {
  const status = read('docs/STATUS.md');
  for (const heading of ['## The pin', '## Done', '## Consumers', '## Open branches']) assert.ok(status.includes(heading), `STATUS has «${heading}»`);
  const section = (heading) => status.slice(status.indexOf(heading), status.indexOf('\n## ', status.indexOf(heading) + 1) >>> 0);
  assert.match(section('## Done'), /^\| Part \| State \| Evidence \|$/mu);
  assert.match(section('## Consumers'), /^\| Consumer \| Uses tags \| Pins a release \| `requires_sets` range \|$/mu);
  assert.match(section('## Open branches'), /^\| Branch \| Release that takes it \|$/mu);
});

test('STATUS names every remote branch ahead of main', {skip}, (t) => {
  let refs;
  try {
    refs = execFileSync('git', ['-C', repository, 'for-each-ref', '--format=%(refname:short)', 'refs/remotes/origin'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean);
    execFileSync('git', ['-C', repository, 'rev-parse', '--verify', '--quiet', 'origin/main'], {stdio: 'ignore'});
  } catch {
    t.skip('no git checkout with origin/main');
    return;
  }
  const rows = [...read('docs/STATUS.md').matchAll(/^\| `([^`]+)` \|/gmu)].map((match) => match[1]);
  const named = (branch) => rows.some((row) => (row.endsWith('*') ? branch.startsWith(row.slice(0, -1)) : row === branch));
  const missing = [];
  for (const ref of refs) {
    if (ref === 'origin' || ref === 'origin/HEAD' || ref === 'origin/main') continue;
    const ahead = Number(execFileSync('git', ['-C', repository, 'rev-list', '--count', `origin/main..${ref}`], {encoding: 'utf8'}).trim());
    if (ahead > 0 && !named(ref.replace(/^origin\//u, ''))) missing.push(ref);
  }
  assert.deepEqual(missing, [], 'every branch ahead of main has a row in «Open branches»');
});

test('DECISIONS: one D<n> per question with options and outcome, and the Answers table naming C289 and C290', {skip}, () => {
  const decisions = read('docs/DECISIONS.md');
  const questions = [...decisions.matchAll(/^## (D\d+) — .+$/gmu)].map((match) => match[1]);
  assert.ok(questions.length > 0, 'at least one D<n>');
  for (const id of questions) {
    const body = decisions.slice(decisions.indexOf(`## ${id} — `), decisions.indexOf('\n## ', decisions.indexOf(`## ${id} — `) + 1) >>> 0);
    for (const part of ['- Options:', '- Cost:', '- Recommendation:', '- Outcome:']) assert.ok(body.includes(part), `${id} has «${part}»`);
  }
  const answers = decisions.slice(decisions.indexOf('## Answers'));
  assert.match(answers, /^\| Decision \| Answer \| Date \| Record \|$/mu);
  for (const id of ['C289', 'C290', ...questions]) assert.match(answers, new RegExp(`^\\| ${id} \\|`, 'mu'), `Answers has a row for ${id}`);
});
