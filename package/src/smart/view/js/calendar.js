// sf-view's side of the calendar layout (layout="calendar", sf-view-calendar;
// owner decision C307; study ui-control control/research/2026-11-18-calendar-view,
// section 5). Kept apart from index.js so the view's own file only names the
// layout and calls in here at the same points the board uses.
//
// The query of a calendar carries the days on screen, window {range: [from,
// to), date_field, end_field}, and the request's context {timeZone, weekStart,
// locale} (C293); the host answers the records of those days (up to 1000,
// truncated past them). The undated records are a query of their own,
// window {undated: date_field, page, per_page}, asked after the first one. A
// move is record.set of the date field with the whole patch; the host's
// answer settles it on the calendar.

export const CALENDAR_EVENTS = Object.freeze([
    "sf-view-calendar-move", "sf-view-calendar-open", "sf-view-calendar-create", "sf-view-calendar-range",
    "sf-view-calendar-save", "sf-view-calendar-apply",
]);

const copy = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
const UNDATED_PAGE = 50;

export function calendarOf(view) {
    const slot = view.shadowRoot?.querySelector?.('slot[name="content"]');
    return slot?.assignedElements?.().find((element) => element.localName === "sf-view-calendar")
        ?? view.querySelector?.(':scope > sf-view-calendar[slot="content"]') ?? null;
}

// layouts.calendar as the host's view answers it, else as the page gave it.
function calendarOptionsOf(view) {
    const fromPage = calendarOf(view)?.options;
    return {...(fromPage && typeof fromPage === "object" ? fromPage : {}), ...(view._calendarHostOptions ?? {})};
}

// The window before the calendar has drawn (its code comes after the view's):
// the month around today, Monday first unless the page says otherwise.
function defaultWindow(view) {
    const options = calendarOptionsOf(view);
    const fields = view.columns ?? [];
    const dateField = options.date_field ?? fields.find((field) => ["date", "datetime"].includes(String(field.propertyType ?? field.property_type ?? field.type ?? "")))?.key ?? null;
    const today = new Date();
    const first = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));
    const start = Number(view.getAttribute?.("week-start") ?? 1) % 7;
    const from = new Date(first);
    from.setUTCDate(first.getUTCDate() - ((first.getUTCDay() - start + 7) % 7));
    const to = new Date(from);
    to.setUTCDate(from.getUTCDate() + 42);
    const iso = (date) => date.toISOString().slice(0, 10);
    return {range: [iso(from), iso(to)], date_field: dateField, ...(options.end_field ? {end_field: options.end_field} : {})};
}

function contextOf(view) {
    const calendar = calendarOf(view);
    if (calendar && typeof calendar.context === "object" && calendar.context) return copy(calendar.context);
    const given = view._calendarContext ?? {};
    let zone = "UTC";
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch { /* UTC */ }
    return {timeZone: given.timeZone ?? zone, ...(Number.isInteger(given.weekStart) ? {weekStart: given.weekStart} : {}), locale: view.closest?.("[lang]")?.getAttribute("lang") || globalThis.document?.documentElement?.lang || "ru"};
}

/** The calendar's query: the view's, with the date window and the request's context. */
export function calendarQuery(view, query, extra = null) {
    const calendar = calendarOf(view);
    const window = calendar && typeof calendar.window === "object" && calendar.window?.date_field ? copy(calendar.window) : defaultWindow(view);
    // Before the first answer the date field may be unknown (no layouts.calendar
    // on the page, no date column yet): the range query would name no field
    // and the host would have to guess it (VCL-2). The first query then goes
    // as the page printed it, without a window -- the early call the page
    // started is taken as is -- and its answer brings layouts.calendar; the
    // range query follows at once with the field from it. Only the first
    // query: a host that names no date field at all gets the range as before.
    if (!window.date_field && !extra && !view._calendarAsked) {
        view._calendarAsked = true;
        view._calendarBare = true;
        return query;
    }
    view._calendarAsked = true;
    view._calendarBare = false;
    query.window = {...window, ...(extra ?? {})};
    query.context = contextOf(view);
    delete query.page;
    delete query.per_page;
    return query;
}

