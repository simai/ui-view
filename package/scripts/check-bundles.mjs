#!/usr/bin/env node
// Usage: node scripts/check-bundles.mjs <built package output> [--budgets <file>] [--json]
//
// Two gates over the built bundles of the set (view modular step 1, draft
// standard rules M7 and M10 of the C409 study):
//
//   duplicates  a module of the set's code is in one bundle only. The package
//               core (package.json simai.core, smart/view-common) holds what two
//               bundles share; every other bundle takes it from the runtime as
//               SF.runtimeModule("view/<module>"). A module found in two bundles
//               fails the gate with its id, its size and the names it exports.
//               Not counted: the runtime's own externals (a one-line
//               SF.runtimeModule(...) stub per bundle) and the empty stubs
//               mini-css-extract leaves for an imported stylesheet.
//               bundle-budgets.json `allowed_duplicates` names the one kind of
//               exception: modules found in exactly the bundles an entry lists,
//               up to its max_gzip in all, with the reason. An entry that no
//               longer matches anything fails too (the exception is gone, so is
//               the entry).
//   budgets     each bundle's min.js.gz and min.css.gz are within the budget
//               bundle-budgets.json gives it, in bytes. A bundle with no budget,
//               or a budget for a bundle the build has not, fails too.
//
// The modules are read from the unminified bundles (smart/<c>/js/<c>.js), whose
// module ids are the builder's stable ids: one source module has one id in
// every bundle.
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MODULE = /^\/\*\*\*\/ "([0-9a-f]+)"\n([\s\S]*?)^\/\*\*\*\/ \}/gmu;
const EXTERNAL = /^\s*\(module\) \{\s*module\.exports = \(globalThis\.SF && globalThis\.SF\.runtimeModule \?/u;
const CSS_STUB = /^\s*\(__unused_webpack_module, __webpack_exports__, __webpack_require__\) \{\s*__webpack_require__\.r\(__webpack_exports__\);\s*\/\/ extracted by mini-css-extract-plugin\s*$/u;
const EXPORTS = /\/\* harmony export \*\/\s+"?([A-Za-z0-9_$]+)"?:/gu;

// Every module of a bundle (externals and stubs too): a bundle the gate reads
// no module from is one it could not parse, never an empty bundle (MOD1-2).
export const parsedCount = (file) => [...readFileSync(file, 'utf8').matchAll(MODULE)].length;

export function readModules(file) {
  const text = readFileSync(file, 'utf8');
  const modules = [];
  for (const [, id, body] of text.matchAll(MODULE)) {
    if (EXTERNAL.test(body) || CSS_STUB.test(body)) continue;
    const json = /module\.exports = \/\*#__PURE__\*\/JSON\.parse\(/u.test(body);
    const names = [...body.matchAll(EXPORTS)].map(([, name]) => name);
    modules.push({id, bytes: Buffer.byteLength(body), gzip: gzipSync(body).length, exports: json ? ['(json)'] : [...new Set(names)].slice(0, 8)});
  }
  return modules;
}

const size = (file) => (existsSync(file) ? statSync(file).size : 0);

export function checkBundles(output, budgets) {
  const smart = join(output, 'smart');
  const bundles = readdirSync(smart).filter((name) => existsSync(join(smart, name, 'js', `${name}.js`))).sort();
  const seen = new Map();
  const sizes = {};
  // MOD1-2 (acceptance of view modular step 1): a bundle whose format the gate
  // does not read yields no module, and a gate that reads nothing finds no
  // duplicate; such a bundle fails the gate instead of passing it.
  const unparsed = bundles.filter((name) => parsedCount(join(smart, name, 'js', `${name}.js`)) === 0);
  for (const name of bundles) {
    for (const module of readModules(join(smart, name, 'js', `${name}.js`))) {
      const entry = seen.get(module.id) ?? {...module, bundles: []};
      entry.bundles.push(name);
      seen.set(module.id, entry);
    }
    sizes[name] = {
      js_gz: size(join(smart, name, 'js', `${name}.min.js.gz`)),
      css_gz: size(join(smart, name, 'css', `${name}.min.css.gz`)),
    };
  }
  const found = [...seen.values()].filter((entry) => entry.bundles.length > 1)
    .sort((a, b) => b.gzip - a.gzip)
    .map(({id, bytes, gzip, exports, bundles: where}) => ({id, bytes, gzip, exports, bundles: where}));
  const key = (list) => [...list].sort().join(' ');
  const allowances = (budgets.allowed_duplicates ?? []).map((entry) => ({...entry, key: key(entry.bundles), modules: 0, gzip: 0}));
  const duplicates = [];
  const allowed = [];
  for (const entry of found) {
    const allowance = allowances.find((one) => one.key === key(entry.bundles));
    if (!allowance) { duplicates.push(entry); continue; }
    allowance.modules += 1;
    allowance.gzip += entry.gzip;
    allowed.push(entry);
  }
  const allowanceProblems = allowances.flatMap((one) => [
    ...(one.modules === 0 ? [{bundles: one.bundles, problem: 'an allowed duplicate that matches nothing any more'}] : []),
    ...(one.gzip > one.max_gzip ? [{bundles: one.bundles, problem: `the allowed duplicates are ${one.gzip} bytes gzip, above max_gzip ${one.max_gzip}`}] : []),
  ]);
  const over = [];
  const own = budgets.bundles ?? {};
  for (const name of bundles) {
    const budget = own[name];
    if (!budget) { over.push({bundle: name, problem: 'no budget'}); continue; }
    for (const key of ['js_gz', 'css_gz']) {
      if (sizes[name][key] > budget[key]) over.push({bundle: name, file: key, size: sizes[name][key], budget: budget[key]});
    }
  }
  for (const name of Object.keys(own)) if (!bundles.includes(name)) over.push({bundle: name, problem: 'a budget for a bundle the build has not'});
  const total = (key) => Object.values(sizes).reduce((sum, item) => sum + item[key], 0);
  return {
    bundles: bundles.length,
    modules: seen.size,
    unparsed,
    duplicates,
    allowed: {modules: allowed, by_bundles: allowances.map(({bundles: where, modules, gzip, max_gzip: max}) => ({bundles: where, modules, gzip, max_gzip: max})), problems: allowanceProblems},
    budgets: {over, sizes, total_js_gz: total('js_gz'), total_css_gz: total('css_gz')},
    passed: bundles.length > 0 && unparsed.length === 0 && duplicates.length === 0 && allowanceProblems.length === 0 && over.length === 0,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const output = args.find((arg) => !arg.startsWith('--') && args[args.indexOf(arg) - 1] !== '--budgets');
  if (!output) throw new Error('usage: check-bundles.mjs <built package output> [--budgets <file>]');
  const at = args.indexOf('--budgets');
  const budgets = JSON.parse(readFileSync(at === -1 ? join(PACKAGE_ROOT, 'bundle-budgets.json') : resolve(args[at + 1]), 'utf8'));
  const result = checkBundles(resolve(output), budgets);
  console.log(JSON.stringify(result, null, 1));
  process.exit(result.passed ? 0 : 1);
}
