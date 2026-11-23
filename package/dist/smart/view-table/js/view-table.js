/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "557c99eb8f3a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   focusTarget: () => (/* binding */ focusTarget),
/* harmony export */   roving: () => (/* binding */ roving)
/* harmony export */ });
// One Tab stop for a row of controls, and the arrows between them (owner
// decision C184 (1)-(3), 2026-11-14; study control/research/2026-11-14-
// toolbar-menu-open.md, K-02). A toolbar is not a component of its own
// (C155 (8): no sf-toolbar): it is ordinary sf-button-icon groups, 4 apart
// inside a group and a separator between groups (C144), and this helper gives
// them the keyboard of the WAI-ARIA toolbar pattern:
//
// - the row is one Tab stop; Tab comes back to the control the person left
//   (memory, C184 (3)), or to the first one (memory: false);
// - the arrows of the row's orientation move between the controls, in the
//   row's direction (right-to-left reverses ← and →), Home and End go to the
//   ends, and the walk wraps;
// - a control that cannot be used now (aria-disabled) stays in the walk,
//   dimmed by its component, with its reason as a tooltip (C184 (2), as
//   C164 (4) does for a menu row); disabled: 'skip' leaves it out. A control
//   with the native disabled attribute cannot take the focus and is skipped;
// - a control inside «Ещё» (the C155 row engine marks the part that left the
//   row with .out or [hidden]) is not in the walk;
// - ↓ (↑) on a menu button of a horizontal row opens its menu, as the
//   pattern's menu button does.
//
// It is also the list's keyboard (C184 (5)): a list is one Tab stop and ↑ ↓
// move between its rows (orientation 'vertical').
//
// roving(container, options) -> {refresh, set, current, items, destroy}.
// The look stays with the components; this module holds no state of its own
// outside the controller it returns, so every bundle may carry its own copy.
const NATIVE_FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex], [contenteditable=""], [contenteditable="true"]';
const OUT = '.out, [hidden], [data-sf-out], [inert]'; // The element that takes the focus for an item: the item itself when it can
// (a <button>, a row with a tabindex), else the control inside it -- an
// sf-button-icon host draws a <button> and is display: contents.

function focusTarget(item) {
  if (!item) return null;
  if (item.matches?.(NATIVE_FOCUSABLE)) return item;
  return item.querySelector?.('button, a[href], [role="button"], [tabindex]') ?? item;
}

const isUnavailable = target => target.getAttribute?.('aria-disabled') === 'true';

const isDisabled = target => Boolean(target.disabled) || target.matches?.(':disabled');

function roving(container, {
  items: itemsOf = 'button',
  orientation = 'horizontal',
  wrap = true,
  disabled = 'focusable',
  memory = true,
  out = OUT,
  onMove = null,
  observe = true
} = {}) {
  let current = null; // Every item of the row, in order, as the targets that take the focus.

  const all = () => {
    const found = typeof itemsOf === 'function' ? itemsOf() : [...container.querySelectorAll(itemsOf)];
    const targets = [];

    for (const item of found) {
      const target = focusTarget(item);
      if (!target || !container.contains(target) || targets.includes(target)) continue; // Out of the row: a part inside it that left (into «Ещё») or is
      // hidden. The row itself being hidden for now does not count.

      const away = target.closest(out);
      if (away && away !== container && container.contains(away)) continue;
      targets.push(target);
    }

    return targets;
  }; // The items the walk stops on.


  const items = () => all().filter(target => !isDisabled(target) && (disabled === 'focusable' || !isUnavailable(target)));

  function set(element) {
    const target = focusTarget(element);
    const every = all();
    if (!target || !every.includes(target)) return;
    current = target;

    for (const other of every) {
      const next = other === target ? '0' : '-1';
      if (other.getAttribute('tabindex') !== next) other.setAttribute('tabindex', next);
    }
  } // After a drawing or a change of the row: the one Tab stop is the item
  // remembered, or the first one when it is gone (or the row forgets).


  function refresh() {
    const list = items();

    if (!list.length) {
      // Nothing to stop on: no item keeps a stop either (a disabled field's
      // toolbar is not a Tab stop).
      for (const other of all()) if (other.getAttribute('tabindex') !== '-1') other.setAttribute('tabindex', '-1');

      current = null;
      return;
    }

    set(current && list.includes(current) ? current : list[0]);
  }

  const vertical = orientation === 'vertical';
  const both = orientation === 'both';

  function onKeydown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const list = items();
    const target = list.find(one => one === event.target || one.contains(event.target));
    if (!target) return; // A field inside an item (a link's address) keeps its own keys.

    if (event.target !== target && event.target.matches?.('input, textarea, select, [contenteditable="true"], [contenteditable=""]')) return;
    const rtl = getComputedStyle(container).direction === 'rtl';
    const forward = vertical ? ['ArrowDown'] : both ? ['ArrowDown', rtl ? 'ArrowLeft' : 'ArrowRight'] : [rtl ? 'ArrowLeft' : 'ArrowRight'];
    const back = vertical ? ['ArrowUp'] : both ? ['ArrowUp', rtl ? 'ArrowRight' : 'ArrowLeft'] : [rtl ? 'ArrowRight' : 'ArrowLeft'];
    const at = list.indexOf(target);
    let next = null;

    if (!vertical && !both && (event.key === 'ArrowDown' || event.key === 'ArrowUp') && target.getAttribute('aria-haspopup') === 'menu' && !isUnavailable(target)) {
      event.preventDefault();
      target.click();
      return;
    }

    if (forward.includes(event.key)) next = at + 1 < list.length ? list[at + 1] : wrap ? list[0] : null;else if (back.includes(event.key)) next = at > 0 ? list[at - 1] : wrap ? list[list.length - 1] : null;else if (event.key === 'Home') next = list[0];else if (event.key === 'End') next = list[list.length - 1];else return;
    event.preventDefault();
    if (!next || next === target) return;
    set(next);
    next.focus();
    onMove?.(next, event.key);
  }

  function onFocusIn(event) {
    const target = all().find(one => one === event.target);
    if (!target || target === current) return;
    set(target);
    onMove?.(target, 'focus');
  }

  function onFocusOut(event) {
    if (memory || container.contains(event.relatedTarget)) return;
    const list = items();
    if (list.length) set(list[0]);
  }

  container.addEventListener('keydown', onKeydown);
  container.addEventListener('focusin', onFocusIn);
  container.addEventListener('focusout', onFocusOut); // Items drawn later -- a host that draws its <button> on its own schedule
  // (sf-button-icon), a row added -- join the walk with tabindex -1 at once:
  // the row stays one Tab stop whatever draws when.

  let queued = false;
  const watcher = observe && typeof MutationObserver === 'function' ? new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      refresh();
    });
  }) : null;
  watcher?.observe(container, {
    childList: true,
    subtree: true
  });
  refresh();
  return {
    refresh,
    set,
    items,

    get current() {
      return current;
    },

    destroy() {
      watcher?.disconnect();
      container.removeEventListener('keydown', onKeydown);
      container.removeEventListener('focusin', onFocusIn);
      container.removeEventListener('focusout', onFocusOut);
    }

  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (roving);

/***/ },

/***/ "926043d18700"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   getElementRowGap: () => (/* binding */ getElementRowGap),
/* harmony export */   getParent: () => (/* binding */ getParent),
/* harmony export */   setParentSpace: () => (/* binding */ setParentSpace)
/* harmony export */ });
function getElementRowGap(element) {
  return parseFloat(getComputedStyle(element).rowGap) || 0;
}
function setParentSpace(items) {
  const firstRef = items.values().next().value;
  const firstValue = firstRef?.value;
  if (!firstValue) return;
  const parent = firstValue.parentNode;
  if (!parent) return;
  return {
    gap: getElementRowGap(parent),
    item: firstValue,
    parent: parent
  };
}
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
          args = arguments;

    const later = () => {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
function getParent(item) {
  let current = item;

  while (current) {
    if (current.nodeName.toLowerCase().startsWith('sf-')) {
      return current.parentNode;
    }

    current = current.parentNode;
  }

  return null;
}

/***/ },

/***/ "870b5dfddc25"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setLoaderDragState: () => (/* binding */ setLoaderDragState)
/* harmony export */ });
function setLoaderDragState(value) {
  if (typeof SF === "undefined" || !SF.Loader) return;
  const loader = SF.Loader;
  const currentCount = Number(loader.dragObserverLockCount || 0);
  loader.dragObserverLockCount = value ? currentCount + 1 : Math.max(currentCount - 1, 0);
  loader.stopObserver = loader.dragObserverLockCount > 0;
}

/***/ },

/***/ "94d60d3691b5"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f17a957e50f6");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("c1f17ed5a348");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f8651e83c6c6");
/* harmony import */ var _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("cb7ac7caf6a5");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("9d9caaf4f796");
/* harmony import */ var _view_common_option_badge_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("0424da74c465");
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("06a40de06677");
/* harmony import */ var _view_common_field_html_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("45c4feb4b071");
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("8137feb490e0");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _helpers_dom__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("926043d18700");
/* harmony import */ var _helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("870b5dfddc25");
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("116963e5e31b");
/* harmony import */ var _core_js_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("bf0cea966575");
/* harmony import */ var _core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("18003344cff0");
/* harmony import */ var _view_common_density_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("d0f17721f295");
/* harmony import */ var _view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("5ccd44f050bf");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _core_js_roving_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("557c99eb8f3a");
/* harmony import */ var _view_common_preferences_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("15cc710b6cd3");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__, _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__, _view_common_option_badge_js__WEBPACK_IMPORTED_MODULE_7__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_8__, _view_common_field_html_js__WEBPACK_IMPORTED_MODULE_9__, lit__WEBPACK_IMPORTED_MODULE_10__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_11__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_12__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_15__, _core_js_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_16__, _core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_17__, _view_common_density_js__WEBPACK_IMPORTED_MODULE_18__, _view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_19__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_20__, _view_common_preferences_js__WEBPACK_IMPORTED_MODULE_22__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__, _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_5__, _js_templates_default__WEBPACK_IMPORTED_MODULE_6__, _view_common_option_badge_js__WEBPACK_IMPORTED_MODULE_7__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_8__, _view_common_field_html_js__WEBPACK_IMPORTED_MODULE_9__, lit__WEBPACK_IMPORTED_MODULE_10__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_11__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_12__, _core_js_position_js__WEBPACK_IMPORTED_MODULE_15__, _core_js_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_16__, _core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_17__, _view_common_density_js__WEBPACK_IMPORTED_MODULE_18__, _view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_19__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_20__, _view_common_preferences_js__WEBPACK_IMPORTED_MODULE_22__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_view_common_table_words_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _view_common_option_badge_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_view_common_option_badge_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _view_common_field_html_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_html_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _core_js_position_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_core_js_position_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _core_js_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_core_js_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _view_common_density_js__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_view_common_density_js__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var _view_common_preferences_js__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(_view_common_preferences_js__WEBPACK_IMPORTED_MODULE_22__);




 // Its dictionaries come through the package core: sf-view reads two of their
// words too (view modular step 1).














 // The local day of a date ("2026-11-19") or a date and time (ISO 8601) for
// the relative date template: a date alone is that day where the page is, a
// moment is the day it falls on there. null for anything else.

function relativeDay(value) {
  const text = typeof value === "string" ? value.trim() : "";
  const date = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(text);
  if (date) return new Date(Number(date[1]), Number(date[2]) - 1, Number(date[3]));
  if (!/^\d{4}-\d{2}-\d{2}T/u.test(text)) return null;
  const moment = new Date(text);
  if (Number.isNaN(moment.getTime())) return null;
  return new Date(moment.getFullYear(), moment.getMonth(), moment.getDate());
}




 // Sized for what they hold rather than for reading, so they take no floor.
// Every word this table says, in the two languages the Framework speaks. The
// rule is the shared one -- `pageText` reads the nearest [lang] and falls back
// to the document's -- and it is here because the table said only Russian: on
// an English page the list's toolbar read «Фильтр» and «Создать» beside a
// record panel that had switched, which is the sort of thing only a language
// switch in an admin shows (owner, 2026-10-10).
//
// An attribute still wins over both: a consumer who names a word names it.
// SF.Preferences, the Framework's one store of view preferences (core
// publishes it; this bundle's copy is the fallback).

const preferences = () => globalThis.SF?.Preferences || (_view_common_preferences_js__WEBPACK_IMPORTED_MODULE_22___default());

const tablePreferenceKey = key => `sf-table/${String(key).replace(/[^\w.:-]+/gu, "-")}`; // The id prefix of the entries a host listed for one row action (CM-8).


const ROW_MENU_ITEM = "listed:"; // What a cell may draw as markup rather than as an element of its own.

const LIGHT_CELL_TAGS = new Set(["sf-badge", "sf-tag", "sf-avatar"]); // How long the content table of an sf-view waits for the view's code before
// it draws on its own (saved-views r2, D2), and the grace after the view's
// script errs, for the Loader's one try of the module's other form.

const VIEW_WAIT_MS = 3000;
const VIEW_SCRIPT_RETRY_MS = 500;
const VIEW_SCRIPT = /\/view\/js\/view(?:\.min)?\.js(?:[?#]|$)/u;
const GENERAL_TABLE_PREFERENCE = "sf-table/*";
const TABLE_VIEW_DEFAULTS = Object.freeze({
  density: "normal",
  stripes: false,
  lines: false,
  singleLine: false,
  stickyHead: true
}); // The nearest box that scrolls vertically above an element, across shadow
// roots; null when it is the page.
// A list row's own menu button: «≡» of a plain list, «⋯» of a list with
// quick actions.

const LIST_ROW_MENU_BUTTON = "[data-sf-row-menu], .sf-table-list-menu button"; // The areas the row menu is bound to by sf-menu-context's `for` (C164; SIMAI
// Framework sf-menu-context 1.21.0): the table and the list of each table on
// the page, by an id of their own.

let ROW_AREA_COUNT = 0; // A key cell (owner decision C259, variant Б): a column the host marks
// `key_cell: true` stays in the row of a table with row actions on a phone,
// where every other column goes; `key_line` names the column whose value is
// the key cell's second line there (the client under an order). The names
// follow the Framework's .table-key and .table-key-line (utility.table 1.7.0).

const isKeyCell = column => column?.key_cell === true || column?.keyCell === true;

const keyLineOf = column => {
  const line = column?.key_line ?? column?.keyLine;
  return typeof line === "string" && line ? line : null;
}; // Below the md step of the breakpoint ladder (44rem), where the row menu is
// the bottom sheet (C164 (6)), a keyed table with row actions keeps its key
// cells (C259).


const KEYED_NARROW_REM = 44;

function verticalScroller(element) {
  for (let node = element; node; node = node.parentElement ?? node.getRootNode?.()?.host ?? null) {
    if (node === document.body || node === document.documentElement) return null;
    const style = getComputedStyle(node);
    if (/(auto|scroll|overlay)/u.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1) return node;
  }

  return null;
} // The words are the language files' (lang/<locale>.json, standard 1.3.8 §11),
// read here under the camelCase keys a product registers more languages by
// (SF.language.register("sf-view-table", code, {filterText: …})).


const camelWords = (words = {}) => Object.fromEntries(Object.entries(words).map(([key, word]) => [key.replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase()), word]));

const TABLE_TEXT = {
  en: camelWords(_view_common_table_words_js__WEBPACK_IMPORTED_MODULE_5__.en.runtime),
  ru: camelWords(_view_common_table_words_js__WEBPACK_IMPORTED_MODULE_5__.ru.runtime)
};
const SYSTEM_COLUMN_KEYS = new Set(["select", "settings", "actions"]); // The list of resources (C31): a column's place in a list row, and what a
// status value and a fact's status mean there.

const LIST_ROLES = new Set(["status", "title", "supporting", "fact", "hidden"]);
const MAX_QUICK_ACTIONS = 3; // The column types whose values are numbers (C146 (3)): end-aligned, digits of
// one width, never wrapped.

const NUMBER_TYPES = new Set(["integer", "number", "money", "percent"]);
const STATUS_DOTS = Object.freeze({
  ok: "success",
  warning: "warning",
  error: "error",
  stopped: "neutral",
  success: "success",
  danger: "error",
  neutral: "neutral",
  info: "info",
  primary: "primary"
});
const STATUS_WORDS = Object.freeze({
  ok: "statusOk",
  warning: "statusWarning",
  error: "statusError",
  stopped: "statusStopped"
}); // sort="key:asc" (owner decision C296): the attribute's short form, a list of
// one; null when it is not that form (the JSON list keeps working).

function parseSortText(text) {
  const match = /^\s*([^:\s][^:]*?)\s*:\s*(asc|desc)\s*$/u.exec(String(text ?? ""));
  return match ? [{
    key: match[1],
    direction: match[2]
  }] : null;
} // The table's former container settings (C296, VT-13), dated until 2027-01-01.


const CONTAINER_SETTINGS = ["toolbar", "pagin", "filter-templates", "filter-text", "clear-text", "search-placeholder", "create-text", "creatable", "pagination-total", "pagination-page-size", "page-sizes", "filter-apply-text", "layout-switch"];
const CONTAINER_SETTING_HOME = {
  "pagin": "sf-pagination",
  "pagination-total": "sf-pagination total",
  "pagination-page-size": "sf-pagination page-size",
  "page-sizes": "sf-pagination page-sizes"
}; // The short fields edited at the cell (C296 q-edit).

const SHORT_EDIT_TYPES = new Set(["choice", "enum", "select", "user", "date", "datetime", "number", "integer", "money"]); // The schemes a fact's badge takes from its option (C140 (2)).

const BADGE_SCHEMES = new Set(["neutral", "primary", "secondary", "success", "info", "warning", "error"]);
const FACT_LEVELS = Object.freeze({
  warning: 1,
  error: 2
});

const positioning = () => globalThis.SF?.Position || (_core_js_position_js__WEBPACK_IMPORTED_MODULE_15___default()); // Published Composition ports (simai.composition.port-manifest.v1, sf-view-table@1.0.0).


const SF_TABLE_PORTS = Object.freeze({
  outputs: Object.freeze({
    selection: "record-ids.v1"
  }),
  inputs: Object.freeze({
    context: "record-ids.v1"
  })
});
const MAX_PORT_RECORD_IDS = 1000;

function hasControlCharacter(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code < 32 || code === 127) return true;
  }

  return false;
}

function checkedRecordIds(value) {
  if (!Array.isArray(value) || value.length > MAX_PORT_RECORD_IDS || Array.from(value).some(id => !(typeof id === "string" && id.length > 0 && id.length <= 256 && !hasControlCharacter(id) || Number.isSafeInteger(id))) || new Set(Array.from(value, id => `${typeof id}:${id}`)).size !== value.length) {
    throw new TypeError("Record identities must be unique nonempty strings or safe integers");
  }

  return Object.freeze([...value]);
} // Two tables on one page share nothing: ids, the settings key fallback and the
// portal are all derived from this counter, never from the component name.


let tableInstances = 0; // Many entries (standard simai.smart-component 1.3.8 §18.4; the quality
// profile 1.3.6-1, gate 17): from this many rows the table draws only the rows
// in view and a margin around them. The row height is measured from a drawn
// row; until one is drawn it is guessed.

const WINDOW_FROM = 300;
const WINDOW_MARGIN = 20;
const WINDOW_INITIAL = 60;
const ROW_HEIGHT_GUESS = 40;
const LONG_TEXT_CELL_TYPES = new Set(['text', 'textarea', 'markdown', 'html']); // The box a cell value is drawn in: a Smart element that is display: contents
// (sf-tag) has none of its own, so its first child is the one measured and
// folded.

function cellValueBox(item) {
  return getComputedStyle(item).display === 'contents' ? item.firstElementChild ?? item : item;
} // sf-view-table from its component.json (standard simai.smart-component 1.3.8 §3,
// §4, §8, §11, §18): the settings are attributes and properties, the actions
// answer outcomes, the events take the vocabulary's verbs and the old names
// follow once through the dated aliases (aliases.json). The table's own props
// below keep their parsers and defaults; what they do not name is the
// manifest's.
// A column's content width, as the laid-out table gives it. It is no longer
// rounded up to the 4px grid with a pixel to spare: the printed first paint
// carries no measured width (standard 1.3.9 §5.4) and lays the same columns
// out by their content in the page's own face (default.css, the unmeasured
// content-sized table), so a rounded width moved every printed cell a few
// pixels when the code measured (gate 24, typed-cells: CLS 0.035 at 1280).
// A face that comes later measures again (the fonts' loadingdone).


function contentStep(width) {
  return Math.ceil(width * 64) / 64;
} // The common width the widest columns come down to so that together they give
// `need` pixels (readFittedWidths): the highest whole width at which the
// columns over it, each held at its least, give at least that much. Each entry
// is [key, width, spare], spare being what the column holds over its least.


function fittingLevel(columns, need) {
  const gives = level => columns.reduce((sum, [, width, spare]) => sum + width - Math.max(Math.ceil(width - spare), Math.min(Math.floor(width), level)), 0);

  let low = 0;
  let high = Math.ceil(Math.max(0, ...columns.map(([, width]) => width)));

  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (gives(middle) >= need) low = middle;else high = middle - 1;
  }

  return low;
}

const TableElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_5__.en,
    ru: _view_common_table_words_js__WEBPACK_IMPORTED_MODULE_5__.ru
  },
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
}); // template-save carries {templates} (1.16.0); its former names keep the 1.3
// detail, the template itself or the array of them, until their dates.

const formerTemplateDetail = detail => detail?.templates?.length === 1 ? detail.templates[0] : detail?.templates; // Whether a row of the current set would stand at another index in the next:
// a row kept by id and drawn elsewhere is a layout shift.


function rowsWouldMove(current, next) {
  const at = new Map();
  current.forEach((row, index) => {
    if (row?.id !== undefined && row?.id !== null) at.set(String(row.id), index);
  });
  return next.some((row, index) => {
    if (row?.id === undefined || row?.id === null) return false;
    const was = at.get(String(row.id));
    return was !== undefined && was !== index;
  });
}

class SfTable extends TableElement {
  static get sfPorts() {
    return SF_TABLE_PORTS;
  }

  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      ariaLabel: {
        attribute: "aria-label",
        default: "Data table"
      },
      // The row the page has open (component.json settings.current).
      current: {
        attribute: "current",
        default: ""
      },
      selectable: {
        type: Boolean,
        default: true
      },
      // The count of records under the filter, when the host knows it
      // (owner decision C296): the grid's aria-rowcount (VT-4) and the
      // «all N» of the bar of group actions. 0: not known.
      total: {
        type: Number,
        default: 0
      },
      // How many records of the filter come before the first row drawn
      // (a data view's page 2 and on): the rows' aria-rowindex count
      // from it, so a grid of total + 1 rows says where each row is
      // (VT-4, VR2-8). 0: the rows drawn start the list.
      rowOffset: {
        attribute: "row-offset",
        type: Number,
        default: 0
      },
      // Who owns the vertical scroll. `self` keeps the rows in their own
      // scroll area, which is what a host that bounds the table's height
      // wants and what every page has had so far. `page` gives the
      // vertical scroll to the document, so the head stays visible while
      // the page scrolls; the rows then scroll sideways only.
      verticalScroll: {
        attribute: 'vertical-scroll',
        default: 'self',
        values: ['self', 'page']
      },
      // How the records are drawn. `auto` is a table while the table's own
      // container is at least `list-below` pixels wide and a compact list
      // of records below that -- a phone, or a list beside an open panel;
      // `table` and `list` hold one of them whatever the width (owner,
      // 2026-10-12: one mobile view, the compact list). A table is a table
      // unless asked: sf-view asks for auto on a page's list.
      // Auto by default since 1.19.0 (owner decisions C31, C146; TB-11 of
      // the table study): a table alone on a phone stayed a table, wider
      // than the screen, with the box and the menu covering the title.
      // `table` keeps a table at every width; then a narrow box scrolls
      // it sideways with the first column standing still (C146 (9)).
      layout: {
        default: 'auto',
        values: ['auto', 'table', 'list']
      },
      listBelow: {
        attribute: 'list-below',
        type: Number,
        default: 600
      },
      // How many fields a record shows under its title in the list, chosen
      // by the columns' priority (lower first).
      listFields: {
        attribute: 'list-fields',
        type: Number,
        default: 3
      },
      // The list of resources (owner decision C31, 2026-11-09). The row
      // actions drawn in a list row as icon buttons, always visible (at
      // most three, by id); the rest are the row's «more» menu, and on a
      // narrow list these fold into it as well.
      quickActions: {
        attribute: 'quick-actions',
        default: ''
      },
      // What a press on a row opens: `title`, the title link alone (and
      // a double click, Enter); `row`, anywhere in the row but its
      // controls, through the same view intent.
      rowOpen: {
        attribute: 'row-open',
        default: 'title',
        values: ['title', 'row']
      },
      // A list/table switch in the toolbar, before Create. The person's
      // choice is kept with the table's preferences and in its saved
      // views; below list-below there is only the list and no switch.
      layoutSwitch: {
        attribute: 'layout-switch',
        type: Boolean,
        default: false
      },
      toolbar: {
        type: Boolean,
        default: true
      },
      // Alternate rows (zebra), the report author's choice for a wide
      // table that is only read (owner decision C146 (4)); a person's view
      // no longer offers it. Lines between the rows, the hovered and the
      // selected row's fill are the table's own.
      stripes: {
        type: Boolean,
        default: false
      },
      settings: {
        type: Boolean,
        default: true
      },
      pagin: {
        type: Boolean,
        default: false
      },
      actions: {
        type: Boolean,
        default: true
      },
      // The row action column alone; the create button still follows actions.
      rowActions: {
        attribute: "row-actions",
        type: Boolean,
        default: true
      },
      // Rows may be dragged out of the list -- onto a folder of a tree --
      // as records (application/x-sf-records+json).
      dragRows: {
        attribute: "drag-rows",
        type: Boolean,
        default: false
      },
      // The rows can be put in another order by dragging them inside the
      // list (row-reorder, the storage schema's fields, 2026-10-16).
      rowReorder: {
        attribute: "row-reorder",
        type: Boolean,
        default: false
      },
      // A boolean cell the host lets a person write is a checkbox
      // (inline-edit; which cells, the record's `editable` says).
      inlineEdit: {
        attribute: "inline-edit",
        type: Boolean,
        default: false
      },
      // Where the row's buttons are drawn: the active row, or every row.
      rowActionsVisible: {
        attribute: "row-actions-visible",
        default: "hover"
      },
      // The create button and its menu of kinds, inside actions: a data view
      // turns it off for a host on port 1.10.0 that does not announce
      // create-record, so nothing is offered that nobody would answer.
      creatable: {
        type: Boolean,
        default: true
      },
      // The button that saves the filter as a template. A data view turns it
      // off when the host keeps no saved views: a template saved there went
      // nowhere and was gone on the next load.
      filterTemplates: {
        attribute: "filter-templates",
        type: Boolean,
        default: true
      },
      // The gear in the head of the settings column, which opens the column
      // settings. Off, the column still carries each row's menu.
      settingsMenu: {
        attribute: "settings-menu",
        type: Boolean,
        default: true
      },
      // The step of the size ladder the table's own controls take: its
      // toolbar, its row boxes and menus, its filters and context menus.
      // 1/2 is the dense admin step -- 32px controls, 14/20 text, the
      // height of the admin menu beside it -- and the rows follow.
      size: {
        default: "1",
        values: ["1/2", "1"]
      },
      filterText: {
        attribute: "filter-text",
        default: "Filter"
      },
      clearText: {
        attribute: "clear-text",
        default: "Clear"
      },
      searchPlaceholder: {
        attribute: "search-placeholder",
        default: "Search"
      },
      createText: {
        attribute: "create-text",
        default: "Create"
      },
      pinColumnLabel: {
        attribute: "pin-column-label",
        default: "Pin the column"
      },
      unpinColumnLabel: {
        attribute: "unpin-column-label",
        default: "Unpin the column"
      },
      paginationTotal: {
        attribute: "pagination-total",
        type: Number,
        default: 10
      },
      paginationPageSize: {
        attribute: "pagination-page-size",
        type: Number,
        default: 10
      },
      pageSizes: {
        attribute: "page-sizes",
        default: "10,20,30,40"
      },
      contextMenuColumns: {
        attribute: "context-menu-columns",
        type: Number,
        // One, because one is what every table has drawn since this input
        // existed: the read was bare, so neither the declared 2 nor a value
        // a host passed ever reached the menu, which fell to `?? 1`. The
        // getter below makes the input work for the first time, and the
        // default is set to the shipped behaviour so that making it work
        // changes nothing for anyone who does not ask.
        default: 1
      },
      // A table no host keeps settings for remembers its column widths in
      // this browser (owner, 2026-10-14), under table-settings-key.
      rememberWidths: {
        attribute: "remember-widths",
        type: Boolean,
        default: false
      },
      // The key the arrangement is kept under as a view preference.
      preferencesKey: {
        attribute: "preferences-key",
        default: ""
      },
      tableSettingsKey: {
        attribute: "table-settings-key",
        // Empty, because the effective default was never a string at all:
        // the bare read fell through to the attribute, then the element's
        // id, then its instance id, so every table had its own key. The
        // declaration said "users" and the manifest said
        // "admin.collection" -- two different untruths about the same
        // input. Either one, read properly, would have made every table on
        // a page share one settings key and overwrite the others.
        default: ""
      },
      dataState: {
        attribute: "data-state",
        default: "auto",
        values: ["auto", "loading", "populated", "empty", "error"]
      },
      loadingText: {
        attribute: "loading-text",
        default: "Loading"
      },
      emptyText: {
        attribute: "empty-text",
        default: "No data"
      },
      errorText: {
        attribute: "error-text",
        default: "The data could not be loaded"
      },
      retryText: {
        attribute: "retry-text",
        default: "Try again"
      },
      columnMoveLabel: {
        attribute: "column-move-label",
        default: "Move the column"
      },
      filterApplyText: {
        attribute: "filter-apply-text",
        default: "Apply"
      },
      columnSearchPlaceholder: {
        attribute: "column-search-placeholder",
        default: "Search the fields"
      },
      columnSearchEmptyText: {
        attribute: "column-search-empty-text",
        default: "No field matches"
      }
    };
  } // The manifest's declared defaults for these two were fixed in the same
  // commit as these getters and then lost: a rebase replayed a hand-picked list
  // of source files and classified smart.manifest.json as regenerable, which is
  // true of its provenance and false of its declarations. Two pairs shipped with
  // the getters resolving one thing and the manifest declaring another. The
  // other Framework session's defaults contract -- the manifest default against
  // the value a component resolves with no attribute set -- is what catches this
  // class, and it would have caught it here.
  // Declaring a prop creates no accessor in this Framework. These two were read
  // off `this` and were undefined, which the other Framework session's new
  // contract now names. Each is written so that reading it properly preserves
  // the behaviour that shipped, rather than applying a default that never
  // applied.


  get contextMenuColumns() {
    const declared = this.getNumberAttr?.("context-menu-columns", 1) ?? 1;
    return Number.isFinite(declared) && declared > 0 ? declared : 1;
  }

  get tableSettingsKey() {
    return this.getAttribute?.("table-settings-key") || "";
  }

  constructor() {
    super();
    this._emptyContext = null; // One handler for every row's press, not a closure per row and render.

    this.rowPointerDown = event => this.handleRowPointerDown(event);

    this._windowRange = null;
    this._windowed = false;
    this._rowHeight = 0; // The empty state's actions: retry and create are the table's own;
    // anything else (the data view's query reset) goes on up.

    this.addEventListener("sf-empty-state-action", event => {
      const id = event.detail?.id;

      if (id === "retry") {
        event.stopPropagation();
        this.requestRetry();
      } else if (id === "create") {
        event.stopPropagation();
        this.requestCreateIntent();
      } else if (id === "reset-query") {
        event.stopPropagation();
        this.resetQuery(this._emptyContext?.reset ?? "both");
      }
    });
    this._portalContainer = null; // The prefix stays sf-table (rename plan R2): an unkeyed table's preference
    // key is built from it (sf-table/sf-table-<n>), and a renamed key would
    // lose what the person saved.

    this._instanceId = `sf-table-${++tableInstances}`;
    this._selectionPortKey = "[]";
    this._routeContext = null;
    this._querySequence = 0;
    this._pendingQuerySequence = null;
    this._abandonedQuery = false;
    this._filterOptionPages = new Map();
    this._contextViewportBound = false;
    this.contextKeyEvent = this.contextKeyEvent.bind(this);
    this.contextViewportEvent = this.contextViewportEvent.bind(this);
    this.ACTIONS_SETTINGS_ROW = [{
      name: this.text('editActionText'),
      id: 'edit',
      component: {
        type: 'button-icon',
        props: {
          kind: 'icon',
          size: '1',
          appearance: 'ghost',
          scheme: 'on-surface',
          icon: 'edit',
          ariaLabel: this.text('editActionText'),
          value: 'edit'
        }
      }
    }, {
      name: this.text('viewActionText'),
      id: 'view',
      component: {
        type: 'button-icon',
        props: {
          kind: 'icon',
          size: '1',
          appearance: 'ghost',
          scheme: 'on-surface',
          icon: 'visibility',
          ariaLabel: this.text('viewActionText'),
          value: 'view'
        }
      }
    }, {
      name: this.text('deleteActionText'),
      id: 'delete',
      // The kit marks its own delete destructive, as the template
      // menu already does (`danger: !isDeleted`): the row menu
      // draws a danger entry in `error`, and a host that narrows
      // this catalogue gets the entry back untouched, so naming
      // delete in a host catalogue only to restore the red row is
      // no longer the price of leaving it to the kit (Larena
      // storage QA, 2026-10-22). The icon in the actions column
      // (gone with variant В, C146 (5); kept for list rows)
      // says the same with `status: 'error'` (decided 2026-10-23,
      // control/VISUAL-DECISIONS.md «Разрушительное действие
      // строкой»): one act must not look like two on the two
      // surfaces of one row, and with the column's default
      // visibility at most one red icon shows at a time. The
      // status paints, the scheme stays the family it falls back
      // to (sf-button-icon: they cannot both paint it).
      danger: true,
      component: {
        type: 'button-icon',
        props: {
          kind: 'icon',
          size: '1',
          appearance: 'ghost',
          scheme: 'on-surface',
          status: 'error',
          icon: 'delete',
          ariaLabel: this.text('deleteActionText'),
          value: 'delete'
        }
      }
    }]; // Row actions are a system column like select and settings: always last,
    // not resizable or draggable, and never part of saved column settings.

    this.TABLE_ACTIONS_COLUMN = {
      key: "actions",
      label: this.text("actionsColumnLabel"),
      system: true
    };
    this.TABLE_SETTINGS_COLUMN = {
      key: "settings",
      // The column's name from the language files (Larena L-1): the
      // literal "settings" stood in the head cell's data-label and in
      // the phone list in every language.
      label: this.text("settingsColumnLabel"),
      system: true,
      width: 'calc(var(--sf-text-height-1) + (var(--sf-ui-1--space-y-tightness-default) * 2) + var(--sf-b6))',
      component: {
        type: "button-icon",
        props: {
          size: "1",
          appearance: "ghost",
          scheme: "on-surface",
          icon: "settings",
          ariaLabel: this.text("settingsColumnLabel"),
          value: "settings",
          '@click': e => this.toggleTableSettings(e)
        }
      }
    };
    this.contextEvent = this.contextEvent.bind(this);
    this.hoverEvents = this.hoverEvents.bind(this);
    this.outEvent = this.outEvent.bind(this);
    this._contextEventBound = false;
    this._hoverEventBound = false;
    this._columnResizeEventBound = false;
    this._headerSortableRow = null;
    this._headerSortableDetach = null;
    this._columnResizeState = null;
    this.searchChange = this.scheduleSearchChange.bind(this);
    this._searchDebounceTimer = null;
    this._searchPendingProps = null;
    this._searchHoldKey = '';
    this.refs = {
      contextMenu: this.createRef(),
      items: new Map(),
      templateForm: this.createRef(),
      renameInput: this.createRef(),
      table: this.createRef(),
      scroll: this.createRef(),
      rail: this.createRef(),
      resizeGuide: this.createRef()
    }; // Two rows, kept apart: the record the page has open (current,
    // aria-current) and the row the person is on (the keyboard's and the
    // pointer's place, data-current). The keys used to write the first, so
    // ↑/↓ moved «the open record» (C31 acceptance, 2026-11-09).

    this._currentRowId = null;
    this._cursorRowId = null;
    this._checkboxMeasureToken = 0;
    this._responsiveWidth = 0;
    this._responsiveObserver = null;
    this._rowAreaId = `sf-view-table-rows-${++ROW_AREA_COUNT}`;
    this._filterTemplatesLoaded = false;
    this.tempSettings = null;
    this.state = {
      settingsChecked: false,
      bulkActions: [],
      createItems: [],
      // What the toolbar's own control offers, straight from the host.
      toolbarActions: [],
      sort: {
        key: null,
        direction: null
      },
      saveInputValue: '',
      search: {
        searchActive: false,
        value: ''
      },
      contextMenu: {
        open: false
      },
      actions: this.getActions().map(action => Object.assign(action, {
        visible: true
      })),
      actionActive: this.getProp('actions'),
      columnSettings: {},
      selectIndeterminate: false,
      filterDataDirty: false,
      filter: {
        selectedTemplateKey: 'default',
        fields: [],
        templates: [],
        edit: {
          rename: ''
        }
      }
    };
    this.TABLE_SELECT_COLUMN = {
      key: "select",
      label: "select",
      system: true,
      width: 'calc(var(--sf-text-height-1) + var(--sf-b6) + calc(var(--sf-px) * 2))',
      component: {
        type: "checkbox",
        props: {
          position: 'end',
          rootClass: 'content-main-between',
          size: this.size,
          '@change': event => {
            const checked = Boolean(event.target.checked); // Marking the page leaves no single row as the anchor a
            // later Shift-click could extend from, so it is dropped
            // rather than left pointing at whatever was clicked last.

            this._selectionAnchorId = null;
            this.set({
              selectIndeterminate: false,
              settingsChecked: checked
            });
            this.updateRows(row => ({ ...row,
              select: this.getDefaultRowCell(this.TABLE_SELECT_COLUMN, { ...row,
                selected: checked,
                checked
              })
            }), "select-all");
          },
          indeterminate: this.state.selectIndeterminate,
          checked: this.state.settingsChecked,
          ariaLabel: this.text("selectAllLabel")
        }
      },
      rowComponent: {
        type: "checkbox",
        props: {
          position: 'end',
          rootClass: 'content-main-between',
          size: this.size
        }
      }
    };
  } // ---------- the manifest's list settings and values (§4, §18) ----------
  // Each list setting is the property its set-<name> helper writes.


  get rows() {
    return this.getTableData().rows || [];
  }

  set rows(rows) {
    this.setRows(Array.isArray(rows) ? rows : []);
  }

  get columns() {
    return this.getTableData().columns || [];
  }

  set columns(columns) {
    this.setColumns(Array.isArray(columns) ? columns : []);
  }

  get tableData() {
    return this.getTableData();
  }

  set tableData(data) {
    this.setTableData(data && typeof data === "object" ? data : {});
  }

  get tableSettings() {
    return this.getColumnSettings();
  }

  set tableSettings(data) {
    this.setTableSettings(data && typeof data === "object" ? data : {});
  }

  get bulkActions() {
    return this.state?.bulkActions ?? [];
  }

  set bulkActions(actions) {
    this.setBulkActions(actions);
  }

  get createItems() {
    return this.state?.createItems ?? [];
  }

  set createItems(items) {
    this.setCreateItems(items);
  }

  get toolbarActions() {
    return this.getToolbarActions();
  }

  set toolbarActions(items) {
    this.setToolbarActions(items);
  }

  get filterFields() {
    return this.getFilterFields();
  }

  set filterFields(fields) {
    this.setFilterFields(fields);
  }

  get activeFilterFields() {
    return this.getActiveFilterFieldKeys();
  }

  set activeFilterFields(keys) {
    this.setActiveFilterFields(keys);
  }

  get templates() {
    return this.getFilterTemplates();
  }

  set templates(data) {
    this.setTemplates(data);
  } // The host's echo of the order (§4.3 controlled; vocabulary 1.1.5 §2.1):
  // [{key, direction}], the main column first.


  get sort() {
    const {
      key,
      direction
    } = this.state?.sort ?? {};
    return key && direction ? [{
      key,
      direction
    }] : [];
  }

  set sort(list) {
    // The short form of C296's contract: "key:asc" or "key:desc".
    if (typeof list === "string") list = parseSortText(list) ?? (() => {
      try {
        return JSON.parse(list);
      } catch {
        return null;
      }
    })();
    const first = Array.isArray(list) ? list[0] : list;
    const key = first?.key ?? first?.field ?? null;
    const direction = first?.direction ?? first?.dir ?? null;
    if (key && ["asc", "desc"].includes(direction)) this.setSort(key, direction);else this.setSort(null, null);
  } // The row the page has open: marked aria-current, not focused.


  get current() {
    return this._currentRowId ?? "";
  }

  set current(id) {
    const value = id === null || id === undefined ? "" : String(id);
    this._currentRowId = value || null; // Opening a record puts the person on it.

    this._cursorRowId = null;

    if ((this.getAttribute("current") ?? "") !== value) {
      if (value) this.setAttribute("current", value);else this.removeAttribute("current");
    } else {
      this.requestComponentUpdate("current");
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "current" && oldValue !== newValue) {
      this._currentRowId = newValue || null;
      this._cursorRowId = null;
    }

    super.attributeChangedCallback?.(name, oldValue, newValue);
  }

  get selected() {
    return this._currentRowId ?? undefined;
  }

  get selection() {
    return this.getSelectedRecordIds();
  } // Whether an action was called with its parameters as one object (§4.4).


  isActionParameters(value, names) {
    return value !== null && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype && names.some(name => Object.hasOwn(value, name));
  }

  focusRowAction({
    id
  } = {}) {
    if (id === null || id === undefined || id === "") return {
      outcome: "refused",
      reason: "empty"
    };
    this.focusRow(String(id), {
      reveal: true
    });
    return {
      outcome: "applied"
    };
  } // The settings a markup author writes as attributes: sort="key:dir" is
  // read before the base's JSON reading of list attributes, which would
  // otherwise say the short form is not JSON (C296).


  sfReadListAttributes() {
    if (!this.__sfListAttributesRead && this.hasAttribute?.("sort")) {
      const short = parseSortText(this.getAttribute("sort"));
      if (short) this.sort = short;
    }

    return super.sfReadListAttributes?.();
  } // The totals at the foot (C296, q-totals B): the host's numbers, never
  // counted here -- under a filter only the server sees every record.
  // {page?: {key: value}, all?: {key: value}}, keyed by the columns marked
  // `total`; a row per side given, «На странице» then «Всего».


  get totals() {
    return this._totals ?? null;
  }

  set totals(value) {
    const shaped = value && typeof value === "object" && !Array.isArray(value) ? value : null;
    this._totals = shaped ? Object.freeze({ ...(shaped.page && typeof shaped.page === "object" ? {
        page: { ...shaped.page
        }
      } : {}),
      ...(shaped.all && typeof shaped.all === "object" ? {
        all: { ...shaped.all
        }
      } : {})
    }) : null;
    this.requestComponentUpdate?.("totals");
  } // Opening a record (C296): sf-view-table-open {id, newTab} beside the
  // view intent the title has always raised; newTab when a modifier or the
  // middle button took the record's address to a tab of its own.


  requestOpen(row, newTab = false) {
    const id = row?.id;
    if (id === null || id === undefined || id === "") return false;
    return this.emitTableEvent("open", Object.freeze({
      id,
      newTab: newTab === true
    }));
  } // Brings a record's row into view without moving the focus (C296); a row
  // outside the drawn range is drawn first. Answers an outcome, as
  // focus-row does.


  scrollToRow(rowId) {
    const id = rowId && typeof rowId === "object" ? rowId.id : rowId;
    if (id === null || id === undefined || id === "") return {
      outcome: "refused",
      reason: "empty"
    };
    const key = String(id).replace(/"/gu, '\\"');
    const element = this.isList ? this.querySelector(`.sf-table-list-item[data-row-id="${key}"]`) : this.refs.table?.value?.querySelector(`tbody tr[data-row-id="${key}"]`);

    if (element) {
      element.scrollIntoView?.({
        block: "nearest",
        behavior: "instant"
      });
      return {
        outcome: "applied"
      };
    }

    const rows = this.getTableData().rows || [];
    const index = rows.findIndex((one, at) => this.getRowKey(one, at) === String(id));
    if (index < 0) return {
      outcome: "refused",
      reason: "unknown"
    };

    if (this._windowed) {
      this._windowRange = this.clampWindow({
        first: index - WINDOW_MARGIN,
        last: index + WINDOW_MARGIN
      }, rows.length);
      this._windowOnly = true;
      this._pendingScrollRow = String(id);
      this.requestComponentUpdate("window");
    }

    return {
      outcome: "applied"
    };
  } // The old names whose detail §8 changed (split rows of aliases.json).


  sfAliasAdapters() {
    return {
      "sf-table-action-intent": detail => Object.freeze({
        action_id: detail.action,
        record_ids: detail.ids
      }),
      "sf-port-output": detail => Object.freeze({
        port: "selection",
        value: detail.ids
      }),
      onSearchEnd: detail => detail.search,
      "sf-table-template-save": formerTemplateDetail,
      onTemplateSave: formerTemplateDetail
    };
  }

  getActions() {
    if (this.getProp('actions')) {
      return this.ACTIONS_SETTINGS_ROW.map(action => {
        const {
          name,
          id
        } = action;
        return {
          name,
          id
        };
      });
    } else {
      return [];
    }
  }

  isSearchHoldKey(key = '') {
    return key === 'Backspace' || key === 'Delete';
  }

  clearSearchDebounce() {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = null;
    }
  }

  scheduleSearchChange(props = {}) {
    this._searchPendingProps = props;
    this.clearSearchDebounce();

    if (this._searchHoldKey) {
      return this;
    }

    this._searchDebounceTimer = setTimeout(() => {
      const pendingProps = this._searchPendingProps || {};
      this._searchPendingProps = null;
      this._searchDebounceTimer = null;
      this.updateSearchState(pendingProps);
    }, 500);
    return this;
  }

  handleSearchKeyDown(event) {
    if (!this.isSearchHoldKey(event?.key)) {
      return this;
    }

    this._searchHoldKey = event.key;
    this.clearSearchDebounce();
    return this;
  }

  handleSearchKeyUp(event) {
    if (!this._searchHoldKey || event?.key !== this._searchHoldKey) {
      return this;
    }

    this._searchHoldKey = '';

    if (this._searchPendingProps) {
      this.scheduleSearchChange(this._searchPendingProps);
    }

    return this;
  }

  updateSearchState(props = {}, isActiveState = true) {
    const currentSearch = this.state.search || {};
    let needUpdate = false;

    for (const [key, value] of Object.entries(props)) {
      if (!Object.is(currentSearch[key], value)) {
        needUpdate = true;
        break;
      }
    }

    if (!needUpdate) return this;
    this.set(prevState => {
      return {
        search: { ...prevState.search,
          ...props
        }
      };
    });
    if (!isActiveState) return this; // Said at once, not after this render: the host's answer (a data view
    // marking the rows loading) then lands in the same frame, and a search
    // costs one render before its rows, not two (rules of the road, rule 1).
    // The old camelCase onSearchEnd is a dated alias of this name
    // (aliases.json, simai/ui-pro#1): it follows once with its old detail.

    this.emitTableEvent('search-change', {
      search: this.state.search.value
    });
    return this;
  } // Every event by its verb, as the manifest declares it (standard 1.3.8
  // §8): the DOM name is <tag>-<verb>, and the old names follow once
  // through the dated aliases (aliases.json), noted in SF.deprecations when
  // a listener reads them. Answers false when a listener refused a
  // cancelable request.


  emitTableEvent(verb, detail = {}, options = {}) {
    return this.sfEmit(verb, detail, options);
  }

  requestActionIntent(actionId, recordIds, options = {}) {
    // An action takes its parameters as one object too (standard 1.3.8 §4.4).
    if (this.isActionParameters?.(actionId, ["action-id", "actionId"])) {
      ({
        actionId,
        recordIds
      } = {
        actionId: actionId["action-id"] ?? actionId.actionId,
        recordIds: actionId["record-ids"] ?? actionId.recordIds
      });
    }

    if (typeof actionId !== 'string' || !actionId.trim() || !Array.isArray(recordIds) || recordIds.length === 0 || Array.from(recordIds).some(id => !(typeof id === 'string' && id.length > 0 || Number.isSafeInteger(id)))) {
      throw new TypeError('Action intent requires an opaque action ID and nonempty typed record IDs');
    }

    const ids = Object.freeze([...recordIds]);
    const rows = this.getTableData().rows || [];
    const revisions = {};

    for (const id of ids) {
      const revision = rows.find(row => row?.id === id)?.revision;
      if (revision !== undefined && revision !== null) revisions[id] = revision;
    } // Vocabulary §5 apply (§18.3): one row's own action is scope entry, a
    // bulk one scope selection. The old sf-table-action-intent follows
    // with its {action_id, record_ids} (a split row and its adapter).


    const scope = options?.scope ?? (ids.length === 1 ? "entry" : "selection");
    this.emitTableEvent('apply', Object.freeze({
      action: actionId,
      scope,
      ids,
      revisions: Object.freeze(revisions)
    }));
    return {
      outcome: "applied"
    };
  }

  getSelectedRecordIds() {
    return this.getTableData().rows.filter(row => row.select?.component?.props?.checked === true).map(row => row.id);
  }

  setBulkActions(actions = []) {
    this.noteBulkActionsName?.();

    if (!Array.isArray(actions) || Array.from(actions).some(action => !action || typeof action !== 'object' || typeof action.id !== 'string' || !action.id.trim() || typeof action.name !== 'string' || !action.name.trim() || Object.keys(action).some(key => key !== 'id' && key !== 'name'))) {
      throw new TypeError('Bulk actions require opaque id and name only');
    }

    return this.set({
      bulkActions: actions.map(({
        id,
        name
      }) => ({
        id,
        name
      }))
    });
  }

  renderBulkActions(place = "before") {
    if (!this.state.bulkActions?.length) return lit__WEBPACK_IMPORTED_MODULE_10__.nothing;
    const bar = this.hasBulkBar();
    if (place === "after") return bar ? this.renderBulkBar() : lit__WEBPACK_IMPORTED_MODULE_10__.nothing;
    if (bar) return lit__WEBPACK_IMPORTED_MODULE_10__.nothing;
    const selected = this.getSelectedRecordIds(); // C116: a bulk action is a regular button (outline on-surface); one
    // that deletes opens a confirmation, so it is the outlined danger and
    // stands last (C164 (5)). None is the filled main button.

    const destructive = action => /^(delete|remove|destroy|trash)\b/iu.test(String(action.id));

    const ordered = [...this.state.bulkActions].sort((a, b) => Number(destructive(a)) - Number(destructive(b)));
    return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`<div class="flex flex-wrap gap-1/3">
            ${ordered.map(action => (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`<sf-button
                appearance="outline" scheme="on-surface" status=${destructive(action) ? "error" : lit__WEBPACK_IMPORTED_MODULE_10__.nothing}
                text=${action.name} ?disabled=${selected.length === 0}
                @click=${() => {
      const ids = this.getSelectedRecordIds();
      if (ids.length) this.requestActionIntent(action.id, ids, {
        scope: "selection"
      });
    }}></sf-button>`)}
        </div>`;
  } // C295 / C296: group actions are sf-bulk-actions' job. Where the page's
  // pair carries that element, a table standing alone places one bar after
  // its rows (count, clear and «all N» come with it: BA-2, BA-5); where it
  // does not, the table's own buttons stay above the rows as before. Inside
  // sf-view the view draws the bar. setBulkActions / bulkActions are the
  // former names of the bar's actions until 2027-01-01.


  noteBulkActionsName() {
    if (this.closest?.("sf-view")) return;
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_20__.noteDeprecated)({
      component: "sf-view-table",
      tag: "sf-view-table",
      kind: "method",
      from: "setBulkActions",
      to: "sf-bulk-actions actions",
      since: "2026-11-18",
      remove_after: "2027-01-01",
      package: "view"
    });
  }

  hasBulkBar() {
    return typeof customElements !== "undefined" && Boolean(customElements.get("sf-bulk-actions"));
  }

  renderBulkBar() {
    const selected = this.getSelectedRecordIds();
    const rows = this.getTableData().rows || [];
    const count = Number(this.getProp?.("total") ?? this.getAttribute("total") ?? 0);
    const total = Number.isSafeInteger(count) && count > 0 ? String(count) : lit__WEBPACK_IMPORTED_MODULE_10__.nothing;
    const actions = this.state.bulkActions.map(({
      id,
      name
    }) => ({
      id,
      text: name
    }));
    return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`<sf-bulk-actions place="inline" data-sf-table-bulk
            size=${this.getPropsContext().size === "1/2" ? "1/2" : "1"}
            count=${selected.length} page-count=${rows.length} total=${total}
            ?all-selected=${this._bulkAll === true}
            .actions=${actions}
            @sf-bulk-actions-action=${event => {
      const {
        id,
        scope
      } = event.detail || {};
      const ids = this.getSelectedRecordIds();
      if (!id || !ids.length && scope !== "all") return;
      this.requestActionIntent(String(id), ids.length ? ids : rows.map(row => row.id), {
        scope: scope === "all" ? "all" : "selection"
      });
    }}
            @sf-bulk-actions-select-all=${() => {
      this._bulkAll = true;
      this.requestComponentUpdate("bulk");
    }}
            @sf-bulk-actions-select-page=${() => {
      this._bulkAll = false;
      this.requestComponentUpdate("bulk");
    }}
            @sf-bulk-actions-clear=${() => {
      this._bulkAll = false;
      this.clearSelection();
    }}></sf-bulk-actions>`;
  } // Items for the create split button menu. Choosing one (or the main
  // button, with item null) emits sf-table-create-intent; the host opens its form.


  setCreateItems(items = []) {
    if (!Array.isArray(items) || Array.from(items).some(item => !item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id.trim() || typeof item.name !== 'string' || !item.name.trim() || Object.keys(item).some(key => key !== 'id' && key !== 'name'))) {
      throw new TypeError('Create items require opaque id and name only');
    }

    return this.set({
      createItems: items.map(({
        id,
        name
      }) => ({
        id,
        name
      }))
    });
  }

  requestCreateIntent(itemId = null) {
    if (this.isActionParameters?.(itemId, ["item-id", "itemId"])) itemId = itemId["item-id"] ?? itemId.itemId ?? null;

    if (itemId !== null && !this.state.createItems.some(item => item.id === itemId)) {
      throw new TypeError(`sf-view-table has no create item ${String(itemId)}`);
    }

    this.emitTableEvent('create', Object.freeze({
      item: itemId
    }));
    return {
      outcome: "applied"
    };
  } // The actions of the view itself, set by the host: the toolbar's control is
  // a menu of them. Round three took it off column settings, which the gear
  // in the head already owns, and gave it the job the Bitrix-like tables give
  // it -- everything the page used to carry as its own buttons.


  setToolbarActions(items = []) {
    if (!Array.isArray(items) || Array.from(items).some(item => !item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id.trim() || typeof item.label !== 'string' || !item.label.trim() || item.icon != null && typeof item.icon !== 'string' || item.href != null && !this.isSameSiteHref(item.href) || Object.keys(item).some(key => !['id', 'label', 'icon', 'href'].includes(key)))) {
      throw new TypeError('Toolbar actions require id and label, and an optional icon and same-site href');
    }

    return this.set({
      toolbarActions: items.map(({
        id,
        label,
        icon,
        href
      }) => ({
        id,
        label,
        ...(icon ? {
          icon
        } : {}),
        ...(href ? {
          href
        } : {})
      }))
    });
  }

  getToolbarActions() {
    return (this.state.toolbarActions || []).map(item => ({ ...item
    }));
  } // A link out of the table may only go to this same site. A host that sends
  // another origin is sending the person somewhere the table cannot vouch for.


  isSameSiteHref(href = "") {
    const value = String(href ?? "").trim();
    if (!value || value.startsWith("//")) return false;

    try {
      return new URL(value, document.baseURI).origin === new URL(document.baseURI).origin;
    } catch {
      return false;
    }
  } // The event carries the id, and an item with an href also goes there. The
  // event is cancelable, so a host that routes its own pages keeps the view
  // on the page: it calls preventDefault and navigates itself.


  requestToolbarAction(actionId) {
    const action = this.getToolbarActions().find(item => item.id === actionId);

    if (!action) {
      throw new TypeError(`sf-view-table has no toolbar action ${String(actionId)}`);
    }

    const allowed = this.emitTableEvent('toolbar-action', Object.freeze({
      action: action.id,
      href: action.href ?? null
    }), {
      cancelable: true
    });

    if (allowed && action.href && this.isSameSiteHref(action.href)) {
      window.location.assign(action.href);
    }

    return this;
  } // The view's three action menus -- the create arrow's variants, the
  // toolbar's «⋯» and the list's sort -- are the page's one menu of actions,
  // SIMAI Framework SF.menu.open (C184 (4), VF-1, set standard 7.5): the
  // Framework places it at its control, closes it on a press outside or
  // Escape, toggles it from the same control and gives the focus back. They
  // were sf-menu-context windows the table drew in its own portal with
  // position: fixed. Each entry list answers {entries, choose(id)}.


  actionMenu(menu) {
    if (menu === 'toolbar-actions') {
      // The standard menu's entries, not link buttons: a link button in a
      // menu drew centred text on a light block that looked like no other
      // menu in the admin (owner, 2026-10-13).
      const actions = this.getToolbarActions();
      return {
        entries: actions.map(action => ({
          id: String(action.id),
          text: action.label,
          ...(action.icon ? {
            icon: action.icon
          } : {})
        })),
        choose: id => {
          const action = actions.find(item => String(item.id) === id);
          if (action) this.requestToolbarAction(action.id);
        }
      };
    }

    if (menu === 'list-sort') {
      // The list has no column heads to sort by, so its sort is a menu:
      // the host's own order, then each sortable column one way and the
      // other. Choosing one raises sf-table-sort-change exactly as a head
      // does.
      const current = this.state.sort || {};
      const choices = new Map();

      const option = (text, key, direction) => {
        const id = `${key ?? ''}:${direction ?? ''}`;
        choices.set(id, [key, direction]);
        return {
          id,
          text,
          kind: 'radio',
          checked: current.key === key && current.direction === direction
        };
      };

      const sortable = this.getColumns().filter(column => column?.sortable && !column.system && !["select", "settings", "actions"].includes(column.key));
      return {
        entries: [option(this.text('sortNone'), null, null), ...sortable.flatMap(column => [option(`${column.label ?? column.key}, ${this.text('sortAscending')}`, column.key, 'asc'), option(`${column.label ?? column.key}, ${this.text('sortDescending')}`, column.key, 'desc')])],
        choose: id => {
          const choice = choices.get(id);
          if (!choice) return;
          const [key, direction] = choice;
          this.setSort(key, direction);
          this.emitTableEvent('sort-change', Object.freeze({
            key,
            direction
          }));
        }
      };
    }

    if (menu === 'create') {
      const createItems = this.state.createItems || [];
      return {
        entries: createItems.map(item => ({
          id: String(item.id),
          text: item.name
        })),
        choose: id => {
          const item = createItems.find(entry => String(entry.id) === id);
          if (item) this.requestCreateIntent(item.id);
        }
      };
    }

    return null;
  } // Opens one of the action menus at its control through SF.menu.open and
  // acts on the row chosen. A second press on the same control closes it.


  async openActionMenu(menu, anchor) {
    const built = this.actionMenu(menu);
    if (!built || !(anchor instanceof Element)) return null;
    anchor.setAttribute('aria-expanded', 'true');
    const choice = await (0,_view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_19__.menuOpen)({
      anchor,
      entries: built.entries,
      label: this.getContextMenuLabel({
        menu
      }),
      size: this.menuSize
    });
    if (anchor.isConnected) anchor.setAttribute('aria-expanded', 'false');
    if (choice?.id !== undefined && choice?.id !== null) built.choose(String(choice.id));
    return choice;
  } // Sorting reports intent only: the table marks the header and emits
  // sf-table-sort-change; the host reorders or reloads the rows.


  getSort() {
    return { ...this.state.sort
    };
  }

  setSort(key = null, direction = null) {
    if (this.isActionParameters?.(key, ["key", "direction"])) ({
      key = null,
      direction = null
    } = key);

    if (key === null || direction === null) {
      this.set({
        sort: {
          key: null,
          direction: null
        }
      });
      return {
        outcome: "applied"
      };
    }

    if (typeof key !== 'string' || !key || !['asc', 'desc'].includes(direction)) {
      throw new TypeError('Sort requires a column key and direction asc or desc');
    }

    this.set({
      sort: {
        key,
        direction
      }
    });
    return {
      outcome: "applied"
    };
  }

  toggleSort(key) {
    const current = this.state.sort || {};
    const direction = current.key !== key ? 'asc' : current.direction === 'asc' ? 'desc' : current.direction === 'desc' ? null : 'asc';
    this.setSort(direction ? key : null, direction);
    return this.emitTableEvent('sort-change', Object.freeze({
      key,
      direction
    }));
  } // Pointer capture sends the click that ends a column drag or resize to the
  // header cell; that click must not also sort the column.


  suppressNextHeaderClick() {
    this._suppressHeaderClick = true;
    setTimeout(() => {
      this._suppressHeaderClick = false;
    }, 0);
  }

  handleHeaderSortClick(event, column = {}) {
    if (column.sortable !== true || column.system || this._suppressHeaderClick) return;
    const target = event.composedPath?.()[0] || event.target; // A click on the width strip is not a click on the header's own title.

    if (target instanceof Element && target.closest('.sf-table-column-resizer')) return;
    this.toggleSort(column.key);
  } // Emits the selection output once per change of the explicit selection.


  syncSelectionPort() {
    if (!this._isMounted) return this;
    const ids = this.getSelectedRecordIds();
    const key = JSON.stringify(ids.map(id => [typeof id, id]));
    if (key === this._selectionPortKey) return this;
    this._selectionPortKey = key; // Vocabulary §5 select {ids} (§18.2); the composition port's
    // sf-port-output {port: selection, value} follows once (a split row).

    this.emitTableEvent("select", Object.freeze({
      ids: Object.freeze([...ids])
    }));
    return this;
  } // One row's box has been marked. A plain click marks that row; Shift+click
  // marks every row between the last one marked and this one, with the value
  // the clicked box just took, which is what makes unmarking a range work too.


  applyRowSelection(rowId, checked, {
    range = false
  } = {}) {
    const rows = this.getTableData().rows;

    const sameRow = (row, id) => String(row?.id ?? "") === String(id ?? "");

    const index = rows.findIndex(row => sameRow(row, rowId));
    if (index < 0) return this;
    const anchorIndex = range && this._selectionAnchorId != null ? rows.findIndex(row => sameRow(row, this._selectionAnchorId)) : -1;
    const from = anchorIndex < 0 ? index : Math.min(anchorIndex, index);
    const to = anchorIndex < 0 ? index : Math.max(anchorIndex, index); // The page box is cleared first: a row cell asks `settingsChecked`
    // whether it is marked, so leaving it set would mark the rows this call
    // is unmarking back again.

    this.set({
      settingsChecked: false
    });
    this.updateRows((row, position) => position < from || position > to ? row : { ...row,
      selected: checked,
      checked,
      select: this.getDefaultRowCell(this.TABLE_SELECT_COLUMN, { ...row,
        selected: checked,
        checked
      })
    }, range && anchorIndex >= 0 ? "select-range" : "select-row");
    this._selectionAnchorId = rowId;
    return this.syncSelectAllState();
  } // The page box answers for the rows under it: all of them, some of them, or
  // none. It is computed from the rows rather than counted as rows are
  // clicked, so appended rows and a replaced page cannot drift from it.


  syncSelectAllState() {
    const count = this.getSelectedRecordIds().length;
    const total = this.getTableData().rows.length;
    return this.set({
      settingsChecked: total > 0 && count === total,
      selectIndeterminate: count > 0 && count < total
    });
  } // What a pointer press has to settle before the click arrives: whether a
  // range is being extended, and that the press must not start a text
  // selection. A Shift-click or a second click otherwise selects the text of
  // every row it passes over, which is what the host reported.


  handleRowPointerDown(event) {
    this._selectRangeModifier = event?.shiftKey === true;

    if (event?.shiftKey === true || event?.detail > 1) {
      event.preventDefault?.();
    }

    return this;
  } // Controls inside a row answer for themselves. A click on a box, a row
  // menu, a link, a button or a field is that control's click, and neither
  // focuses the row nor opens the record.


  isRowControlTarget(target) {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('td[data-key="select"], td[data-key="settings"], a[href], button, input, select, textarea,' + ' [role="button"], [role="link"], sf-checkbox, sf-dropdown, sf-button, sf-button-icon'));
  } // A single click makes the row the current one — wherever in the row it
  // lands. It does not mark it: marking is the box's job, and a click that did
  // both would let a stray click destroy a selection the person had built up.
  //
  // The first version skipped a click on anything interactive, which read
  // well until a consumer's cells turned out to be links: clicking the only
  // content a cell has left the row unmarked as current, and the rule looked
  // broken rather than careful. A control still does its own work — a link
  // still follows, a box still marks — and the row moving under the pointer
  // takes nothing away from that. Only opening the record stays off limits
  // from a control.


  handleRowClick(event, row, index = -1) {
    // A list row's own buttons keep the focus a press gives them: the menu
    // they open goes back to them.
    this.focusRow(this.getRowKey(row, index), {
      focus: !(this.isList && this.isRowControlTarget(event?.target))
    });
    this.openReferenceFromCell(event, row); // row-open="row" (C31): a press anywhere in the row but its controls
    // opens the record, as the title link and Enter do. A press that
    // selected text, or one with a modifier, is not a press to open.

    if (this.getAttribute("row-open") === "row" && !event?.defaultPrevented && !(event?.button > 0) && !event?.metaKey && !event?.ctrlKey && !event?.shiftKey && !event?.altKey && !(event?.detail > 1) && !String(globalThis.getSelection?.() ?? "")) {
      this.handleRowOpen(event, row);
    }

    return this;
  } // A value that points at another record -- a person, a file, a related
  // record -- opens that record in the page's panel instead of loading a page
  // (owner, 2026-10-14): the table asks with sf-table-reference-open and the
  // data view raises record.open {field, value, href}. A click with a
  // modifier or the middle button still follows the address, so a new tab is
  // one keystroke away; a host that cannot open it gets the address.


  openReferenceFromCell(event, row) {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target?.closest?.("a[href]");
    const cell = link?.closest?.("td[data-key]");
    if (!link || !cell || !this.contains(cell)) return;
    const field = cell.dataset.key;
    const value = row?.[field];
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || link.target === "_blank" || link.hasAttribute("download")) return;
    const asked = this.emitTableEvent("reference-open", {
      recordId: row?.id ?? null,
      field,
      value: value ?? null,
      href
    }, {
      cancelable: true
    }); // Only a listener that takes it (cancels the event) keeps the page.

    if (!asked) event.preventDefault();
  } // Which row this is, for the purpose of being the current one. The rest of
  // the template already keys a row by `id`, then `value`, then its position,
  // because the table is given rows keyed all three ways; the current row
  // followed `id` alone, so in a view whose rows carry another key a click
  // marked nothing and looked broken. Opening a record still needs a real id
  // — there is nothing to open without one.


  getRowKey(row, index = -1) {
    const value = row?.id ?? row?.value;

    if (value !== undefined && value !== null && String(value) !== "") {
      return String(value);
    }

    return index >= 0 ? `index:${index}` : "";
  } // Whether a row's action buttons are drawn: always when the host asks
  // (row-actions-visible="always"), else in the row under the pointer, the
  // row holding the focus and the current row.


  actionsShownFor(row) {
    if (this.getAttribute("row-actions-visible") === "always") return true;
    const key = String(row?.id ?? row?.value ?? "");
    if (!key) return true;
    return key === this._pointerRowKey || key === this._focusRowKey || String(this._currentRowId ?? "") === key;
  }

  setActionsRow(kind, key) {
    const field = kind === "focus" ? "_focusRowKey" : "_pointerRowKey";
    const next = key ? String(key) : null;
    if (this[field] === next) return;
    this[field] = next; // The buttons of one row, not the table's layout: no measuring after it.

    this._layoutUnchanged = true;
    this.requestComponentUpdate("row-actions");
  }

  bindRowActionsEvents(table) {
    if (!table || this._rowActionsTable === table) return;
    this._rowActionsAbort?.abort();
    this._rowActionsAbort = new AbortController();
    this._rowActionsTable = table;
    const {
      signal
    } = this._rowActionsAbort;

    const rowKey = target => target?.closest?.("tbody tr[data-row-id]")?.dataset.rowId ?? null;

    table.addEventListener("pointerover", event => this.setActionsRow("pointer", rowKey(event.target)), {
      signal
    }); // A dragged row carries its record, or every selected record when it is
    // one of them (owner, 2026-10-15, the file manager): a tree that
    // accepts records says where they were dropped.

    table.addEventListener("dragstart", event => {
      const key = rowKey(event.target);
      if (!key || !this.hasAttribute("drag-rows") || !event.dataTransfer) return;
      const selected = this.getSelectedRecordIds?.() ?? [];
      const ids = selected.map(String).includes(key) ? selected.map(String) : [key];
      const source = this.getAttribute("preferences-key") || this.getAttribute("table-settings-key") || this.id || null;
      event.dataTransfer.setData("application/x-sf-records+json", JSON.stringify({
        ids,
        source
      }));
      event.dataTransfer.setData("text/plain", ids.join(", "));
      event.dataTransfer.effectAllowed = "copyMove";
      this.emitTableEvent("rows-drag", Object.freeze({
        ids,
        source
      }));
    }, {
      signal
    }); // Reordering inside the list: a row dragged over another goes before
    // it, or after it from its lower half; the drop says which rows moved
    // and the row they now stand before (null: the end). The host decides.

    const reorder = () => this.getAttribute("row-reorder") === "true";

    const dropMark = (row, after) => {
      for (const marked of table.querySelectorAll("tbody tr[data-sf-drop-before], tbody tr[data-sf-drop-after]")) {
        marked.removeAttribute("data-sf-drop-before");
        marked.removeAttribute("data-sf-drop-after");
      }

      if (row) row.setAttribute(after ? "data-sf-drop-after" : "data-sf-drop-before", "");
    };

    const dropTarget = event => {
      const row = event.target?.closest?.("tbody tr[data-row-id]");
      if (!row) return null;
      const box = row.getBoundingClientRect();
      return {
        row,
        after: event.clientY > box.top + box.height / 2
      };
    };

    table.addEventListener("dragstart", event => {
      const key = rowKey(event.target);
      if (!key || !reorder() || !event.dataTransfer) return;
      this._reorderDrag = [key];
      event.dataTransfer.setData("application/x-sf-row-order", key);
      event.dataTransfer.effectAllowed = "move";
    }, {
      signal
    });
    table.addEventListener("dragover", event => {
      if (!this._reorderDrag || !reorder()) return;
      const target = dropTarget(event);
      if (!target) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      dropMark(target.row, target.after);
    }, {
      signal
    });
    table.addEventListener("drop", event => {
      if (!this._reorderDrag || !reorder()) return;
      const target = dropTarget(event);
      dropMark(null);
      const ids = this._reorderDrag;
      this._reorderDrag = null;
      if (!target) return;
      event.preventDefault();
      const keys = [...table.querySelectorAll("tbody tr[data-row-id]")].map(row => row.dataset.rowId);
      const at = keys.indexOf(target.row.dataset.rowId) + (target.after ? 1 : 0);
      const rest = keys.slice(at).filter(key => !ids.includes(key));
      const before = rest[0] ?? null;
      const now = keys.filter(key => !ids.includes(key));
      const place = before === null ? now.length : now.indexOf(before);
      const order = [...now.slice(0, place), ...ids, ...now.slice(place)];
      if (order.join("\u0000") === keys.join("\u0000")) return;
      this.emitTableEvent("move", Object.freeze({
        ids: [...ids],
        before,
        order
      }));
    }, {
      signal
    });
    table.addEventListener("dragend", () => {
      this._reorderDrag = null;
      dropMark(null);
    }, {
      signal
    });
    table.addEventListener("pointerleave", () => this.setActionsRow("pointer", null), {
      signal
    });
    table.addEventListener("focusin", event => this.setActionsRow("focus", rowKey(event.target)), {
      signal
    });
    table.addEventListener("focusout", event => {
      if (!table.contains(event.relatedTarget)) this.setActionsRow("focus", null);
    }, {
      signal
    });
  } // The record the page has open (aria-current).


  isCurrentRow(row, index = -1) {
    const key = this.getRowKey(row, index);
    return key !== "" && String(this._currentRowId ?? "") === key;
  } // The row the person is on (data-current): where the keys and the last
  // press left them, else the open record.


  isCursorRow(row, index = -1) {
    const key = this.getRowKey(row, index);
    return key !== "" && String(this._cursorRowId ?? this._currentRowId ?? "") === key;
  } // ---------- many entries (§18.4) ----------
  // The rows drawn now, when the list is long enough to be windowed: the
  // range, and the heights of the spacers that stand for the rest.


  windowSlice(rows = []) {
    const count = rows.length;

    if (count < WINDOW_FROM || this.isList) {
      this._windowed = false;
      this._windowCount = count;
      return null;
    }

    this._windowed = true;
    this._windowCount = count;
    const height = this._rowHeight || ROW_HEIGHT_GUESS;
    const range = this.clampWindow(this._windowRange ?? {
      first: 0,
      last: WINDOW_INITIAL - 1
    }, count);
    this._windowRange = range;
    return {
      first: range.first,
      last: range.last,
      before: range.first * height,
      after: Math.max(0, count - 1 - range.last) * height
    };
  }

  clampWindow({
    first = 0,
    last = 0
  } = {}, count = 0) {
    const lastIndex = Math.max(0, count - 1);
    const from = Math.min(Math.max(0, Math.floor(first)), lastIndex);
    const to = Math.min(Math.max(from, Math.floor(last)), lastIndex);
    return {
      first: from,
      last: to
    };
  } // aria-rowcount of a windowed table: every row, the head's included.
  // aria-rowcount (VT-4, APG grid): the head and every record under the
  // filter when the host says how many (total), else the drawn window's.


  ariaRowCount() {
    const total = Number(this.getProp?.("total") ?? this.getAttribute("total") ?? 0);
    if (Number.isSafeInteger(total) && total > 0) return String(total + 1);
    return this.windowRowCount();
  } // A row's aria-rowindex: in a windowed table its place in the window, in
  // a page of a longer list (total and row-offset) its place in the list;
  // else none -- the rows drawn are all there is.


  ariaRowIndex(index, windowed) {
    if (windowed) return String(index + 2);
    const total = Number(this.getProp?.("total") ?? this.getAttribute("total") ?? 0);
    const offset = Number(this.getProp?.("rowOffset") ?? this.getAttribute("row-offset") ?? 0);
    if (!Number.isSafeInteger(total) || total <= 0 || !Number.isSafeInteger(offset) || offset <= 0) return null;
    return String(offset + index + 2);
  }

  windowRowCount() {
    return this._windowed ? String((this._windowCount ?? 0) + 1) : null;
  } // Which rows a person can see: the body's place against the viewport and
  // the table's own scroll box, in row heights.


  seenRows(count) {
    const body = this.refs.table?.value?.tBodies?.[0];
    if (!body || !count) return null;
    const box = body.getBoundingClientRect();
    let top = 0;
    let bottom = globalThis.innerHeight || document.documentElement.clientHeight || 0;
    const scroll = this.refs.scroll?.value;

    if (scroll) {
      const clip = scroll.getBoundingClientRect();
      top = Math.max(top, clip.top);
      bottom = Math.min(bottom, clip.bottom);
    }

    const height = this._rowHeight || ROW_HEIGHT_GUESS;
    const lastIndex = count - 1;
    const first = Math.min(lastIndex, Math.max(0, Math.floor((top - box.top) / height)));
    const last = Math.min(lastIndex, Math.max(first, Math.ceil((bottom - box.top) / height)));
    return {
      first,
      last
    };
  } // After a render and on every scroll: measure a drawn row, and move the
  // range when the rows in view come near its edge. Answers whether the
  // range moved.


  syncWindow() {
    if (!this._windowed) return false;
    const table = this.refs.table?.value;
    const drawn = table?.querySelectorAll?.("tbody tr[data-row-id]") ?? [];
    let moved = false;

    if (drawn.length) {
      // The average of the drawn rows: a row of two lines among rows of
      // one does not throw the spacers off.
      const first = drawn[0].getBoundingClientRect();
      const last = drawn[drawn.length - 1].getBoundingClientRect();
      const height = (last.bottom - first.top) / drawn.length;

      if (height > 0 && Math.abs(height - (this._rowHeight || 0)) > 0.5) {
        this._rowHeight = height;
        moved = true;
      }
    }

    const count = this._windowCount ?? 0;
    const seen = this.seenRows(count);
    if (!seen) return false;
    const range = this._windowRange ?? {
      first: 0,
      last: WINDOW_INITIAL - 1
    };
    const lowEdge = range.first > 0 ? range.first + WINDOW_MARGIN / 2 : 0;
    const highEdge = range.last < count - 1 ? range.last - WINDOW_MARGIN / 2 : count - 1;

    if (seen.first < lowEdge || seen.last > highEdge) {
      this._windowRange = this.clampWindow({
        first: seen.first - WINDOW_MARGIN,
        last: seen.last + WINDOW_MARGIN
      }, count);
      moved = true;
    }

    if (!moved) return false;
    this._windowOnly = true;
    this.requestComponentUpdate("window");
    const {
      first,
      last
    } = this._windowRange;

    if (this._reportedWindow !== `${first}-${last}`) {
      this._reportedWindow = `${first}-${last}`;
      this.emitTableEvent("window", {
        first,
        last
      });
    }

    return true;
  }

  bindWindowScroll() {
    if (this._windowScrollAbort) return;
    this._windowScrollAbort = new AbortController();
    const signal = this._windowScrollAbort.signal;

    const onScroll = () => {
      if (!this._windowed || this._windowFrame) return;
      this._windowFrame = requestAnimationFrame(() => {
        this._windowFrame = 0;
        if (this.isConnected) this.syncWindow();
      });
    }; // Any scroll box between the rows and the page moves them: listened
    // once, in the capture phase, on the document.


    document.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true,
      signal
    });
    globalThis.addEventListener?.("resize", onScroll, {
      passive: true,
      signal
    });
  }

  unbindWindowScroll() {
    this._windowScrollAbort?.abort();
    this._windowScrollAbort = null;
    if (this._windowFrame) cancelAnimationFrame(this._windowFrame);
    this._windowFrame = 0;
  } // A cell that only shows a value is class markup (§18.4): what kind of
  // markup this one is, or null for a cell the full renderer draws.


  rowMarkupCell(row, column) {
    const key = column?.key;
    if (!key || !row) return null;
    const size = this.size === "1/2" ? "1/2" : "1";

    if (key === "select") {
      const cell = row.select?.component;
      if (cell?.type !== "checkbox" || typeof cell.props?.["@change"] !== "function") return null;
      return {
        kind: "box",
        size,
        checked: cell.props.checked === true,
        value: String(cell.props.value ?? row.id ?? ""),
        label: cell.props.ariaLabel ?? "",
        change: cell.props["@change"]
      };
    }

    if (key === "settings") {
      // A row menu with nothing to open is not drawn (rows taken before
      // the host said it has no row actions keep their default cell).
      if (!column.rowComponent && !this.rowMenuHasUse()) return {
        kind: "empty"
      };
      const cell = row.settings?.component;
      if ((0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(`sf-${String(cell?.type ?? "").replace(/^sf-/u, "")}`) !== "sf-button-icon" || cell.props?.icon !== "menu" || typeof cell.props?.["@click"] !== "function") return null;
      return {
        kind: "menu",
        size,
        label: cell.props.ariaLabel ?? this.text("menuLabel"),
        click: cell.props["@click"]
      };
    } // The actions cell keeps one kind whether its buttons show or not: a
    // row whose arrangement changes is drawn anew, and the focus that
    // brought the buttons in would leave with the old row.


    if (column.system || column.component || column.renderer === "link" || column.role === "title") return null; // A status or a fact (C31) is the full renderer's: the dot with its
    // word, the badge.

    if (column.list === "status" || column.list === "fact" && this.factMarked(column, row)) return null;
    if (this.isTree() || row.path || this.cellEditable(row, column)) return null;
    const value = row[key];
    if (value === null || typeof value === "undefined") return {
      kind: "empty"
    };
    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") return null;

    if (LONG_TEXT_CELL_TYPES.has(column.propertyType ?? column.property_type ?? column.type) && typeof value !== "boolean") {
      const text = this.cellText(column, value);
      return {
        kind: "text",
        className: "sf-table-cell-clip",
        text,
        title: text
      };
    }

    const typed = this.cellValue(column, value);

    if (typed !== null && typeof typed !== "undefined") {
      if (typeof typed !== "string" && typeof typed !== "number") return null;
      const datetime = this.cellDateTime(column, value);
      if (datetime) return {
        kind: "time",
        className: "sf-table-cell-bare",
        text: String(typed),
        datetime,
        title: this.cellTitle(column, value)
      };
      return {
        kind: "text",
        className: "sf-table-cell-bare",
        text: String(typed)
      };
    }

    if (typeof value === "boolean") return null;
    const text = String(value);
    return {
      kind: "text",
      className: "sf-table-cell-text",
      text,
      title: text.length > 80 ? text : null
    };
  } // The rows a keyboard walks: the drawn and the undrawn, never a «show
  // more» line.


  keyboardRows() {
    return (this.getTableData().rows || []).filter(row => row && !row.__tree?.more);
  } // The current row is marked in the page rather than through state. Going
  // through state re-rendered the rows on every click, and a render between a
  // box's click and its change event swallowed the change — one click on a
  // row was enough to lose a Shift-range selection. The field is read back by
  // the template, so a later render keeps the mark.


  focusRow(rowId, {
    reveal = false,
    focus = true
  } = {}) {
    // The action focus-row {id} (component.json) answers an outcome.
    if (rowId && typeof rowId === "object") return this.focusRowAction(rowId);
    if (rowId == null || rowId === "") return this;
    this._cursorRowId = String(rowId); // The list's rows: the item is marked, and the focus goes to its title
    // link where it has one (the row's tab stop), else to the item.

    if (this.isList) {
      const selector = `.sf-table-list-item[data-row-id="${String(rowId).replace(/"/gu, '\\"')}"]`;

      for (const marked of this.querySelectorAll(".sf-table-list-item[data-current]")) marked.removeAttribute("data-current");

      const item = this.querySelector(selector);
      item?.setAttribute("data-current", "");
      if (reveal) item?.scrollIntoView?.({
        block: "nearest",
        behavior: "instant"
      });
      if (focus) (item?.querySelector(".sf-table-title-link") ?? item)?.focus?.({
        preventScroll: true
      });
      return this;
    }

    const table = this.refs.table?.value;
    if (!table) return this;
    const selector = `tbody tr[data-row-id="${String(rowId).replace(/"/gu, '\\"')}"]`;

    for (const marked of table.querySelectorAll("tbody tr[data-current]")) {
      marked.removeAttribute("data-current");
    }

    const row = table.querySelector(selector);

    if (!row && this._windowed) {
      // A row outside the drawn range: the range moves to it, and the row
      // takes the focus once it is drawn (§18.4).
      const rows = this.getTableData().rows || [];
      const index = rows.findIndex((one, at) => this.getRowKey(one, at) === String(rowId));

      if (index >= 0) {
        this._windowRange = this.clampWindow({
          first: index - WINDOW_MARGIN,
          last: index + WINDOW_MARGIN
        }, rows.length);
        this._pendingFocusRow = String(rowId);
        this._windowOnly = true;
        this.requestComponentUpdate("window");
      }

      return this;
    }

    row?.setAttribute("data-current", ""); // At once, not smoothly: a page that scrolls smoothly would move the
    // window back to where it passes before it arrives.

    if (reveal) row?.scrollIntoView?.({
      block: "nearest",
      behavior: "instant"
    });
    row?.focus?.({
      preventScroll: true
    });
    return this;
  } // A double click opens the record, and only when the record says it can be
  // opened: the row has to offer the view action. Without it the double click
  // does nothing at all — silently, because a person double-clicking a row
  // that cannot be opened has not made a mistake worth a message.


  canOpenRow(row) {
    return Array.isArray(row?.actions) && row.actions.includes("view");
  }

  handleRowOpen(event, row) {
    if (this.isRowControlTarget(event?.target) || !this.canOpenRow(row)) return this; // With row-open="row" the first click of a double click has opened
    // the record already: the second is the same wish, not a second one.

    if (event?.type === "dblclick" && this.getAttribute("row-open") === "row") return this;
    const id = row?.id;
    if (id == null) return this;
    this.requestOpen(row, false);
    return this.requestActionIntent("view", [id]);
  } // The keyboard reaches the same two answers as the pointer: Enter opens the
  // row, Space marks it. Without them the row would be focusable and mute,
  // and marking would be reachable only by pointing at the box.
  // ─── the tree (data view port 1.8.0) ─────────────────────────────────────
  // A table is a tree when its rows carry __tree, which the data view writes
  // from the host's levels. The table only draws it and says what a person
  // asked for; which nodes exist and what opening one means is the view's.
  // Read for every cell of a draw: answered once per list (the rows array is
  // replaced, never edited in place).


  isTree() {
    const rows = this.getTableData?.().rows ?? [];
    if (this._treeMemo?.rows !== rows) this._treeMemo = {
      rows,
      tree: rows.some(row => row?.__tree)
    };
    return this._treeMemo.tree;
  } // The column a tree hangs from: the one the host marked as the title, or
  // the first column that holds data.


  treeColumnKey(columns = this.getColumns()) {
    if (!this.isTree()) return null;
    const data = columns.filter(column => column?.key && !["select", "settings", "actions"].includes(column.key) && !column.system);
    return (data.find(column => column.role === "title") ?? data[0])?.key ?? null;
  }

  toggleTreeRow(row) {
    if (this.isActionParameters?.(row, ["row"]) && !row.__tree) row = row.row;
    if (!row?.__tree?.hasChildren) return {
      outcome: "refused",
      reason: "no-children"
    };
    this.emitTableEvent("expand", Object.freeze({
      id: row.id,
      expanded: row.__tree.expanded === true
    }));
    return {
      outcome: "applied"
    };
  }

  requestTreeMore(row) {
    if (this.isActionParameters?.(row, ["row"]) && !row.__tree) row = row.row;
    if (!row?.__tree?.more) return {
      outcome: "refused",
      reason: "no-more"
    };
    this.emitTableEvent("load-more", Object.freeze({
      direction: "after",
      parent: row.__tree.parent,
      cursor: row.__tree.cursor ?? null
    }));
    return {
      outcome: "applied"
    };
  }

  handleRowKeydown(event, row) {
    // In the list the row's title link is its tab stop: the arrows, Home
    // and End move from it as from the row.
    // In the table the grid walks from a control (C146 (8)).
    const fromTitle = this.isList && event?.target !== event?.currentTarget && event?.target?.matches?.(".sf-table-title-link") && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event?.key);
    if (event?.target !== event?.currentTarget && !fromTitle) return this; // A treegrid row: the right arrow opens a closed node, the left arrow
    // closes an open one.

    if (row?.__tree?.hasChildren && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      const open = row.__tree.expanded === true;

      if (event.key === "ArrowRight" !== open) {
        event.preventDefault?.();
        return this.toggleTreeRow(row);
      }
    }

    if (event.key === "Enter") {
      return this.handleRowOpen({
        target: event.currentTarget
      }, row);
    } // The arrows, Home and End move between rows, drawn or not (§4.6,
    // §18.4): a row outside the window is drawn and then focused.


    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) && !event.altKey && !event.metaKey && !event.ctrlKey) {
      const rows = this.keyboardRows();
      const at = rows.findIndex(one => String(one?.id ?? one?.value) === String(row?.id ?? row?.value));
      const to = {
        ArrowDown: at + 1,
        ArrowUp: at - 1,
        Home: 0,
        End: rows.length - 1
      }[event.key];

      if (at >= 0 && to >= 0 && to < rows.length && to !== at) {
        event.preventDefault?.();
        this.focusRow(this.getRowKey(rows[to], to), {
          reveal: true
        });
      }

      return this;
    }

    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault?.();
      const checked = row?.select?.component?.props?.checked !== true;
      return this.applyRowSelection(row?.id, checked, {
        range: event.shiftKey === true
      });
    }

    return this;
  }

  clearSelection() {
    this._selectionAnchorId = null;
    this.set({
      settingsChecked: false,
      selectIndeterminate: false
    });
    if (!this.getSelectedRecordIds().length) return {
      outcome: "applied"
    };
    this.updateRows(row => ({ ...row,
      selected: false,
      checked: false,
      select: this.getDefaultRowCell(this.TABLE_SELECT_COLUMN, { ...row,
        selected: false,
        checked: false
      })
    }), "select-clear");
    return {
      outcome: "applied"
    };
  } // Composition input port. Only declared ports are accepted; the table never
  // resolves a relation itself. It asks the host through a typed query intent.


  sfPortInput(port, value, meta = {}) {
    if (!Object.hasOwn(SF_TABLE_PORTS.inputs, port)) {
      throw new TypeError(`sf-view-table has no input port ${String(port)}`);
    }

    const recordIds = checkedRecordIds(value);
    const sequence = Number.isSafeInteger(meta?.sequence) && meta.sequence > this._querySequence ? meta.sequence : this._querySequence + 1;
    this._routeContext = Object.freeze({
      record_ids: recordIds
    });
    this._querySequence = sequence;
    this.clearSelection();
    this.requestContextQuery(sequence);
    return undefined;
  }

  requestContextQuery(sequence) {
    this._pendingQuerySequence = sequence;
    this._abandonedQuery = false;
    this.setDataState("loading");
    return this.emitTableEvent("query", Object.freeze({
      reason: "context",
      context: this._routeContext,
      sequence
    }));
  } // A table that is the content of an sf-view whose code has not arrived
  // yet does not draw on its own (DEV decision msg-e39bb812: zero toolbar
  // shift when saved views are declared). The Loader defines the table
  // before the view, and drawn alone it showed its own toolbar -- the
  // search field across the whole row, the filter button and the
  // saved-views control coming in a frame later -- for the frames before
  // the view's first paint replaced it with the skeleton, whose toolbar
  // stands where the answer draws it: the toolbar moved by the width of
  // the controls (181 px with saved views declared, 141 px without, at
  // 1440). It draws once the view is defined, with what the view gave it.
  // A table the server printed (its static markup) is adopted as before.
  // The wait is bounded (saved-views r2, D2): when the view's code fails to
  // load (its script errs; the Loader's other form is given half a second)
  // or has not come in VIEW_WAIT_MS, the table draws on its own, without
  // the view's toolbar, and says so once in the console. Without the bound
  // a view whose code never came left the area blank for the page's life.


  canScheduleComponentUpdate(reason = "unknown") {
    if (this._waitsForView()) return false;
    return super.canScheduleComponentUpdate(reason);
  }

  _waitsForView() {
    if (this._viewDefined) return false;
    const host = this.parentElement;
    const waits = Boolean(host) && (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.isTag)(host, "sf-view") && this.getAttribute("slot") === "content" && !globalThis.customElements?.get?.(host.localName) && !this.querySelector("[data-sf-static]");

    if (!waits) {
      this._viewDefined = true;
      return false;
    }

    if (!this._viewWait) {
      const done = reason => {
        if (this._viewDefined) return;
        clearTimeout(this._viewWaitTimer);
        this._viewWaitAbort?.abort();
        this._viewWait = null;
        this._viewDefined = true;

        if (reason !== "defined") {
          console.warn(`sf-view-table: the ${host.localName} around this table ${reason === "failed" ? "failed to load" : `was not defined in ${VIEW_WAIT_MS} ms`}; the table draws on its own, without the view's toolbar.`);
        }

        if (this.isConnected) this.requestComponentUpdate("host-view");
      };

      this._viewWait = globalThis.customElements.whenDefined(host.localName).then(() => done("defined"));
      this._viewWaitTimer = setTimeout(() => done("timeout"), VIEW_WAIT_MS);
      this._viewWaitAbort = new AbortController(); // A script of the view's own module that errs: the Loader tries
      // the module's other form once, so the table waits a little more.

      document.addEventListener("error", event => {
        const src = event.target?.localName === "script" ? String(event.target.src || "") : "";
        if (!VIEW_SCRIPT.test(src)) return;
        clearTimeout(this._viewWaitTimer);
        this._viewWaitTimer = setTimeout(() => done("failed"), VIEW_SCRIPT_RETRY_MS);
      }, {
        capture: true,
        signal: this._viewWaitAbort.signal
      }); // The view's module may have failed before this table was defined
      // (view modular step 1: sf-view relates to the table lazily, so a
      // table in the markup is asked for by the package core, and the
      // view's script can err first): the Loader says the view's tag
      // failed in public (SF.Loader.settled(tag), core.runtime 1.67.0,
      // group build 17 L2; the core's internal pending tags before view
      // round 17), and the table draws on its own at once instead of at
      // VIEW_WAIT_MS.

      globalThis.SF?.Loader?.settled?.(host.localName)?.then?.(how => {
        if (how === "failed") done("failed");
      });
    }

    return true;
  }

  onConnected() {
    super.onConnected(); // The content widths are read once the rows are drawn, and a font or
    // a component's stylesheet that arrives after that makes the same
    // content wider: columns measured before it stayed narrow and their
    // values wrapped onto two lines until something re-rendered the table
    // (owner, 2026-10-14: «after I changed the sort it was right»). The
    // Loader brings a part's stylesheet when the page first uses it, and
    // fonts load late, so both send the widths to be read again.

    if (!this._lateLayoutAbort) {
      this._lateLayoutAbort = new AbortController();
      const signal = this._lateLayoutAbort.signal;

      const again = () => {
        if (this._lateLayoutFrame) return;
        this._lateLayoutFrame = requestAnimationFrame(() => {
          this._lateLayoutFrame = 0;
          if (this.isConnected && this.measureContentWidths()) this.widthsChanged();
        });
      };

      document.fonts?.addEventListener?.("loadingdone", again, {
        signal
      });
      document.fonts?.ready?.then?.(() => {
        if (!signal.aborted) again();
      });
      document.addEventListener("load", event => {
        if (event.target?.localName === "link" && /stylesheet/u.test(event.target.rel)) again();
      }, {
        capture: true,
        signal
      });
    }

    if (typeof ResizeObserver !== "undefined" && !this._responsiveObserver) {
      // The columns that fit and the pinned offsets follow in the next
      // frame (VM-2, view round 15): drawn in the observer's own
      // callback, the new columns resized the list in the frame that was
      // being observed, and a record docked beside the list drew
      // «ResizeObserver loop completed» twice.
      // The first width is taken at once: the first paint depends on it.
      this._responsiveObserver = new ResizeObserver(([entry]) => {
        this._observedWidth = Math.floor(entry.contentRect.width);

        const follow = () => {
          const width = this._observedWidth;

          if (width > 0 && width !== this._responsiveWidth) {
            this._responsiveWidth = width;
            this.requestComponentUpdate("responsive-columns");
          }

          this.measurePinnedColumns();
        };

        if (!(this._responsiveWidth > 0)) follow();else this._inNextFrame("responsive", follow);
      });

      this._observeResponsiveBox();
    }

    if (this._abandonedQuery && this._routeContext) {
      this._querySequence += 1;
      this.requestContextQuery(this._querySequence);
    }
  } // Latest result wins: only the answer to the newest pending context query
  // is applied, and at most once.


  applyQueryResult(sequence, rows) {
    if (this.isActionParameters?.(sequence, ["sequence", "rows"])) ({
      sequence,
      rows
    } = sequence);

    if (!Number.isSafeInteger(sequence) || sequence !== this._pendingQuerySequence || !Array.isArray(rows)) {
      return {
        outcome: "refused",
        reason: "stale"
      };
    }

    this._pendingQuerySequence = null;
    this.setRows(rows);
    this.setDataState("auto");
    return {
      outcome: "applied"
    };
  }

  getQueryContext() {
    return this._routeContext;
  }

  getItemRef(id) {
    if (!this.refs.items.has(id)) {
      this.refs.items.set(id, this.createRef());
    }

    return this.refs.items.get(id);
  } // The table had its own copy of this, which created an element on every
  // render; the base's one keeps the element a position in the template
  // already has. Nothing else about the call changes.


  setIndeterminate() {
    const checked = this.state.data.rows.filter(row => {
      return row.select.component.props.checked;
    });
    return checked.length;
  }

  getTableData() {
    const data = this.state?.data;
    return data && typeof data === "object" ? data : {
      columns: [],
      rows: []
    };
  }

  isContextMenuEvent(event) {
    const target = event?.target;

    if (!(target instanceof Node)) {
      return false;
    }

    const portal = this._portalContainer;

    if (portal instanceof Node && (portal === target || portal.contains(target))) {
      return true;
    }

    const contextMenu = this.refs?.contextMenu?.value;

    if (!(contextMenu instanceof Node)) {
      return false;
    }

    if (contextMenu === target || contextMenu.contains(target)) {
      return true;
    }

    return event.composedPath?.().includes(contextMenu) || false;
  }

  contextEvent(event) {
    if (this.isContextMenuEvent(event)) {
      return;
    } // Nothing in the column settings window is pending any more -- the pin,
    // the tick and the order each apply as they are made -- so a click away
    // has nothing of theirs to lose. What it still drops is the filter form
    // a person was filling in, which is a query rather than a setting.


    this.tempSettings = null;
    this.closeContextMenu(false);
  }

  splitItemsByColumns(items = [], columnCount = 1) {
    const normalizedItems = Array.isArray(items) ? items : [];
    const normalizedColumnCount = Math.max(1, Number(columnCount) || 1);
    const itemsPerColumn = Math.ceil(normalizedItems.length / normalizedColumnCount);

    if (!itemsPerColumn) {
      return [];
    }

    return Array.from({
      length: normalizedColumnCount
    }, (_, index) => normalizedItems.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn)).filter(columnItems => columnItems.length);
  }

  getPendingFilterState(filter = this.state?.filter || {}) {
    const tempFilter = this.tempSettings?.filter || {};
    const hasTempSelectedTemplateKey = Object.prototype.hasOwnProperty.call(tempFilter, "selectedTemplateKey");
    return { ...filter,
      ...tempFilter,
      selectedTemplateKey: hasTempSelectedTemplateKey ? tempFilter.selectedTemplateKey : filter.selectedTemplateKey,
      templates: tempFilter.templates || filter.templates || []
    };
  }

  getSortedFilterTemplates(filter = this.state?.filter || {}) {
    const templates = this.getFilterTemplates(filter);
    return templates.map((template, sourceIndex) => ({ ...template,
      sourceIndex,
      order: typeof template.order === "number" ? template.order : sourceIndex
    })).sort((left, right) => {
      if (Boolean(left.pinned) !== Boolean(right.pinned)) {
        return left.pinned ? -1 : 1;
      }

      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.sourceIndex - right.sourceIndex;
    });
  }

  changeTempFilterTemplateSettings(key, patch = {}) {
    if (!key) return;
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map(template => {
      for (const [k, v] of Object.entries(patch)) {
        template[k] = key === template.key ? v : !v;
      }

      return template;
    });
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: currentFilter.selectedTemplateKey,
        templates
      }
    };
    this.requestComponentUpdate("temp-filter-template");
  }

  patchTempFilterTemplateSettings(key, patch = {}) {
    if (!key) return;
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map(template => template.key === key ? { ...template,
      ...(typeof patch === "function" ? patch(template) : patch)
    } : template);
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: currentFilter.selectedTemplateKey,
        templates
      }
    };
    this.requestComponentUpdate("temp-filter-template");
  }

  selectTempFilterTemplate(key) {
    if (!key) return;
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map(template => ({ ...template,
      selected: template.key === key
    }));
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: key,
        templates
      }
    };
    this.requestComponentUpdate("temp-filter-template");
  }

  normalizeFilterTemplate(template = {}, sourceIndex = 0) {
    const key = template.key || `filter_template_${sourceIndex + 1}`;
    const data = template.data && typeof template.data === "object" ? template.data : {};
    return { ...template,
      key,
      label: template.label || data.template_name || key,
      data: { ...data,
        values: { ...(data.values || {})
        },
        tags: { ...(data.tags || {})
        }
      }
    };
  } // Whether a saved filter sets conditions: its tags, its values, or the
  // query a saved view of sf-view carries (query.filters).


  filterTemplateHolds(template) {
    const some = value => {
      if (value == null || value === "") return false;
      if (Array.isArray(value)) return value.some(some);
      if (typeof value === "object") return Object.values(value).some(some);
      return true;
    };

    const tags = Object.values(template?.data?.tags || {}).filter(tag => tag?.active !== false);
    return tags.length > 0 || some(template?.data?.values) || some(template?.query?.filters) || some(template?.filters);
  }

  getFilterTemplates(filter = this.state?.filter || {}) {
    const templates = (filter.templates || []).map((template, index) => this.normalizeFilterTemplate(template, index));

    if (templates.length) {
      return templates;
    }

    return [this.normalizeFilterTemplate({
      key: filter.selectedTemplateKey || "default",
      label: this.text("defaultTemplateText"),
      selected: true,
      order: 0,
      data: {}
    })];
  }

  getFilterTemplateByKey(key, filter = this.state?.filter || {}) {
    if (!key || !filter) return null;
    return this.getFilterTemplates(filter).find(template => template.key === key) || null;
  }

  getSelectedFilterTemplate(filter = this.state?.filter || {}) {
    const templates = this.getFilterTemplates(filter);
    const hasSelectedTemplateKey = Object.prototype.hasOwnProperty.call(filter, "selectedTemplateKey");

    if (hasSelectedTemplateKey && filter.selectedTemplateKey === "") {
      return null;
    }

    const selectedKey = filter.selectedTemplateKey || templates.find(template => template.selected)?.key || templates[0]?.key || "";
    return this.getFilterTemplateByKey(selectedKey, { ...filter,
      templates
    }) || templates[0] || null;
  }

  getCurrentFilterValues(filter = this.state?.filter || {}) {
    const selectedTemplate = this.getSelectedFilterTemplate(filter);
    return { ...(selectedTemplate?.data?.values || {})
    };
  }

  getCurrentFilterTags(filter = this.state?.filter || {}) {
    const selectedTemplate = this.getSelectedFilterTemplate(filter);
    return { ...(selectedTemplate?.data?.tags || {})
    };
  }

  normalizeFilterDataForCompare(value) {
    if (Array.isArray(value)) {
      return value.map(item => this.normalizeFilterDataForCompare(item));
    }

    if (value && typeof value === "object") {
      return Object.keys(value).sort().reduce((result, key) => ({ ...result,
        [key]: this.normalizeFilterDataForCompare(value[key])
      }), {});
    }

    return value;
  }

  isSameFilterData(current, next) {
    return JSON.stringify(this.normalizeFilterDataForCompare(current || {})) === JSON.stringify(this.normalizeFilterDataForCompare(next || {}));
  }

  getMergedFilterDraftData(filter = this.state?.filter || {}, tempFilter = this.tempSettings?.filter || {}) {
    const baseFilter = this.getPendingFilterState({ ...filter,
      selectedTemplateKey: Object.prototype.hasOwnProperty.call(tempFilter, "selectedTemplateKey") ? tempFilter.selectedTemplateKey : filter.selectedTemplateKey,
      templates: tempFilter.templates || filter.templates || []
    });
    const currentTags = this.getCurrentFilterTags(baseFilter);
    const currentValues = this.getCurrentFilterValues(baseFilter);
    const tags = tempFilter.replaceTags ? { ...(tempFilter.tags || {})
    } : { ...currentTags,
      ...(tempFilter.tags || {})
    };
    const values = tempFilter.replaceValues ? { ...(tempFilter.values || {})
    } : { ...currentValues,
      ...(tempFilter.values || {})
    };
    Object.entries(tempFilter.values || {}).forEach(([key, value]) => {
      if (!this.isEmptyFilterEntry(value)) {
        return;
      }

      delete values[key];
      delete tags[key];
    });
    return {
      filter: baseFilter,
      tags,
      values
    };
  }

  hasPendingFilterDataChanges(filter = this.state?.filter || {}) {
    const tempFilter = this.tempSettings?.filter;

    if (!tempFilter || !Object.prototype.hasOwnProperty.call(tempFilter, "tags") && !Object.prototype.hasOwnProperty.call(tempFilter, "values") && !tempFilter.replaceTags && !tempFilter.replaceValues) {
      return false;
    }

    const draft = this.getMergedFilterDraftData(filter, tempFilter);
    return !this.isSameFilterData(this.getCurrentFilterTags(draft.filter), draft.tags) || !this.isSameFilterData(this.getCurrentFilterValues(draft.filter), draft.values);
  } // The filter window waits for its button, so a draft and a live query look
  // alike -- the same confusion the pins had, in the window where waiting is
  // the right behaviour. This counts what a press would change, by field: a
  // field whose tag was switched on or off, or whose value or operator
  // differs. Fields are what a person reads as conditions.


  countPendingFilterConditionChanges(filter = this.state?.filter || {}) {
    const tempFilter = this.tempSettings?.filter;
    if (!tempFilter) return 0;
    const draft = this.getMergedFilterDraftData(filter, tempFilter);
    const current = {
      tags: this.getCurrentFilterTags(draft.filter),
      values: this.getCurrentFilterValues(draft.filter)
    };

    const same = (left, right) => this.isSameFilterData(left, right);

    const keys = new Set([...Object.keys(current.tags || {}), ...Object.keys(draft.tags || {}), ...Object.keys(current.values || {}), ...Object.keys(draft.values || {})]);
    let changed = 0;

    for (const key of keys) {
      const wasActive = Boolean((current.tags || {})[key]?.active);
      const willBeActive = Boolean((draft.tags || {})[key]?.active);

      if (wasActive !== willBeActive) {
        changed += 1;
        continue;
      }

      if (!same((current.values || {})[key], (draft.values || {})[key])) {
        changed += 1;
      }
    }

    return changed;
  }

  hasUnsavedFilterDataChanges() {
    return Boolean(this.state?.filterDataDirty && this.getSelectedFilterTemplate(this.state?.filter || {}));
  }

  saveCurrentFilterTemplateData() {
    const template = this.getSelectedFilterTemplate(this.state?.filter || {});

    if (!template) {
      return this;
    }

    return this.set({
      filterDataDirty: false
    }, () => {
      this.dispatchFilterTemplateSave(template.key, this.state.filter, this.getFilterTemplateByKey(template.key));
    });
  }

  mergeObjectDeep(target = {}, patch = {}) {
    return Object.entries(patch || {}).reduce((result, [key, value]) => {
      const currentValue = result[key];
      const shouldMerge = value && typeof value === "object" && !Array.isArray(value) && currentValue && typeof currentValue === "object" && !Array.isArray(currentValue);
      return { ...result,
        [key]: shouldMerge ? this.mergeObjectDeep(currentValue, value) : value
      };
    }, { ...(target || {})
    });
  }

  patchFilterTemplateByKey(key, filter = this.state.filter, props = {}) {
    if (!key || !filter) return {
      filter,
      template: null
    };
    let patchedTemplate = null;
    const nextFilter = { ...filter,
      templates: this.getFilterTemplates(filter).map(template => {
        if (key !== template.key) {
          return template;
        }

        const nextPatch = typeof props === "function" ? props(template) : props;
        patchedTemplate = this.mergeObjectDeep(template, nextPatch);
        return patchedTemplate;
      })
    };
    return {
      filter: nextFilter,
      template: patchedTemplate
    };
  }

  createFilterTemplatePatchState(filter, options = {}) {
    const nextState = {
      filter
    };

    if (Object.prototype.hasOwnProperty.call(options, "saveInputValue")) {
      nextState.saveInputValue = options.saveInputValue;
    }

    return nextState;
  } // Which fields the filter is showing, in the order the host gave them.
  // These are the chips a person adds under "Поля": without them a saved view
  // came back with the fields it was saved without.


  getActiveFilterFieldKeys(filter = this.state?.filter || {}) {
    const tags = this.getCurrentFilterTags(filter);
    const order = this.getFilterFields().map(field => field?.key);
    const chosen = Object.keys(tags).filter(key => tags[key]?.active);
    return [...order.filter(key => chosen.includes(key)), ...chosen.filter(key => !order.includes(key))];
  } // Puts those fields back. The template keeps every other part of itself;
  // only which fields are shown is replaced, because that is what was saved.


  setActiveFilterFields(keys = [], filter = this.state?.filter || {}) {
    if (!Array.isArray(keys) || keys.some(key => typeof key !== 'string' || !key.trim())) {
      throw new TypeError('Filter field keys must be nonempty strings');
    }

    const template = this.getSelectedFilterTemplate(filter);
    if (!template?.key) return this;
    const fields = this.getFilterFields();
    const current = this.getCurrentFilterTags(filter);
    const tags = {};

    for (const key of Object.keys(current)) {
      tags[key] = { ...current[key],
        active: false
      };
    }

    for (const key of keys) {
      const field = fields.find(item => item?.key === key);
      tags[key] = { ...(current[key] || {}),
        active: true,
        label: field?.label ?? current[key]?.label ?? key,
        control: field?.filter?.control || field?.type || field?.dataType || current[key]?.control || 'text'
      };
    }

    const patched = this.patchFilterTemplateByKey(template.key, filter, item => ({ ...item,
      data: { ...(item.data || {}),
        tags
      }
    }));
    return this.set({
      filter: patched.filter
    });
  } // The port passes `settings` through as it is, so the chosen fields ride
  // there. Every save path goes through here: the form's own Save is the one
  // the consumer uses, and it used to send a template without them.


  withFilterFieldSettings(detail, filter = this.state?.filter || {}) {
    if (Array.isArray(detail)) {
      return detail.map(item => this.withFilterFieldSettings(item, filter));
    }

    if (!detail || typeof detail !== 'object') return detail;
    const fields = Array.isArray(detail.data?.tags) ? [] : Object.keys(detail.data?.tags || {}).filter(key => detail.data.tags[key]?.active); // With the layout switch the view's layout rides with it too (C31):
    // a saved view opens as the list or the table it was saved as.

    const layout = this.hasLayoutSwitch ? this.chosenLayout || (this.isList ? "list" : "table") : null;
    return { ...detail,
      settings: { ...(detail.settings || {}),
        filter_fields: fields.length ? fields : this.getActiveFilterFieldKeys(filter),
        ...(layout ? {
          layout
        } : {})
      }
    };
  }

  dispatchFilterTemplateSave(key, filter, template = null) {
    const detail = this.withFilterFieldSettings(template || this.getFilterTemplateByKey(key, filter), filter); // §8: the detail is an object; the template rides in templates.

    this.emitTableEvent('template-save', {
      templates: [detail]
    });
    return this;
  }

  getChangedFilterTemplates(prevFilter = {}, nextFilter = {}, keys = []) {
    const prevTemplates = new Map(this.getFilterTemplates(prevFilter).map(template => [template.key, template]));
    return this.getFilterTemplates(nextFilter).filter(template => {
      const prevTemplate = prevTemplates.get(template.key);

      if (!prevTemplate) {
        return true;
      }

      return keys.some(key => !Object.is(prevTemplate[key], template[key]));
    });
  }

  dispatchFilterTemplatesSave(templates = []) {
    const filteredTemplates = templates.filter(template => template?.key);

    if (!filteredTemplates.length) {
      return this;
    }

    this.emitTableEvent('template-save', {
      templates: this.withFilterFieldSettings(filteredTemplates)
    });
    return this;
  }

  saveFilterTemplatePatch(key, props = {}, options = {}, filter = this.state.filter) {
    if (!key || !filter) return this;
    const patched = this.patchFilterTemplateByKey(key, filter, props);
    const nextFilter = { ...patched.filter,
      ...(options.filterPatch || {})
    };
    return this.set(() => this.createFilterTemplatePatchState(nextFilter, options), () => {
      if (options.dispatch !== false) {
        this.dispatchFilterTemplateSave(key, nextFilter, patched.template);
      }
    });
  }

  setDefaultFilterTemplate(key) {
    if (!key) return this;
    return this.set(prevState => {
      const currentFilter = prevState.filter || {};
      const filter = { ...currentFilter,
        templates: this.getFilterTemplates(currentFilter).map(template => ({ ...template,
          default: template.key === key
        }))
      };
      return {
        filter
      };
    });
  }

  patchFilterTemplateData(filter = {}, patch = {}) {
    const filterRest = { ...filter
    };
    delete filterRest.tags;
    delete filterRest.values;
    const templates = this.getFilterTemplates(filterRest);
    const selectedTemplate = this.getSelectedFilterTemplate({ ...filterRest,
      templates
    });

    if (!selectedTemplate) {
      return { ...filterRest,
        templates
      };
    }

    const nextValues = Object.prototype.hasOwnProperty.call(patch, "values") ? patch.values || {} : selectedTemplate.data?.values || {};
    const nextTags = Object.prototype.hasOwnProperty.call(patch, "tags") ? patch.tags || {} : selectedTemplate.data?.tags || {};
    const nextTemplates = templates.map(template => template.key === selectedTemplate.key ? { ...template,
      data: { ...(template.data || {}),
        ...(patch.data || {}),
        values: nextValues,
        tags: nextTags
      }
    } : template);
    return { ...filterRest,
      selectedTemplateKey: selectedTemplate.key,
      templates: nextTemplates
    };
  }

  getFilterPayload(filter = this.state?.filter || {}) {
    const selectedTemplate = this.getSelectedFilterTemplate(filter);
    const payload = { ...(selectedTemplate?.data || {}),
      templateKey: selectedTemplate?.key || "",
      templateLabel: selectedTemplate?.label || "",
      values: this.getCurrentFilterValues(filter),
      tags: this.getCurrentFilterTags(filter)
    };
    const api = this.dateFilterApi();

    if (api && typeof api.buildFilterRequest === "function") {
      try {
        const context = typeof this.getFilterContext === "function" ? this.getFilterContext() : undefined;
        const request = api.buildFilterRequest(payload.values, {
          node: this,
          context
        });

        if (request && typeof request === "object") {
          if (request.values) payload.values = request.values;
          if (request.context) payload.context = request.context;
        }
      } catch {
        /* the values as written */
      }
    }

    return payload;
  }

  selectFilterTemplate(key) {
    if (!key || this.state?.filter?.selectedTemplateKey === key) {
      return this;
    }

    this.set(prevState => {
      const currentFilter = prevState.filter || {};
      const nextFilter = { ...currentFilter,
        selectedTemplateKey: key,
        templates: (prevState.filter?.templates || []).map(template => ({ ...template,
          selected: template.key === key
        }))
      };
      const selectedTemplate = this.getFilterTemplateByKey(key, nextFilter) || nextFilter.templates[0] || null;
      return {
        filter: nextFilter,
        saveInputValue: selectedTemplate?.label || ""
      };
    });
    return this;
  } // The table's lists are reordered with the Framework's sf-sortable (owner,
  // 2026-10-13): a pointer, a finger or the keyboard, a silhouette where the
  // row lands, the steps announced. A pinned row moves among pinned rows and
  // a loose one among loose ones, so each group is a list of its own and a
  // drag cannot silently unpin anything. What a list asks for arrives as
  // sf-sortable-intent; the order is computed from keys and the window is
  // drawn again from it -- the rows are lit's, not moved by hand.


  static reorderedKeys(list, item, index) {
    const keys = [...list.querySelectorAll('[data-sf-sortable-item]')].filter(node => node.closest('sf-sortable') === list).map(node => node.getAttribute('data-sf-sortable-item')).filter(key => key !== item);
    keys.splice(Math.max(0, Math.min(index, keys.length)), 0, item);
    return keys;
  }

  onFilterTemplateIntent(event) {
    const list = event.target;
    const {
      item,
      index
    } = event.detail ?? {};
    if (!(list instanceof Element) || !item) return;
    const keys = SfTable.reorderedKeys(list, item, index);
    const group = list.getAttribute('data-group') === 'pinned' ? 'pinned' : 'normal';
    const orderedByGroup = {
      pinned: new Map(),
      normal: new Map()
    };
    keys.forEach((key, at) => orderedByGroup[group].set(key, at));
    this.syncFilterTemplateOrder(orderedByGroup);
  }

  syncFilterTemplateOrder(orderedByGroup) {
    const currentFilter = this.getPendingFilterState();
    const templates = this.getFilterTemplates(currentFilter).map((template, sourceIndex) => {
      const group = template.pinned ? "pinned" : "normal";
      const nextOrder = orderedByGroup[group].get(template.key);

      if (typeof nextOrder !== "number") {
        return template;
      }

      return { ...template,
        order: nextOrder,
        sourceIndex
      };
    });
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        selectedTemplateKey: currentFilter.selectedTemplateKey,
        templates: templates.sort((left, right) => {
          if (Boolean(left.pinned) !== Boolean(right.pinned)) {
            return left.pinned ? -1 : 1;
          }

          if (left.order !== right.order) {
            return left.order - right.order;
          }

          return left.sourceIndex - right.sourceIndex;
        })
      }
    };
    this.requestComponentUpdate("temp-filter-template-order");
  } // Whether there is room for every data column to be readable.
  //
  // A floor cannot be a width: write one on a column and it becomes the
  // width, so a cell that needs more wraps and a typed row grows -- measured
  // at 81px against 57 where the typed-cells probe watches it. And a minimum
  // on a cell is ignored in a fixed layout. So the floor is applied only when
  // it is actually needed: while there is room the columns share it as they
  // always have, and when there is not they stop at the floor and the box
  // scrolls, which is what the consumer asked for (Larena, 2026-10-06).


  get columnsAreCramped() {
    if (this._layoutReads?.has('cramped')) return this._layoutReads.get('cramped');
    const cramped = this.readColumnsAreCramped();
    this._layoutReads?.set('cramped', cramped);
    return cramped;
  }

  readColumnsAreCramped() {
    // The box that would do the scrolling is the one to measure. The
    // responsive observer's width is what it last saw, and in an embedded
    // list it had seen nothing at all -- it reported 0 while the columns
    // were 77px wide and wrapping their headings over four lines (owner,
    // 2026-10-09).
    const width = this.refs.scroll?.value?.clientWidth || this._responsiveWidth;
    if (!width) return false;
    const columns = this.getColumns?.() ?? [];
    const floored = columns.filter(column => this.columnTakesFloor(column));
    if (!floored.length) return false;
    const host = this.querySelector(".sf-table") ?? this;
    const raw = globalThis.getComputedStyle?.(host)?.getPropertyValue("--sf-table--column-min-inline-size")?.trim();
    if (!raw) return false;
    const root = Number.parseFloat(globalThis.getComputedStyle?.(document.documentElement)?.fontSize) || 16;
    const floor = raw.endsWith("rem") ? Number.parseFloat(raw) * root : Number.parseFloat(raw);
    if (!Number.isFinite(floor) || floor <= 0) return false; // What the columns that are not floored already take, measured rather
    // than assumed: the select box, the gear, the actions.
    // The actions column counts at its declared width, never more: measured,
    // it had already swallowed the room the data columns were denied, and
    // the measurement made the denial permanent.

    const taken = [...this.querySelectorAll("thead th")].filter(cell => !floored.some(column => column.key === cell.dataset.key)).reduce((total, cell) => total + (cell.dataset.key === "actions" ? Math.min(cell.getBoundingClientRect().width, floor) : cell.getBoundingClientRect().width), 0);
    return width - taken < floored.length * floor;
  } // The actions column as wide as its buttons: each a size-1 icon button, the
  // same measure the settings column is given, with the cell's padding once.
  // Whether the records are a compact list rather than a table: chosen by the
  // width of the box the table sits in, which is what a list beside an open
  // panel is narrow in, not the window.


  get isList() {
    const layout = this.resolvedLayout;
    if (layout === "list") return true;
    if (layout === "table") return false; // A table with row actions that marks key cells stays a table on a
    // phone and keeps them (C259); without key cells, the list below
    // list-below as before.

    if (this.keyedActions) return false;
    return this.isNarrow;
  } // A table with row actions whose host marks key cells (C259).


  get keyedActions() {
    return this.hasRowMenus && (this.getTableData().columns || []).some(isKeyCell);
  } // Below 44rem (the md step, where the row menu is the sheet) such a table
  // keeps the box, «≡» and its key cells alone, without sideways scroll.


  get isKeyedNarrow() {
    if (this.isList || !this.keyedActions || !(this._responsiveWidth > 0)) return false;
    const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return this._responsiveWidth < KEYED_NARROW_REM * rem;
  } // The column whose value is a key cell's second line on a phone (C259).


  keyLineOf(column) {
    return this.isKeyedNarrow ? keyLineOf(column) : null;
  } // Whether the table's container is below list-below: a phone, or a list
  // beside an open panel.


  get isNarrow() {
    const below = Number(this.getProp?.("listBelow")) || 600;
    return this._responsiveWidth > 0 && this._responsiveWidth < below;
  } // The layout drawn (C31). Without the switch, the layout attribute. With
  // it, the person's choice: a list is a list at every width, a table is a
  // table while there is room for it and the list below list-below; with no
  // choice yet, the attribute, where `table` is read as that same `auto`.


  get resolvedLayout() {
    const own = this.getProp?.("layout") ?? "table";
    if (!this.hasLayoutSwitch) return own;
    const chosen = this.chosenLayout;
    if (chosen === "list") return "list";
    if (chosen === "table") return "auto";
    return own === "table" ? "auto" : own;
  }

  get hasLayoutSwitch() {
    const value = this.getAttribute?.("layout-switch");
    return value !== null && value !== undefined && value !== "false";
  } // Where the choice is kept: the table's view preference (preferences-key,
  // else table-settings-key, else remember-widths' own key), else the page
  // session.


  get layoutPreferenceKey() {
    return this.viewPreferenceKey || this.rememberedWidthsKey || "";
  }

  get chosenLayout() {
    const key = this.layoutPreferenceKey;
    const kept = key ? preferences()?.read(key)?.layout : this._sessionLayout;
    return kept === "list" || kept === "table" ? kept : "";
  } // The switch's answer, and the action set-layout {layout}: kept for this
  // person and drawn. A saved view that is opened brings its own (sf-view).


  setLayoutChoice(layout, {
    emit = true
  } = {}) {
    if (this.isActionParameters?.(layout, ["layout"])) layout = layout.layout;
    if (layout !== "list" && layout !== "table") return {
      outcome: "refused",
      reason: "unknown-layout"
    };
    if (layout === this.chosenLayout) return {
      outcome: "unchanged"
    };
    const key = this.layoutPreferenceKey;
    if (key) this.writeTablePreference(key, {
      layout
    });else this._sessionLayout = layout;
    this.applyTableView();
    this.requestComponentUpdate("layout");
    if (emit) this.emitTableEvent("layout-change", Object.freeze({
      layout
    }));
    return {
      outcome: "applied"
    };
  } // The switch's two items, kept while the words are the same (a new array
  // on every render would draw the switch again).


  layoutSwitchItems() {
    const list = this.text("layoutList");
    const table = this.text("layoutTable");

    if (this._layoutSwitchItems?.key !== `${list}|${table}`) {
      this._layoutSwitchItems = {
        key: `${list}|${table}`,
        items: [{
          value: "list",
          label: list,
          icon: "view_agenda",
          iconOnly: true
        }, {
          value: "table",
          label: table,
          icon: "table_rows",
          iconOnly: true
        }]
      };
    }

    return this._layoutSwitchItems.items;
  } // The action set-layout {layout}.


  setLayout(layout) {
    return this.setLayoutChoice(layout);
  } // ─── the list of resources (C31) ─────────────────────────────────────────
  // A list row is a resource row when a column names its place in it
  // (columns[].list: status, title, supporting, fact or hidden).


  listRoles(columns = this.getColumns?.() ?? []) {
    const roles = {
      status: null,
      title: null,
      supporting: [],
      facts: [],
      any: false
    };

    for (const column of columns) {
      const role = this.phoneRole(column, columns);
      if (!column?.key || SYSTEM_COLUMN_KEYS.has(column.key) || column.system) continue;
      if (!LIST_ROLES.has(role)) continue;
      roles.any = true;
      if (role === "status") roles.status ??= column;else if (role === "title") roles.title ??= column;else if (role === "supporting") roles.supporting.push(column);else if (role === "fact") roles.facts.push(column);
    }

    return roles;
  } // The fields a person keeps in a phone row («На телефоне» in the column
  // window, LV3-11): the keys, or null while they chose none and the
  // host's columns[].list and list-fields decide. Kept for this table.


  get phoneFields() {
    const chosen = this.tableView?.phoneFields;
    return Array.isArray(chosen) ? chosen.map(String) : null;
  } // The data columns a phone row may show beside its title and state.


  phoneColumns(columns = this.getColumns?.() ?? []) {
    const data = columns.filter(column => column?.key && !SYSTEM_COLUMN_KEYS.has(column.key) && !column.system);
    const hostRoles = data.some(column => LIST_ROLES.has(column.list));
    const title = data.find(column => column.list === "title") ?? data.find(column => column.role === "title") ?? (hostRoles ? data.find(column => !column.list) : data.find(column => column.visible !== false)) ?? data[0];
    return data.filter(column => column !== title && column.list !== "status" && column.list !== "title");
  } // The fields a phone row shows now: the person's, else the host's
  // supporting lines and facts, else the first list-fields by priority.


  phoneShownKeys(columns = this.getColumns?.() ?? []) {
    const candidates = this.phoneColumns(columns);
    const chosen = this.phoneFields;
    if (chosen) return candidates.filter(column => chosen.includes(String(column.key))).map(column => String(column.key));

    if (candidates.some(column => LIST_ROLES.has(column.list))) {
      return candidates.filter(column => column.list === "supporting" || column.list === "fact").map(column => String(column.key));
    }

    const limit = Math.max(0, Number(this.getProp?.("listFields") ?? 3) || 0);
    return candidates.filter(column => column.visible !== false).map((column, order) => ({
      column,
      order
    })).sort((a, b) => (a.column.priority ?? 1e6) - (b.column.priority ?? 1e6) || a.order - b.order).slice(0, limit).map(({
      column
    }) => String(column.key));
  } // A column's place in a phone row: the host's (columns[].list), or, when
  // the person chose the fields of a list whose host names roles, shown as
  // the host's role (a number, money or a date at the end as a figure, the
  // rest on the line under the title) or hidden.


  phoneRole(column, columns) {
    const chosen = this.phoneFields;
    if (!chosen || !column?.key || column.list === "status" || column.list === "title") return column?.list;
    if (!columns.some(one => LIST_ROLES.has(one?.list))) return column.list;
    if (!this.phoneColumns(columns).includes(column)) return column.list;
    if (!chosen.includes(String(column.key))) return "hidden";
    if (column.list === "supporting" || column.list === "fact") return column.list;
    const type = column.propertyType ?? column.property_type ?? column.type;
    return this.isNumberColumn(column) || type === "date" || type === "datetime" ? "fact" : "supporting";
  } // Whether a fact says more than its value (a status, a warning, a
  // colour): only such a fact is a badge in a table cell (LV3-12); a plain
  // value of a fact column draws as its type does.


  factMarked(column, row) {
    const fact = this.listFact(column, row);
    if (!fact) return false;
    if (fact.level > 0 || fact.scheme) return true; // A worded fact («SSL», «Копия · 2 ч») stays its badge in the table,
    // as C31 draws it; a typed value (money, a number, a date) is written
    // as its type there (LV3-12: they showed raw, in pills).

    const type = String(column?.propertyType ?? column?.property_type ?? column?.type ?? "");
    return !(NUMBER_TYPES.has(type) || ["date", "datetime", "time", "decimal"].includes(type));
  } // The ids of the quick actions, in the order written, at most three.


  get quickActionIds() {
    const written = String(this.getAttribute?.("quick-actions") ?? "");
    return [...new Set(written.split(/[\s,]+/u).filter(Boolean))].slice(0, MAX_QUICK_ACTIONS);
  } // A row's actions split for the list: the quick ones (as the row offers
  // them) and the rest, which the «more» menu holds.


  listRowActions(row) {
    const items = this.rowActionItems(row).filter(item => !Array.isArray(item?.members) || item.members.length);
    const ids = this.quickActionIds;
    const quick = ids.map(id => items.find(item => item?.id === id)).filter(Boolean);
    const rest = items.filter(item => !quick.includes(item));
    return {
      quick,
      rest
    };
  } // The words of a value shown as text in the list: a link cell's text, a
  // choice's label, a typed value formatted as its cell would be.


  listText(column, value) {
    if (value === null || value === undefined || value === "") return "";
    if (Array.isArray(value)) return value.map(item => this.listText(column, item)).filter(Boolean).join(", ");

    if (typeof value === "object") {
      const props = value.component?.props;
      if (props) return String(props.text ?? props.label ?? "");
      return String(value.label ?? value.text ?? value.value ?? "");
    }

    const option = Array.isArray(column?.options) ? column.options.find(item => String(item?.value) === String(value)) : null;
    if (option) return String(option.label ?? option.value); // A typed value as its cell shows it (LV3-13: money read «9800»).

    if (typeof value !== "boolean") {
      const typed = this.cellValue?.(column, value);
      if (typeof typed === "string" || typeof typed === "number") return String(typed);
    }

    return String(this.cellText?.(column, value) ?? value);
  } // The state a status column gives a row: the dot's colour and its word.
  // The value is ok, warning, error or stopped (or the dot's own names); an
  // option of the column may name its `status` and its label.


  listStatus(column, row) {
    const raw = row?.[column?.key];
    if (raw === null || raw === undefined || raw === "") return null;
    const value = typeof raw === "object" ? raw.value ?? raw.status ?? "" : raw;
    const option = Array.isArray(column?.options) ? column.options.find(item => String(item?.value) === String(value)) : null;
    const named = String(option?.status ?? (typeof raw === "object" ? raw.status : "") ?? "") || String(value); // The option's colour (its badge scheme, C140 (2)) colours the dot of
    // a value the status words do not name (LV3-24: a choice in colours
    // drew grey dots and a quiet title on every row).

    const dot = STATUS_DOTS[named] ?? STATUS_DOTS[String(option?.scheme ?? "")] ?? "neutral";
    const word = (typeof raw === "object" ? raw.label ?? raw.text : null) ?? option?.label ?? (STATUS_WORDS[named] ? this.text(STATUS_WORDS[named]) : String(value));
    return {
      dot,
      word: String(word),
      value: String(value)
    };
  } // A fact: its words, how worrying it is (0 fine, 1 warning, 2 error) and
  // what it says on hover. A plain value is fine; an object or a badge
  // component carries its status; an option of the column may name one.


  listFact(column, row) {
    const raw = row?.[column?.key];
    if (raw === null || raw === undefined || raw === "") return null;
    const props = typeof raw === "object" && !Array.isArray(raw) ? raw.component?.props ?? raw : null;
    const option = !props && Array.isArray(column?.options) ? column.options.find(item => String(item?.value) === String(raw)) : null;
    const status = String(props?.status ?? props?.level ?? option?.status ?? "").replace(/^danger$/u, "error");
    const text = this.listText(column, raw);
    if (!text) return null; // The option's colour reaches the badge (owner decision C140 (2): a
    // status or a value is the tonal badge of its scheme; VT-18 of the
    // sf-view-table study: five statuses drew five grey badges). A
    // warning or an error the fact names wins over it.

    const scheme = String(props?.scheme ?? option?.scheme ?? "");
    return {
      text,
      level: FACT_LEVELS[status] ?? 0,
      status: FACT_LEVELS[status] ? status : "",
      scheme: BADGE_SCHEMES.has(scheme) ? scheme : "",
      tip: String(props?.tip ?? props?.title ?? option?.tip ?? "")
    };
  } // The id of the table's shared name tooltip (C146 (7)).


  tipId(key) {
    return `${this.getInstanceId()}--tip--${String(key).replace(/[^\w-]+/gu, "-")}`;
  } // Whether a column holds numbers (C146 (3)): its type, or the host's
  // own word for it (align: end).


  isNumberColumn(column) {
    if (!column?.key || column.system) return false;
    if (column.align === "end" || column.numeric === true) return true;
    return NUMBER_TYPES.has(column.propertyType ?? column.property_type ?? column.type);
  }

  get actionsColumnWidth() {
    const inline = (this.ACTIONS_SETTINGS_ROW ?? []).filter(action => action?.inline !== false).length;
    if (!inline) return "";
    return `calc(${inline} * (var(--sf-text-height-1) + var(--sf-ui-1--space-y-tightness-default) * 2)` + ` + ${inline - 1} * var(--sf-space-1\\/3) + var(--sf-b6))`;
  } // Each data column as wide as its content wants on one line -- the heading
  // and the values shown -- up to a cap, read from the laid-out table: for a
  // moment the table is laid out by its content at its widest (auto layout,
  // max-content), the headings are measured, and the layout goes back. The
  // columns used to share the room equally and stop at a floor, so a long
  // value wrapped in a column a short one did not need (owner, 2026-10-13).
  // A width the host or the person set wins; what does not fit scrolls.


  measureContentWidths() {
    const table = this.refs.table?.value;
    if (!(table instanceof HTMLTableElement) || !table.isConnected) return false;
    if (this._columnResizeState || this.columnDragActive) return false; // The skeleton and an empty or failed list say nothing about the content,
    // and rows kept on screen while the next ones load are the old ones: a
    // measurement of them is thrown away when the answer comes (owner,
    // 2026-10-15, a sort measured the table twice).

    if (table.querySelector('tbody[data-state]') || table.querySelector('tbody[data-busy]') || !table.querySelector('tbody tr td')) return false;
    const measured = new Map();
    let whole = 0; // What the laid-out table says now, read before the measuring class
    // changes it: the cap, the box's width and the system columns' widths
    // (they were read after the class came off: a style and two layouts
    // more of the whole table, at 4x CPU some 60 ms on the admin's list;
    // stand 25). The box scrolls, so the measuring does not change it.

    const cap = this.columnWidthCap();
    const box = table.parentElement?.clientWidth ?? 0;
    const systemWidths = new Map();

    for (const cell of table.querySelectorAll('thead th[data-key]')) {
      if (SYSTEM_COLUMN_KEYS.has(cell.dataset.key)) systemWidths.set(cell, Math.ceil(cell.getBoundingClientRect().width));
    }

    table.classList.add('sf-table-measuring'); // Measured before the table's own stylesheet has come, the measuring
    // class does nothing, the fixed layout squeezes every column to a
    // letter's width, and those widths were applied and held until the
    // sheet arrived (owner, 2026-10-15, frame by frame). Not measured then:
    // the stylesheet's arrival measures again.

    if (getComputedStyle(table).tableLayout !== 'auto') {
      table.classList.remove('sf-table-measuring');
      return false;
    }

    try {
      whole = table.getBoundingClientRect().width;

      for (const cell of table.querySelectorAll('thead th[data-key]')) {
        const key = cell.dataset.key;
        if (SYSTEM_COLUMN_KEYS.has(key)) continue;
        measured.set(key, contentStep(cell.getBoundingClientRect().width));
      }
    } finally {
      table.classList.remove('sf-table-measuring');
    } // The content's own width: every data column at its content width (as
    // contentWidth caps it) and the system columns at their fixed ones. The
    // table is never narrower (contentInlineSize): the column that takes
    // the spare room keeps its content width where there is none, in a
    // box of any width -- a first paint printed at one width and drawn at
    // another squeezed it to a letter's width (standard 1.3.8 gate 24).


    let content = 0;

    for (const cell of table.querySelectorAll('thead th[data-key]')) {
      const key = cell.dataset.key;
      content += SYSTEM_COLUMN_KEYS.has(key) ? systemWidths.get(cell) ?? 0 : Math.min(measured.get(key) ?? 0, cap);
    }

    const contentChanged = content !== (this._contentInlineSize ?? 0);
    this._contentInlineSize = content; // Room to spare: the content is narrower than the box. A fixed table
    // shares the spare room between every column with a width, the box and
    // the menu columns too, so a list of one data column showed it some
    // 330px in, after two wide empty columns (Larena, 2026-10-14). The last
    // data column is then left without a width and takes the spare room.

    const surplus = box > 0 && whole > 0 && whole < box;
    const surplusChanged = surplus !== Boolean(this._contentSurplus);
    this._contentSurplus = surplus; // A cell drawn by an element whose module is still on the way -- the
    // Loader brings parts when a page first uses them -- is empty when this
    // runs, and its column was measured a few pixels wide and kept so:
    // record links broke inside words in a 45px column (Larena,
    // 2026-10-13). Measure again once those elements are drawn.

    this.remeasureWhenDrawn(table);
    const previous = this._contentWidths ?? new Map();
    const changed = measured.size !== previous.size || [...measured].some(([key, width]) => Math.abs((previous.get(key) ?? 0) - width) > 0.01);
    if (changed) this._contentWidths = measured;
    return changed || surplusChanged || contentChanged;
  } // In pixels, capped here rather than with min() in the column's width: a
  // fixed-layout table read min(784px, 20rem) as no fixed width at all and
  // gave that column the whole of the table's spare room.
  // Folds the values of a multi-value cell that do not fit its line into
  // «+N» (see renderCellValues in the template).


  fitCellValues() {
    // A value that is an element not yet drawn -- its module still on the
    // way, as the Loader brings parts when they are first used -- has no
    // width yet, so the line is measured again once it has one.
    const pending = new Set();

    for (const item of this.querySelectorAll('tbody .sf-table-cell-values > :not(.sf-table-cell-more)')) {
      if (item.localName.includes('-') && (!customElements.get(item.localName) || !cellValueBox(item).getBoundingClientRect().width)) {
        pending.add(item.localName);
      }
    }

    if (pending.size && (this._fitRetries ?? 0) < 3) {
      this._fitRetries = (this._fitRetries ?? 0) + 1;
      const token = this._fitToken = (this._fitToken ?? 0) + 1;
      Promise.all([...pending].map(name => customElements.whenDefined(name))).then(() => new Promise(settle => requestAnimationFrame(() => requestAnimationFrame(settle)))).then(() => {
        if (token === this._fitToken && this.isConnected) this.fitCellValues();
      });
    } else if (!pending.size) {
      this._fitRetries = 0;
    } // Every line put back first and read in one go: a line reset and read
    // in turn laid the table out again for each cell (stand 25, 20 rows of
    // tags and references: a third of the time the rows took to draw).


    const lines = [];

    for (const box of this.querySelectorAll('tbody .sf-table-cell-values')) {
      const more = box.querySelector(':scope > .sf-table-cell-more');
      const items = [...box.children].filter(child => child !== more);
      const valueBoxes = items.map(item => cellValueBox(item));
      lines.push({
        box,
        more,
        items,
        valueBoxes
      });
    }

    for (const {
      more,
      valueBoxes
    } of lines) {
      for (const valueBox of valueBoxes) valueBox.classList.remove('sf-table-cell-folded');

      if (!more) continue;
      more.hidden = true;
      more.removeAttribute('title');
    }

    const overflowing = lines.filter(({
      box,
      more
    }) => more && box.scrollWidth > box.clientWidth + 1);

    for (const {
      box,
      more,
      items,
      valueBoxes
    } of overflowing) {
      // Room for the counter first, then values leave from the end until
      // the rest and the counter fit.
      more.hidden = false;
      more.textContent = `+${items.length}`;
      const folded = [];

      for (let at = items.length - 1; at > 0 && box.scrollWidth > box.clientWidth + 1; at -= 1) {
        valueBoxes[at].classList.add('sf-table-cell-folded');
        folded.unshift(items[at]);
        more.textContent = `+${folded.length}`;
      }

      if (!folded.length) {
        more.hidden = true;
        continue;
      }

      more.title = folded.map(item => item.textContent.trim()).filter(Boolean).join(', ');
    }
  } // True when the measuring waits for the cells' elements to draw: every
  // element in the cells is defined and some have not drawn yet. Measured
  // when they have, or at the next frame at the latest.


  measureWhenCellsDrawn() {
    const table = this.refs.table?.value;
    if (!(table instanceof HTMLTableElement) || this._columnResizeState || this.columnDragActive) return false;
    if (table.querySelector('tbody[data-state]') || table.querySelector('tbody[data-busy]')) return false;
    const drawing = [];

    for (const element of table.querySelectorAll('tbody td *')) {
      if (!element.localName.includes('-')) continue;
      if (!customElements.get(element.localName) || typeof element.whenRendered !== 'function') return false; // One held by its style gate draws when its sheets come, perhaps
      // after this frame: measured now, as before.

      if (element.hasAttribute('data-sf-style-pending')) return false;
      if (element.isRendered !== true) drawing.push(element);
    }

    if (!drawing.length) return false;
    const token = this._cellsDrawnToken = (this._cellsDrawnToken ?? 0) + 1;
    const nextFrame = new Promise(settle => requestAnimationFrame(settle));
    Promise.race([Promise.all(drawing.map(element => element.whenRendered())), nextFrame]).catch(() => {}).then(() => {
      if (token !== this._cellsDrawnToken || !this.isConnected) return;
      if (this.measureContentWidths()) this.applyColumnWidths();
      this._contentRetries = 0;
      this.fitCellValues();
      this.measurePinnedColumns();
      if (this.hasAttribute("data-sf-page-scroll")) this.syncRail();
    });
    return true;
  }

  remeasureWhenDrawn(table) {
    const pending = new Set();

    for (const element of table.querySelectorAll('tbody td *')) {
      if (!element.localName.includes('-')) continue;
      if (!customElements.get(element.localName) || !element.childElementCount) pending.add(element.localName);
    }

    if (!pending.size) {
      this._remeasureTries = 0;
      return;
    }

    if ((this._remeasureTries ?? 0) >= 3) return;
    this._remeasureTries = (this._remeasureTries ?? 0) + 1;
    const token = this._remeasureToken = (this._remeasureToken ?? 0) + 1; // Every element in the cells defined (sf-view-table relates them eagerly):
    // the widths are read again the moment they have drawn, in the same
    // task, before the frame is painted -- read two frames later, the
    // columns moved by a few pixels after the rows had been shown (gate 24
    // phase 3, sf-view at 1280).

    const drawing = [...table.querySelectorAll('tbody td *')].filter(element => pending.has(element.localName) && typeof element.whenRendered === 'function');

    if ([...pending].every(name => customElements.get(name)) && drawing.length) {
      Promise.all(drawing.map(element => element.isRendered === true ? null : element.whenRendered())).then(() => {
        if (token !== this._remeasureToken || !this.isConnected) return;
        if (this.measureContentWidths()) this.widthsChanged();
      });
      return;
    }

    Promise.all([...pending].map(name => customElements.whenDefined(name))).then(() => new Promise(settle => requestAnimationFrame(() => requestAnimationFrame(settle)))).then(() => {
      if (token !== this._remeasureToken || !this.isConnected) return;
      if (this.measureContentWidths()) this.widthsChanged();
    });
  } // New widths after a render: written onto the columns, and what reads
  // widths -- folded values, pinned offsets, the rail -- read again.


  widthsChanged() {
    this.applyColumnWidths();
    this.fitCellValues();
    this.measurePinnedColumns();
    if (this.hasAttribute("data-sf-page-scroll")) this.syncRail();
  }

  applyColumnWidths() {
    const table = this.refs.table?.value;
    if (!(table instanceof HTMLTableElement)) return;
    const columns = new Map((this.getColumns?.() ?? []).map(column => [String(column?.key), column])); // Every column's style worked out before any is written: the cap and
    // whether the columns are cramped are read from the laid-out table,
    // and a write between two reads laid it out again for each column
    // (stand 25: 17 columns, the larger part of the rows' first draw).

    const cols = [...table.querySelectorAll(':scope > colgroup > col[data-key]')];
    const styles = this.readingLayout(() => cols.map(col => {
      const column = columns.get(col.dataset.key);
      return column ? (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.columnStyle)(this, column) : null;
    }));
    cols.forEach((col, at) => {
      const style = styles[at];
      if (style === null) return;

      if ((col.getAttribute('style') ?? '') !== style) {
        if (style) col.setAttribute('style', style);else col.removeAttribute('style');
      }
    });
    table.classList.toggle('sf-table-content-sized', this.contentSized);
    table.classList.toggle('w-max', !this.contentSized); // Where the flexible columns gave back room (readFittedWidths), the
    // table's least width is their fitted sum, not the content's.

    const least = this._fittedInlineSize ? Math.min(this._fittedInlineSize, this._contentInlineSize || Infinity) : this._contentInlineSize; // A column given less than its content holds its values on one line
    // with an ellipsis (default.css).

    this.toggleAttribute('data-sf-columns-fitted', Boolean(this._fittedInlineSize));
    if (this.hasContentWidths && least) table.style.setProperty('--sf-table--content-inline-size', `${least}px`);else table.style.removeProperty('--sf-table--content-inline-size');
  } // The host's declared widths are where it would like its columns, not a
  // floor: where their sum does not fit the box (a list beside a docked
  // record panel, VT r6, DEV 2026-11-19: 1100 px of declared columns in a
  // 1024 px box scrolled), each declared column gives back what it holds
  // above its content width (as measured, up to the cap), in proportion,
  // before the box scrolls. Only when the content itself does not fit does
  // the box scroll. A width the person set (colWidth) is not touched, nor
  // one that is not in pixels. Answers the column's width in pixels, or ''.


  fittedWidth(column) {
    if (!column?.key || SYSTEM_COLUMN_KEYS.has(column.key) || column.colWidth != null) return ''; // Read once per layout pass (applyColumnWidths) or per render: the
    // template asks for every column in a row.

    let fit = this._layoutReads?.get('fit') ?? (this._layoutReads ? null : this._fitCache);

    if (!fit) {
      fit = this.readFittedWidths();
      if (this._layoutReads) this._layoutReads.set('fit', fit);else {
        this._fitCache = fit;
        queueMicrotask(() => {
          this._fitCache = null;
        });
      }
    }

    const width = fit.get(column.key);
    return width ? `${width}px` : '';
  } // Then, where the columns at their content widths still do not fit (a
  // list beside the record panel at the normal density, view round 8
  // R67-3: 935 px of content in an 896 px box), the flexible columns -- the
  // data columns the person did not size -- give back what they hold above
  // their least width, in proportion. The least width is the column's
  // heading on one line (its padding and sort button included), never
  // below the column's min_width. Nothing wraps (owner, 2026-10-13: a cell is one
  // line): a value wider than its column ends in an ellipsis
  // (data-sf-columns-fitted). The box scrolls only when the least widths
  // themselves do not fit.
  // Whether a column without a type shows numbers or money on every row
  // drawn («10000,00 ₽» from a host that names no type): such a column is
  // never cut either (VR12A-2).


  showsNumbers(key) {
    const values = [...this.querySelectorAll(`tbody td[data-key="${CSS.escape(String(key))}"]`)].slice(0, 12).map(cell => cell.textContent.trim()).filter(Boolean);
    return values.length > 0 && values.every(value => /^[-+\u2212]?[\d\s\u00a0\u202f.,]+\s?[%\u20bd$\u20ac\u00a3\u00a5]?$/u.test(value) && /\d/u.test(value));
  } // A long text's least width in pixels: --sf-measure-20 (C396, 20
  // characters of the text size; the pair's --sf-f0 where the ladder step
  // is not there yet), read once per layout pass.


  longTextFloor() {
    const cached = this._layoutReads?.get('textFloor');
    if (cached !== undefined && cached !== null) return cached;
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;inline-size:var(--sf-measure-20, var(--sf-f0, 10rem));block-size:0;';
    this.append(probe);
    const width = Math.ceil(probe.getBoundingClientRect().width) || 160;
    probe.remove();
    this._layoutReads?.set('textFloor', width);
    return width;
  }

  readFittedWidths() {
    const fitted = new Map();
    this._fittedInlineSize = null;
    const box = this.refs.scroll?.value?.clientWidth || this._responsiveWidth || 0;
    if (!box || !this.hasContentWidths) return fitted;
    const columns = (this.getColumns?.() ?? []).filter(column => column?.key && column.visible !== false);
    let total = 0;
    let slack = 0;
    const declared = [];
    const flexible = []; // A width is written in whole pixels: a column is never given less
    // than its floor rounded up, or its heading wrapped by a fraction
    // (users, «Последний вход»: 139.875 measured, 139 given).

    for (const cell of this.querySelectorAll('thead th[data-key]')) {
      if (SYSTEM_COLUMN_KEYS.has(cell.dataset.key)) total += cell.getBoundingClientRect().width;
    }

    const cap = this.columnWidthCap();

    for (const column of columns) {
      if (SYSTEM_COLUMN_KEYS.has(column.key)) continue;
      const content = Math.min(this._contentWidths.get(column.key) ?? 0, cap);
      const own = column.colWidth ?? column.width ?? column.size;
      const wants = column.colWidth == null ? this.parseColumnSize(own, null) : null;
      const least = this.parseColumnSize(column.min_width ?? column.minWidth, 0) ?? 0;

      if (wants === null) {
        const width = this.parseColumnSize(own, null) ?? content;
        total += width; // A column the person sized keeps its width; one in other
        // units than pixels is not touched.

        if (column.colWidth == null && own == null && content > 0) flexible.push([column.key, content, least]);
        continue;
      }

      const floor = Math.max(content, least);
      total += wants;
      flexible.push([column.key, Math.min(wants, floor), least]);

      if (wants > floor) {
        declared.push([column.key, wants, wants - floor, Math.ceil(floor)]);
        slack += wants - floor;
      }
    }

    const excess = total - box;
    if (excess <= 0) return fitted;
    const share = slack ? Math.min(1, excess / slack) : 0;
    let gave = 0;

    for (const [key, wants, room, floor] of declared) {
      const next = Math.max(floor, Math.floor(wants - room * share));
      gave += wants - next;
      fitted.set(key, next);
    }

    const left = excess - gave; // Below list-below a table scrolls in its frame with its first column
    // held (the narrow-screen rule of the docs): the flexible columns keep
    // their content widths. Squeezed there, the name went to two lines
    // once the code fitted the columns, after the first paint had drawn
    // it on one (view round 12, D5: typed-cells at 390, 196 -> 204).

    if (left <= 0 || !flexible.length || this.isNarrow) return fitted; // The least widths are read only now, when they are needed: one more
    // layout of the table, the content widths' measuring at min-content.

    const leastWidths = this.leastContentWidths();
    if (!leastWidths) return fitted;
    let room = 0;
    const shrinking = []; // Floors by what a column holds (view round 13, VR12A-2): a number
    // or money is never cut, so it keeps its content width; a long text
    // keeps about 20 characters (--sf-measure-20, C396), not its
    // heading's width -- at 124 px a comment was a column of single words
    // 13 lines tall and still cut the sum beside it. Where the floors do
    // not fit, the table scrolls sideways (below).

    const byKey = new Map(columns.map(column => [column.key, column]));

    const typeOf = key => {
      const column = byKey.get(key);
      return column?.propertyType ?? column?.property_type ?? column?.type;
    };

    const textFloor = this.longTextFloor();

    for (const [key, own, declaredLeast] of flexible) {
      const width = fitted.get(key) ?? own;
      const type = typeOf(key); // A short value (an id, a date, a status, the name of a record)
      // keeps its whole width (list study v2, LV2-1: «Заказ №20…»,
      // «20 нояб. 202…» at 106 and 124 px); only a value longer than
      // about 20 characters gives way, down to them.

      const kept = this.isNumberColumn(byKey.get(key)) || this.showsNumbers(key) ? width : LONG_TEXT_CELL_TYPES.has(type) ? textFloor : Math.min(width, textFloor);
      const least = Math.min(width, Math.max(leastWidths.get(key) ?? width, declaredLeast, kept));

      if (width > least) {
        shrinking.push([key, width, width - least]);
        room += width - least;
      }
    }

    if (!room) return fitted; // Columns that cannot fit even at their least widths keep their
    // natural widths and the table scrolls sideways (view round 13,
    // VHF-16): shrunk to their headings they were cut anyway and the
    // table scrolled all the same (the name 86 px, «ИНН» two digits).
    // They shrink only when that makes them fit.

    if (left > room) return fitted; // The widest give first, down to one common width (view round 12,
    // VHF-4): in proportion, every column gave a share of what it held
    // over its heading, so a short value lost its last letters («Заказ
    // №20…») while a long comment beside it kept hundreds of pixels it
    // cut anyway. Now the columns over a level come down to it, never
    // below their least width; the short ones keep their whole value.
    // A pixel more per column, so the rounding up leaves no sliver to scroll.
    // The record's name gives last (VHF-4, «the title column takes its
    // room»): the other columns come down first, to their least widths;
    // only what they cannot give is taken from the name, which then wraps
    // onto its two lines. The name shrinking first wrapped it at once and
    // grew the row under the reader (typed-cells at 390: 196 -> 204).

    const need = Math.min(room, left + shrinking.length);
    const titleKey = (columns.find(column => column.role === "title" && !column.system) ?? columns.find(column => !column.system && !SYSTEM_COLUMN_KEYS.has(column.key)))?.key;
    const others = shrinking.filter(([key]) => key !== titleKey);
    const title = shrinking.find(([key]) => key === titleKey);
    const othersRoom = others.reduce((sum, [,, spare]) => sum + spare, 0);
    const level = fittingLevel(others, Math.min(need, othersRoom));
    let given = 0;

    for (const [key, width, spare] of others) {
      const next = Math.max(Math.ceil(width - spare), Math.min(Math.floor(width), level));
      given += width - next;
      fitted.set(key, next);
    }

    if (title && given < need) {
      const [key, width, spare] = title;
      const next = Math.max(Math.ceil(width - spare), Math.floor(width - (need - given)));
      given += width - next;
      fitted.set(key, next);
    }

    this._fittedInlineSize = Math.ceil(total - gave - given);
    return fitted;
  } // Each data column's least width: for a moment the table is laid out by
  // its headings alone (the measuring layout, the rows set aside), each on
  // one line; cached with the content widths.


  leastContentWidths() {
    if (this._leastWidths && this._leastWidthsOf === this._contentWidths) return this._leastWidths;
    const table = this.refs.table?.value;
    if (!(table instanceof HTMLTableElement) || !table.isConnected) return null;
    const least = new Map();
    table.classList.add('sf-table-measuring', 'sf-table-measuring-least');

    try {
      if (getComputedStyle(table).tableLayout !== 'auto') return null;

      for (const cell of table.querySelectorAll('thead th[data-key]')) {
        if (!SYSTEM_COLUMN_KEYS.has(cell.dataset.key)) least.set(cell.dataset.key, Math.ceil(cell.getBoundingClientRect().width));
      }
    } finally {
      table.classList.remove('sf-table-measuring', 'sf-table-measuring-least');
    }

    this._leastWidths = least;
    this._leastWidthsOf = this._contentWidths;
    return least;
  }

  contentWidth(column) {
    const width = this._contentWidths?.get(column?.key);
    if (!width) return ''; // The column that takes the spare room has no width of its own: the
    // table's least width (--sf-table--content-inline-size) gives it its
    // content width where there is no spare room, so it holds in a box of
    // any width.

    if (column?.key === this.spareRoomColumnKey()) return '';
    return `${Math.min(width, this.columnWidthCap())}px`;
  } // The column that takes the spare room: the last data column nobody sized.


  spareRoomColumnKey() {
    const columns = this.getColumns?.() ?? [];

    for (let at = columns.length - 1; at >= 0; at -= 1) {
      const column = columns[at];
      if (!column?.key || SYSTEM_COLUMN_KEYS.has(column.key)) continue;
      if (column.colWidth ?? column.width ?? column.size) return null;
      return column.key;
    }

    return null;
  }

  get hasContentWidths() {
    return Boolean(this._contentWidths?.size);
  } // Content-sized from the first render with rows, before the widths are
  // measured: the table is laid out by its content (default.css, the
  // unmeasured content-sized table), as its printed first paint is, until
  // the measured widths come. Drawn as wide as its content with a fixed
  // layout instead, the first render shared the room between every column
  // for a frame and the printed cells moved twice (gate 24, typed-cells).


  get contentSized() {
    return this.hasContentWidths || (this.getTableData?.()?.rows?.length ?? 0) > 0;
  } // Reads that write nothing in between: the cap and the cramped answer are
  // read once for the whole pass instead of once per column.


  readingLayout(read) {
    if (this._layoutReads) return read();
    this._layoutReads = new Map();

    try {
      return read();
    } finally {
      this._layoutReads = null;
    }
  }

  columnWidthCap() {
    if (this._layoutReads?.has('cap')) return this._layoutReads.get('cap');
    const cap = this.readColumnWidthCap();
    this._layoutReads?.set('cap', cap);
    return cap;
  }

  readColumnWidthCap() {
    const raw = getComputedStyle(this).getPropertyValue('--sf-table--column-max-inline-size').trim();
    const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value) || value <= 0) return 320;
    return raw.endsWith('rem') ? value * root : value;
  }

  columnTakesFloor(column) {
    if (!column?.key || SYSTEM_COLUMN_KEYS.has(column.key)) return false;
    return !(column.colWidth ?? column.width ?? column.size ?? column.min_width ?? column.minWidth);
  } // Whether a row's «≡» opens anything: the row actions there are (the
  // gear column stays for the gear under C406; a row of a list without
  // actions draws no «≡» in it, view round 14).


  rowMenuHasUse(props = this.getPropsContext()) {
    if (props.rowReorder === true) return true;
    if (!props.actions || !props.rowActions && this.hasAttribute?.("data-sf-row-menu-off")) return false;
    return (this.ACTIONS_SETTINGS_ROW ?? []).length > 0;
  } // The settings column carries two things: the gear in its head, which
  // opens the column settings (settings-menu), and the ≡ in each row, which
  // opens the row's menu of actions. With neither -- no column settings, no
  // row actions to list, no rows to put in order -- it is an empty column
  // of buttons that open nothing, and it is not drawn (Larena, the sites
  // list, 2026-11-05: a «≡» column beside every row of a list without
  // actions).


  settingsColumnHasUse(props = this.getPropsContext()) {
    if (props.settingsMenu !== false) return true;
    if (props.rowReorder === true) return true; // The row menu uses it only while there is one (view round 13,
    // VR5-10): actions off, or a view whose host offers no row actions
    // (data-sf-row-menu-off) -- the default list of row actions was still
    // there, and the column stayed 57 px wide and empty at the start of
    // every row. row-actions="false" alone keeps it: it also means every
    // action lives in the row menu.

    if (!props.actions || !props.rowActions && this.hasAttribute?.("data-sf-row-menu-off")) return false;
    return (this.ACTIONS_SETTINGS_ROW ?? []).length > 0;
  }

  getSystemColumns() {
    const columns = [];
    const props = this.getPropsContext();

    if (props.selectable) {
      columns.push(this.getSelectColumn());
    } // No «Действия» column (owner decision C146 (5), variant В): every
    // action of a row is in its «≡» menu, which the right button, the
    // menu key and Shift+F10 open too; opening the record is the main
    // field's link. The hover-only column of buttons is gone, so the
    // «≡» column carries the row actions wherever that column stood:
    // settings="false" (a view whose chrome draws no settings) takes the
    // gear from its head and keeps the row menus.


    const rowMenus = Boolean(props.actions && props.rowActions && this.state.actionActive && (this.ACTIONS_SETTINGS_ROW ?? []).length);

    if (props.settings && this.settingsColumnHasUse(props) || rowMenus) {
      columns.push(this.TABLE_SETTINGS_COLUMN);
    }

    return columns;
  }

  setTemplates(data) {
    const nextTemplates = Object.values(data || {}).map((template, index) => this.normalizeFilterTemplate(template, index));
    return this.set(prevState => {
      const currentFilter = prevState.filter || {};
      const templatesByKey = new Map();
      this.getFilterTemplates(currentFilter).forEach(template => {
        templatesByKey.set(template.key, template);
      });
      nextTemplates.forEach(template => {
        templatesByKey.set(template.key, { ...(templatesByKey.get(template.key) || {}),
          ...template
        });
      });
      const templates = Array.from(templatesByKey.values());
      const hasCurrentSelectedTemplateKey = Object.prototype.hasOwnProperty.call(currentFilter, "selectedTemplateKey");
      const defaultTemplate = templates.find(template => template.default === true);
      const incomingSelectedKey = nextTemplates.find(template => template?.selected)?.key;
      const fallbackSelectedKey = defaultTemplate?.key || templates[0]?.key || "";
      const selectedTemplateKey = this._filterTemplatesLoaded ? incomingSelectedKey ?? (hasCurrentSelectedTemplateKey ? currentFilter.selectedTemplateKey : fallbackSelectedKey) : incomingSelectedKey ?? fallbackSelectedKey;
      const nextFilter = { ...currentFilter,
        selectedTemplateKey,
        templates: templates.map(template => ({ ...template,
          selected: template.key === selectedTemplateKey
        }))
      };
      const selectedTemplate = selectedTemplateKey === "" ? null : this.getFilterTemplateByKey(selectedTemplateKey, { ...nextFilter,
        templates
      }) || templates[0] || null;
      this._filterTemplatesLoaded = true;
      return {
        filter: nextFilter,
        saveInputValue: selectedTemplate?.label || ""
      };
    });
  } // The identity of this instance: the author's id when there is one, its own
  // counter otherwise. Never the component name, so a second table on the page
  // cannot inherit the first one's ids or preferences.


  getInstanceId() {
    return this.id || this._instanceId;
  }

  getColumnResizerId(columnKey) {
    return `${this.getInstanceId()}--column-resizer--${columnKey}`;
  }

  getTableSettingsKey() {
    return this.tableSettingsKey || this.getAttribute?.("table-settings-key") || this.id || this.getInstanceId();
  }

  normalizeTableSettings(data = {}, tableSettingsKey = this.getTableSettingsKey()) {
    const settingsMap = data?.tableSettings && typeof data.tableSettings === "object" && !Array.isArray(data.tableSettings) && !data.tableSettings.columnSettings ? data.tableSettings : null;
    const source = data?.item || settingsMap?.[tableSettingsKey] || data?.tableSettings || data?.settings || data || {};
    const columnSettings = source?.columnSettings || data?.columnSettings || {};
    return { ...source,
      columnSettings: columnSettings && typeof columnSettings === "object" && !Array.isArray(columnSettings) ? columnSettings : {}
    };
  }

  setTableSettings(data = {}, reason = "table-settings-load", tableSettingsKey = this.getTableSettingsKey()) {
    const settings = this.normalizeTableSettings(data, tableSettingsKey);
    return this.setColumnSettings(settings.columnSettings, reason, false);
  }

  getContextMenuLabel(data = {}) {
    switch (data.menu || data.type) {
      case 'filter-favorites':
        return this.text('contextSaveTemplateLabel');

      case 'filter-settings':
        return this.text('contextFilterSettingsLabel');

      case 'filter-template-actions':
        return `${this.text('contextTemplateActionsLabel')}: ${data.template?.label || data.template?.key || ''}`.trim();

      case 'tag-settings':
        {
          const fieldKey = data.fieldKey || '';
          const field = this.getFilterField(fieldKey);
          const label = field?.label || this.getCurrentFilterTags()?.[fieldKey]?.label || fieldKey;
          return `${this.text('contextFieldFilterLabel')}: ${label || this.text('fieldWordText')}`;
        }

      case 'row-settings':
        return this.text('contextRowActionsLabel');

      case 'create':
        return this.text('contextCreateOptionsLabel');

      case 'list-sort':
        return this.text('sortLabel');

      case 'toolbar-actions':
        return this.text('contextViewActionsLabel');

      case 'table-settings':
      default:
        return this.text('contextTableSettingsLabel');
    }
  }

  renderFilterFavoritesContextMenu(data) {
    const {
      x,
      y,
      position
    } = data;
    const template = this.getSelectedFilterTemplate();
    return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
            <sf-menu-context
                    size=${this.menuSize}
                    :key=${x + y + this._renderToken}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'filter-favorites'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            z-index: var(--sf-table-context-menu--z-index, ${this.contextMenuZIndex()});
          "
                    root-class="sf-table-context-menu ${this.contextWindowClass('filter-favorites')} ${this.size === "1/2" ? "sf-table-context-menu--dense " : ""}flex flex-col"
                    data-context-main-menu
                    position="${position || ""}"
            >
                <div class="flex flex-col flex-1 gap-2" slot="content">
                    <div class="sf-table-context-top"><span class="sf-text-2 bold">${this.text('saveTemplateLabel')}</span></div>
                    <div class="sf-table-context-main">
                        <form ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_11__.ref)(this.refs.templateForm)} id="save_template" class="flex flex-col gap-1/2">
                            <sf-input
                                    size=${this.size}
                                    appearance="filled"
                                    placeholder="${this.text('templateNamePlaceholder')}"
                                    value="${this.state.saveInputValue}"
                                    name="template_name"
                                    @change=${e => {
      this.set({
        saveInputValue: e.target.value
      });
    }}
                                    @input=${e => {
      this.set({
        saveInputValue: e.target.value
      });
    }}
                            ></sf-input>
                            <div class="flex flex-col gap-1/2">
                                <sf-checkbox size=${this.size}
                                        name="template_default"
                                        position="end"
                                        root-class="content-main-between"
                                        value="1"
                                        ?checked=${template.data.template_default}
                                        label="${this.text('makeDefaultLabel')}"
                                ></sf-checkbox>
                                <sf-checkbox size=${this.size}
                                        name="template_save_for_all"
                                        position="end"
                                        root-class="content-main-between"
                                        value="1"
                                        ?checked=${template.data.template_save_for_all}
                                        label="${this.text('saveForEveryoneLabel')}"
                                ></sf-checkbox>
                        </form>
                    </div>
                </div>
                <div class="sf-table-context-bottom sf-context-menu-footer">
                    <sf-button size=${this.size}
                            ?disabled=${this.state.saveInputValue.length === 0}
                            @click="${() => {
      this.saveFilterTemplate();
    }}" root-class="flex-1" text="${this.text('applyText')}"></sf-button>
                    <sf-button size=${this.size} @click="${() => {
      this.tempSettings = null;
      this.requestComponentUpdate('table');
    }}" appearance="outline" scheme="on-surface" root-class="flex-1"
                               text="${this.text('resetText')}"></sf-button>
                </div>
                </div>
            </sf-menu-context>
        `;
  }

  saveFilterTemplate() {
    const form = this.refs.templateForm.value;
    if (!form) return false;
    const formData = Object.fromEntries(new FormData(form));
    const {
      templates
    } = this.state.filter;
    const prevTemplate = templates.filter(template => {
      return template.label === formData.template_name;
    })?.[0];
    const values = this.getCurrentFilterValues();
    const tags = this.getCurrentFilterTags();
    let template = {
      key: prevTemplate ? prevTemplate.key : `filter_template_${templates.length + 1}`,
      label: formData.template_name,
      selected: true,
      data: { ...formData,
        values,
        tags
      }
    };
    this.emitTableEvent('template-save', {
      templates: [this.withFilterFieldSettings(template)]
    });
    this.tempSettings = null;
    this.closeContextMenu();
  }

  getColumnItems() {
    const dataColumns = this.getTableData().columns || [];
    const originalIndexByKey = new Map(dataColumns.map((column, index) => [column?.key, index]));

    const getOrder = column => {
      const order = column?.order;
      return order !== null && typeof order !== "undefined" && order !== "" && Number.isFinite(Number(order)) ? Number(order) : originalIndexByKey.get(column?.key) ?? 0;
    };

    return dataColumns.map(column => {
      const settings = this.getColumnSetting(column?.key);
      const nextColumn = { ...column,
        ...settings
      };

      if (settings.width) {
        nextColumn.colWidth = settings.width;
      }

      return nextColumn;
    }).sort((left, right) => {
      // The list reads like the table: the pinned group first, then
      // the rest of the visible columns, then the hidden ones. Sorting
      // by order alone put the hidden columns wherever their stored
      // order happened to fall — a consumer opened the settings and
      // found eight columns it had never shown standing above its own,
      // with the pinned one in the middle.
      const group = column => {
        if (this.isColumnPinned(column)) return 0;
        return this.isColumnVisible(column) ? 1 : 2;
      };

      const leftGroup = group(left);
      const rightGroup = group(right);

      if (leftGroup !== rightGroup) {
        return leftGroup - rightGroup;
      }

      const leftOrder = getOrder(left);
      const rightOrder = getOrder(right);

      if (leftOrder === rightOrder) {
        return (originalIndexByKey.get(left.key) ?? 0) - (originalIndexByKey.get(right.key) ?? 0);
      }

      return leftOrder - rightOrder;
    });
  } // Whether a column is shown. The answer the person is editing right now
  // wins, then what the host has stored, then what the column itself says.


  isColumnVisible(column) {
    if (!column?.key) return false;
    const pending = this.tempSettings?.cols?.[column.key];
    const setting = this.getColumnSetting(column.key) || {};
    return pending?.visible ?? setting.visible ?? column.visible !== false;
  } // The person's and the host's column settings, merged. It is asked for
  // hundreds of times in one draw -- every column, every pinned cell -- so
  // the merge is made once per change of either source and read from the
  // memo while drawing (simai/ui-pro#1). Both sources are replaced, never
  // edited in place, so their identity says when they changed.


  getColumnSettings() {
    const dataSettings = this.getTableData().columnSettings;
    const stateSettings = this.state?.columnSettings;
    const memo = this._columnSettingsMemo;
    if (memo && memo.data === dataSettings && memo.state === stateSettings) return memo.value;
    const value = this.mergedColumnSettings(dataSettings, stateSettings);
    this._columnSettingsMemo = {
      data: dataSettings,
      state: stateSettings,
      value
    };
    return value;
  }

  mergedColumnSettings(dataSettings, stateSettings) {
    const normalizedDataSettings = dataSettings && typeof dataSettings === "object" && !Array.isArray(dataSettings) ? dataSettings : {};
    const normalizedStateSettings = stateSettings && typeof stateSettings === "object" && !Array.isArray(stateSettings) ? stateSettings : {};
    return { ...normalizedDataSettings,
      ...normalizedStateSettings
    };
  }

  getColumnSetting(columnKey) {
    if (!columnKey) return {}; // During a draw, the settings read once for it (drawingWith).

    const settings = (this._drawColumnSettings ?? this.getColumnSettings())?.[columnKey];
    return settings && typeof settings === "object" && !Array.isArray(settings) ? settings : {};
  }

  normalizeColumnSetting(settings = {}) {
    const nextSettings = {};
    Object.entries(settings || {}).forEach(([key, value]) => {
      if (typeof value === "undefined") {
        return;
      }

      if (key === "colWidth") {
        nextSettings.width = value;
        return;
      }

      nextSettings[key] = value;
    });

    if (typeof nextSettings.order !== "undefined" && nextSettings.order !== null && nextSettings.order !== "") {
      nextSettings.order = Number(nextSettings.order);
    }

    return nextSettings;
  }

  mergeColumnSettings(currentSettings = {}, patch = {}) {
    const nextSettings = { ...(currentSettings || {})
    };
    Object.entries(patch || {}).forEach(([columnKey, columnPatch]) => {
      if (!columnKey || !columnPatch || typeof columnPatch !== "object") {
        return;
      }

      nextSettings[columnKey] = this.normalizeColumnSetting({ ...(nextSettings[columnKey] || {}),
        ...columnPatch
      });
    });
    return nextSettings;
  } // The person asked for the default columns back. The component names no
  // defaults of its own — it says the layer should go, and the host answers
  // with whatever it considers default for this view.


  requestColumnSettingsReset() {
    // The person's arrangement goes from the preference too.
    if (this.viewPreferenceKey) {
      const {
        columnSettings,
        widths,
        ...rest
      } = preferences()?.read(this.viewPreferenceKey) ?? {};
      preferences()?.write(this.viewPreferenceKey, rest);
    }

    return this.emitTableEvent("column-settings-reset", Object.freeze({
      target: "personal",
      tableSettingsKey: this.getTableSettingsKey?.() ?? null
    }));
  }

  emitColumnSettingsChange(reason = "column-settings") {
    if (reason !== "preferences" && this.viewPreferenceKey) {
      this.writeTablePreference(this.viewPreferenceKey, {
        columnSettings: this.getColumnSettings()
      });
    }

    const detail = {
      reason,
      columnSettings: this.getColumnSettings(),
      tableSettingsKey: this.getTableSettingsKey()
    }; // Vocabulary §5 save {kind: columns}; sf-table-column-settings-change,
    // sf-table:column-settings-change and onColumnSettingsChange follow
    // once each with the same fields (detail-adds rows).

    this.emitTableEvent('save', {
      kind: "columns",
      ...detail
    });
    return this;
  }

  setColumnSettings(settings = {}, reason = "column-settings", emit = true) {
    const nextSettings = typeof settings === "function" ? settings(this.getColumnSettings()) : settings;
    return this.set({
      columnSettings: nextSettings && typeof nextSettings === "object" ? nextSettings : {}
    }, reason, () => emit ? this.emitColumnSettingsChange(reason) : false);
  }

  patchColumnSettings(columnKey, patch = {}, reason = "column-settings") {
    if (!columnKey) return this;
    const currentSetting = this.getColumnSetting(columnKey);
    const nextPatch = typeof patch === "function" ? patch(currentSetting) : patch;
    return this.patchColumnSettingsBatch({
      [columnKey]: nextPatch || {}
    }, reason);
  }

  patchColumnSettingsBatch(patch = {}, reason = "column-settings") {
    const currentSettings = this.getColumnSettings();
    const nextSettings = this.mergeColumnSettings(currentSettings, patch);

    if (JSON.stringify(currentSettings) === JSON.stringify(nextSettings)) {
      return this;
    }

    return this.setColumnSettings(nextSettings, reason);
  }

  getFilterFields() {
    const fields = this.state?.filter?.fields;
    return Array.isArray(fields) ? fields : [];
  } // Whether the toolbar offers a filter at all: when the host gave fields to
  // filter by or saved templates to choose from, or a filter is already on.
  // Without them the button opened a panel of templates and fields with no
  // value to set, which read as broken (documentation trial 6; owner and
  // Larena, 2026-10-18).


  offersFilter(activeCount = 0) {
    const templates = this.state?.filter?.templates;
    return this.getFilterFields().length > 0 || Array.isArray(templates) && templates.length > 0 || activeCount > 0;
  }

  getFilterField(fieldKey) {
    if (!fieldKey) return null;
    return this.getFilterFields().find(field => field?.key === fieldKey) || null;
  }

  setFilterFields(fields = [], reason = "filter-fields") {
    for (const page of this._filterOptionPages.values()) {
      page.controller?.abort();
      clearTimeout(page.searchTimer);
    }

    this._filterOptionPages.clear();

    return this.set(prevState => ({
      filter: { ...(prevState.filter || {}),
        fields: Array.isArray(fields) ? fields : []
      }
    }), reason);
  }

  patchTempColumnSettings(columnKey, patch = {}) {
    if (!columnKey) return;
    this.tempSettings = { ...(this.tempSettings || {}),
      cols: { ...(this.tempSettings?.cols || {}),
        [columnKey]: { ...(this.tempSettings?.cols?.[columnKey] || {}),
          ...(typeof patch === "function" ? patch() : patch)
        }
      }
    };
  }

  patchTempFilterTagSettings(columnKey, patch = {}) {
    if (!columnKey) return;
    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        tags: { ...(this.tempSettings?.filter?.tags || {}),
          [columnKey]: { ...(this.tempSettings?.filter?.tags?.[columnKey] || {}),
            ...(typeof patch === "function" ? patch() : patch)
          }
        }
      }
    }; // The same defect the pins had: a patch is a plain property, so nothing
    // redrew and anything reading the draft kept the state it was drawn
    // with -- here the button that says how many conditions are pending.
    // Switching a condition on is a checkbox, so a redraw costs nothing a
    // person can feel.

    this.requestComponentUpdate('filter-tag');
  }

  patchTempFilterValue(fieldKey, patch = {}) {
    if (!fieldKey) return;
    const currentValues = this.getCurrentFilterValues(this.getPendingFilterState());
    const currentValue = this.tempSettings?.filter?.values?.[fieldKey] || currentValues[fieldKey] || {};
    const nextPatch = typeof patch === "function" ? patch(currentValue) : patch;
    const nextValue = { ...currentValue,
      ...(nextPatch || {})
    };

    const isSameValue = (current, next) => {
      if (!Array.isArray(current) || !Array.isArray(next)) {
        return Object.is(current, next);
      }

      if (current.length !== next.length) {
        return false;
      }

      return current.every((item, index) => Object.is(item, next[index]));
    };

    const changed = Object.keys(nextValue).some(key => !isSameValue(currentValue[key], nextValue[key]));

    if (!changed) {
      return;
    }

    this.tempSettings = { ...(this.tempSettings || {}),
      filter: { ...(this.tempSettings?.filter || {}),
        values: { ...(this.tempSettings?.filter?.values || {}),
          [fieldKey]: nextValue
        }
      }
    };
    this.requestComponentUpdate('temp-filter-value');
  }

  isEmptyFilterValue(value) {
    if (value === null || typeof value === "undefined") {
      return true;
    }

    if (Array.isArray(value)) {
      return value.every(item => this.isEmptyFilterValue(item));
    }

    if (typeof value === "string") {
      return value.trim() === "";
    }

    if (value && typeof value === "object") {
      return Object.values(value).every(item => this.isEmptyFilterValue(item));
    }

    return false;
  } // C293 (DF-1, DF-4, DF-6): the date filter's own reading -- a period,
  // empty and not empty are whole entries; the chip says the condition; the
  // request carries the zone and week start -- comes with the pair that has
  // SF.fieldRenderers.dateFilter. Without it the table reads as before.


  dateFilterApi() {
    const api = globalThis.SF?.fieldRenderers?.dateFilter;
    return api && typeof api.isEmptyFilterEntry === "function" ? api : null;
  }

  filterChipText(key, tag = {}) {
    const api = this.dateFilterApi();
    const label = tag?.label ?? key;
    if (!api || typeof api.dateFilterChipText !== "function") return label;
    const field = (this.getFilterFields?.() || []).find(item => item?.key === key);
    const type = field?.propertyType ?? field?.type ?? field?.dataType ?? tag?.control;
    if (!["date", "datetime", "period"].includes(type)) return label;
    const entry = this.getCurrentFilterValues?.()?.[key];
    if (!entry || this.isEmptyFilterEntry(entry)) return label;

    try {
      return api.dateFilterChipText({ ...field,
        label
      }, entry, this) || label;
    } catch {
      return label;
    }
  }

  isEmptyFilterEntry(entry) {
    const api = this.dateFilterApi();
    if (api) return api.isEmptyFilterEntry(entry);

    if (!entry || typeof entry !== "object") {
      return this.isEmptyFilterValue(entry);
    }

    if (Object.prototype.hasOwnProperty.call(entry, "values")) {
      return this.isEmptyFilterValue(entry.values);
    }

    if (Object.prototype.hasOwnProperty.call(entry, "value")) {
      return this.isEmptyFilterValue(entry.value);
    }

    return Object.entries(entry).filter(([key]) => !["operator", "control", "type"].includes(key)).every(([, value]) => this.isEmptyFilterValue(value));
  }

  mergeFilterState(prevFilter = {}, tempFilter = {}) {
    const {
      filter,
      tags,
      values
    } = this.getMergedFilterDraftData(prevFilter, tempFilter);
    return this.patchFilterTemplateData(filter, {
      tags,
      values
    });
  } // «Сбросить» in the column settings: the state the window opened with,
  // applied at once and announced once -- not the host's defaults, which is
  // what the filter window's own Reset asks for.


  restoreColumnSettingsOnOpen(reason = 'column-settings-restore') {
    const columnSettings = JSON.parse(JSON.stringify(this._columnSettingsOnOpen || {}));
    this.tempSettings = null;
    this.set(prevState => ({ ...prevState,
      columnSettings
    }), reason, () => this.emitColumnSettingsChange(reason));
    return this;
  } // What «Применить» did, as a method, so a control that applies on the spot
  // does exactly the same thing rather than its own version of it.


  commitColumnSettings(reason = 'table-settings') {
    const tempSettings = this.tempSettings || {};
    const {
      cols: tempColumns,
      ...rest
    } = tempSettings;
    if (!tempColumns) return this;
    const columnSettings = this.mergeColumnSettings(this.getColumnSettings(), tempColumns);
    this.tempSettings = Object.keys(rest).length ? rest : null;
    this.set(prevState => ({ ...prevState,
      columnSettings
    }), reason, () => this.emitColumnSettingsChange(reason));
    return this;
  } // Pinning a column puts it at the end of the pinned block, unpinning it at
  // the start of the loose ones — the place a person expects what they just
  // moved to be, rather than wherever its old order number happens to land it.


  toggleColumnPinned(col) {
    if (!col?.key || col.system) return this;
    const next = !this.isColumnPinned(col);
    const columns = this.getColumnItems().filter(column => column?.key && !column.system);
    const orders = columns.map((column, index) => {
      const pending = this.tempSettings?.cols?.[column.key];
      const setting = this.getColumnSetting(column.key) || {};
      const value = Number(pending?.order ?? setting.order ?? column.order);
      return Number.isFinite(value) ? value : (index + 1) * 10;
    });
    const group = columns.map((column, index) => ({
      column,
      order: orders[index]
    })).filter(entry => entry.column.key !== col.key && this.isColumnPinned(entry.column) === next);
    const order = next ? Math.max(0, ...group.map(entry => entry.order)) + 10 // Never below 0: the host refuses a negative order, and a loose
    // column already at 0 made an unpin send -10 and fail.
    : Math.max(0, Math.min(...group.map(entry => entry.order), 10) - 10);
    this.patchTempColumnSettings(col.key, {
      pinned: next,
      order
    }); // The patch is a plain property, so nothing re-rendered and the pin kept
    // the state it was drawn with: every pin read aria-pressed="false", a
    // press looked like it had done nothing, and the only visible effect was
    // the row moving into the pinned group on some later render.

    this.requestComponentUpdate('column-pin'); // A pin applies on the spot and reaches the host, by the consumer
    // owner's decision of 2026-10-05. Before it, a press wrote a draft that
    // a click outside the window threw away without saying so, and with the
    // window's own buttons below the fold that read as "pins do not work".

    this.commitColumnSettings('column-pin');
    return this;
  } // Two sortable lists, one under the other: the pinned rows, then the
  // loose ones. Each is a group of its own, so a row stays in its group.


  renderSortableGroups(pinnedRows, looseRows, {
    name,
    label,
    onIntent
  }) {
    const list = (group, rows) => rows.length ? (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`<sf-sortable
                group=${`${name}-${group}`}
                data-group=${group}
                label=${label}
                class="flex flex-col gap-1/3"
                @sf-sortable-intent=${onIntent}>${rows}</sf-sortable>` : lit__WEBPACK_IMPORTED_MODULE_10__.nothing;

    return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`${list('pinned', pinnedRows)}${list('loose', looseRows)}`;
  }

  getFilterTagColsData() {
    const fields = this.getFilterFields().filter(field => field?.filter?.enabled !== false);
    const items = fields.length ? fields : this.getColumnItems();
    return items.map(field => {
      const pending = this.tempSettings?.filter?.tags?.[field.key];
      const current = this.getCurrentFilterTags(this.getPendingFilterState())?.[field.key];
      const data = {
        type: "checkbox",
        props: {
          size: this.size,
          label: field.label,
          position: 'end',
          rootClass: 'content-main-between',
          checked: pending?.active ?? current?.active ?? false,
          ':ref': this.getItemRef(`filter-tag-column:${field.key}`) || false,
          '@change': event => {
            this.patchTempFilterTagSettings(field.key, {
              active: Boolean(event.target?.checked),
              label: field.label,
              control: field.filter?.control || field.type || field.dataType || 'text'
            });
          }
        }
      };
      return this.renderSmartElement(data.type, data.props);
    });
  }

  getFilterControlValue(fieldKey) {
    return { ...(this.getCurrentFilterValues()?.[fieldKey] || {}),
      ...(this.tempSettings?.filter?.values?.[fieldKey] || {})
    };
  }

  getFilterOptions(field = {}) {
    const filter = field.filter || {};
    const source = filter.optionsSource || {};

    if (source.type === 'endpoint') {
      const page = this.getEndpointFilterPage(field);
      const selected = new Set(this.getFilterControlValue(field.key).values || []);
      const options = new Map();

      for (const option of [...(page?.selected || []), ...(page?.items || [])]) {
        if (typeof option?.value === 'string' && typeof option?.label === 'string') {
          if (selected.has(option.value) || (page?.items || []).includes(option)) {
            options.set(option.value, option);
          }
        }
      }

      return [...options.values()];
    }

    if (Array.isArray(filter.options)) {
      return filter.options;
    }

    if (Array.isArray(source.items)) {
      return source.items;
    }

    return [];
  }

  getEndpointFilterPage(field = {}) {
    const source = field.filter?.optionsSource;

    if (source?.type !== 'endpoint' || typeof source.url !== 'string' || !source.url.trim() || !field.key) {
      return null;
    }

    let page = this._filterOptionPages.get(field.key);

    if (!page || page.url !== source.url) {
      page?.controller?.abort();
      page = {
        url: source.url,
        items: [],
        selected: [],
        nextCursor: null,
        status: 'idle',
        sequence: 0,
        searchable: false
      };

      this._filterOptionPages.set(field.key, page);

      queueMicrotask(() => {
        if (this.isConnected && this._filterOptionPages.get(field.key) === page) {
          this.loadEndpointFilterPage(field);
        }
      });
    }

    return page;
  }

  async loadEndpointFilterPage(field = {}, cursor = null, search = '') {
    const page = this.getEndpointFilterPage(field);
    if (!page || !this.isConnected) return false;
    let url;

    try {
      url = new URL(page.url, globalThis.location?.href);
      if (url.origin !== globalThis.location?.origin) throw new TypeError('filter_options_cross_origin');
    } catch {
      page.status = 'error';
      this.requestComponentUpdate('filter-options');
      return false;
    }

    page.controller?.abort();
    const controller = new AbortController();
    const sequence = ++page.sequence;
    page.controller = controller;
    page.status = 'loading';
    url.searchParams.set('limit', '50');
    url.searchParams.set('sequence', String(sequence));
    if (cursor) url.searchParams.set('cursor', cursor);else url.searchParams.delete('cursor');
    if (search && page.searchable) url.searchParams.set('search', search);else url.searchParams.delete('search');
    url.searchParams.delete('selected_values[]');

    for (const value of this.getFilterControlValue(field.key).values || []) {
      if (typeof value === 'string') url.searchParams.append('selected_values[]', value);
    }

    this.requestComponentUpdate('filter-options');

    try {
      const response = await fetch(url, {
        credentials: 'same-origin',
        signal: controller.signal,
        headers: {
          Accept: 'application/json'
        }
      });
      const answer = await response.json();
      if (page.sequence !== sequence || this._filterOptionPages.get(field.key) !== page || !this.isConnected) return false;

      if (!response.ok || answer?.status !== 'ok' || answer.sequence !== sequence || !Array.isArray(answer.items) || !Array.isArray(answer.selected) || answer.next_cursor !== null && typeof answer.next_cursor !== 'string') {
        throw new TypeError('filter_options_answer_invalid');
      }

      const clean = items => items.filter(item => typeof item?.value === 'string' && item.value && typeof item?.label === 'string' && item.label).map(({
        value,
        label
      }) => ({
        value,
        label
      }));

      const merged = new Map((cursor ? page.items : []).map(item => [item.value, item]));

      for (const item of clean(answer.items)) merged.set(item.value, item);

      page.items = [...merged.values()];
      page.selected = clean(answer.selected);
      page.nextCursor = answer.next_cursor;
      page.searchable = answer.searchable === true;
      page.status = 'ready';
      this.requestComponentUpdate('filter-options');
      return true;
    } catch (error) {
      if (page.sequence !== sequence || error?.name === 'AbortError') return false;
      page.status = 'error';
      this.requestComponentUpdate('filter-options');
      return false;
    }
  }

  getFilterOptionSearch(fieldKey) {
    if (!fieldKey) return '';
    return this.tempSettings?.filterSearch?.[fieldKey] || '';
  }

  patchTempFilterOptionSearch(fieldKey, value = '') {
    if (!fieldKey) return;
    this.tempSettings = { ...(this.tempSettings || {}),
      filterSearch: { ...(this.tempSettings?.filterSearch || {}),
        [fieldKey]: String(value || '')
      }
    };
    this.requestComponentUpdate('filter-option-search');
    const field = this.getFilterField(fieldKey);
    const page = field && this.getEndpointFilterPage(field);

    if (page?.searchable) {
      clearTimeout(page.searchTimer);
      page.searchTimer = setTimeout(() => this.loadEndpointFilterPage(field, null, String(value || '').trim()), 200);
    }
  }

  filterUpdate() {
    return this.getFilterPayload();
  }

  getFilterOptionSearchKeys(field = {}) {
    const keys = field.filter?.searchKeys || field.filter?.optionSearchKeys;

    if (Array.isArray(keys) && keys.length) {
      return keys;
    }

    return ['label', 'title', 'name', 'text', 'value', 'id'];
  }

  getObjectPathValue(source = {}, path = '') {
    return String(path || '').split('.').filter(Boolean).reduce((value, key) => {
      if (value === null || typeof value === 'undefined') {
        return '';
      }

      return value[key];
    }, source);
  }

  normalizeFilterSearchValue(value = '') {
    return String(value || '').trim().toLowerCase();
  }

  optionMatchesSearch(option = {}, search = '', keys = []) {
    const query = this.normalizeFilterSearchValue(search);
    if (!query) return true;
    return keys.some(key => {
      const value = this.getObjectPathValue(option, key);
      return this.normalizeFilterSearchValue(value).includes(query);
    });
  }

  getVisibleFilterOptions(field = {}) {
    const options = this.getFilterOptions(field);
    const search = this.getFilterOptionSearch(field.key);

    if (!search) {
      return options;
    }

    const keys = this.getFilterOptionSearchKeys(field);
    return options.filter(option => this.optionMatchesSearch(option, search, keys));
  } // A cell for a column that names a property type: the Framework's renderer
  // for that type, or nothing, in which case the value renders as itself. A
  // host that passes its own component never reaches here -- the escape hatch
  // is that the host's choice is consulted first, by the template.
  // The set answers with a cell value in the shape a host would pass -- a
  // string, an object with a component, or a list of those -- so the template
  // renders it through the path it already had. The set adds no second way to
  // draw a cell.
  // A boolean cell the host lets this person write: the table is told it
  // may (inline-edit) and the record names the field in `editable`.


  cellEditable(row = {}, column = {}) {
    if (this.getAttribute("inline-edit") !== "true") return false;
    if ((column.propertyType ?? column.property_type ?? column.type) !== "boolean") return false;
    return Array.isArray(row.editable) && row.editable.map(String).includes(String(column.key));
  }

  cellPending(row = {}, column = {}) {
    return this._pendingCells?.has(`${this.getRowKey(row)}\u0000${column.key}`) === true;
  } // A checkbox pressed: the cell waits for the host, which answers with the
  // record as it now is, or not, and then the row is drawn from what it says.


  setCellValue(row = {}, column = {}, value) {
    const id = this.getRowKey(row);
    this._pendingCells ??= new Set();

    this._pendingCells.add(`${id}\u0000${column.key}`);

    this.requestComponentUpdate("cell-pending");
    this.emitTableEvent("cell-set", Object.freeze({
      id: row.id ?? id,
      key: column.key,
      value,
      revision: row._revision ?? row.revision ?? null
    }));
  } // C296: a short field -- a choice, a person, yes/no, a date, a number --
  // the host lets this person write is edited at the cell, in a small menu
  // or popover, when the author turns inline-edit on. Longer fields are the
  // record card's. A boolean keeps its checkbox in the cell.


  cellShortEditable(row = {}, column = {}) {
    if (this.getAttribute("inline-edit") !== "true" || column.system) return false;
    const type = column.propertyType ?? column.property_type ?? column.type;
    if (!SHORT_EDIT_TYPES.has(type)) return false;
    if ((type === "user" || type === "choice" || type === "enum" || type === "select") && !Array.isArray(column.options)) return false;
    return Array.isArray(row.editable) && row.editable.map(String).includes(String(column.key));
  } // Opens the editor of one cell: a menu of the choices (checked at the
  // value), or a popover with the Framework's own edit field and Save and
  // Cancel. What is chosen goes to the host as cell-set, like the checkbox.


  async openCellEditor(row, column, cell) {
    if (!row || !column || !(cell instanceof Element) || !this.cellShortEditable(row, column)) return null;
    if (this.cellPending(row, column)) return null;
    const type = column.propertyType ?? column.property_type ?? column.type;
    const value = row[column.key];
    const label = column.label ?? column.key;

    if (type === "boolean" || Array.isArray(column.options)) {
      const options = type === "boolean" ? [{
        value: true,
        label: this.text("cellEditYes")
      }, {
        value: false,
        label: this.text("cellEditNo")
      }] : column.options;
      const current = value && typeof value === "object" && !Array.isArray(value) ? value.value ?? value.id : value;
      const entries = options.map((option, index) => ({
        id: String(index),
        text: String(option?.label ?? option?.text ?? option?.value ?? ""),
        checked: String(option?.value) === String(current)
      }));
      const choice = await (0,_view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_19__.menuOpen)({
        anchor: cell,
        entries,
        label: `${this.text("cellEditLabel")}: ${label}`,
        size: this.menuSize
      });
      if (choice?.id === undefined || choice?.id === null) return null;
      const picked = options[Number(choice.id)];
      if (!picked || String(picked.value) === String(current)) return null;
      this.setCellValue(row, column, picked.value);
      return {
        outcome: "applied"
      };
    }

    return this.openCellPopover(row, column, cell, value, label);
  }

  openCellPopover(row, column, cell, value, label) {
    this.closeCellPopover();
    const box = document.createElement("div");
    box.className = "sf-table-cell-editor";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", `${this.text("cellEditLabel")}: ${label}`);
    let draft = value;
    const host = {
      setFieldValue: (_field, next) => {
        draft = next;
      },
      text: key => this.text(key)
    };
    const field = { ...column,
      key: column.key,
      label,
      propertyType: column.propertyType ?? column.property_type ?? column.type
    };
    const size = this.getPropsContext().size === "1/2" ? "1/2" : "1";

    const finish = apply => {
      const was = String(value ?? "");
      this.closeCellPopover();
      if (apply && String(draft ?? "") !== was) this.setCellValue(row, column, draft);
      cell.closest("tr")?.focus?.({
        preventScroll: true
      });
    };

    (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)((0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`<form class="sf-table-cell-editor-form" @submit=${event => {
      event.preventDefault();
      finish(true);
    }}
                @keydown=${event => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        finish(false);
      }
    }}>
            ${(0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_8__.renderEditField)(field, value, host, {
      size
    })}
            <div class="sf-table-cell-editor-actions">
                <sf-button size=${size} scheme="primary" text=${this.text("cellEditApply")}
                    @click=${() => finish(true)}></sf-button>
                <sf-button size=${size} appearance="outline" scheme="on-surface" text=${this.text("cellEditCancel")}
                    @click=${() => finish(false)}></sf-button>
            </div>
        </form>`, box);
    document.body.append(box);
    this._cellPopover = box; // Placed by the Framework's one anchoring helper (SF.Position): under
    // the cell, at least as wide, flipped or shifted to stay in view, in
    // the top layer. A press outside closes it without saving.

    this._cellPlace = positioning().anchor(cell, box, {
      side: "block-end",
      align: "start",
      matchWidth: "min"
    }); // One layer of the page's stack: Escape and a press outside close it
    // without saving (a picker the field opens is a layer above it).

    (0,_core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_17__.openLayer)(box, {
      kind: "surface",
      root: () => box,
      onEscape: () => {
        finish(false);
        return true;
      },
      onOutsidePress: () => this.closeCellPopover(box)
    });
    requestAnimationFrame(() => box.querySelector("input, select, textarea, button, [tabindex]")?.focus?.());
    return {
      outcome: "opened"
    };
  }

  closeCellPopover(only = null) {
    const box = this._cellPopover;
    if (!box || only && only !== box) return;
    this._cellPopover = null;
    this._cellPlace?.stop?.();
    this._cellPlace = null;
    (0,_core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_17__.closeLayer)(box, {
      restoreFocus: false
    });
    (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)(lit__WEBPACK_IMPORTED_MODULE_10__.nothing, box);
    box.remove();
  } // Double click or F2 on a short editable cell opens its editor.


  cellEditTarget(event) {
    const cell = event.target instanceof Element ? event.target.closest("tbody td[data-key]") : null;
    if (!cell || !this.contains(cell)) return null;
    const row = this.rowOfElement(cell);
    const column = (this.getTableData().columns || []).find(one => String(one.key) === cell.dataset.key);
    return row && column && this.cellShortEditable(row, column) ? {
      row,
      column,
      cell
    } : null;
  }

  clearCellPending(id, key) {
    if (this._pendingCells?.delete(`${id}\u0000${key}`)) this.requestComponentUpdate("cell-pending");
  } // The box shows what the host holds again. A render cannot do it: the
  // value it would draw is the one it drew before the click, so nothing
  // changes for it, while the box itself was toggled by the click.


  resetCellControl(id, key, value) {
    const escape = text => String(text).replace(/"/gu, '\\"');

    const box = this.querySelector(`tbody tr[data-row-id="${escape(id)}"] [data-cell-edit="${escape(key)}"]`);
    if (!box) return;
    const checked = value === true;
    box.checked = checked;
    box.toggleAttribute("checked", checked);
    const input = box.querySelector("input");
    if (input) input.checked = checked;
  }

  getTypedCellValue(column = {}, value) {
    // The host is passed so `formatFieldValue` is reachable from a cell. It
    // was reachable from the record panel and not from the list -- the
    // panel hands the renderer set its port, the table handed it nothing --
    // so the same date read «25 сентября 2026» in a card and
    // «2026-09-25T07:12:00+03:00» in a row, and a consumer had no way to
    // change the second. The set still refuses to guess a format; this only
    // lets the host say one (admin polygon, 2026-10-10).
    const host = this.cellHost ?? null;
    const type = column.propertyType ?? column.property_type ?? column.type; // Several files are one value each, as several choices are tags: the
    // renderer set reads a file and not a list of them, so a column of
    // documents drew nothing at all (the Fields page, 2026-11-05). Each is
    // its name with its kind's icon, and what does not fit folds into «+N».

    if (type === "file" && Array.isArray(value)) {
      const files = value.map(file => (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_8__.renderCellField)(column, file, host)).filter(item => item !== null && item !== undefined);
      return files.length ? files : null;
    } // A date reads as the SIMAI Framework's field renderers read it (the
    // record's own day and clock, in the page's language; the host's
    // formatFieldValue first): the table's own date parsing is gone (VF-10).


    const rendered = (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_8__.renderCellField)(column, value, host);
    if (rendered !== null && rendered !== undefined) return rendered;
    return null;
  } // What a cell draws: the field renderers' answer, and when they leave a
  // plain number to the host and the host has none, the number in the
  // page's language (VT-14 of the sf-view-table study: «1.5» in a Russian
  // table, while money and dates were localised) -- every digit the value
  // has, never rounded, grouped as the language groups.


  cellValue(column = {}, value) {
    // The relative date template (Larena L-3): «сегодня», «вчера»,
    // «3 дня назад» in the cell, the full date in its title.
    if (this.cellIsRelative(column)) {
      const relative = this.relativeDate(column, value);
      if (relative) return relative;
    }

    const typed = this.getTypedCellValue(column, value);
    if (typed !== null && typed !== undefined) return typed;
    const type = column.propertyType ?? column.property_type ?? column.type;
    if ((type === "integer" || type === "number") && !(column.variant || column.filter?.variant)) return this.localNumber(value);
    return null;
  }

  localNumber(value) {
    const text = typeof value === "number" ? Number.isFinite(value) ? String(value) : "" : String(value ?? "").trim();
    if (!/^-?\d+(\.\d+)?$/u.test(text)) return null;
    const digits = (text.split(".")[1] ?? "").length;
    const locale = this.closest?.("[lang]")?.getAttribute("lang") || globalThis.document?.documentElement?.lang || undefined;

    try {
      return new Intl.NumberFormat(locale || undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      }).format(Number(text));
    } catch {
      return null;
    }
  } // A date or a date and time column drawn with the relative template
  // (variant "relative", the «Кратко» place only: the record card and the
  // editor keep the full date).


  cellIsRelative(column = {}) {
    const type = column.propertyType ?? column.property_type ?? column.type;
    return (type === "date" || type === "datetime") && (column.variant ?? column.template) === "relative";
  } // How far the value's day is from today, in the page language
  // (Intl.RelativeTimeFormat, numeric "auto"): «сегодня», «вчера»,
  // «3 дня назад», «через 2 недели»; days under a week, then weeks under a
  // month, months under a year, then years. null for a value that is no
  // date, so the cell falls back to the full date.


  relativeDate(column = {}, value) {
    const day = relativeDay(value);
    if (!day) return null;
    const now = new Date(typeof this.now === "function" ? this.now() : Date.now());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.round((day - today) / 86400000);
    const locale = this.closest?.("[lang]")?.getAttribute("lang") || globalThis.document?.documentElement?.lang || undefined;
    const size = Math.abs(days);
    const [amount, unit] = size < 7 ? [days, "day"] : size < 30 ? [Math.trunc(days / 7), "week"] : size < 365 ? [Math.trunc(days / 30), "month"] : [Math.trunc(days / 365), "year"];

    try {
      return new Intl.RelativeTimeFormat(locale || undefined, {
        numeric: "auto"
      }).format(amount, unit);
    } catch {
      return null;
    }
  } // The title of a cell: the full date of a relative date cell, else none.


  cellTitle(column = {}, value) {
    if (!this.cellIsRelative(column) || !this.relativeDate(column, value)) return null;
    const {
      variant,
      template,
      ...plain
    } = column;
    const full = this.getTypedCellValue(plain, value);
    return typeof full === "string" || typeof full === "number" ? String(full) : null;
  } // The machine reading of a date cell (C40, PD-9): a date or a date and time
  // the Framework reads is printed as a time element whose datetime is the
  // record's own day and clock, as the record panel prints it. '' for any
  // other cell, or a value that is no date.


  cellDateTime(column = {}, value) {
    const type = column.propertyType ?? column.property_type ?? column.type;
    if (type !== "date" && type !== "datetime") return "";
    if (typeof value !== "string" && !(value && typeof value === "object" && !Array.isArray(value))) return "";
    return (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_8__.dateTimeAttribute)({ ...column,
      propertyType: type
    }, value) || "";
  } // The text a long-text cell shows on its one line: formatted text is its
  // text, not its markup -- «<p>Этапы: <strong>дизайн</strong>…» stood in
  // the row as written (the Fields page, 2026-11-05).


  cellText(column = {}, value) {
    const type = column.propertyType ?? column.property_type ?? column.type;
    return type === "html" ? (0,_view_common_field_html_js__WEBPACK_IMPORTED_MODULE_9__.htmlText)(value) : String(value);
  } // The filter controls were the Framework's only type-aware rendering, and
  // Larena's request asks for one renderer set shared by the record view and
  // the table's cells. Keeping these here as well would have made two maps
  // for one question, so they moved into src/smart/field-renderers and this
  // asks the set. The host interface is small on purpose: the set renders,
  // the table owns the state.


  renderFilterControl(field = {}) {
    return (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_8__.renderFilterField)(field, {
      // The filter controls take this size: the host built here had none,
      // so the search field in a field's window stayed at 1 beside
      // buttons at 1/2.
      size: this.size,
      getFilterControlValue: key => this.getFilterControlValue(key),
      patchTempFilterValue: (key, patch) => this.patchTempFilterValue(key, patch),
      getFilterOperatorLabel: operator => this.getFilterOperatorLabel(operator, field),
      getFilterOptionSearch: key => this.getFilterOptionSearch(key),
      patchTempFilterOptionSearch: (key, search) => this.patchTempFilterOptionSearch(key, search),
      getVisibleFilterOptions: item => this.getVisibleFilterOptions(item),
      renderFilterOption: (item, option) => this.renderFilterOption(item, option),
      getEndpointFilterPage: item => this.getEndpointFilterPage(item),
      loadEndpointFilterPage: (item, cursor, search) => this.loadEndpointFilterPage(item, cursor, search)
    });
  }

  renderFilterOption(field = {}, option = {}, selected = new Set()) {
    const value = option.value ?? option.id ?? option.key ?? option.label ?? option.title;
    const label = option.label || option.title || String(value || '');
    const badge = field.filter?.optionRenderer === 'badge' ? (0,_view_common_option_badge_js__WEBPACK_IMPORTED_MODULE_7__.optionBadgeProps)(option) : null; // An option list is a dense place: its badge keeps the size's own narrow
    // side room (sf-badge tight, sf-badge 1.3.0), as a cell's choice badge does.

    return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
            <div
                    ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_11__.ref)(this.getItemRef(option.label))}
                    class="flex items-cross-center gap-1/2 content-main-between">
                <div class="flex items-cross-center gap-1/2 min-w-0">
                    ${badge ? (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                        <sf-badge
                                appearance="tonal"
                                tight
                                scheme=${badge.scheme}
                                root-style=${badge.rootStyle || lit__WEBPACK_IMPORTED_MODULE_10__.nothing}
                                icon=${option.icon || lit__WEBPACK_IMPORTED_MODULE_10__.nothing}
                                text=${label}
                        ></sf-badge>
                    ` : (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                        ${this.renderFilterOptionVisual(field, option)}
                        <span class="sf-text-1 truncate">${label}</span>
                    `}
                </div>
                <sf-checkbox
                        size=${this.size}
                        position="end"
                        root-class="content-main-between"
                        ?checked=${selected.has(value)}
                        @change=${event => {
      const nextSelected = new Set(selected);

      if (event.target?.checked) {
        nextSelected.add(value);
      } else {
        nextSelected.delete(value);
      }

      this.patchTempFilterValue(field.key, {
        values: Array.from(nextSelected),
        operator: field.filter?.defaultOperator || 'in'
      });
    }}
                ></sf-checkbox>
            </div>
        `;
  }

  renderFilterOptionVisual(field = {}, option = {}) {
    // A colour from the field's palette is shown as its swatch.
    if (field.filter?.optionRenderer === 'swatch' && option.color) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`<span class="sf-table-filter-swatch" aria-hidden="true" style=${`background-color: ${option.color}`}></span>`;
    }

    if (field.filter?.optionRenderer !== 'avatar-checkbox') {
      return '';
    }

    if (option.imageUrl) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                <sf-avatar
                        size=${this.size}
                        image-url="${option.imageUrl}"
                        heading="${option.title || option.label || ''}"
                ></sf-avatar>
            `;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
            <sf-avatar
                    size=${this.size}
                    heading="${option.avatarText || option.title || option.label || ''}"
            ></sf-avatar>
        `;
  } // A date's comparisons read as time, not as amounts (PD-6): «Позже»,
  // «Не раньше», «Раньше», «Не позже» for a date or a date and time field.


  getFilterOperatorLabel(operator, field = null) {
    const type = field?.propertyType ?? field?.property_type ?? field?.type ?? field?.dataType ?? field?.filter?.control;
    const dated = {
      gt: 'operatorAfter',
      gte: 'operatorOnOrAfter',
      lt: 'operatorBefore',
      lte: 'operatorOnOrBefore'
    };
    if ((type === 'date' || type === 'datetime') && dated[operator]) return this.text(dated[operator]);
    const keys = {
      eq: 'operatorEq',
      gt: 'operatorGt',
      gte: 'operatorGte',
      lt: 'operatorLt',
      lte: 'operatorLte',
      between: 'operatorBetween',
      contains: 'operatorContains',
      startsWith: 'operatorStartsWith',
      any: 'operatorAny',
      today: 'operatorToday',
      week: 'operatorWeek',
      month: 'operatorMonth',
      in: 'operatorIn'
    }; // An operator nobody has a word for is shown as it is stored, which is
    // better than a blank and says what to add.

    return keys[operator] ? this.text(keys[operator]) : operator;
  }

  renderFilterSettingsContextMenu(data) {
    const {
      x,
      y,
      position,
      columnCount,
      columnsCount,
      transform
    } = data;
    let pos = `translateX(${transform !== undefined ? transform : 0}%)`;
    const pendingFilter = this.getPendingFilterState(); // What a press would change, so the button can say it. The button is
    // already a filled primary one, so an extra fill or ring would say
    // nothing: the count is the marked state, and with nothing pending the
    // button reads exactly as it did before. sf-button carries no `filled`
    // property -- that belongs to the icon button -- so setting one would
    // have been an attribute nobody reads.

    const pendingConditions = this.countPendingFilterConditionChanges();
    const selectedTemplateKey = pendingFilter.selectedTemplateKey;
    const sortedTemplates = this.getSortedFilterTemplates(pendingFilter);
    const sortTemplates = sortedTemplates.map(col => {
      let component;
      const isActiveEdit = this.state.filter.rename === col.key;

      if (this.state.filter.rename !== col.key) {
        const data = {
          type: "radio",
          props: {
            size: this.size,
            // A template the host gave no name is the view as it
            // stands: it is named so, not drawn as an empty row
            // (owner, 2026-10-14).
            label: col.label || this.text('untitledTemplateText'),
            name: 'filter_templates',
            checked: selectedTemplateKey ? selectedTemplateKey === col.key : col.selected || false,
            '@change': () => {
              this.selectTempFilterTemplate(col.key);
            }
          }
        };
        component = this.renderSmartElement(data.type, data.props);
      } else {
        component = (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                    <div class="flex items-cross-center gap-1/4 flex-1">
                        <sf-input size=${this.size} ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_11__.ref)(this.refs.renameInput)} root-class="flex-1"
                                  default-value="${col.label}"></sf-input>
                        <div class="flex items-cross-center flex-none">
                            <sf-button-icon size=${this.size} segment="start" appearance="outline" scheme="on-surface" @click="${() => {
          this.set(prevState => ({
            filter: { ...(prevState.filter || {}),
              rename: ''
            }
          }));
        }}"
                                            icon="close"></sf-button-icon>
                            <sf-button-icon size=${this.size} segment="end" icon="check" @click="${() => {
          const name = this.refs.renameInput.value?.value;
          this.saveFilterTemplatePatch(col.key, {
            label: name
          }, {
            filterPatch: {
              rename: ''
            },
            saveInputValue: name
          });
        }}"></sf-button-icon>
                        </div>
                    </div>`;
      }

      return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                <div
                        :key=${col.key}
                        ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_11__.ref)(this.getItemRef(col.label))}
                        class="sf-settings-context-menu-item flex items-cross-center flex-1 gap-1/3 ${col.deleted ? 'opacity-3' : ''}"
                        data-filter-template-key="${col.key}"
                        data-sf-sortable-item=${col.key}
                        data-pinned="${col.pinned ? "1" : "0"}"
                >
                    ${!isActiveEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                        <sf-button-icon size=${this.size}
                                id="${this.getInstanceId()}--template-move--${col.key}"
                                appearance="ghost"
                                data-move
                                data-sf-sortable-handle
                                scheme="on-surface"
                                aria-label=${`${this.text("templateMoveLabel")}: ${col.label}`}
                                icon="drag_indicator"
                                root-class="cursor-move"
                        ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_10__.nothing}
                    ${component}
                    ${!isActiveEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                        <div class="flex items-cross-center m-inline-start-auto gap-1/3">
                            <sf-button-icon
                                    appearance="ghost"
                                    data-keep
                                    size="1/3"
                                    scheme="on-surface"
                                    aria-label=${`${this.text("templatePinLabel")}: ${col.label}`}
                                    ?filled="${col.pinned}"
                                    root-class="${col.pinned ? 'sf-button-pinned' : ''}"
                                    icon="keep"
                                    @click=${() => {
        this.patchTempFilterTemplateSettings(col.key, {
          pinned: !col.pinned
        });
      }}
                            ></sf-button-icon>
                            <sf-button-icon size=${this.size}
                                    appearance="ghost"
                                    data-settings
                                    data-context-submenu-anchor="${col.key}"
                                    scheme="on-surface"
                                    aria-label=${`${this.text("templateActionsLabel")}: ${col.label}`}
                                    icon="more_horiz"
                                    @click=${event => {
        this.openContextSubmenu(event, {
          type: 'filter-template-actions',
          template: col
        });
      }}
                            ></sf-button-icon>
                        </div>` : lit__WEBPACK_IMPORTED_MODULE_10__.nothing}
                </div>`;
    });
    const menuColumnCount = columnCount ?? columnsCount ?? this.contextMenuColumns ?? 1;
    const colsData = this.getFilterTagColsData();
    const columnGroups = this.splitItemsByColumns(colsData, menuColumnCount);
    let contextItems = `${this.text('templatesTabText')}|${this.text('fieldsTabText')}`;
    return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
            <sf-menu-context
                    size=${this.menuSize}
                    :key=${x + y + this._renderToken}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'filter-settings'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            transform: ${pos};
            z-index: var(--sf-table-context-menu--z-index, ${this.contextMenuZIndex()});
            --sf-table-context-menu--max-block-size: calc(100dvh - ${y}px - var(--sf-space-4));
            --sf-table-context-menu--trigger-inline-size: ${this.contextTriggerInlineSize(data)}px;
          "
                    root-class="sf-table-context-menu ${this.contextWindowClass('filter-settings', menuColumnCount)} ${this.size === "1/2" ? "sf-table-context-menu--dense " : ""}flex flex-col"
                    position="${position || ""}"
                    role="dialog"
                    tabs=${contextItems}
                    active-tab=${this._filterTab === 'fields' ? '1' : '0'}
                    closable
                    @sf-menu-context-tab=${event => {
      event.stopPropagation();
      this._filterTab = event.detail?.index === 1 ? 'fields' : 'templates';
      this.requestComponentUpdate('filter-tab');
    }}
                    @sf-menu-context-close=${event => {
      event.stopPropagation();
      this.closeContextMenu();
    }}
            >
                <!-- The Framework's panel with tabs (owner, 2026-10-15): the
                     tabs stay while the rows scroll, the buttons stay at the
                     bottom, and the window keeps its width -- it grew under
                     the pointer when «Применить (2)» got longer. -->
                <div class="sf-table-context-body flex flex-col flex-1" slot="content">
                    ${this._filterTab !== 'fields' ? (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                            <div
                                    class="sf-context-menu-columns flex flex-col gap-1/4 overflow-auto flex-1"
                                    data-filter-template-list
                            >
                                ${this.renderSortableGroups(sortTemplates.filter((_, at) => sortedTemplates[at].pinned), sortTemplates.filter((_, at) => !sortedTemplates[at].pinned), {
      name: 'filter-templates',
      label: this.text('templatesTabText'),
      onIntent: event => this.onFilterTemplateIntent(event)
    })}
                            </div>` : (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                            <div class="sf-context-menu-columns flex flex-1 gap-1 overflow-auto">
                                ${columnGroups.map(group => (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                                            <div class="flex flex-col gap-1 flex-1">
                                                ${group}
                                            </div>
                                        `)}
                            </div>`}
                </div>
                        <sf-button slot="footer" size=${this.size} @click="${() => {
      const tempFilter = this.tempSettings?.filter;

      if (tempFilter) {
        let changedTemplates = [];
        let deletedKeys = [];
        let selectedKey = null;
        this.set(prevState => {
          const hasDataChanges = this.hasPendingFilterDataChanges(prevState.filter || {});
          const filter = this.mergeFilterState(prevState.filter || {}, tempFilter);
          const selectedTemplate = this.getSelectedFilterTemplate(filter);
          changedTemplates = tempFilter.templates ? this.getChangedFilterTemplates(prevState.filter || {}, filter, ['order', 'pinned', 'deleted', 'selected', 'default']) : [];
          deletedKeys = filter.templates.filter(template => template.deleted && template.key).map(template => template.key);
          filter.templates = filter.templates.filter(el => !el.deleted);
          const previousKey = this.getSelectedFilterTemplate(prevState.filter || {})?.key || null;
          selectedKey = selectedTemplate?.key && selectedTemplate.key !== previousKey ? selectedTemplate.key : null;
          return {
            filter,
            filterDataDirty: prevState.filterDataDirty || hasDataChanges,
            saveInputValue: selectedTemplate?.label || ""
          };
        }, () => {
          if (changedTemplates.length) {
            this.dispatchFilterTemplatesSave(changedTemplates);
          }

          for (const key of deletedKeys) {
            this.emitTableEvent('template-delete', Object.freeze({
              key
            }));
          }

          if (selectedKey) {
            this.emitTableEvent('template-select', Object.freeze({
              key: selectedKey
            }));
          }
        });
      }

      this.tempSettings = null;
      this.closeContextMenu();
    }}" root-class="flex-1"
                                   aria-label=${pendingConditions ? `${this.text("filterApplyText", "filter-apply-text")}: ${pendingConditions}` : this.text("filterApplyText", "filter-apply-text")}
                                   text=${pendingConditions ? `${this.text("filterApplyText", "filter-apply-text")} (${pendingConditions})` : this.text("filterApplyText", "filter-apply-text")}></sf-button>
                        <sf-button slot="footer" size=${this.size} @click="${() => {
      // Reset means the defaults, not "forget what I just
      // typed here": the draft goes, and the host is asked
      // to clear the person's own layer — order, widths,
      // visibility and pinning — because the defaults are
      // the host's to decide, not this component's.
      this.tempSettings = null;
      this.requestComponentUpdate('table');
      this.requestColumnSettingsReset();
    }}" appearance="outline" scheme="on-surface" root-class="flex-1"
                                   text="${this.text('resetText')}"></sf-button>
            </sf-menu-context>
        `;
  }

  renderTagsSettingsContextMenu(data) {
    const {
      x,
      y,
      position,
      fieldKey
    } = data;
    const field = this.getFilterField(fieldKey) || {
      key: fieldKey,
      label: this.getCurrentFilterTags()?.[fieldKey]?.label || fieldKey || '',
      filter: {
        control: this.getCurrentFilterTags()?.[fieldKey]?.control || 'text'
      }
    };
    return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
            <sf-menu-context
                    size=${this.menuSize}
                    :key=${x + y + this._renderToken}
                    aria-label=${this.getContextMenuLabel({ ...data,
      menu: 'tag-settings'
    })}
                    style="
            position: fixed;
            left: ${x}px;
            inset-block-start: calc(${y}px + calc(var(--sf-focus-outline-width) * 2));
            z-index: var(--sf-table-context-menu--z-index, ${this.contextMenuZIndex()});
          "
                    root-class="sf-table-context-menu ${this.contextWindowClass('tag-settings')} ${this.size === "1/2" ? "sf-table-context-menu--dense " : ""}flex flex-col"
                    position="${position || ""}"
            >
                <div class="flex flex-col flex-1 ${this.size === "1/2" ? "p-top-1" : "p-top-3"}" slot="content">
                    <div class="sf-table-context-main">
                        <div class="sf-table-tags-search flex flex-col">
                            <div class="flex flex-col ${this.size === "1/2" ? "p-bottom-1" : "p-bottom-3"}">
                                ${this.renderFilterControl(field)}
                            </div>
                        </div>
                    </div>
                    <div class="sf-table-context-bottom sf-context-menu-footer">
                        <sf-button size=${this.size} @click="${() => {
      const tempFilter = this.tempSettings?.filter;

      if (tempFilter) {
        this.set(prevState => {
          const hasDataChanges = this.hasPendingFilterDataChanges(prevState.filter || {});
          return {
            filter: this.mergeFilterState(prevState.filter || {}, tempFilter),
            filterDataDirty: prevState.filterDataDirty || hasDataChanges
          };
        }, () => {
          const detail = this.filterUpdate();
          this.emitTableEvent('filter-change', detail);
        });
      }

      this.tempSettings = null;
      this.closeContextMenu();
    }}" root-class="flex-1" text="${this.text('applyText')}"></sf-button>
                        <sf-button size=${this.size} @click="${() => {
      this.tempSettings = null;
      this.requestComponentUpdate('table');
    }}" appearance="outline" scheme="on-surface" root-class="flex-1"
                                   text="${this.text('resetText')}"></sf-button>
                    </div>
                </div>
            </sf-menu-context>
        `;
  }

  removeFilterTag(id = null) {
    if (id) {
      this.tempSettings = null;
      this.set(prevState => {
        const prevFilter = prevState.filter || {};
        const tags = { ...this.getCurrentFilterTags(prevFilter)
        };
        const values = { ...this.getCurrentFilterValues(prevFilter)
        };
        delete tags[id];
        delete values[id];
        return {
          filter: this.patchFilterTemplateData(prevFilter, {
            tags,
            values
          }),
          filterDataDirty: true
        };
      }, () => {
        const detail = this.filterUpdate();
        this.emitTableEvent('filter-change', detail);
      });
      return this;
    }

    this.tempSettings = null;
    this.set(prevState => {
      const prevFilter = prevState.filter || {};
      return {
        filter: { ...prevFilter,
          selectedTemplateKey: "",
          templates: this.getFilterTemplates(prevFilter).map(template => ({ ...template,
            selected: false
          }))
        },
        saveInputValue: "",
        filterDataDirty: false
      };
    }, () => {
      const detail = this.filterUpdate();
      this.emitTableEvent('filter-change', detail);
    });
    return this;
  } // The gear's window (owner decision C106): SIMAI Framework sf-settings in
  // its panel look, not sf-menu-context's tabs with rows drawn here. Two
  // groups as tabs, «Поля» -- the columns, shown or not, in their order, the
  // pinned ones on top, with the panel's search -- and «Вид» -- the rows'
  // density, the lines, one line, the held head and whether a change is for
  // all the person's tables. Everything applies at once (2026-10-05);
  // «Сбросить» puts back the fields as the window opened with them, or the
  // view's defaults, by the tab it stands on. The panel takes its density
  // from the gear (C22); a size is passed only when the host wrote one.
  // The gear opens the column settings and closes them again: the gear in
  // the head of the row-menu column, and on a phone the list toolbar's own
  // (view round 5, LV-6). One click reaches this twice (the button, then its
  // host), so only a later click closes what this one opened.


  toggleTableSettings(e) {
    const open = this.state.contextMenu?.open && this.state.contextMenu?.menu === 'table-settings';

    if (open && e.timeStamp - (this._settingsOpenedAt ?? 0) > 200) {
      this.closeContextMenu();
      return;
    }

    if (open) return;
    this._settingsOpenedAt = e.timeStamp; // VR14-5: under the list head the gear opens the window against the
    // head's «Колонки» (the same window, C406), below the head and at
    // the list's end, so it no longer covers the rows' «≡» at their start.

    const columns = this.hasAttribute("data-sf-columns-only") ? this.closest?.("sf-view, sf-data-view")?.querySelector?.(':scope > [slot="head"] .sf-view-head-columns') : null; // sf-button's host is display: contents: its <button> has the box.

    const drawn = (columns?.querySelector?.("button") ?? columns)?.getClientRects?.().length > 0;

    if (columns && drawn && !columns.contains(e.target)) {
      this.openColumnSettings(columns);
      return;
    }

    this.openContextMenu(e, {
      menu: 'table-settings'
    });
  } // The column window opened against another control (C406: the list
  // head's «Колонки» duplicates the gear): the same panel, the same
  // toggle, against that control.


  openColumnSettings(anchor) {
    const host = anchor instanceof Element ? anchor : null;
    if (!host) return null;
    const button = host.matches?.("button, [role=\"button\"]") ? host : host.querySelector?.("button, [role=\"button\"]") ?? host;
    this._settingsTab = "columns";
    return this.toggleTableSettings({
      currentTarget: host,
      target: button,
      timeStamp: performance.now(),
      composedPath: () => [button, host],

      preventDefault() {},

      stopPropagation() {}

    });
  }

  renderTableSettingsContextMenu(data) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
            <sf-settings
                    look="panel"
                    search
                    data-table-settings
                    for=${this.settingsTriggerId(data.anchor)}
                    size=${this.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_10__.nothing}
                    label=${this.getContextMenuLabel({ ...data,
      menu: 'table-settings'
    })}
                    .items=${this.tableSettingsItems()}
                    @sf-settings-changed=${event => this.onTableSettingChanged(event)}
                    @sf-settings-reset=${event => this.onTableSettingsReset(event)}
                    @sf-settings-open=${event => event.stopPropagation()}
                    @sf-settings-opened=${event => event.stopPropagation()}
                    @sf-settings-close=${event => this.onTableSettingsClose(event)}
                    @sf-settings-closed=${event => this.onTableSettingsClosed(event)}
            ></sf-settings>
        `;
  } // The panel opens against the control that opened the window, which it
  // names by id (sf-settings for=): a control without one is given one.


  settingsTriggerId(anchor) {
    const trigger = anchor instanceof Element ? anchor : this;
    if (!trigger.id) trigger.id = `${this.getInstanceId()}--settings-trigger`;
    return trigger.id;
  } // The gear's settings as sf-settings items, made again only when what they
  // say changes, so the panel is not handed a new list on every drawing.


  tableSettingsItems() {
    const view = this.tableView;
    const options = this.getColumnItems().filter(column => column?.key).map(column => ({
      id: String(column.key),
      text: column.label || String(column.key),
      checked: this.isColumnVisible(column),
      // The box and the row menu are always pinned (offered nothing).
      pinned: Boolean(column.system) || this.isColumnPinned(column)
    })); // One density for the whole list (owner decision D4, 2026-11-21):
    // «Обычная» and «Компактная», no «Просторно»; the rows' own height
    // setting is gone, and every part of the list follows the one choice.

    const density = {
      normal: "viewDensityNormal",
      compact: "viewDensityCompact"
    };

    const toggle = (id, word) => ({
      id,
      type: "switch",
      text: this.text(word),
      value: view[id] === true
    }); // «На телефоне» (LV3-11): which fields a record shows as a phone row,
    // flat rows after the fields (a second group would be a tab).


    const phone = this.phoneColumns();
    const shown = new Set(this.phoneShownKeys());
    const phoneRows = phone.length ? [{
      type: "separator"
    }, {
      type: "heading",
      text: this.text("settingsPhoneHeading")
    }, ...phone.map(column => ({
      id: `phone:${column.key}`,
      type: "switch",
      text: column.label || String(column.key),
      value: shown.has(String(column.key))
    }))] : [];
    const items = [{
      type: "group",
      text: this.text("settingsFieldsTab"),
      items: [{
        id: "columns",
        type: "fields",
        text: this.text("settingsFieldsTab"),
        sortable: true,
        pinnable: true,
        options
      }, ...phoneRows]
    }, {
      type: "group",
      text: this.text("settingsViewTab"),
      items: [{
        id: "density",
        type: "choice",
        text: this.text("viewDensity"),
        value: this.shownViewDensity,
        options: Object.entries(density).map(([id, word]) => ({
          id,
          text: this.text(word)
        }))
      }, toggle("lines", "viewLines"), toggle("singleLine", "viewSingleLine"), ...(this.getAttribute("vertical-scroll") === "page" ? [toggle("stickyHead", "viewStickyHead")] : []) // No «Для всех моих таблиц» row (owner decision C408): what a
      // person sets for their own view holds in every table of theirs.
      ]
    }]; // Under the list head (sf-view head="list", C406) the gear holds the
    // columns only: the view's look is «Вид» in the list head, and the
    // gear duplicates «Колонки» there.
    // VR14-5: its one group's rows stand alone, so «Поля» is not said
    // twice (the group's heading over the fields list's own).

    if (this.hasAttribute("data-sf-columns-only")) items.splice(0, items.length, ...items[0].items);
    const key = JSON.stringify(items);
    if (this._settingsItems?.key !== key) this._settingsItems = {
      key,
      items
    };
    return this._settingsItems.items;
  } // The fields list's value as the table holds it: what the panel shows
  // after a change the table took otherwise or not at all.


  tableSettingsColumns() {
    const items = this.tableSettingsItems();
    const columns = (items.find(item => item.id === "columns") ?? items[0].items[0]).options;
    return columns.map(({
      id,
      checked,
      pinned
    }) => ({
      id,
      checked,
      pinned
    }));
  } // A setting a person changed in the panel, applied as the window's own
  // controls applied it: a pin through toggleColumnPinned (the end of the
  // pinned block, the start of the loose ones), a column shown or hidden,
  // the order of every column (a drag or Alt+arrows), the view through
  // setTableView, for this table or for all of them.


  onTableSettingChanged(event) {
    event.stopPropagation();
    const settings = event.currentTarget;
    const {
      id,
      value
    } = event.detail ?? {};
    if (id === "columns") this.applyColumnsSetting(value);else if (String(id ?? "").startsWith("phone:")) {
      const key = String(id).slice(6);
      const keys = new Set(this.phoneShownKeys());
      if (value) keys.add(key);else keys.delete(key);
      const order = this.phoneColumns().map(column => String(column.key));
      this.setTableView({
        phoneFields: order.filter(one => keys.has(one))
      }, {
        everywhere: false
      });
    } else if (["density", "lines", "singleLine", "stickyHead"].includes(id)) {
      this.setTableView({
        [id]: value
      });
    } // A change the table did not take (a system column's pin or place)
    // goes back in the panel; one it took is already the same.

    requestAnimationFrame(() => {
      if (id === "columns" && settings?.isConnected) settings.setValue?.("columns", this.tableSettingsColumns());
    });
  }

  applyColumnsSetting(value = []) {
    const columns = this.getColumnItems().filter(column => column?.key);
    const byKey = new Map(columns.map(column => [String(column.key), column]));
    const asked = (Array.isArray(value) ? value : []).filter(one => byKey.has(one?.id));
    const pin = asked.find(one => !byKey.get(one.id).system && Boolean(one.pinned) !== this.isColumnPinned(byKey.get(one.id)));
    if (pin) return this.toggleColumnPinned(byKey.get(pin.id));
    const shown = asked.find(one => Boolean(one.checked) !== this.isColumnVisible(byKey.get(one.id)));

    if (shown) {
      this.patchTempColumnSettings(byKey.get(shown.id).key, {
        visible: Boolean(shown.checked)
      });
      return this.commitColumnSettings("column-visibility");
    }

    const loose = list => list.filter(key => !byKey.get(key).system);

    const ordered = loose(asked.map(one => one.id));
    const before = loose(columns.map(column => String(column.key)));
    if (ordered.join("\n") === before.join("\n")) return this;
    ordered.forEach((key, position) => this.patchTempColumnSettings(byKey.get(key).key, {
      order: (position + 1) * 10
    }));
    this.requestComponentUpdate("column-order");
    return this.commitColumnSettings("column-order");
  } // The tab the panel stands on: its groups are tabs (a search and a fields
  // list), «Поля» first.


  settingsTabOf(settings) {
    const tabs = settings?.querySelector?.(".sf-settings-panel-tabs");
    return Number(tabs?.getAttribute("active-index") ?? 0) === 1 ? "view" : "fields";
  }

  onTableSettingsReset(event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.settingsTabOf(event.currentTarget) === "view") this.resetTableView();else this.restoreColumnSettingsOnOpen();
  } // The window opens again on the tab it was closed on.


  onTableSettingsClose(event) {
    event.stopPropagation();
    this._settingsTab = this.settingsTabOf(event.currentTarget);
  } // Closed by the panel itself (×, Escape, a press outside, Tab out): the
  // window goes; the panel has already put the focus back. A panel leaving
  // because the window closed is not connected any more.


  onTableSettingsClosed(event) {
    event.stopPropagation();
    if (event.currentTarget?.isConnected && this.state.contextMenu?.open) this.closeContextMenu(false);
  } // The panel drawn, it is opened against its trigger, on the tab it was
  // closed on; a trigger the page cannot find by id is passed in.


  async showSettingsPanel(settings) {
    await customElements.whenDefined("sf-settings");
    await settings.whenRendered?.();
    if (!settings.isConnected) return;
    const view = this._settingsTab === "view";
    const answer = await settings.show?.(view ? "density" : "columns");

    if (answer?.outcome === "unavailable" && answer.reason === "no-trigger" && settings.isConnected) {
      settings.toggle?.(this.state.contextMenu?.anchor ?? this);
      if (view) settings.chooseGroup?.(1);
    }
  }

  renderMainContextMenu(data) {
    const menu = data.menu || data.menuType || data.contextMenu;

    switch (menu) {
      case 'filter-favorites':
        return this.renderFilterFavoritesContextMenu(data);

      case 'filter-settings':
        return this.renderFilterSettingsContextMenu(data);

      case 'table-settings':
        return this.renderTableSettingsContextMenu(data);

      case 'tag-settings':
        return this.renderTagsSettingsContextMenu(data);

      default:
        return this.renderTableSettingsContextMenu(data);
    }
  } // A saved view's actions -- rename, make it the default, delete or
  // restore -- through SF.menu.open, at its «⋯» inside the filter window
  // (VF-1): the menu was a second sf-menu-context the table placed with
  // position: fixed and a tail. A delete or a restore is marked in the window
  // and applied with «Применить», as before.


  async openTemplateActionsMenu(anchor, template = {}) {
    const temp = this.getFilterTemplateByKey(template.key, this.tempSettings?.filter || null);
    const isDeleted = (temp || template).deleted;
    const isDefaultTemplate = (temp || template).default === true;
    const choice = await (0,_view_common_menu_open_js__WEBPACK_IMPORTED_MODULE_19__.menuOpen)({
      anchor,
      label: this.getContextMenuLabel({
        type: 'filter-template-actions',
        template
      }),
      size: this.menuSize,
      entries: [// The standard menu's rows (owner, 2026-10-14), not link
      // buttons; a delete is marked as one, a restore is not.
      {
        id: 'rename',
        text: this.text('renameText'),
        icon: 'edit'
      }, {
        id: 'default',
        text: isDefaultTemplate ? this.text('defaultTemplateText') : this.text('makeDefaultLabel'),
        icon: isDefaultTemplate ? 'remove' : 'check'
      }, {
        id: 'delete',
        text: isDeleted ? this.text('restoreText') : this.text('deleteActionText'),
        icon: isDeleted ? 'restore_from_trash' : 'delete',
        danger: !isDeleted
      }]
    });
    const id = choice?.id;

    if (id === 'rename') {
      this.set(prevState => ({
        filter: { ...(prevState.filter || {}),
          rename: template.key
        }
      }));
    } else if (id === 'default') {
      this.changeTempFilterTemplateSettings(template.key, {
        default: !isDefaultTemplate
      });
    } else if (id === 'delete') {
      this.patchTempFilterTemplateSettings(template.key, {
        deleted: !isDeleted
      });
    }

    return choice;
  }

  renderContextMenu(data) {
    // A window is drawn into this element's portal, which the Loader reads
    // as the page (SF.Loader.watch in getPortalContainer); the window's
    // elements are asked for as it opens so they arrive with it.
    if (data?.open) {
      globalThis.SF?.Loader?.ensure?.(data.menu === 'tag-settings' ? ["sf-input-date", "sf-slider-range"] : ["sf-sortable", "sf-radio", "sf-tabs", "sf-settings"]);
    }

    if (!data?.open) {
      (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)(null, this.getPortalContainer());
      this.hidePortal();
      if (this._settingsHost?.isConnected) (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)(null, this._settingsHost);
      return lit__WEBPACK_IMPORTED_MODULE_10__.nothing;
    } // The column window (C296, VT-12): the Framework's sf-settings panel is
    // a popover of its own (the top layer, against the gear or «Все
    // колонки…»), so it is not put in the table's full-viewport portal --
    // a 1440x800 layer for a 320-wide panel. It stands in a host of no box.


    if (data.menu === 'table-settings') {
      (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)(null, this.getPortalContainer());
      this.hidePortal();
      this.bindContextEvent();
      (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)((0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`<div class="sf-table-context-layer" data-sf-table-settings-layer ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_11__.ref)(this.refs.contextMenu)}>
                    ${this.renderTableSettingsContextMenu(data)}</div>`, this.getSettingsHost());

      const panel = this._settingsHost.querySelector("sf-settings[data-table-settings]");

      if (panel && panel !== this._settingsShown) {
        this._settingsShown = panel;
        this.showSettingsPanel(panel);
      }

      requestAnimationFrame(() => this.redrawWhenComponentsUpgrade(this._settingsHost));
      return lit__WEBPACK_IMPORTED_MODULE_10__.nothing;
    }

    if (this._settingsHost?.isConnected) (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)(null, this._settingsHost); // On the layer stack before it is drawn: the windows take their
    // z-index from their place in it.

    this.bindContextEvent();
    (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)((0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                <div
                        class="sf-table-context-layer"
                        data-sf-sheet=${this.isList && ["filter-settings", "tag-settings"].includes(data.menu) ? "" : lit__WEBPACK_IMPORTED_MODULE_10__.nothing}
                        ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_11__.ref)(this.refs.contextMenu)}
                >
                    ${this.renderMainContextMenu(data)}
                    ${this.isList && ["filter-settings", "tag-settings"].includes(data.menu) ? (0,lit__WEBPACK_IMPORTED_MODULE_10__.html)`
                        <div class="sf-table-sheet-close">
                            <sf-button-icon size=${this.size} appearance="ghost" scheme="on-surface"
                                            icon="close" aria-label=${this.text('closeText')}
                                            @click=${() => this.closeContextMenu()}></sf-button-icon>
                        </div>` : lit__WEBPACK_IMPORTED_MODULE_10__.nothing}
                </div>
            `, this.getPortalContainer());
    this.showPortal();
    this.bindContextViewport(); // The gear's panel opens itself once it is drawn, once per window.

    const settings = this.getPortalContainer().querySelector("sf-settings[data-table-settings]");

    if (settings && settings !== this._settingsShown) {
      this._settingsShown = settings;
      this.showSettingsPanel(settings);
    }

    requestAnimationFrame(() => {
      this.clampContextMenusToViewport(); // The menu lives in the portal, not in this element's own tree.

      this.redrawWhenComponentsUpgrade(this.getPortalContainer());
    });
    return lit__WEBPACK_IMPORTED_MODULE_10__.nothing;
  }

  getActionItems() {
    return this.state.actions.map(action => {
      const data = {
        type: "checkbox",
        props: {
          size: this.size,
          label: action.name,
          position: 'end',
          rootClass: 'content-main-between',
          checked: action.visible,
          "@change": e => {
            let actionActive = false;
            let arr = this.tempSettings && this.tempSettings.actions ? this.tempSettings.actions : this.state.actions;
            const items = arr.map(item => {
              let visible = item.id === action.id ? e.target.checked : item.visible;

              if (visible) {
                actionActive = true;
              }

              return { ...item,
                visible: visible
              };
            });
            this.tempSettings = { ...(this.tempSettings || {}),
              actionActive,
              actions: items
            };
          }
        }
      };
      return this.renderSmartElement(data.type, data.props);
    });
  }

  hoverEvents(e) {
    if (this._columnResizeState || this.columnDragActive) {
      return;
    }

    const th = e.target.closest('th');

    if (!th) {
      return;
    }

    const wrap = th.querySelector('.sidebar-resizer');

    if (!wrap) {
      return;
    }

    th.classList.add('hover'); // The line belongs to the handle, not to the header. Shown on any
    // header hover it read as if the column were already being resized, and
    // it crossed the rows whenever the pointer merely passed over a title.

    if (this.getColumnResizeHandle(e.target)) {
      this.showColumnResizeGuide(th);
    } else {
      this.hideColumnResizeGuide();
    }
  }

  outEvent(e) {
    if (this._columnResizeState || this.columnDragActive) {
      return;
    }

    const th = e.target.closest('th');

    if (!th) {
      return;
    }

    const wrap = th.querySelector('.sidebar-resizer');

    if (!wrap) {
      return;
    }

    th.classList.remove('hover');
    this.hideColumnResizeGuide();
  }
  /**
   * The line that shows where a column edge will land runs through the rows
   * only, from the bottom of the head to the last row. A head cell cannot draw
   * it: a pseudo-element of a `th` has no way to reach into the body, and the
   * body's height is not known to CSS. So it is one element in the scroll
   * area, placed against the edge being dragged.
   */


  showColumnResizeGuide(th) {
    const guide = this.refs.resizeGuide?.value;
    const scroll = this.refs.scroll?.value;
    const table = this.refs.table?.value;

    if (!guide || !scroll || !th || !table) {
      return;
    }

    const head = table.querySelector('thead');
    const body = table.querySelector('tbody');

    if (!head || !body) {
      this.hideColumnResizeGuide();
      return;
    }

    const area = scroll.getBoundingClientRect();
    const cell = th.getBoundingClientRect();
    const headBox = head.getBoundingClientRect();
    const bodyBox = body.getBoundingClientRect();

    if (bodyBox.height <= 0) {
      this.hideColumnResizeGuide();
      return;
    } // The line continues the header's separator, so it is placed on that
    // separator rather than on the cell's outer edge: the separator is the
    // cell's own border, which occupies the last pixels inside the box.
    //
    // Nothing here is rounded. Rounding to whole pixels put the line beside
    // the separator whenever the cell's edge fell on a fraction -- which is
    // what a column width in rem or a root size of 87.5% produces, and what
    // the consumer measured as one pixel aside.


    const border = parseFloat(getComputedStyle(th).borderInlineEndWidth) || 0;
    const inlineStart = this.isRightToLeft() ? cell.left - area.left + scroll.scrollLeft : cell.right - area.left + scroll.scrollLeft - border;
    guide.style.insetInlineStart = `${inlineStart}px`;
    guide.style.insetBlockStart = `${headBox.bottom - area.top + scroll.scrollTop}px`;
    guide.style.blockSize = `${bodyBox.height}px`;
    guide.hidden = false;
  }

  hideColumnResizeGuide() {
    const guide = this.refs.resizeGuide?.value;

    if (guide) {
      guide.hidden = true;
    }
  }

  isRightToLeft() {
    return getComputedStyle(this).direction === 'rtl';
  }

  bindHoverEvent() {
    if (this._hoverEventBound) return;
    this._hoverEventBound = true;
    const table = this.refs.table?.value;
    table?.addEventListener('mouseover', this.hoverEvents);
    table?.addEventListener('mouseout', this.outEvent); //
    // this.addEventListener('mouseout', () => {
    //     this.querySelectorAll('.hover')
    //         .forEach(el => el.classList.remove('hover'));
    // });
  }

  unBindHoverEvent() {
    if (!this._hoverEventBound) {
      return;
    }

    const table = this.refs.table?.value;
    table?.removeEventListener('mouseover', this.hoverEvents);
    table?.removeEventListener('mouseout', this.outEvent);
    this._hoverEventBound = false;
  } // A column's edge is the Framework's resize gesture (SF.Resizer.attach,
  // owner 2026-10-14) -- the same drag, keys and double click as a panel's
  // edge: the table says what the width is the width of and keeps it in the
  // column settings, as it did.


  bindColumnResizeEvent() {
    const table = this.refs.table?.value;
    if (!table || this._columnResizeTable === table) return;
    const attach = globalThis.SF?.Resizer?.attach;

    if (typeof attach !== 'function') {
      globalThis.SF?.Loader?.ensure?.(['sf-resizer'], {
        timeout: Infinity
      }).then(({
        missing
      }) => {
        if (!missing.length && this.isConnected) this.bindColumnResizeEvent();
      });
      return;
    }

    this._columnResizeDetach?.();
    this._columnResizeTable = table;
    this._columnResizeDetach = attach(table, {
      handles: '.sf-table-column-resizer',
      session: handle => this.columnResizeSession(handle),
      // The value a screen reader hears: the share of the way from the
      // least width to the most, «27 %» (C158 (3)).
      text: share => this.text('columnWidthValue').replace('{n}', String(share))
    });
  }

  unbindColumnResizeEvent() {
    this._columnResizeDetach?.();
    this._columnResizeDetach = null;
    this._columnResizeTable = null;
  }

  columnResizeSession(handle) {
    const th = handle?.closest?.('th');
    const key = th?.dataset?.key;
    const column = key ? this.getColumns().find(item => item?.key === key) : null;
    if (!th || !column || column.system || column.resizable === false) return null;
    const table = this.refs.table?.value;
    const col = table?.querySelector(`col[data-key="${this.escapeColumnKey(key)}"]`);
    const state = {
      key,
      th,
      col,
      frozenWidths: null,
      dragging: false
    };

    const clear = () => {
      this._columnResizeState = null;
      th.style.width = '';
    };

    return {
      measure: () => th.getBoundingClientRect().width,
      limits: () => {
        const {
          minWidth,
          maxWidth
        } = this.getColumnResizeLimits(column, th.getBoundingClientRect().width); // A column with no most width of its own goes as wide as the
        // table's box: the share a screen reader hears runs from the
        // least width to there (C158 (3)), and End is that width. With
        // no end the share was 0 % at any width.

        const box = this.refs.scroll?.value?.clientWidth ?? 0;
        return {
          min: minWidth,
          max: Number.isFinite(maxWidth) ? maxWidth : Math.max(minWidth, box || minWidth)
        };
      },
      direction: () => table && getComputedStyle(table).direction === 'rtl' ? -1 : 1,
      step: this.resolveCssLength(getComputedStyle(this).getPropertyValue('--sf-space-1'), 16),
      start: () => {
        state.dragging = true;
        this._columnResizeState = state;
        (0,_helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_14__.setLoaderDragState)(true);
        document.documentElement.classList.add('sf-table-column-resizing');
      },
      apply: width => {
        state.frozenWidths ??= this.freezeColumnsWidthForResize(table);
        this._columnResizeState = state;
        if (col) col.style.width = `${width}px`;
        th.style.width = `${width}px`; // The line is placed from the cell's own edge, so it moves in the
        // same frame the edge does.

        this.showColumnResizeGuide(th);
        return width;
      },
      commit: width => {
        const frozen = state.frozenWidths ?? {};
        clear();
        this.applyColumnResizeWidths(key, width, frozen);
      },
      end: () => {
        document.documentElement.classList.remove('sf-table-column-resizing');
        (0,_helpers_loaderDragState__WEBPACK_IMPORTED_MODULE_14__.setLoaderDragState)(false);
        this.suppressNextHeaderClick(); // The drag is over before the line goes: hidden while the
        // state still said «resizing», it stayed on the edge.

        clear();
        this.hideColumnResizeGuide();
      },
      // A double click on the edge is the fit to content (C158 (5));
      // «По умолчанию» in the head's menu is the width the column has
      // by itself (resetColumnWidth).
      reset: () => {
        clear();
        this.resetColumnWidth(key);
      }
    };
  } // The browser's memory of the widths, for a table that asks for it with
  // remember-widths: no host keeps its settings, so a reload lost them.
  // The widths are part of the table's view preference (SF.Preferences):
  // under preferences-key, or with remember-widths under the table's own key.


  get rememberedWidthsKey() {
    if (this.viewPreferenceKey) return this.viewPreferenceKey;
    if (!this.hasAttribute("remember-widths")) return "";
    return tablePreferenceKey(this.getTableSettingsKey() || this.id || globalThis.location?.pathname || "table");
  }

  readRememberedWidths() {
    const key = this.rememberedWidthsKey;
    if (!key) return {};
    const widths = preferences()?.read(key)?.widths;
    return widths && typeof widths === "object" ? widths : {};
  }

  writeTablePreference(key, patch) {
    if (!key) return;
    preferences()?.write(key, { ...(preferences()?.read(key) ?? {}),
      v: 1,
      ...patch
    });
  }

  storeRememberedWidths(widths = {}) {
    this.writeTablePreference(this.rememberedWidthsKey, {
      widths: { ...this.readRememberedWidths(),
        ...widths
      }
    });
  }

  forgetRememberedWidth(column) {
    const widths = this.readRememberedWidths();
    delete widths[column];
    this.writeTablePreference(this.rememberedWidthsKey, {
      widths
    });
  } // How this person arranged this table -- order, visibility, pinning,
  // widths (owner, 2026-10-14): kept under preferences-key (or the table's
  // table-settings-key when the host names one), read before the first
  // paint so the skeleton is already in that order, and written each time
  // the person changes it.


  get viewPreferenceKey() {
    const key = this.getAttribute("preferences-key") || this.getAttribute("table-settings-key") || "";
    return key ? tablePreferenceKey(key) : "";
  }

  applyTablePreference(value, {
    render = false
  } = {}) {
    const kept = value?.columnSettings;
    if (!kept || typeof kept !== "object") return false; // On the host's columns, not on what is drawn: a value that no longer
    // names a column returns it to the host's settings. Merged onto the
    // drawn state, a dropped key kept its old width or visibility on this
    // device until a reload (docs trial 5).

    const host = this.getTableData().columnSettings;
    const base = host && typeof host === "object" && !Array.isArray(host) ? host : {};
    const next = this.mergeColumnSettings(base, kept);
    if (render) this.setColumnSettings(next, "preferences", false);else this.state.columnSettings = next;
    return true;
  }

  connectTablePreference() {
    const key = this.viewPreferenceKey;
    if (key === this._preferenceKeyBound) return;
    this._preferenceUnsubscribe?.();
    this._preferenceKeyBound = key;
    this._preferenceUnsubscribe = null;
    this.applyTableView();
    if (!key) return;
    this.applyTablePreference(preferences()?.read(key)); // The host's value, when it differs from this browser's, arrives later.

    const own = preferences()?.subscribe(key, value => {
      if (value) this.applyTablePreference(value, {
        render: true
      }); // SF.Preferences.remove() from page code: back to the columns as the
      // host gave them, drawn now (docs trial 4: the table kept the
      // removed arrangement until a reload).
      else {
        const host = this.getTableData().columnSettings;
        this.setColumnSettings(host && typeof host === "object" && !Array.isArray(host) ? { ...host
        } : {}, "preferences", false);
      }
      this.applyTableView(); // The layout chosen on another tab, or by the host's copy.

      if (this.hasLayoutSwitch && this._renderedList !== undefined && this.isList !== this._renderedList) this.requestComponentUpdate("layout");
    });
    const general = preferences()?.subscribe(GENERAL_TABLE_PREFERENCE, () => this.applyTableView());

    this._preferenceUnsubscribe = () => {
      own?.();
      general?.();
    };
  } // How the table looks for this person (the gear's «Вид», owner
  // 2026-10-14): density, alternate rows, lines between columns, text on
  // one line. Their tables' preference (sf-view-table/*) lies under this table's.


  get tableView() {
    const key = this.viewPreferenceKey;
    const general = preferences()?.read(GENERAL_TABLE_PREFERENCE)?.view ?? {};
    const own = key ? preferences()?.read(key)?.view ?? {} : this._sessionView ?? {};
    return { ...TABLE_VIEW_DEFAULTS,
      ...general,
      ...own
    };
  } // The density a person chose in the gear's «Вид», or none.


  get storedViewDensity() {
    const key = this.viewPreferenceKey;
    const general = preferences()?.read(GENERAL_TABLE_PREFERENCE)?.view ?? {};
    const own = key ? preferences()?.read(key)?.view ?? {} : this._sessionView ?? {};
    const density = own.density ?? general.density; // A stored «Просторно» (before D4) reads as the nearest, «Обычная».

    if (density === "spacious") return "normal";
    return ["compact", "normal"].includes(density) ? density : null;
  } // The density of the area the table stands in (C22): the nearest
  // data-sf-density above it, across shadow roots; the table's own island
  // (below) is not read.


  get areaDensity() {
    let node = this.parentElement ?? this.getRootNode?.()?.host ?? null;

    while (node) {
      // The list's own island (D4: written on its sf-view) is not the area.
      const area = node.closest?.("[data-sf-density]:not([data-sf-view-density-island])");
      if (area) return area.getAttribute("data-sf-density") === "compact" ? "compact" : "normal";
      node = node.getRootNode?.()?.host ?? null;
    }

    return "normal";
  } // The density «Вид» shows: the person's choice, else the one in effect
  // (view round 5, LV-8, C22). A table on a compact page draws compact rows
  // and said «Обычно».


  get shownViewDensity() {
    return this.storedViewDensity ?? this.areaDensity;
  }

  applyTableView() {
    const view = this.tableView;

    const flag = (name, on) => on ? this.setAttribute(name, "") : this.removeAttribute(name); // The rows by the density shown. In a compact area «Компактно» is the
    // area's own; «Обычно» returns the table to the normal step, the C79
    // island (data-sf-density="normal" on the table, written and removed
    // by the table only); «Просторно» adds the rows' spacious step to it.
    // «Компактно» in a normal area is the island the other way round
    // (view round 12, VHF-8, owner remark via DEV msg-c31ccebd): the
    // Framework's compact density on the table, so the row's controls --
    // the box, the row menu «≡», the badges -- step down with the row. The
    // rows alone moved one rung while the «≡» (32 at size 1/2, 40 at 1)
    // held a body row at the normal height.
    // The density is the whole list's (owner decision D4, 2026-11-21): the
    // island stands on the sf-view the table is in -- its head, rows, cards
    // and page row -- and on the table, or on the table alone outside a
    // view. A host's own data-sf-density on either is left alone.


    const density = this.shownViewDensity;
    const compactArea = this.areaDensity === "compact";
    const island = compactArea ? density !== "compact" ? "normal" : null : density === "compact" ? "compact" : null;
    const list = this.closest?.("sf-view") ?? null;

    for (const holder of list ? [list, this] : [this]) {
      const ownIsland = holder.hasAttribute("data-sf-view-density-island");

      if (island && (ownIsland || !holder.hasAttribute("data-sf-density"))) {
        if (holder.getAttribute("data-sf-density") !== island) holder.setAttribute("data-sf-density", island);
        holder.setAttribute("data-sf-view-density-island", "");
      } else if (!island && ownIsland) {
        holder.removeAttribute("data-sf-density");
        holder.removeAttribute("data-sf-view-density-island");
      }
    } // A compact island still says compact rows: the Framework's density is
    // a desktop one (60rem), and below it the rows' own rung steps down.


    const rows = compactArea ? "normal" : density;
    if (rows === "normal") this.removeAttribute("data-sf-view-density");else this.setAttribute("data-sf-view-density", rows); // Zebra is the author's (C146 (4)): a person's stored choice is no
    // longer read.

    flag("data-sf-view-stripes", this.hasAttribute("stripes") && this.getAttribute("stripes") !== "false");
    flag("data-sf-view-lines", view.lines === true);
    flag("data-sf-view-single-line", view.singleLine === true); // «Текст в одну строку» is off unless the person turned it on (owner
    // decision D5, 2026-11-21): the name takes two lines, a long text
    // (a comment) its whole length; on, every cell is one line with «…».

    flag("data-sf-view-wrap", view.singleLine !== true);
    const page = this.getAttribute("vertical-scroll") === "page" && !this.isList;
    flag("data-sf-page-scroll", page);
    flag("data-sf-sticky-head", page && view.stickyHead !== false);
  } // The head held under the toolbar while what scrolls -- the page, or a
  // box around the table -- scrolls past it (page mode). Since view round
  // 13 (VHF-14) it is CSS: the head is sticky and the area clips sideways
  // instead of scrolling (so it is no scroll container the head would bind
  // to); the rail moves the table sideways (syncSideways). The head used to
  // be moved by a transform written in the frame after the scroll, so every
  // frame painted it one wheel step behind. Here only what the head sticks
  // under is read -- the table's own toolbar, under the list head of the
  // view around it (--sf-view--stuck-head) -- and whether it is stuck (the
  // line under it).


  syncStickyHead() {
    const table = this.refs.table?.value;
    const head = table?.tHead;
    if (!head) return;
    if (head.style.transform) head.style.transform = "";
    const held = this.hasAttribute("data-sf-sticky-head");
    const toolbar = held ? this.querySelector(":scope > .sf-table > .sf-table-toolbar") : null;
    const height = toolbar ? `${Math.round(toolbar.getBoundingClientRect().height)}px` : "";

    if (this.style.getPropertyValue("--sf-view-table--toolbar") !== height) {
      if (height) this.style.setProperty("--sf-view-table--toolbar", height);else this.style.removeProperty("--sf-view-table--toolbar");
    }

    const stuck = held && table.isConnected && head.getBoundingClientRect().top > table.getBoundingClientRect().top + 0.5;
    if (this.hasAttribute("data-sf-head-stuck") !== stuck) this.toggleAttribute("data-sf-head-stuck", stuck);
  } // Whether the area clips sideways and the rail moves the table (page mode
  // with the head held, VHF-14), rather than scrolling sideways itself.


  get clipsSideways() {
    return this.hasAttribute("data-sf-page-scroll") && this.hasAttribute("data-sf-sticky-head");
  } // How far the table is moved sideways: the area's own scroll, or in the
  // clipping area the rail's (negative in a right-to-left table, as the
  // browser reports a scroll there).


  get sidewaysOffset() {
    if (this.clipsSideways) return this._sideways ?? 0;
    return this.refs.scroll?.value?.scrollLeft ?? 0;
  } // The clipping area's sideways place, written as two lengths the table and
  // its pinned cells read (default.css): how far the table is moved, and how
  // far a cell pinned at the end has to come back from the table's end.


  syncSideways(left = this.refs.rail?.value?.scrollLeft ?? 0) {
    const scroll = this.refs.scroll?.value;
    const table = this.refs.table?.value;
    if (!scroll || !table) return;
    const rtl = getComputedStyle(this).direction === "rtl";
    const over = Math.max(0, Math.round(table.offsetWidth - scroll.clientWidth));
    const x = Math.round(Math.max(-over, Math.min(over, left)));
    this._sideways = x;

    const set = (name, value) => {
      if (scroll.style.getPropertyValue(name) !== value) scroll.style.setProperty(name, value);
    };

    set("--sf-view-table--x", `${x}px`);
    set("--sf-view-table--end", `${rtl ? -over : over}px`);
    if (Math.abs(x) > 0) scroll.setAttribute("data-sf-pin-scrolled", "");else scroll.removeAttribute("data-sf-pin-scrolled");
  } // The rail under the area is its sideways bar: as wide as what the area
  // scrolls, shown only when there is something to scroll, and each follows
  // the other. In the clipping area (VHF-14) the rail alone scrolls: it
  // moves the table, a sideways wheel or swipe over the rows moves the rail,
  // and a cell that takes the focus out of sight brings the rail to it.
  // One call of `work` in the next frame per name, however often it is asked
  // before then (VM-2): observers hand their layout writes over to it.


  _inNextFrame(name, work) {
    const queued = this._frameQueue ??= new Map();
    if (queued.has(name)) return;

    const next = globalThis.requestAnimationFrame ?? (fn => globalThis.setTimeout(fn, 16));

    queued.set(name, next(() => {
      queued.delete(name);
      if (this.isConnected) work();
    }));
  }

  syncRail() {
    const rail = this.refs.rail?.value;
    const scroll = this.refs.scroll?.value;
    if (!rail || !scroll) return;
    const clip = this.clipsSideways;
    const table = this.refs.table?.value;
    const width = clip && table ? table.offsetWidth : scroll.scrollWidth;
    const wide = width > scroll.clientWidth + 1;
    rail.hidden = !wide;
    const track = rail.firstElementChild;
    if (track) track.style.inlineSize = `${width}px`;

    if (rail._sfBound !== scroll) {
      rail._sfBound = scroll;
      let following = false;

      const follow = (from, to) => () => {
        if (following) return;
        following = true;
        to.scrollLeft = from.scrollLeft;
        following = false;
      };

      scroll.addEventListener("scroll", follow(scroll, rail), {
        passive: true
      });
      rail.addEventListener("scroll", () => {
        if (this.clipsSideways) this.syncSideways(rail.scrollLeft);else follow(rail, scroll)();
      }, {
        passive: true
      });
      scroll.addEventListener("wheel", event => {
        if (!this.clipsSideways || rail.hidden) return; // Sideways only: a mostly vertical move is the page's.

        const dx = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
        if (!dx || !event.shiftKey && Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;
        const before = rail.scrollLeft;
        rail.scrollLeft += dx * (event.deltaMode === 1 ? 16 : 1);
        if (rail.scrollLeft !== before) event.preventDefault();
      }, {
        passive: false
      });
      scroll.addEventListener("focusin", event => {
        if (!this.clipsSideways || rail.hidden) return;
        const cell = event.target?.closest?.("td, th");
        if (!cell || cell.hasAttribute("data-sf-pinned")) return;
        const area = scroll.getBoundingClientRect();
        const box = cell.getBoundingClientRect();
        const pinned = [...(cell.parentElement?.children ?? [])].filter(one => one.hasAttribute("data-sf-pinned")).reduce((sum, one) => sum + one.getBoundingClientRect().width, 0);
        if (box.left < area.left + pinned) rail.scrollLeft -= area.left + pinned - box.left;else if (box.right > area.right) rail.scrollLeft += box.right - area.right;
      }); // The columns take their widths after a render (content widths,
      // late fonts): the rail follows the table's size, not the render.

      this._railObserver?.disconnect();

      if (typeof ResizeObserver !== "undefined") {
        this._railObserver = new ResizeObserver(() => this._inNextFrame("rail", () => this.syncRail()));

        this._railObserver.observe(scroll);

        if (this.refs.table?.value) this._railObserver.observe(this.refs.table.value);
      }
    }

    if (clip) {
      if (!wide && rail.scrollLeft) rail.scrollLeft = 0;
      this.syncSideways(wide ? rail.scrollLeft : 0);
    } else {
      if (this._sideways) {
        this._sideways = 0;
        scroll.style.removeProperty("--sf-view-table--x");
        scroll.style.removeProperty("--sf-view-table--end");
      }

      if (wide) rail.scrollLeft = scroll.scrollLeft;
    }
  }

  bindPageScroll() {
    if (this._pageScrollAbort) return;
    this._pageScrollAbort = new AbortController();
    const {
      signal
    } = this._pageScrollAbort;

    const again = () => {
      if (this._pageScrollFrame) return;
      this._pageScrollFrame = requestAnimationFrame(() => {
        this._pageScrollFrame = 0;
        if (this.isConnected) this.syncStickyHead();
      });
    };

    document.addEventListener("scroll", again, {
      capture: true,
      passive: true,
      signal
    });
    globalThis.addEventListener("resize", () => {
      again();
      this.syncRail();
    }, {
      passive: true,
      signal
    });
  }

  unbindPageScroll() {
    this._railObserver?.disconnect();
    this._railObserver = null;
    const rail = this.refs.rail?.value;
    if (rail) rail._sfBound = null;
    this._pageScrollAbort?.abort();
    this._pageScrollAbort = null;
    cancelAnimationFrame(this._pageScrollFrame ?? 0);
    this._pageScrollFrame = 0;
  } // One option changed. A person's look of a table holds in all their
  // tables (owner decision C408): it is written to the person's tables and
  // taken off this one, so this one follows them. everywhere: false keeps
  // it for this table alone (a host's own choice; no row offers it).


  setTableView(patch = {}, {
    everywhere = true
  } = {}) {
    const key = this.viewPreferenceKey;

    if (everywhere || !key) {
      if (everywhere) {
        const general = preferences()?.read(GENERAL_TABLE_PREFERENCE) ?? {};
        preferences()?.write(GENERAL_TABLE_PREFERENCE, { ...general,
          v: 1,
          view: { ...(general.view ?? {}),
            ...patch
          }
        });
      }

      if (key) {
        const own = { ...(preferences()?.read(key)?.view ?? {})
        };

        for (const field of Object.keys(patch)) delete own[field];

        this.writeTablePreference(key, {
          view: own
        });
      } else {
        // A table with no key keeps the change for this session too,
        // so it holds where no preferences store is reachable.
        this._sessionView = { ...(this._sessionView ?? {}),
          ...patch
        };
      }
    } else {
      this.writeTablePreference(key, {
        view: { ...(preferences()?.read(key)?.view ?? {}),
          ...patch
        }
      });
    }

    this.applyTableView();
    this.requestComponentUpdate("table-view");
    this.emitTableEvent("view-change", Object.freeze({
      view: this.tableView,
      everywhere
    }));
    return this;
  }

  resetTableView() {
    const key = this.viewPreferenceKey;
    if (key) this.writeTablePreference(key, {
      view: {}
    });
    this._sessionView = null;
    this.applyTableView();
    this.requestComponentUpdate("table-view");
    return this;
  } // The remembered widths of the columns the table now has, as settings.


  restoreRememberedWidths() {
    const widths = this.readRememberedWidths();
    const keys = new Set((this.getColumns?.() ?? []).map(column => column?.key));
    const patch = Object.fromEntries(Object.entries(widths).filter(([column, width]) => keys.has(column) && typeof width === "string").map(([column, width]) => [column, {
      width
    }]));
    if (Object.keys(patch).length) this.patchColumnSettingsBatch(patch, "column-widths-restore");
  }

  resetColumnWidth(key) {
    if (!key) return this;
    this.forgetRememberedWidth(key);
    return this.patchColumnSettingsBatch({
      [key]: {
        width: null
      }
    }, 'column-resize-reset');
  } // A heading is dragged with the Framework's sortable in its column mode
  // (SF.Sortable.attach, owner 2026-10-13): the column is dimmed in every row,
  // an outline the width of the column and the height of the table stands
  // where it will go, a pinned column moves among pinned ones and a loose one
  // among loose ones, and the click a drop ends with does not sort. The
  // table's own drag -- nine hundred lines moving cells between lit's part
  // markers and putting them back -- is gone. Keyboard reordering is the
  // column settings list.


  get columnDragActive() {
    return document.documentElement.hasAttribute('data-sf-sortable-active');
  }

  bindColumnDragEvent() {
    const table = this.refs.table?.value;
    const row = table?.tHead?.rows?.[0];
    if (!row || this._headerSortableRow === row) return;
    const attach = globalThis.SF?.Sortable?.attach;

    if (typeof attach !== 'function') {
      // sf-sortable is a lazy relation: fetched when first needed.
      globalThis.SF?.Loader?.ensure?.(['sf-sortable'], {
        timeout: Infinity
      }).then(({
        missing
      }) => {
        if (!missing.length && this.isConnected) this.bindColumnDragEvent();
      });
      return;
    }

    this._headerSortableDetach?.();
    this._headerSortableRow = row;
    this._headerSortableDetach = attach(row, {
      items: 'th[data-key]',
      extent: table,
      // A column moving shows the line it will stand at, between two
      // columns (owner, 2026-10-14): the outline of the place it would
      // take read as a column already there.
      preview: 'line',
      label: this.text('settingsColumnLabel'),
      groupOf: th => this.headerColumnGroup(th.dataset.key),
      canStart: (event, th) => !this._columnResizeState && !this.getColumnResizeHandle(event.target) && ['pinned', 'loose'].includes(this.headerColumnGroup(th.dataset.key)),
      cellsOf: th => [...table.rows].map(tr => tr.cells[th.cellIndex]).filter(Boolean),
      onIntent: detail => this.onHeaderColumnIntent(detail)
    });
  }

  unbindColumnDragEvent() {
    this._headerSortableDetach?.();
    this._headerSortableDetach = null;
    this._headerSortableRow = null;
  } // Which group a heading moves in: the system columns and a column marked
  // draggable: false do not move; a pinned column moves among pinned ones.


  headerColumnGroup(key) {
    if (this.getSystemColumns().some(column => String(column.key) === key)) return 'system';
    const column = this.getColumns().find(item => String(item.key) === key);
    if (!column || column.system || column.draggable === false) return 'fixed';
    return this.isColumnPinned(column) ? 'pinned' : 'loose';
  } // The order a heading drop asks for: the column at its place among the
  // shown columns of its group, the others where they are.


  onHeaderColumnIntent({
    item,
    index,
    group
  }) {
    const table = this.refs.table?.value;
    const shown = [...(table?.tHead?.rows?.[0]?.cells ?? [])].map(cell => cell.dataset?.key).filter(key => key && ['pinned', 'loose', 'fixed'].includes(this.headerColumnGroup(key)));
    const peers = shown.filter(key => key !== item && this.headerColumnGroup(key) === group);
    const rest = shown.filter(key => key !== item);
    const before = peers[index];
    const after = peers[index - 1];
    const at = before !== undefined ? rest.indexOf(before) : after !== undefined ? rest.indexOf(after) + 1 : rest.length;
    rest.splice(at, 0, item);
    if (rest.join('|') === shown.join('|')) return this;
    return this.applyColumnOrder(rest, {});
  }

  getColumnResizeHandle(target) {
    if (!(target instanceof Element)) {
      return null;
    } // The handle is found by the attribute it carries, not by a prefix of its
    // id. The id is built from the instance, so it never began with
    // `column_resizer_`: pointerdown on the handle was not recognised as a
    // resize and fell through to the column-move handler, which is why
    // dragging the edge moved the column instead of changing its width.


    return target.closest('[data-sf-column-resizer]');
  }

  parseColumnSize(value, fallback = null) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim();

      if (/^-?\d+(\.\d+)?px$/.test(normalized)) {
        return parseFloat(normalized);
      }
    }

    return fallback;
  }

  resolveCssLength(value, fallback = 0) {
    const normalized = String(value || '').trim();
    const match = normalized.match(/^(-?\d+(?:\.\d+)?)(px|rem|em)$/);

    if (!match) {
      return fallback;
    }

    const amount = Number(match[1]);
    const unit = match[2];

    if (unit === 'px') {
      return amount;
    }

    const reference = unit === 'rem' ? document.documentElement : this;
    const fontSize = parseFloat(getComputedStyle(reference).fontSize);
    return Number.isFinite(fontSize) ? amount * fontSize : fallback;
  }

  getColumnResizeLimits(column = {}, fallbackWidth = 0) {
    const semanticMinWidth = this.resolveCssLength(getComputedStyle(this).getPropertyValue('--sf-c4'), fallbackWidth);
    const minWidth = this.parseColumnSize(column.minWidth, null) ?? semanticMinWidth;
    const maxWidth = this.parseColumnSize(column.maxWidth, Infinity);
    return {
      minWidth,
      maxWidth: Math.max(maxWidth, minWidth)
    };
  }

  hasColumnSize(column = {}) {
    return [column.colWidth, column.width, column.size].some(value => value !== null && typeof value !== 'undefined' && String(value).trim() !== '');
  }

  escapeColumnKey(key) {
    const value = String(key || '');

    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(value);
    }

    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  freezeColumnsWidthForResize(table) {
    const frozenWidths = {};
    const columns = this.getColumns();
    columns.forEach(column => {
      if (!column?.key) {
        return;
      }

      const key = String(column.key);
      const escapedKey = this.escapeColumnKey(key);
      const th = table?.querySelector(`th[data-key="${escapedKey}"]`);
      const col = table?.querySelector(`col[data-key="${escapedKey}"]`);
      const width = th?.getBoundingClientRect?.().width || 0;

      if (!width) {
        return;
      }

      const nextWidth = `${Math.round(width)}px`;

      if (col) {
        col.style.width = nextWidth;
      }

      if (!column.system && !this.hasColumnSize(column)) {
        frozenWidths[key] = nextWidth;
      }
    });
    return frozenWidths;
  }

  applyColumnResizeWidths(key, width, frozenWidths = {}) {
    if (!key) {
      return this;
    }

    const nextWidths = { ...(frozenWidths || {}),
      [key]: `${Math.round(width)}px`
    };
    this.storeRememberedWidths(nextWidths);
    const settingsPatch = Object.fromEntries(Object.entries(nextWidths).map(([columnKey, columnWidth]) => [columnKey, {
      width: columnWidth
    }]));
    return this.patchColumnSettingsBatch(settingsPatch, 'column-resize');
  }

  reorderColumnDomByKeys(table, userKeys = []) {
    if (!table || !Array.isArray(userKeys) || !userKeys.length) {
      return;
    }

    const moveKeyedChildren = (container, selector) => {
      if (!container) {
        return;
      }

      const userKeySet = new Set(userKeys);
      let insertAfter = null;

      for (const child of Array.from(container.children || [])) {
        const childKey = child?.dataset?.key;

        if (childKey && userKeySet.has(childKey)) {
          break;
        }

        if (childKey) {
          insertAfter = child;
        }
      }

      userKeys.forEach(key => {
        const escapedKey = this.escapeColumnKey(key);
        const child = container.querySelector(`${selector}[data-key="${escapedKey}"]`);

        if (child) {
          container.insertBefore(child, insertAfter?.nextSibling || container.firstChild);
          insertAfter = child;
        }
      });
    };

    moveKeyedChildren(table.querySelector('colgroup'), 'col');
    moveKeyedChildren(table.tHead?.rows?.[0], 'th');
    Array.from(table.tBodies || []).forEach(tbody => {
      Array.from(tbody.rows || []).forEach(row => {
        moveKeyedChildren(row, 'td');
      });
    });
  }

  applyColumnOrder(userKeys = [], frozenWidths = {}) {
    // Moving a column rearranges the columns the person can see, among the
    // places those columns already occupy. Numbering every draggable
    // column from ten upward instead renumbered the hidden ones too, and a
    // hidden column has no place on screen to be numbered from, so they
    // came out ahead of everything: a consumer dropped one column one place
    // to the left and found its nine visible columns pushed behind seven it
    // had never shown. Hidden columns keep their order, so they keep their
    // place between the visible ones when they are shown again.
    if (!Array.isArray(userKeys) || !userKeys.length) {
      return this;
    }

    const settingsPatch = {};
    const slots = this.getColumnOrderSlots(userKeys);
    userKeys.forEach((key, index) => {
      settingsPatch[key] = {
        order: slots[index]
      };

      if (frozenWidths?.[key]) {
        settingsPatch[key].width = frozenWidths[key];
      }
    });
    return this.patchColumnSettingsBatch(settingsPatch, 'column-drag');
  } // The places the moved columns already occupy, in order. A column whose
  // order nobody has ever set takes the place its position gives it, so a
  // first move on an untouched layout still numbers in tens.


  getColumnOrderSlots(userKeys = []) {
    const all = (this.getTableData().columns || []).filter(column => column?.key && !column.system);

    const effective = (column, index) => {
      const setting = this.getColumnSetting(column.key) || {};
      const value = setting.order ?? column.order;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : (index + 1) * 10;
    };

    const current = new Map(all.map((column, index) => [String(column.key), effective(column, index)]));
    const taken = userKeys.map(key => current.get(String(key))).filter(value => Number.isFinite(value)).sort((left, right) => left - right); // Two columns can share a place when a host sends the same order twice.
    // Then the places are rebuilt from the positions, which cannot collide.

    const distinct = new Set(taken);

    if (taken.length !== userKeys.length || distinct.size !== taken.length) {
      return userKeys.map((_, index) => (index + 1) * 10);
    }

    return taken;
  }

  setColumnResizeClasses(th, delta = 0) {
    if (!th) return;
    th.classList.add('is-resizing');
    th.classList.toggle('is-resizing-forward', delta >= 0);
    th.classList.toggle('is-resizing-backward', delta < 0); // The line follows the edge while it is dragged, not only on hover.

    this.showColumnResizeGuide(th); // Resizing a pinned column moves every pinned column after it.

    this.measurePinnedColumns();
  }

  clearColumnResizeClasses(th) {
    if (!th) return;
    th.classList.remove('is-resizing', 'is-resizing-forward', 'is-resizing-backward');
    this.hideColumnResizeGuide();
    this.measurePinnedColumns();
  } // An open window is a surface of the document's one layer stack
  // (standard 1.3.8 §19): the stack's one listener hands it a press outside
  // and Escape while it is the top layer, and it is drawn at the stack's
  // height. The table bound a document click and keydown of its own (reuse
  // audit 2026-11-02, findings 1 and 3), which acted whatever lay above the
  // window and closed it together with a drawer or a record panel under it.
  // The layer is the portal the windows are drawn in, not the table: a press
  // anywhere else in the table is outside the window.


  bindContextEvent() {
    if (this._contextEventBound) {
      return;
    }

    const portal = this.getPortalContainer();
    this._contextLayerOwner = portal;
    (0,_core_js_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_16__.holdOpenSurfaceMark)(portal, true, {
      root: () => portal,
      onOutsidePress: event => this.contextOutsidePress(event),
      onEscape: event => this.contextKeyEvent(event)
    });
    this._contextEventBound = true;
  }

  unbindContextEvent() {
    if (!this._contextEventBound) {
      return;
    }

    (0,_core_js_open_surface_mark_js__WEBPACK_IMPORTED_MODULE_16__.holdOpenSurfaceMark)(this._contextLayerOwner, false);
    this._contextLayerOwner = null;
    this._contextEventBound = false;
  } // The window's place on the stack's z-index scale; the Framework's old
  // fixed step until it is on the stack.
  // The kind of window a menu name opens (C32, owner 2026-11-09): the
  // table's own windows are not menus -- the menus (create, sort, row and
  // toolbar actions) are sf-menu-context's own rows and take its widths.
  // The filter with its saved views and the column settings are panels:
  // one width, --sf-popup-panel-width (20rem; 18rem compact), or the
  // trigger's when that is wider. Saving a template and a chip's own
  // filter are forms: --sf-popup-form-width (20rem; 18rem compact). A
  // panel laid out in several columns is as wide as they are. Every window
  // stays inside the room it has (--sf-table-context-menu--available-inline-size).


  contextWindowClass(menu, columns = 1) {
    const kind = {
      'filter-settings': 'panel',
      'table-settings': 'panel',
      'filter-favorites': 'form',
      'tag-settings': 'form'
    }[menu] ?? 'panel';
    return `sf-table-context-menu--${kind}${kind === 'panel' && Number(columns) > 1 ? ' sf-table-context-menu--columns' : ''}`;
  } // The trigger's width, for a panel that is at least as wide as the button
  // that opened it.


  contextTriggerInlineSize(data = {}) {
    const width = data.anchor?.getBoundingClientRect?.().width;
    return Number.isFinite(width) ? Math.ceil(width) : 0;
  }

  contextMenuZIndex() {
    const zIndex = this._contextLayerOwner ? (0,_core_js_layer_stack_js__WEBPACK_IMPORTED_MODULE_17__.layerZIndex)(this._contextLayerOwner) : '';
    return zIndex === '' ? 'var(--sf-z-index-9)' : String(zIndex);
  } // A press on the control that opened the window is left to that
  // control's own click, which reopens or closes it as it always did: closed
  // here first, the gear's second press would open the window again.


  contextOutsidePress(event) {
    const opener = this.contextTarget;

    if (opener instanceof Element && (event.composedPath?.() || []).includes(opener)) {
      return;
    }

    this.contextEvent(event);
  } // Answers true when it took the press; the stack then stops it.


  contextKeyEvent(event) {
    if (event.key !== 'Escape' || !this.state.contextMenu?.open) {
      return false;
    }

    this.closeContextMenu(true);
    return true;
  } // The table's windows -- filter, field popovers, settings, menus -- are
  // drawn in the page's top layer from inside the table, not moved to the end
  // of the body. Moved out, a window was not clipped by the table's scroll
  // box, but it lost everything the table gives what it holds: its size (the
  // filter opened a step larger than a table at 1/2), its language, its theme,
  // the variables its containers set (owner, 2026-10-13). In the top layer it
  // stays where it belongs and is still drawn above everything, unclipped.
  //
  // The container is a form of its own, before the table's rendered content:
  // inside a page's form a filter field would be submitted with it and Enter
  // in one would send the page's form; and before the content, so a re-render
  // of the table never takes it away. Its fields' own change and input stop
  // at it: they are the table's business, not the page's.


  getPortalContainer() {
    if (this._portalContainer?.isConnected) {
      return this._portalContainer;
    }

    const portal = document.createElement("form");
    portal.className = "sf-table-portal";
    portal.noValidate = true;
    portal.dataset.tableSettingsKey = this.getTableSettingsKey();
    portal.dataset.sfInstance = this.getInstanceId();
    if (typeof portal.showPopover === "function") portal.setAttribute("popover", "manual");
    portal.addEventListener("submit", event => event.preventDefault());

    for (const type of ["change", "input"]) {
      portal.addEventListener(type, event => event.stopPropagation());
    }

    this.insertBefore(portal, this.firstChild); // What the windows draw here is read by the Loader as the page is
    // (core.runtime 1.19.0): no lazy element is asked for by name.

    globalThis.SF?.Loader?.watch?.(portal);
    this._portalContainer = portal;
    return portal;
  } // The column window's host (VT-12): no box of its own, in this element
  // so the panel reads the table's density and the Loader sees it.


  getSettingsHost() {
    if (this._settingsHost?.isConnected) return this._settingsHost;
    const host = document.createElement("div");
    host.className = "sf-table-settings-host";
    host.dataset.sfInstance = this.getInstanceId();

    for (const type of ["change", "input"]) host.addEventListener(type, event => event.stopPropagation());

    this.insertBefore(host, this.firstChild);
    globalThis.SF?.Loader?.watch?.(host);
    this._settingsHost = host;
    return host;
  } // The top layer is entered while a window is open and left when none is.


  showPortal() {
    const portal = this._portalContainer;
    if (!portal?.isConnected || typeof portal.showPopover !== "function") return;
    if (!portal.matches(":popover-open")) portal.showPopover();
  }

  hidePortal() {
    const portal = this._portalContainer;
    if (!portal?.isConnected || typeof portal.hidePopover !== "function") return;
    if (portal.matches(":popover-open")) portal.hidePopover();
  }

  getVisualViewportRect() {
    const viewport = window.visualViewport;
    return {
      left: viewport?.offsetLeft || 0,
      top: viewport?.offsetTop || 0,
      right: (viewport?.offsetLeft || 0) + (viewport?.width || window.innerWidth),
      bottom: (viewport?.offsetTop || 0) + (viewport?.height || window.innerHeight)
    };
  }

  clampContextMenusToViewport() {
    const portal = this._portalContainer;

    if (!portal?.isConnected) {
      return;
    }

    const viewport = this.getVisualViewportRect();
    const rootStyle = getComputedStyle(document.documentElement);
    const inset = parseFloat(rootStyle.getPropertyValue('--sf-space-1/3')) || 0;
    const anchored = new Set();
    portal.querySelectorAll('sf-menu-context').forEach(menu => {
      if (this.anchorContextMenu(menu, viewport, inset)) {
        anchored.add(menu);
        return;
      }

      const availableInlineSize = Math.max(0, viewport.right - viewport.left - inset * 2);
      const availableBlockSize = Math.max(0, viewport.bottom - viewport.top - inset * 2); // Both names: the stylesheet reads the second one, and only the
      // first was written here, so a menu placed by click coordinates
      // never received the cap this line means to give it.

      menu.style.setProperty('--sf-table-context-menu--available-inline-size', `${availableInlineSize}px`);
      menu.style.setProperty('--sf-context-menu-available-inline-size', `${availableInlineSize}px`);
      menu.style.setProperty('--sf-context-menu-available-block-size', `${availableBlockSize}px`);
      menu.style.translate = '';
      const surface = menu.querySelector(':scope > .sf-context-menu') || menu;
      const rect = surface.getBoundingClientRect();
      let offsetX = 0;
      let offsetY = 0;

      if (rect.left < viewport.left + inset) {
        offsetX = viewport.left + inset - rect.left;
      } else if (rect.right > viewport.right - inset) {
        offsetX = viewport.right - inset - rect.right;
      }

      if (rect.top < viewport.top + inset) {
        offsetY = viewport.top + inset - rect.top;
      } else if (rect.bottom > viewport.bottom - inset) {
        offsetY = viewport.bottom - inset - rect.bottom;
      }

      if (offsetX || offsetY) {
        menu.style.translate = `${offsetX}px ${offsetY}px`;
      }
    });

    for (const [menu, entry] of this._contextPositions || []) {
      if (!anchored.has(menu)) {
        entry.controller.stop();

        this._contextPositions.delete(menu);
      }
    }
  } // Placement of an open menu relative to the element it was opened from:
  // menus with a tail (row actions, template actions) open beside it, the
  // others below it. null keeps the static click-coordinate placement.
  // Cells re-render their controls, so an opener can be replaced while its
  // menu is open. Remember where it sits (row cell, header, toolbar id) to
  // find its replacement.


  describeContextAnchor(anchor) {
    if (!(anchor instanceof Element)) return null;
    const host = anchor.closest('[data-item], th[data-key], [id]');
    if (!host || !this.contains(host)) return null;
    const selector = host.dataset.item !== undefined ? `[data-item="${this.escapeColumnKey(host.dataset.item)}"]` : host.matches('th[data-key]') ? `th[data-key="${this.escapeColumnKey(host.dataset.key)}"]` : `[id="${this.escapeColumnKey(host.id)}"]`;
    const tag = anchor.tagName.toLowerCase();
    return {
      selector,
      tag,
      index: host === anchor ? -1 : Array.from(host.querySelectorAll(tag)).indexOf(anchor)
    };
  }

  resolveContextAnchor(data) {
    if (data?.anchor instanceof Element && data.anchor.isConnected) return data.anchor;
    const ref = data?.anchorRef;
    const host = ref ? this.querySelector(ref.selector) : null;
    const anchor = host && (ref.index < 0 ? host : host.querySelectorAll(ref.tag)[ref.index]);
    if (!anchor) return null;
    data.anchor = anchor;
    return anchor;
  } // Menus opened from a control at the end of a row align to that control's
  // end edge, so they open under the button instead of hanging past it over
  // the next column. The consumer measured a menu whose left edge matched the
  // button's left and whose right edge stood 34 to 124px beyond it.


  getContextMenuPlacement(menu) {
    const data = this.state.contextMenu;
    const anchor = this.resolveContextAnchor(data);
    if (!anchor) return null;
    const position = String(data.position || (data.type === 'left' ? 'left' : ''));
    const family = /^(left|right)(-top|-bottom)?$/.exec(position);

    if (!family) {
      return {
        anchor,
        side: 'block-end',
        align: 'start',
        tail: null
      };
    }

    const suffix = family[2] || '';
    return {
      anchor,
      side: family[1] === 'left' ? 'inline-end' : 'inline-start',
      align: suffix === '-top' ? 'start' : suffix === '-bottom' ? 'end' : 'center',
      tail: suffix
    };
  } // Shared Framework geometry (SF.Position): the menu flips when its side
  // does not fit, shifts inside the viewport and follows its opener while
  // the page scrolls. Sizes are written to the rendered surface, not the
  // boxless host, so they never re-render the menu over this placement.


  anchorContextMenu(menu, viewport, inset) {
    const placement = this.getContextMenuPlacement(menu);
    if (!placement) return false;
    const surface = menu.querySelector(':scope > .sf-context-menu');
    if (!surface) return false;
    this._contextPositions = this._contextPositions || new Map();

    const current = this._contextPositions.get(menu); // SF.Position writes an inline max-width from the free space, which
    // would override the menu's stylesheet cap; keep that cap in the width.
    // A cap in pixels only: since component.context-menu's F-2 (pair
    // ui-b654460cad2a) the menu's box says max-inline-size: 100%, which
    // getComputedStyle gives back as "100%", and parseFloat read it as
    // 100px -- a menu near the window's edge was 100px wide and its rows
    // stood past its surface (simai/ui-pro df0604f).


    const cssMax = getComputedStyle(surface).maxWidth;
    const cssCap = current?.cssCap ?? (/^\d+(?:\.\d+)?px$/u.test(cssMax) ? parseFloat(cssMax) : Infinity);
    const inlineSize = `${Math.max(0, Math.min(viewport.right - viewport.left - inset * 2, cssCap))}px`;
    surface.style.setProperty('--sf-table-context-menu--available-inline-size', inlineSize);
    surface.style.setProperty('--sf-context-menu-available-inline-size', inlineSize);
    const key = `${placement.side}|${placement.align}`;

    if (current && current.anchor === placement.anchor && current.surface === surface && current.key === key) {
      current.controller.update();
      return true;
    }

    current?.controller.stop();
    surface.style.transform = 'none';
    surface.style.translate = 'none';
    surface.style.setProperty('--sf-context-menu-available-block-size', `${Math.max(0, viewport.bottom - viewport.top - inset * 2)}px`);
    const Position = positioning();
    const gap = placement.tail === null ? Position.resolveLength('calc(var(--sf-focus-outline-width) * 2)', surface) : Position.resolveLength('var(--sf-context-menu-tail-corner-offset)', surface);
    const anchorBox = placement.anchor.getBoundingClientRect();
    const controller = Position.anchor(placement.anchor, surface, {
      side: placement.side,
      align: placement.align,
      offset: gap,
      alignmentOffset: placement.align === 'center' || placement.tail === null ? 0 : Math.max(0, anchorBox.height / 2 - gap),
      padding: inset,
      fitHeight: false,
      onPosition: ({
        side
      }) => {
        const box = placement.anchor.getBoundingClientRect();
        const view = this.getVisualViewportRect();
        const blockSize = side === 'block-end' ? view.bottom - inset - box.bottom - gap : side === 'block-start' ? box.top - gap - inset - view.top : view.bottom - view.top - inset * 2;
        const value = `${Math.max(0, Math.floor(blockSize))}px`;

        if (surface.style.getPropertyValue('--sf-context-menu-available-block-size') !== value) {
          surface.style.setProperty('--sf-context-menu-available-block-size', value);
        }

        if (placement.tail !== null) {
          const next = `${side === 'inline-end' ? 'left' : 'right'}${placement.tail}`;
          if (menu.getAttribute('position') !== next) menu.setAttribute('position', next);
        }
      }
    });

    this._contextPositions.set(menu, {
      controller,
      anchor: placement.anchor,
      surface,
      key,
      cssCap
    }); // The first placement is measured before the webfont has arrived, and
    // the cap written then is the cap of a narrower menu. The positioner
    // watches the box, but a font swap is cheap to wait for by name.


    document.fonts?.ready?.then(() => {
      if (this._contextPositions?.get(menu)?.controller === controller) controller.update();
    }).catch(() => {});
    return true;
  }

  stopContextMenuPositions() {
    for (const entry of this._contextPositions?.values() || []) entry.controller.stop();

    this._contextPositions?.clear();
  }

  contextViewportEvent() {
    requestAnimationFrame(() => this.clampContextMenusToViewport());
  }

  bindContextViewport() {
    if (this._contextViewportBound) {
      return;
    }

    window.addEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.addEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.addEventListener('scroll', this.contextViewportEvent);
    this._contextViewportBound = true;
  }

  unbindContextViewport() {
    if (!this._contextViewportBound) {
      return;
    }

    window.removeEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.removeEventListener('resize', this.contextViewportEvent);
    window.visualViewport?.removeEventListener('scroll', this.contextViewportEvent);
    this._contextViewportBound = false;
  }

  openContextMenu(event, opts = {}) {
    // The row's menu is the one standard menu bound to the rows (CM-8,
    // C164 (2)); the table no longer draws a second one of its own.
    if (opts.menu === "row-settings" || !opts.menu && opts.type === "left" && opts.row) {
      this.closeContextMenu(false);
      return this.openRowMenu(event, opts.row ?? {}, {
        group: Array.isArray(opts.action?.members) ? opts.action : null,
        items: Array.isArray(opts.items) ? opts.items : null
      });
    } // The action menus are SF.menu.open's: no window of the table's own.


    if (["create", "list-sort", "toolbar-actions"].includes(opts.menu)) {
      this.closeContextMenu(false);
      const opener = event.currentTarget instanceof Element ? event.currentTarget : event.target instanceof Element ? event.target : null;
      if (!opener) return;
      event.preventDefault?.();
      event.stopPropagation?.();
      return this.openActionMenu(opts.menu, this.resolveBoxedAnchor(event, opener));
    }

    this.closeContextMenu(false);
    this.contextTarget?.classList.remove("active");
    const target = event.currentTarget instanceof Element ? event.currentTarget : event.target instanceof Element ? event.target : null;

    if (!target) {
      return;
    } // Custom-element hosts use display:contents and have no positioning box.
    // Anchor to the native control on the event path within this opener.


    const nativeTarget = (event.composedPath?.() || []).filter(node => node instanceof Element).map(node => node.closest?.('button, input, select, textarea, a[href], [role="button"]')).find(node => node && (node === target || target.contains(node))); // Without a native control (for example a clicked sf-tag), anchor to the
    // first rendered box inside the opener instead of its boxless host.

    const hasBox = node => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0;
    };

    const boxedTarget = nativeTarget || hasBox(target) ? target : Array.from((target.shadowRoot || target).querySelectorAll?.('*') || []).find(hasBox) || target;
    this.contextTarget = nativeTarget || boxedTarget;
    this.contextTarget.classList.add("active"); // A chip opens its menu from the label button but anchors to the chip.

    let anchor = opts.anchorSelector && this.contextTarget.closest?.(opts.anchorSelector) || this.contextTarget;
    let pos = anchor.getBoundingClientRect();
    event.preventDefault();
    event.stopPropagation();
    let data = {
      open: true,
      id: this.contextTarget,
      ...opts
    };
    let tempData = {};

    switch (opts.type) {
      case 'left':
        tempData = {
          x: pos.left + pos.width,
          y: pos.y + pos.height / 2
        };
        break;

      case 'bottom':
        {
          let parent = null;

          if (opts.parent) {
            parent = (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_13__.getParent)(event.target);
            pos = parent.getBoundingClientRect();
            anchor = parent;
          }

          tempData = {
            x: pos.left,
            y: pos.y + pos.height
          };
          break;
        }

      default:
        tempData = {
          x: pos.left,
          y: pos.y + pos.height
        };
    }

    data = { ...data,
      ...tempData,
      anchor,
      anchorRef: this.describeContextAnchor(anchor)
    }; // What «Сбросить» returns to in the column settings window: the settings
    // as they stood when it was opened. Everything in that window applies on
    // the spot now, so without this there is nothing to go back to.

    if (data.menu === 'table-settings') {
      this._columnSettingsOnOpen = JSON.parse(JSON.stringify(this.getColumnSettings() || {}));
    }

    this.set({
      contextMenu: { ...data
      }
    });
  } // The element to anchor to: the native control the event passed through,
  // else the first box inside the opener, else the opener itself. A Framework
  // control's host element is display:contents and has no box of its own.


  resolveBoxedAnchor(event, target) {
    if (!(target instanceof Element)) return target;

    const hasBox = node => {
      const rect = node?.getBoundingClientRect?.();
      return Boolean(rect) && (rect.width > 0 || rect.height > 0);
    };

    const native = (event?.composedPath?.() || []).filter(node => node instanceof Element).map(node => node.closest?.('button, input, select, textarea, a[href], [role="button"]')).find(node => node && (node === target || target.contains(node)));
    if (native && hasBox(native)) return native;
    if (hasBox(target)) return target;
    const inside = Array.from((target.shadowRoot || target).querySelectorAll?.('*') || []).find(hasBox);
    return inside || target;
  } // A context menu renders Framework elements, and a page may open one before
  // their modules have arrived -- the consumer saw a template row with its
  // handle and its menu but no radio and no name, and the window's tabs
  // rendering as one list, because sf-radio and sf-tabs were not upgraded yet.
  // Nothing redrew when they were. This asks once per element and redraws when
  // it is defined; an element already defined costs nothing.


  redrawWhenComponentsUpgrade(root = this) {
    if (!root?.querySelectorAll) return this;
    this._awaitedComponents = this._awaitedComponents || new Set();
    const names = new Set(Array.from(root.querySelectorAll('*')).map(node => node.tagName.toLowerCase()).filter(name => name.includes('-') && !customElements.get(name)));

    for (const name of names) {
      if (this._awaitedComponents.has(name)) continue;

      this._awaitedComponents.add(name);

      customElements.whenDefined(name).then(() => {
        this.requestComponentUpdate('component-upgrade');
      }).catch(() => {});
    }

    return this;
  } // A saved view's «⋯» opens the page's one menu of actions (VF-1).


  openContextSubmenu(event, opts = {}) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target instanceof Element ? event.target : null;
    const anchorTarget = event.currentTarget instanceof Element ? event.currentTarget : target;
    if (!anchorTarget) return null; // The opener is usually an sf-button-icon, whose host is display:contents
    // and has no box at all; the native control on the event path has one.

    const boxed = this.resolveBoxedAnchor(event, anchorTarget);
    return this.openTemplateActionsMenu(boxed, opts.template || {});
  } // Every element the table draws goes through here -- its own controls,
  // the row menus, the select boxes, a host's row actions -- and each was
  // written for the ladder's step 1. A table at another step draws them at
  // its own: a size of 1 becomes the table's. An element that names no size
  // keeps its own default -- a badge's is 1/3, a tag's 1/2 -- which a table at
  // a smaller step would otherwise have grown.
  // A value in a cell that is only shown -- a badge, a tag, an avatar -- is
  // drawn as its component's own markup, from a detached instance of the
  // component, instead of as an element of its own (owner, 2026-10-15: a
  // page of rows held four hundred elements, each rendering itself, and a
  // sort built them all). The classes, so the look, are the component's;
  // anything interactive, or a component not defined yet, stays an element.


  renderCellElement(type, props = {}) {
    const tag = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(`sf-${String(type ?? "").replace(/^sf-/u, "")}`); // A status or a value in a cell is a tonal badge (owner decision C140
    // (2), (4); TB-6 of the table study): the host's main, or no
    // appearance on a pair whose default is still main, draws tonal; an
    // outline stays an outline.

    if (tag === "sf-badge" && props.appearance !== "outline") props = { ...props,
      appearance: "tonal"
    };
    const shown = LIGHT_CELL_TAGS.has(tag) && props.interactive !== true && props.closable !== true && props.type !== "checkbox" && !Object.keys(props).some(key => key.startsWith("@") || /^on[A-Z]/u.test(key));
    const Element = shown ? customElements.get(tag) : null;
    if (!Element) return this.renderSmartElement(type, props);
    this._lightCells ??= new Map();

    let element = this._lightCells.get(tag);

    if (!element) {
      element = document.createElement(tag);

      this._lightCells.set(tag, element);
    }

    if (typeof element.template !== "function") return this.renderSmartElement(type, props);

    for (const name of [...element.getAttributeNames()]) element.removeAttribute(name);

    for (const [key, value] of Object.entries(this.relativeSize(props))) {
      if (value === undefined || value === null || value === false) continue;
      const attribute = key.replace(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`);
      if (typeof value === "object" || typeof value === "function") element[key] = value;else element.setAttribute(attribute, value === true ? "" : String(value));
    }

    try {
      return element.template();
    } catch {
      return this.renderSmartElement(type, props);
    }
  } // A component type names a Framework element: a former tag (a host's
  // {type: 'icon-button'}, a dated alias until 2027-01-01) draws the element
  // under its current tag.


  renderSmartElement(type, props = {}) {
    type = (0,_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__.canonicalTag)(`sf-${String(type ?? "").replace(/^sf-/u, "")}`);
    return super.renderSmartElement(type, this.relativeSize(props));
  }

  get size() {
    return this.getEnumAttr("size", ["1/2", "1"], "1");
  } // The size a control inside is written with (C22): the host's own when it
  // has one, none when it has not. A control written at size 1 in a host
  // without a size stayed 40 under compact page density, where the page's
  // own controls were 32 (Larena, 2026-11-10).


  get controlSize() {
    const size = this.getAttribute("size");
    return size === "1/2" || size === "1" ? size : null;
  } // Every menu the table opens is on the table's step (owner remark
  // 2026-11-15): its resolved size -- the attribute, else the default "1" --
  // as its rows, checkboxes and buttons already are. A menu with no size
  // fell back to the menu's own default 1/2: a table of size 1 (rows 48,
  // text 16) opened 32 px rows with 14 px text.


  get menuSize() {
    return this.size === "1/2" ? "1/2" : "1";
  } // A control a column or an action names at size 1 is "this table's
  // size": the host's size when it has one, otherwise no size at all.


  relativeSize(props) {
    if (!props || String(props.size) !== "1") return props;
    const {
      size: _size,
      ...rest
    } = props;
    return this.controlSize ? { ...rest,
      size: this.controlSize
    } : rest;
  }

  getSelectColumn() {
    return { ...this.TABLE_SELECT_COLUMN,
      component: { ...this.TABLE_SELECT_COLUMN.component,
        props: { ...(this.TABLE_SELECT_COLUMN.component?.props || {}),
          checked: Boolean(this.state?.settingsChecked),
          indeterminate: Boolean(this.state?.selectIndeterminate)
        }
      }
    };
  }

  getColumns() {
    const dataColumns = this.getTableData().columns || [];
    const systemColumns = this.getSystemColumns();
    const systemKeys = new Set(systemColumns.map(column => column.key));
    const rightSystemKeys = new Set(['actions']);
    const originalIndexByKey = new Map(dataColumns.map((column, index) => [column?.key, index]));
    const userColumns = dataColumns.filter(column => column?.key && !systemKeys.has(column.key)).map(column => {
      const settings = this.getColumnSetting(column.key);
      const nextColumn = { ...column,
        ...settings
      };

      if (settings.width) {
        nextColumn.colWidth = settings.width;
      }

      return nextColumn;
    }).sort((left, right) => {
      const getOrder = column => {
        const order = column?.order;
        return order !== null && typeof order !== "undefined" && order !== "" && Number.isFinite(Number(order)) ? Number(order) : originalIndexByKey.get(column?.key) ?? 0;
      };

      const leftOrder = getOrder(left);
      const rightOrder = getOrder(right);

      if (leftOrder === rightOrder) {
        return (originalIndexByKey.get(left.key) ?? 0) - (originalIndexByKey.get(right.key) ?? 0);
      }

      return leftOrder - rightOrder;
    });
    const leftSystemColumns = systemColumns.filter(column => !rightSystemKeys.has(column?.key));
    const rightSystemColumns = systemColumns.filter(column => rightSystemKeys.has(column?.key)); // Pinned columns stand right after the box and the row menu, each group
    // in its own order. The partition is stable, so pinning changes which
    // group a column is in and nothing else about where it sits.

    const pinnedUserColumns = userColumns.filter(column => this.isColumnPinned(column));
    const looseUserColumns = userColumns.filter(column => !this.isColumnPinned(column));
    const columns = [...leftSystemColumns, ...pinnedUserColumns, ...looseUserColumns, ...rightSystemColumns].filter(column => column?.visible !== false); // On a phone a keyed table with row actions keeps the box, «≡» and
    // the key cells (C259); the others are the record's, opened by its name.

    if (this.isKeyedNarrow) return columns.filter(column => systemKeys.has(column.key) || isKeyCell(column));
    const width = this._responsiveWidth || this.clientWidth || 0; // The list chooses its own fields by priority and wants every column to
    // choose from; dropping columns that do not fit is the table's answer.

    if (this.isList || !width || !userColumns.some(column => column.priority !== undefined)) return columns;

    const columnWidth = column => {
      const value = column.min_width ?? column.minWidth ?? column.width;
      const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
      return Number.isFinite(parsed) && parsed > 0 ? parsed : column.system ? 48 : 160;
    };

    const retained = new Set(columns);
    let needed = columns.reduce((sum, column) => sum + columnWidth(column), 0);
    const removable = userColumns.filter(column => column.visible !== false).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    for (const column of removable) {
      if (needed <= width || retained.size <= systemColumns.length + 1) break;
      retained.delete(column);
      needed -= columnWidth(column);
    }

    return columns.filter(column => retained.has(column));
  } // The columns that stay in place while the rows scroll sideways: the box,
  // the row menu, and the column the host marked as the record's title. The
  // host declares the title with `role: "title"` on the column rather than
  // the table guessing the first text column — a guess breaks on a page whose
  // first column is an icon or a flag, and the host already knows which
  // column leads the record.
  // Whether a column is pinned. The person decides, through the toggle in the
  // column settings, and the answer is stored beside the order and the width;
  // the column the host marked as the record's title starts pinned, because
  // that is the column a reader names a row by. The box and the row menu are
  // always pinned and are not offered a toggle.


  isColumnPinned(column) {
    if (!column?.key) return false;
    if (column.key === "select" || column.key === "settings") return true;
    if (column.system) return false;
    const pending = this.tempSettings?.cols?.[column.key];
    const setting = this.getColumnSetting(column.key) || {};
    const chosen = pending?.pinned ?? setting.pinned ?? column.pinned;
    if (typeof chosen === "boolean") return chosen;
    if (column.role === "title") return true; // Without a title, the first data column stands still when the table
    // scrolls sideways (owner decision C146 (9)): a plain table on a phone
    // keeps the name of each row in view.

    const data = (this.getTableData().columns || []).filter(one => one?.key && !SYSTEM_COLUMN_KEYS.has(one.key) && !one.system);
    return !data.some(one => one.role === "title") && data[0]?.key === column.key;
  }

  getPinnedColumnKeys(columns = this.getColumns()) {
    return columns.filter(column => column?.key && this.isColumnPinned(column)).map(column => column.key);
  }

  isPinnedColumn(column) {
    if (!column?.key) return false;
    if (["start", "end"].includes(column.sticky)) return true;
    return this.isColumnPinned(column);
  } // A pinned cell's offset is read from the page, not from the declared
  // widths. The box and the row menu declare their widths as `calc()` over
  // tokens, which no arithmetic here can resolve, and a column the person has
  // resized no longer has the width its description names. The measured
  // offsets are published as custom properties, so the cells themselves only
  // ever name a property.


  getStickyCellStyle(columns, index) {
    const column = columns[index];
    const pinned = this.isPinnedColumn(column);
    if (!pinned) return "";
    const side = ["start", "end"].includes(column.sticky) ? column.sticky : "start"; // Only the placing is inline. The colour is a rule, because a pinned
    // cell has to carry the colour of the row it is in: painting it here
    // beat every row state and left the pinned columns white under a
    // selected or hovered row.

    return `position: sticky; inset-inline-${side}: var(--sf-table-pin-${column.key}, 0px); z-index: 2;`;
  } // Measured after a draw and on every resize of the box: the column
  // settings are read once for it (drawingWith).


  measurePinnedColumns() {
    return this.drawingWith(() => this.measurePinnedColumnsNow());
  }

  measurePinnedColumnsNow() {
    const table = this.refs.table?.value;
    const scroll = this.refs.scroll?.value;
    if (!table) return this;
    const keys = this.getPinnedColumnKeys();
    const head = table.querySelector("thead tr"); // The widths read first, the offsets written after: written in turn,
    // each read laid the table out again (stand 25: a pinned column each
    // side, every scroll and every render). The offsets do not change the
    // widths. An offset that is already there is not written again.

    const widths = keys.map(key => {
      const cell = head?.querySelector(`th[data-key="${key}"]`);
      return cell ? cell.getBoundingClientRect().width : 0;
    });
    let offset = 0;
    keys.forEach((key, at) => {
      const value = `${Math.round(offset)}px`;
      if (table.style.getPropertyValue(`--sf-table-pin-${key}`) !== value) table.style.setProperty(`--sf-table-pin-${key}`, value);
      offset += widths[at];
    });
    const last = keys[keys.length - 1]; // Marked where it changes only: a mark taken off and put back on every
    // measure touched each pinned cell of every row (stand 25: a
    // revalidated list redrew rows nothing had changed in).

    const edge = new Set(last ? table.querySelectorAll(`[data-key="${last}"]`) : []);

    for (const cell of table.querySelectorAll("[data-sf-pin-edge]")) {
      if (!edge.has(cell)) cell.removeAttribute("data-sf-pin-edge");
    }

    for (const cell of edge) {
      if (!cell.hasAttribute("data-sf-pin-edge")) cell.setAttribute("data-sf-pin-edge", "");
    } // The shadow only means something once something is hidden behind the
    // pinned block, so it follows the scroll position. In a right-to-left
    // table the browser reports that position as a negative number.


    if (scroll) {
      const scrolled = Math.abs(this.sidewaysOffset) > 0;
      if (scrolled) scroll.setAttribute("data-sf-pin-scrolled", "");else scroll.removeAttribute("data-sf-pin-scrolled");
    }

    return this;
  }

  bindPinnedColumnScroll() {
    const scroll = this.refs.scroll?.value;
    if (!scroll || this._pinnedScrollBound === scroll) return this;
    this._pinnedScrollBound = scroll;
    scroll.addEventListener("scroll", () => this.measurePinnedColumns(), {
      passive: true
    });
    return this;
  } // A row's select box has no visible label: the row is the label. A reader
  // moving through the column hears each box by the row's first data cell,
  // instead of a run of unnamed checkboxes it cannot tell apart.


  getRowSelectLabel(row) {
    const text = this.getRowNameText(row);
    return text ? `${this.text("selectRowLabel")}: ${text}` : this.text("selectRowLabel");
  } // The row's «≡» says whose actions it holds (owner decision C146 (5),
  // variant В): «Действия: <name>», as the SIMAI Framework table recipe
  // names it (utility.table 1.5.0).


  getRowMenuLabel(row) {
    const text = this.getRowNameText(row);
    return text ? `${this.text("actionsColumnLabel")}: ${text}` : this.text("menuLabel");
  } // The text a row is named by: its first data column's value, else its id.


  getRowNameText(row) {
    const batch = this._labelColumnBatch;
    const column = batch && "column" in batch ? batch.column : this.getColumnItems().find(item => item?.key && !item.system && item.key !== "select" && item.key !== "settings");
    if (batch) batch.column = column;
    const raw = column ? row?.[column.key] : undefined;
    const value = raw !== null && typeof raw === "object" ? raw.text ?? raw.label ?? raw.value ?? "" : raw;
    return String(value ?? "").trim() || String(row?.id ?? "").trim();
  }

  createRowComponentCell(component, props = {}) {
    if (!component?.type) {
      return null;
    }

    return {
      component: {
        type: component.type,
        props: { ...(component.props || {}),
          ...props
        }
      }
    };
  } // The row's menu is the Framework's standard menu (owner, 2026-10-12): it
  // opens below its button and start-aligned, in the top layer, and a group
  // of the host's row_actions is a real submenu rather than a second menu
  // swapped in over the first. What a choice does is unchanged -- an intent
  // for the row, or the action's own handler where it has one.
  //
  // One menu, bound to the table's rows by sf-menu-context's `for` (C164,
  // SIMAI Framework sf-menu-context 1.21.0): the right button, the menu key,
  // Shift+F10 and a long press on a row open it through the menu itself, and
  // a row's «≡» (or a list row's «⋯») opens it at the button. Every way in
  // asks the same `open` question, answered by fillRowMenu: one list (C164
  // (2)), every action of the row (C259 (3)).
  //
  // A group's own button (an «Опубликовать» drawn in the row) opens the same
  // menu with that group's members alone (CM-8): it was a second menu of the
  // table's own, drawn by hand with a tail beside the button.


  async openRowMenu(event, row = {}, {
    group = null,
    items = null
  } = {}) {
    const anchor = event?.currentTarget?.querySelector?.("button") ?? event?.target?.closest?.("button") ?? event?.currentTarget;
    if (!(anchor instanceof Element)) return null;
    this._rowMenuGroup = Array.isArray(items) && items.length ? {
      row,
      items,
      anchor
    } : Array.isArray(group?.members) ? {
      row,
      group,
      anchor
    } : null; // The standard menu is a lazy relation of the table: fetched after the
    // page is ready, and asked for here if a press comes first.

    await globalThis.SF?.Loader?.ensure?.(["sf-menu-context"]);
    const menu = this.rowMenu();
    await customElements.whenDefined?.("sf-menu-context"); // The row is named: the menu acts on the row the button stands in.

    const target = anchor.closest("[data-row-id]") ?? undefined;

    try {
      return menu.toggleFor(anchor, target ? {
        target
      } : {});
    } finally {
      this._rowMenuGroup = null;
    }
  } // Whether the rows carry a menu: the host's row actions, whatever
  // row-actions says -- a view writes row-actions="false" when every action
  // lives in the row menu (no actions column), and the menu stays.


  get hasRowMenus() {
    return (this.ACTIONS_SETTINGS_ROW ?? []).length > 0;
  } // The ids of the areas the row menu is bound to: the table and the list.


  get rowAreaId() {
    return this._rowAreaId;
  } // The menu is in the page as soon as the rows have one, so the right
  // button, the menu key and a long press find it before any «≡» is pressed.


  bindRowMenu() {
    if (!this.isConnected || !this.hasRowMenus) return; // A slot's fallback table is not drawn while the slot holds another.

    const slot = this.parentElement;
    if (slot?.tagName === "SLOT" && slot.assignedNodes?.().length) return;

    if (this._rowMenu?.isConnected) {
      // A draw may swap the table for the list (or back): the menu is
      // given the areas standing now.
      this._rowMenu.for = this.rowMenuAreas();
      return;
    }

    globalThis.SF?.Loader?.ensure?.(["sf-menu-context"]);
    this.rowMenu();
  } // The row menu's areas: the table's own <table> and list, as elements
  // (SIMAI Framework sf-menu-context 1.27.0 `for` takes a list of areas and
  // reads its events at the composed path). A table inside a shadow root --
  // sf-view's own, when the host slots none -- is reached the same way as
  // one in the document, so the table hears no right button or menu key of
  // its own. The toolbar, the head's column menu and the pagination stay
  // outside the areas and keep the browser's menu.


  rowMenuAreas() {
    const id = this.rowAreaId;
    return Array.from(this.querySelectorAll(`[id="${id}"], [id="${id}-list"]`));
  } // The entries of the row the menu opens for (C164): every action the row
  // offers (C259 (3): the quick ones of a list too); over several selected
  // rows (C164 (3)) the actions every one of them offers, under «Выбрано N».


  fillRowMenu(menu, row, ids, anchor) {
    const selection = Array.isArray(row.actions) && row.actions.every(item => typeof item === "string") ? row.actions : null;
    const asked = this._rowMenuGroup && String(this._rowMenuGroup.row?.id) === String(row?.id) ? this._rowMenuGroup : null;
    const only = asked?.group ?? null; // A list a host built for one row action (its `menu` with `items`):
    // the entries of the same standard menu, each choice its own handler.

    if (asked?.items) {
      const entries = asked.items.map((item, at) => {
        const props = item.props || item.component?.props || {};
        return {
          id: `${ROW_MENU_ITEM}${at}`,
          text: props.text ?? item.name ?? "",
          icon: props.iconStart ?? props.icon ?? undefined,
          danger: props.scheme === "error" || item.danger === true,
          disabled: Boolean(props.disabled)
        };
      });
      menu.setAttribute("size", this.menuSize);
      (0,_view_common_density_js__WEBPACK_IMPORTED_MODULE_18__.followDensity)(menu, this);
      menu.setAttribute("aria-label", this.getContextMenuLabel({
        row,
        menu: "row-settings"
      }));
      menu.entries = entries;
      this._rowMenuContext = {
        row,
        items: [],
        listed: asked.items,
        anchor,
        ids: null
      };
      return entries.length;
    }

    const many = !only && Array.isArray(ids) && ids.length > 1;
    let items = this.getActionRowItems(row);

    if (only) {
      const group = items.find(item => item.id === only.id && Array.isArray(item.members));
      const members = (group?.members ?? []).filter(member => !selection || selection.includes(member.id));
      const entries = members.map(member => ({
        id: member.id,
        text: member.name,
        icon: member.icon ?? member.component?.props?.icon ?? undefined,
        danger: member.danger === true
      }));
      entries.sort((a, b) => Number(a.danger === true) - Number(b.danger === true));
      const firstDanger = entries.findIndex(entry => entry.danger === true);
      if (firstDanger > 0) entries.splice(firstDanger, 0, {
        type: "separator"
      });
      menu.setAttribute("size", this.menuSize);
      (0,_view_common_density_js__WEBPACK_IMPORTED_MODULE_18__.followDensity)(menu, this);
      menu.setAttribute("aria-label", `${this.getContextMenuLabel({
        row,
        menu: "row-settings"
      })}: ${only.name ?? only.id}`);
      menu.entries = entries;
      this._rowMenuContext = {
        row,
        items: group ? [group] : [],
        anchor,
        ids: null
      };
      return entries.length;
    }

    if (many) {
      const rows = this.getTableData().rows.filter(one => ids.some(id => String(id) === String(one.id)));
      items = items.filter(action => rows.every(one => this.getActionRowItems(one).some(other => other.id === action.id)));
    }

    const iconOf = action => action?.icon ?? action?.component?.props?.icon ?? undefined;

    const entries = items.map(action => Array.isArray(action.members) ? {
      id: action.id,
      text: action.name,
      icon: iconOf(action),
      submenu: action.members.filter(member => !selection || selection.includes(member.id)).map(member => ({
        id: member.id,
        text: member.name,
        icon: iconOf(member),
        danger: member.danger === true
      }))
    } : {
      id: action.id,
      text: action.name,
      icon: iconOf(action),
      danger: action.danger === true
    }); // A destructive entry closes the menu (C164 (5)): whatever order a host
    // catalogue gives, «Удалить» is the last entry, the rest keep theirs.

    entries.sort((a, b) => Number(a.danger === true) - Number(b.danger === true)); // …after a divider, when anything stands above it (C164).

    const firstDanger = entries.findIndex(entry => entry.danger === true);
    if (firstDanger > 0) entries.splice(firstDanger, 0, {
      type: "separator"
    });
    if (many) entries.unshift({
      type: "heading",
      text: `${this.text("selectedRowsHeading")} ${ids.length}`
    }); // On every opening, as the table stands now: the row menu lives on
    // <body> or in the open dialog, outside the table, so it has neither
    // the table's size nor the density of the table's area unless it is
    // given them (owner remark 2026-11-15).

    menu.setAttribute("size", this.menuSize);
    (0,_view_common_density_js__WEBPACK_IMPORTED_MODULE_18__.followDensity)(menu, this);
    menu.setAttribute("aria-label", this.getContextMenuLabel({
      row,
      menu: "row-settings"
    }));
    menu.entries = entries;
    this._rowMenuContext = {
      row,
      items,
      anchor,
      ids: many ? ids.map(String) : null
    };
    return entries.length;
  }

  rowMenu() {
    if (this._rowMenu?.isConnected) return this._rowMenu;
    const menu = document.createElement("sf-menu-context");
    menu.setAttribute("popup", "");
    menu.dataset.sfTableMenu = "row"; // The table's rows and the list's rows are this menu's objects, given
    // as the elements themselves: their ids are not seen from the
    // document when the table stands in a shadow root.

    menu.for = this.rowMenuAreas(); // The question every way in asks (C164 (2)): which row, and what it
    // offers. A press outside a record's row (the head, a «load more»
    // row) and a row without actions open nothing.

    menu.addEventListener("sf-menu-context-open", event => {
      // An opening asked for one row's group or listed entries (CM-8):
      // the row is the one named, wherever the opener stands.
      const asked = this._rowMenuGroup;

      if (asked) {
        if (!this.fillRowMenu(menu, asked.row, null, asked.anchor)) event.preventDefault();
        return;
      }

      const target = event.detail?.target;
      const element = target instanceof Element ? target.closest("[data-row-id]") : null;
      const row = element && this.contains(element) ? this.rowOfElement(element) : null;

      if (!row || !this.getActionRowItems(row).length) {
        event.preventDefault();
        return;
      } // The selection rule (C164 (3)): a selected row speaks for the
      // selection, a row outside it becomes the selection first.


      const {
        ids
      } = this.rowMenuTargets(row); // VR14-2: SIMAI Framework sf-menu-context selects an unselected
      // row (aria-selected) right after this question (C164 (3)); the
      // row menu never changes the marks, so each row's aria-selected
      // is put back to its box once the engine has written it.

      queueMicrotask(() => this.syncRowSelectedState());
      const anchor = element.querySelector(LIST_ROW_MENU_BUTTON) ?? element;
      if (!this.fillRowMenu(menu, row, ids, anchor)) event.preventDefault();
    });
    menu.addEventListener("sf-menu-context-select", event => {
      const context = this._rowMenuContext;
      if (!context) return;
      const id = event.detail?.id;
      const {
        row,
        items,
        anchor,
        ids,
        listed
      } = context;

      if (listed && String(id ?? "").startsWith(ROW_MENU_ITEM)) {
        const item = listed[Number(String(id).slice(ROW_MENU_ITEM.length))];
        const props = item?.props || item?.component?.props || {};
        const handler = props["@click"] ?? props.onClick;
        if (typeof handler === "function") handler({
          currentTarget: anchor,
          target: anchor,

          preventDefault() {},

          stopPropagation() {}

        });
        return;
      } // A menu over several selected rows acts on all of them.


      if (ids && id) {
        this.requestActionIntent(id, ids);
        return;
      }

      const action = items.find(item => item.id === id);
      const member = action ? null : items.flatMap(item => item.members ?? []).find(item => item.id === id);

      if (member) {
        this.requestActionIntent(member.id, [row.id]);
        return;
      }

      const handler = action?.component?.props?.["@click"] ?? action?.component?.props?.onClick;
      if (typeof handler === "function") handler({
        currentTarget: anchor,
        target: anchor,

        preventDefault() {},

        stopPropagation() {}

      });else if (action) this.requestActionIntent(action.id, [row.id]);
    });
    (this.closest("dialog[open]") || document.body).append(menu);
    this._rowMenu = menu;
    return menu;
  } // Which of the table's actions this row offers, and in what shape.
  //
  // `row.actions` is read twice over a row's life and means two things. From
  // a host it is ids -- `["view"]`, the data view port's word for which
  // actions apply to this record -- and that is what selects from the table's
  // own list. Once the cell is built it holds the built items, and the
  // template calls this again with them, so the filter was asking whether an
  // array of objects includes a string. It never does: every action was
  // filtered out and the «Действия» column drew an empty container in every
  // row of every list, page lists included. A consumer reported it on an
  // embedded one, which is only where they happened to be looking (owner,
  // 2026-10-09).
  //
  // Ids select. Anything else is already the selection and is not filtered
  // again.
  // The same items for the same row, so a render finds the elements it made
  // last time rather than new ones.
  //
  // A re-query brings new row objects for the same records, so a cache held
  // on the row produced new items every time and lit rebuilt every actions
  // cell -- which is exactly what tests/browser/table-round-3 exists to
  // refuse: it used to tear every cell out and build it again, and the
  // control a person was using went with them. The key is what the cell
  // actually depends on: the row, the ids it offers, and the list those ids
  // select from (owner, 2026-10-09).


  rowActionItems(row = {}) {
    const ids = Array.isArray(row?.actions) && row.actions.every(item => typeof item === "string") ? row.actions.join(",") : "*";
    const list = this.ACTIONS_SETTINGS_ROW ?? [];
    const listKey = list.map(action => action?.id ?? "").join(",");

    if (this._rowActionListKey !== listKey) {
      this._rowActionListKey = listKey;
      this._rowActionItems = new Map();
    }

    const key = `${row?.id ?? ""}|${ids}`;
    if (!this._rowActionItems) this._rowActionItems = new Map();

    if (!this._rowActionItems.has(key)) {
      this._rowActionItems.set(key, this.getActionRowItems(row));
    }

    return this._rowActionItems.get(key);
  }

  getActionRowItems(row = {}, actions = this.ACTIONS_SETTINGS_ROW) {
    const selection = Array.isArray(row.actions) && row.actions.every(item => typeof item === "string") ? row.actions : null; // A group (the host's row_actions, port 1.8.0) is offered when the
    // record allows any of its members, and opens a submenu of exactly
    // those: «Опубликовать › ru» on a row drafted in ru, not in en.

    const allowedMembers = action => (action.members || []).filter(member => !selection || selection.includes(member.id));

    return actions.filter(action => Array.isArray(action.members) ? allowedMembers(action).length > 0 : !selection || selection.includes(action.id)).map(action => {
      if (Array.isArray(action.members)) {
        const members = allowedMembers(action);
        const props = { ...(action.component?.props || {})
        };

        props["@click"] = event => this.openRowMenu(event, row, {
          group: { ...action,
            members
          }
        });

        return { ...action,
          component: { ...(action.component || {}),
            props
          }
        };
      }

      const component = action.component || {};
      const props = { ...(action.props || {}),
        ...(component.props || {})
      };
      const menu = action.menu || props.menu;
      const hasClickHandler = typeof props["@click"] === "function" || typeof props.onClick === "function";

      if (menu === "row-settings" && !hasClickHandler) {
        // The row's own menu is the one standard menu (CM-8, C164 (2)).
        props["@click"] = event => this.openRowMenu(event, row);
      } else if (menu && !hasClickHandler) {
        props["@click"] = event => {
          const menuOptions = menu && typeof menu === "object" ? menu : {
            menu
          };
          this.openContextMenu(event, {
            type: "left",
            row,
            action,
            ...menuOptions
          });
        };
      } else if (!hasClickHandler) {
        props["@click"] = () => this.requestActionIntent(action.id, [row.id]);
      }

      return { ...action,
        component: { ...component,
          props
        }
      };
    });
  }

  getDefaultRowCell(column, row) {
    if (!column?.key) {
      return null;
    }

    if (column.key === "select") {
      return this.createRowComponentCell(column.rowComponent, {
        checked: this.state.settingsChecked ? true : Boolean(row?.selected || row?.checked),
        value: row?.id ?? row?.value ?? "",
        ariaLabel: this.getRowSelectLabel(row),
        "@change": event => {
          this.applyRowSelection(row.id, Boolean(event.target.checked), {
            range: this._selectRangeModifier === true
          });
        }
      });
    }

    if (column.key === "settings") {
      if (!column.rowComponent && !this.rowMenuHasUse()) return null;
      return this.createRowComponentCell(column.rowComponent || {
        type: "button-icon",
        props: {
          size: "1",
          appearance: "ghost",
          scheme: "on-surface",
          icon: "menu",
          ariaLabel: this.getRowMenuLabel(row),
          value: "menu",
          "@click": e => this.openRowMenu(e, row)
        }
      });
    }

    if (column.key === 'actions') {
      return this.getActionRowItems(row);
    }

    return null;
  }

  normalizeRow(row = {}, systemColumns = this.getSystemColumns()) {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      return row;
    } // A row that already carries its system cells is kept as it is: a
    // change of one row copies that row alone, not the ten thousand others
    // (standard 1.3.8 §18.4, gate 17 «one entry changed»).


    if (systemColumns.every(column => !column?.key || column.visible === false || typeof row[column.key] !== "undefined")) {
      return row;
    }

    const nextRow = { ...row
    };
    systemColumns.forEach(column => {
      if (!column?.key || typeof nextRow[column.key] !== "undefined" || column.visible === false) {
        return;
      }

      const cell = this.getDefaultRowCell(column, nextRow);

      if (cell) {
        nextRow[column.key] = cell;
      }
    });
    return nextRow;
  } // The system columns and the column a box is named by are read once for
  // the whole list, not once per row: ten thousand rows asked for them ten
  // thousand times (simai/ui-pro#2).


  normalizeRows(rows = []) {
    if (!Array.isArray(rows)) return [];
    const systemColumns = this.getSystemColumns();
    this._labelColumnBatch = {};

    try {
      return this.drawingWith(() => rows.map(row => this.normalizeRow(row, systemColumns)));
    } finally {
      this._labelColumnBatch = null;
    }
  }

  setTableData(patch = {}, reason = "data") {
    const currentData = this.getTableData();
    const nextPatch = typeof patch === "function" ? patch(currentData) : patch;

    if (!nextPatch || typeof nextPatch !== "object") {
      return this;
    }

    const result = this.set({
      data: { ...currentData,
        ...nextPatch
      }
    }, reason);
    this.syncSelectionPort(); // New rows are new selection: a tree that redrew its rows after a bulk
    // write left the page box half-ticked over rows none of which were.

    if (Object.prototype.hasOwnProperty.call(nextPatch, "rows")) this.syncSelectAllState();
    return result;
  }

  setColumns(columns = [], reason = "columns") {
    const currentColumns = this.getTableData().columns || [];
    const nextColumns = typeof columns === "function" ? columns(currentColumns) : columns;
    const result = this.setTableData({
      columns: Array.isArray(nextColumns) ? nextColumns : []
    }, reason);
    if (this.rememberedWidthsKey) this.restoreRememberedWidths();
    return result;
  }

  addColumns(columns = []) {
    const nextColumns = Array.isArray(columns) ? columns : [columns];
    return this.setColumns(currentColumns => [...currentColumns, ...nextColumns.filter(Boolean)]);
  }

  updateColumn(columnKey, patch = {}, reason = "columns") {
    if (!columnKey) {
      return this;
    }

    return this.setColumns(columns => columns.map((column, index) => {
      if (!column || column.key !== columnKey) {
        return column;
      }

      const nextPatch = typeof patch === "function" ? patch(column, index) : patch;
      return { ...column,
        ...(nextPatch || {})
      };
    }), reason);
  } // Which drawing of the rows is on screen: a new result set whose kept rows
  // would move is drawn as new rows (setRows "result"), so the template keys
  // rows by this and their id.


  rowsGeneration() {
    return this._rowsGeneration ?? 0;
  }

  setRows(rows = [], reason = "rows") {
    const currentRows = this.getTableData().rows || [];
    const nextRows = typeof rows === "function" ? rows(currentRows) : rows; // A new result set (a search, a filter, another page: reason
    // "result") is drawn as new rows when a row it keeps would stand
    // elsewhere. Keyed by id alone, the kept rows were moved to their new
    // places, and the browser counted every one as a layout shift (stand
    // 25 D12: CLS 0.17 per search); new rows are drawn, not shifted. The
    // swap is one render, so the old rows go and the new come in one frame.

    if (reason === "result" && Array.isArray(nextRows) && rowsWouldMove(currentRows, nextRows)) {
      this._rowsGeneration = (this._rowsGeneration ?? 0) + 1;
    }

    return this.setTableData({
      rows: this.normalizeRows(nextRows)
    }, reason);
  }

  addRows(rows = [], reason = "rows") {
    if (this.isActionParameters?.(rows, ["rows"])) rows = rows.rows ?? [];
    const nextRows = Array.isArray(rows) ? rows : [rows];
    this.setRows(currentRows => [...currentRows, ...nextRows.filter(Boolean)], reason);
    return {
      outcome: "applied"
    };
  }

  updateRowsByKey(key, value, patch = {}, reason = "rows") {
    if (!key) {
      return this;
    }

    const patchRow = typeof patch === "function" ? patch : row => ({ ...row,
      ...(patch || {})
    });
    return this.setRows(rows => rows.map((row, index) => {
      if (!row || row[key] !== value) {
        return row;
      }

      const nextRow = patchRow(row, index);
      return nextRow && typeof nextRow === "object" ? nextRow : row;
    }), reason);
  } // One entry changed: that row is drawn again in place, and the widths
  // measured from the content are kept (standard 1.3.8 §18.4, gate 17 «one
  // entry changed ≤ 50 ms whatever the count»).


  updateRowByKey(key, value, patch = {}, reason = "row") {
    this._entryOnly = true;
    return this.updateRowsByKey(key, value, patch, reason);
  }

  updateRows(patch = {}, reason = "rows") {
    const patchRow = typeof patch === "function" ? patch : row => ({ ...row,
      ...(patch || {})
    });
    return this.setRows(rows => rows.map((row, index) => {
      const nextRow = patchRow(row, index);
      return nextRow && typeof nextRow === "object" ? nextRow : row;
    }), reason);
  }

  updateRowCell(rowKey, rowValue, cellKey, patch = {}, reason = "cell") {
    if (!cellKey) {
      return this;
    }

    return this.updateRowsByKey(rowKey, rowValue, row => {
      const currentCell = row && row[cellKey] && typeof row[cellKey] === "object" ? row[cellKey] : {};
      const nextCellPatch = typeof patch === "function" ? patch(currentCell, row) : patch;
      return { ...row,
        [cellKey]: { ...currentCell,
          ...(nextCellPatch || {})
        }
      };
    }, reason);
  }

  updateRowCellProps(rowKey, rowValue, cellKey, props = {}, reason = "cell-props") {
    return this.updateRowCell(rowKey, rowValue, cellKey, cell => ({
      component: { ...(cell.component || {}),
        props: { ...(cell.component?.props || {}),
          ...(typeof props === "function" ? props(cell.component?.props || {}, cell) : props || {})
        }
      }
    }), reason);
  }

  closeContextMenu(restoreFocus = true) {
    const trigger = this.contextTarget;
    this.set({
      contextMenu: {
        open: false
      }
    });
    this.stopContextMenuPositions();
    (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)(null, this.getPortalContainer());
    this.hidePortal(); // The column window's host empties with the window (VT-12).

    if (this._settingsHost?.isConnected) (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)(null, this._settingsHost);

    if (this.refs.contextMenu) {
      this.refs.contextMenu.value = null;
    }

    this.unbindContextEvent();
    this.unbindContextViewport();
    this.contextTarget?.classList.remove("active");
    this.contextTarget = null;

    if (restoreFocus && trigger?.isConnected && typeof trigger.focus === 'function') {
      requestAnimationFrame(() => trigger.focus());
    }
  }

  get templateName() {
    return this.getAttribute("template") || "default";
  } // The vocabulary's data state is `ready`; `populated` is read as its
  // alias (standard 1.3.8 gate 26), and the template keeps drawing it.


  get dataState() {
    const state = this.getEnumAttr('data-state', ['loading', 'ready', 'populated', 'empty', 'error'], 'auto');
    return state === 'ready' ? 'populated' : state;
  }

  setDataState(state = 'auto') {
    const named = state === 'ready' ? 'populated' : state;
    const normalized = ['loading', 'populated', 'empty', 'error'].includes(named) ? named : 'auto';

    if (normalized === 'auto') {
      this.removeAttribute('data-state');
    } else {
      this.setAttribute('data-state', normalized);
    }

    return this;
  }

  requestRetry() {
    this.emitTableEvent('refresh', {});
    return {
      outcome: "applied"
    };
  } // Why there are no rows, as a data view knows it: {kind: 'no-access' |
  // 'nothing-found' | 'no-data', reset: 'search' | 'filters' | 'both',
  // headingLevel, message}. `message` is the host's own sentence for a list
  // it refused or could not give; it is the brick's title, drawn as text. A table on its own knows only no data and could not load.


  get emptyContext() {
    return this._emptyContext;
  }

  set emptyContext(value) {
    this._emptyContext = value && typeof value === "object" ? { ...value
    } : null;
    this.requestComponentUpdate("empty-context");
  } // What «Сбросить поиск и фильтры» does: the table's own search and filter
  // are emptied, and each says so the way a person's edit would.


  resetQuery(scope = "both") {
    if (scope !== "search") this.removeFilterTag();

    if (scope !== "filters") {
      this.clearSearchDebounce();
      this._searchPendingProps = null; // A search the table did not hold (the view's own, or a host's) is
      // still cleared: the event goes either way.

      if (this.state.search?.value) this.updateSearchState({
        value: ""
      });else this.emitTableEvent("search-change", {
        search: ""
      });
    }

    return this;
  } // The brick for a table without rows: its reason, its words and its one
  // action. The host's empty-text and error-text are the titles they always
  // were, and empty-description the line under an empty list's title; the
  // rest are the brick's own words in the page language.


  emptyBrick(dataState) {
    const context = this._emptyContext ?? {};
    const size = this.size === "1/2" ? "1/2" : "1";
    const headingLevel = String(context.headingLevel ?? 3);
    const message = typeof context.message === "string" ? context.message.trim() : "";

    if (dataState === "error") {
      return {
        kind: "error",
        size,
        headingLevel,
        title: message || this.getAttribute("error-text") || "",
        text: "",
        live: context.caused ? "alert" : "auto",
        actions: [{
          id: "retry",
          text: this.text("retryText", "retry-text"),
          appearance: "outline"
        }]
      };
    }

    const kind = ["no-access", "nothing-found"].includes(context.kind) ? context.kind : "no-data";
    if (kind === "no-access") return {
      kind,
      size,
      headingLevel,
      title: message,
      text: "",
      actions: []
    };

    if (kind === "nothing-found") {
      const key = {
        search: "resetSearchText",
        filters: "resetFiltersText"
      }[context.reset] ?? "resetBothText"; // A list empty only because of its filters says so by its glyph
      // (owner decision C120 (3)): filter_alt_off; a search, or a search
      // and filters together, keep the brick's own search_off.

      return {
        kind,
        size,
        headingLevel,
        title: "",
        text: "",
        icon: context.reset === "filters" ? "filter_alt_off" : "",
        actions: [{
          id: "reset-query",
          text: this.text(key),
          appearance: "outline"
        }]
      };
    }

    const creatable = this.getBooleanAttr("actions", true) && this.getBooleanAttr("creatable", true);
    return {
      kind,
      size,
      headingLevel,
      title: this.getAttribute("empty-text") || "",
      text: this.getAttribute("empty-description") || "",
      actions: creatable ? [{
        id: "create",
        text: this.text("createText", "create-text")
      }] : []
    };
  }

  disconnectedCallback() {
    this.closeCellPopover();
    this.unbindWindowScroll();

    for (const controller of this._toolbarRoving?.values() ?? []) controller.destroy();

    this._toolbarRoving?.clear(); // The row menu lives beside the page, not inside the table: it goes
    // with the table that made it.

    this._rowMenu?.close?.({
      restoreFocus: false
    });
    this._rowMenu?.remove();
    this._rowMenu = null;

    for (const page of this._filterOptionPages.values()) {
      page.controller?.abort();
      clearTimeout(page.searchTimer);
    }

    this._filterOptionPages.clear();

    clearTimeout(this._viewWaitTimer);
    this._viewWaitAbort?.abort();
    this._viewWaitAbort = null;
    this._viewWait = null;
    this._responsiveObserver?.disconnect();
    this._responsiveObserver = null;
    this._responsiveWidth = 0;
    this._responsiveTarget = null;
    this._preferenceUnsubscribe?.();
    this._preferenceUnsubscribe = null;
    this._preferenceKeyBound = undefined;
    this._rowActionsAbort?.abort();
    this._rowActionsAbort = null;
    this._rowActionsTable = null;
    this.unbindPageScroll();
    this._lateLayoutAbort?.abort();
    this._lateLayoutAbort = null;
    cancelAnimationFrame(this._lateLayoutFrame ?? 0);
    this._lateLayoutFrame = 0;
    this.clearSearchDebounce();
    this._searchPendingProps = null;
    this._searchHoldKey = '';
    this.stopContextMenuPositions();
    this.unbindContextEvent();
    this.unbindContextViewport();
    this.unBindHoverEvent();
    this.unbindColumnResizeEvent();
    this.unbindColumnDragEvent();
    this.tempSettings = null;
    this._selectionPortKey = "[]"; // A removed table abandons its pending answer; a remount asks again.

    this._abandonedQuery = this._pendingQuerySequence !== null;
    this._pendingQuerySequence = null;
    this.state.contextMenu = {
      open: false
    };
    this.state.settingsChecked = false;
    this.state.selectIndeterminate = false;
    const data = this.getTableData();
    this.state.data = { ...data,
      rows: data.rows.map(row => ({ ...row,
        selected: false,
        checked: false,
        ...(row.select?.component ? {
          select: { ...row.select,
            component: { ...row.select.component,
              props: { ...row.select.component.props,
                checked: false
              }
            }
          }
        } : {})
      }))
    };

    if (this.refs.contextMenu) {
      this.refs.contextMenu.value = null;
    }

    this.contextTarget?.classList?.remove('active');
    this.contextTarget = null;

    if (this._portalContainer) {
      (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)(null, this._portalContainer);

      this._portalContainer.remove();

      this._portalContainer = null;
    }

    if (this._settingsHost) {
      (0,lit__WEBPACK_IMPORTED_MODULE_10__.render)(null, this._settingsHost);

      this._settingsHost.remove();

      this._settingsHost = null;
      this._settingsShown = null;
    }

    super.disconnectedCallback();
  }
  /**
   * One of this table's words, in the page's language. An attribute wins over
   * both languages, because a consumer who names a word has named it.
   *
   * The declared default is the English one, so a component read through its
   * props alone still says something sensible; the context below overrides
   * every text key with this, which is what makes the Russian reachable. A
   * key left out of that override would quietly fall back to English on a
   * Russian page -- which is exactly how three labels in the record panel's
   * head came to read «Close» beside «В избранное».
   */


  text(key, attribute) {
    return attribute && this.getAttribute(attribute) || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_12__.pageText)(TABLE_TEXT, key, this);
  }

  templateContext() {
    this._readResponsiveWidthNow();

    this._renderedCramped = this.columnsAreCramped;
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      list: this._renderedList = this.isList,
      // The list's toolbar is the compact one, unless the person chose
      // the list on a container wide enough for the table's toolbar and
      // its layout switch (C31).
      compactToolbar: this._renderedList && !(this.hasLayoutSwitch && !this.isNarrow),
      layoutSwitch: this.hasLayoutSwitch && !this.isNarrow,
      shownLayout: this._renderedList ? "list" : "table",
      quickActionIds: this.quickActionIds,
      // The row menu's areas (C164) and the phone's keyed table (C259).
      rowAreaId: this.rowAreaId,
      keyedNarrow: this.isKeyedNarrow,
      // The size the controls inside are written with: the host's own,
      // or none, so a host without a size keeps its controls relative
      // and page density moves them (C22).
      controlSize: this.controlSize,
      rootClass: this.getRootClass(),
      rootStyle: this.getRootStyle(),
      filterText: this.text("filterText", "filter-text"),
      // The open saved filter names the filter button (C388, C301 (3),
      // view round 5 LV-13); the default one leaves «Фильтр».
      filterName: (() => {
        const template = this.getSelectedFilterTemplate?.();
        return template && template.key !== "default" ? String(template.label || "") : "";
      })(),
      // An open saved filter that holds conditions tints the filter
      // control as a field condition does (C301 (3), view round 5 R5-2
      // and Q1): on a phone the icon has no room for the name, so the
      // tone is its sign, and the name joins its accessible name.
      filterHeld: (() => {
        const template = this.getSelectedFilterTemplate?.();
        return Boolean(template && template.key !== "default" && this.filterTemplateHolds(template));
      })(),
      clearText: this.text("clearText", "clear-text"),
      searchPlaceholder: this.text("searchPlaceholder", "search-placeholder"),
      createText: this.text("createText", "create-text"),
      pinColumnLabel: this.text("pinColumnLabel", "pin-column-label"),
      unpinColumnLabel: this.text("unpinColumnLabel", "unpin-column-label"),
      loadingText: this.text("loadingText", "loading-text"),
      emptyText: this.text("emptyText", "empty-text"),
      errorText: this.text("errorText", "error-text"),
      retryText: this.text("retryText", "retry-text"),
      columnMoveLabel: this.text("columnMoveLabel", "column-move-label"),
      filterApplyText: this.text("filterApplyText", "filter-apply-text"),
      columnSearchPlaceholder: this.text("columnSearchPlaceholder", "column-search-placeholder"),
      columnSearchEmptyText: this.text("columnSearchEmptyText", "column-search-empty-text")
    });
  }

  setCheckboxHeight() {
    if (!this.refs.items.size) return;
    const measureToken = ++this._checkboxMeasureToken;
    requestAnimationFrame(() => {
      if (!this.isConnected || measureToken !== this._checkboxMeasureToken) {
        return;
      }

      const parentSpace = (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_13__.setParentSpace)(this.refs.items);

      if (!parentSpace) {
        return;
      }

      const {
        item,
        gap,
        parent
      } = parentSpace;
      this.parentGap = gap;
      const itemHeight = item.tagName.toLowerCase().startsWith('sf-') ? item.children[0]?.clientHeight : item.clientHeight;

      if (!itemHeight) {
        return;
      }

      const itemSize = parent.dataset.size || 8;
      const parentHeight = (itemHeight + gap) * itemSize;

      if (parent.clientHeight <= parentHeight) {
        return false;
      }

      parent.setAttribute('style', `height: ${parentHeight}px; overflow: auto;`);
    });
  }

  beforeRender() {
    super.beforeRender();
    this.connectTablePreference();
    this.applyTableView();
    this._checkboxMeasureToken++;
    this.refs.items = new Map();
  } // The width the first render is chosen by (saved-views r2, D1): the
  // observer below reports a width only after the first paint, so a table
  // whose answer was in by the time its code was defined drew its first
  // frame as if it were wide -- at 390 the desktop toolbar, the search
  // field across the row and Create and Filter on the rows below, 80-124 px
  // tall, then the compact 36 px bar one or two frames later. The compact
  // toolbar and the list are other markup, not a restyle, and list-below is
  // the table's own attribute, which a container query cannot read; so
  // until the observer has spoken, the width is read here, before the
  // render and so before any paint: the content box of the nearest
  // ancestor that has a box (the table's own tag and sf-view are
  // display: contents), as the observer measures it.


  _readResponsiveWidthNow() {
    if (this._responsiveWidth > 0 || !this.isConnected) return;

    for (let element = this.querySelector(".sf-table") ?? this.parentElement; element; element = element.parentElement) {
      const box = element.getBoundingClientRect?.();
      if (!box || box.width <= 0) continue;
      const style = globalThis.getComputedStyle?.(element);

      const edge = side => (parseFloat(style?.[`padding${side}`]) || 0) + (parseFloat(style?.[`border${side}Width`]) || 0);

      const width = Math.floor(box.width - edge("Left") - edge("Right"));
      if (width > 0) this._responsiveWidth = width;
      return;
    }
  } // SfBaseElement is display: contents, so its own box has no width: the
  // nearest visible container is observed instead of the custom tag. The
  // box is chosen again once the one observed has left the document: a
  // table printed by a server (its static markup) is replaced by the drawn
  // one, and the width of a box no longer in the page never changes -- a
  // list on a phone stayed a table, its width read as nothing (stand 24).


  _observeResponsiveBox() {
    if (!this._responsiveObserver || this._responsiveTarget?.isConnected) return;
    const candidates = [this.querySelector('.sf-table'), this.parentElement, this.getRootNode()?.host];
    const target = candidates.find(element => element?.getBoundingClientRect?.().width > 0) ?? candidates.find(Boolean) ?? this;
    if (this._responsiveTarget) this._responsiveObserver.unobserve(this._responsiveTarget);
    this._responsiveTarget = target;

    this._responsiveObserver.observe(target);
  } // C296 / C295 (VT-13): the table draws columns and rows. Its toolbar,
  // search, filter, saved templates, create button, layout switch, own
  // paging and own group buttons are the container's (sf-view,
  // sf-pagination, sf-bulk-actions). They keep working, as they were,
  // until 2027-01-01; a table standing alone that is given one is noted in
  // SF.deprecations once. Inside sf-view the view writes them: no note.


  noteContainerSettings() {
    if (this._containerNoted || this.closest?.("sf-view")) return;
    this._containerNoted = true;

    for (const name of CONTAINER_SETTINGS) {
      // toolbar="false" and the like already say what the table becomes.
      if (!this.hasAttribute(name) || this.getAttribute(name) === "false") continue;
      (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_20__.noteDeprecated)({
        component: "sf-view-table",
        tag: "sf-view-table",
        kind: "attribute",
        attribute: name,
        from: name,
        to: CONTAINER_SETTING_HOME[name] ?? "sf-view",
        since: "2026-11-18",
        remove_after: "2027-01-01",
        package: "view"
      });
    }
  } // A row scrollToRow asked for outside the drawn range is drawn now, and
  // brought into view inside the table's scroll (C296).


  revealPendingRow() {
    const id = this._pendingScrollRow;
    this._pendingScrollRow = null;
    this.refs.table?.value?.querySelector(`tbody tr[data-row-id="${id.replace(/"/gu, '\\"')}"]`)?.scrollIntoView?.({
      block: "nearest",
      behavior: "instant"
    });
  }

  afterRender() {
    this.drawingWith(() => this.afterDraw());
  } // The selection boxes draw their tick only when a box is checked: an
  // unchecked row's glyph is empty, so the page's first icon font never had
  // «check», and the first box checked waited for a second font before its
  // tick showed (0.6 s on a fast line; the Loader keeps an unknown glyph at
  // font-size 0 until its font is in). A table with boxes asks for the tick
  // and the head's «remove» with its first font, as sf-segmented and sf-input
  // ask for the glyphs they will draw (SF.Loader.preloadIcons). Once per
  // element; a Loader without it answers nothing.


  preloadSelectionGlyphs() {
    if (this._selectionGlyphsAsked || !this.getPropsContext().selectable) return;
    const loader = globalThis.SF?.Loader;
    if (typeof loader?.preloadIcons !== 'function') return;
    this._selectionGlyphsAsked = true;
    loader.preloadIcons(['check', 'remove']);
  } // A box checked since the last drawing names its tick now. The Loader
  // shows a renamed icon whose name its font already draws at once
  // (core.runtime 1.67.0, group build 17 L1); before, its page observer
  // marked it a few frames later (115 ms measured) and the table handed the
  // new ticks over itself (adoptSelectionGlyphs, removed in view round 17).


  afterDraw() {
    this.noteContainerSettings();
    this.preloadSelectionGlyphs();

    this._observeResponsiveBox();

    this.bindRowActionsEvents(this.refs.table?.value);
    this.bindToolbarKeyboard();
    this.syncGrid();
    this.bindRowMenu();
    this.syncListStops();
    this.toggleAttribute("data-sf-keyed-narrow", this.isKeyedNarrow);
    if (this._windowed) this.bindWindowScroll();
    if (this._pendingScrollRow) this.revealPendingRow();

    if (this._pendingFocusRow) {
      const id = this._pendingFocusRow;
      this._pendingFocusRow = null;
      this._windowOnly = false;
      this._entryOnly = false;
      this.focusRow(id, {
        reveal: true
      });
      return;
    } // A render that only moved the window, or changed one entry, draws
    // rows of the same columns: their values are folded, no width is
    // measured again.


    if (this._windowOnly || this._entryOnly) {
      this._windowOnly = false;
      this._entryOnly = false;
      this._layoutUnchanged = false;
      this.fitCellValues();
      this.measurePinnedColumns();
      this.syncWindow();
      this.markClippedTitles();
      return;
    } // A render that only moved a row's buttons changed no width.


    if (this._layoutUnchanged) {
      this._layoutUnchanged = false;
      return;
    } // Content widths first: they change the widths everything below reads.
    // Written straight onto the columns: a render for them drew every row
    // and every value in it again (owner, 2026-10-15).
    // Cells whose elements are defined but still drawing (a reference, a
    // colour, a file) are measured once, when they have drawn -- in this
    // task, before the frame is painted. They used to be measured now and
    // again then, and the first reading was thrown away: two layouts of
    // the whole table in auto and fixed form, and the values folded twice
    // (stand 25: 300 ms of the first page's 1.2 s at 4x CPU).


    if (!this.measureWhenCellsDrawn()) {
      if (this.measureContentWidths()) this.applyColumnWidths();
      this._contentRetries = 0;
      this.fitCellValues();
      this.measurePinnedColumns();
    }

    if (this.hasAttribute("data-sf-page-scroll")) {
      this.bindPageScroll();
      this.syncRail();
      this.syncStickyHead();
    } else {
      this.unbindPageScroll();
      const head = this.refs.table?.value?.tHead;
      if (head?.style.transform) head.style.transform = "";
    } // Whether the columns are cramped is read from the laid-out table, so
    // the first render guesses: before layout the actions column and the
    // floors are not yet where they will be. When the answer after the
    // render is not the one the render used, render once more.
    // Twice at most in a row, so a width that sits on the edge cannot keep
    // the table re-rendering.


    if (this.columnsAreCramped !== this._renderedCramped && (this._crampedRetries ?? 0) < 2) {
      this._crampedRetries = (this._crampedRetries ?? 0) + 1;
      this.requestComponentUpdate("cramped-columns");
    } else {
      this._crampedRetries = 0;
    }

    this.bindPinnedColumnScroll();
    this.setCheckboxHeight();
    this.bindHoverEvent();
    this.bindColumnResizeEvent();
    this.bindColumnDragEvent();
    this.syncWindow();
    this.markClippedTitles();
  } // The toolbar's keyboard is SIMAI Framework roving.js (C184 (1)-(3),
  // VF-6): each group of the toolbar's buttons -- the filter with its chips
  // and their buttons at the start, create and the view's actions at the
  // end -- is one Tab stop, the arrows walk it in the row's direction, ↓ on
  // a menu button opens its menu, and Tab comes back to the button left.
  // The search field and the layout switch keep their own keys and stops.


  bindToolbarKeyboard() {
    const groups = [...this.querySelectorAll(":scope .sf-table-toolbar .sf-table-toolbar-start, :scope .sf-table-toolbar .sf-table-toolbar-end, :scope .sf-table-toolbar .sf-table-list-search")].filter(group => group.closest("sf-view-table, sf-table") === this);
    this._toolbarRoving ??= new Map();

    for (const [group, controller] of this._toolbarRoving) {
      if (!groups.includes(group) || !group.isConnected) {
        controller.destroy();

        this._toolbarRoving.delete(group);
      }
    }

    const buttons = group => () => [...group.querySelectorAll("button")].filter(button => !button.closest("sf-input, .sf-input, sf-segmented, .sf-segmented"));

    for (const group of groups) {
      if (this._toolbarRoving.has(group)) continue;

      this._toolbarRoving.set(group, (0,_core_js_roving_js__WEBPACK_IMPORTED_MODULE_21__.roving)(group, {
        items: buttons(group),
        orientation: "horizontal"
      }));
    }
  } // A name cut by its two lines (C146 (7)) says so on its cell, and the
  // Framework tooltip over it shows the whole name; a name that fits has
  // no tooltip.


  markClippedTitles() {
    const table = this.refs.table?.value;
    if (!table) return;
    const tip = this.tipId("title");

    for (const clamp of table.querySelectorAll('tbody td[data-sf-cell="title"] .sf-table-cell-text')) {
      const clipped = clamp.scrollHeight > clamp.clientHeight + 1 || clamp.scrollWidth > clamp.clientWidth + 1;
      if (clipped !== clamp.hasAttribute("data-sf-clipped")) clamp.toggleAttribute("data-sf-clipped", clipped); // A cut name is a trigger of the table's name tooltip; a whole
      // one is none (the Framework's tooltip unlinks it).

      if (clipped && clamp.getAttribute("data-tooltip") !== tip) clamp.setAttribute("data-tooltip", tip);else if (!clipped && clamp.hasAttribute("data-tooltip")) clamp.removeAttribute("data-tooltip");
    }

    if (this._titleTipTable === table) return;
    this._titleTipTable = table; // The name tooltip says the name the pointer or the focus is on,
    // written before the tooltip's delay ends.

    const write = event => {
      const clamp = event.target instanceof Element ? event.target.closest('td[data-sf-cell="title"] .sf-table-cell-text[data-sf-clipped]') : null;
      const text = clamp ? document.getElementById(tip)?.querySelector(".sf-tooltip-text") : null;
      if (text && text.textContent !== clamp.textContent.trim()) text.textContent = clamp.textContent.trim();
    };

    table.addEventListener("pointerover", write);
    table.addEventListener("focusin", write);
  } // ─── the table as a grid (owner decision C146 (8)) ──────────────────────
  // A table whose rows hold controls -- the box, the row menu, the name's
  // link, the row's buttons -- is a grid: one Tab stop, the arrows between its rows
  // and between the controls of a row (WAI-ARIA APG grid). Up and down keep
  // the place in the row; left and right walk the row's controls, the row
  // itself first; Home and End go to the row's first and last, with Ctrl to
  // the first and last row; Enter opens, Space marks the row; Shift+F10 and
  // the menu key open the row's «≡» (C146 (5)). The head is
  // the grid's first row: its sort
  // buttons, the edges that set a width, the box for all and the gear. A
  // plain table, with nothing to press in its rows, stays a table.


  gridControls(row) {
    const own = row.parentElement?.tagName === "TBODY" ? [row] : []; // A column edge is no stop of the grid (C146 (8), RS-10): the person
    // sets a width with the pointer.

    const controls = [...row.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled])")].filter(element => !element.closest(".sf-tooltip, [hidden]") && !element.matches("[data-sf-column-resizer]")); // The head of a column whose width can be set and that has nothing to
    // press (no sort) is a stop itself: the arrows reach it and Enter
    // opens its width menu (C158 (5)).

    const heads = row.parentElement?.tagName === "THEAD" ? [...row.children].filter(cell => this.headStopOf(cell) === cell) : [];

    if (heads.length) {
      return [...controls, ...heads].sort((a, b) => a.compareDocumentPosition(b) & 4 ? -1 : 1);
    }

    return [...own, ...controls];
  } // ─── a column's width from the keyboard (owner decision C158 (5)) ───────
  // The table stays one Tab stop (C146 (8)): the arrows walk the heads, and
  // Enter on a head whose column has an edge -- Shift+F10, the menu key or
  // the right button too -- opens «Изменить ширину · По содержимому · По
  // умолчанию». «Изменить ширину» takes the focus to the edge, where the
  // arrows set the width (SIMAI Framework SF.Resizer.attach, sf-resizer
  // 1.3.0); Enter or Escape there go back to the head. A double click on the
  // edge is the fit to content. Space on a sort button still sorts.
  // The stop of a head: its sort button, or the head itself; null for a
  // column without an edge (the system columns, the last column, a column
  // marked resizable: false).


  headStopOf(cell) {
    if (!(cell instanceof Element) || cell.tagName !== "TH") return null;
    if (!cell.querySelector("[data-sf-column-resizer]")) return null;
    return cell.querySelector(".sf-table-sort-button") ?? cell;
  } // A plain table (no grid) keeps its sort buttons as its stops; a head with
  // nothing to press is reached by the arrows from them, and is the head
  // row's one stop when the row has no other.


  syncHeadStops(table) {
    const row = table?.tHead?.rows?.[0];
    if (!row) return;
    const heads = [...row.children].filter(cell => this.headStopOf(cell) === cell);

    for (const head of heads) if (head.getAttribute("aria-haspopup") !== "menu") head.setAttribute("aria-haspopup", "menu");

    if (this.isGrid) return;
    const others = this.gridControls(row).filter(element => !heads.includes(element));
    heads.forEach((head, index) => {
      const value = index === 0 && !others.length ? "0" : "-1";
      if (head.getAttribute("tabindex") !== value) head.setAttribute("tabindex", value);
    });
  } // The head's keys go first, so Enter on a sort button opens the width
  // menu rather than sorting; the right button on a head with an edge opens
  // the same menu (the row menu's `for` asks only about rows).


  bindHeadMenu(table, signal) {
    table.addEventListener("keydown", event => this.handleHeadKeydown(event, table), {
      signal
    });
    table.addEventListener("contextmenu", event => {
      const cell = event.target instanceof Element ? event.target.closest("th") : null;
      if (!cell || cell.parentElement?.parentElement !== table.tHead) return;
      const key = cell.dataset.key;
      const column = key ? this.getColumns().find(item => String(item?.key) === key) : null;
      if (!column || column.system) return;
      event.preventDefault();
      event.stopPropagation(); // Shift+F10 and the menu key opened it already.

      if (Date.now() - (this._headMenuKeyAt ?? 0) < 500) return;
      if (event.target.closest("[data-sf-column-resizer]")) return;
      const point = event.button === 2 || !this.headStopOf(cell) ? {
        x: event.clientX,
        y: event.clientY
      } : null;
      this.openColumnMenu(cell, this.headStopOf(cell) ?? cell, point);
    }, {
      signal
    });
  }

  handleHeadKeydown(event, table) {
    if (event.defaultPrevented) return;
    const target = event.target instanceof Element ? event.target : null;
    const cell = target?.closest?.("th");
    if (!cell || cell.parentElement?.parentElement !== table.tHead) return; // On the edge: Enter and Escape go back to the head (the Framework's
    // gesture leaves them to the table).

    if (target.matches("[data-sf-column-resizer]")) {
      if (event.key !== "Enter" && event.key !== "Escape") return;
      const stop = this.headStopOf(cell);
      if (!stop) return;
      event.preventDefault();
      event.stopPropagation();
      this.focusHeadStop(stop);
      return;
    }

    const stop = this.headStopOf(cell);
    const onStop = stop && target === stop;

    if (onStop && (event.key === "Enter" || event.key === "ContextMenu" || event.shiftKey && event.key === "F10")) {
      event.preventDefault();
      event.stopPropagation();
      this._headMenuKeyAt = Date.now();
      this.openColumnMenu(cell, stop);
      return;
    } // A plain table walks its heads with the arrows as a grid does.


    if (this.isGrid || event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const stops = this.gridControls(cell.parentElement);
    const at = stops.indexOf(target);
    if (at < 0) return;
    const forward = event.key === "ArrowRight" !== this.isRightToLeft();
    const next = stops[at + (forward ? 1 : -1)];
    if (!next) return;
    event.preventDefault();
    this.focusHeadStop(next);
  }

  focusHeadStop(stop) {
    if (this.isGrid) {
      this._gridStop = stop;
      this.syncGrid();
    }

    stop.focus({
      preventScroll: false
    });
  } // The column's menu (owner decision C296, q-columns B): on the head --
  // the right button, a long press, Shift+F10, the menu key, Enter on a
  // head with an edge -- sort up and down, pin, hide and «Все колонки…»
  // (the column window), then the width (C158 (5)). The window stays for
  // the order and for bringing a hidden column back.


  columnMenuEntries(column, cell) {
    const entries = [];
    const sort = this.state?.sort ?? {};

    if (column.sortable === true && !column.system) {
      entries.push({
        id: "sort-asc",
        text: this.text("columnSortAsc"),
        icon: "arrow_upward",
        checked: sort.key === column.key && sort.direction === "asc"
      });
      entries.push({
        id: "sort-desc",
        text: this.text("columnSortDesc"),
        icon: "arrow_downward",
        checked: sort.key === column.key && sort.direction === "desc"
      });
    } // Under the list head (sf-view head="list") there is no gear: the view
    // settings are «Настроить вид» above the list (C301 (1)). The column's
    // own pin and hide stay on its head all the same (C296, VR2-1), and
    // «Все колонки…» opens «Настроить вид» (data-sf-view-columns="head",
    // written by the view where the host keeps personal column settings).


    const underHead = this.getAttribute("data-sf-view-columns") === "head";
    const settings = this.getPropsContext?.().settings !== false && (this.getAttribute("settings-menu") !== "false" || underHead);

    if (!column.system && settings) {
      const pinned = this.isColumnPinned(column);
      const group = [{
        id: "pin",
        text: this.text(pinned ? "columnUnpin" : "columnPin"),
        icon: "push_pin"
      }]; // The title stays: it is the record's name and its link (C146 (5)).

      const shown = this.getColumnItems().filter(item => item?.key && !item.system && this.isColumnVisible(item));
      if (column.role !== "title" && shown.length > 1) group.push({
        id: "hide",
        text: this.text("columnHide"),
        icon: "visibility_off"
      });
      if (entries.length) entries.push({
        type: "separator"
      });
      entries.push(...group, {
        id: "all",
        text: this.text("columnAll"),
        icon: "view_column"
      });
    }

    if (cell?.querySelector?.("[data-sf-column-resizer]")) {
      if (entries.length) entries.push({
        type: "separator"
      });
      entries.push({
        id: "resize",
        text: this.text("columnWidthChangeText")
      }, {
        id: "fit",
        text: this.text("columnWidthFitText")
      }, {
        id: "default",
        text: this.text("columnWidthDefaultText")
      });
    }

    return entries;
  }

  async openColumnMenu(cell, anchor = cell, point = null) {
    const key = cell?.dataset?.key;
    const column = key ? this.getColumns().find(item => String(item?.key) === key) : null;
    if (!column || column.system) return null;
    const entries = this.columnMenuEntries(column, cell);
    if (!entries.length) return null;
    await globalThis.SF?.Loader?.ensure?.(["sf-menu-context"]);
    await customElements.whenDefined?.("sf-menu-context");
    const menu = this.columnMenu();
    menu.setAttribute("size", this.menuSize);
    (0,_view_common_density_js__WEBPACK_IMPORTED_MODULE_18__.followDensity)(menu, this);
    const label = column.label || column.key;
    menu.setAttribute("aria-label", `${this.text("columnMenuLabel")}: ${label}`);
    menu.entries = entries;
    this._columnMenuContext = {
      key,
      cell,
      anchor,
      column
    };
    if (point) return menu.openAt?.(point.x, point.y);
    return typeof menu.toggleFor === "function" ? menu.toggleFor(anchor, {
      align: "start"
    }) : menu.openFor?.(anchor, {
      align: "start"
    });
  } // A choice of the column menu: the sort goes out as a person's sort
  // (sort-change), the pin and the hide as column settings (save), «Все
  // колонки…» opens the column window against the head.


  applyColumnMenuChoice(id, context) {
    const {
      key,
      column
    } = context;

    if (id === "sort-asc" || id === "sort-desc") {
      const direction = id === "sort-asc" ? "asc" : "desc";
      const sort = this.state?.sort ?? {};
      if (sort.key === key && sort.direction === direction) return true;
      this.setSort(key, direction);
      this.emitTableEvent("sort-change", Object.freeze({
        key,
        direction
      }));
      return true;
    }

    if (id === "pin") {
      this.toggleColumnPinned(column);
      return true;
    }

    if (id === "hide") {
      this.patchColumnSettings(key, {
        visible: false
      }, "column-hide");
      return true;
    }

    if (id === "all") {
      const view = this.getAttribute("data-sf-view-columns") === "head" ? this.closest?.("sf-view") : null;

      if (typeof view?.openCustomize === "function") {
        view.openCustomize();
        return true;
      }

      const gear = this.querySelector('thead th[data-key="settings"] button, thead th[data-key="settings"] [role="button"]');
      const anchor = gear ?? context.cell;
      this._settingsTab = "columns";
      this.openContextMenu({
        currentTarget: anchor,
        target: anchor,
        timeStamp: performance.now(),

        preventDefault() {},

        stopPropagation() {}

      }, {
        menu: "table-settings"
      });
      return true;
    }

    return false;
  }

  columnMenu() {
    if (this._columnMenu?.isConnected) return this._columnMenu;
    const menu = document.createElement("sf-menu-context");
    menu.setAttribute("popup", "");
    menu.dataset.sfTableMenu = "column";
    menu.addEventListener("sf-menu-context-select", event => {
      const context = this._columnMenuContext;
      if (!context) return;
      const id = event.detail?.id ?? event.detail?.entry?.id;
      const stop = this.headStopOf(context.cell) ?? context.anchor;
      menu.close?.();

      if (id !== "all" && this.applyColumnMenuChoice(id, context)) {
        requestAnimationFrame(() => {
          const cell = this.refs.table?.value?.querySelector(`thead th[data-key="${this.escapeColumnKey(context.key)}"]`);
          const again = this.headStopOf(cell) ?? (cell?.isConnected ? null : null);
          if (again?.isConnected) this.focusHeadStop(again);
        });
        return;
      }

      if (id === "all") {
        // After the menu has closed and given the focus back.
        requestAnimationFrame(() => this.applyColumnMenuChoice(id, context));
        return;
      }

      if (id === "resize") {
        const edge = context.cell.querySelector("[data-sf-column-resizer]"); // After the menu has given the focus back to its opener.

        requestAnimationFrame(() => edge?.focus({
          preventScroll: true
        }));
        return;
      }

      if (id === "fit") this.fitColumnToContent(context.key);else if (id === "default") this.resetColumnWidth(context.key);
      requestAnimationFrame(() => {
        const cell = this.refs.table?.value?.querySelector(`thead th[data-key="${this.escapeColumnKey(context.key)}"]`);
        const again = this.headStopOf(cell) ?? stop;
        if (again?.isConnected) this.focusHeadStop(again);
      });
    });
    (this.closest("dialog[open]") || document.body).append(menu);
    this._columnMenu = menu;
    return menu;
  } // «По содержимому»: the column as wide as its head and the values shown
  // want on one line, up to the cap of a content width, read the way the
  // table measures its content widths (sf-table-measuring: auto layout at
  // max-content, for one read), and kept as the person's width.


  fitColumnToContent(key) {
    const table = this.refs.table?.value;
    if (!(table instanceof HTMLTableElement) || !key) return this;
    const column = this.getColumns().find(item => String(item?.key) === String(key));
    const th = table.querySelector(`thead th[data-key="${this.escapeColumnKey(key)}"]`);
    if (!column || !th) return this;
    let width = 0;
    table.classList.add("sf-table-measuring");

    try {
      if (getComputedStyle(table).tableLayout === "auto") width = th.getBoundingClientRect().width;
    } finally {
      table.classList.remove("sf-table-measuring");
    }

    if (!width) return this;
    const {
      minWidth,
      maxWidth
    } = this.getColumnResizeLimits(column, width);
    const fitted = Math.min(Math.max(contentStep(width), minWidth), maxWidth, Math.max(minWidth, this.columnWidthCap()));
    const frozen = this.freezeColumnsWidthForResize(table);
    return this.applyColumnResizeWidths(key, fitted, frozen);
  } // ─── the list's keyboard (VT-3; C146 (8) as in the grid) ────────────────
  // The list of records is one Tab stop, as the table is: the record the
  // person was on (or its control), else the current one, else the first.
  // ↑↓ walk the records from the record or any of its controls, ←→ walk a
  // record's own controls (box, «≡», title, actions); Home/End and Enter,
  // Space keep their row meaning (handleRowKeydown). 27 stops for 8 rows
  // and 39 for 12 before (the study's now-admin at 390).


  listItems(list = this.querySelector(":scope .sf-table-list")) {
    return list ? [...list.querySelectorAll(":scope > li.sf-table-list-item[data-row-id]")] : [];
  }

  listControls(item) {
    return [item, ...[...item.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]):not([type=hidden])")].filter(element => !element.closest(".sf-tooltip, [hidden]"))];
  }

  syncListStops() {
    const list = this.isList ? this.querySelector(":scope .sf-table-list") : null;

    if (!list) {
      this._listAbort?.abort();
      this._listBound = null;
      return;
    }

    this.bindListKeys(list);
    const items = this.listItems(list);
    const stops = items.flatMap(item => this.listControls(item));
    let stop = this._listStop?.isConnected && stops.includes(this._listStop) ? this._listStop : null;
    stop ??= list.querySelector(":scope > li[data-current]") ?? items[0] ?? null;

    for (const element of stops) {
      const index = element === stop ? "0" : "-1";
      if (element.getAttribute("tabindex") !== index) element.setAttribute("tabindex", index);
    }

    this._listStop = stop;
  }

  bindListKeys(list) {
    if (this._listBound === list) return;
    this._listAbort?.abort();
    this._listAbort = new AbortController();
    this._listBound = list;
    const {
      signal
    } = this._listAbort;
    list.addEventListener("focusin", event => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || target === this._listStop || !this.listItems(list).some(item => item.contains(target))) return;
      this._listStop = target;
      this.syncListStops();
    }, {
      signal
    });
    list.addEventListener("keydown", event => {
      if (event.defaultPrevented || event.altKey || event.metaKey) return;
      const target = event.target instanceof Element ? event.target : null;
      const items = this.listItems(list);
      const item = items.find(one => one.contains(target));
      if (!item || target.closest("textarea, select, [contenteditable]") || target.matches("input") && !/^(checkbox|radio)$/u.test(target.type)) return;
      const controls = this.listControls(item);
      const at = controls.indexOf(target);
      let next = null;

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const forward = event.key === "ArrowRight" !== this.isRightToLeft();
        next = controls[at + (forward ? 1 : -1)] ?? null;
      } else if ((event.key === "ArrowDown" || event.key === "ArrowUp") && target !== item && !target.matches(".sf-table-title-link")) {
        // From a control: the same place in the next record (from the
        // record itself and its title the row's own keys move).
        const other = items[items.indexOf(item) + (event.key === "ArrowDown" ? 1 : -1)];
        const list2 = other ? this.listControls(other) : [];
        next = list2[Math.min(Math.max(at, 0), list2.length - 1)] ?? null;
      } else {
        return;
      }

      if (!next || next === target) return;
      event.preventDefault();
      this._listStop = next;
      this.syncListStops();
      next.focus({
        preventScroll: false
      });
    }, {
      signal
    });
    let queued = 0;
    const observer = new MutationObserver(records => {
      if (queued || !records.some(record => [...record.addedNodes].some(node => node.nodeType === 1))) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        if (this._listBound === list) this.syncListStops();
      });
    });
    observer.observe(list, {
      childList: true,
      subtree: true
    });
    signal.addEventListener("abort", () => {
      observer.disconnect();
      if (queued) cancelAnimationFrame(queued);
    });
  }

  gridRows(table = this.refs.table?.value) {
    if (!table) return [];
    return [...table.querySelectorAll(":scope > thead > tr, :scope > tbody > tr[data-row-id]")];
  }

  get isGrid() {
    const table = this.refs.table?.value;
    if (!table || this.isList) return false;
    return Boolean(table.querySelector(":scope > tbody > tr[data-row-id] :is(a[href], button, input)"));
  }

  syncGrid() {
    const table = this.refs.table?.value;
    if (!(table instanceof HTMLTableElement)) return;
    this.bindGridKeys(table);
    const grid = this.isGrid;

    if (!this.isTree()) {
      if (grid) table.setAttribute("role", "grid");else if (table.getAttribute("role") === "grid") table.removeAttribute("role");
    } // Several rows may be marked (VT-4): said on the grid, not on a plain table.
    // Read from the drawn head: no column setting is asked outside a draw.


    const many = grid && Boolean(table.querySelector(':scope > thead th[data-key="select"]'));
    if (many) table.setAttribute("aria-multiselectable", "true");else table.removeAttribute("aria-multiselectable");
    this.syncHeadStops(table);
    if (!grid) return;
    const rows = this.gridRows(table);
    const stops = rows.flatMap(row => this.gridControls(row)); // The one stop: the control the person was on, else the row the
    // person is on, else the first row.

    let stop = this._gridStop?.isConnected && stops.includes(this._gridStop) ? this._gridStop : null;
    stop ??= table.querySelector(":scope > tbody > tr[data-current]") ?? table.querySelector(":scope > tbody > tr[data-row-id]");

    for (const element of stops) {
      const index = element === stop ? "0" : "-1";
      if (element.getAttribute("tabindex") !== index) element.setAttribute("tabindex", index);
    }

    this._gridStop = stop;
  }

  bindGridKeys(table) {
    if (this._gridTable === table) return;
    this._gridAbort?.abort();
    this._gridAbort = new AbortController();
    this._gridTable = table;
    const {
      signal
    } = this._gridAbort; // Wherever the focus lands -- a click, a Tab into a control the grid
    // has not seen yet -- that is the one stop.

    table.addEventListener("focusin", event => {
      if (!this.isGrid) return;
      const target = event.target;
      if (!(target instanceof Element) || target === this._gridStop) return;
      if (!this.gridRows(table).some(row => row.contains(target))) return;
      this._gridStop = target;
      this.syncGrid();
    }, {
      signal
    });
    this.bindHeadMenu(table, signal);
    table.addEventListener("keydown", event => this.handleGridKeydown(event, table), {
      signal
    }); // A double press on a short field the record lets this person write
    // edits it at the cell (C296); it does not open the record. Caught on
    // the way down, before the row's own double press.

    table.addEventListener("dblclick", event => {
      const edit = this.cellEditTarget(event);
      if (!edit) return;
      event.preventDefault();
      event.stopPropagation();
      this.openCellEditor(edit.row, edit.column, edit.cell);
    }, {
      signal,
      capture: true
    }); // A row's buttons come after the draw: the «Действия» buttons of the
    // row a person is on, and a Smart button's own <button>, which its
    // element draws once defined. Each new control leaves the Tab order
    // in the next frame, or it would be a second stop.

    let queued = 0;
    const observer = new MutationObserver(records => {
      if (queued || !records.some(record => [...record.addedNodes].some(node => node.nodeType === 1))) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        if (this._gridTable === table) this.syncGrid();
      });
    });
    observer.observe(table, {
      childList: true,
      subtree: true
    });
    signal.addEventListener("abort", () => {
      observer.disconnect();
      if (queued) cancelAnimationFrame(queued);
    });
  } // Each drawn row's aria-selected as its box says (VR14-2).


  syncRowSelectedState() {
    for (const row of this.querySelectorAll?.("[data-row-id][aria-selected]") ?? []) {
      const on = row.hasAttribute("data-selected") ? "true" : "false";
      if (row.getAttribute("aria-selected") !== on) row.setAttribute("aria-selected", on);
    }
  }

  rowOfElement(element) {
    const key = element?.closest?.("[data-row-id]")?.dataset.rowId;
    if (key == null) return null;
    const rows = this.getTableData().rows || [];
    return rows.find((row, index) => String(this.getRowKey(row, index)) === key) ?? null;
  } // The rows a context menu over `row` acts on (C164): a selected row
  // speaks for the whole selection; a row outside it becomes the selection
  // first. ids is null for the row alone. Asked by the row menu's `open`
  // question (rowMenu), whatever way the menu was opened: the rows carry no
  // aria-selected of their own, so the engine leaves the selection to this.


  rowMenuTargets(row) {
    if (!this.getPropsContext().selectable) return {
      ids: null,
      reselected: false
    };
    const selected = this.getSelectedRecordIds().map(String);
    if (selected.includes(String(row.id))) return {
      ids: selected,
      reselected: false
    }; // The row menu never changes the marks (VR14-2, DEV msg-afb6bff8;
    // RV4-2): nothing marked, it acts on its row alone; other rows
    // marked, it acts on the marked rows (C164 (3) as the dispatcher
    // relayed it). It used to make the row the selection, which left it
    // selected unseen after the menu and dropped the person's marks.

    if (!selected.length) return {
      ids: null,
      reselected: false
    };
    return {
      ids: selected,
      reselected: false
    };
  }

  handleGridKeydown(event, table) {
    if (event.defaultPrevented || !this.isGrid) return; // Alt+Down / Alt+Up are not the grid's: a data view steps the record
    // card open beside the list with them (C305 (4), VR2-3).

    if (event.altKey && (event.key === "ArrowDown" || event.key === "ArrowUp")) return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return; // F2 edits the short cell under the focus, or the row's first one.

    if (event.key === "F2") {
      const tr = target.closest("tbody tr[data-row-id]");
      const record = tr && this.rowOfElement(tr);
      const columns = this.getTableData().columns || [];
      const cells = tr ? [...tr.querySelectorAll(":scope > td[data-key]")] : [];
      const own = target.closest("td[data-key]");
      const cell = [own, ...cells].find(one => one && record && this.cellShortEditable(record, columns.find(c => String(c.key) === one.dataset.key) ?? {}));

      if (cell) {
        event.preventDefault();
        this.openCellEditor(record, columns.find(c => String(c.key) === cell.dataset.key), cell);
      }

      return;
    } // A field keeps its own keys.


    if (target.closest("textarea, select, [contenteditable]") || target.matches("input") && !/^(checkbox|radio)$/u.test(target.type)) return; // An edge that sets a width keeps its arrows, Home and End.

    if (target.matches("[data-sf-column-resizer]") && /^(ArrowLeft|ArrowRight|Home|End|Enter)$/u.test(event.key)) return;
    const rows = this.gridRows(table);
    const rowIndex = rows.findIndex(row => row === target || row.contains(target));
    if (rowIndex < 0) return;
    const row = rows[rowIndex];
    const controls = this.gridControls(row);
    const at = controls.indexOf(target); // The row's own keys (handleRowKeydown) move between rows from the
    // row itself, drawn or not; these move from a control, and across.

    const inBody = row.parentElement?.tagName === "TBODY";

    const place = (index, list, from) => {
      // A body row starts with the row itself; the head row does not.
      const fromBody = from.parentElement?.tagName === "TBODY";
      const toBody = list[0]?.tagName === "TR";
      const shift = (toBody ? 1 : 0) - (fromBody ? 1 : 0);
      return Math.max(0, Math.min(list.length - 1, index + shift));
    };

    let next = null;

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const forward = event.key === "ArrowRight" !== this.isRightToLeft();
      next = controls[at + (forward ? 1 : -1)] ?? null; // A tree row opens and closes with the arrows from the row itself.

      if (target === row && row.hasAttribute("aria-expanded")) return;
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      // From a row the row's own keys moved already, when there was a
      // row to move to; from the first one, up is the head.
      const other = rows[rowIndex + (event.key === "ArrowDown" ? 1 : -1)];

      if (other) {
        const list = this.gridControls(other);
        next = list[place(at, list, row)] ?? null;
      }
    } else if (event.key === "Home" || event.key === "End") {
      if (event.ctrlKey) {
        const body = rows.filter(one => one.parentElement?.tagName === "TBODY");
        next = (event.key === "Home" ? body[0] : body[body.length - 1]) ?? null;
      } else if (target !== row || !inBody) {
        next = event.key === "Home" ? controls[0] : controls[controls.length - 1];
      } else {
        return;
      }
    } else {
      return;
    }

    if (!next || next === target) return;
    event.preventDefault();
    this._gridStop = next;
    this.syncGrid();
    next.focus({
      preventScroll: false
    });
  }

  template() {
    // Building the template writes nothing to the page: what it reads of
    // the layout (the cap, whether the columns are cramped) is read once,
    // and so are the column settings (drawingWith).
    return this.drawingWith(() => this.readingLayout(() => (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_6__.renderTableTemplate)(this.templateContext())));
  } // The column settings of one draw, read once (simai/ui-pro#1): every
  // column and every cell asked for them: counted over one setRows() draw,
  // 268 times for 8 rows and 343 for 60, now 4. Building the template,
  // measuring it after (afterRender, measurePinnedColumns) and preparing the rows
  // (normalizeRows) change no setting; a handler they bind runs later,
  // outside, and reads them afresh.


  drawingWith(draw) {
    const outer = this._drawColumnSettings;
    this._drawColumnSettings = outer ?? this.getColumnSettings();

    try {
      return draw();
    } finally {
      this._drawColumnSettings = outer;
    }
  }

}

(0,_view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__.settingSetters)(SfTable, _component_json__WEBPACK_IMPORTED_MODULE_3__);
SfTable.define("sf-view-table");
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "9d9caaf4f796"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   columnStyle: () => (/* binding */ columnStyle),
/* harmony export */   renderTableTemplate: () => (/* binding */ renderTableTemplate),
/* harmony export */   resolvedDataState: () => (/* binding */ resolvedDataState)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0816a19adc72");
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("9d9903b87148");
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("efa66f8927d1");
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("8137feb490e0");
/* harmony import */ var lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("80c480e5196c");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("68a281c549b5");
/* harmony import */ var _link_cell_contract_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("5bfdd9ec12a1");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directive_js__WEBPACK_IMPORTED_MODULE_1__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_2__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_3__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_4__, lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_5__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, lit_directive_js__WEBPACK_IMPORTED_MODULE_1__, lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_2__, lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_3__, lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_4__, lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lit_directive_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lit_directive_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_5__);









function getEventInputValue(event, fallback = '') {
  const pathTarget = event?.composedPath?.()?.[0];
  const candidates = [pathTarget, event?.target, event?.currentTarget];

  for (const candidate of candidates) {
    if (!candidate) continue;

    if (typeof candidate.value !== 'undefined') {
      return candidate.value;
    }

    const input = candidate.querySelector?.('input, textarea');

    if (input && typeof input.value !== 'undefined') {
      return input.value;
    }
  }

  return fallback;
} // The toolbar of the compact list: one line, the search taking the room and the
// filter and create as icons beside it -- the table's toolbar wrapped to three
// lines on a phone and took a quarter of the screen. Active filters follow as a
// row of chips that scrolls sideways, each removable, and the filter itself
// opens as a sheet over the whole screen.


function renderListToolbar(context) {
  const {
    state
  } = context.component;
  const {
    value
  } = state.search;
  const filterTags = context.component.getCurrentFilterTags();
  const filterValues = context.component.getCurrentFilterValues();
  const active = Object.entries(filterTags || {}).filter(([, tag]) => tag?.active !== false); // The column settings on a phone (view round 5, LV-6): the desktop's gear
  // stands in the head of the row-menu column, which a list has not, so the
  // same gear stands here with the filter and the sort -- the view's own
  // controls (C301 (1): settings of the view over the list, not by «Создать»).

  const gear = context.settings !== false && context.settingsMenu !== false;
  const sortable = context.component.getColumns().some(column => column?.sortable && !column.system);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-table-toolbar sf-table-toolbar--list flex flex-col gap-1/3 flex-none"
             data-sf-filter-tags="${active.length ? '1' : '0'}">
            <div class="sf-table-list-search flex items-cross-center gap-1 min-w-0">
                <sf-input
                        size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        root-class="sf-search-input flex-1 min-w-0"
                        appearance="bordered"
                        value="${value}"
                        placeholder=${context.searchPlaceholder}
                        name="sf_table_search"
                        input-type="search"
                        icon-start="search"
                        clearable
                        aria-label=${context.searchPlaceholder}
                        @input=${e => context.component.searchChange({
    value: getEventInputValue(e, value)
  })}
                        @keydown=${e => context.component.handleSearchKeyDown(e)}
                        @keyup=${e => context.component.handleSearchKeyUp(e)}
                ></sf-input>
                <!-- C144: filter and sort are one group of neighbours (H5,
                     --sf-space-1/3); the field before them and «Создать»
                     after them stand a group apart (H6, --sf-space-1). -->
                ${context.component.offersFilter(active.length) || sortable || gear ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-list-view-buttons flex items-cross-center gap-1/3">
                ${context.component.offersFilter(active.length) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-list-filter">
                    <!-- The count of active conditions is the icon's own badge
                         (sf-button-icon badge-count, simai/ui-source#12): it
                         joins the button's name in the page language. -->
                    <sf-button-icon
                            size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            appearance=${active.length || context.filterHeld ? 'tonal' : 'outline'}
                            scheme=${active.length || context.filterHeld ? 'primary' : 'on-surface'}
                            icon="filter_list"
                            badge-count=${active.length || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            badge-label=${active.length ? context.component.text('filterBadgeLabel') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-label=${context.filterName ? `${context.filterText}: ${context.filterName}` : context.filterText}
                            @click=${e => context.component.openContextMenu(e, {
    type: 'bottom',
    menu: 'filter-settings'
  })}
                    ></sf-button-icon>
                </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${sortable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-button-icon
                            size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            appearance=${state.sort?.key ? 'tonal' : 'outline'}
                            scheme=${state.sort?.key ? 'primary' : 'on-surface'}
                            icon="swap_vert"
                            aria-label=${context.component.text('sortLabel')}
                            aria-haspopup="menu"
                            @click=${e => context.component.openContextMenu(e, {
    type: 'bottom',
    menu: 'list-sort'
  })}
                    ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${gear ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-button-icon
                            class="sf-table-list-settings"
                            size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            appearance="outline"
                            scheme="on-surface"
                            icon="settings"
                            aria-label=${context.component.text('settingsColumnLabel')}
                            aria-haspopup="dialog"
                            @click=${e => context.component.toggleTableSettings(e)}
                    ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${context.actions && context.creatable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-button-icon
                            size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            appearance="default"
                            scheme="primary"
                            icon="add"
                            aria-label=${context.createText}
                            @click=${e => state.createItems?.length ? context.component.openContextMenu(e, {
    type: 'bottom',
    menu: 'create'
  }) : context.component.requestCreateIntent(null)}
                    ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            ${active.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <!-- Chips are neighbours 4 apart (C105 H5, --sf-space-1/4); the
                     «Сбросить» after them is a button, 8 from the chips. -->
                <div class="sf-table-list-tags flex items-cross-center gap-1/3">
                    <div class="sf-table-chips flex items-cross-center gap-1/4">
                    ${active.map(([k, written]) => {
    // A date chip says its condition (C293 DF-4).
    const tag = { ...written,
      label: context.component.filterChipText(k, written)
    };
    const filterValue = filterValues?.[k] || {};
    const count = Array.isArray(filterValue.values) ? filterValue.values.length : tag.count || '';
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-tag kind="default" size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing} text='${tag.label}' interactive closable :key=${k}
                                    active count='${count}'
                                    @sf-tag-close="${() => context.component.removeFilterTag(k)}"
                                    @click=${e => context.component.openContextMenu(e, {
      type: 'bottom',
      menu: 'tag-settings',
      fieldKey: k,
      anchorSelector: '.sf-tag'
    })}
                            ></sf-tag>`;
  })}
                    </div>
                    <sf-button size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing} appearance="ghost" scheme="on-surface" text=${context.clearText}
                               @click="${() => context.component.removeFilterTag()}"></sf-button>
                </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
}

function renderToolbar(context) {
  const {
    state
  } = context.component;
  const {
    value
  } = state.search;
  const filterTags = context.component.getCurrentFilterTags();
  const filterValues = context.component.getCurrentFilterValues();
  const hasUnsavedFilterDataChanges = context.component.hasUnsavedFilterDataChanges();
  const activeFilterTags = Object.entries(filterTags || {}).filter(([, tag]) => tag?.active !== false);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div
                class="sf-table-toolbar flex gap-1/2 content-main-between flex-none"
                data-sf-filter-tags="${activeFilterTags.length ? '1' : '0'}"
        >
            <div class="sf-table-toolbar-start flex items-cross-center gap-1/3 flex-wrap min-w-0">
                ${context.component.offersFilter(activeFilterTags.length) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="flex items-cross-center">
                    <!-- C301 (3): only «Создать» is filled; «Фильтр» has an
                         outline, and a tone while conditions are set. -->
                    <sf-button
                            size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            appearance=${activeFilterTags.length || context.filterHeld ? 'tonal' : 'outline'}
                            scheme=${activeFilterTags.length || context.filterHeld ? 'primary' : 'on-surface'}
                            text=${context.filterName || context.filterText}
                            segment=${context.filterTemplates ? 'start' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            icon-start="filter_list"
                            @click=${e => {
    context.component.openContextMenu(e, {
      type: 'bottom',
      menu: 'filter-settings'
    });
  }}
                    ></sf-button>
                    ${context.filterTemplates ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-button-icon
                            size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            appearance=${activeFilterTags.length || context.filterHeld ? 'tonal' : 'outline'}
                            scheme=${activeFilterTags.length || context.filterHeld ? 'primary' : 'on-surface'}
                            aria-label=${context.component.text('saveFilterTemplateLabel')}
                            ?disabled=${!activeFilterTags.length}
                            segment="end"
                            icon="bookmark_add"
                            @click=${e => {
    context.component.openContextMenu(e, {
      type: 'bottom',
      menu: 'filter-favorites',
      parent: true
    });
  }}
                    ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${activeFilterTags.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <!-- Chips are neighbours 4 apart (C105 H5, --sf-space-1/4); the
                     buttons around them keep the toolbar's 8. -->
                <div class="sf-table-chips flex items-cross-center gap-1/4 flex-wrap min-w-0">
                ${activeFilterTags.map(([k, written]) => {
    // A date chip says its condition (C293 DF-4).
    const tag = { ...written,
      label: context.component.filterChipText(k, written)
    };
    const filterValue = filterValues?.[k] || {};
    const hasFilteredValues = Object.prototype.hasOwnProperty.call(filterValues || {}, k);
    const count = Array.isArray(filterValue.values) ? filterValue.values.length : tag.count || '';
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-table-tags">
                            <sf-tag
                                    kind="default"
                                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    text='${tag.label}'
                                    interactive
                                    closable
                                    :key=${k}
                                    ?active=${hasFilteredValues}
                                    @sf-tag-close="${() => {
      context.component.removeFilterTag(k);
    }}"
                                    @click=${e => {
      context.component.openContextMenu(e, {
        type: 'bottom',
        menu: 'tag-settings',
        fieldKey: k,
        anchorSelector: '.sf-tag'
      });
    }}
                                    count='${count}'
                            ></sf-tag>
                        </div>`;
  })}
                </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${activeFilterTags.length || hasUnsavedFilterDataChanges ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    ${hasUnsavedFilterDataChanges ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button
                                size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                appearance="tonal"
                                scheme="primary"
                                text=${context.component.text('saveText')}
                                @click="${() => context.component.saveCurrentFilterTemplateData()}"
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${activeFilterTags.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button
                                size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                appearance="outline"
                                scheme="on-surface"
                                text=${context.clearText}
                                @click="${() => context.component.removeFilterTag()}"
                        ></sf-button>
                    ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>

            <div class="sf-table-toolbar-end flex items-cross-center gap-1/3 flex-wrap flex-auto min-w-0">
                <sf-input
                        size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        root-class="sf-search-input m-inline-start-auto"
                        appearance="bordered"
                        value="${value}"
                        placeholder=${context.searchPlaceholder}
                        name="sf_table_search"
                        input-type="search"
                        icon-start="search"
                        clearable
                        aria-label=${context.searchPlaceholder}
                        @input=${e => {
    context.component.searchChange({
      value: getEventInputValue(e, value)
    });
  }}
                        @keydown=${e => {
    context.component.handleSearchKeyDown(e);
  }}
                        @keyup=${e => {
    context.component.handleSearchKeyUp(e);
  }}
                ></sf-input>

                ${context.layoutSwitch ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <sf-segmented class="sf-table-layout-switch" size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-label=${context.component.text('layoutSwitchLabel')}
                            value=${context.shownLayout}
                            .items=${context.component.layoutSwitchItems()}
                            @change=${e => {
    const chosen = e.detail?.value;
    if (chosen === 'list' || chosen === 'table') context.component.setLayoutChoice(chosen);
  }}></sf-segmented>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

                ${context.actions && context.creatable ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <div class="flex items-cross-center">
                                <sf-button
                                        size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                        appearance="default"
                                        scheme="primary"
                                        text=${context.createText}
                                        segment=${state.createItems?.length ? 'start' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                        @click=${() => context.component.requestCreateIntent(null)}
                                ></sf-button>
                                ${state.createItems?.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                    <sf-button-icon
                                            size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                            appearance="default"
                                            scheme="primary"
                                            segment="end"
                                            icon="keyboard_arrow_down"
                                            aria-label=${context.component.text('createMoreLabel')}
                                            aria-haspopup="menu"
                                            @click=${e => {
    context.component.openContextMenu(e, {
      type: 'bottom',
      menu: 'create'
    });
  }}
                                    ></sf-button-icon>
                                ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            </div>
                        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}

                <!-- The extra actions of the view, from the host. Column
                     settings are not here: they are the gear in the table's own
                     head, where they have always been. Without actions there is
                     no control, because an empty menu is a dead end. -->
                ${context.settings && state.toolbarActions?.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-button-icon
                                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    appearance="outline"
                                    scheme="on-surface"
                                    icon="more_horiz"
                                    aria-label=${context.component.text('contextViewActionsLabel')}
                                    aria-haspopup="menu"
                                    @click=${e => {
    context.component.openContextMenu(e, {
      menu: 'toolbar-actions'
    });
  }}
                            ></sf-button-icon>
                        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
        </div>
    `;
} // The state the region is actually in: the author's data-state, or what the
// rows resolve to. It is declared on the region, not guessed from the markup.
// What the table says when it has no rows, one brick for every reason
// (owner, 2026-10-14): sf-empty-state at the table's size, the reason and its
// one action from what the table and its data view know -- no access, could
// not load (Повторить), nothing found (what the reset clears), no data
// (Создать when the table may create). A slot `empty` replaces it whole.


function renderEmptyState(context, dataState) {
  const component = context.component; // The page's own state (C296): slot="empty" for no records, slot="error"
  // for a failed load; an error without one falls back to the empty slot
  // as before, then to the Framework's sf-empty-state.

  const slot = dataState === 'error' && component?.hasSlotContent?.('error') ? 'error' : 'empty';
  if (component?.hasSlotContent?.(slot)) return component.getSlotContent(slot);
  const brick = component.emptyBrick(dataState);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-empty-state kind=${brick.kind} size=${brick.size} heading-level=${brick.headingLevel}
                                icon=${brick.icon || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} heading=${brick.title || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} text=${brick.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing} live=${brick.live || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                .actions=${brick.actions}></sf-empty-state>`;
}

function resolvedDataState(context) {
  if (context.dataState !== 'auto') return context.dataState;
  const data = context.component?.getTableData?.() ?? {};
  if ((data.rows || []).length) return 'populated'; // Nothing given yet -- no columns, no rows -- is a table waiting for its
  // first answer, drawn as its skeleton: «Пока ничего нет» stood there
  // before any answer came (owner, 2026-10-15, frame by frame).

  if (!(data.columns || []).length) return 'loading';
  return 'empty';
}

function renderHeadLabel(context, column) {
  // The actions column is as wide as its icons, and its heading broke in two
  // over them («Дей / ствия»): it is named for assistive technology only.
  if (column.key === 'actions' && !column.component) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-visually-hidden">${column.label}</span>`;
  } // The gear opens the column settings; without them (settings-menu="false",
  // a host that saves no personal settings) the column keeps its row menus and
  // its heading is only a name.
  // settings="false" with row actions keeps the column for the «≡» alone.


  if (column.key === 'settings' && (context.settingsMenu === false || context.settings === false)) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-visually-hidden">${context.component.text('settingsColumnLabel')}</span>`;
  }

  const content = column.component ? context.component.renderSmartElement(column.component.type, column.component.props) : column.label;

  if (column.sortable !== true || column.system) {
    return content;
  }

  const sort = context.component.state.sort || {};
  const direction = sort.key === column.key ? sort.direction : null; // The mark stands only at the sorted column (owner decision C146 (6));
  // the others show, on hover and focus, the arrow a press would give.

  const icon = direction === 'desc' ? 'arrow_downward' : 'arrow_upward';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <button type="button" class="sf-table-sort-button flex items-cross-center gap-1/4 min-w-0"
                data-direction=${direction || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <span class="truncate">${content}</span>
            <i class="sf-icon sf-table-sort-icon" aria-hidden="true">${icon}</i>
        </button>
    `;
}

function ariaSort(context, column) {
  if (column.sortable !== true || column.system) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const sort = context.component.state.sort || {};
  if (sort.key !== column.key) return 'none';
  return sort.direction === 'asc' ? 'ascending' : 'descending';
}

function renderHead(context) {
  if (context.component?.hasSlotContent?.("head")) {
    return context.component.getSlotContent("head");
  }

  const columns = context.component?.getColumns?.() || [];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <thead class="sticky top-0 z-5">
        <tr>
            ${columns.map((column, k) => {
    return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_2__.keyed)(`head:${column.key}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <th
                                    class="relative"
                                    data-key="${column.key}"
                                    data-label="${column.label || column.key || ''}"
                                    data-sf-cell=${cellKind(context.component, column, columns)}
                                    data-sf-pinned=${context.component.isPinnedColumn(column) ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    style=${context.component.getStickyCellStyle(columns, k) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    aria-sort=${ariaSort(context, column)}
                                    @click=${column.sortable === true ? event => context.component.handleHeaderSortClick(event, column) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            >
                                ${column.system || k === columns.length - 1 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderHeadLabel(context, column)}${k === columns.length - 1 ? renderTipSurfaces(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div
                                        class="sidebar-resizer flex items-cross-center h-full select-none"
                                >
                                    ${renderHeadLabel(context, column)}
                                    <!-- The width is taken by the line between
                                         two headers. There is no handle to find
                                         first: this is the line's own hit strip,
                                         invisible, astride the separator, and
                                         still a button with its name and its
                                         arrows. It is no Tab stop of its own
                                         (owner decision C146 (8), the resizer
                                         study RS-10): the table is one stop;
                                         the keyboard reaches it from the head's
                                         menu, «Изменить ширину» (C158 (5)). -->
                                    <button type="button"
                                            tabindex="-1"
                                            role="separator"
                                            aria-orientation="vertical"
                                            class="sf-table-column-resizer"
                                            id=${context.component.getColumnResizerId(column.key)}
                                            data-sf-column-resizer=${column.key}
                                            aria-label="${context.component.text('columnResizeLabel')}: ${column.label || column.key}"
                                            aria-keyshortcuts="ArrowLeft ArrowRight Home End Enter Escape"
                                    ></button>
                                </div>`}
                            </th>`);
  })}
        </tr>
        </thead>
    `;
} // The tooltip of a cut name (owner decision C146 (7)): one surface for the
// table, in the head of the last column, which every cut name names by id
// (data-tooltip). A surface in each row cost about ten nodes a row and broke
// the thirty nodes a row of a long list (standard 1.3.8 gate 17).


function renderTipSurfaces(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 sf-tooltip--arrow-bottom-inline-start" hidden id=${context.component.tipId('title')}><span class="sf-tooltip-content"><span class="sf-tooltip-text"></span></span></span>`;
}

function toColumnSize(value) {
  if (value === null || typeof value === "undefined" || value === "") {
    return "";
  }

  return typeof value === "number" ? `${value}px` : String(value);
} // How narrow a data column may become before it stops being readable.
//
// A fixed-layout table divides whatever room it has between its columns and
// will divide it to nothing: at 620px with five columns they came out 61px
// each, which shreds «Код решения» over three lines and cannot hold a date at
// all. The consumer asked for a floor and for the table to scroll instead
// (Larena, 2026-10-06; measured on the admin reference, 2026-10-09).
//
// It is the table's own min-width rather than the columns', because
// `table-layout: fixed` ignores a minimum on a cell -- the widths come from
// the first row. So the floor is summed here and the table carries the total;
// the scroll box around it already scrolls, and starts doing so the moment the
// sum does not fit.
//
// System columns are not in it: select, settings and actions are sized for what
// they hold and are not text anyone reads.
// Field types whose values are prose rather than a name or a code: drawn on one
// line in a row (see renderCellValue).


const LONG_TEXT_TYPES = new Set(['text', 'textarea', 'markdown', 'html']);
const SYSTEM_COLUMNS = new Set(['select', 'settings', 'actions']); // The first load draws the rows it is waiting for, in the Framework's skeleton
// (owner, 2026-10-12): the shape of the list is on screen before its records,
// instead of one spinner in an empty table. Widths vary by row and column so
// the placeholder reads as text, not as a grid of bars. The words are for a
// reader and stay in a status; the bars are hidden from one.

const SKELETON_ROWS = 6;
const SKELETON_WIDTHS = ['w-3/4', 'w-1/2', 'w-2/3', 'w-1/3', 'w-2/5', 'w-3/5']; // Where a loaded row has a box, a menu or a gear, a loading row keeps a block
// as tall as that control, so the row is as tall before the data as after it
// (owner, 2026-10-14: the rows jumped when the data came).

const skeletonControl = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-skeleton-control" aria-hidden="true"></div>`;

const skeletonBar = (row, column) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-skeleton sf-skeleton--animation-pulse" aria-hidden="true">
    <div class="sf-skeleton-text sf-skeleton-text--size-1/2 ${SKELETON_WIDTHS[(row + column * 2) % SKELETON_WIDTHS.length]}"></div>
</div>`; // The floor is the component's measurement, not a declaration here: it is
// applied to a column only while there is not room for every column to be
// readable. Written always it would be the width rather than a minimum -- a
// cell that needs more would wrap and a typed row would grow, measured at 81px
// against 57 (owner, 2026-10-09).
// A column's width, floor and cap as its <col> style: the template draws it,
// and the table writes it straight onto the <col> after measuring its content,
// rather than rendering itself again for it (owner, 2026-10-15: a sort was five
// renders of four hundred elements).


function columnStyle(component, column) {
  // A width the host declared gives back what it holds above the column's
  // content before the box scrolls (fittedWidth); the person's own width
  // (colWidth) stays as set.
  const width = (column.colWidth == null ? component?.fittedWidth?.(column) : '') || toColumnSize(column.colWidth ?? column.width ?? column.size) || (column.key === 'actions' ? component?.actionsColumnWidth || 'var(--sf-table--actions-column-width, var(--sf-f0))' : '') || component?.contentWidth?.(column) // A content-sized table takes no floor: each data column gets its
  // content width and the one that takes the spare room its content
  // width at least (the table's least width), as the unmeasured
  // first paint lays them out. Floored before the widths were
  // measured, or the spare room's column after, the columns stood at
  // 160 on a phone for a frame and every printed cell moved.
  || (component?.columnsAreCramped && !component?.contentSized && component?.columnTakesFloor?.(column) ? 'var(--sf-table--column-min-inline-size)' : '');
  const minWidth = toColumnSize(column.min_width ?? column.minWidth);
  const maxWidth = toColumnSize(column.maxWidth);
  return [width ? `width: ${width}` : "", minWidth ? `min-width: ${minWidth}` : "", maxWidth ? `max-width: ${maxWidth}` : ""].filter(Boolean).join("; ");
}

function renderColgroup(context) {
  const columns = context.component?.getColumns?.() || []; // A keyed table on a phone (C259) lays its few cells out by their
  // content: the name takes what the others leave (default.css).

  if (!columns.length || context.keyedNarrow) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <colgroup>
            ${columns.map(column => {
    // In a fixed layout the column widths come from here, and a
    // column with none is given whatever is left -- divided to
    // nothing when there is little. The floor is written as the
    // width: fixed layout shares any surplus between the columns
    // that have one, so they grow together above it and stop
    // shrinking below it, and the scroll box takes over.
    // `||` and not `??`: toColumnSize answers with an empty string
    // for a column nobody sized, and an empty string is neither
    // null nor undefined. The same shape cost sf-button its icon
    // shortcut for as long as that component existed.
    // The actions column is sized for its buttons. Without a width it
    // took whatever room was left -- a thousand pixels on a wide
    // page -- and the data columns were measured as cramped beside
    // it and held at their floor.
    const style = columnStyle(context.component, column); // The column that takes the spare room is marked, so a first
    // paint the code has not measured yet gives it the spare room
    // too (default.css, the unmeasured content-sized table).

    const spare = column.key && column.key === context.component?.spareRoomColumnKey?.();
    return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_2__.keyed)(`col:${column.key}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <col
                            data-key=${column.key || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            data-sf-spare-room=${spare ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            style=${style || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    />
                `);
  })}
        </colgroup>
    `;
} // Several values in a cell -- tags for each choice, badges for each language --
// stay on one line: what does not fit folds into «+N», whose title names the
// rest (owner, 2026-10-13). Wrapped, three tags made a row three lines tall in
// a list of one-line rows. The folded values stay in the text, visually hidden,
// so a screen reader still reads them all; the table's afterRender does the
// folding (fitCellValues), because only the laid-out row knows what fits.


function renderCellValues(items, owner) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-table-cell-values flex items-cross-center gap-1/3">
            ${items.map(item => renderCellItem(item, owner))}
            <span class="sf-table-cell-more" aria-hidden="true" hidden></span>
        </div>
    `;
}

function renderComponent(component, owner) {
  if (!component?.type) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  const props = { ...(component.props || {})
  };
  return owner.renderCellElement ? owner.renderCellElement(component.type, props) : owner.renderSmartElement(component.type, props);
}

function renderCellItem(item, owner) {
  if (item === null || typeof item === "undefined") {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  } // What the shared renderer set answers with is markup, not a descriptor.
  // Nine of its eleven cell renderers happen to answer with a descriptor --
  // a badge, a tag, an avatar, a reference link -- and the two that answer
  // with markup, the colour and the included block, fell through the object
  // branch below and were dropped: every colour cell and every code cell in
  // every table drew nothing at all. A unit calling the renderer saw correct
  // markup, so only a table could show it (admin polygon, 2026-10-10).


  if ((0,lit_directive_helpers_js__WEBPACK_IMPORTED_MODULE_5__.isTemplateResult)(item)) {
    return item;
  }

  if (typeof item === "object") {
    const {
      component,
      props: itemProps,
      ...itemMeta
    } = item;

    if (!component?.type) {
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    }

    return renderComponent({ ...component,
      props: { ...itemMeta,
        ...(itemProps || {}),
        ...(component.props || {})
      }
    }, owner);
  }

  return item;
}

function renderLinkCell(value) {
  const cell = (0,_link_cell_contract_js__WEBPACK_IMPORTED_MODULE_7__.normalizeTableLinkCell)(value);

  if (!cell) {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  } // The link is the SIMAI Framework's sf-reference-link on the cell's text
  // line, as the field renderers draw a reference in a cell (VF-10); the
  // supporting line under it stays the list's own text. Without a safe href
  // the words are plain text: a link that leads nowhere is not drawn as one.


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-table-link-cell flex flex-col min-w-0">
            ${cell.href ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-reference-link
                    line="1/2"
                    appearance="plain"
                    icon=""
                    label=${cell.text}
                    href=${cell.href}></sf-reference-link>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-link-cell-text">${cell.text}</span>`}
            ${cell.subtext === null ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <span class="sf-table-link-cell-subtext sf-text-1/2">${cell.subtext}</span>
            `}
        </span>
    `;
} // A row's markup, composed per arrangement of its cells (standard 1.3.8
// §18.4, simai/ui-pro#2). A row of plain cells is one Lit template with no
// part per cell: its strings are made once for each sequence of cell kinds
// (a box, the row menu, a text, an empty cell, a full cell) and kept, so Lit
// parses each arrangement once and a drawn row holds no marker per cell --
// about twenty-five nodes where a template per cell held forty-six. The
// fragments are fixed; a cell's values are bound, never written as HTML.
// This is the migration form (§16) until template.html is compiled.


const ROW_HOLE = Symbol("row-hole"); // What a column's cells are to the look (owner decision C146): `number`,
// end-aligned with digits of one width and never wrapped (3); `title`, the
// record's name, up to two lines and then an ellipsis with the whole name
// in a tooltip (7). Other cells keep one line.

function cellKind(component, column, columns) {
  if (!column?.key) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  if (component?.isNumberColumn?.(column)) return 'number';
  if (!column.system && column.role === 'title') return 'title';
  if (!column.system && !columns?.some(one => one?.role === 'title') && columns?.find(one => one?.key && !SYSTEM_COLUMNS.has(one.key) && !one.system) === column) return 'title';
  return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

const ROW_STRINGS = new Map(); // The actions cell (view 1.6.1, simai/ui-pro#2): its buttons stand only in
// the row a person is on, and an idle row's cell is the bare <td>. It was a
// child part with an empty box in it (a marker and a <div>, 31 nodes a row
// where 29 do). The cell keeps one kind whether its buttons show or not,
// bound on the cell itself (an element part has no marker): a row whose
// strings change is drawn anew, and the focus that brought the buttons in
// would leave with the old row.

class ActionsCellDirective extends lit_directive_js__WEBPACK_IMPORTED_MODULE_1__.Directive {
  constructor(part) {
    super(part);
    if (part.type !== lit_directive_js__WEBPACK_IMPORTED_MODULE_1__.PartType.ELEMENT) throw new Error("actionsCell binds an element");
  }

  render() {
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

  update(part, [content, host]) {
    // A cell never drawn into stays bare; once drawn, Lit's own part
    // empties it.
    if (content !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing || part.element.childNodes.length) (0,lit__WEBPACK_IMPORTED_MODULE_0__.render)(content, part.element, {
      host
    });
    return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  }

}

const actionsCell = (0,lit_directive_js__WEBPACK_IMPORTED_MODULE_1__.directive)(ActionsCellDirective);

function rowStrings(kinds) {
  const signature = kinds.join("|");
  const known = ROW_STRINGS.get(signature);
  if (known) return known;
  const pieces = ['<tr data-selected=', ROW_HOLE, ' aria-selected=', ROW_HOLE, ' draggable=', ROW_HOLE, ' aria-level=', ROW_HOLE, ' aria-expanded=', ROW_HOLE, ' aria-setsize=', ROW_HOLE, ' aria-posinset=', ROW_HOLE, ' aria-busy=', ROW_HOLE, ' aria-rowindex=', ROW_HOLE, ' data-row-id=', ROW_HOLE, ' data-current=', ROW_HOLE, ' aria-current=', ROW_HOLE, ' tabindex="-1" @mousedown=', ROW_HOLE, ' @click=', ROW_HOLE, ' @dblclick=', ROW_HOLE, ' @keydown=', ROW_HOLE, '>'];

  for (const kind of kinds) {
    pieces.push('<td data-key=', ROW_HOLE, ' data-item=', ROW_HOLE, ' data-sf-cell=', ROW_HOLE, ' data-sf-pinned=', ROW_HOLE, ' style=', ROW_HOLE); // The actions cell's buttons are bound on the cell (actionsCell).

    pieces.push(...(kind === 'actions' ? [' ', ROW_HOLE, '>'] : ['>']));

    if (kind === 'box') {
      pieces.push('<label class=', ROW_HOLE, '><span class="sf-checkbox-box transition flex"><input type="checkbox" data-sf-row-box value=', ROW_HOLE, ' .checked=', ROW_HOLE, ' aria-label=', ROW_HOLE, ' @change=', ROW_HOLE, // The tick: checkbox class markup draws the glyph of the
      // .sf-icon inside the box (sf-checkbox's own template does the
      // same with sf-icon); without it a checked row showed a filled
      // box and no tick (DEV recipes p1, 2026-11-15).
      '><i class="sf-icon sf-icon--weight-regular pointer-event-none" aria-hidden="true" .textContent=', ROW_HOLE, '></i></span></label>');
    } else if (kind === 'menu') {
      pieces.push('<button type="button" class=', ROW_HOLE, ' aria-label=', ROW_HOLE, ' value="menu" data-sf-row-menu @click=', ROW_HOLE, '><i class="sf-icon sf-icon--weight-regular pointer-event-none" aria-hidden="true">menu</i></button>');
    } else if (kind === 'text') {
      pieces.push('<span class=', ROW_HOLE, ' title=', ROW_HOLE, ' .textContent=', ROW_HOLE, '></span>');
    } else if (kind === 'time') {
      // A date (C40, PD-9): a time element with the record's own day.
      pieces.push('<time class=', ROW_HOLE, ' datetime=', ROW_HOLE, ' title=', ROW_HOLE, ' .textContent=', ROW_HOLE, '></time>');
    } else if (kind === 'node') {
      pieces.push(ROW_HOLE);
    }

    pieces.push('</td>');
  }

  pieces.push('</tr>');
  const strings = [''];

  for (const piece of pieces) {
    if (piece === ROW_HOLE) strings.push('');else strings[strings.length - 1] += piece;
  }

  const made = Object.freeze(Object.assign(strings, {
    raw: Object.freeze(strings.slice())
  }));
  ROW_STRINGS.set(signature, made);
  return made;
}

function renderTableTemplate(context) {
  const {
    state
  } = context.component;

  function renderBody() {
    if (context.component?.hasSlotContent?.("body")) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <tbody>
                ${context.component.getSlotContent("body")}
                </tbody>`;
    }

    const {
      state
    } = context.component;
    const columns = context.component?.getColumns?.() || [];
    const {
      rows = []
    } = state.data || {};
    const dataState = resolvedDataState(context); // A re-query over rows that are already on screen leaves them there,
    // dimmed, with one small spinner in the middle of what the person can
    // see. Replacing them with a loader — which is what happened before —
    // threw away the place they were reading and moved the answer to the top
    // left corner of an empty table.

    if (dataState === 'loading' && rows.length) {
      return renderRows(context, columns, rows, {
        busy: true
      });
    }

    if (dataState !== 'populated') {
      const stateContent = {
        // One indicator, the same one a re-query shows, centred in the
        // body rather than lined up at its start. The spinner paints its
        // own `label` as text and defaults it to "Loading...", so it is
        // given an empty one: the words are for a reader, in the
        // language the host set, and the circle is for everyone else.
        // Before this there were two indicators here, one of them in
        // English on a Russian page.
        loading: null,
        error: renderEmptyState(context, 'error'),
        empty: renderEmptyState(context, 'empty')
      }[dataState] || renderEmptyState(context, 'empty');

      if (dataState === 'loading') {
        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <tbody data-state="loading" class="sf-table-skeleton">
                        ${Array.from({
          length: SKELETON_ROWS
        }, (_, row) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<tr aria-hidden="true">
                            ${columns.some(column => !SYSTEM_COLUMNS.has(column?.key)) ? columns.map((column, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<td>${SYSTEM_COLUMNS.has(column?.key) ? skeletonControl : skeletonBar(row, at)}</td>`) // Before the host's first answer the columns are not
        // known yet: three bars across the whole row.
        : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<td colspan=${String(Math.max(columns.length, 1))}>
                                        <div class="flex gap-2">${[0, 1, 2].map(at => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="flex-1">${skeletonBar(row, at)}</div>`)}</div>
                                    </td>`}
                        </tr>`)}
                    </tbody>
                    <tbody><tr><td colspan=${String(Math.max(columns.length, 1))} class="sf-table-visually-hidden">
                        <span role="status">${context.loadingText}</span>
                    </td></tr></tbody>
                `;
      }

      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <tbody data-state=${dataState}>
                    <tr>
                        <td colspan=${String(Math.max(columns.length, 1))}>
                            <div class="sf-table-state">${stateContent}</div>
                        </td>
                    </tr>
                </tbody>
            `;
    }

    return renderRows(context, columns, rows);
  } // The compact list: each record as a block -- its box, its title (with the
  // tree's indent and button when it is a tree), the few fields the columns'
  // priority puts first, and its row menu. Opening and selecting are the
  // row's, so a record does in the list what it does in the table. The rest
  // of the record is the record panel's, opened the way a row opens it.


  function renderList() {
    const columns = context.component?.getColumns?.() || [];
    const {
      rows = []
    } = state.data || {};
    const dataState = resolvedDataState(context);

    if (dataState !== 'populated' && !(dataState === 'loading' && rows.length)) {
      if (dataState === 'loading') {
        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-list sf-table-skeleton flex flex-col" data-state="loading">
                    ${Array.from({
          length: SKELETON_ROWS
        }, (_, row) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-list-item flex flex-col gap-1/3 p-1" aria-hidden="true">
                        ${skeletonBar(row, 0)}${skeletonBar(row, 1)}
                    </div>`)}
                    <span class="sf-table-visually-hidden" role="status">${context.loadingText}</span>
                </div>`;
      }

      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-state" data-state=${dataState}>${renderEmptyState(context, dataState)}</div>`;
    }

    const select = columns.find(column => column.key === 'select'); // A list whose host offers no row actions draws no «≡» on a phone
    // either, as the desktop table (VR14-4; rowMenuHasUse).

    const menu = context.component.rowMenuHasUse?.() === false ? null : columns.find(column => column.key === 'settings');
    const roles = context.component.listRoles?.(columns);
    if (roles?.any) return renderResourceList(columns, rows, dataState, roles, select, menu);
    const data = columns.filter(column => column?.key && !['select', 'settings', 'actions'].includes(column.key) && !column.system && column.visible !== false);
    const title = data.find(column => column.role === 'title') ?? data[0]; // The title the host marked opens its record with one click here as
    // in the table's title column; a list on a laptop is the same admin.

    const listTitle = row => title.role === 'title' ? renderTitleLink(context, row, renderCellValue(row, title)) : renderCellValue(row, title); // The person's «На телефоне» fields, else the first list-fields by
    // priority (LV3-11; phoneShownKeys).


    const phoneKeys = context.component.phoneShownKeys?.(columns);
    const limit = Math.max(0, Number(context.component.getProp?.('listFields') ?? 3) || 0);
    const fields = phoneKeys ? phoneKeys.map(key => data.find(column => String(column.key) === key && column !== title)).filter(Boolean) : data.filter(column => column !== title).map((column, order) => ({
      column,
      order
    })).sort((a, b) => (a.column.priority ?? 1e6) - (b.column.priority ?? 1e6) || a.order - b.order).slice(0, limit).map(({
      column
    }) => column);

    const filled = value => !(value === null || value === undefined || value === '' || Array.isArray(value) && !value.length); // A record list (C259, VT-2): «≡» right after the box, where the
    // table has it; the quick actions of a resource list (C31) keep the end.


    const record = !context.quickActionIds?.length;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderListHead(select)}
            <ul class="sf-table-list" role="list" id=${`${context.rowAreaId}-list`} aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-busy=${dataState === 'loading' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
                ${rows.map((row, rowIndex) => row.__tree?.more ? (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_2__.keyed)(`item:${row.id}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <li class="sf-table-list-more" style=${`--sf-table-tree--level: ${row.__tree.level}`}>
                            <sf-button appearance="ghost" size="1/2" text=${context.component.text('treeMore')}
                                       @click=${() => context.component.requestTreeMore(row)}></sf-button>
                        </li>`) : (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_2__.keyed)(`item:${context.component.rowsGeneration?.() ?? 0}:${row.id ?? rowIndex}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <li class="sf-table-list-item"
                            data-sf-record=${record && menu ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            data-row-id=${context.component.getRowKey(row, rowIndex)}
                            data-selected=${row.select?.component?.props?.checked === true ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            data-current=${context.component.isCursorRow(row, rowIndex) ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-current=${context.component.isCurrentRow(row, rowIndex) ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-level=${row.__tree ? String(row.__tree.level + 1) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-expanded=${row.__tree?.hasChildren ? String(row.__tree.expanded === true) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            tabindex="-1"
                            @mousedown=${event => context.component.handleRowPointerDown(event)}
                            @click=${event => context.component.handleRowClick(event, row, rowIndex)}
                            @dblclick=${event => context.component.handleRowOpen(event, row)}
                            @keydown=${event => context.component.handleRowKeydown(event, row)}>
                            ${select ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-list-select">${renderCellValue(row, select)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            ${record && menu ? renderListMenu(row) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            <div class="sf-table-list-main">
                                <div class="sf-table-list-title">${title ? row.__tree || row.path ? renderTreeCell(context, row, listTitle(row)) : listTitle(row) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>
                                ${fields.some(column => filled(row[column.key])) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                    <div class="sf-table-list-fields">
                                        ${fields.filter(column => filled(row[column.key])).map(column => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                            <span class="sf-table-list-field">
                                                <span class="sf-table-list-label">${column.label ?? column.key}</span>
                                                <span class="sf-table-list-value">${renderCellValue(row, column)}</span>
                                            </span>`)}
                                    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            </div>
                            ${context.quickActionIds?.length ? renderListActions(row, menu) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        </li>`))}
            </ul>`;
  } // The page's box over a phone list (VT-2, BA-6): the head's box, with its
  // words, so a whole page is marked in one press as in the table.


  function renderListHead(select) {
    if (!select) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-list-head" data-sf-list-all>
            ${renderHeadLabel(context, select)}
            <span class="sf-table-list-head-text" aria-hidden="true">${context.component.text('listSelectPage')}</span>
        </div>`;
  } // A record row's «≡» (C259 (3), C146 (5)): the row's one menu, every
  // action of the row; the same menu the right button and a long press open.


  function renderListMenu(row) {
    const component = context.component;
    if (!component.listRowActions(row).rest.length && !component.listRowActions(row).quick.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    const size = context.size === '1/2' ? '1/2' : '1';
    const name = component.getRowNameText(row);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-list-menu"><button type="button"
                class=${`sf-icon-button sf-icon-button--size-${size} sf-icon-button--icon sf-icon-button--ghost sf-icon-button--on-surface flex items-cross-center`}
                aria-label=${name ? `${component.text('contextRowActionsLabel')}: ${name}` : component.text('contextRowActionsLabel')}
                aria-haspopup="menu" data-sf-row-menu
                @click=${event => {
      event.stopPropagation();
      component.openRowMenu(event, row);
    }}><i class="sf-icon sf-icon--weight-regular pointer-event-none" aria-hidden="true">menu</i></button></span>`;
  } // The amount of a record row (C259): the first money (else number)
  // column's value, as its cell shows it.


  function listAmountColumn(columns) {
    const data = columns.filter(column => column?.key && !SYSTEM_COLUMNS.has(column.key) && !column.system && column.visible !== false);

    const type = column => column.propertyType ?? column.property_type ?? column.type;

    const kept = column => (context.component.phoneRole?.(column, columns) ?? column.list) !== 'hidden';

    return data.find(column => type(column) === 'money' && kept(column)) ?? data.find(column => context.component.isNumberColumn?.(column) && kept(column)) ?? null;
  } // ─── the list of resources (owner decision C31) ─────────────────────────
  // A row is the status dot, the title over a supporting line («domain ·
  // kind»), the facts as badges without labels in columns of one width,
  // and the quick actions with the «more» menu. The roles are the columns'
  // (columns[].list); a column without one is the record panel's.


  function renderResourceList(columns, rows, dataState, roles, select, menu) {
    const component = context.component;

    const visible = column => column && column.visible !== false;

    const status = visible(roles.status) ? roles.status : null;
    const data = columns.filter(column => column?.key && !['select', 'settings', 'actions'].includes(column.key) && !column.system);
    const title = roles.title ?? data.find(column => column.role === 'title' && column.list !== 'hidden') ?? data.find(column => !column.list) ?? data[0];
    const supporting = roles.supporting.filter(visible);
    const facts = roles.facts.filter(visible);
    const opensRow = component.getAttribute('row-open') === 'row'; // A record list (C259, VT-2): no quick actions -- «≡» after the box,
    // the title over its second line, then every fact and the amount.

    const record = !context.quickActionIds?.length; // The amount once: a money column the facts already show is not drawn again.

    const amountColumn = record ? listAmountColumn(columns) : null;
    const amount = amountColumn && !facts.includes(amountColumn) ? amountColumn : null;

    const titleOf = row => {
      const text = component.listText(title, row[title?.key]);
      return title?.role === 'title' || roles.title || opensRow ? renderTitleLink(context, row, text) : text;
    };

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${renderListHead(select)}
            <ul class="sf-table-list sf-table-list--resource" role="list" id=${`${context.rowAreaId}-list`} aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-busy=${dataState === 'loading' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                style=${`--sf-table-resource--actions: ${Math.max(1, (context.quickActionIds?.length ?? 0) + (menu ? 1 : 0))}`}>
                ${rows.map((row, rowIndex) => {
      if (row.__tree?.more) return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_2__.keyed)(`item:${row.id}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <li class="sf-table-list-more" style=${`--sf-table-tree--level: ${row.__tree.level}`}>
                            <sf-button appearance="ghost" size="1/2" text=${component.text('treeMore')}
                                       @click=${() => component.requestTreeMore(row)}></sf-button>
                        </li>`);
      const state = status ? component.listStatus(status, row) : null;
      const shown = facts.map(column => ({
        column,
        fact: component.listFact(column, row)
      })); // The most worrying fact, the one a narrow list keeps.

      const worst = shown.reduce((found, item) => (item.fact?.level ?? 0) > (found?.fact?.level ?? 0) ? item : found, null);
      const words = supporting.map(column => component.listText(column, row[column.key])).filter(Boolean); // The state's word leads the line for every state (LV3-24); a
      // wide list keeps it for a stopped one only (C31).

      const lead = state?.word ?? '';
      const coloured = state && state.dot !== 'neutral';
      return (0,lit_directives_keyed_js__WEBPACK_IMPORTED_MODULE_2__.keyed)(`item:${component.rowsGeneration?.() ?? 0}:${row.id ?? rowIndex}`, (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <li class="sf-table-list-item sf-table-resource"
                            data-sf-record=${record && menu ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            data-sf-quick-list=${record ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : ''}
                            data-row-id=${component.getRowKey(row, rowIndex)}
                            data-selected=${row.select?.component?.props?.checked === true ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            data-current=${component.isCursorRow(row, rowIndex) ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-current=${component.isCurrentRow(row, rowIndex) ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            data-status=${state?.dot ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            data-open=${opensRow && component.canOpenRow?.(row) ? 'row' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-level=${row.__tree ? String(row.__tree.level + 1) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-expanded=${row.__tree?.hasChildren ? String(row.__tree.expanded === true) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            tabindex="-1"
                            @mousedown=${event => component.handleRowPointerDown(event)}
                            @click=${event => component.handleRowClick(event, row, rowIndex)}
                            @dblclick=${event => component.handleRowOpen(event, row)}
                            @keydown=${event => component.handleRowKeydown(event, row)}>
                            ${select ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-list-select">${renderCellValue(row, select)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            ${record && menu ? renderListMenu(row) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            ${status ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-resource-status">${state ? tooltip((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <span class="sf-dot sf-dot--${state.dot}" data-tooltip="" data-status=${state.value}>
                                    <span class="sf-dot-item"></span>
                                    <span class="sf-table-visually-hidden">${state.word}</span>
                                </span>`, state.word) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            <span class="sf-table-resource-main">
                                <span class="sf-table-resource-title">${title ? row.__tree || row.path ? renderTreeCell(context, row, titleOf(row)) : titleOf(row) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
                                ${lead || words.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-resource-supporting">${lead ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-resource-lead" data-coloured=${coloured ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${lead}${words.length ? ' · ' : ''}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${words.join(' · ')}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            </span>
                            ${record && menu ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-list-end">
                                ${shown.filter(({
        fact
      }) => fact).map(({
        column,
        fact
      }) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-resource-fact">${renderFact(column, fact)}</span>`)}
                                ${amount && row[amount.key] !== undefined && row[amount.key] !== null && row[amount.key] !== '' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-list-amount"><span class="sf-table-visually-hidden">${amount.label ?? amount.key}: </span>${renderCellValue(row, amount)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            </span>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            ${facts.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-resource-facts">${shown.map(({
        column,
        fact
      }) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <span class="sf-table-resource-fact" data-worst=${fact && worst?.column === column && fact.level > 0 ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${fact ? renderFact(column, fact) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            ${renderListActions(row, menu)}`}
                        </li>`);
    })}
            </ul>`;
  } // A fact: a badge without its column's label, which a screen reader
  // still hears; quiet when all is well, warning or error when not.


  function renderFact(column, fact) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-visually-hidden">${column.label ?? column.key}: </span>${renderFactBadge(fact)}`;
  } // The badge of a fact, in a list row and in a table cell alike.


  function renderFactBadge(fact) {
    const size = context.size === '1/2' ? '1/3' : '1/2';
    const badge = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge size=${size} appearance="tonal"
                scheme=${fact.status ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : fact.scheme || 'neutral'} status=${fact.status || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                text=${fact.text} data-tooltip=${fact.tip ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}></sf-badge>`;
    return fact.tip ? tooltip(badge, fact.tip) : badge;
  } // The Framework's tooltip: the trigger and its surface in one anchor
  // (component tooltip), shown on hover and on keyboard focus.


  function tooltip(trigger, text) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-tooltip-anchor">${trigger}<span class="sf-tooltip sf-tooltip--dark sf-tooltip--size-1/3 sf-tooltip--arrow-bottom-center" hidden><span class="sf-tooltip-content"><span class="sf-tooltip-text">${text}</span></span></span></span>`;
  } // A list row's actions (C31): up to three quick ones as icon buttons,
  // always shown (folded away on a narrow list), then «more» (more_horiz),
  // whose menu holds every action of the row (C259 (3)).


  function renderListActions(row, menu) {
    const component = context.component; // The rest is the row menu's, and a table without its menu column
    // (settings="false") has none: then only the quick ones are drawn.

    const split = component.listRowActions(row);
    const quick = split.quick;
    const rest = menu ? split.rest : [];
    if (!quick.length && !rest.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    const size = context.size === '1/2' ? '1/2' : '1';
    const button = 'sf-icon-button sf-icon-button--icon sf-icon-button--ghost sf-icon-button--on-surface-variant flex items-cross-center';

    const iconOf = action => action?.icon ?? action?.component?.props?.icon ?? '';

    const press = action => event => {
      event.stopPropagation();
      const handler = action?.component?.props?.['@click'] ?? action?.component?.props?.onClick;
      if (typeof handler === 'function') handler(event);else component.requestActionIntent(action.id, [row.id]);
    };

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-resource-actions" data-only-quick=${rest.length ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : ''}>
            ${quick.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-resource-quick">${quick.map(action => iconOf(action) ? tooltip((0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class=${`${button} sf-icon-button--size-${size}`} data-tooltip=""
                        data-quick-action=${action.id} aria-label=${action.name ?? action.id}
                        @click=${press(action)}><i class="sf-icon" aria-hidden="true">${iconOf(action)}</i></button>`, action.name ?? action.id) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button size=${size} appearance="ghost" scheme="on-surface-variant" data-quick-action=${action.id}
                        text=${action.name ?? action.id} @click=${press(action)}></sf-button>`)}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <button type="button" class=${`${button} sf-icon-button--size-${size} sf-table-resource-more`}
                    aria-label=${component.getRowNameText(row) ? `${component.text('moreActionsLabel')}: ${component.getRowNameText(row)}` : component.text('moreActionsLabel')} aria-haspopup="menu" data-sf-row-menu
                    @click=${event => {
      event.stopPropagation(); // Every action of the row, the quick ones too (C259 (3),
      // C164 (2)): the list the right button opens.

      component.openRowMenu(event, row);
    }}><i class="sf-icon" aria-hidden="true">more_horiz</i></button>
        </span>`;
  } // The title opens its record with one click (owner, 2026-10-14): the
  // column the host marked as the title is a link to the record's view when
  // the row offers it, so a record is a click away rather than a double
  // click or a trip through the row's menu.


  function renderTitleLink(context, row, value) {
    if (!context.component.canOpenRow?.(row) || row?.id == null) return value;
    const address = row.href ?? row.url ?? ''; // A record without an address opens through the view and is a button:
    // a link to «#» opened the same page in a new tab (VT-9).

    if (!address) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-table-title-link"
                @click=${event => {
        event.preventDefault();
        event.stopPropagation();
        if (event.detail > 1) return;
        context.component.requestOpen?.(row, false);
        context.component.requestActionIntent('view', [row.id]);
      }}>${value}</button>`;
    }

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<a class="sf-table-title-link" href=${address}
                @click=${event => {
      if (event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        if (row.href ?? row.url) {
          context.component.requestOpen?.(row, true);
          return;
        }
      }

      event.preventDefault();
      event.stopPropagation(); // The second click of a double click is the same wish:
      // opened once, not twice.

      if (event.detail > 1) return;
      context.component.requestOpen?.(row, false);
      context.component.requestActionIntent('view', [row.id]);
    }}>${value}</a>`;
  } // repeat, not keyed: a sort moves the rows it already drew. keyed at each
  // position redrew every row and every value in it when the order changed --
  // four hundred elements for one click (owner, 2026-10-15).
  //
  // Many entries (standard simai.smart-component 1.3.8 §18.4, gate 17;
  // simai/ui-pro#2). From the quality profile's threshold on (300 rows) the
  // table draws only the rows in view and a margin, with one spacer row
  // above and one below holding the height of the rest; the component keeps
  // the range (windowSlice) and moves it with the scroll. A cell that only
  // shows a value is class markup: the row's box is the checkbox's class
  // markup over a native input, the row's menu the icon button's class
  // markup over a native button, and text a span -- no Smart element per
  // cell, so a row is about twenty-five nodes instead of a hundred and eight.


  function renderRows(context, columns, rows, {
    busy = false
  } = {}) {
    const component = context.component;
    const treeColumn = component.treeColumnKey?.(columns); // The main field is the link that opens the record (owner decision
    // C146 (5), variant В): the column the host marked as the title, else
    // the first data column when it shows a plain value (a column with a
    // renderer or a component of its own keeps it).

    const firstData = columns.find(column => column?.key && !SYSTEM_COLUMNS.has(column.key) && !column.system);
    const titleColumn = columns.find(column => column?.role === 'title' && !column.system)?.key ?? (firstData && !firstData.renderer && !firstData.component && !component.isNumberColumn?.(firstData) ? firstData.key : null);
    const slice = component.windowSlice?.(rows) ?? null;
    const shown = slice ? rows.slice(slice.first, slice.last + 1) : rows;
    const offset = slice ? slice.first : 0;
    const span = String(Math.max(columns.length, 1));
    const draggable = component.hasAttribute('drag-rows') || component.getAttribute('row-reorder') === 'true';
    const selectable = columns.some(column => column?.key === 'select');
    const sticky = columns.map((column, index) => component.getStickyCellStyle(columns, index) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing);
    const cellKinds = columns.map(column => cellKind(component, column, columns));
    const pinned = columns.map(column => component.isPinnedColumn(column) ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing);
    const lined = columns.map(column => Boolean(component.keyLineOf?.(column))); // The stripes are nth-child: a spacer of no height keeps the parity of
    // the drawn rows the parity they have in the whole list.

    const spacer = (height, key) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<tr class="sf-table-window-spacer" aria-hidden="true" data-sf-window-spacer=${key}><td colspan=${span} style=${`block-size: ${Math.max(0, Math.round(height))}px`}></td></tr>`;

    const fullCell = (row, column, kind) => {
      const value = column.key === titleColumn ? renderTitleLink(context, row, renderCellValue(row, column)) : renderCellValue(row, column); // A key cell's second line on a phone (C259): the value of the
      // column the host names in key_line, quiet, one line.

      const line = component.keyLineOf?.(column);

      if (line) {
        const raw = row?.[line];
        const text = String((raw !== null && typeof raw === 'object' ? raw.text ?? raw.label ?? raw.value : raw) ?? '');
        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-key-name">${value}</span>${text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-key-line">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}`;
      } // The name's two lines (C146 (7)) are its cell's text, by the
      // cell's data-sf-cell="title": no element around it.


      if (column.key === treeColumn) return renderTreeCell(context, row, value);
      return value;
    };

    const renderRow = (row, at) => {
      const index = at + offset;
      const current = component.isCurrentRow(row, index);
      const cursor = component.isCursorRow(row, index);
      const kinds = [];
      const marked = row.select?.component?.props?.checked === true;
      const values = [row.select?.component?.props?.checked === true ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, // The grid's selection, read by a screen reader (VT-4): every
      // row of a selectable grid says whether it is marked.
      selectable ? String(marked) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, draggable && !row.__tree?.more ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, row.__tree ? String(row.__tree.level + 1) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, row.__tree?.hasChildren ? String(row.__tree.expanded === true) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, row.__tree ? String(row.__tree.setsize) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, row.__tree ? String(row.__tree.posinset) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, row.__tree?.loading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, component.ariaRowIndex?.(index, Boolean(slice)) ?? (slice ? String(index + 2) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing), component.getRowKey(row, index), cursor ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, current ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing, component.rowPointerDown, event => component.handleRowClick(event, row, index), event => component.handleRowOpen(event, row), event => component.handleRowKeydown(event, row)];
      columns.forEach((column, cellIndex) => {
        // The main field of a row that opens is its link, not markup.
        const opens = column.key === titleColumn && component.canOpenRow?.(row) && row?.id != null;
        const mark = opens || lined[cellIndex] ? null : component.rowMarkupCell?.(row, column) ?? null;
        values.push(column.key, `${row.id}_${column.key}`, cellKinds[cellIndex], pinned[cellIndex], sticky[cellIndex]);

        if (cellKinds[cellIndex] === 'title' && mark?.kind === 'text') {
          // The name as text: two lines by its cell (C146 (7)).
          kinds.push('text');
          values.push('sf-table-cell-text', lit__WEBPACK_IMPORTED_MODULE_0__.nothing, mark.text);
        } else if (mark?.kind === 'box') {
          kinds.push('box');
          values.push(`sf-checkbox sf-checkbox--size-${mark.size} flex content-main-between cursor-pointer`, mark.value, mark.checked, mark.label, mark.change, mark.checked ? 'check' : '');
        } else if (mark?.kind === 'menu') {
          kinds.push('menu');
          values.push(`sf-icon-button sf-icon-button--size-${mark.size} sf-icon-button--icon sf-icon-button--ghost flex items-cross-center sf-icon-button--on-surface`, mark.label, mark.click);
        } else if (mark?.kind === 'text') {
          kinds.push('text');
          values.push(mark.className, mark.title ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing, mark.text);
        } else if (mark?.kind === 'time') {
          kinds.push('time');
          values.push(mark.className, mark.datetime, mark.title ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing, mark.text);
        } else if (mark?.kind === 'empty') {
          kinds.push('empty');
        } else if (column.key === 'actions') {
          kinds.push('actions');
          values.push(actionsCell(fullCell(row, column), component));
        } else {
          kinds.push('node');
          values.push(fullCell(row, column, cellKinds[cellIndex]));
        }
      });
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)(rowStrings(kinds), ...values);
    };

    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<tbody data-busy=${busy ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing} data-sf-window=${slice ? `${slice.first}-${slice.last}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${slice ? spacer(slice.before, 'before') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${slice && slice.first % 2 === 0 ? spacer(0, 'parity') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${(0,lit_directives_repeat_js__WEBPACK_IMPORTED_MODULE_3__.repeat)(shown, (row, at) => row.__tree?.more ? `more:${row.id}` : `row:${component.rowsGeneration?.() ?? 0}:${row.id ?? row.value ?? at + offset}`, (row, at) => row.__tree?.more ? renderMoreRow(context, columns, row) : renderRow(row, at))}${slice ? spacer(slice.after, 'after') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</tbody>`;
  } // The first cell of a tree row: indented by its level, with the button that
  // opens or closes it when the host said it has children, and -- in a search
  // over a tree -- the path it lives under, so a found row says where it is.


  function renderTreeCell(context, row, value) {
    const tree = row.__tree;
    const path = Array.isArray(row.path) && row.path.length ? row.path.map(item => item?.label ?? item).join(' / ') : '';
    if (!tree && !path) return value;
    const level = tree?.level ?? 0;
    const toggle = tree?.hasChildren ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button type="button" class="sf-table-tree-toggle"
                           data-expanded=${tree.expanded ? '' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                           aria-label=${context.component.text(tree.expanded ? 'treeCollapse' : 'treeExpand')}
                           @click=${event => {
      event.stopPropagation();
      context.component.toggleTreeRow(row);
    }}><i class="sf-icon" aria-hidden="true">chevron_right</i></button>` : tree ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-tree-toggle" aria-hidden="true"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // The node's icon, the host's to choose (port 1.9.0): a page with pages
    // under it is still a page. Without one, a folder for a node with
    // children -- open when it is open -- and a document for a leaf.

    const icon = tree ? (tree.expanded ? row.icon_expanded ?? row.icon : row.icon) ?? (tree.hasChildren ? tree.expanded ? 'folder_open' : 'folder' : 'description') : row.icon;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <span class="sf-table-tree-cell" style=${`--sf-table-tree--level: ${level}`}>
                ${toggle}
                ${icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-table-tree-icon" aria-hidden="true">${icon}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                <span class="sf-table-tree-value flex flex-col min-w-0">
                    <span class="min-w-0">${value}</span>
                    ${path ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-tree-path">${path}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </span>
            </span>`;
  } // The next page of one level, as a row of its own at that level.


  function renderMoreRow(context, columns, row) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <tr class="sf-table-tree-more" aria-level=${String(row.__tree.level + 1)}>
                <td colspan=${String(columns.length)}>
                    <span class="sf-table-tree-cell" style=${`--sf-table-tree--level: ${row.__tree.level}`}>
                        <span class="sf-table-tree-toggle" aria-hidden="true"></span>
                        <sf-button appearance="ghost" size="1/2" text=${context.component.text('treeMore')}
                                   @click=${() => context.component.requestTreeMore(row)}></sf-button>
                    </span>
                </td>
            </tr>`;
  }

  function renderCellValue(row, column) {
    if (!column || !row) {
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    }

    let value = row[column.key];

    if (column.renderer === "link") {
      return renderLinkCell(value);
    } // `row.actions` is read here in two vocabularies. From a host it is ids
    // -- `["view"]`, the data view port's word for which of the list's
    // actions apply to this record -- and from a consumer that builds its
    // own controls it is the items themselves. Ids select from the table's
    // list; items are the list.
    //
    // Both went through the second branch before, so an array of ids was
    // handed to the filter AS the action list, where `action.id` is
    // undefined for a string: everything was filtered out and the
    // «Действия» column drew an empty container in every row of every list.
    // A consumer reported it on an embedded one, which is only where they
    // were looking (owner, 2026-10-09).
    // The cell is built from whichever vocabulary the row holds, and built
    // once. From a host `row.actions` is ids -- the data view port's word
    // for which of the list's actions apply to this record -- and after
    // normalizeRow it is the built items.
    //
    // Items are not rebuilt here. Passing them back through the builder
    // made new objects on every render, and a table that hands lit new
    // objects rebuilds the cells rather than keeping them, which costs
    // whatever the cells hold. The round-3 probe measures exactly that.
    // `row.actions` is the host's ids -- the data view port's word for which
    // of the list's actions apply to this record -- or, from a consumer that
    // builds its own controls, the items themselves. Ids select from the
    // list; items are the list. Handing ids to the builder AS the list was
    // the defect: `action.id` is undefined for a string, so everything was
    // filtered out and the «Действия» column drew an empty container in
    // every row of every list (owner, 2026-10-09).
    //
    // The built items are kept on the row, because a render that builds new
    // objects makes lit rebuild the cells rather than keep them, and the
    // cells hold things worth keeping. A re-query brings new row objects,
    // so the cache is fresh exactly when the data is.


    if (column.key === 'actions' && context.component?.getActionRowItems) {
      const built = Array.isArray(value) && value.length && value.every(item => item && typeof item === 'object');
      if (!built) value = context.component.rowActionItems(row);
    } // A column with a list role (C31) draws its value the same way in a
    // table cell as in a list row: a status is the dot with its word, a
    // fact the badge, quiet or warning/error. Without this, the switch to
    // «Таблица» showed a status's raw value (ok, stopped) and dropped a
    // fact given as {text, status, tip} altogether.


    if (column.list === 'status') {
      const state = context.component.listStatus(column, row);
      return state ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-status flex items-cross-center gap-1/3" data-status=${state.dot}>
                <span class="sf-dot sf-dot--${state.dot}" aria-hidden="true"><span class="sf-dot-item"></span></span>
                <span>${state.word}</span></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    } // A plain value of a fact column draws as its type does (LV3-12: the
    // phone row's roles put money and dates raw in pills in the table).


    if (column.list === 'fact' && context.component.factMarked?.(column, row)) {
      return renderFactBadge(context.component.listFact(column, row));
    } // A boolean the host lets this person write is a checkbox in the cell;
    // it is disabled while the host answers.


    if (context.component?.cellEditable?.(row, column)) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-checkbox size=${context.size === '1/2' ? '1/2' : '1'} data-cell-edit=${column.key}
                ?checked=${value === true} ?disabled=${context.component.cellPending(row, column)}
                aria-label=${column.label ?? column.key}
                @change=${event => context.component.setCellValue(row, column, Boolean(event.target?.checked ?? event.detail?.checked))}></sf-checkbox>`;
    }

    if (column.component) {
      if (value !== null && typeof value !== "undefined" && (!Array.isArray(value) || value.length)) {
        return renderCellItem(value, context.component);
      }

      if (column.key === "settings" && (!value || Array.isArray(value) && !value.length)) {
        return renderComponent({
          type: "button-icon",
          props: {
            size: "1",
            appearance: "ghost",
            scheme: "on-surface",
            icon: "menu",
            ariaLabel: context.component.text('menuLabel'),
            value: "menu"
          }
        }, context.component);
      }

      return renderComponent(column.rowComponent || column.component, context.component);
    }

    if (value === null || typeof value === "undefined") {
      return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    } // A long text -- a description, a note -- is one line in a row, cut
    // with an ellipsis; the whole of it is in the title for the pointer and
    // in the text for a screen reader. Wrapped, one description made its row
    // three lines tall in a list of one-line rows (owner, 2026-10-13).


    if (LONG_TEXT_TYPES.has(column.propertyType ?? column.property_type ?? column.type) && (typeof value === "string" || typeof value === "number")) {
      const text = context.component?.cellText?.(column, value) ?? String(value);
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-cell-clip" title=${text}>${text}</span>`;
    } // The renderer set is asked before the shapes below, because a typed
    // cell's value is often an object -- a user or a related record arrives
    // as {value, label, href} -- and the object branch would render nothing
    // for it: it looks for a component the host put there. A cell that does
    // carry the host's own component still wins, which is the check here.


    const carriesHostComponent = typeof value === "object" && !Array.isArray(value) && Boolean(value.component?.type);

    if (!carriesHostComponent) {
      const typed = context.component?.cellValue?.(column, value);

      if (typed !== null && typeof typed !== "undefined") {
        // Badges and tags from the renderer set wrap onto the next line,
        // as the host's own values do: this branch drew them in one
        // line that ran out of the cell (owner, 2026-10-12).
        if (Array.isArray(typed)) {
          // A person -- the avatar, then the name -- stays on one
          // line: wrapping put the avatar above a two-line name. The
          // name wraps beside it instead.
          if (typed[0]?.component?.type === 'avatar') {
            return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <div class="flex flex-nowrap items-cross-center gap-1/3">
                                ${renderCellItem(typed[0], context.component)}
                                <span style="min-inline-size: 0">
                                    ${typed.slice(1).map(item => renderCellItem(item, context.component))}
                                </span>
                            </div>
                        `;
          }

          return renderCellValues(typed, context.component);
        }

        const datetime = typeof typed === "string" ? context.component?.cellDateTime?.(column, value) : "";
        if (datetime) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<time datetime=${datetime} title=${context.component?.cellTitle?.(column, value) ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${typed}</time>`;
        return renderCellItem(typed, context.component);
      }
    }

    if (Array.isArray(value)) {
      if (column.key === 'actions') {
        value = value.filter(el => {
          const {
            actions
          } = state;
          const actionId = el.id || el.component?.props?.value;
          const action = actions.find(action => action.id === actionId); // The host's own actions (its row_actions) live in the row
          // menu: a page has a dozen of them, which drawn in a row of
          // buttons wrapped it to three lines.

          if (el.inline === false) return false;
          return action?.visible ?? true;
        });
      } // Several values -- badges for each language, tags for each choice
      // -- wrap onto the next line when the column is narrower than
      // they are, instead of running out of the cell under the next one.
      // The row of actions stays on one line: it is sized for it.


      if (column.key === 'actions') {
        // A row's buttons stand in the row a person is on -- under the
        // pointer, with the focus, or current -- and the column keeps its
        // width in the others (owner, 2026-10-15): drawn in every row they
        // were most of a page's elements.
        if (!context.component.actionsShownFor?.(row)) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
        return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <div class="sf-table-row-actions flex items-cross-center gap-1/3">
                        ${value.map(item => renderCellItem(item, context.component))}
                    </div>
                `;
      }

      return renderCellValues(value, context.component);
    }

    if (typeof value === "object") {
      return renderCellItem(value, context.component);
    } // Plain text stops at three lines with an ellipsis: a long description
    // in a list made one row as tall as the screen (owner, 2026-10-12). The
    // whole text is the record's, and a long one reads in full on hover.


    const text = String(value);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-cell-text" title=${text.length > 80 ? text : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${text}</span>`;
  } // The totals at the foot (owner decision C296, q-totals B): a row for the
  // page and one for everything under the filter, each when the host gives
  // it; the numbers are the host's (totals), drawn as their cells are, in
  // the columns marked `total`; the words stand in the first data column.


  function renderFoot() {
    const component = context.component;
    const totals = component.totals;
    if (!totals || resolvedDataState(context) !== 'populated') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    const columns = component.getColumns?.() || [];
    const sides = [['page', 'totalsPage'], ['all', 'totalsAll']].filter(([side]) => totals[side]);
    const marked = columns.filter(column => column?.total === true);
    if (!sides.length || !marked.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
    const labelAt = columns.findIndex(column => column?.key && !SYSTEM_COLUMNS.has(column.key) && !column.system && column.total !== true);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<tfoot class="sf-table-totals">${sides.map(([side, word]) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<tr data-sf-totals=${side}>${columns.map((column, index) => {
      const sticky = component.getStickyCellStyle(columns, index) || lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
      if (index === labelAt) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<th scope="row" data-key=${column.key} style=${sticky}>${component.text(word)}</th>`;
      const value = column.total === true ? totals[side]?.[column.key] : undefined;
      if (value === undefined || value === null || value === '') return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<td data-key=${column.key} style=${sticky}></td>`;
      const typed = component.cellValue?.(column, value) ?? String(value);
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<td data-key=${column.key} data-sf-cell=${cellKind(component, column, columns)} style=${sticky}>${typeof typed === 'string' || typeof typed === 'number' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-table-cell-bare">${typed}</span>` : renderCellItem(typed, component)}</td>`;
    })}</tr>`)}</tfoot>`;
  } // The name is the table's (or the list's) alone: a named section is a
  // region, and the data view around the table names its own region by the
  // list's heading, so a second one of the same name only repeats it to a
  // screen reader (Larena storage review, 2026-10-28).


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section
                class="sf-table ${context.list ? 'sf-table--list' : ''} min-w-0 flex flex-col gap-1/3 flex-1 min-h-0 ${context.rootClass || ""}"
                style=${context.rootStyle || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                data-sf-instance=${context.component.getInstanceId()}
                data-state=${resolvedDataState(context)}
                aria-busy=${resolvedDataState(context) === 'loading' ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        >
            ${context.toolbar ? context.compactToolbar ? renderListToolbar(context) : renderToolbar(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.component.renderBulkActions()}

            <div class="table-wrap min-w-0 max-w-full flex flex-col flex-1 min-h-0">
                <div class="sf-table-scroll min-h-0 min-w-0 overflow-auto flex-1 relative"
                     ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_4__.ref)(context.component.refs.scroll)}
                     data-sf-vertical-scroll=${context.verticalScroll}>
                    <div class="sf-table-resize-guide" aria-hidden="true" hidden
                         ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_4__.ref)(context.component.refs.resizeGuide)}></div>
                    ${resolvedDataState(context) === 'loading' && (context.component.getTableData()?.rows?.length ?? 0) > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <div class="sf-table-busy" role="status">
                                <!-- The words are the spinner's label, kept for a screen reader
                                     and hidden from the eye (label-hidden, owner decision C138,
                                     SP-06): the spinner keeps one name mechanism and the status
                                     region says them once. -->
                                <sf-spinner size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing} label=${context.loadingText} label-hidden></sf-spinner>
                            </div>
                        ` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${context.list ? renderList() : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <table
                            ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_4__.ref)(context.component.refs.table)}
                            id=${context.rowAreaId}
                            class="table border-separate border-spacing-0 min-w-full ${context.keyedNarrow ? 'sf-table-keyed' : `${context.component?.contentSized ? 'sf-table-content-sized' : 'w-max'} table-fixed`} transition"
                            role=${context.component.isTree?.() ? 'treegrid' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-label=${context.ariaLabel || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            aria-rowcount=${context.component.ariaRowCount?.() ?? context.component.windowRowCount?.() ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    >
                        ${renderColgroup(context)}
                        ${renderHead(context)}
                        ${renderBody(context)}
                        ${renderFoot()}
                    </table>`}
                </div>
                ${context.verticalScroll === 'page' && !context.list ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-table-rail" aria-hidden="true" hidden ${(0,lit_directives_ref_js__WEBPACK_IMPORTED_MODULE_4__.ref)(context.component.refs.rail)}>
                            <div class="sf-table-rail-track"></div></div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${context.component.renderBulkActions('after')}

                ${context.pagin ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-pagination
                                    current="1"
                                    total=${String(context.paginationTotal)}
                                    bottom="true"
                                    show-action-for-all
                                    page-size=${String(context.paginationPageSize)}
                                    page-sizes=${context.pageSizes}
                                    show-page-size
                                    top-class="content-main-center"
                                    main-class="items-cross-center content-main-between"
                                    bottom-class="items-cross-center gap-2"
                            ></sf-pagination>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
        </section>
        ${state.contextMenu?.open ? context.component.renderContextMenu(context.state.contextMenu) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <!-- A demo panel used to stand here, open to nothing, titled after a
             ticket. Closed, it still took a box of its own, and in a card that
             spaces its parts that box became the gap above Show more: three
             spacings instead of one. -->
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "5bfdd9ec12a1"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeTableLinkCell: () => (/* binding */ normalizeTableLinkCell),
/* harmony export */   normalizeTableLinkHref: () => (/* binding */ normalizeTableLinkHref)
/* harmony export */ });
const SAFE_RELATIVE_PREFIXES = ["/", "./", "../", "#", "?"];
function normalizeTableLinkHref(value) {
  if (typeof value !== "string") {
    return null;
  }

  const href = value.trim();

  if (!href) {
    return null;
  }

  if (href.startsWith("//")) {
    return null;
  }

  if (SAFE_RELATIVE_PREFIXES.some(prefix => href.startsWith(prefix))) {
    return href;
  }

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:" ? href : null;
  } catch {
    return null;
  }
}
function normalizeTableLinkCell(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const text = value.text === null || typeof value.text === "undefined" ? "" : String(value.text);
  const subtext = value.subtext === null || typeof value.subtext === "undefined" ? null : String(value.subtext);
  return {
    href: normalizeTableLinkHref(value.href),
    subtext,
    text
  };
}

/***/ },

/***/ "68a281c549b5"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "d3818183b14c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("deprecations", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("deprecations", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5b7d7695b41b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("element-manifest", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("element-manifest", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "18003344cff0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("layer-stack", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("layer-stack", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "80c480e5196c"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directive-helpers.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directive-helpers.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "0816a19adc72"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directive.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directive.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "9d9903b87148"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/keyed.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/keyed.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "8137feb490e0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/ref.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/ref.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "efa66f8927d1"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit/directives/repeat.js", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit/directives/repeat.js", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "bf0cea966575"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("open-surface-mark", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("open-surface-mark", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "116963e5e31b"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("position", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("position", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "d0f17721f295"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/density", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/density", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "45c4feb4b071"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/field-html", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/field-html", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "06a40de06677"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/field-renderers", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/field-renderers", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "f17a957e50f6"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/manifest-actions", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/manifest-actions", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "5ccd44f050bf"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/menu-open", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/menu-open", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "0424da74c465"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/option-badge", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/option-badge", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "15cc710b6cd3"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/preferences", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/preferences", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "cb7ac7caf6a5"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/table-words", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/table-words", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "f8651e83c6c6"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-view-table for the shim (core/js/aliases.js, standard §16 item 20, vocabulary §9). mode: same-detail (the shim sends the new and the old name), detail-adds (the old name gets the larger new detail), split (the old detail from the element\'s adapter, sfAliasAdapters), host-attribute (no shim).","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"host-attribute","section":"§3.1, §4.8","note":"stays a host attribute, read for the accessible name; no shim"},{"from":"sf-table-action-intent","to":"sf-table-apply","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"split","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 apply {action, scope, ids, revisions}; the old detail {action_id, record_ids} is made by the element\'s adapter (vocabulary §9: sf-table-action-intent → sf-table-apply)"},{"from":"sf-table-create-intent","to":"sf-table-create","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 create; the detail {item} is unchanged"},{"from":"sf-port-output","to":"sf-table-select","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"split","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 select {ids}; the composition port\'s old detail {port: selection, value} is made by the element\'s adapter"},{"from":"sf-table-query-intent","to":"sf-table-query","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5.1: sf-table-query-intent → sf-table-query; the detail {reason, context, sequence} is unchanged"},{"from":"sf-table-retry","to":"sf-table-refresh","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 refresh (table-retry)"},{"from":"sf-table-tree-toggle","to":"sf-table-expand","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 expand; the detail {id, expanded} is unchanged"},{"from":"sf-table-tree-more","to":"sf-table-load-more","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"detail-adds","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 load-more; the new detail adds direction: after to {parent, cursor}"},{"from":"sf-table-rows-reorder","to":"sf-table-move","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 move; the detail {ids, before, order} is unchanged"},{"from":"sf-table-column-settings-change","to":"sf-table-save","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"detail-adds","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5 save {kind: columns}; the new detail adds kind to {reason, columnSettings, tableSettingsKey}","when":{"kind":"columns"}},{"from":"sf-table:column-settings-change","to":"sf-table-save","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"detail-adds","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"vocabulary §5.1: sf-table:column-settings-change → sf-table-save {kind: columns}; a colon name (§8)","when":{"kind":"columns"}},{"from":"onColumnSettingsChange","to":"sf-table-save","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"detail-adds","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"a camelCase name outside §8 (simai/ui-pro#1); ui-admin listens to it (src/main.ts, src/smart-component-catalog.ts)","when":{"kind":"columns"}},{"from":"onSearchEnd","to":"sf-table-search-change","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"split","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"a camelCase name outside §8 (simai/ui-pro#1); its detail was the search text itself, made by the element\'s adapter; ui-admin listens to it (src/main.ts, src/smart-component-catalog.ts)"},{"from":"onTemplateSave","to":"sf-view-table-template-save","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"split","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"a camelCase name outside §8 (simai/ui-pro#1); ui-admin listens to it; its detail was the template object or the array of them, made by the element\'s adapter since template-save carries {templates} (1.16.0)"},{"from":"onFilterUpdate","to":"sf-table-filter-change","kind":"event","component":"sf-view-table","since":"2026-10-27","remove_after":"2027-01-01","mode":"same-detail","cancelable":false,"section":"§8, §16 item 20, vocabulary §9","note":"a camelCase name outside §8 (simai/ui-pro#1); ui-admin listens to it"},{"from":"sf-table","to":"sf-view-table","kind":"tag","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R2 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-view-table; sf-table is a subclass defined beside it until the date"},{"from":"sf-table-select","to":"sf-view-table-select","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-apply","to":"sf-view-table-apply","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-save","to":"sf-view-table-save","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-column-settings-reset","to":"sf-view-table-column-settings-reset","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-create","to":"sf-view-table-create","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-filter-change","to":"sf-view-table-filter-change","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-query","to":"sf-view-table-query","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-refresh","to":"sf-view-table-refresh","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-search-change","to":"sf-view-table-search-change","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-sort-change","to":"sf-view-table-sort-change","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-template-delete","to":"sf-view-table-template-delete","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-template-save","to":"sf-view-table-template-save","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"split","section":"§8","note":"the event name carries the tag; its detail was the template object or the array of them, made by the element\'s adapter since template-save carries {templates} (1.16.0)"},{"from":"sf-table-template-select","to":"sf-view-table-template-select","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-toolbar-action","to":"sf-view-table-toolbar-action","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-reference-open","to":"sf-view-table-reference-open","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-expand","to":"sf-view-table-expand","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-load-more","to":"sf-view-table-load-more","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-rows-drag","to":"sf-view-table-rows-drag","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-move","to":"sf-view-table-move","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-cell-set","to":"sf-view-table-cell-set","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-view-change","to":"sf-view-table-view-change","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-table-window","to":"sf-view-table-window","kind":"event","component":"sf-view-table","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"toolbar","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"pagin","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"filter-templates","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"filter-text","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"clear-text","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"search-placeholder","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"create-text","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"creatable","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"pagination-total","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"pagination-page-size","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"page-sizes","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"filter-apply-text","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"},{"from":"layout-switch","to":null,"kind":"attribute","component":"sf-view-table","since":"2026-11-18","remove_after":"2027-01-01","mode":"host-attribute","section":"C296, C295 (VT-13)","note":"the container\'s job (sf-view, sf-pagination, sf-bulk-actions); read by the table as before until the date, noted in SF.deprecations once on a table standing alone; no shim"}]}');

/***/ },

/***/ "c1f17ed5a348"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.view-table","tag":"sf-view-table","version":"1.37.0","kind":"leaf","settings":{"selectable":{"type":"boolean","default":true},"settings":{"type":"boolean","default":true},"actions":{"type":"boolean","default":true},"row-actions":{"type":"boolean","default":true},"creatable":{"type":"boolean","default":true},"filter-templates":{"type":"boolean","default":true},"settings-menu":{"type":"boolean","default":true},"pagin":{"type":"boolean","default":false},"filter-text":{"type":"string","default-from":"runtime.filter-text"},"clear-text":{"type":"string","default-from":"runtime.clear-text"},"search-placeholder":{"type":"string","default-from":"runtime.search-placeholder"},"create-text":{"type":"string","default-from":"runtime.create-text"},"pagination-total":{"type":"number","default":10,"integer":true,"min":0},"pagination-page-size":{"type":"number","default":10,"integer":true,"min":1,"max":100},"page-sizes":{"type":"string","default":"10,20,30,40"},"context-menu-columns":{"type":"number","default":1,"integer":true,"min":1,"max":4},"remember-widths":{"type":"boolean","default":false},"table-settings-key":{"type":"string","default":""},"data-state":{"type":"enum","values":["auto","loading","ready","populated","empty","error"],"default":"auto","x-alias":{"populated":"ready"}},"loading-text":{"type":"string","default-from":"runtime.loading-text"},"empty-text":{"type":"string","default-from":"runtime.empty-text"},"empty-description":{"type":"string"},"error-text":{"type":"string","default-from":"runtime.error-text"},"retry-text":{"type":"string","default-from":"runtime.retry-text"},"toolbar":{"type":"boolean","default":true},"stripes":{"type":"boolean","default":false},"pin-column-label":{"type":"string","default-from":"runtime.pin-column-label"},"unpin-column-label":{"type":"string","default-from":"runtime.unpin-column-label"},"column-move-label":{"type":"string","default-from":"runtime.column-move-label"},"column-search-placeholder":{"type":"string","default-from":"runtime.column-search-placeholder"},"column-search-empty-text":{"type":"string","default-from":"runtime.column-search-empty-text"},"vertical-scroll":{"type":"enum","values":["self","page"],"default":"self"},"filter-apply-text":{"type":"string","default-from":"runtime.filter-apply-text"},"layout":{"type":"enum","values":["auto","table","list"],"default":"auto"},"layout-switch":{"type":"boolean","default":false},"list-below":{"type":"number","default":600},"list-fields":{"type":"number","default":3},"quick-actions":{"type":"string","default":""},"row-open":{"type":"enum","values":["title","row"],"default":"title"},"size":{"type":"enum","values":["1/2","1"],"default":"1"},"preferences-key":{"type":"string","default":""},"row-actions-visible":{"type":"enum","values":["hover","always"],"default":"hover"},"drag-rows":{"type":"boolean","default":false},"row-reorder":{"type":"boolean","default":false},"inline-edit":{"type":"boolean","default":false},"total":{"type":"number","default":0},"row-offset":{"type":"number","default":0},"active-filter-fields":{"type":"list","entries":{"key":"id"}},"bulk-actions":{"type":"list"},"columns":{"type":"list","of":{"key":"string","label":"string"}},"create-items":{"type":"list"},"filter-fields":{"type":"list"},"rows":{"type":"list","entries":{"key":"id","changes":"revision"},"of":{"id":"id","revision":{"type":"string","optional":true}}},"table-data":{"type":"object"},"table-settings":{"type":"object"},"templates":{"type":"list"},"toolbar-actions":{"type":"list"},"sort":{"type":"list","of":{"key":"string","direction":{"type":"enum","values":["asc","desc"]}},"controlled":true},"totals":{"type":"object"},"current":{"type":"string","default":""}},"values":{"selected":{"type":"id","optional":true},"selection":{"type":"list","default":[]}},"events":{"select":{"carries":{"ids":"list"}},"apply":{"carries":{"action":"string","scope":{"type":"enum","values":["entry","selection","filter"]},"ids":"list","revisions":{"type":"object","optional":true}}},"save":{"carries":{"kind":{"type":"enum","values":["columns"]},"reason":"string","column-settings":{"type":"object"},"table-settings-key":{"type":"string"}}},"column-settings-reset":{"carries":{"target":{"type":"enum","values":["personal"]},"table-settings-key":{"type":"string","nullable":true}},"own-verb":true},"create":{"carries":{"item":{"type":"string","nullable":true,"optional":true}}},"filter-change":{"carries":{"template-key":{"type":"string"},"template-label":{"type":"string"},"values":{"type":"object"},"tags":{"type":"object"}},"own-verb":true},"query":{"carries":{"reason":"string","context":"object","sequence":{"type":"number","integer":true}}},"refresh":{"carries":{}},"search-change":{"carries":{"search":"string"},"own-verb":true},"sort-change":{"carries":{"key":{"type":"string","schema":{"minLength":1}},"direction":{"type":"enum","values":["asc","desc",null],"nullable":true}},"own-verb":true},"template-delete":{"carries":{"key":{"type":"string","schema":{"minLength":1}}},"own-verb":true},"template-save":{"carries":{"templates":{"type":"list","of":{"key":"string","label":"string","selected":"boolean","data":"object","settings":"object"},"schema":{"items":{"type":"object","required":["key","label","settings"],"properties":{"key":{"type":"string"},"label":{"type":"string"},"selected":{"type":"boolean"},"data":{"type":"object"},"settings":{"type":"object","properties":{"filter_fields":{"type":"array","items":{"type":"string"}}}}}},"minItems":1}}},"own-verb":true},"template-select":{"carries":{"key":{"type":"string","schema":{"minLength":1}}},"own-verb":true},"toolbar-action":{"carries":{"action":"string","href":{"type":"string","nullable":true,"optional":true}},"cancelable":true,"own-verb":true},"reference-open":{"carries":{"field":"string","value":"object","href":"string"},"cancelable":true,"own-verb":true},"expand":{"carries":{"id":"id","expanded":{"type":"boolean","optional":true}}},"load-more":{"carries":{"direction":{"type":"enum","values":["after"]},"parent":{"type":"id","nullable":true},"cursor":{"type":"string","nullable":true}}},"rows-drag":{"carries":{"ids":{"type":"list","schema":{"items":{"type":"string"},"minItems":1}},"source":{"type":"string","nullable":true}},"own-verb":true},"move":{"carries":{"ids":"list","before":{"type":"id","nullable":true},"order":"list"}},"cell-set":{"carries":{"id":"object","key":"string","value":"object","revision":"object"},"own-verb":true},"view-change":{"carries":{"view":"object","everywhere":"boolean"},"own-verb":true},"window":{"carries":{"first":{"type":"number","integer":true},"last":{"type":"number","integer":true}},"own-verb":true},"layout-change":{"carries":{"layout":{"type":"enum","values":["list","table"]}},"own-verb":true},"open":{"carries":{"id":"id","newTab":"boolean"},"own-verb":true}},"actions":{"add-rows":{"with":{"rows":"list"}},"apply-query-result":{"with":{"sequence":{"type":"number","integer":true,"schema":{"minimum":1}},"rows":"list"}},"clear-selection":{},"request-action-intent":{"with":{"action-id":{"type":"string","schema":{"minLength":1}},"record-ids":{"type":"list","schema":{"items":{"type":["string","integer"],"minLength":1},"minItems":1}}},"emits":"apply"},"request-create-intent":{"with":{"item-id":{"type":"string","optional":true,"nullable":true}},"emits":"create"},"request-retry":{"emits":"refresh"},"set-sort":{"with":{"key":{"type":"string","nullable":true},"direction":{"type":"enum","values":["asc","desc"],"nullable":true}}},"toggle-tree-row":{"with":{"row":"object"},"emits":"expand"},"request-tree-more":{"with":{"row":"object"},"emits":"load-more"},"focus-row":{"with":{"id":"id"}},"set-layout":{"with":{"layout":{"type":"enum","values":["list","table"]}},"emits":"layout-change"},"scroll-to-row":{"with":{"id":"id"}}},"port":{"id":"simai.dataview-port","version":"1.0.0","contract":"src/core/contracts/ports/simai.dataview-port/1.0.0/port.json"},"presentation":{"skeleton":{"late":["rows"]}},"host-states":{"data-sf-view-stripes":"boolean","data-sf-page-scroll":"boolean"},"css-variables":{"--sf-view-table-row-block-size":{"type":"length","state":"default"},"--sf-view-table-head-block-size":{"type":"length","state":"default"},"--sf-view-table-edge":{"type":"length","state":"default"},"--sf-view-table-line-color":{"type":"color","state":"default"},"--sf-view-table-head-color":{"type":"color","state":"default"},"--sf-view-table-row-background-color":{"type":"color","state":"default"},"--sf-view-table-selected-background-color":{"type":"color","state":"default"},"--sf-view-table-title-lines":{"type":"integer","state":"default"},"--sf-table-row-block-size-1/2":{"type":"length","state":"default"},"--sf-table-row-block-size-1":{"type":"length","state":"default"},"--sf-table-row-2-lines-block-size-1/2":{"type":"length","state":"default"},"--sf-table-row-2-lines-block-size-1":{"type":"length","state":"default"},"--sf-table-head-block-size-1/2":{"type":"length","state":"default"},"--sf-table-head-block-size-1":{"type":"length","state":"default"},"--sf-table-toolbar-block-size-1/2":{"type":"length","state":"default"},"--sf-table-toolbar-block-size-1":{"type":"length","state":"default"},"--sf-table-toolbar-gap":{"type":"length","state":"default"},"--sf-table-head--background-color":{"type":"color","state":"default"},"--sf-table-row--background-color":{"type":"color","state":"default"},"--sf-table--cell-spacing":{"type":"length","state":"default"},"--sf-table-cell--line-clamp":{"type":"number","state":"default"},"--sf-table-context-menu--z-index":{"type":"number","state":"open"},"--sf-table-context-menu--max-width":{"type":"length","state":"open"}}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("94d60d3691b5");
/******/
/******/ })()
;