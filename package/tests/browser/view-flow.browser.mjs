#!/usr/bin/env node
// Usage: node this-file /absolute/path/to/output
//
// sf-view-flow in a real browser, from the built bytes
// (ui-view docs/design/sf-view-flow.md):
// - show mode: the fields read-only, no foot, a date in the page's language;
// - ask mode: Send with the required fields empty sends nothing, marks them
//   and moves focus to the first; typed and sent, the answer carries the whole
//   answer; the host settles it applied and the block shows what was sent,
//   read-only, with «Отправлено»;
// - the host's validation: settle refused with errors reopens the block with
//   each message under its field, keeps what was typed and focuses the field;
// - a collapsible group opens and closes from its label;
// - at 1280 and 390 px, light and dark: the block is as wide as its flow, no
//   wider, two columns become one, and nothing overflows.
import {resolve, join} from 'node:path';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright';

if (!process.argv[2]) throw new Error('Build output root is required');
const out = resolve(process.argv[2]);
const styles = [
  'core/core/css/core.css', 'core/core/css/utility.full.css',
  'component/component/buttons/css/buttons.css', 'component/component/inputs/css/inputs.css',
  'component/component/datepicker/css/datepicker.css', 'component/component/textarea/css/textarea.css',
  'component/component/dropdown/css/dropdown.css', 'component/component/badges/css/badges.css',
  'component/component/icons/css/icons.css',
  'smart/smart/view-flow/css/view-flow.css',
].map((p) => join(out, p));
const modules = [
  'core/core/js/core.js', 'core/core/js/smart-base.js', 'smart/smart/icon/js/icon.js',
  'smart/smart/button/js/button.js', 'smart/smart/spinner/js/spinner.js', 'smart/smart/badge/js/badge.js',
  'smart/smart/input/js/input.js', 'smart/smart/input-date/js/input-date.js',
  'smart/smart/input-textarea/js/input-textarea.js', 'smart/smart/dropdown/js/dropdown.js',
  'smart/smart/list-item/js/list-item.js', 'smart/smart/field-renderers/js/field-renderers.js',
  'smart/smart/view-flow/js/view-flow.js',
].map((p) => join(out, p));
const absent = [...styles, ...modules].filter((path) => !existsSync(path));
if (absent.length) throw new Error(`${absent.length} build asset(s) not found under ${out}: ${absent.join(', ')}`);

const VACATION = [
  {key: 'employee', label: 'Сотрудник', propertyType: 'string', width: 'full', value: 'Ирина Волкова'},
  {key: 'from', label: 'С', propertyType: 'date', width: 'half', value: '2026-12-21'},
  {key: 'to', label: 'По', propertyType: 'date', width: 'half', value: '2027-01-08'},
  {key: 'days', label: 'Дней', propertyType: 'integer', width: 'half', value: 19},
];
const TRIP = [
  {key: 'city', label: 'Город', propertyType: 'string', width: 'half', required: true, value: null},
  {key: 'from', label: 'Выезд', propertyType: 'date', width: 'half', required: true, value: null},
  {key: 'nights', label: 'Ночей', propertyType: 'integer', width: 'half', value: 2},
  {key: 'goal', label: 'Цель поездки', propertyType: 'text', width: 'full', value: null},
];

