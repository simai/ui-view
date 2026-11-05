// An online shop's orders: the data view asks the shop (here, a few lines of
// JavaScript over an array) for each page, the table draws it, and opening an
// order shows its card beside the list. A real page answers the same intents
// from its server.
const CITIES = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск', 'Нижний Новгород', 'Самара', 'Краснодар'];
const BUYERS = ['Анна Белова', 'Илья Орлов', 'Мария Котова', 'Олег Смирнов', 'Ирина Волкова', 'Дмитрий Лебедев', 'Екатерина Новикова',
  'Павел Морозов', 'Светлана Кузнецова', 'Артём Попов', 'Юлия Соколова', 'Никита Фёдоров', 'Ольга Михайлова', 'Сергей Васильев'];
const DELIVERY = [{value: 'courier', label: 'Курьер'}, {value: 'pickup', label: 'Пункт выдачи'}, {value: 'post', label: 'Почта'}];
const STATUS = [
  {value: 'new', label: 'Новый', scheme: 'primary'},
  {value: 'assembly', label: 'Собирается', scheme: 'warning'},
  {value: 'shipped', label: 'Отгружен', scheme: 'success'},
  {value: 'cancelled', label: 'Отменён', scheme: 'neutral'},
];
const STATUS_ORDER = ['new', 'assembly', 'shipped', 'shipped', 'new', 'assembly', 'shipped', 'cancelled'];

// 48 orders over the last three weeks, generated the same way every time.
const ORDERS = Array.from({length: 48}, (_, index) => {
  const day = new Date(Date.UTC(2026, 9, 15 + Math.floor(index / 2.4), 9 + (index * 7) % 10, (index * 13) % 60));
  return {
    id: `o-${10421 + index}`,
    number: `№ ${10421 + index}`,
    buyer: BUYERS[(index * 5) % BUYERS.length],
    city: CITIES[(index * 3) % CITIES.length],
    items: 1 + (index * 7) % 6,
    amount: 1490 + ((index * 7919) % 48) * 610,
    delivery: DELIVERY[index % 3].value,
    status: STATUS_ORDER[index % STATUS_ORDER.length],
    created_at: day.toISOString(),
    revision: '1',
  };
}).reverse();

const COLUMNS = [
  {key: 'number', label: 'Заказ', role: 'title', sortable: true},
  {key: 'created_at', label: 'Создан', property_type: 'datetime', sortable: true},
  {key: 'buyer', label: 'Покупатель', sortable: true},
  {key: 'city', label: 'Город', sortable: true},
  {key: 'items', label: 'Товаров', property_type: 'number', sortable: true},
  {key: 'amount', label: 'Сумма, ₽', property_type: 'number', sortable: true},
  {key: 'status', label: 'Состояние', property_type: 'choice', options: STATUS},
];
const ROW_ACTIONS = [{id: 'ship', label: 'Отгрузить', icon: 'local_shipping'}];
const dateFormat = new Intl.DateTimeFormat('ru-RU', {dateStyle: 'medium', timeStyle: 'short'});
const money = new Intl.NumberFormat('ru-RU');

const card = (order) => ({
  answer: 'applied',
  record: {
    record_id: order.id,
    collection: 'shop.orders',
    revision: Number(order.revision),
    label: `Заказ ${order.number}`,
    sections: [{
      key: 'main',
      label: 'Заказ',
      groups: [
        {key: 'order', label: 'Заказ', columns: 2, fields: [
          {key: 'status', label: 'Состояние', propertyType: 'choice', width: 'half', value: order.status, options: STATUS.map(({value, label}) => ({value, label}))},
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
      ],
    }],
  },
});

const initializeOrders = async () => {
  const root = document.querySelector('[data-orders-demo]');
  if (!root || root.dataset.exampleReady === 'true') return;
  await Promise.all([customElements.whenDefined('sf-view'), customElements.whenDefined('sf-view-properties')]);
  root.dataset.exampleReady = 'true';

  const view = root.querySelector('#orders-view');
  const panel = root.querySelector('#order-card');
  const hint = root.querySelector('[data-orders-hint]');
  const log = root.querySelector('[data-orders-log]');
  let status = '';
  let opened = null;

  const answerQuery = ({query}) => {
    const search = query.search.trim().toLowerCase();
    let rows = ORDERS.filter((order) => (!status || order.status === status)
      && (!search || `${order.number} ${order.buyer} ${order.city}`.toLowerCase().includes(search)));
    const [order] = query.sort;
    if (order) {
      const sign = order.direction === 'desc' ? -1 : 1;
      rows = [...rows].sort((a, b) => (typeof a[order.key] === 'number' ? a[order.key] - b[order.key]
        : String(a[order.key]).localeCompare(String(b[order.key]), 'ru')) * sign);
    }
    const start = (query.page - 1) * query.per_page;
    return {
      columns: COLUMNS,
      records: rows.slice(start, start + query.per_page).map((record) => ({
        ...record,
        actions: record.status === 'new' || record.status === 'assembly' ? ['view', 'ship'] : ['view'],
      })),
      total: rows.length,
      row_actions: ROW_ACTIONS,
      echo: {filters_chosen: query.filters, filters: query.filters, filters_rejected: [], search: query.search, sort: query.sort, page: query.page, per_page: query.per_page},
    };
  };

  view.setHostPort({
    version: '1.12.0',
    capabilities: ['row-actions'],
    async raise(intent, payload) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (intent === 'query.change') return {answer: 'applied', sequence: payload.sequence, data: answerQuery(payload)};
      if (intent === 'record.open') {
        opened = ORDERS.find((order) => String(order.id) === String(payload.record_ids[0]));
        if (opened) {
          hint.hidden = true;
          panel.hidden = false;
          panel.setAttribute('record-id', opened.id);
        }
        return {answer: 'applied'};
      }
      if (intent === 'record.mutate' && payload.action_id === 'ship') {
        const changed = ORDERS.filter((order) => payload.record_ids.map(String).includes(String(order.id)));
        changed.forEach((order) => { order.status = 'shipped'; order.revision = String(Number(order.revision) + 1); });
        log.textContent = `Отгружено: ${changed.map((order) => order.number).join(', ')}`;
        return {answer: 'applied', data: {records: changed.map((order) => ({...order, actions: ['view']}))}};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
    formatFieldValue(field, value) {
      if ((field?.property_type ?? field?.type) === 'datetime') return value ? dateFormat.format(new Date(value)) : '';
      if (field?.key === 'amount' && typeof value === 'number') return money.format(value);
      return undefined;
    },
  });

  panel.setHostPort({
    version: '1.7.0',
    capabilities: [],
    async raise(intent, payload) {
      const order = ORDERS.find((item) => item.id === (payload?.record_id ?? panel.getAttribute('record-id')));
      if (!order) return {answer: 'refused', reason: 'not-found'};
      if (intent === 'record.load') return card(order);
      if (intent === 'group.save') {
        for (const [key, value] of Object.entries(payload?.values ?? {})) if (key in order && key !== 'amount') order[key] = value;
        order.revision = String(Number(order.revision) + 1);
        view.refresh();
        return card(order);
      }
      return {answer: 'unavailable', reason: 'unknown-intent'};
    },
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

initializeOrders();
