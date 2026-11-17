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

const PICTURES = '/assets/illustrations/';
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
