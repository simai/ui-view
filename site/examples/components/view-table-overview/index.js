// The table is fed directly: columns, then rows. Each column names the type of
// its values, and the table draws the cell for that type: a link to a record,
// a choice as a coloured tag, a date, an amount, a file. «Изменён» is a date
// and time drawn relative to today (variant "relative"), the full date in the
// cell's tooltip.
const ago = (days, hour) => {
  const at = new Date();
  at.setDate(at.getDate() - days);
  at.setHours(hour, 15, 0, 0);
  return at.toISOString();
};
const initializeContracts = async () => {
  await customElements.whenDefined('sf-view-table');
  const table = document.querySelector('#contracts-table');
  if (!table || table.dataset.exampleReady === 'true') return;
  table.dataset.exampleReady = 'true';

  table.setColumns([
    {key: 'number', label: 'Номер', role: 'title', sortable: true},
    {key: 'client', label: 'Клиент', propertyType: 'record', sortable: true},
    {key: 'status', label: 'Состояние', propertyType: 'choice', options: [
      {value: 'draft', label: 'Черновик', scheme: 'neutral'},
      {value: 'signing', label: 'На подписи', scheme: 'warning'},
      {value: 'active', label: 'Действует', scheme: 'success'},
      {value: 'closed', label: 'Закрыт', scheme: 'neutral'},
    ]},
    {key: 'amount', label: 'Сумма, ₽', propertyType: 'number', sortable: true},
    {key: 'signed', label: 'Подписан', propertyType: 'date', sortable: true},
    {key: 'file', label: 'Файл', propertyType: 'file'},
    {key: 'updated', label: 'Изменён', propertyType: 'datetime', variant: 'relative', sortable: true},
  ]);
  table.setRows([
    {id: 'c-1041', updated: ago(0, 10), number: 'Д-1041', client: {value: 'k-12', label: 'ООО «Северный ветер»', href: '#k-12'}, status: 'active', amount: 1250000, signed: '2026-09-14', file: {value: 'f-1', label: 'Д-1041.pdf', mime: 'application/pdf', href: '#f-1'}},
    {id: 'c-1042', updated: ago(1, 16), number: 'Д-1042', client: {value: 'k-07', label: 'АО «Техносфера»', href: '#k-07'}, status: 'signing', amount: 480000, signed: null, file: {value: 'f-2', label: 'Д-1042.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', href: '#f-2'}},
    {id: 'c-1043', updated: ago(3, 9), number: 'Д-1043', client: {value: 'k-21', label: 'ИП Соколова М. А.', href: '#k-21'}, status: 'draft', amount: 96000, signed: null, file: null},
    {id: 'c-1044', updated: ago(12, 11), number: 'Д-1044', client: {value: 'k-03', label: 'ООО «Гранит-Строй»', href: '#k-03'}, status: 'active', amount: 3720000, signed: '2026-08-02', file: {value: 'f-4', label: 'Д-1044.pdf', mime: 'application/pdf', href: '#f-4'}},
    {id: 'c-1045', updated: ago(70, 14), number: 'Д-1045', client: {value: 'k-15', label: 'ООО «Лента данных»', href: '#k-15'}, status: 'closed', amount: 215500, signed: '2026-03-27', file: {value: 'f-5', label: 'Д-1045.pdf', mime: 'application/pdf', href: '#f-5'}},
  ]);
};

initializeContracts();
