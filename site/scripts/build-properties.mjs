#!/usr/bin/env node
// Writes the «Свойства» section from one catalogue (C290 (3), (4)):
//
//   - examples/properties/<type>/index.html, index.css, index.js: the live
//     example of a type page, and examples/properties/all/ for the overview.
//     index.js is `const TYPE = '<type>';`, scripts/property-catalogue.js and
//     scripts/property-demo.js;
//   - content/ru/properties/<type>.md and .page.json: the page's top from
//     config/properties.json (title in words, the type's id and the set's
//     badge as badges, the introduction, the example). The part between the
//     example and «См. также» is hand-written and kept; «См. также» is
//     written;
//   - the table of types in content/ru/properties/index.md, between its
//     markers.
//
// A type's folder and page are its id with «.» as «-» (ru.requisites →
// ru-requisites). --check fails when a written file differs from what this
// would write, or a file it once wrote is left over.
//
// Usage: node site/scripts/build-properties.mjs [--check]
import {existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const config = JSON.parse(readFileSync(join(site, 'config/properties.json'), 'utf8'));
const catalogueText = readFileSync(join(site, 'scripts/property-catalogue.js'), 'utf8');
const engine = readFileSync(join(site, 'scripts/property-demo.js'), 'utf8');
// eslint-disable-next-line no-new-func
const {CATALOGUE, FAMILIES} = new Function(`${catalogueText}\nreturn {CATALOGUE, FAMILIES};`)();
const slug = (type) => type.replace(/\./gu, '-');
const END = '## См. также';

const files = new Map();
const put = (path, text) => files.set(path, text.endsWith('\n') ? text : `${text}\n`);

const listed = config.types.map((entry) => entry.type);
const missing = Object.keys(CATALOGUE).filter((type) => !listed.includes(type));
const unknown = listed.filter((type) => !CATALOGUE[type]);
if (missing.length || unknown.length) throw new Error(`config/properties.json and the catalogue differ: missing ${missing.join(', ') || '-'}, unknown ${unknown.join(', ') || '-'}`);

const button = (record, label, active) => `      <button type="button" class="sf-button sf-button--outline sf-button--on-surface sf-button--size-1/2${active ? ' active' : ''}" data-record="${record}" aria-pressed="${active}"><span class="sf-button-text-container">${label}</span></button>`;
const view = (key, extra = '') => `<sf-view aria-label="Записи" preferences-key="view.properties-${key}"${extra}>
        <sf-view-table slot="content" aria-label="Записи" layout="auto" selectable="false"></sf-view-table>
        <sf-pagination slot="pagination" page-size="10" page-sizes="10,25" top="false"></sf-pagination>
      </sf-view>`;
const head = (text) => `<p class="m-0 weight-6">${text}</p>`;

const html = (type) => {
  const all = type === 'all';
  const key = slug(type);
  const states = all ? '' : `
  <section class="flex flex-col gap-2" aria-label="Состояния">
    ${head('Состояния')}
    <div class="grid gap-3 property-states">
      <section class="flex flex-col gap-1 min-w-0" aria-label="Пусто">
        ${head('Пусто')}
        <sf-view-properties aria-label="Пусто" mode="view" data-record="r-3"></sf-view-properties>
      </section>
      <section class="flex flex-col gap-1 min-w-0" aria-label="Ошибка">
        ${head('Ошибка')}
        <sf-view-properties aria-label="Ошибка" mode="edit" data-state="error"></sf-view-properties>
      </section>
      <section class="flex flex-col gap-1 min-w-0" aria-label="Только чтение">
        ${head('Только чтение')}
        <sf-view-properties aria-label="Только чтение" mode="edit" data-state="readonly"></sf-view-properties>
      </section>
      <section class="flex flex-col gap-1 min-w-0" aria-label="Телефон">
        ${head('Телефон')}
        <div class="flex flex-col gap-2 property-phone">
      ${view(`${key}-phone`)}
          <sf-view-properties aria-label="Телефон" mode="view"></sf-view-properties>
        </div>
      </section>
    </div>
  </section>`;
  return `<div data-properties class="flex flex-col gap-3">
  <section class="flex flex-col gap-1" aria-label="${all ? 'В таблице' : 'Ячейка таблицы и фильтр'}">
    ${head(all ? 'В таблице' : 'Ячейка таблицы и фильтр')}
      ${view(key)}
  </section>
  <div class="flex flex-wrap gap-1 items-cross-center" role="group" aria-label="Запись в карточках" data-record-switch>
${button('r-1', 'Первая запись', true)}
${button('r-2', 'Вторая запись', false)}
${button('r-3', 'Пустые значения', false)}
  </div>
  <div class="grid gap-3 property-cards">
    <section class="flex flex-col gap-1 min-w-0" aria-label="Показ">
      ${head('Показ')}
      <sf-view-properties aria-label="Показ" mode="view" data-follows></sf-view-properties>
    </section>
    <section class="flex flex-col gap-1 min-w-0" aria-label="Правка">
      ${head('Правка')}
      <sf-view-properties aria-label="Правка" mode="edit" data-follows></sf-view-properties>
    </section>
  </div>
  <p class="m-0 color-on-surface-variant" role="status" data-log>Измените поля в правке и нажмите «Сохранить» — здесь будет то, что получило приложение.</p>${states}
</div>
`;
};
// The phone box is a phone's width (390 less the page's gutters).
const css = `.property-cards, .property-states { grid-template-columns: minmax(0, 1fr); }
.property-phone { inline-size: 100%; max-inline-size: 22.5rem; }
@media (min-width: 960px) {
  .property-cards, .property-states { grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
}
`;

// The D22 pictures an example's records name, copied beside it: an example
// is published with its own folder only (its frame's base is that folder).
const PICTURE = /"pictures\/([a-z0-9-]+\.svg)"/gu;
const fieldsOf = (type) => (type === 'all' ? Object.values(CATALOGUE).map((entry) => entry.fields[0]) : CATALOGUE[type].fields);
const pictures = (folder, type) => {
  for (const [, file] of JSON.stringify(fieldsOf(type)).matchAll(PICTURE)) {
    const source = join(site, 'assets/illustrations', file);
    if (!existsSync(source)) throw new Error(`${type}: no picture assets/illustrations/${file}`);
    put(`${folder}/pictures/${file}`, readFileSync(source, 'utf8'));
  }
};

const example = (type) => {
  const folder = `examples/properties/${slug(type)}`;
  pictures(folder, type);
  put(`${folder}/index.html`, html(type));
  put(`${folder}/index.css`, css);
  put(`${folder}/index.js`, `// Written by scripts/build-properties.mjs from scripts/property-catalogue.js\n// and scripts/property-demo.js; edit those.\nconst TYPE = '${type}';\n\n${catalogueText}\n${engine}`);
};

example('all');
const familyOf = (type) => FAMILIES.find((family) => family.id === CATALOGUE[type].family);
config.types.forEach((entry, index) => {
  const {type, title, summary, intro} = entry;
  const family = familyOf(type);
  if (!family) throw new Error(`${type}: no family ${CATALOGUE[type].family}`);
  example(type);
  const path = `content/ru/properties/${slug(type)}.md`;
  const own = CATALOGUE[type].set ?? (['money', 'percent', 'items', 'compound', 'ru.requisites'].includes(type) ? 'view' : 'framework');
  const badges = [`:badge[${type}]{variant=main scheme=on-surface size=1}`,
    ...(own === 'view' ? [':badge[Тип набора view]{variant=tonal scheme=info size=1}'] : [])].join(' ');
  const siblings = config.types.filter((other) => other.type !== type && CATALOGUE[other.type].family === family.id);
  const top = [
    '---',
    `description: Свойство «${title}» в SIMAI View — ${summary}: в ячейке таблицы, в фильтре, в карточке и в правке.`,
    'profile: reference',
    '---',
    '',
    `# ${title}`,
    '',
    badges,
    '',
    intro,
    '',
    '## Примеры',
    '',
    'Те же записи в ячейке таблицы, в фильтре над таблицей, в карточке для чтения и для правки; ниже — состояния: пусто, ошибка, только чтение и телефон.',
    '',
    `:::example {id="properties/${slug(type)}" label="${title}"}`,
    ':::',
    '',
    '',
  ].join('\n');
  const old = existsSync(join(site, path)) ? readFileSync(join(site, path), 'utf8') : '';
  const from = old.indexOf('\n:::\n', old.indexOf(':::example'));
  const to = old.indexOf(`\n${END}\n`);
  const notes = from > 0 && to > from ? old.slice(from + 5, to + 1).trim() : '';
  const tail = [
    END,
    '',
    ...siblings.map((other) => `- [${other.title}](../${slug(other.type)}/)`),
    '- [Все свойства](/ru/properties/)',
    '- [Данные и их формат](/ru/guide/concepts/data/)',
    '',
  ].join('\n');
  put(path, `${top}${notes ? `${notes}\n\n` : ''}${tail}`);
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
const walk = (directory, prefix) => (existsSync(directory) ? readdirSync(directory, {withFileTypes: true}) : []).flatMap((entry) => (entry.isDirectory()
  ? walk(join(directory, entry.name), `${prefix}${entry.name}/`) : [`${prefix}${entry.name}`]));
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
