/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "0f7b12a8175f"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("06a40de06677");
/* harmony import */ var _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c1778d82ba00");
/* harmony import */ var _js_board_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("0712e6d5225f");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("6169da476610");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("21765acb70ff");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("b04d01ca8dbb");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__);
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








const BoardElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: "ru"
});
const ITEM = "[data-sf-sortable-item]";
const PHONE_BELOW = 600;
const NUMERIC = new Set(["integer", "number", "decimal", "money", "percent", "date", "datetime", "time", "duration"]);
let boards = 0;

const copy = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

const own = (element, name) => Object.prototype.hasOwnProperty.call(element, name); // Whether the pair's sf-sortable is 1.7 or newer (BV-6..BV-8): its lists keep
// one Tab stop themselves and ask the host before a move (sf-sortable-check).


function sortableRoves() {
  return typeof globalThis.customElements?.get?.("sf-sortable")?.prototype?.syncRoving === "function";
} // Whether the pair carries sf-bulk-actions (C295): defined, or a rule the
// Loader can fetch.


function bulkActionsAvailable() {
  return Boolean(globalThis.customElements?.get?.("sf-bulk-actions") || globalThis.SF?.RuleLoader?.["cl-bulk-actions"]);
}

class SfViewBoard extends BoardElement {
  static get props() {
    return { ...super.props,
      templateName: {
        attribute: "template",
        default: "default"
      }
    };
  }

  constructor() {
    super(); // Set as properties (the usual case: a host has objects) or, in
    // markup, as the attributes' JSON; read once from there.

    this._answered = null;
    this._fields = null;
    this._options = null;
    this._moves = null;
    this._actions = [];
    this._selected = new Set(); // id -> {from, to, index, record}: a move shown and not yet settled.

    this._pending = new Map(); // Lanes the person folded or unfolded here, over the options.

    this._folded = new Map();
    this._hidden = new Set(); // Lanes the person brought back here over the options' hidden ones
    // («Вид» → the board's lanes).

    this._unhidden = new Set();
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
  } // ── data ───────────────────────────────────────────────────────────────

  /** The host's lanes: [{value, label?, total, totals, records, cursor}] (the lane window, C304). */


  get lanes() {
    return this._lanesData();
  }

  _lanesData() {
    if (this._answered === null) this._answered = copy(this._json("lanes", [], Array.isArray));
    return this._answered;
  }

  _json(name, fallback, valid) {
    const value = this.parseJsonAttribute(name, fallback);
    return valid(value) ? value : fallback;
  }

  set lanes(value) {
    this._answered = Array.isArray(value) ? copy(value) : []; // A move still on its way keeps its card where it was put.

    for (const [id, move] of this._pending) this._place(id, move.from, move.to, move.index, {
      count: false
    });

    this.requestComponentUpdate("lanes");
  }
  /** The field descriptors (sf-view's columns): the lane field and the card fields. */


  get fields() {
    if (this._fields === null) this._fields = this._json("fields", [], Array.isArray);
    return this._fields;
  }

  set fields(value) {
    this._fields = Array.isArray(value) ? value.map(field => ({ ...field
    })) : [];
    this.requestComponentUpdate("fields");
  }
  /** layouts.board of simai.view-config/1 (lane_field, lanes, empty_lanes, card_fields, totals, limits, order, per_lane, swimlane_field). */


  get options() {
    if (this._options === null) this._options = this._json("options", {}, value => value && typeof value === "object" && !Array.isArray(value));
    return this._options;
  }

  set options(value) {
    this._options = value && typeof value === "object" ? copy(value) : {};
    this.requestComponentUpdate("options");
  }
  /** The host's move rules: {<to>: {from: [...], reason}} (study 5, describe().fields.<lane>.moves). */


  get moves() {
    if (this._moves === null) this._moves = this._json("moves", {}, value => value && typeof value === "object" && !Array.isArray(value));
    return this._moves;
  }

  set moves(value) {
    this._moves = value && typeof value === "object" ? copy(value) : {};
    this.requestComponentUpdate("moves");
  }
  /** The host's actions on a selection, after «Переместить в…»: [{id, text, icon}]. */


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

  get boardOptions() {
    return (0,_js_board_js__WEBPACK_IMPORTED_MODULE_4__.boardOptions)(this.options, this.fields);
  }

  get laneField() {
    const key = this.boardOptions.laneField;
    return this.fields.find(field => String(field.key) === key) ?? (key ? {
      key
    } : null);
  }
  /** The lanes drawn, in order, with what the person folded or hid here. */


  get boardLanes() {
    const options = this.boardOptions;
    options.lanes.hidden = this._hiddenValues(options);
    return (0,_js_board_js__WEBPACK_IMPORTED_MODULE_4__.orderLanes)({
      field: this.laneField,
      answered: this.lanes,
      options
    }).map(lane => ({ ...lane,
      collapsed: this._folded.has(lane.value) ? this._folded.get(lane.value) : lane.collapsed
    }));
  } // What is hidden: the options' lanes and those hidden here, less the
  // ones brought back here.


  _hiddenValues(options = this.boardOptions) {
    return [...new Set([...options.lanes.hidden, ...this._hidden])].filter(value => !this._unhidden.has(value));
  }
  /** Every lane of the board, hidden ones too, with whether it is shown
   *  ([{value, label, shown}]): «Вид» lists them, a hidden one with its way
   *  back (DEV 2026-11-24: «Скрыть» pointed at a window 1.17.0 no longer has). */


  get laneChoices() {
    const options = this.boardOptions;
    const hidden = new Set(this._hiddenValues(options));
    const all = (0,_js_board_js__WEBPACK_IMPORTED_MODULE_4__.orderLanes)({
      field: this.laneField,
      answered: this.lanes,
      options: { ...options,
        emptyLanes: "show",
        lanes: { ...options.lanes,
          hidden: []
        }
      }
    });
    return all.map(lane => ({
      value: lane.value,
      label: lane.label,
      shown: !hidden.has(lane.value)
    }));
  }

