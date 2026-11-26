/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "5c731e87b67d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   inputDateMarks: () => (/* binding */ inputDateMarks)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("06a40de06677");
/* harmony import */ var _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("6ec906cf41a4");
/* harmony import */ var _js_calendar_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("89419bfa3ad1");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("64dcad8f4d7f");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("1798b39db680");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("e228b55ace87");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__);
// sf-view-calendar: the calendar layout of the view set (owner decision C307,
// after the board and the cards, C298). Records sit on the days of their date
// field; a move or a stretch is a change of the date fields the host saves.
// Study and accepted page: ui-control control/research/2026-11-18-calendar-view,
// ui-doc.test/proto/calendar-view-study.html.
//
// The calendar owns no data. sf-view (layout="calendar") asks the host for the
// days on screen -- window {range, date_field, end_field} in the request's
// time zone and week start (C293), up to 1000 records -- and for the undated
// records in a query of their own, and gives the answers here. A move, a
// stretch, a new record on a day, opening a record, the period and the mode
// are events sf-view (or any host) answers. A move shows at once and the event
// stays pale until the host settles it (settleMove); a refusal puts it back
// and says why.
//
// Framework parts: sf-segmented (modes), sf-button and sf-button-icon (bar,
// «+», «+N»), sf-badge, sf-checkbox, sf-toast (a refusal), SF.menu.open (the
// event menu, the day list of «+N»), sf-input-date (the «Перенести на…»
// window; the phone's month where it carries day marks, CL-6), the field
// renderers' cell output in the «Кратко» place (C300 (2)), sf-bulk-actions in
// the list mode where the pair has it (C295). The month and time grids are
// the calendar's own.








const CalendarElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: "ru"
});
const PHONE_BELOW = 600;
const DRAG_START = 4;
const TOUCH_HOLD = 350;
const HOUR_ROW = 48;
let calendars = 0;

const copy = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

const own = (element, name) => Object.prototype.hasOwnProperty.call(element, name);

