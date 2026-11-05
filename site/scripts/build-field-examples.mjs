#!/usr/bin/env node
// Writes the live examples of the «Поля» section, examples/fields/<family>/,
// from one engine and catalogue, scripts/field-demo.js: every family page and
// the overview ("all") show the same markup around their own fields. --check
// fails when a written example differs from what this would write.
//
// Usage: node site/scripts/build-field-examples.mjs [--check]
import {mkdirSync, readFileSync, existsSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const engine = readFileSync(join(site, 'scripts/field-demo.js'), 'utf8');
const FAMILIES = ['all', 'text', 'numbers', 'dates', 'flags', 'choice', 'links', 'files', 'color'];

const html = (family) => `<div data-fields class="flex flex-col gap-3">
  <section class="flex flex-col gap-1" aria-label="В таблице">
    <p class="m-0 weight-6">В таблице</p>
    <sf-view aria-label="Записи" preferences-key="view.fields-${family}">
      <sf-view-table slot="content" aria-label="Записи" layout="auto" selectable="false"></sf-view-table>
      <sf-pagination slot="pagination" page-size="10" page-sizes="10,25" top="false"></sf-pagination>
    </sf-view>
  </section>
  <div class="flex flex-wrap gap-1 items-cross-center" role="group" aria-label="Запись в карточках" data-record-switch>
      <button type="button" class="sf-button sf-button--outline sf-button--on-surface sf-button--size-1/2 active" data-record="r-1" aria-pressed="true"><span class="sf-button-text-container">Первая запись</span></button>
      <button type="button" class="sf-button sf-button--outline sf-button--on-surface sf-button--size-1/2" data-record="r-2" aria-pressed="false"><span class="sf-button-text-container">Вторая запись</span></button>
      <button type="button" class="sf-button sf-button--outline sf-button--on-surface sf-button--size-1/2" data-record="r-3" aria-pressed="false"><span class="sf-button-text-container">Пустые значения</span></button>
  </div>
  <div class="grid gap-3 fields-cards">
    <section class="flex flex-col gap-1 min-w-0" aria-label="Карточка: просмотр">
      <p class="m-0 weight-6">Карточка: просмотр</p>
      <sf-view-properties aria-label="Карточка: просмотр" mode="view"></sf-view-properties>
    </section>
    <section class="flex flex-col gap-1 min-w-0" aria-label="Карточка: правка">
      <p class="m-0 weight-6">Карточка: правка</p>
      <sf-view-properties aria-label="Карточка: правка" mode="edit"></sf-view-properties>
    </section>
  </div>
  <p class="m-0 color-on-surface-variant" role="status" data-log>Измените поля в правке и нажмите «Сохранить» — здесь появится то, что получил хост.</p>
</div>
`;
const css = `.fields-cards { grid-template-columns: minmax(0, 1fr); }
@media (min-width: 960px) {
  .fields-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
}
`;

let stale = 0;
for (const family of FAMILIES) {
  const folder = join(site, 'examples/fields', family);
  const files = {
    'index.html': html(family),
    'index.css': css,
    'index.js': `// Written by scripts/build-field-examples.mjs from scripts/field-demo.js; edit those.\nconst FAMILY = '${family}';\n\n${engine}`,
  };
  for (const [name, text] of Object.entries(files)) {
    const path = join(folder, name);
    if (existsSync(path) && readFileSync(path, 'utf8') === text) continue;
    stale += 1;
    if (!checkOnly) {
      mkdirSync(folder, {recursive: true});
      writeFileSync(path, text);
    }
  }
}
console.log(JSON.stringify({families: FAMILIES.length, changed: stale}));
if (checkOnly && stale) process.exit(1);