  get manualOrder() {
    return (0,_js_board_js__WEBPACK_IMPORTED_MODULE_4__.manualOrder)(this.boardOptions, this.getProp("orderField"), this.getProp("sortActive") === true);
  } // ── what the template asks ─────────────────────────────────────────────


  word(key, vars = {}) {
    return (0,_js_board_js__WEBPACK_IMPORTED_MODULE_4__.format)(this.sfWord(key), vars);
  }

  recordTitle(record) {
    const key = this.getProp("titleField") || "title";
    const value = record?.[key] ?? record?.title ?? record?.name ?? record?.id;
    return value && typeof value === "object" ? String(value.label ?? value.title ?? "") : String(value ?? "");
  }

  fieldAlign(field) {
    const type = String(field.propertyType ?? field.property_type ?? field.type ?? "");
    return NUMERIC.has(type) ? "end" : "start";
  } // A card field in the «Кратко» place: the Framework field renderers' cell
  // output (C300 (2)); text where the set answers nothing. A template per
  // field (C302) comes with the template registry.


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

  laneCountOf(lane) {
    return (0,_js_board_js__WEBPACK_IMPORTED_MODULE_4__.laneCount)(lane.total, lane.limit);
  }

  laneSumsOf(lane) {
    const totals = this.boardOptions.totals;
    if (!totals.some(entry => entry && typeof entry === "object" && entry.sum)) return [];
    const wanted = totals.filter(entry => entry?.sum).map(entry => String(entry.sum));
    const chosen = Object.fromEntries(Object.entries(lane.totals ?? {}).filter(([key]) => wanted.includes(key)));
    return (0,_js_board_js__WEBPACK_IMPORTED_MODULE_4__.laneSums)(chosen, this.closest?.("[lang]")?.getAttribute("lang") || globalThis.document?.documentElement?.lang);
  } // The sums come in a request after the cards (sums-pending, set by
  // sf-view): their line is held so the head does not grow when they come.


  get sumsAwaited() {
    return this.getProp("sumsPending") === true && this.boardOptions.totals.some(entry => entry && typeof entry === "object" && entry.sum);
  }
  /** The lanes' totals the host answered after the cards: [{value, totals}] (sums per currency). */


  setLaneTotals(list) {
    if (!Array.isArray(list)) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("not-a-list");

    for (const entry of list) {
      const lane = this.lanes.find(known => String(known.value) === String(entry?.value));
      if (lane && entry.totals && typeof entry.totals === "object") lane.totals = { ...(lane.totals ?? {}),
        ...copy(entry.totals)
      };
    }

    this.requestComponentUpdate("totals");
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  templateContext() {
    const options = this.boardOptions;
    const lanes = this.boardLanes;
    if (this._phoneIndex >= lanes.length) this._phoneIndex = Math.max(0, lanes.length - 1);
    const cardFields = options.cardFields.map(key => this.fields.find(field => String(field.key) === key)).filter(Boolean);
    const actions = [{
      id: "move",
      text: this.word("move-selected-text"),
      icon: "arrow_forward"
    }, ...this._actions];
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
      actions
    };
  }

  template() {
    return (0,_js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__.renderViewBoardTemplate)(this.templateContext());
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
    this.addEventListener("keydown", event => this._onKey(event), {
      signal,
      capture: true
    });
    this.addEventListener("focusin", event => this._onFocus(event), {
      signal
    });
    this.addEventListener("contextmenu", event => this._onContextMenu(event), {
      signal
    });
    this.addEventListener("sf-sortable-state", event => this._onDragState(event), {
      signal
    });
    this.addEventListener("sf-sortable-check", event => this._onCheck(event), {
      signal
    });
    this.addEventListener("sf-sortable-move", event => this._onSortableMove(event), {
      signal
    });
    this.addEventListener("sf-tabs-change", event => this._onLaneSwitch(event), {
      signal
    });
    this.addEventListener("sf-bulk-actions-action", event => this._onBulkAction(event), {
      signal
    });
    this.addEventListener("sf-bulk-actions-clear", () => this.clearSelection(), {
      signal
    });
    this.addEventListener("scroll", event => this._onScroll(event), {
      signal,
      capture: true
    }); // A width crossing the phone line redraws the board (one lane, the lane
    // tabs), which changes its height inside its own observer: the redraw
    // waits for the next frame, as the list head's does (view round 18).

    if (typeof globalThis.ResizeObserver === "function") this._resize = new ResizeObserver(() => {
      if (this._measureFrame) return;

      const later = globalThis.requestAnimationFrame ?? (run => globalThis.setTimeout(run, 16));

      this._measureFrame = later(() => {
        this._measureFrame = null;
        if (this.isConnected) this._measure();
      });
    });

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
    super.afterRender?.(changed); // The host is display: contents (a Smart host has no box), so the
    // board's own root is what is measured for the phone layout (BD-8).

    const root = this.querySelector(":scope > .sf-view-board");

    if (root && this._resize && this._observed !== root) {
      if (this._observed) this._resize.unobserve(this._observed);
      this._observed = root;

      this._resize.observe(root);
    } // After sf-sortable has prepared its items (a microtask), the board
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
  } // ── keys and the one Tab stop (BD-10) ──────────────────────────────────
  // The board is a grid: a lane is a column whose cells are its head's
  // controls, its cards and «Показать ещё»; a folded lane is one cell.


  _columns() {
    const lanes = [...this.querySelectorAll(".sf-view-board__lanes > :is(.sf-view-board__lane, .sf-view-board__folded)")];
    const shown = this._phone ? lanes.slice(this._phoneIndex, this._phoneIndex + 1) : lanes;
    return shown.map(lane => lane.matches(".sf-view-board__folded") ? {
      lane,
      cells: [lane]
    } : {
      lane,
      cells: [...lane.querySelectorAll(".sf-view-board__row > sf-button-icon, .sf-view-board__card, .sf-view-board__more > sf-button")]
    });
  }

  _focusable(cell) {
    if (!cell) return null;
    if (cell.matches("sf-button-icon, sf-button")) return cell.querySelector("button") ?? cell;
    return cell;
  }

