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

export const MODES = Object.freeze(["month", "week", "day", "list"]);
export const PER_DAY = 3;
export const SLOT = 30;
export const HOURS = Object.freeze([8 * 60, 20 * 60]);
export const EVENT_FIELDS_MAX = 3;
export const RECORDS_MAX = 1000;
export const MONTH_DAYS = 42;
export const PHONE_DAYS = 3;
const DATE_TYPES = new Set(["date", "datetime"]);
const COLOUR_TYPES = new Set(["status", "choice", "select", "enum"]);
const ROLES = new Set(["primary", "secondary", "tertiary", "info", "success", "warning", "error", "neutral"]);
const DAY_MS = 864e5;

const typeOf = (field) => String(field?.propertyType ?? field?.property_type ?? field?.type ?? "");
const text = (value) => (value && typeof value === "object" ? String(value.label ?? value.title ?? value.value ?? "") : String(value ?? ""));
const pad = (number) => String(number).padStart(2, "0");

// ── options ──────────────────────────────────────────────────────────────

/** "08:00" -> 480; a number of minutes stays; anything else is null. */
export function minutesOf(value) {
    if (Number.isFinite(value)) return Math.max(0, Math.min(24 * 60, Math.round(value)));
    const found = /^(\d{1,2}):(\d{2})$/u.exec(String(value ?? "").trim());
    if (!found) return null;
    const minutes = Number(found[1]) * 60 + Number(found[2]);
    return minutes >= 0 && minutes <= 24 * 60 ? minutes : null;
}

/** 480 -> "08:00". */
export function clockOf(minutes) {
    const whole = Math.max(0, Math.round(minutes));
    return `${pad(Math.floor(whole / 60) % 25)}:${pad(whole % 60)}`;
}

/**
 * layouts.calendar of view-config/1 with its defaults (study 5, the options
 * table). No week start and no time zone: they come from the request (C293).
 */
export function calendarOptions(options = {}, fields = []) {
    const given = options && typeof options === "object" ? options : {};
    const list = Array.isArray(fields) ? fields : [];
    const keyOf = (field) => (field ? String(field.key) : null);
    const dateField = given.date_field ? String(given.date_field) : keyOf(list.find((field) => DATE_TYPES.has(typeOf(field))));
    const endField = given.end_field ? String(given.end_field) : null;
    const allDayField = given.all_day_field ? String(given.all_day_field) : null;
    const modes = Array.isArray(given.modes) && given.modes.some((mode) => MODES.includes(mode))
        ? MODES.filter((mode) => given.modes.includes(mode)) : [...MODES];
    const mode = modes.includes(given.mode) ? given.mode : (modes.includes("month") ? "month" : modes[0]);
    const colorField = given.color_field !== undefined ? (given.color_field ? String(given.color_field) : null)
        : keyOf(list.find((field) => typeOf(field) === "status") ?? list.find((field) => COLOUR_TYPES.has(typeOf(field)) && Array.isArray(field.options)));
    const skip = new Set([dateField, endField, allDayField, "title"].filter(Boolean));
    const shown = list.filter((field) => !skip.has(String(field.key)) && !field.title && field.visible !== false && field.key !== colorField);
    const eventFields = (Array.isArray(given.event_fields) ? given.event_fields.map(String) : shown.map((field) => String(field.key)))
        .filter((key) => !skip.has(key)).slice(0, EVENT_FIELDS_MAX);
    const perDay = Number.isSafeInteger(given.per_day) && given.per_day > 0 ? given.per_day : PER_DAY;
    const from = minutesOf(Array.isArray(given.hours) ? given.hours[0] : null);
    const to = minutesOf(Array.isArray(given.hours) ? given.hours[1] : null);
    const hours = from !== null && to !== null && from < to ? [from, to] : [...HOURS];
    const slot = Number.isSafeInteger(given.slot) && given.slot >= 5 && given.slot <= 120 ? given.slot : SLOT;
    return {
        dateField, endField, allDayField, mode, modes, colorField, eventFields, perDay, hours, slot,
        weekends: given.weekends === "hide" ? "hide" : "show",
        undated: ["button", "panel", "none"].includes(given.undated) ? given.undated : "button",
    };
}

// ── days ─────────────────────────────────────────────────────────────────

