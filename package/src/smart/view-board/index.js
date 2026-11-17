// sf-view-board: the board layout of the view set (kanban; owner decisions
// C298, C304). Lanes are the values of one field, cards are records, a move
// is a change of that field the host saves. Study and accepted page:
// ui-control control/research/2026-11-17-board-view, ui-doc.test/proto/board-view-study.html.
//
// The board owns no data. sf-view (layout="board") asks the host for the lane
// window -- the first per_lane records of every lane and the totals of all
// lanes in one query (C304) -- and gives the answer here; a move, «Показать
// ещё», opening a record, creating one in a lane, a selection and a lane folded
// or hidden are events sf-view (or any host) answers. A move shows at once and
// the card stays pale until the host settles it (settleMove); a refusal puts it
// back and says why.
//
// Framework parts: drag, long press, the drop line and the announcements are
// sf-sortable's (C171); the card is .sf-card; the fields in the «Кратко» place
// are the Framework field renderers' cell output (C300 (2), C302); menus are
// SF.menu.open; the selection bar is sf-bulk-actions (C295) where the pair has
// it; a refusal is a sf-toast. sf-sortable 1.7 (BV-6..BV-8: one Tab stop per
// list, the host's veto sf-sortable-check, Enter picks up and Space selects)
// is used where the pair has it; before it the board keeps the same keys itself.
import SfBaseElement from "../../core/js/smart-base";
import {applied, elementFromManifest, refused} from "../../core/js/element-manifest";
import {renderCellField} from "../field-renderers/index.js";
import {renderViewBoardTemplate} from "./js/templates/default.js";
import {boardOptions, format, laneCount, laneSums, manualOrder, moveCheck, orderLanes} from "./js/board.js";
import manifest from "./component.json";
import en from "./lang/en.json";
import ru from "./lang/ru.json";

const BoardElement = elementFromManifest(manifest, {
    base: SfBaseElement,
    lang: {en, ru},
    source: "ru",
});

const ITEM = "[data-sf-sortable-item]";
const PHONE_BELOW = 600;
const NUMERIC = new Set(["integer", "number", "decimal", "money", "percent", "date", "datetime", "time", "duration"]);
let boards = 0;

const copy = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
const own = (element, name) => Object.prototype.hasOwnProperty.call(element, name);

// Whether the pair's sf-sortable is 1.7 or newer (BV-6..BV-8): its lists keep
// one Tab stop themselves and ask the host before a move (sf-sortable-check).
function sortableRoves() {
    return typeof globalThis.customElements?.get?.("sf-sortable")?.prototype?.syncRoving === "function";
}

// Whether the pair carries sf-bulk-actions (C295): defined, or a rule the
// Loader can fetch.
function bulkActionsAvailable() {
    return Boolean(globalThis.customElements?.get?.("sf-bulk-actions") || globalThis.SF?.RuleLoader?.["cl-bulk-actions"]);
}

class SfViewBoard extends BoardElement {
    static get props() {
        return {
            ...super.props,
            templateName: {attribute: "template", default: "default"},
        };
    }

    constructor() {
        super();
        // Set as properties (the usual case: a host has objects) or, in
        // markup, as the attributes' JSON; read once from there.
        this._answered = null;
        this._fields = null;
        this._options = null;
        this._moves = null;
        this._actions = [];
        this._selected = new Set();
        // id -> {from, to, index, record}: a move shown and not yet settled.
        this._pending = new Map();
        // Lanes the person folded or unfolded here, over the options.
        this._folded = new Map();
        this._hidden = new Set();
        this._loading = new Set();
        this._refusals = new Map();
        this._held = null;
        this._message = "";
        this._phone = false;
        this._phoneIndex = 0;
        this._active = null;
        this._uid = `sf-view-board-${++boards}`;
        for (const name of ["lanes", "fields", "options", "moves", "actions", "selected"]) {
            if (!own(this, name)) continue;
            const early = this[name];
            delete this[name];
            this[name] = early;
        }
    }

    // ── data ───────────────────────────────────────────────────────────────

    /** The host's lanes: [{value, label?, total, totals, records, cursor}] (the lane window, C304). */
    get lanes() { return this._lanesData(); }

    _lanesData() {
        if (this._answered === null) this._answered = copy(this._json("lanes", [], Array.isArray));
        return this._answered;
    }

