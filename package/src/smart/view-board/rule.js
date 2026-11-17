// Generated from component.json by scripts/generate-component-files.mjs; do not edit.
// The board draws its lanes with sf-sortable, sf-badge and sf-button(-icon), its cards as .sf-card
// with sf-checkbox and the Framework field renderers' cell output; menus, tabs and toasts come later.
SF.RuleLoader['cl-view-board'] = {
  tags: ['sf-view-board'],
  type: 'smart',
  mode: 'smart',
  js: true,
  css: true,
  relation: [
    { name: 'icons' },
    // Drag, long press, the drop line, the keyboard move and its announcements (C171).
    { name: 'cl-sortable' },
    // A card is the Framework .sf-card.
    { name: 'card' },
    // The lane's name, a tonal badge of its option's colour (C140); a choice value on a card.
    { name: 'cl-badge' },
    { name: 'cl-button' },
    { name: 'cl-button-icon' },
    { name: 'cl-checkbox' },
    // The lane switcher on a phone (C304 (1)).
    { name: 'cl-tabs', lazy: true },
    // A refused move.
    { name: 'cl-toast', lazy: true },
    // The card menu and the lane menu (SF.menu.open).
    { name: 'cl-menu-context', lazy: true },
    // Below: what the Framework field renderers draw in the «Кратко» place.
    { name: 'cl-avatar' },
    { name: 'cl-tag' },
    { name: 'cl-reference-link' },
    { name: 'cl-progress-scale' },
    { name: 'cl-icon' },
    // The utility classes its templates write, asked for with the component (SIMAI Framework loader: a Framework component gets them from template-utilities.generated.json, a package component names them here); fetched after the first paint, they moved the drawn parts -- the bulk band's gap came 0 -> 8 and the band 8 px down some 150 ms in (View 1.8.1 acceptance, queue #172). The list is scripts/generate-template-utilities.mjs run over the overlay.
    { name: 'align-items/default' },
    { name: 'display/default' },
    { name: 'flex-direction/default' },
    { name: 'flex-wrap/default' },
    { name: 'gap/default' },
    { name: 'min-width/default' },
    { name: 'text-color/default' },
  ],
};
