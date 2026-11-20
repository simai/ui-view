// Written by scripts/build-properties.mjs from scripts/property-catalogue.js
// and the engine below it; edit those.
const TYPE = "integer";
const TYPE_DATA = {
 "family": "numbers",
 "short": true,
 "field": {
  "key": "stock",
  "label": "Остаток",
  "propertyType": "integer",
  "unit": "шт.",
  "min": 0,
  "max": 100000,
  "step": 1
 },
 "samples": [
  [
   "Обычное",
   128
  ],
  [
   "Большое",
   1250000
  ],
  [
   "Пусто",
   null
  ]
 ],
 "error": "Не больше 100 000",
 "templates": [
  {
   "id": "input",
   "name": "Поле числа",
   "changes": []
  },
  {
   "id": "stepper",
   "name": "Кнопки «−» и «+»",
   "changes": [
    "edit"
   ],
   "variant": "stepper",
   "what": "поле количества: кнопки «−» и «+» и стрелки клавиатуры, шаг `step`"
  }
 ],
 "server": [
  [
   "Значение",
   "целое число `128`"
  ],
  [
   "Пустое",
   "`null`"
  ],
  [
   "Из правки",
   "целое число; очищенное поле — `null`"
  ],
  [
   "Из фильтра",
   "`{operator: \"between\", value: [10, 500]}` и другие сравнения"
  ]
 ],
 "settings": [
  [
   "`unit`",
   "нет",
   "Показ, Кратко",
   "единица после числа: `шт.`, `кг`"
  ],
  [
   "`min`, `max`, `step`",
   "нет",
   "Правка",
   "границы и шаг ввода"
  ],
  [
   "`required`",
   "нет",
   "Правка",
   "обязательное поле: отметка у подписи, пустое не сохраняется"
  ],
  [
   "`readonly`",
   "нет",
   "Правка",
   "поле только для чтения: значение видно, изменить нельзя"
  ]
 ],
 "storage": [
  "`integer@1`",
  "свойство «Число» (`number`), целое"
 ]
};
const OPTIONS_OF = {};

// The live example of a «Свойства» page (examples/properties/<type>/index.js,
// written by scripts/build-properties.mjs: `const TYPE`, `const TYPE_DATA` --
// the type's entry of scripts/property-catalogue.js -- and `const OPTIONS_OF`
// before this text). One template for every type: four sections in order,
// each drawn by the SIMAI Framework field renderers (SF.fieldRenderers) on one sample field; the page is the host,
// holds the value and shows what a server would receive.
//
//   Показ    the three sample values: normal, long, empty (renderViewField);
//   Кратко   the compact form inside any view: the same three records in a
//            table column and on cards (renderCellField); a short field opens
//            a small edit window at its value, and saving updates both;
//   Правка   the interactive field with «Сервер получит», then empty and
//            required, a real error (invalid and error-message on the
//            control) and read only (renderEditField);
//   Фильтр   the open filter control with «В запрос уйдёт» (renderFilterField).
//
// A type with more than one template gets a template switch over the four
// sections; a template only draws, so the record's value and the server lines
// stay as they are when it changes, and the sections it changes are marked.
// The template is read from the Framework's registry (`templates` of the type)
// and named with `template`; a Framework whose registry has no templates
// yet draws the same template under its former `variant` name, and a type it
// does not have yet (phone, password) with `drawnAs`.
//
// The types the set view draws itself (money, percent, items, compound,
// ru.requisites) are drawn by the Framework where it has a renderer for them;
// where it has none, Показ and Правка are the set's own sf-view-properties
// card (no head, one group), and Кратко and Фильтр stay the Framework's.

const D = TYPE_DATA;
const PLACES = {view: 'Показ', compact: 'Кратко', edit: 'Правка', filter: 'Фильтр'};
const RECORDS = [
  {id: 'r-1', name: '№ 2041', client: 'ООО «Вектор»'},
  {id: 'r-2', name: '№ 2042', client: 'ИП Сорокин'},
  {id: 'r-3', name: '№ 2043', client: 'АО «Северный порт»'},
];
const OPERATORS = {
  contains: 'Содержит', eq: 'Равно', neq: 'Не равно', gt: 'Больше', gte: 'Не меньше', lt: 'Меньше', lte: 'Не больше',
  between: 'Между', in: 'Любой из', any: 'Любой', startsWith: 'Начинается с', today: 'Сегодня', week: 'Эта неделя', month: 'Этот месяц',
};
const DATED = {eq: 'Точная дата', gt: 'Позже', gte: 'Не раньше', lt: 'Раньше', lte: 'Не позже'};
const FILTER_OPERATORS = {
  integer: ['between', 'eq', 'gte', 'lte'], number: ['between', 'eq', 'gte', 'lte'], money: ['between', 'eq', 'gte', 'lte'],
  percent: ['between', 'eq', 'gte', 'lte'], items: ['between', 'eq', 'gte', 'lte'],
  date: ['between', 'eq', 'gte', 'lte'], datetime: ['between', 'eq', 'gte', 'lte'],
};