    _json(name, fallback, valid) {
        const value = this.parseJsonAttribute(name, fallback);
        return valid(value) ? value : fallback;
    }

    set lanes(value) {
        this._answered = Array.isArray(value) ? copy(value) : [];
        // A move still on its way keeps its card where it was put.
        for (const [id, move] of this._pending) this._place(id, move.from, move.to, move.index, {count: false});
        this.requestComponentUpdate("lanes");
    }

    /** The field descriptors (sf-view's columns): the lane field and the card fields. */
    get fields() {
        if (this._fields === null) this._fields = this._json("fields", [], Array.isArray);
        return this._fields;
    }

    set fields(value) {
        this._fields = Array.isArray(value) ? value.map((field) => ({...field})) : [];
        this.requestComponentUpdate("fields");
    }

    /** layouts.board of simai.view-config/1 (lane_field, lanes, empty_lanes, card_fields, totals, limits, order, per_lane, swimlane_field). */
    get options() {
        if (this._options === null) this._options = this._json("options", {}, (value) => value && typeof value === "object" && !Array.isArray(value));
        return this._options;
    }

    set options(value) {
        this._options = value && typeof value === "object" ? copy(value) : {};
        this.requestComponentUpdate("options");
    }

    /** The host's move rules: {<to>: {from: [...], reason}} (study 5, describe().fields.<lane>.moves). */
    get moves() {
        if (this._moves === null) this._moves = this._json("moves", {}, (value) => value && typeof value === "object" && !Array.isArray(value));
        return this._moves;
    }

    set moves(value) {
        this._moves = value && typeof value === "object" ? copy(value) : {};
        this.requestComponentUpdate("moves");
    }

    /** The host's actions on a selection, after «Переместить в…»: [{id, text, icon}]. */
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

    get boardOptions() {
        return boardOptions(this.options, this.fields);
    }

    get laneField() {
        const key = this.boardOptions.laneField;
        return this.fields.find((field) => String(field.key) === key) ?? (key ? {key} : null);
    }

    /** The lanes drawn, in order, with what the person folded or hid here. */
    get boardLanes() {
        const options = this.boardOptions;
        options.lanes.hidden = [...new Set([...options.lanes.hidden, ...this._hidden])];
        return orderLanes({field: this.laneField, answered: this.lanes, options}).map((lane) => ({
            ...lane,
            collapsed: this._folded.has(lane.value) ? this._folded.get(lane.value) : lane.collapsed,
        }));
    }

    get manualOrder() {
        return manualOrder(this.boardOptions, this.getProp("orderField"), this.getProp("sortActive") === true);
    }

    // ── what the template asks ─────────────────────────────────────────────

    word(key, vars = {}) {
        return format(this.sfWord(key), vars);
    }

    recordTitle(record) {
        const key = this.getProp("titleField") || "title";
        const value = record?.[key] ?? record?.title ?? record?.name ?? record?.id;
        return value && typeof value === "object" ? String(value.label ?? value.title ?? "") : String(value ?? "");
    }

    fieldAlign(field) {
        const type = String(field.propertyType ?? field.property_type ?? field.type ?? "");
        return NUMERIC.has(type) ? "end" : "start";
    }

    // A card field in the «Кратко» place: the Framework field renderers' cell
    // output (C300 (2)); text where the set answers nothing. A template per
    // field (C302) comes with the template registry.
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

    laneCountOf(lane) {
        return laneCount(lane.total, lane.limit);
    }

    laneSumsOf(lane) {
        const totals = this.boardOptions.totals;
        if (!totals.some((entry) => entry && typeof entry === "object" && entry.sum)) return [];
        const wanted = totals.filter((entry) => entry?.sum).map((entry) => String(entry.sum));
        const chosen = Object.fromEntries(Object.entries(lane.totals ?? {}).filter(([key]) => wanted.includes(key)));
        return laneSums(chosen, this.closest?.("[lang]")?.getAttribute("lang") || globalThis.document?.documentElement?.lang);
    }

