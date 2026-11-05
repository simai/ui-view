// Four screens built only from SIMAI View and SIMAI Framework components, one
// per tab. Each "application" is a few lines of JavaScript over an array; a
// real page answers the same intents from its server. A screen starts the
// first time its tab is shown.
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
    found = [...found].sort((a, b) => (typeof a[order.key] === 'number' ? a[order.key] - b[order.key]
      : String(a[order.key]).localeCompare(String(b[order.key]), 'ru')) * sign);
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

const orderCard = (order) => ({
  answer: 'applied',
  record: {
    record_id: order.id,
    collection: 'shop.orders',
    revision: Number(order.revision),
    label: `Заказ ${order.number}`,
    sections: [{key: 'main', label: 'Заказ', groups: [
      {key: 'order', label: 'Заказ', columns: 2, fields: [
        {key: 'status', label: 'Состояние', propertyType: 'choice', width: 'half', value: order.status, options: ORDER_STATUS.map(({value, label}) => ({value, label}))},
        {key: 'created', label: 'Создан', propertyType: 'date', width: 'half', value: order.created_at.slice(0, 10)},
        {key: 'items', label: 'Товаров', propertyType: 'number', width: 'half', value: order.items},
        {key: 'amount', label: 'Сумма, ₽', propertyType: 'string', width: 'half', value: money.format(order.amount)},
      ]},
      {key: 'delivery', label: 'Доставка', columns: 2, fields: [
        {key: 'buyer', label: 'Покупатель', propertyType: 'string', width: 'half', value: order.buyer},
        {key: 'city', label: 'Город', propertyType: 'string', width: 'half', value: order.city},
        {key: 'delivery', label: 'Способ', propertyType: 'choice', width: 'half', value: order.delivery, options: DELIVERY},
        {key: 'comment', label: 'Комментарий', propertyType: 'text', width: 'full', value: order.items > 4 ? 'Крупный заказ: позвонить перед доставкой.' : ''},
      ]},
    ]}],
  },
});

const startOrders = (root) => {
  const view = root.querySelector('#orders-view');
  const card = root.querySelector('#order-card');
  // The card is in the page only while an order is open: a closed panel
  // still draws its drawer's edge, the close button among it, over the list.
  const home = card.parentElement;
  card.remove();
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
          actions: (order) => (order.status === 'new' || order.status === 'assembly' ? ['view', 'ship'] : ['view']),
        })};
      }
      if (intent === 'record.open') {
        const order = ORDERS.find((item) => String(item.id) === String(payload.record_ids[0]));
        if (order) {
          // The card opens as a panel beside the list; the list keeps the
          // whole width while no order is open.
          card.setAttribute('record-id', order.id);
          card.setAttribute('panel-label', order.number);
          card.hidden = false;
          card.setAttribute('open', 'true');
          if (!card.isConnected) home.append(card);
        }
        return {answer: 'applied'};
      }
      if (intent === 'record.mutate' && payload.action_id === 'ship') {
        const changed = ORDERS.filter((order) => payload.record_ids.map(String).includes(String(order.id)));
        changed.forEach((order) => { order.status = 'shipped'; order.revision = String(Number(order.revision) + 1); });
        log.textContent = `Отгружено: ${changed.map((order) => order.number).join(', ')}`;
        if (card.isConnected && changed.some((order) => order.id === card.getAttribute('record-id'))) card.refresh?.();
        return {answer: 'applied', data: {records: changed.map((order) => ({...order, actions: ['view']}))}};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
    formatFieldValue(field, value) {
      if ((field?.property_type ?? field?.type) === 'datetime') return value ? dateTime.format(new Date(value)) : '';
      if (field?.key === 'amount' && typeof value === 'number') return money.format(value);
      return undefined;
    },
  });

  card.setHostPort({
    version: '1.7.0',
    capabilities: [],
    async raise(intent, payload) {
      const order = ORDERS.find((item) => item.id === (payload?.record_id ?? card.getAttribute('record-id')));
      if (!order) return {answer: 'refused', reason: 'not-found'};
      if (intent === 'record.load') return orderCard(order);
      if (intent === 'group.save') {
        for (const [key, value] of Object.entries(payload?.values ?? {})) if (key in order && key !== 'amount') order[key] = value;
        order.revision = String(Number(order.revision) + 1);
        view.refresh();
        return orderCard(order);
      }
      return {answer: 'unavailable', reason: 'unknown-intent'};
    },
  });

  // Closing is the page's decision: nothing unsaved is kept here, so it closes.
  card.addEventListener('sf-view-properties-close', () => {
    card.setAttribute('open', 'false');
    card.remove();
  });

  root.querySelector('[data-status-filter]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-status]');
    if (!button) return;
    status = button.dataset.status;
    root.querySelectorAll('[data-status]').forEach((item) => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    view.refresh();
  });
};