const shown = (value) => JSON.stringify(value, (key, item) => (typeof item === 'string' && item.startsWith('data:') ? 'data:…' : item));
const clone = (value) => (value === undefined ? undefined : structuredClone(value));

// Numbers in Russian style with the field's precision, as an application's
// host formats them (formatFieldValue); scale and meter draw the number itself.
const formatFieldValue = (field, value) => {
  const type = field?.propertyType ?? field?.type;
  if (value == null || value === '') return undefined;
  if ((type === 'number' || type === 'integer') && typeof value === 'number' && !['scale', 'meter'].includes(field?.template ?? field?.variant)) {
    const digits = type === 'integer' ? 0 : field?.precision;
    return new Intl.NumberFormat('ru-RU', digits == null ? {} : {minimumFractionDigits: digits, maximumFractionDigits: digits}).format(value);
  }
  return undefined;
};

const state = {
  set: null,
  entry: null,
  template: null,
  value: clone(D.samples[0][1]),
  records: RECORDS.map((record, index) => ({...record, value: clone(D.samples[index][1])})),
  filter: {},
  search: {},
  editOut: '',
  compactOut: '',
};

// The registry entry of the type, the one the Framework has for it now.
const registryEntry = (type) => (state.set.registry ?? []).find((entry) => entry.type === type) ?? null;
const ownType = () => Boolean(registryEntry(D.field.propertyType));
const hasTemplates = () => Array.isArray(registryEntry(ownType() ? D.field.propertyType : (D.drawnAs?.propertyType ?? D.field.propertyType))?.templates);

// The templates this Framework draws: by id when its registry lists
// templates, else the default and those it knows under their former variant.
const templates = () => D.templates.filter((template, index) => {
  if (index === 0) return true;
  const entry = registryEntry(D.field.propertyType) ?? registryEntry(D.drawnAs?.propertyType);
  if (Array.isArray(entry?.templates)) return entry.templates.some((one) => one.id === template.id);
  return Boolean(template.variant) && (entry?.variants ?? []).some((one) => one.id === template.variant);
});

// The field as the Framework of this page reads it: the type it has (or the
// one it draws the type with) and the chosen template.
const fieldOf = (extra = {}) => {
  let field = {...clone(D.field)};
  if (!ownType() && D.drawnAs) field = {...field, ...D.drawnAs};
  const template = state.template;
  if (template && template !== D.templates[0]) {
    if (hasTemplates()) field.template = template.id;
    else if (template.variant) field.variant = template.variant;
  }
  return {...field, ...extra};
};

const el = (root, name) => root.querySelector(`[data-slot="${name}"]`);
const render = (template, node) => window.SF.render(template ?? window.SF.nothing, node);
const empty = (node, text = '—') => {
  if (!node.textContent.trim() && !node.querySelector('*')) {
    node.innerHTML = '';
    const muted = document.createElement('span');
    muted.className = 'property-muted';
    muted.textContent = text;
    node.append(muted);
  }
};

// The host the edit and the compact window write through.
const editHost = (onValue, onError) => ({
  setFieldValue: (field, value) => onValue(value),
  setFieldError: (field, message) => onError?.(message),
  getFieldOptionsPage: (field) => state.search[field.key]?.page ?? null,
  getFieldOptionSearch: (field) => state.search[field.key]?.text ?? '',
  setFieldOptionSearch: (field, text) => { state.search[field.key] = {...(state.search[field.key] ?? {}), text}; },
  loadFieldOptions: async (field, {search = ''} = {}) => {
    const all = OPTIONS_OF[D.field.key] ?? D.field.options ?? [];
    const items = all.filter((item) => String(item.label).toLowerCase().includes(String(search).toLowerCase()));
    state.search[field.key] = {text: search, page: {status: 'ready', items, nextCursor: null}};
  },
  formatFieldValue,
});

