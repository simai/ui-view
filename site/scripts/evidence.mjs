#!/usr/bin/env node
// Usage: node scripts/evidence.mjs <site URL> <out directory>
//
// Screenshots of the built site for review: the overview, one component page
// and one demo, light and dark, at 1440 and 390 px. Before each shot it waits
// for every live example's elements to be defined and drawn; on the orders demo
// it opens the first order so the record card shows. It also fails when a live
// example's set element never upgrades. Needs Playwright (PLAYWRIGHT_BROWSERS_PATH
// for the browser).
import {mkdirSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {join, resolve} from 'node:path';

const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const [base, outArgument] = process.argv.slice(2);
if (!base || !outArgument) throw new Error('usage: evidence.mjs <site URL> <out directory>');
const out = resolve(outArgument);
mkdirSync(out, {recursive: true});
const PAGES = [['overview', ''], ['component-view-table', 'components/view-table/'], ['demo-orders', 'demos/orders/']];
const SET_TAGS = 'sf-view, sf-view-table, sf-view-properties, sf-table, sf-data-view, sf-property-view';
const report = [];

const browser = await chromium.launch();
for (const scheme of ['light', 'dark']) {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({viewport: {width, height: 900}, colorScheme: scheme, deviceScaleFactor: 1});
    for (const [name, path] of PAGES) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(new URL(path, base).href, {waitUntil: 'networkidle'});
      // Frames load lazily: scroll through the page so every example starts.
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 600) { await page.evaluate((top) => window.scrollTo(0, top), y); await page.waitForTimeout(150); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(2500);
      if (name === 'demo-orders') {
        const frame = page.frames().find((one) => one !== page.mainFrame());
        const link = frame && await frame.waitForFunction(() => {
          const table = document.querySelector('sf-view-table');
          return [...(table?.querySelectorAll('a, button') ?? [])].find((item) => /№ \d+/u.test(item.textContent ?? ''));
        }, null, {timeout: 10000}).catch(() => null);
        if (link) { await link.asElement()?.click(); await page.waitForTimeout(2000); }
      }
      const elements = [];
      for (const frame of page.frames()) {
        elements.push(...await frame.evaluate((tags) => [...document.querySelectorAll(tags)].map((element) => ({
          tag: element.localName, defined: Boolean(customElements.get(element.localName)), hidden: element.hidden,
        })), SET_TAGS).catch(() => []));
      }
      // A frame outside the viewport is not painted into a full-page capture
      // (the example frames load and draw lazily): the viewport is made as
      // tall as the page, so every example is on screen when it is taken.
      const full = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.setViewportSize({width, height: Math.min(full, 12000)});
      await page.waitForTimeout(2500);
      const file = `${name}-${width}-${scheme}.png`;
      await page.screenshot({path: join(out, file), fullPage: true});
      await page.setViewportSize({width, height: 900});
      report.push({page: path || '/', width, scheme, file, elements, undefined: elements.filter((one) => !one.defined).length, errors});
      await page.close();
    }
    await context.close();
  }
}
await browser.close();
writeFileSync(join(out, 'screenshots.json'), `${JSON.stringify({base, shots: report}, null, 1)}\n`);
const broken = report.filter((shot) => shot.undefined || shot.errors.length || !shot.elements.length && shot.page !== '/');
console.log(JSON.stringify({shots: report.length, broken: broken.map(({file, undefined: count, errors}) => ({file, undefined: count, errors}))}, null, 1));
process.exit(broken.length ? 1 : 0);