const esc = value => globalThis.CSS?.escape ? globalThis.CSS.escape(String(value)) : String(value).replace(/["\\]/gu, "\\$&");

const isoDate = value => /^\d{4}-\d{2}-\d{2}$/u.test(String(value ?? "")) ? String(value) : null; // Whether the pair carries sf-bulk-actions (C295): defined, or a rule the Loader can fetch.


function bulkActionsAvailable() {
  return Boolean(globalThis.customElements?.get?.("sf-bulk-actions") || globalThis.SF?.RuleLoader?.["cl-bulk-actions"]);
} // Whether the pair's sf-input-date draws day marks (CL-6: dayMarks, a map or
// a function -> {count, tone, label}); before it the phone's month is the
// calendar's own grid with dots.


function inputDateMarks() {
  const element = globalThis.customElements?.get?.("sf-input-date");
  if (!element) return false;
  return "dayMarks" in element.prototype || (element.observedAttributes ?? []).includes("day-marks");
}

class SfViewCalendar extends CalendarElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      }
    };
  }

  constructor() {
    super();
    this._records = null;
    this._undated = null;
    this._fields = null;
    this._options = null;
    this._rules = null;
    this._actions = [];
    this._selected = new Set();
    this._current = ""; // id -> {before, after, how}: a move shown and not yet settled.

    this._pending = new Map();
    this._mode = null;
    this._anchor = null;
    this._focus = null;
    this._picked = null;
    this._undatedOpen = null;
    this._phoneUndated = false;
    this._message = "";
    this._phone = false;
    this._drag = null;
    this._pick = null;
    this._uid = `sf-view-calendar-${++calendars}`;

    for (const name of ["records", "undated", "fields", "options", "rules", "actions", "selected", "current"]) {
      if (!own(this, name)) continue;
      const early = this[name];
      delete this[name];
      this[name] = early;
    }
  } // ── data ───────────────────────────────────────────────────────────────


  _json(name, fallback, valid) {
    const value = this.parseJsonAttribute(name, fallback);
    return valid(value) ? value : fallback;
  }
  /** The records of the days on screen (window {range}), up to 1000. */


  get records() {
    if (this._records === null) this._records = copy(this._json("records", [], Array.isArray));
    return this._records;
  }

  set records(value) {
    this._records = Array.isArray(value) ? copy(value) : []; // A move still on its way keeps its event where it was put.

    for (const [id, move] of this._pending) this._write(id, move.after);

    this.requestComponentUpdate("records");
  }
  /** The records without a date (query {window: {undated}}), for the «Без даты» column. */


  get undated() {
    if (this._undated === null) this._undated = copy(this._json("undated", [], Array.isArray));
    return this._undated;
  }

  set undated(value) {
    this._undated = Array.isArray(value) ? copy(value) : [];
    this.requestComponentUpdate("undated");
  }
  /** Field descriptors (sf-view's columns): the date fields, the colour field's options, the «Кратко» fields. */


  get fields() {
    if (this._fields === null) this._fields = this._json("fields", [], Array.isArray);
    return this._fields;
  }

  set fields(value) {
    this._fields = Array.isArray(value) ? value.map(field => ({ ...field
    })) : [];
    this.requestComponentUpdate("fields");
  }
  /** layouts.calendar of simai.view-config/1 (date_field, end_field, all_day_field, mode, modes, color_field, event_fields, per_day, hours, slot, weekends, undated). */


  get options() {
    if (this._options === null) this._options = this._json("options", {}, value => value && typeof value === "object" && !Array.isArray(value));
    return this._options;
  }

  set options(value) {
    this._options = value && typeof value === "object" ? copy(value) : {};
    this.requestComponentUpdate("options");
  }
  /** The host's rules of the date field (describe().rules): [{code, reason, days?, date?, dates?}]. */


  get rules() {
    if (this._rules === null) this._rules = this._json("rules", [], Array.isArray);
    return this._rules;
  }

  set rules(value) {
    this._rules = Array.isArray(value) ? copy(value) : [];
    this.requestComponentUpdate("rules");
  }
  /** The host's actions on a selection in the list mode, after «Перенести на…»: [{id, text, icon}]. */


  get actions() {
    return this._actions;
  }

  set actions(value) {
    this._actions = Array.isArray(value) ? value.filter(action => action?.id && action.id !== "move").map(action => ({ ...action
    })) : [];
    this.requestComponentUpdate("actions");
  }

  get selected() {
    return [...this._selected];
  }

  set selected(value) {
    this._selected = new Set((Array.isArray(value) ? value : []).map(String));
    this.requestComponentUpdate("selected");
  }
  /** The record open in the record card (C305): its event is marked. */


  get current() {
    return this._current;
  }

  set current(value) {
    this._current = value === null || value === undefined ? "" : String(value);
    this.requestComponentUpdate("current");
  }

  get calendarOptions() {
    return (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.calendarOptions)(this.options, this.fields);
  } // ── the request's context (C293) ───────────────────────────────────────


  get locale() {
    return this.getProp("locale") || this.closest?.("[lang]")?.getAttribute("lang") || globalThis.document?.documentElement?.lang || "ru";
  }
  /** The zone dates are shown in: the request's (time-zone), else the person's. */


  get zone() {
    const given = this.getProp("timeZone");
    return (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.validZone)(given) ? given : (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.personZone)();
  }
  /** The week's first day: the request's (week-start), else the language's (ru Monday). */


  get weekStart() {
    // An absent week-start reads as the number setting's 0 (Sunday): only a
    // written one is the request's.
    const written = this.getAttribute?.("week-start");
    const given = written === null || written === undefined || written === "" ? null : this.getProp("weekStart");
    return Number.isInteger(given) && given >= 0 && given <= 7 ? given % 7 : (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.weekStartFor)(this.locale);
  }

  get weekend() {
    return (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.weekendFor)(this.locale);
  }
  /** «Now» in the request's zone: {date, minutes} (now= gives it, for a page that shows one moment). */


  get now() {
    const given = (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.readValue)(this.getProp("now"), {
      zone: this.zone
    });
    if (given) return {
      date: given.date,
      minutes: given.minutes ?? 0
    };
    return (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.wallIn)(Date.now(), this.zone);
  }

  get today() {
    return this.now.date;
  }

  get mode() {
    const options = this.calendarOptions;
    const modes = this.modes; // The written attribute, else layouts.calendar mode, else month: the
    // property's own default (month) must not hide the view's setting (VCL-1).

    const asked = this._mode ?? (this.hasAttribute?.("mode") ? this.getProp("mode") : null) ?? options.mode ?? "month";
    const mode = modes.includes(asked) ? asked : modes[0];
    return mode;
  }

  set mode(value) {
    this.setMode(value);
  }
  /** The modes offered: the options' modes; on a phone «День» goes and «Неделя» is three days. */


  get modes() {
    const modes = this.calendarOptions.modes;
    return this._phone ? modes.filter(mode => mode !== "day") : modes;
  }

  get anchor() {
    return this._anchor ?? isoDate(this.getProp("date")) ?? this.today;
  }

  get range() {
    const options = this.calendarOptions;
    return (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.rangeOf)(this.mode, this.anchor, {
      weekStart: this.weekStart,
      phone: this._phone,
      weekends: options.weekends,
      weekend: this.weekend
    });
  }
  /** The window this calendar asks: {range: [from, to), date_field, end_field} (study 5). */


  get window() {
    const options = this.calendarOptions;
    const {
      from,
      to
    } = this.range;
    return {
      range: [from, to],
      date_field: options.dateField,
      ...(options.endField ? {
        end_field: options.endField
      } : {})
    };
  }

  get context() {
    return {
      timeZone: this.zone,
      weekStart: this.weekStart,
      locale: this.locale
    };
  }

  get undatedOpen() {
    if (this.calendarOptions.undated === "none") return false;
    if (this._undatedOpen !== null) return this._undatedOpen;
    return this.getProp("undatedOpen") === true || this.calendarOptions.undated === "panel";
  } // ── what the template asks ─────────────────────────────────────────────


  word(key, vars = {}, count) {
    return this.sfWord(key, {
      vars,
      ...(count === undefined ? {} : {
        count
      })
    });
  }

  get events() {
    return (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.eventsOf)(this.records, {
      options: this.calendarOptions,
      fields: this.fields,
      zone: this.zone,
      titleField: this.getProp("titleField") || "title"
    });
  }

  recordTitle(record) {
    const key = this.getProp("titleField") || "title";
    const value = record?.[key] ?? record?.title ?? record?.name ?? record?.id;
    return value && typeof value === "object" ? String(value.label ?? value.title ?? "") : String(value ?? "");
  }

  format(day, options) {
    try {
      return new Intl.DateTimeFormat(this.locale, {
        timeZone: "UTC",
        ...options
      }).format(new Date(`${day}T00:00:00Z`));
    } catch {
      return day;
    }
  }

  cap(text) {
    return text ? text.charAt(0).toLocaleUpperCase(this.locale) + text.slice(1) : text;
  }

  dayName(day) {
    return this.format(day, {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  }

  dayOn(day) {
    return `${this.format(day, {
      day: "numeric",
      month: "long"
    })} (${this.format(day, {
      weekday: "long"
    })})`;
  }

  monthTitle(day) {
    return this.cap(this.format(day, {
      month: "long",
      year: "numeric"
    }).replace(/\s?г\.$/u, ""));
  }

  time(minutes) {
    if (minutes === null || minutes === undefined) return "";

    try {
      return new Intl.DateTimeFormat(this.locale, {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }).format(new Date(Date.UTC(2000, 0, 1, Math.floor(minutes / 60) % 24, minutes % 60)));
    } catch {
      return (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.clockOf)(minutes);
    }
  }

  timeOf(event) {
    if (event.allDay) return this.word("all-day-text");
    const end = event.end.date === event.start.date ? this.time(event.end.minutes) : `${this.format(event.end.date, {
      day: "numeric",
      month: "short"
    })} ${this.time(event.end.minutes)}`;
    return `${this.time(event.start.minutes)}–${end}`;
  }

  eventLabel(event) {
    return [event.title, this.timeOf(event), event.label].filter(Boolean).join(", ");
  } // The event's tooltip: its name, time, colour option, the «Кратко» fields
  // as text, and the source's time where the source zone differs (study 5).


  eventTip(event) {
    const lines = [this.eventLabel(event)];

    for (const field of this.eventFieldList) {
      const value = event.record?.[field.key];
      if (value === null || value === undefined || value === "") continue;
      lines.push(`${field.label ?? field.key}: ${typeof value === "object" ? value.label ?? value.title ?? "" : value}`);
    }

    if (event.source) lines.push(this.word("source-time-text", {
      time: this.time(event.source.minutes),
      zone: event.source.zone
    }));
    return lines.join("\n");
  }

  get eventFieldList() {
    return this.calendarOptions.eventFields.map(key => this.fields.find(field => String(field.key) === key)).filter(Boolean);
  }

  fieldAlign(field) {
    const type = String(field.propertyType ?? field.property_type ?? field.type ?? "");
    return ["integer", "number", "decimal", "money", "percent"].includes(type) ? "end" : "start";
  } // An event field in the «Кратко» place: the Framework field renderers'
  // cell output (C300 (2)); text where the set answers nothing.


  cellShape(field, record) {
    const value = record?.[field.key];
    if (value === null || value === undefined || value === "") return null;
    const typed = { ...field,
      propertyType: field.propertyType ?? field.property_type ?? field.type
    };
    let shape = null;

    try {
      shape = (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__.renderCellField)(typed, value, this.cellHost ?? null);
    } catch {
      shape = null;
    }

    if (shape !== null && shape !== undefined) return shape;
    return typeof value === "object" ? String(value.label ?? value.title ?? "") : String(value);
  }

  eventsCount(count) {
    return count ? this.word("events-count", {}, count) : this.word("events-none");
  }

  dayLabel(day, count) {
    const parts = [this.dayName(day)];
    if (day === this.today) parts.push(this.word("today-mark"));
    if (this.weekend.includes((0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.weekday)(day))) parts.push(this.word("off-mark"));
    parts.push(this.eventsCount(count));
    return parts.join(", ");
  }

  get periodTitle() {
    const {
      days
    } = this.range;
    const mode = this.mode;
    if (mode === "month" || mode === "list") return this.monthTitle(this.anchor);
    if (mode === "day") return this.cap(this.dayName(this.anchor));
    const first = days[0];
    const last = days[days.length - 1];
    if (first.slice(0, 7) === last.slice(0, 7)) return `${Number(first.slice(8))}–${this.format(last, {
      day: "numeric",
      month: "long",
      year: "numeric"
    })}`;
    return `${this.format(first, {
      day: "numeric",
      month: "long"
    })} – ${this.format(last, {
      day: "numeric",
      month: "long",
      year: "numeric"
    })}`;
  } // The rules in force: the host's rules of the date field and those of
  // layouts.calendar (view-config/1).


  get moveRules() {
    return [...(this.rules ?? []), ...(this.calendarOptions.rules ?? [])];
  } // The words of a refusal: the host's reason, else the pack's word for
  // its code (a rule's, or storage_calendar_update_*), else «Сюда нельзя».


  refusalText(reason = "", code = "") {
    const said = String(reason ?? "").trim(); // A machine code (storage_record_revision_stale) is not words for a person.

    const saidIsCode = /^[a-z][a-z0-9]*(?:[_.:-][a-z0-9]+)+$/u.test(said);
    const fromCode = (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.refusalWord)(code) ?? (saidIsCode ? (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.refusalWord)(said) : null);
    if (said && !saidIsCode) return said;
    return fromCode ? this.word(fromCode) : this.word("refuse-default");
  } // Whether a record may go to a day: its right, then the host's rules.


  check(record, day) {
    if (this.getProp("movable") === false) return {
      ok: false,
      reason: this.word("no-right-text")
    };
    const result = (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.moveCheck)({
      record,
      day,
      rules: this.moveRules,
      today: this.today,
      noRight: ""
    });
    return result.ok ? result : {
      ok: false,
      code: result.code,
      reason: this.refusalText(result.reason, result.code)
    };
  }

  readOnly(record) {
    const result = this.check(record, null);
    return result.ok ? "" : result.reason;
  }

  templateContext() {
    const options = this.calendarOptions;
    const mode = this.mode;
    return {
      component: this,
      uid: this._uid,
      size: this.getProp("size") === "1" ? "1" : "1/2",
      label: this.getAttribute("aria-label") || this.word("calendar-label"),
      options,
      mode,
      modes: this.modes,
      phone: this._phone,
      range: this.range,
      events: this.events,
      today: this.today,
      now: this.now,
      focus: this._focus ?? this.anchor,
      picked: this._picked ?? this.anchor,
      weekend: this.weekend,
      pending: this._pending,
      selected: this._selected,
      current: this._current,
      undated: this.undated,
      // An absent undated-total reads as 0: only a written one is the host's count.
      undatedTotal: this.hasAttribute?.("undated-total") && Number.isSafeInteger(this.getProp("undatedTotal")) ? this.getProp("undatedTotal") : this.undated.length,
      undatedOpen: this.undatedOpen && !this._phone,
      // The phone's month: «Без даты N» under the month swaps the chosen day's list for the records without a date.
      phoneUndated: this.phoneUndated,
      dragging: Boolean(this._drag?.active),
      truncated: this.getProp("truncated") === true || this.records.length > _js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.RECORDS_MAX,
      message: this._message,
      selectable: this.getProp("selectable") !== false,
      creatable: this.getProp("creatable") === true,
      movable: this.getProp("movable") !== false,
      bulkActions: bulkActionsAvailable(),
      inputDateMarks: inputDateMarks(),
      actions: [{
        id: "move",
        text: this.word("move-selected-text"),
        icon: "event"
      }, ...this._actions],
      pick: this._pick,
      hourRow: HOUR_ROW
    };
  }

  template() {
    return (0,_js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__.renderViewCalendarTemplate)(this.templateContext());
  } // ── life ───────────────────────────────────────────────────────────────


  onConnected() {
    super.onConnected?.();
    if (this._listening) return;
    this._listening = new AbortController();
    const signal = this._listening.signal;
    this.addEventListener("click", event => this._onClick(event), {
      signal
    });
    this.addEventListener("change", event => this._onChange(event), {
      signal
    });
    this.addEventListener("sf-segmented-change", event => this._onChange(event), {
      signal
    });
    this.addEventListener("sf-input-date-change", event => this._onPicked(event), {
      signal
    }); // The pair's sf-input-date says a chosen day as sf-change (sf-input-date-change is the older name).

    this.addEventListener("sf-change", event => {
      if (event.target?.matches?.("sf-input-date")) this._onPicked(event);
    }, {
      signal
    });
    this.addEventListener("keydown", event => this._onKey(event), {
      signal
    });
    this.addEventListener("focusin", event => this._onFocus(event), {
      signal
    });
    this.addEventListener("contextmenu", event => this._onContextMenu(event), {
      signal
    });
    this.addEventListener("pointerdown", event => this._onPointerDown(event), {
      signal
    });
    this.addEventListener("sf-bulk-actions-action", event => this._onBulkAction(event), {
      signal
    });
    this.addEventListener("sf-bulk-actions-clear", () => this.clearSelection(), {
      signal
    }); // A held touch would scroll the page; while an event is held it does not.

    this.addEventListener("touchmove", event => {
      if (this._drag) event.preventDefault();
    }, {
      signal,
      passive: false
    });
    if (typeof globalThis.ResizeObserver === "function") this._resize = new ResizeObserver(() => this._measure());

    this._measure();

    const tags = ["sf-segmented", "sf-button", "sf-button-icon", "sf-badge", "sf-checkbox", "sf-toast", "sf-menu-context"];
    if (bulkActionsAvailable()) tags.push("sf-bulk-actions");
    globalThis.SF?.Loader?.ensure?.(tags);
  }

  onDisconnected() {
    super.onDisconnected?.();

    this._endRowHold();

    this._listening?.abort();
    this._listening = null;
    this._resize?.disconnect();
    this._resize = null;
    this._observed = null;

    this._endDrag();
  }

  afterRender(changed) {
    super.afterRender?.(changed); // The host is display: contents (a Smart host has no box), so the
    // calendar's own root is what is measured for the phone layout.

    const root = this.querySelector(":scope > .sf-view-calendar");

    if (root && this._resize && this._observed !== root) {
      if (this._observed) this._resize.unobserve(this._observed);
      this._observed = root;

      this._resize.observe(root);
    }

    globalThis.setTimeout?.(() => this._rove(), 0); // Week and day open on the first hours that hold an event (else the
    // visible start), once per period.

    const scroll = this.querySelector(".sf-view-calendar__scroll");
    const key = `${this.mode}:${this.range.from}`;

    if (scroll && this._scrolledFor !== key) {
      this._scrolledFor = key;
      const timed = this.events.filter(event => !event.bar && event.first >= this.range.from && event.first < this.range.to);
      const hours = this.calendarOptions.hours;
      const first = Math.min(...timed.map(event => event.start.minutes ?? hours[0]), hours[0] + 60);
      scroll.scrollTop = Math.max(0, (first - hours[0]) / 60 * this._hourRow(scroll) - this._hourRow(scroll) / 4);
    }
  }

  _hourRow(scroll) {
    const row = scroll?.querySelector?.(".sf-view-calendar__hour");
    return row?.getBoundingClientRect?.().height || HOUR_ROW;
  }

  _measure() {
    let box = this.querySelector?.(":scope > .sf-view-calendar") ?? this;

    while (box && box.parentElement && !(box.getBoundingClientRect?.().width > 0)) box = box.parentElement;

    const width = box?.getBoundingClientRect?.().width ?? 0;
    const phone = width > 0 && width < PHONE_BELOW;

    if (phone !== this._phone) {
      const range = this.window.range.join();
      this._phone = phone;
      if (!this.modes.includes(this.mode)) this._mode = this.modes[0];
      this.requestComponentUpdate("phone");
      if (this.window.range.join() !== range) this._rangeChanged();
    }
  } // ── period and mode ────────────────────────────────────────────────────

  /** Shows a mode (month, week, day, list): the range event when the days change, save to keep it. */


  setMode(mode) {
    if (!_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.MODES.includes(mode) || !this.modes.includes(mode) || mode === this.mode) return false;
    const range = this.window.range.join();
    this._mode = mode;
    this._anchor = this._focus ?? this.anchor;
    this.requestComponentUpdate("mode");

    this._say(this.word("mode-changed-text", {
      mode: this.word(`mode-${mode === "week" && this._phone ? "three" : mode}`)
    }));

    this._save();

    if (this.window.range.join() !== range) this._rangeChanged();
    return true;
  }
  /** Shows the period around a day (yyyy-mm-dd). */


  goTo(day, {
    focus = false
  } = {}) {
    const date = isoDate(day);
    if (!date) return false;
    const range = this.window.range.join();
    this._anchor = date;
    this._focus = date;
    this._picked = date;
    this.requestComponentUpdate("period");
    if (this.window.range.join() !== range) this._rangeChanged();
    if (focus) this.whenRendered?.(() => this._focusDay(date), {
      next: true
    });
    return true;
  }

  step(direction, {
    focus = false
  } = {}) {
    const base = focus && this._focus ? this._focus : this.anchor;
    return this.goTo((0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.stepPeriod)(this.mode, base, direction, {
      phone: this._phone
    }), {
      focus
    });
  }

  _rangeChanged() {
    const {
      range
    } = this.window;
    this.sfEmit("range", {
      from: range[0],
      to: range[1],
      mode: this.mode,
      window: this.window,
      context: this.context
    });
  }

  _save() {
    this.sfEmit("save", {
      mode: this.mode,
      undated_open: this.undatedOpen
    });
  }
  /** The phone's month shows the records without a date in place of the chosen day's list. */


  get phoneUndated() {
    return this._phone && this.mode === "month" && this.calendarOptions.undated !== "none" && this._phoneUndated;
  }

  toggleUndated(open = this._phone && this.mode === "month" ? !this._phoneUndated : !this.undatedOpen) {
    if (this.calendarOptions.undated === "none") return false;

    if (this._phone && this.mode === "month") {
      this._phoneUndated = Boolean(open);
      this.requestComponentUpdate("undated");

      this._say(this.word(open ? "undated-list-opened-text" : "undated-list-closed-text"));

      return true;
    }

    this._undatedOpen = Boolean(open);
    this.requestComponentUpdate("undated");

    this._say(this.word(open ? "undated-opened-text" : "undated-closed-text"));

    this._save();

    return true;
  } // ── keys and the one Tab stop ──────────────────────────────────────────
  // The grid's cells: the days of the month, the day columns of a week or a
  // day, the rows of the list (the phone's month and its day list too).


  _cells() {
    return [...this.querySelectorAll(".sf-view-calendar__main :is([data-day][role=gridcell], .sf-view-calendar__row)")];
  }

  _rove() {
    if (!this.isConnected) return;
    const main = this.querySelector(".sf-view-calendar__main");
    if (!main) return;

    for (const node of main.querySelectorAll("button, [tabindex], sf-button, sf-button-icon, sf-checkbox")) {
      if (node.closest(".sf-view-calendar__pick")) continue;
      if (node.getAttribute("tabindex") !== "-1") node.setAttribute("tabindex", "-1");
    }

    const cells = this._cells();

    const focus = this._focus ?? this.anchor;
    let active = this._active && main.contains(this._active) ? this._active : null;
    if (!active) active = cells.find(cell => cell.dataset.day === focus) ?? cells.find(cell => cell.dataset.day >= focus) ?? cells[0] ?? null;
    this._active = active;
    if (active) active.setAttribute("tabindex", "0");
  }

  _focusable(node) {
    if (!node) return null;
    if (node.matches?.("sf-button, sf-button-icon, sf-checkbox")) return node.querySelector("button, input") ?? node;
    return node;
  }

  _go(node) {
    if (!node) return;
    this._active = node;
    if (node.dataset?.day && node.matches?.("[role=gridcell]")) this._focus = node.dataset.day;

    this._rove();

    const target = this._focusable(node);

    target?.setAttribute?.("tabindex", "0");
    target?.focus?.({
      preventScroll: false
    });
    target?.scrollIntoView?.({
      block: "nearest",
      inline: "nearest"
    });
  }

  _focusDay(day) {
    const cell = this.querySelector(`.sf-view-calendar__main [data-day="${esc(day)}"][role=gridcell]`);
    if (cell) this._go(cell);
  }

  _focusEvent(id) {
    const node = this.querySelector(`.sf-view-calendar__main [data-ev="${esc(id)}"]:not([aria-hidden=true])`);
    if (node) this._go(node);
    return Boolean(node);
  }
  /** Focus the event of a record (the record card gives the focus back here when it closes). */


  focusRecord(id) {
    return this._focusEvent(String(id));
  }

  _onFocus(event) {
    const cell = event.target.closest?.("[data-day][role=gridcell], .sf-view-calendar__row, [data-ev], [data-more], [data-add]");
    if (!cell || !cell.closest(".sf-view-calendar__main")) return;
    const owner = cell.closest("sf-button, sf-button-icon") ?? cell;

    if (owner !== this._active) {
      this._active = owner;
      if (owner.matches("[data-day][role=gridcell]")) this._focus = owner.dataset.day;
      globalThis.setTimeout?.(() => this._rove(), 0);
    }
  } // The items inside a day: its events (not the continuation of a bar), «+N» and «+».


  _inner(cell) {
    // sf-button and sf-button-icon carry their data- attributes on their inner button.
    return ["[data-ev]:not([aria-hidden=true])", "[data-more]", "[data-add]"].flatMap(selector => [...cell.querySelectorAll(selector)]).filter(node => node.closest("[data-day][role=gridcell]") === cell);
  }

  _onKey(event) {
    if (this._drag?.active) {
      if (event.key === "Escape") {
        event.preventDefault();

        this._cancelDrag();
      }

      return;
    }

    if (event.target.closest?.(".sf-view-calendar__pick")) {
      if (event.key === "Escape") {
        event.preventDefault();
        this.closePick();
      }

      return;
    }

    if (!event.target.closest?.(".sf-view-calendar__main")) return;
    const item = event.target.closest?.("[data-ev], [data-more], [data-add], .sf-view-calendar__row");
    const cell = event.target.closest?.("[data-day][role=gridcell]");
    const rtl = globalThis.getComputedStyle?.(this)?.direction === "rtl";

    const horizontal = key => key === "ArrowRight" ? rtl ? -1 : 1 : key === "ArrowLeft" ? rtl ? 1 : -1 : 0;

    if (item && item !== cell) {
      const id = item.dataset.ev ?? item.dataset.id;

      if (id && (event.shiftKey && event.key === "F10" || event.key === "ContextMenu")) {
        event.preventDefault();
        this.openEventMenu(id, item);
        return;
      }

      if (id && event.ctrlKey && event.shiftKey && horizontal(event.key)) {
        event.preventDefault();
        this.nudge(id, {
          days: horizontal(event.key)
        });
        return;
      }

      if (id && event.ctrlKey && event.shiftKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        event.preventDefault();
        if (this.mode === "week" || this.mode === "day") this.nudge(id, {
          minutes: (event.key === "ArrowDown" ? 1 : -1) * this.calendarOptions.slot
        });
        return;
      }

      if (id && event.key === " " && item.matches(".sf-view-calendar__row") && this.getProp("selectable") !== false) {
        event.preventDefault();
        this.toggleSelected(id);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (item.matches("[data-more]")) this.openDayList(item.dataset.more, item);else if (item.matches("[data-add]")) this.createOn(item.dataset.add, item.dataset.time ? Number(item.dataset.time) : null);else if (id) this.openRecord(id);
        return;
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        const list = cell ? this._inner(cell) : this._cells();
        const at = list.indexOf(item) + (event.key === "ArrowDown" ? 1 : -1);
        if (list[at]) this._go(list[at]);
        return;
      }

      if (cell && event.key === "Escape") {
        event.preventDefault();

        this._go(cell);

        return;
      }

      if (item.matches(".sf-view-calendar__row") && (event.key === "PageDown" || event.key === "PageUp")) {
        event.preventDefault();
        this.step(event.key === "PageDown" ? 1 : -1);
        this.whenRendered?.(() => this._go(this._cells()[0]), {
          next: true
        });
        return;
      }

      if (item.matches(".sf-view-calendar__row") && (event.key === "Home" || event.key === "End")) {
        event.preventDefault();

        const rows = this._cells();

        this._go(event.key === "Home" ? rows[0] : rows[rows.length - 1]);

        return;
      } // From an event of a day, the day keys still go from its day:
      // ←→ the next day, Home/End the week, PageUp/PageDown the period.


      const dayKey = horizontal(event.key) || ["Home", "End", "PageDown", "PageUp"].includes(event.key);
      if (!cell || !dayKey || event.ctrlKey || event.altKey || event.metaKey) return;
    } else if (!cell || event.target !== cell) return;

    const day = cell.dataset.day;
    const month = this.mode === "month";

    const shift = dow => ((0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.weekday)(day) - this.weekStart + 7) % 7 + dow;

    let to = null;
    if (horizontal(event.key)) to = (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.addDays)(day, horizontal(event.key));else if (event.key === "ArrowDown" && month) to = (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.addDays)(day, 7);else if (event.key === "ArrowUp" && month) to = (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.addDays)(day, -7);else if (event.key === "Home") to = (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.addDays)(day, -shift(0));else if (event.key === "End") to = (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.addDays)(day, 6 - shift(0));else if (event.key === "PageDown" || event.key === "PageUp") {
      event.preventDefault();
      const direction = event.key === "PageDown" ? 1 : -1;
      if (event.shiftKey) this.goTo((0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.addMonths)(day, 12 * direction), {
        focus: true
      });else this.step(direction, {
        focus: true
      });

      this._say(this.periodTitle);

      return;
    } else if (event.key === "t" || event.key === "T" || event.key === "е" || event.key === "Е") {
      event.preventDefault();
      this.goTo(this.today, {
        focus: true
      });

      this._say(this.word("today-said-text", {
        day: this.dayName(this.today)
      }));

      return;
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (this._phone && month) {
        this.pickDay(day);
        return;
      }

      const first = this._inner(cell)[0];

      if (first) this._go(first);else this._say(`${this.cap(this.dayName(day))}: ${this.word("events-none")}`);
      return;
    } else if (event.shiftKey && event.key === "F10" || event.key === "ContextMenu") {
      event.preventDefault();
      this.openDayMenu(day, cell);
      return;
    }
    if (!to) return;
    event.preventDefault();
    if (this.querySelector(`.sf-view-calendar__main [data-day="${esc(to)}"][role=gridcell]`)) this._focusDay(to);else this.goTo(to, {
      focus: true
    });
    if (this._phone && month) this.pickDay(to, {
      quiet: true
    });
  } // ── clicks and menus ───────────────────────────────────────────────────


  _onClick(event) {
    if (this._dragged || this._rowHeld) {
      this._dragged = false;
      this._rowHeld = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const target = event.target.closest?.("[data-page], [data-gotoday], [data-undtoggle], [data-undclose], [data-add], [data-more], [data-menu], [data-box], [data-ev], [data-pickclose], [data-bulk], [data-clear], [data-day]");
    if (!target || !this.contains(target)) return;
    const data = target.dataset;
    if (data.page) this.step(Number(data.page));else if (target.hasAttribute("data-gotoday")) {
      this.goTo(this.today);

      this._say(this.word("today-said-text", {
        day: this.dayName(this.today)
      }));
    } else if (target.hasAttribute("data-undtoggle")) this.toggleUndated();else if (target.hasAttribute("data-undclose")) this.toggleUndated(false);else if (data.add) this.createOn(data.add, data.time ? Number(data.time) : null);else if (data.more) this.openDayList(data.more, target);else if (data.menu) this.openEventMenu(data.menu, target);else if (data.box) return;else if (data.ev) this.openRecord(data.ev);else if (target.hasAttribute("data-pickclose")) this.closePick();else if (data.bulk) this._bulk(data.bulk, target);else if (target.hasAttribute("data-clear")) this.clearSelection();else if (data.day && target.matches("[role=gridcell]")) {
      this._focus = data.day;
      if (this._phone && this.mode === "month") this.pickDay(data.day);
    }
  }

  _onContextMenu(event) {
    const item = event.target.closest?.("[data-ev]");
    if (!item || !this.contains(item)) return;
    event.preventDefault(); // A held row already opened its menu; a held touch on Android also sends this.

    this._endRowHold();

    if (this._rowHeld) return;
    this.openEventMenu(item.dataset.ev, null, [event.clientX, event.clientY]);
  }

  _onChange(event) {
    const segmented = event.target?.closest?.("sf-segmented.sf-view-calendar__modes");

    if (segmented) {
      const value = event.detail?.value ?? segmented.value;
      if (value && value !== this.mode) this.setMode(String(value));
      return;
    }

    const box = event.target.closest?.("[data-box]");
    if (!box || event.type !== "change") return;
    const on = event.target.checked ?? box.checked;

    this._setSelected(box.dataset.box, Boolean(on));
  }
  /** The phone's month: a day chosen shows its events as a list under the month. */


  pickDay(day, {
    quiet = false
  } = {}) {
    this._picked = day;
    this._phoneUndated = false;
    this._focus = day;
    this.requestComponentUpdate("picked");
    if (!quiet) this._say(`${this.cap(this.dayName(day))}: ${this.eventsCount(this.events.filter(event => (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.onDay)(event, day)).length)}`);
  }

  _menu(options) {
    const menu = globalThis.SF?.menu;
    if (typeof menu?.open !== "function") return Promise.resolve(null);
    return Promise.resolve(menu.open(options)).catch(() => null);
  }

  _found(id) {
    const key = String(id);
    const event = this.events.find(entry => entry.id === key) ?? null;
    const record = event?.record ?? this.undated.find(entry => String(entry.id) === key) ?? null;
    return record ? {
      event,
      record
    } : null;
  }
  /** The event menu (Shift+F10, the context menu, «⋯»): Открыть, a day earlier / later, Перенести на…, Убрать дату; a disabled item says why. */


  openEventMenu(id, anchor = null, point = null) {
    const found = this._found(id);

    if (!found) return Promise.resolve(null);
    const {
      event,
      record
    } = found;
    const title = this.recordTitle(record);
    const readOnly = this.readOnly(record);
    const day = event?.first ?? null;
    const earlier = day ? (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.addDays)(day, -1) : null;
    const later = day ? (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.addDays)(day, 1) : this.today;
    const checkEarlier = earlier ? this.check(record, earlier) : {
      ok: false,
      reason: ""
    };
    const checkLater = this.check(record, later);
    const entries = [{
      id: "open",
      text: this.word("open-text"),
      icon: "open_in_new"
    }, {
      type: "separator"
    }, {
      id: `to:${earlier}`,
      text: this.word("earlier-text"),
      icon: "chevron_left",
      disabled: !earlier || !checkEarlier.ok,
      caption: earlier && !checkEarlier.ok ? checkEarlier.reason : ""
    }, {
      id: `to:${later}`,
      text: this.word(day ? "later-text" : "to-today-text"),
      icon: "chevron_right",
      disabled: !checkLater.ok,
      caption: checkLater.ok ? "" : checkLater.reason
    }, {
      id: "pick",
      text: this.word("pick-text"),
      icon: "event",
      disabled: Boolean(readOnly),
      caption: readOnly
    }];
    if (this.calendarOptions.undated !== "none") entries.push({
      id: "clear",
      text: this.word("clear-date-text"),
      icon: "event_busy",
      disabled: !day || Boolean(readOnly),
      caption: day ? readOnly : ""
    });
    return this._menu({ ...(point ? {
        x: point[0],
        y: point[1]
      } : {
        anchor: anchor ?? this
      }),
      entries,
      label: this.word("event-menu-text", {
        title
      })
    }).then(chosen => {
      const choice = chosen?.id;
      if (!choice) return null;
      if (choice === "open") return this.openRecord(id);
      if (choice.startsWith("to:")) return this.moveRecord(id, {
        day: choice.slice(3)
      }, {
        how: "menu"
      });
      if (choice === "pick") return this.openPick([String(id)], anchor);
      if (choice === "clear") return this.moveRecord(id, {
        day: null
      }, {
        how: "menu"
      });
      return null;
    });
  }
  /** The day menu (Shift+F10 on a day): a new record on that day, its events. */


  openDayMenu(day, anchor = null) {
    const entries = [];
    if (this.getProp("creatable") === true) entries.push({
      id: "add",
      text: this.word("add-text", {
        day: this.dayOn(day)
      }),
      icon: "add"
    });
    const list = this.events.filter(event => (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.onDay)(event, day));
    if (list.length) entries.push({
      id: "list",
      text: this.word("day-list-text"),
      icon: "list"
    });
    if (!entries.length) return Promise.resolve(null);
    return this._menu({
      anchor: anchor ?? this,
      entries,
      label: this.cap(this.dayName(day))
    }).then(chosen => {
      if (chosen?.id === "add") return this.createOn(day);
      if (chosen?.id === "list") return this.openDayList(day, anchor);
      return null;
    });
  }
  /** «+N»: the day's list in place (C307 (2)); a choice opens the record. */


  openDayList(day, anchor = null) {
    const list = this.events.filter(event => (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.onDay)(event, day));
    const label = `${this.cap(this.dayName(day))} — ${this.eventsCount(list.length)}`;
    const fields = this.eventFieldList;
    const entries = list.map(event => ({
      id: event.id,
      text: `${event.allDay ? this.word("all-day-text") : this.time(event.start.minutes)}  ${event.title}`,
      caption: [...fields.map(field => {
        const value = event.record?.[field.key];
        return value === null || value === undefined ? "" : typeof value === "object" ? value.label ?? value.title ?? "" : String(value);
      }), event.label].filter(Boolean).join(" · ")
    }));
    return this._menu({
      anchor: anchor ?? this,
      label,
      entries
    }).then(chosen => chosen?.id ? this.openRecord(chosen.id) : null);
  } // ── what the calendar asks the host ────────────────────────────────────


  openRecord(id) {
    return this.sfEmit("open", {
      id: String(id)
    });
  }
  /** «+» in a day (C307 (4)): the host opens a new record with that date (and time, in week and day). */


  createOn(day, minutes = null) {
    const date = isoDate(day);
    if (!date) return false;
    return this.sfEmit("create", {
      date,
      ...(minutes === null || minutes === undefined ? {} : {
        time: (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.clockOf)(minutes)
      }),
      field: this.calendarOptions.dateField
    });
  } // ── selection (list mode) ──────────────────────────────────────────────


  toggleSelected(id) {
    this._setSelected(id, !this._selected.has(String(id)));
  }

  _setSelected(id, on) {
    const key = String(id);
    if (on === this._selected.has(key)) return;
    if (on) this._selected.add(key);else this._selected.delete(key);
    this.requestComponentUpdate("selected");
    this.sfEmit("select", {
      ids: [...this._selected]
    });
  }

  clearSelection() {
    if (!this._selected.size) return;

    this._selected.clear();

    this.requestComponentUpdate("selected");
    this.sfEmit("select", {
      ids: []
    });
  }

  _onBulkAction(event) {
    const id = event.detail?.id;

    if (id === "move") {
      event.preventDefault();
      return this._bulk("move", event.target);
    }

    return this.sfEmit("apply", {
      action: String(id),
      ids: [...this._selected],
      scope: event.detail?.scope ?? "selection"
    });
  }

  _bulk(action, anchor) {
    if (action !== "move") return this.sfEmit("apply", {
      action: String(action),
      ids: [...this._selected],
      scope: "selection"
    });
    return this.openPick([...this._selected], anchor);
  } // ── «Перенести на…»: sf-input-date in a window ─────────────────────────


  openPick(ids, anchor = null) {
    const list = ids.map(String).filter(id => this._found(id));
    if (!list.length) return false;
    const box = anchor?.getBoundingClientRect?.();
    const root = this.querySelector(":scope > .sf-view-calendar")?.getBoundingClientRect?.();

    const first = this._found(list[0]);

    this._pick = {
      ids: list,
      title: list.length === 1 ? this.recordTitle(first.record) : this.word("selected-text", {
        count: list.length
      }),
      day: first.event?.first ?? this.today,
      top: box && root ? Math.max(0, box.bottom - root.top) : 0,
      minDate: this.moveRules.some(rule => rule?.code === "past") ? this.today : ""
    };
    this.requestComponentUpdate("pick");
    globalThis.customElements?.get?.("sf-input-date") || globalThis.SF?.Loader?.ensure?.(["sf-input-date"]);
    this.whenRendered?.(() => this.querySelector(".sf-view-calendar__pick sf-input-date")?.focus?.(), {
      next: true
    });
    return true;
  }

  closePick() {
    if (!this._pick) return;
    const ids = this._pick.ids;
    this._pick = null;
    this.requestComponentUpdate("pick");
    this.whenRendered?.(() => this._focusEvent(ids[0]), {
      next: true
    });
  }

  _onPicked(event) {
    if (event.target?.matches?.(".sf-view-calendar__phone-month")) {
      const chosen = isoDate(event.detail?.date ?? event.detail?.["iso-value"]);
      if (chosen) this.pickDay(chosen);
      return;
    }

    if (!this._pick || !event.target?.closest?.(".sf-view-calendar__pick")) return;
    const day = isoDate(event.detail?.date ?? event.detail?.["iso-value"] ?? event.detail?.value);
    if (!day) return;
    const ids = this._pick.ids;
    const refused = ids.map(id => [id, this.check(this._found(id)?.record, day)]).filter(([, result]) => !result.ok);

    if (refused.length === ids.length) {
      this._refuse(this.word("not-moved-text", {
        title: this._pick.title,
        reason: refused[0][1].reason
      }));

      return;
    }

    this._pick = null;
    this.requestComponentUpdate("pick");
    if (ids.length > 1) this.clearSelection();

    for (const id of ids) this.moveRecord(id, {
      day
    }, {
      how: "pick"
    });
  } // ── moves ──────────────────────────────────────────────────────────────

  /** One step by keys or the menu: a day earlier or later, or one slot in week and day. */


  nudge(id, {
    days = 0,
    minutes = 0
  } = {}) {
    const found = this._found(id);

    if (!found?.event) return Promise.resolve(null);
    const {
      event
    } = found;
    if (minutes && event.bar) return Promise.resolve(null);
    const start = event.start.minutes;
    const next = minutes ? start + minutes : null;
    if (next !== null && (next < 0 || next >= 24 * 60)) return Promise.resolve(null);
    return this.moveRecord(id, {
      day: (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.addDays)(event.first, days),
      minutes: next
    }, {
      how: "keys"
    });
  }
  /**
   * Moves a record to a day (and a time, in week and day), or to no day
   * («Без даты»). Refused by its right or the host's rules: the reason,
   * nothing moves. Else shown at once and pale, sf-view-calendar-move goes
   * out (cancelable), and the host settles it with settleMove.
   */


  moveRecord(id, {
    day,
    minutes = null,
    endMinutes = null
  } = {}, {
    how = ""
  } = {}) {
    const key = String(id);

    const found = this._found(key);

    if (!found || this._pending.has(key)) return Promise.resolve(null);
    const {
      event,
      record
    } = found;
    const title = this.recordTitle(record);
    const options = this.calendarOptions;
    if (day === null && !event) return Promise.resolve(null);
    const check = this.check(record, day);

    if (!check.ok) {
      this._refuse(this.word("not-moved-text", {
        title,
        reason: check.reason
      }));

      return Promise.resolve(null);
    }

    const dateField = this.fields.find(field => String(field.key) === options.dateField);
    const sourceZone = dateField?.timeZone ?? dateField?.time_zone ?? null;
    const timed = String(dateField?.propertyType ?? dateField?.property_type ?? dateField?.type ?? "") !== "date";
    const patch = (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_4__.movePatch)(event, {
      day,
      minutes: event ? minutes : timed ? minutes ?? options.hours[0] + 120 : null,
      endMinutes,
      options,
      zone: this.zone,
      sourceZone,
      record: { ...record,
        __timed: timed
      }
    });
    const before = Object.fromEntries(Object.keys(patch).map(field => [field, record[field] ?? null]));
    if (Object.keys(patch).every(field => patch[field] === before[field])) return Promise.resolve(null);
    const move = {
      before,
      after: patch,
      how,
      from: event ? "dated" : "undated",
      title
    };

    this._pending.set(key, move);

    this._write(key, patch);

    this.requestComponentUpdate("move"); // A move by keys keeps the focus on the event in its new place.

    if (how === "keys" || how === "menu" || how === "pick") this.whenRendered?.(() => this._focusEvent(key), {
      next: true
    });
    const allowed = this.sfEmit("move", {
      id: key,
      patch: { ...patch
      },
      from: { ...before
      },
      revision: record.revision ?? record._revision ?? null,
      how
    }, {
      cancelable: true
    });

    if (allowed === false) {
      this.settleMove(key, {
        answer: "refused",
        reason: ""
      });
      return Promise.resolve(null);
    }

    return Promise.resolve(true);
  } // A patch written into the record wherever it is now: dated records and
  // undated ones trade places when the date comes or goes.


  _write(id, patch) {
    const key = String(id);
    const options = this.calendarOptions;
    const inRecords = this.records.findIndex(entry => String(entry.id) === key);
    const inUndated = this.undated.findIndex(entry => String(entry.id) === key);
    const record = inRecords >= 0 ? this.records[inRecords] : inUndated >= 0 ? this.undated[inUndated] : null;
    if (!record) return;
    Object.assign(record, patch);
    const dated = record[options.dateField] !== null && record[options.dateField] !== undefined && record[options.dateField] !== "";

    if (dated && inUndated >= 0) {
      this.undated.splice(inUndated, 1);
      this.records.push(record);
      this._undatedShift = (this._undatedShift ?? 0) - 1;
    } else if (!dated && inRecords >= 0) {
      this.records.splice(inRecords, 1);
      this.undated.unshift(record);
      this._undatedShift = (this._undatedShift ?? 0) + 1;
    }

    const total = this.hasAttribute?.("undated-total") ? this.getProp("undatedTotal") : null;

    if (Number.isSafeInteger(total) && this._undatedShift) {
      this.setAttribute("undated-total", String(Math.max(0, total + this._undatedShift)));
      this._undatedShift = 0;
    }
  }
  /**
   * The host's answer to a move: {answer: applied, record?} keeps it (and
   * draws the record as the host has it); refused or conflict puts the
   * event back and says the host's reason (toast and live region); focus
   * stays on the event.
   */


  settleMove(id, result = {}) {
    if (id && typeof id === "object") ({
      id,
      result = {}
    } = id);
    const key = String(id);

    const move = this._pending.get(key);

    if (!move) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("unknown-move");

    this._pending.delete(key);

    const focused = this.ownerDocument?.activeElement?.closest?.("[data-ev]")?.dataset?.ev === key || this._keyed === key;

    if (result.answer === "applied") {
      if (result.record && typeof result.record === "object") this._write(key, copy(result.record));

      this._say(this._movedText(key, move));
    } else {
      this._write(key, move.before);

      const reason = this.refusalText(result.message || result.reason || "", result.code ?? result.reason ?? "");

      this._refuse(this.word("not-moved-text", {
        title: move.title,
        reason
      }));
    }

    this.requestComponentUpdate("settled");
    this.whenRendered?.(() => {
      if (focused || this.ownerDocument?.activeElement === this.ownerDocument?.body) this._focusEvent(key);
    }, {
      next: true
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  _movedText(id, move) {
    const found = this._found(id);

    const event = found?.event;
    if (!event) return this.word("undated-moved-text", {
      title: move.title
    });
    const when = `${this.dayOn(event.first)}${event.allDay ? "" : `, ${this.timeOf(event)}`}`;
    if (move.from === "undated") return this.word("dated-text", {
      title: move.title,
      when
    });
    const options = this.calendarOptions;
    const onlyEnd = Object.keys(move.after).length === 1 && options.endField && move.after[options.endField] !== undefined;
    if (onlyEnd) return this.word("resized-text", {
      title: move.title,
      time: event.allDay ? this.dayOn(event.last) : this.time(event.end.minutes)
    });
    return this.word("moved-text", {
      title: move.title,
      when
    });
  } // ── pointer moves and stretches (mouse and touch) ──────────────────────


  _onPointerDown(event) {
    if (event.button !== 0) return;
    this._rowHeld = false; // A list row (the phone's day list, its «Без даты» list) does not drag:
    // a held touch opens the event menu, where «Перенести на…» sets the date.

    const row = event.pointerType === "touch" ? event.target.closest?.(".sf-view-calendar__row[data-ev]") : null;

    if (row && this.contains(row) && !event.target.closest?.("sf-checkbox, [data-menu]")) {
      this._startRowHold(event, row);

      return;
    }

    if (this.getProp("movable") === false) return;
    const handle = event.target.closest?.("[data-rs]");
    const item = handle ? null : event.target.closest?.("[data-ev]");
    if (!handle && !item) return;
    if (event.target.closest?.("sf-checkbox, [data-menu]")) return;
    const id = handle?.dataset.rs ?? item.dataset.ev;

    const found = this._found(id);

    if (!found || this.readOnly(found.record) || this._pending.has(String(id))) return;
    if (item?.closest(".sf-view-calendar__row")) return;
    const node = handle ? handle.closest("[data-ev]") : item;
    const rect = node.getBoundingClientRect();
    this._drag = {
      id: String(id),
      node,
      resize: Boolean(handle),
      active: false,
      pointer: event.pointerId,
      type: event.pointerType,
      x: event.clientX,
      y: event.clientY,
      grabY: event.clientY - rect.top,
      ghost: null,
      over: null
    };
    if (handle) event.preventDefault();
    const signal = this._listening?.signal;

    this._dragMove = moving => this._onPointerMove(moving);

    this._dragUp = up => this._onPointerUp(up);

    globalThis.addEventListener?.("pointermove", this._dragMove, {
      signal
    });
    globalThis.addEventListener?.("pointerup", this._dragUp, {
      signal
    });
    globalThis.addEventListener?.("pointercancel", this._dragUp, {
      signal
    });

    if (event.pointerType === "touch" && !handle) {
      this._dragHold = globalThis.setTimeout?.(() => this._beginDrag(), TOUCH_HOLD);
    } else if (handle) {
      this._beginDrag();
    }
  }

  _startRowHold(event, row) {
    this._endRowHold();

    const start = [event.clientX, event.clientY];
    const pointer = event.pointerId;
    const signal = this._listening?.signal;

    const stop = () => this._endRowHold();

    const move = moving => {
      if (moving.pointerId === pointer && Math.hypot(moving.clientX - start[0], moving.clientY - start[1]) > 8) stop();
    };

    globalThis.addEventListener?.("pointermove", move, {
      signal
    });
    globalThis.addEventListener?.("pointerup", stop, {
      signal
    });
    globalThis.addEventListener?.("pointercancel", stop, {
      signal
    });
    const timer = globalThis.setTimeout?.(() => {
      stop();
      this._rowHeld = true;
      this.openEventMenu(row.dataset.ev, row);
    }, TOUCH_HOLD * 2);
    this._rowHold = {
      timer,
      move,
      stop
    };
  }

  _endRowHold() {
    const hold = this._rowHold;
    if (!hold) return;
    this._rowHold = null;
    globalThis.clearTimeout?.(hold.timer);
    globalThis.removeEventListener?.("pointermove", hold.move);
    globalThis.removeEventListener?.("pointerup", hold.stop);
    globalThis.removeEventListener?.("pointercancel", hold.stop);
  }

  _beginDrag() {
    const drag = this._drag;
    if (!drag || drag.active) return;
    drag.active = true;

    const found = this._found(drag.id);

    const record = found?.record; // While held, a day the host refuses dims and says why (CA-4).

    if (!drag.resize) {
      for (const cell of this.querySelectorAll("[data-day][data-drop]")) {
        const result = this.check(record, cell.dataset.day);
        cell.toggleAttribute("data-refuse", !result.ok);
        if (result.ok) cell.removeAttribute("title");else cell.setAttribute("title", this.word("refuse-text", {
          reason: result.reason
        }));
      }

      const ghost = drag.node.cloneNode(true);
      ghost.removeAttribute("id");
      ghost.setAttribute("aria-hidden", "true");
      ghost.classList.add("sf-view-calendar__ghost");
      const rect = drag.node.getBoundingClientRect();
      ghost.style.inlineSize = `${rect.width}px`;
      ghost.style.blockSize = `${rect.height}px`;
      ghost.style.insetInlineStart = `${rect.left}px`;
      ghost.style.insetBlockStart = `${rect.top}px`;
      this.querySelector(":scope > .sf-view-calendar")?.append(ghost);
      drag.ghost = ghost;
      drag.left = rect.left;
      drag.top = rect.top;
      drag.node.setAttribute("data-held", "");
    }

    this.querySelector(":scope > .sf-view-calendar")?.setAttribute("data-dragging", "");

    this._say(this.word("held-text", {
      title: this.recordTitle(record)
    }));
  }

  _target(x, y) {
    const hit = this.ownerDocument?.elementFromPoint?.(x, y);
    if (!hit || !this.contains(hit)) return null;
    return hit.closest?.("[data-day][data-drop], [data-und]") ?? null;
  }

  _onPointerMove(event) {
    const drag = this._drag;
    if (!drag || event.pointerId !== drag.pointer) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;

    if (!drag.active) {
      if (drag.type === "touch") {
        if (Math.hypot(dx, dy) > 8) this._endDrag();
        return;
      }

      if (Math.hypot(dx, dy) < DRAG_START) return;

      this._beginDrag();
    }

    event.preventDefault?.();

    if (drag.resize) {
      const block = drag.node;
      const column = block.closest("[data-day][data-drop]");

      const minutes = this._slotAt(column, event.clientY, {
        end: true
      });

      const found = this._found(drag.id)?.event;
      if (!found) return;
      const end = Math.max(found.start.minutes + this.calendarOptions.slot, minutes);
      const [from] = this.calendarOptions.hours;

      const row = this._hourRow(column);

      block.style.blockSize = `${(end - Math.max(from, found.start.minutes)) / 60 * row}px`;
      drag.end = end;
      return;
    }

    if (drag.ghost) {
      drag.ghost.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    const target = this._target(event.clientX, event.clientY);

    if (target !== drag.over) {
      drag.over?.removeAttribute("data-over");
      drag.over = target;
      if (target && !target.hasAttribute("data-refuse")) target.setAttribute("data-over", "");
      if (target?.hasAttribute("data-refuse")) this._say(target.getAttribute("title") ?? "");
    }

    drag.clientY = event.clientY;
  }

  _onPointerUp(event) {
    const drag = this._drag;
    if (!drag || event.pointerId !== drag.pointer) return;
    const active = drag.active;

    if (!active || event.type === "pointercancel") {
      this._endDrag();

      if (active) this.requestComponentUpdate("drag");
      return;
    }

    this._dragged = true;
    globalThis.setTimeout?.(() => {
      this._dragged = false;
    }, 0);

    if (drag.resize) {
      const end = drag.end;

      this._endDrag();

      const found = this._found(drag.id)?.event;
      if (found && end !== undefined && end !== found.end.minutes) this.moveRecord(drag.id, {
        day: found.first,
        minutes: found.start.minutes,
        endMinutes: end
      }, {
        how: "stretch"
      });else this.requestComponentUpdate("drag");
      return;
    }

    const target = this._target(event.clientX, event.clientY);

    const id = drag.id;
    const grab = drag.grabY;

    this._endDrag();

    if (!target) {
      this.requestComponentUpdate("drag");
      return;
    }

    if (target.hasAttribute("data-und")) {
      if (this._found(id)?.event) this.moveRecord(id, {
        day: null
      }, {
        how: "drag"
      });
      return;
    }

    const day = target.dataset.day;
    const record = this._found(id)?.record;
    const result = this.check(record, day);

    if (!result.ok) {
      this._refuse(this.word("not-moved-text", {
        title: this.recordTitle(record),
        reason: result.reason
      }));

      this.requestComponentUpdate("drag");
      return;
    }

    let minutes = null;
    if (target.matches(".sf-view-calendar__col")) minutes = this._slotAt(target, event.clientY - grab);
    this.moveRecord(id, {
      day,
      minutes
    }, {
      how: "drag"
    });
  }

  _cancelDrag() {
    this._endDrag();

    this.requestComponentUpdate("drag");

    this._say(this.word("drop-cancelled-text"));
  }

  _endDrag() {
    globalThis.clearTimeout?.(this._dragHold);

    if (this._dragMove) {
      globalThis.removeEventListener?.("pointermove", this._dragMove);
      globalThis.removeEventListener?.("pointerup", this._dragUp);
      globalThis.removeEventListener?.("pointercancel", this._dragUp);
    }

    const drag = this._drag;
    this._drag = null;
    if (!drag) return;
    drag.ghost?.remove();
    drag.node?.removeAttribute?.("data-held");
    drag.over?.removeAttribute?.("data-over");
    this.querySelector(":scope > .sf-view-calendar")?.removeAttribute("data-dragging");

    for (const cell of this.querySelectorAll("[data-refuse]")) {
      cell.removeAttribute("data-refuse");
      cell.removeAttribute("title");
    }
  } // The minute under a point of a day column, on the slot's step, inside the visible hours.


  _slotAt(column, y, {
    end = false
  } = {}) {
    const options = this.calendarOptions;
    const [from, to] = options.hours;
    if (!column) return from;
    const rect = column.getBoundingClientRect();

    const row = this._hourRow(column);

    const raw = from + (y - rect.top) / row * 60;
    const stepped = Math.round(raw / options.slot) * options.slot;
    return Math.max(from, Math.min(end ? to : to - options.slot, stepped));
  } // ── messages ───────────────────────────────────────────────────────────


  _say(text) {
    this._message = String(text ?? "");
    this.requestComponentUpdate("message");
  }

  _refuse(text) {
    this._say(text);

    const doc = this.ownerDocument;
    if (!doc?.createElement) return;
    const toast = doc.createElement("sf-toast");
    toast.setAttribute("status", "error");
    toast.setAttribute("heading", text);
    toast.setAttribute("closable", "");
    toast.setAttribute("duration", "6000");
    doc.body?.append(toast);
  }

}

SfViewCalendar.define("sf-view-calendar");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "89419bfa3ad1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EVENT_FIELDS_MAX: () => (/* binding */ EVENT_FIELDS_MAX),
/* harmony export */   HOURS: () => (/* binding */ HOURS),
/* harmony export */   MODES: () => (/* binding */ MODES),
/* harmony export */   MONTH_DAYS: () => (/* binding */ MONTH_DAYS),
/* harmony export */   PER_DAY: () => (/* binding */ PER_DAY),
/* harmony export */   PHONE_DAYS: () => (/* binding */ PHONE_DAYS),
/* harmony export */   RECORDS_MAX: () => (/* binding */ RECORDS_MAX),
/* harmony export */   REFUSAL_WORDS: () => (/* binding */ REFUSAL_WORDS),
/* harmony export */   RULE_CODES: () => (/* binding */ RULE_CODES),
/* harmony export */   SLOT: () => (/* binding */ SLOT),
/* harmony export */   SPAN_DAYS: () => (/* binding */ SPAN_DAYS),
/* harmony export */   SPAN_DAYS_MAX: () => (/* binding */ SPAN_DAYS_MAX),
/* harmony export */   addDays: () => (/* binding */ addDays),
/* harmony export */   addMonths: () => (/* binding */ addMonths),
/* harmony export */   barLanes: () => (/* binding */ barLanes),
/* harmony export */   calendarOptions: () => (/* binding */ calendarOptions),
/* harmony export */   clockOf: () => (/* binding */ clockOf),
/* harmony export */   daysBetween: () => (/* binding */ daysBetween),
/* harmony export */   eventsOf: () => (/* binding */ eventsOf),
/* harmony export */   instantOf: () => (/* binding */ instantOf),
/* harmony export */   isoDay: () => (/* binding */ isoDay),
/* harmony export */   minutesOf: () => (/* binding */ minutesOf),
/* harmony export */   monthStart: () => (/* binding */ monthStart),
/* harmony export */   moveCheck: () => (/* binding */ moveCheck),
/* harmony export */   movePatch: () => (/* binding */ movePatch),
/* harmony export */   onDay: () => (/* binding */ onDay),
/* harmony export */   personZone: () => (/* binding */ personZone),
/* harmony export */   placeTimed: () => (/* binding */ placeTimed),
/* harmony export */   rangeOf: () => (/* binding */ rangeOf),
/* harmony export */   readValue: () => (/* binding */ readValue),
/* harmony export */   refusalWord: () => (/* binding */ refusalWord),
/* harmony export */   stepPeriod: () => (/* binding */ stepPeriod),
/* harmony export */   toneOf: () => (/* binding */ toneOf),
/* harmony export */   validZone: () => (/* binding */ validZone),
/* harmony export */   wallIn: () => (/* binding */ wallIn),
/* harmony export */   weekStartFor: () => (/* binding */ weekStartFor),
/* harmony export */   weekStartOf: () => (/* binding */ weekStartOf),
/* harmony export */   weekday: () => (/* binding */ weekday),
/* harmony export */   weekendFor: () => (/* binding */ weekendFor),
/* harmony export */   writeValue: () => (/* binding */ writeValue)
/* harmony export */ });
// The calendar's reading of its options, of dates in a time zone and of the
// host's rules, kept apart from the element so a unit can hold it without a
// page (owner decision C307; study ui-control control/research/2026-11-18-calendar-view,
// section 5; options under layouts.calendar of the draft simai.view-config/1).
//
// Nothing here draws or asks the host. Dates are plain ISO strings
// (yyyy-mm-dd) and minutes of the day; the arithmetic runs in UTC so no zone
// moves a day. A record's value is read in the request's time zone (C293):
// a value with an offset (Z, +03:00) is an instant shown in that zone; a value
// without one is the wall clock of the source's zone (describe().fields.<f>.timeZone),
// else of the request's zone. A move is written back in the value's own form.
const MODES = Object.freeze(["month", "week", "day", "list"]);
const PER_DAY = 3;
const SLOT = 30;
const HOURS = Object.freeze([8 * 60, 20 * 60]);
const EVENT_FIELDS_MAX = 3;
const RECORDS_MAX = 1000;
const MONTH_DAYS = 42;
const PHONE_DAYS = 3; // layouts.calendar.span_days of view-config/1 (Larena backend, msg-75b451e2):
// how far back the host looks for an event that started before the days on
// screen, and the longest event it accepts; 31 by default, up to 366.

const SPAN_DAYS = 31;
const SPAN_DAYS_MAX = 366; // The move rules of view-config/1 (layouts.calendar.rules): past, weekdays
// {days: ISO 1..7 a start may fall on}, locked {field, in}, ability {ability}.

const RULE_CODES = Object.freeze(["past", "weekdays", "locked", "ability"]); // The host's refusal codes of a move (storage_calendar_update_*) and the
// language pack's word for each, said when the host gives no reason of its own.

const REFUSAL_WORDS = Object.freeze({
  past: "refuse-past",
  weekday: "refuse-weekday",
  weekdays: "refuse-weekday",
  locked: "refuse-locked",
  denied: "refuse-denied",
  ability: "refuse-denied",
  end_before_start: "refuse-end-before-start",
  too_long: "refuse-too-long",
  patch_invalid: "refuse-patch-invalid"
});
/** The pack word for a refusal code (a rule's code or storage_calendar_update_<code>), else null. */

function refusalWord(code) {
  const name = String(code ?? "").trim().replace(/^storage_calendar_update_/u, "").replace(/-/gu, "_");
  return Object.hasOwn(REFUSAL_WORDS, name) ? REFUSAL_WORDS[name] : null;
}
const DATE_TYPES = new Set(["date", "datetime"]);
const COLOUR_TYPES = new Set(["status", "choice", "select", "enum"]);
const ROLES = new Set(["primary", "secondary", "tertiary", "info", "success", "warning", "error", "neutral"]);
const DAY_MS = 864e5;

const typeOf = field => String(field?.propertyType ?? field?.property_type ?? field?.type ?? "");

const text = value => value && typeof value === "object" ? String(value.label ?? value.title ?? value.value ?? "") : String(value ?? "");

const pad = number => String(number).padStart(2, "0"); // ── options ──────────────────────────────────────────────────────────────

/** "08:00" -> 480; a number of minutes stays; anything else is null. */


function minutesOf(value) {
  if (Number.isFinite(value)) return Math.max(0, Math.min(24 * 60, Math.round(value)));
  const found = /^(\d{1,2}):(\d{2})$/u.exec(String(value ?? "").trim());
  if (!found) return null;
  const minutes = Number(found[1]) * 60 + Number(found[2]);
  return minutes >= 0 && minutes <= 24 * 60 ? minutes : null;
}
/** 480 -> "08:00". */

function clockOf(minutes) {
  const whole = Math.max(0, Math.round(minutes));
  return `${pad(Math.floor(whole / 60) % 25)}:${pad(whole % 60)}`;
}
/**
 * layouts.calendar of view-config/1 with its defaults (study 5, the options
 * table). No week start and no time zone: they come from the request (C293).
 */

function calendarOptions(options = {}, fields = []) {
  const given = options && typeof options === "object" ? options : {};
  const list = Array.isArray(fields) ? fields : [];

  const keyOf = field => field ? String(field.key) : null;

  const dateField = given.date_field ? String(given.date_field) : keyOf(list.find(field => DATE_TYPES.has(typeOf(field))));
  const endField = given.end_field ? String(given.end_field) : null;
  const allDayField = given.all_day_field ? String(given.all_day_field) : null;
  const modes = Array.isArray(given.modes) && given.modes.some(mode => MODES.includes(mode)) ? MODES.filter(mode => given.modes.includes(mode)) : [...MODES];
  const mode = modes.includes(given.mode) ? given.mode : modes.includes("month") ? "month" : modes[0];
  const colorField = given.color_field !== undefined ? given.color_field ? String(given.color_field) : null : keyOf(list.find(field => typeOf(field) === "status") ?? list.find(field => COLOUR_TYPES.has(typeOf(field)) && Array.isArray(field.options)));
  const skip = new Set([dateField, endField, allDayField, "title"].filter(Boolean));
  const shown = list.filter(field => !skip.has(String(field.key)) && !field.title && field.visible !== false && field.key !== colorField);
  const eventFields = (Array.isArray(given.event_fields) ? given.event_fields.map(String) : shown.map(field => String(field.key))).filter(key => !skip.has(key)).slice(0, EVENT_FIELDS_MAX);
  const perDay = Number.isSafeInteger(given.per_day) && given.per_day > 0 ? given.per_day : PER_DAY;
  const from = minutesOf(Array.isArray(given.hours) ? given.hours[0] : null);
  const to = minutesOf(Array.isArray(given.hours) ? given.hours[1] : null);
  const hours = from !== null && to !== null && from < to ? [from, to] : [...HOURS];
  const slot = Number.isSafeInteger(given.slot) && given.slot >= 5 && given.slot <= 120 ? given.slot : SLOT;
  const spanDays = Number.isSafeInteger(given.span_days) && given.span_days > 0 ? Math.min(given.span_days, SPAN_DAYS_MAX) : SPAN_DAYS;
  const rules = Array.isArray(given.rules) ? given.rules.filter(rule => rule && typeof rule === "object" && typeof rule.code === "string") : [];
  return {
    dateField,
    endField,
    allDayField,
    mode,
    modes,
    colorField,
    eventFields,
    perDay,
    hours,
    slot,
    spanDays,
    rules,
    weekends: given.weekends === "hide" ? "hide" : "show",
    undated: ["button", "panel", "none"].includes(given.undated) ? given.undated : "button"
  };
} // ── days ─────────────────────────────────────────────────────────────────

const dayDate = iso => new Date(`${String(iso).slice(0, 10)}T00:00:00Z`);

const isoDay = date => date.toISOString().slice(0, 10);
function addDays(iso, count) {
  const date = dayDate(iso);
  date.setUTCDate(date.getUTCDate() + count);
  return isoDay(date);
}
const weekday = iso => dayDate(iso).getUTCDay();
const daysBetween = (from, to) => Math.round((dayDate(to) - dayDate(from)) / DAY_MS);
const weekStartOf = (iso, start) => addDays(iso, -((weekday(iso) - start + 7) % 7));
const monthStart = iso => `${String(iso).slice(0, 7)}-01`;
function addMonths(iso, count) {
  const date = dayDate(monthStart(iso));
  date.setUTCMonth(date.getUTCMonth() + count);
  const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  return `${isoDay(date).slice(0, 8)}${pad(Math.min(Number(String(iso).slice(8, 10)) || 1, last))}`;
}
/** The week's first day for a language (Intl week info; ru Monday, en-US Sunday, ar-EG Saturday). 0 Sunday .. 6 Saturday. */

function weekStartFor(locale) {
  try {
    const info = new Intl.Locale(locale || "en");
    const week = typeof info.getWeekInfo === "function" ? info.getWeekInfo() : info.weekInfo;
    if (week && Number.isInteger(week.firstDay)) return week.firstDay % 7;
  } catch {
    /* an unknown locale reads as the default */
  }

  const language = String(locale || "").toLowerCase();
  if (/^(en-us|en-ca|ja|ko|zh-tw|he|pt-br)/u.test(language)) return 0;
  if (/^(ar|fa)/u.test(language)) return 6;
  return 1;
}
/** The days off of a language, as days of the week 0..6 (Intl week info; Saturday and Sunday where it says nothing). */

function weekendFor(locale) {
  try {
    const info = new Intl.Locale(locale || "en");
    const week = typeof info.getWeekInfo === "function" ? info.getWeekInfo() : info.weekInfo;
    if (week && Array.isArray(week.weekend) && week.weekend.length) return week.weekend.map(day => day % 7);
  } catch {
    /* the default below */
  }

  return [6, 0];
}
/**
 * The days a mode shows around a day: month = six weeks from the week start
 * of the 1st, week = seven days (three on a phone), day = one, list = the
 * month. `to` is the day after the last (the window's right edge is excluded).
 * With weekends hidden the week and month draw only the working days; the
 * window stays whole.
 */

function rangeOf(mode, anchor, {
  weekStart = 1,
  phone = false,
  weekends = "show",
  weekend = [6, 0]
} = {}) {
  let from = anchor;
  let count = 1;

  if (mode === "month") {
    from = weekStartOf(monthStart(anchor), weekStart);
    count = MONTH_DAYS;
  } else if (mode === "week") {
    from = phone ? anchor : weekStartOf(anchor, weekStart);
    count = phone ? PHONE_DAYS : 7;
  } else if (mode === "list") {
    from = monthStart(anchor);
    count = daysBetween(from, addMonths(from, 1));
  }

  const days = Array.from({
    length: count
  }, (_, index) => addDays(from, index));
  const drawn = weekends === "hide" && (mode === "month" || mode === "week" && !phone) ? days.filter(day => !weekend.includes(weekday(day))) : days;
  return {
    from,
    to: addDays(from, count),
    days: drawn,
    all: days
  };
}
/** The next or previous period: a month for month and list, a week (three days on a phone) or a day. */

function stepPeriod(mode, anchor, direction, {
  phone = false
} = {}) {
  if (mode === "month" || mode === "list") return addMonths(anchor, direction);
  if (mode === "week") return addDays(anchor, direction * (phone ? PHONE_DAYS : 7));
  return addDays(anchor, direction);
} // ── time zones ───────────────────────────────────────────────────────────

const formatters = new Map();

function partsIn(epoch, zone) {
  let format = formatters.get(zone);

  if (!format) {
    format = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
    formatters.set(zone, format);
  }

  const parts = Object.fromEntries(format.formatToParts(new Date(epoch)).map(part => [part.type, part.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) % 24 * 60 + Number(parts.minute)
  };
}
/** Whether a time zone name is one this browser knows. */


function validZone(zone) {
  if (!zone) return false;

  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone: String(zone)
    });
    return true;
  } catch {
    return false;
  }
}
/** The person's zone (the browser's), the default of the request's (C293). */

function personZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function wallAsUtc(date, minutes) {
  return Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10)), Math.floor(minutes / 60), minutes % 60);
}
/** The instant of a wall clock in a zone (the later one in a gap, the earlier one when it repeats). */


