import {html, nothing} from "lit";
import "./default.css";
import {barLanes, onDay, placeTimed, weekday} from "../calendar.js";

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
    if (shape === null || shape === undefined || shape === false) return nothing;
    if (typeof shape === "string" || typeof shape === "number") return String(shape);
    if (Array.isArray(shape)) return html`<span class="sf-view-calendar__values">${shape.map((item) => renderShape(item, owner))}</span>`;
    if (shape._$litType$ !== undefined) return shape;
    if (shape.component?.type) {
        const {component, props: own, ...meta} = shape;
        return owner.renderSmartElement(component.type, {...meta, ...(own ?? {}), ...(component.props ?? {})});
    }
    if (shape.text !== undefined) return String(shape.text);
    return nothing;
}

const tone = (event) => `--sf-view-calendar-tone: var(--sf-${event.tone}); --sf-view-calendar-tone-container: var(--sf-${event.tone}-container); --sf-view-calendar-on-tone: var(--sf-on-${event.tone}-container)`;

function eventAttributes(context, event) {
    return {
        pending: context.pending.has(event.id),
        open: context.current === event.id,
        readOnly: Boolean(context.component.readOnly(event.record)),
    };
}

// A timed event in a month day: dot, time, title.
function renderChip(context, event) {
    const component = context.component;
    const state = eventAttributes(context, event);
    return html`<button type="button" class="sf-view-calendar__ev" data-ev=${event.id} tabindex="-1" style=${tone(event)}
            ?data-pending=${state.pending} ?data-open=${state.open} ?data-ro=${state.readOnly}
            aria-label=${component.eventLabel(event)} title=${component.eventTip(event)}>
        <span class="sf-view-calendar__dot" aria-hidden="true"></span>
        <span class="sf-view-calendar__time">${component.time(event.start.minutes)}</span>
        <span class="sf-view-calendar__name">${event.title}</span>
    </button>`;
}

// A piece of a bar in one day: the first piece of a week row carries the title.
function renderBar(context, event, day, days) {
    const component = context.component;
    const state = eventAttributes(context, event);
    const first = event.first === day || day === days[0];
    const last = event.last === day || day === days[days.length - 1];
    return html`<button type="button" class="sf-view-calendar__bar-piece" data-ev=${event.id} tabindex="-1" style=${tone(event)}
            ?data-first=${first} ?data-last=${last} aria-hidden=${first ? "false" : "true"}
            ?data-pending=${state.pending} ?data-open=${state.open} ?data-ro=${state.readOnly}
            aria-label=${component.eventLabel(event)} title=${component.eventTip(event)}>${first ? event.title : " "}</button>`;
}

function renderAdd(context, day, minutes = null) {
    if (!context.creatable) return nothing;
    const component = context.component;
    return html`<span class="sf-view-calendar__add"><sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="add"
            data-add=${day} data-time=${minutes === null ? nothing : String(minutes)} tabindex="-1"
            aria-label=${component.word("add-text", {day: component.dayOn(day)})} tooltip=${component.word("add-short-text")}></sf-button-icon></span>`;
}

function dayFlags(context, day) {
    return {
        today: day === context.today,
        off: context.weekend.includes(weekday(day)),
    };
}

// ── month ────────────────────────────────────────────────────────────────

