/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
 * Anything that is not a date is `gap`, '' by default. A marker after the year
 * («2026 г.», «2026 р.») is held to it by a no-break space, so it never starts
 * a line alone.
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
  }; // The year keeps its marker («2026 г.» never wraps before «г.»): format-intl.js.

  return (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatDateText)((0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.intlFormatter)('DateTimeFormat', (0,_format_intl_js__WEBPACK_IMPORTED_MODULE_0__.formatLocale)(where), options), moment);
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
/* harmony export */   formatDateText: () => (/* binding */ formatDateText),
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
} // A date's year keeps the abbreviation that follows it (A4, group build 15):
// Russian, Ukrainian, Bulgarian, Belarusian, Kazakh, Lithuanian, Macedonian
// and Armenian write one after the year -- «19 нояб. 2026 г.», «2026 р.»,
// «2026 m.», «2026 թ.» -- and the platform joins it with an ordinary space, so
// a narrow cell or a wrapped line printed «2026» at the end of one line and
// «г.» alone at the start of the next. Only the space before an abbreviation
// (letters closed by a full stop: г., гг., m.) becomes a no-break space; a word
// such as English «at» or German «um», a comma, a slash or a time after the
// year is left as the platform writes it (DEV answer msg-e6758728).

/** A DateTimeFormat's text of a moment with the year's marker held to the year. */

