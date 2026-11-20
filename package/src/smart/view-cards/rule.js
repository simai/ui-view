// Generated from component.json by scripts/generate-component-files.mjs; do not edit.
// The cards draw their grid of .sf-card with sf-checkbox, sf-button-icon and the Framework field renderers' cell output;
// «Показать ещё» is sf-pagination (more), an empty list sf-empty-state; menus come later.
SF.RuleLoader['cl-view-cards'] = {
  tags: ['sf-view-cards'],
  type: 'smart',
  mode: 'smart',
  js: true,
  css: true,
  relation: [
    { name: 'icons' },
    // A card is the Framework .sf-card.
    { name: 'card' },
    { name: 'cl-checkbox' },
    // The group actions bar (C295) where the pair has it: drawn while something is selected, fetched when first drawn.
    { name: 'cl-bulk-actions', lazy: true },
    { name: 'cl-button' },
    { name: 'cl-button-icon' },
    // The cover of a record without a picture: the file type's icon or «Нет фото».
    { name: 'cl-icon' },
    // «Показать ещё 24» and «Показано 24 из 40»: sf-pagination in its more look (C167, C306).
    { name: 'cl-pagination' },
    // No records, nothing found, no access, a failed load (CD-8).
    { name: 'cl-empty-state' },
    // Cards of the same lengths while the records come.
    { name: 'cl-skeleton' },
    // The card menu (SF.menu.open).
    { name: 'cl-menu-context', lazy: true },
    // Below: what the Framework field renderers draw in the «Кратко» place.
    { name: 'cl-badge' },
    { name: 'cl-avatar' },
    { name: 'cl-tag' },
    { name: 'cl-reference-link' },
    { name: 'cl-progress-scale' },
  ],
};