function renderMonth(context) {
    const component = context.component;
    const {days} = context.range;
    const width = days.length >= 35 ? days.length / 6 : 7;
    const weeks = Array.from({length: Math.ceil(days.length / width)}, (_, index) => days.slice(index * width, index * width + width));
    const month = component.anchor.slice(0, 7);
    const compact = context.phone;
    // CL-6: where the pair's sf-input-date carries day marks, the phone's
    // month is that panel (no field) with a mark per event day.
    if (compact && context.inputDateMarks) {
        const marks = (day) => {
            const list = context.events.filter((event) => onDay(event, day));
            return list.length ? {count: list.length, tone: list[0].tone, label: component.eventsCount(list.length)} : null;
        };
        return html`<div class="sf-view-calendar__month-wrap">
            <sf-input-date class="sf-view-calendar__phone-month" input="false" size=${context.size} date=${context.picked}
                           week-start=${String(component.weekStart)} locale=${component.locale} .dayMarks=${marks}></sf-input-date>
            <div class="sf-view-calendar__list" data-picked-list>${renderDayList(context, context.picked, true)}</div>
        </div>`;
    }
    return html`
        <div class="sf-view-calendar__month-wrap" style=${`--sf-view-calendar-columns: ${width}`}>
            <div class="sf-view-calendar__weekdays" aria-hidden="true">
                ${weeks[0].map((day) => html`<span>${component.cap(component.format(day, {weekday: "short"}))}</span>`)}
            </div>
            <div class="sf-view-calendar__month" role="grid" ?data-compact=${compact}
                 aria-label=${`${context.label}, ${component.monthTitle(component.anchor).toLocaleLowerCase(component.locale)}`}>
                ${weeks.map((week) => {
                    const lanes = barLanes(context.events, week);
                    return html`<div class="sf-view-calendar__week" role="row">
                        ${week.map((day) => renderMonthDay(context, day, week, lanes, month, compact))}
                    </div>`;
                })}
            </div>
            ${compact ? html`<div class="sf-view-calendar__list" data-picked-list>${renderDayList(context, context.picked, true)}</div>` : nothing}
        </div>`;
}

function renderMonthDay(context, day, week, lanes, month, compact) {
    const component = context.component;
    const list = context.events.filter((event) => onDay(event, day));
    const flags = dayFlags(context, day);
    const out = day.slice(0, 7) !== month;
    const cell = (content) => html`<div class="sf-view-calendar__day" role="gridcell" data-day=${day} data-drop
            tabindex=${day === context.focus ? "0" : "-1"} ?data-out=${out} ?data-today=${flags.today} ?data-off=${flags.off}
            ?data-picked=${compact && day === context.picked} aria-selected=${compact && day === context.picked ? "true" : nothing}
            aria-label=${component.dayLabel(day, list.length)}>${content}</div>`;
    const number = html`<span class="sf-view-calendar__n" aria-hidden="true">${Number(day.slice(8))}</span>`;
    if (compact) {
        return cell(html`<div class="sf-view-calendar__nrow">${number}</div>
            <div class="sf-view-calendar__dots" aria-hidden="true">${list.slice(0, 3).map((event) => html`<span style=${tone(event)}></span>`)}</div>`);
    }
    const perDay = context.options.perDay;
    const pieces = [];
    let used = 0;
    for (const lane of lanes) {
        if (used >= perDay) break;
        const bar = lane.find((event) => onDay(event, day));
        pieces.push(bar ? renderBar(context, bar, day, week) : html`<div class="sf-view-calendar__gap" aria-hidden="true"></div>`);
        used += 1;
    }
    const hiddenBars = lanes.slice(used).filter((lane) => lane.some((event) => onDay(event, day))).length;
    const timed = list.filter((event) => !event.bar);
    const room = Math.max(0, perDay - used);
    const overflow = timed.length + hiddenBars > room;
    const shown = overflow ? timed.slice(0, Math.max(0, room - 1)) : timed;
    const rest = timed.length - shown.length + hiddenBars;
    return cell(html`
        <div class="sf-view-calendar__nrow">${number}${renderAdd(context, day)}</div>
        ${pieces}
        ${shown.map((event) => renderChip(context, event))}
        ${rest > 0 ? html`<span class="sf-view-calendar__more"><sf-button size=${context.size} appearance="ghost" scheme="on-surface-variant"
                text=${component.word("more-text", {count: rest})} data-more=${day} tabindex="-1"
                aria-label=${component.word("more-label", {count: rest, day: component.dayName(day)})}></sf-button></span>` : nothing}`);
}

// ── week and day ─────────────────────────────────────────────────────────

