// A board over an application's port. The "application" is a few lines of
// JavaScript with an array of orders; on a real page raise() sends the same
// intents to the server and returns its answer in the same envelope.
//
// It answers three things: the lane window (the first cards of every lane
// and their counts), the lanes' money sums in a second request once the
// board is drawn (reason "lane-sums"), and a move (record.set of the lane
// field), refused by the rule of the lanes or by the application itself.
const STATUS = [
  {value: 'new', label: 'Новый', status: 'info'},
  {value: 'wait', label: 'Ждёт оплаты', status: 'warning'},
  {value: 'paid', label: 'Оплачен', status: 'success'},
  {value: 'sent', label: 'Отправлен', scheme: 'primary'},
  {value: 'cancel', label: 'Отменён', status: 'error'},
];
const COLUMNS = [
  {key: 'title', label: 'Заказ', role: 'title'},
  {key: 'status', label: 'Состояние', property_type: 'choice', options: STATUS},
  {key: 'client', label: 'Клиент'},
  {key: 'manager', label: 'Менеджер'},
  {key: 'amount', label: 'Сумма', property_type: 'number'},
];
const CLIENTS = ['ООО «Ромашка»', 'ИП Сидоров', 'АО «Вектор»', 'ООО «Север»'];
const MANAGERS = ['Анна Белова', 'Илья Орлов', 'Мария Котова'];
const PLACES = ['new', 'new', 'wait', 'new', 'paid', 'wait', 'new', 'sent', 'paid', 'new', 'cancel', 'new', 'wait', 'new'];
// The board's settings: the lane field, the cards' fields, the totals, a soft
// limit and the first cards of a lane (view-config/1 layouts.board).
const BOARD = {
  lane_field: 'status',
  lanes: {order: STATUS.map((lane) => lane.value), hidden: [], collapsed: ['cancel']},
  empty_lanes: 'show',
  card_fields: ['client', 'manager', 'amount'],
  totals: ['count', {sum: 'amount'}],
  limits: {paid: 2},
  order: 'sort',
  per_lane: 3,
};
const MOVES = {sent: {from: ['paid'], reason: 'В «Отправлен» — только из «Оплачен»'}};

const initializeBoard = async () => {
  const root = document.querySelector('[data-board-demo]');
  if (!root || root.dataset.exampleReady === 'true') return;
  await customElements.whenDefined('sf-view');
  root.dataset.exampleReady = 'true';
  const view = root.querySelector('sf-view');
  const log = root.querySelector('[data-board-log]');
  const orders = PLACES.map((status, index) => ({
    id: `o${1001 + index}`, revision: '1', title: `Заказ №${1001 + index}`, status,
    client: CLIENTS[index % CLIENTS.length], manager: MANAGERS[index % MANAGERS.length], amount: 12500 + index * 4375, actions: ['view'],
  }));
  const lane = (value, from = 0, count = BOARD.per_lane) => {
    const all = orders.filter((order) => order.status === value);
    const records = all.slice(from, from + count);
    return {value, total: all.length, records, cursor: from + count < all.length ? String(from + count) : null};
  };
  const sums = (value) => ({amount: {RUB: String(orders.filter((order) => order.status === value).reduce((sum, order) => sum + order.amount, 0))}});

  view.setHostPort({
    version: '1.12.0',
    capabilities: ['row-actions', 'inline-edit'],
    async raise(intent, payload) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (intent === 'query.change') {
        const window = payload.query?.window ?? {};
        // The second request: the lanes' sums, nothing else.
        if (payload.reason === 'lane-sums') {
          return {answer: 'applied', sequence: payload.sequence, data: {lanes: STATUS.map(({value}) => ({value, totals: sums(value)}))}};
        }
        // «Показать ещё»: the next cards of one lane.
        if (window.lane) {
          return {answer: 'applied', sequence: payload.sequence, data: {lanes: [lane(window.lane, Number(window.cursor ?? 0))], total: orders.length}};
        }
        return {answer: 'applied', sequence: payload.sequence, data: {
          columns: COLUMNS, total: orders.length,
          lanes: STATUS.map(({value}) => lane(value)),
          view_config: {layouts: {board: BOARD}},
          board: {moves: MOVES, order_field: null},
        }};
      }
      if (intent === 'record.set') {
        const order = orders.find((one) => one.id === String(payload.record_id));
        if (order?.id === 'o1003') {
          log.textContent = `${order.title}: приложение отказало — заказ уже изменил другой менеджер.`;
          return {answer: 'refused', reason: 'conflict', message: 'Заказ уже изменил другой менеджер'};
        }
        order[payload.key] = payload.value;
        order.revision = String(Number(order.revision) + 1);
        log.textContent = `${order.title} → «${STATUS.find((one) => one.value === payload.value)?.label}»: приложение сохранило поле «Состояние».`;
        return {answer: 'applied', data: {records: [order]}};
      }
      if (intent === 'record.open') {
        log.textContent = `Открыть ${payload.record_ids.join(', ')}: переход делает приложение.`;
        return {answer: 'applied'};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
  });
};

initializeBoard();
