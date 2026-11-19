/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "a2a9d3c2841e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BADGE_MAIN_TONAL: () => (/* binding */ BADGE_MAIN_TONAL),
/* harmony export */   BADGE_SCHEMES: () => (/* binding */ BADGE_SCHEMES),
/* harmony export */   BADGE_SCHEME_ALIASES: () => (/* binding */ BADGE_SCHEME_ALIASES),
/* harmony export */   BADGE_SIZES: () => (/* binding */ BADGE_SIZES),
/* harmony export */   BADGE_TYPES: () => (/* binding */ BADGE_TYPES),
/* harmony export */   BADGE_VARIANTS: () => (/* binding */ BADGE_VARIANTS),
/* harmony export */   canonicalBadgeScheme: () => (/* binding */ canonicalBadgeScheme),
/* harmony export */   isRetiredMain: () => (/* binding */ isRetiredMain),
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
const BADGE_SIZES = Object.freeze(['1/3', '1/2', '1']); // The default look is tonal (owner decision C140 (1), badges study BG-1): a
// badge without an appearance is the calm grey mark. It was main, the dark
// grey fill nobody chose.

const DEFAULT_BADGE_TYPE = 'tonal';
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
} // The looks that are drawn: tonal and outline in every colour, main only with
// the error status (C140 (4)).

const BADGE_VARIANTS = Object.freeze(BADGE_SCHEMES.flatMap(scheme => BADGE_TYPES.filter(type => type !== 'main' || scheme === 'error').flatMap(type => BADGE_SIZES.map(size => Object.freeze({
  type,
  scheme,
  size
}))))); // The filled look is the attention count's alone (owner decision C140 (4)):
// main with the error status. main with any other colour draws tonal; the
// spelling keeps working until this date and each use is noted in
// SF.deprecations (journal value-badge-appearance-main-to-tonal).

const BADGE_MAIN_TONAL = Object.freeze({
  since: '2026-11-14',
  remove_after: '2027-01-01'
}); // True when an appearance asked for is the filled one on a colour that draws
// it tonal: the caller notes the old spelling.

function isRetiredMain({
  type,
  scheme
} = {}) {
  const requested = String(type ?? '').trim().toLowerCase();
  return requested === 'main' && (canonicalBadgeScheme(scheme ?? DEFAULT_BADGE_SCHEME) || DEFAULT_BADGE_SCHEME) !== 'error';
}
function normalizeBadgeContract({
  type,
  scheme,
  size
} = {}) {
  let normalizedType = normalizeEnum(type, BADGE_TYPES, DEFAULT_BADGE_TYPE);
  const normalizedScheme = canonicalBadgeScheme(scheme ?? DEFAULT_BADGE_SCHEME) || DEFAULT_BADGE_SCHEME;
  const normalizedSize = normalizeEnum(size, BADGE_SIZES, DEFAULT_BADGE_SIZE); // main is the attention count's: with any other colour it is tonal. The
  // tonal on-surface badge is the grey tonal one (the stylesheet draws
  // sf-badge--on-surface tonal as neutral); it was drawn main, filled.

  if (normalizedType === 'main' && normalizedScheme !== 'error') {
    normalizedType = 'tonal';
  }

  return {
    type: normalizedType,
    scheme: normalizedScheme,
    size: normalizedSize
  };
}

/***/ },

/***/ "e081a020262e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   copyText: () => (/* binding */ copyText),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Copying text, with the fallback (reuse audit 2026-11-02, finding 11). The
// clipboard class component and sf-copy-button each wrote this, and
// chat-message a third time; the order is theirs: the Clipboard API on a
// secure page, and execCommand('copy') over a hidden field where the API is
// absent or refused. A secure page whose clipboard permission is denied -- a
// policy, an embedded frame, a browser that asked and was answered no -- has
// the API and still refuses it; reading "present" as "allowed" left the
// fallback that exists for exactly this unreached (component/clipboard,
// 2026-10).

/**
 * Copies `text`. Settles with how it was copied, 'native' or 'legacy', or
 * rejects: Error('copy_unsupported') when the fallback copied nothing, or the
 * platform's own error (NotAllowedError, SecurityError) when it threw.
 * `document` is the document whose body holds the fallback field: the
 * element's own, for a component in another frame.
 */
async function copyText(text, {
  document: documentRef = globalThis.document
} = {}) {
  const value = String(text ?? '');
  const view = documentRef?.defaultView ?? globalThis;

  if (view.isSecureContext && view.navigator?.clipboard?.writeText) {
    try {
      await view.navigator.clipboard.writeText(value);
      return 'native';
    } catch {// Refused: the fallback is for exactly this.
    }
  }

  if (!documentRef?.body || typeof documentRef.execCommand !== 'function') throw new Error('copy_unsupported');
  const area = documentRef.createElement('textarea'); // The class is the clipboard component's (its sheet hides it); the inline
  // style keeps the field out of sight on a page without that sheet.

  area.className = 'sf-clipboard-fallback';
  area.value = value;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.cssText = 'position:fixed;inset-inline-start:-9999px;inset-block-start:0;opacity:0';
  documentRef.body.append(area);
  area.select(); // iOS selects nothing on select() alone.

  area.setSelectionRange?.(0, value.length);
  let copied = false;

  try {
    copied = documentRef.execCommand('copy');
  } finally {
    area.remove();
  }

  if (!copied) throw new Error('copy_unsupported');
  return 'legacy';
} // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it. SF.Clipboard (capital C)
// is the clipboard component's script API; this is the bare function.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.copyText) globalThis.SF.copyText = copyText;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copyText);

/***/ },

/***/ "1412c5875b4d"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RELATIVE: () => (/* binding */ RELATIVE),
/* harmony export */   densityOf: () => (/* binding */ densityOf),
/* harmony export */   drawing: () => (/* binding */ drawing),
/* harmony export */   followDensity: () => (/* binding */ followDensity),
/* harmony export */   markRelativeSizes: () => (/* binding */ markRelativeSizes),
/* harmony export */   noteAuthored: () => (/* binding */ noteAuthored),
/* harmony export */   sizeOf: () => (/* binding */ sizeOf),
/* harmony export */   sizeStep: () => (/* binding */ sizeStep),
/* harmony export */   sizedBefore: () => (/* binding */ sizedBefore)
/* harmony export */ });
// Density (owner decision C22, 2026-11-09). data-sf-density="compact" on the
// root or on a container moves every component one ladder step down; the CSS
// does it (core/scss/_sf_css__density.scss): each step variable holds the step
// below. An explicit size is a step on the region's ladder (owner decision
// C79, 2026-11-12, changing C22): it comes down with the region, and only
// data-sf-density="normal" takes the normal ladder back.
//
// A size a component's template gives an element it draws (sf-input's clear
// button, a pager's buttons, a submenu) is relative to the component's own
// size; those are still marked data-sf-size-relative once the component has
// drawn. Since C79 the density CSS treats both alike; the mark stays a
// published runtime mark (host-runtime-marks) for hosts that read it.
//
// What a component holds of the page's own (captured slot content, children
// left in place) keeps its size explicit. The store is on the shared global:
// every bundle carries its own copy of this module.
const store = () => {
  const SF = globalThis.SF = globalThis.SF || {};
  const internal = SF.__internal || (SF.__internal = {});
  return internal.density ||= {
    authored: new WeakSet(),
    depth: 0
  };
};

const RELATIVE = 'data-sf-size-relative'; // Page content a component captured to place in its own drawing. Content a
// template hands to a child while it draws is the template's, not the page's.

function noteAuthored(nodes) {
  const state = store();
  if (state.depth > 0) return;

  for (const node of nodes) if (node && typeof node === 'object') state.authored.add(node);
}
function drawing(callback) {
  const state = store();
  state.depth += 1;

  try {
    return callback();
  } finally {
    state.depth -= 1;
  }
} // The sized elements present before a host first draws are the page's.
// A printed first-paint picture is the drawing's, not the page's.

function sizedBefore(host) {
  return new Set(Array.from(host.querySelectorAll?.('[size]') ?? []).filter(element => {
    const picture = element.closest('[data-sf-static]');
    return !picture || !host.contains(picture);
  }));
} // After a host drew: every sized element its drawing holds that is not the
// page's is relative to the host.

function markRelativeSizes(host, before = null) {
  const {
    authored
  } = store();

  for (const element of host.querySelectorAll?.('[size]') ?? []) {
    if (element.hasAttribute(RELATIVE) || before?.has(element)) continue;
    let node = element;
    let page = false;

    while (node && node !== host) {
      if (authored.has(node)) {
        page = true;
        break;
      }

      node = node.parentNode;
    }

    if (!page) element.setAttribute(RELATIVE, '');
  }
} // A popup a component builds itself and places outside its own box (a menu on
// <body>, in an open dialog): sized from the component, so relative, and in
// the component's density, not the density of where it was placed.

function followDensity(element, from) {
  if (!element?.setAttribute) return element;
  if (element.hasAttribute('size')) element.setAttribute(RELATIVE, '');
  const density = densityOf(from);
  if (density) element.setAttribute('data-sf-density', density);else element.removeAttribute('data-sf-density');
  return element;
} // The density an element stands in: the nearest region's (an explicit size
// follows its region since C79); null outside any.

function densityOf(from) {
  for (let node = from; node?.nodeType === 1; node = node.parentElement) {
    if (node.hasAttribute('data-sf-density')) return node.getAttribute('data-sf-density');
  }

  return null;
} // The size step of the control a popup opens from (owner remark 2026-11-15:
// the row menu of a table of size 1 opened at 1/2). A popup a component
// builds outside itself -- a menu on <body> or in the open dialog -- stood on
// the default step whatever opened it. The step is the first size written
// from the opener up: the opener's own (a row's «⋯», the native button an
// sf-button draws), else its component's, else the Smart component that
// holds it (sf-view-table size="1"). A size a template gave a part it draws
// (data-sf-size-relative) follows its host, so the walk goes on past it. It
// ends on the default step (null) at the second custom element without a
// size: the opener's own component may stand on its default, the host
// holding it decides.

function sizeOf(from) {
  let own = true;

  for (let node = from; node?.nodeType === 1; node = node.parentElement) {
    if (node.hasAttribute('size')) {
      if (!node.hasAttribute(RELATIVE)) return node.getAttribute('size');
      continue;
    }

    if (!node.localName.includes('-')) continue;
    if (!own) return null;
    own = false;
  }

  return null;
} // A size step as a number of the ladder ("1/2" is 0.5, "2" is 2); NaN for
// anything else.

function sizeStep(size) {
  const [top, bottom = '1'] = String(size ?? '').trim().split('/');
  const step = Number(top) / Number(bottom);
  return top !== '' && Number.isFinite(step) && step > 0 ? step : Number.NaN;
}

/***/ },

/***/ "e577837dd70a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calendarDayOffset: () => (/* binding */ calendarDayOffset),
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   knownTimeZone: () => (/* binding */ knownTimeZone),
/* harmony export */   msUntilNextDay: () => (/* binding */ msUntilNextDay),
/* harmony export */   timeZoneOffset: () => (/* binding */ timeZoneOffset),
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
 * chart's tick, «14:05» with two-digit hours). `timeZone` (an IANA name,
 * Europe/Moscow) writes the moment on that zone's clock instead of the
 * reader's (owner decision C183 (3): a product that knows the person's zone).
 * Anything that is not a date is `gap`, '' by default.
 */


function formatDate(value, {
  date = 'medium',
  time = null,
  intl = null,
  timeZone = '',
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

  if (knownTimeZone(timeZone)) options = { ...options,
    timeZone
  };
  return (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(moment);
}
/**
 * Whether the platform knows an IANA time zone name (Europe/Moscow, UTC). An
 * empty or unknown name is the reader's own zone everywhere here.
 */

function knownTimeZone(timeZone) {
  const name = String(timeZone ?? '').trim();
  if (!name) return false;
  const root = typeof globalThis !== 'undefined' ? globalThis : {};
  if (!(root.__sfTimeZones instanceof Map)) root.__sfTimeZones = new Map();
  if (root.__sfTimeZones.has(name)) return root.__sfTimeZones.get(name);
  let known = true;

  try {
    new Intl.DateTimeFormat('en', {
      timeZone: name
    });
  } catch {
    known = false;
  }

  if (root.__sfTimeZones.size < 64) root.__sfTimeZones.set(name, known);
  return known;
} // The calendar date and the clock of a moment in a zone, as numbers: the
// reader's own when the zone is none.

function wallClock(moment, timeZone) {
  if (!knownTimeZone(timeZone)) {
    return {
      year: moment.getFullYear(),
      month: moment.getMonth(),
      day: moment.getDate(),
      hour: moment.getHours(),
      minute: moment.getMinutes(),
      second: moment.getSeconds()
    };
  }

  const parts = {};

  for (const part of (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', 'en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).formatToParts(moment)) {
    if (part.type !== 'literal') parts[part.type] = Number(part.value);
  }

  return {
    year: parts.year,
    month: parts.month - 1,
    day: parts.day,
    hour: parts.hour % 24,
    minute: parts.minute,
    second: parts.second
  };
}
/**
 * The zone's offset from UTC at a moment, in minutes (Moscow +180, New York
 * -300 in winter); the reader's own when the zone is none.
 */


function timeZoneOffset(value, {
  timeZone = ''
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  if (!moment) return Number.NaN;
  if (!knownTimeZone(timeZone)) return -moment.getTimezoneOffset();
  const clock = wallClock(moment, timeZone);
  const asUtc = Date.UTC(clock.year, clock.month, clock.day, clock.hour, clock.minute, clock.second);
  return Math.round((asUtc - Math.floor(moment.getTime() / 1000) * 1000) / 60000);
}
/**
 * Calendar days from `now` to the value in the reader's time zone (or
 * `timeZone`'s): 0 today, -1 yesterday, 1 tomorrow; NaN when the value is no
 * date. Counted on calendar dates, not 24-hour spans, so 23:59 yesterday is
 * -1 at 00:01 and a day of a clock change is still one day.
 */

function calendarDayOffset(value, {
  now = new Date(),
  timeZone = ''
} = {}) {
  const moment = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(value);
  const today = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now);
  if (!moment || !today) return Number.NaN;
  const at = wallClock(moment, timeZone);
  const from = wallClock(today, timeZone);
  const day = Date.UTC(at.year, at.month, at.day);
  const base = Date.UTC(from.year, from.month, from.day);
  return Math.round((day - base) / DAY_MS);
}
/**
 * Milliseconds from `now` to the reader's next midnight, when every relative
 * day on the screen moves by one. A component that shows them sets a timer
 * for this long (plus a second's margin, so it wakes in the new day) and
 * draws them again; «сегодня» said yesterday is wrong by morning.
 */

function msUntilNextDay(now = new Date(), {
  timeZone = ''
} = {}) {
  const today = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.toDate)(now) ?? new Date();

  if (!knownTimeZone(timeZone)) {
    const next = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return next.getTime() - today.getTime();
  } // In a named zone: the time left on its clock until 24:00, corrected by a
  // change of its offset before then (a clock change at night).


  const clock = wallClock(today, timeZone);
  const left = DAY_MS - ((clock.hour * 60 + clock.minute) * 60 + clock.second) * 1000 - today.getMilliseconds();
  const shift = timeZoneOffset(today, {
    timeZone
  }) - timeZoneOffset(new Date(today.getTime() + left), {
    timeZone
  });
  return Math.max(1, left + shift * 60000);
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

/***/ "c9ce0852ac73"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   numberOptions: () => (/* binding */ numberOptions),
/* harmony export */   percentSign: () => (/* binding */ percentSign),
/* harmony export */   percentText: () => (/* binding */ percentText)
/* harmony export */ });
/* harmony import */ var _format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_format_intl_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
// Numbers in the page's language by a format word: formatNumber and
// numberOptions alone, with no top-level side effects (format-intl.js). The
// same functions as core/js/format.js and SF.format.number; a bundle that
// formats numbers only imports them from here.

/**
 * The Intl options of a number format word (ui-chart's words, kept so a page
 * writes a format as an attribute):
 *
 *   number (default)  1 234,5   as many digits as `step` needs, at most 6; 2 without one
 *   integer           1 235
 *   decimal-<n>       n digits after the point, always (0 to 20)
 *   share             a share 0..1 as 12 % (0.125 is 12,5 %)
 *   percent           the same share: the charts' word, kept
 *   unit-percent      a value that already is the percent (12.5 is 12,5 %),
 *                     as the property type `percent` stores it
 *   compact           1,2 тыс.  /  1.2K
 *   currency-<CODE>   1 234,50 ₽ (an ISO 4217 code)
 *   unit-<unit>       45,3 ГБ (an Intl unit: gigabyte, megabit-per-second)
 *
 * Anything else reads as number. Words join with a space: a kind (currency-,
 * unit-, percent) and a precision (integer, decimal-<n>, compact), so
 * «currency-RUB integer» is 1 235 ₽, «currency-RUB decimal-2» 1 234,50 ₽ and
 * «currency-RUB compact» 1,1 млн ₽. The precision wins whatever the order.
 */

function numberOptions(format = 'number', step = 0) {
  const words = String(format || 'number').trim().split(/\s+/u).filter(Boolean);

  if (words.length > 1) {
    const PRECISION = /^(?:integer|compact|decimal-\d{1,2})$/u;
    const kinds = words.filter(one => !PRECISION.test(one));
    const precision = words.filter(one => PRECISION.test(one));
    return [...kinds, ...precision].reduce((options, one) => ({ ...options,
      ...numberOptions(one, step)
    }), {});
  }

  const word = words[0] ?? 'number';
  if (word === 'integer') return {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }; // Two meanings of «percent» met in the Framework (C294, MP-4): this word
  // multiplies a share by 100, while the property type `percent` holds the
  // percent itself. `share` says which one it is; `percent` stays its alias for
  // the charts that write it, and `unit-percent` is the percent itself.

  if (word === 'share' || word === 'percent') return {
    style: 'percent',
    maximumFractionDigits: 1
  };
  if (word === 'compact') return {
    notation: 'compact',
    maximumFractionDigits: 1
  };
  const decimal = /^decimal-(\d{1,2})$/u.exec(word);

  if (decimal) {
    const digits = Math.min(20, Number(decimal[1]));
    return {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    };
  }

  const unit = /^unit-([a-z]+(?:-per-[a-z]+)?)$/u.exec(word);
  if (unit) return {
    style: 'unit',
    unit: unit[1],
    unitDisplay: 'short',
    maximumFractionDigits: 1
  };
  const currency = /^currency-([A-Z]{3})$/u.exec(word);
  if (currency) return {
    style: 'currency',
    currency: currency[1]
  };
  const digits = step > 0 && step < 1 ? Math.min(6, Math.ceil(-Math.log10(step) - 1e-9)) : 2;
  return {
    maximumFractionDigits: digits
  };
}
/**
 * A number in the locale by a format word (numberOptions). `grouping: false`
 * writes it without thousands marks («2026»), `step` sets the digits of
 * `number`, and a value that is not a finite number is `gap`, '' by default
 * (a chart passes '—').
 */

function formatNumber(value, format = 'number', {
  step = 0,
  gap = '',
  grouping = true,
  ...where
} = {}) {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof number !== 'number' || !Number.isFinite(number)) return gap;
  const options = numberOptions(format, step);
  if (grouping === false) options.useGrouping = false;
  const text = (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options).format(number);
  return options.style === 'percent' || options.unit === 'percent' ? percentSign(text) : text;
}
/**
 * One spelling of a per cent in every language (owner decision C203 (3), DEV
 * msg-913fd9e4, 2026-11-15): the number, a no-break space (U+00A0) and «%» --
 * «72 %», «12,5 %», and «72 %» in English too, where Intl writes «72%». A
 * language that writes the sign first («%72») keeps its order.
 */

function percentSign(text) {
  // A right-to-left language writes direction marks around the sign («12.5‎%‎»
  // in Arabic); they go with the space it had, and the number keeps the mark
  // it starts with (C294).
  return String(text).replace(/[\s\u00a0\u202f\u200e\u200f\u061c]*%[\u200e\u200f\u061c]*$/u, '\u00a0%');
}
/**
 * A value that already is a per cent (0..100, «72», «72.5») as the progress
 * family shows and says it (owner decision C203 (3), IM-3): the number in the
 * language of the node's part of the page, as many digits as it has (up to
 * 2), a no-break space and «%» -- «72 %», «72,5 %».
 */

function percentText(value, node) {
  const number = Number(value);
  return percentSign(`${formatNumber(Number.isFinite(number) ? number : 0, 'number', {
    node,
    grouping: false
  })}%`);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1b42c5117087"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICON_CHOICES: () => (/* binding */ ICON_CHOICES),
/* harmony export */   ICON_CHOICE_WORDS: () => (/* binding */ ICON_CHOICE_WORDS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   iconWords: () => (/* binding */ iconWords)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _lang_icon_search_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4bd9c3b168e0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
// The glyphs a person may mark a part of an interface with -- a section of a
// record, a row of a menu, a tile of a dashboard. A hundred and twenty names
// from the Framework's own icon set, the ones products actually reach for,
// read in rows of what they are usually about: what a thing is, who it
// belongs to, when it happens, what it costs, what it is made of. One list,
// so every set chooses from the same glyphs.
//
// Raised from ui-pro sf-view-properties (js/icon-choices.js), which sf-admin-menu
// imported across what become two component sets (duplication audit
// 2026-11-03, A-1; owner decision 2026-11-03, component sets, point 13). A
// component imports ICON_CHOICES; a page reads SF.icons.choices, and
// SF.icons.choices.words[name] gives a glyph's Russian and English words
// (C151 point 8). The choice
// itself is drawn by sf-dropdown with options of kind icon (layout grid,
// search), as sf-view-properties and sf-admin-menu do.

 // The words a person searches the choice by (owner decision C151 point 8): a
// Russian and an English word or two for each glyph, the name's own words
// among the English ones. sf-dropdown matches its icon options against them
// in either language, so «папка» finds folder and «folder» still does.
// The words live in core's language files (owner decision C282):
// src/core/js/lang/icon-search/<code>.json, a glyph's words joined by commas.
// English is built in; Russian (and any other language) is the words its
// language file registered for sf-icon-search, its icon-search part, fetched
// the first time a search asks for them. ICON_CHOICE_WORDS keeps its shape,
// {name: {ru: [...], en: [...]}}: ru reads the registered words when it is read.

const splitWords = text => String(text ?? '').split(',').map(word => word.trim()).filter(Boolean);

function languageWords(code, name) {
  const own = _lang_icon_search_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"][code]?.[name];
  if (own !== undefined) return splitWords(own); // localeText asks core for the language's icon-search part when it is not
  // here yet (and says the English words meanwhile); only a word registered
  // for the language itself counts.

  (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.localeText)(_lang_icon_search_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"], name, code, 'sf-icon-search');
  return splitWords(globalThis.__sfPageLanguage?.registered?.get?.('sf-icon-search')?.get?.(code)?.[name]);
}

const ICON_CHOICE_WORDS = /* @__PURE__ */Object.freeze(Object.fromEntries(Object.keys(_lang_icon_search_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"].en).map(name => [name, Object.freeze(Object.defineProperties({}, {
  ru: {
    enumerable: true,
    get: () => languageWords('ru', name)
  },
  en: {
    enumerable: true,
    value: Object.freeze(splitWords(_lang_icon_search_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"].en[name]))
  }
}))]))); // The words of any glyph name: the choice's words, or the name read as words
// (folder_open -> folder open) for a glyph outside the choice.

function iconWords(name) {
  const key = String(name || '').trim();
  const words = Object.hasOwn(ICON_CHOICE_WORDS, key) ? ICON_CHOICE_WORDS[key] : null;
  const own = key.split('_').filter(Boolean);
  return {
    ru: words ? [...words.ru] : [],
    en: [...new Set([...(words ? words.en : []), ...own])]
  };
}
const ICON_CHOICES = Object.freeze(Object.defineProperty(["folder", "folder_open", "topic", "home", "dashboard", "apartment", "store", "storefront", "business_center", "work", "badge", "person", "group", "groups", "account_circle", "manage_accounts", "supervisor_account", "contacts", "school", "menu_book", "assignment", "task", "description", "article", "note_alt", "edit_note", "draft", "receipt", "receipt_long", "request_quote", "inventory_2", "category", "label", "sell", "local_offer", "shopping_cart", "shopping_bag", "payments", "savings", "credit_card", "account_balance", "calculate", "percent", "trending_up", "analytics", "insights", "monitoring", "bar_chart", "pie_chart", "table_chart", "schedule", "event", "today", "calendar_month", "date_range", "history", "alarm", "timer", "update", "hourglass_top", "mail", "outgoing_mail", "chat", "forum", "sms", "call", "phone_in_talk", "contact_support", "campaign", "notifications", "language", "public", "place", "map", "location_on", "travel_explore", "flight", "local_shipping", "route", "directions", "settings", "tune", "build", "construction", "handyman", "code", "terminal", "data_object", "api", "bug_report", "database", "storage", "cloud", "backup", "sync", "folder_zip", "upload_file", "download", "attach_file", "link", "lock", "lock_open", "shield", "verified_user", "key", "admin_panel_settings", "policy", "gavel", "fingerprint", "visibility", "palette", "format_paint", "image", "photo_library", "collections", "movie", "play_circle", "mic", "headphones", "brush"], 'words', {
  value: ICON_CHOICE_WORDS,
  enumerable: false
})); // Core publishes the list; a component bundle that carries its own copy reuses
// the published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  globalThis.SF.icons = globalThis.SF.icons || {};
  if (!globalThis.SF.icons.choices) globalThis.SF.icons.choices = ICON_CHOICES;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ICON_CHOICES);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "c11c730f061a"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DATE_FUTURE_PERIODS: () => (/* binding */ DATE_FUTURE_PERIODS),
/* harmony export */   DATE_PERIODS: () => (/* binding */ DATE_PERIODS),
/* harmony export */   LEGACY_DATE_OPERATORS: () => (/* binding */ LEGACY_DATE_OPERATORS),
/* harmony export */   LEGACY_DATE_OPERATORS_UNTIL: () => (/* binding */ LEGACY_DATE_OPERATORS_UNTIL),
/* harmony export */   buildFilterRequest: () => (/* binding */ buildFilterRequest),
/* harmony export */   dateConditionLabel: () => (/* binding */ dateConditionLabel),
/* harmony export */   dateConditionOf: () => (/* binding */ dateConditionOf),
/* harmony export */   dateConditionPhrase: () => (/* binding */ dateConditionPhrase),
/* harmony export */   dateConditionValue: () => (/* binding */ dateConditionValue),
/* harmony export */   dateFilterChipText: () => (/* binding */ dateFilterChipText),
/* harmony export */   dateFilterConditions: () => (/* binding */ dateFilterConditions),
/* harmony export */   dateFilterKind: () => (/* binding */ dateFilterKind),
/* harmony export */   dateGroupLabel: () => (/* binding */ dateGroupLabel),
/* harmony export */   filterRequestContext: () => (/* binding */ filterRequestContext),
/* harmony export */   isEmptyFilterEntry: () => (/* binding */ isEmptyFilterEntry),
/* harmony export */   normalizeFilterEntry: () => (/* binding */ normalizeFilterEntry),
/* harmony export */   resolveDatePeriod: () => (/* binding */ resolveDatePeriod)
/* harmony export */ });
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _input_date_js_locale_calendar_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("c4779e51fee1");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("354525e80715");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__);
// The date filter's conditions, its server contract and its words (owner
// decision C293, 2026-11-17; study ui-control
// prototypes/date-filter-conditions-study.html, notes
// control/research/2026-11-17-date-filter/README.md).
//
// A field holds one date (a date, or a date and time) or a period (a start and
// an end). The filter is a condition first and then exactly what the condition
// needs: nothing, one day, two days, a number of days, or -- for a period
// field -- a period by name or two days. One condition per field travels to the
// server as {operator, value}:
//
//   one date    eq, lt, gt, gte, lte          value: "yyyy-mm-dd"
//               between                       value: ["yyyy-mm-dd", "yyyy-mm-dd"], both days in
//               period                        value: a period's name (DATE_PERIODS)
//               last-days, next-days          value: a whole number of days, today counted
//   a period    overlaps, within, starts, ends   value: a period's name or two days
//               contains                      value: "yyyy-mm-dd"
//   both        empty, not-empty              value: true
//
// The request carries the context the server resolves the periods in,
// {timeZone, weekStart} (weekStart 0 Sunday .. 6 Saturday, as Date#getDay
// counts): «this week» is the server's to work out, by name, so a saved view
// stays «this week» and the browser's clock is not trusted. A date and time is
// compared by its day in that time zone.
//
// The operators today, week and month (fix/date-pd) are read as the periods
// today, this-week and this-month until 2027-01-01 (contracts/changes/journal.json
// value-date-filter-period-operators).
//
// No DOM here and no Lit: the table, a record view and a server-side test read
// the same rules.




const SET_NAME = 'sf-field-renderers'; // Whole calendar periods (this week is Monday to Sunday where the week starts
// on Monday, this month to its last day, this year to 31 December) and the
// rolling «last 7 days», today and the six days before it.

const DATE_PERIODS = Object.freeze(['today', 'yesterday', 'this-week', 'last-week', 'last-7-days', 'this-month', 'last-month', 'this-year']); // A deadline field (filter.future: true) also looks forward. «Overdue» is not
// a date condition: it depends on the record's status.

const DATE_FUTURE_PERIODS = Object.freeze(['tomorrow', 'next-week', 'next-month']);
const LEGACY_DATE_OPERATORS = Object.freeze({
  today: 'today',
  week: 'this-week',
  month: 'this-month'
});
const LEGACY_DATE_OPERATORS_UNTIL = '2027-01-01'; // What a condition needs: none | day | days | count | when (a period's name or
// two days).

const DAY_OPERATORS = ['eq', 'lt', 'gt', 'gte', 'lte'];
const PERIOD_FIELD_OPERATORS = ['overlaps', 'within', 'starts', 'ends'];

function condition(operator, need, group, period = '') {
  return Object.freeze({
    key: period ? `period:${period}` : operator,
    operator,
    need,
    group,
    ...(period ? {
      period
    } : {})
  });
}

function singleConditions(future) {
  return [condition('eq', 'day', 'date'), condition('between', 'days', 'date'), condition('lt', 'day', 'date'), condition('gt', 'day', 'date'), condition('gte', 'day', 'date'), condition('lte', 'day', 'date'), ...DATE_PERIODS.map(name => condition('period', 'none', 'period', name)), condition('last-days', 'count', 'period'), ...(future ? [condition('period', 'none', 'period', 'tomorrow'), condition('period', 'none', 'period', 'next-week'), condition('next-days', 'count', 'period'), condition('period', 'none', 'period', 'next-month')] : []), condition('empty', 'none', 'filled'), condition('not-empty', 'none', 'filled')];
}

function periodFieldConditions() {
  return [...PERIOD_FIELD_OPERATORS.map(operator => condition(operator, 'when', 'range')), condition('contains', 'day', 'range'), condition('empty', 'none', 'filled'), condition('not-empty', 'none', 'filled')];
} // A field is a period when it says so: its property type or control is
// `period`, or its filter's kind is. Every other date field holds one date.


function dateFilterKind(field = {}) {
  const asked = [field.filter?.kind, field.filter?.control, field.propertyType, field.type];
  return asked.includes('period') ? 'period' : 'date';
}

function isDueField(field = {}) {
  return field.filter?.future === true || field.future === true;
} // The conditions the field's filter offers, in the order of the list. A host's
// filter.operators narrows them: an operator it names stays, `period` keeps
// every period, and the old today, week and month keep every period and «last
// N days» (they were the list's periods).


function dateFilterConditions(field = {}) {
  const all = dateFilterKind(field) === 'period' ? periodFieldConditions() : singleConditions(isDueField(field));
  const asked = field.filter?.operators;
  if (!Array.isArray(asked) || !asked.length) return all;
  const names = new Set();

  for (const operator of asked) {
    const name = String(operator);

    if (LEGACY_DATE_OPERATORS[name]) {
      names.add('period');
      names.add('last-days');
      names.add('next-days');
    } else names.add(name);
  }

  const kept = all.filter(one => names.has(one.operator));
  return kept.length ? kept : all;
}

function isDay(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/u.test(value);
}

function dayOf(value) {
  if (typeof value !== 'string') return '';
  const day = value.slice(0, 10);
  return isDay(day) ? day : '';
}

function isTwoDays(value) {
  return Array.isArray(value) && value.length === 2 && isDay(dayOf(value[0])) && isDay(dayOf(value[1]));
}

function isPeriodName(value) {
  return typeof value === 'string' && (DATE_PERIODS.includes(value) || DATE_FUTURE_PERIODS.includes(value));
}

function isCount(value) {
  const number = Number(value);
  return value !== '' && value !== null && value !== true && Number.isInteger(number) && number > 0;
} // The old operators as the new periods, noted once per page in
// SF.deprecations until LEGACY_DATE_OPERATORS_UNTIL.


function normalizeFilterEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return entry;
  const period = LEGACY_DATE_OPERATORS[entry.operator];
  if (!period) return entry;
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_1__.noteDeprecated)({
    component: SET_NAME,
    kind: 'value',
    attribute: 'filter operator',
    from: entry.operator,
    to: `period ${period}`,
    since: '2026-11-17',
    remove_after: LEGACY_DATE_OPERATORS_UNTIL
  });
  return { ...entry,
    operator: 'period',
    value: period
  };
}

function isBlank(value) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.every(isBlank);
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'object') return Object.values(value).every(isBlank);
  return false;
} // Whether a filter entry says nothing yet, so the table drops it with its
// chip. It reads the operator (DF-1): a period, «empty» and «not empty» are
// whole by themselves, and a condition that needs a day is empty without one.
// An entry of any other field keeps the old reading: empty when its value or
// values are.


function isEmptyFilterEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return isBlank(entry);
  const one = LEGACY_DATE_OPERATORS[entry.operator] ? normalizeFilterEntry(entry) : entry;
  const {
    operator,
    value
  } = one;

  switch (operator) {
    case 'empty':
    case 'not-empty':
      return false;

    case 'period':
      return !isPeriodName(value);

    case 'last-days':
    case 'next-days':
      return !isCount(value);

    case 'overlaps':
    case 'within':
    case 'starts':
    case 'ends':
      return !(isPeriodName(value) || isTwoDays(value));

    default:
      break;
  }

  if (Object.prototype.hasOwnProperty.call(one, 'values')) return isBlank(one.values);
  if (Object.prototype.hasOwnProperty.call(one, 'value')) return isBlank(one.value);
  return Object.entries(one).filter(([key]) => !['operator', 'control', 'type'].includes(key)).every(([, item]) => isBlank(item));
} // The value a condition starts with when it is chosen: the stale day of the
// condition before is not carried into a period (DF-2), but a day stays a day
// and two days stay two days.

function dateConditionValue(next, previous = {}) {
  const before = previous?.value;

  switch (next.need) {
    case 'none':
      return next.period || true;

    case 'day':
      return isDay(dayOf(before)) ? dayOf(before) : null;

    case 'days':
      return isTwoDays(before) ? before.map(dayOf) : null;

    case 'count':
      return isCount(before) ? Number(before) : 30;

    case 'when':
      return isPeriodName(before) || isTwoDays(before) ? before : 'this-week';

    default:
      return null;
  }
} // The condition an entry stands for, in the field's list.

function dateConditionOf(field, entry) {
  const list = dateFilterConditions(field);
  const one = normalizeFilterEntry(entry || {});
  if (one?.operator === 'period') return list.find(item => item.period === one.value) ?? null;
  return list.find(item => item.operator === one?.operator) ?? null;
} // The context a request carries: the time zone and the first day of the week
// the server resolves the periods in. A host that knows the person's own
// (monday.com takes them from the profile) passes them; otherwise the
// browser's zone and the page language's week.

function filterRequestContext(node = null, {
  timeZone,
  weekStart
} = {}) {
  let zone = typeof timeZone === 'string' && timeZone ? timeZone : '';

  if (!zone) {
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      zone = 'UTC';
    }
  }

  const start = Number.isInteger(weekStart) && weekStart >= 0 && weekStart <= 7 ? weekStart % 7 : (0,_input_date_js_locale_calendar_js__WEBPACK_IMPORTED_MODULE_2__.localeWeekStart)((0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node));
  return {
    timeZone: zone,
    weekStart: start
  };
} // A filter's values as the server is asked for them: the old operators read as
// periods, empty entries left out, and the context beside them.

function buildFilterRequest(values = {}, {
  node = null,
  context
} = {}) {
  const out = {};

  for (const [key, entry] of Object.entries(values || {})) {
    if (isEmptyFilterEntry(entry)) continue;
    out[key] = normalizeFilterEntry(entry);
  }

  return {
    values: out,
    context: filterRequestContext(node, context || {})
  };
} // A period's first and last day for a given today, as the server is asked to
// resolve it (a reference for a host's server and for the tests). `today` is
// yyyy-mm-dd in the request's time zone.

function resolveDatePeriod(name, {
  today,
  weekStart = 1
} = {}) {
  if (!isDay(today)) return null;
  const [y, m, d] = today.split('-').map(Number);

  const at = (year, month, day) => {
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString().slice(0, 10);
  };

  const shift = days => at(y, m, d + days);

  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const back = (dow - weekStart % 7 + 7) % 7;

  switch (name) {
    case 'today':
      return [today, today];

    case 'yesterday':
      return [shift(-1), shift(-1)];

    case 'tomorrow':
      return [shift(1), shift(1)];

    case 'this-week':
      return [shift(-back), shift(6 - back)];

    case 'last-week':
      return [shift(-back - 7), shift(-back - 1)];

    case 'next-week':
      return [shift(7 - back), shift(13 - back)];

    case 'last-7-days':
      return [shift(-6), today];

    case 'this-month':
      return [at(y, m, 1), at(y, m + 1, 0)];

    case 'last-month':
      return [at(y, m - 1, 1), at(y, m, 0)];

    case 'next-month':
      return [at(y, m + 1, 1), at(y, m + 2, 0)];

    case 'this-year':
      return [at(y, 1, 1), at(y, 12, 31)];

    default:
      return null;
  }
} // ---- Words ----

const camel = text => String(text).replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase());

function word(node, key, vars, count) {
  return (0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageWord)(_lang_index_mjs__WEBPACK_IMPORTED_MODULE_3__["default"], key, node, {
    component: SET_NAME,
    vars,
    count
  });
} // A condition's name in the list: «Точная дата», «Прошлый месяц», «Пусто».


function dateConditionLabel(node, item) {
  if (!item) return '';
  if (item.period) return word(node, `datePeriod_${camel(item.period)}`);
  return word(node, `dateCondition_${camel(item.operator)}`);
}
function dateGroupLabel(node, group) {
  return word(node, `dateGroup_${group}`);
}

function currentYear(timeZone) {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric'
    }).format(new Date());
  } catch {
    return String(new Date().getFullYear());
  }
}

function dayDate(day) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
} // A day as the chip says it: «17 ноября», «20 января 2025» -- the year only when
// it is not this year.


function dayText(node, day, timeZone) {
  if (!isDay(day)) return '…';
  const withYear = day.slice(0, 4) !== currentYear(timeZone);

  try {
    return new Intl.DateTimeFormat((0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node), {
      day: 'numeric',
      month: 'long',
      ...(withYear ? {
        year: 'numeric'
      } : {}),
      timeZone: 'UTC'
    }).format(dayDate(day));
  } catch {
    return day;
  }
} // Two days as one span: «1–15 ноября», «28 октября – 3 ноября».


function spanText(node, from, to, timeZone) {
  const a = dayOf(from);
  const b = dayOf(to);
  if (!isDay(a) || !isDay(b)) return dayText(node, a || b, timeZone);
  if (a === b) return dayText(node, a, timeZone);
  const year = currentYear(timeZone);
  const withYear = a.slice(0, 4) !== year || b.slice(0, 4) !== year;

  try {
    const format = new Intl.DateTimeFormat((0,_core_js_page_language_js__WEBPACK_IMPORTED_MODULE_0__.pageLocale)(node), {
      day: 'numeric',
      month: 'long',
      ...(withYear ? {
        year: 'numeric'
      } : {}),
      timeZone: 'UTC'
    });
    return format.formatRange(dayDate(a), dayDate(b));
  } catch {
    return `${dayText(node, a, timeZone)} – ${dayText(node, b, timeZone)}`;
  }
}

function periodPhrase(node, name) {
  return word(node, `datePeriodIn_${camel(name)}`);
} // What a condition says after the field's name on its chip: «в прошлом
// месяце», «не позже 17 ноября», «идёт на этой неделе», «пусто» (DF-4).


function dateConditionPhrase(field, entry, node = null, {
  timeZone
} = {}) {
  const one = normalizeFilterEntry(entry || {});
  const zone = timeZone || filterRequestContext(node).timeZone;
  const {
    operator,
    value
  } = one || {};

  const when = () => isPeriodName(value) ? periodPhrase(node, value) : isTwoDays(value) ? spanText(node, value[0], value[1], zone) : '…';

  switch (operator) {
    case 'eq':
      return dayText(node, dayOf(value), zone);

    case 'between':
      return Array.isArray(value) ? spanText(node, value[0], value[1], zone) : '…';

    case 'lt':
    case 'gt':
    case 'gte':
    case 'lte':
      return word(node, `dateChip_${operator}`, {
        date: dayText(node, dayOf(value), zone)
      });

    case 'period':
      return isPeriodName(value) ? periodPhrase(node, value) : '…';

    case 'last-days':
    case 'next-days':
      return word(node, `dateChip_${camel(operator)}`, undefined, isCount(value) ? Number(value) : 0);

    case 'empty':
    case 'not-empty':
      return word(node, `dateChip_${camel(operator)}`);

    case 'overlaps':
    case 'starts':
    case 'ends':
      return word(node, `dateChip_${operator}`, {
        when: when()
      });

    case 'within':
      return isPeriodName(value) ? word(node, 'dateChip_within', {
        when: when()
      }) : word(node, 'dateChip_withinDays', {
        when: when()
      });

    case 'contains':
      return word(node, 'dateChip_contains', {
        date: dayText(node, dayOf(value), zone)
      });

    default:
      return '';
  }
} // The chip of a date filter: «Дата оплаты: в прошлом месяце». A condition the
// set does not know keeps the field's name alone.

function dateFilterChipText(field = {}, entry, node = null, options = {}) {
  const name = String(field.label ?? field.key ?? '');
  const phrase = dateConditionPhrase(field, entry, node, options);
  return phrase ? word(node, 'dateChip', {
    field: name,
    condition: phrase
  }) : name;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

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
/* harmony export */   CURRENCY_DISPLAYS: () => (/* binding */ CURRENCY_DISPLAYS),
/* harmony export */   addDecimal: () => (/* binding */ addDecimal),
/* harmony export */   compareDecimal: () => (/* binding */ compareDecimal),
/* harmony export */   currencyCodes: () => (/* binding */ currencyCodes),
/* harmony export */   currencyDisplayOf: () => (/* binding */ currencyDisplayOf),
/* harmony export */   currencyOf: () => (/* binding */ currencyOf),
/* harmony export */   editableDecimal: () => (/* binding */ editableDecimal),
/* harmony export */   formatDecimal: () => (/* binding */ formatDecimal),
/* harmony export */   formatMoney: () => (/* binding */ formatMoney),
/* harmony export */   formatPercent: () => (/* binding */ formatPercent),
/* harmony export */   fractionDigits: () => (/* binding */ fractionDigits),
/* harmony export */   isRtlLocale: () => (/* binding */ isRtlLocale),
/* harmony export */   minorUnits: () => (/* binding */ minorUnits),
/* harmony export */   moneyParts: () => (/* binding */ moneyParts),
/* harmony export */   moneyTotals: () => (/* binding */ moneyTotals),
/* harmony export */   readDecimal: () => (/* binding */ readDecimal),
/* harmony export */   readTypedDecimal: () => (/* binding */ readTypedDecimal),
/* harmony export */   restingDecimal: () => (/* binding */ restingDecimal)
/* harmony export */ });
/* harmony import */ var _core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("15b4e93ff6ed");
/* harmony import */ var _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c9ce0852ac73");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__]);
([_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__, _core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
// Decimal numbers as strings, never as floats (simai.property-view-port
// 1.18.0; Larena property types standard, notes of 2026-11-03: «Never a float
// on the wire»). What a person typed is read into a canonical decimal string,
// and a decimal, a money amount and a percent are shown in the page's language
// through Intl, which formats a string by its digits: «1500.10» never passes
// through a float on the way to «1 500,10 ₽». Pure, so the unit suite reads it
// without a browser. Money and percent are the Framework's in every mode
// (owner decision C291 (2)) and their display, paste and totals follow owner
// decision C294 (2026-11-17, MP-1..MP-12): the standard sign, never the
// narrow one; a minus and nothing else for a negative; the amount and its
// sign never broken apart; a direction mark on a right-to-left page; what a
// person pastes («1 234,50 ₽», «$1,234.50») read as a decimal string. The
// View set's items, compound and ru.requisites call these functions instead
// of keeping a copy.


const TYPED = /^([+-]?)(\d*)(?:[.,](\d*))?$/u; // Spaces a person or a formatter puts between groups of digits: the plain
// space, the no-break space and the narrow no-break space ru-RU writes, and
// the apostrophe some locales group with.

const GROUP_SPACES = /[\s\u00a0\u202f']/gu;
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
// argue with a stored value. Only what reads as a decimal is formatted. A
// float that is not a whole number is rounded to `digits` when they are given
// (a currency's minor units, a percent's six) -- 0.1 + 0.2 roubles are
// «0,30 ₽», never «0,30000000000000004 ₽» (MP-2) -- and the page hears it once
// in the console: the value should have been a decimal string.

const FLOAT_WARNED = new Set();

function warnFloat(kind) {
  if (FLOAT_WARNED.has(kind)) return;
  FLOAT_WARNED.add(kind);
  globalThis.console?.warn?.(`SF.fieldRenderers: a ${kind} value came as a number; send a decimal string ("1500.5"), a float loses digits.`);
}

function decimalOf(value, digits = null, kind = 'number') {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    if (Number.isInteger(value)) return Number.isSafeInteger(value) ? String(value) : BigInt(value).toString();
    if (!Number.isInteger(digits)) return String(value);
    warnFloat(kind);
    return readDecimal(value.toFixed(Math.min(20, digits)).replace(/(\.\d*?)0+$/u, '$1').replace(/\.$/u, '')).value;
  }

  const read = readDecimal(value);
  return read.ok ? read.value : null;
} // Right-to-left languages: a number drawn there starts with the right-to-left
// mark, so a minus, a sign or a «%» never jumps to the other end of the line
// (C294, MP-9). Intl writes the mark for a negative already; the positive
// amount had none.


const RTL_LANGUAGES = new Set(['ar', 'he', 'iw', 'fa', 'ur', 'ps', 'yi', 'dv', 'ckb', 'sd', 'ug']);
const DIRECTION_MARKS = /[\u200e\u200f\u061c\u2066-\u2069]/gu;
function isRtlLocale(locale) {
  return RTL_LANGUAGES.has(String(locale || '').toLowerCase().split(/[-_]/u)[0]);
} // On a right-to-left page a sign that ends in a neutral mark («US$», «CA$»)
// is isolated left to right (U+2066 .. U+2069), or the browser draws «$US»; a
// percent is held left to right as a whole («12.5 %»), as Intl's Arabic
// pattern holds «12.5%» with its marks.

function directed(text, locale, {
  wholeLtr = false
} = {}) {
  if (!text || !isRtlLocale(locale)) return text;
  if (wholeLtr) return `\u200f\u200e${text.replace(DIRECTION_MARKS, '')}\u200e`;
  const glued = text.replace(/[A-Za-z]+[^\sA-Za-z\d\u00a0\u202f\u200e\u200f\u061c\u2066-\u2069.,\u066b\u066c-]+/gu, '\u2066$&\u2069');
  return glued.startsWith('\u200f') ? glued : `\u200f${glued}`;
} // The amount and its sign stay on one line: every plain space Intl leaves
// between them becomes a no-break one (ru, de write U+00A0 already).


const unbroken = text => text.replace(/ /gu, '\u00a0');
/**
 * A decimal string in the locale's digits and groups, with every digit it has
 * and at least `minDigits`: «1 500,5», «1 234 567,5» (the Number type, MP-5;
 * money and percent use the same groups). A float that is not whole keeps at
 * most six digits.
 */


function formatDecimal(value, locale, {
  minDigits = 0
} = {}) {
  const decimal = decimalOf(value, 6);
  if (decimal === null) return '';
  const digits = Math.min(20, Math.max(minDigits, fractionDigits(decimal)));
  return directed(unbroken((0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(decimal)), locale);
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
} // How a field names its currency (C294, q-mp-sign): Intl's standard sign
// (`symbol`, the default) -- «₽» on a Russian page, «$» for the US dollar on an
// English one and «CA$» for the Canadian dollar, so two currencies never read
// the same -- or the code (`code`, for accounting and exports) or the name
// (`name`). The narrow sign wrote USD, CAD and AUD all as «$» (MP-3): a field
// asking for it gets the standard sign.

const CURRENCY_DISPLAYS = Object.freeze(['symbol', 'code', 'name']);
function currencyDisplayOf(field = {}) {
  return CURRENCY_DISPLAYS.includes(field?.currencyDisplay) ? field.currencyDisplay : 'symbol';
}
/** ISO 4217 minor units of a currency (RUB 2, JPY 0, KWD 3); 2 for a code Intl does not know. */

function minorUnits(currency) {
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency
    }).resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    return 2;
  }
}
/**
 * An amount with its currency, as a person reads it: «1 500,50 ₽», «$1,500.50»,
 * «CA$10.00» (C294). The digits after the point are at least the currency's
 * minor units (ISO 4217) and every digit the amount has; a float is rounded
 * to the minor units, with one console warning. A negative amount has the
 * minus where the language writes it and nothing else -- no colour, no
 * brackets (q-mp-negative). The amount and the sign never break apart, and a
 * right-to-left page gets the direction mark. Without a currency, the amount
 * alone.
 */

function formatMoney(value, field = {}, locale = 'en') {
  const {
    amount,
    currency
  } = moneyParts(value, field.currency);
  const minor = currency ? minorUnits(currency) : 2;
  const decimal = decimalOf(amount, minor, 'money');
  if (decimal === null) return '';
  if (!currency) return formatDecimal(decimal, locale);
  const digits = Math.min(20, Math.max(minor, fractionDigits(decimal)));
  return directed(unbroken((0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    style: 'currency',
    currency,
    currencyDisplay: currencyDisplayOf(field),
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(decimal)), locale);
}
/**
 * A percent, «12,5 %» and «12.5 %»: the value is the percent ("20" is 20 %),
 * never the share -- the share is SF.format's word `share` (MP-4). One
 * spelling in every language (C203 (3)): the number, a no-break space, «%».
 * A float keeps at most six digits, with one console warning.
 */

function formatPercent(value, locale = 'en') {
  const decimal = decimalOf(value, 6, 'percent');
  if (decimal === null) return '';
  const digits = Math.min(20, fractionDigits(decimal));
  return directed((0,_core_js_format_number_js__WEBPACK_IMPORTED_MODULE_1__.percentSign)((0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    style: 'unit',
    unit: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(decimal)), locale, {
    wholeLtr: true
  });
}
/** The sum of decimal strings, by their digits (a column total): "1500.5" + "0.75" is "1501.25"; null when one is not a decimal. */

function addDecimal(...values) {
  let scale = 0;
  const read = [];

  for (const value of values.flat()) {
    if (value === null || value === undefined || value === '') continue;
    const one = decimalOf(value, 20);
    if (one === null) return null;
    read.push(one);
    scale = Math.max(scale, fractionDigits(one));
  }

  let total = 0n;

  for (const one of read) {
    const negative = one.startsWith('-');
    const [whole, fraction = ''] = one.replace('-', '').split('.');
    const units = BigInt(whole + fraction.padEnd(scale, '0'));
    total += negative ? -units : units;
  }

  const negative = total < 0n;
  const digits = (negative ? -total : total).toString().padStart(scale + 1, '0');
  const whole = digits.slice(0, digits.length - scale) || '0';
  const fraction = scale ? digits.slice(-scale).replace(/0+$/u, '') : '';
  const zero = /^0*$/u.test(whole + fraction);
  return `${negative && !zero ? '-' : ''}${whole}${fraction ? `.${fraction}` : ''}`;
}
/**
 * A money column's total (C294): the amounts added by their digits, one sum
 * per currency, in the order the currencies first appear -- a column of
 * dollars and euros is two sums, never one. [{currency, amount, text}];
 * values that are not money are left out.
 */

function moneyTotals(values = [], field = {}, locale = 'en') {
  const sums = new Map();

  for (const value of values) {
    const {
      amount,
      currency
    } = moneyParts(value, field.currency);
    const decimal = decimalOf(amount, currency ? minorUnits(currency) : null);
    if (decimal === null) continue;
    const key = currency ?? '';
    sums.set(key, addDecimal(sums.get(key) ?? '0', decimal));
  }

  return [...sums].map(([currency, amount]) => ({
    currency: currency || null,
    amount,
    text: formatMoney(currency ? {
      amount,
      currency
    } : amount, {
      currencyDisplay: field.currencyDisplay
    }, locale)
  }));
} // What a person pastes or types, read as a decimal (C294, MP-8). Arabic-Indic
// digits and separators are read as ASCII; the currency's signs and code,
// «%», spaces, apostrophes and direction marks are dropped; a minus may stand
// before or after the digits. With both a point and a comma the last one
// separates the fraction; a separator that repeats groups; a single one is
// the fraction, unless it is the page's group separator followed by exactly
// three digits -- «1,234» on an English page is 1234, on a Russian one 1,234.

const CURRENCY_MARKS = /[$€£¥₽₸₴₺₹₩₪₦₱฿₫¤]/gu;

function signsOf(currency, locale) {
  if (typeof currency !== 'string' || !/^[A-Z]{3}$/u.test(currency)) return [];
  const signs = new Set([currency]);

  for (const display of ['symbol', 'narrowSymbol', 'code', 'name']) {
    try {
      for (const part of new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: display
      }).formatToParts(2)) {
        if (part.type === 'currency') signs.add(part.value);
      }
    } catch {// A code Intl does not know keeps its letters only.
    }
  }

  return [...signs].sort((a, b) => b.length - a.length);
}

function separatorsOf(locale) {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(1234567.5);
    return {
      group: parts.find(part => part.type === 'group')?.value ?? ',',
      decimal: parts.find(part => part.type === 'decimal')?.value ?? '.'
    };
  } catch {
    return {
      group: ',',
      decimal: '.'
    };
  }
}
/**
 * `{ok: true, value, typedDigits}` for what reads as a number -- the canonical
 * decimal string (no groups, a point, no trailing zeros after it; null for
 * nothing typed) and how many digits were typed after the separator -- or
 * `{ok: false}`. `currency` names the code whose signs may stand in the text.
 */


function readTypedDecimal(text, {
  locale = 'en',
  currency = null
} = {}) {
  if (text === null || text === undefined) return {
    ok: true,
    value: null,
    typedDigits: 0
  };

  if (typeof text === 'number') {
    const read = readDecimal(Number.isInteger(text) ? text : String(text));
    return read.ok ? {
      ok: true,
      value: read.value,
      typedDigits: fractionDigits(read.value ?? '')
    } : {
      ok: false
    };
  }

  let plain = String(text).replace(/[\u0660-\u0669]/gu, digit => String(digit.charCodeAt(0) - 0x660)).replace(/[\u06f0-\u06f9]/gu, digit => String(digit.charCodeAt(0) - 0x6f0)).replace(/\u066b/gu, '.').replace(/\u066c/gu, '');

  for (const sign of signsOf(currency, locale)) plain = plain.split(sign).join('');

  plain = plain.replace(CURRENCY_MARKS, '').replace(/[%\u066a]/gu, '').replace(DIRECTION_MARKS, '').replace(/[\s\u00a0\u202f'\u2019]/gu, '').replace(/[\u2212\u2013]/gu, '-');
  if (plain === '') return {
    ok: true,
    value: null,
    typedDigits: 0
  };
  let negative = false;

  if (plain.startsWith('-')) {
    negative = true;
    plain = plain.slice(1);
  } else if (plain.startsWith('+')) {
    plain = plain.slice(1);
  } else if (plain.endsWith('-')) {
    negative = true;
    plain = plain.slice(0, -1);
  }

  const dots = (plain.match(/\./gu) || []).length;
  const commas = (plain.match(/,/gu) || []).length;

  if (dots && commas) {
    const mark = plain.charAt(Math.max(plain.lastIndexOf('.'), plain.lastIndexOf(',')));
    plain = plain.split(mark === '.' ? ',' : '.').join('');
    if (mark === ',') plain = plain.replace(',', '.');
  } else if (dots + commas > 1) {
    plain = plain.split(dots ? '.' : ',').join('');
  } else if (dots + commas === 1) {
    const mark = dots ? '.' : ',';
    const after = plain.length - plain.indexOf(mark) - 1;
    if (mark === separatorsOf(locale).group && after === 3) plain = plain.replace(mark, '');else plain = plain.replace(',', '.');
  }

  if (!/^\d*(?:\.\d*)?$/u.test(plain) || !/\d/u.test(plain)) return {
    ok: false
  };
  const [whole = '', fraction = ''] = plain.split('.');
  const integer = whole.replace(/^0+(?=\d)/u, '') || '0';
  const digits = fraction.replace(/0+$/u, '');
  const zero = /^0*$/u.test(integer + digits);
  return {
    ok: true,
    value: `${negative && !zero ? '-' : ''}${integer}${digits ? `.${digits}` : ''}`,
    typedDigits: fraction.length
  };
}
/** A decimal at rest in an edit field: the locale's groups and point, at least `minDigits` after it, no sign («1 500,50»). */

function restingDecimal(value, locale = 'en', minDigits = 0) {
  const read = readDecimal(value);
  if (!read.ok || read.value === null) return '';
  const digits = Math.min(20, Math.max(minDigits, fractionDigits(read.value)));
  return unbroken((0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(read.value));
}
/** Every ISO 4217 code the browser knows, for a currency field that names no list; the ten offered codes where Intl cannot list them. */

function currencyCodes(fallback = []) {
  try {
    const codes = Intl.supportedValuesOf?.('currency');
    if (Array.isArray(codes) && codes.length) return codes;
  } catch {// An older engine: the offered list.
  }

  return [...fallback];
} // What the editors of money and percent need (owner decision C291 (2): the two
// types are the Framework's in every mode, the View set's editors were the
// reference): the sign and minor units of a currency, two decimals compared by
// their digits, and a decimal as it is typed back in an input.

/**
 * A currency in a locale: {sign, before, minor} -- the sign the locale writes
 * by the field's `currencyDisplay` (the standard sign by default: «₽», «$»,
 * «CA$»; C294), whether it stands before the amount, and its ISO 4217 minor
 * units (RUB 2, JPY 0, KWD 3). A code Intl does not know keeps its letters,
 * after the amount, with two minor digits.
 */

function currencyOf(code, locale = 'en', display = 'symbol') {
  const fallback = {
    sign: String(code ?? ''),
    before: false,
    minor: 2
  };
  if (typeof code !== 'string' || !/^[A-Z]{3}$/u.test(code)) return fallback;

  try {
    const format = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      currencyDisplay: CURRENCY_DISPLAYS.includes(display) ? display : 'symbol'
    });
    const parts = format.formatToParts(1);
    const at = parts.findIndex(part => part.type === 'currency');
    if (at === -1) return fallback;
    return {
      sign: parts[at].value,
      before: at < parts.findIndex(part => part.type === 'integer'),
      minor: format.resolvedOptions().maximumFractionDigits ?? 2
    };
  } catch {
    return fallback;
  }
}
/** -1, 0 or 1: two decimals (canonical strings or integers) compared by their digits, never as floats; null when either is not a decimal. */

function compareDecimal(a, b) {
  const left = readDecimal(a);
  const right = readDecimal(b);
  if (!left.ok || !right.ok || left.value === null || right.value === null) return null;
  const scale = Math.max(fractionDigits(left.value), fractionDigits(right.value));

  const units = value => {
    const negative = value.startsWith('-');
    const [whole, fraction = ''] = value.replace('-', '').split('.');
    const digits = BigInt(whole + fraction.padEnd(scale, '0'));
    return negative ? -digits : digits;
  };

  const x = units(left.value);
  const y = units(right.value);
  return x === y ? 0 : x < y ? -1 : 1;
}
/** A decimal as typed back into an input: the locale's point, no groups («1500,5» on a Russian page); '' for nothing or not a decimal. */

function editableDecimal(value, locale = 'en') {
  const read = readDecimal(value);
  if (!read.ok || read.value === null) return '';
  let point = '.';

  try {
    point = (0,_core_js_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('NumberFormat', locale, {}).formatToParts(1.5).find(part => part.type === 'decimal')?.value || '.';
  } catch {
    point = '.';
  }

  return read.value.replace('.', point);
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
/* harmony export */   DATE_FUTURE_PERIODS: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.DATE_FUTURE_PERIODS),
/* harmony export */   DATE_PERIODS: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.DATE_PERIODS),
/* harmony export */   FILTER_RENDERERS: () => (/* binding */ FILTER_RENDERERS),
/* harmony export */   NUMBER_FILTER_OPERATORS: () => (/* binding */ NUMBER_FILTER_OPERATORS),
/* harmony export */   PROPERTY_TYPES: () => (/* reexport safe */ _registry_js__WEBPACK_IMPORTED_MODULE_5__.PROPERTY_TYPES),
/* harmony export */   buildFilterRequest: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.buildFilterRequest),
/* harmony export */   dateFilterChipText: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateFilterChipText),
/* harmony export */   dateFilterConditions: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateFilterConditions),
/* harmony export */   dateTimeAttribute: () => (/* binding */ dateTimeAttribute),
/* harmony export */   filterRequestContext: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.filterRequestContext),
/* harmony export */   isEmptyFilterEntry: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.isEmptyFilterEntry),
/* harmony export */   isNumericType: () => (/* binding */ isNumericType),
/* harmony export */   normalizeFilterEntry: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.normalizeFilterEntry),
/* harmony export */   propertyModes: () => (/* binding */ propertyModes),
/* harmony export */   renderCellField: () => (/* binding */ renderCellField),
/* harmony export */   renderEditField: () => (/* binding */ renderEditField),
/* harmony export */   renderFilterField: () => (/* binding */ renderFilterField),
/* harmony export */   renderTotalField: () => (/* binding */ renderTotalField),
/* harmony export */   renderViewField: () => (/* binding */ renderViewField),
/* harmony export */   resolveDatePeriod: () => (/* reexport safe */ _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.resolveDatePeriod)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("073f05ff1a81");
/* harmony import */ var _helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("b30ec5bc0edb");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("e577837dd70a");
/* harmony import */ var _registry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("fc654eb7fab0");
/* harmony import */ var _datetime_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("9ce1a42b2a85");
/* harmony import */ var _mask_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("dd6973f77245");
/* harmony import */ var _html_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("01ae054f01b4");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _decimal_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("ab3947ea3647");
/* harmony import */ var _phone_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("25be1c2df717");
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("354525e80715");
/* harmony import */ var _date_filter_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("c11c730f061a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9__, _decimal_js__WEBPACK_IMPORTED_MODULE_10__, _date_filter_js__WEBPACK_IMPORTED_MODULE_13__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_4__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9__, _decimal_js__WEBPACK_IMPORTED_MODULE_10__, _date_filter_js__WEBPACK_IMPORTED_MODULE_13__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9__);











 // The set's words and the property types' names live in its language files
// (localization study LC-5), as a Smart component keeps them.


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
                    appearance="bordered"
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
} // The number filter (owner decision C294, MP-6, MP-7; the same order as the
// date filter): the condition comes first and under it exactly what it needs
// -- one number, two («Между», both ends included) or nothing («Пусто», «Не
// пусто», whose value is true). The nine conditions are the ones AG Grid, MUI
// X and spreadsheets agree on; a field's `filter.operators` may name fewer.
// The value is typed with the decimal keyboard and the sign in the field (a
// fixed currency's sign where the language writes it, «%» after a percent),
// pasted text is read as a person means it («1 234,50 ₽», «$1,234.50») and
// the request carries a decimal string, never the typed text. A money field
// whose currency lives in the value adds a currency choice (q-mp-mix): the
// request carries `currency` and compares amounts within it. A new condition
// of another shape drops the old value.


const NUMBER_FILTER_OPERATORS = Object.freeze(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'empty', 'not-empty']);
const NUMBER_NO_VALUE_OPERATORS = new Set(['empty', 'not-empty']);

const operatorShape = operator => NUMBER_NO_VALUE_OPERATORS.has(operator) ? 'none' : operator === 'between' ? 'two' : 'one';

function numberOperatorLabel(host, operator) {
  return NUMBER_FILTER_OPERATORS.includes(operator) ? setText(host, `numberOperator_${operator}`) : host.getFilterOperatorLabel(operator);
}

function renderNumberFilterControl(field, host, look = {}) {
  const control = host.getFilterControlValue(field.key) || {};
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);
  const operators = field.filter?.operators || NUMBER_FILTER_OPERATORS;
  const selectedOperator = control.operator || field.filter?.defaultOperator || operators[0];
  const shape = operatorShape(selectedOperator);
  const rawValue = control.value;
  const rangeValue = Array.isArray(rawValue) ? rawValue : [rawValue ?? '', ''];
  const currencies = look.currencies || null;
  const currency = currencies ? currencies.includes(control.currency) ? control.currency : currencies[0] : look.currency || null;
  const sign = look.money && currency ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.currencyOf)(currency, locale, (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.currencyDisplayOf)(field)) : null;
  const textStart = sign?.before ? sign.sign : '';
  const textEnd = look.percent ? '%' : sign && !sign.before ? sign.sign : '';
  const minDigits = look.money && currency ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.currencyOf)(currency, locale).minor : 0;

  const shown = value => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.restingDecimal)(value, locale, value === '' || value === null || value === undefined ? 0 : minDigits);

  const withCurrency = patch => currencies ? { ...patch,
    currency
  } : patch;

  const patch = next => host.patchTempFilterValue(field.key, withCurrency({
    operator: selectedOperator,
    ...next
  }));

  const typed = (index, event) => {
    const input = event.currentTarget ?? event.target;
    const text = String(input?.value ?? '');
    const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.readTypedDecimal)(text, {
      locale,
      currency
    });

    if (input) {
      input.toggleAttribute('invalid', !read.ok);
      if (read.ok) input.removeAttribute('error-message');else input.setAttribute('error-message', setText(host, 'notNumber'));
    }

    if (!read.ok) return;
    const value = read.value ?? '';

    if (shape !== 'two') {
      patch({
        value
      });
      return;
    }

    const next = [...rangeValue];
    next[index] = value;
    patch({
      value: next
    });
  };

  const input = (index, label, value) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${filterSize(host)}
                appearance="bordered"
                root-class="flex-1 min-w-0"
                label=${label}
                value=${shown(value)}
                inputmode=${look.integer ? 'numeric' : 'decimal'}
                text-start=${textStart || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                text-end=${textEnd || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                name="sf_filter_${field.key || 'number'}${index ? '_second' : ''}"
                @change=${event => typed(index, event)}
        ></sf-input>`;

  const valueWord = setText(host, look.money ? 'filterAmount' : look.percent ? 'filterPercent' : 'filterNumber');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex gap-1/3 flex-col">
            <sf-dropdown
                    size=${filterSize(host)}
                    appearance="bordered"
                    mode="select"
                    label=${setText(host, 'condition')}
                    placeholder=${setText(host, 'condition')}
                    root-class="flex-1"
                    search="false"
                    data-sf-filter-part="operator"
                    @change=${event => {
    if (event.target !== event.currentTarget) return;
    const operator = event.detail?.values?.[0] || event.detail?.value || selectedOperator;
    if (operator === selectedOperator) return;
    const next = operatorShape(operator); // A new condition of another shape drops the old value:
    // one amount and two amounts are not the same question.

    const value = next === 'none' ? true : next === shape ? rawValue : next === 'two' ? ['', ''] : '';
    host.patchTempFilterValue(field.key, withCurrency({
      operator,
      value
    }));
  }}
            >
                ${operators.map(operator => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-list-item
                            kind="text"
                            size=${filterSize(host)}
                            text="${numberOperatorLabel(host, operator)}"
                            value="${operator}"
                            ?selected=${operator === selectedOperator}
                    ></sf-list-item>
                `)}
            </sf-dropdown>
            ${shape === 'none' ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : shape === 'two' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-filter-operator-inputs flex gap-1/3 items-cross-start">
                    ${input(0, setText(host, 'rangeFrom'), rangeValue[0])}
                    ${input(1, setText(host, 'rangeTo'), rangeValue[1])}
                </div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-filter-operator-inputs flex gap-1/3 items-cross-start">
                    ${input(0, valueWord, Array.isArray(rawValue) ? rawValue[0] : rawValue)}
                </div>`}
            ${currencies && shape !== 'none' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-dropdown
                        size=${filterSize(host)}
                        appearance="bordered"
                        mode="select"
                        label=${setText(host, 'currency')}
                        root-class="flex-1"
                        search=${currencies.length > 12 ? 'true' : 'false'}
                        data-sf-filter-part="currency"
                        .options=${currencies.map(code => ({
    type: 'text',
    size: filterSize(host),
    value: code,
    text: code,
    selected: code === currency
  }))}
                        @change=${event => {
    if (event.target !== event.currentTarget) return;
    const code = event.detail?.values?.[0] || event.detail?.value;
    if (!code || code === currency) return;
    host.patchTempFilterValue(field.key, {
      operator: selectedOperator,
      value: rawValue,
      currency: code
    });
  }}
                ></sf-dropdown>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
}

function renderIntegerFilterControl(field, host) {
  return renderNumberFilterControl(field, host, {
    integer: true
  });
} // Money and percent are filtered as numbers with their own sign in the field
// (owner decisions C291 (2), C294): «%» after a percent, a fixed currency's
// sign where the locale writes it. A money field whose currency lives in the
// value chooses the currency in the filter, from the field's `currencies`.


function renderMoneyFilterControl(field, host) {
  const fixed = fixedCurrency(field);
  return renderNumberFilterControl(field, host, {
    money: true,
    currency: fixed,
    currencies: fixed ? null : fieldCurrencies(field)
  });
}

function renderPercentFilterControl(field, host) {
  return renderNumberFilterControl(field, host, {
    percent: true
  });
} // The date filter (owner decision C293, 2026-11-17; it replaces the operator
// words and quick ranges of PD-6/PD-7). A condition first, then exactly what it
// needs: nothing (a period by name, «Пусто», «Не пусто»), one day, two days (a
// range calendar whose quick ranges are the whole periods; pressing one makes
// the condition that period by name), a number of days, or -- for a period
// field -- «when»: a period by name or two days of one's own. The list is
// grouped: Дата, Период, Заполнено (a period field: Период записи,
// Заполнено). Choosing a condition writes its own starting value, so a stale
// day never travels with a period (DF-2); a period, «Пусто» and «Не пусто»
// carry a value of their own, so the table keeps them (DF-1). The rules and
// the words are date-filter.js; this draws them. The day controls keep PD-4,
// PD-5 and PD-8: the table's size, the page's language, the condition above.


function dateFilterPresets(field) {
  const presets = field.filter?.presets;

  if (presets === undefined || presets === null) {
    return [..._date_filter_js__WEBPACK_IMPORTED_MODULE_13__.DATE_PERIODS, ...(field.filter?.future === true ? _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.DATE_FUTURE_PERIODS : [])].join(',');
  }

  return Array.isArray(presets) ? presets : String(presets);
}

function defaultDateCondition(field, list) {
  const asked = field.filter?.defaultOperator;

  if (asked) {
    const one = (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateConditionOf)(field, {
      operator: asked,
      value: _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.LEGACY_DATE_OPERATORS[asked] || asked
    });
    const named = list.find(item => item.key === asked);
    if (named || one) return named || one;
  } // One date: «Между» (the list's second, after the exact day); a period
  // field: «Идёт в».


  return list.find(item => item.operator === ((0,_date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateFilterKind)(field) === 'period' ? 'overlaps' : 'between')) ?? list[0];
}

function dateFilterContext(host) {
  return (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_13__.filterRequestContext)(host ?? null, host?.getFilterContext?.() || {});
}

function renderDateFilterControl(field, host) {
  const control = host.getFilterControlValue(field.key) || {};
  const list = (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateFilterConditions)(field);
  const asked = control.operator ? (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateConditionOf)(field, control) : null;
  const current = asked ?? defaultDateCondition(field, list);
  const value = asked ? (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_13__.normalizeFilterEntry)(control).value : control.value;
  const size = filterSize(host);

  const patch = next => host.patchTempFilterValue(field.key, next);

  const isDateTime = (field.propertyType || field.type) === 'datetime';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex flex-col gap-1/3">
            <sf-dropdown
                    size=${size}
                    appearance="bordered"
                    mode="select"
                    label="${setText(host, 'dateCondition')}"
                    .value=${current.key}
                    hint=${isDateTime ? setWord(host, 'dateByDayIn', {
    zone: dateFilterContext(host).timeZone
  }) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    root-class="flex-1"
                    search="false"
                    @change=${event => {
    const key = event.detail?.values?.[0] || event.detail?.value || current.key;
    const next = list.find(item => item.key === key); // The condition shown before any is chosen is the default;
    // choosing it writes it, with its own starting value.

    if (!next || asked && next.key === current.key) return;
    patch({
      operator: next.operator,
      value: (0,_date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateConditionValue)(next, {
        value
      })
    });
  }}
            >
                ${list.map(item => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-list-item
                            kind="text"
                            size=${size}
                            group=${(0,_date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateGroupLabel)(host, item.group)}
                            text="${(0,_date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateConditionLabel)(host, item)}"
                            value="${item.key}"
                            ?selected=${item.key === current.key}
                    ></sf-list-item>
                `)}
            </sf-dropdown>
            ${renderDateConditionValue(field, host, current, value, patch)}
        </div>
    `;
}

function renderDateConditionValue(field, host, current, value, patch) {
  const size = filterSize(host);
  const name = `sf_filter_${field.key || 'date'}`;
  if (current.need === 'none') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (current.need === 'count') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-input-quantity
                    size=${size}
                    label="${setText(host, current.operator === 'next-days' ? 'dateCountNext' : 'dateCountLast')}"
                    min="1"
                    max="366"
                    unit="${setText(host, 'dateCountUnit')}"
                    name="${name}_count"
                    .value=${Number(value) > 0 ? Number(value) : 30}
                    @change=${event => {
      if (event.target !== event.currentTarget) return;
      const count = Math.round(Number(event.detail?.value));
      patch({
        operator: current.operator,
        value: count > 0 ? count : null
      });
    }}
            ></sf-input-quantity>`;
  }

  if (current.need === 'day') {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-input-date
                    size=${size}
                    label="${setText(host, current.operator === 'contains' ? 'dateValueDay' : 'dateValueDate')}"
                    .value=${typeof value === 'string' ? value.slice(0, 10) : ''}
                    name="${name}"
                    @change=${event => {
      if (event.target !== event.currentTarget) return;
      patch({
        operator: current.operator,
        value: event.detail?.value || null
      });
    }}
            ></sf-input-date>`;
  }

  if (current.need === 'days') return renderDateRangeValue(field, host, current, value, patch); // «when» (a period field): a period by name, or two days of one's own.

  const own = Array.isArray(value);
  const periods = [..._date_filter_js__WEBPACK_IMPORTED_MODULE_13__.DATE_PERIODS, ...(field.filter?.future === true ? _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.DATE_FUTURE_PERIODS : [])];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                size=${size}
                appearance="bordered"
                mode="select"
                label="${setText(host, 'dateWhen')}"
                .value=${own ? 'own' : typeof value === 'string' ? value : ''}
                root-class="flex-1"
                search="false"
                @change=${event => {
    const key = event.detail?.values?.[0] || event.detail?.value;
    if (!key) return;

    if (key === 'own') {
      if (!own) patch({
        operator: current.operator,
        value: ['', '']
      });
      return;
    }

    if (key !== value) patch({
      operator: current.operator,
      value: key
    });
  }}
        >
            ${periods.map(period => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-list-item kind="text" size=${size} text="${(0,_date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateConditionLabel)(host, {
    period
  })}" value="${period}"
                        ?selected=${!own && value === period}></sf-list-item>
            `)}
            <sf-list-item kind="text" size=${size} text="${setText(host, 'dateOwnDays')}" value="own" ?selected=${own}></sf-list-item>
        </sf-dropdown>
        ${own ? renderDateRangeValue(field, host, current, value, patch) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`;
} // Two days on a range calendar. Its quick ranges are the whole periods: one
// pressed is the period by name -- in «Между» the condition becomes that
// period (C293 (4)), in a period field's «when» the value is its name.


function renderDateRangeValue(field, host, current, value, patch) {
  const days = Array.isArray(value) ? value.map(day => typeof day === 'string' ? day.slice(0, 10) : '') : ['', ''];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-date
                size=${filterSize(host)}
                range
                label="${setText(host, 'dateValuePeriod')}"
                .value=${days}
                .presets=${dateFilterPresets(field)}
                name="sf_filter_${field.key || 'date'}"
                @change=${event => {
    if (event.target !== event.currentTarget) return;
    const preset = event.detail?.preset?.id;

    if (preset && (_date_filter_js__WEBPACK_IMPORTED_MODULE_13__.DATE_PERIODS.includes(preset) || _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.DATE_FUTURE_PERIODS.includes(preset))) {
      patch(current.operator === 'between' ? {
        operator: 'period',
        value: preset
      } : {
        operator: current.operator,
        value: preset
      });
      return;
    }

    const next = Array.isArray(event.detail?.value) ? event.detail.value : [event.detail?.startValue || '', event.detail?.endValue || ''];
    patch({
      operator: current.operator,
      value: next
    });
  }}
        ></sf-input-date>`;
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
  integer: renderIntegerFilterControl,
  date: renderDateFilterControl,
  datetime: renderDateFilterControl,
  range: renderRangeFilterControl,
  'date-range': renderDateFilterControl,
  // A period field (a start and an end, C293): its own conditions -- overlaps,
  // within, starts, ends, contains a day.
  period: renderDateFilterControl,
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
  // A money amount and a percent are filtered as decimals with their sign
  // (C291 (2)); an items field, which the View set draws, by its number of
  // rows (property-view port 1.18.0).
  money: renderMoneyFilterControl,
  percent: renderPercentFilterControl,
  items: renderIntegerFilterControl
}; // What a field asks to be filtered by: its own declared control if it has one,
// otherwise its property type, otherwise text.
// The date filter's rules for a host that builds the request or draws the
// chips itself (sf-view-table): the same functions as SF.fieldRenderers.dateFilter.


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

const CELL_LINE = '1/2'; // A choice badge in a cell is tonal (sf-badge's default since 1.6.0, C140; it
// was main, so the cells shipped filled and the consumer's owner asked for the
// calmer one) -- and a table row is the place for it: a column of
// filled badges reads as a column of buttons. A field may still ask for another
// of the three, which is the same arrangement as the boolean's words: the set
// carries a sensible default, not a decision nobody can change.
//
// It composes with colour rather than replacing it. A scheme name reaches the
// scheme's tonal badge; a hue or a hex colour writes the public
// --sf-badge-background-color as the nearest palette hue's fill step (BG-7,
// C140 (2)) and its own text colour, so the tint survives the appearance
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
                  aria-label=${field.label || field.key || ''} readonly></sf-input-color>
    `;
} // Reads what port 1.8.0 declares: `inherited` says a value comes from somewhere
// else, `inheritedValue` says what it is. A view that drew the inherited colour as
// the value would make «not set» and «set to the same colour» look identical, and
// only the first follows the theme when the theme moves. The view and the cell
// draw the field read-only (sf-input-color 1.17.0): the value in the text's ink;
// disabled drew it in the disabled ink, as a field nobody may use.


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
                aria-label=${field.label || field.key || ''}
                readonly
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
                ?readonly=${field.readonly === true}
                aria-label=${field.label || field.key || ''}
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
  date: renderDateCell,
  datetime: renderDateCell,
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
  const text = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatMoney)(scalarValue(value), field, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null));
  return text || null;
}

function renderPercentCell(field, value, host) {
  const formatted = renderHostFormattedCell(field, value, host);
  if (formatted !== null) return formatted;
  const text = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatPercent)(scalarValue(value), (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null));
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
} // A date in a row reads as it does in the record panel: the host's text, else
// the page's reading of the day (simai/ui-source#34); null for a value that is
// not a date, which the table prints as it came.


function renderDateCell(field, value, host) {
  const formatted = renderHostFormattedCell(field, value, host);
  if (formatted !== null) return formatted;
  return defaultDateText(field, value, host);
} // A share of a limit (owner decision C203 (5), IM-8): the `meter` variant of a
// number 0..100 is the inline sf-progress-bar meter -- a 64 track, the number
// «72 %» before it -- named by the field's label. The scale stays for levels
// («4 из 5», C185 (5)). Out of range it is left as text, as the scale is.


function meterProps(field, number) {
  const name = typeof field.label === 'string' ? field.label : field.key || '';
  return {
    inline: true,
    meter: true,
    value: String(number),
    ...(name ? {
      label: name
    } : {})
  };
}

function renderNumericCell(field, value, host) {
  const variant = field.variant || field.filter?.variant;
  const number = Number(scalarValue(value));

  if (variant !== 'scale' && variant !== 'meter' || !Number.isFinite(number)) {
    // The host's text first; else the number in the page's language, as
    // the view prints it («12,5»), where the table printed «12.5».
    const formatted = renderHostFormattedCell(field, value, host);
    if (formatted !== null) return formatted;
    if (carriesText(value)) return value.text || null;
    return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatDecimal)(scalarValue(value), (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null)) || null;
  }

  if (number < 0 || number > 100) return null;
  if (variant === 'meter') return {
    component: {
      type: 'progress-bar',
      props: meterProps(field, number)
    }
  };
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
  return [// The person's name is the avatar's heading: its accessible name and
  // the source of its initials (sf-avatar 1.6.0; avatar study AV-2).
  {
    component: {
      type: 'avatar',
      props: {
        line: CELL_LINE,
        text: value.avatarText || '',
        heading: String(value.label)
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
  return (0,_html_js__WEBPACK_IMPORTED_MODULE_8__.htmlText)(value) || null;
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
// sf-input, sf-textarea, sf-switch, sf-checkbox, sf-dropdown, sf-segmented and
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
  record: renderRecordLookup,
  relation: renderRecordLookup,
  user: renderRecordLookup,
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
  include: renderIncludeEdit,
  money: renderMoneyEdit,
  percent: renderPercentEdit
};

function fieldName(field) {
  return `sf_field_${field.key || 'value'}`;
} // A telephone is a string with a shape, not a type of its own: the Framework
// already has a control that knows country codes, dial prefixes and masks, so a
// `string` whose variant is `phone` gets it and everything else about a string
// stays true. Counted on a running Larena site, which declares one.
//
// What it writes is E.164, `+79161234567` (FL-1): the control's own form value,
// whatever the box shows -- `+7 916 123-45-67` written back changed a stored
// number on every save. It reads E.164 and the formatted strings stored before.
//
// An extension (`;ext=12`) is not the control's to edit: the number goes to
// it alone and the extension is written back after it, so a save keeps it.
//
// The country an empty field starts on (FL-7): `defaultCountry` (ISO 3166
// alpha-2, "RU") where the field names one, else the page's (ru is Russia,
// en-GB Britain; sf-input-country's own rule). A stored number names its own
// country, so the setting is passed only while the field is empty.


function renderPhoneEdit(field, value, host) {
  const {
    number: stored,
    extension
  } = (0,_phone_js__WEBPACK_IMPORTED_MODULE_11__.splitPhone)(scalarValue(value) ?? '');
  const preferred = String(field.defaultCountry ?? '').trim().toUpperCase();
  const iso2 = /^[A-Z]{2}$/u.test(preferred) && !String(stored).trim() ? preferred : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-country
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                value=${stored}
                iso2=${iso2}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?disabled=${field.readonly === true}
                use-mask="true"
                show-code="true"
                @change=${event => host.setFieldValue(field, phoneWritten(event, extension))}
        ></sf-input-country>
    `;
} // The control's form value (E.164; nothing for the dial code alone), or the
// box's text brought to E.164 where the element is not defined yet.


function phoneWritten(event, extension = '') {
  const control = event.currentTarget;
  const number = typeof control?.sfFormValue === 'function' ? control.sfFormValue() ?? '' : (0,_phone_js__WEBPACK_IMPORTED_MODULE_11__.phoneE164)(event.detail?.value ?? event.target?.value ?? '');
  return number && extension ? `${number};ext=${extension}` : number;
}

function isPhoneField(field) {
  return String(field.variant ?? '') === 'phone';
} // A phone shown: the host's text first (formatFieldValue, or {value, text}),
// as for any string; else the number
// laid out by its country, left to right on a right-to-left page too (an
// Arabic page drew the groups in reverse order).


function phoneText(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  if (typeof formatted === 'string') return formatted;
  if (carriesText(value)) return value.text;
  return (0,_phone_js__WEBPACK_IMPORTED_MODULE_11__.formatPhone)(scalarValue(value), setText(host, 'phoneExtension'));
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
// sf-input, no data-*, no text node, no log. The eye that shows the password is
// sf-input's own (C123 (4): a glyph inside the field, the crossed eye after a
// press); the set drew a second one beside the field until the text inputs
// study (TI-7), so a record card showed two.


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
        </span>
    `;
}

function renderStringCell(field, value, host) {
  if (isPhoneField(field)) {
    const text = phoneText(field, value, host);
    return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<bdi dir="ltr">${text}</bdi>` : null;
  }

  return isPasswordField(field) ? passwordState(host, value) : null;
}

function renderStringView(field, value, host) {
  if (isPasswordField(field)) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${passwordState(host, value)}</span>`;

  if (isPhoneField(field)) {
    const text = phoneText(field, value, host);
    return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view"><bdi dir="ltr">${text}</bdi></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

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
} // The include editor is code (C141 (8)): sf-input-textarea's text="code" --
// the code font, spelling off, no wrapping -- at a fixed eight rows.


function renderIncludeEdit(field, value, host) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-textarea
                size=${EDIT_SIZE}
                appearance="bordered"
                class="sf-field-include-edit"
                name=${fieldName(field)}
                value=${scalarValue(value) ?? ''}
                rows="8"
                text="code"
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
  const mask = (0,_mask_js__WEBPACK_IMPORTED_MODULE_7__.maskPattern)(field);
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
    const state = (0,_mask_js__WEBPACK_IMPORTED_MODULE_7__.maskState)(text, mask);

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
    const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.readDecimal)(text);
    let message = null;
    if (!read.ok) message = setText(host, 'notNumber');else if (read.value !== null && Number.isInteger(field.precision) && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.fractionDigits)(read.value) > field.precision) {
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
} // Money and percent are the Framework's in every mode (owner decision C291
// (2), 2026-11-17; set boundary study BQ-2): the View set's editors were the
// reference, its option names kept -- `currency` (a fixed ISO 4217 code),
// `min`, `max`, `precision` (a percent's digits; money's are its currency's
// minor units, ISO 4217) and `placeholder`, as simai.property-view-port 1.18.0
// declares them. Every value is a decimal string, never a float:
//
//   percent   "12.5" -- the percent, not the share; 0 to 100 unless the
//             field bounds it otherwise
//   money     {amount: "1500.50", currency: "RUB"}; a field with a fixed
//             currency also reads a bare amount, and writes the pair
//
// One sf-input with the decimal keyboard and the sign in the field («%», a
// fixed currency's «₽» after the amount or «$» before it, as the page's
// language writes it); a money field without a fixed currency has a currency
// dropdown beside the amount. What is typed is read with a comma or a point
// and written canonical; the input shows it back in the page's language
// («1500,5»). An entry that is not a value yet -- text that is not a number,
// more digits after the point than allowed, a bound crossed, an amount without
// a currency -- is written as typed and said through setFieldError, which holds
// a save (port 1.16.0, as a masked string's), and under the field once the
// person leaves it. A host without setFieldError hears undefined, as for a
// number.
// The codes a currency choice offers when a field names no `currencies` and
// the browser cannot list ISO 4217 (Intl.supportedValuesOf).


const OFFERED_CURRENCIES = ['RUB', 'USD', 'EUR', 'CNY', 'KZT', 'BYN', 'AED', 'TRY', 'GBP', 'JPY']; // A field's `currencies` (C294, MP-10): an array of ISO 4217 codes or a
// comma-separated string; absent, every code the browser knows.

function fieldCurrencies(field) {
  const asked = Array.isArray(field?.currencies) ? field.currencies : typeof field?.currencies === 'string' ? field.currencies.split(',') : [];
  const codes = asked.map(code => String(code).trim().toUpperCase()).filter(code => /^[A-Z]{3}$/u.test(code));
  return codes.length ? [...new Set(codes)] : (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.currencyCodes)(OFFERED_CURRENCIES);
} // What a person is typing, per host and field: the value written is
// canonical («12.5»), and drawn back as such it would move the caret under
// «12,50» or swallow the comma of «12,». The typed text is shown while it
// still reads as the value, and forgotten when the field is left.


const DECIMAL_DRAFTS = new WeakMap();

function draftOf(host, key) {
  return host && typeof host === 'object' ? DECIMAL_DRAFTS.get(host)?.get(key) : undefined;
}

function keepDraft(host, key, text) {
  if (!host || typeof host !== 'object') return;
  let drafts = DECIMAL_DRAFTS.get(host);

  if (!drafts) {
    drafts = new Map();
    DECIMAL_DRAFTS.set(host, drafts);
  }

  if (text === undefined) drafts.delete(key);else drafts.set(key, text);
} // At rest the amount shows its groups and at least `minDigits` after the
// point («1 500,50»); while it is typed, as typed (C294).


function decimalShown(host, key, value, {
  currency = null,
  minDigits = 0
} = {}) {
  if (value === null || value === undefined || value === '') return '';
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);
  const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.readTypedDecimal)(value, {
    locale: 'en',
    currency
  });
  if (!read.ok) return String(value);
  const draft = draftOf(host, key);

  if (typeof draft === 'string') {
    const typed = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.readTypedDecimal)(draft, {
      locale,
      currency
    });
    if (typed.ok && typed.value === read.value) return draft;
  }

  return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.restingDecimal)(read.value, locale, minDigits);
}

const hasBound = bound => bound !== null && bound !== undefined && bound !== '' && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.readDecimal)(bound).ok; // What is wrong with a typed decimal, or '': not a number, more digits after
// the point than `digits` (never rounded away: «1500,555» is an error, while
// «1500,500» is 1500.5), outside min..max.


function decimalError(host, text, {
  digits = null,
  min = null,
  max = null,
  currency = null
} = {}) {
  const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.readTypedDecimal)(text, {
    locale: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null),
    currency
  });
  if (!read.ok) return setText(host, 'notNumber');
  if (read.value === null) return '';

  if (Number.isInteger(digits) && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.fractionDigits)(read.value) > digits) {
    return digits === 0 ? setText(host, 'fractionNone') : (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageWord)(SET_TEXT, 'precisionMax', host ?? null, {
      component: SET_NAME,
      count: digits
    });
  }

  const low = hasBound(min) && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.compareDecimal)(read.value, min) === -1;
  const high = hasBound(max) && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.compareDecimal)(read.value, max) === 1;
  if (!low && !high) return '';
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);
  const vars = {
    min: hasBound(min) ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatDecimal)(min, locale) : '',
    max: hasBound(max) ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatDecimal)(max, locale) : ''
  };
  if (hasBound(min) && hasBound(max)) return setWord(host, 'boundBetween', vars);
  return low ? setWord(host, 'boundAtLeast', vars) : setWord(host, 'boundAtMost', vars);
} // The value goes to the host with what is wrong with it: a value that is not
// one yet is written as typed while setFieldError holds the save.


function writeDecimal(field, host, value, message) {
  if (message) {
    if (typeof host.setFieldError === 'function') {
      host.setFieldError(field, message);
      host.setFieldValue(field, value);
    } else {
      host.setFieldValue(field, undefined);
    }

    return;
  }

  host.setFieldError?.(field, null);
  host.setFieldValue(field, value);
}

function decimalInput(field, value, host, {
  key,
  check,
  write,
  currency = null,
  minDigits = 0,
  textStart = '',
  textEnd = '',
  rootClass = ''
}) {
  const own = EDIT_ERROR;
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);

  const typed = (event, left) => {
    const input = event.currentTarget ?? event.target;
    const text = String(input?.value ?? '');
    keepDraft(host, key, left ? undefined : text);
    const message = check(text);

    if (input && !own) {
      if (message && left) {
        input.setAttribute('error-message', message);
        input.toggleAttribute('invalid', true);
      } else if (!message && input.hasAttribute?.('invalid') && !input.hasAttribute('data-sf-form-invalid')) {
        input.toggleAttribute('invalid', false);
        input.removeAttribute('error-message');
      }
    }

    const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.readTypedDecimal)(text, {
      locale,
      currency
    });
    write(read.ok ? read.value : text, message);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${decimalShown(host, key, value, {
    currency,
    minDigits
  })}
                inputmode="decimal"
                text-start=${textStart || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                text-end=${textEnd || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                placeholder=${field.placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                root-class=${rootClass || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(field.required)}
                ?invalid=${Boolean(own)}
                error-message=${own || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                @input=${event => typed(event, false)}
                @change=${event => typed(event, true)}
        ></sf-input>
    `;
}

function fixedCurrency(field) {
  return typeof field?.currency === 'string' && /^[A-Z]{3}$/u.test(field.currency) ? field.currency : null;
} // A percent's digits after the point: `precision`, else the digits its
// `step` has («0.1» is one), else as many as typed.


function percentDigits(field) {
  if (Number.isInteger(field.precision)) return field.precision;
  const step = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.readDecimal)(field.step);
  return step.ok && step.value !== null && Number(step.value) > 0 ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.fractionDigits)(step.value) : null;
} // A percent is the percent itself, «12.5» is 12,5 % (C294); it is bounded
// only by the field's min and max -- a growth of 150 % or a change of −5 % is
// a percent too (MP-11: the View set bounded it 0..100 without saying why).


function renderPercentEdit(field, value, host) {
  const key = String(field.key ?? '');
  const min = hasBound(field.min) ? field.min : null;
  const max = hasBound(field.max) ? field.max : null;
  const digits = percentDigits(field);
  return decimalInput(field, scalarValue(value), host, {
    key,
    textEnd: '%',
    check: text => decimalError(host, text, {
      digits,
      min,
      max
    }),
    write: (next, message) => writeDecimal(field, host, next, message)
  });
}

function renderMoneyEdit(field, value, host) {
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);
  const key = String(field.key ?? '');
  const fixed = fixedCurrency(field);
  const display = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.currencyDisplayOf)(field);
  const parts = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.moneyParts)(scalarValue(value), fixed); // A currency chosen before an amount is typed waits here: a value is an
  // amount and its currency, never a currency alone.

  const currencyKey = `${key}#currency`;
  const currency = parts.currency || draftOf(host, currencyKey) || null;
  const min = hasBound(field.min) ? field.min : null;
  const max = hasBound(field.max) ? field.max : null;

  const check = (text, code) => {
    const message = decimalError(host, text, {
      digits: code ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.currencyOf)(code, locale).minor : null,
      min,
      max,
      currency: code
    });
    if (message) return message;
    return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.readTypedDecimal)(text, {
      locale,
      currency: code
    }).value !== null && !code ? setText(host, 'chooseCurrency') : '';
  };

  const write = (amount, message, code) => writeDecimal(field, host, amount === null || amount === '' ? null : {
    amount,
    currency: code ?? null
  }, message);

  const sign = fixed ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.currencyOf)(fixed, locale, display) : null;
  const amount = decimalInput(field, parts.amount, host, {
    key,
    currency,
    minDigits: currency ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.currencyOf)(currency, locale).minor : 0,
    textStart: sign?.before ? sign.sign : '',
    textEnd: sign && !sign.before ? sign.sign : '',
    rootClass: fixed ? '' : 'flex-1 min-w-0',
    check: text => check(text, currency),
    write: (next, message) => write(next, message, currency)
  });
  if (fixed) return amount; // The field's `currencies`, the value's own currency first when the list
  // lacks it; without a list, every ISO 4217 code with a search.

  const listed = fieldCurrencies(field);
  const offered = [...new Set([...(currency ? [currency] : []), ...listed])];
  const name = setText(host, 'currency');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="flex gap-1/3 items-cross-start min-w-0 w-full">
            ${amount}
            <sf-dropdown
                    size=${EDIT_SIZE}
                    appearance="bordered"
                    mode="select"
                    search=${offered.length > 12 ? 'true' : 'false'}
                    root-class="basis-1/3 min-w-0"
                    name=${`${fieldName(field)}_currency`}
                    value=${currency ?? ''}
                    placeholder=${name}
                    aria-label=${name}
                    .options=${offered.map(code => {
    const {
      sign: mark
    } = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.currencyOf)(code, locale, display);
    return {
      type: 'text',
      size: '1',
      value: code,
      text: mark === code ? code : `${code} ${mark}`,
      selected: code === currency
    };
  })}
                    @change=${event => {
    const code = event.detail?.values?.[0] || event.detail?.value || null;
    keepDraft(host, currencyKey, code ?? undefined);
    const typed = parts.amount; // The dropdown shows the code itself; a value is written
    // only with an amount.
    // The stored amount is checked as the page would show it.

    if (typed !== null && typed !== undefined && typed !== '') write(typed, check((0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.restingDecimal)(typed, locale), code), code);
  }}
            ></sf-dropdown>
        </div>
    `;
}

function renderPercentView(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  const text = typeof formatted === 'string' ? formatted : carriesText(value) ? value.text : (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatPercent)(scalarValue(value), (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null)) || viewText(field, value, null);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderMoneyView(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  const text = typeof formatted === 'string' ? formatted : carriesText(value) ? value.text : (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatMoney)(scalarValue(value), field, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null));
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
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
} // min and max bound the day (PD-2, as a datetime's do): an ISO date, or the
// day of an ISO date and time; the calendar disables the days outside them
// and a typed day outside them is put back. The host still validates.


function dayBound(bound) {
  const match = typeof bound === 'string' ? bound.trim().match(/^\d{4}-\d{2}-\d{2}/u) : null;
  return match ? match[0] : '';
}

function renderDateEdit(field, value, host) {
  value = scalarValue(value);
  const {
    date,
    suffix
  } = splitDateTime(value);
  const min = dayBound(field.min);
  const max = dayBound(field.max);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input-date
                size=${EDIT_SIZE}
                name=${fieldName(field)}
                value=${date ?? ''}
                min-date=${min || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                max-date=${max || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                ?required=${Boolean(field.required)}
                ?invalid=${Boolean(EDIT_ERROR)}
                error-message=${EDIT_ERROR || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
  const stored = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_6__.splitDateTime)(value);
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
                ?invalid=${Boolean(EDIT_ERROR)}
                error-message=${EDIT_ERROR || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                @change=${event => {
    // The picker's own change, not a native one from its field.
    if (event.target !== event.currentTarget) return;
    const [date = '', time = ''] = String(event.detail?.value ?? '').split('T');
    const result = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_6__.composeDateTime)(stored, {
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
  const stored = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_6__.splitTime)(value);
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
                ?invalid=${Boolean(EDIT_ERROR)}
                error-message=${EDIT_ERROR || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                @change=${event => {
    if (event.target !== event.currentTarget) return;
    const result = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_6__.composeTime)(stored, String(event.detail?.value ?? ''));
    if (result.error) return;
    const same = result.value === null ? stored.known && !stored.time : result.value === stored.raw;
    host.setFieldValue(field, same ? undefined : result.value);
  }}
        ></sf-input-date>
    `;
} // A required boolean has two states and nothing else. In a form saved with a
// button it is a checkbox, and a switch only where the change acts at once
// (owner decision C165 (4), form study FM-6): a switch says «on now», which a
// form that has not been saved has not done. The host says it acts at once with
// renderEditField(…, {apply: 'instant'}). The checkbox carries no `required`:
// a required yes/no is one with a value, and an unticked box is «Нет», not an
// empty answer. An optional one is a pair of buttons with nothing chosen while
// the value is absent -- the consumer owner's decision of 2026-10-06, and the
// reason is that neither a switch nor a checkbox can say «не задано»: rendering
// one over an absent value would write false on the first save, a value nobody
// chose.


function renderBooleanEdit(field, value, host) {
  const optional = field.required !== true;

  if (!optional && EDIT_APPLY === 'instant') {
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

  if (!optional) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <sf-checkbox
                    size=${EDIT_SIZE}
                    name=${fieldName(field)}
                    ?checked=${value === true}
                    aria-label=${field.label || field.key || ''}
                    @change=${event => host.setFieldValue(field, Boolean(event.target?.checked ?? event.detail?.checked))}
            ></sf-checkbox>
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
        <sf-segmented
                appearance="buttons"
                size=${EDIT_SIZE}
                items=${items}
                value=${value === true ? 'yes' : value === false ? 'no' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${field.label || field.key || ''}
                @change=${event => {
    const next = event.detail?.value;
    host.setFieldValue(field, next === 'yes' ? true : next === 'no' ? false : null);
  }}
        ></sf-segmented>
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
        <sf-segmented
                class="sf-field-choice-buttons"
                appearance="track"
                size=${size}
                root-class=${locked ? 'flex-wrap pointer-events-none' : 'flex-wrap'}
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
        ></sf-segmented>
    `;
}

function renderChoiceEdit(field, value, host) {
  if (isChoiceButtons(field)) return renderChoiceButtons(field, value, host);
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                size=${EDIT_SIZE}
                appearance="bordered"
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
                appearance="bordered"
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


const SET_TEXT = _lang_index_mjs__WEBPACK_IMPORTED_MODULE_12__["default"]; // The host's word wins, as it always did; the set's own fallback now follows
// the page's language instead of being Russian whatever the page is. `host` is
// the component that called the set, which is the node the rule reads from.
// The set is not an element, so it is named here rather than taken from the
// node: `host` is whichever component called it, and words registered for the
// set should apply wherever it draws rather than once per host.

const SET_NAME = 'sf-field-renderers';

function setText(host, key) {
  return host?.getFieldText?.(key) ?? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(SET_TEXT, key, host ?? null, SET_NAME);
} // A word with places in it ({zone}, {n}): the host's word wins, as setText's.


function setWord(host, key, vars) {
  const own = host?.getFieldText?.(key);

  if (own !== undefined && own !== null) {
    return String(own).replace(/\{([a-z][\w-]*)\}/giu, (whole, name) => vars && name in vars ? String(vars[name]) : whole);
  }

  return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageWord)(SET_TEXT, key, host ?? null, {
    component: SET_NAME,
    vars
  });
} // One job, one component (owner decision C139 (1), 2026-11-14): a record, a
// relation, a user and a paged lookup are chosen with sf-input-lookup -- the
// search the host answers, its rows with a picture and a caption, its states
// and its chips -- where they were a searchable sf-dropdown beside a status
// line of the set's own. sf-dropdown stays for a short list given whole (an
// inline lookup). The dropdown path is kept until 2027-01-01 for a host that
// asks renderEditField(…, {picker: 'dropdown'}); it is noted as deprecated.


const DROPDOWN_PICKER_UNTIL = '2027-01-01';
let EDIT_PICKER = '';

function dropdownPicker() {
  if (EDIT_PICKER !== 'dropdown') return false;
  (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_9__.noteDeprecated)({
    component: 'sf-field-renderers',
    kind: 'value',
    attribute: 'picker',
    from: 'dropdown',
    to: null,
    since: '2026-11-14',
    remove_after: DROPDOWN_PICKER_UNTIL
  });
  return true;
} // An item the lookup shows, from what the host's page holds: a user's
// avatarText is the avatar's initials, an item's own avatar ({src} or
// {initials}), icon, caption and match ranges travel as they are.


function lookupItem(item) {
  if (!item || typeof item !== 'object') return null;
  const avatar = item.avatar && typeof item.avatar === 'object' ? item.avatar : item.avatarText ? {
    initials: String(item.avatarText)
  } : undefined;
  return {
    value: item.value,
    label: String(item.label ?? item.text ?? item.value ?? ''),
    ...(item.caption ? {
      caption: String(item.caption)
    } : {}),
    ...(avatar ? {
      avatar
    } : {}),
    ...(item.icon ? {
      icon: String(item.icon)
    } : {}),
    ...(item.match ? {
      match: item.match
    } : {})
  };
} // The lookup's provider over the host's page interface (getFieldOptionsPage,
// loadFieldOptions, getFieldOptionSearch, setFieldOptionSearch): a query is
// one host search, a cursor its next page. The page the host already holds
// for the same query answers at once (a record view asks the first page as
// its group opens). A host that loads without answering a promise answers on
// its next drawing: the page is read again until it is no longer loading.


function hostProvider(field, host) {
  return async (query, {
    cursor = null,
    signal
  } = {}) => {
    const text = String(query ?? '');
    const held = host.getFieldOptionsPage(field) || null;
    const sameSearch = (host.getFieldOptionSearch?.(field) ?? '') === text;
    let page = held;
    let from = 0;
    let before = [];

    if (cursor === null && sameSearch && held?.status === 'ready') {
      page = held;
    } else {
      before = cursor === null || !Array.isArray(held?.items) ? [] : held.items;
      host.setFieldOptionSearch?.(field, text);
      await host.loadFieldOptions(field, {
        cursor,
        search: text
      });
      page = host.getFieldOptionsPage(field) || null;

      for (let wait = 0; page?.status === 'loading' && wait < 100 && !signal?.aborted; wait += 1) {
        await new Promise(done => setTimeout(done, 50));
        page = host.getFieldOptionsPage(field) || null;
      }
    }

    if (signal?.aborted) return {
      items: []
    }; // A host may join the next page to the ones it holds, or replace them
    // with it: only what is new is answered.

    const now = Array.isArray(page?.items) ? page.items : [];
    if (before.length && now.length > before.length && now[0]?.value === before[0]?.value) from = before.length;
    if (page?.status === 'unsupported') return {
      status: 'unavailable'
    };
    if (!page || page.status === 'error' || page.status === 'loading') throw new Error(setText(host, 'recordsError'));
    const items = (Array.isArray(page.items) ? page.items : []).slice(from).map(lookupItem).filter(Boolean);
    return {
      items,
      nextCursor: page.nextCursor ?? null
    };
  };
} // The page a host pages answers a hundred at most: the lookup cuts an answer
// to max-results, and a host page is the host's own size.


const HOST_PAGE_MOST = 100;

function renderHostLookup(field, value, host, {
  multiple,
  placeholder
}) {
  // What the lookup says it chose, in the shape the set writes: {value,
  // label}, or a list of them when multiple.
  const resolved = item => ({
    value: item.value,
    label: String(item.label ?? item.value)
  });

  const write = event => {
    if (event.target !== event.currentTarget) return;
    const next = event.detail?.value ?? event.target?.value;

    if (multiple) {
      host.setFieldValue(field, (Array.isArray(next) ? next : []).map(resolved));
      return;
    }

    host.setFieldValue(field, next && typeof next === 'object' ? resolved(next) : null);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-field-picker flex flex-col gap-1/3" data-field-picker=${field.key || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <sf-input-lookup
                    size=${EDIT_SIZE}
                    ?multiple=${multiple}
                    suggest
                    min-length="1"
                    max-results=${String(HOST_PAGE_MOST)}
                    name=${fieldName(field)}
                    ?required=${Boolean(field.required)}
                    ?disabled=${EDIT_DISABLED}
                    placeholder=${field.placeholder || placeholder}
                    aria-label=${field.label || field.key || ''}
                    .value=${value ?? (multiple ? [] : null)}
                    .provider=${hostProvider(field, host)}
                    @change=${write}
            ></sf-input-lookup>
        </div>
    `;
} // The record picker: a record, a relation or a user, one value, searched and
// paged by the host (C139 (1)).


function renderRecordLookup(field, value, host) {
  if (dropdownPicker()) return renderRecordPicker(field, value, host);
  if (!host.loadFieldOptions || !host.getFieldOptionsPage) return null;
  const page = host.getFieldOptionsPage(field) || null; // A host that refused this field's candidates has none to give: the field
  // falls back to its value, read-only, as the dropdown path did.

  if (page?.status === 'unsupported') return null;
  const chosen = value && typeof value === 'object' ? value : null;
  return renderHostLookup(field, chosen, host, {
    multiple: false,
    placeholder: setText(host, 'pickRecord')
  });
} // DEPRECATED until 2027-01-01 (C139 (1)): the record picker as a searchable
// sf-dropdown, for a host that asks {picker: 'dropdown'}.


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
                    appearance="bordered"
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

  if (!inline && (!host.loadFieldOptions || !host.getFieldOptionsPage)) return null; // A paged list is the lookup's (C139 (1)); a short list given whole stays
  // the dropdown's, and so does the deprecated dropdown path.

  if (!inline && !dropdownPicker()) {
    if (host.getFieldOptionsPage(field)?.status === 'unsupported') return null;
    return renderHostLookup(field, value, host, {
      multiple,
      placeholder: setText(host, 'pickFromList')
    });
  }

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
                    appearance="bordered"
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
                ?readonly=${field.readonly === true}
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
  const items = Array.isArray(uploads) ? uploads : []; // «×» takes a file out of the field at once, and the notice gives it back
  // with «Вернуть» (decisions C25, C149 (8)): the field's value before the
  // removal is set again.

  const drop = index => {
    const before = value;
    const next = files.filter((_, position) => position !== index);
    host.setFieldValue(field, multiple ? next : next[0] ?? null);
    const removed = files[index];
    globalThis.SF?.notify?.({
      status: 'neutral',
      title: setText(host, 'fileRemoved'),
      text: String(removed?.label ?? removed?.name ?? ''),
      source: 'sf-file-preview',
      action: {
        label: setText(host, 'undo'),
        onSelect: () => host.setFieldValue(field, before)
      }
    });
  };

  const readonly = field.readonly === true; // download-action and remove-action both read true when the attribute is
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
                        remove-action=${readonly ? 'false' : 'true'}
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


const sizeOption = options => options?.size === '1/2' ? '1/2' : '1'; // `options.density`: 'compact' or 'normal', the density the control is drawn in
// (owner decision C22; form study FM-5). Without it the control follows the
// region it stands in, as every component does; with it the host sets the
// region for this field alone -- a compact panel asks for 'compact' instead of
// shrinking the field with size '1/2', which C22 forbids. Anything else is no
// density at all.


const DENSITIES = new Set(['compact', 'normal']);

const densityOption = options => DENSITIES.has(options?.density) ? options.density : ''; // `options.apply`: 'instant' when a change acts at once (a settings panel, the
// parameters of a block), anything else for a form saved with a button. Read by
// the yes/no field only: a switch at once, a checkbox in a form (C165 (4)).


let EDIT_APPLY = ''; // A control that stays a control when it may not be changed: a choice as
// buttons shows which button is chosen, which is what it is for, where the
// view's badge would show a different thing (port 1.16.0).

const keepsControlWhenLocked = (asked, field) => asked === 'choice' && isChoiceButtons(field); // `options.disabled`: the control is drawn disabled, not read-only -- a field a
// condition turns off for now (port 1.14.0 `when.enabled`), which the host
// knows and the field does not carry. Read by the controls that draw the two
// differently; for every other one a disabled field is a read-only one.


let EDIT_DISABLED = false; // `options.error`: what is wrong with the field now, a sentence, or empty (PD-1,
// property type study «Дата»). A control that says its own error (sf-input-date
// for a date, a datetime and a time) is drawn invalid with the sentence under
// it, the error-message of the field family, so a host that is not sf-form --
// a record card -- marks the field itself instead of writing a line under a
// field with a normal border. sf-form keeps setting invalid on the controls it
// draws, as before.

let EDIT_ERROR = '';
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
  const outerPicker = EDIT_PICKER;
  const outerApply = EDIT_APPLY;
  const outerError = EDIT_ERROR;
  EDIT_SIZE = sizeOption(options);
  EDIT_ERROR = typeof options?.error === 'string' ? options.error.trim() : '';
  EDIT_DISABLED = disabled; // `options.picker: 'dropdown'`: the record, relation, user and paged lookup
  // fields drawn as before C139, a searchable sf-dropdown (until 2027-01-01).

  EDIT_PICKER = options?.picker === 'dropdown' ? 'dropdown' : '';
  EDIT_APPLY = options?.apply === 'instant' ? 'instant' : '';

  try {
    return inDensity(renderer(field, value, host), densityOption(options));
  } finally {
    EDIT_SIZE = outer;
    EDIT_DISABLED = outerDisabled;
    EDIT_PICKER = outerPicker;
    EDIT_APPLY = outerApply;
    EDIT_ERROR = outerError;
  }
} // A density asked for one field is a region around it that draws no box of its
// own: the variables of the density rules (core/scss/_sf_css__density.scss)
// stand on it and every part of the control inherits them, the popups it opens
// read it (core/js/density.js densityOf), and the control lays out in the
// host's flex or grid as if the wrapper were not there. No density, no wrapper:
// what a host had is unchanged.

function inDensity(content, density) {
  if (!density || content == null) return content;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-field-density" style="display: contents" data-sf-density=${density}>${content}</div>`;
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
  const clean = (0,_html_js__WEBPACK_IMPORTED_MODULE_8__.cleanHtml)(value);
  return clean ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-field-view sf-field-html">${(0,lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__.unsafeHTML)(clean)}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // A number in the page's language (set boundary study, 2026-11-17): «12,5 кг»
// on a Russian page, «12.5 kg» on an English one, through Intl with every
// digit the value has (decimal.js formatDecimal, never through a float on the
// way). The host's formatFieldValue and a value's own text still win; what is
// not a number is shown as it came.


function numberText(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  if (typeof formatted === 'string') return formatted;
  if (carriesText(value)) return value.text;
  return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatDecimal)(scalarValue(value), (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null)) || viewText(field, value, null);
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

  if (variant === 'meter' && Number.isFinite(number) && number >= 0 && number <= 100) {
    const {
      label
    } = meterProps(field, number);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-progress-bar inline meter value=${String(number)} label=${label || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-progress-bar>`;
  }

  const text = numberText(field, value, host);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${field.unit ? `${text} ${field.unit}` : text}</span>`;
} // A date is the host's to format first: formatFieldValue wins, and so does a
// value that carries its own text. Without it the set used to print the stored
// form -- «2026-10-25T10:30:00+03:00» (simai/ui-source#34) -- so a host that
// formats nothing gets the page's medium reading through core format-date:
// «2 нояб. 2026 г.» / «Nov 2, 2026» for a date, «15 нояб. 2026 г., 10:30» /
// «Nov 15, 2026, 10:30 AM» for a datetime, the form the View set's table
// printed before the renderers formatted dates (C19: the set formats, the
// table inherits). The day and the clock are the record's own (datetime.js
// reads them as written, in the host's zone): nothing is moved to the reader's
// time zone, which would show a different day near midnight. A value that is
// not a date at all is shown as it came, never guessed at.
//
// `format` is the field's display setting (PD-3): the length of the date,
// Intl's dateStyle in the page's language -- short «17.11.2026» / «11/17/26»,
// medium (the default) «17 нояб. 2026 г.» / «Nov 17, 2026», long «17 ноября
// 2026 г.» / «November 17, 2026», full with the weekday. A datetime keeps its
// clock beside it. It is read by the view and the cell; the edit control
// types the locale's digits whatever it says. Any other value is medium, and
// the host's formatFieldValue or text still wins.


const DATE_FORMATS = new Set(['short', 'medium', 'long', 'full']);

function dateFormatOf(field) {
  const format = String(field?.format ?? '').trim();
  return DATE_FORMATS.has(format) ? format : 'medium';
}

function defaultDateText(field, value, host) {
  if (carriesText(value)) return null;
  const parts = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_6__.splitDateTime)(value);
  if (!parts.known || !parts.date) return null;
  const [year, month, day] = parts.date.split('-').map(Number);
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);

  try {
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    const type = field?.propertyType || field?.type || field?.dataType;
    const dateStyle = dateFormatOf(field);
    if (type !== 'datetime' || !parts.time) return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_4__.formatDate)(date, {
      intl: {
        dateStyle,
        timeZone: 'UTC'
      },
      locale
    }) || null;
    const [hours, minutes] = parts.time.split(':').map(Number);
    date.setUTCHours(hours, minutes, 0, 0);
    return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_4__.formatDate)(date, {
      intl: {
        dateStyle,
        timeStyle: 'short',
        timeZone: 'UTC'
      },
      locale
    }) || null;
  } catch {
    return null;
  }
}

function dateText(field, value, host) {
  const formatted = host?.formatFieldValue?.(field, value);
  if (typeof formatted === 'string') return formatted;
  return defaultDateText(field, value, host) ?? viewText(field, value, null);
} // The machine reading of a date (C40: every moment the Framework prints is a
// time element): the record's own day and clock as written, «2026-11-15» or
// «2026-11-15T10:30», with no zone, because the view never moves a record to
// the reader's zone. That is also why the view is not sf-time, which reads a
// moment in the reader's zone: a date near midnight would show another day.
// '' when the value is no date.


function dateTimeAttribute(field, value) {
  const parts = (0,_datetime_js__WEBPACK_IMPORTED_MODULE_6__.splitDateTime)(value);
  if (!parts.known || !parts.date) return '';
  const type = field?.propertyType || field?.type || field?.dataType;
  return type === 'datetime' && parts.time ? `${parts.date}T${parts.time}` : parts.date;
}

function renderDateView(field, value, host) {
  const text = dateText(field, value, host);
  if (!text) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const datetime = dateTimeAttribute(field, value);
  return datetime ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<time class="sf-field-view" datetime=${datetime}>${text}</time>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>`;
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
            <sf-avatar line=${VIEW_LINE} text=${value.avatarText || ''} heading=${String(value.label)}></sf-avatar>
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
  include: renderIncludeView,
  money: renderMoneyView,
  percent: renderPercentView
}; // A field shown rather than edited. `host` is optional and used for one thing
// only -- formatFieldValue, where a consumer's own formatting of a number or a
// date belongs. Null when the set has no view for that type.
// A column total (owner decision C294, MP-12): the table owns its totals
// row, the set gives the sum by the digits and its display. Money is summed
// per currency -- a column of dollars and euros is two lines, never one
// number -- and a number or an integer is one sum; a percent, a choice or a
// text has no total (null). `values` are the column's stored values; what is
// not a number is left out.

function renderTotalField(field = {}, values = [], host) {
  const type = field.propertyType || field.type || field.dataType;
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(host ?? null);
  const list = (Array.isArray(values) ? values : []).map(value => scalarValue(value));

  if (type === 'money') {
    const totals = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.moneyTotals)(list, field, locale);
    return totals.length ? totals.map(total => total.text) : null;
  }

  if (type !== 'number' && type !== 'integer') return null;
  const numbers = list.filter(value => value !== null && value !== undefined && value !== '' && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.readTypedDecimal)(value).ok);
  if (!numbers.length) return null;
  const sum = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.addDecimal)(numbers);
  return sum === null ? null : [(0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatDecimal)(sum, locale)];
} // Whether a type is a number a table aligns to the end of the line with
// figures of one width (the registry's `numeric`, C294 MP-12).

function isNumericType(type) {
  return Boolean(_registry_js__WEBPACK_IMPORTED_MODULE_5__.PROPERTY_TYPES.find(entry => entry.type === type)?.numeric);
}
function propertyModes(type) {
  return (0,_registry_js__WEBPACK_IMPORTED_MODULE_5__.modesOf)(type, {
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
    return inDensity(renderer(field, value, host), densityOption(options));
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
    renderTotalField,
    FILTER_RENDERERS,
    // The nine number conditions in the filter's order (C294).
    NUMBER_FILTER_OPERATORS,
    isNumericType,
    // Decimal strings as the set reads and shows them (C294): the View
    // set's items, compound and ru.requisites call these instead of
    // keeping a copy. format(value), money(value, field), percent(value)
    // take a locale (the page's when absent); read(text, {locale,
    // currency}) reads what a person typed or pasted; add(...values) and
    // compare(a, b) work by the digits; totals(values, field) sums money
    // per currency; currency(code, locale, display) is {sign, before, minor}.
    decimal: {
      format: (value, locale) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatDecimal)(value, locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null)),
      money: (value, field = {}, locale) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatMoney)(value, field, locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null)),
      percent: (value, locale) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.formatPercent)(value, locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null)),
      read: (text, options = {}) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.readTypedDecimal)(text, {
        locale: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null),
        ...options
      }),
      add: _decimal_js__WEBPACK_IMPORTED_MODULE_10__.addDecimal,
      compare: _decimal_js__WEBPACK_IMPORTED_MODULE_10__.compareDecimal,
      totals: (values, field = {}, locale) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.moneyTotals)(values, field, locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null)),
      currency: (code, locale, display) => (0,_decimal_js__WEBPACK_IMPORTED_MODULE_10__.currencyOf)(code, locale || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(null), display)
    },
    // The date filter's rules (C293): the chip's words, when an entry is
    // empty, the request with its context, a period's days.
    dateFilter: {
      conditions: _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateFilterConditions,
      chipText: _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.dateFilterChipText,
      isEmptyEntry: _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.isEmptyFilterEntry,
      normalizeEntry: _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.normalizeFilterEntry,
      requestContext: _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.filterRequestContext,
      buildRequest: _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.buildFilterRequest,
      resolvePeriod: _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.resolveDatePeriod,
      periods: _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.DATE_PERIODS,
      futurePeriods: _date_filter_js__WEBPACK_IMPORTED_MODULE_13__.DATE_FUTURE_PERIODS
    },
    // A datetime's value read and written back, for a host that draws its
    // own control: split(value), compose(stored, {date, time}),
    // normalizeTime(text); and a time of day's: splitTime(value),
    // composeTime(stored, text).
    dateTime: {
      split: _datetime_js__WEBPACK_IMPORTED_MODULE_6__.splitDateTime,
      compose: _datetime_js__WEBPACK_IMPORTED_MODULE_6__.composeDateTime,
      normalizeTime: _datetime_js__WEBPACK_IMPORTED_MODULE_6__.normalizeTime,
      splitTime: _datetime_js__WEBPACK_IMPORTED_MODULE_6__.splitTime,
      composeTime: _datetime_js__WEBPACK_IMPORTED_MODULE_6__.composeTime
    },
    // The universal properties, each with the modes the set draws for it.
    registry: _registry_js__WEBPACK_IMPORTED_MODULE_5__.PROPERTY_TYPES.map(entry => ({ ...entry,
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

/***/ "25be1c2df717"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatPhone: () => (/* binding */ formatPhone),
/* harmony export */   phoneDialCode: () => (/* binding */ phoneDialCode),
/* harmony export */   phoneE164: () => (/* binding */ phoneE164),
/* harmony export */   splitPhone: () => (/* binding */ splitPhone)
/* harmony export */ });
// A telephone number, stored and shown (FL-1, FL-7 of the property page study,
// 2026-11-17). Larena keeps a phone in E.164 -- `+79161234567`, a plus and the
// digits, nothing else (Larena decision 2026-10-24) -- and so does every form
// that submits sf-input-country (standard simai.smart-component §17.1 item 2).
// The edit control used to write the text as the box showed it,
// `+7 916 123-45-67`, so opening a record and saving it changed the stored
// value. Edit writes E.164 now; view and cell lay the number out by its
// country, as the box does, and read the formatted strings stored before.
// The national part of each dial code's number, laid out as sf-input-country
// lays it out (its `formatByPattern`): `0` is a digit, anything else is
// written as it stands. Derived from src/component/country-code/data/countries.json
// -- each dial code's pattern without its own code; where countries share a
// code, the country the code means (+7 Russia, +1 the United States, +44
// Britain) -- and held equal to it by tests/phone-e164-fl.contract.test.mjs,
// so the set carries 2 KB instead of the 54 KB table.
const PATTERNS = [['0 00 00 00', '46'], ['0 00 00 00 00', '33 212 237'], ['0 000 00 00', '386'], ['0 000 000', '95 248 265 291 359 961 967 975'], ['0 000 0000', '36 64 66 389 599 850 962 964 970 971'], ['0 0000 000', '385'], ['0 0000 0000', '61 63 886'], ['0 000000', '252'], ['0 0000000', '51 53 591'], ['0 00000000', '20'], ['0 000000000', '43'], ['0-000-0000', '82 593 972'], ['0-0000 0000', '60'], ['0-0000-0000', '81'], ['0-0000000', '880 977'], ['0/000 000 00', '421'], ['00 00 0 00000', '225'], ['00 00 00', '299 508 681'], ['00 00 00 00', '32 45 47 213 222 223 224 226 227 228 235 236 241 253 257 352 377 689'], ['00 00 00 00 00', '229'], ['00 00 000 00', '261'], ['00 00 0000', '509'], ['00 00-00-00', '993'], ['00 000', '682 688'], ['00 000 00 00', '41 48 221 994 995 998'], ['00 000 000', '216 231 258 264 355 371 373 382 383 855 856'], ['00 000 0000', '27 31 40 93 233 242 249 251 255 351 595 963 966'], ['00 000-000', '387'], ['00 0000', '672'], ['00 0000 0000', '30 39 86 98'], ['00 0000-0000', '54 55'], ['00 00000', '243 263 353'], ['00 000000', '49 232 357 374 381 968'], ['00 0000000', '62 254 256 358'], ['00 00000000', '92'], ['00-000', '676'], ['00-0000000', '218'], ['00.00.00', '687'], ['000 00 00', '238 269 423'], ['000 00 00 00', '34 262 590 594 596'], ['000 00 0000', '992'], ['000 00-00-00', '375'], ['000 000', '376'], ['000 000 00 00', '90'], ['000 000 000', '56 94 211 240 244 245 250 260 420 996'], ['000 000 0000', '44 52'], ['000 000-00-00', '7'], ['000 0000', '220 239 246 267 297 354 372 592 670 673 674 675 679 680 691'], ['000 0000 000', '84'], ['000 00000', '350 370'], ['000 0000000', '57'], ['000-000', '597'], ['000-000-0000', '1'], ['000-0000', '501 507 692 960'], ['000-0000000', '58'], ['0000', '683 690'], ['0000 00 0000', '234'], ['0000 0000', '65 230 266 268 356 502 503 505 506 598 852 853 965 973 974 976'], ['0000 00000', '380'], ['0000 000000', '378'], ['0000-0000', '504'], ['00000', '290 500 677 678 685 686'], ['00000 00000', '91'], ['000000', '298']];
const NATIONAL = new Map();

for (const [pattern, codes] of PATTERNS) for (const code of codes.split(' ')) NATIONAL.set(code, pattern);

const digitsOf = text => String(text ?? '').replace(/\D/gu, ''); // An extension rides after the number: Larena writes `+73472468500;ext=12`
// (RFC 3966), and a person may have typed «доб. 12» or «ext. 12». Its digits
// are not the number's: read into the number they made `+7347246850012`.


const EXTENSION = /\s*(?:;\s*ext\s*=\s*|,?\s*(?:ext|доб)\.?\s*)(\d+)\s*$/iu;
/** The number and its extension apart: {number, extension}; extension '' for none. */

function splitPhone(value) {
  const text = String(value ?? '').trim();
  const match = text.match(EXTENSION);
  if (!match || !/\d/u.test(text.slice(0, match.index))) return {
    number: text,
    extension: ''
  };
  return {
    number: text.slice(0, match.index).trim(),
    extension: match[1]
  };
}

function numberE164(text) {
  const digits = digitsOf(text);
  if (!digits) return '';
  if (text.startsWith('+')) return `+${digits}`;
  if (/^00[1-9]/u.test(text.replace(/[\s\-().]/gu, ''))) return `+${digits.slice(2)}`;
  return text;
}
/**
 * The number in E.164: `+` and the digits. A text that starts with `+` (or the
 * international `00`) is a full number, laid out however it was:
 * `+7 916 123-45-67`, `+7 (916) 123 45 67` and `+79161234567` are one number.
 * A text without a country code is returned as it came, trimmed: which country
 * it belongs to is not the renderer's to guess. Empty for no digits. An
 * extension is kept as `;ext=<digits>`: `+7 347 246-85-00 доб. 12` is
 * `+73472468500;ext=12`.
 */


function phoneE164(value) {
  const {
    number,
    extension
  } = splitPhone(value);
  const e164 = numberE164(number);
  return extension && e164.startsWith('+') ? `${e164};ext=${extension}` : extension ? String(value ?? '').trim() : e164;
}
/** The dial code (digits) an E.164 number starts with: the longest one known. */

function phoneDialCode(e164) {
  const digits = digitsOf(e164);

  for (let length = Math.min(4, digits.length); length > 0; length -= 1) {
    if (NATIONAL.has(digits.slice(0, length))) return digits.slice(0, length);
  }

  return '';
}
/**
 * The number as a person reads it: `+79161234567` reads `+7 916 123-45-67`,
 * by the country its code names. Digits beyond the pattern stay at the end, a
 * number is never cut; an unknown code reads `+<digits>`; a number without a
 * country code is shown as it came. An extension follows the number after the
 * page language's word for it (`extensionWord`, «доб.» on a Russian page).
 */

function formatPhone(value, extensionWord = 'ext.') {
  const {
    number,
    extension
  } = splitPhone(value);
  const main = formatNumber(number);
  if (!extension || !main.startsWith('+')) return extension && !main.startsWith('+') ? String(value ?? '').trim() : main;
  return `${main} ${extensionWord} ${extension}`;
}

function formatNumber(value) {
  const e164 = numberE164(String(value ?? '').trim());
  if (!e164.startsWith('+')) return e164;
  const digits = e164.slice(1);
  const code = phoneDialCode(e164);
  if (!code) return e164;
  const rest = digits.slice(code.length);
  if (!rest) return `+${code}`;
  let out = '',
      index = 0;

  for (const char of NATIONAL.get(code)) {
    if (index >= rest.length) break;
    out += char === '0' ? rest[index++] : char;
  }

  return `+${code} ${out}${rest.slice(index)}`.trimEnd();
}

/***/ },

/***/ "fc654eb7fab0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PROPERTY_TYPES: () => (/* binding */ PROPERTY_TYPES),
/* harmony export */   modesOf: () => (/* binding */ modesOf)
/* harmony export */ });
/* harmony import */ var _lang_index_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("354525e80715");
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
// The names of the types and variants live in the set's language files
// (localization study LC-5); `label` keeps its {ru, en} shape for the hosts
// that read it. English is built in; the Russian name is read from the words
// the ru language file registered for sf-field-renderers (owner decision
// C282), English until it is on the page.


const registeredName = (code, key) => globalThis.__sfPageLanguage?.registered?.get?.('sf-field-renderers')?.get?.(code)?.[key];

const typeLabel = key => Object.freeze(Object.defineProperties({}, {
  ru: {
    enumerable: true,
    get: () => _lang_index_mjs__WEBPACK_IMPORTED_MODULE_0__["default"].ru?.[key] ?? registeredName('ru', key) ?? _lang_index_mjs__WEBPACK_IMPORTED_MODULE_0__["default"].en[key]
  },
  en: {
    enumerable: true,
    value: _lang_index_mjs__WEBPACK_IMPORTED_MODULE_0__["default"].en[key]
  }
}));

const PROPERTY_TYPES = Object.freeze([{
  type: 'string',
  label: typeLabel('type-string'),
  // password: write-only. The host never sends the password; the value it
  // sends is {set: true} or {set: false} (null reads as not set), and the
  // set shows only «задан»/«не задан». An edit writes the typed text through
  // setFieldValue and writes nothing for a field nobody typed in.
  variants: [{
    id: 'phone',
    label: typeLabel('variant-string-phone')
  }, {
    id: 'password',
    label: typeLabel('variant-string-password'),
    writeOnly: true
  }],
  // mask (property-view port 1.16.0): the Framework mask grammar of
  // sf-input's mask-pattern; the value is the text as shown, fixed parts
  // included, and an incomplete one is reported, not written as a value.
  // nullable: false makes a cleared masked field write "" instead of null.
  // Read by the plain string alone: phone and password keep their controls.
  // defaultCountry (FL-7): the phone variant's country while it is empty,
  // ISO 3166 alpha-2; without it, the page's.
  params: ['placeholder', 'mask', 'nullable', 'defaultCountry', 'required', 'readonly']
}, {
  type: 'text',
  label: typeLabel('type-text'),
  variants: [],
  params: ['placeholder', 'required', 'readonly']
}, // html (property-view port 1.17.0): formatted text, an HTML string of
// sf-input-rich's subset. Edited with sf-input-rich, shown cleaned by that
// component's own rule, a cell its text on one line, filtered as text.
{
  type: 'html',
  label: typeLabel('type-html'),
  variants: [],
  params: ['placeholder', 'required', 'readonly']
}, // stepper: edited with sf-quantity, «−» and «+» and the arrow keys; min,
// max and step (and a number's precision) are read by that variant alone.
// numeric (C294, MP-12): a number a table aligns to the end of the line
// with figures of one width -- integer, number, money and percent -- read
// from here by any table instead of each keeping its own list.
{
  type: 'integer',
  label: typeLabel('type-integer'),
  numeric: true,
  variants: [{
    id: 'stepper',
    label: typeLabel('variant-integer-stepper')
  }],
  params: ['unit', 'min', 'max', 'step', 'required', 'readonly']
}, {
  type: 'number',
  label: typeLabel('type-number'),
  numeric: true,
  variants: [{
    id: 'scale',
    label: typeLabel('variant-number-scale')
  }, // meter (owner decision C203 (5)): a share of a limit, 0..100, as
  // the inline sf-progress-bar meter; the scale stays for levels.
  {
    id: 'meter',
    label: typeLabel('variant-number-meter')
  }, {
    id: 'stepper',
    label: typeLabel('variant-number-stepper')
  }],
  params: ['unit', 'min', 'max', 'step', 'precision', 'required', 'readonly']
}, // date (PD-2, PD-3): min and max bound the day, an ISO date (the day of a
// date and time is read); format is the length the view and the cell print
// the date in, Intl's dateStyle: short, medium (the default), long, full.
{
  type: 'date',
  label: typeLabel('type-date'),
  variants: [],
  params: ['min', 'max', 'format', 'required', 'readonly']
}, // datetime and time: sf-input-date in mode datetime and time (1.4.0). min
// and max bound the value -- an ISO date or date and time for a datetime,
// hh:mm for a time -- and step is the minute step, 1 to 60. A datetime's
// format is its date's length, as a date's; the clock stays short.
{
  type: 'datetime',
  label: typeLabel('type-datetime'),
  variants: [],
  params: ['min', 'max', 'step', 'format', 'required', 'readonly']
}, {
  type: 'time',
  label: typeLabel('type-time'),
  variants: [],
  params: ['min', 'max', 'step', 'required', 'readonly']
}, {
  type: 'boolean',
  label: typeLabel('type-boolean'),
  variants: [],
  params: ['trueText', 'falseText', 'required', 'readonly']
}, // buttons (property-view port 1.16.0): one segmented button group, a
// button per option, sized by `size` on the ladder ("1/2", "1", "2"; absent,
// the field's); pressing the chosen one again clears a field that is not
// required. The dropdown stays the default.
{
  type: 'choice',
  label: typeLabel('type-choice'),
  variants: [{
    id: 'buttons',
    label: typeLabel('variant-choice-buttons')
  }],
  params: ['options', 'badgeAppearance', 'size', 'required', 'readonly']
}, {
  type: 'choices',
  label: typeLabel('type-choices'),
  // badges: the view; checklist and select: the edit control (a list of
  // 13 or more is a checklist unless select is asked for).
  variants: [{
    id: 'badges',
    label: typeLabel('variant-choices-badges')
  }, {
    id: 'checklist',
    label: typeLabel('variant-choices-checklist')
  }, {
    id: 'select',
    label: typeLabel('variant-choices-select')
  }],
  params: ['options', 'badgeAppearance', 'required', 'readonly']
}, {
  type: 'user',
  label: typeLabel('type-user'),
  variants: [],
  params: ['placeholder', 'searchPlaceholder', 'required', 'readonly']
}, {
  type: 'record',
  label: typeLabel('type-record'),
  variants: [],
  params: ['placeholder', 'searchPlaceholder', 'required', 'readonly']
}, {
  type: 'relation',
  label: typeLabel('type-relation'),
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
  label: typeLabel('type-lookup'),
  variants: [],
  params: ['options', 'multiple', 'placeholder', 'searchPlaceholder', 'required', 'readonly']
}, {
  type: 'file',
  label: typeLabel('type-file'),
  variants: [{
    id: 'image',
    label: typeLabel('variant-file-image')
  }, {
    id: 'image-card',
    label: typeLabel('variant-file-image-card')
  }, {
    id: 'image-list',
    label: typeLabel('variant-file-image-list')
  }],
  // required: read by the image variant alone, whose control is
  // sf-image-field -- a required, empty one keeps its form from submitting.
  params: ['accept', 'multiple', 'formats', 'uploadText', 'uploadSupportingText', 'uploadHint', 'required', 'readonly']
}, {
  type: 'color',
  label: typeLabel('type-color'),
  variants: [],
  params: ['swatches', 'required', 'readonly']
}, {
  type: 'include',
  label: typeLabel('type-include'),
  variants: [],
  params: ['language', 'required', 'readonly']
}, // money and percent (owner decisions C291 (2) and C294, 2026-11-17): the
// Framework's in every mode -- view, cell, edit and filter. Every number
// is a decimal string, never a float. money is {amount, currency}:
// `currency` fixes an ISO 4217 code (a bare amount is then read in it, and
// no currency is offered); `currencies` lists the codes a value may carry
// (absent: every ISO 4217 code, with a search); `currencyDisplay` is how
// the currency is written -- symbol (default: «₽», «$», «CA$»), code or
// name; the digits after the point are at most the currency's minor units
// (more is a field error, never rounded); min and max bound the amount.
// percent is the percent ("12.5" is 12,5 %), bounded only by min and max;
// its digits after the point are `precision`, else those of `step`.
{
  type: 'money',
  label: typeLabel('type-money'),
  numeric: true,
  variants: [],
  params: ['currency', 'currencies', 'currencyDisplay', 'min', 'max', 'placeholder', 'required', 'readonly']
}, {
  type: 'percent',
  label: typeLabel('type-percent'),
  numeric: true,
  variants: [],
  params: ['min', 'max', 'step', 'precision', 'placeholder', 'required', 'readonly']
}, // The types a component set draws (property-view port 1.18.0; Larena
// property types standard, notes of 2026-11-03): `set` names the set whose
// components show and edit them -- the View set's sf-view-properties -- and
// the Framework draws their table cells and filters (items by its number
// of rows). `params` are the keys the type reads, in the set's renderers
// and in these.
{
  type: 'items',
  label: typeLabel('type-items'),
  set: 'view',
  variants: [],
  params: ['columns', 'minRows', 'maxRows', 'required', 'readonly']
}, {
  type: 'compound',
  label: typeLabel('type-compound'),
  set: 'view',
  variants: [],
  params: ['parts', 'required', 'readonly']
}, {
  type: 'ru.requisites',
  label: typeLabel('type-ru.requisites'),
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

/***/ "b30ec5bc0edb"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OPTION_BADGE_HUES: () => (/* binding */ OPTION_BADGE_HUES),
/* harmony export */   OPTION_BADGE_PALETTE: () => (/* binding */ OPTION_BADGE_PALETTE),
/* harmony export */   nearestPaletteHue: () => (/* binding */ nearestPaletteHue),
/* harmony export */   optionBadgeProps: () => (/* binding */ optionBadgeProps)
/* harmony export */ });
/* harmony import */ var _component_badges_js_contract_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a2a9d3c2841e");

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i; // The hues of the static palette (owner decision C17), each with the OKLCH hue
// angle of its tone 50 (src/core/scss/_sf_static_palette.scss, rounded to the
// degree; tests/option-badge-palette.contract.test.mjs holds the two equal).
// Brown and gray are not reached from a hex: brown sits between orange and
// amber and differs from them by chroma alone, which a light or a dark hex
// does not keep; a colour with less chroma than GREY_CHROMA is gray. Both are
// reached by name.

const OPTION_BADGE_HUES = Object.freeze({
  red: 28,
  orange: 47,
  amber: 60,
  yellow: 89,
  lime: 119,
  green: 144,
  teal: 173,
  cyan: 203,
  sky: 232,
  blue: 259,
  indigo: 279,
  violet: 299,
  purple: 320,
  pink: 347
});
const OPTION_BADGE_PALETTE = Object.freeze([...Object.keys(OPTION_BADGE_HUES), "brown", "gray"]);
const GREY_CHROMA = 0.03;

const linear = channel => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}; // {chroma, hue} in OKLCH of a #rgb[a] / #rrggbb[aa]; the alpha is not read.


function oklchOf(hex) {
  let digits = hex.slice(1);
  if (digits.length < 6) digits = [...digits].map(digit => digit + digit).join("");
  const [r, g, b] = [0, 2, 4].map(at => linear(parseInt(digits.slice(at, at + 2), 16)));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    chroma: Math.hypot(a, bb),
    hue: (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360
  };
}
/** The static palette hue nearest a hex colour: gray when it has no hue to speak of. */


function nearestPaletteHue(hex) {
  const {
    chroma,
    hue
  } = oklchOf(hex);
  if (chroma < GREY_CHROMA) return "gray";
  let best = "gray";
  let distance = Infinity;

  for (const [name, angle] of Object.entries(OPTION_BADGE_HUES)) {
    const apart = Math.abs((hue - angle + 540) % 360 - 180);

    if (apart < distance) {
      best = name;
      distance = apart;
    }
  }

  return best;
} // The fill of a hue: tone 50 at the fill step 24 (C43: no new tones or steps;
// the alpha scale's fill family), over the place in both themes, as the 24 %
// mix of the data's hex was. The text stays on the surface colour, so the
// label reads the same in both themes. Written to the badge's public
// variables, --sf-badge-background-color and --sf-badge-color (owner decision
// C140 (2), BG-7): a colour from data reaches the badge only through them and
// only as a palette step, never the author's hex.

const paletteStyle = hue => `--sf-badge-background-color: var(--sf-${hue}-50--alfa-24); --sf-badge-color: var(--sf-on-surface)`;
/**
 * Badge look for a filter option with optionRenderer 'badge'. option.color is
 * a Framework badge scheme (success, error, info...), a hue of the static
 * palette (red, teal, gray...; C17) or a hex colour. A hue tints the badge with
 * its own palette step; a hex is drawn in the palette hue nearest it, never as
 * the raw colour (C18, C43; badges study BG-7), so the label stays readable in
 * both themes. Anything else is neutral.
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
  const name = color.toLowerCase();
  if (OPTION_BADGE_PALETTE.includes(name)) return {
    scheme: "neutral",
    rootStyle: paletteStyle(name)
  };
  if (HEX_COLOR.test(color)) return {
    scheme: "neutral",
    rootStyle: paletteStyle(nearestPaletteHue(color))
  };
  return {
    scheme: "neutral",
    rootStyle: ""
  };
}

/***/ },

/***/ "c4779e51fee1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatPlaceholder: () => (/* binding */ formatPlaceholder),
/* harmony export */   localeDateFormat: () => (/* binding */ localeDateFormat),
/* harmony export */   localeWeekStart: () => (/* binding */ localeWeekStart),
/* harmony export */   localeWeekend: () => (/* binding */ localeWeekend),
/* harmony export */   weekendDays: () => (/* binding */ weekendDays)
/* harmony export */ });
// What a locale says about its calendar, read from Intl once per locale: the
// first day of the week and the days off (Intl.Locale#getWeekInfo, the older
// weekInfo getter where a browser still has that). No DOM, so the rules are
// unit-tested as they are (tests/datepicker-c62.contract.test.mjs).
//
// Days are numbered as Date#getDay numbers them, 0 Sunday to 6 Saturday; Intl
// numbers them 1 Monday to 7 Sunday, so 7 is read as Sunday too.
const weekInfos = new Map();

function weekInfo(code) {
  if (weekInfos.has(code)) return weekInfos.get(code);
  let info = null;

  try {
    const locale = new Intl.Locale(code);
    info = (typeof locale.getWeekInfo === 'function' ? locale.getWeekInfo() : locale.weekInfo) || null;
  } catch {// An unknown locale keeps the defaults below.
  }

  weekInfos.set(code, info);
  return info;
} // The first day of the locale's week, read once per locale: the grid asks it
// several times a render. Monday where the locale does not say.


function localeWeekStart(code) {
  const first = weekInfo(code)?.firstDay;
  return Number.isInteger(first) ? first % 7 : 1;
}
const SATURDAY_SUNDAY = Object.freeze([6, 0]); // The locale's days off: Saturday and Sunday in ru, de and en-US, Friday and
// Saturday in ar-EG and he-IL. Saturday and Sunday where the locale does not say.

function localeWeekend(code) {
  const days = weekInfo(code)?.weekend;
  if (!Array.isArray(days) || !days.length) return SATURDAY_SUNDAY;
  return Object.freeze(days.map(day => day % 7));
} // The `weekend` setting (owner decision C62: days off are red, and a product
// whose weekends are working days says so). Empty: the locale's days off.
// "none": no day is a day off. Otherwise the days, comma or space separated,
// 0 or 7 Sunday, 1 Monday to 6 Saturday ("6,7" as Intl writes Saturday and
// Sunday, "5,6" for Friday and Saturday). Anything else in the list is left
// out; a list with nothing left falls back to the locale.

function weekendDays(setting, code) {
  const text = String(setting ?? '').trim().toLowerCase();
  if (!text) return new Set(localeWeekend(code));
  if (text === 'none') return new Set();
  const days = text.split(/[\s,]+/u).filter(part => /^[0-7]$/u.test(part)).map(part => Number(part) % 7);
  return new Set(days.length ? days : localeWeekend(code));
} // The date format of a locale, in the component's tokens (owner decision C62:
// typing follows the language and the country, not a fixed «ДД.ММ.ГГГГ»). The
// parts' order and the signs between them come from Intl alone:
// formatToParts of a two-digit day and month and a numeric year gives
// DD.MM.YYYY for ru and de, MM/DD/YYYY for en-US, DD/MM/YYYY for en-GB and fr,
// YYYY-MM-DD for sv-SE and en-CA. A sign before the first part or after the
// last («12.11.2026 г.» in bg, the closing dot of hu and ko) is left out: it is
// not between two numbers, and a person does not type it. Right-to-left marks
// are left out of the signs too. A locale Intl refuses, or a sign that is not
// one a date is typed with (. / - , or a space), keeps DD.MM.YYYY.

const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';
const PART_TOKENS = {
  day: 'DD',
  month: 'MM',
  year: 'YYYY'
};
const dateFormats = new Map();
function localeDateFormat(code) {
  if (dateFormats.has(code)) return dateFormats.get(code);
  let format = DEFAULT_DATE_FORMAT;

  try {
    const parts = new Intl.DateTimeFormat(code, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).formatToParts(new Date(2026, 10, 12));
    const tokens = [];
    const signs = [];
    let sign = '';

    for (const part of parts) {
      if (part.type === 'literal') {
        sign += part.value.replace(/[\u200e\u200f\u061c]/gu, '');
      } else if (PART_TOKENS[part.type]) {
        if (tokens.length) signs.push(sign);
        tokens.push(PART_TOKENS[part.type]);
        sign = '';
      }
    }

    const whole = tokens.length === 3 && new Set(tokens).size === 3 && signs.every(one => /^[\s./,-]+$/u.test(one));
    if (whole) format = tokens.reduce((text, token, index) => text + (index ? signs[index - 1] : '') + token, '');
  } catch {// An unknown locale keeps the default.
  }

  dateFormats.set(code, format);
  return format;
} // The hint in an empty field: the format written with the letters of the
// locale's own names for the parts (Intl.DisplayNames, type dateTimeField):
// ДД.ММ.ГГГГ in ru, MM/DD/YYYY in en-US, TT.MM.JJJJ in de, JJ/MM/AAAA in fr.
// A name in a script without letter case or initials (日, 年) gives the Latin
// D, M, Y, H instead.

const LATIN_LETTERS = {
  DD: 'D',
  MM: 'M',
  YYYY: 'Y',
  YY: 'Y',
  HH: 'H',
  mm: 'M'
};
const FIELD_NAMES = {
  DD: 'day',
  MM: 'month',
  YYYY: 'year',
  YY: 'year',
  HH: 'hour',
  mm: 'minute'
};
const INITIAL_RE = /^[\p{Script=Latin}\p{Script=Cyrillic}\p{Script=Greek}]/u;
const placeholders = new Map();

function letterOf(token, code) {
  try {
    const name = new Intl.DisplayNames(code, {
      type: 'dateTimeField'
    }).of(FIELD_NAMES[token]) || '';
    const first = name.trim().charAt(0);
    if (INITIAL_RE.test(first)) return first.toLocaleUpperCase(code);
  } catch {// No names for this locale: the Latin letter below.
  }

  return LATIN_LETTERS[token];
}

function formatPlaceholder(format, code) {
  const key = `${code}|${format}`;
  if (placeholders.has(key)) return placeholders.get(key);
  const text = String(format || '').replace(/YYYY|YY|MM|DD|HH|mm/gu, token => letterOf(token, code).repeat(token.length));
  placeholders.set(key, text);
  return text;
}

/***/ },

/***/ "7623a90f1816"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SUPPORTED_PORT_VERSIONS: () => (/* binding */ SUPPORTED_PORT_VERSIONS),
/* harmony export */   SfPropertyView: () => (/* binding */ SfPropertyView)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _view_table_js_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("17828be41e75");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("3ea81f4c3c20");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("4284cc8c32e1");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("99fb492b7fba");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d614908e644f");
/* harmony import */ var _core_js_icon_choices_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("1b42c5117087");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("18003344cff0");
/* harmony import */ var _core_js_density_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("1412c5875b4d");
/* harmony import */ var _core_js_clipboard_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("e081a020262e");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("40b137e60526");
/* harmony import */ var _js_conditions_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("844bdc4d24eb");
/* harmony import */ var _js_set_fields_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("db94c32f22be");
/* harmony import */ var _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("e5483002f3ea");
/* harmony import */ var _js_history_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("f8f76dff9bfe");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_icon_choices_js__WEBPACK_IMPORTED_MODULE_7__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12__, _js_templates_default__WEBPACK_IMPORTED_MODULE_13__, _js_set_fields_js__WEBPACK_IMPORTED_MODULE_15__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_16__, _js_history_js__WEBPACK_IMPORTED_MODULE_17__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_icon_choices_js__WEBPACK_IMPORTED_MODULE_7__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12__, _js_templates_default__WEBPACK_IMPORTED_MODULE_13__, _js_set_fields_js__WEBPACK_IMPORTED_MODULE_15__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_16__, _js_history_js__WEBPACK_IMPORTED_MODULE_17__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12__);
// One object's fields, shown and edited. The pair to sf-view: that one is a
// set of records in any layout, this one is a single object -- a storage record,
// a related record, site settings, a profile. Named for the property rather than
// for the record because nothing in it knows what kind of object is behind a
// field; the renderer set it draws through is addressed by a property type, and a
// name saying `record` would narrow the component below its own contents.
//
// The host owns values, revisions, rights and addresses. This element owns the
// arrangement on screen and nothing else: it stores no value and no revision of
// its own, and every change leaves through the port.
//
// It renders into its own light DOM, like every other Smart component. The first
// version used a shadow root, and the field controls inside it came out with
// their markup and none of their CSS: a document stylesheet does not cross a
// shadow boundary. sf-view avoids this by slotting its children and says so
// beside the slot. A consumer found it on their stand.






 // The glyphs are the Framework's choice list (core/js/icon-choices.js, core.runtime
// 1.25.0; duplication audit 2026-11-03 A-1), shared with sf-admin-menu.







 // The day-and-time reading is the field renderers' (A-14): this view kept a
// copy from before it was lifted into the Framework.




 // Every port version this composite accepts, in one place, the way sf-view
// keeps its list -- a guard naming a narrower set than the published versions is
// a component refusing a host it asked to move. The contract test beside this
// file compares the list with the manifest.

const SUPPORTED_PORT_VERSIONS = ["1.0.0", "1.1.0", "1.2.0", "1.3.0", "1.4.0", "1.5.0", "1.6.0", "1.7.0", "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.15.0", "1.16.0", "1.17.0", "1.18.0", "1.19.0", "1.20.0", "1.21.0", "1.22.0"]; // The surface's mode (owner, 2026-10-14). view: show the object, never offer
// a change. auto: show it and offer what this person may do. edit: every group
// open at once, one save. create: an empty object of the collection, every
// field open, one create.

const MODES = ["view", "auto", "edit", "create"]; // How long an opened panel waits for its title before leaving the first focus
// where the drawer put it: the drawer's own wait for a late field (two seconds).

const TITLE_FOCUS_WAIT_MS = 2000; // The most candidates a picker asks for at once, from a host on port 1.14.0 or
// later (an earlier port's field.options payload is closed and would refuse
// it). Twenty is the page the record picker was built and measured against
// with the consumer's 448 targets; the host may answer fewer, and says which
// page is the last by its cursor, not by a short page.

const OPTIONS_PAGE_LIMIT = 20; // The property types picked from a list the host pages: the records and people,
// and since 1.14.0 a lookup whose list is not inline.

const PAGED_TYPES = ["record", "relation", "user", "lookup"]; // A group the host has not read yet (port 1.15.0, group.load): its fields are
// empty and its field_count says how many it holds. An empty group is a group
// with field_count 0 or none, never one waiting for its read.

const groupNotRead = group => Number.isInteger(group?.field_count) && group.field_count > 0 && (!Array.isArray(group.fields) || group.fields.length === 0);

const versionAtLeast = (version, minimum) => {
  const parts = value => String(value ?? "").split(".").map(part => Number.parseInt(part, 10) || 0);

  const [a, b] = [parts(version), parts(minimum)];

  for (let index = 0; index < 3; index += 1) {
    if ((a[index] ?? 0) !== (b[index] ?? 0)) return (a[index] ?? 0) > (b[index] ?? 0);
  }

  return true;
}; // Every panel open on the page is a layer of the Framework's one document layer
// stack (core layer-stack.js, standard 1.3.8 §19), through the sf-drawer that
// carries it -- the stack sf-modal, the drawers and the menus share. A stack of
// panels is not one state held for several records: each window is its own
// element with its own record, its own open group and its own unsaved changes --
// which is what «такое же представление поверх» means, and what leaves a
// half-edited window intact underneath the one above it. What lies between the
// windows is the stack's: which one is on top and takes Escape, how high each is
// drawn, the dim each modal layer lays over what is below it, and where focus
// goes when one closes. This component kept a list of its own for that, an
// Escape listener of its own and a dim of its own until 1.13.0; its list did not
// know about a modal, so Escape under an sf-modal opened from a panel closed the
// panel instead of the modal.
// The same query sf-drawer docks on, written the same way so a reader grepping
// 48rem finds both. The Framework's own breakpoint array has no 48rem step -- its
// nearest is md at 720px -- but the panel *is* a drawer, and flipping the panel's
// arrangement 48px away from where the drawer changes its own behaviour would be
// visible in that gap. The split between the breakpoint array and the pixel values
// components use is reported rather than settled here.


const WIDE_MEDIA_QUERY = "(min-width: 48rem)"; // What the drawer's close reasons (standard 1.3.8 §19.3) are as this panel's:
// the drawer draws no close control of its own here, so its `close` is a script
// asking; `outside` is a press on the dimmed page.

const DRAWER_CLOSE_REASONS = {
  escape: "escape",
  outside: "outside",
  close: "api",
  api: "api"
}; // The column the list of sections takes. It is here rather than in the
// stylesheet because the panel's own width is computed from it, and the drawer
// that carries the panel is placed outside this component's subtree: a custom
// property declared on the element never reaches it. The stylesheet reads this
// through `--sf-property-view--sections-width`, which the component passes to
// the panel and sets on the layout it draws in place.

const SECTIONS_WIDTH = "var(--sf-view-properties-sections-width, 12rem)"; // How the record is edited (C305 (1), RC-1): a group with its Save, plus the
// short fields in a window at their value (the table's cell edit, C296), or
// nothing. A short field is one choice, a date, a time, a yes/no, a person or
// a number: one control, nothing to read around it.

const EDIT_MODES = ["group", "group+quick", "none"];
const QUICK_TYPES = new Set(["choice", "enum", "select", "dropdown", "date", "datetime", "time", "boolean", "user", "number", "integer"]); // The types sf-form cannot draw for the card (C182): the set's own (money,
// percent, rows, compound), a file or an image that uploads through the host,
// and a reference picked from the host's pages. A group holding one keeps the
// card's own form until sf-form takes a host for them (order FO-C305-1).

const FORMLESS_TYPES = new Set(["file", "files", "image", "images", "record", "relation", "lookup", "user"]); // From 80rem the full screen keeps the history in a column of its own (C305 (3)).

const SIDE_MEDIA_QUERY = "(min-width: 80rem)"; // From 64rem a panel is a docked column beside the list (C305 (4)); narrower
// it floats over a scrim.

const DOCK_BREAKPOINT = "64rem";
const HISTORY_PAGE = 20; // The panel's widths are sf-drawer's ladder and nothing else (C157 (2), C289
// (2)): 20, 24 and 30rem and the whole screen. `panel-width` is the dated
// former name (until 2027-01-01): a width it asks for lands on the nearest
// step, and anything wider than the widest step on that step -- Larena's 40rem
// and ui-admin's 44rem take 30rem. A record that needs more room opens on the
// whole screen, where its sections stand in a column.

const PANEL_STEPS = [["1/2", 20], ["1", 24], ["2", 30]];
const PANEL_WIDTH_UNTIL = "2027-01-01";

const nearestPanelStep = width => {
  const found = /^\s*(\d+(?:\.\d+)?)\s*(rem|em|px)\s*$/u.exec(String(width ?? ""));
  if (!found) return "2";
  const rem = found[2] === "px" ? Number(found[1]) / 16 : Number(found[1]);
  let best = PANEL_STEPS[0];

  for (const step of PANEL_STEPS) if (Math.abs(step[1] - rem) < Math.abs(best[1] - rem)) best = step;

  return best[0];
}; // The tags the card draws, asked of the Loader before they are needed
// (component-set standard draft 1.1 §7.11, VF-16): a page that defined none of
// them -- a chat message, a card printed into a page by itself -- gets the
// whole card, not its markup. The rule's relations name most of them; asking
// costs nothing for a tag already defined.


const DRAWN_TAGS = ["sf-drawer", "sf-button", "sf-button-icon", "sf-button-close", "sf-tabs", "sf-list", "sf-list-description", "sf-help-mark", "sf-empty-state", "sf-confirm", "sf-menu-context", "sf-badge", "sf-icon", "sf-popover", "sf-form", "sf-list-timeline", "sf-menu"]; // How long the copy control shows its tick. The Framework's own clipboard holds
// its tick for this long, and two controls that say «copied» for two different
// lengths are two conventions where there is one act.

const COPY_FEEDBACK_MS = 5000; // A payload is copied so that a host cannot mutate what the component still
// holds. Copying it through JSON destroys anything that is not plain data, and
// the upload intent carries a File: it arrived at the host as an empty object,
// so its name was undefined, the host's own size check never matched, and a file
// it would have refused was accepted instead. Found by a probe asserting that
// what arrives is a File, which is the only reason it was not shipped.
//
// So the plain parts are copied and anything that is not plain is passed by
// reference. The protection was always about data; a File is not data the
// component can own a second copy of.

const isPlain = value => value === null || ["string", "number", "boolean", "undefined"].includes(typeof value) || typeof value === "object" && (Array.isArray(value) || value.constructor === Object);

const copy = value => {
  if (value == null) return value;
  if (typeof value !== "object" || !isPlain(value)) return value;
  if (Array.isArray(value)) return value.map(item => copy(item));
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, copy(item)]));
}; // The Framework speaks English by default and Russian on a Russian page, as
// src/core/js/page-language states for every component. This composite
// carried Russian defaults instead, so an English page drew a panel entirely
// in Russian -- beside an sf-input-color inside it that followed the rule and said
// «inherited». A product still overrides any of these by attribute.
// The words are the language files' (lang/<locale>.json, standard 1.3.8 §11),
// read under the camelCase keys a product registers more languages by.


const camelWords = (words = {}) => Object.fromEntries(Object.entries(words).map(([key, word]) => [key.replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase()), word]));

const PROPERTY_VIEW_TEXT = {
  en: camelWords(_lang_en_json__WEBPACK_IMPORTED_MODULE_5__.runtime),
  ru: camelWords(_lang_ru_json__WEBPACK_IMPORTED_MODULE_6__.runtime)
};
const SECTION_ICONS = _core_js_icon_choices_js__WEBPACK_IMPORTED_MODULE_7__.ICON_CHOICES; // The refusal codes of a view write (port 1.22.0; Larena backend c311-reply)
// and the pack's words for them.

const VIEW_REFUSALS = {
  view_invalid: "viewRefusedInvalidText",
  admin_record_view_changed: "viewChangedText",
  admin_record_layout_shared_denied: "viewRefusedSharedDeniedText",
  admin_record_view_own: "viewRefusedOwnText",
  admin_record_view_unknown: "viewRefusedUnknownText",
  admin_record_view_required: "viewRefusedRequiredText",
  admin_record_layout_lock_invalid: "viewRefusedLockInvalidText",
  admin_record_layout_head_invalid: "viewRefusedHeadInvalidText",
  admin_record_layout_icon_invalid: "viewRefusedIconInvalidText"
}; // sf-view-properties from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §8, §11): its own props below keep their parsers; what they
// do not name is the manifest's. The actions answer outcomes
// (../table/js/manifest-actions.js), the events take the vocabulary's
// verbs, and the old names follow once through the dated aliases.

const PropertyViewElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
});

class SfPropertyView extends PropertyViewElement {
  // The history adapter for a host that stores a snapshot per revision
  // (js/history.js): record.history answered from neighbouring revisions.
  static historyFromRevisions(revisions, options) {
    return (0,_js_history_js__WEBPACK_IMPORTED_MODULE_17__.historyFromRevisions)(revisions, options);
  }

  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      recordId: {
        attribute: "record-id",
        default: ""
      },
      collection: {
        default: ""
      },
      showRare: {
        attribute: "show-rare",
        type: Boolean,
        default: false
      },
      // 1, or 1/2 beside a table at 1/2: the record read a step larger
      // than the list it was opened from (owner, 2026-10-14).
      size: {
        default: "1"
      },
      // view | auto | edit | create: what the surface is placed to do
      // (owner, 2026-10-14). The person's rights narrow it.
      mode: {
        default: "auto"
      },
      emptyText: {
        attribute: "empty-text",
        default: "not filled in"
      },
      emptyRecordText: {
        attribute: "empty-record-text",
        default: "This record has nothing to show"
      },
      editText: {
        attribute: "edit-text",
        default: "Edit"
      },
      saveText: {
        attribute: "save-text",
        default: "Save"
      },
      cancelText: {
        attribute: "cancel-text",
        default: "Cancel"
      },
      deleteText: {
        attribute: "delete-text",
        default: "Delete"
      },
      changedText: {
        attribute: "changed-text",
        default: "Fields changed"
      },
      errorsText: {
        attribute: "errors-text",
        default: "Errors"
      },
      conflictText: {
        attribute: "conflict-text",
        default: "The record changed; read it again"
      },
      sectionsLabel: {
        attribute: "sections-label",
        default: "Sections"
      },
      // How the sections are laid out. A list beside the groups is right
      // for a settings screen with many of them; a row of tabs is right
      // for a record with a few, and is what the mockup drew first.
      sectionsAs: {
        attribute: "sections-as",
        default: "list",
        values: ["list", "tabs"]
      },
      panel: {
        type: Boolean,
        default: false
      },
      panelSize: {
        attribute: "panel-size",
        default: "1",
        values: ["1/2", "1", "2", "full"]
      },
      panelLabel: {
        attribute: "panel-label",
        default: ""
      },
      panelWidth: {
        attribute: "panel-width",
        default: ""
      },
      closeLabel: {
        attribute: "close-label",
        default: "Close"
      },
      copyLinkLabel: {
        attribute: "copy-link-label",
        default: "Copy link"
      },
      linkCopiedLabel: {
        attribute: "link-copied-label",
        default: "Link copied"
      },
      openFullLabel: {
        attribute: "open-full-label",
        default: "Open as a page"
      },
      configureText: {
        attribute: "configure-text",
        default: "Arrange the view"
      },
      doneConfiguringText: {
        attribute: "done-configuring-text",
        default: "Done"
      },
      resetViewText: {
        attribute: "reset-view-text",
        default: "Reset"
      },
      resetViewAskText: {
        attribute: "reset-view-ask-text",
        default: "Reset the whole view?"
      },
      cancelConfiguringText: {
        attribute: "cancel-configuring-text",
        default: "Cancel"
      },
      personalLayerText: {
        attribute: "personal-layer-text",
        default: "Personal"
      },
      viewProfileLabel: {
        attribute: "view-profile-label",
        default: "View"
      },
      addViewText: {
        attribute: "add-view-text",
        default: "Add a view"
      },
      newViewText: {
        attribute: "new-view-text",
        default: "New view"
      },
      deleteViewText: {
        attribute: "delete-view-text",
        default: "Remove the view"
      },
      lastSharedViewText: {
        attribute: "last-shared-view-text",
        default: "The only view everyone has"
      },
      sharedLayerText: {
        attribute: "shared-layer-text",
        default: "Everyone's"
      },
      widthText: {
        attribute: "width-text",
        default: "Full width"
      },
      fieldLabelText: {
        attribute: "field-label-text",
        default: "Name"
      },
      sectionIconText: {
        attribute: "section-icon-text",
        default: "Section glyph"
      },
      sectionIcons: {
        attribute: "section-icons",
        default: ""
      },
      variantText: {
        attribute: "variant-text",
        default: "Template"
      },
      hintText: {
        attribute: "hint-text",
        default: "Hint"
      },
      hiddenText: {
        attribute: "hidden-text",
        default: "Hide"
      },
      configureHintText: {
        attribute: "configure-hint-text",
        default: "Drag fields between groups and onto a section on the left. Applied at once."
      },
      configureHintNarrowText: {
        attribute: "configure-hint-narrow-text",
        default: "Drag fields between groups. Applied at once."
      },
      fieldSettingsText: {
        attribute: "field-settings-text",
        default: "Field settings"
      },
      shownText: {
        attribute: "shown-text",
        default: "Shown"
      },
      showRareText: {
        attribute: "show-rare-text",
        default: "Show rare fields"
      },
      hideRareText: {
        attribute: "hide-rare-text",
        default: "Hide rare fields"
      },
      rareText: {
        attribute: "rare-text",
        default: "rare"
      },
      unplacedTitle: {
        attribute: "unplaced-title",
        default: "Not placed"
      },
      moveUpText: {
        attribute: "move-up-text",
        default: "Move up"
      },
      moveDownText: {
        attribute: "move-down-text",
        default: "Move down"
      },
      addFieldText: {
        attribute: "add-field-text",
        default: "Add a field"
      },
      inThisGroupText: {
        attribute: "in-this-group-text",
        default: "In this area"
      },
      renameText: {
        attribute: "rename-text",
        default: "Rename"
      },
      saveNameText: {
        attribute: "save-name-text",
        default: "Save the name"
      },
      cancelNameText: {
        attribute: "cancel-name-text",
        default: "Leave the name"
      },
      removeFieldText: {
        attribute: "remove-field-text",
        default: "Remove from this area"
      },
      removeGroupText: {
        attribute: "remove-group-text",
        default: "Remove this area"
      },
      removeSectionText: {
        attribute: "remove-section-text",
        default: "Remove this section"
      },
      addGroupText: {
        attribute: "add-group-text",
        default: "Add an area"
      },
      addSectionText: {
        attribute: "add-section-text",
        default: "Add a section"
      },
      newGroupTitle: {
        attribute: "new-group-title",
        default: "New area"
      },
      newSectionTitle: {
        attribute: "new-section-title",
        default: "New section"
      },
      noMatchText: {
        attribute: "no-match-text",
        default: "Nothing matches"
      },
      unplacedHintText: {
        attribute: "unplaced-hint-text",
        default: "Fields this view does not show. Drag one into a group to place it, or drag a field here to take it out."
      },
      viewConflictText: {
        attribute: "view-conflict-text",
        default: "The view changed and was read again"
      },
      viewDeniedText: {
        attribute: "view-denied-text",
        default: "You may not change this layer"
      },
      backLabel: {
        attribute: "back-label",
        default: "Back"
      },
      collectionLabel: {
        attribute: "collection-label",
        default: ""
      },
      collectionIcon: {
        attribute: "collection-icon",
        default: ""
      },
      favourite: {
        type: Boolean,
        default: false
      },
      favouriteLabel: {
        attribute: "favourite-label",
        default: "Favourite"
      },
      menuLabel: {
        attribute: "menu-label",
        default: "More"
      },
      inheritedText: {
        attribute: "inherited-text",
        default: "by default"
      },
      // C305 (1)-(4): how the record is edited, whether it shows its
      // history, and whether a panel is a column beside the list.
      edit: {
        default: "group+quick",
        values: EDIT_MODES
      },
      history: {
        default: "auto",
        values: ["auto", "off"]
      },
      modal: {
        default: "auto",
        values: ["auto", "true"]
      }
    };
  }

  constructor() {
    super();
    this.hostPort = null; // What the host last answered with, held for rendering only. Never written
    // to and never the source of a save: a save sends the fields the person
    // changed against the revision the host gave, and the host answers with
    // the object as it now is.

    this.record = null;
    this.sections = [];
    this.selectedSection = null; // Which name is being typed, while it is being typed. A rename is not
    // written until it is confirmed, so an area keeps its name while a
    // person is still deciding on another.

    this.renaming = null; // What the arrangement was when the mode was entered, and whether a
    // reset has been asked for and is waiting to be confirmed.

    this.arrangementEntered = null;
    this.resetAsked = false;
    this.epoch = 0; // Reading by group (port 1.15.0, capability group-load): the revision of
    // the record each group's fields were read at. A group read at another
    // revision than the record's now is read again the next time it is shown;
    // the record has one revision, never one per group.

    this.groupReads = new Map();
    this.groupsReading = new Set(); // A group refused as unknown-group, by the revision it was refused at:
    // the arrangement is read again once for it, and an arrangement that
    // still names it does not make the panel ask again at that revision.

    this.groupsRefused = new Map();
    this.groupEpoch = 0;
    this.message = ""; // Which group is open, and what has been changed in it. Only changed
    // fields are held: a save carries what was touched and nothing else, so it
    // cannot overwrite a field somebody else saved meanwhile.

    this.editing = null;
    this.changed = new Map();
    this.errors = new Map(); // What is wrong with an entry a field control reports it cannot write
    // yet (inputErrors). The view's own, so a host's refusal does not
    // replace them; a save waits until they are put right.

    this.inputErrors = new Map(); // The keys of inputErrors a field control reported itself (port 1.16.0:
    // a masked string that does not fill its mask, through the renderer
    // set's setFieldError). The control draws that message under itself, so
    // the panel holds the save for it and does not draw it a second time.

    this.controlErrors = new Set();
    this.conflict = null; // A save the host will make only once confirmed (port 1.14.0): what it
    // said the save will do and the digest it issued for it, held until the
    // person confirms or goes back to editing. Nothing is written meanwhile,
    // and what was entered stays.

    this.confirmation = null; // Candidate records for a reference field, per field: the page the host
    // last answered with and the search it was answered for. Held for
    // rendering only, and dropped when the search changes -- a page is not the
    // whole set, so keeping pages across searches would show stale matches.

    this.optionPages = new Map();
    this.optionSearches = new Map(); // One counter per field, because every reference field in a group is read
    // at the same moment and a single counter kept only the last answer.

    this.optionEpochs = new Map(); // Files in flight, per field, in the shape sf-file-upload reads. The host
    // stores them and reports what it reports; the component times nothing,
    // because a progress bar over a transfer it does not perform would be a
    // bar that lies.

    this.uploads = new Map(); // How the arrangement resolved and what this person may change about it,
    // as the host stated it. Absent means the view cannot be configured, and
    // no control that would lead there is drawn.

    this.view = null;
    this.configuring = false; // True while this component opened the not-placed bin for a drag, so it
    // can close it again and leave a bin the person opened alone.

    this._openedForDrag = false;
    this.viewTarget = "personal"; // The layer being edited, as a working copy of what the host sent for it.
    // A layer carries only the entries it decides; the component edits that
    // and writes it back, rather than writing the whole resolved arrangement
    // into it -- a personal layer restating every entry would pin the view and
    // stop any later change to the shared layer from showing through.

    this.layerDraft = null;
    this.entryErrors = new Map(); // One counter for the view writes, for the same reason the field options
    // have one each: an answer that arrives after the next write began is not
    // about the arrangement on screen.

    this.viewEpoch = 0; // Wide until something says otherwise: a first render that assumed a phone
    // would draw the narrow arrangement on a desktop for one frame.

    this.wide = true;
    this.wideMedia = null; // On a phone the sections are a list and a section is the next screen.
    // Null is the list; a key is that section's screen.

    this.phoneSection = null; // A short field edited in a window at its value (C305 (1)):
    // {section, group, key} while it is open. Its entry is held in
    // `changed` as a group's is, and saved as group.save with that one value.

    this.quick = null; // The field the last save wrote, marked for a moment (the saved colour).

    this.savedKeys = new Set(); // The whole record opened from «⋯ → Изменить всё» (mode edit for a while).

    this.editAll = false; // A close (or a step to the next record) asked over unsaved entries
    // (C159 (6)): {kind: close|step, reason|direction} until answered.

    this.leaveAsk = null; // The record's history (C305 (2)): open as a level of the panel, or in
    // the full screen's side column; its events as the port answered them.

    this.historyOpen = false;
    this.historyFeed = null;
    this.historyEpoch = 0;
    this.sideWide = false;
    this.sideMedia = null; // The group drawn by sf-form while it is edited: its fields and saved
    // value, kept for the edit so a render never resets the form.

    this.formEdit = null;
    this._focusFieldAfterRender = null;
  } // Declaring a prop does not create an accessor for it: `static get props()`
  // tells the template context and the manifest what the component takes, and
  // every component writes the getters it reads itself. Without these,
  // `this.recordId` and `this.collection` were undefined and both intents went
  // to the host with a null record, `this.showRare` was undefined so a rare
  // group never appeared, and `this.conflictText` was undefined so a conflict
  // with no message of its own said nothing at all. Found by the probe; the
  // same family as the raw-props work in the other Framework session, from the
  // other side of the same assumption.


  get recordId() {
    return this.getAttribute("record-id") || "";
  }

  get collection() {
    return this.getAttribute("collection") || "";
  }

  get showRare() {
    return this.getBooleanAttr("show-rare", false);
  } // A record the host answered with and that holds nothing visible is a state
  // of its own: without a word for it the panel is an empty box that reads as
  // something still loading.


  get emptyRecordText() {
    return this.getAttribute("empty-record-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "emptyRecordText", this);
  }

  get isEmptyRecord() {
    if (!this.record) return false;
    const sections = this.sections ?? [];
    if (!sections.length) return true;
    return !sections.some(section => (section.groups ?? []).some(group => group.kind === "related" || (group.fields ?? []).length > 0));
  }

  get emptyText() {
    return this.getAttribute("empty-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "emptyText", this);
  }

  get editText() {
    return this.getAttribute("edit-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "editText", this);
  }

  get saveText() {
    return this.getAttribute("save-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveText", this);
  }

  get cancelText() {
    return this.getAttribute("cancel-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "cancelText", this);
  }

  get deleteText() {
    return this.getAttribute("delete-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "deleteText", this);
  } // What the host allows on the record itself, as it allows it per row in a
  // data view. The component offers nothing the host did not name: a delete
  // the host would refuse is a control that exists to fail.
  // Fields the collection has that this view places in no group. They are not
  // hidden: hiding keeps a field where it is and dims it, while these are out
  // of the arrangement altogether, and only the arranging mode draws them.


  get unplaced() {
    const fields = this.record?.unplaced;
    return Array.isArray(fields) ? fields : [];
  } // Taking a field out of every group, and putting one back. A field out of
  // the arrangement is the layer saying its group is nothing, which is what
  // the port means by a null group.


  moveFieldToUnplaced(fieldKey, index, {
    save = true
  } = {}) {
    if (!this.configuring || !this.layerDraft) return false; // «Стадия» the admin locked stays shown (port 1.22.0 view.locked).

    if (this.lockedForMe(`fields.${String(fieldKey)}.hidden`)) return false;
    let moved = null;
    let fromGroup = null;

    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        const at = (group.fields ?? []).findIndex(field => String(field.key) === String(fieldKey));

        if (at >= 0) {
          fromGroup = group;
          [moved] = group.fields.splice(at, 1);
          break;
        }
      }

      if (moved) break;
    }

    if (!moved) return false;
    const into = this.record.unplaced ?? (this.record.unplaced = []);
    const at = Math.max(0, Math.min(Number.isInteger(index) ? index : into.length, into.length));
    into.splice(at, 0, moved);

    this._writeOrder(this.layerDraft.fields, into, {
      group: null
    });

    if (fromGroup) this._writeOrder(this.layerDraft.fields, fromGroup.fields ?? [], {
      group: String(fromGroup.key)
    });
    this.requestComponentUpdate("view-move");
    return save ? this.saveView() : true;
  }

  get recordActions() {
    const actions = this.record?.actions;
    return Array.isArray(actions) ? actions.map(action => String(action)) : [];
  } // Deleting is the host's, including whether to ask first. The component says
  // it was asked for and closes when the host says it is done; a host that
  // refuses sends its reason and the panel stays open with it on screen.


  async deleteRecord() {
    if (this.mode === "view" || this.mode === "create" || !this.recordActions.includes("record.delete")) return false;
    const answer = await this._raise("record.delete", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      revision: this.record?.revision ?? null
    }); // Vocabulary §5 delete; sf-property-view-delete-record follows once (aliases.json).

    this.sfEmit("delete", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      revision: this.record?.revision ?? null,
      answer: answer?.answer ?? null
    });
    if (!answer) return false;

    if (answer.answer === "applied") {
      this.closePanel("deleted");
      return true;
    } // The person said no to the host's question: nothing to report.


    if (answer.reason === "cancelled") {
      this._setState("ready");

      return false;
    }

    this.message = answer.message || answer.reason || this.viewDeniedText;

    this._setState("ready");

    this.requestComponentUpdate("delete-refused");
    return false;
  }

  get changedText() {
    return this.getAttribute("changed-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "changedText", this);
  }

  get errorsText() {
    return this.getAttribute("errors-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "errorsText", this);
  }

  get conflictText() {
    return this.getAttribute("conflict-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "conflictText", this);
  }

  get sectionsAs() {
    return this.getEnumAttr("sections-as", ["list", "tabs"], "list");
  }

  get sectionsLabel() {
    return this.getAttribute("sections-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "sectionsLabel", this);
  } // A panel is a drawer over the page; `full` (the record as the page,
  // stand 24's record panel) draws it in place instead.


  get panel() {
    return this.getBooleanAttr("panel", false) && !this.full;
  }

  get full() {
    return this.getBooleanAttr("full", false);
  }

  set full(value) {
    this.toggleAttribute("full", Boolean(value));
  } // A panel shows while its element is not hidden and not closed by `open`
  // (simai/ui-pro#4; standard 1.3.8 §7.2.2, §19): a page or an assembly
  // closes it by `hidden` or open=false and brings it back by the same.


  get panelOpen() {
    return this.panel && !this.hidden && this.getAttribute("open") !== "false";
  } // The drawer opens and closes with it and takes the panel on and off the
  // layer stack; there is nothing to register here.


  syncPanelOpen() {
    this.requestComponentUpdate("panel-open");
  } // ---------- the manifest's values (§4) ----------


  get revision() {
    return this.record?.revision === undefined || this.record?.revision === null ? "" : String(this.record.revision);
  }

  get section() {
    return this.selectedSection ?? "";
  } // The step the drawer is drawn at (C289 (2)): panel-size when it names a
  // step; else the step nearest the width a former `panel-width` asked for.
  // Not a getter named panelSize: the declared property of that name is the
  // attribute's own accessor and wins over a getter, so a panel-width alone
  // was drawn at the default step 1.


  get drawerStep() {
    const size = this.getAttribute("panel-size");
    if (["1/2", "1", "2", "full"].includes(size)) return size;
    const width = this.panelWidth;
    return width ? nearestPanelStep(width) : "1";
  } // How the sections are laid out (C289 (1), (5); R250): the component
  // decides by width and the person does not set it. A panel on a phone is
  // the list of sections, each opening as a level with «←»; a panel on the
  // whole screen keeps a column on the left; any narrower panel draws a line
  // of tabs under its head, what does not fit in «Ещё (n)». In place (not a
  // panel) a wide page keeps `sections-as`.


  get sectionsLayout() {
    if (!this.wide) return "phone"; // Arranging keeps the rail of sections beside the groups, each its own
    // scroller, in a panel of any step: the sections are dragged there.

    if (this.panel) return this.drawerStep === "full" || this.configuring ? "column" : "tabs";
    return this.sectionsAs === "tabs" ? "tabs" : "column";
  } // Once per element: a former `panel-width` is said in the console with
  // the step it lands on, and noted in SF.deprecations.


  _notePanelWidth() {
    const width = this.panelWidth;
    if (!width || this.hasAttribute("panel-size") || this._panelWidthNoted === width) return;
    this._panelWidthNoted = width;
    const step = nearestPanelStep(width);
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12__.noteDeprecated)({
      component: "sf-view-properties",
      kind: "attribute",
      from: "panel-width",
      to: "panel-size",
      since: "2026-11-17",
      remove_after: PANEL_WIDTH_UNTIL,
      package: "view"
    });
    globalThis.console?.info?.(`[SIMAI Framework] sf-view-properties: panel-width="${width}" is a former name until ${PANEL_WIDTH_UNTIL}; the panel is drawn at the step panel-size="${step}" (C157 (2), C289 (2)).`);
  }

  get panelLabel() {
    return this.getAttribute("panel-label") || "";
  }

  get panelWidth() {
    return this.getAttribute("panel-width") || "";
  }

  get size() {
    return this.getAttribute("size") === "1/2" ? "1/2" : "1";
  } // The size written on the controls the panel draws: the host's own when it
  // has one, none when it has not, so page density moves them with the page
  // (C22), as sf-view and sf-view-table do since view 1.6.0. With size 1
  // written on them they stayed 40 under compact density beside the page's
  // 32. `size` still chooses the panel's own type steps (1/2 or 1).


  get controlSize() {
    const size = this.getAttribute("size");
    return size === "1/2" || size === "1" ? size : null;
  }

  get mode() {
    const value = this.getAttribute("mode");
    return MODES.includes(value) ? value : "auto";
  } // Whether this person may change the fields. A view surface never offers
  // it; since port 1.12.0 the host says so with record.edit among the
  // record's actions, and a reader is sent none. A host on an earlier port
  // never sent it, and for it a group is editable unless it says otherwise.


  get mayEdit() {
    if (this.mode === "view" || this.editMode === "none") return false;
    if (this.mode === "create") return true;
    if (!versionAtLeast(this.hostPort?.version, "1.12.0")) return true;
    return this.recordActions.includes("record.edit");
  } // Every group open at once: a full edit page, or a create.


  get openAll() {
    return this.mode === "create" || (this.mode === "edit" || this.editAll) && this.mayEdit;
  } // C305 (1): group | group+quick | none; group+quick by default wherever
  // the record may be edited, the same short fields the table edits at the
  // cell (C296).


  get editMode() {
    const value = this.getAttribute("edit");
    return EDIT_MODES.includes(value) ? value : "group+quick";
  } // The window at a value is SIMAI Framework sf-popover: where the page has
  // not defined it yet, a short field goes through its group as before.


  get quickEdit() {
    return this.editMode === "group+quick" && this.mayEdit && !this.openAll && !this.configuring && Boolean(globalThis.customElements?.get?.("sf-popover"));
  } // A short field: one control at its value, by its type. A list of several,
  // a set type, a condition and a read-only field go through the group. (A
  // field's own say -- a port field key -- is ordered with the port edition.)


  isQuickField(field) {
    if (!field || field.readonly === true || field.when || field.multiple === true) return false;
    const type = String(field.propertyType || field.type || "");
    if (!QUICK_TYPES.has(type) || (0,_js_set_fields_js__WEBPACK_IMPORTED_MODULE_15__.drawsSetField)(field)) return false; // A person picked from the host's pages needs the picker's host.

    if (type === "user" && !this.canPickRecords) return false;
    return true;
  } // C305 (2): the history is offered where the host answers record.history
  // (capability record-history) and the page did not turn it off.


  get historyOffered() {
    return this.getAttribute("history") !== "off" && this.mode !== "create" && Boolean(this.recordId) && Boolean(this.hostPort?.capabilities?.includes?.("record-history"));
  } // C305 (3): the full screen keeps the history in a column of its own
  // from 80rem; narrower it is a level of the panel, as in a panel.


  get historySide() {
    return this.historyOffered && this.sideWide && this.sectionsLayout === "column" && !this.configuring && (this.drawerStep === "full" || !this.panel);
  } // C305 (4): a panel narrower than the screen is a column beside the list
  // from 64rem (sf-drawer docked), the list usable; below it, and with
  // modal="true", it floats over a scrim.
  // A panel opened over another card's panel (a related record, C289 (6))
  // stays a window over the one below, which the Framework's overlay dims.


  get docked() {
    if (!this.panel || this.getAttribute("modal") === "true" || this.drawerStep === "full") return false; // Only a panel below counts: the one under a related record stays docked.

    const own = this._ownDrawer();

    const cards = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.openLayers)("panel").filter(owner => owner?.parentElement?.localName === this.localName);
    const at = cards.indexOf(own);
    return at === -1 ? cards.length === 0 : at === 0;
  } // What the drawer is told to be. `size` is a ladder and its widest step short
  // of full measured 391px on a consumer's screen, which is too narrow for two
  // columns -- labels wrapped and a record title broke over three lines. `width`
  // is a declared input on sf-drawer, so a consumer can ask for 40rem and get
  // it. A deeper window in the stack is a step narrower than whatever the base
  // is, so the one below shows along its leading edge.
  // The width a consumer asked for, and nothing else. A stacked panel used to be
  // narrowed from it here, by a step this component counted itself -- interim
  // work while sf-drawer had no way to express a stack. It does now: the drawer
  // insets each window by depth times `stack-offset` and keeps its width, so a
  // stack four deep no longer ends in a sliver. The two interim mechanisms this
  // replaced had drifted apart from each other as well -- the width subtracted a
  // space-5 step while the panel margin drew a space-4 one, so the window moved
  // one distance and shrank by another.
  //
  // A section list is added to the panel rather than taken out of it (owner,
  // 2026-10-07): the fields keep the width the consumer asked for and the
  // window grows by the column beside them. Taken out, a 40rem panel showing
  // sections gave its fields 26rem and the two-column arrangement collapsed --
  // the same record looked narrower for having more in it.
  //
  // Never wider than the window less the strip of controls beside it: the
  // close, copy-link and open-full controls stand on the drawer's edge,
  // outside the panel's inline start, and the drawer places them a step
  // beyond the panel's width without looking at the window. The cap used to
  // be the window less space-4 (32px at the default root size) while the
  // strip takes a control and a step on each side (64px), so in a frame
  // under ~1024px the controls stood half off the screen (docs review,
  // round 4, 2026-10-20). The cap holds for every width, not only for one
  // grown by the rail: a consumer's own panel-width meets the same edge.


  get drawerWidth() {
    // The panel never grows and never takes a width of its own (C289 (2)):
    // the drawer is drawn at a step of its ladder.
    return null;
  }

  get closeLabel() {
    return this.getAttribute("close-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "closeLabel", this);
  }

  get linkCopiedLabel() {
    return this.getAttribute("link-copied-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "linkCopiedLabel", this);
  }

  get copyLinkLabel() {
    return this.getAttribute("copy-link-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "copyLinkLabel", this);
  }

  get configureText() {
    return this.getAttribute("configure-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "configureText", this);
  }

  get resetViewAskText() {
    return this.getAttribute("reset-view-ask-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "resetViewAskText", this);
  }

  get cancelConfiguringText() {
    return this.getAttribute("cancel-configuring-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "cancelConfiguringText", this);
  }

  get doneConfiguringText() {
    return this.getAttribute("done-configuring-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "doneConfiguringText", this);
  }

  get resetViewText() {
    return this.getAttribute("reset-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "resetViewText", this);
  }

  get addViewText() {
    return this.getAttribute("add-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "addViewText", this);
  }

  get newViewText() {
    return this.getAttribute("new-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "newViewText", this);
  }

  get deleteViewText() {
    return this.getAttribute("delete-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "deleteViewText", this);
  }

  get lastSharedViewText() {
    return this.getAttribute("last-shared-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "lastSharedViewText", this);
  }

  get viewProfileLabel() {
    return this.getAttribute("view-profile-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewProfileLabel", this);
  }

  get personalLayerText() {
    return this.getAttribute("personal-layer-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "personalLayerText", this);
  }

  get sharedLayerText() {
    return this.getAttribute("shared-layer-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "sharedLayerText", this);
  }

  get widthText() {
    return this.getAttribute("width-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "widthText", this);
  }

  get variantText() {
    return this.getAttribute("variant-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "variantText", this);
  }

  get hintText() {
    return this.getAttribute("hint-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "hintText", this);
  }

  get hiddenText() {
    return this.getAttribute("hidden-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "hiddenText", this);
  }

  get configureHintText() {
    return this.getAttribute("configure-hint-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "configureHintText", this);
  } // On a narrow panel the section list is a screen of its own, so a field has
  // nowhere beside the fields to be dropped. The wide sentence names the list
  // on the left, and saying that where there is no list promises something a
  // person cannot do.


  get configureHintNarrowText() {
    return this.getAttribute("configure-hint-narrow-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "configureHintNarrowText", this);
  }

  get fieldSettingsText() {
    return this.getAttribute("field-settings-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "fieldSettingsText", this);
  }

  get shownText() {
    return this.getAttribute("shown-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "shownText", this);
  }

  get showRareText() {
    return this.getAttribute("show-rare-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "showRareText", this);
  }

  get hideRareText() {
    return this.getAttribute("hide-rare-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "hideRareText", this);
  }

  get rareText() {
    return this.getAttribute("rare-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "rareText", this);
  }

  get unplacedTitle() {
    return this.getAttribute("unplaced-title") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "unplacedTitle", this);
  }

  get moveUpText() {
    return this.getAttribute("move-up-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "moveUpText", this);
  }

  get moveDownText() {
    return this.getAttribute("move-down-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "moveDownText", this);
  }

  get addFieldText() {
    return this.getAttribute("add-field-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "addFieldText", this);
  }

  get renameText() {
    return this.getAttribute("rename-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "renameText", this);
  }

  get saveNameText() {
    return this.getAttribute("save-name-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveNameText", this);
  }

  get cancelNameText() {
    return this.getAttribute("cancel-name-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "cancelNameText", this);
  }

  get removeFieldText() {
    return this.getAttribute("remove-field-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "removeFieldText", this);
  }

  get removeGroupText() {
    return this.getAttribute("remove-group-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "removeGroupText", this);
  }

  get removeSectionText() {
    return this.getAttribute("remove-section-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "removeSectionText", this);
  }

  get addGroupText() {
    return this.getAttribute("add-group-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "addGroupText", this);
  }

  get addSectionText() {
    return this.getAttribute("add-section-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "addSectionText", this);
  }

  get newGroupTitle() {
    return this.getAttribute("new-group-title") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "newGroupTitle", this);
  }

  get newSectionTitle() {
    return this.getAttribute("new-section-title") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "newSectionTitle", this);
  }

  get sectionIconText() {
    return this.getAttribute("section-icon-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "sectionIconText", this);
  }

  get fieldLabelText() {
    return this.getAttribute("field-label-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "fieldLabelText", this);
  }

  get inThisGroupText() {
    return this.getAttribute("in-this-group-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "inThisGroupText", this);
  }

  get noMatchText() {
    return this.getAttribute("no-match-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "noMatchText", this);
  } // Where a group stands among the groups a person can see, and how many there
  // are, so the control that moves it knows when it has nowhere to go.


  get currentGroups() {
    const section = (this.sections ?? []).find(part => String(part.key) === this.selectedSection) ?? (this.sections ?? [])[0] ?? null;
    return section?.groups ?? [];
  }

  groupAt(groupKey) {
    return this.currentGroups.findIndex(group => String(group.key) === String(groupKey));
  }

  get groupCount() {
    return this.currentGroups.length;
  } // Moving a group one step, for a person who would rather press than drag --
  // and for anyone who cannot drag at all.


  moveGroupBy(groupKey, step) {
    const at = this.groupAt(groupKey);
    if (at < 0) return false;
    const to = at + step;
    if (to < 0 || to >= this.groupCount) return false;
    const section = (this.sections ?? []).find(part => String(part.key) === this.selectedSection) ?? (this.sections ?? [])[0] ?? null;
    if (!section) return false;
    return this.moveGroup(groupKey, String(section.key), to);
  } // Every field this group could hold, with the ones it holds already marked.
  // A collection can have hundreds, so what a person needs is to find one and
  // tick it -- and the ticked set is exactly what this area shows, which makes
  // unticking the way a field leaves it.
  //
  // Where a field lives now is said once, as a heading over the stretch of
  // list that comes from there, rather than after every name in it: written
  // into the row, the area's name was repeated on every line and pushed the
  // name it mattered for off the end.
  //
  // The order and the headings are a snapshot taken when the list opens.
  // Ticking a field moves it into this area, so a live grouping would move the
  // row out from under the pointer at the moment it was pressed -- and a list
  // that rearranges itself as you tick is a list nobody can tick twice.


  fieldChoices(groupKey) {
    const key = String(groupKey);
    const session = this._addSession?.group === key ? this._addSession : this._buildAddSession(key);
    const here = new Set();

    for (const field of this._locateGroup(key)?.group?.fields ?? []) here.add(String(field.key));

    const search = this.addSearch.trim().toLowerCase();
    const options = [];

    for (const entry of session.order) {
      if (search && !entry.label.toLowerCase().includes(search) && !entry.key.toLowerCase().includes(search)) continue;
      options.push({ ...entry,
        selected: here.has(entry.key)
      });
    }

    return options;
  }

  _buildAddSession(groupKey) {
    const key = String(groupKey);
    const order = [];
    const seen = new Set();

    const take = (field, from) => {
      const fieldKey = String(field.key);
      if (seen.has(fieldKey)) return;
      seen.add(fieldKey);
      order.push({
        key: fieldKey,
        label: String(field.label ?? field.key),
        group: from
      });
    };

    for (const field of this._locateGroup(key)?.group?.fields ?? []) take(field, this.inThisGroupText);

    for (const field of this.unplaced ?? []) take(field, this.unplacedTitle);

    for (const section of this.sections ?? []) {
      for (const group of section.groups ?? []) {
        if (String(group.key) === key || group.kind === "related") continue;
        const from = String(group.label ?? group.key);

        for (const field of group.fields ?? []) take(field, from);
      }
    }

    return {
      group: key,
      order
    };
  } // The list opens on a snapshot of where every field is, and forgets it when
  // it closes, so the next opening is read against what the arrangement became.


  startAddSession(groupKey) {
    this._addSearch = "";
    this._addSession = this._buildAddSession(groupKey);
    this.requestComponentUpdate("add-session");
    return this._addSession;
  }

  endAddSession() {
    this._addSession = null;
    this._addSearch = "";
    this.requestComponentUpdate("add-session");
  }

  get addSearch() {
    return this._addSearch ?? "";
  }

  setAddSearch(value) {
    this._addSearch = String(value ?? "");
    this.requestComponentUpdate("add-search");
    return this._addSearch;
  } // Ticking places the field here; unticking takes it out of every area, which
  // is where a field goes when it belongs to none.


  toggleFieldInGroup(fieldKey, groupKey, wanted) {
    return wanted ? this.moveField(fieldKey, groupKey, Number.MAX_SAFE_INTEGER) : this.moveFieldToUnplaced(fieldKey);
  }

  get unplacedHintText() {
    return this.getAttribute("unplaced-hint-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "unplacedHintText", this);
  }

  get viewConflictText() {
    return this.getAttribute("view-conflict-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewConflictText", this);
  } // The head's own words. The port carries a collection *key* and no record
  // title, icon or favourite state, and the port is fixed at 1.7.0 for this
  // work -- so these are the component's inputs, set by the host the way
  // `panel-label` and `panel-width` already are, rather than a port change.


  get collectionLabel() {
    return this.getAttribute("collection-label") || "";
  }

  get collectionIcon() {
    return this.getAttribute("collection-icon") || "";
  }

  get favourite() {
    return this.hasAttribute("favourite");
  }

  get favouriteLabel() {
    return this.getAttribute("favourite-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "favouriteLabel", this);
  }

  get menuLabel() {
    return this.getAttribute("menu-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "menuLabel", this);
  } // What a value inherited from somewhere else is marked with. The prototype
  // writes «по умолчанию» beside it, so a person can see that the record has not
  // decided this and that changing the source will change it here.


  get inheritedText() {
    return this.getAttribute("inherited-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "inheritedText", this);
  } // The star answers the press at once and reports it. Storing a favourite is
  // the host's, and a host that refuses sets the attribute back -- but a star
  // that does nothing until an answer arrives reads as a control that is
  // broken, which is what it read as on the stand.


  toggleFavourite() {
    const next = !this.favourite;
    this.toggleAttribute("favourite", next);
    this.requestComponentUpdate("favourite");
    this.dispatchEvent(new CustomEvent("sf-view-properties-favourite", {
      bubbles: true,
      composed: true,
      detail: {
        record_id: this.recordId || null,
        collection: this.collection || null,
        favourite: next
      }
    }));
    return true;
  } // The «⋯» menu: what belongs to the view rather than to the record. Configure
  // and reset live here, as the mockup has them, so the panel head carries one
  // control instead of a row of words.


  get panelMenuItems() {
    const items = [];

    if (this.canConfigureView && !this.configuring) {
      items.push({
        id: "configure",
        name: this.configureText,
        icon: "tune"
      });
    } // Resetting is not offered here while the view is being arranged: the
    // bar at the foot carries «Сбросить» with a confirmation beside the
    // other two answers, and the same act behind a «⋯» as well is the same
    // destruction reachable two ways, one of them quietly (owner,
    // 2026-10-08).


    if (this.hasRare) {
      items.push({
        id: "show-rare",
        name: this.showRare ? this.hideRareText : this.showRareText,
        icon: this.showRare ? "unfold_less" : "unfold_more"
      });
    }

    return items;
  } // What the «⋯» holds for the record itself (C289 (3), (6); C180 (2)):
  // copy its address and open it as a page -- they stood outside the panel
  // on the scrim and drew a white glyph on a white plate -- and, last and
  // apart, deleting it. A reading panel has no foot for one delete.


  get recordMenuItems() {
    const items = []; // «Изменить всё» (C305 (1)): every group open at once, one Save -- in
    // the panel's head; an inline view has its groups' «Изменить» and no
    // row of its own for it (the skeleton keeps the first group in place).

    if (this.panel && this.mayEdit && !this.openAll && !this.configuring && this.mode !== "create" && (this.sections ?? []).some(section => (section.groups ?? []).some(group => group.kind !== "related" && group.editable !== false))) {
      items.push({
        id: "edit-all",
        name: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "editAllText", this),
        icon: "edit"
      });
    } // «История изменений» (C305 (2)): a level of the panel; the full
    // screen from 80rem shows it in its own column instead.


    if (this.historyOffered && !this.historySide) {
      items.push({
        id: "history",
        name: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "historyText", this),
        icon: "history"
      });
    }

    if (this.address) items.push({
      id: "copy-link",
      name: this.copyLinkLabel,
      icon: "link"
    });
    if (this.canOpenFullPage) items.push({
      id: "open-full",
      name: this.openFullLabel,
      icon: "open_in_full"
    });
    return items;
  }

  get canDeleteRecord() {
    return this.mode !== "view" && this.mode !== "create" && this.recordActions.includes("record.delete") && !this.configuring;
  } // ─── the standard menu (owner, 2026-10-12) ──────────────────────────────
  // The «⋯» and the view chooser open the Framework's standard menu: one
  // sf-menu-context beside the page, filled for whichever control asked.


  async openStandardMenu(anchor, {
    label,
    entries,
    select,
    align = "end"
  }) {
    if (!(anchor instanceof Element)) return null; // The panel did not draw a menu before, so its rule does not fetch one;
    // the Loader is asked for it the first time it is wanted.

    await globalThis.SF?.Loader?.ensure?.(["sf-menu-context"]);
    let menu = this._standardMenu;

    if (!menu?.isConnected) {
      menu = document.createElement("sf-menu-context");
      menu.setAttribute("popup", "");
      menu.dataset.sfPropertyViewMenu = "";
      menu.addEventListener("sf-menu-context-select", event => this._standardMenuSelect?.(event.detail?.id));
      (this.closest("dialog[open]") || document.body).append(menu);
      this._standardMenu = menu;
    }

    if (menu.isOpen && this._standardMenuAnchor === anchor) {
      menu.close();
      return null;
    } // The panel's step and the density of its area, on every opening (owner
    // remark 2026-11-15): the menu stands on <body> or in the open dialog,
    // outside the panel, and fell back to the menu's own 1/2.


    menu.setAttribute("size", this.size);
    (0,_core_js_density_js__WEBPACK_IMPORTED_MODULE_10__.followDensity)(menu, this);
    menu.setAttribute("aria-label", label ?? "");
    menu.entries = entries;
    this._standardMenuSelect = select;
    this._standardMenuAnchor = anchor;
    return menu.openFor(anchor, {
      align
    });
  }

  openPanelMenu(anchor) {
    // The history level's «⋯»: which events it shows.
    if (this.historyOpen && !this.historySide) {
      const fieldsOnly = JSON.stringify(this.historyFeed?.kinds ?? null) === JSON.stringify(["update"]);
      return this.openStandardMenu(anchor, {
        label: this.menuLabel,
        entries: [{
          id: "history-kinds:update",
          text: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "historyFieldsText", this),
          kind: "radio",
          checked: fieldsOnly,
          icon: "edit_note"
        }, {
          id: "history-kinds:all",
          text: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "historyAllText", this),
          kind: "radio",
          checked: !fieldsOnly,
          icon: "list"
        }],
        select: id => this._chooseStandardEntry(id)
      });
    }

    const entries = [];
    const profiles = this.viewProfiles; // The profile is chosen in sf-profile-picker only (C163 (1), C311 (5),
    // RC-6): outside the mode one row «Вид: <name>» enters it with the
    // picker open. A person who cannot arrange the view chooses in the
    // select-only picker above the fields; the menu has no views submenu
    // for anyone (the dispatcher's call on C311 (5)).

    if (profiles.length > 1 && !this.configuring && this.canConfigureView) {
      const current = profiles.find(profile => profile.id === this.viewProfile);
      entries.push({
        id: "view-profile-picker",
        text: `${this.viewProfileLabel}: ${current?.label ?? ""}`,
        icon: "view_sidebar"
      });
    } // «Сохранить как моё» in the head «⋯» while arranging (C311 (5)).


    if (this.canSaveAsMine) {
      entries.push({
        id: "save-as-mine",
        text: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveAsMineText", this),
        icon: "person"
      });
    }

    const record = this.recordMenuItems;
    if (entries.length && record.length) entries.push({
      type: "separator"
    });
    entries.push(...record.map(item => ({
      id: item.id,
      text: item.name,
      icon: item.icon
    })));
    const items = this.panelMenuItems;
    if (entries.length && items.length) entries.push({
      type: "separator"
    });
    entries.push(...items.map(item => ({
      id: item.id,
      text: item.name,
      icon: item.icon
    })));
    const hosted = this.hostMenuEntries();
    if (entries.length && hosted.length) entries.push({
      type: "separator"
    });
    entries.push(...hosted);

    if (this.canDeleteRecord) {
      if (entries.length) entries.push({
        type: "separator"
      });
      entries.push({
        id: "delete",
        text: this.deleteText,
        icon: "delete",
        danger: true
      });
    }

    if (!entries.length) return null;
    return this.openStandardMenu(anchor, {
      label: this.menuLabel,
      entries,
      select: id => this._chooseStandardEntry(id)
    });
  } // The host's own menu items, as rows of the standard menu: its text, its
  // icon (icon, icon-start or data-icon), a link row for an address.


  hostMenuElements() {
    // In a panel the holder is in the drawer, which is moved to the page's end.
    const holder = this.querySelector("[data-host-menu]") ?? this.panelContent?.()?.querySelector?.("[data-host-menu]");
    return holder ? [...holder.children] : [];
  }

  hostMenuEntries() {
    return this.hostMenuElements().map((element, at) => {
      const control = element.matches("a[href], button") ? element : element.querySelector("a[href], button") ?? element;
      const text = (element.getAttribute("text") ?? element.getAttribute("aria-label") ?? control.textContent ?? "").trim();
      const href = control.matches?.("a[href]") ? control.getAttribute("href") : null;
      return {
        id: `host:${at}`,
        text,
        icon: element.getAttribute("icon") ?? element.getAttribute("icon-start") ?? element.dataset.icon ?? undefined,
        href: href || undefined,
        danger: element.getAttribute("scheme") === "error" || element.dataset.danger === "true",
        disabled: element.hasAttribute("disabled") || control.disabled === true
      };
    }).filter(entry => entry.text);
  }

  _chooseStandardEntry(id) {
    const value = String(id ?? "");

    if (value.startsWith("host:")) {
      const element = this.hostMenuElements()[Number(value.slice("host:".length))];
      const control = element?.matches("a[href], button") ? element : element?.querySelector("a[href], button") ?? element;
      if (!control?.matches?.("a[href]")) control?.click?.();
      return true;
    }

    if (value.startsWith("history-kinds:")) {
      const kinds = value.slice("history-kinds:".length);
      return this.setHistoryKinds(kinds === "all" ? null : [kinds]);
    }

    return this.chooseMenuItem(value);
  }

  chooseMenuItem(id) {
    if (id === "configure") return this.startConfiguringView();
    if (id === "save-as-mine") return this.saveAsMine();

    if (id === "view-profile-picker") {
      if (!this.configuring && !this.startConfiguringView()) return false;
      this.whenRendered?.(() => requestAnimationFrame(() => {
        const picker = (this.panelContent?.() ?? this).querySelector?.('sf-profile-picker[data-action="view-profile"]');
        (picker?.querySelector?.("button") ?? picker)?.click?.();
      }), {
        next: true
      });
      return true;
    }

    if (id === "reset") return this.resetView();
    if (id === "show-rare") return this.toggleShowRare();
    if (id === "copy-link") return this.copyAddress();
    if (id === "open-full") return this.openFullPage();
    if (id === "delete") return this.deleteRecord();
    if (id === "history") return this.openHistory();

    if (id === "edit-all") {
      this.quick = null;
      this.editing = null;
      this.formEdit = null;
      this.editAll = true;
      this.requestComponentUpdate("editing");
      return true;
    }

    return false;
  }

  get backLabel() {
    return this.getAttribute("back-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "backLabel", this);
  }

  get viewDeniedText() {
    return this.getAttribute("view-denied-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewDeniedText", this);
  }

  get openFullLabel() {
    return this.getAttribute("open-full-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "openFullLabel", this);
  } // Where this object lives, as the host named it when it answered. Never
  // constructed here: a composite that built a URL would be guessing at the
  // consumer's routing.


  get address() {
    return this.record?.address ?? null;
  } // Opening the record as a page is the host's, and so is whether there is a
  // page at all: an address worth copying does not promise one. Drawn on the
  // address alone, the control stood in every panel and did nothing in the
  // hosts that route no further.


  get canOpenFullPage() {
    return Boolean(this.address) && Boolean(this.hostPort?.capabilities?.includes?.("record-open"));
  }

  static get observedAttributes() {
    return [...(super.observedAttributes ?? []), "record-id", "hidden", "open", "full"];
  }

  attributeChangedCallback(name, previous, next) {
    super.attributeChangedCallback?.(name, previous, next);
    if (previous === next || !this.isConnected) return; // Without a port there is nothing to read: the view stays loading and
    // the port, when it comes, reads the record (setHostPort). Read here,
    // a record-id the page printed failed at once with «port not
    // connected» while the element upgraded, before it asked for a port.

    if (name === "record-id" && this.hostPort) this.load("record-id-changed");
    if (name === "hidden" || name === "open" || name === "full") this.syncPanelOpen();
  } // Every tag the card draws, asked of the Loader once per connection
  // (§7.11, VF-16); the card draws again once they are defined, so a part
  // drawn before its definition upgrades in place.


  _askForDrawnTags() {
    const registry = globalThis.customElements;
    const loader = globalThis.SF?.Loader;
    if (typeof registry?.get !== "function" || typeof loader?.ensure !== "function") return;
    const missing = DRAWN_TAGS.filter(tag => !registry.get(tag));
    if (!missing.length) return;
    Promise.resolve(loader.ensure(missing, {
      timeout: 10000
    })).catch(() => null).then(() => {
      if (this.isConnected) this.requestComponentUpdate("parts-defined");
    });
  } // Every other tag the view has drawn -- a field's control, a host's
  // renderer, a part a template draws only sometimes -- asked for once it is
  // in the view and not defined (C289 (10), VF-16): a page that defines
  // nothing of its own still gets the whole card.


  _askForUndefinedTags() {
    const registry = globalThis.customElements;
    const loader = globalThis.SF?.Loader;
    if (typeof registry?.get !== "function" || typeof loader?.ensure !== "function") return;
    this._askedTags ??= new Set(DRAWN_TAGS);
    const missing = new Set();

    for (const node of this.querySelectorAll(":not(:defined)")) {
      const tag = node.localName;
      if (tag.startsWith("sf-") && !this._askedTags.has(tag) && !registry.get(tag)) missing.add(tag);
    }

    if (!missing.size) return;

    for (const tag of missing) this._askedTags.add(tag);

    Promise.resolve(loader.ensure([...missing], {
      timeout: 10000
    })).catch(() => null);
  }

  onConnected() {
    super.onConnected?.();

    this._notePanelWidth();

    this._askForDrawnTags(); // Born loading. The first render comes before the host is asked, and
    // drawn with no state it was the empty body -- one frame of «nothing
    // here» before the skeleton, the flash the table had (rules of the
    // road, rule 2: loading is drawn as the skeleton, from the first frame).


    if (!this.hasAttribute("data-state") && !this.record) {
      this.setAttribute("data-state", "loading");
      this.setAttribute("aria-busy", "true");
    } // Escape is the layer stack's: it hands the press to the top layer only,
    // after it has passed through the page, so a list, a menu or a modal
    // opened over this panel takes it first, and a control inside that
    // handled it (preventDefault) keeps it. The drawer closes on it -- and a
    // panel never closes itself, so every close the drawer starts (Escape,
    // a press on the dimmed page, a script calling close()) is refused here
    // and asked of the host as this component's own cancelable close, with
    // the count of what is unsaved. Only this panel's own drawer: a drawer
    // opened inside the panel is portalled with it and never bubbles here.


    this._onDrawerClose = event => {
      if (event.target !== this._ownDrawer()) return;
      event.preventDefault();
      this.closePanel(DRAWER_CLOSE_REASONS[event.detail?.reason] ?? "api");
    };

    this.addEventListener("sf-drawer-close", this._onDrawerClose); // The first focus of the panel (Pro joint pass PRO-ADM-16): the drawer
    // gives it to the first field of its content, else its first control
    // -- for a record shown to read, the favourite star in the head, whose
    // tooltip then stood over the title. A record to read starts on its
    // title (the heading takes the focus without becoming a Tab stop); a
    // record with a field keeps the field the drawer chose (C159 (9)). The
    // panel is drawn open and its record comes later, so sf-drawer-opened
    // is not sent and the drawer's pick lands frames after the open: the
    // panel watches the focus from its open until the title is drawn, the
    // person acts or two seconds pass.

    this._onPanelFocusIn = () => this._focusTitleFirst();

    this._onPanelAct = event => {
      const root = this._ownDrawerRoot();

      if (root && event.composedPath?.().includes(root)) this._endTitleFocus();
    };

    this._offAfterRender = this.onAfterRender?.(() => {
      const open = this.panelOpen;
      if (open && !this._panelWasOpen) this._startTitleFocus();
      if (!open) this._endTitleFocus();
      this._panelWasOpen = open;
      if (this._titleFocusUntil) requestAnimationFrame(() => this._focusTitleFirst());
    }); // Every render, not once (onAfterRender runs a callback once unless
    // told otherwise): the errors to focus after a refused Save, the tags
    // to ask the Loader for, the back line of a related record.

    this._offEveryRender = this.onAfterRender?.(() => {
      if (this._focusErrorsAfterRender) {
        this._focusErrorsAfterRender = false;
        requestAnimationFrame(() => this._focusErrors());
      } // A long field's value pressed: its group opens with the focus on
      // it (VP-21); sf-form gives it once its controls are drawn.


      if (this._focusFieldAfterRender && this.editing) {
        const key = this._focusFieldAfterRender;
        this._focusFieldAfterRender = null; // sf-form may draw before or after this hook, and its control is
        // defined lazily: wait (60 frames at most) until the control has
        // something to focus.

        const formed = Boolean(this.formEdit);
        const FOCUSABLE = "input:not([type=hidden]), textarea, select, button, [tabindex]:not([tabindex='-1'])";
        let frames = 0;

        const give = () => {
          const form = formed ? this._formOf(this.editing?.group) : null;
          const control = form?.controlOf?.(key);
          const ready = !formed || Boolean(control && (!control.localName.includes("-") || customElements.get(control.localName)) && (control.focusDelegate?.() || control.querySelector?.(FOCUSABLE)));
          if (!ready && frames++ < 60) return requestAnimationFrame(give);
          if (form?.focusField) form.focusField(key);else this.focusField(key);
        };

        requestAnimationFrame(give);
      }

      if (this._focusAfterStep && this.record && this.getAttribute("data-state") !== "loading") {
        this._focusAfterStep = false;
        requestAnimationFrame(() => {
          const root = this.panel ? this.panelContent?.() : this;
          const active = document.activeElement;
          if (root && active && root.contains(active) && active !== document.body) return;
          root?.querySelector?.(".sf-property-view-title")?.focus?.({
            preventScroll: true
          });
        });
      } // The full screen's history column reads its first page itself.


      if (this.historySide && (!this.historyFeed || this.historyFeed.record !== this.recordId) && this.record && !this._sideAsked) {
        this._sideAsked = true;
        Promise.resolve().then(() => this.loadHistory()).finally(() => {
          this._sideAsked = false;
        });
      }

      this._askForUndefinedTags(); // The panel's level for a related record (C289 (6)): whether this
      // panel's drawer is drawn inside another one is known once it is open.


      const nested = this._nestedLabel();

      if (nested !== this._nestedUnderLabel) {
        this._nestedUnderLabel = nested;
        this.requestComponentUpdate("nested");
      }
    }, {
      once: false
    }); // The drop is sf-sortable's to report and the component's to apply or
    // refuse -- that is the seam the mechanism already publishes, so no drag
    // is implemented here. The lists name themselves `field:<group>` and
    // `group:<section>`, which is what `to` carries.

    this._onSortableIntent = event => {
      if (!this.configuring) return;
      const detail = event.detail ?? {};
      const [kind, container] = String(detail.to ?? "").split(":");
      if (!container) return;
      if (kind === "section") this.moveSection(detail.item, detail.index);else if (kind === "field") this.moveField(detail.item, container, detail.index);else if (kind === "group") this.moveGroup(detail.item, container, detail.index);else if (kind === "unplaced") this.moveFieldToUnplaced(detail.item, detail.index);
    };

    this.addEventListener("sf-sortable-intent", this._onSortableIntent); // A panel is portalled out of this element, so an intent raised inside one
    // never bubbles to it. The document listener catches those, and checks the
    // list belongs to this record before acting -- two stacked panels are two
    // components, and the wrong one applying the move would rearrange a view
    // nobody was looking at.

    this._onDocumentSortableIntent = event => {
      if (!this.panel || !this.configuring) return;
      const panel = event.target?.closest?.(".sf-property-view-panel");
      if (!panel || panel.getAttribute("data-record-id") !== String(this.recordId)) return;

      this._onSortableIntent(event);
    };

    document.addEventListener("sf-sortable-intent", this._onDocumentSortableIntent); // The not-placed bin is an accordion, closed by default, and a drop
    // target nobody can see is a drop target nobody uses. So a drag opens
    // it -- by pressing its trigger, the way a person would, because the
    // accordion owns whether it is open and a second controller would
    // fight it. It is pressed back when the drag ends, and only if this is
    // what opened it: a person who opened it themselves keeps it open
    // (owner, 2026-10-09).

    this._onSortableState = event => {
      if (!this.configuring) return;
      const state = event.detail?.state; // The panel is portalled out of this element, so it is reached the
      // way the sortable intents are reached: by the record it carries.
      // `this.panel` is not an element and querying it found nothing,
      // which is why the bin stayed shut through a whole drag.

      const panel = globalThis.document?.querySelector?.(`.sf-property-view-panel[data-record-id="${this.recordId}"]`);
      const trigger = panel?.querySelector?.('[data-action="toggle-unplaced"]');
      if (!trigger) return;
      const open = trigger.getAttribute("aria-expanded") === "true";

      if (state === "picked") {
        this._openedForDrag = !open;
        if (!open) trigger.click();
        return;
      }

      if (state !== "dropped" && state !== "cancelled") return;
      if (this._openedForDrag && trigger.getAttribute("aria-expanded") === "true") trigger.click();
      this._openedForDrag = false;
    };

    document.addEventListener("sf-sortable-state", this._onSortableState);
    this.wideMedia = typeof globalThis.matchMedia === "function" ? globalThis.matchMedia(WIDE_MEDIA_QUERY) : null;
    this.wide = this.wideMedia ? this.wideMedia.matches : true;

    this._onWideChange = event => {
      this.wide = event.matches; // Leaving the phone arrangement leaves its navigation behind: a section
      // screen is a phone idea, and keeping the state would show a desktop a
      // single section with a back arrow and no way to see the others.

      if (this.wide) this.phoneSection = null;
      this.requestComponentUpdate("viewport");
    };

    this.wideMedia?.addEventListener?.("change", this._onWideChange);
    this.sideMedia = typeof globalThis.matchMedia === "function" ? globalThis.matchMedia(SIDE_MEDIA_QUERY) : null;
    this.sideWide = Boolean(this.sideMedia?.matches);

    this._onSideChange = event => {
      this.sideWide = event.matches;
      this.requestComponentUpdate("viewport");
    };

    this.sideMedia?.addEventListener?.("change", this._onSideChange); // Alt+↓ / Alt+↑: the next or the previous record of the view (C305 (4)).
    // The panel is portalled out of the element, so the keys are read on
    // the document for a press inside this card's panel.

    this._onStepKey = event => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const root = this.panel ? this.panelContent() : this; // A press on the panel itself counts: the drawer gives its panel
      // the focus when the card covers the list (phone), and the keys
      // went nowhere from there (VR2-3).

      const path = event.composedPath?.() ?? [];
      const own = this.panel ? this._ownDrawerRoot() : null;
      if (!root || !(path.includes(root) || own && path.includes(own)) || this.panel && !this.isTopPanel) return;
      event.preventDefault(); // The next record redraws the panel: the focus comes back to its
      // title so the keys go on stepping.

      this._focusAfterStep = true;
      this.step(event.key === "ArrowDown" ? "next" : "previous");
    };

    document.addEventListener("keydown", this._onStepKey); // A view placed before it is told its record (an assembly binds
    // record-id after it places the part) asks the host nothing yet: the
    // record-id it is given reads it (attributeChangedCallback).

    if (this.hostPort && (this.recordId || this.mode === "create")) this.load("connected");else if (!this.hostPort) this._requestHostPort();
  } // The shared convention for a component that takes a host port: ask for one
  // rather than wait to be given it, so a consumer composing this inside
  // something else does not have to find the element and call a method on it.
  // Once per connection and only while there is no port; `setHostPort` answers,
  // at once or later. The same event every such component raises, so a host
  // answers them all the same way.


  _requestHostPort() {
    if (this.hostPort || this._portRequested) return false;
    this._portRequested = true;
    this.dispatchEvent(new CustomEvent("sf-host-port-request", {
      bubbles: true,
      composed: true,
      detail: {
        component: this,
        context: {
          owner: "property-view",
          record: this.recordId || null,
          group: null
        }
      }
    }));
    return true;
  }

  onDisconnected() {
    this._standardMenu?.close?.({
      restoreFocus: false
    });
    this._standardMenu?.remove();
    this._standardMenu = null; // Once per connection, so an element moved in the DOM asks again.

    this._portRequested = false;
    if (this._onDrawerClose) this.removeEventListener("sf-drawer-close", this._onDrawerClose);
    this._onDrawerClose = null;

    this._endTitleFocus();

    this._offAfterRender?.();
    this._offAfterRender = null;
    this._offEveryRender?.();
    this._offEveryRender = null;
    this._panelWasOpen = false; // The settings surface listens on the document, so a panel that goes away
    // while it is open takes that listener with it.

    this.configuring = false;

    this._bindSectionDropTarget();

    if (this._onSortableIntent) this.removeEventListener("sf-sortable-intent", this._onSortableIntent);
    this._onSortableIntent = null; // A document listener outliving its component would go on applying drops
    // and writing a layer for a record nobody has open.

    if (this._onDocumentSortableIntent) {
      document.removeEventListener("sf-sortable-intent", this._onDocumentSortableIntent);
    }

    if (this._onSortableState) {
      document.removeEventListener("sf-sortable-state", this._onSortableState);
    }

    this._onDocumentSortableIntent = null;
    if (this._onWideChange) this.wideMedia?.removeEventListener?.("change", this._onWideChange);
    if (this._onSideChange) this.sideMedia?.removeEventListener?.("change", this._onSideChange);
    this._onSideChange = null;
    this.sideMedia = null;
    if (this._onStepKey) document.removeEventListener("keydown", this._onStepKey);
    this._onStepKey = null;
    clearTimeout(this._savedTimer);
    this._onWideChange = null;
    this.wideMedia = null;
    super.onDisconnected?.();
  } // Where this panel's content actually lives. The drawer moves it out of the
  // element, so anything looking for the panel -- a key handler, a probe, a
  // stack deciding which window is on top -- has to ask rather than assume.


  panelContent() {
    const drawer = this.querySelector("sf-drawer") ?? this._panelDrawer ?? null;
    const inside = drawer?.querySelector?.(".sf-property-view-panel");
    if (inside) return inside;
    const instance = this.getAttribute("record-id") || "";
    const candidates = [...document.querySelectorAll(".sf-property-view-panel")];
    return candidates.find(node => node.dataset.recordId === instance) ?? null;
  } // A host adapter exposes raise(intent, payload, {signal}); no transport is
  // implied, exactly as for sf-view.


  setHostPort(host) {
    if (!host || typeof host.raise !== "function" || !SUPPORTED_PORT_VERSIONS.includes(host.version)) {
      throw new TypeError(`sf-view-properties requires a declared property-view host port: ${SUPPORTED_PORT_VERSIONS.join(", ")}`);
    }

    this.hostPort = host;
    if (this.isConnected && (this.recordId || this.mode === "create")) this.load("host-connected");
    return this;
  }

  visible(entries, {
    conditions = true
  } = {}) {
    const values = conditions ? this.fieldValues() : null;
    return (Array.isArray(entries) ? entries : []).filter(entry => entry && entry.hidden !== true).filter(entry => this.showRare || entry.rare !== true) // A field its condition hides is not drawn (port 1.14.0). Not while
    // the view is arranged -- the template lists every entry then -- and
    // not by the view: `hidden` is the arrangement's, `when` the values'.
    .filter(entry => !values || !entry.when || (0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldConditions)(entry, values).visible);
  } // Every field's value as it stands on screen: what the record holds, or what
  // the person changed it to and has not saved. The conditions read these, so
  // a field appears the moment the value it waits for is chosen, before any
  // save -- and a condition over a field in another group, closed, reads what
  // that field holds.


  fieldValues() {
    const values = new Map();

    const take = field => {
      if (!field || field.key === undefined || field.key === null) return;
      const key = String(field.key);
      values.set(key, this.changed.has(key) ? this.changed.get(key) : field.value);
    };

    for (const section of this.sections ?? []) {
      for (const group of section?.groups ?? []) (group?.fields ?? []).forEach(take);
    }

    this.unplaced.forEach(take);
    return values;
  } // A field as its conditions make it: required as `when.required` says, and
  // drawn disabled -- as `readonly` is -- while `when.enabled` does not hold.
  // The field itself is the host's and is not written to.


  conditionedField(field, values = this.fieldValues()) {
    if (!field?.when) return field;
    const decided = (0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldConditions)(field, values);
    return { ...field,
      required: decided.required,
      readonly: field.readonly === true || !decided.enabled
    };
  } // The keys of the fields their conditions hide now.


  _hiddenByCondition() {
    const values = this.fieldValues();
    const hidden = new Set();

    const check = field => {
      if (field?.when && !(0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldConditions)(field, values).visible) hidden.add(String(field.key));
    };

    for (const section of this.sections ?? []) {
      for (const group of section?.groups ?? []) (group?.fields ?? []).forEach(check);
    }

    this.unplaced.forEach(check);
    return hidden;
  } // What a save carries: the changed fields, less every field its condition
  // hides (port 1.14.0). Such a field is left out, not emptied: it keeps what
  // it holds -- its own value or an inherited one -- because hidden by a
  // condition is not the same as cleared, and a contract type switched back
  // and forth must not lose the date it had. What the person typed into it
  // stays among the changes, unsent, and is sent if the field shows again.


  _savedValues() {
    const hidden = this._hiddenByCondition();

    return Object.fromEntries([...this.changed].filter(([key]) => !hidden.has(key)));
  } // The host as the renderer set reads a field shown: its formatFieldValue
  // first, and for a date it did not format, the date in the page's language
  // (format-date), as sf-view-table's cells read it. A date stood in the card
  // as stored -- «2026-11-02» -- unless the host formatted it (2026-11-05).


  get viewHost() {
    const host = this.hostPort ?? null;
    if (this._viewHost?.host === host) return this._viewHost.view; // Everything else the host offers the renderer set (its words, say) is
    // reached through it unchanged.

    const view = Object.create(host && typeof host === "object" ? host : null);
    Object.assign(view, {
      formatFieldValue: (field, value) => {
        const own = host?.formatFieldValue?.(field, value);
        return typeof own === "string" ? own : undefined;
      }
    });
    this._viewHost = {
      host,
      view
    };
    return view;
  } // ─── C305: quick edit, a field's group, the history, the next record ─────
  // Where a field stands: its section, its group and its descriptor.


  fieldAt(key) {
    const wanted = String(key ?? "");

    for (const section of this.sections ?? []) {
      for (const group of section.groups ?? []) {
        const field = (group.fields ?? []).find(one => String(one.key ?? "") === wanted);
        if (field) return {
          section: String(section.key ?? ""),
          group: String(group.key ?? ""),
          field
        };
      }
    }

    return null;
  } // A short field opened in its window (C305 (1), C296): the entry is held
  // as a group's is, nothing is written until Save.


  startQuick(section, group, key) {
    if (!this.quickEdit || this.editing) return false;
    this.quick = {
      section: String(section),
      group: String(group),
      key: String(key)
    };
    this.changed.clear();

    this._clearInputs();

    this.errors.clear();
    this.conflict = null;
    this.confirmation = null;
    this.requestComponentUpdate("quick");
    return true;
  }

  endQuick(key = null) {
    if (!this.quick || key !== null && this.quick.key !== key) return false;
    this.quick = null;
    this.changed.clear();

    this._clearInputs();

    this.errors.clear();
    this.conflict = null;
    this.confirmation = null;
    this.requestComponentUpdate("quick");
    return true;
  }

  _quickPopover(key) {
    const root = this.panel ? this.panelContent() : this;
    return root?.querySelector?.(`sf-popover[data-quick-pop="${CSS.escape(String(key))}"]`) ?? null;
  } // One value per save: group.save of the field's group with that value,
  // the same revision and the same confirmation as a group's save.


  async saveQuick({
    confirm = null
  } = {}) {
    const quick = this.quick;
    if (!quick) return null;

    if (!this.changed.has(quick.key) && !this.inputErrors.size) {
      this._quickPopover(quick.key)?.close?.();
      this.endQuick();
      return null;
    }

    return this.saveGroup({
      confirm
    });
  } // The saved fields are marked for a moment (--sf-view-properties-saved-background-color).


  markSaved(keys) {
    this.savedKeys = new Set([...keys].map(String));
    this.requestComponentUpdate("saved-mark");
    clearTimeout(this._savedTimer);
    this._savedTimer = setTimeout(() => {
      this.savedKeys = new Set();
      this.requestComponentUpdate("saved-mark");
    }, 1600);
  } // RC-6 editField(key): a short field opens its window, any other its
  // group with the focus on it (VP-19, VP-21).


  editField(key) {
    const at = this.fieldAt(key);
    if (!at || !this.mayEdit) return false;

    if (this.isQuickField(at.field) && this.quickEdit) {
      const pop = this._quickPopover(at.field.key);

      if (pop?.show) {
        pop.show();
        return true;
      }
    }

    if (this.selectedSection !== at.section) this.selectSection(at.section);
    this.editGroup(at.section, at.group, {
      focus: at.field.key
    });
    return true;
  } // sf-form draws a group's edit (C182) when it draws every field of it.


  formDraws(group) {
    const fields = this.visible(group?.fields, {
      conditions: false
    }); // sf-form where the page has it defined; else the card's own form, as before.

    if (!fields.length || !globalThis.customElements?.get?.("sf-form")) return false;
    return fields.every(field => {
      const type = String(field.propertyType || field.type || "");
      if (field.when || (0,_js_set_fields_js__WEBPACK_IMPORTED_MODULE_15__.drawsSetField)(field) || FORMLESS_TYPES.has(type)) return false;
      const modes = (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_16__.propertyModes)(type);
      return Boolean(modes?.edit || field.readonly === true && modes?.view);
    });
  } // The fields and the saved value an sf-form gets for one group's edit.


  _formEditOf(section, group) {
    const current = this.sections.find(entry => String(entry.key) === String(section));
    const found = this.visible(current?.groups).find(entry => String(entry.key) === String(group));
    if (!found || !this.formDraws(found)) return null;
    const fields = this.visible(found.fields, {
      conditions: false
    }).map(field => {
      const {
        value,
        width,
        ...rest
      } = field;
      return { ...rest,
        key: String(field.key ?? "")
      };
    });
    const value = Object.fromEntries(this.visible(found.fields, {
      conditions: false
    }).filter(field => field.value !== undefined && field.value !== null).map(field => [String(field.key ?? ""), field.value]));
    return {
      section: String(section),
      group: String(group),
      fields,
      value
    };
  } // sf-form's Save: what differs from the record is the save; the form waits
  // for the host's answer (the submit is cancelled) and takes its errors.


  submitForm(event) {
    event?.preventDefault?.();
    if (!this.formEdit || !this.editing) return null;
    const value = event?.detail?.value ?? {};

    for (const field of this.formEdit.fields) {
      const at = this.fieldAt(field.key);
      if (!at) continue;
      const next = value[field.key];
      const same = JSON.stringify(next ?? null) === JSON.stringify(at.field.value ?? null);
      if (same || next === undefined) this.changed.delete(field.key);else this.changed.set(field.key, next);
    }

    return this.saveGroup();
  }

  _formOf(groupKey) {
    const root = this.panel ? this.panelContent() : this;
    return root?.querySelector?.(`[data-group="${CSS.escape(String(groupKey))}"] sf-form`) ?? null;
  } // The way out of unsaved entries asks first (C159 (6)): a close, or a step
  // to the next record, waits for «Закрыть без сохранения».


  answerLeave(accepted) {
    const ask = this.leaveAsk;
    this.leaveAsk = null;
    if (!ask) return null;

    if (!accepted) {
      this.requestComponentUpdate("leave");
      return null;
    }

    this._dropEntries();

    if (ask.kind === "step") return this._emitStep(ask.direction);
    return this.closePanel(ask.reason, {
      asked: true
    });
  }

  _dropEntries() {
    this.editing = null;
    this.quick = null;
    this.editAll = false;
    this.formEdit = null;
    this.changed.clear();

    this._clearInputs();

    this.errors.clear();
    this.conflict = null;
    this.confirmation = null;
    this.requestComponentUpdate("editing");
  } // RC-5, RC-6 step(direction): the next or the previous record in the
  // order of the view the panel was opened from. The card never reads the
  // list: it asks (sf-view-properties-step {direction}) and the page opens the
  // neighbour in the same panel (sf-view recordBeside gives it).


  step(direction) {
    const dir = direction === "previous" || direction === -1 ? "previous" : "next";

    this._commitFocusedEntry();

    if (this.unsavedFields) {
      this.leaveAsk = {
        kind: "step",
        direction: dir
      };
      this.requestComponentUpdate("leave");
      return {
        outcome: "refused",
        reason: "unsaved"
      };
    }

    return this._emitStep(dir);
  } // The next record: a host that announces record-neighbours names it over
  // its current view (filters, search, sort; Larena: {listed, previous:
  // {record_id}, next: {record_id}}), and the card opens it in the same panel
  // unless the page takes the step (preventDefault). Without it the page
  // finds the neighbour itself (sf-view recordBeside) and sets record-id.


  async _emitStep(direction) {
    let next = null;

    if (this.hostPort?.capabilities?.includes?.("record-neighbours") && this.recordId) {
      const answer = await this._raise("record.neighbours", {
        record_id: this.recordId,
        collection: this.collection || null
      });

      if (answer?.answer === "applied") {
        const id = answer[direction]?.record_id;
        if (id === undefined || id === null || id === "") return {
          outcome: "refused",
          reason: "no-neighbour"
        };
        next = String(id);
      }
    }

    const allowed = this.sfEmit("step", {
      direction,
      record_id: this.recordId || null,
      ...(next ? {
        next_record_id: next
      } : {})
    }, {
      cancelable: true
    });
    if (!allowed) return {
      outcome: "refused",
      reason: "prevented"
    };
    if (next) this.setAttribute("record-id", next);
    return {
      outcome: "applied"
    };
  } // RC-3, RC-6 openHistory(): the history as a level of the same panel, the
  // C289 head over it («← <запись>», the title, «⋯», the close).


  openHistory() {
    if (!this.historyOffered) return {
      outcome: "refused",
      reason: "unavailable"
    };
    this.historyOpen = true;
    this.phoneSection = null;
    this.sfEmit("history", {
      record_id: this.recordId || null
    });
    this.requestComponentUpdate("history");
    if (!this.historyFeed || this.historyFeed.record !== this.recordId) this.loadHistory();
    return {
      outcome: "applied"
    };
  }

  closeHistory() {
    if (!this.historyOpen) return false;
    this.historyOpen = false;
    this.requestComponentUpdate("history");
    return true;
  } // «Только изменения полей» / «Все события» (the history's «⋯»).


  setHistoryKinds(kinds) {
    const next = Array.isArray(kinds) && kinds.length ? kinds.map(String) : null;
    if (JSON.stringify(next) === JSON.stringify(this.historyFeed?.kinds ?? null) && this.historyFeed) return false;
    this.historyFeed = {
      record: this.recordId,
      kinds: next,
      events: [],
      items: [],
      cursor: null,
      hasMore: false,
      loading: false,
      failed: false
    };
    this.loadHistory();
    return true;
  } // One page of record.history; «Показать ещё» asks for the next one with
  // the cursor the host gave.


  async loadHistory({
    more = false
  } = {}) {
    if (!this.historyOffered) return null;
    const kinds = this.historyFeed?.kinds ?? null;

    if (!more || !this.historyFeed || this.historyFeed.record !== this.recordId) {
      this.historyFeed = {
        record: this.recordId,
        kinds,
        events: [],
        items: [],
        cursor: null,
        hasMore: false,
        loading: true,
        failed: false
      };
    } else {
      this.historyFeed = { ...this.historyFeed,
        loading: true
      };
    }

    this.requestComponentUpdate("history");
    const epoch = ++this.historyEpoch;
    const last = this.historyFeed.events.at(-1);
    const answer = await this._raise("record.history", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      cursor: more ? this.historyFeed.cursor ?? (last ? String(last.id) : null) : null,
      kinds,
      limit: HISTORY_PAGE
    }, {
      stale: () => epoch !== this.historyEpoch
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      this.historyFeed = { ...this.historyFeed,
        loading: false,
        failed: true,
        hasMore: false
      }; // A refused history is no state of the record: the record stays ready.

      if (this.getAttribute("data-state") === "error" && this.record) this._setState("ready");
      this.requestComponentUpdate("history");
      return answer;
    }

    const events = [...this.historyFeed.events, ...(Array.isArray(answer.events) ? answer.events : [])];
    this.historyFeed = { ...this.historyFeed,
      events,
      loading: false,
      failed: false,
      hasMore: answer.has_more === true,
      cursor: answer.cursor ?? null,
      items: (0,_js_history_js__WEBPACK_IMPORTED_MODULE_17__.timelineItems)(events, {
        words: this.historyWords,
        fieldOf: key => this.fieldAt(key)?.field ?? null,
        host: this.viewHost
      })
    };
    this.requestComponentUpdate("history");
    return answer;
  }

  get historyWords() {
    const word = key => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, key, this);

    return {
      historyCreate: word("historyCreateText"),
      historyDelete: word("historyDeleteText"),
      historyRestore: word("historyRestoreText"),
      historyPublish: word("historyPublishText"),
      historyChangedOne: word("historyChangedOneText"),
      historyChangedMany: word("historyChangedManyText"),
      historySealed: word("historySealedText")
    };
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      hostPort: this.hostPort,
      viewHost: this.viewHost,
      size: this.size,
      controlSize: this.controlSize,
      mode: this.mode,
      mayEdit: this.mayEdit,
      openAll: this.openAll,
      createText: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "createText", this),
      emptyText: this.emptyText,
      emptyRecordText: this.emptyRecordText,
      isEmptyRecord: this.isEmptyRecord,
      // The first load draws the fields it waits for; a failed one says
      // why in sf-empty-state.
      loading: this.getAttribute("data-state") === "loading" && !this.record,
      panel: this.panel,
      panelOpen: this.panelOpen,
      // The record's own name heads a panel the page gave no label: the
      // host answers it with the record (port 1.14.0 record.label); the
      // reference host and most pages send record.title, read as well.
      recordLabel: this._recordName(this.record),
      loadFailure: this.record ? null : this.loadFailure ?? null,
      editText: this.editText,
      saveText: this.saveText,
      cancelText: this.cancelText,
      deleteText: this.deleteText,
      recordActions: this.recordActions,
      changedText: this.changedText,
      errorsText: this.errorsText,
      sectionsLabel: this.sectionsLabel,
      sectionsAs: this.sectionsAs,
      sections: this.sections,
      selectedSection: this.selectedSection,
      editing: this.editing,
      changed: this.changed,
      errors: this.inputErrors.size ? new Map([...this.errors, ...this.inputErrors]) : this.errors,
      // An entry that is not a value yet holds both saves (port 1.16.0):
      // Save is drawn disabled while there is one, with the count of what
      // is wrong beside it and each message under its field.
      controlErrors: this.controlErrors,
      canPickRecords: this.canPickRecords,
      canUploadFiles: this.canUploadFiles,
      // The base captures the host's slot content in connectedCallback,
      // before the first render, and returns live nodes by reference -- so a
      // consumer's listeners and open state survive every render. A second
      // mechanism was written here and deleted: it collected in onConnected,
      // which runs after lit has rendered into the element and cleared the
      // host's children, so it collected nothing at all.
      hostSlot: name => this.getSlotContent(name),
      hasHostSlot: name => this.hasSlotContent(name),
      address: this.address,
      drawerWidth: this.drawerWidth,
      sectionsWidth: SECTIONS_WIDTH,
      conflict: this.conflict,
      confirmation: this.confirmation,
      confirmSaveText: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "confirmSaveText", this),
      keepEditingText: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "keepEditingText", this),
      message: this.message,
      visible: entries => this.visible(entries),
      conditionedField: field => this.conditionedField(field),
      fieldDisabled: field => this.fieldDisabled(field),
      canConfigureView: this.canConfigureView,
      configuring: this.configuring,
      unplaced: this.unplaced,
      viewTarget: this.viewTarget,
      editableLayers: this.editableLayers,
      viewProfiles: this.viewProfiles,
      viewProfile: this.viewProfile,
      canDeleteViewProfile: id => this.canDeleteViewProfile(id),
      layerDenied: kind => this.layerDenied(kind),
      canChangeVisibility: entry => this.canChangeVisibility(entry),
      entryError: (kind, key) => this.entryError(kind, key),
      configureText: this.configureText,
      doneConfiguringText: this.doneConfiguringText,
      resetViewText: this.resetViewText,
      resetViewAskText: this.resetViewAskText,
      cancelConfiguringText: this.cancelConfiguringText,
      resetAsked: this.resetAsked,
      personalLayerText: this.personalLayerText,
      viewProfileLabel: this.viewProfileLabel,
      addViewText: this.addViewText,
      newViewText: this.newViewText,
      deleteViewText: this.deleteViewText,
      lastSharedViewText: this.lastSharedViewText,
      sharedLayerText: this.sharedLayerText,
      widthText: this.widthText,
      fieldLabelText: this.fieldLabelText,
      sectionIcons: this.sectionIcons,
      sectionIconChoices: this.sectionIconChoices,
      sectionIconText: this.sectionIconText,
      variantText: this.variantText,
      hintText: this.hintText,
      hiddenText: this.hiddenText,
      configureHintText: this.wide ? this.configureHintText : this.configureHintNarrowText,
      fieldSettingsText: this.fieldSettingsText,
      shownText: this.shownText,
      showRareText: this.showRareText,
      hideRareText: this.hideRareText,
      rareText: this.rareText,
      unplacedTitle: this.unplacedTitle,
      moveUpText: this.moveUpText,
      moveDownText: this.moveDownText,
      addFieldText: this.addFieldText,
      canOpenFullPage: this.canOpenFullPage,
      groupAt: groupKey => this.groupAt(groupKey),
      groupCount: this.groupCount,
      fieldChoices: groupKey => this.fieldChoices(groupKey),
      addSearch: this.addSearch,
      inThisGroupText: this.inThisGroupText,
      renameText: this.renameText,
      saveNameText: this.saveNameText,
      cancelNameText: this.cancelNameText,
      removeFieldText: this.removeFieldText,
      removeGroupText: this.removeGroupText,
      removeSectionText: this.removeSectionText,
      addGroupText: this.addGroupText,
      addSectionText: this.addSectionText,
      newGroupTitle: this.newGroupTitle,
      newSectionTitle: this.newSectionTitle,
      renaming: this.renaming,
      noMatchText: this.noMatchText,
      unplacedHintText: this.unplacedHintText,
      panelMenuItems: this.panelMenuItems,
      collectionLabel: this.collectionLabel,
      collectionIcon: this.collectionIcon,
      favourite: this.favourite,
      favouriteLabel: this.favouriteLabel,
      menuLabel: this.menuLabel,
      addressUrl: this.addressUrl ?? this.address,
      copyFeedbackMs: COPY_FEEDBACK_MS,
      linkCopiedLabel: this.linkCopiedLabel,
      // The three the head draws beside those, which were not here. Every
      // label the panel shows is resolved by a getter that reads the
      // page's language; a label left out of this context falls through
      // to the declared default instead, which is English. So on a
      // Russian page the panel's head read «В избранное», «Ещё» and
      // «Ссылка скопирована» beside «Close», «Copy link» and «Open as a
      // page» -- one header in two languages. `linkCopiedLabel` being
      // here while `copyLinkLabel` was not is the shape of a line added
      // one at a time (owner, 2026-10-10, on the admin polygon).
      closeLabel: this.closeLabel,
      copyLinkLabel: this.copyLinkLabel,
      openFullLabel: this.openFullLabel,
      inheritedText: this.inheritedText,
      wide: this.wide,
      phoneSection: this.phoneSection,
      phoneSectionLabel: this.phoneSectionLabel,
      backLabel: this.backLabel,
      drawerStep: this.drawerStep,
      sectionsLayout: this.sectionsLayout,
      nestedUnder: this._nestedUnderLabel || "",
      canDeleteRecord: this.canDeleteRecord,
      recordMenuItems: this.recordMenuItems,
      errorList: this.errorList,
      requiredErrorText: this.requiredErrorText,
      // C305
      quickEdit: this.quickEdit,
      quick: this.quick,
      isQuickField: field => this.isQuickField(field),
      savedKeys: this.savedKeys,
      editAll: this.editAll,
      leaveAsk: this.leaveAsk,
      formEdit: this.formEdit,
      historyOffered: this.historyOffered,
      historyOpen: this.historyOpen && !this.historySide,
      historySide: this.historySide,
      history: this.historyFeed,
      docked: this.docked,
      dockBreakpoint: DOCK_BREAKPOINT,
      // VP-26: sf-tabs vertical once it places its box by its own column;
      // until then sf-menu, and sf-tabs where sf-menu is not defined.
      sectionColumnTabs: typeof globalThis.customElements?.get?.("sf-tabs")?.prototype?.placeBox === "function" || !globalThis.customElements?.get?.("sf-menu"),
      word: key => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, key, this),
      // C311: levels, locks, the head, the tabs' and fields' menus.
      canWriteShared: this.canWriteShared,
      viewRequired: this.viewRequired,
      requiredEdits: Boolean(this.requiredEdits),
      hasPersonalEdits: this.hasPersonalEdits,
      isLocked: path => this.isLocked(path),
      lockedForMe: path => this.lockedForMe(path),
      headLine: this.headLine,
      fieldMenuEntries: key => this.configuring ? this.fieldMenuEntries(key) : []
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_13__.renderPropertyViewTemplate)(this.templateContext());
  } // A printed skeleton (data-sf-first-paint="skeleton", skeleton.html) stays
  // until the record comes through the port (standard 1.3.8 §5.4): the first
  // render then draws the record over it in one frame. A panel draws in its
  // drawer, so it renders at once.


  sfAwaitingData() {
    if (this.getAttribute("data-sf-first-paint") !== "skeleton" || this.panel) return false;
    return !this.record && !this.loadFailure && this.getAttribute("data-state") !== "error";
  } // A view refusal in words (port 1.22.0, Larena backend c311-reply): the
  // host's message if it sends one, else the pack's words for its code;
  // a machine code is never shown to a person.


  viewRefusalText(answer, fallback = this.viewDeniedText) {
    if (answer?.message) return String(answer.message);
    const key = VIEW_REFUSALS[String(answer?.reason ?? answer?.code ?? "")];
    return key ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, key, this) : fallback;
  }

  _setState(state, message = "") {
    // Loading again while loading draws nothing new: the skeleton is already
    // on screen (one action, one render).
    const unchanged = state === "loading" && this.getAttribute("data-state") === "loading" && !this.record;
    this.setAttribute("data-state", state);
    this.setAttribute("aria-busy", state === "loading" ? "true" : "false");
    this.message = message;
    if (!unchanged) this.requestComponentUpdate("state");
    this.dispatchEvent(new CustomEvent("sf-view-properties-state", {
      bubbles: true,
      composed: true,
      detail: {
        state,
        message
      }
    }));
  } // Whether an answer still describes something on screen is the caller's
  // question, not this method's. One counter for every intent was wrong the
  // moment two reads could be in flight at once: opening a group asks for the
  // candidates of every reference field in it in the same tick, each ask bumped
  // the one counter, and only the last answer was kept -- the others were
  // dropped and their fields sat at «Загрузка записей» for ever. A consumer
  // found it with four reference fields in one group; the probe had one, and one
  // is a number at which concurrency does not exist.


  async _raise(intent, payload, {
    stale = () => false
  } = {}) {
    if (!this.hostPort) {
      this._setState("error", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "statePortNotConnected", this));

      return {
        answer: "unavailable",
        reason: "port-not-connected"
      };
    }

    try {
      const answer = await this.hostPort.raise(intent, copy(payload), {}); // A late answer is dropped rather than rendered: what it describes is
      // not what is on screen any more.

      if (!this.isConnected || stale()) return null;

      if (!answer || !["applied", "conflict", "refused", "unavailable"].includes(answer.answer)) {
        throw new TypeError("Host answer is not a declared port answer");
      } // A saved record tells the rest of the page what changed, on the
      // page host's outputs (simai.interface-fragment, effects).


      if (answer.answer === "applied" && Array.isArray(answer.effects) && answer.effects.length) {
        globalThis.SF?.Composition?.publishEffects?.(answer.effects, {
          origin: this
        });
      } // A save over a revision that moved (Larena: refused revision_moved,
      // with the current revision, nothing written) is a conflict: the
      // card says so, keeps what was typed and reads the record again.


      if (answer.answer === "refused" && answer.reason === "revision_moved") return { ...answer,
        answer: "conflict"
      };
      return answer;
    } catch (error) {
      if (!this.isConnected || stale()) return null;

      this._setState("error", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "stateLoadFailed", this));

      return {
        answer: "unavailable",
        reason: "host-threw",
        message: String(error?.message || error)
      };
    }
  } // Whether the host reads one group at a time (port 1.15.0 §4.9). Without
  // the capability record.load is asked once per revision and every group is
  // served from that one answer, as before 1.15.0. A create has no record to
  // read a group of.


  get readsByGroup() {
    return Boolean(this.hostPort?.capabilities?.includes("group-load")) && this.mode !== "create";
  }

  async load(reason = "requested") {
    // Another record in the same panel (C305 (4)): what was open for the
    // last one is not this one's.
    if (reason === "record-id-changed") {
      this._dropEntries();

      this.leaveAsk = null;
      this.historyFeed = null;
      this.historyOpen = false;
      this.phoneSection = null;
    }

    this._setState("loading", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "stateLoading", this));

    this.loadFailure = null;
    const epoch = ++this.epoch;
    const creating = this.mode === "create";
    const byGroup = this.readsByGroup;

    if (byGroup) {
      this.groupEpoch += 1;
      this.groupReads = new Map();
      this.groupsReading = new Set();
    } // With group-load the first read is a group: group null answers the
    // group the panel opens on, with the whole arrangement and every other
    // group's field count, and names the group it carries.


    const answer = byGroup ? await this._raise("group.load", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      group: null,
      reason
    }, {
      stale: () => epoch !== this.epoch
    }) : await this._raise("record.load", {
      record_id: creating ? null : this.recordId || null,
      collection: this.collection || null,
      reason,
      // An empty object of the collection, laid out by its arrangement
      // (port 1.12.0).
      ...(creating ? {
        mode: "create"
      } : {})
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null; // A panel is placed before the host names its record: asked with no
    // record, the host answered «unavailable», and «Запись недоступна» stood
    // in the panel until the record's own answer came (owner, 2026-10-14).
    // Not having been told which record is not a failure: the panel waits,
    // loading, for its record.

    if (answer.answer !== "applied" && !creating && !this.recordId) return answer;

    if (answer.answer !== "applied") {
      // Said by the empty state, only once there is an answer: refused is
      // no access; anything else could not load, with «Повторить».
      this.loadFailure = {
        kind: answer.answer === "refused" ? "no-access" : "error",
        text: answer.message || ""
      };

      this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "stateUnavailable", this)); // The fact a screen reads a missing record from (vocabulary §4):
      // sf-property-view-failed {reason, message}.


      this.sfEmit("failed", {
        reason: String(answer.reason ?? ""),
        message: String(answer.message ?? "")
      });
      return answer;
    }

    this.record = byGroup ? { ...(answer.record ?? {}),
      revision: answer.revision ?? answer.record?.revision ?? null
    } : answer.record ?? null; // Copied, not held by reference. Configuring moves a field between groups
    // in this array before the host answers -- «applied immediately» is what
    // the request asks for -- and a component that did that to the object the
    // host handed it would be rearranging the host's own data. A host that
    // caches its answer would find its record silently rewritten by a drag it
    // had not accepted yet.

    this.sections = [];

    this._takeSections(this.record);

    this.view = answer.record?.view ?? null; // A target the person may no longer write cannot stay selected: the rights
    // travel with the answer, so they can change between two loads.

    const editable = this.editableLayers;
    if (!editable.includes(this.viewTarget)) this.viewTarget = editable[0] ?? "personal";
    if (!editable.length) this.configuring = false;
    this.layerDraft = this.configuring ? this._layerCopy(this.viewTarget) : null;
    this.entryErrors = new Map();
    const known = this.sections.some(section => String(section.key) === this.selectedSection); // The section the answered group is in, when the panel had none chosen.

    const answered = byGroup && answer.group !== undefined && answer.group !== null ? this.sections.find(section => (section.groups ?? []).some(group => String(group.key) === String(answer.group))) : null;

    if (!known) {
      this.selectedSection = answered ? String(answered.key) : this.sections.length ? String(this.sections[0].key) : null;
    }

    this._setState("ready");

    if (byGroup) this._readShownGroups("started");
    return answer;
  } // What an answer carries is the record from now on. Reading by group, a
  // group the answer did not read (fields empty, a field_count) keeps the
  // fields it was read with, and the revision it was read at says whether it
  // is read again when it is next shown.


  _takeSections(record) {
    if (!Array.isArray(record?.sections)) return;
    const incoming = copy(record.sections);

    if (!this.readsByGroup) {
      this.sections = incoming;
      return;
    }

    const revision = record.revision === undefined || record.revision === null ? "" : String(record.revision);
    const held = new Map(this.sections.flatMap(section => (section.groups ?? []).map(group => [String(group.key), group])));

    for (const section of incoming) {
      const groups = Array.isArray(section.groups) ? section.groups : [];
      groups.forEach((group, index) => {
        const key = String(group.key);

        if (!groupNotRead(group)) {
          this.groupReads.set(key, revision);
          return;
        }

        const mine = held.get(key);
        if (mine && this.groupReads.has(key)) groups[index] = { ...group,
          fields: mine.fields
        };
      });
    }

    this.sections = incoming;
  } // The groups on screen: every group of an open-all surface or of the view
  // being arranged, otherwise the groups of the section being read.


  _shownGroups() {
    const shown = this.openAll || this.configuring ? this.sections : this.sections.filter(section => String(section.key) === this.selectedSection);
    return shown.flatMap(section => (section.groups ?? []).map(group => ({
      section: String(section.key),
      group: String(group.key)
    })));
  } // A section that starts asks group.load for each of its groups not read at
  // the record's revision (§7.2.1, reason started). Each answer is merged into
  // the arrangement; a newer revision leaves the other groups to be read
  // again when next shown, and a group the record no longer holds
  // (unknown-group) reads the arrangement again.


  _readShownGroups(reason = "started", {
    force = false
  } = {}) {
    if (!this.readsByGroup || !this.record) return [];
    const current = this.revision;
    const reads = [];

    for (const {
      section,
      group
    } of this._shownGroups()) {
      if (this.groupsReading.has(group)) continue;
      if (this.groupsRefused.get(group) === current) continue;
      if (!force && this.groupReads.get(group) === current) continue;
      reads.push(this._readGroup(section, group, reason));
    }

    return reads;
  }

  async _readGroup(section, group, reason) {
    const epoch = this.groupEpoch;
    this.groupsReading.add(group);
    this.requestComponentUpdate("group-reading");
    const answer = await this._raise("group.load", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      section,
      group,
      reason
    }, {
      stale: () => epoch !== this.groupEpoch
    });
    if (epoch !== this.groupEpoch) return null;
    this.groupsReading.delete(group);
    if (!answer) return null;

    if (answer.answer === "refused" && answer.reason === "unknown-group") {
      const refusedAt = this.revision;
      if (this.groupsRefused.get(group) === refusedAt) return answer;
      this.groupsRefused.set(group, refusedAt);
      await this.load("requested");
      return answer;
    }

    if (answer.answer !== "applied") {
      this.requestComponentUpdate("group-reading");
      return answer;
    }

    const revision = answer.revision ?? answer.record?.revision ?? this.record?.revision ?? null;
    this.record = { ...this.record,
      ...(answer.record ?? {}),
      revision
    };

    this._takeSections(this.record);

    this.requestComponentUpdate("group-read");
    return answer;
  } // Is this group's read still on its way (port 1.15.0)? The template draws
  // the group as loading meanwhile.


  isGroupReading(key) {
    return this.groupsReading.has(String(key));
  } // A conflict carries the record's current revision: what the person typed
  // is kept, and what is shown is read again at that revision -- the groups
  // on screen by group.load, or the whole record once by record.load.


  async _rereadAfterConflict(answer) {
    if (this.readsByGroup) {
      if (answer?.revision !== undefined && answer.revision !== null && this.record) {
        this.record = { ...this.record,
          revision: answer.revision
        };
      }

      return Promise.all(this._readShownGroups("requested", {
        force: true
      }));
    }

    const epoch = this.epoch;
    const read = await this._raise("record.load", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      reason: "requested"
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!read || read.answer !== "applied" || !read.record) return read;
    this.record = read.record;

    this._takeSections(read.record);

    this.requestComponentUpdate("conflict-reread");
    return read;
  } // The two the file editor asks of a host, and the capability that decides
  // whether the editor exists at all. Without it a file field shows what it
  // already holds, read-only -- the same arrangement as the record picker.


  get canUploadFiles() {
    return Boolean(this.hostPort?.capabilities?.includes("field-upload"));
  }

  getFieldUploads(field) {
    return this.uploads.get(String(field.key ?? "")) ?? [];
  }

  async startFieldUpload(field, items) {
    const key = String(field.key ?? "");
    const chosen = Array.isArray(items) ? items : [];
    if (!chosen.length) return null; // Recorded before anything is sent, because the component is the only
    // thing that knows what the person chose: sf-file-upload fills its own
    // list and every render writes this one over it.

    this.uploads.set(key, [...this.getFieldUploads(field), ...chosen]);
    this.requestComponentUpdate("uploads");

    for (const item of chosen) {
      const answer = await this._raise("field.upload", {
        record_id: this.recordId || null,
        collection: this.collection || null,
        field: key,
        file: item.file ?? item
      }, {
        stale: () => !this.uploads.has(key)
      });
      if (!answer) return null;
      const current = this.getFieldUploads(field);

      if (answer.answer === "applied" && answer.file) {
        // A stored file is a value change like any other: it joins what
        // the person has changed and waits for the save button. Nothing
        // about the record is written here.
        const held = this.changed.has(key) ? this.changed.get(key) : field.value;
        const list = Array.isArray(held) ? held : held ? [held] : [];
        this.changed.set(key, [...list, answer.file]);
        this.uploads.set(key, current.filter(entry => entry !== item));
        this.errors.delete(key);
      } else {
        this.uploads.set(key, current.map(entry => entry === item ? { ...entry,
          state: "error",
          errorMessage: answer.message || answer.reason || ""
        } : entry));

        if (answer.answer === "refused" && answer.reason) {
          this.errors.set(key, String(answer.message || answer.reason));
        }
      }

      this.requestComponentUpdate("uploads");
    }

    return this;
  }

  retryFieldUpload(field, index) {
    const key = String(field.key ?? "");
    const current = this.getFieldUploads(field);
    const item = current[Number(index)];
    if (!item) return null;
    this.uploads.set(key, current.filter(entry => entry !== item));
    return this.startFieldUpload(field, [item]);
  } // A reference value was activated. The component asks and decides nothing:
  // following the href would be routing for the consumer, and opening a window
  // itself would be deciding whether a half-edited window may be covered.


  async openReference(field, value) {
    if (!value || typeof value !== "object") return null;
    const answer = await this._raise("record.open", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      field: String(field.key ?? ""),
      value
    }, {
      stale: () => !this.isConnected
    }); // Vocabulary §5 open; sf-property-view-open-record follows once (aliases.json).

    this.sfEmit("open", {
      field: String(field.key ?? ""),
      value,
      answer: answer?.answer ?? null
    });
    return answer;
  } // The drawer that carries this panel: a child of the element (the drawer
  // portals its content, not itself).


  _ownDrawerRoot() {
    const drawer = this._ownDrawer();

    return drawer?.getDrawerRoot?.() ?? drawer;
  }

  _startTitleFocus() {
    if (this._titleFocusUntil) return;
    this._titleFocusUntil = performance.now() + TITLE_FOCUS_WAIT_MS;
    document.addEventListener("focusin", this._onPanelFocusIn, true);
    document.addEventListener("pointerdown", this._onPanelAct, true);
    document.addEventListener("keydown", this._onPanelAct, true);
  }

  _endTitleFocus() {
    this._titleFocusUntil = 0;
    if (this._onPanelFocusIn) document.removeEventListener("focusin", this._onPanelFocusIn, true);

    if (this._onPanelAct) {
      document.removeEventListener("pointerdown", this._onPanelAct, true);
      document.removeEventListener("keydown", this._onPanelAct, true);
    }
  } // Gives the title the focus the drawer handed out on its own: the panel
  // itself (waiting for content) or its first control. A field it chose, a
  // focus the person moved, or a focus still outside the panel stays.


  _focusTitleFirst() {
    if (!this._titleFocusUntil) return;
    if (performance.now() > this._titleFocusUntil) return this._endTitleFocus();

    const drawer = this._ownDrawer();

    const root = this._ownDrawerRoot();

    const panel = root?.querySelector?.("[data-sf-drawer-panel]");
    const title = panel?.querySelector?.(".sf-property-view-panel .sf-property-view-title");
    const active = document.activeElement;
    if (!panel || !title || !active || !panel.contains(active)) return;
    if (active.closest?.("input, textarea, select, [contenteditable], sf-input, sf-select, sf-textarea")) return this._endTitleFocus();
    if (active !== panel && active !== drawer?.firstFocusIn?.(panel)) return this._endTitleFocus();

    this._endTitleFocus();

    title.tabIndex = -1;
    title.focus({
      preventScroll: true
    });
  } // The record this panel was opened from, when its drawer is drawn inside
  // another panel at the same edge (sf-drawer's nesting, C157 (6)): that
  // panel's title, for the «← <Запись>» line over this one's.


  _recordName(record) {
    const name = record?.label || record?.title;
    return name ? String(name) : "";
  }

  _nestedLabel() {
    const below = this.panel ? this._ownDrawer()?.nestedUnder?.() : null;
    if (!below) return "";
    const owner = below.parentElement;

    if (owner && owner !== this && typeof owner.panelLabel === "string") {
      return owner.panelLabel || this._recordName(owner.record) || owner.recordId || this.backLabel;
    }

    return below.getAttribute("heading") || below.getAttribute("label") || this.backLabel;
  }

  _ownDrawer() {
    return [...this.children].find(child => child.localName === "sf-drawer") ?? null;
  } // Read from the layer stack, not kept: how many panels of this component
  // stand below this one, and whether no window (a modal or another panel)
  // stands above it. A list or a menu opened inside the panel leaves it on top.


  get stackDepth() {
    const drawer = this._ownDrawer();

    if (!drawer || !(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.hasLayer)(drawer)) return 0;
    const panels = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.openLayers)("panel").filter(owner => owner?.parentElement?.localName === this.localName);
    return Math.max(0, panels.indexOf(drawer));
  }

  get isTopPanel() {
    const drawer = this._ownDrawer();

    return Boolean(drawer && (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.hasLayer)(drawer) && !(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.hasLayerAbove)(drawer, ["modal", "panel"]));
  } // What a panel's three controls do, and all three are the host's decisions
  // announced rather than carried out here. The component closes itself, says
  // what was copied, and says what should be opened; where a window goes, and
  // whether it may close over unsaved edits, belongs to whoever placed it.


  closePanel(reason = "close", {
    asked = false
  } = {}) {
    this._commitFocusedEntry();

    const unsaved = this.unsavedFields; // Unsaved entries are asked about first (C159 (6)); a delete and a
    // cancel of a create surface are the host's to decide.

    if (unsaved && !asked && reason !== "deleted" && !(this.openAll && !this.editAll)) {
      this.leaveAsk = {
        kind: "close",
        reason
      };
      this.requestComponentUpdate("leave");
      return {
        outcome: "refused",
        reason: "unsaved"
      };
    } // A cancelable request (vocabulary §5 close, standard 1.3.8 §19.3): the
    // page decides whether it closes; a listener may refuse it.


    const allowed = this.sfEmit("close", {
      reason,
      record_id: this.recordId || null,
      unsaved_fields: unsaved,
      asked: Boolean(asked)
    }, {
      cancelable: true
    });
    return allowed ? {
      outcome: "applied"
    } : {
      outcome: "refused",
      reason: "prevented"
    };
  } // What would be lost by closing: every changed field, and every entry that
  // is not a value yet -- a masked text not filled in is work the person did,
  // though there is nothing to save (Larena acceptance, 2026-10-22: Esc after
  // an entry closed without asking).


  get unsavedFields() {
    return new Set([...this.changed.keys(), ...this.inputErrors.keys()]).size;
  } // A field reports its value when it loses focus, so a time typed and left
  // focused is not counted until then. Closing takes the focus first, and the
  // field reports before the count is read.


  _commitFocusedEntry() {
    let active = document.activeElement;

    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;

    if (!active || typeof active.blur !== "function") return;
    const panel = this.panel ? this.panelContent() : null;
    if (this.contains(active) || panel?.contains(active)) active.blur();
  } // What a person pastes is a page they can open, so the host's address is
  // resolved against the page it is read on (owner, 2026-10-08). The event
  // still carries the host's own address, because that is what the host knows
  // the record by.


  get addressUrl() {
    const address = this.address;
    if (!address) return null;

    try {
      return new URL(String(address), globalThis.location?.href).href;
    } catch {
      return String(address);
    }
  } // Copying is the Framework's clipboard (core/js/clipboard.js, with its
  // fallback for a browser that refuses the clipboard); the «⋯» row that
  // asks for it says the result in the panel's status line, read out
  // politely, and the event carries it to the host.


  copyControl() {
    return null;
  }

  get addressCopied() {
    return this._addressCopied === true;
  }

  announceAddressCopy(copied) {
    const address = this.address;
    this.dispatchEvent(new CustomEvent("sf-view-properties-address-copy", {
      bubbles: true,
      composed: true,
      detail: {
        address,
        url: this.addressUrl ?? address,
        copied,
        record_id: this.recordId || null
      }
    }));
    return copied;
  }

  async copyAddress() {
    if (!this.address) return null;
    let copied = false;

    try {
      copied = Boolean(await (0,_core_js_clipboard_js__WEBPACK_IMPORTED_MODULE_11__.copyText)(this.addressUrl ?? String(this.address)));
    } catch {
      copied = false;
    }

    this._addressCopied = copied;

    if (copied) {
      this.message = this.linkCopiedLabel;
      this.requestComponentUpdate("address-copied");
      clearTimeout(this._copiedTimer);
      this._copiedTimer = setTimeout(() => {
        this._addressCopied = false;
        if (this.message === this.linkCopiedLabel) this.message = "";
        this.requestComponentUpdate("address-copied");
      }, COPY_FEEDBACK_MS);
    }

    this.announceAddressCopy(copied);
    return copied;
  }

  openFullPage() {
    const address = this.address;
    if (!address) return null; // An intent, not a navigation: the component does not know whether the
    // consumer routes by href, by a client router or by replacing a region.
    // Vocabulary §5 open-full {id}; the address and record_id stay for the
    // listeners that read them.

    this.sfEmit("open-full", {
      id: this.recordId || null,
      address,
      record_id: this.recordId || null
    });
    return this;
  } // The phone's two screens. Opening a section also selects it, so leaving the
  // phone arrangement lands on the section the person was last reading rather
  // than on the first one.


  openPhoneSection(key) {
    const name = String(key);
    if (!this.sections.some(section => String(section.key) === name)) return false;
    this.phoneSection = name;
    this.selectSection(name);
    this.requestComponentUpdate("phone-section");
    return true;
  }

  closePhoneSection() {
    if (this.phoneSection === null) return false;
    this.phoneSection = null;
    this.requestComponentUpdate("phone-section");
    return true;
  }

  get phoneSectionLabel() {
    const current = this.sections.find(section => String(section.key) === this.phoneSection);
    return current ? String(current.label ?? current.key) : "";
  }

  selectSection(key) {
    this.selectedSection = String(key);
    this.requestComponentUpdate("section"); // A section that starts reads the groups it has not read at this
    // revision (port 1.15.0, group-load).

    this._readShownGroups("started");

    return this;
  } // The four the edit template asks for when it builds a record picker. The
  // picker renders only when a host can serve candidates; without them the
  // template returns nothing and the field falls back to its value read-only,
  // which is what a 1.0.0 host gets.


  get canPickRecords() {
    return Boolean(this.hostPort?.capabilities?.includes("field-options"));
  }

  getFieldOptionsPage(field) {
    return this.optionPages.get(String(field.key ?? "")) ?? null;
  }

  getFieldOptionSearch(field) {
    return this.optionSearches.get(String(field.key ?? "")) ?? "";
  }

  setFieldOptionSearch(field, text) {
    this.optionSearches.set(String(field.key ?? ""), String(text ?? ""));
    return this;
  }

  async loadFieldOptions(field, {
    cursor = null,
    search = "",
    quiet = false
  } = {}) {
    const key = String(field.key ?? "");
    const previous = this.optionPages.get(key); // A new search starts a new list; a cursor continues the one on screen.

    const items = cursor && Array.isArray(previous?.items) ? previous.items : []; // `quiet` is the page the group asks for as it opens. It is not announced,
    // because a consumer saw «Загрузка записей» standing under four closed
    // fields at once; an error always is.

    this.optionPages.set(key, {
      items,
      status: "loading",
      quiet,
      nextCursor: previous?.nextCursor ?? null
    });
    this.requestComponentUpdate("options"); // Dropped when the record changes, or when a newer search or page for this
    // same field is in flight -- and not when another field is read.

    const recordEpoch = this.epoch;
    const fieldEpoch = (this.optionEpochs.get(key) ?? 0) + 1;
    this.optionEpochs.set(key, fieldEpoch);
    const answer = await this._raise("field.options", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      field: key,
      cursor,
      search: String(search ?? ""),
      // The reference list a lookup chooses from, and how many to answer
      // with (port 1.14.0). Sent only to a host that reads them: the
      // payload of an earlier port is closed.
      ...(versionAtLeast(this.hostPort?.version, "1.14.0") ? { ...(field.source ? {
          source: String(field.source)
        } : {}),
        limit: OPTIONS_PAGE_LIMIT
      } : {})
    }, {
      stale: () => recordEpoch !== this.epoch || fieldEpoch !== this.optionEpochs.get(key)
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      // A refusal and an unavailability are different answers and a person
      // can act on only one of them. «Refused» means this field has no
      // candidates to offer -- a relation whose owner package is absent --
      // so a retry would fail for ever and an empty picker over an existing
      // value reads as the value being gone. The field falls back to its
      // value, read-only. «Unavailable» means not now, so the retry stays.
      const refused = answer.answer === "refused";
      this.optionPages.set(key, {
        items,
        status: refused ? "unsupported" : "error",
        quiet: false,
        nextCursor: null
      });
      this.requestComponentUpdate("options");
      return answer;
    }

    const page = answer.options_page ?? {};
    const arrived = Array.isArray(page.items) ? page.items : [];
    this.optionPages.set(key, {
      items: cursor ? [...items, ...arrived] : arrived,
      status: "ready",
      quiet: false,
      // Opaque: sent back exactly as it arrived, never constructed here.
      nextCursor: page.next_cursor ?? null,
      total: page.total ?? null
    });
    this.requestComponentUpdate("options");
    return answer;
  } // `undefined` takes a change back: the person erased what they typed into a
  // write-only field (a password), and a save must carry nothing for it --
  // not an empty value that would clear what the host keeps.


  changeField(field, value) {
    const key = String(field.key ?? ""); // Back to what the record holds is no change. A control is drawn with
    // the change it made, so it compares a later entry with that and not
    // with the record: a time put back to the stored one was written.

    const stored = Object.hasOwn(field ?? {}, "value") && value !== undefined && JSON.stringify(value) === JSON.stringify(field.value ?? null);
    if (value === undefined || stored) this.changed.delete(key);else this.changed.set(key, value);
    this.errors.delete(key); // A confirmation described the save as it stood; an entry changed after
    // it is a different save, and the question goes until save is pressed again.

    this.confirmation = null;
    this.requestComponentUpdate("changed");
    return this;
  }

  _clearInputs() {
    this.inputErrors.clear();
    this.controlErrors.clear();
  } // A field control that knows its entry is not a value yet (port 1.16.0,
  // consumer simai.main): a masked string that does not fill its mask. The
  // renderer set tells the host through setFieldError(field, message) on
  // every keystroke, and null once the text is complete or cleared. Such an
  // entry is held in inputErrors, so the same rule stops both saves -- group.save and
  // record.save («Изменить всё») -- and Save is drawn disabled while any field
  // of the surface is incomplete. Each field is its own key, so one masked
  // field completed does not release another still incomplete. What was typed
  // is the change itself (the set writes the text as shown) and is kept.


  reportFieldError(field, message) {
    const key = String(field?.key ?? "");
    if (!key) return this;
    const before = this.inputErrors.get(key);

    if (message) {
      this.inputErrors.set(key, String(message));
      this.controlErrors.add(key);
    } else if (this.controlErrors.has(key)) {
      this.inputErrors.delete(key);
      this.controlErrors.delete(key);
    }

    if (this.inputErrors.get(key) !== before) this.requestComponentUpdate("errors");
    return this;
  } // Whether a field's condition turns it off now (port 1.14.0 when.enabled).
  // The renderer set draws such a field disabled where it draws disabled and
  // read-only apart -- a choice as buttons (port 1.16.0) -- and as read-only
  // everywhere else, as before.


  fieldDisabled(field, values = this.fieldValues()) {
    return Boolean(field?.when) && !(0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldConditions)(field, values).enabled;
  } // Which fields in a group are picked from a list the host pages rather than
  // typed. A lookup that brought its list inline is chosen from in place and
  // asks for nothing. A field its condition hides now still has its first page
  // asked for: the condition can change at any keystroke, and a picker that
  // appears empty is the broken-looking case this read exists to avoid.


  _referenceFields(section, group) {
    const current = this.sections.find(entry => String(entry.key) === String(section));
    const found = this.visible(current?.groups).find(entry => String(entry.key) === String(group));
    return this.visible(found?.fields, {
      conditions: false
    }).filter(field => PAGED_TYPES.includes(field.propertyType || field.type)).filter(field => !((field.propertyType || field.type) === "lookup" && Array.isArray(field.options) && field.options.length > 0));
  }

  editGroup(section, group, {
    focus = null
  } = {}) {
    if (!this.mayEdit) return this;
    this.quick = null;
    this.editing = {
      section: String(section),
      group: String(group)
    }; // sf-form draws the group when it draws every field (C182, VP-19);
    // its fields and saved value are kept for the whole edit.

    this.formEdit = this._formEditOf(section, group);
    this._focusFieldAfterRender = focus === null || focus === undefined ? null : String(focus);
    this.changed.clear();

    this._clearInputs();

    this.errors.clear();
    this.conflict = null;
    this.confirmation = null;
    this.requestComponentUpdate("editing"); // The first page is asked for as the group opens, not when the person
    // first types: a picker that is empty until you search looks broken, and
    // the common case is choosing from the first page without searching at
    // all.

    if (this.canPickRecords) {
      for (const field of this._referenceFields(section, group)) {
        if (!this.optionPages.has(String(field.key ?? ""))) {
          this.loadFieldOptions(field, {
            cursor: null,
            search: "",
            quiet: true
          });
        }
      }
    }

    return this;
  }

  cancelEdit() {
    if (this.quick) {
      this._quickPopover(this.quick.key)?.close?.();
      return this.endQuick() && this;
    } // «Изменить всё» opened from the menu goes back to reading.


    if (this.editAll) {
      this._dropEntries();

      this.dispatchEvent(new CustomEvent("sf-view-properties-cancel", {
        bubbles: true,
        composed: true,
        detail: {
          mode: "edit",
          scope: "record"
        }
      }));
      return this;
    } // Cancel drops what was typed and writes nothing. Data is saved by the
    // button alone, so there is nothing to undo. On a surface open all at
    // once the host decides where cancelling leads (a panel closes).


    if (this.openAll) {
      this.dispatchEvent(new CustomEvent("sf-view-properties-cancel", {
        bubbles: true,
        composed: true,
        detail: {
          mode: this.mode
        }
      })); // A panel asks to close with what is unsaved, as the cross and Esc
      // do, so the host asks the same question on every way out; the
      // entries stay until the host closes it, and survive a «no»
      // (Larena acceptance, 2026-10-22: «Отменить» discarded first and
      // then reported nothing unsaved).

      if (this.panel) {
        this.closePanel("cancelled");
        return this;
      }

      this.changed.clear();

      this._clearInputs();

      this.errors.clear();
      this.conflict = null;
      this.confirmation = null;
      this.requestComponentUpdate("editing");
      return this;
    } // A group's cancel is a fact too (simai.main, 2026-10-27): a host that
    // tracks unsaved work -- a page's beforeunload, a dirty mark -- learns
    // from the event that the group's entries were dropped, rather than
    // from the button's text or the panel's internals. The same event as
    // the whole-object cancel, with the group it was for.


    const group = this.editing;
    this.editing = null;
    this.formEdit = null;
    this.changed.clear();

    this._clearInputs();

    this.errors.clear();
    this.conflict = null;
    this.confirmation = null;
    this.requestComponentUpdate("editing");

    if (group) {
      this.dispatchEvent(new CustomEvent("sf-view-properties-cancel", {
        bubbles: true,
        composed: true,
        detail: {
          mode: this.mode,
          scope: "group",
          section: group.section,
          group: group.group
        }
      }));
    }

    return this;
  } // One press, one intent, one revision. Nothing is sent on blur and nothing
  // per field: a save carries the fields the person changed, against the
  // revision the read carried, and the host compares and sets.
  //
  // `confirm` is the digest of a confirmation the host asked for (port
  // 1.14.0): the same save raised again once the person has read what it does.
  // The fact after an applied save (simai/ui-pro#4; vocabulary §4, §5 save):
  // sf-property-view-saved {id, revision}. A page that refreshes its list on
  // a save listens here instead of wrapping the host port.


  announceSaved(answer) {
    const id = this.recordId || answer?.record_id || answer?.record?.record_id || null;
    const revision = answer?.revision ?? answer?.record?.revision ?? this.record?.revision ?? null;
    this.sfEmit("saved", {
      id,
      revision: revision === null ? "" : String(revision)
    });
  } // The fields a save covers: the group being edited, or on a surface open
  // all at once every editable group shown.


  _editedFields() {
    const out = [];

    for (const section of this.sections ?? []) {
      for (const group of this.visible(section?.groups)) {
        if (group.kind === "related" || group.editable === false) continue;
        const edited = this.openAll || this.editing && String(section.key) === this.editing.section && String(group.key) === this.editing.group;
        if (!edited) continue;

        for (const field of this.visible(group.fields)) {
          out.push(field.when ? this.conditionedField(field) : field);
        }
      }
    }

    return out;
  } // A required field left empty is said at the field before anything is sent
  // (C182 (6)); the host's own refusal is said the same way.


  _missingRequired() {
    const missing = new Map();
    const values = this.fieldValues();

    for (const field of this._editedFields()) {
      if (!field.required || field.readonly === true || this.fieldDisabled(field)) continue;
      const key = String(field.key ?? "");
      const value = values.get(key);
      const empty = value === undefined || value === null || value === "" || Array.isArray(value) && value.length === 0;
      if (empty) missing.set(key, this.requiredErrorText);
    }

    return missing;
  }

  get requiredErrorText() {
    return this.getAttribute("required-error-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "requiredErrorText", this);
  } // Save is never drawn disabled (C182 (7)): pressed with something wrong it
  // shows every error at its field and, from two, a summary with a link to
  // each, which takes the focus; one error takes the focus to its field.


  _refuseWithErrors(errors) {
    for (const [key, message] of errors) if (!this.errors.has(key) && !this.inputErrors.has(key)) this.errors.set(key, message);

    this._focusErrorsAfterRender = true;
    this.requestComponentUpdate("errors");
    return {
      answer: "refused",
      reason: this.inputErrors.size ? "input_invalid" : "required",
      errors: Object.fromEntries(new Map([...this.inputErrors, ...errors]))
    };
  } // The errors of the surface in the order their fields stand.


  get errorList() {
    const all = this.inputErrors.size ? new Map([...this.errors, ...this.inputErrors]) : this.errors;
    if (!all.size) return [];
    const labels = new Map();

    for (const section of this.sections ?? []) for (const group of section?.groups ?? []) {
      for (const field of group?.fields ?? []) labels.set(String(field.key ?? ""), String(field.label ?? field.key ?? ""));
    }

    const order = [...labels.keys()];
    return [...all.entries()].sort(([a], [b]) => (order.indexOf(a) + 1 || 1e9) - (order.indexOf(b) + 1 || 1e9)).map(([key, message]) => ({
      key,
      label: labels.get(key) ?? key,
      message
    }));
  } // The field a summary link points to: its first control.


  focusField(key) {
    const root = this._ownDrawerRoot?.() ?? this;
    const scope = (this.panel ? root : this) ?? this;
    const field = scope?.querySelector?.(`[data-field="${CSS.escape(String(key))}"]`);
    const target = field?.querySelector?.("input:not([type=hidden]), textarea, select, button, [tabindex]:not([tabindex='-1'])");
    (target ?? field)?.focus?.({
      preventScroll: false
    });
    field?.scrollIntoView?.({
      block: "nearest"
    });
    return Boolean(target ?? field);
  }

  _focusErrors() {
    const list = this.errorList;
    if (!list.length) return;

    if (list.length === 1) {
      this.focusField(list[0].key);
      return;
    }

    const scope = this.panel ? this._ownDrawerRoot?.() ?? this : this;
    scope?.querySelector?.(".sf-property-view-error-summary")?.focus?.({
      preventScroll: false
    });
  }

  async saveGroup({
    confirm = null
  } = {}) {
    if (this.openAll) return this.saveAll({
      confirm
    }); // A short field's window saves as its group does, with its one value.

    const target = this.editing ?? this.quick;
    if (!target) return null;
    const missing = this.quick ? new Set() : this._missingRequired();
    if (this.inputErrors.size || missing.size) return this._refuseWithErrors(missing); // Nothing changed: Save leaves the group as it is (Save is never
    // disabled, C182 (7)).

    if (this.changed.size === 0) {
      if (this.quick) return this.saveQuick();
      this.formEdit = null;
      this.editing = null;
      this.errors.clear();
      this.conflict = null;
      this.requestComponentUpdate("editing");
      return null;
    }

    const values = this._savedValues();

    if (!Object.keys(values).length) return null;
    this.confirmation = null;
    const epoch = ++this.epoch;
    const answer = await this._raise("group.save", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      section: target.section,
      group: target.group,
      values,
      revision: this.record?.revision ?? null,
      ...(confirm ? {
        confirm
      } : {})
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null;
    if (this._askedToConfirm(answer)) return answer;

    if (answer.answer === "applied") {
      this.record = answer.record ? { ...answer.record,
        revision: answer.revision ?? answer.record.revision
      } : { ...this.record,
        revision: answer.revision ?? this.record?.revision ?? null
      };

      this._takeSections(this.record);

      const written = Object.keys(values);
      if (this.quick) this._quickPopover(this.quick.key)?.close?.();
      this.editing = null;
      this.quick = null;
      this.formEdit = null;
      this.changed.clear();

      this._clearInputs();

      this.errors.clear();
      this.conflict = null;

      this._setState("ready");

      this.markSaved(written);
      this.announceSaved(answer); // The history the panel holds is older than this save.

      if (this.historyFeed) this.historyFeed = { ...this.historyFeed,
        record: null
      };
      if (this.historySide) this.loadHistory();
      return answer;
    }

    if (answer.answer === "conflict") {
      // What the person typed is kept. The object moved underneath them and
      // saying so is the whole point of a conflict; discarding their work to
      // show the newer object would be the component deciding for them.
      this.conflict = answer.message || this.conflictText;
      this.requestComponentUpdate("conflict");
      await this._rereadAfterConflict(answer);
      return answer;
    }

    if (answer.answer === "refused" && answer.reason === "unknown-group") {
      // The arrangement moved under the panel (a view changed elsewhere).
      await this.load("requested");
      return answer;
    }

    if (answer.answer === "refused") {
      this.errors = new Map(Object.entries(answer.errors ?? {}).map(([key, value]) => [key, String(value)])); // An sf-form edit shows the host's errors at its fields and in its
      // summary (set-errors); the card's own form focuses them itself.

      const form = this.formEdit ? this._formOf(target.group) : null;
      if (form?.setErrors) form.setErrors({
        errors: Object.fromEntries(this.errors)
      });else this._focusErrorsAfterRender = this.errors.size > 0;
      this.requestComponentUpdate("errors");
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveFailedText", this));

    return answer;
  } // A surface open all at once saves the whole object: a create makes it
  // (record.create), an edit saves every changed field as one revision
  // (record.save), port 1.12.0.


  async saveAll({
    confirm = null
  } = {}) {
    const missing = this._missingRequired();

    if (this.inputErrors.size || missing.size) return this._refuseWithErrors(missing);
    if (this.mode !== "create" && this.changed.size === 0) return null;
    const creating = this.mode === "create";

    const values = this._savedValues();

    if (!creating && !Object.keys(values).length) return null;
    this.confirmation = null;
    const epoch = ++this.epoch;
    const answer = creating ? await this._raise("record.create", {
      collection: this.collection || null,
      values
    }, {
      stale: () => epoch !== this.epoch
    }) : await this._raise("record.save", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      values,
      revision: this.record?.revision ?? null,
      ...(confirm ? {
        confirm
      } : {})
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null; // A create is not confirmed: record.create carries no digest.

    if (!creating && this._askedToConfirm(answer)) return answer;

    if (answer.answer === "applied") {
      const written = Object.keys(values);
      this.changed.clear();

      this._clearInputs();

      this.errors.clear();
      this.conflict = null;

      if (this.editAll) {
        this.editAll = false;
        this.markSaved(written);
      }

      if (creating) {
        const id = answer.record_id ?? answer.record?.record_id ?? null;
        this.dispatchEvent(new CustomEvent("sf-view-properties-created", {
          bubbles: true,
          composed: true,
          detail: {
            record_id: id,
            collection: this.collection || null
          }
        })); // The new object is shown as any object is: read, with what
        // this person may do with it.

        if (id !== null) {
          this.setAttribute("record-id", String(id));
          this.setAttribute("mode", "auto");

          if (answer.record) {
            this.record = answer.record;

            this._takeSections(answer.record);

            this.view = answer.record.view ?? this.view;

            this._setState("ready");
          } else {
            await this.load("created");
          }
        }

        return answer;
      }

      this.record = answer.record ?? this.record;

      this._takeSections(answer.record);

      this._setState("ready");

      this.announceSaved(answer);
      return answer;
    }

    if (answer.answer === "conflict") {
      this.conflict = answer.message || this.conflictText;
      this.requestComponentUpdate("conflict");
      return answer;
    }

    if (answer.answer === "refused") {
      this.errors = new Map(Object.entries(answer.errors ?? {}).map(([key, value]) => [key, String(value)]));
      this._focusErrorsAfterRender = this.errors.size > 0;
      if (!this.errors.size && answer.message) this.conflict = answer.message;
      this.requestComponentUpdate("errors");
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveFailedText", this));

    return answer;
  } // A save the host makes only once confirmed (port 1.14.0, the data view
  // port's shape since 1.8.0): refused with reason confirm_required, with what
  // the save will do and a digest of it. The person reads it in the bar where
  // they pressed save -- the component's own place for a question, as the
  // view's reset asks there -- and either confirms, which raises the same save
  // again with the digest, or goes back to editing, which sends nothing and
  // keeps every entry. A confirmation asked again -- the digest no longer
  // matched what the save would do -- is shown again with the host's new
  // words: a person confirms what will actually happen, never what was
  // described before something moved.


  _askedToConfirm(answer) {
    const confirm = answer?.confirm;
    if (answer?.answer !== "refused" || answer.reason !== "confirm_required" || !confirm || typeof confirm.digest !== "string" || !confirm.digest) return false;
    this.confirmation = {
      text: String(confirm.summary || answer.message || ""),
      digest: confirm.digest
    };
    this.requestComponentUpdate("confirmation");
    return true;
  }

  confirmSave() {
    const digest = this.confirmation?.digest;
    if (!digest) return Promise.resolve(null);
    return this.openAll ? this.saveAll({
      confirm: digest
    }) : this.saveGroup({
      confirm: digest
    });
  }

  cancelConfirmation() {
    this.confirmation = null;
    this.requestComponentUpdate("confirmation");
    return this;
  } // Configuring the view. The host decides three separate things and the
  // component decides none of them: whether a view can be configured at all
  // (the capability), which layers this person may write (`editable`, per
  // person rather than per host, which is why it travels in the answer), and
  // which layer hid a given entry (`hiddenBy`, so the rule that hiding for
  // everyone cannot be undone in a personal view stays in one place).


  get canConfigureView() {
    // Arranging is offered where it can be saved, and not on a surface
    // placed only to show the object. A new record is laid out by the same
    // arrangement as an existing one, so the form is arranged where it is
    // filled in too (owner, 2026-10-16: «нет настройки формы» on create).
    if (this.mode === "view") return false;
    return Boolean(this.hostPort?.capabilities?.includes?.("view-settings")) && Boolean(this.view) && this.editableLayers.length > 0;
  } // The named views this person may choose between. A view is a whole
  // arrangement with a permanent id -- which is what makes renaming possible
  // -- and the layers still resolve inside whichever one is chosen. Larena
  // had already settled this shape for its lists before the panel needed it,
  // and one idea met twice is worth more than two ideas (owner, 2026-10-09).
  //
  // One view is not a choice, so the component draws no chooser for it.


  get viewProfiles() {
    const profiles = this.view?.profiles;
    if (!Array.isArray(profiles)) return [];
    return profiles.filter(profile => profile && typeof profile.id === "string" && profile.id);
  }

  get viewProfile() {
    const current = this.view?.profile;
    if (typeof current === "string" && current) return current;
    return this.viewProfiles[0]?.id ?? null;
  } // Whether a view may be removed. The last shared one may not: a scope with
  // no shared view has nothing for a person who has made none of their own.
  // The host refuses it too -- it owns the list -- but a control that can
  // only be refused is not offered, which is the same rule the saved-view
  // controls answer to (owner, 2026-10-09).


  canDeleteViewProfile(id) {
    const profiles = this.viewProfiles;
    const profile = profiles.find(item => item.id === String(id ?? ""));
    if (!profile) return false;
    if (!profile.shared) return true;
    return profiles.filter(item => item.shared).length > 1;
  } // Making a view, from what is on screen. The host gives it an id and
  // answers with the record through it, because a person who has just made a
  // view is looking at it.


  createViewProfile(label, {
    shared = false
  } = {}) {
    const name = String(label ?? "").trim();
    if (!name) return null;
    return this._viewProfileIntent("view.create", {
      label: name,
      shared: Boolean(shared),
      view: this.layerDraft ?? this._layerCopy(this.viewTarget)
    });
  } // A rename changes the label. The id is permanent, so anything pointing at
  // the view keeps pointing at it.


  renameViewProfile(id, label) {
    const name = String(label ?? "").trim();
    const profile = String(id ?? "");
    if (!name || !profile) return null;
    if (!this.viewProfiles.some(item => item.id === profile)) return null;
    return this._viewProfileIntent("view.rename", {
      profile,
      label: name
    });
  }

  deleteViewProfile(id) {
    const profile = String(id ?? "");
    if (!this.canDeleteViewProfile(profile)) return null;
    return this._viewProfileIntent("view.delete", {
      profile
    });
  } // The three acts answer the way a read answers, so they are taken the same
  // way: whatever the host sends back is the arrangement from now on.


  async _viewProfileIntent(intent, payload) {
    const epoch = ++this.epoch;
    const answer = await this._raise(intent, {
      record_id: this.recordId || null,
      collection: this.collection || null,
      ...payload
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      this._setState("error", this.viewRefusalText(answer));

      return answer;
    }

    this.record = answer.record ?? this.record;

    this._takeSections(answer.record);

    this.view = answer.record?.view ?? this.view;
    this.layerDraft = this.configuring ? this._layerCopy(this.viewTarget) : null;

    this._setState("ready");

    this.requestComponentUpdate("profiles");
    return answer;
  } // Asking for a different view. The host answers as it answers a read,
  // because reading a record through another arrangement is reading the
  // record. What a person chose is the host's to remember: a choice kept
  // here would live in one browser and vanish in the next, which looks
  // broken rather than absent.


  async selectViewProfile(id) {
    const wanted = String(id ?? "");
    if (!wanted || wanted === this.viewProfile) return null;
    if (!this.viewProfiles.some(profile => profile.id === wanted)) return null;
    const epoch = ++this.epoch;
    const answer = await this._raise("view.profile", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      profile: wanted
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      this._setState("error", this.viewRefusalText(answer));

      return answer;
    }

    this.record = answer.record ?? this.record;

    this._takeSections(answer.record);

    this.view = answer.record?.view ?? this.view;
    this.editing = null;
    this.changed.clear();

    this._clearInputs();

    this._setState("ready");

    if (this.configuring) this.setViewTarget(this._layerOfProfile());
    this.requestComponentUpdate("profile");
    return answer;
  }

  get editableLayers() {
    const editable = this.view?.editable;
    return Array.isArray(editable) ? editable.filter(kind => kind === "personal" || kind === "shared") : [];
  }

  layerDenied(kind) {
    if (this.editableLayers.includes(kind)) return null;
    return this.view?.denied?.[kind] || this.viewDeniedText;
  }

  _emptyLayer() {
    return {
      schema_version: 1,
      sections: {},
      groups: {},
      fields: {}
    };
  }

  _layerCopy(kind) {
    const stored = this.view?.layers?.[kind]?.view;
    return stored ? copy(stored) : this._emptyLayer();
  }

  _layerRevision(kind) {
    const layer = this.view?.layers?.[kind];
    return layer ? layer.revision ?? null : null;
  } // Reading choice, not arrangement: a rare entry is declared rare by whoever
  // owns the collection, and showing it changes no value and writes no layer.
  // It was an attribute only, so nobody short of the host could ever see one.


  toggleShowRare() {
    this.toggleAttribute("show-rare", !this.showRare);
    this.requestComponentUpdate("show-rare");
    return this.showRare;
  } // Whether anything in this record is declared rare. Without one the menu does
  // not offer to show rare entries, because an item that changes nothing reads
  // as a feature that is broken.


  get hasRare() {
    const anyRare = entries => (entries ?? []).some(entry => entry?.rare === true);

    return (this.sections ?? []).some(section => section?.rare === true || anyRare(section?.groups) || (section?.groups ?? []).some(group => anyRare(group?.fields)));
  } // The layer a person's own edits are written to: the personal layer of the
  // chosen profile, at once, whatever the profile is (C298, C311 (5)). «For
  // everyone» is a separate act, view.publish, offered to those who may
  // write the shared layer (RC-1: a shared profile was written for everyone
  // on every move). A host that offers no personal layer keeps the 1.18.0
  // way: the shared layer of a shared profile.


  _layerOfProfile() {
    if (this.editableLayers.includes("personal")) return "personal";
    const profile = this.viewProfiles.find(item => item.id === this.viewProfile);
    const wanted = profile?.shared ? "shared" : "personal";
    return this.editableLayers.includes(wanted) ? wanted : this.viewTarget;
  } // Whether the host speaks port 1.22.0 (view.publish, view.lock): the
  // contract is in ui-source and rides the next pair. A 1.21.0 host (group
  // build 13: 1.20.0 type templates, 1.21.0 form fields), a 1.19.0 host
  // (group build 12: money C294) and earlier hosts are offered neither. The
  // C311 edition was called 1.19.0 on its ui-source branch until GB12 took
  // the number, then 1.20.0 here; group build 13 numbers it 1.22.0.


  get hostSpeaksCardSettings() {
    const [major, minor] = String(this.hostPort?.version ?? "").split(".").map(Number);
    return major > 1 || major === 1 && minor >= 22;
  } // Whether this person may write the shared layer: «Сохранить для всех»,
  // the locks and the head's fields are theirs (C298, C311 (2), (5)).


  get canWriteShared() {
    return this.editableLayers.includes("shared") && this.hostSpeaksCardSettings;
  } // A required profile (port 1.22.0 profiles[].required): it cannot be
  // changed, and edits live until the page is left -- nothing is written
  // (C298, RC-2).


  get viewRequired() {
    const profile = this.viewProfiles.find(item => item.id === this.viewProfile);
    return profile?.required === true;
  } // The paths the lower layers cannot change (port 1.22.0 view.locked):
  // fields.<key>.hidden, fields.<key>.group, sections.<key>, sections.order,
  // head. A person who may write the shared layer is the one who locked
  // them and may still change them.


  get viewLocked() {
    const locked = this.view?.locked;
    return new Set(Array.isArray(locked) ? locked.map(String) : []);
  }

  isLocked(path) {
    return this.viewLocked.has(String(path));
  }

  lockedForMe(path) {
    return this.isLocked(path) && !this.canWriteShared;
  } // Whether the personal layer of the chosen profile holds anything: what
  // «Сохранить для всех» would publish. The required profile's edits are
  // the page's only (requiredEdits).


  get hasPersonalEdits() {
    const layer = this.view?.layers?.personal;
    const view = layer?.view;
    if (!view) return false;
    return ["sections", "groups", "fields"].some(bucket => Object.keys(view[bucket] ?? {}).length > 0) || Boolean(view.head);
  }

  startConfiguringView() {
    if (!this.canConfigureView) return false;
    this.configuring = true;
    if (this.viewProfiles.length) this.viewTarget = this._layerOfProfile(); // What the arrangement was when the mode was entered. Every change in
    // this mode is written at once, so «cancel» can only mean putting back
    // what a person started from -- which is what a person means by it.

    this.arrangementEntered = {
      kind: this.viewTarget,
      revision: this._layerRevision(this.viewTarget),
      view: this._layerCopy(this.viewTarget)
    };
    this.resetAsked = false;
    this.requiredEdits = false;
    this.layerDraft = this._layerCopy(this.viewTarget);

    this._bindSectionDropTarget();

    this.entryErrors = new Map();
    this.cancelEdit();
    this.requestComponentUpdate("configuring"); // Arranging shows every group; those not read yet are read now.

    this._readShownGroups("started");

    this._focusAfterRender(['.sf-property-view-configure-top [data-action="view-profile"]', ".sf-property-view-configure-bar"]);

    return true;
  }

  stopConfiguringView() {
    const wasConfiguring = this.configuring;
    this.configuring = false;

    this._bindSectionDropTarget();

    this.layerDraft = null;
    this.arrangementEntered = null;
    this.resetAsked = false;
    this.entryErrors = new Map();
    this.requestComponentUpdate("configuring");
    if (wasConfiguring) this._focusAfterRender('[data-action="menu"]');
  } // Where the keyboard goes when the mode changes. The menu that started
  // arranging closes and the bar that ends it goes away, and each left the
  // focus on the page's body, so a keyboard user started again from the top
  // (simai.main keyboard QA, 2026-10-28). Entering, the focus goes to the
  // arranging bar's view chooser (its first control otherwise: the first was
  // Reset, the act that takes most away); leaving, to the panel's menu,
  // where the mode was entered from. The first selector that finds a
  // control wins.


  _focusAfterRender(selectors) {
    // What can take focus is the layer stack's one list (core.runtime 1.19.0).
    const inside = area => (area?.matches?.(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.FOCUSABLE) ? area : area?.querySelector?.(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.FOCUSABLE)) ?? null;

    this.whenRendered(() => requestAnimationFrame(async () => {
      const root = this.panelContent?.() ?? this;
      let target = null;

      for (const selector of [selectors].flat()) {
        const area = [...(root?.querySelectorAll?.(selector) ?? [])].pop() ?? null;
        if (!area) continue;
        target = inside(area); // A child defined lazily (the view chooser on a cold page) has
        // no control yet on the first frame, and the next selector's
        // first control -- Reset -- took the focus in its place
        // (simai.main, 2026-10-28). Its definition and first render are
        // waited for before falling through.

        if (!target && area.localName.includes("-")) {
          await customElements.whenDefined(area.localName);
          await area.whenRendered?.();
          await new Promise(done => requestAnimationFrame(done));
          target = inside(area);
        }

        if (target) break;
      }

      if (!target || !target.isConnected) return;
      const active = document.activeElement; // Only where the focus was lost: a person who has already moved on
      // keeps where they went.

      if (active && active !== document.body && root?.contains?.(active)) return;
      target.focus({
        preventScroll: true
      });
    }), {
      next: true
    });
  } // Leaving the mode with the arrangement a person started from. Not the same
  // as resetting: a reset takes the layer away and lets what lies beneath show
  // through, while this writes back the arrangement that was there when the
  // mode was entered, including one a person had made earlier.
  //
  // Nothing written since then means nothing to write back: the host's layer
  // is still the one entered with, and an identical view.save still cost a
  // shared revision and a history entry (simai.main QA, 2026-10-28).


  async cancelConfiguringView() {
    if (!this.configuring) return false; // A required view wrote nothing: what was drawn is read again.

    if (this.viewRequired) {
      const edited = this.requiredEdits;
      this.requiredEdits = false;
      if (edited) await this.load("view-cancel");
      this.stopConfiguringView();
      return true;
    }

    const entered = this.arrangementEntered;

    if (!entered || entered.kind !== this.viewTarget) {
      this.stopConfiguringView();
      return true;
    }

    const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

    const stored = this._layerCopy(entered.kind);

    const untouched = entered.revision != null && this._layerRevision(entered.kind) === entered.revision;

    if (untouched || same(stored, entered.view)) {
      // A write the host refused leaves the draft ahead of the layer, so
      // what is drawn is read again; an untouched draft needs nothing.
      if (!same(this.layerDraft, entered.view)) await this.load("view-cancel");
      this.stopConfiguringView();
      return true;
    }

    this.layerDraft = copy(entered.view);
    const answer = await this.saveView();
    await this.load("view-cancel");
    this.stopConfiguringView();
    return answer;
  } // A reset asks first. It takes away everything a person arranged in this
  // layer, and a single press of a button next to «done» is too little for
  // that; the button says what it will do and the next press does it.


  askReset() {
    if (!this.configuring) return false;
    this.resetAsked = true;
    this.requestComponentUpdate("reset-ask");
    return true;
  }

  cancelReset() {
    this.resetAsked = false;
    this.requestComponentUpdate("reset-ask");
    return true;
  }

  setViewTarget(kind) {
    if (!this.editableLayers.includes(kind) || kind === this.viewTarget) return false;
    this.viewTarget = kind;
    this.layerDraft = this._layerCopy(kind);
    this.entryErrors = new Map();
    this.requestComponentUpdate("view-target");
    return true;
  } // A hidden entry can be shown again only from the layer that hid it or above
  // it. `package` is above both, `shared` above `personal`, so a personal view
  // cannot reveal what was hidden for everyone -- and the component is told
  // which layer decided rather than working it out.


  canChangeVisibility(entry) {
    // A setting the admin locked (port 1.22.0 view.locked).
    const key = entry?.key != null ? String(entry.key) : null;
    if (key && (this.lockedForMe(`fields.${key}.hidden`) || this.lockedForMe(`sections.${key}`))) return false;
    const hiddenBy = entry?.hiddenBy ?? null;
    if (!hiddenBy) return true;
    if (hiddenBy === "package") return false;
    if (hiddenBy === "shared") return this.viewTarget === "shared";
    return true;
  }

  entryError(kind, key) {
    return this.entryErrors.get(`${kind}:${key}`) ?? null;
  } // The resolved siblings of a container, in the order they are drawn. The move
  // is computed against what a person sees, not against what the layer stores:
  // a layer is sparse, so the entry being dragged may have no order in it yet.


  _groupsOf(sectionKey) {
    const section = this.sections.find(item => String(item.key) === String(sectionKey));
    return Array.isArray(section?.groups) ? section.groups : [];
  }

  _fieldsOf(groupKey) {
    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        if (String(group.key) === String(groupKey)) return Array.isArray(group.fields) ? group.fields : [];
      }
    }

    return [];
  }

  _locateGroup(groupKey) {
    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        if (String(group.key) === String(groupKey)) return {
          section,
          group
        };
      }
    }

    return null;
  } // Dense order for the containers a move touched, and only those. A single
  // sparse order cannot say «between B and C» -- two neighbours may share a
  // number, or have none -- so the layer takes over the order of the one or two
  // containers that changed and leaves every other container resolving as it did.


  _writeOrder(bucket, items, extra = {}) {
    items.forEach((item, index) => {
      const key = String(item.key);
      bucket[key] = { ...(bucket[key] ?? {}),
        ...extra,
        order: index + 1
      };
    });
  } // A field dropped on a section in the list lands in that section's first
  // group that takes fields. A section is not itself a container of fields --
  // a group is -- so something has to choose, and the first group is the one a
  // person sees at the top of the section they aimed at. A section whose only
  // groups are related lists takes nothing, and the drop is refused rather
  // than landing somewhere invisible.


  moveFieldToSection(fieldKey, sectionKey) {
    if (!this.configuring || !this.layerDraft) return false;
    const section = (this.sections ?? []).find(candidate => String(candidate.key) === String(sectionKey));
    if (!section) return false;
    const group = (section.groups ?? []).find(candidate => candidate.kind !== "related");
    if (!group) return false;
    return this.moveField(fieldKey, String(group.key), (group.fields ?? []).length);
  } // The section list is a drop target of its own rather than a sortable list:
  // a list would name the whole column, and a field has to land on one section
  // in it. sf-sortable publishes exactly this seam for a target that is not a
  // list, and it resolves by pointer, so moving a field to another section with
  // the keyboard is still missing.


  _bindSectionDropTarget() {
    if (!this.configuring) {
      this._releaseSectionTarget?.();
      this._releaseSectionTarget = null;
      return;
    }

    if (this._releaseSectionTarget) return;
    const register = globalThis.SF?.Sortable?.registerSortableDropTarget;
    if (typeof register !== "function") return;

    const sectionAt = (x, y) => {
      const under = globalThis.document?.elementFromPoint?.(x, y); // While the view is arranged the sections are rows of their own, so a
      // field may be dropped on a tab the same way it is dropped on a group.
      // This target is bound only while the view is arranged, and then the
      // sections are those rows (data-section-tab, the section key); the
      // reading list (sf-tabs) is never drawn at the same time.

      const item = under?.closest?.("[data-section-tab]"); // Another panel's list is not this panel's drop target. The drawer
      // moves the content out of the element, so asking `closest` for an
      // sf-view-properties finds nothing at all -- which is why the first
      // version of this resolved on no section and a field dropped on the
      // list simply stayed where it was.

      const content = this.panelContent();
      if (!item || !content || !content.contains(item)) return null;
      return item;
    };

    this._releaseSectionTarget = register({
      resolve: (x, y, session) => {
        // A field lands in the section's first group; a whole area moves
        // to the section itself. Anything else is not ours.
        if (session?.group && !["field", "group"].includes(session.group)) return null;
        const item = sectionAt(x, y);
        if (!item) return null;
        const key = item.getAttribute("data-section-tab");
        if (key === this.selectedSection) return null; // The row's name, not its handle or icon: those are glyph
        // ligatures, and their words would be read into the label.

        return {
          descriptor: {
            section: key
          },
          rect: item.getBoundingClientRect(),
          label: item.querySelector(".sf-property-view-section-tab-label")?.textContent?.trim() || item.textContent?.trim() || key
        };
      },
      drop: (session, descriptor) => {
        if (!descriptor?.section) return false;

        if (session?.group === "group") {
          return this.moveGroup(session?.item, descriptor.section, Number.MAX_SAFE_INTEGER);
        }

        return this.moveFieldToSection(session?.item, descriptor.section);
      }
    });
  }

  moveField(fieldKey, toGroupKey, index) {
    if (!this.configuring || !this.layerDraft) return false;
    if (this.lockedForMe(`fields.${String(fieldKey)}.group`)) return false;

    const target = this._locateGroup(toGroupKey);

    if (!target) return false;
    let moved = null;
    let fromGroup = null;

    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        const at = (group.fields ?? []).findIndex(field => String(field.key) === String(fieldKey));

        if (at >= 0) {
          fromGroup = group;
          [moved] = group.fields.splice(at, 1);
          break;
        }
      }

      if (moved) break;
    } // A field being placed may be coming back from outside the arrangement
    // rather than from another group.


    let fromUnplaced = false;

    if (!moved) {
      const waiting = this.record?.unplaced ?? [];
      const at = waiting.findIndex(field => String(field.key) === String(fieldKey));

      if (at >= 0) {
        [moved] = waiting.splice(at, 1);
        fromUnplaced = true;
      }
    }

    if (!moved) return false;
    const into = target.group.fields ?? (target.group.fields = []);
    const at = Math.max(0, Math.min(Number.isInteger(index) ? index : into.length, into.length));
    into.splice(at, 0, moved);

    this._writeOrder(this.layerDraft.fields, into, {
      group: String(toGroupKey)
    });

    if (fromUnplaced) {
      this._writeOrder(this.layerDraft.fields, this.record?.unplaced ?? [], {
        group: null
      });
    }

    if (fromGroup && fromGroup !== target.group) {
      this._writeOrder(this.layerDraft.fields, fromGroup.fields ?? [], {
        group: String(fromGroup.key)
      });
    }

    this.requestComponentUpdate("view-move");
    return this.saveView();
  }

  moveGroup(groupKey, toSectionKey, index) {
    if (!this.configuring || !this.layerDraft) return false;
    const target = this.sections.find(item => String(item.key) === String(toSectionKey));
    if (!target) return false;
    let moved = null;
    let fromSection = null;

    for (const section of this.sections) {
      const at = (section.groups ?? []).findIndex(group => String(group.key) === String(groupKey));

      if (at >= 0) {
        fromSection = section;
        [moved] = section.groups.splice(at, 1);
        break;
      }
    }

    if (!moved) return false;
    const into = target.groups ?? (target.groups = []);
    const at = Math.max(0, Math.min(Number.isInteger(index) ? index : into.length, into.length));
    into.splice(at, 0, moved);

    this._writeOrder(this.layerDraft.groups, into, {
      section: String(toSectionKey)
    });

    if (fromSection && fromSection !== target) {
      this._writeOrder(this.layerDraft.groups, fromSection.groups ?? [], {
        section: String(fromSection.key)
      });
    }

    this.requestComponentUpdate("view-move");
    return this.saveView();
  } // Width, template variant and hint, one field at a time. The value is written
  // into the layer and onto the drawn entry together, so the view moves under
  // the person's hand and the layer is what gets stored.


  setFieldView(fieldKey, patch = {}) {
    if (!this.configuring || !this.layerDraft) return false; // `label` is this view's name for the field, the same way a section and
    // an area carry one: the collection keeps its own, and resetting the
    // layer gives it back.
    // The template (variant) is the field's own, chosen once in the field
    // (C302 (2), C311 (6), RC-9): the card view writes none. A layer that
    // holds one is still read until 2027-01-01.

    const allowed = ["width", "hint", "label"];
    const change = Object.fromEntries(Object.entries(patch).filter(([key]) => allowed.includes(key)));
    if (!Object.keys(change).length) return false;
    const key = String(fieldKey);
    this.layerDraft.fields[key] = { ...(this.layerDraft.fields[key] ?? {}),
      ...change
    };

    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        for (const field of group.fields ?? []) {
          if (String(field.key) === key) Object.assign(field, change);
        }
      }
    }

    this.requestComponentUpdate("view-field");
    return this.saveView();
  } // The glyphs a section may be marked with. A hundred and twenty names from
  // the Framework's own icon set, the ones products actually reach for, read
  // in rows of what a record's sections are usually about -- what a thing is,
  // who it belongs to, when it happens, what it costs, what it is made of. A
  // host with its own vocabulary passes `section-icons` and this is replaced
  // wholesale rather than added to, because a list nobody chose is a list that
  // grows until it is useless.
  // The input as it was given: a list of glyph names, or nothing for the
  // component's own. A declared input answers with what it was told, so the
  // resolved list is a second question rather than this one's answer.


  get sectionIcons() {
    return this.getAttribute("section-icons") || "";
  }

  get sectionIconChoices() {
    const given = this.sectionIcons;
    if (given) return given.split(/[\s,]+/u).filter(Boolean);
    return SECTION_ICONS;
  } // A section's glyph is this view's, like its name: the layer carries it and
  // resetting the layer gives the host's back.


  setSectionIcon(sectionKey, icon) {
    if (!this.configuring || !this.layerDraft) return false;
    const name = String(sectionKey);
    const section = this.sections.find(part => String(part.key) === name);
    if (!section) return false;
    const next = String(icon ?? "").trim() || null;
    this.layerDraft.sections[name] = { ...(this.layerDraft.sections[name] ?? {}),
      icon: next
    };
    section.icon = next;
    this.requestComponentUpdate("view-section-icon");
    return this.saveView();
  } // Naming what is on screen. A label is the layer's to set -- the port has
  // carried `label` for a section and a group since 1.6.0 -- so renaming is an
  // arrangement, not a change to the collection: what it renames is this
  // view's name for it, and resetting the layer gives the host's name back.


  renameEntry(kind, key, label) {
    if (!this.configuring || !this.layerDraft) return false;
    const buckets = {
      section: "sections",
      group: "groups"
    };
    const bucket = buckets[kind];
    if (!bucket) return false;
    const next = String(label ?? "").trim();
    if (!next) return false;

    const entry = this._findEntry(kind, key);

    if (!entry) return false;
    const name = String(key);
    this.layerDraft[bucket][name] = { ...(this.layerDraft[bucket][name] ?? {}),
      label: next
    };
    entry.label = next;
    this.renaming = null;
    this.requestComponentUpdate("view-rename");
    return this.saveView();
  }

  startRenaming(kind, key) {
    if (!this.configuring) return false;
    this.renaming = {
      kind,
      key: String(key)
    };
    this.requestComponentUpdate("view-rename");
    return true;
  }

  cancelRenaming() {
    this.renaming = null;
    this.requestComponentUpdate("view-rename");
  } // Taking an area out of the view. Its fields are not destroyed with it: they
  // join the unplaced, which is where a field goes when it belongs to no area,
  // so nothing a person put in it is lost by removing the box around it.
  //
  // In the layer an area that is gone is an area that is hidden, because that
  // is what the port has a word for -- the collection still has it, this view
  // does not show it, and resetting the layer brings it back.


  removeGroup(groupKey) {
    if (!this.configuring || !this.layerDraft) return false;

    const target = this._locateGroup(groupKey);

    if (!target || !this.canChangeVisibility(target.group)) return false;

    for (const field of [...(target.group.fields ?? [])]) {
      this.moveFieldToUnplaced(String(field.key));
    }

    const name = String(groupKey);
    this.layerDraft.groups[name] = { ...(this.layerDraft.groups[name] ?? {}),
      hidden: true
    };
    target.group.hidden = true;
    const section = this.sections.find(part => (part.groups ?? []).includes(target.group));
    if (section) section.groups = (section.groups ?? []).filter(group => group !== target.group);
    this.requestComponentUpdate("view-remove-group");
    return this.saveView();
  } // A tab is removed and its fields go to «Скрытые поля» (C311 (4)), where
  // the eye or a drag brings each back: one way to not show a field (C106
  // (1)). Its areas are hidden with it. It moved the areas to the tab that
  // remained before.


  removeSection(sectionKey) {
    if (!this.configuring || !this.layerDraft) return false;
    const name = String(sectionKey);
    const section = this.sections.find(part => String(part.key) === name);
    if (!section || !this.canChangeVisibility(section)) return false;
    if (this.sections.length < 2) return false;
    const into = this.sections.find(part => part !== section);

    for (const group of [...(section.groups ?? [])]) {
      if (group.kind !== "related") {
        for (const field of [...(group.fields ?? [])]) this.moveFieldToUnplaced(String(field.key), undefined, {
          save: false
        });
      }

      const groupName = String(group.key);
      this.layerDraft.groups[groupName] = { ...(this.layerDraft.groups[groupName] ?? {}),
        hidden: true
      };
      group.hidden = true;
    }

    this.layerDraft.sections[name] = { ...(this.layerDraft.sections[name] ?? {}),
      hidden: true
    };
    section.hidden = true;
    this.sections = this.sections.filter(part => part !== section);
    if (this.selectedSection === name) this.selectedSection = String(into.key);
    this.requestComponentUpdate("view-remove-section");
    return this.saveView();
  } // The order of the sections, as a drag leaves them. A section is a tab in
  // this arrangement, and a tab nobody can move is an order the host chose
  // once and nobody since.


  moveSection(sectionKey, index) {
    if (!this.configuring || !this.layerDraft) return false;
    if (this.lockedForMe("sections.order")) return false;
    const name = String(sectionKey);
    const at = this.sections.findIndex(part => String(part.key) === name);
    if (at < 0) return false;
    const next = [...this.sections];
    const [moved] = next.splice(at, 1);
    const to = Math.max(0, Math.min(Number.isInteger(index) ? index : next.length, next.length));
    next.splice(to, 0, moved);
    if (next.every((part, position) => part === this.sections[position])) return false;
    this.sections = next;

    this._writeOrder(this.layerDraft.sections, this.sections, {});

    this.requestComponentUpdate("view-move-section");
    return this.saveView();
  } // Making a new area, and a new section to hold areas. This is the one act in
  // arranging that does not rearrange what the host sent: it names something
  // the record does not carry yet, and the host decides whether to keep it --
  // the layer write says so, and the area survives the next read only if the
  // host returns it. Until then it is drawn from the layer, so a person sees
  // what they made straight away.


  addGroup(sectionKey) {
    if (!this.configuring || !this.layerDraft) return false;
    const section = this.sections.find(part => String(part.key) === String(sectionKey)) ?? this.sections[0];
    if (!section) return false;

    const key = this._newEntryKey("group");

    const group = {
      key,
      label: this.newGroupTitle,
      columns: 1,
      fields: [],
      hidden: false,
      rare: false,
      editable: true
    };
    section.groups = [...(section.groups ?? []), group];

    this._writeOrder(this.layerDraft.groups, section.groups, {
      section: String(section.key)
    });

    this.layerDraft.groups[key] = { ...(this.layerDraft.groups[key] ?? {}),
      label: group.label,
      section: String(section.key),
      columns: 1,
      hidden: false
    };
    this.renaming = {
      kind: "group",
      key
    };
    this.requestComponentUpdate("view-add-group");
    return this.saveView();
  } // A new tab comes with a «Поля» area (C311 (4)), so a field can be moved to
  // it at once from its «⋯ → На вкладку …».


  addSection() {
    if (!this.configuring || !this.layerDraft) return false;

    const key = this._newEntryKey("section");

    const groupKey = this._newEntryKey("group");

    const fieldsTitle = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "newTabGroupTitle", this);
    const group = {
      key: groupKey,
      label: fieldsTitle,
      columns: 1,
      fields: [],
      hidden: false,
      rare: false,
      editable: true
    };
    const section = {
      key,
      label: this.newSectionTitle,
      groups: [group],
      hidden: false,
      rare: false
    };
    this.layerDraft.groups[groupKey] = {
      label: fieldsTitle,
      section: key,
      columns: 1,
      hidden: false,
      order: 1
    };
    this.sections = [...this.sections, section];

    this._writeOrder(this.layerDraft.sections, this.sections, {});

    this.layerDraft.sections[key] = { ...(this.layerDraft.sections[key] ?? {}),
      label: section.label,
      hidden: false
    };
    this.selectedSection = key;
    this.renaming = {
      kind: "section",
      key
    };
    this.requestComponentUpdate("view-add-section");
    return this.saveView();
  } // A key nobody else holds, said in the open so a host reading the layer can
  // tell a key this component made from one of its own.


  _newEntryKey(kind) {
    const stamp = Date.now().toString(36);
    const noise = Math.floor(Math.random() * 46655).toString(36).padStart(3, "0");
    return `view-${kind}-${stamp}${noise}`;
  }

  toggleEntryHidden(kind, key) {
    if (!this.configuring || !this.layerDraft) return false;
    const buckets = {
      section: "sections",
      group: "groups",
      field: "fields"
    };
    const bucket = buckets[kind];
    if (!bucket) return false;

    const entry = this._findEntry(kind, key);

    if (!entry || !this.canChangeVisibility(entry)) return false;
    const next = !entry.hidden;
    const name = String(key);
    this.layerDraft[bucket][name] = { ...(this.layerDraft[bucket][name] ?? {}),
      hidden: next
    };
    entry.hidden = next;
    this.requestComponentUpdate("view-hidden");
    return this.saveView();
  }

  _findEntry(kind, key) {
    const name = String(key);

    for (const section of this.sections) {
      if (kind === "section" && String(section.key) === name) return section;

      for (const group of section.groups ?? []) {
        if (kind === "group" && String(group.key) === name) return group;

        for (const field of group.fields ?? []) {
          if (kind === "field" && String(field.key) === name) return field;
        }
      }
    }

    return null;
  } // Applied immediately, the way column settings are, and against the layer
  // revision. A refusal or a conflict is not something to paper over: the
  // arrangement on screen is the component optimistic copy, so when the host
  // does not accept it the record is read again and the host resolution wins.


  async saveView() {
    if (!this.canConfigureView || !this.layerDraft) return null; // Serialized, one write at a time. Two drags in quick succession would
    // otherwise both be sent against the revision the layer had before either
    // of them, so the second would be answered with a conflict the person
    // caused by being quick -- correct by the contract and useless to them.
    // Waiting means the second write carries the revision the first earned.

    const queued = this._viewWriting ?? Promise.resolve();
    let release;
    this._viewWriting = new Promise(done => {
      release = done;
    });

    try {
      await queued;
      return await this._saveViewNow();
    } finally {
      release();
    }
  }

  async _saveViewNow() {
    if (!this.canConfigureView || !this.layerDraft) return null; // A required view: the edit is drawn and kept until the page is left,
    // and never written (C298).

    if (this.viewRequired) {
      this.requiredEdits = true;
      this.requestComponentUpdate("view-required");
      return {
        answer: "applied",
        local: true
      };
    }

    const kind = this.viewTarget;
    const epoch = ++this.viewEpoch;
    const answer = await this._raise("view.save", {
      record_id: null,
      collection: this.collection || null,
      target: {
        kind,
        revision: this._layerRevision(kind)
      },
      view: copy(this.layerDraft)
    }, {
      stale: () => epoch !== this.viewEpoch
    });
    if (!answer) return null;

    if (answer.answer === "applied") {
      this.entryErrors = new Map();

      this._storeLayer(kind, answer.revision ?? null, answer.view ?? this.layerDraft); // A host that normalised the layer is telling the component its copy
      // is not what was stored, so the arrangement is read again rather
      // than left as the component imagined it.
      // The port says a view write announces sf-property-view-state, so it
      // has to announce it when the write succeeds and not only when it
      // fails -- otherwise the declared event is a half-truth and a host
      // listening for it would hear only bad news.


      if (answer.view) await this.load("view-normalised");else {
        this._setState("ready");

        this.requestComponentUpdate("view-saved");
      }
      return answer;
    }

    if (answer.answer === "conflict") {
      this._storeLayer(kind, answer.revision ?? null, answer.view ?? null);

      this.message = answer.message || this.viewConflictText;
      await this.load("view-conflict");
      return answer;
    }

    if (answer.answer === "refused") {
      const errors = Object.entries(answer.entry_errors ?? {});
      this.entryErrors = new Map(errors.map(([key, value]) => [key, this.viewRefusalText({
        code: value
      }, String(value))]));
      await this.load("view-refused"); // An error of the head or of no entry on screen is said as the card's message.

      const loose = errors.find(([key]) => !key.includes(":"));
      if (loose || !errors.length) this.message = this.viewRefusalText(loose ? {
        code: loose[1]
      } : answer, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this));
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this));

    return answer;
  } // «Сохранить для всех» (port 1.22.0 view.publish; C298, C311 (5), RC-1):
  // the host merges the personal layer into the profile's shared layer and
  // clears the personal one, in one write. A conflict carries the newer
  // shared layer: the card redraws and says «Вид изменился».


  async publishView() {
    if (!this.configuring || !this.canWriteShared || this.viewRequired) return null;
    await (this._viewWriting ?? Promise.resolve());
    const epoch = ++this.viewEpoch;
    const answer = await this._raise("view.publish", {
      record_id: null,
      collection: this.collection || null,
      profile: this.viewProfile,
      personal_revision: this._layerRevision("personal"),
      shared_revision: this._layerRevision("shared")
    }, {
      stale: () => epoch !== this.viewEpoch
    });
    if (!answer) return null;

    if (answer.answer === "applied" || answer.answer === "conflict") {
      const shared = answer.shared ?? null;
      if (shared) this._storeLayer("shared", shared.revision ?? null, shared.view ?? null);

      if (answer.answer === "applied") {
        this._storeLayer("personal", answer.personal?.revision ?? null, null);

        this.message = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewPublishedText", this);
      } else {
        // A conflict carries both newer layers: the next publish asks with them.
        if (answer.personal) this._storeLayer("personal", answer.personal.revision ?? null, answer.personal.view ?? null);
        this.message = this.viewRefusalText(answer, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewChangedText", this));
      }

      this.layerDraft = this._layerCopy(this.viewTarget); // What «Отменить» puts back is now what everyone has.

      this.arrangementEntered = {
        kind: this.viewTarget,
        revision: this._layerRevision(this.viewTarget),
        view: this._layerCopy(this.viewTarget)
      };
      await this.load(answer.answer === "applied" ? "view-published" : "view-conflict");
      return answer;
    }

    this._setState("error", this.viewRefusalText(answer, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this)));

    return answer;
  } // «Закрыть для изменений» (port 1.22.0 view.lock; C298, RC-2): one setting
  // the lower layers cannot change, for a person who may write the shared
  // layer. The host answers the locked list and the shared revision.


  async lockViewPath(path, locked = !this.isLocked(path)) {
    if (!this.configuring || !this.canWriteShared) return null;
    const epoch = ++this.viewEpoch;
    const answer = await this._raise("view.lock", {
      record_id: null,
      collection: this.collection || null,
      profile: this.viewProfile,
      path: String(path),
      locked: Boolean(locked),
      revision: this._layerRevision("shared")
    }, {
      stale: () => epoch !== this.viewEpoch
    });
    if (!answer) return null;

    if ((answer.answer === "applied" || answer.answer === "conflict") && this.view) {
      if (Array.isArray(answer.locked)) this.view.locked = answer.locked.map(String); // Larena's path "required" answers whether the profile is now required.

      if (typeof answer.required === "boolean" && Array.isArray(this.view.profiles)) {
        this.view.profiles = this.view.profiles.map(item => item.id === this.viewProfile ? { ...item,
          required: answer.required
        } : item);
      }

      const shared = this.view.layers?.shared;
      if (shared && answer.revision) this.view.layers = { ...this.view.layers,
        shared: { ...shared,
          revision: String(answer.revision)
        }
      };
      if (answer.answer === "conflict") this.message = this.viewRefusalText(answer, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewChangedText", this));
      this.requestComponentUpdate("view-lock");
      return answer;
    }

    this._setState("error", this.viewRefusalText(answer, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this)));

    return answer;
  } // «Сохранить как моё» (C311 (5), RC-3): a personal profile from what is on
  // screen, for a view whose settings are locked. Not in a required view.


  get canSaveAsMine() {
    return this.configuring && !this.viewRequired && this.editableLayers.includes("personal");
  }

  saveAsMine() {
    if (!this.canSaveAsMine) return null;
    const current = this.viewProfiles.find(profile => profile.id === this.viewProfile);
    const label = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveAsMineLabelText", this).replace("{name}", current?.label ?? "");
    return this.createViewProfile(label, {
      shared: false
    });
  } // The card head (port 1.22.0 view.head; C289 (6), C311 (2)): the title,
  // under it up to two fields, and the stage as a tonal badge. What the
  // draft layer says wins over what the host resolved.


  get viewHead() {
    const layered = this.configuring ? this.layerDraft?.head : null;
    const head = layered ?? this.view?.head ?? null;
    if (!head || typeof head !== "object") return {
      subtitle: [],
      status: null
    };
    const subtitle = Array.isArray(head.subtitle) ? head.subtitle.map(String).filter(Boolean).slice(0, 2) : [];
    return {
      subtitle,
      status: typeof head.status === "string" && head.status ? head.status : null
    };
  } // What the head draws under the title: the subtitle fields' values, and
  // the stage's option with its scheme for the tonal badge.


  get headLine() {
    const head = this.viewHead;
    const subtitle = head.subtitle.map(key => {
      const field = this.headField(key);
      const value = this.changed?.has?.(key) ? this.changed.get(key) : field?.value;
      const text = field ? (0,_js_history_js__WEBPACK_IMPORTED_MODULE_17__.valueText)(field, value, this.viewHost) : "";
      return text ? {
        key,
        text
      } : null;
    }).filter(Boolean);
    let status = null;
    const stage = head.status ? this.headField(head.status) : null;

    if (stage) {
      const value = stage.value && typeof stage.value === "object" ? stage.value.value ?? stage.value.id : stage.value;
      const option = (stage.options ?? []).find(item => String(item?.value ?? item?.id ?? item) === String(value ?? ""));
      const text = option ? String(option.label ?? option.text ?? option.value ?? "") : (0,_js_history_js__WEBPACK_IMPORTED_MODULE_17__.valueText)(stage, stage.value, this.viewHost);
      if (text) status = {
        key: String(stage.key),
        text,
        scheme: option?.scheme ?? option?.color ?? "secondary"
      };
    }

    return {
      subtitle,
      status
    };
  }

  _writeHead(next) {
    // A 1.18.0 layer holds sections, groups and fields only.
    if (!this.configuring || !this.layerDraft || !this.hostSpeaksCardSettings || this.lockedForMe("head")) return false;
    this.layerDraft.head = {
      subtitle: next.subtitle.slice(0, 2),
      status: next.status ?? null
    }; // Drawn after the mode too, before the next read brings the host's.

    if (this.view) this.view.head = copy(this.layerDraft.head);
    this.requestComponentUpdate("view-head");
    return this.saveView();
  }

  toggleHeadSubtitle(fieldKey) {
    const head = this.viewHead;
    const key = String(fieldKey);
    const subtitle = head.subtitle.includes(key) ? head.subtitle.filter(item => item !== key) : [...head.subtitle, key].slice(-2);
    return this._writeHead({ ...head,
      subtitle
    });
  }

  setHeadStatus(fieldKey) {
    const head = this.viewHead;
    const key = fieldKey == null ? null : String(fieldKey);
    return this._writeHead({ ...head,
      status: head.status === key ? null : key
    });
  } // The field the head names, wherever it stands (hidden ones too).


  headField(key) {
    const name = String(key);

    for (const section of this.sections ?? []) {
      for (const group of section.groups ?? []) {
        for (const field of group.fields ?? []) if (String(field.key) === name) return field;
      }
    }

    return (this.unplaced ?? []).find(field => String(field.key) === name) ?? null;
  } // «Добавить поле» is structure, not view (C311 (1)): it opens the data
  // owner's field editor. The card says which collection and where; the
  // host opens its editor.


  openStructureEditor(groupKey = null) {
    const located = groupKey ? this._locateGroup(groupKey) : null;
    return this.sfEmit?.("structure", {
      collection: this.collection || null,
      section: located ? String(located.section.key) : this.selectedSection || null,
      group: groupKey ? String(groupKey) : null
    }, {
      cancelable: true
    }) ?? null;
  } // The eye of a field in «Скрытые поля» (C311 (5)): back into the open
  // tab's first area that takes fields.


  showHiddenField(fieldKey) {
    if (!this.configuring) return false;
    const sections = this.sections ?? [];
    const section = sections.find(part => String(part.key) === this.selectedSection) ?? sections[0];
    const group = (section?.groups ?? []).find(candidate => candidate.kind !== "related" && !candidate.hidden);
    if (!group) return false; // A field a layer hid comes back shown, not only placed.

    const key = String(fieldKey);
    if (this.layerDraft) this.layerDraft.fields[key] = { ...(this.layerDraft.fields[key] ?? {}),
      hidden: false
    };
    const waiting = (this.record?.unplaced ?? []).find(field => String(field.key) === key);
    if (waiting) waiting.hidden = false;
    return this.moveField(key, String(group.key), (group.fields ?? []).length);
  } // A tab's «⋯» (C311 (4), TB-1): name, icon, up, down, hide, delete, and
  // the lock for those who may write the shared layer.


  tabMenuEntries(sectionKey) {
    const at = this.sections.findIndex(section => String(section.key) === String(sectionKey));
    const section = this.sections[at];
    if (!section) return [];

    const word = key => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, key, this);

    const path = `sections.${String(section.key)}`;
    const mine = !this.lockedForMe(path);
    const entries = [{
      id: "tab-rename",
      text: word("tabRenameText"),
      icon: "edit",
      disabled: !mine
    }, {
      id: "tab-icon",
      text: word("tabIconText"),
      icon: "category",
      disabled: !mine
    }, {
      id: "tab-up",
      text: word("tabUpText"),
      icon: "arrow_upward",
      disabled: at === 0 || this.lockedForMe("sections.order")
    }, {
      id: "tab-down",
      text: word("tabDownText"),
      icon: "arrow_downward",
      disabled: at === this.sections.length - 1 || this.lockedForMe("sections.order")
    }, {
      type: "separator"
    }, {
      id: "tab-hide",
      text: word(section.hidden ? "tabShowText" : "tabHideText"),
      icon: section.hidden ? "visibility" : "visibility_off",
      disabled: !mine
    }, {
      id: "tab-delete",
      text: word("tabDeleteText"),
      icon: "delete",
      danger: true,
      disabled: !mine || this.sections.length < 2
    }];

    if (this.canWriteShared) {
      entries.push({
        type: "separator"
      });
      entries.push(this.isLocked(path) ? {
        id: "tab-lock",
        text: word("unlockText"),
        icon: "lock_open"
      } : {
        id: "tab-lock",
        text: word("lockText"),
        icon: "lock"
      });
    }

    return entries;
  }

  openTabMenu(anchor, sectionKey) {
    const key = String(sectionKey);
    return this.openStandardMenu(anchor, {
      label: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "tabMenuText", this).replace("{name}", String(this.sections.find(section => String(section.key) === key)?.label ?? key)),
      entries: this.tabMenuEntries(key),
      select: id => this.chooseTabEntry(key, id)
    });
  }

  chooseTabEntry(sectionKey, id) {
    const key = String(sectionKey);
    const at = this.sections.findIndex(section => String(section.key) === key);
    if (at < 0) return false;
    if (id === "tab-rename") return this.startRenaming("section", key);

    if (id === "tab-icon") {
      this.selectSection(key);
      this.whenRendered?.(() => (this.panelContent?.() ?? this).querySelector?.(`[data-icon-for="${CSS.escape(key)}"] [data-action="section-icon"] button, [data-icon-for="${CSS.escape(key)}"] [data-action="section-icon"]`)?.click?.(), {
        next: true
      });
      return true;
    }

    if (id === "tab-up") return this.moveSection(key, at - 1);
    if (id === "tab-down") return this.moveSection(key, at + 1);
    if (id === "tab-hide") return this.toggleEntryHidden("section", key);
    if (id === "tab-delete") return this.removeSection(key);
    if (id === "tab-lock") return this.lockViewPath(`sections.${key}`);
    return false;
  } // A field's «⋯» in the arranging mode (C311 (2), (4)): the head's fields
  // and stage for the admin, «На вкладку …» at every width, the lock.


  fieldMenuEntries(fieldKey) {
    const key = String(fieldKey);
    const field = this.headField(key);

    const word = name => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, name, this);

    const entries = [];
    const head = this.viewHead;

    if (this.canWriteShared && !this.lockedForMe("head")) {
      entries.push({
        id: "head-subtitle",
        text: word(head.subtitle.includes(key) ? "headSubtitleOffText" : "headSubtitleOnText"),
        icon: "title"
      });

      if (Array.isArray(field?.options) && field.options.length) {
        entries.push({
          id: "head-status",
          text: word(head.status === key ? "headStatusOffText" : "headStatusOnText"),
          icon: "label"
        });
      }
    }

    const here = this.sections.find(section => (section.groups ?? []).some(group => (group.fields ?? []).some(item => String(item.key) === key)));
    const others = this.sections.filter(section => section !== here && (section.groups ?? []).some(group => group.kind !== "related"));

    if (others.length && !this.lockedForMe(`fields.${key}.group`)) {
      if (entries.length) entries.push({
        type: "separator"
      });

      for (const section of others) {
        entries.push({
          id: `to-tab:${String(section.key)}`,
          text: word("toTabText").replace("{name}", String(section.label ?? section.key)),
          icon: "drive_file_move"
        });
      }
    }

    if (this.canWriteShared) {
      if (entries.length) entries.push({
        type: "separator"
      });
      const path = `fields.${key}.hidden`;
      entries.push(this.isLocked(path) ? {
        id: "field-lock",
        text: word("unlockText"),
        icon: "lock_open"
      } : {
        id: "field-lock",
        text: word("lockText"),
        icon: "lock"
      });
    }

    return entries;
  }

  openFieldMenu(anchor, fieldKey) {
    const key = String(fieldKey);
    const entries = this.fieldMenuEntries(key);
    if (!entries.length) return null;
    return this.openStandardMenu(anchor, {
      label: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "fieldMenuText", this).replace("{name}", String(this.headField(key)?.label ?? key)),
      entries,
      select: id => this.chooseFieldEntry(key, id)
    });
  }

  chooseFieldEntry(fieldKey, id) {
    const key = String(fieldKey);
    const value = String(id ?? "");
    if (value === "head-subtitle") return this.toggleHeadSubtitle(key);
    if (value === "head-status") return this.setHeadStatus(key);
    if (value === "field-lock") return this.lockViewPath(`fields.${key}.hidden`);
    if (value.startsWith("to-tab:")) return this.moveFieldToSection(key, value.slice("to-tab:".length));
    return false;
  }

  _storeLayer(kind, revision, view) {
    if (!this.view) return;
    this.view.layers = { ...(this.view.layers ?? {})
    };
    this.view.layers[kind] = {
      revision,
      view: view ? copy(view) : null
    };
    this.layerDraft = this._layerCopy(kind);
  } // A reset writes nothing against the revision -- it never sends the component
  // idea of the defaults, because the host owns those and writing them would
  // overwrite them with a guess.


  async resetView() {
    if (!this.canConfigureView) return null;
    this.resetAsked = false; // Behind the same queue as a save: a reset racing a save in flight would
    // clear a layer and then store the save's revision over the cleared one.

    await (this._viewWriting ?? Promise.resolve()); // «Вернуть как у всех» clears the person's own layer and nothing else
    // (C311 (5), RC-3): it cleared the layer of the profile, the shared one
    // included. A shared reset is the picker row's, for the admin.

    const kind = this.editableLayers.includes("personal") ? "personal" : this.viewTarget;
    const epoch = ++this.viewEpoch;
    const answer = await this._raise("view.reset", {
      record_id: null,
      collection: this.collection || null,
      target: {
        kind,
        revision: this._layerRevision(kind)
      }
    }, {
      stale: () => epoch !== this.viewEpoch
    });
    if (!answer) return null;

    if (answer.answer === "applied" || answer.answer === "conflict") {
      if (answer.answer === "conflict") this.message = answer.message || this.viewConflictText;

      this._storeLayer(kind, answer.revision ?? null, null);

      this.entryErrors = new Map();
      await this.load("view-reset");
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewResetFailedText", this));

    return answer;
  }

}

(0,_view_table_js_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__.answerActions)(SfPropertyView, _component_json__WEBPACK_IMPORTED_MODULE_3__);
(0,_view_table_js_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__.settingSetters)(SfPropertyView, _component_json__WEBPACK_IMPORTED_MODULE_3__);
SfPropertyView.define("sf-view-properties");

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "844bdc4d24eb"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONDITION_OPS: () => (/* binding */ CONDITION_OPS),
/* harmony export */   evaluateCondition: () => (/* binding */ evaluateCondition),
/* harmony export */   fieldConditions: () => (/* binding */ fieldConditions)
/* harmony export */ });
// A field's conditions (port 1.14.0, Larena 2026-10-23): when it is shown,
// required and enabled, each a condition over the other fields' values as they
// stand on screen -- what the record holds, or what the person has changed it to
// and not saved yet. Plain functions, no rendering: the component evaluates them
// on every render, so a field appears the moment the value it waits for is
// chosen, and the contract test runs them without a DOM.
//
// The grammar is the port's, and small on purpose:
//
//   {field, op, value}   op: eq, ne, in, not_in (value a list), empty, not_empty
//   {all: [...]}         every condition holds
//   {any: [...]}         at least one holds
//   {not: {...}}         the condition does not hold
//
// Nothing in the Framework had a condition grammar to reuse: the data view's
// filters are the host's query, not a predicate the component runs.
const CONDITION_OPS = Object.freeze(["eq", "ne", "in", "not_in", "empty", "not_empty"]); // A value is compared by what it is, not by how it is shown: a lookup's
// {value, label} and a formatted {value, text} by their `value`. Text on both
// sides, because a host sends 5 in one place and "5" in another and means the
// same thing by both.

const scalar = value => value && typeof value === "object" && !Array.isArray(value) && "value" in value ? value.value : value; // What a field holds, as a list: a multiple field is a list already, a single
// one is a list of one, and nothing -- null, an empty string, an empty list --
// is a list of none.


const itemsOf = value => (Array.isArray(value) ? value : [value]).map(scalar).filter(item => item !== null && item !== undefined && item !== "").map(item => String(item)); // True or false, or null for a condition that cannot be read: an unknown op, a
// node with no conditions, a list where a list belongs and is missing. A
// condition nobody can read leaves the field as the host declared it rather
// than hiding it -- a field lost to a typo in a condition is a value a person
// can no longer see or change.


function evaluateCondition(condition, values) {
  if (!condition || typeof condition !== "object" || Array.isArray(condition)) return null;

  for (const node of ["all", "any"]) {
    if (!(node in condition)) continue;
    const list = condition[node];
    if (!Array.isArray(list) || !list.length) return null;
    const results = list.map(item => evaluateCondition(item, values));
    if (results.includes(null)) return null;
    return node === "all" ? results.every(Boolean) : results.some(Boolean);
  }

  if ("not" in condition) {
    const inner = evaluateCondition(condition.not, values);
    return inner === null ? null : !inner;
  }

  if (typeof condition.field !== "string" || !CONDITION_OPS.includes(condition.op)) return null; // A field the record does not carry holds nothing.

  const held = itemsOf(values.get(condition.field));
  if (condition.op === "empty") return held.length === 0;
  if (condition.op === "not_empty") return held.length > 0;

  if (condition.op === "eq" || condition.op === "ne") {
    // A list (a multiple field) is equal when any of its items is.
    const hit = held.includes(String(scalar(condition.value)));
    return condition.op === "eq" ? hit : !hit;
  }

  if (!Array.isArray(condition.value)) return null;
  const wanted = condition.value.map(item => String(scalar(item)));
  const hit = held.some(item => wanted.includes(item));
  return condition.op === "in" ? hit : !hit;
} // What a field's `when` decides, given the values on screen. A part the field
// does not condition, or conditions unreadably, is what the field declares:
// shown, required as `required` says, enabled unless `readonly`.

function fieldConditions(field, values) {
  const when = field?.when && typeof field.when === "object" ? field.when : null;

  const decide = key => when && key in when ? evaluateCondition(when[key], values) : null;

  const visible = decide("visible");
  const required = decide("required");
  const enabled = decide("enabled");
  return {
    visible: visible ?? true,
    required: required ?? field?.required === true,
    enabled: enabled ?? true
  };
}

/***/ },

/***/ "f44b979883f0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   compare: () => (/* binding */ compare),
/* harmony export */   decimalString: () => (/* binding */ decimalString),
/* harmony export */   editableDecimal: () => (/* binding */ editableDecimal),
/* harmony export */   formatDecimal: () => (/* binding */ formatDecimal),
/* harmony export */   fractionDigits: () => (/* binding */ fractionDigits),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   readDecimal: () => (/* binding */ readDecimal),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   share: () => (/* binding */ share),
/* harmony export */   toDecimal: () => (/* binding */ toDecimal)
/* harmony export */ });
// Decimal numbers as strings, never as floats (Larena property types standard,
// notes of 2026-11-03: «Arithmetic is on decimal digits, never on floats»;
// «Never a float on the wire»). A money amount, a percent and every cell a row
// computes are read, multiplied, summed and rounded here on BigInt units, so
// 0.1 + 0.2 is 0.3 and 2 499,99 stays 2 499,99 however many rows add up to it.
//
// A decimal is {units, scale}: the value is units / 10^scale. The canonical
// string has an optional minus, the integer digits without leading zeros and
// the fraction digits as written ("1500.50", "0.5", "-3"); "-0" is "0".
const TYPED = /^([+-]?)(\d*)(?:[.,](\d*))?$/u; // Spaces a person or a formatter puts between groups of digits: the plain
// space, the no-break space and the narrow no-break space ru-RU writes.

const GROUP_SPACES = /[\s   ']/gu;
/**
 * What a person typed, read as a decimal: `{ok: true, value}` with the
 * canonical string (null for nothing typed), or `{ok: false}` for text that is
 * not a number. A comma and a point both separate the fraction; spaces between
 * groups go.
 */

function readDecimal(text) {
  if (text === null || typeof text === 'undefined') return {
    ok: true,
    value: null
  };

  if (typeof text === 'number') {
    // A JSON integer is taken as its digits (property types standard §5); a
    // float is not a decimal and is refused rather than guessed at.
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
  const value = `${sign === '-' && !zero ? '-' : ''}${integer}${digits ? `.${digits}` : ''}`;
  return {
    ok: true,
    value
  };
}
/** The decimal of a canonical string or a JSON integer, or null. */

function toDecimal(value) {
  if (value && typeof value === 'object' && typeof value.units === 'bigint') return value;
  const read = readDecimal(value);
  if (!read.ok || read.value === null) return null;
  const negative = read.value.startsWith('-');
  const [whole, fraction = ''] = read.value.replace('-', '').split('.');
  const units = BigInt(whole + fraction) * (negative ? -1n : 1n);
  return {
    units,
    scale: fraction.length
  };
}
/** How many digits a decimal string has after its point. */

function fractionDigits(value) {
  const read = readDecimal(value);
  if (!read.ok || read.value === null) return 0;
  const at = read.value.indexOf('.');
  return at === -1 ? 0 : read.value.length - at - 1;
}
const POWERS = new Map();

const power = n => {
  if (!POWERS.has(n)) POWERS.set(n, 10n ** BigInt(n));
  return POWERS.get(n);
};

function rescale(decimal, scale) {
  return decimal.scale === scale ? decimal : {
    units: decimal.units * power(scale - decimal.scale),
    scale
  };
}

function multiply(a, b) {
  return {
    units: a.units * b.units,
    scale: a.scale + b.scale
  };
}
function add(a, b) {
  const scale = Math.max(a.scale, b.scale);
  return {
    units: rescale(a, scale).units + rescale(b, scale).units,
    scale
  };
}
/** A share: 20 percent is 0.2 (property types standard, rows: «A percent operand counts as its share»). */

function share(decimal) {
  return {
    units: decimal.units,
    scale: decimal.scale + 2
  };
}
/** Rounded half away from zero to `scale` digits after the point. */

function round(decimal, scale) {
  if (decimal.scale <= scale) return rescale(decimal, scale);
  const divisor = power(decimal.scale - scale);
  const negative = decimal.units < 0n;
  const magnitude = negative ? -decimal.units : decimal.units;
  let units = magnitude / divisor;
  if (magnitude % divisor * 2n >= divisor) units += 1n;
  return {
    units: negative ? -units : units,
    scale
  };
}
function compare(a, b) {
  const scale = Math.max(a.scale, b.scale);
  const left = rescale(a, scale).units;
  const right = rescale(b, scale).units;
  return left === right ? 0 : left < right ? -1 : 1;
}
/** The canonical string of a decimal, with exactly its scale's digits after the point. */

function decimalString(decimal) {
  const negative = decimal.units < 0n;
  const digits = (negative ? -decimal.units : decimal.units).toString().padStart(decimal.scale + 1, '0');
  const whole = decimal.scale ? digits.slice(0, -decimal.scale) : digits;
  const fraction = decimal.scale ? digits.slice(-decimal.scale) : '';
  const zero = decimal.units === 0n;
  return `${negative && !zero ? '-' : ''}${whole}${fraction ? `.${fraction}` : ''}`;
} // The separators of a locale, read once from Intl and kept: a decimal is
// formatted from its digits, so no amount passes through a float to be shown.

const SEPARATORS = new Map();

function separators(locale) {
  if (!SEPARATORS.has(locale)) {
    let group = ' ';
    let point = '.';

    try {
      for (const part of new Intl.NumberFormat(locale).formatToParts(12345.6)) {
        if (part.type === 'group') group = part.value;
        if (part.type === 'decimal') point = part.value;
      }
    } catch {// An unknown locale keeps the defaults.
    }

    SEPARATORS.set(locale, {
      group,
      point
    });
  }

  return SEPARATORS.get(locale);
}
/**
 * A decimal string as a person reads it in `locale`: groups of three, the
 * locale's point, and at least `minFraction` digits after it («1 500,50»).
 * Groups start at four digits, as the standard reads money («1 500,50 ₽»).
 */


function formatDecimal(value, locale, {
  minFraction = 0
} = {}) {
  const decimal = toDecimal(value);
  if (!decimal) return '';
  const text = decimalString(decimal.scale < minFraction ? rescale(decimal, minFraction) : decimal);
  const negative = text.startsWith('-');
  const [whole, fraction] = text.replace('-', '').split('.');
  const {
    group,
    point
  } = separators(locale);
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/gu, group);
  return `${negative ? '−' : ''}${grouped}${fraction ? `${point}${fraction}` : ''}`;
}
/** A decimal string as typed in an input: the locale's point, no groups («1500,5»). */

function editableDecimal(value, locale) {
  const read = readDecimal(value);
  if (!read.ok || read.value === null) return '';
  return read.value.replace('.', separators(locale).point);
}

/***/ },

/***/ "62c5c417c97d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderFieldValue: () => (/* binding */ renderFieldValue)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("e5483002f3ea");
/* harmony import */ var _set_fields_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("db94c32f22be");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_1__, _set_fields_js__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_1__, _set_fields_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


 // One field's value, shown or edited, drawn by the SIMAI Framework field
// renderers. Moved out of the record component's template (sf-view-properties
// 1.10.0) so that every view of the set that draws a field draws it the same
// way: sf-view-properties and sf-view-flow import this, and neither
// has field code of its own (reuse rule, naming decision 2026-11-02).
//
// `context` is what the caller's template reads:
//   component      changeField(field, value), reportFieldError(field, message),
//                  openReference(field, value); with the uploads and the
//                  picker methods when canUploadFiles / canPickRecords
//   changed        a Map of the values typed and not saved yet, by key
//   size           '1' or '1/2', the renderers' size
//   viewHost       the host the view renderers read (formatFieldValue)
//   emptyText      what an empty value reads as
//   canUploadFiles, canPickRecords   whether the host offers those

function renderFieldValue(context, field, editing, {
  disabled = false
} = {}) {
  const key = String(field.key ?? '');
  const editHost = {
    setFieldValue: (target, value) => context.component.changeField(target, value),
    // A control that knows its entry is not a value yet says so here (port
    // 1.16.0: a masked string that does not fill its mask); the view holds
    // both saves until it is completed or cleared.
    setFieldError: (target, message) => context.component.reportFieldError(target, message),
    ...(context.canUploadFiles ? {
      getFieldUploads: target => context.component.getFieldUploads(target),
      startFieldUpload: (target, items) => context.component.startFieldUpload(target, items),
      retryFieldUpload: (target, index) => context.component.retryFieldUpload(target, index)
    } : {}),
    ...(context.canPickRecords ? {
      getFieldOptionsPage: target => context.component.getFieldOptionsPage(target),
      getFieldOptionSearch: target => context.component.getFieldOptionSearch(target),
      setFieldOptionSearch: (target, text) => context.component.setFieldOptionSearch(target, text),
      loadFieldOptions: (target, request) => context.component.loadFieldOptions(target, request)
    } : {})
  }; // Money, a percent, rows and the compound fields are the set's own
  // (js/set-fields.js, Larena addendum of 2026-11-03): drawn from Framework
  // controls, with the edit host above, before the Framework renderers are
  // asked for a type they do not draw.

  const own = (0,_set_fields_js__WEBPACK_IMPORTED_MODULE_2__.renderSetField)(field, context.changed.has(key) && editing ? context.changed.get(key) : field.value, editing, editHost, {
    node: context.component,
    size: context.size,
    viewHost: context.viewHost,
    disabled
  });

  if (own !== null) {
    return own === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-empty color-on-surface-variant">${context.emptyText}</span>` : own;
  } // A datetime and a time of day are the renderer set's: sf-input-date in
  // mode datetime and time, one control each (SIMAI Framework duplication
  // audit A-14). This view drew its own pair -- the day in a datepicker and
  // the time in a masked field -- which cut the day short in a half-width
  // field and held half-typed entries of its own.


  const content = editing ? (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_1__.renderEditField)(field, context.changed.has(key) ? context.changed.get(key) : field.value, editHost, // A field its condition turns off is drawn disabled where the set
  // draws disabled apart from read-only (a choice as buttons).
  {
    size: context.size,
    ...(disabled ? {
      disabled: true
    } : {})
  }) : (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_1__.renderViewField)(field, field.value, context.viewHost, {
    size: context.size
  });
  const reference = ['record', 'relation', 'user'].includes(field.propertyType || field.type) && field.value && typeof field.value === 'object';

  if (!editing && reference && content) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
                class="sf-property-view-reference"
                @click=${event => {
      event.preventDefault(); // And no further: the field in view is a button that opens
      // the group for editing, so a press that reached it put the
      // whole group into edit behind the record that had just
      // opened (owner, 2026-10-08). Following a reference is one
      // intent, not two.

      event.stopPropagation();
      context.component.openReference(field, field.value);
    }}
        >${content}</span>`;
  } // An edit control the set cannot build is not an empty value. record and
  // relation have no editor until the picker's host methods exist, and the
  // first version showed «не заполнено» over a field that had a value -- a
  // consumer read it as the value having been lost. Fall back to the view, so
  // the value is shown and plainly not editable yet.


  if (editing && (content === null || typeof content === 'undefined' || content === lit__WEBPACK_IMPORTED_MODULE_0__.nothing)) {
    const shown = (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_1__.renderViewField)(field, field.value, context.viewHost, {
      size: context.size
    });

    if (shown !== null && typeof shown !== 'undefined' && shown !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-readonly color-on-surface-variant" data-readonly="true">${shown}</span>`;
    }
  }

  if (content === null || typeof content === 'undefined' || content === lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-empty color-on-surface-variant">${context.emptyText}</span>`;
  }

  return content;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "eebd0e5026e8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HISTORY_KINDS: () => (/* binding */ HISTORY_KINDS),
/* harmony export */   HISTORY_PAGE_MAX: () => (/* binding */ HISTORY_PAGE_MAX),
/* harmony export */   cellText: () => (/* binding */ cellText),
/* harmony export */   historyFromRevisions: () => (/* binding */ historyFromRevisions)
/* harmony export */ });
// The record's change history (owner decision C305 (2), RC-3; VP-18).
//
// The port: the card raises record.history {record_id, collection, cursor,
// kinds} and the host answers {answer: "applied", events, has_more, cursor}:
//
//   events    newest first, each {id, time, actor, kind, changes}
//     id        the event's id (a revision makes a good one)
//     time      ISO 8601 with its offset
//     actor     the person's name as the host resolved it, or {name, system}
//     kind      create | update | delete | restore | publish (another word is
//               read as update)
//     changes   [{field, label, before, after}] -- field is the field's key, so
//               the card draws before and after by that field's template; the
//               label is the host's when the field is not in the arrangement.
//               A field the person may not read (encrypted, closed by rights)
//               comes as {field, label, sealed: true} with no values: the card
//               says the value is hidden and draws no before or after
//   has_more  whether «Показать ещё» asks for another page
//   cursor    what the next ask carries (the oldest event's revision); absent,
//             the last event's id is sent
//
// kinds narrows the events: ["update"] is «Только изменения полей», null is
// every event. The host pages (20 by default, 50 at most); the card never asks
// for the whole history.
//
// Larena (storage 4915505, Root ee49efc9) answers this shape: newest first,
// pages of 20 (max 50), cursor = revision, labels from the version schema,
// actor a resolved name, time ISO 8601 with its zone, sealed fields as above;
// publications are not in its record versions yet (a publish filter is empty).
//
// This module holds no imports so a host (and the unit tests) can load it
// alone; js/history.js draws the values by the field templates.
//
// historyFromRevisions is the adapter for a host that stores a full snapshot
// of the values per revision (Larena: operation, created_by, created_at,
// revision): an event is the difference of two neighbouring revisions. It is
// published on the element class (SfPropertyView.historyFromRevisions) so a
// host's port answers record.history with it, and the probes and the docs'
// demo source drive the same code.
const HISTORY_KINDS = ['create', 'update', 'delete', 'restore', 'publish'];

const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null); // The largest page a host gives (Larena: 50).


const HISTORY_PAGE_MAX = 50;
/**
 * The port's answer to record.history from stored revisions. `revisions` are
 * [{revision, operation, created_by, created_at, values}] in any order; `fields`
 * the record's field descriptors (their order and labels); `cursor` the revision
 * the next page starts below (null: the newest); `kinds` null or a list of the
 * kinds to keep; `limit` the page size (50 at most); `sealed` the keys of the
 * fields the reader may not see.
 */

function historyFromRevisions(revisions, {
  fields = [],
  cursor = null,
  kinds = null,
  limit = 20,
  sealed = []
} = {}) {
  const list = (Array.isArray(revisions) ? revisions : []).filter(one => one && one.revision !== undefined && one.revision !== null).slice().sort((a, b) => Number(a.revision) - Number(b.revision));
  const order = fields.map(field => String(field.key ?? '')).filter(Boolean);
  const labels = new Map(fields.map(field => [String(field.key ?? ''), String(field.label ?? field.key ?? '')])); // Fields the reader may not see: their change is said, never their values.

  const closed = new Set((Array.isArray(sealed) ? sealed : []).map(String));
  const events = [];

  for (let at = list.length - 1; at >= 0; at -= 1) {
    const one = list[at];
    const before = at > 0 ? list[at - 1].values ?? {} : {};
    const after = one.values ?? {};
    const kind = HISTORY_KINDS.includes(one.operation) ? one.operation : 'update';
    const keys = [...new Set([...order, ...Object.keys(after), ...Object.keys(before)])];
    const changes = kind === 'update' ? keys.filter(key => !same(before[key], after[key])).map(key => closed.has(key) ? {
      field: key,
      label: labels.get(key) ?? key,
      sealed: true
    } : {
      field: key,
      label: labels.get(key) ?? key,
      before: before[key] ?? null,
      after: after[key] ?? null
    }) : [];
    if (kind === 'update' && !changes.length) continue;
    events.push({
      id: `revision-${one.revision}`,
      revision: one.revision,
      time: one.created_at ?? null,
      actor: one.created_by ?? null,
      kind,
      changes
    });
  }

  const below = cursor === null || cursor === undefined || cursor === '' ? Infinity : Number(cursor);
  const wanted = Array.isArray(kinds) && kinds.length ? new Set(kinds) : null;
  const left = events.filter(event => Number(event.revision) < below && (!wanted || wanted.has(event.kind)));
  const page = left.slice(0, Math.min(HISTORY_PAGE_MAX, Math.max(1, Number(limit) || 20)));
  const more = left.length > page.length;
  return {
    answer: 'applied',
    events: page.map(({
      revision,
      ...event
    }) => event),
    has_more: more,
    cursor: more ? String(page.at(-1).revision) : null
  };
} // A value as its template draws it in the compact place (C302: the table's
// cell, «Кратко»), read as text: sf-change takes text (C279). The compact
// template answers the host's cell shape -- a string, {component: {type,
// props}}, a link {href, text} or a list of those; a part's text is its
// props' text (a badge), else nothing (an avatar beside the name).

function cellText(shape) {
  if (shape === null || shape === undefined || shape === false) return '';
  if (typeof shape === 'string' || typeof shape === 'number') return String(shape);
  if (Array.isArray(shape)) return shape.map(cellText).filter(Boolean).join(' ');

  if (typeof shape === 'object') {
    const props = shape.component?.props ?? shape.props ?? null;
    if (shape.component && shape.component.type === 'avatar') return '';
    if (props) return String(props.text ?? props.label ?? props.value ?? '');
    return String(shape.text ?? shape.label ?? '');
  }

  return '';
}

/***/ },

/***/ "f8f76dff9bfe"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HISTORY_KINDS: () => (/* reexport safe */ _history_port_js__WEBPACK_IMPORTED_MODULE_1__.HISTORY_KINDS),
/* harmony export */   historyFromRevisions: () => (/* reexport safe */ _history_port_js__WEBPACK_IMPORTED_MODULE_1__.historyFromRevisions),
/* harmony export */   timelineItems: () => (/* binding */ timelineItems),
/* harmony export */   valueText: () => (/* binding */ valueText)
/* harmony export */ });
/* harmony import */ var _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e5483002f3ea");
/* harmony import */ var _history_port_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("eebd0e5026e8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];


 // The record's change history drawn as sf-list-timeline items (C305 (2),
// RC-3); the port and its adapter are in js/history-port.js.

function valueText(field, value, host) {
  if (value === null || value === undefined || value === '') return '';
  const own = typeof value === 'object' ? String(value.label ?? value.name ?? value.text ?? '') : String(value);
  if (!field) return own;
  let drawn = null;

  try {
    drawn = (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_0__.renderCellField)(field, value, host);
  } catch {
    drawn = null;
  }

  const text = (0,_history_port_js__WEBPACK_IMPORTED_MODULE_1__.cellText)(drawn).replace(/\s+/gu, ' ').trim();
  return text || own;
}
/**
 * The port's events as sf-list-timeline items: the actor, the time, a title by
 * kind, and every change's before and after drawn by its field's template.
 * `words` are the card's (historyCreate…), `fieldOf(key)` finds a descriptor.
 */

function timelineItems(events, {
  words,
  fieldOf,
  host
}) {
  return (Array.isArray(events) ? events : []).filter(event => event && event.id !== undefined).map(event => {
    const kind = _history_port_js__WEBPACK_IMPORTED_MODULE_1__.HISTORY_KINDS.includes(event.kind) ? event.kind : 'update';
    const all = Array.isArray(event.changes) ? event.changes : []; // A sealed field (encrypted, closed by rights) is named, never drawn.

    const sealed = all.filter(change => change && change.sealed === true).map(change => String(change.label ?? fieldOf(String(change.field ?? ''))?.label ?? change.field ?? ''));
    const changes = all.filter(change => change && change.sealed !== true).map(change => {
      const field = fieldOf(String(change.field ?? ''));
      return {
        label: String(change.label ?? field?.label ?? change.field ?? ''),
        before: valueText(field, change.before, host),
        after: valueText(field, change.after, host)
      };
    });
    const actor = event.actor && typeof event.actor === 'object' ? event.actor : event.actor ? {
      name: String(event.actor)
    } : null;
    const count = changes.length + sealed.length;
    const title = kind === 'update' ? count === 1 ? words.historyChangedOne.replace('{field}', changes[0]?.label ?? sealed[0]) : words.historyChangedMany.replace('{n}', String(count)) : words[`history${kind[0].toUpperCase()}${kind.slice(1)}`];
    return {
      id: String(event.id),
      ...(event.time ? {
        time: String(event.time)
      } : {}),
      ...(actor ? {
        actor
      } : {}),
      title,
      ...(kind === 'delete' ? {
        status: 'error'
      } : kind === 'publish' || kind === 'restore' ? {
        status: 'success'
      } : {}),
      ...(changes.length === 1 ? {
        change: changes[0]
      } : changes.length > 1 ? {
        changes
      } : {}),
      ...(sealed.length ? {
        text: words.historySealed.replace('{fields}', sealed.join(', '))
      } : {})
    };
  });
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d69ebe7e288e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   currencyOf: () => (/* binding */ currencyOf),
/* harmony export */   formatMoney: () => (/* binding */ formatMoney),
/* harmony export */   moneyParts: () => (/* binding */ moneyParts),
/* harmony export */   percentText: () => (/* binding */ percentText)
/* harmony export */ });
/* harmony import */ var _decimal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f44b979883f0");
/* harmony import */ var _field_renderers_decimal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ab3947ea3647");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_field_renderers_decimal_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_field_renderers_decimal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];

 // Money and percent as a person reads them, from decimal strings, never a
// float: the currency's sign and minor units come from Intl, the digits from
// ./decimal.js. Pure, so the unit suite reads it without a browser.

const CURRENCY = new Map();
/** {sign, before, minor}: the sign a locale writes, whether before the amount, and the ISO 4217 minor units. */

function currencyOf(code, locale) {
  const id = `${code}|${locale}`;

  if (!CURRENCY.has(id)) {
    let sign = code;
    let before = false;
    let minor = 2;

    try {
      const format = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
        currencyDisplay: 'narrowSymbol'
      });
      const parts = format.formatToParts(1);
      const at = parts.findIndex(part => part.type === 'currency');
      sign = parts[at]?.value ?? code;
      before = at < parts.findIndex(part => part.type === 'integer');
      minor = format.resolvedOptions().maximumFractionDigits;
    } catch {// A code Intl does not know keeps its letters and two minor digits.
    }

    CURRENCY.set(id, {
      sign,
      before,
      minor
    });
  }

  return CURRENCY.get(id);
}
/** An amount with its currency, as a person reads it: «1 500,50 ₽», «$1,500.50». */

function formatMoney(amount, code, locale) {
  if (!code) return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.formatDecimal)(amount, locale);
  const {
    sign,
    before,
    minor
  } = currencyOf(code, locale);
  const number = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.formatDecimal)(amount, locale, {
    minFraction: minor
  });
  if (!number) return '';
  return before ? `${sign}${number}` : `${number} ${sign}`;
}
/** A money value as {amount, currency}; a field that fixes the currency takes a bare amount. */

function moneyParts(value, fixed) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      amount: value.amount ?? null,
      currency: fixed || (value.currency ?? null)
    };
  }

  if (value === null || typeof value === 'undefined' || value === '') return {
    amount: null,
    currency: fixed || null
  };
  return {
    amount: value,
    currency: fixed || null
  };
} // The set writes a percent as the SIMAI Framework's renderer does (C203 (3),
// msg-e78f2e51): the page's decimal separator and one spelling in every
// language, «12,5 %», «12.5 %». It used to read the space from Intl and wrote
// «12.5%» in English beside the renderer's «12.5 %».

function percentText(value, locale) {
  return (0,_field_renderers_decimal_js__WEBPACK_IMPORTED_MODULE_1__.formatPercent)(value, locale);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "06dfc7b3b9d9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   REQUISITE_PARTS: () => (/* binding */ REQUISITE_PARTS),
/* harmony export */   innValid: () => (/* binding */ innValid),
/* harmony export */   ogrnValid: () => (/* binding */ ogrnValid),
/* harmony export */   requisiteErrors: () => (/* binding */ requisiteErrors)
/* harmony export */ });
// The checks of Russian requisites (Larena property types standard, notes of
// 2026-11-03, `ru.requisites@1`): each part on its own, and the parts that go
// together, together. The server checks the same and is the authority; these
// are here so a person sees a mistyped ИНН under the field instead of a refused
// save after it.
//
// Every check answers the key of the words that explain the mistake, or null.
const REQUISITE_PARTS = Object.freeze(['inn', 'kpp', 'ogrn', 'bik', 'account', 'corr_account']);

const digitsOf = text => [...text].map(Number);

const weighted = (digits, weights) => weights.reduce((sum, weight, index) => sum + weight * digits[index], 0);

function innValid(inn) {
  if (!/^\d{10}$|^\d{12}$/u.test(inn)) return false;
  const d = digitsOf(inn);
  if (inn.length === 10) return weighted(d, [2, 4, 10, 3, 5, 9, 4, 6, 8]) % 11 % 10 === d[9];
  const eleventh = weighted(d, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) % 11 % 10;
  const twelfth = weighted(d, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) % 11 % 10;
  return eleventh === d[10] && twelfth === d[11];
}
function ogrnValid(ogrn) {
  if (!/^\d{13}$|^\d{15}$/u.test(ogrn)) return false;
  const body = BigInt(ogrn.slice(0, -1));
  const modulus = ogrn.length === 13 ? 11n : 13n;
  return Number(body % modulus % 10n) === Number(ogrn.at(-1));
} // An account is checked with the БИК by the Bank of Russia key: the three
// digits that come before it, then its twenty, weighted 7, 1, 3 in turn, add up
// to a multiple of ten. A settlement account takes the БИК's last three digits;
// a correspondent account takes «0» and the БИК's fifth and sixth.

function accountKeyValid(prefix, account) {
  const digits = digitsOf(prefix + account);
  const sum = digits.reduce((total, digit, index) => total + digit * [7, 1, 3][index % 3], 0);
  return sum % 10 === 0;
}
/** The mistakes of a requisites value, part by part: {inn: 'innWrong', …}. */


function requisiteErrors(value, parts = REQUISITE_PARTS) {
  const errors = {};

  const has = part => parts.includes(part);

  const of = part => String(value?.[part] ?? '');

  const inn = of('inn');
  const kpp = of('kpp');
  const ogrn = of('ogrn');
  const bik = of('bik');
  const account = of('account');
  const corr = of('corr_account');

  if (has('inn')) {
    // The ИНН is required (the standard): a value without one is no value.
    if (!inn) errors.inn = 'innRequired';else if (!/^\d{10}$|^\d{12}$/u.test(inn)) errors.inn = 'innLength';else if (!innValid(inn)) errors.inn = 'innWrong';
  }

  const person = inn.length === 12;
  const organization = inn.length === 10;

  if (has('kpp') && kpp) {
    if (!/^\d{4}[\dA-Z]{2}\d{3}$/u.test(kpp)) errors.kpp = 'kppWrong';else if (person) errors.kpp = 'kppPerson';
  }

  if (has('ogrn') && ogrn) {
    if (!/^\d{13}$|^\d{15}$/u.test(ogrn)) errors.ogrn = 'ogrnLength';else if (!ogrnValid(ogrn)) errors.ogrn = 'ogrnWrong';else if (organization && ogrn.length !== 13) errors.ogrn = 'ogrnOrganization';else if (person && ogrn.length !== 15) errors.ogrn = 'ogrnPerson';
  }

  const bikRight = /^04\d{7}$/u.test(bik);
  if (has('bik') && bik && !bikRight) errors.bik = 'bikWrong';

  if (has('account') && account) {
    if (!/^\d{20}$/u.test(account)) errors.account = 'accountLength';else if (bikRight && !accountKeyValid(bik.slice(-3), account)) errors.account = 'accountKey';
  }

  if (has('corr_account') && corr) {
    if (!/^\d{20}$/u.test(corr)) errors.corr_account = 'accountLength';else if (!corr.startsWith('301')) errors.corr_account = 'corrStart';else if (bikRight && !accountKeyValid(`0${bik.slice(4, 6)}`, corr)) errors.corr_account = 'accountKey';
  }

  return errors;
}

/***/ },

/***/ "ebc72103d8b6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NUMERIC: () => (/* binding */ NUMERIC),
/* harmony export */   cellDecimal: () => (/* binding */ cellDecimal),
/* harmony export */   columnCurrency: () => (/* binding */ columnCurrency),
/* harmony export */   columnOf: () => (/* binding */ columnOf),
/* harmony export */   columnsOf: () => (/* binding */ columnsOf),
/* harmony export */   computeRow: () => (/* binding */ computeRow),
/* harmony export */   rowTotals: () => (/* binding */ rowTotals),
/* harmony export */   rowsOf: () => (/* binding */ rowsOf)
/* harmony export */ });
/* harmony import */ var _decimal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f44b979883f0");
/* harmony import */ var _money_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d69ebe7e288e");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_money_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_money_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];

 // Rows over columns (Larena property types standard, notes of 2026-11-03,
// `items@1`): the columns as the set reads them, the computed cells of a row
// and the totals under summed columns, on decimal strings. Pure, so the unit
// suite reads it without a browser.

const NUMERIC = new Set(['integer', 'number', 'percent', 'money']); // A column as the set reads it: its settings beside its own keys, its type
// under the name the renderers address (`propertyType`).

function columnOf(column) {
  const {
    settings,
    ...own
  } = column ?? {};
  const type = own.propertyType || own.type;
  return { ...(settings && typeof settings === 'object' ? settings : {}),
    ...own,
    propertyType: type,
    type
  };
}
function columnsOf(field) {
  return (Array.isArray(field.columns) ? field.columns : []).map(columnOf).filter(column => column.key);
}
function rowsOf(value) {
  return Array.isArray(value) ? value.map(row => row && typeof row === 'object' ? row : {}) : [];
} // The decimal a numeric cell holds, or null.

function cellDecimal(column, cell) {
  if (cell === null || typeof cell === 'undefined' || cell === '') return null;
  if (column.propertyType === 'money') return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.toDecimal)((0,_money_js__WEBPACK_IMPORTED_MODULE_1__.moneyParts)(cell, column.currency).amount);
  return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.toDecimal)(cell);
} // The currency a money column's cells are in: its own, else the one money
// operand's when it is computed.

function columnCurrency(column, columns) {
  if (column.currency) return column.currency;

  if (column.compute?.of) {
    const operand = columns.find(one => column.compute.of.includes(one.key) && one.propertyType === 'money');
    return operand?.currency ?? null;
  }

  return null;
}
/**
 * A row with its computed cells worked out from the cells typed: a product of
 * two or three operands, a percent counting as its share, rounded half away
 * from zero to the currency's minor units or the column's `scale` (2 by
 * default). A computed cell whose operands are not all there is no cell. The
 * keys follow the columns, the computed ones last. The server works the same
 * out and is the authority.
 */

function computeRow(row, columns, locale = 'en') {
  const typed = {};
  const computed = {};

  for (const column of columns) {
    if (column.compute) continue;
    if (Object.hasOwn(row, column.key) && row[column.key] !== null && row[column.key] !== '') typed[column.key] = row[column.key];
  }

  for (const column of columns) {
    if (!column.compute || column.compute.op !== 'multiply' || !Array.isArray(column.compute.of)) continue;
    let product = null;
    let currency = null;

    for (const key of column.compute.of) {
      const operand = columns.find(one => one.key === key);
      const decimal = operand ? cellDecimal(operand, typed[key]) : null;

      if (!decimal) {
        product = null;
        break;
      }

      if (operand.propertyType === 'money') currency = (0,_money_js__WEBPACK_IMPORTED_MODULE_1__.moneyParts)(typed[key], operand.currency).currency;
      const factor = operand.propertyType === 'percent' ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.share)(decimal) : decimal;
      product = product ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.multiply)(product, factor) : factor;
    }

    if (!product) continue;

    if (column.propertyType === 'money') {
      const code = column.currency || currency;
      const scale = code ? (0,_money_js__WEBPACK_IMPORTED_MODULE_1__.currencyOf)(code, locale).minor : 2;
      computed[column.key] = {
        amount: (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.decimalString)((0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.round)(product, scale)),
        currency: code
      };
    } else {
      const scale = column.propertyType === 'integer' ? 0 : Number.isInteger(column.scale) ? column.scale : 2;
      computed[column.key] = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.decimalString)((0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.round)(product, scale));
    }
  }

  return { ...typed,
    ...computed
  };
}
/** The sums of the columns marked `total: "sum"`, as decimals by key. */

function rowTotals(rows, columns) {
  const totals = {};

  for (const column of columns) {
    if (column.total !== 'sum' || !NUMERIC.has(column.propertyType)) continue;
    let sum = {
      units: 0n,
      scale: 0
    };

    for (const row of rows) {
      const decimal = cellDecimal(column, row[column.key]);
      if (decimal) sum = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.add)(sum, decimal);
    }

    totals[column.key] = sum;
  }

  return totals;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "db94c32f22be"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SET_FIELD_TYPES: () => (/* binding */ SET_FIELD_TYPES),
/* harmony export */   drawsSetField: () => (/* binding */ drawsSetField),
/* harmony export */   renderSetField: () => (/* binding */ renderSetField),
/* harmony export */   setFieldText: () => (/* binding */ setFieldText)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _set_fields_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f59c8bcdc90a");
/* harmony import */ var _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e5483002f3ea");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _decimal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f44b979883f0");
/* harmony import */ var _money_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d69ebe7e288e");
/* harmony import */ var _rows_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("ebc72103d8b6");
/* harmony import */ var _requisites_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("06dfc7b3b9d9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _money_js__WEBPACK_IMPORTED_MODULE_5__, _rows_js__WEBPACK_IMPORTED_MODULE_6__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _money_js__WEBPACK_IMPORTED_MODULE_5__, _rows_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);







 // The property types the set draws itself, beside the SIMAI Framework field
// renderers it draws every other type with (Larena addendum of 2026-11-03 to
// the general components task, msg-bf1ad4f3ae00420bb752; Larena property types
// standard, notes of 2026-11-03):
//
//   money          {amount, currency}: an amount and its ISO 4217 currency
//   percent        a decimal with a % after it
//   items          rows over the field's columns: a table editor, a card a row on a phone
//   compound       a fixed set of parts with one value object, checked together
//   ru.requisites  the compound of a Russian organisation's or person's requisites
//
// Each is drawn from Framework controls (sf-input with `text-end`, sf-dropdown,
// sf-button-icon, sf-button) and, inside a row or a compound, by the Framework
// renderers for the types they already draw. Every number is a decimal string
// (./decimal.js): nothing here writes a float.
//
// A control writes what was typed. An entry that is not a value yet -- text
// that is not a number, more digits after the point than the currency has, a
// ИНН whose control digit is wrong -- is written as typed and reported through
// setFieldError, which holds both saves while it stands (port 1.16.0, as a
// masked string does), and the control says what is wrong under itself once
// the person has left it.

const TEXT = {
  en: {
    currency: 'Currency',
    notNumber: 'Enter a number',
    fractionMax: 'At most {n} digits after the point',
    fractionNone: 'A whole amount, no digits after the point',
    chooseCurrency: 'Choose a currency',
    range: 'From {min} to {max}',
    atLeast: 'At least {min}',
    atMost: 'At most {max}',
    addRow: 'Add a row',
    removeRow: 'Remove the row',
    rowUp: 'Move the row up',
    rowDown: 'Move the row down',
    row: 'Row {n}',
    total: 'Total',
    cellsWrong: 'Some cells are not filled in correctly',
    rows: '{n} rows',
    row1: '1 row',
    inn: 'INN',
    kpp: 'KPP',
    ogrn: 'OGRN',
    bik: 'BIK',
    account: 'Account',
    corr_account: 'Correspondent account',
    innRequired: 'The INN is required',
    innLength: '10 digits for an organisation, 12 for a person',
    innWrong: 'The INN control digits do not match',
    kppWrong: 'Nine characters: four digits, two digits or letters, three digits',
    kppPerson: 'A person\'s INN has no KPP',
    ogrnLength: '13 digits (OGRN) or 15 (OGRNIP)',
    ogrnWrong: 'The control digit does not match',
    ogrnOrganization: 'An organisation has a 13-digit OGRN',
    ogrnPerson: 'A person has a 15-digit OGRNIP',
    bikWrong: 'Nine digits starting with 04',
    accountLength: '20 digits',
    accountKey: 'The account does not match the BIK',
    corrStart: 'A correspondent account starts with 301'
  },
  ru: {
    currency: 'Валюта',
    notNumber: 'Введите число',
    fractionMax: 'Не больше {n} знаков после запятой',
    fractionNone: 'Целая сумма, без знаков после запятой',
    chooseCurrency: 'Выберите валюту',
    range: 'От {min} до {max}',
    atLeast: 'Не меньше {min}',
    atMost: 'Не больше {max}',
    addRow: 'Добавить строку',
    removeRow: 'Удалить строку',
    rowUp: 'Поднять строку',
    rowDown: 'Опустить строку',
    row: 'Строка {n}',
    total: 'Итого',
    cellsWrong: 'Не все ячейки заполнены верно',
    rows: '{n} строк',
    row1: '1 строка',
    inn: 'ИНН',
    kpp: 'КПП',
    ogrn: 'ОГРН',
    bik: 'БИК',
    account: 'Расчётный счёт',
    corr_account: 'Корр. счёт',
    innRequired: 'ИНН обязателен',
    innLength: '10 цифр у организации, 12 у физлица',
    innWrong: 'Не сходятся контрольные цифры ИНН',
    kppWrong: 'Девять знаков: четыре цифры, две цифры или буквы, три цифры',
    kppPerson: 'У ИНН физлица нет КПП',
    ogrnLength: '13 цифр (ОГРН) или 15 (ОГРНИП)',
    ogrnWrong: 'Не сходится контрольная цифра',
    ogrnOrganization: 'У организации ОГРН из 13 цифр',
    ogrnPerson: 'У физлица ОГРНИП из 15 цифр',
    bikWrong: 'Девять цифр, начиная с 04',
    accountLength: '20 цифр',
    accountKey: 'Счёт не сходится с БИК',
    corrStart: 'Корр. счёт начинается с 301'
  }
};
const WORDS_OF = 'sf-view-properties';

function word(node, key, vars = {}) {
  let text = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(TEXT, key, node, WORDS_OF);

  for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, String(value));

  return text;
} // ru counts: 1 строка, 2–4 строки, 5+ строк.


function rowsWord(node, count) {
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);
  if (count === 1) return word(node, 'row1');

  if (locale.startsWith('ru')) {
    const tens = count % 100;
    const ones = count % 10;
    if (ones >= 2 && ones <= 4 && (tens < 12 || tens > 14)) return `${count} строки`;
  }

  return word(node, 'rows', {
    n: count
  });
}

const SET_FIELD_TYPES = Object.freeze(['money', 'percent', 'items', 'compound', 'ru.requisites']); // --- Currencies -------------------------------------------------------------
// The currencies a money field offers when it does not fix one: the ones a
// Russian-language business meets most, and the value's own currency first
// when it is none of them. A field that fixes `currency` offers no choice.

const OFFERED_CURRENCIES = ['RUB', 'USD', 'EUR', 'CNY', 'KZT', 'BYN', 'AED', 'TRY', 'GBP', 'JPY']; // --- What a person is typing -------------------------------------------------
// The text in a decimal input while it is being typed. The value written is
// canonical («12.5»); drawn back as such it would move the caret under the
// person typing «12,50». So the typed text is kept per control and shown while
// it still reads as the value, and dropped when the control is left.

const DRAFTS = new WeakMap();

const draftsOf = node => {
  if (!DRAFTS.has(node)) DRAFTS.set(node, new Map());
  return DRAFTS.get(node);
}; // The controls a person has left: a message stands under a control only then,
// as a masked string's does.


const LEFT = new WeakMap();

const leftOf = node => {
  if (!LEFT.has(node)) LEFT.set(node, new Set());
  return LEFT.get(node);
};

const redraw = node => node?.requestComponentUpdate?.('changed');

function shownText(node, path, value, locale) {
  const draft = draftsOf(node).get(path);
  const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(value);
  if (!read.ok) return String(value ?? '');

  if (typeof draft === 'string') {
    const typed = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(draft);
    if (typed.ok && typed.value === read.value) return draft;
  }

  return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.editableDecimal)(read.value, locale);
} // The mistake of a typed decimal, or null: not a number, more digits after the
// point than allowed, outside the bounds.


function decimalError(node, raw, {
  maxFraction = null,
  min = null,
  max = null
} = {}) {
  const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(raw);
  if (!read.ok) return word(node, 'notNumber');
  if (read.value === null) return null;

  if (maxFraction !== null && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.fractionDigits)(read.value) > maxFraction) {
    return maxFraction === 0 ? word(node, 'fractionNone') : word(node, 'fractionMax', {
      n: maxFraction
    });
  }

  const value = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.toDecimal)(read.value);
  const low = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.toDecimal)(min);
  const high = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.toDecimal)(max);
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);

  if (low && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.compare)(value, low) < 0 || high && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.compare)(value, high) > 0) {
    if (low && high) return word(node, 'range', {
      min: (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.formatDecimal)(min, locale),
      max: (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.formatDecimal)(max, locale)
    });
    return low ? word(node, 'atLeast', {
      min: (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.formatDecimal)(min, locale)
    }) : word(node, 'atMost', {
      max: (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.formatDecimal)(max, locale)
    });
  }

  return null;
}
/**
 * One decimal input: sf-input with the decimal keyboard and `text-end` (a % or
 * a currency sign). `write(text, error)` gets what was typed -- canonical when
 * it reads as a number -- and the mistake, or null.
 */


function decimalInput(node, {
  path,
  value,
  size,
  label,
  required,
  textEnd,
  placeholder,
  check,
  write
}) {
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);
  const text = shownText(node, path, value, locale);
  const error = check(text);
  const shown = error && leftOf(node).has(path) ? error : '';

  const typed = event => {
    const raw = event.target?.value ?? '';
    draftsOf(node).set(path, raw);
    const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(raw);
    write(read.ok ? read.value : raw, check(raw));
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                class="sf-view-fields-decimal"
                size=${size}
                appearance="bordered"
                inputmode="decimal"
                value=${text}
                text-end=${textEnd || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                placeholder=${placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(required)}
                ?invalid=${Boolean(shown)}
                error-message=${shown || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${label || ''}
                data-path=${path}
                @input=${typed}
                @change=${typed}
                @focusout=${() => {
    draftsOf(node).delete(path);
    leftOf(node).add(path);
    redraw(node);
  }}
        ></sf-input>
    `;
} // --- percent -------------------------------------------------------------------


function percentBounds(field) {
  // 0 and 100 when the field sets none (property types standard §2).
  return {
    min: field.min ?? '0',
    max: field.max ?? '100'
  };
}

function renderPercentEdit(field, value, host, ctx) {
  const {
    min,
    max
  } = percentBounds(field);
  return decimalInput(ctx.node, {
    path: ctx.path ?? String(field.key ?? ''),
    value,
    size: ctx.size,
    label: field.label || field.key,
    required: field.required,
    textEnd: '%',
    placeholder: field.placeholder,
    check: text => decimalError(ctx.node, text, {
      min,
      max
    }),
    write: (next, error) => {
      host.setFieldValue(field, next);
      host.setFieldError?.(field, error);
    }
  });
}

function renderPercentView(field, value, ctx) {
  const text = (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.percentText)(value, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(ctx.node));
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // --- money ---------------------------------------------------------------------


function renderMoneyEdit(field, value, host, ctx) {
  const node = ctx.node;
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);
  const path = ctx.path ?? String(field.key ?? '');
  const fixed = typeof field.currency === 'string' && field.currency ? field.currency : null;
  const parts = (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.moneyParts)(value, fixed); // A currency chosen before an amount is typed waits here: a value is an
  // amount and its currency, never a currency alone.

  const currencyPath = `${path}#currency`;
  const currency = parts.currency || draftsOf(node).get(currencyPath) || null;
  const minor = currency ? (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.currencyOf)(currency, locale).minor : null;

  const check = text => {
    const error = decimalError(node, text, {
      maxFraction: minor,
      min: field.min ?? null,
      max: field.max ?? null
    });
    if (error) return error;
    return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(text).value !== null && !currency ? word(node, 'chooseCurrency') : null;
  };

  const write = (amount, error, code = currency) => {
    host.setFieldValue(field, amount === null ? null : {
      amount,
      currency: code
    });
    host.setFieldError?.(field, error);
  };

  const amount = decimalInput(node, {
    path,
    value: parts.amount,
    size: ctx.size,
    label: field.label || field.key,
    required: field.required,
    textEnd: fixed ? (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.currencyOf)(fixed, locale).sign : '',
    placeholder: field.placeholder,
    check,
    write
  });
  if (fixed) return amount;
  const offered = [...new Set([...(currency ? [currency] : []), ...OFFERED_CURRENCIES])];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-view-fields-money flex gap-1/3 min-w-0">
            ${amount}
            <sf-dropdown
                    class="sf-view-fields-currency"
                    size=${ctx.size}
                    appearance="bordered"
                    mode="select"
                    search="false"
                    value=${currency ?? ''}
                    placeholder=${word(node, 'currency')}
                    aria-label=${word(node, 'currency')}
                    .options=${offered.map(code => ({
    type: 'text',
    size: '1',
    value: code,
    text: `${code} ${(0,_money_js__WEBPACK_IMPORTED_MODULE_5__.currencyOf)(code, locale).sign === code ? '' : (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.currencyOf)(code, locale).sign}`.trim(),
    selected: code === currency
  }))}
                    @change=${event => {
    const code = event.detail?.value || null;
    draftsOf(node).set(currencyPath, code);
    const typed = parts.amount;

    if (typed !== null && typed !== '') {
      const nextMinor = code ? (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.currencyOf)(code, locale).minor : null;
      const error = decimalError(node, typed, {
        maxFraction: nextMinor,
        min: field.min ?? null,
        max: field.max ?? null
      }) || (code ? null : word(node, 'chooseCurrency'));
      write((0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(typed).ok ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(typed).value : typed, error, code);
    } else {
      redraw(node);
    }
  }}
            ></sf-dropdown>
        </span>
    `;
}

function moneyText(field, value, locale) {
  const fixed = typeof field.currency === 'string' && field.currency ? field.currency : null;
  const {
    amount,
    currency
  } = (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.moneyParts)(value, fixed);
  return amount === null ? '' : (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.formatMoney)(amount, currency, locale);
}

function renderMoneyView(field, value, ctx) {
  const text = moneyText(field, value, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(ctx.node));
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view sf-view-fields-amount">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // --- number inside a row -----------------------------------------------------------
// A number cell of a row is a decimal string as a money amount is: the
// Framework's number editor writes a float, which the rows refuse. An integer
// cell is the Framework's own.


function renderDecimalEdit(field, value, host, ctx) {
  return decimalInput(ctx.node, {
    path: ctx.path ?? String(field.key ?? ''),
    value,
    size: ctx.size,
    label: field.label || field.key,
    required: field.required,
    textEnd: field.unit || '',
    placeholder: field.placeholder,
    check: text => decimalError(ctx.node, text, {
      min: field.min ?? null,
      max: field.max ?? null
    }),
    write: (next, error) => {
      host.setFieldValue(field, next);
      host.setFieldError?.(field, error);
    }
  });
}

function decimalText(field, value, locale) {
  const text = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.formatDecimal)(value, locale);
  return text && field.unit ? `${text} ${field.unit}` : text;
} // --- items: rows over columns ------------------------------------------------------


function cellText(column, cell, columns, locale, viewHost) {
  if (cell === null || typeof cell === 'undefined' || cell === '') return null;

  switch (column.propertyType) {
    case 'money':
      {
        const {
          amount,
          currency
        } = (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.moneyParts)(cell, (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnCurrency)(column, columns));
        return amount === null ? null : (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.formatMoney)(amount, currency, locale);
      }

    case 'percent':
      return (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.percentText)(cell, locale);

    case 'number':
      return decimalText(column, cell, locale);

    default:
      {
        const shown = (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__.renderViewField)({ ...column,
          value: cell
        }, cell, viewHost, {
          size: '1'
        });
        return shown === null || shown === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? null : shown;
      }
  }
}

function totalText(column, total, columns, locale) {
  if (column.propertyType === 'money') {
    const currency = (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnCurrency)(column, columns);
    return (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.formatMoney)((0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.decimalString)(total), currency, locale);
  }

  if (column.propertyType === 'percent') return (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.percentText)((0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.decimalString)(total), locale);
  return decimalText(column, (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.decimalString)(total), locale);
} // A column's share of the row: text widest, a yes-or-no narrowest.


function track(column) {
  switch (column.propertyType) {
    case 'boolean':
      return 'minmax(4rem, auto)';
    // Wide enough for the control's own padding, a suffix (% or a currency
    // sign) and the digits a person types: a 5.5rem percent showed «2 %» for 20.

    case 'integer':
      return 'minmax(5.5rem, 0.6fr)';

    case 'percent':
      return 'minmax(6.5rem, 0.6fr)';

    case 'number':
      return 'minmax(6.5rem, 0.7fr)';

    case 'money':
      return column.currency ? 'minmax(9rem, 0.9fr)' : 'minmax(13rem, 1.2fr)';

    case 'date':
      return 'minmax(9rem, 0.8fr)';

    case 'choice':
      return 'minmax(8rem, 1fr)';

    default:
      return 'minmax(10rem, 2fr)';
  }
}

function itemsSummary(field, rows, columns, ctx) {
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(ctx.node);
  const totals = (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.rowTotals)(rows, columns);
  const first = columns.find(column => Object.hasOwn(totals, column.key) && column.propertyType === 'money') ?? columns.find(column => Object.hasOwn(totals, column.key));
  const count = rowsWord(ctx.node, rows.length);
  return first ? `${count}, ${word(ctx.node, 'total').toLowerCase()} ${totalText(first, totals[first.key], columns, locale)}` : count;
}

function renderItemsTable(field, rows, columns, ctx, {
  editing,
  host
}) {
  const node = ctx.node;
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);
  const key = String(field.key ?? '');
  const minRows = Number.isInteger(field.minRows) ? field.minRows : 0;
  const maxRows = Number.isInteger(field.maxRows) ? field.maxRows : 1000; // Fewer rows than the field asks for are drawn as empty rows to fill in,
  // and written only once something is typed in them.

  const drawn = editing ? [...rows, ...Array.from({
    length: Math.max(0, minRows - rows.length)
  }, () => ({}))] : rows;
  const totals = (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.rowTotals)(rows, columns);
  const hasTotals = Object.keys(totals).length > 0;
  const template = `${columns.map(track).join(' ')}${editing ? ' auto' : ''}`; // Every cell's mistake, by row and column, reported as one for the field:
  // the field holds the save while any cell does.

  const errors = cellErrorsOf(node, key);

  const reportCells = () => {
    const any = [...errors.values()].some(Boolean);
    host.setFieldError?.(field, any ? word(node, 'cellsWrong') : null);
  };

  const writeRows = next => {
    const computed = next.map(row => (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.computeRow)(row, columns, locale));
    host.setFieldValue(field, computed.length ? computed : null);
  };

  const writeCell = (index, column, cell) => {
    const next = drawn.map(row => ({ ...row
    }));
    if (cell === null || typeof cell === 'undefined' || cell === '') delete next[index][column.key];else next[index][column.key] = cell;
    writeRows(next.slice(0, Math.max(rows.length, index + 1)));
  }; // Rows move: what was typed in a cell and is not a value yet goes with the
  // cell's place, so the drafts of this field are dropped.


  const reshape = next => {
    for (const path of [...draftsOf(node).keys()]) if (path.startsWith(`${key}[`)) draftsOf(node).delete(path);

    for (const path of [...leftOf(node)]) if (path.startsWith(`${key}[`)) leftOf(node).delete(path);

    errors.clear();
    reportCells();
    writeRows(next);
  };

  const cell = (row, index, column) => {
    const path = `${key}[${index}].${column.key}`;
    const value = row[column.key];

    if (!editing || column.compute || field.readonly === true || column.readonly === true) {
      const text = cellText(column, column.compute && editing ? (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.computeRow)(row, columns, locale)[column.key] : value, columns, locale, ctx.viewHost);
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-text ${column.compute ? 'color-on-surface-variant' : ''}" data-computed=${column.compute ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${text ?? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="color-on-surface-variant">—</span>`}</span>`;
    }

    const cellField = { ...column,
      key: path,
      label: column.label || column.key,
      value
    };
    const cellHost = {
      setFieldValue: (_target, next) => writeCell(index, column, next),
      setFieldError: (_target, message) => {
        errors.set(path, message || null);
        reportCells();
      }
    };
    const cellCtx = { ...ctx,
      path
    };

    switch (column.propertyType) {
      case 'money':
        return renderMoneyEdit({ ...cellField,
          currency: column.currency
        }, value, cellHost, cellCtx);

      case 'percent':
        return renderPercentEdit(cellField, value, cellHost, cellCtx);

      case 'number':
        return renderDecimalEdit(cellField, value, cellHost, cellCtx);

      default:
        {
          const control = (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__.renderEditField)(cellField, value, cellHost, {
            size: ctx.size
          });
          return control ?? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-text">${cellText(column, value, columns, locale, ctx.viewHost) ?? '—'}</span>`;
        }
    }
  };

  const rowActions = index => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-view-items-actions flex items-cross-center gap-1/4" role="cell">
            <sf-button-icon size="1/2" appearance="ghost" scheme="on-surface-variant" icon="keyboard_arrow_up"
                    data-action="row-up" ?disabled=${index === 0 || index >= rows.length}
                    title=${word(node, 'rowUp')} aria-label=${word(node, 'rowUp')}
                    @click=${() => {
    const next = rows.slice();
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    reshape(next);
  }}></sf-button-icon>
            <sf-button-icon size="1/2" appearance="ghost" scheme="on-surface-variant" icon="keyboard_arrow_down"
                    data-action="row-down" ?disabled=${index >= rows.length - 1}
                    title=${word(node, 'rowDown')} aria-label=${word(node, 'rowDown')}
                    @click=${() => {
    const next = rows.slice();
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    reshape(next);
  }}></sf-button-icon>
            <sf-button-icon size="1/2" appearance="ghost" scheme="secondary" icon="delete"
                    data-action="row-remove" ?disabled=${drawn.length <= minRows || index >= rows.length}
                    title=${word(node, 'removeRow')} aria-label=${word(node, 'removeRow')}
                    @click=${() => reshape(rows.filter((_row, at) => at !== index))}></sf-button-icon>
        </span>
    `;

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-view-items-box">
        <span class="sf-view-items ${editing ? 'sf-view-items--edit' : ''}" data-items=${key} role="table"
              aria-label=${field.label || key} style=${`--sf-view-items-columns: ${template}`}>
            <span class="sf-view-items-head" role="row">
                ${columns.map(column => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-heading ${_rows_js__WEBPACK_IMPORTED_MODULE_6__.NUMERIC.has(column.propertyType) ? 'sf-view-items-numeric' : ''}" role="columnheader">${column.label || column.key}${editing && column.required && !column.compute ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="color-error" aria-hidden="true"> *</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`)}
                ${editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-heading" role="columnheader"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </span>
            ${drawn.map((row, index) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <span class="sf-view-items-row" role="row" data-row=${index} aria-label=${word(node, 'row', {
    n: index + 1
  })}>
                    ${columns.map(column => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <span class="sf-view-items-cell ${_rows_js__WEBPACK_IMPORTED_MODULE_6__.NUMERIC.has(column.propertyType) ? 'sf-view-items-numeric' : ''}" role="cell" data-column=${column.key}>
                            <span class="sf-view-items-cell-label color-on-surface-variant" aria-hidden="true">${column.label || column.key}</span>
                            ${cell(row, index, column)}
                        </span>`)}
                    ${editing ? rowActions(index) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </span>`)}
            ${hasTotals && rows.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span class="sf-view-items-row sf-view-items-totals" role="row" data-totals="true">
                        ${columns.map((column, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <span class="sf-view-items-cell ${_rows_js__WEBPACK_IMPORTED_MODULE_6__.NUMERIC.has(column.propertyType) ? 'sf-view-items-numeric' : ''} ${Object.hasOwn(totals, column.key) ? '' : 'sf-view-items-cell--blank'}" role="cell" data-column=${column.key}>
                                ${Object.hasOwn(totals, column.key) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-cell-label color-on-surface-variant" aria-hidden="true">${word(node, 'total')}: ${column.label || column.key}</span><span class="sf-view-items-text sf-view-items-total">${totalText(column, totals[column.key], columns, locale)}</span>` : at === 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-text sf-view-items-total-word">${word(node, 'total')}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            </span>`)}
                        ${editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span role="cell"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span class="sf-view-items-foot flex items-cross-center gap-1">
                        <sf-button appearance="outline" size=${ctx.size} icon="add" text=${word(node, 'addRow')}
                                data-action="row-add" ?disabled=${drawn.length >= maxRows}
                                @click=${() => reshape([...drawn, {}])}></sf-button>
                    </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </span>
        </span>
    `;
}

const CELL_ERRORS = new WeakMap();

function cellErrorsOf(node, key) {
  if (!CELL_ERRORS.has(node)) CELL_ERRORS.set(node, new Map());
  const all = CELL_ERRORS.get(node);
  if (!all.has(key)) all.set(key, new Map());
  return all.get(key);
}

function renderItemsEdit(field, value, host, ctx) {
  return renderItemsTable(field, (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.rowsOf)(value), (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnsOf)(field), ctx, {
    editing: true,
    host
  });
}

function renderItemsView(field, value, ctx) {
  const rows = (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.rowsOf)(value);
  if (!rows.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  if (ctx.summary) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${itemsSummary(field, rows, (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnsOf)(field), ctx)}</span>`;
  return renderItemsTable(field, rows, (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnsOf)(field), ctx, {
    editing: false,
    host: null
  });
} // --- compound: a fixed set of parts, one value --------------------------------------
// The parts of a requisites field, in the standard's order, of those the field
// names (`parts`; all six when it names none). Each is typed as digits, the КПП
// as digits and capital letters.


const REQUISITE_LENGTH = {
  inn: 12,
  kpp: 9,
  ogrn: 15,
  bik: 9,
  account: 20,
  corr_account: 20
};

function requisiteParts(field) {
  const named = Array.isArray(field.parts) ? field.parts.map(String) : _requisites_js__WEBPACK_IMPORTED_MODULE_7__.REQUISITE_PARTS;
  return _requisites_js__WEBPACK_IMPORTED_MODULE_7__.REQUISITE_PARTS.filter(part => named.includes(part));
}

function compoundParts(field) {
  return (Array.isArray(field.parts) ? field.parts : []).map(part => part && typeof part === 'object' ? { ...part,
    propertyType: part.propertyType || part.type
  } : null).filter(part => part?.key);
}

function objectOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
} // The value written: the parts in their order, an empty part no key, and
// nothing at all when every part is empty.


function compoundValue(order, value) {
  const next = {};

  for (const part of order) {
    const one = value[part];
    if (one !== null && typeof one !== 'undefined' && one !== '') next[part] = one;
  }

  return Object.keys(next).length ? next : null;
}

function renderRequisitesEdit(field, value, host, ctx) {
  const node = ctx.node;
  const key = String(field.key ?? '');
  const parts = requisiteParts(field);
  const held = objectOf(value);
  const errors = (0,_requisites_js__WEBPACK_IMPORTED_MODULE_7__.requisiteErrors)(held, parts);

  const write = (part, text) => {
    const cleaned = part === 'kpp' ? text.replace(/\s/gu, '').toUpperCase() : text.replace(/\D/gu, '');
    const next = compoundValue(parts, { ...held,
      [part]: cleaned
    });
    const mistakes = (0,_requisites_js__WEBPACK_IMPORTED_MODULE_7__.requisiteErrors)(next ?? {}, parts); // Nothing typed in a field that is not required is no mistake.

    const blank = next === null && field.required !== true;
    host.setFieldValue(field, next);
    host.setFieldError?.(field, !blank && Object.keys(mistakes).length ? word(node, mistakes[Object.keys(mistakes)[0]]) : null);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-view-fields-compound grid gap-1 w-full min-w-0" data-compound=${key}>
            ${parts.map(part => {
    const path = `${key}.${part}`;
    const left = leftOf(node).has(path);
    const blank = Object.keys(held).length === 0 && field.required !== true;
    const message = left && !blank && errors[part] ? word(node, errors[part]) : '';
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span class="sf-view-fields-part flex flex-col gap-1/4 min-w-0 ${part === 'account' || part === 'corr_account' ? 'sf-view-fields-part--wide' : ''}" data-part=${part}>
                        <span class="sf-view-fields-part-label color-on-surface-variant">${word(node, part)}${part === 'inn' && field.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="color-error" aria-hidden="true"> *</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
                        <sf-input
                                size=${ctx.size}
                                appearance="bordered"
                                inputmode=${part === 'kpp' ? 'text' : 'numeric'}
                                maxlength=${String(REQUISITE_LENGTH[part])}
                                value=${String(held[part] ?? '')}
                                ?required=${part === 'inn' && field.required === true}
                                ?invalid=${Boolean(message)}
                                error-message=${message || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                aria-label=${`${field.label || key}: ${word(node, part)}`}
                                @input=${event => write(part, String(event.target?.value ?? ''))}
                                @change=${event => write(part, String(event.target?.value ?? ''))}
                                @focusout=${() => {
      leftOf(node).add(path);
      redraw(node);
    }}
                        ></sf-input>
                    </span>`;
  })}
        </span>
    `;
}

function requisitesText(field, value, node) {
  const held = objectOf(value);
  return requisiteParts(field).filter(part => held[part]).map(part => `${word(node, part)} ${held[part]}`).join(', ');
}

function renderRequisitesView(field, value, ctx) {
  const text = requisitesText(field, value, ctx.node);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderCompoundEdit(field, value, host, ctx) {
  const node = ctx.node;
  const key = String(field.key ?? '');
  const parts = compoundParts(field);
  const order = parts.map(part => part.key);
  const held = objectOf(value);
  const errors = cellErrorsOf(node, key);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-view-fields-compound grid gap-1 w-full min-w-0" data-compound=${key}>
            ${parts.map(part => {
    const path = `${key}.${part.key}`;
    const partField = { ...part,
      key: path,
      label: part.label || part.key,
      readonly: field.readonly === true || part.readonly === true
    };
    const partHost = {
      setFieldValue: (_target, next) => host.setFieldValue(field, compoundValue(order, { ...held,
        [part.key]: next
      })),
      setFieldError: (_target, message) => {
        errors.set(path, message || null);
        const first = [...errors.values()].find(Boolean);
        host.setFieldError?.(field, first ?? null);
      }
    };
    const partCtx = { ...ctx,
      path
    };
    const control = SET_CONTROLS[part.propertyType]?.edit(partField, held[part.key], partHost, partCtx) ?? (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__.renderEditField)(partField, held[part.key], partHost, {
      size: ctx.size
    });
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span class="sf-view-fields-part flex flex-col gap-1/4 min-w-0 ${part.width === 'full' ? 'sf-view-fields-part--wide' : ''}" data-part=${part.key}>
                        <span class="sf-view-fields-part-label color-on-surface-variant">${partField.label}${part.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="color-error" aria-hidden="true"> *</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
                        ${control ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </span>`;
  })}
        </span>
    `;
}

function renderCompoundView(field, value, ctx) {
  const held = objectOf(value);
  const shown = compoundParts(field).filter(part => held[part.key] !== null && typeof held[part.key] !== 'undefined' && held[part.key] !== '');
  if (!shown.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view sf-view-fields-compound-view">${shown.map((part, at) => {
    const own = SET_CONTROLS[part.propertyType]?.view({ ...part
    }, held[part.key], ctx);
    const content = own ?? (0,_field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__.renderViewField)({ ...part
    }, held[part.key], ctx.viewHost, {
      size: ctx.size
    }) ?? String(held[part.key]);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${at ? ', ' : ''}<span class="color-on-surface-variant">${part.label || part.key}</span> ${content}`;
  })}</span>`;
} // --- the map ---------------------------------------------------------------------


const SET_CONTROLS = {
  money: {
    edit: renderMoneyEdit,
    view: renderMoneyView
  },
  percent: {
    edit: renderPercentEdit,
    view: renderPercentView
  },
  items: {
    edit: renderItemsEdit,
    view: renderItemsView
  },
  compound: {
    edit: renderCompoundEdit,
    view: renderCompoundView
  },
  'ru.requisites': {
    edit: renderRequisitesEdit,
    view: renderRequisitesView
  }
};
/** Whether the set draws this property type itself. */

function drawsSetField(field) {
  return Object.hasOwn(SET_CONTROLS, String(field?.propertyType || field?.type || ''));
}
/**
 * A field of a type the set draws, edited or shown. `ctx` is {node, size,
 * viewHost, disabled}: the element whose page language the words follow, the
 * size on the ladder, the host's formatFieldValue, and whether a condition
 * turns the field off. A field the person may not change is shown, as the
 * Framework renderers show one.
 */

function renderSetField(field, value, editing, host, ctx) {
  const control = SET_CONTROLS[String(field.propertyType || field.type)];
  if (!control) return null;
  const formatted = !editing ? ctx.viewHost?.formatFieldValue?.(field, value) : null;
  if (typeof formatted === 'string' && formatted !== '') return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${formatted}</span>`;

  if (editing && field.readonly !== true && ctx.disabled !== true && host?.setFieldValue) {
    return control.edit(field, value, host, ctx);
  }

  return control.view(field, value, ctx);
}
/** A field's value as one line of text: «1 500,50 ₽», «2 строки, итого 2 499,99 ₽». */

function setFieldText(field, value, node) {
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);

  switch (String(field?.propertyType || field?.type || '')) {
    case 'money':
      return moneyText(field, value, locale);

    case 'percent':
      return (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.percentText)(value, locale);

    case 'items':
      {
        const rows = (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.rowsOf)(value);
        return rows.length ? itemsSummary(field, rows, (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnsOf)(field), {
          node
        }) : '';
      }

    case 'ru.requisites':
      return requisitesText(field, value, node);

    default:
      return null;
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "40b137e60526"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderPropertyViewTemplate: () => (/* binding */ renderPropertyViewTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_guard_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("fc5ce1a4b1d8");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("9e9dad7bcc09");
/* harmony import */ var _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e5483002f3ea");
/* harmony import */ var _field_value_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("62c5c417c97d");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_3__, _field_value_js__WEBPACK_IMPORTED_MODULE_4__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_3__, _field_value_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);




 // The arrangement, drawn in the component's own light DOM. Not in a shadow root:
// the field controls are Smart elements whose stylesheets are document-level, and
// a document stylesheet does not cross a shadow boundary. sf-view slots its
// children for exactly this reason and says so beside the slot; the first version
// of this composite built them inside a shadow root and every control came out
// with its markup and none of its CSS.
// While the view is being configured every entry is listed, hidden and rare ones
// included: a hidden field a person cannot see is a field they cannot show again,
// and «показать редкие поля» is a reading choice rather than part of the
// arrangement being edited.

function listed(context, entries) {
  return context.configuring ? entries ?? [] : context.visible(entries);
} // The chooser names the layers this person may write and nothing else. A layer
// they may not write is drawn disabled with the host's own reason on it rather
// than left out, because a «Для всех» that is simply absent reads as a feature
// the product does not have.
// The controls of the arranging mode live in the bar at the foot (owner,
// 2026-10-08), where saving, cancelling and deleting live when a group is being
// edited: the foot is where a mode's own answers belong, and a band of them
// under the head pushed the record down by a row it did not need.
// The arranging mode (C311 (1), (5), RC-10): over the fields a bar with the
// profile picker (C163; «Вернуть как у всех» at its foot, resettable) and one
// line that says where an edit goes; at the foot the mode's answers in the
// C157 (3) order -- «Готово» first, «Сохранить для всех» for those who may
// write the shared layer when there is something of their own to publish,
// «Отменить». The picker stood in the foot, last of four, before.


function configureHint(context) {
  if (context.viewRequired) return context.word('configureRequiredHintText');
  return context.canWriteShared ? context.word('configureAdminHintText') : context.word('configurePersonalHintText');
}

function renderConfigureTop(context) {
  if (!context.canConfigureView || !context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const writable = context.editableLayers ?? [];
  const required = context.viewRequired;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-configure-top flex items-cross-center gap-1/3 flex-wrap"
             data-configuring="true" role="group" aria-label=${context.configureText}>
            <sf-profile-picker
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    data-action="view-profile"
                    label=${context.viewProfileLabel}
                    current=${context.viewProfile ?? ''}
                    ?disabled=${required}
                    ?resettable=${!required && writable.includes('personal')}
                    .profiles=${(context.viewProfiles ?? []).map(profile => ({
    id: profile.id,
    label: profile.label,
    shared: Boolean(profile.shared),
    editable: writable.includes(profile.shared ? 'shared' : 'personal') && (!profile.shared || context.canDeleteViewProfile(profile.id))
  }))}
                    .rights=${{
    create: {
      personal: !required && writable.includes('personal'),
      shared: !required && writable.includes('shared')
    }
  }}
                    @sf-profile-picker-select=${event => context.component.selectViewProfile(event.detail.id)}
                    @sf-profile-picker-create=${event => context.component.createViewProfile(event.detail.label, {
    shared: event.detail.shared
  })}
                    @sf-profile-picker-rename=${event => context.component.renameViewProfile(event.detail.id, event.detail.label)}
                    @sf-profile-picker-delete=${event => context.component.deleteViewProfile(event.detail.id)}
                    @sf-profile-picker-reset=${() => context.component.resetView()}
            ></sf-profile-picker>
            <span class="sf-property-view-configure-hint color-on-surface-variant min-w-0">${configureHint(context)}</span>
        </div>
    `;
} // A person who cannot arrange the card chooses between the views in the same
// picker, select-only, above the fields (C311 (5), the dispatcher's call on
// RC-6): no «⋯ → Вид» submenu for anyone. Nothing is made, renamed, removed
// or reset here; one view, no picker. A required view is the only one the
// host lets anyone read (Larena c311-reply): the picker shows it, disabled.


function renderViewChooser(context) {
  const profiles = context.viewProfiles ?? [];
  if (context.canConfigureView || context.configuring || profiles.length < 2) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-configure-top flex items-cross-center gap-1/3 flex-wrap" data-chooser="true">
            <sf-profile-picker
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    data-action="view-profile"
                    label=${context.viewProfileLabel}
                    current=${context.viewProfile ?? ''}
                    ?disabled=${context.viewRequired}
                    .profiles=${profiles.map(profile => ({
    id: profile.id,
    label: profile.label,
    shared: Boolean(profile.shared),
    editable: false
  }))}
                    .rights=${{
    create: {
      personal: false,
      shared: false
    }
  }}
                    @sf-profile-picker-select=${event => context.component.selectViewProfile(event.detail.id)}
            ></sf-profile-picker>
        </div>
    `;
}

function renderConfigureBar(context) {
  if (!context.canConfigureView || !context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const required = context.viewRequired;
  const publish = context.canWriteShared && !required && context.hasPersonalEdits;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions sf-property-view-configure-bar flex items-cross-center gap-1/3 flex-wrap"
             data-configuring="true" role="group"
             aria-label=${context.configureText}>
            <sf-button
                    appearance="default"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${context.doneConfiguringText}
                    data-action="done-configuring"
                    @click=${() => context.component.stopConfiguringView()}
            ></sf-button>
            ${publish ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button
                    appearance="outline"
                    scheme="primary"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${context.word('publishViewText')}
                    data-action="publish-view"
                    @click=${() => context.component.publishView()}
            ></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <sf-button
                    appearance="ghost"
                    scheme="on-surface"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${required && context.requiredEdits ? context.word('undoMineText') : context.cancelConfiguringText}
                    data-action="cancel-configuring"
                    @click=${() => context.component.cancelConfiguringView()}
            ></sf-button>
        </div>
    `;
} // Width, template variant and hint sit behind the field's own settings rather
// than under every field at once. Drawn under each field they were four controls
// per row, so a group of eight fields was thirty-two controls and the
// arrangement -- the thing being edited -- could no longer be read.


function renderFieldSettings(context, field, key) {
  // The template (variant) is chosen once in the field (C302 (2), C311 (6),
  // RC-9): the card view no longer offers it.
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-popover placement="bottom-end" width="16rem" label=${context.fieldSettingsText}
                    data-settings-for=${key}>
            <sf-button-icon
                    slot="trigger"
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon="settings"
                    data-action="field-settings"
                    title=${context.fieldSettingsText}
                    aria-label=${context.fieldSettingsText}
            ></sf-button-icon>
            <div slot="content" class="flex flex-col gap-1 p-1">
                <label class="sf-property-view-settings-row sf-property-view-settings-row--stacked flex flex-col gap-1/4">
                    <span class="sf-property-view-settings-label color-on-surface-variant">${context.fieldLabelText}</span>
                    <sf-input
                            size="1/2"
                            appearance="bordered"
                            data-action="field-label"
                            aria-label=${context.fieldLabelText}
                            placeholder=${String(field.label ?? key)}
                            value=${String(field.label ?? '')}
                            @change=${event => context.component.setFieldView(key, {
    label: String(event.target?.value ?? '').trim() || null
  })}
                    ></sf-input>
                </label>
                <label class="sf-property-view-settings-row sf-property-view-settings-row--stacked flex flex-col gap-1/4">
                    <span class="sf-property-view-settings-label color-on-surface-variant">${context.hintText}</span>
                    <sf-input
                            size="1/2"
                            appearance="bordered"
                            data-action="hint"
                            aria-label=${context.hintText}
                            placeholder=${context.hintText}
                            value=${String(field.hint ?? '')}
                            @change=${event => context.component.setFieldView(key, {
    hint: event.target?.value ?? ''
  })}
                    ></sf-input>
                </label>
                <label class="sf-property-view-settings-row flex items-cross-center justify-between gap-1">
                    <span class="sf-property-view-settings-label color-on-surface-variant">${context.widthText}</span>
                    <sf-switch
                            size="1/2"
                            data-action="width"
                            ?checked=${field.width === 'full'}
                            @change=${event => context.component.setFieldView(key, {
    width: event.target?.checked ? 'full' : 'half'
  })}
                    ></sf-switch>
                </label>
            </div>
        </sf-popover>
    `;
} // The two controls a field carries while the view is arranged: taking it out of
// this area and where everything else about it lives. They sit at the end of the
// field, on the ladder the rest of the panel uses.
//
// None of them is red (owner, 2026-10-08). Red is the record's own delete, in
// the bar at the foot; a mode whose rows each carry a red mark reads as a list
// of warnings, and taking a field out of an area is an ordinary act of
// arranging that the «+» beside it undoes.
//
// Taking out rather than hiding (owner, 2026-10-07): a field removed here joins
// the unplaced, where the list behind the «+» offers it back, so removing is
// visible and undoable in the same place. Hiding is still what the port carries
// and what a shared layer does to a field for everyone -- a field hidden above
// this layer is drawn with its reason and cannot be taken out from here.


function renderFieldActions(context, field, key, {
  hidden = false
} = {}) {
  const locked = !context.canChangeVisibility(field);
  const name = String(field.label ?? key);
  const marked = context.isLocked(`fields.${key}.hidden`);
  const menu = context.fieldMenuEntries(key).length > 0; // A field a layer hid in its area (hidden: true) is shown again by the
  // same eye; one in «Скрытые поля» goes back to the open tab.

  const off = hidden || field.hidden === true;

  const show = () => hidden ? context.component.showHiddenField(key) : context.component.toggleEntryHidden('field', key); // One way to not show a field (C106 (1), C311 (5), RC-7): the eye moves it
  // to «Скрытые поля» and back. It was a cross «Убрать из области».


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-field-actions flex items-cross-center gap-1/4">
            ${marked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-property-view-lock color-on-surface-variant" role="img"
                    data-lock=${`fields.${key}.hidden`}
                    aria-label=${context.word('lockedText')} title=${context.word('lockedText')}>lock</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon=${off ? 'visibility_off' : 'visibility'}
                    data-action=${off ? 'show-field' : 'remove-field'}
                    ?disabled=${locked}
                    title=${locked ? marked ? context.word('lockedText') : context.layerDenied('shared') || context.hiddenText : context.word(off ? 'showFieldText' : 'hideFieldText').replace('{name}', name)}
                    aria-label=${context.word(off ? 'showFieldText' : 'hideFieldText').replace('{name}', name)}
                    @click=${() => off ? show() : context.component.moveFieldToUnplaced(key)}
            ></sf-button-icon>
            ${renderFieldSettings(context, field, key)}
            ${menu ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon="more_horiz"
                    data-action="field-menu"
                    aria-haspopup="menu"
                    aria-label=${context.word('fieldMenuText').replace('{name}', name)}
                    @click=${event => context.component.openFieldMenu(event.currentTarget.querySelector('button') ?? event.currentTarget, key)}
            ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // A name that can be changed, where it stands. In the arranging mode the title
// is the control: pressing it, or the pencil beside it, turns it into a field
// with a tick and a cross -- the two answers a person has to a name they are
// typing. Nothing is written until the tick, so an area keeps its name while
// somebody is still deciding on another.


function renderEntryName(context, kind, key, label, titleClass) {
  const renaming = context.renaming?.kind === kind && context.renaming?.key === String(key);

  if (!context.configuring) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<h3 class=${titleClass}>${label}</h3>`;
  }

  if (!renaming) {
    // The pencil stands right after the name rather than at the end of the
    // row: at the end it read as another of the area's controls, and what
    // it edits is the name beside it (owner, 2026-10-08). The name takes
    // only the room it needs, and the space that was taken from it goes to
    // the spacer, which keeps the controls at the end of the row.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <h3 class=${titleClass}>
                <button type="button" class="sf-property-view-rename-trigger text-start cursor-pointer"
                        data-action="rename"
                        title=${context.renameText}
                        @click=${() => context.component.startRenaming(kind, key)}
                >${label}</button>
            </h3>
            <sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon="edit"
                    data-action="rename"
                    title=${context.renameText}
                    aria-label=${context.renameText}
                    @click=${() => context.component.startRenaming(kind, key)}
            ></sf-button-icon>
            <span class="grow"></span>
        `;
  }

  const commit = event => {
    const input = event.target?.closest?.('.sf-property-view-rename')?.querySelector('sf-input');
    context.component.renameEntry(kind, key, input?.value ?? label);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-property-view-rename flex items-cross-center gap-1/4 grow min-w-0">
            <sf-input
                    size="1/2"
                    appearance="bordered"
                    autofocus
                    root-class="flex-auto min-w-0"
                    data-action="rename-input"
                    aria-label=${context.renameText}
                    value=${label}
                    @keydown=${event => {
    if (event.key === 'Enter') commit(event); // Escape here leaves the naming row and nothing else: the
    // layer stack passes over a press a control took.

    if (event.key === 'Escape') {
      event.preventDefault();
      context.component.cancelRenaming();
    }
  }}
            ></sf-input>
            <sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface"
                    icon="check"
                    data-action="rename-save"
                    title=${context.saveNameText}
                    aria-label=${context.saveNameText}
                    @click=${commit}
            ></sf-button-icon>
            <sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface"
                    icon="close"
                    data-action="rename-cancel"
                    title=${context.cancelNameText}
                    aria-label=${context.cancelNameText}
                    @click=${() => context.component.cancelRenaming()}
            ></sf-button-icon>
        </span>
    `;
} // A value is a way in. Reading a record and changing it are the same screen in the
// mockup: a person presses the value and its group opens for editing, with a pen
// showing that it can be. Only a readonly field, a field already being edited and
// a field being arranged are not buttons -- each already means something else.
// What a press inside a field's value may land on that acts on its own.


const INNER_CONTROL = 'a[href], button, input, select, textarea, [role="button"], [role="link"]'; // A field read (C289 (4), C180 (3)): a row of sf-list-description's parts --
// the label in the list's label column, the value beside it from a list of
// 22rem, over it in a narrower list and on a phone. The list's sheet draws the
// row on one rung of the ladder (a one-line row is the rung's control height,
// 40 at size 1), so a property takes a row, not a card's 84 px. The value is
// the field renderers' as before; a value that opens its group for editing is
// a button of the line's height, 24 at the least (VW-7, §8.9).

function renderReadRow(context, field, sectionKey, groupKey) {
  if (field.when) field = context.conditionedField(field);
  const key = String(field.key ?? '');
  const error = context.controlErrors?.has(key) ? null : context.errors.get(key);
  const opens = !(field.readonly === true || !context.mayEdit || context.openAll);
  const quick = opens && context.quickEdit && context.isQuickField(field);
  const current = context.quick?.key === key;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-list-description-row sf-property-view-field sf-property-view-row" data-field=${key}
             data-current=${current ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             data-saved=${context.savedKeys?.has(key) ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <dt class="sf-list-description-label sf-property-view-field-label" id=${`sf-property-view-label-${context.recordId || 'record'}-${key}`}>${String(field.label ?? key)}${field.hint ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark class="sf-list-description-help sf-property-view-hint" size=${context.size === '1/2' ? '1/3' : '1/2'}
                                         label=${String(field.hint)} text=${String(field.hint)}></sf-help-mark>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${field.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${field.inherited ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <span class="sf-property-view-inherited color-on-surface-variant">${context.inheritedText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</dt>
            <dd class="sf-list-description-value">
                <span class="sf-list-description-line">
                    ${quick ? renderQuickValue(context, field, sectionKey, groupKey) : opens ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
                                    type="button"
                                    class="sf-property-view-field-value sf-property-view-field-open min-w-0 text-start cursor-pointer"
                                    data-open-group=${groupKey}
                                    title=${context.editText}
                                    @click=${event => {
    const path = event.composedPath();
    const inner = path.slice(0, Math.max(0, path.indexOf(event.currentTarget)));
    if (inner.some(node => node.matches?.(INNER_CONTROL))) return; // A long field's value opens its group with the
    // focus on it (C305 (1), VP-21).

    context.component.editGroup(sectionKey, groupKey, {
      focus: key
    });
  }}
                            >${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, false)}<i class="sf-icon sf-icon--size-1/2 sf-property-view-pen" aria-hidden="true">edit</i></button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-field-value min-w-0">${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, false)}</span>`}
                </span>
                ${error && !current ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-field-error color-error" role="alert">${error}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </dd>
        </div>
    `;
} // A short field edited in a window at its value (C305 (1), as the table's
// cell, C296): sf-popover with the value as its trigger, the field's own
// control, Save first and a quiet Cancel. One value per save -- group.save of
// the field's group with that value, the same revision and confirmation.


function renderQuickValue(context, field, sectionKey, groupKey) {
  const key = String(field.key ?? '');
  const open = context.quick?.key === key;
  const error = open ? context.errors.get(key) ?? context.conflict ?? null : null;
  const label = String(field.label ?? key);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-popover class="sf-property-view-quick" placement="bottom-start" width="18rem"
            label=${label}
            data-quick-pop=${key}
            ?unsaved=${open && context.changed.has(key)}
            @sf-popover-open=${event => {
    if (event.target !== event.currentTarget) return;
    if (!context.component.startQuick(sectionKey, groupKey, key)) event.preventDefault?.();
  }}
            @sf-popover-close=${event => {
    if (event.target !== event.currentTarget) return;
    context.component.endQuick(key);
  }}>
        <button slot="trigger" type="button"
                class="sf-property-view-field-value sf-property-view-field-open sf-property-view-quick-value min-w-0 text-start cursor-pointer"
                data-quick=${key}
                aria-haspopup="dialog"
                aria-label=${`${label}: ${context.editText}`}
        >${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, false)}<i class="sf-icon sf-icon--size-1/2 sf-property-view-pen" aria-hidden="true">edit</i></button>
        <div slot="content" class="sf-property-view-quick-editor" data-quick-editor=${key}
             @keydown=${event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.target?.localName !== 'textarea' && !event.defaultPrevented && !event.target?.closest?.('[role="listbox"], [role="menu"], .sf-datepicker')) {
      event.preventDefault();
      context.component.saveQuick();
    }
  }}>
            <span class="sf-property-view-quick-label">${label}</span>
            ${open ? (0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, true) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${error ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-field-error color-error" role="alert">${error}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${open && context.confirmation ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-confirm
                    appearance="inline"
                    size="1/2"
                    question=${context.confirmation.text}
                    confirm-id="save"
                    accept-text=${context.confirmSaveText}
                    decline-text=${context.keepEditingText}
                    @sf-confirm-answer=${event => {
    event.preventDefault?.();
    if (event.detail?.accepted) context.component.confirmSave();else context.component.cancelConfirmation();
  }}
            ></sf-confirm>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-quick-actions">
                <sf-button size="1/2" text=${context.saveText} data-action="quick-save"
                           @click=${() => context.component.saveQuick()}></sf-button>
                <sf-button size="1/2" appearance="ghost" scheme="on-surface" text=${context.cancelText} data-action="quick-cancel"
                           @click=${() => context.component.cancelEdit()}></sf-button>
            </div>`}
        </div>
    </sf-popover>`;
}

function renderField(context, field, editing, sectionKey = '', groupKey = '') {
  // A field as its conditions make it now (port 1.14.0): required or not,
  // enabled or drawn disabled as a readonly field is. Not while the view is
  // arranged: arranging places fields, it does not fill them in.
  const disabled = !context.configuring && Boolean(field.when) && context.fieldDisabled(field);
  if (!context.configuring && field.when) field = context.conditionedField(field);
  const key = String(field.key ?? ''); // A message the field's own control draws under itself (port 1.16.0: an
  // incomplete masked string) is not drawn a second time here; it still
  // counts among the errors beside Save, and still holds the save.

  const error = context.controlErrors?.has(key) ? null : context.errors.get(key);
  const arrangementError = context.configuring ? context.entryError('field', key) : null;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-field flex flex-col gap-1 min-w-0 ${field.width === 'full' ? 'sf-property-view-field--full' : ''}"
             data-field=${key}
             data-sf-sortable-item=${context.configuring ? key : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             data-arranging=${context.configuring ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             data-hidden=${context.configuring && field.hidden ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle
                              aria-hidden="true">drag_indicator</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <!-- Reading: the label is quieter than its value. Editing: a form
                 field's label, in the text colour with its «*» (C153 (1), (2)). -->
            <div class="sf-property-view-field-label flex items-cross-center gap-1/3 ${editing ? 'color-on-surface' : 'color-on-surface-variant'}">
                ${String(field.label ?? key)}
                ${field.required && editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-required" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${field.hint // The hint is the Framework's own affordance for a hint,
  // sf-help-mark: a button that opens a short explanation on
  // a press, by touch, by pointer and by keyboard alike, and
  // announces it politely. It was a glyph carrying the words
  // in a native `title`, which needs a hover -- so on a touch
  // device the hint could not be read at all (Larena storage
  // QA, 2026-10-22). The accessible name stays the hint
  // itself, as it was on the glyph's aria-label: `label` names
  // the button, `text` is the explanation it opens.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark class="sf-property-view-hint"
                                             label=${String(field.hint)}
                                             text=${String(field.hint)}></sf-help-mark>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${field.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${field.inherited && !editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-inherited color-on-surface-variant">${context.inheritedText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            ${editing || context.configuring || field.readonly === true || !context.mayEdit || context.openAll ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-field-value min-w-0 flex items-cross-center gap-2 flex-wrap">${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, editing, {
    disabled
  })}</div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <button
                                type="button"
                                class="sf-property-view-field-value sf-property-view-field-open min-w-0 flex items-cross-center gap-1 text-start cursor-pointer"
                                data-open-group=${groupKey}
                                title=${context.editText}
                                @click=${event => {
    // A control inside the value -- a file's download
    // button, a URL, an address -- does its own thing
    // and nothing more: downloading a stored file also
    // opened the group for editing (simai.main,
    // 2026-10-28). sf-file-preview's download is a
    // button, not a link, so every control between the
    // press and this button counts.
    const path = event.composedPath();
    const inner = path.slice(0, Math.max(0, path.indexOf(event.currentTarget)));
    if (inner.some(node => node.matches?.(INNER_CONTROL))) return;
    context.component.editGroup(sectionKey, groupKey);
  }}
                        >
                            ${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, editing)}
                            <i class="sf-icon sf-icon--size-1/2 sf-property-view-pen" aria-hidden="true">edit</i>
                        </button>`}
            ${context.configuring ? renderFieldActions(context, field, key) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${error || arrangementError ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-field-error color-error" role="alert">${error || arrangementError}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // A group of related records: the component composes a data view in it and the
// view asks the host for its own port. The records never come through the
// property-view seam -- rows, columns, sorting and paging are the data-view
// port's vocabulary, and relaying them through this one would duplicate all of it.
//
// `chrome=""` leaves out the search box and the page row: the list stands inside a
// group that already has a heading, and a page row under four rows of a capped
// list would offer paging through records the cap is not showing anyway.
//
// The table is slotted in, which is how a data view is composed -- its own page
// markup slots one too. An earlier version left it out and relied on the fallback
// inside the data view's content slot instead, to satisfy a fence that said a
// component rendering another one has to fetch it. That traded one defect for a
// worse one: fallback content lives in the shadow tree, where the Framework's
// page-level stylesheets do not reach, so a consumer got a list whose sort buttons
// read «unfold_more» as text and whose reference cells read «arrow_forward». The
// fence was right and the clever fix was wrong: this component does render a table,
// so it fetches cl-view-table.


function renderRelatedList(context, group, groupKey) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-view
                class="sf-property-view-related"
                chrome=""
                row-cap=${String(group.rowCap ?? 5)}
                port-owner="property-view"
                port-record=${context.recordId || ''}
                port-group=${groupKey}
                aria-label=${String(group.label ?? groupKey)}
        >
            <sf-view-table
                    slot="content"
                    toolbar="false"
                    aria-label=${String(group.label ?? groupKey)}
            ></sf-view-table>
        </sf-view>
    `;
} // Placing a field in this group without dragging it. Dragging is the gesture the
// mockup asks for and it stays, but it is a poor way to reach a field that is
// three screens away, and no way at all without a pointer -- and a collection
// can have hundreds of fields, which no list anybody scrolls will answer.
//
// So: a search and a set of ticks. What is ticked is what this area shows, which
// makes unticking the way a field leaves it, and each row says where the field
// is now, because a field lives in one place and taking it here takes it from
// there. The surface is anchored by hand because sf-dropdown brings its own
// trigger and the trigger here is the «+».


function renderAddField(context, groupKey) {
  const options = context.fieldChoices(groupKey).map(option => ({
    type: 'checkbox',
    size: '1/2',
    text: option.label,
    value: option.key,
    group: option.group,
    selected: option.selected,
    checked: option.selected,
    ariaLabel: option.label
  }));
  const placed = options.filter(option => option.selected).map(option => option.value); // The list is sf-dropdown's: it carries the search, the groups, the
  // multiple selection and the surface, and takes the «+» as its trigger.
  // What is acted on is the option the change names, not the whole value the
  // dropdown now holds: the component moves a field rather than setting a
  // list, and reading the whole list as the new truth once took five fields
  // out of an area because one was ticked.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                class="sf-property-view-add"
                size="1/2"
                multiple
                search="true"
                search-placeholder=${context.addFieldText}
                aria-label=${context.addFieldText}
                data-add-for=${groupKey}
                value=${placed.join(',')}
                .options=${options}
                @change=${event => {
    const key = String(event.detail?.value ?? '');
    if (!key) return;
    const values = Array.isArray(event.detail?.values) ? event.detail.values.map(String) : [];
    context.component.toggleFieldInGroup(key, groupKey, values.includes(key));
  }}
        >
            <sf-button-icon
                    slot="trigger"
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon="add"
                    data-action="add-field"
                    title=${context.addFieldText}
                    aria-label=${context.addFieldText}
            ></sf-button-icon>
        </sf-dropdown>
    `;
}

function renderGroup(context, section, group) {
  const groupKey = String(group.key ?? ''); // On a surface open all at once (edit, create) every group is open; a
  // group the host keeps closed stays shown.

  const editing = context.openAll && group.kind !== 'related' && group.editable !== false || context.editing?.group === groupKey && context.editing?.section === String(section.key ?? '');
  const fields = listed(context, group.fields);
  const configuring = context.configuring;
  const groupError = configuring ? context.entryError('group', groupKey) : null;
  const groupLocked = configuring && !context.canChangeVisibility(group); // The field list is a sortable list and nothing more: the drop is reported by
  // sf-sortable and applied or refused by the component, which is the seam that
  // mechanism already publishes. Its id carries the kind and the container, so
  // one listener can tell a field dropped into a group from a group dropped into
  // a section.
  // A group read by itself (port 1.15.0, group-load) and not read yet holds
  // no fields but says how many: it is drawn as that many skeleton lines, and
  // busy, until its read answers -- never as an empty group.

  const waiting = !Array.isArray(group.fields) || group.fields.length === 0 ? Number.isInteger(group.field_count) && group.field_count > 0 ? group.field_count : 0 : 0;
  const reading = waiting > 0 || Boolean(context.component.isGroupReading?.(groupKey)); // A group the host names '' has no head of its own (a record of one group,
  // a property shown alone): an empty heading took a row (36 px read, 29 px
  // edited) and named nothing to a screen reader. Its «Изменить», the rare
  // mark and the arranging tools still bring the head back.

  const titled = String(group.label ?? groupKey) !== '' || Boolean(group.rare);
  const readEdit = context.mayEdit && !context.openAll && group.editable !== false;
  const cardEdit = !configuring && !editing && context.mayEdit && !context.openAll && group.kind !== 'related' && group.editable !== false; // Read, the group is a section of the record's description list: its name
  // a list section heading with «Изменить» as its action, its fields rows of
  // the list (C289 (4)). Edited, arranged or holding related records it stays
  // the card it was.

  if (!editing && !configuring && group.kind !== 'related') {
    const readRows = waiting > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${Array.from({
      length: waiting
    }, (_, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-description-row sf-property-view-row" aria-hidden="true"><dt class="sf-list-description-label"><div class="sf-skeleton sf-skeleton--animation-pulse"><div class="sf-skeleton-text sf-skeleton-text--size-1 w-2/3"></div></div></dt><dd class="sf-list-description-value"><div class="sf-skeleton sf-skeleton--animation-pulse"><div class="sf-skeleton-text sf-skeleton-text--size-1 ${SKELETON_WIDTHS[at % SKELETON_WIDTHS.length]}"></div></div></dd></div>`)}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${fields.map(field => renderReadRow(context, field, String(section.key ?? ''), groupKey))}`;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <section class="sf-property-view-group sf-property-view-group--list" data-group=${groupKey} aria-busy=${reading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
                ${titled || readEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-description-head sf-property-view-group-header">
                    <div class="sf-list-description-title sf-property-view-group-title" role="heading" aria-level="3">${String(group.label ?? groupKey)}${group.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>
                    ${readEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-description-action"><sf-button
                                    appearance="ghost"
                                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    text=${context.editText}
                                    data-action="edit"
                                    @click=${() => context.component.editGroup(String(section.key ?? ''), groupKey)}
                            ></sf-button></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${fields.length || waiting ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<dl class="sf-list-description-part sf-property-view-group-fields" aria-label=${String(group.label ?? groupKey)}>${readRows}</dl>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </section>
        `;
  } // Edited by sf-form (C182, C305 (1); VP-19, VP-27): the label above in a
  // panel, beside on the full screen; «Сохранить» first, a quiet «Отмена»;
  // every field the group's whole width. The form's value and fields are
  // the edit's own (formEdit), so a render of the card never resets it.


  const form = context.formEdit;

  if (editing && !configuring && form && form.group === groupKey && form.section === String(section.key ?? '')) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <section class="sf-property-view-group sf-property-view-group--editing sf-property-view-group--form" data-group=${groupKey}>
                ${titled ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<header class="sf-property-view-group-header flex items-cross-center justify-between gap-2">
                    <div class="sf-property-view-group-title" role="heading" aria-level="3">${String(group.label ?? groupKey)}</div>
                </header>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                <sf-form class="sf-property-view-form"
                         label=${String(group.label ?? groupKey)}
                         labels=${context.sectionsLayout === 'column' ? 'start' : 'top'}
                         footer=${context.panel || context.sectionsLayout === 'phone' ? 'sticky' : 'static'}
                         .fields=${(0,lit_directives_guard_js__WEBPACK_IMPORTED_MODULE_1__.guard)([form], () => form.fields)}
                         .value=${(0,lit_directives_guard_js__WEBPACK_IMPORTED_MODULE_1__.guard)([form], () => form.value)}
                         @sf-form-submit=${event => context.component.submitForm(event)}
                         @sf-form-cancel=${() => context.component.cancelEdit()}
                         @sf-form-input=${event => {
      const at = context.component.fieldAt(event.detail?.key);
      if (at) context.component.changeField(at.field, event.detail?.value);
    }}
                ></sf-form>
            </section>`;
  }

  const rows = waiting > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${Array.from({
    length: waiting
  }, (_, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-skeleton sf-skeleton--animation-pulse" aria-hidden="true">
            <div class="sf-skeleton-text sf-skeleton-text--size-1 ${SKELETON_WIDTHS[at % SKELETON_WIDTHS.length]}"></div></div>`)}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${fields.map(field => renderField(context, field, editing, String(section.key ?? ''), groupKey))}`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section class="sf-property-view-group bg-surface-page flex flex-col gap-2 ${editing ? 'sf-property-view-group--editing' : ''} ${group.kind === 'related' && !editing && !configuring ? 'sf-property-view-group--related' : ''}"
                 data-group=${groupKey}
                 aria-busy=${reading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-sf-sortable-item=${configuring ? groupKey : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-hidden=${configuring && group.hidden ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-columns=${group.columns === 2 ? '2' : '1'}>
            ${titled || configuring || cardEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<header class="sf-property-view-group-header flex items-cross-center justify-between gap-2">
                ${configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle
                                  aria-hidden="true">drag_indicator</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${renderEntryName(context, 'group', groupKey, String(group.label ?? groupKey), 'sf-property-view-group-title')}
                ${group.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <span class="flex items-cross-center gap-1/4">
                            ${renderAddField(context, groupKey)}
                            <sf-button-icon
                                    size="1/2"
                                    appearance="ghost"
                                    scheme="on-surface-variant"
                                    icon="keyboard_arrow_up"
                                    data-action="group-up"
                                    ?disabled=${context.groupAt(groupKey) === 0}
                                    title=${context.moveUpText}
                                    aria-label=${context.moveUpText}
                                    @click=${() => context.component.moveGroupBy(groupKey, -1)}
                            ></sf-button-icon>
                            <sf-button-icon
                                    size="1/2"
                                    appearance="ghost"
                                    scheme="on-surface-variant"
                                    icon="keyboard_arrow_down"
                                    data-action="group-down"
                                    ?disabled=${context.groupAt(groupKey) === context.groupCount - 1}
                                    title=${context.moveDownText}
                                    aria-label=${context.moveDownText}
                                    @click=${() => context.component.moveGroupBy(groupKey, 1)}
                            ></sf-button-icon>
                            <sf-button-icon
                                    size="1/2"
                                    appearance="ghost"
                                    scheme="on-surface-variant"
                                    icon=${group.hidden ? 'visibility_off' : 'delete'}
                                    data-action="remove-group"
                                    ?disabled=${groupLocked}
                                    title=${groupLocked ? context.layerDenied('shared') || context.hiddenText : context.removeGroupText}
                                    aria-label=${context.removeGroupText}
                                    @click=${() => context.component.removeGroup(groupKey)}
                            ></sf-button-icon>
                            </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${cardEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-button
                                    appearance="ghost"
                                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    text=${context.editText}
                                    data-action="edit"
                                    @click=${() => context.component.editGroup(String(section.key ?? ''), groupKey)}
                            ></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </header>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${groupError ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-group-error" role="alert">${groupError}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${group.kind === 'related' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-group-related">${renderRelatedList(context, group, groupKey)}</div>` : configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <sf-sortable
                                        class="sf-property-view-group-fields min-w-0"
                                        group="field"
                                        accepts="field"
                                        id=${`field:${groupKey}`}
                                        label=${String(group.label ?? groupKey)}
                                >${rows}</sf-sortable>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-group-fields min-w-0">${rows}</div>`}
        </section>
    `;
} // The phone's first screen: the sections as a list, each one leading to its own
// screen. Drawn only when there is more than one, for the same reason the desktop
// list is: a list of one is a control nobody can use, and it would put a screen
// between a person and the only groups there are.


function renderPhoneSectionList(context, sections) {
  // The rows are sf-list's (C289 (5), C148 (4)): a section opens as a level
  // of the panel, «←» in its head (C157 (6)).
  const items = sections.map(section => ({
    id: String(section.key),
    text: String(section.label ?? section.key),
    ...(section.icon ? {
      icon: String(section.icon)
    } : {})
  }));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-list
                class="sf-property-view-phone-sections"
                label=${context.sectionsLabel}
                size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                divided
                .items=${items}
                @sf-list-open=${event => {
    const id = event.detail?.id;
    if (id !== undefined && id !== null) context.component.openPhoneSection(String(id));
  }}
        ></sf-list>
    `;
} // The second screen's head: back to the list, and the name of where you are.


function renderPhoneSectionHead(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-phone-head flex items-cross-center gap-2">
            <sf-button-icon
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    appearance="ghost"
                    icon="arrow_back"
                    data-action="phone-back"
                    aria-label=${context.backLabel}
                    @click=${() => context.component.closePhoneSection()}
            ></sf-button-icon>
            <h2 class="sf-property-view-phone-title">${context.phoneSectionLabel}</h2>
        </div>
    `;
}

function renderSectionList(context, sections) {
  // One section is drawn as its groups alone: a list of one is a control nobody
  // can use, and the consumer's request asks for the groups to stand alone.
  if (sections.length < 2 && !context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Reading, the column holds one tablist, which is named itself; a landmark
  // around it would name the same list twice and call a set of panels a
  // navigation. Arranged, the column is this component's own rows.

  if (!context.configuring) {
    // C305 (3): the column is sf-menu (the C96 (5) menu column) until the
    // pair's sf-tabs judges a lone tab column by its wrapper (VP-26,
    // sf-tabs 1.4.4): this pair's vertical tabs fold any column under
    // 48rem into the line with «Ещё (n)», full screen at 1440 too.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class="sf-property-view-sections self-cross-stretch flex flex-col min-w-0">
                ${context.sectionColumnTabs ? renderSectionVerticalTabs(context, sections) : renderSectionMenu(context, sections)}
            </div>
        `;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <nav class="sf-property-view-sections self-cross-stretch flex flex-col min-w-0" aria-label=${context.sectionsLabel}>
            ${renderSectionTabsArranged(context, sections)}
            <div class="sf-property-view-additions flex">${renderAddSection(context)}</div>
        </nav>
    `;
} // Reading: the sections are vertical tabs (decision C96 point 5). They switch
// which of the record's parts is shown, in place -- a tablist with one selected
// tab, the same thing the row of tabs above the groups is. A tree said "one
// level of a hierarchy" and drew a folder beside a section without an icon of
// its own; a menu column (C30) is for places with their own addresses, and a
// section is not one.
//
// The items are given as data (the property), not as the `|` string the row
// uses: a section's icon travels as the entry's icon (sf-tabs reads a list as
// `{id, label, icon}` entries, released since sf-tabs 1.1.16), and a label is
// read as text, so neither `|` nor `::` in a name is taken as structure.
// `selected` names the tab by the section key, so a section added or removed
// before the selected one keeps the selection on the right tab.


function renderSectionVerticalTabs(context, sections) {
  const items = sections.map(section => ({
    id: String(section.key),
    label: sectionName(context, section),
    ...(section.icon ? {
      icon: String(section.icon)
    } : {})
  }));
  const selected = sections.some(section => String(section.key) === context.selectedSection) ? context.selectedSection : String(sections[0]?.key ?? '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-tabs
                class="sf-property-view-section-list"
                type="vertical"
                size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                selected=${selected}
                aria-label=${context.sectionsLabel}
                .items=${items}
                @sf-tabs-change=${event => {
    // sf-tabs (standard 1.3.8 §8): change carries the entry's id,
    // which is the section key.
    const id = event.detail?.selected ?? sections[Number(event.detail?.current)]?.key;
    if (id !== undefined && id !== null && id !== '') context.component.selectSection(String(id));
  }}
        ></sf-tabs>
    `;
}

function renderSectionMenu(context, sections) {
  const selected = sections.some(section => String(section.key) === context.selectedSection) ? context.selectedSection : String(sections[0]?.key ?? '');
  const items = sections.map(section => ({
    id: String(section.key),
    label: sectionName(context, section),
    href: `#${String(section.key)}`,
    current: String(section.key) === selected,
    ...(section.icon ? {
      icon: String(section.icon)
    } : {})
  }));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-menu class="sf-property-view-section-list sf-property-view-section-menu"
                 label=${context.sectionsLabel}
                 .items=${items}
                 @sf-menu-navigate=${event => {
    event.preventDefault();
    const id = event.detail?.id ?? String(event.detail?.href ?? '').replace(/^#/u, '');
    if (id !== undefined && id !== null && id !== '') context.component.selectSection(String(id));
  }}
        ></sf-menu>
    `;
} // Arranging: the same tabs, in an order a drag can change, and each one still a
// place to drop a field or an area. Tabs cannot be reordered by a pointer --
// sf-tabs owns its tab buttons -- so while the view is arranged
// the tabs are rows of this component's own, which is also what lets a tab carry
// a handle.


function renderSectionTabsArranged(context, sections) {
  // «Вкладки» (C311 (4), TB-1): the tabs as a list with handles over the
  // fields (a column beside them on the full screen); each row selects its
  // tab, says when it is hidden or locked, and has one «⋯» with the name,
  // the icon, up and down, hide, delete and the admin's lock.
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-tabs-head flex flex-col">
            <span class="sf-property-view-tabs-title">${context.word('tabsTitle')}</span>
            <span class="sf-property-view-tabs-hint color-on-surface-variant">${context.word('tabsHintText')}</span>
        </div>
        <sf-sortable
                class="sf-property-view-section-tabs flex flex-col"
                group="section"
                accepts="section"
                id="section:all"
                label=${context.word('tabsTitle')}
        >
            ${sections.map(section => {
    const key = String(section.key);
    const locked = context.isLocked(`sections.${key}`);
    const mine = !context.lockedForMe(`sections.${key}`);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-property-view-section-tab flex items-cross-center gap-1/3 min-w-0"
                     data-section-tab=${key}
                     data-sf-sortable-item=${key}
                     data-hidden=${section.hidden ? 'true' : 'false'}
                     aria-current=${key === context.selectedSection ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
                    <i class="sf-icon sf-property-view-section-grip color-on-surface-variant" data-sf-sortable-handle
                       aria-hidden="true">drag_indicator</i>
                    <button type="button"
                            class="sf-property-view-section-tab-select flex items-cross-center gap-1/3 flex-auto min-w-0 text-start cursor-pointer"
                            data-action="select-tab"
                            aria-pressed=${key === context.selectedSection ? 'true' : 'false'}
                            @click=${() => context.component.selectSection(key)}>
                        ${section.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${String(section.icon)}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        <span class="sf-property-view-section-tab-label flex-auto min-w-0">${sectionName(context, section)}</span>
                    </button>
                    ${locked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-property-view-lock color-on-surface-variant" role="img" data-lock=${`sections.${key}`}
                            aria-label=${context.word('lockedText')} title=${context.word('lockedText')}>lock</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${section.hidden ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon color-on-surface-variant" role="img"
                            aria-label=${context.word('tabHiddenText')} title=${context.word('tabHiddenText')}>visibility_off</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    <sf-button-icon
                            size="1/2"
                            appearance="ghost"
                            scheme="on-surface-variant"
                            icon="more_horiz"
                            data-action="tab-menu"
                            aria-haspopup="menu"
                            ?disabled=${!mine && !context.canWriteShared}
                            aria-label=${context.word('tabMenuText').replace('{name}', String(section.label ?? key))}
                            @click=${event => context.component.openTabMenu(event.currentTarget.querySelector('button') ?? event.currentTarget, key)}
                    ></sf-button-icon>
                </div>`;
  })}
        </sf-sortable>
    `;
} // A rare section says so in its own name. A tab takes a label string and draws
// it as text, so a trailing mark of its own is a gap in that component rather
// than something to work around here.


function sectionName(context, section) {
  const label = String(section.label ?? section.key);
  return section.rare ? `${label} · ${context.rareText}` : label;
} // The bar at the foot of the panel: what is being done to the record right now,
// and what can be done to the record itself. Arranging the view is neither, so
// while the view is being arranged there is no bar -- its own band carries that
// mode's actions, and two bars at once was the state the owner saw.
//
// The count of changed fields is gone. It named a number nobody acts on, while
// the two controls that matter stood after it; what is still said is what stops
// a save -- errors and a conflict.
// Sections as a row of tabs rather than a list beside the fields. The same
// sections either way -- what changes is where they are read, not what they are
// -- so a section is still selected the same way and a group still moves to one
// by being dropped on it.
// sf-tabs reads its set from an attribute, through a parser that splits on `|`
// and reads `::` as flags; it has no declarative way to take richer items, so a
// section's icon cannot travel with it here. A label carrying either sequence
// would be read as structure, so it is spelled out of the way.


function tabLabel(context, section) {
  return sectionName(context, section).replace(/\|/gu, '\u2502').replace(/::/gu, ':\u2236');
} // The tab row only. The groups are drawn under it by the layout, as they are
// beside the list, so a section's content is in one place whichever way the
// sections are read. Slotting empty panels in here drew empty tabs: a slot for
// a tab replaces its label.


function renderSectionTabs(context, sections) {
  const at = Math.max(0, sections.findIndex(section => String(section.key) === context.selectedSection));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-tabs
                class="sf-property-view-tabs"
                type="underline"
                overflow="more"
                ?sticky=${context.panel}
                size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                active-index=${String(at)}
                aria-label=${context.sectionsLabel}
                items=${sections.map(section => tabLabel(context, section)).join('|')}
                @sf-tabs-change=${event => {
    const section = sections[Number(event.detail?.current)];
    if (section) context.component.selectSection(String(section.key));
  }}
        ></sf-tabs>
    `;
} // The type of a view at 1/2: a step down from 1 in every role, so the record
// reads at the table's size. Variables rather than a class: the panel is drawn
// in a drawer moved to the page's end, outside the element. The title is rung 2,
// one below the full title's rung 3, read from the text ladder: the heading-5
// role it took is a content heading, which the heading ladder (C21) moves to
// rung 1, the size of the fields under it.


function sizeStyle(context) {
  if (context.size !== '1/2') return '';
  return ' --sf-property-view--title-size: var(--sf-text--size-2); --sf-property-view--title-height: var(--sf-title--height-2);' + ' --sf-property-view--group-size: var(--sf-text-medium--size); --sf-property-view--group-height: var(--sf-text-medium--height);' + ' --sf-property-view--label-size: var(--sf-label-medium--size); --sf-property-view--label-height: var(--sf-label-medium--height);' + ' --sf-property-view--value-size: var(--sf-text-small--size); --sf-property-view--value-height: var(--sf-text-small--height);';
} // A save the host makes only once confirmed (port 1.14.0): its words, and the
// two answers, in the bar where save was pressed -- the same place and the same
// arrangement as the view's reset question. Going back sends nothing and keeps
// what was entered.


function renderConfirmation(context) {
  // The Framework's question in place (C289, C182; sf-confirm inline, C166):
  // the host's words and the two answers where Save was pressed. It was a bar
  // of this component's own.
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions sf-property-view-confirm" data-confirming="true">
            <sf-confirm
                    appearance="inline"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    question=${context.confirmation.text}
                    confirm-id="save"
                    accept-text=${context.confirmSaveText}
                    decline-text=${context.keepEditingText}
                    @sf-confirm-answer=${event => {
    event.preventDefault?.();
    if (event.detail?.accepted) context.component.confirmSave();else context.component.cancelConfirmation();
  }}
            ></sf-confirm>
        </div>
    `;
} // The foot of a surface open all at once: Create or Save, and Cancel, with
// what went wrong beside them.


function renderOpenAllBar(context) {
  if (context.confirmation) return renderConfirmation(context);
  const creating = context.mode === 'create';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions flex items-cross-center gap-1/3 flex-wrap" role="group">
            <sf-button
                    appearance="default"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${creating ? context.createText : context.saveText}
                    data-action=${creating ? 'create' : 'save'}
                    @click=${() => context.component.saveAll()}
            ></sf-button>
            <sf-button
                    appearance="ghost"
                    scheme="on-surface"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${context.cancelText}
                    data-action="cancel"
                    @click=${() => context.component.cancelEdit()}
            ></sf-button>
            ${context.errors.size ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-errors color-error">${context.errorsText}: ${context.errors.size}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.conflict ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-conflict color-error" role="alert">${context.conflict}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // Closing (or stepping to the next record) over unsaved entries asks first
// (C159 (6)): sf-confirm in the foot, «Закрыть без сохранения» or back.


function renderLeaveAsk(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions sf-property-view-confirm" data-leaving="true">
            <sf-confirm
                    appearance="inline"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    question=${context.word('closeUnsavedText')}
                    confirm-id="leave"
                    accept-text=${context.leaveAsk.kind === 'step' ? context.word('leaveUnsavedText') : context.word('closeUnsavedAcceptText')}
                    decline-text=${context.keepEditingText}
                    @sf-confirm-answer=${event => {
    event.preventDefault?.();
    context.component.answerLeave(Boolean(event.detail?.accepted));
  }}
            ></sf-confirm>
        </div>
    `;
}

function renderActions(context, {
  panel = false
} = {}) {
  if (context.leaveAsk) return renderLeaveAsk(context); // A surface placed to show the object has no footer of its own (owner,
  // 2026-10-14): a reader sees values, not controls that would refuse.

  if (context.mode === 'view') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  if (context.openAll) return renderOpenAllBar(context); // While the view is arranged the foot carries that mode's controls instead:
  // saving a record and arranging the view it is read in are two modes, and a
  // bar holding both would offer a save for something nobody was editing.

  if (context.configuring) return renderConfigureBar(context);
  if (context.editing && context.confirmation) return renderConfirmation(context); // A panel's foot holds the host's own actions, slotted as `footer`, and
  // the group's Save and Cancel. Deleting is a row of the head's «⋯» (C289
  // (3), C180 (2)): a foot stands for two actions or more, never for one delete.

  const hosted = panel && context.hasHostSlot('footer'); // sf-form carries its own Save and Cancel.

  const own = context.editing && !context.formEdit;
  if (!own && !hosted && !(context.editing && context.conflict)) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions flex items-cross-center gap-1/3 flex-wrap" role="group">
            ${own ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button
                                appearance="default"
                                size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                text=${context.saveText}
                                data-action="save"
                                @click=${() => context.component.saveGroup()}
                        ></sf-button>
                        <sf-button
                                appearance="ghost"
                                scheme="on-surface"
                                size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                text=${context.cancelText}
                                data-action="cancel"
                                @click=${() => context.component.cancelEdit()}
                        ></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${own && context.errors.size ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-errors color-error">${context.errorsText}: ${context.errors.size}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.conflict ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-conflict color-error" role="alert">${context.conflict}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <span class="grow"></span>
            ${hosted ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-host-footer flex flex-wrap items-cross-center gap-1/3">${context.hostSlot('footer')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // An unplaced field is being arranged, not read: it shows its name and a handle
// and nothing else. Drawn like a placed one it carried its value, so the area
// read as a group of fields that happen to be last rather than as the fields
// this view does not show.


function renderUnplacedField(context, field) {
  const key = String(field.key ?? '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-field sf-property-view-field--unplaced flex flex-col gap-1 min-w-0"
             data-field=${key}
             data-sf-sortable-item=${key}
             data-arranging="true">
            <i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle aria-hidden="true">drag_indicator</i>
            <div class="sf-property-view-field-label flex items-cross-center gap-1/3 color-on-surface-variant">
                <span class="flex-auto min-w-0">${String(field.label ?? key)}</span>
                ${field.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${renderFieldActions(context, field, key, {
    hidden: true
  })}
            </div>
        </div>
    `;
} // Fields the view places nowhere. Drawn only while the view is being arranged,
// because they are not part of what a person reads -- and drawn even when there
// are none, so that dragging a field out of every group has somewhere to land
// and a person can see that taking a field out does not destroy it.


function renderUnplaced(context) {
  if (!context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const fields = context.unplaced; // The count beside the bin's title is a count, read and never pressed: the
  // grey tonal badge (C140 (3); accordion AC-3, tags TG-5). It was a tag in
  // the retired appearance surface.
  // The Framework's own accordion rather than a fold built here: the owner
  // asked for it by name, and a second thing that opens and closes is a
  // second thing to keep looking right (owner, 2026-10-09).
  //
  // The accordion owns whether it is open -- its script claims any
  // .sf-accordion the document gains and remembers the state -- so the panel
  // does not bind it. What the panel does instead is press the trigger when a
  // drag starts, the way a person would, and press it back when the drag
  // ends. One controller, and a drop target that is visible exactly when
  // something is in the air.
  //
  // The hint paragraph is gone: it described in two lines what the «+» beside
  // every area does, under a heading that already says what the bin is.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <article
                class="sf-accordion sf-accordion--outline sf-property-view-group--unplaced"
                data-unplaced="true"
        >
            <h3 class="sf-accordion-heading">
                <button
                        type="button"
                        class="sf-accordion-trigger"
                        data-action="toggle-unplaced"
                        aria-expanded="true"
                >
                    <span class="sf-accordion-title flex items-cross-center gap-1/3">
                        ${context.unplacedTitle}
                        ${fields.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge
                                    size="1/3"
                                    text=${String(fields.length)}
                            ></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </span>
                    <sf-icon icon="chevron_right" size="1/2"></sf-icon>
                </button>
            </h3>
            <div class="sf-accordion-content" role="region">
                <sf-sortable
                        class="sf-property-view-group-fields sf-property-view-unplaced"
                        group="field"
                        accepts="field"
                        id=${`unplaced:${context.recordId || 'record'}`}
                        label=${context.unplacedTitle}
                >${fields.map(field => renderUnplacedField(context, field))}</sf-sortable>
            </div>
        </article>
    `;
} // The three controls a panel carries, and none of them invents anything. Close is
// the component's own business; copying and opening need an address, and the
// address is the host's -- a composite that constructed a URL would be guessing at
// the consumer's routing and would be wrong in the first consumer whose routing
// did not match the guess. No address, no two controls.
// The panel's head, as the mockup draws it: the collection on its own line above,
// then the record's name with its favourite star, the host's own actions, and a
// «⋯» for what belongs to the view rather than to the record. One block, so there
// are no empty bands between the title and the first card -- the view this replaces
// had two of about sixty pixels, which is what the owner saw first.
// What belongs to the view rather than to the record: arranging it, resetting it
// and whether the rare entries are shown. It is a menu because there is more than
// one of them; pressing «⋯» used to run the first item straight away, so the
// second never had anywhere to be.


function renderMenuControl(context) {
  const items = context.panelMenuItems;
  const host = context.hasHostSlot('menu') ? context.hostSlot('menu') : null; // The views are chosen from this menu too, so more than one of them is a
  // reason for it to stand even with nothing else in it.

  const views = !context.configuring && (context.viewProfiles?.length ?? 0) > 1;
  const record = (context.recordMenuItems?.length ?? 0) > 0 || context.canDeleteRecord;
  if (!items.length && !host && !views && !record) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Always the menu, never the one item drawn in its place. The place is the
  // panel's own: what belongs in it depends on the task, and a consumer that
  // slots its items into `menu` finds the same «\u2026» wherever it looks --
  // which it could not when one item meant a different glyph in that corner
  // (owner, 2026-10-08).
  // The «⋯» opens the Framework's standard menu (owner, 2026-10-12), and so
  // do the items a host slots into `menu` (owner, 2026-10-14): they were a
  // popover of link buttons, the one menu of the panel drawn otherwise. The
  // slotted elements stay in the page, hidden, and a row of the menu stands
  // for each -- a link row for a link, a press on the element for the rest.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-button-icon
                appearance="ghost"
                scheme="on-surface"
                size=${context.panel ? '1/3' : context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                icon="more_horiz"
                data-action="menu"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label=${context.menuLabel}
                @click=${event => context.component.openPanelMenu(event.currentTarget.querySelector('button') ?? event.currentTarget)}
        ></sf-button-icon>
        ${host ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-host-menu" data-host-menu hidden>${host}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;
} // The panel has one head (C157 (6), C180 (2)): «Назад» when a level is open,
// the title on the window step (C157 (7) = C159 (5)), the star, the host's
// actions, the «⋯» and the close, the SIMAI Framework's sf-button-close (C14),
// last and inside the panel. The close stood outside on the scrim as a round
// sf-button-icon of the panel's own, and a section opened on a phone added a
// second head row «← Цены» under this one (R243 study, VP-6 and VP-7). The
// section screen of a phone is a level of the same panel: its back arrow is in
// this row and the title names the section, as a record opened from the panel
// names that record. The row's layout (a row, centred, 8 apart, the spacer
// before the host's actions) is the component's own sheet, not utilities: the
// Loader asks for a utility sheet only after the first render, so the close
// stood beside the star for ~115 ms and then jumped to the end (D1, 1.16.3).


function renderPanelHead(context) {
  const level = phoneLevel(context);
  const record = context.panelLabel || context.recordLabel || context.recordId || ''; // The history is a level of the same panel (C305 (2)): the C289 head with
  // the back line to the record over its title.

  const history = context.historyOpen; // One row of the ladder's step 2 (48 at a desktop; C289 (6), R254), its
  // buttons the head's 1/3 as sf-drawer draws its own (C180 (2)). A related
  // record opened from this one is drawn inside the same panel (sf-drawer
  // C157 (6)); its way back is the line «← <Запись>» over the title, on the
  // drawer's own back part (data-sf-drawer-back), so the title does not move
  // and the close still closes the whole chain.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <header class="sf-property-view-head flex flex-col">
            ${history ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-back">
                <sf-button
                        appearance="ghost"
                        scheme="on-surface"
                        size="1/3"
                        icon-start="arrow_back"
                        text=${record}
                        aria-label=${`${context.backLabel}: ${record}`}
                        data-action="history-back"
                        @click=${() => context.component.closeHistory()}
                ></sf-button>
            </div>` : context.nestedUnder ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-back">
                <sf-button
                        appearance="ghost"
                        scheme="on-surface"
                        size="1/3"
                        icon-start="arrow_back"
                        text=${context.nestedUnder}
                        aria-label=${`${context.backLabel}: ${context.nestedUnder}`}
                        data-action="nested-back"
                        data-sf-drawer-back
                ></sf-button>
            </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <div class="sf-property-view-title-row">
                ${level ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon
                        size="1/3"
                        appearance="ghost"
                        scheme="on-surface"
                        icon="arrow_back"
                        data-action="phone-back"
                        aria-label=${context.backLabel}
                        title=${context.backLabel}
                        @click=${() => context.component.closePhoneSection()}
                ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                <h2 class="sf-property-view-title min-w-0 overflow-hidden" tabindex="-1">${history ? context.word('historyText') : level ? context.phoneSectionLabel : record}</h2>
                ${context.recordId && context.mode !== 'create' && !history ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon
                        appearance="ghost"
                        scheme="on-surface"
                        size="1/3"
                        icon="star"
                        ?filled=${context.favourite}
                        data-action="favourite"
                        aria-pressed=${context.favourite ? 'true' : 'false'}
                        aria-label=${context.favouriteLabel}
                        @click=${() => context.component.toggleFavourite()}
                ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                <span class="sf-property-view-head-spacer"></span>
                ${context.hasHostSlot('actions') ? context.hostSlot('actions') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${renderMenuControl(context)}
                <sf-button-close
                        size="1/3"
                        aria-label=${context.closeLabel}
                        data-action="close"
                        @click=${() => context.component.closePanel('close')}
                ></sf-button-close>
            </div>
            ${history || level ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : renderHeadLine(context)}
        </header>
    `;
} // The line under the title (C289 (6), C311 (2)): the stage as a tonal badge,
// then up to two fields' values joined by « · ». Nothing when the head names
// none: the title alone, as before.


function renderHeadLine(context) {
  const line = context.headLine;
  if (!line || !line.status && !line.subtitle.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-head-line flex items-cross-center gap-1/3 min-w-0" data-head-line>
            ${line.status ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge size="1/2" appearance="tonal" scheme=${line.status.scheme}
                    text=${line.status.text} data-head-status=${line.status.key}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${line.subtitle.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-head-subtitle color-on-surface-variant min-w-0 overflow-hidden"
                    data-head-subtitle>${line.subtitle.map(item => item.text).join(' · ')}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // A section opened on a phone, inside a panel: a level of the panel (C157 (6)).


function phoneLevel(context) {
  return Boolean(context.panel && !context.wide && (context.sections?.length ?? 0) > 1 && context.phoneSection !== null);
} // The phone's list screen: below the breakpoint, with more than one section and
// none of them opened. Named once rather than written out at each of the three
// places that ask it -- the first version repeated the expression and the third
// copy was the one that forgot to suppress the groups, so the list screen drew the
// list with a section's groups underneath it.


function onPhoneSectionList(context, sections) {
  // Arranging draws «Вкладки» over the fields at every width (C311 (4)): the
  // phone's list screen is a way to read, not to arrange.
  return !context.configuring && !context.wide && sections.length > 1 && context.phoneSection === null;
} // The section being arranged, named where its areas are. The section list is
// drawn by sf-tabs, whose tabs take a label as a string and nothing else, so
// neither a pencil nor a field can stand in the list
// itself -- and a section shown as a tab has no list at all. The name of the
// place you are arranging belongs above the things you are arranging anyway.


function renderSectionBar(context, section, count) {
  if (!section) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-section-bar flex items-cross-center gap-1/4"
             data-section=${String(section.key)}>
            ${context.configuring ? renderSectionIcon(context, section) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${section.icon ? String(section.icon) : 'folder'}</i>`}
            ${renderEntryName(context, 'section', String(section.key), String(section.label ?? section.key), 'sf-property-view-section-title min-w-0')}
            <sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="secondary"
                    icon="delete"
                    data-action="remove-section"
                    ?disabled=${count < 2}
                    title=${context.removeSectionText}
                    aria-label=${context.removeSectionText}
                    @click=${() => context.component.removeSection(String(section.key))}
            ></sf-button-icon>
        </div>
    `;
} // The glyph a section is marked with, chosen from a grid of them. A column of a
// hundred icons is a column nobody scrolls to the end of, so the dropdown lays
// its options out several to a row and searches by the name of the glyph, which
// is the only thing about an icon a person can type.


function renderSectionIcon(context, section) {
  const current = section.icon ? String(section.icon) : '';
  const options = context.sectionIconChoices.map(icon => ({
    kind: 'icon',
    icon,
    text: icon,
    value: icon,
    ariaLabel: icon,
    selected: icon === current
  })); // The chooser is the dropdown laid out as a grid: a hundred and twenty
  // glyphs in a column is a column nobody scrolls to the end of, and the
  // search is the only thing about a glyph a person can type. The trigger is
  // the glyph itself, because a field spelling out the name of what is drawn
  // beside it says the same thing twice.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                class="sf-property-view-section-icon"
                size="1/2"
                layout="grid"
                columns="6"
                search="true"
                search-placeholder=${context.sectionIconText}
                aria-label=${context.sectionIconText}
                data-icon-for=${String(section.key)}
                value=${current}
                .options=${options}
                @change=${event => context.component.setSectionIcon(String(section.key), event.detail?.value ?? '')}
        >
            <sf-button-icon
                    slot="trigger"
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface"
                    icon=${current || 'folder'}
                    data-action="section-icon"
                    title=${context.sectionIconText}
                    aria-label=${context.sectionIconText}
            ></sf-button-icon>
        </sf-dropdown>
    `;
} // Making something new, at the end of the arrangement, where a person who has
// run out of places to put a field looks for one (owner, 2026-10-07). An area
// and a section are the two boxes this view has: one holds fields, the other
// holds areas. Both are named the moment they are made -- the new name opens
// for typing -- because an area called «Новая область» among four real ones is
// a box nobody can tell from the others.
//
// Both stand the width of what they add to, in the neutral scheme and with no
// glyph: making a box is not the primary act of this mode, and a full-width
// outlined button with a plus in it read as the main thing to do on the screen.
// «Add an area» takes the ladder's size 1, the size the panel's own controls
// use; «add a section» stays a step below it, which is where it sits in the
// rail (owner, 2026-10-09).


function renderArrangementAdditions(context, section) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-additions flex flex-col items-cross-stretch gap-1">
            <sf-button
                    appearance="outline"
                    scheme="on-surface"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${context.addGroupText}
                    data-action="add-group"
                    @click=${() => context.component.addGroup(section ? String(section.key) : '')}
            ></sf-button>
            <sf-button
                    appearance="outline"
                    scheme="on-surface"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    icon-start="add"
                    text=${context.word('newFieldText')}
                    data-action="new-field"
                    @click=${() => context.component.openStructureEditor()}
            ></sf-button>
        </div>
    `;
} // A new section is made at the end of the sections (owner, 2026-10-08), which is
// where a person looks for one: under the list of them. Without a rail there is
// no list to put it under, so it stands beside «add an area» as before.


function renderAddSection(context) {
  // «+ Вкладка» makes a tab with a «Поля» area (C311 (4)).
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-button
                appearance="outline"
                scheme="on-surface"
                size="1/2"
                icon-start="add"
                text=${context.word('addTabText')}
                data-action="add-section"
                @click=${() => context.component.addSection()}
        ></sf-button>
    `;
} // Whether the column of tabs is drawn beside the fields. It holds the tabs and
// nothing else (owner, 2026-10-07), so what used to stand above the whole panel
// -- the band of the arranging mode -- stands above the fields instead, and the
// column reaches the top of the panel the way a rail of tabs does.


function sidebarDrawn(context) {
  const sections = listed(context, context.sections);
  return Boolean(context.sectionsLayout === 'column' && (sections.length > 1 || context.configuring));
} // The line of tabs under the head (C289 (1)): a panel narrower than the whole
// screen, or a page that asked for tabs, with more than one section. While the
// view is arranged the sections are rows that take a drop, drawn over the
// groups instead (sectionsStacked).


function lineTabsDrawn(context, sections) {
  return context.sectionsLayout === 'tabs' && sections.length > 1 && !context.configuring;
} // While arranging, «Вкладки» stand over the fields wherever the sections are
// not a column beside them -- tabs, and a narrow card (C311 (4)).


function sectionsStacked(context) {
  return context.configuring && (context.sectionsLayout === 'tabs' || context.sectionsLayout === 'phone');
} // The errors of a save, from two of them (C182 (6)): a summary over the
// fields with a link to each, which takes the focus; one error takes the
// focus to its field. The look is sf-form's summary (the quiet error
// container), so a record and a form say it the same way.


function renderErrorSummary(context) {
  const list = context.errorList ?? [];
  if (list.length < 2 || !(context.editing || context.openAll)) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-error-summary" role="alert" tabindex="-1">
        <p class="sf-property-view-error-summary-title">${context.errorsText}: ${list.length}</p>
        <ul class="sf-property-view-error-summary-list">${list.map(error => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li><a href=${`#${error.key}`}
            data-field-link=${error.key}
            @click=${event => {
    event.preventDefault();
    context.component.focusField(error.key);
  }}>${error.label}: ${error.message}</a></li>`)}</ul>
    </div>`;
} // The record's history (C305 (2), RC-3): sf-list-timeline by day, newest
// first, each change's before and after drawn by its field's template, the
// author and the time; «Показать ещё» asks the host for the next page.


function renderHistoryFeed(context) {
  const feed = context.history;
  const items = feed?.items ?? [];
  const loading = !feed || feed.loading;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-list-timeline class="sf-property-view-history"
                group="day"
                label=${context.word('historyText')}
                .items=${items}
                ?has-more=${Boolean(feed?.hasMore)}
                ?loading=${loading}
                empty-text=${feed?.failed ? context.word('historyFailedText') : context.word('historyEmptyText')}
                @sf-list-timeline-load-more=${() => context.component.loadHistory({
    more: true
  })}
        ></sf-list-timeline>
    `;
} // The full screen from 80rem: the history in a column of its own beside the
// fields (C305 (3), VP-22), --sf-view-properties-side-width (24rem).


function renderHistorySide(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <aside class="sf-property-view-side min-w-0" aria-label=${context.word('historyText')}>
            <div class="sf-property-view-side-title" role="heading" aria-level="3">${context.word('historyText')}</div>
            ${renderHistoryFeed(context)}
        </aside>
    `;
} // The record on its way: the arrangement's shape in the Framework's skeleton
// -- a sentence in its place said nothing about it (owner, 2026-10-14). Each
// group is the card a group read by itself draws until its fields come
// (port 1.15.0 group-load, renderGroup's `waiting`): its header with a bar for
// the title and a line per field, so the record and its groups arrive in the
// boxes this draws (standard simai.smart-component 1.3.8 §5.4, item 25). The
// same markup is skeleton.html, which a server prints before any code, so the
// element's first render after the printed skeleton changes nothing.


const SKELETON_WIDTHS = ['w-1/3', 'w-2/3', 'w-1/2', 'w-3/4', 'w-2/5'];
const SKELETON_GROUPS = 3;
const SKELETON_FIELDS = 3;

function renderLoading(context) {
  const bar = at => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-skeleton sf-skeleton--animation-pulse" aria-hidden="true"><div class="sf-skeleton-text sf-skeleton-text--size-1 ${SKELETON_WIDTHS[at % SKELETON_WIDTHS.length]}"></div></div>`; // The section tabs are drawn with the skeleton, in the box the tabs take
  // (simai/ui-pro#3): they came only with the data before, and the record
  // moved down by their height when it arrived. The stylesheet draws the
  // strip only where the record has tabs -- sections-as tabs, from the wide
  // arrangement on -- since a printed skeleton knows no viewport. The box is
  // sf-tabs' own: its strip of the view's control height over the tabs'
  // hairline (.sf-tabs-top-container) and its empty panel
  // (.sf-tabs-main-container), both from the tabs' sheet; the strip was one
  // text line before, and the record still moved down by 49px at size 1.
  // The root is not .sf-tabs: that class is the tabs script's to bind.


  const tabs = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-tabs sf-property-view-tabs--skeleton" aria-hidden="true" data-sf-skeleton="tabs" data-sections-as=${context.sectionsLayout === 'tabs' ? 'tabs' : 'list'} data-size=${context.size}><div class="sf-tabs-top-container"><div class="sf-property-view-tabs-skeleton-strip flex items-cross-center gap-2">${[0, 1, 2].map(at => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="flex-none" style="inline-size: 6rem">${bar(at + 3)}</div>`)}</div></div><div class="sf-tabs-main-container"></div></div>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${tabs}<div class="sf-property-view-loading flex flex-col gap-4" data-state="loading">${Array.from({
    length: SKELETON_GROUPS
  }, (_, group) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<section class="sf-property-view-group bg-surface-page flex flex-col gap-2" aria-busy="true"><header class="sf-property-view-group-header flex items-cross-center content-main-between gap-2"><div class="flex-1">${bar(group)}</div></header>${Array.from({
    length: SKELETON_FIELDS
  }, (_, field) => bar(group + field + 1))}</section>`)}<span class="sr-only" role="status">${context.message}</span></div>`;
}

function renderLoadFailure(context) {
  const failure = context.loadFailure;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-empty-state kind=${failure.kind} size=${context.size === '1/2' ? '1/2' : '1'} heading-level="2"
        text=${failure.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        .actions=${failure.kind === 'error' ? null : []}
        @sf-empty-state-action=${event => {
    if (event.detail?.id === 'retry') context.component.load('retry');
  }}></sf-empty-state>`;
}

function renderBody(context, railOutside = false, withActions = true) {
  if (context.loading) return renderLoading(context);
  if (context.loadFailure) return renderLoadFailure(context); // In place, the history level stands where the record was, its back line
  // over it (a panel draws it under its head).

  if (!context.panel && context.historyOpen) {
    const record = context.panelLabel || context.recordLabel || context.recordId || '';
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class="sf-property-view-back">
                <sf-button appearance="ghost" scheme="on-surface" size="1/3" icon-start="arrow_back" text=${record}
                           aria-label=${`${context.backLabel}: ${record}`} data-action="history-back"
                           @click=${() => context.component.closeHistory()}></sf-button>
            </div>
            <div class="sf-property-view-history-head flex items-cross-center gap-1">
                <div class="sf-property-view-side-title flex-auto" role="heading" aria-level="2">${context.word('historyText')}</div>
                ${renderMenuControl(context)}
            </div>
            ${renderHistoryFeed(context)}
        `;
  } // Sections are listed the same way fields and groups are while the view is
  // being configured: a hidden section filtered out here would be a section
  // nobody could ever show again.


  const sections = listed(context, context.sections);
  const current = sections.find(section => String(section.key) === context.selectedSection) ?? sections[0] ?? null;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-status" role="status" aria-live="polite" ?hidden=${!context.message}>
            ${context.message}
        </div>
        ${!context.panel && (context.hasHostSlot('actions') || context.hasHostSlot('menu') || context.panelMenuItems.length || context.canDeleteRecord || (context.recordMenuItems?.length ?? 0) > 0) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <div class="sf-property-view-host-actions flex flex-wrap items-cross-center justify-end gap-1">
                        ${context.hasHostSlot('actions') ? context.hostSlot('actions') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        ${renderMenuControl(context)}
                    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${context.panel ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : renderHeadLine(context)}
        ${onPhoneSectionList(context, sections) ? renderPhoneSectionList(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${lineTabsDrawn(context, sections) ? renderSectionTabs(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <div class="sf-property-view-layout"
             style=${`--sf-property-view--sections-width: ${context.sectionsWidth};${context.panel ? '' : sizeStyle(context)}`}
             data-sections=${String(sections.length)}
             data-screen=${onPhoneSectionList(context, sections) ? 'sections' : 'groups'}
             data-stacked=${sectionsStacked(context) ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${!context.panel && !context.wide && !context.configuring && sections.length > 1 && context.phoneSection !== null ? renderPhoneSectionHead(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${onPhoneSectionList(context, sections) ? renderViewChooser(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${sectionsStacked(context) ? renderConfigureTop(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${sidebarDrawn(context) && !railOutside || sectionsStacked(context) ? renderSectionList(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.isEmptyRecord && !context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-property-view-empty-record color-on-surface-variant"
                              role="status">${context.emptyRecordText}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${onPhoneSectionList(context, sections) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-property-view-body flex-auto min-w-0 flex flex-col gap-4">
                            ${sectionsStacked(context) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : renderConfigureTop(context)}
                            ${renderSectionBar(context, current, sections.length)}
                            <sf-sortable
                                    class="sf-property-view-groups flex flex-col gap-4"
                                    group="group"
                                    accepts="group"
                                    id=${`group:${current ? String(current.key) : ''}`}
                                    label=${String(current?.label ?? current?.key ?? '')}
                            >${listed(context, current?.groups).map(group => renderGroup(context, current, group))}</sf-sortable>
                            ${renderArrangementAdditions(context, current)}
                            ${renderUnplaced(context)}
                        </div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-property-view-body flex-auto min-w-0 flex flex-col gap-4">
                            ${renderViewChooser(context)}
                            ${renderErrorSummary(context)}
                            <div class="sf-list-description sf-list-description--size-${context.size === '1/2' ? 'half' : '1'} sf-list-description--layout-auto sf-list-description--sections sf-property-view-list">
                                <div class="sf-list-description-list">${context.visible(current?.groups).map(group => renderGroup(context, current, group))}</div>
                            </div>
                        </div>`}
            ${!context.panel && context.historySide ? renderHistorySide(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
        ${withActions && context.hasHostSlot('footer') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-host-footer flex flex-wrap items-cross-center gap-1/3">${context.hostSlot('footer')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${withActions ? renderActions(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;
} // A deeper window is narrower by a step, so the one below shows along the
// inline-start edge. That is what makes a stack visible rather than merely true
// in the DOM, and `width` is a declared input on sf-drawer, so it reaches into
// none of that component's internals.
//
// A window above the stack takes no step in from the one below (owner,
// 2026-10-07): the step read as the panel having slipped rather than as a stack,
// and the page behind is already dimmed, which says there is something under
// this. sf-drawer keeps `stack-offset` for a consumer that wants the step; this
// one asks for none.
//
// The panel lies *over* the page: `overlay` is on, so the page behind is dimmed and
// keeps its own layout. It was off before, which is how a consumer's page came to
// be squeezed instead of covered -- the first thing the owner pointed at.
//
// `modal` is on because the drawer draws its overlay only when it is -- the
// element is marked hidden unless modal and overlay are both set, which was
// measured rather than assumed. Dimming the page is what the mockup asks for, and
// a panel that dims the page is modal in the sense that matters. The dim is the
// drawer's overlay, the same over a panel below as over the page: a panel under
// another stands under that one's overlay, so it is dimmed and takes no press
// without a dim of its own (1.13.0). Esc is the drawer's on the layer stack, which
// hands it to the top layer only; the close it starts is refused and asked of the
// host (index.js, sf-drawer-close).
//
// The drawer is given no `title`: the panel draws its own head, with the collection
// above the name and the star and the «⋯» beside it, and a drawer title as well
// would be the same words twice.


function renderPropertyViewTemplate(context) {
  if (!context.panel) return renderBody(context); // The panel is laid out the way a page is (owner, 2026-10-08): a head across
  // the top, a foot across the bottom, and what is between them scrolling
  // under both. The bands were sticky inside the panel's own scroller before,
  // which held them only while their containing block was on screen -- so a
  // record scrolled far enough took its own head and foot with it.
  //
  // With a rail of tabs what is between them is two columns, each with its own
  // scrollbar: a long list of sections scrolls without moving the record, and
  // a long record scrolls without moving the list.

  const rail = sidebarDrawn(context); // `show-close` is off because the panel draws its own close, sf-button-close
  // last in its head (1.16.0; it stood in the strip beside copy-link and
  // open-full before). With both, a panel carried two close
  // buttons a step apart, and on a phone neither was reachable: the strip is
  // placed a gutter's width beyond the panel's inline start, which on a
  // full-screen drawer is off the screen.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-drawer
                ?open=${context.panelOpen}
                placement="inline-end"
                modal="true"
                overlay="true"
                ?docked=${context.docked}
                dock-breakpoint=${context.docked ? context.dockBreakpoint : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                size=${context.wide ? context.drawerStep : 'full'}
                gutter="var(--sf-space-1)"
                panel-style=${`--sf-drawer-background: var(--sf-surface-area); --sf-property-view--sections-width: ${context.sectionsWidth}; scrollbar-gutter: auto;${sizeStyle(context)}`}
                show-close="false"
                close-label=${context.closeLabel}
                label=${context.panelLabel || context.recordLabel || context.recordId || ''}
        >
            <div class="sf-property-view-panel relative flex flex-col gap-2${rail ? ' sf-property-view-panel--railed' : ''}"
                 data-record-id=${context.recordId || ''}
                 data-sections-layout=${context.sectionsLayout}
                 data-nested=${context.nestedUnder ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            >
                ${renderPanelHead(context)}
                <div class="sf-property-view-scroll flex-auto min-h-0 ${rail && !context.historyOpen ? 'flex' : 'flex flex-col'}"
                     data-history=${context.historyOpen ? 'level' : context.historySide ? 'side' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
                    ${context.historyOpen ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-frame flex-auto min-w-0 flex flex-col gap-2">${renderHistoryFeed(context)}</div>` : rail ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                ${renderSectionList(context, listed(context, context.sections))}
                                <div class="sf-property-view-frame flex-auto min-w-0 flex flex-col gap-2">
                                    ${renderBody(context, true, false)}
                                </div>
                                ${context.historySide ? renderHistorySide(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}` : renderBody(context, false, false)}
                </div>
                ${renderActions(context, {
    panel: true
  })}
            </div>
        </sf-drawer>
    `;
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

/***/ "f59c8bcdc90a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "9e9dad7bcc09"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "18003344cff0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("layer-stack", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("layer-stack", 1).then(resolve, reject), { once: true })));

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

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "0e2a9b296d0b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Directive: () => (/* binding */ i),
/* harmony export */   PartType: () => (/* binding */ t),
/* harmony export */   directive: () => (/* binding */ e)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
//# sourceMappingURL=directive.js.map


/***/ },

/***/ "a3820f08234c"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   guard: () => (/* binding */ i)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");
/* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0e2a9b296d0b");

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e={},i=(0,_directive_js__WEBPACK_IMPORTED_MODULE_1__.directive)(class extends _directive_js__WEBPACK_IMPORTED_MODULE_1__.Directive{constructor(){super(...arguments),this.ot=e}render(r,t){return t()}update(t,[s,e]){if(Array.isArray(s)){if(Array.isArray(this.ot)&&this.ot.length===s.length&&s.every((r,t)=>r===this.ot[t]))return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange}else if(this.ot===s)return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange;return this.ot=Array.isArray(s)?Array.from(s):s,this.render(s,e)}});
//# sourceMappingURL=guard.js.map


/***/ },

/***/ "f550d360fd36"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _$LH: () => (/* binding */ j),
/* harmony export */   html: () => (/* binding */ b),
/* harmony export */   mathml: () => (/* binding */ T),
/* harmony export */   noChange: () => (/* binding */ E),
/* harmony export */   nothing: () => (/* binding */ A),
/* harmony export */   render: () => (/* binding */ D),
/* harmony export */   svg: () => (/* binding */ w)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t=>t,s=t.trustedTypes,e=s?s.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o,r=`<${n}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),T=x(3),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o+x):s+o+(-2===d?i:x)}return[V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t)}else t.startsWith(o)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o),i=t.length-1;if(i>0){r.textContent=s?s.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c())}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else{let t=-1;for(;-1!==(t=r.data.indexOf(o,t+1));)d.push({type:7,index:l}),t+=o.length-1}l++}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,!0);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n]}o!==r?.index&&(h=P.nextNode(),o++)}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else{const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const s=i(t).nextSibling;i(t).remove(),t=s}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r}o&&!e&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class I extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class L extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}}const j={M:h,P:o,A:n,C:1,L:N,R,D:d,V:M,I:k,H,N:L,U:z,B:I,F:Z},B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{})}return h._$AI(t),h};
//# sourceMappingURL=lit-html.js.map


/***/ },

/***/ "fc5ce1a4b1d8"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   guard: () => (/* reexport safe */ lit_html_directives_guard_js__WEBPACK_IMPORTED_MODULE_0__.guard)
/* harmony export */ });
/* harmony import */ var lit_html_directives_guard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a3820f08234c");

//# sourceMappingURL=guard.js.map


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
//
// The steps run again until a pass changes nothing (2026-11-11 acceptance,
// M2): dropping a space or an empty run makes new neighbours, so one pass left
// "<p>a <em><br>n</em></p>" for the next load-and-save to make
// "<p>a<em><br>n</em></p>". The stored value is the fixed point at once.
function tidyLeaves(leaves, mode) {
  let current = leaves;
  let key = null;
  for (let pass = 0; pass < 64; pass += 1) {
    current = tidyLeavesOnce(current, mode);
    const next = JSON.stringify(current);
    if (next === key) break;
    key = next;
  }
  return current;
}

function tidyLeavesOnce(leaves, mode) {
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
    // Edge breaks and edge white space go together, until neither is left: a
    // run of only white space (&nbsp;) at an edge hid the break behind it, so
    // the first pass kept "<p>&nbsp;<br>a</p>" as "<p><br>a</p>" and only the
    // next load-and-save gave "<p>a</p>" (2026-11-10 review, Q6). The value is
    // now what that second pass gave, at once, and cleaning it again keeps it.
    let length = -1;
    while (length !== kept.length) {
      length = kept.length;
      while (kept[0]?.kind === 'br') kept.shift();
      while (kept.at(-1)?.kind === 'br') kept.pop();
      if (kept[0]?.kind === 'text') kept[0].value = kept[0].value.replace(/^[\s\u00a0]+/u, '');
      const end = kept.at(-1);
      if (end?.kind === 'text') end.value = end.value.replace(/[\s\u00a0]+$/u, '');
      kept = kept.filter((item) => item.kind === 'br' || item.value);
    }
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

/***/ "4bd9c3b168e0"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4bc232cd5c70");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "354525e80715"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f050502c25f8");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


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

/***/ "4bc232cd5c70"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"folder":"folder, directory","folder_open":"open, folder","topic":"topic, section","home":"home, main","dashboard":"dashboard, overview","apartment":"building, organisation","store":"store, shop","storefront":"storefront, shop","business_center":"business, briefcase","work":"work, briefcase","badge":"badge, pass, id","person":"person, user","group":"group, people","groups":"groups, community","account_circle":"account, profile","manage_accounts":"manage, accounts, users","supervisor_account":"supervisor, team","contacts":"contacts","school":"school, learning","menu_book":"book, manual","assignment":"assignment","task":"task","description":"document, description","article":"article","note_alt":"note","edit_note":"edit, note","draft":"draft","receipt":"receipt","receipt_long":"bill, receipt","request_quote":"quote, estimate","inventory_2":"archive, inventory","category":"category","label":"label, tag","sell":"price, sell","local_offer":"offer, discount","shopping_cart":"shopping, cart","shopping_bag":"shopping, bag","payments":"payments, money","savings":"savings","credit_card":"credit, card","account_balance":"bank, account","calculate":"calculator","percent":"percent","trending_up":"trend, growth","analytics":"analytics","insights":"insights","monitoring":"monitoring","bar_chart":"bar, chart","pie_chart":"pie, chart","table_chart":"table","schedule":"time, clock, schedule","event":"event","today":"today","calendar_month":"calendar","date_range":"date, range","history":"history","alarm":"alarm","timer":"timer","update":"update","hourglass_top":"hourglass, waiting","mail":"mail, email, letter","outgoing_mail":"outgoing, mail","chat":"chat, message","forum":"forum, discussion","sms":"sms, text","call":"call, phone","phone_in_talk":"phone, call, talk","contact_support":"support, help","campaign":"campaign, announcement","notifications":"notifications","language":"language, world","public":"public, web, world","place":"place","map":"map","location_on":"location, address","travel_explore":"travel, explore","flight":"flight, plane","local_shipping":"shipping, delivery","route":"route","directions":"directions","settings":"settings","tune":"tune, filter","build":"build, tools","construction":"construction","handyman":"handyman, repair","code":"code","terminal":"terminal, console","data_object":"data, object","api":"api","bug_report":"bug","database":"database","storage":"storage","cloud":"cloud","backup":"backup","sync":"sync","folder_zip":"zip, archive","upload_file":"upload, file","download":"download","attach_file":"attach, file","link":"link","lock":"lock","lock_open":"unlock, open","shield":"shield, protection","verified_user":"verified, user","key":"key","admin_panel_settings":"admin","policy":"policy","gavel":"law, gavel","fingerprint":"fingerprint","visibility":"visibility, view","palette":"palette, colour, color","format_paint":"format, paint","image":"image, picture","photo_library":"photos, gallery","collections":"collections","movie":"movie, video","play_circle":"play","mic":"microphone","headphones":"headphones, audio","brush":"brush"}}');

/***/ },

/***/ "f050502c25f8"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"yes":"Yes","no":"No","searchInList":"Find in the list","containsText":"Contains…","fileKind_image":"Images","fileKind_document":"Documents","fileKind_archive":"Archives","fileKind_other":"Other files","operator":"Operator","rangeFrom":"From","rangeTo":"To","condition":"Condition","numberOperator_eq":"Equals","numberOperator_neq":"Not equal","numberOperator_gt":"Greater than","numberOperator_gte":"At least","numberOperator_lt":"Less than","numberOperator_lte":"At most","numberOperator_between":"Between","numberOperator_empty":"Empty","numberOperator_not-empty":"Not empty","filterNumber":"Number","filterAmount":"Amount","filterPercent":"Percent","dateCondition":"Condition","dateByDayIn":"Compared by day, time zone {zone}","dateGroup_date":"Date","dateGroup_period":"Period","dateGroup_filled":"Filled","dateGroup_range":"The record\'s period","dateCondition_eq":"Exact date","dateCondition_between":"Between","dateCondition_lt":"Before","dateCondition_gt":"After","dateCondition_gte":"On or after","dateCondition_lte":"On or before","dateCondition_lastDays":"Last N days","dateCondition_nextDays":"Next N days","dateCondition_empty":"Empty","dateCondition_notEmpty":"Not empty","dateCondition_overlaps":"Runs in","dateCondition_within":"Entirely in","dateCondition_starts":"Starts in","dateCondition_ends":"Ends in","dateCondition_contains":"Runs on the day","datePeriod_today":"Today","datePeriod_yesterday":"Yesterday","datePeriod_thisWeek":"This week","datePeriod_lastWeek":"Last week","datePeriod_last7Days":"Last 7 days","datePeriod_thisMonth":"This month","datePeriod_lastMonth":"Last month","datePeriod_thisYear":"This year","datePeriod_tomorrow":"Tomorrow","datePeriod_nextWeek":"Next week","datePeriod_nextMonth":"Next month","datePeriodIn_today":"today","datePeriodIn_yesterday":"yesterday","datePeriodIn_thisWeek":"this week","datePeriodIn_lastWeek":"last week","datePeriodIn_last7Days":"in the last 7 days","datePeriodIn_thisMonth":"this month","datePeriodIn_lastMonth":"last month","datePeriodIn_thisYear":"this year","datePeriodIn_tomorrow":"tomorrow","datePeriodIn_nextWeek":"next week","datePeriodIn_nextMonth":"next month","dateChip":"{field}: {condition}","dateChip_lt":"before {date}","dateChip_gt":"after {date}","dateChip_gte":"on or after {date}","dateChip_lte":"on or before {date}","dateChip_lastDays":{"one":"in the last day","other":"in the last {n} days"},"dateChip_nextDays":{"one":"in the next day","other":"in the next {n} days"},"dateChip_empty":"empty","dateChip_notEmpty":"not empty","dateChip_overlaps":"runs {when}","dateChip_within":"entirely {when}","dateChip_withinDays":"entirely within {when}","dateChip_starts":"starts {when}","dateChip_ends":"ends {when}","dateChip_contains":"runs on {date}","dateCountLast":"Days, today included","dateCountNext":"Days ahead, today included","dateCountUnit":"days","dateValueDate":"Date","dateValueDay":"Day","dateValuePeriod":"Period","dateWhen":"When","dateOwnDays":"Own dates","loadingOptions":"Loading the options","optionsError":"The options could not be loaded","pickRecord":"Choose a record","pickFromList":"Choose from the list","searchRecords":"Find a record","loadingRecords":"Loading records","recordsError":"The records could not be loaded","retry":"Try again","loadMore":"Load more","removeFile":"Remove","fileRemoved":"File removed","undo":"Undo","passwordSet":"Set","passwordUnset":"Not set","phoneExtension":"ext.","passwordKeep":"Set; type a new one to replace it","maskIncomplete":"Complete the field","notNumber":"Enter a number","precisionMax":{"one":"At most {n} digit after the point","other":"At most {n} digits after the point"},"fractionNone":"A whole amount, no digits after the point","boundBetween":"From {min} to {max}","boundAtLeast":"At least {min}","boundAtMost":"At most {max}","currency":"Currency","chooseCurrency":"Choose a currency","rowCount":{"one":"{n} row","other":"{n} rows"},"type-string":"String","variant-string-phone":"Phone","variant-string-password":"Password","type-text":"Text","type-html":"Formatted text","type-integer":"Integer","variant-integer-stepper":"With steppers","type-number":"Number","variant-number-scale":"Scale 0–100","variant-number-meter":"Share of a limit","variant-number-stepper":"With steppers","type-date":"Date","type-datetime":"Date and time","type-time":"Time","type-boolean":"Yes or no","type-choice":"One of a list","variant-choice-buttons":"As buttons","type-choices":"Several of a list","variant-choices-badges":"As badges","variant-choices-checklist":"As a checklist","variant-choices-select":"As a dropdown","type-user":"User","type-record":"Record","type-relation":"Relation","type-lookup":"From a reference list","type-file":"File","variant-file-image":"Image","variant-file-image-card":"Image card","variant-file-image-list":"Image list","type-color":"Colour","type-include":"Code","type-money":"Money","type-percent":"Percent","type-items":"Rows","type-compound":"Compound","type-ru.requisites":"Requisites (Russia)"}}');

/***/ },

/***/ "4284cc8c32e1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-view-properties for the shim (core/js/aliases.js, standard §16 item 20).","component":"sf-view-properties","since":"2026-10-27","remove_after":"2027-01-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-view-properties","since":"2026-10-27","remove_after":"2027-01-01","mode":"host-attribute","section":"§3.1, §4.8","note":"stays a host attribute, read for the accessible name; no shim"},{"from":"sf-property-view-open-record","to":"sf-property-view-open","kind":"event","component":"sf-view-properties","since":"2026-10-27","remove_after":"2027-01-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary §5 open","note":"ui-admin listens to it (src/polygon.ts:124); the detail {field, value, answer} is unchanged"},{"from":"sf-property-view-delete-record","to":"sf-property-view-delete","kind":"event","component":"sf-view-properties","since":"2026-10-27","remove_after":"2027-01-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary §5 delete","note":"the detail {record_id, collection, revision, answer} is unchanged"},{"from":"sf-property-view","to":"sf-view-properties","kind":"tag","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R2 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-view-properties; sf-property-view is a subclass defined beside it until the date"},{"from":"sf-property-view-close","to":"sf-view-properties-close","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-open-full","to":"sf-view-properties-open-full","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-saved","to":"sf-view-properties-saved","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-failed","to":"sf-view-properties-failed","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-open","to":"sf-view-properties-open","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-delete","to":"sf-view-properties-delete","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-created","to":"sf-view-properties-created","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-cancel","to":"sf-view-properties-cancel","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-state","to":"sf-view-properties-state","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-address-copy","to":"sf-view-properties-address-copy","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-favourite","to":"sf-view-properties-favourite","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"panel-width","to":null,"kind":"attribute","component":"sf-view-properties","since":"2026-11-17","remove_after":"2027-01-01","mode":"host-attribute","section":"C289 (2), C157 (2)","note":"read by the view itself: a length is mapped to the nearest drawer step (1/2, 1, 2) when panel-size is not set, with a console notice; no shim; use panel-size"},{"from":"--sf-property-view--sections-width","to":"--sf-view-properties-sections-width","kind":"css-variable","component":"sf-view-properties","since":"2026-11-18","remove_after":"2027-01-01","section":"C305 (6)","note":"read under the new name until the date"}]}');

/***/ },

/***/ "3ea81f4c3c20"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.view-properties","tag":"sf-view-properties","version":"1.21.0","kind":"leaf","implements":["record-view@1"],"settings":{"add-field-text":{"type":"string","default-from":"runtime.add-field-text"},"add-group-text":{"type":"string","default-from":"runtime.add-group-text"},"add-section-text":{"type":"string","default-from":"runtime.add-section-text"},"back-label":{"type":"string","default-from":"runtime.back-label"},"cancel-configuring-text":{"type":"string","default-from":"runtime.cancel-configuring-text"},"cancel-name-text":{"type":"string","default-from":"runtime.cancel-name-text"},"cancel-text":{"type":"string","default-from":"runtime.cancel-text"},"changed-text":{"type":"string","default-from":"runtime.changed-text"},"close-label":{"type":"string","default-from":"runtime.close-label"},"collection":{"type":"string","default":""},"collection-icon":{"type":"icon","default":""},"collection-label":{"type":"string","default":""},"configure-hint-narrow-text":{"type":"string","default-from":"runtime.configure-hint-narrow-text"},"configure-hint-text":{"type":"string","default-from":"runtime.configure-hint-text"},"configure-text":{"type":"string","default-from":"runtime.configure-text"},"conflict-text":{"type":"string","default-from":"runtime.conflict-text"},"copy-link-label":{"type":"string","default-from":"runtime.copy-link-label"},"delete-text":{"type":"string","default-from":"runtime.delete-text"},"done-configuring-text":{"type":"string","default-from":"runtime.done-configuring-text"},"edit-text":{"type":"string","default-from":"runtime.edit-text"},"empty-record-text":{"type":"string","default-from":"runtime.empty-record-text"},"empty-text":{"type":"string","default-from":"runtime.empty-text"},"errors-text":{"type":"string","default-from":"runtime.errors-text"},"favourite":{"type":"boolean","default":false},"favourite-label":{"type":"string","default-from":"runtime.favourite-label"},"field-label-text":{"type":"string","default-from":"runtime.field-label-text"},"field-settings-text":{"type":"string","default-from":"runtime.field-settings-text"},"hidden-text":{"type":"string","default-from":"runtime.hidden-text"},"hide-rare-text":{"type":"string","default-from":"runtime.hide-rare-text"},"hint-text":{"type":"string","default-from":"runtime.hint-text"},"in-this-group-text":{"type":"string","default-from":"runtime.in-this-group-text"},"inherited-text":{"type":"string","default-from":"runtime.inherited-text"},"link-copied-label":{"type":"string","default-from":"runtime.link-copied-label"},"menu-label":{"type":"string","default-from":"runtime.menu-label"},"move-down-text":{"type":"string","default-from":"runtime.move-down-text"},"move-up-text":{"type":"string","default-from":"runtime.move-up-text"},"new-group-title":{"type":"string","default-from":"runtime.new-group-title"},"new-section-title":{"type":"string","default-from":"runtime.new-section-title"},"no-match-text":{"type":"string","default-from":"runtime.no-match-text"},"open-full-label":{"type":"string","default-from":"runtime.open-full-label"},"panel":{"type":"boolean","default":false},"panel-label":{"type":"string","default":""},"panel-size":{"type":"enum","values":["1/2","1","2","full"],"default":"1"},"size":{"type":"enum","values":["1","1/2"],"default":"1"},"mode":{"type":"enum","values":["view","auto","edit","create"],"default":"auto"},"panel-width":{"type":"string","default":""},"personal-layer-text":{"type":"string","default-from":"runtime.personal-layer-text"},"rare-text":{"type":"string","default-from":"runtime.rare-text"},"record-id":{"type":"id","default":""},"remove-field-text":{"type":"string","default-from":"runtime.remove-field-text"},"remove-group-text":{"type":"string","default-from":"runtime.remove-group-text"},"remove-section-text":{"type":"string","default-from":"runtime.remove-section-text"},"rename-text":{"type":"string","default-from":"runtime.rename-text"},"reset-view-ask-text":{"type":"string","default-from":"runtime.reset-view-ask-text"},"reset-view-text":{"type":"string","default-from":"runtime.reset-view-text"},"save-name-text":{"type":"string","default-from":"runtime.save-name-text"},"save-text":{"type":"string","default-from":"runtime.save-text"},"section-icon-text":{"type":"string","default-from":"runtime.section-icon-text"},"section-icons":{"type":"string","default":""},"sections-as":{"type":"enum","values":["list","tabs"],"default":"list"},"sections-label":{"type":"string","default-from":"runtime.sections-label"},"shared-layer-text":{"type":"string","default-from":"runtime.shared-layer-text"},"show-rare":{"type":"boolean","default":false},"show-rare-text":{"type":"string","default-from":"runtime.show-rare-text"},"shown-text":{"type":"string","default-from":"runtime.shown-text"},"unplaced-hint-text":{"type":"string","default-from":"runtime.unplaced-hint-text"},"unplaced-title":{"type":"string","default-from":"runtime.unplaced-title"},"variant-text":{"type":"string","default-from":"runtime.variant-text"},"view-conflict-text":{"type":"string","default-from":"runtime.view-conflict-text"},"view-denied-text":{"type":"string","default-from":"runtime.view-denied-text"},"width-text":{"type":"string","default-from":"runtime.width-text"},"view-profile-label":{"type":"string","default-from":"runtime.view-profile-label"},"add-view-text":{"type":"string","default-from":"runtime.add-view-text"},"new-view-text":{"type":"string","default-from":"runtime.new-view-text"},"delete-view-text":{"type":"string","default-from":"runtime.delete-view-text"},"last-shared-view-text":{"type":"string","default-from":"runtime.last-shared-view-text"},"full":{"type":"boolean","default":false},"open":{"type":"boolean","default":true},"edit":{"type":"enum","values":["group","group+quick","none"],"default":"group+quick"},"history":{"type":"enum","values":["auto","off"],"default":"auto"},"modal":{"type":"enum","values":["auto","true"],"default":"auto"}},"values":{"revision":{"type":"string"},"section":{"type":"string"}},"events":{"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","deleted","api"]},"record_id":{"type":"id","nullable":true},"unsaved_fields":{"type":"list"},"asked":{"type":"boolean"}},"cancelable":true},"open-full":{"carries":{"id":"id","address":"string","record_id":{"type":"id","nullable":true}}},"saved":{"carries":{"id":"id","revision":{"type":"string","optional":true}}},"failed":{"carries":{"reason":"string","message":{"type":"string","optional":true}}},"open":{"carries":{"field":"string","value":"object","answer":"string"}},"delete":{"carries":{"collection":"string","revision":"string","answer":"string","record_id":{"type":"id","nullable":true}}},"created":{"carries":{"collection":{"type":"string","nullable":true},"record_id":{"type":"id","nullable":true}}},"cancel":{"carries":{"mode":{"type":"enum","values":["auto","edit","create"]},"scope":{"type":"enum","values":["group"],"optional":true},"section":{"type":"string","optional":true},"group":{"type":"string","optional":true}}},"state":{"carries":{"state":"string","message":"string"},"own-verb":true},"address-copy":{"carries":{},"own-verb":true},"favourite":{"carries":{"collection":{"type":"string","nullable":true},"favourite":"boolean","record_id":{"type":"id","nullable":true}},"own-verb":true},"step":{"carries":{"direction":{"type":"enum","values":["next","previous"]},"record_id":{"type":"id","nullable":true},"next_record_id":{"type":"id","nullable":true}},"cancelable":true,"own-verb":true},"history":{"carries":{"record_id":{"type":"id","nullable":true}},"own-verb":true},"structure":{"carries":{"collection":{"type":"string","nullable":true},"section":{"type":"string","nullable":true},"group":{"type":"string","nullable":true}},"own-verb":true,"cancelable":true}},"actions":{"refresh":{},"load":{"with":{"reason":{"type":"string","optional":true}}},"edit-group":{"with":{"section":"string","group":"string","options":{"type":"object","optional":true}}},"cancel-edit":{},"save-group":{"with":{"options":{"type":"object","optional":true}},"concurrency":"drop"},"select-section":{"with":{"key":"string"}},"close-panel":{"with":{"reason":{"type":"string","optional":true}}},"copy-address":{},"open-full-page":{},"confirm-save":{},"cancel-confirmation":{},"open-history":{},"edit-field":{"with":{"key":"string"}},"step":{"with":{"direction":{"type":"enum","values":["next","previous"]}}}},"port":{"id":"simai.property-view-port","version":"1.18.0","contract":"src/core/contracts/ports/simai.property-view-port/1.18.0/port.json"},"presentation":{"skeleton":{"file":"skeleton.html","late":[]}},"css-variables":{"--sf-view-properties-label-width":{"type":"length","state":"default","x-default":"10rem"},"--sf-view-properties-row-gap":{"type":"length","state":"default","x-default":"8px (--sf-space-1/3)"},"--sf-view-properties-group-gap":{"type":"length","state":"default","x-default":"24px (--sf-space-1)"},"--sf-view-properties-sections-width":{"type":"length","state":"default","x-default":"12rem"},"--sf-view-properties-side-width":{"type":"length","state":"default","x-default":"24rem"},"--sf-view-properties-current-background-color":{"type":"color","state":"default","x-default":"--sf-surface-container"},"--sf-view-properties-saved-background-color":{"type":"color","state":"default","x-default":"--sf-success-container"},"--sf-property-view--sections-width":{"type":"length","state":"default"},"--sf-property-view--title-size":{"type":"length","state":"default"},"--sf-property-view--label-size":{"type":"length","state":"default"},"--sf-property-view--value-size":{"type":"length","state":"default"},"--sf-property-view--group-size":{"type":"length","state":"default"},"--sf-property-view--edge-room":{"type":"length","state":"open"}},"host-states":{"data-state":"string","aria-busy":"string"}}');

/***/ },

/***/ "99fb492b7fba"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Property view","events":{"state":{"label":"Record state"},"address-copy":{"label":"Address copied"},"favourite":{"label":"Favourite"}},"runtime":{"add-field-text":"Add a field","add-group-text":"Add an area","add-section-text":"Add a section","add-view-text":"Add a view","back-label":"Back","cancel-configuring-text":"Cancel","cancel-name-text":"Leave the name","cancel-text":"Cancel","changed-text":"Fields changed","close-label":"Close","close-unsaved-accept-text":"Close without saving","close-unsaved-text":"There are unsaved changes","configure-hint-narrow-text":"Drag fields between groups. Applied at once.","configure-hint-text":"Drag fields between groups and onto a section on the left. Applied at once.","configure-text":"Arrange the view","confirm-save-text":"Confirm and save","conflict-text":"The record changed; read it again","copy-link-label":"Copy link","create-text":"Create","delete-text":"Delete","delete-view-text":"Remove the view","done-configuring-text":"Done","edit-all-text":"Edit all","edit-text":"Edit","empty-record-text":"This record has nothing to show","empty-text":"not filled in","errors-text":"Errors","favourite-label":"Favourite","field-label-text":"Name","field-settings-text":"Field settings","hidden-text":"Hide","hide-rare-text":"Hide rare fields","hint-text":"Hint","history-all-text":"All events","history-changed-many-text":"changed {n} fields","history-changed-one-text":"changed «{field}»","history-create-text":"created the record","history-delete-text":"deleted the record","history-empty-text":"No changes yet","history-failed-text":"The history could not be loaded","history-fields-text":"Field changes only","history-publish-text":"published the record","history-restore-text":"restored the record","history-sealed-text":"Value hidden: {fields}","history-text":"Change history","in-this-group-text":"In this area","inherited-text":"by default","keep-editing-text":"Keep editing","last-shared-view-text":"The only view everyone has","leave-unsaved-text":"Go on without saving","link-copied-label":"Link copied","menu-label":"More","move-down-text":"Move down","move-up-text":"Move up","new-group-title":"New area","new-section-title":"New section","new-view-text":"New view","no-match-text":"Nothing matches","open-full-label":"Open as a page","personal-layer-text":"Personal","rare-text":"rare","read-only-text":"You can only view this record","remove-field-text":"Remove from this area","remove-group-text":"Remove this area","remove-section-text":"Remove this section","rename-text":"Rename","required-error-text":"Fill in this field","reset-view-ask-text":"Reset the whole view?","reset-view-text":"Back to everyone\'s","save-failed-text":"The save failed","save-name-text":"Save the name","save-text":"Save","section-icon-text":"Section glyph","sections-label":"Sections","shared-layer-text":"Everyone\'s","show-rare-text":"Show rare fields","shown-text":"Shown","state-load-failed":"The record could not be read","state-loading":"Reading the record","state-port-not-connected":"The record port is not connected","state-unavailable":"The record is unavailable","unplaced-hint-text":"Fields this view does not show. Drag a field into an area or press the eye to show it.","unplaced-title":"Hidden fields","variant-text":"Template","view-conflict-text":"The view changed and was read again","view-denied-text":"You may not change this layer","view-profile-label":"View","view-reset-failed-text":"The view could not be reset","view-save-failed-text":"The view could not be saved","width-text":"Full width","view-published-text":"Saved for everyone","view-changed-text":"The view changed","save-as-mine-text":"Save as mine","save-as-mine-label-text":"{name} (mine)","publish-view-text":"Save for everyone","undo-mine-text":"Undo my edits","tab-rename-text":"Name…","tab-icon-text":"Icon…","tab-up-text":"Up","tab-down-text":"Down","tab-hide-text":"Hide the tab","tab-show-text":"Show the tab","tab-delete-text":"Delete the tab…","tab-menu-text":"Settings of the tab «{name}»","tab-hidden-text":"The tab is hidden","tabs-title":"Tabs","tabs-hint-text":"Drag by the handle to change the order","add-tab-text":"Tab","new-tab-group-title":"Fields","lock-text":"Lock for changes","unlock-text":"Unlock for changes","locked-text":"Locked by the administrator","field-menu-text":"Settings of the field «{name}»","head-subtitle-on-text":"Show in the head","head-subtitle-off-text":"Remove from the head","head-status-on-text":"As the stage in the head","head-status-off-text":"Remove the stage from the head","to-tab-text":"To the tab «{name}»","hide-field-text":"Hide «{name}»","show-field-text":"Show «{name}»","configure-personal-hint-text":"Your edits are saved at once, for you only.","configure-admin-hint-text":"Your edits are saved at once, for you only. For everyone, with the button below.","configure-required-hint-text":"This view is required. Edits stay until you leave the page.","new-field-text":"New field…","view-refused-invalid-text":"The view was not saved: its settings do not fit","view-refused-shared-denied-text":"You may not set the view for everyone","view-refused-own-text":"This is a person\'s own view, not a view for everyone","view-refused-unknown-text":"This view no longer exists","view-refused-required-text":"This card has a required view: it cannot be changed or replaced","view-refused-lock-invalid-text":"This setting cannot be locked","view-refused-head-invalid-text":"The head takes up to two fields, and the status is a field with a list of values","view-refused-icon-invalid-text":"This tab icon is unknown"}}');

/***/ },

/***/ "d614908e644f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Запись","events":{"state":{"label":"Состояние записи"},"address-copy":{"label":"Адрес скопирован"},"favourite":{"label":"Избранное"}},"runtime":{"add-field-text":"Добавить поле","add-group-text":"Добавить область","add-section-text":"Добавить раздел","add-view-text":"Добавить вид","back-label":"Назад","cancel-configuring-text":"Отменить","cancel-name-text":"Оставить название","cancel-text":"Отмена","changed-text":"Изменено полей","close-label":"Закрыть","close-unsaved-accept-text":"Закрыть без сохранения","close-unsaved-text":"Есть несохранённые изменения","configure-hint-narrow-text":"Перетаскивайте поля между группами. Применяется сразу.","configure-hint-text":"Перетаскивайте поля между группами и на разделы слева. Применяется сразу.","configure-text":"Настроить вид","confirm-save-text":"Подтвердить и сохранить","conflict-text":"Запись изменилась, обновите её","copy-link-label":"Копировать ссылку","create-text":"Создать","delete-text":"Удалить","delete-view-text":"Удалить вид","done-configuring-text":"Готово","edit-all-text":"Изменить всё","edit-text":"Изменить","empty-record-text":"В этой записи нечего показать","empty-text":"не заполнено","errors-text":"Ошибок","favourite-label":"В избранное","field-label-text":"Название","field-settings-text":"Настройки поля","hidden-text":"Скрыть","hide-rare-text":"Скрыть редкие поля","hint-text":"Подсказка","history-all-text":"Все события","history-changed-many-text":"изменение полей: {n}","history-changed-one-text":"изменение поля «{field}»","history-create-text":"создание записи","history-delete-text":"удаление записи","history-empty-text":"Изменений пока нет","history-failed-text":"Историю не удалось загрузить","history-fields-text":"Только изменения полей","history-publish-text":"публикация записи","history-restore-text":"восстановление записи","history-sealed-text":"Значение скрыто: {fields}","history-text":"История изменений","in-this-group-text":"В этой области","inherited-text":"по умолчанию","keep-editing-text":"Вернуться к правке","last-shared-view-text":"Единственный общий вид","leave-unsaved-text":"Перейти без сохранения","link-copied-label":"Ссылка скопирована","menu-label":"Ещё","move-down-text":"Ниже","move-up-text":"Выше","new-group-title":"Новая область","new-section-title":"Новый раздел","new-view-text":"Новый вид","no-match-text":"Ничего не найдено","open-full-label":"Открыть на всю страницу","personal-layer-text":"Персональный","rare-text":"редкое","read-only-text":"Эту запись можно только смотреть","remove-field-text":"Убрать из области","remove-group-text":"Удалить область","remove-section-text":"Удалить раздел","rename-text":"Переименовать","required-error-text":"Заполните поле","reset-view-ask-text":"Сбросить весь вид?","reset-view-text":"Вернуть как у всех","save-failed-text":"Не удалось сохранить","save-name-text":"Сохранить название","save-text":"Сохранить","section-icon-text":"Значок раздела","sections-label":"Разделы","shared-layer-text":"Для всех","show-rare-text":"Показать редкие поля","shown-text":"Показывать","state-load-failed":"Не удалось загрузить запись","state-loading":"Загрузка записи","state-port-not-connected":"Порт записи не подключён","state-unavailable":"Запись недоступна","unplaced-hint-text":"Поля, которые этот вид не показывает. Перетащите поле в группу или нажмите на глаз, чтобы показать.","unplaced-title":"Скрытые поля","variant-text":"Вид","view-conflict-text":"Вид изменился, он перезагружен","view-denied-text":"Нет права менять этот слой","view-profile-label":"Вид","view-reset-failed-text":"Не удалось сбросить вид","view-save-failed-text":"Не удалось сохранить вид","width-text":"На всю ширину","view-published-text":"Сохранено для всех","view-changed-text":"Вид изменился","save-as-mine-text":"Сохранить как моё","save-as-mine-label-text":"{name} (моё)","publish-view-text":"Сохранить для всех","undo-mine-text":"Отменить мои правки","tab-rename-text":"Название…","tab-icon-text":"Значок…","tab-up-text":"Выше","tab-down-text":"Ниже","tab-hide-text":"Скрыть вкладку","tab-show-text":"Показать вкладку","tab-delete-text":"Удалить вкладку…","tab-menu-text":"Настройки вкладки «{name}»","tab-hidden-text":"Вкладка скрыта","tabs-title":"Вкладки","tabs-hint-text":"Перетащите за ручку, чтобы поменять порядок","add-tab-text":"Вкладка","new-tab-group-title":"Поля","lock-text":"Закрыть для изменений","unlock-text":"Открыть для изменений","locked-text":"Закрыто администратором","field-menu-text":"Настройки поля «{name}»","head-subtitle-on-text":"Показать в шапке","head-subtitle-off-text":"Убрать из шапки","head-status-on-text":"Стадией в шапке","head-status-off-text":"Убрать стадию из шапки","to-tab-text":"На вкладку «{name}»","hide-field-text":"Скрыть «{name}»","show-field-text":"Показать «{name}»","configure-personal-hint-text":"Ваши правки сохраняются сразу, только для вас.","configure-admin-hint-text":"Ваши правки сохраняются сразу, только для вас. Для всех — кнопкой внизу.","configure-required-hint-text":"Вид обязательный. Правки видны до ухода со страницы.","new-field-text":"Новое поле…","view-refused-invalid-text":"Вид не сохранён: настройки не подходят","view-refused-shared-denied-text":"Нет права настраивать вид для всех","view-refused-own-text":"Это личный вид, а не вид для всех","view-refused-unknown-text":"Такого вида больше нет","view-refused-required-text":"У этой карточки обязательный вид: его нельзя менять или заменить","view-refused-lock-invalid-text":"Эту настройку нельзя закрыть","view-refused-head-invalid-text":"В заголовке не больше двух полей, а статус — поле со списком значений","view-refused-icon-invalid-text":"Неизвестный значок вкладки"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("7623a90f1816");
/******/
/******/ })()
;