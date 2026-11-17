// Written by scripts/build-properties.mjs from scripts/property-catalogue.js
// and the engine below it; edit those.
const FIELDS = [[{"key":"title","label":"Название проекта","propertyType":"string","placeholder":"Например, «Портал клиента»","filter":{"operators":["contains"],"defaultOperator":"contains"}},["Портал клиента","Портал клиента для сети магазинов «Северный ветер» в Санкт-Петербурге и Ленинградской области",null]],[{"key":"phone","label":"Телефон","propertyType":"string","filter":{"operators":["contains"],"defaultOperator":"contains"},"variant":"phone"},["+79161234567","+73472468500;ext=12",null]],[{"key":"secret","label":"Пароль хранилища","propertyType":"string","placeholder":"Новый пароль","variant":"password"},[{"set":true},{"set":false},null]],[{"key":"about","label":"Описание","propertyType":"text","placeholder":"Пара предложений о проекте"},["Приложение для курьеров.","Личный кабинет для клиентов: счета, заявки, документы и переписка с менеджером.\nЗапуск — до конца года, пилот — в двух филиалах.",null]],[{"key":"notes","label":"Описание с оформлением","propertyType":"html"},["<p>Требования <strong>согласованы</strong>.</p>","<p>Этапы: <strong>дизайн</strong>, разработка, <em>запуск</em>.</p><ul><li>Дизайн — ноябрь</li><li>Разработка — декабрь и январь</li><li>Запуск — февраль</li></ul>",null]],[{"key":"config","label":"Настройки","propertyType":"include","language":"json"},["{\"push\": true}","{\n  \"theme\": \"light\",\n  \"pageSize\": 25,\n  \"columns\": [\"title\", \"owner\", \"due_date\", \"status\"]\n}",null]],[{"key":"stock","label":"Остаток","propertyType":"integer","unit":"шт.","min":0,"max":100000,"step":1},[128,1250000,null]],[{"key":"progress","label":"Готовность","propertyType":"number","unit":"%","min":0,"max":100,"step":0.5,"precision":1},[72.5,100,null]],[{"key":"budget","label":"Бюджет","propertyType":"money"},[{"amount":"4990.50","currency":"RUB"},{"amount":"1250000","currency":"USD"},null]],[{"key":"discount","label":"Скидка","propertyType":"percent"},["12.5","0.75",null]],[{"key":"due_date","label":"Срок оплаты","propertyType":"date"},["2026-11-19","2026-11-19T18:30:00",null]],[{"key":"meeting","label":"Начало встречи","propertyType":"datetime","step":15},["2026-11-19T10:30:00","2026-12-01T16:00:00+03:00",null]],[{"key":"workday","label":"Начало рабочего дня","propertyType":"time","min":"07:00","max":"12:00","step":30},["09:00","10:30:00",null]],[{"key":"remote","label":"Работает удалённо","propertyType":"boolean","trueText":"Удалённо","falseText":"В офисе"},[true,false,null]],[{"key":"status","label":"Статус","propertyType":"choice","options":[{"value":"draft","label":"Черновик","scheme":"neutral"},{"value":"review","label":"На проверке","scheme":"warning"},{"value":"active","label":"Действует","scheme":"success"},{"value":"signing","label":"Ждёт подписи второй стороны","scheme":"info"}]},["active","signing",null]],[{"key":"skills","label":"Навыки","propertyType":"choices","options":[{"value":"js","label":"JavaScript","scheme":"primary"},{"value":"php","label":"PHP","scheme":"primary"},{"value":"sql","label":"SQL","scheme":"success"},{"value":"ux","label":"UX","scheme":"warning"},{"value":"qa","label":"Тестирование","scheme":"neutral"}]},[["js","sql"],["js","php","sql","ux","qa"],null]],[{"key":"country","label":"Страна","propertyType":"lookup","source":"countries","options":[{"value":"ru","label":"Россия"},{"value":"de","label":"Германия"},{"value":"fr","label":"Франция"},{"value":"cf","label":"Центральноафриканская Республика"},{"value":"jp","label":"Япония"}],"placeholder":"Выберите страну"},[{"value":"ru","label":"Россия"},{"value":"cf","label":"Центральноафриканская Республика"},null]],[{"key":"owner","label":"Ответственный","propertyType":"user","placeholder":"Выберите сотрудника","searchPlaceholder":"Имя сотрудника"},[{"value":"u-1","label":"Анна Белова","avatarText":"АБ"},{"value":"u-5","label":"Константин Белозерский-Задунайский","avatarText":"КБ"},null]],[{"key":"contract","label":"Договор","propertyType":"record","placeholder":"Выберите договор","searchPlaceholder":"Номер договора"},[{"value":"c-118","label":"Договор № 118 от 3 марта 2026","href":"#contract-118"},{"value":"c-204","label":"Договор № 204 от 17 июня 2026 на поставку оборудования и пусконаладочные работы","href":"#contract-204"},null]],[{"key":"client","label":"Клиент","propertyType":"relation","placeholder":"Выберите клиента","searchPlaceholder":"Название клиента"},[{"value":"k-1","label":"ООО «Северный ветер»"},{"value":"k-2","label":"Акционерное общество «Научно-производственное объединение „Техносфера“»"},null]],[{"key":"photo","label":"Фотография","propertyType":"file","accept":"image/*","uploadText":"Перетащите файл или выберите","uploadHint":"SVG, PNG или JPG, до 10 МБ"},[{"label":"Холмы.svg","mime":"image/svg+xml","href":"assets/place-01-3x2.svg","size":1024},{"label":"Ваза из коллекции «Северный ветер», вид сбоку.svg","mime":"image/svg+xml","href":"assets/product-01-4x3.svg","size":1024},null]],[{"key":"tag","label":"Цвет метки","propertyType":"color","swatches":["#1d4ed8","#0f766e","#b45309","#be123c","#6d28d9","#334155"]},["#0f766e","#be123c",null]],[{"key":"lines","label":"Позиции","propertyType":"items","minRows":1,"maxRows":20,"columns":[{"key":"name","label":"Наименование","type":"string","required":true},{"key":"qty","label":"Кол-во","type":"number"},{"key":"price","label":"Цена","type":"money","settings":{"currency":"RUB"}},{"key":"sum","label":"Сумма","type":"money","compute":{"op":"multiply","of":["qty","price"]},"total":"sum"}]},[[{"name":"Папка","qty":"10","price":{"amount":"45.50","currency":"RUB"},"sum":{"amount":"455.00","currency":"RUB"}}],[{"name":"Ручка","qty":"3","price":{"amount":"33.33","currency":"RUB"},"sum":{"amount":"99.99","currency":"RUB"}},{"name":"Блокнот в твёрдой обложке, формат А5","qty":"2","price":{"amount":"150","currency":"RUB"},"sum":{"amount":"300.00","currency":"RUB"}}],null]],[{"key":"address","label":"Адрес","propertyType":"compound","parts":[{"key":"city","label":"Город","propertyType":"string"},{"key":"street","label":"Улица и дом","propertyType":"string"},{"key":"zip","label":"Индекс","propertyType":"string"}]},[{"city":"Казань","street":"ул. Баумана, 1","zip":"420111"},{"city":"Санкт-Петербург","street":"Большая Морская ул., 18, офис 412"},null]],[{"key":"requisites","label":"Реквизиты","propertyType":"ru.requisites"},[{"inn":"7707083893","kpp":"773601001","ogrn":"1027700132195","account":"40702810938000000001","bik":"044525225","corr_account":"30101810400000000225"},{"inn":"500100732259","account":"40802810938000000008","bik":"044525225","corr_account":"30101810400000000225"},null]]];
const OPTIONS_OF = {"owner":[{"value":"u-1","label":"Анна Белова","avatarText":"АБ"},{"value":"u-2","label":"Илья Орлов","avatarText":"ИО"},{"value":"u-3","label":"Мария Котова","avatarText":"МК"},{"value":"u-4","label":"Олег Смирнов","avatarText":"ОС"},{"value":"u-5","label":"Константин Белозерский-Задунайский","avatarText":"КБ"}],"contract":[{"value":"c-118","label":"Договор № 118 от 3 марта 2026","href":"#contract-118"},{"value":"c-204","label":"Договор № 204 от 17 июня 2026 на поставку оборудования и пусконаладочные работы","href":"#contract-204"},{"value":"c-311","label":"Договор № 311 от 2 октября 2026","href":"#contract-311"}],"client":[{"value":"k-1","label":"ООО «Северный ветер»"},{"value":"k-2","label":"Акционерное общество «Научно-производственное объединение „Техносфера“»"},{"value":"k-3","label":"ИП Кузнецова С. А."}],"country":[{"value":"ru","label":"Россия"},{"value":"de","label":"Германия"},{"value":"fr","label":"Франция"},{"value":"cf","label":"Центральноафриканская Республика"},{"value":"jp","label":"Япония"}]};

// The live example of the «Свойства» overview (examples/properties/all/index.js,
// written by scripts/build-properties.mjs with `const FIELDS` -- the field and
// the three values of every type -- and `const OPTIONS_OF` before this text):
// one record with a field of each type in the set's real components, a table
// (sf-view-table in sf-view) and a card to read and one to edit
// (sf-view-properties), talking to a small host. What the host received on
// save is written under the cards. Each type's own page shows the type alone
// in its four places (scripts/property-demo.js).

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
const TITLE = 'Все типы';

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
  const refresh = () => {
    for (const view of views) view.refresh();
    for (const card of root.querySelectorAll('sf-view-properties[mode="view"]')) card.refresh?.();
  };
  const following = [...root.querySelectorAll('sf-view-properties[data-follows]')];
  for (const card of root.querySelectorAll('sf-view-properties')) {
    const readonly = false;
    card.setHostPort(cardHost({log: card.dataset.follows !== undefined ? log : null, onSaved: refresh, readonly}));
    card.setAttribute('record-id', card.dataset.record ?? 'r-1');
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
