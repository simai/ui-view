#!/usr/bin/env node
// Writes the reference part of every component page (attributes, events,
// methods, CSS variables, accessibility, source) from the set's own
// manifests, so the pages never drift from what the release ships.
//
// Sources: package/src/smart/<folder>/smart.manifest.json (inputs, methods,
// events, accessibility) and component.json (public CSS variables) at the
// commit the released receipt names (package/dist/package-receipt.json
// package_source.revision), read from git objects, not the working tree.
//
// Manifest text is English and the site is Russian: every manifest string a
// page shows is looked up in config/reference.ru.json. --check fails when a
// page differs from what it would write or a string has no translation;
// --missing prints the strings to translate.
//
// A page holds the generated part between its "## Параметры" heading and its
// "## См. также" heading; everything above is written by hand.
//
// Usage: node site/scripts/build-reference.mjs [--check | --missing]

import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repository = resolve(site, '..');
const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');
const listMissing = args.has('--missing');

const PAGES = {
  view: 'content/ru/components/views/view.md',
  'view-table': 'content/ru/components/views/view-table.md',
  'view-properties': 'content/ru/components/views/view-properties.md',
  'view-property-block': 'content/ru/components/views/view-property-block.md',
};
const START = '## Параметры';
const END = '## См. также';

const receipt = JSON.parse(readFileSync(join(repository, 'package/dist/package-receipt.json'), 'utf8'));
const revision = receipt.package_source.revision;
const show = (path) => execFileSync('git', ['-C', repository, 'show', `${revision}:${path}`], {encoding: 'utf8', maxBuffer: 64 << 20});
const dictionary = JSON.parse(readFileSync(join(site, 'config/reference.ru.json'), 'utf8')).strings;

const missing = new Set();
const ru = (text) => {
  if (!text) return '';
  if (dictionary[text] === undefined) {
    missing.add(text);
    return text;
  }
  return dictionary[text];
};
const code = (text) => `\`${String(text).replace(/\|/gu, '\\|')}\``;
const cell = (text) => String(text).replace(/\|/gu, '\\|').replace(/\s*\n\s*/gu, ' ');
const line = (text) => String(text).replace(/\\\|/gu, '|').replace(/\s*\n\s*/gu, ' ');
const literal = (value) => (value === '' ? 'пусто' : typeof value === 'string' ? code(value) : code(JSON.stringify(value)));
// Text the manifest generator writes when a source says nothing tells a reader
// no more than the name does.
const generic = (text) => !text || /^Public runtime method [\w$]+\.$/u.test(text) || /^Runtime event [\w:-]+\.$/u.test(text)
  || /^The action [\w-]+\.$/u.test(text);
const typeName = (schema) => {
  const types = [schema?.type].flat().filter(Boolean);
  return types.length ? types.map(code).join(' \\| ') : '—';
};
const resolveRef = (manifest, schema) => (schema?.$ref?.startsWith('#/')
  ? schema.$ref.slice(2).split('/').reduce((node, key) => node?.[key], manifest) ?? schema
  : schema);
const shape = (manifest, payload) => {
  const schema = resolveRef(manifest, payload);
  if (!schema?.properties || Object.keys(schema.properties).length === 0) return null;
  const required = new Set(schema.required ?? []);
  const keys = Object.entries(schema.properties).map(([key, value]) => {
    const inner = resolveRef(manifest, value);
    const type = [inner?.type].flat().filter(Boolean).join('|');
    return `${key}${required.has(key) ? '' : '?'}${type ? `: ${type}` : ''}`;
  });
  return code(`{ ${keys.join(', ')} }`);
};
const LIFECYCLE = {experimental: 'экспериментальный: API может меняться между выпусками', stable: 'стабильный'};
const NAME_RULE = {required: 'обязательно', optional: 'необязательно'};