    templateContext() {
        const options = this.boardOptions;
        const lanes = this.boardLanes;
        if (this._phoneIndex >= lanes.length) this._phoneIndex = Math.max(0, lanes.length - 1);
        const cardFields = options.cardFields
            .map((key) => this.fields.find((field) => String(field.key) === key))
            .filter(Boolean);
        const actions = [{id: "move", text: this.word("move-selected-text"), icon: "arrow_forward"}, ...this._actions];
        return {
            component: this,
            uid: this._uid,
            size: this.getProp("size") === "1" ? "1" : "1/2",
            label: this.getAttribute("aria-label") || this.word("board-label"),
            lanes,
            cardFields,
            perLane: options.perLane,
            selected: this._selected,
            pending: this._pending,
            refusals: this._refusals,
            loadingLanes: this._loading,
            dragging: this._held !== null,
            message: this._message,
            phone: this._phone,
            phoneIndex: this._phoneIndex,
            selectable: this.getProp("selectable") !== false,
            creatable: this.getProp("creatable") === true,
            movable: this.getProp("movable") !== false,
            bulkActions: bulkActionsAvailable(),
            actions,
        };
    }

    template() {
        return renderViewBoardTemplate(this.templateContext());
    }

    // ── life ───────────────────────────────────────────────────────────────

    onConnected() {
        super.onConnected?.();
        if (this._listening) return;
        this._listening = new AbortController();
        const signal = this._listening.signal;
        this.addEventListener("click", (event) => this._onClick(event), {signal});
        this.addEventListener("change", (event) => this._onChange(event), {signal});
        this.addEventListener("keydown", (event) => this._onKey(event), {signal, capture: true});
        this.addEventListener("focusin", (event) => this._onFocus(event), {signal});
        this.addEventListener("contextmenu", (event) => this._onContextMenu(event), {signal});
        this.addEventListener("sf-sortable-state", (event) => this._onDragState(event), {signal});
        this.addEventListener("sf-sortable-check", (event) => this._onCheck(event), {signal});
        this.addEventListener("sf-sortable-move", (event) => this._onSortableMove(event), {signal});
        this.addEventListener("sf-tabs-change", (event) => this._onLaneSwitch(event), {signal});
        this.addEventListener("sf-bulk-actions-action", (event) => this._onBulkAction(event), {signal});
        this.addEventListener("sf-bulk-actions-clear", () => this.clearSelection(), {signal});
        this.addEventListener("scroll", (event) => this._onScroll(event), {signal, capture: true});
        if (typeof globalThis.ResizeObserver === "function") this._resize = new ResizeObserver(() => this._measure());
        this._measure();
        const tags = ["sf-sortable", "sf-badge", "sf-button", "sf-button-icon", "sf-checkbox", "sf-tabs", "sf-toast", "sf-menu-context"];
        if (bulkActionsAvailable()) tags.push("sf-bulk-actions");
        globalThis.SF?.Loader?.ensure?.(tags);
        globalThis.customElements?.whenDefined?.("sf-sortable")?.then?.(() => this.isConnected && this.requestComponentUpdate("sortable"));
    }

    onDisconnected() {
        super.onDisconnected?.();
        this._listening?.abort();
        this._listening = null;
        this._resize?.disconnect();
        this._resize = null;
        this._observed = null;
    }

    afterRender(changed) {
        super.afterRender?.(changed);
        // The host is display: contents (a Smart host has no box), so the
        // board's own root is what is measured for the phone layout (BD-8).
        const root = this.querySelector(":scope > .sf-view-board");
        if (root && this._resize && this._observed !== root) {
            if (this._observed) this._resize.unobserve(this._observed);
            this._observed = root;
            this._resize.observe(root);
        }
        // After sf-sortable has prepared its items (a microtask), the board
        // makes itself one Tab stop (BD-10).
        globalThis.setTimeout?.(() => this._rove(), 0);
    }

    _measure() {
        // Before the first render there is no root: the nearest box around
        // the board gives its width, so a phone draws one lane at once.
        let box = this.querySelector?.(":scope > .sf-view-board") ?? this;
        while (box && box.parentElement && !(box.getBoundingClientRect?.().width > 0)) box = box.parentElement;
        const width = box?.getBoundingClientRect?.().width ?? 0;
        const phone = width > 0 && width < PHONE_BELOW;
        if (phone !== this._phone) {
            this._phone = phone;
            this.requestComponentUpdate("phone");
        }
    }

    // ── keys and the one Tab stop (BD-10) ──────────────────────────────────

