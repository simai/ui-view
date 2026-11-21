// Generated from component.json by scripts/generate-component-files.mjs; do not edit.
// sf-view had no rule either, so its tag loaded nothing and every consumer
// added the script by hand. Found while fixing the same gap in sf-view-properties.
// The relations are what the composite itself composes; the table brings its own
// through cl-view-table.
SF.RuleLoader['cl-view'] = {
  tags: ['sf-view', 'sf-data-view'],
  type: 'smart',
  mode: 'smart',
  js: true,
  css: true,
  relation: [
    { name: 'icons' },
    { name: 'cl-view-table' },
    { name: 'cl-pagination' },
    { name: 'cl-toast', lazy: true },
    { name: 'cl-button' },
    { name: 'cl-checkbox' },
    // The group actions bar (C295) where the pair has it: drawn while something is selected, fetched when first drawn.
    { name: 'cl-bulk-actions', lazy: true },
    { name: 'cl-dropdown' },
    { name: 'cl-button-icon' },
    // C97 (5): the footer's page-size menu is the view's own (it was sf-pagination's compatible footer's); sf-spinner is the wait while the host counts.
    { name: 'cl-menu-context' },
    { name: 'cl-spinner' },
    // The list head (head="list", C297, C299-C301): the display kind, the count, the search and the windows are Framework parts; the sheets, tabs, radios and icons of its windows come when a window opens.
    { name: 'cl-segmented' },
    { name: 'cl-badge' },
    { name: 'cl-input' },
    { name: 'cl-popover' },
    { name: 'cl-drawer', lazy: true },
    { name: 'cl-tabs', lazy: true },
    { name: 'cl-radio', lazy: true },
    { name: 'cl-icon', lazy: true },
    // «Вид» of the list head is sf-settings in its drill look, applying each row at once (owner decision C405, view round 14).
    { name: 'cl-settings', lazy: true },
    // The utility classes its templates write, asked for with the component (SIMAI Framework loader: a Framework component gets them from template-utilities.generated.json, a package component names them here); fetched after the first paint, they moved the drawn parts -- the bulk band's gap came 0 -> 8 and the band 8 px down some 150 ms in (View 1.8.1 acceptance, queue #172). The list is scripts/generate-template-utilities.mjs run over the overlay.
    { name: 'align-items/default' },
    { name: 'display/default' },
    { name: 'flex-direction/default' },
    { name: 'flex-wrap/default' },
    { name: 'gap/default' },
    { name: 'justify-content/default' },
    { name: 'margin/default' },
    { name: 'position/default' },
    { name: 'table/default' },
  ],
};