const render = (folder) => {
  const manifest = JSON.parse(show(`package/src/smart/${folder}/smart.manifest.json`));
  const component = JSON.parse(show(`package/src/smart/${folder}/component.json`));
  const tag = manifest.custom_element;
  const lines = [START, ''];
  lines.push(
    `Справочник собран из манифеста компонента в выпуске набора \`view-${revision.slice(0, 12)}\` и обновляется вместе с выпуском. Каждому атрибуту соответствует свойство элемента с тем же именем в camelCase: \`search-placeholder\` — \`searchPlaceholder\`.`,
    '',
    '| | |',
    '|:---|:---|',
    `| Тег | ${code(`<${tag}>`)} |`,
    `| Назначение | ${cell(ru(manifest.summary))} |`,
    `| Контракт | ${code(manifest.id)}, версия ${code(manifest.version)} |`,
    `| Жизненный цикл | ${LIFECYCLE[manifest.lifecycle] ?? code(manifest.lifecycle)} |`,
    '',
    '### Атрибуты',
    '',
  );
  for (const [name, schema] of Object.entries(manifest.inputs?.properties ?? {})) {
    const facts = [typeName(schema)];
    if (schema.default !== undefined && schema.default !== null) facts.push(`по умолчанию ${literal(schema.default)}`);
    if (schema.enum) facts.push(`значения: ${schema.enum.map(literal).join(', ')}`);
    const purpose = ru(schema.description);
    lines.push(line(`- ${code(name)} — ${facts.join(', ')}.${purpose ? ` ${purpose}` : ''}`));
  }
  lines.push('');

  const events = Object.entries(manifest.events ?? {});
  const current = events.filter(([, event]) => !event.alias_of);
  const former = events.filter(([, event]) => event.alias_of);
  lines.push('## События', '', 'События приходят на сам элемент и всплывают.', '');
  for (const [name, event] of current) {
    const detail = shape(manifest, event.payload)
      ?? former.map(([, alias]) => (alias.alias_of === name ? shape(manifest, alias.payload) : null)).find(Boolean);
    const parts = [detail ? `\`detail\`: ${detail}.` : '`detail` не описан.'];
    if (!generic(event.summary)) parts.push(ru(event.summary));
    lines.push(line(`- ${code(name)} — ${parts.join(' ')}`));
  }
  lines.push('');
  if (former.length) {
    lines.push('Прежние имена событий приходят следом с тем же `detail` и отмечаются в `SF.deprecations`:', '');
    lines.push(line(former.map(([name, event]) => `${code(name)} → ${code(event.alias_of)}`).join(', ') + '.'), '');
  }

  lines.push('## Методы', '');
  for (const [name, method] of Object.entries(manifest.methods ?? {})) {
    const argumentList = (method.arguments ?? []).map((argument) => (typeof argument === 'string' ? argument
      : `${argument.name}${argument.required === false ? '?' : ''}: ${[argument.type ?? argument.schema?.type].flat().filter(Boolean).join('|') || 'any'}`));
    const unknown = JSON.stringify(method.returns?.type) === '["object","boolean","null"]';
    const parts = [];
    if (method.returns && !unknown) parts.push(`возвращает ${typeName(method.returns)}.`);
    if (!generic(method.summary)) parts.push(ru(method.summary));
    lines.push(line(`- ${code(`${name}(${argumentList.join(', ')})`)}${parts.length ? ` — ${parts.join(' ')}` : ''}`));
  }
  lines.push('');

  const variables = Object.entries(component['css-variables'] ?? {});
  lines.push('## CSS-переменные', '');
  if (variables.length === 0) {
    lines.push('Публичных CSS-переменных нет.', '');
  } else {
    lines.push('Задаются на элементе или на любом предке. Имена сохранили прежнее имя компонента.', '', '| Переменная | Тип | Что задаёт |', '|:---|:---|:---|');
    for (const [name, variable] of variables) {
      lines.push(`| ${code(name)} | ${code(variable.type)} | ${cell(ru(`css:${name}`))} |`);
    }
    lines.push('');
  }

  const access = manifest.accessibility ?? {};
  lines.push('## Доступность', '');
  if (access.role) lines.push(`- Роль: ${code(access.role)}.`);
  if (access.accessible_name) lines.push(`- Доступное имя: ${NAME_RULE[access.accessible_name] ?? ru(access.accessible_name)}.`);
  if (Array.isArray(access.keyboard) && access.keyboard.length) {
    const key = (entry) => (/^[A-Z][A-Za-z]*(\+[A-Za-z]+)*$/u.test(entry) ? code(entry) : ru(entry));
    lines.push(`- Клавиши: ${access.keyboard.map(key).join(', ')}.`);
  }
  if (access.focus) lines.push(`- Фокус: ${ru(access.focus)}`);
  lines.push('', '## Источник', '', `- \`simai/ui-view@${revision.slice(0, 12)}:package/src/smart/${folder}\``, '');
  return lines.join('\n');
};

let stale = 0;
// A component that has not been released yet has no manifest at the receipt's
// commit: its page keeps the hand-written part until the release that carries it.
const released = (folder) => {
  try {
    execFileSync('git', ['-C', repository, 'cat-file', '-e', `${revision}:package/src/smart/${folder}/smart.manifest.json`], {stdio: 'ignore'});
    return true;
  } catch {
    return false;
  }
};
const unreleased = Object.keys(PAGES).filter((folder) => !released(folder));

for (const [folder, page] of Object.entries(PAGES)) {
  if (unreleased.includes(folder)) continue;
  const path = join(site, page);
  const text = readFileSync(path, 'utf8');
  const start = text.indexOf(`\n${START}\n`);
  const end = text.indexOf(`\n${END}\n`);
  if (start < 0 || end < start) throw new Error(`${page}: needs "${START}" before "${END}"`);
  const next = `${text.slice(0, start + 1)}${render(folder)}\n${text.slice(end + 1)}`;
  if (next !== text) {
    stale += 1;
    if (!checkOnly && !listMissing) writeFileSync(path, next);
  }
}
if (listMissing) {
  console.log(JSON.stringify([...missing], null, 2));
} else {
  console.log(JSON.stringify({pages: Object.keys(PAGES).length - unreleased.length, unreleased, changed: stale, untranslated: missing.size}));
  if (checkOnly && (stale || missing.size)) process.exit(1);
}
