// A data view driven by an application through its host port. The
// "application" here is a few lines of JavaScript with an array of records; on
// a real page raise() sends the same intents to the server and returns its
// answer in the same envelope.
const PROJECTS = [
  {id: 1, name: 'Портал клиента', owner: 'Анна Белова', status: 'active', updated_at: '2026-10-01T09:00:00Z'},
  {id: 2, name: 'Каталог товаров', owner: 'Илья Орлов', status: 'paused', updated_at: '2026-09-21T14:30:00Z'},
  {id: 3, name: 'Мобильное приложение', owner: 'Мария Котова', status: 'active', updated_at: '2026-10-12T11:15:00Z'},
  {id: 4, name: 'Внутренний портал', owner: 'Анна Белова', status: 'done', updated_at: '2026-08-30T08:45:00Z'},
  {id: 5, name: 'Справочный центр', owner: 'Олег Смирнов', status: 'active', updated_at: '2026-10-14T16:20:00Z'},
  {id: 6, name: 'Платёжный шлюз', owner: 'Илья Орлов', status: 'paused', updated_at: '2026-09-02T10:05:00Z'},
  {id: 7, name: 'Личный кабинет', owner: 'Мария Котова', status: 'done', updated_at: '2026-07-18T13:00:00Z'},
];

const COLUMNS = [
  {key: 'name', label: 'Проект', role: 'title', sortable: true},
  {key: 'owner', label: 'Ответственный', sortable: true},
  {key: 'status', label: 'Состояние', property_type: 'choice', options: [
    {value: 'active', label: 'В работе', scheme: 'primary'},
    {value: 'paused', label: 'Приостановлен', scheme: 'warning'},
    {value: 'done', label: 'Завершён', scheme: 'success'},
  ]},
  {key: 'updated_at', label: 'Изменён', property_type: 'datetime', sortable: true},
];

// Labels for the application's own action ids; which actions a row offers is
// still that record's `actions`.
const ROW_ACTIONS = [{id: 'archive', label: 'В архив', icon: 'archive'}];

const dateFormat = new Intl.DateTimeFormat('ru-RU', {dateStyle: 'medium', timeStyle: 'short'});

const initializeApplicationView = async () => {
  const root = document.querySelector('[data-application-demo]');
  if (!root || root.dataset.exampleReady === 'true') return;
  await customElements.whenDefined('sf-view');
  root.dataset.exampleReady = 'true';

  const view = root.querySelector('sf-view');
  const log = root.querySelector('[data-application-log]');
  let scenario = 'normal';
  const records = PROJECTS.map((project) => ({...project, revision: '1'}));
  let personal = {revision: '1', columns: {}};

  const answerQuery = ({query}) => {
    const search = query.search.trim().toLowerCase();
    let rows = records.filter((record) => !search || record.name.toLowerCase().includes(search));
    const [order] = query.sort;
    if (order) {
      rows = [...rows].sort((a, b) => String(a[order.key]).localeCompare(String(b[order.key]), 'ru')
        * (order.direction === 'desc' ? -1 : 1));
    }
    const start = (query.page - 1) * query.per_page;
    return {
      columns: COLUMNS,
      // The values of a record sit under the keys of its columns.
      records: rows.slice(start, start + query.per_page).map((record) => ({
        ...record,
        actions: record.status === 'done' ? ['view'] : ['view', 'archive'],
      })),
      total: rows.length,
      row_actions: ROW_ACTIONS,
      echo: {
        filters_chosen: query.filters, filters: query.filters, filters_rejected: [],
        search: query.search, sort: query.sort, page: query.page, per_page: query.per_page,
      },
      // The personal layer is always sent, with its revision: a save of the
      // column settings is written against it.
      column_settings: {target: {kind: 'personal', revision: personal.revision}, layers: {personal}},
    };
  };

  const host = {
    version: '1.12.0',
    capabilities: ['row-actions', 'personal-column-settings'],
    async raise(intent, payload) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (intent === 'query.change') {
        if (scenario === 'refused') return {answer: 'refused', reason: 'forbidden', message: 'Нет доступа к проектам', sequence: payload.sequence};
        if (scenario === 'unavailable') return {answer: 'unavailable', reason: 'server-error', sequence: payload.sequence};
        return {answer: 'applied', sequence: payload.sequence, data: answerQuery(payload)};
      }
      if (intent === 'record.open') {
        log.textContent = `Открыть запись ${payload.record_ids.join(', ')}: переход делает приложение`;
        return {answer: 'applied'};
      }
      if (intent === 'record.mutate' && payload.action_id === 'archive') {
        const changed = records.filter((record) => payload.record_ids.map(String).includes(String(record.id)));
        changed.forEach((record) => {
          record.status = 'done';
          record.revision = String(Number(record.revision) + 1);
          record.updated_at = new Date().toISOString();
        });
        log.textContent = `В архиве: ${changed.map((record) => record.name).join(', ')}`;
        // Only the changed records: the view rewrites exactly these rows.
        return {answer: 'applied', data: {records: changed.map((record) => ({...record, actions: ['view']}))}};
      }
      if (intent === 'settings.save_personal') {
        if (String(payload.base_revision) !== personal.revision) return {answer: 'conflict', reason: 'stale-revision'};
        personal = {revision: String(Number(personal.revision) + 1), columns: payload.columnSettings ?? {}};
        return {answer: 'applied', data: {column_settings: {target: {kind: 'personal', revision: personal.revision}, layers: {personal}}}};
      }
      // An intent this application does not provide.
      return {answer: 'unavailable', reason: 'capability-not-provided'};
    },
    // Dates in cells are the application's to write.
    formatFieldValue(field, value) {
      if (field?.property_type !== 'datetime' && field?.type !== 'datetime') return undefined;
      return value ? dateFormat.format(new Date(value)) : '';
    },
  };

  view.setHostPort(host);
  // The pressed answer is shown by `active` and announced by aria-pressed.
  root.querySelector('[data-scenarios]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-scenario]');
    if (!button) return;
    scenario = button.dataset.scenario;
    root.querySelectorAll('[data-scenario]').forEach((item) => {
      const pressed = item === button;
      item.classList.toggle('active', pressed);
      item.setAttribute('aria-pressed', String(pressed));
    });
    view.refresh();
  });
};

initializeApplicationView();