function formatDateText(formatter, moment) {
  if (typeof formatter?.formatToParts !== 'function') return formatter.format(moment); // A module-level regular expression is a statement a bundler keeps (core-format test): made here.

  const gap = /^[\s\u00a0\u202f]+(?=\p{L}+\.)/u;
  let text = '';
  let afterYear = false;

  for (const part of formatter.formatToParts(moment)) {
    text += afterYear && part.type === 'literal' ? part.value.replace(gap, '\u00a0') : part.value;
    afterYear = part.type === 'year';
  }

  return text;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "adbddb2f4d35"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONFIRM_ICON: () => (/* binding */ CONFIRM_ICON),
/* harmony export */   CONFIRM_SIZES: () => (/* binding */ CONFIRM_SIZES),
/* harmony export */   CONFIRM_STATES: () => (/* binding */ CONFIRM_STATES),
/* harmony export */   confirmSurface: () => (/* binding */ confirmSurface),
/* harmony export */   renderConfirmFooter: () => (/* binding */ renderConfirmFooter)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("e92fd2d1a38c");
/* harmony import */ var _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e577837dd70a");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_3__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__, _core_js_format_date_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _core_js_instance_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__);
// The behaviour of a question put to a person in place: two answers, a
// pending state while the answer is applied, the outcome, and an optional time
// the offer runs out. sf-confirm (the plain question) and
// sf-confirm-change (the same question over values as they were and as they
// will be) are this one surface (duplication audit 2026-11-03, A-5): it was
// written once in sf-confirm-change and five more times by hand in the chat
// and view components (a delete asked in its row, a member removed, a view
// reset).
//
// The element never applies anything. A press moves it to `pending`, which
// takes both answers away so that nothing is pressed twice, and says what is
// happening; the host then sets the outcome -- `accepted`, `declined`, or back
// to `open` when the answer could not be delivered. It is a confirm surface in
// the §19.4 sense: an assembly's `ask` opens it and waits for the answer.
//
// confirmSurface(Base, {kind, block, answerId}) gives a class built from a
// manifest with the settings state, expires-at and disabled, the events
// answer and expired, and the actions open, answer, confirm and cancel:
//   kind      the element's tag, for the heading's instance path (§7.1.1);
//   block     the class of the drawn surface (its __status and __actions);
//   answerId  the setting the host names the question with (carried back).




const CONFIRM_STATES = Object.freeze(["open", "pending", "accepted", "declined", "expired"]); // A timer longer than this is not a timer setTimeout keeps: past 2^31-1 ms it
// fires at once. An offer valid for longer than 24 days is checked again daily.

const LONGEST_WAIT = 24 * 60 * 60 * 1000; // The steps of the control ladder the answers stand on (C22): the element's
// size, else 1, the size of a field and a button beside it. Compactness is
// the region's density (data-sf-density), never a smaller size by hand.

const CONFIRM_SIZES = Object.freeze(["1/3", "1/2", "1", "2", "3"]); // The glyph the status line shows beside its words, per state.

const CONFIRM_ICON = Object.freeze({
  open: "schedule",
  pending: "schedule",
  accepted: "check_circle",
  declined: "cancel",
  expired: "timer_off"
});
function confirmSurface(Base, {
  kind,
  block,
  answerId = "answerId"
} = {}) {
  return class ConfirmSurface extends Base {
    constructor() {
      super();
      this._pressed = null;
      this._timer = null;
      this._expiredSaid = false;
      this._asks = []; // Declined here, by this person's answer (DEV D2 on C35): the
      // question folds away. A host that draws a decision taken
      // elsewhere (a declined change in a history) keeps it on screen.

      this._declinedHere = false; // The control focused when the question was put, for the focus to
      // go back to once the question folds away.

      this._opener = null;
    }

    get state() {
      const value = this.getAttribute("state");
      return CONFIRM_STATES.includes(value) ? value : "open";
    }

    set state(value) {
      this.setAttribute("state", CONFIRM_STATES.includes(value) ? value : "open");
    } // An open offer past its time is expired whatever the attribute says:
    // the host may not have heard yet, and a button that can no longer work
    // must not be pressable in the meantime.


    get expired() {
      if (this.state === "expired") return true;
      if (this.state !== "open") return false;
      const until = Date.parse(this.getAttribute("expires-at") || "");
      return Number.isFinite(until) && Date.now() >= until;
    }

    get shownState() {
      return this.expired ? "expired" : this.state;
    } // The heading's id is the surface's path (§7.1.1), never a counter.


    get headingId() {
      return (0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.partId)((0,_core_js_instance_path__WEBPACK_IMPORTED_MODULE_2__.instancePath)(this, {
        kind
      }), "heading");
    } // The host's name for the question, carried back in every event. Not
    // named after any setting: sf-confirm's own setting is confirmId.


    get questionKey() {
      return this[answerId] ?? "";
    }

    formatTime(value) {
      const sameDay = (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_3__.calendarDayOffset)(value) === 0;
      return (0,_core_js_format_date_js__WEBPACK_IMPORTED_MODULE_3__.formatDate)(value, {
        node: this,
        intl: sameDay ? {
          hour: "2-digit",
          minute: "2-digit"
        } : {
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit"
        }
      });
    }

    statusText(shown) {
      if (shown === "pending") return this.sfWord(this._pressed === false ? "declining-text" : "accepting-text");
      if (shown === "accepted") return this.sfWord("accepted-text"); // Declined says nothing (owner decision C35, remark R067): the
      // answer changed nothing -- no «Отменено», no «Отклонено»; the host
      // puts the row back and the focus on what was pressed.

      if (shown === "declined") return "";
      if (shown === "expired") return this.sfWord("expired-text");
      const until = this.getAttribute("expires-at");
      const time = until ? this.formatTime(until) : "";
      return time ? this.sfWord("until-text", {
        vars: {
          time
        }
      }) : "";
    } // What every template of the surface reads: the state shown, the
    // heading, the status line and the two answers.


    confirmContext() {
      const shown = this.shownState;
      return {
        component: this,
        state: shown,
        headingId: this.headingId,
        heading: this.getProp("heading"),
        headingLevel: this.getProp("headingLevel"),
        hasDescription: this.hasSlotContent("description"),
        descriptionContent: this.hasSlotContent("description") ? this.getSlotContent("description") : null,
        acceptText: this.getProp("acceptText") || this.sfWord("accept-text"),
        declineText: this.getProp("declineText") || this.sfWord("decline-text"),
        statusText: this.statusText(shown),
        statusIcon: CONFIRM_ICON[shown] ?? "schedule",
        open: shown === "open",
        pending: shown === "pending",
        // Which answer is on its way: true, false, or null when the
        // host set pending itself.
        pressed: shown === "pending" ? this._pressed : null,
        // Not named `disabled`: that is the setting, and this is more --
        // the setting, or any state but open.
        answersLocked: this.getProp("disabled") || shown !== "open",
        // disabled locks the decisive answer only (Larena LF-5): the
        // declining one, Escape and a window's close always work, so
        // a person can leave a question whose acceptance waits.
        acceptLocked: this.getProp("disabled") || shown !== "open",
        declineLocked: shown !== "open",
        // The step the answers stand on: a page's size, else 1 (C22).
        size: CONFIRM_SIZES.includes(this.getAttribute("size")) ? this.getAttribute("size") : "1",
        // Declined by the person here: the surface is hidden, and its
        // empty status line no longer holds the focus (DEV D2 on C35).
        collapsed: shown === "declined" && this._declinedHere
      };
    }

    onConnected() {
      super.onConnected?.();
      this.rememberOpener();
      this.schedule();
    } // The control the person was on when the question appeared: the
    // button that asked it, as a rule. Kept only while it is outside the
    // question and is not the page itself.


    rememberOpener() {
      const active = this.ownerDocument?.activeElement;
      if (active && active !== this.ownerDocument.body && !this.contains(active)) this._opener = active;
    } // Where the focus goes when a declined question folds away: back to
    // the control that put it, else the nearest focusable place around
    // it, else the next (or previous) control in the page -- as when a
    // row is removed. The ring is shown: the person came by keyboard.


    returnFocus() {
      const doc = this.ownerDocument;
      const active = doc.activeElement;
      if (active && active !== doc.body && !this.contains(active)) return;
      const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

      const usable = node => node?.isConnected && !this.contains(node) && node.getClientRects().length > 0;

      let target = usable(this._opener) ? this._opener : null;

      if (!target) {
        let around = this.parentElement?.closest?.(`${selector}, [tabindex]`);

        while (around && !usable(around)) around = around.parentElement?.closest?.(`${selector}, [tabindex]`);

        target = around ?? null;
      }

      if (!target) {
        const all = [...doc.querySelectorAll(selector)].filter(usable);

        const position = node => this.compareDocumentPosition(node);

        target = all.find(node => position(node) & Node.DOCUMENT_POSITION_FOLLOWING) ?? all.reverse().find(node => position(node) & Node.DOCUMENT_POSITION_PRECEDING) ?? null;
      }

      target?.focus({
        preventScroll: true,
        focusVisible: true
      });
    }

    onDisconnected() {
      clearTimeout(this._timer);
      this._timer = null;
      super.onDisconnected?.();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback?.(name, oldValue, newValue);
      if (name === "state" && newValue !== "pending") this._pressed = null;
      if (name === "state" && newValue !== "declined" && newValue !== "pending") this._declinedHere = false; // The person's own decline, now set by the host: the question
      // folds away and the focus goes back (DEV D2 on C35).

      if (name === "state" && newValue === "declined" && oldValue !== "declined" && this._declinedHere) {
        this.whenRendered(() => this.returnFocus(), {
          next: true
        });
      }

      if (name === "state" || name === "expires-at") {
        // A new time, or the host reopening the offer, is a new chance
        // to run out; the last expiry was about the last time.
        if (name === "expires-at" || newValue === "open") this._expiredSaid = false;
        this.schedule();
      }
    } // One timer, for the moment the offer runs out; nothing polls. When it
    // fires the surface redraws as expired and the host hears it once.


    schedule() {
      clearTimeout(this._timer);
      this._timer = null;
      if (!this.isConnected || this.state !== "open") return;
      const until = Date.parse(this.getAttribute("expires-at") || "");
      if (!Number.isFinite(until)) return;
      const wait = until - Date.now();

      if (wait <= 0) {
        this.expire();
        return;
      }

      this._timer = setTimeout(() => {
        this._timer = null;
        if (Date.now() >= until) this.expire();else this.schedule();
      }, Math.min(wait + 50, LONGEST_WAIT));
    }

    expire() {
      this.requestComponentUpdate("expired");
      this.settleAsks({
        accepted: false,
        reason: "expired"
      });
      if (this._expiredSaid) return;
      this._expiredSaid = true;
      this.sfEmit("expired", {
        id: this.questionKey
      });
    } // ── actions (§4.4) ──────────────────────────────────────────────────

    /**
     * Puts the question again. Asked by an assembly -- a call that hands a
     * signal -- it answers when the person answers or the time runs out,
     * with {accepted, reason, value} (§19.4).
     */


    open(...args) {
      // (params, {signal}): the parameters are none; the second is the ask's.
      const {
        signal
      } = args[1] ?? {};
      const reopened = this.state !== "open";
      this.rememberOpener();
      if (reopened) this.state = "open"; // The question is put to the person now: focus waits on the safe
      // answer (decision C25), so a stray Enter or Space only takes the
      // question back.

      this.whenRendered(() => this.focusSafeAnswer(), {
        next: reopened
      });
      return signal ? this.waitForAnswer(signal) : (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
    }
    /** The person's answer as a call: {accepted: true} confirms, false declines. */


    answer(params = {}) {
      const accepted = this.readAnswer(params);
      if (accepted === null) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("unknown");
      if (this.shownState !== "open") return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("closed"); // disabled holds the acceptance only: «no» always goes (LF-5).

      if (accepted && this.getProp("disabled")) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("disabled");
      const focusWasInside = this.contains(this.ownerDocument.activeElement);
      this._pressed = accepted; // Before the event: a host may set the outcome inside its handler.

      this._declinedHere = !accepted;
      this.setAttribute("state", "pending");
      const delivered = this.sfEmit("answer", {
        id: this.questionKey,
        accepted
      }); // A cancelled event is a host that did not take the answer: the
      // question stands, and the person may answer again.

      if (!delivered) {
        this._pressed = null;
        this._declinedHere = false;
        this.setAttribute("state", "open");
      } else {
        this.settleAsks({
          accepted,
          reason: accepted ? "close" : "cancelled"
        });
      } // The pressed button is gone with the answers; focus moves to the
      // sentence that says what happened rather than falling to the page.


      if (focusWasInside) this.whenRendered(() => this.focusStatus(), {
        next: true
      });
      return delivered ? (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)() : (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("prevented");
    }
    /** The acceptance (§19.4): data-sf-action="<id>.confirm". */


    confirm() {
      return this.answer({
        accepted: true
      });
    }
    /** The declining answer (vocabulary §5 cancel): data-sf-action="<id>.cancel". */


    cancel() {
      return this.answer({
        accepted: false
      });
    }

    readAnswer(params) {
      if (params && typeof params === "object" && typeof params.accepted === "boolean") return params.accepted;
      return null;
    }

    waitForAnswer(signal) {
      return new Promise(resolve => {
        const ask = {
          resolve
        };

        this._asks.push(ask);

        signal?.addEventListener?.("abort", () => {
          this._asks = this._asks.filter(one => one !== ask);
          resolve({
            outcome: "cancelled"
          });
        }, {
          once: true
        });
      });
    }

    settleAsks({
      accepted,
      reason
    }) {
      const asks = this._asks;
      this._asks = [];

      for (const ask of asks) ask.resolve({
        outcome: "applied",
        value: {
          accepted,
          reason,
          value: null
        }
      });
    } // The question took «no» and nothing came after: declined, or the
    // decline on its way with no outcome from the host. A window that is
    // opened again puts such a question again (sf-modal, decision C39).


    get answeredNo() {
      return this.state === "declined" || this.state === "pending" && this._pressed === false;
    }

    focusStatus() {
      const target = this.querySelector(`.${block}__status`);
      if (!target) return;
      if (this.state === "open" && this.focusSafeAnswer()) return; // Folded away: returnFocus() has the focus (DEV D2 on C35).

      if (this.shownState === "declined" && this._declinedHere) return;
      target.focus({
        preventScroll: true
      });
    } // The answer that changes nothing -- the declining one -- takes the
    // focus whenever the question is put (decision C25, as Primer's
    // ConfirmationDialog does for a dangerous one): Enter or Space pressed
    // by habit closes the question, and the accepting answer needs a
    // pointer or Tab. Answers false when there is no answer to focus.
    // The surface's after-render can come before the answer can take the
    // focus (its sf-button is drawn, or its region shown, a frame later):
    // the focus then tries again for a few frames, unless the person has
    // moved it meanwhile.


    focusSafeAnswer(frames = 10) {
      if (this.shownState !== "open") return false;
      const host = this.querySelector(`.${block}__actions:not([hidden]) [data-action="decline"]`);
      const button = host?.matches("button") ? host : host?.querySelector("button");
      button?.focus({
        preventScroll: true
      });
      const doc = this.ownerDocument;
      if (button && doc.activeElement === button) return true;
      const view = doc.defaultView;

      if (host && frames > 0 && view?.requestAnimationFrame) {
        view.requestAnimationFrame(() => {
          const active = doc.activeElement;
          if (!active || active === doc.body || this.contains(active)) this.focusSafeAnswer(frames - 1);
        });
      }

      return false;
    }

  };
} // The surface's footer, the same in every template: the status line, then the
// two answers. `block` is the drawn surface's class; `acceptStatus` "danger"
// marks a destructive acceptance (a delete, decision C13).
//
// The answers (decision C25): a dangerous question fills its accepting answer
// with the danger colour; a plain one draws it as the template asks
// (`acceptAppearance`, outlined by default; sf-confirm 1.3.6 asks for the
// filled primary main answer, owner decision C183 and C176 by DEV's answer
// msg-68999d65). The declining answer, the
// question's «Отмена», is always the quiet one, ghost on-surface (decision
// C116, #q-cancel: «Отмена» is quiet everywhere), so the two are told apart by
// more than the red of a word. A surface whose declining answer is a decision
// of its own weight rather than a cancel asks for `declineAppearance:
// "outline"`; a surface whose accepting answer is the main one (sf-confirm-change
// 1.9.0, owner decision C183 (6): «Подтвердить» filled primary, «Отклонить»
// quiet) for `acceptAppearance: "default"`. Both stand on the element's size
// (context.size, 1 unless the page gives one); a size a template gives is
// relative, so a compact region (data-sf-density, C22) moves them down a step.
//
// In a window (sf-confirm appearance="window", decision C39) the answers come
// before the status line, at the start; the declining one is ghost there too
// (C116; it was tonal, the window's quiet answer).
// `formerBlock` writes a renamed surface's former class beside each part's;
// `statusLast` puts the status line after the answers in the markup as well
// as on screen (the deadline under the answers, C183 (6)).

function renderConfirmFooter(context, block, {
  acceptStatus = "",
  window = false,
  acceptAppearance = "outline",
  declineAppearance = "ghost",
  formerBlock = "",
  statusLast = false
} = {}) {
  const {
    component
  } = context; // A surface whose class was renamed writes its former block beside the
  // new one until the alias date, so a page selector that reached it still
  // does (sf-confirm-change 1.8.0: .sf-change-confirm__* until 2027-01-01).

  const part = name => formerBlock ? `${block}__${name} ${formerBlock}__${name}` : `${block}__${name}`;

  const danger = acceptStatus === "danger" || acceptStatus === "error";
  const size = context.size || "1"; // Always in the page, empty while there is nothing to say: a live region
  // that appears together with its words is not heard. With statusLast it
  // follows the answers in the markup too (sf-confirm-change 1.9.0: the
  // deadline under the answers, an sf-time that may take a Tab after them).
  // The status sign is 16, the ladder's 1/3 (C151 (1)): size="1" was the old
  // icon scale's name for it, noted in SF.deprecations on every state
  // (Smart joint pass SM-CNF-1, SM-CCH-1).

  const status = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <p class=${part("status")} role="status" tabindex="-1">
                    ${context.statusText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${context.statusIcon} data-sf-icon-scale="ladder" size="1/3" aria-hidden="true"></sf-icon>
                            <span>${context.statusText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </p>`; // While the answer is applied (pending) the answers stay where they were:
  // the pressed one busy, with the button's own spinner and aria-busy, the
  // other disabled, so the card does not jump and the person sees which
  // answer is on its way.

  const actions = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class=${part("actions")} ?hidden=${!context.open && !context.pending}>
                    <sf-button
                            appearance=${danger ? "default" : acceptAppearance}
                            scheme="primary"
                            status=${danger ? "danger" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            size=${size}
                            text=${context.acceptText}
                            data-action="accept"
                            ?loading=${context.pressed === true}
                            ?disabled=${context.acceptLocked && context.pressed !== true}
                            @click=${() => component.confirm()}
                    ></sf-button>
                    <sf-button
                            appearance=${declineAppearance}
                            scheme="on-surface"
                            size=${size}
                            text=${context.declineText}
                            data-action="decline"
                            ?loading=${context.pressed === false}
                            ?disabled=${context.declineLocked && context.pressed !== false}
                            @click=${() => component.cancel()}
                    ></sf-button>
                </div>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <footer class=${part("footer")}>${statusLast ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${actions}${status}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${status}${actions}`}
            </footer>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9b9c0908a676"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("adbddb2f4d35");
/* harmony import */ var _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("e430f71c6bbc");
/* harmony import */ var _js_answer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("2cdacfd297c1");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e4c87bda9c30");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d69a23bed94c");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("09c52c5644c7");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
// A few properties as a block in a flow: a chat message, a feed entry, any
// stream where content follows content. It shows a record's fields, or asks the
// person to fill in a few and send them; after the answer it stays in the flow
// as what was sent, read-only. Design: ui-view docs/design/sf-view-flow.md.
//
// It is the record component's field drawing and the Framework's confirm
// surface put together, with nothing copied from either:
//
// - the confirm surface (SIMAI Framework helpers/confirm-surface.js, the one
//   sf-confirm and sf-confirm-change share) is the answer's state machine:
//   open, pending, accepted, declined, expired, the expiry timer, the answer and
//   expired events, the actions open, answer, confirm and cancel, and the focus
//   moved to the status line when the answers go;
// - every field is drawn by sf-view-properties' js/field-value.js over the
//   Framework field renderers (SF.fieldRenderers), and its `when` read with
//   that component's js/conditions.js (through ./js/answer.js).
//
// The block owns no data. Its fields are the host's settings, a Send is an
// event with the values, and the host answers with settle() in the record
// port's words -- applied, or refused with the fields' errors -- or sets state.
//
// It renders into its own light DOM, like every Smart component: the field
// controls are Smart elements whose stylesheets are document-level.








const BlockElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: "ru"
});
const Surface = (0,_helpers_confirm_surface_js__WEBPACK_IMPORTED_MODULE_2__.confirmSurface)(BlockElement, {
  kind: "sf-view-flow",
  block: "sf-view-flow",
  answerId: "blockId"
}); // The first control of a field, for the focus a stopped or refused Send moves.

const CONTROL = "input:not([type=hidden]):not([disabled]), textarea:not([disabled]), select:not([disabled]), " + "[contenteditable=true], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

const own = (element, name) => Object.prototype.hasOwnProperty.call(element, name);

class SfViewFlow extends Surface {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      },
      // The lists are properties (the usual case: a host has objects) or
      // their attributes in JSON (markup, the Studio).
      fields: {
        attribute: "fields",
        type: Array,
        default: []
      },
      groups: {
        attribute: "groups",
        type: Array,
        default: []
      }
    };
  }

  constructor() {
    super();
    this._fields = null;
    this._groups = null;
    this._formatter = null; // What the person typed and has not sent, by key.

    this._changed = new Map(); // The messages under the fields: the block's own (a required field left
    // empty) and the host's (settle refused with errors).

    this._errors = new Map(); // An entry a control knows is not a value yet (a mask not filled): the
    // renderer set says so through setFieldError, and it holds a Send.

    this._inputErrors = new Map();
    this._controlErrors = new Set(); // The sentence of the status line while open: a stopped Send, or the host's.

    this._message = ""; // A collapsible group the person opened or closed, by key.

    this._toggled = new Map(); // The values of the last Send, and the ones the host settled with.

    this._sent = null;
    this._answered = null;
    this._answer = null; // A value set as a property before the element was defined is an own
    // property that would hide the accessor; it is taken through it.

    for (const name of ["fields", "groups", "formatFieldValue"]) {
      if (!own(this, name)) continue;
      const early = this[name];
      delete this[name];
      this[name] = early;
    }
  } // ── data ───────────────────────────────────────────────────────────────


  get fields() {
    const value = this._fields ?? this.getProp("fields");
    return Array.isArray(value) ? value : [];
  }

  set fields(value) {
    this._fields = Array.isArray(value) ? value.map(field => ({ ...field
    })) : null;
    this.requestComponentUpdate("fields");
  }

  get groups() {
    const value = this._groups ?? this.getProp("groups");
    return Array.isArray(value) ? value : [];
  }

  set groups(value) {
    this._groups = Array.isArray(value) ? value.map(group => ({ ...group
    })) : null;
    this.requestComponentUpdate("groups");
  }
  /** The host's formatting of a value shown (as a property-view host's formatFieldValue); optional. */


  get formatFieldValue() {
    return this._formatter;
  }

  set formatFieldValue(value) {
    this._formatter = typeof value === "function" ? value : null;
    this._viewHost = null;
    this.requestComponentUpdate("format");
  }

  get mode() {
    return this.getAttribute("mode") === "edit" ? "edit" : "view";
  }

  set mode(value) {
    this.setAttribute("mode", value === "edit" ? "edit" : "view");
  }
  /** The groups drawn: the host's groups, or its fields as one group. */


  get blockGroups() {
    return (0,_js_answer_js__WEBPACK_IMPORTED_MODULE_4__.groupsOf)({
      fields: this.fields,
      groups: this.groups
    });
  }
  /** The values a Send would carry now. */


  get values() {
    return (0,_js_answer_js__WEBPACK_IMPORTED_MODULE_4__.answerValues)(this.blockGroups, this._changed);
  } // The host the view renderers read: its formatFieldValue first; a date it
  // did not format reads as the SIMAI Framework's field renderers read it
  // (VF-10: the set's own date parsing is gone).


  get viewHost() {
    if (this._viewHost) return this._viewHost;
    this._viewHost = {
      formatFieldValue: (field, value) => {
        const given = this._formatter?.(field, value);
        return typeof given === "string" ? given : undefined;
      }
    };
    return this._viewHost;
  } // ── what the field renderers call (view-properties/js/field-value.js) ──
  // `undefined` takes a change back; a value equal to the one given is no change.


  changeField(field, value) {
    const key = String(field?.key ?? "");
    if (!key) return this;
    const given = Object.hasOwn(field ?? {}, "value") && value !== undefined && JSON.stringify(value) === JSON.stringify(field.value ?? null);
    if (value === undefined || given) this._changed.delete(key);else this._changed.set(key, value);

    this._errors.delete(key);

    this._message = "";
    this.requestComponentUpdate("changed");
    return this;
  }

  reportFieldError(field, message) {
    const key = String(field?.key ?? "");
    if (!key) return this;

    const before = this._inputErrors.get(key);

    if (message) {
      this._inputErrors.set(key, String(message));

      this._controlErrors.add(key);
    } else if (this._controlErrors.has(key)) {
      this._inputErrors.delete(key);

      this._controlErrors.delete(key);
    }

    if (this._inputErrors.get(key) !== before) this.requestComponentUpdate("errors");
    return this;
  }

  openReference(field, value) {
    this.sfEmit("open", {
      id: this.questionKey,
      field: String(field?.key ?? ""),
      value
    });
  }

  toggleGroup(key) {
    const group = this.blockGroups.find(entry => entry.key === key);
    if (!group?.collapsible) return;

    this._toggled.set(key, !this.groupCollapsed(group));

    this.requestComponentUpdate("groups");
  } // A group holding an error is open, whatever was chosen: an error nobody
  // can see is not an answer anybody can correct.


  groupCollapsed(group) {
    if (!group.collapsible) return false;
    if (group.fields.some(field => this._errors.has(String(field.key)) || this._inputErrors.has(String(field.key)))) return false;
    return this._toggled.has(group.key) ? this._toggled.get(group.key) : group.collapsed;
  } // ── the answer ─────────────────────────────────────────────────────────
  // Send first checks what the block can know itself: every required field
  // filled and no control holding an entry that is not a value yet. Then the
  // confirm surface takes it (pending, the answer event).


  answer(params = {}) {
    const accepted = this.readAnswer(params);
    if (accepted !== null && this.mode !== "edit") return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("view");

    if (accepted === true && this.shownState === "open" && !this.getProp("disabled")) {
      const groups = this.blockGroups;
      const missing = (0,_js_answer_js__WEBPACK_IMPORTED_MODULE_4__.missingRequired)(groups, this._changed);

      if (missing.length || this._inputErrors.size) {
        const word = this.getProp("requiredText") || this.sfWord("required-text");

        for (const key of missing) this._errors.set(key, word);

        this._message = this.getProp("invalidText") || this.sfWord("invalid-text");
        this.requestComponentUpdate("errors");
        this.whenRendered(() => this.focusField(missing[0] ?? [...this._inputErrors.keys()][0]), {
          next: true
        });
        return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("invalid");
      }

      this._sent = (0,_js_answer_js__WEBPACK_IMPORTED_MODULE_4__.answerValues)(groups, this._changed);
      this._message = "";
    }

    if (accepted !== null) this._answer = accepted;
    return super.answer(params);
  } // The answer event carries the values with a Send: the whole answer.


  sfEmit(verb, detail = {}, options) {
    if (verb === "answer" && detail?.accepted === true) return super.sfEmit(verb, { ...detail,
      values: { ...(this._sent ?? {})
      }
    }, options);
    return super.sfEmit(verb, detail, options);
  }
  /**
   * The host's answer to the person's: {answer: applied, values?} shows the
   * values sent (or the host's), read-only; refused with errors reopens the
   * block with each message under its field; refused closed or expired
   * closes it. A Cancel answered applied is declined.
   */


  settle(params = {}) {
    if (this.mode !== "edit") return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("view");
    const result = params && typeof params === "object" && "result" in params && Object.keys(params).length === 1 ? params.result : params;
    const read = (0,_js_answer_js__WEBPACK_IMPORTED_MODULE_4__.readSettle)(result, {
      accepted: this._answer !== false
    });
    const focusWasInside = this.contains(this.ownerDocument.activeElement);
    this._errors = new Map(Object.entries(read.errors));
    this._message = read.message;
    if (read.state === "accepted") this._answered = read.values ?? this._sent ?? null;
    this.requestComponentUpdate("settled");
    this.setAttribute("state", read.state);
    const first = Object.keys(read.errors)[0];
    if (read.state === "open" && first) this.whenRendered(() => this.focusField(first), {
      next: true
    });else if (focusWasInside) this.whenRendered(() => this.focusStatus(), {
      next: true
    });
    return read.state === "open" ? (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)(read.errors && first ? "invalid" : "refused") : (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // While open the status line says the block's sentence (a stopped Send, the
  // host's refusal) before the time it can be answered by.


  statusText(shown) {
    if (shown === "open" && this._message) return this._message;
    return super.statusText(shown);
  }

  focusField(key) {
    if (key === undefined || key === null) return;
    const field = this.querySelector(`.sf-view-flow__field[data-field="${CSS.escape(String(key))}"]`);
    if (!field) return;
    const control = field.querySelector(CONTROL);
    (control ?? field).focus?.({
      preventScroll: false
    });
  } // The value a closed block shows: the one settled or sent, else the host's.


  shownValue(field) {
    const key = String(field.key);
    if (this._answered && Object.hasOwn(this._answered, key)) return this._answered[key];
    if (this._changed.has(key)) return this._changed.get(key);
    return field.value;
  }

  templateContext() {
    const base = this.confirmContext();
    const mode = this.mode;
    const state = base.state;
    const editing = mode === "edit" && (state === "open" || state === "pending");
    const errors = this._inputErrors.size ? new Map([...this._errors, ...this._inputErrors]) : this._errors;
    return { ...base,
      mode,
      editing,
      // A Cancel and a run-out time leave nothing to read but the outcome.
      fieldsShown: mode === "view" || editing || state === "accepted",
      footShown: mode === "edit",
      // The controls stay where they are while an answer is on its way or
      // the block is disabled, inert rather than redrawn as text.
      fieldsLocked: editing && (state === "pending" || Boolean(this.getProp("disabled"))),
      groups: this.blockGroups,
      changed: this._changed,
      errors,
      controlErrors: this._controlErrors,
      size: this.getProp("size") === "1" ? "1" : "1/2",
      viewHost: this.viewHost,
      emptyText: this.getProp("emptyText") || this.sfWord("empty-text"),
      blockLabel: this.sfWord("block-label"),
      submitText: this.getProp("submitText") || this.sfWord("submit-text"),
      cancelText: this.getProp("cancelText") || this.sfWord("cancel-text"),
      cancelable: this.getProp("cancelable") !== false,
      statusIcon: state === "open" && this._message ? "error" : base.statusIcon,
      statusError: state === "open" && Boolean(this._message),
      canPickRecords: false,
      canUploadFiles: false
    };
  }

  template() {
    return (0,_js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__.renderViewFlowTemplate)(this.templateContext());
  }

}

SfViewFlow.define("sf-view-flow");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "2cdacfd297c1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allFields: () => (/* binding */ allFields),
/* harmony export */   answerValues: () => (/* binding */ answerValues),
/* harmony export */   conditionedField: () => (/* binding */ conditionedField),
/* harmony export */   fieldDisabled: () => (/* binding */ fieldDisabled),
/* harmony export */   groupsOf: () => (/* binding */ groupsOf),
/* harmony export */   isEmptyValue: () => (/* binding */ isEmptyValue),
/* harmony export */   missingRequired: () => (/* binding */ missingRequired),
/* harmony export */   readSettle: () => (/* binding */ readSettle),
/* harmony export */   shownFields: () => (/* binding */ shownFields),
/* harmony export */   valuesOnScreen: () => (/* binding */ valuesOnScreen)
/* harmony export */ });
/* harmony import */ var _view_properties_js_conditions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("844bdc4d24eb");
// What sf-view-flow knows about its fields and its answer, as plain
// functions: the groups it draws, the fields a condition shows, the values a
// Send carries, the required fields left empty and the host's answer read.
// No rendering and no DOM, so the contract test runs them as they are.
//
// The field descriptors are sf-view-properties' (simai.property-view-port), and
// a field's `when` is read with that component's own conditions module.


