// Record card settings by levels (shared, profile, personal), answered
// by a host that lives on this page: simai.property-view-port 1.22.0.
//
// The host keeps, per settings profile, a shared layer and this person's
// personal layer, and resolves the card from the package arrangement below
// them. Every request the card sends is listed under it:
//   - an edit in the arranging mode is view.save, personal, at once;
//   - «Сохранить для всех» is view.publish (the personal layer merged into the
//     shared one and cleared);
//   - «Вернуть как у всех» in the profile picker is view.reset of the
//     personal layer only;
//   - «Закрыть для изменений» is view.lock (an administrator's);
//   - a required view writes nothing.
const STAGES = [
  {value: 'lead', label: 'Новая', scheme: 'secondary'},
  {value: 'offer', label: 'Предложение', scheme: 'primary'},
  {value: 'won', label: 'Успешна', scheme: 'success'},
];
const base = () => ({
  record_id: 'deal-15',
  collection: 'crm.deals',
  revision: '7',
  label: 'Сделка № 15',
  actions: ['record.edit'],
  sections: [
    {key: 'deal', label: 'Сделка', icon: 'article', groups: [
      {key: 'main', label: 'Основное', columns: 2, fields: [
        {key: 'name', label: 'Название', propertyType: 'string', value: 'Поставка кофемашин', width: 'full'},
        {key: 'company', label: 'Компания', propertyType: 'string', value: 'ООО «Северный ветер»', width: 'half'},
        {key: 'sum', label: 'Сумма', propertyType: 'money', value: {amount: '480000.00', currency: 'RUB'}, width: 'half'},
        {key: 'stage', label: 'Стадия', propertyType: 'choice', value: 'offer', width: 'half', options: STAGES},
        {key: 'pay', label: 'Условия оплаты', propertyType: 'text', value: '50 % предоплата, остаток после поставки', width: 'full'},
      ]},
    ]},
    {key: 'client', label: 'Клиент', icon: 'person', groups: [
      {key: 'contact', label: 'Контакт', columns: 2, fields: [
        {key: 'person', label: 'Контактное лицо', propertyType: 'string', value: 'Ирина Волкова', width: 'half'},
        {key: 'phone', label: 'Телефон', propertyType: 'string', value: '+7 921 555-12-40', width: 'half'},
        {key: 'inn', label: 'ИНН', propertyType: 'string', value: '7801234567', width: 'half'},
      ]},
    ]},
    {key: 'delivery', label: 'Доставка', icon: 'local_shipping', groups: [
      {key: 'where', label: 'Куда и когда', columns: 2, fields: [
        {key: 'date', label: 'Дата', propertyType: 'date', value: '2026-12-04', width: 'half'},
        {key: 'addr', label: 'Адрес', propertyType: 'text', value: 'Санкт-Петербург, Невский пр., 28', width: 'full'},
      ]},
    ]},
  ],
});

const copy = (value) => JSON.parse(JSON.stringify(value ?? null));
const empty = () => ({schema_version: 1, sections: {}, groups: {}, fields: {}});
let revision = 10;
const next = () => String(++revision);

let role = 'admin';
let profiles;
let current;
let store;
let locked;
function reset(to) {
  role = to;
  profiles = role === 'required'
    ? [{id: 'new', label: 'Новичкам', shared: true, required: true}]
    : [{id: 'main', label: 'Для всех', shared: true}, {id: 'acc', label: 'Бухгалтерия', shared: true}, {id: 'mine', label: 'Моя раскладка', shared: false}];
  current = profiles[0].id;
  store = Object.fromEntries(profiles.map((profile) => [profile.id, {
    shared: {revision: '3', view: {...empty(), fields: {inn: {hidden: true}}, head: {subtitle: ['company', 'sum'], status: 'stage'}}},
    personal: {revision: null, view: null},
  }]));
  locked = ['fields.stage.hidden'];
}
reset('admin');