  _rove() {
    if (!this.isConnected) return;

    const columns = this._columns();

    const cells = columns.flatMap(column => column.cells);
    const cards = cells.filter(cell => cell.matches?.(ITEM));
    let active = cells.find(cell => cell === this._active || this._active?.dataset?.id && cell.dataset?.id === this._active.dataset.id);
    if (!active) active = cards[0] ?? cells[0] ?? null;
    this._active = active; // Everything the board holds that takes Tab leaves the order; the
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

    target?.focus?.({
      preventScroll: false
    });
    target?.scrollIntoView?.({
      block: "nearest",
      inline: "nearest"
    });
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
    const card = target.closest?.(".sf-view-board__card"); // A card's own control (its box, its title) keeps its keys.

    if (card && target !== card) {
      if (event.key === "Escape") {
        event.preventDefault();

        this._go(card);
      }

      return;
    }

    if (card && (event.shiftKey && event.key === "F10" || event.key === "ContextMenu")) {
      event.preventDefault();
      event.stopPropagation();
      this.openCardMenu(card.dataset.id, card.querySelector("[data-menu]"));
      return;
    } // Space marks a card (C146 (8), BV-8), as in the table; Enter picks
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

    const step = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      Home: [0, -Infinity],
      End: [0, Infinity]
    }[event.key];
    if (!step) return;

    const columns = this._columns();

    const at = columns.findIndex(column => column.cells.some(cell => cell === card || cell === target || cell.contains(target)));
    if (at < 0) return;
    const row = columns[at].cells.findIndex(cell => cell === card || cell === target || cell.contains(target));
    event.preventDefault();
    event.stopPropagation();
    const rtl = globalThis.getComputedStyle?.(this)?.direction === "rtl";
    const [dx, dy] = step;

    if (dx) {
      const next = columns[at + (rtl ? -dx : dx)];

      if (!next) {
        if (this._phone) this._switchLane(this._phoneIndex + (rtl ? -dx : dx), {
          focus: true
        });
        return;
      } // The same kind of cell in the next lane: a card for a card.


      const kind = cell => cell.matches(ITEM) ? "card" : cell.matches(".sf-view-board__more > sf-button") ? "more" : "head";

      const same = next.cells.filter(cell => kind(cell) === kind(columns[at].cells[row]));
      const index = columns[at].cells.filter(cell => kind(cell) === kind(columns[at].cells[row])).indexOf(columns[at].cells[row]);

      this._go(same[Math.min(index, same.length - 1)] ?? next.cells[0]);

      return;
    }

    const cells = columns[at].cells;
    const index = dy === -Infinity ? 0 : dy === Infinity ? cells.length - 1 : Math.max(0, Math.min(cells.length - 1, row + dy));

