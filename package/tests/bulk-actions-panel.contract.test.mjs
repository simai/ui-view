import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {URL} from 'node:url';
import {pagination, render} from './fixtures/pagination-harness.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const styles = async () => (await read('src/component/pagination/scss/_css__pagination.scss'))
  .replace(/\/\*[\s\S]*?\*\//gu, '');

// Since the pair ui-b654460cad2a (sf-pagination 1.9.0, owner decision C295)
// the page row's band is the group actions bar sf-bulk-actions: the row passes
// its settings to the bar and turns the bar's events into its own, so a host
// that listens for sf-pagination-apply and -selection-clear is served as before.
test('the panel is there while rows are marked, and not there otherwise', async () => {
  const markup = await read('src/smart/pagination/js/templates/default.js');

  assert.match(
    markup,
    /\$\{context\.bottom && context\.showActions && context\.actions\?\.length && context\.selectedCount > 0/u,
    'nothing marked, no panel',
  );
  assert.match(markup, /<sf-bulk-actions[\s\S]*?label=\$\{context\.actionsRegionLabel\}/u, 'the bar is the region, named');
  assert.match(markup, /count=\$\{String\(context\.selectedCount\)\}/u, 'the bar says how many are marked');
  const marked = await render(await pagination({selectedCount: 2, actions: 'archive:Archive'}));
  assert.match(marked.markup, /<sf-bulk-actions[^>]*\scount=2\s/u);
  const none = await render(await pagination({selectedCount: 0, actions: 'archive:Archive'}));
  assert.doesNotMatch(none.markup, /<sf-bulk-actions/u);
});

test('the panel carries the actions, «all N» and the cross', async () => {
  const markup = await read('src/smart/pagination/js/templates/default.js');

  assert.match(markup, /\.actions=\$\{context\.bulkActions\}/u, 'the actions in the bar\'s shape');
  assert.match(markup, /@sf-bulk-actions-action=\$\{\(event\) => component\.applyBulkAction\(event\)\}/u, 'an action is the row\'s apply');
  assert.match(markup, /@sf-bulk-actions-select-all=\$\{\(\) => component\.setActionForAll\(true\)\}/u, '«all N» is the for-all of before');
  assert.match(markup, /@sf-bulk-actions-clear=\$\{\(\) => component\.clearSelection\(\)\}/u, 'and the cross drops the selection');
  // The band never asked a question; a host that asks its own (confirm_required)
  // keeps doing so: the bar's actions say confirm false, a deleting one is danger.
  const bar = await pagination({selectedCount: 2, actions: 'archive:Archive|delete:Delete'});
  assert.deepEqual(bar.bulkActions.map(({id, status, confirm}) => ({id, status, confirm})), [
    {id: 'archive', status: '', confirm: false}, {id: 'delete', status: 'danger', confirm: false},
  ]);
});

test('the cross announces the end of a selection it does not own', async () => {
  const [pagination, view] = await Promise.all([
    read('src/smart/pagination/index.js'),
    read('src/smart/view/index.js'),
  ]);

  // The rows hold the selection. A page row carrying the band says it is over
  // and the view passes the word to the table; the band in the card asks the
  // view directly. Neither keeps a copy that could drift from the boxes.
  assert.match(
    pagination,
    // sf-pagination 1.5.0 (C97) first notes the band's event as a compatible
    // footer part (noteFooterEvent), then sends it.
    /clearSelection\(\) \{\s*(?:this\.noteFooterEvent\("selection-clear"\);\s*)?this\.sfEmit\("selection-clear", \{/u,
  );
  // By the page row's name since standard 1.3.8 (sf-pagination-selection-clear).
  assert.match(view, /"sf-pagination-apply", "sf-pagination-load-more",\s*"sf-pagination-selection-clear",/u, 'the view listens for it');
  assert.match(
    view,
    /clearSelection\(\) \{\s*this\.table\?\.clearSelection\?\.\(\);/u,
  );
  assert.match(view, /if \(event\.type === "sf-pagination-selection-clear"\) return this\.clearSelection\(\);/u);
  assert.doesNotMatch(pagination, /_selectedIds|selectionSet/u, 'the pagination keeps no selection of its own');
});

test('every word in the panel is an attribute a host can translate', async () => {
  const [pagination, manifest] = await Promise.all([
    read('src/smart/pagination/index.js'),
    read('src/smart/pagination/smart.manifest.json'),
  ]);
  const declared = JSON.parse(manifest);

  for (const [attribute, accessor] of [
    ['action-choose-label', 'actionChooseLabel'],
    ['actions-region-label', 'actionsRegionLabel'],
    ['clear-selection-label', 'clearSelectionLabel'],
  ]) {
    assert.match(pagination, new RegExp(`attribute: "${attribute}"`, 'u'), `${attribute} is an attribute`);
    assert.ok(attribute in declared.inputs.properties, `${attribute} is declared in the manifest`);
    // This component builds its template context from `this.<name>`, so a
    // declared prop without a getter reaches the template as undefined — which
    // is how the first attempt shipped an empty placeholder.
    assert.match(
      pagination,
      new RegExp(`get ${accessor}\\(\\) \\{\\s*return[\\s\\S]*?getAttribute\\("${attribute}"\\)`, 'u'),
      `${accessor} is read through a getter`,
    );
  }
  assert.ok('sf-selection-clear' in declared.events, 'and the event is announced');
});

test('the band is the last strip of the card, and it is the card that places it', async () => {
  const [css, view] = await Promise.all([styles(), read('src/smart/view/index.js')]);

  // Three answers in three pairs. A panel floating at the bottom of the window
  // (2026-10-03) did not read as part of the table. Sticky inside the page row
  // (2026-10-04) made the whole row float over its own last rows, because a
  // sticky box cannot leave the box that contains it. So the card places the
  // band: the data view slots it into its own layout, which is what runs past
  // the bottom of the window, and only the band sticks.
  assert.match(css, /^\.sf-pagination-actions \{/mu, 'the band is not scoped to the page row any more');
  assert.doesNotMatch(css, /\.sf-pagination:has\(\.sf-pagination-actions\)/u, 'and the row itself does not stick');
  assert.match(css, /box-shadow: var\(--sf-shadow-raised\);/u, 'a shadow upwards, over the rows');
  // Since the pair ui-1ed6b6c9a040 (C273 layer order) the line is written in two
  // places: its width and style with the band, its colour in the colour layer.
  assert.ok(
    /border-block-start: var\(--sf-px\) solid var\(--sf-pagination-actions--border-color\);/u.test(css)
      || (/border-block-start-width: var\(--sf-px\);\s*border-block-start-style: solid;/u.test(css)
        && /\.sf-pagination-actions \{[^}]*border-block-start-color: var\(--sf-pagination-actions--border-color\);/u.test(css)),
    'and a line where the band starts',
  );
  assert.match(css, /--sf-pagination-actions--background-color: var\(--sf-surface-raised\);/u, 'a role the theme declares: the band floats on the raised surface (C16, C20)');
  assert.match(css, /inline-size: 100%;/u, 'the full width of the card');
  // Not the generic last row of the page: that class paints transparent at a
  // higher specificity, and the band came out see-through over the rows.
  const markup = await read('src/smart/pagination/js/templates/default.js');
  assert.doesNotMatch(markup, /"sf-pagination-bottom",\s*\n\s*"sf-pagination-actions"/u);

  assert.match(view, /<slot name="bulk"><\/slot>/u, 'the layout has a place for it');
  assert.match(
    view,
    /slot\[name="bulk"\]::slotted\(\*\) \{\s*position: sticky;\s*inset-block-end: 0;/u,
    'and the layout is what holds it at the bottom of the window',
  );
  // It lives in the light DOM because the Framework's styles do not cross a
  // shadow boundary, and the band is built from Framework components.
  assert.match(view, /this\._bulkBand\.setAttribute\("slot", "bulk"\)/u);
  // Written as an attribute: setState clears a false value by removing the
  // attribute, and a removed `bottom` means the default, which is to draw one.
  assert.match(view, /this\.pagination\?\.setAttribute\?\.\("bottom", "false"\)/u, 'so the page row stops drawing one');
});

test('nothing is chosen until someone chooses it', async () => {
  const pagination = await read('src/smart/pagination/index.js');

  // The getter used to fall through to the first enabled action, so Apply was
  // pressable the moment a row was marked — and a host's first action is as
  // likely to be "delete for ever" as anything else.
  assert.match(
    pagination,
    /get action\(\) \{[\s\S]*?return this\.actions\.find\(\(item\) => item\.selected && !item\.disabled\)\?\.value \|\| "";/u,
    'only an action the host marked, or none',
  );
  assert.doesNotMatch(
    pagination,
    /this\.actions\.find\(\(item\) => !item\.disabled\)\?\.value/u,
    'never simply the first one in the list',
  );
  // Choosing the entry at the top of the list has to be able to undo a choice.
  assert.match(
    pagination,
    /setAction\(action\) \{[\s\S]*?if \(value === previous\) \{\s*return this;/u,
    'an empty choice is a choice, not a no-op',
  );
  assert.match(pagination, /applyAction\(\) \{\s*if \(!this\.action\) \{\s*return this;/u, 'and apply refuses without one');
});
