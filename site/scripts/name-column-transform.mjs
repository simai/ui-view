#!/usr/bin/env node
// The «Имя» column of the reference tables keeps each name whole (decision
// C10: the documentation gives the name column a width). SIMAI Framework
// lets code in a table cell wrap at any point, so a long value cannot push a
// table wider than the page. Docara 3.11.1 lays out Markdown tables
// automatically, so on a phone the auto layout squeezed the first column to
// about 80 px and names split between two letters: `intege/r`, `applie/d`,
// `query.chan/ge` (58 names on 13 of the 32 pages at 390 px).
//
// In the first column, which holds the name of the row, code wraps only at
// its own places, such as spaces and hyphens, as code does in running text
// (C10). The column is then never narrower than its longest unbroken name.
// The other columns keep the Framework rule. No size is set here: the
// column's width comes from its names.
//
// Docara takes no CSS from the site's settings (DOCARA-REQUESTS.md, 16), so
// this page transform adds the rule to the head of each page that has a
// Markdown table. verify-static hashes only the body, without its style
// elements, so the check still passes (unlike request 15, which changes
// the body).
//
// Every page is asserted: a page with a table and no </head>, or one that
// already holds the rule, stops the build instead of passing unchanged.
//
// Usage (docara.json page_transforms): node scripts/name-column-transform.mjs <site folder>
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

export const MARK = 'data-view-docs-names';
export const RULE = '.table > :is(thead, tbody) > tr > :first-child code { overflow-wrap: normal; }';
const TABLE = '<table class="table table-stripe">';

const site = process.argv.at(-1);
if (!site || !existsSync(site)) throw new Error('name-column-transform: the built site folder is the last argument');

const pages = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) pages.push(path);
  }
};
walk(site);

let changed = 0;
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes(TABLE)) continue;
  if (html.includes(MARK)) throw new Error(`name-column-transform: ${file}: the rule is there already`);
  const head = html.indexOf('</head>');
  if (head < 0) throw new Error(`name-column-transform: ${file}: no </head>`);
  writeFileSync(file, `${html.slice(0, head)}<style ${MARK}>${RULE}</style>${html.slice(head)}`);
  changed += 1;
}
if (changed === 0) throw new Error('name-column-transform: no page with a Markdown table found');
console.log(`name-column-transform: ${changed} page(s) with a table`);
