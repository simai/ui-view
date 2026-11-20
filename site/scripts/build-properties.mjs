#!/usr/bin/env node
// Writes the «Свойства» section from one catalogue, one template for every
// type (owner decisions C290 (3), (4), C300 and C302; property page template,
// ui-control research 2026-11-17-property-page-template):
//
//   - examples/properties/<type>/index.html, index.css, index.js: the live
//     example of a type page -- the template switch and the four sections
//     Показ, Кратко, Правка, Фильтр. index.js is `const TYPE`, `const
//     TYPE_DATA` (the type's entry of scripts/property-catalogue.js) and
//     `const OPTIONS_OF`, then scripts/property-demo.js;
//   - examples/properties/all/: the overview's one record with a field of
//     every type in the set's table and card (scripts/property-overview.js);
//   - content/ru/properties/<type>.md and .page.json, whole: title, badges,
//     what it stores, the templates of the type, the example (results only,
//     no code tabs), «Значение и сервер» with the field description,
//     «Настройки», «Где хранится», «См. также» (the neighbours);
//   - the table of types in content/ru/properties/index.md, between its
//     markers.
//
// A type's folder and page are its id with «.» as «-» (ru.requisites →
// ru-requisites). --check fails when a written file differs from what this
// would write, or a file it once wrote is left over.
//
// Each example's index.css ends with the height it has drawn
// (config/example-heights.json), held from its first frame.
//
// Usage: node site/scripts/build-properties.mjs [--check]
import {existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readHeights, reserveCss} from './record-example-heights.mjs';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const config = JSON.parse(readFileSync(join(site, 'config/properties.json'), 'utf8'));
const catalogueText = readFileSync(join(site, 'scripts/property-catalogue.js'), 'utf8');
const engine = readFileSync(join(site, 'scripts/property-demo.js'), 'utf8');
const overview = readFileSync(join(site, 'scripts/property-overview.js'), 'utf8');
// eslint-disable-next-line no-new-func
const {CATALOGUE, FAMILIES, OPTIONS_OF} = new Function(`${catalogueText}\nreturn {CATALOGUE, FAMILIES, OPTIONS_OF};`)();
const slug = (type) => type.replace(/\./gu, '-');
// Each example's drawn height (config/example-heights.json, recorded by
// scripts/record-example-heights.mjs), held from its first frame (VR2-7).
const HEIGHTS = readHeights();
const withReserve = (folder, css) => {
  const block = reserveCss(HEIGHTS[folder.replace(/^examples\//u, '')]);
  return block ? `${css}${block}` : css;
};
const PLACES = {view: 'Показ', compact: 'Кратко', edit: 'Правка', filter: 'Фильтр'};

const files = new Map();
const put = (path, text) => files.set(path, text.endsWith('\n') ? text : `${text}\n`);

const listed = config.types.map((entry) => entry.type);
const missing = Object.keys(CATALOGUE).filter((type) => !listed.includes(type));
const unknown = listed.filter((type) => !CATALOGUE[type]);
if (missing.length || unknown.length) throw new Error(`config/properties.json and the catalogue differ: missing ${missing.join(', ') || '-'}, unknown ${unknown.join(', ') || '-'}`);
for (const [type, entry] of Object.entries(CATALOGUE)) {
  if (entry.samples?.length !== 3) throw new Error(`${type}: three samples (normal, long, empty)`);
  if (entry.server?.length !== 4) throw new Error(`${type}: four server rows`);
  if (!entry.templates?.length) throw new Error(`${type}: no template`);
  if (entry.field.propertyType !== type) throw new Error(`${type}: the field is of type ${entry.field.propertyType}`);
}

// ---- a type's example: the template switch and the four sections ----------
const place = (id, note, body) => `  <section class="property-place" data-place="${id}" aria-labelledby="place-${id}">
    <header class="property-place-head"><h2 class="property-head" id="place-${id}">${PLACES[id]}</h2><span class="property-changed" hidden>меняет шаблон</span></header>
    <p class="property-note">${note}</p>
${body}
  </section>`;
const typeHtml = (type) => {
  const {field} = CATALOGUE[type];
  return `<div data-property class="property">
  <div class="property-templates" data-template-switch hidden>
    <span class="property-label">Шаблон</span>
    <sf-segmented size="1/2" aria-label="Шаблон"></sf-segmented>
    <p class="property-note" data-template-note></p>
  </div>
${place('view', 'Карточка записи, список, панель.', '    <div class="property-rows" data-slot="view"></div>')}
${place('compact', 'Значение в малом месте любого представления: в строке таблицы, на карточке, в записи календаря. Длинное обрезает само представление.', `    <div class="property-compact">
      <div class="property-table-wrap"><table class="property-table"><thead><tr><th>Счёт</th><th>${field.label}</th><th>Клиент</th></tr></thead><tbody data-slot="compact-rows"></tbody></table></div>
      <div class="property-cards" data-slot="compact-cards"></div>
    </div>
    <p class="property-out" data-slot="compact-out"></p>`)}
${place('edit', 'Карточка в правке, форма.', `    <div class="property-edit">
      <span class="property-label" data-slot="edit-label">${field.label}</span>
      <div data-slot="edit"></div>
      <p class="property-out" role="status" data-slot="edit-out"></p>
    </div>
    <div class="property-states">
      <div><span class="property-label">Пусто, обязательное</span><div data-slot="state-empty"></div></div>
      <div><span class="property-label">Ошибка</span><div data-slot="state-error"></div></div>
      <div><span class="property-label">Только чтение</span><div data-slot="state-readonly"></div></div>
    </div>`)}
${place('filter', 'Панель фильтра над списком. Задайте условие.', `    <div class="property-edit">
      <span class="property-label">${field.label}</span>
      <div data-slot="filter"></div>
      <p class="property-out" role="status" data-slot="filter-out"></p>
    </div>`)}
</div>
`;
};
// Spacing, sizes and colours are SIMAI Framework tokens (C18); the states
// stand three in a row on a wide page, one under another on a phone.
const typeCss = `.property { display: flex; flex-direction: column; gap: var(--sf-space-1); }
/* The four sections show at once, when every part in them has drawn: a
   section that grew as its renderer came in moved the ones below it (frame
   CLS up to 1.2). Hidden, they keep their place, so the frame's height is
   known before they show. */
.property:not([data-ready]) { visibility: hidden; }
.property-templates { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sf-space-1\\/3) var(--sf-space-1\\/2); }
.property-templates .property-note { flex-basis: 100%; }
.property-place { display: flex; flex-direction: column; gap: var(--sf-space-1\\/3); min-inline-size: 0; padding-block-start: var(--sf-space-1\\/2); border-block-start: var(--sf-px) solid var(--sf-outline-variant); }
.property-place[data-changed] { border-block-start-color: var(--sf-primary); }
.property-place-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 var(--sf-space-1\\/2); }
.property-head { margin: 0; font-size: var(--sf-text-size-1); line-height: var(--sf-text-height-1); font-weight: var(--sf-font-weight-medium); }
.property-changed { font-size: var(--sf-text-size-1\\/2); line-height: var(--sf-text-height-1\\/2); color: var(--sf-primary); }
.property-note, .property-out, .property-label, .property-muted { margin: 0; font-size: var(--sf-text-size-1\\/2); line-height: var(--sf-text-height-1\\/2); color: var(--sf-on-surface-variant); }
.property-out { min-block-size: var(--sf-text-height-1\\/2); overflow-wrap: anywhere; }
.property-error { font-size: var(--sf-text-size-1\\/2); line-height: var(--sf-text-height-1\\/2); color: var(--sf-error); }
.property-rows { display: grid; grid-template-columns: minmax(6rem, 10rem) minmax(0, 1fr); gap: var(--sf-space-1\\/3) var(--sf-space-1); align-items: baseline; }
.property-rows > * { min-inline-size: 0; }
.property-span { grid-column: 1 / -1; }
.property-compact { display: flex; flex-direction: column; gap: var(--sf-space-1\\/2); }
.property-table-wrap { overflow-x: auto; min-inline-size: 0; }
.property-table { inline-size: 100%; border-collapse: collapse; table-layout: fixed; font-size: var(--sf-text-size-1\\/2); line-height: var(--sf-text-height-1\\/2); }
.property-table th, .property-table td { text-align: start; padding: var(--sf-space-1\\/4) var(--sf-space-1\\/3); border-block-end: var(--sf-px) solid var(--sf-outline-variant); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.property-table th { color: var(--sf-on-surface-variant); font-weight: var(--sf-font-weight-medium); }
.property-table th:nth-child(2) { inline-size: 45%; }
.property-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sf-space-1\\/3); }
.property-mini { display: flex; flex-direction: column; gap: var(--sf-space-1\\/4); min-inline-size: 0; padding: var(--sf-space-1\\/3) var(--sf-space-1\\/2); background: var(--sf-surface-1); border: var(--sf-px) solid var(--sf-outline-variant); border-radius: var(--sf-radius--ui); font-size: var(--sf-text-size-1\\/2); line-height: var(--sf-text-height-1\\/2); }
.property-mini b { font-weight: var(--sf-font-weight-medium); }
.property-pieces { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sf-space-1\\/4); }
.property-table .property-pieces { flex-wrap: nowrap; overflow: hidden; }
.property-cv { display: block; min-inline-size: 0; max-inline-size: 100%; overflow: hidden; }
.property-table .property-cv { white-space: nowrap; text-overflow: ellipsis; }
.property-mini .property-cv { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: anywhere; }
.property-mini .property-cv-button { white-space: normal; text-align: start; }
.property-cv-button { font: inherit; color: inherit; background: transparent; border: 0; margin: 0; padding: 0; cursor: pointer; text-align: start; max-inline-size: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-decoration: underline dotted; text-underline-offset: .2em; border-radius: var(--sf-radius--ui); }
.property-cv-button:hover { background: var(--sf-surface-2); }
.property-cv-button:focus-visible { outline: var(--sf-px) solid var(--sf-primary); outline-offset: var(--sf-px); }
.property-pop { display: flex; flex-direction: column; gap: var(--sf-space-1\\/3); padding: var(--sf-space-1\\/2); }
.property-edit { display: flex; flex-direction: column; gap: var(--sf-space-1\\/4); max-inline-size: 28rem; }
.property-states { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sf-space-1); }
.property-states > div { display: flex; flex-direction: column; gap: var(--sf-space-1\\/4); min-inline-size: 0; }
.property-swatch { inline-size: var(--sf-space-1); block-size: var(--sf-space-1); border-radius: var(--sf-radius--ui); flex: none; }
@media (max-width: 640px) {
  .property-rows { grid-template-columns: minmax(0, 1fr); gap: 0; }
  .property-rows > .property-label { margin-block-start: var(--sf-space-1\\/3); }
  .property-states { grid-template-columns: minmax(0, 1fr); gap: var(--sf-space-1\\/2); }
}
`;

// The overview: a table and the two cards over one record with a field of
// every type; a record switch above the cards.
const button = (record, label, active) => `      <button type="button" class="sf-button sf-button--outline sf-button--on-surface sf-button--size-1/2${active ? ' active' : ''}" data-record="${record}" aria-pressed="${active}"><span class="sf-button-text-container">${label}</span></button>`;
const overviewHtml = `<div data-properties class="flex flex-col gap-3">
  <section class="flex flex-col gap-1" aria-label="В таблице">
    <p class="m-0 weight-6">В таблице</p>
      <sf-view aria-label="Записи" preferences-key="view.properties-all">
        <sf-view-table slot="content" aria-label="Записи" layout="auto" selectable="false"></sf-view-table>
        <sf-pagination slot="pagination" page-size="10" page-sizes="10,20,50,100" top="false"></sf-pagination>
      </sf-view>
  </section>
  <div class="flex flex-wrap gap-1 items-cross-center" role="group" aria-label="Запись в карточках" data-record-switch>
${button('r-1', 'Первая запись', true)}
${button('r-2', 'Вторая запись', false)}
${button('r-3', 'Пустые значения', false)}
  </div>
  <div class="grid gap-3 property-cards">
    <section class="flex flex-col gap-1 min-w-0" aria-label="Показ">
      <p class="m-0 weight-6">Показ</p>
      <sf-view-properties aria-label="Показ" mode="view" data-follows></sf-view-properties>
    </section>
    <section class="flex flex-col gap-1 min-w-0" aria-label="Правка">
      <p class="m-0 weight-6">Правка</p>
      <sf-view-properties aria-label="Правка" mode="edit" data-follows></sf-view-properties>
    </section>
  </div>
  <p class="m-0 color-on-surface-variant" role="status" data-log>Измените поля в правке и нажмите «Сохранить» — здесь будет то, что получило приложение.</p>
</div>
`;
const overviewCss = `.property-cards { grid-template-columns: minmax(0, 1fr); }
@media (min-width: 960px) {
  .property-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
}
`;

// The D22 pictures an example's values name, copied beside it: an example
// is published with its own folder only (its frame's base is that folder).
const PICTURE = /"assets\/([a-z0-9-]+\.svg)"/gu;
const pictures = (folder, data) => {
  for (const [, file] of JSON.stringify(data).matchAll(PICTURE)) {
    const source = join(site, 'assets/illustrations', file);
    if (!existsSync(source)) throw new Error(`${folder}: no picture assets/illustrations/${file}`);
    put(`${folder}/assets/${file}`, readFileSync(source, 'utf8'));
  }
};
const HEADER = '// Written by scripts/build-properties.mjs from scripts/property-catalogue.js\n// and the engine below it; edit those.\n';

const typeExample = (type) => {
  const folder = `examples/properties/${slug(type)}`;
  const data = CATALOGUE[type];
  pictures(folder, data);
  const options = OPTIONS_OF[data.field.key] ? {[data.field.key]: OPTIONS_OF[data.field.key]} : {};
  put(`${folder}/index.html`, typeHtml(type));
  put(`${folder}/index.css`, withReserve(folder, typeCss));
  put(`${folder}/index.js`, `${HEADER}const TYPE = ${JSON.stringify(type)};\nconst TYPE_DATA = ${JSON.stringify({...data, extra: undefined}, null, 1)};\nconst OPTIONS_OF = ${JSON.stringify(options)};\n\n${engine}`);
};
const overviewExample = () => {
  const folder = 'examples/properties/all';
  // The field as this pair draws it: phone and password as string variants.
  const fields = Object.values(CATALOGUE).map((entry) => [{...entry.field, ...(entry.drawnAs ?? {})}, entry.samples.map(([, value]) => value)]);
  pictures(folder, fields);
  put(`${folder}/index.html`, overviewHtml);
  put(`${folder}/index.css`, withReserve(folder, overviewCss));
  put(`${folder}/index.js`, `${HEADER}const FIELDS = ${JSON.stringify(fields)};\nconst OPTIONS_OF = ${JSON.stringify(OPTIONS_OF)};\n\n${overview}`);
};

// ---- a type's page ---------------------------------------------------------
const cell = (text) => String(text).replace(/\|/gu, '\\|').replace(/\n/gu, ' ');
const placesOf = (changes) => changes.map((one) => PLACES[one]).join(', ');
const templatesPart = (type) => {
  const {templates} = CATALOGUE[type];
  const [first] = templates;
  if (templates.length === 1) return `Шаблон у типа один — «${first.name}» (\`${first.id}\`): он рисует все четыре места.`;
  const rows = templates.map((template, index) => `| ${template.name}${index ? '' : ' (по умолчанию)'} | \`${template.id}\` | ${index ? `${placesOf(template.changes)}: ${cell(template.what)}` : 'рисует все четыре места'} |`);
  const formerly = templates.filter((template) => template.variant).map((template) => `«${template.name}» — \`variant: "${template.variant}"\``);
  return [
    'Шаблоны этого типа. Шаблон выбирают в описании поля, он меняет только рисунок — данные и то, что уходит на сервер, те же; переключатель в примере показывает каждый.',
    '',
    '| Шаблон | `template` | Что меняет |',
    '|:---|:---|:---|',
    ...rows,
    '',
    `SIMAI Framework, над которым собран этот сайт, читает выбор шаблона из ключа \`variant\`: ${formerly.join(', ')}.`,
  ].join('\n');
};
// The field description, one key a line; a list of objects one item a line.
const fieldJson = (type) => {
  const {field} = CATALOGUE[type];
  const text = JSON.stringify(field);
  if (text.length <= 100) return text;
  const value = (item) => (Array.isArray(item) && item.some((one) => one && typeof one === 'object')
    ? `[\n${item.map((one) => `    ${JSON.stringify(one)}`).join(',\n')}\n  ]` : JSON.stringify(item));
  return `{\n${Object.entries(field).map(([key, item]) => `  ${JSON.stringify(key)}: ${value(item)}`).join(',\n')}\n}`;
};

const familyOf = (type) => FAMILIES.find((family) => family.id === CATALOGUE[type].family);
overviewExample();
config.types.forEach((entry, index) => {
  const {type, title, summary, intro} = entry;
  const data = CATALOGUE[type];
  const family = familyOf(type);
  if (!family) throw new Error(`${type}: no family ${data.family}`);
  typeExample(type);
  const own = data.set ?? 'framework';
  const badges = [`:badge[${type}]{variant=main scheme=on-surface size=1}`,
    ...(own === 'view' ? [':badge[Тип набора view]{variant=tonal scheme=info size=1}'] : [])].join(' ');
  const siblings = config.types.filter((other) => other.type !== type && CATALOGUE[other.type].family === family.id);
  const drawnAs = entry.framework && data.drawnAs
    ? `SIMAI Framework, над которым собран этот сайт, описывает это свойство как \`${data.drawnAs.propertyType}\` с \`variant: "${data.drawnAs.variant}"\`; так его и рисует пример.`
    : '';
  const page = [
    '---',
    `description: Свойство «${title}» в SIMAI View — ${summary}: показ, кратко, правка и фильтр, что уходит на сервер и где хранится.`,
    'profile: reference',
    '---',
    '',
    `# ${title}`,
    '',
    badges,
    '',
    intro,
    '',
    ...(drawnAs ? [drawnAs, ''] : []),
    templatesPart(type),
    '',
    `:::example {id="properties/${slug(type)}" label="${title}: показ, кратко, правка, фильтр" sources=false}`,
    ':::',
    '',
    '## Значение и сервер',
    '',
    '| | |',
    '|:---|:---|',
    ...data.server.map(([name, text]) => `| ${name} | ${cell(text)} |`),
    '',
    'Описание поля, которое передаёт приложение:',
    '',
    '```json',
    fieldJson(type),
    '```',
    '',
    '## Настройки',
    '',
    '| Настройка | По умолчанию | Где меняет | Что задаёт |',
    '|:---|:---|:---|:---|',
    ...data.settings.map((row) => `| ${row.map(cell).join(' | ')} |`),
    '',
    '## Где хранится',
    '',
    '| Система | Как хранит |',
    '|:---|:---|',
    `| Larena | ${cell(data.storage[0])} |`,
    `| Битрикс | ${cell(data.storage[1])} |`,
    '',
    ...(data.extra ?? []),
    '## См. также',
    '',
    ...siblings.map((other) => `- [${other.title}](../${slug(other.type)}/)`),
    '- [Все свойства](/ru/properties/)',
    '- [Данные и их формат](/ru/guide/concepts/data/)',
    '',
  ].join('\n');
  put(`content/ru/properties/${slug(type)}.md`, page);
  put(`content/ru/properties/${slug(type)}.page.json`, `{"schema": "docara.page.v1", "title": "${title}", "navigation": {"order": ${(index + 1) * 10}}}`);
});

// The overview's table of types, by family, between its markers.
const OPEN = '<!-- properties:generated -->';
const CLOSE = '<!-- /properties:generated -->';
const indexPath = 'content/ru/properties/index.md';
const index = readFileSync(join(site, indexPath), 'utf8');
const at = index.indexOf(OPEN);
const until = index.indexOf(CLOSE);
if (at < 0 || until < at) throw new Error(`${indexPath}: needs the markers of the generated table`);
const table = [];
for (const family of FAMILIES) {
  const types = config.types.filter((entry) => CATALOGUE[entry.type].family === family.id);
  if (!types.length) continue;
  table.push(`### ${family.title}`, '', '| Свойство | Тип | Что хранит |', '|:---|:---|:---|');
  for (const entry of types) table.push(`| [${entry.title}](${slug(entry.type)}/) | \`${entry.type}\` | ${entry.summary} |`);
  table.push('');
}
put(indexPath, `${index.slice(0, at + OPEN.length)}\n\n${table.join('\n').trim()}\n\n${index.slice(until)}`);

// What was generated before and is not now goes.
const generated = new Set(files.keys());
const walk = (directory, prefix) => (existsSync(directory) ? readdirSync(directory, {withFileTypes: true}) : []).flatMap((item) => (item.isDirectory()
  ? walk(join(directory, item.name), `${prefix}${item.name}/`) : [`${prefix}${item.name}`]));
const stale = [
  ...walk(join(site, 'examples/properties'), 'examples/properties/'),
  ...walk(join(site, 'content/ru/properties'), 'content/ru/properties/').filter((path) => !/\/(index\.page\.json|section\.json)$/u.test(path)),
].filter((path) => !generated.has(path));

const changed = [...files].filter(([path, text]) => !existsSync(join(site, path)) || readFileSync(join(site, path), 'utf8') !== text).map(([path]) => path);
if (!checkOnly) {
  for (const path of stale) rmSync(join(site, path));
  for (const path of changed) {
    mkdirSync(dirname(join(site, path)), {recursive: true});
    writeFileSync(join(site, path), files.get(path));
  }
}
console.log(JSON.stringify({types: config.types.length, files: files.size, changed: changed.length, removed: stale.length}));
if (checkOnly && (changed.length || stale.length)) process.exit(1);