const keyOf = field => field && field.key !== undefined && field.key !== null ? String(field.key) : "";
/**
 * The groups the block draws: the host's groups, or its flat fields as one
 * group without a label. A group or a field without a key is left out: a value
 * nobody can name cannot be sent back.
 */


function groupsOf({
  fields = [],
  groups = []
} = {}) {
  const given = Array.isArray(groups) && groups.length ? groups : [{
    key: "",
    label: "",
    fields: Array.isArray(fields) ? fields : []
  }];
  return given.filter(group => group && typeof group === "object").map((group, index) => ({
    key: group.key !== undefined && group.key !== null && String(group.key) !== "" ? String(group.key) : `group-${index + 1}`,
    label: group.label ? String(group.label) : "",
    collapsible: group.collapsible === true && Boolean(group.label),
    collapsed: group.collapsible === true && Boolean(group.label) && group.collapsed === true,
    fields: (Array.isArray(group.fields) ? group.fields : []).filter(field => field && typeof field === "object" && keyOf(field))
  }));
}
/** Every field of every group, in order. */

function allFields(groups) {
  return groups.flatMap(group => group.fields);
}
/**
 * Every field's value as it stands on screen: what the host gave, or what the
 * person typed and has not sent. The conditions read these, so a field appears
 * the moment the value it waits for is chosen.
 */