// The filter's host: the state of the open control, the words of its
// conditions, the options of a list (the field's own, the host's for people
// and records, «Да» and «Нет» for a yes-or-no field).
const filterOptions = () => {
  if (D.field.propertyType === 'boolean') return [{value: true, label: D.field.trueText ?? 'Да'}, {value: false, label: D.field.falseText ?? 'Нет'}];
  return D.field.options ?? OPTIONS_OF[D.field.key] ?? null;
};
const filterField = () => {
  const field = fieldOf();
  const options = filterOptions();
  const operators = D.field.filter?.operators ?? FILTER_OPERATORS[D.field.propertyType];
  return {...field, filter: {...(field.filter ?? {}), ...(operators ? {operators, defaultOperator: operators[0]} : {}), ...(options ? {options, defaultOperator: field.filter?.defaultOperator ?? 'in'} : {})}};
};
const filterHost = (redraw) => ({
  size: '1/2',
  getFilterControlValue: (key) => state.filter[key] ?? {},
  patchTempFilterValue: (key, patch) => { state.filter[key] = {...(state.filter[key] ?? {}), ...patch}; redraw(); },
  getFilterOperatorLabel: (operator) => ((D.field.propertyType === 'date' || D.field.propertyType === 'datetime') && DATED[operator]) || OPERATORS[operator] || operator,
  getFilterOptionSearch: (key) => state.filter[`${key}:search`] ?? '',
  patchTempFilterOptionSearch: (key, text) => { state.filter[`${key}:search`] = text; redraw(); },
  getVisibleFilterOptions: (field) => {
    const search = String(state.filter[`${field.key}:search`] ?? '').toLowerCase();
    return (field.filter?.options ?? []).filter((option) => !search || String(option.label).toLowerCase().includes(search));
  },
  getEndpointFilterPage: () => null,
  loadEndpointFilterPage: () => {},
  renderFilterOption: (field, option, selected) => {
    const {html} = window.SF;
    const value = option.value;
    return html`<div class="flex items-cross-center gap-1/2 content-main-between">
      <span class="flex items-cross-center gap-1/2 min-w-0">${field.filter?.optionRenderer === 'swatch' && option.color
        ? html`<span class="property-swatch" aria-hidden="true" style=${`background-color: ${option.color}`}></span>` : ''}<span class="sf-text-1 truncate">${option.label}</span></span>
      <sf-checkbox size="1/2" position="end" ?checked=${selected.has(value)} @change=${(event) => {
        const next = new Set(selected);
        if (event.target?.checked) next.add(value); else next.delete(value);
        state.filter[field.key] = {...(state.filter[field.key] ?? {}), values: [...next], operator: field.filter?.defaultOperator || 'in'};
        redraw();
      }}></sf-checkbox></div>`;
  },
});

// ---- set fields (money, percent, items, compound, ru.requisites) ----------
// Drawn by the Framework when it has a renderer for the type, else by the
// set's card: one group, no head.
const frameworkDraws = (place) => {
  const {set} = state;
  const field = fieldOf();
  if (place === 'view') return Boolean(set.renderViewField(field, D.samples[0][1], {formatFieldValue}));
  if (place === 'edit') return Boolean(set.renderEditField(field, D.samples[0][1], {setFieldValue() {}}, {size: '1/2'}));
  return true;
};
const cardOf = (fields, record = 'r-0') => ({
  record_id: record, collection: 'demo.property', revision: '1', label: '', actions: ['record.edit'],
  sections: [{key: 'main', label: '', groups: [{key: 'fields', label: '', columns: 1, fields}]}],
});
const setCard = (node, mode, fields, onSave) => {
  node.innerHTML = '';
  const card = document.createElement('sf-view-properties');
  card.setAttribute('mode', mode);
  card.setAttribute('aria-label', D.field.label);
  card.classList.add('property-card');
  node.append(card);
  customElements.whenDefined('sf-view-properties').then(() => {
    card.setHostPort({
      version: '1.17.0', capabilities: [],
      async raise(intent, payload) {
        if (intent === 'record.load') return {answer: 'applied', record: cardOf(fields)};
        if (intent === 'record.save' || intent === 'group.save') {
          onSave?.(payload.values);
          return {answer: 'applied', record: cardOf(fields.map((field) => (field.key in (payload.values ?? {}) ? {...field, value: payload.values[field.key]} : field))), revision: '2'};
        }
        return {answer: 'unavailable', reason: 'capability-not-provided'};
      },
      formatFieldValue,
    });
    card.setAttribute('record-id', 'r-0');
  });
  return card;
};

