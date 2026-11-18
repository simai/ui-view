// A calendar of deliveries driven by an application through the view's host
// port. The "application" is a few lines over an array; on a real page
// raise() sends the same intents to the server. The query names the days on
// screen (query.window.range) and the request's time zone and week start
// (query.context); the undated records are a query of their own
// (window.undated). A move is record.set with the patch of the date fields:
// Sundays and past days are refused by the rules, and one order is refused by
// the "server" to show how a refusal puts the event back.
const day = (shift) => {
  const at = new Date();
  at.setDate(at.getDate() + shift);
  return `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, '0')}-${String(at.getDate()).padStart(2, '0')}`;
};

const FIELDS = [
  {key: 'title', label: 'Заказ', role: 'title'},
  {key: 'start', label: 'Начало', property_type: 'datetime'},
  {key: 'end', label: 'Конец', property_type: 'datetime'},
  {key: 'status', label: 'Статус', property_type: 'choice', options: [
    {value: 'new', label: 'Новый', scheme: 'primary'},
    {value: 'paid', label: 'Оплачен', scheme: 'success'},
    {value: 'sent', label: 'Отправлен', scheme: 'neutral'},
    {value: 'late', label: 'Просрочен', scheme: 'error'},
  ]},
  {key: 'client', label: 'Клиент', property_type: 'string'},
  {key: 'amount', label: 'Сумма', property_type: 'money', currency: 'RUB'},
];

const RULES = [
  {code: 'past', reason: 'Дата доставки не может быть в прошлом'},
  {code: 'sunday', reason: 'По воскресеньям доставки нет'},
];

const records = [
  {id: '1011', title: 'Заказ 1011', start: `${day(1)}T10:00`, end: `${day(1)}T11:00`, status: 'new', client: 'ООО «Вектор»', amount: 48000},
  {id: '1012', title: 'Заказ 1012', start: `${day(1)}T14:00`, end: `${day(1)}T15:30`, status: 'paid', client: 'ИП Соколов', amount: 12500},
  {id: '1013', title: 'Заказ 1013', start: `${day(2)}T09:00`, end: `${day(2)}T10:00`, status: 'new', client: 'Ромашка', amount: 7300},
  {id: '1014', title: 'Монтаж 1014', start: day(3), end: day(5), status: 'paid', client: 'ООО «Север»', amount: 156000},
  {id: '1015', title: 'Заказ 1015', start: `${day(4)}T12:00`, end: `${day(4)}T13:00`, status: 'late', client: 'Альфа', amount: 21000},
  {id: '1016', title: 'Заказ 1016', start: `${day(-2)}T11:00`, end: `${day(-2)}T12:00`, status: 'sent', client: 'ООО «Вектор»', amount: 9900,
    can: {update: false, reason: 'Заказ уже отправлен'}},
  {id: '1017', title: 'Заказ 1017', start: `${day(1)}T16:00`, end: `${day(1)}T17:00`, status: 'new', client: 'Бета', amount: 5400},
  {id: '1018', title: 'Заказ 1018', start: `${day(1)}T18:00`, end: `${day(1)}T19:00`, status: 'paid', client: 'Гамма', amount: 8800},
  {id: '1019', title: 'Заказ 1019', start: null, end: null, status: 'new', client: 'Дельта', amount: 3100},
  {id: '1020', title: 'Заказ 1020', start: null, end: null, status: 'new', client: 'Омега', amount: 17600},
].map((record) => ({...record, revision: '1'}));

const initializeCalendar = async () => {
  const root = document.querySelector('[data-calendar-demo]');
  if (!root || root.dataset.exampleReady === 'true') return;
  await customElements.whenDefined('sf-view');
  root.dataset.exampleReady = 'true';
  const view = root.querySelector('sf-view');
  const log = root.querySelector('[data-calendar-log]');
  const wait = (ms) => new Promise((done) => setTimeout(done, ms));

  const answerQuery = ({query}) => {
    const window = query.window ?? {};
    if (window.undated) {
      const undated = records.filter((record) => !record[window.undated]);
      return {columns: FIELDS, records: undated, total: undated.length};
    }
    const [from, to] = window.range ?? ['0000-00-00', '9999-99-99'];
    const shown = records.filter((record) => record.start && String(record.start).slice(0, 10) < to
      && String(record.end ?? record.start).slice(0, 10) >= from);
    return {columns: FIELDS, records: shown, total: shown.length, rules: {start: RULES}, context: query.context};
  };

  view.setHostPort({
    version: '1.12.0',
    capabilities: ['inline-edit', 'create-record', 'row-actions'],
    async raise(intent, payload) {
      if (intent === 'query.change') return {answer: 'applied', sequence: payload.sequence, data: answerQuery(payload)};
      if (intent === 'record.set') {
        await wait(500);
        const record = records.find((entry) => entry.id === String(payload.record_id));
        if (!record) return {answer: 'refused', reason: 'not-found'};
        if (record.id === '1013') {
          log.textContent = 'Сервер отказал: склад не успевает собрать заказ 1013 к этой дате.';
          return {answer: 'refused', reason: 'validation', message: 'Склад не успевает собрать заказ к этой дате'};
        }
        Object.assign(record, payload.patch, {revision: String(Number(record.revision) + 1)});
        log.textContent = `Сохранено: ${record.title} — ${record.start ?? 'без даты'}`;
        return {answer: 'applied', data: {records: [record]}};
      }
      if (intent === 'view.create_record') {
        log.textContent = `Новая запись на ${JSON.stringify(payload.values)}`;
        return {answer: 'applied'};
      }
      if (intent === 'record.open') {
        log.textContent = `Открыть запись ${payload.record_id}`;
        return {answer: 'applied'};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
  });
};

initializeCalendar();
