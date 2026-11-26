/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "e081a020262e"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   copyText: () => (/* binding */ copyText),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Copying text, with the fallback (reuse audit 2026-11-02, finding 11). The
// clipboard class component and sf-copy-button each wrote this, and
// chat-message a third time; the order is theirs: the Clipboard API on a
// secure page, and execCommand('copy') over a hidden field where the API is
// absent or refused. A secure page whose clipboard permission is denied -- a
// policy, an embedded frame, a browser that asked and was answered no -- has
// the API and still refuses it; reading "present" as "allowed" left the
// fallback that exists for exactly this unreached (component/clipboard,
// 2026-10).

/**
 * Copies `text`. Settles with how it was copied, 'native' or 'legacy', or
 * rejects: Error('copy_unsupported') when the fallback copied nothing, or the
 * platform's own error (NotAllowedError, SecurityError) when it threw.
 * `document` is the document whose body holds the fallback field: the
 * element's own, for a component in another frame.
 */
async function copyText(text, {
  document: documentRef = globalThis.document
} = {}) {
  const value = String(text ?? '');
  const view = documentRef?.defaultView ?? globalThis;

  if (view.isSecureContext && view.navigator?.clipboard?.writeText) {
    try {
      await view.navigator.clipboard.writeText(value);
      return 'native';
    } catch {// Refused: the fallback is for exactly this.
    }
  }

  if (!documentRef?.body || typeof documentRef.execCommand !== 'function') throw new Error('copy_unsupported');
  const area = documentRef.createElement('textarea'); // The class is the clipboard component's (its sheet hides it); the inline
  // style keeps the field out of sight on a page without that sheet.

  area.className = 'sf-clipboard-fallback';
  area.value = value;
  area.setAttribute('readonly', '');
  area.setAttribute('aria-hidden', 'true');
  area.style.cssText = 'position:fixed;inset-inline-start:-9999px;inset-block-start:0;opacity:0';
  documentRef.body.append(area);
  area.select(); // iOS selects nothing on select() alone.

  area.setSelectionRange?.(0, value.length);
  let copied = false;

  try {
    copied = documentRef.execCommand('copy');
  } finally {
    area.remove();
  }

  if (!copied) throw new Error('copy_unsupported');
  return 'legacy';
} // Core publishes the helper; component bundles that carry their own copy reuse
// an already published one instead of replacing it. SF.Clipboard (capital C)
// is the clipboard component's script API; this is the bare function.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  if (!globalThis.SF.copyText) globalThis.SF.copyText = copyText;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copyText);

/***/ },

/***/ "1b42c5117087"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ICON_CHOICES: () => (/* binding */ ICON_CHOICES),
/* harmony export */   ICON_CHOICE_WORDS: () => (/* binding */ ICON_CHOICE_WORDS),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   iconWords: () => (/* binding */ iconWords)
/* harmony export */ });
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _lang_icon_search_index_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("4bd9c3b168e0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_page_language_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_page_language_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _page_language_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_page_language_js__WEBPACK_IMPORTED_MODULE_0__);
// The glyphs a person may mark a part of an interface with -- a section of a
// record, a row of a menu, a tile of a dashboard. A hundred and twenty names
// from the Framework's own icon set, the ones products actually reach for,
// read in rows of what they are usually about: what a thing is, who it
// belongs to, when it happens, what it costs, what it is made of. One list,
// so every set chooses from the same glyphs.
//
// Raised from ui-pro sf-view-properties (js/icon-choices.js), which sf-admin-menu
// imported across what become two component sets (duplication audit
// 2026-11-03, A-1; owner decision 2026-11-03, component sets, point 13). A
// component imports ICON_CHOICES; a page reads SF.icons.choices, and
// SF.icons.choices.words[name] gives a glyph's Russian and English words
// (C151 point 8). The choice
// itself is drawn by sf-dropdown with options of kind icon (layout grid,
// search), as sf-view-properties and sf-admin-menu do.

 // The words a person searches the choice by (owner decision C151 point 8): a
// Russian and an English word or two for each glyph, the name's own words
// among the English ones. sf-dropdown matches its icon options against them
// in either language, so «папка» finds folder and «folder» still does.
// The words live in core's language files (owner decision C282):
// src/core/js/lang/icon-search/<code>.json, a glyph's words joined by commas.
// English is built in; Russian (and any other language) is the words its
// language file registered for sf-icon-search, its icon-search part, fetched
// the first time a search asks for them. ICON_CHOICE_WORDS keeps its shape,
// {name: {ru: [...], en: [...]}}: ru reads the registered words when it is read.

const splitWords = text => String(text ?? '').split(',').map(word => word.trim()).filter(Boolean);

function languageWords(code, name) {
  const own = _lang_icon_search_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"][code]?.[name];
  if (own !== undefined) return splitWords(own); // localeText asks core for the language's icon-search part when it is not
  // here yet (and says the English words meanwhile); only a word registered
  // for the language itself counts.

  (0,_page_language_js__WEBPACK_IMPORTED_MODULE_0__.localeText)(_lang_icon_search_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"], name, code, 'sf-icon-search');
  return splitWords(globalThis.__sfPageLanguage?.registered?.get?.('sf-icon-search')?.get?.(code)?.[name]);
}

const ICON_CHOICE_WORDS = /* @__PURE__ */Object.freeze(Object.fromEntries(Object.keys(_lang_icon_search_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"].en).map(name => [name, Object.freeze(Object.defineProperties({}, {
  ru: {
    enumerable: true,
    get: () => languageWords('ru', name)
  },
  en: {
    enumerable: true,
    value: Object.freeze(splitWords(_lang_icon_search_index_mjs__WEBPACK_IMPORTED_MODULE_1__["default"].en[name]))
  }
}))]))); // The words of any glyph name: the choice's words, or the name read as words
// (folder_open -> folder open) for a glyph outside the choice.

function iconWords(name) {
  const key = String(name || '').trim();
  const words = Object.hasOwn(ICON_CHOICE_WORDS, key) ? ICON_CHOICE_WORDS[key] : null;
  const own = key.split('_').filter(Boolean);
  return {
    ru: words ? [...words.ru] : [],
    en: [...new Set([...(words ? words.en : []), ...own])]
  };
}
const ICON_CHOICES = Object.freeze(Object.defineProperty(["folder", "folder_open", "topic", "home", "dashboard", "apartment", "store", "storefront", "business_center", "work", "badge", "person", "group", "groups", "account_circle", "manage_accounts", "supervisor_account", "contacts", "school", "menu_book", "assignment", "task", "description", "article", "note_alt", "edit_note", "draft", "receipt", "receipt_long", "request_quote", "inventory_2", "category", "label", "sell", "local_offer", "shopping_cart", "shopping_bag", "payments", "savings", "credit_card", "account_balance", "calculate", "percent", "trending_up", "analytics", "insights", "monitoring", "bar_chart", "pie_chart", "table_chart", "schedule", "event", "today", "calendar_month", "date_range", "history", "alarm", "timer", "update", "hourglass_top", "mail", "outgoing_mail", "chat", "forum", "sms", "call", "phone_in_talk", "contact_support", "campaign", "notifications", "language", "public", "place", "map", "location_on", "travel_explore", "flight", "local_shipping", "route", "directions", "settings", "tune", "build", "construction", "handyman", "code", "terminal", "data_object", "api", "bug_report", "database", "storage", "cloud", "backup", "sync", "folder_zip", "upload_file", "download", "attach_file", "link", "lock", "lock_open", "shield", "verified_user", "key", "admin_panel_settings", "policy", "gavel", "fingerprint", "visibility", "palette", "format_paint", "image", "photo_library", "collections", "movie", "play_circle", "mic", "headphones", "brush"], 'words', {
  value: ICON_CHOICE_WORDS,
  enumerable: false
})); // Core publishes the list; a component bundle that carries its own copy reuses
// the published one instead of replacing it.

if (typeof globalThis !== 'undefined') {
  globalThis.SF = globalThis.SF || {};
  globalThis.SF.icons = globalThis.SF.icons || {};
  if (!globalThis.SF.icons.choices) globalThis.SF.icons.choices = ICON_CHOICES;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ICON_CHOICES);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "7623a90f1816"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SUPPORTED_PORT_VERSIONS: () => (/* binding */ SUPPORTED_PORT_VERSIONS),
/* harmony export */   SfPropertyView: () => (/* binding */ SfPropertyView)
/* harmony export */ });
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("deb1a4d61565");
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("5b7d7695b41b");
/* harmony import */ var _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("f17a957e50f6");
/* harmony import */ var _component_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("3ea81f4c3c20");
/* harmony import */ var _aliases_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("4284cc8c32e1");
/* harmony import */ var _lang_en_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("99fb492b7fba");
/* harmony import */ var _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("d614908e644f");
/* harmony import */ var _core_js_icon_choices_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("1b42c5117087");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("18003344cff0");
/* harmony import */ var _view_common_density_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("d0f17721f295");
/* harmony import */ var _core_js_clipboard_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("e081a020262e");
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("d3818183b14c");
/* harmony import */ var _js_templates_default__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("40b137e60526");
/* harmony import */ var _js_conditions_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("844bdc4d24eb");
/* harmony import */ var _js_set_fields_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("db94c32f22be");
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("06a40de06677");
/* harmony import */ var _js_history_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("f8f76dff9bfe");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_icon_choices_js__WEBPACK_IMPORTED_MODULE_7__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__, _view_common_density_js__WEBPACK_IMPORTED_MODULE_10__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12__, _js_templates_default__WEBPACK_IMPORTED_MODULE_13__, _js_set_fields_js__WEBPACK_IMPORTED_MODULE_15__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_16__, _js_history_js__WEBPACK_IMPORTED_MODULE_17__]);
([_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__, _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__, _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_icon_choices_js__WEBPACK_IMPORTED_MODULE_7__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_8__, _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__, _view_common_density_js__WEBPACK_IMPORTED_MODULE_10__, _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12__, _js_templates_default__WEBPACK_IMPORTED_MODULE_13__, _js_set_fields_js__WEBPACK_IMPORTED_MODULE_15__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_16__, _js_history_js__WEBPACK_IMPORTED_MODULE_17__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var _core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _view_common_density_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_view_common_density_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_16__);
// One object's fields, shown and edited. The pair to sf-view: that one is a
// set of records in any layout, this one is a single object -- a storage record,
// a related record, site settings, a profile. Named for the property rather than
// for the record because nothing in it knows what kind of object is behind a
// field; the renderer set it draws through is addressed by a property type, and a
// name saying `record` would narrow the component below its own contents.
//
// The host owns values, revisions, rights and addresses. This element owns the
// arrangement on screen and nothing else: it stores no value and no revision of
// its own, and every change leaves through the port.
//
// It renders into its own light DOM, like every other Smart component. The first
// version used a shadow root, and the field controls inside it came out with
// their markup and none of their CSS: a document stylesheet does not cross a
// shadow boundary. sf-view avoids this by slotting its children and says so
// beside the slot. A consumer found it on their stand.






 // The glyphs are the Framework's choice list (core/js/icon-choices.js, core.runtime
// 1.25.0; duplication audit 2026-11-03 A-1), shared with sf-admin-menu.







 // The day-and-time reading is the field renderers' (A-14): this view kept a
// copy from before it was lifted into the Framework.




 // Whether the page's sheets hold SIMAI Framework's own ground for the sticky
// tab strip (component.tabs 1.5.4, group build 15: the strip reads
// --sf-surface-place-ground, the ground it stands on). Found once, it stays
// found; not found, it is asked again only when the page has more sheets
// than at the last look. Without it the panel keeps the set's own strip
// ground (VB-1, default.css .sf-property-view-panel--own-strip).

let stripGroundFound = false;
let stripGroundSheets = -1;

function frameworkStripGround() {
  if (stripGroundFound) return true;
  const sheets = globalThis.document?.styleSheets;
  if (!sheets || sheets.length === stripGroundSheets) return false;
  stripGroundSheets = sheets.length;

  const holds = rules => {
    for (const rule of rules ?? []) {
      if (rule.selectorText?.includes("sf-tabs--sticky") && rule.selectorText.includes("sf-tabs-top-container") && String(rule.style?.backgroundColor ?? rule.style?.getPropertyValue?.("background-color") ?? "").includes("--sf-surface-place-ground")) return true;
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

    if (holds(rules)) return stripGroundFound = true;
  }

  return false;
} // Every port version this composite accepts, in one place, the way sf-view
// keeps its list -- a guard naming a narrower set than the published versions is
// a component refusing a host it asked to move. The contract test beside this
// file compares the list with the manifest.


const SUPPORTED_PORT_VERSIONS = ["1.0.0", "1.1.0", "1.2.0", "1.3.0", "1.4.0", "1.5.0", "1.6.0", "1.7.0", "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.15.0", "1.16.0", "1.17.0", "1.18.0", "1.19.0", "1.20.0", "1.21.0", "1.22.0", "1.22.1"]; // The surface's mode (owner, 2026-10-14). view: show the object, never offer
// a change. auto: show it and offer what this person may do. edit: every group
// open at once, one save. create: an empty object of the collection, every
// field open, one create.

const MODES = ["view", "auto", "edit", "create"]; // How long an opened panel waits for its title before leaving the first focus
// where the drawer put it: the drawer's own wait for a late field (two seconds).

const TITLE_FOCUS_WAIT_MS = 2000; // The most candidates a picker asks for at once, from a host on port 1.14.0 or
// later (an earlier port's field.options payload is closed and would refuse
// it). Twenty is the page the record picker was built and measured against
// with the consumer's 448 targets; the host may answer fewer, and says which
// page is the last by its cursor, not by a short page.

const OPTIONS_PAGE_LIMIT = 20; // The property types picked from a list the host pages: the records and people,
// and since 1.14.0 a lookup whose list is not inline.

const PAGED_TYPES = ["record", "relation", "user", "lookup"]; // A group the host has not read yet (port 1.15.0, group.load): its fields are
// empty and its field_count says how many it holds. An empty group is a group
// with field_count 0 or none, never one waiting for its read.

const groupNotRead = group => Number.isInteger(group?.field_count) && group.field_count > 0 && (!Array.isArray(group.fields) || group.fields.length === 0);

const versionAtLeast = (version, minimum) => {
  const parts = value => String(value ?? "").split(".").map(part => Number.parseInt(part, 10) || 0);

  const [a, b] = [parts(version), parts(minimum)];

  for (let index = 0; index < 3; index += 1) {
    if ((a[index] ?? 0) !== (b[index] ?? 0)) return (a[index] ?? 0) > (b[index] ?? 0);
  }

  return true;
}; // Every panel open on the page is a layer of the Framework's one document layer
// stack (core layer-stack.js, standard 1.3.8 §19), through the sf-drawer that
// carries it -- the stack sf-modal, the drawers and the menus share. A stack of
// panels is not one state held for several records: each window is its own
// element with its own record, its own open group and its own unsaved changes --
// which is what «такое же представление поверх» means, and what leaves a
// half-edited window intact underneath the one above it. What lies between the
// windows is the stack's: which one is on top and takes Escape, how high each is
// drawn, the dim each modal layer lays over what is below it, and where focus
// goes when one closes. This component kept a list of its own for that, an
// Escape listener of its own and a dim of its own until 1.13.0; its list did not
// know about a modal, so Escape under an sf-modal opened from a panel closed the
// panel instead of the modal.
// The same query sf-drawer docks on, written the same way so a reader grepping
// 48rem finds both. The Framework's own breakpoint array has no 48rem step -- its
// nearest is md at 720px -- but the panel *is* a drawer, and flipping the panel's
// arrangement 48px away from where the drawer changes its own behaviour would be
// visible in that gap. The split between the breakpoint array and the pixel values
// components use is reported rather than settled here.


const WIDE_MEDIA_QUERY = "(min-width: 48rem)"; // What the drawer's close reasons (standard 1.3.8 §19.3) are as this panel's:
// the drawer draws no close control of its own here, so its `close` is a script
// asking; `outside` is a press on the dimmed page.

const DRAWER_CLOSE_REASONS = {
  escape: "escape",
  outside: "outside",
  close: "api",
  api: "api"
}; // The column the list of sections takes. It is here rather than in the
// stylesheet because the panel's own width is computed from it, and the drawer
// that carries the panel is placed outside this component's subtree: a custom
// property declared on the element never reaches it. The stylesheet reads this
// through `--sf-property-view--sections-width`, which the component passes to
// the panel and sets on the layout it draws in place.

const SECTIONS_WIDTH = "var(--sf-view-properties-sections-width, 12rem)"; // How the record is edited (C305 (1), RC-1): a group with its Save, plus the
// short fields in a window at their value (the table's cell edit, C296), or
// nothing. A short field is one choice, a date, a time, a yes/no, a person or
// a number: one control, nothing to read around it.

const EDIT_MODES = ["group", "group+quick", "none"];
const QUICK_TYPES = new Set(["choice", "enum", "select", "dropdown", "date", "datetime", "time", "boolean", "user", "number", "integer"]); // The types sf-form cannot draw for the card (C182): the set's own (money,
// percent, rows, compound), a file or an image that uploads through the host,
// and a reference picked from the host's pages. A group holding one keeps the
// card's own form until sf-form takes a host for them (order FO-C305-1).

const FORMLESS_TYPES = new Set(["file", "files", "image", "images", "record", "relation", "lookup", "user"]); // From 80rem the full screen keeps the history in a column of its own (C305 (3)).

const SIDE_MEDIA_QUERY = "(min-width: 80rem)"; // From 64rem a panel is a docked column beside the list (C305 (4)); narrower
// it floats over a scrim.

const DOCK_BREAKPOINT = "64rem";
const HISTORY_PAGE = 20; // The panel's widths are sf-drawer's ladder and nothing else (C157 (2), C289
// (2)): 20, 24 and 30rem and the whole screen. `panel-width` is the dated
// former name (until 2027-01-01): a width it asks for lands on the nearest
// step, and anything wider than the widest step on that step -- Larena's 40rem
// and ui-admin's 44rem take 30rem. A record that needs more room opens on the
// whole screen, where its sections stand in a column.
// A former panel-width was written against the drawer ladder the steps had
// then (20, 24, 30rem): its length still names the step it meant.

const PANEL_STEPS = [["1/2", 20], ["1", 24], ["2", 30]]; // The panel's widths follow the body text (C396): panel-size 1/2, 1 and 2
// are the width steps 44, 52 and 64 of the Framework's text measure, N times
// half the body text size (352, 416 and 512 px at normal density, 308, 364
// and 448 at compact). Before the pair that carries --sf-measure-N the same
// value is computed here from the body text size; after it, the Framework's
// variable is read. The drawer's own ladder (20, 24, 30rem) is not used.

const PANEL_MEASURE = {
  "1/2": 44,
  "1": 52,
  "2": 64
};

const panelMeasure = step => {
  const n = PANEL_MEASURE[step] ?? PANEL_MEASURE["2"];
  return `var(--sf-measure-${n}, calc(${n} * var(--sf-text--size-1) / 2))`;
};

const PANEL_WIDTH_UNTIL = "2027-01-01"; // One owner of the sections' column (VR11-1, owner remark via DEV msg-0ded9f0c):
// where the card lays its sections as a column it reserves 12rem for them, and
// the vertical sf-tabs in that column must draw the vertical list. sf-tabs
// folds a vertical list into its underline row below the h1 step (44rem) of
// the first box around the column wider than it (VP-26, C181 (2)); in a panel
// below the whole screen that box is the panel's scroller, at most 43rem (step
// 2: 32rem + 12rem + a gutter, less the panel's gutters), so the column was
// reserved and the tabs drew the row inside it (688 px scroller, 192 px
// column, aria-orientation horizontal). The pair's sf-tabs has no way to be
// told not to fold; the set asks the SIMAI Framework for one (proposed:
// fold="auto|never" on sf-tabs, never = type="vertical" always draws the
// vertical list, its place no longer read). Until a pair carries it, a panel
// below the whole screen lays its sections as tabs on top and is not widened
// for a column; once sf-tabs declares the property the slider keeps the
// vertical list (the owner's default): over the list always, docked beside
// it while the list keeps 48rem (C399, sectionColumnFits); else tabs on top.

const tabsHoldColumn = () => {
  const tabs = globalThis.customElements?.get?.("sf-tabs");

  try {
    return Boolean(tabs?.props && Object.prototype.hasOwnProperty.call(tabs.props, "fold"));
  } catch {
    return false;
  }
};

const nearestPanelStep = width => {
  const found = /^\s*(\d+(?:\.\d+)?)\s*(rem|em|px)\s*$/u.exec(String(width ?? ""));
  if (!found) return "2";
  const rem = found[2] === "px" ? Number(found[1]) / 16 : Number(found[1]);
  let best = PANEL_STEPS[0];

  for (const step of PANEL_STEPS) if (Math.abs(step[1] - rem) < Math.abs(best[1] - rem)) best = step;

  return best[0];
}; // The tags the card draws, asked of the Loader before they are needed
// (component-set standard draft 1.1 §7.11, VF-16): a page that defined none of
// them -- a chat message, a card printed into a page by itself -- gets the
// whole card, not its markup. The rule's relations name most of them; asking
// costs nothing for a tag already defined.


const DRAWN_TAGS = ["sf-drawer", "sf-button", "sf-button-icon", "sf-button-close", "sf-tabs", "sf-list", "sf-list-description", "sf-help-mark", "sf-empty-state", "sf-confirm", "sf-menu-context", "sf-badge", "sf-icon", "sf-popover", "sf-form", "sf-list-timeline", "sf-menu"]; // The parts only the arranging mode and the select-only chooser draw (C311):
// the view picker, the lists that drag, a section's icon (a dropdown) and the
// switches of a field's settings. Asked for once the card knows it may
// arrange, before the mode is entered.

const ARRANGING_TAGS = ["sf-profile-picker", "sf-sortable", "sf-dropdown", "sf-switch"]; // How long the copy control shows its tick. The Framework's own clipboard holds
// its tick for this long, and two controls that say «copied» for two different
// lengths are two conventions where there is one act.

const COPY_FEEDBACK_MS = 5000; // A payload is copied so that a host cannot mutate what the component still
// holds. Copying it through JSON destroys anything that is not plain data, and
// the upload intent carries a File: it arrived at the host as an empty object,
// so its name was undefined, the host's own size check never matched, and a file
// it would have refused was accepted instead. Found by a probe asserting that
// what arrives is a File, which is the only reason it was not shipped.
//
// So the plain parts are copied and anything that is not plain is passed by
// reference. The protection was always about data; a File is not data the
// component can own a second copy of.

const isPlain = value => value === null || ["string", "number", "boolean", "undefined"].includes(typeof value) || typeof value === "object" && (Array.isArray(value) || value.constructor === Object);

const copy = value => {
  if (value == null) return value;
  if (typeof value !== "object" || !isPlain(value)) return value;
  if (Array.isArray(value)) return value.map(item => copy(item));
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, copy(item)]));
}; // The Framework speaks English by default and Russian on a Russian page, as
// src/core/js/page-language states for every component. This composite
// carried Russian defaults instead, so an English page drew a panel entirely
// in Russian -- beside an sf-input-color inside it that followed the rule and said
// «inherited». A product still overrides any of these by attribute.
// The words are the language files' (lang/<locale>.json, standard 1.3.8 §11),
// read under the camelCase keys a product registers more languages by.


const camelWords = (words = {}) => Object.fromEntries(Object.entries(words).map(([key, word]) => [key.replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase()), word]));

const PROPERTY_VIEW_TEXT = {
  en: camelWords(_lang_en_json__WEBPACK_IMPORTED_MODULE_5__.runtime),
  ru: camelWords(_lang_ru_json__WEBPACK_IMPORTED_MODULE_6__.runtime)
};
const SECTION_ICONS = _core_js_icon_choices_js__WEBPACK_IMPORTED_MODULE_7__.ICON_CHOICES; // The refusal codes of a view write (port 1.22.0; Larena backend c311-reply)
// and the pack's words for them.

const VIEW_REFUSALS = {
  view_invalid: "viewRefusedInvalidText",
  admin_record_view_changed: "viewChangedText",
  admin_record_layout_shared_denied: "viewRefusedSharedDeniedText",
  admin_record_view_own: "viewRefusedOwnText",
  admin_record_view_unknown: "viewRefusedUnknownText",
  admin_record_view_required: "viewRefusedRequiredText",
  admin_record_layout_lock_invalid: "viewRefusedLockInvalidText",
  admin_record_layout_head_invalid: "viewRefusedHeadInvalidText",
  admin_record_layout_icon_invalid: "viewRefusedIconInvalidText"
}; // sf-view-properties from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §8, §11): its own props below keep their parsers; what they
// do not name is the manifest's. The actions answer outcomes
// (../table/js/manifest-actions.js), the events take the vocabulary's
// verbs, and the old names follow once through the dated aliases.

const PropertyViewElement = (0,_core_js_element_manifest__WEBPACK_IMPORTED_MODULE_1__.elementFromManifest)(_component_json__WEBPACK_IMPORTED_MODULE_3__, {
  base: (_core_js_smart_base__WEBPACK_IMPORTED_MODULE_0___default()),
  lang: {
    en: _lang_en_json__WEBPACK_IMPORTED_MODULE_5__,
    ru: _lang_ru_json__WEBPACK_IMPORTED_MODULE_6__
  },
  source: "ru",
  aliases: _aliases_json__WEBPACK_IMPORTED_MODULE_4__
});

class SfPropertyView extends PropertyViewElement {
  // The history adapter for a host that stores a snapshot per revision
  // (js/history.js): record.history answered from neighbouring revisions.
  static historyFromRevisions(revisions, options) {
    return (0,_js_history_js__WEBPACK_IMPORTED_MODULE_17__.historyFromRevisions)(revisions, options);
  }

  static get props() {
    return {
      templateName: {
        attribute: "template",
        default: "default"
      },
      recordId: {
        attribute: "record-id",
        default: ""
      },
      collection: {
        default: ""
      },
      showRare: {
        attribute: "show-rare",
        type: Boolean,
        default: false
      },
      // 1, or 1/2 beside a table at 1/2: the record read a step larger
      // than the list it was opened from (owner, 2026-10-14).
      size: {
        default: "1"
      },
      // view | auto | edit | create: what the surface is placed to do
      // (owner, 2026-10-14). The person's rights narrow it.
      mode: {
        default: "auto"
      },
      emptyText: {
        attribute: "empty-text",
        default: "not filled in"
      },
      emptyRecordText: {
        attribute: "empty-record-text",
        default: "This record has nothing to show"
      },
      editText: {
        attribute: "edit-text",
        default: "Edit"
      },
      saveText: {
        attribute: "save-text",
        default: "Save"
      },
      cancelText: {
        attribute: "cancel-text",
        default: "Cancel"
      },
      deleteText: {
        attribute: "delete-text",
        default: "Delete"
      },
      changedText: {
        attribute: "changed-text",
        default: "Fields changed"
      },
      errorsText: {
        attribute: "errors-text",
        default: "Errors"
      },
      conflictText: {
        attribute: "conflict-text",
        default: "The record changed; read it again"
      },
      sectionsLabel: {
        attribute: "sections-label",
        default: "Sections"
      },
      // How the sections are laid out. A list beside the groups is right
      // for a settings screen with many of them; a row of tabs is right
      // for a record with a few, and is what the mockup drew first.
      sectionsAs: {
        attribute: "sections-as",
        default: "list",
        values: ["list", "tabs"]
      },
      panel: {
        type: Boolean,
        default: false
      },
      panelSize: {
        attribute: "panel-size",
        default: "2",
        values: ["1/2", "1", "2", "full"]
      },
      panelLabel: {
        attribute: "panel-label",
        default: ""
      },
      panelWidth: {
        attribute: "panel-width",
        default: ""
      },
      closeLabel: {
        attribute: "close-label",
        default: "Close"
      },
      copyLinkLabel: {
        attribute: "copy-link-label",
        default: "Copy link"
      },
      linkCopiedLabel: {
        attribute: "link-copied-label",
        default: "Link copied"
      },
      openFullLabel: {
        attribute: "open-full-label",
        default: "Open as a page"
      },
      configureText: {
        attribute: "configure-text",
        default: "Arrange the view"
      },
      doneConfiguringText: {
        attribute: "done-configuring-text",
        default: "Done"
      },
      resetViewText: {
        attribute: "reset-view-text",
        default: "Reset"
      },
      resetViewAskText: {
        attribute: "reset-view-ask-text",
        default: "Reset the whole view?"
      },
      cancelConfiguringText: {
        attribute: "cancel-configuring-text",
        default: "Cancel"
      },
      personalLayerText: {
        attribute: "personal-layer-text",
        default: "Personal"
      },
      viewProfileLabel: {
        attribute: "view-profile-label",
        default: "View"
      },
      addViewText: {
        attribute: "add-view-text",
        default: "Add a view"
      },
      newViewText: {
        attribute: "new-view-text",
        default: "New view"
      },
      deleteViewText: {
        attribute: "delete-view-text",
        default: "Remove the view"
      },
      lastSharedViewText: {
        attribute: "last-shared-view-text",
        default: "The only view everyone has"
      },
      sharedLayerText: {
        attribute: "shared-layer-text",
        default: "Everyone's"
      },
      widthText: {
        attribute: "width-text",
        default: "Full width"
      },
      fieldLabelText: {
        attribute: "field-label-text",
        default: "Name"
      },
      sectionIconText: {
        attribute: "section-icon-text",
        default: "Section glyph"
      },
      sectionIcons: {
        attribute: "section-icons",
        default: ""
      },
      variantText: {
        attribute: "variant-text",
        default: "Look"
      },
      hintText: {
        attribute: "hint-text",
        default: "Hint"
      },
      hiddenText: {
        attribute: "hidden-text",
        default: "Hide"
      },
      configureHintText: {
        attribute: "configure-hint-text",
        default: "Drag fields between groups and onto a section on the left. Applied at once."
      },
      configureHintNarrowText: {
        attribute: "configure-hint-narrow-text",
        default: "Drag fields between groups. Applied at once."
      },
      fieldSettingsText: {
        attribute: "field-settings-text",
        default: "Field settings"
      },
      shownText: {
        attribute: "shown-text",
        default: "Shown"
      },
      showRareText: {
        attribute: "show-rare-text",
        default: "Show rare fields"
      },
      hideRareText: {
        attribute: "hide-rare-text",
        default: "Hide rare fields"
      },
      rareText: {
        attribute: "rare-text",
        default: "rare"
      },
      unplacedTitle: {
        attribute: "unplaced-title",
        default: "Not placed"
      },
      moveUpText: {
        attribute: "move-up-text",
        default: "Move up"
      },
      moveDownText: {
        attribute: "move-down-text",
        default: "Move down"
      },
      addFieldText: {
        attribute: "add-field-text",
        default: "Add a field"
      },
      inThisGroupText: {
        attribute: "in-this-group-text",
        default: "In this area"
      },
      renameText: {
        attribute: "rename-text",
        default: "Rename"
      },
      saveNameText: {
        attribute: "save-name-text",
        default: "Save the name"
      },
      cancelNameText: {
        attribute: "cancel-name-text",
        default: "Leave the name"
      },
      removeFieldText: {
        attribute: "remove-field-text",
        default: "Remove from this area"
      },
      removeGroupText: {
        attribute: "remove-group-text",
        default: "Remove this area"
      },
      removeSectionText: {
        attribute: "remove-section-text",
        default: "Remove this section"
      },
      addGroupText: {
        attribute: "add-group-text",
        default: "Add an area"
      },
      addSectionText: {
        attribute: "add-section-text",
        default: "Add a section"
      },
      newGroupTitle: {
        attribute: "new-group-title",
        default: "New area"
      },
      newSectionTitle: {
        attribute: "new-section-title",
        default: "New section"
      },
      noMatchText: {
        attribute: "no-match-text",
        default: "Nothing matches"
      },
      unplacedHintText: {
        attribute: "unplaced-hint-text",
        default: "Fields this view does not show. Drag one into a group to place it, or drag a field here to take it out."
      },
      viewConflictText: {
        attribute: "view-conflict-text",
        default: "The view changed and was read again"
      },
      viewDeniedText: {
        attribute: "view-denied-text",
        default: "You may not change this layer"
      },
      backLabel: {
        attribute: "back-label",
        default: "Back"
      },
      collectionLabel: {
        attribute: "collection-label",
        default: ""
      },
      collectionIcon: {
        attribute: "collection-icon",
        default: ""
      },
      favourite: {
        type: Boolean,
        default: false
      },
      favouriteLabel: {
        attribute: "favourite-label",
        default: "Favourite"
      },
      menuLabel: {
        attribute: "menu-label",
        default: "More"
      },
      inheritedText: {
        attribute: "inherited-text",
        default: "by default"
      },
      // C305 (1)-(4): how the record is edited, whether it shows its
      // history, and whether a panel is a column beside the list.
      edit: {
        default: "group+quick",
        values: EDIT_MODES
      },
      history: {
        default: "auto",
        values: ["auto", "off"]
      },
      modal: {
        default: "auto",
        values: ["auto", "true"]
      }
    };
  }

  constructor() {
    super();
    this.hostPort = null; // What the host last answered with, held for rendering only. Never written
    // to and never the source of a save: a save sends the fields the person
    // changed against the revision the host gave, and the host answers with
    // the object as it now is.

    this.record = null;
    this.sections = [];
    this.selectedSection = null; // Which name is being typed, while it is being typed. A rename is not
    // written until it is confirmed, so an area keeps its name while a
    // person is still deciding on another.

    this.renaming = null; // What the arrangement was when the mode was entered, and whether a
    // reset has been asked for and is waiting to be confirmed.

    this.arrangementEntered = null;
    this.resetAsked = false;
    this.epoch = 0; // Reading by group (port 1.15.0, capability group-load): the revision of
    // the record each group's fields were read at. A group read at another
    // revision than the record's now is read again the next time it is shown;
    // the record has one revision, never one per group.

    this.groupReads = new Map();
    this.groupsReading = new Set(); // A group refused as unknown-group, by the revision it was refused at:
    // the arrangement is read again once for it, and an arrangement that
    // still names it does not make the panel ask again at that revision.

    this.groupsRefused = new Map();
    this.groupEpoch = 0;
    this.message = ""; // Which group is open, and what has been changed in it. Only changed
    // fields are held: a save carries what was touched and nothing else, so it
    // cannot overwrite a field somebody else saved meanwhile.

    this.editing = null;
    this.changed = new Map();
    this.errors = new Map(); // What is wrong with an entry a field control reports it cannot write
    // yet (inputErrors). The view's own, so a host's refusal does not
    // replace them; a save waits until they are put right.

    this.inputErrors = new Map(); // The keys of inputErrors a field control reported itself (port 1.16.0:
    // a masked string that does not fill its mask, through the renderer
    // set's setFieldError). The control draws that message under itself, so
    // the panel holds the save for it and does not draw it a second time.

    this.controlErrors = new Set();
    this.conflict = null; // A save the host will make only once confirmed (port 1.14.0): what it
    // said the save will do and the digest it issued for it, held until the
    // person confirms or goes back to editing. Nothing is written meanwhile,
    // and what was entered stays.

    this.confirmation = null; // Candidate records for a reference field, per field: the page the host
    // last answered with and the search it was answered for. Held for
    // rendering only, and dropped when the search changes -- a page is not the
    // whole set, so keeping pages across searches would show stale matches.

    this.optionPages = new Map();
    this.optionSearches = new Map(); // One counter per field, because every reference field in a group is read
    // at the same moment and a single counter kept only the last answer.

    this.optionEpochs = new Map(); // Files in flight, per field, in the shape sf-file-upload reads. The host
    // stores them and reports what it reports; the component times nothing,
    // because a progress bar over a transfer it does not perform would be a
    // bar that lies.

    this.uploads = new Map(); // How the arrangement resolved and what this person may change about it,
    // as the host stated it. Absent means the view cannot be configured, and
    // no control that would lead there is drawn.

    this.view = null;
    this.configuring = false; // True while this component opened the not-placed bin for a drag, so it
    // can close it again and leave a bin the person opened alone.

    this._openedForDrag = false;
    this.viewTarget = "personal"; // The layer being edited, as a working copy of what the host sent for it.
    // A layer carries only the entries it decides; the component edits that
    // and writes it back, rather than writing the whole resolved arrangement
    // into it -- a personal layer restating every entry would pin the view and
    // stop any later change to the shared layer from showing through.

    this.layerDraft = null;
    this.entryErrors = new Map(); // One counter for the view writes, for the same reason the field options
    // have one each: an answer that arrives after the next write began is not
    // about the arrangement on screen.

    this.viewEpoch = 0; // Wide until something says otherwise: a first render that assumed a phone
    // would draw the narrow arrangement on a desktop for one frame.

    this.wide = true;
    this.wideMedia = null; // On a phone the sections are a list and a section is the next screen.
    // Null is the list; a key is that section's screen.

    this.phoneSection = null; // A short field edited in a window at its value (C305 (1)):
    // {section, group, key} while it is open. Its entry is held in
    // `changed` as a group's is, and saved as group.save with that one value.

    this.quick = null; // The field the last save wrote, marked for a moment (the saved colour).

    this.savedKeys = new Set(); // The whole record opened from «⋯ → Изменить всё» (mode edit for a while).

    this.editAll = false; // A close (or a step to the next record) asked over unsaved entries
    // (C159 (6)): {kind: close|step, reason|direction} until answered.

    this.leaveAsk = null; // The record's history (C305 (2)): open as a level of the panel, or in
    // the full screen's side column; its events as the port answered them.

    this.historyOpen = false;
    this.historyFeed = null;
    this.historyEpoch = 0;
    this.sideWide = false;
    this.sideMedia = null; // The group drawn by sf-form while it is edited: its fields and saved
    // value, kept for the edit so a render never resets the form.

    this.formEdit = null;
    this._focusFieldAfterRender = null;
  } // Declaring a prop does not create an accessor for it: `static get props()`
  // tells the template context and the manifest what the component takes, and
  // every component writes the getters it reads itself. Without these,
  // `this.recordId` and `this.collection` were undefined and both intents went
  // to the host with a null record, `this.showRare` was undefined so a rare
  // group never appeared, and `this.conflictText` was undefined so a conflict
  // with no message of its own said nothing at all. Found by the probe; the
  // same family as the raw-props work in the other Framework session, from the
  // other side of the same assumption.


  get recordId() {
    return this.getAttribute("record-id") || "";
  } // The record's collection: the attribute, else the record's own answer
  // (SB-16: a layer was saved with collection null though the record said
  // «orders», so the host could not tell whose layout it was).


  get collection() {
    return this.getAttribute("collection") || String(this.record?.collection ?? "");
  }

  get showRare() {
    return this.getBooleanAttr("show-rare", false);
  } // A record the host answered with and that holds nothing visible is a state
  // of its own: without a word for it the panel is an empty box that reads as
  // something still loading.


  get emptyRecordText() {
    return this.getAttribute("empty-record-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "emptyRecordText", this);
  }

  get isEmptyRecord() {
    if (!this.record) return false;
    const sections = this.sections ?? [];
    if (!sections.length) return true;
    return !sections.some(section => (section.groups ?? []).some(group => group.kind === "related" || (group.fields ?? []).length > 0));
  }

  get emptyText() {
    return this.getAttribute("empty-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "emptyText", this);
  }

  get editText() {
    return this.getAttribute("edit-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "editText", this);
  }

  get saveText() {
    return this.getAttribute("save-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveText", this);
  }

  get cancelText() {
    return this.getAttribute("cancel-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "cancelText", this);
  }

  get deleteText() {
    return this.getAttribute("delete-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "deleteText", this);
  } // What the host allows on the record itself, as it allows it per row in a
  // data view. The component offers nothing the host did not name: a delete
  // the host would refuse is a control that exists to fail.
  // Fields the collection has that this view places in no group. They are not
  // hidden: hiding keeps a field where it is and dims it, while these are out
  // of the arrangement altogether, and only the arranging mode draws them.


  get unplaced() {
    const fields = this.record?.unplaced;
    return Array.isArray(fields) ? fields : [];
  } // Taking a field out of every group, and putting one back. A field out of
  // the arrangement is the layer saying its group is nothing, which is what
  // the port means by a null group.


  moveFieldToUnplaced(fieldKey, index, {
    save = true
  } = {}) {
    if (!this.configuring || !this.layerDraft) return false; // «Стадия» the admin locked stays shown (port 1.22.0 view.locked).

    if (this.lockedForMe(`fields.${String(fieldKey)}.hidden`)) return false;
    let moved = null;
    let fromGroup = null;

    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        const at = (group.fields ?? []).findIndex(field => String(field.key) === String(fieldKey));

        if (at >= 0) {
          fromGroup = group;
          [moved] = group.fields.splice(at, 1);
          break;
        }
      }

      if (moved) break;
    }

    if (!moved) return false;
    const into = this.record.unplaced ?? (this.record.unplaced = []);
    const at = Math.max(0, Math.min(Number.isInteger(index) ? index : into.length, into.length));
    into.splice(at, 0, moved);

    this._writeOrder(this.layerDraft.fields, into, {
      group: null
    });

    if (fromGroup) this._writeOrder(this.layerDraft.fields, fromGroup.fields ?? [], {
      group: String(fromGroup.key)
    });
    this.requestComponentUpdate("view-move");
    return save ? this.saveView() : true;
  }

  get recordActions() {
    const actions = this.record?.actions;
    return Array.isArray(actions) ? actions.map(action => String(action)) : [];
  } // Deleting is the host's, including whether to ask first. The component says
  // it was asked for and closes when the host says it is done; a host that
  // refuses sends its reason and the panel stays open with it on screen.


  async deleteRecord() {
    if (this.mode === "view" || this.mode === "create" || !this.recordActions.includes("record.delete")) return false;
    const answer = await this._raise("record.delete", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      revision: this.record?.revision ?? null
    }); // Vocabulary §5 delete; sf-property-view-delete-record follows once (aliases.json).

    this.sfEmit("delete", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      revision: this.record?.revision ?? null,
      answer: answer?.answer ?? null
    });
    if (!answer) return false;

    if (answer.answer === "applied") {
      this.closePanel("deleted");
      return true;
    } // The person said no to the host's question: nothing to report.


    if (answer.reason === "cancelled") {
      this._setState("ready");

      return false;
    }

    this.message = answer.message || answer.reason || this.viewDeniedText;

    this._setState("ready");

    this.requestComponentUpdate("delete-refused");
    return false;
  }

  get changedText() {
    return this.getAttribute("changed-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "changedText", this);
  }

  get errorsText() {
    return this.getAttribute("errors-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "errorsText", this);
  }

  get conflictText() {
    return this.getAttribute("conflict-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "conflictText", this);
  } // The default depends on the place (C386, view round 5 LV-10): in a side
  // panel the sections are a list on the left, on a page (the work area)
  // tabs on top. A written sections-as always wins.


  get sectionsAs() {
    return this.getEnumAttr("sections-as", ["list", "tabs"], this.panel ? "list" : "tabs");
  } // A side panel with its sections on the left is wider by the section
  // list, so the fields keep the width panel-size gives (C386, LV-11): the
  // step's width, the list's column and the rail's gap. The drawer clamps it
  // to the viewport; below 48rem the panel is the whole screen and the
  // sections a list screen, so every wide window holds it (the widest, step
  // 2: 64 text steps (32rem at normal density) + 12rem + a gutter, 45rem).


  get panelWidened() {
    if (!this.panel || !this.wide || this.drawerStep === "full" || this.sectionsAs !== "list") return false; // Before the record comes its sections are not known: the panel is
    // drawn wide from its first frame, so a sectioned record does not
    // widen it under the person (first paint gate); a record of one
    // section takes the step's width when it comes.

    if (!this.sectionColumnFits) return false;
    if (!this.record) return true;
    return (this.sections?.length ?? 0) > 1 || this.configuring;
  } // Whether a column of sections is drawn as the vertical list (VR11-1): the
  // one place that decides it, read by panelWidened and sectionsLayout, so
  // the card never reserves a column the tabs fold out of. A panel below the
  // whole screen: only with an sf-tabs that can be told not to fold, and
  // only while the widened panel stays within 60 percent of the window. The
  // whole screen and a card in place: unless the drawn tabs folded there
  // (_columnFolded, the window width they folded at; read after each render).
  // Owner decision C399 (view round 13): a card docked beside the list
  // keeps the column only while the list itself keeps 48rem beside the
  // widened card; else its sections are tabs on top and the list keeps its
  // width. A card over the list (an overlay) and the whole screen always
  // keep the column. It replaces the share of the window (60 percent) of
  // VR11-1. The vertical list in a panel still waits for sf-tabs that can
  // be told not to fold (GB16): until then a panel draws tabs.


  get sectionColumnFits() {
    if (this.panel && this.drawerStep !== "full") {
      if (!tabsHoldColumn()) return false;
      if (!this._docksBesideList()) return true;

      const width = this._widenedPanelWidth();

      const host = globalThis.document?.querySelector?.("[data-sf-drawer-dock-host]");
      const room = host?.getBoundingClientRect?.().width || globalThis.innerWidth || 0;
      return !(width > 0 && room > 0 && room - width < this._listLeast());
    }

    return !(this._columnFolded && (globalThis.innerWidth || 0) <= this._columnFolded);
  } // Whether the panel stands as a column beside the list (C305 (4)): docked,
  // and the window as wide as the drawer docks at.


  _docksBesideList() {
    if (!this.docked) return false;
    return globalThis.matchMedia?.(`(min-width: ${DOCK_BREAKPOINT})`)?.matches ?? false;
  } // Whether a docked card would stand beside the list here (sf-view asks
  // before it opens one, RV4-3): a panel, docked by its settings, the window
  // as wide as the drawer docks at. The over mark is not read.


  docksBesideList() {
    if (!this.panel || this.getAttribute("modal") === "true" || this.drawerStep === "full") return false;
    return globalThis.matchMedia?.(`(min-width: ${DOCK_BREAKPOINT})`)?.matches ?? false;
  } // The width in px the card takes beside the list when docked (its step of
  // the text measure, C396), for sf-view's choice above.


  dockWidth() {
    const doc = globalThis.document;
    if (!doc?.body) return 0;
    const probe = doc.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = `position: absolute; visibility: hidden; pointer-events: none; inset-block-start: 0; inset-inline-start: 0; inline-size: ${panelMeasure(this.drawerStep)};`;
    doc.body.append(probe);
    const value = probe.getBoundingClientRect().width;
    probe.remove();
    return value;
  } // The least width the list keeps beside a docked card (C399): 48rem.


  _listLeast() {
    const size = Number.parseFloat(globalThis.getComputedStyle?.(globalThis.document?.documentElement ?? {})?.fontSize ?? "") || 16;
    return 48 * size;
  } // The widened panel's width in px (step + the column + a gutter), measured
  // once per window width and density: the step is a text measure, so it
  // moves with the body text size.


  _widenedPanelWidth() {
    const doc = globalThis.document;
    if (!doc?.body) return 0;
    const key = `${globalThis.innerWidth}|${this.drawerStep}|${doc.documentElement.getAttribute("data-sf-density") ?? ""}`;
    if (this._widenedWidth?.key === key) return this._widenedWidth.value;
    const probe = doc.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = `position: absolute; visibility: hidden; pointer-events: none; inset-block-start: 0; inset-inline-start: 0; inline-size: calc(${panelMeasure(this.drawerStep)} + ${SECTIONS_WIDTH} + var(--sf-drawer-gutter, var(--sf-space-1)));`;
    doc.body.append(probe);
    const value = probe.getBoundingClientRect().width;
    probe.remove();
    this._widenedWidth = {
      key,
      value
    };
    return value;
  } // After a render (VR11-1): a column whose vertical tabs drew the folded
  // row is laid as tabs on top instead, until the window is wider than where
  // they folded. Only where the column is not decided before drawing (the
  // whole screen, a card in place).


  _checkSectionColumn() {
    if (this.sectionsLayout !== "column" || this.configuring) return;
    const root = this.panel ? this.panelContent?.() : this;
    const tabs = root?.querySelector?.(".sf-property-view-sections sf-tabs");
    if (!tabs) return; // The tabs fold later too (their place narrows): every render of theirs is read.

    this._watchedColumnTabs ??= new WeakSet();

    if (!this._watchedColumnTabs.has(tabs)) {
      this._watchedColumnTabs.add(tabs);

      tabs.onAfterRender?.(() => requestAnimationFrame(() => this._checkSectionColumn()), {
        once: false,
        immediate: false
      });
    }

    const list = tabs.querySelector("[role=tablist]");
    if (!list || list.getAttribute("aria-orientation") === "vertical") return;
    this._columnFolded = globalThis.innerWidth || 1;
    this.requestComponentUpdate("section-column");
  } // Whether the rail left the fields under 20rem the last time it was drawn
  // at this window width, step and density (C403): then the panel is the
  // list of sections instead. Measured after a render (_checkRail).


  _railShort() {
    return Boolean(this._railShortAt && this._railShortAt === this._railKey());
  }

  _railKey() {
    return `${globalThis.innerWidth || 0}|${this.drawerStep}|${globalThis.document?.documentElement?.getAttribute?.("data-sf-density") ?? ""}`;
  } // After a render with the rail: the room it left the fields, against 20rem.


  _checkRail() {
    if (this.sectionsLayout !== "rail") return;
    const root = this.panelContent?.(); // The fields' column beside the rail (the frame that scrolls them).

    const body = root?.querySelector?.(".sf-property-view-frame");
    const rail = root?.querySelector?.(".sf-property-view-sections");
    if (!body || !rail) return;
    const width = body.getBoundingClientRect().width;
    if (!(width > 0)) return;
    const size = Number.parseFloat(globalThis.getComputedStyle?.(globalThis.document?.documentElement ?? {})?.fontSize ?? "") || 16;
    if (width >= 20 * size - 0.5) return;
    this._railShortAt = this._railKey();
    this.requestComponentUpdate("section-rail");
  } // The window grew past where the column's tabs folded: the column is tried again.


  _onColumnResize() {
    // A new width tries the rail again (C403).
    if (this._railShortAt && this._railShortAt !== this._railKey()) {
      this._railShortAt = null;
      this.requestComponentUpdate("section-rail");
    }

    if (!this._columnFolded || (globalThis.innerWidth || 0) <= this._columnFolded) return;
    this._columnFolded = 0;
    this.requestComponentUpdate("section-column");
  } // The drawer's width: the step's text measure (C396), and with the
  // section list beside the groups that list's column and the rail's gap.
  // A whole-screen step keeps the drawer's own 100vi.


  get panelWidthStyle() {
    if (!this.panel || !this.wide || this.drawerStep === "full") return "";
    const step = panelMeasure(this.drawerStep);
    if (!this.panelWidened) return ` --sf-drawer-width: ${step};`;
    return ` --sf-drawer-width: calc(${step} + ${SECTIONS_WIDTH} + var(--sf-drawer-gutter, var(--sf-space-1)));`;
  }

  get sectionsLabel() {
    return this.getAttribute("sections-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "sectionsLabel", this);
  } // A panel is a drawer over the page; `full` (the record as the page,
  // stand 24's record panel) draws it in place instead.


  get panel() {
    return this.getBooleanAttr("panel", false) && !this.full;
  }

  get full() {
    return this.getBooleanAttr("full", false);
  }

  set full(value) {
    this.toggleAttribute("full", Boolean(value));
  } // A panel shows while its element is not hidden and not closed by `open`
  // (simai/ui-pro#4; standard 1.3.8 §7.2.2, §19): a page or an assembly
  // closes it by `hidden` or open=false and brings it back by the same.


  get panelOpen() {
    return this.panel && !this.hidden && this.getAttribute("open") !== "false";
  } // The drawer opens and closes with it and takes the panel on and off the
  // layer stack; there is nothing to register here.


  syncPanelOpen() {
    this.requestComponentUpdate("panel-open");
  } // ---------- the manifest's values (§4) ----------


  get revision() {
    return this.record?.revision === undefined || this.record?.revision === null ? "" : String(this.record.revision);
  }

  get section() {
    return this.selectedSection ?? "";
  } // The step the drawer is drawn at (C289 (2)): panel-size when it names a
  // step; else the step nearest the width a former `panel-width` asked for.
  // Not a getter named panelSize: the declared property of that name is the
  // attribute's own accessor and wins over a getter, so a panel-width alone
  // was drawn at the default step 1.


  get drawerStep() {
    const size = this.getAttribute("panel-size");
    if (["1/2", "1", "2", "full"].includes(size)) return size;
    const width = this.panelWidth;
    return width ? nearestPanelStep(width) : "2";
  } // How the sections are laid out (C289 (1), (5); R250; C386): a panel on
  // a phone is the list of sections, each opening as a level with «←»; a
  // panel on the whole screen keeps a column on the left; a narrower panel
  // keeps sections-as (a list by default, the panel widened for it, or a
  // line of tabs under its head, what does not fit in «Ещё (n)»). In place
  // (not a panel) a wide page keeps `sections-as` (tabs by default).


  get sectionsLayout() {
    if (!this.wide) return "phone"; // Arranging on the whole screen keeps the rail of sections beside the
    // groups, each its own scroller. A narrower panel (44, 52 or 64 text steps,
    // less its gutters) cannot hold a rail and fields of 20rem beside it:
    // the rail left the fields 212 px at 30rem and 116 px at 24rem (view
    // round 5, LV-3). There it arranges stacked, as tabs do (C311 (4)):
    // the picker, «Вкладки» (dragged as before), then the fields.

    if (this.panel) {
      if (this.drawerStep === "full") return this.configuring || this.sectionColumnFits ? "column" : "tabs";
      if (this.configuring) return "tabs";
      if (this.sectionsAs !== "list") return "tabs";
      if (this.panelWidened) return "column"; // Owner decision C403 (view round 14): where the column does not
      // fit (C399: beside the list it would leave the list under 48rem;
      // and every side panel until sf-tabs can be told not to fold), the
      // sections are a narrow rail of icons and names at the left, as
      // wide as the longest name (at most 10rem); where the rail would
      // leave the fields under 20rem the panel is the list of sections,
      // each opening as a level with «←», as on the phone (C386). No
      // tabs on top in a side panel any more (the interim of C399).

      return this._railShort() ? "level" : "rail";
    }

    if (this.sectionsAs === "tabs" || !this.sectionColumnFits) return "tabs";
    return "column";
  } // Once per element: a former `panel-width` is said in the console with
  // the step it lands on, and noted in SF.deprecations.


  _notePanelWidth() {
    const width = this.panelWidth;
    if (!width || this.hasAttribute("panel-size") || this._panelWidthNoted === width) return;
    this._panelWidthNoted = width;
    const step = nearestPanelStep(width);
    (0,_core_js_deprecations_js__WEBPACK_IMPORTED_MODULE_12__.noteDeprecated)({
      component: "sf-view-properties",
      kind: "attribute",
      from: "panel-width",
      to: "panel-size",
      since: "2026-11-17",
      remove_after: PANEL_WIDTH_UNTIL,
      package: "view"
    });
    globalThis.console?.info?.(`[SIMAI Framework] sf-view-properties: panel-width="${width}" is a former name until ${PANEL_WIDTH_UNTIL}; the panel is drawn at the step panel-size="${step}" (C157 (2), C289 (2)).`);
  }

  get panelLabel() {
    return this.getAttribute("panel-label") || "";
  }

  get panelWidth() {
    return this.getAttribute("panel-width") || "";
  }

  get size() {
    return this.getAttribute("size") === "1/2" ? "1/2" : "1";
  } // The size written on the controls the panel draws: the host's own when it
  // has one, none when it has not, so page density moves them with the page
  // (C22), as sf-view and sf-view-table do since view 1.6.0. With size 1
  // written on them they stayed 40 under compact density beside the page's
  // 32. `size` still chooses the panel's own type steps (1/2 or 1).


  get controlSize() {
    const size = this.getAttribute("size");
    return size === "1/2" || size === "1" ? size : null;
  }

  get mode() {
    const value = this.getAttribute("mode");
    return MODES.includes(value) ? value : "auto";
  } // Whether this person may change the fields. A view surface never offers
  // it; since port 1.12.0 the host says so with record.edit among the
  // record's actions, and a reader is sent none. A host on an earlier port
  // never sent it, and for it a group is editable unless it says otherwise.


  get mayEdit() {
    if (this.mode === "view" || this.editMode === "none") return false;
    if (this.mode === "create") return true;
    if (!versionAtLeast(this.hostPort?.version, "1.12.0")) return true;
    return this.recordActions.includes("record.edit");
  } // Every group open at once: a full edit page, or a create.


  get openAll() {
    return this.mode === "create" || (this.mode === "edit" || this.editAll) && this.mayEdit;
  } // C305 (1): group | group+quick | none; group+quick by default wherever
  // the record may be edited, the same short fields the table edits at the
  // cell (C296).


  get editMode() {
    const value = this.getAttribute("edit");
    return EDIT_MODES.includes(value) ? value : "group+quick";
  } // The window at a value is SIMAI Framework sf-popover: where the page has
  // not defined it yet, a short field goes through its group as before.


  get quickEdit() {
    return this.editMode === "group+quick" && this.mayEdit && !this.openAll && !this.configuring && Boolean(globalThis.customElements?.get?.("sf-popover"));
  } // A short field: one control at its value, by its type. A list of several,
  // a set type, a condition and a read-only field go through the group. (A
  // field's own say -- a port field key -- is ordered with the port edition.)


  isQuickField(field) {
    if (!field || field.readonly === true || field.when || field.multiple === true) return false;
    const type = String(field.propertyType || field.type || "");
    if (!QUICK_TYPES.has(type) || (0,_js_set_fields_js__WEBPACK_IMPORTED_MODULE_15__.drawsSetField)(field)) return false; // A person picked from the host's pages needs the picker's host.

    if (type === "user" && !this.canPickRecords) return false;
    return true;
  } // C305 (2): the history is offered where the host answers record.history
  // (capability record-history) and the page did not turn it off.


  get historyOffered() {
    return this.getAttribute("history") !== "off" && this.mode !== "create" && Boolean(this.recordId) && Boolean(this.hostPort?.capabilities?.includes?.("record-history"));
  } // C305 (3): the full screen keeps the history in a column of its own
  // from 80rem; narrower it is a level of the panel, as in a panel.


  get historySide() {
    return this.historyOffered && this.sideWide && this.sectionsLayout === "column" && !this.configuring && (this.drawerStep === "full" || !this.panel);
  } // C305 (4): a panel narrower than the screen is a column beside the list
  // from 64rem (sf-drawer docked), the list usable; below it, and with
  // modal="true", it floats over a scrim.
  // A panel opened over another card's panel (a related record, C289 (6))
  // stays a window over the one below, which the Framework's overlay dims.


  get docked() {
    if (!this.panel || this.getAttribute("modal") === "true" || this.drawerStep === "full") return false; // sf-view opens its record card over the list where docking it would
    // re-flow the list (RV4-3; set by sf-view, not a public attribute).

    if (this.hasAttribute("data-sf-view-card-over")) return false; // Only a panel below counts: the one under a related record stays docked.

    const own = this._ownDrawer();

    const cards = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.openLayers)("panel").filter(owner => owner?.parentElement?.localName === this.localName);
    const at = cards.indexOf(own);
    return at === -1 ? cards.length === 0 : at === 0;
  } // A docked panel is a column of the page only where something gives it the
  // room: the element marked data-sf-drawer-dock-host pads itself by the
  // panel's width (sf-drawer). sf-view marks itself when it opens a record in
  // its record-card; a panel the page opened by itself (Larena's lists, the
  // admin list study: row-open="row" and the page places the card) found no
  // host, so it stood over the list's end -- the last column and the pages
  // under it (view round 5, LV-2; C305 (4): the list stays usable). With no
  // host on the page the panel marks one as it opens: the sf-view whose
  // record-card names it, else the page's only sf-view, else its own parent.


  _dockBeside() {
    const docked = this.docked;
    const document = globalThis.document;
    if (!docked || !this.panelOpen || !document || document.querySelector("[data-sf-drawer-dock-host]")) return docked;
    const views = [...document.querySelectorAll("sf-view")];
    const host = (this.id ? views.find(view => view.getAttribute("record-card") === this.id) : null) ?? (views.length === 1 ? views[0] : null) ?? (this.parentElement && this.parentElement !== document.documentElement ? this.parentElement : null);
    host?.setAttribute("data-sf-drawer-dock-host", "");
    return docked;
  } // What the drawer is told to be. `size` is a ladder and its widest step short
  // of full measured 391px on a consumer's screen, which is too narrow for two
  // columns -- labels wrapped and a record title broke over three lines. `width`
  // is a declared input on sf-drawer, so a consumer can ask for 40rem and get
  // it. A deeper window in the stack is a step narrower than whatever the base
  // is, so the one below shows along its leading edge.
  // The width a consumer asked for, and nothing else. A stacked panel used to be
  // narrowed from it here, by a step this component counted itself -- interim
  // work while sf-drawer had no way to express a stack. It does now: the drawer
  // insets each window by depth times `stack-offset` and keeps its width, so a
  // stack four deep no longer ends in a sliver. The two interim mechanisms this
  // replaced had drifted apart from each other as well -- the width subtracted a
  // space-5 step while the panel margin drew a space-4 one, so the window moved
  // one distance and shrank by another.
  //
  // A section list is added to the panel rather than taken out of it (owner,
  // 2026-10-07): the fields keep the width the consumer asked for and the
  // window grows by the column beside them. Taken out, a 40rem panel showing
  // sections gave its fields 26rem and the two-column arrangement collapsed --
  // the same record looked narrower for having more in it.
  //
  // Never wider than the window less the strip of controls beside it: the
  // close, copy-link and open-full controls stand on the drawer's edge,
  // outside the panel's inline start, and the drawer places them a step
  // beyond the panel's width without looking at the window. The cap used to
  // be the window less space-4 (32px at the default root size) while the
  // strip takes a control and a step on each side (64px), so in a frame
  // under ~1024px the controls stood half off the screen (docs review,
  // round 4, 2026-10-20). The cap holds for every width, not only for one
  // grown by the rail: a consumer's own panel-width meets the same edge.


  get drawerWidth() {
    // The panel never grows and never takes a width of its own (C289 (2)):
    // the drawer is drawn at a step of its ladder.
    return null;
  }

  get closeLabel() {
    return this.getAttribute("close-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "closeLabel", this);
  }

  get linkCopiedLabel() {
    return this.getAttribute("link-copied-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "linkCopiedLabel", this);
  }

  get copyLinkLabel() {
    return this.getAttribute("copy-link-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "copyLinkLabel", this);
  }

  get configureText() {
    return this.getAttribute("configure-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "configureText", this);
  }

  get resetViewAskText() {
    return this.getAttribute("reset-view-ask-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "resetViewAskText", this);
  }

  get cancelConfiguringText() {
    return this.getAttribute("cancel-configuring-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "cancelConfiguringText", this);
  }

  get doneConfiguringText() {
    return this.getAttribute("done-configuring-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "doneConfiguringText", this);
  }

  get resetViewText() {
    return this.getAttribute("reset-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "resetViewText", this);
  }

  get addViewText() {
    return this.getAttribute("add-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "addViewText", this);
  }

  get newViewText() {
    return this.getAttribute("new-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "newViewText", this);
  }

  get deleteViewText() {
    return this.getAttribute("delete-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "deleteViewText", this);
  }

  get lastSharedViewText() {
    return this.getAttribute("last-shared-view-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "lastSharedViewText", this);
  }

  get viewProfileLabel() {
    return this.getAttribute("view-profile-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewProfileLabel", this);
  }

  get personalLayerText() {
    return this.getAttribute("personal-layer-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "personalLayerText", this);
  }

  get sharedLayerText() {
    return this.getAttribute("shared-layer-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "sharedLayerText", this);
  }

  get widthText() {
    return this.getAttribute("width-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "widthText", this);
  }

  get variantText() {
    return this.getAttribute("variant-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "variantText", this);
  }

  get hintText() {
    return this.getAttribute("hint-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "hintText", this);
  }

  get hiddenText() {
    return this.getAttribute("hidden-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "hiddenText", this);
  }

  get configureHintText() {
    return this.getAttribute("configure-hint-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "configureHintText", this);
  } // On a narrow panel the section list is a screen of its own, so a field has
  // nowhere beside the fields to be dropped. The wide sentence names the list
  // on the left, and saying that where there is no list promises something a
  // person cannot do.


  get configureHintNarrowText() {
    return this.getAttribute("configure-hint-narrow-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "configureHintNarrowText", this);
  }

  get fieldSettingsText() {
    return this.getAttribute("field-settings-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "fieldSettingsText", this);
  }

  get shownText() {
    return this.getAttribute("shown-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "shownText", this);
  }

  get showRareText() {
    return this.getAttribute("show-rare-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "showRareText", this);
  }

  get hideRareText() {
    return this.getAttribute("hide-rare-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "hideRareText", this);
  }

  get rareText() {
    return this.getAttribute("rare-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "rareText", this);
  }

  get unplacedTitle() {
    return this.getAttribute("unplaced-title") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "unplacedTitle", this);
  }

  get moveUpText() {
    return this.getAttribute("move-up-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "moveUpText", this);
  }

  get moveDownText() {
    return this.getAttribute("move-down-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "moveDownText", this);
  }

  get addFieldText() {
    return this.getAttribute("add-field-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "addFieldText", this);
  }

  get renameText() {
    return this.getAttribute("rename-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "renameText", this);
  }

  get saveNameText() {
    return this.getAttribute("save-name-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveNameText", this);
  }

  get cancelNameText() {
    return this.getAttribute("cancel-name-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "cancelNameText", this);
  }

  get removeFieldText() {
    return this.getAttribute("remove-field-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "removeFieldText", this);
  }

  get removeGroupText() {
    return this.getAttribute("remove-group-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "removeGroupText", this);
  }

  get removeSectionText() {
    return this.getAttribute("remove-section-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "removeSectionText", this);
  }

  get addGroupText() {
    return this.getAttribute("add-group-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "addGroupText", this);
  }

  get addSectionText() {
    return this.getAttribute("add-section-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "addSectionText", this);
  }

  get newGroupTitle() {
    return this.getAttribute("new-group-title") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "newGroupTitle", this);
  }

  get newSectionTitle() {
    return this.getAttribute("new-section-title") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "newSectionTitle", this);
  }

  get sectionIconText() {
    return this.getAttribute("section-icon-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "sectionIconText", this);
  }

  get fieldLabelText() {
    return this.getAttribute("field-label-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "fieldLabelText", this);
  }

  get inThisGroupText() {
    return this.getAttribute("in-this-group-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "inThisGroupText", this);
  }

  get noMatchText() {
    return this.getAttribute("no-match-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "noMatchText", this);
  } // Where a group stands among the groups a person can see, and how many there
  // are, so the control that moves it knows when it has nowhere to go.


  get currentGroups() {
    const section = (this.sections ?? []).find(part => String(part.key) === this.selectedSection) ?? (this.sections ?? [])[0] ?? null;
    return section?.groups ?? [];
  }

  groupAt(groupKey) {
    return this.currentGroups.findIndex(group => String(group.key) === String(groupKey));
  }

  get groupCount() {
    return this.currentGroups.length;
  } // Moving a group one step, for a person who would rather press than drag --
  // and for anyone who cannot drag at all.


  moveGroupBy(groupKey, step) {
    const at = this.groupAt(groupKey);
    if (at < 0) return false;
    const to = at + step;
    if (to < 0 || to >= this.groupCount) return false;
    const section = (this.sections ?? []).find(part => String(part.key) === this.selectedSection) ?? (this.sections ?? [])[0] ?? null;
    if (!section) return false;
    return this.moveGroup(groupKey, String(section.key), to);
  } // Every field this group could hold, with the ones it holds already marked.
  // A collection can have hundreds, so what a person needs is to find one and
  // tick it -- and the ticked set is exactly what this area shows, which makes
  // unticking the way a field leaves it.
  //
  // Where a field lives now is said once, as a heading over the stretch of
  // list that comes from there, rather than after every name in it: written
  // into the row, the area's name was repeated on every line and pushed the
  // name it mattered for off the end.
  //
  // The order and the headings are a snapshot taken when the list opens.
  // Ticking a field moves it into this area, so a live grouping would move the
  // row out from under the pointer at the moment it was pressed -- and a list
  // that rearranges itself as you tick is a list nobody can tick twice.


  fieldChoices(groupKey) {
    const key = String(groupKey);
    const session = this._addSession?.group === key ? this._addSession : this._buildAddSession(key);
    const here = new Set();

    for (const field of this._locateGroup(key)?.group?.fields ?? []) here.add(String(field.key));

    const search = this.addSearch.trim().toLowerCase();
    const options = [];

    for (const entry of session.order) {
      if (search && !entry.label.toLowerCase().includes(search) && !entry.key.toLowerCase().includes(search)) continue;
      options.push({ ...entry,
        selected: here.has(entry.key)
      });
    }

    return options;
  }

  _buildAddSession(groupKey) {
    const key = String(groupKey);
    const order = [];
    const seen = new Set();

    const take = (field, from) => {
      const fieldKey = String(field.key);
      if (seen.has(fieldKey)) return;
      seen.add(fieldKey);
      order.push({
        key: fieldKey,
        label: String(field.label ?? field.key),
        group: from
      });
    };

    for (const field of this._locateGroup(key)?.group?.fields ?? []) take(field, this.inThisGroupText);

    for (const field of this.unplaced ?? []) take(field, this.unplacedTitle);

    for (const section of this.sections ?? []) {
      for (const group of section.groups ?? []) {
        if (String(group.key) === key || group.kind === "related") continue;
        const from = String(group.label ?? group.key);

        for (const field of group.fields ?? []) take(field, from);
      }
    }

    return {
      group: key,
      order
    };
  } // The list opens on a snapshot of where every field is, and forgets it when
  // it closes, so the next opening is read against what the arrangement became.


  startAddSession(groupKey) {
    this._addSearch = "";
    this._addSession = this._buildAddSession(groupKey);
    this.requestComponentUpdate("add-session");
    return this._addSession;
  }

  endAddSession() {
    this._addSession = null;
    this._addSearch = "";
    this.requestComponentUpdate("add-session");
  }

  get addSearch() {
    return this._addSearch ?? "";
  }

  setAddSearch(value) {
    this._addSearch = String(value ?? "");
    this.requestComponentUpdate("add-search");
    return this._addSearch;
  } // Ticking places the field here; unticking takes it out of every area, which
  // is where a field goes when it belongs to none.


  toggleFieldInGroup(fieldKey, groupKey, wanted) {
    return wanted ? this.moveField(fieldKey, groupKey, Number.MAX_SAFE_INTEGER) : this.moveFieldToUnplaced(fieldKey);
  }

  get unplacedHintText() {
    return this.getAttribute("unplaced-hint-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "unplacedHintText", this);
  }

  get viewConflictText() {
    return this.getAttribute("view-conflict-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewConflictText", this);
  } // The head's own words. The port carries a collection *key* and no record
  // title, icon or favourite state, and the port is fixed at 1.7.0 for this
  // work -- so these are the component's inputs, set by the host the way
  // `panel-label` and `panel-width` already are, rather than a port change.


  get collectionLabel() {
    return this.getAttribute("collection-label") || "";
  }

  get collectionIcon() {
    return this.getAttribute("collection-icon") || "";
  }

  get favourite() {
    return this.hasAttribute("favourite");
  } // The favourite star's look (C393, DEV msg-975e95fe; the twin of
  // ui-pro's sf-view-properties 1.24.0): the Framework's toggle where
  // sf-button-icon declares it (1.14.0), read from its own interface; with
  // an sf-button-icon without it (pair ui-b654460cad2a carries 1.13.11) the
  // star stays the neutral ghost toggle of C211 (1). Until the tag is
  // defined the star is drawn as before and drawn again once it is.


  starLook() {
    const Button = globalThis.customElements?.get?.("sf-button-icon");

    if (!Button) {
      if (!this._starLookWait && globalThis.customElements?.whenDefined) {
        this._starLookWait = globalThis.customElements.whenDefined("sf-button-icon").then(() => this.requestComponentUpdate("star-look"));
      }

      return null;
    }

    let values = null;

    try {
      values = Button.sfInterface?.settings?.appearance?.values;
    } catch {
      values = null;
    }

    return Array.isArray(values) && values.includes("toggle") ? "toggle" : null;
  }

  get favouriteLabel() {
    return this.getAttribute("favourite-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "favouriteLabel", this);
  }

  get menuLabel() {
    return this.getAttribute("menu-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "menuLabel", this);
  } // What a value inherited from somewhere else is marked with. The prototype
  // writes «по умолчанию» beside it, so a person can see that the record has not
  // decided this and that changing the source will change it here.


  get inheritedText() {
    return this.getAttribute("inherited-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "inheritedText", this);
  } // The star answers the press at once and reports it. Storing a favourite is
  // the host's, and a host that refuses sets the attribute back -- but a star
  // that does nothing until an answer arrives reads as a control that is
  // broken, which is what it read as on the stand.


  toggleFavourite() {
    const next = !this.favourite;
    this.toggleAttribute("favourite", next);
    this.requestComponentUpdate("favourite");
    this.dispatchEvent(new CustomEvent("sf-view-properties-favourite", {
      bubbles: true,
      composed: true,
      detail: {
        record_id: this.recordId || null,
        collection: this.collection || null,
        favourite: next
      }
    }));
    return true;
  } // The «⋯» menu: what belongs to the view rather than to the record. Configure
  // and reset live here, as the mockup has them, so the panel head carries one
  // control instead of a row of words.


  get panelMenuItems() {
    const items = [];

    if (this.canConfigureView && !this.configuring) {
      items.push({
        id: "configure",
        name: this.configureText,
        icon: "tune"
      }); // «Вернуть общий вид» (save model C1, SB-C12): a person with a
      // layout of their own takes the shared one back (view.reset).

      if (this.hasPersonalEdits && this.editableLayers.includes("personal") && !this.viewRequired) {
        items.push({
          id: "reset",
          name: this.resetViewText,
          icon: "restart_alt"
        });
      }
    } // Resetting is not offered here while the view is being arranged: the
    // bar at the foot carries «Сбросить» with a confirmation beside the
    // other two answers, and the same act behind a «⋯» as well is the same
    // destruction reachable two ways, one of them quietly (owner,
    // 2026-10-08).


    if (this.hasRare) {
      items.push({
        id: "show-rare",
        name: this.showRare ? this.hideRareText : this.showRareText,
        icon: this.showRare ? "unfold_less" : "unfold_more"
      });
    }

    return items;
  } // What the «⋯» holds for the record itself (C289 (3), (6); C180 (2)):
  // copy its address and open it as a page -- they stood outside the panel
  // on the scrim and drew a white glyph on a white plate -- and, last and
  // apart, deleting it. A reading panel has no foot for one delete.


  get recordMenuItems() {
    const items = []; // «Изменить всё» (C305 (1)): every group open at once, one Save -- in
    // the panel's head; an inline view has its groups' «Изменить» and no
    // row of its own for it (the skeleton keeps the first group in place).

    if (this.panel && this.mayEdit && !this.openAll && !this.configuring && this.mode !== "create" && (this.sections ?? []).some(section => (section.groups ?? []).some(group => group.kind !== "related" && group.editable !== false))) {
      items.push({
        id: "edit-all",
        name: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "editAllText", this),
        icon: "edit"
      });
    } // «История изменений» (C305 (2)): a level of the panel; the full
    // screen from 80rem shows it in its own column instead.


    if (this.historyOffered && !this.historySide) {
      items.push({
        id: "history",
        name: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "historyText", this),
        icon: "history"
      });
    }

    if (this.address) items.push({
      id: "copy-link",
      name: this.copyLinkLabel,
      icon: "link"
    });
    if (this.canOpenFullPage) items.push({
      id: "open-full",
      name: this.openFullLabel,
      icon: "open_in_full"
    });
    return items;
  }

  get canDeleteRecord() {
    return this.mode !== "view" && this.mode !== "create" && this.recordActions.includes("record.delete") && !this.configuring;
  } // ─── the standard menu (owner, 2026-10-12) ──────────────────────────────
  // The «⋯» and the view chooser open the Framework's standard menu: one
  // sf-menu-context beside the page, filled for whichever control asked.


  async openStandardMenu(anchor, {
    label,
    entries,
    select,
    align = "end"
  }) {
    if (!(anchor instanceof Element)) return null; // The panel did not draw a menu before, so its rule does not fetch one;
    // the Loader is asked for it the first time it is wanted.

    await globalThis.SF?.Loader?.ensure?.(["sf-menu-context"]);
    let menu = this._standardMenu;

    if (!menu?.isConnected) {
      menu = document.createElement("sf-menu-context");
      menu.setAttribute("popup", "");
      menu.dataset.sfPropertyViewMenu = "";
      menu.addEventListener("sf-menu-context-select", event => this._standardMenuSelect?.(event.detail?.id));
      (this.closest("dialog[open]") || document.body).append(menu);
      this._standardMenu = menu;
    }

    if (menu.isOpen && this._standardMenuAnchor === anchor) {
      menu.close();
      return null;
    } // The panel's step and the density of its area, on every opening (owner
    // remark 2026-11-15): the menu stands on <body> or in the open dialog,
    // outside the panel, and fell back to the menu's own 1/2.


    menu.setAttribute("size", this.size);
    (0,_view_common_density_js__WEBPACK_IMPORTED_MODULE_10__.followDensity)(menu, this);
    menu.setAttribute("aria-label", label ?? "");
    menu.entries = entries;
    this._standardMenuSelect = select;
    this._standardMenuAnchor = anchor;
    return menu.openFor(anchor, {
      align
    });
  }

  openPanelMenu(anchor) {
    // The history level's «⋯»: which events it shows.
    if (this.historyOpen && !this.historySide) {
      const fieldsOnly = JSON.stringify(this.historyFeed?.kinds ?? null) === JSON.stringify(["update"]);
      return this.openStandardMenu(anchor, {
        label: this.menuLabel,
        entries: [{
          id: "history-kinds:update",
          text: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "historyFieldsText", this),
          kind: "radio",
          checked: fieldsOnly,
          icon: "edit_note"
        }, {
          id: "history-kinds:all",
          text: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "historyAllText", this),
          kind: "radio",
          checked: !fieldsOnly,
          icon: "list"
        }],
        select: id => this._chooseStandardEntry(id)
      });
    }

    const entries = [];
    const profiles = this.viewProfiles; // The profile is chosen in sf-profile-picker only (C163 (1), C311 (5),
    // RC-6): outside the mode one row «Вид: <name>» enters it with the
    // picker open. A person who cannot arrange the view chooses in the
    // select-only picker above the fields; the menu has no views submenu
    // for anyone (the dispatcher's call on C311 (5)).

    if (profiles.length > 1 && !this.configuring && this.canConfigureView) {
      const current = profiles.find(profile => profile.id === this.viewProfile);
      entries.push({
        id: "view-profile-picker",
        text: `${this.viewProfileLabel}: ${current?.label ?? ""}`,
        icon: "view_sidebar"
      });
    } // «Сохранить как моё» in the head «⋯» while arranging (C311 (5)).


    if (this.canSaveAsMine) {
      entries.push({
        id: "save-as-mine",
        text: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveAsMineText", this),
        icon: "person"
      });
    }

    const record = this.recordMenuItems;
    if (entries.length && record.length) entries.push({
      type: "separator"
    });
    entries.push(...record.map(item => ({
      id: item.id,
      text: item.name,
      icon: item.icon
    })));
    const items = this.panelMenuItems;
    if (entries.length && items.length) entries.push({
      type: "separator"
    });
    entries.push(...items.map(item => ({
      id: item.id,
      text: item.name,
      icon: item.icon
    })));
    const hosted = this.hostMenuEntries();
    if (entries.length && hosted.length) entries.push({
      type: "separator"
    });
    entries.push(...hosted);

    if (this.canDeleteRecord) {
      if (entries.length) entries.push({
        type: "separator"
      });
      entries.push({
        id: "delete",
        text: this.deleteText,
        icon: "delete",
        danger: true
      });
    }

    if (!entries.length) return null;
    return this.openStandardMenu(anchor, {
      label: this.menuLabel,
      entries,
      select: id => this._chooseStandardEntry(id)
    });
  } // The host's own menu items, as rows of the standard menu: its text, its
  // icon (icon, icon-start or data-icon), a link row for an address.


  hostMenuElements() {
    // In a panel the holder is in the drawer, which is moved to the page's end.
    const holder = this.querySelector("[data-host-menu]") ?? this.panelContent?.()?.querySelector?.("[data-host-menu]");
    return holder ? [...holder.children] : [];
  }

  hostMenuEntries() {
    return this.hostMenuElements().map((element, at) => {
      const control = element.matches("a[href], button") ? element : element.querySelector("a[href], button") ?? element;
      const text = (element.getAttribute("text") ?? element.getAttribute("aria-label") ?? control.textContent ?? "").trim();
      const href = control.matches?.("a[href]") ? control.getAttribute("href") : null;
      return {
        id: `host:${at}`,
        text,
        icon: element.getAttribute("icon") ?? element.getAttribute("icon-start") ?? element.dataset.icon ?? undefined,
        href: href || undefined,
        danger: element.getAttribute("scheme") === "error" || element.dataset.danger === "true",
        disabled: element.hasAttribute("disabled") || control.disabled === true
      };
    }).filter(entry => entry.text);
  }

  _chooseStandardEntry(id) {
    const value = String(id ?? "");

    if (value.startsWith("host:")) {
      const element = this.hostMenuElements()[Number(value.slice("host:".length))];
      const control = element?.matches("a[href], button") ? element : element?.querySelector("a[href], button") ?? element;
      if (!control?.matches?.("a[href]")) control?.click?.();
      return true;
    }

    if (value.startsWith("history-kinds:")) {
      const kinds = value.slice("history-kinds:".length);
      return this.setHistoryKinds(kinds === "all" ? null : [kinds]);
    }

    return this.chooseMenuItem(value);
  }

  chooseMenuItem(id) {
    if (id === "configure") return this.startConfiguringView();
    if (id === "save-as-mine") return this.saveAsMine();

    if (id === "view-profile-picker") {
      if (!this.configuring && !this.startConfiguringView()) return false;
      this.whenRendered?.(() => requestAnimationFrame(() => {
        const picker = (this.panelContent?.() ?? this).querySelector?.('sf-profile-picker[data-action="view-profile"]');
        (picker?.querySelector?.("button") ?? picker)?.click?.();
      }), {
        next: true
      });
      return true;
    }

    if (id === "reset") return this.resetView();
    if (id === "show-rare") return this.toggleShowRare();
    if (id === "copy-link") return this.copyAddress();
    if (id === "open-full") return this.openFullPage();
    if (id === "delete") return this.deleteRecord();
    if (id === "history") return this.openHistory();

    if (id === "edit-all") {
      this.quick = null;
      this.editing = null;
      this.formEdit = null;
      this.editAll = true;
      this.requestComponentUpdate("editing");
      return true;
    }

    return false;
  }

  get backLabel() {
    return this.getAttribute("back-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "backLabel", this);
  }

  get viewDeniedText() {
    return this.getAttribute("view-denied-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewDeniedText", this);
  }

  get openFullLabel() {
    return this.getAttribute("open-full-label") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "openFullLabel", this);
  } // Where this object lives, as the host named it when it answered. Never
  // constructed here: a composite that built a URL would be guessing at the
  // consumer's routing.


  get address() {
    return this.record?.address ?? null;
  } // Opening the record as a page is the host's, and so is whether there is a
  // page at all: an address worth copying does not promise one. Drawn on the
  // address alone, the control stood in every panel and did nothing in the
  // hosts that route no further.


  get canOpenFullPage() {
    return Boolean(this.address) && Boolean(this.hostPort?.capabilities?.includes?.("record-open"));
  }

  static get observedAttributes() {
    return [...(super.observedAttributes ?? []), "record-id", "hidden", "open", "full"];
  }

  attributeChangedCallback(name, previous, next) {
    super.attributeChangedCallback?.(name, previous, next);
    if (previous === next || !this.isConnected) return; // Without a port there is nothing to read: the view stays loading and
    // the port, when it comes, reads the record (setHostPort). Read here,
    // a record-id the page printed failed at once with «port not
    // connected» while the element upgraded, before it asked for a port.

    if (name === "record-id" && this.hostPort) this.load("record-id-changed");
    if (name === "hidden" || name === "open" || name === "full") this.syncPanelOpen();
  } // Every tag the card draws, asked of the Loader once per connection
  // (§7.11, VF-16); the card draws again once they are defined, so a part
  // drawn before its definition upgrades in place.


  _askForDrawnTags() {
    const registry = globalThis.customElements;
    const loader = globalThis.SF?.Loader;
    if (typeof registry?.get !== "function" || typeof loader?.ensure !== "function") return;
    const missing = DRAWN_TAGS.filter(tag => !registry.get(tag));
    if (!missing.length) return;
    Promise.resolve(loader.ensure(missing, {
      timeout: 10000
    })).catch(() => null).then(() => {
      if (this.isConnected) this.requestComponentUpdate("parts-defined");
    });
  } // Every other tag the view has drawn -- a field's control, a host's
  // renderer, a part a template draws only sometimes -- asked for once it is
  // in the view and not defined (C289 (10), VF-16): a page that defines
  // nothing of its own still gets the whole card.


  _askForUndefinedTags() {
    const registry = globalThis.customElements;
    const loader = globalThis.SF?.Loader;
    if (typeof registry?.get !== "function" || typeof loader?.ensure !== "function") return;
    this._askedTags ??= new Set(DRAWN_TAGS);
    const missing = new Set();

    for (const node of this.querySelectorAll(":not(:defined)")) {
      const tag = node.localName;
      if (tag.startsWith("sf-") && !this._askedTags.has(tag) && !registry.get(tag)) missing.add(tag);
    }

    if (!missing.size) return;

    for (const tag of missing) this._askedTags.add(tag);

    Promise.resolve(loader.ensure([...missing], {
      timeout: 10000
    })).catch(() => null);
  } // The arranging mode's own parts (C311): the view picker and the lists
  // that drag. They are lazy relations, asked for only once the mode drew
  // them, so the picker came about a hundred milliseconds after the mode and
  // the hint beside it moved once it did (view round 5, DEV's carried item
  // «arranging a card shifts the layout once»). A card that may arrange, or
  // that shows the select-only chooser, asks for them as soon as it knows,
  // and the mode's first frame is its whole picture.


  _askForArrangingTags() {
    if (this._arrangingAsked || !(this.canConfigureView || this.viewProfiles.length > 1)) return;
    this._arrangingAsked = true;
    const registry = globalThis.customElements;
    const loader = globalThis.SF?.Loader;
    if (typeof registry?.get !== "function" || typeof loader?.ensure !== "function") return;
    const missing = ARRANGING_TAGS.filter(tag => !registry.get(tag));
    if (missing.length) Promise.resolve(loader.ensure(missing, {
      timeout: 10000
    })).catch(() => null);
  }

  onConnected() {
    super.onConnected?.();

    this._notePanelWidth();

    this._askForDrawnTags(); // Born loading. The first render comes before the host is asked, and
    // drawn with no state it was the empty body -- one frame of «nothing
    // here» before the skeleton, the flash the table had (rules of the
    // road, rule 2: loading is drawn as the skeleton, from the first frame).


    if (!this.hasAttribute("data-state") && !this.record) {
      this.setAttribute("data-state", "loading");
      this.setAttribute("aria-busy", "true");
    } // Escape is the layer stack's: it hands the press to the top layer only,
    // after it has passed through the page, so a list, a menu or a modal
    // opened over this panel takes it first, and a control inside that
    // handled it (preventDefault) keeps it. The drawer closes on it -- and a
    // panel never closes itself, so every close the drawer starts (Escape,
    // a press on the dimmed page, a script calling close()) is refused here
    // and asked of the host as this component's own cancelable close, with
    // the count of what is unsaved. Only this panel's own drawer: a drawer
    // opened inside the panel is portalled with it and never bubbles here.


    this._onDrawerClose = event => {
      if (event.target !== this._ownDrawer()) return;
      event.preventDefault();
      this.closePanel(DRAWER_CLOSE_REASONS[event.detail?.reason] ?? "api");
    };

    this.addEventListener("sf-drawer-close", this._onDrawerClose); // The first focus of the panel (Pro joint pass PRO-ADM-16): the drawer
    // gives it to the first field of its content, else its first control
    // -- for a record shown to read, the favourite star in the head, whose
    // tooltip then stood over the title. A record to read starts on its
    // title (the heading takes the focus without becoming a Tab stop); a
    // record with a field keeps the field the drawer chose (C159 (9)). The
    // panel is drawn open and its record comes later, so sf-drawer-opened
    // is not sent and the drawer's pick lands frames after the open: the
    // panel watches the focus from its open until the title is drawn, the
    // person acts or two seconds pass.

    this._onPanelFocusIn = () => this._focusTitleFirst(); // Any act ends the watch, outside the panel too: a docked record sits
    // beside the list, and a button pressed there keeps its focus.


    this._onPanelAct = () => this._endTitleFocus();

    this._offAfterRender = this.onAfterRender?.(() => {
      const open = this.panelOpen;
      if (open && !this._panelWasOpen) this._startTitleFocus();
      if (!open) this._endTitleFocus();
      this._panelWasOpen = open;
      if (this._titleFocusUntil) requestAnimationFrame(() => this._focusTitleFirst());
    }); // Every render, not once (onAfterRender runs a callback once unless
    // told otherwise): the errors to focus after a refused Save, the tags
    // to ask the Loader for, the back line of a related record.

    this._offEveryRender = this.onAfterRender?.(() => {
      if (this._focusErrorsAfterRender) {
        this._focusErrorsAfterRender = false;
        requestAnimationFrame(() => this._focusErrors());
      } // A long field's value pressed: its group opens with the focus on
      // it (VP-21); sf-form gives it once its controls are drawn.


      if (this._focusFieldAfterRender && this.editing) {
        const key = this._focusFieldAfterRender;
        this._focusFieldAfterRender = null; // sf-form may draw before or after this hook, and its control is
        // defined lazily: wait (60 frames at most) until the control has
        // something to focus.

        const formed = Boolean(this.formEdit);
        const FOCUSABLE = "input:not([type=hidden]), textarea, select, button, [tabindex]:not([tabindex='-1'])";
        let frames = 0;

        const give = () => {
          const form = formed ? this._formOf(this.editing?.group) : null;
          const control = form?.controlOf?.(key);
          const ready = !formed || Boolean(control && (!control.localName.includes("-") || customElements.get(control.localName)) && (control.focusDelegate?.() || control.querySelector?.(FOCUSABLE)));
          if (!ready && frames++ < 60) return requestAnimationFrame(give);
          if (form?.focusField) form.focusField(key);else this.focusField(key);
        };

        requestAnimationFrame(give);
      }

      if (this._focusAfterStep && this.record && this.getAttribute("data-state") !== "loading") {
        this._focusAfterStep = false;
        requestAnimationFrame(() => {
          const root = this.panel ? this.panelContent?.() : this;
          const active = document.activeElement;
          if (root && active && root.contains(active) && active !== document.body) return;
          root?.querySelector?.(".sf-property-view-title")?.focus?.({
            preventScroll: true
          });
        });
      } // The full screen's history column reads its first page itself.


      if (this.historySide && (!this.historyFeed || this.historyFeed.record !== this.recordId) && this.record && !this._sideAsked) {
        this._sideAsked = true;
        Promise.resolve().then(() => this.loadHistory()).finally(() => {
          this._sideAsked = false;
        });
      }

      this._askForUndefinedTags();

      this._askForArrangingTags();

      if (this.sectionsLayout === "column") requestAnimationFrame(() => this._checkSectionColumn());
      if (this.sectionsLayout === "rail") requestAnimationFrame(() => this._checkRail()); // The panel's level for a related record (C289 (6)): whether this
      // panel's drawer is drawn inside another one is known once it is open.

      const nested = this._nestedLabel();

      if (nested !== this._nestedUnderLabel) {
        this._nestedUnderLabel = nested;
        this.requestComponentUpdate("nested");
      }
    }, {
      once: false
    }); // The drop is sf-sortable's to report and the component's to apply or
    // refuse -- that is the seam the mechanism already publishes, so no drag
    // is implemented here. The lists name themselves `field:<group>` and
    // `group:<section>`, which is what `to` carries.

    this._onSortableIntent = event => {
      if (!this.configuring) return;
      const detail = event.detail ?? {};
      const [kind, container] = String(detail.to ?? "").split(":");
      if (!container) return;
      if (kind === "section") this.moveSection(detail.item, detail.index);else if (kind === "field") this.moveField(detail.item, container, detail.index);else if (kind === "group") this.moveGroup(detail.item, container, detail.index);else if (kind === "unplaced") this.moveFieldToUnplaced(detail.item, detail.index);
    };

    this.addEventListener("sf-sortable-intent", this._onSortableIntent); // A panel is portalled out of this element, so an intent raised inside one
    // never bubbles to it. The document listener catches those, and checks the
    // list belongs to this record before acting -- two stacked panels are two
    // components, and the wrong one applying the move would rearrange a view
    // nobody was looking at.

    this._onDocumentSortableIntent = event => {
      if (!this.panel || !this.configuring) return;
      const panel = event.target?.closest?.(".sf-property-view-panel");
      if (!panel || panel.getAttribute("data-record-id") !== String(this.recordId)) return;

      this._onSortableIntent(event);
    };

    document.addEventListener("sf-sortable-intent", this._onDocumentSortableIntent); // The not-placed bin is an accordion, closed by default, and a drop
    // target nobody can see is a drop target nobody uses. So a drag opens
    // it -- by pressing its trigger, the way a person would, because the
    // accordion owns whether it is open and a second controller would
    // fight it. It is pressed back when the drag ends, and only if this is
    // what opened it: a person who opened it themselves keeps it open
    // (owner, 2026-10-09).

    this._onSortableState = event => {
      if (!this.configuring) return;
      const state = event.detail?.state; // The panel is portalled out of this element, so it is reached the
      // way the sortable intents are reached: by the record it carries.
      // `this.panel` is not an element and querying it found nothing,
      // which is why the bin stayed shut through a whole drag.

      const panel = globalThis.document?.querySelector?.(`.sf-property-view-panel[data-record-id="${this.recordId}"]`);
      const trigger = panel?.querySelector?.('[data-action="toggle-unplaced"]');
      if (!trigger) return;
      const open = trigger.getAttribute("aria-expanded") === "true";

      if (state === "picked") {
        this._openedForDrag = !open;
        if (!open) trigger.click();
        return;
      }

      if (state !== "dropped" && state !== "cancelled") return;
      if (this._openedForDrag && trigger.getAttribute("aria-expanded") === "true") trigger.click();
      this._openedForDrag = false;
    };

    document.addEventListener("sf-sortable-state", this._onSortableState);
    this.wideMedia = typeof globalThis.matchMedia === "function" ? globalThis.matchMedia(WIDE_MEDIA_QUERY) : null;
    this.wide = this.wideMedia ? this.wideMedia.matches : true;

    this._onWideChange = event => {
      this.wide = event.matches; // Leaving the phone arrangement leaves its navigation behind: a section
      // screen is a phone idea, and keeping the state would show a desktop a
      // single section with a back arrow and no way to see the others.

      if (this.wide) this.phoneSection = null;
      this.requestComponentUpdate("viewport");
    };

    this.wideMedia?.addEventListener?.("change", this._onWideChange);
    this.sideMedia = typeof globalThis.matchMedia === "function" ? globalThis.matchMedia(SIDE_MEDIA_QUERY) : null;
    this.sideWide = Boolean(this.sideMedia?.matches);

    this._onSideChange = event => {
      this.sideWide = event.matches;
      this.requestComponentUpdate("viewport");
    };

    this.sideMedia?.addEventListener?.("change", this._onSideChange);

    this._onColumnResizeEvent = () => this._onColumnResize();

    globalThis.addEventListener?.("resize", this._onColumnResizeEvent, {
      passive: true
    }); // Alt+↓ / Alt+↑: the next or the previous record of the view (C305 (4)).
    // The panel is portalled out of the element, so the keys are read on
    // the document for a press inside this card's panel.

    this._onStepKey = event => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const root = this.panel ? this.panelContent() : this; // A press on the panel itself counts: the drawer gives its panel
      // the focus when the card covers the list (phone), and the keys
      // went nowhere from there (VR2-3).

      const path = event.composedPath?.() ?? [];
      const own = this.panel ? this._ownDrawerRoot() : null;
      if (!root || !(path.includes(root) || own && path.includes(own)) || this.panel && !this.isTopPanel) return;
      event.preventDefault(); // The next record redraws the panel: the focus comes back to its
      // title so the keys go on stepping.

      this._focusAfterStep = true;
      this.step(event.key === "ArrowDown" ? "next" : "previous");
    };

    document.addEventListener("keydown", this._onStepKey); // A view placed before it is told its record (an assembly binds
    // record-id after it places the part) asks the host nothing yet: the
    // record-id it is given reads it (attributeChangedCallback).

    if (this.hostPort && (this.recordId || this.mode === "create")) this.load("connected");else if (!this.hostPort) this._requestHostPort();
  } // The shared convention for a component that takes a host port: ask for one
  // rather than wait to be given it, so a consumer composing this inside
  // something else does not have to find the element and call a method on it.
  // Once per connection and only while there is no port; `setHostPort` answers,
  // at once or later. The same event every such component raises, so a host
  // answers them all the same way.


  _requestHostPort() {
    if (this.hostPort || this._portRequested) return false;
    this._portRequested = true;
    this.dispatchEvent(new CustomEvent("sf-host-port-request", {
      bubbles: true,
      composed: true,
      detail: {
        component: this,
        context: {
          owner: "property-view",
          record: this.recordId || null,
          group: null
        }
      }
    }));
    return true;
  }

  onDisconnected() {
    this._standardMenu?.close?.({
      restoreFocus: false
    });
    this._standardMenu?.remove();
    this._standardMenu = null; // Once per connection, so an element moved in the DOM asks again.

    this._portRequested = false;
    if (this._onDrawerClose) this.removeEventListener("sf-drawer-close", this._onDrawerClose);
    this._onDrawerClose = null;

    this._endTitleFocus();

    this._offAfterRender?.();
    this._offAfterRender = null;
    this._offEveryRender?.();
    this._offEveryRender = null;
    this._panelWasOpen = false; // The settings surface listens on the document, so a panel that goes away
    // while it is open takes that listener with it.

    this.configuring = false;

    this._bindSectionDropTarget();

    if (this._onSortableIntent) this.removeEventListener("sf-sortable-intent", this._onSortableIntent);
    this._onSortableIntent = null; // A document listener outliving its component would go on applying drops
    // and writing a layer for a record nobody has open.

    if (this._onDocumentSortableIntent) {
      document.removeEventListener("sf-sortable-intent", this._onDocumentSortableIntent);
    }

    if (this._onSortableState) {
      document.removeEventListener("sf-sortable-state", this._onSortableState);
    }

    this._onDocumentSortableIntent = null;
    if (this._onWideChange) this.wideMedia?.removeEventListener?.("change", this._onWideChange);
    if (this._onSideChange) this.sideMedia?.removeEventListener?.("change", this._onSideChange);
    if (this._onColumnResizeEvent) globalThis.removeEventListener?.("resize", this._onColumnResizeEvent);
    this._onSideChange = null;
    this.sideMedia = null;
    if (this._onStepKey) document.removeEventListener("keydown", this._onStepKey);
    this._onStepKey = null;
    clearTimeout(this._savedTimer);
    this._onWideChange = null;
    this.wideMedia = null;
    super.onDisconnected?.();
  } // Where this panel's content actually lives. The drawer moves it out of the
  // element, so anything looking for the panel -- a key handler, a probe, a
  // stack deciding which window is on top -- has to ask rather than assume.


  panelContent() {
    const drawer = this.querySelector("sf-drawer") ?? this._panelDrawer ?? null;
    const inside = drawer?.querySelector?.(".sf-property-view-panel");
    if (inside) return inside;
    const instance = this.getAttribute("record-id") || "";
    const candidates = [...document.querySelectorAll(".sf-property-view-panel")];
    return candidates.find(node => node.dataset.recordId === instance) ?? null;
  } // A host adapter exposes raise(intent, payload, {signal}); no transport is
  // implied, exactly as for sf-view.


  setHostPort(host) {
    if (!host || typeof host.raise !== "function" || !SUPPORTED_PORT_VERSIONS.includes(host.version)) {
      throw new TypeError(`sf-view-properties requires a declared property-view host port: ${SUPPORTED_PORT_VERSIONS.join(", ")}`);
    }

    this.hostPort = host;
    if (this.isConnected && (this.recordId || this.mode === "create")) this.load("host-connected");
    return this;
  }

  visible(entries, {
    conditions = true
  } = {}) {
    const values = conditions ? this.fieldValues() : null;
    return (Array.isArray(entries) ? entries : []).filter(entry => entry && entry.hidden !== true).filter(entry => this.showRare || entry.rare !== true) // A field its condition hides is not drawn (port 1.14.0). Not while
    // the view is arranged -- the template lists every entry then -- and
    // not by the view: `hidden` is the arrangement's, `when` the values'.
    .filter(entry => !values || !entry.when || (0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldConditions)(entry, values).visible);
  } // Every field's value as it stands on screen: what the record holds, or what
  // the person changed it to and has not saved. The conditions read these, so
  // a field appears the moment the value it waits for is chosen, before any
  // save -- and a condition over a field in another group, closed, reads what
  // that field holds.


  fieldValues() {
    const values = new Map();

    const take = field => {
      if (!field || field.key === undefined || field.key === null) return;
      const key = String(field.key);
      values.set(key, this.changed.has(key) ? this.changed.get(key) : field.value);
    };

    for (const section of this.sections ?? []) {
      for (const group of section?.groups ?? []) (group?.fields ?? []).forEach(take);
    }

    this.unplaced.forEach(take);
    return values;
  } // A field as its conditions make it: required as `when.required` says, and
  // drawn disabled -- as `readonly` is -- while `when.enabled` does not hold.
  // The field itself is the host's and is not written to.


  conditionedField(field, values = this.fieldValues()) {
    if (!field?.when) return field;
    const decided = (0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldConditions)(field, values);
    return { ...field,
      required: decided.required,
      readonly: field.readonly === true || !decided.enabled
    };
  } // The keys of the fields their conditions hide now.


  _hiddenByCondition() {
    const values = this.fieldValues();
    const hidden = new Set();

    const check = field => {
      if (field?.when && !(0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldConditions)(field, values).visible) hidden.add(String(field.key));
    };

    for (const section of this.sections ?? []) {
      for (const group of section?.groups ?? []) (group?.fields ?? []).forEach(check);
    }

    this.unplaced.forEach(check);
    return hidden;
  } // What a save carries: the changed fields, less every field its condition
  // hides (port 1.14.0). Such a field is left out, not emptied: it keeps what
  // it holds -- its own value or an inherited one -- because hidden by a
  // condition is not the same as cleared, and a contract type switched back
  // and forth must not lose the date it had. What the person typed into it
  // stays among the changes, unsent, and is sent if the field shows again.


  _savedValues() {
    const hidden = this._hiddenByCondition();

    return Object.fromEntries([...this.changed].filter(([key]) => !hidden.has(key)));
  } // The host as the renderer set reads a field shown: its formatFieldValue
  // first, and for a date it did not format, the date in the page's language
  // (format-date), as sf-view-table's cells read it. A date stood in the card
  // as stored -- «2026-11-02» -- unless the host formatted it (2026-11-05).


  get viewHost() {
    const host = this.hostPort ?? null;
    if (this._viewHost?.host === host) return this._viewHost.view; // Everything else the host offers the renderer set (its words, say) is
    // reached through it unchanged.

    const view = Object.create(host && typeof host === "object" ? host : null);
    Object.assign(view, {
      formatFieldValue: (field, value) => {
        const own = host?.formatFieldValue?.(field, value);
        return typeof own === "string" ? own : undefined;
      }
    });
    this._viewHost = {
      host,
      view
    };
    return view;
  } // ─── C305: quick edit, a field's group, the history, the next record ─────
  // Where a field stands: its section, its group and its descriptor.


  fieldAt(key) {
    const wanted = String(key ?? "");

    for (const section of this.sections ?? []) {
      for (const group of section.groups ?? []) {
        const field = (group.fields ?? []).find(one => String(one.key ?? "") === wanted);
        if (field) return {
          section: String(section.key ?? ""),
          group: String(group.key ?? ""),
          field
        };
      }
    }

    return null;
  } // A short field opened in its window (C305 (1), C296): the entry is held
  // as a group's is, nothing is written until Save.


  startQuick(section, group, key) {
    if (!this.quickEdit || this.editing) return false;
    this.quick = {
      section: String(section),
      group: String(group),
      key: String(key)
    };
    this.changed.clear();

    this._clearInputs();

    this.errors.clear();
    this.conflict = null;
    this.confirmation = null;
    this.requestComponentUpdate("quick");
    return true;
  }

  endQuick(key = null) {
    if (!this.quick || key !== null && this.quick.key !== key) return false;
    this.quick = null;
    this.changed.clear();

    this._clearInputs();

    this.errors.clear();
    this.conflict = null;
    this.confirmation = null;
    this.requestComponentUpdate("quick");
    return true;
  }

  _quickPopover(key) {
    const root = this.panel ? this.panelContent() : this;
    return root?.querySelector?.(`sf-popover[data-quick-pop="${CSS.escape(String(key))}"]`) ?? null;
  } // One value per save: group.save of the field's group with that value,
  // the same revision and the same confirmation as a group's save.


  async saveQuick({
    confirm = null
  } = {}) {
    const quick = this.quick;
    if (!quick) return null;

    if (!this.changed.has(quick.key) && !this.inputErrors.size) {
      this._quickPopover(quick.key)?.close?.();
      this.endQuick();
      return null;
    }

    return this.saveGroup({
      confirm
    });
  } // The saved fields are marked for a moment (--sf-view-properties-saved-background-color).


  markSaved(keys) {
    this.savedKeys = new Set([...keys].map(String));
    this.requestComponentUpdate("saved-mark");
    clearTimeout(this._savedTimer);
    this._savedTimer = setTimeout(() => {
      this.savedKeys = new Set();
      this.requestComponentUpdate("saved-mark");
    }, 1600);
  } // RC-6 editField(key): a short field opens its window, any other its
  // group with the focus on it (VP-19, VP-21).


  editField(key) {
    const at = this.fieldAt(key);
    if (!at || !this.mayEdit) return false;

    if (this.isQuickField(at.field) && this.quickEdit) {
      const pop = this._quickPopover(at.field.key);

      if (pop?.show) {
        pop.show();
        return true;
      }
    }

    if (this.selectedSection !== at.section) this.selectSection(at.section);
    this.editGroup(at.section, at.group, {
      focus: at.field.key
    });
    return true;
  } // sf-form draws a group's edit (C182) when it draws every field of it.


  formDraws(group) {
    const fields = this.visible(group?.fields, {
      conditions: false
    }); // sf-form where the page has it defined; else the card's own form, as before.

    if (!fields.length || !globalThis.customElements?.get?.("sf-form")) return false;
    return fields.every(field => {
      const type = String(field.propertyType || field.type || "");
      if (field.when || (0,_js_set_fields_js__WEBPACK_IMPORTED_MODULE_15__.drawsSetField)(field) || FORMLESS_TYPES.has(type)) return false;
      const modes = (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_16__.propertyModes)(type);
      return Boolean(modes?.edit || field.readonly === true && modes?.view);
    });
  } // The fields and the saved value an sf-form gets for one group's edit.


  _formEditOf(section, group) {
    const current = this.sections.find(entry => String(entry.key) === String(section));
    const found = this.visible(current?.groups).find(entry => String(entry.key) === String(group));
    if (!found || !this.formDraws(found)) return null;
    const fields = this.visible(found.fields, {
      conditions: false
    }).map(field => {
      const {
        value,
        width,
        ...rest
      } = field;
      return { ...rest,
        key: String(field.key ?? "")
      };
    });
    const value = Object.fromEntries(this.visible(found.fields, {
      conditions: false
    }).filter(field => field.value !== undefined && field.value !== null).map(field => [String(field.key ?? ""), field.value]));
    return {
      section: String(section),
      group: String(group),
      fields,
      value
    };
  } // sf-form's Save: what differs from the record is the save; the form waits
  // for the host's answer (the submit is cancelled) and takes its errors.


  submitForm(event) {
    event?.preventDefault?.();
    if (!this.formEdit || !this.editing) return null;
    const value = event?.detail?.value ?? {};

    for (const field of this.formEdit.fields) {
      const at = this.fieldAt(field.key);
      if (!at) continue;
      const next = value[field.key];
      const same = JSON.stringify(next ?? null) === JSON.stringify(at.field.value ?? null);
      if (same || next === undefined) this.changed.delete(field.key);else this.changed.set(field.key, next);
    }

    return this.saveGroup();
  }

  _formOf(groupKey) {
    const root = this.panel ? this.panelContent() : this;
    return root?.querySelector?.(`[data-group="${CSS.escape(String(groupKey))}"] sf-form`) ?? null;
  } // The way out of unsaved entries asks first (C159 (6)): a close, or a step
  // to the next record, waits for «Закрыть без сохранения».


  answerLeave(accepted) {
    const ask = this.leaveAsk;
    this.leaveAsk = null;
    if (!ask) return null;

    if (!accepted) {
      this.requestComponentUpdate("leave");
      return null;
    }

    this._dropEntries();

    if (ask.kind === "step") return this._emitStep(ask.direction);
    return this.closePanel(ask.reason, {
      asked: true
    });
  }

  _dropEntries() {
    this.editing = null;
    this.quick = null;
    this.editAll = false;
    this.formEdit = null;
    this.changed.clear();

    this._clearInputs();

    this.errors.clear();
    this.conflict = null;
    this.confirmation = null;
    this.requestComponentUpdate("editing");
  } // RC-5, RC-6 step(direction): the next or the previous record in the
  // order of the view the panel was opened from. The card never reads the
  // list: it asks (sf-view-properties-step {direction}) and the page opens the
  // neighbour in the same panel (sf-view recordBeside gives it).


  step(direction) {
    const dir = direction === "previous" || direction === -1 ? "previous" : "next";

    this._commitFocusedEntry();

    if (this.unsavedFields) {
      this.leaveAsk = {
        kind: "step",
        direction: dir
      };
      this.requestComponentUpdate("leave");
      return {
        outcome: "refused",
        reason: "unsaved"
      };
    }

    return this._emitStep(dir);
  } // The next record: a host that announces record-neighbours names it over
  // its current view (filters, search, sort; Larena: {listed, previous:
  // {record_id}, next: {record_id}}), and the card opens it in the same panel
  // unless the page takes the step (preventDefault). Without it the page
  // finds the neighbour itself (sf-view recordBeside) and sets record-id.


  async _emitStep(direction) {
    let next = null;

    if (this.hostPort?.capabilities?.includes?.("record-neighbours") && this.recordId) {
      const answer = await this._raise("record.neighbours", {
        record_id: this.recordId,
        collection: this.collection || null
      });

      if (answer?.answer === "applied") {
        const id = answer[direction]?.record_id;
        if (id === undefined || id === null || id === "") return {
          outcome: "refused",
          reason: "no-neighbour"
        };
        next = String(id);
      }
    }

    const allowed = this.sfEmit("step", {
      direction,
      record_id: this.recordId || null,
      ...(next ? {
        next_record_id: next
      } : {})
    }, {
      cancelable: true
    });
    if (!allowed) return {
      outcome: "refused",
      reason: "prevented"
    };
    if (next) this.setAttribute("record-id", next);
    return {
      outcome: "applied"
    };
  } // RC-3, RC-6 openHistory(): the history as a level of the same panel, the
  // C289 head over it («← <запись>», the title, «⋯», the close).


  openHistory() {
    if (!this.historyOffered) return {
      outcome: "refused",
      reason: "unavailable"
    };
    this.historyOpen = true;
    this.phoneSection = null;
    this.sfEmit("history", {
      record_id: this.recordId || null
    });
    this.requestComponentUpdate("history");
    if (!this.historyFeed || this.historyFeed.record !== this.recordId) this.loadHistory();
    return {
      outcome: "applied"
    };
  }

  closeHistory() {
    if (!this.historyOpen) return false;
    this.historyOpen = false;
    this.requestComponentUpdate("history");
    return true;
  } // «Только изменения полей» / «Все события» (the history's «⋯»).


  setHistoryKinds(kinds) {
    const next = Array.isArray(kinds) && kinds.length ? kinds.map(String) : null;
    if (JSON.stringify(next) === JSON.stringify(this.historyFeed?.kinds ?? null) && this.historyFeed) return false;
    this.historyFeed = {
      record: this.recordId,
      kinds: next,
      events: [],
      items: [],
      cursor: null,
      hasMore: false,
      loading: false,
      failed: false
    };
    this.loadHistory();
    return true;
  } // One page of record.history; «Показать ещё» asks for the next one with
  // the cursor the host gave.


  async loadHistory({
    more = false
  } = {}) {
    if (!this.historyOffered) return null;
    const kinds = this.historyFeed?.kinds ?? null;

    if (!more || !this.historyFeed || this.historyFeed.record !== this.recordId) {
      this.historyFeed = {
        record: this.recordId,
        kinds,
        events: [],
        items: [],
        cursor: null,
        hasMore: false,
        loading: true,
        failed: false
      };
    } else {
      this.historyFeed = { ...this.historyFeed,
        loading: true
      };
    }

    this.requestComponentUpdate("history");
    const epoch = ++this.historyEpoch;
    const last = this.historyFeed.events.at(-1);
    const answer = await this._raise("record.history", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      cursor: more ? this.historyFeed.cursor ?? (last ? String(last.id) : null) : null,
      kinds,
      limit: HISTORY_PAGE
    }, {
      stale: () => epoch !== this.historyEpoch
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      this.historyFeed = { ...this.historyFeed,
        loading: false,
        failed: true,
        hasMore: false
      }; // A refused history is no state of the record: the record stays ready.

      if (this.getAttribute("data-state") === "error" && this.record) this._setState("ready");
      this.requestComponentUpdate("history");
      return answer;
    }

    const events = [...this.historyFeed.events, ...(Array.isArray(answer.events) ? answer.events : [])];
    this.historyFeed = { ...this.historyFeed,
      events,
      loading: false,
      failed: false,
      hasMore: answer.has_more === true,
      cursor: answer.cursor ?? null,
      items: (0,_js_history_js__WEBPACK_IMPORTED_MODULE_17__.timelineItems)(events, {
        words: this.historyWords,
        fieldOf: key => this.fieldAt(key)?.field ?? null,
        host: this.viewHost
      })
    };
    this.requestComponentUpdate("history");
    return answer;
  }

  get historyWords() {
    const word = key => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, key, this);

    return {
      historyCreate: word("historyCreateText"),
      historyDelete: word("historyDeleteText"),
      historyRestore: word("historyRestoreText"),
      historyPublish: word("historyPublishText"),
      historyChangedOne: word("historyChangedOneText"),
      historyChangedMany: word("historyChangedManyText"),
      historySealed: word("historySealedText")
    };
  }

  templateContext() {
    const props = this.getPropsContext();
    return this.createTemplateContext({ ...props,
      component: this,
      hostPort: this.hostPort,
      viewHost: this.viewHost,
      size: this.size,
      controlSize: this.controlSize,
      mode: this.mode,
      mayEdit: this.mayEdit,
      openAll: this.openAll,
      createText: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "createText", this),
      emptyText: this.emptyText,
      emptyRecordText: this.emptyRecordText,
      isEmptyRecord: this.isEmptyRecord,
      // The first load draws the fields it waits for; a failed one says
      // why in sf-empty-state.
      loading: this.getAttribute("data-state") === "loading" && !this.record,
      panel: this.panel,
      panelOpen: this.panelOpen,
      // The set's own strip ground in a panel, until the pair's sf-tabs
      // paints it (component.tabs 1.5.4).
      ownStrip: !frameworkStripGround(),
      // The record's own name heads a panel the page gave no label: the
      // host answers it with the record (port 1.14.0 record.label); the
      // reference host and most pages send record.title, read as well.
      recordLabel: this._recordName(this.record),
      loadFailure: this.record ? null : this.loadFailure ?? null,
      editText: this.editText,
      saveText: this.saveText,
      cancelText: this.cancelText,
      deleteText: this.deleteText,
      recordActions: this.recordActions,
      changedText: this.changedText,
      errorsText: this.errorsText,
      sectionsLabel: this.sectionsLabel,
      sectionsAs: this.sectionsAs,
      sections: this.sections,
      selectedSection: this.selectedSection,
      editing: this.editing,
      changed: this.changed,
      errors: this.inputErrors.size ? new Map([...this.errors, ...this.inputErrors]) : this.errors,
      // An entry that is not a value yet holds both saves (port 1.16.0):
      // Save is drawn disabled while there is one, with the count of what
      // is wrong beside it and each message under its field.
      controlErrors: this.controlErrors,
      canPickRecords: this.canPickRecords,
      canUploadFiles: this.canUploadFiles,
      // The base captures the host's slot content in connectedCallback,
      // before the first render, and returns live nodes by reference -- so a
      // consumer's listeners and open state survive every render. A second
      // mechanism was written here and deleted: it collected in onConnected,
      // which runs after lit has rendered into the element and cleared the
      // host's children, so it collected nothing at all.
      hostSlot: name => this.getSlotContent(name),
      hasHostSlot: name => this.hasSlotContent(name),
      address: this.address,
      drawerWidth: this.drawerWidth,
      // C393: the star is the Framework's toggle where sf-button-icon has the look.
      starLook: this.starLook(),
      sectionsWidth: SECTIONS_WIDTH,
      panelWidthStyle: this.panelWidthStyle,
      conflict: this.conflict,
      confirmation: this.confirmation,
      confirmSaveText: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "confirmSaveText", this),
      keepEditingText: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "keepEditingText", this),
      message: this.message,
      visible: entries => this.visible(entries),
      conditionedField: field => this.conditionedField(field),
      fieldDisabled: field => this.fieldDisabled(field),
      canConfigureView: this.canConfigureView,
      configuring: this.configuring,
      unplaced: this.unplaced,
      viewTarget: this.viewTarget,
      editableLayers: this.editableLayers,
      viewProfiles: this.viewProfiles,
      viewProfile: this.viewProfile,
      canDeleteViewProfile: id => this.canDeleteViewProfile(id),
      layerDenied: kind => this.layerDenied(kind),
      canChangeVisibility: entry => this.canChangeVisibility(entry),
      entryError: (kind, key) => this.entryError(kind, key),
      configureText: this.configureText,
      doneConfiguringText: this.doneConfiguringText,
      layerDirty: Boolean(this.layerDirty),
      // «Мой вид» (save model C1, SB-C12): the person's own layout is
      // drawn over the shared one; «⋯ → Вернуть общий вид» takes it away.
      ownView: !this.configuring && this.hasPersonalEdits && this.editableLayers.includes("personal") && !this.viewRequired,
      resetViewText: this.resetViewText,
      resetViewAskText: this.resetViewAskText,
      cancelConfiguringText: this.cancelConfiguringText,
      resetAsked: this.resetAsked,
      personalLayerText: this.personalLayerText,
      viewProfileLabel: this.viewProfileLabel,
      addViewText: this.addViewText,
      newViewText: this.newViewText,
      deleteViewText: this.deleteViewText,
      lastSharedViewText: this.lastSharedViewText,
      sharedLayerText: this.sharedLayerText,
      widthText: this.widthText,
      fieldLabelText: this.fieldLabelText,
      sectionIcons: this.sectionIcons,
      sectionIconChoices: this.sectionIconChoices,
      sectionIconText: this.sectionIconText,
      variantText: this.variantText,
      hintText: this.hintText,
      hiddenText: this.hiddenText,
      configureHintText: this.wide ? this.configureHintText : this.configureHintNarrowText,
      fieldSettingsText: this.fieldSettingsText,
      shownText: this.shownText,
      showRareText: this.showRareText,
      hideRareText: this.hideRareText,
      rareText: this.rareText,
      unplacedTitle: this.unplacedTitle,
      moveUpText: this.moveUpText,
      moveDownText: this.moveDownText,
      addFieldText: this.addFieldText,
      canOpenFullPage: this.canOpenFullPage,
      groupAt: groupKey => this.groupAt(groupKey),
      groupCount: this.groupCount,
      fieldChoices: groupKey => this.fieldChoices(groupKey),
      addSearch: this.addSearch,
      inThisGroupText: this.inThisGroupText,
      renameText: this.renameText,
      saveNameText: this.saveNameText,
      cancelNameText: this.cancelNameText,
      removeFieldText: this.removeFieldText,
      removeGroupText: this.removeGroupText,
      removeSectionText: this.removeSectionText,
      addGroupText: this.addGroupText,
      addSectionText: this.addSectionText,
      newGroupTitle: this.newGroupTitle,
      newSectionTitle: this.newSectionTitle,
      renaming: this.renaming,
      noMatchText: this.noMatchText,
      unplacedHintText: this.unplacedHintText,
      panelMenuItems: this.panelMenuItems,
      collectionLabel: this.collectionLabel,
      collectionIcon: this.collectionIcon,
      favourite: this.favourite,
      favouriteLabel: this.favouriteLabel,
      menuLabel: this.menuLabel,
      addressUrl: this.addressUrl ?? this.address,
      copyFeedbackMs: COPY_FEEDBACK_MS,
      linkCopiedLabel: this.linkCopiedLabel,
      // The three the head draws beside those, which were not here. Every
      // label the panel shows is resolved by a getter that reads the
      // page's language; a label left out of this context falls through
      // to the declared default instead, which is English. So on a
      // Russian page the panel's head read «В избранное», «Ещё» and
      // «Ссылка скопирована» beside «Close», «Copy link» and «Open as a
      // page» -- one header in two languages. `linkCopiedLabel` being
      // here while `copyLinkLabel` was not is the shape of a line added
      // one at a time (owner, 2026-10-10, on the admin polygon).
      closeLabel: this.closeLabel,
      copyLinkLabel: this.copyLinkLabel,
      openFullLabel: this.openFullLabel,
      inheritedText: this.inheritedText,
      wide: this.wide,
      phoneSection: this.phoneSection,
      phoneSectionLabel: this.phoneSectionLabel,
      backLabel: this.backLabel,
      drawerStep: this.drawerStep,
      sectionsLayout: this.sectionsLayout,
      nestedUnder: this._nestedUnderLabel || "",
      canDeleteRecord: this.canDeleteRecord,
      recordMenuItems: this.recordMenuItems,
      errorList: this.errorList,
      requiredErrorText: this.requiredErrorText,
      // C305
      quickEdit: this.quickEdit,
      quick: this.quick,
      isQuickField: field => this.isQuickField(field),
      savedKeys: this.savedKeys,
      editAll: this.editAll,
      leaveAsk: this.leaveAsk,
      formEdit: this.formEdit,
      historyOffered: this.historyOffered,
      historyOpen: this.historyOpen && !this.historySide,
      historySide: this.historySide,
      history: this.historyFeed,
      docked: this._dockBeside(),
      dockBreakpoint: DOCK_BREAKPOINT,
      // VP-26: sf-tabs vertical once it places its box by its own column;
      // until then sf-menu, and sf-tabs where sf-menu is not defined.
      sectionColumnTabs: typeof globalThis.customElements?.get?.("sf-tabs")?.prototype?.placeBox === "function" || !globalThis.customElements?.get?.("sf-menu"),
      // VR11-1: the column's tabs told not to fold, where sf-tabs can be.
      tabsHoldColumn: tabsHoldColumn(),
      word: key => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, key, this),
      // C311: levels, locks, the head, the tabs' and fields' menus.
      canWriteShared: this.canWriteShared,
      viewRequired: this.viewRequired,
      requiredEdits: Boolean(this.requiredEdits),
      hasPersonalEdits: this.hasPersonalEdits,
      isLocked: path => this.isLocked(path),
      lockedForMe: path => this.lockedForMe(path),
      headLine: this.headLine,
      fieldMenuEntries: key => this.configuring ? this.fieldMenuEntries(key) : []
    });
  }

  template() {
    return (0,_js_templates_default__WEBPACK_IMPORTED_MODULE_13__.renderPropertyViewTemplate)(this.templateContext());
  } // A printed skeleton (data-sf-first-paint="skeleton", skeleton.html) stays
  // until the record comes through the port (standard 1.3.8 §5.4): the first
  // render then draws the record over it in one frame. A panel draws in its
  // drawer, so it renders at once.


  sfAwaitingData() {
    if (this.getAttribute("data-sf-first-paint") !== "skeleton" || this.panel) return false;
    return !this.record && !this.loadFailure && this.getAttribute("data-state") !== "error";
  } // A view refusal in words (port 1.22.0, Larena backend c311-reply): the
  // host's message if it sends one, else the pack's words for its code;
  // a machine code is never shown to a person.


  viewRefusalText(answer, fallback = this.viewDeniedText) {
    if (answer?.message) return String(answer.message);
    const key = VIEW_REFUSALS[String(answer?.reason ?? answer?.code ?? "")];
    return key ? (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, key, this) : fallback;
  }

  _setState(state, message = "") {
    // Loading again while loading draws nothing new: the skeleton is already
    // on screen (one action, one render).
    const unchanged = state === "loading" && this.getAttribute("data-state") === "loading" && !this.record;
    this.setAttribute("data-state", state);
    this.setAttribute("aria-busy", state === "loading" ? "true" : "false");
    this.message = message;
    if (!unchanged) this.requestComponentUpdate("state");
    this.dispatchEvent(new CustomEvent("sf-view-properties-state", {
      bubbles: true,
      composed: true,
      detail: {
        state,
        message
      }
    }));
  } // Whether an answer still describes something on screen is the caller's
  // question, not this method's. One counter for every intent was wrong the
  // moment two reads could be in flight at once: opening a group asks for the
  // candidates of every reference field in it in the same tick, each ask bumped
  // the one counter, and only the last answer was kept -- the others were
  // dropped and their fields sat at «Загрузка записей» for ever. A consumer
  // found it with four reference fields in one group; the probe had one, and one
  // is a number at which concurrency does not exist.


  async _raise(intent, payload, {
    stale = () => false
  } = {}) {
    if (!this.hostPort) {
      this._setState("error", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "statePortNotConnected", this));

      return {
        answer: "unavailable",
        reason: "port-not-connected"
      };
    }

    try {
      const answer = await this.hostPort.raise(intent, copy(payload), {}); // A late answer is dropped rather than rendered: what it describes is
      // not what is on screen any more.

      if (!this.isConnected || stale()) return null;

      if (!answer || !["applied", "conflict", "refused", "unavailable"].includes(answer.answer)) {
        throw new TypeError("Host answer is not a declared port answer");
      } // A saved record tells the rest of the page what changed, on the
      // page host's outputs (simai.interface-fragment, effects).


      if (answer.answer === "applied" && Array.isArray(answer.effects) && answer.effects.length) {
        globalThis.SF?.Composition?.publishEffects?.(answer.effects, {
          origin: this
        });
      } // A save over a revision that moved (Larena: refused revision_moved,
      // with the current revision, nothing written) is a conflict: the
      // card says so, keeps what was typed and reads the record again.


      if (answer.answer === "refused" && answer.reason === "revision_moved") return { ...answer,
        answer: "conflict"
      };
      return answer;
    } catch (error) {
      if (!this.isConnected || stale()) return null;

      this._setState("error", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "stateLoadFailed", this));

      return {
        answer: "unavailable",
        reason: "host-threw",
        message: String(error?.message || error)
      };
    }
  } // Whether the host reads one group at a time (port 1.15.0 §4.9). Without
  // the capability record.load is asked once per revision and every group is
  // served from that one answer, as before 1.15.0. A create has no record to
  // read a group of.


  get readsByGroup() {
    return Boolean(this.hostPort?.capabilities?.includes("group-load")) && this.mode !== "create";
  }

  async load(reason = "requested") {
    // Another record in the same panel (C305 (4)): what was open for the
    // last one is not this one's.
    if (reason === "record-id-changed") {
      this._dropEntries();

      this.leaveAsk = null;
      this.historyFeed = null;
      this.historyOpen = false;
      this.phoneSection = null;
    }

    this._setState("loading", (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "stateLoading", this));

    this.loadFailure = null;
    const epoch = ++this.epoch;
    const creating = this.mode === "create";
    const byGroup = this.readsByGroup;

    if (byGroup) {
      this.groupEpoch += 1;
      this.groupReads = new Map();
      this.groupsReading = new Set();
    } // With group-load the first read is a group: group null answers the
    // group the panel opens on, with the whole arrangement and every other
    // group's field count, and names the group it carries.


    const answer = byGroup ? await this._raise("group.load", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      group: null,
      reason
    }, {
      stale: () => epoch !== this.epoch
    }) : await this._raise("record.load", {
      record_id: creating ? null : this.recordId || null,
      collection: this.collection || null,
      reason,
      // An empty object of the collection, laid out by its arrangement
      // (port 1.12.0).
      ...(creating ? {
        mode: "create"
      } : {})
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null; // A panel is placed before the host names its record: asked with no
    // record, the host answered «unavailable», and «Запись недоступна» stood
    // in the panel until the record's own answer came (owner, 2026-10-14).
    // Not having been told which record is not a failure: the panel waits,
    // loading, for its record.

    if (answer.answer !== "applied" && !creating && !this.recordId) return answer;

    if (answer.answer !== "applied") {
      // Said by the empty state, only once there is an answer: refused is
      // no access; anything else could not load, with «Повторить».
      this.loadFailure = {
        kind: answer.answer === "refused" ? "no-access" : "error",
        text: answer.message || ""
      };

      this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "stateUnavailable", this)); // The fact a screen reads a missing record from (vocabulary §4):
      // sf-property-view-failed {reason, message}.


      this.sfEmit("failed", {
        reason: String(answer.reason ?? ""),
        message: String(answer.message ?? "")
      });
      return answer;
    }

    this.record = byGroup ? { ...(answer.record ?? {}),
      revision: answer.revision ?? answer.record?.revision ?? null
    } : answer.record ?? null; // Copied, not held by reference. Configuring moves a field between groups
    // in this array before the host answers -- «applied immediately» is what
    // the request asks for -- and a component that did that to the object the
    // host handed it would be rearranging the host's own data. A host that
    // caches its answer would find its record silently rewritten by a drag it
    // had not accepted yet.

    this.sections = [];

    this._takeSections(this.record);

    this.view = answer.record?.view ?? null; // A target the person may no longer write cannot stay selected: the rights
    // travel with the answer, so they can change between two loads.

    const editable = this.editableLayers;
    if (!editable.includes(this.viewTarget)) this.viewTarget = editable[0] ?? "personal";
    if (!editable.length) this.configuring = false;
    this.layerDraft = this.configuring ? this._layerCopy(this.viewTarget) : null;
    this.entryErrors = new Map();
    const known = this.sections.some(section => String(section.key) === this.selectedSection); // The section the answered group is in, when the panel had none chosen.

    const answered = byGroup && answer.group !== undefined && answer.group !== null ? this.sections.find(section => (section.groups ?? []).some(group => String(group.key) === String(answer.group))) : null;

    if (!known) {
      this.selectedSection = answered ? String(answered.key) : this.sections.length ? String(this.sections[0].key) : null;
    }

    this._setState("ready");

    if (byGroup) this._readShownGroups("started");
    return answer;
  } // What an answer carries is the record from now on. Reading by group, a
  // group the answer did not read (fields empty, a field_count) keeps the
  // fields it was read with, and the revision it was read at says whether it
  // is read again when it is next shown.


  _takeSections(record) {
    if (!Array.isArray(record?.sections)) return;
    const incoming = copy(record.sections);

    if (!this.readsByGroup) {
      this.sections = incoming;
      return;
    }

    const revision = record.revision === undefined || record.revision === null ? "" : String(record.revision);
    const held = new Map(this.sections.flatMap(section => (section.groups ?? []).map(group => [String(group.key), group])));

    for (const section of incoming) {
      const groups = Array.isArray(section.groups) ? section.groups : [];
      groups.forEach((group, index) => {
        const key = String(group.key);

        if (!groupNotRead(group)) {
          this.groupReads.set(key, revision);
          return;
        }

        const mine = held.get(key);
        if (mine && this.groupReads.has(key)) groups[index] = { ...group,
          fields: mine.fields
        };
      });
    }

    this.sections = incoming;
  } // The groups on screen: every group of an open-all surface or of the view
  // being arranged, otherwise the groups of the section being read.


  _shownGroups() {
    const shown = this.openAll || this.configuring ? this.sections : this.sections.filter(section => String(section.key) === this.selectedSection);
    return shown.flatMap(section => (section.groups ?? []).map(group => ({
      section: String(section.key),
      group: String(group.key)
    })));
  } // A section that starts asks group.load for each of its groups not read at
  // the record's revision (§7.2.1, reason started). Each answer is merged into
  // the arrangement; a newer revision leaves the other groups to be read
  // again when next shown, and a group the record no longer holds
  // (unknown-group) reads the arrangement again.


  _readShownGroups(reason = "started", {
    force = false
  } = {}) {
    if (!this.readsByGroup || !this.record) return [];
    const current = this.revision;
    const reads = [];

    for (const {
      section,
      group
    } of this._shownGroups()) {
      if (this.groupsReading.has(group)) continue;
      if (this.groupsRefused.get(group) === current) continue;
      if (!force && this.groupReads.get(group) === current) continue;
      reads.push(this._readGroup(section, group, reason));
    }

    return reads;
  }

  async _readGroup(section, group, reason) {
    const epoch = this.groupEpoch;
    this.groupsReading.add(group);
    this.requestComponentUpdate("group-reading");
    const answer = await this._raise("group.load", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      section,
      group,
      reason
    }, {
      stale: () => epoch !== this.groupEpoch
    });
    if (epoch !== this.groupEpoch) return null;
    this.groupsReading.delete(group);
    if (!answer) return null;

    if (answer.answer === "refused" && answer.reason === "unknown-group") {
      const refusedAt = this.revision;
      if (this.groupsRefused.get(group) === refusedAt) return answer;
      this.groupsRefused.set(group, refusedAt);
      await this.load("requested");
      return answer;
    }

    if (answer.answer !== "applied") {
      this.requestComponentUpdate("group-reading");
      return answer;
    }

    const revision = answer.revision ?? answer.record?.revision ?? this.record?.revision ?? null;
    this.record = { ...this.record,
      ...(answer.record ?? {}),
      revision
    };

    this._takeSections(this.record);

    this.requestComponentUpdate("group-read");
    return answer;
  } // Is this group's read still on its way (port 1.15.0)? The template draws
  // the group as loading meanwhile.


  isGroupReading(key) {
    return this.groupsReading.has(String(key));
  } // A conflict carries the record's current revision: what the person typed
  // is kept, and what is shown is read again at that revision -- the groups
  // on screen by group.load, or the whole record once by record.load.


  async _rereadAfterConflict(answer) {
    if (this.readsByGroup) {
      if (answer?.revision !== undefined && answer.revision !== null && this.record) {
        this.record = { ...this.record,
          revision: answer.revision
        };
      }

      return Promise.all(this._readShownGroups("requested", {
        force: true
      }));
    }

    const epoch = this.epoch;
    const read = await this._raise("record.load", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      reason: "requested"
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!read || read.answer !== "applied" || !read.record) return read;
    this.record = read.record;

    this._takeSections(read.record);

    this.requestComponentUpdate("conflict-reread");
    return read;
  } // The two the file editor asks of a host, and the capability that decides
  // whether the editor exists at all. Without it a file field shows what it
  // already holds, read-only -- the same arrangement as the record picker.


  get canUploadFiles() {
    return Boolean(this.hostPort?.capabilities?.includes("field-upload"));
  }

  getFieldUploads(field) {
    return this.uploads.get(String(field.key ?? "")) ?? [];
  }

  async startFieldUpload(field, items) {
    const key = String(field.key ?? "");
    const chosen = Array.isArray(items) ? items : [];
    if (!chosen.length) return null; // Recorded before anything is sent, because the component is the only
    // thing that knows what the person chose: sf-file-upload fills its own
    // list and every render writes this one over it.

    this.uploads.set(key, [...this.getFieldUploads(field), ...chosen]);
    this.requestComponentUpdate("uploads");

    for (const item of chosen) {
      const answer = await this._raise("field.upload", {
        record_id: this.recordId || null,
        collection: this.collection || null,
        field: key,
        file: item.file ?? item
      }, {
        stale: () => !this.uploads.has(key)
      });
      if (!answer) return null;
      const current = this.getFieldUploads(field);

      if (answer.answer === "applied" && answer.file) {
        // A stored file is a value change like any other: it joins what
        // the person has changed and waits for the save button. Nothing
        // about the record is written here.
        const held = this.changed.has(key) ? this.changed.get(key) : field.value;
        const list = Array.isArray(held) ? held : held ? [held] : [];
        this.changed.set(key, [...list, answer.file]);
        this.uploads.set(key, current.filter(entry => entry !== item));
        this.errors.delete(key);
      } else {
        this.uploads.set(key, current.map(entry => entry === item ? { ...entry,
          state: "error",
          errorMessage: answer.message || answer.reason || ""
        } : entry));

        if (answer.answer === "refused" && answer.reason) {
          this.errors.set(key, String(answer.message || answer.reason));
        }
      }

      this.requestComponentUpdate("uploads");
    }

    return this;
  }

  retryFieldUpload(field, index) {
    const key = String(field.key ?? "");
    const current = this.getFieldUploads(field);
    const item = current[Number(index)];
    if (!item) return null;
    this.uploads.set(key, current.filter(entry => entry !== item));
    return this.startFieldUpload(field, [item]);
  } // A reference value was activated. The component asks and decides nothing:
  // following the href would be routing for the consumer, and opening a window
  // itself would be deciding whether a half-edited window may be covered.


  async openReference(field, value) {
    if (!value || typeof value !== "object") return null;
    const answer = await this._raise("record.open", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      field: String(field.key ?? ""),
      value
    }, {
      stale: () => !this.isConnected
    }); // Vocabulary §5 open; sf-property-view-open-record follows once (aliases.json).

    this.sfEmit("open", {
      field: String(field.key ?? ""),
      value,
      answer: answer?.answer ?? null
    });
    return answer;
  } // The drawer that carries this panel: a child of the element (the drawer
  // portals its content, not itself).


  _ownDrawerRoot() {
    const drawer = this._ownDrawer();

    return drawer?.getDrawerRoot?.() ?? drawer;
  }

  _startTitleFocus() {
    if (this._titleFocusUntil) return;
    this._titleFocusUntil = performance.now() + TITLE_FOCUS_WAIT_MS;
    document.addEventListener("focusin", this._onPanelFocusIn, true);
    document.addEventListener("pointerdown", this._onPanelAct, true);
    document.addEventListener("keydown", this._onPanelAct, true);
  }

  _endTitleFocus() {
    this._titleFocusUntil = 0;
    if (this._onPanelFocusIn) document.removeEventListener("focusin", this._onPanelFocusIn, true);

    if (this._onPanelAct) {
      document.removeEventListener("pointerdown", this._onPanelAct, true);
      document.removeEventListener("keydown", this._onPanelAct, true);
    }
  } // Gives the title the focus the drawer handed out on its own: the panel
  // itself (waiting for content) or its first control. A field it chose, a
  // focus the person moved, or a focus still outside the panel stays.


  _focusTitleFirst() {
    if (!this._titleFocusUntil) return;
    if (performance.now() > this._titleFocusUntil) return this._endTitleFocus();

    const drawer = this._ownDrawer();

    const root = this._ownDrawerRoot();

    const panel = root?.querySelector?.("[data-sf-drawer-panel]");
    const title = panel?.querySelector?.(".sf-property-view-panel .sf-property-view-title");
    const active = document.activeElement;
    if (!panel || !title || !active) return; // A docked column hands out no focus (sf-drawer: it is a part of the
    // page, not a window), so the focus stayed on the row that opened it
    // and the record was not reached from the keyboard (view round 5,
    // LV-9). The title takes it, as a window's does; a person typing in a
    // field outside keeps it. The ring is drawn for the keyboard only
    // (:focus-visible), and nothing with a tooltip is focused.

    if (!panel.contains(active)) {
      if (!drawer?.dockColumn || active.closest?.("input, textarea, select, [contenteditable], sf-input, sf-select, sf-textarea")) return;
      title.tabIndex = -1;
      title.focus({
        preventScroll: true
      });
      return;
    } // The title keeps the watch until the person acts or the wait ends: a
    // sheet on a phone hands its panel the focus a second time after its
    // slide-in, and that second pick took the focus off the title (LV-9).


    if (active === title) return;
    if (active.closest?.("input, textarea, select, [contenteditable], sf-input, sf-select, sf-textarea")) return this._endTitleFocus();
    if (active !== panel && active !== drawer?.firstFocusIn?.(panel)) return this._endTitleFocus();
    title.tabIndex = -1;
    title.focus({
      preventScroll: true
    });
  } // The record this panel was opened from, when its drawer is drawn inside
  // another panel at the same edge (sf-drawer's nesting, C157 (6)): that
  // panel's title, for the «← <Запись>» line over this one's.


  _recordName(record) {
    const name = record?.label || record?.title;
    return name ? String(name) : "";
  }

  _nestedLabel() {
    const below = this.panel ? this._ownDrawer()?.nestedUnder?.() : null;
    if (!below) return "";
    const owner = below.parentElement;

    if (owner && owner !== this && typeof owner.panelLabel === "string") {
      return owner.panelLabel || this._recordName(owner.record) || owner.recordId || this.backLabel;
    }

    return below.getAttribute("heading") || below.getAttribute("label") || this.backLabel;
  }

  _ownDrawer() {
    return [...this.children].find(child => child.localName === "sf-drawer") ?? null;
  } // Read from the layer stack, not kept: how many panels of this component
  // stand below this one, and whether no window (a modal or another panel)
  // stands above it. A list or a menu opened inside the panel leaves it on top.


  get stackDepth() {
    const drawer = this._ownDrawer();

    if (!drawer || !(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.hasLayer)(drawer)) return 0;
    const panels = (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.openLayers)("panel").filter(owner => owner?.parentElement?.localName === this.localName);
    return Math.max(0, panels.indexOf(drawer));
  }

  get isTopPanel() {
    const drawer = this._ownDrawer();

    return Boolean(drawer && (0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.hasLayer)(drawer) && !(0,_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.hasLayerAbove)(drawer, ["modal", "panel"]));
  } // What a panel's three controls do, and all three are the host's decisions
  // announced rather than carried out here. The component closes itself, says
  // what was copied, and says what should be opened; where a window goes, and
  // whether it may close over unsaved edits, belongs to whoever placed it.


  closePanel(reason = "close", {
    asked = false
  } = {}) {
    this._commitFocusedEntry();

    const unsaved = this.unsavedFields; // Unsaved entries are asked about first (C159 (6)); a delete and a
    // cancel of a create surface are the host's to decide.

    if (unsaved && !asked && reason !== "deleted" && !(this.openAll && !this.editAll)) {
      this.leaveAsk = {
        kind: "close",
        reason
      };
      this.requestComponentUpdate("leave");
      return {
        outcome: "refused",
        reason: "unsaved"
      };
    } // A cancelable request (vocabulary §5 close, standard 1.3.8 §19.3): the
    // page decides whether it closes; a listener may refuse it.


    const allowed = this.sfEmit("close", {
      reason,
      record_id: this.recordId || null,
      unsaved_fields: unsaved,
      asked: Boolean(asked)
    }, {
      cancelable: true
    });
    return allowed ? {
      outcome: "applied"
    } : {
      outcome: "refused",
      reason: "prevented"
    };
  } // What would be lost by closing: every changed field, and every entry that
  // is not a value yet -- a masked text not filled in is work the person did,
  // though there is nothing to save (Larena acceptance, 2026-10-22: Esc after
  // an entry closed without asking).


  get unsavedFields() {
    return new Set([...this.changed.keys(), ...this.inputErrors.keys()]).size;
  } // A field reports its value when it loses focus, so a time typed and left
  // focused is not counted until then. Closing takes the focus first, and the
  // field reports before the count is read.


  _commitFocusedEntry() {
    let active = document.activeElement;

    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;

    if (!active || typeof active.blur !== "function") return;
    const panel = this.panel ? this.panelContent() : null;
    if (this.contains(active) || panel?.contains(active)) active.blur();
  } // What a person pastes is a page they can open, so the host's address is
  // resolved against the page it is read on (owner, 2026-10-08). The event
  // still carries the host's own address, because that is what the host knows
  // the record by.


  get addressUrl() {
    const address = this.address;
    if (!address) return null;

    try {
      return new URL(String(address), globalThis.location?.href).href;
    } catch {
      return String(address);
    }
  } // Copying is the Framework's clipboard (core/js/clipboard.js, with its
  // fallback for a browser that refuses the clipboard); the «⋯» row that
  // asks for it says the result in the panel's status line, read out
  // politely, and the event carries it to the host.


  copyControl() {
    return null;
  }

  get addressCopied() {
    return this._addressCopied === true;
  }

  announceAddressCopy(copied) {
    const address = this.address;
    this.dispatchEvent(new CustomEvent("sf-view-properties-address-copy", {
      bubbles: true,
      composed: true,
      detail: {
        address,
        url: this.addressUrl ?? address,
        copied,
        record_id: this.recordId || null
      }
    }));
    return copied;
  }

  async copyAddress() {
    if (!this.address) return null;
    let copied = false;

    try {
      copied = Boolean(await (0,_core_js_clipboard_js__WEBPACK_IMPORTED_MODULE_11__.copyText)(this.addressUrl ?? String(this.address)));
    } catch {
      copied = false;
    }

    this._addressCopied = copied;

    if (copied) {
      this.message = this.linkCopiedLabel;
      this.requestComponentUpdate("address-copied");
      clearTimeout(this._copiedTimer);
      this._copiedTimer = setTimeout(() => {
        this._addressCopied = false;
        if (this.message === this.linkCopiedLabel) this.message = "";
        this.requestComponentUpdate("address-copied");
      }, COPY_FEEDBACK_MS);
    }

    this.announceAddressCopy(copied);
    return copied;
  }

  openFullPage() {
    const address = this.address;
    if (!address) return null; // An intent, not a navigation: the component does not know whether the
    // consumer routes by href, by a client router or by replacing a region.
    // Vocabulary §5 open-full {id}; the address and record_id stay for the
    // listeners that read them.

    this.sfEmit("open-full", {
      id: this.recordId || null,
      address,
      record_id: this.recordId || null
    });
    return this;
  } // The phone's two screens. Opening a section also selects it, so leaving the
  // phone arrangement lands on the section the person was last reading rather
  // than on the first one.


  openPhoneSection(key) {
    const name = String(key);
    if (!this.sections.some(section => String(section.key) === name)) return false;
    this.phoneSection = name;
    this.selectSection(name);
    this.requestComponentUpdate("phone-section");
    return true;
  }

  closePhoneSection() {
    if (this.phoneSection === null) return false;
    this.phoneSection = null;
    this.requestComponentUpdate("phone-section");
    return true;
  }

  get phoneSectionLabel() {
    const current = this.sections.find(section => String(section.key) === this.phoneSection);
    return current ? String(current.label ?? current.key) : "";
  } // S-A 3 (VL-86): on a phone a horizontal swipe over the fields turns to
  // the next or the previous section, as the tabs above do. Touch and pen
  // only; never from a control, a field or a box that scrolls sideways
  // (a wide block keeps its own scroll and hands nothing on at its edge);
  // the motion must be clearly horizontal (the vertical page scroll wins).


  sectionSwipeStart(event) {
    this._swipe = null;
    if (this.sectionsLayout !== "phone" || this.configuring || this.editing) return;
    if (!["touch", "pen"].includes(event.pointerType)) return;
    if ((this.sections?.length ?? 0) < 2) return;
    const target = event.target;
    if (target?.closest?.("input, textarea, select, button, a[href], [contenteditable], [role=slider], sf-input, sf-select, sf-input-textarea, [data-sf-sortable-handle]")) return;

    for (let node = target; node && node !== event.currentTarget; node = node.parentElement) {
      const style = globalThis.getComputedStyle?.(node);
      if (style && /(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth + 1) return;
    }

    this._swipe = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
      t: event.timeStamp
    }; // The phone panel follows a finger toward its edge to close (C157 (4))
    // and takes the pointer while it does, so the rest of the gesture is
    // read on the window. On the first section the drag toward the edge
    // still closes the panel (there is no section before it); on any other
    // the swipe is the section's, and the panel does not start its drag.

    const shown = this.sections.filter(section => !section.hidden);
    const list = shown.length ? shown : this.sections;
    if (list.findIndex(section => String(section.key) === this.selectedSection) > 0) event.stopPropagation();

    this._swipeListen(true);
  }

  _swipeListen(on) {
    this._swipeHandlers ??= {
      pointermove: event => this.sectionSwipeMove(event),
      pointerup: event => this.sectionSwipeEnd(event),
      pointercancel: () => this.sectionSwipeEnd(null)
    };

    for (const [type, handler] of Object.entries(this._swipeHandlers)) {
      if (on) globalThis.addEventListener?.(type, handler, true);else globalThis.removeEventListener?.(type, handler, true);
    }
  }

  sectionSwipeMove(event) {
    const swipe = this._swipe;
    if (!swipe || event.pointerId !== swipe.id) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y; // A vertical start is a scroll: the swipe is given up.

    if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
      this._swipe = null;

      this._swipeListen(false);
    }
  }

  sectionSwipeEnd(event) {
    const swipe = this._swipe;
    this._swipe = null;

    this._swipeListen(false);

    if (!swipe || !event || event.pointerId !== swipe.id) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const shown = this.sections.filter(section => !section.hidden);
    const list = shown.length ? shown : this.sections;
    const at = list.findIndex(section => String(section.key) === this.selectedSection);
    const rtl = globalThis.getComputedStyle?.(this)?.direction === "rtl";
    const step = dx < 0 !== rtl ? 1 : -1;
    const next = list[Math.max(0, Math.min(list.length - 1, (at < 0 ? 0 : at) + step))];
    if (next && String(next.key) !== this.selectedSection) this.selectSection(String(next.key));
  }

  selectSection(key) {
    this.selectedSection = String(key);
    this.requestComponentUpdate("section"); // A section that starts reads the groups it has not read at this
    // revision (port 1.15.0, group-load).

    this._readShownGroups("started");

    return this;
  } // The four the edit template asks for when it builds a record picker. The
  // picker renders only when a host can serve candidates; without them the
  // template returns nothing and the field falls back to its value read-only,
  // which is what a 1.0.0 host gets.


  get canPickRecords() {
    return Boolean(this.hostPort?.capabilities?.includes("field-options"));
  }

  getFieldOptionsPage(field) {
    return this.optionPages.get(String(field.key ?? "")) ?? null;
  }

  getFieldOptionSearch(field) {
    return this.optionSearches.get(String(field.key ?? "")) ?? "";
  }

  setFieldOptionSearch(field, text) {
    this.optionSearches.set(String(field.key ?? ""), String(text ?? ""));
    return this;
  }

  async loadFieldOptions(field, {
    cursor = null,
    search = "",
    quiet = false
  } = {}) {
    const key = String(field.key ?? "");
    const previous = this.optionPages.get(key); // A new search starts a new list; a cursor continues the one on screen.

    const items = cursor && Array.isArray(previous?.items) ? previous.items : []; // `quiet` is the page the group asks for as it opens. It is not announced,
    // because a consumer saw «Загрузка записей» standing under four closed
    // fields at once; an error always is.

    this.optionPages.set(key, {
      items,
      status: "loading",
      quiet,
      nextCursor: previous?.nextCursor ?? null
    });
    this.requestComponentUpdate("options"); // Dropped when the record changes, or when a newer search or page for this
    // same field is in flight -- and not when another field is read.

    const recordEpoch = this.epoch;
    const fieldEpoch = (this.optionEpochs.get(key) ?? 0) + 1;
    this.optionEpochs.set(key, fieldEpoch);
    const answer = await this._raise("field.options", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      field: key,
      cursor,
      search: String(search ?? ""),
      // The reference list a lookup chooses from, and how many to answer
      // with (port 1.14.0). Sent only to a host that reads them: the
      // payload of an earlier port is closed.
      ...(versionAtLeast(this.hostPort?.version, "1.14.0") ? { ...(field.source ? {
          source: String(field.source)
        } : {}),
        limit: OPTIONS_PAGE_LIMIT
      } : {})
    }, {
      stale: () => recordEpoch !== this.epoch || fieldEpoch !== this.optionEpochs.get(key)
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      // A refusal and an unavailability are different answers and a person
      // can act on only one of them. «Refused» means this field has no
      // candidates to offer -- a relation whose owner package is absent --
      // so a retry would fail for ever and an empty picker over an existing
      // value reads as the value being gone. The field falls back to its
      // value, read-only. «Unavailable» means not now, so the retry stays.
      const refused = answer.answer === "refused";
      this.optionPages.set(key, {
        items,
        status: refused ? "unsupported" : "error",
        quiet: false,
        nextCursor: null
      });
      this.requestComponentUpdate("options");
      return answer;
    }

    const page = answer.options_page ?? {};
    const arrived = Array.isArray(page.items) ? page.items : [];
    this.optionPages.set(key, {
      items: cursor ? [...items, ...arrived] : arrived,
      status: "ready",
      quiet: false,
      // Opaque: sent back exactly as it arrived, never constructed here.
      nextCursor: page.next_cursor ?? null,
      total: page.total ?? null
    });
    this.requestComponentUpdate("options");
    return answer;
  } // `undefined` takes a change back: the person erased what they typed into a
  // write-only field (a password), and a save must carry nothing for it --
  // not an empty value that would clear what the host keeps.


  changeField(field, value) {
    const key = String(field.key ?? ""); // Back to what the record holds is no change. A control is drawn with
    // the change it made, so it compares a later entry with that and not
    // with the record: a time put back to the stored one was written.

    const stored = Object.hasOwn(field ?? {}, "value") && value !== undefined && JSON.stringify(value) === JSON.stringify(field.value ?? null);
    if (value === undefined || stored) this.changed.delete(key);else this.changed.set(key, value);
    this.errors.delete(key); // A confirmation described the save as it stood; an entry changed after
    // it is a different save, and the question goes until save is pressed again.

    this.confirmation = null;
    this.requestComponentUpdate("changed");
    return this;
  }

  _clearInputs() {
    this.inputErrors.clear();
    this.controlErrors.clear();
  } // A field control that knows its entry is not a value yet (port 1.16.0,
  // consumer simai.main): a masked string that does not fill its mask. The
  // renderer set tells the host through setFieldError(field, message) on
  // every keystroke, and null once the text is complete or cleared. Such an
  // entry is held in inputErrors, so the same rule stops both saves -- group.save and
  // record.save («Изменить всё») -- and Save is drawn disabled while any field
  // of the surface is incomplete. Each field is its own key, so one masked
  // field completed does not release another still incomplete. What was typed
  // is the change itself (the set writes the text as shown) and is kept.


  reportFieldError(field, message) {
    const key = String(field?.key ?? "");
    if (!key) return this;
    const before = this.inputErrors.get(key);

    if (message) {
      this.inputErrors.set(key, String(message));
      this.controlErrors.add(key);
    } else if (this.controlErrors.has(key)) {
      this.inputErrors.delete(key);
      this.controlErrors.delete(key);
    }

    if (this.inputErrors.get(key) !== before) this.requestComponentUpdate("errors");
    return this;
  } // Whether a field's condition turns it off now (port 1.14.0 when.enabled).
  // The renderer set draws such a field disabled where it draws disabled and
  // read-only apart -- a choice as buttons (port 1.16.0) -- and as read-only
  // everywhere else, as before.


  fieldDisabled(field, values = this.fieldValues()) {
    return Boolean(field?.when) && !(0,_js_conditions_js__WEBPACK_IMPORTED_MODULE_14__.fieldConditions)(field, values).enabled;
  } // Which fields in a group are picked from a list the host pages rather than
  // typed. A lookup that brought its list inline is chosen from in place and
  // asks for nothing. A field its condition hides now still has its first page
  // asked for: the condition can change at any keystroke, and a picker that
  // appears empty is the broken-looking case this read exists to avoid.


  _referenceFields(section, group) {
    const current = this.sections.find(entry => String(entry.key) === String(section));
    const found = this.visible(current?.groups).find(entry => String(entry.key) === String(group));
    return this.visible(found?.fields, {
      conditions: false
    }).filter(field => PAGED_TYPES.includes(field.propertyType || field.type)).filter(field => !((field.propertyType || field.type) === "lookup" && Array.isArray(field.options) && field.options.length > 0));
  }

  editGroup(section, group, {
    focus = null
  } = {}) {
    if (!this.mayEdit) return this;
    this.quick = null;
    this.editing = {
      section: String(section),
      group: String(group)
    }; // sf-form draws the group when it draws every field (C182, VP-19);
    // its fields and saved value are kept for the whole edit.

    this.formEdit = this._formEditOf(section, group);
    this._focusFieldAfterRender = focus === null || focus === undefined ? null : String(focus);
    this.changed.clear();

    this._clearInputs();

    this.errors.clear();
    this.conflict = null;
    this.confirmation = null;
    this.requestComponentUpdate("editing"); // The first page is asked for as the group opens, not when the person
    // first types: a picker that is empty until you search looks broken, and
    // the common case is choosing from the first page without searching at
    // all.

    if (this.canPickRecords) {
      for (const field of this._referenceFields(section, group)) {
        if (!this.optionPages.has(String(field.key ?? ""))) {
          this.loadFieldOptions(field, {
            cursor: null,
            search: "",
            quiet: true
          });
        }
      }
    }

    return this;
  }

  cancelEdit() {
    if (this.quick) {
      this._quickPopover(this.quick.key)?.close?.();
      return this.endQuick() && this;
    } // «Изменить всё» opened from the menu goes back to reading.


    if (this.editAll) {
      this._dropEntries();

      this.dispatchEvent(new CustomEvent("sf-view-properties-cancel", {
        bubbles: true,
        composed: true,
        detail: {
          mode: "edit",
          scope: "record"
        }
      }));
      return this;
    } // Cancel drops what was typed and writes nothing. Data is saved by the
    // button alone, so there is nothing to undo. On a surface open all at
    // once the host decides where cancelling leads (a panel closes).


    if (this.openAll) {
      this.dispatchEvent(new CustomEvent("sf-view-properties-cancel", {
        bubbles: true,
        composed: true,
        detail: {
          mode: this.mode
        }
      })); // A panel asks to close with what is unsaved, as the cross and Esc
      // do, so the host asks the same question on every way out; the
      // entries stay until the host closes it, and survive a «no»
      // (Larena acceptance, 2026-10-22: «Отменить» discarded first and
      // then reported nothing unsaved).

      if (this.panel) {
        this.closePanel("cancelled");
        return this;
      }

      this.changed.clear();

      this._clearInputs();

      this.errors.clear();
      this.conflict = null;
      this.confirmation = null;
      this.requestComponentUpdate("editing");
      return this;
    } // A group's cancel is a fact too (simai.main, 2026-10-27): a host that
    // tracks unsaved work -- a page's beforeunload, a dirty mark -- learns
    // from the event that the group's entries were dropped, rather than
    // from the button's text or the panel's internals. The same event as
    // the whole-object cancel, with the group it was for.


    const group = this.editing;
    this.editing = null;
    this.formEdit = null;
    this.changed.clear();

    this._clearInputs();

    this.errors.clear();
    this.conflict = null;
    this.confirmation = null;
    this.requestComponentUpdate("editing");

    if (group) {
      this.dispatchEvent(new CustomEvent("sf-view-properties-cancel", {
        bubbles: true,
        composed: true,
        detail: {
          mode: this.mode,
          scope: "group",
          section: group.section,
          group: group.group
        }
      }));
    }

    return this;
  } // One press, one intent, one revision. Nothing is sent on blur and nothing
  // per field: a save carries the fields the person changed, against the
  // revision the read carried, and the host compares and sets.
  //
  // `confirm` is the digest of a confirmation the host asked for (port
  // 1.14.0): the same save raised again once the person has read what it does.
  // The fact after an applied save (simai/ui-pro#4; vocabulary §4, §5 save):
  // sf-property-view-saved {id, revision}. A page that refreshes its list on
  // a save listens here instead of wrapping the host port.


  announceSaved(answer) {
    const id = this.recordId || answer?.record_id || answer?.record?.record_id || null;
    const revision = answer?.revision ?? answer?.record?.revision ?? this.record?.revision ?? null;
    this.sfEmit("saved", {
      id,
      revision: revision === null ? "" : String(revision)
    });
  } // The fields a save covers: the group being edited, or on a surface open
  // all at once every editable group shown.


  _editedFields() {
    const out = [];

    for (const section of this.sections ?? []) {
      for (const group of this.visible(section?.groups)) {
        if (group.kind === "related" || group.editable === false) continue;
        const edited = this.openAll || this.editing && String(section.key) === this.editing.section && String(group.key) === this.editing.group;
        if (!edited) continue;

        for (const field of this.visible(group.fields)) {
          out.push(field.when ? this.conditionedField(field) : field);
        }
      }
    }

    return out;
  } // A required field left empty is said at the field before anything is sent
  // (C182 (6)); the host's own refusal is said the same way.


  _missingRequired() {
    const missing = new Map();
    const values = this.fieldValues();

    for (const field of this._editedFields()) {
      if (!field.required || field.readonly === true || this.fieldDisabled(field)) continue;
      const key = String(field.key ?? "");
      const value = values.get(key);
      const empty = value === undefined || value === null || value === "" || Array.isArray(value) && value.length === 0;
      if (empty) missing.set(key, this.requiredErrorText);
    }

    return missing;
  }

  get requiredErrorText() {
    return this.getAttribute("required-error-text") || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "requiredErrorText", this);
  } // Save is never drawn disabled (C182 (7)): pressed with something wrong it
  // shows every error at its field and, from two, a summary with a link to
  // each, which takes the focus; one error takes the focus to its field.


  _refuseWithErrors(errors) {
    for (const [key, message] of errors) if (!this.errors.has(key) && !this.inputErrors.has(key)) this.errors.set(key, message);

    this._focusErrorsAfterRender = true;
    this.requestComponentUpdate("errors");
    return {
      answer: "refused",
      reason: this.inputErrors.size ? "input_invalid" : "required",
      errors: Object.fromEntries(new Map([...this.inputErrors, ...errors]))
    };
  } // The errors of the surface in the order their fields stand.


  get errorList() {
    const all = this.inputErrors.size ? new Map([...this.errors, ...this.inputErrors]) : this.errors;
    if (!all.size) return [];
    const labels = new Map();

    for (const section of this.sections ?? []) for (const group of section?.groups ?? []) {
      for (const field of group?.fields ?? []) labels.set(String(field.key ?? ""), String(field.label ?? field.key ?? ""));
    }

    const order = [...labels.keys()];
    return [...all.entries()].sort(([a], [b]) => (order.indexOf(a) + 1 || 1e9) - (order.indexOf(b) + 1 || 1e9)).map(([key, message]) => ({
      key,
      label: labels.get(key) ?? key,
      message
    }));
  } // The field a summary link points to: its first control.


  focusField(key) {
    const root = this._ownDrawerRoot?.() ?? this;
    const scope = (this.panel ? root : this) ?? this;
    const field = scope?.querySelector?.(`[data-field="${CSS.escape(String(key))}"]`);
    const target = field?.querySelector?.("input:not([type=hidden]), textarea, select, button, [tabindex]:not([tabindex='-1'])");
    (target ?? field)?.focus?.({
      preventScroll: false
    });
    field?.scrollIntoView?.({
      block: "nearest"
    });
    return Boolean(target ?? field);
  }

  _focusErrors() {
    const list = this.errorList;
    if (!list.length) return;

    if (list.length === 1) {
      this.focusField(list[0].key);
      return;
    }

    const scope = this.panel ? this._ownDrawerRoot?.() ?? this : this;
    scope?.querySelector?.(".sf-property-view-error-summary")?.focus?.({
      preventScroll: false
    });
  }

  async saveGroup({
    confirm = null
  } = {}) {
    if (this.openAll) return this.saveAll({
      confirm
    }); // A short field's window saves as its group does, with its one value.

    const target = this.editing ?? this.quick;
    if (!target) return null;
    const missing = this.quick ? new Set() : this._missingRequired();
    if (this.inputErrors.size || missing.size) return this._refuseWithErrors(missing); // Nothing changed: Save leaves the group as it is (Save is never
    // disabled, C182 (7)).

    if (this.changed.size === 0) {
      if (this.quick) return this.saveQuick();
      this.formEdit = null;
      this.editing = null;
      this.errors.clear();
      this.conflict = null;
      this.requestComponentUpdate("editing");
      return null;
    }

    const values = this._savedValues();

    if (!Object.keys(values).length) return null;
    this.confirmation = null;
    const epoch = ++this.epoch;
    const answer = await this._raise("group.save", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      section: target.section,
      group: target.group,
      values,
      revision: this.record?.revision ?? null,
      ...(confirm ? {
        confirm
      } : {})
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null;
    if (this._askedToConfirm(answer)) return answer;

    if (answer.answer === "applied") {
      this.record = answer.record ? { ...answer.record,
        revision: answer.revision ?? answer.record.revision
      } : { ...this.record,
        revision: answer.revision ?? this.record?.revision ?? null
      };

      this._takeSections(this.record);

      const written = Object.keys(values);
      if (this.quick) this._quickPopover(this.quick.key)?.close?.();
      this.editing = null;
      this.quick = null;
      this.formEdit = null;
      this.changed.clear();

      this._clearInputs();

      this.errors.clear();
      this.conflict = null;

      this._setState("ready");

      this.markSaved(written);
      this.announceSaved(answer); // The history the panel holds is older than this save.

      if (this.historyFeed) this.historyFeed = { ...this.historyFeed,
        record: null
      };
      if (this.historySide) this.loadHistory();
      return answer;
    }

    if (answer.answer === "conflict") {
      // What the person typed is kept. The object moved underneath them and
      // saying so is the whole point of a conflict; discarding their work to
      // show the newer object would be the component deciding for them.
      this.conflict = answer.message || this.conflictText;
      this.requestComponentUpdate("conflict");
      await this._rereadAfterConflict(answer);
      return answer;
    }

    if (answer.answer === "refused" && answer.reason === "unknown-group") {
      // The arrangement moved under the panel (a view changed elsewhere).
      await this.load("requested");
      return answer;
    }

    if (answer.answer === "refused") {
      this.errors = new Map(Object.entries(answer.errors ?? {}).map(([key, value]) => [key, String(value)])); // An sf-form edit shows the host's errors at its fields and in its
      // summary (set-errors); the card's own form focuses them itself.

      const form = this.formEdit ? this._formOf(target.group) : null;
      if (form?.setErrors) form.setErrors({
        errors: Object.fromEntries(this.errors)
      });else this._focusErrorsAfterRender = this.errors.size > 0;
      this.requestComponentUpdate("errors");
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveFailedText", this));

    return answer;
  } // A surface open all at once saves the whole object: a create makes it
  // (record.create), an edit saves every changed field as one revision
  // (record.save), port 1.12.0.


  async saveAll({
    confirm = null
  } = {}) {
    const missing = this._missingRequired();

    if (this.inputErrors.size || missing.size) return this._refuseWithErrors(missing);
    if (this.mode !== "create" && this.changed.size === 0) return null;
    const creating = this.mode === "create";

    const values = this._savedValues();

    if (!creating && !Object.keys(values).length) return null;
    this.confirmation = null;
    const epoch = ++this.epoch;
    const answer = creating ? await this._raise("record.create", {
      collection: this.collection || null,
      values
    }, {
      stale: () => epoch !== this.epoch
    }) : await this._raise("record.save", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      values,
      revision: this.record?.revision ?? null,
      ...(confirm ? {
        confirm
      } : {})
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null; // A create is not confirmed: record.create carries no digest.

    if (!creating && this._askedToConfirm(answer)) return answer;

    if (answer.answer === "applied") {
      const written = Object.keys(values);
      this.changed.clear();

      this._clearInputs();

      this.errors.clear();
      this.conflict = null;

      if (this.editAll) {
        this.editAll = false;
        this.markSaved(written);
      }

      if (creating) {
        const id = answer.record_id ?? answer.record?.record_id ?? null;
        this.dispatchEvent(new CustomEvent("sf-view-properties-created", {
          bubbles: true,
          composed: true,
          detail: {
            record_id: id,
            collection: this.collection || null
          }
        })); // The new object is shown as any object is: read, with what
        // this person may do with it.

        if (id !== null) {
          this.setAttribute("record-id", String(id));
          this.setAttribute("mode", "auto");

          if (answer.record) {
            this.record = answer.record;

            this._takeSections(answer.record);

            this.view = answer.record.view ?? this.view;

            this._setState("ready");
          } else {
            await this.load("created");
          }
        }

        return answer;
      }

      this.record = answer.record ?? this.record;

      this._takeSections(answer.record);

      this._setState("ready");

      this.announceSaved(answer);
      return answer;
    }

    if (answer.answer === "conflict") {
      // As a group save: what was typed is kept, the record is read again
      // at its current revision (port 1.21.0, 1.22.1 revision_moved; the
      // fix of simai/ui-pro sf-view-properties 1.23.8, 316ee37).
      this.conflict = answer.message || this.conflictText;
      this.requestComponentUpdate("conflict");
      if (!creating) await this._rereadAfterConflict(answer);
      return answer;
    }

    if (answer.answer === "refused") {
      this.errors = new Map(Object.entries(answer.errors ?? {}).map(([key, value]) => [key, String(value)]));
      this._focusErrorsAfterRender = this.errors.size > 0;
      if (!this.errors.size && answer.message) this.conflict = answer.message;
      this.requestComponentUpdate("errors");
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveFailedText", this));

    return answer;
  } // A save the host makes only once confirmed (port 1.14.0, the data view
  // port's shape since 1.8.0): refused with reason confirm_required, with what
  // the save will do and a digest of it. The person reads it in the bar where
  // they pressed save -- the component's own place for a question, as the
  // view's reset asks there -- and either confirms, which raises the same save
  // again with the digest, or goes back to editing, which sends nothing and
  // keeps every entry. A confirmation asked again -- the digest no longer
  // matched what the save would do -- is shown again with the host's new
  // words: a person confirms what will actually happen, never what was
  // described before something moved.


  _askedToConfirm(answer) {
    const confirm = answer?.confirm;
    if (answer?.answer !== "refused" || answer.reason !== "confirm_required" || !confirm || typeof confirm.digest !== "string" || !confirm.digest) return false;
    this.confirmation = {
      text: String(confirm.summary || answer.message || ""),
      digest: confirm.digest
    };
    this.requestComponentUpdate("confirmation");
    return true;
  }

  confirmSave() {
    const digest = this.confirmation?.digest;
    if (!digest) return Promise.resolve(null);
    return this.openAll ? this.saveAll({
      confirm: digest
    }) : this.saveGroup({
      confirm: digest
    });
  }

  cancelConfirmation() {
    this.confirmation = null;
    this.requestComponentUpdate("confirmation");
    return this;
  } // Configuring the view. The host decides three separate things and the
  // component decides none of them: whether a view can be configured at all
  // (the capability), which layers this person may write (`editable`, per
  // person rather than per host, which is why it travels in the answer), and
  // which layer hid a given entry (`hiddenBy`, so the rule that hiding for
  // everyone cannot be undone in a personal view stays in one place).


  get canConfigureView() {
    // Arranging is offered where it can be saved, and not on a surface
    // placed only to show the object. A new record is laid out by the same
    // arrangement as an existing one, so the form is arranged where it is
    // filled in too (owner, 2026-10-16: «нет настройки формы» on create).
    if (this.mode === "view") return false;
    return Boolean(this.hostPort?.capabilities?.includes?.("view-settings")) && Boolean(this.view) && this.editableLayers.length > 0;
  } // The named views this person may choose between. A view is a whole
  // arrangement with a permanent id -- which is what makes renaming possible
  // -- and the layers still resolve inside whichever one is chosen. Larena
  // had already settled this shape for its lists before the panel needed it,
  // and one idea met twice is worth more than two ideas (owner, 2026-10-09).
  //
  // One view is not a choice, so the component draws no chooser for it.


  get viewProfiles() {
    const profiles = this.view?.profiles;
    if (!Array.isArray(profiles)) return [];
    return profiles.filter(profile => profile && typeof profile.id === "string" && profile.id);
  }

  get viewProfile() {
    const current = this.view?.profile;
    if (typeof current === "string" && current) return current;
    return this.viewProfiles[0]?.id ?? null;
  } // Whether a view may be removed. The last shared one may not: a scope with
  // no shared view has nothing for a person who has made none of their own.
  // The host refuses it too -- it owns the list -- but a control that can
  // only be refused is not offered, which is the same rule the saved-view
  // controls answer to (owner, 2026-10-09).


  canDeleteViewProfile(id) {
    const profiles = this.viewProfiles;
    const profile = profiles.find(item => item.id === String(id ?? ""));
    if (!profile) return false;
    if (!profile.shared) return true;
    return profiles.filter(item => item.shared).length > 1;
  } // Making a view, from what is on screen. The host gives it an id and
  // answers with the record through it, because a person who has just made a
  // view is looking at it.


  createViewProfile(label, {
    shared = false
  } = {}) {
    const name = String(label ?? "").trim();
    if (!name) return null;
    return this._viewProfileIntent("view.create", {
      label: name,
      shared: Boolean(shared),
      view: this.layerDraft ?? this._layerCopy(this.viewTarget)
    });
  } // A rename changes the label. The id is permanent, so anything pointing at
  // the view keeps pointing at it.


  renameViewProfile(id, label) {
    const name = String(label ?? "").trim();
    const profile = String(id ?? "");
    if (!name || !profile) return null;
    if (!this.viewProfiles.some(item => item.id === profile)) return null;
    return this._viewProfileIntent("view.rename", {
      profile,
      label: name
    });
  }

  deleteViewProfile(id) {
    const profile = String(id ?? "");
    if (!this.canDeleteViewProfile(profile)) return null;
    return this._viewProfileIntent("view.delete", {
      profile
    });
  } // The three acts answer the way a read answers, so they are taken the same
  // way: whatever the host sends back is the arrangement from now on.


  async _viewProfileIntent(intent, payload) {
    const epoch = ++this.epoch;
    const answer = await this._raise(intent, {
      record_id: this.recordId || null,
      collection: this.collection || null,
      ...payload
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      this._setState("error", this.viewRefusalText(answer));

      return answer;
    }

    this.record = answer.record ?? this.record;

    this._takeSections(answer.record);

    this.view = answer.record?.view ?? this.view;
    this.layerDraft = this.configuring ? this._layerCopy(this.viewTarget) : null;

    this._setState("ready");

    this.requestComponentUpdate("profiles");
    return answer;
  } // Asking for a different view. The host answers as it answers a read,
  // because reading a record through another arrangement is reading the
  // record. What a person chose is the host's to remember: a choice kept
  // here would live in one browser and vanish in the next, which looks
  // broken rather than absent.


  async selectViewProfile(id) {
    const wanted = String(id ?? "");
    if (!wanted || wanted === this.viewProfile) return null;
    if (!this.viewProfiles.some(profile => profile.id === wanted)) return null;
    const epoch = ++this.epoch;
    const answer = await this._raise("view.profile", {
      record_id: this.recordId || null,
      collection: this.collection || null,
      profile: wanted
    }, {
      stale: () => epoch !== this.epoch
    });
    if (!answer) return null;

    if (answer.answer !== "applied") {
      this._setState("error", this.viewRefusalText(answer));

      return answer;
    }

    this.record = answer.record ?? this.record;

    this._takeSections(answer.record);

    this.view = answer.record?.view ?? this.view;
    this.editing = null;
    this.changed.clear();

    this._clearInputs();

    this._setState("ready");

    if (this.configuring) this.setViewTarget(this._layerOfProfile());
    this.requestComponentUpdate("profile");
    return answer;
  }

  get editableLayers() {
    const editable = this.view?.editable;
    return Array.isArray(editable) ? editable.filter(kind => kind === "personal" || kind === "shared") : [];
  }

  layerDenied(kind) {
    if (this.editableLayers.includes(kind)) return null;
    return this.view?.denied?.[kind] || this.viewDeniedText;
  }

  _emptyLayer() {
    return {
      schema_version: 1,
      sections: {},
      groups: {},
      fields: {}
    };
  }

  _layerCopy(kind) {
    const stored = this.view?.layers?.[kind]?.view;
    return stored ? copy(stored) : this._emptyLayer();
  }

  _layerRevision(kind) {
    const layer = this.view?.layers?.[kind];
    return layer ? layer.revision ?? null : null;
  } // Reading choice, not arrangement: a rare entry is declared rare by whoever
  // owns the collection, and showing it changes no value and writes no layer.
  // It was an attribute only, so nobody short of the host could ever see one.


  toggleShowRare() {
    this.toggleAttribute("show-rare", !this.showRare);
    this.requestComponentUpdate("show-rare");
    return this.showRare;
  } // Whether anything in this record is declared rare. Without one the menu does
  // not offer to show rare entries, because an item that changes nothing reads
  // as a feature that is broken.


  get hasRare() {
    const anyRare = entries => (entries ?? []).some(entry => entry?.rare === true);

    return (this.sections ?? []).some(section => section?.rare === true || anyRare(section?.groups) || (section?.groups ?? []).some(group => anyRare(group?.fields)));
  } // The layer a person's own edits are written to: the personal layer of the
  // chosen profile, at once, whatever the profile is (C298, C311 (5)). «For
  // everyone» is a separate act, view.publish, offered to those who may
  // write the shared layer (RC-1: a shared profile was written for everyone
  // on every move). A host that offers no personal layer keeps the 1.18.0
  // way: the shared layer of a shared profile.


  _layerOfProfile() {
    if (this.editableLayers.includes("personal")) return "personal";
    const profile = this.viewProfiles.find(item => item.id === this.viewProfile);
    const wanted = profile?.shared ? "shared" : "personal";
    return this.editableLayers.includes(wanted) ? wanted : this.viewTarget;
  } // Whether the host speaks port 1.22.0 (view.publish, view.lock): the
  // contract is in ui-source and rides the next pair. A 1.21.0 host (group
  // build 13: 1.20.0 type templates, 1.21.0 form fields), a 1.19.0 host
  // (group build 12: money C294) and earlier hosts are offered neither. The
  // C311 edition was called 1.19.0 on its ui-source branch until GB12 took
  // the number, then 1.20.0 here; group build 13 numbers it 1.22.0.


  get hostSpeaksCardSettings() {
    const [major, minor] = String(this.hostPort?.version ?? "").split(".").map(Number);
    return major > 1 || major === 1 && minor >= 22;
  } // Whether this person may write the shared layer: «Сохранить для всех»,
  // the locks and the head's fields are theirs (C298, C311 (2), (5)).


  get canWriteShared() {
    return this.editableLayers.includes("shared") && this.hostSpeaksCardSettings;
  } // A required profile (port 1.22.0 profiles[].required): it cannot be
  // changed, and edits live until the page is left -- nothing is written
  // (C298, RC-2).


  get viewRequired() {
    const profile = this.viewProfiles.find(item => item.id === this.viewProfile);
    return profile?.required === true;
  } // The paths the lower layers cannot change (port 1.22.0 view.locked):
  // fields.<key>.hidden, fields.<key>.group, sections.<key>, sections.order,
  // head. A person who may write the shared layer is the one who locked
  // them and may still change them.


  get viewLocked() {
    const locked = this.view?.locked;
    return new Set(Array.isArray(locked) ? locked.map(String) : []);
  }

  isLocked(path) {
    return this.viewLocked.has(String(path));
  }

  lockedForMe(path) {
    return this.isLocked(path) && !this.canWriteShared;
  } // Whether the personal layer of the chosen profile holds anything: what
  // «Сохранить для всех» would publish. The required profile's edits are
  // the page's only (requiredEdits).


  get hasPersonalEdits() {
    const layer = this.view?.layers?.personal;
    const view = layer?.view;
    if (!view) return false;
    return ["sections", "groups", "fields"].some(bucket => Object.keys(view[bucket] ?? {}).length > 0) || Boolean(view.head);
  }

  startConfiguringView() {
    if (!this.canConfigureView) return false;
    this.configuring = true;
    this.layerDirty = false;
    if (this.viewProfiles.length) this.viewTarget = this._layerOfProfile(); // What the arrangement was when the mode was entered. Every change in
    // this mode is written at once, so «cancel» can only mean putting back
    // what a person started from -- which is what a person means by it.

    this.arrangementEntered = {
      kind: this.viewTarget,
      revision: this._layerRevision(this.viewTarget),
      view: this._layerCopy(this.viewTarget)
    };
    this.resetAsked = false;
    this.requiredEdits = false;
    this.layerDraft = this._layerCopy(this.viewTarget);

    this._bindSectionDropTarget();

    this.entryErrors = new Map();
    this.cancelEdit();
    this.requestComponentUpdate("configuring"); // Arranging shows every group; those not read yet are read now.

    this._readShownGroups("started");

    this._focusAfterRender(['.sf-property-view-configure-top [data-action="view-profile"]', ".sf-property-view-configure-bar"]);

    return true;
  }

  stopConfiguringView() {
    const wasConfiguring = this.configuring;
    this.configuring = false;
    this.layerDirty = false;

    this._bindSectionDropTarget();

    this.layerDraft = null;
    this.arrangementEntered = null;
    this.resetAsked = false;
    this.entryErrors = new Map();
    this.requestComponentUpdate("configuring");
    if (wasConfiguring) this._focusAfterRender('[data-action="menu"]');
  } // Where the keyboard goes when the mode changes. The menu that started
  // arranging closes and the bar that ends it goes away, and each left the
  // focus on the page's body, so a keyboard user started again from the top
  // (simai.main keyboard QA, 2026-10-28). Entering, the focus goes to the
  // arranging bar's view chooser (its first control otherwise: the first was
  // Reset, the act that takes most away); leaving, to the panel's menu,
  // where the mode was entered from. The first selector that finds a
  // control wins.


  _focusAfterRender(selectors) {
    // What can take focus is the layer stack's one list (core.runtime 1.19.0).
    const inside = area => (area?.matches?.(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.FOCUSABLE) ? area : area?.querySelector?.(_core_js_layer_stack__WEBPACK_IMPORTED_MODULE_9__.FOCUSABLE)) ?? null;

    this.whenRendered(() => requestAnimationFrame(async () => {
      const root = this.panelContent?.() ?? this;
      let target = null;

      for (const selector of [selectors].flat()) {
        const area = [...(root?.querySelectorAll?.(selector) ?? [])].pop() ?? null;
        if (!area) continue;
        target = inside(area); // A child defined lazily (the view chooser on a cold page) has
        // no control yet on the first frame, and the next selector's
        // first control -- Reset -- took the focus in its place
        // (simai.main, 2026-10-28). Its definition and first render are
        // waited for before falling through.

        if (!target && area.localName.includes("-")) {
          await customElements.whenDefined(area.localName);
          await area.whenRendered?.();
          await new Promise(done => requestAnimationFrame(done));
          target = inside(area);
        }

        if (target) break;
      }

      if (!target || !target.isConnected) return;
      const active = document.activeElement; // Only where the focus was lost: a person who has already moved on
      // keeps where they went.

      if (active && active !== document.body && root?.contains?.(active)) return;
      target.focus({
        preventScroll: true
      });
    }), {
      next: true
    });
  } // Leaving the mode with the arrangement a person started from. Not the same
  // as resetting: a reset takes the layer away and lets what lies beneath show
  // through, while this writes back the arrangement that was there when the
  // mode was entered, including one a person had made earlier.
  //
  // Nothing written since then means nothing to write back: the host's layer
  // is still the one entered with, and an identical view.save still cost a
  // shared revision and a history entry (simai.main QA, 2026-10-28).
  // «Сохранить» (save model C1): the draft written once for the person, then
  // the mode ends; a refusal or a conflict keeps the mode with its message.


  async commitConfiguringView() {
    if (!this.configuring) return false;

    if (this.layerDirty && !this.viewRequired) {
      this._committing = true;
      let answer = null;

      try {
        answer = await this.saveView();
      } finally {
        this._committing = false;
      }

      if (answer?.answer !== "applied") return answer;
      this.layerDirty = false;
    }

    this.stopConfiguringView();
    return true;
  } // «Сохранить для всех»: the draft written as the person's, then published.


  async publishConfiguringView() {
    if (!this.configuring || !this.canWriteShared || this.viewRequired) return null;

    if (this.layerDirty) {
      this._committing = true;
      let saved = null;

      try {
        saved = await this.saveView();
      } finally {
        this._committing = false;
      }

      if (saved?.answer !== "applied") return saved;
      this.layerDirty = false;
    }

    const answer = await this.publishView();
    if (answer?.answer === "applied") this.stopConfiguringView();
    return answer;
  }

  async cancelConfiguringView() {
    if (!this.configuring) return false; // Save model C1: nothing was written in the mode, so «Отменить» drops
    // the draft and writes nothing (it wrote the entered layout back and
    // read the record again).

    if (!this.viewRequired) {
      if (this.arrangementEntered) this.layerDraft = copy(this.arrangementEntered.view);
      this.layerDirty = false;
      this.stopConfiguringView();
      this.requestComponentUpdate("view-cancel");
      return true;
    } // A required view wrote nothing: what was drawn is read again.


    if (this.viewRequired) {
      const edited = this.requiredEdits;
      this.requiredEdits = false;
      if (edited) await this.load("view-cancel");
      this.stopConfiguringView();
      return true;
    }

    const entered = this.arrangementEntered;

    if (!entered || entered.kind !== this.viewTarget) {
      this.stopConfiguringView();
      return true;
    }

    const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

    const stored = this._layerCopy(entered.kind);

    const untouched = entered.revision != null && this._layerRevision(entered.kind) === entered.revision;

    if (untouched || same(stored, entered.view)) {
      // A write the host refused leaves the draft ahead of the layer, so
      // what is drawn is read again; an untouched draft needs nothing.
      if (!same(this.layerDraft, entered.view)) await this.load("view-cancel");
      this.stopConfiguringView();
      return true;
    }

    this.layerDraft = copy(entered.view);
    const answer = await this.saveView();
    await this.load("view-cancel");
    this.stopConfiguringView();
    return answer;
  } // A reset asks first. It takes away everything a person arranged in this
  // layer, and a single press of a button next to «done» is too little for
  // that; the button says what it will do and the next press does it.


  askReset() {
    if (!this.configuring) return false;
    this.resetAsked = true;
    this.requestComponentUpdate("reset-ask");
    return true;
  }

  cancelReset() {
    this.resetAsked = false;
    this.requestComponentUpdate("reset-ask");
    return true;
  }

  setViewTarget(kind) {
    if (!this.editableLayers.includes(kind) || kind === this.viewTarget) return false;
    this.viewTarget = kind;
    this.layerDraft = this._layerCopy(kind);
    this.entryErrors = new Map();
    this.requestComponentUpdate("view-target");
    return true;
  } // A hidden entry can be shown again only from the layer that hid it or above
  // it. `package` is above both, `shared` above `personal`, so a personal view
  // cannot reveal what was hidden for everyone -- and the component is told
  // which layer decided rather than working it out.


  canChangeVisibility(entry) {
    // A setting the admin locked (port 1.22.0 view.locked).
    const key = entry?.key != null ? String(entry.key) : null;
    if (key && (this.lockedForMe(`fields.${key}.hidden`) || this.lockedForMe(`sections.${key}`))) return false;
    const hiddenBy = entry?.hiddenBy ?? null;
    if (!hiddenBy) return true;
    if (hiddenBy === "package") return false;
    if (hiddenBy === "shared") return this.viewTarget === "shared";
    return true;
  }

  entryError(kind, key) {
    return this.entryErrors.get(`${kind}:${key}`) ?? null;
  } // The resolved siblings of a container, in the order they are drawn. The move
  // is computed against what a person sees, not against what the layer stores:
  // a layer is sparse, so the entry being dragged may have no order in it yet.


  _groupsOf(sectionKey) {
    const section = this.sections.find(item => String(item.key) === String(sectionKey));
    return Array.isArray(section?.groups) ? section.groups : [];
  }

  _fieldsOf(groupKey) {
    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        if (String(group.key) === String(groupKey)) return Array.isArray(group.fields) ? group.fields : [];
      }
    }

    return [];
  }

  _locateGroup(groupKey) {
    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        if (String(group.key) === String(groupKey)) return {
          section,
          group
        };
      }
    }

    return null;
  } // Dense order for the containers a move touched, and only those. A single
  // sparse order cannot say «between B and C» -- two neighbours may share a
  // number, or have none -- so the layer takes over the order of the one or two
  // containers that changed and leaves every other container resolving as it did.


  _writeOrder(bucket, items, extra = {}) {
    items.forEach((item, index) => {
      const key = String(item.key);
      bucket[key] = { ...(bucket[key] ?? {}),
        ...extra,
        order: index + 1
      };
    });
  } // A field dropped on a section in the list lands in that section's first
  // group that takes fields. A section is not itself a container of fields --
  // a group is -- so something has to choose, and the first group is the one a
  // person sees at the top of the section they aimed at. A section whose only
  // groups are related lists takes nothing, and the drop is refused rather
  // than landing somewhere invisible.


  moveFieldToSection(fieldKey, sectionKey) {
    if (!this.configuring || !this.layerDraft) return false;
    const section = (this.sections ?? []).find(candidate => String(candidate.key) === String(sectionKey));
    if (!section) return false;
    const group = (section.groups ?? []).find(candidate => candidate.kind !== "related");
    if (!group) return false;
    return this.moveField(fieldKey, String(group.key), (group.fields ?? []).length);
  } // The section list is a drop target of its own rather than a sortable list:
  // a list would name the whole column, and a field has to land on one section
  // in it. sf-sortable publishes exactly this seam for a target that is not a
  // list, and it resolves by pointer, so moving a field to another section with
  // the keyboard is still missing.


  _bindSectionDropTarget() {
    if (!this.configuring) {
      this._releaseSectionTarget?.();
      this._releaseSectionTarget = null;
      return;
    }

    if (this._releaseSectionTarget) return;
    const register = globalThis.SF?.Sortable?.registerSortableDropTarget;
    if (typeof register !== "function") return;

    const sectionAt = (x, y) => {
      const under = globalThis.document?.elementFromPoint?.(x, y); // While the view is arranged the sections are rows of their own, so a
      // field may be dropped on a tab the same way it is dropped on a group.
      // This target is bound only while the view is arranged, and then the
      // sections are those rows (data-section-tab, the section key); the
      // reading list (sf-tabs) is never drawn at the same time.

      const item = under?.closest?.("[data-section-tab]"); // Another panel's list is not this panel's drop target. The drawer
      // moves the content out of the element, so asking `closest` for an
      // sf-view-properties finds nothing at all -- which is why the first
      // version of this resolved on no section and a field dropped on the
      // list simply stayed where it was.

      const content = this.panelContent();
      if (!item || !content || !content.contains(item)) return null;
      return item;
    };

    this._releaseSectionTarget = register({
      resolve: (x, y, session) => {
        // A field lands in the section's first group; a whole area moves
        // to the section itself. Anything else is not ours.
        if (session?.group && !["field", "group"].includes(session.group)) return null;
        const item = sectionAt(x, y);
        if (!item) return null;
        const key = item.getAttribute("data-section-tab");
        if (key === this.selectedSection) return null; // The row's name, not its handle or icon: those are glyph
        // ligatures, and their words would be read into the label.

        return {
          descriptor: {
            section: key
          },
          rect: item.getBoundingClientRect(),
          label: item.querySelector(".sf-property-view-section-tab-label")?.textContent?.trim() || item.textContent?.trim() || key
        };
      },
      drop: (session, descriptor) => {
        if (!descriptor?.section) return false;

        if (session?.group === "group") {
          return this.moveGroup(session?.item, descriptor.section, Number.MAX_SAFE_INTEGER);
        }

        return this.moveFieldToSection(session?.item, descriptor.section);
      }
    });
  }

  moveField(fieldKey, toGroupKey, index) {
    if (!this.configuring || !this.layerDraft) return false;
    if (this.lockedForMe(`fields.${String(fieldKey)}.group`)) return false;

    const target = this._locateGroup(toGroupKey);

    if (!target) return false;
    let moved = null;
    let fromGroup = null;

    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        const at = (group.fields ?? []).findIndex(field => String(field.key) === String(fieldKey));

        if (at >= 0) {
          fromGroup = group;
          [moved] = group.fields.splice(at, 1);
          break;
        }
      }

      if (moved) break;
    } // A field being placed may be coming back from outside the arrangement
    // rather than from another group.


    let fromUnplaced = false;

    if (!moved) {
      const waiting = this.record?.unplaced ?? [];
      const at = waiting.findIndex(field => String(field.key) === String(fieldKey));

      if (at >= 0) {
        [moved] = waiting.splice(at, 1);
        fromUnplaced = true;
      }
    }

    if (!moved) return false;
    const into = target.group.fields ?? (target.group.fields = []);
    const at = Math.max(0, Math.min(Number.isInteger(index) ? index : into.length, into.length));
    into.splice(at, 0, moved);

    this._writeOrder(this.layerDraft.fields, into, {
      group: String(toGroupKey)
    });

    if (fromUnplaced) {
      this._writeOrder(this.layerDraft.fields, this.record?.unplaced ?? [], {
        group: null
      });
    }

    if (fromGroup && fromGroup !== target.group) {
      this._writeOrder(this.layerDraft.fields, fromGroup.fields ?? [], {
        group: String(fromGroup.key)
      });
    }

    this.requestComponentUpdate("view-move");
    return this.saveView();
  }

  moveGroup(groupKey, toSectionKey, index) {
    if (!this.configuring || !this.layerDraft) return false;
    const target = this.sections.find(item => String(item.key) === String(toSectionKey));
    if (!target) return false;
    let moved = null;
    let fromSection = null;

    for (const section of this.sections) {
      const at = (section.groups ?? []).findIndex(group => String(group.key) === String(groupKey));

      if (at >= 0) {
        fromSection = section;
        [moved] = section.groups.splice(at, 1);
        break;
      }
    }

    if (!moved) return false;
    const into = target.groups ?? (target.groups = []);
    const at = Math.max(0, Math.min(Number.isInteger(index) ? index : into.length, into.length));
    into.splice(at, 0, moved);

    this._writeOrder(this.layerDraft.groups, into, {
      section: String(toSectionKey)
    });

    if (fromSection && fromSection !== target) {
      this._writeOrder(this.layerDraft.groups, fromSection.groups ?? [], {
        section: String(fromSection.key)
      });
    }

    this.requestComponentUpdate("view-move");
    return this.saveView();
  } // Width, template variant and hint, one field at a time. The value is written
  // into the layer and onto the drawn entry together, so the view moves under
  // the person's hand and the layer is what gets stored.


  setFieldView(fieldKey, patch = {}) {
    if (!this.configuring || !this.layerDraft) return false; // `label` is this view's name for the field, the same way a section and
    // an area carry one: the collection keeps its own, and resetting the
    // layer gives it back.
    // The template (variant) is the field's own, chosen once in the field
    // (C302 (2), C311 (6), RC-9): the card view writes none. A layer that
    // holds one is still read until 2027-01-01.

    const allowed = ["width", "hint", "label"];
    const change = Object.fromEntries(Object.entries(patch).filter(([key]) => allowed.includes(key)));
    if (!Object.keys(change).length) return false;
    const key = String(fieldKey);
    this.layerDraft.fields[key] = { ...(this.layerDraft.fields[key] ?? {}),
      ...change
    };

    for (const section of this.sections) {
      for (const group of section.groups ?? []) {
        for (const field of group.fields ?? []) {
          if (String(field.key) === key) Object.assign(field, change);
        }
      }
    }

    this.requestComponentUpdate("view-field");
    return this.saveView();
  } // The glyphs a section may be marked with. A hundred and twenty names from
  // the Framework's own icon set, the ones products actually reach for, read
  // in rows of what a record's sections are usually about -- what a thing is,
  // who it belongs to, when it happens, what it costs, what it is made of. A
  // host with its own vocabulary passes `section-icons` and this is replaced
  // wholesale rather than added to, because a list nobody chose is a list that
  // grows until it is useless.
  // The input as it was given: a list of glyph names, or nothing for the
  // component's own. A declared input answers with what it was told, so the
  // resolved list is a second question rather than this one's answer.


  get sectionIcons() {
    return this.getAttribute("section-icons") || "";
  }

  get sectionIconChoices() {
    const given = this.sectionIcons;
    if (given) return given.split(/[\s,]+/u).filter(Boolean);
    return SECTION_ICONS;
  } // A section's glyph is this view's, like its name: the layer carries it and
  // resetting the layer gives the host's back.


  setSectionIcon(sectionKey, icon) {
    if (!this.configuring || !this.layerDraft) return false;
    const name = String(sectionKey);
    const section = this.sections.find(part => String(part.key) === name);
    if (!section) return false;
    const next = String(icon ?? "").trim() || null;
    this.layerDraft.sections[name] = { ...(this.layerDraft.sections[name] ?? {}),
      icon: next
    };
    section.icon = next;
    this.requestComponentUpdate("view-section-icon");
    return this.saveView();
  } // Naming what is on screen. A label is the layer's to set -- the port has
  // carried `label` for a section and a group since 1.6.0 -- so renaming is an
  // arrangement, not a change to the collection: what it renames is this
  // view's name for it, and resetting the layer gives the host's name back.


  renameEntry(kind, key, label) {
    if (!this.configuring || !this.layerDraft) return false;
    const buckets = {
      section: "sections",
      group: "groups"
    };
    const bucket = buckets[kind];
    if (!bucket) return false;
    const next = String(label ?? "").trim();
    if (!next) return false;

    const entry = this._findEntry(kind, key);

    if (!entry) return false;
    const name = String(key);
    this.layerDraft[bucket][name] = { ...(this.layerDraft[bucket][name] ?? {}),
      label: next
    };
    entry.label = next;
    this.renaming = null;
    this.requestComponentUpdate("view-rename");
    return this.saveView();
  }

  startRenaming(kind, key) {
    if (!this.configuring) return false;
    this.renaming = {
      kind,
      key: String(key)
    };
    this.requestComponentUpdate("view-rename");
    return true;
  }

  cancelRenaming() {
    this.renaming = null;
    this.requestComponentUpdate("view-rename");
  } // Taking an area out of the view. Its fields are not destroyed with it: they
  // join the unplaced, which is where a field goes when it belongs to no area,
  // so nothing a person put in it is lost by removing the box around it.
  //
  // In the layer an area that is gone is an area that is hidden, because that
  // is what the port has a word for -- the collection still has it, this view
  // does not show it, and resetting the layer brings it back.


  removeGroup(groupKey) {
    if (!this.configuring || !this.layerDraft) return false;

    const target = this._locateGroup(groupKey);

    if (!target || !this.canChangeVisibility(target.group)) return false;

    for (const field of [...(target.group.fields ?? [])]) {
      this.moveFieldToUnplaced(String(field.key));
    }

    const name = String(groupKey);
    this.layerDraft.groups[name] = { ...(this.layerDraft.groups[name] ?? {}),
      hidden: true
    };
    target.group.hidden = true;
    const section = this.sections.find(part => (part.groups ?? []).includes(target.group));
    if (section) section.groups = (section.groups ?? []).filter(group => group !== target.group);
    this.requestComponentUpdate("view-remove-group");
    return this.saveView();
  } // A tab is removed and its fields go to «Скрытые поля» (C311 (4)), where
  // the eye or a drag brings each back: one way to not show a field (C106
  // (1)). Its areas are hidden with it. It moved the areas to the tab that
  // remained before.


  removeSection(sectionKey) {
    if (!this.configuring || !this.layerDraft) return false;
    const name = String(sectionKey);
    const section = this.sections.find(part => String(part.key) === name);
    if (!section || !this.canChangeVisibility(section)) return false;
    if (this.sections.length < 2) return false;
    const into = this.sections.find(part => part !== section);

    for (const group of [...(section.groups ?? [])]) {
      if (group.kind !== "related") {
        for (const field of [...(group.fields ?? [])]) this.moveFieldToUnplaced(String(field.key), undefined, {
          save: false
        });
      }

      const groupName = String(group.key);
      this.layerDraft.groups[groupName] = { ...(this.layerDraft.groups[groupName] ?? {}),
        hidden: true
      };
      group.hidden = true;
    }

    this.layerDraft.sections[name] = { ...(this.layerDraft.sections[name] ?? {}),
      hidden: true
    };
    section.hidden = true;
    this.sections = this.sections.filter(part => part !== section);
    if (this.selectedSection === name) this.selectedSection = String(into.key);
    this.requestComponentUpdate("view-remove-section");
    return this.saveView();
  } // The order of the sections, as a drag leaves them. A section is a tab in
  // this arrangement, and a tab nobody can move is an order the host chose
  // once and nobody since.


  moveSection(sectionKey, index) {
    if (!this.configuring || !this.layerDraft) return false;
    if (this.lockedForMe("sections.order")) return false;
    const name = String(sectionKey);
    const at = this.sections.findIndex(part => String(part.key) === name);
    if (at < 0) return false;
    const next = [...this.sections];
    const [moved] = next.splice(at, 1);
    const to = Math.max(0, Math.min(Number.isInteger(index) ? index : next.length, next.length));
    next.splice(to, 0, moved);
    if (next.every((part, position) => part === this.sections[position])) return false;
    this.sections = next;

    this._writeOrder(this.layerDraft.sections, this.sections, {});

    this.requestComponentUpdate("view-move-section");
    return this.saveView();
  } // Making a new area, and a new section to hold areas. This is the one act in
  // arranging that does not rearrange what the host sent: it names something
  // the record does not carry yet, and the host decides whether to keep it --
  // the layer write says so, and the area survives the next read only if the
  // host returns it. Until then it is drawn from the layer, so a person sees
  // what they made straight away.


  addGroup(sectionKey) {
    if (!this.configuring || !this.layerDraft) return false;
    const section = this.sections.find(part => String(part.key) === String(sectionKey)) ?? this.sections[0];
    if (!section) return false;

    const key = this._newEntryKey("group");

    const group = {
      key,
      label: this.newGroupTitle,
      columns: 1,
      fields: [],
      hidden: false,
      rare: false,
      editable: true
    };
    section.groups = [...(section.groups ?? []), group];

    this._writeOrder(this.layerDraft.groups, section.groups, {
      section: String(section.key)
    });

    this.layerDraft.groups[key] = { ...(this.layerDraft.groups[key] ?? {}),
      label: group.label,
      section: String(section.key),
      columns: 1,
      hidden: false
    };
    this.renaming = {
      kind: "group",
      key
    };
    this.requestComponentUpdate("view-add-group");
    return this.saveView();
  } // A new tab comes with a «Поля» area (C311 (4)), so a field can be moved to
  // it at once from its «⋯ → На вкладку …».


  addSection() {
    if (!this.configuring || !this.layerDraft) return false;

    const key = this._newEntryKey("section");

    const groupKey = this._newEntryKey("group");

    const fieldsTitle = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "newTabGroupTitle", this);
    const group = {
      key: groupKey,
      label: fieldsTitle,
      columns: 1,
      fields: [],
      hidden: false,
      rare: false,
      editable: true
    };
    const section = {
      key,
      label: this.newSectionTitle,
      groups: [group],
      hidden: false,
      rare: false
    };
    this.layerDraft.groups[groupKey] = {
      label: fieldsTitle,
      section: key,
      columns: 1,
      hidden: false,
      order: 1
    };
    this.sections = [...this.sections, section];

    this._writeOrder(this.layerDraft.sections, this.sections, {});

    this.layerDraft.sections[key] = { ...(this.layerDraft.sections[key] ?? {}),
      label: section.label,
      hidden: false
    };
    this.selectedSection = key;
    this.renaming = {
      kind: "section",
      key
    };
    this.requestComponentUpdate("view-add-section");
    return this.saveView();
  } // A key nobody else holds, said in the open so a host reading the layer can
  // tell a key this component made from one of its own.


  _newEntryKey(kind) {
    const stamp = Date.now().toString(36);
    const noise = Math.floor(Math.random() * 46655).toString(36).padStart(3, "0");
    return `view-${kind}-${stamp}${noise}`;
  }

  toggleEntryHidden(kind, key) {
    if (!this.configuring || !this.layerDraft) return false;
    const buckets = {
      section: "sections",
      group: "groups",
      field: "fields"
    };
    const bucket = buckets[kind];
    if (!bucket) return false;

    const entry = this._findEntry(kind, key);

    if (!entry || !this.canChangeVisibility(entry)) return false;
    const next = !entry.hidden;
    const name = String(key);
    this.layerDraft[bucket][name] = { ...(this.layerDraft[bucket][name] ?? {}),
      hidden: next
    };
    entry.hidden = next;
    this.requestComponentUpdate("view-hidden");
    return this.saveView();
  }

  _findEntry(kind, key) {
    const name = String(key);

    for (const section of this.sections) {
      if (kind === "section" && String(section.key) === name) return section;

      for (const group of section.groups ?? []) {
        if (kind === "group" && String(group.key) === name) return group;

        for (const field of group.fields ?? []) {
          if (kind === "field" && String(field.key) === name) return field;
        }
      }
    }

    return null;
  } // Applied immediately, the way column settings are, and against the layer
  // revision. A refusal or a conflict is not something to paper over: the
  // arrangement on screen is the component optimistic copy, so when the host
  // does not accept it the record is read again and the host resolution wins.


  async saveView() {
    if (!this.canConfigureView || !this.layerDraft) return null; // Save model C1 (study S-B, VL-93): arranging is a draft. A change is
    // drawn at once and written by «Сохранить» (one view.save), by
    // «Сохранить для всех» (view.save, then view.publish) or dropped by
    // «Отменить» with no write. A required view keeps its own rule.

    if (this.configuring && !this.viewRequired && !this._committing) {
      this.layerDirty = true;
      this.requestComponentUpdate("view-draft");
      return {
        answer: "applied",
        draft: true
      };
    } // Serialized, one write at a time. Two drags in quick succession would
    // otherwise both be sent against the revision the layer had before either
    // of them, so the second would be answered with a conflict the person
    // caused by being quick -- correct by the contract and useless to them.
    // Waiting means the second write carries the revision the first earned.


    const queued = this._viewWriting ?? Promise.resolve();
    let release;
    this._viewWriting = new Promise(done => {
      release = done;
    });

    try {
      await queued;
      return await this._saveViewNow();
    } finally {
      release();
    }
  }

  async _saveViewNow() {
    if (!this.canConfigureView || !this.layerDraft) return null; // A required view: the edit is drawn and kept until the page is left,
    // and never written (C298).

    if (this.viewRequired) {
      this.requiredEdits = true;
      this.requestComponentUpdate("view-required");
      return {
        answer: "applied",
        local: true
      };
    }

    const kind = this.viewTarget;
    const epoch = ++this.viewEpoch;
    const answer = await this._raise("view.save", {
      record_id: null,
      collection: this.collection || null,
      target: {
        kind,
        revision: this._layerRevision(kind)
      },
      view: copy(this.layerDraft)
    }, {
      stale: () => epoch !== this.viewEpoch
    });
    if (!answer) return null;

    if (answer.answer === "applied") {
      this.entryErrors = new Map();

      this._storeLayer(kind, answer.revision ?? null, answer.view ?? this.layerDraft); // A host that normalised the layer is telling the component its copy
      // is not what was stored, so the arrangement is read again rather
      // than left as the component imagined it.
      // The port says a view write announces sf-property-view-state, so it
      // has to announce it when the write succeeds and not only when it
      // fails -- otherwise the declared event is a half-truth and a host
      // listening for it would hear only bad news.


      if (answer.view) await this.load("view-normalised");else {
        this._setState("ready");

        this.requestComponentUpdate("view-saved");
      }
      return answer;
    }

    if (answer.answer === "conflict") {
      this._storeLayer(kind, answer.revision ?? null, answer.view ?? null);

      this.message = answer.message || this.viewConflictText;
      await this.load("view-conflict");
      return answer;
    }

    if (answer.answer === "refused") {
      const errors = Object.entries(answer.entry_errors ?? {});
      this.entryErrors = new Map(errors.map(([key, value]) => [key, this.viewRefusalText({
        code: value
      }, String(value))]));
      await this.load("view-refused"); // An error of the head or of no entry on screen is said as the card's message.

      const loose = errors.find(([key]) => !key.includes(":"));
      if (loose || !errors.length) this.message = this.viewRefusalText(loose ? {
        code: loose[1]
      } : answer, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this));
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this));

    return answer;
  } // «Сохранить для всех» (port 1.22.0 view.publish; C298, C311 (5), RC-1):
  // the host merges the personal layer into the profile's shared layer and
  // clears the personal one, in one write. A conflict carries the newer
  // shared layer: the card redraws and says «Вид изменился».


  async publishView() {
    if (!this.configuring || !this.canWriteShared || this.viewRequired) return null;
    await (this._viewWriting ?? Promise.resolve());
    const epoch = ++this.viewEpoch;
    const answer = await this._raise("view.publish", {
      record_id: null,
      collection: this.collection || null,
      profile: this.viewProfile,
      personal_revision: this._layerRevision("personal"),
      shared_revision: this._layerRevision("shared")
    }, {
      stale: () => epoch !== this.viewEpoch
    });
    if (!answer) return null;

    if (answer.answer === "applied" || answer.answer === "conflict") {
      const shared = answer.shared ?? null;
      if (shared) this._storeLayer("shared", shared.revision ?? null, shared.view ?? null);

      if (answer.answer === "applied") {
        this._storeLayer("personal", answer.personal?.revision ?? null, null);

        this.message = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewPublishedText", this);
      } else {
        // A conflict carries both newer layers: the next publish asks with them.
        if (answer.personal) this._storeLayer("personal", answer.personal.revision ?? null, answer.personal.view ?? null);
        this.message = this.viewRefusalText(answer, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewChangedText", this));
      }

      this.layerDraft = this._layerCopy(this.viewTarget); // What «Отменить» puts back is now what everyone has.

      this.arrangementEntered = {
        kind: this.viewTarget,
        revision: this._layerRevision(this.viewTarget),
        view: this._layerCopy(this.viewTarget)
      };
      await this.load(answer.answer === "applied" ? "view-published" : "view-conflict");
      return answer;
    }

    this._setState("error", this.viewRefusalText(answer, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this)));

    return answer;
  } // «Закрыть для изменений» (port 1.22.0 view.lock; C298, RC-2): one setting
  // the lower layers cannot change, for a person who may write the shared
  // layer. The host answers the locked list and the shared revision.


  async lockViewPath(path, locked = !this.isLocked(path)) {
    if (!this.configuring || !this.canWriteShared) return null;
    const epoch = ++this.viewEpoch;
    const answer = await this._raise("view.lock", {
      record_id: null,
      collection: this.collection || null,
      profile: this.viewProfile,
      path: String(path),
      locked: Boolean(locked),
      revision: this._layerRevision("shared")
    }, {
      stale: () => epoch !== this.viewEpoch
    });
    if (!answer) return null;

    if ((answer.answer === "applied" || answer.answer === "conflict") && this.view) {
      if (Array.isArray(answer.locked)) this.view.locked = answer.locked.map(String); // Larena's path "required" answers whether the profile is now required.

      if (typeof answer.required === "boolean" && Array.isArray(this.view.profiles)) {
        this.view.profiles = this.view.profiles.map(item => item.id === this.viewProfile ? { ...item,
          required: answer.required
        } : item);
      }

      const shared = this.view.layers?.shared;
      if (shared && answer.revision) this.view.layers = { ...this.view.layers,
        shared: { ...shared,
          revision: String(answer.revision)
        }
      };
      if (answer.answer === "conflict") this.message = this.viewRefusalText(answer, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewChangedText", this));
      this.requestComponentUpdate("view-lock");
      return answer;
    }

    this._setState("error", this.viewRefusalText(answer, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this)));

    return answer;
  } // «Сохранить как моё» (C311 (5), RC-3): a personal profile from what is on
  // screen, for a view whose settings are locked. Not in a required view.


  get canSaveAsMine() {
    return this.configuring && !this.viewRequired && this.editableLayers.includes("personal");
  }

  saveAsMine() {
    if (!this.canSaveAsMine) return null;
    const current = this.viewProfiles.find(profile => profile.id === this.viewProfile);
    const label = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "saveAsMineLabelText", this).replace("{name}", current?.label ?? "");
    return this.createViewProfile(label, {
      shared: false
    });
  } // The card head (port 1.22.0 view.head; C289 (6), C311 (2)): the title,
  // under it up to two fields, and the stage as a tonal badge. What the
  // draft layer says wins over what the host resolved.


  get viewHead() {
    const layered = this.configuring ? this.layerDraft?.head : null;
    const head = layered ?? this.view?.head ?? null;
    if (!head || typeof head !== "object") return {
      subtitle: [],
      status: null
    };
    const subtitle = Array.isArray(head.subtitle) ? head.subtitle.map(String).filter(Boolean).slice(0, 2) : [];
    return {
      subtitle,
      status: typeof head.status === "string" && head.status ? head.status : null
    };
  } // What the head draws under the title: the subtitle fields' values, and
  // the stage's option with its scheme for the tonal badge.


  get headLine() {
    const head = this.viewHead;
    const subtitle = head.subtitle.map(key => {
      const field = this.headField(key);
      const value = this.changed?.has?.(key) ? this.changed.get(key) : field?.value;
      const text = field ? (0,_js_history_js__WEBPACK_IMPORTED_MODULE_17__.valueText)(field, value, this.viewHost) : "";
      return text ? {
        key,
        text
      } : null;
    }).filter(Boolean);
    let status = null;
    const stage = head.status ? this.headField(head.status) : null;

    if (stage) {
      const value = stage.value && typeof stage.value === "object" ? stage.value.value ?? stage.value.id : stage.value;
      const option = (stage.options ?? []).find(item => String(item?.value ?? item?.id ?? item) === String(value ?? ""));
      const text = option ? String(option.label ?? option.text ?? option.value ?? "") : (0,_js_history_js__WEBPACK_IMPORTED_MODULE_17__.valueText)(stage, stage.value, this.viewHost);
      if (text) status = {
        key: String(stage.key),
        text,
        scheme: option?.scheme ?? option?.color ?? "secondary"
      };
    }

    return {
      subtitle,
      status
    };
  }

  _writeHead(next) {
    // A 1.18.0 layer holds sections, groups and fields only.
    if (!this.configuring || !this.layerDraft || !this.hostSpeaksCardSettings || this.lockedForMe("head")) return false;
    this.layerDraft.head = {
      subtitle: next.subtitle.slice(0, 2),
      status: next.status ?? null
    }; // Drawn after the mode too, before the next read brings the host's.

    if (this.view) this.view.head = copy(this.layerDraft.head);
    this.requestComponentUpdate("view-head");
    return this.saveView();
  }

  toggleHeadSubtitle(fieldKey) {
    const head = this.viewHead;
    const key = String(fieldKey);
    const subtitle = head.subtitle.includes(key) ? head.subtitle.filter(item => item !== key) : [...head.subtitle, key].slice(-2);
    return this._writeHead({ ...head,
      subtitle
    });
  }

  setHeadStatus(fieldKey) {
    const head = this.viewHead;
    const key = fieldKey == null ? null : String(fieldKey);
    return this._writeHead({ ...head,
      status: head.status === key ? null : key
    });
  } // The field the head names, wherever it stands (hidden ones too).


  headField(key) {
    const name = String(key);

    for (const section of this.sections ?? []) {
      for (const group of section.groups ?? []) {
        for (const field of group.fields ?? []) if (String(field.key) === name) return field;
      }
    }

    return (this.unplaced ?? []).find(field => String(field.key) === name) ?? null;
  } // «Добавить поле» is structure, not view (C311 (1)): it opens the data
  // owner's field editor. The card says which collection and where; the
  // host opens its editor.


  openStructureEditor(groupKey = null) {
    const located = groupKey ? this._locateGroup(groupKey) : null;
    return this.sfEmit?.("structure", {
      collection: this.collection || null,
      section: located ? String(located.section.key) : this.selectedSection || null,
      group: groupKey ? String(groupKey) : null
    }, {
      cancelable: true
    }) ?? null;
  } // The eye of a field in «Скрытые поля» (C311 (5)): back into the open
  // tab's first area that takes fields.


  showHiddenField(fieldKey) {
    if (!this.configuring) return false;
    const sections = this.sections ?? [];
    const section = sections.find(part => String(part.key) === this.selectedSection) ?? sections[0];
    const group = (section?.groups ?? []).find(candidate => candidate.kind !== "related" && !candidate.hidden);
    if (!group) return false; // A field a layer hid comes back shown, not only placed.

    const key = String(fieldKey);
    if (this.layerDraft) this.layerDraft.fields[key] = { ...(this.layerDraft.fields[key] ?? {}),
      hidden: false
    };
    const waiting = (this.record?.unplaced ?? []).find(field => String(field.key) === key);
    if (waiting) waiting.hidden = false;
    return this.moveField(key, String(group.key), (group.fields ?? []).length);
  } // A tab's «⋯» (C311 (4), TB-1): name, icon, up, down, hide, delete, and
  // the lock for those who may write the shared layer.


  tabMenuEntries(sectionKey) {
    const at = this.sections.findIndex(section => String(section.key) === String(sectionKey));
    const section = this.sections[at];
    if (!section) return [];

    const word = key => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, key, this);

    const path = `sections.${String(section.key)}`;
    const mine = !this.lockedForMe(path);
    const entries = [{
      id: "tab-rename",
      text: word("tabRenameText"),
      icon: "edit",
      disabled: !mine
    }, {
      id: "tab-icon",
      text: word("tabIconText"),
      icon: "category",
      disabled: !mine
    }, {
      id: "tab-up",
      text: word("tabUpText"),
      icon: "arrow_upward",
      disabled: at === 0 || this.lockedForMe("sections.order")
    }, {
      id: "tab-down",
      text: word("tabDownText"),
      icon: "arrow_downward",
      disabled: at === this.sections.length - 1 || this.lockedForMe("sections.order")
    }, {
      type: "separator"
    }, {
      id: "tab-hide",
      text: word(section.hidden ? "tabShowText" : "tabHideText"),
      icon: section.hidden ? "visibility" : "visibility_off",
      disabled: !mine
    }, {
      id: "tab-delete",
      text: word("tabDeleteText"),
      icon: "delete",
      danger: true,
      disabled: !mine || this.sections.length < 2
    }];

    if (this.canWriteShared) {
      entries.push({
        type: "separator"
      });
      entries.push(this.isLocked(path) ? {
        id: "tab-lock",
        text: word("unlockText"),
        icon: "lock_open"
      } : {
        id: "tab-lock",
        text: word("lockText"),
        icon: "lock"
      });
    }

    return entries;
  }

  openTabMenu(anchor, sectionKey) {
    const key = String(sectionKey);
    return this.openStandardMenu(anchor, {
      label: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "tabMenuText", this).replace("{name}", String(this.sections.find(section => String(section.key) === key)?.label ?? key)),
      entries: this.tabMenuEntries(key),
      select: id => this.chooseTabEntry(key, id)
    });
  }

  chooseTabEntry(sectionKey, id) {
    const key = String(sectionKey);
    const at = this.sections.findIndex(section => String(section.key) === key);
    if (at < 0) return false;
    if (id === "tab-rename") return this.startRenaming("section", key);

    if (id === "tab-icon") {
      // VL-91 (SB-13): the tab already selected renders nothing new, so
      // waiting for the next render never pressed the glyph choice. The
      // choice is looked for once the menu has closed (its focus went
      // back) and again on the next frames while the section draws.
      this.selectSection(key);

      const find = () => (this.panelContent?.() ?? this).querySelector?.(`[data-icon-for="${CSS.escape(key)}"] [data-action="section-icon"] button, [data-icon-for="${CSS.escape(key)}"] [data-action="section-icon"]`);

      const press = tries => {
        const trigger = find();
        if (trigger) trigger.click?.();else if (tries > 0) requestAnimationFrame(() => press(tries - 1));
      };

      setTimeout(() => press(30), 60);
      return true;
    }

    if (id === "tab-up") return this.moveSection(key, at - 1);
    if (id === "tab-down") return this.moveSection(key, at + 1);
    if (id === "tab-hide") return this.toggleEntryHidden("section", key);
    if (id === "tab-delete") return this.removeSection(key);
    if (id === "tab-lock") return this.lockViewPath(`sections.${key}`);
    return false;
  } // A field's «⋯» in the arranging mode (C311 (2), (4)): the head's fields
  // and stage for the admin, «На вкладку …» at every width, the lock.


  fieldMenuEntries(fieldKey) {
    const key = String(fieldKey);
    const field = this.headField(key);

    const word = name => (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, name, this);

    const entries = [];
    const head = this.viewHead;

    if (this.canWriteShared && !this.lockedForMe("head")) {
      entries.push({
        id: "head-subtitle",
        text: word(head.subtitle.includes(key) ? "headSubtitleOffText" : "headSubtitleOnText"),
        icon: "title"
      });

      if (Array.isArray(field?.options) && field.options.length) {
        entries.push({
          id: "head-status",
          text: word(head.status === key ? "headStatusOffText" : "headStatusOnText"),
          icon: "label"
        });
      }
    }

    const here = this.sections.find(section => (section.groups ?? []).some(group => (group.fields ?? []).some(item => String(item.key) === key)));
    const others = this.sections.filter(section => section !== here && (section.groups ?? []).some(group => group.kind !== "related"));

    if (others.length && !this.lockedForMe(`fields.${key}.group`)) {
      if (entries.length) entries.push({
        type: "separator"
      });

      for (const section of others) {
        entries.push({
          id: `to-tab:${String(section.key)}`,
          text: word("toTabText").replace("{name}", String(section.label ?? section.key)),
          icon: "drive_file_move"
        });
      }
    }

    if (this.canWriteShared) {
      if (entries.length) entries.push({
        type: "separator"
      });
      const path = `fields.${key}.hidden`;
      entries.push(this.isLocked(path) ? {
        id: "field-lock",
        text: word("unlockText"),
        icon: "lock_open"
      } : {
        id: "field-lock",
        text: word("lockText"),
        icon: "lock"
      });
    }

    return entries;
  }

  openFieldMenu(anchor, fieldKey) {
    const key = String(fieldKey);
    const entries = this.fieldMenuEntries(key);
    if (!entries.length) return null;
    return this.openStandardMenu(anchor, {
      label: (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "fieldMenuText", this).replace("{name}", String(this.headField(key)?.label ?? key)),
      entries,
      select: id => this.chooseFieldEntry(key, id)
    });
  }

  chooseFieldEntry(fieldKey, id) {
    const key = String(fieldKey);
    const value = String(id ?? "");
    if (value === "head-subtitle") return this.toggleHeadSubtitle(key);
    if (value === "head-status") return this.setHeadStatus(key);
    if (value === "field-lock") return this.lockViewPath(`fields.${key}.hidden`);
    if (value.startsWith("to-tab:")) return this.moveFieldToSection(key, value.slice("to-tab:".length));
    return false;
  }

  _storeLayer(kind, revision, view) {
    if (!this.view) return;
    this.view.layers = { ...(this.view.layers ?? {})
    };
    this.view.layers[kind] = {
      revision,
      view: view ? copy(view) : null
    };
    this.layerDraft = this._layerCopy(kind);
  } // A reset writes nothing against the revision -- it never sends the component
  // idea of the defaults, because the host owns those and writing them would
  // overwrite them with a guess.


  async resetView() {
    if (!this.canConfigureView) return null;
    this.resetAsked = false; // Behind the same queue as a save: a reset racing a save in flight would
    // clear a layer and then store the save's revision over the cleared one.

    await (this._viewWriting ?? Promise.resolve()); // «Вернуть как у всех» clears the person's own layer and nothing else
    // (C311 (5), RC-3): it cleared the layer of the profile, the shared one
    // included. A shared reset is the picker row's, for the admin.

    const kind = this.editableLayers.includes("personal") ? "personal" : this.viewTarget;
    const epoch = ++this.viewEpoch;
    const answer = await this._raise("view.reset", {
      record_id: null,
      collection: this.collection || null,
      target: {
        kind,
        revision: this._layerRevision(kind)
      }
    }, {
      stale: () => epoch !== this.viewEpoch
    });
    if (!answer) return null;

    if (answer.answer === "applied" || answer.answer === "conflict") {
      if (answer.answer === "conflict") this.message = answer.message || this.viewConflictText;

      this._storeLayer(kind, answer.revision ?? null, null);

      this.entryErrors = new Map();
      await this.load("view-reset");
      return answer;
    }

    this._setState("error", answer.message || (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_8__.pageText)(PROPERTY_VIEW_TEXT, "viewResetFailedText", this));

    return answer;
  }

}

(0,_view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__.answerActions)(SfPropertyView, _component_json__WEBPACK_IMPORTED_MODULE_3__);
(0,_view_common_manifest_actions_js__WEBPACK_IMPORTED_MODULE_2__.settingSetters)(SfPropertyView, _component_json__WEBPACK_IMPORTED_MODULE_3__);
SfPropertyView.define("sf-view-properties");

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "844bdc4d24eb"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONDITION_OPS: () => (/* binding */ CONDITION_OPS),
/* harmony export */   evaluateCondition: () => (/* binding */ evaluateCondition),
/* harmony export */   fieldConditions: () => (/* binding */ fieldConditions)
/* harmony export */ });
// A field's conditions (port 1.14.0, Larena 2026-10-23): when it is shown,
// required and enabled, each a condition over the other fields' values as they
// stand on screen -- what the record holds, or what the person has changed it to
// and not saved yet. Plain functions, no rendering: the component evaluates them
// on every render, so a field appears the moment the value it waits for is
// chosen, and the contract test runs them without a DOM.
//
// The grammar is the port's, and small on purpose:
//
//   {field, op, value}   op: eq, ne, in, not_in (value a list), empty, not_empty
//   {all: [...]}         every condition holds
//   {any: [...]}         at least one holds
//   {not: {...}}         the condition does not hold
//
// Nothing in the Framework had a condition grammar to reuse: the data view's
// filters are the host's query, not a predicate the component runs.
const CONDITION_OPS = Object.freeze(["eq", "ne", "in", "not_in", "empty", "not_empty"]); // A value is compared by what it is, not by how it is shown: a lookup's
// {value, label} and a formatted {value, text} by their `value`. Text on both
// sides, because a host sends 5 in one place and "5" in another and means the
// same thing by both.

const scalar = value => value && typeof value === "object" && !Array.isArray(value) && "value" in value ? value.value : value; // What a field holds, as a list: a multiple field is a list already, a single
// one is a list of one, and nothing -- null, an empty string, an empty list --
// is a list of none.


const itemsOf = value => (Array.isArray(value) ? value : [value]).map(scalar).filter(item => item !== null && item !== undefined && item !== "").map(item => String(item)); // True or false, or null for a condition that cannot be read: an unknown op, a
// node with no conditions, a list where a list belongs and is missing. A
// condition nobody can read leaves the field as the host declared it rather
// than hiding it -- a field lost to a typo in a condition is a value a person
// can no longer see or change.


function evaluateCondition(condition, values) {
  if (!condition || typeof condition !== "object" || Array.isArray(condition)) return null;

  for (const node of ["all", "any"]) {
    if (!(node in condition)) continue;
    const list = condition[node];
    if (!Array.isArray(list) || !list.length) return null;
    const results = list.map(item => evaluateCondition(item, values));
    if (results.includes(null)) return null;
    return node === "all" ? results.every(Boolean) : results.some(Boolean);
  }

  if ("not" in condition) {
    const inner = evaluateCondition(condition.not, values);
    return inner === null ? null : !inner;
  }

  if (typeof condition.field !== "string" || !CONDITION_OPS.includes(condition.op)) return null; // A field the record does not carry holds nothing.

  const held = itemsOf(values.get(condition.field));
  if (condition.op === "empty") return held.length === 0;
  if (condition.op === "not_empty") return held.length > 0;

  if (condition.op === "eq" || condition.op === "ne") {
    // A list (a multiple field) is equal when any of its items is.
    const hit = held.includes(String(scalar(condition.value)));
    return condition.op === "eq" ? hit : !hit;
  }

  if (!Array.isArray(condition.value)) return null;
  const wanted = condition.value.map(item => String(scalar(item)));
  const hit = held.some(item => wanted.includes(item));
  return condition.op === "in" ? hit : !hit;
} // What a field's `when` decides, given the values on screen. A part the field
// does not condition, or conditions unreadably, is what the field declares:
// shown, required as `required` says, enabled unless `readonly`.

function fieldConditions(field, values) {
  const when = field?.when && typeof field.when === "object" ? field.when : null;

  const decide = key => when && key in when ? evaluateCondition(when[key], values) : null;

  const visible = decide("visible");
  const required = decide("required");
  const enabled = decide("enabled");
  return {
    visible: visible ?? true,
    required: required ?? field?.required === true,
    enabled: enabled ?? true
  };
}

/***/ },

/***/ "f44b979883f0"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   add: () => (/* binding */ add),
/* harmony export */   compare: () => (/* binding */ compare),
/* harmony export */   decimalString: () => (/* binding */ decimalString),
/* harmony export */   editableDecimal: () => (/* binding */ editableDecimal),
/* harmony export */   formatDecimal: () => (/* binding */ formatDecimal),
/* harmony export */   fractionDigits: () => (/* binding */ fractionDigits),
/* harmony export */   multiply: () => (/* binding */ multiply),
/* harmony export */   readDecimal: () => (/* binding */ readDecimal),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   share: () => (/* binding */ share),
/* harmony export */   toDecimal: () => (/* binding */ toDecimal)
/* harmony export */ });
// Decimal numbers as strings, never as floats (Larena property types standard,
// notes of 2026-11-03: «Arithmetic is on decimal digits, never on floats»;
// «Never a float on the wire»). A money amount, a percent and every cell a row
// computes are read, multiplied, summed and rounded here on BigInt units, so
// 0.1 + 0.2 is 0.3 and 2 499,99 stays 2 499,99 however many rows add up to it.
//
// A decimal is {units, scale}: the value is units / 10^scale. The canonical
// string has an optional minus, the integer digits without leading zeros and
// the fraction digits as written ("1500.50", "0.5", "-3"); "-0" is "0".
const TYPED = /^([+-]?)(\d*)(?:[.,](\d*))?$/u; // Spaces a person or a formatter puts between groups of digits: the plain
// space, the no-break space and the narrow no-break space ru-RU writes.

const GROUP_SPACES = /[\s   ']/gu;
/**
 * What a person typed, read as a decimal: `{ok: true, value}` with the
 * canonical string (null for nothing typed), or `{ok: false}` for text that is
 * not a number. A comma and a point both separate the fraction; spaces between
 * groups go.
 */

function readDecimal(text) {
  if (text === null || typeof text === 'undefined') return {
    ok: true,
    value: null
  };

  if (typeof text === 'number') {
    // A JSON integer is taken as its digits (property types standard §5); a
    // float is not a decimal and is refused rather than guessed at.
    return Number.isSafeInteger(text) ? {
      ok: true,
      value: String(text)
    } : {
      ok: false
    };
  }

  const plain = String(text).replace(GROUP_SPACES, '');
  if (plain === '') return {
    ok: true,
    value: null
  };
  const match = TYPED.exec(plain);
  if (!match) return {
    ok: false
  };
  const [, sign, whole, fraction] = match;
  if (whole === '' && (fraction ?? '') === '') return {
    ok: false
  };
  const integer = whole.replace(/^0+(?=\d)/u, '') || '0';
  const digits = fraction ?? '';
  const zero = /^0*$/u.test(integer + digits);
  const value = `${sign === '-' && !zero ? '-' : ''}${integer}${digits ? `.${digits}` : ''}`;
  return {
    ok: true,
    value
  };
}
/** The decimal of a canonical string or a JSON integer, or null. */

function toDecimal(value) {
  if (value && typeof value === 'object' && typeof value.units === 'bigint') return value;
  const read = readDecimal(value);
  if (!read.ok || read.value === null) return null;
  const negative = read.value.startsWith('-');
  const [whole, fraction = ''] = read.value.replace('-', '').split('.');
  const units = BigInt(whole + fraction) * (negative ? -1n : 1n);
  return {
    units,
    scale: fraction.length
  };
}
/** How many digits a decimal string has after its point. */

function fractionDigits(value) {
  const read = readDecimal(value);
  if (!read.ok || read.value === null) return 0;
  const at = read.value.indexOf('.');
  return at === -1 ? 0 : read.value.length - at - 1;
}
const POWERS = new Map();

const power = n => {
  if (!POWERS.has(n)) POWERS.set(n, 10n ** BigInt(n));
  return POWERS.get(n);
};

function rescale(decimal, scale) {
  return decimal.scale === scale ? decimal : {
    units: decimal.units * power(scale - decimal.scale),
    scale
  };
}

function multiply(a, b) {
  return {
    units: a.units * b.units,
    scale: a.scale + b.scale
  };
}
function add(a, b) {
  const scale = Math.max(a.scale, b.scale);
  return {
    units: rescale(a, scale).units + rescale(b, scale).units,
    scale
  };
}
/** A share: 20 percent is 0.2 (property types standard, rows: «A percent operand counts as its share»). */

function share(decimal) {
  return {
    units: decimal.units,
    scale: decimal.scale + 2
  };
}
/** Rounded half away from zero to `scale` digits after the point. */

function round(decimal, scale) {
  if (decimal.scale <= scale) return rescale(decimal, scale);
  const divisor = power(decimal.scale - scale);
  const negative = decimal.units < 0n;
  const magnitude = negative ? -decimal.units : decimal.units;
  let units = magnitude / divisor;
  if (magnitude % divisor * 2n >= divisor) units += 1n;
  return {
    units: negative ? -units : units,
    scale
  };
}
function compare(a, b) {
  const scale = Math.max(a.scale, b.scale);
  const left = rescale(a, scale).units;
  const right = rescale(b, scale).units;
  return left === right ? 0 : left < right ? -1 : 1;
}
/** The canonical string of a decimal, with exactly its scale's digits after the point. */

function decimalString(decimal) {
  const negative = decimal.units < 0n;
  const digits = (negative ? -decimal.units : decimal.units).toString().padStart(decimal.scale + 1, '0');
  const whole = decimal.scale ? digits.slice(0, -decimal.scale) : digits;
  const fraction = decimal.scale ? digits.slice(-decimal.scale) : '';
  const zero = decimal.units === 0n;
  return `${negative && !zero ? '-' : ''}${whole}${fraction ? `.${fraction}` : ''}`;
} // The separators of a locale, read once from Intl and kept: a decimal is
// formatted from its digits, so no amount passes through a float to be shown.

const SEPARATORS = new Map();

function separators(locale) {
  if (!SEPARATORS.has(locale)) {
    let group = ' ';
    let point = '.';

    try {
      for (const part of new Intl.NumberFormat(locale).formatToParts(12345.6)) {
        if (part.type === 'group') group = part.value;
        if (part.type === 'decimal') point = part.value;
      }
    } catch {// An unknown locale keeps the defaults.
    }

    SEPARATORS.set(locale, {
      group,
      point
    });
  }

  return SEPARATORS.get(locale);
}
/**
 * A decimal string as a person reads it in `locale`: groups of three, the
 * locale's point, and at least `minFraction` digits after it («1 500,50»).
 * Groups start at four digits, as the standard reads money («1 500,50 ₽»).
 */


function formatDecimal(value, locale, {
  minFraction = 0
} = {}) {
  const decimal = toDecimal(value);
  if (!decimal) return '';
  const text = decimalString(decimal.scale < minFraction ? rescale(decimal, minFraction) : decimal);
  const negative = text.startsWith('-');
  const [whole, fraction] = text.replace('-', '').split('.');
  const {
    group,
    point
  } = separators(locale);
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/gu, group);
  return `${negative ? '−' : ''}${grouped}${fraction ? `${point}${fraction}` : ''}`;
}
/** A decimal string as typed in an input: the locale's point, no groups («1500,5»). */

function editableDecimal(value, locale) {
  const read = readDecimal(value);
  if (!read.ok || read.value === null) return '';
  return read.value.replace('.', separators(locale).point);
}

/***/ },

/***/ "62c5c417c97d"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderFieldValue: () => (/* binding */ renderFieldValue)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("06a40de06677");
/* harmony import */ var _set_fields_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("db94c32f22be");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__, _set_fields_js__WEBPACK_IMPORTED_MODULE_2__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__, _set_fields_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__);


 // One field's value, shown or edited, drawn by the SIMAI Framework field
// renderers. Moved out of the record component's template (sf-view-properties
// 1.10.0) so that every view of the set that draws a field draws it the same
// way: sf-view-properties and sf-view-flow import this, and neither
// has field code of its own (reuse rule, naming decision 2026-11-02).
//
// `context` is what the caller's template reads:
//   component      changeField(field, value), reportFieldError(field, message),
//                  openReference(field, value); with the uploads and the
//                  picker methods when canUploadFiles / canPickRecords
//   changed        a Map of the values typed and not saved yet, by key
//   size           '1' or '1/2', the renderers' size
//   viewHost       the host the view renderers read (formatFieldValue)
//   emptyText      what an empty value reads as
//   canUploadFiles, canPickRecords   whether the host offers those

function renderFieldValue(context, field, editing, {
  disabled = false
} = {}) {
  const key = String(field.key ?? '');
  const editHost = {
    setFieldValue: (target, value) => context.component.changeField(target, value),
    // A control that knows its entry is not a value yet says so here (port
    // 1.16.0: a masked string that does not fill its mask); the view holds
    // both saves until it is completed or cleared.
    setFieldError: (target, message) => context.component.reportFieldError(target, message),
    ...(context.canUploadFiles ? {
      getFieldUploads: target => context.component.getFieldUploads(target),
      startFieldUpload: (target, items) => context.component.startFieldUpload(target, items),
      retryFieldUpload: (target, index) => context.component.retryFieldUpload(target, index)
    } : {}),
    ...(context.canPickRecords ? {
      getFieldOptionsPage: target => context.component.getFieldOptionsPage(target),
      getFieldOptionSearch: target => context.component.getFieldOptionSearch(target),
      setFieldOptionSearch: (target, text) => context.component.setFieldOptionSearch(target, text),
      loadFieldOptions: (target, request) => context.component.loadFieldOptions(target, request)
    } : {})
  }; // Money, a percent, rows and the compound fields are the set's own
  // (js/set-fields.js, Larena addendum of 2026-11-03): drawn from Framework
  // controls, with the edit host above, before the Framework renderers are
  // asked for a type they do not draw.

  const own = (0,_set_fields_js__WEBPACK_IMPORTED_MODULE_2__.renderSetField)(field, context.changed.has(key) && editing ? context.changed.get(key) : field.value, editing, editHost, {
    node: context.component,
    size: context.size,
    viewHost: context.viewHost,
    disabled
  });

  if (own !== null) {
    return own === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-empty">${context.emptyText}</span>` : own;
  } // A datetime and a time of day are the renderer set's: sf-input-date in
  // mode datetime and time, one control each (SIMAI Framework duplication
  // audit A-14). This view drew its own pair -- the day in a datepicker and
  // the time in a masked field -- which cut the day short in a half-width
  // field and held half-typed entries of its own.


  const content = editing ? (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__.renderEditField)(field, context.changed.has(key) ? context.changed.get(key) : field.value, editHost, // A field its condition turns off is drawn disabled where the set
  // draws disabled apart from read-only (a choice as buttons).
  {
    size: context.size,
    ...(disabled ? {
      disabled: true
    } : {})
  }) : (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__.renderViewField)(field, field.value, context.viewHost, {
    size: context.size
  });
  const reference = ['record', 'relation', 'user'].includes(field.propertyType || field.type) && field.value && typeof field.value === 'object';

  if (!editing && reference && content) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span
                class="sf-property-view-reference"
                @click=${event => {
      event.preventDefault(); // And no further: the field in view is a button that opens
      // the group for editing, so a press that reached it put the
      // whole group into edit behind the record that had just
      // opened (owner, 2026-10-08). Following a reference is one
      // intent, not two.

      event.stopPropagation();
      context.component.openReference(field, field.value);
    }}
        >${content}</span>`;
  } // An edit control the set cannot build is not an empty value. record and
  // relation have no editor until the picker's host methods exist, and the
  // first version showed «не заполнено» over a field that had a value -- a
  // consumer read it as the value having been lost. Fall back to the view, so
  // the value is shown and plainly not editable yet.


  if (editing && (content === null || typeof content === 'undefined' || content === lit__WEBPACK_IMPORTED_MODULE_0__.nothing)) {
    const shown = (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_1__.renderViewField)(field, field.value, context.viewHost, {
      size: context.size
    });

    if (shown !== null && typeof shown !== 'undefined' && shown !== lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-readonly color-on-surface-variant" data-readonly="true">${shown}</span>`;
    }
  }

  if (content === null || typeof content === 'undefined' || content === lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-empty">${context.emptyText}</span>`;
  }

  return content;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "eebd0e5026e8"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HISTORY_KINDS: () => (/* binding */ HISTORY_KINDS),
/* harmony export */   HISTORY_PAGE_MAX: () => (/* binding */ HISTORY_PAGE_MAX),
/* harmony export */   cellText: () => (/* binding */ cellText),
/* harmony export */   historyFromRevisions: () => (/* binding */ historyFromRevisions)
/* harmony export */ });
// The record's change history (owner decision C305 (2), RC-3; VP-18).
//
// The port: the card raises record.history {record_id, collection, cursor,
// kinds} and the host answers {answer: "applied", events, has_more, cursor}:
//
//   events    newest first, each {id, time, actor, kind, changes}
//     id        the event's id (a revision makes a good one)
//     time      ISO 8601 with its offset
//     actor     the person's name as the host resolved it, or {name, system}
//     kind      create | update | delete | restore | publish (another word is
//               read as update)
//     changes   [{field, label, before, after}] -- field is the field's key, so
//               the card draws before and after by that field's template; the
//               label is the host's when the field is not in the arrangement.
//               A field the person may not read (encrypted, closed by rights)
//               comes as {field, label, sealed: true} with no values: the card
//               says the value is hidden and draws no before or after
//   has_more  whether «Показать ещё» asks for another page
//   cursor    what the next ask carries (the oldest event's revision); absent,
//             the last event's id is sent
//
// kinds narrows the events: ["update"] is «Только изменения полей», null is
// every event. The host pages (20 by default, 50 at most); the card never asks
// for the whole history.
//
// Larena (storage 4915505, Root ee49efc9) answers this shape: newest first,
// pages of 20 (max 50), cursor = revision, labels from the version schema,
// actor a resolved name, time ISO 8601 with its zone, sealed fields as above;
// publications are not in its record versions yet (a publish filter is empty).
//
// This module holds no imports so a host (and the unit tests) can load it
// alone; js/history.js draws the values by the field templates.
//
// historyFromRevisions is the adapter for a host that stores a full snapshot
// of the values per revision (Larena: operation, created_by, created_at,
// revision): an event is the difference of two neighbouring revisions. It is
// published on the element class (SfPropertyView.historyFromRevisions) so a
// host's port answers record.history with it, and the probes and the docs'
// demo source drive the same code.
const HISTORY_KINDS = ['create', 'update', 'delete', 'restore', 'publish'];

const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null); // The largest page a host gives (Larena: 50).


const HISTORY_PAGE_MAX = 50;
/**
 * The port's answer to record.history from stored revisions. `revisions` are
 * [{revision, operation, created_by, created_at, values}] in any order; `fields`
 * the record's field descriptors (their order and labels); `cursor` the revision
 * the next page starts below (null: the newest); `kinds` null or a list of the
 * kinds to keep; `limit` the page size (50 at most); `sealed` the keys of the
 * fields the reader may not see.
 */

function historyFromRevisions(revisions, {
  fields = [],
  cursor = null,
  kinds = null,
  limit = 20,
  sealed = []
} = {}) {
  const list = (Array.isArray(revisions) ? revisions : []).filter(one => one && one.revision !== undefined && one.revision !== null).slice().sort((a, b) => Number(a.revision) - Number(b.revision));
  const order = fields.map(field => String(field.key ?? '')).filter(Boolean);
  const labels = new Map(fields.map(field => [String(field.key ?? ''), String(field.label ?? field.key ?? '')])); // Fields the reader may not see: their change is said, never their values.

  const closed = new Set((Array.isArray(sealed) ? sealed : []).map(String));
  const events = [];

  for (let at = list.length - 1; at >= 0; at -= 1) {
    const one = list[at];
    const before = at > 0 ? list[at - 1].values ?? {} : {};
    const after = one.values ?? {};
    const kind = HISTORY_KINDS.includes(one.operation) ? one.operation : 'update';
    const keys = [...new Set([...order, ...Object.keys(after), ...Object.keys(before)])];
    const changes = kind === 'update' ? keys.filter(key => !same(before[key], after[key])).map(key => closed.has(key) ? {
      field: key,
      label: labels.get(key) ?? key,
      sealed: true
    } : {
      field: key,
      label: labels.get(key) ?? key,
      before: before[key] ?? null,
      after: after[key] ?? null
    }) : [];
    if (kind === 'update' && !changes.length) continue;
    events.push({
      id: `revision-${one.revision}`,
      revision: one.revision,
      time: one.created_at ?? null,
      actor: one.created_by ?? null,
      kind,
      changes
    });
  }

  const below = cursor === null || cursor === undefined || cursor === '' ? Infinity : Number(cursor);
  const wanted = Array.isArray(kinds) && kinds.length ? new Set(kinds) : null;
  const left = events.filter(event => Number(event.revision) < below && (!wanted || wanted.has(event.kind)));
  const page = left.slice(0, Math.min(HISTORY_PAGE_MAX, Math.max(1, Number(limit) || 20)));
  const more = left.length > page.length;
  return {
    answer: 'applied',
    events: page.map(({
      revision,
      ...event
    }) => event),
    has_more: more,
    cursor: more ? String(page.at(-1).revision) : null
  };
} // A value as its template draws it in the compact place (C302: the table's
// cell, «Кратко»), read as text: sf-change takes text (C279). The compact
// template answers the host's cell shape -- a string, {component: {type,
// props}}, a link {href, text} or a list of those; a part's text is its
// props' text (a badge), else nothing (an avatar beside the name).

function cellText(shape) {
  if (shape === null || shape === undefined || shape === false) return '';
  if (typeof shape === 'string' || typeof shape === 'number') return String(shape);
  if (Array.isArray(shape)) return shape.map(cellText).filter(Boolean).join(' ');

  if (typeof shape === 'object') {
    const props = shape.component?.props ?? shape.props ?? null;
    if (shape.component && shape.component.type === 'avatar') return '';
    if (props) return String(props.text ?? props.label ?? props.value ?? '');
    return String(shape.text ?? shape.label ?? '');
  }

  return '';
}

/***/ },

/***/ "f8f76dff9bfe"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HISTORY_KINDS: () => (/* reexport safe */ _history_port_js__WEBPACK_IMPORTED_MODULE_1__.HISTORY_KINDS),
/* harmony export */   historyFromRevisions: () => (/* reexport safe */ _history_port_js__WEBPACK_IMPORTED_MODULE_1__.historyFromRevisions),
/* harmony export */   timelineItems: () => (/* binding */ timelineItems),
/* harmony export */   valueText: () => (/* binding */ valueText)
/* harmony export */ });
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("06a40de06677");
/* harmony import */ var _history_port_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("eebd0e5026e8");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_0__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_0__);


 // The record's change history drawn as sf-list-timeline items (C305 (2),
// RC-3); the port and its adapter are in js/history-port.js.

function valueText(field, value, host) {
  if (value === null || value === undefined || value === '') return '';
  const own = typeof value === 'object' ? String(value.label ?? value.name ?? value.text ?? '') : String(value);
  if (!field) return own;
  let drawn = null;

  try {
    drawn = (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_0__.renderCellField)(field, value, host);
  } catch {
    drawn = null;
  }

  const text = (0,_history_port_js__WEBPACK_IMPORTED_MODULE_1__.cellText)(drawn).replace(/\s+/gu, ' ').trim();
  return text || own;
}
/**
 * The port's events as sf-list-timeline items: the actor, the time, a title by
 * kind, and every change's before and after drawn by its field's template.
 * `words` are the card's (historyCreate…), `fieldOf(key)` finds a descriptor.
 */

function timelineItems(events, {
  words,
  fieldOf,
  host
}) {
  return (Array.isArray(events) ? events : []).filter(event => event && event.id !== undefined).map(event => {
    const kind = _history_port_js__WEBPACK_IMPORTED_MODULE_1__.HISTORY_KINDS.includes(event.kind) ? event.kind : 'update';
    const all = Array.isArray(event.changes) ? event.changes : []; // A sealed field (encrypted, closed by rights) is named, never drawn.

    const sealed = all.filter(change => change && change.sealed === true).map(change => String(change.label ?? fieldOf(String(change.field ?? ''))?.label ?? change.field ?? ''));
    const changes = all.filter(change => change && change.sealed !== true).map(change => {
      const field = fieldOf(String(change.field ?? ''));
      return {
        label: String(change.label ?? field?.label ?? change.field ?? ''),
        before: valueText(field, change.before, host),
        after: valueText(field, change.after, host)
      };
    });
    const actor = event.actor && typeof event.actor === 'object' ? event.actor : event.actor ? {
      name: String(event.actor)
    } : null;
    const count = changes.length + sealed.length;
    const title = kind === 'update' ? count === 1 ? words.historyChangedOne.replace('{field}', changes[0]?.label ?? sealed[0]) : words.historyChangedMany.replace('{n}', String(count)) : words[`history${kind[0].toUpperCase()}${kind.slice(1)}`];
    return {
      id: String(event.id),
      ...(event.time ? {
        time: String(event.time)
      } : {}),
      ...(actor ? {
        actor
      } : {}),
      title,
      ...(kind === 'delete' ? {
        status: 'error'
      } : kind === 'publish' || kind === 'restore' ? {
        status: 'success'
      } : {}),
      ...(changes.length === 1 ? {
        change: changes[0]
      } : changes.length > 1 ? {
        changes
      } : {}),
      ...(sealed.length ? {
        text: words.historySealed.replace('{fields}', sealed.join(', '))
      } : {})
    };
  });
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "d69ebe7e288e"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   currencyOf: () => (/* binding */ currencyOf),
/* harmony export */   formatMoney: () => (/* binding */ formatMoney),
/* harmony export */   moneyParts: () => (/* binding */ moneyParts),
/* harmony export */   percentText: () => (/* binding */ percentText)
/* harmony export */ });
/* harmony import */ var _decimal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f44b979883f0");
/* harmony import */ var _view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c60590f839f0");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];
/* harmony import */ var _view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1__);

 // Money and percent as a person reads them, from decimal strings, never a
// float: the currency's sign and minor units come from Intl, the digits from
// ./decimal.js. Pure, so the unit suite reads it without a browser.

const CURRENCY = new Map();
/** {sign, before, minor}: the sign a locale writes, whether before the amount, and the ISO 4217 minor units. */

function currencyOf(code, locale) {
  const id = `${code}|${locale}`;

  if (!CURRENCY.has(id)) {
    let sign = code;
    let before = false;
    let minor = 2;

    try {
      const format = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
        currencyDisplay: 'narrowSymbol'
      });
      const parts = format.formatToParts(1);
      const at = parts.findIndex(part => part.type === 'currency');
      sign = parts[at]?.value ?? code;
      before = at < parts.findIndex(part => part.type === 'integer');
      minor = format.resolvedOptions().maximumFractionDigits;
    } catch {// A code Intl does not know keeps its letters and two minor digits.
    }

    CURRENCY.set(id, {
      sign,
      before,
      minor
    });
  }

  return CURRENCY.get(id);
}
/** An amount with its currency, as a person reads it: «1 500,50 ₽», «$1,500.50». */

function formatMoney(amount, code, locale) {
  if (!code) return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.formatDecimal)(amount, locale);
  const {
    sign,
    before,
    minor
  } = currencyOf(code, locale);
  const number = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.formatDecimal)(amount, locale, {
    minFraction: minor
  });
  if (!number) return '';
  return before ? `${sign}${number}` : `${number} ${sign}`;
}
/** A money value as {amount, currency}; a field that fixes the currency takes a bare amount. */

function moneyParts(value, fixed) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      amount: value.amount ?? null,
      currency: fixed || (value.currency ?? null)
    };
  }

  if (value === null || typeof value === 'undefined' || value === '') return {
    amount: null,
    currency: fixed || null
  };
  return {
    amount: value,
    currency: fixed || null
  };
} // The set writes a percent as the SIMAI Framework's renderer does (C203 (3),
// msg-e78f2e51): the page's decimal separator and one spelling in every
// language, «12,5 %», «12.5 %». It used to read the space from Intl and wrote
// «12.5%» in English beside the renderer's «12.5 %».

function percentText(value, locale) {
  return (0,_view_common_field_decimal_js__WEBPACK_IMPORTED_MODULE_1__.formatPercent)(value, locale);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "06dfc7b3b9d9"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   REQUISITE_PARTS: () => (/* binding */ REQUISITE_PARTS),
/* harmony export */   innValid: () => (/* binding */ innValid),
/* harmony export */   ogrnValid: () => (/* binding */ ogrnValid),
/* harmony export */   requisiteErrors: () => (/* binding */ requisiteErrors)
/* harmony export */ });
// The checks of Russian requisites (Larena property types standard, notes of
// 2026-11-03, `ru.requisites@1`): each part on its own, and the parts that go
// together, together. The server checks the same and is the authority; these
// are here so a person sees a mistyped ИНН under the field instead of a refused
// save after it.
//
// Every check answers the key of the words that explain the mistake, or null.
const REQUISITE_PARTS = Object.freeze(['inn', 'kpp', 'ogrn', 'bik', 'account', 'corr_account']);

const digitsOf = text => [...text].map(Number);

const weighted = (digits, weights) => weights.reduce((sum, weight, index) => sum + weight * digits[index], 0);

function innValid(inn) {
  if (!/^\d{10}$|^\d{12}$/u.test(inn)) return false;
  const d = digitsOf(inn);
  if (inn.length === 10) return weighted(d, [2, 4, 10, 3, 5, 9, 4, 6, 8]) % 11 % 10 === d[9];
  const eleventh = weighted(d, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) % 11 % 10;
  const twelfth = weighted(d, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) % 11 % 10;
  return eleventh === d[10] && twelfth === d[11];
}
function ogrnValid(ogrn) {
  if (!/^\d{13}$|^\d{15}$/u.test(ogrn)) return false;
  const body = BigInt(ogrn.slice(0, -1));
  const modulus = ogrn.length === 13 ? 11n : 13n;
  return Number(body % modulus % 10n) === Number(ogrn.at(-1));
} // An account is checked with the БИК by the Bank of Russia key: the three
// digits that come before it, then its twenty, weighted 7, 1, 3 in turn, add up
// to a multiple of ten. A settlement account takes the БИК's last three digits;
// a correspondent account takes «0» and the БИК's fifth and sixth.

function accountKeyValid(prefix, account) {
  const digits = digitsOf(prefix + account);
  const sum = digits.reduce((total, digit, index) => total + digit * [7, 1, 3][index % 3], 0);
  return sum % 10 === 0;
}
/** The mistakes of a requisites value, part by part: {inn: 'innWrong', …}. */


function requisiteErrors(value, parts = REQUISITE_PARTS) {
  const errors = {};

  const has = part => parts.includes(part);

  const of = part => String(value?.[part] ?? '');

  const inn = of('inn');
  const kpp = of('kpp');
  const ogrn = of('ogrn');
  const bik = of('bik');
  const account = of('account');
  const corr = of('corr_account');

  if (has('inn')) {
    // The ИНН is required (the standard): a value without one is no value.
    if (!inn) errors.inn = 'innRequired';else if (!/^\d{10}$|^\d{12}$/u.test(inn)) errors.inn = 'innLength';else if (!innValid(inn)) errors.inn = 'innWrong';
  }

  const person = inn.length === 12;
  const organization = inn.length === 10;

  if (has('kpp') && kpp) {
    if (!/^\d{4}[\dA-Z]{2}\d{3}$/u.test(kpp)) errors.kpp = 'kppWrong';else if (person) errors.kpp = 'kppPerson';
  }

  if (has('ogrn') && ogrn) {
    if (!/^\d{13}$|^\d{15}$/u.test(ogrn)) errors.ogrn = 'ogrnLength';else if (!ogrnValid(ogrn)) errors.ogrn = 'ogrnWrong';else if (organization && ogrn.length !== 13) errors.ogrn = 'ogrnOrganization';else if (person && ogrn.length !== 15) errors.ogrn = 'ogrnPerson';
  }

  const bikRight = /^04\d{7}$/u.test(bik);
  if (has('bik') && bik && !bikRight) errors.bik = 'bikWrong';

  if (has('account') && account) {
    if (!/^\d{20}$/u.test(account)) errors.account = 'accountLength';else if (bikRight && !accountKeyValid(bik.slice(-3), account)) errors.account = 'accountKey';
  }

  if (has('corr_account') && corr) {
    if (!/^\d{20}$/u.test(corr)) errors.corr_account = 'accountLength';else if (!corr.startsWith('301')) errors.corr_account = 'corrStart';else if (bikRight && !accountKeyValid(`0${bik.slice(4, 6)}`, corr)) errors.corr_account = 'accountKey';
  }

  return errors;
}

/***/ },

/***/ "ebc72103d8b6"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NUMERIC: () => (/* binding */ NUMERIC),
/* harmony export */   cellDecimal: () => (/* binding */ cellDecimal),
/* harmony export */   columnCurrency: () => (/* binding */ columnCurrency),
/* harmony export */   columnOf: () => (/* binding */ columnOf),
/* harmony export */   columnsOf: () => (/* binding */ columnsOf),
/* harmony export */   computeRow: () => (/* binding */ computeRow),
/* harmony export */   rowTotals: () => (/* binding */ rowTotals),
/* harmony export */   rowsOf: () => (/* binding */ rowsOf)
/* harmony export */ });
/* harmony import */ var _decimal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f44b979883f0");
/* harmony import */ var _money_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d69ebe7e288e");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_money_js__WEBPACK_IMPORTED_MODULE_1__]);
var __webpack_async_dependencies_result__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
_money_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_async_dependencies_result__[0];

 // Rows over columns (Larena property types standard, notes of 2026-11-03,
// `items@1`): the columns as the set reads them, the computed cells of a row
// and the totals under summed columns, on decimal strings. Pure, so the unit
// suite reads it without a browser.

const NUMERIC = new Set(['integer', 'number', 'percent', 'money']); // A column as the set reads it: its settings beside its own keys, its type
// under the name the renderers address (`propertyType`).

function columnOf(column) {
  const {
    settings,
    ...own
  } = column ?? {};
  const type = own.propertyType || own.type;
  return { ...(settings && typeof settings === 'object' ? settings : {}),
    ...own,
    propertyType: type,
    type
  };
}
function columnsOf(field) {
  return (Array.isArray(field.columns) ? field.columns : []).map(columnOf).filter(column => column.key);
}
function rowsOf(value) {
  return Array.isArray(value) ? value.map(row => row && typeof row === 'object' ? row : {}) : [];
} // The decimal a numeric cell holds, or null.

function cellDecimal(column, cell) {
  if (cell === null || typeof cell === 'undefined' || cell === '') return null;
  if (column.propertyType === 'money') return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.toDecimal)((0,_money_js__WEBPACK_IMPORTED_MODULE_1__.moneyParts)(cell, column.currency).amount);
  return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.toDecimal)(cell);
} // The currency a money column's cells are in: its own, else the one money
// operand's when it is computed.

function columnCurrency(column, columns) {
  if (column.currency) return column.currency;

  if (column.compute?.of) {
    const operand = columns.find(one => column.compute.of.includes(one.key) && one.propertyType === 'money');
    return operand?.currency ?? null;
  }

  return null;
}
/**
 * A row with its computed cells worked out from the cells typed: a product of
 * two or three operands, a percent counting as its share, rounded half away
 * from zero to the currency's minor units or the column's `scale` (2 by
 * default). A computed cell whose operands are not all there is no cell. The
 * keys follow the columns, the computed ones last. The server works the same
 * out and is the authority.
 */

function computeRow(row, columns, locale = 'en') {
  const typed = {};
  const computed = {};

  for (const column of columns) {
    if (column.compute) continue;
    if (Object.hasOwn(row, column.key) && row[column.key] !== null && row[column.key] !== '') typed[column.key] = row[column.key];
  }

  for (const column of columns) {
    if (!column.compute || column.compute.op !== 'multiply' || !Array.isArray(column.compute.of)) continue;
    let product = null;
    let currency = null;

    for (const key of column.compute.of) {
      const operand = columns.find(one => one.key === key);
      const decimal = operand ? cellDecimal(operand, typed[key]) : null;

      if (!decimal) {
        product = null;
        break;
      }

      if (operand.propertyType === 'money') currency = (0,_money_js__WEBPACK_IMPORTED_MODULE_1__.moneyParts)(typed[key], operand.currency).currency;
      const factor = operand.propertyType === 'percent' ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.share)(decimal) : decimal;
      product = product ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.multiply)(product, factor) : factor;
    }

    if (!product) continue;

    if (column.propertyType === 'money') {
      const code = column.currency || currency;
      const scale = code ? (0,_money_js__WEBPACK_IMPORTED_MODULE_1__.currencyOf)(code, locale).minor : 2;
      computed[column.key] = {
        amount: (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.decimalString)((0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.round)(product, scale)),
        currency: code
      };
    } else {
      const scale = column.propertyType === 'integer' ? 0 : Number.isInteger(column.scale) ? column.scale : 2;
      computed[column.key] = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.decimalString)((0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.round)(product, scale));
    }
  }

  return { ...typed,
    ...computed
  };
}
/** The sums of the columns marked `total: "sum"`, as decimals by key. */

function rowTotals(rows, columns) {
  const totals = {};

  for (const column of columns) {
    if (column.total !== 'sum' || !NUMERIC.has(column.propertyType)) continue;
    let sum = {
      units: 0n,
      scale: 0
    };

    for (const row of rows) {
      const decimal = cellDecimal(column, row[column.key]);
      if (decimal) sum = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_0__.add)(sum, decimal);
    }

    totals[column.key] = sum;
  }

  return totals;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "db94c32f22be"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SET_FIELD_TYPES: () => (/* binding */ SET_FIELD_TYPES),
/* harmony export */   drawsSetField: () => (/* binding */ drawsSetField),
/* harmony export */   renderSetField: () => (/* binding */ renderSetField),
/* harmony export */   setFieldText: () => (/* binding */ setFieldText)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var _set_fields_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f59c8bcdc90a");
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("06a40de06677");
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("43090d1c8307");
/* harmony import */ var _decimal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("f44b979883f0");
/* harmony import */ var _money_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("d69ebe7e288e");
/* harmony import */ var _rows_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("ebc72103d8b6");
/* harmony import */ var _requisites_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("06dfc7b3b9d9");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _money_js__WEBPACK_IMPORTED_MODULE_5__, _rows_js__WEBPACK_IMPORTED_MODULE_6__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__, _core_js_page_language__WEBPACK_IMPORTED_MODULE_3__, _money_js__WEBPACK_IMPORTED_MODULE_5__, _rows_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js_page_language__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__);







 // The property types the set draws itself, beside the SIMAI Framework field
// renderers it draws every other type with (Larena addendum of 2026-11-03 to
// the general components task, msg-bf1ad4f3ae00420bb752; Larena property types
// standard, notes of 2026-11-03):
//
//   money          {amount, currency}: an amount and its ISO 4217 currency
//   percent        a decimal with a % after it
//   items          rows over the field's columns: a table editor, a card a row on a phone
//   compound       a fixed set of parts with one value object, checked together
//   ru.requisites  the compound of a Russian organisation's or person's requisites
//
// Each is drawn from Framework controls (sf-input with `text-end`, sf-dropdown,
// sf-button-icon, sf-button) and, inside a row or a compound, by the Framework
// renderers for the types they already draw. Every number is a decimal string
// (./decimal.js): nothing here writes a float.
//
// A control writes what was typed. An entry that is not a value yet -- text
// that is not a number, more digits after the point than the currency has, a
// ИНН whose control digit is wrong -- is written as typed and reported through
// setFieldError, which holds both saves while it stands (port 1.16.0, as a
// masked string does), and the control says what is wrong under itself once
// the person has left it.

const TEXT = {
  en: {
    currency: 'Currency',
    notNumber: 'Enter a number',
    fractionMax: 'At most {n} digits after the point',
    fractionNone: 'A whole amount, no digits after the point',
    chooseCurrency: 'Choose a currency',
    range: 'From {min} to {max}',
    atLeast: 'At least {min}',
    atMost: 'At most {max}',
    addRow: 'Add a row',
    removeRow: 'Remove the row',
    rowUp: 'Move the row up',
    rowDown: 'Move the row down',
    row: 'Row {n}',
    total: 'Total',
    cellsWrong: 'Some cells are not filled in correctly',
    rows: '{n} rows',
    row1: '1 row',
    inn: 'INN',
    kpp: 'KPP',
    ogrn: 'OGRN',
    bik: 'BIK',
    account: 'Account',
    corr_account: 'Correspondent account',
    innRequired: 'The INN is required',
    innLength: '10 digits for an organisation, 12 for a person',
    innWrong: 'The INN control digits do not match',
    kppWrong: 'Nine characters: four digits, two digits or letters, three digits',
    kppPerson: 'A person\'s INN has no KPP',
    ogrnLength: '13 digits (OGRN) or 15 (OGRNIP)',
    ogrnWrong: 'The control digit does not match',
    ogrnOrganization: 'An organisation has a 13-digit OGRN',
    ogrnPerson: 'A person has a 15-digit OGRNIP',
    bikWrong: 'Nine digits starting with 04',
    accountLength: '20 digits',
    accountKey: 'The account does not match the BIK',
    corrStart: 'A correspondent account starts with 301'
  },
  ru: {
    currency: 'Валюта',
    notNumber: 'Введите число',
    fractionMax: 'Не больше {n} знаков после запятой',
    fractionNone: 'Целая сумма, без знаков после запятой',
    chooseCurrency: 'Выберите валюту',
    range: 'От {min} до {max}',
    atLeast: 'Не меньше {min}',
    atMost: 'Не больше {max}',
    addRow: 'Добавить строку',
    removeRow: 'Удалить строку',
    rowUp: 'Поднять строку',
    rowDown: 'Опустить строку',
    row: 'Строка {n}',
    total: 'Итого',
    cellsWrong: 'Не все ячейки заполнены верно',
    rows: '{n} строк',
    row1: '1 строка',
    inn: 'ИНН',
    kpp: 'КПП',
    ogrn: 'ОГРН',
    bik: 'БИК',
    account: 'Расчётный счёт',
    corr_account: 'Корр. счёт',
    innRequired: 'ИНН обязателен',
    innLength: '10 цифр у организации, 12 у физлица',
    innWrong: 'Не сходятся контрольные цифры ИНН',
    kppWrong: 'Девять знаков: четыре цифры, две цифры или буквы, три цифры',
    kppPerson: 'У ИНН физлица нет КПП',
    ogrnLength: '13 цифр (ОГРН) или 15 (ОГРНИП)',
    ogrnWrong: 'Не сходится контрольная цифра',
    ogrnOrganization: 'У организации ОГРН из 13 цифр',
    ogrnPerson: 'У физлица ОГРНИП из 15 цифр',
    bikWrong: 'Девять цифр, начиная с 04',
    accountLength: '20 цифр',
    accountKey: 'Счёт не сходится с БИК',
    corrStart: 'Корр. счёт начинается с 301'
  }
};
const WORDS_OF = 'sf-view-properties';

function word(node, key, vars = {}) {
  let text = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageText)(TEXT, key, node, WORDS_OF);

  for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, String(value));

  return text;
} // ru counts: 1 строка, 2–4 строки, 5+ строк.


function rowsWord(node, count) {
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);
  if (count === 1) return word(node, 'row1');

  if (locale.startsWith('ru')) {
    const tens = count % 100;
    const ones = count % 10;
    if (ones >= 2 && ones <= 4 && (tens < 12 || tens > 14)) return `${count} строки`;
  }

  return word(node, 'rows', {
    n: count
  });
}

const SET_FIELD_TYPES = Object.freeze(['money', 'percent', 'items', 'compound', 'ru.requisites']); // --- Currencies -------------------------------------------------------------
// The currencies a money field offers when it does not fix one: the ones a
// Russian-language business meets most, and the value's own currency first
// when it is none of them. A field that fixes `currency` offers no choice.

const OFFERED_CURRENCIES = ['RUB', 'USD', 'EUR', 'CNY', 'KZT', 'BYN', 'AED', 'TRY', 'GBP', 'JPY']; // --- What a person is typing -------------------------------------------------
// The text in a decimal input while it is being typed. The value written is
// canonical («12.5»); drawn back as such it would move the caret under the
// person typing «12,50». So the typed text is kept per control and shown while
// it still reads as the value, and dropped when the control is left.

const DRAFTS = new WeakMap();

const draftsOf = node => {
  if (!DRAFTS.has(node)) DRAFTS.set(node, new Map());
  return DRAFTS.get(node);
}; // The controls a person has left: a message stands under a control only then,
// as a masked string's does.


const LEFT = new WeakMap();

const leftOf = node => {
  if (!LEFT.has(node)) LEFT.set(node, new Set());
  return LEFT.get(node);
};

const redraw = node => node?.requestComponentUpdate?.('changed');

function shownText(node, path, value, locale) {
  const draft = draftsOf(node).get(path);
  const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(value);
  if (!read.ok) return String(value ?? '');

  if (typeof draft === 'string') {
    const typed = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(draft);
    if (typed.ok && typed.value === read.value) return draft;
  }

  return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.editableDecimal)(read.value, locale);
} // The mistake of a typed decimal, or null: not a number, more digits after the
// point than allowed, outside the bounds.


function decimalError(node, raw, {
  maxFraction = null,
  min = null,
  max = null
} = {}) {
  const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(raw);
  if (!read.ok) return word(node, 'notNumber');
  if (read.value === null) return null;

  if (maxFraction !== null && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.fractionDigits)(read.value) > maxFraction) {
    return maxFraction === 0 ? word(node, 'fractionNone') : word(node, 'fractionMax', {
      n: maxFraction
    });
  }

  const value = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.toDecimal)(read.value);
  const low = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.toDecimal)(min);
  const high = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.toDecimal)(max);
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);

  if (low && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.compare)(value, low) < 0 || high && (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.compare)(value, high) > 0) {
    if (low && high) return word(node, 'range', {
      min: (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.formatDecimal)(min, locale),
      max: (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.formatDecimal)(max, locale)
    });
    return low ? word(node, 'atLeast', {
      min: (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.formatDecimal)(min, locale)
    }) : word(node, 'atMost', {
      max: (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.formatDecimal)(max, locale)
    });
  }

  return null;
}
/**
 * One decimal input: sf-input with the decimal keyboard and `text-end` (a % or
 * a currency sign). `write(text, error)` gets what was typed -- canonical when
 * it reads as a number -- and the mistake, or null.
 */


function decimalInput(node, {
  path,
  value,
  size,
  label,
  required,
  textEnd,
  placeholder,
  check,
  write
}) {
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);
  const text = shownText(node, path, value, locale);
  const error = check(text);
  const shown = error && leftOf(node).has(path) ? error : '';

  const typed = event => {
    const raw = event.target?.value ?? '';
    draftsOf(node).set(path, raw);
    const read = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(raw);
    write(read.ok ? read.value : raw, check(raw));
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-input
                class="sf-view-fields-decimal"
                size=${size}
                appearance="bordered"
                inputmode="decimal"
                value=${text}
                text-end=${textEnd || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                placeholder=${placeholder || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ?required=${Boolean(required)}
                ?invalid=${Boolean(shown)}
                error-message=${shown || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                aria-label=${label || ''}
                data-path=${path}
                @input=${typed}
                @change=${typed}
                @focusout=${() => {
    draftsOf(node).delete(path);
    leftOf(node).add(path);
    redraw(node);
  }}
        ></sf-input>
    `;
} // --- percent -------------------------------------------------------------------


function percentBounds(field) {
  // 0 and 100 when the field sets none (property types standard §2).
  return {
    min: field.min ?? '0',
    max: field.max ?? '100'
  };
}

function renderPercentEdit(field, value, host, ctx) {
  const {
    min,
    max
  } = percentBounds(field);
  return decimalInput(ctx.node, {
    path: ctx.path ?? String(field.key ?? ''),
    value,
    size: ctx.size,
    label: field.label || field.key,
    required: field.required,
    textEnd: '%',
    placeholder: field.placeholder,
    check: text => decimalError(ctx.node, text, {
      min,
      max
    }),
    write: (next, error) => {
      host.setFieldValue(field, next);
      host.setFieldError?.(field, error);
    }
  });
}

function renderPercentView(field, value, ctx) {
  const text = (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.percentText)(value, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(ctx.node));
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // --- money ---------------------------------------------------------------------


function renderMoneyEdit(field, value, host, ctx) {
  const node = ctx.node;
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);
  const path = ctx.path ?? String(field.key ?? '');
  const fixed = typeof field.currency === 'string' && field.currency ? field.currency : null;
  const parts = (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.moneyParts)(value, fixed); // A currency chosen before an amount is typed waits here: a value is an
  // amount and its currency, never a currency alone.

  const currencyPath = `${path}#currency`;
  const currency = parts.currency || draftsOf(node).get(currencyPath) || null;
  const minor = currency ? (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.currencyOf)(currency, locale).minor : null;

  const check = text => {
    const error = decimalError(node, text, {
      maxFraction: minor,
      min: field.min ?? null,
      max: field.max ?? null
    });
    if (error) return error;
    return (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(text).value !== null && !currency ? word(node, 'chooseCurrency') : null;
  };

  const write = (amount, error, code = currency) => {
    host.setFieldValue(field, amount === null ? null : {
      amount,
      currency: code
    });
    host.setFieldError?.(field, error);
  };

  const amount = decimalInput(node, {
    path,
    value: parts.amount,
    size: ctx.size,
    label: field.label || field.key,
    required: field.required,
    textEnd: fixed ? (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.currencyOf)(fixed, locale).sign : '',
    placeholder: field.placeholder,
    check,
    write
  });
  if (fixed) return amount;
  const offered = [...new Set([...(currency ? [currency] : []), ...OFFERED_CURRENCIES])];
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-view-fields-money flex gap-1/3 min-w-0">
            ${amount}
            <sf-dropdown
                    class="sf-view-fields-currency"
                    size=${ctx.size}
                    appearance="bordered"
                    mode="select"
                    search="false"
                    value=${currency ?? ''}
                    placeholder=${word(node, 'currency')}
                    aria-label=${word(node, 'currency')}
                    .options=${offered.map(code => ({
    type: 'text',
    size: '1',
    value: code,
    text: `${code} ${(0,_money_js__WEBPACK_IMPORTED_MODULE_5__.currencyOf)(code, locale).sign === code ? '' : (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.currencyOf)(code, locale).sign}`.trim(),
    selected: code === currency
  }))}
                    @change=${event => {
    const code = event.detail?.value || null;
    draftsOf(node).set(currencyPath, code);
    const typed = parts.amount;

    if (typed !== null && typed !== '') {
      const nextMinor = code ? (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.currencyOf)(code, locale).minor : null;
      const error = decimalError(node, typed, {
        maxFraction: nextMinor,
        min: field.min ?? null,
        max: field.max ?? null
      }) || (code ? null : word(node, 'chooseCurrency'));
      write((0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(typed).ok ? (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.readDecimal)(typed).value : typed, error, code);
    } else {
      redraw(node);
    }
  }}
            ></sf-dropdown>
        </span>
    `;
}

function moneyText(field, value, locale) {
  const fixed = typeof field.currency === 'string' && field.currency ? field.currency : null;
  const {
    amount,
    currency
  } = (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.moneyParts)(value, fixed);
  return amount === null ? '' : (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.formatMoney)(amount, currency, locale);
}

function renderMoneyView(field, value, ctx) {
  const text = moneyText(field, value, (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(ctx.node));
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view sf-view-fields-amount">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
} // --- number inside a row -----------------------------------------------------------
// A number cell of a row is a decimal string as a money amount is: the
// Framework's number editor writes a float, which the rows refuse. An integer
// cell is the Framework's own.


function renderDecimalEdit(field, value, host, ctx) {
  return decimalInput(ctx.node, {
    path: ctx.path ?? String(field.key ?? ''),
    value,
    size: ctx.size,
    label: field.label || field.key,
    required: field.required,
    textEnd: field.unit || '',
    placeholder: field.placeholder,
    check: text => decimalError(ctx.node, text, {
      min: field.min ?? null,
      max: field.max ?? null
    }),
    write: (next, error) => {
      host.setFieldValue(field, next);
      host.setFieldError?.(field, error);
    }
  });
}

function decimalText(field, value, locale) {
  const text = (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.formatDecimal)(value, locale);
  return text && field.unit ? `${text} ${field.unit}` : text;
} // --- items: rows over columns ------------------------------------------------------


function cellText(column, cell, columns, locale, viewHost) {
  if (cell === null || typeof cell === 'undefined' || cell === '') return null;

  switch (column.propertyType) {
    case 'money':
      {
        const {
          amount,
          currency
        } = (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.moneyParts)(cell, (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnCurrency)(column, columns));
        return amount === null ? null : (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.formatMoney)(amount, currency, locale);
      }

    case 'percent':
      return (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.percentText)(cell, locale);

    case 'number':
      return decimalText(column, cell, locale);

    default:
      {
        const shown = (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__.renderViewField)({ ...column,
          value: cell
        }, cell, viewHost, {
          size: '1'
        });
        return shown === null || shown === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? null : shown;
      }
  }
}

function totalText(column, total, columns, locale) {
  if (column.propertyType === 'money') {
    const currency = (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnCurrency)(column, columns);
    return (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.formatMoney)((0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.decimalString)(total), currency, locale);
  }

  if (column.propertyType === 'percent') return (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.percentText)((0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.decimalString)(total), locale);
  return decimalText(column, (0,_decimal_js__WEBPACK_IMPORTED_MODULE_4__.decimalString)(total), locale);
} // A column's share of the row: text widest, a yes-or-no narrowest.


function track(column) {
  switch (column.propertyType) {
    case 'boolean':
      return 'minmax(4rem, auto)';
    // Wide enough for the control's own padding, a suffix (% or a currency
    // sign) and the digits a person types: a 5.5rem percent showed «2 %» for 20.

    case 'integer':
      return 'minmax(5.5rem, 0.6fr)';

    case 'percent':
      return 'minmax(6.5rem, 0.6fr)';

    case 'number':
      return 'minmax(6.5rem, 0.7fr)';

    case 'money':
      return column.currency ? 'minmax(9rem, 0.9fr)' : 'minmax(13rem, 1.2fr)';

    case 'date':
      return 'minmax(9rem, 0.8fr)';

    case 'choice':
      return 'minmax(8rem, 1fr)';

    default:
      return 'minmax(10rem, 2fr)';
  }
}

function itemsSummary(field, rows, columns, ctx) {
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(ctx.node);
  const totals = (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.rowTotals)(rows, columns);
  const first = columns.find(column => Object.hasOwn(totals, column.key) && column.propertyType === 'money') ?? columns.find(column => Object.hasOwn(totals, column.key));
  const count = rowsWord(ctx.node, rows.length);
  return first ? `${count}, ${word(ctx.node, 'total').toLowerCase()} ${totalText(first, totals[first.key], columns, locale)}` : count;
}

function renderItemsTable(field, rows, columns, ctx, {
  editing,
  host
}) {
  const node = ctx.node;
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);
  const key = String(field.key ?? '');
  const minRows = Number.isInteger(field.minRows) ? field.minRows : 0;
  const maxRows = Number.isInteger(field.maxRows) ? field.maxRows : 1000; // Fewer rows than the field asks for are drawn as empty rows to fill in,
  // and written only once something is typed in them.

  const drawn = editing ? [...rows, ...Array.from({
    length: Math.max(0, minRows - rows.length)
  }, () => ({}))] : rows;
  const totals = (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.rowTotals)(rows, columns);
  const hasTotals = Object.keys(totals).length > 0;
  const template = `${columns.map(track).join(' ')}${editing ? ' auto' : ''}`; // Every cell's mistake, by row and column, reported as one for the field:
  // the field holds the save while any cell does.

  const errors = cellErrorsOf(node, key);

  const reportCells = () => {
    const any = [...errors.values()].some(Boolean);
    host.setFieldError?.(field, any ? word(node, 'cellsWrong') : null);
  };

  const writeRows = next => {
    const computed = next.map(row => (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.computeRow)(row, columns, locale));
    host.setFieldValue(field, computed.length ? computed : null);
  };

  const writeCell = (index, column, cell) => {
    const next = drawn.map(row => ({ ...row
    }));
    if (cell === null || typeof cell === 'undefined' || cell === '') delete next[index][column.key];else next[index][column.key] = cell;
    writeRows(next.slice(0, Math.max(rows.length, index + 1)));
  }; // Rows move: what was typed in a cell and is not a value yet goes with the
  // cell's place, so the drafts of this field are dropped.


  const reshape = next => {
    for (const path of [...draftsOf(node).keys()]) if (path.startsWith(`${key}[`)) draftsOf(node).delete(path);

    for (const path of [...leftOf(node)]) if (path.startsWith(`${key}[`)) leftOf(node).delete(path);

    errors.clear();
    reportCells();
    writeRows(next);
  };

  const cell = (row, index, column) => {
    const path = `${key}[${index}].${column.key}`;
    const value = row[column.key];

    if (!editing || column.compute || field.readonly === true || column.readonly === true) {
      const text = cellText(column, column.compute && editing ? (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.computeRow)(row, columns, locale)[column.key] : value, columns, locale, ctx.viewHost);
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-text ${column.compute ? 'color-on-surface-variant' : ''}" data-computed=${column.compute ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>${text ?? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="color-on-surface-variant">—</span>`}</span>`;
    }

    const cellField = { ...column,
      key: path,
      label: column.label || column.key,
      value
    };
    const cellHost = {
      setFieldValue: (_target, next) => writeCell(index, column, next),
      setFieldError: (_target, message) => {
        errors.set(path, message || null);
        reportCells();
      }
    };
    const cellCtx = { ...ctx,
      path
    };

    switch (column.propertyType) {
      case 'money':
        return renderMoneyEdit({ ...cellField,
          currency: column.currency
        }, value, cellHost, cellCtx);

      case 'percent':
        return renderPercentEdit(cellField, value, cellHost, cellCtx);

      case 'number':
        return renderDecimalEdit(cellField, value, cellHost, cellCtx);

      default:
        {
          const control = (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__.renderEditField)(cellField, value, cellHost, {
            size: ctx.size
          });
          return control ?? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-text">${cellText(column, value, columns, locale, ctx.viewHost) ?? '—'}</span>`;
        }
    }
  };

  const rowActions = index => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-view-items-actions flex items-cross-center gap-1/4" role="cell">
            <sf-button-icon size="1/2" appearance="ghost" scheme="on-surface-variant" icon="keyboard_arrow_up"
                    data-action="row-up" ?disabled=${index === 0 || index >= rows.length}
                    title=${word(node, 'rowUp')} aria-label=${word(node, 'rowUp')}
                    @click=${() => {
    const next = rows.slice();
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    reshape(next);
  }}></sf-button-icon>
            <sf-button-icon size="1/2" appearance="ghost" scheme="on-surface-variant" icon="keyboard_arrow_down"
                    data-action="row-down" ?disabled=${index >= rows.length - 1}
                    title=${word(node, 'rowDown')} aria-label=${word(node, 'rowDown')}
                    @click=${() => {
    const next = rows.slice();
    [next[index + 1], next[index]] = [next[index], next[index + 1]];
    reshape(next);
  }}></sf-button-icon>
            <sf-button-icon size="1/2" appearance="ghost" scheme="secondary" icon="delete"
                    data-action="row-remove" ?disabled=${drawn.length <= minRows || index >= rows.length}
                    title=${word(node, 'removeRow')} aria-label=${word(node, 'removeRow')}
                    @click=${() => reshape(rows.filter((_row, at) => at !== index))}></sf-button-icon>
        </span>
    `;

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-view-items-box">
        <span class="sf-view-items ${editing ? 'sf-view-items--edit' : ''}" data-items=${key} role="table"
              aria-label=${field.label || key} style=${`--sf-view-items-columns: ${template}`}>
            <span class="sf-view-items-head" role="row">
                ${columns.map(column => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-heading ${_rows_js__WEBPACK_IMPORTED_MODULE_6__.NUMERIC.has(column.propertyType) ? 'sf-view-items-numeric' : ''}" role="columnheader">${column.label || column.key}${editing && column.required && !column.compute ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="color-error" aria-hidden="true"> *</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>`)}
                ${editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-heading" role="columnheader"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </span>
            ${drawn.map((row, index) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <span class="sf-view-items-row" role="row" data-row=${index} aria-label=${word(node, 'row', {
    n: index + 1
  })}>
                    ${columns.map(column => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <span class="sf-view-items-cell ${_rows_js__WEBPACK_IMPORTED_MODULE_6__.NUMERIC.has(column.propertyType) ? 'sf-view-items-numeric' : ''}" role="cell" data-column=${column.key}>
                            <span class="sf-view-items-cell-label color-on-surface-variant" aria-hidden="true">${column.label || column.key}</span>
                            ${cell(row, index, column)}
                        </span>`)}
                    ${editing ? rowActions(index) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </span>`)}
            ${hasTotals && rows.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span class="sf-view-items-row sf-view-items-totals" role="row" data-totals="true">
                        ${columns.map((column, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <span class="sf-view-items-cell ${_rows_js__WEBPACK_IMPORTED_MODULE_6__.NUMERIC.has(column.propertyType) ? 'sf-view-items-numeric' : ''} ${Object.hasOwn(totals, column.key) ? '' : 'sf-view-items-cell--blank'}" role="cell" data-column=${column.key}>
                                ${Object.hasOwn(totals, column.key) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-cell-label color-on-surface-variant" aria-hidden="true">${word(node, 'total')}: ${column.label || column.key}</span><span class="sf-view-items-text sf-view-items-total">${totalText(column, totals[column.key], columns, locale)}</span>` : at === 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-view-items-text sf-view-items-total-word">${word(node, 'total')}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                            </span>`)}
                        ${editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span role="cell"></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span class="sf-view-items-foot flex items-cross-center gap-1">
                        <sf-button appearance="outline" size=${ctx.size} icon="add" text=${word(node, 'addRow')}
                                data-action="row-add" ?disabled=${drawn.length >= maxRows}
                                @click=${() => reshape([...drawn, {}])}></sf-button>
                    </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </span>
        </span>
    `;
}

const CELL_ERRORS = new WeakMap();

function cellErrorsOf(node, key) {
  if (!CELL_ERRORS.has(node)) CELL_ERRORS.set(node, new Map());
  const all = CELL_ERRORS.get(node);
  if (!all.has(key)) all.set(key, new Map());
  return all.get(key);
}

function renderItemsEdit(field, value, host, ctx) {
  return renderItemsTable(field, (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.rowsOf)(value), (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnsOf)(field), ctx, {
    editing: true,
    host
  });
}

function renderItemsView(field, value, ctx) {
  const rows = (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.rowsOf)(value);
  if (!rows.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  if (ctx.summary) return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${itemsSummary(field, rows, (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnsOf)(field), ctx)}</span>`;
  return renderItemsTable(field, rows, (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnsOf)(field), ctx, {
    editing: false,
    host: null
  });
} // --- compound: a fixed set of parts, one value --------------------------------------
// The parts of a requisites field, in the standard's order, of those the field
// names (`parts`; all six when it names none). Each is typed as digits, the КПП
// as digits and capital letters.


const REQUISITE_LENGTH = {
  inn: 12,
  kpp: 9,
  ogrn: 15,
  bik: 9,
  account: 20,
  corr_account: 20
};

function requisiteParts(field) {
  const named = Array.isArray(field.parts) ? field.parts.map(String) : _requisites_js__WEBPACK_IMPORTED_MODULE_7__.REQUISITE_PARTS;
  return _requisites_js__WEBPACK_IMPORTED_MODULE_7__.REQUISITE_PARTS.filter(part => named.includes(part));
}

function compoundParts(field) {
  return (Array.isArray(field.parts) ? field.parts : []).map(part => part && typeof part === 'object' ? { ...part,
    propertyType: part.propertyType || part.type
  } : null).filter(part => part?.key);
}

function objectOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
} // The value written: the parts in their order, an empty part no key, and
// nothing at all when every part is empty.


function compoundValue(order, value) {
  const next = {};

  for (const part of order) {
    const one = value[part];
    if (one !== null && typeof one !== 'undefined' && one !== '') next[part] = one;
  }

  return Object.keys(next).length ? next : null;
}

function renderRequisitesEdit(field, value, host, ctx) {
  const node = ctx.node;
  const key = String(field.key ?? '');
  const parts = requisiteParts(field);
  const held = objectOf(value);
  const errors = (0,_requisites_js__WEBPACK_IMPORTED_MODULE_7__.requisiteErrors)(held, parts);

  const write = (part, text) => {
    const cleaned = part === 'kpp' ? text.replace(/\s/gu, '').toUpperCase() : text.replace(/\D/gu, '');
    const next = compoundValue(parts, { ...held,
      [part]: cleaned
    });
    const mistakes = (0,_requisites_js__WEBPACK_IMPORTED_MODULE_7__.requisiteErrors)(next ?? {}, parts); // Nothing typed in a field that is not required is no mistake.

    const blank = next === null && field.required !== true;
    host.setFieldValue(field, next);
    host.setFieldError?.(field, !blank && Object.keys(mistakes).length ? word(node, mistakes[Object.keys(mistakes)[0]]) : null);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-view-fields-compound grid gap-1 w-full min-w-0" data-compound=${key}>
            ${parts.map(part => {
    const path = `${key}.${part}`;
    const left = leftOf(node).has(path);
    const blank = Object.keys(held).length === 0 && field.required !== true;
    const message = left && !blank && errors[part] ? word(node, errors[part]) : '';
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span class="sf-view-fields-part flex flex-col gap-1/4 min-w-0 ${part === 'account' || part === 'corr_account' ? 'sf-view-fields-part--wide' : ''}" data-part=${part}>
                        <span class="sf-view-fields-part-label color-on-surface-variant">${word(node, part)}${part === 'inn' && field.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="color-error" aria-hidden="true"> *</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
                        <sf-input
                                size=${ctx.size}
                                appearance="bordered"
                                inputmode=${part === 'kpp' ? 'text' : 'numeric'}
                                maxlength=${String(REQUISITE_LENGTH[part])}
                                value=${String(held[part] ?? '')}
                                ?required=${part === 'inn' && field.required === true}
                                ?invalid=${Boolean(message)}
                                error-message=${message || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                aria-label=${`${field.label || key}: ${word(node, part)}`}
                                @input=${event => write(part, String(event.target?.value ?? ''))}
                                @change=${event => write(part, String(event.target?.value ?? ''))}
                                @focusout=${() => {
      leftOf(node).add(path);
      redraw(node);
    }}
                        ></sf-input>
                    </span>`;
  })}
        </span>
    `;
}

function requisitesText(field, value, node) {
  const held = objectOf(value);
  return requisiteParts(field).filter(part => held[part]).map(part => `${word(node, part)} ${held[part]}`).join(', ');
}

function renderRequisitesView(field, value, ctx) {
  const text = requisitesText(field, value, ctx.node);
  return text ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${text}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
}

function renderCompoundEdit(field, value, host, ctx) {
  const node = ctx.node;
  const key = String(field.key ?? '');
  const parts = compoundParts(field);
  const order = parts.map(part => part.key);
  const held = objectOf(value);
  const errors = cellErrorsOf(node, key);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-view-fields-compound grid gap-1 w-full min-w-0" data-compound=${key}>
            ${parts.map(part => {
    const path = `${key}.${part.key}`;
    const partField = { ...part,
      key: path,
      label: part.label || part.key,
      readonly: field.readonly === true || part.readonly === true
    };
    const partHost = {
      setFieldValue: (_target, next) => host.setFieldValue(field, compoundValue(order, { ...held,
        [part.key]: next
      })),
      setFieldError: (_target, message) => {
        errors.set(path, message || null);
        const first = [...errors.values()].find(Boolean);
        host.setFieldError?.(field, first ?? null);
      }
    };
    const partCtx = { ...ctx,
      path
    };
    const control = SET_CONTROLS[part.propertyType]?.edit(partField, held[part.key], partHost, partCtx) ?? (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__.renderEditField)(partField, held[part.key], partHost, {
      size: ctx.size
    });
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <span class="sf-view-fields-part flex flex-col gap-1/4 min-w-0 ${part.width === 'full' ? 'sf-view-fields-part--wide' : ''}" data-part=${part.key}>
                        <span class="sf-view-fields-part-label color-on-surface-variant">${partField.label}${part.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="color-error" aria-hidden="true"> *</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</span>
                        ${control ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </span>`;
  })}
        </span>
    `;
}

function renderCompoundView(field, value, ctx) {
  const held = objectOf(value);
  const shown = compoundParts(field).filter(part => held[part.key] !== null && typeof held[part.key] !== 'undefined' && held[part.key] !== '');
  if (!shown.length) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view sf-view-fields-compound-view">${shown.map((part, at) => {
    const own = SET_CONTROLS[part.propertyType]?.view({ ...part
    }, held[part.key], ctx);
    const content = own ?? (0,_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_2__.renderViewField)({ ...part
    }, held[part.key], ctx.viewHost, {
      size: ctx.size
    }) ?? String(held[part.key]);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${at ? ', ' : ''}<span class="color-on-surface-variant">${part.label || part.key}</span> ${content}`;
  })}</span>`;
} // --- the map ---------------------------------------------------------------------


const SET_CONTROLS = {
  money: {
    edit: renderMoneyEdit,
    view: renderMoneyView
  },
  percent: {
    edit: renderPercentEdit,
    view: renderPercentView
  },
  items: {
    edit: renderItemsEdit,
    view: renderItemsView
  },
  compound: {
    edit: renderCompoundEdit,
    view: renderCompoundView
  },
  'ru.requisites': {
    edit: renderRequisitesEdit,
    view: renderRequisitesView
  }
};
/** Whether the set draws this property type itself. */

function drawsSetField(field) {
  return Object.hasOwn(SET_CONTROLS, String(field?.propertyType || field?.type || ''));
}
/**
 * A field of a type the set draws, edited or shown. `ctx` is {node, size,
 * viewHost, disabled}: the element whose page language the words follow, the
 * size on the ladder, the host's formatFieldValue, and whether a condition
 * turns the field off. A field the person may not change is shown, as the
 * Framework renderers show one.
 */

function renderSetField(field, value, editing, host, ctx) {
  const control = SET_CONTROLS[String(field.propertyType || field.type)];
  if (!control) return null;
  const formatted = !editing ? ctx.viewHost?.formatFieldValue?.(field, value) : null;
  if (typeof formatted === 'string' && formatted !== '') return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-field-view">${formatted}</span>`;

  if (editing && field.readonly !== true && ctx.disabled !== true && host?.setFieldValue) {
    return control.edit(field, value, host, ctx);
  }

  return control.view(field, value, ctx);
}
/** A field's value as one line of text: «1 500,50 ₽», «2 строки, итого 2 499,99 ₽». */

function setFieldText(field, value, node) {
  const locale = (0,_core_js_page_language__WEBPACK_IMPORTED_MODULE_3__.pageLocale)(node);

  switch (String(field?.propertyType || field?.type || '')) {
    case 'money':
      return moneyText(field, value, locale);

    case 'percent':
      return (0,_money_js__WEBPACK_IMPORTED_MODULE_5__.percentText)(value, locale);

    case 'items':
      {
        const rows = (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.rowsOf)(value);
        return rows.length ? itemsSummary(field, rows, (0,_rows_js__WEBPACK_IMPORTED_MODULE_6__.columnsOf)(field), {
          node
        }) : '';
      }

    case 'ru.requisites':
      return requisitesText(field, value, node);

    default:
      return null;
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "40b137e60526"
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderPropertyViewTemplate: () => (/* binding */ renderPropertyViewTemplate)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2a080a730149");
/* harmony import */ var lit_directives_guard_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("fc5ce1a4b1d8");
/* harmony import */ var _default_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("9e9dad7bcc09");
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("06a40de06677");
/* harmony import */ var _field_value_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("62c5c417c97d");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([lit__WEBPACK_IMPORTED_MODULE_0__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_3__, _field_value_js__WEBPACK_IMPORTED_MODULE_4__]);
([lit__WEBPACK_IMPORTED_MODULE_0__, _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_3__, _field_value_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_view_common_field_renderers_js__WEBPACK_IMPORTED_MODULE_3__);




 // The arrangement, drawn in the component's own light DOM. Not in a shadow root:
// the field controls are Smart elements whose stylesheets are document-level, and
// a document stylesheet does not cross a shadow boundary. sf-view slots its
// children for exactly this reason and says so beside the slot; the first version
// of this composite built them inside a shadow root and every control came out
// with its markup and none of its CSS.
// While the view is being configured every entry is listed, hidden and rare ones
// included: a hidden field a person cannot see is a field they cannot show again,
// and «показать редкие поля» is a reading choice rather than part of the
// arrangement being edited.

function listed(context, entries) {
  return context.configuring ? entries ?? [] : context.visible(entries);
} // The chooser names the layers this person may write and nothing else. A layer
// they may not write is drawn disabled with the host's own reason on it rather
// than left out, because a «Для всех» that is simply absent reads as a feature
// the product does not have.
// The controls of the arranging mode live in the bar at the foot (owner,
// 2026-10-08), where saving, cancelling and deleting live when a group is being
// edited: the foot is where a mode's own answers belong, and a band of them
// under the head pushed the record down by a row it did not need.
// The arranging mode (C311 (1), (5), RC-10): over the fields a bar with the
// profile picker (C163; «Вернуть как у всех» at its foot, resettable) and one
// line that says where an edit goes; at the foot the mode's answers in the
// C157 (3) order -- «Готово» first, «Сохранить для всех» for those who may
// write the shared layer when there is something of their own to publish,
// «Отменить». The picker stood in the foot, last of four, before.


function configureHint(context) {
  if (context.viewRequired) return context.word('configureRequiredHintText');
  return context.canWriteShared ? context.word('configureAdminHintText') : context.word('configurePersonalHintText');
}

function renderConfigureTop(context) {
  if (!context.canConfigureView || !context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const writable = context.editableLayers ?? [];
  const required = context.viewRequired;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-configure-top flex items-cross-center gap-1/3 flex-wrap"
             data-configuring="true" role="group" aria-label=${context.configureText}>
            <sf-profile-picker
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    data-action="view-profile"
                    label=${context.viewProfileLabel}
                    current=${context.viewProfile ?? ''}
                    ?disabled=${required}
                    ?resettable=${!required && writable.includes('personal')}
                    .profiles=${(context.viewProfiles ?? []).map(profile => ({
    id: profile.id,
    label: profile.label,
    shared: Boolean(profile.shared),
    editable: writable.includes(profile.shared ? 'shared' : 'personal') && (!profile.shared || context.canDeleteViewProfile(profile.id))
  }))}
                    .rights=${{
    create: {
      personal: !required && writable.includes('personal'),
      shared: !required && writable.includes('shared')
    }
  }}
                    @sf-profile-picker-select=${event => context.component.selectViewProfile(event.detail.id)}
                    @sf-profile-picker-create=${event => context.component.createViewProfile(event.detail.label, {
    shared: event.detail.shared
  })}
                    @sf-profile-picker-rename=${event => context.component.renameViewProfile(event.detail.id, event.detail.label)}
                    @sf-profile-picker-delete=${event => context.component.deleteViewProfile(event.detail.id)}
                    @sf-profile-picker-reset=${() => context.component.resetView()}
            ></sf-profile-picker>
            <span class="sf-property-view-configure-hint color-on-surface-variant min-w-0">${configureHint(context)}</span>
        </div>
    `;
} // A person who cannot arrange the card chooses between the views in the same
// picker, select-only, above the fields (C311 (5), the dispatcher's call on
// RC-6): no «⋯ → Вид» submenu for anyone. Nothing is made, renamed, removed
// or reset here; one view, no picker. A required view is the only one the
// host lets anyone read (Larena c311-reply): the picker shows it, disabled.


function renderViewChooser(context) {
  const profiles = context.viewProfiles ?? [];
  if (context.canConfigureView || context.configuring || profiles.length < 2) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-configure-top flex items-cross-center gap-1/3 flex-wrap" data-chooser="true">
            <sf-profile-picker
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    data-action="view-profile"
                    label=${context.viewProfileLabel}
                    current=${context.viewProfile ?? ''}
                    ?disabled=${context.viewRequired}
                    .profiles=${profiles.map(profile => ({
    id: profile.id,
    label: profile.label,
    shared: Boolean(profile.shared),
    editable: false
  }))}
                    .rights=${{
    create: {
      personal: false,
      shared: false
    }
  }}
                    @sf-profile-picker-select=${event => context.component.selectViewProfile(event.detail.id)}
            ></sf-profile-picker>
        </div>
    `;
}

function renderConfigureBar(context) {
  if (!context.canConfigureView || !context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const required = context.viewRequired; // Save model C1 (study S-B): «Сохранить» writes the draft for the person,
  // «Сохранить для всех» (who may write the shared layer, with a draft or
  // a layout of their own to publish) writes it for everyone, «Отменить»
  // drops the draft. No line says edits are saved at once (VL-93).

  const publish = context.canWriteShared && !required && (context.layerDirty || context.hasPersonalEdits);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions sf-property-view-configure-bar flex items-cross-center gap-1/3 flex-wrap"
             data-configuring="true" role="group"
             aria-label=${context.configureText}>
            <sf-button
                    appearance="default"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${context.doneConfiguringText}
                    data-action="done-configuring"
                    @click=${() => context.component.commitConfiguringView()}
            ></sf-button>
            ${publish ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button
                    appearance="outline"
                    scheme="primary"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${context.word('publishViewText')}
                    data-action="publish-view"
                    @click=${() => context.component.publishConfiguringView()}
            ></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <sf-button
                    appearance="ghost"
                    scheme="on-surface"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${required && context.requiredEdits ? context.word('undoMineText') : context.cancelConfiguringText}
                    data-action="cancel-configuring"
                    @click=${() => context.component.cancelConfiguringView()}
            ></sf-button>
        </div>
    `;
} // Width, template variant and hint sit behind the field's own settings rather
// than under every field at once. Drawn under each field they were four controls
// per row, so a group of eight fields was thirty-two controls and the
// arrangement -- the thing being edited -- could no longer be read.


function renderFieldSettings(context, field, key) {
  // The template (variant) is chosen once in the field (C302 (2), C311 (6),
  // RC-9): the card view no longer offers it.
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-popover placement="bottom-end" width="16rem" label=${context.fieldSettingsText}
                    data-settings-for=${key}>
            <sf-button-icon
                    slot="trigger"
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon="settings"
                    data-action="field-settings"
                    title=${context.fieldSettingsText}
                    aria-label=${context.fieldSettingsText}
            ></sf-button-icon>
            <div slot="content" class="flex flex-col gap-1 p-1">
                <label class="sf-property-view-settings-row sf-property-view-settings-row--stacked flex flex-col gap-1/4">
                    <span class="sf-property-view-settings-label color-on-surface-variant">${context.fieldLabelText}</span>
                    <sf-input
                            size="1/2"
                            appearance="bordered"
                            data-action="field-label"
                            aria-label=${context.fieldLabelText}
                            placeholder=${String(field.label ?? key)}
                            value=${String(field.label ?? '')}
                            @change=${event => context.component.setFieldView(key, {
    label: String(event.target?.value ?? '').trim() || null
  })}
                    ></sf-input>
                </label>
                <label class="sf-property-view-settings-row sf-property-view-settings-row--stacked flex flex-col gap-1/4">
                    <span class="sf-property-view-settings-label color-on-surface-variant">${context.hintText}</span>
                    <sf-input
                            size="1/2"
                            appearance="bordered"
                            data-action="hint"
                            aria-label=${context.hintText}
                            placeholder=${context.hintText}
                            value=${String(field.hint ?? '')}
                            @change=${event => context.component.setFieldView(key, {
    hint: event.target?.value ?? ''
  })}
                    ></sf-input>
                </label>
                <label class="sf-property-view-settings-row flex items-cross-center justify-between gap-1">
                    <span class="sf-property-view-settings-label color-on-surface-variant">${context.widthText}</span>
                    <sf-switch
                            size="1/2"
                            data-action="width"
                            ?checked=${field.width === 'full'}
                            @change=${event => context.component.setFieldView(key, {
    width: event.target?.checked ? 'full' : 'half'
  })}
                    ></sf-switch>
                </label>
            </div>
        </sf-popover>
    `;
} // The two controls a field carries while the view is arranged: taking it out of
// this area and where everything else about it lives. They sit at the end of the
// field, on the ladder the rest of the panel uses.
//
// None of them is red (owner, 2026-10-08). Red is the record's own delete, in
// the bar at the foot; a mode whose rows each carry a red mark reads as a list
// of warnings, and taking a field out of an area is an ordinary act of
// arranging that the «+» beside it undoes.
//
// Taking out rather than hiding (owner, 2026-10-07): a field removed here joins
// the unplaced, where the list behind the «+» offers it back, so removing is
// visible and undoable in the same place. Hiding is still what the port carries
// and what a shared layer does to a field for everyone -- a field hidden above
// this layer is drawn with its reason and cannot be taken out from here.


function renderFieldActions(context, field, key, {
  hidden = false
} = {}) {
  const locked = !context.canChangeVisibility(field);
  const name = String(field.label ?? key);
  const marked = context.isLocked(`fields.${key}.hidden`);
  const menu = context.fieldMenuEntries(key).length > 0; // A field a layer hid in its area (hidden: true) is shown again by the
  // same eye; one in «Скрытые поля» goes back to the open tab.

  const off = hidden || field.hidden === true;

  const show = () => hidden ? context.component.showHiddenField(key) : context.component.toggleEntryHidden('field', key); // One way to not show a field (C106 (1), C311 (5), RC-7): the eye moves it
  // to «Скрытые поля» and back. It was a cross «Убрать из области».


  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-field-actions flex items-cross-center gap-1/4">
            ${marked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-property-view-lock color-on-surface-variant" role="img"
                    data-lock=${`fields.${key}.hidden`}
                    aria-label=${context.word('lockedText')} title=${context.word('lockedText')}>lock</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon=${off ? 'visibility_off' : 'visibility'}
                    data-action=${off ? 'show-field' : 'remove-field'}
                    ?disabled=${locked}
                    title=${locked ? marked ? context.word('lockedText') : context.layerDenied('shared') || context.hiddenText : context.word(off ? 'showFieldText' : 'hideFieldText').replace('{name}', name)}
                    aria-label=${context.word(off ? 'showFieldText' : 'hideFieldText').replace('{name}', name)}
                    @click=${() => off ? show() : context.component.moveFieldToUnplaced(key)}
            ></sf-button-icon>
            ${renderFieldSettings(context, field, key)}
            ${menu ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon="more_horiz"
                    data-action="field-menu"
                    aria-haspopup="menu"
                    aria-label=${context.word('fieldMenuText').replace('{name}', name)}
                    @click=${event => context.component.openFieldMenu(event.currentTarget.querySelector('button') ?? event.currentTarget, key)}
            ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // A name that can be changed, where it stands. In the arranging mode the title
// is the control: pressing it, or the pencil beside it, turns it into a field
// with a tick and a cross -- the two answers a person has to a name they are
// typing. Nothing is written until the tick, so an area keeps its name while
// somebody is still deciding on another.


function renderEntryName(context, kind, key, label, titleClass) {
  const renaming = context.renaming?.kind === kind && context.renaming?.key === String(key);

  if (!context.configuring) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<h3 class=${titleClass}>${label}</h3>`;
  }

  if (!renaming) {
    // The pencil stands right after the name rather than at the end of the
    // row: at the end it read as another of the area's controls, and what
    // it edits is the name beside it (owner, 2026-10-08). The name takes
    // only the room it needs, and the space that was taken from it goes to
    // the spacer, which keeps the controls at the end of the row.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <h3 class=${titleClass}>
                <button type="button" class="sf-property-view-rename-trigger text-start cursor-pointer"
                        data-action="rename"
                        title=${context.renameText}
                        @click=${() => context.component.startRenaming(kind, key)}
                >${label}</button>
            </h3>
            <sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon="edit"
                    data-action="rename"
                    title=${context.renameText}
                    aria-label=${context.renameText}
                    @click=${() => context.component.startRenaming(kind, key)}
            ></sf-button-icon>
            <span class="grow"></span>
        `;
  }

  const commit = event => {
    const input = event.target?.closest?.('.sf-property-view-rename')?.querySelector('sf-input');
    context.component.renameEntry(kind, key, input?.value ?? label);
  };

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <span class="sf-property-view-rename flex items-cross-center gap-1/4 grow min-w-0">
            <sf-input
                    size="1/2"
                    appearance="bordered"
                    autofocus
                    root-class="flex-auto min-w-0"
                    data-action="rename-input"
                    aria-label=${context.renameText}
                    value=${label}
                    @keydown=${event => {
    if (event.key === 'Enter') commit(event); // Escape here leaves the naming row and nothing else: the
    // layer stack passes over a press a control took.

    if (event.key === 'Escape') {
      event.preventDefault();
      context.component.cancelRenaming();
    }
  }}
            ></sf-input>
            <sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface"
                    icon="check"
                    data-action="rename-save"
                    title=${context.saveNameText}
                    aria-label=${context.saveNameText}
                    @click=${commit}
            ></sf-button-icon>
            <sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface"
                    icon="close"
                    data-action="rename-cancel"
                    title=${context.cancelNameText}
                    aria-label=${context.cancelNameText}
                    @click=${() => context.component.cancelRenaming()}
            ></sf-button-icon>
        </span>
    `;
} // A value is a way in. Reading a record and changing it are the same screen in the
// mockup: a person presses the value and its group opens for editing, with a pen
// showing that it can be. Only a readonly field, a field already being edited and
// a field being arranged are not buttons -- each already means something else.
// What a press inside a field's value may land on that acts on its own.


const INNER_CONTROL = 'a[href], button, input, select, textarea, [role="button"], [role="link"]'; // A field read (C289 (4), C180 (3)): a row of sf-list-description's parts --
// the label in the list's label column, the value beside it from a list of
// 22rem, over it in a narrower list and on a phone. The list's sheet draws the
// row on one rung of the ladder (a one-line row is the rung's control height,
// 40 at size 1), so a property takes a row, not a card's 84 px. The value is
// the field renderers' as before; a value that opens its group for editing is
// a button of the line's height, 24 at the least (VW-7, §8.9).

function renderReadRow(context, field, sectionKey, groupKey) {
  if (field.when) field = context.conditionedField(field);
  const key = String(field.key ?? '');
  const error = context.controlErrors?.has(key) ? null : context.errors.get(key);
  const opens = !(field.readonly === true || !context.mayEdit || context.openAll);
  const quick = opens && context.quickEdit && context.isQuickField(field);
  const current = context.quick?.key === key;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-list-description-row sf-property-view-field sf-property-view-row" data-field=${key}
             data-current=${current ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             data-saved=${context.savedKeys?.has(key) ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            <dt class="sf-list-description-label sf-property-view-field-label" id=${`sf-property-view-label-${context.recordId || 'record'}-${key}`}>${String(field.label ?? key)}${field.hint ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark class="sf-list-description-help sf-property-view-hint" size=${context.size === '1/2' ? '1/3' : '1/2'}
                                         label=${String(field.hint)} text=${String(field.hint)}></sf-help-mark>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${field.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${field.inherited ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <span class="sf-property-view-inherited color-on-surface-variant">${context.inheritedText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</dt>
            <dd class="sf-list-description-value">
                <span class="sf-list-description-line">
                    ${quick ? renderQuickValue(context, field, sectionKey, groupKey) : opens ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<button
                                    type="button"
                                    class="sf-property-view-field-value sf-property-view-field-open min-w-0 text-start cursor-pointer"
                                    data-open-group=${groupKey}
                                    title=${context.editText}
                                    @click=${event => {
    const path = event.composedPath();
    const inner = path.slice(0, Math.max(0, path.indexOf(event.currentTarget)));
    if (inner.some(node => node.matches?.(INNER_CONTROL))) return; // A long field's value opens its group with the
    // focus on it (C305 (1), VP-21).

    context.component.editGroup(sectionKey, groupKey, {
      focus: key
    });
  }}
                            >${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, false)}<i class="sf-icon sf-icon--size-1/2 sf-property-view-pen" aria-hidden="true">edit</i></button>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-field-value min-w-0">${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, false)}</span>`}
                </span>
                ${error && !current ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-field-error color-error" role="alert">${error}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </dd>
        </div>
    `;
} // A field of a group edited in place in the record's list (C401, VL-64, view
// round 15): the read row's own parts -- the list's row, label and value -- with
// the field's control in the value, so «Изменить» moves no label and no row.
// The read row reserves the control's height (default.css), so the field takes
// the room the value already had.


function renderEditRow(context, field) {
  const disabled = Boolean(field.when) && context.fieldDisabled(field);
  if (field.when) field = context.conditionedField(field);
  const key = String(field.key ?? '');
  const error = context.controlErrors?.has(key) ? null : context.errors.get(key);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-list-description-row sf-property-view-field sf-property-view-row sf-property-view-row--edit" data-field=${key}>
            <div class="sf-list-description-label sf-property-view-field-label" id=${`sf-property-view-label-${context.recordId || 'record'}-${key}`}>${String(field.label ?? key)}${field.required ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-required" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}${field.hint ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark class="sf-list-description-help sf-property-view-hint" size=${context.size === '1/2' ? '1/3' : '1/2'}
                                         label=${String(field.hint)} text=${String(field.hint)}></sf-help-mark>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>
            <div class="sf-list-description-value">
                <div class="sf-property-view-field-value min-w-0 flex items-cross-center gap-2 flex-wrap">${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, true, {
    disabled
  })}</div>
                ${error ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-field-error color-error" role="alert">${error}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
        </div>
    `;
} // A short field edited in a window at its value (C305 (1), as the table's
// cell, C296): sf-popover with the value as its trigger, the field's own
// control, Save first and a quiet Cancel. One value per save -- group.save of
// the field's group with that value, the same revision and confirmation.


function renderQuickValue(context, field, sectionKey, groupKey) {
  const key = String(field.key ?? '');
  const open = context.quick?.key === key;
  const error = open ? context.errors.get(key) ?? context.conflict ?? null : null;
  const label = String(field.label ?? key);
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-popover class="sf-property-view-quick" placement="bottom-start" width="18rem"
            label=${label}
            data-quick-pop=${key}
            ?unsaved=${open && context.changed.has(key)}
            @sf-popover-open=${event => {
    if (event.target !== event.currentTarget) return;
    if (!context.component.startQuick(sectionKey, groupKey, key)) event.preventDefault?.();
  }}
            @sf-popover-close=${event => {
    if (event.target !== event.currentTarget) return;
    context.component.endQuick(key);
  }}>
        <button slot="trigger" type="button"
                class="sf-property-view-field-value sf-property-view-field-open sf-property-view-quick-value min-w-0 text-start cursor-pointer"
                data-quick=${key}
                aria-haspopup="dialog"
                aria-label=${`${label}: ${context.editText}`}
        >${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, false)}<i class="sf-icon sf-icon--size-1/2 sf-property-view-pen" aria-hidden="true">edit</i></button>
        <div slot="content" class="sf-property-view-quick-editor" data-quick-editor=${key}
             @keydown=${event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.target?.localName !== 'textarea' && !event.defaultPrevented && !event.target?.closest?.('[role="listbox"], [role="menu"], .sf-datepicker')) {
      event.preventDefault();
      context.component.saveQuick();
    }
  }}>
            <span class="sf-property-view-quick-label">${label}</span>
            ${open ? (0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, true) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${error ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-field-error color-error" role="alert">${error}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${open && context.confirmation ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-confirm
                    appearance="inline"
                    size="1/2"
                    question=${context.confirmation.text}
                    confirm-id="save"
                    accept-text=${context.confirmSaveText}
                    decline-text=${context.keepEditingText}
                    @sf-confirm-answer=${event => {
    event.preventDefault?.();
    if (event.detail?.accepted) context.component.confirmSave();else context.component.cancelConfirmation();
  }}
            ></sf-confirm>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-quick-actions">
                <sf-button size="1/2" text=${context.saveText} data-action="quick-save"
                           @click=${() => context.component.saveQuick()}></sf-button>
                <sf-button size="1/2" appearance="ghost" scheme="on-surface" text=${context.cancelText} data-action="quick-cancel"
                           @click=${() => context.component.cancelEdit()}></sf-button>
            </div>`}
        </div>
    </sf-popover>`;
}

function renderField(context, field, editing, sectionKey = '', groupKey = '') {
  // A field as its conditions make it now (port 1.14.0): required or not,
  // enabled or drawn disabled as a readonly field is. Not while the view is
  // arranged: arranging places fields, it does not fill them in.
  const disabled = !context.configuring && Boolean(field.when) && context.fieldDisabled(field);
  if (!context.configuring && field.when) field = context.conditionedField(field);
  const key = String(field.key ?? ''); // A message the field's own control draws under itself (port 1.16.0: an
  // incomplete masked string) is not drawn a second time here; it still
  // counts among the errors beside Save, and still holds the save.

  const error = context.controlErrors?.has(key) ? null : context.errors.get(key);
  const arrangementError = context.configuring ? context.entryError('field', key) : null;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-field flex flex-col gap-1 min-w-0 ${field.width === 'full' ? 'sf-property-view-field--full' : ''}"
             data-field=${key}
             data-sf-sortable-item=${context.configuring ? key : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             data-arranging=${context.configuring ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
             data-hidden=${context.configuring && field.hidden ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle
                              aria-hidden="true">drag_indicator</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <!-- Reading: the label is quieter than its value. Editing: a form
                 field's label, in the text colour with its «*» (C153 (1), (2)). -->
            <div class="sf-property-view-field-label flex items-cross-center gap-1/3 ${editing ? 'color-on-surface' : 'color-on-surface-variant'}">
                ${String(field.label ?? key)}
                ${field.required && editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-required" aria-hidden="true">*</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${field.hint // The hint is the Framework's own affordance for a hint,
  // sf-help-mark: a button that opens a short explanation on
  // a press, by touch, by pointer and by keyboard alike, and
  // announces it politely. It was a glyph carrying the words
  // in a native `title`, which needs a hover -- so on a touch
  // device the hint could not be read at all (Larena storage
  // QA, 2026-10-22). The accessible name stays the hint
  // itself, as it was on the glyph's aria-label: `label` names
  // the button, `text` is the explanation it opens.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-help-mark class="sf-property-view-hint"
                                             label=${String(field.hint)}
                                             text=${String(field.hint)}></sf-help-mark>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${field.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${field.inherited && !editing ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-inherited color-on-surface-variant">${context.inheritedText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </div>
            ${editing || context.configuring || field.readonly === true || !context.mayEdit || context.openAll ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-field-value min-w-0 flex items-cross-center gap-2 flex-wrap">${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, editing, {
    disabled
  })}</div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <button
                                type="button"
                                class="sf-property-view-field-value sf-property-view-field-open min-w-0 flex items-cross-center gap-1 text-start cursor-pointer"
                                data-open-group=${groupKey}
                                title=${context.editText}
                                @click=${event => {
    // A control inside the value -- a file's download
    // button, a URL, an address -- does its own thing
    // and nothing more: downloading a stored file also
    // opened the group for editing (simai.main,
    // 2026-10-28). sf-file-preview's download is a
    // button, not a link, so every control between the
    // press and this button counts.
    const path = event.composedPath();
    const inner = path.slice(0, Math.max(0, path.indexOf(event.currentTarget)));
    if (inner.some(node => node.matches?.(INNER_CONTROL))) return;
    context.component.editGroup(sectionKey, groupKey);
  }}
                        >
                            ${(0,_field_value_js__WEBPACK_IMPORTED_MODULE_4__.renderFieldValue)(context, field, editing)}
                            <i class="sf-icon sf-icon--size-1/2 sf-property-view-pen" aria-hidden="true">edit</i>
                        </button>`}
            ${context.configuring ? renderFieldActions(context, field, key) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${error || arrangementError ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-field-error color-error" role="alert">${error || arrangementError}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // A group of related records: the component composes a data view in it and the
// view asks the host for its own port. The records never come through the
// property-view seam -- rows, columns, sorting and paging are the data-view
// port's vocabulary, and relaying them through this one would duplicate all of it.
//
// `chrome=""` leaves out the search box and the page row: the list stands inside a
// group that already has a heading, and a page row under four rows of a capped
// list would offer paging through records the cap is not showing anyway.
//
// The table is slotted in, which is how a data view is composed -- its own page
// markup slots one too. An earlier version left it out and relied on the fallback
// inside the data view's content slot instead, to satisfy a fence that said a
// component rendering another one has to fetch it. That traded one defect for a
// worse one: fallback content lives in the shadow tree, where the Framework's
// page-level stylesheets do not reach, so a consumer got a list whose sort buttons
// read «unfold_more» as text and whose reference cells read «arrow_forward». The
// fence was right and the clever fix was wrong: this component does render a table,
// so it fetches cl-view-table.


function renderRelatedList(context, group, groupKey) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-view
                class="sf-property-view-related"
                chrome=""
                row-cap=${String(group.rowCap ?? 5)}
                port-owner="property-view"
                port-record=${context.recordId || ''}
                port-group=${groupKey}
                aria-label=${String(group.label ?? groupKey)}
        >
            <sf-view-table
                    slot="content"
                    toolbar="false"
                    aria-label=${String(group.label ?? groupKey)}
            ></sf-view-table>
        </sf-view>
    `;
} // Placing a field in this group without dragging it. Dragging is the gesture the
// mockup asks for and it stays, but it is a poor way to reach a field that is
// three screens away, and no way at all without a pointer -- and a collection
// can have hundreds of fields, which no list anybody scrolls will answer.
//
// So: a search and a set of ticks. What is ticked is what this area shows, which
// makes unticking the way a field leaves it, and each row says where the field
// is now, because a field lives in one place and taking it here takes it from
// there. The surface is anchored by hand because sf-dropdown brings its own
// trigger and the trigger here is the «+».


function renderAddField(context, groupKey) {
  const options = context.fieldChoices(groupKey).map(option => ({
    type: 'checkbox',
    size: '1/2',
    text: option.label,
    value: option.key,
    group: option.group,
    selected: option.selected,
    checked: option.selected,
    ariaLabel: option.label
  }));
  const placed = options.filter(option => option.selected).map(option => option.value); // The list is sf-dropdown's: it carries the search, the groups, the
  // multiple selection and the surface, and takes the «+» as its trigger.
  // What is acted on is the option the change names, not the whole value the
  // dropdown now holds: the component moves a field rather than setting a
  // list, and reading the whole list as the new truth once took five fields
  // out of an area because one was ticked.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                class="sf-property-view-add"
                size="1/2"
                multiple
                search="true"
                search-placeholder=${context.addFieldText}
                aria-label=${context.addFieldText}
                data-add-for=${groupKey}
                value=${placed.join(',')}
                .options=${options}
                @change=${event => {
    const key = String(event.detail?.value ?? '');
    if (!key) return;
    const values = Array.isArray(event.detail?.values) ? event.detail.values.map(String) : [];
    context.component.toggleFieldInGroup(key, groupKey, values.includes(key));
  }}
        >
            <sf-button-icon
                    slot="trigger"
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon="add"
                    data-action="add-field"
                    title=${context.addFieldText}
                    aria-label=${context.addFieldText}
            ></sf-button-icon>
        </sf-dropdown>
    `;
}

function renderGroup(context, section, group) {
  const groupKey = String(group.key ?? ''); // On a surface open all at once (edit, create) every group is open; a
  // group the host keeps closed stays shown.

  const editing = context.openAll && group.kind !== 'related' && group.editable !== false || context.editing?.group === groupKey && context.editing?.section === String(section.key ?? '');
  const fields = listed(context, group.fields);
  const configuring = context.configuring;
  const groupError = configuring ? context.entryError('group', groupKey) : null;
  const groupLocked = configuring && !context.canChangeVisibility(group); // The field list is a sortable list and nothing more: the drop is reported by
  // sf-sortable and applied or refused by the component, which is the seam that
  // mechanism already publishes. Its id carries the kind and the container, so
  // one listener can tell a field dropped into a group from a group dropped into
  // a section.
  // A group read by itself (port 1.15.0, group-load) and not read yet holds
  // no fields but says how many: it is drawn as that many skeleton lines, and
  // busy, until its read answers -- never as an empty group.

  const waiting = !Array.isArray(group.fields) || group.fields.length === 0 ? Number.isInteger(group.field_count) && group.field_count > 0 ? group.field_count : 0 : 0;
  const reading = waiting > 0 || Boolean(context.component.isGroupReading?.(groupKey)); // A group the host names '' has no head of its own (a record of one group,
  // a property shown alone): an empty heading took a row (36 px read, 29 px
  // edited) and named nothing to a screen reader. Its «Изменить», the rare
  // mark and the arranging tools still bring the head back.
  // A section of one group whose name is the section's (VRS-9, view round
  // 12): the section's tab, column row or phone screen already names it, and
  // the group's head said «Заказ» again under «Заказ». Its «Изменить» stays;
  // arranging the card still shows every head. One section alone is drawn
  // without its name, so its group keeps the title.

  const repeats = !configuring && !group.rare && (context.visible(context.sections ?? []) ?? []).length > 1 && (context.visible(section.groups ?? []) ?? []).length === 1 && String(group.label ?? groupKey).trim() === String(section.label ?? section.key ?? '').trim();
  const titled = (String(group.label ?? groupKey) !== '' || Boolean(group.rare)) && !repeats;
  const readEdit = context.mayEdit && !context.openAll && group.editable !== false;
  const cardEdit = !configuring && !editing && context.mayEdit && !context.openAll && group.kind !== 'related' && group.editable !== false; // Read, the group is a section of the record's description list: its name
  // a list section heading with «Изменить» as its action, its fields rows of
  // the list (C289 (4)). Edited, arranged or holding related records it stays
  // the card it was.

  if (!editing && !configuring && group.kind !== 'related') {
    const readRows = waiting > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${Array.from({
      length: waiting
    }, (_, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-description-row sf-property-view-row" aria-hidden="true"><dt class="sf-list-description-label"><div class="sf-skeleton sf-skeleton--animation-pulse"><div class="sf-skeleton-text sf-skeleton-text--size-1 w-2/3"></div></div></dt><dd class="sf-list-description-value"><div class="sf-skeleton sf-skeleton--animation-pulse"><div class="sf-skeleton-text sf-skeleton-text--size-1 ${SKELETON_WIDTHS[at % SKELETON_WIDTHS.length]}"></div></div></dd></div>`)}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${fields.map(field => renderReadRow(context, field, String(section.key ?? ''), groupKey))}`;
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <section class="sf-property-view-group sf-property-view-group--list" data-group=${groupKey} aria-busy=${reading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
                ${titled || readEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-description-head sf-property-view-group-header">
                    ${titled ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-description-title sf-property-view-group-title" role="heading" aria-level="3">${String(group.label ?? groupKey)}${group.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)` <span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}</div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-group-title-gap" aria-hidden="true"></span>`}
                    ${readEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-description-action"><sf-button
                                    appearance="ghost"
                                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    text=${context.editText}
                                    data-action="edit"
                                    @click=${() => context.component.editGroup(String(section.key ?? ''), groupKey)}
                            ></sf-button></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${fields.length || waiting ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<dl class="sf-list-description-part sf-property-view-group-fields" aria-label=${String(group.label ?? groupKey)}>${readRows}</dl>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </section>
        `;
  } // Edited by sf-form (C182, C305 (1); VP-19, VP-27): the label beside its
  // field wherever the record is wide, over it on a phone (owner decision
  // C401: the value turns into its field in place, the label stays at the
  // start; sf-form lays labels="start" from 40rem of its own width); «Сохранить» first, a quiet «Отмена»;
  // every field the group's whole width. The form's value and fields are
  // the edit's own (formEdit), so a render of the card never resets it.


  const form = context.formEdit;

  if (editing && !configuring && form && form.group === groupKey && form.section === String(section.key ?? '')) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <section class="sf-property-view-group sf-property-view-group--editing sf-property-view-group--form" data-group=${groupKey}>
                ${titled || readEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-description-head sf-property-view-group-header">
                    ${titled ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-description-title sf-property-view-group-title" role="heading" aria-level="3">${String(group.label ?? groupKey)}</div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-group-title-gap" aria-hidden="true"></span>`}
                    ${readEdit // The head read had, kept edited (VR14-3, view round
    // 15m): its «Изменить» stays as an unseen, inert
    // stand-in, so the rows under it do not climb by the
    // head's height when the group turns into its form.
    ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-description-action sf-property-view-group-action-kept" aria-hidden="true" inert><sf-button
                                    appearance="ghost"
                                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    text=${context.editText}
                                    tabindex="-1"
                            ></sf-button></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                <sf-form class="sf-property-view-form"
                         label=${String(group.label ?? groupKey)}
                         labels=${context.sectionsLayout === 'phone' ? 'top' : 'start'}
                         footer=${context.panel || context.sectionsLayout === 'phone' ? 'sticky' : 'static'}
                         .fields=${(0,lit_directives_guard_js__WEBPACK_IMPORTED_MODULE_1__.guard)([form], () => form.fields)}
                         .value=${(0,lit_directives_guard_js__WEBPACK_IMPORTED_MODULE_1__.guard)([form], () => form.value)}
                         @sf-form-submit=${event => context.component.submitForm(event)}
                         @sf-form-cancel=${() => context.component.cancelEdit()}
                         @sf-form-input=${event => {
      const at = context.component.fieldAt(event.detail?.key);
      if (at) context.component.changeField(at.field, event.detail?.value);
    }}
                ></sf-form>
            </section>`;
  } // Edited in the card's own form (a group sf-form does not draw: a lookup,
  // a file, a person), the group stays a part of the record's list (VL-64):
  // the read head with its «Изменить» kept as an unseen stand-in, and each
  // field a row of the list at the place it read in.


  if (editing && !configuring && !context.openAll && group.kind !== 'related' && waiting === 0) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <section class="sf-property-view-group sf-property-view-group--list sf-property-view-group--editing sf-property-view-group--in-place" data-group=${groupKey}>
                ${titled || readEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-description-head sf-property-view-group-header">
                    ${titled ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-description-title sf-property-view-group-title" role="heading" aria-level="3">${String(group.label ?? groupKey)}</div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-group-title-gap" aria-hidden="true"></span>`}
                    ${readEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-list-description-action sf-property-view-group-action-kept" aria-hidden="true" inert><sf-button
                                    appearance="ghost"
                                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    text=${context.editText}
                                    tabindex="-1"
                            ></sf-button></span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${fields.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-list-description-part sf-property-view-group-fields" role="group" aria-label=${String(group.label ?? groupKey)}>${fields.map(field => renderEditRow(context, field))}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </section>`;
  }

  const rows = waiting > 0 ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${Array.from({
    length: waiting
  }, (_, at) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-skeleton sf-skeleton--animation-pulse" aria-hidden="true">
            <div class="sf-skeleton-text sf-skeleton-text--size-1 ${SKELETON_WIDTHS[at % SKELETON_WIDTHS.length]}"></div></div>`)}` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${fields.map(field => renderField(context, field, editing, String(section.key ?? ''), groupKey))}`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <section class="sf-property-view-group ${groupSurface(context)} flex flex-col gap-2 ${editing ? 'sf-property-view-group--editing' : ''} ${group.kind === 'related' && !editing && !configuring ? 'sf-property-view-group--related' : ''}"
                 data-group=${groupKey}
                 aria-busy=${reading ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-sf-sortable-item=${configuring ? groupKey : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-hidden=${configuring && group.hidden ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                 data-columns=${group.columns === 2 ? '2' : '1'}>
            ${titled || configuring || cardEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<header class="sf-property-view-group-header flex items-cross-center justify-between gap-2">
                ${configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle
                                  aria-hidden="true">drag_indicator</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${renderEntryName(context, 'group', groupKey, String(group.label ?? groupKey), 'sf-property-view-group-title')}
                ${group.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <span class="flex items-cross-center gap-1/4">
                            ${renderAddField(context, groupKey)}
                            <sf-button-icon
                                    size="1/2"
                                    appearance="ghost"
                                    scheme="on-surface-variant"
                                    icon="keyboard_arrow_up"
                                    data-action="group-up"
                                    ?disabled=${context.groupAt(groupKey) === 0}
                                    title=${context.moveUpText}
                                    aria-label=${context.moveUpText}
                                    @click=${() => context.component.moveGroupBy(groupKey, -1)}
                            ></sf-button-icon>
                            <sf-button-icon
                                    size="1/2"
                                    appearance="ghost"
                                    scheme="on-surface-variant"
                                    icon="keyboard_arrow_down"
                                    data-action="group-down"
                                    ?disabled=${context.groupAt(groupKey) === context.groupCount - 1}
                                    title=${context.moveDownText}
                                    aria-label=${context.moveDownText}
                                    @click=${() => context.component.moveGroupBy(groupKey, 1)}
                            ></sf-button-icon>
                            <sf-button-icon
                                    size="1/2"
                                    appearance="ghost"
                                    scheme="on-surface-variant"
                                    icon=${group.hidden ? 'visibility_off' : 'delete'}
                                    data-action="remove-group"
                                    ?disabled=${groupLocked}
                                    title=${groupLocked ? context.layerDenied('shared') || context.hiddenText : context.removeGroupText}
                                    aria-label=${context.removeGroupText}
                                    @click=${() => context.component.removeGroup(groupKey)}
                            ></sf-button-icon>
                            </span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${cardEdit ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                            <sf-button
                                    appearance="ghost"
                                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                    text=${context.editText}
                                    data-action="edit"
                                    @click=${() => context.component.editGroup(String(section.key ?? ''), groupKey)}
                            ></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            </header>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${groupError ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-group-error" role="alert">${groupError}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${group.kind === 'related' ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-group-related">${renderRelatedList(context, group, groupKey)}</div>` : configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                <sf-sortable
                                        class="sf-property-view-group-fields min-w-0"
                                        group="field"
                                        accepts="field"
                                        id=${`field:${groupKey}`}
                                        label=${String(group.label ?? groupKey)}
                                >${rows}</sf-sortable>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-group-fields min-w-0">${rows}</div>`}
        </section>
    `;
} // The phone's first screen: the sections as a list, each one leading to its own
// screen. Drawn only when there is more than one, for the same reason the desktop
// list is: a list of one is a control nobody can use, and it would put a screen
// between a person and the only groups there are.


function renderPhoneSectionList(context, sections) {
  // The rows are sf-list's (C289 (5), C148 (4)): a section opens as a level
  // of the panel, «←» in its head (C157 (6)). They are the phone list's rows
  // of the size ladder whatever the card's control size, and each ends in
  // «›», the mark of a row that opens (VRS-8, view round 12): on the card's
  // size 1/2 they were 28 px control rows with nothing saying they open.
  const items = sections.map(section => ({
    id: String(section.key),
    text: String(section.label ?? section.key),
    ...(section.icon ? {
      icon: String(section.icon)
    } : {})
  }));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-list
                class="sf-property-view-phone-sections"
                label=${context.sectionsLabel}
                size="1"
                divided
                .items=${items}
                @sf-list-open=${event => {
    const id = event.detail?.id;
    if (id !== undefined && id !== null) context.component.openPhoneSection(String(id));
  }}
        ></sf-list>
    `;
} // The second screen's head: back to the list, and the name of where you are.


function renderPhoneSectionHead(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-phone-head flex items-cross-center gap-2">
            <sf-button-icon
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    appearance="ghost"
                    icon="arrow_back"
                    data-action="phone-back"
                    aria-label=${context.backLabel}
                    @click=${() => context.component.closePhoneSection()}
            ></sf-button-icon>
            <h2 class="sf-property-view-phone-title">${context.phoneSectionLabel}</h2>
        </div>
    `;
}

function renderSectionList(context, sections) {
  // One section is drawn as its groups alone: a list of one is a control nobody
  // can use, and the consumer's request asks for the groups to stand alone.
  if (sections.length < 2 && !context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Reading, the column holds one tablist, which is named itself; a landmark
  // around it would name the same list twice and call a set of panels a
  // navigation. Arranged, the column is this component's own rows.

  if (!context.configuring) {
    // C305 (3): the column is sf-menu (the C96 (5) menu column) until the
    // pair's sf-tabs judges a lone tab column by its wrapper (VP-26,
    // sf-tabs 1.4.4): this pair's vertical tabs fold any column under
    // 48rem into the line with «Ещё (n)», full screen at 1440 too.
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class="sf-property-view-sections self-cross-stretch flex flex-col min-w-0">
                ${context.sectionColumnTabs && context.sectionsLayout !== 'rail' ? renderSectionVerticalTabs(context, sections) : renderSectionMenu(context, sections)}
            </div>
        `;
  }

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <nav class="sf-property-view-sections self-cross-stretch flex flex-col min-w-0" aria-label=${context.sectionsLabel}>
            ${renderSectionTabsArranged(context, sections)}
            <div class="sf-property-view-additions flex">${renderAddSection(context)}</div>
        </nav>
    `;
} // Reading: the sections are vertical tabs (decision C96 point 5). They switch
// which of the record's parts is shown, in place -- a tablist with one selected
// tab, the same thing the row of tabs above the groups is. A tree said "one
// level of a hierarchy" and drew a folder beside a section without an icon of
// its own; a menu column (C30) is for places with their own addresses, and a
// section is not one.
//
// The items are given as data (the property), not as the `|` string the row
// uses: a section's icon travels as the entry's icon (sf-tabs reads a list as
// `{id, label, icon}` entries, released since sf-tabs 1.1.16), and a label is
// read as text, so neither `|` nor `::` in a name is taken as structure.
// `selected` names the tab by the section key, so a section added or removed
// before the selected one keeps the selection on the right tab.


function renderSectionVerticalTabs(context, sections) {
  const items = sections.map(section => ({
    id: String(section.key),
    label: sectionName(context, section),
    ...(section.icon ? {
      icon: String(section.icon)
    } : {})
  }));
  const selected = sections.some(section => String(section.key) === context.selectedSection) ? context.selectedSection : String(sections[0]?.key ?? '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-tabs
                class="sf-property-view-section-list"
                type="vertical"
                fold=${context.tabsHoldColumn ? 'never' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                selected=${selected}
                aria-label=${context.sectionsLabel}
                .items=${items}
                @sf-tabs-change=${event => {
    // sf-tabs (standard 1.3.8 §8): change carries the entry's id,
    // which is the section key.
    const id = event.detail?.selected ?? sections[Number(event.detail?.current)]?.key;
    if (id !== undefined && id !== null && id !== '') context.component.selectSection(String(id));
  }}
        ></sf-tabs>
    `;
}

function renderSectionMenu(context, sections) {
  const selected = sections.some(section => String(section.key) === context.selectedSection) ? context.selectedSection : String(sections[0]?.key ?? '');
  const items = sections.map(section => ({
    id: String(section.key),
    label: sectionName(context, section),
    href: `#${String(section.key)}`,
    current: String(section.key) === selected,
    ...(section.icon ? {
      icon: String(section.icon)
    } : {})
  }));
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-menu class="sf-property-view-section-list sf-property-view-section-menu"
                 label=${context.sectionsLabel}
                 .items=${items}
                 @sf-menu-navigate=${event => {
    event.preventDefault();
    const id = event.detail?.id ?? String(event.detail?.href ?? '').replace(/^#/u, '');
    if (id !== undefined && id !== null && id !== '') context.component.selectSection(String(id));
  }}
        ></sf-menu>
    `;
} // Arranging: the same tabs, in an order a drag can change, and each one still a
// place to drop a field or an area. Tabs cannot be reordered by a pointer --
// sf-tabs owns its tab buttons -- so while the view is arranged
// the tabs are rows of this component's own, which is also what lets a tab carry
// a handle.


function renderSectionTabsArranged(context, sections) {
  // «Вкладки» (C311 (4), TB-1): the tabs as a list with handles over the
  // fields (a column beside them on the full screen); each row selects its
  // tab, says when it is hidden or locked, and has one «⋯» with the name,
  // the icon, up and down, hide, delete and the admin's lock.
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-tabs-head flex flex-col">
            <span class="sf-property-view-tabs-title">${context.word('tabsTitle')}</span>
            <span class="sf-property-view-tabs-hint color-on-surface-variant">${context.word('tabsHintText')}</span>
        </div>
        <sf-sortable
                class="sf-property-view-section-tabs flex flex-col"
                group="section"
                accepts="section"
                id="section:all"
                label=${context.word('tabsTitle')}
        >
            ${sections.map(section => {
    const key = String(section.key);
    const locked = context.isLocked(`sections.${key}`);
    const mine = !context.lockedForMe(`sections.${key}`);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                <div class="sf-property-view-section-tab flex items-cross-center gap-1/3 min-w-0"
                     data-section-tab=${key}
                     data-sf-sortable-item=${key}
                     data-hidden=${section.hidden ? 'true' : 'false'}
                     aria-current=${key === context.selectedSection ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
                    <i class="sf-icon sf-property-view-section-grip color-on-surface-variant" data-sf-sortable-handle
                       aria-hidden="true">drag_indicator</i>
                    <button type="button"
                            class="sf-property-view-section-tab-select flex items-cross-center gap-1/3 flex-auto min-w-0 text-start cursor-pointer"
                            data-action="select-tab"
                            aria-pressed=${key === context.selectedSection ? 'true' : 'false'}
                            @click=${() => context.component.selectSection(key)}>
                        ${section.icon ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${String(section.icon)}</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        <span class="sf-property-view-section-tab-label flex-auto min-w-0">${sectionName(context, section)}</span>
                    </button>
                    ${locked ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon sf-property-view-lock color-on-surface-variant" role="img" data-lock=${`sections.${key}`}
                            aria-label=${context.word('lockedText')} title=${context.word('lockedText')}>lock</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    ${section.hidden ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon color-on-surface-variant" role="img"
                            aria-label=${context.word('tabHiddenText')} title=${context.word('tabHiddenText')}>visibility_off</i>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    <sf-button-icon
                            size="1/2"
                            appearance="ghost"
                            scheme="on-surface-variant"
                            icon="more_horiz"
                            data-action="tab-menu"
                            aria-haspopup="menu"
                            ?disabled=${!mine && !context.canWriteShared}
                            aria-label=${context.word('tabMenuText').replace('{name}', String(section.label ?? key))}
                            @click=${event => context.component.openTabMenu(event.currentTarget.querySelector('button') ?? event.currentTarget, key)}
                    ></sf-button-icon>
                </div>`;
  })}
        </sf-sortable>
    `;
} // A rare section says so in its own name. A tab takes a label string and draws
// it as text, so a trailing mark of its own is a gap in that component rather
// than something to work around here.


function sectionName(context, section) {
  const label = String(section.label ?? section.key);
  return section.rare ? `${label} · ${context.rareText}` : label;
} // The bar at the foot of the panel: what is being done to the record right now,
// and what can be done to the record itself. Arranging the view is neither, so
// while the view is being arranged there is no bar -- its own band carries that
// mode's actions, and two bars at once was the state the owner saw.
//
// The count of changed fields is gone. It named a number nobody acts on, while
// the two controls that matter stood after it; what is still said is what stops
// a save -- errors and a conflict.
// Sections as a row of tabs rather than a list beside the fields. The same
// sections either way -- what changes is where they are read, not what they are
// -- so a section is still selected the same way and a group still moves to one
// by being dropped on it.
// sf-tabs reads its set from an attribute, through a parser that splits on `|`
// and reads `::` as flags; it has no declarative way to take richer items, so a
// section's icon cannot travel with it here. A label carrying either sequence
// would be read as structure, so it is spelled out of the way.


function tabLabel(context, section) {
  return sectionName(context, section).replace(/\|/gu, '\u2502').replace(/::/gu, ':\u2236');
} // The tab row only. The groups are drawn under it by the layout, as they are
// beside the list, so a section's content is in one place whichever way the
// sections are read. Slotting empty panels in here drew empty tabs: a slot for
// a tab replaces its label.


function renderSectionTabs(context, sections) {
  const at = Math.max(0, sections.findIndex(section => String(section.key) === context.selectedSection)); // A phone's tabs scroll sideways (all names reachable, no «Ещё»), and a
  // swipe over the fields turns them (S-A 3): the press is the visible way.

  const phone = context.sectionsLayout === 'phone';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-tabs
                class="sf-property-view-tabs"
                type="underline"
                overflow=${phone ? 'scroll' : 'more'}
                ?data-phone-tabs=${phone}
                ?sticky=${context.panel}
                size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                active-index=${String(at)}
                aria-label=${context.sectionsLabel}
                items=${sections.map(section => tabLabel(context, section)).join('|')}
                @sf-tabs-change=${event => {
    const section = sections[Number(event.detail?.current)];
    if (section) context.component.selectSection(String(section.key));
  }}
        ></sf-tabs>
    `;
} // The type of a view at 1/2: a step down from 1 in every role, so the record
// reads at the table's size. Variables rather than a class: the panel is drawn
// in a drawer moved to the page's end, outside the element. The title is rung 2,
// one below the full title's rung 3, read from the text ladder: the heading-5
// role it took is a content heading, which the heading ladder (C21) moves to
// rung 1, the size of the fields under it.


function sizeStyle(context) {
  if (context.size !== '1/2') return '';
  return ' --sf-property-view--title-size: var(--sf-text--size-2); --sf-property-view--title-height: var(--sf-title--height-2);' + ' --sf-property-view--group-size: var(--sf-text-medium--size); --sf-property-view--group-height: var(--sf-text-medium--height);' + ' --sf-property-view--label-size: var(--sf-label-medium--size); --sf-property-view--label-height: var(--sf-label-medium--height);' + ' --sf-property-view--value-size: var(--sf-text-small--size); --sf-property-view--value-height: var(--sf-text-small--height);';
} // A save the host makes only once confirmed (port 1.14.0): its words, and the
// two answers, in the bar where save was pressed -- the same place and the same
// arrangement as the view's reset question. Going back sends nothing and keeps
// what was entered.


function renderConfirmation(context) {
  // The Framework's question in place (C289, C182; sf-confirm inline, C166):
  // the host's words and the two answers where Save was pressed. It was a bar
  // of this component's own.
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions sf-property-view-confirm" data-confirming="true">
            <sf-confirm
                    appearance="inline"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    question=${context.confirmation.text}
                    confirm-id="save"
                    accept-text=${context.confirmSaveText}
                    decline-text=${context.keepEditingText}
                    @sf-confirm-answer=${event => {
    event.preventDefault?.();
    if (event.detail?.accepted) context.component.confirmSave();else context.component.cancelConfirmation();
  }}
            ></sf-confirm>
        </div>
    `;
} // The foot of a surface open all at once: Create or Save, and Cancel, with
// what went wrong beside them.


function renderOpenAllBar(context) {
  if (context.confirmation) return renderConfirmation(context);
  const creating = context.mode === 'create';
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions flex items-cross-center gap-1/3 flex-wrap" role="group">
            <sf-button
                    appearance="default"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${creating ? context.createText : context.saveText}
                    data-action=${creating ? 'create' : 'save'}
                    @click=${() => context.component.saveAll()}
            ></sf-button>
            <sf-button
                    appearance="ghost"
                    scheme="on-surface"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${context.cancelText}
                    data-action="cancel"
                    @click=${() => context.component.cancelEdit()}
            ></sf-button>
            ${context.errors.size ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-errors color-error">${context.errorsText}: ${context.errors.size}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.conflict ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-conflict color-error" role="alert">${context.conflict}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // Closing (or stepping to the next record) over unsaved entries asks first
// (C159 (6)): sf-confirm in the foot, «Закрыть без сохранения» or back.


function renderLeaveAsk(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions sf-property-view-confirm" data-leaving="true">
            <sf-confirm
                    appearance="inline"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    question=${context.word('closeUnsavedText')}
                    confirm-id="leave"
                    accept-text=${context.leaveAsk.kind === 'step' ? context.word('leaveUnsavedText') : context.word('closeUnsavedAcceptText')}
                    decline-text=${context.keepEditingText}
                    @sf-confirm-answer=${event => {
    event.preventDefault?.();
    context.component.answerLeave(Boolean(event.detail?.accepted));
  }}
            ></sf-confirm>
        </div>
    `;
}

function renderActions(context, {
  panel = false
} = {}) {
  if (context.leaveAsk) return renderLeaveAsk(context); // A surface placed to show the object has no footer of its own (owner,
  // 2026-10-14): a reader sees values, not controls that would refuse.

  if (context.mode === 'view') return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  if (context.openAll) return renderOpenAllBar(context); // While the view is arranged the foot carries that mode's controls instead:
  // saving a record and arranging the view it is read in are two modes, and a
  // bar holding both would offer a save for something nobody was editing.

  if (context.configuring) return renderConfigureBar(context);
  if (context.editing && context.confirmation) return renderConfirmation(context); // A panel's foot holds the host's own actions, slotted as `footer`, and
  // the group's Save and Cancel. Deleting is a row of the head's «⋯» (C289
  // (3), C180 (2)): a foot stands for two actions or more, never for one delete.

  const hosted = panel && context.hasHostSlot('footer'); // sf-form carries its own Save and Cancel.

  const own = context.editing && !context.formEdit;
  if (!own && !hosted && !(context.editing && context.conflict)) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-actions flex items-cross-center gap-1/3 flex-wrap" role="group">
            ${own ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <sf-button
                                appearance="default"
                                size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                text=${context.saveText}
                                data-action="save"
                                @click=${() => context.component.saveGroup()}
                        ></sf-button>
                        <sf-button
                                appearance="ghost"
                                scheme="on-surface"
                                size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                                text=${context.cancelText}
                                data-action="cancel"
                                @click=${() => context.component.cancelEdit()}
                        ></sf-button>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${own && context.errors.size ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-errors color-error">${context.errorsText}: ${context.errors.size}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.conflict ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-conflict color-error" role="alert">${context.conflict}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <span class="grow"></span>
            ${hosted ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-host-footer flex flex-wrap items-cross-center gap-1/3">${context.hostSlot('footer')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
    `;
} // An unplaced field is being arranged, not read: it shows its name and a handle
// and nothing else. Drawn like a placed one it carried its value, so the area
// read as a group of fields that happen to be last rather than as the fields
// this view does not show.


function renderUnplacedField(context, field) {
  const key = String(field.key ?? '');
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-field sf-property-view-field--unplaced flex flex-col gap-1 min-w-0"
             data-field=${key}
             data-sf-sortable-item=${key}
             data-arranging="true">
            <i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle aria-hidden="true">drag_indicator</i>
            <div class="sf-property-view-field-label flex items-cross-center gap-1/3 color-on-surface-variant">
                <span class="flex-auto min-w-0">${String(field.label ?? key)}</span>
                ${field.rare ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${renderFieldActions(context, field, key, {
    hidden: true
  })}
            </div>
        </div>
    `;
} // Fields the view places nowhere. Drawn only while the view is being arranged,
// because they are not part of what a person reads -- and drawn even when there
// are none, so that dragging a field out of every group has somewhere to land
// and a person can see that taking a field out does not destroy it.


function renderUnplaced(context) {
  if (!context.configuring) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  const fields = context.unplaced; // The count beside the bin's title is a count, read and never pressed: the
  // grey tonal badge (C140 (3); accordion AC-3, tags TG-5). It was a tag in
  // the retired appearance surface.
  // The Framework's own accordion rather than a fold built here: the owner
  // asked for it by name, and a second thing that opens and closes is a
  // second thing to keep looking right (owner, 2026-10-09).
  //
  // The accordion owns whether it is open -- its script claims any
  // .sf-accordion the document gains and remembers the state -- so the panel
  // does not bind it. What the panel does instead is press the trigger when a
  // drag starts, the way a person would, and press it back when the drag
  // ends. One controller, and a drop target that is visible exactly when
  // something is in the air.
  //
  // The hint paragraph is gone: it described in two lines what the «+» beside
  // every area does, under a heading that already says what the bin is.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <article
                class="sf-accordion sf-accordion--outline sf-property-view-group--unplaced"
                data-unplaced="true"
        >
            <h3 class="sf-accordion-heading">
                <button
                        type="button"
                        class="sf-accordion-trigger"
                        data-action="toggle-unplaced"
                        aria-expanded="true"
                >
                    <span class="sf-accordion-title flex items-cross-center gap-1/3">
                        ${context.unplacedTitle}
                        ${fields.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge
                                    size="1/3"
                                    text=${String(fields.length)}
                            ></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    </span>
                    <sf-icon icon="chevron_right" size="1/2"></sf-icon>
                </button>
            </h3>
            <div class="sf-accordion-content" role="region">
                <sf-sortable
                        class="sf-property-view-group-fields sf-property-view-unplaced"
                        group="field"
                        accepts="field"
                        id=${`unplaced:${context.recordId || 'record'}`}
                        label=${context.unplacedTitle}
                >${fields.map(field => renderUnplacedField(context, field))}</sf-sortable>
            </div>
        </article>
    `;
} // The three controls a panel carries, and none of them invents anything. Close is
// the component's own business; copying and opening need an address, and the
// address is the host's -- a composite that constructed a URL would be guessing at
// the consumer's routing and would be wrong in the first consumer whose routing
// did not match the guess. No address, no two controls.
// The panel's head, as the mockup draws it: the collection on its own line above,
// then the record's name with its favourite star, the host's own actions, and a
// «⋯» for what belongs to the view rather than to the record. One block, so there
// are no empty bands between the title and the first card -- the view this replaces
// had two of about sixty pixels, which is what the owner saw first.
// What belongs to the view rather than to the record: arranging it, resetting it
// and whether the rare entries are shown. It is a menu because there is more than
// one of them; pressing «⋯» used to run the first item straight away, so the
// second never had anywhere to be.


function renderMenuControl(context) {
  const items = context.panelMenuItems;
  const host = context.hasHostSlot('menu') ? context.hostSlot('menu') : null; // The views are chosen from this menu too, so more than one of them is a
  // reason for it to stand even with nothing else in it.

  const views = !context.configuring && (context.viewProfiles?.length ?? 0) > 1;
  const record = (context.recordMenuItems?.length ?? 0) > 0 || context.canDeleteRecord;
  if (!items.length && !host && !views && !record) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing; // Always the menu, never the one item drawn in its place. The place is the
  // panel's own: what belongs in it depends on the task, and a consumer that
  // slots its items into `menu` finds the same «\u2026» wherever it looks --
  // which it could not when one item meant a different glyph in that corner
  // (owner, 2026-10-08).
  // The «⋯» opens the Framework's standard menu (owner, 2026-10-12), and so
  // do the items a host slots into `menu` (owner, 2026-10-14): they were a
  // popover of link buttons, the one menu of the panel drawn otherwise. The
  // slotted elements stay in the page, hidden, and a row of the menu stands
  // for each -- a link row for a link, a press on the element for the rest.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-button-icon
                appearance="ghost"
                scheme="on-surface"
                size=${context.panel ? '1/3' : context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                icon="more_horiz"
                data-action="menu"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label=${context.menuLabel}
                @click=${event => context.component.openPanelMenu(event.currentTarget.querySelector('button') ?? event.currentTarget)}
        ></sf-button-icon>
        ${host ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-host-menu" data-host-menu hidden>${host}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;
} // The panel has one head (C157 (6), C180 (2)): «Назад» when a level is open,
// the title on the window step (C157 (7) = C159 (5)), the star, the host's
// actions, the «⋯» and the close, the SIMAI Framework's sf-button-close (C14),
// last and inside the panel. The close stood outside on the scrim as a round
// sf-button-icon of the panel's own, and a section opened on a phone added a
// second head row «← Цены» under this one (R243 study, VP-6 and VP-7). The
// section screen of a phone is a level of the same panel: its back arrow is in
// this row and the title names the section, as a record opened from the panel
// names that record. The row's layout (a row, centred, 8 apart, the spacer
// before the host's actions) is the component's own sheet, not utilities: the
// Loader asks for a utility sheet only after the first render, so the close
// stood beside the star for ~115 ms and then jumped to the end (D1, 1.16.3).
// The row's layout is written on the row itself as well (view round 10,
// Larena L-4): the component's sheet is fetched by the Loader beside its code,
// and a page that has the code already (a bundle of its own, or a cached one)
// draws the head before that sheet arrives -- the «⋯» stood beside the star and
// moved to the end about half a second later. With the row a flex line and the
// spacer growing from the first frame, the end controls stand where they end.
// The band's own edges too: it takes back the drawer's gutter and sets its
// row on the panel's axis (the sheet's two tokens, with the same reading of the
// drawer's gutter and scroll room where the sheet has not declared them yet), so
// the «⋯» and the close end where they end, not a scroll room further out.
// Values are the Framework's (core.css) and the drawer's, the same as the sheet's.


const TITLE_ROW_STYLE = 'display: flex; align-items: center; gap: var(--sf-space-1\\/3); min-inline-size: 0;' + ' min-block-size: calc(var(--sf-ui-2--control-height) - var(--sf-px))'; // The title's box as the sheet sets it (the window step, one line), so the star
// beside it does not move when the sheet comes.

const TITLE_STYLE = 'margin: 0; min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700;' + ' font-size: var(--sf-property-view--title-size, var(--sf-drawer--title-size, var(--sf-heading-4--size)));' + ' line-height: var(--sf-property-view--title-height, var(--sf-drawer--title-height, var(--sf-heading-4--height)))';
const HEAD_STYLE = 'box-sizing: border-box;' + ' margin-inline: calc(-1 * var(--sf-property-view--panel-bleed, var(--sf-drawer-gutter, var(--sf-space-1))));' + ' padding-inline: var(--sf-property-view--panel-axis, calc(var(--sf-drawer-gutter, var(--sf-space-1)) + var(--sf-scroll-bg-width, 0px)))';

function renderPanelHead(context) {
  const level = phoneLevel(context);
  const record = context.panelLabel || context.recordLabel || context.recordId || ''; // The history is a level of the same panel (C305 (2)): the C289 head with
  // the back line to the record over its title.

  const history = context.historyOpen; // One row of the ladder's step 2 (48 at a desktop; C289 (6), R254), its
  // buttons the head's 1/3 as sf-drawer draws its own (C180 (2)). A related
  // record opened from this one is drawn inside the same panel (sf-drawer
  // C157 (6)); its way back is the line «← <Запись>» over the title, on the
  // drawer's own back part (data-sf-drawer-back), so the title does not move
  // and the close still closes the whole chain.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <header class="sf-property-view-head flex flex-col" style=${HEAD_STYLE}>
            ${history ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-back">
                <sf-button
                        appearance="ghost"
                        scheme="on-surface"
                        size="1/3"
                        icon-start="arrow_back"
                        text=${record}
                        aria-label=${`${context.backLabel}: ${record}`}
                        data-action="history-back"
                        @click=${() => context.component.closeHistory()}
                ></sf-button>
            </div>` : context.nestedUnder ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-back">
                <sf-button
                        appearance="ghost"
                        scheme="on-surface"
                        size="1/3"
                        icon-start="arrow_back"
                        text=${context.nestedUnder}
                        aria-label=${`${context.backLabel}: ${context.nestedUnder}`}
                        data-action="nested-back"
                        data-sf-drawer-back
                ></sf-button>
            </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            <div class="sf-property-view-title-row" style=${TITLE_ROW_STYLE}>
                ${level ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon
                        size="1/3"
                        appearance="ghost"
                        scheme="on-surface"
                        icon="arrow_back"
                        data-action="phone-back"
                        aria-label=${context.backLabel}
                        title=${context.backLabel}
                        @click=${() => context.component.closePhoneSection()}
                ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                <h2 class="sf-property-view-title min-w-0 overflow-hidden" style=${TITLE_STYLE} tabindex="-1">${history ? context.word('historyText') : level ? context.phoneSectionLabel : record}</h2>
                ${context.recordId && context.mode !== 'create' && !history ? context.starLook // The toggle look (C393): off a quiet ghost, on the soft
  // primary plate with a 1 px primary ring inside, the glyph
  // kept outline; pressed writes aria-pressed on the native
  // button, one name says the action.
  ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon
                        appearance=${context.starLook}
                        size="1/3"
                        icon="star"
                        pressed=${context.favourite ? 'true' : 'false'}
                        data-action="favourite"
                        aria-label=${context.favouriteLabel}
                        title=${context.favouriteLabel}
                        @click=${() => context.component.toggleFavourite()}
                ></sf-button-icon>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-button-icon
                        appearance="ghost"
                        scheme="on-surface"
                        size="1/3"
                        icon="star"
                        ?filled=${context.favourite}
                        data-action="favourite"
                        aria-pressed=${context.favourite ? 'true' : 'false'}
                        aria-label=${context.favouriteLabel}
                        @click=${() => context.component.toggleFavourite()}
                ></sf-button-icon>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${context.ownView ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge class="sf-property-view-own-mark" size="1/2" appearance="tonal" scheme="primary"
                        data-own-view text=${context.word('ownViewText')}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                <span class="sf-property-view-head-spacer" style="flex: 1 1 auto"></span>
                ${context.hasHostSlot('actions') ? context.hostSlot('actions') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${renderMenuControl(context)}
                <sf-button-close
                        size="1/3"
                        aria-label=${context.closeLabel}
                        data-action="close"
                        @click=${() => context.component.closePanel('close')}
                ></sf-button-close>
            </div>
            ${history || level ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : renderHeadLine(context)}
        </header>
    `;
} // The line under the title (C289 (6), C311 (2)): the stage as a tonal badge,
// then up to two fields' values joined by « · ». Nothing when the head names
// none: the title alone, as before.
// A card in place (no panel) has no title row of its own -- the page owns the
// title -- so its actions («⋯», the host's) end this line rather than stand
// alone on an empty row above it (view round 12, VHF-6).


function renderHeadLine(context, end = lit__WEBPACK_IMPORTED_MODULE_0__.nothing) {
  const line = context.headLine;
  if (!headLineDrawn(context)) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-head-line flex items-cross-center gap-1/3 min-w-0" data-head-line>
            ${line.status ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-badge size="1/2" appearance="tonal" scheme=${line.status.scheme}
                    text=${line.status.text} data-head-status=${line.status.key}></sf-badge>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${line.subtitle.length ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="sf-property-view-head-subtitle color-on-surface-variant min-w-0 overflow-hidden"
                    data-head-subtitle>${line.subtitle.map(item => item.text).join(' · ')}</span>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${end === lit__WEBPACK_IMPORTED_MODULE_0__.nothing ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-head-line-end flex items-cross-center gap-1">${end}</div>`}
        </div>
    `;
}

function headLineDrawn(context) {
  const line = context.headLine;
  return Boolean(line && (line.status || line.subtitle.length));
} // The actions of a card in place: the host's and the card's menu («⋯»).


function inPlaceActions(context) {
  return Boolean(context.hasHostSlot('actions') || context.hasHostSlot('menu') || context.panelMenuItems.length || context.canDeleteRecord || (context.recordMenuItems?.length ?? 0) > 0);
} // The sections as a list, each a level with «←» (C386): in a side panel the
// rail would leave the fields under 20rem (C403). On a phone the sections
// are tabs on top that a swipe also turns (study S-A 3, VL-86): the list
// with «←» hid the record's title inside a section (SB-19).


function sectionLevels(context) {
  return context.sectionsLayout === 'level';
} // A section opened on a phone, inside a panel: a level of the panel (C157 (6)).


function phoneLevel(context) {
  return Boolean(context.panel && sectionLevels(context) && (context.sections?.length ?? 0) > 1 && context.phoneSection !== null);
} // The phone's list screen: below the breakpoint, with more than one section and
// none of them opened. Named once rather than written out at each of the three
// places that ask it -- the first version repeated the expression and the third
// copy was the one that forgot to suppress the groups, so the list screen drew the
// list with a section's groups underneath it.


function onPhoneSectionList(context, sections) {
  // Arranging draws «Вкладки» over the fields at every width (C311 (4)): the
  // phone's list screen is a way to read, not to arrange.
  return !context.configuring && sectionLevels(context) && sections.length > 1 && context.phoneSection === null;
} // The section being arranged, named where its areas are. The section list is
// drawn by sf-tabs, whose tabs take a label as a string and nothing else, so
// neither a pencil nor a field can stand in the list
// itself -- and a section shown as a tab has no list at all. The name of the
// place you are arranging belongs above the things you are arranging anyway.


function renderSectionBar(context, section, count) {
  if (!section) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-section-bar flex items-cross-center gap-1/4"
             data-section=${String(section.key)}>
            ${context.configuring ? renderSectionIcon(context, section) : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<i class="sf-icon" aria-hidden="true">${section.icon ? String(section.icon) : 'folder'}</i>`}
            ${renderEntryName(context, 'section', String(section.key), String(section.label ?? section.key), 'sf-property-view-section-title min-w-0')}
            <sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="secondary"
                    icon="delete"
                    data-action="remove-section"
                    ?disabled=${count < 2}
                    title=${context.removeSectionText}
                    aria-label=${context.removeSectionText}
                    @click=${() => context.component.removeSection(String(section.key))}
            ></sf-button-icon>
        </div>
    `;
} // The glyph a section is marked with, chosen from a grid of them. A column of a
// hundred icons is a column nobody scrolls to the end of, so the dropdown lays
// its options out several to a row and searches by the name of the glyph, which
// is the only thing about an icon a person can type.


function renderSectionIcon(context, section) {
  const current = section.icon ? String(section.icon) : '';
  const options = context.sectionIconChoices.map(icon => ({
    kind: 'icon',
    icon,
    text: icon,
    value: icon,
    ariaLabel: icon,
    selected: icon === current
  })); // The chooser is the dropdown laid out as a grid: a hundred and twenty
  // glyphs in a column is a column nobody scrolls to the end of, and the
  // search is the only thing about a glyph a person can type. The trigger is
  // the glyph itself, because a field spelling out the name of what is drawn
  // beside it says the same thing twice.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-dropdown
                class="sf-property-view-section-icon"
                size="1/2"
                layout="grid"
                columns="6"
                search="true"
                search-placeholder=${context.sectionIconText}
                aria-label=${context.sectionIconText}
                data-icon-for=${String(section.key)}
                value=${current}
                .options=${options}
                @change=${event => context.component.setSectionIcon(String(section.key), event.detail?.value ?? '')}
        >
            <sf-button-icon
                    slot="trigger"
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface"
                    icon=${current || 'folder'}
                    data-action="section-icon"
                    title=${context.sectionIconText}
                    aria-label=${context.sectionIconText}
            ></sf-button-icon>
        </sf-dropdown>
    `;
} // Making something new, at the end of the arrangement, where a person who has
// run out of places to put a field looks for one (owner, 2026-10-07). An area
// and a section are the two boxes this view has: one holds fields, the other
// holds areas. Both are named the moment they are made -- the new name opens
// for typing -- because an area called «Новая область» among four real ones is
// a box nobody can tell from the others.
//
// Both stand the width of what they add to, in the neutral scheme and with no
// glyph: making a box is not the primary act of this mode, and a full-width
// outlined button with a plus in it read as the main thing to do on the screen.
// «Add an area» takes the ladder's size 1, the size the panel's own controls
// use; «add a section» stays a step below it, which is where it sits in the
// rail (owner, 2026-10-09).


function renderArrangementAdditions(context, section) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-additions flex flex-col items-cross-stretch gap-1">
            <sf-button
                    appearance="outline"
                    scheme="on-surface"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    text=${context.addGroupText}
                    data-action="add-group"
                    @click=${() => context.component.addGroup(section ? String(section.key) : '')}
            ></sf-button>
            <sf-button
                    appearance="outline"
                    scheme="on-surface"
                    size=${context.controlSize ?? lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                    icon-start="add"
                    text=${context.word('newFieldText')}
                    data-action="new-field"
                    @click=${() => context.component.openStructureEditor()}
            ></sf-button>
        </div>
    `;
} // A new section is made at the end of the sections (owner, 2026-10-08), which is
// where a person looks for one: under the list of them. Without a rail there is
// no list to put it under, so it stands beside «add an area» as before.


function renderAddSection(context) {
  // «+ Вкладка» makes a tab with a «Поля» area (C311 (4)).
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-button
                appearance="outline"
                scheme="on-surface"
                size="1/2"
                icon-start="add"
                text=${context.word('addTabText')}
                data-action="add-section"
                @click=${() => context.component.addSection()}
        ></sf-button>
    `;
} // Whether the column of tabs is drawn beside the fields. It holds the tabs and
// nothing else (owner, 2026-10-07), so what used to stand above the whole panel
// -- the band of the arranging mode -- stands above the fields instead, and the
// column reaches the top of the panel the way a rail of tabs does.


function sidebarDrawn(context) {
  const sections = listed(context, context.sections); // The rail of a side panel (C403) stands where the column does.

  return Boolean((context.sectionsLayout === 'column' || context.sectionsLayout === 'rail') && (sections.length > 1 || context.configuring));
} // The line of tabs under the head (C289 (1)): a panel narrower than the whole
// screen, or a page that asked for tabs, with more than one section. While the
// view is arranged the sections are rows that take a drop, drawn over the
// groups instead (sectionsStacked).


function lineTabsDrawn(context, sections) {
  return (context.sectionsLayout === 'tabs' || context.sectionsLayout === 'phone') && sections.length > 1 && !context.configuring;
} // While arranging, «Вкладки» stand over the fields wherever the sections are
// not a column beside them -- tabs, and a narrow card (C311 (4)).


function sectionsStacked(context) {
  return context.configuring && (context.sectionsLayout === 'tabs' || context.sectionsLayout === 'phone');
} // The errors of a save, from two of them (C182 (6)): a summary over the
// fields with a link to each, which takes the focus; one error takes the
// focus to its field. The look is sf-form's summary (the quiet error
// container), so a record and a form say it the same way.


function renderErrorSummary(context) {
  const list = context.errorList ?? [];
  if (list.length < 2 || !(context.editing || context.openAll)) return lit__WEBPACK_IMPORTED_MODULE_0__.nothing;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-error-summary" role="alert" tabindex="-1">
        <p class="sf-property-view-error-summary-title">${context.errorsText}: ${list.length}</p>
        <ul class="sf-property-view-error-summary-list">${list.map(error => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<li><a href=${`#${error.key}`}
            data-field-link=${error.key}
            @click=${event => {
    event.preventDefault();
    context.component.focusField(error.key);
  }}>${error.label}: ${error.message}</a></li>`)}</ul>
    </div>`;
} // The record's history (C305 (2), RC-3): sf-list-timeline by day, newest
// first, each change's before and after drawn by its field's template, the
// author and the time; «Показать ещё» asks the host for the next page.


function renderHistoryFeed(context) {
  const feed = context.history;
  const items = feed?.items ?? [];
  const loading = !feed || feed.loading;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-list-timeline class="sf-property-view-history"
                size=${context.size === '1/2' ? '1/2' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                group="day"
                label=${context.word('historyText')}
                .items=${items}
                ?has-more=${Boolean(feed?.hasMore)}
                ?loading=${loading}
                empty-text=${feed?.failed ? context.word('historyFailedText') : context.word('historyEmptyText')}
                @sf-list-timeline-load-more=${() => context.component.loadHistory({
    more: true
  })}
        ></sf-list-timeline>
    `;
} // The full screen from 80rem: the history in a column of its own beside the
// fields (C305 (3), VP-22), --sf-view-properties-side-width (24rem).


function renderHistorySide(context) {
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <aside class="sf-property-view-side min-w-0" aria-label=${context.word('historyText')}>
            <div class="sf-property-view-side-title" role="heading" aria-level="3">${context.word('historyText')}</div>
            ${renderHistoryFeed(context)}
        </aside>
    `;
} // The record on its way: the arrangement's shape in the Framework's skeleton
// -- a sentence in its place said nothing about it (owner, 2026-10-14). Each
// group is the card a group read by itself draws until its fields come
// (port 1.15.0 group-load, renderGroup's `waiting`): its header with a bar for
// the title and a line per field, so the record and its groups arrive in the
// boxes this draws (standard simai.smart-component 1.3.8 §5.4, item 25). The
// same markup is skeleton.html, which a server prints before any code, so the
// element's first render after the printed skeleton changes nothing.
// A group is a card on its ground (C20: a card is never darker than what it
// stands on). In a panel the ground is --sf-surface-area, which in the dark
// theme is lighter than --sf-surface-page, so the groups took the card role
// (--sf-surface-card: white in the light theme as before, --sf-surface-2 in the
// dark one); on a page the group keeps the page's own surface (VB-1, C394).


const groupSurface = context => context.panel ? 'bg-surface-card' : 'bg-surface-page';

const SKELETON_WIDTHS = ['w-1/3', 'w-2/3', 'w-1/2', 'w-3/4', 'w-2/5'];
const SKELETON_GROUPS = 3;
const SKELETON_FIELDS = 3;

function renderLoading(context) {
  const bar = at => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-skeleton sf-skeleton--animation-pulse" aria-hidden="true"><div class="sf-skeleton-text sf-skeleton-text--size-1 ${SKELETON_WIDTHS[at % SKELETON_WIDTHS.length]}"></div></div>`; // The section tabs are drawn with the skeleton, in the box the tabs take
  // (simai/ui-pro#3): they came only with the data before, and the record
  // moved down by their height when it arrived. The stylesheet draws the
  // strip only where the record has tabs -- sections-as tabs, from the wide
  // arrangement on -- since a printed skeleton knows no viewport. The box is
  // sf-tabs' own: its strip of the view's control height over the tabs'
  // hairline (.sf-tabs-top-container), from the tabs' sheet; the strip was
  // one text line before, and the record still moved down by 49px at size 1.
  // The empty panel row (.sf-tabs-main-container) is not drawn: since sf-tabs
  // 1.4.5 tabs whose panels hold nothing hide that row (data-sf-panels-empty),
  // so the record's section tabs are the strip alone and a skeleton with the
  // row stood 32px taller (24px at 1/2) than the tabs that replaced it.
  // The root is not .sf-tabs: that class is the tabs script's to bind.


  const tabs = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-tabs sf-property-view-tabs--skeleton" aria-hidden="true" data-sf-skeleton="tabs" data-sections-as=${context.sectionsLayout === 'tabs' ? 'tabs' : 'list'} data-size=${context.size}><div class="sf-tabs-top-container"><div class="sf-property-view-tabs-skeleton-strip flex items-cross-center gap-2">${[0, 1, 2].map(at => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="flex-none" style="inline-size: 6rem">${bar(at + 3)}</div>`)}</div></div></div>`;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`${tabs}<div class="sf-property-view-loading flex flex-col gap-4" data-state="loading">${Array.from({
    length: SKELETON_GROUPS
  }, (_, group) => (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<section class="sf-property-view-group ${groupSurface(context)} flex flex-col gap-2" aria-busy="true"><header class="sf-property-view-group-header flex items-cross-center content-main-between gap-2"><div class="flex-1">${bar(group)}</div></header>${Array.from({
    length: SKELETON_FIELDS
  }, (_, field) => bar(group + field + 1))}</section>`)}<span class="sr-only" role="status">${context.message}</span></div>`;
}

function renderLoadFailure(context) {
  const failure = context.loadFailure;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<sf-empty-state kind=${failure.kind} size=${context.size === '1/2' ? '1/2' : '1'} heading-level="2"
        text=${failure.text || lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        .actions=${failure.kind === 'error' ? null : []}
        @sf-empty-state-action=${event => {
    if (event.detail?.id === 'retry') context.component.load('retry');
  }}></sf-empty-state>`;
}

function renderBody(context, railOutside = false, withActions = true) {
  if (context.loading) return renderLoading(context);
  if (context.loadFailure) return renderLoadFailure(context); // In place, the history level stands where the record was, its back line
  // over it (a panel draws it under its head).

  if (!context.panel && context.historyOpen) {
    const record = context.panelLabel || context.recordLabel || context.recordId || '';
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
            <div class="sf-property-view-back">
                <sf-button appearance="ghost" scheme="on-surface" size="1/3" icon-start="arrow_back" text=${record}
                           aria-label=${`${context.backLabel}: ${record}`} data-action="history-back"
                           @click=${() => context.component.closeHistory()}></sf-button>
            </div>
            <div class="sf-property-view-history-head flex items-cross-center gap-1">
                <div class="sf-property-view-side-title flex-auto" role="heading" aria-level="2">${context.word('historyText')}</div>
                ${renderMenuControl(context)}
            </div>
            ${renderHistoryFeed(context)}
        `;
  } // Sections are listed the same way fields and groups are while the view is
  // being configured: a hidden section filtered out here would be a section
  // nobody could ever show again.


  const sections = listed(context, context.sections);
  const current = sections.find(section => String(section.key) === context.selectedSection) ?? sections[0] ?? null;
  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <div class="sf-property-view-status" role="status" aria-live="polite" ?hidden=${!context.message}>
            ${context.message}
        </div>
        ${!context.panel && inPlaceActions(context) && !headLineDrawn(context) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                    <div class="sf-property-view-host-actions flex flex-wrap items-cross-center justify-end gap-1">
                        ${context.hasHostSlot('actions') ? context.hostSlot('actions') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                        ${renderMenuControl(context)}
                    </div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${context.panel ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : renderHeadLine(context, inPlaceActions(context) ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                ${context.hasHostSlot('actions') ? context.hostSlot('actions') : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                ${renderMenuControl(context)}` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing)}
        ${onPhoneSectionList(context, sections) ? renderPhoneSectionList(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${lineTabsDrawn(context, sections) ? renderSectionTabs(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        <div class="sf-property-view-layout"
             @pointerdown=${event => context.component.sectionSwipeStart(event)}
             style=${`--sf-property-view--sections-width: ${context.sectionsWidth};${context.panel ? '' : sizeStyle(context)}`}
             data-sections=${String(sections.length)}
             data-screen=${onPhoneSectionList(context, sections) ? 'sections' : 'groups'}
             data-stacked=${sectionsStacked(context) ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
            ${!context.panel && !context.wide && !context.configuring && sections.length > 1 && context.phoneSection !== null ? renderPhoneSectionHead(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${onPhoneSectionList(context, sections) ? renderViewChooser(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${sectionsStacked(context) ? renderConfigureTop(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${sidebarDrawn(context) && !railOutside || sectionsStacked(context) ? renderSectionList(context, sections) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${context.isEmptyRecord && !context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<p class="sf-property-view-empty-record color-on-surface-variant"
                              role="status">${context.emptyRecordText}</p>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            ${onPhoneSectionList(context, sections) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : context.configuring ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-property-view-body flex-auto min-w-0 flex flex-col gap-4">
                            ${sectionsStacked(context) ? lit__WEBPACK_IMPORTED_MODULE_0__.nothing : renderConfigureTop(context)}
                            ${renderSectionBar(context, current, sections.length)}
                            <sf-sortable
                                    class="sf-property-view-groups flex flex-col gap-4"
                                    group="group"
                                    accepts="group"
                                    id=${`group:${current ? String(current.key) : ''}`}
                                    label=${String(current?.label ?? current?.key ?? '')}
                            >${listed(context, current?.groups).map(group => renderGroup(context, current, group))}</sf-sortable>
                            ${renderArrangementAdditions(context, current)}
                            ${renderUnplaced(context)}
                        </div>` : (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                        <div class="sf-property-view-body flex-auto min-w-0 flex flex-col gap-4">
                            ${renderViewChooser(context)}
                            ${renderErrorSummary(context)}
                            <div class="sf-list-description sf-list-description--size-${context.size === '1/2' ? 'half' : '1'} sf-list-description--layout-auto sf-list-description--sections sf-property-view-list">
                                <div class="sf-list-description-list">${context.visible(current?.groups).map(group => renderGroup(context, current, group))}</div>
                            </div>
                        </div>`}
            ${!context.panel && context.historySide ? renderHistorySide(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        </div>
        ${withActions && context.hasHostSlot('footer') ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-host-footer flex flex-wrap items-cross-center gap-1/3">${context.hostSlot('footer')}</div>` : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
        ${withActions ? renderActions(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
    `;
} // A deeper window is narrower by a step, so the one below shows along the
// inline-start edge. That is what makes a stack visible rather than merely true
// in the DOM, and `width` is a declared input on sf-drawer, so it reaches into
// none of that component's internals.
//
// A window above the stack takes no step in from the one below (owner,
// 2026-10-07): the step read as the panel having slipped rather than as a stack,
// and the page behind is already dimmed, which says there is something under
// this. sf-drawer keeps `stack-offset` for a consumer that wants the step; this
// one asks for none.
//
// The panel lies *over* the page: `overlay` is on, so the page behind is dimmed and
// keeps its own layout. It was off before, which is how a consumer's page came to
// be squeezed instead of covered -- the first thing the owner pointed at.
//
// `modal` is on because the drawer draws its overlay only when it is -- the
// element is marked hidden unless modal and overlay are both set, which was
// measured rather than assumed. Dimming the page is what the mockup asks for, and
// a panel that dims the page is modal in the sense that matters. The dim is the
// drawer's overlay, the same over a panel below as over the page: a panel under
// another stands under that one's overlay, so it is dimmed and takes no press
// without a dim of its own (1.13.0). Esc is the drawer's on the layer stack, which
// hands it to the top layer only; the close it starts is refused and asked of the
// host (index.js, sf-drawer-close).
//
// The drawer is given no `title`: the panel draws its own head, with the collection
// above the name and the star and the «⋯» beside it, and a drawer title as well
// would be the same words twice.


function renderPropertyViewTemplate(context) {
  if (!context.panel) return renderBody(context); // The panel is laid out the way a page is (owner, 2026-10-08): a head across
  // the top, a foot across the bottom, and what is between them scrolling
  // under both. The bands were sticky inside the panel's own scroller before,
  // which held them only while their containing block was on screen -- so a
  // record scrolled far enough took its own head and foot with it.
  //
  // With a rail of tabs what is between them is two columns, each with its own
  // scrollbar: a long list of sections scrolls without moving the record, and
  // a long record scrolls without moving the list.

  const rail = sidebarDrawn(context); // `show-close` is off because the panel draws its own close, sf-button-close
  // last in its head (1.16.0; it stood in the strip beside copy-link and
  // open-full before). With both, a panel carried two close
  // buttons a step apart, and on a phone neither was reachable: the strip is
  // placed a gutter's width beyond the panel's inline start, which on a
  // full-screen drawer is off the screen.

  return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
        <sf-drawer
                ?open=${context.panelOpen}
                placement="inline-end"
                modal="true"
                overlay="true"
                ?docked=${context.docked}
                dock-breakpoint=${context.docked ? context.dockBreakpoint : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
                size=${context.wide ? context.drawerStep : 'full'}
                gutter="var(--sf-space-1)"
                panel-style=${`--sf-drawer-background: var(--sf-surface-area); --sf-property-view--sections-width: ${context.sectionsWidth}; scrollbar-gutter: auto;${sizeStyle(context)}${context.panelWidthStyle || ''}`}
                show-close="false"
                close-label=${context.closeLabel}
                label=${context.panelLabel || context.recordLabel || context.recordId || ''}
        >
            <div class="sf-property-view-panel relative flex flex-col gap-2${rail ? ' sf-property-view-panel--railed' : ''}${context.ownStrip ? ' sf-property-view-panel--own-strip' : ''}"
                 data-record-id=${context.recordId || ''}
                 data-sections-layout=${context.sectionsLayout}
                 data-nested=${context.nestedUnder ? 'true' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}
            >
                ${renderPanelHead(context)}
                <div class="sf-property-view-scroll flex-auto min-h-0 ${rail && !context.historyOpen ? 'flex' : 'flex flex-col'}"
                     data-history=${context.historyOpen ? 'level' : context.historySide ? 'side' : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}>
                    ${context.historyOpen ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<div class="sf-property-view-frame flex-auto min-w-0 flex flex-col gap-2">${renderHistoryFeed(context)}</div>` : rail ? (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
                                ${renderSectionList(context, listed(context, context.sections))}
                                <div class="sf-property-view-frame flex-auto min-w-0 flex flex-col gap-2">
                                    ${renderBody(context, true, false)}
                                </div>
                                ${context.historySide ? renderHistorySide(context) : lit__WEBPACK_IMPORTED_MODULE_0__.nothing}` : renderBody(context, false, false)}
                </div>
                ${renderActions(context, {
    panel: true
  })}
            </div>
        </sf-drawer>
    `;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ },

/***/ "f59c8bcdc90a"
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "9e9dad7bcc09"
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

/***/ "2a080a730149"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("lit", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("lit", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "43090d1c8307"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("page-language", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("page-language", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "deb1a4d61565"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("smart-base", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("smart-base", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "d0f17721f295"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/density", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/density", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "c60590f839f0"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/field-decimal", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/field-decimal", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "06a40de06677"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/field-renderers", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/field-renderers", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "f17a957e50f6"
(module) {

module.exports = (globalThis.SF && globalThis.SF.runtimeModule ? globalThis.SF.runtimeModule("view/manifest-actions", 1) : new Promise((resolve, reject) => globalThis.addEventListener("sf-runtime-ready", () => globalThis.SF.runtimeModule("view/manifest-actions", 1).then(resolve, reject), { once: true })));

/***/ },

/***/ "0e2a9b296d0b"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Directive: () => (/* binding */ i),
/* harmony export */   PartType: () => (/* binding */ t),
/* harmony export */   directive: () => (/* binding */ e)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
//# sourceMappingURL=directive.js.map


/***/ },

/***/ "a3820f08234c"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   guard: () => (/* binding */ i)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f550d360fd36");
/* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0e2a9b296d0b");

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e={},i=(0,_directive_js__WEBPACK_IMPORTED_MODULE_1__.directive)(class extends _directive_js__WEBPACK_IMPORTED_MODULE_1__.Directive{constructor(){super(...arguments),this.ot=e}render(r,t){return t()}update(t,[s,e]){if(Array.isArray(s)){if(Array.isArray(this.ot)&&this.ot.length===s.length&&s.every((r,t)=>r===this.ot[t]))return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange}else if(this.ot===s)return _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.noChange;return this.ot=Array.isArray(s)?Array.from(s):s,this.render(s,e)}});
//# sourceMappingURL=guard.js.map


/***/ },

/***/ "f550d360fd36"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _$LH: () => (/* binding */ j),
/* harmony export */   html: () => (/* binding */ b),
/* harmony export */   mathml: () => (/* binding */ T),
/* harmony export */   noChange: () => (/* binding */ E),
/* harmony export */   nothing: () => (/* binding */ A),
/* harmony export */   render: () => (/* binding */ D),
/* harmony export */   svg: () => (/* binding */ w)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t=>t,s=t.trustedTypes,e=s?s.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o,r=`<${n}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),T=x(3),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o+x):s+o+(-2===d?i:x)}return[V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t)}else t.startsWith(o)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o),i=t.length-1;if(i>0){r.textContent=s?s.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c())}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else{let t=-1;for(;-1!==(t=r.data.indexOf(o,t+1));)d.push({type:7,index:l}),t+=o.length-1}l++}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,!0);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n]}o!==r?.index&&(h=P.nextNode(),o++)}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else{const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const s=i(t).nextSibling;i(t).remove(),t=s}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r}o&&!e&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class I extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class L extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}}const j={M:h,P:o,A:n,C:1,L:N,R,D:d,V:M,I:k,H,N:L,U:z,B:I,F:Z},B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{})}return h._$AI(t),h};
//# sourceMappingURL=lit-html.js.map


/***/ },

/***/ "fc5ce1a4b1d8"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   guard: () => (/* reexport safe */ lit_html_directives_guard_js__WEBPACK_IMPORTED_MODULE_0__.guard)
/* harmony export */ });
/* harmony import */ var lit_html_directives_guard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a3820f08234c");

//# sourceMappingURL=guard.js.map


/***/ },

/***/ "4bd9c3b168e0"
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   files: () => (/* binding */ files)
/* harmony export */ });
/* harmony import */ var _en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4bc232cd5c70");
// Written by scripts/build-language-packs.mjs from src/core/lang/built-in.json
// (owner decision C282); do not edit. The words this bundle carries: the
// built-in languages' (en); every other language comes from
// a language file (core/lang/<code>.js or its parts).


const files = { en: { runtime: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime } };

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ en: _en_json__WEBPACK_IMPORTED_MODULE_0__.runtime });


/***/ },

/***/ "4bc232cd5c70"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"runtime":{"folder":"folder, directory","folder_open":"open, folder","topic":"topic, section","home":"home, main","dashboard":"dashboard, overview","apartment":"building, organisation","store":"store, shop","storefront":"storefront, shop","business_center":"business, briefcase","work":"work, briefcase","badge":"badge, pass, id","person":"person, user","group":"group, people","groups":"groups, community","account_circle":"account, profile","manage_accounts":"manage, accounts, users","supervisor_account":"supervisor, team","contacts":"contacts","school":"school, learning","menu_book":"book, manual","assignment":"assignment","task":"task","description":"document, description","article":"article","note_alt":"note","edit_note":"edit, note","draft":"draft","receipt":"receipt","receipt_long":"bill, receipt","request_quote":"quote, estimate","inventory_2":"archive, inventory","category":"category","label":"label, tag","sell":"price, sell","local_offer":"offer, discount","shopping_cart":"shopping, cart","shopping_bag":"shopping, bag","payments":"payments, money","savings":"savings","credit_card":"credit, card","account_balance":"bank, account","calculate":"calculator","percent":"percent","trending_up":"trend, growth","analytics":"analytics","insights":"insights","monitoring":"monitoring","bar_chart":"bar, chart","pie_chart":"pie, chart","table_chart":"table","schedule":"time, clock, schedule","event":"event","today":"today","calendar_month":"calendar","date_range":"date, range","history":"history","alarm":"alarm","timer":"timer","update":"update","hourglass_top":"hourglass, waiting","mail":"mail, email, letter","outgoing_mail":"outgoing, mail","chat":"chat, message","forum":"forum, discussion","sms":"sms, text","call":"call, phone","phone_in_talk":"phone, call, talk","contact_support":"support, help","campaign":"campaign, announcement","notifications":"notifications","language":"language, world","public":"public, web, world","place":"place","map":"map","location_on":"location, address","travel_explore":"travel, explore","flight":"flight, plane","local_shipping":"shipping, delivery","route":"route","directions":"directions","settings":"settings","tune":"tune, filter","build":"build, tools","construction":"construction","handyman":"handyman, repair","code":"code","terminal":"terminal, console","data_object":"data, object","api":"api","bug_report":"bug","database":"database","storage":"storage","cloud":"cloud","backup":"backup","sync":"sync","folder_zip":"zip, archive","upload_file":"upload, file","download":"download","attach_file":"attach, file","link":"link","lock":"lock","lock_open":"unlock, open","shield":"shield, protection","verified_user":"verified, user","key":"key","admin_panel_settings":"admin","policy":"policy","gavel":"law, gavel","fingerprint":"fingerprint","visibility":"visibility, view","palette":"palette, colour, color","format_paint":"format, paint","image":"image, picture","photo_library":"photos, gallery","collections":"collections","movie":"movie, video","play_circle":"play","mic":"microphone","headphones":"headphones, audio","brush":"brush"}}');

/***/ },

/***/ "4284cc8c32e1"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$comment":"Dated aliases of sf-view-properties for the shim (core/js/aliases.js, standard §16 item 20).","component":"sf-view-properties","since":"2026-10-27","remove_after":"2027-01-01","aliases":[{"from":"aria-label","to":null,"kind":"attribute","component":"sf-view-properties","since":"2026-10-27","remove_after":"2027-01-01","mode":"host-attribute","section":"§3.1, §4.8","note":"stays a host attribute, read for the accessible name; no shim"},{"from":"sf-property-view-open-record","to":"sf-property-view-open","kind":"event","component":"sf-view-properties","since":"2026-10-27","remove_after":"2027-01-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary §5 open","note":"ui-admin listens to it (src/polygon.ts:124); the detail {field, value, answer} is unchanged"},{"from":"sf-property-view-delete-record","to":"sf-property-view-delete","kind":"event","component":"sf-view-properties","since":"2026-10-27","remove_after":"2027-01-01","mode":"same-detail","cancelable":false,"section":"§8, vocabulary §5 delete","note":"the detail {record_id, collection, revision, answer} is unchanged"},{"from":"sf-property-view","to":"sf-view-properties","kind":"tag","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","section":"rename plan R2 (ui-control RENAME-PLAN-2026-11-03), naming decision 2026-11-02","note":"the element is sf-view-properties; sf-property-view is a subclass defined beside it until the date"},{"from":"sf-property-view-close","to":"sf-view-properties-close","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-open-full","to":"sf-view-properties-open-full","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-saved","to":"sf-view-properties-saved","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-failed","to":"sf-view-properties-failed","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-open","to":"sf-view-properties-open","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-delete","to":"sf-view-properties-delete","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-created","to":"sf-view-properties-created","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-cancel","to":"sf-view-properties-cancel","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-state","to":"sf-view-properties-state","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-address-copy","to":"sf-view-properties-address-copy","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"sf-property-view-favourite","to":"sf-view-properties-favourite","kind":"event","component":"sf-view-properties","since":"2026-11-03","remove_after":"2027-01-01","mode":"same-detail","section":"§8","note":"the event name carries the tag"},{"from":"panel-width","to":null,"kind":"attribute","component":"sf-view-properties","since":"2026-11-17","remove_after":"2027-01-01","mode":"host-attribute","section":"C289 (2), C157 (2)","note":"read by the view itself: a length is mapped to the nearest drawer step (1/2, 1, 2) when panel-size is not set, with a console notice; no shim; use panel-size"},{"from":"--sf-property-view--sections-width","to":"--sf-view-properties-sections-width","kind":"css-variable","component":"sf-view-properties","since":"2026-11-18","remove_after":"2027-01-01","section":"C305 (6)","note":"read under the new name until the date"}]}');

/***/ },

/***/ "3ea81f4c3c20"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"id":"smart.view-properties","tag":"sf-view-properties","version":"1.32.1","kind":"leaf","implements":["record-view@1"],"settings":{"add-field-text":{"type":"string","default-from":"runtime.add-field-text"},"add-group-text":{"type":"string","default-from":"runtime.add-group-text"},"add-section-text":{"type":"string","default-from":"runtime.add-section-text"},"back-label":{"type":"string","default-from":"runtime.back-label"},"cancel-configuring-text":{"type":"string","default-from":"runtime.cancel-configuring-text"},"cancel-name-text":{"type":"string","default-from":"runtime.cancel-name-text"},"cancel-text":{"type":"string","default-from":"runtime.cancel-text"},"changed-text":{"type":"string","default-from":"runtime.changed-text"},"close-label":{"type":"string","default-from":"runtime.close-label"},"collection":{"type":"string","default":""},"collection-icon":{"type":"icon","default":""},"collection-label":{"type":"string","default":""},"configure-hint-narrow-text":{"type":"string","default-from":"runtime.configure-hint-narrow-text"},"configure-hint-text":{"type":"string","default-from":"runtime.configure-hint-text"},"configure-text":{"type":"string","default-from":"runtime.configure-text"},"conflict-text":{"type":"string","default-from":"runtime.conflict-text"},"copy-link-label":{"type":"string","default-from":"runtime.copy-link-label"},"delete-text":{"type":"string","default-from":"runtime.delete-text"},"done-configuring-text":{"type":"string","default-from":"runtime.done-configuring-text"},"edit-text":{"type":"string","default-from":"runtime.edit-text"},"empty-record-text":{"type":"string","default-from":"runtime.empty-record-text"},"empty-text":{"type":"string","default-from":"runtime.empty-text"},"errors-text":{"type":"string","default-from":"runtime.errors-text"},"favourite":{"type":"boolean","default":false},"favourite-label":{"type":"string","default-from":"runtime.favourite-label"},"field-label-text":{"type":"string","default-from":"runtime.field-label-text"},"field-settings-text":{"type":"string","default-from":"runtime.field-settings-text"},"hidden-text":{"type":"string","default-from":"runtime.hidden-text"},"hide-rare-text":{"type":"string","default-from":"runtime.hide-rare-text"},"hint-text":{"type":"string","default-from":"runtime.hint-text"},"in-this-group-text":{"type":"string","default-from":"runtime.in-this-group-text"},"inherited-text":{"type":"string","default-from":"runtime.inherited-text"},"link-copied-label":{"type":"string","default-from":"runtime.link-copied-label"},"menu-label":{"type":"string","default-from":"runtime.menu-label"},"move-down-text":{"type":"string","default-from":"runtime.move-down-text"},"move-up-text":{"type":"string","default-from":"runtime.move-up-text"},"new-group-title":{"type":"string","default-from":"runtime.new-group-title"},"new-section-title":{"type":"string","default-from":"runtime.new-section-title"},"no-match-text":{"type":"string","default-from":"runtime.no-match-text"},"open-full-label":{"type":"string","default-from":"runtime.open-full-label"},"panel":{"type":"boolean","default":false},"panel-label":{"type":"string","default":""},"panel-size":{"type":"enum","values":["1/2","1","2","full"],"default":"2"},"size":{"type":"enum","values":["1","1/2"],"default":"1"},"mode":{"type":"enum","values":["view","auto","edit","create"],"default":"auto"},"panel-width":{"type":"string","default":""},"personal-layer-text":{"type":"string","default-from":"runtime.personal-layer-text"},"rare-text":{"type":"string","default-from":"runtime.rare-text"},"record-id":{"type":"id","default":""},"remove-field-text":{"type":"string","default-from":"runtime.remove-field-text"},"remove-group-text":{"type":"string","default-from":"runtime.remove-group-text"},"remove-section-text":{"type":"string","default-from":"runtime.remove-section-text"},"rename-text":{"type":"string","default-from":"runtime.rename-text"},"reset-view-ask-text":{"type":"string","default-from":"runtime.reset-view-ask-text"},"reset-view-text":{"type":"string","default-from":"runtime.reset-view-text"},"save-name-text":{"type":"string","default-from":"runtime.save-name-text"},"save-text":{"type":"string","default-from":"runtime.save-text"},"section-icon-text":{"type":"string","default-from":"runtime.section-icon-text"},"section-icons":{"type":"string","default":""},"sections-as":{"type":"enum","values":["list","tabs"],"default":"list"},"sections-label":{"type":"string","default-from":"runtime.sections-label"},"shared-layer-text":{"type":"string","default-from":"runtime.shared-layer-text"},"show-rare":{"type":"boolean","default":false},"show-rare-text":{"type":"string","default-from":"runtime.show-rare-text"},"shown-text":{"type":"string","default-from":"runtime.shown-text"},"unplaced-hint-text":{"type":"string","default-from":"runtime.unplaced-hint-text"},"unplaced-title":{"type":"string","default-from":"runtime.unplaced-title"},"variant-text":{"type":"string","default-from":"runtime.variant-text"},"view-conflict-text":{"type":"string","default-from":"runtime.view-conflict-text"},"view-denied-text":{"type":"string","default-from":"runtime.view-denied-text"},"width-text":{"type":"string","default-from":"runtime.width-text"},"view-profile-label":{"type":"string","default-from":"runtime.view-profile-label"},"add-view-text":{"type":"string","default-from":"runtime.add-view-text"},"new-view-text":{"type":"string","default-from":"runtime.new-view-text"},"delete-view-text":{"type":"string","default-from":"runtime.delete-view-text"},"last-shared-view-text":{"type":"string","default-from":"runtime.last-shared-view-text"},"full":{"type":"boolean","default":false},"open":{"type":"boolean","default":true},"edit":{"type":"enum","values":["group","group+quick","none"],"default":"group+quick"},"history":{"type":"enum","values":["auto","off"],"default":"auto"},"modal":{"type":"enum","values":["auto","true"],"default":"auto"}},"values":{"revision":{"type":"string"},"section":{"type":"string"}},"events":{"close":{"carries":{"reason":{"type":"enum","values":["close","escape","outside","cancelled","deleted","api"]},"record_id":{"type":"id","nullable":true},"unsaved_fields":{"type":"list"},"asked":{"type":"boolean"}},"cancelable":true},"open-full":{"carries":{"id":"id","address":"string","record_id":{"type":"id","nullable":true}}},"saved":{"carries":{"id":"id","revision":{"type":"string","optional":true}}},"failed":{"carries":{"reason":"string","message":{"type":"string","optional":true}}},"open":{"carries":{"field":"string","value":"object","answer":"string"}},"delete":{"carries":{"collection":"string","revision":"string","answer":"string","record_id":{"type":"id","nullable":true}}},"created":{"carries":{"collection":{"type":"string","nullable":true},"record_id":{"type":"id","nullable":true}}},"cancel":{"carries":{"mode":{"type":"enum","values":["auto","edit","create"]},"scope":{"type":"enum","values":["group"],"optional":true},"section":{"type":"string","optional":true},"group":{"type":"string","optional":true}}},"state":{"carries":{"state":"string","message":"string"},"own-verb":true},"address-copy":{"carries":{},"own-verb":true},"favourite":{"carries":{"collection":{"type":"string","nullable":true},"favourite":"boolean","record_id":{"type":"id","nullable":true}},"own-verb":true},"step":{"carries":{"direction":{"type":"enum","values":["next","previous"]},"record_id":{"type":"id","nullable":true},"next_record_id":{"type":"id","nullable":true}},"cancelable":true,"own-verb":true},"history":{"carries":{"record_id":{"type":"id","nullable":true}},"own-verb":true},"structure":{"carries":{"collection":{"type":"string","nullable":true},"section":{"type":"string","nullable":true},"group":{"type":"string","nullable":true}},"own-verb":true,"cancelable":true}},"actions":{"refresh":{},"load":{"with":{"reason":{"type":"string","optional":true}}},"edit-group":{"with":{"section":"string","group":"string","options":{"type":"object","optional":true}}},"cancel-edit":{},"save-group":{"with":{"options":{"type":"object","optional":true}},"concurrency":"drop"},"select-section":{"with":{"key":"string"}},"close-panel":{"with":{"reason":{"type":"string","optional":true}}},"copy-address":{},"open-full-page":{},"confirm-save":{},"cancel-confirmation":{},"open-history":{},"edit-field":{"with":{"key":"string"}},"step":{"with":{"direction":{"type":"enum","values":["next","previous"]}}}},"port":{"id":"simai.property-view-port","version":"1.18.0","contract":"src/core/contracts/ports/simai.property-view-port/1.18.0/port.json"},"presentation":{"skeleton":{"file":"skeleton.html","late":[]}},"css-variables":{"--sf-view-properties-label-width":{"type":"length","state":"default","x-default":"10rem"},"--sf-view-properties-row-gap":{"type":"length","state":"default","x-default":"8px (--sf-space-1/3)"},"--sf-view-properties-group-gap":{"type":"length","state":"default","x-default":"24px (--sf-space-1)"},"--sf-view-properties-sections-width":{"type":"length","state":"default","x-default":"12rem"},"--sf-view-properties-side-width":{"type":"length","state":"default","x-default":"24rem"},"--sf-view-properties-current-background-color":{"type":"color","state":"default","x-default":"--sf-surface-container"},"--sf-view-properties-saved-background-color":{"type":"color","state":"default","x-default":"--sf-success-container"},"--sf-property-view--sections-width":{"type":"length","state":"default"},"--sf-property-view--title-size":{"type":"length","state":"default"},"--sf-property-view--label-size":{"type":"length","state":"default"},"--sf-property-view--value-size":{"type":"length","state":"default"},"--sf-property-view--group-size":{"type":"length","state":"default"},"--sf-property-view--edge-room":{"type":"length","state":"open"}},"host-states":{"data-state":"string","aria-busy":"string"}}');

/***/ },

/***/ "99fb492b7fba"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Property view","events":{"state":{"label":"Record state"},"address-copy":{"label":"Address copied"},"favourite":{"label":"Favourite"}},"runtime":{"add-field-text":"Add a field","add-group-text":"Add an area","add-section-text":"Add a section","add-view-text":"Add a view","back-label":"Back","cancel-configuring-text":"Cancel","cancel-name-text":"Leave the name","cancel-text":"Cancel","changed-text":"Fields changed","close-label":"Close","close-unsaved-accept-text":"Close without saving","close-unsaved-text":"There are unsaved changes","configure-hint-narrow-text":"Drag fields between groups. Applied at once.","configure-hint-text":"Drag fields between groups and onto a section on the left. Applied at once.","configure-text":"Arrange the view","confirm-save-text":"Confirm and save","conflict-text":"The record changed; read it again","copy-link-label":"Copy link","create-text":"Create","delete-text":"Delete","delete-view-text":"Remove the view","done-configuring-text":"Save","edit-all-text":"Edit all","edit-text":"Edit","empty-record-text":"This record has nothing to show","empty-text":"not filled in","errors-text":"Errors","favourite-label":"Favourite","field-label-text":"Name","field-settings-text":"Field settings","hidden-text":"Hide","hide-rare-text":"Hide rare fields","hint-text":"Hint","history-all-text":"All events","history-changed-many-text":"changed {n} fields","history-changed-one-text":"changed «{field}»","history-create-text":"created the record","history-delete-text":"deleted the record","history-empty-text":"No changes yet","history-failed-text":"The history could not be loaded","history-fields-text":"Field changes only","history-publish-text":"published the record","history-restore-text":"restored the record","history-sealed-text":"Value hidden: {fields}","history-text":"Change history","in-this-group-text":"In this area","inherited-text":"by default","keep-editing-text":"Keep editing","last-shared-view-text":"The only view everyone has","leave-unsaved-text":"Go on without saving","link-copied-label":"Link copied","menu-label":"More","move-down-text":"Move down","move-up-text":"Move up","new-group-title":"New area","new-section-title":"New section","new-view-text":"New view","no-match-text":"Nothing matches","open-full-label":"Open as a page","personal-layer-text":"Personal","rare-text":"rare","read-only-text":"You can only view this record","remove-field-text":"Remove from this area","remove-group-text":"Remove this area","remove-section-text":"Remove this section","rename-text":"Rename","required-error-text":"Fill in this field","reset-view-ask-text":"Reset the whole view?","reset-view-text":"Back to the shared view","save-failed-text":"The save failed","save-name-text":"Save the name","save-text":"Save","section-icon-text":"Section glyph","sections-label":"Sections","shared-layer-text":"Everyone\'s","show-rare-text":"Show rare fields","shown-text":"Shown","state-load-failed":"The record could not be read","state-loading":"Reading the record","state-port-not-connected":"The record port is not connected","state-unavailable":"The record is unavailable","unplaced-hint-text":"Fields this view does not show. Drag a field into an area or press the eye to show it.","unplaced-title":"Hidden fields","variant-text":"Look","view-conflict-text":"The view changed and was read again","view-denied-text":"You may not change this layer","view-profile-label":"View","view-reset-failed-text":"The view could not be reset","view-save-failed-text":"The view could not be saved","width-text":"Full width","view-published-text":"Saved for everyone","view-changed-text":"The view changed","save-as-mine-text":"Save as mine","save-as-mine-label-text":"{name} (mine)","publish-view-text":"Save for everyone","undo-mine-text":"Undo my edits","tab-rename-text":"Name…","tab-icon-text":"Icon…","tab-up-text":"Up","tab-down-text":"Down","tab-hide-text":"Hide the tab","tab-show-text":"Show the tab","tab-delete-text":"Delete the tab…","tab-menu-text":"Settings of the tab «{name}»","tab-hidden-text":"The tab is hidden","tabs-title":"Tabs","tabs-hint-text":"Drag by the handle to change the order","add-tab-text":"Tab","new-tab-group-title":"Fields","lock-text":"Lock for changes","unlock-text":"Unlock for changes","locked-text":"Locked by the administrator","field-menu-text":"Settings of the field «{name}»","head-subtitle-on-text":"Show in the head","head-subtitle-off-text":"Remove from the head","head-status-on-text":"As the stage in the head","head-status-off-text":"Remove the stage from the head","to-tab-text":"To the tab «{name}»","hide-field-text":"Hide «{name}»","show-field-text":"Show «{name}»","configure-personal-hint-text":"«Save» keeps it for you only. The shared view is changed by an administrator.","configure-admin-hint-text":"«Save» keeps it for you only, «Save for everyone» for everyone.","configure-required-hint-text":"This view is required. Edits stay until you leave the page.","new-field-text":"New field…","view-refused-invalid-text":"The view was not saved: its settings do not fit","view-refused-shared-denied-text":"You may not set the view for everyone","view-refused-own-text":"This is a person\'s own view, not a view for everyone","view-refused-unknown-text":"This view no longer exists","view-refused-required-text":"This card has a required view: it cannot be changed or replaced","view-refused-lock-invalid-text":"This setting cannot be locked","view-refused-head-invalid-text":"The head takes up to two fields, and the status is a field with a list of values","view-refused-icon-invalid-text":"This tab icon is unknown","own-view-text":"My view"}}');

/***/ },

/***/ "d614908e644f"
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"title":"Запись","events":{"state":{"label":"Состояние записи"},"address-copy":{"label":"Адрес скопирован"},"favourite":{"label":"Избранное"}},"runtime":{"add-field-text":"Добавить поле","add-group-text":"Добавить область","add-section-text":"Добавить раздел","add-view-text":"Добавить вид","back-label":"Назад","cancel-configuring-text":"Отменить","cancel-name-text":"Оставить название","cancel-text":"Отмена","changed-text":"Изменено полей","close-label":"Закрыть","close-unsaved-accept-text":"Закрыть без сохранения","close-unsaved-text":"Есть несохранённые изменения","configure-hint-narrow-text":"Перетаскивайте поля между группами. Применяется сразу.","configure-hint-text":"Перетаскивайте поля между группами и на разделы слева. Применяется сразу.","configure-text":"Настроить вид","confirm-save-text":"Подтвердить и сохранить","conflict-text":"Запись изменилась, обновите её","copy-link-label":"Копировать ссылку","create-text":"Создать","delete-text":"Удалить","delete-view-text":"Удалить вид","done-configuring-text":"Сохранить","edit-all-text":"Изменить всё","edit-text":"Изменить","empty-record-text":"В этой записи нечего показать","empty-text":"не заполнено","errors-text":"Ошибок","favourite-label":"В избранное","field-label-text":"Название","field-settings-text":"Настройки поля","hidden-text":"Скрыть","hide-rare-text":"Скрыть редкие поля","hint-text":"Подсказка","history-all-text":"Все события","history-changed-many-text":"изменение полей: {n}","history-changed-one-text":"изменение поля «{field}»","history-create-text":"создание записи","history-delete-text":"удаление записи","history-empty-text":"Изменений пока нет","history-failed-text":"Историю не удалось загрузить","history-fields-text":"Только изменения полей","history-publish-text":"публикация записи","history-restore-text":"восстановление записи","history-sealed-text":"Значение скрыто: {fields}","history-text":"История изменений","in-this-group-text":"В этой области","inherited-text":"по умолчанию","keep-editing-text":"Вернуться к правке","last-shared-view-text":"Единственный общий вид","leave-unsaved-text":"Перейти без сохранения","link-copied-label":"Ссылка скопирована","menu-label":"Ещё","move-down-text":"Ниже","move-up-text":"Выше","new-group-title":"Новая область","new-section-title":"Новый раздел","new-view-text":"Новый вид","no-match-text":"Ничего не найдено","open-full-label":"Открыть на всю страницу","personal-layer-text":"Персональный","rare-text":"редкое","read-only-text":"Эту запись можно только смотреть","remove-field-text":"Убрать из области","remove-group-text":"Удалить область","remove-section-text":"Удалить раздел","rename-text":"Переименовать","required-error-text":"Заполните поле","reset-view-ask-text":"Сбросить весь вид?","reset-view-text":"Вернуть общий вид","save-failed-text":"Не удалось сохранить","save-name-text":"Сохранить название","save-text":"Сохранить","section-icon-text":"Значок раздела","sections-label":"Разделы","shared-layer-text":"Для всех","show-rare-text":"Показать редкие поля","shown-text":"Показывать","state-load-failed":"Не удалось загрузить запись","state-loading":"Загрузка записи","state-port-not-connected":"Порт записи не подключён","state-unavailable":"Запись недоступна","unplaced-hint-text":"Поля, которые этот вид не показывает. Перетащите поле в группу или нажмите на глаз, чтобы показать.","unplaced-title":"Скрытые поля","variant-text":"Вид","view-conflict-text":"Вид изменился, он перезагружен","view-denied-text":"Нет права менять этот слой","view-profile-label":"Вид","view-reset-failed-text":"Не удалось сбросить вид","view-save-failed-text":"Не удалось сохранить вид","width-text":"На всю ширину","view-published-text":"Сохранено для всех","view-changed-text":"Вид изменился","save-as-mine-text":"Сохранить как моё","save-as-mine-label-text":"{name} (моё)","publish-view-text":"Сохранить для всех","undo-mine-text":"Отменить мои правки","tab-rename-text":"Название…","tab-icon-text":"Значок…","tab-up-text":"Выше","tab-down-text":"Ниже","tab-hide-text":"Скрыть вкладку","tab-show-text":"Показать вкладку","tab-delete-text":"Удалить вкладку…","tab-menu-text":"Настройки вкладки «{name}»","tab-hidden-text":"Вкладка скрыта","tabs-title":"Вкладки","tabs-hint-text":"Перетащите за ручку, чтобы поменять порядок","add-tab-text":"Вкладка","new-tab-group-title":"Поля","lock-text":"Закрыть для изменений","unlock-text":"Открыть для изменений","locked-text":"Закрыто администратором","field-menu-text":"Настройки поля «{name}»","head-subtitle-on-text":"Показать в шапке","head-subtitle-off-text":"Убрать из шапки","head-status-on-text":"Стадией в шапке","head-status-off-text":"Убрать стадию из шапки","to-tab-text":"На вкладку «{name}»","hide-field-text":"Скрыть «{name}»","show-field-text":"Показать «{name}»","configure-personal-hint-text":"«Сохранить» — только для вас. Общий вид меняет администратор.","configure-admin-hint-text":"«Сохранить» — только для вас, «Сохранить для всех» — для всех.","configure-required-hint-text":"Вид обязательный. Правки видны до ухода со страницы.","new-field-text":"Новое поле…","view-refused-invalid-text":"Вид не сохранён: настройки не подходят","view-refused-shared-denied-text":"Нет права настраивать вид для всех","view-refused-own-text":"Это личный вид, а не вид для всех","view-refused-unknown-text":"Такого вида больше нет","view-refused-required-text":"У этой карточки обязательный вид: его нельзя менять или заменить","view-refused-lock-invalid-text":"Эту настройку нельзя закрыть","view-refused-head-invalid-text":"В заголовке не больше двух полей, а статус — поле со списком значений","view-refused-icon-invalid-text":"Неизвестный значок вкладки","own-view-text":"Мой вид"}}');

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
/******/ 	let __webpack_exports__ = __webpack_require__("7623a90f1816");
/******/
/******/ })()
;