// ---- the four places -------------------------------------------------------
const drawView = (root) => {
  const rows = el(root, 'view');
  rows.innerHTML = '';
  if (!frameworkDraws('view')) {
    const cell = document.createElement('div');
    cell.className = 'property-span';
    rows.append(cell);
    setCard(cell, 'view', D.samples.map(([label, value], index) => ({...fieldOf(), key: `${D.field.key}_${index}`, label, value: clone(value)})));
    return;
  }
  for (const [label, value] of D.samples) {
    const name = document.createElement('span');
    name.className = 'property-label';
    name.textContent = label;
    const cell = document.createElement('div');
    cell.className = 'property-value';
    rows.append(name, cell);
    render(state.set.renderViewField(fieldOf(), clone(value), {formatFieldValue}), cell);
    empty(cell, 'не заполнено');
  }
};

const isTemplate = (value) => value && typeof value === 'object' && ('_$litType$' in value || 'strings' in value);
// A cell is text, a template, or what a table draws: {component: {type,
// props}} (an element of the Framework by its short name, SF.create), or a
// list of those on one line.
const cellPiece = (item) => {
  if (item == null || item === '') return null;
  if (isTemplate(item)) { const box = document.createElement('span'); render(item, box); return box; }
  if (item.component?.type) return window.SF.create(item.component.type, item.component.props ?? {});
  return document.createTextNode(typeof item === 'object' ? String(item.text ?? item.label ?? '') : String(item));
};
const fillCompact = (node, value) => {
  const field = fieldOf();
  let cell = state.set.renderCellField(field, clone(value), {formatFieldValue});
  // A file list is a file a piece, as the table draws it.
  if (cell == null && Array.isArray(value)) cell = value.map((one) => state.set.renderCellField(field, one, {formatFieldValue})).filter(Boolean);
  if (cell == null && value != null && typeof value !== 'object') cell = String(value);
  node.textContent = '';
  const pieces = (Array.isArray(cell) ? cell : [cell]).map(cellPiece).filter(Boolean);
  if (pieces.length > 1) node.classList.add('property-pieces');
  node.append(...pieces);
  empty(node);
};
const canEditShort = () => D.short && frameworkDraws('edit');
const compactValue = (record, index, root) => {
  const box = document.createElement('span');
  box.className = 'property-cv';
  if (!canEditShort()) { fillCompact(box, record.value); return box; }
  const popover = document.createElement('sf-popover');
  popover.setAttribute('placement', 'bottom-start');
  popover.setAttribute('width', '18rem');
  popover.setAttribute('label', `${D.field.label}, ${record.name}`);
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.slot = 'trigger';
  trigger.className = 'property-cv-button';
  trigger.setAttribute('aria-label', `${D.field.label}, ${record.name}: изменить`);
  fillCompact(trigger, record.value);
  const body = document.createElement('div');
  body.slot = 'content';
  body.className = 'property-pop';
  body.innerHTML = '<span class="property-label"></span><div data-pop-field></div><div class="flex flex-wrap gap-1/3"><sf-button size="1/2" text="Сохранить" data-save></sf-button><sf-button size="1/2" appearance="outline" scheme="on-surface" text="Отмена" data-cancel></sf-button></div>';
  body.querySelector('.property-label').textContent = D.field.label;
  popover.append(trigger, body);
  let draft = record.value;
  popover.addEventListener('sf-popover-open', () => {
    draft = clone(record.value);
    const slot = body.querySelector('[data-pop-field]');
    render(window.SF.nothing, slot);
    render(state.set.renderEditField(fieldOf({key: `${D.field.key}_c${index}`}), clone(record.value), editHost((value) => { draft = value; }), {size: '1/2'}), slot);
  });
  body.querySelector('[data-cancel]').addEventListener('click', () => popover.close?.());
  body.querySelector('[data-save]').addEventListener('click', () => {
    popover.close?.();
    record.value = draft === undefined ? record.value : clone(draft);
    state.compactOut = `Сервер получит: ${shown({record: record.id, values: {[D.field.key]: record.value ?? null}})} — таблица и карточки показывают новое значение.`;
    setTimeout(() => drawCompact(root), 30);
  });
  box.append(popover);
  return box;
};
const drawCompact = (root) => {
  const body = el(root, 'compact-rows');
  body.innerHTML = '';
  const cards = el(root, 'compact-cards');
  cards.innerHTML = '';
  state.records.forEach((record, index) => {
    const row = document.createElement('tr');
    const name = document.createElement('td');
    name.textContent = record.name;
    const cell = document.createElement('td');
    cell.append(compactValue(record, index, root));
    const client = document.createElement('td');
    client.textContent = record.client;
    row.append(name, cell, client);
    body.append(row);
    const card = document.createElement('div');
    card.className = 'property-mini';
    const title = document.createElement('b');
    title.textContent = record.name;
    card.append(title, compactValue(record, index, root));
    cards.append(card);
  });
  const out = el(root, 'compact-out');
  out.textContent = state.compactOut || (canEditShort() ? 'Нажмите на значение — у него откроется окошко правки.' : `${D.field.label} правится в карточке записи: окошко у значения — только у коротких полей.`);
};

