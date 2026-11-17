// Written by scripts/build-properties.mjs from scripts/property-catalogue.js
// and scripts/property-demo.js; edit those.
const TYPE = 'lookup';

// The catalogue of the «Свойства» section: every property type of the SIMAI
// Framework field renderers' registry (SF.fieldRenderers.registry), the ones
// the set view draws itself included (money, percent, items, compound,
// ru.requisites), each with the fields an example shows and three values a
// field: one per record, the third record empty.
//
// It is plain data. scripts/build-properties.mjs reads it to write the pages
// and puts it, with scripts/property-demo.js, into every example's index.js.
// Pictures are copies of the D22 set in assets/illustrations/ (manifest.json
// there); the hex values below are colour fields' data, nothing is drawn with
// them (site lint, colour allow list «colour field data»).

// Pictures are the D22 set's copies (assets/illustrations/); scripts/build-properties.mjs
// puts the ones an example names beside it, in its pictures/ folder.
const PICTURES = 'pictures/';
const PEOPLE = [
  {value: 'u-1', label: 'Анна Белова', avatarText: 'АБ'},
  {value: 'u-2', label: 'Илья Орлов', avatarText: 'ИО'},
  {value: 'u-3', label: 'Мария Котова', avatarText: 'МК'},
  {value: 'u-4', label: 'Олег Смирнов', avatarText: 'ОС'},
  {value: 'u-5', label: 'Ирина Волкова', avatarText: 'ИВ'},
];
const CONTRACTS = [
  {value: 'c-118', label: 'Договор № 118 от 3 марта 2026', href: '#contract-118'},
  {value: 'c-204', label: 'Договор № 204 от 17 июня 2026', href: '#contract-204'},
  {value: 'c-311', label: 'Договор № 311 от 2 октября 2026', href: '#contract-311'},
];
const CLIENTS = [
  {value: 'k-1', label: 'ООО «Северный ветер»'},
  {value: 'k-2', label: 'АО «Техносфера»'},
  {value: 'k-3', label: 'ИП Кузнецова С. А.'},
];
const COUNTRIES = [
  {value: 'ru', label: 'Россия'}, {value: 'de', label: 'Германия'}, {value: 'fr', label: 'Франция'},
  {value: 'it', label: 'Италия'}, {value: 'es', label: 'Испания'}, {value: 'jp', label: 'Япония'},
];
const LANGUAGES = [
  {value: 'ru', label: 'Русский'}, {value: 'en', label: 'Английский'}, {value: 'de', label: 'Немецкий'},
  {value: 'zh', label: 'Китайский'}, {value: 'es', label: 'Испанский'},
];
const STATUS = [
  {value: 'draft', label: 'Черновик', scheme: 'neutral'},
  {value: 'review', label: 'На проверке', scheme: 'warning'},
  {value: 'active', label: 'Действует', scheme: 'success'},
  {value: 'closed', label: 'Закрыт', scheme: 'error'},
];
const PRIORITY = [{value: 'low', label: 'Низкий'}, {value: 'normal', label: 'Обычный'}, {value: 'high', label: 'Высокий'}];
const SKILLS = [
  {value: 'js', label: 'JavaScript', scheme: 'primary'}, {value: 'php', label: 'PHP', scheme: 'primary'},
  {value: 'sql', label: 'SQL', scheme: 'success'}, {value: 'ux', label: 'UX', scheme: 'warning'},
  {value: 'qa', label: 'Тестирование', scheme: 'neutral'},
];
const DAYS = [
  {value: 'mon', label: 'Понедельник'}, {value: 'tue', label: 'Вторник'}, {value: 'wed', label: 'Среда'},
  {value: 'thu', label: 'Четверг'}, {value: 'fri', label: 'Пятница'}, {value: 'sat', label: 'Суббота'},
  {value: 'sun', label: 'Воскресенье'},
];
// colour field data
const SWATCHES = ['#1d4ed8', '#0f766e', '#b45309', '#be123c', '#6d28d9', '#334155'];
const pdf = (label, size) => ({label, mime: 'application/pdf', href: '#file', size});
const picture = (label, file) => ({label, mime: 'image/svg+xml', href: `${PICTURES}${file}`, size: 1024});
const rub = (amount) => ({amount, currency: 'RUB'});
const ITEM_COLUMNS = [
  {key: 'name', label: 'Наименование', type: 'string', required: true},
  {key: 'qty', label: 'Кол-во', type: 'number'},
  {key: 'price', label: 'Цена', type: 'money', settings: {currency: 'RUB'}},
  {key: 'sum', label: 'Сумма', type: 'money', compute: {op: 'multiply', of: ['qty', 'price']}, total: 'sum'},
];
const ADDRESS_PARTS = [
  {key: 'city', label: 'Город', propertyType: 'string'},
  {key: 'street', label: 'Улица и дом', propertyType: 'string'},
  {key: 'zip', label: 'Индекс', propertyType: 'string'},
];
const BANK = {bik: '044525225', corr_account: '30101810400000000225'};

