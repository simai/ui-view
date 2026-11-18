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
import SfBaseElement from "../../core/js/smart-base";
import {applied, elementFromManifest, refused} from "../../core/js/element-manifest";
import {renderCellField} from "../field-renderers/index.js";
import {renderViewCalendarTemplate} from "./js/templates/default.js";
import {
    MODES, RECORDS_MAX, addDays, addMonths, calendarOptions, clockOf, eventsOf, moveCheck, movePatch, refusalWord,
    onDay, personZone, rangeOf, readValue, stepPeriod, validZone, wallIn, weekStartFor, weekendFor, weekday,
} from "./js/calendar.js";
import manifest from "./component.json";
import en from "./lang/en.json";
import ru from "./lang/ru.json";

const CalendarElement = elementFromManifest(manifest, {
    base: SfBaseElement,
    lang: {en, ru},
    source: "ru",
});

const PHONE_BELOW = 600;
const DRAG_START = 4;
const TOUCH_HOLD = 350;
const HOUR_ROW = 48;
let calendars = 0;

const copy = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
const own = (element, name) => Object.prototype.hasOwnProperty.call(element, name);
const esc = (value) => (globalThis.CSS?.escape ? globalThis.CSS.escape(String(value)) : String(value).replace(/["\\]/gu, "\\$&"));
const isoDate = (value) => (/^\d{4}-\d{2}-\d{2}$/u.test(String(value ?? "")) ? String(value) : null);

// Whether the pair carries sf-bulk-actions (C295): defined, or a rule the Loader can fetch.
function bulkActionsAvailable() {
    return Boolean(globalThis.customElements?.get?.("sf-bulk-actions") || globalThis.SF?.RuleLoader?.["cl-bulk-actions"]);
}

// Whether the pair's sf-input-date draws day marks (CL-6: dayMarks, a map or
// a function -> {count, tone, label}); before it the phone's month is the
// calendar's own grid with dots.
export function inputDateMarks() {
    const element = globalThis.customElements?.get?.("sf-input-date");
    if (!element) return false;
    return "dayMarks" in element.prototype || (element.observedAttributes ?? []).includes("day-marks");
}

class SfViewCalendar extends CalendarElement {
    static get props() {
        return {
            ...super.props,
            templateName: {attribute: "template", default: "default"},
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
        this._current = "";
        // id -> {before, after, how}: a move shown and not yet settled.
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
    }

    // ── data ───────────────────────────────────────────────────────────────

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
        this._records = Array.isArray(value) ? copy(value) : [];
        // A move still on its way keeps its event where it was put.
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
        this._fields = Array.isArray(value) ? value.map((field) => ({...field})) : [];
        this.requestComponentUpdate("fields");
    }

    /** layouts.calendar of simai.view-config/1 (date_field, end_field, all_day_field, mode, modes, color_field, event_fields, per_day, hours, slot, weekends, undated). */
    get options() {
        if (this._options === null) this._options = this._json("options", {}, (value) => value && typeof value === "object" && !Array.isArray(value));
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
    get actions() { return this._actions; }

    set actions(value) {
        this._actions = Array.isArray(value) ? value.filter((action) => action?.id && action.id !== "move").map((action) => ({...action})) : [];
        this.requestComponentUpdate("actions");
    }

    get selected() { return [...this._selected]; }

    set selected(value) {
        this._selected = new Set((Array.isArray(value) ? value : []).map(String));
        this.requestComponentUpdate("selected");
    }

    /** The record open in the record card (C305): its event is marked. */
    get current() { return this._current; }

    set current(value) {
        this._current = value === null || value === undefined ? "" : String(value);
        this.requestComponentUpdate("current");
    }

    get calendarOptions() {
        return calendarOptions(this.options, this.fields);
    }

    // ── the request's context (C293) ───────────────────────────────────────

    get locale() {
        return this.getProp("locale") || this.closest?.("[lang]")?.getAttribute("lang") || globalThis.document?.documentElement?.lang || "ru";
    }

    /** The zone dates are shown in: the request's (time-zone), else the person's. */
    get zone() {
        const given = this.getProp("timeZone");
        return validZone(given) ? given : personZone();
    }

    /** The week's first day: the request's (week-start), else the language's (ru Monday). */
    get weekStart() {
        // An absent week-start reads as the number setting's 0 (Sunday): only a
        // written one is the request's.
        const written = this.getAttribute?.("week-start");
        const given = written === null || written === undefined || written === "" ? null : this.getProp("weekStart");
        return Number.isInteger(given) && given >= 0 && given <= 7 ? given % 7 : weekStartFor(this.locale);
    }

    get weekend() {
        return weekendFor(this.locale);
    }

    /** «Now» in the request's zone: {date, minutes} (now= gives it, for a page that shows one moment). */
    get now() {
        const given = readValue(this.getProp("now"), {zone: this.zone});
        if (given) return {date: given.date, minutes: given.minutes ?? 0};
        return wallIn(Date.now(), this.zone);
    }

    get today() { return this.now.date; }

    get mode() {
        const options = this.calendarOptions;
        const modes = this.modes;
        // The written attribute, else layouts.calendar mode, else month: the
        // property's own default (month) must not hide the view's setting (VCL-1).
        const asked = this._mode ?? (this.hasAttribute?.("mode") ? this.getProp("mode") : null) ?? options.mode ?? "month";
        const mode = modes.includes(asked) ? asked : modes[0];
        return mode;
    }

    set mode(value) { this.setMode(value); }

    /** The modes offered: the options' modes; on a phone «День» goes and «Неделя» is three days. */
    get modes() {
        const modes = this.calendarOptions.modes;
        return this._phone ? modes.filter((mode) => mode !== "day") : modes;
    }

    get anchor() {
        return this._anchor ?? isoDate(this.getProp("date")) ?? this.today;
    }

    get range() {
        const options = this.calendarOptions;
        return rangeOf(this.mode, this.anchor, {weekStart: this.weekStart, phone: this._phone, weekends: options.weekends, weekend: this.weekend});
    }

    /** The window this calendar asks: {range: [from, to), date_field, end_field} (study 5). */
    get window() {
        const options = this.calendarOptions;
        const {from, to} = this.range;
        return {range: [from, to], date_field: options.dateField, ...(options.endField ? {end_field: options.endField} : {})};
    }

    get context() {
        return {timeZone: this.zone, weekStart: this.weekStart, locale: this.locale};
    }

    get undatedOpen() {
        if (this.calendarOptions.undated === "none") return false;
        if (this._undatedOpen !== null) return this._undatedOpen;
        return this.getProp("undatedOpen") === true || this.calendarOptions.undated === "panel";
    }

    // ── what the template asks ─────────────────────────────────────────────

    word(key, vars = {}, count) {
        return this.sfWord(key, {vars, ...(count === undefined ? {} : {count})});
    }

    get events() {
        return eventsOf(this.records, {options: this.calendarOptions, fields: this.fields, zone: this.zone, titleField: this.getProp("titleField") || "title"});
    }

    recordTitle(record) {
        const key = this.getProp("titleField") || "title";
        const value = record?.[key] ?? record?.title ?? record?.name ?? record?.id;
        return value && typeof value === "object" ? String(value.label ?? value.title ?? "") : String(value ?? "");
    }

    format(day, options) {
        try {
            return new Intl.DateTimeFormat(this.locale, {timeZone: "UTC", ...options}).format(new Date(`${day}T00:00:00Z`));
        } catch {
            return day;
        }
    }

    cap(text) {
        return text ? text.charAt(0).toLocaleUpperCase(this.locale) + text.slice(1) : text;
    }

    dayName(day) { return this.format(day, {weekday: "long", day: "numeric", month: "long"}); }

    dayOn(day) { return `${this.format(day, {day: "numeric", month: "long"})} (${this.format(day, {weekday: "long"})})`; }

    monthTitle(day) {
        return this.cap(this.format(day, {month: "long", year: "numeric"}).replace(/\s?г\.$/u, ""));
    }

    time(minutes) {
        if (minutes === null || minutes === undefined) return "";
        try {
            return new Intl.DateTimeFormat(this.locale, {timeZone: "UTC", hour: "2-digit", minute: "2-digit", hourCycle: "h23"})
                .format(new Date(Date.UTC(2000, 0, 1, Math.floor(minutes / 60) % 24, minutes % 60)));
        } catch {
            return clockOf(minutes);
        }
    }

    timeOf(event) {
        if (event.allDay) return this.word("all-day-text");
        const end = event.end.date === event.start.date ? this.time(event.end.minutes)
            : `${this.format(event.end.date, {day: "numeric", month: "short"})} ${this.time(event.end.minutes)}`;
        return `${this.time(event.start.minutes)}–${end}`;
    }

    eventLabel(event) {
        return [event.title, this.timeOf(event), event.label].filter(Boolean).join(", ");
    }

    // The event's tooltip: its name, time, colour option, the «Кратко» fields
    // as text, and the source's time where the source zone differs (study 5).
    eventTip(event) {
        const lines = [this.eventLabel(event)];
        for (const field of this.eventFieldList) {
            const value = event.record?.[field.key];
            if (value === null || value === undefined || value === "") continue;
            lines.push(`${field.label ?? field.key}: ${typeof value === "object" ? (value.label ?? value.title ?? "") : value}`);
        }
        if (event.source) lines.push(this.word("source-time-text", {time: this.time(event.source.minutes), zone: event.source.zone}));
        return lines.join("\n");
    }

    get eventFieldList() {
        return this.calendarOptions.eventFields
            .map((key) => this.fields.find((field) => String(field.key) === key))
            .filter(Boolean);
    }

    fieldAlign(field) {
        const type = String(field.propertyType ?? field.property_type ?? field.type ?? "");
        return ["integer", "number", "decimal", "money", "percent"].includes(type) ? "end" : "start";
    }

    // An event field in the «Кратко» place: the Framework field renderers'
    // cell output (C300 (2)); text where the set answers nothing.
    cellShape(field, record) {
        const value = record?.[field.key];
        if (value === null || value === undefined || value === "") return null;
        const typed = {...field, propertyType: field.propertyType ?? field.property_type ?? field.type};
        let shape = null;
        try {
            shape = renderCellField(typed, value, this.cellHost ?? null);
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
        if (this.weekend.includes(weekday(day))) parts.push(this.word("off-mark"));
        parts.push(this.eventsCount(count));
        return parts.join(", ");
    }

    get periodTitle() {
        const {days} = this.range;
        const mode = this.mode;
        if (mode === "month" || mode === "list") return this.monthTitle(this.anchor);
        if (mode === "day") return this.cap(this.dayName(this.anchor));
        const first = days[0];
        const last = days[days.length - 1];
        if (first.slice(0, 7) === last.slice(0, 7)) return `${Number(first.slice(8))}–${this.format(last, {day: "numeric", month: "long", year: "numeric"})}`;
        return `${this.format(first, {day: "numeric", month: "long"})} – ${this.format(last, {day: "numeric", month: "long", year: "numeric"})}`;
    }

    // The rules in force: the host's rules of the date field and those of
    // layouts.calendar (view-config/1).
    get moveRules() {
        return [...(this.rules ?? []), ...(this.calendarOptions.rules ?? [])];
    }

    // The words of a refusal: the host's reason, else the pack's word for
    // its code (a rule's, or storage_calendar_update_*), else «Сюда нельзя».
    refusalText(reason = "", code = "") {
        const said = String(reason ?? "").trim();
        // A machine code (storage_record_revision_stale) is not words for a person.
        const saidIsCode = /^[a-z][a-z0-9]*(?:[_.:-][a-z0-9]+)+$/u.test(said);
        const fromCode = refusalWord(code) ?? (saidIsCode ? refusalWord(said) : null);
        if (said && !saidIsCode) return said;
        return fromCode ? this.word(fromCode) : this.word("refuse-default");
    }

    // Whether a record may go to a day: its right, then the host's rules.
    check(record, day) {
        if (this.getProp("movable") === false) return {ok: false, reason: this.word("no-right-text")};
        const result = moveCheck({record, day, rules: this.moveRules, today: this.today, noRight: ""});
        return result.ok ? result : {ok: false, code: result.code, reason: this.refusalText(result.reason, result.code)};
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
            truncated: this.getProp("truncated") === true || this.records.length > RECORDS_MAX,
            message: this._message,
            selectable: this.getProp("selectable") !== false,
            creatable: this.getProp("creatable") === true,
            movable: this.getProp("movable") !== false,
            bulkActions: bulkActionsAvailable(),
            inputDateMarks: inputDateMarks(),
            actions: [{id: "move", text: this.word("move-selected-text"), icon: "event"}, ...this._actions],
            pick: this._pick,
            hourRow: HOUR_ROW,
        };
    }

    template() {
        return renderViewCalendarTemplate(this.templateContext());
    }

    // ── life ───────────────────────────────────────────────────────────────

    onConnected() {
        super.onConnected?.();
        if (this._listening) return;
        this._listening = new AbortController();
        const signal = this._listening.signal;
        this.addEventListener("click", (event) => this._onClick(event), {signal});
        this.addEventListener("change", (event) => this._onChange(event), {signal});
        this.addEventListener("sf-segmented-change", (event) => this._onChange(event), {signal});
        this.addEventListener("sf-input-date-change", (event) => this._onPicked(event), {signal});
        this.addEventListener("keydown", (event) => this._onKey(event), {signal});
        this.addEventListener("focusin", (event) => this._onFocus(event), {signal});
        this.addEventListener("contextmenu", (event) => this._onContextMenu(event), {signal});
        this.addEventListener("pointerdown", (event) => this._onPointerDown(event), {signal});
        this.addEventListener("sf-bulk-actions-action", (event) => this._onBulkAction(event), {signal});
        this.addEventListener("sf-bulk-actions-clear", () => this.clearSelection(), {signal});
        // A held touch would scroll the page; while an event is held it does not.
        this.addEventListener("touchmove", (event) => { if (this._drag) event.preventDefault(); }, {signal, passive: false});
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
        super.afterRender?.(changed);
        // The host is display: contents (a Smart host has no box), so the
        // calendar's own root is what is measured for the phone layout.
        const root = this.querySelector(":scope > .sf-view-calendar");
        if (root && this._resize && this._observed !== root) {
            if (this._observed) this._resize.unobserve(this._observed);
            this._observed = root;
            this._resize.observe(root);
        }
        globalThis.setTimeout?.(() => this._rove(), 0);
        // Week and day open on the first hours that hold an event (else the
        // visible start), once per period.
        const scroll = this.querySelector(".sf-view-calendar__scroll");
        const key = `${this.mode}:${this.range.from}`;
        if (scroll && this._scrolledFor !== key) {
            this._scrolledFor = key;
            const timed = this.events.filter((event) => !event.bar && event.first >= this.range.from && event.first < this.range.to);
            const hours = this.calendarOptions.hours;
            const first = Math.min(...timed.map((event) => event.start.minutes ?? hours[0]), hours[0] + 60);
            scroll.scrollTop = Math.max(0, ((first - hours[0]) / 60) * this._hourRow(scroll) - this._hourRow(scroll) / 4);
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
    }

    // ── period and mode ────────────────────────────────────────────────────

    /** Shows a mode (month, week, day, list): the range event when the days change, save to keep it. */
    setMode(mode) {
        if (!MODES.includes(mode) || !this.modes.includes(mode) || mode === this.mode) return false;
        const range = this.window.range.join();
        this._mode = mode;
        this._anchor = this._focus ?? this.anchor;
        this.requestComponentUpdate("mode");
        this._say(this.word("mode-changed-text", {mode: this.word(`mode-${mode === "week" && this._phone ? "three" : mode}`)}));
        this._save();
        if (this.window.range.join() !== range) this._rangeChanged();
        return true;
    }

    /** Shows the period around a day (yyyy-mm-dd). */
    goTo(day, {focus = false} = {}) {
        const date = isoDate(day);
        if (!date) return false;
        const range = this.window.range.join();
        this._anchor = date;
        this._focus = date;
        this._picked = date;
        this.requestComponentUpdate("period");
        if (this.window.range.join() !== range) this._rangeChanged();
        if (focus) this.whenRendered?.(() => this._focusDay(date), {next: true});
        return true;
    }

    step(direction, {focus = false} = {}) {
        const base = focus && this._focus ? this._focus : this.anchor;
        return this.goTo(stepPeriod(this.mode, base, direction, {phone: this._phone}), {focus});
    }

    _rangeChanged() {
        const {range} = this.window;
        this.sfEmit("range", {from: range[0], to: range[1], mode: this.mode, window: this.window, context: this.context});
    }

    _save() {
        this.sfEmit("save", {mode: this.mode, undated_open: this.undatedOpen});
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
    }

    // ── keys and the one Tab stop ──────────────────────────────────────────

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
        if (!active) active = cells.find((cell) => cell.dataset.day === focus) ?? cells.find((cell) => cell.dataset.day >= focus) ?? cells[0] ?? null;
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
        target?.focus?.({preventScroll: false});
        target?.scrollIntoView?.({block: "nearest", inline: "nearest"});
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
    }

    // The items inside a day: its events (not the continuation of a bar), «+N» and «+».
    _inner(cell) {
        // sf-button and sf-button-icon carry their data- attributes on their inner button.
        return ["[data-ev]:not([aria-hidden=true])", "[data-more]", "[data-add]"]
            .flatMap((selector) => [...cell.querySelectorAll(selector)])
            .filter((node) => node.closest("[data-day][role=gridcell]") === cell);
    }

    _onKey(event) {
        if (this._drag?.active) {
            if (event.key === "Escape") { event.preventDefault(); this._cancelDrag(); }
            return;
        }
        if (event.target.closest?.(".sf-view-calendar__pick")) {
            if (event.key === "Escape") { event.preventDefault(); this.closePick(); }
            return;
        }
        if (!event.target.closest?.(".sf-view-calendar__main")) return;
        const item = event.target.closest?.("[data-ev], [data-more], [data-add], .sf-view-calendar__row");
        const cell = event.target.closest?.("[data-day][role=gridcell]");
        const rtl = globalThis.getComputedStyle?.(this)?.direction === "rtl";
        const horizontal = (key) => (key === "ArrowRight" ? (rtl ? -1 : 1) : key === "ArrowLeft" ? (rtl ? 1 : -1) : 0);
        if (item && item !== cell) {
            const id = item.dataset.ev ?? item.dataset.id;
            if (id && ((event.shiftKey && event.key === "F10") || event.key === "ContextMenu")) {
                event.preventDefault();
                this.openEventMenu(id, item);
                return;
            }
            if (id && event.ctrlKey && event.shiftKey && horizontal(event.key)) {
                event.preventDefault();
                this.nudge(id, {days: horizontal(event.key)});
                return;
            }
            if (id && event.ctrlKey && event.shiftKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
                event.preventDefault();
                if (this.mode === "week" || this.mode === "day") this.nudge(id, {minutes: (event.key === "ArrowDown" ? 1 : -1) * this.calendarOptions.slot});
                return;
            }
            if (id && event.key === " " && item.matches(".sf-view-calendar__row") && this.getProp("selectable") !== false) {
                event.preventDefault();
                this.toggleSelected(id);
                return;
            }
            if (event.key === "Enter") {
                event.preventDefault();
                if (item.matches("[data-more]")) this.openDayList(item.dataset.more, item);
                else if (item.matches("[data-add]")) this.createOn(item.dataset.add, item.dataset.time ? Number(item.dataset.time) : null);
                else if (id) this.openRecord(id);
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
                this.whenRendered?.(() => this._go(this._cells()[0]), {next: true});
                return;
            }
            if (item.matches(".sf-view-calendar__row") && (event.key === "Home" || event.key === "End")) {
                event.preventDefault();
                const rows = this._cells();
                this._go(event.key === "Home" ? rows[0] : rows[rows.length - 1]);
                return;
            }
            // From an event of a day, the day keys still go from its day:
            // ←→ the next day, Home/End the week, PageUp/PageDown the period.
            const dayKey = horizontal(event.key) || ["Home", "End", "PageDown", "PageUp"].includes(event.key);
            if (!cell || !dayKey || event.ctrlKey || event.altKey || event.metaKey) return;
        } else if (!cell || event.target !== cell) return;
        const day = cell.dataset.day;
        const month = this.mode === "month";
        const shift = (dow) => (weekday(day) - this.weekStart + 7) % 7 + dow;
        let to = null;
        if (horizontal(event.key)) to = addDays(day, horizontal(event.key));
        else if (event.key === "ArrowDown" && month) to = addDays(day, 7);
        else if (event.key === "ArrowUp" && month) to = addDays(day, -7);
        else if (event.key === "Home") to = addDays(day, -shift(0));
        else if (event.key === "End") to = addDays(day, 6 - shift(0));
        else if (event.key === "PageDown" || event.key === "PageUp") {
            event.preventDefault();
            const direction = event.key === "PageDown" ? 1 : -1;
            if (event.shiftKey) this.goTo(addMonths(day, 12 * direction), {focus: true});
            else this.step(direction, {focus: true});
            this._say(this.periodTitle);
            return;
        } else if (event.key === "t" || event.key === "T" || event.key === "е" || event.key === "Е") {
            event.preventDefault();
            this.goTo(this.today, {focus: true});
            this._say(this.word("today-said-text", {day: this.dayName(this.today)}));
            return;
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (this._phone && month) {
                this.pickDay(day);
                return;
            }
            const first = this._inner(cell)[0];
            if (first) this._go(first);
            else this._say(`${this.cap(this.dayName(day))}: ${this.word("events-none")}`);
            return;
        } else if ((event.shiftKey && event.key === "F10") || event.key === "ContextMenu") {
            event.preventDefault();
            this.openDayMenu(day, cell);
            return;
        }
        if (!to) return;
        event.preventDefault();
        if (this.querySelector(`.sf-view-calendar__main [data-day="${esc(to)}"][role=gridcell]`)) this._focusDay(to);
        else this.goTo(to, {focus: true});
        if (this._phone && month) this.pickDay(to, {quiet: true});
    }

    // ── clicks and menus ───────────────────────────────────────────────────

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
        if (data.page) this.step(Number(data.page));
        else if (target.hasAttribute("data-gotoday")) {
            this.goTo(this.today);
            this._say(this.word("today-said-text", {day: this.dayName(this.today)}));
        } else if (target.hasAttribute("data-undtoggle")) this.toggleUndated();
        else if (target.hasAttribute("data-undclose")) this.toggleUndated(false);
        else if (data.add) this.createOn(data.add, data.time ? Number(data.time) : null);
        else if (data.more) this.openDayList(data.more, target);
        else if (data.menu) this.openEventMenu(data.menu, target);
        else if (data.box) return;
        else if (data.ev) this.openRecord(data.ev);
        else if (target.hasAttribute("data-pickclose")) this.closePick();
        else if (data.bulk) this._bulk(data.bulk, target);
        else if (target.hasAttribute("data-clear")) this.clearSelection();
        else if (data.day && target.matches("[role=gridcell]")) {
            this._focus = data.day;
            if (this._phone && this.mode === "month") this.pickDay(data.day);
        }
    }

    _onContextMenu(event) {
        const item = event.target.closest?.("[data-ev]");
        if (!item || !this.contains(item)) return;
        event.preventDefault();
        // A held row already opened its menu; a held touch on Android also sends this.
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
    pickDay(day, {quiet = false} = {}) {
        this._picked = day;
        this._phoneUndated = false;
        this._focus = day;
        this.requestComponentUpdate("picked");
        if (!quiet) this._say(`${this.cap(this.dayName(day))}: ${this.eventsCount(this.events.filter((event) => onDay(event, day)).length)}`);
    }

    _menu(options) {
        const menu = globalThis.SF?.menu;
        if (typeof menu?.open !== "function") return Promise.resolve(null);
        return Promise.resolve(menu.open(options)).catch(() => null);
    }

    _found(id) {
        const key = String(id);
        const event = this.events.find((entry) => entry.id === key) ?? null;
        const record = event?.record ?? this.undated.find((entry) => String(entry.id) === key) ?? null;
        return record ? {event, record} : null;
    }

    /** The event menu (Shift+F10, the context menu, «⋯»): Открыть, a day earlier / later, Перенести на…, Убрать дату; a disabled item says why. */
    openEventMenu(id, anchor = null, point = null) {
        const found = this._found(id);
        if (!found) return Promise.resolve(null);
        const {event, record} = found;
        const title = this.recordTitle(record);
        const readOnly = this.readOnly(record);
        const day = event?.first ?? null;
        const earlier = day ? addDays(day, -1) : null;
        const later = day ? addDays(day, 1) : this.today;
        const checkEarlier = earlier ? this.check(record, earlier) : {ok: false, reason: ""};
        const checkLater = this.check(record, later);
        const entries = [
            {id: "open", text: this.word("open-text"), icon: "open_in_new"},
            {type: "separator"},
            {id: `to:${earlier}`, text: this.word("earlier-text"), icon: "chevron_left", disabled: !earlier || !checkEarlier.ok, caption: earlier && !checkEarlier.ok ? checkEarlier.reason : ""},
            {id: `to:${later}`, text: this.word(day ? "later-text" : "to-today-text"), icon: "chevron_right", disabled: !checkLater.ok, caption: checkLater.ok ? "" : checkLater.reason},
            {id: "pick", text: this.word("pick-text"), icon: "event", disabled: Boolean(readOnly), caption: readOnly},
        ];
        if (this.calendarOptions.undated !== "none") entries.push({id: "clear", text: this.word("clear-date-text"), icon: "event_busy", disabled: !day || Boolean(readOnly), caption: day ? readOnly : ""});
        return this._menu({...(point ? {x: point[0], y: point[1]} : {anchor: anchor ?? this}), entries, label: this.word("event-menu-text", {title})}).then((chosen) => {
            const choice = chosen?.id;
            if (!choice) return null;
            if (choice === "open") return this.openRecord(id);
            if (choice.startsWith("to:")) return this.moveRecord(id, {day: choice.slice(3)}, {how: "menu"});
            if (choice === "pick") return this.openPick([String(id)], anchor);
            if (choice === "clear") return this.moveRecord(id, {day: null}, {how: "menu"});
            return null;
        });
    }

    /** The day menu (Shift+F10 on a day): a new record on that day, its events. */
    openDayMenu(day, anchor = null) {
        const entries = [];
        if (this.getProp("creatable") === true) entries.push({id: "add", text: this.word("add-text", {day: this.dayOn(day)}), icon: "add"});
        const list = this.events.filter((event) => onDay(event, day));
        if (list.length) entries.push({id: "list", text: this.word("day-list-text"), icon: "list"});
        if (!entries.length) return Promise.resolve(null);
        return this._menu({anchor: anchor ?? this, entries, label: this.cap(this.dayName(day))}).then((chosen) => {
            if (chosen?.id === "add") return this.createOn(day);
            if (chosen?.id === "list") return this.openDayList(day, anchor);
            return null;
        });
    }

    /** «+N»: the day's list in place (C307 (2)); a choice opens the record. */
    openDayList(day, anchor = null) {
        const list = this.events.filter((event) => onDay(event, day));
        const label = `${this.cap(this.dayName(day))} — ${this.eventsCount(list.length)}`;
        const fields = this.eventFieldList;
        const entries = list.map((event) => ({
            id: event.id,
            text: `${event.allDay ? this.word("all-day-text") : this.time(event.start.minutes)}  ${event.title}`,
            caption: [...fields.map((field) => {
                const value = event.record?.[field.key];
                return value === null || value === undefined ? "" : (typeof value === "object" ? (value.label ?? value.title ?? "") : String(value));
            }), event.label].filter(Boolean).join(" · "),
        }));
        return this._menu({anchor: anchor ?? this, label, entries}).then((chosen) => (chosen?.id ? this.openRecord(chosen.id) : null));
    }

    // ── what the calendar asks the host ────────────────────────────────────

    openRecord(id) {
        return this.sfEmit("open", {id: String(id)});
    }

    /** «+» in a day (C307 (4)): the host opens a new record with that date (and time, in week and day). */
    createOn(day, minutes = null) {
        const date = isoDate(day);
        if (!date) return false;
        return this.sfEmit("create", {date, ...(minutes === null || minutes === undefined ? {} : {time: clockOf(minutes)}), field: this.calendarOptions.dateField});
    }

    // ── selection (list mode) ──────────────────────────────────────────────

    toggleSelected(id) {
        this._setSelected(id, !this._selected.has(String(id)));
    }

    _setSelected(id, on) {
        const key = String(id);
        if (on === this._selected.has(key)) return;
        if (on) this._selected.add(key);
        else this._selected.delete(key);
        this.requestComponentUpdate("selected");
        this.sfEmit("select", {ids: [...this._selected]});
    }

    clearSelection() {
        if (!this._selected.size) return;
        this._selected.clear();
        this.requestComponentUpdate("selected");
        this.sfEmit("select", {ids: []});
    }

    _onBulkAction(event) {
        const id = event.detail?.id;
        if (id === "move") {
            event.preventDefault();
            return this._bulk("move", event.target);
        }
        return this.sfEmit("apply", {action: String(id), ids: [...this._selected], scope: event.detail?.scope ?? "selection"});
    }

    _bulk(action, anchor) {
        if (action !== "move") return this.sfEmit("apply", {action: String(action), ids: [...this._selected], scope: "selection"});
        return this.openPick([...this._selected], anchor);
    }

    // ── «Перенести на…»: sf-input-date in a window ─────────────────────────

    openPick(ids, anchor = null) {
        const list = ids.map(String).filter((id) => this._found(id));
        if (!list.length) return false;
        const box = anchor?.getBoundingClientRect?.();
        const root = this.querySelector(":scope > .sf-view-calendar")?.getBoundingClientRect?.();
        const first = this._found(list[0]);
        this._pick = {
            ids: list,
            title: list.length === 1 ? this.recordTitle(first.record) : this.word("selected-text", {count: list.length}),
            day: first.event?.first ?? this.today,
            top: box && root ? Math.max(0, box.bottom - root.top) : 0,
            minDate: this.moveRules.some((rule) => rule?.code === "past") ? this.today : "",
        };
        this.requestComponentUpdate("pick");
        globalThis.customElements?.get?.("sf-input-date") || globalThis.SF?.Loader?.ensure?.(["sf-input-date"]);
        this.whenRendered?.(() => this.querySelector(".sf-view-calendar__pick sf-input-date")?.focus?.(), {next: true});
        return true;
    }

    closePick() {
        if (!this._pick) return;
        const ids = this._pick.ids;
        this._pick = null;
        this.requestComponentUpdate("pick");
        this.whenRendered?.(() => this._focusEvent(ids[0]), {next: true});
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
        const refused = ids.map((id) => [id, this.check(this._found(id)?.record, day)]).filter(([, result]) => !result.ok);
        if (refused.length === ids.length) {
            this._refuse(this.word("not-moved-text", {title: this._pick.title, reason: refused[0][1].reason}));
            return;
        }
        this._pick = null;
        this.requestComponentUpdate("pick");
        if (ids.length > 1) this.clearSelection();
        for (const id of ids) this.moveRecord(id, {day}, {how: "pick"});
    }

    // ── moves ──────────────────────────────────────────────────────────────

    /** One step by keys or the menu: a day earlier or later, or one slot in week and day. */
    nudge(id, {days = 0, minutes = 0} = {}) {
        const found = this._found(id);
        if (!found?.event) return Promise.resolve(null);
        const {event} = found;
        if (minutes && event.bar) return Promise.resolve(null);
        const start = event.start.minutes;
        const next = minutes ? start + minutes : null;
        if (next !== null && (next < 0 || next >= 24 * 60)) return Promise.resolve(null);
        return this.moveRecord(id, {day: addDays(event.first, days), minutes: next}, {how: "keys"});
    }

    /**
     * Moves a record to a day (and a time, in week and day), or to no day
     * («Без даты»). Refused by its right or the host's rules: the reason,
     * nothing moves. Else shown at once and pale, sf-view-calendar-move goes
     * out (cancelable), and the host settles it with settleMove.
     */
    moveRecord(id, {day, minutes = null, endMinutes = null} = {}, {how = ""} = {}) {
        const key = String(id);
        const found = this._found(key);
        if (!found || this._pending.has(key)) return Promise.resolve(null);
        const {event, record} = found;
        const title = this.recordTitle(record);
        const options = this.calendarOptions;
        if (day === null && !event) return Promise.resolve(null);
        const check = this.check(record, day);
        if (!check.ok) {
            this._refuse(this.word("not-moved-text", {title, reason: check.reason}));
            return Promise.resolve(null);
        }
        const dateField = this.fields.find((field) => String(field.key) === options.dateField);
        const sourceZone = dateField?.timeZone ?? dateField?.time_zone ?? null;
        const timed = String(dateField?.propertyType ?? dateField?.property_type ?? dateField?.type ?? "") !== "date";
        const patch = movePatch(event, {
            day, minutes: event ? minutes : (timed ? (minutes ?? options.hours[0] + 120) : null), endMinutes, options, zone: this.zone, sourceZone,
            record: {...record, __timed: timed},
        });
        const before = Object.fromEntries(Object.keys(patch).map((field) => [field, record[field] ?? null]));
        if (Object.keys(patch).every((field) => patch[field] === before[field])) return Promise.resolve(null);
        const move = {before, after: patch, how, from: event ? "dated" : "undated", title};
        this._pending.set(key, move);
        this._write(key, patch);
        this.requestComponentUpdate("move");
        // A move by keys keeps the focus on the event in its new place.
        if (how === "keys" || how === "menu" || how === "pick") this.whenRendered?.(() => this._focusEvent(key), {next: true});
        const allowed = this.sfEmit("move", {
            id: key, patch: {...patch}, from: {...before}, revision: record.revision ?? record._revision ?? null, how,
        }, {cancelable: true});
        if (allowed === false) {
            this.settleMove(key, {answer: "refused", reason: ""});
            return Promise.resolve(null);
        }
        return Promise.resolve(true);
    }

    // A patch written into the record wherever it is now: dated records and
    // undated ones trade places when the date comes or goes.
    _write(id, patch) {
        const key = String(id);
        const options = this.calendarOptions;
        const inRecords = this.records.findIndex((entry) => String(entry.id) === key);
        const inUndated = this.undated.findIndex((entry) => String(entry.id) === key);
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
        if (id && typeof id === "object") ({id, result = {}} = id);
        const key = String(id);
        const move = this._pending.get(key);
        if (!move) return refused("unknown-move");
        this._pending.delete(key);
        const focused = this.ownerDocument?.activeElement?.closest?.("[data-ev]")?.dataset?.ev === key || this._keyed === key;
        if (result.answer === "applied") {
            if (result.record && typeof result.record === "object") this._write(key, copy(result.record));
            this._say(this._movedText(key, move));
        } else {
            this._write(key, move.before);
            const reason = this.refusalText(result.message || result.reason || "", result.code ?? result.reason ?? "");
            this._refuse(this.word("not-moved-text", {title: move.title, reason}));
        }
        this.requestComponentUpdate("settled");
        this.whenRendered?.(() => {
            if (focused || this.ownerDocument?.activeElement === this.ownerDocument?.body) this._focusEvent(key);
        }, {next: true});
        return applied();
    }

    _movedText(id, move) {
        const found = this._found(id);
        const event = found?.event;
        if (!event) return this.word("undated-moved-text", {title: move.title});
        const when = `${this.dayOn(event.first)}${event.allDay ? "" : `, ${this.timeOf(event)}`}`;
        if (move.from === "undated") return this.word("dated-text", {title: move.title, when});
        const options = this.calendarOptions;
        const onlyEnd = Object.keys(move.after).length === 1 && options.endField && move.after[options.endField] !== undefined;
        if (onlyEnd) return this.word("resized-text", {title: move.title, time: event.allDay ? this.dayOn(event.last) : this.time(event.end.minutes)});
        return this.word("moved-text", {title: move.title, when});
    }

    // ── pointer moves and stretches (mouse and touch) ──────────────────────

    _onPointerDown(event) {
        if (event.button !== 0) return;
        this._rowHeld = false;
        // A list row (the phone's day list, its «Без даты» list) does not drag:
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
            id: String(id), node, resize: Boolean(handle), active: false, pointer: event.pointerId, type: event.pointerType,
            x: event.clientX, y: event.clientY, grabY: event.clientY - rect.top, ghost: null, over: null,
        };
        if (handle) event.preventDefault();
        const signal = this._listening?.signal;
        this._dragMove = (moving) => this._onPointerMove(moving);
        this._dragUp = (up) => this._onPointerUp(up);
        globalThis.addEventListener?.("pointermove", this._dragMove, {signal});
        globalThis.addEventListener?.("pointerup", this._dragUp, {signal});
        globalThis.addEventListener?.("pointercancel", this._dragUp, {signal});
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
        const move = (moving) => { if (moving.pointerId === pointer && Math.hypot(moving.clientX - start[0], moving.clientY - start[1]) > 8) stop(); };
        globalThis.addEventListener?.("pointermove", move, {signal});
        globalThis.addEventListener?.("pointerup", stop, {signal});
        globalThis.addEventListener?.("pointercancel", stop, {signal});
        const timer = globalThis.setTimeout?.(() => {
            stop();
            this._rowHeld = true;
            this.openEventMenu(row.dataset.ev, row);
        }, TOUCH_HOLD * 2);
        this._rowHold = {timer, move, stop};
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
        const record = found?.record;
        // While held, a day the host refuses dims and says why (CA-4).
        if (!drag.resize) {
            for (const cell of this.querySelectorAll("[data-day][data-drop]")) {
                const result = this.check(record, cell.dataset.day);
                cell.toggleAttribute("data-refuse", !result.ok);
                if (result.ok) cell.removeAttribute("title");
                else cell.setAttribute("title", this.word("refuse-text", {reason: result.reason}));
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
        this._say(this.word("held-text", {title: this.recordTitle(record)}));
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
            const minutes = this._slotAt(column, event.clientY, {end: true});
            const found = this._found(drag.id)?.event;
            if (!found) return;
            const end = Math.max(found.start.minutes + this.calendarOptions.slot, minutes);
            const [from] = this.calendarOptions.hours;
            const row = this._hourRow(column);
            block.style.blockSize = `${((end - Math.max(from, found.start.minutes)) / 60) * row}px`;
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
        globalThis.setTimeout?.(() => { this._dragged = false; }, 0);
        if (drag.resize) {
            const end = drag.end;
            this._endDrag();
            const found = this._found(drag.id)?.event;
            if (found && end !== undefined && end !== found.end.minutes) this.moveRecord(drag.id, {day: found.first, minutes: found.start.minutes, endMinutes: end}, {how: "stretch"});
            else this.requestComponentUpdate("drag");
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
            if (this._found(id)?.event) this.moveRecord(id, {day: null}, {how: "drag"});
            return;
        }
        const day = target.dataset.day;
        const record = this._found(id)?.record;
        const result = this.check(record, day);
        if (!result.ok) {
            this._refuse(this.word("not-moved-text", {title: this.recordTitle(record), reason: result.reason}));
            this.requestComponentUpdate("drag");
            return;
        }
        let minutes = null;
        if (target.matches(".sf-view-calendar__col")) minutes = this._slotAt(target, event.clientY - grab);
        this.moveRecord(id, {day, minutes}, {how: "drag"});
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
    }

    // The minute under a point of a day column, on the slot's step, inside the visible hours.
    _slotAt(column, y, {end = false} = {}) {
        const options = this.calendarOptions;
        const [from, to] = options.hours;
        if (!column) return from;
        const rect = column.getBoundingClientRect();
        const row = this._hourRow(column);
        const raw = from + ((y - rect.top) / row) * 60;
        const stepped = Math.round(raw / options.slot) * options.slot;
        return Math.max(from, Math.min(end ? to : to - options.slot, stepped));
    }

    // ── messages ───────────────────────────────────────────────────────────

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