// The error state: the control's own invalid look and message (PP-5), on the
// first Framework control of the field that takes them.
const markError = (node) => {
  const takes = (element) => {
    const name = element.localName;
    if (!name.startsWith('sf-')) return false;
    const attributes = customElements.get(name)?.observedAttributes ?? [];
    return attributes.includes('invalid') || attributes.includes('error-message');
  };
  // The controls may not be defined yet when the field is drawn: decide once
  // they are (or after a short wait), so the message lands on the control.
  const names = [...new Set([...node.querySelectorAll('*')].map((element) => element.localName).filter((name) => name.startsWith('sf-')))];
  const pending = names.filter((name) => !customElements.get(name));
  if (pending.length && !node.dataset.errorWaited) {
    node.dataset.errorWaited = 'true';
    Promise.race([Promise.all(pending.map((name) => customElements.whenDefined(name))), new Promise((done) => setTimeout(done, 3000))])
      .then(() => markError(node));
    return;
  }
  delete node.dataset.errorWaited;
  node.querySelector(':scope > .property-error')?.remove();
  const control = [...node.querySelectorAll('*')].find(takes);
  if (control) {
    control.setAttribute('invalid', '');
    control.setAttribute('error-message', D.error);
    return;
  }
  const line = document.createElement('span');
  line.className = 'property-error';
  line.textContent = D.error;
  node.append(line);
};

const drawEdit = (root) => {
  const out = el(root, 'edit-out');
  const write = () => { out.textContent = state.editOut || `Сервер получит: ${shown({[D.field.key]: state.value ?? null})} — измените поле, строка обновится.`; };
  const main = el(root, 'edit');
  const states = {empty: el(root, 'state-empty'), error: el(root, 'state-error'), readonly: el(root, 'state-readonly')};
  if (!frameworkDraws('edit')) {
    // The set's card: the field to change, then the three states as fields of
    // the same group (empty and required, refused with a message, read only).
    el(root, 'edit-label').hidden = true;
    root.querySelector('.property-states').hidden = true;
    const card = setCard(main, 'edit', [
      {...fieldOf(), value: clone(state.value)},
      {...fieldOf(), key: `${D.field.key}_empty`, label: 'Пусто, обязательное', required: true, value: null},
      {...fieldOf(), key: `${D.field.key}_error`, label: 'Ошибка', value: clone(D.samples[0][1])},
      {...fieldOf(), key: `${D.field.key}_readonly`, label: 'Только чтение', readonly: true, value: clone(D.samples[0][1])},
    ], (values) => {
      if (D.field.key in (values ?? {})) state.value = clone(values[D.field.key]);
      state.editOut = `Сервер получит: ${shown({[D.field.key]: values?.[D.field.key] ?? state.value ?? null})}`;
      write();
    });
    card.addEventListener('sf-view-properties-state', (event) => {
      if (event.detail?.state === 'loading') return;
      card.reportFieldError?.({key: `${D.field.key}_error`}, D.error);
    });
    write();
    return;
  }
  render(state.set.renderEditField(fieldOf(), clone(state.value), editHost((value) => {
    state.value = value === undefined ? null : clone(value);
    state.editOut = `Сервер получит: ${shown({[D.field.key]: state.value})}`;
    write();
  }, (message) => { if (message) out.textContent = message; }), {size: '1'}), main);
  const quiet = {setFieldValue() {}, ...editHost(() => {})};
  render(state.set.renderEditField(fieldOf({key: `${D.field.key}_empty`, required: true}), null, quiet, {size: '1/2'}), states.empty);
  render(state.set.renderEditField(fieldOf({key: `${D.field.key}_error`}), clone(D.samples[0][1]), quiet, {size: '1/2'}), states.error);
  render(state.set.renderEditField(fieldOf({key: `${D.field.key}_readonly`, readonly: true}), clone(D.samples[0][1]), quiet, {size: '1/2'}), states.readonly);
  requestAnimationFrame(() => setTimeout(() => markError(states.error), 0));
  write();
};

