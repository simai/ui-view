// The table's data states, set by the page: the application switches
// data-state to loading before a request and to error when it fails; the
// retry button emits sf-view-table-refresh.
const initializeStates = async () => {
  const root = document.querySelector('[data-states-demo]');
  if (!root || root.dataset.exampleReady === 'true') return;
  await customElements.whenDefined('sf-view-table');
  root.dataset.exampleReady = 'true';
  const table = root.querySelector('#states-table');
  const log = root.querySelector('[data-log]');
  const rows = [
    {id: 1, number: 'П-301', supplier: 'ООО «Техносфера»', date: '2026-11-02', items: 12},
    {id: 2, number: 'П-302', supplier: 'АО «Волга-Логистик»', date: '2026-11-03', items: 4},
    {id: 3, number: 'П-303', supplier: 'ООО «Гранит-Строй»', date: '2026-11-05', items: 27},
  ];
  table.setColumns([
    {key: 'number', label: 'Поставка', role: 'title'},
    {key: 'supplier', label: 'Поставщик'},
    {key: 'date', label: 'Дата', propertyType: 'date'},
    {key: 'items', label: 'Позиций', propertyType: 'number'},
  ]);
  const show = (state) => {
    table.setRows(state === 'populated' ? rows : []);
    table.setAttribute('data-state', state);
    root.querySelectorAll('[data-state-choice]').forEach((button) => {
      const pressed = button.dataset.stateChoice === state;
      button.classList.toggle('active', pressed);
      button.setAttribute('aria-pressed', String(pressed));
    });
  };
  root.querySelector('[data-states]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-state-choice]');
    if (button) show(button.dataset.stateChoice);
  });
  table.addEventListener('sf-view-table-refresh', () => {
    log.textContent = 'Повторная загрузка…';
    show('loading');
    setTimeout(() => { show('populated'); log.textContent = 'Загружено.'; }, 800);
  });
  show('populated');
};

initializeStates();
