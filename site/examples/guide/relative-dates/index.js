// A date and a date-time column drawn relative to today (variant
// "relative"): «сегодня», «вчера», «3 дня назад», in the page language; the
// full date is in the cell's title. «Срок» is the same kind of date drawn
// whole, for comparison. The dates are counted from the moment the example
// opens, so the words stay true on any day.
const at = (days, hour = 10) => {
  const moment = new Date();
  moment.setDate(moment.getDate() + days);
  moment.setHours(hour, 15, 0, 0);
  return moment;
};
const day = (days) => {
  const moment = at(days);
  const pad = (number) => String(number).padStart(2, '0');
  return `${moment.getFullYear()}-${pad(moment.getMonth() + 1)}-${pad(moment.getDate())}`;
};

const initializeRelative = async () => {
  await customElements.whenDefined('sf-view-table');
  const table = document.querySelector('#relative-table');
  if (!table || table.dataset.exampleReady === 'true') return;
  table.dataset.exampleReady = 'true';
  table.setColumns([
    {key: 'title', label: 'Задача', role: 'title', sortable: true},
    {key: 'due', label: 'Срок', propertyType: 'date', sortable: true},
    {key: 'started', label: 'Начата', propertyType: 'date', variant: 'relative', sortable: true},
    {key: 'updated', label: 'Изменена', propertyType: 'datetime', variant: 'relative', sortable: true},
  ]);
  table.setRows([
    {id: 't-1', title: 'Согласовать договор', due: day(2), started: day(0), updated: at(0, 9).toISOString()},
    {id: 't-2', title: 'Подготовить счёт', due: day(5), started: day(-1), updated: at(-1, 16).toISOString()},
    {id: 't-3', title: 'Проверить отгрузку', due: day(1), started: day(-3), updated: at(-3, 11).toISOString()},
    {id: 't-4', title: 'Обновить прайс', due: day(14), started: day(-12), updated: at(-9, 14).toISOString()},
    {id: 't-5', title: 'Сверка с поставщиком', due: day(30), started: day(-70), updated: at(-40, 12).toISOString()},
  ]);
};

initializeRelative();
