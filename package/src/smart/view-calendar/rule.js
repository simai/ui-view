// Generated from component.json by scripts/generate-component-files.mjs; do not edit.
// The calendar draws its bar with sf-button(-icon) and sf-segmented, its grids itself, its list rows
// with sf-checkbox and the Framework field renderers' cell output; menus, toasts and the date window come later.
SF.RuleLoader['cl-view-calendar'] = {
  tags: ['sf-view-calendar'],
  type: 'smart',
  mode: 'smart',
  js: true,
  css: true,
  relation: [
    { name: 'icons' },
    // The modes Месяц, Неделя, День, Список in the bar.
    { name: 'cl-segmented' },
    // «Сегодня», «Без даты N», «+N».
    { name: 'cl-button' },
    // ‹ ›, «+» in a day, the close of the «Без даты» column.
    { name: 'cl-button-icon' },
    { name: 'cl-badge' },
    // The selection box of a list row.
    { name: 'cl-checkbox' },
    // A refused move.
    { name: 'cl-toast', lazy: true },
    // The event menu and the day list of «+N» (SF.menu.open).
    { name: 'cl-menu-context', lazy: true },
    // The «Перенести на…» window (the panel without its field).
    { name: 'cl-input-date', lazy: true },
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