function renderTime(context) {
    const component = context.component;
    const {days} = context.range;
    const [from, to] = context.options.hours;
    const hours = [];
    for (let minutes = from; minutes < to; minutes += 60) hours.push(minutes);
    const lanes = barLanes(context.events, days);
    const style = `--sf-view-calendar-days: ${days.length}; --sf-view-calendar-hours: ${hours.length}`;
    const now = context.now;
    const label = days.length > 1 ? `${component.dayName(days[0])} – ${component.dayName(days[days.length - 1])}` : component.dayName(days[0]);
    return html`
        <div class="sf-view-calendar__time-wrap" style=${style}>
            <div class="sf-view-calendar__tg sf-view-calendar__tg-head">
                <div class="sf-view-calendar__gut" aria-hidden="true"></div>
                ${days.map((day) => html`<div class="sf-view-calendar__tgh" ?data-today=${day === context.today} ?data-off=${dayFlags(context, day).off}>
                    <span aria-hidden="true">${component.cap(component.format(day, {weekday: "short"}))}</span><b aria-hidden="true">${Number(day.slice(8))}</b>
                    ${renderAdd(context, day)}
                </div>`)}
            </div>
            <div class="sf-view-calendar__tg sf-view-calendar__allday">
                <div class="sf-view-calendar__gut">${component.word("all-day-text")}</div>
                ${days.map((day) => html`<div class="sf-view-calendar__ad">
                    ${lanes.map((lane) => {
                        const bar = lane.find((event) => onDay(event, day));
                        return bar ? renderBar(context, bar, day, days) : html`<div class="sf-view-calendar__gap" aria-hidden="true"></div>`;
                    })}
                </div>`)}
            </div>
            <div class="sf-view-calendar__scroll">
                <div class="sf-view-calendar__hours" role="grid" aria-label=${`${context.label}, ${label}`}>
                    <div class="sf-view-calendar__gutter" aria-hidden="true">
                        ${hours.map((minutes) => html`<div class="sf-view-calendar__hour">${minutes === from ? "" : component.time(minutes)}</div>`)}
                    </div>
                    <div class="sf-view-calendar__cols" role="row">
                        ${days.map((day) => renderColumn(context, day, from, to, now))}
                    </div>
                </div>
            </div>
            ${context.events.some((event) => days.includes(event.first) || days.some((day) => onDay(event, day)))
                ? nothing : html`<div class="sf-view-calendar__empty">${component.word("empty-text")}</div>`}
        </div>`;
}

function renderColumn(context, day, from, to, now) {
    const component = context.component;
    const placed = placeTimed(context.events, day);
    const span = to - from;
    const position = (minutes) => `calc(${(Math.max(0, minutes - from) / 60)} * var(--sf-view-calendar-hour))`;
    return html`<div class="sf-view-calendar__col" role="gridcell" data-day=${day} data-drop tabindex=${day === context.focus ? "0" : "-1"}
            ?data-today=${day === context.today} aria-label=${component.dayLabel(day, placed.length)}>
        ${day === now.date && now.minutes >= from && now.minutes < to
            ? html`<div class="sf-view-calendar__now" aria-hidden="true" style=${`inset-block-start: ${position(now.minutes)}`}></div>` : nothing}
        ${placed.filter(({event}) => (event.start.minutes ?? 0) < to).map(({event, column, columns, top, length}) => {
            const state = eventAttributes(context, event);
            const start = Math.max(from, top);
            const end = Math.min(to, top + length);
            const tall = end - start >= 60;
            return html`<button type="button" class="sf-view-calendar__block" data-ev=${event.id} tabindex="-1" style=${`${tone(event)}; inset-block-start: ${position(start)}; block-size: calc(${Math.max(context.options.slot, end - start) / 60} * var(--sf-view-calendar-hour)); inset-inline-start: calc(${(column / columns) * 100}% + var(--sf-px)); inline-size: calc(${100 / columns}% - 2 * var(--sf-px))`}
                    ?data-pending=${state.pending} ?data-open=${state.open} ?data-ro=${state.readOnly}
                    aria-label=${component.eventLabel(event)} title=${component.eventTip(event)}>
                <span class="sf-view-calendar__name">${event.title}</span>
                ${tall ? html`<span class="sf-view-calendar__time">${component.timeOf(event)}</span>` : nothing}
                ${state.readOnly || !context.movable || !context.options.endField ? nothing : html`<span class="sf-view-calendar__rs" data-rs=${event.id} aria-hidden="true"></span>`}
            </button>`;
        })}
        ${span <= 0 ? nothing : nothing}
    </div>`;
}

