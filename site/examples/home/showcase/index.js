// The views of SIMAI View, one per tab: a table, a card, a table with the card
// of the open row, and cards inside a stream of messages. Each "application"
// is a few lines of JavaScript over an array; a real page answers the same
// intents from its server. A screen starts the first time its tab is shown.
const pause = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
const money = new Intl.NumberFormat('ru-RU');
const dateTime = new Intl.DateTimeFormat('ru-RU', {dateStyle: 'medium', timeStyle: 'short'});
const dateOnly = new Intl.DateTimeFormat('ru-RU', {dateStyle: 'medium'});

// One page of records for a query.change: search, sort and window are the
// application's job, never the component's.
const answerPage = (rows, query, {columns, text, rowActions = [], actions = () => ['view']}) => {
  const search = query.search.trim().toLowerCase();
  let found = rows.filter((row) => !search || text(row).toLowerCase().includes(search));
  const [order] = query.sort;
  if (order) {
    const sign = order.direction === 'desc' ? -1 : 1;
    const value = (row) => (row[order.key] && typeof row[order.key] === 'object' ? row[order.key].label : row[order.key]);
    found = [...found].sort((a, b) => (typeof value(a) === 'number' ? value(a) - value(b)
      : String(value(a) ?? '').localeCompare(String(value(b) ?? ''), 'ru')) * sign);
  }
  const start = (query.page - 1) * query.per_page;
  return {
    columns,
    records: found.slice(start, start + query.per_page).map((row) => ({...row, actions: actions(row)})),
    total: found.length,
    row_actions: rowActions,
    echo: {filters_chosen: query.filters, filters: query.filters, filters_rejected: [], search: query.search, sort: query.sort, page: query.page, per_page: query.per_page},
  };
};

// ---- Заказы ----------------------------------------------------------------

const CITIES = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск', 'Нижний Новгород', 'Самара', 'Краснодар'];
const BUYERS = ['Анна Белова', 'Илья Орлов', 'Мария Котова', 'Олег Смирнов', 'Ирина Волкова', 'Дмитрий Лебедев', 'Екатерина Новикова',
  'Павел Морозов', 'Светлана Кузнецова', 'Артём Попов', 'Юлия Соколова', 'Никита Фёдоров', 'Ольга Михайлова', 'Сергей Васильев'];
const DELIVERY = [{value: 'courier', label: 'Курьер'}, {value: 'pickup', label: 'Пункт выдачи'}, {value: 'post', label: 'Почта'}];
const ORDER_STATUS = [
  {value: 'new', label: 'Новый', scheme: 'primary'},
  {value: 'assembly', label: 'Собирается', scheme: 'warning'},
  {value: 'shipped', label: 'Отгружен', scheme: 'success'},
  {value: 'cancelled', label: 'Отменён', scheme: 'neutral'},
];
const STATUS_ORDER = ['new', 'assembly', 'shipped', 'shipped', 'new', 'assembly', 'shipped', 'cancelled'];
const ORDERS = Array.from({length: 48}, (_, index) => ({
  id: `o-${10421 + index}`,
  number: `№ ${10421 + index}`,
  buyer: BUYERS[(index * 5) % BUYERS.length],
  city: CITIES[(index * 3) % CITIES.length],
  items: 1 + (index * 7) % 6,
  amount: 1490 + ((index * 7919) % 48) * 610,
  delivery: DELIVERY[index % 3].value,
  status: STATUS_ORDER[index % STATUS_ORDER.length],
  created_at: new Date(Date.UTC(2026, 9, 15 + Math.floor(index / 2.4), 9 + (index * 7) % 10, (index * 13) % 60)).toISOString(),
  revision: '1',
})).reverse();
const ORDER_COLUMNS = [
  {key: 'number', label: 'Заказ', role: 'title', sortable: true},
  {key: 'created_at', label: 'Создан', property_type: 'datetime', sortable: true},
  {key: 'buyer', label: 'Покупатель', sortable: true},
  {key: 'city', label: 'Город', sortable: true},
  {key: 'items', label: 'Товаров', property_type: 'number', sortable: true},
  {key: 'amount', label: 'Сумма, ₽', property_type: 'number', sortable: true},
  {key: 'status', label: 'Состояние', property_type: 'choice', options: ORDER_STATUS},
];

