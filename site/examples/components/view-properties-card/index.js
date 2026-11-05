// One record, answered by a host that lives on this page. sf-view-properties
// owns no data: it asks for the record (record.load), draws what the host
// answers, and sends a group's changed values back (group.save). The host here
// keeps the record in memory and answers each save with the next revision, as
// a server would.
const client = {
  record_id: 'client-k12',
  collection: 'crm.clients',
  revision: 7,
  label: 'ООО «Северный ветер»',
  sections: [
    {
      key: 'main',
      label: 'Общее',
      groups: [
        {
          key: 'company',
          label: 'Компания',
          columns: 2,
          fields: [
            {key: 'name', label: 'Название', propertyType: 'string', value: 'ООО «Северный ветер»', width: 'half', required: true},
            {key: 'inn', label: 'ИНН', propertyType: 'string', value: '7801234567', width: 'half'},
            {key: 'segment', label: 'Сегмент', propertyType: 'choice', width: 'half', value: 'key', options: [
              {value: 'key', label: 'Ключевой клиент'},
              {value: 'regular', label: 'Постоянный'},
              {value: 'new', label: 'Новый'},
            ]},
            {key: 'since', label: 'Клиент с', propertyType: 'date', value: '2023-04-17', width: 'half'},
            {key: 'note', label: 'Заметка', propertyType: 'text', width: 'full', value: 'Поставки раз в квартал, оплата по факту отгрузки.'},
          ],
        },
        {
          key: 'contact',
          label: 'Контакт',
          columns: 2,
          fields: [
            {key: 'person', label: 'Контактное лицо', propertyType: 'string', value: 'Ирина Волкова', width: 'half'},
            {key: 'email', label: 'Почта', propertyType: 'string', value: 'volkova@example.ru', width: 'half'},
            {key: 'manager', label: 'Менеджер', propertyType: 'record', width: 'half', value: {value: 'u-4', label: 'Олег Смирнов', href: '#u-4'}},
            {key: 'newsletter', label: 'Получает рассылку', propertyType: 'boolean', value: true, width: 'half'},
          ],
        },
      ],
    },
  ],
};

const copy = (value) => JSON.parse(JSON.stringify(value));
const answer = () => ({answer: 'applied', record: copy(client)});

const initializeClientCard = async () => {
  await customElements.whenDefined('sf-view-properties');
  const card = document.querySelector('#client-card');
  if (!card || card.dataset.exampleReady === 'true') return;
  card.dataset.exampleReady = 'true';

  card.setHostPort({
    version: '1.7.0',
    capabilities: [],
    async raise(intent, payload) {
      if (intent === 'record.load') return answer();
      if (intent === 'group.save') {
        const group = client.sections.find((section) => section.key === payload?.section)?.groups.find((item) => item.key === payload?.group);
        for (const field of group?.fields ?? []) {
          if (payload?.values && field.key in payload.values) field.value = payload.values[field.key];
        }
        client.revision += 1;
        return answer();
      }
      return {answer: 'unavailable', reason: 'unknown-intent'};
    },
  });
};

initializeClientCard();
