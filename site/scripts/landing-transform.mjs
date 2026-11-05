#!/usr/bin/env node
// The home page as the set site scheme wants it, for what Docara 3.11.1 has
// no block setting for (docs/DOCARA-REQUESTS.md, 9 and 14). It changes
// <locale>/index.html, the page with a hero, of a copy of the built site:
//
// 1. Moves the connection line into the hero, under its buttons: the first
//    code block after the hero, with the paragraph right before it.
// 2. Shows the home page's live example as a clean demo: the example's code
//    tabs and toolbar are hidden, the live frame stays. The same example with
//    its code is on the guide page guide/showcase/.
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

// The end of the element that starts at `start`, counting nested tags of the
// same name. Attribute values in Docara's output escape "<", so a raw tag
// inside a srcdoc or a code panel never counts.
const elementEnd = (html, start, tag) => {
  const pattern = new RegExp(`<${tag}[\\s>]|</${tag}>`, 'gu');
  pattern.lastIndex = start;
  let depth = 0;
  for (let match = pattern.exec(html); match; match = pattern.exec(html)) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return match.index + match[0].length;
  }
  throw new Error(`landing-transform: <${tag}> at ${start} is not closed`);
};
const need = (index, what, file) => {
  if (index < 0) throw new Error(`landing-transform: ${file}: ${what} not found`);
  return index;
};

const transform = (html, file) => {
  // 1. The connection line into the hero.
  const hero = need(html.indexOf('<section data-docara-block="hero"'), 'the hero', file);
  const heroEnd = elementEnd(html, hero, 'section');
  const code = need(html.indexOf('<div data-docara-code-block', heroEnd), 'the code block after the hero', file);
  const codeEnd = elementEnd(html, code, 'div');
  const lead = html.lastIndexOf('<p>', code);
  const takeFrom = lead > heroEnd && /^<p>[\s\S]*?<\/p>\s*$/u.test(html.slice(lead, code)) ? lead : code;
  const line = html.slice(takeFrom, codeEnd);
  html = html.slice(0, takeFrom) + html.slice(codeEnd).replace(/^\s*\n/u, '\n');
  const actions = need(html.indexOf('<div data-docara-hero-actions', hero), 'the hero buttons', file);
  const actionsEnd = elementEnd(html, actions, 'div');
  html = `${html.slice(0, actionsEnd)}<div data-view-hero-connection style="inline-size:100%;text-align:start">${line}</div>${html.slice(actionsEnd)}`;

  // 2. The live example without its code tabs.
  const example = need(html.indexOf('<section data-docara-example='), 'the live example', file);
  // Hidden, not removed: verify-static compares each page's Framework asset
  // plan, written before the transforms run, with the final HTML, and the
  // header's buttons are in that plan (Docara request 15). The source panels
  // are hidden already and stay.
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
