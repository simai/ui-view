#!/usr/bin/env node
// Usage: node scripts/evidence.mjs <site URL> <out directory>
//
// Screenshots of the built site for review, at 1280 and 390 px, light (and
// dark for the home page): the home page once per example tab (table, card,
// table and card, in a stream), the fields overview and the files page, the
// quick start, the bulk-actions recipe and the sf-view-table reference page.
// Every shown set element must be defined (one on a hidden tab may not be
// yet: the Loader defines a component when it is first shown), a tab with a
// table must draw rows, and console and page errors are recorded. The home
// page is loaded three times more to catch errors that only show on some
// loads. Needs Playwright (PLAYWRIGHT_MODULE for its path,
// PLAYWRIGHT_BROWSERS_PATH for the browser).
import {mkdirSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {join, resolve} from 'node:path';

const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const [base, outArgument] = process.argv.slice(2);
if (!base || !outArgument) throw new Error('usage: evidence.mjs <site URL> <out directory>');
const out = resolve(outArgument);
mkdirSync(out, {recursive: true});
const TABS = ['Таблица', 'Карточка', 'Таблица и карточка', 'В потоке'];
const PAGES = [
  ['fields', 'ru/fields/'],
  ['fields-files', 'ru/fields/files/'],
  ['quick-start', 'ru/guide/quick-start/'],
  ['recipe-bulk-actions', 'ru/guide/recipes/selection-and-bulk-actions/'],
  ['reference-view-table', 'ru/components/views/view-table/'],
  ['reference-view-flow', 'ru/components/views/view-flow/'],
  ['recipe-data-in-flow', 'ru/guide/recipes/data-in-flow/'],
];
const SET_TAGS = 'sf-view, sf-view-table, sf-view-properties, sf-view-flow';
const report = [];

const watch = (page) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  return errors;
};
// Frames load lazily: scroll through the page so every example starts.
const wake = async (page) => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) { await page.evaluate((top) => window.scrollTo(0, top), y); await page.waitForTimeout(150); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2500);
};
const inventory = async (page) => {
  const elements = [];
  for (const frame of page.frames()) {
    elements.push(...await frame.evaluate((tags) => [...document.querySelectorAll(tags)].map((element) => ({
      tag: element.localName,
      defined: Boolean(customElements.get(element.localName)),
      visible: element.getClientRects().length > 0,
      rows: element.localName === 'sf-view-table' ? element.querySelectorAll('tbody tr, [role="row"], li').length : undefined,
    })), SET_TAGS).catch(() => []));
  }
  return elements;
};
// A frame outside the viewport is not painted into a full-page capture: the
// viewport is made as tall as the page before the shot.
const shoot = async (page, width, file) => {
  const full = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({width, height: Math.min(full, 12000)});
  await page.waitForTimeout(2000);
  await page.screenshot({path: join(out, file), fullPage: true});
  await page.setViewportSize({width, height: 900});
};
const showcase = (page) => page.frames().find((frame) => frame.url() !== page.url() && frame !== page.mainFrame());

const browser = await chromium.launch();
for (const scheme of ['light', 'dark']) {
  for (const width of [1280, 390]) {
    const context = await browser.newContext({viewport: {width, height: 900}, colorScheme: scheme, deviceScaleFactor: 1, ignoreHTTPSErrors: true});
    // The home page, once per example tab.
    const page = await context.newPage();
    const errors = watch(page);
    await page.goto(new URL('ru/', base).href, {waitUntil: 'networkidle'});
    await wake(page);
    for (const [index, label] of TABS.entries()) {
      const frame = page.frames().find((one) => one !== page.mainFrame());
      if (!frame) { report.push({page: 'ru/', tab: label, width, scheme, errors: ['no example frame']}); break; }
      if (index > 0) {
        await frame.getByRole('tab', {name: label, exact: true}).click();
        await page.waitForTimeout(1500);
      }
      const panel = await frame.evaluate(([position, tags]) => {
        const section = document.querySelector(`[slot="panel-${position}"]`);
        const table = section?.querySelector('sf-view-table');
        // A panel with a table must draw its rows; one without (the card,
        // the feed) must draw some text of its own.
        return {
          visible: Boolean(section && section.getClientRects().length),
          rows: table ? table.querySelectorAll('tbody tr, [role="row"], li').length : null,
          text: (section?.innerText ?? '').replace(/\s+/gu, ' ').slice(0, 160),
          // A panel's own words are not its example: a set element must be
          // defined in it (the feed tab once showed its description over
          // nothing). Defined, not measured: a Smart host is display: contents.
          drawn: section ? [...section.querySelectorAll(tags)].filter((one) => customElements.get(one.localName)).length : 0,
        };
      }, [index, SET_TAGS]);
      const file = `home-${index + 1}-${width}-${scheme}.png`;
      await shoot(page, width, file);
      report.push({page: 'ru/', tab: label, width, scheme, file, panel, elements: await inventory(page), errors: [...errors]});
    }
    await page.close();
    if (scheme === 'light') {
      for (const [name, path] of PAGES) {
        const one = await context.newPage();
        const pageErrors = watch(one);
        await one.goto(new URL(path, base).href, {waitUntil: 'networkidle'});
        await wake(one);
        const file = `${name}-${width}-${scheme}.png`;
        await shoot(one, width, file);
        report.push({page: path, width, scheme, file, elements: await inventory(one), errors: pageErrors});
        await one.close();
      }
    }
    await context.close();
  }
}

// Three more loads of the home page, from a cold context each time.
const reloads = [];
for (let round = 1; round <= 3; round += 1) {
  const context = await browser.newContext({viewport: {width: 1280, height: 900}, ignoreHTTPSErrors: true});
  const page = await context.newPage();
  const errors = watch(page);
  await page.goto(new URL('', base).href, {waitUntil: 'networkidle'});
  await wake(page);
  const elements = await inventory(page);
  reloads.push({round, url: page.url(), elements: elements.length, undefined: elements.filter((one) => !one.defined && one.visible).length, errors});
  await context.close();
}
await browser.close();

writeFileSync(join(out, 'screenshots.json'), `${JSON.stringify({base, shots: report, reloads}, null, 1)}\n`);
const broken = report.filter((shot) => shot.errors.length
  || (shot.elements ?? []).some((one) => !one.defined && one.visible)
  || (shot.panel && (!shot.panel.visible || shot.panel.rows === 0 || !shot.panel.drawn || shot.panel.text.length < 120))
  || (shot.page !== 'ru/' && !(shot.elements ?? []).length));
const brokenReloads = reloads.filter((one) => one.errors.length || one.undefined || !one.url.endsWith('/ru/'));
console.log(JSON.stringify({shots: report.length, broken: broken.map(({file, panel, errors}) => ({file, panel, errors})), reloads: brokenReloads}, null, 1));
process.exit(broken.length || brokenReloads.length ? 1 : 0);
