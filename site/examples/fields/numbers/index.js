// Written by scripts/build-field-examples.mjs from scripts/field-demo.js; edit those.
const FAMILY = 'numbers';

// The live examples of the «Поля» section: one engine and one catalogue, the
// source of examples/fields/<family>/index.js (written by
// scripts/build-field-examples.mjs, which puts `const FAMILY = '<family>';`
// before this text). Every type and variant here is one the SIMAI Framework
// field renderers list in SF.fieldRenderers.registry; values follow the
// formats those renderers read.
//
// For a family the example draws the same records three ways: cells of an
// sf-view-table (inside an sf-view, simai.dataview-port query.change), an
// sf-view-properties card to read and one to edit. The card talks to a small
// host (simai.property-view-port): record.load, record.save, field.options for
// people, records and reference lists, field.upload for files. What the host
// received on save is shown under the cards. Dates are the set's own: it
// writes them in the page's language when the host does not format them
// (view 1.1.0). Both hosts format numbers with formatFieldValue.

const IMAGE = (from, to) => `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="320" height="200" fill="url(#g)"/><circle cx="240" cy="70" r="28" fill="#ffffff" fill-opacity=".55"/><path d="M0 170 L90 100 L150 150 L210 110 L320 180 L320 200 L0 200 Z" fill="#ffffff" fill-opacity=".45"/></svg>`)}`;
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
  {value: 'ru', label: 'Россия'}, {value: 'by', label: 'Беларусь'}, {value: 'kz', label: 'Казахстан'},
  {value: 'am', label: 'Армения'}, {value: 'uz', label: 'Узбекистан'}, {value: 'kg', label: 'Киргизия'},
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
const SWATCHES = ['#1d4ed8', '#0f766e', '#b45309', '#be123c', '#6d28d9', '#334155'];
const pdf = (label, size) => ({label, mime: 'application/pdf', href: '#file', size});
const picture = (label, from, to) => ({label, mime: 'image/svg+xml', href: IMAGE(from, to), size: 2048});

// Each field: its description (what a host sends) and three values, one per
// record; the third record leaves most fields empty.
const CATALOGUE = {
  text: {label: 'Текст', fields: [
    [{key: 'title', label: 'Название', propertyType: 'string', placeholder: 'Например, «Портал клиента»', required: true},
      ['Портал клиента', 'Мобильное приложение', 'Сайт-визитка']],
    [{key: 'phone', label: 'Телефон', propertyType: 'string', variant: 'phone'},
      ['+7 916 123-45-67', '+7 843 200-10-20', null]],
    [{key: 'secret', label: 'Пароль хранилища', propertyType: 'string', variant: 'password'},
      [{set: true}, {set: false}, null]],
    [{key: 'about', label: 'Описание', propertyType: 'text', width: 'full', placeholder: 'Пара предложений о проекте'},
      ['Личный кабинет для клиентов: счета, заявки и документы.\nЗапуск — до конца года.', 'Приложение для курьеров.', null]],
    [{key: 'notes', label: 'Описание с оформлением', propertyType: 'html', width: 'full'},
      ['<p>Этапы: <strong>дизайн</strong>, разработка, <em>запуск</em>.</p><ul><li>Дизайн — ноябрь</li><li>Запуск — декабрь</li></ul>', '<p>Требования <strong>согласованы</strong>.</p>', null]],
    [{key: 'config', label: 'Настройки', propertyType: 'include', language: 'json', width: 'full'},
      ['{\n  "theme": "light",\n  "pageSize": 25\n}', '{"push": true}', null]],
  ]},
  numbers: {label: 'Числа', fields: [
    [{key: 'stock', label: 'Остаток', propertyType: 'integer', unit: 'шт.'}, [128, 7, null]],
    [{key: 'seats', label: 'Мест в номере', propertyType: 'integer', variant: 'stepper', min: 1, max: 6, step: 1}, [2, 4, null]],
    [{key: 'price', label: 'Цена', propertyType: 'number', unit: '₽', precision: 2}, [54990.5, 890, null]],
    [{key: 'progress', label: 'Готовность', propertyType: 'number', variant: 'scale', min: 0, max: 100}, [72, 15, null]],
    [{key: 'weight', label: 'Вес', propertyType: 'number', variant: 'stepper', unit: 'кг', min: 0, max: 50, step: 0.5, precision: 1}, [2.5, 12, null]],
  ]},
  dates: {label: 'Дата и время', fields: [
    [{key: 'birthday', label: 'Дата рождения', propertyType: 'date'}, ['1990-04-12', '1985-11-30', null]],
    [{key: 'meeting', label: 'Начало встречи', propertyType: 'datetime', step: 15}, ['2026-11-15T10:30:00', '2026-12-01T16:00:00', null]],
    [{key: 'workday', label: 'Начало рабочего дня', propertyType: 'time', min: '07:00', max: '12:00', step: 30}, ['09:00', '10:30', null]],
  ]},
  flags: {label: 'Да или нет', fields: [
    [{key: 'newsletter', label: 'Подписан на рассылку', propertyType: 'boolean'}, [true, false, null]],
    [{key: 'remote', label: 'Работает удалённо', propertyType: 'boolean', trueText: 'Удалённо', falseText: 'В офисе'}, [false, true, null]],
    [{key: 'active', label: 'Доступ открыт', propertyType: 'boolean', required: true}, [true, false, false]],
  ]},
  choice: {label: 'Выбор', fields: [
    [{key: 'status', label: 'Статус', propertyType: 'choice', options: STATUS}, ['active', 'review', null]],
    [{key: 'priority', label: 'Приоритет', propertyType: 'choice', variant: 'buttons', options: PRIORITY}, ['high', 'normal', null]],
    [{key: 'skills', label: 'Навыки', propertyType: 'choices', options: SKILLS, width: 'full'}, [['js', 'sql', 'ux'], ['php'], null]],
    [{key: 'days', label: 'Дни приёма', propertyType: 'choices', variant: 'checklist', options: DAYS, width: 'full'}, [['mon', 'wed', 'fri'], ['tue', 'thu'], null]],
    [{key: 'country', label: 'Страна', propertyType: 'lookup', source: 'countries', options: COUNTRIES}, [COUNTRIES[0], COUNTRIES[2], null]],
    [{key: 'languages', label: 'Языки', propertyType: 'lookup', multiple: true, source: 'languages', options: LANGUAGES, width: 'full'},
      [[LANGUAGES[0], LANGUAGES[1]], [LANGUAGES[0]], null]],
  ]},
  links: {label: 'Люди и связи', fields: [
    [{key: 'owner', label: 'Ответственный', propertyType: 'user', placeholder: 'Выберите сотрудника', searchPlaceholder: 'Имя сотрудника'}, [PEOPLE[0], PEOPLE[3], null]],
    [{key: 'contract', label: 'Договор', propertyType: 'record', placeholder: 'Выберите договор', searchPlaceholder: 'Номер договора'}, [CONTRACTS[0], CONTRACTS[2], null]],
    [{key: 'client', label: 'Клиент', propertyType: 'relation', placeholder: 'Выберите клиента', searchPlaceholder: 'Название клиента'}, [CLIENTS[0], CLIENTS[1], null]],
  ]},
  files: {label: 'Файлы', fields: [
    [{key: 'docs', label: 'Документы', propertyType: 'file', multiple: true, accept: '.pdf,.docx', width: 'full', uploadText: 'Перетащите файлы или выберите', uploadHint: 'PDF или DOCX, до 10 МБ'},
      [[pdf('Договор.pdf', 182000), pdf('Акт сверки.pdf', 64000)], [pdf('Счёт № 45.pdf', 41000)], null]],
    [{key: 'photo', label: 'Фотография', propertyType: 'file', variant: 'image', accept: 'image/*'},
      [picture('Офис.svg', '#1d4ed8', '#0f766e'), picture('Склад.svg', '#b45309', '#be123c'), null]],
    [{key: 'cover', label: 'Обложка', propertyType: 'file', variant: 'image-card', accept: 'image/*'},
      [picture('Обложка.svg', '#6d28d9', '#1d4ed8'), null, null]],
    [{key: 'gallery', label: 'Галерея', propertyType: 'file', variant: 'image-list', multiple: true, accept: 'image/*', width: 'full'},
      [[picture('Зал.svg', '#0f766e', '#334155'), picture('Кухня.svg', '#b45309', '#6d28d9')], [picture('Вход.svg', '#be123c', '#334155')], null]],
  ]},
  color: {label: 'Цвет', fields: [
    [{key: 'tag', label: 'Цвет метки', propertyType: 'color', swatches: SWATCHES}, ['#0f766e', '#be123c', null]],
    [{key: 'brand', label: 'Цвет бренда', propertyType: 'color'}, ['#1d4ed8', '#6d28d9', null]],
  ]},
};
// The overview: one field of every type.
const FIRST_OF_TYPE = (() => {
  const seen = new Map();
  for (const family of Object.values(CATALOGUE)) {
    for (const entry of family.fields) {
      const [field] = entry;
      if (!seen.has(field.propertyType) && !field.variant) seen.set(field.propertyType, entry);
    }
  }
  return [...seen.values()];
})();
const family = FAMILY === 'all' ? {label: 'Все типы', fields: FIRST_OF_TYPE} : CATALOGUE[FAMILY];
const NAMES = ['Первая запись', 'Вторая запись', 'Пустые значения'];
const records = NAMES.map((name, index) => ({
  id: `r-${index + 1}`,
  name,
  revision: 1,
  values: Object.fromEntries(family.fields.map(([field, values]) => [field.key, structuredClone(values[index] ?? null)])),
}));
const optionsOf = {owner: PEOPLE, contract: CONTRACTS, client: CLIENTS, country: COUNTRIES, languages: LANGUAGES};

const columns = () => [
  {key: 'name', label: 'Запись', role: 'title'},
  ...family.fields.map(([field]) => {
    const {width, placeholder, searchPlaceholder, uploadText, uploadHint, required, ...column} = field;
    return column;
  }),
];
const rows = () => records.map((record) => ({id: record.id, name: record.name, ...record.values}));

const cardOf = (record) => ({
  record_id: record.id,
  collection: 'demo.fields',
  revision: String(record.revision),
  label: record.name,
  actions: ['record.edit'],
  sections: [{key: 'main', label: family.label, groups: [{
    key: 'fields', label: family.label, columns: 2,
    fields: family.fields.map(([field]) => ({width: 'half', ...field, value: record.values[field.key]})),
  }]}],
});

const formatFieldValue = (field, value) => {
  const type = field?.propertyType ?? field?.property_type ?? field?.type;
  if (value == null || value === '') return undefined;
  // Numbers in Russian style with the field's precision; the unit is the
  // renderer's and follows.
  if ((type === 'number' || type === 'integer') && typeof value === 'number' && field?.variant !== 'scale') {
    const digits = type === 'integer' ? 0 : field?.precision;
    return new Intl.NumberFormat('ru-RU', digits == null ? {} : {minimumFractionDigits: digits, maximumFractionDigits: digits}).format(value);
  }
  return undefined;
};

const shown = (value) => JSON.stringify(value, (key, item) => (typeof item === 'string' && item.startsWith('data:') ? 'data:…' : item));

const start = async () => {
  const root = document.querySelector('[data-fields]');
  if (!root || root.dataset.exampleReady === 'true') return;
  root.dataset.exampleReady = 'true';
  await Promise.all(['sf-view', 'sf-view-table', 'sf-view-properties'].map((tag) => customElements.whenDefined(tag)));
  const view = root.querySelector('sf-view');
  const cards = [...root.querySelectorAll('sf-view-properties')];
  const log = root.querySelector('[data-log]');
  view.setHostPort({
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

  const host = {
    version: '1.17.0',
    capabilities: ['field-options', 'field-upload'],
    async raise(intent, payload) {
      const record = records.find((item) => item.id === payload?.record_id) ?? records[0];
      if (intent === 'record.load') return {answer: 'applied', record: cardOf(record)};
      if (intent === 'record.save' || intent === 'group.save') {
        Object.assign(record.values, payload.values);
        record.revision += 1;
        log.textContent = `Хост получил: ${shown(payload.values)}`;
        view.refresh();
        for (const card of cards) if (card.getAttribute('mode') === 'view') card.refresh?.();
        return {answer: 'applied', record: cardOf(record), revision: String(record.revision)};
      }
      if (intent === 'field.options') {
        const search = String(payload.search ?? '').toLowerCase();
        const items = (optionsOf[payload.field] ?? []).filter((item) => item.label.toLowerCase().includes(search));
        return {answer: 'applied', options_page: {items, next_cursor: null, total: items.length}};
      }
      if (intent === 'field.upload') {
        const file = payload.file;
        return {answer: 'applied', file: {label: file?.name ?? 'Файл', mime: file?.type ?? '', size: file?.size ?? 0,
          href: file instanceof Blob ? URL.createObjectURL(file) : '#file'}};
      }
      if (intent === 'record.open') {
        log.textContent = `Открыть: ${payload.value?.label ?? ''}`;
        return {answer: 'applied'};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
    formatFieldValue,
  };
  for (const card of cards) {
    card.setHostPort(host);
    card.setAttribute('record-id', 'r-1');
  }
  root.querySelector('[data-record-switch]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-record]');
    if (!button) return;
    for (const item of root.querySelectorAll('[data-record]')) {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    }
    for (const card of cards) card.setAttribute('record-id', button.dataset.record);
  });
};

start();
