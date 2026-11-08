/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "a2a9d3c2841e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BADGE_SCHEMES: () => (/* binding */ BADGE_SCHEMES),
/* harmony export */   BADGE_SCHEME_ALIASES: () => (/* binding */ BADGE_SCHEME_ALIASES),
/* harmony export */   BADGE_SIZES: () => (/* binding */ BADGE_SIZES),
/* harmony export */   BADGE_TYPES: () => (/* binding */ BADGE_TYPES),
/* harmony export */   BADGE_VARIANTS: () => (/* binding */ BADGE_VARIANTS),
/* harmony export */   canonicalBadgeScheme: () => (/* binding */ canonicalBadgeScheme),
/* harmony export */   normalizeBadgeContract: () => (/* binding */ normalizeBadgeContract)
/* harmony export */ });
const BADGE_TYPES = Object.freeze(['main', 'tonal', 'outline']);
const BADGE_SCHEMES = Object.freeze(['neutral', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error', 'on-surface']); // Former scheme names that still draw: `danger` was this component's word for
// the error status before the shared vocabulary (contracts/public-api-axes.json,
// journal class-status-aliases, until 2026-12-01). It is read as `error`, so the
// Native constructor emits the canonical class, as sf-badge does; the
// stylesheet matches `.sf-badge--danger` beside it for markup written by hand.

const BADGE_SCHEME_ALIASES = Object.freeze({
  danger: 'error'
});
const BADGE_SIZES = Object.freeze(['1/3', '1/2', '1']);
const DEFAULT_BADGE_TYPE = 'main';
const DEFAULT_BADGE_SCHEME = 'neutral';
const DEFAULT_BADGE_SIZE = '1/3';

const normalizeEnum = (value, allowed, fallback) => {
  const normalized = String(value ?? fallback).trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}; // The canonical scheme for a name, a former one included; '' when the name is
// not a badge scheme.


function canonicalBadgeScheme(value) {
  const name = String(value ?? '').trim().toLowerCase();
  const canonical = BADGE_SCHEME_ALIASES[name] ?? name;
  return BADGE_SCHEMES.includes(canonical) ? canonical : '';
}
const BADGE_VARIANTS = Object.freeze(BADGE_SCHEMES.flatMap(scheme => BADGE_TYPES.filter(type => !(scheme === 'on-surface' && type === 'tonal')).flatMap(type => BADGE_SIZES.map(size => Object.freeze({
  type,
  scheme,
  size
})))));
function normalizeBadgeContract({
  type,
  scheme,
  size
} = {}) {
  let normalizedType = normalizeEnum(type, BADGE_TYPES, DEFAULT_BADGE_TYPE);
  const normalizedScheme = canonicalBadgeScheme(scheme ?? DEFAULT_BADGE_SCHEME) || DEFAULT_BADGE_SCHEME;
  const normalizedSize = normalizeEnum(size, BADGE_SIZES, DEFAULT_BADGE_SIZE);

  if (normalizedType === 'tonal' && normalizedScheme === 'on-surface') {
    normalizedType = 'main';
  }

  return {
    type: normalizedType,
    scheme: normalizedScheme,
    size: normalizedSize
  };
}

/***/ },

/***/ "e577837dd70a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calendarDayOffset: () => (/* binding */ calendarDayOffset),
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   msUntilNextDay: () => (/* binding */ msUntilNextDay),
/* harmony export */   toDate: () => (/* reexport safe */ _format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Dates in the page's language: formatDate, the calendar day offset and the
// next midnight, with no top-level side effects (format-intl.js). The same
// functions as core/js/format.js and SF.format; relative days and times are
// format-relative.js, so a bundle that writes a date does not carry them.


const DAY_MS = 86400000;

function hasDateStyle(style) {
  return style === 'short' || style === 'medium' || style === 'long' || style === 'full';
}
/**
 * A date, a time or both in the locale.
 *
 *   formatDate(at)                          3 нояб. 2026 г.  /  Nov 3, 2026
 *   formatDate(at, {date: 'short'})         03.11.2026       /  11/3/26
 *   formatDate(at, {date: 'long'})          3 ноября 2026 г. /  November 3, 2026
 *   formatDate(at, {time: 'short'})         3 нояб. 2026 г., 14:05
 *   formatDate(at, {date: null, time: 'short'})   14:05   /  2:05 PM
 *
 * `date` and `time` are Intl styles (short, medium, long, full); `intl` gives
 * Intl.DateTimeFormat options outright, for a form the styles do not name (a
 * chart's tick, «14:05» with two-digit hours). Anything that is not a date is
 * `gap`, '' by default.
 */


function formatDate(value, {
  date = 'medium',
  time = null,
  intl = null,
  gap = '',
  ...where
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  if (!moment) return gap;
  let options = intl;

  if (!options) {
    options = {};
    if (hasDateStyle(date)) options.dateStyle = date;
    if (hasDateStyle(time)) options.timeStyle = time;
    if (!options.dateStyle && !options.timeStyle) options.dateStyle = 'medium';
  }

  return (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(moment);
}
/**
 * Calendar days from `now` to the value in the reader's time zone: 0 today,
 * -1 yesterday, 1 tomorrow; NaN when the value is no date. Counted on
 * calendar dates, not 24-hour spans, so 23:59 yesterday is -1 at 00:01 and a
 * day of a clock change is still one day.
 */

function calendarDayOffset(value, {
  now = new Date()
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  const today = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now);
  if (!moment || !today) return Number.NaN;
  const day = Date.UTC(moment.getFullYear(), moment.getMonth(), moment.getDate());
  const base = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((day - base) / DAY_MS);
}
/**
 * Milliseconds from `now` to the reader's next midnight, when every relative
 * day on the screen moves by one. A component that shows them sets a timer
 * for this long (plus a second's margin, so it wakes in the new day) and
 * draws them again; «сегодня» said yesterday is wrong by morning.
 */

function msUntilNextDay(now = new Date()) {
  const today = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now) ?? new Date();
  const next = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return next.getTime() - today.getTime();
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "15b4e93ff6ed"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatLocale: () => (/* binding */ formatLocale),
/* harmony export */   intlFormatter: () => (/* binding */ intlFormatter),
/* harmony export */   toDate: () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
// The part every format module shares (core/js/format.js says what the
// helpers are): the locale a call formats in, a Date from what a host gives,
// and the Intl formatters, kept on a global every copy of these modules shares
// (bundles each carry their own module copy; page-language.js says why).
//
// No top-level side effects, here or in format-number.js, format-date.js,
// format-relative.js and format-file-size.js (ui-chart, 2026-11-05): a bundle
// that imports one function carries that function and what it calls, nothing
// else. The global is made on the first format, not on load, and SF.format is
// published by core's entry (index.js, publishFormat in format.js).

/** The locale a call formats in: the one it names, else its node's page language. */

function formatLocale({
  locale,
  node
} = {}) {
  return String(locale || '').trim() || (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node);
}
/** A Date from a Date, a time in milliseconds or a date string; null when it is none. */

function toDate(value) {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(typeof value === 'string' && /^\d+$/u.test(value) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
} // The formatters every copy shares, made on the first call.

function formatterCache() {
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!root.__sfFormat) root.__sfFormat = {
    formatters: new Map()
  };
  return root.__sfFormat.formatters;
} // One formatter per kind, locale and options. An unknown locale falls back to
// the browser's, and options the platform refuses (an unknown unit or
// currency) to a plain number, so a typo in a page never throws at a reader.


function intlFormatter(kind, locale, options) {
  const key = `${kind}|${locale}|${JSON.stringify(options)}`;
  const cache = formatterCache();
  if (cache.has(key)) return cache.get(key);
  const Make = Intl[kind];
  let made;

  try {
    made = new Make(locale || undefined, options);
  } catch {
    try {
      made = new Make(undefined, options);
    } catch {
      made = new Make(locale || undefined, kind === 'NumberFormat' ? {
        maximumFractionDigits: 2
      } : {});
    }
  } // A page that formats in many locales does not grow the cache for ever.


  if (cache.size >= 256) cache.delete(cache.keys().next().value);
  cache.set(key, made);
  return made;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "51250bf01ab0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPreferences: () => (/* binding */ createPreferences),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// SF.Preferences: what a person changes about how a thing looks -- column
// order, widths, sort, density, a menu's column widths -- kept one way for
// every component (owner, 2026-10-14; ui-control
// control/designs/2026-10-14-view-preferences.md).
//
// - A preference is a plain JSON value under a key `<component>/<instance>`,
//   e.g. `sf-table/cms.solutions`. No key, nothing is kept.
// - It is read synchronously, so a component applies it before its first
//   paint: the skeleton is already in the person's order.
// - The browser keeps a copy always (localStorage `sf-pref:<key>`), the cache
//   a first paint can read. A host that keeps preferences for its user
//   (Larena) plugs in with useHost(); its values win over the cache, and every
//   write goes to it as well, debounced per key.
// - A page can preload the host's values: preload({key: value}), or a
//   <script type="application/json" data-sf-preferences> (or id
//   "sf-preferences") in the page, read before the first value is.
//
// The registry lives on globalThis.SF: every bundle carries its own copy of
// this module, and two copies with two caches would disagree.
const PREFIX = 'sf-pref:';
const DELAY = 400;
const KEY = /^[\w.*:-]+(?:\/[\w.*:/-]+)?$/u;

function storage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function validKey(key) {
  return typeof key === 'string' && key.length > 0 && key.length <= 200 && KEY.test(key);
}

function same(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function plain(value) {
  return value === null || value === undefined ? null : JSON.parse(JSON.stringify(value));
}

function createPreferences() {
  const host = {
    adapter: null,
    values: new Map()
  };
  const listeners = new Map();
  const timers = new Map(); // The page's own block of the host's values, read once, before the first
  // read: a component may connect before this module's start-up ran.

  let inlineRead = false;

  const readInline = () => {
    if (inlineRead) return;
    const node = globalThis.document?.querySelector?.('script[type="application/json"][data-sf-preferences], script#sf-preferences[type="application/json"]');
    if (!node) return;
    inlineRead = true;

    try {
      api.preload(JSON.parse(node.textContent || '{}'));
    } catch {
      /* not JSON: ignored */
    }
  };

  const notify = (key, value) => {
    for (const listener of listeners.get(key) ?? []) {
      try {
        listener(plain(value), key);
      } catch (error) {
        console.error('SF.Preferences listener failed', key, error);
      }
    }
  };

  const readCache = key => {
    const store = storage();
    if (!store) return null;

    try {
      const raw = store.getItem(PREFIX + key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeCache = (key, value) => {
    const store = storage();
    if (!store) return;

    try {
      if (value === null) store.removeItem(PREFIX + key);else store.setItem(PREFIX + key, JSON.stringify(value));
    } catch {// A full or refused storage keeps the value for this page only.
    }
  };

  const saveToHost = key => {
    clearTimeout(timers.get(key));
    timers.delete(key);
    const adapter = host.adapter;
    if (!adapter) return;
    const value = host.values.has(key) ? host.values.get(key) : readCache(key);

    try {
      const answer = value === null ? adapter.remove?.(key) : adapter.save?.(key, plain(value));
      Promise.resolve(answer).catch(error => console.warn('SF.Preferences: the host did not keep', key, error));
    } catch (error) {
      console.warn('SF.Preferences: the host did not keep', key, error);
    }
  };

  const schedule = key => {
    if (!host.adapter) return;
    clearTimeout(timers.get(key));
    timers.set(key, setTimeout(() => saveToHost(key), DELAY));
  };

  const api = {
    // The value for a key: the host's when it gave one, else this browser's.
    read(key) {
      if (!validKey(key)) return null;
      readInline();
      if (host.values.has(key)) return plain(host.values.get(key));
      return plain(readCache(key));
    },

    // Several keys from the most general to the most particular, merged field
    // by field: `sf-table/*` (the person's tables) under `sf-table/<instance>`.
    readMerged(...keys) {
      const merged = {};
      let found = false;

      for (const key of keys.flat()) {
        const value = api.read(key);

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(merged, value);
          found = true;
        }
      }

      return found ? merged : null;
    },

    write(key, value) {
      if (!validKey(key)) return false;
      const next = plain(value); // The value already kept is not written again: a component restoring
      // what the host gave it (sf-resizer's value) sent it back to the host on
      // every load (docs trial 5).

      if (JSON.stringify(api.read(key)) === JSON.stringify(next)) return true;
      if (host.values.has(key)) host.values.set(key, next);
      writeCache(key, next);
      schedule(key);
      return true;
    },

    // «Сбросить вид»: gone from both.
    remove(key) {
      if (!validKey(key)) return false;
      if (host.values.has(key)) host.values.set(key, null);
      writeCache(key, null);
      schedule(key);
      notify(key, null);
      return true;
    },

    subscribe(key, listener) {
      if (!validKey(key) || typeof listener !== 'function') return () => {};
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(listener);
      return () => listeners.get(key)?.delete(listener);
    },

    // The host's values for this person. Each that differs from this
    // browser's copy replaces it and is announced, so a component re-applies.
    preload(values) {
      if (!values || typeof values !== 'object') return;

      for (const [key, value] of Object.entries(values)) {
        if (!validKey(key)) continue;
        const next = plain(value);
        const before = api.read(key);
        host.values.set(key, next);
        writeCache(key, next);
        if (!same(before, next)) notify(key, next);
      }
    },

    // {save(key, value), remove(key), load?(keys) → Promise<{key: value}>}.
    useHost(adapter) {
      if (!adapter || typeof adapter.save !== 'function') throw new TypeError('A preferences host saves: {save(key, value)}');
      host.adapter = adapter;
      return api;
    },

    // Asks the host for keys it has not given yet (a component that appears
    // after the page loaded).
    async load(keys) {
      const wanted = [].concat(keys).filter(key => validKey(key) && !host.values.has(key));
      if (!wanted.length || typeof host.adapter?.load !== 'function') return;

      try {
        api.preload(await host.adapter.load(wanted));
      } catch (error) {
        console.warn('SF.Preferences: the host did not answer', wanted, error);
      }
    },

    get hosted() {
      return Boolean(host.adapter);
    },

    // Writes still waiting go now (a page that is leaving).
    flush() {
      for (const key of [...timers.keys()]) saveToHost(key);
    }

  }; // Another tab changed a preference.

  globalThis.addEventListener?.('storage', event => {
    if (!event.key?.startsWith(PREFIX) || event.storageArea !== storage()) return;
    const key = event.key.slice(PREFIX.length);
    if (host.values.has(key)) return;
    let value = null;

    try {
      value = event.newValue === null ? null : JSON.parse(event.newValue);
    } catch {
      value = null;
    }

    notify(key, value);
  });
  globalThis.addEventListener?.('pagehide', () => api.flush());
  readInline();
  return Object.freeze(api);
}

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.Preferences) globalThis.SF.Preferences = createPreferences();
}

const Preferences = globalThis.SF?.Preferences;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Preferences);


/***/ },

/***/ "9ce1a42b2a85"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DATE_TIME_RE: () => (/* binding */ DATE_TIME_RE),
/* harmony export */   composeDateTime: () => (/* binding */ composeDateTime),
/* harmony export */   composeTime: () => (/* binding */ composeTime),
/* harmony export */   normalizeTime: () => (/* binding */ normalizeTime),
/* harmony export */   splitDateTime: () => (/* binding */ splitDateTime),
/* harmony export */   splitTime: () => (/* binding */ splitTime)
/* harmony export */ });
// A datetime's value, read and written back: plain functions, no rendering.
// The edit renderers (renderDateTimeEdit and renderTimeEdit in index.js) use them, the contract
// test runs them without a DOM, and SF.fieldRenderers.dateTime publishes them
// so a host that draws its own pair reads and writes the same way.
//
// Lifted from ui-admin's property view (src/smart/property-view/js/
// datetime-value.js, Larena acceptance 2026-10-22: «Дата и время» kept only
// the day, so a new record could not get a time and «15.11.2026 10:30» was
// saved as «15.11.2026»).
//
// The value is the host's text, in the host's time zone, as it reads it. The
// round trip is lossless: a field whose day and time come back to what they
// were writes back exactly the text it read. A changed day keeps the record's
// clock (seconds, fraction) and zone; a changed time is hh:mm:00 with the
// record's zone; a new value has no zone and is the host's local time.
// The forms a datetime arrives in: a day, or a day and a time separated by T or
// a space, with optional seconds, fraction and zone.
const DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2})((?::\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/u;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/u; // The value without the host's formatting ({value, text} carries both).

function rawValue(value) {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'value' in value) return value.value;
  return value;
} // What a stored value is made of. `known` is false for a value that is not a
// datetime at all: the controls start empty and, untouched, nothing is written.


function splitDateTime(value) {
  const raw = rawValue(value);
  if (raw === null || raw === undefined || raw === '') return {
    raw: raw ?? null,
    known: true,
    date: '',
    time: '',
    rest: '',
    zone: ''
  };
  const match = typeof raw === 'string' ? raw.trim().match(DATE_TIME_RE) : null;
  if (!match) return {
    raw,
    known: false,
    date: '',
    time: '',
    rest: '',
    zone: ''
  };
  return {
    raw,
    known: true,
    date: match[1],
    time: match[2] ? `${match[2]}:${match[3]}` : '',
    rest: match[4] || '',
    zone: match[5] || ''
  };
} // A time as the person typed it, as hh:mm, or null when it is not one. The
// mask gives «10:30»; without it «1030», «9:30» and «9.30» are read too.

function normalizeTime(text) {
  const value = String(text ?? '').trim().replace(/[_\s]/gu, '');
  if (value === '' || value === ':') return '';
  const match = value.match(/^(\d{1,2})[:.]?(\d{2})$/u);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return `${String(hours).padStart(2, '0')}:${match[2]}`;
} // The value to write for a day and a time, against what the field held.
// {value} -- the text to write (null clears), or {error} -- the key of the
// sentence that says what is missing: dateMissing, dateInvalid, timeMissing,
// timeInvalid.

function composeDateTime(original, draft) {
  const date = String(draft?.date ?? '').trim();
  const time = normalizeTime(draft?.time);
  if (time === null) return {
    error: 'timeInvalid'
  };
  if (!date && !time) return {
    value: null
  };
  if (!DAY_RE.test(date)) return {
    error: date ? 'dateInvalid' : 'dateMissing'
  };
  if (!time) return {
    error: 'timeMissing'
  };
  const before = original?.known ? original : null; // Back to what it was: the very text it read, separator and all.

  if (before && before.date === date && before.time === time) return {
    value: before.raw
  }; // The clock below the minute and the zone are the record's while the
  // person did not change the time; a time they typed is to the minute.

  const sameTime = before && before.time === time;
  const rest = sameTime ? before.rest : ':00';
  const zone = before && before.time ? before.zone : '';
  return {
    value: `${date}T${time}${rest}${zone}`
  };
} // A time of day as a host stores it: hh:mm, or with seconds and a fraction.

const TIME_RE = /^(\d{2}):(\d{2})((?::\d{2})(?:\.\d+)?)?$/u; // What a stored time is made of, as splitDateTime says it for a datetime.

function splitTime(value) {
  const raw = rawValue(value);
  if (raw === null || raw === undefined || raw === '') return {
    raw: raw ?? null,
    known: true,
    time: '',
    rest: ''
  };
  const match = typeof raw === 'string' ? raw.trim().match(TIME_RE) : null;
  if (!match || normalizeTime(`${match[1]}:${match[2]}`) === null) return {
    raw,
    known: false,
    time: '',
    rest: ''
  };
  return {
    raw,
    known: true,
    time: `${match[1]}:${match[2]}`,
    rest: match[3] || ''
  };
} // The value to write for a time, against what the field held: {value} (null
// clears) or {error: 'timeInvalid'}. The same minute writes back the very
// text it read; a changed one keeps the stored shape (hh:mm:00 where the
// host stores seconds), and a new one is hh:mm.

function composeTime(original, text) {
  const time = normalizeTime(text);
  if (time === null) return {
    error: 'timeInvalid'
  };
  if (!time) return {
    value: null
  };
  const before = original?.known ? original : null;
  if (before && before.time === time) return {
    value: before.raw
  };
  return {
    value: before?.rest ? `${time}:00` : time
  };
}

/***/ },

/***/ "ab3947ea3647"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatDecimal: () => (/* binding */ formatDecimal),
/* harmony export */   formatMoney: () => (/* binding */ formatMoney),
/* harmony export */   formatPercent: () => (/* binding */ formatPercent),
/* harmony export */   fractionDigits: () => (/* binding */ fractionDigits),
/* harmony export */   moneyParts: () => (/* binding */ moneyParts),
/* harmony export */   readDecimal: () => (/* binding */ readDecimal)
/* harmony export */ });
/* harmony import */ var _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Decimal numbers as strings, never as floats (simai.property-view-port
// 1.18.0; Larena property types standard, notes of 2026-11-03: «Never a float
// on the wire»). What a person typed is read into a canonical decimal string,
// and a decimal, a money amount and a percent are shown in the page's language
// through Intl, which formats a string by its digits: «1500.10» never passes
// through a float on the way to «1 500,10 ₽». Pure, so the unit suite reads it
// without a browser; the View set draws the editors of money, percent and
// items with its own copy of the same rules.

const TYPED = /^([+-]?)(\d*)(?:[.,](\d*))?$/u; // Spaces a person or a formatter puts between groups of digits: the plain
// space, the no-break space and the narrow no-break space ru-RU writes, and
// the apostrophe some locales group with.

const GROUP_SPACES = /[\s  ']/gu;
/**
 * What a person typed, read as a decimal: `{ok: true, value}` with the
 * canonical string (an optional minus, the integer digits without leading
 * zeros, the fraction digits as typed; null for nothing typed), or
 * `{ok: false}` for text that is not a number. A comma and a point both
 * separate the fraction. A JSON integer is read as its digits; a float is not
 * a decimal and is refused rather than guessed at.
 */

function readDecimal(text) {
  if (text === null || typeof text === 'undefined') return {
    ok: true,
    value: null
  };

  if (typeof text === 'number') {
    return Number.isSafeInteger(text) ? {
      ok: true,
      value: String(text)
    } : {
      ok: false
    };
  }

  const plain = String(text).replace(GROUP_SPACES, '');
  if (plain === '') return {
    ok: true,
    value: null
  };
  const match = TYPED.exec(plain);
  if (!match) return {
    ok: false
  };
  const [, sign, whole, fraction] = match;
  if (whole === '' && (fraction ?? '') === '') return {
    ok: false
  };
  const integer = whole.replace(/^0+(?=\d)/u, '') || '0';
  const digits = fraction ?? '';
  const zero = /^0*$/u.test(integer + digits);
  return {
    ok: true,
    value: `${sign === '-' && !zero ? '-' : ''}${integer}${digits ? `.${digits}` : ''}`
  };
}
/** How many digits a canonical decimal string has after its point. */

function fractionDigits(value) {
  const at = String(value ?? '').indexOf('.');
  return at === -1 ? 0 : String(value).length - at - 1;
} // A float a host sent anyway is shown, not refused: a cell is not the place to
// argue with a stored value. Only what reads as a decimal is formatted.

function decimalOf(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : null;
  const read = readDecimal(value);
  return read.ok ? read.value : null;
}
/** A decimal string in the locale's digits, with every digit it has: «1 500,5». */


function formatDecimal(value, locale) {
  const decimal = decimalOf(value);
  if (decimal === null) return '';
  const digits = Math.min(20, fractionDigits(decimal));
  return (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(decimal);
}
/** A money value as {amount, currency}; a field that fixes the currency takes a bare amount. */

function moneyParts(value, fixed) {
  const currency = typeof fixed === 'string' && fixed ? fixed : null;

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      amount: value.amount ?? null,
      currency: currency || (value.currency ?? null)
    };
  }

  if (value === null || typeof value === 'undefined' || value === '') return {
    amount: null,
    currency
  };
  return {
    amount: value,
    currency
  };
}
/**
 * An amount with its currency, as a person reads it: «1 500,50 ₽», «$1,500.50».
 * The digits after the point are at least the currency's minor units (ISO
 * 4217) and every digit the amount has. Without a currency, the amount alone.
 */

function formatMoney(value, field = {}, locale = 'en') {
  const {
    amount,
    currency
  } = moneyParts(value, field.currency);
  const decimal = decimalOf(amount);
  if (decimal === null) return '';
  if (!currency) return formatDecimal(decimal, locale);
  const minor = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    style: 'currency',
    currency
  }).resolvedOptions().maximumFractionDigits ?? 2;
  const digits = Math.min(20, Math.max(minor, fractionDigits(decimal)));
  return (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(decimal);
}
/** A percent, «12,5 %» or «12.5%»: the value is the percent ("20" is 20 %), never the share. */

function formatPercent(value, locale = 'en') {
  const decimal = decimalOf(value);
  if (decimal === null) return '';
  const digits = Math.min(20, fractionDigits(decimal));
  return (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    style: 'unit',
    unit: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(decimal);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "01ae054f01b4"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cleanHtml: () => (/* binding */ cleanHtml),
/* harmony export */   htmlText: () => (/* binding */ htmlText)
/* harmony export */ });
/* harmony import */ var _input_rich_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4f56033a1eae");
// Formatted text (property-view port 1.17.0, propertyType `html`; Larena,
// 2026-10-30): a value that is an HTML string of sf-input-rich's subset. The
// subset's rule is sf-input-rich's own module, not a second one written here:
// what the editor writes and what a record shows are cleaned by the same
// function, so the two cannot disagree about what a value may hold.
//
// A value is never drawn as it arrives. The host's value may have been stored
// by something other than this editor -- an import, an API, an older site --
// so the view draws only what `cleanHtml` returns, and a table cell draws only
// the text. Both take any value: a string, {value, text} as a host formats a
// scalar, or nothing.


const source = value => {
  const raw = value && typeof value === 'object' && !Array.isArray(value) && 'value' in value ? value.value : value;
  return typeof raw === 'string' ? raw : '';
};
/** The value in the subset: everything else removed, every text escaped; "" when there is no text. */


function cleanHtml(value) {
  const html = source(value);
  return html ? (0,_input_rich_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_0__.sanitizeRichText)(html, {
    mode: 'value'
  }) : '';
}
/** The value's visible text on one line, for a table cell: blocks and line breaks become spaces. */

function htmlText(value) {
  const html = source(value);
  return html ? (0,_input_rich_js_rich_text_html_mjs__WEBPACK_IMPORTED_MODULE_0__.plainText)(html).replace(/\s+/gu, ' ').trim() : '';
}

/***/ },

/***/ "e5483002f3ea"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FILTER_RENDERERS: () => (/* binding */ FILTER_RENDERERS),
/* harmony export */   PROPERTY_TYPES: () => (/* reexport safe */ _registry_js__WEBPACK_IMPORTED_MODULE_4__.PROPERTY_TYPES),
/* harmony export */   propertyModes: () => (/* binding */ propertyModes),
/* harmony export */   renderCellField: () => (/* binding */ renderCellField),
/* harmony export */   renderEditField: () => (/* binding */ renderEditField),
/* harmony export */   renderFilterField: () => (/* binding */ renderFilterField),
/* harmony export */   renderViewField: () => (/* binding */ renderViewField)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("073f05ff1a81");
/* harmony import */ var _helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("b30ec5bc0edb");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _registry_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("fc654eb7fab0");
/* harmony import */ var _datetime_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("9ce1a42b2a85");
/* harmony import */ var _mask_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("dd6973f77245");
/* harmony import */ var _html_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("01ae054f01b4");
/* harmony import */ var _decimal_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("ab3947ea3647");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _decimal_js__WEBPACK_IMPORTED_MODULE_8__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _decimal_js__WEBPACK_IMPORTED_MODULE_8__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);








 // The Framework's field renderers, addressed by a property type and a template
// rather than by a control name.
//
// Larena asked for one set of renderers shared by the record view and the
// table's cells (their request of 2026-10-05, part B6). The Framework already
// had type-aware rendering in exactly one place -- the table's filter controls
// -- and a second map would have drifted from it, so this module is that map
// with the filter controls moved into it unchanged. The table now asks the set
// instead of answering itself.
//
// The renderers take a host rather than `this`: a small interface the caller
// implements, so the same function serves a table's filter window, a record
// view and anything else that renders a field.
//
//   getFilterControlValue(key)            the value a control shows
//   patchTempFilterValue(key, patch)      the value a control writes
//   getFilterOperatorLabel(operator)      the word for an operator
//   getFilterOptionSearch(key)            what is typed in an option search
//   patchTempFilterOptionSearch(key, s)   what that search writes
//   getVisibleFilterOptions(field)        the options to draw
//   renderFilterOption(field, option)     one option row
//   getEndpointFilterPage(field)          the page of options a host returned
//   loadEndpointFilterPage(field, cursor, search)   ask the host for a page
//
// Every prop below names the axis it answers -- appearance, status, kind -- and
// never `type`, which contracts/public-api-axes.json retires. The names were
// read from each component's description rather than from the property's name:
// `size` on sf-file-preview is the file's size as text, not a rung of the
// ladder, and `type` on sf-list-item answers `kind` while on sf-input it
// answers `appearance`.
// The filter controls take the size of the list they filter: the table's
// size, when it has one. They were written at 1, so a table at the dense
// step 1/2 opened filter fields, buttons and tabs a step larger than itself.

function filterSize(host) {
  const size = String(host?.size || '').trim();
  return size || '1';
}

function renderTextFilterControl(field, host) {
  const value = host.getFilterControlValue(field.key);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${filterSize(host)}
                appearance="filled"
                placeholder="${setText(host, 'containsText')}"
                value="${value.value || ''}"
                name="sf_filter_${field.key || 'text'}"
                @change=${event => {
    host.patchTempFilterValue(field.key, {
      value: event.target?.value || '',
      operator: value.operator || field.filter?.defaultOperator || 'contains'
    });
  }}
        ></sf-input>
    `;
}

function renderRangeFilterControl(field, host) {
  const control = host.getFilterControlValue(field.key);
  const operators = field.filter?.operators || ['eq'];
  const selectedOperator = control.operator || field.filter?.defaultOperator || operators[0];
  const isBetween = selectedOperator === 'between';
  const rangeValue = isBetween ? control.value : Array.isArray(control.value) ? control.value[0] : control.value;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex gap-1/3 flex-col">
            <div class="sf-filter-operator-range flex gap-1/3 items-cross-center">
                <sf-slider-range
                        id="smart-range-slider-single"
                        min="0"
                        label="tooltip"
                        suffix="%"
                        max="100"
                        multiple=${String(isBetween)}
                        .value=${rangeValue}
                        @onSliderEnd=${e => {
    host.patchTempFilterValue(field.key, {
      value: isBetween ? e.detail.values || [] : e.detail.value,
      operator: selectedOperator
    });
  }}
                ></sf-slider-range>
            </div>
            <sf-dropdown
                    size=${filterSize(host)}
                    appearance="outlined"
                    mode="select"
                    placeholder="${setText(host, 'operator')}"
                    root-class="flex-1"
                    search="false"
                    @change=${event => {
    const operator = event.detail?.values?.[0] || event.detail?.value || selectedOperator;
    host.patchTempFilterValue(field.key, {
      operator
    });
  }}
            >
                ${operators.map(operator => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-list-item
                            kind="text"
                            size=${filterSize(host)}
                            text="${host.getFilterOperatorLabel(operator)}"
                            value="${operator}"
                            ?selected=${operator === selectedOperator}
                    ></sf-list-item>
                `)}
            </sf-dropdown>
        </div>
    `;
}

function renderNumberFilterControl(field, host) {
  const control = host.getFilterControlValue(field.key);
  const operators = field.filter?.operators || ['eq'];
  const selectedOperator = control.operator || field.filter?.defaultOperator || operators[0];
  const isBetween = selectedOperator === 'between';
  const rawValue = control.value;
  const rangeValue = Array.isArray(rawValue) ? rawValue : [rawValue || '', ''];

  const patchNumberValue = (index, nextInputValue) => {
    if (!isBetween) {
      host.patchTempFilterValue(field.key, {
        value: nextInputValue || '',
        operator: selectedOperator
      });
      return;
    }

    const nextValue = [...rangeValue];
    nextValue[index] = nextInputValue || '';
    host.patchTempFilterValue(field.key, {
      value: nextValue,
      operator: selectedOperator
    });
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex gap-1/3 flex-col">
            <div class="sf-filter-operator-inputs flex gap-1/3 items-cross-center">
                <sf-input
                        size=${filterSize(host)}
                        appearance="bordered"
                        root-class="flex-1 min-w-0"
                        label="${isBetween ? setText(host, 'rangeFrom') : host.getFilterOperatorLabel(selectedOperator)}"
                        value="${isBetween ? rangeValue[0] || '' : rawValue || ''}"
                        name="sf_filter_${field.key || 'number'}"
                        @change=${event => {
    patchNumberValue(0, event.target?.value);
  }}
                ></sf-input>
                ${isBetween ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-input
                            size=${filterSize(host)}
                            appearance="bordered"
                            label="${setText(host, 'rangeTo')}"
                            root-class="flex-1 min-w-0"
                            value="${rangeValue[1] || ''}"
                            name="sf_filter_${field.key || 'number'}_second"
                            @change=${event => {
    patchNumberValue(1, event.target?.value);
  }}
                    ></sf-input>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            <sf-dropdown
                    size=${filterSize(host)}
                    appearance="outlined"
                    mode="select"
                    placeholder="${setText(host, 'operator')}"
                    root-class="flex-1"
                    search="false"
                    @change=${event => {
    const operator = event.detail?.values?.[0] || event.detail?.value || selectedOperator;
    host.patchTempFilterValue(field.key, {
      operator
    });
  }}
            >
                ${operators.map(operator => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-list-item
                            kind="text"
                            size=${filterSize(host)}
                            text="${host.getFilterOperatorLabel(operator)}"
                            value="${operator}"
                            ?selected=${operator === selectedOperator}
                    ></sf-list-item>
                `)}
            </sf-dropdown>
        </div>
    `;
}

function renderDateFilterControl(field, host) {
  const control = host.getFilterControlValue(field.key);
  const operators = field.filter?.operators || ['eq'];
  const selectedOperator = control.operator || field.filter?.defaultOperator || operators[0];
  const isBetween = selectedOperator === 'between';
  const dateValue = isBetween && Array.isArray(control.value) ? control.value : isBetween ? ['', ''] : control.value || '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex flex-col gap-1/3">
            <sf-input-date
                    .value=${dateValue}
                    ?range=${isBetween}
                    name="sf_filter_${field.key || 'date'}"
                    locale="ru-Ru"
                    @change=${event => {
    host.patchTempFilterValue(field.key, {
      value: event.detail.value,
      operator: selectedOperator
    });
  }}
            ></sf-input-date>
            <sf-dropdown
                    size=${filterSize(host)}
                    appearance="outlined"
                    mode="select"
                    placeholder="${setText(host, 'operator')}"
                    root-class="flex-1"
                    search="false"
                    @change=${event => {
    const operator = event.detail?.values?.[0] || event.detail?.value || selectedOperator;
    host.patchTempFilterValue(field.key, {
      operator
    });
  }}
            >
                ${operators.map(operator => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-list-item
                            kind="text"
                            size=${filterSize(host)}
                            text="${host.getFilterOperatorLabel(operator)}"
                            value="${operator}"
                            ?selected=${operator === selectedOperator}
                    ></sf-list-item>
                `)}
            </sf-dropdown>
        </div>
    `;
}

function renderMultiSelectFilterControl(field, host) {
  const endpointPage = host.getEndpointFilterPage(field);
  const options = host.getVisibleFilterOptions(field);
  const value = host.getFilterControlValue(field.key);
  const search = host.getFilterOptionSearch(field.key);
  const selected = new Set(value.values || []); // A list of options scrolls down, never sideways: a checkbox's ring a pixel
  // or two past the edge drew a horizontal bar under the list (owner,
  // 2026-10-15).

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex flex-col gap-1/2 overflow-x-hidden">
            ${field.filter?.searchable && (!endpointPage || endpointPage.searchable) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-input
                        size=${filterSize(host)}
                        appearance="filled"
                        placeholder="${setText(host, 'searchInList')}"
                        value="${search}"
                        name="sf_filter_${field.key || 'list'}_search"
                        @input=${event => {
    host.patchTempFilterOptionSearch(field.key, event.target?.value || '');
  }}
                        @change=${event => {
    host.patchTempFilterOptionSearch(field.key, event.target?.value || '');
  }}
                ></sf-input>
            ` : ''}
            <div class="flex flex-col gap-1/2 overflow-x-hidden" data-size="4.5">
                ${options.map(option => host.renderFilterOption(field, option, selected))}
            </div>
            ${!options.length && endpointPage?.status !== 'loading' && endpointPage?.status !== 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <!-- A list with nothing in it says why, in one line, as every
                     list does (simai.interaction-rules, five states). -->
                <sf-empty-state layout="inline" size="1/2" kind=${search ? 'nothing-found' : 'no-data'}></sf-empty-state>` : ''}
            ${endpointPage ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div role="status" aria-live="polite" class="sf-text-1">
                    ${endpointPage.status === 'loading' ? setText(host, 'loadingOptions') : ''}
                </div>
                ${endpointPage.status === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-empty-state layout="inline" size="1/2" kind="error" text=${setText(host, 'optionsError')}
                    @sf-empty-state-action=${event => {
    if (event.detail?.id === 'retry') host.loadEndpointFilterPage(field, null, search);
  }}></sf-empty-state>` : ''}
                ${endpointPage.nextCursor && endpointPage.status !== 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button appearance="outline" size=${filterSize(host)} text="${setText(host, 'loadMore')}"
                    ?disabled=${endpointPage.status === 'loading'}
                    @click=${() => host.loadEndpointFilterPage(field, endpointPage.nextCursor, search)}></sf-button>` : ''}
            ` : ''}
        </div>
    `;
}

function renderEntityMultiSelectFilterControl(field, host) {
  // The host travels with the call. It was lost here when these functions were
  // moved out of the table: as a method, `this.renderMultiSelectFilterControl(field)`
  // carried the receiver by itself, and as a function it has to be handed on.
  // The source suite renders no entity control, so nothing in it noticed; the
  // filter-endpoint probe did, with "Cannot read properties of undefined".
  return renderMultiSelectFilterControl(field, host);
} // The filter template, addressed by the property type. The nine control names
// the table used are kept as aliases of the types they serve, so a host that
// declares a control by name keeps working while a host that declares a
// property type gets the same renderer.
// A file is filtered by its kind, a colour by the field's palette (owner,
// 2026-10-15): both fell back to a text search. The filter's values are the
// kinds -- image, document, archive, other -- or the colours, with the
// operator «in»; what a kind holds is the host's to say.


function renderFileFilterControl(field, host) {
  const options = field.filter?.options ?? ['image', 'document', 'archive', 'other'].map(kind => ({
    value: kind,
    label: setText(host, `fileKind_${kind}`)
  }));
  return renderMultiSelectFilterControl({ ...field,
    filter: { ...(field.filter || {}),
      options,
      defaultOperator: field.filter?.defaultOperator ?? 'in'
    }
  }, host);
}

function renderColorFilterControl(field, host) {
  const palette = field.filter?.options ?? (Array.isArray(field.swatches) ? field.swatches : []).map(swatch => typeof swatch === 'string' ? {
    value: swatch,
    label: swatch
  } : swatch).filter(swatch => swatch?.value).map(swatch => ({
    value: swatch.value,
    label: swatch.label ?? swatch.value,
    color: swatch.value
  })); // No palette, nothing to choose from: the value is searched as text.

  if (!palette.length) return renderTextFilterControl(field, host);
  return renderMultiSelectFilterControl({ ...field,
    filter: { ...(field.filter || {}),
      options: palette,
      optionRenderer: field.filter?.optionRenderer ?? 'swatch',
      defaultOperator: field.filter?.defaultOperator ?? 'in'
    }
  }, host);
}

const FILTER_RENDERERS = {
  text: renderTextFilterControl,
  string: renderTextFilterControl,
  number: renderNumberFilterControl,
  integer: renderNumberFilterControl,
  date: renderDateFilterControl,
  datetime: renderDateFilterControl,
  range: renderRangeFilterControl,
  'date-range': renderDateFilterControl,
  'multi-select': renderMultiSelectFilterControl,
  'single-select': renderMultiSelectFilterControl,
  choice: renderMultiSelectFilterControl,
  choices: renderMultiSelectFilterControl,
  boolean: renderMultiSelectFilterControl,
  user: renderMultiSelectFilterControl,
  'entity-multi-select': renderEntityMultiSelectFilterControl,
  'entity-single-select': renderEntityMultiSelectFilterControl,
  record: renderEntityMultiSelectFilterControl,
  relation: renderEntityMultiSelectFilterControl,
  lookup: renderEntityMultiSelectFilterControl,
  file: renderFileFilterControl,
  color: renderColorFilterControl,
  // The types a component set draws (property-view port 1.18.0): a money
  // amount and a percent are filtered as numbers (the host compares the
  // amount, as a decimal), and an items field by its number of rows.
  money: renderNumberFilterControl,
  percent: renderNumberFilterControl,
  items: renderNumberFilterControl
}; // What a field asks to be filtered by: its own declared control if it has one,
// otherwise its property type, otherwise text.

function renderFilterField(field = {}, host) {
  const asked = field.filter?.control || field.propertyType || field.type || field.dataType || 'text';
  const renderer = FILTER_RENDERERS[asked] || FILTER_RENDERERS.text;
  return renderer(field, host);
} // The cell template. A cell is text unless the Framework has a component that
// says more than the text would, and the set renders one only when it can state
// the shape the value must have. Anything else falls back to the value itself,
// so a host that stores a plain string keeps seeing a plain string.
//
// The value shapes are the consumer's, agreed with Larena on 2026-10-06: a
// renderer cannot turn an opaque reference into a name, and resolving one needs
// an access check, so the host sends what it has resolved.
//
//   choice              a value matching one of the column's options
//   integer / number    a number, and with the `scale` variant a number 0..100
//   boolean             true or false
//   user                {value, label, avatarText}
//   record / relation   {value, label, href?} -- href only when it may be opened
//   lookup              {value, label}, or a list of them when multiple; the
//                       labels on one line
//   file                {value, label, mime?, href?} -- an icon from the mime
//                       type and the label, a link when it may be opened
//   choices             a list of option values; one tag per value on the line
//   html                an HTML string of sf-input-rich's subset; its text, on one line
//
// Every element here takes `line`, not `size`: a line element is the row's text
// line, where a control height would make the row grow. That was measured --
// with size-1/2 components a default row went from 57 to 61 on desktop and 45 to
// 51 on mobile.

const CELL_LINE = '1/2'; // A choice badge in a cell is tonal, not the filled default. sf-badges defaults
// appearance to `main`, so the cells shipped filled and the consumer's owner
// asked for the calmer one -- and a table row is the place for it: a column of
// filled badges reads as a column of buttons. A field may still ask for another
// of the three, which is the same arrangement as the boolean's words: the set
// carries a sensible default, not a decision nobody can change.
//
// It composes with colour rather than replacing it. A scheme name reaches the
// scheme's tonal badge; a hex colour already writes --sf-badge--background-color
// as a 24% mix and its own text colour, so the tint survives the appearance
// untouched. Both are measured on the built bytes.

const CELL_BADGE_APPEARANCE = 'tonal'; // A file cell is a reference link with an icon chosen from the mime type: the
// consumer asked for an icon and the label and nothing else -- no size as text
// and no download button, which the record view will carry -- and the component
// that owns that shape already exists. sf-file-preview detects only image/*, so
// this small map lives here until a second caller needs it, which is the session
// that owns that component's own judgement.

const FILE_ICONS = [[/^image\//u, 'image'], [/^video\//u, 'movie'], [/^audio\//u, 'audiotrack'], [/^text\/(csv|tab-separated-values)$/u, 'table'], [/^text\//u, 'description'], [/pdf$/u, 'picture_as_pdf'], [/(zip|compressed|tar|rar|7z)/u, 'folder_zip'], [/(sheet|excel|spreadsheet)/u, 'table'], [/(word|document)$/u, 'description'], [/(presentation|powerpoint)/u, 'slideshow']];

function fileIcon(mime) {
  const value = String(mime || '').toLowerCase();
  const match = FILE_ICONS.find(([pattern]) => pattern.test(value));
  return match ? match[1] : 'attach_file';
} // A colour has the same four faces as every other property. It was absent while a
// running Larena site declares fourteen colours, so a theme colour had nowhere to
// be shown and nowhere to be changed.
//
// `inheritedValue` matters here as much as the value: the site's own colours are
// inherited from the theme until somebody chooses one, and a cell that drew the
// inherited colour as the value would say a record had decided something it had
// not.


function renderColorCell(field, value) {
  const hex = scalarValue(value);
  if (!hex) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // The component, not a span with classes of its own: the renderer set has no
  // stylesheet, so markup invented here would reach no rules at all -- and a
  // colour should look the same in a cell as it does in a card, which is what a
  // general part is for.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-color size="1/2" appearance="plain" value=${String(hex)}
                  label=${field.label || field.key || ''} disabled></sf-input-color>
    `;
} // Reads what port 1.8.0 declares: `inherited` says a value comes from somewhere
// else, `inheritedValue` says what it is. A view that drew the inherited colour as
// the value would make «not set» and «set to the same colour» look identical, and
// only the first follows the theme when the theme moves.


function renderColorView(field, value) {
  const hex = scalarValue(value);
  const inherited = field.inheritedValue ?? '';
  if (!hex && !inherited) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-color
                size="1"
                appearance="plain"
                value=${hex ? String(hex) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                inherited-value=${inherited ? String(inherited) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                label=${field.label || field.key || ''}
                disabled
        ></sf-input-color>
    `;
}

function renderColorEdit(field, value, host) {
  const hex = scalarValue(value);
  const inherited = field.inheritedValue ?? '';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-color
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${hex ? String(hex) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                inherited-value=${inherited ? String(inherited) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                swatches=${field.swatches ? String(field.swatches) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?clearable=${Boolean(inherited) || field.required !== true}
                ?disabled=${field.readonly === true}
                label=${field.label || field.key || ''}
                @change=${event => host.setFieldValue(field, event.detail?.value ?? '')}
        ></sf-input-color>
    `;
}

function renderFileCell(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return null; // A column the host says holds images shows each as a thumbnail; any other
  // file as a tile with its extension. Which files are images is the host's
  // to say through the variant, never guessed from a name.

  if (isImageField(field)) return renderFilePreviewCell(value);
  return {
    component: {
      type: 'reference-link',
      props: {
        line: CELL_LINE,
        label: String(value.label),
        icon: fileIcon(value.mime),
        ...(value.href ? {
          href: String(value.href)
        } : {})
      }
    }
  };
} // A file as a thumbnail on the row's line: the image when the host gave its
// address and its type is an image, the extension in a tile otherwise. It is
// sf-file-preview told to show nothing but its leading visual, so a file looks
// the same in a row as in the record that holds it.


function renderFilePreviewCell(value) {
  const mime = String(value.mime ?? value.mimeType ?? '');
  const image = Boolean(value.href) && /^image\//u.test(mime);
  return {
    component: {
      type: 'file-preview',
      props: {
        compact: true,
        fileName: String(value.label),
        mimeType: mime,
        icon: fileIcon(mime),
        ...(value.href ? {
          href: String(value.href)
        } : {}),
        ...(image ? {
          imageUrl: String(value.href),
          kind: 'image'
        } : {
          kind: 'icon'
        }),
        actions: false,
        downloadAction: false,
        removeAction: false
      }
    }
  };
} // Several values in one cell: one tag per value, each on the row's text line.
// The tag's `line` resolves its own size and inline mode, so neither is passed
// -- the session that owns it fixed the template to read the resolved values
// rather than the attributes, which is what makes that true.


function renderChoicesCell(field, value) {
  if (!Array.isArray(value) || !value.length) return null;
  if (String(field.variant ?? '') === 'badges') return renderChoicesBadgesCell(field, value);
  const options = field.options || field.filter?.options || field.constraints?.options;

  const label = item => {
    const option = Array.isArray(options) ? options.find(candidate => String(candidate?.value) === String(item)) : null;
    return String(option?.label ?? option?.text ?? item);
  };

  return value.map(item => ({
    component: {
      type: 'tag',
      props: {
        line: CELL_LINE,
        kind: 'default',
        text: label(item)
      }
    }
  }));
} // Several values as tonal badges, each coloured by its option's scheme -- a
// page's publication in each language. A value may be {value, text}: the host
// says more in that one cell than the option's label («ru · 14.10 09:00»), which
// is the host's to format, so the set does not.


function renderChoicesBadgesCell(field, value) {
  const options = field.options || field.filter?.options || field.constraints?.options;
  return value.map(item => {
    const key = item && typeof item === 'object' ? item.value : item;
    const option = Array.isArray(options) ? options.find(candidate => String(candidate?.value) === String(key)) : null;
    const badge = option ? (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionBadgeProps)(option) : null;
    const text = item && typeof item === 'object' && item.text !== undefined ? String(item.text) : String(option?.label ?? option?.text ?? key);
    return {
      component: {
        type: 'badge',
        props: {
          line: CELL_LINE,
          text,
          appearance: field.badgeAppearance ?? CELL_BADGE_APPEARANCE,
          ...(badge?.scheme ? {
            scheme: badge.scheme
          } : {}),
          ...(badge?.rootStyle ? {
            rootStyle: badge.rootStyle
          } : {})
        }
      }
    };
  });
}

const CELL_RENDERERS = {
  // A string is its own text in a row -- except a password, which is never
  // shown anywhere: a row says whether one is set.
  string: renderStringCell,
  // A date in a row used to be whatever the host had stored, printed --
  // «2026-09-25T07:12:00+03:00» beside the same value reading «25 сентября
  // 2026» in the record panel, with no way for a consumer to change the
  // first. These two ask the host and fall through to the stored value when
  // it has nothing to say.
  date: renderHostFormattedCell,
  datetime: renderHostFormattedCell,
  time: renderHostFormattedCell,
  boolean: renderBooleanCell,
  choices: renderChoicesCell,
  file: renderFileCell,
  color: renderColorCell,
  include: renderIncludeCell,
  choice: renderChoiceCell,
  integer: renderNumericCell,
  number: renderNumericCell,
  user: renderUserCell,
  record: renderReferenceCell,
  relation: renderReferenceCell,
  lookup: renderLookupCell,
  html: renderHtmlCell,
  money: renderMoneyCell,
  percent: renderPercentCell,
  items: renderItemsCell
}; // A consumer found this on their stand: the words were written into the set, so
// an English admin saw «Да». The set must not decide what a value is called in
// anyone's language. They come from the field, which is where the rest of the
// Framework keeps its text -- sf-view-table declares fourteen such inputs -- and the
// Russian stays only as the fallback, so nothing already published changes.
// The field's own words win, as they must: what «true» is called belongs to
// whoever owns the interface. The fallback used to be Russian whatever the page
// was -- an English admin saw «Да» -- so it follows the page's language now.

function booleanWords(field, host) {
  return {
    yes: field.trueText ?? field.labels?.true ?? setText(host, 'yes'),
    no: field.falseText ?? field.labels?.false ?? setText(host, 'no')
  };
}

function renderBooleanCell(field, value, host) {
  if (typeof value !== 'boolean') return null;
  const words = booleanWords(field, host);
  return value ? words.yes : words.no;
}

function renderChoiceCell(field, value) {
  const options = field.options || field.filter?.options || field.constraints?.options;
  if (!Array.isArray(options)) return null;
  const option = options.find(item => String(item?.value) === String(value));
  if (!option) return null;
  const badge = (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionBadgeProps)(option);
  return {
    component: {
      type: 'badge',
      props: {
        line: CELL_LINE,
        text: option.label ?? option.text ?? String(value),
        appearance: field.badgeAppearance ?? CELL_BADGE_APPEARANCE,
        ...(badge?.scheme ? {
          scheme: badge.scheme
        } : {}),
        ...(badge?.rootStyle ? {
          rootStyle: badge.rootStyle
        } : {})
      }
    }
  };
} // The scale is the `scale` variant of a number, and sf-progress-scale takes a
// value between 0 and 100 with no bounds of its own -- which is why the request
// asks for the variant on a field declaring exactly min 0 and max 100. A value
// outside that range is left as text rather than clamped: a clamped number is a
// wrong number drawn confidently.
// A cell the host has formatted. Null when it has not, so the value falls
// through to the plain one the table already prints: the set does not invent a
// format, and «798700» is a better answer than a thousands separator somebody
// did not ask for. What it does not do is leave a consumer no way to say
// «798 700 ₽» -- which was the state of a list until the host reached the cells.


function renderHostFormattedCell(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  return typeof formatted === 'string' && formatted !== '' ? formatted : null;
} // The types a component set draws (property-view port 1.18.0) have their
// cells here, so a table shows them wherever the set's editors live. A host's
// formatFieldValue wins, as for a date; otherwise the page's language:
//
//   money     {amount, currency} or a bare amount under a fixed `currency`;
//             «1 500,50 ₽», every digit the amount has and at least the
//             currency's minor units, formatted from the digits, never a float
//   percent   a decimal string of the percent, «12,5 %»
//   items     a list of rows; how many, «3 строки»
//
// A value that is not one of these shapes falls through to the plain value.


function renderMoneyCell(field, value, host) {
  const formatted = renderHostFormattedCell(field, value, host);
  if (formatted !== null) return formatted;
  const text = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_8__.formatMoney)(scalarValue(value), field, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null));
  return text || null;
}

function renderPercentCell(field, value, host) {
  const formatted = renderHostFormattedCell(field, value, host);
  if (formatted !== null) return formatted;
  const text = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_8__.formatPercent)(scalarValue(value), (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null));
  return text || null;
}

function renderItemsCell(field, value, host) {
  const formatted = renderHostFormattedCell(field, value, host);
  if (formatted !== null) return formatted;
  if (!Array.isArray(value)) return null;
  return value.length ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageWord)(SET_TEXT, 'rowCount', host ?? null, {
    component: SET_NAME,
    count: value.length
  }) : '';
}

function renderNumericCell(field, value, host) {
  const variant = field.variant || field.filter?.variant;
  const number = Number(scalarValue(value));

  if (variant !== 'scale' || !Number.isFinite(number)) {
    return renderHostFormattedCell(field, value, host);
  }

  if (number < 0 || number > 100) return null;
  return {
    component: {
      type: 'progress-scale',
      props: {
        line: CELL_LINE,
        value: String(number)
      }
    }
  };
} // A reference in a cell is a link and nothing else: the arrow a reference card
// carries said «goes somewhere» a second time beside a label that is already a
// link, and on a dense row it was the widest thing in the cell. Without an href
// the label is plain text -- a link that leads nowhere is not drawn as one.


function referenceLink(value) {
  return {
    component: {
      type: 'reference-link',
      props: {
        line: CELL_LINE,
        appearance: 'plain',
        icon: '',
        label: String(value.label),
        ...(value.href ? {
          href: String(value.href)
        } : {})
      }
    }
  };
} // A person: the avatar and the name, the name a link to the profile when the
// host gives its href.


function renderUserCell(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return null;
  return [{
    component: {
      type: 'avatar',
      props: {
        line: CELL_LINE,
        text: value.avatarText || ''
      }
    }
  }, value.href ? referenceLink(value) : String(value.label)];
}

function renderReferenceCell(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return null;
  return referenceLink(value);
} // A value from a reference list is its label, and several are their labels in
// a row: nothing opens from a country or a status, so there is no link to draw.


function renderLookupCell(field, value) {
  const items = lookupItems(field, value);
  return items.length ? items.map(item => item.label).join(', ') : null;
} // Formatted text in a row is its text, as a text cell is: the markup is for a
// record, and a row of headings and lists would not be a row. A string, so the
// table draws and cuts it exactly as it does any text value.


function renderHtmlCell(field, value) {
  return (0,_html_js__WEBPACK_IMPORTED_MODULE_7__.htmlText)(value) || null;
} // What a cell should hold for a field, in the same shape a host would pass: a
// string, an object with a component, or a list of those. Null means the value
// is better off as itself. Returning the host's own shape is deliberate -- the
// table renders it through the path it already had, so the set adds no second
// way to draw a cell.


function renderCellField(field = {}, value, host) {
  const asked = field.propertyType || field.type || field.dataType;
  const renderer = CELL_RENDERERS[asked];
  if (!renderer) return null; // `host` is for one thing, as in the view: formatFieldValue, where a
  // consumer's own formatting of a number or a date belongs. A cell had no way
  // to reach it, so a list could not be formatted at all while the record
  // panel beside it could.

  const rendered = renderer(field, value, host);
  return rendered === null || typeof rendered === 'undefined' ? null : rendered;
} // The edit template. A field being edited is a control of the form scale, not of
// a row: these take `size`, where the cell template takes `line`.
//
// The host supplies the value and takes the change, through two methods, because
// a renderer must not decide where a value lives:
//
//   getFieldValue(field)          what the control shows
//   setFieldValue(field, value)   what the control writes
//
// Every event bound here is `change`, and that is a rule now rather than a
// coincidence: contracts/public-api-axes.json `change_event` says every form
// value control reports a committed change as `change` on its host, once per
// change the user makes, with each older name kept as an alias the manifest
// marks `alias_of`. So the set binds the canonical name for all of them --
// sf-input, sf-textarea, sf-switch, sf-dropdown, sf-button-group and
// sf-datepicker -- where it bound three different alias names before. The one
// event this file still binds under its own name is sf-file-upload:select,
// which is not a value change but a selection; the `change` on that component
// is its inner input's.
// The size the controls are drawn at: 1, or 1/2 when the host asks for it
// with renderEditField(…, {size: '1/2'}) -- a record view beside a table at
// 1/2 read a step larger than it (owner, 2026-10-14). Set for the duration of
// one synchronous render.

let EDIT_SIZE = '1';
const EDIT_RENDERERS = {
  record: renderRecordPicker,
  relation: renderRecordPicker,
  user: renderRecordPicker,
  lookup: renderLookupEdit,
  string: renderTextEdit,
  text: renderTextAreaEdit,
  html: renderHtmlEdit,
  integer: renderNumberEdit,
  number: renderNumberEdit,
  date: renderDateEdit,
  datetime: renderDateTimeEdit,
  time: renderTimeEdit,
  boolean: renderBooleanEdit,
  choice: renderChoiceEdit,
  choices: renderChoicesEdit,
  file: renderFileEdit,
  color: renderColorEdit,
  include: renderIncludeEdit
};

function fieldName(field) {
  return `sf_field_${field.key || 'value'}`;
} // A telephone is a string with a shape, not a type of its own: the Framework
// already has a control that knows country codes, dial prefixes and masks, so a
// `string` whose variant is `phone` gets it and everything else about a string
// stays true. Counted on a running Larena site, which declares one.


function renderPhoneEdit(field, value, host) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-country
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                value=${scalarValue(value) ?? ''}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?disabled=${field.readonly === true}
                use-mask="true"
                show-code="true"
                @change=${event => host.setFieldValue(field, event.detail?.value ?? event.target?.value ?? '')}
        ></sf-input-country>
    `;
} // A password is a string the set never shows (owner, 2026-10-19; Larena's
// storage settings). The host never sends one: the value of a `password`
// variant is {set: true} or {set: false}, and null or an absent value reads as
// not set. View, cell and a read-only field say «задан» or «не задан» in the
// page's language and nothing else. A host that sends a string by mistake gets
// «задан» for it, and the string is still not drawn.
//
// The edit control starts empty whatever is stored, and it writes only what a
// person types: an untouched field calls nothing, so a save carries no value for
// it and can neither clear nor echo a password. Typing and then erasing writes
// `undefined` -- the person took the change back, and a host drops the key.
// Clearing a set password is not offered: an empty field means «keep».
//
// The typed text lives in the input and nowhere else: no `value` attribute on
// sf-input, no data-*, no text node, no log. «Показать пароль» is an icon button
// that switches the input's type and says what it will do next by its name and
// icon: «Показать пароль» (visibility) while hidden, «Скрыть пароль»
// (visibility_off) while shown. A toggle whose name changes is not a pressed
// toggle (rule C12, point 3): it carries no aria-pressed and no pressed look,
// or a reader would hear «Скрыть пароль, нажата». It changes the DOM directly,
// so a host's re-render (its attributes are static in the template) leaves the
// person's choice as it is.


function isPasswordField(field) {
  return String(field.variant ?? '') === 'password';
}

function passwordIsSet(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value.set === true;
  return typeof value === 'string' && value !== '';
}

function passwordState(host, value) {
  return setText(host, passwordIsSet(value) ? 'passwordSet' : 'passwordUnset');
}

function togglePasswordShown(event, host) {
  const button = event.currentTarget;
  const input = button?.closest?.('.sf-field-password')?.querySelector?.('sf-input');
  if (!input) return;
  const shown = input.getAttribute('input-type') !== 'text';
  input.setAttribute('input-type', shown ? 'text' : 'password');
  button.setAttribute('aria-label', setText(host, shown ? 'hidePassword' : 'showPassword'));
  button.setAttribute('icon', shown ? 'visibility_off' : 'visibility');
}

function renderPasswordEdit(field, value, host) {
  const set = passwordIsSet(value);
  const placeholder = field.placeholder || (set ? setText(host, 'passwordKeep') : '');

  const write = event => {
    const typed = event.target?.value ?? '';
    host.setFieldValue(field, typed === '' ? undefined : typed);
  }; // A set password is not required again: an empty field keeps it. Spellcheck
  // is off on the wrapper: the attribute is inherited, and sf-input does not
  // declare it (a shown password would otherwise be sent to a spellchecker).


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-password flex items-cross-center gap-1/3 min-w-0" spellcheck="false">
            <sf-input
                    size=${EDIT_SIZE}
                    appearance="bordered"
                    root-class="flex-1 min-w-0"
                    input-type="password"
                    autocomplete="new-password"
                    name=${fieldName(field)}
                    placeholder=${placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ?required=${Boolean(field.required) && !set}
                    aria-label=${field.label || field.key || ''}
                    @input=${write}
                    @change=${write}
            ></sf-input>
            <sf-button-icon
                    size=${EDIT_SIZE}
                    appearance="link"
                    scheme="on-surface"
                    icon="visibility"
                    aria-label=${setText(host, 'showPassword')}
                    @click=${event => togglePasswordShown(event, host)}
            ></sf-button-icon>
        </span>
    `;
}

function renderStringCell(field, value, host) {
  return isPasswordField(field) ? passwordState(host, value) : null;
}

function renderStringView(field, value, host) {
  if (isPasswordField(field)) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${passwordState(host, value)}</span>`;
  return renderTextView(field, value, host);
} // A file shown as what it is. The site keeps logos, so a file whose variant says
// image is drawn as the image rather than as a row with a paperclip -- the same
// stored file, told apart by the host rather than guessed from a file name.


const IMAGE_VARIANTS = new Set(['image', 'image-card', 'image-list']);

function isImageField(field) {
  return IMAGE_VARIANTS.has(String(field.variant ?? ''));
} // A block of text or code the host keeps in a file: six of them on a running
// Larena site -- scripts in the head, an included area. It is a property like any
// other, so it is shown and edited here rather than behind a separate screen.
//
// `language` is the host's, never guessed from the text: a component that decided
// a file was JavaScript because it saw a brace would be wrong about every template
// that contains one. Without a language it is plain text and says so by looking
// like text.
//
// No syntax colouring. That needs an editor component, which is its own part with
// its own decision; a monospace area that keeps indentation is honest, usable and
// does not pretend to be more.


function renderIncludeView(field, value) {
  const text = scalarValue(value);
  if (!text) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <pre class="sf-field-include" data-language=${field.language ? String(field.language) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}><code>${String(text)}</code></pre>
    `;
}

function renderIncludeEdit(field, value, host) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-textarea
                size=${EDIT_SIZE}
                appearance="bordered"
                class="sf-field-include-edit"
                name=${fieldName(field)}
                value=${scalarValue(value) ?? ''}
                rows="8"
                spellcheck="false"
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                ?disabled=${field.readonly === true}
                @change=${event => host.setFieldValue(field, event.target?.value ?? '')}
                @input=${event => host.setFieldValue(field, event.target?.value ?? '')}
        ></sf-input-textarea>
    `;
}

function renderIncludeCell(field, value) {
  const text = scalarValue(value);
  if (!text) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // One line in a cell: a script in a table row is a fact about the record, not
  // something to read there.

  const first = String(text).split('\n')[0];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<code>${first.length > 60 ? `${first.slice(0, 60)}…` : first}</code>`;
}

function renderTextEdit(field, value, host) {
  const mask = (0,_mask_js__WEBPACK_IMPORTED_MODULE_6__.maskPattern)(field);
  if (String(field.variant ?? '') === 'phone') return renderPhoneEdit(field, value, host);
  if (isPasswordField(field)) return renderPasswordEdit(field, value, host);
  if (mask) return renderMaskedEdit(field, value, host, mask);
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => host.setFieldValue(field, event.target?.value ?? '')}
                @change=${event => host.setFieldValue(field, event.target?.value ?? '')}
        ></sf-input>
    `;
} // A string typed through a mask (simai.property-view-port 1.16.0, field.mask;
// consumer simai.main, agreed contract q-b0de123841). The control is the stock
// sf-input with its own mask -- the Framework grammar, the same mask-pattern a
// page writes by hand -- so the typing, the caret and the fixed parts are the
// field's and nothing here formats a character.
//
// What the set adds is the one thing sf-input does not say: whether the text
// fills the pattern (./mask.js). The value written is the text as shown, fixed
// parts included («+7 (912) 345-67-89»): the host stores what it gets. Empty is
// not incomplete -- an optional masked field may be cleared, and writes null,
// or "" for a field that declares `nullable: false`. Required stays a mark: an
// empty required field is written as cleared and the host validates it.
//
// An incomplete text is not a value. The host hears it through the optional
// setFieldError(field, message) on every keystroke -- null once the text is
// complete or empty -- so a panel can hold both of its saves while any masked
// field in it is incomplete, each field on its own. The control marks itself
// invalid with the stock message only once the person leaves it (change):
// shouting «Заполните поле полностью» at the first digit of a phone would be
// an error for typing. A completed or cleared text takes the mark off at once.
//
// What is written while incomplete depends on the host. A host that hears
// errors gets the text as typed, because it re-renders with the value it was
// given and anything else would put an older text over the person's typing (a
// value attribute that moves is written into the input). A host that does not
// hear errors cannot hold a save, so the change is withdrawn with undefined,
// as the datetime pair does: what it saves is never the half-typed text.


function renderMaskedEdit(field, value, host, mask) {
  value = scalarValue(value);
  const cleared = field.nullable === false ? '' : null;

  const write = (event, left) => {
    const input = event.currentTarget;
    const text = String(input?.value ?? '');
    const state = (0,_mask_js__WEBPACK_IMPORTED_MODULE_6__.maskState)(text, mask);

    if (state === 'incomplete') {
      const message = setText(host, 'maskIncomplete');

      if (left && input) {
        input.setAttribute('error-message', message);
        input.toggleAttribute('invalid', true);
      }

      if (typeof host.setFieldError === 'function') {
        host.setFieldError(field, message);
        host.setFieldValue(field, text);
      } else {
        host.setFieldValue(field, undefined);
      }

      return;
    }

    if (input?.hasAttribute('invalid')) {
      input.toggleAttribute('invalid', false);
      input.removeAttribute('error-message');
    }

    host.setFieldError?.(field, null);
    host.setFieldValue(field, state === 'empty' ? cleared : text);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                autocomplete="off"
                mask
                mask-pattern=${mask}
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => write(event, false)}
                @change=${event => write(event, true)}
        ></sf-input>
    `;
}

function renderTextAreaEdit(field, value, host) {
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-textarea
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => host.setFieldValue(field, event.target?.value ?? '')}
                @change=${event => host.setFieldValue(field, event.target?.value ?? '')}
        ></sf-input-textarea>
    `;
} // Formatted text (property-view port 1.17.0): sf-input-rich, named as the
// textarea is. The editor cleans its own value -- what it is given, every
// paste and every edit -- so what it writes back is already the subset. The
// value is read from the element the listener is on: sf-input-rich says input
// and change from its editing surface inside it, which has no value of its own.


function renderHtmlEdit(field, value, host) {
  value = scalarValue(value);

  const write = event => host.setFieldValue(field, event.currentTarget?.value ?? '');

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-rich
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${typeof value === 'string' ? value : ''}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(field.required)}
                ?disabled=${EDIT_DISABLED}
                aria-label=${field.label || field.key || ''}
                @input=${write}
                @change=${write}
        ></sf-input-rich>
    `;
} // A number edited with steps (owner, 2026-10-25): an integer or a number whose
// variant is `stepper` gets sf-input-quantity -- «−» and «+», the arrow keys, the
// bounds the field names -- and every other number keeps the plain sf-input
// below. The bounds, the step and (for a number) the digits are the field's
// own keys, read by this variant alone: a renderer still does not enforce a
// constraint, the stepper only stops at it and the host validates the record.
//
// An integer has no digits after the point, whatever the field says. A number
// takes `precision`, else the digits its `step` implies, else two: a number
// field whose stepper could not take a decimal mark would be an integer field.
// The value goes out as the stepper's number, or null when the field is
// emptied; the panel prints the label, so the control takes it as its
// accessible name only.


function isStepperField(field) {
  return String(field.variant ?? '') === 'stepper';
}

function stepperNumber(raw) {
  if (raw === null || raw === undefined || raw === '') return '';
  const number = Number(raw);
  return Number.isFinite(number) ? String(number) : '';
}

function renderStepperEdit(field, value, host) {
  const decimal = (field.propertyType || field.type) === 'number';
  const step = stepperNumber(field.step);
  const precision = decimal ? stepperNumber(field.precision) || (step ? '' : '2') : '0';

  const write = event => host.setFieldValue(field, event.detail?.value ?? null);

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-quantity
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                value=${stepperNumber(scalarValue(value))}
                min=${stepperNumber(field.min) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                max=${stepperNumber(field.max) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                step=${step || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                precision=${precision || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?disabled=${field.readonly === true}
                @input=${write}
                @change=${write}
        ></sf-input-quantity>
    `;
} // A number is a decimal (property-view port 1.18.0: «never a float on the
// wire»). What is typed is read with a comma or a point and spaces between
// groups. A number field whose value arrives as a string, or that declares
// `precision`, is a decimal-string field: it writes the canonical decimal
// string («1500.50»), never a float, and refuses more digits after the point
// than `precision` allows. Any other number field writes a number, as before;
// an integer field is unchanged. Text that is not a number is reported as a
// masked string's incomplete entry is: through setFieldError, which holds the
// save, and under the field once the person leaves it.


function isDecimalStringField(field, value) {
  return (field.propertyType || field.type) === 'number' && (typeof value === 'string' || Number.isInteger(field.precision));
}

function renderNumberEdit(field, value, host) {
  if (isStepperField(field)) return renderStepperEdit(field, value, host);
  const decimal = (field.propertyType || field.type) === 'number';
  value = scalarValue(value);

  if (!decimal) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-input
                    size=${EDIT_SIZE}
                    appearance="bordered"
                    name=${fieldName(field)}
                    value=${value ?? ''}
                    inputmode="numeric"
                    ?required=${Boolean(field.required)}
                    aria-label=${field.label || field.key || ''}
                    @input=${event => {
      const next = event.target?.value ?? '';
      host.setFieldValue(field, next === '' ? null : Number(next));
    }}
                    @change=${event => {
      const next = event.target?.value ?? '';
      host.setFieldValue(field, next === '' ? null : Number(next));
    }}
            ></sf-input>
        `;
  }

  const asString = isDecimalStringField(field, value);

  const write = (event, left) => {
    const input = event.currentTarget ?? event.target;
    const text = String(input?.value ?? '');
    const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_8__.readDecimal)(text);
    let message = null;
    if (!read.ok) message = setText(host, 'notNumber');else if (read.value !== null && Number.isInteger(field.precision) && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_8__.fractionDigits)(read.value) > field.precision) {
      message = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageWord)(SET_TEXT, 'precisionMax', host ?? null, {
        component: SET_NAME,
        count: field.precision
      });
    }

    if (message) {
      if (left && input) {
        input.setAttribute('error-message', message);
        input.toggleAttribute('invalid', true);
      }

      if (typeof host.setFieldError === 'function') {
        host.setFieldError(field, message);
        host.setFieldValue(field, text);
      } else {
        host.setFieldValue(field, undefined);
      }

      return;
    }

    if (input?.hasAttribute?.('invalid')) {
      input.toggleAttribute('invalid', false);
      input.removeAttribute('error-message');
    }

    host.setFieldError?.(field, null);
    if (read.value === null) host.setFieldValue(field, null);else host.setFieldValue(field, asString ? read.value : Number(read.value));
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                inputmode="decimal"
                ?required=${Boolean(field.required)}
                aria-label=${field.label || field.key || ''}
                @input=${event => write(event, false)}
                @change=${event => write(event, true)}
        ></sf-input>
    `;
} // A date control has no clock. `sf-input-date` declares a format and a date,
// and its parser is anchored (`^\d{4}-\d{2}-\d{2}$`), so a datetime value
// falls through to a loose digit scan that reads `2026-11-27T13:26:00` as day
// 2026 of month 11 in year 27 -- an impossible date, which renders as an empty
// input. Split the value instead: the control edits the day, and the time the
// record already held is put back on the way out. Without that, editing the day
// of a datetime would write a value with the clock silently zeroed, which is
// worse than the empty control, because it looks like it worked. A `datetime`
// field has its own editor now (renderDateTimeEdit); this keeps the clock of a
// `date` field whose value carries one.


const DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?)(Z|[+-]\d{2}:?\d{2})?$/;

function splitDateTime(value) {
  const match = typeof value === 'string' ? value.trim().match(DATE_TIME_RE) : null;

  if (!match) {
    return {
      date: value,
      suffix: ''
    };
  }

  return {
    date: match[1],
    suffix: `T${match[2]}${match[3] || ''}`
  };
}

function renderDateEdit(field, value, host) {
  value = scalarValue(value);
  const {
    date,
    suffix
  } = splitDateTime(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-date
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                value=${date ?? ''}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                @change=${event => {
    const next = event.detail?.value ?? event.target?.value ?? null;
    host.setFieldValue(field, next && suffix ? `${next}${suffix}` : next);
  }}
        ></sf-input-date>
    `;
} // A datetime is edited as what it is: a day and a time of day. The date
// editor above edits the day alone and puts the record's clock back, so a new
// record could not get a time and «15.11.2026 10:30» typed nowhere was saved
// as «15.11.2026» (Larena acceptance, 2026-10-22). The set then drew a pair --
// sf-input-date for the day and an sf-input masked to hh:mm for the time --
// because the picker had no clock, and sf-view-properties drew the same pair
// itself (duplication audit A-14). sf-input-date has a time now (1.4.0,
// mode="datetime"), so a datetime is one control: the calendar with the time
// row under it, typed as «15.11.2026 10:30», at the field's size, named by the
// label.
//
// The value round trip (datetime.js): ISO 8601 with the time; an untouched
// field writes nothing; a changed day keeps the stored time below the minute
// and the zone; a changed time keeps the zone; a new value has no zone (the
// host's local time); a cleared field writes null; coming back to what was
// stored writes undefined -- no change. The control writes only whole values
// (a day always has a time, a typed text that is not one is put back), so no
// partial entry reaches the host. The day is bound as a property, so a
// re-render with the same value does not put back what the person cleared.
//
// min and max (an ISO date, or a date and a time) are the control's min-date
// and max-date; step is its minute step (1 to 60).


function minuteStepOf(field) {
  const step = Number(field.step);
  return Number.isInteger(step) && step >= 1 && step <= 60 ? String(step) : '';
}

function renderDateTimeEdit(field, value, host) {
  const stored = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_5__.splitDateTime)(value);
  const shown = stored.date ? `${stored.date}${stored.time ? `T${stored.time}` : ''}` : '';
  const min = typeof field.min === 'string' ? field.min : '';
  const max = typeof field.max === 'string' ? field.max : '';
  const step = minuteStepOf(field);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-date
                class="sf-field-datetime"
                mode="datetime"
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                .value=${shown}
                min-date=${min || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                max-date=${max || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                minute-step=${step || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                @change=${event => {
    // The picker's own change, not a native one from its field.
    if (event.target !== event.currentTarget) return;
    const [date = '', time = ''] = String(event.detail?.value ?? '').split('T');
    const result = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_5__.composeDateTime)(stored, {
      date,
      time
    });
    if (result.error) return;
    const same = result.value === null ? stored.known && !stored.date : result.value === stored.raw;
    host.setFieldValue(field, same ? undefined : result.value);
  }}
        ></sf-input-date>
    `;
} // A time of day (hh:mm, or hh:mm:ss as a host stores it) is sf-input-date in
// time mode: the time row alone, typed as «10:30». An unchanged minute writes
// nothing and keeps the stored seconds; min and max (hh:mm) are the control's
// min-time and max-time; step is its minute step.


function renderTimeEdit(field, value, host) {
  const stored = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_5__.splitTime)(value);
  const min = typeof field.min === 'string' ? field.min : '';
  const max = typeof field.max === 'string' ? field.max : '';
  const step = minuteStepOf(field);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-date
                class="sf-field-time"
                mode="time"
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                .value=${stored.time}
                min-time=${min || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                max-time=${max || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                minute-step=${step || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                @change=${event => {
    if (event.target !== event.currentTarget) return;
    const result = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_5__.composeTime)(stored, String(event.detail?.value ?? ''));
    if (result.error) return;
    const same = result.value === null ? stored.known && !stored.time : result.value === stored.raw;
    host.setFieldValue(field, same ? undefined : result.value);
  }}
        ></sf-input-date>
    `;
} // A required boolean is a switch: two states are all it has. An optional one is
// a pair of buttons with nothing chosen while the value is absent -- the
// consumer owner's decision of 2026-10-06, and the reason is that a switch
// cannot say «не задано»: rendering one over an absent value would write false
// on the first save, a value nobody chose.


function renderBooleanEdit(field, value, host) {
  const optional = field.required !== true;

  if (!optional) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-switch
                    size=${EDIT_SIZE}
                    name=${fieldName(field)}
                    ?checked=${value === true}
                    aria-label=${field.label || field.key || ''}
                    @change=${event => host.setFieldValue(field, Boolean(event.target?.checked))}
            ></sf-switch>
        `;
  }

  const words = booleanWords(field, host);
  const items = JSON.stringify([{
    value: 'yes',
    label: words.yes
  }, {
    value: 'no',
    label: words.no
  }]);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-button-group
                size=${EDIT_SIZE}
                items=${items}
                value=${value === true ? 'yes' : value === false ? 'no' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                @change=${event => {
    const next = event.detail?.value;
    host.setFieldValue(field, next === 'yes' ? true : next === 'no' ? false : null);
  }}
        ></sf-button-group>
    `;
}

function editOptions(field, value, multiple) {
  const options = field.options || field.filter?.options || field.constraints?.options || [];
  const chosen = multiple ? new Set((Array.isArray(value) ? value : []).map(item => String(item))) : new Set([String(value ?? '')]);
  return options.map(option => ({
    type: 'text',
    size: '1',
    text: option.label ?? option.text ?? String(option.value),
    value: String(option.value),
    selected: chosen.has(String(option.value))
  }));
} // A choice as buttons (simai.property-view-port 1.16.0, variant `buttons`;
// consumer simai.main, agreed contract q-b0de123841): one segmented
// sf-button-group, a button per option, for a short list a person reads at a
// glance -- a kind, a tier, a yes-no-maybe. The group is the stock one: Tab
// enters it, the arrows move and choose, Space and Enter choose, and it is a
// radiogroup to assistive technology. It wraps when it does not fit and is
// never replaced by a dropdown: a field that changes its control with the
// width of a window is two fields.
//
// `size` is the field's own step on the ladder ("1/2", "1", "2"), absent the
// panel's: the track of a segmented group is exactly as tall as an sf-button of
// the same size, so the buttons stand on the line the fields beside them do.
//
// The value is the option's own, in its own type -- the group speaks strings,
// so a chosen "2" is written back as the 2 the option carries -- or null.
// Pressing the chosen button again clears it when the field is not required;
// the group itself keeps a chosen button chosen (its select answers
// unchanged), so the press is read in the capture phase, before the group's
// own listener, where the value it is about to be compared with is still the
// one shown. A required field keeps the stock behaviour: the chosen button
// stays chosen.
//
// Read-only shows the chosen button chosen, in its own colours, and lets none
// be pressed: pointer events are off on the track and a key that would choose
// is stopped before the group hears it. Disabled is the group's own disabled,
// in the on-disable colours. The two are different facts -- «not yours to
// change» and «not available now» -- and drawn as the group draws them.


const CHOICE_BUTTON_SIZES = new Set(['1/2', '1', '2']);
const CHOOSING_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', ' ', 'Enter']);

function isChoiceButtons(field) {
  return String(field.variant ?? '') === 'buttons';
}

function renderChoiceButtons(field, value, host) {
  value = scalarValue(value);
  const options = (field.options || field.filter?.options || field.constraints?.options || []).filter(option => option && option.value !== null && option.value !== undefined && String(option.value) !== '');
  const items = options.map(option => ({
    value: String(option.value),
    label: String(option.label ?? option.text ?? option.value),
    ...(option.icon ? {
      icon: String(option.icon)
    } : {}),
    ...(option.disabled ? {
      disabled: true
    } : {})
  }));
  const asked = String(field.size ?? '');
  const size = CHOICE_BUTTON_SIZES.has(asked) ? asked : EDIT_SIZE;
  const disabled = EDIT_DISABLED;
  const locked = !disabled && field.readonly === true;
  const clearable = field.required !== true && !locked && !disabled;
  const chosen = value === null || value === undefined ? '' : String(value);

  const optionValue = text => options.find(option => String(option.value) === text)?.value ?? text;

  const press = {
    capture: true,

    handleEvent(event) {
      const group = event.currentTarget;
      const segment = event.target?.closest?.('[data-sf-button-group-value]');
      if (!group || !segment || !group.contains(segment)) return;

      if (locked) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (!clearable || segment.disabled) return;
      if (segment.getAttribute('data-sf-button-group-value') !== group.value) return;
      event.preventDefault();
      event.stopPropagation();
      group.clear?.();
    }

  };
  const keys = {
    capture: true,

    handleEvent(event) {
      if (!locked || !CHOOSING_KEYS.has(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
    }

  };
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-button-group
                class="sf-field-choice-buttons"
                appearance="segmented"
                size=${size}
                root-class=${locked ? 'flex-wrap pointer-event-none' : 'flex-wrap'}
                name=${fieldName(field)}
                items=${JSON.stringify(items)}
                value=${chosen || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?disabled=${disabled}
                data-readonly=${locked ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                @click=${press}
                @keydown=${keys}
                @change=${event => {
    const next = String(event.detail?.value ?? '');
    host.setFieldValue(field, next === '' ? null : optionValue(next));
  }}
        ></sf-button-group>
    `;
}

function renderChoiceEdit(field, value, host) {
  if (isChoiceButtons(field)) return renderChoiceButtons(field, value, host);
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                size=${EDIT_SIZE}
                appearance="outlined"
                mode="select"
                search="false"
                name=${fieldName(field)}
                ?required=${Boolean(field.required)}
                value=${value ?? ''}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                .options=${editOptions(field, value, false)}
                @change=${event => host.setFieldValue(field, event.detail?.value ?? null)}
        ></sf-dropdown>
    `;
} // A long list is chosen from as a checklist, not from a dropdown: a custom
// role's 137 rights in one dropdown were a scroll inside a scroll, and what was
// chosen could not be seen at once (Larena, 2026-10-17). The list stands in
// two columns where the field has the room for them and in one where it does
// not. `variant: 'checklist'` asks for it at any length; `variant: 'select'`
// keeps the dropdown at any length.


const CHECKLIST_FROM = 13;

function renderChoicesChecklist(field, value, host) {
  const options = field.options || field.filter?.options || field.constraints?.options || [];
  const chosen = new Set((Array.isArray(value) ? value : []).map(item => String(item)));

  const toggle = (option, on) => {
    const next = options.filter(candidate => String(candidate.value) === String(option.value) ? on : chosen.has(String(candidate.value))).map(candidate => candidate.value);
    host.setFieldValue(field, next);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-field-checklist grid gap-1/3 w-full min-w-0" role="group" aria-label=${field.label || field.key || ''}
             style="grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr))">
            ${options.map(option => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-checkbox size=${EDIT_SIZE}
                    name=${fieldName(field)} value=${String(option.value)}
                    label=${option.label ?? option.text ?? String(option.value)}
                    .checked=${chosen.has(String(option.value))}
                    @change=${event => toggle(option, Boolean(event.target?.checked ?? event.detail?.checked))}></sf-checkbox>`)}
        </div>
    `;
}

function renderChoicesEdit(field, value, host) {
  const options = field.options || field.filter?.options || field.constraints?.options || [];
  const variant = String(field.variant ?? '');

  if (variant === 'checklist' || variant !== 'select' && options.length >= CHECKLIST_FROM) {
    return renderChoicesChecklist(field, value, host);
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                size=${EDIT_SIZE}
                appearance="outlined"
                mode="select"
                multiple
                search="false"
                name=${fieldName(field)}
                ?required=${Boolean(field.required)}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                .options=${editOptions(field, value, true)}
                @change=${event => {
    const next = event.detail?.values ?? event.detail?.value;
    host.setFieldValue(field, Array.isArray(next) ? next : next ? [next] : []);
  }}
        ></sf-dropdown>
    `;
} // The record picker: what a record, a relation or a user is edited with.
//
// It is the entity-select the filter already has, pointed at records instead of
// options and holding one value rather than several. The three cases that break
// a picker are the ones it is built around, and the ones the probe measures
// against the consumer's 448-target field:
//
//   search   hundreds of targets never fit a list, so the search is the way in
//   paging   a page arrives with a cursor and the next is asked for
//   off-page the chosen record is usually not on the page in front of you, so
//            the picker shows what is chosen whether or not the page holds it
//
// The host does the fetching, because a page of records is a query with an
// access check, and the renderer must not make one:
//
//   getFieldOptionsPage(field)                  the page the host holds
//   loadFieldOptions(field, {cursor, search})   ask for a page
//   getFieldOptionSearch(field) / setFieldOptionSearch(field, text)
//
// The value is the resolved object the consumer sends: {value, label}. The
// picker writes the same shape back, so a host never has to re-resolve what it
// already knew.
// The text the set shows beyond a value: a status line, a retry, a load-more, a
// remove label. These belong to whoever owns the interface, not to the set, so
// the host supplies them and the Russian is only the fallback -- the same
// arrangement as `booleanWords`, and the same reason. A host that passes nothing
// keeps exactly what was published.


const SET_TEXT = {
  en: {
    yes: 'Yes',
    no: 'No',
    searchInList: 'Find in the list',
    // A text filter is a text the value contains, not a list to search.
    containsText: 'Contains…',
    fileKind_image: 'Images',
    fileKind_document: 'Documents',
    fileKind_archive: 'Archives',
    fileKind_other: 'Other files',
    operator: 'Operator',
    rangeFrom: 'From',
    rangeTo: 'To',
    loadingOptions: 'Loading the options',
    optionsError: 'The options could not be loaded',
    pickRecord: 'Choose a record',
    pickFromList: 'Choose from the list',
    searchRecords: 'Find a record',
    loadingRecords: 'Loading records',
    recordsError: 'The records could not be loaded',
    retry: 'Try again',
    loadMore: 'Load more',
    removeFile: 'Remove',
    passwordSet: 'Set',
    passwordUnset: 'Not set',
    passwordKeep: 'Set; type a new one to replace it',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    maskIncomplete: 'Complete the field',
    notNumber: 'Enter a number',
    precisionMax: 'At most {n} digits after the point',
    rowCount: {
      one: '{n} row',
      other: '{n} rows'
    }
  },
  ru: {
    yes: 'Да',
    no: 'Нет',
    searchInList: 'Найти в списке',
    containsText: 'Содержит…',
    fileKind_image: 'Изображения',
    fileKind_document: 'Документы',
    fileKind_archive: 'Архивы',
    fileKind_other: 'Прочие файлы',
    operator: 'Оператор',
    rangeFrom: 'От',
    rangeTo: 'До',
    loadingOptions: 'Загрузка вариантов',
    optionsError: 'Не удалось загрузить варианты',
    pickRecord: 'Выберите запись',
    pickFromList: 'Выберите из списка',
    searchRecords: 'Найти запись',
    loadingRecords: 'Загрузка записей',
    recordsError: 'Не удалось загрузить записи',
    retry: 'Повторить',
    loadMore: 'Загрузить ещё',
    removeFile: 'Удалить',
    passwordSet: 'Задан',
    passwordUnset: 'Не задан',
    passwordKeep: 'Задан; введите новый, чтобы заменить',
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',
    maskIncomplete: 'Заполните поле полностью',
    notNumber: 'Введите число',
    precisionMax: 'Не больше {n} знаков после запятой',
    rowCount: {
      one: '{n} строка',
      few: '{n} строки',
      many: '{n} строк',
      other: '{n} строки'
    }
  }
}; // The host's word wins, as it always did; the set's own fallback now follows
// the page's language instead of being Russian whatever the page is. `host` is
// the component that called the set, which is the node the rule reads from.
// The set is not an element, so it is named here rather than taken from the
// node: `host` is whichever component called it, and words registered for the
// set should apply wherever it draws rather than once per host.

const SET_NAME = 'sf-field-renderers';

function setText(host, key) {
  return host?.getFieldText?.(key) ?? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(SET_TEXT, key, host ?? null, SET_NAME);
}

function renderRecordPicker(field, value, host) {
  if (!host.loadFieldOptions || !host.getFieldOptionsPage) return null;
  const page = host.getFieldOptionsPage(field) || null; // A host that refused this field's candidates has none to give, now or ever.
  // Returning nothing here puts the field on the read-only fallback, which shows
  // the value it holds -- rather than an empty picker and a retry that cannot
  // succeed, over a value that is actually there.

  if (page?.status === 'unsupported') return null;
  const search = host.getFieldOptionSearch?.(field) ?? '';
  const chosen = value && typeof value === 'object' ? value : null;
  const items = Array.isArray(page?.items) ? page.items : []; // What is chosen stays in the list even when the page does not hold it --
  // the common case at 448 targets, and the one that makes a picker look like
  // it has forgotten the answer.

  const options = [...(chosen && !items.some(item => String(item.value) === String(chosen.value)) ? [chosen] : []), ...items].map(item => ({
    type: 'text',
    size: '1',
    text: String(item.label ?? item.value),
    value: String(item.value),
    selected: Boolean(chosen && String(chosen.value) === String(item.value))
  }));

  const pick = next => {
    if (!next) {
      host.setFieldValue(field, null);
      return;
    }

    const found = [chosen, ...items].find(item => item && String(item.value) === String(next));
    host.setFieldValue(field, found ? {
      value: found.value,
      label: found.label
    } : {
      value: next
    });
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-field-picker flex flex-col gap-1/3" data-field-picker=${field.key || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <sf-dropdown
                    size=${EDIT_SIZE}
                    appearance="outlined"
                    mode="select"
                    search="true"
                    name=${fieldName(field)}
                    ?required=${Boolean(field.required)}
                    value=${chosen ? String(chosen.value) : ''}
                    placeholder=${field.placeholder || setText(host, 'pickRecord')}
                    search-placeholder=${field.searchPlaceholder || setText(host, 'searchRecords')}
                    aria-label=${field.label || field.key || ''}
                    .options=${options}
                    @change=${event => pick(event.detail?.value ?? null)}
                    @input=${event => {
    const text = event.target?.value ?? '';
    host.setFieldOptionSearch?.(field, text);
    host.loadFieldOptions(field, {
      cursor: null,
      search: text
    });
  }}
            ></sf-dropdown>
            ${page ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-field-picker-state flex items-cross-center gap-1/3">
                    <div role="status" aria-live="polite" class="sf-text-1">
                        ${page.status === 'loading' && !page.quiet ? setText(host, 'loadingRecords') : page.status === 'error' ? setText(host, 'recordsError') : ''}
                    </div>
                    ${page.status === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button appearance="outline" size="1" text=${setText(host, 'retry')}
                                @click=${() => host.loadFieldOptions(field, {
    cursor: null,
    search
  })}
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${page.nextCursor && page.status !== 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button appearance="outline" size="1" text=${setText(host, 'loadMore')}
                                ?disabled=${page.status === 'loading'}
                                @click=${() => host.loadFieldOptions(field, {
    cursor: page.nextCursor,
    search
  })}
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>
            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // The lookup: a value chosen from a reference list the host keeps (Larena,
// 2026-10-23). It is the record picker's arrangement -- the host pages and
// searches, what is chosen stays shown whether or not the page holds it -- with
// the two things a reference list has that a record does not:
//
//   options   a short list arrives whole, as the field's own `options`, and is
//             chosen from in place: no page is asked for and the dropdown's own
//             search is right here, because the list in hand is the whole set.
//             A page is never searched in place -- it is not the whole set.
//   multiple  several values, each {value, label}, written back as a list.
//
// The value is {value, label}, or a list of them, and the control writes the
// same shape back: the label travels with the value so the host never resolves
// what it already knew, and a view of the value needs no second read.


function lookupItems(field, value) {
  const list = Array.isArray(value) ? value : [value];
  const options = Array.isArray(field.options) ? field.options : [];
  return list.filter(item => item !== null && typeof item !== 'undefined' && item !== '').map(item => {
    if (typeof item === 'object') return {
      value: item.value,
      label: String(item.label ?? item.value ?? '')
    }; // A bare value is read against the field's own list, so a host that
    // sends the inline options and the value alone is still shown a name.

    const option = options.find(candidate => String(candidate?.value) === String(item));
    return {
      value: item,
      label: String(option?.label ?? option?.text ?? item)
    };
  });
}

function renderLookupEdit(field, value, host) {
  const multiple = field.multiple === true;
  const inline = Array.isArray(field.options) && field.options.length > 0; // A list the host pages needs a host that pages; without one the field falls
  // back to its value, read-only, as a record does.

  if (!inline && (!host.loadFieldOptions || !host.getFieldOptionsPage)) return null;
  const page = inline ? null : host.getFieldOptionsPage(field) || null;
  if (page?.status === 'unsupported') return null;
  const search = inline ? '' : host.getFieldOptionSearch?.(field) ?? '';
  const chosen = lookupItems(field, value);
  const candidates = (inline ? field.options : Array.isArray(page?.items) ? page.items : []).filter(item => item && typeof item === 'object').map(item => ({
    value: item.value,
    label: String(item.label ?? item.text ?? item.value)
  }));

  const isChosen = item => chosen.some(one => String(one.value) === String(item.value));

  const options = [...chosen.filter(item => !candidates.some(candidate => String(candidate.value) === String(item.value))), ...candidates].map(item => ({
    type: 'text',
    size: '1',
    text: item.label,
    value: String(item.value),
    selected: isChosen(item)
  })); // What the dropdown reports is the value as a string; the label and the
  // value's own type are taken back from what was offered.

  const known = [...chosen, ...candidates];

  const resolve = raw => {
    const found = known.find(item => String(item.value) === String(raw));
    return found ? {
      value: found.value,
      label: found.label
    } : {
      value: raw,
      label: String(raw)
    };
  };

  const write = event => {
    if (multiple) {
      const next = event.detail?.values ?? event.detail?.value;
      const values = (Array.isArray(next) ? next : next ? [next] : []).filter(item => item !== '');
      host.setFieldValue(field, values.map(resolve));
      return;
    }

    const next = event.detail?.value ?? null;
    host.setFieldValue(field, next === null || next === '' ? null : resolve(next));
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-field-picker flex flex-col gap-1/3" data-field-picker=${field.key || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <sf-dropdown
                    size=${EDIT_SIZE}
                    appearance="outlined"
                    mode="select"
                    ?multiple=${multiple}
                    search="true"
                    name=${fieldName(field)}
                    ?required=${Boolean(field.required)}
                    value=${multiple ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : chosen[0] ? String(chosen[0].value) : ''}
                    placeholder=${field.placeholder || setText(host, 'pickFromList')}
                    search-placeholder=${field.searchPlaceholder || setText(host, 'searchInList')}
                    aria-label=${field.label || field.key || ''}
                    .options=${options}
                    @change=${write}
                    @input=${inline ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : event => {
    const text = event.target?.value ?? '';
    host.setFieldOptionSearch?.(field, text);
    host.loadFieldOptions(field, {
      cursor: null,
      search: text
    });
  }}
            ></sf-dropdown>
            ${page ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-field-picker-state flex items-cross-center gap-1/3">
                    <div role="status" aria-live="polite" class="sf-text-1">
                        ${page.status === 'loading' && !page.quiet ? setText(host, 'loadingOptions') : page.status === 'error' ? setText(host, 'optionsError') : ''}
                    </div>
                    ${page.status === 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button appearance="outline" size="1" text=${setText(host, 'retry')}
                                @click=${() => host.loadFieldOptions(field, {
    cursor: null,
    search
  })}
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${page.nextCursor && page.status !== 'error' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button appearance="outline" size="1" text=${setText(host, 'loadMore')}
                                ?disabled=${page.status === 'loading'}
                                @click=${() => host.loadFieldOptions(field, {
    cursor: page.nextCursor,
    search
  })}
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>
            ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // The `file` edit control, composed from the two halves that already exist:
// sf-file-preview for what is stored, sf-file-upload for what is arriving. They
// are not interchangeable and the split is not cosmetic -- the preview carries
// href, download and remove, the upload zone carries progress, retry and the
// selection itself. Neither renders the other's state, so a field that both
// holds files and accepts new ones needs both.
//
// sf-file-upload transfers no bytes. It selects files, keeps an `items` list of
// {state, progress, name, fileSize, errorMessage}, and emits events; the
// transfer is the host's, which is why this renderer asks the host for it
// rather than inventing an endpoint inside the set:
//
//   host.startFieldUpload(field, items)  -- begin transferring; the host writes
//                                           the stored value when a file lands
//   host.getFieldUploads(field)          -- the items in flight, upload-shaped
//   host.retryFieldUpload(field, index)  -- optional; without it, no retry
//   host.setFieldValue(field, next)      -- as every edit renderer
//
// Without the first two the zone is not rendered at all and the stored files
// stay editable, because removing a file that is already there needs no
// transfer. A zone that cannot upload is worse than no zone.
//
// `items` has one writer, and that is the host. The component fills its own
// list the moment files are chosen, but every render writes the host's list
// over it -- so a host that records what `startFieldUpload` was handed sees the
// files it selected, and a host that ignores them watches its own selection
// disappear on the next render. The selected items arrive already in the
// component's own shape, each carrying the real File in `.file`, so recording
// them is a push and not a conversion.


function storedFiles(value) {
  if (Array.isArray(value)) return value.filter(item => item && typeof item === 'object');
  return value && typeof value === 'object' ? [value] : [];
} // One image, edited in place (simai/ui-source#27). A `file` field whose
// variant is `image` and which holds one file -- a logo, a cover, the picture
// of a block -- is what sf-image-field is for: the thumbnail with the name and
// size, «Заменить…», «Убрать», and a file dropped on it replaces the image. The
// preview-and-zone pair below stays for everything else: a field the host
// declares `multiple`, a list that already holds several, the card and list
// variants, and a file that is not an image. Which fields are images is the
// host's to say through the variant, as in the view and the cell.
//
// sf-image-field transfers no bytes either. Its change carries the value in the
// file shape -- a chosen file with the File in `file` and an object URL in
// `href`, null after «Убрать» -- and that goes through setFieldValue as every
// other control's value does, so the record the host holds is what the person
// sees. A host that uploads (startFieldUpload) is handed the File as well, in
// an item carrying it in `.file` as the file control's selection does, and
// writes the stored value with its lasting address when the file lands. A
// value that came as a list of one goes back as a list, so a host reads back
// the shape it sent.
//
// The value is bound as a property, never as the attribute: the attribute is
// JSON, which a File does not survive, and a changed attribute releases the
// object URL the thumbnail is showing. The panel prints the label, so the field
// takes it as its accessible name only.


function isSingleImageField(field, value) {
  return String(field.variant ?? '') === 'image' && field.multiple !== true && storedFiles(value).length <= 1;
}

function renderImageEdit(field, value, host) {
  const stored = storedFiles(value)[0] ?? null;
  const asList = Array.isArray(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-image
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                accept=${field.accept ? String(field.accept) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                hint=${field.uploadSupportingText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                .value=${stored}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?disabled=${field.readonly === true}
                @change=${event => {
    const next = event.detail?.value ?? null;
    host.setFieldValue(field, asList ? next ? [next] : [] : next);
    const file = event.detail?.file;

    if (file && host.startFieldUpload) {
      host.startFieldUpload(field, [{
        name: file.name,
        state: 'process',
        progress: 0,
        file
      }]);
    }
  }}
        ></sf-input-image>
    `;
}

function renderFileEdit(field, value, host) {
  if (isSingleImageField(field, value)) return renderImageEdit(field, value, host);
  const files = storedFiles(value);
  const multiple = field.multiple === true || Array.isArray(value);
  const canUpload = Boolean(host.startFieldUpload && host.getFieldUploads);
  const uploads = canUpload ? host.getFieldUploads(field) : null;
  const items = Array.isArray(uploads) ? uploads : [];

  const drop = index => {
    const next = files.filter((_, position) => position !== index);
    host.setFieldValue(field, multiple ? next : next[0] ?? null);
  }; // download-action and remove-action both read true when the attribute is
  // absent, so a file with no href has to say false rather than drop it.


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-field-file flex flex-col">
            ${files.map((file, index) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-file-preview
                        file-name=${String(file.label ?? file.name ?? 'File')}
                        file-size=${String(file.size ?? '')}
                        icon=${fileIcon(file.mime ?? file.mimeType)}
                        mime-type=${String(file.mime ?? file.mimeType ?? '')}
                        href=${file.href ? String(file.href) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        download-action=${file.href ? 'true' : 'false'}
                        remove-action="true"
                        remove-label=${`${setText(host, 'removeFile')} ${file.label ?? file.name ?? ''}`.trim()}
                        @sf-file-preview-detach=${() => drop(index)}
                ></sf-file-preview>
            `)}

            ${canUpload ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-file-upload
                                size=${EDIT_SIZE}
                                name=${fieldName(field)}
                                accept=${String(field.accept ?? '')}
                                formats=${String(field.formats ?? '')}
                                link-text=${field.uploadText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                text=${field.uploadHint || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                supporting-text=${field.uploadSupportingText || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                ?multiple=${multiple}
                                ?disabled=${field.readonly === true}
                                aria-label=${field.label || field.key || ''}
                                .items=${items}
                                @sf-file-upload:select=${event => {
    const picked = event.detail?.files;
    const list = Array.isArray(picked) ? picked : [];
    if (list.length) host.startFieldUpload(field, list);
  }}
                                @sf-file-upload:retry=${event => {
    host.retryFieldUpload?.(field, Number(event.detail?.index ?? -1));
  }}
                        ></sf-file-upload>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // The control a field is edited with, or null when the set has none for that
// type yet.


const sizeOption = options => options?.size === '1/2' ? '1/2' : '1'; // A control that stays a control when it may not be changed: a choice as
// buttons shows which button is chosen, which is what it is for, where the
// view's badge would show a different thing (port 1.16.0).


const keepsControlWhenLocked = (asked, field) => asked === 'choice' && isChoiceButtons(field); // `options.disabled`: the control is drawn disabled, not read-only -- a field a
// condition turns off for now (port 1.14.0 `when.enabled`), which the host
// knows and the field does not carry. Read by the controls that draw the two
// differently; for every other one a disabled field is a read-only one.


let EDIT_DISABLED = false;
function renderEditField(field = {}, value, host, options = {}) {
  const asked = field.propertyType || field.type || field.dataType;
  const disabled = options?.disabled === true; // A field the person may not change is shown, not offered as a control that
  // refuses: the same rule for every type, so `readonly` means one thing
  // wherever the registry lists it.

  if ((field.readonly === true || disabled) && VIEW_RENDERERS[asked] && !keepsControlWhenLocked(asked, field)) {
    return renderViewField(field, value, host, options);
  }

  const renderer = EDIT_RENDERERS[asked];
  if (!renderer || !host?.setFieldValue) return null;
  const outer = EDIT_SIZE;
  const outerDisabled = EDIT_DISABLED;
  EDIT_SIZE = sizeOption(options);
  EDIT_DISABLED = disabled;

  try {
    return renderer(field, value, host);
  } finally {
    EDIT_SIZE = outer;
    EDIT_DISABLED = outerDisabled;
  }
} // The view template: a field shown and not edited, which is the fourth of the
// four the assignment names and the last one the set was missing.
//
// It renders lit templates rather than the host-shaped values the cell template
// returns, because its consumer is a record view rendering into its own layout,
// exactly as the edit template's is. The cell template returns host shapes only
// because sf-view-table already had a path for those.
//
// `line` and not `size` for everything that sits beside a label on one text
// line -- a badge, a tag, an avatar, a reference link. A size would give those a
// control's height and stand them taller than the words next to them, which is
// the mistake the cell template already avoids one rung down. The two that are
// not inline keep their own scale: a scale bar is a control, and a file preview
// has no visual size at all, its `size` being a legacy name for the file's size
// as text.
// The line a viewed value is drawn on: 1, or 1/2 with {size: '1/2'}, as above.

let VIEW_LINE = '1'; // A scalar may arrive as the value itself or as {value, text}: the data and the
// host's own formatting of it. The consumer asked for the second and they are
// right -- the Framework has no locale and should not acquire one through a field
// renderer. They already hold the localised text, the viewer's locale and the
// format rules, and a second formatter here would disagree with theirs the first
// time a format setting changed. `text` is the formatted value alone; a unit
// stays its own field so a column of numbers can align its units.

function carriesText(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && typeof value.text === 'string';
}

function scalarValue(value) {
  return carriesText(value) ? value.value : value;
}

function viewText(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  if (typeof formatted === 'string') return formatted;
  if (carriesText(value)) return value.text;
  const plain = scalarValue(value);
  return plain === null || typeof plain === 'undefined' ? '' : String(plain);
}

function renderTextView(field, value, host) {
  const text = viewText(field, value, host);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // Formatted text shown: the value cleaned by sf-input-rich's own rule first,
// and only that cleaned string drawn as markup -- never the value as it came,
// which a host may have stored from anywhere. What is left is the subset:
// paragraphs, headings, emphasis, lists, quotes and links with a safe address.


function renderHtmlView(field, value) {
  const clean = (0,_html_js__WEBPACK_IMPORTED_MODULE_7__.cleanHtml)(value);
  return clean ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-field-view sf-field-html">${(0,lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeHTML)(clean)}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // A number carries its unit when the field declares one, and nothing when it
// does not -- the set does not guess at a unit, and «42» with an invented «шт»
// beside it is a worse answer than «42».


function renderNumberView(field, value, host) {
  if (value === null || typeof value === 'undefined' || value === '') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const variant = field.variant || field.filter?.variant; // The scale needs the number, not the host's text for it.

  const number = Number(scalarValue(value));

  if (variant === 'scale' && Number.isFinite(number) && number >= 0 && number <= 100) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-progress-scale size="1" value=${String(number)}></sf-progress-scale>`;
  }

  const text = viewText(field, value, host);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${field.unit ? `${text} ${field.unit}` : text}</span>`;
} // A date is the host's to format. The set has no locale and will not invent one:
// without formatFieldValue it shows what it was given, which is at worst the
// stored form and never a wrong date confidently rendered.


function renderDateView(field, value, host) {
  const text = viewText(field, value, host);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderBooleanView(field, value, host) {
  if (typeof value !== 'boolean') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const words = booleanWords(field, host);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${value ? words.yes : words.no}</span>`;
}

function renderChoiceView(field, value) {
  const options = field.options || field.filter?.options || field.constraints?.options;
  const option = Array.isArray(options) ? options.find(item => String(item?.value) === String(value)) : null;
  if (!option) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const badge = (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionBadgeProps)(option); // A table cell is a dense place: the badge keeps the tight side room
  // (sf-badge tight), as it had before sf-badge 1.3.0 widened the default.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-badge
                line=${VIEW_LINE}
                tight
                appearance=${field.badgeAppearance ?? CELL_BADGE_APPEARANCE}
                scheme=${badge.scheme}
                style=${badge.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                text=${String(option.label ?? option.text ?? value)}
        ></sf-badge>
    `;
} // The values wrap, each tag as wide as its text: on one unwrapping line a
// role's 137 rights shrank every tag to a letter and the text ran down the
// panel (Larena, 2026-10-17). The tag's painted root is the flex item (the
// host is display: contents), so it is told not to shrink through root-class.
// No disclosure for a long list here: a record's
// field in view is the button that opens its group, and a control inside a
// button is not one.


function renderChoicesView(field, value) {
  if (!Array.isArray(value) || !value.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const options = field.options || field.filter?.options || field.constraints?.options;

  const label = item => {
    const option = Array.isArray(options) ? options.find(candidate => String(candidate?.value) === String(item)) : null;
    return String(option?.label ?? option?.text ?? item);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-view flex flex-wrap items-cross-center gap-1/3 min-w-0">
            ${value.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag root-class="flex-none" line=${VIEW_LINE} kind="default" text=${label(item)}></sf-tag>`)}
        </span>
    `;
} // A person, as in a cell: the name links to the person when the host gives
// the href -- every value that points at a record opens it (owner,
// 2026-10-14). Plain, as a reference read in a record's field is.


function renderUserView(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-view flex items-cross-center gap-1/3">
            <sf-avatar line=${VIEW_LINE} text=${value.avatarText || ''}></sf-avatar>
            ${value.href ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-reference-link appearance="plain" icon="" line=${VIEW_LINE}
                        label=${String(value.label)} href=${String(value.href)}></sf-reference-link>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${String(value.label)}</span>`}
        </span>
    `;
}

function renderReferenceView(field, value) {
  if (!value || typeof value !== 'object' || !value.label) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Plain, and without the arrow: a reference read inside a record's field is
  // a value on a line, not a card. The card's frame and fill drew a second box
  // around a value that already sits in one, and the arrow said «go» beside a
  // word that is already a link (owner, 2026-10-08).

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-reference-link
                appearance="plain"
                icon=""
                line=${VIEW_LINE}
                label=${String(value.label)}
                href=${value.href ? String(value.href) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ></sf-reference-link>
    `;
} // A value from a reference list reads as its label; several read as their
// labels, each a tag as a list of choices does. Not a link: nothing opens from a
// country or a status.


function renderLookupView(field, value) {
  const items = lookupItems(field, value);
  if (!items.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  if (items.length === 1 && field.multiple !== true) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${items[0].label}</span>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-view flex flex-wrap items-cross-center gap-1/3 min-w-0">
            ${items.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag root-class="flex-none" line=${VIEW_LINE} kind="default" text=${item.label}></sf-tag>`)}
        </span>
    `;
} // The one place the view template is not a smaller edit control: a stored file
// is shown with its own preview, which carries the download the view wants and
// not the remove an edit does.


function renderFileView(field, value) {
  const files = storedFiles(value);
  if (!files.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // An image is shown as the image. `image-url` and `kind` are inputs the file
  // preview already has, so this is the same component told what it is holding
  // rather than a second way of drawing a file. Which files are images is the
  // host's to say through the variant: guessing from a file name would be wrong
  // for every stored file whose name does not end in a familiar three letters.

  const asImage = isImageField(field);
  const card = String(field.variant ?? '') === 'image-card';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-field-view flex ${card ? 'flex-row' : 'flex-col'} gap-1/3">
            ${files.map(file => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-file-preview
                        file-name=${String(file.label ?? file.name ?? 'File')}
                        file-size=${String(file.size ?? '')}
                        icon=${fileIcon(file.mime ?? file.mimeType)}
                        mime-type=${String(file.mime ?? file.mimeType ?? '')}
                        href=${file.href ? String(file.href) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        image-url=${asImage && file.href ? String(file.href) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        kind=${asImage ? 'image' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        download-action=${file.href ? 'true' : 'false'}
                        remove-action="false"
                ></sf-file-preview>
            `)}
        </span>
    `;
}

const VIEW_RENDERERS = {
  string: renderStringView,
  text: renderTextView,
  html: renderHtmlView,
  integer: renderNumberView,
  number: renderNumberView,
  date: renderDateView,
  datetime: renderDateView,
  time: renderDateView,
  boolean: renderBooleanView,
  choice: renderChoiceView,
  choices: renderChoicesView,
  user: renderUserView,
  record: renderReferenceView,
  relation: renderReferenceView,
  lookup: renderLookupView,
  file: renderFileView,
  color: renderColorView,
  include: renderIncludeView
}; // A field shown rather than edited. `host` is optional and used for one thing
// only -- formatFieldValue, where a consumer's own formatting of a number or a
// date belongs. Null when the set has no view for that type.

function propertyModes(type) {
  return (0,_registry_js__WEBPACK_IMPORTED_MODULE_4__.modesOf)(type, {
    view: VIEW_RENDERERS,
    edit: EDIT_RENDERERS,
    cell: CELL_RENDERERS,
    filter: FILTER_RENDERERS
  });
}

function renderViewField(field = {}, value, host, options = {}) {
  const asked = field.propertyType || field.type || field.dataType;
  const renderer = VIEW_RENDERERS[asked];
  if (!renderer) return null;
  const outer = VIEW_LINE;
  VIEW_LINE = sizeOption(options);

  try {
    return renderer(field, value, host);
  } finally {
    VIEW_LINE = outer;
  }
} // A host has to be able to reach the set, and a module is not an element: there
// is no tag to place and no attribute to set. The Framework already has one
// place for what a page may call -- window.SF, where the base element, `html`,
// `nothing` and `render` live -- so the set publishes itself there under its own
// name. Without this the module is built, bundled and unreachable: the consumer
// could read the mapping and not call it, which was true of this set until now.
//
// This is the runtime half of the discoverability question. The other half --
// describing the module in the registry, so a host learns what it offers without
// reading our source -- is with the registry's owner.

if (typeof window !== 'undefined') {
  window.SF = window.SF || {};
  window.SF.fieldRenderers = { ...(window.SF.fieldRenderers || {}),
    renderCellField,
    renderEditField,
    renderFilterField,
    renderViewField,
    FILTER_RENDERERS,
    // A datetime's value read and written back, for a host that draws its
    // own control: split(value), compose(stored, {date, time}),
    // normalizeTime(text); and a time of day's: splitTime(value),
    // composeTime(stored, text).
    dateTime: {
      split: _datetime_js__WEBPACK_IMPORTED_MODULE_5__.splitDateTime,
      compose: _datetime_js__WEBPACK_IMPORTED_MODULE_5__.composeDateTime,
      normalizeTime: _datetime_js__WEBPACK_IMPORTED_MODULE_5__.normalizeTime,
      splitTime: _datetime_js__WEBPACK_IMPORTED_MODULE_5__.splitTime,
      composeTime: _datetime_js__WEBPACK_IMPORTED_MODULE_5__.composeTime
    },
    // The universal properties, each with the modes the set draws for it.
    registry: _registry_js__WEBPACK_IMPORTED_MODULE_4__.PROPERTY_TYPES.map(entry => ({ ...entry,
      modes: propertyModes(entry.type)
    }))
  }; // SF.whenFieldRenderers() settles on this, whichever bundle published the set.

  globalThis.document?.dispatchEvent?.(new CustomEvent('sf-field-renderers-ready'));
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "dd6973f77245"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   maskPattern: () => (/* binding */ maskPattern),
/* harmony export */   maskState: () => (/* binding */ maskState)
/* harmony export */ });
// Whether a masked string is complete (simai.property-view-port 1.16.0,
// field.mask). sf-input formats what a person types through the Framework's
// mask (core/js/mask.js) and reports the text as shown; what the set still has
// to know is whether that text fills every place of the pattern, because an
// incomplete value is not a value -- «+7 (912) 3» is neither a phone nor
// nothing -- and a panel must not send it.
//
// The grammar is core/js/mask.js's, read the same way: `0` a digit, `a` a
// letter, `*` any character, `\` escapes the next character, `{` `}` mark a
// fixed part that belongs to the value and `[` `]` an optional tail, both
// dropped from what is shown, and every other character is a fixed part shown
// in the field. The pattern is compiled into one expression over the shown
// text rather than re-running the formatter: the formatter's job is to make a
// valid prefix out of anything typed, which is exactly the question it cannot
// answer -- every prefix is valid while it is typed. A pattern's optional tail
// is not optional here: the contract names no optional places, and a tail
// that may be left empty would make «complete» mean two lengths.
//
// The text is compared as shown, fixed parts included, because that is the
// value the host receives. A text with the template's placeholders (a
// mask-lazy="false" field shows «+7 (___) ___-__-__») is incomplete, and a
// template with nothing typed into it is empty.
const SLOT = {
  0: '\\d',
  a: '\\p{L}',
  '*': '[\\s\\S]'
};
const TEST = {
  0: character => /\d/u.test(character),
  a: character => /\p{L}/u.test(character),
  '*': () => true
}; // Unicode mode refuses an escaped character that is not syntax, so only these.

const escape = character => character.replace(/[\\^$.*+?()[\]{}|/]/gu, '\\$&');

function compile(pattern) {
  let source = '';
  const tokens = [];

  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];

    if (character === '\\') {
      index += 1;

      if (index < pattern.length) {
        source += escape(pattern[index]);
        tokens.push({
          fixed: pattern[index]
        });
      }
    } else if (character === '{' || character === '}' || character === '[' || character === ']') {// Markers of the grammar, never shown.
    } else if (SLOT[character]) {
      source += SLOT[character];
      tokens.push({
        test: TEST[character]
      });
    } else {
      source += escape(character);
      tokens.push({
        fixed: character
      });
    }
  }

  return {
    complete: new RegExp(`^${source}$`, 'u'),
    tokens
  };
} // How many places the text fills, read as core/js/mask.js reads it: a
// character that is the fixed part expected there is that fixed part, a
// placeholder in a place is an empty place, anything else fills the next place
// that takes it. A «7» typed into «+7 (000)» is a digit, not the fixed 7.


function filled(value, tokens, placeholder) {
  let count = 0;
  let pointer = 0;

  for (const character of value) {
    while (pointer < tokens.length && tokens[pointer].fixed !== undefined && tokens[pointer].fixed !== character) pointer += 1;

    if (pointer >= tokens.length) break;
    const token = tokens[pointer];
    if (token.fixed !== undefined) pointer += 1;else if (character === placeholder) pointer += 1;else if (token.test(character)) {
      count += 1;
      pointer += 1;
    }
  }

  return count;
}

const COMPILED = new Map();
function maskPattern(field) {
  const mask = field?.mask;
  return typeof mask === 'string' && mask !== '' ? mask : null;
} // 'empty', 'complete' or 'incomplete'. Empty is a text with nothing typed into
// it: no text, or only the pattern's fixed parts and placeholders.

function maskState(text, pattern, placeholder = '_') {
  const value = String(text ?? '');
  if (!COMPILED.has(pattern)) COMPILED.set(pattern, compile(pattern));
  const {
    complete,
    tokens
  } = COMPILED.get(pattern);
  if (complete.test(value)) return 'complete';
  return filled(value, tokens, placeholder) === 0 ? 'empty' : 'incomplete';
}

/***/ },

/***/ "fc654eb7fab0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PROPERTY_TYPES: () => (/* binding */ PROPERTY_TYPES),
/* harmony export */   modesOf: () => (/* binding */ modesOf)
/* harmony export */ });
// The registry of universal properties (owner, 2026-10-15): every property
// type the Framework renders, or a component set renders beside it (`set`),
// its variants and the parameters a field of it reads -- one list a host
// (Larena's fields and settings), the property workbench and the documentation
// read, instead of each learning the types from the renderers' source. Which
// modes a type has is not written here: it is read from the renderer maps
// themselves (modesOf), so the registry cannot claim a mode the set does not
// draw. A contract keeps the two the same.
//
// `params` are the field keys the type's renderers read -- each one, and no
// other (the probe field-renderer-params calls them with a field that records
// what is read). A record, a relation and a user hold one value and take their
// candidates from the host, not from `options`; a constraint other than a
// choice's options is the host's to enforce, not a renderer's.
const PROPERTY_TYPES = Object.freeze([{
  type: 'string',
  label: {
    ru: 'Строка',
    en: 'String'
  },
  // password: write-only. The host never sends the password; the value it
  // sends is {set: true} or {set: false} (null reads as not set), and the
  // set shows only «задан»/«не задан». An edit writes the typed text through
  // setFieldValue and writes nothing for a field nobody typed in.
  variants: [{
    id: 'phone',
    label: {
      ru: 'Телефон',
      en: 'Phone'
    }
  }, {
    id: 'password',
    label: {
      ru: 'Пароль',
      en: 'Password'
    },
    writeOnly: true
  }],
  // mask (property-view port 1.16.0): the Framework mask grammar of
  // sf-input's mask-pattern; the value is the text as shown, fixed parts
  // included, and an incomplete one is reported, not written as a value.
  // nullable: false makes a cleared masked field write "" instead of null.
  // Read by the plain string alone: phone and password keep their controls.
  params: ['placeholder', 'mask', 'nullable', 'required', 'readonly']
}, {
  type: 'text',
  label: {
    ru: 'Текст',
    en: 'Text'
  },
  variants: [],
  params: ['placeholder', 'required', 'readonly']
}, // html (property-view port 1.17.0): formatted text, an HTML string of
// sf-input-rich's subset. Edited with sf-input-rich, shown cleaned by that
// component's own rule, a cell its text on one line, filtered as text.
{
  type: 'html',
  label: {
    ru: 'Форматированный текст',
    en: 'Formatted text'
  },
  variants: [],
  params: ['placeholder', 'required', 'readonly']
}, // stepper: edited with sf-quantity, «−» and «+» and the arrow keys; min,
// max and step (and a number's precision) are read by that variant alone.
{
  type: 'integer',
  label: {
    ru: 'Целое число',
    en: 'Integer'
  },
  variants: [{
    id: 'stepper',
    label: {
      ru: 'Кнопками «−» и «+»',
      en: 'With steppers'
    }
  }],
  params: ['unit', 'min', 'max', 'step', 'required', 'readonly']
}, {
  type: 'number',
  label: {
    ru: 'Число',
    en: 'Number'
  },
  variants: [{
    id: 'scale',
    label: {
      ru: 'Шкала 0–100',
      en: 'Scale 0–100'
    }
  }, {
    id: 'stepper',
    label: {
      ru: 'Кнопками «−» и «+»',
      en: 'With steppers'
    }
  }],
  params: ['unit', 'min', 'max', 'step', 'precision', 'required', 'readonly']
}, {
  type: 'date',
  label: {
    ru: 'Дата',
    en: 'Date'
  },
  variants: [],
  params: ['required', 'readonly']
}, // datetime and time: sf-input-date in mode datetime and time (1.4.0). min
// and max bound the value -- an ISO date or date and time for a datetime,
// hh:mm for a time -- and step is the minute step, 1 to 60.
{
  type: 'datetime',
  label: {
    ru: 'Дата и время',
    en: 'Date and time'
  },
  variants: [],
  params: ['min', 'max', 'step', 'required', 'readonly']
}, {
  type: 'time',
  label: {
    ru: 'Время',
    en: 'Time'
  },
  variants: [],
  params: ['min', 'max', 'step', 'required', 'readonly']
}, {
  type: 'boolean',
  label: {
    ru: 'Да или нет',
    en: 'Yes or no'
  },
  variants: [],
  params: ['trueText', 'falseText', 'required', 'readonly']
}, // buttons (property-view port 1.16.0): one segmented button group, a
// button per option, sized by `size` on the ladder ("1/2", "1", "2"; absent,
// the field's); pressing the chosen one again clears a field that is not
// required. The dropdown stays the default.
{
  type: 'choice',
  label: {
    ru: 'Одно из списка',
    en: 'One of a list'
  },
  variants: [{
    id: 'buttons',
    label: {
      ru: 'Кнопками',
      en: 'As buttons'
    }
  }],
  params: ['options', 'badgeAppearance', 'size', 'required', 'readonly']
}, {
  type: 'choices',
  label: {
    ru: 'Несколько из списка',
    en: 'Several of a list'
  },
  // badges: the view; checklist and select: the edit control (a list of
  // 13 or more is a checklist unless select is asked for).
  variants: [{
    id: 'badges',
    label: {
      ru: 'Значками',
      en: 'As badges'
    }
  }, {
    id: 'checklist',
    label: {
      ru: 'Флажками',
      en: 'As a checklist'
    }
  }, {
    id: 'select',
    label: {
      ru: 'Выпадающим списком',
      en: 'As a dropdown'
    }
  }],
  params: ['options', 'badgeAppearance', 'required', 'readonly']
}, {
  type: 'user',
  label: {
    ru: 'Пользователь',
    en: 'User'
  },
  variants: [],
  params: ['placeholder', 'searchPlaceholder', 'required', 'readonly']
}, {
  type: 'record',
  label: {
    ru: 'Запись',
    en: 'Record'
  },
  variants: [],
  params: ['placeholder', 'searchPlaceholder', 'required', 'readonly']
}, {
  type: 'relation',
  label: {
    ru: 'Связь',
    en: 'Relation'
  },
  variants: [],
  params: ['placeholder', 'searchPlaceholder', 'required', 'readonly']
}, // lookup: a value chosen from a reference list the host keeps -- a country,
// a status, a contract type (Larena, 2026-10-23). It is not a record: the
// value is {value, label} and nothing opens from it. Small lists arrive as
// `options` and are chosen from in place; anything larger is paged and
// searched by the host, from the source the field names (`source`, which the
// host reads and no renderer does).
{
  type: 'lookup',
  label: {
    ru: 'Из справочника',
    en: 'From a reference list'
  },
  variants: [],
  params: ['options', 'multiple', 'placeholder', 'searchPlaceholder', 'required', 'readonly']
}, {
  type: 'file',
  label: {
    ru: 'Файл',
    en: 'File'
  },
  variants: [{
    id: 'image',
    label: {
      ru: 'Изображение',
      en: 'Image'
    }
  }, {
    id: 'image-card',
    label: {
      ru: 'Изображение карточкой',
      en: 'Image card'
    }
  }, {
    id: 'image-list',
    label: {
      ru: 'Изображения списком',
      en: 'Image list'
    }
  }],
  // required: read by the image variant alone, whose control is
  // sf-image-field -- a required, empty one keeps its form from submitting.
  params: ['accept', 'multiple', 'formats', 'uploadText', 'uploadSupportingText', 'uploadHint', 'required', 'readonly']
}, {
  type: 'color',
  label: {
    ru: 'Цвет',
    en: 'Colour'
  },
  variants: [],
  params: ['swatches', 'required', 'readonly']
}, {
  type: 'include',
  label: {
    ru: 'Код',
    en: 'Code'
  },
  variants: [],
  params: ['language', 'required', 'readonly']
}, // The types a component set draws (property-view port 1.18.0; Larena
// property types standard, notes of 2026-11-03): `set` names the set whose
// components show and edit them -- the View set's sf-view-properties and
// sf-view-flow -- and the Framework draws their table cells and filters
// (money and percent as numbers, items by its number of rows). `params` are
// the keys the type reads, in the set's renderers and in these. Every
// number is a decimal string, never a float.
{
  type: 'money',
  label: {
    ru: 'Деньги',
    en: 'Money'
  },
  set: 'view',
  variants: [],
  params: ['currency', 'min', 'max', 'required', 'readonly']
}, {
  type: 'percent',
  label: {
    ru: 'Процент',
    en: 'Percent'
  },
  set: 'view',
  variants: [],
  params: ['min', 'max', 'required', 'readonly']
}, {
  type: 'items',
  label: {
    ru: 'Строки',
    en: 'Rows'
  },
  set: 'view',
  variants: [],
  params: ['columns', 'minRows', 'maxRows', 'required', 'readonly']
}, {
  type: 'compound',
  label: {
    ru: 'Составное',
    en: 'Compound'
  },
  set: 'view',
  variants: [],
  params: ['parts', 'required', 'readonly']
}, {
  type: 'ru.requisites',
  label: {
    ru: 'Реквизиты',
    en: 'Requisites (Russia)'
  },
  set: 'view',
  variants: [],
  params: ['parts', 'required', 'readonly']
}]); // The modes a type has, read from the renderer maps: view and edit (a record),
// cell (a table) and filter -- `own` when the set has a filter control for the
// type, `text` when a filter falls back to a text search.

function modesOf(type, maps) {
  return {
    view: Boolean(maps.view?.[type]),
    edit: Boolean(maps.edit?.[type]),
    cell: maps.cell?.[type] ? 'own' : 'text',
    filter: maps.filter?.[type] ? 'own' : 'text'
  };
}

/***/ },

/***/ "926043d18700"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   getElementRowGap: () => (/* binding */ getElementRowGap),
/* harmony export */   getParent: () => (/* binding */ getParent),
/* harmony export */   setParentSpace: () => (/* binding */ setParentSpace)
/* harmony export */ });
function getElementRowGap(element) {
  return parseFloat(getComputedStyle(element).rowGap) || 0;
}
function setParentSpace(items) {
  const firstRef = items.values().next().value;
  const firstValue = firstRef?.value;
  if (!firstValue) return;
  const parent = firstValue.parentNode;
  if (!parent) return;
  return {
    gap: getElementRowGap(parent),
    item: firstValue,
    parent: parent
  };
}
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
          args = arguments;

    const later = () => {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
function getParent(item) {
  let current = item;

  while (current) {
    if (current.nodeName.toLowerCase().startsWith('sf-')) {
      return current.parentNode;
    }

    current = current.parentNode;
  }

  return null;
}

/***/ },

/***/ "870b5dfddc25"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setLoaderDragState: () => (/* binding */ setLoaderDragState)
/* harmony export */ });
function setLoaderDragState(value) {
  if (typeof SF === "undefined" || !SF.Loader) return;
  const loader = SF.Loader;
  const currentCount = Number(loader.dragObserverLockCount || 0);
  loader.dragObserverLockCount = value ? currentCount + 1 : Math.max(currentCount - 1, 0);
  loader.stopObserver = loader.dragObserverLockCount > 0;
}

/***/ },

/***/ "b30ec5bc0edb"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   optionBadgeProps: () => (/* binding */ optionBadgeProps)
/* harmony export */ });
/* harmony import */ var _component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a2a9d3c2841e");

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
/**
 * Badge look for a filter option with optionRenderer 'badge'. option.color is
 * a Framework badge scheme (success, error, info...) or a hex colour; a hex
 * colour tints the tonal background and keeps the text on the surface colour,
 * so the label stays readable in both themes. Anything else is neutral.
 */
// The data view port names the badge look `scheme` on a column's options; a
// filter option has always said `color`. Both are read: reading only `color`
// left every port column's scheme unread and its badges neutral.

function optionBadgeProps(option = {}) {
  const raw = option?.scheme ?? option?.color;
  const color = typeof raw === "string" ? raw.trim() : ""; // A former name (danger) reads as its canonical scheme (error).

  const scheme = (0,_component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__.canonicalBadgeScheme)(color);
  if (scheme) return {
    scheme,
    rootStyle: ""
  };

  if (HEX_COLOR.test(color)) {
    return {
      scheme: "neutral",
      rootStyle: `--sf-badge--background-color: color-mix(in srgb, ${color} 24%, transparent); --sf-badge--color: var(--sf-on-surface)`
    };
  }

  return {
    scheme: "neutral",
    rootStyle: ""
  };
}

/***/ },

/***/ "94d60d3691b5"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _js_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("17828be41e75");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c1f17ed5a348");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f8651e83c6c6");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("678dc07d76bf");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("32294b89604f");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("9d9caaf4f796");
/* harmony import */ var _helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("b30ec5bc0edb");
/* harmony import */ var _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("e5483002f3ea");
/* harmony import */ var _field_renderers_html_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("01ae054f01b4");
/* harmony import */ var _js_format_value_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("2f31b00ad99a");
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("8137feb490e0");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _helpers_dom__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("926043d18700");
/* harmony import */ var _helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("870b5dfddc25");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("51250bf01ab0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_9__, _js_format_value_js__WEBPACK_IMPORTED_MODULE_11__, lit__WEBPACK_IMPORTED_MODULE_12__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_13__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_14__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_17__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _js_templates_default__WEBPACK_IMPORTED_MODULE_7__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_9__, _js_format_value_js__WEBPACK_IMPORTED_MODULE_11__, lit__WEBPACK_IMPORTED_MODULE_12__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_13__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_14__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_17__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_17__);


















 // Sized for what they hold rather than for reading, so they take no floor.
// Every word this table says, in the two languages the Framework speaks. The
// rule is the shared one -- `pageText` reads the nearest [lang] and falls back
// to the document's -- and it is here because the table said only Russian: on
// an English page the list's toolbar read «Фильтр» and «Создать» beside a
// record panel that had switched, which is the sort of thing only a language
// switch in an admin shows (owner, 2026-10-10).
//
// An attribute still wins over both: a consumer who names a word names it.
// SF.Preferences, the Framework's one store of view preferences (core
// publishes it; this bundle's copy is the fallback).

const preferences = () => globalThis.SF?.Preferences || _core_js_preferences_js__WEBPACK_IMPORTED_MODULE_18__["default"];

const tablePreferenceKey = key => `sf-table/${String(key).replace(/[^\w.:-]+/gu, "-")}`; // What a cell may draw as markup rather than as an element of its own.


const LIGHT_CELL_TAGS = new Set(["sf-badge", "sf-tag", "sf-avatar"]);
const GENERAL_TABLE_PREFERENCE = "sf-table/*";
const TABLE_VIEW_DEFAULTS = Object.freeze({
  density: "normal",
  stripes: false,
  lines: false,
  singleLine: false,
  stickyHead: true
}); // The nearest box that scrolls vertically above an element, across shadow
// roots; null when it is the page.

function verticalScroller(element) {
  for (let node = element; node; node = node.parentElement ?? node.getRootNode?.()?.host ?? null) {
    if (node === document.body || node === document.documentElement) return null;
    const style = getComputedStyle(node);
    if (/(auto|scroll|overlay)/u.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1) return node;
  }

  return null;
} // The words are the language files' (lang/<locale>.json, standard 1.3.8 §11),
// read here under the camelCase keys a product registers more languages by
// (SF.language.register("sf-view-table", code, {filterText: …})).


const camelWords = (words = {}) => Object.fromEntries(Object.entries(words).map(([key, word]) => [key.replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase()), word]));

const TABLE_TEXT = {
  en: camelWords(_lang_en_json__WEBPACK_IMPORTED_MODULE_5__.runtime),
  ru: camelWords(_lang_ru_json__WEBPACK_IMPORTED_MODULE_6__.runtime)
};
const SYSTEM_COLUMN_KEYS = new Set(["select", "settings", "actions"]);

const positioning = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_17___default()); // Published Composition ports (simai.composition.port-manifest.v1, sf-view-table@1.0.0).


const SF_TABLE_PORTS = Object.freeze({
  outputs: Object.freeze({
    selection: "record-ids.v1"
  }),
  inputs: Object.freeze({
    context: "record-ids.v1"
  })
});
const MAX_PORT_RECORD_IDS = 1000;

function hasControlCharacter(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 32 || code === 127) return true;
  }

  return false;
}

function checkedRecordIds(value) {
  if (!Array.isArray(value) || value.length > MAX_PORT_RECORD_IDS || Array.from(value).some(id => !(typeof id === "string" && id.length > 0 && id.length <= 256 && !hasControlCharacter(id) || Number.isSafeInteger(id))) || new Set(Array.from(value, id => `${typeof id}:${id}`)).size !== value.length) {
    throw new TypeError("Record identities must be unique nonempty strings or safe integers");
  }

  return Object.freeze([...value]);
} // Two tables on one page share nothing: ids, the settings key fallback and the
// portal are all derived from this counter, never from the component name.


let tableInstances = 0; // Many entries (standard simai.smart-component 1.3.8 §18.4; the quality
// profile 1.3.6-1, gate 17): from this many rows the table draws only the rows
// in view and a margin around them. The row height is measured from a drawn
// row; until one is drawn it is guessed.

const WINDOW_FROM = 300;
const WINDOW_MARGIN = 20;
const WINDOW_INITIAL = 60;
const ROW_HEIGHT_GUESS = 40;
const LONG_TEXT_CELL_TYPES = new Set(['text', 'textarea', 'markdown', 'html']); // The box a cell value is drawn in: a Smart element that is display: contents
// (sf-tag) has none of its own, so its first child is the one measured and
// folded.

function cellValueBox(item) {
  return getComputedStyle(item).display === 'contents' ? item.firstElementChild ?? item : item;
} // sf-view-table from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8, §11, §18): the settings are attributes and properties, the actions
// answer outcomes, the events take the vocabulary's verbs and the old names
// follow once through the dated aliases (aliases.json). The table's own props
// below keep their parsers and defaults; what they do not name is the
// manifest's.
// A column's content width, a pixel to spare and rounded up to the 4px grid.
// The page's text face is font-display: optional, so one page sets a value in
// Inter and the next -- or the server's printed first paint, measured on
// another page -- in its metric fallback, a pixel or two apart: a column
// measured to the pixel in one wrapped the same value in the other, and the
// row grew by a line when the code took over (standard 1.3.8 gate 24).


function contentStep(width) {
  return Math.ceil((Math.ceil(width) + 1) / 4) * 4;
}

const TableElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
}); // Whether a row of the current set would stand at another index in the next:
// a row kept by id and drawn elsewhere is a layout shift.

function rowsWouldMove(current, next) {
  const at = new Map();
  current.forEach((row, index) => {
    if (row?.id !== undefined && row?.id !== null) at.set(String(row.id), index);
  });
  return next.some((row, index) => {
    if (row?.id === undefined || row?.id === null) return false;
    const was = at.get(String(row.id));
    return was !== undefined && was !== index;
  });
}

class SfTable extends TableElement {
  static get sfPorts() {
    return SF_TABLE_PORTS;
  }

  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      ariaLabel: {
        attribute: "aria-label",
        default: "Data table"
      },
      // The row the page has open (component.json settings.current).
      current: {
        attribute: "current",
        default: ""
      },
      selectable: {
        type: Boolean,
        default: true
      },
      // Who owns the vertical scroll. `self` keeps the rows in their own
      // scroll area, which is what a host that bounds the table's height
      // wants and what every page has had so far. `page` gives the
      // vertical scroll to the document, so the head stays visible while
      // the page scrolls; the rows then scroll sideways only.
      verticalScroll: {
        attribute: 'vertical-scroll',
        default: 'self',
        values: ['self', 'page']
      },
      // How the records are drawn. `auto` is a table while the table's own
      // container is at least `list-below` pixels wide and a compact list
      // of records below that -- a phone, or a list beside an open panel;
      // `table` and `list` hold one of them whatever the width (owner,
      // 2026-10-12: one mobile view, the compact list). A table is a table
      // unless asked: sf-view asks for auto on a page's list.
      layout: {
        default: 'table',
        values: ['auto', 'table', 'list']
      },
      listBelow: {
        attribute: 'list-below',
        type: Number,
        default: 600
      },
      // How many fields a record shows under its title in the list, chosen
      // by the columns' priority (lower first).
      listFields: {
        attribute: 'list-fields',
        type: Number,
        default: 3
      },
      toolbar: {
        type: Boolean,
        default: true
      },
      settings: {
        type: Boolean,
        default: true
      },
      pagin: {
        type: Boolean,
        default: false
      },
      actions: {
        type: Boolean,
        default: true
      },
      // The row action column alone; the create button still follows actions.
      rowActions: {
        attribute: "row-actions",
        type: Boolean,
        default: true
      },
      // Rows may be dragged out of the list -- onto a folder of a tree --
      // as records (application/x-sf-records+json).
      dragRows: {
        attribute: "drag-rows",
        type: Boolean,
        default: false
      },
      // The rows can be put in another order by dragging them inside the
      // list (row-reorder, the storage schema's fields, 2026-10-16).
      rowReorder: {
        attribute: "row-reorder",
        type: Boolean,
        default: false
      },
      // A boolean cell the host lets a person write is a checkbox
      // (inline-edit; which cells, the record's `editable` says).
      inlineEdit: {
        attribute: "inline-edit",
        type: Boolean,
        default: false
      },
      // Where the row's buttons are drawn: the active row, or every row.
      rowActionsVisible: {
        attribute: "row-actions-visible",
        default: "hover"
      },
      // The create button and its menu of kinds, inside actions: a data view
      // turns it off for a host on port 1.10.0 that does not announce
      // create-record, so nothing is offered that nobody would answer.
      creatable: {
        type: Boolean,
        default: true
      },
      // The button that saves the filter as a template. A data view turns it
      // off when the host keeps no saved views: a template saved there went
      // nowhere and was gone on the next load.
      filterTemplates: {
        attribute: "filter-templates",
        type: Boolean,
        default: true
      },
      // The gear in the head of the settings column, which opens the column
      // settings. Off, the column still carries each row's menu.
      settingsMenu: {
        attribute: "settings-menu",
        type: Boolean,
        default: true
      },
      // The step of the size ladder the table's own controls take: its
      // toolbar, its row boxes and menus, its filters and context menus.
      // 1/2 is the dense admin step -- 32px controls, 14/20 text, the
      // height of the admin menu beside it -- and the rows follow.
      size: {
        default: "1",
        values: ["1/2", "1"]
      },
      filterText: {
        attribute: "filter-text",
        default: "Filter"
      },
      clearText: {
        attribute: "clear-text",
        default: "Clear"
      },
      searchPlaceholder: {
        attribute: "search-placeholder",
        default: "Search"
      },
      createText: {
        attribute: "create-text",
        default: "Create"
      },
      pinColumnLabel: {
        attribute: "pin-column-label",
        default: "Pin the column"
      },
      unpinColumnLabel: {
        attribute: "unpin-column-label",
        default: "Unpin the column"
      },
      paginationTotal: {
        attribute: "pagination-total",
        type: Number,
        default: 10
      },
      paginationPageSize: {
        attribute: "pagination-page-size",
        type: Number,
        default: 10
      },
      pageSizes: {
        attribute: "page-sizes",
        default: "10,20,30,40"
      },
      contextMenuColumns: {
        attribute: "context-menu-columns",
        type: Number,
        // One, because one is what every table has drawn since this input
        // existed: the read was bare, so neither the declared 2 nor a value
        // a host passed ever reached the menu, which fell to `?? 1`. The
        // getter below makes the input work for the first time, and the
        // default is set to the shipped behaviour so that making it work
        // changes nothing for anyone who does not ask.
        default: 1
      },
      // A table no host keeps settings for remembers its column widths in
      // this browser (owner, 2026-10-14), under table-settings-key.
      rememberWidths: {
        attribute: "remember-widths",
        type: Boolean,
        default: false
      },
      // The key the arrangement is kept under as a view preference.
      preferencesKey: {
        attribute: "preferences-key",
        default: ""
      },
      tableSettingsKey: {
        attribute: "table-settings-key",
        // Empty, because the effective default was never a string at all:
        // the bare read fell through to the attribute, then the element's
        // id, then its instance id, so every table had its own key. The
        // declaration said "users" and the manifest said
        // "admin.collection" -- two different untruths about the same
        // input. Either one, read properly, would have made every table on
        // a page share one settings key and overwrite the others.
        default: ""
      },
      dataState: {
        attribute: "data-state",
        default: "auto",
        values: ["auto", "loading", "populated", "empty", "error"]
      },
      loadingText: {
        attribute: "loading-text",
        default: "Loading"
      },
      emptyText: {
        attribute: "empty-text",
        default: "No data"
      },
      errorText: {
        attribute: "error-text",
        default: "The data could not be loaded"
      },
      retryText: {
        attribute: "retry-text",
        default: "Try again"
      },
      columnMoveLabel: {
        attribute: "column-move-label",
        default: "Move the column"
      },
      filterApplyText: {
        attribute: "filter-apply-text",
        default: "Apply"
      },
      columnSearchPlaceholder: {
        attribute: "column-search-placeholder",
        default: "Search the fields"
      },
      columnSearchEmptyText: {
        attribute: "column-search-empty-text",
        default: "No field matches"
      }
    };
  } // The manifest's declared defaults for these two were fixed in the same
  // commit as these getters and then lost: a rebase replayed a hand-picked list
  // of source files and classified smart.manifest.json as regenerable, which is
  // true of its provenance and false of its declarations. Two pairs shipped with
  // the getters resolving one thing and the manifest declaring another. The
  // other Framework session's defaults contract -- the manifest default against
  // the value a component resolves with no attribute set -- is what catches this
  // class, and it would have caught it here.
  // Declaring a prop creates no accessor in this Framework. These two were read
  // off `this` and were undefined, which the other Framework session's new
  // contract now names. Each is written so that reading it properly preserves
  // the behaviour that shipped, rather than applying a default that never
  // applied.


  get contextMenuColumns() {
    const declared = this.getNumberAttr?.("context-menu-columns", 1) ?? 1;
    return Number.isFinite(declared) && declared > 0 ? declared : 1;
  }

  get tableSettingsKey() {
    return this.getAttribute?.("table-settings-key") || "";
  }

  constructor() {
    super();
    this._emptyContext = null; // One handler for every row's press, not a closure per row and render.

    this.rowPointerDown = event => this.handleRowPointerDown(event);

    this._windowRange = null;
    this._windowed = false;
    this._rowHeight = 0; // The empty state's actions: retry and create are the table's own;
    // anything else (the data view's query reset) goes on up.

    this.addEventListener("sf-empty-state-action", event => {
      const id = event.detail?.id;

      if (id === "retry") {
        event.stopPropagation();
        this.requestRetry();
      } else if (id === "create") {
        event.stopPropagation();
        this.requestCreateIntent();
      } else if (id === "reset-query") {
        event.stopPropagation();
        this.resetQuery(this._emptyContext?.reset ?? "both");
      }
    });
    this._portalContainer = null; // The prefix stays sf-table (rename plan R2): an unkeyed table's preference
    // key is built from it (sf-table/sf-table-<n>), and a renamed key would
    // lose what the person saved.

    this._instanceId = `sf-table-${++tableInstances}`;
    this._selectionPortKey = "[]";
    this._routeContext = null;
    this._querySequence = 0;
    this._pendingQuerySequence = null;
    this._abandonedQuery = false;
    this._filterOptionPages = new Map();
    this._contextViewportBound = false;
    this.contextKeyEvent = this.contextKeyEvent.bind(this);
    this.contextViewportEvent = this.contextViewportEvent.bind(this);
    this.ACTIONS_SETTINGS_ROW = [{
      name: this.text('editActionText'),
      id: 'edit',
      component: {
        type: 'button-icon',
        props: {
          kind: 'icon',
          size: '1',
          appearance: 'link',
          scheme: 'on-surface',
          icon: 'edit',
          ariaLabel: this.text('editActionText'),
          value: 'edit'
        }
      }
    }, {
      name: this.text('viewActionText'),
      id: 'view',
      component: {
        type: 'button-icon',
        props: {
          kind: 'icon',
          size: '1',
          appearance: 'link',
          scheme: 'on-surface',
          icon: 'visibility',
          ariaLabel: this.text('viewActionText'),
          value: 'view'
        }
      }
    }, {
      name: this.text('deleteActionText'),
      id: 'delete',
      // The kit marks its own delete destructive, as the template
      // menu already does (`danger: !isDeleted`): the row menu
      // draws a danger entry in `error`, and a host that narrows
      // this catalogue gets the entry back untouched, so naming
      // delete in a host catalogue only to restore the red row is
      // no longer the price of leaving it to the kit (Larena
      // storage QA, 2026-10-22). The icon in the actions column
      // says the same with `status: 'error'` (decided 2026-10-23,
      // control/VISUAL-DECISIONS.md «Разрушительное действие
      // строкой»): one act must not look like two on the two
      // surfaces of one row, and with the column's default
      // visibility at most one red icon shows at a time. The
      // status paints, the scheme stays the family it falls back
      // to (sf-button-icon: they cannot both paint it).
      danger: true,
      component: {
        type: 'button-icon',
        props: {
          kind: 'icon',
          size: '1',
          appearance: 'link',
          scheme: 'on-surface',
          status: 'error',
          icon: 'delete',
          ariaLabel: this.text('deleteActionText'),
          value: 'delete'
        }
      }
    }]; // Row actions are a system column like select and settings: always last,
    // not resizable or draggable, and never part of saved column settings.

    this.TABLE_ACTIONS_COLUMN = {
      key: "actions",
      label: this.text("actionsColumnLabel"),
      system: true
    };
    this.TABLE_SETTINGS_COLUMN = {
      key: "settings",
      label: "settings",
      system: true,
      width: 'calc(var(--sf-text-height-1) + (var(--sf-ui-1--space-y-tightness-default) * 2) + var(--sf-b6))',
      component: {
        type: "button-icon",
        props: {
          size: "1",
          appearance: "link",
          scheme: "on-surface",
          icon: "settings",
          ariaLabel: this.text("settingsColumnLabel"),
          value: "settings",
          // The gear opens the window and closes it again.
          // One click reaches this twice (the button, then its host), so
          // only a later click closes what this one opened.
          '@click': e => {
            const open = this.state.contextMenu?.open && this.state.contextMenu?.menu === 'table-settings';

            if (open && e.timeStamp - (this._settingsOpenedAt ?? 0) > 200) {
              this.closeContextMenu();
              return;
            }

            if (open) return;
            this._settingsOpenedAt = e.timeStamp;
            this.openContextMenu(e, {
              menu: 'table-settings'
            });
          }
        }
      }
    };
    this.contextEvent = this.contextEvent.bind(this);
    this.hoverEvents = this.hoverEvents.bind(this);
    this.outEvent = this.outEvent.bind(this);
    this._contextEventBound = false;
    this._hoverEventBound = false;
    this._columnResizeEventBound = false;
    this._headerSortableRow = null;
    this._headerSortableDetach = null;
    this._columnResizeState = null;
    this.searchChange = this.scheduleSearchChange.bind(this);
    this._searchDebounceTimer = null;
    this._searchPendingProps = null;
    this._searchHoldKey = '';
    this.refs = {
      contextMenu: this.createRef(),
      items: new Map(),
      templateForm: this.createRef(),
      renameInput: this.createRef(),
      table: this.createRef(),
      scroll: this.createRef(),
      rail: this.createRef(),
      resizeGuide: this.createRef()
    };
    this._currentRowId = null;
    this._checkboxMeasureToken = 0;
    this._responsiveWidth = 0;
    this._responsiveObserver = null;
    this._filterTemplatesLoaded = false;
    this.tempSettings = null;
    this.state = {
      settingsChecked: false,
      bulkActions: [],
      createItems: [],
      // What the toolbar's own control offers, straight from the host.
      toolbarActions: [],
      // What is typed over the list of fields in the column settings.
      columnSettingsQuery: "",
      sort: {
        key: null,
        direction: null
      },
      saveInputValue: '',
      search: {
        searchActive: false,
        value: ''
      },
      contextMenu: {
        open: false
      },
      actions: this.getActions().map(action => Object.assign(action, {
        visible: true
      })),
      actionActive: this.getProp('actions'),
      columnSettings: {},
      selectIndeterminate: false,
      filterDataDirty: false,
      filter: {
        selectedTemplateKey: 'default',
        fields: [],
        templates: [],
        edit: {
          rename: ''
        }
      }
    };
    this.TABLE_SELECT_COLUMN = {
      key: "select",
      label: "select",
      system: true,
      width: 'calc(var(--sf-text-height-1) + var(--sf-b6) + calc(var(--sf-px) * 2))',
      component: {
        type: "checkbox",
        props: {
          position: 'end',
          rootClass: 'content-main-between',
          size: this.size,
          '@change': event => {
            const checked = Boolean(event.target.checked); // Marking the page leaves no single row as the anchor a
            // later Shift-click could extend from, so it is dropped
            // rather than left pointing at whatever was clicked last.

            this._selectionAnchorId = null;
            this.set({
              selectIndeterminate: false,
              settingsChecked: checked
            });
            this.updateRows(row => ({ ...row,
              select: this.getDefaultRowCell(this.TABLE_SELECT_COLUMN, { ...row,
                selected: checked,
                checked
              })
            }), "select-all");
          },
          indeterminate: this.state.selectIndeterminate,
          checked: this.state.settingsChecked,
          ariaLabel: this.text("selectAllLabel")
        }
      },
      rowComponent: {
        type: "checkbox",
        props: {
          position: 'end',
          rootClass: 'content-main-between',
          size: this.size
        }
      }
    };
  } // ---------- the manifest's list settings and values (§4, §18) ----------
  // Each list setting is the property its set-<name> helper writes.


  get rows() {
    return this.getTableData().rows || [];
  }

  set rows(rows) {
    this.setRows(Array.isArray(rows) ? rows : []);
  }

  get columns() {
    return this.getTableData().columns || [];
  }

  set columns(columns) {
    this.setColumns(Array.isArray(columns) ? columns : []);
  }

  get tableData() {
    return this.getTableData();
  }

  set tableData(data) {
    this.setTableData(data && typeof data === "object" ? data : {});
  }

  get tableSettings() {
    return this.getColumnSettings();
  }

  set tableSettings(data) {
    this.setTableSettings(data && typeof data === "object" ? data : {});
  }

  get bulkActions() {
    return this.state?.bulkActions ?? [];
  }

  set bulkActions(actions) {
    this.setBulkActions(actions);
  }

  get createItems() {
    return this.state?.createItems ?? [];
  }

  set createItems(items) {
    this.setCreateItems(items);
  }

  get toolbarActions() {
    return this.getToolbarActions();
  }

  set toolbarActions(items) {
    this.setToolbarActions(items);
  }

  get filterFields() {
    return this.getFilterFields();
  }

  set filterFields(fields) {
    this.setFilterFields(fields);
  }

  get activeFilterFields() {
    return this.getActiveFilterFieldKeys();
  }

  set activeFilterFields(keys) {
    this.setActiveFilterFields(keys);
  }

  get templates() {
    return this.getFilterTemplates();
  }

  set templates(data) {
    this.setTemplates(data);
  } // The host's echo of the order (§4.3 controlled; vocabulary 1.1.5 §2.1):
  // [{key, direction}], the main column first.


  get sort() {
    const {
      key,
      direction
    } = this.state?.sort ?? {};
    return key && direction ? [{
      key,
      direction
    }] : [];
  }

  set sort(list) {
    const first = Array.isArray(list) ? list[0] : list;
    const key = first?.key ?? first?.field ?? null;
    const direction = first?.direction ?? first?.dir ?? null;
    if (key && ["asc", "desc"].includes(direction)) this.setSort(key, direction);else this.setSort(null, null);
  } // The row the page has open: marked aria-current, not focused.


  get current() {
    return this._currentRowId ?? "";
  }

  set current(id) {
    const value = id === null || id === undefined ? "" : String(id);
    this._currentRowId = value || null;

    if ((this.getAttribute("current") ?? "") !== value) {
      if (value) this.setAttribute("current", value);else this.removeAttribute("current");
    } else {
      this.requestComponentUpdate("current");
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "current" && oldValue !== newValue) this._currentRowId = newValue || null;
    super.attributeChangedCallback?.(name, oldValue, newValue);
  }

  get selected() {
    return this._currentRowId ?? undefined;
  }

  get selection() {
    return this.getSelectedRecordIds();
  } // Whether an action was called with its parameters as one object (§4.4).


  isActionParameters(value, names) {
    return value !== null && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype && names.some(name => Object.hasOwn(value, name));
  }

  focusRowAction({
    id
  } = {}) {
    if (id === null || id === undefined || id === "") return {
      outcome: "refused",
      reason: "empty"
    };
    this.focusRow(String(id), {
      reveal: true
    });
    return {
      outcome: "applied"
    };
  } // The old names whose detail §8 changed (split rows of aliases.json).


  sfAliasAdapters() {
    return {
      "sf-table-action-intent": detail => Object.freeze({
        action_id: detail.action,
        record_ids: detail.ids
      }),
      "sf-port-output": detail => Object.freeze({
        port: "selection",
        value: detail.ids
      }),
      onSearchEnd: detail => detail.search
    };
  }

  getActions() {
    if (this.getProp('actions')) {
      return this.ACTIONS_SETTINGS_ROW.map(action => {
        const {
          name,
          id
        } = action;
        return {
          name,
          id
        };
      });
    } else {
      return [];
    }
  }

  isSearchHoldKey(key = '') {
    return key === 'Backspace' || key === 'Delete';
  }

  clearSearchDebounce() {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = null;
    }
  }

  scheduleSearchChange(props = {}) {
    this._searchPendingProps = props;
    this.clearSearchDebounce();

    if (this._searchHoldKey) {
      return this;
    }

    this._searchDebounceTimer = setTimeout(() => {
      const pendingProps = this._searchPendingProps || {};
      this._searchPendingProps = null;
      this._searchDebounceTimer = null;
      this.updateSearchState(pendingProps);
    }, 500);
    return this;
  }

  handleSearchKeyDown(event) {
    if (!this.isSearchHoldKey(event?.key)) {
      return this;
    }

    this._searchHoldKey = event.key;
    this.clearSearchDebounce();
    return this;
  }

  handleSearchKeyUp(event) {
    if (!this._searchHoldKey || event?.key !== this._searchHoldKey) {
      return this;
    }

    this._searchHoldKey = '';

    if (this._searchPendingProps) {
      this.scheduleSearchChange(this._searchPendingProps);
    }

    return this;
  }

  updateSearchState(props = {}, isActiveState = true) {
    const currentSearch = this.state.search || {};
    let needUpdate = false;

    for (const [key, value] of Object.entries(props)) {
      if (!Object.is(currentSearch[key], value)) {
        needUpdate = true;
        break;
      }
    }

    if (!needUpdate) return this;
    this.set(prevState => {
      return {
        search: { ...prevState.search,
          ...props
        }
      };
    });
    if (!isActiveState) return this; // Said at once, not after this render: the host's answer (a data view
    // marking the rows loading) then lands in the same frame, and a search
    // costs one render before its rows, not two (rules of the road, rule 1).
    // The old camelCase onSearchEnd is a dated alias of this name
    // (aliases.json, simai/ui-pro#1): it follows once with its old detail.

    this.emitTableEvent('search-change', {
      search: this.state.search.value
    });
    return this;
  } // Every event by its verb, as the manifest declares it (standard 1.3.8
  // §8): the DOM name is <tag>-<verb>, and the old names follow once
  // through the dated aliases (aliases.json), noted in SF.deprecations when
  // a listener reads them. Answers false when a listener refused a
  // cancelable request.


  emitTableEvent(verb, detail = {}, options = {}) {
    return this.sfEmit(verb, detail, options);
  }

  requestActionIntent(actionId, recordIds, options = {}) {
    // An action takes its parameters as one object too (standard 1.3.8 §4.4).
    if (this.isActionParameters?.(actionId, ["action-id", "actionId"])) {
      ({
        actionId,
        recordIds
      } = {
        actionId: actionId["action-id"] ?? actionId.actionId,
        recordIds: actionId["record-ids"] ?? actionId.recordIds
      });
    }

    if (typeof actionId !== 'string' || !actionId.trim() || !Array.isArray(recordIds) || recordIds.length === 0 || Array.from(recordIds).some(id => !(typeof id === 'string' && id.length > 0 || Number.isSafeInteger(id)))) {
      throw new TypeError('Action intent requires an opaque action ID and nonempty typed record IDs');
    }

    const ids = Object.freeze([...recordIds]);
    const rows = this.getTableData().rows || [];
    const revisions = {};

    for (const id of ids) {
      const revision = rows.find(row => row?.id === id)?.revision;
      if (revision !== undefined && revision !== null) revisions[id] = revision;
    } // Vocabulary §5 apply (§18.3): one row's own action is scope entry, a
    // bulk one scope selection. The old sf-table-action-intent follows
    // with its {action_id, record_ids} (a split row and its adapter).


    const scope = options?.scope ?? (ids.length === 1 ? "entry" : "selection");
    this.emitTableEvent('apply', Object.freeze({
      action: actionId,
      scope,
      ids,
      revisions: Object.freeze(revisions)
    }));
    return {
      outcome: "applied"
    };
  }

  getSelectedRecordIds() {
    return this.getTableData().rows.filter(row => row.select?.component?.props?.checked === true).map(row => row.id);
  }

  setBulkActions(actions = []) {
    if (!Array.isArray(actions) || Array.from(actions).some(action => !action || typeof action !== 'object' || typeof action.id !== 'string' || !action.id.trim() || typeof action.name !== 'string' || !action.name.trim() || Object.keys(action).some(key => key !== 'id' && key !== 'name'))) {
      throw new TypeError('Bulk actions require opaque id and name only');
    }

    return this.set({
      bulkActions: actions.map(({
        id,
        name
      }) => ({
        id,
        name
      }))
    });
  }

  renderBulkActions() {
    if (!this.state.bulkActions?.length) return lit__WEBPACK_IMPORTED_MODULE_12__.nothing;
    const selected = this.getSelectedRecordIds();
    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`<div class="flex flex-wrap gap-1/3">
            ${this.state.bulkActions.map(action => (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`<sf-button
                text=${action.name} ?disabled=${selected.length === 0}
                @click=${() => {
      const ids = this.getSelectedRecordIds();
      if (ids.length) this.requestActionIntent(action.id, ids, {
        scope: "selection"
      });
    }}></sf-button>`)}
        </div>`;
  } // Items for the create split button menu. Choosing one (or the main
  // button, with item null) emits sf-table-create-intent; the host opens its form.


  setCreateItems(items = []) {
    if (!Array.isArray(items) || Array.from(items).some(item => !item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id.trim() || typeof item.name !== 'string' || !item.name.trim() || Object.keys(item).some(key => key !== 'id' && key !== 'name'))) {
      throw new TypeError('Create items require opaque id and name only');
    }

    return this.set({
      createItems: items.map(({
        id,
        name
      }) => ({
        id,
        name
      }))
    });
  }

  requestCreateIntent(itemId = null) {
    if (this.isActionParameters?.(itemId, ["item-id", "itemId"])) itemId = itemId["item-id"] ?? itemId.itemId ?? null;

    if (itemId !== null && !this.state.createItems.some(item => item.id === itemId)) {
      throw new TypeError(`sf-view-table has no create item ${String(itemId)}`);
    }

    this.emitTableEvent('create', Object.freeze({
      item: itemId
    }));
    return {
      outcome: "applied"
    };
  } // The actions of the view itself, set by the host: the toolbar's control is
  // a menu of them. Round three took it off column settings, which the gear
  // in the head already owns, and gave it the job the Bitrix-like tables give
  // it -- everything the page used to carry as its own buttons.


  setToolbarActions(items = []) {
    if (!Array.isArray(items) || Array.from(items).some(item => !item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id.trim() || typeof item.label !== 'string' || !item.label.trim() || item.icon != null && typeof item.icon !== 'string' || item.href != null && !this.isSameSiteHref(item.href) || Object.keys(item).some(key => !['id', 'label', 'icon', 'href'].includes(key)))) {
      throw new TypeError('Toolbar actions require id and label, and an optional icon and same-site href');
    }

    return this.set({
      toolbarActions: items.map(({
        id,
        label,
        icon,
        href
      }) => ({
        id,
        label,
        ...(icon ? {
          icon
        } : {}),
        ...(href ? {
          href
        } : {})
      }))
    });
  }

  getToolbarActions() {
    return (this.state.toolbarActions || []).map(item => ({ ...item
    }));
  } // A link out of the table may only go to this same site. A host that sends
  // another origin is sending the person somewhere the table cannot vouch for.


  isSameSiteHref(href = "") {
    const value = String(href ?? "").trim();
    if (!value || value.startsWith("//")) return false;

    try {
      return new URL(value, document.baseURI).origin === new URL(document.baseURI).origin;
    } catch {
      return false;
    }
  } // The event carries the id, and an item with an href also goes there. The
  // event is cancelable, so a host that routes its own pages keeps the view
  // on the page: it calls preventDefault and navigates itself.


  requestToolbarAction(actionId) {
    const action = this.getToolbarActions().find(item => item.id === actionId);

    if (!action) {
      throw new TypeError(`sf-view-table has no toolbar action ${String(actionId)}`);
    }

    const allowed = this.emitTableEvent('toolbar-action', Object.freeze({
      action: action.id,
      href: action.href ?? null
    }), {
      cancelable: true
    });

    if (allowed && action.href && this.isSameSiteHref(action.href)) {
      window.location.assign(action.href);
    }

    return this;
  }

  renderToolbarActionsContextMenu(data) {
    const {
      x,
      y
    } = data; // The standard menu's entries, not link buttons: a link button in a
    // menu drew centred text on a light block that looked like no other
    // menu in the admin (owner, 2026-10-13).

    const actions = this.getToolbarActions();
    const entries = actions.map(action => ({
      id: String(action.id),
      text: action.label,
      ...(action.icon ? {
        icon: action.icon
      } : {})
    }));

    const select = event => {
      const action = actions.find(item => String(item.id) === event.detail?.id);
      this.closeContextMenu();
      if (action) this.requestToolbarAction(action.id);
    };

    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <sf-menu-context
                    size=${this.size === "1/2" ? "1/2" : "1"}
                    :key=${x + y}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'toolbar-actions'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
          "
                    data-context-main-menu
                    .entries=${entries}
                    @sf-menu-context-select=${select}
            ></sf-menu-context>
        `;
  } // The list has no column heads to sort by, so its sort is a menu: the host's
  // own order, then each sortable column one way and the other. Choosing one
  // raises sf-table-sort-change exactly as a head does.


  renderListSortContextMenu(data) {
    const {
      x,
      y
    } = data;
    const current = this.state.sort || {};

    const choose = (key, direction) => {
      this.closeContextMenu();
      this.setSort(key, direction);
      this.emitTableEvent('sort-change', Object.freeze({
        key,
        direction
      }));
    };

    const choices = new Map();

    const option = (text, key, direction) => {
      const id = `${key ?? ''}:${direction ?? ''}`;
      choices.set(id, [key, direction]);
      return {
        id,
        text,
        kind: 'radio',
        checked: current.key === key && current.direction === direction
      };
    };

    const select = event => {
      const choice = choices.get(event.detail?.id);
      if (choice) choose(...choice);
    };

    const sortable = this.getColumns().filter(column => column?.sortable && !column.system && !["select", "settings", "actions"].includes(column.key));
    const items = [option(this.text('sortNone'), null, null), ...sortable.flatMap(column => [option(`${column.label ?? column.key}, ${this.text('sortAscending')}`, column.key, 'asc'), option(`${column.label ?? column.key}, ${this.text('sortDescending')}`, column.key, 'desc')])];
    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <sf-menu-context
                    size=${this.size === "1/2" ? "1/2" : "1"}
                    :key=${x + y}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'list-sort'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
          "
                    data-context-main-menu
                    .entries=${items}
                    @sf-menu-context-select=${select}
            ></sf-menu-context>
        `;
  }

  renderCreateContextMenu(data) {
    const {
      x,
      y
    } = data;
    const createItems = this.state.createItems;
    const entries = createItems.map(item => ({
      id: String(item.id),
      text: item.name
    }));

    const select = event => {
      const item = createItems.find(entry => String(entry.id) === event.detail?.id);
      this.closeContextMenu();
      if (item) this.requestCreateIntent(item.id);
    };

    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <sf-menu-context
                    size=${this.size === "1/2" ? "1/2" : "1"}
                    :key=${x + y}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'create'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
          "
                    data-context-main-menu
                    .entries=${entries}
                    @sf-menu-context-select=${select}
            ></sf-menu-context>
        `;
  } // Sorting reports intent only: the table marks the header and emits
  // sf-table-sort-change; the host reorders or reloads the rows.


  getSort() {
    return { ...this.state.sort
    };
  }

  setSort(key = null, direction = null) {
    if (this.isActionParameters?.(key, ["key", "direction"])) ({
      key = null,
      direction = null
    } = key);

    if (key === null || direction === null) {
      this.set({
        sort: {
          key: null,
          direction: null
        }
      });
      return {
        outcome: "applied"
      };
    }

    if (typeof key !== 'string' || !key || !['asc', 'desc'].includes(direction)) {
      throw new TypeError('Sort requires a column key and direction asc or desc');
    }

    this.set({
      sort: {
        key,
        direction
      }
    });
    return {
      outcome: "applied"
    };
  }

  toggleSort(key) {
    const current = this.state.sort || {};
    const direction = current.key !== key ? 'asc' : current.direction === 'asc' ? 'desc' : current.direction === 'desc' ? null : 'asc';
    this.setSort(direction ? key : null, direction);
    return this.emitTableEvent('sort-change', Object.freeze({
      key,
      direction
    }));
  } // Pointer capture sends the click that ends a column drag or resize to the
  // header cell; that click must not also sort the column.


  suppressNextHeaderClick() {
    this._suppressHeaderClick = true;
    setTimeout(() => {
      this._suppressHeaderClick = false;
    }, 0);
  }

  handleHeaderSortClick(event, column = {}) {
    if (column.sortable !== true || column.system || this._suppressHeaderClick) return;
    const target = event.composedPath?.()[0] || event.target; // A click on the width strip is not a click on the header's own title.

    if (target instanceof Element && target.closest('.sf-table-column-resizer')) return;
    this.toggleSort(column.key);
  } // Emits the selection output once per change of the explicit selection.


  syncSelectionPort() {
    if (!this._isMounted) return this;
    const ids = this.getSelectedRecordIds();
    const key = JSON.stringify(ids.map(id => [typeof id, id]));
    if (key === this._selectionPortKey) return this;
    this._selectionPortKey = key; // Vocabulary §5 select {ids} (§18.2); the composition port's
    // sf-port-output {port: selection, value} follows once (a split row).

    this.emitTableEvent("select", Object.freeze({
      ids: Object.freeze([...ids])
    }));
    return this;
  } // One row's box has been marked. A plain click marks that row; Shift+click
  // marks every row between the last one marked and this one, with the value
  // the clicked box just took, which is what makes unmarking a range work too.


  applyRowSelection(rowId, checked, {
    range = false
  } = {}) {
    const rows = this.getTableData().rows;

    const sameRow = (row, id) => String(row?.id ?? "") === String(id ?? "");

    const index = rows.findIndex(row => sameRow(row, rowId));
    if (index < 0) return this;
    const anchorIndex = range && this._selectionAnchorId != null ? rows.findIndex(row => sameRow(row, this._selectionAnchorId)) : -1;
    const from = anchorIndex < 0 ? index : Math.min(anchorIndex, index);
    const to = anchorIndex < 0 ? index : Math.max(anchorIndex, index); // The page box is cleared first: a row cell asks `settingsChecked`
    // whether it is marked, so leaving it set would mark the rows this call
    // is unmarking back again.

    this.set({
      settingsChecked: false
    });
    this.updateRows((row, position) => position < from || position > to ? row : { ...row,
      selected: checked,
      checked,
      select: this.getDefaultRowCell(this.TABLE_SELECT_COLUMN, { ...row,
        selected: checked,
        checked
      })
    }, range && anchorIndex >= 0 ? "select-range" : "select-row");
    this._selectionAnchorId = rowId;
    return this.syncSelectAllState();
  } // The page box answers for the rows under it: all of them, some of them, or
  // none. It is computed from the rows rather than counted as rows are
  // clicked, so appended rows and a replaced page cannot drift from it.


  syncSelectAllState() {
    const count = this.getSelectedRecordIds().length;
    const total = this.getTableData().rows.length;
    return this.set({
      settingsChecked: total > 0 && count === total,
      selectIndeterminate: count > 0 && count < total
    });
  } // What a pointer press has to settle before the click arrives: whether a
  // range is being extended, and that the press must not start a text
  // selection. A Shift-click or a second click otherwise selects the text of
  // every row it passes over, which is what the host reported.


  handleRowPointerDown(event) {
    this._selectRangeModifier = event?.shiftKey === true;

    if (event?.shiftKey === true || event?.detail > 1) {
      event.preventDefault?.();
    }

    return this;
  } // Controls inside a row answer for themselves. A click on a box, a row
  // menu, a link, a button or a field is that control's click, and neither
  // focuses the row nor opens the record.


  isRowControlTarget(target) {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('td[data-key="select"], td[data-key="settings"], a[href], button, input, select, textarea,' + ' [role="button"], [role="link"], sf-checkbox, sf-dropdown, sf-button, sf-button-icon'));
  } // A single click makes the row the current one — wherever in the row it
  // lands. It does not mark it: marking is the box's job, and a click that did
  // both would let a stray click destroy a selection the person had built up.
  //
  // The first version skipped a click on anything interactive, which read
  // well until a consumer's cells turned out to be links: clicking the only
  // content a cell has left the row unmarked as current, and the rule looked
  // broken rather than careful. A control still does its own work — a link
  // still follows, a box still marks — and the row moving under the pointer
  // takes nothing away from that. Only opening the record stays off limits
  // from a control.


  handleRowClick(event, row, index = -1) {
    this.focusRow(this.getRowKey(row, index));
    this.openReferenceFromCell(event, row);
    return this;
  } // A value that points at another record -- a person, a file, a related
  // record -- opens that record in the page's panel instead of loading a page
  // (owner, 2026-10-14): the table asks with sf-table-reference-open and the
  // data view raises record.open {field, value, href}. A click with a
  // modifier or the middle button still follows the address, so a new tab is
  // one keystroke away; a host that cannot open it gets the address.


  openReferenceFromCell(event, row) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target?.closest?.("a[href]");
    const cell = link?.closest?.("td[data-key]");
    if (!link || !cell || !this.contains(cell)) return;
    const field = cell.dataset.key;
    const value = row?.[field];
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || link.target === "_blank" || link.hasAttribute("download")) return;
    const asked = this.emitTableEvent("reference-open", {
      recordId: row?.id ?? null,
      field,
      value: value ?? null,
      href
    }, {
      cancelable: true
    }); // Only a listener that takes it (cancels the event) keeps the page.

    if (!asked) event.preventDefault();
  } // Which row this is, for the purpose of being the current one. The rest of
  // the template already keys a row by `id`, then `value`, then its position,
  // because the table is given rows keyed all three ways; the current row
  // followed `id` alone, so in a view whose rows carry another key a click
  // marked nothing and looked broken. Opening a record still needs a real id
  // — there is nothing to open without one.


  getRowKey(row, index = -1) {
    const value = row?.id ?? row?.value;

    if (value !== undefined && value !== null && String(value) !== "") {
      return String(value);
    }

    return index >= 0 ? `index:${index}` : "";
  } // Whether a row's action buttons are drawn: always when the host asks
  // (row-actions-visible="always"), else in the row under the pointer, the
  // row holding the focus and the current row.


  actionsShownFor(row) {
    if (this.getAttribute("row-actions-visible") === "always") return true;
    const key = String(row?.id ?? row?.value ?? "");
    if (!key) return true;
    return key === this._pointerRowKey || key === this._focusRowKey || String(this._currentRowId ?? "") === key;
  }

  setActionsRow(kind, key) {
    const field = kind === "focus" ? "_focusRowKey" : "_pointerRowKey";
    const next = key ? String(key) : null;
    if (this[field] === next) return;
    this[field] = next; // The buttons of one row, not the table's layout: no measuring after it.

    this._layoutUnchanged = true;
    this.requestComponentUpdate("row-actions");
  }

  bindRowActionsEvents(table) {
    if (!table || this._rowActionsTable === table) return;
    this._rowActionsAbort?.abort();
    this._rowActionsAbort = new AbortController();
    this._rowActionsTable = table;
    const {
      signal
    } = this._rowActionsAbort;

    const rowKey = target => target?.closest?.("tbody tr[data-row-id]")?.dataset.rowId ?? null;

    table.addEventListener("pointerover", event => this.setActionsRow("pointer", rowKey(event.target)), {
      signal
    }); // A dragged row carries its record, or every selected record when it is
    // one of them (owner, 2026-10-15, the file manager): a tree that
    // accepts records says where they were dropped.

    table.addEventListener("dragstart", event => {
      const key = rowKey(event.target);
      if (!key || !this.hasAttribute("drag-rows") || !event.dataTransfer) return;
      const selected = this.getSelectedRecordIds?.() ?? [];
      const ids = selected.map(String).includes(key) ? selected.map(String) : [key];
      const source = this.getAttribute("preferences-key") || this.getAttribute("table-settings-key") || this.id || null;
      event.dataTransfer.setData("application/x-sf-records+json", JSON.stringify({
        ids,
        source
      }));
      event.dataTransfer.setData("text/plain", ids.join(", "));
      event.dataTransfer.effectAllowed = "copyMove";
      this.emitTableEvent("rows-drag", Object.freeze({
        ids,
        source
      }));
    }, {
      signal
    }); // Reordering inside the list: a row dragged over another goes before
    // it, or after it from its lower half; the drop says which rows moved
    // and the row they now stand before (null: the end). The host decides.

    const reorder = () => this.getAttribute("row-reorder") === "true";

    const dropMark = (row, after) => {
      for (const marked of table.querySelectorAll("tbody tr[data-sf-drop-before], tbody tr[data-sf-drop-after]")) {
        marked.removeAttribute("data-sf-drop-before");
        marked.removeAttribute("data-sf-drop-after");
      }

      if (row) row.setAttribute(after ? "data-sf-drop-after" : "data-sf-drop-before", "");
    };

    const dropTarget = event => {
      const row = event.target?.closest?.("tbody tr[data-row-id]");
      if (!row) return null;
      const box = row.getBoundingClientRect();
      return {
        row,
        after: event.clientY > box.top + box.height / 2
      };
    };

    table.addEventListener("dragstart", event => {
      const key = rowKey(event.target);
      if (!key || !reorder() || !event.dataTransfer) return;
      this._reorderDrag = [key];
      event.dataTransfer.setData("application/x-sf-row-order", key);
      event.dataTransfer.effectAllowed = "move";
    }, {
      signal
    });
    table.addEventListener("dragover", event => {
      if (!this._reorderDrag || !reorder()) return;
      const target = dropTarget(event);
      if (!target) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      dropMark(target.row, target.after);
    }, {
      signal
    });
    table.addEventListener("drop", event => {
      if (!this._reorderDrag || !reorder()) return;
      const target = dropTarget(event);
      dropMark(null);
      const ids = this._reorderDrag;
      this._reorderDrag = null;
      if (!target) return;
      event.preventDefault();
      const keys = [...table.querySelectorAll("tbody tr[data-row-id]")].map(row => row.dataset.rowId);
      const at = keys.indexOf(target.row.dataset.rowId) + (target.after ? 1 : 0);
      const rest = keys.slice(at).filter(key => !ids.includes(key));
      const before = rest[0] ?? null;
      const now = keys.filter(key => !ids.includes(key));
      const place = before === null ? now.length : now.indexOf(before);
      const order = [...now.slice(0, place), ...ids, ...now.slice(place)];
      if (order.join("\u0000") === keys.join("\u0000")) return;
      this.emitTableEvent("move", Object.freeze({
        ids: [...ids],
        before,
        order
      }));
    }, {
      signal
    });
    table.addEventListener("dragend", () => {
      this._reorderDrag = null;
      dropMark(null);
    }, {
      signal
    });
    table.addEventListener("pointerleave", () => this.setActionsRow("pointer", null), {
      signal
    });
    table.addEventListener("focusin", event => this.setActionsRow("focus", rowKey(event.target)), {
      signal
    });
    table.addEventListener("focusout", event => {
      if (!table.contains(event.relatedTarget)) this.setActionsRow("focus", null);
    }, {
      signal
    });
  }

  isCurrentRow(row, index = -1) {
    const key = this.getRowKey(row, index);
    return key !== "" && String(this._currentRowId ?? "") === key;
  } // ---------- many entries (§18.4) ----------
  // The rows drawn now, when the list is long enough to be windowed: the
  // range, and the heights of the spacers that stand for the rest.


  windowSlice(rows = []) {
    const count = rows.length;

    if (count < WINDOW_FROM || this.isList) {
      this._windowed = false;
      this._windowCount = count;
      return null;
    }

    this._windowed = true;
    this._windowCount = count;
    const height = this._rowHeight || ROW_HEIGHT_GUESS;
    const range = this.clampWindow(this._windowRange ?? {
      first: 0,
      last: WINDOW_INITIAL - 1
    }, count);
    this._windowRange = range;
    return {
      first: range.first,
      last: range.last,
      before: range.first * height,
      after: Math.max(0, count - 1 - range.last) * height
    };
  }

  clampWindow({
    first = 0,
    last = 0
  } = {}, count = 0) {
    const lastIndex = Math.max(0, count - 1);
    const from = Math.min(Math.max(0, Math.floor(first)), lastIndex);
    const to = Math.min(Math.max(from, Math.floor(last)), lastIndex);
    return {
      first: from,
      last: to
    };
  } // aria-rowcount of a windowed table: every row, the head's included.


  windowRowCount() {
    return this._windowed ? String((this._windowCount ?? 0) + 1) : null;
  } // Which rows a person can see: the body's place against the viewport and
  // the table's own scroll box, in row heights.


  seenRows(count) {
    const body = this.refs.table?.value?.tBodies?.[0];
    if (!body || !count) return null;
    const box = body.getBoundingClientRect();
    let top = 0;
    let bottom = globalThis.innerHeight || document.documentElement.clientHeight || 0;
    const scroll = this.refs.scroll?.value;

    if (scroll) {
      const clip = scroll.getBoundingClientRect();
      top = Math.max(top, clip.top);
      bottom = Math.min(bottom, clip.bottom);
    }

    const height = this._rowHeight || ROW_HEIGHT_GUESS;
    const lastIndex = count - 1;
    const first = Math.min(lastIndex, Math.max(0, Math.floor((top - box.top) / height)));
    const last = Math.min(lastIndex, Math.max(first, Math.ceil((bottom - box.top) / height)));
    return {
      first,
      last
    };
  } // After a render and on every scroll: measure a drawn row, and move the
  // range when the rows in view come near its edge. Answers whether the
  // range moved.


  syncWindow() {
    if (!this._windowed) return false;
    const table = this.refs.table?.value;
    const drawn = table?.querySelectorAll?.("tbody tr[data-row-id]") ?? [];
    let moved = false;

    if (drawn.length) {
      // The average of the drawn rows: a row of two lines among rows of
      // one does not throw the spacers off.
      const first = drawn[0].getBoundingClientRect();
      const last = drawn[drawn.length - 1].getBoundingClientRect();
      const height = (last.bottom - first.top) / drawn.length;

      if (height > 0 && Math.abs(height - (this._rowHeight || 0)) > 0.5) {
        this._rowHeight = height;
        moved = true;
      }
    }

    const count = this._windowCount ?? 0;
    const seen = this.seenRows(count);
    if (!seen) return false;
    const range = this._windowRange ?? {
      first: 0,
      last: WINDOW_INITIAL - 1
    };
    const lowEdge = range.first > 0 ? range.first + WINDOW_MARGIN / 2 : 0;
    const highEdge = range.last < count - 1 ? range.last - WINDOW_MARGIN / 2 : count - 1;

    if (seen.first < lowEdge || seen.last > highEdge) {
      this._windowRange = this.clampWindow({
        first: seen.first - WINDOW_MARGIN,
        last: seen.last + WINDOW_MARGIN
      }, count);
      moved = true;
    }

    if (!moved) return false;
    this._windowOnly = true;
    this.requestComponentUpdate("window");
    const {
      first,
      last
    } = this._windowRange;

    if (this._reportedWindow !== `${first}-${last}`) {
      this._reportedWindow = `${first}-${last}`;
      this.emitTableEvent("window", {
        first,
        last
      });
    }

    return true;
  }

  bindWindowScroll() {
    if (this._windowScrollAbort) return;
    this._windowScrollAbort = new AbortController();
    const signal = this._windowScrollAbort.signal;

    const onScroll = () => {
      if (!this._windowed || this._windowFrame) return;
      this._windowFrame = requestAnimationFrame(() => {
        this._windowFrame = 0;
        if (this.isConnected) this.syncWindow();
      });
    }; // Any scroll box between the rows and the page moves them: listened
    // once, in the capture phase, on the document.


    document.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true,
      signal
    });
    globalThis.addEventListener?.("resize", onScroll, {
      passive: true,
      signal
    });
  }

  unbindWindowScroll() {
    this._windowScrollAbort?.abort();
    this._windowScrollAbort = null;
    if (this._windowFrame) cancelAnimationFrame(this._windowFrame);
    this._windowFrame = 0;
  } // A cell that only shows a value is class markup (§18.4): what kind of
  // markup this one is, or null for a cell the full renderer draws.


  rowMarkupCell(row, column) {
    const key = column?.key;
    if (!key || !row) return null;
    const size = this.size === "1/2" ? "1/2" : "1";

    if (key === "select") {
      const cell = row.select?.component;
      if (cell?.type !== "checkbox" || typeof cell.props?.["@change"] !== "function") return null;
      return {
        kind: "box",
        size,
        checked: cell.props.checked === true,
        value: String(cell.props.value ?? row.id ?? ""),
        label: cell.props.ariaLabel ?? "",
        change: cell.props["@change"]
      };
    }

    if (key === "settings") {
      const cell = row.settings?.component;
      if ((0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(`sf-${String(cell?.type ?? "").replace(/^sf-/u, "")}`) !== "sf-button-icon" || cell.props?.icon !== "menu" || typeof cell.props?.["@click"] !== "function") return null;
      return {
        kind: "menu",
        size,
        label: cell.props.ariaLabel ?? this.text("menuLabel"),
        click: cell.props["@click"]
      };
    } // The actions cell keeps one kind whether its buttons show or not: a
    // row whose arrangement changes is drawn anew, and the focus that
    // brought the buttons in would leave with the old row.


    if (column.system || column.component || column.renderer === "link" || column.role === "title") return null;
    if (this.isTree() || row.path || this.cellEditable(row, column)) return null;
    const value = row[key];
    if (value === null || typeof value === "undefined") return {
      kind: "empty"
    };
    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") return null;

    if (LONG_TEXT_CELL_TYPES.has(column.propertyType ?? column.property_type ?? column.type) && typeof value !== "boolean") {
      const text = this.cellText(column, value);
      return {
        kind: "text",
        className: "sf-table-cell-clip",
        text,
        title: text
      };
    }

    const typed = this.getTypedCellValue(column, value);

    if (typed !== null && typeof typed !== "undefined") {
      if (typeof typed !== "string" && typeof typed !== "number") return null;
      return {
        kind: "text",
        className: "sf-table-cell-bare",
        text: String(typed)
      };
    }

    if (typeof value === "boolean") return null;
    const text = String(value);
    return {
      kind: "text",
      className: "sf-table-cell-text",
      text,
      title: text.length > 80 ? text : null
    };
  } // The rows a keyboard walks: the drawn and the undrawn, never a «show
  // more» line.


  keyboardRows() {
    return (this.getTableData().rows || []).filter(row => row && !row.__tree?.more);
  } // The current row is marked in the page rather than through state. Going
  // through state re-rendered the rows on every click, and a render between a
  // box's click and its change event swallowed the change — one click on a
  // row was enough to lose a Shift-range selection. The field is read back by
  // the template, so a later render keeps the mark.


  focusRow(rowId, {
    reveal = false
  } = {}) {
    // The action focus-row {id} (component.json) answers an outcome.
    if (rowId && typeof rowId === "object") return this.focusRowAction(rowId);
    if (rowId == null || rowId === "") return this;
    this._currentRowId = String(rowId);
    const table = this.refs.table?.value;
    if (!table) return this;
    const selector = `tbody tr[data-row-id="${String(rowId).replace(/"/gu, '\\"')}"]`;

    for (const marked of table.querySelectorAll("tbody tr[data-current]")) {
      marked.removeAttribute("data-current");
    }

    const row = table.querySelector(selector);

    if (!row && this._windowed) {
      // A row outside the drawn range: the range moves to it, and the row
      // takes the focus once it is drawn (§18.4).
      const rows = this.getTableData().rows || [];
      const index = rows.findIndex((one, at) => this.getRowKey(one, at) === String(rowId));

      if (index >= 0) {
        this._windowRange = this.clampWindow({
          first: index - WINDOW_MARGIN,
          last: index + WINDOW_MARGIN
        }, rows.length);
        this._pendingFocusRow = String(rowId);
        this._windowOnly = true;
        this.requestComponentUpdate("window");
      }

      return this;
    }

    row?.setAttribute("data-current", ""); // At once, not smoothly: a page that scrolls smoothly would move the
    // window back to where it passes before it arrives.

    if (reveal) row?.scrollIntoView?.({
      block: "nearest",
      behavior: "instant"
    });
    row?.focus?.({
      preventScroll: true
    });
    return this;
  } // A double click opens the record, and only when the record says it can be
  // opened: the row has to offer the view action. Without it the double click
  // does nothing at all — silently, because a person double-clicking a row
  // that cannot be opened has not made a mistake worth a message.


  canOpenRow(row) {
    return Array.isArray(row?.actions) && row.actions.includes("view");
  }

  handleRowOpen(event, row) {
    if (this.isRowControlTarget(event?.target) || !this.canOpenRow(row)) return this;
    const id = row?.id;
    if (id == null) return this;
    return this.requestActionIntent("view", [id]);
  } // The keyboard reaches the same two answers as the pointer: Enter opens the
  // row, Space marks it. Without them the row would be focusable and mute,
  // and marking would be reachable only by pointing at the box.
  // ─── the tree (data view port 1.8.0) ─────────────────────────────────────
  // A table is a tree when its rows carry __tree, which the data view writes
  // from the host's levels. The table only draws it and says what a person
  // asked for; which nodes exist and what opening one means is the view's.
  // Read for every cell of a draw: answered once per list (the rows array is
  // replaced, never edited in place).


  isTree() {
    const rows = this.getTableData?.().rows ?? [];
    if (this._treeMemo?.rows !== rows) this._treeMemo = {
      rows,
      tree: rows.some(row => row?.__tree)
    };
    return this._treeMemo.tree;
  } // The column a tree hangs from: the one the host marked as the title, or
  // the first column that holds data.


  treeColumnKey(columns = this.getColumns()) {
    if (!this.isTree()) return null;
    const data = columns.filter(column => column?.key && !["select", "settings", "actions"].includes(column.key) && !column.system);
    return (data.find(column => column.role === "title") ?? data[0])?.key ?? null;
  }

  toggleTreeRow(row) {
    if (this.isActionParameters?.(row, ["row"]) && !row.__tree) row = row.row;
    if (!row?.__tree?.hasChildren) return {
      outcome: "refused",
      reason: "no-children"
    };
    this.emitTableEvent("expand", Object.freeze({
      id: row.id,
      expanded: row.__tree.expanded === true
    }));
    return {
      outcome: "applied"
    };
  }

  requestTreeMore(row) {
    if (this.isActionParameters?.(row, ["row"]) && !row.__tree) row = row.row;
    if (!row?.__tree?.more) return {
      outcome: "refused",
      reason: "no-more"
    };
    this.emitTableEvent("load-more", Object.freeze({
      direction: "after",
      parent: row.__tree.parent,
      cursor: row.__tree.cursor ?? null
    }));
    return {
      outcome: "applied"
    };
  }

  handleRowKeydown(event, row) {
    if (event?.target !== event?.currentTarget) return this; // A treegrid row: the right arrow opens a closed node, the left arrow
    // closes an open one.

    if (row?.__tree?.hasChildren && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      const open = row.__tree.expanded === true;

      if (event.key === "ArrowRight" !== open) {
        event.preventDefault?.();
        return this.toggleTreeRow(row);
      }
    }

    if (event.key === "Enter") {
      return this.handleRowOpen({
        target: event.currentTarget
      }, row);
    } // The arrows, Home and End move between rows, drawn or not (§4.6,
    // §18.4): a row outside the window is drawn and then focused.


    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) && !event.altKey && !event.metaKey && !event.ctrlKey) {
      const rows = this.keyboardRows();
      const at = rows.findIndex(one => String(one?.id ?? one?.value) === String(row?.id ?? row?.value));
      const to = {
        ArrowDown: at + 1,
        ArrowUp: at - 1,
        Home: 0,
        End: rows.length - 1
      }[event.key];

      if (at >= 0 && to >= 0 && to < rows.length && to !== at) {
        event.preventDefault?.();
        this.focusRow(this.getRowKey(rows[to], to), {
          reveal: true
        });
      }

      return this;
    }

    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault?.();
      const checked = row?.select?.component?.props?.checked !== true;
      return this.applyRowSelection(row?.id, checked, {
        range: event.shiftKey === true
      });
    }

    return this;
  }

  clearSelection() {
    this._selectionAnchorId = null;
    this.set({
      settingsChecked: false,
      selectIndeterminate: false
    });
    if (!this.getSelectedRecordIds().length) return {
      outcome: "applied"
    };
    this.updateRows(row => ({ ...row,
      selected: false,
      checked: false,
      select: this.getDefaultRowCell(this.TABLE_SELECT_COLUMN, { ...row,
        selected: false,
        checked: false
      })
    }), "select-clear");
    return {
      outcome: "applied"
    };
  } // Composition input port. Only declared ports are accepted; the table never
  // resolves a relation itself. It asks the host through a typed query intent.


  sfPortInput(port, value, meta = {}) {
    if (!Object.hasOwn(SF_TABLE_PORTS.inputs, port)) {
      throw new TypeError(`sf-view-table has no input port ${String(port)}`);
    }

    const recordIds = checkedRecordIds(value);
    const sequence = Number.isSafeInteger(meta?.sequence) && meta.sequence > this._querySequence ? meta.sequence : this._querySequence + 1;
    this._routeContext = Object.freeze({
      record_ids: recordIds
    });
    this._querySequence = sequence;
    this.clearSelection();
    this.requestContextQuery(sequence);
    return undefined;
  }

  requestContextQuery(sequence) {
    this._pendingQuerySequence = sequence;
    this._abandonedQuery = false;
    this.setDataState("loading");
    return this.emitTableEvent("query", Object.freeze({
      reason: "context",
      context: this._routeContext,
      sequence
    }));
  }

  onConnected() {
    super.onConnected(); // The content widths are read once the rows are drawn, and a font or
    // a component's stylesheet that arrives after that makes the same
    // content wider: columns measured before it stayed narrow and their
    // values wrapped onto two lines until something re-rendered the table
    // (owner, 2026-10-14: «after I changed the sort it was right»). The
    // Loader brings a part's stylesheet when the page first uses it, and
    // fonts load late, so both send the widths to be read again.

    if (!this._lateLayoutAbort) {
      this._lateLayoutAbort = new AbortController();
      const signal = this._lateLayoutAbort.signal;

      const again = () => {
        if (this._lateLayoutFrame) return;
        this._lateLayoutFrame = requestAnimationFrame(() => {
          this._lateLayoutFrame = 0;
          if (this.isConnected && this.measureContentWidths()) this.widthsChanged();
        });
      };

      document.fonts?.addEventListener?.("loadingdone", again, {
        signal
      });
      document.fonts?.ready?.then?.(() => {
        if (!signal.aborted) again();
      });
      document.addEventListener("load", event => {
        if (event.target?.localName === "link" && /stylesheet/u.test(event.target.rel)) again();
      }, {
        capture: true,
        signal
      });
    }

    if (typeof ResizeObserver !== "undefined" && !this._responsiveObserver) {
      this._responsiveObserver = new ResizeObserver(([entry]) => {
        const width = Math.floor(entry.contentRect.width);

        if (width > 0 && width !== this._responsiveWidth) {
          this._responsiveWidth = width;
          this.requestComponentUpdate("responsive-columns");
        }

        this.measurePinnedColumns();
      });

      this._observeResponsiveBox();
    }

    if (this._abandonedQuery && this._routeContext) {
      this._querySequence += 1;
      this.requestContextQuery(this._querySequence);
    }
  } // Latest result wins: only the answer to the newest pending context query
  // is applied, and at most once.


  applyQueryResult(sequence, rows) {
    if (this.isActionParameters?.(sequence, ["sequence", "rows"])) ({
      sequence,
      rows
    } = sequence);

    if (!Number.isSafeInteger(sequence) || sequence !== this._pendingQuerySequence || !Array.isArray(rows)) {
      return {
        outcome: "refused",
        reason: "stale"
      };
    }

    this._pendingQuerySequence = null;
    this.setRows(rows);
    this.setDataState("auto");
    return {
      outcome: "applied"
    };
  }

  getQueryContext() {
    return this._routeContext;
  }

  getItemRef(id) {
    if (!this.refs.items.has(id)) {
      this.refs.items.set(id, this.createRef());
    }

    return this.refs.items.get(id);
  } // The table had its own copy of this, which created an element on every
  // render; the base's one keeps the element a position in the template
  // already has. Nothing else about the call changes.


  setIndeterminate() {
    const checked = this.state.data.rows.filter(row => {
      return row.select.component.props.checked;
    });
    return checked.length;
  }

  getTableData() {
    const data = this.state?.data;
    return data && typeof data === "object" ? data : {
      columns: [],
      rows: []
    };
  }

  isContextMenuEvent(event) {
    const target = event?.target;

    if (!(target instanceof Node)) {
      return false;
    }

    const portal = this._portalContainer;

    if (portal instanceof Node && (portal === target || portal.contains(target))) {
      return true;
    }

    const contextMenu = this.refs?.contextMenu?.value;

    if (!(contextMenu instanceof Node)) {
      return false;
    }

    if (contextMenu === target || contextMenu.contains(target)) {
      return true;
    }

    return event.composedPath?.().includes(contextMenu) || false;
  }

  contextEvent(event) {
    if (this.isContextMenuEvent(event)) {
      return;
    } // Nothing in the column settings window is pending any more -- the pin,
    // the tick and the order each apply as they are made -- so a click away
    // has nothing of theirs to lose. What it still drops is the filter form
    // a person was filling in, which is a query rather than a setting.


    this.tempSettings = null;
    this.closeContextMenu(false);
  }

  splitItemsByColumns(items = [], columnCount = 1) {
    const normalizedItems = Array.isArray(items) ? items : [];
    const normalizedColumnCount = Math.max(1, Number(columnCount) || 1);
    const itemsPerColumn = Math.ceil(normalizedItems.length / normalizedColumnCount);

    if (!itemsPerColumn) {
      return [];
    }

    return Array.from({
      length: normalizedColumnCount
    }, (_, index) => normalizedItems.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn)).filter(columnItems => columnItems.length);
  }

  getPendingFilterState(filter = this.state?.filter || {}) {
    const tempFilter = this.tempSettings?.filter || {};
    const hasTempSelectedTemplateKey = Object.prototype.hasOwnProperty.call(tempFilter, "selectedTemplateKey");
    return { ...filter,
      ...tempFilter,
      selectedTemplateKey: hasTempSelectedTemplateKey ? tempFilter.selectedTemplateKey : filter.selectedTemplateKey,
      templates: tempFilter.templates || filter.templates || []
    };
  }

  getSortedFilterTemplates(filter = this.state?.filter || {}) {
    const templates = this.getFilterTemplates(filter);
    return templates.map((template, sourceIndex) => ({ ...template,
      sourceIndex,
      order: typeof template.order === "number" ? template.order : sourceIndex
    })).sort((left, right) => {
      if (Boolean(left.pinned) !== Boolean(right.pinned)) {
        return left.pinned ? -1 : 1;
      }

      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.sourceIndex - right.sourceIndex;
    });
  }

  changeTempFilterTemplateSettings(key, patch = {}) {
    if (!key) return;
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map(template => {
      for (const [k, v] of Object.entries(patch)) {
        template[k] = key === template.key ? v : !v;
      }

      return template;
    });
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: currentFilter.selectedTemplateKey,
        templates
      }
    };
    this.requestComponentUpdate("temp-filter-template");
  }

  patchTempFilterTemplateSettings(key, patch = {}) {
    if (!key) return;
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map(template => template.key === key ? { ...template,
      ...(typeof patch === "function" ? patch(template) : patch)
    } : template);
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: currentFilter.selectedTemplateKey,
        templates
      }
    };
    this.requestComponentUpdate("temp-filter-template");
  }

  selectTempFilterTemplate(key) {
    if (!key) return;
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map(template => ({ ...template,
      selected: template.key === key
    }));
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: key,
        templates
      }
    };
    this.requestComponentUpdate("temp-filter-template");
  }

  normalizeFilterTemplate(template = {}, sourceIndex = 0) {
    const key = template.key || `filter_template_${sourceIndex + 1}`;
    const data = template.data && typeof template.data === "object" ? template.data : {};
    return { ...template,
      key,
      label: template.label || data.template_name || key,
      data: { ...data,
        values: { ...(data.values || {})
        },
        tags: { ...(data.tags || {})
        }
      }
    };
  }

  getFilterTemplates(filter = this.state?.filter || {}) {
    const templates = (filter.templates || []).map((template, index) => this.normalizeFilterTemplate(template, index));

    if (templates.length) {
      return templates;
    }

    return [this.normalizeFilterTemplate({
      key: filter.selectedTemplateKey || "default",
      label: this.text("defaultTemplateText"),
      selected: true,
      order: 0,
      data: {}
    })];
  }

  getFilterTemplateByKey(key, filter = this.state?.filter || {}) {
    if (!key || !filter) return null;
    return this.getFilterTemplates(filter).find(template => template.key === key) || null;
  }

  getSelectedFilterTemplate(filter = this.state?.filter || {}) {
    const templates = this.getFilterTemplates(filter);
    const hasSelectedTemplateKey = Object.prototype.hasOwnProperty.call(filter, "selectedTemplateKey");

    if (hasSelectedTemplateKey && filter.selectedTemplateKey === "") {
      return null;
    }

    const selectedKey = filter.selectedTemplateKey || templates.find(template => template.selected)?.key || templates[0]?.key || "";
    return this.getFilterTemplateByKey(selectedKey, { ...filter,
      templates
    }) || templates[0] || null;
  }

  getCurrentFilterValues(filter = this.state?.filter || {}) {
    const selectedTemplate = this.getSelectedFilterTemplate(filter);
    return { ...(selectedTemplate?.data?.values || {})
    };
  }

  getCurrentFilterTags(filter = this.state?.filter || {}) {
    const selectedTemplate = this.getSelectedFilterTemplate(filter);
    return { ...(selectedTemplate?.data?.tags || {})
    };
  }

  normalizeFilterDataForCompare(value) {
    if (Array.isArray(value)) {
      return value.map(item => this.normalizeFilterDataForCompare(item));
    }

    if (value && typeof value === "object") {
      return Object.keys(value).sort().reduce((result, key) => ({ ...result,
        [key]: this.normalizeFilterDataForCompare(value[key])
      }), {});
    }

    return value;
  }

  isSameFilterData(current, next) {
    return JSON.stringify(this.normalizeFilterDataForCompare(current || {})) === JSON.stringify(this.normalizeFilterDataForCompare(next || {}));
  }

  getMergedFilterDraftData(filter = this.state?.filter || {}, tempFilter = this.tempSettings?.filter || {}) {
    const baseFilter = this.getPendingFilterState({ ...filter,
      selectedTemplateKey: Object.prototype.hasOwnProperty.call(tempFilter, "selectedTemplateKey") ? tempFilter.selectedTemplateKey : filter.selectedTemplateKey,
      templates: tempFilter.templates || filter.templates || []
    });
    const currentTags = this.getCurrentFilterTags(baseFilter);
    const currentValues = this.getCurrentFilterValues(baseFilter);
    const tags = tempFilter.replaceTags ? { ...(tempFilter.tags || {})
    } : { ...currentTags,
      ...(tempFilter.tags || {})
    };
    const values = tempFilter.replaceValues ? { ...(tempFilter.values || {})
    } : { ...currentValues,
      ...(tempFilter.values || {})
    };
    Object.entries(tempFilter.values || {}).forEach(([key, value]) => {
      if (!this.isEmptyFilterEntry(value)) {
        return;
      }

      delete values[key];
      delete tags[key];
    });
    return {
      filter: baseFilter,
      tags,
      values
    };
  }

  hasPendingFilterDataChanges(filter = this.state?.filter || {}) {
    const tempFilter = this.tempSettings?.filter;

    if (!tempFilter || !Object.prototype.hasOwnProperty.call(tempFilter, "tags") && !Object.prototype.hasOwnProperty.call(tempFilter, "values") && !tempFilter.replaceTags && !tempFilter.replaceValues) {
      return false;
    }

    const draft = this.getMergedFilterDraftData(filter, tempFilter);
    return !this.isSameFilterData(this.getCurrentFilterTags(draft.filter), draft.tags) || !this.isSameFilterData(this.getCurrentFilterValues(draft.filter), draft.values);
  } // The filter window waits for its button, so a draft and a live query look
  // alike -- the same confusion the pins had, in the window where waiting is
  // the right behaviour. This counts what a press would change, by field: a
  // field whose tag was switched on or off, or whose value or operator
  // differs. Fields are what a person reads as conditions.


  countPendingFilterConditionChanges(filter = this.state?.filter || {}) {
    const tempFilter = this.tempSettings?.filter;
    if (!tempFilter) return 0;
    const draft = this.getMergedFilterDraftData(filter, tempFilter);
    const current = {
      tags: this.getCurrentFilterTags(draft.filter),
      values: this.getCurrentFilterValues(draft.filter)
    };

    const same = (left, right) => this.isSameFilterData(left, right);

    const keys = new Set([...Object.keys(current.tags || {}), ...Object.keys(draft.tags || {}), ...Object.keys(current.values || {}), ...Object.keys(draft.values || {})]);
    let changed = 0;

    for (const key of keys) {
      const wasActive = Boolean((current.tags || {})[key]?.active);
      const willBeActive = Boolean((draft.tags || {})[key]?.active);

      if (wasActive !== willBeActive) {
        changed += 1;
        continue;
      }

      if (!same((current.values || {})[key], (draft.values || {})[key])) {
        changed += 1;
      }
    }

    return changed;
  }

  hasUnsavedFilterDataChanges() {
    return Boolean(this.state?.filterDataDirty && this.getSelectedFilterTemplate(this.state?.filter || {}));
  }

  saveCurrentFilterTemplateData() {
    const template = this.getSelectedFilterTemplate(this.state?.filter || {});

    if (!template) {
      return this;
    }

    return this.set({
      filterDataDirty: false
    }, () => {
      this.dispatchFilterTemplateSave(template.key, this.state.filter, this.getFilterTemplateByKey(template.key));
    });
  }

  mergeObjectDeep(target = {}, patch = {}) {
    return Object.entries(patch || {}).reduce((result, [key, value]) => {
      const currentValue = result[key];
      const shouldMerge = value && typeof value === "object" && !Array.isArray(value) && currentValue && typeof currentValue === "object" && !Array.isArray(currentValue);
      return { ...result,
        [key]: shouldMerge ? this.mergeObjectDeep(currentValue, value) : value
      };
    }, { ...(target || {})
    });
  }

  patchFilterTemplateByKey(key, filter = this.state.filter, props = {}) {
    if (!key || !filter) return {
      filter,
      template: null
    };
    let patchedTemplate = null;
    const nextFilter = { ...filter,
      templates: this.getFilterTemplates(filter).map(template => {
        if (key !== template.key) {
          return template;
        }

        const nextPatch = typeof props === "function" ? props(template) : props;
        patchedTemplate = this.mergeObjectDeep(template, nextPatch);
        return patchedTemplate;
      })
    };
    return {
      filter: nextFilter,
      template: patchedTemplate
    };
  }

  createFilterTemplatePatchState(filter, options = {}) {
    const nextState = {
      filter
    };

    if (Object.prototype.hasOwnProperty.call(options, "saveInputValue")) {
      nextState.saveInputValue = options.saveInputValue;
    }

    return nextState;
  } // Which fields the filter is showing, in the order the host gave them.
  // These are the chips a person adds under "Поля": without them a saved view
  // came back with the fields it was saved without.


  getActiveFilterFieldKeys(filter = this.state?.filter || {}) {
    const tags = this.getCurrentFilterTags(filter);
    const order = this.getFilterFields().map(field => field?.key);
    const chosen = Object.keys(tags).filter(key => tags[key]?.active);
    return [...order.filter(key => chosen.includes(key)), ...chosen.filter(key => !order.includes(key))];
  } // Puts those fields back. The template keeps every other part of itself;
  // only which fields are shown is replaced, because that is what was saved.


  setActiveFilterFields(keys = [], filter = this.state?.filter || {}) {
    if (!Array.isArray(keys) || keys.some(key => typeof key !== 'string' || !key.trim())) {
      throw new TypeError('Filter field keys must be nonempty strings');
    }

    const template = this.getSelectedFilterTemplate(filter);
    if (!template?.key) return this;
    const fields = this.getFilterFields();
    const current = this.getCurrentFilterTags(filter);
    const tags = {};

    for (const key of Object.keys(current)) {
      tags[key] = { ...current[key],
        active: false
      };
    }

    for (const key of keys) {
      const field = fields.find(item => item?.key === key);
      tags[key] = { ...(current[key] || {}),
        active: true,
        label: field?.label ?? current[key]?.label ?? key,
        control: field?.filter?.control || field?.type || field?.dataType || current[key]?.control || 'text'
      };
    }

    const patched = this.patchFilterTemplateByKey(template.key, filter, item => ({ ...item,
      data: { ...(item.data || {}),
        tags
      }
    }));
    return this.set({
      filter: patched.filter
    });
  } // The port passes `settings` through as it is, so the chosen fields ride
  // there. Every save path goes through here: the form's own Save is the one
  // the consumer uses, and it used to send a template without them.


  withFilterFieldSettings(detail, filter = this.state?.filter || {}) {
    if (Array.isArray(detail)) {
      return detail.map(item => this.withFilterFieldSettings(item, filter));
    }

    if (!detail || typeof detail !== 'object') return detail;
    const fields = Array.isArray(detail.data?.tags) ? [] : Object.keys(detail.data?.tags || {}).filter(key => detail.data.tags[key]?.active);
    return { ...detail,
      settings: { ...(detail.settings || {}),
        filter_fields: fields.length ? fields : this.getActiveFilterFieldKeys(filter)
      }
    };
  }

  dispatchFilterTemplateSave(key, filter, template = null) {
    const detail = this.withFilterFieldSettings(template || this.getFilterTemplateByKey(key, filter), filter);
    this.emitTableEvent('template-save', detail);
    return this;
  }

  getChangedFilterTemplates(prevFilter = {}, nextFilter = {}, keys = []) {
    const prevTemplates = new Map(this.getFilterTemplates(prevFilter).map(template => [template.key, template]));
    return this.getFilterTemplates(nextFilter).filter(template => {
      const prevTemplate = prevTemplates.get(template.key);

      if (!prevTemplate) {
        return true;
      }

      return keys.some(key => !Object.is(prevTemplate[key], template[key]));
    });
  }

  dispatchFilterTemplatesSave(templates = []) {
    const filteredTemplates = templates.filter(template => template?.key);

    if (!filteredTemplates.length) {
      return this;
    }

    const detail = this.withFilterFieldSettings(filteredTemplates.length === 1 ? filteredTemplates[0] : filteredTemplates);
    this.emitTableEvent('template-save', detail);
    return this;
  }

  saveFilterTemplatePatch(key, props = {}, options = {}, filter = this.state.filter) {
    if (!key || !filter) return this;
    const patched = this.patchFilterTemplateByKey(key, filter, props);
    const nextFilter = { ...patched.filter,
      ...(options.filterPatch || {})
    };
    return this.set(() => this.createFilterTemplatePatchState(nextFilter, options), () => {
      if (options.dispatch !== false) {
        this.dispatchFilterTemplateSave(key, nextFilter, patched.template);
      }
    });
  }

  setDefaultFilterTemplate(key) {
    if (!key) return this;
    return this.set(prevState => {
      const currentFilter = prevState.filter || {};
      const filter = { ...currentFilter,
        templates: this.getFilterTemplates(currentFilter).map(template => ({ ...template,
          default: template.key === key
        }))
      };
      return {
        filter
      };
    });
  }

  patchFilterTemplateData(filter = {}, patch = {}) {
    const filterRest = { ...filter
    };
    delete filterRest.tags;
    delete filterRest.values;
    const templates = this.getFilterTemplates(filterRest);
    const selectedTemplate = this.getSelectedFilterTemplate({ ...filterRest,
      templates
    });

    if (!selectedTemplate) {
      return { ...filterRest,
        templates
      };
    }

    const nextValues = Object.prototype.hasOwnProperty.call(patch, "values") ? patch.values || {} : selectedTemplate.data?.values || {};
    const nextTags = Object.prototype.hasOwnProperty.call(patch, "tags") ? patch.tags || {} : selectedTemplate.data?.tags || {};
    const nextTemplates = templates.map(template => template.key === selectedTemplate.key ? { ...template,
      data: { ...(template.data || {}),
        ...(patch.data || {}),
        values: nextValues,
        tags: nextTags
      }
    } : template);
    return { ...filterRest,
      selectedTemplateKey: selectedTemplate.key,
      templates: nextTemplates
    };
  }

  getFilterPayload(filter = this.state?.filter || {}) {
    const selectedTemplate = this.getSelectedFilterTemplate(filter);
    return { ...(selectedTemplate?.data || {}),
      templateKey: selectedTemplate?.key || "",
      templateLabel: selectedTemplate?.label || "",
      values: this.getCurrentFilterValues(filter),
      tags: this.getCurrentFilterTags(filter)
    };
  }

  selectFilterTemplate(key) {
    if (!key || this.state?.filter?.selectedTemplateKey === key) {
      return this;
    }

    this.set(prevState => {
      const currentFilter = prevState.filter || {};
      const nextFilter = { ...currentFilter,
        selectedTemplateKey: key,
        templates: (prevState.filter?.templates || []).map(template => ({ ...template,
          selected: template.key === key
        }))
      };
      const selectedTemplate = this.getFilterTemplateByKey(key, nextFilter) || nextFilter.templates[0] || null;
      return {
        filter: nextFilter,
        saveInputValue: selectedTemplate?.label || ""
      };
    });
    return this;
  } // The table's lists are reordered with the Framework's sf-sortable (owner,
  // 2026-10-13): a pointer, a finger or the keyboard, a silhouette where the
  // row lands, the steps announced. A pinned row moves among pinned rows and
  // a loose one among loose ones, so each group is a list of its own and a
  // drag cannot silently unpin anything. What a list asks for arrives as
  // sf-sortable-intent; the order is computed from keys and the window is
  // drawn again from it -- the rows are lit's, not moved by hand.


  static reorderedKeys(list, item, index) {
    const keys = [...list.querySelectorAll('[data-sf-sortable-item]')].filter(node => node.closest('sf-sortable') === list).map(node => node.getAttribute('data-sf-sortable-item')).filter(key => key !== item);
    keys.splice(Math.max(0, Math.min(index, keys.length)), 0, item);
    return keys;
  }

  onFilterTemplateIntent(event) {
    const list = event.target;
    const {
      item,
      index
    } = event.detail ?? {};
    if (!(list instanceof Element) || !item) return;
    const keys = SfTable.reorderedKeys(list, item, index);
    const group = list.getAttribute('data-group') === 'pinned' ? 'pinned' : 'normal';
    const orderedByGroup = {
      pinned: new Map(),
      normal: new Map()
    };
    keys.forEach((key, at) => orderedByGroup[group].set(key, at));
    this.syncFilterTemplateOrder(orderedByGroup);
  } // A column list may be narrowed by the search: the move is placed against
  // the shown neighbours, and the columns the search hides keep their places.


  onColumnSettingsIntent(event) {
    const list = event.target;
    const {
      item,
      index
    } = event.detail ?? {};
    if (!(list instanceof Element) || !item) return;
    const pinnedGroup = list.getAttribute('data-group') === 'pinned';
    const shown = SfTable.reorderedKeys(list, item, index);
    const at = shown.indexOf(item);
    const columns = this.getColumnItems().filter(column => column?.key && !column.system);
    const groupKeys = columns.filter(column => this.isColumnPinned(column) === pinnedGroup).map(column => column.key).filter(key => key !== item);
    const before = shown[at + 1];
    const after = shown[at - 1];
    let place = before !== undefined ? groupKeys.indexOf(before) : -1;
    if (place === -1) place = after !== undefined ? groupKeys.indexOf(after) + 1 : groupKeys.length;
    groupKeys.splice(place === -1 ? groupKeys.length : place, 0, item);
    const otherKeys = columns.filter(column => this.isColumnPinned(column) !== pinnedGroup).map(column => column.key);
    const ordered = pinnedGroup ? [...groupKeys, ...otherKeys] : [...otherKeys, ...groupKeys];
    ordered.forEach((key, position) => this.patchTempColumnSettings(key, {
      order: (position + 1) * 10
    }));
    this.requestComponentUpdate('column-order'); // The consumer's owner read the drag as applying at once, because the
    // list redraws from the draft; it does, as every control in the window.

    this.commitColumnSettings('column-order');
  }

  syncFilterTemplateOrder(orderedByGroup) {
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map((template, sourceIndex) => {
      const group = template.pinned ? "pinned" : "normal";
      const nextOrder = orderedByGroup[group].get(template.key);

      if (typeof nextOrder !== "number") {
        return template;
      }

      return { ...template,
        order: nextOrder,
        sourceIndex
      };
    });
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: currentFilter.selectedTemplateKey,
        templates: templates.sort((left, right) => {
          if (Boolean(left.pinned) !== Boolean(right.pinned)) {
            return left.pinned ? -1 : 1;
          }

          if (left.order !== right.order) {
            return left.order - right.order;
          }

          return left.sourceIndex - right.sourceIndex;
        })
      }
    };
    this.requestComponentUpdate("temp-filter-template-order");
  } // Whether there is room for every data column to be readable.
  //
  // A floor cannot be a width: write one on a column and it becomes the
  // width, so a cell that needs more wraps and a typed row grows -- measured
  // at 81px against 57 where the typed-cells probe watches it. And a minimum
  // on a cell is ignored in a fixed layout. So the floor is applied only when
  // it is actually needed: while there is room the columns share it as they
  // always have, and when there is not they stop at the floor and the box
  // scrolls, which is what the consumer asked for (Larena, 2026-10-06).


  get columnsAreCramped() {
    if (this._layoutReads?.has('cramped')) return this._layoutReads.get('cramped');
    const cramped = this.readColumnsAreCramped();
    this._layoutReads?.set('cramped', cramped);
    return cramped;
  }

  readColumnsAreCramped() {
    // The box that would do the scrolling is the one to measure. The
    // responsive observer's width is what it last saw, and in an embedded
    // list it had seen nothing at all -- it reported 0 while the columns
    // were 77px wide and wrapping their headings over four lines (owner,
    // 2026-10-09).
    const width = this.refs.scroll?.value?.clientWidth || this._responsiveWidth;
    if (!width) return false;
    const columns = this.getColumns?.() ?? [];
    const floored = columns.filter(column => this.columnTakesFloor(column));
    if (!floored.length) return false;
    const host = this.querySelector(".sf-table") ?? this;
    const raw = globalThis.getComputedStyle?.(host)?.getPropertyValue("--sf-table--column-min-inline-size")?.trim();
    if (!raw) return false;
    const root = Number.parseFloat(globalThis.getComputedStyle?.(document.documentElement)?.fontSize) || 16;
    const floor = raw.endsWith("rem") ? Number.parseFloat(raw) * root : Number.parseFloat(raw);
    if (!Number.isFinite(floor) || floor <= 0) return false; // What the columns that are not floored already take, measured rather
    // than assumed: the select box, the gear, the actions.
    // The actions column counts at its declared width, never more: measured,
    // it had already swallowed the room the data columns were denied, and
    // the measurement made the denial permanent.

    const taken = [...this.querySelectorAll("thead th")].filter(cell => !floored.some(column => column.key === cell.dataset.key)).reduce((total, cell) => total + (cell.dataset.key === "actions" ? Math.min(cell.getBoundingClientRect().width, floor) : cell.getBoundingClientRect().width), 0);
    return width - taken < floored.length * floor;
  } // The actions column as wide as its buttons: each a size-1 icon button, the
  // same measure the settings column is given, with the cell's padding once.
  // Whether the records are a compact list rather than a table: chosen by the
  // width of the box the table sits in, which is what a list beside an open
  // panel is narrow in, not the window.


  get isList() {
    const layout = this.getProp?.("layout") ?? "table";
    if (layout === "list") return true;
    if (layout === "table") return false;
    const below = Number(this.getProp?.("listBelow")) || 600;
    return this._responsiveWidth > 0 && this._responsiveWidth < below;
  }

  get actionsColumnWidth() {
    const inline = (this.ACTIONS_SETTINGS_ROW ?? []).filter(action => action?.inline !== false).length;
    if (!inline) return "";
    return `calc(${inline} * (var(--sf-text-height-1) + var(--sf-ui-1--space-y-tightness-default) * 2)` + ` + ${inline - 1} * var(--sf-space-1\\/3) + var(--sf-b6))`;
  } // Each data column as wide as its content wants on one line -- the heading
  // and the values shown -- up to a cap, read from the laid-out table: for a
  // moment the table is laid out by its content at its widest (auto layout,
  // max-content), the headings are measured, and the layout goes back. The
  // columns used to share the room equally and stop at a floor, so a long
  // value wrapped in a column a short one did not need (owner, 2026-10-13).
  // A width the host or the person set wins; what does not fit scrolls.


  measureContentWidths() {
    const table = this.refs.table?.value;
    if (!(table instanceof HTMLTableElement) || !table.isConnected) return false;
    if (this._columnResizeState || this.columnDragActive) return false; // The skeleton and an empty or failed list say nothing about the content,
    // and rows kept on screen while the next ones load are the old ones: a
    // measurement of them is thrown away when the answer comes (owner,
    // 2026-10-15, a sort measured the table twice).

    if (table.querySelector('tbody[data-state]') || table.querySelector('tbody[data-busy]') || !table.querySelector('tbody tr td')) return false;
    const measured = new Map();
    let whole = 0; // What the laid-out table says now, read before the measuring class
    // changes it: the cap, the box's width and the system columns' widths
    // (they were read after the class came off: a style and two layouts
    // more of the whole table, at 4x CPU some 60 ms on the admin's list;
    // stand 25). The box scrolls, so the measuring does not change it.

    const cap = this.columnWidthCap();
    const box = table.parentElement?.clientWidth ?? 0;
    const systemWidths = new Map();

    for (const cell of table.querySelectorAll('thead th[data-key]')) {
      if (SYSTEM_COLUMN_KEYS.has(cell.dataset.key)) systemWidths.set(cell, Math.ceil(cell.getBoundingClientRect().width));
    }

    table.classList.add('sf-table-measuring'); // Measured before the table's own stylesheet has come, the measuring
    // class does nothing, the fixed layout squeezes every column to a
    // letter's width, and those widths were applied and held until the
    // sheet arrived (owner, 2026-10-15, frame by frame). Not measured then:
    // the stylesheet's arrival measures again.

    if (getComputedStyle(table).tableLayout !== 'auto') {
      table.classList.remove('sf-table-measuring');
      return false;
    }

    try {
      whole = table.getBoundingClientRect().width;

      for (const cell of table.querySelectorAll('thead th[data-key]')) {
        const key = cell.dataset.key;
        if (SYSTEM_COLUMN_KEYS.has(key)) continue;
        measured.set(key, contentStep(cell.getBoundingClientRect().width));
      }
    } finally {
      table.classList.remove('sf-table-measuring');
    } // The content's own width: every data column at its content width (as
    // contentWidth caps it) and the system columns at their fixed ones. The
    // table is never narrower (contentInlineSize): the column that takes
    // the spare room keeps its content width where there is none, in a
    // box of any width -- a first paint printed at one width and drawn at
    // another squeezed it to a letter's width (standard 1.3.8 gate 24).


    let content = 0;

    for (const cell of table.querySelectorAll('thead th[data-key]')) {
      const key = cell.dataset.key;
      content += SYSTEM_COLUMN_KEYS.has(key) ? systemWidths.get(cell) ?? 0 : Math.min(measured.get(key) ?? 0, cap);
    }

    const contentChanged = content !== (this._contentInlineSize ?? 0);
    this._contentInlineSize = content; // Room to spare: the content is narrower than the box. A fixed table
    // shares the spare room between every column with a width, the box and
    // the menu columns too, so a list of one data column showed it some
    // 330px in, after two wide empty columns (Larena, 2026-10-14). The last
    // data column is then left without a width and takes the spare room.

    const surplus = box > 0 && whole > 0 && whole < box;
    const surplusChanged = surplus !== Boolean(this._contentSurplus);
    this._contentSurplus = surplus; // A cell drawn by an element whose module is still on the way -- the
    // Loader brings parts when a page first uses them -- is empty when this
    // runs, and its column was measured a few pixels wide and kept so:
    // record links broke inside words in a 45px column (Larena,
    // 2026-10-13). Measure again once those elements are drawn.

    this.remeasureWhenDrawn(table);
    const previous = this._contentWidths ?? new Map();
    const changed = measured.size !== previous.size || [...measured].some(([key, width]) => Math.abs((previous.get(key) ?? 0) - width) > 2);
    if (changed) this._contentWidths = measured;
    return changed || surplusChanged || contentChanged;
  } // In pixels, capped here rather than with min() in the column's width: a
  // fixed-layout table read min(784px, 20rem) as no fixed width at all and
  // gave that column the whole of the table's spare room.
  // Folds the values of a multi-value cell that do not fit its line into
  // «+N» (see renderCellValues in the template).


  fitCellValues() {
    // A value that is an element not yet drawn -- its module still on the
    // way, as the Loader brings parts when they are first used -- has no
    // width yet, so the line is measured again once it has one.
    const pending = new Set();

    for (const item of this.querySelectorAll('tbody .sf-table-cell-values > :not(.sf-table-cell-more)')) {
      if (item.localName.includes('-') && (!customElements.get(item.localName) || !cellValueBox(item).getBoundingClientRect().width)) {
        pending.add(item.localName);
      }
    }

    if (pending.size && (this._fitRetries ?? 0) < 3) {
      this._fitRetries = (this._fitRetries ?? 0) + 1;
      const token = this._fitToken = (this._fitToken ?? 0) + 1;
      Promise.all([...pending].map(name => customElements.whenDefined(name))).then(() => new Promise(settle => requestAnimationFrame(() => requestAnimationFrame(settle)))).then(() => {
        if (token === this._fitToken && this.isConnected) this.fitCellValues();
      });
    } else if (!pending.size) {
      this._fitRetries = 0;
    } // Every line put back first and read in one go: a line reset and read
    // in turn laid the table out again for each cell (stand 25, 20 rows of
    // tags and references: a third of the time the rows took to draw).


    const lines = [];

    for (const box of this.querySelectorAll('tbody .sf-table-cell-values')) {
      const more = box.querySelector(':scope > .sf-table-cell-more');
      const items = [...box.children].filter(child => child !== more);
      const valueBoxes = items.map(item => cellValueBox(item));
      lines.push({
        box,
        more,
        items,
        valueBoxes
      });
    }

    for (const {
      more,
      valueBoxes
    } of lines) {
      for (const valueBox of valueBoxes) valueBox.classList.remove('sf-table-cell-folded');

      if (!more) continue;
      more.hidden = true;
      more.removeAttribute('title');
    }

    const overflowing = lines.filter(({
      box,
      more
    }) => more && box.scrollWidth > box.clientWidth + 1);

    for (const {
      box,
      more,
      items,
      valueBoxes
    } of overflowing) {
      // Room for the counter first, then values leave from the end until
      // the rest and the counter fit.
      more.hidden = false;
      more.textContent = `+${items.length}`;
      const folded = [];

      for (let at = items.length - 1; at > 0 && box.scrollWidth > box.clientWidth + 1; at -= 1) {
        valueBoxes[at].classList.add('sf-table-cell-folded');
        folded.unshift(items[at]);
        more.textContent = `+${folded.length}`;
      }

      if (!folded.length) {
        more.hidden = true;
        continue;
      }

      more.title = folded.map(item => item.textContent.trim()).filter(Boolean).join(', ');
    }
  } // True when the measuring waits for the cells' elements to draw: every
  // element in the cells is defined and some have not drawn yet. Measured
  // when they have, or at the next frame at the latest.


  measureWhenCellsDrawn() {
    const table = this.refs.table?.value;
    if (!(table instanceof HTMLTableElement) || this._columnResizeState || this.columnDragActive) return false;
    if (table.querySelector('tbody[data-state]') || table.querySelector('tbody[data-busy]')) return false;
    const drawing = [];

    for (const element of table.querySelectorAll('tbody td *')) {
      if (!element.localName.includes('-')) continue;
      if (!customElements.get(element.localName) || typeof element.whenRendered !== 'function') return false; // One held by its style gate draws when its sheets come, perhaps
      // after this frame: measured now, as before.

      if (element.hasAttribute('data-sf-style-pending')) return false;
      if (element.isRendered !== true) drawing.push(element);
    }

    if (!drawing.length) return false;
    const token = this._cellsDrawnToken = (this._cellsDrawnToken ?? 0) + 1;
    const nextFrame = new Promise(settle => requestAnimationFrame(settle));
    Promise.race([Promise.all(drawing.map(element => element.whenRendered())), nextFrame]).catch(() => {}).then(() => {
      if (token !== this._cellsDrawnToken || !this.isConnected) return;
      if (this.measureContentWidths()) this.applyColumnWidths();
      this._contentRetries = 0;
      this.fitCellValues();
      this.measurePinnedColumns();
      if (this.hasAttribute("data-sf-page-scroll")) this.syncRail();
    });
    return true;
  }

  remeasureWhenDrawn(table) {
    const pending = new Set();

    for (const element of table.querySelectorAll('tbody td *')) {
      if (!element.localName.includes('-')) continue;
      if (!customElements.get(element.localName) || !element.childElementCount) pending.add(element.localName);
    }

    if (!pending.size) {
      this._remeasureTries = 0;
      return;
    }

    if ((this._remeasureTries ?? 0) >= 3) return;
    this._remeasureTries = (this._remeasureTries ?? 0) + 1;
    const token = this._remeasureToken = (this._remeasureToken ?? 0) + 1; // Every element in the cells defined (sf-view-table relates them eagerly):
    // the widths are read again the moment they have drawn, in the same
    // task, before the frame is painted -- read two frames later, the
    // columns moved by a few pixels after the rows had been shown (gate 24
    // phase 3, sf-view at 1280).

    const drawing = [...table.querySelectorAll('tbody td *')].filter(element => pending.has(element.localName) && typeof element.whenRendered === 'function');

    if ([...pending].every(name => customElements.get(name)) && drawing.length) {
      Promise.all(drawing.map(element => element.isRendered === true ? null : element.whenRendered())).then(() => {
        if (token !== this._remeasureToken || !this.isConnected) return;
        if (this.measureContentWidths()) this.widthsChanged();
      });
      return;
    }

    Promise.all([...pending].map(name => customElements.whenDefined(name))).then(() => new Promise(settle => requestAnimationFrame(() => requestAnimationFrame(settle)))).then(() => {
      if (token !== this._remeasureToken || !this.isConnected) return;
      if (this.measureContentWidths()) this.widthsChanged();
    });
  } // New widths after a render: written onto the columns, and what reads
  // widths -- folded values, pinned offsets, the rail -- read again.


  widthsChanged() {
    this.applyColumnWidths();
    this.fitCellValues();
    this.measurePinnedColumns();
    if (this.hasAttribute("data-sf-page-scroll")) this.syncRail();
  }

  applyColumnWidths() {
    const table = this.refs.table?.value;
    if (!(table instanceof HTMLTableElement)) return;
    const columns = new Map((this.getColumns?.() ?? []).map(column => [String(column?.key), column])); // Every column's style worked out before any is written: the cap and
    // whether the columns are cramped are read from the laid-out table,
    // and a write between two reads laid it out again for each column
    // (stand 25: 17 columns, the larger part of the rows' first draw).

    const cols = [...table.querySelectorAll(':scope > colgroup > col[data-key]')];
    const styles = this.readingLayout(() => cols.map(col => {
      const column = columns.get(col.dataset.key);
      return column ? (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_7__.columnStyle)(this, column) : null;
    }));
    cols.forEach((col, at) => {
      const style = styles[at];
      if (style === null) return;

      if ((col.getAttribute('style') ?? '') !== style) {
        if (style) col.setAttribute('style', style);else col.removeAttribute('style');
      }
    });
    table.classList.toggle('sf-table-content-sized', this.hasContentWidths);
    table.classList.toggle('w-max', !this.hasContentWidths);
    if (this.hasContentWidths && this._contentInlineSize) table.style.setProperty('--sf-table--content-inline-size', `${this._contentInlineSize}px`);else table.style.removeProperty('--sf-table--content-inline-size');
  }

  contentWidth(column) {
    const width = this._contentWidths?.get(column?.key);
    if (!width) return ''; // The column that takes the spare room has no width of its own: the
    // table's least width (--sf-table--content-inline-size) gives it its
    // content width where there is no spare room, so it holds in a box of
    // any width.

    if (column?.key === this.spareRoomColumnKey()) return '';
    return `${Math.min(width, this.columnWidthCap())}px`;
  } // The column that takes the spare room: the last data column nobody sized.


  spareRoomColumnKey() {
    const columns = this.getColumns?.() ?? [];

    for (let at = columns.length - 1; at >= 0; at -= 1) {
      const column = columns[at];
      if (!column?.key || SYSTEM_COLUMN_KEYS.has(column.key)) continue;
      if (column.colWidth ?? column.width ?? column.size) return null;
      return column.key;
    }

    return null;
  }

  get hasContentWidths() {
    return Boolean(this._contentWidths?.size);
  } // Reads that write nothing in between: the cap and the cramped answer are
  // read once for the whole pass instead of once per column.


  readingLayout(read) {
    if (this._layoutReads) return read();
    this._layoutReads = new Map();

    try {
      return read();
    } finally {
      this._layoutReads = null;
    }
  }

  columnWidthCap() {
    if (this._layoutReads?.has('cap')) return this._layoutReads.get('cap');
    const cap = this.readColumnWidthCap();
    this._layoutReads?.set('cap', cap);
    return cap;
  }

  readColumnWidthCap() {
    const raw = getComputedStyle(this).getPropertyValue('--sf-table--column-max-inline-size').trim();
    const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value) || value <= 0) return 320;
    return raw.endsWith('rem') ? value * root : value;
  }

  columnTakesFloor(column) {
    if (!column?.key || SYSTEM_COLUMN_KEYS.has(column.key)) return false;
    return !(column.colWidth ?? column.width ?? column.size ?? column.min_width ?? column.minWidth);
  } // The settings column carries two things: the gear in its head, which
  // opens the column settings (settings-menu), and the ≡ in each row, which
  // opens the row's menu of actions. With neither -- no column settings, no
  // row actions to list, no rows to put in order -- it is an empty column
  // of buttons that open nothing, and it is not drawn (Larena, the sites
  // list, 2026-11-05: a «≡» column beside every row of a list without
  // actions).


  settingsColumnHasUse(props = this.getPropsContext()) {
    if (props.settingsMenu !== false) return true;
    if (props.rowReorder === true) return true;
    return (this.ACTIONS_SETTINGS_ROW ?? []).length > 0;
  }

  getSystemColumns() {
    const columns = [];
    const props = this.getPropsContext();

    if (props.selectable) {
      columns.push(this.getSelectColumn());
    }

    if (props.settings && this.settingsColumnHasUse(props)) {
      columns.push(this.TABLE_SETTINGS_COLUMN);
    }

    if (props.actions && props.rowActions && this.state.actionActive) {
      columns.push(this.TABLE_ACTIONS_COLUMN);
    }

    return columns;
  }

  setTemplates(data) {
    const nextTemplates = Object.values(data || {}).map((template, index) => this.normalizeFilterTemplate(template, index));
    return this.set(prevState => {
      const currentFilter = prevState.filter || {};
      const templatesByKey = new Map();
      this.getFilterTemplates(currentFilter).forEach(template => {
        templatesByKey.set(template.key, template);
      });
      nextTemplates.forEach(template => {
        templatesByKey.set(template.key, { ...(templatesByKey.get(template.key) || {}),
          ...template
        });
      });
      const templates = Array.from(templatesByKey.values());
      const hasCurrentSelectedTemplateKey = Object.prototype.hasOwnProperty.call(currentFilter, "selectedTemplateKey");
      const defaultTemplate = templates.find(template => template.default === true);
      const incomingSelectedKey = nextTemplates.find(template => template?.selected)?.key;
      const fallbackSelectedKey = defaultTemplate?.key || templates[0]?.key || "";
      const selectedTemplateKey = this._filterTemplatesLoaded ? incomingSelectedKey ?? (hasCurrentSelectedTemplateKey ? currentFilter.selectedTemplateKey : fallbackSelectedKey) : incomingSelectedKey ?? fallbackSelectedKey;
      const nextFilter = { ...currentFilter,
        selectedTemplateKey,
        templates: templates.map(template => ({ ...template,
          selected: template.key === selectedTemplateKey
        }))
      };
      const selectedTemplate = selectedTemplateKey === "" ? null : this.getFilterTemplateByKey(selectedTemplateKey, { ...nextFilter,
        templates
      }) || templates[0] || null;
      this._filterTemplatesLoaded = true;
      return {
        filter: nextFilter,
        saveInputValue: selectedTemplate?.label || ""
      };
    });
  } // The identity of this instance: the author's id when there is one, its own
  // counter otherwise. Never the component name, so a second table on the page
  // cannot inherit the first one's ids or preferences.


  getInstanceId() {
    return this.id || this._instanceId;
  }

  getColumnResizerId(columnKey) {
    return `${this.getInstanceId()}--column-resizer--${columnKey}`;
  }

  getTableSettingsKey() {
    return this.tableSettingsKey || this.getAttribute?.("table-settings-key") || this.id || this.getInstanceId();
  }

  normalizeTableSettings(data = {}, tableSettingsKey = this.getTableSettingsKey()) {
    const settingsMap = data?.tableSettings && typeof data.tableSettings === "object" && !Array.isArray(data.tableSettings) && !data.tableSettings.columnSettings ? data.tableSettings : null;
    const source = data?.item || settingsMap?.[tableSettingsKey] || data?.tableSettings || data?.settings || data || {};
    const columnSettings = source?.columnSettings || data?.columnSettings || {};
    return { ...source,
      columnSettings: columnSettings && typeof columnSettings === "object" && !Array.isArray(columnSettings) ? columnSettings : {}
    };
  }

  setTableSettings(data = {}, reason = "table-settings-load", tableSettingsKey = this.getTableSettingsKey()) {
    const settings = this.normalizeTableSettings(data, tableSettingsKey);
    return this.setColumnSettings(settings.columnSettings, reason, false);
  }

  getContextMenuLabel(data = {}) {
    switch (data.menu || data.type) {
      case 'filter-favorites':
        return this.text('contextSaveTemplateLabel');

      case 'filter-settings':
        return this.text('contextFilterSettingsLabel');

      case 'filter-template-actions':
        return `${this.text('contextTemplateActionsLabel')}: ${data.template?.label || data.template?.key || ''}`.trim();

      case 'tag-settings':
        {
          const fieldKey = data.fieldKey || '';
          const field = this.getFilterField(fieldKey);
          const label = field?.label || this.getCurrentFilterTags()?.[fieldKey]?.label || fieldKey;
          return `${this.text('contextFieldFilterLabel')}: ${label || this.text('fieldWordText')}`;
        }

      case 'row-settings':
        return this.text('contextRowActionsLabel');

      case 'create':
        return this.text('contextCreateOptionsLabel');

      case 'list-sort':
        return this.text('sortLabel');

      case 'toolbar-actions':
        return this.text('contextViewActionsLabel');

      case 'table-settings':
      default:
        return this.text('contextTableSettingsLabel');
    }
  }

  renderFilterFavoritesContextMenu(data) {
    const {
      x,
      y,
      position
    } = data;
    const template = this.getSelectedFilterTemplate();
    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <sf-menu-context
                    size=${this.size === "1/2" ? "1/2" : "1"}
                    :key=${x + y + this._renderToken}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'filter-favorites'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
          "
                    root-class="sf-table-context-menu ${this.size === "1/2" ? "sf-table-context-menu--dense " : ""}flex flex-col"
                    data-context-main-menu
                    position="${position || ""}"
            >
                <div class="flex flex-col flex-1 gap-2" slot="content">
                    <div class="sf-table-context-top"><span class="sf-text-2 bold">Сохранение шаблона</span></div>
                    <div class="sf-table-context-main">
                        <form ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_13__.ref)(this.refs.templateForm)} id="save_template" class="flex flex-col gap-1/2">
                            <sf-input
                                    size=${this.size}
                                    appearance="filled"
                                    placeholder="${this.text('templateNamePlaceholder')}"
                                    value="${this.state.saveInputValue}"
                                    name="template_name"
                                    @change=${e => {
      this.set({
        saveInputValue: e.target.value
      });
    }}
                                    @input=${e => {
      this.set({
        saveInputValue: e.target.value
      });
    }}
                            ></sf-input>
                            <div class="flex flex-col gap-1/2">
                                <sf-checkbox size=${this.size}
                                        name="template_default"
                                        position="end"
                                        root-class="content-main-between"
                                        value="1"
                                        ?checked=${template.data.template_default}
                                        label="${this.text('makeDefaultLabel')}"
                                ></sf-checkbox>
                                <sf-checkbox size=${this.size}
                                        name="template_save_for_all"
                                        position="end"
                                        root-class="content-main-between"
                                        value="1"
                                        ?checked=${template.data.template_save_for_all}
                                        label="${this.text('saveForEveryoneLabel')}"
                                ></sf-checkbox>
                        </form>
                    </div>
                </div>
                <div class="sf-table-context-bottom sf-context-menu-footer">
                    <sf-button size=${this.size} @click="${() => {
      this.tempSettings = null;
      this.requestComponentUpdate('table');
    }}" appearance="outline" scheme="on-surface" root-class="flex-1"
                               text="${this.text('resetText')}"></sf-button>
                    <sf-button size=${this.size}
                            ?disabled=${this.state.saveInputValue.length === 0}
                            @click="${() => {
      this.saveFilterTemplate();
    }}" root-class="flex-1" text="${this.text('applyText')}"></sf-button>
                </div>
                </div>
            </sf-menu-context>
        `;
  }

  saveFilterTemplate() {
    const form = this.refs.templateForm.value;
    if (!form) return false;
    const formData = Object.fromEntries(new FormData(form));
    const {
      templates
    } = this.state.filter;
    const prevTemplate = templates.filter(template => {
      return template.label === formData.template_name;
    })?.[0];
    const values = this.getCurrentFilterValues();
    const tags = this.getCurrentFilterTags();
    let template = {
      key: prevTemplate ? prevTemplate.key : `filter_template_${templates.length + 1}`,
      label: formData.template_name,
      selected: true,
      data: { ...formData,
        values,
        tags
      }
    };
    const detail = this.withFilterFieldSettings(template);
    this.emitTableEvent('template-save', detail);
    this.tempSettings = null;
    this.closeContextMenu();
  }

  renderRowSettingsContextMenu(data) {
    const {
      x,
      y,
      position,
      transform,
      items = this.getActionRowItems(data.row || {}).map(action => ({
        component: "sf-button",
        props: {
          appearance: "link",
          scheme: "on-surface",
          text: action.name,
          "@click": event => {
            const handler = action.component.props["@click"] || action.component.props.onClick;
            handler?.(event);
            this.closeContextMenu();
          }
        }
      }))
    } = data;
    let pos = `translateY(calc(${transform !== undefined ? transform : -50}%))`;

    if (position) {
      switch (position) {
        case "left-bottom":
        case "right-bottom":
          pos = `translateY(calc(${transform !== undefined ? transform : -100}% + var(--sf-context-menu-tail-corner-offset)))`;
          break;
      }
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <sf-menu-context
                    size=${this.size === "1/2" ? "1/2" : "1"}
                    :key=${x + y}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'row-settings'
    })}
                    style="
            position: fixed;
            left: calc(${x}px + var(--sf-context-menu-tail-corner-offset));
            inset-block-start: ${y}px;
            transform: ${pos};
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
          "
                    .entries=${items.map((item, at) => {
      // The standard menu's rows (owner, 2026-10-14): these were
      // link buttons, the one menu of the table drawn otherwise.
      const props = item.props || item.component?.props || {};
      return {
        id: String(at),
        text: props.text ?? item.name ?? "",
        icon: props.iconLeft ?? props.iconStart ?? props.icon ?? undefined,
        danger: props.scheme === "error" || item.danger === true,
        disabled: Boolean(props.disabled)
      };
    })}
                    @sf-menu-context-select=${event => {
      const item = items[Number(event.detail?.id)];
      const props = item?.props || item?.component?.props || {};
      const handler = props["@click"] ?? props.onClick;
      if (typeof handler === "function") handler({
        currentTarget: event.target,
        target: event.target,

        preventDefault() {},

        stopPropagation() {}

      });
      this.closeContextMenu();
    }}
                    position="${position || "left"}"
            >
            </sf-menu-context>
        `;
  }

  getColumnItems() {
    const dataColumns = this.getTableData().columns || [];
    const originalIndexByKey = new Map(dataColumns.map((column, index) => [column?.key, index]));

    const getOrder = column => {
      const order = column?.order;
      return order !== null && typeof order !== "undefined" && order !== "" && Number.isFinite(Number(order)) ? Number(order) : originalIndexByKey.get(column?.key) ?? 0;
    };

    return dataColumns.map(column => {
      const settings = this.getColumnSetting(column?.key);
      const nextColumn = { ...column,
        ...settings
      };

      if (settings.width) {
        nextColumn.colWidth = settings.width;
      }

      return nextColumn;
    }).sort((left, right) => {
      // The list reads like the table: the pinned group first, then
      // the rest of the visible columns, then the hidden ones. Sorting
      // by order alone put the hidden columns wherever their stored
      // order happened to fall — a consumer opened the settings and
      // found eight columns it had never shown standing above its own,
      // with the pinned one in the middle.
      const group = column => {
        if (this.isColumnPinned(column)) return 0;
        return this.isColumnVisible(column) ? 1 : 2;
      };

      const leftGroup = group(left);
      const rightGroup = group(right);

      if (leftGroup !== rightGroup) {
        return leftGroup - rightGroup;
      }

      const leftOrder = getOrder(left);
      const rightOrder = getOrder(right);

      if (leftOrder === rightOrder) {
        return (originalIndexByKey.get(left.key) ?? 0) - (originalIndexByKey.get(right.key) ?? 0);
      }

      return leftOrder - rightOrder;
    });
  } // Whether a column is shown. The answer the person is editing right now
  // wins, then what the host has stored, then what the column itself says.


  isColumnVisible(column) {
    if (!column?.key) return false;
    const pending = this.tempSettings?.cols?.[column.key];
    const setting = this.getColumnSetting(column.key) || {};
    return pending?.visible ?? setting.visible ?? column.visible !== false;
  } // The person's and the host's column settings, merged. It is asked for
  // hundreds of times in one draw -- every column, every pinned cell -- so
  // the merge is made once per change of either source and read from the
  // memo while drawing (simai/ui-pro#1). Both sources are replaced, never
  // edited in place, so their identity says when they changed.


  getColumnSettings() {
    const dataSettings = this.getTableData().columnSettings;
    const stateSettings = this.state?.columnSettings;
    const memo = this._columnSettingsMemo;
    if (memo && memo.data === dataSettings && memo.state === stateSettings) return memo.value;
    const value = this.mergedColumnSettings(dataSettings, stateSettings);
    this._columnSettingsMemo = {
      data: dataSettings,
      state: stateSettings,
      value
    };
    return value;
  }

  mergedColumnSettings(dataSettings, stateSettings) {
    const normalizedDataSettings = dataSettings && typeof dataSettings === "object" && !Array.isArray(dataSettings) ? dataSettings : {};
    const normalizedStateSettings = stateSettings && typeof stateSettings === "object" && !Array.isArray(stateSettings) ? stateSettings : {};
    return { ...normalizedDataSettings,
      ...normalizedStateSettings
    };
  }

  getColumnSetting(columnKey) {
    if (!columnKey) return {};
    const settings = this.getColumnSettings()?.[columnKey];
    return settings && typeof settings === "object" && !Array.isArray(settings) ? settings : {};
  }

  normalizeColumnSetting(settings = {}) {
    const nextSettings = {};
    Object.entries(settings || {}).forEach(([key, value]) => {
      if (typeof value === "undefined") {
        return;
      }

      if (key === "colWidth") {
        nextSettings.width = value;
        return;
      }

      nextSettings[key] = value;
    });

    if (typeof nextSettings.order !== "undefined" && nextSettings.order !== null && nextSettings.order !== "") {
      nextSettings.order = Number(nextSettings.order);
    }

    return nextSettings;
  }

  mergeColumnSettings(currentSettings = {}, patch = {}) {
    const nextSettings = { ...(currentSettings || {})
    };
    Object.entries(patch || {}).forEach(([columnKey, columnPatch]) => {
      if (!columnKey || !columnPatch || typeof columnPatch !== "object") {
        return;
      }

      nextSettings[columnKey] = this.normalizeColumnSetting({ ...(nextSettings[columnKey] || {}),
        ...columnPatch
      });
    });
    return nextSettings;
  } // The person asked for the default columns back. The component names no
  // defaults of its own — it says the layer should go, and the host answers
  // with whatever it considers default for this view.


  requestColumnSettingsReset() {
    // The person's arrangement goes from the preference too.
    if (this.viewPreferenceKey) {
      const {
        columnSettings,
        widths,
        ...rest
      } = preferences()?.read(this.viewPreferenceKey) ?? {};
      preferences()?.write(this.viewPreferenceKey, rest);
    }

    return this.emitTableEvent("column-settings-reset", Object.freeze({
      target: "personal",
      tableSettingsKey: this.getTableSettingsKey?.() ?? null
    }));
  }

  emitColumnSettingsChange(reason = "column-settings") {
    if (reason !== "preferences" && this.viewPreferenceKey) {
      this.writeTablePreference(this.viewPreferenceKey, {
        columnSettings: this.getColumnSettings()
      });
    }

    const detail = {
      reason,
      columnSettings: this.getColumnSettings(),
      tableSettingsKey: this.getTableSettingsKey()
    }; // Vocabulary §5 save {kind: columns}; sf-table-column-settings-change,
    // sf-table:column-settings-change and onColumnSettingsChange follow
    // once each with the same fields (detail-adds rows).

    this.emitTableEvent('save', {
      kind: "columns",
      ...detail
    });
    return this;
  }

  setColumnSettings(settings = {}, reason = "column-settings", emit = true) {
    const nextSettings = typeof settings === "function" ? settings(this.getColumnSettings()) : settings;
    return this.set({
      columnSettings: nextSettings && typeof nextSettings === "object" ? nextSettings : {}
    }, reason, () => emit ? this.emitColumnSettingsChange(reason) : false);
  }

  patchColumnSettings(columnKey, patch = {}, reason = "column-settings") {
    if (!columnKey) return this;
    const currentSetting = this.getColumnSetting(columnKey);
    const nextPatch = typeof patch === "function" ? patch(currentSetting) : patch;
    return this.patchColumnSettingsBatch({
      [columnKey]: nextPatch || {}
    }, reason);
  }

  patchColumnSettingsBatch(patch = {}, reason = "column-settings") {
    const currentSettings = this.getColumnSettings();
    const nextSettings = this.mergeColumnSettings(currentSettings, patch);

    if (JSON.stringify(currentSettings) === JSON.stringify(nextSettings)) {
      return this;
    }

    return this.setColumnSettings(nextSettings, reason);
  }

  getFilterFields() {
    const fields = this.state?.filter?.fields;
    return Array.isArray(fields) ? fields : [];
  } // Whether the toolbar offers a filter at all: when the host gave fields to
  // filter by or saved templates to choose from, or a filter is already on.
  // Without them the button opened a panel of templates and fields with no
  // value to set, which read as broken (documentation trial 6; owner and
  // Larena, 2026-10-18).


  offersFilter(activeCount = 0) {
    const templates = this.state?.filter?.templates;
    return this.getFilterFields().length > 0 || Array.isArray(templates) && templates.length > 0 || activeCount > 0;
  }

  getFilterField(fieldKey) {
    if (!fieldKey) return null;
    return this.getFilterFields().find(field => field?.key === fieldKey) || null;
  }

  setFilterFields(fields = [], reason = "filter-fields") {
    for (const page of this._filterOptionPages.values()) {
      page.controller?.abort();
      clearTimeout(page.searchTimer);
    }

    this._filterOptionPages.clear();

    return this.set(prevState => ({
      filter: { ...(prevState.filter || {}),
        fields: Array.isArray(fields) ? fields : []
      }
    }), reason);
  }

  patchTempColumnSettings(columnKey, patch = {}) {
    if (!columnKey) return;
    this.tempSettings = { ...(this.tempSettings || {}),
      cols: { ...(this.tempSettings?.cols || {}),
        [columnKey]: { ...(this.tempSettings?.cols?.[columnKey] || {}),
          ...(typeof patch === "function" ? patch() : patch)
        }
      }
    };
  }

  patchTempFilterTagSettings(columnKey, patch = {}) {
    if (!columnKey) return;
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        tags: { ...(this.tempSettings?.filter?.tags || {}),
          [columnKey]: { ...(this.tempSettings?.filter?.tags?.[columnKey] || {}),
            ...(typeof patch === "function" ? patch() : patch)
          }
        }
      }
    }; // The same defect the pins had: a patch is a plain property, so nothing
    // redrew and anything reading the draft kept the state it was drawn
    // with -- here the button that says how many conditions are pending.
    // Switching a condition on is a checkbox, so a redraw costs nothing a
    // person can feel.

    this.requestComponentUpdate('filter-tag');
  }

  patchTempFilterValue(fieldKey, patch = {}) {
    if (!fieldKey) return;
    const currentValues = this.getCurrentFilterValues(this.getPendingFilterState());
    const currentValue = this.tempSettings?.filter?.values?.[fieldKey] || currentValues[fieldKey] || {};
    const nextPatch = typeof patch === "function" ? patch(currentValue) : patch;
    const nextValue = { ...currentValue,
      ...(nextPatch || {})
    };

    const isSameValue = (current, next) => {
      if (!Array.isArray(current) || !Array.isArray(next)) {
        return Object.is(current, next);
      }

      if (current.length !== next.length) {
        return false;
      }

      return current.every((item, index) => Object.is(item, next[index]));
    };

    const changed = Object.keys(nextValue).some(key => !isSameValue(currentValue[key], nextValue[key]));

    if (!changed) {
      return;
    }

    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        values: { ...(this.tempSettings?.filter?.values || {}),
          [fieldKey]: nextValue
        }
      }
    };
    this.requestComponentUpdate('temp-filter-value');
  }

  isEmptyFilterValue(value) {
    if (value === null || typeof value === "undefined") {
      return true;
    }

    if (Array.isArray(value)) {
      return value.every(item => this.isEmptyFilterValue(item));
    }

    if (typeof value === "string") {
      return value.trim() === "";
    }

    if (value && typeof value === "object") {
      return Object.values(value).every(item => this.isEmptyFilterValue(item));
    }

    return false;
  }

  isEmptyFilterEntry(entry) {
    if (!entry || typeof entry !== "object") {
      return this.isEmptyFilterValue(entry);
    }

    if (Object.prototype.hasOwnProperty.call(entry, "values")) {
      return this.isEmptyFilterValue(entry.values);
    }

    if (Object.prototype.hasOwnProperty.call(entry, "value")) {
      return this.isEmptyFilterValue(entry.value);
    }

    return Object.entries(entry).filter(([key]) => !["operator", "control", "type"].includes(key)).every(([, value]) => this.isEmptyFilterValue(value));
  }

  mergeFilterState(prevFilter = {}, tempFilter = {}) {
    const {
      filter,
      tags,
      values
    } = this.getMergedFilterDraftData(prevFilter, tempFilter);
    return this.patchFilterTemplateData(filter, {
      tags,
      values
    });
  } // What the person typed over the list of fields. Kept in state so the list
  // and the field agree after a render; there can be hundreds of fields and
  // scrolling for one is not an answer.


  setColumnSettingsQuery(value = "") {
    return this.set({
      columnSettingsQuery: String(value ?? "")
    });
  } // Case and ё/е are not differences a person means when searching.


  matchesColumnQuery(label = "", query = "") {
    const normalise = value => String(value ?? "").toLowerCase().replace(/ё/gu, "е");

    const needle = normalise(query).trim();
    if (!needle) return true;
    return normalise(label).includes(needle);
  }

  getColumnCheckboxItems(options = {}) {
    const {
      checked,
      onChange,
      refPrefix = "column"
    } = options;
    const {
      pin = false,
      handle = false,
      query = "",
      group = ""
    } = options; // A group is one of the two sortable lists: the pinned columns -- the
    // system ones among them, offered nothing -- or the loose ones.

    const inGroup = col => !group || (group === 'pinned' ? col.system || this.isColumnPinned(col) : !col.system && !this.isColumnPinned(col));

    return this.getColumnItems().filter(col => inGroup(col) && (!pin || col.system || this.matchesColumnQuery(col.label, query))).map(col => {
      const itemRef = this.getItemRef(`${refPrefix}:${col.key}`) || false;
      const isChecked = typeof checked === "function" ? Boolean(checked(col)) : Boolean(checked);
      const box = (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                <sf-checkbox
                    size=${this.size}
                    label=${col.label}
                    position="end"
                    root-class="content-main-between"
                    ?checked=${isChecked}
                    ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_13__.ref)(itemRef)}
                    @change=${event => onChange?.(col, event)}
                ></sf-checkbox>
            `;

      if (!pin || col.system) {
        return box;
      } // The pin sits beside the visibility box, because both are answers
      // about the same column. The box and the row menu are always pinned
      // and are offered nothing.


      const pinned = this.isColumnPinned(col);
      return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                <div class="sf-table-column-option flex items-cross-center gap-1/3"
                     data-column-key=${col.key}
                     data-sf-sortable-item=${col.key}
                     data-pinned=${pinned ? "1" : "0"}>
                    ${handle ? (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`<sf-button-icon
                                size="1/2"
                                appearance="link"
                                scheme="on-surface"
                                icon="drag_indicator"
                                data-move
                                data-sf-sortable-handle
                                root-class="sf-table-column-move cursor-grab"
                                aria-label=${`${this.text("columnMoveLabel", "column-move-label")}: ${col.label || col.key}`}
                            ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_12__.nothing}
                    <span class="flex-1 min-w-0">${box}</span>
                    <!-- A pinned column's pin is filled and a loose one's is
                         outlined, the way a pinned filter template already
                         shows itself. Colour alone had to carry the state, and
                         the two schemes are close enough that a person reading
                         a list of twenty pins could not tell which were set. -->
                    <sf-button-icon
                        size="1/2"
                        appearance="link"
                        scheme=${pinned ? "primary" : "on-surface"}
                        ?filled=${pinned}
                        icon="push_pin"
                        title=${pinned ? this.text("unpinColumnLabel", "unpin-column-label") : this.text("pinColumnLabel", "pin-column-label")}
                        aria-label=${pinned ? this.text("unpinColumnLabel", "unpin-column-label") : this.text("pinColumnLabel", "pin-column-label")}
                        aria-pressed=${pinned ? "true" : "false"}
                        @click=${() => this.toggleColumnPinned(col)}
                    ></sf-button-icon>
                </div>
            `;
    });
  } // «Сбросить» in the column settings: the state the window opened with,
  // applied at once and announced once -- not the host's defaults, which is
  // what the filter window's own Reset asks for.


  restoreColumnSettingsOnOpen(reason = 'column-settings-restore') {
    const columnSettings = JSON.parse(JSON.stringify(this._columnSettingsOnOpen || {}));
    this.tempSettings = null;
    this.set(prevState => ({ ...prevState,
      columnSettings
    }), reason, () => this.emitColumnSettingsChange(reason));
    return this;
  } // What «Применить» did, as a method, so a control that applies on the spot
  // does exactly the same thing rather than its own version of it.


  commitColumnSettings(reason = 'table-settings') {
    const tempSettings = this.tempSettings || {};
    const {
      cols: tempColumns,
      ...rest
    } = tempSettings;
    if (!tempColumns) return this;
    const columnSettings = this.mergeColumnSettings(this.getColumnSettings(), tempColumns);
    this.tempSettings = Object.keys(rest).length ? rest : null;
    this.set(prevState => ({ ...prevState,
      columnSettings
    }), reason, () => this.emitColumnSettingsChange(reason));
    return this;
  } // Pinning a column puts it at the end of the pinned block, unpinning it at
  // the start of the loose ones — the place a person expects what they just
  // moved to be, rather than wherever its old order number happens to land it.


  toggleColumnPinned(col) {
    if (!col?.key || col.system) return this;
    const next = !this.isColumnPinned(col);
    const columns = this.getColumnItems().filter(column => column?.key && !column.system);
    const orders = columns.map((column, index) => {
      const pending = this.tempSettings?.cols?.[column.key];
      const setting = this.getColumnSetting(column.key) || {};
      const value = Number(pending?.order ?? setting.order ?? column.order);
      return Number.isFinite(value) ? value : (index + 1) * 10;
    });
    const group = columns.map((column, index) => ({
      column,
      order: orders[index]
    })).filter(entry => entry.column.key !== col.key && this.isColumnPinned(entry.column) === next);
    const order = next ? Math.max(0, ...group.map(entry => entry.order)) + 10 // Never below 0: the host refuses a negative order, and a loose
    // column already at 0 made an unpin send -10 and fail.
    : Math.max(0, Math.min(...group.map(entry => entry.order), 10) - 10);
    this.patchTempColumnSettings(col.key, {
      pinned: next,
      order
    }); // The patch is a plain property, so nothing re-rendered and the pin kept
    // the state it was drawn with: every pin read aria-pressed="false", a
    // press looked like it had done nothing, and the only visible effect was
    // the row moving into the pinned group on some later render.

    this.requestComponentUpdate('column-pin'); // A pin applies on the spot and reaches the host, by the consumer
    // owner's decision of 2026-10-05. Before it, a press wrote a draft that
    // a click outside the window threw away without saying so, and with the
    // window's own buttons below the fold that read as "pins do not work".

    this.commitColumnSettings('column-pin');
    return this;
  } // Two sortable lists, one under the other: the pinned rows, then the
  // loose ones. Each is a group of its own, so a row stays in its group.


  renderSortableGroups(pinnedRows, looseRows, {
    name,
    label,
    onIntent
  }) {
    const list = (group, rows) => rows.length ? (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`<sf-sortable
                group=${`${name}-${group}`}
                data-group=${group}
                label=${label}
                class="flex flex-col gap-1/3"
                @sf-sortable-intent=${onIntent}>${rows}</sf-sortable>` : lit__WEBPACK_IMPORTED_MODULE_12__.nothing;

    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`${list('pinned', pinnedRows)}${list('loose', looseRows)}`;
  }

  getTableColsData(group = '') {
    return this.getColumnCheckboxItems({
      group,
      pin: true,
      handle: true,
      query: this.state.columnSettingsQuery || "",
      refPrefix: "table-column",
      checked: col => this.isColumnVisible(col),
      onChange: (col, event) => {
        this.patchTempColumnSettings(col.key, {
          visible: Boolean(event.target?.checked)
        }); // Everything in this window applies at once, by the consumer
        // owner's decision of 2026-10-05, so a click outside loses
        // nothing and no «Применить» is left to press.

        this.commitColumnSettings('column-visibility');
      }
    });
  }

  getFilterTagColsData() {
    const fields = this.getFilterFields().filter(field => field?.filter?.enabled !== false);
    const items = fields.length ? fields : this.getColumnItems();
    return items.map(field => {
      const pending = this.tempSettings?.filter?.tags?.[field.key];
      const current = this.getCurrentFilterTags(this.getPendingFilterState())?.[field.key];
      const data = {
        type: "checkbox",
        props: {
          size: this.size,
          label: field.label,
          position: 'end',
          rootClass: 'content-main-between',
          checked: pending?.active ?? current?.active ?? false,
          ':ref': this.getItemRef(`filter-tag-column:${field.key}`) || false,
          '@change': event => {
            this.patchTempFilterTagSettings(field.key, {
              active: Boolean(event.target?.checked),
              label: field.label,
              control: field.filter?.control || field.type || field.dataType || 'text'
            });
          }
        }
      };
      return this.renderSmartElement(data.type, data.props);
    });
  }

  getFilterControlValue(fieldKey) {
    return { ...(this.getCurrentFilterValues()?.[fieldKey] || {}),
      ...(this.tempSettings?.filter?.values?.[fieldKey] || {})
    };
  }

  getFilterOptions(field = {}) {
    const filter = field.filter || {};
    const source = filter.optionsSource || {};

    if (source.type === 'endpoint') {
      const page = this.getEndpointFilterPage(field);
      const selected = new Set(this.getFilterControlValue(field.key).values || []);
      const options = new Map();

      for (const option of [...(page?.selected || []), ...(page?.items || [])]) {
        if (typeof option?.value === 'string' && typeof option?.label === 'string') {
          if (selected.has(option.value) || (page?.items || []).includes(option)) {
            options.set(option.value, option);
          }
        }
      }

      return [...options.values()];
    }

    if (Array.isArray(filter.options)) {
      return filter.options;
    }

    if (Array.isArray(source.items)) {
      return source.items;
    }

    return [];
  }

  getEndpointFilterPage(field = {}) {
    const source = field.filter?.optionsSource;

    if (source?.type !== 'endpoint' || typeof source.url !== 'string' || !source.url.trim() || !field.key) {
      return null;
    }

    let page = this._filterOptionPages.get(field.key);

    if (!page || page.url !== source.url) {
      page?.controller?.abort();
      page = {
        url: source.url,
        items: [],
        selected: [],
        nextCursor: null,
        status: 'idle',
        sequence: 0,
        searchable: false
      };

      this._filterOptionPages.set(field.key, page);

      queueMicrotask(() => {
        if (this.isConnected && this._filterOptionPages.get(field.key) === page) {
          this.loadEndpointFilterPage(field);
        }
      });
    }

    return page;
  }

  async loadEndpointFilterPage(field = {}, cursor = null, search = '') {
    const page = this.getEndpointFilterPage(field);
    if (!page || !this.isConnected) return false;
    let url;

    try {
      url = new URL(page.url, globalThis.location?.href);
      if (url.origin !== globalThis.location?.origin) throw new TypeError('filter_options_cross_origin');
    } catch {
      page.status = 'error';
      this.requestComponentUpdate('filter-options');
      return false;
    }

    page.controller?.abort();
    const controller = new AbortController();
    const sequence = ++page.sequence;
    page.controller = controller;
    page.status = 'loading';
    url.searchParams.set('limit', '50');
    url.searchParams.set('sequence', String(sequence));
    if (cursor) url.searchParams.set('cursor', cursor);else url.searchParams.delete('cursor');
    if (search && page.searchable) url.searchParams.set('search', search);else url.searchParams.delete('search');
    url.searchParams.delete('selected_values[]');

    for (const value of this.getFilterControlValue(field.key).values || []) {
      if (typeof value === 'string') url.searchParams.append('selected_values[]', value);
    }

    this.requestComponentUpdate('filter-options');

    try {
      const response = await fetch(url, {
        credentials: 'same-origin',
        signal: controller.signal,
        headers: {
          Accept: 'application/json'
        }
      });
      const answer = await response.json();
      if (page.sequence !== sequence || this._filterOptionPages.get(field.key) !== page || !this.isConnected) return false;

      if (!response.ok || answer?.status !== 'ok' || answer.sequence !== sequence || !Array.isArray(answer.items) || !Array.isArray(answer.selected) || answer.next_cursor !== null && typeof answer.next_cursor !== 'string') {
        throw new TypeError('filter_options_answer_invalid');
      }

      const clean = items => items.filter(item => typeof item?.value === 'string' && item.value && typeof item?.label === 'string' && item.label).map(({
        value,
        label
      }) => ({
        value,
        label
      }));

      const merged = new Map((cursor ? page.items : []).map(item => [item.value, item]));

      for (const item of clean(answer.items)) merged.set(item.value, item);

      page.items = [...merged.values()];
      page.selected = clean(answer.selected);
      page.nextCursor = answer.next_cursor;
      page.searchable = answer.searchable === true;
      page.status = 'ready';
      this.requestComponentUpdate('filter-options');
      return true;
    } catch (error) {
      if (page.sequence !== sequence || error?.name === 'AbortError') return false;
      page.status = 'error';
      this.requestComponentUpdate('filter-options');
      return false;
    }
  }

  getFilterOptionSearch(fieldKey) {
    if (!fieldKey) return '';
    return this.tempSettings?.filterSearch?.[fieldKey] || '';
  }

  patchTempFilterOptionSearch(fieldKey, value = '') {
    if (!fieldKey) return;
    this.tempSettings = { ...(this.tempSettings || {}),
      filterSearch: { ...(this.tempSettings?.filterSearch || {}),
        [fieldKey]: String(value || '')
      }
    };
    this.requestComponentUpdate('filter-option-search');
    const field = this.getFilterField(fieldKey);
    const page = field && this.getEndpointFilterPage(field);

    if (page?.searchable) {
      clearTimeout(page.searchTimer);
      page.searchTimer = setTimeout(() => this.loadEndpointFilterPage(field, null, String(value || '').trim()), 200);
    }
  }

  filterUpdate() {
    return this.getFilterPayload();
  }

  getFilterOptionSearchKeys(field = {}) {
    const keys = field.filter?.searchKeys || field.filter?.optionSearchKeys;

    if (Array.isArray(keys) && keys.length) {
      return keys;
    }

    return ['label', 'title', 'name', 'text', 'value', 'id'];
  }

  getObjectPathValue(source = {}, path = '') {
    return String(path || '').split('.').filter(Boolean).reduce((value, key) => {
      if (value === null || typeof value === 'undefined') {
        return '';
      }

      return value[key];
    }, source);
  }

  normalizeFilterSearchValue(value = '') {
    return String(value || '').trim().toLowerCase();
  }

  optionMatchesSearch(option = {}, search = '', keys = []) {
    const query = this.normalizeFilterSearchValue(search);
    if (!query) return true;
    return keys.some(key => {
      const value = this.getObjectPathValue(option, key);
      return this.normalizeFilterSearchValue(value).includes(query);
    });
  }

  getVisibleFilterOptions(field = {}) {
    const options = this.getFilterOptions(field);
    const search = this.getFilterOptionSearch(field.key);

    if (!search) {
      return options;
    }

    const keys = this.getFilterOptionSearchKeys(field);
    return options.filter(option => this.optionMatchesSearch(option, search, keys));
  } // A cell for a column that names a property type: the Framework's renderer
  // for that type, or nothing, in which case the value renders as itself. A
  // host that passes its own component never reaches here -- the escape hatch
  // is that the host's choice is consulted first, by the template.
  // The set answers with a cell value in the shape a host would pass -- a
  // string, an object with a component, or a list of those -- so the template
  // renders it through the path it already had. The set adds no second way to
  // draw a cell.
  // A boolean cell the host lets this person write: the table is told it
  // may (inline-edit) and the record names the field in `editable`.


  cellEditable(row = {}, column = {}) {
    if (this.getAttribute("inline-edit") !== "true") return false;
    if ((column.propertyType ?? column.property_type ?? column.type) !== "boolean") return false;
    return Array.isArray(row.editable) && row.editable.map(String).includes(String(column.key));
  }

  cellPending(row = {}, column = {}) {
    return this._pendingCells?.has(`${this.getRowKey(row)}\u0000${column.key}`) === true;
  } // A checkbox pressed: the cell waits for the host, which answers with the
  // record as it now is, or not, and then the row is drawn from what it says.


  setCellValue(row = {}, column = {}, value) {
    const id = this.getRowKey(row);
    this._pendingCells ??= new Set();

    this._pendingCells.add(`${id}\u0000${column.key}`);

    this.requestComponentUpdate("cell-pending");
    this.emitTableEvent("cell-set", Object.freeze({
      id: row.id ?? id,
      key: column.key,
      value,
      revision: row._revision ?? row.revision ?? null
    }));
  }

  clearCellPending(id, key) {
    if (this._pendingCells?.delete(`${id}\u0000${key}`)) this.requestComponentUpdate("cell-pending");
  } // The box shows what the host holds again. A render cannot do it: the
  // value it would draw is the one it drew before the click, so nothing
  // changes for it, while the box itself was toggled by the click.


  resetCellControl(id, key, value) {
    const escape = text => String(text).replace(/"/gu, '\\"');

    const box = this.querySelector(`tbody tr[data-row-id="${escape(id)}"] [data-cell-edit="${escape(key)}"]`);
    if (!box) return;
    const checked = value === true;
    box.checked = checked;
    box.toggleAttribute("checked", checked);
    const input = box.querySelector("input");
    if (input) input.checked = checked;
  }

  getTypedCellValue(column = {}, value) {
    // The host is passed so `formatFieldValue` is reachable from a cell. It
    // was reachable from the record panel and not from the list -- the
    // panel hands the renderer set its port, the table handed it nothing --
    // so the same date read «25 сентября 2026» in a card and
    // «2026-09-25T07:12:00+03:00» in a row, and a consumer had no way to
    // change the second. The set still refuses to guess a format; this only
    // lets the host say one (admin polygon, 2026-10-10).
    const host = this.cellHost ?? null;
    const type = column.propertyType ?? column.property_type ?? column.type; // Several files are one value each, as several choices are tags: the
    // renderer set reads a file and not a list of them, so a column of
    // documents drew nothing at all (the Fields page, 2026-11-05). Each is
    // its name with its kind's icon, and what does not fit folds into «+N».

    if (type === "file" && Array.isArray(value)) {
      const files = value.map(file => (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_9__.renderCellField)(column, file, host)).filter(item => item !== null && item !== undefined);
      return files.length ? files : null;
    }

    const rendered = (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_9__.renderCellField)(column, value, host);
    if (rendered !== null && rendered !== undefined) return rendered; // A date the host did not format reads in the page's language rather
    // than as stored (format-date); the host's formatFieldValue still wins.

    if (_js_format_value_js__WEBPACK_IMPORTED_MODULE_11__.DATE_TYPES.has(type)) return (0,_js_format_value_js__WEBPACK_IMPORTED_MODULE_11__.formatDateValue)(type, value, this) || null;
    return null;
  } // The text a long-text cell shows on its one line: formatted text is its
  // text, not its markup -- «<p>Этапы: <strong>дизайн</strong>…» stood in
  // the row as written (the Fields page, 2026-11-05).


  cellText(column = {}, value) {
    const type = column.propertyType ?? column.property_type ?? column.type;
    return type === "html" ? (0,_field_renderers_html_js__WEBPACK_IMPORTED_MODULE_10__.htmlText)(value) : String(value);
  } // The filter controls were the Framework's only type-aware rendering, and
  // Larena's request asks for one renderer set shared by the record view and
  // the table's cells. Keeping these here as well would have made two maps
  // for one question, so they moved into src/smart/field-renderers and this
  // asks the set. The host interface is small on purpose: the set renders,
  // the table owns the state.


  renderFilterControl(field = {}) {
    return (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_9__.renderFilterField)(field, {
      // The filter controls take this size: the host built here had none,
      // so the search field in a field's window stayed at 1 beside
      // buttons at 1/2.
      size: this.size,
      getFilterControlValue: key => this.getFilterControlValue(key),
      patchTempFilterValue: (key, patch) => this.patchTempFilterValue(key, patch),
      getFilterOperatorLabel: operator => this.getFilterOperatorLabel(operator),
      getFilterOptionSearch: key => this.getFilterOptionSearch(key),
      patchTempFilterOptionSearch: (key, search) => this.patchTempFilterOptionSearch(key, search),
      getVisibleFilterOptions: item => this.getVisibleFilterOptions(item),
      renderFilterOption: (item, option) => this.renderFilterOption(item, option),
      getEndpointFilterPage: item => this.getEndpointFilterPage(item),
      loadEndpointFilterPage: (item, cursor, search) => this.loadEndpointFilterPage(item, cursor, search)
    });
  }

  renderFilterOption(field = {}, option = {}, selected = new Set()) {
    const value = option.value ?? option.id ?? option.key ?? option.label ?? option.title;
    const label = option.label || option.title || String(value || '');
    const badge = field.filter?.optionRenderer === 'badge' ? (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_8__.optionBadgeProps)(option) : null; // An option list is a dense place: its badge keeps the size's own narrow
    // side room (sf-badge tight, sf-badge 1.3.0), as a cell's choice badge does.

    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <div
                    ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_13__.ref)(this.getItemRef(option.label))}
                    class="flex items-cross-center gap-1/2 content-main-between">
                <div class="flex items-cross-center gap-1/2 min-w-0">
                    ${badge ? (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                        <sf-badge
                                appearance="tonal"
                                tight
                                scheme=${badge.scheme}
                                root-style=${badge.rootStyle || lit__WEBPACK_IMPORTED_MODULE_12__.nothing}
                                icon=${option.icon || lit__WEBPACK_IMPORTED_MODULE_12__.nothing}
                                text=${label}
                        ></sf-badge>
                    ` : (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                        ${this.renderFilterOptionVisual(field, option)}
                        <span class="sf-text-1 truncate">${label}</span>
                    `}
                </div>
                <sf-checkbox
                        size=${this.size}
                        position="end"
                        root-class="content-main-between"
                        ?checked=${selected.has(value)}
                        @change=${event => {
      const nextSelected = new Set(selected);

      if (event.target?.checked) {
        nextSelected.add(value);
      } else {
        nextSelected.delete(value);
      }

      this.patchTempFilterValue(field.key, {
        values: Array.from(nextSelected),
        operator: field.filter?.defaultOperator || 'in'
      });
    }}
                ></sf-checkbox>
            </div>
        `;
  }

  renderFilterOptionVisual(field = {}, option = {}) {
    // A colour from the field's palette is shown as its swatch.
    if (field.filter?.optionRenderer === 'swatch' && option.color) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`<span class="sf-table-filter-swatch" aria-hidden="true" style=${`background-color: ${option.color}`}></span>`;
    }

    if (field.filter?.optionRenderer !== 'avatar-checkbox') {
      return '';
    }

    if (option.imageUrl) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                <sf-avatar
                        size=${this.size}
                        image-url="${option.imageUrl}"
                        heading="${option.title || option.label || ''}"
                ></sf-avatar>
            `;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <sf-avatar
                    size=${this.size}
                    heading="${option.avatarText || option.title || option.label || ''}"
            ></sf-avatar>
        `;
  }

  getFilterOperatorLabel(operator) {
    const keys = {
      eq: 'operatorEq',
      gt: 'operatorGt',
      gte: 'operatorGte',
      lt: 'operatorLt',
      lte: 'operatorLte',
      between: 'operatorBetween',
      contains: 'operatorContains',
      startsWith: 'operatorStartsWith',
      any: 'operatorAny',
      today: 'operatorToday',
      week: 'operatorWeek',
      month: 'operatorMonth',
      in: 'operatorIn'
    }; // An operator nobody has a word for is shown as it is stored, which is
    // better than a blank and says what to add.

    return keys[operator] ? this.text(keys[operator]) : operator;
  }

  renderFilterSettingsContextMenu(data) {
    const {
      x,
      y,
      position,
      columnCount,
      columnsCount,
      transform
    } = data;
    let pos = `translateX(${transform !== undefined ? transform : 0}%)`;
    const pendingFilter = this.getPendingFilterState(); // What a press would change, so the button can say it. The button is
    // already a filled primary one, so an extra fill or ring would say
    // nothing: the count is the marked state, and with nothing pending the
    // button reads exactly as it did before. sf-button carries no `filled`
    // property -- that belongs to the icon button -- so setting one would
    // have been an attribute nobody reads.

    const pendingConditions = this.countPendingFilterConditionChanges();
    const selectedTemplateKey = pendingFilter.selectedTemplateKey;
    const sortedTemplates = this.getSortedFilterTemplates(pendingFilter);
    const sortTemplates = sortedTemplates.map(col => {
      let component;
      const isActiveEdit = this.state.filter.rename === col.key;

      if (this.state.filter.rename !== col.key) {
        const data = {
          type: "radio",
          props: {
            size: this.size,
            // A template the host gave no name is the view as it
            // stands: it is named so, not drawn as an empty row
            // (owner, 2026-10-14).
            label: col.label || this.text('untitledTemplateText'),
            name: 'filter_templates',
            checked: selectedTemplateKey ? selectedTemplateKey === col.key : col.selected || false,
            '@change': () => {
              this.selectTempFilterTemplate(col.key);
            }
          }
        };
        component = this.renderSmartElement(data.type, data.props);
      } else {
        component = (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                    <div class="flex items-cross-center gap-1/4 flex-1">
                        <sf-input size=${this.size} ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_13__.ref)(this.refs.renameInput)} root-class="flex-1"
                                  default-value="${col.label}"></sf-input>
                        <div class="flex items-cross-center flex-none">
                            <sf-button-icon size=${this.size} segment="start" appearance="outline" scheme="on-surface" @click="${() => {
          this.set(prevState => ({
            filter: { ...(prevState.filter || {}),
              rename: ''
            }
          }));
        }}"
                                            icon="close"></sf-button-icon>
                            <sf-button-icon size=${this.size} segment="end" icon="check" @click="${() => {
          const name = this.refs.renameInput.value?.value;
          this.saveFilterTemplatePatch(col.key, {
            label: name
          }, {
            filterPatch: {
              rename: ''
            },
            saveInputValue: name
          });
        }}"></sf-button-icon>
                        </div>
                    </div>`;
      }

      return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                <div
                        :key=${col.key}
                        ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_13__.ref)(this.getItemRef(col.label))}
                        class="sf-settings-context-menu-item flex items-cross-center flex-1 gap-1/3 ${col.deleted ? 'opacity-3' : ''}"
                        data-filter-template-key="${col.key}"
                        data-sf-sortable-item=${col.key}
                        data-pinned="${col.pinned ? "1" : "0"}"
                >
                    ${!isActiveEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                        <sf-button-icon size=${this.size}
                                id="${this.getInstanceId()}--template-move--${col.key}"
                                appearance="link"
                                data-move
                                data-sf-sortable-handle
                                scheme="on-surface"
                                aria-label=${`${this.text("templateMoveLabel")}: ${col.label}`}
                                icon="drag_indicator"
                                root-class="cursor-move"
                        ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_12__.nothing}
                    ${component}
                    ${!isActiveEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                        <div class="flex items-cross-center m-inline-start-auto gap-1/3">
                            <sf-button-icon
                                    appearance="link"
                                    data-keep
                                    size="1/3"
                                    scheme="on-surface"
                                    aria-label=${`${this.text("templatePinLabel")}: ${col.label}`}
                                    ?filled="${col.pinned}"
                                    root-class="${col.pinned ? 'sf-button-pinned' : ''}"
                                    icon="keep"
                                    @click=${() => {
        this.patchTempFilterTemplateSettings(col.key, {
          pinned: !col.pinned
        });
      }}
                            ></sf-button-icon>
                            <sf-button-icon size=${this.size}
                                    appearance="link"
                                    data-settings
                                    data-context-submenu-anchor="${col.key}"
                                    scheme="on-surface"
                                    aria-label=${`${this.text("templateActionsLabel")}: ${col.label}`}
                                    icon="more_vert"
                                    @click=${event => {
        this.openContextSubmenu(event, {
          type: 'filter-template-actions',
          template: col
        });
      }}
                            ></sf-button-icon>
                        </div>` : lit__WEBPACK_IMPORTED_MODULE_12__.nothing}
                </div>`;
    });
    const menuColumnCount = columnCount ?? columnsCount ?? this.contextMenuColumns ?? 1;
    const colsData = this.getFilterTagColsData();
    const columnGroups = this.splitItemsByColumns(colsData, menuColumnCount);
    let contextItems = `${this.text('templatesTabText')}|${this.text('fieldsTabText')}`;
    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <sf-menu-context
                    size=${this.size === "1/2" ? "1/2" : "1"}
                    :key=${x + y + this._renderToken}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'filter-settings'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            transform: ${pos};
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
            --sf-table-context-menu--max-block-size: calc(100dvh - ${y}px - var(--sf-space-4));
          "
                    root-class="sf-table-context-menu ${this.size === "1/2" ? "sf-table-context-menu--dense " : ""}flex flex-col"
                    position="${position || ""}"
                    role="dialog"
                    tabs=${contextItems}
                    active-tab=${this._filterTab === 'fields' ? '1' : '0'}
                    closable
                    @sf-menu-context-tab=${event => {
      event.stopPropagation();
      this._filterTab = event.detail?.index === 1 ? 'fields' : 'templates';
      this.requestComponentUpdate('filter-tab');
    }}
                    @sf-menu-context-close=${event => {
      event.stopPropagation();
      this.closeContextMenu();
    }}
            >
                <!-- The Framework's panel with tabs (owner, 2026-10-15): the
                     tabs stay while the rows scroll, the buttons stay at the
                     bottom, and the window keeps its width -- it grew under
                     the pointer when «Применить (2)» got longer. -->
                <div class="sf-table-context-body flex flex-col flex-1" slot="content">
                    ${this._filterTab !== 'fields' ? (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                            <div
                                    class="sf-context-menu-columns flex flex-col gap-1/4 overflow-auto flex-1"
                                    data-filter-template-list
                            >
                                ${this.renderSortableGroups(sortTemplates.filter((_, at) => sortedTemplates[at].pinned), sortTemplates.filter((_, at) => !sortedTemplates[at].pinned), {
      name: 'filter-templates',
      label: this.text('templatesTabText'),
      onIntent: event => this.onFilterTemplateIntent(event)
    })}
                            </div>` : (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                            <div class="sf-context-menu-columns flex flex-1 gap-1 overflow-auto">
                                ${columnGroups.map(group => (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                                            <div class="flex flex-col gap-1 flex-1">
                                                ${group}
                                            </div>
                                        `)}
                            </div>`}
                </div>
                        <sf-button slot="footer" size=${this.size} @click="${() => {
      // Reset means the defaults, not "forget what I just
      // typed here": the draft goes, and the host is asked
      // to clear the person's own layer — order, widths,
      // visibility and pinning — because the defaults are
      // the host's to decide, not this component's.
      this.tempSettings = null;
      this.requestComponentUpdate('table');
      this.requestColumnSettingsReset();
    }}" appearance="outline" scheme="on-surface" root-class="flex-1"
                                   text="${this.text('resetText')}"></sf-button>
                        <sf-button slot="footer" size=${this.size} @click="${() => {
      const tempFilter = this.tempSettings?.filter;

      if (tempFilter) {
        let changedTemplates = [];
        let deletedKeys = [];
        let selectedKey = null;
        this.set(prevState => {
          const hasDataChanges = this.hasPendingFilterDataChanges(prevState.filter || {});
          const filter = this.mergeFilterState(prevState.filter || {}, tempFilter);
          const selectedTemplate = this.getSelectedFilterTemplate(filter);
          changedTemplates = tempFilter.templates ? this.getChangedFilterTemplates(prevState.filter || {}, filter, ['order', 'pinned', 'deleted', 'selected', 'default']) : [];
          deletedKeys = filter.templates.filter(template => template.deleted && template.key).map(template => template.key);
          filter.templates = filter.templates.filter(el => !el.deleted);
          const previousKey = this.getSelectedFilterTemplate(prevState.filter || {})?.key || null;
          selectedKey = selectedTemplate?.key && selectedTemplate.key !== previousKey ? selectedTemplate.key : null;
          return {
            filter,
            filterDataDirty: prevState.filterDataDirty || hasDataChanges,
            saveInputValue: selectedTemplate?.label || ""
          };
        }, () => {
          if (changedTemplates.length) {
            this.dispatchFilterTemplatesSave(changedTemplates);
          }

          for (const key of deletedKeys) {
            this.emitTableEvent('template-delete', Object.freeze({
              key
            }));
          }

          if (selectedKey) {
            this.emitTableEvent('template-select', Object.freeze({
              key: selectedKey
            }));
          }
        });
      }

      this.tempSettings = null;
      this.closeContextMenu();
    }}" root-class="flex-1"
                                   aria-label=${pendingConditions ? `${this.text("filterApplyText", "filter-apply-text")}: ${pendingConditions}` : this.text("filterApplyText", "filter-apply-text")}
                                   text=${pendingConditions ? `${this.text("filterApplyText", "filter-apply-text")} (${pendingConditions})` : this.text("filterApplyText", "filter-apply-text")}></sf-button>
            </sf-menu-context>
        `;
  }

  renderTagsSettingsContextMenu(data) {
    const {
      x,
      y,
      position,
      fieldKey
    } = data;
    const field = this.getFilterField(fieldKey) || {
      key: fieldKey,
      label: this.getCurrentFilterTags()?.[fieldKey]?.label || fieldKey || '',
      filter: {
        control: this.getCurrentFilterTags()?.[fieldKey]?.control || 'text'
      }
    };
    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <sf-menu-context
                    size=${this.size === "1/2" ? "1/2" : "1"}
                    :key=${x + y + this._renderToken}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'tag-settings'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
          "
                    root-class="sf-table-context-menu ${this.size === "1/2" ? "sf-table-context-menu--dense " : ""}flex flex-col"
                    position="${position || ""}"
            >
                <div class="flex flex-col flex-1 ${this.size === "1/2" ? "p-top-1" : "p-top-3"}" slot="content">
                    <div class="sf-table-context-main">
                        <div class="sf-table-tags-search flex flex-col">
                            <div class="flex flex-col ${this.size === "1/2" ? "p-bottom-1" : "p-bottom-3"}">
                                ${this.renderFilterControl(field)}
                            </div>
                        </div>
                    </div>
                    <div class="sf-table-context-bottom sf-context-menu-footer">
                        <sf-button size=${this.size} @click="${() => {
      this.tempSettings = null;
      this.requestComponentUpdate('table');
    }}" appearance="outline" scheme="on-surface" root-class="flex-1"
                                   text="${this.text('resetText')}"></sf-button>
                        <sf-button size=${this.size} @click="${() => {
      const tempFilter = this.tempSettings?.filter;

      if (tempFilter) {
        this.set(prevState => {
          const hasDataChanges = this.hasPendingFilterDataChanges(prevState.filter || {});
          return {
            filter: this.mergeFilterState(prevState.filter || {}, tempFilter),
            filterDataDirty: prevState.filterDataDirty || hasDataChanges
          };
        }, () => {
          const detail = this.filterUpdate();
          this.emitTableEvent('filter-change', detail);
        });
      }

      this.tempSettings = null;
      this.closeContextMenu();
    }}" root-class="flex-1" text="${this.text('applyText')}"></sf-button>
                    </div>
                </div>
            </sf-menu-context>
        `;
  }

  removeFilterTag(id = null) {
    if (id) {
      this.tempSettings = null;
      this.set(prevState => {
        const prevFilter = prevState.filter || {};
        const tags = { ...this.getCurrentFilterTags(prevFilter)
        };
        const values = { ...this.getCurrentFilterValues(prevFilter)
        };
        delete tags[id];
        delete values[id];
        return {
          filter: this.patchFilterTemplateData(prevFilter, {
            tags,
            values
          }),
          filterDataDirty: true
        };
      }, () => {
        const detail = this.filterUpdate();
        this.emitTableEvent('filter-change', detail);
      });
      return this;
    }

    this.tempSettings = null;
    this.set(prevState => {
      const prevFilter = prevState.filter || {};
      return {
        filter: { ...prevFilter,
          selectedTemplateKey: "",
          templates: this.getFilterTemplates(prevFilter).map(template => ({ ...template,
            selected: false
          }))
        },
        saveInputValue: "",
        filterDataDirty: false
      };
    }, () => {
      const detail = this.filterUpdate();
      this.emitTableEvent('filter-change', detail);
    });
    return this;
  }

  renderTableSettingsContextMenu(data) {
    const {
      x,
      y,
      position,
      transform,
      columnCount,
      columnsCount
    } = data;
    let pos = `translateX(${transform !== undefined ? transform : 0}%)`;
    const menuColumnCount = columnCount ?? columnsCount ?? this.contextMenuColumns ?? 1;
    const cols = this.getTableColsData();
    const pinnedCols = this.getTableColsData('pinned');
    const looseCols = this.getTableColsData('loose');
    const query = this.state.columnSettingsQuery || ""; // The settings window is about the columns. Its "Actions" tab was asked
    // to go on 2026-10-02: row actions are offered in the row's own menu and
    // bulk actions in the band under the table, so a third place to find
    // them taught nobody anything.

    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <sf-menu-context
                    size=${this.size === "1/2" ? "1/2" : "1"}
                    :key=${x + y + this._renderToken}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'table-settings'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            transform: ${pos};
            z-index: var(--sf-table-context-menu--z-index, var(--sf-z-index-9));
            --sf-table-context-menu--max-block-size: calc(100dvh - ${y}px - var(--sf-space-4));
          "
                    root-class="sf-table-context-menu ${this.size === "1/2" ? "sf-table-context-menu--dense " : ""}flex flex-col"
                    position="${position || ""}"
                    role="dialog"
                    tabs=${`${this.text('settingsFieldsTab')}|${this.text('settingsViewTab')}`}
                    active-tab=${this._settingsTab === 'view' ? '1' : '0'}
                    closable
                    @sf-menu-context-tab=${event => {
      event.stopPropagation();
      this._settingsTab = event.detail?.index === 1 ? 'view' : 'fields';
      this.requestComponentUpdate('settings-tab');
    }}
                    @sf-menu-context-close=${event => {
      event.stopPropagation();
      this.closeContextMenu();
    }}
            >
                <!-- Two tabs (owner, 2026-10-14) in the Framework's panel
                     (2026-10-15): its head -- the tabs and the way out --
                     stays while the rows scroll, and its width is its own.
                     Esc, a click outside and the gear again close it too. -->
                <div class="sf-table-context-body flex flex-col flex-1" slot="content">
                    ${this._settingsTab === 'view' ? this.renderTableViewSettings() : (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                    <!-- The search: a site can have hundreds of fields, and
                         scrolling for one is not an answer. -->
                    <label class="sf-table-column-search flex flex-col">
                        <sf-input
                            size=${this.size}
                            appearance="bordered"
                            root-class="sf-table-column-search-input"
                            name="sf_table_column_search"
                            .value=${query}
                            placeholder=${this.text("columnSearchPlaceholder", "column-search-placeholder")}
                            aria-label=${this.text("columnSearchPlaceholder", "column-search-placeholder")}
                            @input=${event => this.setColumnSettingsQuery(event.target?.value ?? "")}
                        ></sf-input>
                    </label>
                    <div class="sf-context-menu-columns flex flex-col flex-1 gap-1/3 overflow-auto"
                         data-column-settings-list>
                        ${cols.length ? this.renderSortableGroups(pinnedCols, looseCols, {
      name: 'table-columns',
      label: this.text('settingsColumnLabel'),
      onIntent: event => this.onColumnSettingsIntent(event)
    }) : (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`<div class="sf-table-column-empty p-1 color-on-surface-variant">
                                ${this.text("columnSearchEmptyText", "column-search-empty-text")}
                            </div>`}
                    </div>
                    `}
                </div>
                <!-- «Применить» went with the consumer owner's decision of
                     2026-10-05: every control in this window applies as it is
                     pressed. «Сбросить» is the way back -- for the fields, the
                     settings as they stood when the window was opened; for the
                     view, the defaults. -->
                <!-- One button that stays, its words and act following the
                     tab: the panel took its footer once, at the start. -->
                <sf-button slot="footer" size=${this.size} appearance="outline" scheme="on-surface" root-class="flex-1"
                           text=${this._settingsTab === 'view' ? this.text('viewReset') : this.text('resetText')}
                           @click=${() => this._settingsTab === 'view' ? this.resetTableView() : this.restoreColumnSettingsOnOpen()}></sf-button>
            </sf-menu-context>
        `;
  } // The gear's «Вид»: the rows' density as a radio list, three switches, and
  // whether a change is for this table or for all the person's tables.


  renderTableViewSettings() {
    const view = this.tableView;
    const size = this.size === "1/2" ? "1/2" : "1";
    const everywhere = this._viewEverywhere === true;

    const row = (label, control) => (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`<div class="sf-table-settings-row">${control}<span>${label}</span></div>`;

    const density = ["compact", "normal", "spacious"];
    const label = {
      compact: "viewDensityCompact",
      normal: "viewDensityNormal",
      spacious: "viewDensitySpacious"
    };

    const check = (field, text) => (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`<label class="sf-table-settings-row" data-view-option=${field}>
            <sf-checkbox size=${size} ?checked=${view[field] === true}
                         @change=${event => this.setTableView({
      [field]: Boolean(event.target?.checked ?? event.detail?.checked)
    }, {
      everywhere
    })}></sf-checkbox>
            <span>${this.text(text)}</span></label>`;

    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <div class="sf-table-view-settings flex flex-col flex-1 gap-1/3" data-table-view-settings>
                <div class="sf-table-settings-heading">${this.text('viewDensity')}</div>
                <div role="radiogroup" aria-label=${this.text('viewDensity')} class="flex flex-col">
                    ${density.map(value => (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`<label class="sf-table-settings-row" data-view-density=${value}>
                        <sf-radio size=${size} name=${`${this.getInstanceId()}-density`} value=${value} ?checked=${view.density === value}
                                  @change=${() => this.setTableView({
      density: value
    }, {
      everywhere
    })}></sf-radio>
                        <span>${this.text(label[value])}</span></label>`)}
                </div>
                ${check("stripes", "viewStripes")}
                ${check("lines", "viewLines")}
                ${check("singleLine", "viewSingleLine")}
                ${this.getAttribute("vertical-scroll") === "page" ? check("stickyHead", "viewStickyHead") : lit__WEBPACK_IMPORTED_MODULE_12__.nothing}
                ${this.viewPreferenceKey ? (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`<div class="sf-table-settings-separator" role="separator"></div>
                    ${row(this.text('viewEverywhere'), (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`<sf-checkbox size=${size} data-view-everywhere ?checked=${everywhere}
                        @change=${event => {
      this._viewEverywhere = Boolean(event.target?.checked ?? event.detail?.checked);
      this.requestComponentUpdate('view-everywhere');
    }}></sf-checkbox>`)}` : lit__WEBPACK_IMPORTED_MODULE_12__.nothing}
            </div>`;
  }

  renderMainContextMenu(data) {
    const menu = data.menu || data.menuType || data.contextMenu;

    switch (menu) {
      case 'row-settings':
        return this.renderRowSettingsContextMenu(data);

      case 'create':
        return this.renderCreateContextMenu(data);

      case 'list-sort':
        return this.renderListSortContextMenu(data);

      case 'toolbar-actions':
        return this.renderToolbarActionsContextMenu(data);

      case 'filter-favorites':
        return this.renderFilterFavoritesContextMenu(data);

      case 'filter-settings':
        return this.renderFilterSettingsContextMenu(data);

      case 'table-settings':
        return this.renderTableSettingsContextMenu(data);

      case 'tag-settings':
        return this.renderTagsSettingsContextMenu(data);

      default:
        return data.type === 'left' ? this.renderRowSettingsContextMenu(data) : this.renderTableSettingsContextMenu(data);
    }
  }

  renderTemplateActionsContextSubmenu(data) {
    const {
      x,
      y,
      position,
      transform,
      template = {}
    } = data;
    let pos = `translateY(${transform !== undefined ? transform : 0}%)`;
    const temp = this.getFilterTemplateByKey(template.key, this.tempSettings?.filter || null);
    let isDeleted = (temp || template).deleted;
    const isDefaultTemplate = (temp || template).default === true;
    return (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
            <sf-menu-context
                    size=${this.size === "1/2" ? "1/2" : "1"}
                    :key=${`${template.key || ''}-${x}-${y}`}
                    aria-label=${this.getContextMenuLabel({ ...data,
      type: 'filter-template-actions'
    })}
                    style="
          position: fixed;
        left: calc(${x}px + var(--sf-context-menu-tail-corner-offset));
            inset-block-start: ${y}px;
          z-index: var(--sf-table-context-submenu--z-index, var(--sf-z-index-9));
          transform: ${pos}
        "
                    data-context-submenu
                    root-class="sf-table-context-submenu flex flex-col"
                    position="${position || "right"}"
                    .entries=${[// The standard menu's rows (owner, 2026-10-14), not link
    // buttons; a delete is marked as one, a restore is not.
    {
      id: 'rename',
      text: this.text('renameText'),
      icon: 'edit'
    }, {
      id: 'default',
      text: isDefaultTemplate ? this.text('defaultTemplateText') : this.text('makeDefaultLabel'),
      icon: isDefaultTemplate ? 'remove' : 'check'
    }, {
      id: 'delete',
      text: isDeleted ? this.text('restoreText') : this.text('deleteActionText'),
      icon: isDeleted ? 'restore_from_trash' : 'delete',
      danger: !isDeleted,
      keepOpen: true
    }]}
                    @sf-menu-context-select=${event => {
      const id = event.detail?.id;

      if (id === 'rename') {
        this.set(prevState => ({
          filter: { ...(prevState.filter || {}),
            rename: template.key
          },
          contextMenu: { ...(prevState.contextMenu || {}),
            submenu: null
          }
        }));
      } else if (id === 'default') {
        this.changeTempFilterTemplateSettings(template.key, {
          default: !template.default
        });
        this.closeContextSubmenu();
      } else if (id === 'delete') {
        this.patchTempFilterTemplateSettings(template.key, {
          deleted: !isDeleted
        });
      }
    }}
            >
            </sf-menu-context>
        `;
  }

  renderContextSubmenu(data) {
    switch (data?.type) {
      case 'filter-template-actions':
        return this.renderTemplateActionsContextSubmenu(data);

      default:
        return lit__WEBPACK_IMPORTED_MODULE_12__.nothing;
    }
  }

  renderContextMenu(data) {
    // A window is drawn into this element's portal, which the Loader reads
    // as the page (SF.Loader.watch in getPortalContainer); the window's
    // elements are asked for as it opens so they arrive with it.
    if (data?.open) {
      globalThis.SF?.Loader?.ensure?.(data.menu === 'tag-settings' ? ["sf-input-date", "sf-slider-range"] : ["sf-sortable", "sf-radio", "sf-tabs"]);
    }

    if (!data?.open) {
      (0,lit__WEBPACK_IMPORTED_MODULE_12__.render)(null, this.getPortalContainer());
      this.hidePortal();
      return lit__WEBPACK_IMPORTED_MODULE_12__.nothing;
    }

    (0,lit__WEBPACK_IMPORTED_MODULE_12__.render)((0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                <div
                        class="sf-table-context-layer"
                        data-sf-sheet=${this.isList && ["filter-settings", "tag-settings"].includes(data.menu) ? "" : lit__WEBPACK_IMPORTED_MODULE_12__.nothing}
                        ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_13__.ref)(this.refs.contextMenu)}
                        @click=${event => this.handleContextLayerClick(event)}
                >
                    ${this.renderMainContextMenu(data)}
                    ${data.submenu?.open ? this.renderContextSubmenu(data.submenu) : lit__WEBPACK_IMPORTED_MODULE_12__.nothing}
                    ${this.isList && ["filter-settings", "tag-settings"].includes(data.menu) ? (0,lit__WEBPACK_IMPORTED_MODULE_12__.html)`
                        <div class="sf-table-sheet-close">
                            <sf-button-icon size=${this.size} appearance="link" scheme="on-surface"
                                            icon="close" aria-label=${this.text('closeText')}
                                            @click=${() => this.closeContextMenu()}></sf-button-icon>
                        </div>` : lit__WEBPACK_IMPORTED_MODULE_12__.nothing}
                </div>
            `, this.getPortalContainer());
    this.showPortal();
    this.bindContextEvent();
    this.bindContextViewport();
    requestAnimationFrame(() => {
      this.clampContextMenusToViewport(); // The menu lives in the portal, not in this element's own tree.

      this.redrawWhenComponentsUpgrade(this.getPortalContainer());
    });
    return lit__WEBPACK_IMPORTED_MODULE_12__.nothing;
  }

  getActionItems() {
    return this.state.actions.map(action => {
      const data = {
        type: "checkbox",
        props: {
          size: this.size,
          label: action.name,
          position: 'end',
          rootClass: 'content-main-between',
          checked: action.visible,
          "@change": e => {
            let actionActive = false;
            let arr = this.tempSettings && this.tempSettings.actions ? this.tempSettings.actions : this.state.actions;
            const items = arr.map(item => {
              let visible = item.id === action.id ? e.target.checked : item.visible;

              if (visible) {
                actionActive = true;
              }

              return { ...item,
                visible: visible
              };
            });
            this.tempSettings = { ...(this.tempSettings || {}),
              actionActive,
              actions: items
            };
          }
        }
      };
      return this.renderSmartElement(data.type, data.props);
    });
  }

  hoverEvents(e) {
    if (this._columnResizeState || this.columnDragActive) {
      return;
    }

    const th = e.target.closest('th');

    if (!th) {
      return;
    }

    const wrap = th.querySelector('.sidebar-resizer');

    if (!wrap) {
      return;
    }

    th.classList.add('hover'); // The line belongs to the handle, not to the header. Shown on any
    // header hover it read as if the column were already being resized, and
    // it crossed the rows whenever the pointer merely passed over a title.

    if (this.getColumnResizeHandle(e.target)) {
      this.showColumnResizeGuide(th);
    } else {
      this.hideColumnResizeGuide();
    }
  }

  outEvent(e) {
    if (this._columnResizeState || this.columnDragActive) {
      return;
    }

    const th = e.target.closest('th');

    if (!th) {
      return;
    }

    const wrap = th.querySelector('.sidebar-resizer');

    if (!wrap) {
      return;
    }

    th.classList.remove('hover');
    this.hideColumnResizeGuide();
  }
  /**
   * The line that shows where a column edge will land runs through the rows
   * only, from the bottom of the head to the last row. A head cell cannot draw
   * it: a pseudo-element of a `th` has no way to reach into the body, and the
   * body's height is not known to CSS. So it is one element in the scroll
   * area, placed against the edge being dragged.
   */


  showColumnResizeGuide(th) {
    const guide = this.refs.resizeGuide?.value;
    const scroll = this.refs.scroll?.value;
    const table = this.refs.table?.value;

    if (!guide || !scroll || !th || !table) {
      return;
    }

    const head = table.querySelector('thead');
    const body = table.querySelector('tbody');

    if (!head || !body) {
      this.hideColumnResizeGuide();
      return;
    }

    const area = scroll.getBoundingClientRect();
    const cell = th.getBoundingClientRect();
    const headBox = head.getBoundingClientRect();
    const bodyBox = body.getBoundingClientRect();

    if (bodyBox.height <= 0) {
      this.hideColumnResizeGuide();
      return;
    } // The line continues the header's separator, so it is placed on that
    // separator rather than on the cell's outer edge: the separator is the
    // cell's own border, which occupies the last pixels inside the box.
    //
    // Nothing here is rounded. Rounding to whole pixels put the line beside
    // the separator whenever the cell's edge fell on a fraction -- which is
    // what a column width in rem or a root size of 87.5% produces, and what
    // the consumer measured as one pixel aside.


    const border = parseFloat(getComputedStyle(th).borderInlineEndWidth) || 0;
    const inlineStart = this.isRightToLeft() ? cell.left - area.left + scroll.scrollLeft : cell.right - area.left + scroll.scrollLeft - border;
    guide.style.insetInlineStart = `${inlineStart}px`;
    guide.style.insetBlockStart = `${headBox.bottom - area.top + scroll.scrollTop}px`;
    guide.style.blockSize = `${bodyBox.height}px`;
    guide.hidden = false;
  }

  hideColumnResizeGuide() {
    const guide = this.refs.resizeGuide?.value;

    if (guide) {
      guide.hidden = true;
    }
  }

  isRightToLeft() {
    return getComputedStyle(this).direction === 'rtl';
  }

  bindHoverEvent() {
    if (this._hoverEventBound) return;
    this._hoverEventBound = true;
    const table = this.refs.table?.value;
    table?.addEventListener('mouseover', this.hoverEvents);
    table?.addEventListener('mouseout', this.outEvent); //
    // this.addEventListener('mouseout', () => {
    //     this.querySelectorAll('.hover')
    //         .forEach(el => el.classList.remove('hover'));
    // });
  }

  unBindHoverEvent() {
    if (!this._hoverEventBound) {
      return;
    }

    const table = this.refs.table?.value;
    table?.removeEventListener('mouseover', this.hoverEvents);
    table?.removeEventListener('mouseout', this.outEvent);
    this._hoverEventBound = false;
  } // A column's edge is the Framework's resize gesture (SF.Resizer.attach,
  // owner 2026-10-14) -- the same drag, keys and double click as a panel's
  // edge: the table says what the width is the width of and keeps it in the
  // column settings, as it did.


  bindColumnResizeEvent() {
    const table = this.refs.table?.value;
    if (!table || this._columnResizeTable === table) return;
    const attach = globalThis.SF?.Resizer?.attach;

    if (typeof attach !== 'function') {
      globalThis.SF?.Loader?.ensure?.(['sf-resizer'], {
        timeout: Infinity
      }).then(({
        missing
      }) => {
        if (!missing.length && this.isConnected) this.bindColumnResizeEvent();
      });
      return;
    }

    this._columnResizeDetach?.();
    this._columnResizeTable = table;
    this._columnResizeDetach = attach(table, {
      handles: '.sf-table-column-resizer',
      session: handle => this.columnResizeSession(handle)
    });
  }

  unbindColumnResizeEvent() {
    this._columnResizeDetach?.();
    this._columnResizeDetach = null;
    this._columnResizeTable = null;
  }

  columnResizeSession(handle) {
    const th = handle?.closest?.('th');
    const key = th?.dataset?.key;
    const column = key ? this.getColumns().find(item => item?.key === key) : null;
    if (!th || !column || column.system || column.resizable === false) return null;
    const table = this.refs.table?.value;
    const col = table?.querySelector(`col[data-key="${this.escapeColumnKey(key)}"]`);
    const state = {
      key,
      th,
      col,
      frozenWidths: null,
      dragging: false
    };

    const clear = () => {
      this._columnResizeState = null;
      th.style.width = '';
    };

    return {
      measure: () => th.getBoundingClientRect().width,
      limits: () => {
        const {
          minWidth,
          maxWidth
        } = this.getColumnResizeLimits(column, th.getBoundingClientRect().width);
        return {
          min: minWidth,
          max: maxWidth
        };
      },
      direction: () => table && getComputedStyle(table).direction === 'rtl' ? -1 : 1,
      step: this.resolveCssLength(getComputedStyle(this).getPropertyValue('--sf-space-1'), 16),
      start: () => {
        state.dragging = true;
        this._columnResizeState = state;
        (0,_helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_16__.setLoaderDragState)(true);
        document.documentElement.classList.add('sf-table-column-resizing');
      },
      apply: width => {
        state.frozenWidths ??= this.freezeColumnsWidthForResize(table);
        this._columnResizeState = state;
        if (col) col.style.width = `${width}px`;
        th.style.width = `${width}px`; // The line is placed from the cell's own edge, so it moves in the
        // same frame the edge does.

        this.showColumnResizeGuide(th);
        return width;
      },
      commit: width => {
        const frozen = state.frozenWidths ?? {};
        clear();
        this.applyColumnResizeWidths(key, width, frozen);
      },
      end: () => {
        document.documentElement.classList.remove('sf-table-column-resizing');
        (0,_helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_16__.setLoaderDragState)(false);
        this.suppressNextHeaderClick(); // The drag is over before the line goes: hidden while the
        // state still said «resizing», it stayed on the edge.

        clear();
        this.hideColumnResizeGuide();
      },
      // Back to the width the column has by itself: its content's, or
      // the one the host declared.
      reset: () => {
        clear();
        this.resetColumnWidth(key);
      }
    };
  } // The browser's memory of the widths, for a table that asks for it with
  // remember-widths: no host keeps its settings, so a reload lost them.
  // The widths are part of the table's view preference (SF.Preferences):
  // under preferences-key, or with remember-widths under the table's own key.


  get rememberedWidthsKey() {
    if (this.viewPreferenceKey) return this.viewPreferenceKey;
    if (!this.hasAttribute("remember-widths")) return "";
    return tablePreferenceKey(this.getTableSettingsKey() || this.id || globalThis.location?.pathname || "table");
  }

  readRememberedWidths() {
    const key = this.rememberedWidthsKey;
    if (!key) return {};
    const widths = preferences()?.read(key)?.widths;
    return widths && typeof widths === "object" ? widths : {};
  }

  writeTablePreference(key, patch) {
    if (!key) return;
    preferences()?.write(key, { ...(preferences()?.read(key) ?? {}),
      v: 1,
      ...patch
    });
  }

  storeRememberedWidths(widths = {}) {
    this.writeTablePreference(this.rememberedWidthsKey, {
      widths: { ...this.readRememberedWidths(),
        ...widths
      }
    });
  }

  forgetRememberedWidth(column) {
    const widths = this.readRememberedWidths();
    delete widths[column];
    this.writeTablePreference(this.rememberedWidthsKey, {
      widths
    });
  } // How this person arranged this table -- order, visibility, pinning,
  // widths (owner, 2026-10-14): kept under preferences-key (or the table's
  // table-settings-key when the host names one), read before the first
  // paint so the skeleton is already in that order, and written each time
  // the person changes it.


  get viewPreferenceKey() {
    const key = this.getAttribute("preferences-key") || this.getAttribute("table-settings-key") || "";
    return key ? tablePreferenceKey(key) : "";
  }

  applyTablePreference(value, {
    render = false
  } = {}) {
    const kept = value?.columnSettings;
    if (!kept || typeof kept !== "object") return false; // On the host's columns, not on what is drawn: a value that no longer
    // names a column returns it to the host's settings. Merged onto the
    // drawn state, a dropped key kept its old width or visibility on this
    // device until a reload (docs trial 5).

    const host = this.getTableData().columnSettings;
    const base = host && typeof host === "object" && !Array.isArray(host) ? host : {};
    const next = this.mergeColumnSettings(base, kept);
    if (render) this.setColumnSettings(next, "preferences", false);else this.state.columnSettings = next;
    return true;
  }

  connectTablePreference() {
    const key = this.viewPreferenceKey;
    if (key === this._preferenceKeyBound) return;
    this._preferenceUnsubscribe?.();
    this._preferenceKeyBound = key;
    this._preferenceUnsubscribe = null;
    this.applyTableView();
    if (!key) return;
    this.applyTablePreference(preferences()?.read(key)); // The host's value, when it differs from this browser's, arrives later.

    const own = preferences()?.subscribe(key, value => {
      if (value) this.applyTablePreference(value, {
        render: true
      }); // SF.Preferences.remove() from page code: back to the columns as the
      // host gave them, drawn now (docs trial 4: the table kept the
      // removed arrangement until a reload).
      else {
        const host = this.getTableData().columnSettings;
        this.setColumnSettings(host && typeof host === "object" && !Array.isArray(host) ? { ...host
        } : {}, "preferences", false);
      }
      this.applyTableView();
    });
    const general = preferences()?.subscribe(GENERAL_TABLE_PREFERENCE, () => this.applyTableView());

    this._preferenceUnsubscribe = () => {
      own?.();
      general?.();
    };
  } // How the table looks for this person (the gear's «Вид», owner
  // 2026-10-14): density, alternate rows, lines between columns, text on
  // one line. Their tables' preference (sf-view-table/*) lies under this table's.


  get tableView() {
    const key = this.viewPreferenceKey;
    const general = preferences()?.read(GENERAL_TABLE_PREFERENCE)?.view ?? {};
    const own = key ? preferences()?.read(key)?.view ?? {} : this._sessionView ?? {};
    return { ...TABLE_VIEW_DEFAULTS,
      ...general,
      ...own
    };
  }

  applyTableView() {
    const view = this.tableView;

    const flag = (name, on) => on ? this.setAttribute(name, "") : this.removeAttribute(name);

    if (view.density === "normal") this.removeAttribute("data-sf-view-density");else this.setAttribute("data-sf-view-density", view.density);
    flag("data-sf-view-stripes", view.stripes === true);
    flag("data-sf-view-lines", view.lines === true);
    flag("data-sf-view-single-line", view.singleLine === true);
    const page = this.getAttribute("vertical-scroll") === "page" && !this.isList;
    flag("data-sf-page-scroll", page);
    flag("data-sf-sticky-head", page && view.stickyHead !== false);
  } // The head held under the toolbar while what scrolls -- the page, or a
  // box around the table -- scrolls past it (page mode): moved down by as
  // much as the table's top has gone above the line, never past its last
  // row. A sticky head cannot do it, because the area it sits in scrolls
  // sideways and so is a scroll container of its own.


  syncStickyHead() {
    const table = this.refs.table?.value;
    const head = table?.tHead;
    if (!head) return;
    const held = this.hasAttribute("data-sf-sticky-head");
    let delta = 0;

    if (held && table.isConnected) {
      const scroller = verticalScroller(this.refs.scroll?.value?.parentElement ?? this);
      const top = scroller ? scroller.getBoundingClientRect().top : 0;
      const toolbar = this.querySelector(":scope > .sf-table > .sf-table-toolbar");
      const line = Math.max(top, toolbar ? toolbar.getBoundingClientRect().bottom : top);
      const box = table.getBoundingClientRect();
      const room = box.height - head.offsetHeight;
      delta = Math.round(Math.min(Math.max(line - box.top, 0), Math.max(room, 0)));
    }

    head.style.transform = delta ? `translateY(${delta}px)` : "";
    this.toggleAttribute("data-sf-head-stuck", delta > 0);
  } // The rail under the area is its sideways bar: as wide as what the area
  // scrolls, shown only when there is something to scroll, and each follows
  // the other.


  syncRail() {
    const rail = this.refs.rail?.value;
    const scroll = this.refs.scroll?.value;
    if (!rail || !scroll) return;
    const wide = scroll.scrollWidth > scroll.clientWidth + 1;
    rail.hidden = !wide;
    const track = rail.firstElementChild;
    if (track) track.style.inlineSize = `${scroll.scrollWidth}px`;

    if (rail._sfBound !== scroll) {
      rail._sfBound = scroll;
      let following = false;

      const follow = (from, to) => () => {
        if (following) return;
        following = true;
        to.scrollLeft = from.scrollLeft;
        following = false;
      };

      scroll.addEventListener("scroll", follow(scroll, rail), {
        passive: true
      });
      rail.addEventListener("scroll", follow(rail, scroll), {
        passive: true
      }); // The columns take their widths after a render (content widths,
      // late fonts): the rail follows the table's size, not the render.

      this._railObserver?.disconnect();

      if (typeof ResizeObserver !== "undefined") {
        this._railObserver = new ResizeObserver(() => this.syncRail());

        this._railObserver.observe(scroll);

        if (this.refs.table?.value) this._railObserver.observe(this.refs.table.value);
      }
    }

    if (wide) rail.scrollLeft = scroll.scrollLeft;
  }

  bindPageScroll() {
    if (this._pageScrollAbort) return;
    this._pageScrollAbort = new AbortController();
    const {
      signal
    } = this._pageScrollAbort;

    const again = () => {
      if (this._pageScrollFrame) return;
      this._pageScrollFrame = requestAnimationFrame(() => {
        this._pageScrollFrame = 0;
        if (this.isConnected) this.syncStickyHead();
      });
    };

    document.addEventListener("scroll", again, {
      capture: true,
      passive: true,
      signal
    });
    globalThis.addEventListener("resize", () => {
      again();
      this.syncRail();
    }, {
      passive: true,
      signal
    });
  }

  unbindPageScroll() {
    this._railObserver?.disconnect();
    this._railObserver = null;
    const rail = this.refs.rail?.value;
    if (rail) rail._sfBound = null;
    this._pageScrollAbort?.abort();
    this._pageScrollAbort = null;
    cancelAnimationFrame(this._pageScrollFrame ?? 0);
    this._pageScrollFrame = 0;
  } // One option changed. «Для всех моих таблиц» writes it to the person's
  // tables and takes it off this one, so this one follows them.


  setTableView(patch = {}, {
    everywhere = false
  } = {}) {
    const key = this.viewPreferenceKey;

    if (everywhere || !key) {
      if (everywhere) {
        const general = preferences()?.read(GENERAL_TABLE_PREFERENCE) ?? {};
        preferences()?.write(GENERAL_TABLE_PREFERENCE, { ...general,
          v: 1,
          view: { ...(general.view ?? {}),
            ...patch
          }
        });
      }

      if (key) {
        const own = { ...(preferences()?.read(key)?.view ?? {})
        };

        for (const field of Object.keys(patch)) delete own[field];

        this.writeTablePreference(key, {
          view: own
        });
      } else if (!everywhere) {
        this._sessionView = { ...(this._sessionView ?? {}),
          ...patch
        };
      }
    } else {
      this.writeTablePreference(key, {
        view: { ...(preferences()?.read(key)?.view ?? {}),
          ...patch
        }
      });
    }

    this.applyTableView();
    this.requestComponentUpdate("table-view");
    this.emitTableEvent("view-change", Object.freeze({
      view: this.tableView,
      everywhere
    }));
    return this;
  }

  resetTableView() {
    const key = this.viewPreferenceKey;
    if (key) this.writeTablePreference(key, {
      view: {}
    });
    this._sessionView = null;
    this.applyTableView();
    this.requestComponentUpdate("table-view");
    return this;
  } // The remembered widths of the columns the table now has, as settings.


  restoreRememberedWidths() {
    const widths = this.readRememberedWidths();
    const keys = new Set((this.getColumns?.() ?? []).map(column => column?.key));
    const patch = Object.fromEntries(Object.entries(widths).filter(([column, width]) => keys.has(column) && typeof width === "string").map(([column, width]) => [column, {
      width
    }]));
    if (Object.keys(patch).length) this.patchColumnSettingsBatch(patch, "column-widths-restore");
  }

  resetColumnWidth(key) {
    if (!key) return this;
    this.forgetRememberedWidth(key);
    return this.patchColumnSettingsBatch({
      [key]: {
        width: null
      }
    }, 'column-resize-reset');
  } // A heading is dragged with the Framework's sortable in its column mode
  // (SF.Sortable.attach, owner 2026-10-13): the column is dimmed in every row,
  // an outline the width of the column and the height of the table stands
  // where it will go, a pinned column moves among pinned ones and a loose one
  // among loose ones, and the click a drop ends with does not sort. The
  // table's own drag -- nine hundred lines moving cells between lit's part
  // markers and putting them back -- is gone. Keyboard reordering is the
  // column settings list.


  get columnDragActive() {
    return document.documentElement.hasAttribute('data-sf-sortable-active');
  }

  bindColumnDragEvent() {
    const table = this.refs.table?.value;
    const row = table?.tHead?.rows?.[0];
    if (!row || this._headerSortableRow === row) return;
    const attach = globalThis.SF?.Sortable?.attach;

    if (typeof attach !== 'function') {
      // sf-sortable is a lazy relation: fetched when first needed.
      globalThis.SF?.Loader?.ensure?.(['sf-sortable'], {
        timeout: Infinity
      }).then(({
        missing
      }) => {
        if (!missing.length && this.isConnected) this.bindColumnDragEvent();
      });
      return;
    }

    this._headerSortableDetach?.();
    this._headerSortableRow = row;
    this._headerSortableDetach = attach(row, {
      items: 'th[data-key]',
      extent: table,
      // A column moving shows the line it will stand at, between two
      // columns (owner, 2026-10-14): the outline of the place it would
      // take read as a column already there.
      preview: 'line',
      label: this.text('settingsColumnLabel'),
      groupOf: th => this.headerColumnGroup(th.dataset.key),
      canStart: (event, th) => !this._columnResizeState && !this.getColumnResizeHandle(event.target) && ['pinned', 'loose'].includes(this.headerColumnGroup(th.dataset.key)),
      cellsOf: th => [...table.rows].map(tr => tr.cells[th.cellIndex]).filter(Boolean),
      onIntent: detail => this.onHeaderColumnIntent(detail)
    });
  }

  unbindColumnDragEvent() {
    this._headerSortableDetach?.();
    this._headerSortableDetach = null;
    this._headerSortableRow = null;
  } // Which group a heading moves in: the system columns and a column marked
  // draggable: false do not move; a pinned column moves among pinned ones.


  headerColumnGroup(key) {
    if (this.getSystemColumns().some(column => String(column.key) === key)) return 'system';
    const column = this.getColumns().find(item => String(item.key) === key);
    if (!column || column.system || column.draggable === false) return 'fixed';
    return this.isColumnPinned(column) ? 'pinned' : 'loose';
  } // The order a heading drop asks for: the column at its place among the
  // shown columns of its group, the others where they are.


  onHeaderColumnIntent({
    item,
    index,
    group
  }) {
    const table = this.refs.table?.value;
    const shown = [...(table?.tHead?.rows?.[0]?.cells ?? [])].map(cell => cell.dataset?.key).filter(key => key && ['pinned', 'loose', 'fixed'].includes(this.headerColumnGroup(key)));
    const peers = shown.filter(key => key !== item && this.headerColumnGroup(key) === group);
    const rest = shown.filter(key => key !== item);
    const before = peers[index];
    const after = peers[index - 1];
    const at = before !== undefined ? rest.indexOf(before) : after !== undefined ? rest.indexOf(after) + 1 : rest.length;
    rest.splice(at, 0, item);
    if (rest.join('|') === shown.join('|')) return this;
    return this.applyColumnOrder(rest, {});
  }

  getColumnResizeHandle(target) {
    if (!(target instanceof Element)) {
      return null;
    } // The handle is found by the attribute it carries, not by a prefix of its
    // id. The id is built from the instance, so it never began with
    // `column_resizer_`: pointerdown on the handle was not recognised as a
    // resize and fell through to the column-move handler, which is why
    // dragging the edge moved the column instead of changing its width.


    return target.closest('[data-sf-column-resizer]');
  }

  parseColumnSize(value, fallback = null) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim();

      if (/^-?\d+(\.\d+)?px$/.test(normalized)) {
        return parseFloat(normalized);
      }
    }

    return fallback;
  }

  resolveCssLength(value, fallback = 0) {
    const normalized = String(value || '').trim();
    const match = normalized.match(/^(-?\d+(?:\.\d+)?)(px|rem|em)$/);

    if (!match) {
      return fallback;
    }

    const amount = Number(match[1]);
    const unit = match[2];

    if (unit === 'px') {
      return amount;
    }

    const reference = unit === 'rem' ? document.documentElement : this;
    const fontSize = parseFloat(getComputedStyle(reference).fontSize);
    return Number.isFinite(fontSize) ? amount * fontSize : fallback;
  }

  getColumnResizeLimits(column = {}, fallbackWidth = 0) {
    const semanticMinWidth = this.resolveCssLength(getComputedStyle(this).getPropertyValue('--sf-c4'), fallbackWidth);
    const minWidth = this.parseColumnSize(column.minWidth, null) ?? semanticMinWidth;
    const maxWidth = this.parseColumnSize(column.maxWidth, Infinity);
    return {
      minWidth,
      maxWidth: Math.max(maxWidth, minWidth)
    };
  }

  hasColumnSize(column = {}) {
    return [column.colWidth, column.width, column.size].some(value => value !== null && typeof value !== 'undefined' && String(value).trim() !== '');
  }

  escapeColumnKey(key) {
    const value = String(key || '');

    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(value);
    }

    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  freezeColumnsWidthForResize(table) {
    const frozenWidths = {};
    const columns = this.getColumns();
    columns.forEach(column => {
      if (!column?.key) {
        return;
      }

      const key = String(column.key);
      const escapedKey = this.escapeColumnKey(key);
      const th = table?.querySelector(`th[data-key="${escapedKey}"]`);
      const col = table?.querySelector(`col[data-key="${escapedKey}"]`);
      const width = th?.getBoundingClientRect?.().width || 0;

      if (!width) {
        return;
      }

      const nextWidth = `${Math.round(width)}px`;

      if (col) {
        col.style.width = nextWidth;
      }

      if (!column.system && !this.hasColumnSize(column)) {
        frozenWidths[key] = nextWidth;
      }
    });
    return frozenWidths;
  }

  applyColumnResizeWidths(key, width, frozenWidths = {}) {
    if (!key) {
      return this;
    }

    const nextWidths = { ...(frozenWidths || {}),
      [key]: `${Math.round(width)}px`
    };
    this.storeRememberedWidths(nextWidths);
    const settingsPatch = Object.fromEntries(Object.entries(nextWidths).map(([columnKey, columnWidth]) => [columnKey, {
      width: columnWidth
    }]));
    return this.patchColumnSettingsBatch(settingsPatch, 'column-resize');
  }

  reorderColumnDomByKeys(table, userKeys = []) {
    if (!table || !Array.isArray(userKeys) || !userKeys.length) {
      return;
    }

    const moveKeyedChildren = (container, selector) => {
      if (!container) {
        return;
      }

      const userKeySet = new Set(userKeys);
      let insertAfter = null;

      for (const child of Array.from(container.children || [])) {
        const childKey = child?.dataset?.key;

        if (childKey && userKeySet.has(childKey)) {
          break;
        }

        if (childKey) {
          insertAfter = child;
        }
      }

      userKeys.forEach(key => {
        const escapedKey = this.escapeColumnKey(key);
        const child = container.querySelector(`${selector}[data-key="${escapedKey}"]`);

        if (child) {
          container.insertBefore(child, insertAfter?.nextSibling || container.firstChild);
          insertAfter = child;
        }
      });
    };

    moveKeyedChildren(table.querySelector('colgroup'), 'col');
    moveKeyedChildren(table.tHead?.rows?.[0], 'th');
    Array.from(table.tBodies || []).forEach(tbody => {
      Array.from(tbody.rows || []).forEach(row => {
        moveKeyedChildren(row, 'td');
      });
    });
  }

  applyColumnOrder(userKeys = [], frozenWidths = {}) {
    // Moving a column rearranges the columns the person can see, among the
    // places those columns already occupy. Numbering every draggable
    // column from ten upward instead renumbered the hidden ones too, and a
    // hidden column has no place on screen to be numbered from, so they
    // came out ahead of everything: a consumer dropped one column one place
    // to the left and found its nine visible columns pushed behind seven it
    // had never shown. Hidden columns keep their order, so they keep their
    // place between the visible ones when they are shown again.
    if (!Array.isArray(userKeys) || !userKeys.length) {
      return this;
    }

    const settingsPatch = {};
    const slots = this.getColumnOrderSlots(userKeys);
    userKeys.forEach((key, index) => {
      settingsPatch[key] = {
        order: slots[index]
      };

      if (frozenWidths?.[key]) {
        settingsPatch[key].width = frozenWidths[key];
      }
    });
    return this.patchColumnSettingsBatch(settingsPatch, 'column-drag');
  } // The places the moved columns already occupy, in order. A column whose
  // order nobody has ever set takes the place its position gives it, so a
  // first move on an untouched layout still numbers in tens.


  getColumnOrderSlots(userKeys = []) {
    const all = (this.getTableData().columns || []).filter(column => column?.key && !column.system);

    const effective = (column, index) => {
      const setting = this.getColumnSetting(column.key) || {};
      const value = setting.order ?? column.order;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : (index + 1) * 10;
    };

    const current = new Map(all.map((column, index) => [String(column.key), effective(column, index)]));
    const taken = userKeys.map(key => current.get(String(key))).filter(value => Number.isFinite(value)).sort((left, right) => left - right); // Two columns can share a place when a host sends the same order twice.
    // Then the places are rebuilt from the positions, which cannot collide.

    const distinct = new Set(taken);

    if (taken.length !== userKeys.length || distinct.size !== taken.length) {
      return userKeys.map((_, index) => (index + 1) * 10);
    }

    return taken;
  }

  setColumnResizeClasses(th, delta = 0) {
    if (!th) return;
    th.classList.add('is-resizing');
    th.classList.toggle('is-resizing-forward', delta >= 0);
    th.classList.toggle('is-resizing-backward', delta < 0); // The line follows the edge while it is dragged, not only on hover.

    this.showColumnResizeGuide(th); // Resizing a pinned column moves every pinned column after it.

    this.measurePinnedColumns();
  }

  clearColumnResizeClasses(th) {
    if (!th) return;
    th.classList.remove('is-resizing', 'is-resizing-forward', 'is-resizing-backward');
    this.hideColumnResizeGuide();
    this.measurePinnedColumns();
  }

  bindContextEvent() {
    if (this._contextEventBound) {
      return;
    }

    document.addEventListener("click", this.contextEvent);
    document.addEventListener("keydown", this.contextKeyEvent);
    this._contextEventBound = true;
  }

  unbindContextEvent() {
    if (!this._contextEventBound) {
      return;
    }

    document.removeEventListener("click", this.contextEvent);
    document.removeEventListener("keydown", this.contextKeyEvent);
    this._contextEventBound = false;
  }

  contextKeyEvent(event) {
    if (event.key !== 'Escape' || !this.state.contextMenu?.open) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.closeContextMenu(true);
  } // The table's windows -- filter, field popovers, settings, menus -- are
  // drawn in the page's top layer from inside the table, not moved to the end
  // of the body. Moved out, a window was not clipped by the table's scroll
  // box, but it lost everything the table gives what it holds: its size (the
  // filter opened a step larger than a table at 1/2), its language, its theme,
  // the variables its containers set (owner, 2026-10-13). In the top layer it
  // stays where it belongs and is still drawn above everything, unclipped.
  //
  // The container is a form of its own, before the table's rendered content:
  // inside a page's form a filter field would be submitted with it and Enter
  // in one would send the page's form; and before the content, so a re-render
  // of the table never takes it away. Its fields' own change and input stop
  // at it: they are the table's business, not the page's.


  getPortalContainer() {
    if (this._portalContainer?.isConnected) {
      return this._portalContainer;
    }

    const portal = document.createElement("form");
    portal.className = "sf-table-portal";
    portal.noValidate = true;
    portal.dataset.tableSettingsKey = this.getTableSettingsKey();
    portal.dataset.sfInstance = this.getInstanceId();
    if (typeof portal.showPopover === "function") portal.setAttribute("popover", "manual");
    portal.addEventListener("submit", event => event.preventDefault());

    for (const type of ["change", "input"]) {
      portal.addEventListener(type, event => event.stopPropagation());
    }

    this.insertBefore(portal, this.firstChild); // What the windows draw here is read by the Loader as the page is
    // (core.runtime 1.19.0): no lazy element is asked for by name.

    globalThis.SF?.Loader?.watch?.(portal);
    this._portalContainer = portal;
    return portal;
  } // The top layer is entered while a window is open and left when none is.


  showPortal() {
    const portal = this._portalContainer;
    if (!portal?.isConnected || typeof portal.showPopover !== "function") return;
    if (!portal.matches(":popover-open")) portal.showPopover();
  }

  hidePortal() {
    const portal = this._portalContainer;
    if (!portal?.isConnected || typeof portal.hidePopover !== "function") return;
    if (portal.matches(":popover-open")) portal.hidePopover();
  }

  getVisualViewportRect() {
    const viewport = window.visualViewport;
    return {
      left: viewport?.offsetLeft || 0,
      top: viewport?.offsetTop || 0,
      right: (viewport?.offsetLeft || 0) + (viewport?.width || window.innerWidth),
      bottom: (viewport?.offsetTop || 0) + (viewport?.height || window.innerHeight)
    };
  }

  clampContextMenusToViewport() {
    const portal = this._portalContainer;

    if (!portal?.isConnected) {
      return;
    }

    const viewport = this.getVisualViewportRect();
    const rootStyle = getComputedStyle(document.documentElement);
    const inset = parseFloat(rootStyle.getPropertyValue('--sf-space-1/3')) || 0;
    const anchored = new Set();
    portal.querySelectorAll('sf-menu-context').forEach(menu => {
      if (this.anchorContextMenu(menu, viewport, inset)) {
        anchored.add(menu);
        return;
      }

      const availableInlineSize = Math.max(0, viewport.right - viewport.left - inset * 2);
      const availableBlockSize = Math.max(0, viewport.bottom - viewport.top - inset * 2); // Both names: the stylesheet reads the second one, and only the
      // first was written here, so a menu placed by click coordinates
      // never received the cap this line means to give it.

      menu.style.setProperty('--sf-table-context-menu--available-inline-size', `${availableInlineSize}px`);
      menu.style.setProperty('--sf-context-menu-available-inline-size', `${availableInlineSize}px`);
      menu.style.setProperty('--sf-context-menu-available-block-size', `${availableBlockSize}px`);
      menu.style.translate = '';
      const surface = menu.querySelector(':scope > .sf-context-menu') || menu;
      const rect = surface.getBoundingClientRect();
      let offsetX = 0;
      let offsetY = 0;

      if (rect.left < viewport.left + inset) {
        offsetX = viewport.left + inset - rect.left;
      } else if (rect.right > viewport.right - inset) {
        offsetX = viewport.right - inset - rect.right;
      }

      if (rect.top < viewport.top + inset) {
        offsetY = viewport.top + inset - rect.top;
      } else if (rect.bottom > viewport.bottom - inset) {
        offsetY = viewport.bottom - inset - rect.bottom;
      }

      if (offsetX || offsetY) {
        menu.style.translate = `${offsetX}px ${offsetY}px`;
      }
    });

    for (const [menu, entry] of this._contextPositions || []) {
      if (!anchored.has(menu)) {
        entry.controller.stop();

        this._contextPositions.delete(menu);
      }
    }
  } // Placement of an open menu relative to the element it was opened from:
  // menus with a tail (row actions, template actions) open beside it, the
  // others below it. null keeps the static click-coordinate placement.
  // Cells re-render their controls, so an opener can be replaced while its
  // menu is open. Remember where it sits (row cell, header, toolbar id) to
  // find its replacement.


  describeContextAnchor(anchor) {
    if (!(anchor instanceof Element)) return null;
    const host = anchor.closest('[data-item], th[data-key], [id]');
    if (!host || !this.contains(host)) return null;
    const selector = host.dataset.item !== undefined ? `[data-item="${this.escapeColumnKey(host.dataset.item)}"]` : host.matches('th[data-key]') ? `th[data-key="${this.escapeColumnKey(host.dataset.key)}"]` : `[id="${this.escapeColumnKey(host.id)}"]`;
    const tag = anchor.tagName.toLowerCase();
    return {
      selector,
      tag,
      index: host === anchor ? -1 : Array.from(host.querySelectorAll(tag)).indexOf(anchor)
    };
  }

  resolveContextAnchor(data) {
    if (data?.anchor instanceof Element && data.anchor.isConnected) return data.anchor;
    const ref = data?.anchorRef;
    const host = ref ? this.querySelector(ref.selector) : null;
    const anchor = host && (ref.index < 0 ? host : host.querySelectorAll(ref.tag)[ref.index]);
    if (!anchor) return null;
    data.anchor = anchor;
    return anchor;
  } // Menus opened from a control at the end of a row align to that control's
  // end edge, so they open under the button instead of hanging past it over
  // the next column. The consumer measured a menu whose left edge matched the
  // button's left and whose right edge stood 34 to 124px beyond it.


  getContextMenuPlacement(menu) {
    const isSubmenu = menu.hasAttribute('data-context-submenu');
    const data = isSubmenu ? this.state.contextMenu?.submenu : this.state.contextMenu;
    const anchor = this.resolveContextAnchor(data);
    if (!anchor) return null;
    const position = String(data.position || (isSubmenu || data.type === 'left' ? 'left' : ''));
    const family = /^(left|right)(-top|-bottom)?$/.exec(position);

    if (!family) {
      // A menu belonging to a control at the end of its row aligns to that
      // control's end edge; otherwise it hangs past the button and over
      // whatever is beside it. The create arrow and the view's actions are
      // both such controls.
      const toTheEnd = ['create', 'toolbar-actions'].includes(data.menu);
      return {
        anchor,
        side: 'block-end',
        align: toTheEnd ? 'end' : 'start',
        tail: null
      };
    }

    const suffix = family[2] || '';
    return {
      anchor,
      side: family[1] === 'left' ? 'inline-end' : 'inline-start',
      align: suffix === '-top' ? 'start' : suffix === '-bottom' ? 'end' : 'center',
      tail: suffix
    };
  } // Shared Framework geometry (SF.Position): the menu flips when its side
  // does not fit, shifts inside the viewport and follows its opener while
  // the page scrolls. Sizes are written to the rendered surface, not the
  // boxless host, so they never re-render the menu over this placement.


  anchorContextMenu(menu, viewport, inset) {
    const placement = this.getContextMenuPlacement(menu);
    if (!placement) return false;
    const surface = menu.querySelector(':scope > .sf-context-menu');
    if (!surface) return false;
    this._contextPositions = this._contextPositions || new Map();

    const current = this._contextPositions.get(menu); // SF.Position writes an inline max-width from the free space, which
    // would override the menu's stylesheet cap; keep that cap in the width.


    const cssCap = current?.cssCap ?? (parseFloat(getComputedStyle(surface).maxWidth) || Infinity);
    const inlineSize = `${Math.max(0, Math.min(viewport.right - viewport.left - inset * 2, cssCap))}px`;
    surface.style.setProperty('--sf-table-context-menu--available-inline-size', inlineSize);
    surface.style.setProperty('--sf-context-menu-available-inline-size', inlineSize);
    const key = `${placement.side}|${placement.align}`;

    if (current && current.anchor === placement.anchor && current.surface === surface && current.key === key) {
      current.controller.update();
      return true;
    }

    current?.controller.stop();
    surface.style.transform = 'none';
    surface.style.translate = 'none';
    surface.style.setProperty('--sf-context-menu-available-block-size', `${Math.max(0, viewport.bottom - viewport.top - inset * 2)}px`);
    const Position = positioning();
    const gap = placement.tail === null ? Position.resolveLength('calc(var(--sf-focus-outline-width) * 2)', surface) : Position.resolveLength('var(--sf-context-menu-tail-corner-offset)', surface);
    const anchorBox = placement.anchor.getBoundingClientRect();
    const controller = Position.anchor(placement.anchor, surface, {
      side: placement.side,
      align: placement.align,
      offset: gap,
      alignmentOffset: placement.align === 'center' || placement.tail === null ? 0 : Math.max(0, anchorBox.height / 2 - gap),
      padding: inset,
      fitHeight: false,
      onPosition: ({
        side
      }) => {
        const box = placement.anchor.getBoundingClientRect();
        const view = this.getVisualViewportRect();
        const blockSize = side === 'block-end' ? view.bottom - inset - box.bottom - gap : side === 'block-start' ? box.top - gap - inset - view.top : view.bottom - view.top - inset * 2;
        const value = `${Math.max(0, Math.floor(blockSize))}px`;

        if (surface.style.getPropertyValue('--sf-context-menu-available-block-size') !== value) {
          surface.style.setProperty('--sf-context-menu-available-block-size', value);
        }

        if (placement.tail !== null) {
          const next = `${side === 'inline-end' ? 'left' : 'right'}${placement.tail}`;
          if (menu.getAttribute('position') !== next) menu.setAttribute('position', next);
        }
      }
    });

    this._contextPositions.set(menu, {
      controller,
      anchor: placement.anchor,
      surface,
      key,
      cssCap
    }); // The first placement is measured before the webfont has arrived, and
    // the cap written then is the cap of a narrower menu. The positioner
    // watches the box, but a font swap is cheap to wait for by name.


    document.fonts?.ready?.then(() => {
      if (this._contextPositions?.get(menu)?.controller === controller) controller.update();
    }).catch(() => {});
    return true;
  }

  stopContextMenuPositions() {
    for (const entry of this._contextPositions?.values() || []) entry.controller.stop();

    this._contextPositions?.clear();
  }

  contextViewportEvent() {
    requestAnimationFrame(() => this.clampContextMenusToViewport());
  }

  bindContextViewport() {
    if (this._contextViewportBound) {
      return;
    }

    window.addEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.addEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.addEventListener('scroll', this.contextViewportEvent);
    this._contextViewportBound = true;
  }

  unbindContextViewport() {
    if (!this._contextViewportBound) {
      return;
    }

    window.removeEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.removeEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.removeEventListener('scroll', this.contextViewportEvent);
    this._contextViewportBound = false;
  }

  openContextMenu(event, opts = {}) {
    this.closeContextMenu(false);
    this.contextTarget?.classList.remove("active");
    const target = event.currentTarget instanceof Element ? event.currentTarget : event.target instanceof Element ? event.target : null;

    if (!target) {
      return;
    } // Custom-element hosts use display:contents and have no positioning box.
    // Anchor to the native control on the event path within this opener.


    const nativeTarget = (event.composedPath?.() || []).filter(node => node instanceof Element).map(node => node.closest?.('button, input, select, textarea, a[href], [role="button"]')).find(node => node && (node === target || target.contains(node))); // Without a native control (for example a clicked sf-tag), anchor to the
    // first rendered box inside the opener instead of its boxless host.

    const hasBox = node => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0;
    };

    const boxedTarget = nativeTarget || hasBox(target) ? target : Array.from((target.shadowRoot || target).querySelectorAll?.('*') || []).find(hasBox) || target;
    this.contextTarget = nativeTarget || boxedTarget;
    this.contextTarget.classList.add("active"); // A chip opens its menu from the label button but anchors to the chip.

    let anchor = opts.anchorSelector && this.contextTarget.closest?.(opts.anchorSelector) || this.contextTarget;
    let pos = anchor.getBoundingClientRect();
    event.preventDefault();
    event.stopPropagation();
    let data = {
      open: true,
      id: this.contextTarget,
      ...opts
    };
    let tempData = {};

    switch (opts.type) {
      case 'left':
        tempData = {
          x: pos.left + pos.width,
          y: pos.y + pos.height / 2
        };
        break;

      case 'bottom':
        {
          let parent = null;

          if (opts.parent) {
            parent = (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_15__.getParent)(event.target);
            pos = parent.getBoundingClientRect();
            anchor = parent;
          }

          tempData = {
            x: pos.left,
            y: pos.y + pos.height
          };
          break;
        }

      default:
        tempData = {
          x: pos.left,
          y: pos.y + pos.height
        };
    }

    data = { ...data,
      ...tempData,
      anchor,
      anchorRef: this.describeContextAnchor(anchor)
    }; // What «Сбросить» returns to in the column settings window: the settings
    // as they stood when it was opened. Everything in that window applies on
    // the spot now, so without this there is nothing to go back to.

    if (data.menu === 'table-settings') {
      this._columnSettingsOnOpen = JSON.parse(JSON.stringify(this.getColumnSettings() || {}));
    }

    this.set({
      contextMenu: { ...data
      }
    });
  } // The element to anchor to: the native control the event passed through,
  // else the first box inside the opener, else the opener itself. A Framework
  // control's host element is display:contents and has no box of its own.


  resolveBoxedAnchor(event, target) {
    if (!(target instanceof Element)) return target;

    const hasBox = node => {
      const rect = node?.getBoundingClientRect?.();
      return Boolean(rect) && (rect.width > 0 || rect.height > 0);
    };

    const native = (event?.composedPath?.() || []).filter(node => node instanceof Element).map(node => node.closest?.('button, input, select, textarea, a[href], [role="button"]')).find(node => node && (node === target || target.contains(node)));
    if (native && hasBox(native)) return native;
    if (hasBox(target)) return target;
    const inside = Array.from((target.shadowRoot || target).querySelectorAll?.('*') || []).find(hasBox);
    return inside || target;
  } // A context menu renders Framework elements, and a page may open one before
  // their modules have arrived -- the consumer saw a template row with its
  // handle and its menu but no radio and no name, and the window's tabs
  // rendering as one list, because sf-radio and sf-tabs were not upgraded yet.
  // Nothing redrew when they were. This asks once per element and redraws when
  // it is defined; an element already defined costs nothing.


  redrawWhenComponentsUpgrade(root = this) {
    if (!root?.querySelectorAll) return this;
    this._awaitedComponents = this._awaitedComponents || new Set();
    const names = new Set(Array.from(root.querySelectorAll('*')).map(node => node.tagName.toLowerCase()).filter(name => name.includes('-') && !customElements.get(name)));

    for (const name of names) {
      if (this._awaitedComponents.has(name)) continue;

      this._awaitedComponents.add(name);

      customElements.whenDefined(name).then(() => {
        this.requestComponentUpdate('component-upgrade');
      }).catch(() => {});
    }

    return this;
  }

  openContextSubmenu(event, opts = {}) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target instanceof Element ? event.target : null;
    const anchorTarget = event.currentTarget instanceof Element ? event.currentTarget : target;

    if (!anchorTarget) {
      return;
    } // The opener is usually an sf-button-icon, whose host is display:contents
    // and has no box at all: anchoring to it put the menu at the top left of
    // the viewport, which the clamp then pushed to the window's edge -- the
    // consumer saw it open far from its button, over the admin menu. The
    // native control on the event path is the thing with a box.


    const boxed = this.resolveBoxedAnchor(event, anchorTarget);
    const rect = boxed.getBoundingClientRect();
    const anchorKey = opts.anchorKey || opts.template?.key || anchorTarget.dataset?.contextSubmenuAnchor || "";

    if (anchorKey && this.state.contextMenu?.submenu?.open && this.state.contextMenu.submenu.anchorKey === anchorKey) {
      this.closeContextSubmenu();
      return;
    }

    const data = {
      open: true,
      type: opts.type,
      anchorKey,
      x: rect.left + rect.width,
      y: rect.y + rect.height / 2,
      position: opts.position || 'left',
      transform: -50,
      ...opts,
      anchor: boxed,
      anchorRef: this.describeContextAnchor(boxed)
    };
    this.set(state => ({
      contextMenu: { ...(state.contextMenu || {}),
        submenu: data
      }
    }));
  }

  handleContextLayerClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest("[data-context-submenu]")) {
      return;
    }

    if (target.closest("[data-context-submenu-anchor]")) {
      return;
    }

    if (this.state.contextMenu?.submenu?.open && !target.closest("[data-context-main-menu]")) {
      this.closeContextSubmenu();
    }
  }

  closeContextSubmenu() {
    this.set(state => ({
      contextMenu: { ...(state.contextMenu || {}),
        submenu: null
      }
    }));
  } // Every element the table draws goes through here -- its own controls,
  // the row menus, the select boxes, a host's row actions -- and each was
  // written for the ladder's step 1. A table at another step draws them at
  // its own: a size of 1 becomes the table's. An element that names no size
  // keeps its own default -- a badge's is 1/3, a tag's 1/2 -- which a table at
  // a smaller step would otherwise have grown.
  // A value in a cell that is only shown -- a badge, a tag, an avatar -- is
  // drawn as its component's own markup, from a detached instance of the
  // component, instead of as an element of its own (owner, 2026-10-15: a
  // page of rows held four hundred elements, each rendering itself, and a
  // sort built them all). The classes, so the look, are the component's;
  // anything interactive, or a component not defined yet, stays an element.


  renderCellElement(type, props = {}) {
    const tag = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(`sf-${String(type ?? "").replace(/^sf-/u, "")}`);
    const shown = LIGHT_CELL_TAGS.has(tag) && props.interactive !== true && props.closable !== true && props.type !== "checkbox" && !Object.keys(props).some(key => key.startsWith("@") || /^on[A-Z]/u.test(key));
    const Element = shown ? customElements.get(tag) : null;
    if (!Element) return this.renderSmartElement(type, props);
    this._lightCells ??= new Map();

    let element = this._lightCells.get(tag);

    if (!element) {
      element = document.createElement(tag);

      this._lightCells.set(tag, element);
    }

    if (typeof element.template !== "function") return this.renderSmartElement(type, props);

    for (const name of [...element.getAttributeNames()]) element.removeAttribute(name);

    const size = this.size !== "1" && String(props.size) === "1" ? this.size : props.size;

    for (const [key, value] of Object.entries({ ...props,
      ...(size !== undefined ? {
        size
      } : {})
    })) {
      if (value === undefined || value === null || value === false) continue;
      const attribute = key.replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);
      if (typeof value === "object" || typeof value === "function") element[key] = value;else element.setAttribute(attribute, value === true ? "" : String(value));
    }

    try {
      return element.template();
    } catch {
      return this.renderSmartElement(type, props);
    }
  } // A component type names a Framework element: a former tag (a host's
  // {type: 'icon-button'}, a dated alias until 2027-01-01) draws the element
  // under its current tag.


  renderSmartElement(type, props = {}) {
    type = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(`sf-${String(type ?? "").replace(/^sf-/u, "")}`);
    const size = this.size;

    if (size !== "1" && props && String(props.size) === "1") {
      return super.renderSmartElement(type, { ...props,
        size
      });
    }

    return super.renderSmartElement(type, props);
  }

  get size() {
    return this.getEnumAttr("size", ["1/2", "1"], "1");
  }

  getSelectColumn() {
    return { ...this.TABLE_SELECT_COLUMN,
      component: { ...this.TABLE_SELECT_COLUMN.component,
        props: { ...(this.TABLE_SELECT_COLUMN.component?.props || {}),
          checked: Boolean(this.state?.settingsChecked),
          indeterminate: Boolean(this.state?.selectIndeterminate)
        }
      }
    };
  }

  getColumns() {
    const dataColumns = this.getTableData().columns || [];
    const systemColumns = this.getSystemColumns();
    const systemKeys = new Set(systemColumns.map(column => column.key));
    const rightSystemKeys = new Set(['actions']);
    const originalIndexByKey = new Map(dataColumns.map((column, index) => [column?.key, index]));
    const userColumns = dataColumns.filter(column => column?.key && !systemKeys.has(column.key)).map(column => {
      const settings = this.getColumnSetting(column.key);
      const nextColumn = { ...column,
        ...settings
      };

      if (settings.width) {
        nextColumn.colWidth = settings.width;
      }

      return nextColumn;
    }).sort((left, right) => {
      const getOrder = column => {
        const order = column?.order;
        return order !== null && typeof order !== "undefined" && order !== "" && Number.isFinite(Number(order)) ? Number(order) : originalIndexByKey.get(column?.key) ?? 0;
      };

      const leftOrder = getOrder(left);
      const rightOrder = getOrder(right);

      if (leftOrder === rightOrder) {
        return (originalIndexByKey.get(left.key) ?? 0) - (originalIndexByKey.get(right.key) ?? 0);
      }

      return leftOrder - rightOrder;
    });
    const leftSystemColumns = systemColumns.filter(column => !rightSystemKeys.has(column?.key));
    const rightSystemColumns = systemColumns.filter(column => rightSystemKeys.has(column?.key)); // Pinned columns stand right after the box and the row menu, each group
    // in its own order. The partition is stable, so pinning changes which
    // group a column is in and nothing else about where it sits.

    const pinnedUserColumns = userColumns.filter(column => this.isColumnPinned(column));
    const looseUserColumns = userColumns.filter(column => !this.isColumnPinned(column));
    const columns = [...leftSystemColumns, ...pinnedUserColumns, ...looseUserColumns, ...rightSystemColumns].filter(column => column?.visible !== false);
    const width = this._responsiveWidth || this.clientWidth || 0; // The list chooses its own fields by priority and wants every column to
    // choose from; dropping columns that do not fit is the table's answer.

    if (this.isList || !width || !userColumns.some(column => column.priority !== undefined)) return columns;

    const columnWidth = column => {
      const value = column.min_width ?? column.minWidth ?? column.width;
      const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
      return Number.isFinite(parsed) && parsed > 0 ? parsed : column.system ? 48 : 160;
    };

    const retained = new Set(columns);
    let needed = columns.reduce((sum, column) => sum + columnWidth(column), 0);
    const removable = userColumns.filter(column => column.visible !== false).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    for (const column of removable) {
      if (needed <= width || retained.size <= systemColumns.length + 1) break;
      retained.delete(column);
      needed -= columnWidth(column);
    }

    return columns.filter(column => retained.has(column));
  } // The columns that stay in place while the rows scroll sideways: the box,
  // the row menu, and the column the host marked as the record's title. The
  // host declares the title with `role: "title"` on the column rather than
  // the table guessing the first text column — a guess breaks on a page whose
  // first column is an icon or a flag, and the host already knows which
  // column leads the record.
  // Whether a column is pinned. The person decides, through the toggle in the
  // column settings, and the answer is stored beside the order and the width;
  // the column the host marked as the record's title starts pinned, because
  // that is the column a reader names a row by. The box and the row menu are
  // always pinned and are not offered a toggle.


  isColumnPinned(column) {
    if (!column?.key) return false;
    if (column.key === "select" || column.key === "settings") return true;
    if (column.system) return false;
    const pending = this.tempSettings?.cols?.[column.key];
    const setting = this.getColumnSetting(column.key) || {};
    const chosen = pending?.pinned ?? setting.pinned ?? column.pinned;
    if (typeof chosen === "boolean") return chosen;
    return column.role === "title";
  }

  getPinnedColumnKeys(columns = this.getColumns()) {
    return columns.filter(column => column?.key && this.isColumnPinned(column)).map(column => column.key);
  }

  isPinnedColumn(column) {
    if (!column?.key) return false;
    if (["start", "end"].includes(column.sticky)) return true;
    return this.isColumnPinned(column);
  } // A pinned cell's offset is read from the page, not from the declared
  // widths. The box and the row menu declare their widths as `calc()` over
  // tokens, which no arithmetic here can resolve, and a column the person has
  // resized no longer has the width its description names. The measured
  // offsets are published as custom properties, so the cells themselves only
  // ever name a property.


  getStickyCellStyle(columns, index) {
    const column = columns[index];
    const pinned = this.isPinnedColumn(column);
    if (!pinned) return "";
    const side = ["start", "end"].includes(column.sticky) ? column.sticky : "start"; // Only the placing is inline. The colour is a rule, because a pinned
    // cell has to carry the colour of the row it is in: painting it here
    // beat every row state and left the pinned columns white under a
    // selected or hovered row.

    return `position: sticky; inset-inline-${side}: var(--sf-table-pin-${column.key}, 0px); z-index: 2;`;
  }

  measurePinnedColumns() {
    const table = this.refs.table?.value;
    const scroll = this.refs.scroll?.value;
    if (!table) return this;
    const keys = this.getPinnedColumnKeys();
    const head = table.querySelector("thead tr"); // The widths read first, the offsets written after: written in turn,
    // each read laid the table out again (stand 25: a pinned column each
    // side, every scroll and every render). The offsets do not change the
    // widths. An offset that is already there is not written again.

    const widths = keys.map(key => {
      const cell = head?.querySelector(`th[data-key="${key}"]`);
      return cell ? cell.getBoundingClientRect().width : 0;
    });
    let offset = 0;
    keys.forEach((key, at) => {
      const value = `${Math.round(offset)}px`;
      if (table.style.getPropertyValue(`--sf-table-pin-${key}`) !== value) table.style.setProperty(`--sf-table-pin-${key}`, value);
      offset += widths[at];
    });
    const last = keys[keys.length - 1]; // Marked where it changes only: a mark taken off and put back on every
    // measure touched each pinned cell of every row (stand 25: a
    // revalidated list redrew rows nothing had changed in).

    const edge = new Set(last ? table.querySelectorAll(`[data-key="${last}"]`) : []);

    for (const cell of table.querySelectorAll("[data-sf-pin-edge]")) {
      if (!edge.has(cell)) cell.removeAttribute("data-sf-pin-edge");
    }

    for (const cell of edge) {
      if (!cell.hasAttribute("data-sf-pin-edge")) cell.setAttribute("data-sf-pin-edge", "");
    } // The shadow only means something once something is hidden behind the
    // pinned block, so it follows the scroll position. In a right-to-left
    // table the browser reports that position as a negative number.


    if (scroll) {
      const scrolled = Math.abs(scroll.scrollLeft) > 0;
      if (scrolled) scroll.setAttribute("data-sf-pin-scrolled", "");else scroll.removeAttribute("data-sf-pin-scrolled");
    }

    return this;
  }

  bindPinnedColumnScroll() {
    const scroll = this.refs.scroll?.value;
    if (!scroll || this._pinnedScrollBound === scroll) return this;
    this._pinnedScrollBound = scroll;
    scroll.addEventListener("scroll", () => this.measurePinnedColumns(), {
      passive: true
    });
    return this;
  } // A row's select box has no visible label: the row is the label. A reader
  // moving through the column hears each box by the row's first data cell,
  // instead of a run of unnamed checkboxes it cannot tell apart.


  getRowSelectLabel(row) {
    const batch = this._labelColumnBatch;
    const column = batch && "column" in batch ? batch.column : this.getColumnItems().find(item => item?.key && !item.system && item.key !== "select" && item.key !== "settings");
    if (batch) batch.column = column;
    const raw = column ? row?.[column.key] : undefined;
    const value = raw !== null && typeof raw === "object" ? raw.text ?? raw.label ?? raw.value ?? "" : raw;
    const text = String(value ?? "").trim() || String(row?.id ?? "").trim();
    return text ? `${this.text("selectRowLabel")}: ${text}` : this.text("selectRowLabel");
  }

  createRowComponentCell(component, props = {}) {
    if (!component?.type) {
      return null;
    }

    return {
      component: {
        type: component.type,
        props: { ...(component.props || {}),
          ...props
        }
      }
    };
  } // The row's menu is the Framework's standard menu (owner, 2026-10-12): it
  // opens below its button and start-aligned, in the top layer, and a group
  // of the host's row_actions is a real submenu rather than a second menu
  // swapped in over the first. What a choice does is unchanged -- an intent
  // for the row, or the action's own handler where it has one.


  async openRowMenu(event, row = {}) {
    const anchor = event?.currentTarget?.querySelector?.("button") ?? event?.target?.closest?.("button") ?? event?.currentTarget;
    if (!(anchor instanceof Element)) return null;
    const selection = Array.isArray(row.actions) && row.actions.every(item => typeof item === "string") ? row.actions : null;
    const items = this.getActionRowItems(row);

    const iconOf = action => action?.icon ?? action?.component?.props?.icon ?? undefined;

    const entries = items.map(action => Array.isArray(action.members) ? {
      id: action.id,
      text: action.name,
      icon: iconOf(action),
      submenu: action.members.filter(member => !selection || selection.includes(member.id)).map(member => ({
        id: member.id,
        text: member.name,
        icon: iconOf(member),
        danger: member.danger === true
      }))
    } : {
      id: action.id,
      text: action.name,
      icon: iconOf(action),
      danger: action.danger === true
    }); // The standard menu is a lazy relation of the table: fetched after the
    // page is ready, and asked for here if a press comes first.

    await globalThis.SF?.Loader?.ensure?.(["sf-menu-context"]);
    const menu = this.rowMenu();
    menu.setAttribute("aria-label", this.getContextMenuLabel({
      row,
      menu: "row-settings"
    }));
    menu.entries = entries;
    this._rowMenuContext = {
      row,
      items,
      anchor
    };
    return menu.toggleFor(anchor);
  }

  rowMenu() {
    if (this._rowMenu?.isConnected) return this._rowMenu;
    const menu = document.createElement("sf-menu-context");
    menu.setAttribute("popup", "");
    menu.dataset.sfTableMenu = "row";
    menu.addEventListener("sf-menu-context-select", event => {
      const context = this._rowMenuContext;
      if (!context) return;
      const id = event.detail?.id;
      const {
        row,
        items,
        anchor
      } = context;
      const action = items.find(item => item.id === id);
      const member = action ? null : items.flatMap(item => item.members ?? []).find(item => item.id === id);

      if (member) {
        this.requestActionIntent(member.id, [row.id]);
        return;
      }

      const handler = action?.component?.props?.["@click"] ?? action?.component?.props?.onClick;
      if (typeof handler === "function") handler({
        currentTarget: anchor,
        target: anchor,

        preventDefault() {},

        stopPropagation() {}

      });else if (action) this.requestActionIntent(action.id, [row.id]);
    });
    (this.closest("dialog[open]") || document.body).append(menu);
    this._rowMenu = menu;
    return menu;
  } // Which of the table's actions this row offers, and in what shape.
  //
  // `row.actions` is read twice over a row's life and means two things. From
  // a host it is ids -- `["view"]`, the data view port's word for which
  // actions apply to this record -- and that is what selects from the table's
  // own list. Once the cell is built it holds the built items, and the
  // template calls this again with them, so the filter was asking whether an
  // array of objects includes a string. It never does: every action was
  // filtered out and the «Действия» column drew an empty container in every
  // row of every list, page lists included. A consumer reported it on an
  // embedded one, which is only where they happened to be looking (owner,
  // 2026-10-09).
  //
  // Ids select. Anything else is already the selection and is not filtered
  // again.
  // The same items for the same row, so a render finds the elements it made
  // last time rather than new ones.
  //
  // A re-query brings new row objects for the same records, so a cache held
  // on the row produced new items every time and lit rebuilt every actions
  // cell -- which is exactly what tests/browser/table-round-3 exists to
  // refuse: it used to tear every cell out and build it again, and the
  // control a person was using went with them. The key is what the cell
  // actually depends on: the row, the ids it offers, and the list those ids
  // select from (owner, 2026-10-09).


  rowActionItems(row = {}) {
    const ids = Array.isArray(row?.actions) && row.actions.every(item => typeof item === "string") ? row.actions.join(",") : "*";
    const list = this.ACTIONS_SETTINGS_ROW ?? [];
    const listKey = list.map(action => action?.id ?? "").join(",");

    if (this._rowActionListKey !== listKey) {
      this._rowActionListKey = listKey;
      this._rowActionItems = new Map();
    }

    const key = `${row?.id ?? ""}|${ids}`;
    if (!this._rowActionItems) this._rowActionItems = new Map();

    if (!this._rowActionItems.has(key)) {
      this._rowActionItems.set(key, this.getActionRowItems(row));
    }

    return this._rowActionItems.get(key);
  }

  getActionRowItems(row = {}, actions = this.ACTIONS_SETTINGS_ROW) {
    const selection = Array.isArray(row.actions) && row.actions.every(item => typeof item === "string") ? row.actions : null; // A group (the host's row_actions, port 1.8.0) is offered when the
    // record allows any of its members, and opens a submenu of exactly
    // those: «Опубликовать › ru» on a row drafted in ru, not in en.

    const allowedMembers = action => (action.members || []).filter(member => !selection || selection.includes(member.id));

    return actions.filter(action => Array.isArray(action.members) ? allowedMembers(action).length > 0 : !selection || selection.includes(action.id)).map(action => {
      if (Array.isArray(action.members)) {
        const members = allowedMembers(action);
        const props = { ...(action.component?.props || {})
        };

        props["@click"] = event => this.openContextMenu(event, {
          type: "left",
          row,
          action,
          menu: "row-settings",
          items: members.map(member => ({
            component: "sf-button",
            props: {
              appearance: "link",
              scheme: member.danger ? "error" : "on-surface",
              text: member.name,
              "@click": () => {
                this.requestActionIntent(member.id, [row.id]);
                this.closeContextMenu();
              }
            }
          }))
        });

        return { ...action,
          component: { ...(action.component || {}),
            props
          }
        };
      }

      const component = action.component || {};
      const props = { ...(action.props || {}),
        ...(component.props || {})
      };
      const menu = action.menu || props.menu;
      const hasClickHandler = typeof props["@click"] === "function" || typeof props.onClick === "function";

      if (menu && !hasClickHandler) {
        props["@click"] = event => {
          const menuOptions = menu && typeof menu === "object" ? menu : {
            menu
          };
          this.openContextMenu(event, {
            type: "left",
            row,
            action,
            ...menuOptions
          });
        };
      } else if (!hasClickHandler) {
        props["@click"] = () => this.requestActionIntent(action.id, [row.id]);
      }

      return { ...action,
        component: { ...component,
          props
        }
      };
    });
  }

  getDefaultRowCell(column, row) {
    if (!column?.key) {
      return null;
    }

    if (column.key === "select") {
      return this.createRowComponentCell(column.rowComponent, {
        checked: this.state.settingsChecked ? true : Boolean(row?.selected || row?.checked),
        value: row?.id ?? row?.value ?? "",
        ariaLabel: this.getRowSelectLabel(row),
        "@change": event => {
          this.applyRowSelection(row.id, Boolean(event.target.checked), {
            range: this._selectRangeModifier === true
          });
        }
      });
    }

    if (column.key === "settings") {
      return this.createRowComponentCell(column.rowComponent || {
        type: "button-icon",
        props: {
          size: "1",
          appearance: "link",
          scheme: "on-surface",
          icon: "menu",
          ariaLabel: this.text("menuLabel"),
          value: "menu",
          "@click": e => this.openRowMenu(e, row)
        }
      });
    }

    if (column.key === 'actions') {
      return this.getActionRowItems(row);
    }

    return null;
  }

  normalizeRow(row = {}, systemColumns = this.getSystemColumns()) {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      return row;
    } // A row that already carries its system cells is kept as it is: a
    // change of one row copies that row alone, not the ten thousand others
    // (standard 1.3.8 §18.4, gate 17 «one entry changed»).


    if (systemColumns.every(column => !column?.key || column.visible === false || typeof row[column.key] !== "undefined")) {
      return row;
    }

    const nextRow = { ...row
    };
    systemColumns.forEach(column => {
      if (!column?.key || typeof nextRow[column.key] !== "undefined" || column.visible === false) {
        return;
      }

      const cell = this.getDefaultRowCell(column, nextRow);

      if (cell) {
        nextRow[column.key] = cell;
      }
    });
    return nextRow;
  } // The system columns and the column a box is named by are read once for
  // the whole list, not once per row: ten thousand rows asked for them ten
  // thousand times (simai/ui-pro#2).


  normalizeRows(rows = []) {
    if (!Array.isArray(rows)) return [];
    const systemColumns = this.getSystemColumns();
    this._labelColumnBatch = {};

    try {
      return rows.map(row => this.normalizeRow(row, systemColumns));
    } finally {
      this._labelColumnBatch = null;
    }
  }

  setTableData(patch = {}, reason = "data") {
    const currentData = this.getTableData();
    const nextPatch = typeof patch === "function" ? patch(currentData) : patch;

    if (!nextPatch || typeof nextPatch !== "object") {
      return this;
    }

    const result = this.set({
      data: { ...currentData,
        ...nextPatch
      }
    }, reason);
    this.syncSelectionPort(); // New rows are new selection: a tree that redrew its rows after a bulk
    // write left the page box half-ticked over rows none of which were.

    if (Object.prototype.hasOwnProperty.call(nextPatch, "rows")) this.syncSelectAllState();
    return result;
  }

  setColumns(columns = [], reason = "columns") {
    const currentColumns = this.getTableData().columns || [];
    const nextColumns = typeof columns === "function" ? columns(currentColumns) : columns;
    const result = this.setTableData({
      columns: Array.isArray(nextColumns) ? nextColumns : []
    }, reason);
    if (this.rememberedWidthsKey) this.restoreRememberedWidths();
    return result;
  }

  addColumns(columns = []) {
    const nextColumns = Array.isArray(columns) ? columns : [columns];
    return this.setColumns(currentColumns => [...currentColumns, ...nextColumns.filter(Boolean)]);
  }

  updateColumn(columnKey, patch = {}, reason = "columns") {
    if (!columnKey) {
      return this;
    }

    return this.setColumns(columns => columns.map((column, index) => {
      if (!column || column.key !== columnKey) {
        return column;
      }

      const nextPatch = typeof patch === "function" ? patch(column, index) : patch;
      return { ...column,
        ...(nextPatch || {})
      };
    }), reason);
  } // Which drawing of the rows is on screen: a new result set whose kept rows
  // would move is drawn as new rows (setRows "result"), so the template keys
  // rows by this and their id.


  rowsGeneration() {
    return this._rowsGeneration ?? 0;
  }

  setRows(rows = [], reason = "rows") {
    const currentRows = this.getTableData().rows || [];
    const nextRows = typeof rows === "function" ? rows(currentRows) : rows; // A new result set (a search, a filter, another page: reason
    // "result") is drawn as new rows when a row it keeps would stand
    // elsewhere. Keyed by id alone, the kept rows were moved to their new
    // places, and the browser counted every one as a layout shift (stand
    // 25 D12: CLS 0.17 per search); new rows are drawn, not shifted. The
    // swap is one render, so the old rows go and the new come in one frame.

    if (reason === "result" && Array.isArray(nextRows) && rowsWouldMove(currentRows, nextRows)) {
      this._rowsGeneration = (this._rowsGeneration ?? 0) + 1;
    }

    return this.setTableData({
      rows: this.normalizeRows(nextRows)
    }, reason);
  }

  addRows(rows = [], reason = "rows") {
    if (this.isActionParameters?.(rows, ["rows"])) rows = rows.rows ?? [];
    const nextRows = Array.isArray(rows) ? rows : [rows];
    this.setRows(currentRows => [...currentRows, ...nextRows.filter(Boolean)], reason);
    return {
      outcome: "applied"
    };
  }

  updateRowsByKey(key, value, patch = {}, reason = "rows") {
    if (!key) {
      return this;
    }

    const patchRow = typeof patch === "function" ? patch : row => ({ ...row,
      ...(patch || {})
    });
    return this.setRows(rows => rows.map((row, index) => {
      if (!row || row[key] !== value) {
        return row;
      }

      const nextRow = patchRow(row, index);
      return nextRow && typeof nextRow === "object" ? nextRow : row;
    }), reason);
  } // One entry changed: that row is drawn again in place, and the widths
  // measured from the content are kept (standard 1.3.8 §18.4, gate 17 «one
  // entry changed ≤ 50 ms whatever the count»).


  updateRowByKey(key, value, patch = {}, reason = "row") {
    this._entryOnly = true;
    return this.updateRowsByKey(key, value, patch, reason);
  }

  updateRows(patch = {}, reason = "rows") {
    const patchRow = typeof patch === "function" ? patch : row => ({ ...row,
      ...(patch || {})
    });
    return this.setRows(rows => rows.map((row, index) => {
      const nextRow = patchRow(row, index);
      return nextRow && typeof nextRow === "object" ? nextRow : row;
    }), reason);
  }

  updateRowCell(rowKey, rowValue, cellKey, patch = {}, reason = "cell") {
    if (!cellKey) {
      return this;
    }

    return this.updateRowsByKey(rowKey, rowValue, row => {
      const currentCell = row && row[cellKey] && typeof row[cellKey] === "object" ? row[cellKey] : {};
      const nextCellPatch = typeof patch === "function" ? patch(currentCell, row) : patch;
      return { ...row,
        [cellKey]: { ...currentCell,
          ...(nextCellPatch || {})
        }
      };
    }, reason);
  }

  updateRowCellProps(rowKey, rowValue, cellKey, props = {}, reason = "cell-props") {
    return this.updateRowCell(rowKey, rowValue, cellKey, cell => ({
      component: { ...(cell.component || {}),
        props: { ...(cell.component?.props || {}),
          ...(typeof props === "function" ? props(cell.component?.props || {}, cell) : props || {})
        }
      }
    }), reason);
  }

  closeContextMenu(restoreFocus = true) {
    const trigger = this.contextTarget;
    this.set({
      contextMenu: {
        open: false
      }
    });
    this.stopContextMenuPositions();
    (0,lit__WEBPACK_IMPORTED_MODULE_12__.render)(null, this.getPortalContainer());
    this.hidePortal();

    if (this.refs.contextMenu) {
      this.refs.contextMenu.value = null;
    }

    this.unbindContextEvent();
    this.unbindContextViewport();
    this.contextTarget?.classList.remove("active");
    this.contextTarget = null;

    if (restoreFocus && trigger?.isConnected && typeof trigger.focus === 'function') {
      requestAnimationFrame(() => trigger.focus());
    }
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  } // The vocabulary's data state is `ready`; `populated` is read as its
  // alias (standard 1.3.8 gate 26), and the template keeps drawing it.


  get dataState() {
    const state = this.getEnumAttr('data-state', ['loading', 'ready', 'populated', 'empty', 'error'], 'auto');
    return state === 'ready' ? 'populated' : state;
  }

  setDataState(state = 'auto') {
    const named = state === 'ready' ? 'populated' : state;
    const normalized = ['loading', 'populated', 'empty', 'error'].includes(named) ? named : 'auto';

    if (normalized === 'auto') {
      this.removeAttribute('data-state');
    } else {
      this.setAttribute('data-state', normalized);
    }

    return this;
  }

  requestRetry() {
    this.emitTableEvent('refresh', {});
    return {
      outcome: "applied"
    };
  } // Why there are no rows, as a data view knows it: {kind: 'no-access' |
  // 'nothing-found' | 'no-data', reset: 'search' | 'filters' | 'both',
  // headingLevel, message}. `message` is the host's own sentence for a list
  // it refused or could not give; it is the brick's title, drawn as text. A table on its own knows only no data and could not load.


  get emptyContext() {
    return this._emptyContext;
  }

  set emptyContext(value) {
    this._emptyContext = value && typeof value === "object" ? { ...value
    } : null;
    this.requestComponentUpdate("empty-context");
  } // What «Сбросить поиск и фильтры» does: the table's own search and filter
  // are emptied, and each says so the way a person's edit would.


  resetQuery(scope = "both") {
    if (scope !== "search") this.removeFilterTag();

    if (scope !== "filters") {
      this.clearSearchDebounce();
      this._searchPendingProps = null; // A search the table did not hold (the view's own, or a host's) is
      // still cleared: the event goes either way.

      if (this.state.search?.value) this.updateSearchState({
        value: ""
      });else this.emitTableEvent("search-change", {
        search: ""
      });
    }

    return this;
  } // The brick for a table without rows: its reason, its words and its one
  // action. The host's empty-text and error-text are the titles they always
  // were, and empty-description the line under an empty list's title; the
  // rest are the brick's own words in the page language.


  emptyBrick(dataState) {
    const context = this._emptyContext ?? {};
    const size = this.size === "1/2" ? "1/2" : "1";
    const headingLevel = String(context.headingLevel ?? 3);
    const message = typeof context.message === "string" ? context.message.trim() : "";

    if (dataState === "error") {
      return {
        kind: "error",
        size,
        headingLevel,
        title: message || this.getAttribute("error-text") || "",
        text: "",
        live: context.caused ? "alert" : "auto",
        actions: [{
          id: "retry",
          text: this.text("retryText", "retry-text"),
          appearance: "outline"
        }]
      };
    }

    const kind = ["no-access", "nothing-found"].includes(context.kind) ? context.kind : "no-data";
    if (kind === "no-access") return {
      kind,
      size,
      headingLevel,
      title: message,
      text: "",
      actions: []
    };

    if (kind === "nothing-found") {
      const key = {
        search: "resetSearchText",
        filters: "resetFiltersText"
      }[context.reset] ?? "resetBothText";
      return {
        kind,
        size,
        headingLevel,
        title: "",
        text: "",
        actions: [{
          id: "reset-query",
          text: this.text(key),
          appearance: "outline"
        }]
      };
    }

    const creatable = this.getBooleanAttr("actions", true) && this.getBooleanAttr("creatable", true);
    return {
      kind,
      size,
      headingLevel,
      title: this.getAttribute("empty-text") || "",
      text: this.getAttribute("empty-description") || "",
      actions: creatable ? [{
        id: "create",
        text: this.text("createText", "create-text")
      }] : []
    };
  }

  disconnectedCallback() {
    this.unbindWindowScroll(); // The row menu lives beside the page, not inside the table: it goes
    // with the table that made it.

    this._rowMenu?.close?.({
      restoreFocus: false
    });
    this._rowMenu?.remove();
    this._rowMenu = null;

    for (const page of this._filterOptionPages.values()) {
      page.controller?.abort();
      clearTimeout(page.searchTimer);
    }

    this._filterOptionPages.clear();

    this._responsiveObserver?.disconnect();
    this._responsiveObserver = null;
    this._responsiveWidth = 0;
    this._responsiveTarget = null;
    this._preferenceUnsubscribe?.();
    this._preferenceUnsubscribe = null;
    this._preferenceKeyBound = undefined;
    this._rowActionsAbort?.abort();
    this._rowActionsAbort = null;
    this._rowActionsTable = null;
    this.unbindPageScroll();
    this._lateLayoutAbort?.abort();
    this._lateLayoutAbort = null;
    cancelAnimationFrame(this._lateLayoutFrame ?? 0);
    this._lateLayoutFrame = 0;
    this.clearSearchDebounce();
    this._searchPendingProps = null;
    this._searchHoldKey = '';
    this.stopContextMenuPositions();
    this.unbindContextEvent();
    this.unbindContextViewport();
    this.unBindHoverEvent();
    this.unbindColumnResizeEvent();
    this.unbindColumnDragEvent();
    this.tempSettings = null;
    this._selectionPortKey = "[]"; // A removed table abandons its pending answer; a remount asks again.

    this._abandonedQuery = this._pendingQuerySequence !== null;
    this._pendingQuerySequence = null;
    this.state.contextMenu = {
      open: false
    };
    this.state.settingsChecked = false;
    this.state.selectIndeterminate = false;
    const data = this.getTableData();
    this.state.data = { ...data,
      rows: data.rows.map(row => ({ ...row,
        selected: false,
        checked: false,
        ...(row.select?.component ? {
          select: { ...row.select,
            component: { ...row.select.component,
              props: { ...row.select.component.props,
                checked: false
              }
            }
          }
        } : {})
      }))
    };

    if (this.refs.contextMenu) {
      this.refs.contextMenu.value = null;
    }

    this.contextTarget?.classList?.remove('active');
    this.contextTarget = null;

    if (this._portalContainer) {
      (0,lit__WEBPACK_IMPORTED_MODULE_12__.render)(null, this._portalContainer);

      this._portalContainer.remove();

      this._portalContainer = null;
    }

    super.disconnectedCallback();
  }
  /**
   * One of this table's words, in the page's language. An attribute wins over
   * both languages, because a consumer who names a word has named it.
   *
   * The declared default is the English one, so a component read through its
   * props alone still says something sensible; the context below overrides
   * every text key with this, which is what makes the Russian reachable. A
   * key left out of that override would quietly fall back to English on a
   * Russian page -- which is exactly how three labels in the record panel's
   * head came to read «Close» beside «В избранное».
   */


  text(key, attribute) {
    return attribute && this.getAttribute(attribute) || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_14__.pageText)(TABLE_TEXT, key, this);
  }

  templateContext() {
    this._renderedCramped = this.columnsAreCramped;
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      list: this.isList,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle(),
      filterText: this.text("filterText", "filter-text"),
      clearText: this.text("clearText", "clear-text"),
      searchPlaceholder: this.text("searchPlaceholder", "search-placeholder"),
      createText: this.text("createText", "create-text"),
      pinColumnLabel: this.text("pinColumnLabel", "pin-column-label"),
      unpinColumnLabel: this.text("unpinColumnLabel", "unpin-column-label"),
      loadingText: this.text("loadingText", "loading-text"),
      emptyText: this.text("emptyText", "empty-text"),
      errorText: this.text("errorText", "error-text"),
      retryText: this.text("retryText", "retry-text"),
      columnMoveLabel: this.text("columnMoveLabel", "column-move-label"),
      filterApplyText: this.text("filterApplyText", "filter-apply-text"),
      columnSearchPlaceholder: this.text("columnSearchPlaceholder", "column-search-placeholder"),
      columnSearchEmptyText: this.text("columnSearchEmptyText", "column-search-empty-text")
    });
  }

  setCheckboxHeight() {
    if (!this.refs.items.size) return;
    const measureToken = ++this._checkboxMeasureToken;
    requestAnimationFrame(() => {
      if (!this.isConnected || measureToken !== this._checkboxMeasureToken) {
        return;
      }

      const parentSpace = (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_15__.setParentSpace)(this.refs.items);

      if (!parentSpace) {
        return;
      }

      const {
        item,
        gap,
        parent
      } = parentSpace;
      this.parentGap = gap;
      const itemHeight = item.tagName.toLowerCase().startsWith('sf-') ? item.children[0]?.clientHeight : item.clientHeight;

      if (!itemHeight) {
        return;
      }

      const itemSize = parent.dataset.size || 8;
      const parentHeight = (itemHeight + gap) * itemSize;

      if (parent.clientHeight <= parentHeight) {
        return false;
      }

      parent.setAttribute('style', `height: ${parentHeight}px; overflow: auto;`);
    });
  }

  beforeRender() {
    super.beforeRender();
    this.connectTablePreference();
    this.applyTableView();
    this._checkboxMeasureToken++;
    this.refs.items = new Map();
  } // SfBaseElement is display: contents, so its own box has no width: the
  // nearest visible container is observed instead of the custom tag. The
  // box is chosen again once the one observed has left the document: a
  // table printed by a server (its static markup) is replaced by the drawn
  // one, and the width of a box no longer in the page never changes -- a
  // list on a phone stayed a table, its width read as nothing (stand 24).


  _observeResponsiveBox() {
    if (!this._responsiveObserver || this._responsiveTarget?.isConnected) return;
    const candidates = [this.querySelector('.sf-table'), this.parentElement, this.getRootNode()?.host];
    const target = candidates.find(element => element?.getBoundingClientRect?.().width > 0) ?? candidates.find(Boolean) ?? this;
    if (this._responsiveTarget) this._responsiveObserver.unobserve(this._responsiveTarget);
    this._responsiveTarget = target;

    this._responsiveObserver.observe(target);
  }

  afterRender() {
    this._observeResponsiveBox();

    this.bindRowActionsEvents(this.refs.table?.value);
    if (this._windowed) this.bindWindowScroll(); // A row the keyboard asked for outside the drawn range is drawn now:
    // it is focused and scrolled into view, and the scroll that brings
    // moves the range around it -- not the place the page was at before.

    if (this._pendingFocusRow) {
      const id = this._pendingFocusRow;
      this._pendingFocusRow = null;
      this._windowOnly = false;
      this._entryOnly = false;
      this.focusRow(id, {
        reveal: true
      });
      return;
    } // A render that only moved the window, or changed one entry, draws
    // rows of the same columns: their values are folded, no width is
    // measured again.


    if (this._windowOnly || this._entryOnly) {
      this._windowOnly = false;
      this._entryOnly = false;
      this._layoutUnchanged = false;
      this.fitCellValues();
      this.measurePinnedColumns();
      this.syncWindow();
      return;
    } // A render that only moved a row's buttons changed no width.


    if (this._layoutUnchanged) {
      this._layoutUnchanged = false;
      return;
    } // Content widths first: they change the widths everything below reads.
    // Written straight onto the columns: a render for them drew every row
    // and every value in it again (owner, 2026-10-15).
    // Cells whose elements are defined but still drawing (a reference, a
    // colour, a file) are measured once, when they have drawn -- in this
    // task, before the frame is painted. They used to be measured now and
    // again then, and the first reading was thrown away: two layouts of
    // the whole table in auto and fixed form, and the values folded twice
    // (stand 25: 300 ms of the first page's 1.2 s at 4x CPU).


    if (!this.measureWhenCellsDrawn()) {
      if (this.measureContentWidths()) this.applyColumnWidths();
      this._contentRetries = 0;
      this.fitCellValues();
      this.measurePinnedColumns();
    }

    if (this.hasAttribute("data-sf-page-scroll")) {
      this.bindPageScroll();
      this.syncRail();
      this.syncStickyHead();
    } else {
      this.unbindPageScroll();
      const head = this.refs.table?.value?.tHead;
      if (head?.style.transform) head.style.transform = "";
    } // Whether the columns are cramped is read from the laid-out table, so
    // the first render guesses: before layout the actions column and the
    // floors are not yet where they will be. When the answer after the
    // render is not the one the render used, render once more.
    // Twice at most in a row, so a width that sits on the edge cannot keep
    // the table re-rendering.


    if (this.columnsAreCramped !== this._renderedCramped && (this._crampedRetries ?? 0) < 2) {
      this._crampedRetries = (this._crampedRetries ?? 0) + 1;
      this.requestComponentUpdate("cramped-columns");
    } else {
      this._crampedRetries = 0;
    }

    this.bindPinnedColumnScroll();
    this.setCheckboxHeight();
    this.bindHoverEvent();
    this.bindColumnResizeEvent();
    this.bindColumnDragEvent();
    this.syncWindow();
  }

  template() {
    // Building the template writes nothing to the page: what it reads of
    // the layout (the cap, whether the columns are cramped) is read once.
    return this.readingLayout(() => (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_7__.renderTableTemplate)(this.templateContext()));
  }

}

(0,_js_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__.settingSetters)(SfTable, _component_json__WEBPACK_IMPORTED_MODULE_3__);
SfTable.define("sf-view-table");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2f31b00ad99a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DATE_TYPES: () => (/* binding */ DATE_TYPES),
/* harmony export */   formatDateValue: () => (/* binding */ formatDateValue)
/* harmony export */ });
/* harmony import */ var _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e577837dd70a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
 // A date, a date and time or a time of day in the page's language, through
// the SIMAI Framework's format-date module, for a value the host did not
// format (formatFieldValue). The host's own text still wins; without one, a
// date read «2026-11-02» where a person expects «2 нояб. 2026 г.».
//
// The forms are read as a host stores them: a day «YYYY-MM-DD» is that day on
// the reader's calendar (not UTC midnight, which is the day before west of
// Greenwich); a date and time with a zone is that moment in the reader's zone
// and one without a zone is the wall clock as written; a time «hh:mm[:ss]» is
// a time of day. Anything else is left for the caller to print as it came.

const DAY = /^(\d{4})-(\d{2})-(\d{2})$/u;
const TIME = /^(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/u;
const DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/u;
const DATE_TYPES = new Set(['date', 'datetime', 'time']);

function readMoment(type, text) {
  const day = DAY.exec(text);
  if (day) return new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3]));
  const time = TIME.exec(text);
  if (time) return type === 'time' ? new Date(2000, 0, 1, Number(time[1]), Number(time[2]), Number(time[3] ?? 0)) : null;
  const stamp = DATE_TIME.exec(text);
  if (!stamp) return null;

  if (stamp[7]) {
    const moment = new Date(text.replace(' ', 'T'));
    return Number.isNaN(moment.getTime()) ? null : moment;
  }

  return new Date(Number(stamp[1]), Number(stamp[2]) - 1, Number(stamp[3]), Number(stamp[4]), Number(stamp[5]), Number(stamp[6] ?? 0));
} // The text for a value of a date type, or '' when it is not one this reads.


function formatDateValue(type, value, node) {
  if (!DATE_TYPES.has(type) || typeof value !== 'string' || !value.trim()) return '';
  const text = value.trim();
  const moment = readMoment(type, text);
  if (!moment) return '';
  const hasTime = type !== 'date' && !DAY.test(text);
  if (type === 'time') return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_0__.formatDate)(moment, {
    date: null,
    time: 'short',
    node
  });
  return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_0__.formatDate)(moment, {
    date: 'medium',
    time: hasTime ? 'short' : null,
    node
  });
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "17828be41e75"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   answerActions: () => (/* binding */ answerActions),
/* harmony export */   outcomeOf: () => (/* binding */ outcomeOf),
/* harmony export */   settingSetters: () => (/* binding */ settingSetters)
/* harmony export */ });
// The actions a manifest declares, on a class that already has the methods
// (standard simai.smart-component 1.3.8 §4.4). elementFromManifest makes a
// method per action, but a component whose class predates its manifest keeps
// its own methods, which shadow the generated ones. This wraps those methods
// once per class so that, as the standard asks, each:
//
// - takes its `with` parameters as one object, as well as positionally;
// - answers an outcome: {outcome: applied | refused | conflict | unavailable
//   | cancelled, reason?, message?}. A host port's answer ({answer, reason,
//   message}, vocabulary §3.1) is read as the outcome it is; a method that
//   answered nothing, or the element itself, answered applied.
//
// Helpers the class calls internally go through the same wrapper; nothing in
// the package reads their old return value (the element, or the port's
// answer under `answer`), and `answer` stays on the outcome for one that does.
const camel = name => String(name).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());

const isPlain = value => value !== null && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;

function outcomeOf(result, element) {
  if (result === undefined || result === null || result === true || result === element) return {
    outcome: "applied"
  };
  if (result === false) return {
    outcome: "refused",
    reason: "refused"
  };
  if (typeof result === "object" && typeof result.outcome === "string") return result;

  if (typeof result === "object" && typeof result.answer === "string") {
    const {
      answer,
      reason,
      message
    } = result;
    return { ...result,
      outcome: answer,
      ...(reason ? {
        reason
      } : {}),
      ...(message ? {
        message
      } : {})
    };
  }

  return {
    outcome: "applied",
    value: result
  };
}
function answerActions(Class, manifest) {
  const proto = Class.prototype;

  for (const [name, spec] of Object.entries(manifest.actions || {})) {
    const method = camel(name);
    const run = proto[method];
    if (typeof run !== "function" || run.sfAction) continue;
    const names = Object.keys(spec?.with || {});

    const wrapped = function manifestAction(...args) {
      // One object naming only declared parameters is the object form.
      if (args.length === 1 && isPlain(args[0])) {
        const given = Object.keys(args[0]);
        if (!names.length && !given.length) args = [];else if (names.length && given.length && given.every(key => names.includes(key) || names.map(camel).includes(key))) {
          args = names.map(key => args[0][key] ?? args[0][camel(key)]);
        }
      }

      const result = run.apply(this, args);
      if (result && typeof result.then === "function") return result.then(value => outcomeOf(value, this));
      return outcomeOf(result, this);
    };

    wrapped.sfAction = true;
    Object.defineProperty(proto, method, {
      configurable: true,
      writable: true,
      value: wrapped
    });
  }

  return Class;
} // A setting the class reads through a getter of its own (an attribute read
// with its parsing) is writable as a property too, as §4 makes every setting:
// an assembly binds by property when the element has one (SF.Assembly's
// adaptElement), and a getter alone threw «has only a getter» at the first
// binding. The setter writes the attribute the getter reads.

function settingSetters(Class, manifest) {
  const proto = Class.prototype;

  for (const [name, spec] of Object.entries(manifest.settings || {})) {
    if (["list", "object", "state"].includes(spec?.type)) continue;
    const property = camel(name);
    let owner = proto;
    let found = null;

    while (owner && owner !== globalThis.HTMLElement?.prototype && owner !== Object.prototype) {
      found = Object.getOwnPropertyDescriptor(owner, property);
      if (found) break;
      owner = Object.getPrototypeOf(owner);
    }

    if (!found || !found.get || found.set) continue;
    Object.defineProperty(owner, property, {
      configurable: true,
      get: found.get,

      set(value) {
        if (spec.type === "boolean") {
          if (value === true || value === "" || value === "true") this.setAttribute(name, "");else if (value === false && spec.default === true) this.setAttribute(name, "false");else this.removeAttribute(name);
        } else if (value === null || value === undefined) {
          this.removeAttribute(name);
        } else {
          this.setAttribute(name, String(value));
        }
      }

    });
  }

  return Class;
}

/***/ },

/***/ "9d9caaf4f796"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   columnStyle: () => (/* binding */ columnStyle),
/* harmony export */   renderTableTemplate: () => (/* binding */ renderTableTemplate),
/* harmony export */   resolvedDataState: () => (/* binding */ resolvedDataState)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9d9903b87148");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("efa66f8927d1");
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("8137feb490e0");
/* harmony import */ var lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("80c480e5196c");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("68a281c549b5");
/* harmony import */ var _link_cell_contract_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("5bfdd9ec12a1");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_3__, lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_4__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_3__, lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_4__);








function getEventInputValue(event, fallback = '') {
  const pathTarget = event?.composedPath?.()?.[0];
  const candidates = [pathTarget, event?.target, event?.currentTarget];

  for (const candidate of candidates) {
    if (!candidate) continue;

    if (typeof candidate.value !== 'undefined') {
      return candidate.value;
    }

    const input = candidate.querySelector?.('input, textarea');

    if (input && typeof input.value !== 'undefined') {
      return input.value;
    }
  }

  return fallback;
} // The toolbar of the compact list: one line, the search taking the room and the
// filter and create as icons beside it -- the table's toolbar wrapped to three
// lines on a phone and took a quarter of the screen. Active filters follow as a
// row of chips that scrolls sideways, each removable, and the filter itself
// opens as a sheet over the whole screen.


function renderListToolbar(context) {
  const {
    state
  } = context.component;
  const {
    value
  } = state.search;
  const filterTags = context.component.getCurrentFilterTags();
  const filterValues = context.component.getCurrentFilterValues();
  const active = Object.entries(filterTags || {}).filter(([, tag]) => tag?.active !== false);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-table-toolbar sf-table-toolbar--list flex flex-col gap-1/3 flex-none"
             data-sf-filter-tags="${active.length ? '1' : '0'}">
            <div class="flex items-cross-center gap-1/3 min-w-0">
                <sf-input
                        size=${context.size}
                        root-class="sf-search-input flex-1 min-w-0"
                        appearance="bordered"
                        value="${value}"
                        placeholder=${context.searchPlaceholder}
                        name="sf_table_search"
                        aria-label=${context.searchPlaceholder}
                        @input=${e => context.component.searchChange({
    value: getEventInputValue(e, value)
  })}
                        @keydown=${e => context.component.handleSearchKeyDown(e)}
                        @keyup=${e => context.component.handleSearchKeyUp(e)}
                        hint-icon="search"
                ></sf-input>
                ${context.component.offersFilter(active.length) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-list-filter">
                    <sf-button-icon
                            size=${context.size}
                            appearance=${active.length ? 'default' : 'outline'}
                            scheme="primary"
                            icon="filter_list"
                            aria-label=${active.length ? context.component.text('listFilterLabel').replace('{count}', String(active.length)) : context.filterText}
                            @click=${e => context.component.openContextMenu(e, {
    type: 'bottom',
    menu: 'filter-settings'
  })}
                    ></sf-button-icon>
                    ${active.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-list-filter-count" aria-hidden="true">${active.length}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${context.component.getColumns().some(column => column?.sortable && !column.system) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-button-icon
                            size=${context.size}
                            appearance=${state.sort?.key ? 'default' : 'outline'}
                            scheme=${state.sort?.key ? 'primary' : 'on-surface'}
                            icon="swap_vert"
                            aria-label=${context.component.text('sortLabel')}
                            aria-haspopup="menu"
                            @click=${e => context.component.openContextMenu(e, {
    type: 'bottom',
    menu: 'list-sort'
  })}
                    ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${context.actions && context.creatable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-button-icon
                            size=${context.size}
                            appearance="outline"
                            scheme="on-surface"
                            icon="add"
                            aria-label=${context.createText}
                            @click=${e => state.createItems?.length ? context.component.openContextMenu(e, {
    type: 'bottom',
    menu: 'create'
  }) : context.component.requestCreateIntent(null)}
                    ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            ${active.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-table-list-tags flex items-cross-center gap-1/3">
                    ${active.map(([k, tag]) => {
    const filterValue = filterValues?.[k] || {};
    const count = Array.isArray(filterValue.values) ? filterValue.values.length : tag.count || '';
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-tag type="default" size=${context.size} text='${tag.label}' interactive closable :key=${k}
                                    root-class="active" count='${count}'
                                    @close="${() => context.component.removeFilterTag(k)}"
                                    @click=${e => context.component.openContextMenu(e, {
      type: 'bottom',
      menu: 'tag-settings',
      fieldKey: k,
      anchorSelector: '.sf-tag'
    })}
                            ></sf-tag>`;
  })}
                    <sf-button size=${context.size} appearance="link" scheme="on-surface" text=${context.clearText}
                               @click="${() => context.component.removeFilterTag()}"></sf-button>
                </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
}

function renderToolbar(context) {
  const {
    state
  } = context.component;
  const {
    value
  } = state.search;
  const filterTags = context.component.getCurrentFilterTags();
  const filterValues = context.component.getCurrentFilterValues();
  const hasUnsavedFilterDataChanges = context.component.hasUnsavedFilterDataChanges();
  const activeFilterTags = Object.entries(filterTags || {}).filter(([, tag]) => tag?.active !== false);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class="sf-table-toolbar flex gap-1/2 content-main-between flex-none"
                data-sf-filter-tags="${activeFilterTags.length ? '1' : '0'}"
        >
            <div class="sf-table-toolbar-start flex items-cross-center gap-1/3 flex-wrap min-w-0">
                ${context.component.offersFilter(activeFilterTags.length) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="flex items-cross-center">
                    <sf-button
                            size=${context.size}
                            appearance="default"
                            scheme="primary"
                            text=${context.filterText}
                            segment=${context.filterTemplates ? 'start' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            icon-start="filter_list"
                            @click=${e => {
    context.component.openContextMenu(e, {
      type: 'bottom',
      menu: 'filter-settings'
    });
  }}
                    ></sf-button>
                    ${context.filterTemplates ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-button-icon
                            size=${context.size}
                            appearance="default"
                            scheme="primary"
                            aria-label="Сохранить шаблон фильтра"
                            ?disabled=${!activeFilterTags.length}
                            segment="end"
                            icon="bookmark_add"
                            @click=${e => {
    context.component.openContextMenu(e, {
      type: 'bottom',
      menu: 'filter-favorites',
      parent: true
    });
  }}
                    ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${activeFilterTags.map(([k, tag]) => {
    const filterValue = filterValues?.[k] || {};
    const hasFilteredValues = Object.prototype.hasOwnProperty.call(filterValues || {}, k);
    const count = Array.isArray(filterValue.values) ? filterValue.values.length : tag.count || '';
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-table-tags">
                            <sf-tag
                                    type="default"
                                    size=${context.size}
                                    text='${tag.label}'
                                    interactive
                                    closable
                                    :key=${k}
                                    root-class="${hasFilteredValues ? 'active' : ''}"
                                    @close="${() => {
      context.component.removeFilterTag(k);
    }}"
                                    @click=${e => {
      context.component.openContextMenu(e, {
        type: 'bottom',
        menu: 'tag-settings',
        fieldKey: k,
        anchorSelector: '.sf-tag'
      });
    }}
                                    count='${count}'
                            ></sf-tag>
                        </div>`;
  })}
                ${activeFilterTags.length || hasUnsavedFilterDataChanges ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    ${hasUnsavedFilterDataChanges ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button
                                size=${context.size}
                                appearance="default"
                                scheme="primary"
                                text="Сохранить"
                                @click="${() => context.component.saveCurrentFilterTemplateData()}"
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${activeFilterTags.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button
                                size=${context.size}
                                appearance="outline"
                                scheme="on-surface"
                                text=${context.clearText}
                                @click="${() => context.component.removeFilterTag()}"
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>

            <div class="sf-table-toolbar-end flex items-cross-center gap-1/3 flex-wrap flex-auto min-w-0">
                <sf-input
                        size=${context.size}
                        root-class="sf-search-input m-inline-start-auto"
                        appearance="bordered"
                        value="${value}"
                        placeholder=${context.searchPlaceholder}
                        name="sf_table_search"
                        @input=${e => {
    context.component.searchChange({
      value: getEventInputValue(e, value)
    });
  }}
                        @keydown=${e => {
    context.component.handleSearchKeyDown(e);
  }}
                        @keyup=${e => {
    context.component.handleSearchKeyUp(e);
  }}
                        hint-icon="search"
                >
          <span slot="right">
                <sf-button-icon
                        size=${context.size}
                        appearance="link"
                        scheme="on-surface"
                        icon=${value.length ? 'close' : 'search'}
                        aria-label=${value.length ? 'Очистить поиск' : 'Поиск'}
                        @click=${e => {
    e.preventDefault();
    e.stopPropagation();
    if (!value.length) return false;
    context.component.updateSearchState({
      value: ''
    });
  }}
                ></sf-button-icon>

          </span>
                </sf-input>

                ${context.actions && context.creatable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <div class="flex items-cross-center">
                                <sf-button
                                        size=${context.size}
                                        appearance="outline"
                                        scheme="on-surface"
                                        text=${context.createText}
                                        segment=${state.createItems?.length ? 'start' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                        @click=${() => context.component.requestCreateIntent(null)}
                                ></sf-button>
                                ${state.createItems?.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                    <sf-button-icon
                                            size=${context.size}
                                            appearance="outline"
                                            scheme="primary"
                                            segment="end"
                                            icon="keyboard_arrow_down"
                                            aria-label="Дополнительные действия создания"
                                            aria-haspopup="menu"
                                            @click=${e => {
    context.component.openContextMenu(e, {
      type: 'bottom',
      menu: 'create'
    });
  }}
                                    ></sf-button-icon>
                                ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            </div>
                        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

                <!-- The extra actions of the view, from the host. Column
                     settings are not here: they are the gear in the table's own
                     head, where they have always been. Without actions there is
                     no control, because an empty menu is a dead end. -->
                ${context.settings && state.toolbarActions?.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-button-icon
                                    size=${context.size}
                                    appearance="outline"
                                    scheme="primary"
                                    icon="more_vert"
                                    aria-label="Действия с представлением"
                                    aria-haspopup="menu"
                                    @click=${e => {
    context.component.openContextMenu(e, {
      menu: 'toolbar-actions'
    });
  }}
                            ></sf-button-icon>
                        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
        </div>
    `;
} // The state the region is actually in: the author's data-state, or what the
// rows resolve to. It is declared on the region, not guessed from the markup.
// What the table says when it has no rows, one brick for every reason
// (owner, 2026-10-14): sf-empty-state at the table's size, the reason and its
// one action from what the table and its data view know -- no access, could
// not load (Повторить), nothing found (what the reset clears), no data
// (Создать when the table may create). A slot `empty` replaces it whole.


function renderEmptyState(context, dataState) {
  const component = context.component;
  if (component?.hasSlotContent?.('empty')) return component.getSlotContent('empty');
  const brick = component.emptyBrick(dataState);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-empty-state kind=${brick.kind} size=${brick.size} heading-level=${brick.headingLevel}
                                heading=${brick.title || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} text=${brick.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} live=${brick.live || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                .actions=${brick.actions}></sf-empty-state>`;
}

function resolvedDataState(context) {
  if (context.dataState !== 'auto') return context.dataState;
  const data = context.component?.getTableData?.() ?? {};
  if ((data.rows || []).length) return 'populated'; // Nothing given yet -- no columns, no rows -- is a table waiting for its
  // first answer, drawn as its skeleton: «Пока ничего нет» stood there
  // before any answer came (owner, 2026-10-15, frame by frame).

  if (!(data.columns || []).length) return 'loading';
  return 'empty';
}

function renderHeadLabel(context, column) {
  // The actions column is as wide as its icons, and its heading broke in two
  // over them («Дей / ствия»): it is named for assistive technology only.
  if (column.key === 'actions' && !column.component) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-visually-hidden">${column.label}</span>`;
  } // The gear opens the column settings; without them (settings-menu="false",
  // a host that saves no personal settings) the column keeps its row menus and
  // its heading is only a name.


  if (column.key === 'settings' && context.settingsMenu === false) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-visually-hidden">${context.component.text('settingsColumnLabel')}</span>`;
  }

  const content = column.component ? context.component.renderSmartElement(column.component.type, column.component.props) : column.label;

  if (column.sortable !== true || column.system) {
    return content;
  }

  const sort = context.component.state.sort || {};
  const direction = sort.key === column.key ? sort.direction : null;
  const icon = direction === 'asc' ? 'arrow_upward' : direction === 'desc' ? 'arrow_downward' : 'unfold_more';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button type="button" class="sf-table-sort-button flex items-cross-center gap-1/4 min-w-0"
                data-direction=${direction || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <span class="truncate">${content}</span>
            <i class="sf-icon sf-table-sort-icon" aria-hidden="true">${icon}</i>
        </button>
    `;
}

function ariaSort(context, column) {
  if (column.sortable !== true || column.system) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const sort = context.component.state.sort || {};
  if (sort.key !== column.key) return 'none';
  return sort.direction === 'asc' ? 'ascending' : 'descending';
}

function renderHead(context) {
  if (context.component?.hasSlotContent?.("head")) {
    return context.component.getSlotContent("head");
  }

  const columns = context.component?.getColumns?.() || [];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <thead class="sticky top-0 z-5">
        <tr>
            ${columns.map((column, k) => {
    return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(`head:${column.key}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <th
                                    class="relative"
                                    data-key="${column.key}"
                                    data-label="${column.label || column.key || ''}"
                                    data-sf-pinned=${context.component.isPinnedColumn(column) ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    style=${context.component.getStickyCellStyle(columns, k) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    aria-sort=${ariaSort(context, column)}
                                    @click=${column.sortable === true ? event => context.component.handleHeaderSortClick(event, column) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            >
                                ${column.system || k === columns.length - 1 ? renderHeadLabel(context, column) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
                                        class="sidebar-resizer flex items-cross-center h-full select-none"
                                >
                                    ${renderHeadLabel(context, column)}
                                    <!-- The width is taken by the line between
                                         two headers. There is no handle to find
                                         first: this is the line's own hit strip,
                                         invisible, astride the separator, and
                                         still a button, so the keyboard keeps
                                         the name and the arrows it had. -->
                                    <button type="button"
                                            role="separator"
                                            aria-orientation="vertical"
                                            class="sf-table-column-resizer"
                                            id=${context.component.getColumnResizerId(column.key)}
                                            data-sf-column-resizer=${column.key}
                                            aria-label="Изменить ширину столбца: ${column.label || column.key}"
                                            aria-keyshortcuts="ArrowLeft ArrowRight Home End Enter"
                                    ></button>
                                </div>`}
                            </th>`);
  })}
        </tr>
        </thead>
    `;
}

function toColumnSize(value) {
  if (value === null || typeof value === "undefined" || value === "") {
    return "";
  }

  return typeof value === "number" ? `${value}px` : String(value);
} // How narrow a data column may become before it stops being readable.
//
// A fixed-layout table divides whatever room it has between its columns and
// will divide it to nothing: at 620px with five columns they came out 61px
// each, which shreds «Код решения» over three lines and cannot hold a date at
// all. The consumer asked for a floor and for the table to scroll instead
// (Larena, 2026-10-06; measured on the admin reference, 2026-10-09).
//
// It is the table's own min-width rather than the columns', because
// `table-layout: fixed` ignores a minimum on a cell -- the widths come from
// the first row. So the floor is summed here and the table carries the total;
// the scroll box around it already scrolls, and starts doing so the moment the
// sum does not fit.
//
// System columns are not in it: select, settings and actions are sized for what
// they hold and are not text anyone reads.
// Field types whose values are prose rather than a name or a code: drawn on one
// line in a row (see renderCellValue).


const LONG_TEXT_TYPES = new Set(['text', 'textarea', 'markdown', 'html']);
const SYSTEM_COLUMNS = new Set(['select', 'settings', 'actions']); // The first load draws the rows it is waiting for, in the Framework's skeleton
// (owner, 2026-10-12): the shape of the list is on screen before its records,
// instead of one spinner in an empty table. Widths vary by row and column so
// the placeholder reads as text, not as a grid of bars. The words are for a
// reader and stay in a status; the bars are hidden from one.

const SKELETON_ROWS = 6;
const SKELETON_WIDTHS = ['w-3/4', 'w-1/2', 'w-2/3', 'w-1/3', 'w-2/5', 'w-3/5']; // Where a loaded row has a box, a menu or a gear, a loading row keeps a block
// as tall as that control, so the row is as tall before the data as after it
// (owner, 2026-10-14: the rows jumped when the data came).

const skeletonControl = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-skeleton-control" aria-hidden="true"></div>`;

const skeletonBar = (row, column) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-skeleton sf-skeleton--animation-pulse" aria-hidden="true">
    <div class="sf-skeleton-text sf-skeleton-text--size-1/2 ${SKELETON_WIDTHS[(row + column * 2) % SKELETON_WIDTHS.length]}"></div>
</div>`; // The floor is the component's measurement, not a declaration here: it is
// applied to a column only while there is not room for every column to be
// readable. Written always it would be the width rather than a minimum -- a
// cell that needs more would wrap and a typed row would grow, measured at 81px
// against 57 (owner, 2026-10-09).
// A column's width, floor and cap as its <col> style: the template draws it,
// and the table writes it straight onto the <col> after measuring its content,
// rather than rendering itself again for it (owner, 2026-10-15: a sort was five
// renders of four hundred elements).


function columnStyle(component, column) {
  const width = toColumnSize(column.colWidth ?? column.width ?? column.size) || (column.key === 'actions' ? component?.actionsColumnWidth || 'var(--sf-table--actions-column-width, var(--sf-f0))' : '') || component?.contentWidth?.(column) || (component?.columnsAreCramped && component?.columnTakesFloor?.(column) ? 'var(--sf-table--column-min-inline-size)' : '');
  const minWidth = toColumnSize(column.min_width ?? column.minWidth);
  const maxWidth = toColumnSize(column.maxWidth);
  return [width ? `width: ${width}` : "", minWidth ? `min-width: ${minWidth}` : "", maxWidth ? `max-width: ${maxWidth}` : ""].filter(Boolean).join("; ");
}

function renderColgroup(context) {
  const columns = context.component?.getColumns?.() || [];

  if (!columns.length) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <colgroup>
            ${columns.map(column => {
    // In a fixed layout the column widths come from here, and a
    // column with none is given whatever is left -- divided to
    // nothing when there is little. The floor is written as the
    // width: fixed layout shares any surplus between the columns
    // that have one, so they grow together above it and stop
    // shrinking below it, and the scroll box takes over.
    // `||` and not `??`: toColumnSize answers with an empty string
    // for a column nobody sized, and an empty string is neither
    // null nor undefined. The same shape cost sf-button its icon
    // shortcut for as long as that component existed.
    // The actions column is sized for its buttons. Without a width it
    // took whatever room was left -- a thousand pixels on a wide
    // page -- and the data columns were measured as cramped beside
    // it and held at their floor.
    const style = columnStyle(context.component, column);
    return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(`col:${column.key}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <col
                            data-key=${column.key || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            style=${style || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    />
                `);
  })}
        </colgroup>
    `;
} // Several values in a cell -- tags for each choice, badges for each language --
// stay on one line: what does not fit folds into «+N», whose title names the
// rest (owner, 2026-10-13). Wrapped, three tags made a row three lines tall in
// a list of one-line rows. The folded values stay in the text, visually hidden,
// so a screen reader still reads them all; the table's afterRender does the
// folding (fitCellValues), because only the laid-out row knows what fits.


function renderCellValues(items, owner) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-table-cell-values flex items-cross-center gap-1/3">
            ${items.map(item => renderCellItem(item, owner))}
            <span class="sf-table-cell-more" aria-hidden="true" hidden></span>
        </div>
    `;
}

function renderComponent(component, owner) {
  if (!component?.type) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  const props = { ...(component.props || {})
  };
  return owner.renderCellElement ? owner.renderCellElement(component.type, props) : owner.renderSmartElement(component.type, props);
}

function renderCellItem(item, owner) {
  if (item === null || typeof item === "undefined") {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  } // What the shared renderer set answers with is markup, not a descriptor.
  // Nine of its eleven cell renderers happen to answer with a descriptor --
  // a badge, a tag, an avatar, a reference link -- and the two that answer
  // with markup, the colour and the included block, fell through the object
  // branch below and were dropped: every colour cell and every code cell in
  // every table drew nothing at all. A unit calling the renderer saw correct
  // markup, so only a table could show it (admin polygon, 2026-10-10).


  if ((0,lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_4__.isTemplateResult)(item)) {
    return item;
  }

  if (typeof item === "object") {
    const {
      component,
      props: itemProps,
      ...itemMeta
    } = item;

    if (!component?.type) {
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    }

    return renderComponent({ ...component,
      props: { ...itemMeta,
        ...(itemProps || {}),
        ...(component.props || {})
      }
    }, owner);
  }

  return item;
}

function renderLinkCell(value) {
  const cell = (0,_link_cell_contract_js__WEBPACK_IMPORTED_MODULE_6__.normalizeTableLinkCell)(value);

  if (!cell) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  const content = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-table-link-cell-content flex flex-col min-w-0">
            <span class="sf-table-link-cell-text">${cell.text}</span>
            ${cell.subtext === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <span class="sf-table-link-cell-subtext sf-text-1/2">${cell.subtext}</span>
            `}
        </span>
    `;
  return cell.href ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-table-link-cell" href=${cell.href}>${content}</a>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-link-cell">${content}</span>`;
} // A row's markup, composed per arrangement of its cells (standard 1.3.8
// §18.4, simai/ui-pro#2). A row of plain cells is one Lit template with no
// part per cell: its strings are made once for each sequence of cell kinds
// (a box, the row menu, a text, an empty cell, a full cell) and kept, so Lit
// parses each arrangement once and a drawn row holds no marker per cell --
// about twenty-five nodes where a template per cell held forty-six. The
// fragments are fixed; a cell's values are bound, never written as HTML.
// This is the migration form (§16) until template.html is compiled.


const ROW_HOLE = Symbol("row-hole");
const ROW_STRINGS = new Map();

function rowStrings(kinds) {
  const signature = kinds.join("|");
  const known = ROW_STRINGS.get(signature);
  if (known) return known;
  const pieces = ['<tr data-selected=', ROW_HOLE, ' draggable=', ROW_HOLE, ' aria-level=', ROW_HOLE, ' aria-expanded=', ROW_HOLE, ' aria-setsize=', ROW_HOLE, ' aria-posinset=', ROW_HOLE, ' aria-busy=', ROW_HOLE, ' aria-rowindex=', ROW_HOLE, ' data-row-id=', ROW_HOLE, ' data-current=', ROW_HOLE, ' aria-current=', ROW_HOLE, ' tabindex="-1" @mousedown=', ROW_HOLE, ' @click=', ROW_HOLE, ' @dblclick=', ROW_HOLE, ' @keydown=', ROW_HOLE, '>'];

  for (const kind of kinds) {
    pieces.push('<td data-key=', ROW_HOLE, ' data-item=', ROW_HOLE, ' data-sf-pinned=', ROW_HOLE, ' style=', ROW_HOLE, '>');

    if (kind === 'box') {
      pieces.push('<label class=', ROW_HOLE, '><span class="sf-checkbox-box transition flex"><input type="checkbox" data-sf-row-box value=', ROW_HOLE, ' .checked=', ROW_HOLE, ' aria-label=', ROW_HOLE, ' @change=', ROW_HOLE, '></span></label>');
    } else if (kind === 'menu') {
      pieces.push('<button type="button" class=', ROW_HOLE, ' aria-label=', ROW_HOLE, ' value="menu" data-sf-row-menu @click=', ROW_HOLE, '><i class="sf-icon sf-icon--weight-regular pointer-event-none" aria-hidden="true">menu</i></button>');
    } else if (kind === 'text') {
      pieces.push('<span class=', ROW_HOLE, ' title=', ROW_HOLE, ' .textContent=', ROW_HOLE, '></span>');
    } else if (kind === 'node') {
      pieces.push(ROW_HOLE);
    }

    pieces.push('</td>');
  }

  pieces.push('</tr>');
  const strings = [''];

  for (const piece of pieces) {
    if (piece === ROW_HOLE) strings.push('');else strings[strings.length - 1] += piece;
  }

  const made = Object.freeze(Object.assign(strings, {
    raw: Object.freeze(strings.slice())
  }));
  ROW_STRINGS.set(signature, made);
  return made;
}

function renderTableTemplate(context) {
  const {
    state
  } = context.component;

  function renderBody() {
    if (context.component?.hasSlotContent?.("body")) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <tbody>
                ${context.component.getSlotContent("body")}
                </tbody>`;
    }

    const {
      state
    } = context.component;
    const columns = context.component?.getColumns?.() || [];
    const {
      rows = []
    } = state.data || {};
    const dataState = resolvedDataState(context); // A re-query over rows that are already on screen leaves them there,
    // dimmed, with one small spinner in the middle of what the person can
    // see. Replacing them with a loader — which is what happened before —
    // threw away the place they were reading and moved the answer to the top
    // left corner of an empty table.

    if (dataState === 'loading' && rows.length) {
      return renderRows(context, columns, rows, {
        busy: true
      });
    }

    if (dataState !== 'populated') {
      const stateContent = {
        // One indicator, the same one a re-query shows, centred in the
        // body rather than lined up at its start. The spinner paints its
        // own `label` as text and defaults it to "Loading...", so it is
        // given an empty one: the words are for a reader, in the
        // language the host set, and the circle is for everyone else.
        // Before this there were two indicators here, one of them in
        // English on a Russian page.
        loading: null,
        error: renderEmptyState(context, 'error'),
        empty: renderEmptyState(context, 'empty')
      }[dataState] || renderEmptyState(context, 'empty');

      if (dataState === 'loading') {
        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <tbody data-state="loading" class="sf-table-skeleton">
                        ${Array.from({
          length: SKELETON_ROWS
        }, (_, row) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<tr aria-hidden="true">
                            ${columns.some(column => !SYSTEM_COLUMNS.has(column?.key)) ? columns.map((column, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<td>${SYSTEM_COLUMNS.has(column?.key) ? skeletonControl : skeletonBar(row, at)}</td>`) // Before the host's first answer the columns are not
        // known yet: three bars across the whole row.
        : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<td colspan=${String(Math.max(columns.length, 1))}>
                                        <div class="flex gap-2">${[0, 1, 2].map(at => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="flex-1">${skeletonBar(row, at)}</div>`)}</div>
                                    </td>`}
                        </tr>`)}
                    </tbody>
                    <tbody><tr><td colspan=${String(Math.max(columns.length, 1))} class="sf-table-visually-hidden">
                        <span role="status">${context.loadingText}</span>
                    </td></tr></tbody>
                `;
      }

      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <tbody data-state=${dataState}>
                    <tr>
                        <td colspan=${String(Math.max(columns.length, 1))}>
                            <div class="sf-table-state">${stateContent}</div>
                        </td>
                    </tr>
                </tbody>
            `;
    }

    return renderRows(context, columns, rows);
  } // The compact list: each record as a block -- its box, its title (with the
  // tree's indent and button when it is a tree), the few fields the columns'
  // priority puts first, and its row menu. Opening and selecting are the
  // row's, so a record does in the list what it does in the table. The rest
  // of the record is the record panel's, opened the way a row opens it.


  function renderList() {
    const columns = context.component?.getColumns?.() || [];
    const {
      rows = []
    } = state.data || {};
    const dataState = resolvedDataState(context);

    if (dataState !== 'populated' && !(dataState === 'loading' && rows.length)) {
      if (dataState === 'loading') {
        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-list sf-table-skeleton flex flex-col" data-state="loading">
                    ${Array.from({
          length: SKELETON_ROWS
        }, (_, row) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-list-item flex flex-col gap-1/3 p-1" aria-hidden="true">
                        ${skeletonBar(row, 0)}${skeletonBar(row, 1)}
                    </div>`)}
                    <span class="sf-table-visually-hidden" role="status">${context.loadingText}</span>
                </div>`;
      }

      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-state" data-state=${dataState}>${renderEmptyState(context, dataState)}</div>`;
    }

    const select = columns.find(column => column.key === 'select');
    const menu = columns.find(column => column.key === 'settings');
    const data = columns.filter(column => column?.key && !['select', 'settings', 'actions'].includes(column.key) && !column.system && column.visible !== false);
    const title = data.find(column => column.role === 'title') ?? data[0]; // The title the host marked opens its record with one click here as
    // in the table's title column; a list on a laptop is the same admin.

    const listTitle = row => title.role === 'title' ? renderTitleLink(context, row, renderCellValue(row, title)) : renderCellValue(row, title);

    const limit = Math.max(0, Number(context.component.getProp?.('listFields') ?? 3) || 0);
    const fields = data.filter(column => column !== title).map((column, order) => ({
      column,
      order
    })).sort((a, b) => (a.column.priority ?? 1e6) - (b.column.priority ?? 1e6) || a.order - b.order).slice(0, limit).map(({
      column
    }) => column);

    const filled = value => !(value === null || value === undefined || value === '' || Array.isArray(value) && !value.length);

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <ul class="sf-table-list" role="list" aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-busy=${dataState === 'loading' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
                ${rows.map((row, rowIndex) => row.__tree?.more ? (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(`item:${row.id}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <li class="sf-table-list-more" style=${`--sf-table-tree--level: ${row.__tree.level}`}>
                            <sf-button appearance="link" size="1/2" text=${context.component.text('treeMore')}
                                       @click=${() => context.component.requestTreeMore(row)}></sf-button>
                        </li>`) : (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_1__.keyed)(`item:${context.component.rowsGeneration?.() ?? 0}:${row.id ?? rowIndex}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <li class="sf-table-list-item"
                            data-row-id=${context.component.getRowKey(row, rowIndex)}
                            data-selected=${row.select?.component?.props?.checked === true ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            data-current=${context.component.isCurrentRow(row, rowIndex) ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-level=${row.__tree ? String(row.__tree.level + 1) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-expanded=${row.__tree?.hasChildren ? String(row.__tree.expanded === true) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            tabindex="-1"
                            @mousedown=${event => context.component.handleRowPointerDown(event)}
                            @click=${event => context.component.handleRowClick(event, row, rowIndex)}
                            @dblclick=${event => context.component.handleRowOpen(event, row)}
                            @keydown=${event => context.component.handleRowKeydown(event, row)}>
                            ${select ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-list-select">${renderCellValue(row, select)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            <div class="sf-table-list-main">
                                <div class="sf-table-list-title">${title ? row.__tree || row.path ? renderTreeCell(context, row, listTitle(row)) : listTitle(row) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>
                                ${fields.some(column => filled(row[column.key])) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                    <div class="sf-table-list-fields">
                                        ${fields.filter(column => filled(row[column.key])).map(column => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                            <span class="sf-table-list-field">
                                                <span class="sf-table-list-label">${column.label ?? column.key}</span>
                                                <span class="sf-table-list-value">${renderCellValue(row, column)}</span>
                                            </span>`)}
                                    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            </div>
                            ${menu ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-list-menu">${renderCellValue(row, menu)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        </li>`))}
            </ul>`;
  } // The title opens its record with one click (owner, 2026-10-14): the
  // column the host marked as the title is a link to the record's view when
  // the row offers it, so a record is a click away rather than a double
  // click or a trip through the row's menu.


  function renderTitleLink(context, row, value) {
    if (!context.component.canOpenRow?.(row) || row?.id == null) return value;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-table-title-link" href=${row.href ?? row.url ?? '#'}
                @click=${event => {
      if (event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        if (row.href ?? row.url) return;
      }

      event.preventDefault();
      event.stopPropagation(); // The second click of a double click is the same wish:
      // opened once, not twice.

      if (event.detail > 1) return;
      context.component.requestActionIntent('view', [row.id]);
    }}>${value}</a>`;
  } // repeat, not keyed: a sort moves the rows it already drew. keyed at each
  // position redrew every row and every value in it when the order changed --
  // four hundred elements for one click (owner, 2026-10-15).
  //
  // Many entries (standard simai.smart-component 1.3.8 §18.4, gate 17;
  // simai/ui-pro#2). From the quality profile's threshold on (300 rows) the
  // table draws only the rows in view and a margin, with one spacer row
  // above and one below holding the height of the rest; the component keeps
  // the range (windowSlice) and moves it with the scroll. A cell that only
  // shows a value is class markup: the row's box is the checkbox's class
  // markup over a native input, the row's menu the icon button's class
  // markup over a native button, and text a span -- no Smart element per
  // cell, so a row is about twenty-five nodes instead of a hundred and eight.


  function renderRows(context, columns, rows, {
    busy = false
  } = {}) {
    const component = context.component;
    const treeColumn = component.treeColumnKey?.(columns);
    const titleColumn = columns.find(column => column?.role === 'title' && !column.system)?.key ?? null;
    const slice = component.windowSlice?.(rows) ?? null;
    const shown = slice ? rows.slice(slice.first, slice.last + 1) : rows;
    const offset = slice ? slice.first : 0;
    const span = String(Math.max(columns.length, 1));
    const draggable = component.hasAttribute('drag-rows') || component.getAttribute('row-reorder') === 'true';
    const sticky = columns.map((column, index) => component.getStickyCellStyle(columns, index) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing);
    const pinned = columns.map(column => component.isPinnedColumn(column) ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing); // The stripes are nth-child: a spacer of no height keeps the parity of
    // the drawn rows the parity they have in the whole list.

    const spacer = (height, key) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<tr class="sf-table-window-spacer" aria-hidden="true" data-sf-window-spacer=${key}><td colspan=${span} style=${`block-size: ${Math.max(0, Math.round(height))}px`}></td></tr>`;

    const fullCell = (row, column) => column.key === treeColumn ? renderTreeCell(context, row, column.key === titleColumn ? renderTitleLink(context, row, renderCellValue(row, column)) : renderCellValue(row, column)) : column.key === titleColumn ? renderTitleLink(context, row, renderCellValue(row, column)) : renderCellValue(row, column);

    const renderRow = (row, at) => {
      const index = at + offset;
      const current = component.isCurrentRow(row, index);
      const kinds = [];
      const values = [row.select?.component?.props?.checked === true ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, draggable && !row.__tree?.more ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, row.__tree ? String(row.__tree.level + 1) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, row.__tree?.hasChildren ? String(row.__tree.expanded === true) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, row.__tree ? String(row.__tree.setsize) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, row.__tree ? String(row.__tree.posinset) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, row.__tree?.loading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, slice ? String(index + 2) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, component.getRowKey(row, index), current ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, current ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, component.rowPointerDown, event => component.handleRowClick(event, row, index), event => component.handleRowOpen(event, row), event => component.handleRowKeydown(event, row)];
      columns.forEach((column, cellIndex) => {
        const mark = component.rowMarkupCell?.(row, column) ?? null;
        values.push(column.key, `${row.id}_${column.key}`, pinned[cellIndex], sticky[cellIndex]);

        if (mark?.kind === 'box') {
          kinds.push('box');
          values.push(`sf-checkbox sf-checkbox--size-${mark.size} flex content-main-between cursor-pointer`, mark.value, mark.checked, mark.label, mark.change);
        } else if (mark?.kind === 'menu') {
          kinds.push('menu');
          values.push(`sf-icon-button sf-icon-button--size-${mark.size} sf-icon-button--icon sf-icon-button--link flex items-cross-center sf-icon-button--on-surface`, mark.label, mark.click);
        } else if (mark?.kind === 'text') {
          kinds.push('text');
          values.push(mark.className, mark.title ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing, mark.text);
        } else if (mark?.kind === 'empty') {
          kinds.push('empty');
        } else {
          kinds.push('node');
          values.push(fullCell(row, column));
        }
      });
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)(rowStrings(kinds), ...values);
    };

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<tbody data-busy=${busy ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} data-sf-window=${slice ? `${slice.first}-${slice.last}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${slice ? spacer(slice.before, 'before') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${slice && slice.first % 2 === 0 ? spacer(0, 'parity') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_2__.repeat)(shown, (row, at) => row.__tree?.more ? `more:${row.id}` : `row:${component.rowsGeneration?.() ?? 0}:${row.id ?? row.value ?? at + offset}`, (row, at) => row.__tree?.more ? renderMoreRow(context, columns, row) : renderRow(row, at))}${slice ? spacer(slice.after, 'after') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</tbody>`;
  } // The first cell of a tree row: indented by its level, with the button that
  // opens or closes it when the host said it has children, and -- in a search
  // over a tree -- the path it lives under, so a found row says where it is.


  function renderTreeCell(context, row, value) {
    const tree = row.__tree;
    const path = Array.isArray(row.path) && row.path.length ? row.path.map(item => item?.label ?? item).join(' / ') : '';
    if (!tree && !path) return value;
    const level = tree?.level ?? 0;
    const toggle = tree?.hasChildren ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-table-tree-toggle"
                           data-expanded=${tree.expanded ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                           aria-label=${context.component.text(tree.expanded ? 'treeCollapse' : 'treeExpand')}
                           @click=${event => {
      event.stopPropagation();
      context.component.toggleTreeRow(row);
    }}><i class="sf-icon" aria-hidden="true">chevron_right</i></button>` : tree ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-tree-toggle" aria-hidden="true"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // The node's icon, the host's to choose (port 1.9.0): a page with pages
    // under it is still a page. Without one, a folder for a node with
    // children -- open when it is open -- and a document for a leaf.

    const icon = tree ? (tree.expanded ? row.icon_expanded ?? row.icon : row.icon) ?? (tree.hasChildren ? tree.expanded ? 'folder_open' : 'folder' : 'description') : row.icon;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span class="sf-table-tree-cell" style=${`--sf-table-tree--level: ${level}`}>
                ${toggle}
                ${icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-table-tree-icon" aria-hidden="true">${icon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                <span class="sf-table-tree-value flex flex-col min-w-0">
                    <span class="min-w-0">${value}</span>
                    ${path ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-tree-path">${path}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </span>
            </span>`;
  } // The next page of one level, as a row of its own at that level.


  function renderMoreRow(context, columns, row) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <tr class="sf-table-tree-more" aria-level=${String(row.__tree.level + 1)}>
                <td colspan=${String(columns.length)}>
                    <span class="sf-table-tree-cell" style=${`--sf-table-tree--level: ${row.__tree.level}`}>
                        <span class="sf-table-tree-toggle" aria-hidden="true"></span>
                        <sf-button appearance="link" size="1/2" text=${context.component.text('treeMore')}
                                   @click=${() => context.component.requestTreeMore(row)}></sf-button>
                    </span>
                </td>
            </tr>`;
  }

  function renderCellValue(row, column) {
    if (!column || !row) {
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    }

    let value = row[column.key];

    if (column.renderer === "link") {
      return renderLinkCell(value);
    } // `row.actions` is read here in two vocabularies. From a host it is ids
    // -- `["view"]`, the data view port's word for which of the list's
    // actions apply to this record -- and from a consumer that builds its
    // own controls it is the items themselves. Ids select from the table's
    // list; items are the list.
    //
    // Both went through the second branch before, so an array of ids was
    // handed to the filter AS the action list, where `action.id` is
    // undefined for a string: everything was filtered out and the
    // «Действия» column drew an empty container in every row of every list.
    // A consumer reported it on an embedded one, which is only where they
    // were looking (owner, 2026-10-09).
    // The cell is built from whichever vocabulary the row holds, and built
    // once. From a host `row.actions` is ids -- the data view port's word
    // for which of the list's actions apply to this record -- and after
    // normalizeRow it is the built items.
    //
    // Items are not rebuilt here. Passing them back through the builder
    // made new objects on every render, and a table that hands lit new
    // objects rebuilds the cells rather than keeping them, which costs
    // whatever the cells hold. The round-3 probe measures exactly that.
    // `row.actions` is the host's ids -- the data view port's word for which
    // of the list's actions apply to this record -- or, from a consumer that
    // builds its own controls, the items themselves. Ids select from the
    // list; items are the list. Handing ids to the builder AS the list was
    // the defect: `action.id` is undefined for a string, so everything was
    // filtered out and the «Действия» column drew an empty container in
    // every row of every list (owner, 2026-10-09).
    //
    // The built items are kept on the row, because a render that builds new
    // objects makes lit rebuild the cells rather than keep them, and the
    // cells hold things worth keeping. A re-query brings new row objects,
    // so the cache is fresh exactly when the data is.


    if (column.key === 'actions' && context.component?.getActionRowItems) {
      const built = Array.isArray(value) && value.length && value.every(item => item && typeof item === 'object');
      if (!built) value = context.component.rowActionItems(row);
    } // A boolean the host lets this person write is a checkbox in the cell;
    // it is disabled while the host answers.


    if (context.component?.cellEditable?.(row, column)) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-checkbox size=${context.size === '1/2' ? '1/2' : '1'} data-cell-edit=${column.key}
                ?checked=${value === true} ?disabled=${context.component.cellPending(row, column)}
                aria-label=${column.label ?? column.key}
                @change=${event => context.component.setCellValue(row, column, Boolean(event.target?.checked ?? event.detail?.checked))}></sf-checkbox>`;
    }

    if (column.component) {
      if (value !== null && typeof value !== "undefined" && (!Array.isArray(value) || value.length)) {
        return renderCellItem(value, context.component);
      }

      if (column.key === "settings" && (!value || Array.isArray(value) && !value.length)) {
        return renderComponent({
          type: "button-icon",
          props: {
            size: "1",
            appearance: "link",
            scheme: "on-surface",
            icon: "menu",
            ariaLabel: "Меню",
            value: "menu"
          }
        }, context.component);
      }

      return renderComponent(column.rowComponent || column.component, context.component);
    }

    if (value === null || typeof value === "undefined") {
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    } // A long text -- a description, a note -- is one line in a row, cut
    // with an ellipsis; the whole of it is in the title for the pointer and
    // in the text for a screen reader. Wrapped, one description made its row
    // three lines tall in a list of one-line rows (owner, 2026-10-13).


    if (LONG_TEXT_TYPES.has(column.propertyType ?? column.property_type ?? column.type) && (typeof value === "string" || typeof value === "number")) {
      const text = context.component?.cellText?.(column, value) ?? String(value);
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-cell-clip" title=${text}>${text}</span>`;
    } // The renderer set is asked before the shapes below, because a typed
    // cell's value is often an object -- a user or a related record arrives
    // as {value, label, href} -- and the object branch would render nothing
    // for it: it looks for a component the host put there. A cell that does
    // carry the host's own component still wins, which is the check here.


    const carriesHostComponent = typeof value === "object" && !Array.isArray(value) && Boolean(value.component?.type);

    if (!carriesHostComponent) {
      const typed = context.component?.getTypedCellValue?.(column, value);

      if (typed !== null && typeof typed !== "undefined") {
        // Badges and tags from the renderer set wrap onto the next line,
        // as the host's own values do: this branch drew them in one
        // line that ran out of the cell (owner, 2026-10-12).
        if (Array.isArray(typed)) {
          // A person -- the avatar, then the name -- stays on one
          // line: wrapping put the avatar above a two-line name. The
          // name wraps beside it instead.
          if (typed[0]?.component?.type === 'avatar') {
            return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <div class="flex flex-nowrap items-cross-center gap-1/3">
                                ${renderCellItem(typed[0], context.component)}
                                <span style="min-inline-size: 0">
                                    ${typed.slice(1).map(item => renderCellItem(item, context.component))}
                                </span>
                            </div>
                        `;
          }

          return renderCellValues(typed, context.component);
        }

        return renderCellItem(typed, context.component);
      }
    }

    if (Array.isArray(value)) {
      if (column.key === 'actions') {
        value = value.filter(el => {
          const {
            actions
          } = state;
          const actionId = el.id || el.component?.props?.value;
          const action = actions.find(action => action.id === actionId); // The host's own actions (its row_actions) live in the row
          // menu: a page has a dozen of them, which drawn in a row of
          // buttons wrapped it to three lines.

          if (el.inline === false) return false;
          return action?.visible ?? true;
        });
      } // Several values -- badges for each language, tags for each choice
      // -- wrap onto the next line when the column is narrower than
      // they are, instead of running out of the cell under the next one.
      // The row of actions stays on one line: it is sized for it.


      if (column.key === 'actions') {
        // A row's buttons stand in the row a person is on -- under the
        // pointer, with the focus, or current -- and the column keeps its
        // width in the others (owner, 2026-10-15): drawn in every row they
        // were most of a page's elements.
        if (!context.component.actionsShownFor?.(row)) {
          return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-row-actions" data-row-actions="idle"></div>`;
        }

        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <div class="sf-table-row-actions flex items-cross-center gap-1/3">
                        ${value.map(item => renderCellItem(item, context.component))}
                    </div>
                `;
      }

      return renderCellValues(value, context.component);
    }

    if (typeof value === "object") {
      return renderCellItem(value, context.component);
    } // Plain text stops at three lines with an ellipsis: a long description
    // in a list made one row as tall as the screen (owner, 2026-10-12). The
    // whole text is the record's, and a long one reads in full on hover.


    const text = String(value);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-cell-text" title=${text.length > 80 ? text : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${text}</span>`;
  } // The name is the table's (or the list's) alone: a named section is a
  // region, and the data view around the table names its own region by the
  // list's heading, so a second one of the same name only repeats it to a
  // screen reader (Larena storage review, 2026-10-28).


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section
                class="sf-table ${context.list ? 'sf-table--list' : ''} min-w-0 flex flex-col gap-1/3 flex-1 min-h-0 ${context.rootClass || ""}"
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-sf-instance=${context.component.getInstanceId()}
                data-state=${resolvedDataState(context)}
                aria-busy=${resolvedDataState(context) === 'loading' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            ${context.toolbar ? context.list ? renderListToolbar(context) : renderToolbar(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.component.renderBulkActions()}

            <div class="table-wrap min-w-0 max-w-full flex flex-col flex-1 min-h-0">
                <div class="sf-table-scroll min-h-0 min-w-0 overflow-auto flex-1 relative"
                     ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_3__.ref)(context.component.refs.scroll)}
                     data-sf-vertical-scroll=${context.verticalScroll}>
                    <div class="sf-table-resize-guide" aria-hidden="true" hidden
                         ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_3__.ref)(context.component.refs.resizeGuide)}></div>
                    ${resolvedDataState(context) === 'loading' && (context.component.getTableData()?.rows?.length ?? 0) > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <div class="sf-table-busy" role="status">
                                <sf-spinner size=${context.size} label="" aria-label=${context.loadingText}></sf-spinner>
                            </div>
                        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${context.list ? renderList() : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <table
                            ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_3__.ref)(context.component.refs.table)}
                            class="table border-separate border-spacing-0 min-w-full ${context.component?.hasContentWidths ? 'sf-table-content-sized' : 'w-max'} table-fixed transition"
                            role=${context.component.isTree?.() ? 'treegrid' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-rowcount=${context.component.windowRowCount?.() ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    >
                        ${renderColgroup(context)}
                        ${renderHead(context)}
                        ${renderBody(context)}
                    </table>`}
                </div>
                ${context.verticalScroll === 'page' && !context.list ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-rail" aria-hidden="true" hidden ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_3__.ref)(context.component.refs.rail)}>
                            <div class="sf-table-rail-track"></div></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

                ${context.pagin ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-pagination
                                    current="1"
                                    total=${String(context.paginationTotal)}
                                    bottom="true"
                                    show-action-for-all
                                    page-size=${String(context.paginationPageSize)}
                                    page-sizes=${context.pageSizes}
                                    show-page-size
                                    top-class="content-main-center"
                                    main-class="items-cross-center content-main-between"
                                    bottom-class="items-cross-center gap-2"
                            ></sf-pagination>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
        </section>
        ${state.contextMenu?.open ? context.component.renderContextMenu(context.state.contextMenu) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <!-- A demo panel used to stand here, open to nothing, titled after a
             ticket. Closed, it still took a box of its own, and in a card that
             spaces its parts that box became the gap above Show more: three
             spacings instead of one. -->
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5bfdd9ec12a1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeTableLinkCell: () => (/* binding */ normalizeTableLinkCell),
/* harmony export */   normalizeTableLinkHref: () => (/* binding */ normalizeTableLinkHref)
/* harmony export */ });
const SAFE_RELATIVE_PREFIXES = ["/", "./", "../", "#", "?"];
function normalizeTableLinkHref(value) {
  if (typeof value !== "string") {
    return null;
  }

  const href = value.trim();

  if (!href) {
    return null;
  }

  if (href.startsWith("//")) {
    return null;
  }

  if (SAFE_RELATIVE_PREFIXES.some(prefix => href.startsWith(prefix))) {
    return href;
  }

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? href : null;
  } catch {
    return null;
  }
}
function normalizeTableLinkCell(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const text = value.text === null || typeof value.text === "undefined" ? "" : String(value.text);
  const subtext = value.subtext === null || typeof value.subtext === "undefined" ? null : String(value.subtext);
  return {
    href: normalizeTableLinkHref(value.href),
    subtext,
    text
  };
}

/***/ },

/***/ "68a281c549b5"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "80c480e5196c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directive-helpers.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directive-helpers.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "9d9903b87148"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/keyed.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/keyed.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "8137feb490e0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/ref.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/ref.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "efa66f8927d1"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/repeat.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "073f05ff1a81"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/unsafe-html.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/unsafe-html.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "116963e5e31b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("position", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "e19611ff78cb"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PASTE_BLOCKS: () => (/* binding */ PASTE_BLOCKS),
/* harmony export */   RICH_TEXT_BLOCKS: () => (/* binding */ RICH_TEXT_BLOCKS),
/* harmony export */   RICH_TEXT_ELEMENTS: () => (/* binding */ RICH_TEXT_ELEMENTS),
/* harmony export */   RICH_TEXT_PROFILES: () => (/* binding */ RICH_TEXT_PROFILES),
/* harmony export */   RICH_TEXT_SCHEMES: () => (/* binding */ RICH_TEXT_SCHEMES),
/* harmony export */   cleanTree: () => (/* binding */ cleanTree),
/* harmony export */   decodeEntities: () => (/* binding */ decodeEntities),
/* harmony export */   parseHtml: () => (/* binding */ parseHtml),
/* harmony export */   plainText: () => (/* binding */ plainText),
/* harmony export */   richTextFromPlainText: () => (/* binding */ richTextFromPlainText),
/* harmony export */   richTextHref: () => (/* binding */ richTextHref),
/* harmony export */   sanitizeRichText: () => (/* binding */ sanitizeRichText),
/* harmony export */   serialize: () => (/* binding */ serialize),
/* harmony export */   treeFromDom: () => (/* binding */ treeFromDom)
/* harmony export */ });
// The HTML subset of sf-rich-text: what the value may hold, and how anything
// else is brought into it. Larena stores page text as a property of type
// html@1, and this module is that type's rule in the browser: the editor
// cleans the value it is given, every paste and drop, and its own DOM after
// every edit and command, through the one function here.
//
// The subset:
//
//   p  h2  h3  h4  strong  em  a[href]  ul  ol  li  blockquote  br
//
// - no attribute is kept but href on <a>;
// - href is kept for https:, mailto: and tel: URLs and for a site path
//   ("/docs/a"), judged after removing control characters and white space, so
//   "java\tscript:" does not pass; "//host" and "/\host" leave the site and
//   are not kept; a link whose href is not kept becomes its text;
// - script, style and the other containers whose content is not text for a
//   reader (DROPPED) go with their content; any other element is unwrapped,
//   and its text stays; one that stands as a block (div, section, table, a
//   cell, h1, pre) still separates its text from its neighbours';
// - b and i are strong and em, and a span whose style is bold or italic is
//   too (a word processor's paste); a b whose style says normal is not;
// - text outside a block is wrapped in p, a block inside a paragraph splits
//   it, a block inside a list item becomes a line of it (br), a list holds
//   only items, adjacent lists of one kind are one list;
// - the value has no empty block, no line break at a block's edge and no
//   white space between blocks; an editor with no text is "".
//
// Two readers feed one cleaner: `treeFromDom` reads a DOM (the editor, or a
// paste parsed by the browser in an inert <template>), `parseHtml` reads a
// string without a DOM (a server, a test). Neither ever assigns the input to
// a live element. What comes out is written by `serialize` from the cleaned
// model, every text escaped, so it holds nothing the subset does not allow
// whatever the reader understood.
//
// No imports and no state: the element and the contract tests use the same
// functions.
//
// The paste profile (simai/ui-source#66). html@1 is a stored type, so it does
// not grow: a value never holds pre or table. A structured-content editor
// reads a paste with cleanTree(tree, {profile: 'paste'}), which is html@1
// plus two blocks the profile maps to its own types instead of flattening
// them into paragraphs:
//
//   {type: 'pre', text}            a code block: its text with its line
//                                  breaks and indentation (-> content.code)
//   {type: 'table', caption, rows} a simple table: rows of {head, cells},
//                                  each cell {header, leaves} with the
//                                  subset's inline leaves (-> content.table)
//
// Everything inside them is cleaned by the same rule: the same marks, the
// same href check, DROPPED goes with its content. A pre or a table inside a
// list item, and a table inside a cell, are read as html@1 reads them.
// serialize writes the two in html@1 terms (lines of a paragraph, a
// paragraph per cell), so whatever comes out of it is still the subset.
//
// The module lives in the core runtime since content.html 1.0.0: the
// Composition renderer sanitises a content.html block through it at render,
// so a page that only renders a Document needs no Smart component.
// src/smart/input-rich/js/rich-text-html.mjs re-exports it for sf-rich-text and
// the field renderers; there is one rule, here.

const RICH_TEXT_ELEMENTS = Object.freeze(['p', 'h2', 'h3', 'h4', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'br']);
const RICH_TEXT_BLOCKS = Object.freeze(['p', 'h2', 'h3', 'h4']);
const RICH_TEXT_SCHEMES = Object.freeze(['https:', 'mailto:', 'tel:']);
// The profiles cleanTree reads by: html@1 itself, and the paste profile of a
// structured-content editor, which keeps PASTE_BLOCKS as blocks of their own.
const RICH_TEXT_PROFILES = Object.freeze(['html', 'paste']);
const PASTE_BLOCKS = Object.freeze(['pre', 'table']);

// Dropped with everything inside: their content is code, a document's head,
// a drawing, or a control's own data, not text for a reader.
const DROPPED = new Set([
  'script', 'style', 'template', 'head', 'title', 'meta', 'link', 'base', 'noscript',
  'iframe', 'frame', 'frameset', 'noembed', 'noframes', 'object', 'embed', 'applet',
  'svg', 'math', 'canvas', 'video', 'audio', 'img', 'picture', 'source', 'track',
  'input', 'select', 'textarea', 'xmp', 'plaintext',
]);

// Elements off the subset that stand as blocks: unwrapped, but their text is
// not run together with the text around them.
const BREAKING = new Set([
  'address', 'article', 'aside', 'body', 'caption', 'center', 'dd', 'details', 'dialog', 'dir', 'div',
  'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h5', 'h6', 'header',
  'hgroup', 'hr', 'html', 'legend', 'listing', 'main', 'menu', 'nav', 'optgroup', 'option', 'pre',
  'section', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
]);

const LISTS = new Set(['ul', 'ol']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
// Raw text: what follows the start tag up to its end tag is not markup.
const RAW = new Set(['script', 'style', 'textarea', 'title', 'xmp', 'iframe', 'noembed', 'noframes', 'noscript']);
// Where an implied </p> stops looking for the paragraph (the parser's button scope).
const P_SCOPE = new Set(['td', 'th', 'table', 'caption', 'button']);

// C0 controls, DEL and C1 controls: a browser ignores them inside a scheme.
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROLS = /[\u0000-\u001f\u007f-\u009f]/gu;
// ...and white space, which a browser also skips around and inside a scheme.
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const CONTROLS_AND_SPACE = /[\u0000- \u007f-\u009f\u00a0\u1680\u2000-\u200b\u2028\u2029\u202f\u205f\u3000\ufeff]/gu;
const HREF_MAX = 2048;

/**
 * The href sf-rich-text keeps, or null: https:, mailto: and tel: URLs and a
 * path on the site ("/docs/a", "/docs?q=1#a"). "//host", "/\host", http:,
 * javascript:, data: and anything else are not kept.
 * @param {unknown} value
 * @returns {string|null}
 */
function richTextHref(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > HREF_MAX) return null;
  const compact = trimmed.replace(CONTROLS_AND_SPACE, '');
  if (!compact) return null;
  if (compact.startsWith('/')) {
    // A site path, but not "//host" or "/\host", which leave the site.
    if (/^\/[/\\]/u.test(compact)) return null;
    const path = trimmed.replace(CONTROLS, '');
    return /^\/[/\\]/u.test(path) ? null : path;
  }
  const scheme = /^([a-z][a-z0-9+.-]*):/iu.exec(compact)?.[1]?.toLowerCase();
  if (!scheme || !RICH_TEXT_SCHEMES.includes(`${scheme}:`)) return null;
  let url;
  try {
    url = new globalThis.URL(trimmed.replace(CONTROLS, ''));
  } catch {
    return null;
  }
  if (url.protocol !== `${scheme}:`) return null;
  if (url.protocol === 'https:' && !url.hostname) return null;
  if (url.protocol !== 'https:' && url.href.length <= url.protocol.length) return null;
  return url.href;
}

// ---------------------------------------------------------------- entities

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', shy: '\u00ad',
  hellip: '\u2026', mdash: '\u2014', ndash: '\u2013', minus: '\u2212', laquo: '\u00ab', raquo: '\u00bb',
  lsquo: '\u2018', rsquo: '\u2019', sbquo: '\u201a', ldquo: '\u201c', rdquo: '\u201d', bdquo: '\u201e',
  bull: '\u2022', middot: '\u00b7', copy: '\u00a9', reg: '\u00ae', trade: '\u2122', deg: '\u00b0',
  times: '\u00d7', divide: '\u00f7', plusmn: '\u00b1', euro: '\u20ac', pound: '\u00a3', yen: '\u00a5',
  cent: '\u00a2', sect: '\u00a7', para: '\u00b6', thinsp: '\u2009', ensp: '\u2002', emsp: '\u2003',
  zwj: '\u200d', zwnj: '\u200c', larr: '\u2190', rarr: '\u2192', uarr: '\u2191', darr: '\u2193',
  numero: '\u2116', prime: '\u2032', Prime: '\u2033',
};

function decodeEntities(text) {
  return String(text).replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]*);?/giu, (whole, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? Number.parseInt(body.slice(2), 16) : Number.parseInt(body.slice(1), 10);
      if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) return '\ufffd';
      return String.fromCodePoint(code);
    }
    return Object.hasOwn(NAMED, body) && whole.endsWith(';') ? NAMED[body] : whole;
  });
}

// ---------------------------------------------------------------- readers

// The raw tree both readers give: {type: 'element', name, attrs, children}
// and {type: 'text', value}. Only href and style are read from attributes.

/**
 * Reads an HTML string into the raw tree, without a DOM. Tolerant the way a
 * browser is for what matters here: implied ends of p and li, void elements,
 * raw-text elements, comments, entities in text and attributes.
 * @param {string} html
 */
function parseHtml(html) {
  const source = typeof html === 'string' ? html : '';
  const root = {type: 'element', name: '#root', attrs: {}, children: []};
  const stack = [root];
  const top = () => stack[stack.length - 1];
  const append = (node) => top().children.push(node);
  const appendText = (value) => {
    if (!value) return;
    const last = top().children.at(-1);
    if (last?.type === 'text') last.value += value;
    else append({type: 'text', value});
  };
  const closeTo = (name, stopAt = null) => {
    for (let index = stack.length - 1; index > 0; index -= 1) {
      const open = stack[index].name;
      if (stopAt && stopAt.has(open)) return false;
      if (open === name) {
        stack.length = index;
        return true;
      }
    }
    return false;
  };
  let at = 0;
  const length = source.length;
  while (at < length) {
    const lt = source.indexOf('<', at);
    if (lt < 0) {
      appendText(decodeEntities(source.slice(at)));
      break;
    }
    if (lt > at) appendText(decodeEntities(source.slice(at, lt)));
    at = lt;
    if (source.startsWith('<!--', at)) {
      const end = source.indexOf('-->', at + 4);
      at = end < 0 ? length : end + 3;
      continue;
    }
    const next = source[at + 1] ?? '';
    if (next === '!' || next === '?') {
      const end = source.indexOf('>', at + 2);
      at = end < 0 ? length : end + 1;
      continue;
    }
    if (next === '/') {
      const match = /^<\/([a-z][a-z0-9-]*)[^>]*>?/iu.exec(source.slice(at));
      if (!match) {
        // "</" not followed by a name is a bogus comment.
        const end = source.indexOf('>', at + 2);
        at = end < 0 ? length : end + 1;
        continue;
      }
      at += match[0].length;
      const name = match[1].toLowerCase();
      if (name === 'br') append({type: 'element', name: 'br', attrs: {}, children: []});
      else if (name === 'p' && !closeTo('p', P_SCOPE)) {
        // A </p> without a <p> is an empty paragraph, as a browser reads it.
        append({type: 'element', name: 'p', attrs: {}, children: []});
      } else closeTo(name);
      continue;
    }
    const tag = /^<([a-z][a-z0-9-]*)/iu.exec(source.slice(at));
    if (!tag) {
      appendText('<');
      at += 1;
      continue;
    }
    at += tag[0].length;
    const name = tag[1].toLowerCase();
    const attrs = {};
    let selfClosing = false;
    // Attributes, up to the closing ">".
    while (at < length) {
      const space = /^[\s/]+/u.exec(source.slice(at));
      if (space) {
        if (space[0].includes('/') && source[at + space[0].length] === '>') selfClosing = true;
        at += space[0].length;
        continue;
      }
      if (source[at] === '>') {
        at += 1;
        break;
      }
      const attr = /^([^\s/>"'=][^\s/>"'=]*)(?:\s*=\s*(?:"([^"]*)"?|'([^']*)'?|([^\s>]*)))?/u.exec(source.slice(at));
      if (!attr) {
        at += 1;
        continue;
      }
      at += attr[0].length;
      const key = attr[1].toLowerCase();
      if (!Object.hasOwn(attrs, key)) attrs[key] = decodeEntities(attr[2] ?? attr[3] ?? attr[4] ?? '');
    }
    const element = {type: 'element', name, attrs, children: []};
    if (name === 'li') closeTo('li', LISTS);
    // A block start ends an open paragraph (the browser's implied </p>).
    if (RICH_TEXT_BLOCKS.includes(name) || LISTS.has(name) || name === 'blockquote' || BREAKING.has(name)) closeTo('p', P_SCOPE);
    append(element);
    if (name === 'plaintext') {
      at = length;
      break;
    }
    if (RAW.has(name)) {
      const close = new RegExp(`</${name}[\\s/>]`, 'iu').exec(source.slice(at));
      const end = close ? at + close.index : length;
      if (name === 'textarea' || name === 'title') element.children.push({type: 'text', value: decodeEntities(source.slice(at, end))});
      else element.children.push({type: 'text', value: source.slice(at, end)});
      const gt = close ? source.indexOf('>', end) : -1;
      at = gt < 0 ? length : gt + 1;
      continue;
    }
    if (!VOID.has(name) && !selfClosing) stack.push(element);
  }
  return root;
}

const HTML_NS = 'http://www.w3.org/1999/xhtml';

/**
 * Reads a DOM subtree (an element, a fragment, a template's content) into the
 * raw tree. Elements outside the HTML namespace are dropped.
 * @param {Node} node
 */
function treeFromDom(node) {
  const read = (current) => {
    if (current.nodeType === 3) return {type: 'text', value: current.data};
    if (current.nodeType === 11) return {type: 'element', name: '#root', attrs: {}, children: [...current.childNodes].map(read).filter(Boolean)};
    if (current.nodeType !== 1) return null;
    if (current.namespaceURI && current.namespaceURI !== HTML_NS) return null;
    const name = current.localName;
    if (DROPPED.has(name)) return null;
    const attrs = {};
    const href = current.getAttribute('href');
    if (href !== null) attrs.href = href;
    const style = current.getAttribute('style');
    if (style !== null) attrs.style = style;
    const children = name === 'template' ? [] : [...current.childNodes].map(read).filter(Boolean);
    return {type: 'element', name, attrs, children};
  };
  const tree = read(node);
  if (!tree || tree.type !== 'element') return {type: 'element', name: '#root', attrs: {}, children: tree ? [tree] : []};
  return {...tree, name: '#root'};
}

// ---------------------------------------------------------------- the cleaner

// What a style says of the marks: {strong: true|false|undefined, em: ...}.
function styleMarks(style) {
  const out = {};
  if (!style) return out;
  const weight = /(?:^|;)\s*font-weight\s*:\s*([^;!]+)/iu.exec(style)?.[1]?.trim().toLowerCase();
  if (weight) {
    if (weight === 'bold' || weight === 'bolder' || Number(weight) >= 600) out.strong = true;
    else if (weight === 'normal' || weight === 'lighter' || Number(weight) < 600) out.strong = false;
  }
  const fontStyle = /(?:^|;)\s*font-style\s*:\s*([^;!]+)/iu.exec(style)?.[1]?.trim().toLowerCase();
  if (fontStyle) {
    if (fontStyle === 'italic' || fontStyle.startsWith('oblique')) out.em = true;
    else if (fontStyle === 'normal') out.em = false;
  }
  return out;
}

function marksOf(element, marks) {
  const next = {...marks};
  if (element.name === 'strong' || element.name === 'b') next.strong = true;
  if (element.name === 'em' || element.name === 'i') next.em = true;
  const styled = styleMarks(element.attrs?.style);
  if (styled.strong !== undefined) next.strong = styled.strong;
  if (styled.em !== undefined) next.em = styled.em;
  return next;
}

// A leaf of inline content: {kind: 'text', value, strong, em, href} or
// {kind: 'br', strong, em, href}.
const leaf = (kind, value, context) => ({kind, value, strong: Boolean(context.marks.strong), em: Boolean(context.marks.em), href: context.href || null});

// A flow (the root, a quote) collects blocks; a list item collects its own
// content. Text comes in as leaves into the current run; a block ends the
// run.
class Flow {
  constructor(kind) {
    this.kind = kind;
    this.blocks = [];
    this.run = [];
    this.types = ['p'];
    this.starts = [0];
    this.needBreak = false;
  }

  inline(item) {
    if (this.kind === 'item' && this.needBreak && this.run.length > 0) {
      if (!(item.kind === 'text' && !item.value.trim())) {
        this.run.push({kind: 'br', strong: false, em: false, href: null});
        this.needBreak = false;
      }
    }
    this.run.push(item);
  }

  flush() {
    if (!this.run.length) return;
    if (this.kind === 'item') {
      this.blocks.push({type: 'inline', leaves: this.run});
    } else {
      this.blocks.push({type: this.types[this.types.length - 1], leaves: this.run});
    }
    this.run = [];
  }

  // A paragraph or heading starts (or a block off the subset): the text so
  // far is one block, and what follows belongs to the new one.
  open(type) {
    if (this.kind === 'item') {
      this.needBreak = true;
      return;
    }
    this.flush();
    this.types.push(type);
    this.starts.push(this.blocks.length);
  }

  // keepEmpty: a paragraph or heading of the subset that held nothing is
  // still a block (the editing surface keeps it; the value drops it).
  close(keepEmpty = false) {
    if (this.kind === 'item') {
      this.needBreak = true;
      return;
    }
    const start = this.starts[this.starts.length - 1];
    if (keepEmpty && !this.run.length && this.blocks.length === start) this.blocks.push({type: this.types[this.types.length - 1], leaves: []});
    this.flush();
    if (this.types.length > 1) {
      this.types.pop();
      this.starts.pop();
    }
  }

  block(block) {
    this.flush();
    this.blocks.push(block);
    this.needBreak = false;
  }
}

function walkText(value, flow, context) {
  if (context.pre) {
    const lines = value.replace(/\r\n?/gu, '\n').split('\n');
    lines.forEach((line, index) => {
      if (index > 0) flow.inline(leaf('br', '', context));
      if (line) flow.inline(leaf('text', line.replace(/[\t\f]/gu, ' '), context));
    });
    return;
  }
  const text = value.replace(/[\t\n\r\f ]+/gu, ' ');
  if (!text) return;
  // White space between blocks is formatting of the source, not text.
  if (text === ' ' && !flow.run.length) return;
  flow.inline(leaf('text', text, context));
}

function walkChildren(children, flow, context) {
  for (const child of children) walk(child, flow, context);
}

function walk(node, flow, context) {
  if (node.type === 'text') {
    walkText(node.value, flow, context);
    return;
  }
  const name = node.name;
  if (DROPPED.has(name)) return;
  if (name === 'br') {
    flow.inline(leaf('br', '', context));
    return;
  }
  const inner = {...context, marks: marksOf(node, context.marks)};
  if (name === 'a') {
    const href = richTextHref(node.attrs?.href);
    walkChildren(node.children, flow, href && !context.href ? {...inner, href} : inner);
    return;
  }
  if (RICH_TEXT_BLOCKS.includes(name)) {
    flow.open(name);
    walkChildren(node.children, flow, inner);
    flow.close(true);
    return;
  }
  if (LISTS.has(name)) {
    const list = readList(node, inner, name);
    if (list.items.length) flow.block(list);
    return;
  }
  if (name === 'blockquote') {
    if (flow.kind === 'item') {
      flow.open('p');
      walkChildren(node.children, flow, inner);
      flow.close();
      return;
    }
    const quote = new Flow('flow');
    walkChildren(node.children, quote, inner);
    quote.flush();
    flow.block({type: 'blockquote', blocks: quote.blocks});
    return;
  }
  if (name === 'li') {
    // An item outside a list is a paragraph of its own.
    flow.open('p');
    walkChildren(node.children, flow, inner);
    flow.close();
    return;
  }
  if (context.paste && flow.kind !== 'item' && (name === 'pre' || name === 'listing')) {
    flow.block({type: 'pre', text: preText(node)});
    return;
  }
  if (context.paste && flow.kind !== 'item' && name === 'table') {
    flow.block(readTable(node, inner));
    return;
  }
  if (BREAKING.has(name)) {
    flow.open('p');
    walkChildren(node.children, flow, name === 'pre' || name === 'listing' ? {...inner, pre: true} : inner);
    flow.close();
    return;
  }
  // Any other element: its text, in place.
  walkChildren(node.children, flow, inner);
}

// The text of a pre as it stands: line breaks and indentation kept, a <br> a
// line break, what DROPPED names gone. The newline right after <pre> is the
// markup's, as a browser reads it; trailing blank lines are not code.
function preText(node) {
  const read = (current) => {
    if (current.type === 'text') return current.value;
    if (DROPPED.has(current.name)) return '';
    if (current.name === 'br') return '\n';
    return current.children.map(read).join('');
  };
  return node.children.map(read).join('')
    .replace(/\r\n?/gu, '\n')
    .replace(/\u00a0/gu, ' ')
    .replace(/^\n/u, '')
    .replace(/\s+$/u, '');
}

// A simple table: thead, tbody, tfoot and rows straight in the table, cells
// th and td; a cell's content is inline leaves, its paragraphs and list items
// lines of it. colspan and rowspan are not read: a cell is one cell.
function readTable(node, context) {
  const table = {type: 'table', caption: [], rows: []};
  const readRow = (row, head) => {
    const cells = [];
    for (const cell of row.children) {
      if (cell.type !== 'element' || (cell.name !== 'td' && cell.name !== 'th')) continue;
      const flow = new Flow('item');
      walkChildren(cell.children, flow, {...context, marks: marksOf(cell, context.marks)});
      flow.flush();
      cells.push({header: cell.name === 'th', leaves: flatLeaves(flow.blocks)});
    }
    if (cells.length) table.rows.push({head, cells});
  };
  const readSection = (section, head) => {
    for (const child of section.children) {
      if (child.type === 'element' && child.name === 'tr') readRow(child, head);
    }
  };
  for (const child of node.children) {
    if (child.type !== 'element') continue;
    if (child.name === 'caption') {
      const flow = new Flow('item');
      walkChildren(child.children, flow, context);
      flow.flush();
      table.caption = flatLeaves(flow.blocks);
    } else if (child.name === 'thead') readSection(child, true);
    else if (child.name === 'tbody' || child.name === 'tfoot') readSection(child, false);
    else if (child.name === 'tr') readRow(child, false);
  }
  return table;
}

// An item's parts as one line of leaves: a nested list's items are lines too.
function flatLeaves(parts) {
  const out = [];
  const add = (leaves) => {
    if (!leaves.length) return;
    if (out.length) out.push({kind: 'br', strong: false, em: false, href: null});
    out.push(...leaves);
  };
  const visit = (part) => {
    if (part.type === 'inline') add(part.leaves);
    else for (const item of part.items) item.children.forEach(visit);
  };
  parts.forEach(visit);
  return out;
}

function readItem(node, context) {
  const flow = new Flow('item');
  walkChildren(node.children, flow, context);
  flow.flush();
  return {children: flow.blocks};
}

function readList(node, context, type) {
  const list = {type, items: []};
  let loose = null;
  const endLoose = () => {
    if (loose) {
      loose.flush();
      list.items.push({children: loose.blocks});
      loose = null;
    }
  };
  for (const child of node.children) {
    if (child.type === 'element' && child.name === 'li') {
      endLoose();
      list.items.push(readItem(child, context));
      continue;
    }
    if (child.type === 'element' && LISTS.has(child.name)) {
      endLoose();
      // A list right inside a list (what an indent command leaves) belongs to
      // the item before it.
      const nested = readList(child, {...context, marks: marksOf(child, context.marks)}, child.name);
      if (!nested.items.length) continue;
      const previous = list.items.at(-1);
      if (previous) previous.children.push(nested);
      else list.items.push({children: [nested]});
      continue;
    }
    if (child.type === 'text' && !child.value.trim()) continue;
    if (child.type === 'element' && DROPPED.has(child.name)) continue;
    // Loose content in a list is an item.
    loose ??= new Flow('item');
    walk(child, loose, context);
  }
  endLoose();
  return list;
}

// ---------------------------------------------------------------- tidying

const SPACE = ' ';
const sameFormat = (a, b) => a.strong === b.strong && a.em === b.em && a.href === b.href;

// Inline leaves made canonical: adjacent text of one format joined, runs of
// spaces made one, spaces at the edges and around a line break removed, a link
// with nothing but spaces made text.
function tidyLeaves(leaves, mode) {
  const out = [];
  for (const item of leaves) {
    if (item.kind === 'text' && !item.value) continue;
    const last = out.at(-1);
    if (item.kind === 'text' && last?.kind === 'text' && sameFormat(last, item)) {
      last.value += item.value;
    } else {
      out.push({...item});
    }
  }
  // One space between words, whatever the leaves.
  for (let index = 0; index < out.length; index += 1) {
    const item = out[index];
    if (item.kind !== 'text') continue;
    item.value = item.value.replace(/ {2,}/gu, SPACE);
    const previous = out[index - 1];
    if (item.value.startsWith(SPACE) && (!previous || previous.kind === 'br' || (previous.kind === 'text' && previous.value.endsWith(SPACE)))) {
      item.value = item.value.slice(1);
    }
    const next = out[index + 1];
    if (item.value.endsWith(SPACE) && (!next || next.kind === 'br')) item.value = item.value.slice(0, -1);
  }
  let kept = out.filter((item) => item.kind === 'br' || item.value);
  if (mode === 'value') {
    while (kept[0]?.kind === 'br') kept.shift();
    while (kept.at(-1)?.kind === 'br') kept.pop();
    if (kept[0]?.kind === 'text') kept[0].value = kept[0].value.replace(/^[\s\u00a0]+/u, '');
    const end = kept.at(-1);
    if (end?.kind === 'text') end.value = end.value.replace(/[\s\u00a0]+$/u, '');
    kept = kept.filter((item) => item.kind === 'br' || item.value);
  }
  // A link of nothing but spaces is not a link.
  const groups = new Map();
  for (const item of kept) {
    if (!item.href) continue;
    groups.set(item.href, (groups.get(item.href) || '') + (item.kind === 'text' ? item.value : 'x'));
  }
  for (const item of kept) if (item.href && !groups.get(item.href).trim()) item.href = null;
  // Join again: dropping spaces and links may have made neighbours alike.
  const joined = [];
  for (const item of kept) {
    const last = joined.at(-1);
    if (item.kind === 'text' && last?.kind === 'text' && sameFormat(last, item)) last.value += item.value;
    else joined.push(item);
  }
  return joined;
}

const hasText = (leaves) => leaves.some((item) => item.kind === 'text' && item.value.replace(/[\s\u00a0]+/gu, '') !== '');

function tidyItem(item, mode) {
  const children = [];
  for (const part of item.children) {
    if (part.type === 'inline') {
      const leaves = tidyLeaves(part.leaves, mode);
      if (!leaves.length) continue;
      const last = children.at(-1);
      if (last?.type === 'inline') last.leaves = tidyLeaves([...last.leaves, {kind: 'br', strong: false, em: false, href: null}, ...leaves], mode);
      else children.push({type: 'inline', leaves});
    } else {
      const list = tidyList(part, mode);
      if (!list) continue;
      const last = children.at(-1);
      if (last && last.type === list.type) last.items.push(...list.items);
      else children.push(list);
    }
  }
  if (mode === 'value') {
    const filtered = children.filter((part) => part.type !== 'inline' || hasText(part.leaves));
    return filtered.length ? {children: filtered} : null;
  }
  if (!children.length || children[0].type !== 'inline') children.unshift({type: 'inline', leaves: [{kind: 'br', strong: false, em: false, href: null}]});
  return {children};
}

function tidyList(list, mode) {
  const items = list.items.map((item) => tidyItem(item, mode)).filter(Boolean);
  return items.length ? {type: list.type, items} : null;
}

function tidyBlocks(blocks, mode) {
  const out = [];
  for (const block of blocks) {
    let tidy = null;
    if (block.type === 'blockquote') {
      const inner = tidyBlocks(block.blocks, mode);
      if (inner.length) tidy = {type: 'blockquote', blocks: inner};
      else if (mode === 'editor') tidy = {type: 'blockquote', blocks: [{type: 'p', leaves: [{kind: 'br', strong: false, em: false, href: null}]}]};
    } else if (LISTS.has(block.type)) {
      tidy = tidyList(block, mode);
    } else if (block.type === 'pre') {
      if (block.text.trim()) tidy = {type: 'pre', text: block.text};
    } else if (block.type === 'table') {
      // A row with no text in any cell is not kept, as an empty paragraph is not.
      const rows = block.rows.map((row) => ({head: row.head, cells: row.cells.map((cell) => ({header: cell.header, leaves: tidyLeaves(cell.leaves, 'value')}))}))
        .filter((row) => row.cells.some((cell) => hasText(cell.leaves)));
      if (rows.length) tidy = {type: 'table', caption: tidyLeaves(block.caption, 'value'), rows};
    } else {
      const leaves = tidyLeaves(block.leaves, mode);
      if (mode === 'value') {
        if (hasText(leaves)) tidy = {type: block.type, leaves};
      } else {
        tidy = {type: block.type, leaves: leaves.length ? leaves : [{kind: 'br', strong: false, em: false, href: null}]};
      }
    }
    if (!tidy) continue;
    const last = out.at(-1);
    // Adjacent lists of one kind are one list.
    if (last && LISTS.has(tidy.type) && last.type === tidy.type) last.items.push(...tidy.items);
    else out.push(tidy);
  }
  return out;
}

/**
 * The raw tree cleaned into blocks.
 * mode "value": the stored form -- no empty block, no break at an edge.
 * mode "editor": what the editing surface holds -- an empty block keeps a
 *   <br> so the caret has a line, breaks the person typed stay.
 */
function cleanTree(tree, {mode = 'value', profile = 'html'} = {}) {
  if (!RICH_TEXT_PROFILES.includes(profile)) throw new TypeError(`rich_text_profile_unknown: ${profile}`);
  const flow = new Flow('flow');
  walkChildren(tree.children ?? [], flow, {marks: {}, href: null, pre: false, paste: profile === 'paste'});
  flow.flush();
  const blocks = tidyBlocks(flow.blocks, mode);
  if (mode === 'editor' && !blocks.length) return [{type: 'p', leaves: [{kind: 'br', strong: false, em: false, href: null}]}];
  return blocks;
}

// ---------------------------------------------------------------- writing

const escapeText = (text) => text.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/\u00a0/gu, '&nbsp;');
const escapeAttribute = (text) => text.replace(/&/gu, '&amp;').replace(/"/gu, '&quot;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/\u00a0/gu, '&nbsp;');

// Leaves to markup, nested a > strong > em, each run of one format once.
function writeLeaves(leaves) {
  const writeGroup = (items, level) => {
    let out = '';
    let at = 0;
    const key = ['href', 'strong', 'em'][level];
    while (at < items.length) {
      const value = key ? items[at][key] : null;
      let end = at + 1;
      while (end < items.length && key && items[end][key] === value) end += 1;
      const group = items.slice(at, end);
      if (!key) {
        out += group.map((item) => (item.kind === 'br' ? '<br>' : escapeText(item.value))).join('');
      } else if (key === 'href' && value) {
        out += `<a href="${escapeAttribute(value)}">${writeGroup(group, level + 1)}</a>`;
      } else if (key !== 'href' && value) {
        out += `<${key}>${writeGroup(group, level + 1)}</${key}>`;
      } else {
        out += writeGroup(group, level + 1);
      }
      at = end;
    }
    return out;
  };
  return writeGroup(leaves, 0);
}

function writeList(list) {
  return `<${list.type}>${list.items.map((item) => `<li>${item.children.map((part) => (part.type === 'inline' ? writeLeaves(part.leaves) : writeList(part))).join('')}</li>`).join('')}</${list.type}>`;
}

/** Cleaned blocks to the HTML string. */
function serialize(blocks) {
  return blocks.map((block) => {
    if (block.type === 'blockquote') return `<blockquote>${serialize(block.blocks)}</blockquote>`;
    if (LISTS.has(block.type)) return writeList(block);
    // The paste profile's blocks in html@1 terms: never a pre or a table.
    if (block.type === 'pre') {
      const leaves = block.text.split('\n').flatMap((line, index) => [
        ...(index ? [{kind: 'br', strong: false, em: false, href: null}] : []),
        {kind: 'text', value: line.replace(/[\t\f]/gu, ' '), strong: false, em: false, href: null},
      ]);
      return `<p>${writeLeaves(tidyLeaves(leaves, 'value'))}</p>`;
    }
    if (block.type === 'table') {
      const cells = [{leaves: block.caption}, ...block.rows.flatMap((row) => row.cells)];
      return cells.filter((cell) => hasText(cell.leaves)).map((cell) => `<p>${writeLeaves(cell.leaves)}</p>`).join('');
    }
    return `<${block.type}>${writeLeaves(block.leaves)}</${block.type}>`;
  }).join('');
}

/** The text of cleaned blocks, for counting and emptiness. */
function plainText(html) {
  const blocks = cleanTree(parseHtml(html), {mode: 'value'});
  const text = (leaves) => leaves.map((item) => (item.kind === 'br' ? '\n' : item.value)).join('');
  const list = (block) => block.items.map((item) => item.children.map((part) => (part.type === 'inline' ? text(part.leaves) : list(part))).join('\n')).join('\n');
  const all = (items) => items.map((block) => (block.type === 'blockquote' ? all(block.blocks) : LISTS.has(block.type) ? list(block) : text(block.leaves))).join('\n\n');
  return all(blocks);
}

/**
 * Untrusted HTML into the subset. With a document (the browser) the string
 * is parsed by the browser in an inert <template>; without one, by
 * parseHtml. A DOM node may be given instead of a string.
 * @param {string|Node|null|undefined} input
 * @param {{mode?: 'value'|'editor', document?: Document|null}} [options]
 * @returns {string}
 */
function sanitizeRichText(input, {mode = 'value', document: documentRef} = {}) {
  let tree;
  if (input && typeof input === 'object' && typeof input.nodeType === 'number') {
    tree = treeFromDom(input);
  } else {
    const html = typeof input === 'string' ? input : '';
    const doc = documentRef === undefined ? globalThis.document : documentRef;
    if (html && doc?.createElement) {
      const template = doc.createElement('template');
      template.innerHTML = html;
      tree = treeFromDom(template.content);
    } else {
      tree = parseHtml(html);
    }
  }
  return serialize(cleanTree(tree, {mode}));
}

/**
 * Plain text into the subset: paragraphs split on blank lines, a single line
 * break a <br>.
 * @param {string} text
 * @param {{mode?: 'value'|'editor'}} [options]
 */
function richTextFromPlainText(text, {mode = 'value'} = {}) {
  const source = String(text ?? '').replace(/\r\n?/gu, '\n');
  const blocks = source.split(/\n[ \t\f\v\u00a0]*\n+/u).map((paragraph) => {
    const leaves = [];
    paragraph.split('\n').forEach((line, index) => {
      if (index > 0) leaves.push({kind: 'br', strong: false, em: false, href: null});
      const value = line.replace(/[\t\f\v ]+/gu, ' ');
      if (value) leaves.push({kind: 'text', value, strong: false, em: false, href: null});
    });
    return {type: 'p', leaves};
  });
  return serialize(tidyBlocks(blocks, mode));
}


/***/ },

/***/ "4f56033a1eae"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PASTE_BLOCKS: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.PASTE_BLOCKS),
/* harmony export */   RICH_TEXT_BLOCKS: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_BLOCKS),
/* harmony export */   RICH_TEXT_ELEMENTS: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_ELEMENTS),
/* harmony export */   RICH_TEXT_PROFILES: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_PROFILES),
/* harmony export */   RICH_TEXT_SCHEMES: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.RICH_TEXT_SCHEMES),
/* harmony export */   cleanTree: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.cleanTree),
/* harmony export */   decodeEntities: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.decodeEntities),
/* harmony export */   parseHtml: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.parseHtml),
/* harmony export */   plainText: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.plainText),
/* harmony export */   richTextFromPlainText: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.richTextFromPlainText),
/* harmony export */   richTextHref: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.richTextHref),
/* harmony export */   sanitizeRichText: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.sanitizeRichText),
/* harmony export */   serialize: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.serialize),
/* harmony export */   treeFromDom: () => (/* reexport safe */ _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__.treeFromDom)
/* harmony export */ });
/* harmony import */ var _core_js_composition_html_subset_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e19611ff78cb");
// The html@1 subset of sf-input-rich. The rule moved to the core runtime with
// content.html 1.0.0, so the Composition renderer and this element share one
// cleaner: src/core/js/composition/html-subset.mjs.



/***/ },

/***/ "f8651e83c6c6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-view-table for the shim (core/js/aliases.js, standard §16 item 20, vocabulary §9). mode: same-detail (the shim sends the new and the old name), detail-adds (the old name gets the larger new detail), split (the old detail from the element\'s adapter, sfAliasAdapters), host-attribute (no shim).","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1, §4.8","note":"stays a host attribute, read for the accessible name; no shim"},{"from":"sf-table-action-intent","to":"sf-table-apply","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 apply {action, scope, ids, revisions}; the old detail {action_id, record_ids} is made by the element\'s adapter (vocabulary §9: sf-table-action-intent → sf-table-apply)"},{"from":"sf-table-create-intent","to":"sf-table-create","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 create; the detail {item} is unchanged"},{"from":"sf-port-output","to":"sf-table-select","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 select {ids}; the composition port\'s old detail {port: selection, value} is made by the element\'s adapter"},{"from":"sf-table-query-intent","to":"sf-table-query","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5.1: sf-table-query-intent → sf-table-query; the detail {reason, context, sequence} is unchanged"},{"from":"sf-table-retry","to":"sf-table-refresh","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 refresh (table-retry)"},{"from":"sf-table-tree-toggle","to":"sf-table-expand","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 expand; the detail {id, expanded} is unchanged"},{"from":"sf-table-tree-more","to":"sf-table-load-more","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 load-more; the new detail adds direction: after to {parent, cursor}"},{"from":"sf-table-rows-reorder","to":"sf-table-move","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 move; the detail {ids, before, order} is unchanged"},{"from":"sf-table-column-settings-change","to":"sf-table-save","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 save {kind: columns}; the new detail adds kind to {reason, columnSettings, tableSettingsKey}","when":{"kind":"columns"}},{"from":"sf-table:column-settings-change","to":"sf-table-save","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5.1: sf-table:column-settings-change → sf-table-save {kind: columns}; a colon name (§8)","when":{"kind":"columns"}},{"from":"onColumnSettingsChange","to":"sf-table-save","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"detail-adds","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"a camelCase name outside §8 (simai/ui-pro#1); ui-admin listens to it (src/main.ts, src/smart-component-catalog.ts)","when":{"kind":"columns"}},{"from":"onSearchEnd","to":"sf-table-search-change","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"split","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"a camelCase name outside §8 (simai/ui-pro#1); its detail was the search text itself, made by the element\'s adapter; ui-admin listens to it (src/main.ts, src/smart-component-catalog.ts)"},{"from":"onTemplateSave","to":"sf-table-template-save","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"a camelCase name outside §8 (simai/ui-pro#1); ui-admin listens to it"},{"from":"onFilterUpdate","to":"sf-table-filter-change","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"a camelCase name outside §8 (simai/ui-pro#1); ui-admin listens to it"},{"from":"sf-table","to":"sf-view-table","kind":"tag","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R2 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-view-table; sf-table is a subclass defined beside it until the date"},{"from":"sf-table-select","to":"sf-view-table-select","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-apply","to":"sf-view-table-apply","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-save","to":"sf-view-table-save","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-column-settings-reset","to":"sf-view-table-column-settings-reset","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-create","to":"sf-view-table-create","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-filter-change","to":"sf-view-table-filter-change","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-query","to":"sf-view-table-query","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-refresh","to":"sf-view-table-refresh","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-search-change","to":"sf-view-table-search-change","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-sort-change","to":"sf-view-table-sort-change","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-template-delete","to":"sf-view-table-template-delete","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-template-save","to":"sf-view-table-template-save","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-template-select","to":"sf-view-table-template-select","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-toolbar-action","to":"sf-view-table-toolbar-action","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-reference-open","to":"sf-view-table-reference-open","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-expand","to":"sf-view-table-expand","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-load-more","to":"sf-view-table-load-more","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-rows-drag","to":"sf-view-table-rows-drag","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-move","to":"sf-view-table-move","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-cell-set","to":"sf-view-table-cell-set","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-view-change","to":"sf-view-table-view-change","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-window","to":"sf-view-table-window","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"}]}');

/***/ },

/***/ "c1f17ed5a348"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.view-table","tag":"sf-view-table","version":"1.15.1","kind":"leaf","settings":{"selectable":{"type":"boolean","default":true},"settings":{"type":"boolean","default":true},"actions":{"type":"boolean","default":true},"row-actions":{"type":"boolean","default":true},"creatable":{"type":"boolean","default":true},"filter-templates":{"type":"boolean","default":true},"settings-menu":{"type":"boolean","default":true},"pagin":{"type":"boolean","default":false},"filter-text":{"type":"string","default-from":"runtime.filter-text"},"clear-text":{"type":"string","default-from":"runtime.clear-text"},"search-placeholder":{"type":"string","default-from":"runtime.search-placeholder"},"create-text":{"type":"string","default-from":"runtime.create-text"},"pagination-total":{"type":"number","default":10,"integer":true,"min":0},"pagination-page-size":{"type":"number","default":10,"integer":true,"min":1,"max":100},"page-sizes":{"type":"string","default":"10,20,30,40"},"context-menu-columns":{"type":"number","default":1,"integer":true,"min":1,"max":4},"remember-widths":{"type":"boolean","default":false},"table-settings-key":{"type":"string","default":""},"data-state":{"type":"enum","values":["auto","loading","ready","populated","empty","error"],"default":"auto","x-alias":{"populated":"ready"}},"loading-text":{"type":"string","default-from":"runtime.loading-text"},"empty-text":{"type":"string","default-from":"runtime.empty-text"},"empty-description":{"type":"string"},"error-text":{"type":"string","default-from":"runtime.error-text"},"retry-text":{"type":"string","default-from":"runtime.retry-text"},"toolbar":{"type":"boolean","default":true},"pin-column-label":{"type":"string","default-from":"runtime.pin-column-label"},"unpin-column-label":{"type":"string","default-from":"runtime.unpin-column-label"},"column-move-label":{"type":"string","default-from":"runtime.column-move-label"},"column-search-placeholder":{"type":"string","default-from":"runtime.column-search-placeholder"},"column-search-empty-text":{"type":"string","default-from":"runtime.column-search-empty-text"},"vertical-scroll":{"type":"enum","values":["self","page"],"default":"self"},"filter-apply-text":{"type":"string","default-from":"runtime.filter-apply-text"},"layout":{"type":"enum","values":["auto","table","list"],"default":"table"},"list-below":{"type":"number","default":600},"list-fields":{"type":"number","default":3},"size":{"type":"enum","values":["1/2","1"],"default":"1"},"preferences-key":{"type":"string","default":""},"row-actions-visible":{"type":"enum","values":["hover","always"],"default":"hover"},"drag-rows":{"type":"boolean","default":false},"row-reorder":{"type":"boolean","default":false},"inline-edit":{"type":"boolean","default":false},"active-filter-fields":{"type":"list","entries":{"key":"id"}},"bulk-actions":{"type":"list"},"columns":{"type":"list","of":{"key":"string","label":"string"}},"create-items":{"type":"list"},"filter-fields":{"type":"list"},"rows":{"type":"list","entries":{"key":"id","changes":"revision"},"of":{"id":"id","revision":{"type":"string","optional":true}}},"table-data":{"type":"object"},"table-settings":{"type":"object"},"templates":{"type":"list"},"toolbar-actions":{"type":"list"},"sort":{"type":"list","of":{"key":"string","direction":{"type":"enum","values":["asc","desc"]}},"controlled":true},"current":{"type":"string","default":""}},"values":{"selected":{"type":"id","optional":true},"selection":{"type":"list","default":[]}},"events":{"select":{"carries":{"ids":"list"}},"apply":{"carries":{"action":"string","scope":{"type":"enum","values":["entry","selection","filter"]},"ids":"list","revisions":{"type":"object","optional":true}}},"save":{"carries":{"kind":{"type":"enum","values":["columns"]},"reason":"string","column-settings":{"type":"object"},"table-settings-key":{"type":"string"}}},"column-settings-reset":{"carries":{"target":{"type":"enum","values":["personal"]},"table-settings-key":{"type":"string","nullable":true}},"own-verb":true},"create":{"carries":{"item":{"type":"string","nullable":true,"optional":true}}},"filter-change":{"carries":{"template-key":{"type":"string"},"template-label":{"type":"string"},"values":{"type":"object"},"tags":{"type":"object"}},"own-verb":true},"query":{"carries":{"reason":"string","context":"object","sequence":{"type":"number","integer":true}}},"refresh":{"carries":{}},"search-change":{"carries":{"search":"string"},"own-verb":true},"sort-change":{"carries":{"key":{"type":"string","schema":{"minLength":1}},"direction":{"type":"enum","values":["asc","desc",null],"nullable":true}},"own-verb":true},"template-delete":{"carries":{"key":{"type":"string","schema":{"minLength":1}}},"own-verb":true},"template-save":{"carries":{},"own-verb":true},"template-select":{"carries":{"key":{"type":"string","schema":{"minLength":1}}},"own-verb":true},"toolbar-action":{"carries":{"action":"string","href":{"type":"string","nullable":true,"optional":true}},"cancelable":true,"own-verb":true},"reference-open":{"carries":{"field":"string","value":"object","href":"string"},"cancelable":true,"own-verb":true},"expand":{"carries":{"id":"id","expanded":{"type":"boolean","optional":true}}},"load-more":{"carries":{"direction":{"type":"enum","values":["after"]},"parent":{"type":"id","nullable":true},"cursor":{"type":"string","nullable":true}}},"rows-drag":{"carries":{"ids":{"type":"list","schema":{"items":{"type":"string"},"minItems":1}},"source":{"type":"string","nullable":true}},"own-verb":true},"move":{"carries":{"ids":"list","before":{"type":"id","nullable":true},"order":"list"}},"cell-set":{"carries":{"id":"object","key":"string","value":"object","revision":"object"},"own-verb":true},"view-change":{"carries":{"view":"object","everywhere":"boolean"},"own-verb":true},"window":{"carries":{"first":{"type":"number","integer":true},"last":{"type":"number","integer":true}},"own-verb":true}},"actions":{"add-rows":{"with":{"rows":"list"}},"apply-query-result":{"with":{"sequence":{"type":"number","integer":true,"schema":{"minimum":1}},"rows":"list"}},"clear-selection":{},"request-action-intent":{"with":{"action-id":{"type":"string","schema":{"minLength":1}},"record-ids":{"type":"list","schema":{"items":{"type":["string","integer"],"minLength":1},"minItems":1}}},"emits":"apply"},"request-create-intent":{"with":{"item-id":{"type":"string","optional":true,"nullable":true}},"emits":"create"},"request-retry":{"emits":"refresh"},"set-sort":{"with":{"key":{"type":"string","nullable":true},"direction":{"type":"enum","values":["asc","desc"],"nullable":true}}},"toggle-tree-row":{"with":{"row":"object"},"emits":"expand"},"request-tree-more":{"with":{"row":"object"},"emits":"load-more"},"focus-row":{"with":{"id":"id"}}},"port":{"id":"simai.dataview-port","version":"1.0.0","contract":"src/core/contracts/ports/simai.dataview-port/1.0.0/port.json"},"presentation":{"skeleton":{"late":["rows"]}},"host-states":{"data-sf-view-stripes":"boolean","data-sf-page-scroll":"boolean"},"css-variables":{"--sf-table-row-block-size-1/2":{"type":"length","state":"default"},"--sf-table-row-block-size-1":{"type":"length","state":"default"},"--sf-table-row-2-lines-block-size-1/2":{"type":"length","state":"default"},"--sf-table-row-2-lines-block-size-1":{"type":"length","state":"default"},"--sf-table-head-block-size-1/2":{"type":"length","state":"default"},"--sf-table-head-block-size-1":{"type":"length","state":"default"},"--sf-table-toolbar-block-size-1/2":{"type":"length","state":"default"},"--sf-table-toolbar-block-size-1":{"type":"length","state":"default"},"--sf-table-toolbar-gap":{"type":"length","state":"default"},"--sf-table-head--background-color":{"type":"color","state":"default"},"--sf-table-row--background-color":{"type":"color","state":"default"},"--sf-table--cell-spacing":{"type":"length","state":"default"},"--sf-table-cell--line-clamp":{"type":"number","state":"default"},"--sf-table-context-menu--z-index":{"type":"number","state":"open"},"--sf-table-context-menu--max-width":{"type":"length","state":"open"}}}');

/***/ },

/***/ "678dc07d76bf"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Table","events":{"column-settings-reset":{"label":"Column settings reset"},"filter-change":{"label":"Filter changed"},"search-change":{"label":"Search changed"},"sort-change":{"label":"Order changed"},"template-delete":{"label":"Template deleted"},"template-save":{"label":"Template saved"},"template-select":{"label":"Template chosen"},"toolbar-action":{"label":"Toolbar action"},"reference-open":{"label":"Open the linked record"},"rows-drag":{"label":"Rows dragged"},"cell-set":{"label":"Cell value changed"},"view-change":{"label":"Table view changed"},"window":{"label":"Rows shown"}},"runtime":{"actions-column-label":"Actions","apply-text":"Apply","clear-text":"Clear","close-text":"Close","column-move-label":"Move the column","column-search-empty-text":"No field matches","column-search-placeholder":"Search the fields","context-create-options-label":"Ways to create","context-field-filter-label":"Filtering by","context-filter-settings-label":"Filter settings","context-row-actions-label":"Row actions","context-save-template-label":"Saving the filter as a template","context-table-settings-label":"Table settings","context-template-actions-label":"Template actions","context-view-actions-label":"View actions","create-options-label":"Ways to create","create-text":"Create","default-template-text":"Default","delete-action-text":"Delete","edit-action-text":"Edit","empty-text":"No data","error-text":"The data could not be loaded","field-word-text":"field","fields-tab-text":"Fields","filter-apply-text":"Apply","filter-settings-label":"Filter settings","filter-text":"Filter","list-filter-label":"Filter, {count} active","loading-text":"Loading","make-default-label":"Make it the default","menu-label":"Menu","operator-any":"Any date","operator-between":"Range","operator-contains":"Contains","operator-eq":"Exactly","operator-gt":"Greater than","operator-gte":"Greater or equal","operator-in":"In the list","operator-lt":"Less than","operator-lte":"Less or equal","operator-month":"This month","operator-starts-with":"Starts with","operator-today":"Today","operator-week":"This week","pin-column-label":"Pin the column","rename-text":"Rename","reset-both-text":"Reset the search and filters","reset-filters-text":"Reset the filters","reset-search-text":"Clear the search","reset-text":"Reset","restore-text":"Restore","retry-text":"Try again","row-actions-label":"Row actions","save-for-everyone-label":"Save for everyone","save-template-label":"Save the filter as a template","search-placeholder":"Search","select-all-label":"Select every row","select-row-label":"Select the row","settings-column-label":"Settings","settings-fields-tab":"Fields","settings-view-tab":"View","sort-ascending":"ascending","sort-descending":"descending","sort-label":"Sort","sort-none":"As the host orders it","template-actions-label":"Template actions","template-move-label":"Move the template","template-name-placeholder":"Name","template-pin-label":"Keep the template at the top","templates-tab-text":"Templates","tree-collapse":"Collapse","tree-expand":"Expand","tree-more":"Show more","unpin-column-label":"Unpin the column","untitled-template-text":"All records","view-action-text":"View","view-density":"Rows","view-density-compact":"Compact","view-density-normal":"Normal","view-density-spacious":"Spacious","view-everywhere":"For all my tables","view-lines":"Lines between columns","view-reset":"Reset the view","view-single-line":"Text on one line","view-sticky-head":"Keep the filter and the head in view","view-stripes":"Alternate rows"}}');

/***/ },

/***/ "32294b89604f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Таблица","events":{"column-settings-reset":{"label":"Настройки столбцов сброшены"},"filter-change":{"label":"Фильтр изменён"},"search-change":{"label":"Поиск изменён"},"sort-change":{"label":"Порядок изменён"},"template-delete":{"label":"Шаблон удалён"},"template-save":{"label":"Шаблон сохранён"},"template-select":{"label":"Шаблон выбран"},"toolbar-action":{"label":"Действие панели"},"reference-open":{"label":"Открыть связанную запись"},"rows-drag":{"label":"Строки перетащены"},"cell-set":{"label":"Значение в ячейке изменено"},"view-change":{"label":"Вид таблицы изменён"},"window":{"label":"Показаны строки"}},"runtime":{"actions-column-label":"Действия","apply-text":"Применить","clear-text":"Очистить","close-text":"Закрыть","column-move-label":"Переместить столбец","column-search-empty-text":"Поля не найдены","column-search-placeholder":"Поиск по полям","context-create-options-label":"Варианты создания","context-field-filter-label":"Настройка фильтра","context-filter-settings-label":"Настройки фильтра","context-row-actions-label":"Действия со строкой","context-save-template-label":"Сохранение шаблона фильтра","context-table-settings-label":"Настройки таблицы","context-template-actions-label":"Действия с шаблоном","context-view-actions-label":"Действия с представлением","create-options-label":"Варианты создания","create-text":"Создать","default-template-text":"По умолчанию","delete-action-text":"Удалить","edit-action-text":"Редактировать","empty-text":"Нет данных","error-text":"Не удалось загрузить данные","field-word-text":"поле","fields-tab-text":"Поля","filter-apply-text":"Применить","filter-settings-label":"Настройки фильтра","filter-text":"Фильтр","list-filter-label":"Фильтр, активных условий: {count}","loading-text":"Загрузка данных","make-default-label":"Сделать по умолчанию","menu-label":"Меню","operator-any":"Любая дата","operator-between":"Диапазон","operator-contains":"Содержит","operator-eq":"Точно","operator-gt":"Больше чем","operator-gte":"Больше или равно","operator-in":"В списке","operator-lt":"Меньше чем","operator-lte":"Меньше или равно","operator-month":"Месяц","operator-starts-with":"Начинается с","operator-today":"Сегодня","operator-week":"Неделя","pin-column-label":"Закрепить столбец","rename-text":"Переименовать","reset-both-text":"Сбросить поиск и фильтры","reset-filters-text":"Сбросить фильтры","reset-search-text":"Очистить поиск","reset-text":"Сбросить","restore-text":"Восстановить","retry-text":"Повторить","row-actions-label":"Действия со строкой","save-for-everyone-label":"Сохранить для всех","save-template-label":"Сохранение шаблона фильтра","search-placeholder":"Поиск","select-all-label":"Выбрать все строки","select-row-label":"Выбрать строку","settings-column-label":"Настройки","settings-fields-tab":"Поля","settings-view-tab":"Вид","sort-ascending":"по возрастанию","sort-descending":"по убыванию","sort-label":"Сортировка","sort-none":"Как задано источником","template-actions-label":"Действия с шаблоном","template-move-label":"Переместить шаблон","template-name-placeholder":"Название","template-pin-label":"Закрепить шаблон сверху","templates-tab-text":"Шаблоны","tree-collapse":"Свернуть","tree-expand":"Развернуть","tree-more":"Показать ещё","unpin-column-label":"Открепить столбец","untitled-template-text":"Все записи","view-action-text":"Посмотреть","view-density":"Строки","view-density-compact":"Компактно","view-density-normal":"Обычно","view-density-spacious":"Просторно","view-everywhere":"Для всех моих таблиц","view-lines":"Линии между столбцами","view-reset":"Сбросить вид","view-single-line":"Текст в одну строку","view-sticky-head":"Закреплять фильтр и шапку","view-stripes":"Чередовать строки"}}');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		const hasSymbol = typeof Symbol === "function";
/******/ 		const webpackQueues = hasSymbol ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		const webpackExports = hasSymbol ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		const webpackError = hasSymbol ? Symbol("webpack error") : "__webpack_error__";
/******/
/******/ 		const resolveQueue = (queue) => {
/******/ 			if(queue?.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		const wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					const queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					const obj = {};
/******/
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			const ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			let queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			const depQueues = new Set();
/******/ 			const exports = module.exports;
/******/ 			let currentDeps;
/******/ 			let outerResolve;
/******/ 			let reject;
/******/ 			const promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			const handle = (deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				let fn;
/******/ 				const getResult = () => (currentDeps.map((d) => {
/******/
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				const promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					const fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}
/******/ 			const done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 			body(handle, done);
/******/ 			queue?.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			const getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	let __webpack_exports__ = __webpack_require__("94d60d3691b5");
/******/
/******/ })()
;