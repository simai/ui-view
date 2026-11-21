// Generated from component.json by scripts/generate-component-files.mjs; do not edit.
SF.RuleLoader['cl-view-table'] = {
  tags: ['sf-view-table', 'sf-table'],
  type: 'smart',
  mode: 'smart',
  js: true,
  css: true,
  relation: [
    // The View package core (view-common): the shared code every View bundle takes once (field renderers, formats, conditions, the filter window, and what two View components share), fetched before the component runs.
    { name: 'cl-view-common' },
    { name: 'cl-checkbox' },
    // The group actions bar (C295) where the pair has it: drawn while something is selected, fetched when first drawn.
    { name: 'cl-bulk-actions', lazy: true },
    // The cells drawn with another Smart element come with the table, not
    // after the rows: a reference (sf-reference-link), a file
    // (sf-file-preview) and a colour (sf-input-color, in a cell as well as in a
    // card). Fetched lazily, each upgraded some 600 ms after the rows had
    // drawn and moved the row (stand 24: CLS 0.0145 at 1280 when the data
    // arrived).
    { name: 'cl-reference-link' },
    { name: 'cl-file-preview' },
    { name: 'cl-input-color' },
    // A string whose variant is a phone draws sf-input-country. The rule fence
    // reads a component's own templates, and this element comes from the shared
    // renderer set instead -- so nothing would have caught its absence until a
    // page showed an element that never upgraded.
    { name: 'cl-input-country', lazy: true },
    { name: 'cl-button' },
    { name: 'cl-button-icon' },
    { name: 'icons' },
    { name: 'cl-input' },
    { name: 'cl-tag' },
    { name: 'cl-pagination' },
    { name: 'cl-spinner' },
    // A table without rows says why in sf-empty-state (owner, 2026-10-14).
    { name: 'cl-empty-state' },
    { name: 'cl-input-date', lazy: true },
    { name: 'cl-dropdown' },
    // The filter window's tabs, «Представления» and «Поля» (owner, 2026-10-14; named after view-config/1 in view round 8).
    { name: 'cl-tabs', lazy: true },
    // The gear's window is sf-settings in its panel look, «Поля» and «Вид» (owner decision C106).
    { name: 'cl-settings', lazy: true },
    { name: 'cl-menu-context', lazy: true },
    // The windows' lists are reordered with sf-sortable (owner, 2026-10-13).
    { name: 'cl-sortable', lazy: true },
    // The filter window's templates are a radio list: a page with nothing else
    // using sf-radio drew its rows empty (owner, 2026-10-14).
    { name: 'cl-radio', lazy: true },
    // A column's edge is the Framework's resize gesture (owner, 2026-10-14).
    { name: 'cl-resizer', lazy: true },
    { name: 'cl-avatar' },
    { name: 'cl-badge' },
    { name: 'cl-list-item' },
    { name: 'cl-modal', lazy: true },
    { name: 'cl-slider-range', lazy: true },
    // The list of resources (C31): the status dot is the dot component's class markup.
    { name: 'dot' },
    // The status word, a fact's note and a quick action's name are the Framework tooltip (its anchor and data-tooltip), shown on hover and on keyboard focus: behaviour, fetched after the page is ready.
    { name: 'tooltip', lazy: true },
    // The layout switch in the toolbar (C31).
    { name: 'cl-segmented' },
    // The utility classes its templates write, asked for with the component (SIMAI Framework loader: a Framework component gets them from template-utilities.generated.json, a package component names them here); fetched after the first paint, they moved the drawn parts -- the bulk band's gap came 0 -> 8 and the band 8 px down some 150 ms in (View 1.8.1 acceptance, queue #172). The list is scripts/generate-template-utilities.mjs run over the overlay.
    { name: 'align-items/default' },
    { name: 'border-collapse/default' },
    { name: 'border-spacing/default' },
    { name: 'cursor/default' },
    { name: 'display/default' },
    { name: 'element-position/default' },
    { name: 'flex-direction/default' },
    { name: 'flex-wrap/default' },
    { name: 'flex/default' },
    { name: 'gap/default' },
    { name: 'height/default' },
    { name: 'justify-content/default' },
    { name: 'margin/default' },
    { name: 'max-width/default' },
    { name: 'min-height/default' },
    { name: 'min-width/default' },
    { name: 'overflow/default' },
    { name: 'padding/default' },
    { name: 'pointer-events/default' },
    { name: 'position/default' },
    { name: 'table-layout/default' },
    { name: 'table/default' },
    { name: 'text-max-width/default' },
    { name: 'text-overflow/default' },
    { name: 'transition-property/default' },
    { name: 'user-select/default' },
    { name: 'visibility/default' },
    { name: 'width/default' },
    { name: 'z-index/default' },
  ],
};