    this._go(cells[index]);
  } // ── clicks and menus ───────────────────────────────────────────────────


  _onClick(event) {
    const target = event.target.closest?.("[data-open], [data-menu], [data-add], [data-lanemenu], [data-more], [data-unfold], [data-bulk], [data-clear]");
    if (!target || !this.contains(target)) return;
    const data = target.dataset;
    if (data.open) this.openRecord(data.open);else if (data.menu) this.openCardMenu(data.menu, target);else if (data.add) this.createIn(data.add);else if (data.lanemenu) this.openLaneMenu(data.lanemenu, target);else if (data.more) this.showMore(data.more);else if (data.unfold) this.foldLane(data.unfold, false);else if (data.bulk) this._bulk(data.bulk, target);else if (target.hasAttribute("data-clear")) this.clearSelection();
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
    return this.boardLanes.find(lane => lane.value === String(value)) ?? null;
  }

  _record(id) {
    for (const lane of this.lanes) {
      const record = (lane.records ?? []).find(entry => String(entry.id) === String(id));
      if (record) return {
        lane: String(lane.value),
        record
      };
    }

    return null;
  }

  _check(id, to) {
    if (this.getProp("movable") === false) return {
      ok: false,
      reason: this.word("no-move-text")
    };

    const found = this._record(id);

    if (!found) return {
      ok: false,
      reason: ""
    };
    const result = (0,_js_board_js__WEBPACK_IMPORTED_MODULE_4__.moveCheck)(this.moves, found.lane, to);
    return result.ok ? result : {
      ok: false,
      reason: result.reason || this.word("refuse-default")
    };
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
    const targets = this.boardLanes.map(lane => {
      const check = this._check(id, lane.value);

      return {
        id: `to:${lane.value}`,
        text: lane.label,
        checked: lane.value === found.lane,
        disabled: lane.value === found.lane || !check.ok,
        caption: lane.value === found.lane || check.ok ? "" : check.reason
      };
    });
    const entries = [{
      id: "open",
      text: this.word("open-text"),
      icon: "open_in_new"
    }, {
      id: "move",
      text: this.word("move-to-text"),
      icon: "arrow_forward",
      submenu: targets
    }];

    if (this.manualOrder) {
      entries.push({
        type: "separator"
      }, {
        id: "first",
        text: this.word("to-start-text"),
        icon: "vertical_align_top"
      }, {
        id: "last",
        text: this.word("to-end-text"),
        icon: "vertical_align_bottom"
      });
    }

    return this._menu({ ...(point ? {
        x: point[0],
        y: point[1]
      } : {
        anchor: anchor ?? this
      }),
      entries,
      label: title
    }).then(chosen => {
      const choice = chosen?.id;
      if (!choice) return null;
      if (choice === "open") return this.openRecord(id);
      if (choice.startsWith("to:")) return this.moveRecord(id, choice.slice(3), {
        how: "menu"
      });

      if (choice === "first" || choice === "last") {
        const lane = this.lanes.find(entry => String(entry.value) === found.lane);
        return this.moveRecord(id, found.lane, {
          index: choice === "first" ? 0 : (lane?.records?.length ?? 1) - 1,
          how: "menu"
        });
      }

      return null;
    });
  }

  openLaneMenu(value, anchor = null) {
    const lane = this._lane(value);

    if (!lane) return Promise.resolve(null);
    const entries = [];
    if (this.getProp("creatable") === true) entries.push({
      id: "add",
      text: this.word("new-text"),
      icon: "add"
    });
    if (!this._phone) entries.push({
      id: "fold",
      text: this.word("collapse-text"),
      icon: "unfold_less"
    });
    entries.push({
      id: "hide",
      text: this.word("hide-text"),
      icon: "visibility_off",
      caption: this.word("hide-hint")
    });
    return this._menu({
      anchor: anchor ?? this,
      label: this.word("lane-menu-text", {
        lane: lane.label
      }),
      entries
    }).then(chosen => {
      if (chosen?.id === "add") return this.createIn(value);
      if (chosen?.id === "fold") return this.foldLane(value, true);
      if (chosen?.id === "hide") return this.hideLane(value);
      return null;
    });
  } // ── what the board asks the host ───────────────────────────────────────


  openRecord(id) {
    return this.sfEmit("open", {
      id: String(id)
    });
  }

  createIn(value) {
    const field = this.boardOptions.laneField;
    return this.sfEmit("create", {
      field,
      value: String(value)
    });
  }

  showMore(value) {
    const lane = this.lanes.find(entry => String(entry.value) === String(value));
    if (!lane || this._loading.has(String(value))) return false;

    this._loading.add(String(value));

    this.requestComponentUpdate("more");
    return this.sfEmit("more", {
      lane: String(value),
      cursor: lane.cursor ?? null,
      offset: (lane.records ?? []).length
    });
  }
  /** The host's next records of one lane (the answer to more). */


  appendLane(value, {
    records = [],
    cursor = null,
    total,
    totals
  } = {}) {
    if (value && typeof value === "object") ({
      lane: value,
      records = [],
      cursor = null,
      total,
      totals
    } = value);
    const key = String(value);

    this._loading.delete(key);

    const lane = this.lanes.find(entry => String(entry.value) === key);

    if (!lane) {
      this.requestComponentUpdate("more");
      return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("unknown-lane");
    }

    const known = new Set((lane.records ?? []).map(record => String(record.id)));
    lane.records = [...(lane.records ?? []), ...copy(records).filter(record => !known.has(String(record.id)))];
    lane.cursor = cursor;
    if (Number.isSafeInteger(total)) lane.total = total;
    if (totals && typeof totals === "object") lane.totals = copy(totals);
    this.requestComponentUpdate("more");
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  }

  foldLane(value, folded) {
    this._folded.set(String(value), Boolean(folded));

    const lane = this._lane(value);

    this._say(this.word(folded ? "collapsed-text" : "expanded-text", {
      lane: lane?.label ?? value
    }));

    this._save();

    this.requestComponentUpdate("fold");
  }

  hideLane(value) {
    const lane = this._lane(value);

    this._hidden.add(String(value));

    this._unhidden.delete(String(value));

    this._say(this.word("hidden-text", {
      lane: lane?.label ?? value
    }));

    this._save();

    this.requestComponentUpdate("hide");
  }
  /** A hidden lane back on the board (the way back «Вид» offers). */


  showLane(value) {
    const key = String(value);
    const lane = this.laneChoices.find(entry => entry.value === key);

    this._hidden.delete(key);

    this._unhidden.add(key);

    this._say(this.word("shown-text", {
      lane: lane?.label ?? key
    }));

    this._save();

    this.requestComponentUpdate("show");
  }

  _save() {
    const options = this.boardOptions;
    const collapsed = new Set(options.lanes.collapsed);

    for (const [value, folded] of this._folded) {
      if (folded) collapsed.add(value);else collapsed.delete(value);
    }

    this.sfEmit("save", {
      collapsed: [...collapsed],
      hidden: this._hiddenValues(options),
      order: options.lanes.order
    });
  } // ── selection (BD-9) ───────────────────────────────────────────────────


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
    const ids = [...this._selected];
    const entries = this.boardLanes.map(lane => {
      const refused = ids.filter(id => !this._check(id, lane.value).ok && this._record(id)?.lane !== lane.value);
      return {
        id: lane.value,
        text: lane.label,
        disabled: refused.length === ids.length,
        caption: refused.length ? this._check(refused[0], lane.value).reason : ""
      };
    });
    return this._menu({
      anchor: anchor ?? this,
      label: this.word("move-selected-text"),
      entries
    }).then(chosen => {
      if (!chosen?.id) return null;
      const moved = ids.filter(id => this._record(id)?.lane !== chosen.id).map(id => this.moveRecord(id, chosen.id, {
        how: "bulk"
      }));
      this.clearSelection();
      return Promise.all(moved);
    });
  } // ── moves (BD-5, BD-6) ─────────────────────────────────────────────────


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
  } // sf-sortable 1.7 asks before a card goes to a list: the host's rule says.


  _onCheck(event) {
    const detail = event.detail ?? {};

    const to = this._listLane(detail.to);

    if (to === null) return;

    const check = this._check(detail.item, to);

    if (check.ok) return;
    event.preventDefault();

    try {
      detail.reason = check.reason;
    } catch {
      /* a frozen detail keeps the list's own word */
    }
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
    this.moveRecord(detail.item, to, {
      index: Number.isInteger(detail.index) ? detail.index : null,
      how: "drag"
    });
  }
  /**
   * Moves a card to a lane (and a place in it, with manual order). Refused by
   * the host's rule: the message, nothing moves. Else shown at once and pale,
   * sf-view-board-move goes out (cancelable), and the host settles it.
   */


  moveRecord(id, to, {
    index = null,
    how = ""
  } = {}) {
    const key = String(id);

    const found = this._record(key);

    if (!found) return Promise.resolve(null);
    const target = String(to);
    const title = this.recordTitle(found.record);

    if (found.lane === target) {
      if (!this.manualOrder || index === null) {
        this._say(this.word("sorted-text", {
          title
        }));

        this.requestComponentUpdate("order");
        return Promise.resolve(null);
      }
    } else {
      const check = this._check(key, target);

      if (!check.ok) {
        this._refuse(this.word("not-moved-text", {
          title,
          reason: check.reason
        }));

        this.requestComponentUpdate("refused");
        return Promise.resolve(null);
      }
    }

    const lane = this.lanes.find(entry => String(entry.value) === target);
    const place = this.manualOrder && index !== null ? index : 0;
    const before = lane?.records?.filter(record => String(record.id) !== key)?.[place]?.id ?? null;
    const move = {
      from: found.lane,
      to: target,
      index: place,
      record: copy(found.record)
    };

    this._pending.set(key, move);

    this._place(key, found.lane, target, place);

    this.requestComponentUpdate("move");
    const field = this.boardOptions.laneField;
    const allowed = this.sfEmit("move", {
      id: key,
      field,
      from: found.lane,
      to: target,
      before: before === null ? null : String(before),
      revision: found.record.revision ?? found.record._revision ?? null,
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
  }

  _place(id, from, to, index, {
    count = true
  } = {}) {
    const source = this.lanes.find(entry => String(entry.value) === String(from));
    let target = this.lanes.find(entry => String(entry.value) === String(to));

    if (!target) {
      target = {
        value: String(to),
        total: 0,
        records: []
      };
      this.lanes.push(target);
    }

    const at = (source?.records ?? []).findIndex(record => String(record.id) === String(id));
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
    if (id && typeof id === "object") ({
      id,
      result = {}
    } = id);
    const key = String(id);

    const move = this._pending.get(key);

    if (!move) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("unknown-move");

    this._pending.delete(key);

    const focused = this.ownerDocument?.activeElement?.closest?.(".sf-view-board__card")?.dataset?.id === key;
    const title = this.recordTitle(move.record);

    if (result.answer === "applied") {
      const lane = this.lanes.find(entry => String(entry.value) === move.to);

      if (result.record && lane) {
        const at = lane.records.findIndex(record => String(record.id) === key);
        if (at >= 0) lane.records[at] = { ...lane.records[at],
          ...copy(result.record)
        };
      }

      const position = (lane?.records ?? []).findIndex(record => String(record.id) === key) + 1;
      const label = this._lane(move.to)?.label ?? move.to;

      this._say(move.from === move.to ? this.word("placed-text", {
        title,
        index: position
      }) : this.word("moved-text", {
        title,
        lane: label,
        index: position,
        count: lane?.total ?? position
      }));
    } else {
      const lane = this.lanes.find(entry => String(entry.value) === move.to);
      const at = (lane?.records ?? []).findIndex(record => String(record.id) === key);

      if (at >= 0) {
        const [record] = lane.records.splice(at, 1);
        if (move.from !== move.to) lane.total = Math.max(0, (lane.total ?? 1) - 1);
        const source = this.lanes.find(entry => String(entry.value) === move.from);

        if (source) {
          const field = this.boardOptions.laneField;
          source.records.splice(Math.min(move.index ?? 0, source.records.length), 0, { ...record,
            ...(field ? {
              [field]: move.from
            } : {})
          });
          if (move.from !== move.to) source.total = (source.total ?? 0) + 1;
        }
      }

      const reason = String(result.message ?? result.reason ?? "") || this.word("refuse-default");

      this._refuse(this.word("not-moved-text", {
        title,
        reason
      }));
    }

    this.requestComponentUpdate("settled");
    this.whenRendered?.(() => {
      const card = this.querySelector(`.sf-view-board__card[data-id="${globalThis.CSS?.escape ? globalThis.CSS.escape(key) : key}"]`);
      if (card && (focused || this.ownerDocument?.activeElement === this.ownerDocument?.body)) this._go(card);
    }, {
      next: true
    });
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
  } // ── phone (BD-8) ───────────────────────────────────────────────────────


  _onLaneSwitch(event) {
    const index = event.detail?.current;
    if (!Number.isInteger(index)) return;

    this._switchLane(index);
  }

  _switchLane(index, {
    focus = false
  } = {}) {
    const lanes = [...this.querySelectorAll(".sf-view-board__lanes > *")];
    if (index < 0 || index >= lanes.length) return;
    this._phoneIndex = index;
    const strip = this.querySelector(".sf-view-board__lanes");
    strip?.scrollTo?.({
      left: lanes[index].offsetLeft - strip.offsetLeft,
      behavior: "smooth"
    });
    this.requestComponentUpdate("lane");
    if (focus) this.whenRendered?.(() => this._go(this._columns()[0]?.cells.find(cell => cell.matches(ITEM)) ?? this._columns()[0]?.cells[0]), {
      next: true
    });
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

SfViewBoard.define("sf-view-board");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "0712e6d5225f"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CARD_FIELDS_MAX: () => (/* binding */ CARD_FIELDS_MAX),
/* harmony export */   LAYOUT_ALIASES: () => (/* binding */ LAYOUT_ALIASES),
/* harmony export */   PER_LANE: () => (/* binding */ PER_LANE),
/* harmony export */   boardOptions: () => (/* binding */ boardOptions),
/* harmony export */   format: () => (/* binding */ format),
/* harmony export */   laneCount: () => (/* binding */ laneCount),
/* harmony export */   laneSums: () => (/* binding */ laneSums),
/* harmony export */   layoutName: () => (/* binding */ layoutName),
/* harmony export */   manualOrder: () => (/* binding */ manualOrder),
/* harmony export */   moveCheck: () => (/* binding */ moveCheck),
/* harmony export */   orderLanes: () => (/* binding */ orderLanes)
/* harmony export */ });
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
const LAYOUT_ALIASES = Object.freeze({
  kanban: "board"
});
const PER_LANE = 20;
const CARD_FIELDS_MAX = 4;
const LANE_TYPES = new Set(["choice", "status", "select", "enum", "user", "boolean"]);

const list = value => Array.isArray(value) ? value.map(item => String(item)) : [];

const typeOf = field => String(field?.propertyType ?? field?.property_type ?? field?.type ?? "");
/**
 * layouts.board of view-config/1, with its defaults (study 5, the options table).
 * swimlane_field is reserved (C304 (4)): read and kept, never drawn.
 */


function boardOptions(options = {}, fields = []) {
  const given = options && typeof options === "object" ? options : {};
  const lanes = given.lanes && typeof given.lanes === "object" ? given.lanes : {};
  const laneField = given.lane_field ?? fields.find(field => typeOf(field) === "status")?.key ?? fields.find(field => LANE_TYPES.has(typeOf(field)) && Array.isArray(field.options))?.key ?? null;
  const shown = fields.filter(field => field.key !== laneField && !field.title && field.key !== "title");
  const cardFields = (Array.isArray(given.card_fields) ? list(given.card_fields) : shown.map(field => String(field.key))).filter(key => key !== laneField).slice(0, CARD_FIELDS_MAX);
  const perLane = Number.isSafeInteger(given.per_lane) && given.per_lane > 0 ? given.per_lane : PER_LANE;
  const limits = {};

  for (const [lane, limit] of Object.entries(given.limits && typeof given.limits === "object" ? given.limits : {})) {
    if (Number.isSafeInteger(limit) && limit > 0) limits[lane] = limit;
  }

  return {
    laneField: laneField === null ? null : String(laneField),
    lanes: {
      order: list(lanes.order),
      hidden: list(lanes.hidden),
      collapsed: list(lanes.collapsed)
    },
    emptyLanes: given.empty_lanes === "hide" ? "hide" : "show",
    cardFields,
    totals: Array.isArray(given.totals) ? given.totals : ["count"],
    limits,
    order: given.order === "manual" ? "manual" : "sort",
    perLane,
    swimlaneField: given.swimlane_field ?? null
  };
}
/**
 * The lanes drawn, in order: the options' order first, then the field's own
 * option order, then a value only the answer knows (a new value joins at the
 * end). Hidden lanes go; empty ones too when empty_lanes is hide.
 */

function orderLanes({
  field = null,
  answered = [],
  options
}) {
  const known = new Map();

  for (const option of Array.isArray(field?.options) ? field.options : []) {
    const value = String(option.value ?? option.id ?? option.key ?? "");
    if (value) known.set(value, {
      value,
      label: String(option.label ?? option.title ?? value),
      scheme: option.scheme ?? null,
      status: option.status ?? null
    });
  }

  if (typeOf(field) === "boolean" && !known.size) {
    known.set("true", {
      value: "true",
      label: "true"
    });
    known.set("false", {
      value: "false",
      label: "false"
    });
  }

  const byValue = new Map((Array.isArray(answered) ? answered : []).map(lane => [String(lane.value), lane]));
  const values = [...new Set([...options.lanes.order, ...known.keys(), ...byValue.keys()])];
  return values.filter(value => !options.lanes.hidden.includes(value)).map(value => {
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
      limit: options.limits[value] ?? null
    };
  }).filter(lane => options.emptyLanes === "show" || lane.total > 0);
}
/**
 * Whether a record may go from one lane to another, by the host's rules
 * (study 5: describe().fields.<lane>.moves = {to: {from: [...], reason}}).
 * A soft limit never refuses (C304 (3)).
 */

