// MOD1-3 (acceptance of view modular step 1): sf-view-table (_waitsForView)
// and sf-view (_kindGivesUp, MOD1-1) read a SIMAI Framework internal, the
// Loader's pending tags: SF.__internal.pendingTags.settled(tag), a promise
// that resolves "defined" when the tag is defined and "failed" when the Loader
// could not load its module. Both reads are optional-chained, so a change of
// the internal would not throw: the table would wait out its 3 s bound and the
// view's first paint would hold until the kind is defined. This pins the
// internal's current shape in the pinned ui-source (the overlay), so a
// Framework change fails here, loudly. Migration debt: the Framework is asked
// for a public call (SF.Loader.settled(tag); queued for group build 17); the
// Compatibility Ledger entry is in ui-control (evidence
// control/evidence/2026-11-22-view-merge/README.md).
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {installPendingTags} from '../src/core/js/pending-tags.js';

function fakeWindow() {
  const defined = new Map();
  const waits = new Map();
  const customElements = {
    get: (tag) => defined.get(tag),
    whenDefined: (tag) => {
      if (defined.has(tag)) return Promise.resolve(defined.get(tag));
      if (!waits.has(tag)) { let resolve; const promise = new Promise((done) => { resolve = done; }); waits.set(tag, {promise, resolve}); }
      return waits.get(tag).promise;
    },
    define: (tag, value) => { defined.set(tag, value); waits.get(tag)?.resolve(value); },
  };
  return {customElements, document: undefined};
}

test('SF.__internal.pendingTags.settled resolves "defined" and "failed" as the view and the table read it', async () => {
  const win = fakeWindow();
  const api = installPendingTags(win);
  assert.equal(win.SF.__internal.pendingTags, api, 'the store sits on SF.__internal.pendingTags');
  assert.equal(typeof api.settled, 'function');
  assert.equal(typeof api.fail, 'function');
  const comes = api.settled('sf-view-table');
  assert.ok(comes instanceof Promise);
  win.customElements.define('sf-view-table', class {});
  assert.equal(await comes, 'defined');
  const lost = api.settled('sf-view-board');
  api.fail('sf-view-board');
  assert.equal(await lost, 'failed');
  assert.equal(await api.settled('sf-view-board'), 'failed', 'asked again after the failure');
});

test('the set reads the internal only through the optional chain the shape above answers', () => {
  const table = readFileSync(new URL('../src/smart/view-table/index.js', import.meta.url), 'utf8');
  const view = readFileSync(new URL('../src/smart/view/index.js', import.meta.url), 'utf8');
  assert.match(table, /globalThis\.SF\?\.__internal\?\.pendingTags\?\.settled\?\.\(/u);
  assert.match(view, /globalThis\.SF\?\.__internal\?\.pendingTags\?\.settled;/u);
  assert.match(view, /state === "failed"/u);
});