function valuesOnScreen(groups, changed = new Map()) {
  const values = new Map();

  for (const field of allFields(groups)) {
    const key = keyOf(field);
    values.set(key, changed.has(key) ? changed.get(key) : field.value);
  }

  return values;
}
/** The fields of a group that are drawn: not hidden, and shown by their condition. */

function shownFields(fields, values) {
  return (fields ?? []).filter(field => field.hidden !== true && (!field.when || (0,_view_properties_js_conditions_js__WEBPACK_IMPORTED_MODULE_0__.fieldConditions)(field, values).visible));
}
/** A field as its conditions make it now: required as `when.required` says, read-only while `when.enabled` does not hold. */

function conditionedField(field, values) {
  if (!field?.when) return field;
  const decided = (0,_view_properties_js_conditions_js__WEBPACK_IMPORTED_MODULE_0__.fieldConditions)(field, values);
  return { ...field,
    required: decided.required,
    readonly: field.readonly === true || !decided.enabled
  };
}
/** Whether a field's condition turns it off now (drawn disabled where the renderer set draws disabled apart). */

function fieldDisabled(field, values) {
  return Boolean(field?.when) && !(0,_view_properties_js_conditions_js__WEBPACK_IMPORTED_MODULE_0__.fieldConditions)(field, values).enabled;
}
/** Nothing: null, an empty text, an empty list, or a {value} holding nothing. */

function isEmptyValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object" && "value" in value) return isEmptyValue(value.value);
  return false;
} // The fields a Send answers for: drawn, and open to the person (not read-only,
// not turned off by a condition).

function answeredFields(groups, values) {
  return groups.flatMap(group => shownFields(group.fields, values)).map(field => conditionedField(field, values)).filter(field => field.readonly !== true);
}
/** The keys of the required fields a Send would leave empty, in the order they are drawn. */


function missingRequired(groups, changed = new Map()) {
  const values = valuesOnScreen(groups, changed);
  return answeredFields(groups, values).filter(field => field.required === true && isEmptyValue(values.get(keyOf(field)))).map(keyOf);
}
/**
 * What a Send carries: every drawn, editable field by key -- the whole answer,
 * not the changes. A field its condition hides is left out, as the record
 * component leaves it out of a save. An empty field is sent as null.
 */

function answerValues(groups, changed = new Map()) {
  const values = valuesOnScreen(groups, changed);
  return Object.fromEntries(answeredFields(groups, values).map(field => {
    const value = values.get(keyOf(field));
    return [keyOf(field), value === undefined ? null : value];
  }));
}
const SETTLE_CLOSED = new Set(["closed", "expired"]);
/**
 * The host's answer to a Send or a Cancel, in the record port's words, as the
 * state the block goes to: {state, errors, message, values}.
 *   applied                      accepted (Send) or declined (Cancel)
 *   refused, reason closed|expired   expired
 *   refused (anything else)      open again, with the field errors and the sentence
 * `accepted` is the answer the person gave (true for Send).
 */