function moveCheck(moves, from, to) {
  if (String(from) === String(to)) return {
    ok: true
  };
  const rule = moves && typeof moves === "object" ? moves[String(to)] : null;

  if (rule && Array.isArray(rule.from) && !rule.from.map(String).includes(String(from))) {
    return {
      ok: false,
      reason: String(rule.reason ?? "")
    };
  }

  if (rule && rule.allowed === false) return {
    ok: false,
    reason: String(rule.reason ?? "")
  };
  return {
    ok: true
  };
}
/** The lane head's count: «5» or, with a limit, «5 / 4» and over (C304 (3)). */

function laneCount(total, limit) {
  if (!limit) return {
    text: String(total),
    over: false
  };
  return {
    text: `${total} / ${limit}`,
    over: total > limit
  };
}
/**
 * Manual order inside a lane only when the options ask for it, the source has
 * an order field and no sort is on (C304 (2)).
 */

function manualOrder(options, orderField, sortActive) {
  return options.order === "manual" && Boolean(orderField) && !sortActive;
}
/** Money sums per currency (C294): {amount: {RUB: "1032390.50"}} -> ["1 032 390,50 ₽"]. */

function laneSums(totals, locale) {
  const lines = [];

  for (const byCurrency of Object.values(totals && typeof totals === "object" ? totals : {})) {
    if (!byCurrency || typeof byCurrency !== "object") continue;

    for (const [currency, amount] of Object.entries(byCurrency)) {
      const number = Number(amount);
      if (!Number.isFinite(number)) continue;

      try {
        lines.push(new Intl.NumberFormat(locale || undefined, {
          style: "currency",
          currency
        }).format(number));
      } catch {
        lines.push(`${number} ${currency}`);
      }
    }
  }

  return lines;
}
/** Fills {name} words. */

