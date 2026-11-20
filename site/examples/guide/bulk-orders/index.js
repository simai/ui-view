// A small "application" of orders that answers SIMAI View the way a server
// does: records for a query (a page of the table, lanes of the board, a page
// of cards, the days of the calendar), saved views by level, the record card,
// the actions with marked records. A real page answers the same intents from
// its server; here it is an array.
const pause = (ms = 120) => new Promise((done) => setTimeout(done, ms));
const day = (shift) => {
  const at = new Date();
  at.setDate(at.getDate() + shift);
  return `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, '0')}-${String(at.getDate()).padStart(2, '0')}`;
};
const moment = (shiftDays, hour) => {
  const at = new Date();
  at.setDate(at.getDate() + shiftDays);
  at.setHours(hour, (hour * 7) % 60, 0, 0);
  return at.toISOString();
};
const STATUS = [
  {value: 'new', label: 'Новый', status: 'info'},
  {value: 'wait', label: 'Ждёт оплаты', status: 'warning'},
  {value: 'paid', label: 'Оплачен', status: 'success'},
  {value: 'sent', label: 'Отправлен', scheme: 'primary'},
];
const MANAGERS = [{value: 'u1', label: 'Анна Белова'}, {value: 'u2', label: 'Илья Орлов'}, {value: 'u3', label: 'Мария Котова'}];
const CLIENTS = ['ООО «Ромашка»', 'ИП Сидоров', 'АО «Вектор»', 'ООО «Север»', 'ИП Кузнецова', 'ООО «Гранит»'];
const CITIES = ['Москва', 'Казань', 'Самара', 'Пермь', 'Тверь', 'Омск'];
const FIELDS = [
  {key: 'status', label: 'Состояние', propertyType: 'choice', filter: {options: STATUS}},
  {key: 'manager', label: 'Менеджер', propertyType: 'user', filter: {options: MANAGERS}},
];
const COLUMNS = [
  {key: 'title', label: 'Заказ', role: 'title', sortable: true},
  {key: 'status', label: 'Состояние', property_type: 'choice', options: STATUS},
  {key: 'client', label: 'Клиент', sortable: true},
  {key: 'manager', label: 'Менеджер'},
  {key: 'amount', label: 'Сумма', property_type: 'money', currency: 'RUB', sortable: true},
  {key: 'due', label: 'Доставка', property_type: 'date', sortable: true},
  {key: 'updated', label: 'Изменён', property_type: 'datetime', variant: 'relative', sortable: true},
];
// The guide examples sit in a narrower column than the home: five columns
// keep every value readable there.
const NARROW = COLUMNS.filter((column) => !['manager', 'due'].includes(column.key));
const LAYOUTS = {
  board: {lane_field: 'status', lanes: {order: STATUS.map((lane) => lane.value)}, empty_lanes: 'show', card_fields: ['client', 'amount'], totals: ['count'], per_lane: 4},
  cards: {title_field: 'title', card_fields: ['status', 'client', 'amount', 'due'], card_labels: false, size: 's', more: 'button', per_page: 8},
  calendar: {date_field: 'due', color_field: 'status', event_fields: ['client'], per_day: 3},
};
const VIEWS = [
  {key: 'all', label: 'Все заказы', level: 'system', default: true, revision: '1', query: {filters: {}}},
  {key: 'wait', label: 'Ждут оплаты', level: 'system', revision: '1', query: {filters: {status: {operator: 'in', values: ['wait']}}}, settings: {filter_fields: ['status']}},
  {key: 'by-status', label: 'Заказы по состоянию', level: 'shared', revision: '1', query: {filters: {}}, settings: {layout: 'board'}},
  {key: 'mine', label: 'Мои заказы', level: 'personal', revision: '1', query: {filters: {manager: {operator: 'in', values: ['u1']}}}, settings: {filter_fields: ['manager']}},
];

const makeOrders = (count) => Array.from({length: count}, (_, index) => {
  const manager = MANAGERS[index % 3];
  return {
    id: `o${2001 + index}`, revision: '1', title: `Заказ №${2001 + index}`,
    status: STATUS[(index * 3) % 4].value,
    client: CLIENTS[index % CLIENTS.length], city: CITIES[(index * 5) % CITIES.length],
    manager: manager.label, managerId: manager.value,
    amount: 9800 + index * 2650, due: day((index * 5) % 26 - 6), updated: moment(-((index * 3) % 40), 9 + (index % 9)),
    actions: ['view'],
  };
});