// ---- Сотрудники ------------------------------------------------------------

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

const startStaff = (root) => {
  const table = root.querySelector('#staff-table');
  const pages = root.querySelector('#staff-pages');
  table.setColumns([
    {key: 'name', label: 'Сотрудник', role: 'title', sortable: true},
    {key: 'position', label: 'Должность', sortable: true, priority: 1},
    {key: 'department', label: 'Отдел', propertyType: 'choice', options: DEPARTMENTS, sortable: true, priority: 2},
    {key: 'city', label: 'Город', sortable: true, priority: 3},
    {key: 'hired', label: 'В компании с', propertyType: 'date', sortable: true, priority: 4},
    {key: 'format', label: 'Формат', propertyType: 'choice', options: WORK_FORMAT, priority: 5},
  ]);
  // A table fed directly asks for search and sorting by events; the page
  // gives it the rows in the order asked.
  const people = PEOPLE.map(([name, position, department, city, hired, format], index) => ({
    id: `p-${index + 1}`, name, position, department, city, hired, format,
  }));
  const departmentLabel = Object.fromEntries(DEPARTMENTS.map(({value, label}) => [value, label]));
  let search = '';
  let sort = null;
  let page = 1;
  let size = Number(pages.getAttribute('page-size')) || 10;
  const show = () => {
    let rows = people.filter((person) => `${person.name} ${person.position} ${departmentLabel[person.department]} ${person.city}`
      .toLowerCase().includes(search));
    if (sort?.direction) {
      const sign = sort.direction === 'desc' ? -1 : 1;
      const value = (person) => (sort.key === 'department' ? departmentLabel[person.department] : person[sort.key]);
      rows = [...rows].sort((a, b) => String(value(a)).localeCompare(String(value(b)), 'ru') * sign);
    }
    page = Math.min(page, Math.max(1, Math.ceil(rows.length / size)));
    pages.setAttribute('total', String(rows.length));
    pages.setAttribute('page-size', String(size));
    pages.setAttribute('current', String(page));
    table.setRows(rows.slice((page - 1) * size, page * size));
  };
  table.addEventListener('sf-view-table-search-change', (event) => { search = event.detail.search.trim().toLowerCase(); page = 1; show(); });
  table.addEventListener('sf-view-table-sort-change', (event) => { sort = event.detail; show(); });
  pages.addEventListener('sf-pagination-change', (event) => { page = event.detail.current; show(); });
  pages.addEventListener('sf-pagination-size-change', (event) => { size = event.detail['page-size'] ?? event.detail.pageSize ?? size; page = 1; show(); });
  show();
};

// ---- Склад -----------------------------------------------------------------

