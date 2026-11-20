import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

// The view site round (round/view-site): the cards say their count once inside
// sf-view, and the view the person opened last opens by itself from their
// layer (simai.dataview-port 1.16.0 data.preferences.view). Evidence: ui-control
// control/evidence/2026-11-21-view-site/.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));
const view = read('src/smart/view/index.js');
const cards = read('src/smart/view-cards/index.js');
const template = read('src/smart/view-cards/js/templates/default.js');

test('inside sf-view the cards keep the more button and drop their own count line', () => {
  const more = template.slice(template.indexOf('function renderMore(context) {'), template.indexOf('function renderBulk(context) {'));
  const inView = more.slice(more.indexOf('if (context.inView) {'), more.indexOf('return html`<div class="sf-view-cards__more">\n        <sf-pagination'));
  assert.match(inView, /<sf-button size=\$\{context\.size\} appearance="outline" scheme="primary" data-more/u);
  assert.doesNotMatch(inView, /sf-pagination|shown/u, 'no «Показано N из M» under sf-view');
  assert.match(more, /<sf-pagination appearance="more"/u, 'standalone cards keep sf-pagination with its line');
  assert.match(cards, /inView: Boolean\(this\.closest\?\.\("sf-view"\)\)/u);
  assert.match(cards, /if \(control\.hasAttribute\("data-more"\)\) this\.showMore\(\);/u);
  for (const lang of ['en', 'ru']) {
    const words = json(`src/smart/view-cards/lang/${lang}.json`).runtime;
    assert.ok(words['more-text']?.includes('{count}'), lang);
    assert.ok(words['more-plain-text'], lang);
  }
});

test('the view opened last opens from the person layer and is saved there', () => {
  const kept = view.slice(view.indexOf('    _openKeptView(layer) {'), view.indexOf('    // The part of a saved view that belongs to the table rather than to the'));
  assert.match(kept, /typeof layer\.view === "string"/u);
  assert.match(kept, /this\.hostOffers\("saved-views"\)/u);
  assert.match(kept, /views\.some\(\(view\) => String\(view\?\.key\) === key\)/u, 'only a view the host lists');
  assert.match(kept, /this\._head\._openSavedView\(key\)/u, 'opened as the views menu opens it');
  assert.match(kept, /else this\.openView\(key\)/u);
  const accept = view.slice(view.indexOf('    _acceptPersonal(layer) {'), view.indexOf('    refresh(reason = "refresh") {'));
  assert.match(accept, /const opened = first && this\._openKeptView\(layer\);/u);
  assert.match(accept, /if \(first && !opened && Number\.isInteger\(size\)/u, 'the size is not asked twice');
  const open = view.slice(view.indexOf('    openView(key) {'), view.indexOf('    // The view the person opened last'));
  assert.match(open, /this\._savePersonal\(\{view: String\(key\)\}\)/u);
});
