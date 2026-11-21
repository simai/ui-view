// A table the host wrote selectable="false" or settings="false" on keeps
// them inside sf-view (Larena, the sites list, 2026-11-05): the view writes
// both on every projection, and it wrote its own chrome over the host's word,
// so the list came back with a box in every row and a «≡» column.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const view = readFileSync(resolve(import.meta.dirname, '../src/smart/view/index.js'), 'utf8');
const body = view.split('function hostWroteOff(table, name) {')[1].split('\n}\n')[0];
const hostWroteOff = new Function('table', 'name', body);

function element(attributes = {}) {
  const map = new Map(Object.entries(attributes));
  return {
    hasAttribute: (name) => map.has(name),
    getAttribute: (name) => (map.has(name) ? map.get(name) : null),
    setAttribute: (name, value) => map.set(name, String(value)),
    map,
  };
}

test('what the table carried before the view touched it is kept aside and read from there', () => {
  const table = element({selectable: 'false'});
  assert.equal(hostWroteOff(table, 'selectable'), true);
  assert.equal(table.map.get('data-sf-host-selectable'), 'false');
  // The view writes its own value next; the host's word is still read.
  table.setAttribute('selectable', 'true');
  assert.equal(hostWroteOff(table, 'selectable'), true);
});

test('a table the host left alone, or wrote true on, takes the view\'s chrome', () => {
  assert.equal(hostWroteOff(element(), 'settings'), false);
  assert.equal(hostWroteOff(element({settings: 'true'}), 'settings'), false);
  assert.equal(hostWroteOff(null, 'settings'), false);
});

test('the projection and the first paint both respect it', () => {
  // The host's word is read before the view writes its own (view round 12):
  // asked after selects() was false, the marker took the view's own "false".
  assert.match(view, /const hostOffSelect = hostWroteOff\(table, "selectable"\);\s*table\.setAttribute\("selectable", !hostOffSelect && this\.selects\(\) && !refused \? "true" : "false"\);/u);
  assert.match(view, /const hostOffSettings = hostWroteOff\(table, "settings"\);\s*table\.setAttribute\("settings", !hostOffSettings && this\.renders\("settings"\) \? "true" : "false"\);/u);
  assert.match(view, /const hostOffSelect = hostWroteOff\(table, "selectable"\);\s*const select = !hostOffSelect && this\.selects\(\);/u);
  assert.match(view, /const hostOffSettings = hostWroteOff\(table, "settings"\);\s*const settings = !hostOffSettings && this\.renders\("settings"\);/u);
});