const dayDate = (iso) => new Date(`${String(iso).slice(0, 10)}T00:00:00Z`);
export const isoDay = (date) => date.toISOString().slice(0, 10);
export function addDays(iso, count) {
    const date = dayDate(iso);
    date.setUTCDate(date.getUTCDate() + count);
    return isoDay(date);
}
export const weekday = (iso) => dayDate(iso).getUTCDay();
export const daysBetween = (from, to) => Math.round((dayDate(to) - dayDate(from)) / DAY_MS);
export const weekStartOf = (iso, start) => addDays(iso, -((weekday(iso) - start + 7) % 7));
export const monthStart = (iso) => `${String(iso).slice(0, 7)}-01`;
export function addMonths(iso, count) {
    const date = dayDate(monthStart(iso));
    date.setUTCMonth(date.getUTCMonth() + count);
    const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    return `${isoDay(date).slice(0, 8)}${pad(Math.min(Number(String(iso).slice(8, 10)) || 1, last))}`;
}

/** The week's first day for a language (Intl week info; ru Monday, en-US Sunday, ar-EG Saturday). 0 Sunday .. 6 Saturday. */
export function weekStartFor(locale) {
    try {
        const info = new Intl.Locale(locale || "en");
        const week = typeof info.getWeekInfo === "function" ? info.getWeekInfo() : info.weekInfo;
        if (week && Number.isInteger(week.firstDay)) return week.firstDay % 7;
    } catch { /* an unknown locale reads as the default */ }
    const language = String(locale || "").toLowerCase();
    if (/^(en-us|en-ca|ja|ko|zh-tw|he|pt-br)/u.test(language)) return 0;
    if (/^(ar|fa)/u.test(language)) return 6;
    return 1;
}

/** The days off of a language, as days of the week 0..6 (Intl week info; Saturday and Sunday where it says nothing). */
export function weekendFor(locale) {
    try {
        const info = new Intl.Locale(locale || "en");
        const week = typeof info.getWeekInfo === "function" ? info.getWeekInfo() : info.weekInfo;
        if (week && Array.isArray(week.weekend) && week.weekend.length) return week.weekend.map((day) => day % 7);
    } catch { /* the default below */ }
    return [6, 0];
}

/**
 * The days a mode shows around a day: month = six weeks from the week start
 * of the 1st, week = seven days (three on a phone), day = one, list = the
 * month. `to` is the day after the last (the window's right edge is excluded).
 * With weekends hidden the week and month draw only the working days; the
 * window stays whole.
 */
export function rangeOf(mode, anchor, {weekStart = 1, phone = false, weekends = "show", weekend = [6, 0]} = {}) {
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
    const days = Array.from({length: count}, (_, index) => addDays(from, index));
    const drawn = weekends === "hide" && (mode === "month" || (mode === "week" && !phone))
        ? days.filter((day) => !weekend.includes(weekday(day))) : days;
    return {from, to: addDays(from, count), days: drawn, all: days};
}

/** The next or previous period: a month for month and list, a week (three days on a phone) or a day. */
export function stepPeriod(mode, anchor, direction, {phone = false} = {}) {
    if (mode === "month" || mode === "list") return addMonths(anchor, direction);
    if (mode === "week") return addDays(anchor, direction * (phone ? PHONE_DAYS : 7));
    return addDays(anchor, direction);
}

// ── time zones ───────────────────────────────────────────────────────────

const formatters = new Map();
function partsIn(epoch, zone) {
    let format = formatters.get(zone);
    if (!format) {
        format = new Intl.DateTimeFormat("en-US", {timeZone: zone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
        formatters.set(zone, format);
    }
    const parts = Object.fromEntries(format.formatToParts(new Date(epoch)).map((part) => [part.type, part.value]));
    return {date: `${parts.year}-${parts.month}-${parts.day}`, minutes: (Number(parts.hour) % 24) * 60 + Number(parts.minute)};
}

/** Whether a time zone name is one this browser knows. */
export function validZone(zone) {
    if (!zone) return false;
    try {
        new Intl.DateTimeFormat("en-US", {timeZone: String(zone)});
        return true;
    } catch {
        return false;
    }
}

/** The person's zone (the browser's), the default of the request's (C293). */
export function personZone() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch { return "UTC"; }
}

function wallAsUtc(date, minutes) {
    return Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10)), Math.floor(minutes / 60), minutes % 60);
}

/** The instant of a wall clock in a zone (the later one in a gap, the earlier one when it repeats). */
export function instantOf(date, minutes, zone) {
    const guess = wallAsUtc(date, minutes);
    if (!validZone(zone)) return guess;
    const offset = (epoch) => {
        const wall = partsIn(epoch, zone);
        return wallAsUtc(wall.date, wall.minutes) - epoch;
    };
    let epoch = guess - offset(guess);
    epoch = guess - offset(epoch);
    return epoch;
}

/** An instant as the wall clock of a zone: {date, minutes}. */
export function wallIn(epoch, zone) {
    if (!validZone(zone)) {
        const date = new Date(epoch);
        return {date: isoDay(date), minutes: date.getUTCHours() * 60 + date.getUTCMinutes()};
    }
    return partsIn(epoch, zone);
}