function readSettle(result, {
  accepted = true
} = {}) {
  const answer = result?.answer;
  const message = typeof result?.message === "string" && result.message.trim() ? result.message : "";

  if (answer === "applied") {
    const values = result.values && typeof result.values === "object" && !Array.isArray(result.values) ? { ...result.values
    } : null;
    return {
      state: accepted ? "accepted" : "declined",
      errors: {},
      message: "",
      values
    };
  }

  if (answer === "refused" && SETTLE_CLOSED.has(result?.reason)) return {
    state: "expired",
    errors: {},
    message,
    values: null
  };
  const errors = result?.errors && typeof result.errors === "object" && !Array.isArray(result.errors) ? Object.fromEntries(Object.entries(result.errors).filter(([, text]) => typeof text === "string" && text.trim())) : {};
  return {
    state: "open",
    errors,
    message,
    values: null
  };
}

/***/ },

/***/ "e430f71c6bbc"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderViewFlowTemplate: () => (/* binding */ renderViewFlowTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("ce395bc5aedf");
/* harmony import */ var _view_properties_js_field_value_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("62c5c417c97d");
/* harmony import */ var _answer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("2cdacfd297c1");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _view_properties_js_field_value_js__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _view_properties_js_field_value_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);



 // A few properties in a flow: the header line, the fields, the status line and
