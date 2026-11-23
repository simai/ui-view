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
const CHANNELS = [{value: 'site', label: 'Сайт'}, {value: 'phone', label: 'Телефон'}, {value: 'mail', label: 'Почта'}, {value: 'market', label: 'Маркетплейс'}];
const PAYMENTS = [{value: 'card', label: 'Картой'}, {value: 'invoice', label: 'По счёту'}, {value: 'cash', label: 'Наличными'}];
const PRIORITIES = [{value: 'usual', label: 'Обычная'}, {value: 'urgent', label: 'Срочно', status: 'error'}];
const METHODS = [{value: 'courier', label: 'Курьер'}, {value: 'pickup', label: 'Самовывоз'}, {value: 'post', label: 'Почта России'}, {value: 'tk', label: 'Транспортная компания'}];
const COMMENTS = ['', 'Позвонить за час до доставки', 'Счёт на юрлицо', '', 'Упаковать каждую позицию отдельно'];
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
  cards: {title_field: 'title', card_fields: ['status', 'client', 'amount', 'due'], card_labels: false, size: 's', more: 'button', per_page: 10},
  calendar: {date_field: 'due', color_field: 'status', event_fields: ['client'], per_day: 3},
};
const VIEWS = [
  {key: 'all', label: 'Все заказы', level: 'system', default: true, revision: '1', query: {}},
  {key: 'large', label: 'Крупные сверху', level: 'system', revision: '1', query: {sort: [{key: 'amount', direction: 'desc'}]}},
  {key: 'by-status', label: 'Заказы по состоянию', level: 'shared', revision: '1', query: {}, settings: {layout: 'board'}},
  {key: 'mine', label: 'Мои карточки', level: 'personal', revision: '1', query: {}, settings: {layout: 'cards'}},
];
// What to show is a saved filter's (view-config/1 1.1.0): the conditions
// live here, under «Фильтр», never in a view.
const SAVED_FILTERS = [
  {id: 'wait', name: 'Ждут оплаты', fields: ['status'], filters: {status: {operator: 'in', values: ['wait']}}, shared: true, default: false},
  {id: 'mine', name: 'Мои заказы', fields: ['manager'], filters: {manager: {operator: 'in', values: ['u1']}}, shared: false, default: false},
];

const makeOrders = (count, from = 0) => Array.from({length: count}, (_, step) => {
  const index = from + step;
  const manager = MANAGERS[index % 3];
  return {
    id: `o${2001 + index}`, revision: '1', title: `Заказ №${2001 + index}`,
    status: STATUS[(index * 3) % 4].value,
    client: CLIENTS[index % CLIENTS.length], city: CITIES[(index * 5) % CITIES.length],
    manager: manager.label, managerId: manager.value,
    amount: 9800 + index * 2650, due: day((index * 5) % 26 - 6), updated: moment(-((index * 3) % 40), 9 + (index % 9)),
    comment: COMMENTS[index % COMMENTS.length],
    channel: CHANNELS[index % 4].value, payment: PAYMENTS[index % 3].value, priority: PRIORITIES[index % 5 === 0 ? 1 : 0].value,
    method: METHODS[(index * 3) % 4].value,
    inn: String(7700000000 + index * 7919).slice(0, 10), contact: ['Олег Смирнов', 'Ирина Волкова', 'Павел Зуев'][index % 3],
    phone: `+7 495 ${String(100 + index).padStart(3, '0')}-${String(10 + (index * 7) % 90).padStart(2, '0')}-${String(10 + (index * 13) % 90).padStart(2, '0')}`,
    site: `https://client${index + 1}.example.ru`, address: `${CITIES[(index * 5) % CITIES.length]}, ул. Садовая, д. ${index + 3}, склад ${1 + index % 4}`,
    track: index % 2 ? `RU${48213000 + index * 37}` : '', paid: (index * 3) % 4 >= 2,
    actions: ['view'],
  };
});
// The actions the application offers for marked orders: the bar under the
// list (sf-bulk-actions) in every layout, and «Выбрать все» under the filter
// (capability bulk-under-filter).
const BULK = [
  {id: 'paid', label: 'Отметить оплаченными', icon: 'payments'},
  {id: 'manager', label: 'Передать Илье Орлову', icon: 'person'},
  {id: 'export', label: 'Выгрузить', icon: 'download'},
  {id: 'delete', label: 'Удалить', icon: 'delete'},
];
// A new order, empty, for «Создать».
const blank = () => ({id: null, title: '', status: 'new', amount: null, managerId: null, manager: '', due: null, client: '', city: '', comment: '',
  channel: 'site', payment: 'card', priority: 'usual', method: 'courier', inn: '', contact: '', phone: '', site: '', address: '', track: '', paid: false, revision: null});

