// The list head (head="list") over an application's port. describe() names
// the filter fields and the display kinds the application allows; every
// choice in the head comes to raise() as the view's query. A board's query
// carries the lane window, and the application answers it with lanes.
const STATUS = [
  {value: 'new', label: 'Новый', status: 'info'},
  {value: 'wait', label: 'Ждёт оплаты', status: 'warning'},
  {value: 'paid', label: 'Оплачен', status: 'success'},
  {value: 'sent', label: 'Отправлен', scheme: 'primary'},
];
const MANAGERS = [{value: 'u1', label: 'Анна Белова'}, {value: 'u2', label: 'Илья Орлов'}, {value: 'u3', label: 'Мария Котова'}];
const CLIENTS = ['ООО «Ромашка»', 'ИП Сидоров', 'АО «Вектор»', 'ООО «Север»', 'ИП Кузнецова'];
const FIELDS = [
  {key: 'status', label: 'Состояние', propertyType: 'choice', filter: {options: STATUS}},
  {key: 'manager', label: 'Менеджер', propertyType: 'user', filter: {options: MANAGERS}},
];
const COLUMNS = [
  {key: 'title', label: 'Заказ', role: 'title', sortable: true},
  {key: 'status', label: 'Состояние', property_type: 'choice', options: STATUS},
  {key: 'client', label: 'Клиент'},
  {key: 'manager', label: 'Менеджер'},
  {key: 'amount', label: 'Сумма', property_type: 'number', sortable: true},
];
const BOARD = {lane_field: 'status', lanes: {order: STATUS.map((lane) => lane.value)}, empty_lanes: 'show', card_fields: ['client', 'amount'], totals: ['count'], per_lane: 4};

const initializeHead = async () => {
  const root = document.querySelector('[data-head-demo]');
  if (!root || root.dataset.exampleReady === 'true') return;
  await Promise.all([customElements.whenDefined('sf-view'), customElements.whenDefined('sf-view-table')]);
  root.dataset.exampleReady = 'true';
  const view = root.querySelector('sf-view');
  const table = root.querySelector('sf-view-table');
  const log = root.querySelector('[data-head-log]');
  const orders = Array.from({length: 22}, (_, index) => ({
    id: `o${1001 + index}`, revision: '1', title: `Заказ №${1001 + index}`, status: STATUS[(index * 3) % 4].value,
    client: CLIENTS[index % CLIENTS.length], manager: MANAGERS[index % 3].label, managerId: MANAGERS[index % 3].value,
    amount: 9800 + index * 2650, actions: ['view'],
  }));
  const value = (order, key) => (key === 'manager' ? order.managerId : order[key]);
  const matches = (order, query) => {
    const search = String(query.search ?? '').trim().toLowerCase();
    if (search && !`${order.title} ${order.client}`.toLowerCase().includes(search)) return false;
    return Object.entries(query.filters ?? {}).every(([key, condition]) => !condition?.values?.length || condition.values.includes(value(order, key)));
  };
  const say = (query) => {
    const parts = [];
    if (query.search) parts.push(`поиск «${query.search}»`);
    for (const [key, condition] of Object.entries(query.filters ?? {})) if (condition?.values?.length) parts.push(`${FIELDS.find((field) => field.key === key)?.label}: ${condition.values.length}`);
    parts.push(query.window?.lanes ? `доска по «Состоянию», по ${query.window.per_lane} в колонке` : `страница ${query.page}`);
    log.textContent = `Приложение получило запрос: ${parts.join(', ')}.`;
  };

  table.setFilterFields?.(FIELDS);
  table.setCreateItems?.([{id: 'order', name: 'Заказ'}]);
  view.setHostPort({
    version: '1.15.0',
    capabilities: ['row-actions', 'create-record'],
    // Which fields filter the list and which display kinds the application
    // allows. «Карточки» has no layout in the set: the head shows it disabled.
    describe: () => ({fields: FIELDS, layouts: ['table', 'board', 'cards']}),
    async raise(intent, payload) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (intent === 'view.create_record') {
        log.textContent = 'Создать заказ: форму открывает приложение.';
        return {answer: 'applied'};
      }
      if (intent === 'record.open') {
        log.textContent = `Открыть ${payload.record_ids.join(', ')}: переход делает приложение.`;
        return {answer: 'applied'};
      }
      if (intent !== 'query.change') return {answer: 'unavailable', reason: 'capability-not-provided'};
      const query = payload.query ?? {};
      say(query);
      const found = orders.filter((order) => matches(order, query));
      const [order] = query.sort ?? [];
      if (order) found.sort((a, b) => (a[order.key] > b[order.key] ? 1 : -1) * (order.direction === 'desc' ? -1 : 1));
      const data = {columns: COLUMNS, total: found.length, view_config: {layouts: {board: BOARD}},
        echo: {filters_chosen: query.filters_chosen ?? ['status', 'manager'], filters: query.filters ?? {}, search: query.search ?? '', sort: query.sort ?? [], page: query.page ?? 1, per_page: query.per_page ?? 8, view: query.view ?? {id: null, type: 'table'}}};
      if (query.window?.lanes) {
        data.records = [];
        data.lanes = STATUS.map((lane) => {
          const all = found.filter((one) => one.status === lane.value);
          return {value: lane.value, total: all.length, records: all.slice(0, query.window.per_lane), cursor: null};
        });
      } else {
        const start = ((query.page ?? 1) - 1) * (query.per_page ?? 8);
        data.records = found.slice(start, start + (query.per_page ?? 8));
      }
      return {answer: 'applied', sequence: payload.sequence, data};
    },
  });
};

initializeHead();