const VALUE = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/u;

/**
 * A stored value read in the request's zone: {date, minutes, form}. minutes
 * is null for a day without a time. form remembers how the value was written
 * (offset, seconds) so a move writes it back the same way.
 */
export function readValue(value, {zone, sourceZone} = {}) {
    if (value === null || value === undefined || value === "") return null;
    const found = VALUE.exec(String(value).trim());
    if (!found) return null;
    const [, date, hour, minute, second, offset] = found;
    if (hour === undefined) return {date, minutes: null, form: {kind: "date"}};
    const wall = Number(hour) * 60 + Number(minute);
    const form = {kind: "datetime", seconds: second !== undefined, offset: offset ?? null};
    if (offset) {
        const sign = offset === "Z" ? 0 : (offset[0] === "-" ? -1 : 1);
        const digits = offset.replace(/[^\d]/gu, "");
        const shift = offset === "Z" ? 0 : sign * (Number(digits.slice(0, 2)) * 60 + Number(digits.slice(2, 4)));
        const epoch = wallAsUtc(date, wall) - shift * 6e4;
        return {...wallIn(epoch, zone), form};
    }
    const source = validZone(sourceZone) ? sourceZone : zone;
    if (!validZone(zone) || source === zone) return {date, minutes: wall, form};
    return {...wallIn(instantOf(date, wall, source), zone), form, source: {date, minutes: wall, zone: source}};
}

/**
 * A wall clock of the request's zone written in the form a value had: a day
 * (yyyy-mm-dd), a source wall clock (yyyy-mm-ddThh:mm[:ss]) or an instant
 * with the same offset (Z or ±hh:mm).
 */
export function writeValue(date, minutes, form = {kind: "date"}, {zone, sourceZone} = {}) {
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
    const wall = source === zone || !validZone(zone) ? {date, minutes} : wallIn(epoch, source);
    return `${wall.date}T${clockOf(wall.minutes)}${seconds}`;
}

// ── events ───────────────────────────────────────────────────────────────

