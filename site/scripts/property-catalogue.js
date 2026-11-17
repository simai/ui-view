// The catalogue of the «Свойства» section: one entry per property type, in
// the order of the section (owner decisions C300 and C302, property page
// template, ui-control research 2026-11-17-property-page-template and
// 2026-11-17-type-template-catalogue). A type stores and checks the value; a
// template only draws it and never changes the data.
//
// An entry holds what its page shows, one template for every type:
//
//   field      the field description the four places draw (key, label,
//              propertyType, the type's settings), as the application sends it;
//   drawnAs    the keys a SIMAI Framework that has no such type yet draws it
//              with (phone and password were variants of string): used only
//              when the pair's registry does not list the type;
//   samples    three values: normal, long (or with time, or an extension),
//              empty, each with its label;
//   error      the message the «Ошибка» state shows under the field;
//   short      the value is edited in a small window at its place in
//              «Кратко» (C296: choice, people, yes or no, dates, numbers);
//   templates  the templates of the type the Framework draws, the default
//              first: id (`template`), name, the places it changes (view,
//              compact, edit, filter) and `variant`, the former name a pair
//              without templates reads (C302 (3));
//   server     four rows: the value, empty, from the edit, from the filter;
//   settings   [setting, default, places it changes, what it sets];
//   storage    [Larena, Bitrix]: how each stores the type.
//
// It is plain data. scripts/build-properties.mjs writes the pages from it and
// puts one entry (TYPE_DATA), with scripts/property-demo.js, into the type's
// example. Pictures are copies of the D22 set in assets/illustrations/
// (manifest.json there); the hex values below are colour fields' data,
// nothing is drawn with them (site lint, colour allow list «colour field data»).

const PICTURES = 'assets/';
const PEOPLE = [
  {value: 'u-1', label: 'Анна Белова', avatarText: 'АБ'},
  {value: 'u-2', label: 'Илья Орлов', avatarText: 'ИО'},
  {value: 'u-3', label: 'Мария Котова', avatarText: 'МК'},
  {value: 'u-4', label: 'Олег Смирнов', avatarText: 'ОС'},
  {value: 'u-5', label: 'Константин Белозерский-Задунайский', avatarText: 'КБ'},
];
const CONTRACTS = [
  {value: 'c-118', label: 'Договор № 118 от 3 марта 2026', href: '#contract-118'},
  {value: 'c-204', label: 'Договор № 204 от 17 июня 2026 на поставку оборудования и пусконаладочные работы', href: '#contract-204'},
  {value: 'c-311', label: 'Договор № 311 от 2 октября 2026', href: '#contract-311'},
];
const CLIENTS = [
  {value: 'k-1', label: 'ООО «Северный ветер»'},
  {value: 'k-2', label: 'Акционерное общество «Научно-производственное объединение „Техносфера“»'},
  {value: 'k-3', label: 'ИП Кузнецова С. А.'},
];
const COUNTRIES = [
  {value: 'ru', label: 'Россия'}, {value: 'de', label: 'Германия'}, {value: 'fr', label: 'Франция'},
  {value: 'cf', label: 'Центральноафриканская Республика'}, {value: 'jp', label: 'Япония'},
];
const STATUS = [
  {value: 'draft', label: 'Черновик', scheme: 'neutral'},
  {value: 'review', label: 'На проверке', scheme: 'warning'},
  {value: 'active', label: 'Действует', scheme: 'success'},
  {value: 'signing', label: 'Ждёт подписи второй стороны', scheme: 'info'},
];
const SKILLS = [
  {value: 'js', label: 'JavaScript', scheme: 'primary'}, {value: 'php', label: 'PHP', scheme: 'primary'},
  {value: 'sql', label: 'SQL', scheme: 'success'}, {value: 'ux', label: 'UX', scheme: 'warning'},
  {value: 'qa', label: 'Тестирование', scheme: 'neutral'},
];
// colour field data
const SWATCHES = ['#1d4ed8', '#0f766e', '#b45309', '#be123c', '#6d28d9', '#334155'];
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
const LONG_TITLE = 'Портал клиента для сети магазинов «Северный ветер» в Санкт-Петербурге и Ленинградской области';