/** The calendar's part of an answer: layouts.calendar, the rules of the date field, the request's context, the records. */
export function acceptCalendar(view, data) {
    if (view.layoutKind !== "calendar") return;
    const layouts = data.view_config?.layouts ?? data.layouts;
    if (layouts?.calendar && typeof layouts.calendar === "object") view._calendarHostOptions = copy(layouts.calendar);
    if (data.context && typeof data.context === "object") view._calendarContext = copy(data.context);
    if (data.rules && typeof data.rules === "object") {
        const dateField = calendarOptionsOf(view).date_field;
        const rules = Array.isArray(data.rules) ? data.rules : data.rules[dateField];
        if (Array.isArray(rules)) view._calendarRules = copy(rules);
    }
    if (view._calendarBare) {
        // The answer to the first query, asked without a window (VCL-2): its
        // records are not the days on screen. It gave layouts.calendar and the
        // columns; the range query goes next with the date field.
        view._calendarBare = false;
        view._calendarRangeWanted = true;
        return false;
    }
    if (view._calendarUndatedAsk) {
        // The answer to the undated query: the column's records and their count.
        view._calendarUndatedAsk = false;
        view._calendarUndated = Array.isArray(data.records) ? copy(data.records) : [];
        view._calendarUndatedTotal = Number.isSafeInteger(data.total) ? data.total : view._calendarUndated.length;
        view._calendarUndatedFresh = true;
        return true;
    }
    if (Array.isArray(data.records)) {
        view._calendarRecords = copy(data.records);
        view._calendarTruncated = data.truncated === true;
        view._calendarFresh = true;
        view._calendarUndatedWanted = true;
    }
    return false;
}

/** The view's state given to the calendar after each answer. */
export function syncCalendar(view) {
    const calendar = calendarOf(view);
    if (!calendar || view.layoutKind !== "calendar") return;
    if (view._calendarRangeWanted) {
        // The range is the calendar's own window (its mode, day and week
        // start) once its code is in; a calendar that never comes gets the
        // month around today after the first paint's wait.
        view._calendarRangeWanted = false;
        const ask = () => { if (view.isConnected && view.layoutKind === "calendar") view.refresh?.("calendar-range"); };
        const registry = globalThis.customElements;
        if (typeof registry?.whenDefined !== "function" || registry.get("sf-view-calendar")) globalThis.queueMicrotask(ask);
        else Promise.race([registry.whenDefined("sf-view-calendar"), new Promise((done) => globalThis.setTimeout(done, 3000))]).catch(() => {}).then(ask);
    }
    calendar.fields = view.columns ?? [];
    if (view._calendarHostOptions) calendar.options = {...(calendar.options ?? {}), ...view._calendarHostOptions};
    if (view._calendarRules) calendar.rules = view._calendarRules;
    const context = view._calendarContext;
    if (context?.timeZone && calendar.getAttribute("time-zone") !== context.timeZone) calendar.setAttribute("time-zone", String(context.timeZone));
    if (Number.isInteger(context?.weekStart)) calendar.setAttribute("week-start", String(context.weekStart));
    if (view._calendarFresh) {
        view._calendarFresh = false;
        calendar.records = view._calendarRecords ?? [];
        calendar.toggleAttribute("truncated", view._calendarTruncated === true);
    }
    if (view._calendarUndatedFresh) {
        view._calendarUndatedFresh = false;
        calendar.undated = view._calendarUndated ?? [];
        calendar.setAttribute("undated-total", String(view._calendarUndatedTotal ?? 0));
    }
    const refused = view._queryRefused === true;
    calendar.setAttribute("selectable", view.renders("select") && !refused ? "true" : "false");
    calendar.setAttribute("creatable", view.hostOffers("create-record") && !refused ? "true" : "false");
    calendar.setAttribute("movable", view.hostOffers("inline-edit") && !refused ? "true" : "false");
    if (view._current !== undefined) calendar.current = view._current;
    if (view.controlSize) calendar.setAttribute("size", view.controlSize);
    if (!calendar.hasAttribute("aria-label") && view.getAttribute("aria-label")) calendar.setAttribute("aria-label", view.getAttribute("aria-label"));
    if (view._calendarUndatedWanted) {
        view._calendarUndatedWanted = false;
        askUndated(view, view.sequence, calendar);
    }
}

