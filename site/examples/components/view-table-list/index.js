// The same table as a compact list: the title and the two fields of the
// highest priority. On a narrow screen a table turns into this list by itself
// (layout="auto"); here it is asked for.
const initializeTasks = async () => {
  await customElements.whenDefined('sf-view-table');
  const table = document.querySelector('#tasks-list');
  if (!table || table.dataset.exampleReady === 'true') return;
  table.dataset.exampleReady = 'true';

  table.setColumns([
    {key: 'title', label: 'Задача', role: 'title'},
    {key: 'assignee', label: 'Исполнитель', priority: 2},
    {key: 'due', label: 'Срок', propertyType: 'date', priority: 1},
    {key: 'project', label: 'Проект', priority: 3},
  ]);
  table.setRows([
    {id: 't-1', title: 'Согласовать макет главной страницы', assignee: 'Анна Белова', due: '2026-11-10', project: 'Портал клиента'},
    {id: 't-2', title: 'Перенести справочник товаров', assignee: 'Илья Орлов', due: '2026-11-12', project: 'Каталог'},
    {id: 't-3', title: 'Проверить выгрузку в 1С', assignee: 'Мария Котова', due: '2026-11-14', project: 'Интеграции'},
    {id: 't-4', title: 'Подготовить отчёт за октябрь', assignee: 'Олег Смирнов', due: '2026-11-07', project: 'Отчётность'},
  ]);
};

initializeTasks();
