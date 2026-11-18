// sf-view-cards: the cards layout of the view set (a gallery of record cards;
// owner decisions C297, C306). Records are cards in a grid whose columns
// follow its width; a cover the layout draws, a title, up to four fields in
// the «Кратко» place. Study and accepted page: ui-control
// control/research/2026-11-18-cards-view, ui-doc.test/proto/cards-view-study.html.
//
// The cards own no data. sf-view (layout="cards") asks the host for a window
// {page, per_page: 24} and gives the answer's records here; «Показать ещё»
// asks the next page and appends it. Opening a record, a selection, the card
// menu, an empty list's «Создать» and «Сбросить фильтр» are events sf-view
// (or any host) answers. Cards appear only where the author of a list turned
// them on (C297): layout="cards", or describe().layouts listing cards for the
// head's switch.
//
// Framework parts: the card is .sf-card; the fields in the «Кратко» place are
// the Framework field renderers' cell output (C300 (2), C302); «Показать ещё»
// and «Показано N из M» are sf-pagination in its more look (C167, words in
// every Framework language pack); empty states are sf-empty-state; the card
// menu is SF.menu.open; the selection bar is sf-bulk-actions (C295) where the
// pair has it, else the same strip of sf-button.
import SfBaseElement from "../../core/js/smart-base";
import {applied, elementFromManifest, refused} from "../../core/js/element-manifest";
import {renderCellField} from "../field-renderers/index.js";
import {renderViewCardsTemplate} from "./js/templates/default.js";
import {RATIOS, cardsOptions, coverOf, fieldAlign, format, gridStep, phoneColumns, titleOf} from "./js/cards.js";
import manifest from "./component.json";
import en from "./lang/en.json";
import ru from "./lang/ru.json";

const CardsElement = elementFromManifest(manifest, {
    base: SfBaseElement,
    lang: {en, ru},
    source: "ru",
});

const CARD = ".sf-view-cards__card:not(.sf-view-cards__skeleton)";
const SKELETONS = 8;