// ── list ─────────────────────────────────────────────────────────────────

function renderRow(context, event) {
    const component = context.component;
    const state = eventAttributes(context, event);
    const selected = context.selected.has(event.id);
    const boxed = context.selectable && context.mode === "list";
    return html`<div class="sf-view-calendar__row" data-id=${event.id} data-ev=${event.id} tabindex="-1" role="listitem" style=${tone(event)}
            ?data-pending=${state.pending} ?data-open=${state.open} ?data-selected=${selected} ?data-boxed=${boxed}
            aria-label=${component.eventLabel(event)} title=${component.eventTip(event)}>
        ${boxed ? html`<span class="sf-view-calendar__box"><sf-checkbox size=${context.size} data-box=${event.id} ?checked=${selected} tabindex="-1"
                aria-label=${component.word("select-text", {title: event.title})}></sf-checkbox></span>` : nothing}
        <span class="sf-view-calendar__time"><span class="sf-view-calendar__dot" aria-hidden="true"></span>${component.timeOf(event)}</span>
        <span class="sf-view-calendar__name">${event.title}</span>
        ${component.eventFieldList.map((field) => html`<span class="sf-view-calendar__field" data-key=${String(field.key)} data-align=${component.fieldAlign(field)}>${renderShape(component.cellShape(field, event.record), component)}</span>`)}
    </div>`;
}

function renderDayList(context, day, always = false) {
    const component = context.component;
    const list = context.events.filter((event) => onDay(event, day));
    if (!list.length && !always) return nothing;
    return html`<div class="sf-view-calendar__lday" role="list" aria-label=${component.cap(component.dayName(day))}>
        <div class="sf-view-calendar__lday-h" ?data-today=${day === context.today}>${component.cap(component.dayName(day))}${day === context.today ? ` · ${component.word("today-mark")}` : ""}</div>
        ${list.length ? list.map((event) => renderRow(context, event)) : html`<div class="sf-view-calendar__note">${component.word("day-empty-text")}</div>`}
    </div>`;
}

function renderList(context) {
    const component = context.component;
    const days = context.range.days.filter((day) => context.events.some((event) => onDay(event, day)));
    return html`<div class="sf-view-calendar__list" aria-label=${`${context.label}, ${component.monthTitle(component.anchor).toLocaleLowerCase(component.locale)}`}>
        ${days.length ? days.map((day) => renderDayList(context, day)) : html`<div class="sf-view-calendar__empty">${component.word("empty-text")}</div>`}
    </div>`;
}

// ── undated, selection, the pick window ──────────────────────────────────

function renderUndated(context) {
    const component = context.component;
    return html`<aside class="sf-view-calendar__und" data-und aria-label=${component.word("undated-label")}>
        <div class="sf-view-calendar__und-h">
            <span>${component.word("undated-head-text", {count: context.undatedTotal})}</span>
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="close" data-undclose
                            aria-label=${component.word("undated-close-text")} tooltip=${component.word("close-text")}></sf-button-icon>
        </div>
        <div class="sf-view-calendar__note">${component.word(context.undated.length ? "undated-hint" : "undated-empty-text")}</div>
        ${context.undated.map((record) => {
            const id = String(record.id);
            const readOnly = component.readOnly(record);
            const field = component.eventFieldList[0];
            return html`<button type="button" class="sf-view-calendar__ev sf-view-calendar__und-ev" data-ev=${id}
                    ?data-pending=${context.pending.has(id)} ?data-ro=${Boolean(readOnly)}
                    aria-label=${`${component.recordTitle(record)}, ${component.word("undated-label").toLocaleLowerCase(component.locale)}`}>
                <span class="sf-view-calendar__name">${component.recordTitle(record)}</span>
                ${field && record[field.key] !== undefined && record[field.key] !== null
                    ? html`<span class="sf-view-calendar__sub">${typeof record[field.key] === "object" ? (record[field.key].label ?? "") : String(record[field.key])}</span>` : nothing}
            </button>`;
        })}
    </aside>`;
}