function instantOf(date, minutes, zone) {
  const guess = wallAsUtc(date, minutes);
  if (!validZone(zone)) return guess;

  const offset = epoch => {
    const wall = partsIn(epoch, zone);
    return wallAsUtc(wall.date, wall.minutes) - epoch;
  };

  let epoch = guess - offset(guess);
  epoch = guess - offset(epoch);
  return epoch;
}
/** An instant as the wall clock of a zone: {date, minutes}. */

function wallIn(epoch, zone) {
  if (!validZone(zone)) {
    const date = new Date(epoch);
    return {
      date: isoDay(date),
      minutes: date.getUTCHours() * 60 + date.getUTCMinutes()
    };
  }

  return partsIn(epoch, zone);
}
const VALUE = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/u;
/**
 * A stored value read in the request's zone: {date, minutes, form}. minutes
 * is null for a day without a time. form remembers how the value was written
 * (offset, seconds) so a move writes it back the same way.
 */

function readValue(value, {
  zone,
  sourceZone
} = {}) {
  if (value === null || value === undefined || value === "") return null;
  const found = VALUE.exec(String(value).trim());
  if (!found) return null;
  const [, date, hour, minute, second, offset] = found;
  if (hour === undefined) return {
    date,
    minutes: null,
    form: {
      kind: "date"
    }
  };
  const wall = Number(hour) * 60 + Number(minute);
  const form = {
    kind: "datetime",
    seconds: second !== undefined,
    offset: offset ?? null
  };

  if (offset) {
    const sign = offset === "Z" ? 0 : offset[0] === "-" ? -1 : 1;
    const digits = offset.replace(/[^\d]/gu, "");
    const shift = offset === "Z" ? 0 : sign * (Number(digits.slice(0, 2)) * 60 + Number(digits.slice(2, 4)));
    const epoch = wallAsUtc(date, wall) - shift * 6e4;
    return { ...wallIn(epoch, zone),
      form
    };
  }

  const source = validZone(sourceZone) ? sourceZone : zone;
  if (!validZone(zone) || source === zone) return {
    date,
    minutes: wall,
    form
  };
  return { ...wallIn(instantOf(date, wall, source), zone),
    form,
    source: {
      date,
      minutes: wall,
      zone: source
    }
  };
}
/**
 * A wall clock of the request's zone written in the form a value had: a day
 * (yyyy-mm-dd), a source wall clock (yyyy-mm-ddThh:mm[:ss]) or an instant
 * with the same offset (Z or ±hh:mm).
 */