    // The board is a grid: a lane is a column whose cells are its head's
    // controls, its cards and «Показать ещё»; a folded lane is one cell.
    _columns() {
        const lanes = [...this.querySelectorAll(".sf-view-board__lanes > :is(.sf-view-board__lane, .sf-view-board__folded)")];
        const shown = this._phone ? lanes.slice(this._phoneIndex, this._phoneIndex + 1) : lanes;
        return shown.map((lane) => (lane.matches(".sf-view-board__folded")
            ? {lane, cells: [lane]}
            : {lane, cells: [...lane.querySelectorAll(".sf-view-board__row > sf-button-icon, .sf-view-board__card, .sf-view-board__more > sf-button")]}));
    }

    _focusable(cell) {
        if (!cell) return null;
        if (cell.matches("sf-button-icon, sf-button")) return cell.querySelector("button") ?? cell;
        return cell;
    }

    _rove() {
        if (!this.isConnected) return;
        const columns = this._columns();
        const cells = columns.flatMap((column) => column.cells);
        const cards = cells.filter((cell) => cell.matches?.(ITEM));
        let active = cells.find((cell) => cell === this._active || (this._active?.dataset?.id && cell.dataset?.id === this._active.dataset.id));
        if (!active) active = cards[0] ?? cells[0] ?? null;
        this._active = active;
        // Everything the board holds that takes Tab leaves the order; the
        // active cell is the board's one stop.
        for (const node of this.querySelectorAll(".sf-view-board__lanes :is(button, [tabindex], " + ITEM + ")")) {
            if (node.closest(".sf-view-board__lanes") !== this.querySelector(".sf-view-board__lanes")) continue;
            if (node.getAttribute("tabindex") !== "-1") node.setAttribute("tabindex", "-1");
        }
        const target = this._focusable(active);
        if (target) target.setAttribute("tabindex", "0");
    }

    _go(cell) {
        if (!cell) return;
        this._active = cell;
        this._rove();
        const target = this._focusable(cell);
        target?.focus?.({preventScroll: false});
        target?.scrollIntoView?.({block: "nearest", inline: "nearest"});
    }

    _onFocus(event) {
        const cell = event.target.closest?.(".sf-view-board__card, .sf-view-board__folded, sf-button-icon, sf-button");
        if (!cell || !cell.closest(".sf-view-board__lanes")) return;
        const owner = cell.closest(".sf-view-board__card") ?? cell;
        if (owner !== this._active) {
            this._active = owner;
            globalThis.setTimeout?.(() => this._rove(), 0);
        }
    }