function renderBulk(context) {
    const component = context.component;
    const count = context.selected.size;
    if (context.bulkActions) {
        return html`<sf-bulk-actions class="sf-view-calendar__bulk-bar" size=${context.size} place="dock" count=${count}
                                     .actions=${context.actions}></sf-bulk-actions>`;
    }
    return html`
        <div class="sf-view-calendar__bulk" role="region" aria-label=${component.word("bulk-label")}>
            <span class="sf-view-calendar__note">${component.word("selected-text", {count})}</span>
            ${context.actions.map((action) => html`<sf-button size=${context.size} appearance="outline" scheme="on-surface"
                    icon=${action.icon || nothing} text=${action.text} data-bulk=${action.id}></sf-button>`)}
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="close"
                            data-clear aria-label=${component.word("clear-selection-text")} tooltip=${component.word("clear-selection-text")}></sf-button-icon>
        </div>`;
}

function renderPick(context) {
    const component = context.component;
    const pick = context.pick;
    return html`<div class="sf-view-calendar__pick" role="dialog" aria-label=${component.word("pick-label", {title: pick.title})}
            style=${`inset-block-start: ${pick.top}px`}>
        <div class="sf-view-calendar__und-h">
            <span>${component.word("pick-label", {title: pick.title})}</span>
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="close" data-pickclose
                            aria-label=${component.word("close-text")} tooltip=${component.word("close-text")}></sf-button-icon>
        </div>
        <sf-input-date input="false" size=${context.size} date=${pick.day} week-start=${String(component.weekStart)}
                       min-date=${pick.minDate || nothing} locale=${component.locale}></sf-input-date>
    </div>`;
}

// ── the bar and the whole ────────────────────────────────────────────────

function renderBar_(context) {
    const component = context.component;
    const modes = context.modes.map((mode) => ({value: mode, label: component.word(`mode-${mode === "week" && context.phone ? "three" : mode}`)}));
    const undated = context.options.undated !== "none" && !context.phone;
    return html`<div class="sf-view-calendar__bar">
        <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="chevron_left" data-page="-1"
                        aria-label=${component.word("previous-text")} tooltip=${component.word("previous-text")}></sf-button-icon>
        <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="chevron_right" data-page="1"
                        aria-label=${component.word("next-text")} tooltip=${component.word("next-text")}></sf-button-icon>
        <span class="sf-view-calendar__title" aria-live="polite">${component.periodTitle}</span>
        <sf-button size=${context.size} appearance="outline" scheme="on-surface" text=${component.word("today-text")} data-today></sf-button>
        ${modes.length > 1 ? html`<sf-segmented class="sf-view-calendar__modes" size=${context.size} aria-label=${component.word("modes-label")}
                items=${JSON.stringify(modes)} value=${context.mode}></sf-segmented>` : nothing}
        ${undated ? html`<sf-button size=${context.size} appearance="ghost" scheme="on-surface" icon="event_busy" data-undtoggle
                text=${component.word("undated-text", {count: context.undatedTotal})} aria-pressed=${context.undatedOpen ? "true" : "false"}></sf-button>` : nothing}
    </div>`;
}

export function renderViewCalendarTemplate(context) {
    const mode = context.mode;
    const body = mode === "month" ? renderMonth(context) : mode === "list" ? renderList(context) : renderTime(context);
    const selecting = context.selectable && mode === "list" && (context.selected.size > 0);
    return html`
        <div class="sf-view-calendar" data-size=${context.size} data-mode=${mode} ?data-phone=${context.phone}
             ?data-dragging=${context.dragging} role="region" aria-label=${context.label}>
            ${renderBar_(context)}
            ${context.truncated ? html`<div class="sf-view-calendar__note" data-truncated>${context.component.word("truncated-text")}</div>` : nothing}
            <div class="sf-view-calendar__body">
                <div class="sf-view-calendar__main">${body}</div>
                ${context.undatedOpen ? renderUndated(context) : nothing}
            </div>
            ${selecting ? renderBulk(context) : nothing}
            ${context.pick ? renderPick(context) : nothing}
            <div class="sf-view-calendar__live" role="status" aria-live="polite">${context.message}</div>
        </div>`;
}
