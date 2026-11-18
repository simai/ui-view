#!/usr/bin/env node
// Writes the parts of the site that the set itself already says, so nothing
// is typed twice (set standard draft 1.1 §11.8-11.11):
//
//   - the top of each component page, content/ru/components/<group>/<folder>.md
//     and .page.json: front matter, the title in words, the badges (the
//     element's tag, its version from component.json, «Предварительная
//     версия» while package/set.json calls it preview) and the introduction,
//     from config/components.json. Everything from the page's first «##»
//     heading on is hand-written (and its reference part is
//     scripts/build-reference.mjs's) and kept;
//   - the overview's table in content/ru/components/index.md, words first,
//     the tag in its own column, between its markers;
//   - the home showcase, examples/home/showcase/index.html and index.css: a
//     tab per entry of showcase.tabs, each a card of the theme's surface-1 with
//     an outline, headed by the components it shows (links to their pages)
//     and holding config/showcase/<id>.html. index.js, the showcase's small
//     host, is hand-written;
//   - the release data in the content: every block between
//     `<!-- release:<name> -->` and `<!-- /release:<name> -->` is written from
//     the set's version (package/package.json), its releases
//     (contracts/releases/view-*.lock.json), core.runtime (package/set.json)
//     and the SIMAI Framework pair the site is built over
//     (scripts/materialize-framework-runtime.php: RELEASE_LOCK and
//     NPM_VERSION, moved by the repin commit). A version the release locks do
//     not hold yet is shown as this build's candidate.
//
// Usage: node site/scripts/build-pages.mjs [--check]
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repository = resolve(site, '..');
const smart = join(repository, 'package/src/smart');
const checkOnly = process.argv.includes('--check');
const config = JSON.parse(readFileSync(join(site, 'config/components.json'), 'utf8'));
const passport = JSON.parse(readFileSync(join(repository, 'package/set.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(repository, 'package/package.json'), 'utf8'));

const files = new Map();
const put = (path, text) => files.set(path, text.endsWith('\n') ? text : `${text}\n`);
const read = (path) => (files.has(path) ? files.get(path) : readFileSync(join(site, path), 'utf8'));
const attribute = (value) => String(value).replace(/&/gu, '&amp;').replace(/"/gu, '&quot;');

// ---- Component pages ------------------------------------------------------
const known = new Map();
const overview = [];
for (const [groupIndex, group] of config.groups.entries()) {
  put(`content/ru/components/${group.id}/section.json`, JSON.stringify({schema: 'docara.section.v1', title: group.title, navigation: {order: (groupIndex + 1) * 10}}, null, 2));
  overview.push(`## ${group.title}`, '', '| Компонент | Элемент | Что делает |', '|:---|:---|:---|');
  for (const [index, component] of group.components.entries()) {
    // A page about a part of a component (part_of: the list head of sf-view,
    // head="list") takes that component's tag, version and status, and names
    // the attribute that turns the part on.
    const {folder, title, description, what, intro, part_of: partOf, attribute: switchedOn} = component;
    const source = partOf ?? folder;
    const manifest = JSON.parse(readFileSync(join(smart, source, 'component.json'), 'utf8'));
    const entry = passport.components.find((one) => one.folder === source);
    if (!entry) throw new Error(`${source}: not in package/set.json`);
    if (/^`?sf-/u.test(intro[0])) throw new Error(`${folder}: the introduction starts with the tag (D12)`);
    known.set(folder, {group, component, tag: manifest.tag});
    const element = switchedOn ? `${manifest.tag} ${switchedOn}` : manifest.tag;
    const badges = [
      `:badge[${manifest.tag}]{variant=main scheme=on-surface size=1}`,
      ...(switchedOn ? [`:badge[${switchedOn}]{variant=tonal scheme=on-surface size=1}`] : []),
      `:badge[Версия ${manifest.version}]{variant=tonal scheme=neutral size=1}`,
      ...(entry.status === 'preview' ? [':badge[Предварительная версия]{variant=tonal scheme=warning size=1}'] : []),
    ].join(' ');
    const path = `content/ru/components/${group.id}/${folder}.md`;
    const old = existsSync(join(site, path)) ? readFileSync(join(site, path), 'utf8') : '';
    const rest = old.slice(old.search(/^## /mu));
    if (!old || old.search(/^## /mu) < 0) throw new Error(`${path}: no hand-written part (a «##» heading) to keep`);
    put(path, ['---', `description: ${description}`, 'profile: reference', '---', '', `# ${title}`, '', badges, '', intro.join('\n\n'), '', rest].join('\n'));
    put(`content/ru/components/${group.id}/${folder}.page.json`, JSON.stringify({schema: 'docara.page.v1', title, navigation: {order: (index + 1) * 10}}));
    overview.push(`| [${title}](${group.id}/${folder}/) | \`${element}\` | ${what}${entry.status === 'preview' ? '; предварительная версия' : ''} |`);
  }
  overview.push('');
}
const between = (path, open, close, body) => {
  const text = read(path);
  const from = text.indexOf(open);
  const to = text.indexOf(close);
  if (from < 0 || to < from) throw new Error(`${path}: needs the markers ${open} … ${close}`);
  put(path, `${text.slice(0, from + open.length)}\n${body.trim()}\n${text.slice(to)}`);
};
between('content/ru/components/index.md', '<!-- components:generated -->', '<!-- /components:generated -->', `\n${overview.join('\n').trim()}\n`);

// ---- Home showcase ---------------------------------------------------------
const panels = config.showcase.tabs.map((tab, position) => {
  const heads = tab.components.map((folder) => {
    const entry = known.get(folder);
    if (!entry) throw new Error(`showcase ${tab.id}: unknown component ${folder}`);
    return `<a href="/ru/components/${entry.group.id}/${folder}/" target="_top">${entry.component.title}</a>`;
  });
  const body = readFileSync(join(site, 'config/showcase', `${tab.id}.html`), 'utf8').trimEnd().split('\n').map((line) => `        ${line}`).join('\n');
  return [
    `    <section slot="panel-${position}" class="flex flex-col gap-2 p-top-2" data-demo="${tab.id}" aria-label="${attribute(tab.tab)}">`,
    `      <p class="m-0 color-on-surface-variant">${tab.lead}</p>`,
    '      <figure class="showcase-card m-0">',
    `        <figcaption class="showcase-head">${heads.join('<span aria-hidden="true">·</span>')}</figcaption>`,
    body,
    '      </figure>',
    '    </section>',
  ].join('\n');
});
put('examples/home/showcase/index.html', [
  '<div class="flex flex-col gap-3" data-showcase>',
  `  <sf-tabs type="pills" scheme="link" overflow="wrap" aria-label="${attribute(config.showcase.label)}" items="${config.showcase.tabs.map((tab) => tab.tab).join('|')}">`,
  panels.join('\n\n'),
  '  </sf-tabs>',
  '</div>',
].join('\n'));
put('examples/home/showcase/index.css', `/* Written by scripts/build-pages.mjs. Each view of the set on a card of the
   theme's surface-1 with an outline, the components it shows named on top. */
sf-tabs:not(:defined) > [slot] { display: none; }
.showcase-card {
  display: flex;
  flex-direction: column;
  gap: var(--sf-space-2);
  min-width: 0;
  padding: var(--sf-space-3);
  border: 1px solid var(--sf-outline-variant);
  border-radius: var(--sf-radius--surface);
  background: var(--sf-surface-1);
}
.showcase-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--sf-space-1); color: var(--sf-on-surface-variant); }
.showcase-head a { color: var(--sf-on-surface); font-weight: 600; text-decoration: none; }
.showcase-head a:hover { text-decoration: underline; }
.feed-box { display: flex; flex-direction: column; block-size: 36rem; overflow: hidden; }
.feed-box > sf-list-feed { flex: 1; min-block-size: 0; display: flex; flex-direction: column; }
/* A block in a message reads at a message's measure, not the whole frame. */
.sf-list-feed__entry .sf-view-flow { max-inline-size: 36rem; }
@media (max-width: 48rem) {
  .showcase-card { padding: var(--sf-space-2); }
}
`);

// ---- Release data ----------------------------------------------------------
const materializer = readFileSync(join(site, 'scripts/materialize-framework-runtime.php'), 'utf8');
const constant = (name) => {
  const match = materializer.match(new RegExp(`const ${name} = '([^']+)';`, 'u'));
  if (!match) throw new Error(`scripts/materialize-framework-runtime.php: no ${name}`);
  return match[1];
};
const pair = constant('RELEASE_LOCK').match(/(ui-[0-9a-f]{12})/u)[1];
const npm = constant('NPM_VERSION');
const runtime = String(passport.framework.core_runtime).replace(/^>=\s*/u, '');
const releasesFolder = join(repository, 'contracts/releases');
const byVersion = (a, b) => b.version.split('.').map(Number).reduce((order, part, i) => order || part - Number(a.version.split('.')[i]), 0);
const releases = readdirSync(releasesFolder).filter((name) => /^view-[0-9a-f]{12}\.lock\.json$/u.test(name))
  .map((name) => JSON.parse(readFileSync(join(releasesFolder, name), 'utf8')))
  .sort(byVersion);
const dateOf = (revision) => {
  try {
    return execFileSync('git', ['-C', repository, 'log', '-1', '--format=%cs', revision], {encoding: 'utf8'}).trim();
  } catch {
    return '';
  }
};
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const spoken = (date) => {
  const [y, m, d] = date.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y} года`;
};
const version = pkg.version;
const release = releases.find((one) => one.version === version);
if (release && release.requires.framework !== pair) {
  throw new Error(`view ${version} (${release.id}) is built over ${release.requires.framework}, the site over ${pair}: rebuild the site over the release's pair`);
}
const cdn = `https://cdn.jsdelivr.net/npm/@simai-studio/ui@${npm}/distr/core`;
const BLOCKS = {
  'cdn': ['```html', `<script src="${cdn}/js/core.min.js" data-sf-sets="view"></script>`, '```'].join('\n'),
  'cdn-pinned': ['```html', `<script src="${cdn}/js/core.min.js" data-sf-sets="view@${version}"></script>`, '```'].join('\n'),
  'npm': ['```bash', `npm install @simai-studio/view@${version} @simai-studio/ui@${npm}`, '```'].join('\n'),
  'boot': ['```html', '<script>', '  window.SF_BOOT_CONFIG = {', '    packages: {', `      view: {base: '/assets/ui-view/smart', version: '${version}'}`, '    }', '  };', '</script>', '<script src="/assets/ui/distr/core/js/core.min.js"></script>', '```'].join('\n'),
  'quick-start-page': ['```html', '<!doctype html>', '<html lang="ru">', '<head>', '  <meta charset="utf-8">', '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    '  <title>Клиенты</title>', `  <link rel="stylesheet" href="${cdn}/css/core.min.css">`, '</head>', '<body class="p-4">',
    `  <script src="${cdn}/js/core.min.js" data-sf-sets="view"></script>`, '</body>', '</html>', '```'].join('\n'),
  'compat': release
    ? `Версия ${version} (выпуск \`${release.id}\`) собрана над выпуском SIMAI Framework \`${release.requires.framework}\` (npm \`@simai-studio/ui@${npm}\`) и работает с \`core.runtime\` ${runtime} или новее.`
    : `Эта сборка сайта — кандидат версии ${version}: собрана над выпуском SIMAI Framework \`${pair}\` (npm \`@simai-studio/ui@${npm}\`) и работает с \`core.runtime\` ${runtime} или новее. В npm последняя выпущенная версия — ${releases[0].version} (\`${releases[0].id}\`).`,
  'versions': [
    '| Набор | Выпуск | Собран над SIMAI Framework | Нужен Core |',
    '|:---|:---|:---|:---|',
    ...(release ? [] : [`| ${version} | кандидат, эта сборка сайта | \`${pair}\` | \`core.runtime\` ${runtime} или новее |`]),
    ...releases.map((one) => `| ${one.version} | \`${one.id}\` | \`${one.requires.framework}\` | \`core.runtime\` ${String(one.requires.core_runtime).replace(/^>=\s*/u, '')} или новее |`),
  ].join('\n'),
  'footer': [
    '::::grid {columns=3 gap=4}',
    ':::card {variant=plain}',
    '### Версия',
    release
      ? `SIMAI View ${version} от ${spoken(dateOf(release.source.revision))}. [История изменений](/ru/guide/changes/)`
      : `SIMAI View ${version}, кандидат выпуска; последняя выпущенная — ${releases[0].version} от ${spoken(dateOf(releases[0].source.revision))}. [История изменений](/ru/guide/changes/)`,
    ':::',
    ':::card {variant=plain}',
    '### Совместимость',
    `Собран и проверен над выпуском SIMAI Framework \`${release ? release.requires.framework : pair}\`; работает с Core \`core.runtime\` ${runtime} или новее. [Подключение](/ru/guide/connection/)`,
    ':::',
    ':::card {variant=plain}',
    '### Лицензия',
    'Бесплатно для малого бизнеса и некоммерческого использования, остальным — коммерческая лицензия SIMAI. [Условия лицензии](/ru/guide/connection/#лицензия)',
    ':::',
    '::::',
    '',
    '[Руководство](/ru/guide/) · [Компоненты](/ru/components/) · [Рецепты](/ru/recipes/) · [Свойства](/ru/properties/) · [npm](https://www.npmjs.com/package/@simai-studio/view) · [SIMAI Framework](https://ui.simai.io/)',
  ].join('\n'),
};
const walk = (directory, prefix) => readdirSync(directory, {withFileTypes: true}).flatMap((entry) => (entry.isDirectory()
  ? walk(join(directory, entry.name), `${prefix}${entry.name}/`) : [`${prefix}${entry.name}`]));
let blocks = 0;
for (const path of walk(join(site, 'content/ru'), 'content/ru/').filter((one) => one.endsWith('.md'))) {
  let text = read(path);
  // A block keeps the indentation of its opening marker (one inside a list item).
  const pattern = /^([ \t]*)<!-- release:([a-z-]+) -->\n[\s\S]*?<!-- \/release:\2 -->/gmu;
  if (!text.includes('<!-- release:')) continue;
  text = text.replace(pattern, (whole, indent, name) => {
    if (!BLOCKS[name]) throw new Error(`${path}: unknown release block ${name}`);
    blocks += 1;
    const body = BLOCKS[name].split('\n').map((line) => (line ? `${indent}${line}` : line)).join('\n');
    return `${indent}<!-- release:${name} -->\n${body}\n${indent}<!-- /release:${name} -->`;
  });
  put(path, text);
}

const changed = [...files].filter(([path, text]) => !existsSync(join(site, path)) || readFileSync(join(site, path), 'utf8') !== text).map(([path]) => path);
if (!checkOnly) {
  for (const path of changed) {
    mkdirSync(dirname(join(site, path)), {recursive: true});
    writeFileSync(join(site, path), files.get(path));
  }
}
console.log(JSON.stringify({version, release: release?.id ?? 'candidate', pair, npm, components: known.size, blocks, changed: checkOnly ? changed : changed.length}));
if (checkOnly && changed.length) process.exit(1);
