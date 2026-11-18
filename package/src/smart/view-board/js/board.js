// The board's reading of its options and of the host's answer, kept apart from
// the element so a unit can hold it without a page (owner decisions C298, C304;
// study ui-control control/research/2026-11-17-board-view, section 5; options
// under layouts.board of the draft simai.view-config/1).
//
// Nothing here draws or asks the host: it reads the options, orders the lanes,
// says whether a move may go, what a lane head counts, and the words of an
// announcement.

// Larena saves its board as `kanban` (DataviewViewType); the view set reads it
// as board (study 5, «Decided by the helper»).
export const LAYOUT_ALIASES = Object.freeze({kanban: "board"});

export const PER_LANE = 20;
export const CARD_FIELDS_MAX = 4;
const LANE_TYPES = new Set(["choice", "status", "select", "enum", "user", "boolean"]);

const list = (value) => (Array.isArray(value) ? value.map((item) => String(item)) : []);
const typeOf = (field) => String(field?.propertyType ?? field?.property_type ?? field?.type ?? "");

/**
 * layouts.board of view-config/1, with its defaults (study 5, the options table).
 * swimlane_field is reserved (C304 (4)): read and kept, never drawn.
 */
export function boardOptions(options = {}, fields = []) {
    const given = options && typeof options === "object" ? options : {};
    const lanes = given.lanes && typeof given.lanes === "object" ? given.lanes : {};
    const laneField = given.lane_field
        ?? fields.find((field) => typeOf(field) === "status")?.key
        ?? fields.find((field) => LANE_TYPES.has(typeOf(field)) && Array.isArray(field.options))?.key
        ?? null;
    const shown = fields.filter((field) => field.key !== laneField && !field.title && field.key !== "title");
    const cardFields = (Array.isArray(given.card_fields) ? list(given.card_fields) : shown.map((field) => String(field.key)))
        .filter((key) => key !== laneField).slice(0, CARD_FIELDS_MAX);
    const perLane = Number.isSafeInteger(given.per_lane) && given.per_lane > 0 ? given.per_lane : PER_LANE;
    const limits = {};
    for (const [lane, limit] of Object.entries(given.limits && typeof given.limits === "object" ? given.limits : {})) {
        if (Number.isSafeInteger(limit) && limit > 0) limits[lane] = limit;
    }
    return {
        laneField: laneField === null ? null : String(laneField),
        lanes: {order: list(lanes.order), hidden: list(lanes.hidden), collapsed: list(lanes.collapsed)},
        emptyLanes: given.empty_lanes === "hide" ? "hide" : "show",
        cardFields,
        totals: Array.isArray(given.totals) ? given.totals : ["count"],
        limits,
        order: given.order === "manual" ? "manual" : "sort",
        perLane,
        swimlaneField: given.swimlane_field ?? null,
    };
}

/**
 * The lanes drawn, in order: the options' order first, then the field's own
 * option order, then a value only the answer knows (a new value joins at the
 * end). Hidden lanes go; empty ones too when empty_lanes is hide.
 */
export function orderLanes({field = null, answered = [], options}) {
    const known = new Map();
    for (const option of Array.isArray(field?.options) ? field.options : []) {
        const value = String(option.value ?? option.id ?? option.key ?? "");
        if (value) known.set(value, {value, label: String(option.label ?? option.title ?? value), scheme: option.scheme ?? null, status: option.status ?? null});
    }
    if (typeOf(field) === "boolean" && !known.size) {
        known.set("true", {value: "true", label: "true"});
        known.set("false", {value: "false", label: "false"});
    }
    const byValue = new Map((Array.isArray(answered) ? answered : []).map((lane) => [String(lane.value), lane]));
    const values = [...new Set([...options.lanes.order, ...known.keys(), ...byValue.keys()])];
    return values
        .filter((value) => !options.lanes.hidden.includes(value))
        .map((value) => {
            const lane = byValue.get(value) ?? {};
            const meta = known.get(value) ?? {};
            const records = Array.isArray(lane.records) ? lane.records : [];
            const total = Number.isSafeInteger(lane.total) && lane.total >= 0 ? lane.total : records.length;
            return {
                value,
                label: String(lane.label ?? meta.label ?? value),
                scheme: lane.scheme ?? meta.scheme ?? null,
                status: lane.status ?? meta.status ?? null,
                total,
                totals: lane.totals && typeof lane.totals === "object" ? lane.totals : {},
                records,
                cursor: lane.cursor ?? null,
                collapsed: options.lanes.collapsed.includes(value),
                limit: options.limits[value] ?? null,
            };
        })
        .filter((lane) => options.emptyLanes === "show" || lane.total > 0);
}

/**
 * Whether a record may go from one lane to another, by the host's rules
 * (study 5: describe().fields.<lane>.moves = {to: {from: [...], reason}}).
 * A soft limit never refuses (C304 (3)).
 */
export function moveCheck(moves, from, to) {
    if (String(from) === String(to)) return {ok: true};
    const rule = moves && typeof moves === "object" ? moves[String(to)] : null;
    if (rule && Array.isArray(rule.from) && !rule.from.map(String).includes(String(from))) {
        return {ok: false, reason: String(rule.reason ?? "")};
    }
    if (rule && rule.allowed === false) return {ok: false, reason: String(rule.reason ?? "")};
    return {ok: true};
}

/** The lane head's count: «5» or, with a limit, «5 / 4» and over (C304 (3)). */
export function laneCount(total, limit) {
    if (!limit) return {text: String(total), over: false};
    return {text: `${total} / ${limit}`, over: total > limit};
}

/**
 * Manual order inside a lane only when the options ask for it, the source has
 * an order field and no sort is on (C304 (2)).
 */
export function manualOrder(options, orderField, sortActive) {
    return options.order === "manual" && Boolean(orderField) && !sortActive;
}

/** Money sums per currency (C294): {amount: {RUB: "1032390.50"}} -> ["1 032 390,50 ₽"]. */
export function laneSums(totals, locale) {
    const lines = [];
    for (const byCurrency of Object.values(totals && typeof totals === "object" ? totals : {})) {
        if (!byCurrency || typeof byCurrency !== "object") continue;
        for (const [currency, amount] of Object.entries(byCurrency)) {
            const number = Number(amount);
            if (!Number.isFinite(number)) continue;
            try {
                lines.push(new Intl.NumberFormat(locale || undefined, {style: "currency", currency}).format(number));
            } catch {
                lines.push(`${number} ${currency}`);
            }
        }
    }
    return lines;
}

/** Fills {name} words. */
export function format(text, values = {}) {
    return String(text ?? "").replace(/\{([a-z]+)\}/gu, (match, key) => (key in values ? String(values[key]) : match));
}

/** The view's layout name read through the aliases; null for none. */
export function layoutName(value) {
    if (value === null || value === undefined || value === "") return null;
    const name = String(value).trim().toLowerCase();
    return LAYOUT_ALIASES[name] ?? name;
}