function format(text, values = {}) {
  return String(text ?? "").replace(/\{([a-z]+)\}/gu, (match, key) => key in values ? String(values[key]) : match);
}
/** The view's layout name read through the aliases; null for none. */

function layoutName(value) {
  if (value === null || value === undefined || value === "") return null;
  const name = String(value).trim().toLowerCase();
  return LAYOUT_ALIASES[name] ?? name;
}

/***/ },

/***/ "c1778d82ba00"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderViewBoardTemplate: () => (/* binding */ renderViewBoardTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("efa66f8927d1");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("d8ee53254f70");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);


 // The board: lanes in a row, each a sf-sortable list of cards (owner decisions
// C298, C304; study ui-control control/research/2026-11-17-board-view).
//
// A lane head is the lane's name as a tonal badge of its option's colour
// (C140), the count under the filter the host gives (with a soft limit «5 / 4»,
// C304 (3)), «+» and «⋯», and the money sums per currency (C294). A card is
// the Framework card (.sf-card) at the 1/2 rung: the selection box, the title
// that opens the record, «⋯», then up to four fields in the «Кратко» place
// (C300 (2)), each drawn by the Framework field renderers' cell output.
// On a phone (C304 (1)) the lanes stand one per screen under a lane switcher
// (sf-tabs with counts), and a swipe goes to the next lane.

