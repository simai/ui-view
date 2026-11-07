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

/***/ "1b42c5117087"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICON_CHOICES: () => (/* binding */ ICON_CHOICES),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
// component imports ICON_CHOICES; a page reads SF.icons.choices. The choice
// itself is drawn by sf-dropdown with options of kind icon (layout grid,
// search), as sf-view-properties and sf-admin-menu do.
const ICON_CHOICES = Object.freeze(["folder", "folder_open", "topic", "home", "dashboard", "apartment", "store", "storefront", "business_center", "work", "badge", "person", "group", "groups", "account_circle", "manage_accounts", "supervisor_account", "contacts", "school", "menu_book", "assignment", "task", "description", "article", "note_alt", "edit_note", "draft", "receipt", "receipt_long", "request_quote", "inventory_2", "category", "label", "sell", "local_offer", "shopping_cart", "shopping_bag", "payments", "savings", "credit_card", "account_balance", "calculate", "percent", "trending_up", "analytics", "insights", "monitoring", "bar_chart", "pie_chart", "table_chart", "schedule", "event", "today", "calendar_month", "date_range", "history", "alarm", "timer", "update", "hourglass_top", "mail", "outgoing_mail", "chat", "forum", "sms", "call", "phone_in_talk", "contact_support", "campaign", "notifications", "language", "public", "place", "map", "location_on", "travel_explore", "flight", "local_shipping", "route", "directions", "settings", "tune", "build", "construction", "handyman", "code", "terminal", "data_object", "api", "bug_report", "database", "storage", "cloud", "backup", "sync", "folder_zip", "upload_file", "download", "attach_file", "link", "lock", "lock_open", "shield", "verified_user", "key", "admin_panel_settings", "policy", "gavel", "fingerprint", "visibility", "palette", "format_paint", "image", "photo_library", "collections", "movie", "play_circle", "mic", "headphones", "brush"]); // Core publishes the list; a component bundle that carries its own copy reuses
// the published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  globalThis.SF.icons = globalThis.SF.icons || {};
  if (!globalThis.SF.icons.choices) globalThis.SF.icons.choices = ICON_CHOICES;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ICON_CHOICES);

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
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_unsafe_html_js__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
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
  color: renderColorFilterControl
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
  html: renderHtmlCell
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
// sf-input, no data-*, no text node, no log. «Показать» is an icon button that
// switches the input's type and says so with its pressed setting (aria-pressed); it changes the DOM
// directly, so a host's re-render (its attributes are static in the template)
// leaves the person's choice as it is.


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

function togglePasswordShown(event) {
  const button = event.currentTarget;
  const input = button?.closest?.('.sf-field-password')?.querySelector?.('sf-input');
  if (!input) return;
  const shown = button.getAttribute('pressed') === 'false';
  input.setAttribute('input-type', shown ? 'text' : 'password');
  button.setAttribute('pressed', shown ? '' : 'false');
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
                    pressed="false"
                    aria-label=${setText(host, 'showPassword')}
                    @click=${togglePasswordShown}
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
}