/** The colour of a choice option (C140): its status or scheme as a colour role, neutral else. */
export function toneOf(option) {
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
export function eventsOf(records, {options, fields = [], zone, titleField = "title"} = {}) {
    const field = (key) => fields.find((entry) => String(entry.key) === String(key)) ?? null;
    const date = field(options.dateField);
    const colour = field(options.colorField);
    const sourceZone = date?.timeZone ?? date?.time_zone ?? null;
    const dateOnly = typeOf(date) === "date";
    const events = [];
    for (const record of Array.isArray(records) ? records : []) {
        const start = readValue(record?.[options.dateField], {zone, sourceZone});
        if (!start) continue;
        const read = options.endField ? readValue(record?.[options.endField], {zone, sourceZone}) : null;
        const allDay = options.allDayField ? Boolean(record?.[options.allDayField]) : (dateOnly || start.minutes === null);
        let end = read && (read.date > start.date || (read.date === start.date && (read.minutes ?? 0) >= (start.minutes ?? 0))) ? read : null;
        if (!allDay && !end) {
            const minutes = (start.minutes ?? options.hours[0]) + options.slot * 2;
            end = {date: start.date, minutes: Math.min(24 * 60, minutes)};
        }
        const startDay = start.date;
        const endDay = end ? (!allDay && end.minutes === 0 && end.date > startDay ? addDays(end.date, -1) : end.date) : startDay;
        const value = record?.[options.colorField];
        const option = (Array.isArray(colour?.options) ? colour.options : []).find((entry) => String(entry.value ?? entry.id) === String(value?.value ?? value));
        const title = record?.[titleField] ?? record?.title ?? record?.name ?? record?.id;
        events.push({
            id: String(record.id),
            record,
            title: text(title),
            allDay,
            bar: allDay || endDay > startDay,
            start: {date: start.date, minutes: allDay ? null : start.minutes},
            end: end ? {date: end.date, minutes: allDay ? null : end.minutes} : {date: startDay, minutes: null},
            first: startDay,
            last: endDay,
            tone: option ? toneOf(option) : "primary",
            label: option ? String(option.label ?? option.value) : (value === undefined || value === null ? "" : text(value)),
            form: start.form,
            endForm: read?.form ?? start.form,
            source: start.source ?? null,
        });
    }
    // Inside a day: the bars first, then by start time, then by title (study 5: no sort).
    events.sort((a, b) => (a.bar === b.bar ? 0 : a.bar ? -1 : 1)
        || (a.first < b.first ? -1 : a.first > b.first ? 1 : 0)
        || ((a.start.minutes ?? -1) - (b.start.minutes ?? -1))
        || a.title.localeCompare(b.title));
    return events;
}

export const onDay = (event, day) => event.first <= day && event.last >= day;

/** The bars of a row of days: lanes, each a list of bars that do not meet. */
export function barLanes(events, days) {
    const first = days[0];
    const last = days[days.length - 1];
    const lanes = [];
    for (const bar of events.filter((event) => event.bar && event.first <= last && event.last >= first)) {
        let index = 0;
        while (lanes[index]?.some((other) => !(other.last < bar.first || other.first > bar.last))) index += 1;
        (lanes[index] ??= []).push(bar);
    }
    return lanes;
}

/** Timed events of one day placed in columns where they meet: {event, column, columns, top, length} in minutes. */
export function placeTimed(events, day) {
    const list = events.filter((event) => !event.bar && event.first === day);
    const start = (event) => event.start.minutes ?? 0;
    const end = (event) => (event.end.date > day ? 24 * 60 : (event.end.minutes ?? start(event) + SLOT));
    const columns = [];
    const placed = list.map((event) => {
        let column = 0;
        while (columns[column]?.some((other) => end(other) > start(event) && start(other) < end(event))) column += 1;
        (columns[column] ??= []).push(event);
        return {event, column};
    });
    return placed.map((entry) => {
        const meeting = placed.filter((other) => end(other.event) > start(entry.event) && start(other.event) < end(entry.event));
        return {...entry, columns: Math.max(...meeting.map((other) => other.column)) + 1, top: start(entry.event), length: Math.max(1, end(entry.event) - start(entry.event))};
    });
}

// ── rules ────────────────────────────────────────────────────────────────

/**
 * Whether a record may go to a day by the host's rules (describe().rules of
 * the date field, study 5) and its right (records[].can.update + reason, CL-7).
 * Known rule codes: past (before today), weekdays {days: [0..6]} and its
 * shorthands sunday .. saturday, min {date}, max {date}, dates {dates: [...]}.
 * A code the calendar does not know is the server's to check on save.
 */
export function moveCheck({record, day, rules = [], today, noRight = ""} = {}) {
    const can = record?.can ?? record?._can;
    if (can && can.update === false) return {ok: false, reason: String(can.reason ?? can.update_reason ?? noRight)};
    if (day === null || day === undefined) return {ok: true};
    const names = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (const rule of Array.isArray(rules) ? rules : []) {
        if (!rule || typeof rule !== "object") continue;
        const code = String(rule.code ?? "");
        const reason = String(rule.reason ?? "");
        if (code === "past" && today && day < today) return {ok: false, reason, code};
        if (names.includes(code) && weekday(day) === names.indexOf(code)) return {ok: false, reason, code};
        if ((code === "weekdays" || code === "weekday") && Array.isArray(rule.days) && rule.days.map((value) => Number(value) % 7).includes(weekday(day))) return {ok: false, reason, code};
        if (code === "min" && rule.date && day < String(rule.date).slice(0, 10)) return {ok: false, reason, code};
        if (code === "max" && rule.date && day > String(rule.date).slice(0, 10)) return {ok: false, reason, code};
        if (code === "dates" && Array.isArray(rule.dates) && rule.dates.map((value) => String(value).slice(0, 10)).includes(day)) return {ok: false, reason, code};
    }
    return {ok: true};
}

/**
 * The patch of a move: the event's start to a day (and a time), its length
 * kept; to null, both fields cleared (the record goes to «Без даты»).
 */
export function movePatch(event, {day, minutes = null, endMinutes = null, options, zone, sourceZone = null, record = null}) {
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
        patch[key] = timed ? writeValue(day, start, {kind: "datetime"}, {zone, sourceZone}) : day;
        if (options.endField) patch[options.endField] = timed ? writeValue(day, Math.min(24 * 60, start + options.slot * 2), {kind: "datetime"}, {zone, sourceZone}) : day;
        return patch;
    }
    const shift = daysBetween(event.first, day);
    if (event.allDay) {
        patch[key] = writeValue(day, null, event.form, {zone, sourceZone});
        if (options.endField) patch[options.endField] = writeValue(addDays(event.last, shift), null, event.endForm, {zone, sourceZone});
        return patch;
    }
    const startMinutes = minutes ?? event.start.minutes ?? options.hours[0];
    const length = (daysBetween(event.start.date, event.end.date) * 24 * 60) + (event.end.minutes ?? 0) - (event.start.minutes ?? 0);
    patch[key] = writeValue(day, startMinutes, event.form, {zone, sourceZone});
    if (options.endField) {
        const total = endMinutes ?? (startMinutes + Math.max(options.slot, length));
        patch[options.endField] = writeValue(addDays(day, Math.floor(total / (24 * 60))), total % (24 * 60), event.endForm, {zone, sourceZone});
    }
    return patch;
}