function writeValue(date, minutes, form = {
  kind: "date"
}, {
  zone,
  sourceZone
} = {}) {
  if (date === null || date === undefined) return null;
  if (form.kind === "date" || minutes === null || minutes === undefined) return date;
  const seconds = form.seconds ? ":00" : "";
  const epoch = instantOf(date, minutes, zone);

  if (form.offset === "Z") {
    const at = new Date(epoch);
    return `${isoDay(at)}T${pad(at.getUTCHours())}:${pad(at.getUTCMinutes())}${seconds}Z`;
  }

  if (form.offset) {
    const digits = form.offset.replace(/[^\d]/gu, "");
    const shift = (form.offset[0] === "-" ? -1 : 1) * (Number(digits.slice(0, 2)) * 60 + Number(digits.slice(2, 4)));
    const at = new Date(epoch + shift * 6e4);
    return `${isoDay(at)}T${pad(at.getUTCHours())}:${pad(at.getUTCMinutes())}${seconds}${form.offset}`;
  }

  const source = validZone(sourceZone) ? sourceZone : zone;
  const wall = source === zone || !validZone(zone) ? {
    date,
    minutes
  } : wallIn(epoch, source);
  return `${wall.date}T${clockOf(wall.minutes)}${seconds}`;
} // ── events ───────────────────────────────────────────────────────────────