const GOODS = [
  ['Ноутбук', 'electronics', 54990], ['Монитор 27″', 'electronics', 21990], ['Клавиатура беспроводная', 'electronics', 2490],
  ['Мышь оптическая', 'electronics', 890], ['Наушники', 'electronics', 4990], ['Чайник электрический', 'appliances', 2190],
  ['Микроволновая печь', 'appliances', 8990], ['Пылесос', 'appliances', 12490], ['Утюг', 'appliances', 3290],
  ['Дрель-шуруповёрт', 'tools', 6490], ['Набор отвёрток', 'tools', 1190], ['Рулетка 5 м', 'tools', 390],
  ['Бумага А4, 500 листов', 'office', 450], ['Ручка шариковая, 50 шт.', 'office', 690], ['Папка-регистратор', 'office', 260],
  ['Сковорода 28 см', 'kitchen', 2290], ['Кастрюля 4 л', 'kitchen', 1890], ['Набор ножей', 'kitchen', 3490],
  ['Полотенце махровое', 'textile', 790], ['Комплект постельного белья', 'textile', 3990],
];
const CATEGORIES = [
  {value: 'electronics', label: 'Электроника'}, {value: 'appliances', label: 'Бытовая техника'},
  {value: 'tools', label: 'Инструменты'}, {value: 'office', label: 'Канцелярия'},
  {value: 'kitchen', label: 'Посуда'}, {value: 'textile', label: 'Текстиль'},
];
const WAREHOUSES = ['Подольск', 'Шушары', 'Казань', 'Екатеринбург', 'Новосибирск'];
const STOCK_STATUS = [
  {value: 'in', label: 'В наличии', scheme: 'success'},
  {value: 'low', label: 'Мало', scheme: 'warning'},
  {value: 'out', label: 'Нет', scheme: 'neutral'},
];
const stockStatus = (item) => (item.stock === 0 ? 'out' : item.stock < 10 ? 'low' : 'in');
// 640 positions: every product on every warehouse, in several variants.
const STOCK = Array.from({length: 640}, (_, index) => {
  const [name, category, price] = GOODS[index % GOODS.length];
  const variant = Math.floor(index / GOODS.length) % 32;
  const stock = (index * 37) % 11 === 0 ? 0 : (index * 53) % 140;
  const item = {
    id: `s-${index + 1}`,
    sku: `${category.slice(0, 2).toUpperCase()}-${String(1000 + index * 7).padStart(5, '0')}`,
    name: variant ? `${name}, вариант ${variant + 1}` : name,
    category,
    warehouse: WAREHOUSES[index % WAREHOUSES.length],
    stock,
    reserved: Math.min(stock, (index * 3) % 9),
    price: price + variant * 10,
    revision: '1',
  };
  return {...item, status: stockStatus(item)};
});
const STOCK_COLUMNS = [
  {key: 'name', label: 'Товар', role: 'title', sortable: true},
  {key: 'sku', label: 'Артикул', sortable: true, priority: 3},
  {key: 'category', label: 'Категория', property_type: 'choice', options: CATEGORIES, sortable: true, priority: 4},
  {key: 'warehouse', label: 'Склад', sortable: true, priority: 2},
  {key: 'stock', label: 'Остаток, шт.', property_type: 'number', sortable: true, priority: 1},
  {key: 'reserved', label: 'В резерве', property_type: 'number', sortable: true, priority: 5},
  {key: 'price', label: 'Цена, ₽', property_type: 'number', sortable: true, priority: 6},
  {key: 'status', label: 'Наличие', property_type: 'choice', options: STOCK_STATUS},
];