function renderNumberEdit(field, value, host) {
  if (isStepperField(field)) return renderStepperEdit(field, value, host);
  const decimal = (field.propertyType || field.type) === 'number';
  value = scalarValue(value);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                size=${EDIT_SIZE}
                appearance="bordered"
                name=${fieldName(field)}
                value=${value ?? ''}
                inputmode=${decimal ? 'decimal' : 'numeric'}
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
    maskIncomplete: 'Complete the field'
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
    maskIncomplete: 'Заполните поле полностью'
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
  const badge = (0,_helpers_option_badge_js__WEBPACK_IMPORTED_MODULE_2__.optionBadgeProps)(option);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-badge
                line=${VIEW_LINE}
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
// type the Framework renders, its variants and the parameters a field of it
// reads -- one list a host (Larena's fields and settings), the property
// workbench and the documentation read, instead of each learning the types
// from the renderers' source. Which modes a type has is not written here: it
// is read from the renderer maps themselves (modesOf), so the registry cannot
// claim a mode the set does not draw. A contract keeps the two the same.
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
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("40b137e60526");
/* harmony import */ var _js_conditions_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("844bdc4d24eb");
/* harmony import */ var _view_table_js_format_value_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("2f31b00ad99a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__, _js_templates_default__WEBPACK_IMPORTED_MODULE_10__, _view_table_js_format_value_js__WEBPACK_IMPORTED_MODULE_12__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__, _js_templates_default__WEBPACK_IMPORTED_MODULE_10__, _view_table_js_format_value_js__WEBPACK_IMPORTED_MODULE_12__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__);
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

const SUPPORTED_PORT_VERSIONS = ["1.0.0", "1.1.0", "1.2.0", "1.3.0", "1.4.0", "1.5.0", "1.6.0", "1.7.0", "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.15.0", "1.16.0", "1.17.0"]; // The surface's mode (owner, 2026-10-14). view: show the object, never offer
// a change. auto: show it and offer what this person may do. edit: every group
// open at once, one save. create: an empty object of the collection, every
// field open, one create.

const MODES = ["view", "auto", "edit", "create"]; // The most candidates a picker asks for at once, from a host on port 1.14.0 or
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
}; // Every panel open on the page, in the order they were opened. A stack is not one
// state held for several records: each window is its own element with its own
// record, its own open group and its own unsaved changes -- which is what «такое
// же представление поверх» means, and what leaves a half-edited window intact
// underneath the one above it. What the Framework owns is the behaviour between
// them: which window Esc closes, which are dimmed, how far each is inset so the
// one below stays partly visible. That needs no shared state beyond the order.
// The same query sf-drawer docks on, written the same way so a reader grepping
// 48rem finds both. The Framework's own breakpoint array has no 48rem step -- its
// nearest is md at 720px -- but the panel *is* a drawer, and flipping the panel's
// arrangement 48px away from where the drawer changes its own behaviour would be
// visible in that gap. The split between the breakpoint array and the pixel values
// components use is reported rather than settled here.


const WIDE_MEDIA_QUERY = "(min-width: 48rem)"; // The column the list of sections takes. It is here rather than in the
// stylesheet because the panel's own width is computed from it, and the drawer
// that carries the panel is placed outside this component's subtree: a custom
// property declared on the element never reaches it. The stylesheet reads this
// through `--sf-property-view--sections-width`, which the component passes to
// the panel and sets on the layout it draws in place.

const SECTIONS_WIDTH = "14rem"; // How long the copy control shows its tick. The Framework's own clipboard holds
// its tick for this long, and two controls that say «copied» for two different
// lengths are two conventions where there is one act.

const COPY_FEEDBACK_MS = 5000;
const openPanels = [];

function topPanel() {
  return openPanels[openPanels.length - 1] ?? null;
}

function restackPanels() {
  openPanels.forEach((panel, index) => {
    panel.setAttribute("data-stack-depth", String(index));
    panel.toggleAttribute("data-stack-top", panel === topPanel());
    panel.requestComponentUpdate("stack");
  });
} // A payload is copied so that a host cannot mutate what the component still
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
const SECTION_ICONS = _core_js_icon_choices_js__WEBPACK_IMPORTED_MODULE_7__.ICON_CHOICES; // sf-view-properties from its component.json (standard simai.smart-component
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
        default: "edit"
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

    this.renaming = null; // Whether a new view's name is being typed. A view is a host record, so
    // it is made only once it has a name, never as a placeholder to rename.

    this.namingView = false; // What the arrangement was when the mode was entered, and whether a
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

    this.phoneSection = null;
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


  moveFieldToUnplaced(fieldKey, index) {
    if (!this.configuring || !this.layerDraft) return false;
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
    return this.saveView();
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
  }

  syncPanelOpen() {
    const at = openPanels.indexOf(this);

    if (this.panelOpen && this.isConnected && at < 0) {
      openPanels.push(this);
      restackPanels();
    } else if (!this.panelOpen && at >= 0) {
      openPanels.splice(at, 1);
      restackPanels();
    }

    this.requestComponentUpdate("panel-open");
  } // ---------- the manifest's values (§4) ----------


  get revision() {
    return this.record?.revision === undefined || this.record?.revision === null ? "" : String(this.record.revision);
  }

  get section() {
    return this.selectedSection ?? "";
  }

  get panelSize() {
    return this.getAttribute("panel-size") || "1";
  }

  get panelLabel() {
    return this.getAttribute("panel-label") || "";
  }

  get panelWidth() {
    return this.getAttribute("panel-width") || "";
  }

  get size() {
    return this.getAttribute("size") === "1/2" ? "1/2" : "1";
  }

  get mode() {
    const value = this.getAttribute("mode");
    return MODES.includes(value) ? value : "auto";
  } // Whether this person may change the fields. A view surface never offers
  // it; since port 1.12.0 the host says so with record.edit among the
  // record's actions, and a reader is sent none. A host on an earlier port
  // never sent it, and for it a group is editable unless it says otherwise.


  get mayEdit() {
    if (this.mode === "view") return false;
    if (this.mode === "create") return true;
    if (!versionAtLeast(this.hostPort?.version, "1.12.0")) return true;
    return this.recordActions.includes("record.edit");
  } // Every group open at once: a full edit page, or a create.


  get openAll() {
    return this.mode === "create" || this.mode === "edit" && this.mayEdit;
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
    const width = this.panelWidth;
    if (!width) return null;
    if (!this.wide) return width; // The rail is drawn while the view is arranged even with one section,
    // because that is where a second one is made.

    const railed = this.sectionsAs === "list" && ((this.sections ?? []).length >= 2 || this.configuring);
    const wanted = railed ? `calc(${width} + ${SECTIONS_WIDTH} + var(--sf-space-4))` : width; // Never wider than the window: grown by the rail, a 40rem panel ran past
    // the left edge and its sections were cut off (owner, 2026-10-14).

    return `min(${wanted}, calc(100vw - ${this.edgeRoom}))`;
  } // One edge control: an sf-button-icon of the panel's size is its text
  // height and the ladder's padding on each side, the same sum the button
  // draws itself with (40px at size 1 on a desktop, 36px on a phone).


  get edgeControlWidth() {
    const step = this.size === "1/2" ? "1\\/2" : "1";
    return `calc(var(--sf-text-height-${step}) + 2 * var(--sf-ui-${step}--space-y-tightness-default))`;
  } // What the strip beside a wide panel takes from the window: the drawer's
  // step between the panel and the strip (space-1/2), one control, and the
  // same step again to the window's edge.


  get edgeRoom() {
    return `calc(${this.edgeControlWidth} + 2 * var(--sf-space-1\\/2))`;
  } // How many controls the strip carries: close always, copy-link with an
  // address, open-full when the host can open the record as a page.


  get edgeControlCount() {
    return 1 + (this.address ? 1 : 0) + (this.canOpenFullPage ? 1 : 0);
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
    }

    menu.setAttribute("aria-label", label ?? "");
    menu.entries = entries;
    this._standardMenuSelect = select;
    this._standardMenuAnchor = anchor;
    return menu.openFor(anchor, {
      align
    });
  } // The views as radio rows: which one is in use, and whose it is.


  viewProfileEntries() {
    const current = this.viewProfile;
    return this.viewProfiles.map(profile => ({
      id: `view-profile:${profile.id}`,
      text: profile.label,
      kind: "radio",
      checked: profile.id === current,
      icon: profile.shared ? "group" : "person",
      caption: profile.shared ? this.sharedLayerText : this.personalLayerText
    }));
  }

  openPanelMenu(anchor) {
    const entries = [];
    const profiles = this.viewProfiles; // The view is chosen from the menu as the admin menu's profile is: a
    // submenu of the views, beside what can be done to the view (owner,
    // 2026-10-12). While arranging, the bar at the foot carries the choice.

    if (profiles.length > 1 && !this.configuring) {
      const current = profiles.find(profile => profile.id === this.viewProfile);
      entries.push({
        id: "view-profile",
        text: this.viewProfileLabel,
        icon: "view_sidebar",
        value: current?.label ?? "",
        submenu: this.viewProfileEntries()
      });
    }

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
    if (!entries.length) return null;
    return this.openStandardMenu(anchor, {
      label: this.menuLabel,
      entries,
      select: id => this._chooseStandardEntry(id)
    });
  }

  openViewProfileMenu(anchor) {
    return this.openStandardMenu(anchor, {
      label: this.viewProfileLabel,
      entries: this.viewProfileEntries(),
      align: "start",
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

    if (value.startsWith("view-profile:")) return this.selectViewProfile(value.slice("view-profile:".length));
    return this.chooseMenuItem(value);
  }

  chooseMenuItem(id) {
    if (id === "configure") return this.startConfiguringView();
    if (id === "reset") return this.resetView();
    if (id === "show-rare") return this.toggleShowRare();
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
  }

  onConnected() {
    super.onConnected?.(); // Born loading. The first render comes before the host is asked, and
    // drawn with no state it was the empty body -- one frame of «nothing
    // here» before the skeleton, the flash the table had (rules of the
    // road, rule 2: loading is drawn as the skeleton, from the first frame).

    if (!this.hasAttribute("data-state") && !this.record) {
      this.setAttribute("data-state", "loading");
      this.setAttribute("aria-busy", "true");
    }

    if (this.panelOpen && !openPanels.includes(this)) {
      openPanels.push(this);
      restackPanels();
    } // The drawer's own close-on-esc is off, because in a stack Esc must close
    // the top window and not every one of them.
    //
    // The listener is on the document rather than on the element, and that is
    // not a preference: sf-drawer portals its content out, so an open panel is
    // not a descendant of this element at all. On the element the handler
    // would never have fired from a real keypress -- only from an event
    // dispatched at the element itself, which is exactly what the first probe
    // did, so it passed while the feature did not work.
    //
    // It acts only when the focus is inside this panel, or when nothing is
    // focused. With a stack the top window is the one holding focus, so the
    // same rule closes the right window then too.


    this._onKeyDown = event => {
      if (event.key !== "Escape" || !this.panel) return; // A surface opened inside this panel takes the press. Both listen on
      // the document in capture, where stopPropagation cannot reach a
      // listener on the same node, so the one that opened last says so on
      // the root and this one stands back.

      if (document.documentElement.dataset.sfPopoverOpen) return; // An open field-settings surface takes the first Esc. Both handlers
      // sit on the document in capture, where stopPropagation does not
      // reach a listener on the same node -- so the two share one.
      // The top window, and no other. The first version guessed from where
      // the focus happened to be, which was the best a single panel could
      // do; with the order known the guess is gone.

      if (topPanel() !== this) return;
      event.stopPropagation();
      this.closePanel("escape");
    };

    document.addEventListener("keydown", this._onKeyDown, true); // The drop is sf-sortable's to report and the component's to apply or
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

    this.wideMedia?.addEventListener?.("change", this._onWideChange); // A view placed before it is told its record (an assembly binds
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
    const at = openPanels.indexOf(this);

    if (at >= 0) {
      openPanels.splice(at, 1);
      restackPanels();
    }

    if (this._onKeyDown) document.removeEventListener("keydown", this._onKeyDown, true);
    this._onKeyDown = null; // The settings surface listens on the document, so a panel that goes away
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
    .filter(entry => !values || !entry.when || (0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_11__.fieldConditions)(entry, values).visible);
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
    const decided = (0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_11__.fieldConditions)(field, values);
    return { ...field,
      required: decided.required,
      readonly: field.readonly === true || !decided.enabled
    };
  } // The keys of the fields their conditions hide now.


  _hiddenByCondition() {
    const values = this.fieldValues();
    const hidden = new Set();

    const check = field => {
      if (field?.when && !(0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_11__.fieldConditions)(field, values).visible) hidden.add(String(field.key));
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
        if (typeof own === "string") return own;
        const type = field?.propertyType ?? field?.property_type ?? field?.type ?? field?.dataType;
        return (0,_view_table_js_format_value_js__WEBPACK_IMPORTED_MODULE_12__.formatDateValue)(type, value, this) || undefined;
      }
    });
    this._viewHost = {
      host,
      view
    };
    return view;
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      hostPort: this.hostPort,
      viewHost: this.viewHost,
      size: this.size,
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
      // host answers it with the record (port 1.14.0 record.label).
      recordLabel: this.record?.label ? String(this.record.label) : "",
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
      inputsInvalid: this.inputErrors.size > 0,
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
      stackDepth: this.stackDepth,
      drawerWidth: this.drawerWidth,
      sectionsWidth: SECTIONS_WIDTH,
      isTopPanel: this.isTopPanel,
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
      namingView: this.namingView,
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
      edgeControlWidth: this.edgeControlWidth,
      edgeControlCount: this.edgeControlCount,
      phoneSection: this.phoneSection,
      phoneSectionLabel: this.phoneSectionLabel,
      backLabel: this.backLabel
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_10__.renderPropertyViewTemplate)(this.templateContext());
  } // A printed skeleton (data-sf-first-paint="skeleton", skeleton.html) stays
  // until the record comes through the port (standard 1.3.8 §5.4): the first
  // render then draws the record over it in one frame. A panel draws in its
  // drawer, so it renders at once.


  sfAwaitingData() {
    if (this.getAttribute("data-sf-first-paint") !== "skeleton" || this.panel) return false;
    return !this.record && !this.loadFailure && this.getAttribute("data-state") !== "error";
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
      }

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
  }

  get stackDepth() {
    const at = openPanels.indexOf(this);
    return at < 0 ? 0 : at;
  }

  get isTopPanel() {
    return topPanel() === this;
  } // What a panel's three controls do, and all three are the host's decisions
  // announced rather than carried out here. The component closes itself, says
  // what was copied, and says what should be opened; where a window goes, and
  // whether it may close over unsaved edits, belongs to whoever placed it.


  closePanel(reason = "close") {
    this._commitFocusedEntry();

    const unsaved = this.unsavedFields; // A cancelable request (vocabulary §5 close, standard 1.3.8 §19.3): the
    // page decides whether it closes; a listener may refuse it.

    const allowed = this.sfEmit("close", {
      reason,
      record_id: this.recordId || null,
      unsaved_fields: unsaved
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
  } // Copying is sf-button-copy's (owner, 2026-10-14): one implementation of
  // the act, its tick and its spoken result, with the Framework's fallback
  // for a browser that refuses the clipboard. The view keeps only what it
  // says about it.
  // The control stands on the drawer's outer edge, which may be outside this
  // element, so it carries the view it belongs to.


  copyControl() {
    return [...document.querySelectorAll('sf-button-copy[data-action="copy-link"]')].find(control => control.propertyView === this) ?? null;
  }

  get addressCopied() {
    return this.copyControl()?.state?.phase === "success";
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
    const control = this.copyControl();
    if (!control?.copy) return null;
    return Boolean(await control.copy());
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
    return Boolean(field?.when) && !(0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_11__.fieldConditions)(field, values).enabled;
  } // An entry that is not a value yet stops a save, and says so where it is.


  _inputsInvalid() {
    if (!this.inputErrors.size) return null;
    this.requestComponentUpdate("errors");
    return {
      answer: "refused",
      reason: "input_invalid",
      errors: Object.fromEntries(this.inputErrors)
    };
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

  editGroup(section, group) {
    if (!this.mayEdit) return this;
    this.editing = {
      section: String(section),
      group: String(group)
    };
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
    // Cancel drops what was typed and writes nothing. Data is saved by the
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
  }

  async saveGroup({
    confirm = null
  } = {}) {
    if (this.openAll) return this.saveAll({
      confirm
    });
    if (this.editing && this.inputErrors.size) return this._inputsInvalid();
    if (!this.editing || this.changed.size === 0) return null;

    const values = this._savedValues();

    if (!Object.keys(values).length) return null;
    this.confirmation = null;
    const epoch = ++this.epoch;
    const answer = await this._raise("group.save", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      section: this.editing.section,
      group: this.editing.group,
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

      this.editing = null;
      this.changed.clear();

      this._clearInputs();

      this.errors.clear();
      this.conflict = null;

      this._setState("ready");

      this.announceSaved(answer);
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
      this.errors = new Map(Object.entries(answer.errors ?? {}).map(([key, value]) => [key, String(value)]));
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
    if (this.inputErrors.size) return this._inputsInvalid();
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
      this.changed.clear();

      this._clearInputs();

      this.errors.clear();
      this.conflict = null;

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

    if (this.namingView) {
      this.namingView = false;
      this.requestComponentUpdate("view-naming");
    }

    return this._viewProfileIntent("view.create", {
      label: name,
      shared: Boolean(shared),
      view: this.layerDraft ?? this._layerCopy(this.viewTarget)
    });
  } // «Add a view» asks for the name first. Making «New view» at once wrote a
  // view nobody had named, switched to it, and left a placeholder behind
  // when the person did not rename it (simai.main QA, 2026-10-27).


  startNamingView() {
    this.namingView = true;
    this.requestComponentUpdate("view-naming");
    return true;
  }

  cancelNamingView() {
    this.namingView = false;
    this.requestComponentUpdate("view-naming");
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
      this._setState("error", answer.message || this.viewDeniedText);

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
      this._setState("error", answer.message || this.viewDeniedText);

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
  } // The layer a view is written to is the view's own: a shared view is the
  // shared layer, a personal one the personal layer, when this person may
  // write it.


  _layerOfProfile() {
    const profile = this.viewProfiles.find(item => item.id === this.viewProfile);
    const wanted = profile?.shared ? "shared" : "personal";
    return this.editableLayers.includes(wanted) ? wanted : this.viewTarget;
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
    this.layerDraft = this._layerCopy(this.viewTarget);

    this._bindSectionDropTarget();

    this.entryErrors = new Map();
    this.cancelEdit();
    this.requestComponentUpdate("configuring"); // Arranging shows every group; those not read yet are read now.

    this._readShownGroups("started");

    this._focusAfterRender(['.sf-property-view-configure-bar [data-action="view-profile"]', ".sf-property-view-configure-bar"]);

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
    if (!this.configuring) return false;
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
      // sf-tree 2.0 draws its entries as rows of class markup, each named
      // by data-value (the section key).

      const item = under?.closest?.("[data-section-tab], .sf-tree-item[data-value]"); // Another panel's list is not this panel's drop target. The drawer
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
        const key = item.getAttribute("data-section-tab") ?? item.getAttribute("data-value");
        if (key === this.selectedSection) return null; // A tree row's own box holds its children too; the line the
        // indicator marks is the row's container.

        const shown = item.matches("[data-section-tab]") ? item : item.querySelector(":scope > .sf-tree-item-container") || item;
        return {
          descriptor: {
            section: key
          },
          rect: shown.getBoundingClientRect(),
          label: item.querySelector(":scope > .sf-tree-item-container > .sf-tree-item-name")?.textContent?.trim() || item.textContent?.trim() || key
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

    const allowed = ["width", "variant", "hint", "label"];
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
  } // A section is removed the same way, and every area it held goes with it:
  // the areas are kept, moved to the section that remains, so an arrangement
  // is not thrown away by removing the tab it sat behind.


  removeSection(sectionKey) {
    if (!this.configuring || !this.layerDraft) return false;
    const name = String(sectionKey);
    const section = this.sections.find(part => String(part.key) === name);
    if (!section || !this.canChangeVisibility(section)) return false;
    if (this.sections.length < 2) return false;
    const into = this.sections.find(part => part !== section);

    for (const group of [...(section.groups ?? [])]) {
      this.moveGroup(String(group.key), String(into.key), Number.MAX_SAFE_INTEGER);
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
  }

  addSection() {
    if (!this.configuring || !this.layerDraft) return false;

    const key = this._newEntryKey("section");

    const section = {
      key,
      label: this.newSectionTitle,
      groups: [],
      hidden: false,
      rare: false
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
    if (!this.canConfigureView || !this.layerDraft) return null;
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
      this.entryErrors = new Map(Object.entries(answer.entry_errors ?? {}).map(([key, value]) => [key, String(value)]));
      await this.load("view-refused");
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this));

    return answer;
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

    await (this._viewWriting ?? Promise.resolve());
    const kind = this.viewTarget;
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

/***/ "d69ebe7e288e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   currencyOf: () => (/* binding */ currencyOf),
/* harmony export */   formatMoney: () => (/* binding */ formatMoney),
/* harmony export */   moneyParts: () => (/* binding */ moneyParts),
/* harmony export */   percentText: () => (/* binding */ percentText)
/* harmony export */ });
/* harmony import */ var _decimal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f44b979883f0");
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
}
function percentText(value, locale) {
  const number = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.formatDecimal)(value, locale);
  if (!number) return ''; // ru-RU writes «12,5 %», en «12.5%»: the space is the locale's, read from Intl.

  let spaced = false;

  try {
    spaced = new Intl.NumberFormat(locale, {
      style: 'percent'
    }).formatToParts(0.5).some(part => part.type === 'literal' && /\s/u.test(part.value));
  } catch {
    spaced = false;
  }

  return `${number}${spaced ? ' ' : ''}%`;
}

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
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

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
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
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
                    appearance="outlined"
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
            <sf-button-icon size="1/2" appearance="link" scheme="secondary" icon="keyboard_arrow_up"
                    data-action="row-up" ?disabled=${index === 0 || index >= rows.length}
                    title=${word(node, 'rowUp')} aria-label=${word(node, 'rowUp')}
                    @click=${() => {
    const next = rows.slice();
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    reshape(next);
  }}></sf-button-icon>
            <sf-button-icon size="1/2" appearance="link" scheme="secondary" icon="keyboard_arrow_down"
                    data-action="row-down" ?disabled=${index >= rows.length - 1}
                    title=${word(node, 'rowDown')} aria-label=${word(node, 'rowDown')}
                    @click=${() => {
    const next = rows.slice();
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    reshape(next);
  }}></sf-button-icon>
            <sf-button-icon size="1/2" appearance="link" scheme="secondary" icon="delete"
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
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("9e9dad7bcc09");
/* harmony import */ var _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e5483002f3ea");
/* harmony import */ var _field_value_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("62c5c417c97d");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__, _field_value_js__WEBPACK_IMPORTED_MODULE_3__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _field_renderers_index_js__WEBPACK_IMPORTED_MODULE_2__, _field_value_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
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


function renderConfigureBar(context) {
  if (!context.canConfigureView) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Not configuring: nothing is drawn. Entering is the «⋯» menu's, as the mockup
  // has it -- a standalone «Настроить вид» link stood as its own band under the
  // head and was one of the two empty-looking rows the owner saw.

  if (!context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // One row of controls and nothing else: the view being arranged and the
  // way out. Whose copy is written follows from the view itself -- a view
  // for everyone is written for everyone, a personal one for its person --
  // so the «Персональный / Для всех» toggle that stood beside the chooser
  // said the same thing twice and is gone (owner, 2026-10-14).
  // Which named view is being arranged, chosen, made, renamed and removed in
  // the Framework's profile picker (owner, 2026-10-14) -- the one the admin
  // menu's profiles use.

  const writable = context.editableLayers ?? [];
  const chooser = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-profile-picker
                size=${context.size}
                data-action="view-profile"
                label=${context.viewProfileLabel}
                current=${context.viewProfile ?? ''}
                .profiles=${(context.viewProfiles ?? []).map(profile => ({
    id: profile.id,
    label: profile.label,
    shared: Boolean(profile.shared),
    editable: writable.includes(profile.shared ? 'shared' : 'personal') && (!profile.shared || context.canDeleteViewProfile(profile.id))
  }))}
                .rights=${{
    create: {
      personal: writable.includes('personal'),
      shared: writable.includes('shared')
    }
  }}
                @sf-profile-picker-select=${event => context.component.selectViewProfile(event.detail.id)}
                @sf-profile-picker-create=${event => context.component.createViewProfile(event.detail.label, {
    shared: event.detail.shared
  })}
                @sf-profile-picker-rename=${event => context.component.renameViewProfile(event.detail.id, event.detail.label)}
                @sf-profile-picker-delete=${event => context.component.deleteViewProfile(event.detail.id)}
        ></sf-profile-picker>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions sf-property-view-configure-bar flex items-cross-center gap-2 flex-wrap"
             data-configuring="true" role="group"
             aria-label=${context.configureText}>
            ${chooser}
            <span class="grow"></span>
            ${context.resetAsked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <span class="sf-property-view-reset-ask color-error">${context.resetViewAskText}</span>
                        <sf-button
                                appearance="link"
                                size=${context.size}
                                status="error"
                                text=${context.resetViewText}
                                data-action="reset-view-confirm"
                                @click=${() => context.component.resetView()}
                        ></sf-button>
                        <sf-button
                                appearance="outline"
                                size=${context.size}
                                text=${context.cancelConfiguringText}
                                data-action="reset-view-cancel"
                                @click=${() => context.component.cancelReset()}
                        ></sf-button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <!-- Reset, cancel, done: the further a control reaches, the
                             quieter it is drawn. Reset takes the whole layer away
                             and asks first; cancel puts back the arrangement this
                             mode was entered with; done keeps what is there. -->
                        <sf-button
                                appearance="link"
                                size=${context.size}
                                text=${context.resetViewText}
                                data-action="reset-view"
                                @click=${() => context.component.askReset()}
                        ></sf-button>
                        <sf-button
                                appearance="outline"
                                size=${context.size}
                                text=${context.cancelConfiguringText}
                                data-action="cancel-configuring"
                                @click=${() => context.component.cancelConfiguringView()}
                        ></sf-button>
                        <sf-button
                                appearance="default"
                                size=${context.size}
                                text=${context.doneConfiguringText}
                                data-action="done-configuring"
                                @click=${() => context.component.stopConfiguringView()}
                        ></sf-button>`}
        </div>
    `;
} // Width, template variant and hint sit behind the field's own settings rather
// than under every field at once. Drawn under each field they were four controls
// per row, so a group of eight fields was thirty-two controls and the
// arrangement -- the thing being edited -- could no longer be read.


function renderFieldSettings(context, field, key) {
  const variants = Array.isArray(field.variantOptions) ? field.variantOptions : [];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-popover placement="bottom-end" width="16rem" label=${context.fieldSettingsText}
                    data-settings-for=${key}>
            <sf-button-icon
                    slot="trigger"
                    size="1/2"
                    appearance="link"
                    scheme="secondary"
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
                ${variants.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <label class="sf-property-view-settings-row flex items-cross-center justify-between gap-1">
                                <span class="sf-property-view-settings-label color-on-surface-variant">${context.variantText}</span>
                                <sf-dropdown
                                        size="1/2"
                                        appearance="outlined"
                                        mode="select"
                                        search="false"
                                        data-action="variant"
                                        aria-label=${context.variantText}
                                        value=${String(field.variant ?? '')}
                                        .options=${variants.map(variant => ({
    type: 'text',
    text: variant.label ?? variant.text ?? String(variant.value ?? variant),
    value: String(variant.value ?? variant),
    selected: String(field.variant ?? '') === String(variant.value ?? variant)
  }))}
                                        @change=${event => context.component.setFieldView(key, {
    variant: event.detail?.value ?? null
  })}
                                ></sf-dropdown>
                            </label>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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


function renderFieldActions(context, field, key) {
  const locked = !context.canChangeVisibility(field);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-field-actions flex items-cross-center gap-1/4">
            <sf-button-icon
                    size="1/2"
                    appearance="link"
                    scheme="secondary"
                    icon=${field.hidden ? 'visibility_off' : 'close'}
                    data-action="remove-field"
                    ?disabled=${locked}
                    title=${locked ? context.layerDenied('shared') || context.hiddenText : context.removeFieldText}
                    aria-label=${context.removeFieldText}
                    @click=${() => context.component.moveFieldToUnplaced(key)}
            ></sf-button-icon>
            ${renderFieldSettings(context, field, key)}
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
                    appearance="link"
                    scheme="secondary"
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
    if (event.key === 'Enter') commit(event);
    if (event.key === 'Escape') context.component.cancelRenaming();
  }}
            ></sf-input>
            <sf-button-icon
                    size="1/2"
                    appearance="link"
                    scheme="on-surface"
                    icon="check"
                    data-action="rename-save"
                    title=${context.saveNameText}
                    aria-label=${context.saveNameText}
                    @click=${commit}
            ></sf-button-icon>
            <sf-button-icon
                    size="1/2"
                    appearance="link"
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


const INNER_CONTROL = 'a[href], button, input, select, textarea, [role="button"], [role="link"]';

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
            <div class="sf-property-view-field-label flex items-cross-center gap-1/3 color-on-surface-variant">
                ${String(field.label ?? key)}
                ${field.required && editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-required color-error" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
            ${editing || context.configuring || field.readonly === true || !context.mayEdit || context.openAll ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-field-value min-w-0 flex items-cross-center gap-2 flex-wrap">${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_3__.renderFieldValue)(context, field, editing, {
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
                            ${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_3__.renderFieldValue)(context, field, editing)}
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
                    appearance="link"
                    scheme="secondary"
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
  const reading = waiting > 0 || Boolean(context.component.isGroupReading?.(groupKey));
  const rows = waiting > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${Array.from({
    length: waiting
  }, (_, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-skeleton sf-skeleton--animation-pulse" aria-hidden="true">
            <div class="sf-skeleton-text sf-skeleton-text--size-1 ${SKELETON_WIDTHS[at % SKELETON_WIDTHS.length]}"></div></div>`)}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${fields.map(field => renderField(context, field, editing, String(section.key ?? ''), groupKey))}`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section class="sf-property-view-group bg-surface-0 flex flex-col gap-2 ${editing ? 'sf-property-view-group--editing' : ''}"
                 data-group=${groupKey}
                 aria-busy=${reading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-sf-sortable-item=${configuring ? groupKey : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-hidden=${configuring && group.hidden ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-columns=${group.columns === 2 ? '2' : '1'}>
            <header class="sf-property-view-group-header flex items-cross-center justify-between gap-2">
                ${configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle
                                  aria-hidden="true">drag_indicator</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${renderEntryName(context, 'group', groupKey, String(group.label ?? groupKey), 'sf-property-view-group-title')}
                ${group.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <span class="flex items-cross-center gap-1/4">
                            ${renderAddField(context, groupKey)}
                            <sf-button-icon
                                    size="1/2"
                                    appearance="link"
                                    scheme="secondary"
                                    icon="keyboard_arrow_up"
                                    data-action="group-up"
                                    ?disabled=${context.groupAt(groupKey) === 0}
                                    title=${context.moveUpText}
                                    aria-label=${context.moveUpText}
                                    @click=${() => context.component.moveGroupBy(groupKey, -1)}
                            ></sf-button-icon>
                            <sf-button-icon
                                    size="1/2"
                                    appearance="link"
                                    scheme="secondary"
                                    icon="keyboard_arrow_down"
                                    data-action="group-down"
                                    ?disabled=${context.groupAt(groupKey) === context.groupCount - 1}
                                    title=${context.moveDownText}
                                    aria-label=${context.moveDownText}
                                    @click=${() => context.component.moveGroupBy(groupKey, 1)}
                            ></sf-button-icon>
                            <sf-button-icon
                                    size="1/2"
                                    appearance="link"
                                    scheme="secondary"
                                    icon=${group.hidden ? 'visibility_off' : 'delete'}
                                    data-action="remove-group"
                                    ?disabled=${groupLocked}
                                    title=${groupLocked ? context.layerDenied('shared') || context.hiddenText : context.removeGroupText}
                                    aria-label=${context.removeGroupText}
                                    @click=${() => context.component.removeGroup(groupKey)}
                            ></sf-button-icon>
                            </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${!configuring && !editing && context.mayEdit && !context.openAll && group.kind !== 'related' && group.editable !== false ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-button
                                    appearance="link"
                                    size=${context.size}
                                    text=${context.editText}
                                    data-action="edit"
                                    @click=${() => context.component.editGroup(String(section.key ?? ''), groupKey)}
                            ></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </header>
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
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <nav class="sf-property-view-phone-sections flex flex-col" aria-label=${context.sectionsLabel}>
            ${sections.map(section => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button
                        type="button"
                        class="sf-property-view-phone-section flex items-cross-center justify-between gap-1"
                        data-phone-section=${String(section.key)}
                        @click=${() => context.component.openPhoneSection(String(section.key))}
                >
                    <span class="sf-property-view-phone-section-label">${String(section.label ?? section.key)}</span>
                    <i class="sf-icon" aria-hidden="true">chevron_right</i>
                </button>
            `)}
        </nav>
    `;
} // The second screen's head: back to the list, and the name of where you are.


function renderPhoneSectionHead(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-phone-head flex items-cross-center gap-2">
            <sf-button-icon
                    size=${context.size}
                    appearance="link"
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
  if (sections.length < 2 && !context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <nav class="sf-property-view-sections self-cross-stretch flex flex-col min-w-0" aria-label=${context.sectionsLabel}>
            ${context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        ${renderSectionTabsArranged(context, sections)}
                        <div class="sf-property-view-additions flex">${renderAddSection(context)}</div>` : renderSectionTree(context, sections)}
        </nav>
    `;
} // Reading: the sections are a tree, which carries the keyboard walk and the
// selection a list of destinations needs.
//
// The items are given as data rather than as children: sf-tree reads its child
// items once and removes them, so a section renamed while the view is being
// arranged kept its old name in this list.


function renderSectionTree(context, sections) {
  const items = sections.map(section => ({
    label: sectionName(context, section),
    value: String(section.key),
    selected: String(section.key) === context.selectedSection,
    openIcon: section.icon ? String(section.icon) : '',
    closedIcon: section.icon ? String(section.icon) : ''
  })); // selection "one": sf-tree 2.0's name for a single choice; its manifest
  // declares it since sf-tree 2.0.1 ("single" is a former value until
  // 2026-12-01).

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-tree
                selection="one"
                .items=${items}
                @sf-tree-select=${event => {
    // sf-tree 2.0 (standard 1.3.8 §8): select carries the entry's
    // id, which is the section key given as its value.
    const id = event.detail?.id;
    if (id) context.component.selectSection(String(id));
  }}
        ></sf-tree>
    `;
} // Arranging: the same tabs, in an order a drag can change, and each one still a
// place to drop a field or an area. A tree cannot be reordered by a pointer --
// it takes its items once and owns their rows -- so while the view is arranged
// the tabs are rows of this component's own, which is also what lets a tab carry
// a handle.


function renderSectionTabsArranged(context, sections) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-sortable
                class="sf-property-view-section-tabs flex flex-col"
                group="section"
                accepts="section"
                id="section:all"
                label=${context.sectionsLabel}
        >
            ${sections.map(section => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <button
                        type="button"
                        class="sf-property-view-section-tab flex items-cross-center gap-1/3 min-w-0 text-start cursor-pointer"
                        data-section-tab=${String(section.key)}
                        data-sf-sortable-item=${String(section.key)}
                        aria-current=${String(section.key) === context.selectedSection ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        @click=${() => context.component.selectSection(String(section.key))}
                >
                    <i class="sf-icon sf-property-view-section-grip color-on-surface-variant" data-sf-sortable-handle
                       aria-hidden="true">drag_indicator</i>
                    <i class="sf-icon" aria-hidden="true">${section.icon ? String(section.icon) : 'folder'}</i>
                    <span class="sf-property-view-section-tab-label flex-auto min-w-0">${sectionName(context, section)}</span>
                </button>
            `)}
        </sf-sortable>
    `;
} // A rare section says so in its own name. A tree row takes a label string and
// draws it as text -- markup put into sf-tree-item once printed lit's own
// markers into the list -- so a trailing mark of its own is a gap in that
// component rather than something to work around here.


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
                size=${context.size}
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
// in a drawer moved to the page's end, outside the element.


function sizeStyle(context) {
  if (context.size !== '1/2') return '';
  return ' --sf-property-view--title-size: var(--sf-heading-5--size); --sf-property-view--title-height: var(--sf-heading-5--height);' + ' --sf-property-view--group-size: var(--sf-text-medium--size); --sf-property-view--group-height: var(--sf-text-medium--height);' + ' --sf-property-view--label-size: var(--sf-label-medium--size); --sf-property-view--label-height: var(--sf-label-medium--height);' + ' --sf-property-view--value-size: var(--sf-text-small--size); --sf-property-view--value-height: var(--sf-text-small--height);';
} // A save the host makes only once confirmed (port 1.14.0): its words, and the
// two answers, in the bar where save was pressed -- the same place and the same
// arrangement as the view's reset question. Going back sends nothing and keeps
// what was entered.


function renderConfirmation(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions flex items-cross-center gap-2 flex-wrap" role="group"
             data-confirming="true">
            <span class="sf-property-view-confirm-text" role="alert">${context.confirmation.text}</span>
            <span class="grow"></span>
            <sf-button
                    appearance="default"
                    size=${context.size}
                    text=${context.confirmSaveText}
                    data-action="confirm-save"
                    @click=${() => context.component.confirmSave()}
            ></sf-button>
            <sf-button
                    appearance="outline"
                    size=${context.size}
                    text=${context.keepEditingText}
                    data-action="keep-editing"
                    @click=${() => context.component.cancelConfirmation()}
            ></sf-button>
        </div>
    `;
} // The foot of a surface open all at once: Create or Save, and Cancel, with
// what went wrong beside them.


function renderOpenAllBar(context) {
  if (context.confirmation) return renderConfirmation(context);
  const creating = context.mode === 'create';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions flex items-cross-center gap-2 flex-wrap" role="group">
            <sf-button
                    appearance="default"
                    size=${context.size}
                    text=${creating ? context.createText : context.saveText}
                    data-action=${creating ? 'create' : 'save'}
                    ?disabled=${!creating && context.changed.size === 0 || context.inputsInvalid}
                    @click=${() => context.component.saveAll()}
            ></sf-button>
            <sf-button
                    appearance="outline"
                    size=${context.size}
                    text=${context.cancelText}
                    data-action="cancel"
                    @click=${() => context.component.cancelEdit()}
            ></sf-button>
            ${context.errors.size ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-errors color-error">${context.errorsText}: ${context.errors.size}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.conflict ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-conflict color-error" role="alert">${context.conflict}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
}

function renderActions(context, {
  panel = false
} = {}) {
  // A surface placed to show the object has no footer of its own (owner,
  // 2026-10-14): a reader sees values, not controls that would refuse.
  if (context.mode === 'view') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  if (context.openAll) return renderOpenAllBar(context);
  const removable = context.mode !== 'create' && context.recordActions.includes('record.delete'); // While the view is arranged the foot carries that mode's controls instead:
  // saving a record and arranging the view it is read in are two modes, and a
  // bar holding both would offer a save for something nobody was editing.

  if (context.configuring) return renderConfigureBar(context);
  if (context.editing && context.confirmation) return renderConfirmation(context); // A panel's foot holds every action on the record -- the host's own, slotted
  // as `footer`, and the delete -- in one bar under the fields (owner,
  // 2026-10-14). They were drawn in the scrolling body, the delete as one more
  // section of it.

  const hosted = panel && context.hasHostSlot('footer');
  if (!context.editing && !removable && !hosted) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions flex items-cross-center gap-2 flex-wrap" role="group">
            ${context.editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button
                                appearance="default"
                                size=${context.size}
                                text=${context.saveText}
                                data-action="save"
                                ?disabled=${context.changed.size === 0 || context.inputsInvalid}
                                @click=${() => context.component.saveGroup()}
                        ></sf-button>
                        <sf-button
                                appearance="outline"
                                size=${context.size}
                                text=${context.cancelText}
                                data-action="cancel"
                                @click=${() => context.component.cancelEdit()}
                        ></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.errors.size ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-errors color-error">${context.errorsText}: ${context.errors.size}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.conflict ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-conflict color-error" role="alert">${context.conflict}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <span class="grow"></span>
            ${hosted ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-host-footer flex flex-wrap items-cross-center gap-2">${context.hostSlot('footer')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${removable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button-icon
                                appearance="link"
                                status="error"
                                size=${context.size}
                                icon="delete"
                                data-action="delete"
                                title=${context.deleteText}
                                aria-label=${context.deleteText}
                                @click=${() => context.component.deleteRecord()}
                        ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
                ${String(field.label ?? key)}
                ${field.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
        </div>
    `;
} // Fields the view places nowhere. Drawn only while the view is being arranged,
// because they are not part of what a person reads -- and drawn even when there
// are none, so that dragging a field out of every group has somewhere to land
// and a person can see that taking a field out does not destroy it.


function renderUnplaced(context) {
  if (!context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const fields = context.unplaced; // The Framework's own accordion rather than a fold built here: the owner
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
                        aria-expanded="false"
                >
                    <span class="sf-accordion-title flex items-cross-center gap-1/3">
                        ${context.unplacedTitle}
                        ${fields.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-tag
                                    kind="default"
                                    size="1/3"
                                    appearance="surface"
                                    text=${String(fields.length)}
                            ></sf-tag>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </span>
                    <sf-icon icon="chevron_right" size="1/2"></sf-icon>
                </button>
            </h3>
            <div class="sf-accordion-content" role="region" hidden>
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
  if (!items.length && !host && !views) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Always the menu, never the one item drawn in its place. The place is the
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
                appearance="link"
                scheme="on-surface"
                size=${context.size}
                icon="more_horiz"
                data-action="menu"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label=${context.menuLabel}
                @click=${event => context.component.openPanelMenu(event.currentTarget.querySelector('button') ?? event.currentTarget)}
        ></sf-button-icon>
        ${host ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-host-menu" data-host-menu hidden>${host}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;
}

function renderPanelHead(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <header class="sf-property-view-head flex flex-col gap-1">
            <div class="sf-property-view-title-row flex items-cross-center gap-1 min-w-0">
                <h2 class="sf-property-view-title min-w-0 overflow-hidden">${context.panelLabel || context.recordLabel || context.recordId || ''}</h2>
                <!-- One glyph, filled when the record is a favourite and outlined
                     when it is not: a star that changes shape as well as fill
                     says two things where one will do (owner, 2026-10-08). The
                     press raises the component's own event; whether the record
                     is a favourite stays the host's to decide and to answer.
                     A record being created is not one yet and cannot be a
                     favourite: no star until it has an id (Larena storage
                     review, 2026-10-28). -->
                ${context.recordId && context.mode !== 'create' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon
                        appearance="link"
                        size=${context.size}
                        icon="star"
                        ?filled=${context.favourite}
                        data-action="favourite"
                        aria-pressed=${context.favourite ? 'true' : 'false'}
                        aria-label=${context.favouriteLabel}
                        @click=${() => context.component.toggleFavourite()}
                ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                <span class="grow"></span>
                ${context.hasHostSlot('actions') ? context.hostSlot('actions') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${renderMenuControl(context)}
            </div>
        </header>
    `;
} // The edge controls stand on a raised surface, elevation 3 as a menu does: its
// own fill and shadow, and the text role that goes with it. On --sf-surface-0
// they were the page's darkest colour on a dimmed page in the dark theme and
// could hardly be found (owner, 2026-10-13). Inline, because the button's own
// appearance rule outranks any selector this sheet could write.


const EDGE_SURFACE = '--sf-icon-button--background-color: var(--sf-elevation-3--surface); --sf-on-surface-variant: var(--sf-on-elevation-3--variant); box-shadow: var(--sf-elevation-3--shadow)'; // Round, and on the panel's outer edge rather than inside its head: in a stack
// each panel keeps its own set visible past the one above it, which is what the
// mockup shows and what a row inside the head cannot do.
//
// A panel filling the screen has no outside, and the drawer brings the strip in
// along the top of it, at its inline start. There the controls stand in a row,
// as the drawer lays its own edge out, and the head keeps their room
// (panelFills): a column there stood over the record's name and the first rows
// on a phone (docs review, round 4, 2026-10-20).

function panelFills(context) {
  return !context.wide || context.panelSize === 'full';
}

function renderPanelControls(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-edge flex ${panelFills(context) ? 'flex-row' : 'flex-col'} gap-1/2" slot="edge"
             aria-label=${context.closeLabel}>
            <sf-button-icon
                    appearance="tonal"
                    scheme="on-surface"
                    root-style=${EDGE_SURFACE}
                    size=${context.size}
                    icon="close"
                    data-action="close"
                    aria-label=${context.closeLabel}
                    title=${context.closeLabel}
                    @click=${() => context.component.closePanel('close')}
            ></sf-button-icon>
            ${context.address ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button-copy
                                appearance="tonal"
                                root-style=${EDGE_SURFACE}
                                size=${context.size}
                                icon="link"
                                value=${context.addressUrl}
                                label=${context.copyLinkLabel}
                                success-text=${context.linkCopiedLabel}
                                duration=${String(context.copyFeedbackMs)}
                                data-action="copy-link"
                                .propertyView=${context.component}
                                @sf-copy-button-copied=${() => context.component.announceAddressCopy(true)}
                                @sf-copy-button-copy-failed=${() => context.component.announceAddressCopy(false)}
                        ></sf-button-copy>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.canOpenFullPage ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button-icon
                                appearance="tonal"
                                scheme="on-surface"
                                root-style=${EDGE_SURFACE}
                                size=${context.size}
                                icon="open_in_full"
                                aria-label=${context.openFullLabel}
                                title=${context.openFullLabel}
                                data-action="open-full"
                                @click=${() => context.component.openFullPage()}
                        ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // The phone's list screen: below the breakpoint, with more than one section and
// none of them opened. Named once rather than written out at each of the three
// places that ask it -- the first version repeated the expression and the third
// copy was the one that forgot to suppress the groups, so the list screen drew the
// list with a section's groups underneath it.


function onPhoneSectionList(context, sections) {
  return !context.wide && sections.length > 1 && context.phoneSection === null;
} // The section being arranged, named where its areas are. The section list is
// drawn by sf-tree, whose rows take a label as a string and nothing else
// (sf-tree 2.0 draws class markup, not sf-tree-item elements), so neither a pencil nor a field can stand in the list
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
                    appearance="link"
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
                    appearance="link"
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
// Keeping the list of named views, under the arrangement they belong to --
// the same place a new area and a new section are made, because making a box is
// one act whatever the box is (owner, 2026-10-09).
//
// A view is named the moment it is made, like an area and a section: a view
// called «Новый вид» among four real ones is one nobody can tell from the
// others. Removing is offered per view and not at all for the last shared one:
// a scope with no shared view has nothing for a person who has made none of
// their own, and the host refuses it anyway.


function renderViewProfiles(context) {
  const profiles = context.viewProfiles ?? [];
  if (!profiles.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section class="sf-property-view-profiles flex flex-col gap-1/3">
            <h3 class="sf-property-view-profiles-title">${context.viewProfileLabel}</h3>
            ${profiles.map(profile => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-property-view-profile flex items-cross-center gap-1/3" data-profile=${profile.id}>
                    <sf-input
                            size="1/2"
                            appearance="bordered"
                            class="flex-auto min-w-0"
                            value=${profile.label}
                            aria-label=${profile.label}
                            data-action="rename-profile"
                            @change=${event => context.component.renameViewProfile(profile.id, event.detail?.value ?? event.target?.value ?? '')}
                    ></sf-input>
                    <span class="sf-property-view-profile-scope color-on-surface-variant">
                        ${profile.shared ? context.sharedLayerText : context.personalLayerText}
                    </span>
                    <sf-button-icon
                            size="1/2"
                            appearance="link"
                            scheme="secondary"
                            icon="close"
                            data-action="delete-profile"
                            ?disabled=${!context.canDeleteViewProfile(profile.id)}
                            title=${context.canDeleteViewProfile(profile.id) ? context.deleteViewText : context.lastSharedViewText}
                            aria-label=${context.deleteViewText}
                            @click=${() => context.component.deleteViewProfile(profile.id)}
                    ></sf-button-icon>
                </div>
            `)}
            ${context.namingView ? renderNewViewName(context) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <sf-button
                        appearance="outline"
                        scheme="on-surface"
                        size="1/2"
                        text=${context.addViewText}
                        data-action="add-profile"
                        @click=${() => context.component.startNamingView()}
                ></sf-button>`}
        </section>
    `;
} // The name of a view about to be made, in the row the rename of an area uses.
// Nothing is written until it is confirmed with a name.


function renderNewViewName(context) {
  const commit = event => {
    const input = event.target?.closest?.('.sf-property-view-rename')?.querySelector('sf-input');
    context.component.createViewProfile(input?.value ?? '');
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-property-view-rename flex items-cross-center gap-1/4 min-w-0" data-action="new-profile">
            <sf-input
                    size="1/2"
                    appearance="bordered"
                    autofocus
                    root-class="flex-auto min-w-0"
                    data-action="new-profile-input"
                    aria-label=${context.addViewText}
                    placeholder=${context.newViewText}
                    @keydown=${event => {
    if (event.key === 'Enter') commit(event);
    if (event.key === 'Escape') context.component.cancelNamingView();
  }}
            ></sf-input>
            <sf-button-icon
                    size="1/2"
                    appearance="link"
                    scheme="on-surface"
                    icon="check"
                    data-action="new-profile-save"
                    title=${context.saveNameText}
                    aria-label=${context.saveNameText}
                    @click=${commit}
            ></sf-button-icon>
            <sf-button-icon
                    size="1/2"
                    appearance="link"
                    scheme="on-surface"
                    icon="close"
                    data-action="new-profile-cancel"
                    title=${context.cancelNameText}
                    aria-label=${context.cancelNameText}
                    @click=${() => context.component.cancelNamingView()}
            ></sf-button-icon>
        </span>
    `;
}

function renderArrangementAdditions(context, section) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-additions flex flex-col items-cross-stretch gap-1">
            <sf-button
                    appearance="outline"
                    scheme="on-surface"
                    size=${context.size}
                    text=${context.addGroupText}
                    data-action="add-group"
                    @click=${() => context.component.addGroup(section ? String(section.key) : '')}
            ></sf-button>
            ${sidebarDrawn(context) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : renderAddSection(context)}
            ${renderViewProfiles(context)}
        </div>
    `;
} // A new section is made at the end of the sections (owner, 2026-10-08), which is
// where a person looks for one: under the list of them. Without a rail there is
// no list to put it under, so it stands beside «add an area» as before.


function renderAddSection(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-button
                appearance="outline"
                scheme="on-surface"
                size="1/2"
                text=${context.addSectionText}
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
  return Boolean(context.wide && context.sectionsAs === 'list' && (sections.length > 1 || context.configuring));
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
  // arrangement on -- since a printed skeleton knows no viewport.


  const tabs = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-tabs sf-property-view-tabs--skeleton flex items-cross-center gap-2" aria-hidden="true" data-sf-skeleton="tabs" data-sections-as=${context.sectionsAs}>${[0, 1, 2].map(at => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="flex-none" style="inline-size: 6rem">${bar(at + 3)}</div>`)}</div>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${tabs}<div class="sf-property-view-loading flex flex-col gap-4" data-state="loading">${Array.from({
    length: SKELETON_GROUPS
  }, (_, group) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<section class="sf-property-view-group bg-surface-0 flex flex-col gap-2" aria-busy="true"><header class="sf-property-view-group-header flex items-cross-center content-main-between gap-2"><div class="flex-1">${bar(group)}</div></header>${Array.from({
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
  if (context.loadFailure) return renderLoadFailure(context); // Sections are listed the same way fields and groups are while the view is
  // being configured: a hidden section filtered out here would be a section
  // nobody could ever show again.

  const sections = listed(context, context.sections);
  const current = sections.find(section => String(section.key) === context.selectedSection) ?? sections[0] ?? null;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-status" role="status" aria-live="polite" ?hidden=${!context.message}>
            ${context.message}
        </div>
        ${!context.panel && (context.hasHostSlot('actions') || context.hasHostSlot('menu') || context.panelMenuItems.length) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <div class="sf-property-view-host-actions flex flex-wrap items-cross-center justify-end gap-1">
                        ${context.hasHostSlot('actions') ? context.hostSlot('actions') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        ${renderMenuControl(context)}
                    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${onPhoneSectionList(context, sections) ? renderPhoneSectionList(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${context.wide && context.sectionsAs === 'tabs' && sections.length > 1 ? renderSectionTabs(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <div class="sf-property-view-layout"
             style=${`--sf-property-view--sections-width: ${context.sectionsWidth};${context.panel ? '' : sizeStyle(context)}`}
             data-sections=${String(sections.length)}
             data-screen=${onPhoneSectionList(context, sections) ? 'sections' : 'groups'}>
            ${!context.wide && sections.length > 1 && context.phoneSection !== null ? renderPhoneSectionHead(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${sidebarDrawn(context) && !railOutside ? renderSectionList(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.isEmptyRecord && !context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-property-view-empty-record color-on-surface-variant"
                              role="status">${context.emptyRecordText}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${onPhoneSectionList(context, sections) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-property-view-body flex-auto min-w-0 flex flex-col gap-4">
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
                            ${context.visible(current?.groups).map(group => renderGroup(context, current, group))}
                        </div>`}
        </div>
        ${withActions && context.hasHostSlot('footer') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-host-footer flex flex-wrap items-cross-center gap-2">${context.hostSlot('footer')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
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
// a panel that dims the page is modal in the sense that matters. Esc is still
// handled here rather than by the drawer, because in a stack it must close the top
// window and not every one of them.
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

  const rail = sidebarDrawn(context); // `show-close` is off because the panel draws its own close, in the strip
  // beside copy-link and open-full. With both, a panel carried two close
  // buttons a step apart, and on a phone neither was reachable: the strip is
  // placed a gutter's width beyond the panel's inline start, which on a
  // full-screen drawer is off the screen.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-drawer
                ?open=${context.panelOpen}
                placement="inline-end"
                modal="true"
                overlay="true"
                size=${context.wide ? context.panelSize : 'full'}
                width=${context.wide ? context.drawerWidth || lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                gutter="var(--sf-space-1)"
                panel-style=${`--sf-drawer-background: var(--sf-surface-1); --sf-property-view--sections-width: ${context.sectionsWidth}; scrollbar-gutter: auto;${sizeStyle(context)}`}
                show-close="false"
                close-label=${context.closeLabel}
                close-on-esc="false"
                label=${context.panelLabel || context.recordId || ''}
        >
            ${renderPanelControls(context)}
            <div class="sf-property-view-panel relative flex flex-col gap-2${rail ? ' sf-property-view-panel--railed' : ''}${panelFills(context) ? ' sf-property-view-panel--fills' : ''}"
                 style=${panelFills(context) ? `--sf-property-view--edge-room: calc(${context.edgeControlCount} * ${context.edgeControlWidth} + ${context.edgeControlCount - 1} * var(--sf-space-1\\/2));` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-record-id=${context.recordId || ''}
                 data-stack-depth=${String(context.stackDepth)}
                 data-stacked=${context.isTopPanel ? 'false' : 'true'}
            >
                ${renderPanelHead(context)}
                <div class="sf-property-view-scroll flex-auto min-h-0 ${rail ? 'flex' : 'flex flex-col'}">
                    ${rail ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                ${renderSectionList(context, listed(context, context.sections))}
                                <div class="sf-property-view-frame flex-auto min-w-0 flex flex-col gap-2">
                                    ${renderBody(context, true, false)}
                                </div>` : renderBody(context, false, false)}
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

/***/ "4284cc8c32e1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-view-properties for the shim (core/js/aliases.js, standard §16 item 20).","component":"sf-view-properties","since":"2026-10-27","remove_after":"2026-12-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-view-properties","since":"2026-10-27","remove_after":"2026-12-01","mode":"host-attribute","section":"§3.1, §4.8","note":"stays a host attribute, read for the accessible name; no shim"},{"from":"sf-property-view-open-record","to":"sf-property-view-open","kind":"event","component":"sf-view-properties","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary §5 open","note":"ui-admin listens to it (src/polygon.ts:124); the detail {field, value, answer} is unchanged"},{"from":"sf-property-view-delete-record","to":"sf-property-view-delete","kind":"event","component":"sf-view-properties","since":"2026-10-27","remove_after":"2026-12-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary §5 delete","note":"the detail {record_id, collection, revision, answer} is unchanged"},{"from":"sf-property-view","to":"sf-view-properties","kind":"tag","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R2 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-view-properties; sf-property-view is a subclass defined beside it until the date"},{"from":"sf-property-view-close","to":"sf-view-properties-close","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-open-full","to":"sf-view-properties-open-full","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-saved","to":"sf-view-properties-saved","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-failed","to":"sf-view-properties-failed","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-open","to":"sf-view-properties-open","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-delete","to":"sf-view-properties-delete","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-created","to":"sf-view-properties-created","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-cancel","to":"sf-view-properties-cancel","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-state","to":"sf-view-properties-state","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-address-copy","to":"sf-view-properties-address-copy","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-favourite","to":"sf-view-properties-favourite","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"}]}');

/***/ },

/***/ "3ea81f4c3c20"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.view-properties","tag":"sf-view-properties","version":"1.11.0","kind":"leaf","implements":["record-view@1"],"settings":{"add-field-text":{"type":"string","default-from":"runtime.add-field-text"},"add-group-text":{"type":"string","default-from":"runtime.add-group-text"},"add-section-text":{"type":"string","default-from":"runtime.add-section-text"},"back-label":{"type":"string","default-from":"runtime.back-label"},"cancel-configuring-text":{"type":"string","default-from":"runtime.cancel-configuring-text"},"cancel-name-text":{"type":"string","default-from":"runtime.cancel-name-text"},"cancel-text":{"type":"string","default-from":"runtime.cancel-text"},"changed-text":{"type":"string","default-from":"runtime.changed-text"},"close-label":{"type":"string","default-from":"runtime.close-label"},"collection":{"type":"string","default":""},"collection-icon":{"type":"icon","default":""},"collection-label":{"type":"string","default":""},"configure-hint-narrow-text":{"type":"string","default-from":"runtime.configure-hint-narrow-text"},"configure-hint-text":{"type":"string","default-from":"runtime.configure-hint-text"},"configure-text":{"type":"string","default-from":"runtime.configure-text"},"conflict-text":{"type":"string","default-from":"runtime.conflict-text"},"copy-link-label":{"type":"string","default-from":"runtime.copy-link-label"},"delete-text":{"type":"string","default-from":"runtime.delete-text"},"done-configuring-text":{"type":"string","default-from":"runtime.done-configuring-text"},"edit-text":{"type":"string","default-from":"runtime.edit-text"},"empty-record-text":{"type":"string","default-from":"runtime.empty-record-text"},"empty-text":{"type":"string","default-from":"runtime.empty-text"},"errors-text":{"type":"string","default-from":"runtime.errors-text"},"favourite":{"type":"boolean","default":false},"favourite-label":{"type":"string","default-from":"runtime.favourite-label"},"field-label-text":{"type":"string","default-from":"runtime.field-label-text"},"field-settings-text":{"type":"string","default-from":"runtime.field-settings-text"},"hidden-text":{"type":"string","default-from":"runtime.hidden-text"},"hide-rare-text":{"type":"string","default-from":"runtime.hide-rare-text"},"hint-text":{"type":"string","default-from":"runtime.hint-text"},"in-this-group-text":{"type":"string","default-from":"runtime.in-this-group-text"},"inherited-text":{"type":"string","default-from":"runtime.inherited-text"},"link-copied-label":{"type":"string","default-from":"runtime.link-copied-label"},"menu-label":{"type":"string","default-from":"runtime.menu-label"},"move-down-text":{"type":"string","default-from":"runtime.move-down-text"},"move-up-text":{"type":"string","default-from":"runtime.move-up-text"},"new-group-title":{"type":"string","default-from":"runtime.new-group-title"},"new-section-title":{"type":"string","default-from":"runtime.new-section-title"},"no-match-text":{"type":"string","default-from":"runtime.no-match-text"},"open-full-label":{"type":"string","default-from":"runtime.open-full-label"},"panel":{"type":"boolean","default":false},"panel-label":{"type":"string","default":""},"panel-size":{"type":"enum","values":["1/2","1","2","full"],"default":"1"},"size":{"type":"enum","values":["1","1/2"],"default":"1"},"mode":{"type":"enum","values":["view","auto","edit","create"],"default":"auto"},"panel-width":{"type":"string","default":""},"personal-layer-text":{"type":"string","default-from":"runtime.personal-layer-text"},"rare-text":{"type":"string","default-from":"runtime.rare-text"},"record-id":{"type":"id","default":""},"remove-field-text":{"type":"string","default-from":"runtime.remove-field-text"},"remove-group-text":{"type":"string","default-from":"runtime.remove-group-text"},"remove-section-text":{"type":"string","default-from":"runtime.remove-section-text"},"rename-text":{"type":"string","default-from":"runtime.rename-text"},"reset-view-ask-text":{"type":"string","default-from":"runtime.reset-view-ask-text"},"reset-view-text":{"type":"string","default-from":"runtime.reset-view-text"},"save-name-text":{"type":"string","default-from":"runtime.save-name-text"},"save-text":{"type":"string","default-from":"runtime.save-text"},"section-icon-text":{"type":"string","default-from":"runtime.section-icon-text"},"section-icons":{"type":"string","default":""},"sections-as":{"type":"enum","values":["list","tabs"],"default":"list"},"sections-label":{"type":"string","default-from":"runtime.sections-label"},"shared-layer-text":{"type":"string","default-from":"runtime.shared-layer-text"},"show-rare":{"type":"boolean","default":false},"show-rare-text":{"type":"string","default-from":"runtime.show-rare-text"},"shown-text":{"type":"string","default-from":"runtime.shown-text"},"unplaced-hint-text":{"type":"string","default-from":"runtime.unplaced-hint-text"},"unplaced-title":{"type":"string","default-from":"runtime.unplaced-title"},"variant-text":{"type":"string","default-from":"runtime.variant-text"},"view-conflict-text":{"type":"string","default-from":"runtime.view-conflict-text"},"view-denied-text":{"type":"string","default-from":"runtime.view-denied-text"},"width-text":{"type":"string","default-from":"runtime.width-text"},"view-profile-label":{"type":"string","default-from":"runtime.view-profile-label"},"add-view-text":{"type":"string","default-from":"runtime.add-view-text"},"new-view-text":{"type":"string","default-from":"runtime.new-view-text"},"delete-view-text":{"type":"string","default-from":"runtime.delete-view-text"},"last-shared-view-text":{"type":"string","default-from":"runtime.last-shared-view-text"},"full":{"type":"boolean","default":false},"open":{"type":"boolean","default":true}},"values":{"revision":{"type":"string"},"section":{"type":"string"}},"events":{"close":{"carries":{"reason":{"type":"enum","values":["close","escape","cancelled","deleted","api"]},"record_id":{"type":"id","nullable":true},"unsaved_fields":{"type":"list"}},"cancelable":true},"open-full":{"carries":{"id":"id","address":"string","record_id":{"type":"id","nullable":true}}},"saved":{"carries":{"id":"id","revision":{"type":"string","optional":true}}},"failed":{"carries":{"reason":"string","message":{"type":"string","optional":true}}},"open":{"carries":{"field":"string","value":"object","answer":"string"}},"delete":{"carries":{"collection":"string","revision":"string","answer":"string","record_id":{"type":"id","nullable":true}}},"created":{"carries":{"collection":{"type":"string","nullable":true},"record_id":{"type":"id","nullable":true}}},"cancel":{"carries":{"mode":{"type":"enum","values":["auto","edit","create"]},"scope":{"type":"enum","values":["group"],"optional":true},"section":{"type":"string","optional":true},"group":{"type":"string","optional":true}}},"state":{"carries":{"state":"string","message":"string"},"own-verb":true},"address-copy":{"carries":{},"own-verb":true},"favourite":{"carries":{"collection":{"type":"string","nullable":true},"favourite":"boolean","record_id":{"type":"id","nullable":true}},"own-verb":true}},"actions":{"refresh":{},"load":{"with":{"reason":{"type":"string","optional":true}}},"edit-group":{"with":{"section":"string","group":"string"}},"cancel-edit":{},"save-group":{"with":{"options":{"type":"object","optional":true}},"concurrency":"drop"},"select-section":{"with":{"key":"string"}},"close-panel":{"with":{"reason":{"type":"string","optional":true}}},"copy-address":{},"open-full-page":{},"confirm-save":{},"cancel-confirmation":{}},"port":{"id":"simai.property-view-port","version":"1.17.0","contract":"src/core/contracts/ports/simai.property-view-port/1.17.0/port.json"},"presentation":{"skeleton":{"file":"skeleton.html","late":[]}},"css-variables":{"--sf-property-view--sections-width":{"type":"length","state":"default"},"--sf-property-view--title-size":{"type":"length","state":"default"},"--sf-property-view--label-size":{"type":"length","state":"default"},"--sf-property-view--value-size":{"type":"length","state":"default"},"--sf-property-view--group-size":{"type":"length","state":"default"},"--sf-property-view--edge-room":{"type":"length","state":"open"}},"host-states":{"data-state":"string","aria-busy":"string"}}');

/***/ },

/***/ "99fb492b7fba"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Property view","events":{"state":{"label":"Record state"},"address-copy":{"label":"Address copied"},"favourite":{"label":"Favourite"}},"runtime":{"add-field-text":"Add a field","add-group-text":"Add an area","add-section-text":"Add a section","add-view-text":"Add a view","back-label":"Back","cancel-configuring-text":"Cancel","cancel-name-text":"Leave the name","cancel-text":"Cancel","changed-text":"Fields changed","close-label":"Close","configure-hint-narrow-text":"Drag fields between groups. Applied at once.","configure-hint-text":"Drag fields between groups and onto a section on the left. Applied at once.","configure-text":"Arrange the view","confirm-save-text":"Confirm and save","conflict-text":"The record changed; read it again","copy-link-label":"Copy link","create-text":"Create","delete-text":"Delete","delete-view-text":"Remove the view","done-configuring-text":"Done","edit-text":"edit","empty-record-text":"This record has nothing to show","empty-text":"not filled in","errors-text":"Errors","favourite-label":"Favourite","field-label-text":"Name","field-settings-text":"Field settings","hidden-text":"Hide","hide-rare-text":"Hide rare fields","hint-text":"Hint","in-this-group-text":"In this area","inherited-text":"by default","keep-editing-text":"Keep editing","last-shared-view-text":"The only view everyone has","link-copied-label":"Link copied","menu-label":"More","move-down-text":"Move down","move-up-text":"Move up","new-group-title":"New area","new-section-title":"New section","new-view-text":"New view","no-match-text":"Nothing matches","open-full-label":"Open as a page","personal-layer-text":"Personal","rare-text":"rare","read-only-text":"You can only view this record","remove-field-text":"Remove from this area","remove-group-text":"Remove this area","remove-section-text":"Remove this section","rename-text":"Rename","reset-view-ask-text":"Reset the whole view?","reset-view-text":"Reset","save-failed-text":"The save failed","save-name-text":"Save the name","save-text":"Save","section-icon-text":"Section glyph","sections-label":"Sections","shared-layer-text":"Everyone\'s","show-rare-text":"Show rare fields","shown-text":"Shown","state-load-failed":"The record could not be read","state-loading":"Reading the record","state-port-not-connected":"The record port is not connected","state-unavailable":"The record is unavailable","unplaced-hint-text":"Fields this view does not show. Drag one into a group to place it, or drag a field here to take it out.","unplaced-title":"Not placed","variant-text":"Template","view-conflict-text":"The view changed and was read again","view-denied-text":"You may not change this layer","view-profile-label":"View","view-reset-failed-text":"The view could not be reset","view-save-failed-text":"The view could not be saved","width-text":"Full width"}}');

/***/ },

/***/ "d614908e644f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Запись","events":{"state":{"label":"Состояние записи"},"address-copy":{"label":"Адрес скопирован"},"favourite":{"label":"Избранное"}},"runtime":{"add-field-text":"Добавить поле","add-group-text":"Добавить область","add-section-text":"Добавить раздел","add-view-text":"Добавить вид","back-label":"Назад","cancel-configuring-text":"Отменить","cancel-name-text":"Оставить название","cancel-text":"Отменить","changed-text":"Изменено полей","close-label":"Закрыть","configure-hint-narrow-text":"Перетаскивайте поля между группами. Применяется сразу.","configure-hint-text":"Перетаскивайте поля между группами и на разделы слева. Применяется сразу.","configure-text":"Настроить вид","confirm-save-text":"Подтвердить и сохранить","conflict-text":"Запись изменилась, обновите её","copy-link-label":"Копировать ссылку","create-text":"Создать","delete-text":"Удалить","delete-view-text":"Удалить вид","done-configuring-text":"Готово","edit-text":"изменить","empty-record-text":"В этой записи нечего показать","empty-text":"не заполнено","errors-text":"Ошибок","favourite-label":"В избранное","field-label-text":"Название","field-settings-text":"Настройки поля","hidden-text":"Скрыть","hide-rare-text":"Скрыть редкие поля","hint-text":"Подсказка","in-this-group-text":"В этой области","inherited-text":"по умолчанию","keep-editing-text":"Вернуться к правке","last-shared-view-text":"Единственный общий вид","link-copied-label":"Ссылка скопирована","menu-label":"Ещё","move-down-text":"Ниже","move-up-text":"Выше","new-group-title":"Новая область","new-section-title":"Новый раздел","new-view-text":"Новый вид","no-match-text":"Ничего не найдено","open-full-label":"Открыть на всю страницу","personal-layer-text":"Персональный","rare-text":"редкое","read-only-text":"Эту запись можно только смотреть","remove-field-text":"Убрать из области","remove-group-text":"Удалить область","remove-section-text":"Удалить раздел","rename-text":"Переименовать","reset-view-ask-text":"Сбросить весь вид?","reset-view-text":"Сбросить","save-failed-text":"Не удалось сохранить","save-name-text":"Сохранить название","save-text":"Сохранить","section-icon-text":"Значок раздела","sections-label":"Разделы","shared-layer-text":"Для всех","show-rare-text":"Показать редкие поля","shown-text":"Показывать","state-load-failed":"Не удалось загрузить запись","state-loading":"Загрузка записи","state-port-not-connected":"Порт записи не подключён","state-unavailable":"Запись недоступна","unplaced-hint-text":"Поля, которых нет в этом виде. Перетащите поле в группу, чтобы разместить, или сюда, чтобы убрать.","unplaced-title":"Не размещённые","variant-text":"Вид","view-conflict-text":"Вид изменился, он перезагружен","view-denied-text":"Нет права менять этот слой","view-profile-label":"Вид","view-reset-failed-text":"Не удалось сбросить вид","view-save-failed-text":"Не удалось сохранить вид","width-text":"На всю ширину"}}');

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