/** The colour of a choice option (C140): its status or scheme as a colour role, neutral else. */

function toneOf(option) {
  const role = String(option?.status ?? option?.scheme ?? "neutral");
  return ROLES.has(role) ? role : role === "danger" ? "error" : "neutral";
}
/**
 * The records as events of the calendar: {id, record, title, allDay, start,
 * end (both {date, minutes}), first, last (days, last included), tone,
 * label (the colour option's label), form, endForm}. A record without a start
 * is undated and not here. A timed event without an end lasts two slots; one
 * that ends on a later day is drawn as a bar.
 */

function eventsOf(records, {
  options,
  fields = [],
  zone,
  titleField = "title"
} = {}) {
  const field = key => fields.find(entry => String(entry.key) === String(key)) ?? null;

  const date = field(options.dateField);
  const colour = field(options.colorField);
  const sourceZone = date?.timeZone ?? date?.time_zone ?? null;
  const dateOnly = typeOf(date) === "date";
  const events = [];

  for (const record of Array.isArray(records) ? records : []) {
    const start = readValue(record?.[options.dateField], {
      zone,
      sourceZone
    });
    if (!start) continue;
    const read = options.endField ? readValue(record?.[options.endField], {
      zone,
      sourceZone
    }) : null;
    const allDay = options.allDayField ? Boolean(record?.[options.allDayField]) : dateOnly || start.minutes === null;
    let end = read && (read.date > start.date || read.date === start.date && (read.minutes ?? 0) >= (start.minutes ?? 0)) ? read : null;

    if (!allDay && !end) {
      const minutes = (start.minutes ?? options.hours[0]) + options.slot * 2;
      end = {
        date: start.date,
        minutes: Math.min(24 * 60, minutes)
      };
    }

    const startDay = start.date;
    const endDay = end ? !allDay && end.minutes === 0 && end.date > startDay ? addDays(end.date, -1) : end.date : startDay;
    const value = record?.[options.colorField];
    const option = (Array.isArray(colour?.options) ? colour.options : []).find(entry => String(entry.value ?? entry.id) === String(value?.value ?? value));
    const title = record?.[titleField] ?? record?.title ?? record?.name ?? record?.id;
    events.push({
      id: String(record.id),
      record,
      title: text(title),
      allDay,
      bar: allDay || endDay > startDay,
      start: {
        date: start.date,
        minutes: allDay ? null : start.minutes
      },
      end: end ? {
        date: end.date,
        minutes: allDay ? null : end.minutes
      } : {
        date: startDay,
        minutes: null
      },
      first: startDay,
      last: endDay,
      tone: option ? toneOf(option) : "primary",
      label: option ? String(option.label ?? option.value) : value === undefined || value === null ? "" : text(value),
      form: start.form,
      endForm: read?.form ?? start.form,
      source: start.source ?? null
    });
  } // Inside a day: the bars first, then by start time, then by title (study 5: no sort).


  events.sort((a, b) => (a.bar === b.bar ? 0 : a.bar ? -1 : 1) || (a.first < b.first ? -1 : a.first > b.first ? 1 : 0) || (a.start.minutes ?? -1) - (b.start.minutes ?? -1) || a.title.localeCompare(b.title));
  return events;
}
const onDay = (event, day) => event.first <= day && event.last >= day;
/** The bars of a row of days: lanes, each a list of bars that do not meet. */