const PEOPLE = [
  ['Анна Белова', 'Руководитель проектов', 'pm', 'Москва', '2019-03-11', 'office'],
  ['Илья Орлов', 'Ведущий разработчик', 'dev', 'Казань', '2020-07-01', 'remote'],
  ['Мария Котова', 'Дизайнер интерфейсов', 'design', 'Москва', '2021-02-15', 'hybrid'],
  ['Олег Смирнов', 'Менеджер по продажам', 'sales', 'Санкт-Петербург', '2018-09-03', 'office'],
  ['Ирина Волкова', 'Бухгалтер', 'finance', 'Москва', '2017-05-22', 'office'],
  ['Дмитрий Лебедев', 'Системный администратор', 'ops', 'Новосибирск', '2022-01-10', 'remote'],
  ['Екатерина Новикова', 'Аналитик', 'dev', 'Екатеринбург', '2023-04-03', 'hybrid'],
  ['Павел Морозов', 'Тестировщик', 'dev', 'Самара', '2021-11-08', 'remote'],
  ['Светлана Кузнецова', 'Специалист поддержки', 'support', 'Краснодар', '2022-06-20', 'remote'],
  ['Артём Попов', 'Фронтенд-разработчик', 'dev', 'Москва', '2024-02-12', 'hybrid'],
  ['Юлия Соколова', 'Маркетолог', 'marketing', 'Санкт-Петербург', '2020-10-19', 'office'],
  ['Никита Фёдоров', 'Бэкенд-разработчик', 'dev', 'Нижний Новгород', '2023-08-28', 'remote'],
  ['Ольга Михайлова', 'HR-специалист', 'hr', 'Москва', '2019-12-02', 'office'],
  ['Сергей Васильев', 'Технический директор', 'dev', 'Москва', '2016-04-18', 'office'],
  ['Наталья Егорова', 'Редактор', 'marketing', 'Казань', '2022-09-05', 'remote'],
  ['Алексей Павлов', 'Менеджер по продажам', 'sales', 'Екатеринбург', '2021-03-29', 'hybrid'],
  ['Татьяна Зайцева', 'Специалист поддержки', 'support', 'Самара', '2023-01-16', 'remote'],
  ['Роман Голубев', 'DevOps-инженер', 'ops', 'Москва', '2020-02-24', 'hybrid'],
  ['Виктория Николаева', 'Финансовый аналитик', 'finance', 'Москва', '2024-05-13', 'office'],
  ['Максим Андреев', 'Дизайнер', 'design', 'Санкт-Петербург', '2022-11-21', 'remote'],
  ['Елена Степанова', 'Руководитель поддержки', 'support', 'Краснодар', '2018-06-11', 'office'],
  ['Кирилл Романов', 'Мобильный разработчик', 'dev', 'Новосибирск', '2023-10-02', 'remote'],
  ['Полина Захарова', 'Менеджер по персоналу', 'hr', 'Москва', '2021-08-16', 'hybrid'],
  ['Григорий Ильин', 'Архитектор решений', 'dev', 'Москва', '2017-10-30', 'office'],
];
const DEPARTMENTS = [
  {value: 'dev', label: 'Разработка', scheme: 'primary'},
  {value: 'design', label: 'Дизайн', scheme: 'primary'},
  {value: 'pm', label: 'Проекты', scheme: 'primary'},
  {value: 'sales', label: 'Продажи', scheme: 'success'},
  {value: 'marketing', label: 'Маркетинг', scheme: 'success'},
  {value: 'support', label: 'Поддержка', scheme: 'warning'},
  {value: 'ops', label: 'Инфраструктура', scheme: 'warning'},
  {value: 'finance', label: 'Финансы', scheme: 'neutral'},
  {value: 'hr', label: 'Персонал', scheme: 'neutral'},
];
const WORK_FORMAT = [
  {value: 'office', label: 'В офисе', scheme: 'neutral'},
  {value: 'hybrid', label: 'Гибрид', scheme: 'neutral'},
  {value: 'remote', label: 'Удалённо', scheme: 'neutral'},
];

