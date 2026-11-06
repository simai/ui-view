// Generated from component.json by scripts/generate-component-files.mjs; do not edit.
// The block draws its answers as sf-button, its glyphs as sf-icon, and every
// field through the Framework field renderers: the relations are those, as
// sf-view-properties fetches them, less what only the record component draws
// (the drawer, the tree, the arranging, the related lists).
SF.RuleLoader['cl-view-flow'] = {
  tags: ['sf-view-flow'],
  type: 'smart',
  mode: 'smart',
  js: true,
  css: true,
  relation: [
    { name: 'icons' },
    // The status glyph and a collapsible group's chevron are sf-icon; a tag the
    // block renders is a tag it fetches.
    { name: 'cl-icon' },
    // Send and Cancel.
    { name: 'cl-button' },
    // Below: what the Framework field renderers draw for a value shown or edited,
    // as sf-view-properties fetches them. The block draws every field through
    // the renderer set (view-properties/js/field-value.js), so a tag the set
    // emits is a tag the block fetches.
    { name: 'cl-avatar' },
    { name: 'cl-badge' },
    { name: 'cl-tag' },
    { name: 'cl-reference-link' },
    { name: 'cl-progress-scale' },
    { name: 'cl-file-preview' },
    { name: 'cl-input-color' },
    { name: 'cl-input-country' },
    // A field's hint beside its label.
    { name: 'cl-help-mark' },
    { name: 'cl-list-item' },
    { name: 'cl-spinner' },
    { name: 'cl-slider-range', lazy: true },
    // Below, not lazy: the controls a block asking for fields draws at once.
    // Fetched later, a control drawn by the block stays empty until its code
    // comes and every field below it moves down (first-paint gate at 390 px,
    // 2026-11-06); a block in a flow mostly asks, so they come with it.
    { name: 'cl-input' },
    { name: 'cl-input-textarea' },
    { name: 'cl-dropdown' },
    { name: 'cl-input-date' },
    { name: 'cl-switch' },
    { name: 'cl-checkbox' },
    { name: 'cl-button-group', lazy: true },
    // A number with variant stepper.
    { name: 'cl-input-quantity' },
    // An html field edited.
    { name: 'cl-input-rich', lazy: true },
    // A single image shown or replaced.
    { name: 'cl-input-image', lazy: true },
    // A password field's show/hide.
    { name: 'cl-button-icon', lazy: true },
  ],
};