// The options a card asks the host for (field.options), by field key.
const OPTIONS_OF = {owner: PEOPLE, contract: CONTRACTS, client: CLIENTS, country: COUNTRIES, languages: LANGUAGES};

// The families group the types on the section's overview, in this order.
const FAMILIES = [
  {id: 'text', title: 'Текст'},
  {id: 'numbers', title: 'Числа и суммы'},
  {id: 'dates', title: 'Дата и время'},
  {id: 'flags', title: 'Да или нет'},
  {id: 'choice', title: 'Выбор'},
  {id: 'links', title: 'Люди и связи'},
  {id: 'files', title: 'Файлы'},
  {id: 'color', title: 'Цвет'},
  {id: 'composite', title: 'Составные'},
];

// A type: its family, the fields its example shows (the first is the type
// without a variant), and for each field three values, one per record.
const CATALOGUE = {
  string: {family: 'text', fields: [
    [{key: 'title', label: 'Название', propertyType: 'string', placeholder: 'Например, «Портал клиента»', required: true},
      ['Портал клиента', 'Мобильное приложение', null]],
    [{key: 'phone', label: 'Телефон', propertyType: 'string', variant: 'phone'},
      ['+7 916 123-45-67', '+7 843 200-10-20', null]],
    [{key: 'secret', label: 'Пароль хранилища', propertyType: 'string', variant: 'password'},
      [{set: true}, {set: false}, null]],
  ]},
  text: {family: 'text', fields: [
    [{key: 'about', label: 'Описание', propertyType: 'text', width: 'full', placeholder: 'Пара предложений о проекте'},
      ['Личный кабинет для клиентов: счета, заявки и документы.\nЗапуск — до конца года.', 'Приложение для курьеров.', null]],
  ]},
  html: {family: 'text', fields: [
    [{key: 'notes', label: 'Описание с оформлением', propertyType: 'html', width: 'full'},
      ['<p>Этапы: <strong>дизайн</strong>, разработка, <em>запуск</em>.</p><ul><li>Дизайн — ноябрь</li><li>Запуск — декабрь</li></ul>', '<p>Требования <strong>согласованы</strong>.</p>', null]],
  ]},
  include: {family: 'text', fields: [
    [{key: 'config', label: 'Настройки', propertyType: 'include', language: 'json', width: 'full'},
      ['{\n  "theme": "light",\n  "pageSize": 25\n}', '{"push": true}', null]],
  ]},
  integer: {family: 'numbers', fields: [
    [{key: 'stock', label: 'Остаток', propertyType: 'integer', unit: 'шт.'}, [128, 7, null]],
    [{key: 'seats', label: 'Мест в номере', propertyType: 'integer', variant: 'stepper', min: 1, max: 6, step: 1}, [2, 4, null]],
  ]},
  number: {family: 'numbers', fields: [
    [{key: 'price', label: 'Цена', propertyType: 'number', unit: '₽', precision: 2}, [54990.5, 890, null]],
    [{key: 'progress', label: 'Готовность', propertyType: 'number', variant: 'scale', min: 0, max: 100}, [72, 15, null]],
    [{key: 'quota', label: 'Занято места', propertyType: 'number', variant: 'meter', min: 0, max: 100}, [64, 91, null]],
    [{key: 'weight', label: 'Вес', propertyType: 'number', variant: 'stepper', unit: 'кг', min: 0, max: 50, step: 0.5, precision: 1}, [2.5, 12, null]],
  ]},
  money: {family: 'numbers', fields: [
    [{key: 'budget', label: 'Бюджет', propertyType: 'money'}, [rub('1500000.00'), {amount: '12000', currency: 'USD'}, null]],
    [{key: 'fee', label: 'Взнос', propertyType: 'money', currency: 'RUB', min: '0'}, [rub('4990.50'), rub('120'), null]],
  ]},
  percent: {family: 'numbers', fields: [
    [{key: 'discount', label: 'Скидка', propertyType: 'percent'}, ['12.5', '5', null]],
  ]},
  date: {family: 'dates', fields: [
    [{key: 'birthday', label: 'Дата рождения', propertyType: 'date'}, ['1990-04-12', '1985-11-30', null]],
  ]},
  datetime: {family: 'dates', fields: [
    [{key: 'meeting', label: 'Начало встречи', propertyType: 'datetime', step: 15}, ['2026-11-15T10:30:00', '2026-12-01T16:00:00', null]],
  ]},
  time: {family: 'dates', fields: [
    [{key: 'workday', label: 'Начало рабочего дня', propertyType: 'time', min: '07:00', max: '12:00', step: 30}, ['09:00', '10:30', null]],
  ]},
  boolean: {family: 'flags', fields: [
    [{key: 'newsletter', label: 'Подписан на рассылку', propertyType: 'boolean'}, [true, false, null]],
    [{key: 'remote', label: 'Работает удалённо', propertyType: 'boolean', trueText: 'Удалённо', falseText: 'В офисе'}, [false, true, null]],
  ]},
  choice: {family: 'choice', fields: [
    [{key: 'status', label: 'Статус', propertyType: 'choice', options: STATUS}, ['active', 'review', null]],
    [{key: 'priority', label: 'Приоритет', propertyType: 'choice', variant: 'buttons', options: PRIORITY}, ['high', 'normal', null]],
  ]},
  choices: {family: 'choice', fields: [
    [{key: 'skills', label: 'Навыки', propertyType: 'choices', options: SKILLS, width: 'full'}, [['js', 'sql', 'ux'], ['php'], null]],
    [{key: 'days', label: 'Дни приёма', propertyType: 'choices', variant: 'checklist', options: DAYS, width: 'full'}, [['mon', 'wed', 'fri'], ['tue', 'thu'], null]],
  ]},
  user: {family: 'links', fields: [
    [{key: 'owner', label: 'Ответственный', propertyType: 'user', placeholder: 'Выберите сотрудника', searchPlaceholder: 'Имя сотрудника'}, [PEOPLE[0], PEOPLE[3], null]],
  ]},
  record: {family: 'links', fields: [
    [{key: 'contract', label: 'Договор', propertyType: 'record', placeholder: 'Выберите договор', searchPlaceholder: 'Номер договора'}, [CONTRACTS[0], CONTRACTS[2], null]],
  ]},
  relation: {family: 'links', fields: [
    [{key: 'client', label: 'Клиент', propertyType: 'relation', placeholder: 'Выберите клиента', searchPlaceholder: 'Название клиента'}, [CLIENTS[0], CLIENTS[1], null]],
  ]},
  lookup: {family: 'choice', fields: [
    [{key: 'country', label: 'Страна', propertyType: 'lookup', source: 'countries', options: COUNTRIES}, [COUNTRIES[0], COUNTRIES[2], null]],
    [{key: 'languages', label: 'Языки', propertyType: 'lookup', multiple: true, source: 'languages', options: LANGUAGES, width: 'full'},
      [[LANGUAGES[0], LANGUAGES[1]], [LANGUAGES[0]], null]],
  ]},
  file: {family: 'files', fields: [
    [{key: 'docs', label: 'Документы', propertyType: 'file', multiple: true, accept: '.pdf,.docx', width: 'full', uploadText: 'Перетащите файлы или выберите', uploadHint: 'PDF или DOCX, до 10 МБ'},
      [[pdf('Договор.pdf', 182000), pdf('Акт сверки.pdf', 64000)], [pdf('Счёт № 45.pdf', 41000)], null]],
    [{key: 'photo', label: 'Фотография', propertyType: 'file', variant: 'image', accept: 'image/*'},
      [picture('Холмы.svg', 'place-01-3x2.svg'), picture('Город.svg', 'place-02-3x2.svg'), null]],
    [{key: 'cover', label: 'Обложка', propertyType: 'file', variant: 'image-card', accept: 'image/*'},
      [picture('Обложка.svg', 'cover-01-16x9.svg'), picture('Ваза.svg', 'product-01-4x3.svg'), null]],
    [{key: 'gallery', label: 'Галерея', propertyType: 'file', variant: 'image-list', multiple: true, accept: 'image/*', width: 'full'},
      [[picture('Озеро.svg', 'place-03-3x2.svg'), picture('Лес.svg', 'place-04-3x2.svg')], [picture('Долина.svg', 'place-05-3x2.svg'), picture('Чашка.svg', 'product-02-4x3.svg')], null]],
  ]},
  color: {family: 'color', fields: [
    [{key: 'tag', label: 'Цвет метки', propertyType: 'color', swatches: SWATCHES}, ['#0f766e', '#be123c', null]],
    [{key: 'brand', label: 'Цвет бренда', propertyType: 'color'}, ['#1d4ed8', '#6d28d9', null]],
  ]},
  items: {family: 'composite', fields: [
    [{key: 'lines', label: 'Позиции', propertyType: 'items', width: 'full', minRows: 1, maxRows: 20, columns: ITEM_COLUMNS},
      [[{name: 'Ручка', qty: '3', price: rub('33.33'), sum: rub('99.99')}, {name: 'Блокнот', qty: '2', price: rub('150'), sum: rub('300.00')}],
        [{name: 'Папка', qty: '10', price: rub('45.50'), sum: rub('455.00')}], null]],
  ]},
  compound: {family: 'composite', fields: [
    [{key: 'address', label: 'Адрес', propertyType: 'compound', width: 'full', parts: ADDRESS_PARTS},
      [{city: 'Казань', street: 'ул. Баумана, 1', zip: '420111'}, {city: 'Самара', street: 'ул. Ленинградская, 24'}, null]],
  ]},
  'ru.requisites': {family: 'composite', fields: [
    [{key: 'requisites', label: 'Реквизиты', propertyType: 'ru.requisites', width: 'full'},
      [{inn: '7707083893', kpp: '773601001', ogrn: '1027700132195', account: '40702810938000000001', ...BANK},
        {inn: '500100732259', account: '40802810938000000008', ...BANK}, null]],
  ]},
};

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
