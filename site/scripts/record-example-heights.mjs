#!/usr/bin/env node
// Records the height every live example has drawn, so the example can hold it
// from its first frame (view returns VR2-7).
//
// Docara lays a live example in a frame and sizes the frame by the frame's
// own height, once the page's styles have reached it. The SIMAI Framework
// parts inside draw later -- a table after its first answer, a property's
// four sections after their renderers -- so the frame first takes the height
// of the example's still empty markup (38-46 px of a table, 672 px of a
// property page) and then grows to the drawn height, moving the page below
// it: page CLS up to 0.70 on a scrolled component page, 0.42 on a property
// page. An example that holds its drawn height from its first frame gives
// Docara the final height at once; Docara's own share (the frame's 192 px
// reserve before the styles arrive) is Docara's.
//
// This script opens every page of a built site (served on --base) at 1440
// and 390 px, scrolls it through so every example frame loads, waits until
// the examples have drawn, and reads each example's height (the frame's body)
// with the frame's width. It writes config/example-heights.json:
// {"<examples folder>": {"wide": px, "narrow": px}}, wide being frames from
// 641 px, narrow below (the largest of every page the example is on). Then:
//
//   - scripts/build-properties.mjs writes each property example's reserve
//     into its index.css;
//   - --apply writes the reserve of every other example into its own
//     index.css, between the markers below (the file is made if missing).
//
// Usage: node site/scripts/record-example-heights.mjs --base http://127.0.0.1:PORT [--apply] [--pages /ru/a/,/ru/b/]
//        node site/scripts/record-example-heights.mjs --apply   (writes the CSS from the JSON only)
// Needs playwright-core (or playwright) resolvable from the working folder or NODE_PATH, and Chrome.

import {existsSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const option = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : null);
const base = option('--base');
const apply = argv.includes('--apply');
const store = join(site, 'config/example-heights.json');
const START = '/* reserve: written by scripts/record-example-heights.mjs */';
const END = '/* reserve: end */';
const NARROW = 640;

// The CSS block that holds an example's drawn height (also used by
// build-properties.mjs for the property examples).
export function reserveCss(entry) {
  if (!entry || !(entry.wide > 0 || entry.narrow > 0)) return '';
  const lines = [START,
    '/* The height this example has drawn, held from its first frame: Docara sizes the frame by its body before the',
    '   SIMAI Framework parts inside have drawn, and the page below moved when they did. */'];
  // Until the set's own parts are defined they have no height and the parts
  // below them would move when they draw: the example shows when they are.
  lines.push('body:has(:is(sf-view, sf-view-table, sf-table, sf-view-properties, sf-view-board, sf-view-flow):not(:defined)) { visibility: hidden; }');
  if (entry.wide > 0) lines.push(`body { min-block-size: ${Math.ceil(entry.wide)}px; }`);
  if (entry.narrow > 0) lines.push(`@media (max-width: ${NARROW}px) { body { min-block-size: ${Math.ceil(entry.narrow)}px; } }`);
  lines.push(END);
  return lines.join('\n') + '\n';
}

export function readHeights() {
  return existsSync(store) ? JSON.parse(readFileSync(store, 'utf8')) : {};
}

function withReserve(css, entry) {
  const at = css.indexOf(START);
  const kept = at < 0 ? css : css.slice(0, at) + css.slice(css.indexOf(END, at) + END.length).replace(/^\n/u, '');
  const block = reserveCss(entry);
  return block ? `${kept.replace(/\n*$/u, kept ? '\n' : '')}${kept ? '\n' : ''}${block}` : kept;
}

async function record() {
  const require = createRequire(join(process.cwd(), 'noop.js'));
  let chromium;
  try { ({chromium} = require('playwright-core')); } catch { ({chromium} = require('playwright')); }
  const built = join(site, 'build_production');
  const pages = option('--pages')?.split(',') ?? (() => {
    const found = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (name === 'index.html' && readFileSync(path, 'utf8').includes('<iframe')) found.push('/' + path.slice(built.length + 1, -'index.html'.length));
      }
    };
    walk(join(built, 'ru'));
    return found.sort();
  })();
  const browser = await chromium.launch({headless: true, channel: 'chrome', ignoreDefaultArgs: ['--hide-scrollbars']});
  const heights = {};
  for (const path of pages) for (const width of [1440, 390]) {
    const context = await browser.newContext({viewport: {width, height: 900}});
    const page = await context.newPage();
    await page.goto(base + path, {waitUntil: 'load'}).catch(() => {});
    for (let step = 0; step < 16; step += 1) { await page.mouse.wheel(0, 900); await page.waitForTimeout(250); }
    await page.waitForTimeout(4000);
    for (const frame of page.frames()) {
      if (frame === page.mainFrame()) continue;
      const read = await frame.evaluate(() => {
        const at = String(document.baseURI).match(/\/_docara\/examples\/(.+?)\/?(?:index\.html)?(?:[?#].*)?$/u);
        if (!at) return null;
        const body = document.body;
        const before = body.style.minBlockSize;
        body.style.minBlockSize = '0px';
        const height = Math.ceil(body.getBoundingClientRect().height);
        body.style.minBlockSize = before;
        return {folder: at[1], height, width: document.documentElement.clientWidth};
      }).catch(() => null);
      if (!read || !(read.height > 0)) continue;
      const kind = read.width > NARROW ? 'wide' : 'narrow';
      heights[read.folder] ??= {};
      heights[read.folder][kind] = Math.max(heights[read.folder][kind] ?? 0, read.height);
    }
    await context.close();
    console.log(path, width);
  }
  await browser.close();
  const sorted = Object.fromEntries(Object.keys(heights).sort().map((key) => [key, heights[key]]));
  writeFileSync(store, JSON.stringify(sorted, null, 2) + '\n');
  return sorted;
}

function applyAll(heights) {
  let changed = 0;
  for (const [folder, entry] of Object.entries(heights)) {
    if (folder.startsWith('properties/')) continue; // build-properties.mjs writes these
    const dir = join(site, 'examples', folder);
    if (!existsSync(dir)) continue;
    const file = join(dir, 'index.css');
    const css = existsSync(file) ? readFileSync(file, 'utf8') : '';
    const next = withReserve(css, entry);
    if (next !== css) { writeFileSync(file, next); changed += 1; }
  }
  console.log(JSON.stringify({examples: Object.keys(heights).length, changed}));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const heights = base ? await record() : readHeights();
  if (apply) applyAll(heights);
}