const copy = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
const own = (element, name) => Object.prototype.hasOwnProperty.call(element, name);
const escape = (value) => (globalThis.CSS?.escape ? globalThis.CSS.escape(String(value)) : String(value).replace(/["\\]/gu, "\\$&"));

// Whether the pair carries sf-bulk-actions (C295): defined, or a rule the
// Loader can fetch. Before it, the cards draw the same strip themselves.
function bulkActionsAvailable() {
    return Boolean(globalThis.customElements?.get?.("sf-bulk-actions") || globalThis.SF?.RuleLoader?.["cl-bulk-actions"]);
}

class SfViewCards extends CardsElement {
    static get props() {
        return {
            ...super.props,
            templateName: {attribute: "template", default: "default"},
        };
    }

    constructor() {
        super();
        this._records = null;
        this._fields = null;
        this._options = null;
        this._actions = [];
        this._selected = new Set();
        this._anchor = null;
        this._active = null;
        this._current = "";
        this._message = "";
        this._loadingMore = false;
        this._empty = null;
        for (const name of ["records", "fields", "options", "actions", "selected", "current", "emptyContext"]) {
            if (!own(this, name)) continue;
            const early = this[name];
            delete this[name];
            this[name] = early;
        }
    }

    // ── data ───────────────────────────────────────────────────────────────

    /** The records shown, in the view's order: the pages asked so far (CD-4). */
    get records() {
        if (this._records === null) {
            const value = this.parseJsonAttribute("records", []);
            this._records = Array.isArray(value) ? copy(value) : [];
        }
        return this._records;
    }

    set records(value) {
        this._records = Array.isArray(value) ? copy(value) : [];
        this._loadingMore = false;
        const ids = new Set(this._records.map((record) => String(record.id)));
        for (const id of [...this._selected]) if (!ids.has(id)) this._selected.delete(id);
        if (this._active !== null && !ids.has(this._active)) this._active = null;
        this.requestComponentUpdate("records");
    }

    /** The host's next page, appended (the answer to more, when no sf-view keeps the list). */
    appendRecords(list, {total, hasNext} = {}) {
        if (!Array.isArray(list)) return refused("not-a-list");
        const known = new Set(this.records.map((record) => String(record.id)));
        this._records = [...this.records, ...copy(list).filter((record) => !known.has(String(record.id)))];
        if (Number.isSafeInteger(total)) this.setAttribute("total", String(total));
        if (typeof hasNext === "boolean") this.setAttribute("has-next", hasNext ? "true" : "false");
        this._loadingMore = false;
        this.requestComponentUpdate("more");
        return applied();
    }

    /** The field descriptors (sf-view's columns): the cover, the title and the card fields among them. */
    get fields() {
        if (this._fields === null) {
            const value = this.parseJsonAttribute("fields", []);
            this._fields = Array.isArray(value) ? value : [];
        }
        return this._fields;
    }

    set fields(value) {
        this._fields = Array.isArray(value) ? value.map((field) => ({...field})) : [];
        this.requestComponentUpdate("fields");
    }

    /** layouts.cards of simai.view-config/1 (cover_field, cover {fit, ratio}, title_field, card_fields, card_labels, size, density, more, per_page). */
    get options() {
        if (this._options === null) {
            const value = this.parseJsonAttribute("options", {});
            this._options = value && typeof value === "object" && !Array.isArray(value) ? value : {};
        }
        return this._options;
    }

    set options(value) {
        this._options = value && typeof value === "object" && !Array.isArray(value) ? copy(value) : {};
        this.requestComponentUpdate("options");
    }

    /** The host's actions on a selection (sf-view's bulk actions): [{id, text|label, icon}]. */
    get actions() { return this._actions; }

    set actions(value) {
        this._actions = Array.isArray(value)
            ? value.filter((action) => action && (action.id ?? action.value) !== undefined)
                .map((action) => ({...action, id: String(action.id ?? action.value), text: action.text ?? action.label ?? String(action.id ?? action.value)}))
            : [];
        this.requestComponentUpdate("actions");
    }

    get selected() { return [...this._selected]; }

    set selected(value) {
        this._selected = new Set((Array.isArray(value) ? value : []).map(String));
        this.requestComponentUpdate("selected");
    }

    /** The record open in the record card beside the list (C305): its card is marked. */
    get current() { return this._current; }

    set current(value) {
        const id = value === null || value === undefined ? "" : String(value);
        if (id === this._current) return;
        this._current = id;
        this.requestComponentUpdate("current");
    }

    /** Why the list is empty or failed, as sf-view knows it: {kind: no-data|nothing-found|no-access|error, message?}. */
    get emptyContext() { return this._empty; }

    set emptyContext(value) {
        this._empty = value && typeof value === "object" ? {...value} : null;
        this.requestComponentUpdate("empty");
    }

    get cardsOptions() {
        const options = cardsOptions(this.options, this.fields);
        const size = this.getAttribute("card-size");
        if (["s", "m", "l"].includes(size)) options.size = size;
        return options;
    }

    // ── what the template asks ─────────────────────────────────────────────

    word(key, vars = {}) {
        return format(this.sfWord(key), vars);
    }

    recordTitle(record) {
        return titleOf(record, this.cardsOptions.titleField);
    }

    coverOf(record) {
        const key = this.cardsOptions.coverField;
        return key ? coverOf(record?.[key]) : null;
    }

    fieldAlign(field) {
        return fieldAlign(field);
    }

    // A card field in the «Кратко» place: the Framework field renderers' cell
    // output (C300 (2)); text where they answer nothing. A template per field
    // (C302) comes with the template registry.
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

    get total() {
        const total = Number(this.getAttribute("total"));
        return Number.isSafeInteger(total) && total >= 0 ? Math.max(total, this.records.length) : this.records.length;
    }

    get hasNext() {
        const written = this.getAttribute("has-next");
        if (written === "true" || written === "") return true;
        if (written === "false") return false;
        return this.total > this.records.length;
    }

    templateContext() {
        const options = this.cardsOptions;
        const records = this.records;
        const known = new Map(this.fields.map((field) => [String(field.key), field]));
        const cardFields = options.cardFields.map((key) => known.get(key)).filter(Boolean);
        const state = this.getAttribute("data-state") ?? "";
        const loading = state === "loading";
        const total = this.total;
        const countKnown = this.getAttribute("count-known") !== "false" && this.hasAttribute("total");
        const pages = Math.max(1, Math.ceil(records.length / options.perPage));
        const empty = !records.length && ["empty", "error", "no-access"].includes(state) ? (this._empty ?? {kind: state === "error" ? "error" : state === "no-access" ? "no-access" : "no-data"}) : null;
        if (empty && state === "error") empty.kind = "error";
        if (this._active === null || !records.some((record) => String(record.id) === this._active)) this._active = records.length ? String(records[0].id) : null;
        return {
            component: this,
            size: this.getProp("size") === "1" ? "1" : "1/2",
            cardSize: options.size,
            fit: options.cover.fit,
            ratio: RATIOS[options.cover.ratio],
            density: options.density,
            cover: Boolean(options.coverField),
            labels: options.cardLabels,
            label: this.getAttribute("aria-label")
                ? `${this.getAttribute("aria-label")}, ${total}`
                : this.word("cards-label", {count: total}),
            records,
            total,
            hasNext: this.hasNext,
            countKnown,
            perPage: options.perPage,
            portions: pages,
            more: records.length > 0 && (this.hasNext || records.length > options.perPage),
            loadingMore: this._loadingMore,
            loading,
            skeletons: SKELETONS,
            empty,
            cardFields,
            selected: this._selected,
            current: this._current,
            active: this._active,
            message: this._message,
            selectable: this.getProp("selectable") !== false,
            creatable: this.getProp("creatable") === true,
            bulkActions: bulkActionsAvailable(),
            actions: this._actions,
        };
    }

    template() {
        return renderViewCardsTemplate(this.templateContext());
    }

    // ── life ───────────────────────────────────────────────────────────────

    onConnected() {
        super.onConnected?.();
        if (this._listening) return;
        this._listening = new AbortController();
        const signal = this._listening.signal;
        this.addEventListener("click", (event) => this._onClick(event), {signal});
        this.addEventListener("change", (event) => this._onChange(event), {signal});
        this.addEventListener("keydown", (event) => this._onKey(event), {signal});
        this.addEventListener("focusin", (event) => this._onFocus(event), {signal});
        this.addEventListener("contextmenu", (event) => this._onContextMenu(event), {signal});
        this.addEventListener("sf-pagination-load-more", (event) => this._onMore(event), {signal});
        this.addEventListener("sf-empty-state-action", (event) => this._onEmptyAction(event), {signal});
        this.addEventListener("sf-bulk-actions-action", (event) => this._onBulkAction(event), {signal});
        this.addEventListener("sf-bulk-actions-clear", () => this.clearSelection(), {signal});
        const tags = ["sf-checkbox", "sf-button", "sf-button-icon", "sf-icon", "sf-pagination", "sf-empty-state", "sf-skeleton", "sf-menu-context"];
        if (bulkActionsAvailable()) tags.push("sf-bulk-actions");
        globalThis.SF?.Loader?.ensure?.(tags);
        // The inner controls of a card take no Tab stop of their own (CD-6):
        // they are quieted again whenever a card's control draws its markup.
        if (typeof MutationObserver === "function") {
            this._quiet = new MutationObserver(() => this._quietControls());
            this._quiet.observe(this, {childList: true, subtree: true});
        }
    }

    onDisconnected() {
        super.onDisconnected?.();
        this._listening?.abort();
        this._listening = null;
        this._quiet?.disconnect();
        this._quiet = null;
    }

    afterRender(changed) {
        super.afterRender?.(changed);
        this._quietControls();
    }

    _quietControls() {
        for (const node of this.querySelectorAll(".sf-view-cards__card :is(input, button, a[href], [tabindex]:not(.sf-view-cards__card))")) {
            if (node.getAttribute("tabindex") !== "-1") node.setAttribute("tabindex", "-1");
        }
    }

    // ── keys and the one Tab stop (CD-6) ───────────────────────────────────

    _cards() {
        return [...this.querySelectorAll(CARD)];
    }

    /** The columns drawn now: the cards whose top is the first card's. */
    get columns() {
        const cards = this._cards();
        if (!cards.length) return 0;
        const top = cards[0].offsetTop;
        let count = 0;
        for (const card of cards) {
            if (card.offsetTop !== top) break;
            count += 1;
        }
        return count;
    }

    _go(card, {announce = true} = {}) {
        if (!card) return;
        const id = card.dataset.id;
        this._active = id;
        for (const other of this._cards()) other.setAttribute("tabindex", other === card ? "0" : "-1");
        card.focus({preventScroll: false});
        card.scrollIntoView?.({block: "nearest", inline: "nearest"});
        if (announce) {
            const record = this._record(id);
            this._say(this.word("position-text", {title: this.recordTitle(record), index: Number(card.dataset.index) + 1, count: this.total}));
        }
    }

    _onFocus(event) {
        const card = event.target.closest?.(CARD);
        if (!card || card.dataset.id === this._active) return;
        this._active = card.dataset.id;
        for (const other of this._cards()) other.setAttribute("tabindex", other === card ? "0" : "-1");
    }

    _onKey(event) {
        const target = event.target;
        const card = target.closest?.(CARD);
        if (!card) {
            if (event.key === "Escape" && this._selected.size && !target.closest?.("sf-bulk-actions")) {
                event.preventDefault();
                this.clearSelection();
            }
            return;
        }
        // A card's own control (its box, its menu) keeps its keys; Escape
        // goes back to the card.
        if (target !== card) {
            if (event.key === "Escape") {
                event.preventDefault();
                this._go(card, {announce: false});
            }
            return;
        }
        const id = card.dataset.id;
        if ((event.shiftKey && event.key === "F10") || event.key === "ContextMenu") {
            event.preventDefault();
            event.stopPropagation();
            this.openCardMenu(id, card.querySelector("[data-menu]"));
            return;
        }
        if (event.key === "Enter") {
            event.preventDefault();
            this.openRecord(id, "keyboard");
            return;
        }
        if (event.key === " " || event.key === "Spacebar") {
            event.preventDefault();
            if (this.getProp("selectable") === false) return;
            if (event.shiftKey && this._anchor !== null) this._selectRange(this._anchor, id);
            else this.toggleSelected(id);
            return;
        }
        if (event.key === "Escape") {
            if (!this._selected.size) return;
            event.preventDefault();
            event.stopPropagation();
            this.clearSelection();
            return;
        }
        const cards = this._cards();
        const index = cards.indexOf(card);
        const rtl = globalThis.getComputedStyle?.(this)?.direction === "rtl";
        const columns = this.columns || 1;
        const rows = Math.max(1, Math.floor((globalThis.innerHeight ?? 0) / Math.max(1, card.offsetHeight)));
        const to = gridStep(event.key, index, {count: cards.length, columns, ctrl: event.ctrlKey || event.metaKey, rtl, page: rows});
        if (to === null) return;
        event.preventDefault();
        event.stopPropagation();
        if (to !== index) this._go(cards[to]);
    }

    // ── clicks and menus ───────────────────────────────────────────────────

    _onClick(event) {
        const control = event.target.closest?.("[data-menu], [data-box], [data-bulk], [data-clear]");
        if (control && this.contains(control)) {
            const data = control.dataset;
            if (data.menu) this.openCardMenu(data.menu, control);
            else if (data.bulk) this._apply(data.bulk);
            else if (control.hasAttribute("data-clear")) this.clearSelection();
            // The box is answered by its change event.
            return;
        }
        if (event.target.closest?.(".sf-view-cards__box, .sf-view-cards__menu")) return;
        const card = event.target.closest?.(CARD);
        if (!card || !this.contains(card)) return;
        this._active = card.dataset.id;
        if ((event.shiftKey || event.ctrlKey || event.metaKey) && this.getProp("selectable") !== false) {
            if (event.shiftKey && this._anchor !== null) this._selectRange(this._anchor, card.dataset.id);
            else this.toggleSelected(card.dataset.id);
            return;
        }
        this.openRecord(card.dataset.id, "pointer");
    }

    _onChange(event) {
        const box = event.target.closest?.("[data-box]");
        if (!box || !this.contains(box)) return;
        event.stopPropagation();
        const on = event.target.checked ?? box.checked ?? box.hasAttribute("checked");
        this._setSelected(box.dataset.box, Boolean(on));
    }

    _onContextMenu(event) {
        const card = event.target.closest?.(CARD);
        if (!card) return;
        event.preventDefault();
        this.openCardMenu(card.dataset.id, null, [event.clientX, event.clientY]);
    }

    _record(id) {
        return this.records.find((record) => String(record.id) === String(id)) ?? null;
    }

    _menu(options) {
        const menu = globalThis.SF?.menu;
        if (typeof menu?.open !== "function") return Promise.resolve(null);
        return Promise.resolve(menu.open(options)).catch(() => null);
    }

    /** The card menu (right click, Shift+F10, «⋯»): open, select, the host's actions on this record. */
    openCardMenu(id, anchor = null, point = null) {
        const record = this._record(id);
        if (!record) return Promise.resolve(null);
        const key = String(id);
        if (this.sfEmit("menu", {id: key}, {cancelable: true}) === false) return Promise.resolve(null);
        const title = this.recordTitle(record);
        const selected = this._selected.has(key);
        const entries = [{id: "open", text: this.word("open-text"), icon: "open_in_new"}];
        if (this.getProp("selectable") !== false) entries.push({id: "select", text: this.word(selected ? "deselect-text" : "select-short-text"), icon: selected ? "check_box_outline_blank" : "check_box"});
        if (this._actions.length) {
            entries.push({type: "separator"});
            for (const action of this._actions) entries.push({id: `act:${action.id}`, text: action.text, ...(action.icon ? {icon: action.icon} : {}), ...(action.status ? {status: action.status} : {})});
        }
        const card = this.querySelector(`${CARD}[data-id="${escape(key)}"]`);
        return this._menu({...(point ? {x: point[0], y: point[1]} : {anchor: anchor ?? card ?? this}), entries, label: title}).then((chosen) => {
            const choice = chosen?.id;
            if (!choice) {
                if (card && !point) this._go(card, {announce: false});
                return null;
            }
            if (choice === "open") return this.openRecord(key, "menu");
            if (choice === "select") return this.toggleSelected(key);
            if (choice.startsWith("act:")) return this.sfEmit("apply", {action: choice.slice(4), ids: [key], scope: "record"});
            return null;
        });
    }

    // ── what the cards ask the host ────────────────────────────────────────

    /** Opens a record: sf-view-cards-open {id, trigger}; the host (sf-view) opens the record card (C305). */
    openRecord(id, trigger = "api") {
        this._active = String(id);
        return this.sfEmit("open", {id: String(id), trigger: String(trigger)});
    }

    // sf-pagination's «Показать ещё» inside the cards is the cards' own ask.
    _onMore(event) {
        event.stopPropagation();
        this.showMore();
    }

    /** Asks the next page: sf-view-cards-more {page, offset}; the answer is records (or appendRecords). */
    showMore() {
        if (this._loadingMore || !this.hasNext) return false;
        this._loadingMore = true;
        this.requestComponentUpdate("more");
        const per = this.cardsOptions.perPage;
        return this.sfEmit("more", {page: Math.ceil(this.records.length / per) + 1, offset: this.records.length, per_page: per});
    }

    _onEmptyAction(event) {
        const id = event.detail?.id;
        if (id === "create") {
            event.stopPropagation();
            this.sfEmit("create", {});
        } else if (id === "reset") {
            event.stopPropagation();
            this.sfEmit("reset", {});
        } else if (id === "retry") {
            event.stopPropagation();
            this.sfEmit("refresh", {});
        }
    }

    // ── selection (CD-6, C295) ─────────────────────────────────────────────

    toggleSelected(id) {
        this._setSelected(id, !this._selected.has(String(id)));
    }

    _setSelected(id, on, {announce = true} = {}) {
        const key = String(id);
        this._anchor = key;
        if (on === this._selected.has(key)) return;
        if (on) this._selected.add(key);
        else this._selected.delete(key);
        if (announce) {
            const title = this.recordTitle(this._record(key));
            this._say(this.word(on ? "selected-one-text" : "unselected-one-text", {title, count: this._selected.size}));
        }
        this.requestComponentUpdate("selected");
        this.sfEmit("select", {ids: [...this._selected]});
    }

    _selectRange(from, to) {
        const ids = this.records.map((record) => String(record.id));
        const a = ids.indexOf(String(from));
        const b = ids.indexOf(String(to));
        if (a < 0 || b < 0) return this.toggleSelected(to);
        for (const id of ids.slice(Math.min(a, b), Math.max(a, b) + 1)) this._selected.add(id);
        this._say(this.word("selected-text", {count: this._selected.size}));
        this.requestComponentUpdate("selected");
        this.sfEmit("select", {ids: [...this._selected]});
        return undefined;
    }

    clearSelection() {
        if (!this._selected.size) return;
        this._selected.clear();
        this._anchor = null;
        this._say(this.word("cleared-text"));
        this.requestComponentUpdate("selected");
        this.sfEmit("select", {ids: []});
        const card = this.querySelector(`${CARD}[data-id="${escape(this._active ?? "")}"]`);
        if (card && this.contains(this.ownerDocument?.activeElement)) this._go(card, {announce: false});
    }

    _onBulkAction(event) {
        const id = event.detail?.id;
        if (id === undefined) return;
        this._apply(String(id), event.detail?.scope ?? "selection");
    }

    _apply(action, scope = "selection") {
        return this.sfEmit("apply", {action: String(action), ids: [...this._selected], scope});
    }

    // ── messages ───────────────────────────────────────────────────────────

    _say(text) {
        this._message = String(text ?? "");
        this.requestComponentUpdate("message");
    }

    /** How many columns a phone draws for the card size (C306). */
    get phoneColumns() {
        return phoneColumns(this.cardsOptions.size);
    }
}

SfViewCards.define("sf-view-cards");