// The layers over the package arrangement: order, place, name, icon, width,
// hidden -- the shared layer first, then the personal one.
function resolve(profile) {
  const record = base();
  const sections = new Map(record.sections.map((section) => [section.key, section]));
  const groups = new Map();
  const fields = new Map();
  for (const section of record.sections) {
    section.groups.forEach((group, at) => { groups.set(group.key, {group, section: section.key, order: at + 1}); });
    for (const group of section.groups) group.fields.forEach((field, at) => fields.set(field.key, {field, group: group.key, order: at + 1}));
  }
  const order = new Map();
  record.sections.forEach((section, at) => order.set(section.key, at + 1));
  let head = null;
  const layers = store[profile];
  for (const kind of ['shared', 'personal']) {
    const view = layers[kind]?.view;
    if (!view) continue;
    for (const [key, entry] of Object.entries(view.sections ?? {})) {
      if (!sections.has(key)) sections.set(key, {key, label: entry.label ?? key, groups: []});
      const section = sections.get(key);
      for (const name of ['label', 'icon', 'hidden']) if (entry[name] !== undefined) section[name] = entry[name];
      if (entry.hidden) section.hiddenBy = kind;
      if (entry.order !== undefined) order.set(key, entry.order);
    }
    for (const [key, entry] of Object.entries(view.groups ?? {})) {
      if (!groups.has(key)) groups.set(key, {group: {key, label: entry.label ?? key, columns: 1, fields: []}, section: entry.section ?? 'deal', order: 99});
      const place = groups.get(key);
      for (const name of ['label', 'hidden', 'columns']) if (entry[name] !== undefined) place.group[name] = entry[name];
      if (entry.section !== undefined) place.section = entry.section;
      if (entry.order !== undefined) place.order = entry.order;
    }
    for (const [key, entry] of Object.entries(view.fields ?? {})) {
      const place = fields.get(key);
      if (!place) continue;
      for (const name of ['label', 'hint', 'width', 'hidden']) if (entry[name] !== undefined) place.field[name] = entry[name];
      if (entry.hidden) place.field.hiddenBy = kind;
      if (entry.group !== undefined) place.group = entry.group;
      if (entry.order !== undefined) place.order = entry.order;
    }
    if (view.head) head = view.head;
  }
  const byOrder = (left, right) => left.order - right.order;
  for (const section of sections.values()) section.groups = [];
  for (const place of [...groups.values()].sort(byOrder)) {
    place.group.fields = [];
    sections.get(place.section)?.groups.push(place.group);
  }
  record.unplaced = [];
  for (const place of [...fields.values()].sort(byOrder)) {
    // One way to not show a field: a hidden one stands in «Скрытые поля».
    const holder = place.group && !place.field.hidden ? groups.get(place.group)?.group : null;
    if (holder) holder.fields.push(place.field);
    else record.unplaced.push(place.field);
  }
  record.sections = [...sections.values()].sort((left, right) => (order.get(left.key) ?? 99) - (order.get(right.key) ?? 99));
  record.view = {
    target: layers.personal.view ? 'personal' : 'shared',
    layers: copy(layers),
    editable: role === 'admin' ? ['personal', 'shared'] : ['personal'],
    denied: role === 'admin' ? null : {shared: 'Общий вид меняет администратор'},
    profiles: copy(profiles),
    profile,
    locked: [...locked],
    head,
  };
  return record;
}

const merge = (into, from) => {
  const out = copy(into ?? empty());
  for (const bucket of ['sections', 'groups', 'fields']) {
    for (const [key, entry] of Object.entries(from?.[bucket] ?? {})) out[bucket][key] = {...(out[bucket][key] ?? {}), ...entry};
  }
  if (from?.head) out.head = copy(from.head);
  return out;
};

const log = (line) => {
  const list = document.querySelector('#deal-card')?.closest('.page-settings')?.querySelector('[data-log]');
  if (!list) return;
  const item = document.createElement('li');
  item.textContent = line;
  list.prepend(item);
};
const brief = (intent, payload) => {
  if (intent === 'view.save') return `view.save {target: ${payload.target.kind}, revision: ${payload.target.revision}} — сразу`;
  if (intent === 'view.reset') return `view.reset {target: ${payload.target.kind}, revision: ${payload.target.revision}}`;
  if (intent === 'view.publish') return `view.publish {profile: ${payload.profile}, personal_revision: ${payload.personal_revision}, shared_revision: ${payload.shared_revision}}`;
  if (intent === 'view.lock') return `view.lock {path: ${payload.path}, locked: ${payload.locked}, revision: ${payload.revision}}`;
  if (intent === 'view.profile') return `view.profile {profile: ${payload.profile}}`;
  if (intent === 'view.create') return `view.create {label: «${payload.label}», shared: ${payload.shared}}`;
  return intent;
};