// Dates and numbers are the page's to format: the set shows a value as it
// arrives unless the host says otherwise.
const formatFieldValue = (field, value) => {
  const type = field?.propertyType ?? field?.property_type ?? field?.type;
  if (value == null || value === '') return undefined;
  if (type === 'datetime') return dateTime.format(new Date(value));
  if (type === 'date') return dateOnly.format(new Date(`${String(value).slice(0, 10)}T00:00:00`));
  if ((type === 'number' || type === 'integer') && typeof value === 'number' && field?.variant !== 'scale') return money.format(value);
  return undefined;
};
const segmented = (group, attribute, onChange) => group.addEventListener('click', (event) => {
  const button = event.target.closest(`[${attribute}]`);
  if (!button) return;
  group.querySelectorAll(`[${attribute}]`).forEach((item) => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  onChange(button.getAttribute(attribute));
});

// ---- Таблица ----------------------------------------------------------------

const startTable = (root) => {
  const view = root.querySelector('#orders-view');
  const log = root.querySelector('[data-log]');
  let status = '';
  view.setHostPort({
    version: '1.12.0',
    capabilities: ['row-actions'],
    async raise(intent, payload) {
      await pause();
      if (intent === 'query.change') {
        const rows = ORDERS.filter((order) => !status || order.status === status);
        return {answer: 'applied', sequence: payload.sequence, data: answerPage(rows, payload.query, {
          columns: ORDER_COLUMNS,
          text: (order) => `${order.number} ${order.buyer} ${order.city}`,
          rowActions: [{id: 'ship', label: 'Отгрузить', icon: 'local_shipping'}],
          actions: (order) => (order.status === 'new' || order.status === 'assembly' ? ['ship'] : []),
        })};
      }
      const apply = (ids, action) => {
        const next = action === 'cancel' ? 'cancelled' : 'shipped';
        const changed = ORDERS.filter((order) => ids.includes(String(order.id)) && order.status !== 'shipped' && order.status !== 'cancelled');
        changed.forEach((order) => { order.status = next; order.revision = String(Number(order.revision) + 1); });
        log.textContent = changed.length
          ? `${next === 'shipped' ? 'Отгружено' : 'Отменено'}: ${changed.map((order) => order.number).join(', ')}`
          : 'Эти заказы уже отгружены или отменены.';
        return changed;
      };
      if (intent === 'record.mutate' && payload.action_id === 'ship') {
        const changed = apply(payload.record_ids.map(String), 'ship');
        return {answer: 'applied', data: {records: changed.map((order) => ({...order, actions: []}))}};
      }
      if (intent === 'bulk.apply_selected') {
        apply(payload.record_ids.map(String), payload.action_id);
        return {answer: 'applied'};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
    formatFieldValue,
  });
  segmented(root.querySelector('[data-status-filter]'), 'data-status', (value) => { status = value; view.refresh(); });
};

// ---- Сотрудники: данные карточки --------------------------------------------

const SKILLS = [
  {value: 'js', label: 'JavaScript', scheme: 'primary'}, {value: 'php', label: 'PHP', scheme: 'primary'},
  {value: 'sql', label: 'SQL', scheme: 'success'}, {value: 'ux', label: 'Интерфейсы', scheme: 'warning'},
  {value: 'sales', label: 'Переговоры', scheme: 'success'}, {value: 'docs', label: 'Документация', scheme: 'neutral'},
];
const ENGLISH = [{value: 'a2', label: 'A2'}, {value: 'b1', label: 'B1'}, {value: 'b2', label: 'B2'}, {value: 'c1', label: 'C1'}];
const CITY_LIST = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск', 'Нижний Новгород', 'Самара', 'Краснодар']
  .map((label, index) => ({value: `city-${index}`, label}));
const initials = (name) => name.split(' ').map((part) => part[0]).join('');
const LATIN = {а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ы: 'y', э: 'e', ю: 'yu', я: 'ya', ь: '', ъ: ''};
const latin = (text) => [...text.toLowerCase()].map((letter) => LATIN[letter] ?? letter).join('');
const EMPLOYEES = PEOPLE.map(([name, position, department, city, hired, format], index) => {
  const [first, last] = name.split(' ');
  return {
    id: `e-${index + 1}`, name, position, department, hired, format,
    city: CITY_LIST.find((item) => item.label === city) ?? CITY_LIST[0],
    phone: `+7 9${String(16 + index).padStart(2, '0')} ${String(100 + index * 37).slice(0, 3)}-${String(10 + index).padStart(2, '0')}-${String(40 + index * 3).slice(-2)}`,
    email: `${latin(first)[0]}.${latin(last)}@example.ru`,
    manager: index === 13 ? null : {value: 'e-14', label: 'Сергей Васильев', avatarText: 'СВ'},
    skills: [['js', 'sql'], ['php', 'sql', 'docs'], ['ux'], ['sales'], ['docs'], ['sql', 'docs'], ['js', 'ux']][index % 7],
    english: ENGLISH[index % 4].value,
    rate: 90000 + ((index * 7919) % 17) * 5000,
    load: 40 + ((index * 37) % 60),
    mentor: index % 3 === 0,
    about: index % 2 ? '' : `${position}. В компании с ${new Date(hired).getFullYear()} года, ведёт внутренние проекты отдела.`,
    documents: index % 4 === 1 ? [] : [{label: 'Трудовой договор.pdf', mime: 'application/pdf', href: '#file', size: 184320}],
    revision: 1,
  };
});
const STAFF_COLUMNS = [
  {key: 'name', label: 'Сотрудник', role: 'title', sortable: true},
  {key: 'position', label: 'Должность', sortable: true, priority: 1},
  {key: 'department', label: 'Отдел', property_type: 'choice', options: DEPARTMENTS, sortable: true, priority: 2},
  {key: 'city', label: 'Город', property_type: 'lookup', sortable: true, priority: 3},
  {key: 'hired', label: 'В компании с', property_type: 'date', sortable: true, priority: 4},
  {key: 'format', label: 'Формат', property_type: 'choice', options: WORK_FORMAT, priority: 5},
];

const employeeCard = (person) => ({
  record_id: person.id,
  collection: 'hr.employees',
  revision: String(person.revision),
  label: person.name,
  actions: ['record.edit'],
  sections: [{key: 'main', label: 'Сотрудник', groups: [
    {key: 'job', label: 'Работа', columns: 2, fields: [
      {key: 'name', label: 'ФИО', propertyType: 'string', width: 'half', required: true, value: person.name},
      {key: 'position', label: 'Должность', propertyType: 'string', width: 'half', value: person.position},
      {key: 'department', label: 'Отдел', propertyType: 'choice', width: 'half', options: DEPARTMENTS, value: person.department},
      {key: 'manager', label: 'Руководитель', propertyType: 'user', width: 'half', placeholder: 'Выберите сотрудника', value: person.manager},
      {key: 'hired', label: 'В компании с', propertyType: 'date', width: 'half', value: person.hired},
      {key: 'format', label: 'Формат работы', propertyType: 'choice', variant: 'buttons', width: 'half', options: WORK_FORMAT, value: person.format},
    ]},
    {key: 'contacts', label: 'Контакты', columns: 2, fields: [
      {key: 'phone', label: 'Телефон', propertyType: 'string', variant: 'phone', width: 'half', value: person.phone},
      {key: 'email', label: 'Почта', propertyType: 'string', width: 'half', value: person.email},
      {key: 'city', label: 'Город', propertyType: 'lookup', source: 'cities', width: 'half', options: CITY_LIST, value: person.city},
    ]},
    {key: 'profile', label: 'Профиль', columns: 2, fields: [
      {key: 'skills', label: 'Навыки', propertyType: 'choices', width: 'full', options: SKILLS, value: person.skills},
      {key: 'english', label: 'Английский', propertyType: 'choice', width: 'half', options: ENGLISH, value: person.english},
      {key: 'load', label: 'Загрузка', propertyType: 'number', variant: 'scale', width: 'half', min: 0, max: 100, value: person.load},
      {key: 'rate', label: 'Оклад', propertyType: 'number', unit: '₽', width: 'half', value: person.rate},
      {key: 'mentor', label: 'Наставник', propertyType: 'boolean', width: 'half', value: person.mentor},
      {key: 'about', label: 'О сотруднике', propertyType: 'text', width: 'full', placeholder: 'Пара слов о сотруднике', value: person.about},
      {key: 'documents', label: 'Документы', propertyType: 'file', multiple: true, accept: '.pdf', width: 'full', value: person.documents},
    ]},
  ]}],
});

// One host for every employee card: read, save, people to choose from,
// cities, files.
const employeeHost = (log, onSaved = () => {}) => ({
  version: '1.17.0',
  capabilities: ['field-options', 'field-upload'],
  async raise(intent, payload) {
    await pause(150);
    const person = EMPLOYEES.find((item) => item.id === payload?.record_id);
    if (intent === 'field.options') {
      const search = String(payload.search ?? '').toLowerCase();
      const all = payload.field === 'city' ? CITY_LIST
        : EMPLOYEES.map((item) => ({value: item.id, label: item.name, avatarText: initials(item.name)}));
      const items = all.filter((item) => item.label.toLowerCase().includes(search));
      return {answer: 'applied', options_page: {items, next_cursor: null, total: items.length}};
    }
    if (intent === 'field.upload') {
      const file = payload.file;
      return {answer: 'applied', file: {label: file?.name ?? 'Файл', mime: file?.type ?? '', size: file?.size ?? 0, href: '#file'}};
    }
    if (!person) return {answer: 'refused', reason: 'record-unknown', message: 'Сотрудник не найден.'};
    if (intent === 'record.load') return {answer: 'applied', record: employeeCard(person)};
    if (intent === 'group.save' || intent === 'record.save') {
      if ('name' in payload.values && !String(payload.values.name ?? '').trim()) {
        return {answer: 'refused', reason: 'record_invalid', errors: {name: 'Укажите ФИО сотрудника.'}};
      }
      Object.assign(person, payload.values);
      person.revision += 1;
      if (log) log.textContent = `Сохранено: ${Object.keys(payload.values).length} поле(й), версия ${person.revision}.`;
      onSaved(person);
      return {answer: 'applied', record: employeeCard(person), revision: String(person.revision)};
    }
    return {answer: 'unavailable', reason: 'capability-not-provided'};
  },
  formatFieldValue,
});

// ---- Карточка ---------------------------------------------------------------

const startCard = (root) => {
  const card = root.querySelector('#employee-card');
  card.setHostPort(employeeHost(root.querySelector('[data-log]')));
  segmented(root.querySelector('[data-card-mode]'), 'data-mode', (mode) => card.setAttribute('mode', mode));
};

// ---- Таблица и карточка -----------------------------------------------------

const startMaster = (root) => {
  const view = root.querySelector('#staff-view');
  // The card is in the page only while a record is open: a closed panel
  // still draws its drawer's edge, the close button among it, over the list.
  const home = root;
  const card = document.createElement('sf-view-properties');
  card.setAttribute('aria-label', 'Карточка сотрудника');
  card.setAttribute('panel', '');
  card.setAttribute('panel-size', '1');
  card.setAttribute('mode', 'auto');
  card.setHostPort(employeeHost(null, () => view.refresh()));
  const departmentLabel = Object.fromEntries(DEPARTMENTS.map(({value, label}) => [value, label]));
  view.setHostPort({
    version: '1.12.0',
    capabilities: ['row-actions'],
    async raise(intent, payload) {
      await pause();
      if (intent === 'query.change') {
        const rows = EMPLOYEES.map((person) => ({id: person.id, name: person.name, position: person.position, department: person.department,
          city: person.city, hired: person.hired, format: person.format, revision: String(person.revision)}));
        return {answer: 'applied', sequence: payload.sequence, data: answerPage(rows, payload.query, {
          columns: STAFF_COLUMNS,
          text: (person) => `${person.name} ${person.position} ${departmentLabel[person.department]} ${person.city.label}`,
        })};
      }
      if (intent === 'record.open') {
        const person = EMPLOYEES.find((item) => String(item.id) === String(payload.record_ids[0]));
        if (person) {
          card.setAttribute('record-id', person.id);
          card.setAttribute('panel-label', person.name);
          card.hidden = false;
          card.setAttribute('open', 'true');
          if (!card.isConnected) home.append(card);
        }
        return {answer: 'applied'};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
    formatFieldValue,
  });
  // Closing is the page's decision: nothing unsaved is kept here, so it closes.
  card.addEventListener('sf-view-properties-close', () => {
    card.setAttribute('open', 'false');
    card.remove();
  });
};

// ---- В потоке ---------------------------------------------------------------

const VACATION = {
  record_id: 'v-17', collection: 'hr.vacations', revision: '3', label: 'Заявка на отпуск № 17', actions: [],
  sections: [{key: 'main', label: 'Заявка', groups: [{key: 'vacation', label: 'Заявка на отпуск № 17', columns: 2, fields: [
    {key: 'employee', label: 'Сотрудник', propertyType: 'user', width: 'full', value: {value: 'e-5', label: 'Ирина Волкова', avatarText: 'ИВ'}},
    {key: 'from', label: 'С', propertyType: 'date', width: 'half', value: '2026-12-21'},
    {key: 'to', label: 'По', propertyType: 'date', width: 'half', value: '2027-01-08'},
    {key: 'days', label: 'Дней', propertyType: 'integer', width: 'half', value: 19},
    {key: 'status', label: 'Статус', propertyType: 'choice', width: 'half', value: 'approved',
      options: [{value: 'approved', label: 'Согласована', scheme: 'success'}]},
  ]}]}],
};
const TRIPS = [];
const tripFields = (trip = {}) => [
  {key: 'city', label: 'Город', propertyType: 'string', width: 'half', required: true, placeholder: 'Куда', value: trip.city ?? null},
  {key: 'from', label: 'Выезд', propertyType: 'date', width: 'half', required: true, value: trip.from ?? null},
  {key: 'nights', label: 'Ночей', propertyType: 'integer', variant: 'stepper', width: 'half', min: 1, max: 14, step: 1, value: trip.nights ?? 2},
  {key: 'advance', label: 'Аванс', propertyType: 'number', unit: '₽', width: 'half', value: trip.advance ?? null},
  {key: 'goal', label: 'Цель поездки', propertyType: 'text', width: 'full', placeholder: 'Например, встреча с заказчиком', value: trip.goal ?? null},
];
const tripRecord = (trip) => ({
  record_id: trip?.id ?? null, collection: 'hr.trips', revision: trip ? '1' : null,
  label: trip ? `Командировка в ${trip.city}` : 'Новая командировка', actions: [],
  sections: [{key: 'main', label: 'Командировка', groups: [{key: 'trip', label: trip ? `Командировка: ${trip.city}` : 'Командировка Ильи Орлова', columns: 2, fields: tripFields(trip)}]}],
});

const feedHost = (onCreated) => ({
  version: '1.17.0',
  capabilities: [],
  async raise(intent, payload) {
    await pause(150);
    if (intent === 'record.load' && payload.collection === 'hr.vacations') return {answer: 'applied', record: VACATION};
    if (intent === 'record.load' && payload.collection === 'hr.trips') {
      const trip = TRIPS.find((item) => item.id === payload.record_id);
      return {answer: 'applied', record: tripRecord(trip)};
    }
    if (intent === 'record.create') {
      const values = payload.values ?? {};
      const errors = {};
      if (!String(values.city ?? '').trim()) errors.city = 'Укажите город.';
      if (!values.from) errors.from = 'Укажите дату выезда.';
      if (Object.keys(errors).length) return {answer: 'refused', reason: 'record_invalid', errors};
      const trip = {id: `t-${TRIPS.length + 1}`, nights: 2, ...values};
      TRIPS.push(trip);
      setTimeout(() => onCreated(trip), 300);
      return {answer: 'applied', record_id: trip.id, record: tripRecord(trip)};
    }
    return {answer: 'unavailable', reason: 'capability-not-provided'};
  },
  formatFieldValue,
});

const startFeed = (root) => {
  const feed = root.querySelector('#feed');
  const drawn = new Map();
  let host;
  const card = (entry) => {
    const element = document.createElement('sf-view-properties');
    element.className = 'feed-card';
    element.setAttribute('size', '1/2');
    element.setAttribute('aria-label', entry.cardLabel);
    element.setAttribute('collection', entry.collection);
    element.setAttribute('mode', entry.mode);
    if (entry.recordId) element.setAttribute('record-id', entry.recordId);
    element.setHostPort(host);
    return element;
  };
  // A message is its author, its words and, for some, a card. A drawn
  // message is kept, so redrawing the feed does not read the card again.
  feed.renderItem = (entry, {first, own}) => {
    if (drawn.has(entry.id)) return drawn.get(entry.id);
    const article = document.createElement('article');
    article.className = 'sf-list-feed__entry';
    const name = own ? 'Вы' : entry['author-name'];
    article.setAttribute('aria-label', name);
    if (first && !own) {
      const author = document.createElement('p');
      author.className = 'sf-list-feed__author';
      author.textContent = name;
      article.append(author);
    }
    const text = document.createElement('p');
    text.className = 'sf-list-feed__text';
    text.textContent = entry.text;
    article.append(text);
    if (entry.mode) article.append(card(entry));
    drawn.set(entry.id, article);
    return article;
  };
  host = feedHost((trip) => {
    feed.upsert({id: `m-done-${trip.id}`, author: 'bot', 'author-name': 'Ассистент',
      text: `Готово: командировка в ${trip.city} создана и отправлена руководителю на согласование.`,
      mode: 'view', collection: 'hr.trips', recordId: trip.id, cardLabel: `Командировка в ${trip.city}`});
  });
  feed.setItems([
    {id: 'm-1', author: 'me', own: true, text: 'Покажи заявку Ирины Волковой на отпуск.'},
    {id: 'm-2', author: 'bot', 'author-name': 'Ассистент', text: 'Нашёл заявку — она уже согласована:',
      mode: 'view', collection: 'hr.vacations', recordId: 'v-17', cardLabel: 'Заявка на отпуск № 17'},
    {id: 'm-3', author: 'me', own: true, text: 'Оформи командировку для Ильи Орлова.'},
    {id: 'm-4', author: 'bot', 'author-name': 'Ассистент', text: 'Заполните несколько полей, и я создам командировку:',
      mode: 'create', collection: 'hr.trips', cardLabel: 'Новая командировка'},
  ]);
};

// ---- the tabs --------------------------------------------------------------

const STARTS = {table: startTable, card: startCard, master: startMaster, feed: startFeed};
const TAGS = {table: ['sf-view'], card: ['sf-view-properties'], master: ['sf-view', 'sf-view-properties'], feed: ['sf-list-feed', 'sf-view-properties']};
const started = new Set();
const start = async (panel) => {
  const name = panel?.dataset.demo;
  if (!name || started.has(name)) return;
  started.add(name);
  await Promise.all(TAGS[name].map((tag) => customElements.whenDefined(tag)));
  STARTS[name](panel);
};

const initializeShowcase = async () => {
  const root = document.querySelector('[data-showcase]');
  if (!root || root.dataset.exampleReady === 'true') return;
  root.dataset.exampleReady = 'true';
  const tabs = root.querySelector('sf-tabs');
  const panels = [...tabs.querySelectorAll('[data-demo]')];
  tabs.addEventListener('sf-tab-change', (event) => start(panels[event.detail.current]));
  await customElements.whenDefined('sf-tabs');
  start(panels[Number(tabs.getAttribute('active-index') ?? 0)]);
};

initializeShowcase();