// The options a field asks the host for (field.options), by field key.
const OPTIONS_OF = {owner: PEOPLE, contract: CONTRACTS, client: CLIENTS, country: COUNTRIES};

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

const REQUIRED = ['`required`', 'нет', 'Правка', 'обязательное поле: отметка у подписи, пустое не сохраняется'];
const READONLY = ['`readonly`', 'нет', 'Правка', 'поле только для чтения: значение видно, изменить нельзя'];
const PICK_EDIT = 'выбранный `{value, label}` или `null`';
const ANY_OF = '`{operator: "in", values: […]}` — любой из выбранных';

const CATALOGUE = {
  string: {family: 'text',
    field: {key: 'title', label: 'Название проекта', propertyType: 'string', placeholder: 'Например, «Портал клиента»', filter: {operators: ['contains'], defaultOperator: 'contains'}},
    samples: [['Обычное', 'Портал клиента'], ['Длинное', LONG_TITLE], ['Пусто', null]],
    error: 'Проект с таким названием уже есть',
    templates: [{id: 'input', name: 'Поле ввода', changes: []}],
    server: [['Значение', 'строка `"Портал клиента"`'], ['Пустое', '`null`; у поля с маской и `nullable: false` — `""`'],
      ['Из правки', 'строка как в поле; с маской — вместе с постоянными знаками, незаконченная не уходит'], ['Из фильтра', '`{operator: "contains", value: "портал"}`']],
    settings: [['`placeholder`', 'нет', 'Правка', 'подсказка в пустом поле'],
      ['`mask`', 'нет', 'Правка', 'маска ввода по правилам масок SIMAI Framework; значение — текст, как он показан'],
      ['`nullable`', '`true`', 'Правка', '`false` — очищенное поле с маской передаёт `""`, а не `null`'], REQUIRED, READONLY],
    storage: ['`string@2` — строка, длина в символах', 'свойство «Строка» (`string`)']},
  phone: {family: 'text',
    field: {key: 'phone', label: 'Телефон', propertyType: 'phone', filter: {operators: ['contains'], defaultOperator: 'contains'}},
    drawnAs: {propertyType: 'string', variant: 'phone'},
    samples: [['Обычное', '+79161234567'], ['С добавочным', '+73472468500;ext=12'], ['Пусто', null]],
    error: 'Этот номер уже у другого клиента',
    templates: [{id: 'phone_input', name: 'Поле с кодом страны', changes: []}],
    server: [['Значение', 'строка E.164 `"+79161234567"`: «+», код страны и номер; добавочный — после `;ext=`'], ['Пустое', '`null`'],
      ['Из правки', 'номер из поля с кодом страны — см. строку «Сервер получит» в правке'], ['Из фильтра', 'цифры номера: `{operator: "contains", value: "916"}`']],
    settings: [['`defaultCountry`', 'страна страницы', 'Правка', 'страна, с которой открывается пустое поле'], REQUIRED, READONLY],
    storage: ['`phone@1` — E.164, короткая колонка', 'свойство «Телефон» (`phone`)']},
  password: {family: 'text',
    field: {key: 'secret', label: 'Пароль хранилища', propertyType: 'password', placeholder: 'Новый пароль'},
    drawnAs: {propertyType: 'string', variant: 'password'},
    samples: [['Задан', {set: true}], ['Не задан', {set: false}], ['Пусто', null]],
    error: 'Не короче 12 знаков',
    templates: [{id: 'input', name: 'Скрытое поле', changes: []}],
    server: [['Значение', 'сам пароль не приходит никогда: `{set: true}` — задан, `{set: false}` — не задан'], ['Пустое', '`null` — как «не задан»'],
      ['Из правки', 'набранный текст, один раз; поле, которого не касались, ничего не передаёт и заданный пароль не стирает'], ['Из фильтра', 'по паролю не ищут; задан он или нет — решает приложение']],
    settings: [['`placeholder`', 'нет', 'Правка', 'подсказка в пустом поле'], ['`required`', 'нет', 'Правка', 'обязательное поле; если пароль уже задан, не действует'], READONLY],
    storage: ['нет: секреты хранит пакет `secret`', 'нет']},
  text: {family: 'text',
    field: {key: 'about', label: 'Описание', propertyType: 'text', placeholder: 'Пара предложений о проекте'},
    samples: [['Обычное', 'Приложение для курьеров.'], ['Длинное', 'Личный кабинет для клиентов: счета, заявки, документы и переписка с менеджером.\nЗапуск — до конца года, пилот — в двух филиалах.'], ['Пусто', null]],
    error: 'Не длиннее 500 знаков',
    templates: [{id: 'textarea', name: 'Многострочное поле', changes: []}],
    server: [['Значение', 'строка; переводы строк — `\\n`'], ['Пустое', '`null`'], ['Из правки', 'строка как в поле'], ['Из фильтра', '`{operator: "contains", value: "кабинет"}`']],
    settings: [['`placeholder`', 'нет', 'Правка', 'подсказка в пустом поле'], REQUIRED, READONLY],
    storage: ['`text@1`', 'свойство «Текст» (`text`)']},
  html: {family: 'text',
    field: {key: 'notes', label: 'Описание с оформлением', propertyType: 'html'},
    samples: [['Обычное', '<p>Требования <strong>согласованы</strong>.</p>'], ['Длинное', '<p>Этапы: <strong>дизайн</strong>, разработка, <em>запуск</em>.</p><ul><li>Дизайн — ноябрь</li><li>Разработка — декабрь и январь</li><li>Запуск — февраль</li></ul>'], ['Пусто', null]],
    error: 'Текст не помещается: не больше 200 000 знаков',
    templates: [{id: 'editor', name: 'Редактор текста', changes: []}],
    server: [['Значение', 'строка HTML из набора `sf-input-rich`; при показе очищается'], ['Пустое', '`null`'], ['Из правки', 'очищенная строка HTML'], ['Из фильтра', 'поиск по тексту без разметки: `{operator: "contains", value: "дизайн"}`']],
    settings: [['`placeholder`', 'нет', 'Правка', 'подсказка в пустом поле'], REQUIRED, READONLY],
    storage: ['`html@1`', 'свойство «HTML» (`html`)']},
  include: {family: 'text',
    field: {key: 'config', label: 'Настройки', propertyType: 'include', language: 'json'},
    samples: [['Обычное', '{"push": true}'], ['Длинное', '{\n  "theme": "light",\n  "pageSize": 25,\n  "columns": ["title", "owner", "due_date", "status"]\n}'], ['Пусто', null]],
    error: 'Это не JSON: не хватает закрывающей скобки',
    templates: [{id: 'script', name: 'Код', changes: []}],
    server: [['Значение', 'текст кода строкой'], ['Пустое', '`null`'], ['Из правки', 'текст как в поле'], ['Из фильтра', 'поиск по тексту: `{operator: "contains", value: "theme"}`']],
    settings: [['`language`', 'обычный текст', 'Показ, Правка', 'язык кода, атрибут `data-language`'], REQUIRED, READONLY],
    storage: ['нет', 'включаемая область (`include`)']},
  integer: {family: 'numbers', short: true,
    field: {key: 'stock', label: 'Остаток', propertyType: 'integer', unit: 'шт.', min: 0, max: 100000, step: 1},
    samples: [['Обычное', 128], ['Большое', 1250000], ['Пусто', null]],
    error: 'Не больше 100 000',
    templates: [{id: 'input', name: 'Поле числа', changes: []}, {id: 'stepper', name: 'Кнопки «−» и «+»', changes: ['edit'], variant: 'stepper', what: 'поле количества: кнопки «−» и «+» и стрелки клавиатуры, шаг `step`'}],
    server: [['Значение', 'целое число `128`'], ['Пустое', '`null`'], ['Из правки', 'целое число; очищенное поле — `null`'], ['Из фильтра', '`{operator: "between", value: [10, 500]}` и другие сравнения']],
    settings: [['`unit`', 'нет', 'Показ, Кратко', 'единица после числа: `шт.`, `кг`'], ['`min`, `max`, `step`', 'нет', 'Правка', 'границы и шаг ввода'], REQUIRED, READONLY],
    storage: ['`integer@1`', 'свойство «Число» (`number`), целое']},
  number: {family: 'numbers', short: true,
    field: {key: 'progress', label: 'Готовность', propertyType: 'number', unit: '%', min: 0, max: 100, step: 0.5, precision: 1},
    samples: [['Обычное', 72.5], ['Полное', 100], ['Пусто', null]],
    error: 'От 0 до 100',
    templates: [{id: 'input', name: 'Поле числа', changes: []}, {id: 'stepper', name: 'Кнопки «−» и «+»', changes: ['edit'], variant: 'stepper', what: 'поле количества: кнопки «−» и «+» и стрелки клавиатуры, шаг `step`'},
      {id: 'scale', name: 'Шкала', changes: ['view', 'compact'], variant: 'scale', what: 'шкала уровня от 0 до 100'}, {id: 'meter', name: 'Заполненность', changes: ['view', 'compact'], variant: 'meter', what: 'полоса заполненности лимита от 0 до 100'}],
    server: [['Значение', 'число `72.5`'], ['Пустое', '`null`'], ['Из правки', 'число; очищенное поле — `null`'], ['Из фильтра', '`{operator: "gte", value: 50}` и другие сравнения']],
    settings: [['`precision`', 'по значению', 'Показ, Кратко, Правка', 'знаков после запятой'], ['`unit`', 'нет', 'Показ, Кратко', 'единица после числа'],
      ['`min`, `max`, `step`', 'нет', 'Правка', 'границы и шаг; шкала и заполненность — только у поля от 0 до 100'], REQUIRED, READONLY],
    storage: ['`number@1` — десятичная строка', 'свойство «Число» (`number`)']},
  money: {family: 'numbers', short: true, set: 'view',
    field: {key: 'budget', label: 'Бюджет', propertyType: 'money'},
    samples: [['Обычное', rub('4990.50')], ['Крупная, в долларах', {amount: '1250000', currency: 'USD'}], ['Пусто', null]],
    error: 'Не больше 2 знаков после запятой',
    templates: [{id: 'money_input', name: 'Сумма и валюта', changes: []}],
    server: [['Значение', '`{amount: "4990.50", currency: "RUB"}`: сумма десятичной строкой и код ISO 4217'], ['Пустое', '`null`'],
      ['Из правки', 'тот же объект; лишние знаки после запятой не округляются, а останавливают сохранение'], ['Из фильтра', 'как число: `{operator: "between", value: ["1000", "5000"]}`']],
    settings: [['`currency`', 'нет', 'Показ, Правка', 'валюта поля: выбирать её не нужно, простая сумма тоже читается'], ['`min`, `max`', 'нет', 'Правка', 'границы суммы'], REQUIRED, READONLY],
    storage: ['`money@1`', 'нет']},
  percent: {family: 'numbers', short: true, set: 'view',
    field: {key: 'discount', label: 'Скидка', propertyType: 'percent'},
    samples: [['Обычное', '12.5'], ['Дробное', '0.75'], ['Пусто', null]],
    error: 'От 0 до 100',
    templates: [{id: 'input', name: 'Поле со знаком %', changes: []}],
    server: [['Значение', 'десятичная строка: `"12.5"` — это 12,5 %, а не доля'], ['Пустое', '`null`'], ['Из правки', 'десятичная строка'], ['Из фильтра', 'как число: `{operator: "gte", value: "10"}`']],
    settings: [['`min`, `max`', '0 и 100', 'Правка', 'границы'], REQUIRED, READONLY],
    storage: ['`percent@1`', 'нет']},
  date: {family: 'dates', short: true,
    field: {key: 'due_date', label: 'Срок оплаты', propertyType: 'date'},
    samples: [['Обычное', '2026-11-19'], ['Со временем', '2026-11-19T18:30:00'], ['Пусто', null]],
    error: 'Срок оплаты раньше даты счёта',
    templates: [{id: 'datepicker', name: 'Календарь', changes: []}],
    server: [['Значение', 'строка `"2026-11-19"`'], ['Пустое', '`null`'], ['Из правки', 'строка даты; у значения со временем — новый день с прежним временем'],
      ['Из фильтра', '`{operator: "between", value: ["2026-11-01", "2026-11-30"]}` и готовые периоды']],
    settings: [['`min`, `max`', 'нет', 'Правка', 'границы дня, дата ISO'], REQUIRED, READONLY],
    storage: ['`date@1`', 'свойство «Дата/время» без времени']},
  datetime: {family: 'dates', short: true,
    field: {key: 'meeting', label: 'Начало встречи', propertyType: 'datetime', step: 15},
    samples: [['Обычное', '2026-11-19T10:30:00'], ['С поясом', '2026-12-01T16:00:00+03:00'], ['Пусто', null]],
    error: 'Встреча не может начаться в прошлом',
    templates: [{id: 'datepicker', name: 'Календарь и время', changes: []}],
    server: [['Значение', 'строка ISO 8601 `"2026-11-19T10:30:00"`'], ['Пустое', '`null`'], ['Из правки', 'строка ISO 8601; новый день сохраняет прежнее время, день без времени не уходит'],
      ['Из фильтра', '`{operator: "between", value: ["2026-11-01", "2026-11-30"]}` и готовые периоды']],
    settings: [['`min`, `max`', 'нет', 'Правка', 'границы: дата или дата со временем'], ['`step`', '1', 'Правка', 'шаг минут, от 1 до 60'], REQUIRED, READONLY],
    storage: ['`datetime@1` — местное время без пояса', 'свойство «Дата/время»']},
  time: {family: 'dates', short: true,
    field: {key: 'workday', label: 'Начало рабочего дня', propertyType: 'time', min: '07:00', max: '12:00', step: 30},
    samples: [['Обычное', '09:00'], ['С секундами', '10:30:00'], ['Пусто', null]],
    error: 'Не раньше 07:00',
    templates: [{id: 'timepicker', name: 'Поле времени', changes: []}],
    server: [['Значение', 'строка `"09:00"`'], ['Пустое', '`null`'], ['Из правки', '`чч:мм`; если приложение хранит секунды — `чч:мм:00`'], ['Из фильтра', 'поиск по тексту: `{operator: "contains", value: "09"}`']],
    settings: [['`min`, `max`', 'нет', 'Правка', 'границы `чч:мм`'], ['`step`', '1', 'Правка', 'шаг минут, от 1 до 60'], REQUIRED, READONLY],
    storage: ['нет', 'нет']},
  boolean: {family: 'flags', short: true,
    field: {key: 'remote', label: 'Работает удалённо', propertyType: 'boolean', trueText: 'Удалённо', falseText: 'В офисе'},
    samples: [['Да', true], ['Нет', false], ['Не задано', null]],
    error: 'Удалённая работа не согласована с руководителем',
    templates: [{id: 'switch', name: 'Переключатель', changes: []}],
    server: [['Значение', '`true` или `false`'], ['Пустое', '`null` — «не задано»'], ['Из правки', '`true` или `false`; у необязательного поля ещё `null`'], ['Из фильтра', '`{operator: "eq", value: true}`']],
    settings: [['`trueText`, `falseText`', '«Да», «Нет»', 'Показ, Кратко, Правка', 'свои слова вместо «Да» и «Нет»'],
      ['`required`', 'нет', 'Правка', 'переключатель вместо пары кнопок «Да» и «Нет»; значение всегда `true` или `false`'], READONLY],
    storage: ['`boolean@1`', 'свойство «Флажок» (`checkbox`)']},
  choice: {family: 'choice', short: true,
    field: {key: 'status', label: 'Статус', propertyType: 'choice', options: STATUS},
    samples: [['Обычное', 'active'], ['Длинное', 'signing'], ['Пусто', null]],
    error: 'Действующий договор нельзя вернуть в черновик',
    templates: [{id: 'dropdown', name: 'Выпадающий список', changes: []}, {id: 'buttons', name: 'Кнопки', changes: ['edit'], variant: 'buttons', what: 'кнопка на вариант; повторное нажатие очищает необязательное поле'}],
    server: [['Значение', 'код варианта `"active"`'], ['Пустое', '`null`'], ['Из правки', 'код выбранного варианта'], ['Из фильтра', ANY_OF]],
    settings: [['`options`', 'нет', 'все', 'варианты `{value, label, scheme}`; `scheme` — цвет метки'], ['`badgeAppearance`', '`tonal`', 'Показ, Кратко', 'вид метки: `tonal` или `outline`'], REQUIRED, READONLY],
    storage: ['`choice@1`', 'свойство «Список» (`list`)']},
  choices: {family: 'choice', short: true,
    field: {key: 'skills', label: 'Навыки', propertyType: 'choices', options: SKILLS},
    samples: [['Обычное', ['js', 'sql']], ['Все', ['js', 'php', 'sql', 'ux', 'qa']], ['Пусто', null]],
    error: 'Выберите не больше трёх',
    templates: [{id: 'dropdown', name: 'Выпадающий список', changes: []}, {id: 'checklist', name: 'Флажки', changes: ['edit'], variant: 'checklist', what: 'флажки при любой длине списка'},
      {id: 'badges', name: 'Метки', changes: ['view', 'compact'], variant: 'badges', what: 'метки в цветах вариантов'}],
    server: [['Значение', 'список кодов `["js", "sql"]`'], ['Пустое', '`null` или `[]`'], ['Из правки', 'список кодов в порядке вариантов'], ['Из фильтра', ANY_OF]],
    settings: [['`options`', 'нет', 'все', 'варианты `{value, label, scheme}`'], ['`badgeAppearance`', '`tonal`', 'Показ, Кратко', 'вид меток'], REQUIRED, READONLY],
    storage: ['`choices@1`', 'свойство «Список», несколько значений']},
  lookup: {family: 'choice', short: true,
    field: {key: 'country', label: 'Страна', propertyType: 'lookup', source: 'countries', options: COUNTRIES, placeholder: 'Выберите страну'},
    samples: [['Обычное', COUNTRIES[0]], ['Длинное', COUNTRIES[3]], ['Пусто', null]],
    error: 'Поставки в эту страну закрыты',
    templates: [{id: 'source_picker', name: 'Список справочника', changes: []}],
    server: [['Значение', '`{value: "ru", label: "Россия"}`'], ['Пустое', '`null`'], ['Из правки', PICK_EDIT], ['Из фильтра', ANY_OF]],
    settings: [['`options`', 'нет', 'Правка, Фильтр', 'короткий справочник целиком'], ['`source`', 'нет', 'Правка', 'имя справочника: большой приходит от приложения страницами'],
      ['`multiple`', 'нет', 'все', 'несколько значений; задаётся при создании поля'], REQUIRED, READONLY],
    storage: ['`lookup@1` — одно значение', 'нет']},
  user: {family: 'links', short: true,
    field: {key: 'owner', label: 'Ответственный', propertyType: 'user', placeholder: 'Выберите сотрудника', searchPlaceholder: 'Имя сотрудника'},
    samples: [['Обычное', PEOPLE[0]], ['Длинное', PEOPLE[4]], ['Пусто', null]],
    error: 'Сотрудник в отпуске до 1 декабря',
    templates: [{id: 'reference_picker', name: 'Поиск сотрудника', changes: []}],
    server: [['Значение', '`{value, label, avatarText}`: идентификатор, имя, буквы для аватара'], ['Пустое', '`null`'], ['Из правки', PICK_EDIT], ['Из фильтра', ANY_OF]],
    settings: [['`placeholder`', 'нет', 'Правка', 'подсказка пустого поля'], ['`searchPlaceholder`', 'нет', 'Правка', 'подсказка поиска; кандидатов даёт приложение запросом `field.options`'], REQUIRED, READONLY],
    storage: ['`user@1`', 'свойство «Привязка к сотруднику»']},
  record: {family: 'links', short: true,
    field: {key: 'contract', label: 'Договор', propertyType: 'record', placeholder: 'Выберите договор', searchPlaceholder: 'Номер договора'},
    samples: [['Обычное', CONTRACTS[0]], ['Длинное', CONTRACTS[1]], ['Пусто', null]],
    error: 'Договор закрыт',
    templates: [{id: 'reference_picker', name: 'Поиск записи', changes: []}],
    server: [['Значение', '`{value, label, href}`; `href` — только когда запись можно открыть'], ['Пустое', '`null`'], ['Из правки', PICK_EDIT], ['Из фильтра', ANY_OF]],
    settings: [['`placeholder`', 'нет', 'Правка', 'подсказка пустого поля'], ['`searchPlaceholder`', 'нет', 'Правка', 'подсказка поиска; кандидатов даёт приложение запросом `field.options`'], REQUIRED, READONLY],
    storage: ['`record@1`', 'свойство «Привязка к элементу»']},
  relation: {family: 'links', short: true,
    field: {key: 'client', label: 'Клиент', propertyType: 'relation', placeholder: 'Выберите клиента', searchPlaceholder: 'Название клиента'},
    samples: [['Обычное', CLIENTS[0]], ['Длинное', CLIENTS[1]], ['Пусто', null]],
    error: 'У клиента нет действующего договора',
    templates: [{id: 'reference_picker', name: 'Поиск записи', changes: []}],
    server: [['Значение', '`{value, label, href}`'], ['Пустое', '`null`'], ['Из правки', PICK_EDIT], ['Из фильтра', ANY_OF]],
    settings: [['`placeholder`', 'нет', 'Правка', 'подсказка пустого поля'], ['`searchPlaceholder`', 'нет', 'Правка', 'подсказка поиска; кандидатов даёт приложение запросом `field.options`'], REQUIRED, READONLY],
    storage: ['`relation@1`', 'свойство «Привязка к элементу»']},
  file: {family: 'files',
    field: {key: 'photo', label: 'Фотография', propertyType: 'file', accept: 'image/*', uploadText: 'Перетащите файл или выберите', uploadHint: 'SVG, PNG или JPG, до 10 МБ'},
    samples: [['Обычное', picture('Холмы.svg', 'place-01-3x2.svg')], ['Длинное имя', picture('Ваза из коллекции «Северный ветер», вид сбоку.svg', 'product-01-4x3.svg')], ['Пусто', null]],
    error: 'Файл больше 10 МБ',
    templates: [{id: 'upload', name: 'Загрузка', changes: []}, {id: 'image', name: 'Изображение', changes: ['view', 'compact', 'edit'], variant: 'image', what: 'превью изображения; в правке — поле изображения'},
      {id: 'image_card', name: 'Изображение карточкой', changes: ['view', 'compact'], variant: 'image-card', what: 'изображение крупной карточкой'}],
    server: [['Значение', '`{label, mime, href, size}`; с `multiple` — список таких объектов'], ['Пустое', '`null`'], ['Из правки', 'оставшийся или загруженный файл; загрузку делает приложение запросом `field.upload`'], ['Из фильтра', 'вид файла: `{operator: "in", values: ["image"]}`']],
    settings: [['`accept`', 'любые', 'Правка', 'какие файлы принимать: `.pdf,.docx`, `image/*`'], ['`multiple`', 'нет', 'все', 'несколько файлов; задаётся при создании поля'],
      ['`uploadText`, `uploadHint`', 'слова страницы', 'Правка', 'тексты зоны загрузки'], REQUIRED, READONLY],
    storage: ['`file@1`', 'свойство «Файл» (`file`)']},
  color: {family: 'color', short: true,
    field: {key: 'tag', label: 'Цвет метки', propertyType: 'color', swatches: SWATCHES},
    samples: [['Обычное', '#0f766e'], ['Другой', '#be123c'], ['Пусто', null]],
    error: 'Этот цвет занят другой меткой',
    templates: [{id: 'color_picker', name: 'Выбор цвета', changes: []}],
    server: [['Значение', 'строка `"#0f766e"`'], ['Пустое', '`null`'], ['Из правки', 'строка цвета'], ['Из фильтра', 'цвета палитры: `{operator: "in", values: ["#0f766e"]}`']],
    settings: [['`swatches`', 'палитра Framework', 'Правка, Фильтр', 'образцы в правке и варианты в фильтре'], REQUIRED, READONLY],
    storage: ['`color@1`', 'свойство «Цвет» (`color`)']},
  items: {family: 'composite', set: 'view',
    field: {key: 'lines', label: 'Позиции', propertyType: 'items', minRows: 1, maxRows: 20, columns: ITEM_COLUMNS},
    samples: [['Одна строка', [{name: 'Папка', qty: '10', price: rub('45.50'), sum: rub('455.00')}]],
      ['Несколько', [{name: 'Ручка', qty: '3', price: rub('33.33'), sum: rub('99.99')}, {name: 'Блокнот в твёрдой обложке, формат А5', qty: '2', price: rub('150'), sum: rub('300.00')}]], ['Пусто', null]],
    error: 'Не больше 20 строк',
    templates: [{id: 'rows', name: 'Строки', changes: []}],
    server: [['Значение', 'список строк; строка — объект по ключам колонок, пустая ячейка — нет ключа'], ['Пустое', '`null`'], ['Из правки', 'список строк; вычисленное — подсказка, окончательное считает приложение'], ['Из фильтра', 'число строк, как число']],
    settings: [['`columns`', 'нет', 'все', 'колонки `{key, label, type, compute, total}`'], ['`minRows`, `maxRows`', 'нет', 'Правка', 'сколько строк можно оставить и добавить'], REQUIRED, READONLY],
    storage: ['`items@1`', 'нет']},
  compound: {family: 'composite', set: 'view',
    field: {key: 'address', label: 'Адрес', propertyType: 'compound', parts: ADDRESS_PARTS},
    samples: [['Обычное', {city: 'Казань', street: 'ул. Баумана, 1', zip: '420111'}], ['Без индекса', {city: 'Санкт-Петербург', street: 'Большая Морская ул., 18, офис 412'}], ['Пусто', null]],
    error: 'Индекс — шесть цифр',
    templates: [{id: 'parts', name: 'Части', changes: []}],
    server: [['Значение', 'один объект: ключ — часть, значение — в формате её типа'], ['Пустое', '`null`; пустая часть — нет ключа'], ['Из правки', 'тот же объект'], ['Из фильтра', 'поиск по тексту частей']],
    settings: [['`parts`', 'нет', 'все', 'описания полей — частей значения'], REQUIRED, READONLY],
    storage: ['нет (составное не переносится)', 'свойство «Комплексное» (`complex`)']},
  'ru.requisites': {family: 'composite', set: 'view',
    field: {key: 'requisites', label: 'Реквизиты', propertyType: 'ru.requisites'},
    samples: [['Организация', {inn: '7707083893', kpp: '773601001', ogrn: '1027700132195', account: '40702810938000000001', ...BANK}],
      ['Предприниматель', {inn: '500100732259', account: '40802810938000000008', ...BANK}], ['Пусто', null]],
    error: 'Контрольные цифры ИНН не сходятся',
    templates: [{id: 'requisites', name: 'Поля реквизитов', changes: []}],
    server: [['Значение', '`{inn, kpp, ogrn, bik, account, corr_account}`'], ['Пустое', '`null`'], ['Из правки', 'тот же объект; ошибка в части останавливает сохранение'], ['Из фильтра', 'поиск по тексту реквизитов']],
    settings: [['`parts`', 'все шесть', 'все', 'какие части есть у поля'], REQUIRED, READONLY],
    storage: ['`ru.requisites@1`', 'нет']},
};