const startWarehouse = (root) => {
  const view = root.querySelector('#stock-view');
  const log = root.querySelector('[data-log]');
  view.setHostPort({
    version: '1.12.0',
    capabilities: ['row-actions'],
    async raise(intent, payload) {
      await pause(250);
      if (intent === 'query.change') {
        return {answer: 'applied', sequence: payload.sequence, data: answerPage(STOCK, payload.query, {
          columns: STOCK_COLUMNS,
          text: (item) => `${item.sku} ${item.name} ${item.warehouse}`,
          rowActions: [{id: 'restock', label: 'Заказать поставку', icon: 'add_shopping_cart'}],
          actions: (item) => (item.status === 'in' ? [] : ['restock']),
        })};
      }
      if (intent === 'record.mutate' && payload.action_id === 'restock') {
        const changed = STOCK.filter((item) => payload.record_ids.map(String).includes(String(item.id)));
        changed.forEach((item) => {
          item.stock += 50;
          item.status = stockStatus(item);
          item.revision = String(Number(item.revision) + 1);
        });
        log.textContent = `Поставка заказана: ${changed.map((item) => `${item.name} (${item.warehouse})`).join(', ')}`;
        return {answer: 'applied', data: {records: changed.map((item) => ({...item, actions: []}))}};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
    formatFieldValue(field, value) {
      if (field?.key === 'price' && typeof value === 'number') return money.format(value);
      return undefined;
    },
  });
};

// ---- Задачи ----------------------------------------------------------------

const TASK_TITLES = [
  'Подготовить отчёт за квартал', 'Обновить прайс-лист', 'Проверить договор с поставщиком', 'Настроить рассылку',
  'Согласовать макет главной', 'Перенести базу клиентов', 'Ответить на обращения поддержки', 'Провести собеседование',
  'Заказать канцелярию', 'Обновить инструкцию для склада', 'Сверить остатки', 'Подготовить презентацию для клиента',
  'Исправить ошибку в корзине', 'Написать статью в блог', 'Проверить счета за октябрь', 'Запланировать встречу с командой',
  'Собрать отзывы клиентов', 'Обновить сертификат сайта', 'Подготовить план закупок', 'Описать процесс возврата',
  'Протестировать оплату', 'Обновить фото товаров', 'Разобрать входящие заявки', 'Проверить доступы сотрудников',
  'Подготовить акт сверки', 'Оформить командировку', 'Обновить карточки товаров', 'Подготовить бриф для дизайнера',
  'Проверить позиции в поиске', 'Составить график отпусков', 'Сделать резервную копию', 'Обучить нового менеджера',
];
const ASSIGNEES = ['Анна Белова', 'Илья Орлов', 'Мария Котова', 'Олег Смирнов', 'Ирина Волкова', 'Артём Попов'];
const TASK_STATUS = [
  {value: 'todo', label: 'Новая', scheme: 'primary'},
  {value: 'doing', label: 'В работе', scheme: 'warning'},
  {value: 'review', label: 'На проверке', scheme: 'primary'},
  {value: 'done', label: 'Готово', scheme: 'success'},
];
const PRIORITY = [
  {value: 'high', label: 'Высокий', scheme: 'warning'},
  {value: 'normal', label: 'Обычный', scheme: 'neutral'},
  {value: 'low', label: 'Низкий', scheme: 'neutral'},
];
const TASKS = TASK_TITLES.map((title, index) => ({
  id: `t-${101 + index}`,
  title,
  assignee: ASSIGNEES[(index * 5) % ASSIGNEES.length],
  priority: ['normal', 'high', 'normal', 'low'][index % 4],
  status: ['todo', 'doing', 'todo', 'review', 'doing', 'done'][index % 6],
  due: new Date(Date.UTC(2026, 10, 3 + (index * 3) % 24)).toISOString().slice(0, 10),
  revision: '1',
}));
const TASK_COLUMNS = [
  {key: 'title', label: 'Задача', role: 'title', sortable: true},
  {key: 'assignee', label: 'Исполнитель', sortable: true, priority: 1},
  {key: 'priority', label: 'Приоритет', property_type: 'choice', options: PRIORITY, sortable: true, priority: 3},
  {key: 'due', label: 'Срок', property_type: 'date', sortable: true, priority: 2},
  {key: 'status', label: 'Состояние', property_type: 'choice', options: TASK_STATUS, sortable: true},
];

const startTasks = (root) => {
  const view = root.querySelector('#tasks-view');
  const log = root.querySelector('[data-log]');
  view.setHostPort({
    version: '1.12.0',
    capabilities: ['row-actions'],
    async raise(intent, payload) {
      await pause();
      if (intent === 'query.change') {
        return {answer: 'applied', sequence: payload.sequence, data: answerPage(TASKS, payload.query, {
          columns: TASK_COLUMNS,
          text: (task) => `${task.title} ${task.assignee}`,
          actions: () => [],
        })};
      }
      if (intent === 'bulk.apply_selected') {
        const ids = payload.record_ids.map(String);
        const stale = TASKS.filter((task) => ids.includes(task.id) && String(payload.revisions?.[task.id] ?? task.revision) !== task.revision);
        if (stale.length) return {answer: 'conflict', conflicts: stale.map((task) => ({id: task.id, current_revision: task.revision}))};
        const status = payload.action_id === 'done' ? 'done' : 'doing';
        const changed = TASKS.filter((task) => ids.includes(task.id));
        changed.forEach((task) => { task.status = status; task.revision = String(Number(task.revision) + 1); });
        log.textContent = `${status === 'done' ? 'Завершено' : 'Взято в работу'}: ${changed.length}`;
        return {answer: 'applied'};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
    formatFieldValue(field, value) {
      if (field?.key === 'due' && value) return dateOnly.format(new Date(`${value}T00:00:00`));
      return undefined;
    },
  });
};

// ---- the tabs --------------------------------------------------------------

const STARTS = {orders: startOrders, staff: startStaff, warehouse: startWarehouse, tasks: startTasks};
const started = new Set();
const start = async (panel) => {
  const name = panel?.dataset.demo;
  if (!name || started.has(name)) return;
  started.add(name);
  await Promise.all(['sf-view', 'sf-view-table', 'sf-view-properties'].map((tag) => customElements.whenDefined(tag)));
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
