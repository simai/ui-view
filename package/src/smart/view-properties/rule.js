// Generated from component.json by scripts/generate-component-files.mjs; do not edit.
// Without this the tag loads nothing: the loader derives a script path from a
// registered rule, and no Smart composite had one -- not this component and not
// sf-view, which is why a consumer was adding the script by hand. The
// relations are the components the field renderer set can emit, plus `icons`,
// because a reference link's arrow arrives as a glyph name and shows as the word
// `arrow_forward` when the icon font is not on the page.
SF.RuleLoader['cl-view-properties'] = {
  tags: ['sf-view-properties', 'sf-property-view'],
  type: 'smart',
  mode: 'smart',
  js: true,
  css: true,
  relation: [
    { name: 'icons' },
    // The panel draws an <sf-icon> of its own now -- the chevron that folds the
    // not-placed bin -- and a tag the panel renders is a tag the panel has to
    // fetch, whatever else on the page may already have fetched it.
    { name: 'cl-icon' },
    { name: 'cl-button' },
    { name: 'cl-button-icon' },
    { name: 'cl-drawer' },
    { name: 'cl-avatar' },
    { name: 'cl-badge' },
    { name: 'cl-tag' },
    // The not-placed bin is the Framework's accordion, and a component this one
    // renders is a component this one fetches.
    { name: 'accordion' },
    { name: 'cl-reference-link' },
    // The views are chosen, made, renamed and removed in the profile picker
    // (owner, 2026-10-14), drawn while the view is arranged.
    { name: 'cl-profile-picker', lazy: true },
    // «Copy link» is sf-button-copy (owner, 2026-10-14).
    { name: 'cl-button-copy' },
    // The panel's close is sf-button-close, last in the panel's head (C14, C157 (6)).
    { name: 'cl-button-close' },
    // A record that could not load says why in sf-empty-state.
    { name: 'cl-empty-state' },
    { name: 'cl-progress-scale' },
    // A number with a range draws sf-slider-range, from the shared renderer set.
    { name: 'cl-slider-range', lazy: true },
    { name: 'cl-file-preview' },
    { name: 'cl-file-upload', lazy: true },
    { name: 'cl-progress-bar', lazy: true },
    { name: 'cl-input', lazy: true },
    { name: 'cl-input-textarea', lazy: true },
    { name: 'cl-dropdown', lazy: true },
    // A record, a relation, a user and a paged lookup are edited in sf-input-lookup
    // (field-renderers 1.9.0, owner decision C139 (1)): a search over the host's
    // pages with a picture and a caption per row. Without the relation the field
    // would hold an element that never upgrades.
    { name: 'cl-input-lookup', lazy: true },
    { name: 'cl-input-date', lazy: true },
    { name: 'cl-switch', lazy: true },
    { name: 'cl-checkbox', lazy: true },
    { name: 'cl-segmented', lazy: true },
    { name: 'cl-list-item' },
    { name: 'cl-spinner' },
    // Configuring the view drags fields between groups and groups between
    // sections, and the drag is sf-sortable's. Without the relation the lists
    // would render as undefined elements -- present in the DOM, inert to a
    // pointer, and indistinguishable from a feature that silently does nothing.
    { name: 'cl-sortable', lazy: true },
    // A colour property draws sf-input-color, in a cell and in a card alike.
    { name: 'cl-input-color' },
    // A string whose variant is a phone draws sf-input-country. The rule fence
    // reads a component's own templates, and this element comes from the shared
    // renderer set instead -- so nothing would have caught its absence until a
    // page showed an element that never upgraded.
    { name: 'cl-input-country' },
    // A field's hint beside its label is sf-help-mark, a button that opens the
    // words on a press. It was a glyph carrying them in a native title, which
    // needs a hover and left a touch device with no way to read the hint at all
    // (Larena storage QA, 2026-10-22). sf-tooltip was tried first and is the
    // wrong half of the pair: it is the bubble itself rather than a wrapper
    // around a trigger, so wrapping the glyph in one printed the hint as text
    // beside the label.
    { name: 'cl-help-mark' },
    // A group of related records composes a data view, which brings its own table
    // and page row through cl-view. Without the relation the group would hold
    // an undefined element: present, empty, and indistinguishable from a host that
    // answered with no records.
    { name: 'cl-view', lazy: true },
    // The table the related group slots into that data view. Slotted rather than
    // left to the data view's own fallback, because fallback content lives in a
    // shadow tree where the page's stylesheets do not reach -- a consumer saw a
    // list with its icon ligatures showing as text.
    { name: 'cl-view-table', lazy: true },
    // Every anchored surface this panel opens -- a field's settings, the list of
    // fields an area can take, the head's menu -- is an sf-popover.
    { name: 'cl-popover', lazy: true },
    // The sections are tabs either way: a row above the groups, or vertical
    // tabs beside them (decision C96 point 5).
    { name: 'cl-tabs' },
    // A record to read is a description list: the label beside the value,
    // each group a heading of the list (C289 (4)).
    { name: 'cl-list-description' },
    // The phone's list of sections is sf-list rows (C289 (5)).
    { name: 'cl-list' },
    // The loading skeleton's bars (.sf-skeleton) come with the panel: found
    // by the Loader's class scan after the first paint, they grew the
    // skeleton groups from 95 to 175 px some 550 ms in (CLS 0.074 at 390,
    // C289 (8)).
    { name: 'skeleton' },
    // A host's confirmation of a save is asked in place with sf-confirm
    // (C289 (7), C182).
    { name: 'cl-confirm' },
    // The full screen's sections column is sf-menu until sf-tabs 1.4.4 (VP-26, C305 (3)).
    { name: 'cl-menu' },
    // The record's history is sf-list-timeline (C305 (2)).
    { name: 'cl-list-timeline', lazy: true },
    // A group is edited in sf-form when it draws every field of it (C182, C305 (1)).
    { name: 'cl-form', lazy: true },
    // The utility classes its templates write, asked for with the component (SIMAI Framework loader: a Framework component gets them from template-utilities.generated.json, a package component names them here); fetched after the first paint, they moved the drawn parts -- the bulk band's gap came 0 -> 8 and the band 8 px down some 150 ms in (View 1.8.1 acceptance, queue #172). The list is scripts/generate-template-utilities.mjs run over the overlay.
    { name: 'align-items/default' },
    { name: 'align-self/default' },
    { name: 'background-color/default' },
    { name: 'container/default' },
    { name: 'cursor/default' },
    { name: 'display/default' },
    { name: 'flex-direction/default' },
    { name: 'flex-grow/default' },
    { name: 'flex-wrap/default' },
    { name: 'flex/default' },
    { name: 'gap/default' },
    { name: 'justify-content/default' },
    { name: 'min-height/default' },
    { name: 'min-width/default' },
    { name: 'overflow/default' },
    { name: 'padding/default' },
    { name: 'position/default' },
    { name: 'sr-only/default' },
    { name: 'text-align/default' },
    { name: 'text-color/default' },
    { name: 'visibility/default' },
    { name: 'width/default' },
  ],
};