// the answers.
//
// The heading is a role="heading" with the level the host chooses, not a fixed
// <h2>: the block is placed inside a message, a feed entry or a page, and the
// level right in one is a skipped level in another.
//
// Every value is drawn by sf-view-properties' field value over the Framework
// field renderers (../../../view-properties/js/field-value.js): the block has
// no field code. A field is a label above its value, the record component's
// reading order; a half-width field pairs up with the next one.
//
// The status line is a polite live region that is always in the page, and the
// place focus goes when the answers go (the confirm surface). Send is filled and
// Cancel outlined: a form's answer is to send it, and cancelling is the way out,
// not a second equal choice.

function renderField(context, field) {
  const key = String(field.key);
  const values = context.values;
  const editing = context.editing;
  const disabled = editing && (0,_answer_js__WEBPACK_IMPORTED_MODULE_3__.fieldDisabled)(field, values);
  const shown = editing ? (0,_answer_js__WEBPACK_IMPORTED_MODULE_3__.conditionedField)(field, values) : { ...field,
    value: context.component.shownValue(field)
  }; // A message the control draws under itself (a mask not filled) is not drawn twice.

  const error = context.controlErrors.has(key) ? null : context.errors.get(key);
  const width = field.width === "full" ? "full" : "half";
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-flow__field sf-view-flow__field--${width} flex flex-col gap-1/4 min-w-0"
             data-field=${key}
             data-invalid=${context.errors.has(key) ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <div class="sf-view-flow__label flex items-cross-center gap-1/3 color-on-surface-variant">
                <span>${String(field.label ?? key)}</span>
                ${shown.required && editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-flow__required color-error" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${field.hint ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark class="sf-view-flow__hint" label=${String(field.hint)} text=${String(field.hint)}></sf-help-mark>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            <div class="sf-view-flow__value min-w-0 flex items-cross-center gap-1 flex-wrap">${(0,_view_properties_js_field_value_js__WEBPACK_IMPORTED_MODULE_2__.renderFieldValue)(context, shown, editing, {
    disabled
  })}</div>
            ${error ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-flow__error color-error" role="alert">${error}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>`;
}

function renderGroup(context, group, index) {
  const fields = (0,_answer_js__WEBPACK_IMPORTED_MODULE_3__.shownFields)(group.fields, context.values);
  if (!fields.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const component = context.component;
  const collapsed = component.groupCollapsed(group);
  const bodyId = `${context.headingId.replace(/--heading$/u, "")}--group-${index + 1}`;
  const body = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-flow__fields" id=${bodyId} ?hidden=${collapsed}>
            ${fields.map(field => renderField(context, field))}
        </div>`;
  if (!group.label) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-flow__group" data-group=${group.key}>${body}</div>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-flow__group" data-group=${group.key} data-collapsed=${collapsed ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${group.collapsible ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-view-flow__group-label sf-view-flow__toggle flex items-cross-center gap-1/4"
                               aria-expanded=${collapsed ? "false" : "true"} aria-controls=${bodyId}
                               @click=${() => component.toggleGroup(group.key)}>
                        <sf-icon icon="expand_more" size="1/2" aria-hidden="true"></sf-icon>
                        <span>${group.label}</span>
                    </button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-flow__group-label">${group.label}</div>`}
            ${body}
        </div>`;
}

function renderFoot(context) {
  if (!context.footShown) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const component = context.component;
  const answering = context.open || context.pending;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <footer class="sf-view-flow__footer">
            <!-- The main action first, at the start, then the way out (C159 (4),
                 C157 (3)): «Отправить», then «Отмена». -->
            <div class="sf-view-flow__actions" ?hidden=${!answering}>
                <sf-button scheme="primary" size=${context.size}
                           text=${context.submitText} data-action="submit"
                           ?loading=${context.pressed === true}
                           ?disabled=${context.answersLocked && context.pressed !== true}
                           @click=${() => component.confirm()}></sf-button>
                ${context.cancelable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button appearance="outline" scheme="on-surface" size=${context.size}
                                      text=${context.cancelText} data-action="cancel"
                                      ?loading=${context.pressed === false}
                                      ?disabled=${context.answersLocked && context.pressed !== false}
                                      @click=${() => component.cancel()}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            <!-- Always in the page, empty while there is nothing to say: a live
                 region that appears together with its words is not heard. -->
            <p class="sf-view-flow__status${context.statusError ? " sf-view-flow__status--error" : ""}"
               role="status" tabindex="-1">
                ${context.statusText ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-icon icon=${context.statusIcon} size="1/2" aria-hidden="true"></sf-icon><span>${context.statusText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </p>
        </footer>`;
}