function barLanes(events, days) {
  const first = days[0];
  const last = days[days.length - 1];
  const lanes = [];

  for (const bar of events.filter(event => event.bar && event.first <= last && event.last >= first)) {
    let index = 0;

    while (lanes[index]?.some(other => !(other.last < bar.first || other.first > bar.last))) index += 1;

    (lanes[index] ??= []).push(bar);
  }

  return lanes;
}
/** Timed events of one day placed in columns where they meet: {event, column, columns, top, length} in minutes. */

function placeTimed(events, day) {
  const list = events.filter(event => !event.bar && event.first === day);

  const start = event => event.start.minutes ?? 0;

  const end = event => event.end.date > day ? 24 * 60 : event.end.minutes ?? start(event) + SLOT;

  const columns = [];
  const placed = list.map(event => {
    let column = 0;

    while (columns[column]?.some(other => end(other) > start(event) && start(other) < end(event))) column += 1;

    (columns[column] ??= []).push(event);
    return {
      event,
      column
    };
  });
  return placed.map(entry => {
    const meeting = placed.filter(other => end(other.event) > start(entry.event) && start(other.event) < end(entry.event));
    return { ...entry,
      columns: Math.max(...meeting.map(other => other.column)) + 1,
      top: start(entry.event),
      length: Math.max(1, end(entry.event) - start(entry.event))
    };
  });
} // ── rules ────────────────────────────────────────────────────────────────

/**
 * Whether a record may go to a day by the host's rules and its right
 * (records[].can.update + code + reason, CL-7).
 * The rules of view-config/1 (layouts.calendar.rules, the Larena host):
 * past (no start before today), weekdays {days: the ISO days 1..7 a start may
 * fall on}, locked {field, in: values} (a record whose field holds one of them
 * does not move), ability {ability} (the host answers it per record in can).
 * Also read: sunday .. saturday (that day refused), min {date}, max {date},
 * dates {dates: [...]}. A code the calendar does not know is the server's to
 * check on save. A refusal carries its code; a rule without a reason is said
 * with the pack's word for the code (refusalWord).
 */

function moveCheck({
  record,
  day,
  rules = [],
  today,
  noRight = ""
} = {}) {
  const can = record?.can ?? record?._can;
  if (can && can.update === false) return {
    ok: false,
    reason: String(can.reason ?? can.update_reason ?? noRight ?? ""),
    code: String(can.code ?? "denied")
  };
  const list = Array.isArray(rules) ? rules : [];

  for (const rule of list) {
    if (rule?.code !== "locked" || !record || !rule.field || !Array.isArray(rule.in)) continue;

    if (rule.in.some(value => value === record[rule.field] || typeof value !== "boolean" && String(value) === String(record[rule.field] ?? ""))) {
      return {
        ok: false,
        reason: String(rule.reason ?? ""),
        code: "locked"
      };
    }
  }

  if (day === null || day === undefined) return {
    ok: true
  };
  const names = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  for (const rule of list) {
    if (!rule || typeof rule !== "object") continue;
    const code = String(rule.code ?? "");
    const reason = String(rule.reason ?? "");
    if (code === "past" && today && day < today) return {
      ok: false,
      reason,
      code
    };
    if (names.includes(code) && weekday(day) === names.indexOf(code)) return {
      ok: false,
      reason,
      code
    }; // ISO days: 1 Monday .. 7 Sunday; the days a start may fall on.

    if ((code === "weekdays" || code === "weekday") && Array.isArray(rule.days) && rule.days.length && !rule.days.map(value => Number(value)).includes(weekday(day) || 7)) return {
      ok: false,
      reason,
      code: "weekday"
    };
    if (code === "min" && rule.date && day < String(rule.date).slice(0, 10)) return {
      ok: false,
      reason,
      code
    };
    if (code === "max" && rule.date && day > String(rule.date).slice(0, 10)) return {
      ok: false,
      reason,
      code
    };
    if (code === "dates" && Array.isArray(rule.dates) && rule.dates.map(value => String(value).slice(0, 10)).includes(day)) return {
      ok: false,
      reason,
      code
    };
  }

  return {
    ok: true
  };
}
/**
 * The patch of a move: the event's start to a day (and a time), its length
 * kept; to null, both fields cleared (the record goes to «Без даты»).
 */

function movePatch(event, {
  day,
  minutes = null,
  endMinutes = null,
  options,
  zone,
  sourceZone = null,
  record = null
}) {
  const patch = {};
  const key = options.dateField;

  if (day === null) {
    patch[key] = null;
    if (options.endField) patch[options.endField] = null;
    return patch;
  }

  if (!event) {
    // An undated record set on a day: all day for a date field, else at
    // the time dropped on (or the first visible hour), two slots long.
    const timed = record?.__timed !== false && minutes !== null;
    const start = timed ? minutes : null;
    patch[key] = timed ? writeValue(day, start, {
      kind: "datetime"
    }, {
      zone,
      sourceZone
    }) : day;
    if (options.endField) patch[options.endField] = timed ? writeValue(day, Math.min(24 * 60, start + options.slot * 2), {
      kind: "datetime"
    }, {
      zone,
      sourceZone
    }) : day;
    return patch;
  }

  const shift = daysBetween(event.first, day);

  if (event.allDay) {
    patch[key] = writeValue(day, null, event.form, {
      zone,
      sourceZone
    });
    if (options.endField) patch[options.endField] = writeValue(addDays(event.last, shift), null, event.endForm, {
      zone,
      sourceZone
    });
    return patch;
  }

  const startMinutes = minutes ?? event.start.minutes ?? options.hours[0];
  const length = daysBetween(event.start.date, event.end.date) * 24 * 60 + (event.end.minutes ?? 0) - (event.start.minutes ?? 0);
  patch[key] = writeValue(day, startMinutes, event.form, {
    zone,
    sourceZone
  });

  if (options.endField) {
    const total = endMinutes ?? startMinutes + Math.max(options.slot, length);
    patch[options.endField] = writeValue(addDays(day, Math.floor(total / (24 * 60))), total % (24 * 60), event.endForm, {
      zone,
      sourceZone
    });
  }

  return patch;
}

/***/ },

/***/ "6ec906cf41a4"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderViewCalendarTemplate: () => (/* binding */ renderViewCalendarTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("1d622c15767e");
/* harmony import */ var _calendar_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("89419bfa3ad1");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);


 // The calendar (owner decision C307; study ui-control control/research/2026-11-18-calendar-view):