// One application: the list's port (sf-view) and the record card's port
// (sf-view-properties). on(event, text) tells the page what the application
// was asked, for the line under the example.
const ordersApp = ({count = 60, views = false, say = () => {}, bulk = null, columns = NARROW} = {}) => {
  const orders = makeOrders(count);
  let opened = null;
  let current = null; // the key of the open view, echoed with every answer
  const value = (order, key) => (key === 'manager' ? order.managerId : order[key]);
  const matches = (order, query) => {
    const search = String(query.search ?? '').trim().toLowerCase();
    if (search && !`${order.title} ${order.client}`.toLowerCase().includes(search)) return false;
    return Object.entries(query.filters ?? {}).every(([key, condition]) => !condition?.values?.length || condition.values.includes(value(order, key)));
  };
  const listPort = {
    version: '1.15.0',
    capabilities: ['row-actions', ...(views ? ['saved-views'] : [])],
    describe: () => ({fields: FIELDS, layouts: ['table', 'board', 'cards', 'calendar'], permissions: {shared_settings: Boolean(views)}}),
    async raise(intent, payload) {
      await pause();
      if (intent === 'view.open') {
        opened = VIEWS.find((one) => one.key === payload.key) ?? null;
        say(`Приложение открыло представление «${opened?.label ?? payload.key}».`);
        return {answer: 'applied', data: {saved_views: VIEWS}};
      }
      if (intent === 'view.save' || intent === 'view.save_shared') {
        say(intent === 'view.save_shared' ? 'Приложение сохранило представление для всех.' : 'Приложение сохранило представление.');
        return {answer: 'applied', data: {saved_views: VIEWS}};
      }
      if (intent === 'settings.save') return {answer: 'applied'};
      if (intent === 'record.open') return {answer: 'applied'};
      if (intent === 'bulk.apply_selected' && bulk) {
        const ids = payload.record_ids.map(String);
        const marked = orders.filter((order) => ids.includes(order.id));
        const text = bulk(payload.action_id, marked);
        say(text);
        return {answer: 'applied', message: text};
      }
      if (intent !== 'query.change') return {answer: 'unavailable', reason: 'capability-not-provided'};
      const query = {...(payload.query ?? {})};
      let view = query.view ?? {id: current, type: 'table'};
      if (opened) {
        query.filters = JSON.parse(JSON.stringify(opened.query?.filters ?? {}));
        if (opened.settings?.filter_fields) query.filters_chosen = opened.settings.filter_fields;
        current = opened.key;
        view = {...view, type: opened.settings?.layout ?? view.type ?? 'table'};
        opened = null;
      }
      view = {...view, id: current ?? view.id ?? null};
      const window = query.window ?? {};
      const found = orders.filter((order) => matches(order, query));
      const [order] = query.sort ?? [];
      if (order) found.sort((a, b) => (a[order.key] > b[order.key] ? 1 : -1) * (order.direction === 'desc' ? -1 : 1));
      const perPage = query.per_page ?? 20;
      const data = {columns, total: found.length, view_config: {layouts: LAYOUTS}, ...(views ? {saved_views: VIEWS} : {}),
        echo: {filters_chosen: query.filters_chosen ?? ['status', 'manager'], filters: query.filters ?? {}, search: query.search ?? '', sort: query.sort ?? [], page: query.page ?? 1, per_page: perPage, view}};
      if (window.undated) {
        data.records = [];
        data.total = 0;
      } else if (window.lanes) {
        const more = window.lane;
        const per = window.per_lane ?? LAYOUTS.board.per_lane;
        data.records = [];
        data.lanes = STATUS.filter((lane) => !more || lane.value === more).map((lane) => {
          const all = found.filter((one) => one.status === lane.value);
          const from = more ? Number(window.cursor ?? 0) : 0;
          return {value: lane.value, total: all.length, records: all.slice(from, from + per), cursor: from + per < all.length ? String(from + per) : null};
        });
      } else if (window.range) {
        data.records = found.filter((one) => one.due >= window.range[0] && one.due < window.range[1]);
        data.total = data.records.length;
      } else if (window.per_page) {
        const start = ((window.page ?? 1) - 1) * window.per_page;
        data.records = found.slice(start, start + window.per_page);
      } else {
        const start = ((query.page ?? 1) - 1) * perPage;
        data.records = found.slice(start, start + perPage);
      }
      return {answer: 'applied', sequence: payload.sequence, data};
    },
  };
  // The record card: the order in two sections, «Заказ» and «Клиент».
  const record = (order) => {
    const field = (key, label, propertyType, value, extra = {}) => ({key, label, propertyType, value, ...extra});
    return {
      record_id: order.id, collection: 'orders', revision: order.revision, label: order.title, actions: ['record.edit'],
      sections: [
        {key: 'order', label: 'Заказ', groups: [{key: 'main', label: 'Заказ', fields: [
          field('title', 'Название', 'string', order.title, {required: true}),
          field('status', 'Состояние', 'choice', order.status, {options: STATUS}),
          field('amount', 'Сумма, ₽', 'number', order.amount),
          field('manager', 'Менеджер', 'user', {value: order.managerId, label: order.manager}),
          field('due', 'Доставка', 'date', order.due),
        ]}]},
        {key: 'client', label: 'Клиент', groups: [{key: 'company', label: 'Клиент', fields: [
          field('client', 'Компания', 'string', order.client),
          field('city', 'Город', 'string', order.city),
          field('phone', 'Телефон', 'string', '+7 912 345-67-89', {variant: 'phone'}),
        ]}]},
      ],
    };
  };
  const cardPort = {
    version: '1.17.0',
    capabilities: [],
    async raise(intent, payload) {
      await pause(100);
      const order = orders.find((one) => one.id === payload?.record_id);
      if (!order) return {answer: 'refused', reason: 'record-unknown', message: 'Заказ не найден.'};
      if (intent === 'record.load') return {answer: 'applied', record: record(order)};
      if (intent === 'group.save' || intent === 'record.save') {
        Object.assign(order, payload.values);
        order.revision = String(Number(order.revision) + 1);
        say(`Приложение сохранило ${order.title}.`);
        return {answer: 'applied', record: record(order), revision: order.revision};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
  };
  return {orders, listPort, cardPort};
};

// The example shows once the first answer has drawn and its height holds, so
// nothing moves under the reader's eyes while the parts draw.
const frame = () => new Promise((done) => requestAnimationFrame(() => done()));
const settle = async (root) => {
  const limit = Date.now() + 4000;
  let last = -1;
  let still = 0;
  while (still < 5 && Date.now() < limit) {
    await frame();
    const height = root.getBoundingClientRect().height;
    still = height === last ? still + 1 : 0;
    last = height;
  }
};

// ---- Actions with marked records ------------------------------------------------
// The page row's actions (actions="id:Слова|…") show while records are
// marked; a press raises bulk.apply_selected with their ids and revisions,
// and the application answers. Its message is the result line.
const initializeBulk = async () => {
  const root = document.querySelector('[data-bulk-orders-demo]');
  if (!root || root.dataset.exampleReady === 'true') return;
  await Promise.all(['sf-view', 'sf-view-table'].map((tag) => customElements.whenDefined(tag)));
  root.dataset.exampleReady = 'true';
  const log = root.querySelector('[data-log]');
  const view = root.querySelector('sf-view');
  view.querySelector('sf-view-table')?.setFilterFields?.(FIELDS);
  const app = ordersApp({count: 40, say: (text) => { log.textContent = text; }, bulk: (action, marked) => {
    if (action === 'paid') {
      const changed = marked.filter((order) => order.status !== 'paid');
      changed.forEach((order) => { order.status = 'paid'; order.revision = String(Number(order.revision) + 1); });
      return `Отмечено оплаченными: ${changed.length} из ${marked.length}${changed.length < marked.length ? ' (остальные уже оплачены)' : ''}.`;
    }
    return `Напоминание отправлено: ${[...new Set(marked.map((order) => order.client))].join(', ')}.`;
  }});
  view.setHostPort(app.listPort);
  view.addEventListener('sf-view-answer', (event) => {
    if (event.detail?.intent === 'bulk.apply_selected' && event.detail?.answer === 'applied') view.refresh?.();
  });
};

initializeBulk();