function renderViewFlowTemplate(context) {
  // The values the conditions read: what is typed while the block takes an
  // answer, else what it shows (the answer sent, or the host's values).
  const values = context.editing ? (0,_answer_js__WEBPACK_IMPORTED_MODULE_3__.valuesOnScreen)(context.groups, context.changed) : new Map((0,_answer_js__WEBPACK_IMPORTED_MODULE_3__.allFields)(context.groups).map(field => [String(field.key), context.component.shownValue(field)]));
  const scoped = { ...context,
    values
  };
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section
                class="sf-view-flow sf-view-flow--${context.mode}${context.editing ? " sf-view-flow--editing" : ""} sf-view-flow--${context.state} sf-view-flow--size-${context.size === "1" ? "1" : "1-2"}"
                aria-labelledby=${context.heading ? context.headingId : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${context.heading ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.blockLabel}
                aria-busy=${context.pending ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-state=${context.mode === "edit" ? context.state : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            ${context.heading ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-flow__heading" id=${context.headingId} role="heading"
                            aria-level=${context.headingLevel}>${context.heading}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.hasDescription ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-flow__description">${context.descriptionContent}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.fieldsShown ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-flow__groups" ?inert=${context.fieldsLocked}>
                        ${context.groups.map((group, index) => renderGroup(scoped, group, index))}
                    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${renderFoot(context)}
        </section>
    `;
}
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
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("06a40de06677");
/* harmony import */ var _set_fields_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("db94c32f22be");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__, _set_fields_js__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__, _set_fields_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__);


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
    return own === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-empty">${context.emptyText}</span>` : own;
  } // A datetime and a time of day are the renderer set's: sf-input-date in
  // mode datetime and time, one control each (SIMAI Framework duplication
  // audit A-14). This view drew its own pair -- the day in a datepicker and
  // the time in a masked field -- which cut the day short in a half-width
  // field and held half-typed entries of its own.
  // A person the host lists with the field itself (`options`, the user
  // type's choices) is chosen from that list when the host has no picker of
  // pages (capability field-options): the renderer set's lookup over an
  // inline list, whose value is the same {value, label}. It fell back to
  // the read-only name, so «Изменить» on a group showed «Менеджер» as text
  // (VL-90 SB-C13, view round 20).


  const listed = editing && (field.propertyType || field.type) === 'user' && !context.canPickRecords && Array.isArray(field.options) && field.options.length > 0;
  const content = editing ? (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__.renderEditField)(listed ? { ...field,
    type: 'lookup',
    propertyType: 'lookup'
  } : field, context.changed.has(key) ? context.changed.get(key) : field.value, editHost, // A field its condition turns off is drawn disabled where the set
  // draws disabled apart from read-only (a choice as buttons).
  {
    size: context.size,
    ...(disabled ? {
      disabled: true
    } : {})
  }) : (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__.renderViewField)(field, field.value, context.viewHost, {
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
    const shown = (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__.renderViewField)(field, field.value, context.viewHost, {
      size: context.size
    });

    if (shown !== null && typeof shown !== 'undefined' && shown !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-readonly color-on-surface-variant" data-readonly="true">${shown}</span>`;
    }
  }

  if (content === null || typeof content === 'undefined' || content === lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-empty">${context.emptyText}</span>`;
  }

  return content;
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
/* harmony import */ var _view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c60590f839f0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1__);

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
  return (0,_view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1__.formatPercent)(value, locale);
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
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("06a40de06677");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _decimal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f44b979883f0");
/* harmony import */ var _money_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d69ebe7e288e");
/* harmony import */ var _rows_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("ebc72103d8b6");
/* harmony import */ var _requisites_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("06dfc7b3b9d9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _money_js__WEBPACK_IMPORTED_MODULE_5__, _rows_js__WEBPACK_IMPORTED_MODULE_6__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _money_js__WEBPACK_IMPORTED_MODULE_5__, _rows_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__);
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
        const shown = (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__.renderViewField)({ ...column,
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
          const control = (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__.renderEditField)(cellField, value, cellHost, {
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
    const control = SET_CONTROLS[part.propertyType]?.edit(partField, held[part.key], partHost, partCtx) ?? (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__.renderEditField)(partField, held[part.key], partHost, {
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
    const content = own ?? (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__.renderViewField)({ ...part
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

/***/ "ce395bc5aedf"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "f59c8bcdc90a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "e92fd2d1a38c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("instance-path", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("instance-path", 1).then(resolve, reject), { once: true })));

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

/***/ "c60590f839f0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/field-decimal", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/field-decimal", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "06a40de06677"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/field-renderers", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/field-renderers", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "e4c87bda9c30"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.view-flow","tag":"sf-view-flow","version":"1.3.1","kind":"leaf","settings":{"mode":{"type":"enum","values":["view","edit"],"default":"view"},"heading":{"type":"string","default":""},"heading-level":{"type":"enum","values":["2","3","4","5","6"],"default":"3"},"fields":{"type":"list","default":[],"of":{"key":"string","label":{"type":"string","optional":true},"propertyType":"string","value":{"type":"any","nullable":true,"optional":true},"required":{"type":"boolean","optional":true},"readonly":{"type":"boolean","optional":true},"width":{"type":"string","optional":true},"hint":{"type":"string","optional":true},"when":{"type":"object","optional":true}}},"groups":{"type":"list","default":[],"of":{"key":"string","label":{"type":"string","optional":true},"collapsible":{"type":"boolean","optional":true},"collapsed":{"type":"boolean","optional":true},"fields":"list"}},"state":{"type":"enum","values":["open","pending","accepted","declined","expired"],"default":"open"},"expires-at":{"type":"date","optional":true},"block-id":{"type":"id","default":""},"disabled":{"type":"boolean","default":false},"size":{"type":"enum","values":["1","1/2"],"default":"1/2"},"cancelable":{"type":"boolean","default":true},"submit-text":{"type":"string","default-from":"runtime.submit-text"},"cancel-text":{"type":"string","default-from":"runtime.cancel-text"},"empty-text":{"type":"string","default-from":"runtime.empty-text"},"required-text":{"type":"string","default-from":"runtime.required-text"},"invalid-text":{"type":"string","default-from":"runtime.invalid-text"}},"values":{},"events":{"answer":{"carries":{"id":{"type":"id"},"accepted":"boolean","values":{"type":"object","optional":true}},"cancelable":true},"expired":{"carries":{"id":{"type":"id"}},"own-verb":true},"open":{"carries":{"id":{"type":"id"},"field":"string","value":"object"}}},"actions":{"open":{},"answer":{"with":{"accepted":"boolean"},"emits":"answer"},"confirm":{},"cancel":{},"settle":{"with":{"result":"object"}}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"host-states":{"data-state":"string"},"css-variables":{"--sf-view-flow-radius":{"type":"length","state":"default"},"--sf-view-flow-inset":{"type":"length","state":"default"},"--sf-view-flow-gap":{"type":"length","state":"default"},"--sf-view-flow-background-color":{"type":"color","state":"default"},"--sf-view-flow-border-color":{"type":"color","state":"default"}}}');

/***/ },

/***/ "d69a23bed94c"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Flow block","runtime":{"accept-text":"Send","accepted-text":"Sent","accepting-text":"Sending…","block-label":"Properties","cancel-text":"Cancel","decline-text":"Cancel","declined-text":"Cancelled","declining-text":"Cancelling…","empty-text":"not filled in","expired-text":"The time to answer has passed","invalid-text":"Fill in the marked fields","required-text":"Fill in this field","submit-text":"Send","until-text":"Answer by {time}"},"events":{"expired":{"label":"Expired"}}}');

/***/ },

/***/ "09c52c5644c7"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Блок в потоке","runtime":{"accept-text":"Отправить","accepted-text":"Отправлено","accepting-text":"Отправляем…","block-label":"Данные","cancel-text":"Отмена","decline-text":"Отмена","declined-text":"Отменено","declining-text":"Отменяем…","empty-text":"не заполнено","expired-text":"Время ответа истекло","invalid-text":"Заполните отмеченные поля","required-text":"Заполните поле","submit-text":"Отправить","until-text":"Ответить до {time}"},"events":{"expired":{"label":"Время истекло"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("9b9c0908a676");
/******/
/******/ })()
;