// The live example of a «Свойства» page (examples/properties/<type>/index.js,
// written by scripts/build-properties.mjs with `const TYPE = '<type>';` and
// scripts/property-catalogue.js before this text). It shows the type's fields
// in the set's real components, as C290 (3) and (4) ask:
//
//   - a table cell and a filter field: an sf-view-table inside an sf-view
//     (simai.dataview-port query.change), the type's first field offered as
//     the table's filter field;
//   - shown and edited: an sf-view-properties card to read and one to edit,
//     talking to a small host (simai.property-view-port: record.load,
//     record.save, field.options, field.upload); what the host received on
//     save is written under the cards;
//   - the states: empty (the third record), error (a message under the
//     field), read-only (the host marks every field readonly) and phone (the
//     table and the card in a box as wide as a phone).
//
// TYPE 'all' is the section's overview: the first field of every type, the
// table and the two cards, without the states.

const ALL = TYPE === 'all';
const fieldsOf = () => {
  if (!ALL) return CATALOGUE[TYPE].fields;
  return Object.values(CATALOGUE).map((entry) => entry.fields[0]);
};
const FIELDS = fieldsOf();
const NAMES = ['Первая запись', 'Вторая запись', 'Пустые значения'];
const records = NAMES.map((name, index) => ({
  id: `r-${index + 1}`,
  name,
  revision: 1,
  values: Object.fromEntries(FIELDS.map(([field, values]) => [field.key, structuredClone(values[index] ?? null)])),
}));

const columns = () => [
  {key: 'name', label: 'Запись', role: 'title'},
  ...FIELDS.map(([field]) => {
    const {width, placeholder, searchPlaceholder, uploadText, uploadHint, required, ...column} = field;
    return column;
  }),
];
const rows = () => records.map((record) => ({id: record.id, name: record.name, ...record.values}));
const TITLE = ALL ? 'Все типы' : 'Свойства';

const cardOf = (record, {readonly = false} = {}) => ({
  record_id: record.id,
  collection: 'demo.properties',
  revision: String(record.revision),
  label: record.name,
  actions: readonly ? [] : ['record.edit'],
  sections: [{key: 'main', label: TITLE, groups: [{
    key: 'fields', label: TITLE, columns: 2,
    fields: FIELDS.map(([field]) => ({width: 'half', ...field, ...(readonly ? {readonly: true} : {}), value: record.values[field.key]})),
  }]}],
});

// Numbers in Russian style with the field's precision; the unit is the
// renderer's and follows.
const formatFieldValue = (field, value) => {
  const type = field?.propertyType ?? field?.property_type ?? field?.type;
  if (value == null || value === '') return undefined;
  if ((type === 'number' || type === 'integer') && typeof value === 'number' && !['scale', 'meter'].includes(field?.variant)) {
    const digits = type === 'integer' ? 0 : field?.precision;
    return new Intl.NumberFormat('ru-RU', digits == null ? {} : {minimumFractionDigits: digits, maximumFractionDigits: digits}).format(value);
  }
  return undefined;
};

const shown = (value) => JSON.stringify(value, (key, item) => (typeof item === 'string' && item.startsWith('data:') ? 'data:…' : item));

const viewHost = () => ({
  version: '1.12.0',
  capabilities: [],
  async raise(intent, payload) {
    if (intent !== 'query.change') return {answer: 'unavailable', reason: 'capability-not-provided'};
    const {query} = payload;
    return {answer: 'applied', sequence: payload.sequence, data: {
      columns: columns(), records: rows(), total: records.length,
      echo: {filters_chosen: query.filters, filters: query.filters, filters_rejected: [], search: query.search, sort: query.sort, page: query.page, per_page: query.per_page},
    }};
  },
  formatFieldValue,
});

const cardHost = ({log, onSaved, readonly = false}) => ({
  version: '1.17.0',
  capabilities: readonly ? [] : ['field-options', 'field-upload'],
  async raise(intent, payload) {
    const record = records.find((item) => item.id === payload?.record_id) ?? records[0];
    if (intent === 'record.load') return {answer: 'applied', record: cardOf(record, {readonly})};
    if (!readonly && (intent === 'record.save' || intent === 'group.save')) {
      Object.assign(record.values, payload.values);
      record.revision += 1;
      if (log) log.textContent = `Хост получил: ${shown(payload.values)}`;
      onSaved?.();
      return {answer: 'applied', record: cardOf(record), revision: String(record.revision)};
    }
    if (intent === 'field.options') {
      const search = String(payload.search ?? '').toLowerCase();
      const items = (OPTIONS_OF[payload.field] ?? []).filter((item) => item.label.toLowerCase().includes(search));
      return {answer: 'applied', options_page: {items, next_cursor: null, total: items.length}};
    }
    if (intent === 'field.upload') {
      const file = payload.file;
      return {answer: 'applied', file: {label: file?.name ?? 'Файл', mime: file?.type ?? '', size: file?.size ?? 0,
        href: file instanceof Blob ? URL.createObjectURL(file) : '#file'}};
    }
    if (intent === 'record.open') {
      if (log) log.textContent = `Открыть: ${payload.value?.label ?? ''}`;
      return {answer: 'applied'};
    }
    return {answer: 'unavailable', reason: 'capability-not-provided'};
  },
  formatFieldValue,
});

const start = async () => {
  const root = document.querySelector('[data-properties]');
  if (!root || root.dataset.exampleReady === 'true') return;
  root.dataset.exampleReady = 'true';
  await Promise.all(['sf-view', 'sf-view-table', 'sf-view-properties'].map((tag) => customElements.whenDefined(tag)));
  const log = root.querySelector('[data-log]');
  const views = [...root.querySelectorAll('sf-view')];
  for (const view of views) view.setHostPort(viewHost());
  // The type's first field as the table's filter field: its chip stands over
  // the table and opens the Framework's filter control for the type.
  if (!ALL) {
    const [first] = FIELDS[0];
    for (const table of root.querySelectorAll('sf-view-table')) table.setFilterFields?.([{...first}]);
  }
  const refresh = () => {
    for (const view of views) view.refresh();
    for (const card of root.querySelectorAll('sf-view-properties[mode="view"]')) card.refresh?.();
  };
  const following = [...root.querySelectorAll('sf-view-properties[data-follows]')];
  for (const card of root.querySelectorAll('sf-view-properties')) {
    const readonly = card.dataset.state === 'readonly';
    card.setHostPort(cardHost({log: card.dataset.follows !== undefined ? log : null, onSaved: refresh, readonly}));
    card.setAttribute('record-id', card.dataset.record ?? 'r-1');
  }
  // The error state: a message under the type's first field, as the host's
  // refusal or the field's own check puts it.
  const failing = root.querySelector('sf-view-properties[data-state="error"]');
  if (failing) {
    const [first] = FIELDS[0];
    // Once the record is drawn (the card's state leaves loading).
    failing.addEventListener('sf-view-properties-state', (event) => {
      if (event.detail?.state === 'loading') return;
      failing.reportFieldError?.({key: first.key}, 'Проверьте значение: приложение его не приняло');
    });
  }
  root.querySelector('[data-record-switch]')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-record]');
    if (!button) return;
    for (const item of root.querySelectorAll('[data-record]')) {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    }
    for (const card of following) card.setAttribute('record-id', button.dataset.record);
  });
};

start();
