// The quick start: one table, columns and rows given directly. A table fed
// this way asks for search and sorting by events; the page answers by giving
// it the rows in the order asked.
customElements.whenDefined('sf-view-table').then(() => {
  const table = document.querySelector('#clients');
  const clients = [
    {id: 1, name: 'ООО «Северный ветер»', city: 'Мурманск', manager: 'Анна Белова', since: '2021-03-15'},
    {id: 2, name: 'АО «Волга-Логистик»', city: 'Самара', manager: 'Илья Орлов', since: '2019-11-02'},
    {id: 3, name: 'ИП Соколова Ю. А.', city: 'Казань', manager: 'Анна Белова', since: '2024-06-20'},
    {id: 4, name: 'ООО «Уральские окна»', city: 'Екатеринбург', manager: 'Мария Котова', since: '2022-01-10'},
    {id: 5, name: 'ООО «Байкал-Тур»', city: 'Иркутск', manager: 'Олег Смирнов', since: '2023-09-04'},
  ];
  let search = '';
  let sort = null;
  const show = () => {
    let rows = clients.filter((client) => `${client.name} ${client.city} ${client.manager}`.toLowerCase().includes(search));
    if (sort?.direction) {
      const sign = sort.direction === 'desc' ? -1 : 1;
      rows = [...rows].sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key]), 'ru') * sign);
    }
    table.setRows(rows);
  };

  table.setColumns([
    {key: 'name', label: 'Клиент', role: 'title', sortable: true},
    {key: 'city', label: 'Город', sortable: true},
    {key: 'manager', label: 'Менеджер'},
    {key: 'since', label: 'Клиент с', propertyType: 'date', sortable: true},
  ]);
  table.addEventListener('sf-view-table-search-change', (event) => { search = event.detail.search.trim().toLowerCase(); show(); });
  table.addEventListener('sf-view-table-sort-change', (event) => { sort = event.detail; show(); });
  show();
});
