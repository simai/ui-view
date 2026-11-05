// A company directory: one table fed directly with 24 people. Search, sorting
// and the column settings are the table's own; on a narrow screen it turns into
// a list (layout="auto") with the name and the two fields of highest priority.
const PEOPLE = [
  ['Анна Белова', 'Руководитель проектов', 'pm', 'Москва', '2019-03-11', 'office'],
  ['Илья Орлов', 'Ведущий разработчик', 'dev', 'Казань', '2020-07-01', 'remote'],
  ['Мария Котова', 'Дизайнер интерфейсов', 'design', 'Москва', '2021-02-15', 'hybrid'],
  ['Олег Смирнов', 'Менеджер по продажам', 'sales', 'Санкт-Петербург', '2018-09-03', 'office'],
  ['Ирина Волкова', 'Бухгалтер', 'finance', 'Москва', '2017-05-22', 'office'],
  ['Дмитрий Лебедев', 'Системный администратор', 'ops', 'Новосибирск', '2022-01-10', 'remote'],
  ['Екатерина Новикова', 'Аналитик', 'dev', 'Екатеринбург', '2023-04-03', 'hybrid'],
  ['Павел Морозов', 'Тестировщик', 'dev', 'Самара', '2021-11-08', 'remote'],
  ['Светлана Кузнецова', 'Специалист поддержки', 'support', 'Краснодар', '2022-06-20', 'remote'],
  ['Артём Попов', 'Фронтенд-разработчик', 'dev', 'Москва', '2024-02-12', 'hybrid'],
  ['Юлия Соколова', 'Маркетолог', 'marketing', 'Санкт-Петербург', '2020-10-19', 'office'],
  ['Никита Фёдоров', 'Бэкенд-разработчик', 'dev', 'Нижний Новгород', '2023-08-28', 'remote'],
  ['Ольга Михайлова', 'HR-специалист', 'hr', 'Москва', '2019-12-02', 'office'],
  ['Сергей Васильев', 'Технический директор', 'dev', 'Москва', '2016-04-18', 'office'],
  ['Наталья Егорова', 'Редактор', 'marketing', 'Казань', '2022-09-05', 'remote'],
  ['Алексей Павлов', 'Менеджер по продажам', 'sales', 'Екатеринбург', '2021-03-29', 'hybrid'],
  ['Татьяна Зайцева', 'Специалист поддержки', 'support', 'Самара', '2023-01-16', 'remote'],
  ['Роман Голубев', 'DevOps-инженер', 'ops', 'Москва', '2020-02-24', 'hybrid'],
  ['Виктория Николаева', 'Финансовый аналитик', 'finance', 'Москва', '2024-05-13', 'office'],
  ['Максим Андреев', 'Дизайнер', 'design', 'Санкт-Петербург', '2022-11-21', 'remote'],
  ['Елена Степанова', 'Руководитель поддержки', 'support', 'Краснодар', '2018-06-11', 'office'],
  ['Кирилл Романов', 'Мобильный разработчик', 'dev', 'Новосибирск', '2023-10-02', 'remote'],
  ['Полина Захарова', 'Менеджер по персоналу', 'hr', 'Москва', '2021-08-16', 'hybrid'],
  ['Григорий Ильин', 'Архитектор решений', 'dev', 'Москва', '2017-10-30', 'office'],
];
const DEPARTMENTS = [
  {value: 'dev', label: 'Разработка', scheme: 'primary'},
  {value: 'design', label: 'Дизайн', scheme: 'primary'},
  {value: 'pm', label: 'Проекты', scheme: 'primary'},
  {value: 'sales', label: 'Продажи', scheme: 'success'},
  {value: 'marketing', label: 'Маркетинг', scheme: 'success'},
  {value: 'support', label: 'Поддержка', scheme: 'warning'},
  {value: 'ops', label: 'Инфраструктура', scheme: 'warning'},
  {value: 'finance', label: 'Финансы', scheme: 'neutral'},
  {value: 'hr', label: 'Персонал', scheme: 'neutral'},
];
const FORMAT = [
  {value: 'office', label: 'В офисе', scheme: 'neutral'},
  {value: 'hybrid', label: 'Гибрид', scheme: 'neutral'},
  {value: 'remote', label: 'Удалённо', scheme: 'neutral'},
];

const initializeStaff = async () => {
  await customElements.whenDefined('sf-view-table');
  const table = document.querySelector('#staff-table');
  if (!table || table.dataset.exampleReady === 'true') return;
  table.dataset.exampleReady = 'true';
  table.setColumns([
    {key: 'name', label: 'Сотрудник', role: 'title', sortable: true},
    {key: 'position', label: 'Должность', sortable: true, priority: 1},
    {key: 'department', label: 'Отдел', propertyType: 'choice', options: DEPARTMENTS, sortable: true, priority: 2},
    {key: 'city', label: 'Город', sortable: true, priority: 3},
    {key: 'hired', label: 'В компании с', propertyType: 'date', sortable: true, priority: 4},
    {key: 'format', label: 'Формат', propertyType: 'choice', options: FORMAT, priority: 5},
  ]);
  table.setRows(PEOPLE.map(([name, position, department, city, hired, format], index) => ({
    id: `p-${index + 1}`, name, position, department, city, hired, format,
  })));
};

initializeStaff();