const drawFilter = (root) => {
  const field = filterField();
  const redraw = () => drawFilter(root);
  render(state.set.renderFilterField(field, filterHost(redraw)), el(root, 'filter'));
  const value = state.filter[field.key];
  const set = value && ((value.value !== undefined && value.value !== '' && value.value !== null) || (Array.isArray(value.values) && value.values.length));
  el(root, 'filter-out').textContent = set ? `В запрос уйдёт: ${shown({[D.field.key]: value})}` : 'Задайте условие — здесь будет то, что уйдёт в запрос.';
};

// The template switch and the marks on the sections a template changes.
const drawTemplates = (root) => {
  const list = templates();
  const box = root.querySelector('[data-template-switch]');
  if (list.length < 2) { box.hidden = true; return; }
  box.hidden = false;
  const segmented = box.querySelector('sf-segmented');
  segmented.setAttribute('items', JSON.stringify(list.map((template) => ({value: template.id, label: template.name}))));
  segmented.setAttribute('value', state.template.id);
  segmented.addEventListener('change', (event) => {
    const id = event.detail?.value ?? event.detail?.values?.[0] ?? segmented.value;
    const next = list.find((template) => template.id === id);
    if (!next || next === state.template) return;
    state.template = next;
    drawAll(root);
  });
};
const markPlaces = (root) => {
  const changes = state.template === D.templates[0] ? [] : state.template.changes;
  for (const section of root.querySelectorAll('[data-place]')) {
    const changed = changes.includes(section.dataset.place);
    section.toggleAttribute('data-changed', changed);
    section.querySelector('.property-changed').hidden = !changed;
  }
  const note = root.querySelector('[data-template-note]');
  if (note) {
    note.textContent = changes.length
      ? `Шаблон «${state.template.name}» меняет: ${changes.map((place) => PLACES[place]).join(', ')}. Значение записи и строки сервера те же.`
      : 'Шаблон по умолчанию. Другой шаблон меняет только рисунок — не данные.';
  }
};

const drawAll = (root) => {
  markPlaces(root);
  drawView(root);
  drawCompact(root);
  drawEdit(root);
  drawFilter(root);
  root.dataset.template = state.template.id;
};

// The example shows when it has drawn: every SIMAI Framework part in it
// defined, the text face loaded and its height still for three frames (a
// card answers its port, a renderer comes later); three seconds at most.
const frame = () => new Promise((done) => requestAnimationFrame(() => done()));
const settled = async (root) => {
  const limit = Date.now() + 3000;
  const names = () => [...new Set([...root.querySelectorAll('*')].map((node) => node.localName).filter((name) => name.startsWith('sf-')))];
  await Promise.race([Promise.all(names().map((name) => customElements.whenDefined(name))), new Promise((done) => setTimeout(done, 3000))]);
  await Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((done) => setTimeout(done, 1000))]);
  let last = -1;
  let still = 0;
  while (still < 3 && Date.now() < limit) {
    await frame();
    const height = root.getBoundingClientRect().height;
    const waiting = names().some((name) => !customElements.get(name));
    still = height === last && !waiting ? still + 1 : 0;
    last = height;
  }
};

const start = async () => {
  const root = document.querySelector('[data-property]');
  if (!root || root.dataset.exampleReady === 'true') return;
  root.dataset.exampleReady = 'true';
  // The Loader's names exist once it has started: wait for its own event
  // (sf-loader-init), never a timer (VR2-6: a 5 s poll then called it anyway
  // and failed in 3 loads of 60 on a busy machine). Until it comes the
  // example says it is loading; it draws whenever the Loader arrives.
  if (!window.SF?.whenFieldRenderers) {
    let waiting = null;
    const note = setTimeout(() => {
      waiting = document.createElement('p');
      waiting.setAttribute('role', 'status');
      waiting.style.visibility = 'visible';
      waiting.textContent = 'Пример ещё загружается…';
      root.prepend(waiting);
    }, 8000);
    await new Promise((done) => window.addEventListener('sf-loader-init', done, {once: true}));
    clearTimeout(note);
    waiting?.remove();
  }
  state.set = await window.SF.whenFieldRenderers();
  await window.SF.smartBaseReady;
  state.template = D.templates[0];
  drawTemplates(root);
  drawAll(root);
  await settled(root);
  root.dataset.ready = 'true';
};

start();
