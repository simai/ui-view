// The same rows at both steps of the size ladder, and with two public CSS
// variables set by the page.
customElements.whenDefined('sf-view-table').then(() => {
  document.querySelectorAll('[data-sizes]').forEach((table) => {
    table.setColumns([
      {key: 'name', label: 'Склад', role: 'title'},
      {key: 'city', label: 'Город'},
      {key: 'positions', label: 'Позиций', propertyType: 'number'},
    ]);
    table.setRows([
      {id: 1, name: 'Подольск', city: 'Московская область', positions: 128},
      {id: 2, name: 'Шушары', city: 'Санкт-Петербург', positions: 128},
      {id: 3, name: 'Казань', city: 'Республика Татарстан', positions: 128},
    ]);
  });
});
