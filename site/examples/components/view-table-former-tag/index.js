// The former tag sf-table is a dated alias of sf-view-table until 2027-01-01:
// old markup keeps working, and SF.deprecations notes each use.
const initializeFormerTag = async () => {
  await customElements.whenDefined('sf-table');
  const table = document.querySelector('#former-tag-table');
  if (!table || table.dataset.exampleReady === 'true') return;
  table.dataset.exampleReady = 'true';
  table.setColumns([
    {key: 'tag', label: 'Прежний тег', role: 'title'},
    {key: 'now', label: 'Новый тег'},
    {key: 'until', label: 'Работает до', propertyType: 'date'},
  ]);
  table.setRows([
    {id: 'a-1', tag: 'sf-data-view', now: 'sf-view', until: '2027-01-01'},
    {id: 'a-2', tag: 'sf-table', now: 'sf-view-table', until: '2027-01-01'},
    {id: 'a-3', tag: 'sf-property-view', now: 'sf-view-properties', until: '2027-01-01'},
  ]);
};

initializeFormerTag();