    _onKey(event) {
        if (this._held !== null) return;
        const target = event.target;
        const card = target.closest?.(".sf-view-board__card");
        // A card's own control (its box, its title) keeps its keys.
        if (card && target !== card) {
            if (event.key === "Escape") { event.preventDefault(); this._go(card); }
            return;
        }
        if (card && ((event.shiftKey && event.key === "F10") || event.key === "ContextMenu")) {
            event.preventDefault();
            event.stopPropagation();
            this.openCardMenu(card.dataset.id, card.querySelector("[data-menu]"));
            return;
        }
        // Space marks a card (C146 (8), BV-8), as in the table; Enter picks
        // it up (sf-sortable).
        if (card && event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            if (this.getProp("selectable") !== false) this.toggleSelected(card.dataset.id);
            return;
        }
        if (event.key === "Escape" && this._selected.size) {
            event.preventDefault();
            this.clearSelection();
            return;
        }
        const step = {ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], Home: [0, -Infinity], End: [0, Infinity]}[event.key];
        if (!step) return;
        const columns = this._columns();
        const at = columns.findIndex((column) => column.cells.some((cell) => cell === card || cell === target || cell.contains(target)));
        if (at < 0) return;
        const row = columns[at].cells.findIndex((cell) => cell === card || cell === target || cell.contains(target));
        event.preventDefault();
        event.stopPropagation();
        const rtl = globalThis.getComputedStyle?.(this)?.direction === "rtl";
        const [dx, dy] = step;
        if (dx) {
            const next = columns[at + (rtl ? -dx : dx)];
            if (!next) {
                if (this._phone) this._switchLane(this._phoneIndex + (rtl ? -dx : dx), {focus: true});
                return;
            }
            // The same kind of cell in the next lane: a card for a card.
            const kind = (cell) => (cell.matches(ITEM) ? "card" : cell.matches(".sf-view-board__more > sf-button") ? "more" : "head");
            const same = next.cells.filter((cell) => kind(cell) === kind(columns[at].cells[row]));
            const index = columns[at].cells.filter((cell) => kind(cell) === kind(columns[at].cells[row])).indexOf(columns[at].cells[row]);
            this._go(same[Math.min(index, same.length - 1)] ?? next.cells[0]);
            return;
        }
        const cells = columns[at].cells;
        const index = dy === -Infinity ? 0 : dy === Infinity ? cells.length - 1 : Math.max(0, Math.min(cells.length - 1, row + dy));
        this._go(cells[index]);
    }

    // ── clicks and menus ───────────────────────────────────────────────────

    _onClick(event) {
        const target = event.target.closest?.("[data-open], [data-menu], [data-add], [data-lanemenu], [data-more], [data-unfold], [data-bulk], [data-clear]");
        if (!target || !this.contains(target)) return;
        const data = target.dataset;
        if (data.open) this.openRecord(data.open);
        else if (data.menu) this.openCardMenu(data.menu, target);
        else if (data.add) this.createIn(data.add);
        else if (data.lanemenu) this.openLaneMenu(data.lanemenu, target);
        else if (data.more) this.showMore(data.more);
        else if (data.unfold) this.foldLane(data.unfold, false);
        else if (data.bulk) this._bulk(data.bulk, target);
        else if (target.hasAttribute("data-clear")) this.clearSelection();
    }

    _onContextMenu(event) {
        const card = event.target.closest?.(".sf-view-board__card");
        if (!card) return;
        event.preventDefault();
        this.openCardMenu(card.dataset.id, null, [event.clientX, event.clientY]);
    }

    _onChange(event) {
        if (event.target?.matches?.("sf-tabs") && event.target.closest(".sf-view-board__switch") === event.target) {
            if (Number.isInteger(event.detail?.current)) this._switchLane(event.detail.current);
            return;
        }
        const box = event.target.closest?.("[data-box]");
        if (!box) return;
        const on = event.target.checked ?? box.checked;
        this._setSelected(box.dataset.box, Boolean(on));
    }

    _lane(value) {
        return this.boardLanes.find((lane) => lane.value === String(value)) ?? null;
    }

    _record(id) {
        for (const lane of this.lanes) {
            const record = (lane.records ?? []).find((entry) => String(entry.id) === String(id));
            if (record) return {lane: String(lane.value), record};
        }
        return null;
    }

    _check(id, to) {
        if (this.getProp("movable") === false) return {ok: false, reason: this.word("no-move-text")};
        const found = this._record(id);
        if (!found) return {ok: false, reason: ""};
        const result = moveCheck(this.moves, found.lane, to);
        return result.ok ? result : {ok: false, reason: result.reason || this.word("refuse-default")};
    }

    _menu(options) {
        const menu = globalThis.SF?.menu;
        if (typeof menu?.open !== "function") return Promise.resolve(null);
        return Promise.resolve(menu.open(options)).catch(() => null);
    }

    openCardMenu(id, anchor = null, point = null) {
        const found = this._record(id);
        if (!found) return Promise.resolve(null);
        const title = this.recordTitle(found.record);
        const targets = this.boardLanes.map((lane) => {
            const check = this._check(id, lane.value);
            return {
                id: `to:${lane.value}`, text: lane.label, checked: lane.value === found.lane,
                disabled: lane.value === found.lane || !check.ok, caption: lane.value === found.lane || check.ok ? "" : check.reason,
            };
        });
        const entries = [
            {id: "open", text: this.word("open-text"), icon: "open_in_new"},
            {id: "move", text: this.word("move-to-text"), icon: "arrow_forward", submenu: targets},
        ];
        if (this.manualOrder) {
            entries.push({type: "separator"},
                {id: "first", text: this.word("to-start-text"), icon: "vertical_align_top"},
                {id: "last", text: this.word("to-end-text"), icon: "vertical_align_bottom"});
        }
        return this._menu({...(point ? {x: point[0], y: point[1]} : {anchor: anchor ?? this}), entries, label: title}).then((chosen) => {
            const choice = chosen?.id;
            if (!choice) return null;
            if (choice === "open") return this.openRecord(id);
            if (choice.startsWith("to:")) return this.moveRecord(id, choice.slice(3), {how: "menu"});
            if (choice === "first" || choice === "last") {
                const lane = this.lanes.find((entry) => String(entry.value) === found.lane);
                return this.moveRecord(id, found.lane, {index: choice === "first" ? 0 : (lane?.records?.length ?? 1) - 1, how: "menu"});
            }
            return null;
        });
    }

    openLaneMenu(value, anchor = null) {
        const lane = this._lane(value);
        if (!lane) return Promise.resolve(null);
        const entries = [];
        if (this.getProp("creatable") === true) entries.push({id: "add", text: this.word("new-text"), icon: "add"});
        if (!this._phone) entries.push({id: "fold", text: this.word("collapse-text"), icon: "unfold_less"});
        entries.push({id: "hide", text: this.word("hide-text"), icon: "visibility_off", caption: this.word("hide-hint")});
        return this._menu({anchor: anchor ?? this, label: this.word("lane-menu-text", {lane: lane.label}), entries}).then((chosen) => {
            if (chosen?.id === "add") return this.createIn(value);
            if (chosen?.id === "fold") return this.foldLane(value, true);
            if (chosen?.id === "hide") return this.hideLane(value);
            return null;
        });
    }

    // ── what the board asks the host ───────────────────────────────────────

    openRecord(id) {
        return this.sfEmit("open", {id: String(id)});
    }

    createIn(value) {
        const field = this.boardOptions.laneField;
        return this.sfEmit("create", {field, value: String(value)});
    }

    showMore(value) {
        const lane = this.lanes.find((entry) => String(entry.value) === String(value));
        if (!lane || this._loading.has(String(value))) return false;
        this._loading.add(String(value));
        this.requestComponentUpdate("more");
        return this.sfEmit("more", {lane: String(value), cursor: lane.cursor ?? null, offset: (lane.records ?? []).length});
    }

    /** The host's next records of one lane (the answer to more). */
    appendLane(value, {records = [], cursor = null, total, totals} = {}) {
        if (value && typeof value === "object") ({lane: value, records = [], cursor = null, total, totals} = value);
        const key = String(value);
        this._loading.delete(key);
        const lane = this.lanes.find((entry) => String(entry.value) === key);
        if (!lane) {
            this.requestComponentUpdate("more");
            return refused("unknown-lane");
        }
        const known = new Set((lane.records ?? []).map((record) => String(record.id)));
        lane.records = [...(lane.records ?? []), ...copy(records).filter((record) => !known.has(String(record.id)))];
        lane.cursor = cursor;
        if (Number.isSafeInteger(total)) lane.total = total;
        if (totals && typeof totals === "object") lane.totals = copy(totals);
        this.requestComponentUpdate("more");
        return applied();
    }

    foldLane(value, folded) {
        this._folded.set(String(value), Boolean(folded));
        const lane = this._lane(value);
        this._say(this.word(folded ? "collapsed-text" : "expanded-text", {lane: lane?.label ?? value}));
        this._save();
        this.requestComponentUpdate("fold");
    }

    hideLane(value) {
        const lane = this._lane(value);
        this._hidden.add(String(value));
        this._say(this.word("hidden-text", {lane: lane?.label ?? value}));
        this._save();
        this.requestComponentUpdate("hide");
    }

    _save() {
        const options = this.boardOptions;
        const collapsed = new Set(options.lanes.collapsed);
        for (const [value, folded] of this._folded) {
            if (folded) collapsed.add(value);
            else collapsed.delete(value);
        }
        this.sfEmit("save", {
            collapsed: [...collapsed],
            hidden: [...new Set([...options.lanes.hidden, ...this._hidden])],
            order: options.lanes.order,
        });
    }

    // ── selection (BD-9) ───────────────────────────────────────────────────

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
        const ids = [...this._selected];
        const entries = this.boardLanes.map((lane) => {
            const refused = ids.filter((id) => !this._check(id, lane.value).ok && this._record(id)?.lane !== lane.value);
            return {id: lane.value, text: lane.label, disabled: refused.length === ids.length, caption: refused.length ? this._check(refused[0], lane.value).reason : ""};
        });
        return this._menu({anchor: anchor ?? this, label: this.word("move-selected-text"), entries}).then((chosen) => {
            if (!chosen?.id) return null;
            const moved = ids.filter((id) => this._record(id)?.lane !== chosen.id).map((id) => this.moveRecord(id, chosen.id, {how: "bulk"}));
            this.clearSelection();
            return Promise.all(moved);
        });
    }

    // ── moves (BD-5, BD-6) ─────────────────────────────────────────────────

    _onDragState(event) {
        const detail = event.detail ?? {};
        if (detail.state === "picked") {
            this._held = String(detail.item);
            this._refusals = new Map();
            for (const lane of this.boardLanes) {
                const check = this._check(this._held, lane.value);
                if (!check.ok) this._refusals.set(lane.value, check.reason);
            }
        } else {
            this._held = null;
            this._refusals = new Map();
        }
        this.requestComponentUpdate("drag");
    }

    // sf-sortable 1.7 asks before a card goes to a list: the host's rule says.
    _onCheck(event) {
        const detail = event.detail ?? {};
        const to = this._listLane(detail.to);
        if (to === null) return;
        const check = this._check(detail.item, to);
        if (check.ok) return;
        event.preventDefault();
        try { detail.reason = check.reason; } catch { /* a frozen detail keeps the list's own word */ }
    }

    _listLane(id) {
        if (id === null || id === undefined) return null;
        const list = this.querySelector(`sf-sortable[id="${globalThis.CSS?.escape ? globalThis.CSS.escape(String(id)) : String(id)}"]`);
        return list?.dataset?.lane ?? null;
    }

    _onSortableMove(event) {
        const detail = event.detail ?? {};
        const to = this._listLane(detail.to);
        if (to === null) return;
        event.stopPropagation();
        this.moveRecord(detail.item, to, {index: Number.isInteger(detail.index) ? detail.index : null, how: "drag"});
    }

    /**
     * Moves a card to a lane (and a place in it, with manual order). Refused by
     * the host's rule: the message, nothing moves. Else shown at once and pale,
     * sf-view-board-move goes out (cancelable), and the host settles it.
     */
    moveRecord(id, to, {index = null, how = ""} = {}) {
        const key = String(id);
        const found = this._record(key);
        if (!found) return Promise.resolve(null);
        const target = String(to);
        const title = this.recordTitle(found.record);
        if (found.lane === target) {
            if (!this.manualOrder || index === null) {
                this._say(this.word("sorted-text", {title}));
                this.requestComponentUpdate("order");
                return Promise.resolve(null);
            }
        } else {
            const check = this._check(key, target);
            if (!check.ok) {
                this._refuse(this.word("not-moved-text", {title, reason: check.reason}));
                this.requestComponentUpdate("refused");
                return Promise.resolve(null);
            }
        }
        const lane = this.lanes.find((entry) => String(entry.value) === target);
        const place = this.manualOrder && index !== null ? index : 0;
        const before = lane?.records?.filter((record) => String(record.id) !== key)?.[place]?.id ?? null;
        const move = {from: found.lane, to: target, index: place, record: copy(found.record)};
        this._pending.set(key, move);
        this._place(key, found.lane, target, place);
        this.requestComponentUpdate("move");
        const field = this.boardOptions.laneField;
        const allowed = this.sfEmit("move", {
            id: key, field, from: found.lane, to: target, before: before === null ? null : String(before),
            revision: found.record.revision ?? found.record._revision ?? null, how,
        }, {cancelable: true});
        if (allowed === false) {
            this.settleMove(key, {answer: "refused", reason: ""});
            return Promise.resolve(null);
        }
        return Promise.resolve(true);
    }

    _place(id, from, to, index, {count = true} = {}) {
        const source = this.lanes.find((entry) => String(entry.value) === String(from));
        let target = this.lanes.find((entry) => String(entry.value) === String(to));
        if (!target) {
            target = {value: String(to), total: 0, records: []};
            this.lanes.push(target);
        }
        const at = (source?.records ?? []).findIndex((record) => String(record.id) === String(id));
        if (at < 0 && source) return;
        const [record] = source ? source.records.splice(at, 1) : [this._pending.get(id)?.record];
        if (!record) return;
        target.records = target.records ?? [];
        const field = this.boardOptions.laneField;
        if (field) record[field] = to;
        target.records.splice(Math.max(0, Math.min(index, target.records.length)), 0, record);
        if (count && source !== target) {
            if (source) source.total = Math.max(0, (source.total ?? source.records.length + 1) - 1);
            target.total = (target.total ?? target.records.length - 1) + 1;
        }
    }

    /**
     * The host's answer to a move: {answer: applied, record?} keeps it (and
     * draws the record as the host has it); refused or conflict puts the card
     * back and says the host's reason; focus stays on the card.
     */
    settleMove(id, result = {}) {
        if (id && typeof id === "object") ({id, result = {}} = id);
        const key = String(id);
        const move = this._pending.get(key);
        if (!move) return refused("unknown-move");
        this._pending.delete(key);
        const focused = this.ownerDocument?.activeElement?.closest?.(".sf-view-board__card")?.dataset?.id === key;
        const title = this.recordTitle(move.record);
        if (result.answer === "applied") {
            const lane = this.lanes.find((entry) => String(entry.value) === move.to);
            if (result.record && lane) {
                const at = lane.records.findIndex((record) => String(record.id) === key);
                if (at >= 0) lane.records[at] = {...lane.records[at], ...copy(result.record)};
            }
            const position = (lane?.records ?? []).findIndex((record) => String(record.id) === key) + 1;
            const label = this._lane(move.to)?.label ?? move.to;
            this._say(move.from === move.to
                ? this.word("placed-text", {title, index: position})
                : this.word("moved-text", {title, lane: label, index: position, count: lane?.total ?? position}));
        } else {
            const lane = this.lanes.find((entry) => String(entry.value) === move.to);
            const at = (lane?.records ?? []).findIndex((record) => String(record.id) === key);
            if (at >= 0) {
                const [record] = lane.records.splice(at, 1);
                if (move.from !== move.to) lane.total = Math.max(0, (lane.total ?? 1) - 1);
                const source = this.lanes.find((entry) => String(entry.value) === move.from);
                if (source) {
                    const field = this.boardOptions.laneField;
                    source.records.splice(Math.min(move.index ?? 0, source.records.length), 0, {...record, ...(field ? {[field]: move.from} : {})});
                    if (move.from !== move.to) source.total = (source.total ?? 0) + 1;
                }
            }
            const reason = String(result.message ?? result.reason ?? "") || this.word("refuse-default");
            this._refuse(this.word("not-moved-text", {title, reason}));
        }
        this.requestComponentUpdate("settled");
        this.whenRendered?.(() => {
            const card = this.querySelector(`.sf-view-board__card[data-id="${globalThis.CSS?.escape ? globalThis.CSS.escape(key) : key}"]`);
            if (card && (focused || this.ownerDocument?.activeElement === this.ownerDocument?.body)) this._go(card);
        }, {next: true});
        return applied();
    }

    // ── phone (BD-8) ───────────────────────────────────────────────────────

    _onLaneSwitch(event) {
        const index = event.detail?.current;
        if (!Number.isInteger(index)) return;
        this._switchLane(index);
    }

    _switchLane(index, {focus = false} = {}) {
        const lanes = [...this.querySelectorAll(".sf-view-board__lanes > *")];
        if (index < 0 || index >= lanes.length) return;
        this._phoneIndex = index;
        const strip = this.querySelector(".sf-view-board__lanes");
        strip?.scrollTo?.({left: lanes[index].offsetLeft - strip.offsetLeft, behavior: "smooth"});
        this.requestComponentUpdate("lane");
        if (focus) this.whenRendered?.(() => this._go(this._columns()[0]?.cells.find((cell) => cell.matches(ITEM)) ?? this._columns()[0]?.cells[0]), {next: true});
    }

    _onScroll(event) {
        if (!this._phone || !event.target?.matches?.(".sf-view-board__lanes")) return;
        globalThis.clearTimeout?.(this._scrollTimer);
        this._scrollTimer = globalThis.setTimeout?.(() => {
            const strip = event.target;
            const index = Math.round(strip.scrollLeft / Math.max(1, strip.clientWidth));
            if (index !== this._phoneIndex) {
                this._phoneIndex = index;
                this.requestComponentUpdate("lane");
            }
        }, 120);
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

SfViewBoard.define("sf-view-board");