// One application: the list's port (sf-view) and the record card's port
// (sf-view-properties). on(event, text) tells the page what the application
// was asked, for the line under the example.
// layout: the layout a list without a head is drawn in (a preview); the
// answer names it as the view's type.
// full: the record card with everything the release has (the head, edit at
// the value, the history, «⋯», delete) and the list head's «Создать» and «⋯»;
// onCreate opens the new record's card; with full the application also
// answers the BULK actions and calls refresh after one.
const ordersApp = ({count = 60, views = false, say = () => {}, bulk = null, columns = NARROW, layout = null, full = false, onCreate = () => {}, refresh = () => {}} = {}) => {
  const orders = makeOrders(count);
  let opened = null;
  let current = null; // the key of the open view, echoed with every answer
  const filters = JSON.parse(JSON.stringify(SAVED_FILTERS));
  const value = (order, key) => (key === 'manager' ? order.managerId : order[key]);
  const matches = (order, query) => {
    const search = String(query.search ?? '').trim().toLowerCase();
    if (search && !`${order.title} ${order.client}`.toLowerCase().includes(search)) return false;
    return Object.entries(query.filters ?? {}).every(([key, condition]) => !condition?.values?.length || condition.values.includes(value(order, key)));
  };
  // The person's column layer (port capability personal-column-settings):
  // every answer carries it with its revision, and a change made in
  // «Колонки» or the table's gear comes back as settings.save_personal.
  let personal = {revision: '1', columns: {}};
  const columnSettings = () => ({target: {kind: 'personal', revision: personal.revision}, layers: {personal}});
  const listPort = {
    version: '1.15.0',
    capabilities: ['row-actions', 'personal-column-settings', ...(views ? ['saved-views'] : []), ...(full ? ['create-record', 'bulk-under-filter'] : [])],
    // The list head's «⋯»: the card's own field settings, rights and export
    // (the last two are the application's pages: the page hears settings-open).
    describe: () => ({fields: FIELDS, layouts: ['table', 'board', 'cards', 'calendar'],
      permissions: {shared_settings: Boolean(views), ...(full ? {record_fields: true, rights: true, export: true} : {})}}),
    async raise(intent, payload) {
      await pause();
      if (intent === 'view.open') {
        opened = VIEWS.find((one) => one.key === payload.key) ?? null;
        say(`Приложение открыло представление «${opened?.label ?? payload.key}».`);
        return {answer: 'applied', data: {saved_views: VIEWS}};
      }
      // Saved filters: «Фильтр» and its bookmark (filter.save, rename, delete…).
      if (intent.startsWith('filter.')) {
        if (intent === 'filter.save') filters.push({...payload.filter, id: `f${filters.length + 1}`});
        if (intent === 'filter.rename') Object.assign(filters.find((one) => one.id === payload.id) ?? {}, {name: payload.name});
        if (intent === 'filter.update') Object.assign(filters.find((one) => one.id === payload.id) ?? {}, {fields: payload.fields, filters: payload.filters});
        if (intent === 'filter.share') Object.assign(filters.find((one) => one.id === payload.id) ?? {}, {shared: payload.shared});
        if (intent === 'filter.default') filters.forEach((one) => { one.default = one.id === payload.id; });
        const at = filters.findIndex((one) => one.id === payload.id);
        if (intent === 'filter.delete' && at >= 0) filters.splice(at, 1);
        say(`Приложение: ${intent}.`);
        return {answer: 'applied', data: {saved_filters: filters}};
      }
      if (intent === 'view.save' || intent === 'view.save_shared') {
        say(intent === 'view.save_shared' ? 'Приложение сохранило представление для всех.' : 'Приложение сохранило представление.');
        return {answer: 'applied', data: {saved_views: VIEWS}};
      }
      if (intent === 'settings.save_personal') {
        if (String(payload.base_revision) !== personal.revision) return {answer: 'conflict', current_revision: personal.revision};
        personal = {revision: String(Number(personal.revision) + 1), columns: payload.columnSettings ?? {}};
        say('Приложение сохранило для вас колонки (settings.save_personal).');
        return {answer: 'applied', data: {column_settings: columnSettings()}};
      }
      if (intent === 'settings.save') return {answer: 'applied'};
      if (intent === 'record.open') return {answer: 'applied'};
      if (intent === 'view.create_record' && full) { onCreate(payload); return {answer: 'applied'}; }
      // The marked orders, or every order under the filter («Выбрать все»):
      // the change is made in this page's array only.
      if (full && (intent === 'bulk.apply_selected' || intent === 'bulk.apply_under_filter')) {
        const ids = intent === 'bulk.apply_selected' ? (payload.record_ids ?? []).map(String) : orders.filter((order) => matches(order, payload.query ?? {})).map((order) => order.id);
        const hit = orders.filter((order) => ids.includes(order.id));
        const action = payload.action_id ?? payload.action;
        if (action === 'paid') for (const order of hit) { order.status = 'paid'; order.paid = true; }
        if (action === 'manager') for (const order of hit) { order.managerId = 'u2'; order.manager = 'Илья Орлов'; }
        if (action === 'delete') for (const order of hit) orders.splice(orders.indexOf(order), 1);
        for (const order of hit) order.revision = String(Number(order.revision) + 1);
        const words = {paid: 'отмечены оплаченными', manager: 'переданы Илье Орлову', export: 'выгружены', delete: 'удалены'};
        const text = `Приложение: ${hit.length} ${intent === 'bulk.apply_selected' ? 'отмеченных' : 'под фильтром'} — ${words[action] ?? action}.`;
        say(text);
        setTimeout(refresh, 0);
        return {answer: 'applied', message: text};
      }
      if (intent === 'bulk.apply_selected' && bulk) {
        const ids = payload.record_ids.map(String);
        const marked = orders.filter((order) => ids.includes(order.id));
        const text = bulk(payload.action_id, marked);
        say(text);
        return {answer: 'applied', message: text};
      }
      if (intent !== 'query.change') return {answer: 'unavailable', reason: 'capability-not-provided'};
      const query = {...(payload.query ?? {})};
      let view = query.view ?? {id: current, type: layout && layout !== 'head' ? layout : 'table'};
      // A view keeps how to show the list, not what: its sort and its
      // layout apply, and the conditions on screen stay as they are.
      if (opened) {
        query.sort = JSON.parse(JSON.stringify(opened.query?.sort ?? []));
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
      const data = {columns, total: found.length, view_config: {layouts: LAYOUTS}, column_settings: columnSettings(), ...(views ? {saved_views: VIEWS, saved_filters: filters} : {}),
        echo: {filters_chosen: query.filters_chosen ?? ['status', 'manager'], filters: query.filters ?? {}, search: query.search ?? '', sort: query.sort ?? [], page: query.page ?? 1, per_page: perPage, view}};
      if (window.undated) {
        data.records = [];
        data.total = 0;
      } else if ('lanes' in window) {
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
  const field = (key, label, propertyType, value, extra = {}) => ({key, label, propertyType, value, ...extra});
  // The record card in its short form: the order in two sections, «Заказ»
  // and «Клиент».
  const shortRecord = (order) => ({
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
  });
  // The full card: the head (the stage as a label, the client and the sum
  // under the title), the record's address (copy the link, open it on the
  // whole page), sections with icons, groups in two columns, fields by type,
  // short fields edited at the value (quick), edit and delete.
  const fullRecord = (order) => ({
    record_id: order.id, collection: 'orders', revision: order.revision, label: order.title || 'Новый заказ', title: order.title || 'Новый заказ',
    ...(order.id ? {address: `#/orders/${order.id}`} : {}),
    actions: ['record.edit', 'record.delete'],
    view: {head: {subtitle: ['client', 'amount'], status: 'status'}, editable: ['personal'], layers: {}},
    sections: [
      {key: 'order', label: 'Заказ', icon: 'receipt_long', groups: [
        {key: 'main', label: 'Основное', columns: 2, fields: [
          field('title', 'Название', 'string', order.title, {required: true, width: 'full'}),
          field('status', 'Состояние', 'choice', order.status, {options: STATUS, quick: true}),
          field('priority', 'Срочность', 'choice', order.priority, {options: PRIORITIES, quick: true}),
          field('amount', 'Сумма', 'money', order.amount, {currency: 'RUB'}),
          field('manager', 'Менеджер', 'user', order.managerId ? {value: order.managerId, label: order.manager} : null, {options: MANAGERS, quick: true}),
          field('channel', 'Канал', 'choice', order.channel, {options: CHANNELS}),
          field('due', 'Доставка', 'date', order.due, {quick: true}),
        ]},
        {key: 'note', label: 'Комментарий', fields: [field('comment', 'Комментарий', 'text', order.comment, {width: 'full'})]},
      ]},
      {key: 'client', label: 'Клиент', icon: 'business', groups: [
        {key: 'company', label: 'Компания', columns: 2, fields: [
          field('client', 'Название', 'string', order.client, {width: 'full'}),
          field('inn', 'ИНН', 'ru.inn', order.inn),
          field('city', 'Город', 'string', order.city),
          field('site', 'Сайт', 'url', order.site),
        ]},
        {key: 'person', label: 'Контакт', columns: 2, fields: [
          field('contact', 'Контактное лицо', 'string', order.contact),
          field('phone', 'Телефон', 'phone', order.phone),
        ]},
      ]},
      {key: 'delivery', label: 'Доставка', icon: 'local_shipping', groups: [
        {key: 'way', label: 'Доставка', columns: 2, fields: [
          field('method', 'Способ', 'choice', order.method, {options: METHODS}),
          field('track', 'Трек-номер', 'string', order.track),
          field('address', 'Адрес', 'text', order.address, {width: 'full'}),
        ]},
      ]},
      {key: 'payment', label: 'Оплата', icon: 'payments', groups: [
        {key: 'pay', label: 'Оплата', columns: 2, fields: [
          field('payment', 'Способ оплаты', 'choice', order.payment, {options: PAYMENTS}),
          field('paid', 'Оплачен', 'boolean', Boolean(order.paid)),
          field('invoice', 'Счёт', 'file', order.id ? {value: `inv-${order.id}`, label: `счёт-${order.id}.pdf`, mime: 'application/pdf', href: '#'} : null),
        ]},
      ]},
    ],
  });
  const record = (order) => (full ? fullRecord(order) : shortRecord(order));
  // The change history the card's «⋯ → История изменений» shows.
  const changes = (order) => [
    {id: `${order.id}-h3`, kind: 'update', time: moment(0, 11), actor: {name: order.manager || 'Анна Белова'}, changes: [{field: 'status', before: 'new', after: order.status}]},
    {id: `${order.id}-h2`, kind: 'update', time: moment(-1, 15), actor: {name: 'Илья Орлов'}, changes: [{field: 'due', before: day(-2), after: order.due}, {field: 'priority', before: order.priority === 'usual' ? 'urgent' : 'usual', after: order.priority}]},
    {id: `${order.id}-h1`, kind: 'create', time: moment(-3, 9), actor: {name: 'Мария Котова'}},
  ];
  let viewRevision = 1;
  const cardPort = {
    version: '1.17.0',
    // The history, the card's own «Настроить вид» and the record's page
    // (record-open: «⋯ → Открыть на всю страницу» beside «Копировать ссылку»).
    capabilities: full ? ['record-history', 'view-settings', 'record-open'] : [],
    async raise(intent, payload) {
      await pause(100);
      if (full && intent === 'record.load' && payload?.mode === 'create') return {answer: 'applied', record: record(blank())};
      if (full && intent === 'record.create') {
        const made = {...makeOrders(1, orders.length)[0], ...payload.values, id: `o${2001 + orders.length}`, revision: '1'};
        made.title = made.title || `Заказ №${2001 + orders.length}`;
        orders.unshift(made);
        say(`Приложение создало ${made.title}; он первый в списке.`);
        return {answer: 'applied', record: record(made), record_id: made.id, revision: '1'};
      }
      if (full && (intent === 'view.save' || intent === 'view.reset')) {
        viewRevision += 1;
        say('Приложение сохранило вид карточки для вас.');
        return {answer: 'applied', revision: String(viewRevision)};
      }
      const order = orders.find((one) => one.id === payload?.record_id);
      if (!order) return {answer: 'refused', reason: 'record-unknown', message: 'Заказ не найден.'};
      if (intent === 'record.load') return {answer: 'applied', record: record(order)};
      if (full && intent === 'record.history') return {answer: 'applied', events: changes(order), has_more: false};
      // Delete removes the order from this page's array only.
      if (full && intent === 'record.delete') {
        orders.splice(orders.indexOf(order), 1);
        say(`Приложение удалило ${order.title}.`);
        return {answer: 'applied'};
      }
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

// ---- One list in four layouts, the record card beside it --------------------
// The list head (head="list") opens with its view strip: the view, the
// layouts the application named in describe().layouts, «Колонки» and «Вид». A
// record opened from any layout opens in the card named by record-card,
// beside the list from 64rem, over it on a narrow screen.
// The strip opens the first time: the person's own choice (open or closed) is
// kept under the view's preferences-key and wins on the next visit.
const openZoneOnce = (key) => {
  try {
    const at = `sf-pref:sf-table/${key}`;
    if (localStorage.getItem(at) === null) localStorage.setItem(at, JSON.stringify({v: 1, viewZone: true}));
  } catch {
    // No storage (a private window): the zone starts closed.
  }
};
openZoneOnce('view.home-list');

const initializeList = async () => {
  const root = document.querySelector('[data-list-demo]');
  if (!root || root.dataset.exampleReady === 'true') return;
  await Promise.all(['sf-view', 'sf-view-table', 'sf-view-properties', 'sf-button'].map((tag) => customElements.whenDefined(tag)));
  root.dataset.exampleReady = 'true';
  const log = root.querySelector('[data-log]');
  const say = (text) => { log.textContent = text; };
  const view = root.querySelector('sf-view');
  const card = root.querySelector('#home-order');
  const pageCard = root.querySelector('#home-order-page');
  const listPlace = root.querySelector('[data-list-place]');
  const recordPlace = root.querySelector('[data-record-place]');
  // «Создать»: the empty new order in the card beside the list.
  const app = ordersApp({count: 48, views: true, columns: COLUMNS, full: true, say, refresh: () => view.refresh?.('bulk-applied'), onCreate: () => {
    card.setAttribute('mode', 'create');
    card.removeAttribute('record-id');
    card.hidden = false;
    card.setAttribute('open', 'true');
    setTimeout(() => card.load?.('create'), 0);
    say('«Создать»: новый пустой заказ открыт в карточке рядом со списком.');
  }});
  view.querySelector('sf-view-table')?.setFilterFields?.(FIELDS);
  card.setHostPort(app.cardPort);
  pageCard.setHostPort(app.cardPort);

  // «⋯ → Открыть на всю страницу»: the record takes the list's place; the
  // list stays (hidden) with its filter, search and page, and «← Заказы»
  // brings it back with the row in focus.
  let opened = null;
  const openOnPage = (id) => {
    const order = app.orders.find((one) => one.id === id);
    if (!order) return;
    if (card.getAttribute('open') === 'true' && !card.hidden) card.closePanel?.();
    opened = id;
    listPlace.hidden = true;
    recordPlace.hidden = false;
    root.querySelector('[data-record-title]').textContent = order.title;
    pageCard.setAttribute('panel-label', order.title);
    if (pageCard.getAttribute('record-id') !== id) pageCard.setAttribute('record-id', id);
    pageCard.removeAttribute('hidden');
    pageCard.setAttribute('open', 'true');
    say(`${order.title} открыт на всю страницу на месте списка. «Заказы» вернёт список как был.`);
  };
  const backToList = () => {
    if (!opened) return;
    const back = opened;
    opened = null;
    recordPlace.hidden = true;
    listPlace.hidden = false;
    view.refresh?.('record-page-closed');
    requestAnimationFrame(() => view.table?.focusRow?.(back, {focus: true}));
    say('Список вернулся с тем же фильтром, поиском и страницей.');
  };
  root.querySelector('[data-record-back]').addEventListener('click', backToList);
  card.addEventListener('sf-view-properties-open-full', (event) => openOnPage(String(event.detail?.record_id ?? event.detail?.id ?? '')));
  pageCard.addEventListener('sf-view-properties-close', (event) => { event.preventDefault?.(); backToList(); });
  root.addEventListener('sf-view-properties-delete', (event) => {
    if (event.target === pageCard) backToList();
    setTimeout(() => view.refresh?.('record-deleted'), 0);
  });
  // The new order is first in the list: the list asks the application again.
  card.addEventListener('sf-view-properties-created', () => setTimeout(() => view.refresh?.('record-created'), 0));
  root.addEventListener('sf-view-properties-address-copy', (event) => {
    say(event.detail?.copied ? 'Ссылка на заказ скопирована.' : 'Браузер не дал скопировать ссылку.');
  });
  view.addEventListener('sf-view-settings-open', (event) => {
    const words = {rights: 'Права доступа', export: 'Экспорт'};
    say(`«${words[event.detail?.id] ?? event.detail?.id}» — это страница приложения; здесь пример только называет её.`);
  });
  view.addEventListener('sf-view-display-change', (event) => {
    const kind = event.detail?.kind ?? event.detail?.layout;
    const words = {table: 'таблицей', board: 'доской', cards: 'карточками', calendar: 'календарём'};
    if (words[kind]) say(`Тот же список ${words[kind]}: приложение ответило на тот же запрос в форме этого вида.`);
  });
  view.addEventListener('sf-view-open', (event) => {
    if (card.getAttribute('mode') === 'create') card.setAttribute('mode', 'auto');
    const order = app.orders.find((one) => one.id === String(event.detail?.id));
    if (order) say(`Открыт ${order.title}: карточка записи рядом со списком. Короткие поля правятся прямо у значения, группа — кнопкой «Изменить», остальное — в «⋯».`);
  });
  view.bulkActions = BULK;
  view.setHostPort(app.listPort);
};

initializeList();
