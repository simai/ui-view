// Two blocks: one shows a record's fields, the other asks for a few and sends
// them. sf-view-flow holds only the fields it is given; a Send is the
// event sf-view-flow-answer with the values, and the page answers it
// with settle() -- applied, or refused with a message for a field.
const vacation = [
  {key: 'employee', label: 'Сотрудник', propertyType: 'string', width: 'full', value: 'Ирина Волкова'},
  {key: 'from', label: 'С', propertyType: 'date', width: 'half', value: '2026-12-21'},
  {key: 'to', label: 'По', propertyType: 'date', width: 'half', value: '2027-01-08'},
  {key: 'days', label: 'Дней', propertyType: 'integer', width: 'half', value: 19},
  {key: 'status', label: 'Статус', propertyType: 'choice', width: 'half', value: 'approved',
    options: [{value: 'approved', label: 'Согласована', scheme: 'success'}]},
];
const trip = [
  {key: 'city', label: 'Город', propertyType: 'string', width: 'half', required: true, placeholder: 'Куда'},
  {key: 'from', label: 'Выезд', propertyType: 'date', width: 'half', required: true},
  {key: 'nights', label: 'Ночей', propertyType: 'integer', variant: 'stepper', width: 'half', min: 1, max: 14, value: 2},
  {key: 'goal', label: 'Цель поездки', propertyType: 'text', width: 'full', placeholder: 'Например, встреча с заказчиком'},
];

const initializeBlocks = async () => {
  await customElements.whenDefined('sf-view-flow');
  const shown = document.querySelector('#vacation');
  const asked = document.querySelector('#trip');
  if (!asked || asked.dataset.exampleReady === 'true') return;
  asked.dataset.exampleReady = 'true';
  shown.fields = vacation;
  asked.fields = trip;
  const log = document.querySelector('#trip-log');
  asked.addEventListener('sf-view-flow-answer', async (event) => {
    const {accepted, values} = event.detail;
    log.textContent = accepted ? `Отправлено: ${JSON.stringify(values)}` : 'Отменено';
    await new Promise((done) => setTimeout(done, 400));
    // The application's own check: what only it can know.
    if (accepted && /^москва$/iu.test(String(values.city ?? '').trim())) {
      asked.settle({answer: 'refused', errors: {city: 'В город, где вы работаете, командировка не оформляется.'}});
      return;
    }
    asked.settle({answer: 'applied'});
  });
};

initializeBlocks();