async function raise(intent, payload) {
  if (intent !== 'record.load') log(brief(intent, payload));
  const layers = store[current];
  switch (intent) {
    case 'record.load':
      return {answer: 'applied', record: resolve(current)};
    case 'view.save': {
      const kind = payload.target.kind;
      if (payload.target.revision !== layers[kind].revision) return {answer: 'conflict', revision: layers[kind].revision, view: layers[kind].view ?? empty()};
      layers[kind] = {revision: next(), view: copy(payload.view)};
      return {answer: 'applied', revision: layers[kind].revision};
    }
    case 'view.reset': {
      const kind = payload.target.kind;
      layers[kind] = {revision: next(), view: null};
      return {answer: 'applied', revision: layers[kind].revision, view: resolve(current).view};
    }
    case 'view.publish': {
      if (payload.shared_revision !== layers.shared.revision) return {answer: 'conflict', shared: copy(layers.shared), personal: copy(layers.personal)};
      layers.shared = {revision: next(), view: merge(layers.shared.view, layers.personal.view)};
      layers.personal = {revision: next(), view: null};
      return {answer: 'applied', shared: copy(layers.shared), personal: copy(layers.personal)};
    }
    case 'view.lock': {
      locked = payload.locked ? [...new Set([...locked, payload.path])] : locked.filter((path) => path !== payload.path);
      layers.shared.revision = next();
      return {answer: 'applied', locked: [...locked], revision: layers.shared.revision};
    }
    case 'view.profile':
      current = payload.profile;
      return {answer: 'applied', record: resolve(current)};
    case 'view.create': {
      const id = `v${profiles.length + 1}`;
      profiles = [...profiles, {id, label: payload.label, shared: Boolean(payload.shared)}];
      store[id] = {shared: {revision: null, view: null}, personal: {revision: next(), view: copy(payload.view)}};
      current = id;
      return {answer: 'applied', record: resolve(current)};
    }
    case 'view.rename':
      profiles = profiles.map((profile) => (profile.id === payload.profile ? {...profile, label: payload.label} : profile));
      return {answer: 'applied', record: resolve(current)};
    case 'view.delete':
      profiles = profiles.filter((profile) => profile.id !== payload.profile);
      if (current === payload.profile) current = profiles[0].id;
      return {answer: 'applied', record: resolve(current)};
    case 'group.save':
      return {answer: 'applied', record: resolve(current)};
    default:
      return {answer: 'unavailable', reason: 'unknown-intent'};
  }
}

const initializeSettingsCard = async () => {
  await customElements.whenDefined('sf-view-properties');
  const card = document.querySelector('#deal-card');
  if (!card || card.dataset.exampleReady === 'true') return;
  card.dataset.exampleReady = 'true';
  card.setHostPort({version: '1.22.0', capabilities: ['view-settings'], raise});
  // «Добавить поле» is the data owner's structure editor.
  card.addEventListener('sf-view-properties-structure', (event) => log(`структура: открыть редактор полей ${event.detail?.collection ?? ''}`));
  const page = card.closest('.page-settings');
  page.querySelector('[data-configure]')?.addEventListener('click', () => card.startConfiguringView());
  // sf-button hands data-role to the button it draws: the role is read where
  // it is, the look is set on the sf-button around it.
  const host = (node) => node.closest('sf-button') ?? node;
  for (const button of page.querySelectorAll('[data-role]')) {
    button.addEventListener('click', async () => {
      reset(button.dataset.role);
      for (const other of page.querySelectorAll('[data-role]')) {
        const on = other === button;
        host(other).setAttribute('aria-pressed', String(on));
        host(other).setAttribute('appearance', on ? 'tonal' : 'ghost');
        host(other).setAttribute('scheme', on ? 'primary' : 'on-surface');
      }
      if (card.configuring) card.stopConfiguringView();
      log(`вход: ${host(button).getAttribute('text')}`);
      await card.load('role');
    });
  }
};

initializeSettingsCard();
