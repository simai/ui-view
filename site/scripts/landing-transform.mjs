#!/usr/bin/env node
// The home page's live example as a clean demo, for what Docara 3.11.1 has
// no block setting for (docs/DOCARA-REQUESTS.md, 14). In <locale>/index.html,
// the page with a hero, of a copy of the built site, the example's code tabs
// and toolbar are hidden and the live frame stays. The same example with its
// code is on the guide page guide/showcase/.
//
// It runs on the local review copy only (scripts/publish-local.sh), not as a
// Docara page transform: verify-static compares each page's Framework asset
// plan, which hashes the page body before the transforms run, with the final
// HTML, so a transform that changes the body fails the check (request 15).
// The verified build keeps Docara's own markup.
//
// No class is added or removed. Every edit asserts that its anchor was found,
// so a change in Docara's markup stops the copy instead of passing unchanged.
//
// Usage: node scripts/landing-transform.mjs <site folder>
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const site = process.argv.at(-1);
if (!site || !existsSync(site)) throw new Error('landing-transform: the built site folder is the last argument');

const need = (index, what, file) => {
  if (index < 0) throw new Error(`landing-transform: ${file}: ${what} not found`);
  return index;
};

const transform = (html, file) => {
  // The live example without its code tabs.
  const example = need(html.indexOf('<section data-docara-example='), 'the live example', file);
  // Hidden, not removed: the shell's example script still finds its tabs.
  // The source panels are hidden already and stay.
  const header = need(html.indexOf('<div class="docara-example-preview__header">', example), 'the example header', file);
  html = `${html.slice(0, header)}<div class="docara-example-preview__header" style="display:none">${html.slice(header + '<div class="docara-example-preview__header">'.length)}`;
  return html.replace('<section data-docara-example=', '<section data-view-clean-example data-docara-example=');
};

let changed = 0;
for (const entry of readdirSync(site, {withFileTypes: true})) {
  if (!entry.isDirectory() || entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
  const file = join(site, entry.name, 'index.html');
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  if (!html.includes('<section data-docara-block="hero"') || !html.includes('<section data-docara-example=')) continue;
  writeFileSync(file, transform(html, file));
  changed += 1;
}
if (changed === 0) throw new Error('landing-transform: no home page with a hero and an example found');
console.log(`landing-transform: ${changed} home page(s)`);
