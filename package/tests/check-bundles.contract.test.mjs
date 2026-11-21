// The bundles gate (scripts/check-bundles.mjs, view modular step 1): a module
// of the set in two bundles fails it, the runtime's externals and the empty
// stylesheet stubs do not, and every bundle needs a budget it keeps.
import assert from 'node:assert/strict';
import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {pathToFileURL} from 'node:url';
import {gzipSync} from 'node:zlib';

// The script and the budgets are the set's (SET_ROOT), not the overlay's.
const setRoot = process.env.SET_ROOT;
const skip = !setRoot && 'SET_ROOT is not given';
const gate = async () => (await import(pathToFileURL(join(setRoot, 'scripts', 'check-bundles.mjs')).href)).checkBundles;

const module = (id, body) => `/***/ "${id}"\n${body}\n/***/ },\n`;
const external = (name) => `(module) {\n\nmodule.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("${name}", 1) : null);\n`;
const stub = '(__unused_webpack_module, __webpack_exports__, __webpack_require__) {\n\n__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n';
const code = (name) => `(__unused_webpack_module, __webpack_exports__, __webpack_require__) {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "${name}": () => (${name})\n/* harmony export */ });\nfunction ${name}() { return ${JSON.stringify(name.repeat(40))}; }\n`;

function lay(bundles) {
  const output = mkdtempSync(join(tmpdir(), 'view-bundles-'));
  for (const [name, modules] of Object.entries(bundles)) {
    mkdirSync(join(output, 'smart', name, 'js'), {recursive: true});
    const text = `/******/ var __webpack_modules__ = ({\n\n${modules.join('\n')}\n/******/ });\n`;
    writeFileSync(join(output, 'smart', name, 'js', `${name}.js`), text);
    writeFileSync(join(output, 'smart', name, 'js', `${name}.min.js.gz`), gzipSync(text));
  }
  return output;
}

const roomy = (names) => ({bundles: Object.fromEntries(names.map((name) => [name, {js_gz: 100000, css_gz: 100000}]))});

test('a module in two bundles fails the gate; externals and stylesheet stubs do not', {skip}, async () => {
  const checkBundles = await gate();
  const shared = module('aaaaaaaaaaaa', code('formatThing'));
  const output = lay({
    'view-board': [shared, module('bbbbbbbbbbbb', external('lit')), module('cccccccccccc', stub)],
    'view-cards': [shared, module('bbbbbbbbbbbb', external('lit')), module('cccccccccccc', stub), module('dddddddddddd', code('ownCards'))],
  });
  try {
    const result = checkBundles(output, roomy(['view-board', 'view-cards']));
    assert.equal(result.passed, false);
    assert.deepEqual(result.duplicates.map((entry) => [entry.id, entry.bundles, entry.exports]),
      [['aaaaaaaaaaaa', ['view-board', 'view-cards'], ['formatThing']]]);
  } finally {
    rmSync(output, {recursive: true, force: true});
  }
});

test('the shared module in the package core alone passes; a bundle over its budget or without one fails', {skip}, async () => {
  const checkBundles = await gate();
  const output = lay({
    'view-common': [module('aaaaaaaaaaaa', code('formatThing'))],
    'view-board': [module('bbbbbbbbbbbb', external('view/field-renderers')), module('dddddddddddd', code('ownBoard'))],
  });
  try {
    assert.equal(checkBundles(output, roomy(['view-common', 'view-board'])).passed, true);
    const tight = checkBundles(output, {bundles: {'view-common': {js_gz: 10, css_gz: 0}, 'view-board': {js_gz: 100000, css_gz: 0}}});
    assert.equal(tight.passed, false);
    assert.deepEqual(tight.budgets.over.map((entry) => [entry.bundle, entry.file]), [['view-common', 'js_gz']]);
    const missing = checkBundles(output, {bundles: {'view-board': {js_gz: 100000, css_gz: 0}, 'view-gone': {js_gz: 1, css_gz: 1}}});
    assert.deepEqual(missing.budgets.over.map((entry) => [entry.bundle, entry.problem]),
      [['view-common', 'no budget'], ['view-gone', 'a budget for a bundle the build has not']]);
  } finally {
    rmSync(output, {recursive: true, force: true});
  }
});

test('the budgets name every bundle of the set and the package core', {skip}, () => {
  const budgets = JSON.parse(readFileSync(join(setRoot, 'bundle-budgets.json'), 'utf8'));
  const set = JSON.parse(readFileSync(join(setRoot, 'set.json'), 'utf8'));
  const core = JSON.parse(readFileSync(join(setRoot, 'package.json'), 'utf8')).simai.core.folder;
  assert.deepEqual(Object.keys(budgets.bundles).sort(), [...set.components.map((component) => component.folder), core].sort());
  for (const [name, budget] of Object.entries(budgets.bundles)) {
    assert.ok(Number.isInteger(budget.js_gz) && Number.isInteger(budget.css_gz), `${name}: budgets are bytes`);
    assert.ok(budget.measured && budget.js_gz >= budget.measured.js_gz && budget.css_gz >= budget.measured.css_gz, `${name}: the budget is the measured size and some room`);
  }
});