// its own bar (‹ ›, the period, «Сегодня», the modes on sf-segmented, «Без
// даты N»), then the month grid, the time grid of a week or a day, or the
// list; the «Без даты» column beside it. Month: six weeks, other months
// muted, today a number in a primary circle, days off in the error colour;
// all-day and multi-day events are bars in their option's colour (C140),
// timed ones a dot, the time and the title; past per_day a day says «+N».
// Week and day: the visible hours, the all-day row above, a «now» line,
// events that meet share the width, the lower edge stretches. Phone: the
// month with dots and the chosen day as a list under it (C307 (1)).

function renderShape(shape, owner) {
  if (shape === null || shape === undefined || shape === false) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  if (typeof shape === "string" || typeof shape === "number") return String(shape);
  if (Array.isArray(shape)) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-calendar__values">${shape.map(item => renderShape(item, owner))}</span>`;
  if (shape._$litType$ !== undefined) return shape;

  if (shape.component?.type) {
    const {
      component,
      props: own,
      ...meta
    } = shape;
    return owner.renderSmartElement(component.type, { ...meta,
      ...(own ?? {}),
      ...(component.props ?? {})
    });
  }

  if (shape.text !== undefined) return String(shape.text);
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

const tone = event => `--sf-view-calendar-tone: var(--sf-${event.tone}); --sf-view-calendar-tone-container: var(--sf-${event.tone}-container); --sf-view-calendar-on-tone: var(--sf-on-${event.tone}-container)`;

function eventAttributes(context, event) {
  return {
    pending: context.pending.has(event.id),
    open: context.current === event.id,
    readOnly: Boolean(context.component.readOnly(event.record))
  };
} // A timed event in a month day: dot, time, title.


function renderChip(context, event) {
  const component = context.component;
  const state = eventAttributes(context, event);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-view-calendar__ev" data-ev=${event.id} tabindex="-1" style=${tone(event)}
            ?data-pending=${state.pending} ?data-open=${state.open} ?data-ro=${state.readOnly}
            aria-label=${component.eventLabel(event)} title=${component.eventTip(event)}>
        <span class="sf-view-calendar__dot" aria-hidden="true"></span>
        <span class="sf-view-calendar__time">${component.time(event.start.minutes)}</span>
        <span class="sf-view-calendar__name">${event.title}</span>
    </button>`;
} // A piece of a bar in one day: the first piece of a week row carries the title.


function renderBar(context, event, day, days) {
  const component = context.component;
  const state = eventAttributes(context, event);
  const first = event.first === day || day === days[0];
  const last = event.last === day || day === days[days.length - 1];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-view-calendar__bar-piece" data-ev=${event.id} tabindex="-1" style=${tone(event)}
            ?data-first=${first} ?data-last=${last} aria-hidden=${first ? "false" : "true"}
            ?data-pending=${state.pending} ?data-open=${state.open} ?data-ro=${state.readOnly}
            aria-label=${component.eventLabel(event)} title=${component.eventTip(event)}>${first ? event.title : " "}</button>`;
}

function renderAdd(context, day, minutes = null) {
  if (!context.creatable) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const component = context.component;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-calendar__add"><sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="add"
            data-add=${day} data-time=${minutes === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : String(minutes)} tabindex="-1"
            aria-label=${component.word("add-text", {
    day: component.dayOn(day)
  })} tooltip=${component.word("add-short-text")}></sf-button-icon></span>`;
}

function dayFlags(context, day) {
  return {
    today: day === context.today,
    off: context.weekend.includes((0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.weekday)(day))
  };
} // ── month ────────────────────────────────────────────────────────────────


function renderMonth(context) {
  const component = context.component;
  const {
    days
  } = context.range;
  const width = days.length >= 35 ? days.length / 6 : 7;
  const weeks = Array.from({
    length: Math.ceil(days.length / width)
  }, (_, index) => days.slice(index * width, index * width + width));
  const month = component.anchor.slice(0, 7);
  const compact = context.phone; // CL-6: where the pair's sf-input-date carries day marks, the phone's
  // month is that panel (no field) with a mark per event day.

  if (compact && context.inputDateMarks) {
    const marks = day => {
      const list = context.events.filter(event => (0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.onDay)(event, day));
      return list.length ? {
        count: list.length,
        tone: list[0].tone,
        label: component.eventsCount(list.length)
      } : null;
    };

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__month-wrap">
            <sf-input-date class="sf-view-calendar__phone-month" input="false" size=${context.size} date=${context.picked}
                           week-start=${String(component.weekStart)} locale=${component.locale} .dayMarks=${marks}></sf-input-date>
            ${renderPhoneList(context)}
        </div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-calendar__month-wrap" style=${`--sf-view-calendar-columns: ${width}`}>
            <div class="sf-view-calendar__weekdays" aria-hidden="true">
                ${weeks[0].map(day => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${component.cap(component.format(day, {
    weekday: "short"
  }))}</span>`)}
            </div>
            <div class="sf-view-calendar__month" role="grid" ?data-compact=${compact}
                 aria-label=${`${context.label}, ${component.monthTitle(component.anchor).toLocaleLowerCase(component.locale)}`}>
                ${weeks.map(week => {
    const lanes = (0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.barLanes)(context.events, week);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__week" role="row">
                        ${week.map(day => renderMonthDay(context, day, week, lanes, month, compact))}
                    </div>`;
  })}
            </div>
            ${compact ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderPhoneList(context)}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>`;
}

function renderMonthDay(context, day, week, lanes, month, compact) {
  const component = context.component;
  const list = context.events.filter(event => (0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.onDay)(event, day));
  const flags = dayFlags(context, day);
  const out = day.slice(0, 7) !== month;

  const cell = content => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__day" role="gridcell" data-day=${day} data-drop
            tabindex=${day === context.focus ? "0" : "-1"} ?data-out=${out} ?data-today=${flags.today} ?data-off=${flags.off}
            ?data-picked=${compact && day === context.picked} aria-selected=${compact && day === context.picked ? "true" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            aria-label=${component.dayLabel(day, list.length)}>${content}</div>`;

  const number = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-calendar__n" aria-hidden="true">${Number(day.slice(8))}</span>`;

  if (compact) {
    return cell((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__nrow">${number}</div>
            <div class="sf-view-calendar__dots" aria-hidden="true">${list.slice(0, 3).map(event => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span style=${tone(event)}></span>`)}</div>`);
  }

  const perDay = context.options.perDay;
  const pieces = [];
  let used = 0;

  for (const lane of lanes) {
    if (used >= perDay) break;
    const bar = lane.find(event => (0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.onDay)(event, day));
    pieces.push(bar ? renderBar(context, bar, day, week) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__gap" aria-hidden="true"></div>`);
    used += 1;
  }

  const hiddenBars = lanes.slice(used).filter(lane => lane.some(event => (0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.onDay)(event, day))).length;
  const timed = list.filter(event => !event.bar);
  const room = Math.max(0, perDay - used);
  const overflow = timed.length + hiddenBars > room;
  const shown = overflow ? timed.slice(0, Math.max(0, room - 1)) : timed;
  const rest = timed.length - shown.length + hiddenBars;
  return cell((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-calendar__nrow">${number}${renderAdd(context, day)}</div>
        ${pieces}
        ${shown.map(event => renderChip(context, event))}
        ${rest > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-view-calendar__more" data-more=${day} tabindex="-1"
                aria-label=${component.word("more-label", {
    count: rest,
    day: component.dayName(day)
  })}>${component.word("more-text", {
    count: rest
  })}</button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`);
} // ── week and day ─────────────────────────────────────────────────────────


function renderTime(context) {
  const component = context.component;
  const {
    days
  } = context.range;
  const [from, to] = context.options.hours;
  const hours = [];

  for (let minutes = from; minutes < to; minutes += 60) hours.push(minutes);

  const lanes = (0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.barLanes)(context.events, days);
  const style = `--sf-view-calendar-days: ${days.length}; --sf-view-calendar-hours: ${hours.length}`;
  const now = context.now;
  const label = days.length > 1 ? `${component.dayName(days[0])} – ${component.dayName(days[days.length - 1])}` : component.dayName(days[0]);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-calendar__time-wrap" style=${style}>
            <div class="sf-view-calendar__tg sf-view-calendar__tg-head">
                <div class="sf-view-calendar__gut" aria-hidden="true"></div>
                ${days.map(day => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__tgh" ?data-today=${day === context.today} ?data-off=${dayFlags(context, day).off}>
                    <span aria-hidden="true">${component.cap(component.format(day, {
    weekday: "short"
  }))}</span><b aria-hidden="true">${Number(day.slice(8))}</b>
                    ${renderAdd(context, day)}
                </div>`)}
            </div>
            <div class="sf-view-calendar__tg sf-view-calendar__allday">
                <div class="sf-view-calendar__gut">${component.word("all-day-text")}</div>
                ${days.map(day => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__ad">
                    ${lanes.map(lane => {
    const bar = lane.find(event => (0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.onDay)(event, day));
    return bar ? renderBar(context, bar, day, days) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__gap" aria-hidden="true"></div>`;
  })}
                </div>`)}
            </div>
            <div class="sf-view-calendar__scroll">
                <div class="sf-view-calendar__hours" role="grid" aria-label=${`${context.label}, ${label}`}>
                    <div class="sf-view-calendar__gutter" aria-hidden="true">
                        ${hours.map(minutes => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__hour">${minutes === from ? "" : component.time(minutes)}</div>`)}
                    </div>
                    <div class="sf-view-calendar__cols" role="row">
                        ${days.map(day => renderColumn(context, day, from, to, now))}
                    </div>
                </div>
            </div>
            ${context.events.some(event => days.includes(event.first) || days.some(day => (0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.onDay)(event, day))) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__empty">${component.word("empty-text")}</div>`}
        </div>`;
}

function renderColumn(context, day, from, to, now) {
  const component = context.component;
  const placed = (0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.placeTimed)(context.events, day);
  const span = to - from;

  const position = minutes => `calc(${Math.max(0, minutes - from) / 60} * var(--sf-view-calendar-hour))`;

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__col" role="gridcell" data-day=${day} data-drop tabindex=${day === context.focus ? "0" : "-1"}
            ?data-today=${day === context.today} aria-label=${component.dayLabel(day, placed.length)}>
        ${day === now.date && now.minutes >= from && now.minutes < to ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__now" aria-hidden="true" style=${`inset-block-start: ${position(now.minutes)}`}></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${placed.filter(({
    event
  }) => (event.start.minutes ?? 0) < to).map(({
    event,
    column,
    columns,
    top,
    length
  }) => {
    const state = eventAttributes(context, event);
    const start = Math.max(from, top);
    const end = Math.min(to, top + length);
    const tall = end - start >= 60;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-view-calendar__block" data-ev=${event.id} tabindex="-1" style=${`${tone(event)}; inset-block-start: ${position(start)}; block-size: calc(${Math.max(context.options.slot, end - start) / 60} * var(--sf-view-calendar-hour)); inset-inline-start: calc(${column / columns * 100}% + var(--sf-space-1\\/4)); inline-size: calc(${100 / columns}% - 2 * var(--sf-space-1\\/4))`}
                    ?data-pending=${state.pending} ?data-open=${state.open} ?data-ro=${state.readOnly}
                    aria-label=${component.eventLabel(event)} title=${component.eventTip(event)}>
                <span class="sf-view-calendar__name">${event.title}</span>
                ${tall ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-calendar__time">${component.timeOf(event)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${state.readOnly || !context.movable || !context.options.endField ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-calendar__rs" data-rs=${event.id} aria-hidden="true"></span>`}
            </button>`;
  })}
        ${span <= 0 ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>`;
} // ── list ─────────────────────────────────────────────────────────────────


function renderRow(context, event) {
  const component = context.component;
  const state = eventAttributes(context, event);
  const selected = context.selected.has(event.id);
  const boxed = context.selectable && context.mode === "list";
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__row" data-id=${event.id} data-ev=${event.id} tabindex="-1" role="listitem" style=${tone(event)}
            ?data-pending=${state.pending} ?data-open=${state.open} ?data-selected=${selected} ?data-boxed=${boxed}
            aria-label=${component.eventLabel(event)} title=${component.eventTip(event)}>
        ${boxed ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-calendar__box"><sf-checkbox size=${context.size} data-box=${event.id} ?checked=${selected} tabindex="-1"
                aria-label=${component.word("select-text", {
    title: event.title
  })}></sf-checkbox></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <span class="sf-view-calendar__time"><span class="sf-view-calendar__dot" aria-hidden="true"></span>${component.timeOf(event)}</span>
        <span class="sf-view-calendar__name">${event.title}</span>
        ${component.eventFieldList.map(field => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-calendar__field" data-key=${String(field.key)} data-align=${component.fieldAlign(field)}>${renderShape(component.cellShape(field, event.record), component)}</span>`)}
    </div>`;
}

function renderDayList(context, day, always = false) {
  const component = context.component;
  const list = context.events.filter(event => (0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.onDay)(event, day));
  if (!list.length && !always) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__lday" role="list" aria-label=${component.cap(component.dayName(day))}>
        <div class="sf-view-calendar__lday-h" ?data-today=${day === context.today} ?data-picked=${always}>
            <span>${component.cap(component.dayName(day))}${day === context.today ? ` · ${component.word("today-mark")}` : ""}</span>
            ${always ? renderAdd(context, day) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
        ${list.length ? list.map(event => renderRow(context, event)) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__note">${component.word("day-empty-text")}</div>`}
    </div>`;
}

function renderList(context) {
  const component = context.component;
  const days = context.range.days.filter(day => context.events.some(event => (0,_calendar_js__WEBPACK_IMPORTED_MODULE_2__.onDay)(event, day)));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__list" aria-label=${`${context.label}, ${component.monthTitle(component.anchor).toLocaleLowerCase(component.locale)}`}>
        ${days.length ? days.map(day => renderDayList(context, day)) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__empty">${component.word("empty-text")}</div>`}
    </div>`;
} // The phone's month: under the month «Без даты N», then the chosen day's
// list (its heading carries +) or, while «Без даты» is pressed, the records
// without a date; the event menu (a held row, Shift+F10) sets their date.


function renderPhoneList(context) {
  const component = context.component;
  const undatable = context.options.undated !== "none";
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        ${undatable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__phone-und">
            <sf-button size=${context.size} appearance="ghost" scheme="on-surface" icon="event_busy" data-undtoggle
                       text=${component.word("undated-text", {
    count: context.undatedTotal
  })} aria-pressed=${context.phoneUndated ? "true" : "false"}></sf-button>
        </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <div class="sf-view-calendar__list" data-picked-list>${context.phoneUndated ? renderUndatedList(context) : renderDayList(context, context.picked, true)}</div>`;
}

function renderUndatedList(context) {
  const component = context.component;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__lday" role="list" aria-label=${component.word("undated-label")} data-und-list>
        <div class="sf-view-calendar__lday-h" data-picked>
            <span>${component.word("undated-head-text", {
    count: context.undatedTotal
  })}</span>
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="close" data-undclose
                            aria-label=${component.word("undated-close-text")} tooltip=${component.word("close-text")}></sf-button-icon>
        </div>
        <div class="sf-view-calendar__note">${component.word(context.undated.length ? "undated-hint-phone" : "undated-empty-text")}</div>
        ${context.undated.map(record => {
    const id = String(record.id);
    const readOnly = component.readOnly(record);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__row" data-id=${id} data-ev=${id} tabindex="-1" role="listitem"
                    ?data-pending=${context.pending.has(id)} ?data-ro=${Boolean(readOnly)}
                    aria-label=${`${component.recordTitle(record)}, ${component.word("undated-label").toLocaleLowerCase(component.locale)}`}>
                <span class="sf-view-calendar__name">${component.recordTitle(record)}</span>
                ${component.eventFieldList.map(field => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-calendar__field" data-key=${String(field.key)} data-align=${component.fieldAlign(field)}>${renderShape(component.cellShape(field, record), component)}</span>`)}
            </div>`;
  })}
    </div>`;
} // ── undated, selection, the pick window ──────────────────────────────────


function renderUndated(context) {
  const component = context.component;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<aside class="sf-view-calendar__und" data-und aria-label=${component.word("undated-label")}>
        <div class="sf-view-calendar__und-h">
            <span>${component.word("undated-head-text", {
    count: context.undatedTotal
  })}</span>
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="close" data-undclose
                            aria-label=${component.word("undated-close-text")} tooltip=${component.word("close-text")}></sf-button-icon>
        </div>
        <div class="sf-view-calendar__note">${component.word(context.undated.length ? "undated-hint" : "undated-empty-text")}</div>
        ${context.undated.map(record => {
    const id = String(record.id);
    const readOnly = component.readOnly(record);
    const field = component.eventFieldList[0];
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-view-calendar__ev sf-view-calendar__und-ev" data-ev=${id}
                    ?data-pending=${context.pending.has(id)} ?data-ro=${Boolean(readOnly)}
                    aria-label=${`${component.recordTitle(record)}, ${component.word("undated-label").toLocaleLowerCase(component.locale)}`}>
                <span class="sf-view-calendar__name">${component.recordTitle(record)}</span>
                ${field && record[field.key] !== undefined && record[field.key] !== null ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-calendar__sub">${typeof record[field.key] === "object" ? record[field.key].label ?? "" : String(record[field.key])}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </button>`;
  })}
    </aside>`;
}

function renderBulk(context) {
  const component = context.component;
  const count = context.selected.size;

  if (context.bulkActions) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-bulk-actions class="sf-view-calendar__bulk-bar" size=${context.size} place="dock" count=${count}
                                     .actions=${context.actions}></sf-bulk-actions>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-calendar__bulk" role="region" aria-label=${component.word("bulk-label")}>
            <span class="sf-view-calendar__note">${component.word("selected-text", {
    count
  })}</span>
            ${context.actions.map(action => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button size=${context.size} appearance="outline" scheme="on-surface"
                    icon=${action.icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} text=${action.text} data-bulk=${action.id}></sf-button>`)}
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="close"
                            data-clear aria-label=${component.word("clear-selection-text")} tooltip=${component.word("clear-selection-text")}></sf-button-icon>
        </div>`;
}

function renderPick(context) {
  const component = context.component;
  const pick = context.pick;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__pick" role="dialog" aria-label=${component.word("pick-label", {
    title: pick.title
  })}
            style=${`inset-block-start: ${pick.top}px`}>
        <div class="sf-view-calendar__und-h">
            <span>${component.word("pick-label", {
    title: pick.title
  })}</span>
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="close" data-pickclose
                            aria-label=${component.word("close-text")} tooltip=${component.word("close-text")}></sf-button-icon>
        </div>
        <sf-input-date input="false" size=${context.size} date=${pick.day} week-start=${String(component.weekStart)}
                       min-date=${pick.minDate || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} locale=${component.locale}></sf-input-date>
    </div>`;
} // ── the bar and the whole ────────────────────────────────────────────────


function renderBar_(context) {
  const component = context.component;
  const modes = context.modes.map(mode => ({
    value: mode,
    label: component.word(`mode-${mode === "week" && context.phone ? "three" : mode}`)
  }));
  const undated = context.options.undated !== "none" && !context.phone;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__bar">
        <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="chevron_left" data-page="-1"
                        aria-label=${component.word("previous-text")} tooltip=${component.word("previous-text")}></sf-button-icon>
        <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="chevron_right" data-page="1"
                        aria-label=${component.word("next-text")} tooltip=${component.word("next-text")}></sf-button-icon>
        <span class="sf-view-calendar__title" aria-live="polite">${component.periodTitle}</span>
        <sf-button size=${context.size} appearance="outline" scheme="on-surface" text=${component.word("today-text")} data-gotoday></sf-button>
        ${modes.length > 1 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-segmented class="sf-view-calendar__modes" size=${context.size} aria-label=${component.word("modes-label")}
                items=${JSON.stringify(modes)} value=${context.mode}></sf-segmented>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${undated ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button size=${context.size} appearance="ghost" scheme="on-surface" icon="event_busy" data-undtoggle
                text=${component.word("undated-text", {
    count: context.undatedTotal
  })} aria-pressed=${context.undatedOpen ? "true" : "false"}></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    </div>`;
}

function renderViewCalendarTemplate(context) {
  const mode = context.mode;
  const body = mode === "month" ? renderMonth(context) : mode === "list" ? renderList(context) : renderTime(context);
  const selecting = context.selectable && mode === "list" && context.selected.size > 0;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-calendar" data-size=${context.size} data-mode=${mode} ?data-phone=${context.phone}
             ?data-dragging=${context.dragging} role="region" aria-label=${context.label}>
            ${renderBar_(context)}
            ${context.truncated ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-calendar__note" data-truncated>${context.component.word("truncated-text")}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <div class="sf-view-calendar__body">
                <div class="sf-view-calendar__main">${body}</div>
                ${context.undatedOpen ? renderUndated(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            ${selecting ? renderBulk(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.pick ? renderPick(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <div class="sf-view-calendar__live" role="status" aria-live="polite">${context.message}</div>
        </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "1d622c15767e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "06a40de06677"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/field-renderers", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/field-renderers", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "64dcad8f4d7f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.view-calendar","tag":"sf-view-calendar","version":"1.3.2","kind":"leaf","settings":{"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"title-field":{"type":"string","default":"title"},"mode":{"type":"enum","values":["month","week","day","list"],"optional":true},"date":{"type":"string","default":""},"time-zone":{"type":"string","default":""},"week-start":{"type":"number","optional":true,"integer":true,"min":0,"max":7},"locale":{"type":"string","default":""},"now":{"type":"string","default":""},"selectable":{"type":"boolean","default":true},"creatable":{"type":"boolean","default":false},"movable":{"type":"boolean","default":true},"truncated":{"type":"boolean","default":false},"undated-total":{"type":"number","optional":true,"integer":true,"min":0},"undated-open":{"type":"boolean","default":false},"records":{"type":"list","default":[]},"undated":{"type":"list","default":[]},"fields":{"type":"list","default":[],"of":{"key":"string","label":{"type":"string","optional":true},"propertyType":{"type":"string","optional":true},"timeZone":{"type":"string","optional":true},"options":{"type":"list","optional":true}}},"options":{"type":"object","default":{}},"rules":{"type":"list","default":[]},"actions":{"type":"list","default":[],"of":{"id":"id","text":"string","icon":{"type":"icon","optional":true}}},"selected":{"type":"list","default":[]},"current":{"type":"string","default":""}},"values":{},"events":{"move":{"carries":{"id":"id","patch":"object","from":"object","revision":{"type":"any","nullable":true},"how":"string"},"cancelable":true},"open":{"carries":{"id":"id"}},"create":{"carries":{"date":"string","time":{"type":"string","optional":true},"field":"string"},"own-verb":true},"range":{"carries":{"from":"string","to":"string","mode":"string","window":"object","context":"object"},"own-verb":true},"select":{"carries":{"ids":"list"}},"save":{"carries":{"mode":"string","undated_open":"boolean"}},"apply":{"carries":{"action":"id","ids":"list","scope":"string"},"own-verb":true}},"actions":{"settle-move":{"with":{"id":"id","result":"object"}},"set-mode":{"with":{"mode":"string"}},"go-to":{"with":{"day":"string"}},"focus-record":{"with":{"id":"id"}}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"host-states":{},"css-variables":{"--sf-view-calendar-gap":{"type":"length","state":"default"},"--sf-view-calendar-line":{"type":"color","state":"default"},"--sf-view-calendar-day-background":{"type":"color","state":"default"},"--sf-view-calendar-out-background":{"type":"color","state":"default"},"--sf-view-calendar-refused-opacity":{"type":"number","state":"default"},"--sf-view-calendar-hour":{"type":"length","state":"default"},"--sf-view-calendar-per-day":{"type":"number","state":"default"},"--sf-view-calendar-undated-width":{"type":"length","state":"default"}}}');

/***/ },

/***/ "1798b39db680"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Calendar","runtime":{"add-short-text":"Add","add-text":"New record on {day}","all-day-text":"all day","bulk-label":"Actions on the selected","calendar-label":"Calendar","clear-date-text":"Remove the date","clear-selection-text":"Clear the selection","close-text":"Close","dated-text":"{title} — dated: {when}","day-empty-text":"No records","day-list-text":"The day\'s records","drop-cancelled-text":"Move cancelled","earlier-text":"A day earlier","empty-text":"No records in this period","event-menu-text":"Actions: {title}","events-count":{"one":"{n} record","other":"{n} records"},"events-none":"no records","held-text":"{title}: drag it to a day","later-text":"A day later","mode-changed-text":"Mode: {mode}","mode-day":"Day","mode-list":"List","mode-month":"Month","mode-three":"3 days","mode-week":"Week","modes-label":"Calendar mode","more-label":"{count} more — {day}","more-text":"+{count}","move-selected-text":"Move to…","moved-text":"{title} — moved to {when}","next-text":"Later","no-right-text":"No right to change","not-moved-text":"{title} — not moved: {reason}","off-mark":"day off","open-text":"Open","pick-label":"Move «{title}» to a day","pick-text":"Move to…","previous-text":"Earlier","refuse-default":"Not here","refuse-denied":"No right to change it","refuse-end-before-start":"The end is before the start","refuse-locked":"The record is locked","refuse-past":"The date has passed","refuse-patch-invalid":"The date was not accepted","refuse-text":"Not allowed: {reason}","refuse-too-long":"The event is too long","refuse-weekday":"Not on this day of the week","resized-text":"{title} — until {time}","select-text":"Select {title}","selected-text":"{count} selected","source-time-text":"At the source: {time} ({zone})","to-today-text":"To today","today-mark":"today","today-said-text":"Today: {day}","today-text":"Today","truncated-text":"Not all are shown — narrow the filter","undated-close-text":"Close «No date»","undated-closed-text":"The «No date» column is closed","undated-empty-text":"No records without a date","undated-head-text":"No date · {count}","undated-hint":"Drag to a day to set its date","undated-hint-phone":"Hold a record (or press Shift+F10) and choose «Move to…» to set its date","undated-label":"No date","undated-list-closed-text":"The chosen day\'s records are shown","undated-list-opened-text":"Records without a date are shown","undated-moved-text":"{title} — date removed, the record is in «No date»","undated-opened-text":"The «No date» column is open","undated-text":"No date {count}"}}');

/***/ },

/***/ "e228b55ace87"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Календарь","runtime":{"add-short-text":"Добавить","add-text":"Новая запись на {day}","all-day-text":"весь день","bulk-label":"Действия с выбранными","calendar-label":"Календарь","clear-date-text":"Убрать дату","clear-selection-text":"Снять выбор","close-text":"Закрыть","dated-text":"{title} — дата назначена: {when}","day-empty-text":"Записей нет","day-list-text":"Записи дня","drop-cancelled-text":"Перенос отменён","earlier-text":"На день раньше","empty-text":"В этот период записей нет","event-menu-text":"Действия: {title}","events-count":{"one":"{n} запись","few":"{n} записи","many":"{n} записей","other":"{n} записи"},"events-none":"записей нет","held-text":"{title}: перетащите на день","later-text":"На день позже","mode-changed-text":"Режим: {mode}","mode-day":"День","mode-list":"Список","mode-month":"Месяц","mode-three":"3 дня","mode-week":"Неделя","modes-label":"Режим календаря","more-label":"Ещё {count} — {day}","more-text":"+{count}","move-selected-text":"Перенести на…","moved-text":"{title} — перенесено на {when}","next-text":"Позже","no-right-text":"Нет права менять","not-moved-text":"{title} — не перенесено: {reason}","off-mark":"выходной","open-text":"Открыть","pick-label":"Перенести «{title}» на день","pick-text":"Перенести на…","previous-text":"Раньше","refuse-default":"Сюда нельзя","refuse-denied":"Нет права менять","refuse-end-before-start":"Конец раньше начала","refuse-locked":"Запись закрыта для изменений","refuse-past":"Дата уже прошла","refuse-patch-invalid":"Дата не принята","refuse-text":"Нельзя: {reason}","refuse-too-long":"Событие слишком длинное","refuse-weekday":"В этот день недели нельзя","resized-text":"{title} — до {time}","select-text":"Выбрать {title}","selected-text":"Выбрано {count}","source-time-text":"В источнике: {time} ({zone})","to-today-text":"На сегодня","today-mark":"сегодня","today-said-text":"Сегодня: {day}","today-text":"Сегодня","truncated-text":"Показаны не все — сузьте фильтр","undated-close-text":"Закрыть «Без даты»","undated-closed-text":"Колонка «Без даты» закрыта","undated-empty-text":"Записей без даты нет","undated-head-text":"Без даты · {count}","undated-hint":"Перетащите на день, чтобы назначить дату","undated-hint-phone":"Удерживайте запись (или нажмите Shift+F10) и выберите «Перенести на…», чтобы назначить дату","undated-label":"Без даты","undated-list-closed-text":"Показаны записи выбранного дня","undated-list-opened-text":"Показаны записи без даты","undated-moved-text":"{title} — дата убрана, запись в «Без даты»","undated-opened-text":"Открыта колонка «Без даты»","undated-text":"Без даты {count}"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("5c731e87b67d");
/******/
/******/ })()
;