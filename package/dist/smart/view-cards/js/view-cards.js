/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "3afa80f65162"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("06a40de06677");
/* harmony import */ var _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("1ceb0d874bb8");
/* harmony import */ var _js_cards_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("843db349f3fc");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("e1bd4ec6daa1");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("8145de20b1c3");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("04b9406f6fec");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__, _js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__);
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
// every Framework language pack), and inside sf-view, whose footer says the
// count, the «Показать ещё» button alone; empty states are sf-empty-state; the card
// menu is SF.menu.open; the selection bar is sf-bulk-actions (C295) where the
// pair has it, else the same strip of sf-button.








const CardsElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_5__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_6__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_7__
  },
  source: "ru"
});
const CARD = ".sf-view-cards__card:not(.sf-view-cards__skeleton)";
const SKELETONS = 8;

const copy = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

const own = (element, name) => Object.prototype.hasOwnProperty.call(element, name);

const escape = value => globalThis.CSS?.escape ? globalThis.CSS.escape(String(value)) : String(value).replace(/["\\]/gu, "\\$&"); // Whether the pair carries sf-bulk-actions (C295): defined, or a rule the
// Loader can fetch. Before it, the cards draw the same strip themselves.


function bulkActionsAvailable() {
  return Boolean(globalThis.customElements?.get?.("sf-bulk-actions") || globalThis.SF?.RuleLoader?.["cl-bulk-actions"]);
}

class SfViewCards extends CardsElement {
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
  } // ── data ───────────────────────────────────────────────────────────────

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
    const ids = new Set(this._records.map(record => String(record.id))); // Under keep-selection the marks of other pages stay (sf-view, LV2-2).

    if (!this.hasAttribute("keep-selection")) for (const id of [...this._selected]) if (!ids.has(id)) this._selected.delete(id);
    if (this._active !== null && !ids.has(this._active)) this._active = null;
    this.requestComponentUpdate("records");
  }
  /** The host's next page, appended (the answer to more, when no sf-view keeps the list). */


  appendRecords(list, {
    total,
    hasNext
  } = {}) {
    if (!Array.isArray(list)) return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.refused)("not-a-list");
    const known = new Set(this.records.map(record => String(record.id)));
    this._records = [...this.records, ...copy(list).filter(record => !known.has(String(record.id)))];
    if (Number.isSafeInteger(total)) this.setAttribute("total", String(total));
    if (typeof hasNext === "boolean") this.setAttribute("has-next", hasNext ? "true" : "false");
    this._loadingMore = false;
    this.requestComponentUpdate("more");
    return (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.applied)();
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
    this._fields = Array.isArray(value) ? value.map(field => ({ ...field
    })) : [];
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


  get actions() {
    return this._actions;
  }

  set actions(value) {
    this._actions = Array.isArray(value) ? value.filter(action => action && (action.id ?? action.value) !== undefined).map(action => ({ ...action,
      id: String(action.id ?? action.value),
      text: action.text ?? action.label ?? String(action.id ?? action.value)
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
  /** The record open in the record card beside the list (C305): its card is marked. */


  get current() {
    return this._current;
  }

  set current(value) {
    const id = value === null || value === undefined ? "" : String(value);
    if (id === this._current) return;
    this._current = id;
    this.requestComponentUpdate("current");
  }
  /** Why the list is empty or failed, as sf-view knows it: {kind: no-data|nothing-found|no-access|error, message?}. */


  get emptyContext() {
    return this._empty;
  }

  set emptyContext(value) {
    this._empty = value && typeof value === "object" ? { ...value
    } : null;
    this.requestComponentUpdate("empty");
  }

  get cardsOptions() {
    const options = (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_4__.cardsOptions)(this.options, this.fields);
    const size = this.getAttribute("card-size");
    if (["s", "m", "l"].includes(size)) options.size = size;
    return options;
  } // ── what the template asks ─────────────────────────────────────────────


  word(key, vars = {}) {
    return (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_4__.format)(this.sfWord(key), vars);
  }

  recordTitle(record) {
    return (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_4__.titleOf)(record, this.cardsOptions.titleField);
  }

  coverOf(record) {
    const key = this.cardsOptions.coverField;
    return key ? (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_4__.coverOf)(record?.[key]) : null;
  }

  fieldAlign(field, index = 1) {
    return (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_4__.fieldAlign)(field, index);
  } // A card field in the «Кратко» place: the Framework field renderers' cell
  // output (C300 (2)); text where they answer nothing. A template per field
  // (C302) comes with the template registry.


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
    const known = new Map(this.fields.map(field => [String(field.key), field]));
    const cardFields = options.cardFields.map(key => known.get(key)).filter(Boolean);
    const state = this.getAttribute("data-state") ?? "";
    const loading = state === "loading";
    const total = this.total;
    const countKnown = this.getAttribute("count-known") !== "false" && this.hasAttribute("total");
    const pages = Math.max(1, Math.ceil(records.length / options.perPage));
    const empty = !records.length && ["empty", "error", "no-access"].includes(state) ? this._empty ?? {
      kind: state === "error" ? "error" : state === "no-access" ? "no-access" : "no-data"
    } : null;
    if (empty && state === "error") empty.kind = "error";
    if (this._active === null || !records.some(record => String(record.id) === this._active)) this._active = records.length ? String(records[0].id) : null;
    return {
      component: this,
      size: this.getProp("size") === "1" ? "1" : "1/2",
      cardSize: options.size,
      fit: options.cover.fit,
      ratio: _js_cards_js__WEBPACK_IMPORTED_MODULE_4__.RATIOS[options.cover.ratio],
      density: options.density,
      cover: Boolean(options.coverField),
      labels: options.cardLabels,
      label: this.getAttribute("aria-label") ? `${this.getAttribute("aria-label")}, ${total}` : this.word("cards-label", {
        count: total
      }),
      records,
      total,
      hasNext: this.hasNext,
      countKnown,
      perPage: options.perPage,
      portions: pages,
      more: records.length > 0 && (this.hasNext || records.length > options.perPage),
      // Inside sf-view the footer says «1–24 из 60»: the grid keeps the
      // button and drops its own «Показано 24 из 60» (view site round).
      inView: Boolean(this.closest?.("sf-view")),
      moreText: countKnown ? this.word("more-text", {
        count: Math.max(1, Math.min(options.perPage, total - records.length))
      }) : this.word("more-plain-text"),
      loadingMore: this._loadingMore,
      loading,
      skeletons: SKELETONS,
      empty,
      cardFields,
      // All under the filter draws every card marked (LV2-7).
      selected: this.allSelected ? new Set([...this._selected, ...records.map(record => String(record.id))]) : this._selected,
      allSelected: this.allSelected,
      current: this._current,
      active: this._active,
      message: this._message,
      selectable: this.getProp("selectable") !== false,
      creatable: this.getProp("creatable") === true,
      bulkActions: bulkActionsAvailable(),
      // The list's own bar stands for the cards under sf-view (bulk-bar
      // false): one bar, not two (owner, 2026-11-22).
      bulkBar: this.getAttribute("bulk-bar") !== "false",
      actions: this._actions
    };
  }

  template() {
    return (0,_js_templates_default_js__WEBPACK_IMPORTED_MODULE_3__.renderViewCardsTemplate)(this.templateContext());
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
      signal
    });
    this.addEventListener("focusin", event => this._onFocus(event), {
      signal
    });
    this.addEventListener("contextmenu", event => this._onContextMenu(event), {
      signal
    });
    this.addEventListener("sf-pagination-load-more", event => this._onMore(event), {
      signal
    });
    this.addEventListener("sf-empty-state-action", event => this._onEmptyAction(event), {
      signal
    });
    this.addEventListener("sf-bulk-actions-action", event => this._onBulkAction(event), {
      signal
    });
    this.addEventListener("sf-bulk-actions-clear", () => this.clearSelection(), {
      signal
    });
    this.addEventListener("sf-bulk-actions-select-all", () => this._selectAll(true), {
      signal
    });
    this.addEventListener("sf-bulk-actions-select-page", () => this._selectAll(false), {
      signal
    });
    const tags = ["sf-checkbox", "sf-button", "sf-button-icon", "sf-icon", "sf-pagination", "sf-empty-state", "sf-skeleton", "sf-menu-context"];
    if (bulkActionsAvailable()) tags.push("sf-bulk-actions");
    globalThis.SF?.Loader?.ensure?.(tags); // The inner controls of a card take no Tab stop of their own (CD-6):
    // they are quieted again whenever a card's control draws its markup.

    if (typeof MutationObserver === "function") {
      this._quiet = new MutationObserver(() => this._quietControls());

      this._quiet.observe(this, {
        childList: true,
        subtree: true
      });
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

    this._keepMoreFocus();
  } // The more button is busy while the page loads and the focus falls to the
  // page; once the cards are drawn it goes back to the button (or, on the
  // last page, to the first card that arrived).


  _keepMoreFocus() {
    if (!this._refocusMore || this._loadingMore) return;
    this._refocusMore = false;
    const active = document.activeElement;
    if (active && active !== document.body && !this.contains(active)) return; // After the button itself has drawn without its busy state.

    requestAnimationFrame(() => {
      const button = this.querySelector(".sf-view-cards__more sf-button button");
      if (button && !button.disabled) return void button.focus({
        preventScroll: true
      });
      this._cards().at(-1)?.focus?.({
        preventScroll: true
      });
    });
  }

  _quietControls() {
    for (const node of this.querySelectorAll(".sf-view-cards__card :is(input, button, a[href], [tabindex]:not(.sf-view-cards__card))")) {
      if (node.getAttribute("tabindex") !== "-1") node.setAttribute("tabindex", "-1");
    }
  } // ── keys and the one Tab stop (CD-6) ───────────────────────────────────


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

  _go(card, {
    announce = true
  } = {}) {
    if (!card) return;
    const id = card.dataset.id;
    this._active = id;

    for (const other of this._cards()) other.setAttribute("tabindex", other === card ? "0" : "-1");

    card.focus({
      preventScroll: false
    });
    card.scrollIntoView?.({
      block: "nearest",
      inline: "nearest"
    });

    if (announce) {
      const record = this._record(id);

      this._say(this.word("position-text", {
        title: this.recordTitle(record),
        index: Number(card.dataset.index) + 1,
        count: this.total
      }));
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
    } // A card's own control (its box, its menu) keeps its keys; Escape
    // goes back to the card.


    if (target !== card) {
      if (event.key === "Escape") {
        event.preventDefault();

        this._go(card, {
          announce: false
        });
      }

      return;
    }

    const id = card.dataset.id;

    if (event.shiftKey && event.key === "F10" || event.key === "ContextMenu") {
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
      if (event.shiftKey && this._anchor !== null) this._selectRange(this._anchor, id);else this.toggleSelected(id);
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
    const to = (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_4__.gridStep)(event.key, index, {
      count: cards.length,
      columns,
      ctrl: event.ctrlKey || event.metaKey,
      rtl,
      page: rows
    });
    if (to === null) return;
    event.preventDefault();
    event.stopPropagation();
    if (to !== index) this._go(cards[to]);
  } // ── clicks and menus ───────────────────────────────────────────────────


  _onClick(event) {
    const control = event.target.closest?.("[data-menu], [data-box], [data-bulk], [data-clear], [data-more]");

    if (control && this.contains(control)) {
      const data = control.dataset;

      if (control.hasAttribute("data-more")) {
        this._refocusMore = true;
        this.showMore();
      } else if (data.menu) this.openCardMenu(data.menu, control);else if (data.bulk) this._apply(data.bulk);else if (control.hasAttribute("data-clear")) this.clearSelection(); // The box is answered by its change event.


      return;
    }

    if (event.target.closest?.(".sf-view-cards__box, .sf-view-cards__menu")) return;
    const card = event.target.closest?.(CARD);
    if (!card || !this.contains(card)) return;
    this._active = card.dataset.id;

    if ((event.shiftKey || event.ctrlKey || event.metaKey) && this.getProp("selectable") !== false) {
      if (event.shiftKey && this._anchor !== null) this._selectRange(this._anchor, card.dataset.id);else this.toggleSelected(card.dataset.id);
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
    return this.records.find(record => String(record.id) === String(id)) ?? null;
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
    if (this.sfEmit("menu", {
      id: key
    }, {
      cancelable: true
    }) === false) return Promise.resolve(null);
    const title = this.recordTitle(record);

    const selected = this._selected.has(key);

    const entries = [{
      id: "open",
      text: this.word("open-text"),
      icon: "open_in_new"
    }];
    if (this.getProp("selectable") !== false) entries.push({
      id: "select",
      text: this.word(selected ? "deselect-text" : "select-short-text"),
      icon: selected ? "check_box_outline_blank" : "check_box"
    });

    if (this._actions.length) {
      entries.push({
        type: "separator"
      });

      for (const action of this._actions) entries.push({
        id: `act:${action.id}`,
        text: action.text,
        ...(action.icon ? {
          icon: action.icon
        } : {}),
        ...(action.status ? {
          status: action.status
        } : {})
      });
    }

    const card = this.querySelector(`${CARD}[data-id="${escape(key)}"]`);
    return this._menu({ ...(point ? {
        x: point[0],
        y: point[1]
      } : {
        anchor: anchor ?? card ?? this
      }),
      entries,
      label: title
    }).then(chosen => {
      const choice = chosen?.id;

      if (!choice) {
        if (card && !point) this._go(card, {
          announce: false
        });
        return null;
      }

      if (choice === "open") return this.openRecord(key, "menu");
      if (choice === "select") return this.toggleSelected(key);
      if (choice.startsWith("act:")) return this.sfEmit("apply", {
        action: choice.slice(4),
        ids: [key],
        scope: "record"
      });
      return null;
    });
  } // ── what the cards ask the host ────────────────────────────────────────

  /** Opens a record: sf-view-cards-open {id, trigger}; the host (sf-view) opens the record card (C305). */


  openRecord(id, trigger = "api") {
    this._active = String(id);
    return this.sfEmit("open", {
      id: String(id),
      trigger: String(trigger)
    });
  } // sf-pagination's «Показать ещё» inside the cards is the cards' own ask.


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
    return this.sfEmit("more", {
      page: Math.ceil(this.records.length / per) + 1,
      offset: this.records.length,
      per_page: per
    });
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
  } // ── selection (CD-6, C295) ─────────────────────────────────────────────


  toggleSelected(id) {
    this._setSelected(id, !this._selected.has(String(id)));
  } // Every record under the filter marked (all-selected, LV2-7): every card
  // is drawn marked; unmarking one ends it, the others of the page stay.


  get allSelected() {
    return this.hasAttribute("all-selected");
  }

  _endAll() {
    if (!this.allSelected) return false;
    this.removeAttribute("all-selected");

    for (const record of this.records) this._selected.add(String(record.id));

    return true;
  } // «Выбрать все N» from the list's bar (sf-view, bulk-bar false): every
  // record under the filter marked, or back to the marks of the page.


  selectAll(on = true) {
    this._selectAll(Boolean(on));
  }

  _selectAll(on) {
    if (on === this.allSelected) return;
    this.toggleAttribute("all-selected", on);
    if (on) for (const record of this.records) this._selected.add(String(record.id));
    this.requestComponentUpdate("selected");
    this.sfEmit("select", {
      ids: [...this._selected],
      all: on
    });
  }

  _setSelected(id, on, {
    announce = true
  } = {}) {
    const key = String(id);
    this._anchor = key;

    const ended = this._endAll();

    if (on === this._selected.has(key) && !ended) return;
    if (on) this._selected.add(key);else this._selected.delete(key);

    if (announce) {
      const title = this.recordTitle(this._record(key));

      this._say(this.word(on ? "selected-one-text" : "unselected-one-text", {
        title,
        count: this._selected.size
      }));
    }

    this.requestComponentUpdate("selected");
    this.sfEmit("select", {
      ids: [...this._selected],
      ...(ended ? {
        all: false
      } : {})
    });
  }

  _selectRange(from, to) {
    const ids = this.records.map(record => String(record.id));
    const a = ids.indexOf(String(from));
    const b = ids.indexOf(String(to));
    if (a < 0 || b < 0) return this.toggleSelected(to);

    for (const id of ids.slice(Math.min(a, b), Math.max(a, b) + 1)) this._selected.add(id);

    this._say(this.word("selected-text", {
      count: this._selected.size
    }));

    this.requestComponentUpdate("selected");
    this.sfEmit("select", {
      ids: [...this._selected]
    });
    return undefined;
  }

  clearSelection() {
    const all = this.allSelected;
    this.removeAttribute("all-selected");
    if (!this._selected.size && !all) return;

    this._selected.clear();

    this._anchor = null;

    this._say(this.word("cleared-text"));

    this.requestComponentUpdate("selected");
    this.sfEmit("select", {
      ids: [],
      ...(all ? {
        all: false
      } : {})
    });
    const card = this.querySelector(`${CARD}[data-id="${escape(this._active ?? "")}"]`);
    if (card && this.contains(this.ownerDocument?.activeElement)) this._go(card, {
      announce: false
    });
  }

  _onBulkAction(event) {
    const id = event.detail?.id;
    if (id === undefined) return;

    this._apply(String(id), event.detail?.scope ?? "selection");
  }

  _apply(action, scope = "selection") {
    // All under the filter: the action is for every record (LV2-7).
    const asked = this.allSelected && scope !== "record" ? "all" : scope;
    return this.sfEmit("apply", {
      action: String(action),
      ids: [...this._selected],
      scope: asked
    });
  } // ── messages ───────────────────────────────────────────────────────────


  _say(text) {
    this._message = String(text ?? "");
    this.requestComponentUpdate("message");
  }
  /** How many columns a phone draws for the card size (C306). */


  get phoneColumns() {
    return (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_4__.phoneColumns)(this.cardsOptions.size);
  }

}

SfViewCards.define("sf-view-cards");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "843db349f3fc"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CARD_FIELDS_MAX: () => (/* binding */ CARD_FIELDS_MAX),
/* harmony export */   FITS: () => (/* binding */ FITS),
/* harmony export */   PER_PAGE: () => (/* binding */ PER_PAGE),
/* harmony export */   RATIOS: () => (/* binding */ RATIOS),
/* harmony export */   SIZES: () => (/* binding */ SIZES),
/* harmony export */   cardsOptions: () => (/* binding */ cardsOptions),
/* harmony export */   coverOf: () => (/* binding */ coverOf),
/* harmony export */   fieldAlign: () => (/* binding */ fieldAlign),
/* harmony export */   fileIcon: () => (/* binding */ fileIcon),
/* harmony export */   format: () => (/* binding */ format),
/* harmony export */   gridStep: () => (/* binding */ gridStep),
/* harmony export */   isImageField: () => (/* binding */ isImageField),
/* harmony export */   phoneColumns: () => (/* binding */ phoneColumns),
/* harmony export */   titleOf: () => (/* binding */ titleOf),
/* harmony export */   typeOf: () => (/* binding */ typeOf)
/* harmony export */ });
// The cards layout's reading of its options and of a record, kept apart from
// the element so a unit can hold it without a page (owner decisions C297,
// C306, C300, C302; study ui-control control/research/2026-11-18-cards-view,
// section 5; options under layouts.cards of the draft simai.view-config/1).
//
// Nothing here draws or asks the host: it reads the options, picks the cover
// of a record, says how a field is aligned, which card is next to which, and
// the words of an announcement.
const PER_PAGE = 24;
const CARD_FIELDS_MAX = 4;
const SIZES = Object.freeze(["s", "m", "l"]);
const RATIOS = Object.freeze({
  "1:1": "1 / 1",
  "4:3": "4 / 3",
  "3:4": "3 / 4",
  "16:9": "16 / 9"
});
const FITS = Object.freeze(["cover", "contain"]); // A field of one of these types reads as a number or a date: it stands at the
// end of its row, in tabular digits (study 5, «Decided by the helper»).

const NUMERIC = new Set(["integer", "number", "decimal", "money", "percent", "date", "datetime", "time", "duration", "file"]); // File templates whose value is a picture (C302).

const IMAGE_TEMPLATES = new Set(["image", "image_card", "image_list", "image-card", "image-list"]);
const IMAGE_FILE = /\.(avif|bmp|gif|jpe?g|png|svg|webp)(\?|#|$)/iu;

const list = value => Array.isArray(value) ? value.map(item => String(item)) : [];

const typeOf = field => String(field?.propertyType ?? field?.property_type ?? field?.type ?? "");
/** Whether a field holds pictures: a file field in an image template (variant, template). */

function isImageField(field) {
  if (!field || typeOf(field) !== "file" && typeOf(field) !== "image") return false;
  if (typeOf(field) === "image") return true;
  return IMAGE_TEMPLATES.has(String(field.variant ?? field.template ?? ""));
}
/**
 * layouts.cards of view-config/1 with its defaults (study 5, the options table;
 * C306: size S/M/L, fit cover by default, «Показать ещё»).
 * cover_field: a file field or null; unset, the first image field, else none.
 */

function cardsOptions(options = {}, fields = []) {
  const given = options && typeof options === "object" && !Array.isArray(options) ? options : {};
  const known = new Map(fields.map(field => [String(field.key), field]));
  const titleField = given.title_field !== undefined && given.title_field !== null ? String(given.title_field) : String(fields.find(field => field.title === true)?.key ?? (known.has("title") ? "title" : known.has("name") ? "name" : "title"));
  let coverField = null;

  if (Object.hasOwn(given, "cover_field")) {
    coverField = given.cover_field === null || given.cover_field === "" ? null : String(given.cover_field);
  } else {
    coverField = fields.find(field => isImageField(field))?.key ?? null;
    if (coverField !== null) coverField = String(coverField);
  }

  const cover = given.cover && typeof given.cover === "object" ? given.cover : {};
  const fit = FITS.includes(cover.fit) ? cover.fit : "cover";
  const ratio = Object.hasOwn(RATIOS, cover.ratio) ? cover.ratio : "4:3";
  const shown = fields.filter(field => String(field.key) !== titleField && String(field.key) !== coverField && field.title !== true && field.visible !== false && field.hidden !== true);
  const cardFields = (Array.isArray(given.card_fields) ? list(given.card_fields) : shown.map(field => String(field.key))).filter(key => key !== titleField && key !== coverField && (!known.size || known.has(key))).slice(0, CARD_FIELDS_MAX);
  const perPage = Number.isSafeInteger(given.per_page) && given.per_page > 0 ? given.per_page : PER_PAGE;
  return {
    coverField,
    cover: {
      fit,
      ratio
    },
    titleField,
    cardFields,
    // Labels over their values unless the view turns them off (D3).
    cardLabels: given.card_labels !== false,
    size: SIZES.includes(String(given.size)) ? String(given.size) : "m",
    density: given.density === "compact" ? "compact" : "default",
    // Only «Показать ещё» is drawn (C306); a written pages is kept for
    // the settings it came from and read as the button.
    more: "button",
    perPage
  };
}
/** How many columns a phone draws (C306, q-phone В): S two, M and L one. */

function phoneColumns(size) {
  return size === "s" ? 2 : 1;
}
/**
 * A record's cover from its file value: {src, width, height} for a picture,
 * {icon} for another file (its type's icon on the tint), null for none.
 * A list takes its first picture (else its first file). A host gives a
 * thumbnail of the width needed in thumb {"480": href}.
 */

function coverOf(value, width = 480) {
  if (value === null || value === undefined || value === "") return null;

  if (Array.isArray(value)) {
    const files = value.filter(item => item !== null && item !== undefined && item !== "");
    return coverOf(files.find(item => pictureOf(item)) ?? files[0] ?? null, width);
  }

  if (typeof value === "string") return IMAGE_FILE.test(value) || value.startsWith("data:image/") ? {
    src: value
  } : {
    icon: fileIcon("", value)
  };
  if (typeof value !== "object") return null;
  const picture = pictureOf(value);

  if (picture) {
    const thumb = value.thumb && typeof value.thumb === "object" ? thumbFor(value.thumb, width) : null;

    const size = key => Number.isFinite(Number(value[key])) && Number(value[key]) > 0 ? Math.round(Number(value[key])) : null;

    return {
      src: thumb ?? picture,
      width: size("width") ?? size("w"),
      height: size("height") ?? size("h")
    };
  }

  return {
    icon: fileIcon(value.mime ?? value.type ?? "", value.label ?? value.name ?? value.href ?? "")
  };
}

function pictureOf(value) {
  if (!value || typeof value !== "object") return typeof value === "string" && IMAGE_FILE.test(value) ? value : null;
  const href = value.href ?? value.url ?? value.src ?? null;
  if (!href) return null;
  const mime = String(value.mime ?? value.type ?? "");
  if (mime.startsWith("image/")) return String(href);
  if (!mime && (IMAGE_FILE.test(String(href)) || String(href).startsWith("data:image/") || IMAGE_FILE.test(String(value.label ?? value.name ?? "")))) return String(href);
  return null;
} // The smallest thumbnail at least as wide as the frame, else the widest.


function thumbFor(thumb, width) {
  const entries = Object.entries(thumb).map(([key, href]) => [Number.parseInt(key, 10), href]).filter(([key, href]) => Number.isFinite(key) && href);
  if (!entries.length) return null;
  entries.sort((a, b) => a[0] - b[0]);
  return String((entries.find(([key]) => key >= width) ?? entries[entries.length - 1])[1]);
}
/** The Material Symbols name of a file's type, for a cover that is not a picture. */


function fileIcon(mime = "", name = "") {
  const type = String(mime).toLowerCase();
  const file = String(name).toLowerCase();
  if (type === "application/pdf" || file.endsWith(".pdf")) return "picture_as_pdf";
  if (type.startsWith("video/")) return "movie";
  if (type.startsWith("audio/")) return "audio_file";
  if (/spreadsheet|excel|csv/u.test(type) || /\.(xlsx?|csv|ods)$/u.test(file)) return "table_chart";
  if (/zip|compressed|tar/u.test(type) || /\.(zip|rar|7z|tar|gz)$/u.test(file)) return "folder_zip";
  return "description";
}
/**
 * Where a field stands on its row: the first column at its start whatever it
 * holds; in the second, numbers, dates and files at the end (VC-1, the
 * accepted prototype's END).
 */

function fieldAlign(field, index = 1) {
  return NUMERIC.has(typeOf(field)) && index % 2 === 1 ? "end" : "start";
}
/** A record's title from the title field (else title, name, id), as text. */

function titleOf(record, key = "title") {
  const value = record?.[key] ?? record?.title ?? record?.name ?? record?.id;
  if (value && typeof value === "object") return String(value.label ?? value.title ?? value.name ?? "");
  return String(value ?? "");
}
/**
 * The card a key goes to in a grid of `count` cards drawn in rows of
 * `columns` (C146 (8): one Tab stop, the arrows by the rows as drawn).
 * Returns the index, or null for a key the grid does not take.
 */

function gridStep(key, index, {
  count,
  columns,
  ctrl = false,
  rtl = false,
  page = 3
}) {
  const n = Math.max(1, columns | 0);
  if (count <= 0) return null;
  const rowStart = index - index % n;
  const left = rtl ? 1 : -1;
  let to = null;

  switch (key) {
    case "ArrowRight":
      to = index - left;
      break;

    case "ArrowLeft":
      to = index + left;
      break;

    case "ArrowDown":
      to = index + n;
      break;

    case "ArrowUp":
      to = index - n;
      break;

    case "Home":
      to = ctrl ? 0 : rowStart;
      break;

    case "End":
      to = ctrl ? count - 1 : Math.min(count - 1, rowStart + n - 1);
      break;

    case "PageDown":
      to = Math.min(count - 1, index + n * page);
      break;

    case "PageUp":
      to = Math.max(0, index - n * page);
      break;

    default:
      return null;
  }

  if (to < 0 || to >= count) return index;
  return to;
}
/** A word with {name} placeholders filled in. */

function format(text, vars = {}) {
  return String(text ?? "").replace(/\{([a-z]+)\}/gu, (whole, name) => Object.hasOwn(vars, name) ? String(vars[name]) : whole);
}

/***/ },

/***/ "1ceb0d874bb8"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderViewCardsTemplate: () => (/* binding */ renderViewCardsTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("efa66f8927d1");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("43468444d233");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__);


 // The cards: a grid of record cards (owner decisions C297, C306; study
// ui-control control/research/2026-11-18-cards-view, accepted page
// ui-doc.test/proto/cards-view-study.html).
//
// A card is the Framework card (.sf-card) at the 1/2 rung: the cover the
// layout draws (a frame of one ratio, the picture cropped or whole on a tint,
// lazy; CD-3), the selection box and «⋯» in the cover's corners, the title in
// two lines, then up to four fields in the «Кратко» place (C300 (2)), each
// drawn by the Framework field renderers' cell output. Without a cover field
// the box and «⋯» stand on the title's row. Under the grid sf-pagination in
// its more look says «Показать ещё 24» and «Показано 24 из 40» (C306, the
// Framework's words in every language pack); inside sf-view, whose footer
// already says «1–24 из 40», only the «Показать ещё 24» button stays, so the
// count is said once. An empty list is sf-empty-state.

function renderShape(shape, owner) {
  if (shape === null || shape === undefined || shape === false) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  if (typeof shape === "string" || typeof shape === "number") return String(shape);
  if (Array.isArray(shape)) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-cards__values">${shape.map(item => renderShape(item, owner))}</span>`;
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

function renderCover(context, record) {
  const component = context.component;
  const cover = component.coverOf(record); // The frame keeps its ratio whether the picture has come or not (CD-3):
  // nothing below it moves when it arrives.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-cards__cover" aria-hidden="true">
        ${cover?.src ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<img class="sf-view-cards__image" src=${cover.src} alt="" loading="lazy" decoding="async"
                                width=${cover.width ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing} height=${cover.height ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-cards__none">
                <sf-icon icon=${cover?.icon ?? "image_not_supported"} size="1" aria-hidden="true"></sf-icon>
                ${cover?.icon ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span>${component.word("no-cover-text")}</span>`}
            </span>`}
    </div>`;
}

function renderControls(context, record, title) {
  const component = context.component;
  const id = String(record.id);
  const selected = context.selected.has(id);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        ${context.selectable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-cards__box">
            <sf-checkbox size=${context.size} data-box=${id} ?checked=${selected}
                         aria-label=${component.word("select-text", {
    title
  })}></sf-checkbox>
        </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <span class="sf-view-cards__menu">
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="more_horiz"
                            data-menu=${id} aria-label=${component.word("card-menu-text", {
    title
  })}
                            tooltip=${component.word("actions-text")}></sf-button-icon>
        </span>`;
}

function renderField(context, field, record, index = 1) {
  const component = context.component;
  const label = String(field.label ?? field.key);
  const shape = component.cellShape(field, record);
  if (shape === null && !context.labels) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-cards__field" data-key=${String(field.key)} data-empty></span>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-cards__field" data-key=${String(field.key)} data-align=${component.fieldAlign(field, index)} ?data-numeric=${component.fieldAlign(field) === "end"}
                      title=${context.labels ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : label}>${context.labels ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-cards__label">${label}</span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sr-only">${label}: </span>`}<span class="sf-view-cards__value">${renderShape(shape, component)}</span></span>`;
}

function renderCard(context, record, index) {
  const component = context.component;
  const id = String(record.id);
  const title = component.recordTitle(record);
  const selected = context.selected.has(id);
  const name = selected ? component.word("card-selected-label", {
    title
  }) : title;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-card sf-view-cards__card" role="listitem" data-id=${id} data-index=${String(index)}
             tabindex=${id === context.active ? "0" : "-1"}
             aria-posinset=${String(index + 1)} aria-setsize=${String(context.total)}
             aria-label=${name}
             ?data-selected=${selected} ?data-current=${id === context.current}
             ?data-flat=${!context.cover}>
            ${context.cover ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderCover(context, record)}${renderControls(context, record, title)}
                <div class="sf-view-cards__title">${title}</div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-cards__top"><div class="sf-view-cards__title">${title}</div>${renderControls(context, record, title)}</div>`}
            ${context.cardFields.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-cards__fields" ?data-labels=${context.labels}>
                ${context.cardFields.map((field, index) => renderField(context, field, record, index))}
            </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>`;
} // A card of the same lengths while the first records come (or a filtered
// list is asked again with nothing on screen).


function renderSkeleton(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-card sf-view-cards__card sf-view-cards__skeleton" aria-hidden="true" ?data-flat=${!context.cover}>
        ${context.cover ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-cards__cover"></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <sf-skeleton kind="text" count="3" width="90%,60%,40%" size="1/2" animation="pulse"></sf-skeleton>
    </div>`;
}

function renderEmpty(context) {
  const component = context.component;
  const state = context.empty;
  const actions = [];
  if (state.kind === "no-data" && context.creatable) actions.push({
    id: "create",
    text: component.word("create-text")
  });
  if (state.kind === "nothing-found") actions.push({
    id: "reset",
    text: component.word("reset-text"),
    appearance: "outline"
  });
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-cards__empty">
        <sf-empty-state kind=${state.kind} size=${context.size === "1" ? "1" : "1/2"} text=${state.message || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        icon=${state.kind === "nothing-found" ? "filter_alt_off" : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        .actions=${state.kind === "error" ? null : actions}></sf-empty-state>
    </div>`;
}

function renderMore(context) {
  if (!context.more) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;

  if (context.inView) {
    // sf-view's footer says the count; the button alone, in the
    // Framework's more look (outline, primary), asks the next page.
    if (!context.hasNext) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-cards__more">
            <sf-button size=${context.size} appearance="outline" scheme="primary" data-more
                       ?loading=${context.loadingMore} text=${context.moreText}></sf-button>
        </div>`;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-view-cards__more">
        <sf-pagination appearance="more" size=${context.size} bottom="false"
                       total=${String(Math.max(context.total, context.records.length))} page-size=${String(context.perPage)}
                       current=${String(context.portions)} has-next=${context.hasNext ? "true" : "false"}
                       count-known=${context.countKnown ? "true" : "false"}
                       ?show-more-busy=${context.loadingMore}></sf-pagination>
    </div>`;
}

function renderBulk(context) {
  const component = context.component; // Every mark, of every page (keep-selection); all under the filter says the total (LV2-7).

  const count = context.allSelected ? context.total : context.selected.size;

  if (context.bulkActions) {
    // sf-bulk-actions (C295), where the pair carries it.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-bulk-actions class="sf-view-cards__bulk-bar" size=${context.size} place="dock" count=${String(count)}
                                     page-count=${String(context.records.length)} total=${String(context.total)}
                                     ?all-selected=${context.allSelected}
                                     .actions=${context.actions}></sf-bulk-actions>`;
  } // Without it (a pair before sf-bulk-actions): the same strip from
  // sf-button and sf-button-icon.


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-cards__bulk" role="region" aria-label=${component.word("bulk-label")} ?hidden=${count === 0}>
            <span class="sf-view-cards__bulk-count">${component.word("selected-text", {
    count
  })}</span>
            ${context.actions.map(action => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button size=${context.size} appearance="outline" scheme="on-surface"
                    icon=${action.icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} text=${action.text ?? action.label ?? action.id} data-bulk=${action.id}></sf-button>`)}
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="close"
                            data-clear aria-label=${component.word("clear-text")} tooltip=${component.word("clear-text")}></sf-button-icon>
        </div>`;
}

function renderViewCardsTemplate(context) {
  const records = context.records;
  const skeleton = context.loading && !records.length;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-view-cards" data-size=${context.size} data-card-size=${context.cardSize} data-fit=${context.fit}
             data-density=${context.density} ?data-selecting=${context.selected.size > 0}
             style=${`--sf-view-cards-ratio: ${context.ratio}`}>
            ${context.empty && !skeleton ? renderEmpty(context) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-view-cards__grid" role="list" aria-label=${context.label} aria-busy=${context.loading ? "true" : "false"}>
                    ${skeleton ? Array.from({
    length: context.skeletons
  }, () => renderSkeleton(context)) : (0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_1__.repeat)(records, record => String(record.id), (record, index) => renderCard(context, record, index))}
                </div>
                ${skeleton ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : renderMore(context)}`}
            <div class="sf-view-cards__live" role="status" aria-live="polite">${context.message}</div>
            ${context.selectable && context.bulkBar && (context.selected.size > 0 || !context.bulkActions) ? renderBulk(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>`;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "43468444d233"
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

/***/ "e1bd4ec6daa1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.view-cards","tag":"sf-view-cards","version":"1.5.3","kind":"leaf","settings":{"size":{"type":"enum","values":["1/2","1"],"default":"1/2"},"card-size":{"type":"enum","values":["","s","m","l"],"default":""},"selectable":{"type":"boolean","default":true},"creatable":{"type":"boolean","default":false},"total":{"type":"number","integer":true,"min":0,"optional":true},"has-next":{"type":"boolean","optional":true},"count-known":{"type":"boolean","default":true},"records":{"type":"list","default":[]},"fields":{"type":"list","default":[],"of":{"key":"string","label":{"type":"string","optional":true},"propertyType":{"type":"string","optional":true},"variant":{"type":"string","optional":true}}},"options":{"type":"object","default":{}},"actions":{"type":"list","default":[],"of":{"id":"id","text":"string","icon":{"type":"icon","optional":true}}},"selected":{"type":"list","default":[]},"keep-selection":{"type":"boolean","default":false},"all-selected":{"type":"boolean","default":false},"bulk-bar":{"type":"boolean","default":true},"current":{"type":"string","default":""},"empty-context":{"type":"object","default":{}}},"values":{},"events":{"open":{"carries":{"id":"id","trigger":"string"}},"select":{"carries":{"ids":"list","all":"boolean"}},"more":{"carries":{"page":"number","offset":"number","per_page":"number"},"own-verb":true},"menu":{"carries":{"id":"id"},"cancelable":true,"own-verb":true},"apply":{"carries":{"action":"id","ids":"list","scope":"string"},"own-verb":true},"create":{"carries":{},"own-verb":true},"reset":{"carries":{},"own-verb":true},"refresh":{"carries":{},"own-verb":true}},"actions":{"append-records":{"with":{"records":"list","total":{"type":"number","optional":true},"has-next":{"type":"boolean","optional":true}}}},"layer":{"kind":"surface","locks-page":false,"traps-focus":false},"host-states":{},"css-variables":{"--sf-view-cards-min":{"type":"length","state":"default"},"--sf-view-cards-gap":{"type":"length","state":"default"},"--sf-view-cards-cover-background":{"type":"color","state":"default"},"--sf-view-cards-selected-background":{"type":"color","state":"default"},"--sf-view-cards-ratio":{"type":"string","state":"default"}}}');

/***/ },

/***/ "8145de20b1c3"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Cards","runtime":{"actions-text":"Actions","bulk-label":"Actions on the selection","card-menu-text":"Actions: {title}","card-selected-label":"{title}, selected","cards-label":"Cards, {count}","clear-text":"Clear selection","cleared-text":"Selection cleared","create-text":"Create","deselect-text":"Deselect","more-text":"Show {count} more","more-plain-text":"Show more","no-cover-text":"No photo","open-text":"Open","position-text":"{title}, {index} of {count}","reset-text":"Reset filters","select-text":"Select {title}","select-short-text":"Select","selected-text":"{count} selected","selected-one-text":"Selected: {title}. {count} selected in all","shown-text":"Showing {shown} of {total}","unselected-one-text":"Deselected: {title}. {count} selected in all"}}');

/***/ },

/***/ "04b9406f6fec"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Карточки","runtime":{"actions-text":"Действия","bulk-label":"Действия с выбранными","card-menu-text":"Действия: {title}","card-selected-label":"{title}, выбрано","cards-label":"Карточки, {count}","clear-text":"Снять выбор","cleared-text":"Выбор снят","create-text":"Создать","deselect-text":"Снять выбор","more-text":"Показать ещё {count}","more-plain-text":"Показать ещё","no-cover-text":"Нет фото","open-text":"Открыть","position-text":"{title}, {index} из {count}","reset-text":"Сбросить фильтр","select-text":"Выбрать {title}","select-short-text":"Выбрать","selected-text":"Выбрано {count}","selected-one-text":"Выбрано: {title}. Всего выбрано {count}","shown-text":"Показано {shown} из {total}","unselected-one-text":"Снят выбор: {title}. Всего выбрано {count}"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("3afa80f65162");
/******/
/******/ })()
;