function renderShape(shape, owner) {
  if (shape === null || shape === undefined || shape === false) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  if (typeof shape === "string" || typeof shape === "number") return String(shape);
  if (Array.isArray(shape)) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-board__values">${shape.map(item => renderShape(item, owner))}</span>`;
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
} // A card is content the board gives sf-sortable, not sf-sortable's own
// picture: slot="item" says so to the first paint (a printed board whose
// sf-sortable code came first lost its cards; the snapshot and the first
// render leave slotted children alone). sf-sortable draws no shadow root, so
// the attribute changes nothing else.


function renderCard(context, lane, record) {
  const component = context.component;
  const id = String(record.id);
  const title = component.recordTitle(record);
  const selected = context.selected.has(id);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-card sf-view-board__card" slot="item"
             data-sf-sortable-item=${id} data-id=${id}
             ?data-pending=${context.pending.has(id)}
             ?data-selected=${selected}>
            <div class="sf-view-board__top">
                ${context.selectable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-board__box">
                    <sf-checkbox size=${context.size} data-box=${id} ?checked=${selected}
                                 aria-label=${component.word("select-text", {
    title
  })}></sf-checkbox>
                </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                <button type="button" class="sf-view-board__title" data-open=${id}>${title}</button>
                <span class="sf-view-board__end"><sf-button-icon class="sf-view-board__menu" size=${context.size} appearance="ghost" scheme="on-surface-variant"
                                icon="more_horiz" data-menu=${id} aria-label=${component.word("card-menu-text", {
    title
  })}
                                tooltip=${component.word("actions-text")}></sf-button-icon></span>
            </div>
            ${context.cardFields.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-board__fields">
                ${context.cardFields.map(field => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-board__field" data-key=${String(field.key)}
                        data-align=${component.fieldAlign(field)}>${renderShape(component.cellShape(field, record), component)}</span>`)}
            </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>`;
}

function renderLane(context, lane, index) {
  const component = context.component;
  const count = component.laneCountOf(lane);

  if (lane.collapsed && !context.phone) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <button type="button" class="sf-view-board__folded" data-unfold=${lane.value} data-lane-index=${index}
                    aria-label=${component.word("expand-text", {
      lane: lane.label,
      count: lane.total
    })}>
                <span>${lane.label}</span><span>${lane.total}</span>
            </button>`;
  }

  const refusal = context.refusals.get(lane.value);
  const sums = component.laneSumsOf(lane);
  const shown = lane.records.length;
  const rest = Math.max(0, lane.total - shown);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section class="sf-view-board__lane" data-lane=${lane.value} data-lane-index=${index}
                 ?data-over=${count.over} ?data-refuse=${Boolean(refusal)}
                 aria-label=${component.word("lane-label", {
    lane: lane.label,
    count: lane.total
  })}>
            <div class="sf-view-board__head">
                <div class="sf-view-board__row">
                    <sf-badge appearance="tonal" size=${context.size} text=${lane.label}
                              status=${lane.status || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} scheme=${lane.scheme || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-badge>
                    <span class="sf-view-board__count">${count.text}</span>
                    ${context.creatable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="add"
                            data-add=${lane.value} aria-label=${component.word("add-text", {
    lane: lane.label
  })}
                            tooltip=${component.word("add-short-text")}></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="more_horiz"
                            data-lanemenu=${lane.value} aria-label=${component.word("lane-menu-text", {
    lane: lane.label
  })}
                            tooltip=${component.word("lane-short-text")}></sf-button-icon>
                </div>
                ${sums.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-board__sum">${sums.join(" · ")}</div>` : component.sumsAwaited ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-board__sum" data-pending aria-hidden="true">\u00a0</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            <div class="sf-view-board__note" aria-hidden=${refusal ? "false" : "true"}>${refusal ? component.word("refuse-text", {
    reason: refusal
  }) : ""}</div>
            <div class="sf-view-board__body">
                <sf-sortable class="sf-view-board__list" id=${`${context.uid}-lane-${index}`} group=${context.uid}
                             label=${lane.label} data-lane=${lane.value}>
                    ${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(lane.records, record => String(record.id), record => renderCard(context, lane, record))}
                </sf-sortable>
                ${lane.total === 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-board__empty">${component.word("empty-text")}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            ${rest > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-board__more">
                <sf-button size=${context.size} appearance="ghost" scheme="on-surface-variant" full-width
                           ?loading=${context.loadingLanes.has(lane.value)}
                           data-more=${lane.value} text=${component.word("more-text", {
    count: Math.min(rest, context.perLane)
  })}></sf-button>
            </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </section>`;
}

function renderBulk(context) {
  const component = context.component;
  const count = context.selected.size;

  if (context.bulkActions) {
    // sf-bulk-actions (C295), where the pair carries it: «Выбрано N»,
    // «Переместить в…» first, the host's actions after it, × and Escape.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-bulk-actions class="sf-view-board__bulk-bar" size=${context.size} place="dock" count=${count}
                                     .actions=${context.actions}></sf-bulk-actions>`;
  } // Without it (a pair before sf-bulk-actions): the same strip from
  // sf-button and sf-button-icon.


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-board__bulk" role="region" aria-label=${component.word("bulk-label")} ?hidden=${count === 0}>
            <span class="sf-view-board__bulk-count">${component.word("selected-text", {
    count
  })}</span>
            ${context.actions.map(action => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button size=${context.size} appearance="outline" scheme="on-surface"
                    icon=${action.icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} text=${action.text} data-bulk=${action.id}></sf-button>`)}
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="close"
                            data-clear aria-label=${component.word("clear-text")} tooltip=${component.word("clear-text")}></sf-button-icon>
        </div>`;
}

function renderViewBoardTemplate(context) {
  const lanes = context.lanes;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-board" data-size=${context.size} ?data-phone=${context.phone}
             ?data-dragging=${context.dragging} ?data-selecting=${context.selected.size > 0}>
            ${context.phone ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-board__switch-row"><sf-tabs class="sf-view-board__switch" type="pills" size=${context.size} overflow="scroll"
                    aria-label=${component(context).word("lanes-label")} active-index=${String(context.phoneIndex)}
                    items=${JSON.stringify(lanes.map(lane => ({
    id: lane.value,
    label: lane.label,
    count: lane.total
  })))}></sf-tabs></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <div class="sf-view-board__lanes" role="region" aria-label=${context.label}>
                ${lanes.map((lane, index) => renderLane(context, lane, index))}
            </div>
            <div class="sf-view-board__live" role="status" aria-live="polite">${context.message}</div>
            ${context.selectable && (context.selected.size > 0 || !context.bulkActions) ? renderBulk(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>`;
}

function component(context) {
  return context.component;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d8ee53254f70"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "efa66f8927d1"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/repeat.js", 1).then(resolve, reject), { once: true })));

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

/***/ "6169da476610"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.view-board","tag":"sf-view-board","version":"1.4.0","kind":"leaf","settings":{"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"title-field":{"type":"string","default":"title"},"order-field":{"type":"string","default":""},"sort-active":{"type":"boolean","default":false},"selectable":{"type":"boolean","default":true},"creatable":{"type":"boolean","default":false},"movable":{"type":"boolean","default":true},"lanes":{"type":"list","default":[],"of":{"value":"string","label":{"type":"string","optional":true},"total":{"type":"number","optional":true},"totals":{"type":"object","optional":true},"records":"list","cursor":{"type":"any","nullable":true,"optional":true}}},"fields":{"type":"list","default":[],"of":{"key":"string","label":{"type":"string","optional":true},"propertyType":{"type":"string","optional":true},"options":{"type":"list","optional":true}}},"options":{"type":"object","default":{}},"moves":{"type":"object","default":{}},"actions":{"type":"list","default":[],"of":{"id":"id","text":"string","icon":{"type":"icon","optional":true}}},"selected":{"type":"list","default":[]},"sums-pending":{"type":"boolean","default":false}},"values":{},"events":{"move":{"carries":{"id":"id","field":"string","from":"string","to":"string","before":{"type":"id","nullable":true},"revision":{"type":"any","nullable":true},"how":"string"},"cancelable":true},"open":{"carries":{"id":"id"}},"create":{"carries":{"field":"string","value":"string"},"own-verb":true},"more":{"carries":{"lane":"string","cursor":{"type":"any","nullable":true},"offset":"number"},"own-verb":true},"select":{"carries":{"ids":"list"}},"save":{"carries":{"collapsed":"list","hidden":"list","order":"list"}},"apply":{"carries":{"action":"id","ids":"list","scope":"string"},"own-verb":true}},"actions":{"settle-move":{"with":{"id":"id","result":"object"}},"append-lane":{"with":{"lane":"string","records":"list","cursor":{"type":"any","nullable":true},"total":"number"}},"set-lane-totals":{"with":{"lanes":"list"}}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"host-states":{},"css-variables":{"--sf-view-board-lane-width":{"type":"length","state":"default"},"--sf-view-board-gap":{"type":"length","state":"default"},"--sf-view-board-lane-background":{"type":"color","state":"default"},"--sf-view-board-lane-radius":{"type":"length","state":"default"},"--sf-view-board-refused-opacity":{"type":"number","state":"default"}}}');

/***/ },

/***/ "21765acb70ff"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Kanban","runtime":{"actions-text":"Actions","add-short-text":"Add","add-text":"New record in “{lane}”","board-label":"Kanban","bulk-label":"Actions on the selection","card-menu-text":"Actions: {title}","clear-text":"Clear selection","collapse-text":"Collapse lane","collapsed-text":"Lane “{lane}” collapsed","empty-text":"Empty","expand-text":"Expand “{lane}”, {count}","expanded-text":"Lane “{lane}” expanded","hidden-text":"Lane “{lane}” hidden; bring it back in “View”","shown-text":"Lane “{lane}” is back on the board","hide-hint":"Bring it back in “View”","hide-text":"Hide lane","lane-label":"{lane}, {count}","lane-menu-text":"Lane “{lane}”","lane-short-text":"Lane","lanes-label":"Board lanes","more-text":"Show {count} more","move-selected-text":"Move to…","move-to-text":"Move to","moved-text":"{title} moved to “{lane}”, {index} of {count}","new-text":"New record","no-move-text":"No permission to change","not-moved-text":"{title} not moved: {reason}","open-text":"Open","placed-text":"{title}: place {index} in the lane","refuse-default":"Not allowed here","refuse-text":"Not allowed: {reason}","select-text":"Select {title}","selected-text":"{count} selected","sorted-text":"The lane follows the sort: {title} stays in place","to-end-text":"To the end of the lane","to-start-text":"To the start of the lane"}}');

/***/ },

/***/ "b04d01ca8dbb"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Канбан","runtime":{"actions-text":"Действия","add-short-text":"Добавить","add-text":"Новая запись в «{lane}»","board-label":"Канбан","bulk-label":"Действия с выбранными","card-menu-text":"Действия: {title}","clear-text":"Снять выбор","collapse-text":"Свернуть колонку","collapsed-text":"Колонка «{lane}» свёрнута","empty-text":"Пусто","expand-text":"Развернуть «{lane}», {count}","expanded-text":"Колонка «{lane}» развёрнута","hidden-text":"Колонка «{lane}» скрыта, вернуть — в «Вид»","shown-text":"Колонка «{lane}» снова на доске","hide-hint":"Вернуть — в «Вид»","hide-text":"Скрыть колонку","lane-label":"{lane}, {count}","lane-menu-text":"Колонка «{lane}»","lane-short-text":"Колонка","lanes-label":"Колонки доски","more-text":"Показать ещё {count}","move-selected-text":"Переместить в…","move-to-text":"Переместить в","moved-text":"{title} — в «{lane}», {index} из {count}","new-text":"Новая запись","no-move-text":"Нет права менять","not-moved-text":"{title} — не перенесено: {reason}","open-text":"Открыть","placed-text":"{title} — {index}-е место в колонке","refuse-default":"Сюда нельзя","refuse-text":"Нельзя: {reason}","select-text":"Выбрать {title}","selected-text":"Выбрано {count}","sorted-text":"Порядок в колонке задаёт сортировка: {title} — на месте","to-end-text":"В конец колонки","to-start-text":"В начало колонки"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("0f7b12a8175f");
/******/
/******/ })()
;