const failures = [];
const note = (detail) => failures.push(detail);
const results = {};
const browser = await chromium.launch();
try {
  for (const theme of ['light', 'dark']) {
    for (const width of [1280, 390]) {
      const page = await browser.newPage({viewport: {width, height: 900}});
      const errors = [];
      page.on('pageerror', (error) => { if (!/publicPath/u.test(error.message)) errors.push(error.message); });
      await page.setContent(`<!doctype html><html class="theme-${theme}" lang="ru"><head><meta charset="utf-8"></head>`
        + '<body style="margin:0"><main id="flow" style="box-sizing:border-box;inline-size:min(36rem,100%);padding:16px;display:flex;flex-direction:column;gap:12px">'
        + '<sf-view-flow id="show" heading="Заявка на отпуск № 17"></sf-view-flow>'
        + '<sf-view-flow id="ask" mode="edit" heading="Новая командировка" block-id="trip-1"></sf-view-flow>'
        + '<sf-view-flow id="groups" heading="Заказ"></sf-view-flow>'
        + '</main></body></html>');
      for (const style of styles) await page.addStyleTag({path: style});
      for (const module of modules) await page.addScriptTag({path: module, type: 'module'});
      await page.waitForFunction(() => Boolean(customElements.get('sf-view-flow') && customElements.get('sf-input')));
      await page.evaluate(({vacation, trip}) => {
        document.querySelector('#show').fields = vacation;
        document.querySelector('#ask').fields = trip;
        document.querySelector('#groups').groups = [
          {key: 'order', label: 'Заказ', fields: [{key: 'buyer', label: 'Покупатель', propertyType: 'string', value: 'Анна Белова'}]},
          {key: 'delivery', label: 'Доставка', collapsible: true, collapsed: true,
            fields: [{key: 'city', label: 'Город', propertyType: 'string', value: 'Казань'}]},
        ];
        window.answers = [];
        document.addEventListener('sf-view-flow-answer', (event) => window.answers.push(event.detail));
      }, {vacation: VACATION, trip: TRIP});
      await page.waitForFunction(() => document.querySelectorAll('#ask sf-input input').length >= 2, null, {timeout: 8000});
      await page.waitForTimeout(300);
      const at = `${theme} ${width}`;

      // Show mode.
      const show = await page.evaluate(() => {
        const block = document.querySelector('#show');
        const section = block.querySelector('section');
        return {
          name: section.getAttribute('aria-labelledby') === block.querySelector('[role=heading]')?.id,
          foot: Boolean(block.querySelector('footer')),
          controls: block.querySelectorAll('input, textarea, select').length,
          from: block.querySelector('[data-field="from"] .sf-view-flow__value')?.textContent.trim(),
          employee: block.querySelector('[data-field="employee"] .sf-view-flow__value')?.textContent.trim(),
        };
      });
      if (!show.name || show.foot || show.controls || show.employee !== 'Ирина Волкова' || !/2026/u.test(show.from ?? '') || /2026-12-21/u.test(show.from ?? '')) {
        note({at, case: 'show mode: fields read-only, no foot, a date in the page language', got: show});
      }

      // Layout: as wide as the flow, never wider; two columns become one at 390.
      const layout = await page.evaluate(() => {
        const flow = document.querySelector('#flow').getBoundingClientRect();
        const box = document.querySelector('#ask section').getBoundingClientRect();
        const city = document.querySelector('#ask [data-field="city"]').getBoundingClientRect();
        const from = document.querySelector('#ask [data-field="from"]').getBoundingClientRect();
        const overflow = [...document.querySelectorAll('#ask *')].filter((node) => node.getBoundingClientRect().right > box.right + 1).length;
        const fill = getComputedStyle(document.querySelector('#ask section')).backgroundColor;
        const ink = getComputedStyle(document.querySelector('#ask section')).color;
        return {flowWidth: flow.width - 32, width: box.width, sameRow: Math.abs(city.top - from.top) < 2, overflow,
          page: document.documentElement.scrollWidth <= window.innerWidth, fill, ink};
      });
      if (Math.abs(layout.width - layout.flowWidth) > 1 || layout.overflow || !layout.page) note({at, case: 'the block is as wide as its flow and nothing overflows', got: layout});
      if (width === 1280 && !layout.sameRow) note({at, case: 'two half fields share a row', got: layout});
      if (width === 390 && layout.sameRow) note({at, case: 'one column below 480 px', got: layout});
      if (layout.fill === layout.ink) note({at, case: 'text and ground differ', got: layout});

      // Send with the required fields empty.
      const stopped = await page.evaluate(async () => {
        const block = document.querySelector('#ask');
        const returned = block.confirm();
        await new Promise((done) => setTimeout(done, 200));
        return {returned, answers: window.answers.length, state: block.state,
          errors: [...block.querySelectorAll('.sf-view-flow__error')].map((node) => node.textContent.trim()),
          status: block.querySelector('.sf-view-flow__status > span')?.textContent.trim(),
          focus: document.activeElement?.closest?.('[data-field]')?.dataset.field ?? null};
      });
      if (stopped.returned?.reason !== 'invalid' || stopped.answers || stopped.state !== 'open' || stopped.errors.length !== 2
        || stopped.errors[0] !== 'Заполните поле' || stopped.status !== 'Заполните отмеченные поля' || stopped.focus !== 'city') {
        note({at, case: 'Send with required fields empty sends nothing, marks them, focuses the first', got: stopped});
      }

      // Type, send, refused by the host, corrected, sent, settled.
      await page.locator('#ask [data-field="city"] input').fill('Казань');
      await page.locator('#ask [data-field="city"] input').dispatchEvent('change');
      await page.evaluate(() => document.querySelector('#ask').changeField({key: 'from', value: null}, '2026-11-20'));
      await page.waitForTimeout(150);
      await page.locator('#ask button[data-action="submit"]').click();
      await page.waitForTimeout(150);
      const sent = await page.evaluate(() => ({state: document.querySelector('#ask').state, answer: window.answers.at(-1),
        busy: document.querySelector('#ask section').getAttribute('aria-busy'),
        inert: document.querySelector('#ask .sf-view-flow__groups').inert}));
      const expected = {id: 'trip-1', accepted: true, values: {city: 'Казань', from: '2026-11-20', nights: 2, goal: null}};
      if (sent.state !== 'pending' || JSON.stringify(sent.answer) !== JSON.stringify(expected) || sent.busy !== 'true' || !sent.inert) {
        note({at, case: 'Send carries the whole answer and the block waits, inert', got: sent});
      }
      const refusedAnswer = await page.evaluate(async () => {
        const block = document.querySelector('#ask');
        const returned = block.settle({answer: 'refused', reason: 'record_invalid', errors: {city: 'В Казань командировок нет.'}, message: 'Проверьте поля'});
        await new Promise((done) => setTimeout(done, 200));
        return {returned, state: block.state,
          error: block.querySelector('[data-field="city"] .sf-view-flow__error')?.textContent.trim(),
          role: block.querySelector('[data-field="city"] .sf-view-flow__error')?.getAttribute('role'),
          kept: block.querySelector('[data-field="city"] input')?.value,
          status: block.querySelector('.sf-view-flow__status > span')?.textContent.trim(),
          focus: document.activeElement?.closest?.('[data-field]')?.dataset.field ?? null};
      });
      if (refusedAnswer.state !== 'open' || refusedAnswer.error !== 'В Казань командировок нет.' || refusedAnswer.role !== 'alert'
        || refusedAnswer.kept !== 'Казань' || refusedAnswer.status !== 'Проверьте поля' || refusedAnswer.focus !== 'city') {
        note({at, case: 'the host refuses with an error: open again, the message under the field, the entry kept, focus there', got: refusedAnswer});
      }
      await page.locator('#ask [data-field="city"] input').fill('Самара');
      await page.locator('#ask [data-field="city"] input').dispatchEvent('change');
      await page.waitForTimeout(100);
      await page.locator('#ask button[data-action="submit"]').click();
      await page.waitForTimeout(100);
      const answered = await page.evaluate(async () => {
        const block = document.querySelector('#ask');
        const returned = block.settle({answer: 'applied'});
        await new Promise((done) => setTimeout(done, 250));
        return {returned, state: block.state, sentCity: window.answers.at(-1)?.values?.city,
          status: block.querySelector('.sf-view-flow__status > span')?.textContent.trim(),
          actionsHidden: block.querySelector('.sf-view-flow__actions')?.hidden,
          controls: block.querySelectorAll('input, textarea').length,
          city: block.querySelector('[data-field="city"] .sf-view-flow__value')?.textContent.trim(),
          errors: block.querySelectorAll('.sf-view-flow__error').length};
      });
      if (answered.state !== 'accepted' || answered.sentCity !== 'Самара' || answered.status !== 'Отправлено' || !answered.actionsHidden
        || answered.controls || answered.city !== 'Самара' || answered.errors) {
        note({at, case: 'settled applied: the values sent, read-only, «Отправлено», no answers', got: answered});
      }

      // A collapsible group.
      const toggled = await page.evaluate(async () => {
        const block = document.querySelector('#groups');
        const button = block.querySelector('.sf-view-flow__toggle');
        const body = () => document.getElementById(button.getAttribute('aria-controls'));
        const before = {expanded: button.getAttribute('aria-expanded'), hidden: body().hidden};
        button.click();
        await new Promise((done) => setTimeout(done, 120));
        const pressed = block.querySelector('.sf-view-flow__toggle');
        return {before, after: {expanded: pressed.getAttribute('aria-expanded'), hidden: document.getElementById(pressed.getAttribute('aria-controls')).hidden}};
      });
      if (toggled.before.expanded !== 'false' || !toggled.before.hidden || toggled.after.expanded !== 'true' || toggled.after.hidden) {
        note({at, case: 'a collapsible group opens from its label', got: toggled});
      }
      if (errors.length) note({at, case: 'no page errors', got: errors});
      results[at] = {layout, sent: sent.state, answered: answered.state};
      await page.close();
    }
  }
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exit(1); }
console.log('VIEW_FLOW_OK');