// The undated records, a query of their own after the records of the days.
async function askUndated(view, sequence, calendar) {
    const options = calendarOptionsOf(view);
    if (options.undated === "none" || !view.hostPort) return;
    const dateField = calendar.window?.date_field ?? options.date_field;
    if (!dateField) return;
    const query = copy(view.query);
    delete query.page;
    delete query.per_page;
    query.window = {undated: dateField, page: 1, per_page: UNDATED_PAGE};
    query.context = contextOf(view);
    let answer = null;
    try {
        answer = await view.hostPort.raise("query.change", copy({sequence, reason: "undated", query}), {signal: view._controller?.signal});
    } catch {
        answer = null;
    }
    if (!view.isConnected || sequence !== view.sequence || calendar !== calendarOf(view)) return;
    if (answer?.answer !== "applied" || !answer.data) return;
    view._calendarUndatedAsk = true;
    acceptCalendar(view, answer.data);
    syncCalendar(view);
}

/** The order of records for the record card's steps (C305 (4)): by day and time. */
export function calendarOrder(view) {
    const calendar = calendarOf(view);
    return (calendar?.events ?? []).map((event) => event.record);
}

/** The calendar's events answered through the port. */
export async function onCalendarEvent(view, event) {
    const calendar = event.target?.closest?.("sf-view-calendar");
    if (!calendar || calendar !== calendarOf(view)) return;
    const detail = event.detail ?? {};
    if (event.type === "sf-view-calendar-move") {
        const options = calendarOptionsOf(view);
        const key = options.date_field ?? Object.keys(detail.patch ?? {})[0];
        const answer = await view._raise("record.set", {
            record_id: detail.id, key, value: detail.patch?.[key] ?? null, patch: copy(detail.patch ?? {}), revision: detail.revision ?? null,
        });
        const record = answer?.data?.records?.find?.((entry) => String(entry.id) === String(detail.id));
        const message = answer?.message ?? answer?.data?.message ?? "";
        calendar.settleMove(detail.id, answer?.answer === "applied"
            ? {answer: "applied", ...(record ? {record} : {})}
            : {answer: answer?.answer ?? "refused", reason: answer?.reason ?? "", message: typeof message === "string" ? message : ""});
        return;
    }
    if (event.type === "sf-view-calendar-range") {
        await view.refresh?.("calendar-range");
        return;
    }
    if (event.type === "sf-view-calendar-open") {
        await view._openRecord(detail.id, {action_id: "view", record_ids: [detail.id], record_id: detail.id});
        return;
    }
    if (event.type === "sf-view-calendar-create") {
        const value = detail.time ? `${detail.date}T${detail.time}` : detail.date;
        await view._raise("view.create_record", {item: null, values: {[detail.field ?? calendarOptionsOf(view).date_field]: value}});
        return;
    }
    if (event.type === "sf-view-calendar-apply") {
        await view._action({action_id: detail.action, record_ids: detail.ids ?? []}, {selectedBulk: true});
    }
}

/** The calendar's first paint (CL-2): its bar and the month grid of six weeks, the size the calendar draws. */
export function calendarSkeleton() {
    const bar = '<i class="sf-skeleton-text"></i>';
    const control = '<i class="sf-skeleton-text" data-control></i>';
    const week = `<div>${"<span><i class=\"sf-skeleton-text\"></i></span>".repeat(7)}</div>`;
    return '<div class="sf-data-view-skeleton-calendar">'
        + `<div data-part="bar">${control}${control}${bar}${control}${control}</div>`
        + `<div data-part="weekdays">${"<span><i class=\"sf-skeleton-text\"></i></span>".repeat(7)}</div>`
        + `<div data-part="month">${week.repeat(6)}</div>`
        + "</div>";
}
