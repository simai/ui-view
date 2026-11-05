// Row selection and bulk actions: the page row offers the actions, the view
// raises bulk.apply_selected with the ids and revisions of the marked rows,
// and the application answers.
const STATUS = [
  {value: 'sent', label: 'Выставлен', scheme: 'primary'},
  {value: 'overdue', label: 'Просрочен', scheme: 'warning'},
  {value: 'paid', label: 'Оплачен', scheme: 'success'},
];
const CLIENTS = ['ООО «Северный ветер»', 'АО «Волга-Логистик»', 'ИП Соколова Ю. А.', 'ООО «Уральские окна»', 'ООО «Байкал-Тур»', 'ООО «Гранит-Строй»'];
const INVOICES = Array.from({length: 14}, (_, index) => ({
  id: `i-${501 + index}`,
  number: `Счёт № ${501 + index}`,
  client: CLIENTS[(index * 5) % CLIENTS.length],
  amount: 18000 + ((index * 7919) % 23) * 4500,
  status: ['sent', 'overdue', 'sent', 'paid'][index % 4],
  revision: '1',
}));
const money = new Intl.NumberFormat('ru-RU');

const initializeBulk = async () => {
  const root = document.querySelector('[data-bulk-demo]');
  if (!root || root.dataset.exampleReady === 'true') return;
  await customElements.whenDefined('sf-view');
  root.dataset.exampleReady = 'true';
  const view = root.querySelector('sf-view');
  const log = root.querySelector('[data-log]');

  view.setHostPort({
    version: '1.12.0',
    capabilities: [],
    async raise(intent, payload) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (intent === 'query.change') {
        const {query} = payload;
        const search = query.search.trim().toLowerCase();
        const rows = INVOICES.filter((item) => !search || `${item.number} ${item.client}`.toLowerCase().includes(search));
        const start = (query.page - 1) * query.per_page;
        return {answer: 'applied', sequence: payload.sequence, data: {
          columns: [
            {key: 'number', label: 'Счёт', role: 'title'},
            {key: 'client', label: 'Клиент'},
            {key: 'amount', label: 'Сумма, ₽', property_type: 'number'},
            {key: 'status', label: 'Состояние', property_type: 'choice', options: STATUS},
          ],
          records: rows.slice(start, start + query.per_page).map((item) => ({...item, actions: []})),
          total: rows.length,
          echo: {filters_chosen: query.filters, filters: query.filters, filters_rejected: [], search: query.search, sort: query.sort, page: query.page, per_page: query.per_page},
        }};
      }
      if (intent === 'bulk.apply_selected') {
        // Refuse the whole batch when any record changed since the person saw it.
        const ids = payload.record_ids.map(String);
        const marked = INVOICES.filter((item) => ids.includes(item.id));
        const stale = marked.filter((item) => String(payload.revisions?.[item.id] ?? item.revision) !== item.revision);
        if (stale.length) return {answer: 'conflict', conflicts: stale.map((item) => ({id: item.id, current_revision: item.revision}))};
        if (payload.action_id === 'paid') {
          marked.forEach((item) => { item.status = 'paid'; item.revision = String(Number(item.revision) + 1); });
          log.textContent = `Отмечено оплаченными: ${marked.length}`;
        } else {
          log.textContent = `Напоминание отправлено: ${marked.map((item) => item.client).join(', ')}`;
        }
        return {answer: 'applied'};
      }
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
    formatFieldValue(field, value) {
      return field?.key === 'amount' && typeof value === 'number' ? money.format(value) : undefined;
    },
  });
};

initializeBulk();
