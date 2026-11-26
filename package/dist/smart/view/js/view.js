/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "d26573af0eef"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isDestructiveAction: () => (/* binding */ isDestructiveAction),
/* harmony export */   orderActions: () => (/* binding */ orderActions)
/* harmony export */ });
// The one danger rule of the group actions (owner decision C295, defect BA-1:
// sf-pagination, sf-view, sf-view-table and sf-gallery each had a rule of
// their own, or none). An action is dangerous when it says so -- status
// "danger" (C13), or the danger flag of sf-pagination's markup -- or when its
// id deletes: delete, remove, destroy, trash, as a word at the start
// ("remove-all"), never inside another one ("deleted-view").
//
// A dangerous action is red, stands last after a line in the more menu and is
// asked about first (C39) unless it says confirm: false. sf-pagination
// re-exports this file, so a host that imported isDestructiveAction from it
// keeps the same answer.
const DELETING = /^(delete|remove|destroy|trash)\b/iu;
/** Whether an action deletes or cannot be undone. */

function isDestructiveAction(item) {
  if (!item || typeof item !== 'object') return false;
  if (item.status === 'danger' || item.status === 'error' || item.danger === true) return true;
  return DELETING.test(String(item.id ?? item.value ?? ''));
}
/** The actions as listed: as written, the dangerous ones last. */

function orderActions(actions = []) {
  return [...actions].sort((a, b) => Number(isDestructiveAction(a)) - Number(isDestructiveAction(b)));
}

/***/ },

/***/ "0b6c983d0722"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isDestructiveAction: () => (/* reexport safe */ _bulk_actions_js_danger_js__WEBPACK_IMPORTED_MODULE_0__.isDestructiveAction),
/* harmony export */   orderActions: () => (/* reexport safe */ _bulk_actions_js_danger_js__WEBPACK_IMPORTED_MODULE_0__.orderActions)
/* harmony export */ });
/* harmony import */ var _bulk_actions_js_danger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d26573af0eef");
// C116 and BA-1 (owner decision C295): the danger rule of the group actions
// is one, sf-bulk-actions' (an action that deletes says so with status
// "danger" or the danger flag -- "delete:Delete::danger", {danger: true} -- or
// by a value that deletes: delete, remove, destroy, trash). sf-pagination
// re-exports it for the hosts that imported it from here.


/***/ },

/***/ "36b027867bab"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _js_first_paint_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4d9330f13af8");
/* harmony import */ var _js_head_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("13b5af82de47");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_aliases_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("892a0da25239");
/* harmony import */ var _pagination_js_actions_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("0b6c983d0722");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("f17a957e50f6");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("7086146c00cc");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("80ad38cb6908");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("ce0305e57fa5");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("3e9dffe84919");
/* harmony import */ var _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("cb7ac7caf6a5");
/* harmony import */ var _pagination_lang_en_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("38d83a636029");
/* harmony import */ var _pagination_lang_ru_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("96e8b718b20a");
/* harmony import */ var _view_common_preferences_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("15cc710b6cd3");
/* harmony import */ var _js_tree_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("29f88c884ba1");
/* harmony import */ var _js_head_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("dc0227f16aec");
/* harmony import */ var _js_cards_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("1caedc1977b8");
/* harmony import */ var _js_calendar_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("d120fce454af");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__, _core_js_aliases_js__WEBPACK_IMPORTED_MODULE_5__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__, _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_8__, _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_13__, _view_common_preferences_js__WEBPACK_IMPORTED_MODULE_16__, _js_head_js__WEBPACK_IMPORTED_MODULE_18__]);
([_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__, _core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__, _core_js_aliases_js__WEBPACK_IMPORTED_MODULE_5__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__, _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_8__, _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_13__, _view_common_preferences_js__WEBPACK_IMPORTED_MODULE_16__, _js_head_js__WEBPACK_IMPORTED_MODULE_18__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _core_js_aliases_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_core_js_aliases_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_view_common_table_words_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _view_common_preferences_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_view_common_preferences_js__WEBPACK_IMPORTED_MODULE_16__);
// A composition shell. The host owns access, storage and query semantics;
// this element owns the browser lifecycle and projects answers into its slots.
// sf-view-table, sf-pagination and sf-toast are not imported: a package carries no
// element layer of its own, and an element that needs another asks for it by
// tag (ui-source docs/developer/shared-runtime.md). The rule's relations bring
// them (cl-view-table, cl-pagination, cl-toast lazy), and the view asks the Loader
// for any that is not defined yet (_askForParts). Imported, each was a second
// copy of the element in data-view.min.js (431 KB min; stand 25).
// The view's own first-paint styles, its skeleton, are its sheet.



 // The renamed tags (sf-view-table for sf-table, sf-view for sf-data-view until
// 2027-01-01): a lookup by name takes both through these, and the view defines
// its former tag beside its own (it is not a Smart base element).

















 // Whether the pair carries the group actions bar sf-bulk-actions (C295):
// defined, or a rule the Loader can fetch. Where it does, the marked rows'
// band is that bar (Larena L-2, view round 9); where it does not, the view's
// own band of before (an action list, Apply, For all and the cross).

function bulkBarAvailable() {
  return Boolean(globalThis.customElements?.get?.("sf-bulk-actions") || globalThis.SF?.RuleLoader?.["cl-bulk-actions"]);
}

const LISTENED = Object.freeze(["sf-view-table-search-change", "sf-view-table-filter-change", "sf-view-table-sort-change", "sf-view-table-save", "sf-view-table-apply", "sf-view-table-refresh", "sf-view-table-select", "sf-view-table-column-settings-reset", "sf-view-table-expand", "sf-view-table-load-more", "sf-view-table-reference-open", "sf-view-table-cell-set", "sf-view-table-move", "sf-view-table-view-change", "sf-pagination-change", "sf-pagination-size-change", "sf-pagination-apply", "sf-pagination-load-more", "sf-pagination-selection-clear", "sf-pagination-count", "sf-pagination-action-change", "sf-pagination-action-for-all-change", "sf-view-save", // The board's (sf-view-board, layout="board"; owner decisions C298, C304).
"sf-view-board-move", "sf-view-board-more", "sf-view-board-open", "sf-view-board-create", "sf-view-board-select", "sf-view-board-apply", "sf-view-board-save", // The cards' (sf-view-cards, layout="cards"; owner decisions C297, C306).
..._js_cards_js__WEBPACK_IMPORTED_MODULE_19__.CARDS_EVENTS, // The calendar's (sf-view-calendar, layout="calendar"; owner decision C307).
..._js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.CALENDAR_EVENTS]); // The layout registry (owner decision C298, BD-1): a layout name and the
// element that draws it. auto, table and list are the table's; board is
// sf-view-board, calendar is sf-view-calendar. Larena's word kanban reads as board. A name the registry does
// not hold warns once and draws the table, as before.

const LAYOUTS = new Map([["auto", "sf-view-table"], ["table", "sf-view-table"], ["list", "sf-view-table"], ["board", "sf-view-board"], ["cards", "sf-view-cards"], ["calendar", "sf-view-calendar"]]);
const LAYOUT_ALIASES = Object.freeze({
  kanban: "board"
});

const layoutName = value => {
  const name = String(value ?? "").trim().toLowerCase();
  return LAYOUT_ALIASES[name] ?? name;
};

const layoutsOfBoard = value => LAYOUTS.get(layoutName(value)) === "sf-view-board"; // The display kind of each layout element; every other element (the table) is
// named by the layout attribute itself (auto, table, list).
// The layouts that ask their own window instead of the list's page (cards:
// page and per_page 24; calendar: days).


const OWN_PAGING = new Set(["sf-view-cards", "sf-view-calendar"]); // The presentation a set of marks belongs to (C413): the table in any of its
// layouts (auto, table, list), the board, the cards, the calendar.

const marksKind = tag => tag === "sf-view-board" ? "board" : tag === "sf-view-cards" ? "cards" : tag === "sf-view-calendar" ? "calendar" : "table"; // The page of a page size that holds record number first (1-based, LV2-8).


function pageHolding(first, perPage) {
  const per = Number(perPage) || VIEW_DEFAULT_PAGE_SIZE;
  return Number.isSafeInteger(first) && first > 0 ? Math.floor((first - 1) / per) + 1 : 1;
}

const LAYOUT_KINDS = Object.freeze({
  "sf-view-board": "board",
  "sf-view-cards": "cards",
  "sf-view-calendar": "calendar"
}); // A layout of the table (auto, table, list): the page's own value kept over a switch.

const tableLayout = value => value !== null && value !== undefined && (LAYOUTS.get(layoutName(value)) ?? "sf-view-table") === "sf-view-table"; // The board's first paint: lanes of a head and cards (BD-2).


const FIRST_PAINT_LANES = 4;
const FIRST_PAINT_CARDS = 3; // The table's and the page row's events by their names since standard 1.3.8
// (vocabulary 1.1.5): the old names they still send until 2027-01-01 are not
// listened to, so each act is taken once.

const EVENTS = Object.freeze({
  "sf-view-table-query": "query.change",
  "sf-view-table-template-select": "view.open",
  "sf-view-table-template-save": "view.save",
  "sf-view-table-template-delete": "view.delete",
  "sf-view-table-create": "view.create_record"
});
let instanceNumber = 0; // Every port version this composite accepts, in one place. The list used to be
// written inline in the guard, and two versions were published — 1.3.0 for a
// host that does not count, 1.4.0 for personal pinning — while the guard still
// named 1.2.0 as the newest it would take. A host moving to either would have
// been refused outright by the component that asked it to move. The contract
// test beside this file now compares the list with the manifest.
// The port speaks snake_case and the table reads camelCase, and the translation
// is this view's job: a column that named its property_type reached the table
// under a name nothing read, so the cell drew the stored value. Both names are
// kept -- the port's, because that is what the host sent and what a consumer
// reading the DOM expects, and the component's, because that is what the shared
// renderer set asks for.

const COLUMN_PRESENTATION = {
  property_type: "propertyType",
  min_width: "minWidth"
}; // The sentence a host answer carries for a person (port answer `message`):
// a non-empty string, trimmed; anything else is no message.
// A chrome part the host turned off on its own table (selectable="false",
// settings="false") stays off. The view writes these attributes on every
// projection, so what the table carried before the view first touched it is
// kept aside, as data-sf-host-row-actions is, and read from there.

function hostWroteOff(table, name) {
  if (!table) return false;
  const marker = `data-sf-host-${name}`;
  if (!table.hasAttribute?.(marker)) table.setAttribute?.(marker, table.getAttribute?.(name) ?? "");
  return table.getAttribute?.(marker) === "false";
}

function hostMessage(answer) {
  return typeof answer?.message === "string" ? answer.message.trim() : "";
} // Whether a refused list was refused for access rather than for the query
// (Larena acceptance, 2026-10-22: a search longer than the host's limit,
// refused as query_invalid, drew «Нет доступа» and took the toolbar away, so
// the search could not be shortened without reloading). The port's reason is
// free text a host may extend (simai.dataview-port 1.12.0 answer.reason) and the
// contract names one access reason, `forbidden`; it has no class for the rest.
// Access is read from the code: `forbidden`, `access_denied`, `scope_denied`,
// and a host's own prefixed form of the last two (`storage_page_scope_denied`,
// `registered_list_access_denied`). A refusal without a reason stays a refusal
// of access, as every refused list was before. Any other reason is about the
// query: the person keeps the toolbar and the query to correct it.


const ACCESS_REFUSALS = new Set(["forbidden", "access_denied", "scope_denied"]);

function isAccessRefusal(reason) {
  if (reason == null || reason === "") return true; // Larena writes the codes with underscores; ui-admin's reference host with
  // hyphens (access-denied, stand 24 U2): both are the same refusal.

  const code = String(reason).replace(/-/gu, "_");
  return ACCESS_REFUSALS.has(code) || code.endsWith("_access_denied") || code.endsWith("_scope_denied");
}

function projectColumn(column) {
  const projected = copy(column);

  for (const [sent, read] of Object.entries(COLUMN_PRESENTATION)) {
    if (projected[sent] !== undefined && projected[read] === undefined) {
      projected[read] = projected[sent];
    }
  }

  return projected;
}

const SUPPORTED_PORT_VERSIONS = ["1.0.0", "1.1.0", "1.2.0", "1.3.0", "1.4.0", "1.5.0", "1.6.0", "1.7.0", "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.15.0", "1.16.0"]; // Creating a record and saving personal column settings became capabilities in
// port 1.10.0. A host that declares an earlier version was offered both without
// announcing them and keeps that; a host on 1.10.0 is offered them only when it
// announces them, so a page is never given a control nobody would answer.

const BASELINE_UNTIL_1_10 = new Set(["create-record", "personal-column-settings"]);

const portAtLeast = (version, minimum) => {
  const parts = value => String(value ?? "").split(".").map(part => Number.parseInt(part, 10) || 0);

  const [a, b] = [parts(version), parts(minimum)];

  for (let index = 0; index < 3; index += 1) {
    if ((a[index] ?? 0) !== (b[index] ?? 0)) return (a[index] ?? 0) > (b[index] ?? 0);
  }

  return true;
}; // The words are the language files' (lang/<locale>.json, standard 1.3.8 §11),
// read under the camelCase keys a product registers more languages by.


const camelWords = (words = {}) => Object.fromEntries(Object.entries(words).map(([key, word]) => [key.replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase()), word]));

const DATA_VIEW_TEXT = {
  en: camelWords(_lang_en_json__WEBPACK_IMPORTED_MODULE_11__.runtime),
  ru: camelWords(_lang_ru_json__WEBPACK_IMPORTED_MODULE_12__.runtime)
}; // The table's own words for the toolbar it will draw: the skeleton writes the
// filter and create labels into their blocks, so each block is as wide as the
// button the table then draws (sf-view 1.11.1). Read under sf-view-table, so
// words a product registers for the table reach the skeleton too.

const TABLE_TOOLBAR_TEXT = {
  en: {
    filterText: _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_13__.en.runtime["filter-text"],
    createText: _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_13__.en.runtime["create-text"]
  },
  ru: {
    filterText: _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_13__.ru.runtime["filter-text"],
    createText: _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_13__.ru.runtime["create-text"]
  }
}; // The table footer's range words are sf-pagination's (range, range-many): a
// board and cards say their count in the same words (view round 7), read
// under sf-pagination, so words a product registers for it reach them too.

const PAGINATION_RANGE_TEXT = {
  en: Object.fromEntries(["range", "range-many", "page-size-text", "page-size-label", "show-more-count", "show-more-text"].map(key => [key, _pagination_lang_en_json__WEBPACK_IMPORTED_MODULE_14__.runtime[key]])),
  ru: Object.fromEntries(["range", "range-many", "page-size-text", "page-size-label", "show-more-count", "show-more-text"].map(key => [key, _pagination_lang_ru_json__WEBPACK_IMPORTED_MODULE_15__.runtime[key]]))
}; // How a table's list goes on past its first page (owner decision D1,
// 2026-11-21): «Страницами» (pages), «Показать ещё» alone (more), both --
// the button under the last row and the page numbers below it -- (both, the
// default), or by itself as the person scrolls (endless).

const VIEW_PAGING = ["pages", "more", "both", "endless"];
const VIEW_PAGING_DEFAULT = "both"; // The person's look of a display kind, for all their lists of it (C408).

const GENERAL_VIEW_PREFERENCE = "sf-view/*";
const KIND_LOOK_KEYS = Object.freeze({
  table: ["paging"],
  cards: ["size", "card_labels", "paging"],
  board: ["empty_lanes"],
  calendar: []
});

const escapeText = text => String(text).replace(/[&<>"]/gu, letter => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
})[letter]); // The parts this element draws itself and a consumer can leave out. `status` is
// absent on purpose and cannot be switched off: a list that could not say a load
// failed would be a list that looks empty when it is broken, and an embedded one
// with a row cap and no chrome is exactly where someone would be tempted to
// remove it. `bulk` and `notice` are host slots that render nothing when empty,
// so switching them would be theatre.
// `select` and `settings` are the table's two chrome columns rather than parts of
// this element, and they are named here because they are furniture of the same
// kind: a checkbox column exists to feed a bulk band and a gear column exists to
// reach column settings, and an embedded list has neither. Named explicitly
// instead of inferred from the toolbar, so a consumer who does want a selection
// in an embedded list can ask for it -- `chrome="select"` -- rather than having to
// turn the whole toolbar back on to get a checkbox.
// Words the view passes on to the table and the pagination it draws.


const TABLE_LABELS = ["column-search-placeholder", "column-search-empty-text", "column-move-label", "filter-apply-text"];
const PAGINATION_LABELS = ["show-more-text", "selected-label", "total-label", "pages-label", "first-label", "previous-label", "page-label", "next-label", "last-label", "page-field-label", "action-choose-label", "actions-label", "actions-region-label", "clear-selection-label", "page-size-label"];
const LABEL_ATTRIBUTES = [...TABLE_LABELS, ...PAGINATION_LABELS, "pagination-aria-label"]; // The parts of the list a host can switch off (VR5, owner: everything in
// the list can be set or switched off from the backend or by a call). The
// four old words name whole rows; the rest are parts inside them, each
// under its row (CHROME_WITHIN). A chrome that names none of the parts
// keeps every part, so chrome="toolbar pagination" of an older page draws
// what it drew; one that names a part is the whole list: a part it does
// not name is not drawn.

const CHROME_PARTS = ["toolbar", "pagination", "select", "settings", "search", "filter", "look", "page-size"];
const CHROME_WITHIN = {
  search: "toolbar",
  filter: "toolbar",
  look: "toolbar",
  "page-size": "pagination"
}; // Writes that cannot have changed a row, so the view does not re-query after
// them. Opening a record changes nothing either; the rest of the settings layer
// is the person's own view of the same rows.

const ANSWER_ONLY = new Set(["node.targets"]);
const TREE_INTENTS = new Set(["tree.expand", "node.targets", "node.move"]);
const NO_REFRESH_AFTER = new Set(["record.open", "tree.expand", "node.targets", "settings.save_personal", "settings.save_shared", // The list head's «Настроить вид» (view round 13): a setting is shown at
// once by the part it belongs to, and one that needs other rows (a
// board's lanes, a calendar's date field) asks for them itself. Re-read
// after the save, the rows «Показать ещё» had added collapsed to the last
// page («41–48 из 48») when the person changed «Подгрузка».
"settings.save"]);

const copy = value => value == null ? value : JSON.parse(JSON.stringify(value)); // Whether a filter value holds anything: an empty string, list or object is
// no filter.
// SF.Preferences: the view's sort and page size are the person's (owner,
// 2026-10-14), kept under the same key as the table's arrangement.


const VIEW_PAGE_SIZES = "10,20,50,100"; // The page size of a view whose page sets none (owner decision 2026-11-20,
// view round 5 R5-3): 20, one of the sizes offered; it was 25, a size the
// menu of 10/20/50/100 could not name.

const VIEW_DEFAULT_PAGE_SIZE = 20;

const preferences = () => globalThis.SF?.Preferences || (_view_common_preferences_js__WEBPACK_IMPORTED_MODULE_16___default()); // The stored key keeps the former tag's spelling: it names what a person has
// already saved (SF.Preferences, a host's store), not the element.


const viewPreferenceKey = key => `sf-table/${String(key).replace(/[^\w.:-]+/gu, "-")}`; // The list of resources (owner decision C31): what the view passes to its
// table, and the columns' places in a list row.


const LIST_ATTRIBUTES = ["layout", "layout-switch", "list-below", "quick-actions", "row-open", "list-roles"];

function hasValue(value) {
  if (value === null || value === undefined || value === "" || value === false) return false;
  if (Array.isArray(value)) return value.some(hasValue);
  if (typeof value === "object") return Object.values(value).some(hasValue);
  return true;
} // sf-view from its component.json (standard simai.smart-component 1.3.8
// §3, §4, §8, §11): a leaf over plain HTMLElement (it draws into its own
// shadow root), its settings and values made by core/js/element-manifest.js,
// its actions answering outcomes (../table/js/manifest-actions.js), its events by the
// vocabulary's verbs with the old names as dated aliases (aliases.json).


class PlainElement extends HTMLElement {
  connectedCallback() {}

}

const DataViewElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_3__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_9__, {
  base: PlainElement,
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_11__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_12__
  },
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_10__
}); // The first paint's rows when nothing says how many the page asks for (sf-view-table's
// page, its pagination-page-size default), how many fields a record of the
// compact list shows under its title (sf-view-table list-fields).

const FIRST_PAINT_ROWS = 10;
const FIRST_PAINT_LIST_FIELDS = 3; // The vocabulary's data state (§3) for the view's own words for it.

const DATA_STATES = {
  loading: "loading",
  populated: "ready",
  empty: "empty",
  error: "error",
  "no-access": "refused",
  unavailable: "unavailable"
}; // A value as text with its keys in order, so two answers that say the same
// thing compare equal whatever order a server wrote the keys in.

const canonical = value => JSON.stringify(value, (key, item) => item && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.keys(item).sort().map(name => [name, item[name]])) : item); // What a port offers, as the projection drew it.


const capabilitiesKey = port => canonical([...(port?.capabilities ?? [])].map(String).sort()); // Whether the port's answer is the one the page printed: the same revision
// when both name one, else the same rows, count and columns.


function sameAnswer(printed, data) {
  if (printed.revision !== undefined && printed.revision !== null && data.revision !== undefined && data.revision !== null) {
    return String(printed.revision) === String(data.revision);
  }

  const shape = answer => canonical({
    records: answer.records ?? null,
    total: answer.total ?? null,
    has_next: answer.has_next ?? null,
    columns: answer.columns ?? null,
    tree: answer.tree ?? null
  });

  return shape(printed) === shape(data);
}

class SfDataView extends DataViewElement {
  constructor() {
    super();
    this.instanceId = `sf-view-${++instanceNumber}`;
    this.query = {
      filters: {},
      search: "",
      sort: [],
      page: 1,
      per_page: VIEW_DEFAULT_PAGE_SIZE
    };
    this.records = []; // The tree, when the host answers in levels (port 1.8.0): mode is
    // tree, flat or flattened as the last answer said, null before one.

    this.treeMode = null;
    this.tree = (0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.createTree)();
    this._treeAppend = new Set();
    this.treeSequence = 0; // The host's labels and groups for its own action ids (row_actions).

    this.rowActionCatalog = [];
    this.continuing = false;
    this.appended = null;
    this.columns = [];
    this.total = 0; // Whether the host counts. It is answered by the answers themselves: a
    // total means there is a number, no total means there is a link. There
    // is no mode attribute, because a view whose host stops counting should
    // not need a host to be reconfigured as well.

    this.countKnown = true; // A host may answer an estimate (`total_exact: false`): the number is
    // shown, but as «~N», and nothing is applied under the filter on it.

    this.totalExact = true;
    this.hasNext = false;
    this.countedQuery = null;
    this.savedViews = []; // The list head's saved filters, the view's document and its locked
    // settings, as the host answers them (study section 7, draft
    // view-config/1); kept only while head="list" reads them.

    this.savedFilters = [];
    this.viewConfig = null;
    this.lockedSettings = [];
    this.columnSettings = null;
    this.sequence = 0;
    this.epoch = 0;
    this.pending = null;
    this.hostPort = null; // Whether a projection has arrived. Until one has, the counts the host
    // wrote in the markup are left alone.

    this._answered = false;

    this._bound = event => this._onEvent(event);

    this._seenEvents = new WeakSet();
    this.attachShadow({
      mode: "open"
    });
    this.shadowRoot.innerHTML = `
          <style>
            :host { display: block; }
            [part="layout"] { display: grid; gap: var(--sf-data-view-gap, var(--sf-space-3)); }
            /* The list head holds the top while the list scrolls (C328; view
               round 13, VHF-15): the search, the filter fields and the view's
               strip stay, the title row leaves (--sf-view--head-offset is
               minus its height and the gap under it, measured by js/head.js).
               The table's head sticks right under it (--sf-view--stuck-head,
               the part of the head that stays). In the page or in a scrolling
               box around the view alike: a sticky part binds to the nearest
               scroll container. A view without the list head says 0, so a
               list inside another view's record card is not pushed down.
               Under a fixed bar of the page (AN-3, view round 15) both go
               down by --sf-admin-shell-stick, which the Admin set's
               sf-admin-shell writes (its bar and the phone top line); absent,
               it is 0 and nothing moves. */
            :host { --sf-view--stuck-head: 0px; }
            :host([head="list"]) [part="head"] {
              position: sticky;
              inset-block-start: calc(var(--sf-admin-shell-stick, 0px) + var(--sf-view--head-offset, 0px));
              z-index: var(--sf-z-index-2, 20);
              background-color: var(--sf-view-head--background-color, var(--sf-surface-page));
            }
            [part="toolbar"] { display: flex; flex-wrap: wrap; gap: var(--sf-data-view-toolbar-gap, var(--sf-space-2)); }
            /* Hidden means hidden: the toolbar's own display beat the hidden
               attribute, and a related list in a record panel (chrome="")
               showed the bare fallback search above its rows (Larena,
               2026-10-14). */
            [hidden] { display: none !important; }
            /* Files from the computer over a view that takes them (accept-files):
               a dashed zone over the list says where they go. */
            [part="drop"] {
              position: absolute; inset: 0; z-index: 20;
              display: grid; place-items: center;
              border: var(--sf-focus--width, 2px) dashed var(--sf-data-view-drop-border-color, var(--sf-primary));
              border-radius: var(--sf-radius--surface);
              background: var(--sf-data-view-drop-background-color, color-mix(in srgb, var(--sf-primary-container) 80%, transparent));
              color: var(--sf-data-view-drop-color, var(--sf-on-primary-container));
              font: var(--sf-font-weight-medium) var(--sf-text-size-1) / var(--sf-text-height-1) var(--sf-text--family);
              pointer-events: none;
            }
            /* What the view is doing is announced, not laid out. It used to be
               a line above the table, which said "Нет данных" over a table
               whose own body says the same, and pushed everything down by its
               height every time a search found nothing. */
            [part="status"] {
              position: absolute;
              inline-size: var(--sf-px);
              block-size: var(--sf-px);
              margin: calc(var(--sf-px) * -1);
              padding: 0;
              overflow: hidden;
              clip-path: inset(50%);
              white-space: nowrap;
              border: 0;
            }
            /* A notice is a message about an action. It used to float over the
               top of the card, which moved nothing but covered the search, the
               create button and the filters -- the consumer was right that this
               is worse than a shifted table. It stands in the corner of the
               window now, over the page and over none of the controls, and it
               goes away by itself. Slotted from the light DOM because the
               Framework's styles -- sf-toast's among them -- do not cross a
               shadow boundary. */
            slot[name="notice"]::slotted(*) {
              position: fixed;
              inset-block-end: var(--sf-space-3);
              inset-inline-end: var(--sf-space-3);
              max-inline-size: var(--sf-measure-44, calc(44 * var(--sf-text--size-1) / 2));
              /* One above the menus: they share the top step, and a refusal
                 answering a menu choice opened under the menu that asked. */
              z-index: calc(var(--sf-z-index-9, 90) + 1);
            }
            /* The band of bulk controls is the last strip of the card and holds
               the bottom of the window while the card runs past it. It is
               slotted rather than built in here: the Framework's own styles do
               not cross a shadow boundary, so the band lives in the light DOM
               where they reach it, and this layout is what contains it. */
            slot[name="bulk"]::slotted(*) {
              position: sticky;
              inset-block-end: 0;
              z-index: var(--sf-z-index-3, 30);
            }
            /* The first paint (standard 1.3.8 §5.4): until the host's first
               answer the view is its skeleton, slotted from the light DOM
               where a server printed it (static/<template>/<example>.html)
               or where the view drew it, and the layout stands back. */
            :host([data-sf-awaiting]) [part="layout"] { display: none; }
            :host(:not([data-sf-awaiting])) slot[name="first-paint"] { display: none; }
            /* The list's footer (C97 (5)): «41–60 из 240 · По 20 ▾ · ‹ [3] из 12 ›»
               in one row, as tall as the size ladder says -- the control height
               of the step, the row's padding above and below it and the line
               under it, the same sum sf-pagination publishes as
               --sf-pagination-block-size-<step>. The range and the page size
               (slot footer) take the room at the start, the page field stands
               last; where the two do not fit, the page field wraps to a line
               of its own and still ends there. */
            /* C404 (the list's look, owner 2026-11-21): the footer is the
               list's last band -- no gap above it and no line of its own --
               the range at the start, the page numbers in the centre, «По 20»
               at the end (three columns, the outer two as wide as each
               other); under 37.5rem of the list two columns, the page numbers
               on a line of their own in the centre
               (data-sf-view-footer-narrow, written by the view). */
            [part="footer"] {
              --sf-view--footer-control-height: var(--sf-ui-1--control-height);
              display: grid;
              grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
              align-items: center;
              gap: var(--sf-space-1\\/2) var(--sf-space-1);
              box-sizing: border-box;
              min-block-size: calc(2 * var(--sf-space-1\\/2) + var(--sf-view--footer-control-height));
              margin-block-start: calc(-1 * var(--sf-data-view-gap, var(--sf-space-3)));
              padding-block: var(--sf-space-1\\/2);
            }
            :host([data-sf-view-footer-narrow]) [part="footer"] { grid-template-columns: minmax(0, 1fr) auto; }
            :host([size="1/2"]) [part="footer"] { --sf-view--footer-control-height: var(--sf-ui-1\\/2--control-height); }
            /* A footer with no page row in it (the page row hidden: a tree, a
               failed or refused list) draws nothing, not an empty line. */
            /* A board and cards have no page row but say their count
               (data-sf-view-footer-count, view round 7). */
            :host(:not([data-sf-view-footer-count])) [part="footer"]:has(> slot[name="pagination"][hidden]) { display: none; }
            slot[name="footer"]::slotted(*) { min-inline-size: 0; }
            /* «Показать ещё» right under the last row, across the list (D1):
               12 under the rows, not the layout's gap -- half a space step
               with a floor of 12 (--sf-b2), as the fields' value inset (C77):
               the half step is 8 below 60rem, and the register's VL-12 asks
               12 at 768 too (view round 17, VN-3). The page numbers stay in
               the footer below it («Вместе»), or go («Показать ещё»,
               «Бесконечно»). */
            slot[name="more"]::slotted(*) {
              margin-block-start: calc(-1 * var(--sf-data-view-gap, var(--sf-space-3)));
              padding-block: max(var(--sf-space-1\\/2), var(--sf-b2));
            }
            /* 8 under the rows on a phone (D1, VL-12). */
            :host([data-sf-view-footer-narrow]) slot[name="more"]::slotted(*) { padding-block: var(--sf-space-1\\/3); }
            slot[name="more"]::slotted([hidden]) { display: none; }
            slot[name="pagination"]::slotted([data-sf-view-paging-off]) { display: none; }
            /* The parts' places in the grid are the light DOM sheet's
               (js/first-paint.css): the hosts there are display: contents. */
          </style>
          <slot name="first-paint"></slot>
          <section part="layout" style="position: relative">
            <!-- The author's toolbar, or nothing (VF-3, set standard 7.9): the view
                 drew a raw search, view select and buttons with Russian words in
                 its shadow root when the slot was empty, which consumers hid with
                 an empty <span slot="toolbar">. The table draws the search and
                 the saved views itself, with SIMAI Framework controls. -->
            <!-- The list head (head="list", C297, C299-C301): the title row and
                 the head row, drawn in the light DOM by js/head.js. -->
            <div part="head" hidden><slot name="head"></slot></div>
            <div part="toolbar" hidden><slot name="toolbar"></slot></div>
            <div part="status" role="status" aria-live="polite" hidden></div>
            <div part="drop" hidden></div>
            <slot name="content"></slot>
            <slot name="show-all"></slot>
            <slot name="more"></slot>
            <div part="footer"><slot name="footer"></slot><slot name="pagination"></slot></div>
            <slot name="bulk"></slot>
            <slot name="notice"></slot>
            <slot name="dialog"></slot>
          </section>`;
  } // ---------- the manifest's values and settings (§4) ----------


  get total() {
    return this._total ?? 0;
  }

  set total(value) {
    this._total = value;
  } // The vocabulary's data state of the list (§3): ready for populated,
  // refused for no access.


  get state() {
    if (this._queryRefused) return "refused";
    return DATA_STATES[this._dataState] ?? "idle";
  } // The row the page has open, marked in the table (aria-current).


  get current() {
    return this._current ?? "";
  }

  set current(id) {
    this._current = id === null || id === undefined ? "" : String(id);
    if (this.table) this.table.current = this._current;
    if (this.layoutKind === "cards" && this.cards) this.cards.current = this._current;
    const calendar = this.layoutKind === "calendar" ? (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.calendarOf)(this) : null;
    if (calendar) calendar.current = this._current;
  }

  get selected() {
    return this._current || undefined;
  } // The record beside `id` in the order the view shows now (C305 (4)): the
  // record card asks the page for its neighbour (sf-view-properties-step)
  // and the page asks this, so the card never reads the list. Null at an end
  // or for a record the view does not show.


  recordBeside(id, direction = "next") {
    // A board's order is its lanes', left to right, top to bottom.
    const rows = this.layoutKind === "board" ? (this.board?.boardLanes ?? this.boardLanes ?? []).filter(lane => !lane.hidden).flatMap(lane => lane.records ?? []) : this.layoutKind === "calendar" ? (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.calendarOrder)(this) : this.cappedRecords ?? [];
    const at = rows.findIndex(record => String(record?.id) === String(id));
    if (at < 0) return null;
    const next = rows[at + (direction === "previous" ? -1 : 1)];
    return next ? String(next.id) : null;
  } // The record card beside the list (C305 (4), view round 2): record-card
  // names an sf-view-properties panel of the page by id. A record opened
  // from the table, the list or the board (sf-view-open, unless a listener
  // refused it) then opens in that card -- docked beside the list from 64rem
  // (the view marks itself data-sf-drawer-dock-host when the page marked
  // nothing), the row marked current -- instead of the host's record.open;
  // the card's steps (Alt+Down / Alt+Up) go to recordBeside, and its close
  // gives the focus back to the row. Without record-card nothing changes.


  get recordCard() {
    const id = this.getAttribute?.("record-card");
    if (!id) return null;
    const root = this.getRootNode?.();
    const card = root?.getElementById?.(id) ?? globalThis.document?.getElementById?.(id) ?? null;
    return (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.isTag)(card, "sf-view-properties") ? card : null;
  } // «Настройки полей записи» of the list head (C301) opens the first record
  // in its card, straight in the arranging mode (C311 (1), RC-4): one place
  // for the card's arrangement, one per entity whatever the layout (C311
  // (3)). It drew a fields panel of its own with entity.fields.save. A page
  // without a record card beside the list hears settings-open.


  async openRecordSettings() {
    const card = this.recordCard;
    const rows = this.layoutKind === "board" ? (this.board?.boardLanes ?? this.boardLanes ?? []).filter(lane => !lane.hidden).flatMap(lane => lane.records ?? []) : this.cappedRecords ?? [];
    const first = this._cardOpen ?? (rows[0]?.id != null ? String(rows[0].id) : null);

    if (!card || !first) {
      this.sfEmit("settings-open", {
        id: "record-fields"
      });
      return null;
    }

    const ready = () => card.getAttribute("record-id") === first && card.getAttribute("data-state") === "ready" && card.record;

    const shown = ready() ? Promise.resolve() : new Promise(done => {
      const heard = event => {
        if (event.detail?.state !== "ready" || card.getAttribute("record-id") !== first) return;
        card.removeEventListener("sf-view-properties-state", heard);
        done();
      };

      card.addEventListener("sf-view-properties-state", heard);
    });
    if (this._cardOpen !== first) this._openRecord(first, {
      action_id: "view",
      record_ids: [first],
      record_id: first
    });
    await shown;
    return card.configuring ? true : card.startConfiguringView?.() ?? false;
  } // One way a record of the list opens (vocabulary §5 open {id}).


  _openRecord(id, detail) {
    const card = this.recordCard; // Without a card beside the list the page opens the record itself --
    // on sf-view-open (refusing it) or on record.open -- in a panel of its
    // own, whose close is watched for the focus.

    if (!card) this._watchHostRecordClose(String(id));
    const allowed = this.sfEmit("open", {
      id
    }, {
      cancelable: true
    });
    if (!allowed) return null;
    if (!card) return this._raise("record.open", detail);
    return this._openBeside(card, String(id));
  } // A record the page or the host opened in a panel of its own (sf-view-open
  // refused, or record.open; no record-card): when that panel closes (sf-view-properties-close, Escape
  // or ×) and the host removes it, the focus fell to the page's body (view
  // round 5 R5-1, 12/12 runs). The focus goes back to the record's row, as
  // it does from the card beside the list -- only when it was lost, so a
  // host that placed it somewhere keeps its choice (WCAG 2.4.3).


  _watchHostRecordClose(id) {
    this._hostRecordOpen = id;
    const root = globalThis.document;
    if (!root?.addEventListener || this._onHostRecordClose) return;

    this._onHostRecordClose = event => {
      const open = this._hostRecordOpen;
      if (!open || !this.isConnected) return;
      const named = event.target?.getAttribute?.("record-id");
      if (named != null && named !== "" && String(named) !== open) return;
      this._hostRecordOpen = null;
      globalThis.setTimeout?.(() => {
        const active = root.activeElement;
        const lost = !active || active === root.body || active === root.documentElement || !active.isConnected;
        if (lost && this.isConnected) this._focusRecord(open);
      }, 0);
    };

    root.addEventListener("sf-view-properties-close", this._onHostRecordClose);
  } // The focus on a record of the list: its card on a board or in cards, its
  // day in a calendar, its row in the table.


  _focusRecord(id) {
    const board = this.layoutKind === "board" ? this.board : null;
    const cardOf = board?.querySelector?.(`.sf-view-board__card[data-id="${globalThis.CSS?.escape ? CSS.escape(id) : id}"]`);
    const cardsCard = this.layoutKind === "cards" ? this.cards?.querySelector?.(`.sf-view-cards__card[data-id="${globalThis.CSS?.escape ? CSS.escape(id) : id}"]`) : null;
    const calendar = this.layoutKind === "calendar" ? (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.calendarOf)(this) : null;
    if (cardOf ?? cardsCard) (cardOf ?? cardsCard).focus?.({
      preventScroll: true
    });else if (calendar) calendar.focusRecord?.(id);else this.table?.focusRow?.(id, {
      focus: true
    });
  }

  _openBeside(card, id) {
    if (!globalThis.document?.querySelector?.("[data-sf-drawer-dock-host]")) this.setAttribute("data-sf-drawer-dock-host", ""); // Decided as the card opens; a step to the next record keeps it.

    if (card.getAttribute("open") !== "true") card.toggleAttribute("data-sf-view-card-over", this._cardGoesOver(card));

    this._wireCard(card);

    this._cardOpen = id;
    this.current = id;
    card.setAttribute("record-id", id);
    card.removeAttribute("hidden");
    card.setAttribute("open", "true");
    return {
      answer: "applied",
      record_id: id
    };
  } // RV4-3 (DEV msg-1f111575, C399 allows both): opening a record must not
  // move the list. A card docked beside the list narrows it by the card's
  // width; where the list head would then wrap (its row to two rows, the
  // chips to a second line) or the table turn into phone rows, the list grew
  // by 44-150 px and its rows moved (+44 at 1440, +88 at 1280, phone rows at
  // 1100). There the card opens over the list instead; where the list keeps
  // its head on one row and its table, the card docks and reserves its width.


  _cardGoesOver(card) {
    const width = card.dockWidth?.() ?? 0;
    if (!(width > 0) || !card.docksBesideList?.()) return false;
    const room = this.getBoundingClientRect?.().width ?? 0;
    if (!(room > 0)) return false;
    const table = this._layoutTag() === "sf-view-table" ? this.table : null;
    const below = Number(table?.getProp?.("listBelow")) || 600;
    if (table && !table.isNarrow && room - width < below) return true;
    if (this.listHead && this._head && !this._head.fitsNarrower(width)) return true;
    return false;
  }

  _wireCard(card) {
    if (this._wiredCard === card) return;

    if (this._wiredCard) {
      this._wiredCard.removeEventListener("sf-view-properties-step", this._onCardStep);

      this._wiredCard.removeEventListener("sf-view-properties-close", this._onCardClose);
    }

    this._wiredCard = card;

    this._onCardStep ??= event => {
      if (event.defaultPrevented || event.currentTarget !== this._wiredCard) return;
      const detail = event.detail ?? {};
      const from = String(detail.record_id ?? this._cardOpen ?? ""); // A host that names the neighbour (record-neighbours) gave it: the
      // card opens it itself. Otherwise the view's order gives it.

      const next = detail.next_record_id ? String(detail.next_record_id) : this.recordBeside(from, detail.direction);
      if (!next) return;
      this._cardOpen = next;
      this.current = next;
      if (!detail.next_record_id) event.currentTarget.setAttribute("record-id", next); // A step taken from the list moves the list's place with it.

      if (this._stepFromList) {
        const board = this.layoutKind === "board" ? this.board : null;
        const cardOf = board?.querySelector?.(`.sf-view-board__card[data-id="${globalThis.CSS?.escape ? CSS.escape(next) : next}"]`);
        if (cardOf) cardOf.focus?.({
          preventScroll: false
        });else this.table?.focusRow?.(next, {
          focus: true,
          reveal: true
        });
      }
    };

    this._onCardClose ??= event => {
      if (event.defaultPrevented || event.currentTarget !== this._wiredCard) return;
      const id = this._cardOpen;
      this._cardOpen = null;
      this.current = ""; // The card asks its page to close it and never closes itself
      // (vocabulary §5 close): the view placed it, so the view closes it
      // (VR2-2: × and Escape gave the focus back and left the panel open).

      event.currentTarget.setAttribute("open", "false");
      if (!id) return; // The focus goes back to the record it was opened from.

      globalThis.setTimeout?.(() => this._focusRecord(id), 0);
    };

    card.addEventListener("sf-view-properties-step", this._onCardStep);
    card.addEventListener("sf-view-properties-close", this._onCardClose);
  } // The actions offered for the marked rows, [{id, label}] (component.json
  // settings.bulk-actions). A page writes them on its page row's markup
  // (actions="publish:Опубликовать|…"); an assembly that places the bare view
  // gives them here, their words from its language file (§11.3), and the view
  // hands them to its page row.


  get bulkActions() {
    return this._bulkActions ?? [];
  }

  set bulkActions(list) {
    this._bulkActions = Array.isArray(list) ? list.filter(item => item && (item.id ?? item.value)) : [];

    this._applyBulkActions();

    this._syncSelects(); // None left (LV4-3): no boxes, no bar, and the marks go with them;
    // the marks would otherwise keep «Выбрано N» with nothing to do.


    if (!this.hasBulkActions) {
      if (this.markedIds?.length || this.table?.getSelectedRecordIds?.()?.length) this.clearSelection?.();
      this._renderBulkBand?.();
    }
  } // Actions given or taken away bring or take the boxes (VHF-11), whether
  // they come as bulkActions or on the page row's actions attribute, now or
  // after the first draw.


  _syncSelects() {
    const selects = this.selects();
    const table = this.table;

    if (table && !hostWroteOff(table, "selectable")) {
      const on = selects && this._queryRefused !== true;
      table.setAttribute("selectable", on ? "true" : "false"); // Rows drawn before carry no box cell: the table writes them when
      // rows are set, so the rows it has are set again (the head showed
      // the box column over rows without boxes).

      const rows = on ? table.getTableData?.().rows ?? [] : [];
      if (rows.length && rows.some(row => row && typeof row === "object" && row.select === undefined)) table.setRows?.(rows.map(row => ({ ...row
      })));
    }

    if (this.layoutKind === "board") this._syncBoard?.();
    if (this.layoutKind === "cards") (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.syncCards)(this);
  }

  _applyBulkActions() {
    const pagination = this.pagination;
    if (!pagination) return; // Taken away (LV4-3): the actions the view wrote on its page row go
    // too; the page's own markup stays the page's.

    if (!this._bulkActions?.length) {
      if (this._mirroredActions != null && pagination.getAttribute("actions") === this._mirroredActions) pagination.removeAttribute("actions");
      this._mirroredActions = null;
      return;
    }

    const clean = text => String(text ?? "").replace(/[|:]/gu, " ").trim();

    const markup = this._bulkActions.map(item => `${clean(item.id ?? item.value)}:${clean(item.label ?? item.text ?? item.id ?? item.value)}`).join("|");

    if (pagination.getAttribute("actions") !== markup) pagination.setAttribute("actions", markup);
    this._mirroredActions = markup;
  }

  get selection() {
    return this._layoutTag() === "sf-view-table" ? this.table?.selection ?? [] : this._layoutSelection();
  } // The list and its page row when the author slots none: drawn in the light
  // DOM, assigned to the layout's slots, so the Framework's styles reach them
  // (VF-3). They were the slots' fallback content inside the shadow root, where
  // no stylesheet of the page arrives: the table's toolbar, rows and boxes and
  // the page row drew unstyled -- the search text 6 px from its icon, raw
  // checkboxes. An element the author slots later takes the place of the view's.


  _lightDefaults() {
    // A board (layout="board", BD-1) is its content and has no page row:
    // each lane has its own «Показать ещё» (C304).
    // Cards (layout="cards") too: «Показать ещё» is under their grid (C306);
    // and the calendar, whose period is its own window (C307).
    const board = this.layoutKind === "board" || this.layoutKind === "cards" || this.layoutKind === "calendar"; // The cards have the table's page row (list study v2, LV2-6): their
    // pages and «Показать ещё» are the list's, as D1 draws them.

    const noPageRow = this.layoutKind === "board" || this.layoutKind === "calendar";
    const defaults = [["content", "sf-view-table", {}], ["pagination", "sf-pagination", {
      appearance: "field",
      top: "false",
      bottom: "false"
    }]];
    if (board) defaults[0][1] = LAYOUTS.get(this.layoutKind);

    for (const [slot, tag, attributes] of defaults) {
      // A part the view does not draw (chrome without pagination, an
      // embedded list) gets no default element: it would print a page
      // row nobody sees into the first paint.
      if (slot === "pagination" && (noPageRow || !this.renders("pagination"))) {
        [...(this.children ?? [])].filter(child => child.getAttribute?.("slot") === slot && child.hasAttribute?.("data-sf-view-default")).forEach(child => child.remove());
        continue;
      } // The layout hold (VSA-5) stands in the list place only while the
      // layout's code loads; the layout's own element is made beside it.


      const own = [...(this.children ?? [])].filter(child => child.getAttribute?.("slot") === slot && !child.hasAttribute?.("data-sf-layout-hold"));
      const mine = own.filter(child => child.hasAttribute?.("data-sf-view-default"));

      if (own.length > mine.length) {
        mine.forEach(child => child.remove());
        continue;
      }

      if (mine.length) continue;
      const element = document.createElement(tag);
      element.setAttribute("slot", slot);
      element.setAttribute("data-sf-view-default", "");

      for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);

      this.append(element);
    } // A host without MutationObserver (a server render, a test DOM) keeps the
    // defaults it was connected with.


    if (!this._defaultsWatch && typeof MutationObserver === "function") {
      this._defaultsWatch = new MutationObserver(() => this._lightDefaults());

      this._defaultsWatch.observe(this, {
        childList: true
      });
    }
  } // The layout the view draws (BD-1): the registry's name for its layout
  // attribute; an unknown one warns once and is the table.


  get layoutKind() {
    const written = this.getAttribute?.("layout");
    if (written === null || written === undefined || written === "") return "table";
    const name = layoutName(written);
    if (LAYOUTS.has(name)) return LAYOUT_KINDS[LAYOUTS.get(name)] ?? name;
    this._layoutWarned ??= new Set();

    if (!this._layoutWarned.has(name)) {
      this._layoutWarned.add(name);

      console.warn(`sf-view: layout "${written}" is not a layout of the view set; the table draws it (layouts: ${[...LAYOUTS.keys(), ...Object.keys(LAYOUT_ALIASES)].join(", ")})`);
    }

    return "table";
  } // The kind of the layout the page wrote when the view was connected (no
  // switch, no person's state): null before it is connected.


  get pageLayoutKind() {
    if (this._pageLayout === undefined) return null;
    const written = this._pageLayout;
    if (written === null || written === "") return "table";
    const name = layoutName(written);
    return LAYOUTS.has(name) ? LAYOUT_KINDS[LAYOUTS.get(name)] ?? name : "table";
  }

  static registerLayout(name, tag) {
    if (!/^[a-z][a-z0-9-]*$/u.test(String(name)) || !/^sf-[a-z0-9-]+$/u.test(String(tag))) throw new TypeError("A layout is a name and an sf- element");
    LAYOUTS.set(String(name), String(tag));
  }

  static get layouts() {
    return Object.fromEntries(LAYOUTS);
  } // Whether the view draws a display kind in this page (the layout
  // registry): table, list and auto are the table's; board, cards and
  // calendar are their elements', and a layout a product registers
  // (registerLayout) is its element's -- each only when that element is in
  // the running set: defined, or a rule the Loader can fetch (cl-<name>). A
  // kind that is not is hidden by the list head (VR3-1, DEV's decision).


  canDrawLayout(kind) {
    const tag = LAYOUTS.get(layoutName(kind));
    if (!tag) return false;
    if (tag === "sf-view-table") return true;
    return Boolean(globalThis.customElements?.get?.(tag) || globalThis.SF?.RuleLoader?.[tag.replace(/^sf-/u, "cl-")]);
  } // The display kind switched live (the list head's Таблица / Доска, or a
  // page): the content element is swapped for the layout's own, the marked
  // records and the open record card stay, what is already known is drawn at
  // once and the host is asked again with the new layout's query (a board's
  // lane window). Answers an outcome; a kind the registry does not hold is
  // refused and nothing changes.


  switchLayout(kind, {
    refresh = true
  } = {}) {
    const name = layoutName(kind);
    if (!LAYOUTS.has(name)) return {
      outcome: "refused",
      reason: "layout-unavailable"
    };

    const fromTag = this._layoutTag();

    const toTag = LAYOUTS.get(name); // The table's own layout (auto, list or table) as the page wrote it
    // before the first switch, given back when «Таблица» is chosen.

    if (this._tableLayout === undefined) this._tableLayout = fromTag === "sf-view-table" ? this.getAttribute("layout") : null;

    const marked = this._layoutSelection(); // Back to the table: the layout the page wrote for it (auto, list or
    // table), or none -- the table's own default, as before the board.


    const own = tableLayout(this._tableLayout) ? this._tableLayout : null;
    const written = toTag === "sf-view-table" ? name === "table" ? own : name : LAYOUT_KINDS[toTag] ?? name;

    if (fromTag !== toTag) {
      // The record first on screen stays on screen (LV2-8): the new
      // kind opens on the page that holds it, in its own page size, so
      // the page row and the records never disagree. It is held over
      // switches back and forth until the person turns a page or asks
      // anything else: table page 2 -> cards 1-24 -> table page 2.
      const perBefore = Number(this.query?.per_page) || VIEW_DEFAULT_PAGE_SIZE;
      this._anchorFirst ??= ((Number(this._runStart ?? this.query?.page) || 1) - 1) * perBefore + 1;
      this._keepFirst = this._anchorFirst; // Marks belong to the presentation (owner decision C413, view
      // round 15m; it replaces the carry of C298 / LV2-2 and VR14-1):
      // the kind leaving keeps its own marks, the drawn ones as it
      // shows them, for its other pages and for when it comes back;
      // the kind coming in starts from its own, never from these. Its
      // «Выбраны все N» is its own too.

      this._noteMarks([...this._drawnIds(fromTag)], marked);

      (this._allMarkedOf ??= {})[marksKind(fromTag)] = Boolean(this.pagination?.actionForAll); // The incoming kind's own marks are held until the switch's own
      // query answers: a table drawn with the records the other kind
      // showed, then cleared by its new result, says «none marked» for
      // rows that are its marks.

      const coming = this._marksOf?.[marksKind(toTag)];
      this._ownHeld = coming && coming.key === this._markKey() && coming.ids.size ? [...coming.ids.values()] : null;
      this._ownHeldSequence = this.sequence;
      const all = Boolean(this._allMarkedOf?.[marksKind(toTag)]);
      if (Boolean(this.pagination?.actionForAll) !== all) this.pagination?.setState?.({
        actionForAll: all
      }); // The cards ask their own page size (24, C306) and the calendar
      // asks days, not pages: the list's page size is kept while either
      // is on screen and comes back with the table or the board (the
      // calendar's query has none, and the page row's own default was
      // asked after it).

      if (OWN_PAGING.has(toTag)) this._perPageOfList ??= {
        value: this.query?.per_page
      };else if (this._perPageOfList) {
        if (this._perPageOfList.value === undefined) delete this.query.per_page;else this.query.per_page = this._perPageOfList.value;
        this._perPageOfList = null;
      }
      if (toTag === "sf-view-table") this.query.page = pageHolding(this._keepFirst, this.query.per_page);else if (!OWN_PAGING.has(toTag)) this.query.page = 1;
      if (toTag !== "sf-view-cards") this._keepFirst = null;
      if (this.query && typeof this.query === "object") delete this.query.window;
    }

    this._drawnTag ??= fromTag;
    if (written === null) this.removeAttribute("layout");else this.setAttribute("layout", written); // The query names the kind drawn (V5): a switch by a call left the
    // query, and the list head's switch, on the kind before.

    const drawnKind = this.layoutKind;
    if (this.query && typeof this.query === "object" && this.query.view && typeof this.query.view === "object" && this.query.view.type !== drawnKind) this.query = { ...this.query,
      view: { ...this.query.view,
        type: drawnKind
      }
    };
    if (fromTag !== toTag) this.pagination?.setState?.({
      selectedCount: this.markedIds.length
    }); // The list's bar follows the kind on screen at once (one bar).

    if (fromTag !== toTag && (this._bulkBar || this._bulkBand)) this._renderBulkBand(); // refresh: false is for a caller that asks the host itself next.

    if (refresh && this.isConnected) this.refresh("layout-change");
    return {
      outcome: "applied",
      layout: this.layoutKind
    };
  } // The element the current layout draws with: sf-view-table for auto,
  // table and list, else the registry's element.


  _layoutTag() {
    return LAYOUTS.get(this.layoutKind) ?? "sf-view-table";
  } // The marks of the presentation on screen (C413): each kind (table,
  // board, cards, calendar) keeps its own, kept as before by the search and
  // the filters they were made under (_markKey).


  get _marks() {
    return this._marksOf?.[marksKind(this._layoutTag())] ?? null;
  }

  set _marks(value) {
    (this._marksOf ??= {})[marksKind(this._layoutTag())] = value;
  } // The ids of the records a kind draws now.


  _drawnIds(tag) {
    const records = tag === "sf-view-board" ? (this.boardLanes ?? []).flatMap(lane => lane.records ?? []) : tag === "sf-view-calendar" ? this._calendarRecords ?? [] : tag === "sf-view-cards" ? this.records ?? [] : this.cappedRecords ?? [];
    return new Set(records.map(record => String(record?.id)));
  } // The marked records of the layout on screen (table, board, cards or
  // calendar), as ids.


  _layoutSelection() {
    const tag = this._layoutTag();

    if (tag === "sf-view-board") return this.board?.selected ?? [];
    if (tag === "sf-view-cards") return this.cards?.selected ?? [];
    if (tag === "sf-view-calendar") return (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.calendarOf)(this)?.selected ?? [];
    return this.table?.selection ?? [];
  } // The content element the layout draws with. A view-made table or board
  // of the other layout is replaced by the layout's own; the page's own
  // element of the other layout (a table it slotted with its filter fields
  // and create items) is parked -- kept, out of every slot, so it draws
  // nothing -- and comes back when its layout does. What is known is drawn
  // into the new element at once.


  _swapContent() {
    const want = this._layoutTag();

    const children = [...(this.children ?? [])];

    for (const child of children) {
      if (child.getAttribute?.("slot") !== "content" || (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.isTag)(child, want) || child.hasAttribute?.("data-sf-layout-hold")) continue;
      if (child.hasAttribute?.("data-sf-view-default") || child.hasAttribute?.("data-sf-view-made")) child.remove();else {
        child.setAttribute("slot", "sf-view-parked");
        child.toggleAttribute("data-sf-view-parked", true); // A page that wrote layout="board" over its own sf-view-table
        // (the markup a host with the list head writes) is told once
        // that the board draws and the table waits for «Таблица»
        // (VR2-5); a switch made by a person parks it silently.

        if (!this._answered && !this._parkedWarned && want !== "sf-view-table") {
          this._parkedWarned = true;
          console.warn(`sf-view: layout="${LAYOUT_KINDS[want] ?? this.layoutKind}" draws ${want}; the page's ${child.localName} in slot "content" is kept for its layout and shows when that layout is chosen`);
        }
      }
    }

    for (const child of children) {
      if (child.hasAttribute?.("data-sf-view-parked") && (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.isTag)(child, want)) {
        child.removeAttribute("data-sf-view-parked");
        child.setAttribute("slot", "content");
      }
    } // What the board knew becomes the list's records for the other layouts.


    if (this._drawnTag === "sf-view-board" && want !== "sf-view-board" && this.boardLanes?.length) {
      this.records = this.boardLanes.flatMap(lane => lane.records ?? []);
    }

    this._drawnTag = want;

    this._lightDefaults();

    if (want === "sf-view-board") {
      this._askForParts(["sf-view-board"]); // The lanes of the last answer, if the host sent any, draw now.


      this._boardFresh = Array.isArray(this.boardLanes) && this.boardLanes.length > 0;
    } else if (want === "sf-view-cards") {
      this._askForParts(["sf-view-cards"]);
    } else if (want === "sf-view-calendar") {
      this._askForParts(["sf-view-calendar"]); // The records known draw on their days at once; the host's answer
      // for the days on screen replaces them.


      if (this._answered && Array.isArray(this.records)) {
        this._calendarRecords = copy(this.records);
        this._calendarFresh = true;
      }
    } else {
      this._askForParts(["sf-view-table", "sf-pagination"]);
    }
  } // The kind's own marks (C413), given back to its element as it shows the
  // records they name: at once from what is known, and again over the
  // answer to the switch's own query (a new result clears a table's marks).


  _applyOwnMarks() {
    // The list's bar follows the kind on screen: the table's and the
    // cards' marks, none under the board or the calendar (they draw their
    // own), so a switch never leaves two bars (owner, 2026-11-22).
    if (this._bulkBar || this._bulkBand) this._renderBulkBand(); // What the person marked in this kind, on this page and others.

    const ids = [...new Set([...(this._ownHeld ?? []), ...this.markedIds].map(String))];

    const tag = this._layoutTag(); // Once the switch's query answered, what was held is the kind's marks
    // again (a table drawn with the other kind's records, then cleared by
    // its new result, took them for unmarked), and its «Выбраны все N».


    if (this._ownHeld && this.pending === null && this.sequence > (this._ownHeldSequence ?? 0)) {
      const held = this._ownHeld;
      this._ownHeld = null;
      if (held.length) this._noteMarks([], held);
      const all = Boolean(this._allMarkedOf?.[marksKind(tag)]);
      if (Boolean(this.pagination?.actionForAll) !== all) this.pagination?.setState?.({
        actionForAll: all
      });
      this.pagination?.setState?.({
        selectedCount: this.markedIds.length
      });
      if (this._bulkBar || this._bulkBand) this._renderBulkBand();
    } // Boxes taken away by the chrome: the marks stay kept, not shown (VL-71).


    if (!this.renders("select")) return;
    const allMarked = Boolean(this.pagination?.actionForAll); // One bar: the list's stands for the cards (owner, 2026-11-22), with
    // marks or without.

    if (tag === "sf-view-cards") this.cards?.setAttribute?.("bulk-bar", "false");
    if (!ids.length && !(allMarked && tag === "sf-view-cards")) return;

    if (tag === "sf-view-board") {
      const board = this.board;
      if (!board || !this.boardLanes?.length) return;
      const shown = new Set(this.boardLanes.flatMap(lane => lane.records ?? []).map(record => String(record?.id)));
      board.selected = ids.filter(id => shown.has(id));
    } else if (tag === "sf-view-cards" || tag === "sf-view-calendar") {
      const element = tag === "sf-view-cards" ? this.cards : (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.calendarOf)(this);
      const records = tag === "sf-view-cards" ? this.records : this._calendarRecords;
      if (!element || !Array.isArray(records) || !records.length) return;
      const shown = new Set(records.map(record => String(record?.id)));

      if (tag === "sf-view-cards") {
        // The cards keep the marks of other pages (keep-selection),
        // and their own «Выбраны все N» marks every card (LV2-7).
        element.setAttribute("keep-selection", ""); // One bar: the list's stands for the cards (owner, 2026-11-22).

        element.setAttribute("bulk-bar", "false");
        element.toggleAttribute("all-selected", allMarked);
        element.selected = ids;
        this._cardsSelection = element.selected;
      } else element.selected = ids.filter(id => shown.has(id));
    } else {
      const table = this.table;
      if (typeof table?.applyRowSelection !== "function" || !this.cappedRecords?.length) return;
      const shown = new Set(this.cappedRecords.map(record => String(record?.id)));
      const marked = new Set((table.getSelectedRecordIds?.() ?? []).map(String));

      for (const id of ids) if (shown.has(id) && !marked.has(id)) table.applyRowSelection(id, true);
    }
  } // What the person changed in «Настроить вид» for a board, the cards or
  // the calendar (the list head's own settings, saved for them at once,
  // C298): laid over the layout's options the host answers, so they show
  // at once and stay through the next answer that does not echo them yet
  // (view round 13, VHF-13).


  ownLayoutSettings(kind) {
    const own = this._head?._settings?.[kind]; // What the person set for every list of the kind (C408) under what
    // they set here.

    return { ...this.kindPreferences(kind),
      ...(own && typeof own === "object" ? copy(own) : {})
    };
  } // A layout setting changed in «Настроить вид» (VHF-13): drawn at once. A
  // board's lane field and a calendar's date field change what is asked, so
  // the list is asked again; the rest (card fields, empty lanes, the card
  // size, the colour field) is drawn from what is on screen.


  applyLayoutSettings(kind, patch = {}) {
    if (!["board", "cards", "calendar"].includes(kind) || !patch || typeof patch !== "object") return;
    if (kind !== this.layoutKind) return; // The board asks with its new lane field and draws the lanes when they
    // come; the calendar takes its new date field first, since the days
    // it asks for are its own window.

    if (kind === "board" && "lane_field" in patch) {
      this.refresh("settings-change");
      return;
    }

    this._renderProjection();

    if (kind === "calendar" && "date_field" in patch) this.refresh("settings-change");
  }

  get board() {
    const slot = this.shadowRoot?.querySelector('slot[name="content"]');
    return slot?.assignedElements?.().find(element => (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.isTag)(element, "sf-view-board")) ?? this.querySelector?.(':scope > sf-view-board[slot="content"]') ?? null;
  }

  get cards() {
    return (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.cardsOf)(this);
  }

  get table() {
    const slot = this.shadowRoot.querySelector('slot[name="content"]');
    return slot.assignedElements().find(element => (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.isTag)(element, "sf-view-table")) ?? slot.querySelector((0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.tagSelector)("sf-view-table"));
  } // The band of bulk controls, kept in the light DOM so the Framework styles
  // reach it, and assigned to the layout's own slot so the card contains it.


  get bulkBand() {
    if (this._bulkBand?.isConnected) return this._bulkBand;
    const existing = this.querySelector(':scope > [slot="bulk"]');
    this._bulkBand = existing ?? document.createElement("div");

    this._bulkBand.setAttribute("slot", "bulk");

    this._bulkBand.classList.add("sf-pagination-actions", "flex", "items-cross-center");

    this._bulkBand.setAttribute("role", "region");

    if (!this._bulkBand.isConnected) this.append(this._bulkBand);
    return this._bulkBand;
  } // The show-all row, in the light DOM for the same reason the bulk band and the
  // notice are: the Framework's stylesheets do not cross a shadow boundary, so a
  // control drawn inside the shadow comes out as a native grey button. A consumer
  // reported exactly that beside «5 of 61», and it is the same trap that had an
  // embedded table showing its icon ligatures as text.


  get showAllBand() {
    if (this._showAll?.isConnected) return this._showAll;
    const existing = this.querySelector(':scope > [slot="show-all"]');
    this._showAll = existing ?? document.createElement("div");

    this._showAll.setAttribute("slot", "show-all");

    this._showAll.classList.add("flex", "items-cross-center", "gap-1/3"); // The click is listened for on the band rather than on this element. A
    // listener on the element would see every click inside it, and the handler
    // below branches on [data-save] and [data-delete] as well -- a row that
    // happened to carry one of those would have reached the wrong branch.


    if (this._showAll.getAttribute("data-sf-bound") !== "1") {
      this._showAll.setAttribute("data-sf-bound", "1");

      this._showAll.addEventListener("click", this._bound);
    }

    if (!this._showAll.isConnected) this.append(this._showAll);
    return this._showAll;
  } // The notice: one alert at a time, in the light DOM so the Framework's own
  // styles reach it, assigned to the layout's slot so the card holds it.


  get noticeBand() {
    if (this._notice?.isConnected) return this._notice;
    const existing = this.querySelector(':scope > [slot="notice"]');
    this._notice = existing ?? document.createElement("div");

    this._notice.setAttribute("slot", "notice");

    if (!this._notice.isConnected) this.append(this._notice);
    return this._notice;
  } // What a reason code says to a person. A host that sends its own `message`
  // is believed; a reason this component knows is translated; anything else
  // is a plain sentence, with the code kept in the title for the people who
  // read codes. A code is never the message: the consumer saw
  // `minimal_cms_action_rejected` where a sentence belonged.


  _noticeText(answer = {}) {
    const message = hostMessage(answer);
    if (message) return message; // The host's own sentence wins; these are what to say when it sent
    // none. They follow the page's language like every other word.

    const keys = {
      "action-not-allowed": "noticeActionNotAllowed",
      "capability-not-provided": "noticeCapabilityNotProvided",
      "port-not-connected": "noticePortNotConnected",
      "saved-view-levels-require-port-1.1.0": "noticeSavedViewLevels",
      // The rest of the reasons simai.dataview-port 1.12.0 lists: each
      // has its own words rather than the answer's general one.
      "confirm_required": "noticeConfirmRequired",
      "not-confirmed": "noticeNotConfirmed",
      "no-base-revision": "noticeNoBaseRevision",
      "record_invalid": "noticeRecordInvalid",
      "forbidden": "noticeForbidden",
      "stale-revision": "noticeStaleRevision"
    };
    if (keys[answer.reason]) return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, keys[answer.reason], this);
    const byAnswer = {
      conflict: "noticeConflict",
      refused: "noticeRefused",
      unavailable: "noticeUnavailable"
    }[answer.answer];
    return (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, byAnswer ?? "noticeFailed", this);
  } // Shown over the card, not in it. `role` follows what happened: an error is
  // an alert, a refusal is a message.


  notify(text, {
    kind = "error",
    code = ""
  } = {}) {
    // The page's one notification area (SF.notify, Framework
    // ui-82fc0ba882ba): the view's messages go where every other message
    // goes, and a notification centre records them from sf-notification
    // (owner, 2026-10-13). A clear closes the view's last message there.
    // A Framework without SF.notify keeps the band over the card.
    if (typeof globalThis.SF?.notify === "function") {
      if (!text) {
        this._notifyHandle?.close?.();
        this._notifyHandle = null;
        return this;
      }

      this._notifyHandle = globalThis.SF.notify({
        status: kind === "error" ? "error" : "warning",
        title: text,
        // Long enough to read a sentence, as the band's was.
        duration: 7000,
        source: code ? `sf-view:${code}` : "sf-view",
        key: code ? `sf-view:${code}` : undefined
      });
      return this;
    }

    const band = this.noticeBand;
    band.replaceChildren();

    if (!text) {
      band.remove();
      this._notice = null;
      return this;
    }

    this._askForParts(["sf-toast"]);

    const toast = document.createElement("sf-toast");
    toast.setAttribute("status", kind === "error" ? "error" : "warning");
    toast.setAttribute("closable", "true");
    toast.setAttribute("close-label", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "closeNoticeLabel", this));
    toast.setAttribute("role", kind === "error" ? "alert" : "status");
    toast.setAttribute("heading", text); // Long enough to read a sentence, and it can be closed at once. A
    // message that stays until it is dismissed ends up covering something,
    // which is how the overlay before it went wrong.

    toast.setAttribute("duration", "7000"); // The code is for the people who read codes, and they read it in the
    // inspector: shown as a second line it was a raw identifier under a
    // sentence, which the owner read as noise (2026-10-12).

    if (code) toast.setAttribute("data-sf-code", code); // Closed, not asked to close: sf-toast-close is the cancelable request now.

    toast.addEventListener("sf-toast-closed", () => this.notify(""));
    band.append(toast);
    return this;
  }

  get pagination() {
    const slot = this.shadowRoot.querySelector('slot[name="pagination"]');
    return slot.assignedElements().find(element => element.matches("sf-pagination")) ?? slot.querySelector("sf-pagination");
  } // ---------- the footer (owner decision C97 (5)) ----------
  // One row: «41–60 из 240 · По 20 ▾ · ‹ [3] из 12 ›». The range and the page
  // size are the view's own; the page row is sf-pagination with an explicit
  // appearance, field, which draws the navigation only. Without an
  // appearance sf-pagination drew all three as its compatible footer, which
  // retires on 2027-01-01 (ui-source change journal
  // value-pagination-footer-parts-to-view). The state stays the page row's:
  // the view writes it there (setState) as it always did and reads it back
  // here, so a page that set page-sizes, total-label or its own words on the
  // page row keeps them, and the words are sf-pagination's (range,
  // range-many, page-size-text: one language file for the row).
  // The page row in the field appearance. A row the page gave without one is
  // given it (C97 handoff 1); an appearance the page chose is kept.


  _paginationAppearance(pagination = this.pagination) {
    if (!pagination?.setAttribute || pagination.hasAttribute?.("appearance")) return;
    pagination.setAttribute("appearance", "field");
    pagination.setAttribute("data-sf-view-appearance", "");
  } // The footer under 37.5rem of the list (C404): two columns, the page
  // numbers on a line of their own (data-sf-view-footer-narrow). The list's
  // own width -- the content box: a record card docked beside it pads the
  // view by its own width (VHF-5).


  _watchFooterWidth() {
    if (this._footerWidth || typeof ResizeObserver !== "function") return;

    const mark = () => {
      const style = globalThis.getComputedStyle?.(this);
      const pad = style ? (Number.parseFloat(style.paddingInlineStart) || 0) + (Number.parseFloat(style.paddingInlineEnd) || 0) : 0;
      const width = this.getBoundingClientRect().width - pad;
      const rem = Number.parseFloat(globalThis.getComputedStyle?.(document.documentElement)?.fontSize) || 16;
      const narrow = width > 0 && width < 37.5 * rem;
      if (narrow !== this.hasAttribute("data-sf-view-footer-narrow")) this.toggleAttribute("data-sf-view-footer-narrow", narrow);
    }; // The mark is written in the next frame (VR14-6): written in the
    // observer's own callback it moved the footer, which resized the
    // view in the same frame («ResizeObserver loop completed»).


    let queued = 0;
    this._footerWidth = new ResizeObserver(() => {
      if (queued) return;
      queued = (globalThis.requestAnimationFrame ?? globalThis.setTimeout)(() => {
        queued = 0;
        mark();
      });
    });

    this._footerWidth.observe(this);

    mark();
  } // The start of the footer: the range (and the offer to count), then the
  // page size. In the light DOM, slotted, so the Framework's styles reach
  // the buttons and the menu (the band of bulk controls is placed so too).


  get footerStart() {
    if (this._footerStart?.isConnected && this._footerParts) return this._footerStart;
    const existing = this.querySelector(':scope > [slot="footer"][data-sf-view-made]');
    const start = existing ?? document.createElement("div");
    start.setAttribute("slot", "footer");
    start.setAttribute("data-sf-view-made", ""); // A printed start is adopted: its parts are drawn anew below.

    start.removeAttribute?.("data-sf-static");
    start.classList.add("sf-view-footer-start"); // The parts are kept by reference: a Smart button moves the data-*
    // attributes of its host onto the <button> it draws, so a query by
    // attribute finds the inner button once the element is defined.

    start.innerHTML = '<span class="sf-view-footer-total">' + '<span class="sf-view-footer-range" role="status"></span>' + '<sf-button class="sf-view-footer-count" appearance="ghost" scheme="primary" hidden></sf-button>' + '<sf-spinner class="sf-view-footer-counting" hidden></sf-spinner></span>' + '<sf-button class="sf-view-footer-size" appearance="ghost" scheme="on-surface" icon-end="arrow_drop_down" aria-haspopup="menu"></sf-button>';
    const parts = {
      range: start.querySelector(".sf-view-footer-range"),
      count: start.querySelector(".sf-view-footer-count"),
      counting: start.querySelector(".sf-view-footer-counting"),
      size: start.querySelector(".sf-view-footer-size"),
      menu: null
    };
    parts.count?.addEventListener("click", () => this.pagination?.requestCount?.("total"));
    parts.size?.addEventListener("click", () => this._togglePageSizeMenu(parts.size));
    if (!start.isConnected) this.append(start);
    this._footerStart = start;
    this._footerParts = parts;
    return start;
  } // The page row's attributes are its state: whatever writes them -- this
  // view's projection, a count, the person paging -- the footer is drawn
  // again, once per task.


  _watchPagination() {
    const pagination = this.pagination;
    if (!pagination || this._watchedPagination === pagination || typeof MutationObserver === "undefined") return;
    this._paginationObserver?.disconnect();
    this._watchedPagination = pagination;
    this._paginationObserver = new MutationObserver(records => {
      this._queueFooter();

      if (records.some(record => record.attributeName === "actions")) this._syncSelects();
    });

    this._paginationObserver.observe(pagination, {
      attributes: true
    }); // Its words change without an attribute (a language chosen on the
    // page): it says so with sf-updated, once per draw of its own.


    this._paginationUpdates?.abort();
    this._paginationUpdates = new AbortController();
    pagination.addEventListener("sf-updated", event => {
      if (event.target === pagination) this._queueFooter();
    }, {
      signal: this._paginationUpdates.signal
    });

    if (!globalThis.customElements?.get?.("sf-pagination")) {
      globalThis.customElements?.whenDefined?.("sf-pagination")?.then?.(() => this._queueFooter());
    }
  }

  _queueFooter() {
    if (this._footerQueued) return;
    this._footerQueued = true;
    Promise.resolve().then(() => {
      this._footerQueued = false;
      if (this.isConnected) this._drawFooter();
    });
  }

  _drawFooter() {
    if (this._drawCountFooter()) return this._drawMore(null);
    const pagination = this.pagination; // Drawn from the page row's own reading of its state, so not before
    // the row is an sf-pagination (its module may still be on the way).

    if (!pagination || typeof pagination.setState !== "function" || typeof pagination.requestCount !== "function" || !this.renders("pagination")) return this._drawMore(null);
    if (!this.footerStart) return this._drawMore(null);
    this._footerStart.hidden = false;

    const part = name => this._footerParts?.[name] ?? null;

    const size = this.controlSize;

    const sized = element => {
      if (!element) return;
      if (size) element.setAttribute("size", size);else element.removeAttribute("size");
    };

    const write = (element, name, value) => {
      if (element && element.getAttribute(name) !== value) element.setAttribute(name, value);
    };

    const range = part("range"); // The «Показать ещё» look grows the list page by page: the range is
    // all the rows on screen, «1–12 из 12», not the page that came last
    // («11–12 из 12» beside «Показано 12 из 12», view round 5 R5-4).

    const paging = this._viewPaging();

    const growing = (pagination.getAttribute?.("appearance") === "more" || paging !== null && paging !== "pages") && (this.records ?? []).length > 0;
    const text = growing ? this._shownRangeText(paging === null ? 1 : this._runFrom()) : pagination.rangeText ?? ""; // The page numbers go where the list goes on by «Показать ещё» alone
    // or by itself (D1); «Вместе» and «Страницами» keep them.

    const off = paging === "more" || paging === "endless";
    if (pagination.hasAttribute("data-sf-view-paging-off") !== off) pagination.toggleAttribute("data-sf-view-paging-off", off);

    this._drawMore(paging);

    if (range && range.textContent !== text) range.textContent = text; // «41–60 из ~450» or «из многих»: the offer to count, where the host
    // counts on request, and a short wait while it does (as the
    // compatible footer offered it).

    const exact = pagination.countKnown !== false && pagination.totalExact !== false;
    const counting = Boolean(pagination.counting);
    const count = part("count");
    sized(count);
    write(count, "text", pagination.showCountLabel ?? "");
    if (count) count.hidden = exact || counting || !pagination.canCount;
    const spinner = part("counting");
    sized(spinner);
    write(spinner, "aria-label", pagination.countingLabel ?? "");
    if (spinner) spinner.hidden = exact || !counting; // The page size: a quiet button «По 20 ▾» that opens a menu of the
    // sizes offered (C97 (3)); named «На странице: 20».

    const pageSize = pagination.pageSize;
    const hasPages = pagination.countKnown === false || Number(pagination.total) > 0;
    const button = part("size");
    sized(button);
    write(button, "text", pagination.sfWord?.("page-size-text", {
      vars: {
        size: pageSize
      }
    }) ?? String(pageSize));
    write(button, "aria-label", `${pagination.pageSizeLabel ?? ""} ${pageSize}`.trim()); // A host that names the footer's parts without page-size (VR5-6)
    // keeps the range and the pages, not the size choice.

    if (button) button.hidden = pagination.showPageSize === false || !hasPages || !this.renders("page-size");
    const menu = part("menu");
    sized(menu);
    write(menu, "aria-label", pagination.pageSizeLabel ?? "");
  } // A board and cards (view round 7, C388): no page row -- each lane and the
  // cards' grid end in their own «Показать ещё» (C304, C306) -- yet the
  // footer says how many, as the table's does: «1–16 из 60», the records on
  // screen of all the host counted, in the table footer's words. Nothing
  // before the first answer, for an empty, failed or refused list, or where
  // the page turned the page row off. True when the view draws such a kind.


  _drawCountFooter() {
    const kind = this.layoutKind; // Cards with a page row draw the table's footer (LV2-6); without
    // one they say their count as the board does.

    if (kind !== "board" && !(kind === "cards" && !this.pagination)) {
      // Back to a table or on to a calendar: the mark goes with the kind.
      this.removeAttribute?.("data-sf-view-footer-count");
      return false;
    }

    const shown = (this.records ?? []).length;
    const show = this.renders("pagination") && this._answered && !this._queryRefused && !["error", "no-access"].includes(this.getAttribute("data-state") ?? "") && shown > 0;
    this.toggleAttribute("data-sf-view-footer-count", show);

    if (!show) {
      if (this._footerStart) this._footerStart.hidden = true;
      return true;
    }

    const start = this.footerStart;
    start.hidden = false;
    const parts = this._footerParts ?? {};
    const words = {
      component: "sf-pagination"
    };

    const text = this._shownRangeText();

    if (parts.range && parts.range.textContent !== text) parts.range.textContent = text;

    for (const name of ["count", "counting", "size"]) if (parts[name]) parts[name].hidden = true; // The page size is not offered here (each portion is the lane's or the
    // grid's own); its hidden button still carries its words, so it is
    // never a button without a name.


    const size = Number(this.query.per_page) || "";

    if (parts.size && !parts.size.getAttribute("text")) {
      parts.size.setAttribute("text", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageWord)(PAGINATION_RANGE_TEXT, "page-size-text", this, { ...words,
        vars: {
          size
        }
      }));
      parts.size.setAttribute("aria-label", `${(0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageWord)(PAGINATION_RANGE_TEXT, "page-size-label", this, words)} ${size}`.trim());
    }

    return true;
  } // «1–N из M»: the records on screen of all the host counted, in the
  // page row's words (a board, cards, and the «Показать ещё» look).


  _shownRangeText(from = 1) {
    const shown = (this.records ?? []).length;
    const to = from - 1 + shown;
    const words = {
      component: "sf-pagination"
    };
    const known = this.countKnown !== false && Number.isSafeInteger(this.total);
    return known ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageWord)(PAGINATION_RANGE_TEXT, "range", this, { ...words,
      vars: {
        from,
        to,
        total: this._shownTotal(Math.max(this.total, to))
      }
    }) : (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageWord)(PAGINATION_RANGE_TEXT, "range-many", this, { ...words,
      vars: {
        from,
        to
      }
    });
  } // ---------- going on past the first page (owner decision D1) ----------
  // How the list goes on: the table's and, since view round 14, the
  // cards' own (D1 for the cards, DEV r13 answer). The person's choice in
  // «Вид» (layouts.<kind>.paging, saved for them), else theirs for every
  // list of the kind (C408), else the view's document, else what this
  // browser kept for the list, else the page's paging attribute, else
  // «Вместе».


  pagingOf(kind = "table") {
    const own = kind === "cards" ? "cards" : "table";

    const valid = value => VIEW_PAGING.includes(String(value)) ? String(value) : null;

    return valid(this._head?._settings?.[own]?.paging) ?? valid(this.kindPreferences(own).paging) ?? valid(this.viewConfig?.layouts?.[own]?.paging) ?? valid(this.preferencesKey ? preferences()?.read(this.preferencesKey)?.[own === "cards" ? "cardsPaging" : "paging"] : null) ?? valid(this.getAttribute("paging")) ?? VIEW_PAGING_DEFAULT;
  } // The paging of the kind on screen (a table list, or the cards).


  get paging() {
    return this.pagingOf(this.layoutKind === "cards" ? "cards" : "table");
  } // What a person set for how a kind looks, kept for all their lists of
  // that kind (owner decision C408, «похожие списки» = the lists of the
  // same kind, C410): SF.Preferences sf-view/* {kinds: {<kind>: {...}}}.
  // Only the look of the kind travels -- the paging, the card size and
  // labels, the empty lanes; fields (card fields, a lane or a date field)
  // belong to a list's own data and stay that list's.


  kindPreferences(kind) {
    let kept = null;

    try {
      kept = preferences()?.read(GENERAL_VIEW_PREFERENCE)?.kinds?.[kind];
    } catch {
      kept = null;
    }

    if (!kept || typeof kept !== "object") return {};
    const keys = KIND_LOOK_KEYS[kind] ?? [];
    return Object.fromEntries(Object.entries(kept).filter(([key]) => keys.includes(key)));
  }

  keepKindSetting(kind, key, value) {
    if (!(KIND_LOOK_KEYS[kind] ?? []).includes(key)) return;

    try {
      const stored = preferences()?.read(GENERAL_VIEW_PREFERENCE) ?? {};
      const kinds = { ...(stored.kinds ?? {})
      };
      kinds[kind] = { ...(kinds[kind] ?? {}),
        [key]: copy(value)
      };
      preferences()?.write(GENERAL_VIEW_PREFERENCE, { ...stored,
        v: 1,
        kinds
      });
    } catch {// No store (a page without SF.Preferences): the choice holds for this list.
    }
  } // Whether the view chooses how the table goes on: its own page row, or
  // one the page wrote without an appearance. A page row the page gave an
  // appearance of its own is the page's choice, and the view leaves it.


  get pagingOffered() {
    const row = this.pagination;
    if (!row || !["table", "cards"].includes(this.layoutKind)) return false;
    return !row.hasAttribute("appearance") || row.hasAttribute("data-sf-view-appearance") || row.hasAttribute("data-sf-view-made") || row.hasAttribute("data-sf-view-default");
  } // The paging in force on a table list, or null where the page row is the
  // page's own (or there is no table list: a tree has no pages).


  _viewPaging() {
    if (!this.pagingOffered || this.treeMode === "tree") return null;
    return this.paging;
  } // The first record's number on screen: the page the rows start from.


  _runFrom() {
    const size = Number(this.query.per_page) || VIEW_DEFAULT_PAGE_SIZE;
    return ((Number(this._runStart) || 1) - 1) * size + 1;
  } // Whether the host has more past the rows on screen.


  _hasMoreRows() {
    const shown = this._runFrom() - 1 + (this.records ?? []).length;
    if (this.countKnown !== false && Number.isSafeInteger(this.total)) return shown < this.total;
    return this.hasNext === true;
  } // A paging the person chose (D1): kept in this browser for the first
  // paint (the view's document comes with the answer), then drawn. The
  // cards keep theirs apart (view round 14).


  applyPaging(value, kind = "table") {
    if (!VIEW_PAGING.includes(String(value))) return;
    if (this.preferencesKey) this._keepPreference({
      [kind === "cards" ? "cardsPaging" : "paging"]: String(value)
    });

    this._queueFooter();

    if (kind === "cards") this._renderProjection?.();
  } // «Показать ещё N» across the list, right under its last row (D1): in
  // «Вместе» above the page numbers, alone in «Показать ещё», and in
  // «Бесконечно» the button the list loads by itself from as a person's
  // scroll brings it into view (never on load by itself), kept for the
  // keyboard. The next page is asked with the reason show-more and appended
  // to the rows (the view has always appended it).


  _drawMore(paging = this._viewPaging()) {
    const existing = this.querySelector(':scope > [slot="more"][data-sf-view-made]');
    const state = this.getAttribute("data-state") ?? "";

    const show = paging !== null && paging !== "pages" && this._answered && !this._queryRefused && !["error", "no-access"].includes(state) && (this.records ?? []).length > 0 && this._hasMoreRows();

    if (!show) {
      if (existing) existing.hidden = true;
      return;
    }

    let holder = existing;

    if (!holder) {
      holder = document.createElement("div");
      holder.setAttribute("slot", "more");
      holder.setAttribute("data-sf-view-made", "");
      holder.className = "sf-view-more";
      holder.innerHTML = '<sf-button class="sf-view-more-button" full-width appearance="outline" scheme="on-surface"></sf-button>';
      holder.firstElementChild.addEventListener("click", () => this._showMore());
      this.append(holder);
    }

    holder.hidden = false;
    const button = holder.firstElementChild;
    const size = this.controlSize;
    if (size) button.setAttribute("size", size);else button.removeAttribute("size");
    const perPage = Number(this.query.per_page) || VIEW_DEFAULT_PAGE_SIZE;
    const known = this.countKnown !== false && Number.isSafeInteger(this.total);
    const left = known ? this.total - (this._runFrom() - 1 + (this.records ?? []).length) : perPage;
    const words = {
      component: "sf-pagination"
    };
    const text = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageWord)(PAGINATION_RANGE_TEXT, "show-more-count", this, { ...words,
      vars: {
        count: Math.max(1, Math.min(perPage, left))
      }
    });
    if (button.getAttribute("text") !== text) button.setAttribute("text", text);
    const busy = this.continuing && this.pending !== null;
    button.toggleAttribute("loading", busy);
    button.toggleAttribute("disabled", busy);
    if (paging === "endless") this._watchEndless(holder);
  }

  _showMore() {
    if (this.continuing && this.pending !== null) return;
    this.changeQuery({
      page: (Number(this.query.page) || 1) + 1
    }, "show-more");

    this._queueFooter();
  } // «Бесконечно»: the next page when a scroll of the person's brings the
  // button into view (or finds it there) -- a list that fits the window
  // does not load page after page by itself, and one page at a time.


  _watchEndless(holder) {
    this._endlessWatched = holder;
    if (this._endlessScroll) return;

    this._endlessScroll = () => {
      if (this._endlessFrame) return;
      this._endlessFrame = requestAnimationFrame(() => {
        this._endlessFrame = 0;
        const watched = this._endlessWatched;
        if (!watched?.isConnected || watched.hidden || this._viewPaging() !== "endless") return;
        if (this.continuing && this.pending !== null) return;
        const box = watched.getBoundingClientRect();
        if (box.height && box.top < (globalThis.innerHeight ?? 0) && box.bottom > 0) this._showMore();
      });
    };

    globalThis.addEventListener?.("scroll", this._endlessScroll, {
      capture: true,
      passive: true
    });
  } // The menu of page sizes is made when it is first opened: a list nobody
  // opens carries no menu element.


  _pageSizeMenu() {
    const parts = this.footerStart && this._footerParts;
    if (!parts) return null;
    if (parts.menu?.isConnected) return parts.menu;
    const menu = document.createElement("sf-menu-context");
    menu.className = "sf-view-footer-size-menu";
    menu.setAttribute("popup", "");
    menu.addEventListener("sf-menu-context-select", event => {
      event.currentTarget?.close?.();

      this._setPageSize(event.detail?.id ?? event.detail?.entry?.id);
    });

    this._footerStart.append(menu);

    parts.menu = menu;

    this._drawFooter();

    return menu;
  }

  _togglePageSizeMenu(button) {
    const pagination = this.pagination;
    const menu = pagination ? this._pageSizeMenu() : null;
    if (!pagination || !menu) return;
    const sizes = Array.isArray(pagination.pageSizes) ? pagination.pageSizes : [];
    menu.entries = sizes.map(size => ({
      id: String(size),
      text: pagination.sfWord?.("page-size-text", {
        vars: {
          size
        }
      }) ?? String(size),
      kind: "radio",
      checked: size === pagination.pageSize
    })); // sf-button's host is display: contents: the menu is placed against
    // the button it draws.

    const anchor = button?.querySelector?.("button") ?? button;
    if (typeof menu.toggleFor === "function") menu.toggleFor(anchor, {
      align: "end",
      width: "content"
    });else menu.openFor?.(anchor, {
      align: "end"
    });
  } // Another page size reads the list from its first page; the person keeps
  // it (SF.Preferences, as the sort). The row shows the size at once.


  _setPageSize(value) {
    const size = Math.trunc(Number(value));
    if (!Number.isInteger(size) || size <= 0) return undefined;
    if (size === Number(this.query.per_page) && this.pagination?.pageSize === size) return undefined;
    this.pagination?.setState?.({
      pageSize: size,
      current: 1
    });

    this._keepPreference({
      pageSize: size
    });

    return this.changeQuery({
      per_page: size,
      page: 1
    }, "page-size-change");
  } // Files from the computer dropped on the view (accept-files, owner
  // 2026-10-15, the file manager) are the host's to upload: the view says
  // so with sf-data-view-files-drop {files}. They do not go through the
  // port, whose payloads are JSON.


  _bindFileDrop() {
    if (this._fileDropBound) return;
    this._fileDropBound = true;

    const zone = () => this.shadowRoot.querySelector('[part="drop"]');

    const carriesFiles = event => this.hasAttribute("accept-files") && [...(event.dataTransfer?.types ?? [])].includes("Files");

    const show = on => {
      const node = zone();
      if (!node) return;
      node.textContent = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "dropFiles", this);
      node.hidden = !on;
    };

    this.addEventListener("dragover", event => {
      if (!carriesFiles(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      show(true);
    });
    this.addEventListener("dragleave", event => {
      if (!this.contains(event.relatedTarget) && !this.shadowRoot.contains(event.relatedTarget)) show(false);
    });
    this.addEventListener("drop", event => {
      if (!carriesFiles(event)) return;
      event.preventDefault();
      show(false);
      const files = [...event.dataTransfer.files];
      if (files.length) this.dispatchEvent(new CustomEvent("sf-view-files-drop", {
        bubbles: true,
        composed: true,
        detail: {
          files
        }
      }));
    });
  } // A view placed with no table and no page row of the page's own (an
  // assembly places the bare tag) makes them as its light children, slotted,
  // where the page's stylesheets reach them: the fallbacks inside the shadow
  // root are drawn without the table's sheet. The documented markup gives
  // them, and then nothing is made.


  _ownParts() {
    // A board (layout="board"): sf-view-board in the content slot, and no
    // page row -- each lane has its own «Показать ещё» (C304).
    if (this.layoutKind === "board" || this.layoutKind === "cards" || this.layoutKind === "calendar") {
      const tag = LAYOUTS.get(this.layoutKind);

      if (!this.querySelector(':scope > [slot="content"]:not([data-sf-layout-hold])')) {
        const board = document.createElement(tag);
        board.slot = "content";
        board.toggleAttribute("data-sf-view-made", true);
        this.append(board);
      }

      globalThis.SF?.Loader?.ensure?.([tag]);
      if (this.layoutKind === "cards") this._ownPageRow();

      this._applyBulkActions();

      this._applyForAll();

      return;
    }

    if (!this.querySelector(`:scope > ${(0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.tagSelector)("sf-view-table")}[slot="content"], :scope > [slot="content"]:not([data-sf-layout-hold])`)) {
      const table = document.createElement("sf-view-table");
      table.slot = "content";
      table.setAttribute("aria-label", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "recordsLabel", this));
      table.toggleAttribute("data-sf-view-made", true);
      this.append(table);
    }

    this._ownPageRow();

    this._applyBulkActions();

    this._applyForAll();
  }

  _ownPageRow() {
    if (this.querySelector(':scope > [slot="pagination"]') || !this.renders("pagination")) return;
    const pagination = document.createElement("sf-pagination");
    pagination.slot = "pagination";
    pagination.setAttribute("appearance", "field");
    pagination.setAttribute("top", "false");
    pagination.setAttribute("bottom", "false");
    pagination.toggleAttribute("data-sf-view-made", true);
    this.append(pagination);
  }

  connectedCallback() {
    // The layout the page wrote, before any switch (view round 11): the
    // kind a stored view that names none stands for (head.js storedKind).
    if (this._pageLayout === undefined) this._pageLayout = this.getAttribute("layout");

    this._lightDefaults();

    this._readPrintedPageSize();

    super.connectedCallback(); // Alt+Down / Alt+Up from the list while a record card is open beside it
    // (C305 (4), VR2-3): the card steps to the next or the previous record
    // as it does with the focus inside it, and the list's place follows.

    if (!this._onStepKey) {
      this._onStepKey = event => {
        if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        const card = this._cardOpen ? this.recordCard : null;
        if (!card || card !== this._wiredCard || !card.panelOpen || typeof card.step !== "function") return;
        event.preventDefault();
        this._stepFromList = true;
        Promise.resolve(card.step(event.key === "ArrowDown" ? "next" : "previous")).finally(() => {
          this._stepFromList = false;
        });
      };

      this.addEventListener("keydown", this._onStepKey);
    }

    if (this.getAttribute("data-sf-instance")) this._ownParts();

    this._watchFooterWidth(); // The current layout's element only: the table is a lazy relation now
    // (view modular step 1), so a list that shows only the board, the cards
    // or the calendar never fetches it; a switch to the table asks for it
    // then (_swapContent's _askForParts).


    this._askForParts([this._layoutTag(), "sf-pagination"]); // Dated aliases (§16.20), installed once per element as the Smart base does.


    if (!this.__sfAliases) {
      this.__sfAliases = (0,_core_js_aliases_js__WEBPACK_IMPORTED_MODULE_5__.installAliases)(this, _aliases_json__WEBPACK_IMPORTED_MODULE_10__, {
        tag: this.localName,
        adapters: {}
      }); // A page's save under a former name is promoted by the alias shim:
      // sf-view-save arrives first with the detail as it was, without
      // kind, exactly like the new name sent without kind. Only the call
      // that sent the former name can tell them apart, so the view counts
      // the dispatches of the former save names on itself (reading the
      // event's type is not a use of it) and notes a kind-less save only
      // inside one of them (D1).

      const SAVE_FORMER = new Set(["sf-view-saved-view-intent", "sf-data-view-saved-view-intent"]);
      const aliased = this.dispatchEvent;
      this._saveByFormerName = 0;
      Object.defineProperty(this, "dispatchEvent", {
        configurable: true,
        writable: true,
        value: event => {
          if (!SAVE_FORMER.has(event?.type)) return aliased.call(this, event);
          this._saveByFormerName += 1;

          try {
            return aliased.call(this, event);
          } finally {
            this._saveByFormerName -= 1;
          }
        }
      });
    }

    this._bindFileDrop();

    this.epoch += 1; // The key reaches the table before its first paint.

    this._applyPreferences();

    this._controller = new AbortController();
    const events = [...Object.keys(EVENTS), ...LISTENED];

    for (const name of events) this.shadowRoot.addEventListener(name, this._bound);

    for (const name of events) this.addEventListener(name, this._bound);

    this._readDeclaredPort();

    this._seedPageSize();

    this._seedPrintedQuery();

    this._renderProjection();

    this._firstPaintReady = true;

    this._drawFirstAnswer();

    this._startFirstPaint();

    if (this.hostPort) this.refresh("connected");else this._requestHostPort();
  } // ---------- the first paint (standard 1.3.8 §5.4) ----------
  // The rows the skeleton holds: the page the query asks for (a kept page
  // size, else the page size the page printed on its page row), no more than
  // the cap of an embedded list; else the cap; else a page of the table's
  // (sf-view-table pagination-page-size, 10). A skeleton of 10 rows over a page
  // of 20 grows the list when the rows come (stand 25 D1).
  // When the page row says how many records there are (its total, as the
  // host printed it), the page the list will show holds no more than what is
  // left from its current page (view round 11, R9-1: a one-page list of 10
  // under a page of 12 drew 12 skeleton rows, and the footer moved up by
  // 300 px at 390 when the answer came).


  get firstPaintRows() {
    const asked = this._declaredPageSize();

    const cap = this.rowCap;
    const rows = asked && cap ? Math.min(asked, cap) : asked || cap || FIRST_PAINT_ROWS;

    const left = this._printedRecordsLeft(asked || FIRST_PAINT_ROWS);

    return left === null ? rows : Math.max(1, Math.min(rows, left));
  } // The records from the current page on, by the page row's printed total;
  // null when the page row says no total. A printed total of 0 is a page
  // row's placeholder before the first answer (it is how a server page
  // prints an unknown count), not a count: it does not size the skeleton.


  _printedRecordsLeft(size) {
    const row = this.querySelector?.(':scope > sf-pagination[slot="pagination"]');
    const total = Number.parseInt(row?.getAttribute?.("total") ?? "", 10);
    if (!Number.isInteger(total) || total < 1) return null;
    const current = Number.parseInt(row.getAttribute("current") ?? "", 10);
    const page = Number.isInteger(current) && current > 1 ? current : 1;
    return total - (page - 1) * size;
  } // The host's hint of a record's shape in the compact list (view round 11,
  // R9-1, DEV decision msg-2e226e69): list-shape on the view (or its table)
  // names the lines of each part of a record on a phone, the title first --
  // "1 1 2 1" is a title of one line and three fields, the third value
  // taking two lines. The skeleton draws that shape, so the list does not
  // move when the records come. Without it the skeleton keeps a title and
  // list-fields fields of one line each (109 px at 390). Up to 12 parts of
  // 1 to 8 lines; "resource" is the row of a list of resources (C31 roles:
  // the title's line and the supporting line under it, 52 px); anything
  // else is no hint.


  get listShape() {
    const table = this.querySelector?.(`:scope > ${(0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.tagSelector)("sf-view-table")}[slot="content"]`);
    const written = this.getAttribute?.("list-shape") ?? table?.getAttribute?.("list-shape") ?? "";
    if (written.trim() === "resource") return "resource";
    if (!/^\s*\d+(?:[\s,]+\d+)*\s*$/u.test(written)) return null;
    const parts = written.trim().split(/[\s,]+/u).map(Number);
    return parts.length <= 12 && parts.every(lines => Number.isInteger(lines) && lines >= 1 && lines <= 8) ? parts : null;
  } // Whether the page row draws its navigation before the host's first
  // answer: the rule of sf-pagination 1.10.0 (singlePage: no page before
  // and none after) over what the page wrote on its page row -- a current
  // page past the first, has-next, or a total over one page. A page row
  // that says nothing of its count draws no arrows, so the skeleton prints
  // none either; a list of several pages the page wrote the count of keeps
  // their line from the first paint.
  // The paging the first paint draws (D1): as the live footer will, for
  // the page row the page wrote (or the view's own), null where the page
  // gave its row an appearance of its own.


  _firstPaintPaging() {
    const row = this.querySelector?.(':scope > sf-pagination[slot="pagination"]');

    const has = name => (row?.getAttribute?.(name) ?? null) !== null;

    if (row && has("appearance") && !has("data-sf-view-appearance") && !has("data-sf-view-made") && !has("data-sf-view-default")) return null;
    return this.paging;
  }

  get firstPaintHasPages() {
    const row = this.querySelector?.(':scope > sf-pagination[slot="pagination"]');
    if (!row) return false;

    const number = name => Number.parseInt(row.getAttribute(name) ?? "", 10);

    const current = number("current");
    if (Number.isInteger(current) && current > 1) return true;
    const next = row.getAttribute("has-next");
    if (next !== null && next !== "false") return true;
    const total = number("total");
    const size = number("page-size") || this._declaredPageSize() || 20;
    return Number.isInteger(total) && total > size;
  } // The page size somebody declared: the person's kept one, a first answer's
  // echo, or the page row's page-size as the page printed it. Zero when
  // nobody did -- the query's own 20 is the view's default, not a request.


  _declaredPageSize() {
    if (this._pageSizeDeclared) return Number(this.query.per_page) || 0;
    return this._printedPageSize || 0;
  } // The page size the page printed on its page row, read once, before
  // anything of the view's writes its own page size there (the page row's
  // state, from the first projection on).


  _readPrintedPageSize() {
    if (this._printedPageSize !== undefined) return;
    const row = this.querySelector?.(':scope > sf-pagination[slot="pagination"]');
    if (!row) return;
    const printed = Number.parseInt(row.getAttribute("page-size") ?? "", 10);
    this._printedPageSize = Number.isInteger(printed) && printed > 0 ? printed : 0;
  } // The first query asks for the page the page printed (its page row's
  // page-size), unless the person kept another: the skeleton, the request
  // and the page row then agree on one number before the host answers.


  _seedPageSize() {
    if (this._pageSizeDeclared || this._answered) return;

    const size = this._declaredPageSize();

    if (!size) return;
    this.query.per_page = size;
    this._pageSizeDeclared = true;
  } // The host's first answer printed with the page (settings.first-answer,
  // a data-sf-settings island): the shape of query.change's applied data --
  // records (each with its revision), total or has_next, echo, columns. The
  // view draws it at once, as if the host had answered, so rows the server
  // already has are usable before the port; the port then answers the same
  // query in the background (refresh "connected", no loading state) and its
  // answer replaces this one. Taken once: a later answer is the port's.


  get firstAnswer() {
    return this._firstAnswer ?? null;
  }

  set firstAnswer(data) {
    this._firstAnswer = data && typeof data === "object" && !Array.isArray(data) && Array.isArray(data.records) ? copy(data) : null; // Set after the view connected (not from its island, which is read
    // before the view is ready to draw): drawn now.

    if (this._firstPaintReady && this.isConnected && this._firstAnswer && !this._answered) {
      this._drawFirstAnswer();

      if (this.hostPort) this.refresh("connected");
    }
  }

  _drawFirstAnswer() {
    const data = this._firstAnswer;
    if (!data || this._answered) return false;
    this._firstAnswer = null; // A printed answer to another query than the person's saved state is
    // not drawn: the skeleton stays and the view asks its own query.

    if (!this._printedAnswerFits(data)) return false;
    if (data.echo && Number.isInteger(data.echo.per_page) && data.echo.per_page > 0) this._pageSizeDeclared = true;
    this._revalidate = true; // Kept to compare the port's answer to the same query with.

    this._printedAnswer = copy(data); // The capabilities the page printed with its answer, when it did not
    // declare its port: known before the first draw (§18.4).

    if (!this._declaredPort && Array.isArray(data.capabilities)) {
      this._declaredPort = {
        version: data.version ?? null,
        capabilities: data.capabilities.map(String)
      };
    }

    const asked = copy(this.query);
    this.applyProjection(data); // The revalidation asks the query the page printed, not the answer's
    // echo: a host whose default (a sort) is echoed differently would
    // otherwise be asked another question (stand 27 D2). Without a printed
    // query it asks what the view would have asked.

    if (!this._seedPrintedQuery({
      answer: data
    })) this.query = asked; // A printed skeleton the server sent as well goes with the first
    // answer, in the same frame.

    this._dropFirstPaint();

    return true;
  } // The port the page declared in the element (standard §4.9, stand 27 c):
  // <script type="application/json" data-sf-port> with port, version, url,
  // capabilities and first {intent, payload}. Core may take it out and
  // connect the port itself; read here, it is what the view knows of its
  // port before the port: its capabilities, so the first draw is final
  // (the toolbar and the row actions drawn once), and its first query.


  _readDeclaredPort() {
    if (this._declaredPort !== undefined) return;
    const island = Array.from(this.children ?? []).find(child => child.localName === "script" && child.hasAttribute?.("data-sf-port") && /^application\/json$/iu.test(child.type));
    this._declaredPort = null;
    if (!island) return;

    try {
      const declared = JSON.parse(island.textContent || "{}");
      if (!declared || typeof declared !== "object") return;
      this._declaredPort = {
        version: declared.version ?? null,
        capabilities: Array.isArray(declared.capabilities) ? declared.capabilities.map(String) : [],
        first: declared.first && typeof declared.first === "object" ? copy(declared.first) : null
      };
    } catch (error) {
      console.warn("[sf-view] the data-sf-port island is not JSON", error);
    }
  } // The port as the view knows it: the connected one, else the one the page
  // declared (or printed beside its first answer).


  get knownPort() {
    return this.hostPort ?? this._declaredPort ?? null;
  }

  knownCapability(capability) {
    return Boolean(this.knownPort?.capabilities?.includes?.(capability));
  } // A known host that offers no row actions: its rows have no menu
  // (VR5-10, data-sf-row-menu-off on the table).


  _rowMenuOff() {
    return Boolean(this.knownPort) && !this.knownCapability("row-actions");
  } // The table's «≡» column has nothing to open: no row menu, no column
  // gear (personal-column-settings outside the list head), no reordering.
  // Since C406 the column always holds the gear in its head, so the view
  // never leaves it out on its own (VR5-10 stays for a table whose host
  // writes settings-menu="false" itself, and chrome without settings).


  _settingsColumnUnused() {
    return false;
  } // The query the page printed: the first answer's own (first-answer.query),
  // else the declared port's first query.change. The view asks exactly that,
  // so an early call the page started is the view's own (one request) and
  // the revalidation of a printed answer asks what was printed.


  _seedPrintedQuery({
    answer = null
  } = {}) {
    const declared = this._declaredPort?.first;
    const printed = answer?.query && typeof answer.query === "object" ? answer.query : declared?.intent === "query.change" && declared.payload?.query && typeof declared.payload.query === "object" ? declared.payload.query : null;
    if (!printed) return false; // The printed query is the defaults; what the person saved in this
    // browser goes over it. The view asks its real state: an early call
    // started with the printed query is then taken only when it matches
    // (the adapter compares), otherwise the view's own query is asked.

    this.query = { ...this.query,
      ...copy(printed),
      ...copy(this._keptState ?? {})
    };
    if (Number.isInteger(this.query.per_page) && this.query.per_page > 0) this._pageSizeDeclared = true;
    return true;
  } // Whether a printed answer answers the view's real query: not when the
  // person saved a page size or a sort in this browser that the printed
  // query (or the answer's echo) does not have. Drawn anyway, its rows
  // would show and then be replaced by the real query's (25 rows, then 50).


  _printedAnswerFits(data) {
    const kept = this._keptState ?? {};
    if (!Object.keys(kept).length) return true;
    const printed = data?.query && typeof data.query === "object" ? data.query : data?.echo ?? {};
    if (kept.per_page !== undefined && Number(printed.per_page) !== kept.per_page) return false;
    if (kept.sort !== undefined && canonical(printed.sort ?? []) !== canonical(kept.sort)) return false;
    return true;
  } // How many columns the skeleton stands for (expected-columns): the shape
  // of the first paint, never a limit -- the host's answer brings its own
  // columns. The page or server that renders a collection knows them.


  get expectedColumns() {
    const declared = Number.parseInt(this.getAttribute("expected-columns") ?? "", 10);
    return Number.isFinite(declared) && declared > 0 ? declared : 4;
  } // Until the host's first answer the view shows its skeleton: the shape the
  // list will have once the answer comes, so nothing moves when it does
  // (standard 1.3.8 §5.4, gate 24). The toolbar and the page row as the data
  // draws them; the table's head and a row per row it will draw (row-cap,
  // else a page of 10), a cell per expected column, with the chrome columns
  // (select, settings) the table will have; and the compact list the table
  // turns into below its list-below width. The table chooses that in code,
  // by measuring its container; a printed skeleton cannot measure, so the
  // choice is the sheet's: a container query at the same width (sf-view-table's
  // sheet, .sf-data-view-skeleton). It is light DOM, so a server prints it
  // as the view's static markup and the page draws it before any code; the
  // view adopts what was printed (its data-sf-static mark goes) rather than
  // drawing a second one beside it.


  _startFirstPaint() {
    if (this._answered) return;
    this.setAttribute("data-sf-awaiting", "");
    if (this.getAttribute("aria-busy") === null) this.setAttribute("aria-busy", "true");

    const printed = this._firstPaintNodes();

    if (printed.length) {
      for (const node of printed) node.removeAttribute?.("data-sf-static");

      return;
    }

    if (typeof document === "undefined") return;
    const skeleton = document.createElement("div");
    skeleton.setAttribute("slot", "first-paint");
    skeleton.setAttribute("aria-hidden", "true");
    skeleton.className = "sf-data-view-skeleton sf-skeleton sf-skeleton--animation-pulse";
    skeleton.setAttribute("data-size", this.size);
    skeleton.innerHTML = this._firstPaintMarkup(skeleton);
    this.append(skeleton);
  } // The layout the data will draw (C31): the host's on its table, else the
  // view's, else auto for a page's list; with the switch, the person's
  // choice -- a list is a list, a table is a table only where there is room
  // (auto), as the table resolves it.


  _firstPaintLayout(table) {
    if (this.layoutKind === "board") return "board";
    if (this.layoutKind === "cards") return "cards";
    if (this.layoutKind === "calendar") return "calendar";
    const written = table?.getAttribute?.("data-sf-host-layout") || table?.getAttribute?.("layout") || this.getAttribute?.("layout"); // The head's parts never decide the rows (RV4-12): without the head a
    // list is auto too, a table where there is room and rows on a phone.

    const own = ["auto", "table", "list"].includes(written) ? written : "auto";
    const value = this.getAttribute?.("layout-switch");
    const switched = value !== null && value !== undefined && value !== "false" && this.renders("toolbar");
    if (!switched) return own;
    const key = this.preferencesKey;
    const chosen = key ? preferences()?.read(key)?.layout : null;
    if (chosen === "list") return "list";
    if (chosen === "table") return "auto";
    return own === "table" ? "auto" : own;
  } // The skeleton's markup, kept small (it is printed in every page that
  // shows the view): a bar is an <i class="sf-skeleton-text">, a control
  // block one marked data-control; the lengths and the bars' widths are the
  // sheet's (sf-view-table's sheet, .sf-data-view-skeleton).


  _firstPaintMarkup(skeleton) {
    const table = this.querySelector(`:scope > ${(0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.tagSelector)("sf-view-table")}[slot="content"]`);
    const bar = '<i class="sf-skeleton-text"></i>';

    const control = (kind = "") => `<i class="sf-skeleton-text" data-control${kind ? `="${kind}"` : ""}></i>`; // What the data will draw: the table's toolbar unless the page turned
    // it off (without a table of the page's, the view's own as its chrome
    // asks), the chrome columns, and a table or the compact list.


    const toolbar = !this.listHead && (table ? table.getAttribute("toolbar") !== "false" : this.renders("toolbar"));
    const headRows = this.listHead && this.renders("toolbar"); // The head row holds «Фильтр» and the search; a part the page
    // switched off by its chrome (VR5) holds no place (head.chrome of
    // the view document comes with the answer).

    const filterHeld = this.renders("filter");
    const searchHeld = this.renders("search");
    const headRow = filterHeld || searchHeld ? (filterHeld ? control() : "<span></span>") + (searchHeld ? control() : "") : "";
    const ownToolbar = Boolean(table) && this.renders("toolbar") && Boolean(this.querySelector(':scope > [slot="toolbar"]')); // The host's word is read before the view writes its own (round 12): a
    // list drawn before its bulk actions arrive writes selectable="false",
    // which read later as the host's would keep the boxes off for good.

    const hostOffSelect = hostWroteOff(table, "selectable");
    const select = !hostOffSelect && this.selects();
    const hostOffSettings = hostWroteOff(table, "settings");
    const settings = !hostOffSettings && this.renders("settings"); // The «≡» column goes where the known host gives it nothing to open
    // (VR5-10), as the table will draw it.

    const settingsColumn = settings && !this._settingsColumnUnused();

    const layout = this._firstPaintLayout(table); // The saved-views control (the filter's bookmark segment), when the
    // page declared it before the first answer -- a data-sf-port that
    // lists saved-views, or a port already given: its place is held from
    // the first paint, a control of the step, and the search field stands
    // where it will stand (DEV decision msg-e39bb812, 2026-11-09). Not
    // declared, the control comes when a port brings it, as before.


    const views = toolbar && this.hostOffers("saved-views"); // The toolbar the table draws (sf-view 1.11.1, view161 acceptance O1,
    // O2): the filter button, then the search field and the create button
    // at the end; in the compact list the field first and the two as
    // icons after it. The labels are the table's words, so the blocks are
    // as wide as the buttons; the sheet orders and sizes them for each.
    // The compact list's settings button (sf-view-table 1.26.0, LV-6)
    // stands after the filter whenever the table offers settings; the
    // table's own toolbar has no such control (the gear is in its head).

    const creatable = this.hostOffers("create-record");

    const word = (key, attribute) => escapeText(table?.getAttribute?.(attribute) || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(TABLE_TOOLBAR_TEXT, key, table ?? this, "sf-view-table"));

    const label = (kind, text) => `<i class="sf-skeleton-text" data-control="${kind}">${text}</i>`; // The optional controls (sf-view 1.12.0, msg-8c5606e7): each is drawn
    // when what draws it is known before the answer -- the layout switch
    // from the view's layout-switch, and the table's create kinds
    // (createItems: the split arrow) and its toolbar actions (the «more»
    // button) when the page gave them to its table before the first
    // paint. A control the page gives later still comes with the answer,
    // as before. The list's sort button is not held: it comes with a
    // sortable column, and the columns are the port's answer.


    const switchValue = this.getAttribute?.("layout-switch");
    const layoutSwitch = switchValue !== null && switchValue !== undefined && switchValue !== "false" && this.renders("toolbar");

    const known = read => {
      try {
        return read();
      } catch {
        return undefined;
      }
    };

    const createSplit = creatable && (known(() => table?.createItems?.length) ?? 0) > 0;
    const toolbarActions = settings && (known(() => table?.toolbarActions?.length) ?? 0) > 0;
    const createMarkup = creatable ? createSplit ? `<span data-part="create">${label("create", word("createText", "create-text"))}${control("split")}</span>` : label("create", word("createText", "create-text")) : "";
    const toolbarMarkup = '<div class="sf-data-view-skeleton-toolbar">' + `<div data-part="start">${label("filter", word("filterText", "filter-text"))}${views ? control("segment") : ""}${settings ? control("settings") : ""}</div>` + `<div data-part="end">${control("field")}${layoutSwitch ? control("switch") : ""}${createMarkup}${toolbarActions ? control("actions") : ""}</div>` + "</div>";
    if (layoutSwitch) skeleton.setAttribute("data-layout-switch", "");else skeleton.removeAttribute?.("data-layout-switch");
    skeleton.setAttribute("data-layout", ["auto", "table", "list", "board", "cards", "calendar"].includes(layout) ? layout : "table"); // The cards' shape (CD-2): a grid of cards, no table and no page row.

    if (layout === "cards") return (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.cardsSkeleton)(this, bar); // The board's shape (BD-2): lanes of a head and cards, no table and no
    // page row, so nothing flashes a table before the lanes come.
    // The calendar's (CL-2): its bar and the month grid of six weeks.

    if (layout === "calendar") return (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.calendarSkeleton)();

    if (layout === "board") {
      const lane = `<div><div data-part="head">${bar}</div>${'<div data-part="card"><i class="sf-skeleton-text"></i><i class="sf-skeleton-text"></i></div>'.repeat(FIRST_PAINT_CARDS)}</div>`; // On a phone the lane switcher's row stands above (the sheet shows it).

      return `<div class="sf-data-view-skeleton-switch">${bar}</div><div class="sf-data-view-skeleton-board">${lane.repeat(FIRST_PAINT_LANES)}</div>`;
    }

    const columns = this.expectedColumns;
    const rows = this.firstPaintRows;
    const listFields = Number.parseInt(table?.getAttribute("list-fields") ?? "", 10);
    const fields = Math.min(columns - 1, Number.isFinite(listFields) && listFields >= 0 ? listFields : FIRST_PAINT_LIST_FIELDS); // The head is a row like the others (sf-view-table 1.17.1).

    const row = () => `<div>${select ? `<span data-chrome>${bar}</span>` : ""}${settingsColumn ? `<span data-chrome>${control()}</span>` : ""}${`<span>${bar}</span>`.repeat(columns)}</div>`; // A part of more than one line is its lines with no gap between them,
    // as a wrapped value is (list-shape).


    const shape = this.listShape;
    const parts = shape === "resource" ? `${bar}<i class="sf-skeleton-text" data-supporting></i>` : shape ? shape.map(lines => lines === 1 ? bar : `<span data-lines="${lines}">${bar.repeat(lines)}</span>`).join("") : bar.repeat(fields + 1);
    const record = `<div${shape === "resource" ? " data-resource" : ""}>${select ? bar : "<span></span>"}<div${shape ? " data-shape" : ""}>${parts}</div>${settings ? control() : "<span></span>"}</div>`; // The footer as the view draws it (C97 (5)): the range at the start,
    // the page-size button, and the page row in the field appearance --
    // the arrows to the first and the previous page, the page field with
    // «из N», the arrows to the next and the last. The view's sheet lays
    // it out as the live row is laid out, so it wraps where the row does.
    // The page row's arrows and field only where the page row the page
    // wrote draws them: since sf-pagination 1.10.0 (pair ui-b654460cad2a,
    // C97, C167 (1), Larena LF-11) a page row with no page before and none
    // after draws no navigation, and before the host's first answer the
    // count is what the page wrote (firstPaintHasPages). Printed for a
    // one-page list, the arrows' line stood 48px under the range at 390
    // and went when the answer came (gate 24, view/reference @390).
    // «Показать ещё» across the list under its last row (D1), where the
    // list goes on past this page and the paging draws the button; the
    // page numbers only where the paging keeps them.

    const paging = this._firstPaintPaging();

    const goesOn = this.firstPaintHasPages;
    const moreRow = goesOn && paging !== null && paging !== "pages" ? `<div class="sf-data-view-skeleton-more" data-size="${this.size}">${control("more")}</div>` : "";
    const pages = goesOn && paging !== "more" && paging !== "endless";
    const pageRow = moreRow + `<div class="sf-data-view-skeleton-footer" data-size="${this.size}">` + `<div class="sf-data-view-skeleton-footer-start"><span>${bar}</span>${control("size")}</div>` + (pages ? `<div class="sf-data-view-skeleton-footer-pages">${control()}${control()}${control("page")}${control()}${control()}</div>` : "") + "</div>";
    return [// An own toolbar slot is a row of the view's layout, even empty.
    ownToolbar ? '<div class="sf-data-view-skeleton-own-toolbar"></div>' : "", // The list head's two rows hold their height from the first paint.
    // A view zone the person left open (VZ-1) holds its framed row too.
    headRows ? `<div class="sf-view-head-skeleton" data-size="${this.size}"><div>${bar}</div>${headRow ? `<div>${headRow}</div>` : ""}${this.keptPreferences?.viewZone === true ? `<div data-zone>${control()}${control()}</div>` : ""}</div>` : "", '<div class="sf-data-view-skeleton-records">', toolbar ? toolbarMarkup : "", `<div class="sf-data-view-skeleton-table">${row()}${Array.from({
      length: rows
    }, () => row()).join("")}</div>`, // The list's page box over its records (sf-view-table 1.24.0, VT-2).
    `<div class="sf-data-view-skeleton-list">${select ? `<div data-list-head>${bar}${bar}</div>` : ""}${record.repeat(rows)}</div>`, "</div>", this.renders("pagination") ? pageRow : ""].join("");
  } // The host answered (a list, an empty one, a refusal or a failure): the
  // skeleton goes and the layout comes, in one frame.


  _endFirstPaint() {
    if (this.getAttribute("data-sf-awaiting") === null) return;

    this._dropFirstPaint(); // The bar for marked rows is made with the list (V10-1, _renderBulkBar).


    if (!this._bulkBar && bulkBarAvailable()) this._renderBulkBand();
  } // The skeleton goes when the layout can draw: a board's code comes by the
  // Loader after the view's, so its skeleton stays until sf-view-board is
  // defined and has drawn its lanes (BD-2: no empty frame, no jump).


  _dropFirstPaint() {
    const drop = () => {
      this.removeAttribute?.("data-sf-awaiting");

      for (const node of this._firstPaintNodes()) node.remove?.();
    };

    const registry = globalThis.customElements;
    if (this.layoutKind === "cards" && typeof registry?.whenDefined === "function") return this._dropCardsFirstPaint(drop);

    if (this.layoutKind === "calendar" && typeof registry?.whenDefined === "function") {
      // The calendar draws its days at once from its first render.
      if (registry.get("sf-view-calendar") && (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.calendarOf)(this)?.querySelector?.(".sf-view-calendar__main")) return drop();
      if (this._firstPaintWait) return;
      const wait = registry.whenDefined("sf-view-calendar").then(async () => {
        (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.syncCalendar)(this);
        await (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.calendarOf)(this)?.whenRendered?.();
      });
      this._firstPaintWait = Promise.race([wait, this._kindGivesUp("sf-view-calendar")]).catch(() => {}).then(() => {
        this._firstPaintWait = null;
        drop();
      });
      return;
    }

    if (this._layoutTag() === "sf-view-table" && typeof registry?.whenDefined === "function") return this._dropTableFirstPaint(drop);
    if (this.layoutKind !== "board" || typeof registry?.whenDefined !== "function") return drop();
    if (registry.get("sf-view-board") && this.board?.querySelector?.(".sf-view-board__lanes > *")) return drop();
    if (this._firstPaintWait) return;

    const frame = () => new Promise(done => (globalThis.requestAnimationFrame ?? globalThis.setTimeout)(() => done()));

    const wait = registry.whenDefined("sf-view-board").then(async () => {
      this._syncBoard?.();

      for (let tries = 0; tries < 120; tries += 1) {
        await this.board?.whenRendered?.();
        if (this.board?.querySelector?.(".sf-view-board__lanes > *") || !this.board?.lanes?.length) return;
        await frame();
      }
    });
    this._firstPaintWait = Promise.race([wait, this._kindGivesUp("sf-view-board")]).catch(() => {}).then(() => {
      this._firstPaintWait = null;
      drop();
    });
  } // MOD1-1 (acceptance of view modular step 1): since sf-view-table is a
  // lazy relation, the view may be defined and have its host's answer long
  // before the table's code is in (on a slow line, or a list added after
  // the page loaded, MOD1-5). The skeleton stays until sf-view-table is
  // defined and has drawn, as the board's and the cards' do; before, the
  // view dropped it at the answer and drew «Показать ещё» and the footer
  // where the rows would be, then moved them down when the table came.


  _dropTableFirstPaint(drop) {
    const registry = globalThis.customElements;
    if (registry.get("sf-view-table")) return drop();
    if (this._firstPaintWait) return undefined;
    const wait = registry.whenDefined("sf-view-table").then(async () => {
      await this.table?.whenRendered?.();
    });
    this._firstPaintWait = Promise.race([wait, this._kindGivesUp("sf-view-table")]).catch(() => {}).then(() => {
      this._firstPaintWait = null;
      drop();
    });
    return undefined;
  } // When the view stops waiting for a display kind's code that is not
  // defined yet (MOD1-1). With the Loader bringing it (a rule claims the
  // tag), only when the Loader says the module failed to load: a time bound
  // would end the wait on a slow line and the list would move when the code
  // came. The Loader's word is its public call SF.Loader.settled(tag)
  // ("defined" or "failed", never rejects; core.runtime 1.67.0, group build
  // 17 L2), the same read as sf-view-table's _waitsForView; it replaced the
  // read of the core's internal pending tags (view round 17). Without the
  // Loader, or a tag no rule claims (bundles included by hand), after 3 s as
  // before.


  _kindGivesUp(tag) {
    const loader = globalThis.SF?.Loader;
    const claimed = Boolean(loader?.getCustomElementRules?.()?.[tag]);
    if (typeof loader?.settled !== "function" || !claimed) return new Promise(done => globalThis.setTimeout(done, 3000));
    return Promise.resolve(loader.settled(tag)).then(state => state === "failed" ? state : new Promise(() => {}));
  } // The cards' skeleton stays until sf-view-cards is defined and has drawn
  // its grid (CD-2), as the board's does.


  _dropCardsFirstPaint(drop) {
    if ((0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.cardsDrawn)(this)) return drop();
    if (this._firstPaintWait) return undefined;

    const frame = () => new Promise(done => (globalThis.requestAnimationFrame ?? globalThis.setTimeout)(() => done()));

    const wait = globalThis.customElements.whenDefined("sf-view-cards").then(async () => {
      (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.syncCards)(this);

      for (let tries = 0; tries < 120 && !(0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.cardsDrawn)(this); tries += 1) {
        await this.cards?.whenRendered?.();
        if ((0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.cardsDrawn)(this)) return;
        await frame();
      }
    });
    this._firstPaintWait = Promise.race([wait, this._kindGivesUp("sf-view-cards")]).catch(() => {}).then(() => {
      this._firstPaintWait = null;
      drop();
    });
    return undefined;
  }

  _firstPaintNodes() {
    return Array.from(this.children ?? []).filter(child => child.getAttribute?.("slot") === "first-paint");
  } // A component that takes a host port can also ask for one, so a consumer who
  // composes it inside something else does not have to find the element and call
  // a method on it. Raised once per connection and only while there is no port;
  // `setHostPort` is what answers it, synchronously or later. The name is the
  // shared convention rather than one of this element's own: the next composite
  // that takes a host port raises the same event, and a host answers them all
  // the same way.


  _requestHostPort() {
    if (this.hostPort || this._portRequested) return false;
    this._portRequested = true;
    this.dispatchEvent(new CustomEvent("sf-host-port-request", {
      bubbles: true,
      composed: true,
      detail: {
        component: this,
        context: {
          owner: this.portOwner,
          record: this.portRecord,
          group: this.portGroup
        }
      }
    }));
    return true;
  } // What a host needs to know to answer: which composite is asking and about
  // what. Set by whatever embedded this element; absent on a page list, which is
  // asking about nothing but itself.


  get portOwner() {
    return this.getAttribute("port-owner") || null;
  }

  get portRecord() {
    return this.getAttribute("port-record") || null;
  }

  get portGroup() {
    return this.getAttribute("port-group") || null;
  }

  disconnectedCallback() {
    this._footerWidth?.disconnect();
    this._footerWidth = null;
    this.epoch += 1;
    this._endlessWatched = null;
    globalThis.cancelAnimationFrame?.(this._endlessFrame ?? 0);
    this._endlessFrame = 0;
    if (this._endlessScroll) globalThis.removeEventListener?.("scroll", this._endlessScroll, {
      capture: true
    });
    this._endlessScroll = null; // Once per connection, so an element moved in the DOM asks again. Without
    // this reset a list re-attached into a different host would sit portless
    // and silent, which looks exactly like a host that chose not to answer.

    this._portRequested = false;
    this._controller?.abort();
    this._controller = null;

    if (this._onHostRecordClose) {
      globalThis.document?.removeEventListener?.("sf-view-properties-close", this._onHostRecordClose);
      this._onHostRecordClose = null;
      this._hostRecordOpen = null;
    }

    const events = [...Object.keys(EVENTS), ...LISTENED];

    for (const name of events) this.shadowRoot.removeEventListener(name, this._bound);

    for (const name of events) this.removeEventListener(name, this._bound);

    this.pending = null;
  } // A host adapter exposes raise(intent, payload, {signal}). No transport is implied.
  // Which of this element's own parts render. A list and not a boolean, because
  // a boolean would have to mean «all of it or none», and an embedded list wants
  // its rows without a search box while a page list wants both. The names are
  // the ones this element already publishes as parts and slots, so nothing here
  // gives an existing thing a second name -- `sf-view-table` keeps its own `toolbar`
  // and `sf-pagination` keeps `top`/`bottom`.


  get chrome() {
    const declared = this.getAttribute("chrome");
    if (declared === null) return [...CHROME_PARTS];
    return declared.split(/\s+/u).filter(part => CHROME_PARTS.includes(part));
  } // The same list as a call (VR5): view.chrome = ["toolbar", "search"]
  // writes the attribute; null or undefined removes it (every part).


  set chrome(parts) {
    if (parts === null || parts === undefined) this.removeAttribute("chrome");else this.setAttribute("chrome", (Array.isArray(parts) ? parts : String(parts).split(/\s+/u)).map(String).join(" ").trim());
  }

  setChrome(parts) {
    this.chrome = parts;
  } // The rows of «Настроить вид» a person sees (VR5-5): head.look of the
  // view document, or view.look set by a call; null shows every row.
  // locked still disables a row it does not hide.


  get look() {
    const own = this._look ?? this.viewConfig?.head?.look;
    return Array.isArray(own) ? own.map(String) : null;
  }

  set look(rows) {
    this._look = Array.isArray(rows) ? rows.map(String) : null;

    this._renderProjection();
  }

  renders(part) {
    const row = CHROME_WITHIN[part];
    if (!row) return this.chrome.includes(part);
    if (!this.renders(row)) return false;
    const chrome = this.chrome;
    if (this.getAttribute("chrome") !== null && chrome.some(word => CHROME_WITHIN[word]) && !chrome.includes(part)) return false; // The view document's own list (head.chrome): the parts shown; a
    // part it does not name is not drawn.

    const shown = this.viewConfig?.head?.chrome;
    if (Array.isArray(shown) && !shown.map(String).includes(part)) return false;
    return true;
  } // Whether the list offers anything to do with marked rows: bulk actions
  // given to the view (bulkActions) or written on its page row (actions).


  get hasBulkActions() {
    if (this._bulkActions?.length) return true;
    let pagination = null;

    try {
      pagination = this.pagination;
    } catch {
      pagination = null;
    }

    pagination ??= this.querySelector?.(":scope > sf-pagination") ?? null;
    const actions = pagination?.actions;
    if (Array.isArray(actions) && actions.length) return true;
    return String(pagination?.getAttribute?.("actions") ?? "").trim() !== "";
  } // Whether the rows, cards and events carry boxes (view round 12, VHF-11,
  // owner remark via DEV msg-c31ccebd): a box is there to mark records for
  // a bulk action, so without one there is none -- the table drew boxes that
  // did nothing and the cards a bar «Выбрано 1 ×», the same in every layout
  // now. A host that names select in its own chrome keeps the boxes (it does
  // something with the selection itself).


  selects() {
    if (!this.renders("select")) return false;
    if (this.getAttribute("chrome") !== null) return true;
    return this.hasBulkActions;
  } // How many rows an embedded list draws at most. Zero is no cap, which is what
  // a page list is. Not `limit`, which reads like a query limit the host owns,
  // and not `page-size`, which the pagination and the table already use for the
  // host's paging -- a cap is what this element shows of a page it already has.


  get rowCap() {
    const declared = Number.parseInt(this.getAttribute("row-cap") ?? "", 10);
    return Number.isFinite(declared) && declared > 0 ? declared : 0;
  }

  get cappedRecords() {
    // A tree is drawn whole, as far as it is open: the cap is a list's.
    if (this.treeMode === "tree") return (0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.visibleRows)(this.tree);
    const cap = this.rowCap;
    return cap ? this.records.slice(0, cap) : this.records;
  }

  get capHidesRows() {
    const cap = this.rowCap;
    return Boolean(cap) && (this.records.length > cap || this.hasNext === true);
  } // The whole list is the host's to open. The component has no address to build
  // one from, and a route it guessed would send a person to a page the product
  // may not have. The query travels so the full view opens on the records the
  // person was looking at rather than on an unfiltered collection.


  openList(reason = "row-cap") {
    if (!this.hostPort) return Promise.resolve({
      answer: "unavailable",
      reason: "port-not-connected"
    });
    return this._raise("list.open", {
      reason,
      query: {
        search: this.query.search ?? "",
        filters: { ...(this.query.filters ?? {})
        }
      }
    });
  } // The presentation attributes are observed, because they are read when the
  // projection runs and nothing re-ran it. A consumer rendering this element
  // through a template sets its attributes after it is in the document, so the
  // first projection saw no `chrome` at all and drew the full page chrome -- a
  // consumer reported the fallback «Поиск / Сохранить вид» form standing inside a
  // group that had asked for no chrome, until data arrived and projected again.
  // The step of the size ladder the view's controls take, handed to the table,
  // the page row and the selection band: 1, or the admin's dense 1/2, where the
  // view stands beside the admin menu's 32px rows (owner, 2026-10-13).


  get size() {
    return this.getAttribute("size") === "1/2" ? "1/2" : "1";
  } // The size written on the controls the view makes and on its table: the
  // view's own when it has one, none when it has not, so page density moves
  // them with the page (C22). A table given size 1 by a view without one
  // stayed 40 under compact density, beside the page's 32 (Larena,
  // 2026-11-10).


  get controlSize() {
    const size = this.getAttribute("size");
    return size === "1/2" || size === "1" ? size : null;
  }

  static get observedAttributes() {
    return ["chrome", "row-cap", "aria-label", "size", "preferences-key", "head", "heading", "paging", ...LIST_ATTRIBUTES, ...LABEL_ATTRIBUTES];
  } // The words of the table and the pagination the view draws itself, written
  // on the view and passed on: a host that let the view draw its own table
  // had no way to word it, so a list inside the CMS settings spoke the
  // fallback words (Larena, 2026-10-13). A word the view is not given is left
  // to the part's own default; one that is removed is removed there too.


  _forwardLabels() {
    this._forwarded ??= new Set();

    const pass = (target, from, to = from) => {
      if (!target?.setAttribute) return;
      const value = this.getAttribute(from);
      const key = `${target.localName}:${to}`;

      if (value === null) {
        if (this._forwarded.delete(key)) target.removeAttribute(to);
        return;
      }

      target.setAttribute(to, value);

      this._forwarded.add(key);
    };

    for (const name of TABLE_LABELS) pass(this.table, name);

    for (const name of PAGINATION_LABELS) pass(this.pagination, name);

    pass(this.pagination, "pagination-aria-label", "aria-label");
  }

  attributeChangedCallback(name, previous, next) {
    if (previous === next || !this.isConnected) return;
    if (name === "preferences-key") this._applyPreferences();
    if (name === "chrome") this._lightDefaults(); // A layout written after the view drew (switchLayout, or a page):
    // the content element becomes the layout's own.

    if (name === "layout") {
      this._swapContent();

      this._holdLayoutLoad();
    }

    this._renderProjection();

    if (name === "chrome") this._syncSelectMarks();
  } // The row boxes taken away by the chrome (select off) with rows marked
  // (register VL-71, LV4-3): the marks are not shown and the bar goes with
  // them -- a bar would act on rows whose marks nobody sees. They are kept,
  // and the boxes back bring them back with their bar (VL-30).


  _syncSelectMarks() {
    const on = this.renders("select");

    if (on) {
      if (!this._marksHidden) return;
      this._marksHidden = false;

      this._applyOwnMarks();

      this.pagination?.setState?.({
        selectedCount: this._bulkIds().length
      });

      this._renderBulkBand();

      return;
    }

    if (this._marksHidden) return;
    const table = this.table;
    if (!this.markedIds.length && !(table?.getSelectedRecordIds?.() ?? []).length) return;
    this._marksHidden = true; // The table's own clear is not the person's: the marks stay kept.

    this._holdMarks = (this._holdMarks ?? 0) + 1;
    table?.clearSelection?.();
    if (this.layoutKind === "cards") this.cards?.clearSelection?.();
    this.pagination?.setState?.({
      selectedCount: 0
    });

    this._renderBulkBand();

    const release = () => {
      this._holdMarks = Math.max(0, (this._holdMarks ?? 1) - 1);
    };

    const frame = globalThis.requestAnimationFrame ?? (callback => setTimeout(callback, 16));

    frame(() => setTimeout(release, 0));
  } // A layout switched to after the first paint whose code is still on the
  // way (the Loader brings sf-view-board, -cards, -calendar when first
  // used): the head, the marks and the footer stay; only the list's place
  // shows the layout's skeleton, until the element is defined and has drawn
  // (view site acceptance VSA-5: the example went blank for 0.6-3.8 s).


  _holdLayoutLoad() {
    const registry = globalThis.customElements;

    const tag = this._layoutTag();

    this._layoutHold?.remove?.();
    this._layoutHold = null;
    this.removeAttribute?.("data-sf-layout-loading");
    if (!this._answered || this.getAttribute("data-sf-awaiting") !== null || typeof document === "undefined" || typeof registry?.get !== "function" || registry.get(tag)) return;
    const hold = document.createElement("div");
    hold.setAttribute("slot", "content");
    hold.setAttribute("aria-hidden", "true");
    hold.setAttribute("data-sf-layout-hold", "");
    hold.className = "sf-data-view-skeleton sf-skeleton sf-skeleton--animation-pulse";
    hold.setAttribute("data-size", this.size);
    hold.innerHTML = this._firstPaintMarkup(hold);
    this.append(hold);
    this._layoutHold = hold;
    this.setAttribute("data-sf-layout-loading", "");
    const token = this._layoutHoldToken = (this._layoutHoldToken ?? 0) + 1;

    const frame = () => new Promise(done => (globalThis.requestAnimationFrame ?? globalThis.setTimeout)(() => done()));

    const drawn = () => {
      const element = this.querySelector?.(`:scope > ${(0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.tagSelector)(tag)}[slot="content"]`); // A layout element may draw as display: contents (sf-view-board):
      // then its own box is empty and its children carry the height.

      const boxes = element ? [element, ...(element.children ?? []), ...(element.shadowRoot?.children ?? [])] : [];
      return boxes.some(box => box.getBoundingClientRect?.().height > 0);
    };

    const wait = registry.whenDefined(tag).then(async () => {
      for (let tries = 0; tries < 120 && !drawn(); tries += 1) await frame();
    }); // Until the kind's code is in, or the Loader says it failed (MOD1-1;
    // an 8 s bound moved the list on a slow line).

    Promise.race([wait, this._kindGivesUp(tag)]).catch(() => {}).then(() => {
      if (token !== this._layoutHoldToken) return;
      hold.remove();
      if (this._layoutHold === hold) this._layoutHold = null;
      this.removeAttribute("data-sf-layout-loading");
    });
  } // The list head (head="list"; owner decisions C297, C299, C300, C301): the
  // title row and the head row above the list, drawn by js/head.js in the
  // light DOM (slot head) where the Framework's styles reach them. Without
  // it the table draws its own toolbar, as before.


  get listHead() {
    return this.getAttribute("head") === "list";
  } // «Вид» of the list head (head="list", C405: the drill menu of the shown
  // display kind), opened from outside the head. Answers an outcome;
  // without the list head nothing opens. The table's «Все колонки…» opens
  // its own column window since C406 (the gear is always there).


  openCustomize() {
    if (!this.listHead || !this._head) return {
      outcome: "refused",
      reason: "no-list-head"
    };
    return this._head.openLook() ? {
      outcome: "applied"
    } : {
      outcome: "refused",
      reason: "look-off"
    };
  }

  _syncHead() {
    const part = this.shadowRoot?.querySelector('[part="head"]');

    if (!this.listHead) {
      if (this._head) {
        this._head.detach();

        this._head = null;
        this.removeAttribute("data-display");
      }

      if (part) part.hidden = true;
      return;
    }

    if (!this._head) {
      this._head = new _js_head_js__WEBPACK_IMPORTED_MODULE_18__.ListHead(this, {
        text: key => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, key, this),
        raise: (intent, payload) => this._raise(intent, payload)
      });
      this._ensureElements(["sf-button", "sf-button-icon", "sf-segmented", "sf-badge", "sf-input", "sf-popover", "sf-drawer", "sf-tabs", "sf-checkbox", "sf-radio", "sf-icon", "sf-menu-context", "sf-settings"])?.catch?.(() => {});
    }

    if (!this.isConnected) return;

    this._head.attach();

    if (part) part.hidden = !this.renders("toolbar");
    if (this.hostPort) this._head.describe(this.hostPort);

    this._head.render();
  }

  setHostPort(host) {
    if (!host || typeof host.raise !== "function" || !SUPPORTED_PORT_VERSIONS.includes(host.version)) {
      throw new TypeError(`sf-view requires a declared dataview host port: ${SUPPORTED_PORT_VERSIONS.join(", ")}`);
    }

    this.hostPort = host;

    this._applyForAll();

    if (this.isConnected) this.refresh("host-connected");
    return this;
  } // «Для всех (N)»: the page row offers the filter-wide action when the host
  // can act on all (bulk-under-filter), on the view's own page row and on a
  // page's that does not say otherwise (stand 24 P2: the box never showed,
  // since nothing set show-action-for-all). A page that writes the
  // attribute decides; what the view wrote it takes back when the host
  // stops offering it.


  _applyForAll() {
    const pagination = this.pagination;
    if (!pagination?.setAttribute) return;
    const mine = pagination.getAttribute("data-sf-view-for-all") !== null;
    if (!mine && pagination.getAttribute("show-action-for-all") !== null) return;

    if (this.hostOffers("bulk-under-filter")) {
      if (!mine) {
        pagination.setAttribute("show-action-for-all", "true");
        pagination.setAttribute("data-sf-view-for-all", "");
      }
    } else if (mine) {
      pagination.removeAttribute?.("show-action-for-all");
      pagination.removeAttribute?.("data-sf-view-for-all");
    }
  } // `message` is for the live region only: it is announced, never laid out.


  _setState(state, message = "") {
    this._dataState = state;
    if (state !== "loading") this._endFirstPaint();
    this.setAttribute("data-state", state);
    this.setAttribute("aria-busy", state === "loading" ? "true" : "false");
    if (this.table && state === "empty") this.table.emptyContext = this._emptyContext(); // A load the person caused -- a search or a filter they set -- that
    // fails is an alert; any other failed load is said politely.

    if (this.table && state === "error") {
      this.table.emptyContext = {
        caused: ["search", "filter"].includes(this._queryReason),
        ...(this._queryMessage ? {
          message: this._queryMessage
        } : {})
      };
    }

    this.table?.setDataState?.(state);
    if (this.layoutKind === "cards") (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.syncCardsState)(this, state); // A failed or refused list has nothing to count: the page row goes with
    // it until a list comes back (docs trial 4: «Всего: 10» over an error).

    const pageRow = this.shadowRoot.querySelector('slot[name="pagination"]');
    if (pageRow && ["error", "no-access"].includes(state)) pageRow.hidden = true; // A board's or the cards' count follows the state (view round 7).

    if (this.layoutKind === "board" || this.layoutKind === "cards") this._queueFooter();
    const status = this.shadowRoot.querySelector('[part="status"]');
    status.hidden = !message;
    status.textContent = message;
    this.dispatchEvent(new CustomEvent("sf-view-state", {
      bubbles: true,
      composed: true,
      detail: {
        state,
        message,
        instance_id: this.instanceId
      }
    }));
  } // Why the list is empty, from what the view already knows (owner,
  // 2026-10-14): the host refused the query -- no access; a search or a
  // filter is on -- nothing found, and what a reset would clear; otherwise
  // no data. The table draws it.


  _emptyContext() {
    if (this._queryRefused) return this._queryMessage ? {
      kind: "no-access",
      message: this._queryMessage
    } : {
      kind: "no-access"
    };
    const search = String(this.query.search ?? "").trim() !== "";
    const filters = hasValue(this.query.filters);
    if (search || filters) return {
      kind: "nothing-found",
      reset: search && filters ? "both" : search ? "search" : "filters"
    };
    return {
      kind: "no-data"
    };
  } // Whether the host offers a capability: announced, or -- for the two that
  // were baseline before port 1.10.0 -- implied by an earlier version.


  hostOffers(capability) {
    // The connected port, else the one the page declared (knownPort).
    const port = this.hostPort ?? this._declaredPort ?? null;
    if (!port) return false;
    if (port.capabilities?.includes?.(capability)) return true;
    return BASELINE_UNTIL_1_10.has(capability) && !portAtLeast(port.version, "1.10.0");
  }

  async _raise(intent, payload, {
    query = false
  } = {}) {
    if (!this.hostPort) {
      if (query) this._queryMessage = "";

      this._setState("error", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "statePortNotConnected", this));

      this.notify((0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "noticePortNotConnected", this));
      return {
        answer: "unavailable",
        reason: "port-not-connected"
      };
    }

    const capability = {
      "view.open": "saved-views",
      "view.save": "saved-views",
      "view.delete": "saved-views",
      "view.save_shared": "shared-saved-views",
      "settings.save_shared": "shared-column-settings",
      "bulk.apply_under_filter": "bulk-under-filter",
      "record.open": "row-actions",
      "record.mutate": "row-actions",
      "tree.expand": "tree",
      "node.targets": "tree-move",
      "node.move": "tree-move",
      "view.create_record": "create-record",
      "settings.save_personal": "personal-column-settings",
      "record.reorder": "row-reorder",
      "record.set": "inline-edit"
    }[intent];

    if (capability && !this.hostOffers(capability)) {
      const answer = {
        answer: "unavailable",
        reason: "capability-not-provided"
      };

      this._showAnswer(intent, answer);

      return answer;
    } // The tree's intents are announced as the one event the port names
    // for them, so a page can watch them without standing in the way.


    if (TREE_INTENTS.has(intent)) {
      // sf-data-view-tree; the old sf-table-tree-intent follows once (aliases.json).
      this.sfEmit("tree", {
        intent,
        payload: copy(payload)
      });
    }

    const epoch = this.epoch;
    const sequence = query ? payload.sequence : null;

    try {
      const answer = await this.hostPort.raise(intent, copy(payload), {
        signal: this._controller?.signal
      });
      if (!this.isConnected || epoch !== this.epoch || query && sequence !== this.sequence) return null;

      if (!answer || !["applied", "conflict", "refused", "unavailable"].includes(answer.answer)) {
        throw new TypeError("Host answer is not a declared port answer");
      }

      if (query && answer.sequence != null && answer.sequence !== sequence) return null;
      if (query) this.pending = null; // Refused for access: «no access», without the toolbar. Refused for
      // the query: the query stays on screen to be corrected (isAccessRefusal).

      if (query) this._queryRefused = answer.answer === "refused" && isAccessRefusal(answer.reason); // The host's own sentence for a list it cannot give or will not
      // give (Larena, 2026-10-21: «Список готовится…» while a large
      // storage's read model is built). It is shown as the state's own
      // words, as text: it is the host's, and never markup.

      if (query) this._queryMessage = ["refused", "unavailable"].includes(answer.answer) ? hostMessage(answer) : ""; // A write the host confirms first (port 1.8.0): it answered with what
      // it is about to do and a digest of it. The person reads it; if they
      // confirm, the same intent goes again with the digest, which the
      // host checks against the write it described.

      if (!query && answer.answer === "refused" && answer.reason === "confirm_required" && answer.data?.confirm?.digest && !payload?.confirm) {
        await this._ensureElements(["sf-button"]);
        const confirmed = await this._dialog({
          title: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "confirmTitle", this),
          text: String(answer.data.confirm.summary ?? ""),
          apply: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "confirmApply", this)
        });
        if (!confirmed) return {
          answer: "refused",
          reason: "not-confirmed"
        };
        return this._raise(intent, { ...payload,
          confirm: String(answer.data.confirm.digest)
        });
      }

      if (answer.answer === "applied") {
        // Where a node may go is an answer to a question, not a view of
        // the list: it is read by the move dialog and changes no rows.
        if (ANSWER_ONLY.has(intent)) {// nothing to project
        } else if (!query && this._isRecordPatch(answer.data)) this._applyRecordPatch(answer.data.records);else if (answer.data) this.applyProjection(answer.data);

        if (query && !answer.data) throw new TypeError("Applied query has no data");
        if (intent === "view.open") this.refresh("view-switch"); // A write that changed no record cannot have changed the rows.
        // Column settings — order, width, visibility, pinning — used to
        // fall into this branch and re-query the whole page, so moving a
        // column reloaded the view and flashed a loader at the person.

        if (!query && !answer.data && !NO_REFRESH_AFTER.has(intent)) this.refresh("after-write"); // What the write changed for the rest of the page goes out on
        // the page host's outputs (simai.interface-fragment, effects);
        // the page's routes take it to whoever listens.

        if (Array.isArray(answer.effects) && answer.effects.length) globalThis.SF?.Composition?.publishEffects?.(answer.effects, {
          origin: this
        });
      } else if (query && answer.answer === "refused" && !this._queryRefused) {
        // A query the host would not answer as asked -- a search
        // longer than it takes, a filter it does not allow. The rows of
        // the last answer do not answer this query, so they go; the
        // toolbar, the search the person typed and the filters stay,
        // and the state says what went wrong: the host's sentence as
        // text, or the view's own words. No notice over it: the state
        // and the live region already say it.
        this.records = [];
        this.appended = null;
        this.total = 0;
        this.countKnown = false;

        this._renderProjection(); // The brick's title as well as the live region: the table's own
        // «could not load» would say the wrong thing about a query.


        if (!this._queryMessage) this._queryMessage = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "stateQueryFailed", this);

        this._setState("error", this._queryMessage);

        this._showAnswer(intent, answer, {
          stated: true
        });

        return answer;
      } else if (query && answer.answer === "refused") {
        // A refused list shows nothing it had: the rows of the last
        // allowed answer stayed under «no access» (docs trial 4).
        this.records = [];
        this.appended = null;
        this.total = 0;
        this.countKnown = false;

        this._renderProjection();
      } else if (query && answer.answer === "unavailable") {
        // A host that says why the list is not there is believed, and
        // its sentence is the state: the error brick and the live
        // region say it, and no error notice says something else over
        // it. Without one, the general words and the notice as before.
        this._setState("error", this._queryMessage || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "stateUnavailable", this));

        if (!this._queryMessage) this.notify((0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "noticeFetchFailed", this), {
          code: answer.reason || ""
        });
      }

      this._showAnswer(intent, answer);

      return answer;
    } catch (error) {
      if (!this.isConnected || epoch !== this.epoch) return null;
      const answer = {
        answer: "unavailable",
        reason: error?.message || "port-error"
      };

      if (query) {
        this._queryMessage = "";

        this._setState("error", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "stateLoadFailed", this));

        this.notify((0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "noticeLoadFailed", this), {
          code: answer.reason || ""
        });
      }

      this._showAnswer(intent, answer);

      return answer;
    }
  }

  _showAnswer(intent, answer, {
    stated = false
  } = {}) {
    // A refused batch raised from the group actions bar is said in the
    // bar's result line, next to the rows it names: a notice in the
    // corner said it a second time and, on a phone, covered the bar's
    // «Подробнее» and «Повторить» (L-2).
    const inBar = intent === "bulk.apply_selected" && this._bulkBarRaising === true && answer.reason !== "not-confirmed" && typeof this._bulkBar?.result === "function";

    if (!inBar && (!stated && ["conflict", "refused"].includes(answer.answer) || answer.answer === "unavailable" && intent !== "query.change")) {
      const text = this._noticeText(answer);

      this._setState(this.records.length ? "populated" : "empty", text);

      this.notify(text, {
        kind: answer.answer === "conflict" ? "warning" : "error",
        code: answer.reason || ""
      });
    }

    this.dispatchEvent(new CustomEvent("sf-view-answer", {
      bubbles: true,
      composed: true,
      detail: {
        intent,
        ...copy(answer),
        instance_id: this.instanceId
      }
    }));
  } // The key the person's view of this list is kept under: the host names
  // it (preferences-key, e.g. the collection). The table takes the same.


  get preferencesKey() {
    const key = this.getAttribute("preferences-key") || "";
    return key ? viewPreferenceKey(key) : "";
  } // Before the first query: the person's sort and page size, so the rows
  // come in their order the first time rather than after a click.
  // A list page scrolls as a page (owner, 2026-10-15): the view's table is in
  // page mode unless the host chose its mode itself.


  _tableScrollMode(table) {
    if (typeof table?.hasAttribute !== "function" || typeof table.setAttribute !== "function") return;

    if (!table.hasAttribute("data-sf-host-vertical-scroll")) {
      table.setAttribute("data-sf-host-vertical-scroll", table.getAttribute("vertical-scroll") ?? "");
    }

    if (!table.getAttribute("data-sf-host-vertical-scroll")) table.setAttribute("vertical-scroll", "page");
  }

  _applyPreferences() {
    this._tableScrollMode(this.table);

    const key = this.preferencesKey;
    if (key === this._preferencesApplied) return;
    this._preferencesApplied = key;
    const table = this.table;
    if (table && key && !table.getAttribute("preferences-key")) table.setAttribute("preferences-key", this.getAttribute("preferences-key"));
    const kept = key ? preferences()?.read(key) : null; // What the person saved in this browser: it wins over anything the
    // page printed (a declared port's first query, a printed answer's
    // query), which the page wrote without knowing it (standard §4.9:
    // the page must not guess).

    this._keptState = { ...(Array.isArray(kept?.sort) && kept.sort.length ? {
        sort: copy(kept.sort)
      } : {}),
      ...(Number.isInteger(kept?.pageSize) && kept.pageSize > 0 ? {
        per_page: kept.pageSize
      } : {})
    };
    if (!kept) return;
    if (Array.isArray(kept.sort) && !this.query.sort?.length) this.query.sort = copy(kept.sort);

    if (Number.isInteger(kept.pageSize) && kept.pageSize > 0) {
      this.query.per_page = kept.pageSize;
      this._pageSizeDeclared = true;
    }
  } // What this person keeps for the list: the sort, the page size and
  // whether the list head's view zone is open (VZ-1). In this browser
  // (SF.Preferences under preferences-key; empty without a key), and where
  // the host keeps the person's own layer (simai.dataview-port 1.16.0,
  // personal-preferences: a signed-in person) its page size and zone state
  // win once its answer has come. The browser copy stays as the first
  // paint's guess before that answer.


  get keptPreferences() {
    const key = this.preferencesKey;
    const kept = key ? preferences()?.read(key) ?? {} : {};
    const layer = this.personalLayer;
    if (!layer) return kept;
    return { ...kept,
      ...(Number.isInteger(layer.page_size) && layer.page_size > 0 ? {
        pageSize: layer.page_size
      } : {}),
      ...(layer.view_zone === "open" || layer.view_zone === "closed" ? {
        viewZone: layer.view_zone === "open"
      } : {})
    };
  } // Whether the host keeps this person's own layer: port 1.16.0 or later
  // with personal-preferences (a signed-in person). Any earlier port, or a
  // guest's page, keeps the state in the browser as before.


  _personalOffered() {
    const port = this.hostPort ?? this._declaredPort ?? null;
    return Boolean(port) && portAtLeast(port.version, "1.16.0") && this.hostOffers("personal-preferences");
  } // The host's layer of this person's view state, where it offers one.


  get personalLayer() {
    return this._personalLayer && this._personalOffered() ? this._personalLayer : null;
  }

  _keepPreference(patch) {
    const key = this.preferencesKey;
    if (key) preferences()?.write(key, { ...(preferences()?.read(key) ?? {}),
      v: 1,
      ...patch
    }); // The page size and the zone go to the person's layer too, where the
    // host keeps one; the sort stays the browser's (the layer has no sort).

    const fields = { ...(Number.isInteger(patch.pageSize) ? {
        page_size: patch.pageSize
      } : {}),
      ...(typeof patch.viewZone === "boolean" ? {
        view_zone: patch.viewZone ? "open" : "closed"
      } : {})
    };
    if (Object.keys(fields).length) this._savePersonal(fields);
  } // preferences.save (port 1.16.0): only the fields that changed, against
  // the layer's revision. A conflict names the current revision and the
  // same change goes again against it: the layer is the person's own (two
  // tabs of theirs), so the newest change wins. Quiet: a failed write of a
  // preference says nothing to the person, the browser copy stays.


  async _savePersonal(fields) {
    if (!this.hostPort || !this._personalOffered() || !this._personalLayer) return;
    const base = this._personalLayer.revision;
    if (base === undefined || base === null) return;
    this._personalLayer = { ...this._personalLayer,
      ...fields
    };

    const send = async (revision, again) => {
      let answer = null;

      try {
        answer = await this.hostPort.raise("preferences.save", {
          preferences: copy(fields),
          base_revision: revision
        });
      } catch {
        return;
      }

      if (answer?.answer === "applied" && answer.data?.preferences && typeof answer.data.preferences === "object") {
        this._personalLayer = copy(answer.data.preferences);
      } else if (answer?.answer === "conflict" && answer.current_revision != null && again) {
        await send(answer.current_revision, false);
      }
    };

    await send(base, true);
  } // The person's layer in an answer (port 1.16.0: required in the first
  // answer of a host with personal-preferences). The zone follows it; a
  // page size other than the one the first query asked with asks once more
  // with it; the view the person opened last (layer.view, a saved view's
  // key) opens by itself, with that page size. The browser copy is brought
  // in line for the next first paint.


  _acceptPersonal(layer) {
    if (!layer || typeof layer !== "object" || !this._personalOffered()) return;
    const first = !this._personalLayer;
    this._personalLayer = copy(layer);

    const opened = first && this._openKeptView(layer);

    const key = this.preferencesKey;
    const kept = this.keptPreferences;

    if (key) {
      const stored = preferences()?.read(key) ?? {};
      preferences()?.write(key, { ...stored,
        v: 1,
        ...(Number.isInteger(kept.pageSize) ? {
          pageSize: kept.pageSize
        } : {}),
        ...(typeof kept.viewZone === "boolean" ? {
          viewZone: kept.viewZone
        } : {})
      });
    }

    this._head?.keptChanged?.();
    const size = layer.page_size;

    if (first && !opened && Number.isInteger(size) && size > 0 && size !== Number(this.query.per_page)) {
      this._pageSizeDeclared = true;
      Promise.resolve().then(() => {
        if (this.isConnected && size !== Number(this.query.per_page)) this.changeQuery({
          per_page: size,
          page: 1
        }, "page-size-change");
      });
    }
  }

  refresh(reason = "refresh") {
    if (!this.isConnected) return Promise.resolve(null);

    this._applyPreferences();

    const sequence = ++this.sequence;
    this.pending = sequence;
    this._queryReason = reason; // Show more continues the list; every other reason replaces it. The
    // answer carries no reason of its own, so it is remembered here.

    this.continuing = reason === "show-more"; // The page the rows on screen start from: «1–40 из 48» after two
    // pages, «41–48» after a jump to page 3 (D1).

    if (!this.continuing) this._runStart = Number(this.query.page) || 1; // The port's first answer over a first answer the page printed is a
    // revalidation: the rows stay as they are, usable, until it comes.

    const revalidating = this._revalidate === true && ["connected", "host-connected"].includes(reason);
    this._revalidate = false;
    this._revalidating = revalidating; // Continuing the list is answered inside the button that asked for it.
    // The table is not loading — the rows on screen stay exactly as they
    // are — so it neither dims them nor replaces them with a loader.

    if (this.continuing) {
      this.pagination?.setState?.({
        showMoreBusy: true
      });
    } else if (!revalidating) {
      this._setState("loading", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "stateLoading", this));
    }

    return this._raise("query.change", {
      sequence,
      query: this._layoutQuery(),
      reason
    }, {
      query: true
    });
  }

  _syncSearchBoxes(value) {
    const text = String(value ?? "");
    const table = this.table;

    if (table?.updateSearchState && (table.state?.search?.value ?? "") !== text && !table.contains(document.activeElement)) {
      table.updateSearchState({
        value: text
      }, false);
    }
  }

  changeQuery(patch, reason = "query-change") {
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) throw new TypeError("Query patch must be an object");
    this.query = { ...this.query,
      ...copy(patch)
    };
    this._anchorFirst = null;
    if (!["page-change", "page-size-change", "show-more"].includes(reason)) this.query.page = 1;
    if (reason === "page-size-change" && this.layoutKind === "cards" && Number.isSafeInteger(Number(patch.per_page))) this._cardsPageSize = Number(patch.per_page);
    return this.refresh(reason);
  }

  applyProjection(data) {
    if (!data || typeof data !== "object") throw new TypeError("Port data must be an object"); // The port's answer to the query a printed first answer already
    // answered (stand 25, Larena's storage page: the printed list was drawn
    // and then drawn again, CLS 0.13 -> 0.32). The same answer -- the same
    // revision, or the same rows, count and columns -- changes nothing on
    // the page; a different one is taken in place: the rows keyed by id,
    // only the changed ones redrawn, in one render, no skeleton between.

    let inPlace = false;

    if (this._revalidating) {
      this._revalidating = false;
      const printed = this._printedAnswer;
      this._printedAnswer = null;

      if (printed && sameAnswer(printed, data)) {
        // Only what the port itself brings is drawn: its capabilities
        // (row actions, settings), when they differ from the ones the
        // printed answer was drawn without.
        if (this._capabilitiesKey !== capabilitiesKey(this.knownPort)) this._renderProjection();
        return;
      }

      inPlace = Boolean(printed);
    }

    if (Array.isArray(data.row_actions)) this.rowActionCatalog = copy(data.row_actions); // One node's children: they go under it, and nothing else about the
    // view changes -- not the query, not the count, not the columns.

    const tree = data.tree && typeof data.tree === "object" ? data.tree : null;

    if (tree?.mode === "tree" && tree.parent !== null && tree.parent !== undefined && Array.isArray(data.records)) {
      const parent = String(tree.parent);
      (0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.acceptLevel)(this.tree, {
        parent,
        records: copy(data.records),
        hasNext: tree.has_next === true,
        cursor: tree.cursor ?? null,
        append: this._treeAppend.delete(parent)
      });
      this.records = (0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.knownRecords)(this.tree);

      this._renderProjection();

      return;
    } // An answer without records is no new shape of the list (a settings
    // write, a saved view): the mode stays what the last list said.


    if (tree) this.treeMode = tree.mode ?? null;else if (Array.isArray(data.records)) this.treeMode = null;

    if (this.treeMode === "tree" && Array.isArray(data.records)) {
      const reopen = [...this.tree.expanded];
      (0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.acceptLevel)(this.tree, {
        records: copy(data.records),
        hasNext: tree.has_next === true,
        cursor: tree.cursor ?? null,
        append: this.continuing && this.records.length > 0
      });
      this.records = (0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.knownRecords)(this.tree);
      this.appended = null; // Branches a person had open stay open: their children are asked
      // for again, since a re-read may have changed them.

      for (const id of reopen) {
        if (this.tree.nodes.get(id)?.has_children === true && !(0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.hasLevel)(this.tree, id)) this.expandNode(id);
      }
    } else if (Array.isArray(data.records)) {
      const next = copy(data.records); // A continuation keeps what is already shown and adds to it, and
      // keeps it by identity: a record the port repeats is not duplicated.

      if (this.continuing && this.records.length) {
        const known = new Set(this.records.map(record => record.id));
        this.appended = next.filter(record => !known.has(record.id));
        this.records = [...this.records, ...this.appended];
      } else {
        this.appended = null;
        this.records = next; // A new result set: the table draws it as new rows where a
        // kept one would move (sf-view-table setRows "result"). A
        // revalidation of the printed answer is the same result.

        this._newResult = !inPlace;
      }
    } // The same columns are not given again: the table would take them as
    // new and measure its widths again.


    if (Array.isArray(data.columns) && !(inPlace && canonical(data.columns) === this._columnsKey)) {
      this.columns = data.columns.map(projectColumn);
      this._columnsKey = canonical(data.columns);
    }

    if (Number.isSafeInteger(data.total) && data.total >= 0) {
      this.total = data.total;
      this.countKnown = true;
    } else if (typeof data.has_next === "boolean") {
      this.hasNext = data.has_next; // A number already answered for this very query stays on screen.
      // Paging and Show more do not take it away — only a query that
      // changes what is being counted does.

      this.countKnown = this.countedQuery !== null && this.countedQuery === this._countKey();
    }

    if (Number.isSafeInteger(data.total)) this.totalExact = data.total_exact !== false;

    this._acceptBoard(data);

    (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.acceptCards)(this, data);
    (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.acceptCalendar)(this, data);
    this._answered = true;
    if (Array.isArray(data.saved_views)) this.savedViews = copy(data.saved_views);
    if (data.preferences && typeof data.preferences === "object") this._acceptPersonal(data.preferences);
    if (Array.isArray(data.saved_filters)) this.savedFilters = copy(data.saved_filters);
    if (data.view_config && typeof data.view_config === "object") this.viewConfig = copy(data.view_config);
    if (Array.isArray(data.locked)) this.lockedSettings = copy(data.locked);
    if (data.column_settings) this.columnSettings = copy(data.column_settings);

    if (data.echo) {
      const echo = data.echo; // filters_chosen is two things: the conditions as chosen (port
      // 1.x, an object) or, for the list head, the keys of the chosen
      // filter fields (study section 7, a list) beside filters.

      const chosenKeys = Array.isArray(echo.filters_chosen) ? echo.filters_chosen : null;
      this.query = { ...this.query,
        filters: copy((chosenKeys ? echo.filters : echo.filters_chosen ?? echo.filters) ?? {}),
        search: echo.search ?? "",
        sort: copy(echo.sort ?? []),
        page: echo.page ?? 1,
        per_page: echo.per_page ?? VIEW_DEFAULT_PAGE_SIZE,
        ...(chosenKeys ? {
          filters_chosen: copy(chosenKeys)
        } : {}),
        ...(echo.saved_filter !== undefined ? {
          saved_filter: echo.saved_filter
        } : {}),
        ...(echo.view && typeof echo.view === "object" ? {
          view: copy(echo.view)
        } : {})
      };
    } // The search box says what the list is searched for, whoever set it: a
    // changeQuery({search}) from page code filtered the rows and left the
    // box empty (docs trial 5). Written silently -- it is not a new search.


    this._syncSearchBoxes(this.query.search ?? "");

    this._renderProjection();

    this._restoreOpenedView(); // The empty result is shown by the table, in its own body. The view only
    // announces it, so a search that finds nothing moves nothing.


    this._setState(this.records.length ? "populated" : "empty", this.records.length ? "" : (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "emptyText", this));

    this.notify("");
  } // What a count belongs to. Search, filters and page size change what the
  // number would be; a page does not.


  _countKey() {
    return JSON.stringify([this.query.search ?? "", this.query.filters ?? {}, this.query.per_page ?? VIEW_DEFAULT_PAGE_SIZE]);
  } // What the band shows and what it does. The words and the action list stay
  // the host's, set on the pagination as they always were; the band only reads
  // them, so a host configures one element and sees the band in the card.


  _renderBulkBand() {
    const pagination = this.pagination;
    const table = this.table; // The board and the calendar draw their own bar; the list's bar
    // stands for the table and the cards (one bar, owner 2026-11-22).

    const kind = this._layoutTag();

    const selected = kind === "sf-view-table" || kind === "sf-view-cards" ? this._bulkIds() : [];
    const actions = pagination?.actions ?? [];
    if (bulkBarAvailable()) return this._renderBulkBar({
      pagination,
      selected,
      actions
    });

    if (!pagination || !selected.length || !actions.length) {
      if (this._bulkBand?.isConnected) this._bulkBand.remove();
      this._bulkBand = null;
      return this;
    }

    const band = this.bulkBand;
    band.setAttribute("aria-label", pagination.actionsRegionLabel ?? "");
    const action = pagination.action ?? "";
    const total = pagination.countKnown === false ? null : pagination.total;
    const forAllLabel = total == null ? pagination.actionForAllLabel : `${pagination.actionForAllLabel} (${this._shownTotal(total)})`;

    const chosen = (node, name, value) => {
      if (value == null || value === false) node.removeAttribute(name);else node.setAttribute(name, value === true ? "" : String(value));
    };

    const parts = {};

    if (!band.childElementCount) {
      band.innerHTML = `
                <span class="sf-pagination-actions-count" data-sf-bulk="count"></span>
                <span class="sf-pagination-actions-separator" aria-hidden="true"></span>
                <sf-dropdown data-sf-bulk="actions" appearance="bordered" search="false" mode="select"></sf-dropdown>
                <sf-button data-sf-bulk="apply" data-sf-bulk-danger="false" appearance="outline" scheme="on-surface"></sf-button>
                <span class="sf-pagination-actions-separator" aria-hidden="true" data-sf-bulk="for-all-separator"></span>
                <sf-checkbox data-sf-bulk="for-all"></sf-checkbox>
                <sf-button-icon data-sf-bulk="clear" class="sf-pagination-actions-clear" appearance="ghost" scheme="on-surface" icon="close"></sf-button-icon>`; // One listener on the band: Apply is drawn anew when its look
      // changes, and a press must reach the view once.

      band.addEventListener("click", event => {
        const apply = event.target instanceof Element ? event.target.closest('[data-sf-bulk="apply"]') : null;
        if (apply && !apply.disabled && !apply.hasAttribute("disabled")) this.applyBulkAction();
      });
      band.querySelector('[data-sf-bulk="actions"]').addEventListener("change", event => pagination.setAction?.(event.detail?.value ?? ""));
      band.querySelector('[data-sf-bulk="for-all"]').addEventListener("change", event => pagination.setActionForAll?.(Boolean(event.target?.checked)));
      band.querySelector('[data-sf-bulk="clear"]').addEventListener("click", () => this.clearSelection());
    }

    for (const node of band.querySelectorAll("[data-sf-bulk]")) {
      parts[node.dataset.sfBulk] = node;
      if (node.localName.startsWith("sf-")) chosen(node, "size", this.controlSize);
    }

    parts.count.textContent = `${pagination.selectedLabel} ${selected.length}`;
    chosen(parts.actions, "value", action);
    chosen(parts.actions, "placeholder", pagination.actionChooseLabel);
    chosen(parts.actions, "aria-label", pagination.actionsLabel);
    parts.actions.options = [{
      type: "text",
      size: this.controlSize ?? undefined,
      text: pagination.actionChooseLabel,
      value: "",
      selected: !action
    }, ...(0,_pagination_js_actions_js__WEBPACK_IMPORTED_MODULE_6__.orderActions)(actions).map(item => ({
      type: "text",
      size: this.controlSize ?? undefined,
      text: item.text,
      value: item.value,
      selected: item.value === action,
      disabled: Boolean(item.disabled)
    }))]; // C116: Apply is a regular button in a band of controls (outline
    // on-surface), never the filled main one; over an action that
    // deletes it is the outlined danger (status danger: error is the
    // control's former word, kept by sf-button until 2027-01-01), and
    // that action is listed last.
    // A Smart button draws its look once, as class markup over a native
    // button: a look that changes is a new button in the same place.

    const danger = (0,_pagination_js_actions_js__WEBPACK_IMPORTED_MODULE_6__.isDestructiveAction)(actions.find(item => item.value === action));

    if (parts.apply.dataset.sfBulkDanger === "true" !== danger) {
      const apply = document.createElement("sf-button");
      apply.dataset.sfBulk = "apply";
      apply.dataset.sfBulkDanger = String(danger);
      apply.setAttribute("appearance", "outline");
      apply.setAttribute("scheme", "on-surface");
      if (danger) apply.setAttribute("status", "danger");
      chosen(apply, "size", this.controlSize);
      parts.apply.replaceWith(apply);
      parts.apply = band.querySelector('[data-sf-bulk="apply"]') ?? apply;
    }

    chosen(parts.apply, "text", pagination.actionApplyText);
    chosen(parts.apply, "disabled", !action);
    chosen(parts["for-all"], "label", forAllLabel);
    chosen(parts["for-all"], "checked", Boolean(pagination.actionForAll));
    parts["for-all"].hidden = !pagination.showActionForAll; // Its separator goes with it, or the band ends on a rule before the
    // close button.

    parts["for-all-separator"].hidden = !pagination.showActionForAll;
    chosen(parts.clear, "title", pagination.clearSelectionLabel);
    chosen(parts.clear, "aria-label", pagination.clearSelectionLabel);
    return this;
  } // Row selection through the group actions bar (Larena L-2, C295): while
  // rows are marked, sf-bulk-actions stands in the band's place (slot bulk,
  // the last strip of the card, sticking to the bottom of the window) with
  // «Выбрано N», the actions as buttons (up to three, the rest and a deleting
  // one in «⋯»), «Выбрать все N» where the host acts under the filter, and
  // the cross. The words and the actions stay the host's, set on the page
  // row as before (actions, selected-label, actions-region-label) or given
  // as bulkActions; the page row keeps the for-all state. The bar's events
  // go the band's ways: an action on the marked rows is bulk.apply_selected,
  // on all under the filter bulk.apply_under_filter; the cross and Escape
  // drop the selection. The host's answer is the bar's result line: done,
  // or «Готово 0 из 3 · 3 не удалось» with «Подробнее» and «Повторить для 3»
  // while the refused rows stay marked.


  _bulkBarActions(pagination, actions) {
    const own = new Map((this._bulkActions ?? []).map(item => [String(item.id ?? item.value), item]));
    const list = actions.length ? Array.isArray(pagination?.bulkActions) ? pagination.bulkActions : actions.map(item => ({
      id: item.value,
      text: item.text,
      disabled: Boolean(item.disabled),
      status: (0,_pagination_js_actions_js__WEBPACK_IMPORTED_MODULE_6__.isDestructiveAction)(item) ? "danger" : "",
      confirm: false
    })) : [...own.values()].map(item => ({
      id: String(item.id ?? item.value),
      text: String(item.label ?? item.text ?? item.id ?? item.value),
      status: (0,_pagination_js_actions_js__WEBPACK_IMPORTED_MODULE_6__.isDestructiveAction)(item) ? "danger" : "",
      confirm: false
    })); // The page row's markup has no icons: a host's bulkActions may.

    return list.map(item => own.get(String(item.id))?.icon ? { ...item,
      icon: own.get(String(item.id)).icon
    } : item);
  }

  _renderBulkBar({
    pagination,
    selected,
    actions
  }) {
    const list = this._bulkBarActions(pagination, actions);

    let bar = this._bulkBar?.isConnected ? this._bulkBar : null; // The band of before goes, whichever drew it.

    if (this._bulkBand?.isConnected && this._bulkBand !== bar) this._bulkBand.remove();
    this._bulkBand = null; // The bar is made as soon as the view has actions for it, not at the
    // first marked row (view round 10, V10-1): its words are a language
    // part the page fetches when the bar first looks one up, and a bar made
    // at the first mark said its first count in the built-in English («1
    // selected») before the Russian part came. With no row marked it draws
    // nothing and says nothing.

    if (!list.length) {
      bar?.remove();
      this._bulkBar = null;
      return this;
    }

    const chosen = (name, value) => {
      if (value == null || value === false || value === "") bar.removeAttribute(name);else bar.setAttribute(name, value === true ? "" : String(value));
    };

    if (!bar) {
      bar = document.createElement("sf-bulk-actions");
      bar.setAttribute("slot", "bulk");
      bar.setAttribute("place", "dock");
      bar.dataset.sfBulk = "bar";
      bar.addEventListener("sf-bulk-actions-action", event => this._onBulkBarAction(event));
      bar.addEventListener("sf-bulk-actions-select-all", () => this._setBulkForAll(true));
      bar.addEventListener("sf-bulk-actions-select-page", () => this._setBulkForAll(false));
      bar.addEventListener("sf-bulk-actions-clear", () => this.clearSelection());
      this.append(bar);
      if (!globalThis.customElements?.get?.("sf-bulk-actions")) this._ensureElements(["sf-bulk-actions"]);
    }

    this._bulkBar = bar;
    const forAll = Boolean(pagination?.showActionForAll) && pagination?.countKnown !== false && Number(pagination?.total) > 0; // The bar at the list head controls' size (view round 15, DEV): the
    // head draws its buttons at the list's size, else 1/2 (js/head.js
    // ListHead.size), and the bar is the same size, so where the head's
    // buttons are 32 the bar is the 32 row. A fixed 1 drew a 50 px bar
    // with 40 px buttons under a 32 px head. The bar's own layout is
    // SIMAI Framework's.

    chosen("size", this.controlSize || "1/2");
    chosen("label", pagination?.actionsRegionLabel);
    chosen("count-text", selected.length ? pagination?.bulkCountText : "");
    chosen("page-count", pagination?.bulkPageCount ?? this.records.length);
    chosen("total", forAll ? pagination.total : null);
    chosen("all-selected", forAll && Boolean(pagination?.actionForAll));
    chosen("count", String(selected.length));
    bar.actions = list;
    return this;
  }

  _setBulkForAll(on) {
    this.pagination?.setActionForAll?.(on); // «Выбрать все N» on the list's bar marks every card too (LV2-7).

    if (this._layoutTag() === "sf-view-cards") this.cards?.selectAll?.(Boolean(on));

    this._renderBulkBand();
  }

  async _onBulkBarAction(event) {
    const id = event.detail?.id;
    if (id === undefined || id === null || id === "") return undefined;
    const scope = event.detail?.scope === "all" ? "all" : "selection";

    const ids = this._bulkIds();

    let answer;
    if (scope === "all") answer = await this.applyUnderFilter(String(id), this.total);else {
      this._bulkBarRaising = true;

      try {
        answer = await this._action({
          action_id: String(id),
          record_ids: ids
        }, {
          selectedBulk: true
        });
      } finally {
        this._bulkBarRaising = false;
      }
    }

    this._bulkResult(answer, {
      ids,
      scope
    });

    return answer;
  } // The host's answer, said in the bar. A batch is applied or refused as a
  // whole (simai.dataview-port): applied is «Готово N из N» in the live
  // region and the bar goes back; refused or a conflict names every marked
  // row with the reason (the stale ones the conflict lists say so), keeps
  // them marked and offers to try again. A question not confirmed, an
  // estimate counted first or an action under the filter the host refused
  // says nothing here: the notice of the view says it.


  _bulkResult(answer, {
    ids,
    scope
  }) {
    const bar = this._bulkBar;
    if (!answer || !bar?.isConnected || typeof bar.result !== "function") return;

    if (answer.answer === "applied") {
      // The marks go with the applied batch, before the result is said
      // (view round 10, V10-1): they went with the list the host sent
      // after it, and the bar's «Выбор снят» for that came after «Готово
      // 2 из 2» and replaced it in the live region. Cleared first, the
      // result is the bar's last word.
      const ok = scope === "all" ? this.total : ids.length;
      this.clearSelection();
      bar.result({
        ok,
        failed: []
      });
      return;
    }

    if (scope === "all" || !ids.length || ["not-confirmed", "total-counted"].includes(answer.reason)) return;
    if (!["refused", "conflict", "unavailable"].includes(answer.answer)) return;

    const reason = this._noticeText(answer);

    const stale = new Set((answer.conflicts ?? answer.data?.conflicts ?? []).map(entry => String(entry?.id)));
    const staleText = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "noticeStaleRevision", this);
    bar.result({
      ok: 0,
      failed: ids.map(key => ({
        id: String(key),
        text: this._recordText(key),
        reason: stale.has(String(key)) ? staleText : reason
      }))
    });
  } // A record's name for a line that lists it: its title column's value, or its id.


  _recordText(id) {
    const record = this.records.find(item => String(item?.id) === String(id));
    const title = (this.columns ?? []).find(column => column?.role === "title");
    const value = title ? record?.[title.key] : undefined;
    return value === undefined || value === null || typeof value === "object" ? String(id) : String(value);
  } // Apply is the band's only write, and it goes the same way it went from the
  // page row: under the filter when For-all is ticked, over the marked rows
  // otherwise.


  applyBulkAction() {
    const pagination = this.pagination;
    const action = pagination?.action;
    if (!action) return undefined;
    if (pagination.actionForAll) return this.applyUnderFilter(action, this.total);
    return this._action({
      action_id: action,
      record_ids: this._bulkIds()
    }, {
      selectedBulk: true
    });
  }

  clearSelection() {
    this.table?.clearSelection?.();
    this._marks = null;
    this._ownHeld = null;

    if (this.layoutKind === "cards") {
      const cards = this.cards;
      cards?.removeAttribute?.("all-selected");
      cards?.clearSelection?.();
    }

    this.pagination?.setState?.({
      selectedCount: 0
    });
    return this._renderBulkBand();
  } // The marks kept across pages (C295; list study v2 LV2-2), each kind its
  // own (C413): the records a person marked on one page stay marked on the
  // others of that kind and when the list comes back to it, while the
  // search and the filters stay
  // the same; a new search or filter, a bulk action done, or «Снять
  // выделение» clears them. Kept as the host's own ids, by their text.


  _markKey() {
    return JSON.stringify([this.query?.search ?? "", this.query?.filters ?? {}]);
  }

  _noteMarks(shown, marked) {
    const key = this._markKey();

    if (!this._marks || this._marks.key !== key) this._marks = {
      key,
      ids: new Map()
    };
    const on = new Map((Array.isArray(marked) ? marked : []).map(id => [String(id), id]));

    for (const id of Array.isArray(shown) ? shown : []) {
      const text = String(id);
      if (on.has(text)) this._marks.ids.set(text, on.get(text));else this._marks.ids.delete(text);
    }

    for (const [text, id] of on) this._marks.ids.set(text, id);
  }

  get markedIds() {
    if (!this._marks || this._marks.key !== this._markKey()) return [];
    return [...this._marks.ids.values()];
  } // The records a bulk action is for: every marked one, else the table's
  // own marks (a page that drives the table itself).


  _bulkIds() {
    // The boxes taken away by the chrome: nothing marked to act on (VL-71).
    if (!this.renders("select")) return [];
    const kept = this.markedIds;
    return kept.length ? kept : this.table?.getSelectedRecordIds?.() ?? [];
  } // One record, changed in place. A write that touches a row does not need
  // the page re-queried and the body rebuilt: the host answers with the
  // record it changed, or the page calls this itself, and only that row is
  // written. A full projection is still a full projection.


  updateRecord(id, patch = {}) {
    const key = String(id);

    if (this.treeMode === "tree") {
      const known = this.tree.nodes.get(key);
      if (!known || !patch || typeof patch !== "object") return false;
      this.tree.nodes.set(key, { ...known,
        ...copy(patch),
        id: known.id
      });
      this.records = (0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.knownRecords)(this.tree);
      this.table?.setRows?.((0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.visibleRows)(this.tree));

      this._renderBulkBand();

      return true;
    }

    const index = this.records.findIndex(record => String(record?.id) === key);
    if (index < 0 || !patch || typeof patch !== "object") return false;
    const next = { ...this.records[index],
      ...copy(patch),
      id: this.records[index].id
    };
    this.records = [...this.records.slice(0, index), next, ...this.records.slice(index + 1)];
    this.table?.updateRowByKey?.("id", this.records[index].id, { ...next
    }, "record-update");

    this._renderBulkBand();

    return true;
  } // ─── the tree (port 1.8.0) ───────────────────────────────────────────────
  // Opening a node shows the children the view already has, or asks the host
  // for them; closing it is the view's own business. A node is opened only
  // when the host said it has children.


  expandNode(id) {
    const key = String(id);
    const node = this.tree.nodes.get(key);
    if (!node || node.has_children !== true) return null;

    if ((0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.hasLevel)(this.tree, key)) {
      (0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.expandKnown)(this.tree, key);

      this._renderTreeRows();

      return null;
    }

    (0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.markLoading)(this.tree, key);

    this._renderTreeRows();

    return this._raise("tree.expand", {
      id: node.id,
      cursor: null,
      sequence: ++this.treeSequence
    });
  }

  collapseNode(id) {
    (0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.collapse)(this.tree, id);

    this._renderTreeRows();
  } // The next page of one level: of the roots through the query, as a list
  // pages, and of a node's children through tree.expand with its cursor.


  loadMoreNodes(parent, cursor) {
    if (parent === null || parent === undefined || parent === "") {
      return this.changeQuery({
        page: this.query.page + 1
      }, "show-more");
    }

    const key = String(parent);

    this._treeAppend.add(key);

    const node = this.tree.nodes.get(key);
    return this._raise("tree.expand", {
      id: node?.id ?? parent,
      cursor: cursor ?? null,
      sequence: ++this.treeSequence
    });
  } // Where a node may go is the host's: it is asked first, and only the places
  // it names are offered -- the top level when it allows that, and the first
  // or last place among the new siblings when it allows reordering.


  async openMoveDialog(record) {
    const answer = await this._raise("node.targets", {
      id: record.id
    });
    if (answer?.answer !== "applied") return answer;
    const targets = answer.data?.move_targets ?? {};
    const parents = Array.isArray(targets.parents) ? targets.parents : [];
    const options = [...(targets.root ? [{
      id: null,
      label: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "moveRoot", this),
      path: []
    }] : []), ...parents.filter(parent => String(parent.id) !== String(record.id))];

    if (!options.length) {
      this.notify((0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "moveNoTargets", this), {
        kind: "warning"
      });
      return {
        answer: "refused",
        reason: "no-targets"
      };
    }

    const label = String(record.title ?? record.label ?? record.name ?? record.id); // The choices are sf-input-choice, which nothing else on the page may have
    // asked for: a Loader that scans the light DOM never meets the
    // dialog's (Larena: an empty choice list, 2026-10-12). _dialog asks
    // for it with the window, and waits briefly.

    const chosen = await this._dialog({
      title: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "moveTitle", this).replace("{label}", label),
      apply: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "moveApply", this),
      options,
      reorder: targets.reorder === true
    });
    if (!chosen) return null;
    return this._raise("node.move", {
      id: record.id,
      parent: chosen.parent,
      index: chosen.index,
      ...(record.revision !== undefined ? {
        revision: record.revision
      } : {})
    });
  } // The elements the view composes, asked for by tag: the Loader defines each
  // from its own bundle (the rule's relations usually have already), and the
  // view projects again once they are, so an answer that came before them is
  // not lost on an element that could not take it yet.


  _askForParts(tags) {
    const registry = globalThis.customElements;
    if (typeof registry?.get !== "function" || typeof registry.whenDefined !== "function") return;
    const missing = tags.filter(tag => !registry.get(tag));
    if (!missing.length) return;
    const key = missing.join(",");
    this._partsAsked ??= new Set();
    if (this._partsAsked.has(key)) return;

    this._partsAsked.add(key);

    globalThis.SF?.Loader?.ensure?.(missing, {
      timeout: Infinity
    }).then(() => {
      this._partsAsked.delete(key);

      if (this.isConnected && missing.some(tag => tag !== "sf-toast")) this._renderProjection();
    });
  }

  async _ensureElements(tags) {
    return globalThis.SF?.Loader?.ensure?.(tags);
  } // One small window for both the move and the confirmation: the
  // Framework's sf-modal, a modal layer of the one document stack (core
  // layer-stack.js) with the shared scrim, Escape, a press on the scrim and
  // the focus kept inside and given back. It was a native <dialog> shown with
  // showModal(), outside the stack and over the browser's own backdrop, so a
  // drawer or a modal opened from it, or under it, did not know it was there
  // (reuse audit 2026-11-02, findings 1 and 2). The window stands in this
  // element (slot dialog) and draws in its portal at the end of the body, in
  // this element's language and theme. Resolves with what was chosen, true
  // for a plain confirmation, or null.


  async _dialog({
    title,
    text = "",
    apply,
    options = null,
    reorder = false
  }) {
    await this._ensureElements(["sf-modal", "sf-button", ...(options ? ["sf-input-choice"] : [])]);

    if (!globalThis.customElements?.get("sf-modal")) {
      this.notify((0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "noticeUnavailable", this));
      return null;
    }

    const modal = document.createElement("sf-modal");
    modal.slot = "dialog";
    modal.className = "sf-data-view-dialog";
    modal.setAttribute("heading", title);
    modal.setAttribute("aria-label", title);
    modal.setAttribute("width", "min(var(--sf-measure-52, calc(52 * var(--sf-text--size-1) / 2)), calc(100vw - 2 * var(--sf-space-3)))"); // The places can be many; the list scrolls and the title and the
    // buttons stay where they are.

    const content = document.createElement("div");
    content.slot = "content";
    content.className = "flex flex-col gap-3";

    if (text) {
      const body = document.createElement("p");
      body.className = "sf-text-1 m-0";
      body.textContent = text;
      content.append(body);
    }

    const name = `${this.instanceId}-move`; // The choices are SIMAI Framework sf-input-choice in its list look
    // (C165 (1), VF-5): the group, its name, the arrows and the form value
    // are the Framework's, not a radiogroup the view assembled from radios.

    let parentChoice = null;
    let placeChoice = null;

    if (options) {
      parentChoice = document.createElement("sf-input-choice");
      parentChoice.setAttribute("appearance", "list");
      parentChoice.setAttribute("name", name);
      parentChoice.setAttribute("aria-label", title);
      parentChoice.style.cssText = "overflow-y: auto; min-block-size: 0; flex: 1 1 auto;";
      parentChoice.items = options.map(option => ({
        value: option.id === null ? "" : String(option.id),
        label: String(option.label),
        ...(Array.isArray(option.path) && option.path.length ? {
          caption: option.path.join(" / ")
        } : {})
      }));
      parentChoice.value = options[0].id === null ? "" : String(options[0].id);
      content.append(parentChoice);

      if (reorder) {
        placeChoice = document.createElement("sf-input-choice");
        placeChoice.setAttribute("appearance", "list");
        placeChoice.setAttribute("name", `${name}-place`);
        placeChoice.setAttribute("label", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "movePlace", this));
        placeChoice.items = [["last", "moveLast"], ["first", "moveFirst"]].map(([value, key]) => ({
          value,
          label: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, key, this)
        }));
        placeChoice.value = "last";
        content.append(placeChoice);
      }
    } // The footer of every window (C159 (4), C144): the main action first at
    // the start, the quiet «Отмена» last, --sf-space-1/3 apart (8, compact
    // 4). It was an outline «Отмена» first and the main button last at the
    // end, 20 apart (modal study MD-2).


    const footer = document.createElement("div");
    footer.slot = "footer";
    footer.className = "sf-data-view-dialog-actions flex items-cross-center gap-1/3 flex-wrap";
    const confirm = document.createElement("sf-button");
    confirm.setAttribute("text", apply);
    confirm.dataset.apply = "";
    const cancel = document.createElement("sf-button");
    cancel.setAttribute("appearance", "ghost");
    cancel.setAttribute("scheme", "on-surface");
    cancel.setAttribute("text", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "cancel", this));
    footer.append(confirm, cancel);
    modal.append(content, footer);
    this.append(modal); // The nodes are the page's own, drawn in the window's portal: they are
    // read where they are.

    const chosenValue = (choice, fallback) => {
      const value = Array.isArray(choice?.value) ? choice.value[0] : choice?.value;
      return value === undefined || value === null ? fallback : String(value);
    };

    let chosen = null;
    cancel.addEventListener("click", () => modal.close({
      reason: "cancelled"
    }));
    confirm.addEventListener("click", () => {
      if (!options) {
        chosen = true;
      } else {
        const value = chosenValue(parentChoice, "");
        const option = options.find(item => (item.id === null ? "" : String(item.id)) === value) ?? options[0];
        const place = reorder ? chosenValue(placeChoice, "last") : "last";
        chosen = {
          parent: option.id,
          index: place === "first" ? 0 : null
        };
      }

      modal.confirm();
    }); // Asked with a signal, open() answers when the window closes (§19.4):
    // accepted through confirm(), else closed by Escape, the scrim, the
    // close button or «Отмена».

    const scope = new AbortController();
    const answer = await modal.open({}, {
      signal: scope.signal
    });
    modal.remove();
    return answer?.outcome === "applied" && answer.value?.accepted === true ? chosen : null;
  }

  _renderTreeRows() {
    this.records = (0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.knownRecords)(this.tree);
    this.table?.setRows?.((0,_js_tree_js__WEBPACK_IMPORTED_MODULE_17__.visibleRows)(this.tree));
  } // An answer that carries records and nothing else is a patch of those
  // records, not a new page: it has no echo of the query, no total and no
  // columns, so there is nothing to lay out again.


  _isRecordPatch(data) {
    return Boolean(data) && Array.isArray(data.records) && !data.echo && data.total == null && !data.columns && !data.saved_views && !data.column_settings && !data.tree;
  } // A checkable cell (record.set, capability inline-edit): the host answers
  // with the record as it now is, asks to confirm first (a change that
  // rewrites records), or refuses; the row is then drawn from what it said.


  async setCell({
    id,
    key,
    value,
    revision
  } = {}) {
    if (id == null || !key) return null;
    const record = this.records.find(entry => String(entry.id) === String(id));
    const answer = await this._raise("record.set", {
      record_id: id,
      key,
      value,
      revision: revision ?? record?._revision ?? record?.revision ?? null
    });
    this.table?.clearCellPending?.(String(id), key); // Anything but applied leaves the record as it was, and the box shows
    // the value the host still holds.

    if (answer?.answer !== "applied") {
      const held = this.records.find(entry => String(entry.id) === String(id));
      this.table?.resetCellControl?.(String(id), key, held?.[key]);
    }

    return answer;
  } // Rows dragged into another order (record.reorder, capability
  // row-reorder). Shown in the new order at once; a refusal or a conflict
  // puts the old order back.


  async reorderRows({
    ids = [],
    before = null,
    order = null
  } = {}) {
    if (!ids.length) return null;
    const previous = this.records;

    if (Array.isArray(order)) {
      const byId = new Map(this.records.map(record => [String(record.id), record]));
      const placed = order.map(key => byId.get(String(key))).filter(Boolean);

      if (placed.length === this.records.length) {
        this.records = placed;

        this._renderProjection();
      }
    }

    const first = previous.find(record => ids.map(String).includes(String(record.id)));
    const answer = await this._raise("record.reorder", {
      record_ids: [...ids],
      before,
      revision: first?._revision ?? first?.revision ?? null
    });

    if (answer?.answer !== "applied") {
      this.records = previous;

      this._renderProjection();
    }

    return answer;
  }

  _applyRecordPatch(records = []) {
    let applied = 0;

    for (const record of records) {
      if (record && record.id != null && this.updateRecord(record.id, record)) applied += 1;
    } // A record the page does not hold cannot be patched into it; that is a
    // new row, and only a query knows where it belongs.


    if (applied !== records.length) this.refresh("record-unknown");else this.notify("");
    return applied;
  } // The catalogue of row actions the table names in its own constructor --
  // the eye for «view», the pencil for «edit». It is captured once and kept,
  // because the projection writes its own narrowed list onto the very same
  // property: reading that list back would make the narrowed list the
  // catalogue, which is what the single read guarded against.
  //
  // The capture used to be one `??=` read of the table's own property with an
  // empty list behind it, which is where the defect was.
  // A list the view draws itself stands in the shadow template, so it is in
  // the tree before sf-view-table is defined, and an element that has not upgraded
  // carries no ACTIONS_SETTINGS_ROW at all: `[]` was cached, and `??=` never
  // looked again, because `[]` is not nullish. From then on every id was
  // unknown -- the warning below fired and «view» came out as a generic word
  // instead of the eye, on every list (Larena storage QA, 2026-10-22). So the
  // capture looks again while it holds nothing, and the list this view wrote
  // is remembered so it is never taken for the table's own.


  _captureRowActions(table) {
    if (this._knownRowActions?.length) return this._knownRowActions;
    const own = table?.ACTIONS_SETTINGS_ROW;

    const named = Array.isArray(own) && own.length > 0 && own !== this._projectedRowActions;

    this._knownRowActions = named ? own : [];
    if (!named) this._awaitRowActions();
    return this._knownRowActions;
  } // Waited for once, and the projection drawn again when the definition
  // lands: on a page whose list has settled nothing else would make the view
  // draw, and the catalogue can only be read from an upgraded element. The
  // Loader is told which tag is wanted, as it is for the move dialog's own
  // elements.


  _awaitRowActions() {
    if (this._awaitingRowActions) return;
    this._awaitingRowActions = true;
    globalThis.SF?.Loader?.ensure?.(["sf-view-table"]); // Read off globalThis and asked for softly: a stand that renders this
    // view over a document of its own need not keep a registry, and a view
    // that cannot wait simply keeps the fallback words.

    const defined = globalThis.customElements?.whenDefined?.("sf-view-table");
    defined?.then?.(() => {
      if (this.isConnected) this._renderProjection();
    });
  }

  _renderProjection() {
    this._capabilitiesKey = capabilitiesKey(this.knownPort);

    this._syncHead();

    this._readPrintedPageSize();

    this._applyForAll();

    if (this._current !== undefined && this.table && this.table.current !== this._current) this.table.current = this._current;

    this._paginationAppearance();

    this._watchPagination();

    this._queueFooter();

    this.pagination?.setState?.({
      showMoreBusy: false
    }); // The page row no longer carries the band: the card does, so the strip
    // can hold the bottom of the window without the row coming along. The
    // attribute is written rather than put through setState, which clears a
    // false value by removing the attribute — and a removed `bottom` means
    // the default, which is to draw the band.

    this.pagination?.setAttribute?.("bottom", "false");
    if (this.controlSize) this.pagination?.setAttribute?.("size", this.controlSize);else this.pagination?.removeAttribute?.("size");

    this._forwardLabels();

    this._syncBoard();

    if (this.layoutKind === "cards") (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.syncCards)(this);
    (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.syncCalendar)(this); // The kind's own marks (C413), on the cards or the calendar as they draw.

    if (this.layoutKind === "cards" || this.layoutKind === "calendar") this._applyOwnMarks();
    const table = this.table;

    if (table) {
      // The two chrome columns. Written as attributes rather than left to the
      // table's own defaults, which are both on: an embedded list rendered a
      // checkbox column with «select all rows» and a gear column, and both
      // read as leftovers from a page table -- there is no bulk band and no
      // toolbar in an embedded list for either of them to lead to.
      // A refused list offers nothing to do with it: no selection, no
      // «Создать», no search or filter over rows the person may not see
      // (docs trial 5: they stayed active under «no access»). The
      // author's own toolbar setting comes back with the access.
      const refused = this._queryRefused === true;
      if (!table.hasAttribute?.("data-sf-host-toolbar")) table.setAttribute("data-sf-host-toolbar", table.getAttribute?.("toolbar") ?? "");
      const authorToolbar = table.getAttribute?.("data-sf-host-toolbar"); // The list head draws the search, the filter and Create (C296, C301):
      // the table draws no toolbar of its own under it.

      if (refused || this.listHead) table.setAttribute("toolbar", "false");else if (authorToolbar) table.setAttribute("toolbar", authorToolbar);else table.removeAttribute?.("toolbar"); // The row boxes and the gear column are the view's chrome, unless the
      // host wrote them off on its table: what the table carried before the
      // view first touched it is the host's word, as for row-actions below.
      // A table written selectable="false" came back selectable="true" and
      // drew a box in every row of a list that has no bulk actions (Larena,
      // the sites list, 2026-11-05).

      const hostOffSelect = hostWroteOff(table, "selectable");
      table.setAttribute("selectable", !hostOffSelect && this.selects() && !refused ? "true" : "false"); // A page's list becomes the compact list on a narrow container; an
      // embedded one (no toolbar) stays a table, and a layout the host
      // wrote on its table is the host's.

      if (!table.hasAttribute?.("data-sf-host-layout")) {
        table.setAttribute("data-sf-host-layout", table.getAttribute?.("layout") ?? "");
      } // The view's own layout is passed on (owner decision C31): auto
      // unless the view says list or table.


      if (!table.getAttribute?.("data-sf-host-layout")) {
        const own = this.getAttribute("layout"); // RV4-12: auto whether or not the head is drawn; with the head
        // off a phone drew a desktop table squeezed into 390 px.

        table.setAttribute("layout", ["auto", "table", "list"].includes(own) ? own : "auto");
      } // The list of resources (C31): the switch (where there is a
      // toolbar to hold it), the threshold, the quick actions and what a
      // press on a row opens go to the table as the view has them.


      this._forwardListSettings(table, refused);

      if (this.controlSize) table.setAttribute("size", this.controlSize);else table.removeAttribute?.("size");

      this._tableScrollMode(table);

      const hostOffSettings = hostWroteOff(table, "settings");
      table.setAttribute("settings", !hostOffSettings && this.renders("settings") ? "true" : "false"); // The gear in the table's header row is always there (owner
      // decision C406): a bare table switches its columns on and off,
      // and under the list head it duplicates «Колонки» -- the columns
      // alone (data-sf-columns-only), the look being the head's «Вид».
      // Where the host keeps no personal column settings a change holds
      // for the page (the table's session), as before on a bare table.

      table.setAttribute("settings-menu", "true");
      table.toggleAttribute?.("data-sf-columns-only", this.listHead); // «Все колонки…» of the column head menu opens the same column
      // window at the gear (C406); it opened «Настроить вид» before.

      table.removeAttribute?.("data-sf-view-columns");
      table.setAttribute("creatable", this.hostOffers("create-record") && !refused ? "true" : "false");
      table.setAttribute("row-reorder", this.hostOffers("row-reorder") && this.treeMode !== "tree" ? "true" : "false");
      table.setAttribute("inline-edit", this.hostOffers("inline-edit") ? "true" : "false"); // A filter template is a saved view the table keeps by itself; in a
      // view it went nowhere, so it is offered where the host keeps views.

      table.setAttribute("filter-templates", this.hostOffers("saved-views") ? "true" : "false"); // Row actions are the host's to claim. The intent was already
      // refused without the capability -- answered «unavailable» without
      // the host being called -- but the column and its buttons were drawn
      // all the same, so a person could press an action nothing would ever
      // apply. A view does not show a control the host has not claimed,
      // which is the same rule the saved-view controls already follow
      // (admin polygon, 2026-10-10).
      // A table the host wrote row-actions="false" on keeps it: the host has
      // put every action in its own row menu and still claims the
      // capability, because its menu raises record.open and record.mutate
      // through the port (Larena, 2026-10-12). What the table carried
      // before the view first touched it is the host's word.

      if (!table.hasAttribute?.("data-sf-host-row-actions")) {
        table.setAttribute("data-sf-host-row-actions", table.getAttribute?.("row-actions") ?? "");
      }

      const hostSaysNo = table.getAttribute?.("data-sf-host-row-actions") === "false";
      table.setAttribute("row-actions", !hostSaysNo && this.knownCapability("row-actions") ? "true" : "false"); // A host without row actions has no row menu at all (VR5-10): the
      // table is told so apart from row-actions="false", which also
      // means «every action in the row menu» -- without it the «≡»
      // column stood empty, 57 px, at the start of every row.
      // Only once the host is known: before it, the column holds its
      // place as the first paint drew it.

      if (this._rowMenuOff()) table.setAttribute("data-sf-row-menu-off", "");else table.removeAttribute?.("data-sf-row-menu-off"); // The accessible name of a list the host did not slot in. The fallback
      // table carries a name of its own, which is right for a page list and
      // wrong inside a group called «Счета»: it would announce «Записи».
      // Only the fallback is renamed -- a table a host slotted in keeps the
      // name the host gave it.

      const slot = this.shadowRoot.querySelector('slot[name="content"]');
      const own = this.getAttribute("aria-label");
      if (own && slot && !slot.assignedElements().length) table.setAttribute("aria-label", own);
      const allowed = new Set(this.records.flatMap(record => Array.isArray(record.actions) ? record.actions : [])); // The catalogue is read once and kept, from an element that has
      // upgraded: narrowing the table's own list in place is destructive,
      // and so is capturing from an element that has nothing to read yet.
      // Both left the catalogue empty, and from then on every id the host
      // named was unknown -- «view» came out as a link labelled "view"
      // instead of the eye, and in a narrow column the label broke
      // mid-word and set the row height. _captureRowActions above.

      const known = this._captureRowActions(table); // The host's own actions are named by its catalogue (row_actions,
      // port 1.8.0); an action the catalogue groups is offered once, as
      // the group, with a submenu of the members a record allows. Which
      // members a row shows is still that record's actions alone.


      const catalog = new Map(this.rowActionCatalog.map(entry => [entry.id, entry])); // In a tree, move and create are the view's own actions and named
      // by it, unless the host's catalogue names them.

      const treeActions = this.treeMode === "tree" ? {
        move: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "moveAction", this),
        ...(this.hostOffers("create-record") ? {
          create: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "createChildAction", this)
        } : {})
      } : {};

      const single = id => {
        const entry = catalog.get(id) ?? (treeActions[id] ? {
          id,
          label: treeActions[id]
        } : null);

        if (entry) {
          return {
            id,
            name: entry.label,
            danger: entry.danger === true,
            inline: false,
            component: {
              type: "button",
              props: {
                text: entry.label,
                appearance: "ghost",
                ...(entry.icon ? {
                  icon: entry.icon
                } : {})
              }
            }
          };
        } // An id the host's catalogue does not name gets a word, not its
        // raw id clipped in the column, and the host is told (docs trial 4).


        const found = known.find(action => action.id === id);
        if (found) return found; // Before sf-view-table is defined its catalogue cannot be read
        // (_captureRowActions): the projection is drawn again once it
        // is, and only then is an id it does not name the host's to fix.
        // The table is a lazy relation since view modular step 1, so it
        // is often defined after the first answer.

        if (globalThis.customElements?.get?.("sf-view-table")) {
          console.warn(`[sf-view] row action «${id}» has no row_actions entry; name it in the host's catalogue.`);
        }

        const label = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "unnamedAction", this);
        return {
          id,
          name: label,
          inline: false,
          component: {
            type: "button",
            props: {
              text: label,
              appearance: "ghost",
              title: id
            }
          }
        };
      };

      const groups = new Map();
      const listed = [];

      for (const id of allowed) {
        const group = catalog.get(id)?.group;

        if (!group) {
          listed.push(single(id));
          continue;
        }

        if (!groups.has(group)) {
          const label = catalog.get(id).group_label ?? group;
          const entry = {
            id: `group:${group}`,
            name: label,
            members: [],
            inline: false,
            component: {
              type: "button",
              props: {
                text: label,
                appearance: "ghost"
              }
            }
          };
          groups.set(group, entry);
          listed.push(entry);
        }

        groups.get(group).members.push(single(id));
      }

      table.ACTIONS_SETTINGS_ROW = listed; // Remembered by identity, so the capture never reads this narrowed
      // list back as the table's own catalogue.

      this._projectedRowActions = listed; // A list whose every action lives in the row menu has no actions
      // column to draw.

      if (listed.length && listed.every(action => action.inline === false)) {
        table.setAttribute("row-actions", "false");
      } // The port the list is holding, handed to the table for one thing:
      // the renderer set asks a host how to format a value, and a cell had
      // no host to ask. Only the formatting is read from it -- the table
      // raises its intents as it always has and the view re-raises them.


      table.cellHost = this.hostPort ?? null;
      table.setColumns?.(this._listColumns(this.columns));

      if (Array.isArray(this.appended)) {
        // Appending leaves the rows already on screen untouched, so a
        // row that was checked stays checked: the checkbox state lives
        // on the row itself.
        table.addRows?.(this.appended);
      } else {
        // The count under the filter (VR2-8): the grid's aria-rowcount is
        // total + 1 and each row's aria-rowindex its place in the list.
        // A tree counts its own levels; it is left out.
        const known = this._answered && this.treeMode !== "tree" && this.countKnown !== false && this.totalExact !== false && Number.isSafeInteger(this.total) && this.total > 0;

        if (known) {
          table.setAttribute("total", String(this.total)); // Page 2 and on starts further down the list; «Показать ещё»
          // keeps every page from the first, so it starts at 0.

          const page = Number(this.query.page),
                per = Number(this.query.per_page);
          const offset = Number.isInteger(page) && page > 1 && Number.isInteger(per) && per > 0 && this.records.length <= per ? (page - 1) * per : 0;
          table.setAttribute("row-offset", String(offset));
        } else if (table.hasAttribute?.("data-sf-view-total")) {
          table.removeAttribute("total");
          table.removeAttribute("row-offset");
        }

        table.toggleAttribute?.("data-sf-view-total", known); // The same rows set again (a part switched, the host port or
        // a setting changed) keep their marks (LV4-21): the table
        // clears its marks as it takes rows, and that clear was taken
        // for the person's; it is not heard until the marks are back.
        // VL-37: a new page of the same search keeps its marks too.

        const reseat = this.markedIds.length > 0;
        if (reseat) this._holdMarks = (this._holdMarks ?? 0) + 1;
        table.setRows?.(this.cappedRecords, this._newResult ? "result" : "rows");
        this._newResult = false;

        this._applyOwnMarks();

        if (reseat) {
          const back = () => {
            this._holdMarks = Math.max(0, (this._holdMarks ?? 1) - 1);
            if (this._holdMarks) return;

            this._applyOwnMarks();

            this.pagination?.setState?.({
              selectedCount: this._bulkIds().length
            });

            this._renderBulkBand();
          };

          const frame = globalThis.requestAnimationFrame ?? (callback => setTimeout(callback, 16));

          frame(() => setTimeout(back, 0));
        }
      }

      const first = this.query.sort[0];
      table.setSort?.(first?.key ?? null, first?.direction ?? null);
      table.setTemplates?.(Object.fromEntries(this.savedViews.map(view => [view.key, view])));
    }

    const pagination = this.pagination; // Before the first answer there is no count to write. Writing one anyway
    // put «Всего: 0» under a heading that already said 450: the host's own
    // total in the markup was overwritten with this element's initial zero.

    const counted = this._answered ? {
      total: this.total,
      countKnown: this.countKnown,
      totalExact: this.totalExact,
      hasNext: this.hasNext
    } : {}; // The page size in force is one of the sizes offered: 25 by default
    // against the pager's 10/20/30/40 showed a size the select could not
    // name (docs trial 4). An author's own page-sizes is kept, the size added.
    // The page sizes the view offers (C388, view round 5 LV-12): 10, 20, 50
    // and 100, written on a page row the page gave none; an author's own
    // page-sizes is kept.

    if (pagination?.setAttribute && !pagination.hasAttribute?.("page-sizes")) {
      pagination.setAttribute("page-sizes", VIEW_PAGE_SIZES);
      pagination.setAttribute("data-sf-view-page-sizes", "");
    }

    const sizes = String(pagination?.getAttribute?.("page-sizes") ?? VIEW_PAGE_SIZES).split(/[\s,]+/u).map(Number).filter(size => Number.isInteger(size) && size > 0);
    const perPage = Number(this.query.per_page); // Only a size in force: the view's own default before the page's printed
    // page-size is read is not one (it put 25 among 10/20/50/100, LV-12).

    if (pagination && Number.isInteger(perPage) && perPage > 0 && !sizes.includes(perPage) && (this._pageSizeDeclared || this._answered)) {
      pagination.setAttribute("page-sizes", [...sizes, perPage].sort((a, b) => a - b).join(","));
    }

    pagination?.setState?.({
      current: this.query.page,
      pageSize: this.query.per_page,
      ...counted,
      canCount: this.knownCapability("count-on-request"),
      counting: false
    }); // The parts a consumer left out. Hidden rather than removed, so turning one
    // back on does not rebuild the shadow tree and lose what a host slotted
    // into it.
    // The shadow template is written once and cannot carry a language: it
    // is built before the element is anywhere. These two are named here,
    // where the page is readable.

    const layout = this.shadowRoot.querySelector('[part="layout"]'); // The author's name for the view, when it has one: the generic «Представление
    // данных» replaced it (docs trial 4).

    if (layout) layout.setAttribute("aria-label", this.getAttribute("aria-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "layoutLabel", this));
    const fallbackTable = this.querySelector(`:scope > ${(0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.tagSelector)("sf-view-table")}[data-sf-view-default]`);

    if (fallbackTable && !fallbackTable.getAttribute("aria-label")) {
      fallbackTable.setAttribute("aria-label", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "recordsLabel", this));
    }

    const toolbar = this.shadowRoot.querySelector('[part="toolbar"]');
    const ownToolbar = this.querySelector(':scope > [slot="toolbar"]'); // Only the author's own toolbar is drawn here; without one the part
    // takes no room (VF-3).

    if (toolbar) toolbar.hidden = !ownToolbar || !this.renders("toolbar") || this._queryRefused === true;
    const pageRow = this.shadowRoot.querySelector('slot[name="pagination"]'); // A tree has no pages: a level that is long ends in Show more, and the
    // host gives no total for the page row to count. Nor is there a page
    // row before the first answer or when there is no list to page: it
    // said «Всего: 10» over a loading, failed or refused list (docs trial 4).
    // A board has none either: each lane has its own «Показать ещё» (C304).

    const nothingToCount = !this._answered || this._queryRefused || ["error", "no-access"].includes(this.getAttribute("data-state"));
    if (pageRow) pageRow.hidden = !this.renders("pagination") || this.treeMode === "tree" || this.layoutKind === "board" || this.layoutKind === "calendar" || nothingToCount;

    if (!this.capHidesRows) {
      if (this._showAll?.isConnected) this._showAll.remove();
      this._showAll = null;
    } else {
      const band = this.showAllBand;
      let button = band.querySelector("[data-show-all]");

      if (!button) {
        button = document.createElement("sf-button");
        button.setAttribute("data-show-all", "");
        button.setAttribute("appearance", "ghost");
        if (this.controlSize) button.setAttribute("size", this.controlSize);
        band.append(button);
      }

      button.setAttribute("text", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "showAll", this));
      let count = band.querySelector("[data-show-count]");

      if (!count) {
        count = document.createElement("span");
        count.setAttribute("data-show-count", "");
        band.append(count);
      } // «N of M» only when the host has already said M. A count fetched to
      // decide what a link says would spend the host's query on this
      // element's own layout.


      count.textContent = this.countKnown ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "ofTotal", this).replace("{shown}", String(this.cappedRecords.length)).replace("{total}", this._shownTotal(this.total)) : "";
    }
  }

  saveView({
    key,
    label,
    level = "personal",
    revision,
    roles,
    layout,
    settings
  } = {}) {
    if (!key || !label) throw new TypeError("Saved view needs key and label");
    if (!["personal", "shared"].includes(level)) throw new TypeError("Only personal and shared views can be written"); // Shared views came with port 1.1.0 and stay in every later edition: the
    // test was for 1.1.0 exactly, so 1.2.0 onwards refused them.

    const [major, minor] = String(this.hostPort?.version ?? "0.0.0").split(".").map(Number);

    if (level === "shared" && !(major > 1 || major === 1 && minor >= 1)) {
      return Promise.resolve({
        answer: "unavailable",
        reason: "saved-view-levels-require-port-1.1.0"
      });
    } // A view keeps how to show, never what (owner decision C414,
    // view-config 1.1.0): the query it is saved with has no conditions,
    // no saved filter, no search and no page -- the order and the page
    // size stay. A saved filter is its own object (filter.save).


    const how = copy(this.query ?? {});

    for (const key of ["filters", "filters_chosen", "saved_filter", "search", "page"]) delete how[key];

    return this._raise(level === "shared" ? "view.save_shared" : "view.save", {
      key,
      label,
      revision,
      query: how,
      roles: copy(roles ?? {}),
      layout: copy(layout ?? {
        columns: this.columns
      }),
      // With the layout switch the view's list or table rides with it (C31).
      settings: copy(settings ?? { ...(this.columnSettings ?? {}),
        ...(this.table?.hasLayoutSwitch && this.table.chosenLayout ? {
          layout: this.table.chosenLayout
        } : {})
      }),
      ...(level === "shared" ? {
        target: "shared"
      } : {})
    });
  }

  deleteView(key) {
    return this._raise("view.delete", {
      key
    });
  } // Which view was opened, so its own settings can be put back when the
  // answer arrives: the fields the filter was showing are saved with it.
  // Where the host keeps the person's layer (port 1.16.0) the view opened
  // goes to it (preferences.save {view}), so the next visit opens it again.


  openView(key) {
    this._openedView = key;

    if (this.personalLayer && key != null && String(this._personalLayer.view ?? "") !== String(key)) {
      this._savePersonal({
        view: String(key)
      });
    }

    return this._raise("view.open", {
      key
    });
  } // The view the person opened last, from their layer (port 1.16.0
  // data.preferences.view): opened on load as if they had chosen it in the
  // views menu, when the host offers saved views and lists it and the list
  // is not already showing it (the page's own query or the default view).
  // The layer's page size rides with it. Answers whether a view was opened.


  _openKeptView(layer) {
    const key = typeof layer.view === "string" && layer.view !== "" ? layer.view : null;
    if (key === null || !this.hostOffers("saved-views")) return false;
    const views = Array.isArray(this.savedViews) ? this.savedViews : [];
    if (!views.some(view => String(view?.key) === key)) return false;
    const size = layer.page_size;
    const sized = Number.isInteger(size) && size > 0; // After the rest of this answer (its echo writes the query) is read,
    // and after the host's description (the layouts the view may open in).

    Promise.resolve().then(() => this._head?.described).catch(() => {}).then(() => {
      if (!this.isConnected) return;
      const shown = this.query.view?.id;
      const fallback = views.find(view => view?.default === true || view?.is_default === true) ?? views[0];
      const showing = shown != null && shown !== "" ? String(shown) === key : String(fallback?.key) === key;

      if (sized && size !== Number(this.query.per_page)) {
        this._pageSizeDeclared = true; // The list already shows the view: only the size is asked again.

        if (showing) return this.changeQuery({
          per_page: size,
          page: 1
        }, "page-size-change");
        this.query = { ...this.query,
          per_page: size,
          page: 1
        };
      }

      if (showing) return;
      if (typeof this._head?._openSavedView === "function") this._head._openSavedView(key);else this.openView(key);
    });
    return true;
  } // The part of a saved view that belongs to the table rather than to the
  // query: which filter fields it was showing.


  _restoreOpenedView() {
    const key = this._openedView;
    if (!key) return this;
    const view = this.savedViews.find(candidate => candidate?.key === key);
    if (!view) return this;
    this._openedView = null;
    const fields = view.settings?.filter_fields;

    if (Array.isArray(fields)) {
      this.table?.setActiveFilterFields?.(fields.filter(item => typeof item === "string"));
    } // The list or the table it was saved as (C31), for this person now.


    const layout = view.settings?.layout;

    if ((layout === "list" || layout === "table") && this.table?.hasLayoutSwitch) {
      this.table.setLayoutChoice?.(layout, {
        emit: false
      });
    }

    return this;
  } // The settings of the list of resources the view passes to its table
  // (C31). layout-switch only where the table draws its toolbar; a refused
  // list offers no switch either.


  _forwardListSettings(table, refused = false) {
    if (!table?.setAttribute) return;
    this._listForwarded ??= new Set();

    for (const name of LIST_ATTRIBUTES) {
      if (name === "layout" || name === "list-roles") continue;
      let value = this.getAttribute(name);
      if (name === "layout-switch" && value !== null && (value === "false" || refused || !this.renders("toolbar"))) value = null;

      if (value === null) {
        if (this._listForwarded.delete(name)) table.removeAttribute(name);
        continue;
      }

      table.setAttribute(name, value);

      this._listForwarded.add(name);
    }
  } // The columns with their places in a list row (columns[].list, C31):
  // the host's own -- simai.dataview-port 1.15.0 carries columns[].list,
  // passed on as the port sent it -- else what list-roles on the view names
  // ("state:status, name:title, domain:supporting, ssl:fact"). list-roles
  // is a dated alias of the port field until 2027-01-01 (aliases.json),
  // noted in SF.deprecations once per view.


  _listColumns(columns = []) {
    const written = String(this.getAttribute("list-roles") ?? "").trim();
    if (!written) return columns;

    if (!this._listRolesNoted) {
      this._listRolesNoted = true;
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__.noteDeprecated)({
        component: "sf-view",
        tag: "sf-view",
        kind: "attribute",
        attribute: "list-roles",
        from: "list-roles",
        to: "columns[].list",
        since: "2026-11-10",
        remove_after: "2027-01-01"
      });
    }

    const roles = new Map(written.split(/[\s,]+/u).filter(Boolean).map(pair => pair.split(":").map(part => part.trim())));

    if (this._listRolesKey !== written || this._listRolesFrom !== columns) {
      this._listRolesKey = written;
      this._listRolesFrom = columns;
      this._listRolesColumns = columns.map(column => column?.list || !roles.has(column?.key) ? column : { ...column,
        list: roles.get(column.key)
      });
    }

    return this._listRolesColumns;
  }

  saveColumnSettings(columnSettings, {
    shared = false,
    base_revision
  } = {}) {
    const layer = shared ? "shared" : "personal"; // The port's target.revision is the base when the host sent no layer of
    // that kind yet: the first personal save had none, and a column drag
    // threw an uncaught TypeError that never reached the host (docs trial 4).

    const target = this.columnSettings?.target;
    const targetRevision = target && (target.kind ?? target.target ?? target) === layer ? target.revision : target?.revision ?? null;
    const revision = base_revision ?? this.columnSettings?.layers?.[layer]?.revision ?? targetRevision; // A host that does not keep a person's columns (no
    // personal-column-settings): the change holds on screen for the
    // session, as in 1.11.0, and nothing is said -- a red notice on every
    // column hidden in «Колонки» told the person of a save nobody asked
    // for (view site guide, DEV 2026-11-24). The save runs only when the
    // host offers it.

    if (!shared && !this.hostOffers("personal-column-settings")) {
      return Promise.resolve({
        answer: "unavailable",
        reason: "capability-not-provided",
        session: true
      });
    }

    if (revision == null) {
      this._showAnswer(shared ? "settings.save_shared" : "settings.save_personal", {
        answer: "unavailable",
        reason: "no-base-revision"
      });

      return Promise.resolve({
        answer: "unavailable",
        reason: "no-base-revision"
      });
    }

    return this._raise(shared ? "settings.save_shared" : "settings.save_personal", {
      columnSettings: copy(columnSettings),
      base_revision: revision,
      ...(shared ? {
        target: "shared"
      } : {})
    }).then(answer => {
      // A conflict means the layer moved on: the revision this view holds
      // is stale, and every later change conflicted with it until a reload
      // (docs trial 5). The view takes the layer's current revision when
      // the host names it, and otherwise reads the list again, whose
      // answer carries the column settings as they are now.
      // The conflict carries current_revision (and the layer's columns)
      // beside answer, as port 1.12.0 states and every host gives it;
      // data.* is read too, for a host that followed 1.10.0's words.
      if (answer?.answer === "conflict") {
        const current = answer.current_revision ?? answer.data?.current_revision;
        const columns = answer.columns ?? answer.data?.columns;
        if (answer.data?.column_settings) this.columnSettings = copy(answer.data.column_settings);else if (current != null) {
          const layers = { ...(this.columnSettings?.layers ?? {})
          };
          layers[layer] = { ...(layers[layer] ?? {}),
            revision: current,
            ...(columns ? {
              columns: copy(columns)
            } : {})
          };
          this.columnSettings = { ...(this.columnSettings ?? {}),
            layers
          };
        } else this.refresh("settings-conflict");
      }

      return answer;
    });
  } // Resetting the person's layer is a write of nothing against its revision,
  // which is exactly what the port calls a reset: "a write against its
  // revision, never a deletion". The empty object matters — the host owns the
  // defaults, and writing this component's idea of them (everything visible,
  // no widths, nothing pinned) would overwrite them.


  resetColumnSettings() {
    return this.saveColumnSettings({}, {});
  } // An estimate reads «~N» wherever this element writes the number itself.


  _shownTotal(total) {
    return this.totalExact ? String(total) : `~${total}`;
  }

  applyUnderFilter(actionId, confirmedTotal) {
    // An estimate is not a number anyone can confirm: count first, show the
    // exact number and stop. The person confirmed «~N», not this number,
    // so nothing is written until they confirm it (standard 1.3.8 §19.4;
    // stand 24 S15: the counted number went to the host at once, more
    // records than the person agreed to when the estimate was low). The
    // answer is the conflict a moved count gives: current_total is the
    // number to confirm.
    if (!this.totalExact) {
      return this.count("action-for-all").then(answer => {
        if (!(this.totalExact && answer?.answer === "applied")) return answer;

        this._renderBulkBand();

        return {
          answer: "conflict",
          reason: "total-counted",
          current_total: this.total
        };
      });
    }

    if (!Number.isSafeInteger(confirmedTotal) || confirmedTotal !== this.total) {
      throw new TypeError("Confirm the current total before a filter-wide action");
    } // A count that moved meanwhile is a conflict carrying the current total
    // (vocabulary §3.1): the page row shows that number at once, so the
    // person confirms what is there now, not what was.


    return this._raise("bulk.apply_under_filter", {
      action_id: actionId,
      filters: copy(this.query.filters),
      confirmed_total: confirmedTotal
    }).then(answer => {
      const current = answer?.current_total ?? answer?.data?.total;

      if (answer?.answer === "conflict" && Number.isSafeInteger(current) && current >= 0) {
        this.total = current;
        this.totalExact = true;
        this.pagination?.setState?.({
          total: current,
          countKnown: true,
          totalExact: true
        });

        this._renderBulkBand();
      }

      return answer;
    });
  } // The number, asked for on its own. The view resumes whatever wanted it:
  // showing it, jumping to the last page, or an action under the filter that
  // has to name a confirmed total. A refusal puts the view back where it was
  // and says so — a for-all box left ticked over a number nobody has would be
  // a promise the view cannot keep.


  async count(reason = "total") {
    const requested = this._countKey();

    const answer = await this._raise("query.count", {
      query: {
        search: this.query.search ?? "",
        filters: copy(this.query.filters ?? {})
      },
      reason
    });
    const total = answer?.data?.total;

    if (answer?.answer !== "applied" || !Number.isSafeInteger(total) || total < 0) {
      this.pagination?.setState?.({
        counting: false
      });
      if (reason === "action-for-all") this.pagination?.setState?.({
        actionForAll: false
      });
      return answer;
    } // The query may have moved on while the host was counting; a number
    // belonging to a query nobody is looking at any more is not shown.


    if (requested !== this._countKey()) {
      this.pagination?.setState?.({
        counting: false
      });
      return answer;
    }

    this.total = total;
    this.countKnown = true;
    this.totalExact = answer.data.total_exact !== false;
    this.countedQuery = requested;
    this.pagination?.setState?.({
      counting: false,
      countKnown: true,
      totalExact: this.totalExact,
      total
    });
    if (reason === "last-page") this.pagination?.lastPage?.();
    return answer;
  }

  _action(detail, {
    selectedBulk = false
  } = {}) {
    const ids = detail?.record_ids;
    if (!Array.isArray(ids) || !ids.length || typeof detail.action_id !== "string") return;
    const chosen = ids.map(id => this.records.find(record => record.id === id)); // In a tree two of a record's actions are the view's own: move opens
    // the choice of the places the host offers, create makes a node under
    // it. Each is offered only when the record lists it.

    if (this.treeMode === "tree" && !selectedBulk && ids.length === 1 && chosen[0]?.actions?.includes(detail.action_id)) {
      if (detail.action_id === "move") return this.openMoveDialog(chosen[0]);
      if (detail.action_id === "create") return this._raise("view.create_record", {
        item: null,
        parent: chosen[0].id
      });
    } // A selected-bulk action has its own ID and permission in the host, even
    // when just one row is selected. The host checks the whole batch.


    if (chosen.some(record => !record) || !selectedBulk && ids.length === 1 && !chosen[0].actions?.includes(detail.action_id)) {
      this._showAnswer("record.mutate", {
        answer: "refused",
        reason: "action-not-allowed"
      });

      return;
    } // Opening a record is a request a page or an assembly takes
    // (vocabulary §5 open {id}): sf-data-view-open, then the host's
    // record.open unless a listener refused it (preventDefault).


    if (!selectedBulk && ids.length === 1 && detail.action_id === "view") return this._openRecord(ids[0], detail);
    const revisions = Object.fromEntries(chosen.map(record => [String(record.id), record.revision]));

    const written = this._raise(selectedBulk || ids.length > 1 ? "bulk.apply_selected" : "record.mutate", { ...detail,
      revisions
    }); // The fact a screen closes a deleted record on (vocabulary §4: a
    // fact after applied): sf-data-view-deleted {ids}.


    if (detail.action_id === "delete") {
      return Promise.resolve(written).then(answer => {
        if (answer?.answer === "applied") this.sfEmit("deleted", {
          ids: [...ids]
        });
        return answer;
      });
    }

    return written;
  } // A value pointing at another record opens it in the host's panel without
  // loading a page (owner, 2026-10-14). Taken only when the host opens
  // records; when its answer is not an opening, the address is followed, so
  // the click still goes somewhere.


  _openReference(event) {
    if (!this.hostPort || !this.hostOffers("row-actions")) return;
    event.preventDefault(); // The table's detail is camelCase on the element (standard 1.3.8 §3.2);
    // the port's payload is snake_case.

    const {
      href,
      recordId,
      record_id: recordIdBefore,
      ...detail
    } = event.detail ?? {};
    return this._raise("record.open", { ...detail,
      record_id: recordId ?? recordIdBefore ?? null,
      href
    }).then(answer => {
      if (!["applied", "accepted", "opened"].includes(answer?.answer) && href) globalThis.location?.assign?.(href);
    });
  } // ── the board (layout="board", sf-view-board; owner decisions C298, C304) ──
  // The query a layout asks: the board's window is the first per_lane
  // records of every lane by its lane field, and the totals of all lanes, in
  // one request (BD-4; draft view-config/1, open point 1).


  _layoutQuery(extra = null) {
    const query = copy(this.query);
    if (this.layoutKind === "cards") return (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.cardsQuery)(this, query);
    if (this.layoutKind === "calendar") return (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.calendarQuery)(this, query, extra);
    if (this.layoutKind !== "board") return query;

    const options = this._boardOptions(); // One request (owner decision C304, VR2-9): the first cards of every
    // lane and every lane's totals -- the count and the sums the board
    // shows (layouts.board totals) -- come in the same answer.


    query.window = {
      lanes: options.lane_field ?? null,
      per_lane: options.per_lane ?? 20,
      totals: ["count", ...this._boardSumTotals().map(copy)],
      ...(extra ?? {})
    };
    return query;
  } // The fields whose sums the board shows (layouts.board totals: {sum}).


  _boardSumTotals() {
    const totals = this._boardOptions().totals;

    return Array.isArray(totals) ? totals.filter(entry => entry && typeof entry === "object" && entry.sum) : [];
  } // layouts.board as the host's view answers it (view_config), else as the
  // page gave it on the board.


  _boardOptions() {
    const fromHost = this._boardHostOptions;
    const fromPage = this.board?.options;
    return { ...(fromPage && typeof fromPage === "object" ? fromPage : {}),
      ...(fromHost ?? {}),
      ...this.ownLayoutSettings("board")
    };
  } // The board's part of an answer: the lanes (a continuation of one lane
  // after «Показать ещё»), the move rules and the order field.


  _acceptBoard(data) {
    const layouts = data.view_config?.layouts ?? data.layouts;
    if (layouts?.board && typeof layouts.board === "object") this._boardHostOptions = copy(layouts.board);

    if (data.board && typeof data.board === "object") {
      if (data.board.moves && typeof data.board.moves === "object") this._boardMoves = copy(data.board.moves);
      if (data.board.order_field !== undefined) this._boardOrderField = data.board.order_field ?? "";
    }

    if (!Array.isArray(data.lanes)) return;
    const more = this._laneMore;
    this._laneMore = null;

    if (more !== null && more !== undefined) {
      const lane = data.lanes.find(entry => String(entry.value) === String(more)) ?? {
        records: []
      };
      const known = (this.boardLanes ?? []).find(entry => String(entry.value) === String(more));

      if (known) {
        known.records = [...(known.records ?? []), ...copy(lane.records ?? [])];
        known.cursor = lane.cursor ?? null;
      }

      this.board?.appendLane?.(String(more), {
        records: lane.records ?? [],
        cursor: lane.cursor ?? null,
        total: lane.total,
        totals: lane.totals
      });
    } else {
      this.boardLanes = copy(data.lanes);
      this._boardFresh = true;
    } // The records on screen are the lanes' records: a write's answer
    // patches them as it patches a table's rows.


    this.records = (this.boardLanes ?? []).flatMap(lane => lane.records ?? []);
  }

  _syncBoard() {
    const board = this.board;
    if (!board || this.layoutKind !== "board") return;
    board.fields = this.columns ?? [];
    const own = this.ownLayoutSettings("board");
    if (this._boardHostOptions || Object.keys(own).length) board.options = { ...(board.options ?? {}),
      ...(this._boardHostOptions ?? {}),
      ...own
    };
    board.moves = this._boardMoves ?? {};

    if (this._boardFresh) {
      this._boardFresh = false; // The sums came with the cards (C304): nothing is held for them.

      board.removeAttribute("sums-pending");
      board.lanes = this.boardLanes ?? [];

      this._applyOwnMarks();
    }

    const refused = this._queryRefused === true;
    board.setAttribute("order-field", this._boardOrderField ?? "");
    board.toggleAttribute("sort-active", Array.isArray(this.query.sort) && this.query.sort.length > 0);
    board.setAttribute("selectable", this.selects() && !refused ? "true" : "false");
    board.setAttribute("creatable", this.hostOffers("create-record") && !refused ? "true" : "false"); // A move is a change of the lane field: the host's record.set (BD-5).

    board.setAttribute("movable", this.hostOffers("inline-edit") && !refused ? "true" : "false");
    if (this.controlSize) board.setAttribute("size", this.controlSize);
    if (!board.hasAttribute("aria-label")) board.setAttribute("aria-label", this.getAttribute("aria-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_2__.pageText)(DATA_VIEW_TEXT, "recordsLabel", this));
  }

  async _onBoardEvent(event) {
    const board = event.target?.closest?.("sf-view-board");
    if (!board || board !== this.board) return;
    const detail = event.detail ?? {};

    if (event.type === "sf-view-board-move") {
      const answer = await this._raise("record.set", {
        record_id: detail.id,
        key: detail.field,
        value: detail.to,
        before: detail.before ?? null,
        revision: detail.revision ?? null
      });
      const record = answer?.data?.records?.find?.(entry => String(entry.id) === String(detail.id));
      board.settleMove(detail.id, answer?.answer === "applied" ? {
        answer: "applied",
        ...(record ? {
          record
        } : {})
      } : {
        answer: answer?.answer ?? "refused",
        reason: answer?.reason ?? "",
        message: hostMessage(answer ?? {})
      });
      return;
    }

    if (event.type === "sf-view-board-more") {
      this._laneMore = detail.lane;
      const answer = await this._raise("query.change", {
        sequence: this.sequence,
        reason: "lane-more",
        query: this._layoutQuery({
          lane: detail.lane,
          cursor: detail.cursor ?? null,
          offset: detail.offset ?? 0
        })
      });

      if (answer?.answer !== "applied" && this._laneMore !== null) {
        this._laneMore = null;
        board.appendLane(detail.lane, {
          records: []
        });
      }

      return;
    }

    if (event.type === "sf-view-board-open") {
      await this._openRecord(detail.id, {
        action_id: "view",
        record_ids: [detail.id],
        record_id: detail.id
      });
      return;
    }

    if (event.type === "sf-view-board-create") {
      await this._raise("view.create_record", {
        item: null,
        values: {
          [detail.field]: detail.value
        }
      });
      return;
    }

    if (event.type === "sf-view-board-apply") {
      await this._action({
        action_id: detail.action,
        record_ids: detail.ids ?? []
      }, {
        selectedBulk: true
      });
    } // A lane folded, hidden or brought back: «Вид» lists the lanes as
    // they are now.


    if (event.type === "sf-view-board-save") this._head?.render?.();
  }

  _onEvent(event) {
    if (this._seenEvents.has(event)) return;

    this._seenEvents.add(event);

    if (event.type.startsWith("sf-view-board-")) return this._onBoardEvent(event);
    if (event.type.startsWith("sf-view-cards-")) return (0,_js_cards_js__WEBPACK_IMPORTED_MODULE_19__.onCardsEvent)(this, event);
    if (event.type.startsWith("sf-view-calendar-")) return (0,_js_calendar_js__WEBPACK_IMPORTED_MODULE_20__.onCalendarEvent)(this, event); // The port's event for a shared saved view (view.save_shared): a page
    // raises save {kind: "view", key, label} on the view itself (vocabulary
    // 1.1.5 §9; sf-view 1.12.0), so it is taken before the rule that
    // ignores the view's own events. The former name
    // sf-view-saved-view-intent arrives here through the alias shim as
    // sf-view-save with its detail as it was, without kind: that is read
    // as a view, and noted only when it came under the former name (the
    // new name without kind is a view too, and is not noted). A save of
    // another kind is not the view's.

    if (event.type === "sf-view-save") {
      if (event.currentTarget !== this) return;
      const view = event.detail ?? {};
      if (view.kind !== undefined && view.kind !== "view") return;
      if (view.kind === undefined && this._saveByFormerName > 0) (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_7__.noteDeprecated)({
        component: "sf-view",
        tag: "sf-view",
        kind: "event",
        from: "sf-view-saved-view-intent",
        to: "sf-view-save",
        since: "2026-11-10",
        remove_after: "2027-01-01"
      });
      return this.saveView({
        key: view.key,
        label: view.label ?? view.key,
        revision: view.revision,
        level: "shared",
        roles: view.roles
      });
    }

    if (event.target === this || event.target?.closest?.((0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.tagSelector)("sf-view")) !== this && !this.shadowRoot.contains(event.target)) return; // An event crossing the shadow boundary is observed once, at the shadow root.

    if (event.currentTarget === this && this.shadowRoot.contains(event.target)) return;
    if (event.type === "click" && event.target.matches?.("[data-show-all]")) return this.openList("row-cap"); // VL-76: the table's look changed by a call (a page's own density
    // switch, setTableView): «Вид» names what the table shows now.

    if (event.type === "sf-view-table-view-change") return this._head?.render?.();
    if (event.type === "sf-view-table-cell-set") return this.setCell(event.detail ?? {});
    if (event.type === "sf-view-table-move") return this.reorderRows(event.detail ?? {});

    if (event.type === "sf-view-table-search-change") {
      const search = typeof event.detail === "object" && event.detail !== null ? event.detail.search : event.detail;
      return this.changeQuery({
        search: String(search ?? "")
      }, "search");
    }

    if (event.type === "sf-view-table-filter-change") return this.changeQuery({
      filters: copy(event.detail?.filters ?? event.detail?.values ?? event.detail ?? {})
    }, "filter");

    if (event.type === "sf-view-table-sort-change") {
      const sort = event.detail?.direction ? [copy(event.detail)] : [];

      this._keepPreference({
        sort
      });

      return this.changeQuery({
        sort
      }, "sort");
    }

    if (event.type === "sf-pagination-change") return this.changeQuery({
      page: event.detail?.current
    }, "page-change");

    if (event.type === "sf-pagination-size-change") {
      const size = event.detail?.["page-size"];
      if (Number.isInteger(size)) this._keepPreference({
        pageSize: size
      }); // Another page size reads the list from its first page.

      return this.changeQuery({
        per_page: size,
        page: 1
      }, "page-size-change");
    }

    if (event.type === "sf-pagination-load-more") return this.changeQuery({
      page: this.query.page + 1
    }, "show-more");
    if (event.type === "sf-pagination-count") return this.count(event.detail?.reason ?? "total");
    if (event.type === "sf-view-table-column-settings-reset") return this.resetColumnSettings(); // The panel's cross says the selection is over. The rows hold it, so
    // the view passes the word on rather than tracking a copy of its own.

    if (event.type === "sf-pagination-selection-clear") return this.clearSelection();

    if (event.type === "sf-pagination-action-change" || event.type === "sf-pagination-action-for-all-change") {
      // The chooser and For-all live in the band now; the pagination still
      // holds their state, so the band is redrawn when it changes.
      this._renderBulkBand();

      return undefined;
    }

    if (event.type === "sf-view-table-refresh") return this.refresh("retry");
    if (event.type === "sf-view-table-reference-open") return this._openReference(event);

    if (event.type === "sf-view-table-expand") {
      const id = event.detail?.id;
      return event.detail?.expanded ? this.collapseNode(id) : this.expandNode(id);
    }

    if (event.type === "sf-view-table-load-more") return this.loadMoreNodes(event.detail?.parent, event.detail?.cursor);

    if (event.type === "sf-view-table-apply") {
      // A bulk action names every marked record, of every page (LV2-2);
      // a row's own action names its row.
      const bulk = event.detail?.scope === "selection";
      return this._action({
        action_id: event.detail?.action,
        record_ids: bulk && this._bulkIds().length ? this._bulkIds() : event.detail?.ids
      }, {
        selectedBulk: bulk
      });
    }

    if (event.type === "sf-view-table-save") {
      return this.saveColumnSettings(event.detail?.columnSettings ?? event.detail, {
        shared: event.detail?.target === "shared",
        base_revision: event.detail?.base_revision
      });
    }

    if (event.type === "sf-pagination-apply") {
      if (event.detail?.scope === "filter") return this.applyUnderFilter(event.detail.action, event.detail.total);
      return this._action({
        action_id: event.detail?.action,
        record_ids: this._bulkIds()
      }, {
        selectedBulk: true
      });
    }

    if (event.type === "sf-view-table-select") {
      // Rows set again with their marks held (LV4-21): the table's own
      // clear is not the person's.
      // While a switch back to the table waits for its own answer, the
      // table's marks are the ones held for it (C413), not what a table
      // drawn with the other kind's records says.
      if (this._holdMarks || this._ownHeld) return; // The rows the table holds now: their marks are what it says,
      // the marks of other pages stay (LV2-2).
      // The records the view gave it, not its own rows: a table answering a
      // new page clears its marks while it still holds the old rows,
      // and those were taken for unmarked.

      const rows = (this.cappedRecords ?? this.table?.getTableData?.().rows ?? []).map(row => row?.id);

      this._noteMarks(rows, event.detail?.ids ?? []);

      this.pagination?.setState?.({
        selectedCount: this._bulkIds().length
      });

      this._renderBulkBand();

      return;
    }

    const intent = EVENTS[event.type];
    if (intent === "query.change") return this.refresh("table-context");

    if (intent === "view.save") {
      // Reordering or pinning on the templates tab sends every changed
      // template at once, as an array: each one is its own save (it threw
      // «Saved view needs key and label» on the array itself).
      const save = (view = {}) => this.saveView({
        key: view.key,
        label: view.label ?? view.name ?? view.key,
        revision: view.revision,
        level: view.level ?? "personal",
        roles: view.roles,
        layout: view.layout,
        settings: view.settings
      }); // sf-view-table 1.16.0 carries {templates}; a bare template or an
      // array of them, from a table before it, is read until 2027-01-01.


      const detail = event.detail ?? {};
      const templates = Array.isArray(detail.templates) ? detail.templates : detail;
      return Array.isArray(templates) ? Promise.all(templates.filter(view => view?.key).map(save)) : save(templates);
    }

    if (intent) return this._raise(intent, copy(event.detail ?? {}));
  }

} // Not a Smart base element, so it carries the same brand by hand: quiet when
// the component arrives twice, loud when something else holds the tag.


SfDataView.sfElementBrand = "simai.smart-base.v1";
(0,_view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_8__.answerActions)(SfDataView, _component_json__WEBPACK_IMPORTED_MODULE_9__);
(0,_view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_8__.settingSetters)(SfDataView, _component_json__WEBPACK_IMPORTED_MODULE_9__);

function defineDataView() {
  const definedDataView = customElements.get("sf-view");

  if (!definedDataView) {
    customElements.define("sf-view", SfDataView); // sf-data-view, the former tag, is a subclass defined beside it until
    // 2027-01-01 (aliases.json, ui-source change journal tag-sf-data-view-to-sf-view).

    (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_4__.defineTagAliases)(SfDataView, "sf-view");
  } else if (definedDataView.sfElementBrand !== SfDataView.sfElementBrand) {
    console.warn("SfDataView.define(): sf-view is already defined", definedDataView);
  }
} // View modular step 1: sf-view relates to the table lazily, so the Loader no
// longer runs the table's script before this one. A list on the page that
// draws the table (no layout, or auto, table, list) would then draw first
// with an undefined table and move when the table came (first paint of the
// view examples, gate 24). Where such a list is on the page and the Loader
// is there, the view is defined once sf-view-table is (asked for now, as the
// eager relation asked for it), or after 3 s, the table's own bound for the
// view (D2). A page of boards, cards or calendars defines it at once and
// never fetches the table; so does a page without the Loader.


function waitsForTable() {
  if (typeof globalThis.SF?.Loader?.ensure !== "function" || customElements.get("sf-view-table")) return false;
  const lists = globalThis.document?.querySelectorAll?.("sf-view, sf-data-view") ?? [];
  return [...lists].some(node => {
    const written = node.getAttribute("layout");
    return !written || tableLayout(written);
  });
}

if (waitsForTable()) globalThis.SF.Loader.ensure(["sf-view-table"], {
  timeout: 3000
}).then(defineDataView, defineDataView);else defineDataView();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SfDataView);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d120fce454af"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CALENDAR_EVENTS: () => (/* binding */ CALENDAR_EVENTS),
/* harmony export */   acceptCalendar: () => (/* binding */ acceptCalendar),
/* harmony export */   calendarOf: () => (/* binding */ calendarOf),
/* harmony export */   calendarOrder: () => (/* binding */ calendarOrder),
/* harmony export */   calendarQuery: () => (/* binding */ calendarQuery),
/* harmony export */   calendarSkeleton: () => (/* binding */ calendarSkeleton),
/* harmony export */   onCalendarEvent: () => (/* binding */ onCalendarEvent),
/* harmony export */   syncCalendar: () => (/* binding */ syncCalendar)
/* harmony export */ });
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
const CALENDAR_EVENTS = Object.freeze(["sf-view-calendar-move", "sf-view-calendar-open", "sf-view-calendar-create", "sf-view-calendar-range", "sf-view-calendar-save", "sf-view-calendar-apply"]);

const copy = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

const UNDATED_PAGE = 50;
function calendarOf(view) {
  const slot = view.shadowRoot?.querySelector?.('slot[name="content"]');
  return slot?.assignedElements?.().find(element => element.localName === "sf-view-calendar") ?? view.querySelector?.(':scope > sf-view-calendar[slot="content"]') ?? null;
} // layouts.calendar as the host's view answers it, else as the page gave it.

function calendarOptionsOf(view) {
  const fromPage = calendarOf(view)?.options;
  return { ...(fromPage && typeof fromPage === "object" ? fromPage : {}),
    ...(view._calendarHostOptions ?? {}),
    ...(view.ownLayoutSettings?.("calendar") ?? {})
  };
} // The window before the calendar has drawn (its code comes after the view's):
// the month around today, Monday first unless the page says otherwise.


function defaultWindow(view) {
  const options = calendarOptionsOf(view);
  const fields = view.columns ?? [];

  const dated = list => (Array.isArray(list) ? list : []).find(field => ["date", "datetime"].includes(String(field?.propertyType ?? field?.property_type ?? field?.type ?? "")))?.key ?? null; // layouts.calendar, else the first date field of the columns, else of the
  // host's description (VCL-2: the first range query went out with null).


  const dateField = options.date_field ?? dated(fields) ?? dated(view._head?.description?.fields);
  const today = new Date();
  const first = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));
  const start = Number(view.getAttribute?.("week-start") ?? 1) % 7;
  const from = new Date(first);
  from.setUTCDate(first.getUTCDate() - (first.getUTCDay() - start + 7) % 7);
  const to = new Date(from);
  to.setUTCDate(from.getUTCDate() + 42);

  const iso = date => date.toISOString().slice(0, 10);

  return {
    range: [iso(from), iso(to)],
    ...(dateField ? {
      date_field: dateField
    } : {}),
    ...(options.end_field ? {
      end_field: options.end_field
    } : {})
  };
}

function contextOf(view) {
  const calendar = calendarOf(view);
  if (calendar && typeof calendar.context === "object" && calendar.context) return copy(calendar.context);
  const given = view._calendarContext ?? {};
  let zone = "UTC";

  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    /* UTC */
  }

  return {
    timeZone: given.timeZone ?? zone,
    ...(Number.isInteger(given.weekStart) ? {
      weekStart: given.weekStart
    } : {}),
    locale: view.closest?.("[lang]")?.getAttribute("lang") || globalThis.document?.documentElement?.lang || "ru"
  };
}
/** The calendar's query: the view's, with the date window and the request's context. */


function calendarQuery(view, query, extra = null) {
  const calendar = calendarOf(view);
  const window = calendar && typeof calendar.window === "object" && calendar.window?.date_field ? copy(calendar.window) : defaultWindow(view);
  query.window = { ...window,
    ...(extra ?? {})
  }; // Never a null date field (VCL-2): before the field is known the range
  // goes without it and the host answers by its own (layouts.calendar).
  // That answer stands: one query, not two (view round 5, B2).

  if (!query.window.date_field) delete query.window.date_field;
  query.context = contextOf(view);
  delete query.page;
  delete query.per_page;
  return query;
}
/** The calendar's part of an answer: layouts.calendar, the rules of the date field, the request's context, the records. */

function acceptCalendar(view, data) {
  if (view.layoutKind !== "calendar") return;
  const layouts = data.view_config?.layouts ?? data.layouts;
  if (layouts?.calendar && typeof layouts.calendar === "object") view._calendarHostOptions = copy(layouts.calendar);
  if (data.context && typeof data.context === "object") view._calendarContext = copy(data.context);

  if (data.rules && typeof data.rules === "object") {
    const dateField = calendarOptionsOf(view).date_field;
    const rules = Array.isArray(data.rules) ? data.rules : data.rules[dateField];
    if (Array.isArray(rules)) view._calendarRules = copy(rules);
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

function syncCalendar(view) {
  const calendar = calendarOf(view);
  if (!calendar || view.layoutKind !== "calendar") return;
  calendar.fields = view.columns ?? [];
  const own = view.ownLayoutSettings?.("calendar") ?? {};
  if (view._calendarHostOptions || Object.keys(own).length) calendar.options = { ...(calendar.options ?? {}),
    ...(view._calendarHostOptions ?? {}),
    ...own
  };
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
  calendar.setAttribute("selectable", view.selects() && !refused ? "true" : "false");
  calendar.setAttribute("creatable", view.hostOffers("create-record") && !refused ? "true" : "false");
  calendar.setAttribute("movable", view.hostOffers("inline-edit") && !refused ? "true" : "false");
  if (view._current !== undefined) calendar.current = view._current;
  if (view.controlSize) calendar.setAttribute("size", view.controlSize);
  if (!calendar.hasAttribute("aria-label") && view.getAttribute("aria-label")) calendar.setAttribute("aria-label", view.getAttribute("aria-label"));

  if (view._calendarUndatedWanted) {
    view._calendarUndatedWanted = false;
    askUndated(view, view.sequence, calendar);
  }
} // The undated records, a query of their own after the records of the days.

async function askUndated(view, sequence, calendar) {
  const options = calendarOptionsOf(view);
  if (options.undated === "none" || !view.hostPort) return;
  const dateField = calendar.window?.date_field ?? options.date_field;
  if (!dateField) return;
  const query = copy(view.query);
  delete query.page;
  delete query.per_page;
  query.window = {
    undated: dateField,
    page: 1,
    per_page: UNDATED_PAGE
  };
  query.context = contextOf(view);
  let answer = null;

  try {
    answer = await view.hostPort.raise("query.change", copy({
      sequence,
      reason: "undated",
      query
    }), {
      signal: view._controller?.signal
    });
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


function calendarOrder(view) {
  const calendar = calendarOf(view);
  return (calendar?.events ?? []).map(event => event.record);
}
/** The calendar's events answered through the port. */

async function onCalendarEvent(view, event) {
  const calendar = event.target?.closest?.("sf-view-calendar");
  if (!calendar || calendar !== calendarOf(view)) return;
  const detail = event.detail ?? {};

  if (event.type === "sf-view-calendar-move") {
    const options = calendarOptionsOf(view);
    const key = options.date_field ?? Object.keys(detail.patch ?? {})[0];
    const answer = await view._raise("record.set", {
      record_id: detail.id,
      key,
      value: detail.patch?.[key] ?? null,
      patch: copy(detail.patch ?? {}),
      revision: detail.revision ?? null
    });
    const record = answer?.data?.records?.find?.(entry => String(entry.id) === String(detail.id));
    const message = answer?.message ?? answer?.data?.message ?? "";
    calendar.settleMove(detail.id, answer?.answer === "applied" ? {
      answer: "applied",
      ...(record ? {
        record
      } : {})
    } : {
      answer: answer?.answer ?? "refused",
      reason: answer?.reason ?? "",
      code: answer?.code ?? answer?.data?.code ?? answer?.reason ?? "",
      message: typeof message === "string" ? message : ""
    });
    return;
  }

  if (event.type === "sf-view-calendar-range") {
    await view.refresh?.("calendar-range");
    return;
  }

  if (event.type === "sf-view-calendar-open") {
    await view._openRecord(detail.id, {
      action_id: "view",
      record_ids: [detail.id],
      record_id: detail.id
    });
    return;
  }

  if (event.type === "sf-view-calendar-create") {
    const value = detail.time ? `${detail.date}T${detail.time}` : detail.date;
    await view._raise("view.create_record", {
      item: null,
      values: {
        [detail.field ?? calendarOptionsOf(view).date_field]: value
      }
    });
    return;
  }

  if (event.type === "sf-view-calendar-apply") {
    await view._action({
      action_id: detail.action,
      record_ids: detail.ids ?? []
    }, {
      selectedBulk: true
    });
  }
}
/** The calendar's first paint (CL-2): its bar and the month grid of six weeks, the size the calendar draws. */

function calendarSkeleton() {
  const bar = '<i class="sf-skeleton-text"></i>';
  const control = '<i class="sf-skeleton-text" data-control></i>';
  const week = `<div>${"<span><i class=\"sf-skeleton-text\"></i></span>".repeat(7)}</div>`;
  return '<div class="sf-data-view-skeleton-calendar">' + `<div data-part="bar">${control}${control}${bar}${control}${control}</div>` + `<div data-part="weekdays">${"<span><i class=\"sf-skeleton-text\"></i></span>".repeat(7)}</div>` + `<div data-part="month">${week.repeat(6)}</div>` + "</div>";
}

/***/ },

/***/ "1caedc1977b8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CARDS_EVENTS: () => (/* binding */ CARDS_EVENTS),
/* harmony export */   CARDS_PER_PAGE: () => (/* binding */ CARDS_PER_PAGE),
/* harmony export */   CARDS_TAG: () => (/* binding */ CARDS_TAG),
/* harmony export */   FIRST_PAINT_CARDS: () => (/* binding */ FIRST_PAINT_CARDS),
/* harmony export */   acceptCards: () => (/* binding */ acceptCards),
/* harmony export */   cardsDrawn: () => (/* binding */ cardsDrawn),
/* harmony export */   cardsOf: () => (/* binding */ cardsOf),
/* harmony export */   cardsOptions: () => (/* binding */ cardsOptions),
/* harmony export */   cardsQuery: () => (/* binding */ cardsQuery),
/* harmony export */   cardsSkeleton: () => (/* binding */ cardsSkeleton),
/* harmony export */   onCardsEvent: () => (/* binding */ onCardsEvent),
/* harmony export */   syncCards: () => (/* binding */ syncCards),
/* harmony export */   syncCardsState: () => (/* binding */ syncCardsState)
/* harmony export */ });
// sf-view's side of the cards layout (sf-view-cards, layout="cards"; owner
// decisions C297, C306; ui-control control/research/2026-11-18-cards-view).
// Kept out of index.js so the view's own file only names the layout and
// calls these at its hook points (the board, the calendar and the layout
// switch edit the same file).
//
// The cards ask a window {page, per_page: 24}; the answer's records are the
// view's records (a «Показать ещё» continues the list, as the page row's
// Show more does); a press opens the record as the table's row does (the
// record card beside the list, C305); the marks go to the cards' bulk bar
// with the view's bulk actions.
const CARDS_TAG = "sf-view-cards";
const CARDS_PER_PAGE = 24; // The first paint: as many cards as two rows of the widest grid hold.

const FIRST_PAINT_CARDS = 8;
const CARDS_EVENTS = Object.freeze(["sf-view-cards-open", "sf-view-cards-select", "sf-view-cards-more", "sf-view-cards-apply", "sf-view-cards-create", "sf-view-cards-reset", "sf-view-cards-refresh"]);

const copy = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
/** The cards element in the view's content slot. */


function cardsOf(view) {
  const slot = view.shadowRoot?.querySelector?.('slot[name="content"]');
  return slot?.assignedElements?.().find(element => element.localName === CARDS_TAG) ?? view.querySelector?.(`:scope > ${CARDS_TAG}[slot="content"]`) ?? null;
}
/** layouts.cards as the host's view answers it, else as the page gave it on the cards. */

function cardsOptions(view) {
  const fromPage = cardsOf(view)?.options;
  return { ...(fromPage && typeof fromPage === "object" ? fromPage : {}),
    ...(view._cardsHostOptions ?? {}),
    ...(view.ownLayoutSettings?.("cards") ?? {})
  };
}
/** The query the cards ask (CD-4): the page and window {page, per_page}. */

function cardsQuery(view, query) {
  // A page size the person chose in the footer (LV2-6: the cards have the
  // list's page row) goes over the cards' own 24.
  const asked = Number(cardsOptions(view).per_page ?? view._cardsPageSize);
  const perPage = Number.isSafeInteger(asked) && asked > 0 ? asked : CARDS_PER_PAGE;
  view.query.per_page = perPage;
  query.per_page = perPage; // Switched in from another kind (LV2-8): the page holding the record that
  // was first on screen, in the cards' page size.

  if (Number.isSafeInteger(view._keepFirst)) {
    query.page = view.query.page = Math.floor((view._keepFirst - 1) / perPage) + 1; // The rows on screen start from this page («1–24 из 48»).

    if (!view.continuing) view._runStart = query.page;
    view._keepFirst = null;
  }

  query.window = {
    page: Number.isSafeInteger(query.page) && query.page > 0 ? query.page : 1,
    per_page: perPage
  };
  return query;
}
/** The cards' part of an answer: layouts.cards of the view's settings. */

function acceptCards(view, data) {
  const layouts = data?.view_config?.layouts ?? data?.layouts;
  if (layouts?.cards && typeof layouts.cards === "object") view._cardsHostOptions = copy(layouts.cards);
}
/** What the view knows, given to the cards (after every answer and state). */

function syncCards(view) {
  const cards = cardsOf(view);
  if (!cards) return;
  cards.fields = view.columns ?? [];
  const own = view.ownLayoutSettings?.("cards") ?? {};
  if (view._cardsHostOptions || Object.keys(own).length) cards.options = { ...(cards.options ?? {}),
    ...(view._cardsHostOptions ?? {}),
    ...own
  };
  if (view._answered) cards.records = view.records ?? [];
  const refused = view._queryRefused === true;
  if (view.countKnown !== false && Number.isSafeInteger(view.total)) cards.setAttribute("total", String(view.total));else cards.removeAttribute("total");
  cards.setAttribute("count-known", view.countKnown === false ? "false" : "true"); // The list's paging (D1, LV2-6) draws «Показать ещё» and the pages
  // under the cards; the grid draws no button of its own then.

  if (view._viewPaging?.() != null) cards.setAttribute("has-next", "false");else if (typeof view.hasNext === "boolean" && !(view.countKnown !== false && Number.isSafeInteger(view.total))) cards.setAttribute("has-next", view.hasNext ? "true" : "false");else cards.removeAttribute("has-next");
  syncCardsState(view, view.getAttribute?.("data-state") ?? "");
  cards.setAttribute("selectable", view.selects() && !refused ? "true" : "false");
  cards.setAttribute("creatable", view.hostOffers("create-record") && !refused ? "true" : "false");
  cards.actions = (view.bulkActions ?? []).map(item => ({
    id: item.id ?? item.value,
    text: item.label ?? item.text ?? item.id ?? item.value,
    icon: item.icon
  }));
  cards.current = view._current ?? "";
  if (view.controlSize) cards.setAttribute("size", view.controlSize);
  if (!cards.hasAttribute("aria-label") && view.getAttribute("aria-label")) cards.setAttribute("aria-label", view.getAttribute("aria-label"));
}
/** The view's data state on the cards: loading, empty (and why), error, no-access. */

function syncCardsState(view, state) {
  const cards = cardsOf(view);
  if (!cards || !state) return;
  if (state === "empty") cards.emptyContext = view._emptyContext();else if (state === "error") cards.emptyContext = {
    kind: "error",
    ...(view._queryMessage ? {
      message: view._queryMessage
    } : {})
  };else if (view._queryRefused) cards.emptyContext = {
    kind: "no-access",
    ...(view._queryMessage ? {
      message: view._queryMessage
    } : {})
  }; // A «Показать ещё» that failed gives its button back.

  if (state !== "loading" && cards._loadingMore && view._answered) cards.records = view.records ?? [];
  const kind = view._queryRefused && state !== "loading" ? "no-access" : state;
  if (cards.getAttribute("data-state") !== kind) cards.setAttribute("data-state", kind);
}
/** The cards' events, answered as the table's are. */

function onCardsEvent(view, event) {
  const cards = event.target?.closest?.(CARDS_TAG);
  if (!cards || cards !== cardsOf(view)) return undefined;
  const detail = event.detail ?? {};

  switch (event.type) {
    case "sf-view-cards-open":
      return view._openRecord(String(detail.id), {
        action_id: "view",
        record_ids: [String(detail.id)],
        record_id: String(detail.id)
      });

    case "sf-view-cards-more":
      return view.changeQuery({
        page: (Number(view.query.page) || 1) + 1
      }, "show-more");

    case "sf-view-cards-select":
      {
        view._cardsSelection = Array.isArray(detail.ids) ? detail.ids.map(String) : []; // The cards keep every page's marks (keep-selection): their list is
        // the person's marks (LV2-2); «Выбрать все N» on their bar is the
        // list's «for all» (LV2-7), as on the table's.

        const known = new Map([...(view.markedIds ?? []).map(id => [String(id), id]), ...(view.records ?? []).map(record => [String(record.id), record.id])]);
        view._marks = null;
        view._noteMarks?.([], view._cardsSelection.map(id => known.has(id) ? known.get(id) : id));
        if (typeof detail.all === "boolean" && Boolean(view.pagination?.actionForAll) !== detail.all) view.pagination?.setActionForAll?.(detail.all);
        view.pagination?.setState?.({
          selectedCount: view._cardsSelection.length
        });
        view._renderBulkBand?.();
        return undefined;
      }

    case "sf-view-cards-apply":
      {
        // The cards say ids as text; the records keep the host's own.
        const ids = (detail.ids ?? []).map(id => (view.records ?? []).find(record => String(record.id) === String(id))?.id ?? id); // «Выбраны все N» (LV2-7): the action under the filter, as the table's bar asks it.

        if (detail.scope === "all") return view.applyUnderFilter(String(detail.action), view.total);
        const kept = new Map(view.markedIds.map(id => [String(id), id]));
        return view._action({
          action_id: String(detail.action),
          record_ids: ids.map(id => kept.get(String(id)) ?? id)
        }, {
          selectedBulk: detail.scope !== "record"
        });
      }

    case "sf-view-cards-create":
      return view._raise("view.create_record", {
        item: null
      });

    case "sf-view-cards-reset":
      return view.changeQuery({
        search: "",
        filters: {}
      }, "filter");

    case "sf-view-cards-refresh":
      return view.refresh("retry");

    default:
      return undefined;
  }
}
/** Whether the cards have drawn (the first paint stays until they have). */

function cardsDrawn(view) {
  const cards = cardsOf(view);
  return Boolean(globalThis.customElements?.get?.(CARDS_TAG) && cards?.querySelector?.(".sf-view-cards > *"));
}
/**
 * The cards' first paint (CD-2): a grid of cards of the cards' own lengths,
 * a cover frame where the options give one, no table and no page row.
 */

function cardsSkeleton(view, bar) {
  const cards = cardsOf(view);
  const options = cardsOptions(view);
  const size = ["s", "m", "l"].includes(cards?.getAttribute?.("card-size")) ? cards.getAttribute("card-size") : ["s", "m", "l"].includes(options.size) ? options.size : "m";
  const cover = options.cover_field !== null; // The title, then the fields one under the other, each its label over its
  // value (D3): as many as the view names (four at most), else two.

  const count = Array.isArray(options.card_fields) ? Math.min(4, options.card_fields.length) : 2;
  const label = options.card_labels === false ? "" : '<i class="sf-skeleton-text" data-part="label"></i>';
  const fields = count ? `<span data-part="fields">${`<span>${label}${bar}</span>`.repeat(count)}</span>` : "";
  const card = `<div>${cover ? '<span data-part="cover"></span>' : ""}${bar}${fields}</div>`;
  return `<div class="sf-data-view-skeleton-cards" data-card-size="${size}"${cover ? "" : " data-flat"}>${card.repeat(FIRST_PAINT_CARDS)}</div>`;
}

/***/ },

/***/ "dc0227f16aec"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListHead: () => (/* binding */ ListHead),
/* harmony export */   conditionActive: () => (/* binding */ conditionActive),
/* harmony export */   conditionCount: () => (/* binding */ conditionCount)
/* harmony export */ });
/* harmony import */ var _view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5ccd44f050bf");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_0__);
// The list head of sf-view (head="list"; owner decisions C297, C299, C300,
// C301; ui-control research 2026-11-17-list-head-filters, sections 5-7).
//
// The head by zones (owner C393, C394; ui-control views-switcher study,
// option D, VZ-1):
//   the title row  -- the list name only (the favourites star is the page
//                     header's, VS-10; the number of records is the footer's,
//                     C388);
//   the head row   -- what to do: the view toggle (a quiet view_quilt icon,
//                     first), «Filter» with its bookmark, the filter fields,
//                     «Clear», the search (up to 20rem), «Create» and the list
//                     menu «⋯» (only for those the host allows);
//   the view zone  -- below the head row in its own frame, opened and closed
//                     by the view toggle and remembered per person: the open
//                     view's name and menu (by level), the display kind,
//                     «Customize view» and «Changed» with save and reset.
// The toggle's name and tooltip say «View: <name>»; a dot says the view has
// changes not saved for everyone; it is tinted while a view other than the
// default is open; pressed while the zone is open.
// On a phone (the view narrower than 600 px, where the table turns into the
// compact list) the head row is the view toggle, «Filter», the search, «+»
// and «⋯»; the zone holds the name, a display-kind icon and «Customize view»;
// the filter fields are one row that scrolls sideways; every window is a
// bottom sheet (sf-drawer).
//
// Everything drawn is a SIMAI Framework part: sf-button, sf-button-icon,
// sf-segmented, sf-badge, sf-input, sf-popover, sf-drawer, sf-tabs,
// sf-checkbox, sf-radio, sf-icon and the shared menu (SF.menu.open). A filter
// field's window is the Framework's own filter template
// (SF.fieldRenderers.renderFilterField): the conditions of each type -- the
// date periods of C293, the money conditions of C294 -- are the pair's, not
// this file's.
//
// The state is the view's query: which fields are chosen
// (query.filters_chosen), their conditions (query.filters), the open saved
// filter (query.saved_filter), the view and its display kind (query.view) and
// the search. The head draws it and changes it through view.changeQuery; the
// host's echo is what the head shows next. The writes are the study's server
// objects (section 7) raised through the view's port -- filter.save,
// filter.update, filter.rename, filter.share, filter.default, filter.delete,
// settings.save -- a draft until the joint view-config/1
// contract settles the wire format (ui-control research
// 2026-11-17-views-architecture/view-config-1-draft.md).

const PHONE_WIDTH = 600; // An element's content box width: its border box less its inline padding and
// borders (0 where it draws no box, display: contents).

function contentWidth(element) {
  const width = element?.getBoundingClientRect?.().width || 0;
  if (!width) return 0;
  const style = globalThis.getComputedStyle?.(element);
  if (!style) return width;
  const less = ["paddingInlineStart", "paddingInlineEnd", "borderInlineStartWidth", "borderInlineEndWidth"].reduce((sum, key) => sum + (Number.parseFloat(style[key]) || 0), 0);
  return Math.max(0, width - less);
} // The width a head part takes on one line (view round 12, VHF-3 refined): a
// box laid out by itself is read as drawn; a display: contents host (every
// sf-button, sf-button-icon, sf-popover) has no box of its own, so its laid
// children are summed -- the hosts measured 0 and the one-row test came out
// about 200 px short. A line of parts is the parts and the gaps between them;
// the search counts at its 20rem (C297), whatever it is stretched to.


function lineWidth(container, search) {
  if (!container) return 0;
  const style = globalThis.getComputedStyle?.(container);
  const gap = Number.parseFloat(style?.columnGap) || 0;
  const items = [];

  const collect = node => {
    for (const child of node.children) {
      if (child.hidden) continue;
      const look = globalThis.getComputedStyle?.(child);
      if (!look || look.display === "none" || look.position === "absolute" || look.position === "fixed") continue;

      if (look.display === "contents") {
        collect(child);
        continue;
      }

      items.push(child);
    }
  };

  collect(container);
  let sum = 0;
  let count = 0;

  for (const item of items) {
    const width = item.matches?.(".sf-view-head-search") ? search : item.matches?.(".sf-view-head-start, .sf-view-head-end, .sf-view-head-fields") ? lineWidth(item, search) : item.getBoundingClientRect().width;
    if (!(width > 0)) continue;
    sum += width;
    count += 1;
  }

  return sum + gap * Math.max(0, count - 1);
} // One part's width on its line: its box, or its laid children where it draws
// none (display: contents).


function partWidth(node) {
  if (!node || node.hidden) return 0;
  const look = globalThis.getComputedStyle?.(node); // Out of the line: not drawn, or laid over it (a folded sf-segmented
  // keeps its buttons' group absolute beside the select it shows).

  if (look?.display === "none" || look?.position === "absolute" || look?.position === "fixed") return 0;
  if (look?.display !== "contents") return node.getBoundingClientRect().width;
  let sum = 0;
  let count = 0;

  for (const child of node.children) {
    const width = partWidth(child);

    if (width > 0) {
      sum += width;
      count += 1;
    }
  }

  const gap = Number.parseFloat(look?.columnGap) || 0;
  return sum + gap * Math.max(0, count - 1);
} // The display kinds' width on one line. sf-segmented folds itself into a
// select where its line has no room (data-sf-folded, its buttons still laid
// out, inert): the strip reads the buttons' line then, so the kinds fold into
// the strip's kind menu instead (VM-1) and do not squeeze the views button.


function kindsLineWidth(kinds) {
  if (!kinds?.hasAttribute?.("data-sf-folded")) return partWidth(kinds);
  const group = kinds.querySelector(".sf-button-group");
  const buttons = group ? [...group.querySelectorAll(":scope > button")].map(node => node.getBoundingClientRect()).filter(box => box.width > 0) : [];
  if (!buttons.length) return partWidth(kinds);
  const look = globalThis.getComputedStyle?.(group);
  const edges = ["paddingInlineStart", "paddingInlineEnd", "borderInlineStartWidth", "borderInlineEndWidth"].reduce((sum, key) => sum + (Number.parseFloat(look?.[key]) || 0), 0);
  return Math.max(...buttons.map(box => box.right)) - Math.min(...buttons.map(box => box.left)) + edges;
} // Whether the page's sheets hold the Framework's toggle look (see
// ListHead.toggleAppearance). Found once, it stays found; not found, it is
// asked again only when the page has more sheets than at the last look.


let toggleFound = false;
let toggleSheets = -1;

function frameworkToggle() {
  if (toggleFound) return true;
  const sheets = globalThis.document?.styleSheets;
  if (!sheets || sheets.length === toggleSheets) return false;
  toggleSheets = sheets.length;

  const holds = rules => {
    for (const rule of rules ?? []) {
      if (rule.selectorText?.includes("sf-icon-button--toggle")) return true;
      if (rule.cssRules && holds(rule.cssRules)) return true;
    }

    return false;
  };

  for (const sheet of sheets) {
    let rules = null;

    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }

    if (holds(rules)) return toggleFound = true;
  }

  return false;
}

let ZONE_IDS = 0;
const KINDS = {
  table: "table_rows",
  board: "view_kanban",
  cards: "grid_view",
  calendar: "calendar_month",
  list: "view_list",
  tree: "account_tree"
};
const LIST_TYPES = new Set(["choice", "choices", "multi-select", "single-select", "user", "boolean", "record", "relation", "lookup", "entity-multi-select", "entity-single-select", "file", "color"]);
const DATE_TYPES = new Set(["date", "datetime", "date-range", "period"]);

const esc = text => String(text ?? "").replace(/[&<>"']/gu, letter => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[letter]);

const copy = value => value == null ? value : JSON.parse(JSON.stringify(value));

const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null); // A field's type, from any of the names a host writes it under.


function fieldType(field) {
  return String(field?.filter?.control || field?.propertyType || field?.property_type || field?.type || field?.dataType || "text");
} // Whether a condition picks anything: a list with values, a value that is not
// empty, or an operator that needs none (a period carries its name; empty and
// not empty carry true).


function conditionActive(entry) {
  if (!entry || typeof entry !== "object") return false;
  if (Array.isArray(entry.values)) return entry.values.length > 0;
  const value = entry.value;
  if (Array.isArray(value)) return value.some(item => item !== "" && item != null);
  if (value === true || value === false) return true;
  return value !== undefined && value !== null && String(value).trim() !== "";
} // How many values a filter field has chosen (C300): the number of a list's
// values, else one.

function conditionCount(entry) {
  if (!conditionActive(entry)) return 0;
  return Array.isArray(entry.values) ? entry.values.length : 1;
}
class ListHead {
  // view: the sf-view; text(key): its words; raise(intent, payload): its port.
  constructor(view, {
    text,
    raise
  }) {
    this.view = view;
    this.text = text;
    this.raise = raise;
    this.description = null;
    this.mode = null;
    this.open = null;
    this.temp = {};
    this.optionSearch = {};
    this.tab = {
      filter: "saved"
    };
    this.root = null; // The view's width crossing the phone line rebuilds the head, which
    // changes the view's height inside its own observer: the rebuild waits
    // for the next frame, and the window said «ResizeObserver loop
    // completed with undelivered notifications» at every crossing (V5
    // note, review page 2026-11-24). The row is laid at once otherwise.

    this._onResize = () => {
      if (this._modeOf() === this.mode) return this._layRow();
      if (this._measureFrame) return;

      const later = globalThis.requestAnimationFrame ?? (run => globalThis.setTimeout(run, 16));

      this._measureFrame = later(() => {
        this._measureFrame = null;
        if (this.root?.isConnected) this._measure();
      });
    };

    this._onPartsResize = () => this._layRow();

    this._onHeadResize = () => this._layStick();
  } // ---------- lifecycle ----------


  attach() {
    if (this.root?.isConnected) return this;
    const root = this.view.querySelector(':scope > [slot="head"][data-sf-view-head]') ?? document.createElement("div");
    root.setAttribute("slot", "head");
    root.setAttribute("data-sf-view-head", "");
    root.className = "sf-view-head";
    if (!root.isConnected) this.view.prepend(root);
    this.root = root;
    root.addEventListener("click", event => this._onClick(event));
    root.addEventListener("input", event => this._onInput(event));
    root.addEventListener("keydown", event => this._onKey(event));
    root.addEventListener("change", event => this._onChange(event));
    root.addEventListener("sf-input-field-reset", event => this._onSearchReset(event));
    root.addEventListener("sf-popover-open", event => this._onPopoverOpen(event));
    root.addEventListener("sf-popover-closed", event => this._onPopoverClosed(event));
    root.addEventListener("sf-button-select", event => this._onCreateSelect(event));
    root.addEventListener("sf-button-press", event => this._onCreatePress(event)); // VL-89: on the phone the chip row scrolls sideways by touch; a mouse
    // wheel over it (a narrow desktop window) turns into the same sideways
    // scroll while the row has more to show, so every chip is reachable.

    root.addEventListener("wheel", event => this._onFieldsWheel(event), {
      passive: false
    });
    this._resize = typeof ResizeObserver === "function" ? new ResizeObserver(this._onResize) : null;
    this._resize?.observe(this.view);
    this._parts = typeof ResizeObserver === "function" ? new ResizeObserver(this._onPartsResize) : null;
    this._partsSeen = null;
    this._stick = typeof ResizeObserver === "function" ? new ResizeObserver(this._onHeadResize) : null;
    this._stick?.observe(root);

    this._measure();

    return this;
  } // What of the head holds the top while the list scrolls (C328, VHF-15):
  // all of it but the title row, which leaves. Written on the view's layout
  // in its shadow (the light DOM keeps its markup): the head part's sticky
  // offset, minus the title row and the gap under it, and the height that
  // stays, under which the table's head sticks. Read when the head changes
  // size, never while the list scrolls.


  _layStick() {
    const root = this.root;
    const layout = this.view.shadowRoot?.querySelector?.('[part="layout"]');
    if (!root || !layout) return;
    const title = root.querySelector(":scope > .sf-view-head-title");
    const titleHeight = title ? title.getBoundingClientRect().height : 0;
    const gap = Number.parseFloat(getComputedStyle(root).rowGap) || 0;
    const away = titleHeight > 0 ? Math.round(titleHeight + gap) : 0;
    const stays = Math.max(0, Math.round(root.getBoundingClientRect().height) - away);

    const set = (name, value) => {
      if (layout.style.getPropertyValue(name) !== value) layout.style.setProperty(name, value);
    };

    set("--sf-view--head-offset", `${-away}px`); // Under the page's fixed bar, where the Admin set's shell has one
    // (AN-3): the table's head sticks below it as the list head does.

    set("--sf-view--stuck-head", `calc(var(--sf-admin-shell-stick, 0px) + ${stays}px)`);
  }

  detach() {
    if (this._measureFrame) (globalThis.cancelAnimationFrame ?? globalThis.clearTimeout)(this._measureFrame);
    this._measureFrame = null;
    this._resize?.disconnect();
    this._kindsWatch?.disconnect();
    this._kindsWatched = null;
    this._resize = null;
    this._parts?.disconnect();
    this._parts = null;
    this._partsSeen = null;
    this._stick?.disconnect();
    this._stick = null;
    const layout = this.view.shadowRoot?.querySelector?.('[part="layout"]');
    layout?.style.removeProperty("--sf-view--head-offset");
    layout?.style.removeProperty("--sf-view--stuck-head");
    this.root?.remove();
    this.root = null;
    this.mode = null;
  } // The host's description of the list (the adapter's describe(), draft
  // view-config/1 section 2): fields, layouts, permissions; asked once per port.
  // The answer's promise is kept (described) for whoever needs the layouts
  // before acting: the view opening the person's last view.


  describe(port) {
    if (!port || this._describedPort === port) return this.described ?? Promise.resolve();
    this._describedPort = port;
    this.described = this._describe(port);
    return this.described;
  }

  async _describe(port) {
    let described = null;

    try {
      described = typeof port.describe === "function" ? await port.describe() : port.describe ?? null;
    } catch (error) {
      globalThis.console?.warn?.(`sf-view: the host's describe() failed; the head shows what the answers give (${error?.message ?? error}).`);
    }

    if (described && typeof described === "object") {
      this.description = copy(described);
      this.render();
    }
  } // The head answers to the width the list has, not to the view's box: a
  // record card docked beside the list pads the view by its own width
  // (data-sf-drawer-dock-host), and the head measured the whole box -- a
  // desktop head over a list the table had already turned into rows, in
  // what the card left of it (view round 12, VHF-5). The view's content
  // box is the list's own width, the one sf-view-table measures too.


  _modeOf() {
    const width = contentWidth(this.view) || globalThis.innerWidth || 0;
    return width > 0 && width < PHONE_WIDTH ? "phone" : "desktop";
  }

  _measure() {
    const mode = this._modeOf();

    if (mode !== this.mode) {
      this.mode = mode;

      this._build();
    }

    this._layRow();
  } // The head row has two states only (view round 12, VHF-3 refined, owner
  // remark via DEV msg-c31ccebd): everything on one row while «Filter», its
  // fields, the search at 20rem, «Create» and the menu fit; else two rows,
  // the search across the width on top with «Create» and the menu at its
  // end, «Filter» and the fields wrapping below. No third state (the search
  // alone at the end of a second row). The parts are watched, so a field
  // added or closed decides it again.


  _layRow() {
    const root = this.root;
    if (!root?.isConnected) return;
    const row = root.querySelector(":scope > .sf-view-head-row");
    const start = row?.querySelector(":scope > .sf-view-head-start");
    const end = row?.querySelector(":scope > .sf-view-head-end");

    if (this.mode !== "desktop" || !row || !start || !end) {
      root.removeAttribute("data-stacked");

      this._layZone();

      return;
    } // Each part is observed once (LV4-2): observing it again in the
    // observer's own callback fired the callback again at once, and the
    // head ran this ~57 times a second with "ResizeObserver loop" errors.


    if (this._parts) {
      const now = new Set([...row.querySelectorAll(".sf-view-head-join, .sf-view-head-fields > *, .sf-view-head-zone-toggle > *, .sf-view-head-create > *, .sf-view-head-more > *"), ...root.querySelectorAll(":scope > [data-zone] > .sf-view-head-zone-end, :scope > [data-zone] > :not(.sf-view-head-zone-end) button")]);
      const seen = this._partsSeen ??= new Set();

      for (const part of seen) if (!now.has(part)) {
        this._parts.unobserve(part);

        seen.delete(part);
      }

      for (const part of now) if (!seen.has(part)) {
        this._parts.observe(part);

        seen.add(part);
      }
    }

    const room = contentWidth(row);
    if (!(room > 0)) return;
    const rem = Number.parseFloat(globalThis.getComputedStyle?.(document.documentElement)?.fontSize) || 16;
    const search = 20 * rem;
    const gap = Number.parseFloat(globalThis.getComputedStyle?.(row)?.columnGap) || 0;
    const startWidth = lineWidth(start, search);
    const need = (startWidth > 0 ? startWidth + gap : 0) + lineWidth(end, search); // Half a pixel of rounding is not a reason to fold the row.

    const stacked = need > room + 0.5;
    if (stacked !== root.hasAttribute("data-stacked")) root.toggleAttribute("data-stacked", stacked);

    this._layZone();
  } // The view strip is one line (VM-1, view round 15): a record docked
  // beside the list narrows it, and the strip wrapped «Колонки» and «Вид»
  // to a second line, moving every row of the list down 40 px. Where the
  // display kinds no longer fit beside the rest, they fold into the strip's
  // kind menu (the icon of the kind shown, the kinds in its menu); they come
  // back once the strip has their room again. The strip keeps one line's
  // height either way (head.css, no wrap), so folding changes nothing
  // outside it. Only a strip that does not fit even folded may wrap.
  // Laid in the next frame (VM-2): folded inside the observers, the kinds'
  // sf-segmented answered being hidden in the same frame and the browser
  // reported a «ResizeObserver loop». The strip keeps its one line's height
  // meanwhile, so the frame between moves nothing below it.


  _layZone() {
    if (this._zoneFrame) return;

    const next = globalThis.requestAnimationFrame ?? (fn => globalThis.setTimeout(fn, 16));

    this._zoneFrame = next(() => {
      this._zoneFrame = null;
      if (this.root?.isConnected) this._layZoneNow();
    });
  }

  _layZoneNow() {
    const root = this.root;
    const zone = root?.querySelector?.(":scope > [data-zone]");
    if (!zone) return;
    const kinds = zone.querySelector(":scope > [data-kinds]");
    const menu = zone.querySelector(":scope > sf-button-icon.sf-view-head-kind-menu");
    const many = this.kinds.length > 1; // sf-segmented folds itself into a select a frame later, which no
    // size observed here shows: its mark (data-sf-folded) is watched.

    if (kinds && this._kindsWatched !== kinds && typeof MutationObserver === "function") {
      this._kindsWatch ??= new MutationObserver(() => this._layZone());

      this._kindsWatch.disconnect();

      this._kindsWatch.observe(kinds, {
        attributes: true,
        attributeFilter: ["data-sf-folded"]
      });

      this._kindsWatched = kinds;
    }

    if (this.mode !== "desktop" || !kinds || !menu || !many || zone.hidden) {
      zone.removeAttribute("data-wrap");
      if (this.mode !== "desktop" && this._kindsFolded) this._kindsFolded = false;
      return;
    }

    const room = contentWidth(zone);
    if (!(room > 0)) return;
    const gap = Number.parseFloat(globalThis.getComputedStyle?.(zone)?.columnGap) || 0; // The kinds' own width, read while they are drawn (shown for the read
    // where they are folded; no frame is drawn in between).

    const folded = this._kindsFolded === true; // The parts are read at their own widths: on one line the strip
    // shrinks them (the views button truncates) and the line would seem
    // to fit until sf-segmented folded itself a frame later, inside the
    // observers, in a loop (VM-2). The strip is laid at max-content for
    // the read and put back before anything is drawn or observed.

    const style = zone.getAttribute("style");
    zone.style.setProperty("contain", "none");
    zone.style.setProperty("inline-size", "max-content");
    zone.style.setProperty("max-inline-size", "none");
    if (folded) kinds.hidden = false;
    const kindsWidth = kindsLineWidth(kinds);
    if (folded) kinds.hidden = true;
    const line = lineWidth(zone, 0);
    const menuWidth = partWidth(menu); // Unfolded, the line holds the kinds as drawn (a select, where
    // sf-segmented folded itself): their own line replaces that.

    const drawn = folded ? 0 : partWidth(kinds);
    if (style === null) zone.removeAttribute("style");else zone.setAttribute("style", style);
    const open = folded ? line - menuWidth + kindsWidth : line - drawn + kindsWidth;
    const shut = folded ? line : line - drawn + menuWidth; // sf-segmented folding itself says the kinds do not fit (it keeps
    // a margin of its own); folded, they come back only with a margin
    // of a space step, so the two never hand the line back and forth.

    const selfFolded = !folded && kinds.hasAttribute("data-sf-folded");
    const fold = selfFolded || (folded ? open > room - 16 : open > room + 0.5);

    if (fold !== folded) {
      this._kindsFolded = fold;
      kinds.hidden = fold;
      menu.hidden = !fold;
    }

    const wrap = fold && shut > room + 0.5;
    if (wrap !== zone.hasAttribute("data-wrap")) zone.toggleAttribute("data-wrap", wrap);
  } // Whether the head row stays one row in a list `less` px narrower than
  // now (RV4-3: a record card docked beside the list takes its width). False
  // when the row is already two rows, or on a phone head.


  fitsNarrower(less) {
    const row = this.root?.querySelector?.(":scope > .sf-view-head-row");
    const start = row?.querySelector(":scope > .sf-view-head-start");
    const end = row?.querySelector(":scope > .sf-view-head-end");
    if (this.mode !== "desktop" || !row || !start || !end || this.root.hasAttribute("data-stacked")) return false;
    const room = contentWidth(row) - less;
    const rem = Number.parseFloat(globalThis.getComputedStyle?.(document.documentElement)?.fontSize) || 16;
    const gap = Number.parseFloat(globalThis.getComputedStyle?.(row)?.columnGap) || 0;
    const startWidth = lineWidth(start, 20 * rem);
    const need = (startWidth > 0 ? startWidth + gap : 0) + lineWidth(end, 20 * rem);
    return room > 0 && need <= room + 0.5;
  } // ---------- what the head knows ----------


  get size() {
    return this.view.controlSize || "1/2";
  }

  get query() {
    return this.view.query ?? {};
  }

  get permissions() {
    return this.description?.permissions ?? {};
  } // The fields a filter can use: the host's description, else the fields the
  // host gave its table (sf-view-table filterFields), else nothing.


  get fields() {
    const described = Array.isArray(this.description?.fields) ? this.description.fields : null;
    const list = described ?? this.table?.filterFields ?? [];
    return list.filter(field => field && field.key && field.filter !== false && field.filter?.enabled !== false).map(field => ({ ...field,
      label: field.label ?? field.name ?? field.key
    }));
  }

  field(key) {
    return this.fields.find(field => field.key === key) ?? null;
  } // The list's table: the one the view draws, or the page's own while a
  // board is drawn instead (sf-view parks it with its filter fields and
  // create items).


  get table() {
    return this.view.table ?? this.view.querySelector?.(":scope > sf-view-table[data-sf-view-parked]") ?? null;
  } // The display kinds the host enables (describe().layouts), table first;
  // a kind whose layout is not in the running set is hidden, not shown
  // disabled (VR3-1, DEV's decision).


  get kinds() {
    const asked = Array.isArray(this.description?.layouts) ? this.description.layouts.map(String) : [];
    const kinds = asked.filter(kind => Object.hasOwn(KINDS, kind) && this.drawable(kind));
    return kinds.length ? kinds : ["table"];
  } // The kind on screen: what the view draws, however it got there -- a page
  // that wrote layout="board", view.switchLayout(), a press here (V5, DEV
  // 2026-11-24: layout="board" drew the board with «Таблица» checked, and
  // pressing «Таблица» did nothing). The query's kind only when the view
  // draws none the head offers.


  get kind() {
    const drawn = this.view.layoutKind;
    if (this.kinds.includes(drawn)) return drawn;
    const asked = this.query.view?.type;
    return this.kinds.includes(asked) ? asked : this.kinds[0];
  } // Whether the view draws a kind in this page (its layout in the running set).


  drawable(kind) {
    return typeof this.view.canDrawLayout !== "function" || this.view.canDrawLayout(kind);
  }

  kindLabel(kind) {
    return this.text(`headKind${kind[0].toUpperCase()}${kind.slice(1)}`);
  }

  get savedFilters() {
    return Array.isArray(this.view.savedFilters) ? this.view.savedFilters : [];
  }

  get savedViews() {
    return Array.isArray(this.view.savedViews) ? this.view.savedViews : [];
  }

  savedFilter(id) {
    return this.savedFilters.find(item => String(item?.id) === String(id)) ?? null;
  }

  get openFilter() {
    return this.query.saved_filter ? this.savedFilter(this.query.saved_filter) : null;
  }

  get defaultFilterId() {
    const marked = this.savedFilters.find(item => item?.default_for || item?.default === true);
    return marked ? String(marked.id) : null;
  } // The filter fields on screen: the query's (the host's echo, or the
  // person's choice), else the open view's own set (VS-8: a view keeps its
  // filter fields, settings.filter_fields; views study head.filter_fields)
  // with every field a condition is set on, else the fields with a condition.


  get chosen() {
    const asked = Array.isArray(this.query.filters_chosen) ? this.query.filters_chosen.map(String) : null;
    const set = Object.keys(this.query.filters ?? {});
    const saved = this.viewFilterFields(this.openView);
    const keys = asked ?? (saved ? [...saved, ...set.filter(key => !saved.includes(key))] : set);
    return keys.filter(key => this.field(key));
  } // The view on screen: the query's, else the default one.


  get openView() {
    return this.query.view?.id ? this.currentView : this.defaultView;
  } // A view's own filter fields (settings.filter_fields), or null where it keeps none.


  viewFilterFields(view) {
    const fields = view?.settings?.filter_fields;
    return Array.isArray(fields) ? fields.filter(key => typeof key === "string") : null;
  }

  get filters() {
    return this.query.filters ?? {};
  }

  get anyCondition() {
    return this.chosen.some(key => this._active(key, this.filters[key]));
  } // The Framework's filter window (C310, FO-5): SF.fieldRenderers.filterWindow
  // {open, summary} where the pair carries it; without it the head's own
  // window (the filter template in a popover) as before.


  get filterWindow() {
    const api = globalThis.SF?.fieldRenderers?.filterWindow;
    return typeof api?.open === "function" && typeof api?.summary === "function" ? api : null;
  } // A field as the filter window reads it: a list's options in filter.options.


  _windowField(field) {
    return LIST_TYPES.has(fieldType(field)) && !field.filter?.options && !field.options && !field.filter?.optionsSource?.items ? { ...field,
      filter: { ...(field.filter ?? {}),
        options: this._options(field)
      }
    } : field;
  } // What a filter field button shows (C300, C310): the window's summary where
  // the pair has it -- colour while active, the number only above 0, the
  // words in the tooltip -- else the head's own count and words.


  _summary(key, entry) {
    const field = this.field(key);
    const api = this.filterWindow;

    if (api && field) {
      try {
        const answer = api.summary(this._windowField(field), entry ?? {});

        if (answer && typeof answer === "object") {
          const count = Number.isSafeInteger(answer.count) && answer.count > 0 ? answer.count : 0;
          return {
            active: answer.active === true,
            count,
            words: String(answer.words ?? "")
          };
        }
      } catch {// the summary is the pair's; the head's own words follow
      }
    }

    const count = conditionCount(entry);
    return {
      active: count > 0,
      count,
      words: count ? this._conditionWords(field, entry) : ""
    };
  }

  _active(key, entry) {
    return this.filterWindow ? this._summary(key, entry).active : conditionActive(entry);
  } // The open saved filter's conditions differ from what is on screen.


  get changed() {
    const open = this.openFilter;
    if (!open) return false;

    const active = filters => Object.fromEntries(Object.entries(filters ?? {}).filter(([, entry]) => conditionActive(entry)));

    return !same(active(open.filters), active(this.filters)) || !same(open.fields ?? [], this.chosen);
  }

  get currentView() {
    const id = this.query.view?.id;
    return this.savedViews.find(view => view?.key === id) ?? this.savedViews[0] ?? null;
  }

  get createItems() {
    const items = this.table?.createItems;
    return Array.isArray(items) ? items : [];
  }

  get creatable() {
    return this.view.hostOffers("create-record") && this.view._queryRefused !== true;
  }

  get listMenu() {
    const allowed = this.permissions;
    return [allowed.record_fields ? {
      id: "record-fields",
      text: this.text("headRecordFields"),
      icon: "list_alt"
    } : null, allowed.rights ? {
      id: "rights",
      text: this.text("headRights"),
      icon: "lock"
    } : null, allowed.export ? {
      id: "export",
      text: this.text("headExport"),
      icon: "download"
    } : null].filter(Boolean);
  } // ---------- drawing ----------
  // The rows, once per mode; render() fills them.


  _build() {
    if (!this.root) return;

    this._closeAll();

    const size = esc(this.size);
    const phone = this.mode === "phone";
    const outline = 'appearance="outline" scheme="on-surface"';

    const pop = (name, placement, trigger) => `<sf-popover data-pop="${name}" placement="${placement}" width="22rem" offset="var(--sf-space-1\\/4)">${trigger}<div slot="content" data-body></div></sf-popover>`;

    this.root.toggleAttribute("data-phone", phone); // The view zone's place in the head is one block (zone below the head
    // row); its toggle is the first part of the head row. Option D's
    // placement waits one owner confirmation: moving the toggle to the end
    // of the row is the order of these two strings.

    const toggle = `<sf-button-icon class="sf-view-head-zone-toggle" data-zone-toggle size="${size}" appearance="ghost" scheme="on-surface" icon="view_quilt" aria-controls="" hidden></sf-button-icon>`; // The owner's data menu is «⋯» (C407), not more_vert.

    const more = `<sf-button-icon class="sf-view-head-more" data-list-menu size="${size}" appearance="outline" scheme="on-surface" icon="more_horiz" aria-haspopup="menu" hidden></sf-button-icon>`; // VL-80 (DEV decision): a view that differs from what is saved shows
    // «Сохранить» where «Изменено» stood; it opens the ways out (save for
    // everyone where allowed, «Сохранить как новое», «Сбросить
    // изменения»). Nothing is shown while the view is as saved.

    const changed = pop("state", "bottom-start", `<sf-button slot="trigger" class="sf-view-head-changed" size="${size}" appearance="outline" scheme="primary" icon-start="save" icon-end="expand_more" aria-haspopup="dialog"></sf-button>`);
    this.root.innerHTML = phone ? `<div class="sf-view-head-title" data-title>
                 <h2 class="sf-view-head-name"><span data-name></span></h2>
               </div>
               <div class="sf-view-head-row">
                 ${toggle}
                 <sf-button-icon class="sf-view-head-filter-icon" data-head-open="filter" size="${size}" icon="filter_list"></sf-button-icon>
                 <div class="sf-view-head-search"><sf-input data-search appearance="bordered" size="${size}" icon-start="search" input-type="search" clearable></sf-input></div>
                 <sf-button-icon class="sf-view-head-create" data-create size="${size}" icon="add" aria-haspopup="menu" hidden></sf-button-icon>
                 ${more}
               </div>
               <div class="sf-view-head-fields" data-fields hidden></div>
               <div class="sf-view-head-zone" data-zone hidden>
                 <sf-button class="sf-view-head-views" data-views size="${size}" appearance="ghost" scheme="on-surface" icon-start="bookmarks" icon-end="expand_more" aria-haspopup="menu"></sf-button>
                 <sf-button-icon class="sf-view-head-kind-menu" data-kind-menu size="${size}" appearance="ghost" scheme="on-surface" icon="table_rows" aria-haspopup="menu"></sf-button-icon>
                 <sf-button-icon class="sf-view-head-tune sf-view-head-look" data-look size="${size}" appearance="ghost" scheme="on-surface" icon="tune" aria-haspopup="menu"></sf-button-icon>
                 <sf-button-icon class="sf-view-head-columns" data-columns size="${size}" appearance="ghost" scheme="on-surface" icon="view_column" aria-haspopup="dialog"></sf-button-icon>
                 <sf-button class="sf-view-head-changed" data-head-open="state" size="${size}" appearance="outline" scheme="primary" icon-start="save" icon-end="expand_more" aria-haspopup="dialog" hidden></sf-button>
               </div>
               <sf-drawer data-sheet data-sf-role="head-sheet" placement="bottom"><div slot="content" data-body></div></sf-drawer>` : `<div class="sf-view-head-title" data-title>
                 <h2 class="sf-view-head-name"><span data-name></span></h2>
               </div>
               <div class="sf-view-head-row">
                 <div class="sf-view-head-start">
                   ${toggle}
                   <div class="sf-view-head-join" data-filter-group>
                     ${pop("filter", "bottom-start", `<sf-button slot="trigger" class="sf-view-head-filter" size="${size}" segment="start" icon-start="filter_list"></sf-button>`)}
                     ${pop("save", "bottom-start", `<sf-button-icon slot="trigger" class="sf-view-head-save" size="${size}" segment="end" icon="bookmark_add"></sf-button-icon>`)}
                   </div>
                   <div class="sf-view-head-fields" data-fields></div>
                 </div>
                 <div class="sf-view-head-end">
                   <div class="sf-view-head-search"><sf-input data-search appearance="bordered" size="${size}" icon-start="search" input-type="search" clearable></sf-input></div>
                   <sf-button class="sf-view-head-create" size="${size}" icon-start="add" hidden></sf-button>
                   ${more}
                 </div>
               </div>
               <div class="sf-view-head-zone" data-zone hidden>
                 <sf-button class="sf-view-head-views" data-views size="${size}" appearance="ghost" scheme="on-surface" icon-start="bookmarks" icon-end="expand_more" aria-haspopup="menu"></sf-button>
                 <span class="sf-view-head-zone-line" data-zone-line aria-hidden="true"></span>
                 <sf-segmented data-kinds size="${size}" hidden></sf-segmented>
                 <sf-button-icon class="sf-view-head-kind-menu" data-kind-menu size="${size}" appearance="ghost" scheme="on-surface" icon="table_rows" aria-haspopup="menu" hidden></sf-button-icon>
                 ${changed}
                 <div class="sf-view-head-zone-end" data-zone-end>
                   <sf-button class="sf-view-head-columns" data-columns size="${size}" appearance="ghost" scheme="on-surface" icon-start="view_column" aria-haspopup="dialog"></sf-button>
                   <sf-button class="sf-view-head-look" data-look size="${size}" appearance="ghost" scheme="on-surface" icon-start="tune" aria-haspopup="menu"></sf-button>
                 </div>
               </div>`;
    const zone = this.root.querySelector("[data-zone]");
    zone.id = `sf-view-head-zone-${++ZONE_IDS}`; // «Вид» (C405): SIMAI Framework sf-settings in its drill look, the
    // shown display kind's own rows, each applied at once. It opens
    // against the «Вид» button (for=), in the head's light DOM.

    const lookTrigger = this.root.querySelector(".sf-view-head-look");
    if (lookTrigger) lookTrigger.id = `sf-view-head-look-${ZONE_IDS}`;
    const lookMenu = document.createElement("sf-settings");
    lookMenu.setAttribute("look", "drill");
    lookMenu.setAttribute("data-look-menu", "");
    lookMenu.setAttribute("size", this.size);
    if (lookTrigger) lookMenu.setAttribute("for", lookTrigger.id);
    lookMenu.addEventListener("sf-settings-changed", event => this._onLookChanged(event));

    for (const name of ["sf-settings-change", "sf-settings-open", "sf-settings-opened", "sf-settings-close", "sf-settings-closed"]) {
      lookMenu.addEventListener(name, event => event.stopPropagation());
    }

    this.root.append(lookMenu);
    this._lookMenu = lookMenu;
    this._lookKey = null;
    this.root.querySelector("sf-button-icon.sf-view-head-zone-toggle")?.setAttribute("aria-controls", zone.id); // The windows' drawers carry a role (data-sf-role): their path ids are
    // then sf-view's own (…/head-sheet). Counted among the
    // page's drawers by document order, the head's first drawer took the
    // id sf-drawer-1 that the record card's drawer already had, and the two
    // shared a portal -- with a record card on the page every head window
    // drew inside the head (VR2-4).
    // A body moves with its window (sf-drawer takes its content out of the
    // host), so each body listens for itself.

    for (const body of this.root.querySelectorAll("[data-body]")) this._bindBody(body); // sf-drawer renders its content into a portal: keep the bodies now.


    this._sheetBody = this.root.querySelector("sf-drawer[data-sheet] [data-body]");
    this._fieldsKey = null;
    this.render();
  }

  render() {
    const root = this.root;
    if (!root || !this.mode) return;
    const phone = this.mode === "phone";
    const refused = this.view._queryRefused === true;
    root.hidden = !this.view.renders("toolbar");

    const one = selector => root.querySelector(selector);

    const set = (node, name, value) => {
      if (!node) return;
      if (value === null || value === undefined || value === false) node.removeAttribute(name);else if (node.getAttribute(name) !== String(value)) node.setAttribute(name, String(value));
    }; // The title row: the name only (the count is the footer's, C388).


    const name = this.view.getAttribute("heading") || this.view.getAttribute("aria-label") || "";
    const nameNode = one("[data-name]");
    if (nameNode && nameNode.textContent !== name) nameNode.textContent = name;
    const listMenu = one(".sf-view-head-more");
    set(listMenu, "hidden", this.listMenu.length ? null : "");
    set(listMenu, "aria-label", this.text("headListMenu"));

    this._renderZone(one, set); // The head row.


    const open = this.openFilter;
    const dot = this.changed ? " •" : ""; // C301 (2), VL-49: the open saved filter is named, the default one too.

    const filterName = open ? String(open.name ?? "") : "";
    const filterText = filterName ? this.text("headFilterNamed").replace("{name}", filterName) : this.text("headFilter");
    const filterTitle = filterName ? `${filterText}${dot ? ` ${this.text("headFilterChanged")}` : ""}` : null; // «Filter» is outline; with conditions set it is toned (C301 (3)).

    const look = this.anyCondition ? {
      appearance: "tonal",
      scheme: "primary"
    } : {
      appearance: "outline",
      scheme: "on-surface"
    };

    for (const node of [one(".sf-view-head-filter"), one(".sf-view-head-save"), one(".sf-view-head-filter-icon")]) {
      set(node, "appearance", look.appearance);
      set(node, "scheme", look.scheme);
    }

    const filterButton = one(".sf-view-head-filter");

    this._truncate(filterButton, "min(22rem, 40vw)");

    set(filterButton, "text", `${filterText}${dot}`);
    set(filterButton, "title", filterTitle);
    set(one(".sf-view-head-filter-icon"), "aria-label", filterName ? filterText : this.text("headFilter"));
    set(one(".sf-view-head-save"), "aria-label", this.text("headSaveFilter"));

    for (const node of root.querySelectorAll(".sf-view-head-filter, .sf-view-head-save, .sf-view-head-filter-icon")) set(node, "disabled", refused ? "" : null);

    const search = one("[data-search]");
    set(search, "placeholder", this.text("headSearch"));
    set(search, "aria-label", this.view.getAttribute("aria-label") ? `${this.text("headSearch")}: ${this.view.getAttribute("aria-label")}` : this.text("headSearch"));
    set(search, "disabled", refused ? "" : null);
    const typed = String(this.query.search ?? "");
    if (search && !search.contains(document.activeElement) && (search.value ?? "") !== typed) search.value = typed; // The data menu's look (LV3-9): outline by default, the height and
    // frame of the search and «Создать»; the view's head.menu tonal or ghost.

    const menuLook = String(this.view.viewConfig?.head?.menu ?? "").trim();
    set(one(".sf-view-head-more"), "appearance", ["outline", "tonal", "ghost"].includes(menuLook) ? menuLook : "outline");
    const create = one(".sf-view-head-create");
    set(create, "hidden", this.creatable ? null : "");
    set(create, phone ? "aria-label" : "text", this.text("headCreate"));

    if (!phone) {
      // Only «Create» is filled (C301 (3)); its other items are its split menu.
      const items = this.createItems;
      const menu = items.map(item => ({
        id: String(item.id),
        text: String(item.name ?? item.label ?? item.id),
        icon: item.icon ?? "add"
      }));
      set(create, "split", menu.length > 1 ? "" : null);
      set(create, "menu", menu.length > 1 ? JSON.stringify(menu.slice(1)) : null);
    } // The parts a host switched off (VR5): search, «Фильтр» with its
    // bookmark and fields, «Настроить вид». A row left with nothing in
    // it goes too, so no empty band stays (no gap).


    const filterShown = this.filterShown;
    set(one(".sf-view-head-search"), "hidden", this.view.renders("search") ? null : "");
    set(one("[data-filter-group]"), "hidden", filterShown ? null : "");
    set(one(".sf-view-head-filter-icon"), "hidden", filterShown ? null : "");
    const lookShown = this.view.renders("look");

    for (const node of root.querySelectorAll(".sf-view-head-look")) set(node, "hidden", lookShown ? null : "");

    if (!lookShown) this._lookMenu?.close?.();

    this._renderLook(one, set, lookShown);

    this._renderFields();

    const row = one(":scope > .sf-view-head-row");

    if (row) {
      const parts = [...row.querySelectorAll(".sf-view-head-zone-toggle, [data-filter-group], .sf-view-head-filter-icon, .sf-view-head-fields, .sf-view-head-search, .sf-view-head-create, .sf-view-head-more")];
      const filled = parts.some(node => !node.hidden && !(node.matches(".sf-view-head-fields") && !node.firstElementChild));
      set(row, "hidden", filled ? null : "");
    }

    this._layRow(); // An open window shows the state it was opened over.


    if (this.open && !this.open.kind.startsWith("value:") && this.open.kind !== "save" && !this.open.kind.startsWith("rename:")) this._renderOpen();
  } // ---------- the view zone (VZ-1, option D) ----------
  // Whether the zone has anything to show: saved views, more than one
  // display kind, or a view the person can customize (always: «Customize
  // view» is there for every kind).


  get zoneOpen() {
    if (this._zoneOpen === undefined) this._zoneOpen = this.view.keptPreferences?.viewZone === true;
    return this._zoneOpen;
  } // The person's layer arrived from the host (port 1.16.0 preferences): the
  // zone follows it, unless the person has already opened or closed it here.


  keptChanged() {
    if (this._zoneTouched) return;
    this._zoneOpen = undefined;
    this.render();
  }

  _setZoneOpen(open) {
    this._zoneTouched = true;
    this._zoneOpen = Boolean(open); // Remembered per person the way the page size is: the host's
    // personal layer where it offers one (port 1.16.0,
    // personal-preferences), else SF.Preferences under preferences-key.

    this.view._keepPreference?.({
      viewZone: this._zoneOpen
    });
    if (!this._zoneOpen && this.open?.kind === "state") this._closeOpen();
    if (!this._zoneOpen) this._lookMenu?.close?.();
    this.render();
    if (this._zoneOpen) this.root?.querySelector("[data-zone]")?.focus?.({
      preventScroll: true
    });
  } // The view the list opened with: the one the host marks default, else the first.


  get defaultView() {
    return this.savedViews.find(view => view?.default === true || view?.is_default === true) ?? this.savedViews[0] ?? null;
  } // The open view: the query's, else the default (currentView keeps the
  // first view when none is named, as the views menu always did).


  get openViewIsDefault() {
    const id = this.query.view?.id;
    return id === null || id === undefined || id === "" || String(id) === String(this.defaultView?.key ?? "");
  }

  viewLevel(view) {
    const level = String(view?.level ?? view?.kind ?? ""); // package is simai.dataview-port 1.15.0's name of system, read as
    // system until 2027-01-01 (port 1.16.0, journal
    // value-dataview-saved-view-level-package-to-system).

    if (level === "system" || level === "package") return "system";
    if (level === "personal" || level === "own" || view?.mine === true) return "personal";
    if (level === "shared" || level === "all") return "shared";
    return "";
  } // The open view differs from what is saved for everyone: its filters, its
  // display kind, or a setting the person changed here (C298: a personal
  // change applies at once and is saved only for them). A personal view
  // saves at once and is never «changed».


  get viewChanged() {
    const view = this.currentView;
    if (!view || this.viewLevel(view) === "personal") return false;
    if (this._settings && Object.values(this._settings).some(entry => entry && Object.keys(entry).length)) return true; // The conditions are not the view's (owner decision C414): a view
    // keeps the look, the conditions are the filter's, so choosing a
    // saved filter or a condition leaves the view as it is (it showed
    // «Изменено», and saving then stored the view without them).
    // Its filter fields: a field added or taken away is a change (VS-8).

    const fields = this.viewFilterFields(view);
    if (fields && !same(fields.filter(key => this.field(key)).sort(), [...this.chosen].sort())) return true;
    const layout = this.viewKind(view);
    return typeof layout === "string" && this.kinds.includes(layout) && layout !== this.kind;
  } // The display kind a view stands for: the one it was saved with, else the
  // kind of the list as stored -- the layout the page wrote on the view, else
  // the first the host names (view round 10, V10-3: a system view that names
  // no layout got «Изменено» after a filter change and not after a change of
  // the display kind). View round 11: not the kind the list showed when the
  // head first looked at it -- a personal state restored before that (the
  // host's echo of the person's last kind, a kept layer) became the
  // baseline, and a list the person had turned into a board read as the
  // stored view.


  viewKind(view) {
    const own = view?.settings?.layout ?? view?.layout;
    if (typeof own === "string" && own) return own;
    return this.storedKind;
  }

  get storedKind() {
    const written = this.view.pageLayoutKind ?? this.view.layoutKind;
    return this.kinds.includes(written) ? written : this.kinds[0];
  }

  get zoneUseful() {
    // «Настроить вид» (a described list) and the column settings live
    // in the zone: switched off by chrome (look, VR5-5), they keep no
    // toggle that would open an empty zone.
    const look = this.view.renders("look");
    return this.savedViews.length > 0 || this.view.hostOffers("saved-views") || this.kinds.length > 1 || look && (this.view.hostOffers("personal-column-settings") || Boolean(this.description));
  } // The toggle look of SIMAI Framework (TG-1, C393: the background and a
  // 1 px ring, the icon outline): sf-button-icon appearance="toggle"
  // (sf-button-icon 1.14.0, icon-buttons 1.20.0, class sf-icon-button--toggle).
  // A pair without it would draw the unknown look as the default fill, so
  // the head asks the page's sheets for the class rule; without it the head
  // draws the same look with the same tokens itself (head.css,
  // .sf-view-head-zone-toggle--own, to be removed once every supported pair
  // carries the toggle look).


  get toggleAppearance() {
    return frameworkToggle() ? "toggle" : null;
  }

  _renderZone(one, set) {
    // sf-button-icon hands its data-* to the button it draws: the host by its class.
    const toggle = one("sf-button-icon.sf-view-head-zone-toggle");
    const zone = one("[data-zone]");
    const useful = this.zoneUseful;
    const open = useful && this.zoneOpen;
    const current = this.currentView;
    const viewName = String(current?.label ?? current?.name ?? "");
    const changed = this.viewChanged;

    if (toggle) {
      set(toggle, "hidden", useful ? null : "");
      const label = viewName ? this.text("headViewZone").replace("{name}", viewName) : this.text("headViewZoneNone"); // The dot's words are said by the badge (badge-label) after the name.

      set(toggle, "aria-label", label);
      const framework = this.toggleAppearance; // Over a pair without the toggle look the button is a disclosure
      // (aria-expanded) and draws its open look itself (head.css
      // --open): a pressed sf-button-icon fills its glyph, and an icon
      // font subset without the filled view_quilt (the Docara site's
      // icon catalogue) drew an empty tinted square (R8-3). The glyph
      // stays outlined in both states, as TG-1 asks.

      set(toggle, "label-pressed", framework ? label : null);
      set(toggle, "pressed", framework ? open ? "true" : "false" : null);
      set(toggle, "aria-expanded", open ? "true" : "false");
      toggle.classList.toggle("sf-view-head-zone-toggle--open", Boolean(open && !framework));
      set(toggle, "badge-dot", changed ? "" : null);
      set(toggle, "badge-label", changed ? this.text("headViewUnsaved") : null); // Tinted while a view other than the default is open: the glyph
      // in primary (head.css). The scheme stays on-surface: the pressed
      // look is a neutral toggle's only (C211 (1)).

      toggle.classList.toggle("sf-view-head-zone-toggle--tinted", !this.openViewIsDefault);
      set(toggle, "appearance", framework ?? "ghost");
      toggle.classList.toggle("sf-view-head-zone-toggle--own", !framework);
    }

    if (!zone) return;
    set(zone, "hidden", open ? null : "");
    set(zone, "role", "group");
    set(zone, "tabindex", "-1");
    set(zone, "aria-label", viewName ? this.text("headViewZone").replace("{name}", viewName) : this.text("headViewZoneNone"));
    const views = one(".sf-view-head-views");
    set(views, "hidden", this.savedViews.length || this.view.hostOffers("saved-views") ? null : "");
    set(views, "text", viewName || this.text("headViews"));
    set(views, "title", viewName ? this.text("headViewZone").replace("{name}", viewName) : this.text("headViews"));
    set(views, "icon-start", {
      system: "bookmarks",
      shared: "group",
      personal: "person"
    }[this.viewLevel(current)] ?? "bookmarks");

    this._truncate(views, "min(22rem, 40vw)");

    const kinds = one("[data-kinds]");

    if (kinds) {
      const items = this.kinds.map(kind => ({
        id: kind,
        value: kind,
        label: this.kindLabel(kind),
        icon: KINDS[kind]
      })); // Folded into the kind menu where the strip has no room (VM-1).

      set(kinds, "hidden", items.length > 1 && !(this.mode === "desktop" && this._kindsFolded) ? null : "");
      set(kinds, "items", JSON.stringify(items));
      set(kinds, "value", this.kind);
      set(kinds, "aria-label", this.text("headDisplay"));
    }

    const kindMenu = one(".sf-view-head-kind-menu");
    set(kindMenu, "icon", KINDS[this.kind]);
    set(kindMenu, "hidden", this.kinds.length > 1 && (this.mode !== "desktop" || this._kindsFolded) ? null : "");
    const kindsShown = kinds && !kinds.hasAttribute("hidden") || kindMenu && !kindMenu.hasAttribute("hidden");
    set(one("[data-zone-line]"), "hidden", views?.hasAttribute("hidden") || !kindsShown ? "" : null);
    set(kindMenu, "aria-label", `${this.text("headDisplay")}: ${this.kindLabel(this.kind)}`);

    for (const node of this.root.querySelectorAll(".sf-view-head-changed")) {
      const host = node.closest("sf-popover[data-pop]") ?? node;
      set(host, "hidden", changed ? null : "");
      set(node, "text", this.text("headViewChanged"));
      set(node, "title", this.text("headViewState"));
    }
  } // The filter fields (C300): a joined sf-button + sf-button-icon per chosen
  // field -- the name, colour when a condition is set, the number of values
  // chosen; the condition in words only in its tooltip and its window.
  // Whether «Фильтр» is drawn (VR5-2): the host can switch it off (chrome
  // or head.chrome without filter), and it goes by itself when the host
  // describes no field to filter by -- the button opened an empty window.


  get filterShown() {
    return this.view.renders("filter") && this.fields.length > 0;
  }

  _renderFields() {
    const box = this.root?.querySelector("[data-fields]");
    if (!box) return;

    if (!this.filterShown) {
      box.hidden = true;
      if (box.firstChild) box.replaceChildren();
      this._fieldsKey = null;
      return;
    }

    const phone = this.mode === "phone";
    const size = esc(this.size);
    const open = this.openFilter; // C301 (2), VL-49: the open saved filter is named, the default one too.

    const filterName = open ? String(open.name ?? "") : "";
    const api = this.filterWindow; // The Framework's filter window comes with the field renderers, which
    // may load after the head: the fields are drawn again once they are in.

    if (!api && !this._renderersAsked && typeof globalThis.SF?.whenFieldRenderers === "function") {
      this._renderersAsked = true;
      Promise.resolve(globalThis.SF.whenFieldRenderers()).then(() => {
        if (this.filterWindow && this.root?.isConnected) this._renderFields();
      }).catch(() => {});
    }

    const key = JSON.stringify([Boolean(api), this.chosen, this.chosen.map(name => this.filters[name] ?? null), filterName, this.changed, this.mode, this.text("headClear")]);
    if (key === this._fieldsKey) return; // A field's window that is open stays open: it is redrawn when it closes.

    if (this.open?.kind?.startsWith("value:") && !phone) {
      this._fieldsDirty = true;
      return;
    }

    this._fieldsKey = key;
    this._fieldsDirty = false;
    const parts = [];

    if (phone && filterName) {
      const dot = this.changed ? " •" : "";
      parts.push(`<sf-button class="sf-view-head-filter-name" data-head-open="filter" size="${size}" appearance="ghost" scheme="primary" icon-start="bookmark" text="${esc(filterName + dot)}" title="${esc(this.text("headFilterNamed").replace("{name}", filterName))}"></sf-button>`);
    }

    for (const name of this.chosen) {
      const field = this.field(name);

      const {
        active,
        count,
        words
      } = this._summary(name, this.filters[name]);

      const look = `appearance="tonal" scheme="${active ? "primary" : "on-surface"}"`;
      const title = active && words ? `${field.label}: ${words}` : ""; // With the Framework's window the button opens it itself (on the
      // body, a bottom sheet on a phone); else the head's own popover.

      const own = phone || api;
      const button = `<sf-button ${own ? "" : 'slot="trigger" '}data-field="${esc(name)}" size="${size}" segment="start" ${look} text="${esc(count ? `${field.label} ${count}` : field.label)}"${title ? ` title="${esc(title)}"` : ""}${api ? ' aria-haspopup="dialog"' : ""}></sf-button>`;
      const remove = `<sf-button-icon data-unchoose="${esc(name)}" size="${size}" segment="end" icon="close" ${look} aria-label="${esc(this.text("headRemoveField").replace("{name}", field.label))}"></sf-button-icon>`;
      parts.push(`<div class="sf-view-head-join">${own ? button : `<sf-popover data-pop="value:${esc(name)}" placement="bottom-start" width="20rem" offset="var(--sf-space-1\\/4)">${button}<div slot="content" data-body></div></sf-popover>`}${remove}</div>`);
    }

    if (this.anyCondition) parts.push(`<sf-button data-clear size="${size}" appearance="outline" scheme="on-surface" text="${esc(this.text("headClear"))}"></sf-button>`);
    if (phone && this.chosen.length) parts.push(`<sf-button-icon data-head-open="save" size="${size}" icon="bookmark_add" appearance="outline" scheme="on-surface" aria-label="${esc(this.text("headSaveFilter"))}"></sf-button-icon>`);
    box.innerHTML = parts.join("");

    for (const node of box.querySelectorAll(".sf-view-head-filter-name")) this._truncate(node, "14rem");

    box.hidden = phone ? parts.length === 0 : false;

    for (const body of box.querySelectorAll("[data-body]")) this._bindBody(body);

    for (const popover of box.querySelectorAll("sf-popover")) {
      const field = this.field(popover.getAttribute("data-pop").slice(6));
      if (field) popover.setAttribute("label", field.label);
    }
  } // The condition in words (C293, C294, C300): the Framework's own chip words
  // where the pair has them, else the values' labels or the operator and value.


  _conditionWords(field, entry) {
    const own = globalThis.SF?.fieldRenderers?.dateFilterChipText;

    if (typeof own === "function" && DATE_TYPES.has(fieldType(field))) {
      try {
        const words = own(field, entry, this.view);
        if (words) return String(words);
      } catch {// the pair's words are an extra; the plain words follow
      }
    }

    const options = this._options(field);

    if (Array.isArray(entry?.values)) {
      return entry.values.map(value => options.find(option => String(option.value) === String(value))?.label ?? value).join(", ");
    }

    const value = Array.isArray(entry?.value) ? entry.value.filter(item => item !== "").join(" – ") : entry?.value === true ? "" : String(entry?.value ?? "");
    const operator = entry?.operator && entry.operator !== "eq" ? this._operator(entry.operator, field) : "";
    return [operator, value].filter(Boolean).join(" ");
  } // The operator words are the table's (its lang: Позже, Не раньше...).


  _operator(operator, field) {
    return this.table?.getFilterOperatorLabel?.(operator, field) ?? String(operator);
  }

  _options(field) {
    const options = field?.filter?.options ?? field?.options ?? field?.filter?.optionsSource?.items ?? [];
    return Array.isArray(options) ? options.map(option => typeof option === "object" ? { ...option,
      value: option.value ?? option.id ?? option.key,
      label: option.label ?? option.title ?? option.name ?? String(option.value ?? option.id ?? "")
    } : {
      value: option,
      label: String(option)
    }) : [];
  } // A long saved filter name is cut with «…» and said whole in the tooltip
  // (C301 (2)). The cut is sf-button's own (overflow="truncate" with
  // max-width, SIMAI Framework FW-LH-1); a pair whose sf-button does not
  // declare it draws the whole name, with the same tooltip.


  _onFieldsWheel(event) {
    const row = event.target?.closest?.(".sf-view-head-fields");
    if (!row || this.mode !== "phone" || event.ctrlKey) return;
    const room = row.scrollWidth - row.clientWidth;
    if (room <= 0) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const step = event.deltaMode === 1 ? delta * 16 : event.deltaMode === 2 ? delta * row.clientWidth : delta;
    const next = Math.max(0, Math.min(room, row.scrollLeft + step));
    if (next === row.scrollLeft) return;
    event.preventDefault();
    row.scrollLeft = next;
  }

  _truncate(node, width) {
    const Button = globalThis.customElements?.get?.("sf-button");
    if (!node || !Button?.observedAttributes?.includes?.("overflow")) return;
    if (node.getAttribute("overflow") !== "truncate") node.setAttribute("overflow", "truncate");
    if (node.getAttribute("max-width") !== width) node.setAttribute("max-width", width);
  } // ---------- windows ----------


  _closeAll() {
    this.open = null;

    for (const popover of this.root?.querySelectorAll("sf-popover") ?? []) {
      if (popover.open || popover.hasAttribute("open")) popover.close?.("api");
    }

    for (const drawer of [...(this.root?.querySelectorAll("sf-drawer") ?? []), ...this._drawers()]) {
      // sf-drawer's open is its method, never false: its state is openState.
      if (drawer.openState === true || drawer.hasAttribute("open")) drawer.close?.({
        reason: "api"
      });
    }
  }

  _drawers() {
    return [this._sheet].filter(Boolean);
  }

  get _sheet() {
    return this._sheetNode?.isConnected ? this._sheetNode : this._sheetNode = this.root?.querySelector("sf-drawer[data-sheet]") ?? this._sheetNode;
  }

  _bindBody(body) {
    if (body.__sfViewHead) return;
    body.__sfViewHead = true;
    body.addEventListener("click", event => this._onPanelClick(event, body));
    body.addEventListener("change", event => this._onPanelChange(event, body));
    body.addEventListener("input", event => this._onPanelInput(event, body));
    body.addEventListener("sf-tabs-change", event => this._onTabs(event, body)); // Enter in a name field is the window's first action (save, rename).

    body.addEventListener("keydown", event => {
      if (event.key !== "Enter" || event.isComposing || !event.target?.closest?.("[data-name]")) return;
      const act = body.querySelector(".sf-view-head-foot [data-act]");
      if (!act) return;
      event.preventDefault();
      (act.matches("button") ? act : act.querySelector("button") ?? act).click();
    });
  }

  _onPopoverOpen(event) {
    const popover = event.target?.closest?.("sf-popover[data-pop]");
    if (!popover || !this.root?.contains(popover)) return; // A window opened in another's popover (a new view, a rename) keeps
    // its own kind: the popover's open event named the popover's, so
    // «Сохранить представление» opened the filter window (VL-48).

    const borrowed = popover.__sfViewHeadKind;
    popover.__sfViewHeadKind = null;
    const kind = borrowed ?? popover.getAttribute("data-pop");
    if (["filter", "save", "state", "view-new"].includes(kind) || kind.startsWith("rename:")) popover.setAttribute("label", this._title(kind));

    this._show(kind, popover, popover.querySelector("[data-body]"));
  }

  _onPopoverClosed(event) {
    const popover = event.target?.closest?.("sf-popover[data-pop]");
    if (!popover || this.open?.host !== popover) return;
    this.open = null;
    this.temp = {};
    if (this._fieldsDirty) this._renderFields();
  } // A window by kind: on the phone the bottom sheet, on a desktop the
  // popover of the button that opened it.


  async _openKind(kind) {
    if (this.mode === "phone") {
      const sheet = this._sheet;
      if (!sheet) return;
      await this.view._ensureElements?.(["sf-drawer"]);
      sheet.setAttribute("heading", this._title(kind));

      const body = sheet.querySelector("[data-body]") ?? this._sheetBody;

      this._sheetBody = body;

      this._show(kind, sheet, body); // open() is the drawer's method (a function, always truthy): it was
      // read as the open state, so the sheet never opened (VR2-4). It
      // brings an open sheet to the front and opens a closed one.


      sheet.open?.();
      return;
    } // A window without its own button opens in its zone's: a new view in
    // «Customize view»'s, a rename in the filter's.
    // A new view opens in «Изменено»'s window where it is drawn (the
    // window it is asked from), else in the filter's (C405: «Вид» is a
    // menu, it holds no window).


    const state = this.root?.querySelector('sf-popover[data-pop="state"]');
    const popover = this.root?.querySelector(`sf-popover[data-pop="${CSS.escape(kind)}"]`) ?? (kind === "view-new" && state && !state.hidden ? state : null) ?? this.root?.querySelector('sf-popover[data-pop="filter"]');
    if (!popover) return;

    if (popover.getAttribute("data-pop") !== kind) {
      // a window without its own button (rename) opens in the filter's
      this._show(kind, popover, popover.querySelector("[data-body]"));

      popover.setAttribute("label", this._title(kind));
      popover.__sfViewHeadKind = kind;
    }

    if (!(popover.open || popover.hasAttribute("open"))) popover.show?.();else {
      popover.__sfViewHeadKind = null;
      if (popover.getAttribute("data-pop") === kind) this._renderOpen();
    }
  }

  _show(kind, host, body) {
    if (!body) return;
    if (this.open?.kind !== kind) this.temp = {};
    this.open = {
      kind,
      host,
      body
    };
    if (kind.startsWith("value:")) this.temp = copy(this.filters[kind.slice(6)] ?? {});

    this._renderOpen();
  }

  _closeOpen() {
    const host = this.open?.host;
    this.open = null;
    this.temp = {};
    if (!host) return;
    host.close?.("api");
    if (this._fieldsDirty) this._renderFields();
  }

  _title(kind) {
    if (kind === "filter") return this.text("headFilter");
    if (kind === "save") return this.text("headSaveFilter");
    if (kind === "state") return this.text("headViewState");
    if (kind === "view-new") return this.text("headViewNew");
    if (kind.startsWith("rename:")) return this.text("headRename");
    if (kind.startsWith("saved:")) return String(this.savedFilter(kind.slice(6))?.name ?? "");
    if (kind.startsWith("value:")) return this.field(kind.slice(6))?.label ?? "";
    return "";
  }

  _renderOpen() {
    const open = this.open;
    if (!open?.body) return;
    const kind = open.kind;

    if (kind.startsWith("value:")) {
      this._renderValue(kind.slice(6), open.body);

      return;
    }

    open.body.className = "sf-view-head-panel";
    open.body.setAttribute("data-kind", kind);
    open.body.innerHTML = this._panel(kind); // A window that asks for a name takes the typing at once (VL-48:
    // «Сохранить представление» drew its name field without the focus,
    // so the name typed went nowhere).

    if (open.body.querySelector("[data-name]")) this._focusName(open.body);
  } // The name field of a window gets the focus once the window and the field
  // have drawn (a few frames at most).


  _focusName(body, tries = 8) {
    const next = globalThis.requestAnimationFrame ?? (fn => globalThis.setTimeout(fn, 16));

    next(() => {
      if (this.open?.body !== body) return;
      const input = body.querySelector("[data-name] input");

      if (input && input.getClientRects().length) {
        if (!input.matches(":focus")) input.focus({
          preventScroll: true
        });
        return;
      }

      if (tries > 0) this._focusName(body, tries - 1);
    });
  }

  _foot(apply, reset) {
    const size = esc(this.size); // Apply first, then Reset (the set's window footers, view round 1 D3).

    return `<div class="sf-view-head-foot"><sf-button data-act="${esc(apply[0])}" size="${size}" text="${esc(apply[1])}"></sf-button><sf-button data-act="${esc(reset[0])}" size="${size}" appearance="outline" scheme="on-surface" text="${esc(reset[1])}"></sf-button></div>`;
  }

  _note(text) {
    return `<p class="sf-view-head-note">${esc(text)}</p>`;
  }

  _panel(kind) {
    const size = esc(this.size);

    if (kind === "filter") {
      const items = [{
        id: "saved",
        label: this.text("headSavedTab")
      }, {
        id: "fields",
        label: this.text("headFieldsTab")
      }];
      return `<sf-tabs data-tabs="filter" type="underline" size="${size}" fit="always" active-index="${this.tab.filter === "fields" ? 1 : 0}" items="${esc(JSON.stringify(items))}"></sf-tabs>` + `<div class="sf-view-head-panel" data-tab-body>${this._panel(this.tab.filter === "fields" ? "filter:fields" : "filter:saved")}</div>`;
    }

    if (kind === "filter:saved") {
      if (!this.savedFilters.length) return this._note(this.text("headNoSaved"));
      const open = this.query.saved_filter == null ? null : String(this.query.saved_filter);
      return `<div class="sf-view-head-list" role="radiogroup" aria-label="${esc(this.text("headSavedTab"))}">${this.savedFilters.map(item => {
        const id = String(item.id);
        const label = `${item.name ?? id}${id === open && this.changed ? " •" : ""}`; // The marks on the UI ladder of the row's size, as the «⋯»
        // icon beside them (register VL-74, remark 7): 24, 20 compact.

        const marks = [id === this.defaultFilterId ? `<sf-icon icon="push_pin" size="${size}" data-sf-icon-scale="ladder" aria-label="${esc(this.text("headDefaultMark"))}" title="${esc(this.text("headDefaultMark"))}"></sf-icon>` : "", item.shared || item.kind === "shared" ? `<sf-icon icon="group" size="${size}" data-sf-icon-scale="ladder" aria-label="${esc(this.text("headSharedMark"))}" title="${esc(item.owner_name ? `${this.text("headSharedMark")}: ${item.owner_name}` : this.text("headSharedMark"))}"></sf-icon>` : ""].join("");
        return `<div class="sf-view-head-saved"><sf-radio data-saved="${esc(id)}" size="${size}" name="sf-view-head-saved" value="${esc(id)}" label="${esc(label)}"${id === open ? " checked" : ""}></sf-radio><span class="sf-view-head-saved-end">${marks}` + `<sf-button-icon data-saved-menu="${esc(id)}" size="${size}" icon="more_horiz" appearance="ghost" scheme="on-surface" aria-haspopup="menu" aria-label="${esc(this.text("headFilterActions").replace("{name}", item.name ?? id))}"></sf-button-icon></span></div>`;
      }).join("")}</div>`;
    }

    if (kind === "filter:fields") {
      const chosen = new Set(this.chosen);
      return `<div class="sf-view-head-list">${this.fields.map(field => `<sf-checkbox data-choose="${esc(field.key)}" size="${size}" label="${esc(field.label)}"${chosen.has(field.key) ? " checked" : ""}></sf-checkbox>`).join("")}</div>` + this._foot(["fields-apply", this.text("headApply")], ["fields-reset", this.text("headReset")]);
    }

    if (kind === "save") {
      const open = this.openFilter;
      const mine = open && (open.kind === "own" || open.mine === true);
      return this._note(this.text("headSaveNote")) + `<sf-input data-name size="${size}" label="${esc(this.text("headSaveName"))}"></sf-input>` + `<sf-checkbox data-default size="${size}" label="${esc(this.text("headSaveDefault"))}"></sf-checkbox>` + (this.permissions.share_filters ? `<sf-checkbox data-shared size="${size}" label="${esc(this.text("headSaveShared"))}" description="${esc(this.text("headSaveSharedHint"))}"></sf-checkbox>` : "") + (mine && this.changed ? `<sf-button data-act="filter-update" size="${size}" appearance="ghost" scheme="primary" text="${esc(this.text("headUpdateFilter").replace("{name}", open.name ?? open.id))}"></sf-button>` : "") + this._foot(["filter-save", this.text("headSave")], ["close", this.text("headCancel")]);
    }

    if (kind.startsWith("rename:")) {
      const item = this.savedFilter(kind.slice(7));
      return `<sf-input data-name size="${size}" label="${esc(this.text("headSaveName"))}" value="${esc(item?.name ?? "")}"></sf-input>` + this._foot(["filter-rename", this.text("headSave")], ["close", this.text("headCancel")]);
    }

    if (kind.startsWith("saved:")) {
      const item = this.savedFilter(kind.slice(6));
      return `<div class="sf-view-head-actions">${this._savedMenu(item).filter(entry => !entry.kind).map(entry => `<sf-button data-saved-act="${esc(entry.id)}" data-saved-id="${esc(item.id)}" size="${size}" appearance="ghost" scheme="${entry.status === "danger" ? "primary" : "on-surface"}"${entry.status === "danger" ? ' status="danger"' : ""} icon-start="${esc(entry.icon)}" text="${esc(entry.text)}"></sf-button>`).join("")}</div>`;
    }

    if (kind === "state") return this._statePanel();

    if (kind === "view-new") {
      const shared = this.permissions.shared_settings || this.permissions.share_views;
      return this._note(this.text("headSaveViewNote")) + `<sf-input data-name size="${size}" label="${esc(this.text("headSaveName"))}"></sf-input>` + (shared ? `<sf-checkbox data-shared size="${size}" label="${esc(this.text("headSaveShared"))}" description="${esc(this.text("headSaveSharedHint"))}"></sf-checkbox>` : "") + this._foot(["view-save-new", this.text("headSave")], ["close", this.text("headCancel")]);
    }

    return "";
  } // «Вид» (owner decisions C405, C404; LH-7 and C298 before): the drill
  // menu of SIMAI Framework (sf-settings look="drill") with the shown
  // display kind's own rows -- each kind its own set -- every choice
  // applied at once and saved for the person (settings.save personal). A
  // locked row is drawn disabled; a row head.look leaves out is not drawn
  // (VR5-5). The columns are «Колонки» beside it (the table's own window,
  // C406), not rows here. Saving for everyone and resetting go through
  // «Изменено» (the state window).


  _lookItems() {
    const kind = this.kind;

    const settings = this._kindSettings(kind);

    const locked = new Set(this._locked());

    const off = key => locked.has(key) || locked.has(`layouts.${kind}.${key}`);

    const look = this.view.look;

    const shows = key => !look || look.includes(key);

    const lockText = this.text("headLocked");

    const caption = key => off(key) ? {
      caption: lockText
    } : {};

    const choice = (key, word, list, current) => ({
      id: key,
      type: "choice",
      text: this.text(word),
      value: String(current ?? ""),
      ...(off(key) ? {
        disabled: true
      } : {}),
      ...caption(key),
      options: list.map(([value, label]) => ({
        id: String(value),
        text: String(label)
      }))
    });

    const toggle = (key, word, value) => ({
      id: key,
      type: "switch",
      text: this.text(word),
      value: Boolean(value),
      ...(off(key) ? {
        disabled: true
      } : {}),
      ...caption(key)
    }); // A list of several (card fields, row actions) is a group of
    // switches, one per entry (the drill look has no multi-choice row).


    const switches = (key, word, list, current) => ({
      type: "group",
      text: this.text(word),
      items: list.map(([value, label]) => ({
        id: `${key}:${value}`,
        type: "switch",
        text: String(label),
        value: current.includes(String(value)),
        ...(off(key) ? {
          disabled: true
        } : {})
      }))
    }); // The view's own fields (VHF-13): the record fields the list draws
    // (its columns), not the filter's. The title is the card's own line,
    // never a field of it. A field of a type a row needs (a lane, a date)
    // the columns do not say is looked up among the host's described fields.


    const described = Array.isArray(this.description?.fields) ? this.description.fields : this.fields;
    const columns = (this.view.columns ?? []).filter(column => column?.key !== undefined && column?.key !== null && !column.system && !["select", "settings"].includes(String(column.key)));
    const record = columns.length ? columns : described;

    const pairs = list => list.map(field => [field.key, field.label ?? field.key]);

    const fieldsOf = test => {
      const own = record.filter(field => test(fieldType(field)));
      const known = new Set(own.map(field => String(field.key)));
      return pairs([...own, ...described.filter(field => !known.has(String(field.key)) && test(fieldType(field)))]);
    };

    const all = pairs(record.filter(field => field.role !== "title" && field.title !== true)); // How the list goes on past its first page (owner decision D1), the
    // table's and the cards' (view round 14): «Вместе» by default.

    const paging = [["pages", "headPagingPages"], ["more", "headPagingMore"], ["both", "headPagingBoth"], ["endless", "headPagingEndless"]].map(([value, word]) => [value, this.text(word)]);
    const items = [];

    const add = (key, item) => {
      if (shows(key) && item) items.push(item);
    };

    if (kind === "table") {
      const actions = (this.view.rowActionCatalog ?? []).map(action => [action.id, action.label ?? action.id]); // The table's own look (VR12A-1, D4, D5): under the list head the
      // gear holds the columns only (C406), so the density, the lines
      // and «Текст в одну строку» are set here.

      if (this.view.table) {
        add("density", choice("density", "headDensity", [["normal", this.text("headDensityNormal")], ["compact", this.text("headDensityCompact")]], settings.density)); // S-A 1 (VL-84, view part): a phone draws the table as a list,
        // where one line and the lines between columns do nothing:
        // hidden there, not disabled (a layout scope; the Framework's
        // item scope waits).

        if (this.mode !== "phone") {
          add("single_line", toggle("single_line", "headSingleLine", settings.single_line));
          add("lines", toggle("lines", "headLines", settings.lines));
        }
      }

      if (this.view.pagingOffered) add("paging", choice("paging", "headPaging", paging, settings.paging));
      if (actions.length) add("row_actions", switches("row_actions", "headRowActions", actions, settings.row_actions));
    } else if (kind === "board") {
      add("lane_field", choice("lane_field", "headLaneField", fieldsOf(type => LIST_TYPES.has(type)), settings.lane_field));
      add("empty_lanes", toggle("empty_lanes", "headEmptyLanes", settings.empty_lanes)); // The board's lanes, each with its switch, before the long list
      // of card fields: a lane hidden by its own «Скрыть» comes back
      // here (DEV 2026-11-24; the board's message names «Вид»).

      const lanes = this.view.board?.laneChoices ?? [];
      if (lanes.length) add("lanes", {
        type: "group",
        text: this.text("headLanes"),
        items: lanes.map(lane => ({
          id: `lane:${lane.value}`,
          type: "switch",
          text: String(lane.label),
          value: lane.shown === true
        }))
      });
      add("card_fields", switches("card_fields", "headCardFields", all, settings.card_fields));
    } else if (kind === "cards") {
      add("size", choice("size", "headCardSize", [["s", this.text("headSizeS")], ["m", this.text("headSizeM")], ["l", this.text("headSizeL")]], settings.size));
      add("card_labels", toggle("card_labels", "headCardLabels", settings.card_labels));
      if (this.view.pagingOffered) add("paging", choice("paging", "headPaging", paging, settings.paging));
      add("card_fields", switches("card_fields", "headCardFields", all, settings.card_fields));
    } else if (kind === "calendar") {
      // The week start and the time zone are the request's (C293), never the view's.
      add("date_field", choice("date_field", "headDateField", fieldsOf(type => DATE_TYPES.has(type)), settings.date_field));
      add("color_field", choice("color_field", "headColourField", [...fieldsOf(type => LIST_TYPES.has(type)), ["", this.text("headColourNone")]], settings.color_field ?? ""));
    }

    return items;
  } // «Вид» and «Колонки» as the shown kind has them: «Колонки» for a table
  // only (the table's column window); the drill menu given its rows, anew
  // only when they change.


  _renderLook(one, set, lookShown) {
    const columns = one(".sf-view-head-columns");
    const table = this.view.table;
    const look = this.view.look;
    const columnsShown = lookShown && (!look || look.includes("columns")) && this.kind === "table" && typeof table?.openColumnSettings === "function" && this.view.renders("settings");
    set(columns, "hidden", columnsShown ? null : ""); // VL-83: the phone's zone has «Колонки» too (an icon beside «Вид»):
    // the column window was out of reach at 390.

    if (columns?.localName === "sf-button-icon") set(columns, "aria-label", this.text("headColumns"));else set(columns, "text", this.text("headColumns"));
    set(columns, "title", this.text("headColumns"));

    for (const node of this.root.querySelectorAll(".sf-view-head-look")) {
      if (node.localName === "sf-button") {
        set(node, "text", this.text("headLook"));
        set(node, "title", this.text("headLook"));
      } else set(node, "aria-label", this.text("headLook"));
    }

    const menu = this._lookMenu;
    if (!menu) return;
    set(menu, "label", this.text("headLook"));
    set(menu, "size", this.size);
    const items = lookShown ? this._lookItems() : [];
    const key = JSON.stringify([this.kind, items]);

    if (this._lookKey !== key) {
      this._lookKey = key;
      menu.items = items;
    }
  } // «Вид» opened by a call (sf-view openCustomize): the menu against its button.


  openLook() {
    const menu = this._lookMenu;
    const trigger = [...(this.root?.querySelectorAll(".sf-view-head-look") ?? [])].find(node => !node.hidden);
    if (!menu || !trigger || !this.view.renders("look")) return false;
    this._lookKey = null;
    this.render();
    if (typeof menu.open === "function") menu.open();else menu.toggle?.(trigger);
    return true;
  } // A row of «Вид» changed (sf-settings changed: {id, value}): a list of
  // switches (card fields, row actions) is one setting, the rest their own.


  _onLookChanged(event) {
    event.stopPropagation();
    const {
      id,
      value
    } = event.detail ?? {};
    if (typeof id !== "string" || !id) return;
    const kind = this.kind;

    const current = this._kindSettings(kind);

    const at = id.indexOf(":"); // A board lane shown or hidden: the board's own (it says so and
    // keeps it), not a setting of the kind.

    if (at > 0 && id.slice(0, at) === "lane") {
      const board = this.view.board;
      const entry = id.slice(at + 1);
      if (value === true) board?.showLane?.(entry);else board?.hideLane?.(entry);
      this.render();
      return;
    }

    if (at > 0) {
      const key = id.slice(0, at);
      const entry = id.slice(at + 1);
      const now = Array.isArray(current[key]) ? current[key].map(String) : [];
      const next = value === true ? now.includes(entry) ? now : [...now, entry] : now.filter(one => one !== entry);

      this._applySetting(kind, key, next);

      return;
    }

    this._applySetting(kind, id, typeof value === "boolean" ? value : String(value ?? ""));
  } // «Changed» (VS-2, VS-3): what is changed and the ways out -- save for
  // everyone (where the host allows, never over a system view), save as a
  // new view, reset to what is saved.


  _statePanel() {
    const size = esc(this.size);
    const view = this.currentView;
    const name = String(view?.label ?? view?.name ?? view?.key ?? "");
    if (!this.viewChanged) return this._note(this.text("headViewStateNone").replace("{name}", name));
    const shared = (this.permissions.shared_settings || this.permissions.share_views) && this.viewLevel(view) !== "system";

    const button = (act, text, primary) => `<sf-button data-act="${act}" size="${size}"${primary ? "" : ' appearance="outline" scheme="on-surface"'} text="${esc(text)}"></sf-button>`; // A setting changed in «Customize view» is already saved for the
    // person (C298); a filter or a display kind changed here is not saved.


    const mine = Boolean(this._settings && Object.values(this._settings).some(entry => entry && Object.keys(entry).length)); // VL-80 (DEV decision): the ways out are named for what they do --
    // «Сохранить для всех» where the person may write the shared view,
    // «Сохранить как новое» (a view of their own, the window
    // «Сохранить представление» of view-config/1 names it), «Сбросить
    // изменения» back to the saved view. A view they cannot write (a
    // system view, locked paths) is kept the same way, as a new view of
    // their own («Сохранить как моё» before).

    return this._note(this.text(mine ? "headViewStateMine" : "headViewStateUnsaved").replace("{name}", name)) + `<div class="sf-view-head-actions">${shared ? button("view-save-all", this.text("headViewSaveAll"), true) : ""}` + `${button("view-open-new", this.text("headViewSaveNew"), !shared)}${button("view-reset-all", this.text("headViewReset"), false)}</div>`;
  }

  _locked() {
    const config = this.view.viewConfig;
    return [...(Array.isArray(config?.locked) ? config.locked : []), ...(Array.isArray(this.view.lockedSettings) ? this.view.lockedSettings : [])].map(String);
  } // What a display kind's settings are now: the view's document
  // (view-config/1 layouts.<kind>), what the person changed here, else what
  // the list shows.


  _kindSettings(kind) {
    const config = this.view.viewConfig?.layouts?.[kind] ?? {};
    const own = this._settings?.[kind] ?? {}; // The person's look of the kind in all their lists (C408) over the
    // view's document, what they set here over both.

    const merged = { ...copy(config),
      ...copy(this.view.kindPreferences?.(kind) ?? {}),
      ...copy(own)
    };

    if (kind === "table") {
      const visible = this.view.viewConfig?.fields?.visible;
      merged.columns ??= (Array.isArray(visible) ? visible : (this.view.columns ?? []).filter(column => column.visible !== false).map(column => column.key)).map(String);
      merged.row_actions ??= (this.view.rowActionCatalog ?? []).map(action => String(action.id));
      merged.paging ??= this.view.pagingOf?.("table") ?? "both"; // The density and one line as the table shows them (VR12A-1).
      // VL-76: the table's look is the truth once it is drawn -- a page
      // that moves it by a call (setTableView) is not outvoted by the
      // choice the person once made here, which the table applied.

      const table = this.view.table;

      if (table?.tableView) {
        merged.density = table.shownViewDensity === "compact" ? "compact" : "normal";
        merged.single_line = table.tableView.singleLine === true;
        merged.lines = table.tableView.lines === true;
      } else {
        merged.density ??= "normal";
        merged.single_line ??= false;
        merged.lines ??= false;
      }
    } // The card fields a board or the cards draw now (their own defaults
    // when the view names none), so the window ticks what is on the cards.


    const drawn = (kind === "board" ? this.view.board?.boardOptions : kind === "cards" ? this.view.cards?.cardsOptions : null)?.cardFields;

    if (kind === "board") {
      merged.card_fields ??= Array.isArray(drawn) ? [...drawn] : [];
      merged.empty_lanes ??= true;
    } // Cards S, M, L; M by default (C306). The calendar's week start comes
    // from the request context, never from a stored view (CA-2).


    if (kind === "cards") {
      merged.size ??= "m";
      merged.card_fields ??= Array.isArray(drawn) ? [...drawn] : []; // Labels over the values by default (D3); the cards' own paging (view round 14).

      merged.card_labels ??= this.view.cards?.cardsOptions?.cardLabels !== false;
      merged.paging ??= this.view.pagingOf?.("cards") ?? "both";
    }

    for (const key of ["columns", "row_actions", "card_fields"]) if (Array.isArray(merged[key])) merged[key] = merged[key].map(String);

    return merged;
  } // A field's window from the Framework (C310, FO-5): it picks its width,
  // its conditions, its bottom sheet under 600 px and «Применить (N)», and
  // settles {action: apply | reset, value} or null (closed without either).
  // The window composition («Выбрано» line, footer) is the Framework's and
  // waits the owner's answer; the head only opens it and takes the answer.


  async _openWindow(key, anchor) {
    const api = this.filterWindow;
    const field = this.field(key);
    if (!api || !field || !anchor) return null;
    let answer = null;

    try {
      answer = await api.open({
        anchor,
        field: this._windowField(field),
        value: copy(this.filters[key] ?? {}),
        size: this.size
      });
    } catch {
      answer = null;
    }

    if (!answer || answer.action !== "apply" && answer.action !== "reset") return answer;
    const filters = { ...this.filters
    };
    if (answer.action === "apply" && answer.value && typeof answer.value === "object" && this._active(key, answer.value)) filters[key] = copy(answer.value);else delete filters[key];
    if (same(filters, this.filters)) return answer;

    this._query({
      filters
    });

    return answer;
  } // A field's window: the Framework's filter template for the field's type,
  // over a pending copy of its condition, with Apply and Reset.


  async _renderValue(key, body) {
    const field = this.field(key);
    if (!field || !body) return;
    body.className = "sf-view-head-panel";
    body.setAttribute("data-kind", `value:${key}`);
    const renderers = globalThis.SF?.fieldRenderers?.renderFilterField ? globalThis.SF.fieldRenderers : await globalThis.SF?.whenFieldRenderers?.().catch(() => null);
    const render = globalThis.SF?.render;
    const html = globalThis.SF?.html;
    if (!renderers?.renderFilterField || !render || !html || this.open?.body !== body) return;
    const size = this.size;
    const host = {
      size,
      getFieldText: () => null,
      getFilterControlValue: () => ({ ...this.temp
      }),
      patchTempFilterValue: (_key, patch) => {
        this.temp = { ...this.temp,
          ...patch
        };

        this._renderValue(key, body);
      },
      getFilterOperatorLabel: operator => this._operator(operator, field),
      getFilterOptionSearch: () => this.optionSearch[key] ?? "",
      patchTempFilterOptionSearch: (_key, search) => {
        this.optionSearch[key] = search;

        this._renderValue(key, body);
      },
      getVisibleFilterOptions: () => {
        const search = String(this.optionSearch[key] ?? "").trim().toLowerCase();
        return this._options(field).filter(option => !search || String(option.label).toLowerCase().includes(search));
      },
      renderFilterOption: (_field, option, selected) => html`<sf-checkbox size=${size} label=${option.label}
                ?checked=${selected.has(option.value)}
                @change=${event => {
        const values = new Set(this.temp.values ?? []);
        if (event.target?.checked ?? event.detail?.checked) values.add(option.value);else values.delete(option.value);
        this.temp = { ...this.temp,
          operator: this.temp.operator ?? field.filter?.defaultOperator ?? "in",
          values: [...values]
        };
      }}></sf-checkbox>`,
      getEndpointFilterPage: () => null,
      loadEndpointFilterPage: () => null
    };
    const options = LIST_TYPES.has(fieldType(field)) && !field.filter?.options && !field.options && !field.filter?.optionsSource?.items ? { ...field,
      filter: { ...(field.filter ?? {}),
        options: this._options(field)
      }
    } : field;
    const words = this.temp && conditionActive(this.temp) ? this._conditionWords(field, this.temp) : "";
    render(html`
            <div class="sf-view-head-value">${renderers.renderFilterField(options, host)}</div>
            ${words ? html`<p class="sf-view-head-note">${words}</p>` : ""}
            <div class="sf-view-head-foot">
                <sf-button data-act="value-apply" size=${size} text=${this.text("headApply")}></sf-button>
                <sf-button data-act="value-reset" size=${size} appearance="outline" scheme="on-surface" text=${this.text("headReset")}></sf-button>
            </div>`, body);
  } // ---------- the menus ----------


  _savedMenu(item) {
    if (!item) return [];
    const id = String(item.id);
    const mine = item.kind === "own" || item.mine === true;
    const open = String(this.query.saved_filter ?? "") === id;
    const entries = [];

    if (mine) {
      entries.push({
        id: "rename",
        text: this.text("headRename"),
        icon: "edit"
      });
      entries.push({
        id: "update",
        text: this.text("headUpdate"),
        icon: "sync",
        disabled: !(open && this.changed)
      });
    }

    entries.push({
      id: "default",
      text: id === this.defaultFilterId ? this.text("headDefaultMark") : this.text("headMakeDefault"),
      icon: "push_pin",
      disabled: id === this.defaultFilterId
    });
    if (mine && (item.may_share || this.permissions.share_filters)) entries.push({
      id: "share",
      text: item.shared ? this.text("headUnshare") : this.text("headShare"),
      icon: item.shared ? "lock" : "group"
    });
    if (!mine && item.kind !== "system") entries.push({
      id: "copy",
      text: this.text("headCopy"),
      icon: "content_copy"
    });

    if (mine) {
      entries.push({
        type: "separator"
      });
      entries.push({
        id: "delete",
        text: this.text("headDelete"),
        icon: "delete",
        status: "danger"
      });
    }

    return entries;
  }

  async _menu(anchor, label, entries) {
    const button = anchor?.querySelector?.("button") ?? anchor;
    const choice = await (0,_view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_0__.menuOpen)({
      anchor: button,
      label,
      entries,
      size: this.size
    });
    return choice?.id ?? null;
  } // ---------- events ----------


  _onClick(event) {
    const target = event.target;
    if (!target?.closest) return;
    const unchoose = target.closest("[data-unchoose]");

    if (unchoose) {
      const key = unchoose.getAttribute("data-unchoose");
      const filters = { ...this.filters
      };
      delete filters[key];

      this._query({
        filters_chosen: this.chosen.filter(name => name !== key),
        filters
      });

      return;
    }

    if (target.closest("[data-clear]")) {
      const filters = { ...this.filters
      };

      for (const key of this.chosen) delete filters[key];

      this._query({
        filters
      });

      return;
    }

    const field = target.closest("[data-field]");

    if (field && this.filterWindow) {
      this._openWindow(field.getAttribute("data-field"), field);

      return;
    }

    if (field && this.mode === "phone") {
      this._openKind(`value:${field.getAttribute("data-field")}`);

      return;
    }

    const opener = target.closest("[data-head-open]");

    if (opener) {
      this._openKind(opener.getAttribute("data-head-open"));

      return;
    } // «Колонки» (C404, C406): the table's own column window, against it.


    const columns = target.closest(".sf-view-head-columns, [data-columns]");

    if (columns) {
      // After this click has gone by: the window opened during it took
      // the same click for one outside it and closed at once.
      const anchor = columns.closest(".sf-view-head-columns") ?? columns;
      setTimeout(() => this.view.table?.openColumnSettings?.(anchor), 0);
      return;
    }

    if (target.closest("[data-zone-toggle]")) {
      this._setZoneOpen(!this.zoneOpen);

      return;
    }

    const views = target.closest("[data-views], [data-kind-menu]");

    if (views) {
      this._viewsMenu(views);

      return;
    }

    const listMenu = target.closest("[data-list-menu]");

    if (listMenu) {
      this._listMenu(listMenu);

      return;
    }

    const create = target.closest("[data-create]");

    if (create && this.mode === "phone") {
      const items = this.createItems;

      if (items.length > 1) {
        this._menu(create, this.text("headCreate"), items.map(item => ({
          id: String(item.id),
          text: String(item.name ?? item.id),
          icon: item.icon ?? "add"
        }))).then(id => {
          if (id !== null) this._create(id);
        });
      } else this._create(items[0]?.id ?? null);
    }
  }

  _onCreatePress(event) {
    if (this.mode === "phone" || !event.target?.closest?.(".sf-view-head-create")) return;

    this._create(this.createItems[0]?.id ?? null);
  }

  _onCreateSelect(event) {
    if (!event.target?.closest?.(".sf-view-head-create")) return;
    const id = event.detail?.id;
    if (id !== null && id !== undefined) this._create(String(id));
  }

  _create(id) {
    this.raise("view.create_record", {
      item: id === null || id === undefined ? null : String(id)
    });
  } // The views menu (VS-3): the saved views by level -- system, for everyone,
  // mine -- the open one checked, then «Save as a new view». The phone's
  // display-kind icon opens the kinds alone.


  async _viewsMenu(anchor) {
    const kindsOnly = Boolean(anchor?.closest?.("[data-kind-menu]"));
    const current = this.currentView;
    const entries = [];

    if (kindsOnly) {
      for (const kind of this.kinds) {
        // A pick-one list: the current kind is a checked menuitemradio
        // (aria-checked, the chosen row's fill), each with its own glyph.
        entries.push({
          id: `kind:${kind}`,
          text: this.kindLabel(kind),
          icon: KINDS[kind],
          kind: "radio",
          checked: kind === this.kind
        });
      }
    } else {
      const levels = ["system", "shared", "personal", ""];
      const leveled = this.savedViews.some(view => this.viewLevel(view));

      for (const level of levels) {
        const list = this.savedViews.filter(view => this.viewLevel(view) === level);
        if (!list.length) continue;
        if (entries.length) entries.push({
          type: "separator"
        });
        if (leveled && level) entries.push({
          type: "heading",
          text: this.text(`headLevel${level[0].toUpperCase()}${level.slice(1)}`)
        });

        for (const view of list) {
          const own = {
            system: "bookmarks",
            shared: "group",
            personal: "person"
          }[level] ?? "bookmarks";
          entries.push({
            id: `view:${view.key}`,
            text: String(view.label ?? view.name ?? view.key),
            icon: view === current ? "check" : own
          });
        }
      }

      if (this.view.hostOffers("saved-views")) {
        if (entries.length) entries.push({
          type: "separator"
        });
        entries.push({
          id: "view:new",
          text: this.text("headViewNew"),
          icon: "add"
        });
      }
    }

    if (!entries.length) return;
    const id = await this._menu(anchor, this.text(kindsOnly ? "headDisplay" : "headViews"), entries);
    if (!id) return;
    if (id.startsWith("kind:")) return this._setKind(id.slice(5));
    if (id === "view:new") return this._openKind("view-new");

    this._openSavedView(id.slice(5));
  }

  _openSavedView(key) {
    const view = this.savedViews.find(item => String(item.key) === String(key));
    const type = view?.settings?.layout && this.kinds.includes(view.settings.layout) && this.drawable(view.settings.layout) ? view.settings.layout : this.kind; // Another view starts from what is saved for it: no change of the
    // person's carries over from the view they left.

    this._settings = null; // A view saved as a board opens as one (and a table view as a table):
    // the layout's own query first, then the view.

    if (type !== this.view.layoutKind && this.drawable(type)) this.view.switchLayout?.(type); // Its filter fields come with it (VS-8): the ones it keeps, else none
    // chosen (the fields of its conditions, as the host answers them).

    const query = { ...(this.view.query ?? {})
    };
    delete query.filters_chosen;
    const fields = this.viewFilterFields(view);
    this.view.query = { ...query,
      ...(fields ? {
        filters_chosen: fields
      } : {}),
      view: {
        id: key,
        type
      }
    };
    this.view.openView?.(key);
    this.render();
  }

  async _listMenu(anchor) {
    const id = await this._menu(anchor, this.text("headListMenu"), this.listMenu);
    if (!id) return; // The card's own arranging mode (C311 (1), RC-4).

    if (id === "record-fields") return this.view.openRecordSettings?.(); // Rights and export are the host's pages: the view says which was asked.

    this.view.sfEmit?.("settings-open", {
      id
    });
  } // The display kind: the view swaps its layout live (table <-> board,
  // keeping the marks and the record card beside), then asks the host with
  // the new layout's query. A kind the view cannot draw is not offered.


  _setKind(kind) {
    if (!this.kinds.includes(kind) || kind === this.kind) return;
    if (!this.drawable(kind)) return this.render();
    const allowed = this.view.sfEmit?.("display-change", {
      kind,
      previous: this.kind
    }, {
      cancelable: true
    });
    if (allowed === false) return this.render();
    this.view.setAttribute("data-display", kind);
    const view = {
      id: this.currentView?.key ?? null,
      type: kind
    };
    if (typeof this.view.switchLayout !== "function") return this._query({
      view
    }); // The query names the kind, then the view swaps its layout and asks
    // the host once, with the layout's own query (a board's lane window).
    // The page is the view's to keep (LV2-8): the record first on screen
    // stays on screen in the new kind.

    this.view.query = { ...this.view.query,
      view
    };
    this.view.switchLayout(kind);
  }

  _onChange(event) {
    const kinds = event.target?.closest?.("[data-kinds]");

    if (kinds && event.target === kinds) {
      const value = event.detail?.value;
      if (value) this._setKind(String(value));
    }
  }

  _onInput(event) {
    const search = event.target?.closest?.("[data-search]");
    if (!search) return;
    clearTimeout(this._searchTimer); // The search text is never saved: it goes with the query only (C297).

    this._searchTimer = setTimeout(() => this._query({
      search: String(search.value ?? "")
    }), 300);
  }

  _onKey(event) {
    const search = event.target?.closest?.("[data-search]");
    if (!search || event.key !== "Escape" || !search.value) return;
    search.value = "";
    clearTimeout(this._searchTimer);

    this._query({
      search: ""
    });
  }

  _onSearchReset(event) {
    if (!event.target?.closest?.("[data-search]")) return;
    clearTimeout(this._searchTimer);

    this._query({
      search: ""
    });
  }

  _onTabs(event, body) {
    const tabs = event.target?.closest?.("[data-tabs]");
    if (!tabs) return;
    const name = tabs.getAttribute("data-tabs");
    const detail = event.detail ?? {};
    let id = detail.item?.id ?? detail.selected ?? detail.value ?? detail.index;

    if (name === "filter") {
      if (typeof id === "number" || /^\d+$/u.test(String(id))) id = ["saved", "fields"][Number(id)];
      if (!id) return;
      this.tab.filter = id;
      const target = body.querySelector("[data-tab-body]");
      if (target) target.innerHTML = this._panel(`filter:${id}`);
    }
  }

  _onPanelInput() {}

  _onPanelChange(event, body) {
    const target = event.target;
    const saved = target?.closest?.("[data-saved]");

    if (saved && body.contains(saved)) {
      const checked = target.checked ?? saved.querySelector("input")?.checked;
      if (checked === false) return;

      this._useSaved(saved.getAttribute("data-saved"));

      return;
    }
  }

  _checked(node) {
    if (!node) return false;
    if (node.tagName === "INPUT") return node.checked;
    const input = node.querySelector?.("input");
    return input ? input.checked : node.hasAttribute("checked");
  }

  _value(node) {
    const input = node?.querySelector?.("input");
    return input?.value ?? node?.value ?? "";
  } // A personal setting applies at once (C298): settings.save personal. What
  // a person sets for how a kind looks holds in all their lists of that
  // kind (owner decision C408): kept by the view as theirs for the kind.


  _applySetting(kind, key, value) {
    const current = this._kindSettings(kind);

    if (same(current[key], value)) return;
    this._settings ??= {};
    this._settings[kind] = { ...(this._settings[kind] ?? {}),
      [key]: value
    };
    if (kind === "table" && key === "columns") this._showColumns(value);else if (kind === "table" && key === "paging") this.view.applyPaging?.(value); // The table keeps them as the person's view of it, as its gear did.
    else if (kind === "table" && key === "density") this.view.table?.setTableView?.({
      density: value
    });else if (kind === "table" && key === "single_line") this.view.table?.setTableView?.({
      singleLine: value === true
    });else if (kind === "table" && key === "lines") this.view.table?.setTableView?.({
      lines: value === true
    }); // The cards' paging (view round 14, D1 for the cards) shows at once too.
    else if (kind === "cards" && key === "paging") this.view.applyPaging?.(value, "cards"); // A board's, the cards' and the calendar's settings show at once too
    // (VHF-13, C298): they only went to the host and showed after a reload.
    else if (kind !== "table") this.view.applyLayoutSettings?.(kind, {
      [key]: value
    });
    this.view.keepKindSetting?.(kind, key, value);

    this._saveSettings("personal", {
      [key]: value
    });

    this.render();
  } // The table's columns as «Настроить вид» says (view round 10, V10-2): a
  // column switched off there stayed in the table -- the setting went to the
  // host (settings.save) and nothing changed on screen. The table's own
  // column settings take it, without the table's own save (the head's
  // settings.save is the one write).


  _showColumns(keys) {
    const table = this.view.table;
    if (!Array.isArray(keys) || typeof table?.setColumnSettings !== "function") return;
    const on = new Set(keys.map(String));
    const columns = (this.view.columns ?? []).filter(column => column?.key !== undefined && column?.key !== null);
    table.setColumnSettings(current => {
      const next = { ...(current ?? {})
      };

      for (const column of columns) {
        const key = String(column.key);
        next[key] = { ...(next[key] ?? {}),
          visible: on.has(key)
        };
      }

      return next;
    }, "view-customize", false);
  }

  _saveSettings(layer, patch) {
    const view = this.currentView?.key ?? null;
    const config = this.view.viewConfig;
    this.raise("settings.save", {
      layer,
      view,
      type: this.kind,
      patch,
      ...(config?.revision != null ? {
        base_revision: config.revision
      } : {})
    });
  }

  _onPanelClick(event, body) {
    const target = event.target;
    if (!target?.closest) return;
    const menu = target.closest("[data-saved-menu]");

    if (menu) {
      const item = this.savedFilter(menu.getAttribute("data-saved-menu"));
      if (!item) return;
      if (this.mode === "phone") return this._openKind(`saved:${item.id}`); // The shared menu is not a layer of the filter window, so a press
      // on its item closed the window (LV4-7): the window opens again on
      // its saved sets, and shows the answer there (the pin after «по
      // умолчанию»). A rename opens its own window.

      this._menu(menu, this.text("headFilterActions").replace("{name}", item.name ?? item.id), this._savedMenu(item)).then(id => {
        if (id) this._savedAction(id, item);

        if (id && id !== "rename" && !this.open) {
          this.tab.filter = "saved";

          this._openKind("filter");
        }
      });

      return;
    }

    const savedAct = target.closest("[data-saved-act]");

    if (savedAct) {
      this._savedAction(savedAct.getAttribute("data-saved-act"), this.savedFilter(savedAct.getAttribute("data-saved-id")));

      return;
    }

    const action = target.closest("[data-act]");
    if (!action) return;
    const act = action.getAttribute("data-act");

    const value = selector => this._value(body.querySelector(selector));

    switch (act) {
      case "close":
        this._closeOpen();

        return;

      case "fields-reset":
        {
          const open = this.openFilter;
          const keep = new Set(open?.fields ?? []);

          for (const box of body.querySelectorAll("sf-checkbox[data-choose]")) {
            const input = box.querySelector("input");
            if (input) input.checked = keep.has(box.getAttribute("data-choose"));
          }

          return;
        }

      case "fields-apply":
        {
          const keys = [...body.querySelectorAll("sf-checkbox[data-choose]")].filter(box => this._checked(box)).map(box => box.getAttribute("data-choose"));
          const filters = Object.fromEntries(Object.entries(this.filters).filter(([key]) => keys.includes(key)));

          this._closeOpen();

          this._query({
            filters_chosen: keys,
            filters
          });

          return;
        }

      case "value-reset":
        {
          const key = this.open.kind.slice(6);
          const filters = { ...this.filters
          };
          delete filters[key];

          this._closeOpen();

          this._query({
            filters
          });

          return;
        }

      case "value-apply":
        {
          const key = this.open.kind.slice(6);
          const filters = { ...this.filters
          };
          if (conditionActive(this.temp)) filters[key] = copy(this.temp);else delete filters[key];

          this._closeOpen();

          this._query({
            filters
          });

          return;
        }

      case "filter-save":
        {
          const name = value("[data-name]").trim();

          if (!name) {
            body.querySelector("[data-name]")?.setAttribute("status", "error");
            body.querySelector("[data-name] input")?.focus?.();
            return;
          }

          const filter = {
            name,
            fields: this.chosen,
            filters: this._activeFilters(),
            shared: this._checked(body.querySelector("[data-shared]")),
            default: this._checked(body.querySelector("[data-default]"))
          };

          this._closeOpen();

          this.raise("filter.save", {
            filter
          });
          return;
        }

      case "filter-update":
        {
          const open = this.openFilter;

          this._closeOpen();

          if (open) this.raise("filter.update", {
            id: open.id,
            fields: this.chosen,
            filters: this._activeFilters(),
            ...(open.revision != null ? {
              revision: open.revision
            } : {})
          });
          return;
        }

      case "filter-rename":
        {
          const id = this.open.kind.slice(7);
          const name = value("[data-name]").trim();
          if (!name) return;

          this._closeOpen();

          this.raise("filter.rename", {
            id,
            name
          });
          return;
        }

      case "view-open-new":
        this._closeOpen();

        this._openKind("view-new");

        return;

      case "view-save-new":
        {
          const label = value("[data-name]").trim();

          if (!label) {
            body.querySelector("[data-name]")?.setAttribute("status", "error");
            body.querySelector("[data-name] input")?.focus?.();
            return;
          }

          const level = this._checked(body.querySelector("[data-shared]")) ? "shared" : "personal";

          this._closeOpen();

          this.view.saveView?.({
            key: `view-${Date.now().toString(36)}`,
            label,
            level,
            settings: {
              filter_fields: this.chosen,
              layout: this.kind,
              ...(this._settings?.[this.kind] ? {
                layouts: {
                  [this.kind]: copy(this._settings[this.kind])
                }
              } : {})
            }
          });
          return;
        }

      case "view-save-all":
        {
          const view = this.currentView;

          this._closeOpen();

          if (!view) return;
          if (this._settings?.[this.kind]) this._saveSettings("shared", this._kindSettings(this.kind));
          this.view.saveView?.({
            key: view.key,
            label: view.label ?? view.name ?? view.key,
            revision: view.revision,
            level: "shared",
            roles: view.roles,
            settings: { ...(view.settings ?? {}),
              filter_fields: this.chosen,
              layout: this.kind
            }
          });
          this._settings = null;
          return;
        }

      case "view-reset-all":
        {
          const view = this.currentView;

          this._closeOpen();

          if (!view) return;

          if (this._settings) {
            this._settings = null;

            this._saveSettings("personal", null);
          }

          const filters = copy(view.query?.filters ?? view.filters ?? {});
          const fields = Array.isArray(view.settings?.filter_fields) ? view.settings.filter_fields.map(String) : Object.keys(filters);
          const layout = this.viewKind(view);
          if (typeof layout === "string" && layout !== this.kind && this.kinds.includes(layout)) this._setKind(layout);

          this._query({
            filters,
            filters_chosen: fields
          });

          return;
        }

      default:
    }
  }

  _activeFilters() {
    return Object.fromEntries(this.chosen.filter(key => this._active(key, this.filters[key])).map(key => [key, copy(this.filters[key])]));
  } // Opening a saved filter puts its fields and conditions on screen; it
  // keeps the search (search AND filters).


  _useSaved(id) {
    const item = this.savedFilter(id);
    if (!item) return;

    this._query({
      saved_filter: String(item.id),
      filters_chosen: Array.isArray(item.fields) ? item.fields.map(String) : Object.keys(item.filters ?? {}),
      filters: copy(item.filters ?? {})
    });

    if (this.open?.kind === "filter") this._renderOpen();
  }

  _savedAction(id, item) {
    if (!item) return;
    if (id === "rename") return this._openKind(`rename:${item.id}`);
    if (this.mode === "phone" && this.open?.kind?.startsWith("saved:")) this._closeOpen();
    if (id === "update") return this.raise("filter.update", {
      id: item.id,
      fields: this.chosen,
      filters: this._activeFilters(),
      ...(item.revision != null ? {
        revision: item.revision
      } : {})
    });
    if (id === "default") return this.raise("filter.default", {
      id: item.id
    });
    if (id === "share") return this.raise("filter.share", {
      id: item.id,
      shared: !item.shared
    });
    if (id === "copy") return this.raise("filter.save", {
      filter: {
        name: `${item.name ?? item.id} ${this.text("headCopySuffix")}`,
        fields: item.fields ?? [],
        filters: copy(item.filters ?? {}),
        shared: false,
        default: false
      }
    });
    if (id === "delete") return this.raise("filter.delete", {
      id: item.id
    });
  }

  _query(patch) {
    this.view.changeQuery(patch, "head");
  }

}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "29f88c884ba1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ROOT: () => (/* binding */ ROOT),
/* harmony export */   acceptLevel: () => (/* binding */ acceptLevel),
/* harmony export */   collapse: () => (/* binding */ collapse),
/* harmony export */   createTree: () => (/* binding */ createTree),
/* harmony export */   dropLevel: () => (/* binding */ dropLevel),
/* harmony export */   expandKnown: () => (/* binding */ expandKnown),
/* harmony export */   hasLevel: () => (/* binding */ hasLevel),
/* harmony export */   knownRecords: () => (/* binding */ knownRecords),
/* harmony export */   markLoading: () => (/* binding */ markLoading),
/* harmony export */   visibleRows: () => (/* binding */ visibleRows)
/* harmony export */ });
// The tree a data view shows when its host answers in levels (data view port
// 1.8.0). The host answers one level at a time -- the roots, or one node's
// children after tree.expand -- and the view keeps what it has been told and
// which nodes are open. The rows the table draws are a walk of that, in order,
// each row knowing its level and its place among its siblings; nothing here
// builds a tree out of a flat dump or decides where a node may go.
const ROOT = "\u0000root";

const keyOf = parent => parent === null || parent === undefined ? ROOT : String(parent);

function createTree() {
  return {
    nodes: new Map(),
    children: new Map(),
    expanded: new Set(),
    loading: new Set()
  };
}
/**
 * One level the host answered: the roots (parent null) or a node's children.
 * `append` keeps the children already known and adds the next page of them.
 */

function acceptLevel(tree, {
  parent = null,
  records = [],
  hasNext = false,
  cursor = null,
  append = false
} = {}) {
  const key = keyOf(parent);

  if (key === ROOT && !append) {
    tree.nodes.clear();
    tree.children.clear();
    tree.loading.clear(); // Open nodes stay open across a re-read: a person who opened a branch
    // and saved a row does not want it closed under them. They are dropped
    // when the node is gone, by the walk, which never reaches them.
  }

  for (const record of records) tree.nodes.set(String(record.id), record);

  const before = append ? tree.children.get(key)?.ids ?? [] : [];
  const seen = new Set(before);
  const ids = [...before, ...records.map(record => String(record.id)).filter(id => !seen.has(id))];
  tree.children.set(key, {
    ids,
    hasNext: Boolean(hasNext),
    cursor: cursor ?? null
  });

  if (key !== ROOT) {
    tree.expanded.add(key);
    tree.loading.delete(key);
  }

  return tree;
}
/** Whether a node's children are already known, so opening it needs no host. */

function hasLevel(tree, id) {
  return tree.children.has(keyOf(id));
}
function collapse(tree, id) {
  tree.expanded.delete(String(id));
  return tree;
}
function expandKnown(tree, id) {
  tree.expanded.add(String(id));
  return tree;
}
function markLoading(tree, id) {
  tree.loading.add(String(id));
  return tree;
}
/** Forget a node's children, so the next opening asks the host again. */

function dropLevel(tree, id) {
  tree.children.delete(keyOf(id));
  tree.expanded.delete(String(id));
  return tree;
}
/**
 * The rows to draw: the known tree walked from the roots through every open
 * node. A row is the record with `__tree` beside it -- the level from 0, whether
 * it has children and is open, and its place among its siblings for
 * aria-setsize and aria-posinset. A level with more to come ends in a row of
 * its own, `__tree.more`, which asks for the next page.
 */

function visibleRows(tree) {
  const rows = [];

  const walk = (key, level) => {
    const entry = tree.children.get(key);
    if (!entry) return;
    entry.ids.forEach((id, index) => {
      const record = tree.nodes.get(id);
      if (!record) return;
      const expanded = tree.expanded.has(id) && tree.children.has(id);
      rows.push({ ...record,
        __tree: {
          level: Number.isInteger(record.level) ? record.level : level,
          hasChildren: record.has_children === true,
          expanded,
          loading: tree.loading.has(id),
          setsize: entry.ids.length,
          posinset: index + 1
        }
      });
      if (expanded) walk(id, level + 1);
    });

    if (entry.hasNext) {
      rows.push({
        id: `__more:${key === ROOT ? "" : key}`,
        __tree: {
          level,
          more: true,
          parent: key === ROOT ? null : key,
          cursor: entry.cursor
        }
      });
    }
  };

  walk(ROOT, 0);
  return rows;
}
/** Every record the tree knows, open or not: what an action is checked against. */

function knownRecords(tree) {
  return [...tree.nodes.values()];
}

/***/ },

/***/ "4d9330f13af8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "13b5af82de47"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "892a0da25239"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("aliases", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("aliases", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "f17a957e50f6"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/manifest-actions", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/manifest-actions", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5ccd44f050bf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/menu-open", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/menu-open", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "15cc710b6cd3"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/preferences", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/preferences", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "cb7ac7caf6a5"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/table-words", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/table-words", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "38d83a636029"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Pagination","runtime":{"action-apply-text":"Apply","action-choose-label":"Choose an action","action-for-all-label":"For all","actions-label":"Action for the selected records","actions-region-label":"Actions for the selected","aria-label":"Result pages","clear-selection-label":"Clear the selection","counting-label":"Counting","cursor-next-text":"Next","first-label":"First","last-label":"Last","next-label":"Next page","next-text":"Next","of-pages":"{page} of {count}","page-field-label":"Page:","page-label":"Page","page-size-label":"Per page:","page-size-text":"{size} per page","pages-label":"Pages:","previous-label":"Previous page","previous-text":"Back","range":"{from}–{to} of {total}","range-many":"{from}–{to} of many","selected-label":"Selected:","show-count-label":"count","show-more-count":"Show {count} more","show-more-text":"Show more","shown":"Showing {shown} of {total}","title-page":"Page {page}","total-label":"Total:"},"events":{"selection-clear":{"label":"Selection cleared"}}}');

/***/ },

/***/ "96e8b718b20a"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Пагинация","events":{"selection-clear":{"label":"Выделение снято"}},"runtime":{"action-apply-text":"Применить","action-choose-label":"Выберите действие","action-for-all-label":"Для всех","actions-label":"Действие с выбранными элементами","actions-region-label":"Действия с отмеченными","aria-label":"Страницы результатов","clear-selection-label":"Снять выделение","counting-label":"Считаем","cursor-next-text":"Дальше","first-label":"В начало","last-label":"Последняя","next-label":"Следующая страница","next-text":"Далее","of-pages":"{page} из {count}","page-field-label":"Страница:","page-label":"Страница","page-size-label":"На странице:","page-size-text":"По {size}","pages-label":"Страницы:","previous-label":"Предыдущая страница","previous-text":"Назад","range":"{from}–{to} из {total}","range-many":"{from}–{to} из многих","selected-label":"Отмечено:","show-count-label":"посчитать","show-more-count":"Показать ещё {count}","show-more-text":"Показать ещё","shown":"Показано {shown} из {total}","title-page":"Страница {page}","total-label":"Всего:"}}');

/***/ },

/***/ "80ad38cb6908"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-view for the shim (core/js/aliases.js, standard §16 item 20).","component":"sf-view","since":"2026-10-27","remove_after":"2027-01-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-view","since":"2026-10-27","remove_after":"2027-01-01","mode":"host-attribute","section":"§3.1, §4.8","note":"stays a host attribute, read for the accessible name; no shim"},{"from":"sf-table-tree-intent","to":"sf-data-view-tree","kind":"event","component":"sf-view","since":"2026-10-27","remove_after":"2027-01-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary §9","note":"the view\'s announcement of the tree\'s port intents carried a table name; the detail {intent, payload} is unchanged"},{"from":"sf-data-view","to":"sf-view","kind":"tag","component":"sf-view","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R2 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-view; sf-data-view is a subclass defined beside it until the date"},{"from":"list-roles","to":null,"kind":"attribute","component":"sf-view","since":"2026-11-10","remove_after":"2027-01-01","mode":"host-attribute","section":"simai.dataview-port 1.15.0 columns[].list (C31)","note":"the host sends each column\'s list role through the port (columns[].list); list-roles still names them for a host on 1.14.0 or earlier, noted in SF.deprecations, until the date"},{"from":"sf-data-view-open","to":"sf-view-open","kind":"event","component":"sf-view","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-data-view-deleted","to":"sf-view-deleted","kind":"event","component":"sf-view","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-data-view-answer","to":"sf-view-answer","kind":"event","component":"sf-view","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-data-view-state","to":"sf-view-state","kind":"event","component":"sf-view","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-data-view-tree","to":"sf-view-tree","kind":"event","component":"sf-view","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-data-view-files-drop","to":"sf-view-files-drop","kind":"event","component":"sf-view","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-data-view-saved-view-intent","to":"sf-view-save","kind":"event","component":"sf-view","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-view-saved-view-intent","to":"sf-view-save","kind":"event","component":"sf-view","since":"2026-11-10","remove_after":"2027-01-01","mode":"same-detail","section":"vocabulary 1.1.5 §9 (save, kind view)","note":"a page\'s request to the view to save a shared saved view; the new detail adds kind: \\"view\\", and a detail without kind is read as a view"},{"from":"sf-data-view-list-open","to":"sf-view-list-open","kind":"event","component":"sf-view","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"}]}');

/***/ },

/***/ "7086146c00cc"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.view","tag":"sf-view","version":"1.40.1","kind":"leaf","settings":{"chrome":{"type":"string","default":"toolbar pagination select settings"},"head":{"type":"enum","values":["","list"],"default":""},"heading":{"type":"string","default":""},"row-cap":{"type":"number","default":0,"integer":true,"min":0},"expected-columns":{"type":"number","default":4,"integer":true,"min":1},"list-shape":{"type":"string","default":""},"port-owner":{"type":"string","default":""},"port-record":{"type":"string","default":""},"port-group":{"type":"string","default":""},"size":{"type":"enum","values":["1/2","1"],"default":"1"},"layout":{"type":"enum","values":["auto","table","list","board","cards","calendar"],"default":"auto"},"layout-switch":{"type":"boolean","default":false},"list-below":{"type":"number","default":600},"quick-actions":{"type":"string","default":""},"row-open":{"type":"enum","values":["title","row"],"default":"title"},"list-roles":{"type":"string","default":""},"column-search-placeholder":{"type":"string"},"column-search-empty-text":{"type":"string"},"column-move-label":{"type":"string"},"filter-apply-text":{"type":"string"},"show-more-text":{"type":"string"},"selected-label":{"type":"string"},"total-label":{"type":"string"},"pages-label":{"type":"string"},"first-label":{"type":"string"},"previous-label":{"type":"string"},"page-label":{"type":"string"},"next-label":{"type":"string"},"last-label":{"type":"string"},"page-field-label":{"type":"string"},"action-choose-label":{"type":"string"},"actions-label":{"type":"string"},"actions-region-label":{"type":"string"},"clear-selection-label":{"type":"string"},"page-size-label":{"type":"string"},"pagination-aria-label":{"type":"string"},"paging":{"type":"enum","values":["pages","more","both","endless"],"default":"both"},"preferences-key":{"type":"string","default":""},"accept-files":{"type":"boolean","default":false},"collection":{"type":"string","default":""},"current":{"type":"string","default":""},"record-card":{"type":"string","default":""},"bulk-actions":{"type":"list","of":{"id":"string","label":"string","icon":{"type":"icon","optional":true}}},"first-answer":{"type":"object","optional":true}},"values":{"state":{"type":"state"},"total":{"type":"number","nullable":true},"selected":{"type":"id","optional":true},"selection":{"type":"list"}},"events":{"open":{"carries":{"id":"id"},"cancelable":true},"deleted":{"carries":{"ids":"list"}},"answer":{"carries":{"intent":{"type":"string"},"answer":{"type":"enum","values":["applied","conflict","refused","unavailable"],"schema":{"type":"string"}},"reason":{"type":"string","optional":true},"message":{"type":"string","optional":true},"data":{"type":"object","optional":true},"sequence":{"type":"number","integer":true,"optional":true},"effects":{"type":"list","optional":true},"instance_id":{"type":"string"}},"own-verb":true},"state":{"carries":{"state":{"type":"enum","values":["loading","populated","empty","error","no-access"],"schema":{"type":"string"}},"message":{"type":"string"},"instance_id":{"type":"string"}},"own-verb":true},"tree":{"carries":{"intent":"string","payload":{"type":"object","optional":true}},"own-verb":true},"files-drop":{"carries":{"files":{"type":"list","schema":{"items":{"type":"object"},"minItems":1}}},"own-verb":true},"pagination-count":{"shared":"count-on-request@1","carries":{"component":{"type":"object"},"tagName":{"type":"string"},"template":{"type":"string"},"reason":{"type":"enum","values":["total","last-page","action-for-all"],"schema":{"type":"string"}},"current":{"type":"number","integer":true},"pageSize":{"type":"number","integer":true}}},"save":{"carries":{"kind":{"type":"enum","values":["view"],"optional":true},"key":{"type":"string"},"label":{"type":"string"},"revision":{"type":"string","schema":{"type":["string","integer"]},"optional":true},"roles":{"type":"object","optional":true}}},"table-action-intent":{"shared":"table-intents@1","carries":{"action_id":{"type":"string","schema":{"minLength":1}},"record_ids":{"type":"list","schema":{"items":{"type":["string","integer"]},"minItems":1}}}},"table-column-settings-change":{"shared":"table-intents@1","carries":{"reason":{"type":"string"},"columnSettings":{"type":"object"},"tableSettingsKey":{"type":"string"},"target":{"type":"enum","values":["personal","shared"],"schema":{"type":"string"},"optional":true},"base_revision":{"type":"string","schema":{"type":["string","number"]},"optional":true}}},"table-column-settings-reset":{"shared":"table-intents@1","carries":{"target":{"type":"enum","values":["personal"],"schema":{"type":"string"}},"tableSettingsKey":{"type":"string","schema":{"type":["string","null"]}}}},"table-create-intent":{"shared":"table-intents@1","carries":{"item":{"type":"string","schema":{"type":["string","null"]}}}},"table-query-intent":{"shared":"table-intents@1","carries":{"reason":{"type":"enum","values":["context"]},"context":{"type":"object"},"sequence":{"type":"number","integer":true,"schema":{"minimum":1}}}},"table-template-delete":{"shared":"table-intents@1","carries":{"key":{"type":"string","schema":{"minLength":1}}}},"table-template-save":{"shared":"table-intents@1","carries":{"templates":{"type":"list","of":{"key":"string","label":"string","selected":"boolean","data":"object","settings":"object"},"schema":{"items":{"type":"object","required":["key","label","settings"],"properties":{"key":{"type":"string"},"label":{"type":"string"},"selected":{"type":"boolean"},"data":{"type":"object"},"settings":{"type":"object","properties":{"filter_fields":{"type":"array","items":{"type":"string"}}}}}},"minItems":1}}},"x-decision":"Event detail that is not a flat object (decision 2026-11-09, control/evidence/2026-11-09-pro-queue): a non-flat detail is a flat carries map whose fields carry the nesting -- §4.2 types, `of` for a list\'s entries and `schema` for what the manifest checks; a detail that is not an object (§8) is carried in a named field, and its old shape stays on the dated alias names with mode split and the element\'s adapter. template-save carries templates, a list of one or more templates; sf-table-template-save and onTemplateSave keep the 1.3 detail (the template object, or the array of them) through sfAliasAdapters. sf-view reads detail.templates and, until 2027-01-01, a bare template or array from a table before sf-view-table 1.16.0."},"table-template-select":{"shared":"table-intents@1","carries":{"key":{"type":"string","schema":{"minLength":1}}}},"host-port-request":{"shared":"host-port@1","carries":{"component":{"type":"object","optional":true},"context":{"type":"object","optional":true}}},"list-open":{"carries":{"reason":{"type":"id","schema":{"enum":["row-cap"]}},"query":{"type":"object"}}},"table-cell-set":{"shared":"table-intents@1","carries":{"id":{"type":"string","schema":{"type":["string","integer"]}},"key":{"type":"string"},"value":{"type":"id"},"revision":{"type":"string","schema":{"type":["string","integer","null"]}}}},"table-rows-reorder":{"shared":"table-intents@1","carries":{"ids":{"type":"list","schema":{"items":{"type":"string"},"minItems":1}},"before":{"type":"string","schema":{"type":["string","null"]}},"order":{"type":"list","schema":{"items":{"type":"string"}}}}},"display-change":{"carries":{"kind":{"type":"enum","values":["table","board","cards","calendar","list","tree"]},"previous":{"type":"string"}},"cancelable":true},"settings-open":{"carries":{"id":{"type":"enum","values":["rights","export","record-field-add"]}}}},"actions":{"refresh":{"with":{"reason":{"type":"string","optional":true}}},"change-query":{"with":{"patch":"object","reason":{"type":"string","optional":true}},"concurrency":"latest"},"open-view":{"with":{"key":"string"}},"save-view":{"with":{"view":{"type":"object"}},"concurrency":"drop"},"delete-view":{"with":{"key":"string"},"concurrency":"drop"},"apply-under-filter":{"with":{"action-id":"string","confirmed-total":"number"},"concurrency":"drop"},"reset-column-settings":{},"clear-selection":{},"notify":{"with":{"text":"string","options":{"type":"object","optional":true}}}},"port":{"id":"simai.dataview-port","version":"1.15.0","contract":"src/core/contracts/ports/simai.dataview-port/1.15.0/port.json"},"presentation":{"skeleton":{"late":[]}},"css-variables":{"--sf-data-view-gap":{"type":"length","state":"default"},"--sf-data-view-drop-border-color":{"type":"color","state":"dragged-over"},"--sf-data-view-drop-background-color":{"type":"color","state":"dragged-over"},"--sf-data-view-drop-color":{"type":"color","state":"dragged-over"},"--sf-data-view-toolbar-gap":{"type":"length","state":"default"}},"host-states":{"data-state":"string","aria-busy":"string"}}');

/***/ },

/***/ "ce0305e57fa5"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Data view","events":{"answer":{"label":"The host answered"},"state":{"label":"List state"},"tree":{"label":"Tree request"},"files-drop":{"label":"Files dropped on the list"},"display-change":{"label":"Display kind changed"},"settings-open":{"label":"List setting asked"}},"runtime":{"cancel":"Cancel","close-notice-label":"Close the message","confirm-apply":"Confirm","confirm-title":"Confirm the change","create-child-action":"Add a nested one","drop-files":"Drop the files here to upload them","empty-text":"No data","head-apply":"Apply","head-cancel":"Cancel","head-card-fields":"Card fields","head-card-labels":"Field labels","head-card-size":"Card size","head-clear":"Clear","head-colour-field":"Record colour by field","head-colour-none":"No colour","head-columns":"Columns","head-copy":"Duplicate","head-copy-suffix":"(copy)","head-count":"Records: {count}","head-create":"Create","head-date-field":"Date that places a record","head-default-mark":"Default","head-delete":"Delete","head-density":"Density","head-density-compact":"Compact","head-density-normal":"Normal","head-display":"Display","head-display-menu":"Display and views","head-empty-lanes":"Show empty lanes","head-lanes":"Lanes on the board","head-export":"Export","head-favorite-add":"Add to favourites","head-favorite-remove":"Remove from favourites","head-fields-tab":"Fields","head-filter":"Filter","head-filter-actions":"Actions on the filter «{name}»","head-filter-changed":"(changed, not saved)","head-filter-named":"Filter: {name}","head-kind-board":"Kanban","head-kind-calendar":"Calendar","head-kind-cards":"Cards","head-kind-list":"List","head-kind-table":"Table","head-kind-tree":"Tree","head-lane-field":"Board lanes by field","head-level-personal":"Mine","head-level-shared":"For everyone","head-level-system":"System","head-lines":"Lines between columns","head-list-menu":"More: list settings","head-locked":"Locked by the administrator","head-look":"View","head-make-default":"Make default","head-no-saved":"No saved filters yet.","head-paging":"Loading","head-paging-both":"Both","head-paging-endless":"Endless","head-paging-more":"«Show more»","head-paging-pages":"By pages","head-record-fields":"Record field settings","head-remove-field":"Remove the field «{name}»","head-rename":"Rename","head-reset":"Reset","head-rights":"Access rights","head-row-actions":"Row actions","head-save":"Save","head-save-default":"Make default","head-save-filter":"Save filter","head-save-name":"Name","head-save-note":"The fields and their values are saved, without the search text.","head-save-shared":"Save for everyone","head-save-shared-hint":"Everyone with access to the list will see it","head-save-view-note":"The presentation, columns, sort order and page size are saved, without the filter conditions or the search.","head-saved-tab":"Saved","head-search":"Search","head-share":"Share with everyone","head-shared-mark":"Shared","head-single-line":"Text on one line","head-size-l":"Large","head-size-m":"Medium","head-size-s":"Small","head-unshare":"Only for me","head-update":"Update","head-update-filter":"Update «{name}»","head-view-changed":"Save","head-view-new":"Save the view","head-view-new-name":"New view","head-view-reset":"Reset changes","head-view-save-all":"Save for everyone","head-view-save-mine":"Save as mine","head-view-save-new":"Save as new","head-view-state":"View state","head-view-state-mine":"Changed. Saved only for you; everyone else sees «{name}» as it was.","head-view-state-none":"«{name}»: no changes.","head-view-state-unsaved":"Changed, not saved: everyone still sees «{name}» as it was.","head-view-unsaved":"changed, not saved","head-view-zone":"View: {name}","head-view-zone-none":"View","head-views":"Views","layout-label":"Data view","move-action":"Move…","move-apply":"Move","move-first":"First","move-last":"Last","move-no-targets":"There is nowhere this record can be moved.","move-place":"Place","move-root":"To the top level","move-title":"Move «{label}»","notice-action-not-allowed":"That action is not available for the chosen record.","notice-capability-not-provided":"The host does not support that action.","notice-confirm-required":"The action has to be confirmed first.","notice-conflict":"The data changed. Read the view again and repeat the action.","notice-failed":"The action was not carried out.","notice-fetch-failed":"The data could not be fetched. Try again.","notice-forbidden":"You may not do this.","notice-load-failed":"The data could not be loaded.","notice-no-base-revision":"The settings cannot be saved yet: the view has no current version of them. Read the view again.","notice-not-confirmed":"The action was cancelled.","notice-port-not-connected":"The data source is not connected.","notice-record-invalid":"The record was not found.","notice-refused":"The action was refused.","notice-saved-view-levels":"Shared views need a newer port.","notice-stale-revision":"Someone changed this in the meantime. Read the view again and repeat the action.","notice-unavailable":"The action is unavailable.","of-total":"{shown} of {total}","records-label":"Records","show-all":"Show all","state-load-failed":"The data could not be loaded","state-loading":"Loading","state-port-not-connected":"The data port is not connected","state-query-failed":"The request could not be completed","state-unavailable":"The data is temporarily unavailable","unnamed-action":"Action"}}');

/***/ },

/***/ "3e9dffe84919"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Представление данных","events":{"answer":{"label":"Ответ хоста"},"state":{"label":"Состояние списка"},"tree":{"label":"Запрос ветви дерева"},"files-drop":{"label":"Файлы брошены на список"},"display-change":{"label":"Сменён вид показа"},"settings-open":{"label":"Запрошена настройка списка"}},"runtime":{"cancel":"Отмена","close-notice-label":"Закрыть сообщение","confirm-apply":"Подтвердить","confirm-title":"Подтвердите изменение","create-child-action":"Добавить вложенную","drop-files":"Отпустите, чтобы загрузить файлы сюда","empty-text":"Нет данных","head-apply":"Применить","head-cancel":"Отменить","head-card-fields":"Поля на карточке","head-card-labels":"Подписи полей","head-card-size":"Размер карточек","head-clear":"Очистить","head-colour-field":"Цвет записи — по полю","head-colour-none":"Без цвета","head-columns":"Колонки","head-copy":"Дублировать","head-copy-suffix":"(копия)","head-count":"Записей: {count}","head-create":"Создать","head-date-field":"Дата, по которой стоит запись","head-default-mark":"По умолчанию","head-delete":"Удалить","head-density":"Плотность","head-density-compact":"Компактная","head-density-normal":"Обычная","head-display":"Вид показа","head-display-menu":"Вид показа и представления","head-empty-lanes":"Показывать пустые колонки","head-lanes":"Колонки на доске","head-export":"Экспорт","head-favorite-add":"Добавить в избранное","head-favorite-remove":"Убрать из избранного","head-fields-tab":"Поля","head-filter":"Фильтр","head-filter-actions":"Действия с фильтром «{name}»","head-filter-changed":"(изменён, не сохранён)","head-filter-named":"Фильтр: {name}","head-kind-board":"Канбан","head-kind-calendar":"Календарь","head-kind-cards":"Карточки","head-kind-list":"Список","head-kind-table":"Таблица","head-kind-tree":"Дерево","head-lane-field":"Колонки доски — по полю","head-level-personal":"Мои","head-level-shared":"Для всех","head-level-system":"Системные","head-lines":"Линии между столбцами","head-list-menu":"Ещё: настройки списка","head-locked":"Закрыл администратор","head-look":"Вид","head-make-default":"Сделать по умолчанию","head-no-saved":"Сохранённых фильтров пока нет.","head-paging":"Подгрузка","head-paging-both":"Вместе","head-paging-endless":"Бесконечно","head-paging-more":"«Показать ещё»","head-paging-pages":"Страницами","head-record-fields":"Настройки полей записи","head-remove-field":"Убрать поле «{name}»","head-rename":"Переименовать","head-reset":"Сбросить","head-rights":"Права доступа","head-row-actions":"Действия в строке","head-save":"Сохранить","head-save-default":"Сделать по умолчанию","head-save-filter":"Сохранить фильтр","head-save-name":"Название","head-save-note":"Сохранятся поля и их значения, без текста поиска.","head-save-shared":"Сохранить для всех","head-save-shared-hint":"Увидят все, у кого есть доступ к списку","head-save-view-note":"Сохранятся вид, колонки, сортировка и число строк на странице, без условий фильтра и поиска.","head-saved-tab":"Сохранённые","head-search":"Поиск","head-share":"Поделиться со всеми","head-shared-mark":"Общий","head-single-line":"Текст в одну строку","head-size-l":"Крупные","head-size-m":"Средние","head-size-s":"Малые","head-unshare":"Только для меня","head-update":"Обновить","head-update-filter":"Обновить «{name}»","head-view-changed":"Сохранить","head-view-new":"Сохранить представление","head-view-new-name":"Новое представление","head-view-reset":"Сбросить изменения","head-view-save-all":"Сохранить для всех","head-view-save-mine":"Сохранить как моё","head-view-save-new":"Сохранить как новое","head-view-state":"Состояние представления","head-view-state-mine":"Изменено. Сохранено только для вас; остальные видят «{name}» как было.","head-view-state-none":"«{name}»: изменений нет.","head-view-state-unsaved":"Изменено и не сохранено: у всех «{name}» остаётся как было.","head-view-unsaved":"изменено, не сохранено","head-view-zone":"Представление: {name}","head-view-zone-none":"Представление","head-views":"Представления","layout-label":"Представление данных","move-action":"Переместить…","move-apply":"Переместить","move-first":"Первым","move-last":"Последним","move-no-targets":"Эту запись некуда переместить.","move-place":"Место","move-root":"На верхний уровень","move-title":"Переместить «{label}»","notice-action-not-allowed":"Это действие недоступно для выбранной записи.","notice-capability-not-provided":"Хост не поддерживает это действие.","notice-confirm-required":"Действие нужно сначала подтвердить.","notice-conflict":"Данные изменились. Обновите представление и повторите действие.","notice-failed":"Действие не выполнено.","notice-fetch-failed":"Не удалось получить данные. Повторите попытку.","notice-forbidden":"Недостаточно прав для этого действия.","notice-load-failed":"Не удалось загрузить данные.","notice-no-base-revision":"Настройки пока нельзя сохранить: у представления нет их текущей версии. Обновите представление.","notice-not-confirmed":"Действие отменено.","notice-port-not-connected":"Источник данных не подключён.","notice-record-invalid":"Запись не найдена.","notice-refused":"Действие отклонено.","notice-saved-view-levels":"Общие виды требуют более новой версии порта.","notice-stale-revision":"Данные успели изменить. Обновите представление и повторите действие.","notice-unavailable":"Действие недоступно.","of-total":"{shown} из {total}","records-label":"Записи","show-all":"Показать все","state-load-failed":"Не удалось загрузить данные","state-loading":"Загрузка данных","state-port-not-connected":"Порт данных не подключён","state-query-failed":"Запрос не выполнен","state-unavailable":"Данные временно недоступны","unnamed-action":"Действие"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("36b027867bab");
/******/
/******/ })()
;